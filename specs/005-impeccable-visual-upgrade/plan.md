# Implementation Plan: Impeccable Visual Upgrade

**Branch**: `005-impeccable-visual-upgrade` | **Date**: 2026-03-25 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/005-impeccable-visual-upgrade/spec.md`

## Summary

Elevate the LoanPro application from a functional but plain interface to a
polished, premium fintech experience. All changes are CSS-only (Tailwind
utility classes): refined transitions, hover effects, subtle depth cues,
animated feedback, and enhanced badges. No new dependencies, no behavioral
changes, no data model modifications.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: Next.js 15 (App Router), Tailwind CSS 4.x, better-sqlite3, nanoid — all existing
**Storage**: SQLite via better-sqlite3 (existing `data/loan-app.db`) — no changes
**Testing**: Vitest (101 existing tests — must all continue to pass)
**Target Platform**: Web (desktop + mobile browsers)
**Project Type**: Web application (Next.js)
**Performance Goals**: All transitions ≤ 200ms, hover responses within one frame
**Constraints**: No new dependencies; CSS-only changes using Tailwind utilities
**Scale/Scope**: ~12 source files modified across `src/app/` and `src/components/`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Test-First Development (NON-NEGOTIABLE) | PASS (with justification) | This is a visual-only upgrade — CSS class changes to existing components. No new behavior, logic, or data flow. Existing 101 tests verify all functional behavior remains intact. Visual verification via quickstart.md scenarios replaces test-first for CSS aesthetics, which are not unit-testable. |
| II. Simplicity & YAGNI | PASS | No new dependencies. All effects use existing Tailwind CSS utilities (transitions, transforms, shadows, gradients). No new abstractions — changes are inline class modifications. |
| III. Design Quality | PASS | This feature directly implements Design Quality principle. Stripe/Mercury-inspired fintech aesthetic. WCAG 2.1 AA maintained. `prefers-reduced-motion` respected. Both light and dark modes supported. |

**Gate Decision**: PASS — all principles satisfied. Test-First is addressed by
existing test suite covering all functional behavior; visual changes are
verified manually via quickstart scenarios since CSS aesthetics are not
amenable to unit testing.

## Project Structure

### Documentation (this feature)

```text
specs/005-impeccable-visual-upgrade/
├── plan.md              # This file
├── research.md          # Phase 0 output — CSS technique decisions
├── quickstart.md        # Phase 1 output — visual verification scenarios
├── checklists/
│   └── requirements.md  # Specification quality checklist
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── globals.css              # Animation keyframes, reduced-motion, transition utilities
│   ├── layout.tsx               # No changes expected
│   ├── page.tsx                 # US1: Hero section + card hover effects
│   ├── apply/page.tsx           # US2: Form page (uses LoanForm)
│   ├── status/page.tsx          # US2: Status page (uses StatusLookup)
│   ├── customers/
│   │   ├── page.tsx             # US3: Customer list table
│   │   └── [id]/page.tsx        # US3: Customer detail + applications
│   └── officer/
│       ├── page.tsx             # US3: Officer customer list
│       ├── [id]/page.tsx        # US2: Decision form page
│       └── customer/[id]/page.tsx  # US3: Officer customer detail
├── components/
│   ├── app-shell.tsx            # US1: Nav bar accent element
│   ├── loan-form.tsx            # US2: Form field transitions, button states
│   ├── status-lookup.tsx        # US2: Form transitions, success animation
│   ├── decision-form.tsx        # US2: Button states, success animation
│   ├── officer-customer-list.tsx # US3: Table row hover transitions
│   ├── customer-applications.tsx # US3: Table hover + badge refinement
│   ├── customer-list.tsx        # US3: Table hover transitions
│   ├── customer-detail.tsx      # Minor: consistent styling
│   ├── application-detail.tsx   # US3: Badge refinement
│   ├── application-list.tsx     # US3: Table hover + badge refinement
│   ├── qualification-summary.tsx # US3: Badge refinement
│   └── customer-select.tsx      # US2: Custom dropdown styling
└── tests/                       # No new tests — existing 101 tests must pass

tests/
├── integration/                 # Existing — no changes
└── unit/                        # Existing — no changes
```

**Structure Decision**: Single Next.js project. All changes are Tailwind class
modifications to existing files. One new CSS section in `globals.css` for
animation keyframes and `prefers-reduced-motion` override. No new component
files expected.

## Complexity Tracking

> No Constitution Check violations — table not needed.
