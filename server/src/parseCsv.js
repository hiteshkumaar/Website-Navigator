import { parse } from "csv-parse/sync";
import { extractUrlsFromCells } from "./urlExtract.js";

export function extractUrlsFromCsvBuffer(buffer) {
  const text = buffer.toString("utf8");
  const records = parse(text, {
    relax_quotes: true,
    relax_column_count: true,
    skip_empty_lines: true
  });

  // records: array of rows; each row is array of strings
  return extractUrlsFromCells(records);
}

