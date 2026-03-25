# Implementation Plan: Loan Processing Application

**Branch**: `001-loan-processing-app` | **Date**: 2026-03-25 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-loan-processing-app/spec.md`

## Summary

Build a mortgage loan processing web application where borrowers
submit loan applications and loan officers review them with an
advisory auto-qualification engine. The system calculates DTI, LTV,
front-end ratio, asset tests, and credit score checks per the
Mortgage Loan Evaluation Specification, presenting results to
officers who make the final approve/reject decision. Built with
Next.js (App Router), TypeScript, shadcn/ui, Impeccable design
system, and SQLite for local persistence.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: Next.js 15 (App Router), shadcn/ui,
Tailwind CSS, better-sqlite3
**Storage**: SQLite via better-sqlite3 (synchronous, no ORM per
constitution)
**Testing**: Vitest + React Testing Library + @testing-library/user-event
**Target Platform**: Web (desktop/tablet primary, responsive)
**Project Type**: Web application (full-stack Next.js)
**Performance Goals**: All pages load in under 2 seconds;
qualification calculation completes in under 100ms
**Constraints**: Single-user local app; no external services; SQLite
file-based storage; no authentication
**Scale/Scope**: Single user, ~5 screens (borrower form, borrower
status lookup, officer list, officer detail, confirmation)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Test-First Development (NON-NEGOTIABLE)

- **PASS**: Plan includes Vitest for unit tests (qualification
  engine, validation logic) and integration tests that exercise
  SQLite directly via better-sqlite3.
- **PASS**: Tasks will be structured as test-first (write failing
  test, then implement).
- **PASS**: No mocking of the data layer in integration tests —
  tests will use a real in-memory SQLite database.

### II. Simplicity & YAGNI

- **PASS**: No ORM — direct better-sqlite3 queries with prepared
  statements. Simple functions, not repository pattern classes.
- **PASS**: Single Next.js project (no monorepo, no separate
  backend). API routes co-located with frontend.
- **PASS**: All dependencies justified:
  - `next` — framework (required)
  - `better-sqlite3` — SQLite driver (required by storage choice)
  - `shadcn/ui` + `tailwindcss` — UI components (required by
    design choice)
  - `vitest` + `@testing-library/react` — testing (required by
    constitution)
  - `nanoid` — reference number generation (lightweight, no-dep
    alternative to uuid)

### III. Design Quality

- **PASS**: shadcn/ui provides accessible, well-designed base
  components. Impeccable design skills will be used for styling
  refinement.
- **PASS**: All screens will include error, empty, and loading
  states per spec edge cases.
- **PASS**: WCAG 2.1 AA — shadcn/ui components meet this by
  default; form labels, error announcements, and keyboard
  navigation will be verified.

## Project Structure

### Documentation (this feature)

```text
specs/001-loan-processing-app/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── layout.tsx                 # Root layout with nav
│   ├── page.tsx                   # Home / borrower landing
│   ├── apply/
│   │   └── page.tsx               # Loan application form
│   ├── status/
│   │   └── page.tsx               # Status lookup by reference
│   ├── officer/
│   │   ├── page.tsx               # Pending applications list
│   │   └── [id]/
│   │       └── page.tsx           # Application detail + decision
│   └── api/
│       └── applications/
│           ├── route.ts           # POST (create), GET (list)
│           └── [id]/
│               ├── route.ts       # GET (detail)
│               └── decide/
│                   └── route.ts   # POST (approve/reject)
├── lib/
│   ├── db.ts                      # SQLite connection + migrations
│   ├── qualification.ts           # Mortgage qualification engine
│   ├── validation.ts              # Input validation functions
│   └── defaults.ts                # Hardcoded default values + thresholds
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── loan-form.tsx              # Borrower application form
│   ├── status-lookup.tsx          # Reference number search
│   ├── application-list.tsx       # Officer pending list
│   ├── application-detail.tsx     # Officer review view
│   ├── qualification-summary.tsx  # Qualification results display
│   └── decision-form.tsx          # Approve/reject form
└── types/
    └── index.ts                   # Shared TypeScript types

tests/
├── unit/
│   ├── qualification.test.ts      # Qualification engine unit tests
│   ├── validation.test.ts         # Validation logic unit tests
│   └── defaults.test.ts           # Default calculation tests
├── integration/
│   ├── applications.test.ts       # API route integration tests (real SQLite)
│   └── decisions.test.ts          # Decision flow integration tests
└── setup.ts                       # Test setup (in-memory SQLite)
```

**Structure Decision**: Single Next.js project. API routes handle
all data operations via better-sqlite3. No separate backend process.
The `src/lib/qualification.ts` module is pure functions with no
side effects — easily testable in isolation.

## Complexity Tracking

> No constitution violations to justify.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| (none)    | —          | —                                   |
