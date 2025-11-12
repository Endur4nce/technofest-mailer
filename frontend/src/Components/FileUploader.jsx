import React, { useState } from "react";

export default function FileUploader({ onFileSelected, onUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    onFileSelected(file);
  };

  return (
    <div className="space-y-4">
      {/* Кастомный file input */}
      <div className="flex flex-col items-center">
        <input
          id="fileInput"
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
          className="hidden"
        />

        <label
          htmlFor="fileInput"
          className="w-full text-center cursor-pointer border-2 border-dashed border-gray-400 rounded-lg p-4 hover:bg-gray-50 transition"
        >
          {selectedFile ? (
            <span className="text-gray-700">
              ✅ Выбран файл: <b>{selectedFile.name}</b>
            </span>
          ) : (
            <span className="text-gray-500">📂 Нажмите, чтобы выбрать Excel-файл</span>
          )}
        </label>
      </div>

      {/* Кнопка загрузки */}
      <button
        onClick={onUpload}
        disabled={!selectedFile}
        className={`w-full py-2 rounded-lg text-white font-medium transition ${
          selectedFile
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Загрузить файл
      </button>
    </div>
  );
}
