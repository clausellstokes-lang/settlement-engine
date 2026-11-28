# BAR4-SCENES-2 · hand-back (2026-11-16)

Successor of BAR4-SCENES on `lane/bar4-scenes-2026-11-16`. I started at 187c46f61b. The second tree of the books is a71788851f; the chair's whole check at 08:28 found that base green whole.

Phase 1 (the books my predecessor did not run) is DONE (1abaca806, f14a74f85, f0d4818d9). PHASE 2 (the chair's word of 12:16 UTC, changed from my prompt: the JOINED LINE merged, not one branch; ruling HW1 of 12:26 UTC) is DONE: one merge commit of `lane/join-2026-11-14` at f19c3b28b, then the cure. Handed back at about 560,000 of my 600,000.

## THE KINDS

| kind | detector | 720 before → after | fresh 300 before → after | named exclusions | guard · positive control |
|---|---|---|---|---|---|
| A1 · the scene's presumption | `tests/helpers/scenePresumption.js :: scenePresumptionFindings` (its timber presumption now reads the one home) | at f19c3b28b, the arrival scene: 20 in 20 towns (`house at work` 16) → **0** | 14 in 14 (`house at work` 11) → **0** | none (`EXCLUDED` empty; the horses' "smell of horses and hay" is declared `colour`: true under a siege, horses are stabled) | `tests/generators/bar4ScenePresumption.test.js` (8 arms): the zero over the 720; the frozen remainder EMPTY; two positive controls (the five presumptions, and `house at work` on r2r-village-34's potter); the copies pinned to their tables; two REACHABLE arms (MU1) |

## Phase 2 · the merge, the namesake, HW1, and the chair's steps 2 to 4

### The merge (ONE merge commit; the only merge)

`lane/join-2026-11-14` at f19c3b28b. Four conflicts, all of the kinds the chair allowed:
- `factLayers.js`, `factVocabulary.js`, `factsOf.js`: additions at one place of the shared vocabulary, both kept.
- `general.generated.js`: only the header's variant count conflicted (738 mine, 743 theirs). The generator refuses on the joined line itself: BAR4-HISTORY's 155c7e1af moved `generalStateProse.js` without re-taking the wiring census. So I took the header the generator writes (744), and PROVED it: in a throwaway copy, with the census re-taken, `npm run gen:dossier-prose` writes a `general.generated.js` byte-identical to the merged leaf, and every other generated file unchanged. The census itself is not re-taken (amendment 4: NAMED for the close).

### The namesake (the chair's word of 12:16): ONE home, two atoms

Both seats named an atom `timber at hand`. ONE reading now, BAR4-RECORD's `houseInputAtHand.js`, in `src/domain/facts/timberAtHand.js` (rewritten; `timberInputOf` asks the two timber chains):
- `timber at hand` = the input's kind is `local` (BAR4-HOUSES' "timber to hand" line; its declaration unchanged);
- `timber reaches the saws` (NEW, beside it) = local OR imported (my sawn-timber, planks and saws lines). A second atom rather than one keyed atom: a keyed one would have changed BAR4-HOUSES' data file. VETOABLE.
- `sceneSupply.js` keeps `failed: <source>` and `enchanting` and imports nothing now (the goods roster row I named in Phase 1 is NO LONGER OWED).
- Both guards read zero: BAR4-HOUSES' positive control's true state re-keyed by identity (a live timber ground, not a working chain).

### HW1 (the chair's ruling of 12:26, vetoable): ONE FACT FOR "this house is short"

