import React from "react";

export default function UrlList({ urls, activeIndex, onSelect }) {
  if (!urls?.length) {
    return <div className="empty">No URLs yet. Upload a file or import a sheet.</div>;
  }

  return (
    <div className="list">
      {urls.map((u, idx) => (
        <button
          key={`${u}-${idx}`}
          className={`listItem ${idx === activeIndex ? "active" : ""}`}
          onClick={() => onSelect(idx)}
          title={u}
        >
          <div className="listIndex">{idx + 1}</div>
          <div className="listUrl">{u}</div>
        </button>
      ))}
    </div>
  );
}

