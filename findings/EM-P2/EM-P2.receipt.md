# EM-P2 §12 COMPLETION RECEIPT — filled BY EXECUTION (Opus build lane, 2026-09-20)

✅ **STATUS: LANDED — commit `ec0a30da290bc1e65dcf118425637eb5142fe36c`**, one commit on
`fixes-2026-09-18-consist`, parent `141a1d7752e8d9199c0bf347ea99808121733b0b`, by explicit
pathspec of exactly §7's five paths. `5 files changed, 1612 insertions(+)`, zero deletions.
`git show --pretty=format: --name-status HEAD` prints `M scripts/mutation-coverage-manifest.json`
and `A` for the four CREATEs and nothing else; `git status --short` is empty; `git diff HEAD`
is empty, so the pre-commit hook rewrote nothing and the commit holds the exact bytes every
gate above was run against.

**THE STOP WAS RULED, NOT IMPROVISED AROUND** (chair, ODQ §934.47 addendum 78): OPTION 1 —
the two `proseWiringCensus.walker` arms are a NAMED INTERIOR RED of this packet, like the
lighting census, and the chair regenerates `docs/content/wiring-census.json` as a docs act
immediately after this landing, beside the refreeze (the 2026-09-18 re-take precedent,
§934.9). The lane ran no generator, touched no path outside §7 and did not amend the sealed
manifest. Option 3 is taken for the family: the third preamble amendment adds the GENERATED-row
rule. J-1, J-2 and J-3 are ACCEPTED. The original STOP, with its measurements, stands in
`EM-P2.STOP.md` as the record of what was found.

Slot `$SP/slot-2`, branch `fixes-2026-09-18-consist`, HEAD `141a1d7752e8d9199c0bf347ea99808121733b0b`.

---

## 1. The base, the seal and the preflight — CONFIRMED

| # | check | result |
|---|---|---|
| seal | `npm run implementation:dispatch -- EM-P2` | **exit 0**, sealDigest `2bb76f98a0b814d8b0dcde7a04b28f8541f41012cd54cb1698b4312e681a4824` |
| PF1 | `git rev-parse HEAD` | `141a1d7752e8d9199c0bf347ea99808121733b0b`; `merge-base --is-ancestor e5f53ae95 HEAD` → YES |
| PF2 | `git status --short` | empty at handover |
| PF3 | `shasum -a 256 docs/implementation/preambles/EM-PREAMBLE.md` | `16dfb96fa79320abc7dcfbdd8f5152b6aa66998c269287a951079df6c8223195` = the header's stamp |
| PF4 | `ls src/domain/generation` | **exit 1** (the directory did not exist) |
| PF5 | `git grep -n generationForkRegistry -- src tests scripts supabase` | printed nothing |
| PF6 | `sed -n '84p' src/kernel/prng.js` | ``    fork: (label) => createPRNG(`${seed}::${label}`),`` |
| PF7 | `getStepMeta()` | `steps=22 providesKeys=57 mutatesKeys=18 pairs=75` (51 distinct provided keys) |

## 2. A1 — the instrument's control, VERBATIM (the arm that says the mock reached the graph)

Run FIRST AND ALONE with zero literal typed, per §8 step 3:

```
 Test Files  1 passed (1)
      Tests  1 passed (1)
[A1] mints total=35 direct=4 viaFork=31 foreign=0 pickVariant=96 fnv1a32External=6
[A1] direct seeds = golden-master-v3 | golden-master-v3::generatePower::power-structure
                  | golden-master-v3::generatePower::power-structure | golden-master-v3::generatePower::power-structure
```

