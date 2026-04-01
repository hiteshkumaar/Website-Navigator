import React, { useMemo, useState } from "react";
import { parseGoogleSheet, parseUpload } from "./api.js";
import ImportPanel from "./components/ImportPanel.jsx";
import UrlList from "./components/UrlList.jsx";
import UrlViewer from "./components/UrlViewer.jsx";

export default function App() {
  const [urls, setUrls] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [source, setSource] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const activeUrl = useMemo(() => urls[activeIndex] || "", [urls, activeIndex]);

  const canPrev = activeIndex > 0;
  const canNext = activeIndex < urls.length - 1;

  async function handleUpload(file) {
    setError("");
    setLoading(true);
    try {
      const result = await parseUpload(file);
      setUrls(result.urls || []);
      setActiveIndex(0);
      setSource(result.source || null);
    } catch (e) {
      setError(e?.response?.data?.error || e.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSheet(url) {
    setError("");
    setLoading(true);
    try {
      const result = await parseGoogleSheet(url);
      setUrls(result.urls || []);
      setActiveIndex(0);
      setSource(result.source || null);
    } catch (e) {
      setError(e?.response?.data?.error || e.message || "Import failed.");
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(index) {
    setActiveIndex(index);
  }

  function handlePrev() {
    setActiveIndex((i) => Math.max(0, i - 1));
  }

  function handleNext() {
    setActiveIndex((i) => Math.min(urls.length - 1, i + 1));
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="logo" aria-hidden="true" />
          <div>
            <div className="title">Website Navigator</div>
            <div className="subtitle">
              Upload Excel/CSV or import a public Google Sheet, then navigate with Previous/Next.
            </div>
          </div>
        </div>
        <div className="meta">
          {source?.type ? (
            <div className="pill" title={source?.exportUrl || source?.filename || ""}>
              Source: {source.type === "upload" ? source.filename : "Google Sheet"}
            </div>
          ) : (
            <div className="pill pill-muted">No data loaded</div>
          )}
          <div className="pill">{urls.length} URL{urls.length === 1 ? "" : "s"}</div>
        </div>
      </header>

      <main className="layout">
        <section className="left">
          <ImportPanel onUpload={handleUpload} onGoogleSheet={handleGoogleSheet} loading={loading} />
          {error ? <div className="error">{error}</div> : null}

          <div className="card">
            <div className="cardTitle">URL List</div>
            <UrlList urls={urls} activeIndex={activeIndex} onSelect={handleSelect} />
          </div>
        </section>

        <section className="right">
          <div className="navBar">
            <button className="btn" onClick={handlePrev} disabled={!canPrev}>
              Previous
            </button>
            <div className="counter">
              {urls.length ? (
                <>
                  <span className="counterStrong">{activeIndex + 1}</span> / {urls.length}
                </>
              ) : (
                <span className="counterMuted">Import URLs to start</span>
              )}
            </div>
            <button className="btn" onClick={handleNext} disabled={!canNext}>
              Next
            </button>
            <a className={`btn btnSecondary ${activeUrl ? "" : "disabled"}`} href={activeUrl || "#"} target="_blank" rel="noreferrer">
              Open in new tab
            </a>
          </div>

          <UrlViewer url={activeUrl} />
          <div className="hint">
            Some sites block iframes (X-Frame-Options/CSP). If the preview is blank, use “Open in new tab”.
          </div>
        </section>
      </main>
    </div>
  );
}

