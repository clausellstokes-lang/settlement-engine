# COMPLETE — lane ENC3CHECK receipt

- Lane: ENC3CHECK. Seat: **Opus 5**. Opened and closed 2026-09-04.
- Mandate: **MEASUREMENT-AND-PLAN ONLY.** No edit, commit, stage, patch application or ref write.
- Dock under measurement: `laneENC-tree` @ `30c1667bc` (detached) — **13 uncommitted paths, irreplaceable. NOT TOUCHED.**
- Product tip measured against: `f537ce47e` (§891 landing, 27 cars).
- Companion deliverable: `enc3-landing-plan.md` (per-file summary, collision set, apply-check, the two rulings, the `nid` verdict, the hard limits, the ordered plan).

## What I did to the repository: nothing

Every mutating capability was deliberately avoided. For the record:

- **No `git checkout`, `stash`, `clean`, `reset`, `add`, `commit`, or `apply` (without `--check`)** anywhere, and nothing at all in `laneENC-tree` beyond `cat`/`grep`/`ls` file reads.
- The dock's status was read with `git -C … --no-optional-locks status --porcelain`, chosen specifically because it never takes the index lock.
- The apply-check was run against a **private scratch index**: `GIT_INDEX_FILE=$SCRATCH/f537.index git read-tree f537ce47e`, then `git apply --cached --check`. `read-tree` writes only to `GIT_INDEX_FILE`; `--cached --check` touches no working tree. The repository's real index and every ref were untouched.
- Trees for measurement were materialised with `git archive … | tar -x -C $SCRATCH`, never by checkout.
- **No subagents** (owner cap of four; I was one of three out). **No `node_modules` symlink materialisation.** **No `npm run check`, `build`, or full suite.** In the end I ran **no vitest at all** — every instrument was reproduced from its own committed source instead, which was cheaper and carried no dirty-tree risk.
- Scratch confined to `…/scratchpad/enc3check/`.

## CONFIRMED — executed evidence

**C1. The dock is unchanged since the chair's capture, so the 13 are the whole set.**
`diff PORCELAIN.txt porcelain-now.txt` → identical. 11 modified + 2 untracked. **Zero new test files.**

**C2. The preserved patch still applies cleanly to `f537ce47e`.**
`APPLY_WHOLE_EXIT=0`, no output. All 11 files exit 0 individually; 20 hunks.
Controls both directions: positive vs `30c1667bc` → 0; negative vs `60255ca8e` → 1 (four files fail, one absent); negative with a corrupted patch vs `f537ce47e` → 1. The instrument moves, so the green is a bit rather than a silence.

**C3. The collision set is exactly one file: `src/domain/worldPulse/simulationRules.js`.**
86 files moved in the span; intersection = 1. Moved by `c6d598d5b` (O-12), `1 file changed, 25 insertions(+)`, comment-only, at ~line 642. ENC-3's hunk is at line 475. Disjoint.

**C4. Both ledger rulings are still unexecuted at `f537ce47e`.**
`GRUDGE_KINDS = Object.freeze(new Set(['contest_loss', 'contest_forestalled']))` — no `rivalry`.
`BOND_KINDS = Object.freeze(new Set(['loyalty', 'gratitude', 'friendship']))` — no `respect`.
The stale "until the owner rules" comments are in the ENC-1/ENC-2 leaves (`envoyChanceMeeting.js:129`, `envoyChanceMeetingLedger.js:56,68`), quoted in the plan.

**C5. The `nid` defect is real.** `taughtRecently` declares `nid`, is passed it correctly, and never reads it; it iterates `Object.values(driftMap)`, and `characterDriftOf` returns `Record<wnpcId, Record<axisId, AxisDrift>>` (`characterDrift.js:314-328`). The per-subject season cap is therefore a world-wide lockout. Cure quoted in the plan.

**C6. A second, unreported defect: the promised `respect`/`rivalry` refusal does not exist.** The leaf emits `kind: outcome` (`'respect'`/`'rivalry'`); `collectDeposits` hardcodes `mark: 'bond'` and passes `kind` through with no check; `normalizeBonds` coerces an unknown kind to `'friendship'`. A rivalry is recorded as a friendship. Three sibling comments assert a refusal that is not in the code.

