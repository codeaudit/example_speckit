import Link from "next/link";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className="bg-bg-page border-b border-border-default">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-baseline gap-1.5 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-interactive"
          >
            <span className="text-lg font-bold text-brand-primary">LoanPro</span>
            <span className="text-sm font-normal text-text-muted">by Fannie Mae</span>
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/apply"
              className="text-brand-primary transition-colors duration-150 hover:text-brand-interactive rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-interactive"
            >
              Apply
            </Link>
            <Link
              href="/status"
              className="text-brand-primary transition-colors duration-150 hover:text-brand-interactive rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-interactive"
            >
              Check Status
            </Link>
            <Link
              href="/customers"
              className="text-brand-primary transition-colors duration-150 hover:text-brand-interactive rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-interactive"
            >
              Customers
            </Link>
            <Link
              href="/officer"
              className="text-brand-primary transition-colors duration-150 hover:text-brand-interactive rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-interactive"
            >
              Officer Review
            </Link>
          </div>
        </div>
        <div className="h-0.5 bg-brand-primary" />
      </nav>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </>
  );
}
