import React, { useRef, useState } from "react";

export default function ImportPanel({ onUpload, onGoogleSheet, loading }) {
  const inputRef = useRef(null);
  const [sheetUrl, setSheetUrl] = useState("");

  function pickFile() {
    inputRef.current?.click();
  }

  async function onFileChange(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    await onUpload(file);
  }

  async function onImportSheet(e) {
    e.preventDefault();
    if (!sheetUrl.trim()) return;
    await onGoogleSheet(sheetUrl.trim());
  }

  return (
    <div className="card">
      <div className="cardTitle">Import</div>

      <div className="row">
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          style={{ display: "none" }}
          onChange={onFileChange}
        />
        <button className="btn btnPrimary" onClick={pickFile} disabled={loading}>
          Upload Excel/CSV
        </button>
        <div className="smallMuted">Supports .xlsx, .xls, .csv</div>
      </div>

      <div className="divider" />

      <form className="row" onSubmit={onImportSheet}>
        <input
          className="input"
          placeholder="Paste a Google Sheets URL (public)"
          value={sheetUrl}
          onChange={(e) => setSheetUrl(e.target.value)}
          disabled={loading}
        />
        <button className="btn" type="submit" disabled={loading || !sheetUrl.trim()}>
          Import Sheet
        </button>
      </form>

      <div className="smallMuted">
        Tip: best results with a CSV export URL like <code>.../export?format=csv&amp;gid=0</code>
      </div>
    </div>
  );
}

