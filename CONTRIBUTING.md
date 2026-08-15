# Contributing — operating standard

> The guiding principle: **the gate is the product.** A change is done when the gate
> proves it, not when it works on a laptop. See [`docs/A_PLUS_ROADMAP.md`](docs/A_PLUS_ROADMAP.md)
> for the why, [`docs/PHASE55_EXECUTION_PLAYBOOK.md`](docs/PHASE55_EXECUTION_PLAYBOOK.md) §0.0.2
> for the current risks and standing rulings, and [`ARCHITECTURE.md`](ARCHITECTURE.md) for the map.

## Subsystem dispatch

For not-yet-built subsystem work, start at
[`docs/implementation/INDEX.md`](docs/implementation/INDEX.md). Only a SHA-pinned
packet marked **READY** is a coding assignment. Architecture files, queue rows,
old briefs, receipts, and progress blocks provide intent or history but do not
authorize implementation. The packet's manifest, scope budget, acceptance
matrix, verification commands, and STOP conditions bind the change; discoveries
outside that boundary are reported without investigation or repair.

## The gate

Everything runs through `npm run check` — the full 17-step chain:
`validate:hazard-registry` → `validate:premortem` → `validate:packets` → `validate:data` →
`validate:custom-content-manifest` → `validate:migration-head` → `validate:edge` → `validate:map` →
`validate:tuning-bands` → `validate:foundry-module` → `validate:mcp-server` → `typecheck:ratchet` →
`typecheck:domain:strict` → `lint` → `test:ratchet` (the full Vitest suite — measured
27,292 tests / 2,350 files at c658fb44) → `build` → `verify:dist` (the first-paint
ratchet) — plus the Playwright
`e2e` job. CI runs the local chain as parallel validation, type, lint, test, and
paired build/`verify:dist` groups behind the required `check` aggregate; `e2e`
runs separately. They run on every PR to `master`/`main`.
Counts are approximate; executable output remains the authority.

Implementation has faster, explicitly non-release loops. `npm run check:packet --
<ID>` validates the packet, runs both global type ratchets, lints its existing
logic-bearing manifest paths, and executes only its closed focused checks.
`npm run check:quick` performs the changed-file static subset and does not claim
behavioral coverage. After a red fail-fast gate, `npm run check:diagnose` runs every
independent group and reports all exits/timings while keeping build and
`verify:dist` paired. None of these replaces `npm run check` before landing.

All canonical Vitest package scripts hold the machine slot for the whole child
process through `sh scripts/gate-mutex.sh --run -- ...`. A separate "slot free"
check followed by Vitest is a time-of-check/time-of-use race and is prohibited.

**The chain is `&&`, so a red step blacks out everything behind it.** That is not
hypothetical: the typecheck step was a boolean gate at zero errors, went red on
2026-08-02, and took `lint`, `test`, `build` and `verify:dist` dark with it for four
days. It is now `typecheck:ratchet` (`scripts/check-full-typecheck.mjs`) — a per-file
ceiling that may only shrink, so a pre-existing debt cannot hide the rest of the gate,
while a NEW or WORSENED file still reds. Files absent from the baseline get an
allowance of zero. Use `npm run typecheck` for the raw unfiltered list when burning the
debt down, and `npm run typecheck:ratchet:update` to bank a win. Never widen a baseline
to green a gate — that is the constitutional violation this repo exists to prevent.

**The test ratchet is the same move, later in the chain.** `test` was also a boolean gate at zero
failures, and it was red — so `build` and `verify:dist`, the two steps that guard
against shipping a `dist` that cannot boot, had not run in the gate since 2026-08-02
either. It is now `test:ratchet` (`scripts/check-test-ratchet.mjs`), which **runs the
entire suite** — it never skips, excludes or suppresses a test — and compares the
result against a frozen **per-test** census of 35 known failures, each carrying an
attribution (subsystem, cause, introducing commit, class). A failing test absent from
the census is a REGRESSION and reds the gate; `--update` can only REMOVE entries and
refuses to bank a failure it has not seen, so adding one is a deliberate hand edit.

