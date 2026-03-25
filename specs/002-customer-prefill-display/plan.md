# Implementation Plan: Customer Prefill & Display

**Branch**: `002-customer-prefill-display` | **Date**: 2026-03-25 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-customer-prefill-display/spec.md`

## Summary

Add a `customers` table to the existing SQLite database with seed data (10 sample customers derived from the user's loan application documents), a customer directory page with list/detail views, and customer selection on the loan application form to auto-populate applicant name and email. Builds on the existing Next.js 15 + better-sqlite3 stack from feature 001.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode) — same as feature 001
**Primary Dependencies**: Next.js 15 (App Router), better-sqlite3, Tailwind CSS, nanoid — all existing
**Storage**: SQLite via better-sqlite3 (existing `data/loan-app.db`), new migration v3 for `customers` table
**Testing**: Vitest with React Testing Library (existing configuration)
**Target Platform**: Local development server (Node.js 20+ LTS)
**Project Type**: Web application (single Next.js project — existing)
**Performance Goals**: Customer directory loads within 2 seconds with up to 100 customers
**Constraints**: Read-only customer management (no CRUD beyond seed data), seed migration must be atomic
**Scale/Scope**: 10 seed customers, up to 100 displayed without pagination

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Test-First Development | PASS | Tests written before implementation for all new code |
| II. Simplicity & YAGNI | PASS | No new dependencies needed; direct SQLite queries, no ORM; customer management (CRUD) explicitly out of scope |
| III. Design Quality | PASS | Customer directory and detail pages follow Impeccable design standards with empty/loading/error states; WCAG 2.1 AA |

No violations — all gates pass.

## Project Structure

### Documentation (this feature)

```text
specs/002-customer-prefill-display/
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
│   ├── api/
│   │   └── customers/
│   │       ├── route.ts           # GET /api/customers (list)
│   │       └── [id]/
│   │           └── route.ts       # GET /api/customers/:id (detail)
│   ├── customers/
│   │   ├── page.tsx               # Customer directory page
│   │   └── [id]/
│   │       └── page.tsx           # Customer detail page
│   └── apply/
│       └── page.tsx               # Enhanced with customer selection
├── components/
│   ├── customer-list.tsx          # Customer directory table
│   ├── customer-detail.tsx        # Customer profile card
│   └── customer-select.tsx        # Customer selection for loan form
├── lib/
│   ├── db.ts                      # Add migration v3 (customers table + seed)
│   └── seed-data.ts               # Customer seed data array
└── types/
    └── index.ts                   # Add Customer, CustomerSummary types

tests/
├── integration/
│   ├── customers.test.ts          # API route integration tests
│   └── seed.test.ts               # Seed data migration tests
└── unit/
    └── seed-data.test.ts          # Seed data validation tests
```

**Structure Decision**: Single Next.js project — extends the existing feature 001 structure. New `customers` API routes and pages follow the same pattern as `applications`.
