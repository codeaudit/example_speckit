import type { Customer } from "@/types";

interface CustomerDetailProps {
  customer: Customer;
}

export default function CustomerDetail({ customer }: CustomerDetailProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/50">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {customer.fullName}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{customer.email}</p>
      </div>

      <dl className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="grid grid-cols-3 gap-4 px-6 py-4">
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</dt>
          <dd className="col-span-2 text-sm text-gray-900 dark:text-gray-200">
            {customer.fullName}
          </dd>
        </div>
        <div className="grid grid-cols-3 gap-4 px-6 py-4">
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
          <dd className="col-span-2 text-sm text-gray-900 dark:text-gray-200">
            {customer.email}
          </dd>
        </div>
        <div className="grid grid-cols-3 gap-4 px-6 py-4">
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</dt>
          <dd className="col-span-2 text-sm text-gray-900 dark:text-gray-200">
            {customer.phone}
          </dd>
        </div>
        <div className="grid grid-cols-3 gap-4 px-6 py-4">
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</dt>
          <dd className="col-span-2 text-sm text-gray-900 dark:text-gray-200">
            {customer.street}
            <br />
            {customer.city}, {customer.state} {customer.zipCode}
          </dd>
        </div>
      </dl>
    </div>
  );
}
