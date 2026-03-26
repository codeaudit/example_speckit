# Quickstart: FannieMae UI Branding

**Feature**: 006-fanniemae-branding
**Date**: 2026-03-26

## What This Feature Does

Rebrands the LoanPro application with FannieMae's corporate visual identity. This is a CSS/styling-only change — no functionality, data model, or layout changes.

## Key Changes

1. **Brand tokens** defined in `globals.css` via Tailwind v4 `@theme` — single source of truth for all colors
2. **Source Sans Pro** font loaded via `next/font/google` in `layout.tsx`
3. **Dark mode removed** — deleted ThemeProvider, theme toggle, all `dark:` classes
4. **Header updated** to "LoanPro by Fannie Mae"
5. **All 13 components + 7 pages** updated to use brand tokens instead of default Tailwind colors
6. **Gradient accent bar** replaced with flat solid bar

## Implementation Order

1. Define brand tokens in `globals.css` (`@theme` block)
2. Set up Source Sans Pro font in `layout.tsx`
3. Remove dark mode infrastructure (delete files, strip `dark:` classes)
4. Update `app-shell.tsx` (header identity, nav colors, remove theme toggle)
5. Update each component to use brand tokens
6. Update each page to use brand tokens
7. Visual verification against FannieMae.com

## Brand Reference

| Token | Hex | Tailwind Class |
|-------|-----|---------------|
| Primary | `#23517C` | `text-brand-primary`, `bg-brand-primary` |
| Interactive | `#0C77BA` | `text-brand-interactive`, `bg-brand-interactive` |
| Body text | `#121212` | `text-text-primary` |
| Muted text | `#717171` | `text-text-muted` |
| Page bg | `#FFFFFF` | `bg-bg-page` |
| Section bg | `#F3F5F9` | `bg-bg-section` |
| Input bg | `#F1F1EF` | `bg-bg-input` |
| Border | `#CAC8C3` | `border-border-default` |

## Testing

- Visual comparison of every page against the UI brand contract
- WCAG contrast ratio verification for all text/background combinations
- Verify Source Sans Pro renders correctly (check font inspector)
- Verify no `dark:` classes remain in any component
- Verify theme toggle is completely removed
