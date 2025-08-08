// src/App.js
// This file creates the overall page layout (gray background, centered white card).

import React, { useState } from 'react';
import LoanPurposeSelector from './components/LoanPurposeSelector';
// We will add other components here later
// import LoanAmountInput from './components/LoanAmountInput';
// import ResultDisplay from './components/ResultDisplay';

export default function App() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        purpose: 'debt_consolidation',
        // other fields will be here
    });

    const handleNext = (data) => {
        setFormData(prevData => ({ ...prevData, ...data }));
        setStep(prevStep => prevStep + 1);
    };
    
    // In a real multi-step form, we would use a switch statement here
    // For now, we are just showing the first step.

    return (
        // These classes create the main layout:
        // - bg-gray-50: Light gray background
        // - min-h-screen: Full screen height
        // - flex items-center justify-center: Vertically and horizontally centers the content
        <main className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
            
            {/* These classes create the white card in the middle: */}
            {/* - w-full max-w-lg: Sets the width and a max-width */}
            {/* - p-8: Adds padding inside the card */}
            {/* - bg-white: White background color */}
            {/* - rounded-xl shadow-md: Creates rounded corners and a subtle shadow */}
            <div className="w-full max-w-lg p-8 bg-white rounded-xl shadow-md">
                
                {/* We will render the correct step here. For now, it's always LoanPurposeSelector */}
                <LoanPurposeSelector onNext={handleNext} />

            </div>
        </main>
    );
}