# BAR4-SCENES-2 · hand-back (2026-11-16)

Successor of BAR4-SCENES on `lane/bar4-scenes-2026-11-16`. I started at 187c46f61b. The second tree of the books is a71788851f; the chair's whole check at 08:28 found that base green whole.

Phase 1 (the books my predecessor did not run) is DONE. Phase 2 (the `house at work` remainder) waits on the chair's word and a named tip.

## THE KINDS

| kind | detector | 720 before → after | fresh 300 before → after | named exclusions | guard · positive control |
|---|---|---|---|---|---|
| A1 · the scene's presumption | `tests/helpers/scenePresumption.js :: scenePresumptionFindings` (unchanged) | 47 → 13, all `house at work`, frozen (Phase 2) | arrival 14 → 11 (`house at work`) | none | `tests/generators/bar4ScenePresumption.test.js`: green at the tip; its positive control fires |

Phase 1 moved no page line, so the counts are unchanged.

## Phase 1 · the books, at 187c46f61b against a71788851f

Two trees side by side, with one `npm ci` (`package-lock.json` is identical in both). Each file ran ALONE through `sh scripts/gate-tail.sh`, to its own file. The net was:
- 61 files that pin a symbol, pool or line the commit changed. They came from `grep -rlE` of `ARRIVAL_SENSES`, `arrivalProse`, `FACT_DIMENSIONS`, `general.generated`, `DS-GEN-13`, `facts/factLayers`, `timber at hand`, `'enchanting'` and `scenePresumption`, plus `textOf.test.js`.
- The seventeen law suites, the three BRIEF-BAR3 adds, and the ten files of BRIEF-BAR4's amendment 2.

That is 83 files in all. 69 are GREEN at the tip. 14 are RED at the tip and every one is GREEN alone at a71788851f, so all 14 are the branch's. Each is classed below.

### Cured in my commit (two re-keys of anchors the declared cure moved, by identity, each with a dated note)

- `tests/domain/bar3CorpusGuards.test.js` · DECLARED rows "DS-GEN-13 :: COMMERCE: a market, no guild" v1 and v2. Their `instead` sibling was v3, which now declares `no crisis: under_siege`. The sibling admitted in their place is now the siege twin v6.
  - v1's row moves from r2s-under_siege-hamlet-0 to r2s-under_siege-village-0, a town of the case. The hamlet holds no market, so `commercePoolKey` never draws this pool there.
  - Measured: of the census's 24 siege towns, the pool is drawn in two (hamlet-3, village-0), and v6 is admitted in both. No siege town is left mute.
  - The cured lines' arms are unchanged.
- `tests/generators/w2FixDataHistoryItems.test.js` · "the four arrival lines declare". The seasoning-planks line's declaration is now `needs: ['timber at hand']`. W2-FIX-DATA-HISTORY's own arm (`excludes: crisis: under_siege`) is unchanged.

Both are green after the re-key. So are the three test-corpus walkers: negativeAssertionAnchor, seedLoopTotality and proseDrawnAnchors.

### The books the cure moves: NAMED, not re-taken

My predecessor named four of these. I confirm all four and add the ones it missed (marked NEW).