- (b) **The spent-ground reading moved**, VERBATIM, out of `src/domain/display/crisisStoppedRow.js` into `src/domain/facts/houseInputAtHand.js :: housesOnSpentGround`; the display leaf calls the fact (facts import no display).
  - **The one fact**: `houseInputAtHand.js :: housesShortOf(record)` = a house whose gapped inputs this reading calls `missing` (`CHAIN_RAW_INPUT`, the chain table's raw names copied and pinned) ∪ `housesOnSpentGround`. It AGREES with the page's `housesShortOfInput` in all 1,020 towns (720 + fresh 300).
  - **THE MARKS DO NOT MOVE**: every house and service row's mark (`rowMarkText`) over the 1,020 towns, 91,338 rows, is BYTE-IDENTICAL at f19c3b28b and at the tip.
  - **The quarries' one reading**: a house on a ground wholly spent is not its own producer, and a house that works the ground itself (`SPENT_GROUND_WORKERS`) is fed by no import (SV6's own rule). THE FACT SIDE MOVED: 70 house readings in 49 towns of the 720 and 21 of the fresh 300 now read `missing` (61 stone quarries, 4 "Access to external mill", 3 salt works, 2 mills), each where the page already marked it short. An earlier, wider form moved a Smelter's mark in r2s-monster_pressure-metropolis-2; it was narrowed until no mark moved.
- (a) **`trade at work: <trade>`** (NEW keyed atom, beside `iron at hand`; `src/domain/facts/tradeAtWork.js`, layer 4: it reads the resource analysis): some house of the arrival sense's trade (the picker's own house words, `TRADE_HOUSES`, pinned to `ARRIVAL_SENSES`) is not short. Declared on every fish, kilns, stone and arcane sense line. VETOABLE.
- (c) **The crisis marks**: the stone lines exclude the siege; the horses' traffic lines exclude the siege (the "smell of horses and hay" declared colour); the mill wheel excludes the hunger.
- **A DRAW IS NOT MOVED**: every line these declarations can refuse has its own twin (27 new), so a refused line keeps its slot and spends no redraw. In 37 of the 38 towns whose scene changed, ONLY the sense beat changed; in r2s-under_siege-hamlet-2 the basket line's new twin removes a redraw the joined line spent (a declared move of that paragraph). The fish family's six hunger twins are WIDENED: they speak wherever their original is refused for want of fish (the hunger, or every fish house short).
- **MU1**: every twin of the trades at work is proved reachable by a constructed record in the guard (a census town whose slot draws the original, put in the refusing state, prints the twin). For the arcane `lines` pool, which no census town reaches, an arcane town has its trade words struck so that the slot draws from `lines`.

### The chair's steps 2 and 3

- (2) `tests/domain/bar4MarkPromise.test.js` arm (d) RE-KEYED: r2r-hamlet-9's 'Charcoal supply' on the REAL page ("No timber reaches the charcoal burner." prints, the row reads "Short of timber.") and one constructed proof kept.
- (3) MU1 proofs: the greek market-supply twin (`tests/generators/bar4HousesPresumptions.test.js` (f)); DS-ECO-9 "several, the largest named" v6 (`tests/domain/bar4CorpusEcoKinds.test.js`, a guard town that draws the pool, its band at deficit, prints v6). Both green.

### Step 4: each alone at the tip, against f19c3b28b

