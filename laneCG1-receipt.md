# Lane CG-1 — Opus verification receipt (ODQ §299.6)

**Charge:** prove or refute the full repo gate at codex tip `eedd4e9c`
(branch `codex/first-map-vertical-slice`), which has never been gated.

**Status of this receipt:** COMPLETE. Three gate runs, one isolation probe, one
boot smoke, worktree removed.

---

## 0. OUTCOME

# **GATE AT `eedd4e9c`: GREEN. `TRUE_EXIT=0`.** (CONFIRMED)

The codex tip **passes the full 17-step repo gate end-to-end.** Quoted from the
self-named log `laneCG1-gate-run3.log`, in-shell:

```
[test-ratchet] STRICT DIST OK — 51 discovered/reported file(s), 409 test(s), zero failed/non-run/uncollected/missing/extra/duplicate rows.
TRUE_EXIT=0
```

Plus, beyond the gate: **`smoke:boot` PASS** —
`boot-smoke: PASS — the built bundle boots.`, in-shell `TRUE_EXIT=0`
(log `laneCG1-smokeboot.log`; `524 chunks · entry index-DaCmEYw-.js`,
`6557 static chunk edges`, `524/524 chunks initialised`,
`shell mounted, 31706 B of markup under #root`). This closes the standing
"`smoke:boot` guards an un-bootable dist" hazard for this tip.

**Ledger of runs:**

| Run | Command | In-shell result | Log |
|---|---|---|---|
| 1 | `npm run check` (bare) | **RED, `TRUE_EXIT=1`** at step 15; steps 16–17 blinded | `laneCG1-gate.log` |
| probe | `npx vitest run tests/components/npcAuthoringScope.test.jsx` | `16 passed (16)`, `TRUE_EXIT=0` | `laneCG1-isolate-npcAuthoringScope.log` |
| 2 | steps 15;16;17 semicolon-separated (unblinded) | `RATCHET_EXIT=0` `BUILD_EXIT=0` `VERIFYDIST_EXIT=0` | `laneCG1-unblind.log` |
| 3 | `npm run check` (bare, end-to-end) | **GREEN, `TRUE_EXIT=0`** | `laneCG1-gate-run3.log` |
| smoke | `npm run smoke:boot` | **PASS, `TRUE_EXIT=0`** | `laneCG1-smokeboot.log` |

**The verdict is GREEN, and the honest qualifier is that it took two attempts.**
Run 1's red was a single non-reproducing failure in a test the slice never
touched, on a machine running at ~11–18x its core count. §0b records it in full;
it is not swept under the green.

## 0b. Run 1's RED — recorded in full, classified, and refuted

### The failure, verbatim from `laneCG1-gate.log`

Captured in-shell from the self-named log
`laneCG1-gate.log`:

```
[test-ratchet] TEST REGRESSIONS (fix them; do not widen the census):
  1 failing test(s) NOT in the frozen census:
    tests/components/npcAuthoringScope.test.jsx :: OutputContainer NPC authoring scope a public dossier denies writers even when editMode and the caller capability are stale

Frozen census is 11 failing test(s), measured at 4deb4f026644cba500b0efc1e051fdea2ff96041.
Run `npm run test` for the unfiltered reporter output.
```

**One red, at step 15 of 17 (`test:ratchet`). Steps 16 (`build`) and 17
(`verify:dist`) were BLINDED by the `&&` chain and are UNMEASURED on run 1 —
they are not green, they are unknown.** Un-blinding is in flight.

### ⚠ THE WRAPPER-EXIT TRAP FIRED — read this before trusting any harness summary

My harness reported the backgrounded gate command as
**`completed (exit code 0)`**. That is the exit of the trailing `echo`, not the
gate. The in-shell truth is **`TRUE_EXIT=1`**. Had I taken the harness summary,
I would have filed a GREEN receipt on a RED gate. Every figure in this receipt
comes from the in-shell `TRUE_EXIT=$?` and the self-named log, never from a
wrapper status.

### Classification of the single red: **MACHINE / FLAKE under contention — NOT introduced by `eedd4e9c`, NOT a census re-record defect** (CONFIRMED on three independent legs)