| test · arm | old → new | door |
|---|---|---|
| `tests/data/dossierStateProseProjection.contract.test.js` · pins recomputed, and the MUTANT | 2959 → 2960 variants (DS-GEN-13 v6) | the register's own re-record ("THIN-pool growth") |
| NEW `tests/domain/composeStateProse.test.js` · "every block lives in exactly one leaf" | variants 2959 → 2960 | the dated-note count (re-measured at the close) |
| NEW `tests/lint/proseComposed.walker.test.js` · "the shipped state corpus" | 2959 → 2960 | the close |
| NEW `tests/lint/proseWiringCensus.walker.test.js` · R1 corpus count; committed register current; committed file current | 2959 → 2960; `docs/content/wiring-census.json` stale-bytes | amendment 4: the close re-takes the shared annex files once |
| NEW `tests/lint/wiringCensusDeclared.walker.test.js` · "every row carries the four columns" | rows `DS-GEN-13 :: COMMERCE: a market, no guild`, `DS-GEN-17 :: GREAT HOUSE: monastery` | the same (`wiring-census.json`) |
| NEW `tests/lint/proseEntryContradiction.walker.test.js` · the projection's arithmetic; the annex join | 3427 → 3428; 2722 → 2723 | the close |
| `tests/lint/proseCorpusBytes.test.js` · RAW is EXACT | general.generated.js 298675 → 299164 (+489) | a CEILING: not raised |
| `tests/lint/writerReach.walker.test.js` · surfaceReach round-trip | `failedSource` on foodRecord gains a reader (`sceneSupply.js`) | WR1 |
| `tests/lint/presumedThings.walker.test.js` · ARM 1 | fresh hit `house: tavern :: "no institution: tavern"` (the monastery line's own exclusion mark) | PT3/PT4 |
| NEW `tests/lint/observedShapeReaders.walker.test.js` · "a freshly re-minted baseline has NO drift" | an execution INPUT drifted: `src/data/dossierStateProse/general.generated.js` | `node scripts/check-observed-shape-readers.mjs --write` (the shrink-only re-freeze) |
| NEW `tests/property/espionageDormancyFence.test.js` · THE DRIVEN GOLDEN | corpus sha 05b90d5f… → d52fd9e8… | the fence's chartered window (its text calls a moved constant a STOP: for the chair) |
| NEW `tests/build/vendorPdfLazy.test.js` · WEAVE ST-2 the goods roster | `src/domain/facts/sceneSupply.js` imports `resourceSemantics` and has no row | ROSTER ROW OWED (BRIEF-BAR3 amendment 12) in `src/domain/goods.schema.js`, as `R \| E \| none \| member`. My predecessor wrote "none is owed"; that was wrong. |

**The espionage fence's move is ATTRIBUTED, zero residue.**
- 2 of its 360 settlements move: SUBw4-fence1-city-road-014 and SUBw4-fence1-metropolis-crossroads-011.
- In both, `arrivalScene` is the only leaf that moves. The enchanting line's twin prints there ("Nobody in Altkoppel sells enchanting by the hour, …").
- Instrument: `fence.mjs` (scratch). It bears the 360 at both trees and walks the leaves.

### The build and `verify:dist` (once, at the tip; `dist/` removed after)

- `npm run build`: GREEN.
- `npm run verify:dist`: REFUSED. The boot smoke (`tests/build/bootSmoke.test.js`) PASSED in the strict phase. The refusal is on four build files:

| build test · arm | figure | class |
|---|---|---|
| `tests/build/engineBundleReplay.test.js` · bundle equals in-process on the fence's 360 | 2 of 360 differ (the two above); it also ran past its 20 s budget (49.9 s) | the COMMITTED edge bundle (`supabase/functions/_shared/engineBundle.js`) is stale: the cure never re-made it (see below) |
| `tests/build/generationWorkerLazy.test.js` · worker under its ceiling | 2324552 B against 2322103 (+2449) | a CEILING: for the chair's ruling |
| `tests/build/vendorPdfLazy.test.js` · engine chunk | 878555 against `< 878554` | a CEILING: for the chair's ruling |
| `tests/build/vendorPdfLazy.test.js` · first-paint closure | raw 1133226 / 1132308 (+918); gzip 361017 / 360756 (+261); Brotli 303141 / 302830 (+311) | CEILINGS: for the chair's ruling |
| `tests/build/vendorPdfLazy.test.js` · the goods roster | as above | roster row owed |

**The stale engine bundle is proved.**
- I re-made the edge bundles in my scratch tree (`npm run build:edge-shared`) and ran `engineBundleReplay.test.js` alone: GREEN. The bundle matches the pipeline on all 360. The fence-constant arm skips as known-stale.
- I then restored the committed bytes. Every rebuild of the edge bundles in this line's log is a close's door, so the bundle is NAMED: its door is `npm run build:edge-shared` at the close.

**The ceilings are not raised.** The worker's ceiling says "A RISE IS NEVER A LANE'S EDIT: buy the bytes back, or take the ruling". Where the bytes come from:
- the six arrival twins and their `twinOf` texts;
- `sceneSupply.js`;
- three dimensions on `factVocabulary.js` and three homes on `factLayers.js`;
- DS-GEN-13 v6 and two marks.

Buying them back would mean re-forming my predecessor's cure (for example, a `twinOf` that does not repeat the whole text). I leave that to the chair's word.

### The 525 reference configurations

0 of 525 move against a71788851f, and no field family moves.
- a71788851f reproduces the stored manifest on all 525, and so does the tip.
- The changed lines do print in the 525 (seasoning planks 150, penned cattle 96, enchanting 1). In every one of those towns the new declaration still admits the line.
- Instrument: `hash.mjs` and `diff.mjs` (scratch). They bear `goldenCorpus()` with `generateSettlementPipeline` at each tree, hash the JSON, and walk the leaves of any that differ.

## The chair's ruling of 09:02 on the ceilings, and the one unprinted line

The chair ruled at 09:02: the three size ceilings (and the prose byte row) are NAMED for the close's doors (ruling B3). No cure is re-formed to buy bytes back; "only a line that no town of either population prints would come out".

I measured the arrival lines that 187c46f61 adds or declares over both populations at the tip (instrument: `books/twins.mjs`). Each figure is the number of towns whose arrival scene prints the line; the 720 come first, then the fresh 300.

The six twins:

| line | 720 | fresh 300 |
|---|---|---|
| "Timber is scarce in {n}…" | 1 (r2r-village-42) | 0 |
| "A few planks stand seasoning…" | 1 (r2s-recently_betrayed-town-1) | 0 |
| **"The saws of {n} are quiet most days, for want of timber to cut."** | **0** | **0** |
| "The pens … stand half empty…" | 1 | 1 |
| "The few cattle left in the pens of {n}…" | 0 | 1 (bar0-village-famine-rand-123) |
| "Nobody in {n} sells enchanting by the hour…" | 3 | 1 |

The declared lines all still print: sawn timber 6 and 6; stacks of planks 10 and 2; rasp of the saws 7 and 4; drovers 6 and 0; penned cattle 6 and 3; enchanting signs 10 and 5. The general desk's v6 is the only admitted line of the drawn pool in r2s-under_siege-hamlet-3 and r2s-under_siege-village-0, so it prints.

SO ONE LINE OF MINE IS SUCH A LINE: the saws' twin prints in neither population. I have NOT taken it out, for two reasons:
- It is the twin of "The rasp of the saws…" (`needs: timber at hand`), and the state it covers (that slot drawn where no timber is at hand) is reachable even though neither sample reaches it.
- Without the twin, that state is refused rather than twinned, which BRIEF-BAR2's law on mute states forbids.

This is for the chair's word.

## Registrations owed

- Manifest entry owed (my predecessor's): `tests/generators/bar4ScenePresumption.test.js`.
- ROSTER ROW OWED: `src/domain/facts/sceneSupply.js` (it imports `resourceSemantics` and `canonicalAccessors`) in `src/domain/goods.schema.js`, as `R | E | none | member`.

## The veto list

No line is new or changed in Phase 1. My predecessor's list stands.

## What is left, in order

1. **The ceilings: RULED (09:02, B3).** Named for the close's doors. The one line no town of either population prints (the saws' twin) waits on the chair's word.
2. **On the chair's word: Phase 2, the `house at work` remainder** (13 of the 720, 11 of the fresh 300). The steps:
   - Merge `lane/bar4-record-2026-11-16` at the tip the chair names. This is ONE merge commit, and a conflict is a STOP.
   - The scene's `house at work` reads `src/domain/facts/houseInputAtHand.js`, and the `timber at hand` atom calls it too.
   - The guard's frozen list shrinks to empty, and its positive control must still fire.
   - Re-run alone the files that pin what changed, then the build with `verify:dist`.
3. **For the close's doors:** every row of the books table above, the edge bundles, and the roster row.

## Instruments (scratch, outside every tree)

- `books/run.sh <tree> <list> <out>`: each file alone through `scripts/gate-tail.sh`, one log a file, and `results.tsv`.
- `books/ref/hash.mjs <tree> <out>`: the 525 hashed, with records kept gzipped. `books/ref/diff.mjs <dir> <manifest>`: base against manifest, tip against base, by family.
- `books/ref/fence.mjs <tip> <base>`: the fence's 360, leaf-walked.
- `books/adm3.mjs <tree>`: DS-GEN-13's market-no-guild pool, drawn and admitted, over the 24 census siege towns.
