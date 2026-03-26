# Implementation Plan: FannieMae UI Branding

**Branch**: `006-fanniemae-branding` | **Date**: 2026-03-26 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/006-fanniemae-branding/spec.md`

## Summary

Rebrand the LoanPro application with FannieMae's visual identity: replace the default Tailwind blue/gray palette with FannieMae's corporate colors (#23517C primary, #0C77BA interactive), adopt Source Sans Pro typography, remove dark mode to match FannieMae's light-only institutional aesthetic, update the header to "LoanPro by Fannie Mae", and centralize all brand values as Tailwind CSS custom theme tokens. This is a visual-only change — no layout, functionality, or data model changes.

## Technical Context

**Language/Version**: TypeScript 6.x (strict mode)
**Primary Dependencies**: Next.js 16.2.1 (App Router), React 19.2.4, Tailwind CSS 4.2.2, PostCSS 8.5.8
**Storage**: SQLite via better-sqlite3 (no changes)
**Testing**: Vitest 3.2.4, React Testing Library
**Target Platform**: Web browser (desktop + responsive mobile)
**Project Type**: Web application (Next.js)
**Performance Goals**: No performance impact — CSS-only changes
**Constraints**: WCAG 2.1 AA contrast ratios for all text/interactive elements; light-only theme
**Scale/Scope**: 13 components, 7 pages, 1 layout file, 1 CSS file — all need color/font updates

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Test-First Development | PASS | Visual regression tests will verify brand colors, font loading, and dark mode removal before implementation changes |
| II. Simplicity & YAGNI | PASS | No new abstractions — brand tokens defined as Tailwind theme extensions in existing globals.css. No new dependencies beyond Google Fonts (Source Sans Pro). Changes solve a stated requirement (rebrand). |
| III. Design Quality | PASS | FannieMae palette meets WCAG 2.1 AA. Centralized tokens ensure consistent spacing, hierarchy, and color usage. All states (empty, loading, error) retain their design treatment with updated colors. |
| Technology Constraints | PASS | No new frameworks. Source Sans Pro loaded via next/font (already a Next.js built-in). No new npm dependencies required. |
| Development Workflow | PASS | Work on feature branch off main. CSS/component changes are atomic per-component commits. |

**Gate result: PASS** — no violations.

## Project Structure

### Documentation (this feature)

```text
specs/006-fanniemae-branding/
├── plan.md              # This file
├── research.md          # Phase 0: brand token research
├── data-model.md        # Phase 1: brand token definitions
├── quickstart.md        # Phase 1: implementation quickstart
├── contracts/           # Phase 1: UI contracts
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── globals.css           # FannieMae theme tokens + font import + dark mode removal
│   ├── layout.tsx            # Font provider setup (next/font)
│   ├── page.tsx              # Home page — update colors
│   ├── apply/page.tsx        # Apply page — update colors
│   ├── status/page.tsx       # Status page — update colors
│   ├── customers/page.tsx    # Customer list — update colors
│   ├── customers/[id]/page.tsx  # Customer detail — update colors
│   ├── officer/page.tsx      # Officer list — update colors
│   ├── officer/[id]/page.tsx # Application detail — update colors
│   └── officer/customer/[id]/page.tsx  # Officer customer view — update colors
├── components/
│   ├── app-shell.tsx         # Header rebrand ("LoanPro by Fannie Mae"), remove theme toggle, update nav colors
│   ├── theme-toggle.tsx      # DELETE — dark mode removed
│   ├── loan-form.tsx         # Update form field colors, button colors
│   ├── application-list.tsx  # Update table colors, status badge colors
│   ├── application-detail.tsx # Update detail card colors
│   ├── customer-list.tsx     # Update table colors
│   ├── customer-detail.tsx   # Update detail card colors
│   ├── customer-applications.tsx # Update table colors
│   ├── customer-select.tsx   # Update select/form colors
│   ├── decision-form.tsx     # Update form colors, approval/rejection buttons
│   ├── status-lookup.tsx     # Update form/result colors
│   ├── qualification-summary.tsx # Update metric card colors, pass/fail badges
│   └── officer-customer-list.tsx # Update table colors
└── lib/
    └── theme-context.tsx     # DELETE — dark mode removed

tests/
└── (visual regression tests for brand compliance)
```

**Structure Decision**: Existing Next.js App Router structure is preserved. No new directories. Two files deleted (theme-toggle.tsx, theme-context.tsx). Brand tokens centralized in globals.css via Tailwind CSS v4 theme extension syntax.

## Complexity Tracking

> No violations — table intentionally empty.