1. **It cannot have been introduced by the tip commit.**
   `git diff --name-only f4ad467d eedd4e9c -- src tests` returns **0 files**.
   The terminalization is docs-only. `tests/components/npcAuthoringScope.test.jsx`
   and its subject are byte-identical at `f4ad467d` and `eedd4e9c`. CONFIRMED.
2. **It passes in isolation, on this same worktree, at this same sha.**
   `npx vitest run tests/components/npcAuthoringScope.test.jsx` →
   `Test Files  1 passed (1)` / `Tests  16 passed (16)`, `Duration 6.26s`,
   in-shell **`TRUE_EXIT=0`** (log:
   `laneCG1-isolate-npcAuthoringScope.log`). CONFIRMED.
3. **The test has a documented flake history and the machine was saturated.**
   The most recent commit touching the file is
   `b19d69de Stabilize cold lazy NPC authoring scope test` — i.e. this exact
   file has already been stabilized once for cold/lazy timing. At the moment
   `test:ratchet` ran, `uptime` reported load averages
   **`72.52 52.75 34.16`** with **14** live vitest worker processes. CONFIRMED
   (both figures captured live during the run).
   The estate's standing distinction applies: *a walker can pass in isolation
   and fail on a contended machine.* This is that shape.

Also CONFIRMED: the ratchet baseline sha `4deb4f02` **is an ancestor of**
`eedd4e9c` (`git merge-base --is-ancestor` → true), and the failing test file is
**unchanged between `4deb4f02` and `eedd4e9c`**, so the frozen census was not
measured against a different version of this file. This is not an incomplete
re-record.

4. **It did not reproduce — twice, under heavier load.** Run 2's `test:ratchet`
   → `RATCHET_EXIT=0` at load `87.28`; run 3's full-chain `test:ratchet` →
   `[test-ratchet] OK — no test regressions (11 known failure(s) of 28638 tests,
   ceiling 11).` at load peaking `142.53`. **CONFIRMED: non-reproducing under
   equal-or-worse contention.**

**Final classification: MACHINE / FLAKE.** Explicitly *not* any of the other
buckets the chair asked me to sort into:

- **Not introduced by the last three commits.** Zero `src`/`tests` bytes differ
  across `f4ad467d..eedd4e9c`; the test and its subject are unchanged since the
  ratchet baseline sha.
- **Not census/ratchet-related.** The slice re-recorded censuses 13 times, and a
  red here would mean an incomplete re-record — but the ratchet's own accounting
  closes exactly: `11 known failure(s) of 28638 tests, ceiling 11`, with the
  frozen census measured at `4deb4f02`, an ancestor of this tip, and the failing
  file unchanged since it. **The re-records were complete.**
- **Not a structural timeout.** The step ran to completion and produced a
  specific per-test regression row, not a kill or a hang.

### What the chair should take away

The slice's own claim — MF-T1X.md §16, "Whole-tree landing gate completed the
full `npm run check` chain" at `f4ad467d` — is **corroborated on every
reproducible figure it published** (§5b: `173/173`, `1134/1134`,
`0 errors / 29 warnings`, `28638` tests / `11` at ceiling, `314` prerendered
routes, `51` files / `409` strict-dist tests — six of six exact matches; only
the wall-clock build second differs, which is not a pin). The terminalization
at `eedd4e9c` is docs-only, self-consistent with the packet validator
(`129 packets (0 READY)`), leaves no reserved change paths, and **gates green**.

## 1. Proof worktree provenance (CONFIRMED)

- Created detached, OUTSIDE the shared repo:
  `git -C /Users/cstokes/Desktop/settlement-engine worktree add --detach <scratchpad>/cg1-proof eedd4e9c`
  → `HEAD is now at eedd4e9c docs(town-map): terminalize MF-T1X fantasy construction`, `TRUE_EXIT=0`.
  6604 files checked out.
- The shared dirty tree at `/Users/cstokes/Desktop/settlement-engine` was NEVER
  built in, tested in, or mutated. Only read-only `git log`/`git diff` plumbing
  ran against it, plus the one permitted `worktree add`/`worktree remove` pair.
