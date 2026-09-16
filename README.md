# SettlementForge

A constraint-driven D&D settlement **simulator** (not a table-roller). A config
(tier, terrain, culture, trade access, threat, priority sliders) is pushed through
a deterministic, seeded pipeline that produces an internally-coherent settlement —
economy, factions, institutions, NPCs, stressors, history — rendered as an on-screen
dossier and an exportable PDF, with an optional AI prose layer and a living-world
campaign simulation (world-pulse ticks over a regional map).

**Stack:** React 19 · Zustand 5 · Vite 7 · JS with JSDoc types · Supabase (auth,
Postgres + RLS, edge functions) · Stripe (credits / subscription / one-shot dossiers)
· Anthropic (AI narrative). No `.ts` in app code; the engine is pure and headless.

---

## Start here

- **[ARCHITECTURE.md](ARCHITECTURE.md)** — the canonical map of the system: layer
  boundaries (`data → generators → presentation`), the generation pipeline, state
  (Zustand slices), routing, the Supabase backend, the design system, and the gate.
  Read this first; it is kept in sync with the code, and its *completeness claims*
  (the "machine-enforced" / "promoted to ERROR" vocabulary) are gate-checked against
  live enforcers (`tests/docs/enforcement-claims.test.js`). Other prose there is
  maintained by review, not by a gate.
  <!-- @enforced-by tests/docs/enforcement-claims.test.js -->
- **[docs/README.md](docs/README.md)** — index of the `docs/` corpus, split into
  **canonical** (trust as current) and **historical** (point-in-time snapshots;
  when a historical doc and the code disagree, the code wins).
- **[docs/CURRENT_STATE.md](docs/CURRENT_STATE.md)** — the shortest current-state,
  release-blocker, and evidence guide.
- **[docs/PRODUCT_COMPLETION_ARCHITECTURE.md](docs/PRODUCT_COMPLETION_ARCHITECTURE.md)**
  — the canonical end-state and migration order for finishing the existing thesis.

## Develop

```bash
npm install
npm run dev            # Vite dev server
npm run check          # the full gate (see below) — run before pushing
npm test               # Vitest only
npm run test:e2e:performance  # production-build browser regression receipt
```

Node ≥ 22, npm ≥ 10 (`.nvmrc` pins the major). Copy `.env.example` → `.env` and fill
the `VITE_*` vars for Supabase/Stripe; secrets live in the Supabase/Vercel dashboards,
never in the repo (the anon key is public by design — RLS enforces access).

## The gate

`npm run check` runs fourteen stages: data-key, custom-content-manifest, and
migration-ledger validation; edge, map-bridge, tuning-band, Foundry-module, and
MCP-server contract checks; non-JSX logic and strict-domain typechecks; lint; the
Vitest suite; the production build; and built-artifact verification. It runs in CI
on every push/PR and via a husky `pre-push` hook; production deploys are
**fail-closed gated on CI** (`scripts/vercel-ignore-build.mjs`). Edge (Deno) tests run
via `npm run check:edge-behavior` / the CI `deno-tests` job. The money/security
coverage floors (`npm run test:coverage:floors`) run as a **separate required CI job**,
and the production-build browser performance receipt runs in its own CI job
(`npm run test:e2e:performance` locally). Neither is inside `npm run check`, so a
local green check has not exercised them. See
ARCHITECTURE.md → "The gate" and [docs/DEPLOY.md](docs/DEPLOY.md).

## Status & scope

Solo-developer project. English-only today — copy is centralized behind a `t()`
indirection seam (`src/copy/`), but there is no locale-selection layer yet, so treat
"i18n" as a seam, not a shipped capability. Bus factor is one; ARCHITECTURE.md and the
small canonical reading set in `docs/README.md` exist to lower the cost of a second
contributor. The wider docs corpus contains historical design and execution records;
volume is not the same as current authority.
