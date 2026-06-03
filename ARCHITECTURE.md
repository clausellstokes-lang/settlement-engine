# SettlementForge — Architecture

A map of the system for anyone (including future-you) picking this up cold.
This is the *current* shape of the code; for early product/risk commentary see
`ASSESSMENT.md` (historical) and `docs/critique-implementation-status.md`.

---

## What it is

A constraint-driven D&D settlement **simulator** (not a table-roller). A config
(tier, terrain, culture, trade access, threat, priority sliders) is pushed
through a multi-step pipeline that produces an internally-coherent settlement —
economy, factions, institutions, NPCs, stressors, history — rendered as an
on-screen dossier and an exportable PDF, with an optional AI prose layer.

Stack: **React 19 + Zustand 5 + Vite 5 (oxc transform / Rollup build)**, JS with
**JSDoc types** (no `.ts` in app code), **Supabase** (auth, Postgres + RLS, edge
functions), **Stripe** (credits/subscription), **Anthropic** (AI narrative).

---

## Layer map (`src/`)

```
data/        Pure content tables — the moat. ~18k lines: institutionalCatalog,
             namingData, supplyChainData, npcData, historyData, … No logic.
generators/  The engine. Pure, store-agnostic, deterministic (seeded PRNG).
             steps/ holds the 14-step pipeline; the rest are domain generators
             (economic, power, npc, faction, defense, history, resource, …).
domain/      Pure business logic that ISN'T generation: causal state, events,
             entities, contradictions, provenance, migrations, schema, summary.
             This is the ONLY layer type-checked in the gate (tsconfig.json).
store/       Zustand slices (12) — the single client state container.
components/   React UI. Inline-styled, token-driven. Large feature panels +
             primitives/ + new/tabs/ (the dossier tabs) + map/ + auth/.
pdf/         PDF generation: sections/ + primitives/ + lib/viewModel.js.
lib/         Services + glue: saves (Supabase+localStorage), analytics, flags,
             routes, authIntents, customRegistry, dependencyEngine.
hooks/ copy/ design/ config/   Cross-cutting: tokens, copy strings, pricing.
```

**Three-layer rule (respected): `data → generators → presentation`.** Generators
import data and never import React/Zustand, so the whole engine runs headlessly
(tests, scripts, server). The one edge that wires live custom-content into the
generator is `setCustomContentSource(...)` in `store/index.js` — kept there on
purpose so the generator stays store-free.

---

## The generation pipeline

`generators/steps/index.js` registers steps in dependency order; each step
module calls `registerStep()` on import. The runner lives in
`generators/pipeline.js` and threads a **seeded PRNG context** (`rngContext.js`,
`prng.js`) plus an `onStep` callback (used by the UI "pipeline reveal").

Order: `resolveConfig → resolveResources → resolveStress → resolveNeighbour →
assembleInstitutions → subsumptionPass → cascadePass → isolationPass →
generateEconomy → generatePower → neighbourFactions → factionCorrelationPass →
generatePopulation → generateNarratives → assembleSettlement`.

Determinism matters: same seed ⇒ same settlement. This is what makes the
property-based and snapshot tests possible. A **Strangler-Fig** migration is in
flight — legacy `generateSettlement.js` is being replaced by
`generateSettlementPipeline.js`; both still exist.

`structuralValidator.js` validates engine output shape; `settlement.schema.js`
(domain) is the canonical schema and `settlementMigrations.js` upgrades old
saves when the shape changes.

---

## State (`store/index.js`)

One Zustand store composed from 12 slices, with `immer + persist +
subscribeWithSelector + devtools`. **`persist.partialize` deliberately persists
only lightweight, user-owned data (config + toggles)** — never the large
generated settlement object. `onRehydrate` resets the wizard to the mode picker.

`authIntents` (registered here) powers "save-as-signup": an anonymous action is
queued, then replayed with real credentials after the user authenticates.

Auth is **two orthogonal axes**: `tier` (anon / free / premium) × `role`
(user / developer / admin). Permission selectors (`canSave`, `canExport`,
`isElevated`, …) live on the store.

---

## Routing

`lib/routes.js` is the single source of truth: a `ROUTES` table mapping internal
`view` ids ⇄ public paths, plus guards (`auth` / `elevated`). `App.jsx` switches
on `view`; a single `NAV` array (Create · Settlements · World Map · Compendium ·
Gallery · About) lives in `App.jsx`, with Pricing as a secondary header link
(`HERO_LINKS`). Two destinations are folded in rather than top-level: **Workshop
is the "Custom Generate" mode inside Create** (GenerateWizard), and the former
`/compare` pages are a tab on the **About** page (renamed from "How To Use").
`/workshop` and `/compare*` stay as routes that redirect to those surfaces. The
mobile bottom-nav caps at 5 items (slice); desktop shows all visible items.

