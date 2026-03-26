import Link from "next/link";
import CustomerDetail from "@/components/customer-detail";
import CustomerApplications from "@/components/customer-applications";
import type { Customer } from "@/types";

interface CustomerViewProps {
  customer: Customer;
  backLinkHref: string;
  backLinkLabel: string;
  showReviewLink?: boolean;
}

export default function CustomerView({
  customer,
  backLinkHref,
  backLinkLabel,
  showReviewLink = false,
}: CustomerViewProps) {
  return (
    <div className="space-y-8">
      <div>
        <Link
          href={backLinkHref}
          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          &larr; {backLinkLabel}
        </Link>
      </div>

      <h1 className="text-2xl font-bold dark:text-gray-100">
        {customer.fullName}
      </h1>

      <CustomerDetail customer={customer} />

      <div>
        <h2 className="mb-4 text-lg font-semibold dark:text-gray-100">
          Loan Applications
        </h2>
        <CustomerApplications
          customerId={customer.id}
          showReviewLink={showReviewLink}
          emptyMessage="No loan applications for this customer."
        />
      </div>
    </div>
  );
}