- Note: a codex worktree at `/Users/cstokes/.codex/worktrees/first-map-vertical-slice`
  already holds `eedd4e9c` **on the branch**. My worktree is detached, so it does
  not contend for the branch ref.

### Own node_modules (CONFIRMED — Law: never link the main tree's)

- `npm ci` in `cg1-proof`, log `laneCG1-npmci.log`, in-shell `TRUE_EXIT=0`.
- `node_modules` populated with **468** top-level entries in the proof worktree.
- Tail of log: `5 vulnerabilities (2 moderate, 3 high)` — advisory only, npm ci
  itself exited 0.
- Toolchain actually used: **node v24.12.0 / npm 11.6.2**. The worktree's
  `.nvmrc` at `eedd4e9c` reads **`22`**; no nvm install exists on this machine
  (`/Users/cstokes/.nvm/versions/node` does not exist). See RAISED §R1.

## 2. PACKET_MANIFEST verification (CONFIRMED — the never-re-serialize law HOLDS)

`git diff f4ad467d eedd4e9c -- docs/implementation/PACKET_MANIFEST.json`

**Verdict: PASS.** The diff is scoped text insertions/edits only. There is no
whole-file re-serialization: no key reordering, no quote churn, no whitespace
churn, no reflow of untouched records.

Shape, quoted from the diff itself:

- **Exactly two hunk headers** in a ~17k-line file:
  ```
  @@ -16177,7 +16177,7 @@
  @@ -16834,6 +16834,38 @@
  ```
- **numstat: `33 1 docs/implementation/PACKET_MANIFEST.json`** (+33 / −1).
  36 lines carry a leading `+`/`-` including the two file headers.
- Hunk 1 is a single-line status flip on the `MF-T1X` record and nothing else:
  ```
         "id": "MF-T1X",
  -      "status": "READY",
  +      "status": "LANDED",
         "packetPath": "docs/implementation/packets/town-cartography/MF-T1X.md",
         "verifiedBase": "39715d75a64819ee125148192cdc541e9f8992c9",
  ```
- Hunk 2 is a pure append of **8 `requiredSymbols` rows** onto an existing array
  (the `+` block is preceded and followed by unchanged context, and the only
  edited pre-existing line is the `}` that gains its `,`):
  `src/domain/townMap/fabric/operations.js` ×2
  (`FIRST_SLICE_MASSING_CONSTRUCTION_STATE_SCHEMA_VERSION`,
  `…_STATE_LAW_VERSION`),
  `src/domain/townMap/fabric/massingProjection.js` ×2
  (`FIRST_SLICE_MASSING_CONSTRUCTION_PROJECTION_LAW_VERSION`,
  `projectSavedFirstSliceMassingFantasyConstructionFixedSurvey`),
  `src/domain/townMap/fabric/index.js` ×4 (the barrel re-exports of those four).
- **Cross-check against the standing `requiredSymbols` hazard** (never put a
  re-recorded FIGURE in `requiredSymbols` — it traps every later train): all 8
  new rows are **export identifiers**, not numeric figures. No figure was
  planted. CONFIRMED by reading all 8 rows.

## 3. Full diff enumeration f4ad467d..eedd4e9c (CONFIRMED — matches the chair's expectation)

`git diff --stat f4ad467d eedd4e9c`:

```
 docs/implementation/INDEX.md                       | 34 +++++-----
 docs/implementation/PACKET_MANIFEST.json           | 34 +++++++++-
 .../packets/town-cartography/MF-T1X.md             | 78 ++++++++++++++++++----
 3 files changed, 115 insertions(+), 31 deletions(-)
```

**Three canonical files, +115/−31 — exactly the chair's expected shape.**
`--name-status` is `M M M` (no adds, no deletes, no renames). The range is a
single commit: `eedd4e9c docs(town-map): terminalize MF-T1X fantasy construction`.
Per-file numstat: INDEX.md `16/18`, PACKET_MANIFEST.json `33/1`,
MF-T1X.md `66/12`.

