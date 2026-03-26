import { notFound } from "next/navigation";
import CustomerView from "@/components/customer-view";
import { getCustomer } from "@/lib/customers";

export default async function OfficerCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await getCustomer(parseInt(id, 10));

  if (!customer) {
    notFound();
  }

  return (
    <CustomerView
      customer={customer}
      backLinkHref="/officer"
      backLinkLabel="Back to Customer List"
      showReviewLink={true}
    />
  );
}
