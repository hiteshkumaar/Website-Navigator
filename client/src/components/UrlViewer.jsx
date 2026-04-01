import React from "react";

export default function UrlViewer({ url }) {
  if (!url) {
    return (
      <div className="viewerEmpty">
        <div className="viewerEmptyTitle">No website selected</div>
        <div className="viewerEmptySub">Import URLs, then click one or use Next/Previous.</div>
      </div>
    );
  }

  return (
    <div className="viewer">
      <iframe
        key={url}
        title="Website Preview"
        src={url}
        className="iframe"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

