# RECEIPT — LANE HORIZON-B2 (Opus 5 implementer/verifier under Fable 5.1 chair)
## STATUS: COMPLETE-UNDER-HOLD (see the OWED list; the header at the foot is authoritative)

Dock `$SC/laneHOR2` — arrival HEAD `5e28d5c8376b2c7333ffc8b911b378f04629da8f`, porcelain 0,
node_modules 453 symlinks. All three CONFIRMED on arrival.
Product tip had already moved to `6cab7c69a` (§898). No rebase (per brief).
Car 0 receipt does NOT survive: `git for-each-ref refs/preserve | grep -i worker` → 0 hits of 253 refs.
The design's ⟦G0-*⟧ figures are therefore treated as starting claims.

## PREMISES RE-DERIVED (before acting)
| premise (chair's claim) | measured | verdict |
|---|---|---|
| `settlementSlice.js` generate action at `:335-627` | `generateSettlement: async` at 335, closes at 628 | CONFIRMED (off-by-one on the closing brace) |
| size-baseline row `src/store/settlementSlice.js: 976` = the effective count | 976 effective (skipBlank+skipComments), 1970 raw | CONFIRMED exactly |
| `settlementSliceHelpers.js:30` re-exports `loadSettlementContentRuntimeOptions` | line 30, exactly one consumer repo-wide (the slice) | CONFIRMED; removal safe |
| `flagRegistry.js` `advanceWorkerParanoia` at `:64/:65` | `:85` (`simAdvanceWorker` `:84`) | ADDRESS DRIFT, name correct |
| `engineWorkerDomFree.test.js` `SCAN_DIRS` at `:50` = domain+kernel | `:49`, `['src/domain','src/kernel']` | CONFIRMED (line off by one) |
| walker reds 3 arms on a correct tree | measured reachers = 5 (slice, composeInstantWorld, ConstructionPanel, customContentPreview.worker, campaignContentBindingSession) | CONFIRMED, and see BRIEF ERRORS below |
| golden corpus "25 rows TIERS × CULTURES" | TIERS=6, CULTURES=12 (11 profile keys + mediterranean) ⇒ cross product is **72**, not 25 | BRIEF FIGURE WRONG (see below) |
| manifest rows = 525 | `Object.keys(generator-golden-master.json).length` = 525 | CONFIRMED |
| voiceMechanics Tier 2 covers "the protocol leaf's strings" | Tier 2 scans `src/data` + `src/domain` ONLY (`:230-232`) | BRIEF OVER-SCOPED: `src/lib/generationProtocol.js` is out of Tier 2; `densityCreateBoundary.js` IS in, and has NO baseline row ⇒ its em/bang must stay EXACTLY 0 |

## Steps
| # | step | outcome | sha |
|---|------|---------|-----|
| 0 | dock verify + premise re-derivation | CONFIRMED | — |
| 1 | 4 new leaves + lane body + 5 edits + walker amend + client test | built; eslint 0, client suite 17/17 | (uncommitted) |

## Proofs executed so far (every exit captured in-shell)
- `npx eslint` over all 11 touched files → `ESLINT_EXIT=0`
- espree parse over all 11 touched files → 11/11 OK
- `tests/lint/densityCreateBoundary.walker.test.js` → `TRUE_EXIT=0`, 7 passed
- PLANT A (an EXECUTOR row on a file that mints) → `PLANT_A_TRUE_EXIT=1`, 3 failed / 4 passed
  ("classified DERIVED/PREVIEW but mints the birth law: src/store/settlementGenerateAction.js").
  Reverted; `cmp` against the pre-plant backup → `CMP_REVERT_A_EXIT=0`.
- PLANT B (a dangling `reachesVia` pointer) → `PLANT_B_TRUE_EXIT=1`, 1 failed / 6 passed
  ("classified modules that no longer reach the pipeline"). Reverted; `cmp` → `CMP_REVERT_B_EXIT=0`.
  ⇒ the amended stale arm is NOT merely permissive: a dangling executor pointer still reds.
- `tests/lib/generationClient.test.js` → `CLIENT_TRUE_EXIT=0`, 17 passed (4 describes, 17 tests — the predicted tuple)

⚠ A background-task notification reported "exit code 0" for PLANT A while the in-shell capture
said `PLANT_A_TRUE_EXIT=1`. The notification reports the SHELL's exit, not vitest's. Captured
exits are the only ones used here.

## Register deltas (predicted, no register act taken)
TBD — see the final receipt.

## RETROVALIDATION ROW
TBD.


---

## MEASUREMENT CORRECTIONS TO THE BRIEF (each one changed what I built)

1. ⛔ **THE SIZE-BASELINE ROW IS LOWERED, NOT DELETED.** The design predicted
   `976 - ~290 + ~4 ~= 690` and concluded "under the 800 layer ceiling -> the ENTRY IS
   DELETED", with `sizeBaseline.test.js` said to *demand* deletion.
   MEASURED with eslint's own `max-lines(skipBlankLines, skipComments)` counter (the same
   `Linter` call `sizeBaseline.test.js` makes): `src/store/settlementSlice.js` = **824**, still
   **24 effective lines OVER** the 800 ceiling. The row is therefore LOWERED 976 -> 824 and
   KEPT; deleting it would have reddened the walker's `baseline keys == the set of files that
   actually exceed their layer ceiling` arm.
   WHY the chair's figure was wrong: the moved block is heavily COMMENTED and the counter skips
   comments, so the slice shed 152 effective lines, not ~290 (the lane body's own effective
   count in its new home is 183, including its new import block and header).

2. ⛔ **THE GOLDEN CORPUS SAMPLE: "25 rows TIERS x CULTURES" IS NOT A CROSS PRODUCT.**
   MEASURED: `TIERS` = 6, `CULTURES` = `[...CULTURE_PROFILE_KEYS, 'mediterranean']` = **12**
   (11 profile keys + the alias), so the cross product is **72**, not 25. A 25-row linear walk
   over both vocabularies can only produce 12 distinct pairs (tier period 6 divides culture
   period 12). The identity test therefore walks a DIAGONAL whose offset advances once per tier
   sweep, giving 25 distinct pairs that cover all 6 tiers and all 12 cultures, and it ASSERTS
   that coverage in its own arm rather than assuming it. That arm is the +1 test over the
   design's predicted 7 (see the register deltas).

3. ⛔ **`engineWorkerDomFree`'s WIDENING EXPOSED A FALSE INSTRUMENT, and the recon's premise
   was refuted.** The design says the recon "found only 4 prose hits in generators/instantWorld,
   all inside template literals the scanner strips". MEASURED after widening `SCAN_DIRS`: exactly
   ONE violation, `src/generators/power/governanceNarrative.js:582 - document`, and it is a FALSE
   POSITIVE. Root cause found and proven: the file's own char scanner has no notion of a REGEX
   LITERAL, so the apostrophe in `/\bthe mages' quarter\b/gi` (line 229) opens a phantom string
   that runs to the next apostrophe and DESYNCS the rest of the file, leaking prose out of a
   string 353 lines later.
   CURE TAKEN, measured both ways before landing: the scan now uses the estate's ONE shared strip
   (`tests/helpers/codeOnlySource.js`), which terminates an unterminated quote at end-of-line and
   so confines the same blind spot to one line. Over the PREVIOUS scope (src/domain + src/kernel,
   1,022 files) the two strippers AGREE at zero violations, so the swap changes nothing already
   guarded; over the WIDENED scope (1,145 files) the old scanner reports that one false positive
   and `codeOnly` reports none.
   ⇒ Design STOP **S1.6 did NOT fire**: there is no generator that cannot run in a worker today.

