# example_speckit Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-26

## Active Technologies
- TypeScript 5.x (strict mode) — same as feature 001 + Next.js 15 (App Router), better-sqlite3, Tailwind CSS, nanoid — all existing (002-customer-prefill-display)
- SQLite via better-sqlite3 (existing `data/loan-app.db`), new migration v3 for `customers` table (002-customer-prefill-display)
- TypeScript 5.x (strict mode) — existing + Next.js 15 (App Router), Tailwind CSS 4.x, better-sqlite3, nanoid — all existing (003-impeccable-design-polish)
- SQLite via better-sqlite3 (existing `data/loan-app.db`) — no changes (003-impeccable-design-polish)
- SQLite via better-sqlite3 (existing `data/loan-app.db`) — no schema changes; email-based join at query time (004-enhanced-officer-workflow)
- TypeScript 5.x (strict mode) + Next.js 15 (App Router), Tailwind CSS 4.x, better-sqlite3, nanoid — all existing (005-impeccable-visual-upgrade)
- TypeScript 6.x (strict mode) + Next.js 16.2.1 (App Router), React 19.2.4, Tailwind CSS 4.2.2, PostCSS 8.5.8 (006-fanniemae-branding)
- SQLite via better-sqlite3 (no changes) (006-fanniemae-branding)

- TypeScript 5.x (strict mode) + Next.js 15 (App Router), shadcn/ui, (001-loan-processing-app)

## Project Structure

```text
src/
tests/
```

## Commands

npm test && npm run lint

## Code Style

TypeScript 5.x (strict mode): Follow standard conventions

## Recent Changes
- 006-fanniemae-branding: Added TypeScript 6.x (strict mode) + Next.js 16.2.1 (App Router), React 19.2.4, Tailwind CSS 4.2.2, PostCSS 8.5.8
- 005-impeccable-visual-upgrade: Added TypeScript 5.x (strict mode) + Next.js 15 (App Router), Tailwind CSS 4.x, better-sqlite3, nanoid — all existing
- 004-enhanced-officer-workflow: Added TypeScript 5.x (strict mode) — existing + Next.js 15 (App Router), Tailwind CSS 4.x, better-sqlite3, nanoid — all existing


<!-- MANUAL ADDITIONS START -->

## Design Context

### Users
Real mortgage loan officers making high-stakes approval/rejection decisions. They need to quickly scan applicant data, review qualification metrics, and take confident action. Speed, clarity, and data density matter more than decoration. Secondary users are borrowers submitting applications and checking status — they need reassurance and simplicity.

### Brand Personality
Professional, trustworthy, precise. LoanPro should feel like a modern fintech dashboard — the kind of tool a loan officer trusts with their daily workflow. No whimsy, no unnecessary flair. Every element earns its place.

### Aesthetic Direction
- **Visual tone**: Clean, corporate-friendly, data-dense where needed, spacious where not
- **Theme**: Light and dark mode (system-preference responsive)
- **Primary color**: Blue-600 (`#2563EB`) — trust, authority, finance
- **Neutrals**: Gray scale (50–900) for hierarchy and structure
- **Accent semantics**: Green for qualified/approved, red for not-qualified/rejected, amber for warnings
- **Anti-references**: Overly playful consumer apps, heavy gradients, rounded bubbly UI, dark-only dashboards
- **References**: Stripe Dashboard, Mercury banking, modern mortgage platforms

### Design Principles
1. **Data clarity first** — Qualification metrics, ratios, and status badges must be instantly scannable. Use consistent formatting for currency, percentages, and dates across all views.
2. **Hierarchy through restraint** — Use font weight, size, and spacing to create hierarchy — not color overload. Reserve color for semantic meaning (status, qualification, actions).
3. **Designed states** — Every component must account for empty, loading, error, and success states. No raw browser defaults or layout shifts.
4. **Accessible by default** — WCAG 2.1 AA minimum. Proper form labels, focus management, keyboard navigation, sufficient color contrast in both light and dark modes.
5. **Consistent density** — Officer views can be data-dense (tables, metric grids). Borrower views should be spacious (forms, confirmations). Match density to user context.

<!-- MANUAL ADDITIONS END -->
