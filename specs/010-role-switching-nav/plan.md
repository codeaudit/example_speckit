# Implementation Plan: Navigation Fix & Role Switching

**Branch**: `010-role-switching-nav` | **Date**: 2026-03-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/010-role-switching-nav/spec.md`

## Summary

Add a role-switching control to the LoanPro navigation so users can move between "Borrower" and "Loan Officer" views from any page. The selected role persists for the browser session via `sessionStorage`. Concurrently fix two existing nav bugs: both "Dashboard" and "Applications" link to `/officer` (identical href), and active-link logic is overly complex and prone to false highlights. Implementation follows the existing `ThemeContext` pattern — a new `RoleContext` drives layout selection in `AppShell` alongside backward-compatible URL detection.

## Technical Context

**Language/Version**: TypeScript 6.x (strict mode)
**Primary Dependencies**: Next.js 16.2 (App Router), React 19, Tailwind CSS 4.2, Vitest 3.x
**Storage**: `sessionStorage` (client-side; no database changes)
**Testing**: Vitest (unit tests for role context logic, following `theme-toggle.test.ts` pattern)
**Target Platform**: Web browser (light + dark mode; responsive)
**Project Type**: Web application (Next.js App Router)
**Performance Goals**: Role switch completes in ≤2 user interactions; no layout shift on role change
**Constraints**: No new npm dependencies; no server-side changes; `sessionStorage` only (not `localStorage`)
**Scale/Scope**: Two roles (Borrower, Loan Officer); single `AppShell` layout component

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Test-First Development | ✅ PASS | Unit tests for role context logic written before implementation |
| II. Simplicity & YAGNI | ✅ PASS | No new dependencies; follows existing ThemeContext pattern exactly; no ORM introduced |
| III. Design Quality | ✅ PASS | Role switcher must meet Impeccable standards; active-link fix improves existing quality |
| Technology Constraints (Node.js/SQLite/TypeScript) | ✅ PASS | No new stack additions; sessionStorage is browser-native |
| Development Workflow (atomic commits, branch from main) | ✅ PASS | Already on feature branch `010-role-switching-nav` |

**Post-Phase 1 Re-check**: No violations introduced by design. `sessionStorage` is browser-native; no additional npm packages required.

## Project Structure

### Documentation (this feature)

```text
specs/010-role-switching-nav/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── lib/
│   ├── theme-context.tsx        # Existing — unchanged
│   └── role-context.tsx         # NEW: RoleContext, RoleProvider, useRole
├── components/
│   ├── app-shell.tsx            # MODIFIED: use RoleContext + RoleSwitcher; fix nav bugs
│   └── role-switcher.tsx        # NEW: dropdown/toggle UI component
└── app/
    └── (all existing pages)     # Unchanged

tests/
└── unit/
    ├── theme-toggle.test.ts     # Existing — unchanged
    └── role-context.test.ts     # NEW: unit tests for role context logic
