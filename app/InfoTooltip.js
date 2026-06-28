"use client";
import { useState } from "react";

export default function InfoTooltip({ text }) {
  const [open, setOpen] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <button
        type="button"
        className="tooltip-btn"
        onClick={() => setOpen(!open)}
        aria-label="Ver definición"
      >
        ?
      </button>
      {open && (
        <div
          className="tooltip-box"
          style={{
            position: "absolute",
            top: "20px",
            left: "0",
            width: "240px",
            zIndex: 50,
          }}
        >
          {text}
        </div>
      )}
    </span>
  );
}