| control | required | measured |
|---|---|---|
| export parity, `prng.js` and `proseHash.js` | EQUAL | EQUAL (asserted against the factories' own `Object.keys(actual)`) |
| golden manifest row `town\|germanic\|plains\|road\|civilized\|golden-master-v3` | `b77b5909…c3ce` | identical, and the row REGENERATED to it under both mocks |
| stride sweep | ≥ 25 rows, 0 moved | 25 checked, **0 moved** |
| `generatePopulation` unpinned | draws 315, random 315, other 0, inner forks 0 | **315 / 315 / 0 / 0** |
| `generatePopulation` fully pinned | draws 0, record reproduced | **0**, reproduced |
| total mints | 35–36 | **35** |
| DIRECT mints | exactly 4 | **4** |
| via fork | ≥ 31, and `= 22 step forks + 9 sub-forks` | **31 = 22 + 9** |
| repeated-seed vias | `[fork\|direct\|direct\|direct]` | identical, ×4 on `golden-master-v3::generatePower::power-structure` |
| foreign-prefix seeds | 0 | **0** |
| `prng.js:84` fork law | present | present |

**STOP-5 and STOP-6 did not fire.** No shared vitest configuration was touched.

## 3. The final row counts — CONFIRMED by a fresh execution inside vitest

```
[A3e] corpus=63 pairs=75 wall=39101ms drawingSteps=13
[A4] varies=6 disagreeing=18 nonUnanimousPaths=1 differingLandingPaths=0
[A5] total=35 direct=4 viaFork=31 stepForks=22 subForks=9
[A6] pickVariant=96 realChoices=96 distinctSeeds=96 fnv1a32External=6
```

- **75 rows** · **28 drawn · 1 label · 46 pure** (the single label is `generatePower|powerIntent`)
- `onRecordClass` **19 absent · 35 same · 15 transformed · 6 varies**
- `producedOnRecordClass` **27 absent · 18 same · 15 transformed · 15 varies**
- **10 Tier-2 rows**, 5 `drawn` / 5 `computed`
- 19 rows carry `recordPath: null`, 0 carry `''`, 31 distinct non-null paths

**The six `varies` rows of the FINAL comparand, measured, diffed against §6.2a: IDENTICAL, 6 of 6.**

```
resolveResources|nearbyResourcesDepleted        absent=0 same=23 transformed=40  record.config.nearbyResourcesDepleted
resolveResources|nearbyResourcesNativeDepleted  absent=0 same=23 transformed=40  record.config.nearbyResourcesNativeDepleted ⚠ non-unanimous (x40 / nearbyResourcesDepleted x23)
resolveStress|stressTypes                       absent=0 same=51 transformed=12  record.config.stressTypes
stressConfirmPass|stressTypes                   absent=0 same=51 transformed=12  record.config.stressTypes
assembleInstitutions|generationRepairs          absent=43 same=20 transformed=0  record.generationCoherenceReceipt.repairs
coherenceRepairPass|generationRepairs           absent=43 same=20 transformed=0  record.generationCoherenceReceipt.repairs
```

**The 18 rows where the two comparands disagree, diffed against §6.2b: IDENTICAL, 18 of 18** —
the seven `effectiveConfig` rows (`same` / `absent`), `assembleInstitutions|generationRepairs`
(`varies` / `absent`), and the ten `stress` / `institutions` / `isolationSupport` /
`economicState` rows (`same` / `varies`).

**The re-measured count of differing landing paths is 0** (`differingLandingPaths=0`), so no
`producedPath` is owed. **Exactly one** row's non-absent `recordPath` is non-unanimous and it is
already `'varies'` (STOP-11 did not fire).

**No row disagreed with the literal.** A3e and A4 both ran clean, so the mismatch arm never
printed. The literal was measured before it was typed, by the packet's own helper under plain
node, and the field-by-field comparison inside vitest agreed on all 75 rows × 12 fields.

⭐ **The literal is byte-identical to the pre-proof's at `ad7ddf2c9`: ZERO ROWS MOVED.** The
75-row block emitted at this base hashes `39bf2c92f7f9d1dd2a7d667577e9e8baae4cea13a18a20614272b10becb9e3de`,
equal to the block in the kit's `generationForkRegistry.SPEC.js`; a row-for-row diff reports
**0 of 75 differ**. The header's "expectation zero rows moved" is now a receipt.

## 4. Tier 2 — executed

```
[A8e] occupancy = institutions[].name:42/42 , institutions[].category:42/42 , npcs[].name:42/42 ,
      npcs[].role:42/42 , npcs[].status:18/42 , powerStructure.factions[].faction:42/42 ,
      …category:42/42 , …power:42/42 , powerStructure.governingName:42/42 , …isGoverning:42/42
[A8e] movedUnderHolder = institutions[].name:42/42 , institutions[].category:41/42 , npcs[].name:42/42 ,
      npcs[].role:42/42 , npcs[].status:12/42 , every generatePower row:0/42
[A8e] absent probes = institutions[].state:0/42 , powerStructure.seats[].holder:0/42
```

Every figure equals VF-10/VF-11. `powerStructure.seats[].holder` is excluded through
`expectAbsentWithAnchor`, anchored on `powerStructure.governingName`. The resolver finds
**22/22** steps declared exactly once and the model's form set **0/22**; `pickFirst` = 1,
`generatePowerStructure` = 1, two nonexistent symbols = 0, and the three planted ghosts
(comment, string, template) are not counted while `actuallyHere` and `alsoHere` are.

## 5. Goldens — UNMOVED

```
before  7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e  generator-golden-master.json
        921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41  dossier-prose-manifest-golden.json
after   (identical, both)
```

Golden posture proof: `Test Files 2 passed (2)` · `Tests 18 passed (18)`. No `UPDATE_*` door was
opened. **STOP-3 did not fire.**

## 6. The lighting census — RECORDED, NOT REFROZEN

Run ONCE, separately:

```
AssertionError: the estate's file count moved — re-measure, do not re-word: expected 2655 to be 2653
 Test Files  1 failed (1)
      Tests  1 failed | 33 passed (34)
```

**`files` 2653 → 2655 = +2, exactly §7.2's declared DELTA.** The walker asserts `files` FIRST and
**short-circuits**, so `parked` / `credited` / `titles` / `suiteTitles` were **NOT evaluated** and
are UNREACHED, not measured. Derived from the CREATE rows per §11's table, with the crediting
proof stated as §12 requires:

```
tests/lint/generationForkRegistry.contract.test.js  describe=1  it=3   import { describe, expect, it } from 'vitest';
tests/generators/generationForkCensus.test.js       describe=1  it=7   import { describe, expect, it, vi } from 'vitest';
tests/helpers/generationForkCensus.js               describe=0  it=0   (no vitest import; not a .test.js)
```

⇒ `titles +10`, `suiteTitles +2`, `credited +2`, `parked +0` — **PLAUSIBLE** (derived), against
`files +2` **CONFIRMED** (executed). Both openers are bound by each file's own `'vitest'` import
and both suites are straight-line literal blocks, so neither file parks. **Nothing was refrozen.**

## 7. Mutation coverage — BOTH rows added

`scripts/mutation-coverage-manifest.json`: **709 → 711 `invariants` rows (+2)**, appended
surgically (`git diff --numstat` = `10 0`), the manifest never re-serialised whole.

- `tests/lint/generationForkRegistry.contract.test.js` — `kind: "rationale"`, own rationale + `kindNote`
- `tests/generators/generationForkCensus.test.js` — `kind: "rationale"`, own rationale + `kindNote`

Anchor neighbours, in file order: `tests/lint/guidanceOrigin.walker.test.js` → **the two new rows**
→ `tests/domain/bespokeStyleWallContract.test.js`. `uncoveredBaseline` untouched at 186; neither
row is `kind: uncovered`.

⚠ **§7.2's "705 → 707" IS A STALE ABSOLUTE.** The register stood at **709** rows at this base
(EM-B1k, EM-B1k2, EM-B3c and the CURE-* landings inserted rows after the pre-proof measured it).
The DELTA `+2` is what §7.2 binds and what was executed; the absolute is the chair's to stamp
(`EM-PREAMBLE.md` §P2 row 1).

## 8. The gates, in the order they ran

| gate | count line | exit |
|---|---|---|
| A1 alone | `Tests 1 passed (1)` | 0 |
| `npx eslint` (4 files) | — | 0 |
| `npm run typecheck:domain:strict` | `✓ no strict-type regressions (1113 errors, ceiling 1113)` | 0 |
| `tests/lint/generationForkRegistry.contract.test.js` | `Tests 3 passed (3)` | 0 |
| `tests/generators/generationForkCensus.test.js` | `Tests 7 passed (7)` | 0 |
| golden posture, `tests/property` | `Tests 18 passed (18)` | 0 |
| `tests/copy/voiceMechanics.test.js` | `Tests 30 passed (30)` | 0 |
| anchor + mutation-manifest + contract-anti-vacuity | `Tests 34 passed (34)` | 0 |
| lighting walker, alone | `Tests 1 failed \| 33 passed (34)` | 1 (the declared interior red) |
| `tests/generators` WHOLE | `Test Files 113 passed (113)` · `Tests 1042 passed (1042)` | 0 |
| `tests/lint` WHOLE | `Test Files 2 failed \| 171 passed (173)` · `Tests 3 failed \| 2776 passed (2779)` | 1 |
| `npm run check:packet -- EM-P2` | 8 steps, **every one exit 0** | 0 |
| `npm run implementation:resume -- EM-P2` | 8 steps, **every one exit 0** | 0 |

The three failing tests in `tests/lint` WHOLE are the lighting census (lawful, above) and the
two prose-wiring arms (the STOP). Every vitest line ran through
`GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run --
npx vitest run --pool=threads --maxWorkers=2 <paths spelled inline>`, one test directory per
invocation, and every one printed a count.

## 9. The change manifest, as it stands uncommitted

```
 M scripts/mutation-coverage-manifest.json
?? src/domain/generation/                             (generationForkRegistry.js)
?? tests/generators/generationForkCensus.test.js
?? tests/helpers/generationForkCensus.js
?? tests/lint/generationForkRegistry.contract.test.js
```

Exactly §7's five paths and nothing else.

```
f2c096ec7f5bddb8fece126c264d2679633ad57d1b9ea805fdf8b134d99674fc  src/domain/generation/generationForkRegistry.js
dd958a09586cd62296917cc26d2ce4e25fdced049962466587c6192177929e7c  tests/lint/generationForkRegistry.contract.test.js
854e0e0f56c6314403b6220ac75784de4942d74577b354bc2a4857de6df85439  tests/generators/generationForkCensus.test.js
927b0e9bdd597cf121fe13a81660dc04cf3d39a27bc9576cf9727b2e1d2d81ac  tests/helpers/generationForkCensus.js
```

**Budgets:** the leaf measures **107 effective lines** (eslint `max-lines`, `skipBlankLines` +
`skipComments`), against the packet's stated 106, the per-leaf ceiling of 250 and the domain
layer ceiling of 800. Longest line 455 chars; `eslint.config.js` declares no `max-len`.
`scripts/.size-baseline.json` gains no entry. One leaf; the pre-approved two-leaf split stays
untaken. No production importer: `git grep generationForkRegistry -- src` still finds only the
leaf itself, so no bundle closure, worker, first-paint set or edge-shared meta moves and
`npm run build` / `build:edge-shared` are not owed.

## 10. STOP conditions checked and NOT fired

STOP-1 (no byte of `src/generators/**` or `src/kernel/**` touched) · STOP-2 (`pairs=75`) ·
STOP-3 (goldens and the prose manifest identical) · STOP-4 (`prng.js:84` verbatim) ·
STOP-5 (A1 green, 35 mints) · STOP-6 (4 direct / 31 via fork) · STOP-7 (every `pure` verdict
carries `rows`, and A7 asserts `> 0` never a ratio) · STOP-8 (every `outputKey` resolves;
no `editable`) · STOP-9 (no production importer, no `forkKey`, no `producer`, no idiom scan,
no copy of the model's resolver — the model's FORM SET appears once as a labelled negative
control, pinned to its source file) · STOP-10 (the mismatch arm prints and fails; it writes
nothing) · STOP-11 (the one non-unanimous path row is `varies`) · STOP-12 (no prose-numerics
hit; `enumerateInvariants` names both new files and the manifest carries both) ·
STOP-13 (neither file parks).

**The one that DID fire** is the brief's, not §11's: *an edit needed outside §7*. See
`EM-P2.STOP.md`.

---

## 11. JUDGMENT CALLS — three, all recorded for veto

The packet says NONE unless one is met. Three were met, each forced by a measured estate
walker that §7.2 did not price. All three are edits INSIDE §7; none changes a contract's
meaning, and each is named here so the chair can reverse it.

**J-1 · `GENERATION_CHANNELS.displayNameKeyed` moved from the leaf to the census file.**
The lane first carried the three display-name-keyed sites in the register, as §2 and A6 name
them. Measured: spelling those paths under `src/` convicts the leaf under **two** standing
walkers at once — `tests/lint/entropyRootCensus.walker.test.js` counts a quoted
`createPRNG(` as a site (`35 → 36` in `src/domain`), and
`tests/lint/settlementMapSurfaceAllowlist.walker.test.js` refuses the `townMap` vocabulary
anywhere under `src/` (ODQ §725). Neither walker scans `tests/`. The three sites now live in
`DISPLAY_NAME_KEYED_SITES` in the census file, where A6 asserts each recorded line still
carries its marker; `GENERATION_CHANNELS` is back to §6.1's exact two-key shape (`mints`,
`hash`). **Nothing is lost:** the sites are still named, still observed data, still EM-P1b's
class, and the arm that reads them is the arm that observes them.

