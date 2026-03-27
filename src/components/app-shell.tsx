"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/lib/theme-context";

const officerNavLinks = [
  { label: "Dashboard", href: "/officer", icon: "dashboard" },
  { label: "Applications", href: "/officer", icon: "description" },
  { label: "Customers", href: "/customers", icon: "group" },
  { label: "Settings", href: "#", icon: "settings" },
];

function OfficerSidebar({ pathname }: { pathname: string }) {
  return (
    <aside className="fixed top-0 left-0 h-full w-[280px] flex flex-col signature-gradient z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6">
        <span
          className="material-symbols-outlined text-tertiary-fixed text-2xl"
          style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
        >
          account_balance
        </span>
        <span className="text-on-primary font-headline font-bold text-xl tracking-tight">
          LoanPro
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 space-y-1">
        {officerNavLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== "#" && pathname.startsWith(link.href) && link.href !== "/officer") || (link.href === "/officer" && (pathname === "/officer" || pathname.startsWith("/officer/")));
          return (
            <Link
              key={link.label}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium ${
                isActive
                  ? "bg-primary-container text-on-primary"
                  : "text-on-primary/70 hover:bg-white/10 hover:text-on-primary"
              }`}
            >
              <span className="material-symbols-outlined text-xl" aria-hidden="true">
                {link.icon}
              </span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 pb-6 space-y-1">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-on-primary/70 hover:bg-white/10 hover:text-on-primary transition-colors text-sm font-medium">
          <span className="material-symbols-outlined text-xl" aria-hidden="true">contact_support</span>
          Help & Support
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-on-primary/70 hover:bg-white/10 hover:text-on-primary transition-colors text-sm font-medium">
          <span className="material-symbols-outlined text-xl" aria-hidden="true">logout</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}

function BorrowerHeader() {
  return (
    <header className="bg-surface-container-lowest border-b border-outline-variant/20 h-16 flex items-center px-8">
      <Link href="/" className="font-headline font-bold text-xl text-primary tracking-tight">
        LoanPro
      </Link>
    </header>
  );
}

const officerRoutes = ["/officer", "/customers"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isOfficerRoute = officerRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  return (
    <ThemeProvider>
      {isOfficerRoute ? (
        <>
          <OfficerSidebar pathname={pathname} />
          <main className="ml-[280px] min-h-screen bg-surface p-8">{children}</main>
        </>
      ) : (
        <div className="min-h-screen bg-surface flex flex-col">
          <BorrowerHeader />
          <main className="flex-1 px-8 py-8 max-w-5xl mx-auto w-full">{children}</main>
        </div>
      )}
    </ThemeProvider>
  );
}