The terminalization is docs-only — **zero `src/` or `tests/` bytes move between
`f4ad467d` and `eedd4e9c`.** Consequence for classification: any gate red at
`eedd4e9c` that is not a docs-lint/naked-claim/packet-validator red is
necessarily inherited from `f4ad467d` or earlier, not introduced by the tip
commit.

## 4. Gate steps (from `package.json` at `eedd4e9c`)

`check` is a **17-step `&&` chain**:

```
validate:hazard-registry && validate:premortem && validate:packets &&
validate:data && validate:custom-content-manifest && validate:migration-head &&
validate:edge && validate:map && validate:tuning-bands &&
validate:foundry-module && validate:mcp-server && typecheck:ratchet &&
typecheck:domain:strict && lint && test:ratchet && build && verify:dist
```

Standing hazard that governs how this is read: **an `&&`-chain red BLINDS every
later step.** If it reds at step N, steps N+1..17 are UNMEASURED, not green.
Run discipline: BARE `npm run check` (never wrapped in `gate-mutex.sh --run`,
which self-deadlocks on `test:ratchet`/`verify:dist` — those wrap themselves),
fresh shell, all output to the self-named `laneCG1-gate.log`, `TRUE_EXIT` in-shell.

Machine context at gate start: load averages `5.67 5.97 5.32`, no live vitest
process, no held gate mutex
(`$TMPDIR/settlementforge-vitest-gate.lock` absent). Relevant for
timeout-vs-red classification.

## 5. Per-step results

All figures below are quoted from the self-named log
`laneCG1-gate.log` (Law L3 — no figure in this receipt comes from a shared or
recency-guessed log).

| # | Step | Result | Figure quoted from `laneCG1-gate.log` |
|---:|---|---|---|
| 1 | `validate:hazard-registry` | GREEN | `[hazard-registry] OK — 29 class(es): MACHINERY 12, PARTIAL 11, DOCUMENT 6, ACCEPTED 0. DOCUMENT 6/6, OWED 17/18 (shrink-only), MACHINERY 12/9 (grow-only), floor 27.` |
| 2 | `validate:premortem` | GREEN | `[premortem] SELF-CHECK OK — 28 predicates (16 derived, 12 authored of which 3 hybrid), 23/29 registry classes routed to a trigger, 6 uncovered and each explicitly exempted with a reason.` |
| 3 | `validate:packets` | GREEN | `[implementation-packets] valid: 129 packets (0 READY)` |
| 4 | `validate:data` | GREEN | `Summary: 0 exact duplicate(s), 0 casing collision(s)` / `[institution-service-keys] verified 281 ordered keys` |
| 5 | `validate:custom-content-manifest` | GREEN | `custom-content manifest artifacts are current` |
| 6 | `validate:migration-head` | GREEN (with standing visible warning) | `repo migration head = 196 (196 files, contiguous)`; `PENDING DEPLOY: prod applied head=121 … 75 migration(s) not yet in prod … (Visible, not fatal — this is the normal commit→deploy window.)` |
| 7 | `validate:edge` | GREEN | `Edge function syntax and guard contracts are valid (80 files; 43 test suites env-scope clean).` |
| 8 | `validate:map` | GREEN | `Map fork JavaScript parses successfully; 140 vendored libs match the supply-chain manifest.` |
| 9 | `validate:tuning-bands` | GREEN | `[check-tuning-bands] manifest v2 OK: 9 ratified soak bands, all valid.` |
| 10 | `validate:foundry-module` | GREEN | `foundry-module OK — module.json valid, 3 script(s) parse, README present.` |
| 11 | `validate:mcp-server` | GREEN | `mcp-server OK — package.json valid + dependency-free, 3 module(s) parse, read-only tool manifest, no write/network path.` |
| 12 | `typecheck:ratchet` | GREEN | `[typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173).` |
| 13 | `typecheck:domain:strict` | GREEN | `[domain-strict] ✓ no strict-type regressions (1134 errors, ceiling 1134).` |
| 14 | `lint` | GREEN | `✖ 29 problems (0 errors, 29 warnings)` — 0 errors, so eslint exits 0 and the `&&` chain continues. All 29 are React-compiler advisories (`Calling setState synchronously within an effect…`, `Cannot access refs during render`, `Cannot modify local variables after render completes`). |
| 15 | `test:ratchet` | **GREEN on runs 2 and 3** — `[test-ratchet] OK — no test regressions (11 known failure(s) of 28638 tests, ceiling 11).` · **RED on run 1 only** (§0b) | `gate-mutex: acquired atomic lock as PID 48040 after 0 poll(s).` (no lane contention for the mutex) then `[test-ratchet] TEST REGRESSIONS … 1 failing test(s) NOT in the frozen census: tests/components/npcAuthoringScope.test.jsx :: OutputContainer NPC authoring scope a public dossier denies writers even when editMode and the caller capability are stale` / `Frozen census is 11 failing test(s), measured at 4deb4f026644cba500b0efc1e051fdea2ff96041.` |
| 16 | `build` | **GREEN on runs 2 and 3** (blinded/unmeasured on run 1) | run 3: `✓ 3925 modules transformed.` / `✓ built in 32.15s` / `[prerender] wrote 314 static route documents (13 views + 15 gallery hubs + 286 compendium entries) under dist/` |
| 17 | `verify:dist` | **GREEN on runs 2 and 3** (blinded/unmeasured on run 1) | `[test-ratchet] STRICT DIST OK — 51 discovered/reported file(s), 409 test(s), zero failed/non-run/uncollected/missing/extra/duplicate rows.` |
| — | `smoke:boot` (**not** in the `check` chain; run separately) | **PASS** | `boot-smoke: 524 chunks · entry index-DaCmEYw-.js` / `stage 1: 6557 static chunk edges` / `stage 3: shell mounted, 31706 B of markup under #root` / `stage 2: 524/524 chunks initialised` / `boot-smoke: PASS — the built bundle boots.` |

