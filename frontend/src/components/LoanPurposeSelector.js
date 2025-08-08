// src/components/LoanPurposeSelector.js
import React from 'react';
import { FaWallet, FaCreditCard, FaShoppingBag, FaHome, FaBuilding, FaChevronDown, FaTruck, FaMedkit, FaHouseDamage, FaLeaf } from 'react-icons/fa';

export default function LoanPurposeSelector({ onNext }) {
  // 메인 옵션 (차트 상위 항목들)
  const primary = [
    { key: 'purpose_debt_consolidation', text: 'Debt Consolidation', icon: <FaWallet size={18} /> },
    { key: 'purpose_credit_card',        text: 'Credit Card Refinance', icon: <FaCreditCard size={18} /> },
    { key: 'purpose_major_purchase',     text: 'Major Purchase', icon: <FaShoppingBag size={18} /> },
    { key: 'purpose_home_improvement',   text: 'Home Improvement', icon: <FaHome size={18} /> },
    { key: 'purpose_small_business',     text: 'Business', icon: <FaBuilding size={18} /> },
  ];

  // More Options (차트에 있던 나머지)
  const more = [
    { key: 'purpose_moving',            text: 'Moving', icon: <FaTruck size={18} /> },
    { key: 'purpose_medical',           text: 'Medical', icon: <FaMedkit size={18} /> },
    { key: 'purpose_house',             text: 'House', icon: <FaHouseDamage size={18} /> },
    { key: 'purpose_renewable_energy',  text: 'Renewable Energy', icon: <FaLeaf size={18} /> },
    { key: 'purpose_other',             text: 'Other', icon: <FaLeaf size={18} /> },
  ];

  const [showMore, setShowMore] = React.useState(false);
  const handleSelect = (v) => onNext({ purpose: v });

  const Btn = ({ item }) => (
    <button
      onClick={() => handleSelect(item.key)}
      className="w-full flex items-center gap-3 rounded-md border border-gray-200 bg-white px-4 py-4 text-left
                 hover:shadow-sm hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition"
    >
      <span className="inline-flex p-2 rounded-md bg-teal-50 text-teal-700">{item.icon}</span>
      <span className="font-medium text-gray-800">{item.text}</span>
    </button>
  );

  return (
    <div className="w-full">
      <h1 className="text-4xl sm:text-4xl font-extrabold leading-tight text-center text-gray-900">
        Try our loan approval <br /> prediction demo.
      </h1>
      <p className="text-base sm:text-lg text-center mt-3 mb-6 text-gray-600">
        This tool is for educational purposes only.
      </p>

      <div className="space-y-3">
        {primary.map((o) => <Btn key={o.key} item={o} />)}

        {/* More Options toggle */}
        <button
          type="button"
          onClick={() => setShowMore((s) => !s)}
          className="w-full flex items-center justify-between rounded-md border border-gray-200 bg-white px-4 py-4
                     hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition"
          aria-expanded={showMore}
        >
          <span className="font-medium text-gray-800">More Options</span>
          <FaChevronDown className={`${showMore ? 'rotate-180' : ''} transition`} />
        </button>

        {showMore && more.map((o) => <Btn key={o.key} item={o} />)}
      </div>

      <footer className="mt-6 text-center text-sm text-gray-500">
        Privacy Secured | Advertising Disclosures
      </footer>
    </div>
  );
}