```

**Structure Decision**: Single project, web application layout. All changes are confined to `src/lib/`, `src/components/`, and `tests/unit/`. No new routes, API changes, or database migrations required.

---

## Phase 0: Research

### Decision 1: State persistence mechanism

**Decision**: `sessionStorage`
**Rationale**: Role is a session-level UI preference — it should not persist across browser sessions or tabs (which would happen with `localStorage`). `sessionStorage` is scoped to the tab and survives page refresh within the same session, matching FR-004. It is browser-native and requires no additional dependencies.
**Alternatives considered**:
- `localStorage` — rejected: persists indefinitely across sessions; user may forget they set "officer" and be confused on next visit
- URL query param (`?role=officer`) — rejected: pollutes all URLs, breaks deep linking, violates YAGNI
- Cookie — rejected: unnecessary server round-trip for a pure client-side UI preference; requires additional setup
- React context only (in-memory) — rejected: does not survive page refresh (FR-004 requirement)

### Decision 2: Pattern for role context

**Decision**: Mirror the existing `ThemeContext` / `ThemeProvider` pattern in `src/lib/role-context.tsx`
**Rationale**: The codebase already has an established pattern for global client-side state (ThemeContext). Reusing the same shape keeps the code consistent, minimises cognitive load, and satisfies the Constitution's simplicity principle. The `RoleProvider` wraps inside `ThemeProvider` in `AppShell`, same structure.
**Alternatives considered**:
- Zustand/Jotai — rejected: new dependencies; ThemeContext pattern is sufficient for two-value state
- Next.js middleware-based role detection — rejected: overkill for a client-side demo feature; would require cookies and server code

### Decision 3: Backward compatibility for direct URL navigation

**Decision**: In `AppShell`, show officer layout if `role === 'officer'` OR if the current path matches an officer route (existing logic). The URL check acts as a fallback when the role state has not been explicitly set.
**Rationale**: FR-008 requires that navigating directly to `/officer` still renders the officer sidebar. The role context defaults to `null` on first load; when path matches officer routes, the officer layout is shown and the role context is implicitly set to "officer".
**Alternatives considered**:
- Remove URL-based detection entirely — rejected: breaks direct URL access (FR-008)
- Keep URL-only detection — rejected: this is exactly the bug we are fixing (roles don't persist across borrower pages)

### Decision 4: Fix for "Dashboard" / "Applications" nav links

**Decision**: Give "Applications" a distinct href — `/officer` (list view) — and "Dashboard" should also point to `/officer` but be labelled as the entry point. Since the current app only has one officer page (`/officer`), the simplest fix is to remove the duplicate "Dashboard" link and rename "Applications" to "Applications", keeping a single link to `/officer`. Alternatively, if a dashboard sub-route is desired, that is out of scope. For this feature: remove the "Dashboard" duplicate entry; keep "Applications" → `/officer`.
**Rationale**: Having two nav links with identical hrefs causes both to highlight simultaneously, violating SC-003. Removing the duplicate is the simplest fix (YAGNI — no separate dashboard page exists).
**Alternatives considered**:
- Create a `/officer/dashboard` route — rejected: out of scope; adds complexity
- Keep both but use different active logic — rejected: fragile; root cause is the duplicate href

---

## Phase 1: Design & Contracts

### data-model.md content

The role switcher introduces one new piece of client-side state. There is no server-side data model change.

**Active Role State**

| Property | Type | Values | Persistence |
|----------|------|--------|-------------|
| `role` | `"borrower" \| "officer" \| null` | borrower, officer, null (unset) | `sessionStorage` key: `loanpro-active-role` |

- `null` = role not explicitly set; layout falls back to URL-path detection
- `"borrower"` = borrower layout forced regardless of URL
- `"officer"` = officer layout forced regardless of URL
- On switching role: navigate to default landing page for that role; set `sessionStorage`

**State Transitions**

```
null ──(visit /officer URL)──→ displays officer layout (implicit)
null ──(visit /apply URL)────→ displays borrower layout (implicit)
null ──(select Officer)──────→ officer (stored) + navigate /officer
null ──(select Borrower)─────→ borrower (stored) + navigate /
"officer" ──(select Borrower)→ borrower (stored) + navigate /
"borrower" ──(select Officer)→ officer (stored) + navigate /officer
"officer" ──(navigate pages)─→ officer (persists, no change)
```

### contracts/

No external API contracts are introduced or changed. The role switcher is purely a client-side UI concern. Existing API routes (`/api/applications/*`, `/api/customers/*`) are unchanged.

**UI Contract (internal)**

The `RoleSwitcher` component accepts:
```typescript
interface RoleSwitcherProps {
  variant: "header" | "sidebar"; // controls visual layout/placement
}
```

The `useRole` hook returns:
```typescript
interface RoleContextValue {
  role: "borrower" | "officer" | null;
  setRole: (role: "borrower" | "officer") => void;
}
```

### quickstart.md

**To verify the feature locally:**

1. Start the dev server: `npm run dev`
2. Open the app at `http://localhost:3000` (borrower view by default)
3. Use the role switcher in the top-right header to switch to "Loan Officer"
4. Verify the officer sidebar appears and you land on the applications dashboard
5. Navigate to Customers, then back to Applications — sidebar should persist
6. Refresh the page — officer view should be preserved
7. Switch back to "Borrower" via the switcher in the sidebar — borrower header should appear
8. Navigate directly to `http://localhost:3000/officer` — officer sidebar should display without needing to switch roles first

**To run tests:**
```bash
npm test
```

The new test file `tests/unit/role-context.test.ts` covers role context logic (switching, sessionStorage persistence, default state, URL fallback logic).
