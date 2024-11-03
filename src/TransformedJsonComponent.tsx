import React from "react";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { saveAs } from "file-saver";
import { parseCompData } from "./utils/parseCompData";

// Datos de entrada originales
const jsonData = {
  headers: ["Inciso", "Concepto", "Precio", "Unidad", "Actualización", "Pago"],
  rows: [
    ["I.", "Energía Consumida", "40.00", "USD por MWh", "CPI", "Mensual"],
    ["II.", "Potencia Base", "6.11", "USD por kW-mes", "CPI", "Mensual"],
    ["III.", "CELs", "12.00", "USD por CEL", "CPI", "Mensual"],
    ["IV.", "Servicio Ammper", "3.00", "USD por MWh", "CPI", "Mensual"],
    ["V.", "Congestión", "70.00", "MXN por MWh", "INPC", "Mensual"],
    [
      "VI.",
      "Productos Asociados",
      "Passthrough",
      "MXN por MWh",
      "NA",
      "Mensual",
    ],
    [
      "VII.",
      "Tarifas Reguladas",
      "Passthrough",
      "MXN por MWh",
      "NA",
      "Mensual",
    ],
    [
      "VIII.",
      "Servicios de Conexión",
      "6% de la cotización por los Equipos de Medición",
      "NA",
      "Pago Único",
    ],
  ],
};

// Componente para generar y descargar el documento Word
const GenerateWordButton: React.FC = () => {
  const generateDocument = async () => {
    const transformedData = parseCompData(jsonData);

    try {
      // Cargar la plantilla DOCX como un array buffer
      const response = await fetch("/fixed_dynamic_template.docx"); // Ruta de tu template
      const content = await response.arrayBuffer();

      // Inicializar PizZip y Docxtemplater
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      // Asignar los datos del JSON al documento
      doc.setData({ compensations: transformedData });

      // Renderizar el documento
      doc.render();

      // Generar el archivo Word y convertirlo a blob
      const out = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      // Descargar el documento usando file-saver
      saveAs(out, "output.docx");
    } catch (error) {
      console.error("Error al generar el documento:", error);
    }
  };

  return (
    <div>
      <button onClick={generateDocument}>Generar y Descargar Word</button>
    </div>
  );
};

export default GenerateWordButton;
