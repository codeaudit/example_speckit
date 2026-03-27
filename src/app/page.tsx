import Link from "next/link";

const cards = [
  {
    title: "Apply for a Loan",
    description:
      "Submit a new mortgage loan application. Get pre-qualified in minutes.",
    href: "/apply",
  },
  {
    title: "Check Application Status",
    description:
      "Look up your application using your reference number to see its current status.",
    href: "/status",
  },
  {
    title: "Customer Directory",
    description:
      "Browse the customer directory to view profiles and contact details.",
    href: "/customers",
  },
  {
    title: "Review Applications",
    description:
      "Loan officer portal to review pending applications and make approval decisions.",
    href: "/officer",
  },
];

export default function HomePage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold font-headline text-on-surface">Welcome to LoanPro</h1>
      <p className="mb-8 text-on-surface-variant">
        Mortgage loan processing made simple.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="block rounded-xl bg-surface-container-lowest p-6 transition hover:bg-surface-container-low"
          >
            <h2 className="mb-2 text-lg font-semibold font-headline text-on-surface">{card.title}</h2>
            <p className="text-sm text-on-surface-variant">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
