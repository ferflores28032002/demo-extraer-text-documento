import WordTableExtractor from "./WordTableExtractor";



const App = () => {
  // const { extractFromFile, extractedData } = useWordExtractor({
  //   keywords: predefinedKeywords[0],
  // });

  return (
    <div>
      {/* <TransformedJsonComponent /> */}
      <WordTableExtractor/>

      {/* <DynamicTable tableName="Contraprestaciones" data={jsonData} />
      <DynamicTable tableName="Centros de Carga" data={jsonData2} />
      <DynamicTable tableName="Productos Contratados" data={jsonData3} />
      <DynamicTable tableName="Potencia Base por Año" data={jsonData4} /> */}
    </div>
  );
};

export default App;