4. ⚠ **THE `workerFactory` SEAM WAS UNREACHABLE AS SPECIFIED** (found by the identity test, which
   asserted `outcome === 'worker'` and got `in-thread:no-worker`). The client's
   `typeof Worker === 'undefined'` probe ran BEFORE the factory, so in Node / vitest / SSR an
   explicitly INJECTED transport was silently ignored and the run fell in-thread while a less
   careful test would have believed it exercised the worker path. JUDGMENT (vetoable): the probe
   now applies only when the DEFAULT factory would be used. The SHIPPED path is bit-identical
   (production never passes a factory; every existing test still gets `in-thread:no-worker`); only
   an injected transport changes, which is the seam's entire purpose.

5. ⚠ **`codeOnly` CANNOT SERVE AN IMPORT-SPECIFIER CLAIM.** The design's re-anchor says "every one
   of those regexes runs over `codeOnly(source)`". MEASURED: `codeOnly` blanks string TEXT, and an
   import specifier IS string text, so the anchored `^import ... from '.../stepMetadata.js'`
   PRESENCE regex matched a run of blanks and reddened on a correct tree. Split at cause: the
   ABSENCE claim (the slice's prose could name the path) reads `codeOnly`; the PRESENCE claim reads
   RAW source anchored at `^import`, which a docblock line (` * `) cannot satisfy. Both halves and
   the reason are written into the arm.

6. ⚠ **voiceMechanics Tier 2 does NOT cover the protocol leaf.** MEASURED: Tier 2 scans
   `src/data` + `src/domain` only. `src/lib/generationProtocol.js` is out of scope;
   `src/domain/density/densityCreateBoundary.js` IS in scope and carries NO baseline row, so its
   em-dash/bang counts must stay EXACTLY 0 - the new EXECUTOR `why` string is em-dash-free and
   bang-free by construction.

7. ⚠ **The walker edit the design's edited-files list omits.** The create-boundary paragraph
   requires the lane body to join the BIRTH roster while the CORE is the module that reaches the
   pipeline. `PIPELINE_REACHERS` keys are held to the tree by the walker's stale arm, so a BIRTH
   row that no longer reaches the pipeline itself reds. `tests/lint/densityCreateBoundary.walker.test.js`
   is therefore an EDITED file (a `reachesVia` pointer, whose target must itself be a live reacher)
   and it is not in the design's list of seven.

8. ⛔ **NO `WORKER_BUNDLE_CEILING_BYTES` ARM WAS WRITTEN - a declared refusal, not an omission.**
   Car 0's receipt did NOT survive (`git for-each-ref refs/preserve | grep -i worker` -> 0 of 253),
   my brief gives the build to the chair, and the preamble forbids me a build. Minting a
   monotone-down byte ceiling from a figure measured on another tip, in a test that cannot run
   without a build, would pin a number with no receipt behind it. The absence and the exact arm
   owed are written into the test file's own header.

9. ⚠ Address drift, harmless, recorded for the chair's line references: `flagRegistry.js`
   `advanceWorkerParanoia` is at `:85` not `:64/:65`; `engineWorkerDomFree.test.js` `SCAN_DIRS` at
   `:49` not `:50`; the generate action closes at `:628` not `:627`.


---

## COMMITS (dock `$SC/laneHOR2`, detached; base `5e28d5c83`)

| # | step | outcome | sha |
|---|------|---------|-----|
| 1 | the lane and the transport, DARK: 5 new src leaves, the lane body, 5 edits, the create-boundary EXECUTOR class + walker `reachesVia`, the engineChunkLazy re-anchor, the size-baseline lowering, the mutation-coverage row, 2 new suites | GREEN on every proof run | `38faae233` |
| 2 | the worker-loadability guards widen: the new build test, `engineWorkerDomFree` SCAN_DIRS widened AND its scanner swapped for the estate's shared strip | GREEN on every non-vitest proof; 3 suites OWED at RESUME | `6d4a00039` |

**Dock tip: `6d4a00039`. Porcelain 0. No push, no rebase, no ref write, no register act, no `git stash`, no `git checkout --`.**
Both commits verified against the worktree after the pre-commit `eslint --fix` hook
(`git diff HEAD --stat` empty over every path; three files additionally `cmp`-checked
byte-for-byte against `git cat-file -p HEAD:<path>`), because the hook re-stages and
`git diff HEAD` is otherwise blind.

## PROOFS EXECUTED (exit captured in-shell, never from a task notification)
| proof | command | result |
|---|---|---|
| the new client suite | `gate-mutex --run -- npx vitest run tests/lib/generationClient.test.js` | exit 0, **17 passed** |
| the identity suite | `... tests/generators/generationWorkerIdentity.test.js` | exit 0, **8 passed** |
| both together at the tip | `... tests/generators/... tests/lib/...` | exit 0, **25 passed** |
| the create-boundary walker | `... tests/lint/densityCreateBoundary.walker.test.js` | exit 0, **7 passed** |
| PLANT: EXECUTOR row on a minting file | same | exit **1**, 3 failed / 4 passed; reverted, `cmp` exit 0 |
| PLANT: dangling `reachesVia` | same | exit **1**, 1 failed / 6 passed; reverted, `cmp` exit 0 |
| eslint, whole repo | `npm run lint` | exit 0, **0 errors** (31 pre-existing warnings, **0 in any file this lane touched**) |
| typecheck ratchet | `npm run typecheck:ratchet` | exit 0, 173 errors / ceiling 173 |
| domain strict | `npm run typecheck:domain:strict` | exit 0, 1120 / ceiling 1120 |
| observed-shape readers | `npm run check:observed-shape-readers` | exit 0, **1993 findings, exactly the frozen inventory** — the core adds no reader, as designed |
| stripper comparison (node) | scratch probe, both scanners x both scopes | previous scope 0 == 0; widened scope 1 (false positive) vs 0 |
| effective-line measurement (node) | eslint `Linter` max-lines, the sizeBaseline call | slice 976 -> **824** |
| generate-consumer enumeration | `grep -rl '\bgenerateSettlement\b' tests` | **26** files — the design's figure CONFIRMED exactly |
| `lastCtx` readers in tests | `grep -rn lastCtx tests/` | **0** — Car 0's figure (e) re-verified at this tip |
| the quarantine pin survives | node read of the slice | `/generateSettlementPipeline/` still matches (1 occurrence, the dynamic specifier) |

## ⛔ OWED UNTIL THE CHAIR'S RESUME (a gate-class run holds the quiet window)
Every command below is exact and runs from the dock. NONE of them has been run at the
committed tip; nothing in this receipt claims otherwise.
```
sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/                       # MANDATORY: src+test-adding train
sh scripts/gate-mutex.sh --run -- npx vitest run tests/copy/ tests/docs/           # the A20-E4 companions
sh scripts/gate-mutex.sh --run -- npx vitest run tests/build/generationWorkerLazy.test.js \
    tests/build/engineChunkLazy.test.js tests/architecture/engineWorkerDomFree.test.js
sh scripts/gate-mutex.sh --run -- npx vitest run $(grep -rl '\bgenerateSettlement\b' tests | tr '\n' ' ')
sh scripts/gate-mutex.sh --run -- npx vitest run tests/property/generatorGoldenMaster.test.js   # 0 of 525 must move
sh scripts/gate-mutex.sh --run -- npx vitest run tests/lib/generationClient.test.js \
    tests/generators/generationWorkerIdentity.test.js                              # re-prove AT the committed tip
```
Plus the plant-out the design names: delete the shell's `runGenerationRequest` import and the
client test must red; revert by inverse edit and `cmp` against a pre-plant backup.

## REGISTER DELTAS — PREDICTED IN WRITING, NO REGISTER ACT TAKEN
| register | delta | note |
|---|---|---|
| lighting `files` | **+3** | the three new suites |
| lighting `parked` | **+1** | `tests/build/generationWorkerLazy.test.js`: `describe.runIf` is not a `RUNNING_SUITE_MODIFIER` and parking is FILE-level (`parked ? [] : titles`), so the file parks WHOLE even though its first describe runs |
| lighting `credited` | **+2** | the client and identity suites; `parked + credited === files` holds |
| lighting `titles` | **+25** | 17 + 8. The design predicted 24 on a 7-test identity suite; the 8th arm is the sample-coverage guard the corrected vocabulary measurement forced |
| lighting `suiteTitles` | **+6** | 4 + 2; the parked file contributes 0 |
| ratchet `totalFiles` | **+3** | 2468 -> 2471 |
| ratchet `totalTests` | **+34** | 31491 -> 31525 IF the runIf-gated suite's 3 tests register as skipped-but-counted (they did in this lane's own runs); **+31** if the ratchet's collector drops them. ⚠ The chair must read the figure off the report rather than take either number from me: `skippedCeiling` is 1 today while dist-gated build suites already report ~10 skips, so the collector's treatment of a runIf park is NOT settled by anything I could measure without a full run. |
| golden-freeze register | **no row owed** | MEASURED: no `UPDATE_*` env spelling appears in any of the three new files, and the walker's obligation keys on golden-adjacent ENV SPELLINGS. The identity suite is golden-adjacent in SUBJECT but reads no door. |
| `mutationCoverageManifest` | **+1 rationale row** | `tests/generators/generationWorkerIdentity.test.js`; inserted TEXTUALLY (+4 lines) after a re-serialisation would have reordered 1,354 lines — the file is not key-sorted |
| `sizeBaseline` | row LOWERED 976 -> 824 | NOT deleted; see correction 1 |
| operation registry | **UNCHANGED** | the action KEY stays on the slice literal and its value still references `set`, so the walker's denominator is untouched |
| `entropyRootCensus` | **UNCHANGED expected** | `generateSeed()` moved one line and no docblock names it; OWED as part of `tests/lint/` |