### Step-3 cross-check (CONFIRMED, and it is the terminalization's own claim)

`validate:packets` independently reports **`129 packets (0 READY)`**, which is
exactly what `eedd4e9c`'s INDEX.md rewrite asserts (`129` packets / `0` READY).
The terminalization is therefore self-consistent with the validator, not merely
with itself. Corollary for the chair: with **0 READY**, the packet validator
reserves **no change paths** (the standing hazard is that any non-terminal
status — DRAFT included — reserves them). The tree is path-unreserved.

### Highest-risk step for THIS commit

`eedd4e9c` writes two `docs/**.md` files dense with new numeric claims
(INDEX.md's `129`/`0`, and MF-T1X.md §16's ~30 hashes and figures). The standing
hazard is that **naked-claim debt is per-claim and a new claim reds a GREEN
test** — that instrument lives in the vitest lint suite, i.e. inside step 15
`test:ratchet`. If this tip reds anywhere, step 15 is the expected place.

## 5b. The packet's own claimed landing figures at `f4ad467d` — cross-check

`docs/implementation/packets/town-cartography/MF-T1X.md` §16 (added by
`eedd4e9c` itself) claims the whole-tree `npm run check` at `f4ad467d`
produced:

| Claim in MF-T1X.md §16 | My independent measurement at `eedd4e9c` | Verdict |
|---|---|---|
| `tsconfig.full.json` `173/173` | `173 error(s), ceiling 173` | **MATCH (CONFIRMED)** |
| `tsconfig.domain-strict.json` `1134/1134` | `1134 errors, ceiling 1134` | **MATCH (CONFIRMED)** |
| test ratchet `28638` tests, `11` inherited failures at ceiling, no new failure | `[test-ratchet] OK — no test regressions (11 known failure(s) of 28638 tests, ceiling 11).` | **MATCH (CONFIRMED)** |
| ESLint `0` errors / `29` warnings | `✖ 29 problems (0 errors, 29 warnings)` | **MATCH (CONFIRMED)** |
| build `28.40s`, prerender `314` routes | `✓ built in 25.84s` / `[prerender] wrote 314 static route documents` | **routes MATCH exactly (CONFIRMED)**; build seconds differ (`25.84s` vs `28.40s`) — wall-clock is machine state, not a pin, and is not expected to reproduce |
| strict dist `51` files / `409` tests, zero missing/duplicate/failed/non-run/uncollected | `[test-ratchet] STRICT DIST OK — 51 discovered/reported file(s), 409 test(s), zero failed/non-run/uncollected/missing/extra/duplicate rows.` | **MATCH (CONFIRMED)** |
| whole sovereignty census `2484/364/2120/20594/5767` → `2484/364/2120/20598/5767` | (not a `check` step) | not measured here |

