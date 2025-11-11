import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [file, setFile] = useState(null);
  const [sheets, setSheets] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Выберите Excel-файл перед загрузкой!");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5199/api/File/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const { sheets } = response.data;
      setSheets(sheets);
      setSelectedSheet(sheets[0] || "");
    } catch (error) {
      alert("Ошибка при загрузке файла: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
          📊 Загрузка Excel-файла
        </h1>

        {/* Выбор файла */}
        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
          className="block w-full border border-gray-300 rounded-lg p-2 mb-4 text-sm"
        />

        {/* Кнопка загрузки */}
        <button
          onClick={handleUpload}
          disabled={isLoading}
          className={`w-full py-2 rounded-lg text-white font-medium transition ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? "Загрузка..." : "Загрузить файл"}
        </button>

        {/* Выпадающий список листов */}
        {sheets.length > 0 && (
          <div className="mt-6">
            <label className="block mb-2 font-medium text-gray-700">
              Выберите лист:
            </label>
            <select
              value={selectedSheet}
              onChange={(e) => setSelectedSheet(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm"
            >
              {sheets.map((sheet) => (
                <option key={sheet} value={sheet}>
                  {sheet}
                </option>
              ))}
            </select>

            <div className="mt-4 text-center text-sm text-gray-700">
              Текущий лист: <b>{selectedSheet}</b>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