---

## THE CLONE CENSUS, RE-RUN AT THIS TIP (scratch probe, nothing written into the tree)
Car 0's `scripts/audit/generation-clone-census.mjs` did not survive in `refs/preserve`, so the
five checks were re-run at `6d4a00039` as `$SC/generation-clone-census.probe.mjs`, driving the
SHIPPED core over the 525 rows read FROM THE MANIFEST KEYS (never a re-hoisted corpus builder)
plus one reroll fixture with a locked NPC. It was NOT added to `scripts/audit/` because that
instrument is chartered to Car 0, which is discharged; a scratch probe pays no register bill.

```
rows=526 cloneable=526 jsonLossless=526 keyCensusEqual=526 functions=0 classes=0 mapsSets=0 undefinedInArrays=0 mutatesConfigInPlace=false
symbols=0 bigints=0 dates=0 regexps=0 typedArrays=0 nonFiniteNumbers=0 frozen=39836
resolvedConfigEqualsSettlementConfig=0/526 rerollPreserved=1
TRUE_EXIT=0
```

⚠ **526, NOT 529, AND THE DIFFERENCE IS STATED RATHER THAN ROUNDED.** Car 0's 529 was
525 + 1 reroll + 3 instant worlds (one per `realmSize`). The `instant-world` op is Car 2 and
does not exist at this tip, so those three rows are not runnable here and are not claimed.

