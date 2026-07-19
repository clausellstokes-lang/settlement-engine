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

Stack: **React 19 + Zustand 5 + Vite 7 5 (oxc transform / Rollup build)**, JS with
**JSDoc types** (no `.ts` in app code), **Supabase** (auth, Postgres + RLS, edge
functions), **Stripe** (credits/subscription), **Anthropic** (AI narrative).

---

## Layer map (`src/`)

```
data/        Pure content tables — the moat. ~18k lines: institutionalCatalog,
             namingData, supplyChainData, npcData, historyData, … No logic.
kernel/      Determinism primitives — the seeded-PRNG seam (prng.js) and its
             global context (rngContext.js). Tiny, dependency-free (only
             seedrandom); the lowest engine layer, which generators and domain
             both build on. Its own first-paint chunk (`kernel`), so the
             createPRNG seam never drags the lazy engine chunk into first paint.
generators/  The engine. Pure, store-agnostic, deterministic (seeded PRNG).
             steps/ holds the 20-step pipeline; the rest are domain generators
             (economic, power, npc, faction, defense, history, resource, …).
             Bundled as the ~514 kB lazy `engine` chunk — fetched on first
             Generate (settlementSlice's loadEngine dynamic import), NOT on
             first paint. The small slice the entry legitimately reaches (the
             coherence draft-check, neighbour backlink, pipeline-rail labels +
             their influence-scoring spine) rides a separate first-paint
             `engine-core` chunk. <!-- @enforced-by tests/build/vendorPdfLazy.test.js -->
domain/      Pure business logic that ISN'T generation: causal state, events,
             entities, contradictions, provenance, migrations, schema, summary,
             the **campaign world-pulse simulation** (`worldPulse/` — ~126 modules
             that age a canonized region tick-by-tick: proposals, party impacts,
             the multi-tick interval orchestrator, PLUS the geopolitical
             subsystems — war & siege (`warDeployment`/`occupation`/`attrition`/
             `mobilization`), trade war & blockade (`tradeWar`/`blockadeTransport`/
             `tradeSalience`), religion (`religionState`/`pantheon`/`religiousContest`/
             divine mandate), coups & faction competition, and NPC agency; the
             shared sim-shape typedefs live in `pulseShapes.js`), the **spatial-canon
             engine** (`spatial/` — the Phase 5.5 KEYSTONE, ~26 modules that make the
             realm map a first-class engine input; see "The spatial engine" below),
             regional causality (`region/`), and the fail-closed public-safe display
             projection (`display/`). Every roll forks a seeded, injected RNG (determinism is
             sacred — no Date.now/Math.random). Was the only gate-typechecked layer;
             the gate now covers the full tree, and `worldPulse/` also carries a
             strict-typecheck ratchet + an any-cast burn-down ratchet
             (scripts/count-domain-any.mjs). <!-- @enforced-by tsconfig.full.json + tsconfig.domain-strict.json + tests/lint/domainAnyCastBaseline.test.js -->
store/       Zustand slices (15) — the single client state container, incl. the
             campaign world-pulse, regional, and account-import slices.
components/   React UI. Inline-styled, token-driven. Large feature panels +
             primitives/ (accessible Dialog/Button/Toast, no native dialogs;
             raw <button> outside primitives/ is forbidden for new files —
             @enforced-by jsx-hygiene/no-raw-button + tests/lint/rawButtonBaseline.test.js,
             existing files burning down; every icon-only button must carry an
             accessible name — @enforced-by jsx-hygiene/icon-button-needs-label) +
             new/tabs/ (dossier tabs) + gallery/ (community gallery) + map/ (World
             Map + Realm hub) + auth/ + account/ + admin/ + pricing/ + purchase/ +
             home/ (landing) + region/ + legal/ (terms/privacy/refunds).
pdf/         PDF generation: sections/ + primitives/ + lib/viewModel.js.
lib/         Services + glue: saves (Supabase+localStorage), analytics, flags,
             routes, authIntents, customRegistry, dependencyEngine.
hooks/ copy/ design/ config/   Cross-cutting: tokens, copy strings, pricing.
```

