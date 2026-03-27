"use client";

import { useRouter } from "next/navigation";
import { useRole, type UserRole } from "@/lib/role-context";

interface RoleSwitcherProps {
  variant: "header" | "sidebar";
}

const roles: { value: UserRole; label: string; icon: string }[] = [
  { value: "borrower", label: "Borrower", icon: "person" },
  { value: "officer", label: "Loan Officer", icon: "badge" },
];

const defaultPaths: Record<UserRole, string> = {
  officer: "/officer",
  borrower: "/",
};

export default function RoleSwitcher({ variant }: RoleSwitcherProps) {
  const { role, setRole } = useRole();
  const router = useRouter();

  function handleSwitch(newRole: UserRole) {
    if (newRole === role) return;
    setRole(newRole);
    router.push(defaultPaths[newRole]);
  }

  if (variant === "sidebar") {
    return (
      <div className="px-3 pb-2">
        <p className="px-4 pb-1 text-xs font-semibold text-on-primary/50 uppercase tracking-wider">
          View as
        </p>
        {roles.map(({ value, label, icon }) => {
          const isActive = role === value || (role === null && value === "officer");
          return (
            <button
              key={value}
              onClick={() => handleSwitch(value)}
              aria-label={`Switch to ${label} view`}
              aria-pressed={isActive}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors text-sm font-medium ${
                isActive
                  ? "bg-primary-container text-on-primary font-semibold"
                  : "text-on-primary/70 hover:bg-white/10 hover:text-on-primary"
              }`}
            >
              <span
                className="material-symbols-outlined text-lg"
                style={
                  isActive
                    ? { fontVariationSettings: "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 20" }
                    : undefined
                }
                aria-hidden="true"
              >
                {icon}
              </span>
              {label}
              {isActive && (
                <span
                  className="material-symbols-outlined text-base ml-auto"
                  style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}
                  aria-hidden="true"
                >
                  check_circle
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // variant === "header"
  const activeRole = roles.find((r) => r.value === role) ?? roles[0];

  return (
    <div className="flex items-center gap-1 rounded-lg border border-outline-variant/30 bg-surface-container p-1">
      {roles.map(({ value, label, icon }) => {
        const isActive = role === value || (role === null && value === "borrower");
        return (
          <button
            key={value}
            onClick={() => handleSwitch(value)}
            aria-label={`Switch to ${label} view`}
            aria-pressed={isActive}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            <span
              className="material-symbols-outlined text-base"
              style={
                isActive
                  ? { fontVariationSettings: "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 20" }
                  : undefined
              }
              aria-hidden="true"
            >
              {icon}
            </span>
            {label}
          </button>
        );
      })}
    </div>
  );
}
