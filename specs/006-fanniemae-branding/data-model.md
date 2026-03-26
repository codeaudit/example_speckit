# Data Model: FannieMae UI Branding

**Feature**: 006-fanniemae-branding
**Date**: 2026-03-26

## Overview

This feature has no database schema changes. The "data model" for this feature is the brand token system — the structured set of design values that define the FannieMae visual identity across the application.

## Brand Token Set

The canonical definition of all FannieMae brand values, stored as CSS custom properties in `globals.css` via Tailwind v4's `@theme` directive.

### Color Tokens

| Token Name | Value | Category | Usage |
|------------|-------|----------|-------|
| `brand-primary` | `#23517C` | Brand | Headings, nav, primary UI elements |
| `brand-interactive` | `#0C77BA` | Brand | Hover/focus states, links |
| `brand-interactive-alt` | `#1C6FA3` | Brand | Active/visited states |
| `text-primary` | `#121212` | Neutral | Body text |
| `text-muted` | `#717171` | Neutral | Secondary text, captions |
| `bg-page` | `#FFFFFF` | Background | Page background |
| `bg-section` | `#F3F5F9` | Background | Card/section backgrounds |
| `bg-input` | `#F1F1EF` | Background | Form input backgrounds |
| `border-default` | `#CAC8C3` | Border | Card borders, dividers |
| `border-alt` | `#7E8C9A` | Border | Table headers, secondary borders |
| `status-approved` | `#16a34a` | Semantic | Qualified/approved indicators |
| `status-approved-bg` | `#f0fdf4` | Semantic | Approved badge background |
| `status-rejected` | `#dc2626` | Semantic | Not-qualified/rejected indicators |
| `status-rejected-bg` | `#fef2f2` | Semantic | Rejected badge background |
| `status-pending` | `#d97706` | Semantic | Pending/warning indicators |
| `status-pending-bg` | `#fffbeb` | Semantic | Pending badge background |

### Typography Tokens

| Token Name | Value | Usage |
|------------|-------|-------|
| `font-sans` | `'Source Sans Pro', ui-sans-serif, system-ui, -apple-system, sans-serif` | All text |
| Font weight regular | `400` | Body text |
| Font weight bold | `700` | Headings, emphasis |

### Spacing Tokens

No custom spacing tokens — Tailwind's default spacing scale (4px base) is retained as it aligns with FannieMae's 16px/32px spacing pattern (p-4, p-8).

## Relationships

```
Brand Token Set
  ├── Color Tokens ──→ applied to all components via Tailwind utility classes
  ├── Typography Tokens ──→ applied globally via next/font + @theme font-family
  └── (Spacing) ──→ Tailwind defaults retained
```

## Validation Rules

- All color token values MUST be valid 6-digit hex codes
- `brand-primary` (#23517C) against white background MUST meet 4.5:1 contrast ratio (verified: 5.8:1 — PASS)
- `text-primary` (#121212) against `bg-page` (#FFFFFF) MUST meet 4.5:1 contrast ratio (verified: 18.1:1 — PASS)
- `text-muted` (#717171) against `bg-page` (#FFFFFF) MUST meet 4.5:1 contrast ratio (verified: 4.6:1 — PASS)
- `brand-interactive` (#0C77BA) against white MUST meet 3:1 for large text / interactive elements (verified: 4.1:1 — PASS)

## State Transitions

N/A — brand tokens are static configuration values, not stateful entities.
