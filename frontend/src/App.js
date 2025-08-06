// src/App.js

import React, { useState } from "react";
import axios from "axios";

function App() {
  // initialize form state
  const [form, setForm] = useState({
    on_time_rate: 1,
    utilization_rate: 0,
    oldest_account_months: 0,
    recent_inquiries: 0,
    num_account_types: 1,
    desired_loan_term: 12,
  });
  // store API response
  const [result, setResult] = useState(null);

  // handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: parseFloat(value) }));
  };

  // call predict endpoint
  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/predict", form);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching prediction");
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h1>Loan Approval Predictor</h1>

      {/* Payment History */}
      <label>On-Time Rate: {form.on_time_rate}</label>
      <input
        type="range"
        name="on_time_rate"
        min="0"
        max="1"
        step="0.01"
        value={form.on_time_rate}
        onChange={handleChange}
      />

      {/* Utilization */}
      <label>Utilization Rate: {form.utilization_rate}</label>
      <input
        type="range"
        name="utilization_rate"
        min="0"
        max="1"
        step="0.01"
        value={form.utilization_rate}
        onChange={handleChange}
      />

      {/* Credit History Length */}
      <label>
        Oldest Account (months):
        <input
          type="number"
          name="oldest_account_months"
          value={form.oldest_account_months}
          onChange={handleChange}
        />
      </label>

      {/* New Credit */}
      <label>
        Recent Inquiries:
        <input
          type="number"
          name="recent_inquiries"
          value={form.recent_inquiries}
          onChange={handleChange}
        />
      </label>

      {/* Credit Mix */}
      <label>
        Account Types:
        <input
          type="number"
          name="num_account_types"
          min="1"
          max="5"
          value={form.num_account_types}
          onChange={handleChange}
        />
      </label>

      {/* Desired Loan Term */}
      <label>
        Desired Loan Term (months):
        <input
          type="number"
          name="desired_loan_term"
          value={form.desired_loan_term}
          onChange={handleChange}
        />
      </label>

      <button onClick={handleSubmit} style={{ marginTop: 20 }}>
        Predict Approval
      </button>

      {result && (
        <div style={{ marginTop: 30 }}>
          <h2>Estimated Credit Score: {result.credit_score}</h2>
          <h3>Recommendations</h3>
          <ul>
            {result.recommendations.map((r) => (
              <li key={r.product}>
                <strong>{r.product}</strong>:{" "}
                {(r.approval_probability * 100).toFixed(1)}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