**PLANTS, both fired, both quoted (the Car 0 cure inherited: classify FIRST, unconditionally,
because `DataCloneError` carries no path):**
```
CENSUS_PLANT=function  -> TRUE_EXIT=1  functions=4  NAMED: result.settlement.__probe: function
                          FAILURES: "structuredClone threw — () => 1 could not be cloned."
                          (the path is NAMED even though the clone threw, which is the whole
                           point of classifying before cloning)
CENSUS_PLANT=map       -> TRUE_EXIT=0  mapsSets=4   (a Map is REPORTED, never fatal)
```

**TWO CAR-0 FINDINGS INDEPENDENTLY REPRODUCED AT THIS TIP:**
  · `mutatesConfigInPlace=false` — the pipeline does not mutate the caller's config.
  · `resolvedConfigEqualsSettlementConfig=0/526` — `JSON(fullConfigAfter) !== JSON(settlement.config)`
    on EVERY row. That makes the design's instruction load-bearing rather than defensive:
    analytics MUST read `resolvedConfig` off the result, and the lane body does exactly that.
    Reading `settlement.config` instead would have been a silent telemetry change on both paths.
  · `rerollPreserved=1` — the carry is non-vacuous inside the core (Car 0 measured the same 1).

## RETROVALIDATION ROW (Seat: Opus 5 — Fable-unvalidated)

