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
      <div className="mb-10">
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-text-primary">
          Welcome to LoanPro
        </h1>
        <p className="text-lg text-text-muted">
          Mortgage loan processing made simple. Apply, track, and manage
          loans with confidence.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="block rounded-lg border border-l-2 border-border-default border-l-transparent bg-bg-page p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-border-default hover:border-l-brand-primary"
          >
            <h2 className="mb-2 text-lg font-semibold">{card.title}</h2>
            <p className="text-sm text-text-muted">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
