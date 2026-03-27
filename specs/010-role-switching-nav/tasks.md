# Tasks: Navigation Fix & Role Switching

**Input**: Design documents from `/specs/010-role-switching-nav/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Tests**: Included per Constitution Principle I (Test-First Development — mandatory for this project).

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no shared dependencies)
- **[Story]**: User story this task belongs to (US1, US2, US3)
- All paths are relative to repository root

---

## Phase 1: Setup

**Purpose**: Confirm baseline and verify test suite passes before any changes.

- [x] T001 Run `npm test` and confirm all existing tests pass (baseline green)
- [x] T002 Run `npm run lint` and confirm zero lint errors (baseline)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the `RoleContext` — the single shared dependency for all three user stories. No user story can be implemented until this phase is complete.

**⚠️ CRITICAL**: All three user stories depend on `src/lib/role-context.tsx` being present and tested.

- [x] T003 Write failing unit tests for role context logic in `tests/unit/role-context.test.ts` — covering: default role is `null`, `setRole("officer")` updates state and writes to `sessionStorage["loanpro-active-role"]`, `setRole("borrower")` updates state and writes to sessionStorage, role is restored from sessionStorage on initialisation, and layout selection logic (officer layout when `role === "officer"` OR path matches `/officer`/`/customers`)
- [x] T004 Create `src/lib/role-context.tsx` — export `UserRole` type (`"borrower" | "officer"`), `RoleContextValue` interface, `RoleProvider` component (reads initial value from `sessionStorage["loanpro-active-role"]`; writes on `setRole`; follows ThemeContext pattern exactly), and `useRole` hook that throws if used outside provider
- [x] T005 Verify `tests/unit/role-context.test.ts` now passes (red → green)

**Checkpoint**: `RoleContext` is functional and tested. User story implementation can now begin.

---

## Phase 3: User Story 1 — Switch Between Roles (Priority: P1) 🎯 MVP

**Goal**: Users can switch between "Borrower" and "Loan Officer" views from any page using a visible role switcher control. Navigates to the default page for the selected role.

**Independent Test**: Load `/` (borrower view), use role switcher to select "Loan Officer", verify officer sidebar appears and URL is `/officer`. Then switch back and verify borrower header appears on `/`.

### Implementation for User Story 1

- [x] T006 [US1] Create `src/components/role-switcher.tsx` — a client component that accepts `variant: "header" | "sidebar"` prop; reads current role via `useRole()`; renders a dropdown or button group showing "Borrower" and "Loan Officer" options; calls `setRole` and navigates to `/officer` (for officer) or `/` (for borrower) using `useRouter` from `next/navigation`; `variant="header"` renders with light-background styling; `variant="sidebar"` renders with dark-gradient styling matching the existing sidebar buttons
- [x] T007 [US1] Update `src/components/app-shell.tsx` — wrap `ThemeProvider` with `RoleProvider`; replace the `isOfficerRoute` boolean logic with: show officer layout if `role === "officer"` OR `officerRoutes.some(...)` (backward compat); add `<RoleSwitcher variant="sidebar" />` to the bottom section of `OfficerSidebar` (above Help & Support); add `<RoleSwitcher variant="header" />` to `BorrowerHeader` (right side of header bar)
- [x] T008 [US1] Fix the duplicate nav link bug in `src/components/app-shell.tsx` — remove the "Dashboard" entry from `officerNavLinks` (it duplicates "Applications" href `/officer`); keep "Applications" → `/officer` and "Customers" → `/customers`; simplify the `isActive` logic: a link is active when `pathname === link.href` OR `pathname.startsWith(link.href + "/")` (no special-casing needed once the duplicate is removed)

**Checkpoint**: User Story 1 is fully functional. Role switcher visible on both layouts. Nav highlights only one link at a time. Role switching navigates correctly.

---

## Phase 4: User Story 2 — Persistent Role Selection (Priority: P2)

**Goal**: The selected role persists across page navigations and page refreshes within the same browser session. The officer sidebar stays visible when navigating between `/officer`, `/officer/[id]`, and `/customers/[id]`.

**Independent Test**: Switch to officer role, navigate to Customers, navigate to a customer detail page, refresh the page — officer layout should remain throughout. Open a new tab to the same URL — borrower layout should appear (different session).

### Implementation for User Story 2

- [x] T009 [US2] Add sessionStorage persistence tests to `tests/unit/role-context.test.ts` — add test cases: role is read from `sessionStorage` on `RoleProvider` mount (simulate pre-set sessionStorage value); `setRole` writes to `sessionStorage`; switching roles updates sessionStorage; confirm `null` role when sessionStorage is absent or contains an invalid value
- [x] T010 [US2] Verify `RoleProvider` in `src/lib/role-context.tsx` correctly initialises from `sessionStorage` — read `sessionStorage.getItem("loanpro-active-role")` on mount; validate the value is `"borrower"` or `"officer"` before setting (ignore invalid values); confirm `useEffect` is used for the sessionStorage read (avoids SSR mismatch)

**Checkpoint**: Role persists across navigations and page refreshes. A new tab starts without a role (borrower default).

---

## Phase 5: User Story 3 — Clear Role Identity Display (Priority: P3)

**Goal**: The currently active role is visually labelled in the navigation at all times. The role switcher clearly shows which role is active and makes switching discoverable.

**Independent Test**: In officer view, inspect the sidebar — a label or badge reading "Loan Officer" is visible without scrolling. In borrower view, inspect the header — a control showing "Borrower" is visible in the top-right area.

### Implementation for User Story 3

- [x] T011 [P] [US3] Update `src/components/role-switcher.tsx` — ensure the currently active role is visually distinguished in the switcher (e.g., bold text, check icon, or highlighted button state); the inactive role option is displayed as a secondary action; match styling tokens from existing design system (use `text-on-primary`, `bg-primary-container`, Material Symbols icons consistent with sidebar)
- [x] T012 [P] [US3] Update `BorrowerHeader` in `src/components/app-shell.tsx` — ensure the role switcher is positioned at the right side of the header bar using `ml-auto`; confirm it is visible at all standard viewport widths without scrolling; add an accessible `aria-label` to the switcher control describing its purpose

**Checkpoint**: Active role is visible without scrolling in both layouts. Role switcher is discoverable and clearly labeled.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, edge case confirmation, and accessibility check.

- [x] T013 Verify backward compatibility: navigate directly to `http://localhost:3000/officer` in a fresh browser tab (no sessionStorage) and confirm the officer sidebar renders correctly without having used the role switcher
- [x] T014 Verify the role switcher is reachable and usable from every page in the app — spot-check `/`, `/apply`, `/status`, `/officer`, `/officer/[id]`, `/customers`, `/customers/[id]`
- [x] T015 Add `aria-label` attributes to the role switcher buttons and confirm keyboard navigation works (tab to switcher, press Enter to activate)
- [x] T016 Run `npm test` — confirm all existing tests still pass and new `role-context.test.ts` tests pass
- [x] T017 Run `npm run lint` — confirm zero lint errors across all modified files (`src/lib/role-context.tsx`, `src/components/role-switcher.tsx`, `src/components/app-shell.tsx`, `tests/unit/role-context.test.ts`)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — **BLOCKS all user stories**
- **Phase 3 (US1)**: Depends on Phase 2 completion
- **Phase 4 (US2)**: Depends on Phase 2 completion; builds on Phase 3 (RoleContext already has sessionStorage from T004, this phase adds tests and validates)
- **Phase 5 (US3)**: Depends on Phase 3 (RoleSwitcher must exist); T011 and T012 are parallelizable
- **Phase 6 (Polish)**: Depends on all user story phases complete