This is an unusually strong position: the terminalization commit publishes the
figures, and the gate re-derives them, so each row is a genuine falsifiable pin
rather than a naked claim.

## 5c. The 11 banked failures the ratchet is holding at `eedd4e9c` (CONFIRMED — read from `scripts/.test-ratchet-baseline.json` in the proof worktree)

The packet's "11 inherited failures at ceiling" is literal: the baseline file
carries exactly **11** entries. Header fields:
`measuredAtSha = 4deb4f026644cba500b0efc1e051fdea2ff96041`, `totalTests = 28274`,
`totalFiles = 2387`, `skippedCeiling = 1`, `uncollectedSuites = {}`.

The 11, by file:

- `tests/copy/voiceMechanics.test.js` — **4** (E-E JSX per-file + total debt
  ratchets; E2 `src/data`+`src/domain` string-literal per-file + total debt ratchets)
- `tests/lint/warCostKindPools.walker.test.js` — **3** (SP-6/WR-4 receipt-annex
  families for `trajectory_misread`, `war_trajectory_losing`, `war_trajectory_winning`)
- `tests/lint/warRulingKindPools.walker.test.js` — **1** (SP-6/WR-5
  `succession_demand_inherited` annex families)
- `tests/lint/clampPrimitiveBaseline.test.js` — **1** (code-quality-4 clamp
  baseline exactness)
- `tests/domain/metronomeCooldownLint.test.js` — **1** (non-cooldown emitter set
  shrink-only)
- `tests/docs/enforcement-claims.test.js` — **1** (A+ P1.1: every completeness
  claim carries an `@enforced-by` tag with ≥1 target)

**Chair-relevant consequence.** The docs-claim instrument
(`enforcement-claims.test.js`) is *already a banked failure* at this tip. That
partly de-risks the "a new docs claim reds a GREEN test" hazard for `eedd4e9c` —
an already-red banked test cannot red *further* — but it also means the
terminalization's ~30 new figures in MF-T1X.md §16 land on a surface whose
enforcement pin is not currently green. This is inherited debt, not something
`eedd4e9c` created; recorded so the chair does not read the gate's green as
"the docs-claim instrument passed on the new claims."

Two live guards worth naming because a green here is only meaningful with them:
`check-test-ratchet.mjs` carries a **SCOPE SENTINEL** (`the gate is no longer
running what it was frozen to run — a pass here would be VACUOUS`) that reds if
the collected test/file counts or skip count drift from the frozen scope, and
the baseline is **shrink-only** (`--update` can only REMOVE entries). So a green
ratchet at `eedd4e9c` is a non-vacuous green.

## 7. Run 2 — unblinded re-run of steps 15/16/17

Instrument: the three remaining steps run with **semicolons, not `&&`**, each
followed by its own in-shell exit capture, so a red at 15 cannot blind 16 and
17 a second time. Log: `laneCG1-unblind.log`.

```
npm run test:ratchet ; echo RATCHET_EXIT=$?
npm run build        ; echo BUILD_EXIT=$?
npm run verify:dist  ; echo VERIFYDIST_EXIT=$?
```

### Result: **all three GREEN. The red did NOT reproduce.**

In-shell exits, quoted from `laneCG1-unblind.log`:

```
RATCHET_EXIT=0
BUILD_EXIT=0
VERIFYDIST_EXIT=0
```

This ran under *worse* contention than run 1 (`load averages: 87.28 88.32 73.07`
mid-step, vs `72.52` on run 1), and `npcAuthoringScope.test.jsx` passed anyway.
The flake classification in §0 now has its reproduction leg: **non-reproducing
under equal-or-worse load. CONFIRMED.**

Figures, all from `laneCG1-unblind.log`:

