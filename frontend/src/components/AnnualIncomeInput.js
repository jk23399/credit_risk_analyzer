import React from "react";
import { FaLock, FaRegCheckCircle } from "react-icons/fa";

export default function AnnualIncomeInput({ onNext, onBack, defaultValue = 50000 }) {
  const MIN = 10000;
  const MAX = 300000;
  const STEP = 1000;

  const [income, setIncome] = React.useState(
    Math.min(Math.max(defaultValue, MIN), MAX)
  );

  const fmt = (n) =>
    n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  const handleContinue = () => onNext?.({ annual_inc: income });

  return (
    <div className="w-full">
      {/* progress bar */}
      <div className="h-1.5 w-full bg-gray-200 rounded-full mb-6">
        <div className="h-full w-3/4 bg-emerald-500 rounded-full" />
      </div>

      <p className="text-sm font-semibold tracking-widest text-emerald-600 text-center">
        PERSONAL LOAN
      </p>
      <h1 className="text-3xl sm:text-5xl font-extrabold text-center text-gray-900 mt-2">
        What's your annual income?
      </h1>

      <div className="mt-6 text-center text-4xl sm:text-5xl font-bold text-gray-900">
        {fmt(income)}
      </div>

      {/* slider */}
      <div className="mt-6">
        <input
          type="range"
          min={MIN}
          max={MAX}
          step={STEP}
          value={income}
          onChange={(e) => setIncome(parseInt(e.target.value, 10))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between mt-2 text-gray-600">
          <span>{fmt(MIN)}</span>
          <span>{fmt(MAX)}</span>
        </div>
      </div>

      {/* actions */}
      <div className="mt-8 flex flex-col items-center gap-3">
        <button
          onClick={handleContinue}
          className="w-full rounded-full bg-blue-700 px-6 py-4 text-white font-semibold text-lg hover:bg-blue-800 transition"
        >
          Continue
        </button>
        {onBack && (
          <button
            onClick={onBack}
            className="text-sm text-gray-500 hover:underline"
          >
            Back
          </button>
        )}
      </div>

      {/* badges */}
      <div className="mt-6 space-y-2 text-gray-700">
        <div className="flex items-center gap-2">
          <FaLock /> <span>Your information is securely encrypted</span>
        </div>
        <div className="flex items-center gap-2">
          <FaRegCheckCircle /> <span>No impact to your credit score</span>
        </div>
      </div>
    </div>
  );
}
