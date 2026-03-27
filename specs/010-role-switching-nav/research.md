# Research: Navigation Fix & Role Switching

**Branch**: `010-role-switching-nav` | **Date**: 2026-03-27

## Decision 1: State Persistence Mechanism

**Decision**: `sessionStorage`
**Rationale**: Role is a session-level UI preference. It should survive page refresh but not persist across browser sessions or tabs. `sessionStorage` is browser-native, requires no new dependencies, and matches FR-004 exactly.
**Alternatives considered**:
- `localStorage` — rejected: persists indefinitely; user returning days later still sees "officer" mode unexpectedly
- URL query param — rejected: pollutes all application URLs; breaks deep-linking; violates YAGNI
- Cookie — rejected: unnecessary server involvement for a pure client-side preference
- In-memory React context only — rejected: does not survive page refresh (violates FR-004)

## Decision 2: Role Context Implementation Pattern

**Decision**: Mirror the existing `ThemeContext` / `ThemeProvider` pattern (`src/lib/theme-context.tsx`)
**Rationale**: The codebase already has a well-established pattern for global client-side state. Reusing it keeps code consistent, minimizes cognitive overhead, and satisfies the Constitution's simplicity and YAGNI principles. No new npm dependencies are introduced.
**Alternatives considered**:
- Zustand / Jotai — rejected: unnecessary new dependencies; ThemeContext pattern is sufficient for two-value state
- Next.js middleware cookie-based roles — rejected: requires server changes; overkill for a client-side demo feature

## Decision 3: Backward Compatibility Strategy

**Decision**: `AppShell` shows officer layout if `role === 'officer'` OR if the current path matches an officer route. The URL check acts as implicit fallback when role has not been explicitly set.
**Rationale**: FR-008 mandates that directly navigating to `/officer` still renders the officer sidebar. This dual-condition approach is the minimum change needed to preserve existing behavior while adding the role context layer.
**Alternatives considered**:
- Remove URL-based detection entirely — rejected: breaks direct URL access (FR-008 violation)
- Keep only URL-based detection — rejected: this is the root cause of the bug being fixed

## Decision 4: Duplicate Nav Link Fix

**Decision**: Remove the "Dashboard" entry from `officerNavLinks`; keep "Applications" → `/officer`. Update "Customers" to correctly point to `/customers`.
**Rationale**: "Dashboard" and "Applications" both href to `/officer`, causing both to highlight simultaneously (SC-003 violation). No separate `/officer/dashboard` page exists — creating one is out of scope. Removing the duplicate is the YAGNI-compliant fix.
**Alternatives considered**:
- Create a `/officer/dashboard` route — rejected: out of scope; adds a new page with no spec requirement
- Keep both links with custom active logic — rejected: fragile; treats symptoms not root cause