**The real layer map: `data → kernel → { generators, domain } → store → components/pdf`.**
`generators` and `domain` are mutually-dependent PEER engine layers by design —
generators reuse domain vocabulary (trace, magicFilter, goodsCatalog,
customContentSchema, factionArchetypes) and domain reuses engine derivations
(structuralValidator, crossSettlementConflicts, computeActiveChains). Both build
on `kernel`, the shared determinism primitives (`createPRNG` / `rngContext`).
The ONE invariant that is enforced, and the one that matters: **nothing under
`src/kernel`, `src/data`, `src/generators`, or `src/domain` imports React,
Zustand, or the store** — that is what keeps the whole engine headless (tests,
scripts, server). Dependency cycles are pinned to a frozen 4-cycle baseline that
may only shrink.
<!-- @enforced-by tests/architecture/layerBoundaries.test.js -->
The one edge that wires live custom-content into the generator is
`setCustomContentSource(...)` in `store/index.js` — kept there on purpose so
the generator stays store-free.

---

## The generation pipeline

`generators/steps/index.js` registers steps in dependency order; each step
module calls `registerStep()` on import. The runner lives in
`generators/pipeline.js` and threads a **seeded PRNG context**
(`kernel/rngContext.js`, `kernel/prng.js`) plus an `onStep` callback (used by
the UI "pipeline reveal").

Order (20 steps): `resolveConfig → resolveResources → resolveStress →
resolveNeighbour → assembleInstitutions → subsumptionPass → cascadePass →
isolationPass → stressConfirmPass → generateEconomy → generatePower →
neighbourFactions → factionCorrelationPass → economyReconcilePass →
structuralValidationPass → generatePopulation → corruptionPass →
seedStartingPantheon → generateNarratives → assembleSettlement`.
<!-- @enforced-by tests/docs/architectureFreshness.test.js (derived from steps/index.js) -->

Determinism matters: same seed ⇒ same settlement — pinned by a 155-config
golden-master hash manifest and enforced by construction (seeded per-step PRNG
forks; Math.random/Date/localeCompare banned by lint in the engine + domain).
The **Strangler-Fig** migration is COMPLETE: legacy `generateSettlement.js` is
deleted; `generateSettlementPipeline.js` is the only entry point. The three
big domain generators (economic/power/services) are thin barrels over
`economy/` + `power/` + `services/` modules (≤800 lines each, ratchet-enforced).

`structuralValidator.js` validates engine output shape; `settlement.schema.js`
(domain) is the canonical schema and `settlementMigrations.js` upgrades old
saves when the shape changes.

---

## The spatial engine + the engine-wave stack

Phase 5.5 added a **spatial-canon engine** (`src/domain/spatial/`, ~26 modules)
that promotes the realm map to a first-class engine input: settlements carry
positions, neighbours, and travel costs, and an M1–M11 "mover ladder" ages the
realm tick-by-tick (migration, trade lanes, war fronts, discovery, calamity,
upswing). On top of the physical movers sits a stack of **engine waves** — tempo
governance (E0), the generosity instruments (E1), war/peace reasoning + treaties
(W-PEACE), and the four doctrine layers (supply-web warfare, information
statecraft, the corruption web, settlement politics). Every one ships **dormant
and gated**: with its feature absent or its flag off, generation is byte-identical
to before it existed.

The constitution these obey — **same-seed byte-identity, dormancy, and the
first-paint ratchet** — is deliberately NOT restated here (a second copy would
drift). It lives in `docs/PHASE55_EXECUTION_PLAYBOOK.md` §0.2 (constitutional
laws), with the mover ladder and wave stack recorded in §0.0. That playbook is the
authority for anything that changes engine behaviour or first-paint cost; this
section is only the entry pointer to it.
<!-- @enforced-by tests/docs/architectureFreshness.test.js (must mention src/domain/spatial) -->

---

## State (`store/index.js`)

