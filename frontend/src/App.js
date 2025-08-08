// src/App.js
import React, { useState } from 'react';
import Header from './components/Header';
import SiteNotice from './components/SiteNotice';
import LoanPurposeSelector from './components/LoanPurposeSelector';
import LoanAmountInput from './components/LoanAmountInput';
import FicoScoreSelector from './components/FicoScoreSelector';
import AnnualIncomeInput from './components/AnnualIncomeInput';
import LoanTermSelector from './components/LoanTermSelector';
import ResultDisplay from './components/ResultDisplay';

export default function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    purpose: 'purpose_debt_consolidation',
    loan_amnt: 1000,
    fico_score: 700,
    annual_inc: 50000,
    term: 36,
  });
  const [result, setResult] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  // Vercel/Render 배포 환경에서는 환경 변수를 사용하고,
  // 로컬 개발 환경에서는 기존의 localhost 주소를 사용합니다.
  const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

  const normalizePurpose = (p) => (p || 'other').replace(/^purpose_/, '');
  const toInt = (v, d = 0) => {
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : d;
  };

  async function submitForDecision(finalData) {
    setLoading(true);
    setErr(null);
    setResult(null);

    const payload = {
      loan_amnt: toInt(finalData.loan_amnt, 0),
      term: toInt(finalData.term, 36),
      annual_inc: toInt(finalData.annual_inc, 0),
      fico_score: toInt(finalData.fico_score, 0),
      purpose: normalizePurpose(finalData.purpose),
    };
    console.log('[submit] payload →', payload);

    try {
      const resp = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const text = await resp.text();
      console.log('[submit] status', resp.status, 'raw', text);
      const data = (() => { try { return JSON.parse(text); } catch { return { error: 'Invalid JSON', raw: text }; } })();
      if (!resp.ok) throw new Error(data?.error || `Server ${resp.status}`);

      setResult(data);
    } catch (e) {
      console.error(e);
      setErr(e.message || 'Request failed');
      setResult({ error: 'Failed to connect to the prediction server.' });
    } finally {
      setLoading(false);
      setStep(6);
    }
  }

  const handleNext = (data) => {
    const merged = { ...formData, ...data };
    setFormData(merged);

    if (step === 5) {
      submitForDecision(merged);
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  const handleRestart = () => {
    setFormData({
      purpose: 'purpose_debt_consolidation',
      loan_amnt: 1000,
      fico_score: 700,
      annual_inc: 50000,
      term: 36,
    });
    setResult(null);
    setErr(null);
    setLoading(false);
    setStep(1);
  };

  const renderStep = () => {
    if (loading && step === 6) {
      return <div className="text-center text-gray-700">Calculating…</div>;
    }

    switch (step) {
      case 1:
        return <LoanPurposeSelector onNext={handleNext} />;
      case 2:
        return (
          <LoanAmountInput
            defaultValue={formData.loan_amnt}
            onNext={(d) => handleNext({ loan_amnt: d.loan_amnt ?? d })}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <FicoScoreSelector
            onNext={(d) => handleNext({ fico_score: d.fico_score ?? d })}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <AnnualIncomeInput
            defaultValue={formData.annual_inc}
            onNext={(d) => handleNext({ annual_inc: d.annual_inc ?? d })}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <LoanTermSelector
            onNext={(d) => handleNext({ term: d.term ?? d })}
            onBack={handleBack}
          />
        );
      case 6:
        return <ResultDisplay result={result} onRestart={handleRestart} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Header />
      <SiteNotice />

      <main className="bg-gray-50 min-h-[calc(100vh-56px)] flex items-center justify-center p-4">
        <div className="w-full max-w-2xl p-8 bg-white rounded-xl shadow-md">
          {err && (
            <div className="mb-4 border border-red-200 bg-red-50 p-3 text-red-700 rounded">
              {err}
            </div>
          )}
          {renderStep()}
        </div>
      </main>
    </>
  );
}
