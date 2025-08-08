// src/components/Header.js
import React from "react";

export default function Header() {
  return (
    <header className="w-full bg-[#0e2a3b]">
      <div className="mx-auto max-w-6xl h-14 flex items-center justify-center px-4">
        <a
          href="/"
          className="flex items-center gap-2 select-none"
          aria-label="Go to LoanLens home"
        >
          {/* Lens icon */}
          <svg
            width="26" height="26" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
          >
            <circle cx="11" cy="11" r="6.5" stroke="#34d399" strokeWidth="2"/>
            <path d="M15.5 15.5L21 21" stroke="#34d399" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="text-white text-2xl font-semibold tracking-tight">
            LoanLens
          </span>
        </a>
      </div>
    </header>
  );
}
