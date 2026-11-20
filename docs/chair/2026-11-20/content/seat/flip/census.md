# U8, THE FLIP'S CENSUS (FLIP-CENSUS (B), builder BFL): PARTIAL, AT THE CEILING

*State: the flipped whole-suite run was stopped by the harness's 2-hour ceiling; this file holds its partial census. The 793-file census set's flipped shards and its unflipped control follow, and the four lists are completed below as they land.*

**The flip** (the scratch copy `wt-flip-lit`, a detached worktree of `9cc5045f2`, never committed), its whole diff against the cut:

```
src/domain/seat/seatCircumstances.js   -export const SEAT_CONTEST_LIT = false;
                                       +export const SEAT_CONTEST_LIT = true;
src/domain/seat/seatLaw.js             -export const NEW_SETTLEMENT_SEAT_LAW_VERSION = DEFAULT_SEAT_LAW_VERSION;
                                       +export const NEW_SETTLEMENT_SEAT_LAW_VERSION = HOLDER_SEAT_LAW_VERSION;
```

`SEAT_CIRCUMSTANCE_TUNING` untouched. The ledger ref `review-fixes-2026-07-08` was fetched in the copy (`235efce1a`) before the run.

## The run, and how it ended

- Launched 20:00:52Z on the flipped copy as a background task: `gate-mutex.sh --run` (both exports inline, the SHARED tier), `npx vitest run --maxWorkers=2`, one log (default reporter) plus a JSON report, never through a pipe.
- **The harness stopped it at its 2-hour ceiling, 22:00:52Z, after 1,203 of 3,710 files.** The JSON report is written only when a run ends, so this run left none, and the census reads its log. The box was loaded throughout: load average 6 to 10 on 4 cores, and at least one kernel out-of-memory kill in its first hour ( the machine also ran SEAT-7's `tests/lint` and `vite build` and BSV's runs).
- At 20:06Z I asked to stop the launch and relaunch it detached, which would have avoided the ceiling. The permission system denied the kill, so the run went on as launched. SEAT-7 ruled at 20:52Z: no relaunch; whatever the run did not reach goes to shards.
- **The census shrinks** (the chair 21:27Z; SEAT-7 21:44Z and 21:47Z, reading (ii)). The flipped copy runs ONLY the birth-reaching test files plus `tests/generators`, `tests/data` and `tests/domain/seat` whole: **793 files** at the cut. A birth-reaching file is one whose text names `birthConfig`, `settlementGenerateAction` or `composeInstantWorld`: **505 by text grep, beside the chair's 516.** The run had finished 176 of the 793, which leaves 617 for the flipped shards (two). The control is the SAME 793 files unflipped on the lane checkout `wt-flip`, replacing both the brief's per-file controls and item 73's whole `test:ratchet`. Everything outside the set is the chair's flipped whole run on the joined tree at the close.
- The run log's count lines (one line a finished file, never the whole log): `census-run-counts.txt`.

## THE PARTIAL CENSUS (the run alone, 1,203 files)

| | count |
|---|---|
| files finished | 1,203 of 3,710 |
| tests | 25,279 |
| failed | 33, in 20 files |
| skipped | 48 |
| **(1) pins of the dark default** | **10**: all ten of TO-LIGHT §2; neither conditional reds |
| (2), (3), (4): not yet sorted | 23, in 17 files |

### (1) PINS OF THE DARK DEFAULT: the ten known, all red

| file | test |
|---|---|
| `tests/domain/seatLawWiring.test.js` | the vocabulary: one key, two versions, the dial at the default |
| same | 1. CREATE (dark): birthConfig carries no _seatLawVersion, and birthConfig(null) is byte-equal to its pinned value |
| same | 2. CREATE (THE CLAMP): an incoming _seatLawVersion: 2 is clamped away — an imported marker never decides a birth |
| `tests/domain/livingContentLawWiring.test.js` | ⭐ CREATE (LIT, the product path): birthConfig writes the law marker and NOTHING else |
| same | CREATE (dark, fired deliberately): at the dormant dial birthConfig still writes not one byte |
| same | ⭐⭐ CREATE (THE SAME-SEED CONTROL, LIT): a birth through the boundary is the same world but the law it declares |
| same | ⛔ CREATE (THE CLAMP): a LIT marker arriving through the wizard form cannot birth a v2 world |
| `tests/domain/seat/seatContest.test.js` | the dial is dark and every factor of the registered table reads 1 |
| same | under the law, dark: the kind read is today's (a hidden power still contends, an economy craft guild reads merchant) |
| same | dark: today's read (a craft archetype has no row, so the plot reads palace_coup), with and without the law |

The two conditional tests (`seatLawWiring` "4. GENERATION_LAWS.seat is a WIRED row that says the dial is dark", `seatContest` "the proposed figures are written beside the table…") are **green**, as TO-LIGHT §2 foresaw: the flip rewrites no `why` text and signs no register row.