**C7. The Tier-2 voice arm BREACHES three ceilings.** Measured by extracting the estate's own `stringLiteralContents` **verbatim from the committed test source** and running the magnitude report over `git archive` trees. At `f537ce47e` my computation reproduced **all five committed ceilings exactly** (em 382/382, bang 9/9, files 69/69, total 770/770, bang-total 15/15) — five figures I did not fit, which is the strongest control available. With ENC-3: em **392** > 382, files **70** > 69, total **780** > 770. Single cause: 10 em dashes in string literals in `subsystemRowsEncounters.js` at lines 54, 64, 69, 84, 89.

**C8. Three `@enforced-by` targets dangle, naming two phantom test files.** Simulated with the walker's own `PATH_RE`, `MARKER` and wrap reader. `tests/domain/envoyChanceMeetingStage.test.js` and `tests/property/chanceEncountersDormancyFence.test.js` exist nowhere — absent at `f537ce47e`, absent in the dock (`ls` → No such file or directory), absent from the 13. `tests/docs/enforcedByExists.test.js` walks `src` and asserts `existsSync`. It is not a banked row.

**C9. The drift-door closure STEP 1 reds.** Measured against the stage's real text: ARM 1 (module-path regex) `true`; ARM 2 (`characterDriftOf(`) `true`; FAMILY membership `false`. Also measured: dropping `characterDriftOf` does **not** cure ARM 1, because that arm fires on any import from `characterDrift.js`.

**C10. The brief's "known-failure census FULL at 10/10, zero headroom" is stale.** Baseline holds **10 entries**; `testRatchet.test.js:182` reads `const CEILING = 17;`, raised by `9df7e428b`. Headroom 7.

**C11. The lighting register is current at `f537ce47e` for `files`.** Register `files = 2515`; live tracked `*.test.js(x)` under `tests/` = **2515**, exact. Two new test files ⇒ 2517.

**C12. `CPL-21 / INTERIOR→GRAMMAR` needs no new registration** and `couplingRegistry.test.js:753` stays green: `ENC_ENCOUNTERS_COUPLINGS` composes at index 170, after `WR5_WAR_RULING_COUPLINGS` at 147.

## PLAUSIBLE — reasoning, basis stated

**P1. `positionValue` gaining an export on `characterDrift.js` cannot be the charter's operative cure.** Basis: `positionValue` is already exported there (`characterDrift.js:407`), and ARM 1 fires on the import path regardless of symbol (measured). The reading that works is a new named export **on the door**, `characterConsumers.js`. I did not see the charter text, so I report the mechanism and refuse to assert its meaning.

**P2. `negativeAssertionAnchor` will bill the `tests/property` file and probably the `tests/domain` one.** Basis: `GENERATION_FACING_ROOTS = ['tests/generators','tests/joins','tests/simulation','tests/property']` (read at `f537ce47e`) makes the property file certain; the walker also carries an exact-keyed `tests/domain` roster, which makes the domain file likely. Not executed.

**P3. `mutationCoverageManifest` TOTALITY will not bill either new test file.** Basis: neither sits in one of the seven enforcer dirs, and neither basename carries an invariant token from the recorded list. Rule read from memory, not executed.

**P4. O-12 moved the `mechanismLitCoverage` flag denominator.** Basis: ENC-3's own comment states the walker scans this file's raw source for `/\b…Enabled\b/` without blanking comments, and O-12 added a comment block naming eight such flags. Not executed; flagged for re-run rather than asserted.

## Corrections I made to my own work

- A first apply-check probe in the main checkout produced six `No such file or directory` errors. Cause: the main tree is the **ledger line** at `88be66ab8` and carries no `src/`. Discarded, and the target-sha check rebuilt on a private index. The recorded law held: anchor product measurement to the build sha, not the checked-out worktree.
- That same probe printed `EXIT_A=0`, which was `head`'s exit, not `git apply`'s — the false-report class. Discarded and announced; every exit thereafter was captured directly rather than through a pipe.
- I first read `.voice-mechanics-baseline.json` (455 em / 102 rows) as the constraint and could not reconcile it with the brief's 382. Wrong object. The armed constraint is the **magnitude ceiling on the banked census row**. Corrected, and the corrected instrument then reproduced five committed ceilings exactly.
- I suspected my own tokenizer of desyncing when it reported em:25 on a file absent from the baseline. Rather than trust it, I diffed my transcription against the committed source (identical but for one variable name) and then re-derived from the committed source directly.