| Step | Figure |
|---|---|
| 15 `test:ratchet` | `[test-ratchet] OK — no test regressions (11 known failure(s) of 28638 tests, ceiling 11).` |
| 16 `build` | `✓ 3925 modules transformed.` / `✓ built in 25.84s` / `[prerender] wrote 314 static route documents (13 views + 15 gallery hubs + 286 compendium entries) under dist/` |
| 17 `verify:dist` | `[test-ratchet] STRICT DIST OK — 51 discovered/reported file(s), 409 test(s), zero failed/non-run/uncollected/missing/extra/duplicate rows.` |

The gate-mutex again reported `acquired atomic lock as PID 80729 after 0 poll(s)`
— no vitest contention on either run, so the mutex is not implicated.

## 8. Run 3 — the decisive end-to-end proof

Because runs 1 and 2 together only *compose* a green (steps 1–14 from run 1,
15–17 from run 2), I ran the whole chain once more, bare, in one shell, to earn
an unambiguous single verdict rather than a stitched one.

`npm run check` → **`TRUE_EXIT=0`** (log `laneCG1-gate-run3.log`).

All thirteen validator/typecheck steps reproduced **byte-identical** figures to
run 1 — same 29 hazard classes, same `129 packets (0 READY)`, same `281` ordered
keys, same migration head `196`, same `80` edge files, same `140` vendored libs,
same `9` soak bands, same `173/173` and `1134/1134` ceilings, same
`✖ 29 problems (0 errors, 29 warnings)`. Steps 15–17 as tabulated in §5.

Run 3 executed at the *highest* contention of the session (`uptime` peaked at
`load averages: 142.53 113.01 87.08` mid-`test:ratchet`, ~18x the 8 cores) and
still returned zero. That is the strongest available evidence that run 1's red
was an artifact and not a latent defect.

## 9. RAISED

### R0 — ⚠⚠ THIS GATE RAN ON A 9x–18x OVERSUBSCRIBED MACHINE (CONFIRMED, and it is the likeliest cause of the red)

Measured live, mid-run:

- `sysctl -n hw.ncpu hw.physicalcpu` → **`8` / `8`**. This is an **8-core** box.
- `uptime` during step 15: load averages **`72.52`** (run 1), **`87.28`**
  (run 2), **`142.53`** (run 3) — roughly **9x to 18x** the core count.
- `ps aux` shows my vitest workers are **not** the only load. Two other lanes'
  CPU-saturating jobs are running concurrently, out of a *different session's*
  scratchpad (`.../a244e7a3-27d9-4152-b847-cf42cf4b08a7/scratchpad/`):
  - `node …/laneMFD0-interring.mjs` at **89.8%**
  - `node …/rs4/scripts/audit/whole-world-soak.mjs --years 30` at **85.3%**
  - plus ~6 of my own vitest workers at 43–67% each; 22 node processes total.

**Chair action implied.** Any timing-sensitive test — and
`npcAuthoringScope.test.jsx` is a cold-lazy React test that has already needed
one stabilization commit (`b19d69de`) — is a coin flip under this load. Running
a whole-tree gate concurrently with two saturating soak/audit lanes on 8 cores
does not produce a trustworthy red. The estate already knows *a walker can pass
in isolation and fail on a contended machine*; this run is a clean instance, and
it argues for serializing whole-tree gates against heavy lanes the way the
vitest gate-mutex already serializes vitest against vitest. The mutex did its
job (`acquired atomic lock … after 0 poll(s)` both runs — no vitest contention);
it simply does not know about non-vitest CPU hogs.

Incidental confirmation of worktree hygiene: every vitest worker's `--require`
path resolves to
`…/scratchpad/cg1-proof/node_modules/vitest/suppress-warnings.cjs`, i.e. the
proof worktree's **own** node_modules, never the main tree's.

### R1 — node major mismatch vs `.nvmrc` (PLAUSIBLE risk, no observed effect yet)
`.nvmrc` at `eedd4e9c` pins **22**; the only node on this machine is **v24.12.0**,
and there is no nvm. Every gate figure in this receipt is therefore a **node 24**
figure. This is almost certainly the same toolchain every other lane on this
machine has been using, but the chair should know the receipt is not a node-22
receipt. `package.json` declares **no `engines` field**, so npm did not object.
Mitigating: the gate is green on node 24 **and** the slice's node-whatever
figures reproduce exactly, so nothing here is currently biting.

