# Data Model: Navigation Fix & Role Switching

**Branch**: `010-role-switching-nav` | **Date**: 2026-03-27

## Overview

No database schema changes. The only new state is a client-side role preference stored in `sessionStorage`.

## Client-Side State

### Active Role

| Property | Type | Values | Storage |
|----------|------|--------|---------|
| `role` | `"borrower" \| "officer" \| null` | borrower, officer, null | `sessionStorage["loanpro-active-role"]` |

**Semantics**:
- `null` — role not explicitly set; layout falls back to URL-path detection (backward compatibility)
- `"borrower"` — borrower layout forced; user explicitly selected Borrower
- `"officer"` — officer layout forced; user explicitly selected Loan Officer

**State Transitions**:

| Current Role | Trigger | New Role | Navigation |
|-------------|---------|----------|-----------|
| any | User selects "Loan Officer" | `"officer"` | → `/officer` |
| any | User selects "Borrower" | `"borrower"` | → `/` |
| `null` | Direct URL to `/officer` or `/customers` | (unchanged, layout inferred from URL) | — |
| `"officer"` | Navigate between officer pages | `"officer"` (unchanged) | — |
| any | Page refresh | (read from sessionStorage) | — |

## Context Interface

```typescript
// src/lib/role-context.tsx

type UserRole = "borrower" | "officer";

interface RoleContextValue {
  role: UserRole | null;        // null = not yet set explicitly
  setRole: (role: UserRole) => void;  // stores to sessionStorage + updates state
}
```

## Component Interface

```typescript
// src/components/role-switcher.tsx

interface RoleSwitcherProps {
  variant: "header" | "sidebar";
  // "header"  → used in BorrowerHeader (horizontal layout, light background)
  // "sidebar" → used in OfficerSidebar (vertical layout, dark gradient background)
}
```

## sessionStorage Key

```
Key:   "loanpro-active-role"
Value: "borrower" | "officer"
Scope: Current browser tab, cleared when tab is closed
```
