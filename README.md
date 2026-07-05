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
  Read this first; it is kept in sync with the code and its checkable claims are
  gate-enforced (`tests/docs/enforcement-claims.test.js`).
- **[docs/README.md](docs/README.md)** — index of the `docs/` corpus, split into
  **canonical** (trust as current) and **historical** (point-in-time snapshots;
  when a historical doc and the code disagree, the code wins).
- **[docs/RISK_REGISTER.md](docs/RISK_REGISTER.md)** — the living register of known
  residual risks and their status.

## Develop

```bash
npm install
npm run dev            # Vite dev server
npm run check          # the full gate (see below) — run before pushing
npm test               # Vitest only
```

Node ≥ 22, npm ≥ 10 (`.nvmrc` pins the major). Copy `.env.example` → `.env` and fill
the `VITE_*` vars for Supabase/Stripe; secrets live in the Supabase/Vercel dashboards,
never in the repo (the anon key is public by design — RLS enforces access).

## The gate

`npm run check` runs nine stages: data-key validation, edge-function contract checks,
map-bridge validation, migration-head ledger check, full-tree typecheck, strict domain
typecheck, zero-warning lint, the Vitest suite, and the bundle-budget build. It runs in
CI on every push/PR and via a husky `pre-push` hook; production deploys are
**fail-closed gated on CI** (`scripts/vercel-ignore-build.mjs`). Edge (Deno) tests run
via `npm run check:edge-behavior` / the CI `deno-tests` job. See ARCHITECTURE.md → "The
gate" and [docs/DEPLOY.md](docs/DEPLOY.md).

## Status & scope

Solo-developer project. English-only today — copy is centralized behind a `t()`
indirection seam (`src/copy/`), but there is no locale-selection layer yet, so treat
"i18n" as a seam, not a shipped capability. Bus factor is one; ARCHITECTURE.md and the
`docs/` corpus exist to lower the cost of a second contributor.
