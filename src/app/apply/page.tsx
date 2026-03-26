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
          <div className="rounded-lg border border-border-default bg-bg-page p-6 shadow-sm">
            <LoanForm
              onSuccess={handleSuccess}
              prefillName={prefillName}
              prefillEmail={prefillEmail}
            />
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-md animate-fade-in-up rounded-lg border border-status-approved bg-status-approved-bg p-8 text-center shadow-sm">
          <div className="mb-4 text-4xl text-status-approved">&#10003;</div>
          <h2 className="mb-2 text-xl font-semibold text-status-approved">
            Application Submitted!
          </h2>
          <p className="mb-4 text-sm text-status-approved">
            Your application has been received and is being reviewed.
          </p>
          <p className="mb-1 text-sm text-text-muted">Your Reference Number:</p>
          <p className="mb-6 text-2xl font-bold tracking-wide text-text-primary">
            {referenceNumber}
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleReset}
              className="rounded-md bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-brand-interactive hover:shadow-md active:scale-[0.98] active:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-interactive"
            >
              Submit Another Application
            </button>
            <Link
              href="/status"
              className="text-sm font-medium text-brand-primary hover:text-brand-interactive"
            >
              Check Status
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
