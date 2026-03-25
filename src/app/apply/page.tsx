"use client";

import { useState } from "react";
import Link from "next/link";
import LoanForm from "@/components/loan-form";

export default function ApplyPage() {
  const [showForm, setShowForm] = useState(true);
  const [referenceNumber, setReferenceNumber] = useState("");

  function handleSuccess(data: { referenceNumber: string }) {
    setReferenceNumber(data.referenceNumber);
    setShowForm(false);
  }

  function handleReset() {
    setReferenceNumber("");
    setShowForm(true);
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Apply for a Mortgage Loan</h1>

      {showForm ? (
        <div className="mx-auto max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <LoanForm onSuccess={handleSuccess} />
        </div>
      ) : (
        <div className="mx-auto max-w-md rounded-lg border border-green-200 bg-green-50 p-8 text-center shadow-sm">
          <div className="mb-4 text-4xl text-green-600">&#10003;</div>
          <h2 className="mb-2 text-xl font-semibold text-green-800">
            Application Submitted!
          </h2>
          <p className="mb-4 text-sm text-green-700">
            Your application has been received and is being reviewed.
          </p>
          <p className="mb-1 text-sm text-gray-600">Your Reference Number:</p>
          <p className="mb-6 text-2xl font-bold tracking-wide text-gray-900">
            {referenceNumber}
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleReset}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Submit Another Application
            </button>
            <Link
              href="/status"
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Check Status
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