**J-2 · `GENERATION_CENSUS_ROWS` is DERIVED, not written as `63`.**
`tests/lint/tuningRegister.walker.test.js` counts `export const SCREAMING_NAME = <number>;`
as an unregistered tuning dial: the leaf measured `0 -> 1` and
`UNREGISTERED_NAMED_CEILING: 535 -> 536` on a ceiling that only falls. The two cures were
(i) register a MEASURED DENOMINATOR in the owner-signed tuning register — which misfiles it,
and touches a path outside §7 — or (ii) stop spelling the number twice. The lane took (ii):
```js
export const GENERATION_CENSUS_ROWS = GENERATION_TIER1[0].rows;   // declared after Tier 1
```
The export, its value (63), its type and every assertion over it survive, and the absolute is
now pinned by EXECUTION rather than by a literal: A3s asserts `row.rows === GENERATION_CENSUS_ROWS`
on all 75 rows (so the rows' unanimity is proved, not assumed) and A3e asserts
`censusCorpus().length === GENERATION_CENSUS_ROWS` **and** `=== 63` against the live corpus
builder. §6.1's block is a signature sketch — it writes `export const GENERATION_TIER1;` with no
initializer at all — so the lane read `= 63` as the value, not the source form. ⚠ **This is the
call most worth a chair's eye**, because it is the one place the lane departed from a literal
spelling in §6.1.

**J-3 · A7's seed loop collects instead of asserting inline.**
`tests/lint/seedLoopTotality.walker.test.js` convicted one bare seed loop at the off-corpus
arm: an `expect` inside a 24-seed loop stops at the first failing seed, so its failure count is
a floor and the later seeds go unrun. The inline assertion was replaced by a collected
`neverRan` list judged once after the loop, which is the walker's own prescribed idiom and is
strictly more truthful than what the lane first wrote.

All three were verified by re-running the five convicting walkers: `Test Files 5 passed (5)`
before the packet's files existed, and four of the five green after the cures — the fifth is
the STOP.

---

## 12. NOTICED AND NOT TOUCHED — for the chair to slot

1. ⛔ **`EM-PREAMBLE.md` §P2 does not price the prose-wiring census, and every EM member that
   creates a leaf under `src/domain/**` or `src/generators/**` owes it.**
   `scripts/wiring-census.mjs#producerCitations` (:218) stamps `producerIndexFiles` with a walk
   of both trees, so the count moves on ANY new file regardless of content. This is the STOP,
   but the durable half is a preamble row, which re-stamps every EM member and is a chair act.
   **Suggested slot: a §P2 row 13, taken with whichever cure the STOP is ruled to.**
2. ⚠ **§7.2's mutation-coverage absolute `705 → 707` was already stale at placement** (the live
   register held 709 rows). The DELTA held. Worth a line in the charter's stale-absolute
   register beside the lighting one, since three landings moved it inside one night.
