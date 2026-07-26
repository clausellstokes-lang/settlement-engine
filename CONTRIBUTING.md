# Contributing — operating standard

> The guiding principle: **the gate is the product.** A change is done when the gate
> proves it, not when it works on a laptop. See [`docs/A_PLUS_ROADMAP.md`](docs/A_PLUS_ROADMAP.md)
> for the why, [`docs/PHASE55_EXECUTION_PLAYBOOK.md`](docs/PHASE55_EXECUTION_PLAYBOOK.md) §0.0.2
> for the current risks and standing rulings, and [`ARCHITECTURE.md`](ARCHITECTURE.md) for the map.

## The gate

Everything runs through `npm run check` — the full 14-step chain: `validate:data` →
`validate:custom-content-manifest` → `validate:migration-head` → `validate:edge` → `validate:map` →
`validate:tuning-bands` → `validate:foundry-module` → `validate:mcp-server` → `typecheck` →
`typecheck:domain:strict` → `lint` → `test` (the full Vitest suite, ~9,800 tests) →
`build` → `verify:dist` (the first-paint ratchet) — plus the Playwright `e2e` job.
Both run in CI (`.github/workflows/ci.yml`) on every PR to `master`/`main`.

**CI must be the only path to production.** To enforce that (a one-time maintainer
action in the GitHub UI — it cannot be set from the repo):

> **GitHub → Settings → Branches → add a rule for `master`:**
> *Require a pull request before merging* + *Require status checks to pass* → select
> the **`check`** and **`e2e`** jobs. Stop pushing directly to `master`.

Until that rule is on, the local `pre-push` hook is the only guard and it can be
bypassed with `--no-verify` — so never `--no-verify` a push to `master`.

## The constitution (engine behavior)

The simulation engine is bound by constitutional laws the gate enforces and that you
must NOT work around. The full statement lives in
[`docs/PHASE55_EXECUTION_PLAYBOOK.md`](docs/PHASE55_EXECUTION_PLAYBOOK.md) §0.2 — in short:

- **Same-seed byte-identity.** The same seed must produce byte-identical output.
  Generator / world-pulse / PDF golden-master hashes are pinned in the suite; a change
  that legitimately shifts them requires an **owner-signed golden regen**
  (`UPDATE_GOLDEN`) — never a silent re-baseline to green a red gate.
- **Dormancy.** A feature that is absent or flag-off must leave output byte-identical
  to before it existed.
- **The first-paint ratchet.** `verify:dist` holds the built entry chunk's static
  closure under `CLOSURE_BUDGET_BYTES` — a monotone, owner-gated ceiling that only
  ratchets DOWN. A new eager import must fit the margin or reclaim it; lazy/dormant
  additions cost zero first-paint bytes.
- **Purity + the any-cast ceiling.** Engine code (`src/kernel`, `src/generators`,
  `src/domain`) forks a seeded PRNG and never calls `Math.random`/`Date.now` (the
  determinism lint enforces it); the `src/domain/` any-cast baseline only shrinks.

If a change legitimately alters engine output, say so and record the one-time shift —
never regenerate a golden to silence the gate.

## What every change must carry

Match the change to the proof. A PR is not ready until the relevant rows are green:

| If your change touches… | It must include… |
|---|---|
| domain logic (`src/domain/**`) | domain unit/property tests; stays pure (no `Math.random`/`Date.now`/`flag`/`import.meta` — the determinism lint enforces it) |
| engine behavior (generation, world-pulse, PDF output) | the **golden-master** hashes stay byte-identical (same-seed determinism); a legitimate output shift needs an **owner-signed regen** (`UPDATE_GOLDEN`), never a silent re-baseline — see [The constitution](#the-constitution-engine-behavior) |
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
