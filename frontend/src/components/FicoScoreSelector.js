// src/components/FicoScoreSelector.js
import React, { useState } from 'react';

const RANGES = {
  excellent: { label: 'Excellent (800–850)', min: 800, max: 850, default: 825 },
  verygood:  { label: 'Very Good (740–799)', min: 740, max: 799, default: 770 },
  good:      { label: 'Good (670–739)',     min: 670, max: 739, default: 705 },
  fair:      { label: 'Fair (580–669)',     min: 580, max: 669, default: 625 },
  poor:      { label: 'Poor (300–579)',     min: 300, max: 579, default: 515 },
};

export default function FicoScoreSelector({ onNext, onBack }) {
  const [active, setActive] = useState('fair');
  const [score, setScore] = useState(RANGES['fair'].default);

  const pickRange = (key) => {
    setActive(key);
    setScore(RANGES[key].default);
  };

  const submit = () => onNext({ fico_score: Number(score) });

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">
        What’s your estimated credit score?
      </h1>

      {/* Quick range buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
        {Object.entries(RANGES).map(([key, cfg]) => (
          <button
            key={key}
            type="button"
            onClick={() => pickRange(key)}
            className={`w-full text-left px-4 py-3 rounded-lg border transition
              ${active === key ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-400'}`}
          >
            {cfg.label}
          </button>
        ))}
      </div>

      {/* Fine tune slider */}
      <div className="mt-8">
        <label className="block text-sm text-gray-600 mb-2">
          Adjust within range ({RANGES[active].min}–{RANGES[active].max})
        </label>
        <input
          type="range"
          min={RANGES[active].min}
          max={RANGES[active].max}
          value={score}
          onChange={(e) => setScore(parseInt(e.target.value, 10))}
          className="w-full"
        />
        <div className="mt-2 text-center">
          <span className="text-lg font-semibold">{score}</span>
        </div>
      </div>

      {/* Nav */}
      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={submit}
          className="px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