3. ⚠ **The prototype's emitted leaf (`kit/tools/em-p2-v3-proto/generationForkRegistry.SPEC.js`)
   froze rows with `.map(Object.freeze)`, which does NOT freeze `onRecord` or
   `producedOnRecord`** — `Object.freeze` is shallow. §6.1 requires both triples frozen and A3s
   asserts it; the SPEC as written would have reddened its own acceptance case. The landed leaf
   uses a named `freezeRow` that freezes both by name. **No action needed here** — recorded so
   a later reader of the SPEC does not copy the shallow idiom.
4. ⚠ **`tests/lint/chooserTotality.walker.test.js` exports nothing**, so its declaration form
   set can only be exercised by re-spelling it. A8s quotes it as a labelled negative control and
   PINS the quote to the walker's source text so the control cannot drift. If TOOL-4 (shared
   helper hygiene) ever extracts that form set to a plain helper, this pin should be replaced by
   an import. **Suggested slot: TOOL-4's roster.**
5. ⚠ **`instrumentedRoot` and `runHeadless` now exist twice**, as this packet's exported helper
   and as module-local copies in `tests/generators/pipelinePinnedMode.test.js` (:107, :79). The
   duplication is DELIBERATE and documented in the helper's header (exporting the originals
   would be a MODIFY of a file EM-P0 landed). **Already slotted to TOOL-4** by §8 step 2; this
   receipt confirms the second copy now exists and is the trigger.
