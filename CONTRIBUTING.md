# Contributing — operating standard

> The guiding principle: **the gate is the product.** A change is done when the gate
> proves it, not when it works on a laptop. See [`docs/A_PLUS_ROADMAP.md`](docs/A_PLUS_ROADMAP.md)
> for the why, [`docs/RISK_REGISTER.md`](docs/RISK_REGISTER.md) for current risks, and
> [`ARCHITECTURE.md`](ARCHITECTURE.md) for the map.

## The gate

Everything runs through `npm run check` (validate data/edge/map → typecheck → lint →
~4,500 tests → build) plus the Playwright `e2e` job. Both run in CI
(`.github/workflows/ci.yml`) on every PR to `master`/`main`.

**CI must be the only path to production.** To enforce that (a one-time maintainer
action in the GitHub UI — it cannot be set from the repo):

> **GitHub → Settings → Branches → add a rule for `master`:**
> *Require a pull request before merging* + *Require status checks to pass* → select
> the **`check`** and **`e2e`** jobs. Stop pushing directly to `master`.

Until that rule is on, the local `pre-push` hook is the only guard and it can be
bypassed with `--no-verify` — so never `--no-verify` a push to `master`.

## What every change must carry

Match the change to the proof. A PR is not ready until the relevant rows are green:

| If your change touches… | It must include… |
|---|---|
| domain logic (`src/domain/**`) | domain unit/property tests; stays pure (no `Math.random`/`Date.now`/`flag`/`import.meta` — the determinism lint enforces it) |
| store/state (`src/store/**`) | store/integration tests; cross-slice writes go through one persist path |
| backend (`supabase/migrations/**`, `functions/**`) | an **executed** test (pglite for SQL/RLS/ledger; a signed-event test for the webhook) — not a source-text regex |
| dossier data (a field shown to the user) | a **screen ↔ PDF parity** assertion (the field is derived once and both surfaces read it) |
| publishable data (gallery) | a **public/privacy** test proving private fields never project |
| a user journey | a Playwright spec under `e2e/` |
| a new dependency | a bundle-impact note + `npm audit --audit-level=high --omit=dev` clean |
| anything user-facing in the UI | use the `primitives/` (Button/IconButton/Dialog/Alert) and `design/tokens.js` — no raw `<button>`, no forked hex consts |

## Claims carry their enforcement

If you write a completeness claim in a doc or comment ("promoted to error", "burned to
zero", "machine-enforced"), it must name a resolvable `@enforced-by <test-or-rule>` and
that enforcer must exist and be wired into `npm run check`. A meta-pin checks this — a
claim without a live enforcer fails the gate. Don't assert a guarantee the gate can't prove.

## Commit hygiene

- Branch off `master`; land via PR. Never push `master` directly.
- One logical change per commit; gate-green before committing.
- Co-author trailer on AI-assisted commits.
