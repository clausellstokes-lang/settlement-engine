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
generators/  The engine. Pure, store-agnostic, deterministic (seeded PRNG).
             steps/ holds the 14-step pipeline; the rest are domain generators
             (economic, power, npc, faction, defense, history, resource, …).
domain/      Pure business logic that ISN'T generation: causal state, events,
             entities, contradictions, provenance, migrations, schema, summary.
             Was the only gate-typechecked layer; the gate now covers the full tree. <!-- @enforced-by tsconfig.full.json -->
store/       Zustand slices (14) — the single client state container.
components/   React UI. Inline-styled, token-driven. Large feature panels +
             primitives/ (accessible Dialog/Button/Toast, no native dialogs;
             raw <button> outside primitives/ is forbidden for new files —
             @enforced-by jsx-hygiene/no-raw-button + tests/lint/rawButtonBaseline.test.js,
             existing 35 files burning down (scripts/.raw-button-baseline.json);
             every icon-only button must carry an
             accessible name — @enforced-by jsx-hygiene/icon-button-needs-label) +
             new/tabs/ (dossier tabs) + gallery/ (community gallery) + map/ + auth/.
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

One Zustand store composed from 15 slices, with `immer + persist +
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
(`HERO_LINKS`). The former `/compare` pages are a tab on the **About** page
(renamed from "How To Use"); Workshop / "Custom Generate" was removed entirely.
`/workshop` and `/compare*` stay as routes that redirect to those surfaces. The
mobile bottom-nav caps at 5 items (slice); desktop shows all visible items.

---

## Backend (`supabase/`)

- **migrations/** (73) — schema + RLS policies + credit ledger + version
  history + save-limit + profile-security + auth/credit trust-boundary repair +
  account/billing models + the community gallery (votes, comments, privacy
  sanitization, reports, moderation, importable dossiers) + analytics core +
  regional NPC/propagation reports + map-backdrop storage + admin
  least-privilege/audit-log/deletion/support + the **account-status SECURITY
  migrations** (057/059/060 enforce account-status writes/RLS) + **062**
  (close authz gaps: RLS on the two analytics tables, drop the un-audited
  privileged profiles-UPDATE bypass, column-lock owner support-ticket edits) +
  **066** (Auth Phase 2: server-write-only `security_answers` bcrypt table +
  SECURITY DEFINER question/recovery RPCs + per-IP/per-email recovery limiter) +
  **067/068** (recovery-verify lockout with a time-bounded self-healing predicate
  so a failed-answer streak throttles via escalating backoff instead of permanently
  locking the account) + **069** (an atomic `persist_world_pulse_advance`
  SECURITY DEFINER RPC that writes a world-pulse advance's entire settlement +
  campaign write-set in one owner-checked transaction; now wired into the client
  persist path — the cloud branch of `flushWorldPulsePersist` routes the whole
  advance write-set through this single RPC, so a partial failure can no longer
  carry forward a half-applied advance. The optional `p_expected_tick` stale-apply
  guard only fires when non-null: forward advances pass the post-advance tick so a
  duplicate re-apply is a no-op, while an undo passes NULL (last-write-wins) so the
  lower restored tick reaches the cloud instead of being rejected as stale) +
  **070** (nullable `gallery_realm_arc_summary` text column on settlements, the
  read/write target for the gallery realm-arc share) + **071** (an `importable`
  gallery facet: recreates the `tile_rows`/`list_gallery_dossiers` RPC chain to
  surface and filter on the owner `gallery_importable` opt-in) + **072** (maps-side
  parity: a `saved_maps.gallery_importable` owner opt-in + `import_gallery_map`
  server-gated clone RPC + an `importable` facet on `list_gallery_maps`) —
  all via SECURITY DEFINER RPCs with sanitized public reads. RLS is the security
  spine. Apply every file in `supabase/migrations/` in lexical order; never skip
  the 057+ security set. <!-- @enforced-by tests/docs/docCounts.test.js -->
- **functions/** (12 Deno edge functions; `_shared/` is a helper dir, not a
  deployable function) — <!-- @enforced-by tests/docs/docCounts.test.js -->
  - `auth-recovery` — logged-OUT password recovery (Auth Phase 2). No JWT; the
    caller forgot their password. Per-IP + per-email rate limit (fail-closed) +
    bot guard → service-role-only recovery RPCs (066): reveal one random security
    question, verify the answer, email a `recovery` reset link to the account.
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

`npm run check` = `validate:data && typecheck && lint && test && build`.

- **validate:data** — duplicate-key scan (dupe keys silently corrupt sim output).
- **typecheck** — `tsc --noEmit -p tsconfig.full.json` over the **full src logic
  tree** (domain/store/lib/hooks/generators/components/pdf). The old domain-only
  punch-list reached zero, so the gate was switched to full coverage;
  `typecheck:domain` keeps the fast domain-only check.
- **lint** — ESLint over `src/ tests/ scripts/`. Correctness = error,
  forward-looking React 19 + unused-vars = warn. Plus the visual-budget and
  analytics-event contracts (error).
- **test** — Vitest (unit, property-based, domain/store/lib integration,
  component/UI smoke, a11y, security, edge-function). The suite grows every PR;
  the live count is whatever CI runs (`npx vitest list | wc -l` for a local
  snapshot) — hard numbers here rot, so trust the CI run over this line.
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
- **The gate type-checks the full src logic tree** (it was domain-only; the
  punch-list hit zero and the gate switched to `tsconfig.full.json`). `src/data`,
  `src/utils`, and `tests` stay out of scope — lean on tests + the build guard there.
- **`OutputContainer.jsx`** (the dossier renderer) is the densest,
  highest-stakes view — now written in plain JSX (the old raw
  `React.createElement` form was refactored out; grep confirms zero
  `createElement`). Edit carefully; PDF parity (below) rides on it.
- **`public/map/main.js`** is a ~1.4k-line fork of Azgaar FMG — outside all
  gates, reconciled by hand on upstream releases (`docs/fmg-fork.md`).
- **PDF parity**: the on-screen dossier and the PDF render from related but
  separate code (`pdf/lib/viewModel.js`); changing one can drift the other
  (`PDF_PARITY_AUDIT.md`).
- **Deploy**: pushing `master` triggers a Vercel build, but it is **gated on CI** —
  `vercel.json`'s `ignoreCommand` runs `scripts/vercel-ignore-build.mjs`, a
  fail-closed check that blocks the deploy unless the `check`/`e2e`/`deno-tests`
  jobs are green on the commit (operator sets a read-only `GITHUB_CI_STATUS_TOKEN`;
  without it the gate blocks rather than ships). See `docs/DEPLOY.md`.
- **Bus factor is one.** Plan-file vocabulary (`P1xx`, "Pillars A–H") and a
  single authorial voice run throughout. This file exists to lower the cost of a
  second contributor.
