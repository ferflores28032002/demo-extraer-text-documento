import { motion } from "framer-motion";
import { Plus, Upload, X, FileText } from "lucide-react";
import React, { useState } from "react";
import useWordExtractor from "./useWordExtractor";

export default function WordExtractorApp() {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { extractFromFile, extractedData, error } = useWordExtractor({
    keywords,
  });

  const handleAddKeyword = () => {
    if (newKeyword.trim() !== "") {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword("");
    }
  };

  const handleRemoveKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleAnalyze = () => {
    if (selectedFile) {
      extractFromFile(selectedFile);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden"
      >
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-8 text-center text-[#e74038]">
            Extractor de Palabras Clave en Word
          </h1>

          <div className="space-y-6">
            <div className="flex">
              <input
                type="text"
                className="flex-grow px-4 py-2 text-gray-700 bg-gray-100 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#e74038] transition duration-300"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="Añadir palabra clave..."
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#e74038] text-white px-6 py-2 rounded-r-lg hover:bg-[#c8362f] transition duration-300 flex items-center"
                onClick={handleAddKeyword}
              >
                <Plus size={20} className="mr-2" />
                Añadir
              </motion.button>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[#e74038] mb-3">Palabras clave a buscar:</h2>
              <motion.ul layout className="flex flex-wrap gap-2">
                {keywords.map((keyword, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="bg-red-100 px-4 py-2 rounded-full shadow-md flex items-center"
                  >
                    <span className="text-[#e74038]">{keyword}</span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="ml-2 text-[#e74038] hover:text-[#c8362f] transition duration-300"
                      onClick={() => handleRemoveKeyword(index)}
                    >
                      <X size={16} />
                    </motion.button>
                  </motion.li>
                ))}
              </motion.ul>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type="file"
                  id="file-input"
                  className="hidden"
                  accept=".docx"
                  onChange={handleFileUpload}
                />
                <motion.label
                  htmlFor="file-input"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center w-full px-4 py-3 text-[#e74038] bg-red-100 rounded-lg cursor-pointer hover:bg-red-200 transition duration-300"
                >
                  <Upload size={20} className="mr-2" />
                  Seleccionar archivo .docx
                </motion.label>
              </div>
              {selectedFile && (
                <div className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-lg">
                  <div className="flex items-center">
                    <FileText size={20} className="text-[#e74038] mr-2" />
                    <span className="text-gray-700">{selectedFile.name}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#e74038] text-white px-4 py-2 rounded-lg hover:bg-[#c8362f] transition duration-300"
                    onClick={handleAnalyze}
                  >
                    Analizar
                  </motion.button>
                </div>
              )}
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 mt-4"
            >
              {error}
            </motion.p>
          )}

          {extractedData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-8 space-y-6"
            >
              {extractedData.table && (
                <div>
                  <h3 className="text-2xl font-semibold text-[#e74038] mb-3">Tabla Extraída:</h3>
                  <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
                    {JSON.stringify(extractedData.table, null, 2)}
                  </pre>
                </div>
              )}
              {/* {extractedData.textAfterTable && (
                <div>
                  <h3 className="text-2xl font-semibold text-[#e74038] mb-3">Texto Después de la Tabla:</h3>
                  <p className="bg-gray-100 p-4 rounded-lg text-gray-800">
                    {extractedData.textAfterTable}
                  </p>
                </div>
              )} */}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}