**WHAT WAS JUDGED, by this Opus lane, without a Fable pass:**
1. **The size-baseline row is LOWERED to 824, not deleted.** Overturns the design's explicit
   instruction. Priority HIGH: it is a register-adjacent number and it contradicts the volume.
   Re-derive: run eslint's `Linter` with `max-lines(skipBlankLines, skipComments)` over
   `src/store/settlementSlice.js` at `38faae233` and read the figure off the message.
2. **The client's `Worker` probe now applies only to the default factory.** A behaviour change
   in a shipped module, justified as closing a false-green. Priority HIGH.
   Re-derive: `src/lib/generationClient.js`; the identity suite's end-to-end arm is the guard
   (it asserts `outcome === 'worker'`), and it FAILED before this change.
3. **`engineWorkerDomFree`'s scanner swapped for `tests/helpers/codeOnlySource.js`.** A landed
   instrument's detector changed. Priority HIGH — it is a guard-of-guards edit.
   Re-derive: run both scanners over `src/domain + src/kernel` (must agree at 0) and over the
   widened five dirs (old = 1 false positive at `governanceNarrative.js:582`, new = 0). The
   desync origin is the regex literal at `governanceNarrative.js:229`.
4. **No `WORKER_BUNDLE_CEILING_BYTES` arm was written.** A named refusal to mint an unmeasured
   ceiling. Priority HIGH for the landing lane, which owes the arm from its own build.
