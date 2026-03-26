import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import AppShell from "@/components/app-shell";
import "./globals.css";

const sourceSansPro = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LoanPro by Fannie Mae",
  description: "Mortgage loan application and qualification system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={sourceSansPro.className}>
      <body className="min-h-screen bg-bg-page text-text-primary antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