One Zustand store composed from 17 slices, with `immer + persist +
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
on `view`; the **`NAV` is derived from the `ROUTES` table** (Create · Welcome ·
Library · Realm · Compendium · Gallery · About), with Pricing as a secondary
header link. `/` is a marketing front door that resolves to the **Welcome/home**
landing (returning members route on to their workspace). The former `/compare`
pages are a tab on the **About** page (renamed from "How To Use"); Workshop /
"Custom Generate" was removed entirely. `/workshop` and `/compare*` stay as routes
that redirect to those surfaces. Public gallery dossiers deep-link at
`/gallery/:slug`, prerendered with per-slug OG tags for non-JS scrapers by
`api/gallery-meta.js` (a Vercel rewrite that precedes the SPA catch-all). The
mobile bottom-nav caps at 5 items (Realm is off the mobile bottom nav); desktop
shows all visible items.

---

## Backend (`supabase/`)

- **migrations/** (155) — prod applied head tracked in `supabase/applied-head.json`,
  ledger-checked by `npm run validate:migration-head`. Schema + RLS policies + credit ledger + gallery +
  version history + save-limit + profile-security + auth/credit trust-boundary
  repair (017) + account/billing models (018) + the community gallery —
  votes, comments, privacy sanitization, reports, moderation (019-022), all via
  SECURITY DEFINER RPCs with sanitized public reads. The chain extends through
  the subscription/pricing + referral + dossier-entitlement models, world-pulse
  atomic-persist RPCs (optimistic-lock advance), gated security-question recovery,
  consent + velocity guards, and gallery view-dedup — up to the current head. RLS
  is the security spine.
- **functions/** (25 Deno edge functions) (Deno edge):
  - `generate-narrative` — AI prose. JWT-auth → `spend_credits` RPC (RLS,
    atomic) → bot guard → Opus thesis + parallel Haiku refinement passes →
    `refund_credits` on failure. Anthropic key is server-only.
  - `stripe-webhook` — verifies the signature (`constructEvent`) before acting;
    uses the service-role key (no user JWT on webhooks).
  - `admin-actions` — JWT-auth → profile `role` check → 403; allowlisted
    metadata keys/roles (anti-privilege-escalation).
  - `create-checkout`, `send-email` — JWT-authed.
  - `_shared/` — `aiGroundingBundle.js` is **built** from app code by
    `scripts/build-edge-shared.mjs`; a freshness test fails the gate on drift. <!-- @enforced-by tests/edgeFunctions/analyticsEventsBundle.freshness.test.js -->

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

`npm run check` = `validate:data && validate:migration-head && validate:edge &&
validate:map && typecheck && typecheck:domain:strict && lint && test && build &&
verify:dist`.
<!-- @enforced-by tests/docs/architectureFreshness.test.js (each sub-step derived from package.json) -->

- **validate:data** — duplicate-key scan (dupe keys silently corrupt sim output).
- **validate:migration-head** — migration numbering is contiguous and the
  checked-in applied-head ledger is well-formed (see `docs/DEPLOY.md`).
- **validate:edge** — the edge-function contracts (config + `verify_jwt` posture,
  the built `_shared` bundle wiring).
- **validate:map** — the vendored Azgaar FMG map fork stays within its pinned
  contract.
- **typecheck** — `tsc --noEmit -p tsconfig.full.json` over the **full src logic
  tree** (domain/store/lib/hooks/generators/components/pdf). The old domain-only
  punch-list reached zero, so the gate was switched to full coverage;
  `typecheck:domain` keeps the fast domain-only check.
- **typecheck:domain:strict** — the `src/domain/` strict ratchet
  (`scripts/check-domain-strict.mjs`): the any-cast burn-down that may only shrink.
- **lint** — ESLint over `src/ tests/ scripts/`. Correctness = error,
  forward-looking React 19 + unused-vars = warn. Plus the visual-budget and
  analytics-event contracts (error).
- **test** — Vitest, ~11,900 tests / ~1176 files (unit, property-based, domain/
  store/lib integration, component/UI smoke, a11y, security, edge-function).
- **build** — Vite/Rollup. `vite.config.js` `onwarn` **promotes missing/
  unresolved named imports to hard errors** (see Gotchas).
- **verify:dist** — the constitutional **first-paint ratchet**: the built entry
  chunk's static closure must stay under `CLOSURE_BUDGET_BYTES`, a monotone,
  owner-gated ceiling (see the playbook §0.2). Lazy/dormant additions cost zero
  first-paint bytes; a new eager import must fit the margin or reclaim it.

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
- **The gate type-checks the full src logic tree** (it was domain-only; the
  punch-list hit zero and the gate switched to `tsconfig.full.json`). `src/data`,
  `src/utils`, and `tests` stay out of scope — lean on tests + the build guard there.
- **`OutputContainer.jsx`** (the dossier renderer) is the densest,
  highest-stakes view — full JSX (the historical createElement form was
  converted in Track C), guarded by the visual-budget + jsx-hygiene error
  rules and the dossier smoke tests. Edit carefully anyway.
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
