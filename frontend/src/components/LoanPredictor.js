// src/components/LoanPredictor.js
// This component contains all the logic for the interest rate calculator.

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

    // Helper function to map FICO score to the 'grade' number our model expects
    const getGradeFromFico = (score) => {
        if (score >= 740) return 7; // A
        if (score >= 670) return 6; // B
        if (score >= 580) return 5; // C
        // Add more mappings if needed based on your model
        return 4; // D
    };

    // Function to handle the form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setResult(null);

        // Prepare the data payload to send to our Flask API
        const userData = {
            loan_amnt: parseInt(loanAmnt),
            term: parseInt(term),
            annual_inc: parseInt(annualInc),
            fico_score: parseInt(ficoScore),
            purpose: purpose,
            grade: getGradeFromFico(parseInt(ficoScore))
        };

        try {
            // Make the API call to our Flask backend at port 5000
            const response = await fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();
            setResult(data);

        } catch (error) {
            console.error('Error fetching prediction:', error);
            setResult({ error: 'Failed to connect to the prediction server. Is the backend running?' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="py-20 px-4 bg-gray-50 min-h-screen">
            <div className="max-w-2xl mx-auto p-8 border rounded-lg shadow-lg bg-white">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Loan Interest Rate Estimator</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Loan Amount */}
                    <div>
                        <label htmlFor="loanAmnt" className="block text-sm font-medium text-gray-700">Loan Amount ($)</label>
                        <input type="number" id="loanAmnt" value={loanAmnt} onChange={(e) => setLoanAmnt(e.target.value)}
                               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                    </div>
                    
                    {/* Loan Term */}
                    <div>
                        <label htmlFor="term" className="block text-sm font-medium text-gray-700">Loan Term</label>
                        <select id="term" value={term} onChange={(e) => setTerm(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="36">36 months</option>
                            <option value="60">60 months</option>
                        </select>
                    </div>

                    {/* Annual Income */}
                    <div>
                        <label htmlFor="annualInc" className="block text-sm font-medium text-gray-700">Annual Income ($)</label>
                        <input type="number" id="annualInc" value={annualInc} onChange={(e) => setAnnualInc(e.target.value)}
                               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                    </div>
                    
                    {/* FICO Score */}
                    <div>
                        <label htmlFor="ficoScore" className="block text-sm font-medium text-gray-700">Estimated FICO Credit Score</label>
                        <input type="number" id="ficoScore" value={ficoScore} onChange={(e) => setFicoScore(e.target.value)}
                               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                    </div>

                    {/* Loan Purpose */}
                    <div>
                        <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">Loan Purpose</label>
                        <select id="purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="debt_consolidation">Debt Consolidation</option>
                            <option value="credit_card">Credit Card Refinancing</option>
                            <option value="home_improvement">Home Improvement</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <button type="submit" disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400">
                        {isLoading ? 'Calculating...' : 'Get Estimated Rate'}
                    </button>
                </form>

                {/* --- Display the result from the API --- */}
                {result && (
                    <div className="mt-8 p-6 border-2 rounded-lg text-center bg-gray-50">
                        <h3 className="text-xl font-bold mb-2 text-gray-800">Estimated Result</h3>
                        {result.error ? (
                             <p className="text-red-600 font-semibold">{result.error}</p>
                        ) : (
                             <p className="text-4xl font-bold text-indigo-700">
                                 {result.predicted_interest_rate}%
                             </p>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
