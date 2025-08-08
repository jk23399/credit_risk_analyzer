import React from "react";
import { FaLock, FaRegCheckCircle } from "react-icons/fa";

export default function LoanTermSelector({ onNext, onBack }) {
  const termOptions = [
    { key: 12, text: "12 Months" },
    { key: 24, text: "24 Months" },
    { key: 36, text: "36 Months" },
    { key: 48, text: "48 Months" },
    { key: 60, text: "60 Months" },
  ];

  const handleSelect = (term) => onNext({ term });

  return (
    <div className="w-full">
      {/* progress bar */}
      <div className="h-1.5 w-full bg-gray-200 rounded-full mb-6">
        <div className="h-full w-5/6 bg-emerald-500 rounded-full" />
      </div>

      <p className="text-sm font-semibold tracking-widest text-emerald-600 text-center">
        PERSONAL LOAN
      </p>
      <h1 className="text-3xl sm:text-5xl font-extrabold text-center text-gray-900 mt-2">
        Choose your desired loan term
      </h1>

      <div className="mt-6 space-y-3">
        {termOptions.map((option) => (
          <button
            key={option.key}
            onClick={() => handleSelect(option.key)}
            className="w-full flex items-center gap-3 rounded-md border border-gray-200 bg-white px-4 py-4 text-left
                       hover:shadow-sm hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition"
          >
            <span className="font-medium text-gray-800">{option.text}</span>
          </button>
        ))}
      </div>

      {/* badges */}
      <div className="mt-6 space-y-2 text-gray-700">
        <div className="flex items-center gap-2">
          <FaLock /> <span>Your information is securely encrypted</span>
        </div>
        <div className="flex items-center gap-2">
          <FaRegCheckCircle /> <span>No impact to your credit score</span>
        </div>
      </div>ㅁ

      {onBack && (
        <div className="mt-4">
          <button
            onClick={onBack}
            className="text-sm text-gray-500 hover:underline"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}
