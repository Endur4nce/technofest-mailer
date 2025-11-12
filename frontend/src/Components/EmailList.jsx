import React from "react";

export default function EmailList({ emails }) {
  if (!emails.length) return null;

  return (
    <div className="max-h-40 overflow-y-auto border rounded p-2 bg-gray-50 text-sm mt-2">
      {emails.map((email) => (
        <div key={email}>{email}</div>
      ))}
    </div>
  );
}
