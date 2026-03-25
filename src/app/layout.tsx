import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Loan Processing Application",
  description: "Mortgage loan application and qualification system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <nav className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-lg font-semibold text-gray-900">
              LoanPro
            </Link>
            <div className="flex gap-6 text-sm">
              <Link
                href="/apply"
                className="text-gray-600 hover:text-gray-900"
              >
                Apply
              </Link>
              <Link
                href="/status"
                className="text-gray-600 hover:text-gray-900"
              >
                Check Status
              </Link>
              <Link
                href="/officer"
                className="text-gray-600 hover:text-gray-900"
              >
                Officer Review
              </Link>
            </div>
          </div>
        </nav>
        <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
