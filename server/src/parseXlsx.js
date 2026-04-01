import * as XLSX from "xlsx";
import { extractUrlsFromCells } from "./urlExtract.js";

export function extractUrlsFromXlsxBuffer(buffer) {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const firstSheetName = workbook.SheetNames?.[0];
  if (!firstSheetName) return [];

  const sheet = workbook.Sheets[firstSheetName];
  // header:1 => 2D array of cell values
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false });
  return extractUrlsFromCells(rows);
}

