# Research: Loan Processing Application

**Date**: 2026-03-25
**Branch**: `001-loan-processing-app`

## 1. SQLite Driver for Next.js

**Decision**: better-sqlite3
**Rationale**: Synchronous API simplifies Next.js API route handlers
(no async/await ceremony for DB calls). Fastest SQLite binding for
Node.js. Constitution prohibits ORM, so direct prepared statements
via better-sqlite3 align perfectly.
**Alternatives considered**:
- `sql.js` — WASM-based, works in browser but slower and more
  complex for server-side use
- `sqlite3` (node-sqlite3) — async callback API, more complex
  error handling
- `drizzle-orm` / `prisma` — ORM layer explicitly prohibited by
  constitution (Simplicity & YAGNI)

## 2. Reference Number Generation

**Decision**: nanoid (custom alphabet, 10 chars)
**Rationale**: Lightweight (no dependencies), collision-resistant,
URL-safe. Format: `LN-XXXXXXXX` (prefix + 8 alphanumeric chars)
gives ~2.8 trillion combinations — more than sufficient for a local
single-user app.
**Alternatives considered**:
- `uuid` v4 — 36 chars is excessive for a reference number users
  type manually
- Auto-increment integer — not user-friendly, reveals volume
- `crypto.randomUUID()` — built-in but same length problem as uuid

## 3. Next.js API Routes + SQLite

**Decision**: Use Next.js Route Handlers (App Router) with
better-sqlite3 initialized as a singleton module
**Rationale**: better-sqlite3 is synchronous, so each API route
handler can call DB directly without connection pooling. SQLite
handles file-level locking natively. Single-user assumption means
no concurrency concerns.
**Key pattern**: `src/lib/db.ts` exports a singleton `Database`
instance. Migrations run on first import (checked via user_version
pragma).

## 4. Form Validation Strategy

**Decision**: Shared validation functions in `src/lib/validation.ts`
used by both client (form) and server (API route)
**Rationale**: Single source of truth for validation rules. Client
validation provides instant feedback; server validation ensures
data integrity. No additional validation library needed — rules
are simple range/format checks.
**Alternatives considered**:
- `zod` — popular but adds a dependency for straightforward
  range/format checks that are easily expressed as plain functions
- `yup` — same concern, heavier API surface

## 5. Qualification Engine Architecture

**Decision**: Pure functions in `src/lib/qualification.ts` with no
side effects or DB access
**Rationale**: Constitution requires test-first development. Pure
functions are trivially testable — pass inputs, assert outputs. The
engine takes a `QualificationInput` object and returns a
`QualificationResult` object. No classes, no state.
**Key insight**: All formulas from the Mortgage Loan Evaluation
Specification translate directly to functions:
- `calculatePHE(...)` — housing expense
- `calculatePI(...)` — principal and interest (amortization)
- `calculateRatios(...)` — front-end, DTI, LTV
- `evaluateQualification(...)` — master function, returns Yes/No +
  failed tests

## 6. UI Component Strategy

**Decision**: shadcn/ui base components + Tailwind CSS + Impeccable
design refinement
**Rationale**: shadcn/ui provides accessible, unstyled-by-default
components (forms, tables, dialogs, badges) that align with the
constitution's Design Quality principle. Impeccable skills handle
visual polish — spacing, colour, hierarchy. No custom design system
to build from scratch.
**Key components from shadcn/ui**: Form, Input, Select, Button,
Table, Card, Badge, Alert, Tabs

## 7. Database Migration Strategy

**Decision**: Version-based migrations using SQLite `user_version`
pragma
**Rationale**: Constitution requires versioned migration files. The
`user_version` pragma is a built-in SQLite integer that persists
across connections. On app start, `db.ts` checks current version
and runs any pending migration functions sequentially.
**Pattern**:
```
migrations = [
  { version: 1, up: createApplicationsTable },
  { version: 2, up: createDecisionsTable },
]
```
