# Contributing — operating standard

> The guiding principle: **the gate is the product.** A change is done when the gate
> proves it, not when it works on a laptop. See [`docs/A_PLUS_ROADMAP.md`](docs/A_PLUS_ROADMAP.md)
> for the why, [`docs/PHASE55_EXECUTION_PLAYBOOK.md`](docs/PHASE55_EXECUTION_PLAYBOOK.md) §0.0.2
> for the current risks and standing rulings, and [`ARCHITECTURE.md`](ARCHITECTURE.md) for the map.

## The gate

Everything runs through `npm run check` — the full 14-step chain: `validate:data` →
`validate:custom-content-manifest` → `validate:migration-head` → `validate:edge` → `validate:map` →
`validate:tuning-bands` → `validate:foundry-module` → `validate:mcp-server` → `typecheck:ratchet` →
`typecheck:domain:strict` → `lint` → `test` (the full Vitest suite, ~20,100 tests /
~1988 files) → `build` → `verify:dist` (the first-paint ratchet) — plus the Playwright
`e2e` job. Both run in CI (`.github/workflows/ci.yml`) on every PR to `master`/`main`.
Counts are approximate; executable output remains the authority.

**The chain is `&&`, so a red step blacks out everything behind it.** That is not
hypothetical: the typecheck step was a boolean gate at zero errors, went red on
2026-08-02, and took `lint`, `test`, `build` and `verify:dist` dark with it for four
days. It is now `typecheck:ratchet` (`scripts/check-full-typecheck.mjs`) — a per-file
ceiling that may only shrink, so a pre-existing debt cannot hide the rest of the gate,
while a NEW or WORSENED file still reds. Files absent from the baseline get an
allowance of zero. Use `npm run typecheck` for the raw unfiltered list when burning the
debt down, and `npm run typecheck:ratchet:update` to bank a win. Never widen a baseline
to green a gate — that is the constitutional violation this repo exists to prevent.

**THE TWO-TYPECHECKER RECEIPT LAW — a typecheck figure MUST name its config.** The
chain runs **two** typecheckers over overlapping trees: `typecheck:ratchet`
(`tsconfig.full.json`) at step 9 and `typecheck:domain:strict`
(`tsconfig.domain-strict.json`) at step 10. They disagree, and a figure quoted
without its config reads as total when it is not. Measured on the 2026-08-06 idiom
sweep (`eca65c8a` → `1977db07`, both ends in integrity-counted `git archive`s of the
committed shas, diagnostics compared message-normalized so shifted line numbers do
not read as churn):

| window `eca65c8a` → `1977db07` | errors | removed | **introduced** |
| --- | --- | --- | --- |
| `tsconfig.full.json` | 351 → 188 | 163 | **0** |
| `tsconfig.domain-strict.json` | 1303 → 1159 | 175 | **31** |

The sweep reported `introducedCount: 0`. That was true of the config it measured and
false of the one it did not, and two of those 31 crossed a per-file ceiling and turned
step 10 red — which, the chain being `&&`, took `lint`, `test`, `build` and
`verify:dist` dark behind it. So:

- **Quote both numbers, or name the single config the number belongs to.** "Zero
  introduced" with no config named is not a receipt.
- **A per-file "I only touched my files" claim is not a safety argument.** Of those
  31 rows, the ones that reddened the gate were in `peaceTerms.js`, a file that
  appears in **no** commit of that sweep. JSDoc added to one file narrows inferred
  types that flow into files nobody opened; the blast radius is the whole compilation,
  so the receipt has to be measured over the whole compilation.
- **`introducedCount: 0` and "the ratchet is green" are different claims, and
  neither implies the other.** These ratchets compare PER-FILE COUNTS, so 29 of
  those 31 introduced rows landed inside existing per-file slack and reddened
  nothing. Conversely a file can swap one error for another and stay at its ceiling.
  Report the ratchet's exit status *and* the introduced set; one does not stand in
  for the other.
- **Measure a committed sha in an archive, never the live tree.** This tree is
  shared; a sibling lane's uncommitted work belongs to no commit. `git archive -o f.tar <sha>`
  + `tar -xf`, integrity-counted (`git ls-tree -r <sha> | wc -l` against
  `find -type f | wc -l`), with `node_modules` symlinked in.
- **A ratchet's stated reason is a claim, and a claim about what a commit contained
  is settled by measuring that commit** — never by reasoning about which lane was
  busy. See the correction at the head of `tests/lint/fullTypecheckRatchet.test.js`,
  where exactly that mistake froze the ceiling 9 errors looser than its own tree.

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
