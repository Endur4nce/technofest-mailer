import axios from "axios";

const BASE_URL = "http://localhost:5199/api/File";

export async function uploadExcel(file) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axios.post(`${BASE_URL}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function getEmails(fileName, sheetName) {
  const response = await axios.post(`${BASE_URL}/emails`, { fileName, sheetName });
  return response.data;
}

export async function sendEmails(recipients, message) {
  const res = await fetch("http://localhost:5199/api/File/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ recipients, message }),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}
