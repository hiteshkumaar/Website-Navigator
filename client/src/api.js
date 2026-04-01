import axios from "axios";

export async function parseUpload(file) {
  const form = new FormData();
  form.append("file", file);
  const { data } = await axios.post("/api/parse/upload", form, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
}

export async function parseGoogleSheet(url) {
  const { data } = await axios.post("/api/parse/google-sheet", { url });
  return data;
}

