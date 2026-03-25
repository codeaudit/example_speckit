# Implementation Plan: Impeccable Design Polish

**Branch**: `003-impeccable-design-polish` | **Date**: 2026-03-25 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/003-impeccable-design-polish/spec.md`

## Summary

Apply comprehensive design polish across all existing pages and components: add dark mode support via Tailwind CSS 4 `dark:` variant (system-preference responsive), establish consistent typographic scale and spacing, standardize semantic badge colors, add proper hover/focus states to all interactive elements, and replace raw loading text with skeleton/spinner treatments. No new features, routes, or data models — visual changes only.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode) — existing
**Primary Dependencies**: Next.js 15 (App Router), Tailwind CSS 4.x, better-sqlite3, nanoid — all existing
**Storage**: SQLite via better-sqlite3 (existing `data/loan-app.db`) — no changes
**Testing**: Vitest with React Testing Library (existing configuration)
**Target Platform**: Local development server (Node.js 20+ LTS)
**Project Type**: Web application (single Next.js project — existing)
**Performance Goals**: No performance regression; pages must load within existing 2-second target
**Constraints**: Visual-only changes; no new dependencies; all 85 existing tests must continue to pass
**Scale/Scope**: ~15 existing files (components, pages, layout, globals.css) need styling updates

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Test-First Development | PASS | Visual polish has no new business logic. Existing tests cover functional behavior and must continue to pass. Visual regression testing done manually via browser. |
| II. Simplicity & YAGNI | PASS | No new dependencies. Dark mode uses Tailwind CSS 4 built-in `dark:` variant with `@media (prefers-color-scheme: dark)`. No manual toggle (spec confirms system-preference only). |
| III. Design Quality | PASS | This feature IS the Design Quality implementation — dark mode, WCAG 2.1 AA contrast, semantic colors, designed states, consistent typography. |

No violations — all gates pass.

## Project Structure

### Documentation (this feature)

```text
specs/003-impeccable-design-polish/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

Note: No `data-model.md` or `contracts/` needed — this is a visual-only feature with no new data models or API endpoints.

### Source Code (repository root)

```text
src/
├── app/
│   ├── globals.css               # Dark mode CSS variables, theme tokens
│   ├── layout.tsx                # Dark mode <html> class, nav theming
│   ├── page.tsx                  # Home page card polish
│   ├── apply/
│   │   └── page.tsx              # Apply page polish
│   ├── status/
│   │   └── page.tsx              # Status page polish
│   ├── officer/
│   │   ├── page.tsx              # Officer dashboard polish
│   │   └── [id]/
│   │       └── page.tsx          # Officer detail polish
│   └── customers/
│       ├── page.tsx              # Customer directory polish
│       └── [id]/
│           └── page.tsx          # Customer detail polish
├── components/
│   ├── application-list.tsx      # Table dark mode, badge colors, typography
│   ├── application-detail.tsx    # Detail card dark mode, typography
│   ├── qualification-summary.tsx # Metric display polish, semantic colors
│   ├── decision-form.tsx         # Form dark mode, focus states
│   ├── loan-form.tsx             # Form dark mode, focus states
│   ├── status-lookup.tsx         # Lookup form polish
│   ├── customer-list.tsx         # Table dark mode, hover states
│   ├── customer-detail.tsx       # Profile card dark mode
│   └── customer-select.tsx       # Dropdown dark mode, focus states
└── types/
    └── index.ts                  # No changes

tests/                            # No new tests; all 85 existing tests must pass
```

**Structure Decision**: Single Next.js project — no structural changes. Only `.css` and `.tsx` files modified for styling.
