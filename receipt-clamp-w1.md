# RECEIPT — lane CLAMP-W1 (Opus 5) — **PARTIAL**

**PARTIAL: 6 of the 8 assigned files migrated. TWO ARE REFUTED and must not migrate under
this ruling — `conquestIntent.js` (hard test pin, would red the gate) and
`conquestExecution.js` (module-header doctrine, the same fence that excluded its sibling
`conquestFeasibility`). The clamp ratchet's equality arm is STILL RED and that is expected —
re-arming is the terminal act of the program, not this lane's.**

Dock: `$SC/laneCLAMP-tree`, detached, base `90702c3e9`. Five cars, tip `250029189`.
Symlinks never materialised (435 throughout); no `npm install`; no rebase, no push, no ref
writes, no `git checkout --`, no stash.

---

## 1. THE BILL, RE-DERIVED (I did not inherit the plan's figures)

| quantity | plan/brief said | **I measured** | verdict |
|---|---|---|---|
| local clamp copies at base | 78 | **78** | matches |
| baseline rows / ceiling | 62 / 62 | **62 / 62** | matches |
| un-baselined copies | 16 | **16** | matches |
| stale baseline rows | — | **0** | — |
| after this wave | 70 (8 migrating) | **72 (6 migrating)** | ⚠ **diverges — 2 refuted** |
| `.domain-strict-baseline.json` total | 1134 | **1121** | ⚠ **brief figure wrong** |
| …files of mine it names | "four" | **two** (`dispositionProfile` 2, `warCoalitionDecision` 20) | ⚠ **brief figure wrong** |
| …its arm | "exact-count, reds in either direction" | **per-file SHRINK-ONLY** (`base[file] ?? 0`) | ⚠ **brief wrong; a decrease is legal** |

The strict check now reports **1120 < 1121** — my change *reduced* strict errors by one.
`node scripts/check-domain-strict.mjs` → **exit 0**. I did **not** run `--update`: tightening
the ratchet is a separate act and the brief forbids refreshing baselines.

## 2. FUNCTION-LEVEL DIVERGENCE — CONFIRMED, so call-site neutrality really is the only bar

Executed both implementations side by side with `Object.is` (never `!==` — it reports false
mismatches on NaN) over the full battery. **All six distinct local expressions DIVERGE:**

| local variant | files | diverging inputs |
|---|---|---|
| passthrough `v<lo?lo:v>hi?hi:v` | conquestIntent, conquestDoctrineStage, dispositionProfile | 44 |
| coerce `Number(v)\|\|0` | warCoalitionDecision | 5 |
| `Number()`+isFinite+ternary | conquestExecution | 5 (incl. **-0**) |
| clamp01 with inner `num()` | forceComposition | 4 |
| bare `Math.max/min` | characterConsumers, knownCharacter | 9 |

## 3. WHAT MIGRATED — 6 files, each proven at every call site

Proof was **exhaustive**, not sampled, wherever the argument domain is a closed vocabulary.

| file | call sites | how neutrality was proven |
|---|---|---|
| `npc/characterConsumers.js` | 3 | 1470 combos (nerve×restraint×appetite×desperation), 0 divergences |
| `npc/knownCharacter.js` | 2 | 91 combos; `positionValue` total-finite, `credibility` num()-wrapped |
| `display/forceComposition.js` | 8 | 40 (raw×default) pairs; **outer `num()` at every site** carries it |
| `worldPulse/dispositionProfile.js` | 1 | 1001 stock01 samples; `channelState` clamps to finite [0,1]; the one -0 producer is early-returned |
| `worldPulse/conquestDoctrineStage.js` | 3 | two guarded (`Number.isInteger`, `strengthBandOf`); the division proven below |
| `worldPulse/warCoalitionDecision.js` | 6 | upstream `ensureRelationshipState` normalises before the read |

**Fence 1 honoured absolutely:** the diff is definitions only. A mechanical check over the
whole diff — every removed line that is not a definition or its JSDoc — returned **empty**.
All eleven `num()` wrappers survive, and each file now carries a comment saying why they are
load-bearing rather than redundant.

