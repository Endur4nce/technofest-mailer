import React from "react";

export default function SendButton({ onSend, disabled }) {
  return (
    <button
      onClick={onSend}
      disabled={disabled}
      className={`w-full py-2 rounded-lg text-white font-medium transition ${
        disabled
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-green-600 hover:bg-green-700"
      }`}
    >
      Отправить рассылку
    </button>
  );
}
