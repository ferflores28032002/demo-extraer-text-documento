import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import PizZip from "pizzip";

const jsonData = {
  headers: [
    "RMU",
    "25903210210XICU730206165AEN",
    "54716210210XSFA801001162AEN",
    "54716210210XSFA801001164AEN",
    "54716210210XSFA801001163AEN",
  ],
  rows: [
    ["Enero / January", "327", "1211", "410", "506"],
    ["Febrero / February", "316", "1219", "399", "523"],
    ["Marzo / March", "341", "1326", "416", "638"],
    ["Abril / April", "153", "710", "546", "322"],
    ["Mayo / May", "193", "899", "307", "385"],
    ["Junio / June", "339", "1216", "411", "417"],
    ["Julio / July", "379", "1000", "374", "331"],
    ["Agosto / August", "336", "574", "237", "240"],
    ["Septiembre / September", "315", "644", "206", "258"],
    ["Octubre / October", "335", "534", "124", "211"],
    ["Noviembre / November", "334", "940", "302", "343"],
    ["Diciembre / December", "236", "648", "214", "207"],
    [
      "Total (IRECs por año)Total (IRECs per year)",
      "3,605",
      "10,920",
      "3,947",
      "4,382",
    ],
  ],
};

// Función para transponer los datos
const transpose = (matrix:any) => {
  return matrix[0].map((_:any, colIndex:any) => matrix.map((row:any) => row[colIndex]));
};

const GenerateWordButton = () => {
  const generateDocument = async () => {
    try {
      // Cargar la plantilla DOCX como un array buffer
      const response = await fetch("/fixed_dynamic_template.docx");
      const content = await response.arrayBuffer();

      // Inicializar PizZip y Docxtemplater
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      // Transponer los datos de filas a columnas para generar la tabla correctamente
      const transposedRows = transpose(jsonData.rows);

      // Asignar los datos del JSON al documento
      doc.setData({
        headers: jsonData.headers,
        rows: transposedRows,
      });

      // Renderizar el documento
      doc.render();

      // Generar el archivo Word y convertirlo a blob
      const out = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      // Guardar el archivo usando file-saver
      saveAs(out, "output.docx");
    } catch (error) {
      console.error("Error al generar el documento:", error);
    }
  };

  return <button className="button-example" onClick={generateDocument}>Generar y Descargar Word</button>;
};

export default GenerateWordButton;
