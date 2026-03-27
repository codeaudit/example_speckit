import type { Customer } from "@/types";

interface CustomerDetailProps {
  customer: Customer;
}

export default function CustomerDetail({ customer }: CustomerDetailProps) {
  return (
    <div className="overflow-hidden rounded-xl bg-surface-container-lowest">
      <div className="bg-surface-container-high px-6 py-4">
        <h2 className="text-lg font-semibold font-headline text-on-surface">
          {customer.fullName}
        </h2>
        <p className="text-sm text-on-surface-variant">{customer.email}</p>
      </div>

      <dl className="space-y-0">
        <div className="grid grid-cols-3 gap-4 px-6 py-4 hover:bg-surface-container-low transition-colors">
          <dt className="text-sm font-medium text-on-surface-variant">Full Name</dt>
          <dd className="col-span-2 text-sm text-on-surface">
            {customer.fullName}
          </dd>
        </div>
        <div className="grid grid-cols-3 gap-4 px-6 py-4 hover:bg-surface-container-low transition-colors">
          <dt className="text-sm font-medium text-on-surface-variant">Email</dt>
          <dd className="col-span-2 text-sm text-on-surface">
            {customer.email}
          </dd>
        </div>
        <div className="grid grid-cols-3 gap-4 px-6 py-4 hover:bg-surface-container-low transition-colors">
          <dt className="text-sm font-medium text-on-surface-variant">Phone</dt>
          <dd className="col-span-2 text-sm text-on-surface">
            {customer.phone}
          </dd>
        </div>
        <div className="grid grid-cols-3 gap-4 px-6 py-4 hover:bg-surface-container-low transition-colors">
          <dt className="text-sm font-medium text-on-surface-variant">Address</dt>
          <dd className="col-span-2 text-sm text-on-surface">
            {customer.street}
            <br />
            {customer.city}, {customer.state} {customer.zipCode}
          </dd>
        </div>
      </dl>
    </div>
  );
}