6. ⚠ **`GENERATION_BLIND_HALVES`'s `hash-channel` row names the `pairProse` FNV pick at
   `src/generators/generateSettlementPipeline.js:216` as unattributed.** The lane did not
   measure it (it is outside every §7 path and outside A6's contract). If the EM-R family wants
   the hash channel closed rather than declared, that measurement is its own small task.
7. ⚠ **`npcs[].status` occupies 18 of 42 corpus rows and moves in 12 of them.** Tier 2 row 5's
   arm floor is `> 0` for exactly this reason (EM-A1 §1c.2's structural-seat family). EM-A1
   should not read 42/42 into any Tier-2 row: only nine of the ten are total.
9. ⚠ **THE ZSH NON-SPLITTING HAZARD BIT A THIRD TIME, AND IN A NEW SHAPE.** The brief records
   it for mutex lines (instance 1) and for git pathspecs (instance 2). It bit this lane inside a
   HAND-ROLLED VERIFICATION LOOP: `for pair in "<path> <sha>" …; set -- $pair` left `$pair` one
   word, so `$1` carried both fields, `shasum` errored on a nonexistent path, `now` and `$2` were
   both empty, and `[ "$now" = "$2" ]` printed **UNCHANGED for all four files** — a false green in
   the very check that was supposed to prove the pre-commit hook had not rewritten them. Caught
   because the `shasum: No such file or directory` lines were printed beside the verdicts, and
   re-run with every path spelled inline. **Suggested slot: extend the brief's second ZSH WARNING
   to say the hazard is not specific to mutex or git commands — any unquoted expansion a lane
   word-splits is a false-green risk, and a verification loop is the worst place to take one.**

8. ⚠ **A3e's wall clock was 30.2 s focused and 39.1 s inside the whole-directory run**, against
   the packet's budget of ~31 s and a timeout of 180 s. Headroom is ample but the figure now
   varies with directory load by ~30 %, so a future lane sizing a similar arm should budget
   against the loaded number, not the focused one.
