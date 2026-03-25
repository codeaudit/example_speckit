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
      <h1 className="mb-2 text-2xl font-bold">Welcome to LoanPro</h1>
      <p className="mb-8 text-gray-600 dark:text-gray-400">
        Mortgage loan processing made simple.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600"
          >
            <h2 className="mb-2 text-lg font-semibold dark:text-gray-100">{card.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
