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

Stack: **React 19 + Zustand 5 + Vite 7 (oxc transform / Rollup build)**, JS with
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
             steps/ holds the 22-step pipeline; the rest are domain generators
             (economic, power, npc, faction, defense, history, resource, …).
             Bundled as the ~514 kB lazy `engine` chunk — fetched on first
             Generate (settlementSlice's loadEngine dynamic import), NOT on
             first paint. The small slice the entry legitimately reaches (the
             coherence draft-check, neighbour backlink, pipeline-rail labels +
             their influence-scoring spine) rides a separate first-paint
             `engine-core` chunk. <!-- @enforced-by tests/build/vendorPdfLazy.test.js -->
domain/      Pure business logic that ISN'T generation: causal state, events,
             entities, contradictions, provenance, migrations, schema, summary,
             the renderer-neutral settlement-scene projection and manifest
             compiler (`townScene/`; one canonical truth for 2D and 3D),
             the **campaign world-pulse simulation** (`worldPulse/` — ~218 modules
             that age a canonized region tick-by-tick: proposals, party impacts,
             the multi-tick interval orchestrator, PLUS the geopolitical
             subsystems — war & siege (`warDeployment`/`occupation`/`attrition`/
             `mobilization`), trade war & blockade (`tradeWar`/`blockadeTransport`/
             `tradeSalience`), religion (`religionState`/`pantheon`/`religiousContest`/
             divine mandate), coups & faction competition, and NPC agency; the
             shared sim-shape typedefs live in `pulseShapes.js`), the **spatial-canon
             engine** (`spatial/` — the Phase 5.5 KEYSTONE, 30 modules that make the
             realm map a first-class engine input; see "The spatial engine" below),
             regional causality (`region/`), and the fail-closed public-safe display
             projection (`display/`). Every roll forks a seeded, injected RNG (determinism is
             sacred — no Date.now/Math.random). Was the only gate-typechecked layer;
             the gate now covers the non-JSX logic tree, and `worldPulse/` also carries a
             strict-typecheck ratchet + an any-cast burn-down ratchet
             (scripts/count-domain-any.mjs). <!-- @enforced-by tsconfig.full.json + tsconfig.domain-strict.json + tests/lint/domainAnyCastBaseline.test.js -->
application/ Application-command lifecycle: admitted envelopes, owner/target/
             revision context, legal command specifications, replay-safe receipts,
             and bounded server-authoritative command adapters. This is a
             vertical migration seam, not a second store or a universal event bus.
store/       Zustand slices (20) — the single client state container, incl. the
             campaign world-pulse, regional, account-import, persisted
             display-preference, and NPC-verb slices.
components/  React UI. Inline-styled, token-driven. Large feature panels +
             primitives/ (accessible Dialog/Button/Toast, no native dialogs;
             raw <button> outside primitives/ is forbidden for new files —
             @enforced-by jsx-hygiene/no-raw-button + tests/lint/rawButtonBaseline.test.js,
             existing files burning down; every icon-only button must carry an
             accessible name — @enforced-by jsx-hygiene/icon-button-needs-label) +
             new/tabs/ (dossier tabs) + gallery/ (community gallery) + map/ (World
             Map + Realm hub) + auth/ + account/ + admin/ + pricing/ + purchase/ +
             home/ (landing) + region/ + legal/ (terms/privacy/refunds).
workers/     Bounded off-main-thread transforms. The TownScene workers lower an
             already audience-projected manifest into live transferable geometry
             or nested-lazy deterministic PNG/GLB exports; neither receives raw
             canonical or DM-only state.
pdf/         PDF generation: sections/ + primitives/ + lib/viewModel.js.
lib/         Services + glue: saves (Supabase+localStorage), analytics, flags,
             routes, authIntents, customRegistry, dependencyEngine, and the
             settlement-scene worker client/cache/adaptive-quality policy.
hooks/ copy/ design/ config/   Cross-cutting: tokens, copy strings, pricing.
```

**The main read/data-flow map is
`data → kernel → { generators, domain } → store → components/pdf`.** Durable
write paths are migrating vertically through
`components → application command → domain operation → transactional service/store
projection`; unchanged legacy writers still use the established store/service path.
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

Order (22 steps): `resolveConfig → buildGenerationContext → resolveResources →
resolveStress → resolveNeighbour → assembleInstitutions → subsumptionPass →
cascadePass → isolationPass → stressConfirmPass → generateEconomy →
generatePower → neighbourFactions → factionCorrelationPass →
coherenceRepairPass → economyReconcilePass → powerEconomyReconcilePass →
structuralValidationPass → generatePopulation → corruptionPass →
generateNarratives → assembleSettlement`.
<!-- @enforced-by tests/docs/architectureFreshness.test.js (derived from steps/index.js) -->

Determinism matters: same seed ⇒ same settlement — pinned by a 525-config
golden-master hash manifest (recount 2026-08-03 — 523 was the PRE-HK-3 figure)
and enforced by construction (seeded per-step PRNG
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

Phase 5.5 added a **spatial-canon engine** (`src/domain/spatial/`, 30 modules)
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

## Settlement scene: one truth, two presentations

`src/domain/townScene/` derives a versioned, audience-safe
`TownSceneManifest` from canonical settlement state. The 2D plan and illustrated
3D portrait consume that derived truth; neither is a second mutable settlement
model. Player filtering happens before scene compilation or worker transport, and
Three.js is confined to the lazy
`src/components/townMap/scene3d/` presentation boundary.

The 3D portrait is currently available as an opt-in view through
`settlementScene3d`, while `settlementScene3dDefault` remains off. Promotion to
the default requires current local, rendered, device, accessibility, human, and
field evidence. The 2D plan remains the permanent precision, accessibility,
export, and performance fallback after any future promotion.

The full ownership, determinism, privacy, worker, lifecycle, adaptive-quality,
editing, and accessibility design lives in
[`docs/TOWN_SCENE_3D_ARCHITECTURE.md`](docs/TOWN_SCENE_3D_ARCHITECTURE.md).
Its machine-readable evidence and promotion rules live in
[`docs/TOWN_SCENE_PROMOTION_CONTRACT.json`](docs/TOWN_SCENE_PROMOTION_CONTRACT.json).

---

## State (`store/index.js`)

One Zustand store composed from 20 slices, with `immer + persist +
subscribeWithSelector + devtools`. **`persist.partialize` deliberately persists
only lightweight, user-owned data (config + toggles + device display
preferences)** — never the large generated settlement object. `onRehydrate` resets the wizard to the mode picker.

`authIntents` (registered here) powers "save-as-signup": an anonymous action is
queued, then replayed with real credentials after the user authenticates.

Auth is **two orthogonal axes**: `tier` (anon / free / premium) × `role`
(user / developer / admin). Permission selectors (`canSave`, `canExport`,
`isElevated`, …) live on the store.

---

## Application commands, journals, and transport

`src/application/commands/` is the application boundary for reviewed mutations.
It admits a target-addressed envelope, checks owner and expected state, resolves a
small command specification, executes the existing domain/store verb, and emits a
typed receipt. Its memory journal provides in-session duplicate suppression and
replay; it is not described as durable.

The three similarly named mechanisms have intentionally different jobs:

- `store/operationRegistry.js` is the mutation census and governance vocabulary.
  It tells reviewers which store verbs exist; it does not dynamically dispatch
  every mutation.
- `store/outbox.js` is eventual transport for legacy persistence work. Delivery
  completion is not command authority.
- `application_command_journal` (migration 183) is durable command identity,
  outcome, and reconciliation evidence. The first bounded transaction is
  `CUT_TRADE_ROUTE`: pure client preparation plus one owner-scoped PostgreSQL
  compare-and-set that mutates the save and finalizes the receipt atomically.
  Its initiating Surveyor review exposes an explicit same-session recovery
  action: it reads the exact owner-scoped journal row, replays a confirmed
  commit to project its row/receipt, retries the unchanged command only when no
  durable row exists, and never retries an unresolved claim.
- Migration 184 extends that same authority to reviewed structured imports:
  create-and-attach or exclusive rehome, exact pre-command membership topology,
  campaign-envelope preservation, and final command receipt share one
  transaction. Configured clients do not dual-write through legacy save,
  campaign, or outbox paths.

The migration rule is vertical: move one complete command family without dual
writing, prove replay/stale/offline/owner-race behavior, then migrate the next.
There is no flag-day Zustand rewrite and no generic server executor that accepts
arbitrary mutation names.

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

- **migrations/** (195) — prod applied head tracked in `supabase/applied-head.json`,
  ledger-checked by `npm run validate:migration-head`. Schema + RLS policies + credit ledger + gallery +
  version history + save-limit + profile-security + auth/credit trust-boundary
  repair (017) + account/billing models (018) + the community gallery —
  votes, comments, privacy sanitization, reports, moderation (019-022), all via
  SECURITY DEFINER RPCs with sanitized public reads. The chain extends through
  the subscription/pricing + referral + dossier-entitlement models, world-pulse
  atomic-persist RPCs (optimistic-lock advance), gated security-question recovery,
  consent + velocity guards, gallery view-dedup, and migration 194's private
  Operator Messages/receipt substrate with lease-safe broadcast delivery and
  explicit product-update consent — up to the current head. RLS is the security
  spine.
- **functions/** (33 Deno edge functions) (Deno edge):
  - `generate-narrative` — AI prose. JWT-auth → `spend_credits` RPC (RLS,
    atomic) → bot guard → Opus thesis + parallel Haiku refinement passes →
    `refund_credits` on failure. Anthropic key is server-only.
  - `stripe-webhook` — verifies the signature (`constructEvent`) before acting;
    uses the service-role key (no user JWT on webhooks).
  - `admin-actions` — JWT-auth → profile `role` check → 403; allowlisted
    metadata keys/roles (anti-privilege-escalation). Operator direct notices,
    warnings, and bans commit their Account Message + real-actor audit in the
    database before provider-neutral best-effort mail; a mass broadcast also
    requires the exact `SEND TO ALL` confirmation and a fresh password AMR.
  - `operator-message-worker` — disabled-by-default, secret-gated leased courier
    for queued broadcasts. Stable recipient cursors and per-user email outcomes
    are database-owned; each provider send requires a heartbeat plus a
    lease-token-bound recipient CAS claim, whose fresh address/consent/token is
    the only delivery authority. Abandoned `sending` attempts become terminal
    outcome-unknown records and are never resent.
  - `unsubscribe` — public GET-confirm / POST-mutate bearer-token boundary. It
    calls only the service-role opt-out RPC; GET never mutates and the token can
    never enable an email category.
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

`npm run check` = `validate:data && validate:custom-content-manifest &&
validate:migration-head && validate:edge && validate:map &&
validate:tuning-bands && validate:foundry-module && validate:mcp-server &&
typecheck && typecheck:domain:strict && lint && test && build && verify:dist`.
<!-- @enforced-by tests/docs/architectureFreshness.test.js (each sub-step derived from package.json) -->

- **validate:data** — duplicate-key scan (dupe keys silently corrupt sim output).
- **validate:custom-content-manifest** — regenerates the canonical custom-content
  authority in check mode and fails if any generated client, edge, or SQL
  projection has drifted from `schema/custom-content.manifest.json`.
- **validate:migration-head** — migration numbering is contiguous and the
  checked-in applied-head ledger is well-formed (see `docs/DEPLOY.md`).
- **validate:edge** — the edge-function contracts (config + `verify_jwt` posture,
  the built `_shared` bundle wiring).
- **validate:map** — the vendored Azgaar FMG map fork stays within its pinned
  contract.
- **validate:tuning-bands** — the R-15 tuning-band manifest
  (`src/domain/tuning/proposedSoakBands.js`) is well-formed and every proposed
  band ships `PROPOSED` (soak-vetoable), so no malformed or pre-ratified band slips in.
- **validate:foundry-module** — the standalone `foundry-module/` package (the
  world importer) is well-formed and safe (module.json valid, importer parses, no
  content-into-code) — an out-of-app-gates top-level dir like `public/map`.
- **validate:mcp-server** — the standalone `mcp-server/` package (the local Truth
  Server) is dependency-free, parses, has no write/network path, and its tool
  manifest is read-only by construction (no mutating tool exists).
- **typecheck** — `tsc --noEmit -p tsconfig.full.json` over the **non-JSX src
  logic tree** (domain/store/lib/hooks/generators plus `.js` PDF/foundry
  modules). It deliberately does not claim `src/components/**/*.jsx` or
  `src/pdf/**/*.jsx`; those remain covered by ESLint, rendered tests, and the
  Vite build. `typecheck:domain` keeps the fast domain-only check.
- **typecheck:domain:strict** — the `src/domain/` strict ratchet
  (`scripts/check-domain-strict.mjs`): the any-cast burn-down that may only shrink.
- **typecheck:ui-boundaries** — an opt-in, baseline-free strict manifest for
  dependency-light Game Grade UI read-model modules. It grows only when a
  module reaches zero strict errors; it is not presented as whole-JSX coverage.
- **lint** — ESLint over `src/ tests/ scripts/`. Correctness = error,
  forward-looking React 19 + unused-vars = warn. Plus the visual-budget and
  analytics-event contracts (error).
- **test** — Vitest, ~20,100 tests / ~1988 files: unit, property-based,
  domain/store/lib integration, component/UI smoke, accessibility, security, and
  edge-function contracts. Counts are approximate; executable output remains the
  authority.
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
- **The gate type-checks the non-JSX src logic tree** (it was domain-only; the
  punch-list hit zero and the gate switched to `tsconfig.full.json`).
  `src/components/**/*.jsx`, `src/pdf/**/*.jsx`, `src/data`, `src/utils`, and
  tests stay out of this tsc scope — lean on ESLint, rendered tests, and the
  build guard there. Do not describe this as full JSX coverage.
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