### User Story Dependencies

- **US1 (P1)**: Depends on Foundational only — implements the core switching UI
- **US2 (P2)**: Depends on Foundational only — sessionStorage is built into `RoleContext` from T004; this phase adds dedicated test coverage
- **US3 (P3)**: Depends on US1 (needs `RoleSwitcher` component to exist)

### Within Each Phase

- Constitution mandates: tests written and FAILING before implementation (T003 before T004)
- `RoleContext` (T003–T005) must complete before any component work
- `RoleSwitcher` (T006) must complete before `AppShell` integration (T007)
- Nav bug fix (T008) is independent of T006 but must happen in same AppShell edit pass

### Parallel Opportunities

- T001 and T002 (baseline checks) can run in parallel
- T011 and T012 (US3 polish) can run in parallel — different files
- T016 and T017 (final checks) should run sequentially after all implementation

---

## Parallel Example: Phase 5 (US3)

```bash
# T011 and T012 touch different files — launch together:
Task: "Update RoleSwitcher active state styling in src/components/role-switcher.tsx"
Task: "Position RoleSwitcher in BorrowerHeader in src/components/app-shell.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (baseline check)
2. Complete Phase 2: Foundational (RoleContext — blocks everything)
3. Complete Phase 3: User Story 1 (switching + nav fix)
4. **STOP and VALIDATE**: Switch roles in both directions; confirm only one nav link highlights; confirm navigation to correct default page
5. Demo-ready MVP

### Incremental Delivery

1. Setup + Foundational → RoleContext functional
2. US1 → Role switcher visible; switching works; nav bug fixed → **Demo**
3. US2 → Role survives refresh and multi-page navigation → **Demo**
4. US3 → Active role clearly labeled; switcher discoverable → **Demo**
5. Polish → All tests green; lint clean; backward compat confirmed → **Ship**

---

## Notes

- [P] tasks = different files, no in-flight dependencies
- Constitution Principle I: T003 (tests) MUST be written and red before T004 (implementation)
- `sessionStorage` reads must be inside `useEffect` to avoid SSR hydration errors
- The `RoleProvider` should wrap inside `ThemeProvider` in `AppShell` — same nesting pattern
- `useRole()` should throw a clear error if called outside `RoleProvider` (same as `useTheme()`)
- The "Dashboard" nav link removal (T008) is a bug fix bundled with US1 — it is not a separate feature
- Commit after each checkpoint to keep git history atomic and reviewable