---

## Backend (`supabase/`)

- **migrations/** (17) — schema + RLS policies + credit ledger + gallery +
  version history + save-limit + profile-security + the auth/credit
  trust-boundary repair (017). RLS is the security spine.
- **functions/** (Deno edge):
  - `generate-narrative` — AI prose. JWT-auth → `spend_credits` RPC (RLS,
    atomic) → bot guard → Opus thesis + parallel Haiku refinement passes →
    `refund_credits` on failure. Anthropic key is server-only.
  - `stripe-webhook` — verifies the signature (`constructEvent`) before acting;
    uses the service-role key (no user JWT on webhooks).
  - `admin-actions` — JWT-auth → profile `role` check → 403; allowlisted
    metadata keys/roles (anti-privilege-escalation).
  - `create-checkout`, `send-email` — JWT-authed.
  - `_shared/` — `aiGroundingBundle.js` is **built** from app code by
    `scripts/build-edge-shared.mjs`; a freshness test fails the gate on drift.

Secrets live in the Supabase dashboard / Vercel env, never in the repo. Client
reads only `VITE_*` vars (see `.env.example`); the anon key is public by design
(RLS enforces access).

---

## Design system

`src/design/tokens.js` is canonical (color, semantic, type, space, radius,
elevation, motion, layout). It also emits CSS custom properties on `:root`
(`emitCssTokens()` in `main.jsx`). `src/components/theme.js` is a thin re-export
shim consumed by ~80 components. Width tokens: `PAGE_MAX` (1200, content/
reference pages), `PROSE_MAX` (820, reading columns), `FORM_MAX` (460, forms).

Drift is enforced by custom ESLint rules (`scripts/eslint-plugin-visual-budget`):
`no-raw-fontsize`, `no-raw-color`, `no-raw-button-copy` — all **errors**.

---

## The gate

`npm run check` = `validate:data && typecheck && lint && test && build`.

- **validate:data** — duplicate-key scan (dupe keys silently corrupt sim output).
- **typecheck** — `tsc --noEmit` over **`src/domain` only** (the rest carries a
  tracked type-debt punch-list; see `tsconfig.full.json` + `npm run
  typecheck:full`).
- **lint** — ESLint over `src/ tests/ scripts/`. Correctness = error,
  forward-looking React 19 + unused-vars = warn. Plus the visual-budget and
  analytics-event contracts (error).
- **test** — Vitest, ~2,400 tests / ~159 files (unit, property-based, domain/
  store/lib integration, component/UI smoke, a11y, security, edge-function).
- **build** — Vite/Rollup. `vite.config.js` `onwarn` **promotes missing/
  unresolved named imports to hard errors** (see Gotchas).

Runs in CI (`.github/workflows/ci.yml`) on push/PR and via husky `pre-push`;
`pre-commit` runs lint-staged `eslint --fix`. E2E (Playwright, `e2e/`) is
separate (`npm run test:e2e`), not in the default gate.

---

## Conventions & gotchas (read before editing)

- **Unused imports/vars use the `_` prefix** so `no-unused-vars` ignores them.
  For a **named import** the correct form is `import { Foo as _Foo }` — NOT a
  bare `import { _Foo }`. Bare `_Foo` requests a *non-existent* export: it
  renders `undefined` in prod and crashes dev ESM. The build now catches this
  (onwarn → error), but write the alias form to begin with.
- **Only `src/domain` is type-checked** in the gate. A bug expressible only in
  store/lib/components/pdf types won't be caught by `typecheck` — lean on tests
  and the build guard. Chip the punch-list down with `typecheck:full`.
- **`OutputContainer.jsx`** (the dossier renderer) is written in raw
  `React.createElement`, not JSX — the densest, highest-stakes view. Edit
  carefully; it's a candidate for a test-guarded JSX refactor.
- **`public/map/main.js`** is a ~1.4k-line fork of Azgaar FMG — outside all
  gates, reconciled by hand on upstream releases (`docs/fmg-fork.md`).
- **PDF parity**: the on-screen dossier and the PDF render from related but
  separate code (`pdf/lib/viewModel.js`); changing one can drift the other
  (`PDF_PARITY_AUDIT.md`).
- **Deploy**: pushing `master` deploys live (Vercel). See `docs/DEPLOY.md` for
  gating that on CI.
- **Bus factor is one.** Plan-file vocabulary (`P1xx`, "Pillars A–H") and a
  single authorial voice run throughout. This file exists to lower the cost of a
  second contributor.
