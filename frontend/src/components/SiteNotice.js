// src/components/SiteNotice.js
import React, { useState } from "react";

export default function SiteNotice() {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  return (
    <div className="w-full bg-amber-50 border-b border-amber-200">
      <div className="mx-auto max-w-6xl px-4 py-2 text-sm text-amber-900 flex items-center gap-3">
        <span className="inline-block rounded-full w-2 h-2 bg-amber-500" />
        <p className="flex-1">
          This site is a <b>portfolio/demo</b>. No personal data is stored or shared.
          Calculations are illustrative and not financial advice.
        </p>
        <button
          className="px-2 py-1 rounded hover:bg-amber-100"
          onClick={() => setOpen(false)}
          aria-label="Dismiss notice"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