### R2 — a flaky test is sitting outside the frozen census, unowned (chair judgment)
`tests/components/npcAuthoringScope.test.jsx :: … a public dossier denies
writers even when editMode and the caller capability are stale` failed once in
three whole-tree runs. It is **not** in the frozen census (correctly — it is not
persistent debt), and it has already absorbed one stabilization commit
(`b19d69de Stabilize cold lazy NPC authoring scope test`). I did **not** repair
it: this lane proves state, and the estate's law is that a flake is cured by a
real fix, never by widening the census (`[test-ratchet] TEST REGRESSIONS (fix
them; do not widen the census)`). Flagging it so the chair can decide whether a
second stabilization is warranted — **and specifically warning that it must not
be banked into the baseline**, which would convert an intermittent into
permanent debt and hide a real regression later.

### R3 — the gate's `&&` chain cost a full re-run to un-blind (process note)
Run 1 reported one red and left `build` and `verify:dist` **unmeasured**. The
standing hazard ("an `&&`-chain red BLINDS every later step") is real and it
cost ~12 minutes here. For a *proving* lane the semicolon form used in run 2
(`step ; echo EXIT=$?` per step) yields strictly more information at identical
cost, and I'd suggest it as the default instrument for verification lanes —
without changing `npm run check` itself, whose fail-fast `&&` is right for
authors.

### R4 — `smoke:boot` is outside `npm run check`
`check` is the 17 steps listed in §4; `smoke:boot` is a separate script, and
`check:full` extends `check` only with `check:edge-behavior`. So a green
`npm run check` **does not** prove the bundle boots. I ran `smoke:boot`
separately and it passed (§0), but the chair should know the gate alone would
not have caught an un-bootable dist — which is exactly the standing hazard on
record. `check:edge-behavior` was **not** run; it is outside my charge and
remains unmeasured at this tip.

---

## 10. Cleanup confirmation (CONFIRMED)

```
git -C /Users/cstokes/Desktop/settlement-engine worktree remove --force <scratchpad>/cg1-proof
REMOVE_TRUE_EXIT=0
ls <scratchpad>/cg1-proof → No such file or directory
git worktree list | grep -c cg1-proof → 0
```

The proof worktree is gone from disk **and** from the worktree registry (no
`prunable` stub left behind — several older lanes' worktrees in
`git worktree list` are still registered as prunable; mine is not among them).

### Shared-tree observation (not caused by this lane)

The shared tree's HEAD **moved during my run**: it was
`5848fb85 [review-fixes-2026-07-08]` when I took my first `git worktree list`,
and `ac957801bb4dadae427d86363e77480f3038a454` on the same branch when I
finished. Another lane committed into `/Users/cstokes/Desktop/settlement-engine`
while CG-1 was gating. **CG-1 did not do this** — this lane ran zero
state-mutating commands against the shared tree other than the permitted
`worktree add` / `worktree remove` pair, and every build, install and test ran
inside `cg1-proof` against its own `node_modules`. Recorded because the estate's
law is that the tree is LIVE and a moving HEAD invalidates cached beliefs about
repo state; the chair should not read my start-of-session snapshot as current.

---

## Files this lane produced (all in the session scratchpad)

- `laneCG1-receipt.md` — this receipt
- `laneCG1-npmci.log` — `npm ci` in the proof worktree
- `laneCG1-gate.log` — run 1, full `npm run check` (RED)
- `laneCG1-isolate-npcAuthoringScope.log` — isolation probe (PASS)
- `laneCG1-unblind.log` — run 2, steps 15/16/17 unblinded (all GREEN)
- `laneCG1-gate-run3.log` — run 3, full `npm run check` (GREEN, `TRUE_EXIT=0`)
- `laneCG1-smokeboot.log` — `smoke:boot` (PASS)

Nothing was written into `/Users/cstokes/Desktop/settlement-engine`.
