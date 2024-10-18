"use client"

import { FileText, Upload } from "lucide-react"
import React, { useState } from "react"
import useWordExtractor from "./useWordExtractor"

const predefinedKeywords = [
  "CENTROS DE CARGA ",
  "PRODUCTOS CONTRATADOS",
  "IRECs Contratados / Contracted IRECs",
  "CONTRAPRESTACIÓN",
  "Potencia Base (MW por año) / Base Capacity (MW per year):",
]

export default function Component() {
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { extractFromFile, extractedData, error } = useWordExtractor({
    keywords: selectedKeyword ? [selectedKeyword] : [],
  })

  const handleKeywordSelect = (keyword: string) => {
    setSelectedKeyword(keyword === selectedKeyword ? null : keyword)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleAnalyze = () => {
    if (selectedFile) {
      extractFromFile(selectedFile)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4  ">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-[#e74038] p-6 text-white">
          <h1 className="text-3xl font-bold text-center">
            Extractor de Palabras Clave en Word
          </h1>
        </div>
        <div className="p-8">
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-[#e74038] mb-4">
                Seleccionar palabra clave a buscar:
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {predefinedKeywords.map((keyword) => (
                  <div
                    key={keyword}
                    className="flex items-center space-x-2"
                  >
                    <div className="relative">
                      <input
                        type="radio"
                        id={keyword}
                        checked={selectedKeyword === keyword}
                        onChange={() => handleKeywordSelect(keyword)}
                        className="form-radio h-5 w-5 opacity-0 absolute z-10 cursor-pointer"
                      />
                      <div className="w-5 h-5 border-2 border-[#e74038] rounded-full flex items-center justify-center bg-white">
                        {selectedKeyword === keyword && (
                          <div className="w-3 h-3 bg-[#e74038] rounded-full" />
                        )}
                      </div>
                    </div>
                    <label htmlFor={keyword} className="text-gray-700 cursor-pointer">
                      {keyword}
                    </label>
                  </div>
                ))}
              </div>
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
                <label
                  htmlFor="file-input"
                  className="flex items-center justify-center w-full px-4 py-6 text-[#e74038] bg-red-50 rounded-lg cursor-pointer hover:bg-red-100 transition duration-300 border-2 border-dashed border-[#e74038]"
                >
                  <Upload size={24} className="mr-2" />
                  Seleccionar archivo .docx
                </label>
              </div>
              {selectedFile && (
                <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-md">
                  <div className="flex items-center">
                    <FileText size={20} className="text-[#e74038] mr-2" />
                    <span className="text-gray-700 font-medium">
                      {selectedFile.name}
                    </span>
                  </div>
                  <button
                    onClick={handleAnalyze}
                    className="bg-[#e74038] text-white px-4 py-2 rounded-lg hover:bg-[#c8362f] transition duration-300"
                  >
                    Analizar
                  </button>
                </div>
              )}
            </div>
          </div>

          {error && (
            <p className="text-red-500 mt-4 text-center">
              {error}
            </p>
          )}

          {extractedData && (
            <div className="mt-8 space-y-6">
              {extractedData.table && (
                <div>
                  <h3 className="text-2xl font-semibold text-[#e74038] mb-3">
                    Tabla Extraída:
                  </h3>
                  <div className="bg-white p-4 rounded-lg shadow-inner ">
                    <pre className="text-sm text-gray-700">
                      {JSON.stringify(extractedData.table, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}