import OfficerCustomerList from "@/components/officer-customer-list";

export default function OfficerPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-brand-primary">
        Officer Review — Customers
      </h1>
      <OfficerCustomerList />
    </div>
  );
}
