# UI Brand Contract: FannieMae Theme

**Feature**: 006-fanniemae-branding
**Date**: 2026-03-26

## Purpose

Defines the visual contract that all UI components must satisfy after the FannieMae rebrand. This contract is the acceptance reference for visual regression testing.

## Color Contract

### Primary Brand Colors

Every component rendering a primary action, heading, or navigation element MUST use these exact values:

| Element Type | Property | Token | Value |
|-------------|----------|-------|-------|
| Page headings (h1, h2) | `color` | `brand-primary` | `#23517C` |
| Navigation links | `color` | `brand-primary` | `#23517C` |
| Primary buttons | `background-color` | `brand-primary` | `#23517C` |
| Link hover states | `color` | `brand-interactive` | `#0C77BA` |
| Button hover states | `background-color` | `brand-interactive` | `#0C77BA` |
| Focus rings | `ring-color` | `brand-interactive` | `#0C77BA` (with opacity) |

### Neutral Colors

| Element Type | Property | Token | Value |
|-------------|----------|-------|-------|
| Body text | `color` | `text-primary` | `#121212` |
| Secondary text | `color` | `text-muted` | `#717171` |
| Page background | `background-color` | `bg-page` | `#FFFFFF` |
| Card/section background | `background-color` | `bg-section` | `#F3F5F9` |
| Form input background | `background-color` | `bg-input` | `#F1F1EF` |
| Card borders | `border-color` | `border-default` | `#CAC8C3` |
| Table header borders | `border-color` | `border-alt` | `#7E8C9A` |

### Status Colors

| Status | Text Color | Background Color |
|--------|-----------|-----------------|
| Approved/Qualified | `#16a34a` | `#f0fdf4` |
| Rejected/Not Qualified | `#dc2626` | `#fef2f2` |
| Pending | `#d97706` | `#fffbeb` |

## Typography Contract

| Element | Font Family | Weight | Size |
|---------|-------------|--------|------|
| All text | Source Sans Pro (+ fallback stack) | — | — |
| Page titles | Source Sans Pro | 700 | text-2xl (24px) |
| Section headings | Source Sans Pro | 700 | text-xl (20px) |
| Navigation links | Source Sans Pro | 400 | text-sm (14px) |
| Body text | Source Sans Pro | 400 | text-base (16px) |
| Labels/captions | Source Sans Pro | 400 | text-sm (14px) |
| Table headers | Source Sans Pro | 700 | text-xs (12px) uppercase |

## Header Identity Contract

The application header MUST display:
- **"LoanPro"** — `text-lg font-bold` in `brand-primary` (#23517C)
- **"by Fannie Mae"** — `text-sm font-normal` in `text-muted` (#717171)
- Positioned left in the navigation bar
- Links to home page (`/`)

## Dark Mode Contract

- **No dark mode**: The application MUST NOT render dark mode styles
- The `dark:` variant MUST NOT be present in any component class
- No theme toggle component exists in the navigation
- No ThemeProvider context wraps the application
- `prefers-color-scheme` media query MUST NOT alter the application appearance

## Accessibility Contract

- All text on white (#FFFFFF) background meets 4.5:1 contrast ratio
- All text on section (#F3F5F9) background meets 4.5:1 contrast ratio
- Interactive elements have visible focus indicators using `brand-interactive`
- Status information is conveyed through text labels, not color alone
- Form inputs have associated labels

## Flat Design Contract

- No CSS gradients (`background-image: linear-gradient` etc.)
- Shadows limited to `shadow-sm` on interactive elements only
- No rounded-full on containers (allowed on badges/pills only)
- Clean borders using `border-default` (#CAC8C3) — 1px solid