### Not yet sorted: 23 reds in 17 files (each goes to (2), (3) or (4) by the unflipped control)

| file | test(s) | SEAT-5 item 24 (known on the line) |
|---|---|---|
| `tests/property/generatorGoldenMaster.test.js` | every config produces byte-identical output to the golden master | yes |
| `tests/generators/generationForkCensus.test.js` | A1 — the instrument reaches the generator graph: mints split 4 direct / 106 via fork, no golden moves, 493 draws unpinned and 0 pinned | yes |
| `tests/generators/pipelinePinnedChoosers.test.js` | A1 — the null change: an unpinned run and pins {} leave the golden corpus byte-identical | yes |
| `tests/generators/rosterFinalUnderHeldRoster.test.js` | A1 — inert with no pins: the golden corpus and the coherence tail are byte-unmoved | yes |
| `tests/generators/powerEconomyFreshness.test.js` | A4 — the golden is unmoved by construction, and a held bag does move it | yes |
| `tests/domain/worldFactRederive.test.js` | A7 — THE GOLDENS CANNOT SEE ANY OF IT: both fixtures are byte-identical and a no-layer re-derivation is still the committed golden | yes |
| `tests/property/espionageDormancyFence.test.js` | THE DRIVEN GOLDEN: 360 settlements at this tip hash to the PRE-COUPLING corpus | yes (FENCE 1) |
| `tests/property/dmLayerGoldenIsolation.test.js` | A7 — THE ISOLATION PROPERTY: a dormant layer is the committed golden on EVERY corpus row | yes |
| `tests/build/engineBundleReplay.test.js` | every golden-corpus config: the committed bundle's settlement JSON equals the in-process pipeline · the espionage fence's 360-settlement driven corpus: bundle equals in-process byte for byte · the engine-generate birth: for the three service cases, the bundle's stamped birth equals the in-process birth under the STORE's runtime | the server bundle's parity |
| `tests/generators/pipelinePinnedMode.test.js` | A1 — the null change: no pins and pins {} leave the golden corpus byte-identical · A2 — the lift moves nothing: the golden corpus, the draw count and the one-stream shape · A5 — EM-R1b: a supplied transient chooser is still handed back, and the unpinned path is inert | |
| `tests/generators/x46NpcBand.test.js` | sixty seeds (ten a tier) generate byte-identically to the dark digests captured at the window tip (2026-11-04) | |
| `tests/generators/institutionBudgetPromise.test.js` | every one of sixty seeds is byte-identical with the density factor forced to 1.0 | |
| `tests/generators/nameHeldThroughAssembly.test.js` | A1 — EM-R4: inert with no pins: the golden corpus and an empty bag leave every byte where it was | |
| `tests/domain/editWorldFactResources.test.js` | A2 — THE NO-EDIT PATH IS UNMOVED: a dormant re-derivation is byte-identical to the PRE-CHANGE step's own output · A6 — THE MARK IS NOT THE ECHO: the step's own resolved write-back, handed back in as a generation input, resolves exactly as before | |
| `tests/lint/factLayers.walker.test.js` | every leaf declares exactly the strata it touches, and every stored field it reads is placed · LEAVES: the tree reads exactly the register | |
| `tests/edgeFunctions/aiOutputSchemaBundle.freshness.test.js` | the current source tree matches the recorded hash (regenerate via npm run build:edge-shared) | |
| `tests/property/dossierProseManifest.test.js` | ⭐ THE DRIFT ARM: no row added, no row removed, no row moved | |

(Titles as the log prints them, without the describe path.)

## THE SHARDS (the 793-file census set; each through the mutex, shared tier, `--maxWorkers=2`, its own task and log)

| shard | tree | files | tests | failed | skipped | wall |
|---|---|---|---|---|---|---|
| flip-p1-1-of-2 | flipped | 309 | 1,540 | 4 (3 files) | 4 | 18 min (22:01:43Z →) |

Reds of flip-p1-1-of-2 (unsorted until the control):
- `tests/generators/bar3People2Rows.test.js`: "r2s-famine-village-3: not "decisions taken by Military/Guard…"; what prints instead" (its liveness anchor 'decisions taken by The Guard' is gone from the born record) and "KEEP r2r-village-24: "decisions taken by Elder Council…" still prints".
- `tests/domain/tonightOwnGoal.test.js`: "the three lines the reader read are gone, and the cards' own goals print in their place" (a born card's goal line reads undefined).
- `tests/generators/people/seatKeeperContender.test.js`: "the contender keeps its people: the keeper of rvf-succession_void-town-4 stays a member of Landed Gentry and heads it no longer; a lord leads it" (the keeper heads a contender: expected 1 not to be 1).

Per-file count lines of the shards: `census-shard-counts.txt`.

## The one command

`sh docs/chair/2026-11-20/content/seat/flip/census.sh all <cut> <flipped dir> <unflipped dir> <out dir> [<N>]`. Its steps can also be run one at a time: `run`, `sets`, `shard`, `control`, `lists`.
