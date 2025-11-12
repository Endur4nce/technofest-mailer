import React, { useState } from "react";
import { uploadExcel, getEmails, sendEmails } from "./api/fileApi";
import FileUploader from "./components/FileUploader";
import SheetSelector from "./components/SheetSelector";
import EmailList from "./components/EmailList";
import MessageInput from "./components/MessageInput";
import SendButton from "./Components/SendButton";

export default function App() {
  const [file, setFile] = useState(null);
  const [sheets, setSheets] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState("");
  const [emails, setEmails] = useState([]);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) return alert("Выберите файл");
    const data = await uploadExcel(file);
    setSheets(data.sheets);
    setSelectedSheet(data.sheets[0] || "");
    setEmails([]);
  };

  const handleSheetSelect = async (sheet) => {
    setSelectedSheet(sheet);
    const emailList = await getEmails(file.name, sheet);
    setEmails(emailList);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-lg space-y-4">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          📊 Рассылка по Excel
        </h1>

        <FileUploader onFileSelected={setFile} onUpload={handleUpload} />
        <SheetSelector
          sheets={sheets}
          selectedSheet={selectedSheet}
          onSelect={handleSheetSelect}
        />
        {emails.length > 0 && (
          <>
            <MessageInput message={message} setMessage={setMessage} />
            <EmailList emails={emails} />
            <SendButton
            onSend={async () => {
              try {
                await sendEmails(emails, message);
                alert("Рассылка успешно выполнена!");
              } catch (err) {
                alert("Ошибка при отправке: " + err.message);
              }
            }}
            disabled={!message || emails.length === 0}
          />
          </>
        )}
      </div>
    </div>
  );
}
