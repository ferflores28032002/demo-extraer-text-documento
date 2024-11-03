import mammoth from "mammoth";
import { useState } from "react";

interface ExtractedData {
  table?: {
    headers: string[];
    rows: string[][];
  };
  textBeforeTable?: string[];
  textAfterTable?: string[];
}

interface UseWordExtractorProps {
  keywords: string[];
}

const useWordExtractor = ({ keywords }: UseWordExtractorProps) => {
  const [error, setError] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(
    null
  );

  const extractFromFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e: ProgressEvent<FileReader>) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const result = await mammoth.convertToHtml({ arrayBuffer });
        const html = result.value;
        // Buscar la referencia en el array de palabras clave
        const foundIndex = searchForKeywordsOutsideTable(html, keywords);
        if (foundIndex !== -1) {
          // Extraer la tabla y el texto asociado
          const data = extractDataFromHtml(html, foundIndex);
          if (data) {
            setExtractedData(data);
          } else {
            setError(
              "No se encontró la tabla o el texto después de las palabras clave."
            );
          }
        } else {
          setError("No se encontró ninguna de las palabras clave.");
        }
      } catch (error) {
        setError("Error al procesar el archivo.");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const searchForKeywordsOutsideTable = (
    html: string,
    keywords: string[]
  ): number => {
    for (let keyword of keywords) {
      let keywordIndex = html.indexOf(keyword);

      // Continuar buscando hasta encontrar la palabra clave fuera de una tabla
      while (keywordIndex !== -1) {
        const beforeKeyword = html.slice(0, keywordIndex);

        // Asegurarse de que no haya una etiqueta de tabla antes o después de la palabra clave
        const isOutsideTable =
          !beforeKeyword.includes("<table") ||
          beforeKeyword.lastIndexOf("<table") <
            beforeKeyword.lastIndexOf("</table>");

        if (isOutsideTable) {
          return keywordIndex;
        } else {
          // Buscar el siguiente índice de la palabra clave si está dentro de una tabla
          keywordIndex = html.indexOf(keyword, keywordIndex + 1);
        }
      }
    }
    return -1; // No se encontró la palabra clave fuera de una tabla
  };

  const extractDataFromHtml = (
    html: string,
    startIndex: number
  ): ExtractedData => {
    const tableStart = html.indexOf("<table", startIndex);
    const tableEnd = html.indexOf("</table>", tableStart) + 8; // 8 para incluir '</table>'
    const tableHtml = html.slice(tableStart, tableEnd);

    // Extraer los últimos 5 bloques de texto antes de la tabla como un array de párrafos
    const textBeforeMatches = Array.from(
      html
        .slice(0, startIndex)
        .matchAll(/<(h[1-6]|p|div|span)[^>]*>(.*?)<\/\1>/gi)
    );
    const textBeforeTable = textBeforeMatches.slice(-5).map((match) =>
      match[2]
        .replace(/<\/?[^>]+(>|$)/g, "") // Eliminar etiquetas HTML
        .trim()
    );

    // Crear un elemento temporal para manipular el HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = tableHtml;
    const tableElement = tempDiv.querySelector("table");

    let headers: string[] = [];
    const rows: string[][] = [];

    if (tableElement) {
      // Extraer encabezados
      const headerElements = tableElement.querySelectorAll("thead tr th");
      headerElements.forEach((header) => {
        headers.push(header.textContent || "");
      });

      // Extraer filas
      const rowElements = tableElement.querySelectorAll("tbody tr");
      rowElements.forEach((row) => {
        const cells: string[] = [];
        const cellElements = row.querySelectorAll("td");
        cellElements.forEach((cell) => {
          cells.push(cell.textContent || "");
        });

        // Agregar 'No existe' si las columnas no coinciden con los encabezados
        while (cells.length < headers.length) {
          cells.push("No existe");
        }

        rows.push(cells);
      });

      // Si no hay headers, usamos el primer elemento de rows como headers
      if (headers.length === 0 && rows.length > 0) {
        headers = rows[0];
        rows.shift();
      }
    }

    // Extraer los primeros 5 bloques de texto después de la tabla como un array de párrafos
    const textAfterMatches = Array.from(
      html.slice(tableEnd).matchAll(/<(h[1-6]|p|div|span)[^>]*>(.*?)<\/\1>/gi)
    );
    const textAfterTable = textAfterMatches.slice(0, 5).map((match) =>
      match[2]
        .replace(/<\/?[^>]+(>|$)/g, "") // Eliminar etiquetas HTML
        .trim()
    );
    return {
      table: {
        headers: headers.length ? headers : ["No hay elementos"],
        rows: rows.length ? rows : [["No se encontró elementos"]],
      },
      textBeforeTable,
      textAfterTable,
    };
  };

  return { extractFromFile, extractedData, error, setError };
};

export default useWordExtractor;