69 files (the nine BAR4 guards; `tests/domain/facts` and `tests/architecture` whole; regenDerivedState; customContentPresentationClaims; the entry walker; the files that pin what I changed; the law suites and amendment 2's ten). Re-run alone after the re-keys: GREEN are the nine BAR4 guards, `tests/domain/facts`, `tests/architecture`, regenDerivedState, customContentPresentationClaims, factLayers, presumedThings' new hits (cured by rewording), styleLaw, deepCraftKillList, the corpus walkers and every pin I re-keyed.

RE-KEYED BY IDENTITY (each with a dated note): `textOf` object rows 143 → 188; `census2fColour` (the fish lines' needs; bread's colour index 3 → 4); `tailHistoryBatch6` (the fish twins' needs; r2s-famine-thorp-0's twin on the slot); `bar3PlacesRows` C0013 (r2r-city-18's twin on the slot); `bar4HousesPresumptions` (timber's true state); `bar4MarkPromise` (d); `w2FixDataHistoryItems` (the planks' atom).

RED AT f19c3b28b WITH THE SAME MESSAGES (the joined line's; not mine): crisisBlindDossierProse, generationForkCensus, observedShapeReaders, tieProseDeclared, proseMoveGrammar, tuningRegister, tailExportsPdf3Batch3, and the rest of the projection contract.

NAMED (stored figures the declared cures move; not re-taken):

| test · arm | f19c3b28b → tip | door |
|---|---|---|
| dossierStateProseProjection, proseComposed, proseEntryContradiction, proseWiringCensus · the variant counts | 2976 → 2977; 3444 → 3445; 2739 → 2740 (DS-GEN-13 v6) | the close |
| proseComposed · A0b under-claims (a shrink-only ceiling) | 2014 → 2016 (the joined line is over its 2012 already) | FOR THE CHAIR: the +2 is DS-GEN-13 v6's and the monastery v3's marks as the merged walker counts them (green at 187c46f61) |
| proseCorpusBytes · general.generated.js | the joined line's figure + 489 | a CEILING (B3) |
| pipelinePinnedMode · golden rows | 30 → 31 | the golden's door |
| writerReach · surfaceReach round-trip | its first stale row is `food on breakdown` (+campaign-pdf) where the line's is the same row | WR1 |
| presumedThings · ARM 1 | `house: tavern :: "no institution: tavern"` (the monastery's mark) | PT3/PT4 |

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

THE CHAIR'S WORD, 09:07: KEEP IT. A twin whose state is reachable by the record stays; only a line whose state cannot occur comes out.

REACHABLE, PROVED by one constructed record, as an arm of the guard (`tests/generators/bar4ScenePresumption.test.js`, "REACHABLE: the saws' twin…"):
- r2r-hamlet-12 draws "The rasp of the saws…" on the arrival scene's own stream (`createPRNG('bar4-scenes-2-saws-0').fork('arrival-scene')`).
- Stripped of its timber (no timber ground, no imports), its `timber at hand` reads false.
- The SAME slot then prints "The saws of Aristoburg are quiet most days, for want of timber to cut.", and every other beat of the scene is byte-identical.
- The arm computes both lines from `ARRIVAL_SENSES`; neither is a literal.

So none of my lines is a line whose state cannot occur.

The arm was SHOWN ABLE TO RED by a plant I did not commit: the twin declared `needs: crisis: under_siege` instead of `excludes: timber at hand`. The guard is green with it (5 of 5, 53 s), and so are negativeAssertionAnchor, seedLoopTotality, proseDrawnAnchors and eslint.

### The 525 reference configurations, the build and `verify:dist` (Phase 2, against f19c3b28b)

- **25 of 525** reference configurations move against f19c3b28b, in two field families:
  - `resourceAnalysis.gaps` (24: a Salt works on spent ground, "runs on imported desert_salt" → "lacks access": SV6's rule that an import feeds no work on the ground, now the one reading's);
  - `arrivalScene` (1).
- ONE `npm run build`: GREEN. `npm run verify:dist`: the boot smoke PASSES. It REFUSES on:
  - **the stale committed edge bundle** (`engineBundleReplay` 390 of 525 rows and 248 of 360 fence settlements; `engineServiceCore`, `engineServiceStoreParity`): NAMED (door: `npm run build:edge-shared` at the close);
  - **the goods roster** (`houseInputAtHand.js` absent): the joined line's own (red there the same);
  - **the size ceilings**:

| ceiling | f19c3b28b | tip |
|---|---|---|
| generation worker (2,322,103) | 2,342,187 (red) | 2,355,901 (+13,714) |
| engine chunk (< 878,554) | under | 882,000 |
| **first-paint static closure (1,132,308)** | **under (passes)** | **1,291,683: about +159,000 raw** (gzip 409,511 against 360,756) |

**THE FIRST-PAINT RISE IS MINE AND IT IS NOT SMALL (a regression, NOT cured: item 1 below).**
- The namesake's one home and `trade at work` make `factsOf` (eager, first paint) import `timberAtHand.js` and `tradeAtWork.js`, and with them `houseInputAtHand.js`.
- That brings its imports in turn: the goods identity table, resource semantics, and with HW1 `data/crisisDependence.js` and the institution catalogue. At f19c3b28b none of it rode the first paint.
- The atoms are read at generation time only (the arrival scene; the houses' late re-read), so the cure is a seam: the two getters reach the reading lazily, or the reading's data stays on the lazy side. That is a design call I did not make at the end of my budget.

## Registrations owed

- Manifest entry owed (my predecessor's): `tests/generators/bar4ScenePresumption.test.js`.
- The goods roster row for `sceneSupply.js` named in Phase 1 is NO LONGER OWED: it imports nothing since the namesake's one home.
- New modules: `src/domain/facts/tradeAtWork.js` (imports the roster, the semantic name and `houseInputAtHand.js`: no goods module). `houseInputAtHand.js` adds `data/institutionalCatalog.js`, `data/crisisDependence.js` and `resourceShortageImport` of `resourceSemantics.js` (a goods module it imported already): `verify:dist`'s roster arm says whether a row is owed (see the build).

## The veto list (every new or changed line of Phase 2, with towns it is read in)

New twins that print in the census's 720 or the fresh 300 (the towns read):

| line | towns |
|---|---|
| "The charcoal clamps at the end of the lane stand cold and unlit." | r2r-hamlet-9 (hamlet), r2r-village-49 (village), bar0-hamlet-under_siege-rand-117 (hamlet, siege) |
| "A kiln stands cold across the lane, its mouth bricked up for now." | r2r-village-34 (village), r2s-politically_fractured-hamlet-2 (hamlet) |
| "The kilns of {n} are cold more days than they are lit." | r2r-town-50 (town) |
| "Part of {n}'s living used to come out of the ground, and the workings stand quiet now." | r2r-city-18 (city), bar0-city-under_siege+famine-rand-103 (city, siege and famine), bar0-hamlet-under_siege-rand-126 (hamlet, siege) |
| "Spoil heaps rise beyond the houses, but the workings beyond them stand quiet." | bar0-city-under_siege+famine-rand-107, -112 (city, siege and famine), bar0-metropolis-calm-rand-123 (metropolis) |
| "Little spellwork is done in {n} these days, for want of the stuff it takes." | r2s-insurgency-town-2 (town, insurgency) |
| "The reagent stalls are half bare, and the few jars left are dear." | r2r-metropolis-42 (metropolis) |
| "An ostler walks a horse up and down the yard; no rider has come in for days." | bar0-hamlet-under_siege-rand-113 (hamlet, siege) |
| "An empty fish basket is carried past, back from the water with nothing in it." | r2s-under_siege-hamlet-2, r2s-under_siege-village-3 (siege), r2s-famine-thorp-0 (thorp, famine) |
| "A mill wheel turns somewhere close, slowly, with little grain to grind." | bar0-village-famine-rand-114 (village, famine) |

New twins that print in neither population: each is proved reachable in the guard (MU1):
- kilns: "Drying boards stand empty outside a workshop, with no fresh pots on them."; "Old kiln dust lies on the doorsteps of {n}, but little smoke rises now."; "The yard where crates of pots once waited for the carts stands nearly empty."; "The kilns of {n} are lit only now and then, and most days the lanes are cold.";
- stone: "Few carts of rock come down from the workings now."; "Old grey dust from the workings still lies in the doorways, but no new dust comes."; "No chink of chisels comes from the workings today."; "Workers who cut the stone stand idle by the road, the old dust still in their clothes."; "The road from the workings is empty of carts.";
- arcane: "Shutters are drawn on an upper window where, they say, magic used to be worked."; "Doors where magic is worked stay shut, for want of what the work needs."; "A charm-seller's tray stands nearly empty, and few stop to look."; "A doorway off the lane is lit by an ordinary oil lamp.";
- horses: "A team stands unharnessed in the yard; no carter has a load to take out."; "Harness hangs on its pegs by the yard gate, and no cart pulls out."; "{n} is full of horses with nowhere to go while the road stays closed."; "Horses stand in their stalls with no rider to carry while the road stays closed.".

Changed, words unchanged:
- `trade at work: <trade>` declared on every fish (7), kilns (7), stone (7) and arcane (8) sense line;
- the siege excluded on the stone lines (6) and the horses' traffic lines (5);
- the hunger excluded on the mill wheel; the horses' "smell of horses and hay" declared colour;
- the fish family's six hunger twins widened (their `crisis: hunger` need struck): "Half of {n} has worked fish all its life, and there is almost no fish to work." now also prints in 7 towns whose fish houses are short (r2r-hamlet-10, r2r-village-45, r2r-town-29, …), the drying racks' twin in 3 (r2r-town-3, r2r-town-6, bar0-metropolis-calm-rand-114), the salt barrels' in r2s-indebted-village-1, the nets' in r2s-plague_onset-thorp-2;
- my sawn-timber lines' atom renamed (`timber reaches the saws`).

## What is left, in order

1. **THE FIRST-PAINT REGRESSION (above), FIRST:** about +159,000 raw bytes on the first paint from `factsOf` reaching `houseInputAtHand.js` through `timberAtHand.js` and `tradeAtWork.js`. Cure it at its cause, keeping the atoms' one home off the eager closure (measure with `npm run build` + `tests/build/vendorPdfLazy.test.js`, and `tests/architecture/engineCoreLazyEdge.test.js`), or take the chair's ruling. The worker (+13,714) and the engine chunk (+3,446) are the same reading's bytes.
2. **For the chair:** `proseComposed`'s under-claims ceiling, 2014 at f19c3b28b and 2016 at the tip (the +2 is my predecessor's DS-GEN-13 v6 and monastery v3 marks as the merged walker counts them). A ruling, or a re-worded v6 and v3 by the next seat of the general desk.
3. **For the close's doors:** every NAMED row of both tables above (the variant counts, the byte rows, the golden rows, the registers, the wiring census), the edge bundles (`npm run build:edge-shared`), the size ceilings (B3), and the manifest entry.
4. **Not cured (the joined line's own reds, the same message there):** the seven files listed under step 4.

## Instruments (scratch, outside every tree)

- `books/run.sh <tree> <list> <out>`: each file alone through `scripts/gate-tail.sh`, one log a file, and `results.tsv`.
- `books/ref/hash.mjs <tree> <out>`: the 525 hashed, with records kept gzipped. `books/ref/diff.mjs <dir> <manifest>`: base against manifest, tip against base, by family.
- `books/ref/fence.mjs <tip> <base>`: the fence's 360, leaf-walked.
- `books/adm3.mjs <tree>`: DS-GEN-13's market-no-guild pool, drawn and admitted, over the 24 census siege towns.
- Phase 2: `books/scene2.mjs <tree> <seedcfg> <out.tsv> <seeds…>` (each town's arrival scene and the detector; `scene3.mjs` reads another tree's towns with the tip's detector); `books/marks.mjs` (every row's mark over the 1,020 towns, and the fact against the page); `books/hia.mjs` (every live house's `houseInputAtHand` answers); `books/haw.mjs`, `haw2.mjs` (the `house at work` instances and their houses' readings). The seeds: CENSUS-3 `seedcfg.mjs` and `seeds.txt` (`git archive` of `lane/census-3-2026-11-14`), and `seeds.fresh300.txt` (the chair's lane).