## Deferred, documented, not a bug to re-find

- `sizeBaseline` / byte-budget impact of +47,658 B of new source: **not measured**. Deliberately deferred — running a size ratchet needs a build, which my mandate forbids.
- The §7.4 meeting and mark rates asserted in the certification row: **not executed**. Deferred, and noted as suspect because they sit on top of a broken season cap.
- The lighting census `titles`, `suiteTitles`, `parked`, `credited` deltas: **refused by name**, not deferred — they are unknowable until the two test files exist.

## Judgment calls held and handed up

1. **The drift-door cure** — three options, one recommended (a new named export on the door). Not taken: it decides a public-surface shape. Chair's.
2. **`respect`/`rivalry`** — carry the rulings, or implement the documented refusal. Not taken: option (A) changes what is persisted into a ladder record, which is persistence shape and owner-gated. What is *not* optional, and is my finding rather than a choice: shipping neither ships the inversion.
3. **Banking versus curing.** Seven census slots are free, so the reds *could* be banked. I recommend against all of them: each has a cheap real cure, and banking a row disarms it.

## RETROVALIDATION ROW

| Claim | Status | How it was proved | What would falsify it |
|---|---|---|---|
| Patch applies clean at `f537ce47e` | **CONFIRMED** | `git apply --cached --check` exit 0, whole and per-file, over a private index read-tree'd from `f537ce47e`; positive control at the true base, two independent negative controls | A non-zero exit at the current tip after further movement — re-run at step 0 before landing |
| Collision set = {`simulationRules.js`}, benign | **CONFIRMED** | `git diff --name-only` intersect; the colliding commit is comment-only at ~642 vs ENC-3 at 475 | A later commit touching `ENGINE_GATED_VIRTUAL_RULE_KEYS` |
| Both rulings unexecuted | **CONFIRMED** | `git show f537ce47e:…/npcLadderState.js` lines 383, 407 quoted | A commit adding either member after `f537ce47e` |
| `nid` ignored ⇒ world-wide lockout | **CONFIRMED** | Function body quoted; map shape read from `characterDriftOf` | A test showing two subjects learn independently — none exists, which is the point |
| Voice arm breaches 3 ceilings (392/70/780 vs 382/69/770) | **CONFIRMED** | Estate's own scanner extracted verbatim; **all five ceilings at `f537ce47e` reproduced exactly**; ENC-3 overlay measured on an isolated `git archive` tree | A change to the ten string literals, or a ceiling re-derivation; re-measure, never re-quote |
| 3 dangling `@enforced-by`, 2 phantom test files | **CONFIRMED** | Walker's own regex/wrap reader simulated; `existsSync` checked at both the product tip and the live dock | Someone writing the two test files |
| Drift-door STEP 1 reds; `positionValue` alone cannot cure it | **CONFIRMED** | Both `dependsOn` arms measured against the stage's real text, plus the counterfactual with `characterDriftOf` removed | A change to `DRIFT_SYMBOLS`, `FAMILY` or the module-path regex |
| Known-failure census has 7 slots, not 0 | **CONFIRMED** | 10 entries counted in the baseline; `CEILING = 17` quoted from source | A ceiling lowering, or nine new banked rows |
| Charter's `positionValue` clause is not the operative cure | **PLAUSIBLE** | Export already present at line 407; ARM 1 measured to fire on path alone. **I did not read the charter text.** | The charter meaning an export on `characterConsumers.js`, which is the reading I recommend |
| `negativeAssertionAnchor` bills the property file | **PLAUSIBLE** | `GENERATION_FACING_ROOTS` read from source; not executed | Executing the walker against the written file |
| `mutationCoverageManifest` bills neither | **PLAUSIBLE** | Dir/basename rule from the recorded memory row; not executed | Executing the manifest walker |

**Bottom line, stated once: the work survived the drift intact and is not landable as it
stands.** The patch is clean and the collision is nominal, so nothing needs rebuilding. But
the car carries a correctness bug that no gate would have caught (`nid`), a semantic
inversion (`rivalry` → `friendship`), three gate reds (voice magnitude, dangling citations,
drift door), and — the most serious — a certification row whose six invariants cite
instruments that were never written. The cheap fixes are steps 2 and 3 of the plan; the
expensive and unavoidable one is step 6, writing the two tests the car already claims.
