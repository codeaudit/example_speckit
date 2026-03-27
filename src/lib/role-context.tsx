"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type UserRole = "borrower" | "officer";

interface RoleContextValue {
  role: UserRole | null;
  setRole: (role: UserRole) => void;
}

const STORAGE_KEY = "loanpro-active-role";

function isValidRole(value: string | null): value is UserRole {
  return value === "borrower" || value === "officer";
}

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole | null>(null);

  // Read from sessionStorage after mount to avoid SSR mismatch
  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (isValidRole(stored)) {
      setRoleState(stored);
    }
  }, []);

  const setRole = useCallback((newRole: UserRole) => {
    sessionStorage.setItem(STORAGE_KEY, newRole);
    setRoleState(newRole);
  }, []);

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole(): RoleContextValue {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
