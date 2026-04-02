import express from "express";
import cors from "cors";
import multer from "multer";
import { z } from "zod";
import { extractUrlsFromXlsxBuffer } from "./parseXlsx.js";
import { extractUrlsFromCsvBuffer } from "./parseCsv.js";
import { normalizeAndDedupeUrls, toGoogleSheetCsvExportUrl } from "./urlExtract.js";

const app = express();
const corsOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: corsOrigins.length ? corsOrigins : true
  })
);
app.use(express.json({ limit: "2mb" }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/parse/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded (field name must be 'file')." });
    }

    const originalName = req.file.originalname || "upload";
    const lower = originalName.toLowerCase();
    const buf = req.file.buffer;

    let rawUrls = [];
    if (lower.endsWith(".csv")) {
      rawUrls = extractUrlsFromCsvBuffer(buf);
    } else if (lower.endsWith(".xlsx") || lower.endsWith(".xls")) {
      rawUrls = extractUrlsFromXlsxBuffer(buf);
    } else {
      return res.status(400).json({ error: "Unsupported file type. Upload .csv, .xlsx, or .xls." });
    }

    const urls = normalizeAndDedupeUrls(rawUrls);
    return res.json({ urls, source: { type: "upload", filename: originalName } });
  } catch (err) {
    return res.status(500).json({ error: "Failed to parse file.", details: String(err?.message ?? err) });
  }
});

app.post("/api/parse/google-sheet", async (req, res) => {
  try {
    const schema = z.object({ url: z.string().min(1) });
    const { url } = schema.parse(req.body);

    const exportUrl = toGoogleSheetCsvExportUrl(url);
    if (!exportUrl) {
      return res.status(400).json({
        error:
          "Could not convert this to a Google Sheets CSV export URL. Provide a public export link (format=csv) or a standard sheets URL."
      });
    }

    const response = await fetch(exportUrl, {
      headers: { "User-Agent": "website-navigator/1.0", Accept: "text/csv,*/*;q=0.8" }
    });
    if (!response.ok) {
      let bodySnippet = "";
      try {
        const text = await response.text();
        bodySnippet = text.slice(0, 500);
      } catch {
        bodySnippet = "";
      }
      return res.status(400).json({
        error: "Failed to fetch sheet CSV.",
        details: `${response.status} ${response.statusText}`,
        exportUrl,
        bodySnippet
      });
    }

    const arrayBuffer = await response.arrayBuffer();
    const buf = Buffer.from(arrayBuffer);
    const rawUrls = extractUrlsFromCsvBuffer(buf);
    const urls = normalizeAndDedupeUrls(rawUrls);
    return res.json({ urls, source: { type: "google-sheet", exportUrl } });
  } catch (err) {
    if (err?.name === "ZodError") {
      return res.status(400).json({ error: "Invalid request body.", details: err.errors });
    }
    return res.status(500).json({ error: "Failed to import Google Sheet.", details: String(err?.message ?? err) });
  }
});

const port = Number(process.env.PORT || 5050);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${port}`);
});
