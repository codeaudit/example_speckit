"use client";

import { useState } from "react";
import Link from "next/link";
import LoanForm from "@/components/loan-form";
import CustomerSelect from "@/components/customer-select";

export default function ApplyPage() {
  const [showForm, setShowForm] = useState(true);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [prefillName, setPrefillName] = useState("");
  const [prefillEmail, setPrefillEmail] = useState("");

  function handleCustomerSelect(customer: {
    fullName: string;
    email: string;
  }) {
    setPrefillName(customer.fullName);
    setPrefillEmail(customer.email);
  }

  function handleSuccess(data: { referenceNumber: string }) {
    setReferenceNumber(data.referenceNumber);
    setShowForm(false);
  }

  function handleReset() {
    setReferenceNumber("");
    setPrefillName("");
    setPrefillEmail("");
    setShowForm(true);
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Apply for a Mortgage Loan</h1>

      {showForm ? (
        <div className="mx-auto max-w-2xl space-y-4">
          <CustomerSelect onSelect={handleCustomerSelect} />
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <LoanForm
              onSuccess={handleSuccess}
              prefillName={prefillName}
              prefillEmail={prefillEmail}
            />
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-md rounded-lg border border-green-200 bg-green-50 p-8 text-center shadow-sm dark:bg-green-900/20 dark:border-green-800">
          <div className="mb-4 text-4xl text-green-600 dark:text-green-400">&#10003;</div>
          <h2 className="mb-2 text-xl font-semibold text-green-800 dark:text-green-200">
            Application Submitted!
          </h2>
          <p className="mb-4 text-sm text-green-700 dark:text-green-300">
            Your application has been received and is being reviewed.
          </p>
          <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">Your Reference Number:</p>
          <p className="mb-6 text-2xl font-bold tracking-wide text-gray-900 dark:text-gray-100">
            {referenceNumber}
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleReset}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Submit Another Application
            </button>
            <Link
              href="/status"
              className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Check Status
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
