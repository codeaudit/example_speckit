# Demo Script: SpecKit-Driven Development — From Zero to Production App

**Duration**: ~12-15 minutes
**Audience**: Developers, tech leads, product managers interested in AI-assisted structured development

---

## Act 1: The Problem (1 minute)

> "When you ask an AI to build something, you typically get a one-shot code dump. No spec. No plan. No traceability. If you want changes later, the AI has no memory of why things were built the way they were.
>
> SpecKit solves this by giving AI-driven development the same rigor as traditional software engineering — but at AI speed. Constitution, specifications, plans, tasks, implementation — each as a distinct, auditable phase.
>
> Let me show you how we built a complete mortgage loan processing application from a single sentence."

---

## Act 2: The Foundation — Constitution (1 minute)

**Show**: `.specify/memory/constitution.md`

> "Everything starts with a constitution — the project's non-negotiable principles. Ours has three:
>
> 1. **Test-First Development** — tests before code, no mocks for integration tests
> 2. **Simplicity & YAGNI** — SQLite, no ORMs, no premature abstractions
> 3. **Design Quality** — WCAG AA, responsive, designed states for everything
>
> Every feature we build gets checked against this constitution. It's the guardrail that prevents AI from over-engineering or cutting corners."

**Show**: `/speckit.constitution` command briefly

---

## Act 3: The SpecKit Workflow — Six Commands (2 minutes)

> "SpecKit has six commands that form a pipeline. Let me walk through what each one does."

**Show on screen** (draw or slide):

```
/speckit.specify -> /speckit.clarify -> /speckit.plan -> /speckit.tasks -> /speckit.implement
                                                                               |
                                                                      /speckit.analyze
```

> "**Specify** — takes a natural-language description and produces a business-focused spec. User stories with priorities, acceptance scenarios, functional requirements, success criteria. No implementation details — it's written for stakeholders.
>
> **Clarify** — scans the spec for ambiguity across 11 taxonomy categories. Asks up to 5 targeted questions, one at a time, with recommended answers. Each answer is integrated into the spec immediately.
>
> **Plan** — generates the technical implementation plan. Research decisions with rationale and rejected alternatives. Data model. Interface contracts. Constitution compliance check. All grounded in the actual codebase.
>
> **Tasks** — produces a dependency-ordered, checkboxed task list organized by user story. Each task has a file path, parallel markers, and story labels. Ready for an LLM to execute without further context.
>
> **Implement** — executes every task, checks off completed items, runs tests, and validates the result.
>
> **Analyze** — cross-artifact consistency check after the fact."

---

## Act 4: Feature Evolution — Show the Journey (5 minutes)

**Show**: `specs/` directory listing — 6 features

> "We built this app across 6 features, each one following the SpecKit pipeline. Let me walk through the progression."

### Feature 001: Loan Processing App (the core)

**Show**: `specs/001-loan-processing-app/` artifacts

> "Started with one sentence: 'Build a mortgage loan processing application.' SpecKit generated a spec with user stories for borrowers applying, officers reviewing, and qualification calculations. The plan chose Next.js, SQLite, Tailwind. Tasks broke it into phases — setup, data layer, forms, officer dashboard. The result: a working app with 94 tests."

**Show**: The app at `/` briefly — point out the original design

### Feature 002: Customer Prefill & Display

> "Next: 'Add customer management with pre-fill on the application form.' The clarify step caught an important question — should customers be created automatically from applications or managed separately? That decision shaped the entire data model."

**Show**: `specs/002-customer-prefill-display/data-model.md` briefly

### Feature 004: Enhanced Officer Workflow

> "Then: 'Officers should see customers, their loan status, and apply reviews.' This one went through a PR and was merged to main. SpecKit tracks feature branches — each feature gets its own branch automatically."

**Show**: `git log --oneline --all --graph` — point out the PR merges

### Feature 005: Impeccable Visual Upgrade

> "We integrated with the Impeccable design plugin to upgrade the visual quality — animations, micro-interactions, polish."

### Feature 006: FannieMae Branding (live demo)

> "And finally, the one we'll demo live — rebranding the entire app to Fannie Mae's corporate identity."

**Show**: `specs/006-fanniemae-branding/` — all 8 artifacts

