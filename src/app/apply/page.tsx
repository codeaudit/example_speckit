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
      <h1 className="mb-6 text-2xl font-bold font-headline text-on-surface">Apply for a Mortgage Loan</h1>

      {showForm ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form — 8 cols */}
          <div className="lg:col-span-8 space-y-4">
            <CustomerSelect onSelect={handleCustomerSelect} />
            <div className="rounded-xl bg-surface-container-lowest overflow-hidden">
              <div className="p-6">
                <LoanForm
                  onSuccess={handleSuccess}
                  prefillName={prefillName}
                  prefillEmail={prefillEmail}
                />
              </div>
            </div>
          </div>

          {/* Secure Verification sidebar — 4 cols */}
          <div className="lg:col-span-4">
            <div className="signature-gradient rounded-xl p-6 text-on-primary sticky top-8">
              <div className="flex items-start gap-3 mb-4">
                <span className="material-symbols-outlined text-tertiary-fixed text-2xl flex-shrink-0">lock</span>
                <h2 className="text-lg font-bold font-headline">Your Data is Secured</h2>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm text-on-primary/90">
                  <span className="material-symbols-outlined text-tertiary-fixed text-base flex-shrink-0 mt-0.5">check_circle</span>
                  AES-256 encryption protects all submitted data end-to-end.
                </li>
                <li className="flex items-start gap-2 text-sm text-on-primary/90">
                  <span className="material-symbols-outlined text-tertiary-fixed text-base flex-shrink-0 mt-0.5">check_circle</span>
                  Your information is never sold or shared with third parties.
                </li>
                <li className="flex items-start gap-2 text-sm text-on-primary/90">
                  <span className="material-symbols-outlined text-tertiary-fixed text-base flex-shrink-0 mt-0.5">check_circle</span>
                  FDIC-insured partner institutions handle all loan processing.
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-md rounded-xl bg-surface-container-lowest p-8 text-center">
          <div className="mb-4 w-12 h-12 mx-auto rounded-full bg-green-100 flex items-center justify-center">
            <span className="material-symbols-outlined text-green-700 text-2xl">check_circle</span>
          </div>
          <h2 className="mb-2 text-xl font-semibold font-headline text-on-surface">
            Application Submitted!
          </h2>
          <p className="mb-4 text-sm text-on-surface-variant">
            Your application has been received and is being reviewed.
          </p>
          <p className="mb-1 text-sm text-on-surface-variant">Your Reference Number:</p>
          <p className="mb-6 text-2xl font-bold tracking-wide text-on-surface">
            {referenceNumber}
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleReset}
              className="signature-gradient rounded-xl px-6 py-3 text-sm font-semibold text-on-primary hover:opacity-90 transition-opacity"
            >
              Submit Another Application
            </button>
            <Link
              href="/status"
              className="text-sm font-medium text-primary hover:text-primary-container"
            >
              Check Status
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
