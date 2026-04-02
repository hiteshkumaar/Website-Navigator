import axios from "axios";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/g, "");

export async function parseUpload(file) {
  const form = new FormData();
  form.append("file", file);
  const { data } = await axios.post(`${API_BASE_URL}/api/parse/upload`, form, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
}

export async function parseGoogleSheet(url) {
  const { data } = await axios.post(`${API_BASE_URL}/api/parse/google-sheet`, { url });
  return data;
}