> "Look at what SpecKit produced for this feature:
> - **spec.md** — 10 functional requirements, 6 success criteria, 3 user stories
> - **research.md** — 6 research decisions with rationale (color palette, typography, dark mode removal, header identity, theming approach, accent bar)
> - **data-model.md** — brand token definitions with WCAG contrast verification
> - **contracts/** — the UI brand contract defining exactly what every component must look like
> - **tasks.md** — 31 tasks across 6 phases, with parallel execution markers
> - **checklists/** — quality validation checklist, all 16 items passing"

---

## Act 5: The Clarify Step — Decisions That Matter (1 minute)

**Show**: `specs/006-fanniemae-branding/spec.md` — the Clarifications section

> "The clarify step asked two questions that materially changed the implementation:
>
> 1. **Dark mode** — Fannie Mae's website is light-only. Should we keep dark mode? Answer: drop it. That removed 200+ dark mode classes and 2 files.
>
> 2. **Header identity** — 'Fannie Mae' replacing 'LoanPro', or combined? Answer: 'LoanPro by Fannie Mae.'
>
> These aren't cosmetic questions. The dark mode decision affected every single component. Without the clarify step, we'd have built the wrong thing and reworked it later."

---

## Act 6: The Implementation — Parallel Agents (1 minute)

> "The implement step executed 31 tasks in phases:
>
> - Phase 1: Defined brand tokens in one CSS file — single source of truth
> - Phase 2: Removed dark mode infrastructure — deleted files, stripped classes
> - Phases 3 & 4: Updated all officer and borrower components — **in parallel using two agents**, each handling different files simultaneously
> - Phase 5: Audited for any remaining hardcoded colors — grep confirmed zero
> - Phase 6: Verified WCAG contrast, font rendering, flat design compliance
>
> TypeScript compiled clean. All 94 tests passed. Zero off-brand colors. Zero dark mode artifacts."

---

## Act 7: Live Demo — The Result (3 minutes)

**Open the app at `localhost:3000`**

> "Here's the result."

**Home page**: Point out header branding, corporate blue, Source Sans Pro, flat accent bar, card styling

**Navigate to `/apply`**: Search "John" -> select John Carter -> fill in loan details -> submit

> "Borrower flow — clean, institutional, trustworthy. Exactly what Fannie Mae's brand conveys."

**Show confirmation**: Reference number, green success state

**Navigate to `/officer`**: Click into a customer -> view an application -> show qualification metrics

> "Officer dashboard — data-dense where it needs to be. Status badges use semantic colors harmonized with the cool-toned palette."

**Open `fanniemae.com` side by side**: Compare colors, typography, overall feel

> "Same brand DNA. Same corporate blue. Same Source Sans Pro. Same flat, institutional aesthetic."

---

## Act 8: The Artifacts — Traceability (1 minute)

> "Every decision is traceable. If someone asks 'why did we drop dark mode?' — it's in the clarification log. 'Why Source Sans Pro and not Source Sans 3?' — it's in research.md with alternatives considered. 'What are the exact brand colors?' — data-model.md has the full token table with WCAG contrast ratios verified.
>
> This isn't just code. It's a documented engineering decision chain from requirement to implementation."

**Show**: Quick scroll through `research.md` — point out the Decision / Rationale / Alternatives structure

---

## Act 9: The Numbers (30 seconds)

> "Across 6 features:
> - **6 specifications** with prioritized user stories
> - **6 implementation plans** with constitution checks
> - **6 research documents** with documented trade-offs
> - **~150 total tasks** generated and executed
> - **94 passing tests**
> - **2 PRs merged** to main
> - **22 components and pages** rebranded in the latest feature
>
> All driven by natural language descriptions, structured by SpecKit, implemented by Claude."

---

## Closing (30 seconds)

> "SpecKit turns AI coding from 'generate and pray' into a repeatable engineering process. The AI follows the same discipline a good team would — spec, clarify, plan, build, verify — just faster. And every artifact it produces is human-readable, auditable, and versionable in git.
>
> That's SpecKit-driven development."

---

## Backup: Q&A Talking Points

- **"What if the spec is wrong?"** — That's what `/speckit.clarify` catches. It scans 11 taxonomy categories for ambiguity before any code is written.
- **"Can I skip steps?"** — Yes, but SpecKit warns you about increased rework risk. The pipeline is designed to catch mistakes early when they're cheap to fix.
- **"Does it work with existing codebases?"** — Yes. The plan phase reads the actual codebase structure, and tasks reference real file paths.
- **"What about the constitution?"** — It's a living document. Amendments require a proposal, version bump, and migration plan. Every plan checks compliance.
