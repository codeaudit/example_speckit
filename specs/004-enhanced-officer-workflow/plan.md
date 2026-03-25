# Implementation Plan: Enhanced Officer Workflow

**Branch**: `004-enhanced-officer-workflow` | **Date**: 2026-03-25 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/004-enhanced-officer-workflow/spec.md`

## Summary

Restructure the officer review area to be customer-centric: officers see a customer list, drill into a customer to view their profile plus all associated loan applications (matched by email), and review pending applications with the existing decision flow. Enhance the customer directory to also show loan applications. Add a manual dark/light mode toggle button in the navigation bar with session-only persistence, building on the existing Tailwind CSS 4 dark mode from feature 003.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode) — existing
**Primary Dependencies**: Next.js 15 (App Router), Tailwind CSS 4.x, better-sqlite3, nanoid — all existing
**Storage**: SQLite via better-sqlite3 (existing `data/loan-app.db`) — no schema changes; email-based join at query time
**Testing**: Vitest with React Testing Library (existing configuration)
**Target Platform**: Local development server (Node.js 20+ LTS)
**Project Type**: Web application (single Next.js project — existing)
**Performance Goals**: Customer detail + loans loads within 2 seconds; theme toggle < 100ms
**Constraints**: No new dependencies; session-only theme persistence (no localStorage); all 85 existing tests must pass
**Scale/Scope**: 10 seed customers, up to 100 applications; 3 new pages, 1 new API endpoint, ~8 modified files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Test-First Development | PASS | New API endpoint and email-matching logic require integration tests written before implementation. UI components tested via existing patterns. |
| II. Simplicity & YAGNI | PASS | No new dependencies. Email matching via SQL JOIN (no ORM). Session-only theme state (no localStorage). Reuses existing application-detail and decision-form components. |
| III. Design Quality | PASS | New pages follow existing dark mode + Impeccable design patterns. Customer-centric view improves officer UX. Loading/error/empty states for all new views. |

No violations — all gates pass.

## Project Structure

### Documentation (this feature)

```text
specs/004-enhanced-officer-workflow/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── api.md
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── layout.tsx                    # Add theme toggle button to nav
│   ├── api/
│   │   └── customers/
│   │       └── [id]/
│   │           └── applications/
│   │               └── route.ts      # NEW: GET /api/customers/:id/applications
│   ├── officer/
│   │   ├── page.tsx                  # MODIFIED: Show customer list (not flat app list)
│   │   ├── customer/
│   │   │   └── [id]/
│   │   │       └── page.tsx          # NEW: Officer customer detail + loan list
│   │   └── [id]/
│   │       └── page.tsx              # EXISTING: Application review (reused)
│   └── customers/
│       └── [id]/
│           └── page.tsx              # MODIFIED: Add loan applications section
├── components/
│   ├── officer-customer-list.tsx     # NEW: Customer list for officer area
│   ├── customer-applications.tsx     # NEW: Loan applications table for a customer
│   ├── theme-toggle.tsx              # NEW: Dark/light mode toggle button
│   ├── application-list.tsx          # EXISTING (officer page no longer uses this directly)
│   ├── application-detail.tsx        # EXISTING (reused in /officer/[id])
│   └── decision-form.tsx             # EXISTING (reused in /officer/[id])
└── lib/
    └── theme-context.tsx             # NEW: React context for theme state management

tests/
├── integration/
│   └── customer-applications.test.ts # NEW: API tests for customer applications endpoint
└── unit/
    └── theme-toggle.test.ts          # NEW: Theme toggle state logic tests
```

**Structure Decision**: Single Next.js project — extends existing structure. New officer pages follow `/officer/customer/[id]` pattern. Existing `/officer/[id]` (application review) remains unchanged.
