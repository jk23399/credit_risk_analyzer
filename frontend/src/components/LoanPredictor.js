// src/components/LoanPredictor.js
// Interest rate + approval flow tester (standalone form)

import React, { useState } from 'react';

export default function LoanPredictor() {
  // State for user inputs with default values
  const [loanAmnt, setLoanAmnt] = useState('15000');
  const [term, setTerm] = useState('36');
  const [annualInc, setAnnualInc] = useState('80000');
  const [ficoScore, setFicoScore] = useState('750');
  const [purpose, setPurpose] = useState('debt_consolidation');

  // State for API results and loading status
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Normalize purpose:
  // - If value already starts with "purpose_", strip it.
  // - Backend will add "purpose_" prefix itself.
  const normalizePurpose = (p) => (p.startsWith('purpose_') ? p.replace(/^purpose_/, '') : p);

  const toInt = (v, def = 0) => {
    const n = parseInt(String(v), 10);
    return Number.isFinite(n) ? n : def;
  };

  // Submit
// Submit
const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loanAmnt || !term || !annualInc || !ficoScore) return;
    setIsLoading(true);
    setResult(null);
  
    const payload = {
      loan_amnt: toInt(loanAmnt, 0),
      term: toInt(term, 36),
      annual_inc: toInt(annualInc, 0),
      fico_score: toInt(ficoScore, 0),
      purpose: normalizePurpose(purpose),
    };
  
    try {
      const resp = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data?.error || `Server error (${resp.status})`);
      }
      setResult(data);
    } catch (err) {
      console.error('Error fetching prediction:', err);
      setResult({ error: 'Failed to connect to the prediction server. Is the backend running?' });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <section className="py-20 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto p-8 border rounded-lg shadow-lg bg-white">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Loan Interest & Approval Tester</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Loan Amount */}
          <div>
            <label htmlFor="loanAmnt" className="block text-sm font-medium text-gray-700">Loan Amount ($)</label>
            <input
              type="number" id="loanAmnt" value={loanAmnt}
              onChange={(e) => setLoanAmnt(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Loan Term */}
          <div>
            <label htmlFor="term" className="block text-sm font-medium text-gray-700">Loan Term</label>
            <select
              id="term" value={term} onChange={(e) => setTerm(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="12">12 months</option>
              <option value="24">24 months</option>
              <option value="36">36 months</option>
              <option value="48">48 months</option>
              <option value="60">60 months</option>
            </select>
          </div>

          {/* Annual Income */}
          <div>
            <label htmlFor="annualInc" className="block text-sm font-medium text-gray-700">Annual Income ($)</label>
            <input
              type="number" id="annualInc" value={annualInc}
              onChange={(e) => setAnnualInc(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* FICO Score */}
          <div>
            <label htmlFor="ficoScore" className="block text-sm font-medium text-gray-700">Estimated FICO Credit Score</label>
            <input
              type="number" id="ficoScore" value={ficoScore}
              onChange={(e) => setFicoScore(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Loan Purpose */}
          <div>
            <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">Loan Purpose</label>
            <select
              id="purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="debt_consolidation">Debt Consolidation</option>
              <option value="credit_card">Credit Card Refinance</option>
              <option value="major_purchase">Major Purchase</option>
              <option value="home_improvement">Home Improvement</option>
              <option value="small_business">Business</option>
              <option value="moving">Moving</option>
              <option value="medical">Medical</option>
              <option value="house">House</option>
              <option value="renewable_energy">Renewable Energy</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button
            type="submit" disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
          >
            {isLoading ? 'Calculating...' : 'Get Decision'}
          </button>
        </form>

        {/* Result */}
        {result && (
          <div className="mt-8 p-6 border-2 rounded-lg text-center bg-gray-50">
            <h3 className="text-xl font-bold mb-2 text-gray-800">Decision</h3>

            {/* Network / server error */}
            {'error' in result ? (
              <p className="text-red-600 font-semibold">{result.error}</p>
            ) : result.status === 'Rejected' ? (
              <>
                <p className="text-3xl font-bold text-red-600">Rejected</p>
                {typeof result.approval_probability === 'number' && (
                  <p className="mt-2 text-gray-700">
                    Approval probability: <b>{(result.approval_probability * 100).toFixed(1)}%</b>
                  </p>
                )}
                {result.reason && <p className="mt-1 text-gray-600">{result.reason}</p>}
              </>
            ) : (
              <>
                <p className="text-3xl font-bold text-emerald-600">Approved</p>
                {typeof result.approval_probability === 'number' && (
                  <p className="mt-2 text-gray-700">
                    Approval probability: <b>{(result.approval_probability * 100).toFixed(1)}%</b>
                  </p>
                )}
                {'predicted_interest_rate' in result && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Predicted Interest Rate</p>
                    <p className="text-4xl font-bold text-indigo-700">{result.predicted_interest_rate}%</p>
                  </div>
                )}
                <div className="mt-4 text-gray-700">
                  <p>Loan Amount: <b>${(result.loan_amount ?? toInt(loanAmnt)).toLocaleString()}</b></p>
                  <p>Term: <b>{result.term ?? toInt(term)} months</b></p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
