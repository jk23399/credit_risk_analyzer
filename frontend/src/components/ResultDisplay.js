// src/components/ResultDisplay.js
import React from "react";

export default function ResultDisplay({ result, onRestart }) {
  if (!result) {
    return (
      <div className="text-center text-gray-600">
        Calculating your result...
      </div>
    );
  }

  const isRejected =
    result.status === "Rejected" || result.approved === false || result.error;

  return (
    <div className="w-full text-center">
      {isRejected ? (
        <>
          <h1 className="text-3xl font-bold text-red-600 mb-4">Sorry</h1>
          <p className="text-lg text-gray-700 mb-4">
            We couldn’t find a suitable loan offer for you at this time.
          </p>
          {result.reason && (
            <p className="text-sm text-gray-500 mb-2">{result.reason}</p>
          )}
          {typeof result.approval_probability === "number" && (
            <p className="text-sm text-gray-500">
              Approval probability:{" "}
              <b>{(result.approval_probability * 100).toFixed(1)}%</b>
            </p>
          )}
          <button
            onClick={onRestart}
            className="mt-6 px-6 py-3 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition"
          >
            Try Again
          </button>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-emerald-600 mb-4">
            Congratulations!
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            You’ve been approved for a loan.
          </p>

          <div className="bg-gray-50 border rounded-lg p-6 text-left max-w-md mx-auto mb-6">
            <p className="mb-2">
              <span className="font-semibold">Loan Amount:</span>{" "}
              ${Number(result.loan_amount ?? 0).toLocaleString()}
            </p>
            {"predicted_interest_rate" in result && (
              <p className="mb-2">
                <span className="font-semibold">Interest Rate:</span>{" "}
                {result.predicted_interest_rate}% APR
              </p>
            )}
            <p className="mb-2">
              <span className="font-semibold">Term:</span>{" "}
              {result.term} months
            </p>
            {typeof result.approval_probability === "number" && (
              <p className="text-sm text-gray-500">
                Approval probability:{" "}
                <b>{(result.approval_probability * 100).toFixed(1)}%</b>
              </p>
            )}
          </div>

          <button
            onClick={onRestart}
            className="mt-2 px-6 py-3 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition"
          >
            Start Over
          </button>
        </>
      )}
    </div>
  );
}