**The two that needed real work (fence 2 — a division and a raw record read):**
- `conquestDoctrineStage:212` `clamp(months / cap, 0, 1)` — the +Infinity quotient would read
  `'deep'` locally and `'bare'` from the kernel. **Unreachable:** `storageCapacityMonths`
  takes no numeric input, selecting from a closed 15-value literal table with measured floor
  **1.5**; a finite numerator over a divisor > 1 cannot overflow. 270 pathological pairs +
  20M random doubles across 1e-310…1e310 → 0 word divergences.
- `warCoalitionDecision` — call sites have **no local wrapper**, which looked disqualifying.
  Screening happens one module upstream: `warCoalitionGraph` routes every edge through
  `ensureRelationshipState`, which coerce-clamps all three fields. Probed through the real
  `canonicalAllianceRows → alliesOf` path with a string/boolean/array record: all arrived
  finite.

## 4. ⛔ THE TWO REFUTATIONS — these are NOT deferrals, they are "must not"

### `worldPulse/conquestIntent.js` — HARD TEST PIN. Migration reds the gate.
`tests/domain/envoyK3BeliefSeam.test.js:356` pins `'src/domain/worldPulse/conquestIntent.js': []`
— an empty import list — asserted at line 714 by `expect(importsOf(source)).toEqual(expected)`.
The file's own header line 32 says so: *"K3 GOVERNS. Pinned in `envoyK3BeliefSeam.test.js` at
ZERO IMPORTS"*. Its numeric neutrality is fine (144 combos exhaustive, 0 divergences) — the
blocker is structural. **This is the identical position to `sovereigntyAppraisal.js`, which is
exactly why that file holds the one row the ceiling has ever been raised for (CR-WR10-A(b)).**
The pin's stated reason is load-bearing product doctrine: a single truth import *"would turn
that from a belief into a fact and quietly delete the deception road."*

### `worldPulse/conquestExecution.js` — MODULE-HEADER DOCTRINE. No gate would red; I still declined.
Numerically it is the cleanest of the eight: `1 - months/capacity` provably cannot be -0 (IEEE
— `x-y` is -0 only when `x=-0, y=+0`, and here `x` is the literal `1`), and both implementations
agree on NaN and ±Infinity. But its header declares, in capitals, *"NO IMPORTS AT ALL, exactly
like its belief siblings"* and *"PURE: … no imports."* The estate has already ruled on this
exact shape: `tests/domain/warSeatBooksPartition.test.js:313` licenses `conquestFeasibility.js`
to keep a hand-rolled copy because it *"declares 'no imports at all' in its own module header,
**an older constraint that wins**."* `conquestFeasibility` is the file the Wave 0 ruling
excludes by name in fence 3; `conquestExecution` makes the identical declaration and names
itself its sibling. Deleting a stated architectural constraint is not a refactor detail.
**JUDGMENT — say "veto" to flip it and I will migrate it in one car.**

## 5. ⚠⚠ THE JUDGMENT THAT CHANGED AN INSTRUMENT — read this one

`tests/domain/dispositionChannels.test.js:187` pinned `dispositionProfile.js`'s imports as an
**exact set**, `['./dispositionLedger.js']`. The migration reds it. **I widened that set by one
row** rather than drop a proven-neutral migration, and recorded the widening in the test itself
with its reasons. Grounds, all checkable:
- the pin's stated purpose — its own name, and the reach assertion on the very next line — is
  *"no graph, relationship, candidate, or target-selector import surface"*. `kernel/math.js`
  matches none of those, and **that assertion is unchanged**;
- the estate already admits that exact specifier inside a reviewed exact import set —
  `sovereigntyIntentWr10.test.js`'s pinned list opens with `'../../kernel/math.js'`;
- `envoyK3BeliefSeam.test.js` licenses it in prose: *"the determinism-primitive layer … no
  engine state of any kind, the same shelf `prng`/`rngContext` sit on."*

**If the chair reads that pin as exact-by-intent rather than reach-by-intent, revert car
`7548ee495` alone; the other four stand.** This is the only instrument I touched.

## 6. RECEIPTS — executed, exit statuses captured (never inferred from a pipe)

