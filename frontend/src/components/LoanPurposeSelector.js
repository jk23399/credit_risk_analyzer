// src/components/LoanPurposeSelector.js
// This component designs the buttons and their vertical alignment.

import React from 'react';
import { FaWallet, FaCreditCard, FaShoppingBag, FaHome, FaBuilding } from 'react-icons/fa';

export default function LoanPurposeSelector({ onNext }) {

    const purposeOptions = [
        { key: 'debt_consolidation', text: 'Debt Consolidation', icon: <FaWallet size={22} /> },
        { key: 'credit_card', text: 'Credit Card Refinance', icon: <FaCreditCard size={22} /> },
        { key: 'major_purchase', text: 'Major Purchase', icon: <FaShoppingBag size={22} /> },
        { key: 'home_improvement', text: 'Home Improvement', icon: <FaHome size={22} /> },
        { key: 'business', text: 'Business', icon: <FaBuilding size={22} /> },
    ];

    const handleSelect = (selectedPurpose) => {
        onNext({ purpose: selectedPurpose });
    };

    return (
        <div className="w-full">
            <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800">
                Get cash in a lump sum. Repay monthly.
            </h1>
            
            <h2 className="text-md sm:text-lg text-center mt-3 mb-6 text-gray-600">
                What do you plan on using the personal loan for?
            </h2>

            {/* This div with 'space-y-3' creates the vertical spacing between buttons */}
            <div className="space-y-3">
                {purposeOptions.map((option) => (
                    <button 
                        key={option.key}
                        onClick={() => handleSelect(option.key)}
                        // These classes are CRITICAL for the button's look and feel
                        className="w-full flex items-center p-4 border rounded-lg text-gray-700 bg-white hover:border-blue-500 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
                    >
                        {/* Icon Container with color */}
                        <div className="mr-4 text-teal-500">
                            {option.icon}
                        </div>
                        {/* Text */}
                        <span className="font-semibold text-base sm:text-lg">{option.text}</span>
                    </button>
                ))}
            </div>
            
             <div className="text-center mt-6">
                <a href="#" className="font-semibold text-blue-600 hover:underline">
                    More Options
                </a>
             </div>
        </div>
    );
}