# BAR4-CORPUS-DEF hand-back (the defence desk: a live threat, the real reliance on magic, a crisis; and C24893)

Base 8aef8e7d46 (my checkout's tip a71788851f differs from it in documents only: BAR3-CLOSE-DOORS-2's hand-back). Branch
`lane/bar4-corpus-def-2026-11-16`, cut from 8aef8e7d46. Every line below is vetoable by the owner.

## THE KINDS

| kind | the detector | 720 before → after | fresh 300 before → after | named exclusions (judged TRUE) | the guard and its positive control |
|---|---|---|---|---|---|
| D1 "nothing threatens it" beside a danger on its way | `tests/helpers/defenceDeskKinds.js :: liveThreatOf` over every DS-DEF member marked `no threat` | 16 instances / 15 towns → 0 | 13 / 12 → 0 | 11: readiness STRONG v2 (strength, not calm); the six Beasts & Monsters `settled` members (the country's beasts, not a danger one parleys with); Invasion neither v2 (conditional) and v7 (its watch "no answer to an army"); Naval Port only v2 (an exposure); UNWALLED-SMALL v1 (the page's own "distance, diplomacy"); WALLED-QUIET v6 (the danger twin) | `tests/domain/bar4CorpusDefKinds.test.js`: the zero over the 720 + the seven read towns; controls bar0-hamlet-calm-rand-23 (C18744), bar0-village-calm-rand-23 (C45642) |
| D2 what rests on magic | `magicSupplyOf` (DS-DEF-9 `magicDependency false` v1-v3) | 0 / 0 → 0 | 0 / 0 → 0 | none | control bar0-town-calm-rand-22 (C36862); its twin v4 drawn there |
| D2 · THE SPLIT (K6, not this desk's) | `fishedOutMagicChainOf` (DS-DEF-9 named-chain pool beside "fished out ... bought in") | 20 / 20 → 20 / 20 (not mine) | 15 / 15 → 15 / 15 (not mine) | none: the income line is the false side | a CEILING (20, shrink-only) in the same guard; control bar0-metropolis-calm-rand-23 (C31074) |
| D3 a calm line in a crisis | `curfewOf` (watch v3), `fullPurseOf` (WEAK v1-v5), `activeCrisisOf` (WEAK v3 "when a real crisis comes"), `armedUnrestOf` (WALLED-QUIET v2, v3) | 69 / 68 → 0 | 25 / 24 → 0 | none | controls bar0-town-occupied-rand-21 (C40032), bar0-thorp-calm-rand-23 (C34105; its twin v6 drawn), bar0-city-wartime-rand-23 (C16539) |
| PAY (BAR4-SAFETY's row, the chair 08:59) a line presuming paid defenders beside an unpaid rota | `unpaidRotaOf` (DS-DEF-6 Well-funded v2-v4, Underfunded v1, Critical v2; DS-DEF-8 tribute v2; DS-DEF-11 STRAINED v1) | 0 / 0 → 0 | 0 / 0 → 0 | none | a constructed record (a `village_watch`, no paid force). PREMISE: no DS-DEF member says "fall short on the watch's wages" (the paraphrase of `safetyLineTruth.js :: payTruth`'s comment); over the seven Village-watch towns of the 1,020 none of mine prints a pay claim; the false one there is the safety line "The local watch is well paid and well equipped" (bar0-village-famine-rand-106), BAR4-SAFETY's. After the join the gate reads `guardPayOf` (BAR4-SAFETY's `src/domain/facts/guardPay.js`). |
| C24893 "no gang, guild or racket" beside criminal income | `criminalIncomeOf` (DS-DEF-4 null v1, v2: a criminal revenue, or a criminal house's covert service) | 8 / 8 → 0 | 2 / 2 → 0 | none | constructed records (a Black Market Revenue row; a Local fence's service). THE GATE'S TWO READINGS BECOME ONE AT THE JOIN: `no organised crime` (the structure's key, which BAR4-SAFETY widens to read the income's `isCriminal` and the covert services) and `no criminal income` (mine, reading both itself until then). |

The raw D1 count before the exclusions was 49 instances in 27 census towns. BEFORE is read at 8aef8e7d46's dumps with
8aef8e7d46's own leaf (the member texts), AFTER at my tip's (the 720 and the 300 re-rendered at the tip, the towns the
batch's last two edits touch re-rendered again: 48 + 15 census towns, 9 fresh). My K2 line to the chair gave the fresh
300 as D1 9/8 and D3 9/9: it was read with my tip's reworded text and missed the old WALLED-QUIET v3; the true counts
are the ones in this table (sent to the chair). D3 grew by two siblings read in the inventory diff's inheritors
(WALLED-QUIET v2 under war or revolt; WEAK v3's "when a real crisis comes" under any crisis: 49 towns of the 720, a
silence over twenty, judged false and told to the chair), C24893 by one (null v2 beside a criminal revenue).

THE INVENTORY DIFF (8aef8e7d46 → tip, the 720): sentences 30152 → 30157; gone 2 (WALLED-QUIET v3's old words, 14 + 12:
reworded); new 7 (the reword's two tier forms, the twins); every line in fewer towns is one of the cured members; the
24 inheritors read (the poor-purse siblings WEAK v1, v2, v4, v5; the twins; Invasion v1 and UNWALLED-SMALL v1, the
page's own "distance, diplomacy"; watch v1 under an occupation; null v3 "the town hides it very well"): each true where
it prints. ONE ARTIFACT: the Faith tab's three premium lines ("Patron deity" ...) left three towns, r2r-thorp-0, -1 and
-3, which are three render workers' FIRST towns; no cure of mine reaches the Faith tab (a lazily loaded panel's timing). The detector reads the record DIRECTLY
(the crisis types, `history.currentTensions`, `economicState.tradeAccess/tradeDependencies/prosperity/incomeSources/
activeChains/primaryImports`), never through the vocabulary readers the cure declares against.

## The cures (one batch)

THE CAUSE in each case is a line that presumes a state the record can deny, read by no gate. The cure is the GATE: the
line declares what it presumes, in the vocabulary's own form, and the kernel's one rule refuses it where the record
denies it; where that leaves a state mute, a twin true in that state.

- NEW VOCABULARY (BRIEF-BAR4 amendment 5b; each beside its family; on the veto list as new vocabulary):
  `danger coming` (`src/domain/facts/dangerComing.js`: a live `external_threat` tension of the history, layer 4),
  `magic supply` (`src/domain/facts/magicSupply.js`: an isolated route whose trade needs are met, the economy's
  "teleportation imports replace road access", layer 2), `criminal income` (`src/domain/facts/criminalIncome.js`: an
  income row with the writer's own `isCriminal: true`, or a service a criminal house offers, read by
  `corruption.js :: isCriminalInstitution`, layer 2). Getters in `factsOf.js`, rows in `factLayers.js`.
- D1: `no danger coming` on readiness STRONG v3, v4; Invasion & War neither v3; WALLED-QUIET v1, v2, v3; UNWALLED-SMALL
  v4. Twin WALLED-QUIET v6.
- D2: `no magic supply` on DS-DEF-9 `magicDependency false` v1-v3 (v1, v3 lose their `colour` mark). Twin v4.
- D3: watch PRESENT v3 `no crisis: occupied · no crisis: wartime` (drops `colour`); Economic Survival WEAK v1-v5
  `prosperity: ≤ comfortable`, v3 also `crisis: calm`, twin v6 `prosperity: ≥ prosperous`; WALLED-QUIET v2 and v3
  `no unrest`, v3 REWORDED for its agreement slip (C16539: "walls and gates ... it"), twin v7 `unrest`.
- C24893: DS-DEF-4 structure null v1 `no criminal income` (the GATE; its words stand: the three finders still pin them);
  its sibling v2 ("goes wrong one thing at a time") the same gate (drops `colour`).

## The veto list (every new or changed line; three towns it is read in)

Read in the tip's pages (the 720 and the fresh 300); the r2s- and bar0- seed names carry their crisis where the
crisis column reads `calm` (a stress held as one object). New vocabulary: `danger coming`, `magic supply`, `criminal
income` (above).

- DS-DEF-1 · readiness STRONG · v3 `[no threat · no danger coming · crisis: any · no crisis: unrest]` "The town does not spend much time thinking about being attacked: its defences are in good order, and its people know it.": prints in 21 towns; read in r2r-town-10 (town, calm); bar0-metropolis-calm-rand-101 (metropolis, calm); r2r-town-13 (town, calm).
- DS-DEF-1 · readiness STRONG · v4 `[no threat · no danger coming]` "Nothing presses {settlement} at present: its defences would make any attack costly, so raiders and rivals look elsewhere.": prints in 11 towns; read in r2r-town-6 (town, calm); bar0-metropolis-calm-rand-115 (metropolis, calm); r2r-town-34 (town, calm).
- DS-DEF-2 · Invasion & War: neither walls nor force · v3 `[no threat · no danger coming · crisis: any]` "The town's plan for an army is to not be interesting to one, and everybody here can state the plan.": prints in 81 towns; read in r2r-thorp-9 (thorp, calm); bar0-village-calm-rand-130 (village, calm); r2r-thorp-15 (thorp, calm).
- DS-DEF-11 · WALLED-QUIET · v1 `[no threat · no danger coming · crisis: any · no crisis: unrest]` "Though the present peace asks nothing of its defences, {settlement} keeps its {defwork} in repair: mending costs less than building again.": prints in 29 towns; read in bar0-thorp-calm-rand-117 (thorp, calm); bar0-metropolis-calm-rand-130 (metropolis, calm); r2r-city-1 (city, calm).
- DS-DEF-11 · WALLED-QUIET · v2 `[no threat · no danger coming · no unrest · crisis: any]` "The older people of {settlement} say defences are easier to keep than to raise, so what the town built stands ahead of any present need.": prints in 26 towns; read in r2s-famine-town-3 (town, calm); bar0-metropolis-calm-rand-127 (metropolis, calm); r2r-city-2 (city, calm).
- DS-DEF-11 · WALLED-QUIET · v3 `[no threat · no danger coming · no unrest · crisis: any]` "{settlement}'s accounts show little spent on its {defwork}, since built work needs little upkeep and the town asks little of its defences now.": prints in 21 towns; read in r2r-city-12 (city, calm); bar0-metropolis-calm-rand-129 (metropolis, calm); r2r-city-15 (city, calm).
- DS-DEF-11 · WALLED-QUIET · v6 `[danger coming · no threat · crisis: any]` "{settlement} kept its {defwork} in repair through the quiet years, and with news of danger on the way, the town is glad it did.": prints in 16 towns; read in r2r-city-5 (city, calm); bar0-metropolis-calm-rand-109 (metropolis, calm); r2r-metropolis-1 (metropolis, calm).
- DS-DEF-11 · WALLED-QUIET · v7 `[unrest · no threat · no danger coming · crisis: any]` "{settlement}'s {defwork} face outward, and the trouble the town has now is not the kind they keep out.": prints in 9 towns; read in r2s-insurgency-city-0 (city, calm); r2s-slave_revolt-metropolis-3 (metropolis, calm); r2s-insurgency-city-1 (city, calm).
- DS-DEF-11 · UNWALLED-SMALL · v4 `[no threat · no danger coming · no crisis: wartime · crisis: any]` "{settlement} has no wall, and nothing threatens it now that a wall would keep out.": prints in 103 towns; read in r2r-thorp-4 (thorp, calm); bar0-village-famine-rand-127 (village, calm); r2s-recently_betrayed-hamlet-2 (hamlet, recently_betrayed+famine).
- DS-DEF-5 · watch PRESENT · v3 `[no crisis: occupied · no crisis: wartime]` "Anyone walking {settlement} late is watched, not stopped, and the watchmen make sure you know it.": prints in 51 towns; read in r2r-village-25 (village, calm); bar0-town-calm-rand-127 (town, calm); r2r-town-1 (town, calm).
- DS-DEF-2 · Economic Survival: WEAK · v1 `[guardPresence · prosperity: ≤ comfortable]` "{settlement} is always short of money for its defence: no money is laid by to pay for a long one, and whoever is called to make one knows it.": prints in 39 towns; read in r2r-thorp-26 (thorp, calm); bar0-city-under_siege+famine-rand-110 (city, under_siege+famine); bar0-city-under_siege+famine-rand-106 (city, under_siege+famine).
- DS-DEF-2 · Economic Survival: WEAK · v2 `[guardPresence · prosperity: ≤ comfortable]` "The people who would have to hold {settlement} through something know there is no money to pay them for it.": prints in 41 towns; read in r2r-thorp-1 (thorp, calm); bar0-city-under_siege+famine-rand-130 (city, under_siege+famine); r2r-thorp-4 (thorp, calm).
- DS-DEF-2 · Economic Survival: WEAK · v3 `[prosperity: ≤ comfortable · crisis: calm]` "{settlement}'s defence has been short of money for years, and each lean season leaves less to spend on it when a real crisis comes.": prints in 44 towns; read in r2r-thorp-8 (thorp, calm); r2r-town-22 (town, calm); r2r-thorp-14 (thorp, calm).
- DS-DEF-2 · Economic Survival: WEAK · v4 `[no guardPresence · prosperity: ≤ comfortable]` "{settlement} pays nobody to defend it, and could not find the wages if it had to hire someone in a hurry.": prints in 93 towns; read in r2r-thorp-3 (thorp, calm); bar0-village-famine-rand-127 (village, calm); r2r-thorp-5 (thorp, calm).
- DS-DEF-2 · Economic Survival: WEAK · v5 `[no guardPresence · prosperity: ≤ comfortable]` "If {settlement} ever had to hire people to defend it, it would have to borrow the money first.": prints in 89 towns; read in r2r-thorp-0 (thorp, calm); bar0-village-calm-rand-128 (village, calm); r2r-thorp-9 (thorp, calm).
- DS-DEF-2 · Economic Survival: WEAK · v6 `[prosperity: ≥ prosperous]` "{settlement} is well off, but little of its wealth is set aside for its defence, and a long crisis would soon outrun what is.": prints in 6 towns; read in r2r-thorp-33 (thorp, calm); bar0-village-calm-rand-114 (village, calm); r2r-thorp-44 (thorp, calm).
- DS-DEF-9 · magicDependency false · v1 `[no magic supply]` "Nothing structural at {settlement} depends on arcane work. What the town makes it makes with hands and ground, and would go on making without a practitioner in it.": prints in 170 towns; read in r2r-thorp-2 (thorp, calm); r2r-metropolis-10 (metropolis, calm); r2s-wartime-thorp-2 (thorp, wartime+famine).
- DS-DEF-9 · magicDependency false · v2 `[magic · no magic supply]` "Whatever magic reaches {settlement}, the town does not rest on it: nothing it lives by would stop without it.": prints in 157 towns; read in r2r-thorp-8 (thorp, calm); r2s-slave_revolt-metropolis-2 (metropolis, calm); r2s-occupied-hamlet-0 (hamlet, occupied+famine).
- DS-DEF-9 · magicDependency false · v3 `[no magic supply]` "The town would go on as it is if the arcane went away; nothing it lives by waits on a spell.": prints in 207 towns; read in r2r-thorp-0 (thorp, calm); r2s-plague_onset-metropolis-0 (metropolis, calm); r2s-succession_void-thorp-1 (thorp, succession_void+famine).
- DS-DEF-9 · magicDependency false · v4 `[magic supply]` "{settlement}'s own work does not lean on magic, but no trade road reaches it, and some of what it lives on is brought in by magic.": prints in 0 towns; read in NONE of the 1,020 (it prints only in the read town named in THE KINDS).
- DS-DEF-4 · structure null (nothing organized recognized) · v1 `[no organised crime · no criminal income]` "{settlement}'s books record no gang, guild or racket: what wrongdoing the town has, people do on their own account.": prints in 85 towns; read in r2r-thorp-3 (thorp, calm); bar0-town-calm-rand-123 (town, calm); r2r-thorp-12 (thorp, calm).
- DS-DEF-4 · structure null (nothing organized recognized) · v2 `[no criminal income]` "What goes wrong at {settlement} goes wrong one thing at a time and belongs to whoever did it.": prints in 102 towns; read in r2r-thorp-0 (thorp, calm); r2s-infiltrated-city-1 (city, calm); r2r-thorp-4 (thorp, calm).

## Rows named for other seats

- THE D2 SPLIT, for the seat holding `src/generators/economy/incomeLineSiblings.js` (sent to the chair 2026-11-16):
  FISH_EXPORT_LINE takes FISH_BOUGHT_LINE on `f.fisheryExhausted` alone while the fishing chain on that water carries a
  `magicNote` and runs (status vulnerable, magicRecovery). The two fields: `economicState.activeChains[].magicNote/status`
  vs every fish water's `resourceCondition: 'depleted'`. 20 census towns, 15 fresh (C31074). My lines are true to the
  record and stand; the guard holds the split at a shrink-only ceiling of 20.

## The books my cures move (named; NOT re-taken)

| the test · the arm | old → new | its door | why |
|---|---|---|---|
| `tests/data/dossierStateProseProjection.contract.test.js` · SEAM car 4, "recomputes every pin" and its MUTANT | `docs/content/prose-shift-register.json`: variant-count pin 0 2959 → 2963; pin 1, face-count pins 0 and 2, vids pin 0 (digests) | the register's own row, edited in the cure's commit by the close (amendment 4: a shared stored file of the annex, NOT re-taken by a desk) | four twins: WALLED-QUIET v6, v7; WEAK v6; DS-DEF-9 false v4 |
| `tests/domain/composeStateProse.test.js` · "every block lives in exactly one leaf" | variants 2959 → 2963 | the close's re-measure of the composed figure (TAIL-CLOSE-DOORS-3's form) | the four twins |
| `docs/content/wiring-census.json` (the annex's shared census) | not re-taken | `npm run` the census's door at the close | the DS-DEF pools' declarations and four new members |

RE-PLACED BY THE FILE'S OWN FORM (a dated `placed:` row, as W2-A-LEAVES-2 did): `tests/lint/factLayers.poolTable.json`
DS-DEF-11 UNWALLED-SMALL (2 → 5), WALLED-QUIET (4 → 5), DS-DEF-1 readiness STRONG (4 → 5), DS-DEF-2 Invasion & War
neither walls nor force (2 → 5): their lines now declare `danger coming` (the history, layer 4).
TAUGHT: `tests/helpers/calmFactsDouble.js` answers `magic supply` and `criminal income` true ("every presence atom
holds", as the kernel sweep's reference reads a `no X` line) and `danger coming` false (a trouble, read like its calm
crisis). RE-KEYED by its own form, with a dated note: `tests/domain/census5cOwedLines.test.js` DS-DEF-4 null's admitting
record also holds no criminal income.

THE BOOKS RUN at 437d67a8b (each file alone, `sh scripts/gate-tail.sh`; the base 8aef8e7d46 is green whole by the
chair's check of 08:28, so every red here is mine and classed): my guards and every file that pins a changed symbol (28
files), the seventeen law suites with `engineCoreLazyEdge`, `tuningRegister`, `chainPrintSites`, the ten files of
BRIEF-BAR4 amendment 2, the three test-corpus walkers, and `generatorGoldenMaster`: GREEN but for the rows below.
NO LAW OF MINE IS RED. THE 525: `tests/property/generatorGoldenMaster.test.js` green: 0 reference configurations move
(display prose and eager fact readers only; no record field moves).

| the test · the arm | old → new | its door | class |
|---|---|---|---|
| `tests/lint/observedShapeReaders.walker.test.js` · "a freshly re-minted baseline has NO drift" | the input digest of `defense.generated.js` | its shrink-only re-freeze ("lawful, the re-freeze absorbs it") | stored figure |
| `tests/lint/writerReach.walker.test.js` · the surfaceReach round trip | `economicState.tradeDependencies` gains `campaign-pdf=R` (a real reader: `magicSupply.js`) | the reach register's door (ruling WR1: NAMED) | register row |
| `tests/lint/proseComposed.walker.test.js` · "the shipped ones, not empty stubs" | state corpus 2959 → 2963 | the close's re-measure | stored count |
| `tests/lint/proseEntryContradiction.walker.test.js` · "reproduces the projection's arithmetic", "joins every annex row" | 3427 → 3431; 2722 → 2726 | the close's re-measure | stored counts. Its ANTI-VACUITY arm (a law) went red on a row address moved by my twins; RE-ADDRESSED BY ITS TEXT in the file's own form ("the same trades exempt", 6167 → 6169, dated note): green |
| `tests/lint/proseWiringCensus.walker.test.js` · the variant column, the dry read, byte-identical census | 2959 → 2963; `docs/content/wiring-census.json` stale | the census's own door at the close (amendment 4) | stored file |
| `tests/lint/tuningRegister.walker.test.js` · "the measured tree matches the committed inventory" | `corruption.js` CAPTURE/CORRUPTION/DEITY_CORRUPTION/DEITY_LAW_TUNING: dependents moved (`criminalIncome.js` imports `isCriminalInstitution`) | the register's refreeze | stored inventory |
| `tests/lint/proseCorpusBytes.test.js` · RAW is EXACT | `defense.generated.js` 266,715 → 269,046 raw bytes (+2,331: commits 6f8081add, b98bf80ba) | a declared row in `scripts/.prose-byte-baseline.json` at the close | a CEILING: NOT raised by me |
| `verify:dist` (`npm run build` GREEN) · `tests/build/vendorPdfLazy.test.js` first-paint closure | raw 1,132,308 → 1,133,265 (+957); gzip 360,756 → 361,006 (+250); Brotli 302,830 → 303,023 (+193); the engine chunk 878,555 against < 878,554 | the close's doors, once (RULING B3 for the whole round, the chair 09:39 UTC) | A NAMED MOVE FOR THE CLOSE (commits 6f8081add, b98bf80ba); never raised by me |
| `verify:dist` · `tests/build/generationWorkerLazy.test.js` worker bundle | 2,322,103 → 2,323,126 (+1,023) | as above | A NAMED MOVE FOR THE CLOSE (the same commits) |

The cause of the byte rises: three eager fact homes, their three getters and three dimensions (~1.5 KB minified). By
the chair's ruling (09:39 UTC) nothing is re-formed to buy bytes back and the three facts keep their own modules; none
is a generation-only reader (each is read by the defence desk's draw on the page), so none moves to the lazy side.
`verify:dist` refuses on those ceilings alone; `npm run build` is green; the built `dist/` was removed.

## Registrations owed

- No new test file under `tests/generators` (no manifest entry owed). No new import of a goods module (no roster row
  owed). Three new modules under `src/domain/facts/` (eager, import-free): `engineCoreLazyEdge` run, green.

## What is left, in order (for a successor)

1. THE D2 SPLIT (named above): when the income line's writer reads the magic-held chain, lower the guard's ceiling
   (`bar4CorpusDefKinds.test.js`, 20) to its new measure.
2. THE BOOKS AT THE CLOSE: every row of "the books my cures move", through its door, once (the shift register, the wiring
   census, the composed counts, the byte baseline's declared row, the reach and tuning registers, the size ceilings).
3. Lines judged loose and left (not this round's kinds; not counted): WEAK v6's elliptical "outrun what is" (could read
   "what there is", a one-word cure if the owner wants it); WALLED-QUIET v2 "ahead of any present need" in a calm
   town is true.

## How the instruments are re-made

`git archive` of `docs/chair/2026-11-14/probes/READ-ALL/` (lane/chair-2026-11-08) and
`docs/chair/2026-11-14/probes/CENSUS-3/` (lane/census-3-2026-11-14) to a scratch directory outside every tree;
`census3.sh <tree> <out> 4 --count-only` and again with `--seeds READ-ALL/packets11/seeds.fresh300.txt`, at 8aef8e7d46
(before) and at my tip (after); then THE COUNT: `node k2.mjs <tree> <out>` (below; it matches each dump sentence of
the tabs, not the PDF, back to its DS-DEF member, the tier noun allowed for "town", and runs
`defenceDeskKindsIn` over the record). `inventory.py <out> before.json|after.json`; `inventory_diff.py`.

The count script is committed beside this file: `docs/chair/2026-11-16/bar4/BAR4-CORPUS-DEF-k2.mjs` (run it from a
copy outside the tree). The veto list's towns are read by the same member matching.