5. **The walker's stale arm now honours `reachesVia`.** A structural-prevention instrument was
   loosened; the compensating tightening is that the named executor must itself be a live
   reacher (PLANT B proves it). Priority MEDIUM.
   Re-derive: `tests/lint/densityCreateBoundary.walker.test.js`; re-run PLANT B.
6. **The identity suite carries 8 tests, not the predicted 7**, and its 25-row sample is a
   diagonal rather than a cross product, because `TIERS x CULTURES` is 72. Priority MEDIUM
   (it moves the predicted lighting `titles` from +24 to +25).
7. **`tests/generators/generationWorkerIdentity.test.js` takes its OWN rationale row rather than
   riding the shared `generators-tree-admitted` ref.** Priority LOW; the densityLaw row is the
   precedent cited in the text.
8. **The clone census was re-run as a scratch probe rather than added to `scripts/audit/`.**
   Priority LOW; the numbers above are the receipt.

**RECEIPTS BY PATH**
```
$SC/receipt-horizon-b2.md                      this file
$SC/generation-clone-census.probe.mjs          the census probe (scratch, never in the tree)
$SC/BACKUP-densityCreateBoundary.js            the pre-plant backup the two cmp reverts prove against
$SC/ORIG-mutation-manifest.json                the HEAD copy used to prove the manifest insert is +4 lines
/tmp/hor2-*.txt                                every captured run (lint, typechecks, OSR, suites, plants, census)
```

**DOCK TIP: `6d4a00039`  ·  porcelain 0  ·  base `5e28d5c83`  ·  no push, no rebase, no register act.**

## STATUS: COMPLETE for what could be proven under the chair's vitest HOLD.
The vitest proofs in the OWED list above are the remainder. Nothing in this receipt claims a
vitest result that was not executed and quoted.
