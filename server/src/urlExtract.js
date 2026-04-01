const URL_LIKE = /\b((https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,})(\/[^\s]*)?\b/i;

export function extractUrlsFromCells(rows) {
  if (!Array.isArray(rows)) return [];
  const urls = [];

  for (const row of rows) {
    if (!row) continue;
    const cells = Array.isArray(row) ? row : Object.values(row);
    for (const cell of cells) {
      const value = String(cell ?? "").trim();
      if (!value) continue;

      // Split common separators (in case multiple urls in one cell)
      const parts = value.split(/[\s,;]+/g).filter(Boolean);
      for (const part of parts) {
        const candidate = part.trim();
        if (!candidate) continue;
        if (URL_LIKE.test(candidate)) urls.push(candidate);
      }
    }
  }
  return urls;
}

export function normalizeAndDedupeUrls(rawUrls) {
  const out = [];
  const seen = new Set();

  for (const raw of rawUrls || []) {
    let u = String(raw ?? "").trim();
    if (!u) continue;
    u = u.replace(/^"+|"+$/g, ""); // trim surrounding quotes

    if (!/^https?:\/\//i.test(u)) {
      // If it looks like a domain, default to https
      u = `https://${u.replace(/^\/+/, "")}`;
    }

    let parsed;
    try {
      parsed = new URL(u);
    } catch {
      continue;
    }

    // Basic cleanup
    parsed.hash = "";
    const normalized = parsed.toString();
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    out.push(normalized);
  }

  return out;
}

export function toGoogleSheetCsvExportUrl(inputUrl) {
  const u = String(inputUrl ?? "").trim();
  if (!u) return null;

  // If already an export link with format=csv, accept it
  try {
    const parsed = new URL(u);
    if (parsed.hostname.includes("docs.google.com") && parsed.pathname.includes("/spreadsheets/d/")) {
      if (parsed.pathname.includes("/export")) {
        const format = parsed.searchParams.get("format");
        if (format && format.toLowerCase() === "csv") return parsed.toString();
      }

      // Convert common share link => export CSV link
      const match = parsed.pathname.match(/\/spreadsheets\/d\/([^/]+)/i);
      const sheetId = match?.[1];
      if (!sheetId) return null;

      // Try to preserve gid if present, otherwise default to first sheet (gid=0).
      const gid =
        parsed.searchParams.get("gid") ||
        parsed.hash?.match(/gid=(\d+)/)?.[1] ||
        "0";

      const exportUrl = new URL(`https://docs.google.com/spreadsheets/d/${sheetId}/export`);
      exportUrl.searchParams.set("format", "csv");
      exportUrl.searchParams.set("gid", gid);
      return exportUrl.toString();
    }
  } catch {
    return null;
  }

  return null;
}

