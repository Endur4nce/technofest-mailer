import React from "react";

export default function SheetSelector({ sheets, selectedSheet, onSelect }) {
  if (!sheets.length) return null;

  return (
    <div>
      <label className="block mb-2 font-medium text-gray-700">
        Выберите лист:
      </label>
      <select
        className="w-full border rounded-lg p-2"
        value={selectedSheet}
        onChange={(e) => onSelect(e.target.value)}
      >
        {sheets.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>
    </div>
  );
}
