import type { Customer } from "@/types";

interface CustomerDetailProps {
  customer: Customer;
}

export default function CustomerDetail({ customer }: CustomerDetailProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border-default bg-bg-page">
      <div className="border-b border-border-default bg-bg-section px-6 py-4">
        <h2 className="text-lg font-semibold text-text-primary">
          {customer.fullName}
        </h2>
        <p className="text-sm text-text-muted">{customer.email}</p>
      </div>

      <dl className="divide-y divide-border-default">
        <div className="grid grid-cols-3 gap-4 px-6 py-4">
          <dt className="text-sm font-medium text-text-muted">Full Name</dt>
          <dd className="col-span-2 text-sm text-text-primary">
            {customer.fullName}
          </dd>
        </div>
        <div className="grid grid-cols-3 gap-4 px-6 py-4">
          <dt className="text-sm font-medium text-text-muted">Email</dt>
          <dd className="col-span-2 text-sm text-text-primary">
            {customer.email}
          </dd>
        </div>
        <div className="grid grid-cols-3 gap-4 px-6 py-4">
          <dt className="text-sm font-medium text-text-muted">Phone</dt>
          <dd className="col-span-2 text-sm text-text-primary">
            {customer.phone}
          </dd>
        </div>
        <div className="grid grid-cols-3 gap-4 px-6 py-4">
          <dt className="text-sm font-medium text-text-muted">Address</dt>
          <dd className="col-span-2 text-sm text-text-primary">
            {customer.street}
            <br />
            {customer.city}, {customer.state} {customer.zipCode}
          </dd>
        </div>
      </dl>
    </div>
  );
}
