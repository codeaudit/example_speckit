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
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
          Welcome to LoanPro
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Mortgage loan processing made simple. Apply, track, and manage
          loans with confidence.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="block rounded-lg border border-l-2 border-gray-200 border-l-transparent bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-gray-300 hover:border-l-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:border-l-transparent dark:hover:border-gray-600 dark:hover:border-l-blue-400 dark:hover:shadow-gray-900/50"
          >
            <h2 className="mb-2 text-lg font-semibold dark:text-gray-100">{card.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
