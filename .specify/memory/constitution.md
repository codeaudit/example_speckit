<!--
Sync Impact Report
==================
- Version change: N/A → 1.0.0 (initial ratification)
- Added principles:
  - I. Test-First Development
  - II. Simplicity & YAGNI
  - III. Design Quality
- Added sections:
  - Technology Constraints
  - Development Workflow
  - Governance
- Templates requiring updates:
  - .specify/templates/plan-template.md ✅ no changes needed (Constitution Check section is generic)
  - .specify/templates/spec-template.md ✅ no changes needed (structure-agnostic)
  - .specify/templates/tasks-template.md ✅ no changes needed (phase structure compatible)
- Follow-up TODOs: none
-->

# Loan Processing Application Constitution

## Core Principles

### I. Test-First Development (NON-NEGOTIABLE)

- All features MUST have tests written before implementation code.
- Red-Green-Refactor cycle MUST be followed: write a failing test,
  make it pass with minimal code, then refactor.
- No pull request may be merged without passing tests that cover
  the changed behaviour.
- Integration tests MUST exercise the SQLite database directly;
  mocking the data layer is not permitted for integration tests.

### II. Simplicity & YAGNI

- Every addition MUST solve a current, stated requirement — not a
  hypothetical future one.
- The data store is SQLite; do NOT introduce an ORM abstraction
  layer unless a concrete need is demonstrated and documented.
- Prefer flat, obvious code over clever abstractions. Three similar
  lines are better than a premature helper function.
- New dependencies MUST be justified in the PR description. If the
  same result can be achieved with existing dependencies or the
  standard library, use those instead.

### III. Design Quality

- The frontend MUST meet Impeccable design standards: consistent
  spacing, clear visual hierarchy, and purposeful use of colour.
- All user-facing screens MUST be responsive and accessible
  (WCAG 2.1 AA minimum).
- Error states, empty states, and loading states MUST be designed
  — not afterthoughts.
- UI components MUST be reusable where practical and follow a
  shared design-token system for colours, typography, and spacing.

## Technology Constraints

- **Runtime**: Node.js (LTS)
- **Data store**: SQLite (local file-based; no external database
  server required)
- **Frontend design**: Impeccable design system / skills
- **Package manager**: npm
- **Language**: JavaScript or TypeScript (consistent within each
  project area — do not mix)
- New frameworks or major dependencies MUST be approved via a PR
  discussion before adoption.

## Development Workflow

- Every feature MUST start from a branch off `main`.
- Commits MUST be atomic and descriptive — one logical change per
  commit.
- Code reviews are required before merging to `main`.
- The `main` branch MUST always be in a deployable state; broken
  builds MUST be fixed immediately.
- Database schema changes MUST use versioned migration files, never
  manual edits to the SQLite file.

## Governance

- This constitution supersedes ad-hoc practices. When a conflict
  arises between this document and a local convention, this
  document wins.
- **Amendments** require:
  1. A written proposal describing the change and its rationale.
  2. Update to this file with an incremented version number.
  3. A migration plan if existing code must change to comply.
- **Versioning** follows semantic versioning:
  - MAJOR: principle removed or redefined in a backward-incompatible
    way.
  - MINOR: new principle or section added, or material expansion of
    existing guidance.
  - PATCH: clarifications, typo fixes, non-semantic refinements.
- **Compliance reviews**: every PR MUST verify alignment with these
  principles. The plan template's "Constitution Check" section
  enforces this at the design phase.

**Version**: 1.0.0 | **Ratified**: 2026-03-25 | **Last Amended**: 2026-03-25