**⛔ AN ENFORCEMENT WALKER MAY NEVER BE PUT IN THAT CENSUS.** A failing TEST is debt;
a failing WALKER is a DISABLED GUARD, and the two must not share a freezing mechanism.
Once a walker's row is tolerated, its verdict is byte-identical however much worse the
tree gets, so a NEW violation reddens nothing — and the inventory inside it grows
unseen. That happened: from 2026-07-30 to 2026-08-07 four rows of
`negativeAssertionAnchor.walker` and `seedLoopTotality.walker` sat in the census while
their populations grew from 1,303 to 1,565 un-anchored negatives and from 13 to 26 bare
seed loops. A walker's debt belongs in the walker's OWN shrink-only inventory, where a
new violation still reds. If a walker is red and you cannot fix it, re-freeze its own
baseline — do not bank its row here.

**AND THAT LAW IS NOW MACHINERY, BECAUSE PROSE CHECKS NOTHING.** It was written on
2026-08-07 in this file and in `tests/lint/testRatchet.test.js` — **as comments, in a
commit that itself left TEN violating rows in the census**, across seven files. The last
`describe` of `tests/lint/testRatchet.test.js` now enforces it: every census row is
classified, and a row belonging to an enforcement walker reds unless it is written into
one of two explicit, shrink-only, exact-identity ledgers with a stated reason. A walker
is identified by the UNION of five independent arms — its **name** (`*.walker.test.js`),
its module header's own **title line**, the **structure** of what it does (it enumerates
a source tree — by directory read, by glob, or by shelling out to `grep -rl` — *and*
compares the result against a frozen inventory), and that same structure **delegated** to
a non-test module it imports. The fifth arm is the source-local
`@enforcement-walker` marker, required when the frozen comparison is spelled as a bare
number, an exception `Set`, or a figure in another document and syntax alone cannot
classify it reliably. No single arm is enough and the test proves each gap by
execution: the filename check misses `mechanismLitCoverage.test.js`, which is a walker
with no `.walker.` in its name; the structure arm misses
`warCostKindPools.walker.test.js`, which walks nothing; and name, title and structure all
miss `domainAnyCastBaseline.test.js`, whose walk lives one import away in
`scripts/count-domain-any.mjs`.

**The classifier's own first cut had this gap and a control pin CERTIFIED it.** The
three-arm version shipped on 2026-08-07 missed five rows across three files, and
`domainAnyCastBaseline.test.js` was named on that same commit's ORDINARY-TEST CONTROL
list — so a green pin asserted, every run, that ignoring a disabled guard was correct. If
you add a name to that control list, the file must carry a real census row and must be
structurally incapable of qualifying; a control that certifies a miss is worse than no
control, because it turns an open hole into a proof.

The two ledgers mean different things and must not be confused. **ADMITTED** is for a row
that merely LIVES in a walker file while asserting a CLOSED, per-member identity — a
`test.each` row per registry kind, where a new kind mints a new test identity that still
reds — which is ordinary debt. **OWED** is for a CONFIRMED disabled guard nobody has freed
yet; it is an outstanding bill, not permission, and it exists so the debt is visible and
cannot grow.

A baselined test that turns up **skipped** reds too, and the suite-wide skip count is
frozen: a skipped test is not debt, it is a hole. Use `npm run test` for the raw
unfiltered reporter output when burning the census down.

**THE TWO-TYPECHECKER RECEIPT LAW — a typecheck figure MUST name its config.** The
chain runs **two** typecheckers over overlapping trees: `typecheck:ratchet`
(`tsconfig.full.json`) followed by `typecheck:domain:strict`
(`tsconfig.domain-strict.json`). They disagree, and a figure quoted
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
the domain-strict ratchet red — which, the chain being `&&`, took `lint`, `test`, `build` and
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