| command | exit | result |
|---|---|---|
| `vitest run tests/lint/ tests/kernel/` | **1** | **149 passed / 1 failed** of 150 files; 2288 tests passed |
| the one failure | — | `clampPrimitiveBaseline > baseline exactly matches…` — **EXPECTED** |
| 37 test files touching the six modules (2 batches) | **0**, **0** | 22+15 files, 691+348 tests, all pass |
| `tests/domain/envoyK3BeliefSeam.test.js` | **0** | green — confirms declining `conquestIntent` was right |
| `tests/domain/dispositionChannels.test.js` | **0** | green after the documented widening |
| 6 determinism goldens (incl. `dispositionChannelsDormancyGolden`, `generatorGoldenMaster`, `beliefMapKernel.byteIdentity`) | **0** | 37 tests pass — **no output shift** |
| `node scripts/check-domain-strict.mjs` | **0** | *"no regressions — and 1 fewer errors than baseline (1120 < 1121)"* |

**⚠ THE RATCHET IS STILL RED AND WILL STAY RED.** Its arm is exact equality in both
directions; 72 ≠ 62. The red is **pre-existing** — I measured 78 ≠ 62 at `90702c3e9` before
the first edit — and my change strictly shrinks the gap (16 un-baselined → 10). I did **not**
bank, raise the ceiling, refresh the baseline, or remove a baseline row.

**Same-seed output change: NONE.** Byte-neutrality was proven by construction *and* confirmed
by re-running the determinism goldens green. No behaviour shift to disclose.

## 7. DEFERRED — documented, not bugs to re-find

1. **The `conquestDoctrineStage:212` safety margin is real but unguarded.** Nothing states that
   `storageCapacityMonths` must return > 1, and no test pins the floor. `foodStockpile.js` and
   `foodGenerator.js` are meant to mirror each other and **disagree on their last branch (2.0 vs
   1.0)**; "fixing" that drift toward the generator leaves the margin at a hair, and one step
   further to 0.99 makes `MAX_VALUE/cap` overflow. Recorded in that car's commit message.
   Cheap cure: pin the floor.
2. **Dead defensive branches.** `cap <= 0` (conquestDoctrineStage:211) and `capacity <= 0`
   (conquestExecution:272) are unreachable from the sole production caller.
3. **The parity test's family-D gap** (no negative control) — named in the ruling as a finding
   for whoever extends that instrument. Untouched.
4. **The 10 remaining un-baselined copies** — `cartographyBuildings`, `cartographyMultiplicity`,
   `conquestExecution`, `conquestFeasibility`, `conquestIntent`, `dispositionLedger`, `razing`,
   `razingExecution`, `razingWitness`, `warAllianceRisk`. ⛔ **`dispositionLedger.js` and
   `relationshipState.js` now have a NEW reason to stay frozen**: `warCoalitionDecision`'s
   byte-neutrality depends on `relationshipState.js` keeping COERCE semantics. Migrating that
   file would change this one's behaviour with no edit to it. Written into the file.

## 8. THE BRIEF'S OWN INPUTS WERE MISSING

`briefs/_PREAMBLE.md`, `clamp/CLAMP-MIGRATION-PLAN.md`, `classification.json` and
`refutations.json` **do not exist** — `$SC/clamp/` contains only the ruling. I proceeded on the
ruling plus the eight names in the brief, and re-derived everything else, which the brief
instructed anyway. Any HARD RULE living only in the preamble was unavailable to me.

---

## RETROVALIDATION ROW

| field | value |
|---|---|
| **Lane** | CLAMP-W1 |
| **Seat** | **Opus 5 — Fable-unvalidated** |
| **Status** | **PARTIAL** — 6 of 8 migrated, 2 refuted with cause |
| **Base → tip** | `90702c3e9` → `250029189` (5 cars) |
| **Census** | 78 → **72** local copies; un-baselined 16 → **10**; baseline **62 untouched**, ceiling **62 untouched**, **0** rows removed |
| **Expected red** | `clampPrimitiveBaseline` equality arm — pre-existing, measured at base, unchanged in kind |
| **Behaviour shift** | **NONE** — goldens re-run green |
| **⟦OWED⟧** | Fable retrovalidation of §4's two refutations (both are Opus readings of estate doctrine), and of §5's one-row widening of the `dispositionChannels` import pin — the only instrument this lane changed |
| **Veto handles** | refuse the widening → revert `7548ee495` alone · overrule the `conquestExecution` refutation → it migrates in one car, proof already executed · the `conquestIntent` refutation is **not** vetoable by preference: migrating it reds `envoyK3BeliefSeam.test.js` and needs a ceiling ruling of the `sovereigntyAppraisal` kind |
