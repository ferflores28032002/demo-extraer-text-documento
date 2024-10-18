import mammoth from "mammoth";
import { useState } from "react";

interface ExtractedData {
  table?: {
    headers: string[];
    rows: string[][];
  };
  textAfterTable?: string;
}

interface UseWordExtractorProps {
  keywords: string[];
}

const useWordExtractor = ({ keywords }: UseWordExtractorProps) => {
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const extractFromFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e: ProgressEvent<FileReader>) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const result = await mammoth.convertToHtml({ arrayBuffer });
        const html = result.value;

        // Buscar la referencia en el array de palabras clave
        const foundIndex = searchForKeywords(html, keywords);
        if (foundIndex !== -1) {
          // Extraer la tabla y el texto asociado
          const data = extractDataFromHtml(html, foundIndex);
          if (data) {
            setExtractedData(data);
          } else {
            setError("No se encontró la tabla o el texto después de las palabras clave.");
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

  const searchForKeywords = (html: string, keywords: string[]): number => {
    for (let keyword of keywords) {
      const index = html.indexOf(keyword);
      if (index !== -1) {
        return index;
      }
    }
    return -1;
  };

  const extractDataFromHtml = (
    html: string,
    startIndex: number
  ): ExtractedData | null => {
    const tableStart = html.indexOf("<table", startIndex);
    const tableEnd = html.indexOf("</table>", tableStart) + 8; // 8 para incluir '</table>'
    const tableHtml = html.slice(tableStart, tableEnd);

    // Crear un elemento temporal para manipular el HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = tableHtml;
    const tableElement = tempDiv.querySelector("table");

    let tableData = null;

    if (tableElement) {
      let headers: string[] = [];
      const rows: string[][] = [];

      // Extraer encabezados
      const headerElements = tableElement.querySelectorAll("thead tr th");
      if (headerElements.length > 0) {
        headerElements.forEach((header) => {
          headers.push(header.textContent || "");
        });
      }

      // Extraer filas
      const rowElements = tableElement.querySelectorAll("tbody tr");
      rowElements.forEach((row) => {
        const cells: string[] = [];
        const cellElements = row.querySelectorAll("td");
        cellElements.forEach((cell) => {
          cells.push(cell.textContent || "");
        });
        rows.push(cells);
      });

      // Si no hay headers, usamos el primer elemento de rows como headers
      if (headers.length === 0 && rows.length > 0) {
        headers = rows[0]; // El primer elemento de rows se convierte en headers
        rows.shift(); // Eliminamos el primer elemento de rows
      }

      tableData = {
        headers,
        rows,
      };
    }

    // Extraer el texto después de la tabla
    const textStart = tableEnd; // Comenzamos justo después de la tabla
    const textEnd = html.indexOf("<table", textStart); // Buscar el próximo bloque grande o tabla
    let textAfterTable = "";

    if (textEnd === -1) {
      // Si no hay más tablas, extraer hasta el final
      textAfterTable = html.slice(textStart).trim();
    } else {
      // Si hay otra tabla, extraer solo el texto antes de la siguiente tabla
      textAfterTable = html.slice(textStart, textEnd).trim();
    }

    // Limpiar etiquetas HTML innecesarias
    textAfterTable = textAfterTable.replace(/<\/?[^>]+(>|$)/g, ""); // Eliminar etiquetas HTML

    return {
      table: tableData || undefined,
      textAfterTable: textAfterTable || undefined,
    };
  };

  return { extractFromFile, extractedData, error , setError};
};

export default useWordExtractor;
