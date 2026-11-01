"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body
        style={{
          background: "#050505",
          color: "#fafafa",
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontFamily: "system-ui, sans-serif",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 420 }}>
          <AlertTriangle size={48} color="#e63946" />
          <h1 style={{ marginTop: 20, fontSize: 28 }}>Titan Fitness hit a snag</h1>
          <p style={{ color: "#8b8b8b", marginTop: 8 }}>
            {error.message || "A critical error interrupted the app."}
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: 24,
              padding: "10px 18px",
              borderRadius: 12,
              border: "none",
              background: "#e63946",
              color: "white",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <RotateCcw size={16} style={{ verticalAlign: "-3px", marginRight: 8 }} />
            Reload app
          </button>
        </div>
      </body>
    </html>
  );
}
