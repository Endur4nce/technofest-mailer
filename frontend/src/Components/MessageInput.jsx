import React from "react";

export default function MessageInput({ message, setMessage }) {
  return (
    <textarea
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="Введите текст письма..."
      className="w-full h-32 border p-2 rounded resize-none mt-4"
    />
  );
}
