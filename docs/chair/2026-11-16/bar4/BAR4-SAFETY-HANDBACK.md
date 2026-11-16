# BAR4-SAFETY hand-back (2026-11-16)

Base: `lane/bar4-safety-2026-11-16` at a71788851 = 8aef8e7d46 plus the close's hand-back (docs only). Second tree of the
books: 8aef8e7d4. Work in a scratch worktree (detached; pushed with an explicit refspec).

## THE KINDS

| kind | detector (file :: function) | settled fact | 720 before → after (instances / towns) | fresh 300 before → after | named exclusions | guard and positive control |
|---|---|---|---|---|---|---|
| F1 how the guard is paid | `tests/helpers/safetyKindDetectors.js :: guardPayInstances` (claims table `GUARD_PAY_CLAIMS`) | `src/domain/facts/guardPay.js :: guardPayOf` (the funded gate `defenseProfile.economicGates.military`; `unpaid` where no garrison stands and every watch is the Village watch rota) | 8 / 2 → 8 / 2 (all of them the quarrel hook, C6022's end: named) | 15 / 4 → 3 / 1 (the quarrel hook: named) | none; LEFT, named: the quarrel hook (C6022's end, below) | `tests/domain/bar4SafetyKinds.test.js` (the 720 and the read towns: the guard line); control: "irregular pay" of a Village-watch record at gate 0.8 fires, and `keptGuardLine`'s output does not |
| F2 whether the besiegers move | `… :: siegeMotionInstances` (`SIEGE_MOTION_CLAIMS`) | `src/domain/facts/siegeMotion.js :: siegeMotionOf` (the status of the condition the siege promotes to: the one the stressor desk's direction pool speaks) | 30 / 10 → 0 / 0 | 48 / 16 → 0 / 0 | none | same file (the Tonight sheet, `composeTonightSheet`); control: the pool's own "have not moved" under a worsening siege fires |
| F3 whether crime has a structure | `… :: crimeStructureInstances` (`CRIME_STRUCTURE_CLAIMS`, with `crimeReadingsOf`) | `src/domain/facts/criminalStructureKey.js :: criminalStructureKeyOf`, now reading the record's own criminal income row and covert criminal services (`covertCrimeHeld`: at the least `diffuse`) | 18 / 18 → 13 / 13 (12 the PDF Overview's enforcement line: named; 1 the owed covert-only survival line, r2r-village-12) | 15 / 10 → 13 / 9 (7 the PDF Overview line, 6 rulingStructure's "organised crime has crowded out": both named; 0 of mine) | none; OWED (pinned ≤ 1 in the guard, a ceiling that only shrinks): the covert-service-only town (r2r-village-12), whose survival line is settled where the services are not handed; LEFT, named: the PDF Overview line and rulingStructure's line (below) | same file (the crime patterns); control: "No criminal infrastructure" beside a Black Market Revenue row fires |

The counts are the census's dumps (every printed line, the Tonight sheet, the PDF text and the Foundry journal: a line printed on
three surfaces counts three), read by the detectors against each town's record (`corpus.ndjson.gz`).

## The rows

- C44796 (F1) CURED: the Village watch is an unpaid rota (the catalogue's row; its two descriptions say "Nobody is paid"): the guard
  line's pay claims take the rota's twin (`safetyLineTruth.js :: rotaTruth`, applied in `safetyProfile.js :: keptGuardLine`).
- C7336 (F1) STRUCK at its end: "well paid" reads the funded gate (1 in that city: the defenders' pay's one home, LB4). The false half
  is the hook (C6022).
- C6022 (F1) NAMED, NOT CURED: "The guard has not been paid this month" (`power/conflictIssues.js`'s hook of "The cost of keeping the
  guard") is drawn by `power/conflicts.js :: buildConflictPlotHooks` with facts built from the roster, the config and the stress only
  (conflicts.js:185), though the draw runs at assembly AFTER the defence profile (assembleSettlement.js:420). Its cure: the hook declares
  the pay (an atom reading `guardPayOf`) with a twin true of a funded guard, AND `conflicts.js` hands the defence profile into its facts'
  record. `conflicts.js` is not mine and `assembleSettlement.js` is no seat's: one line to the chair.
- C2020, C20892 (F2) CURED: the Tonight sheet's watch line reads the siege's motion (`crisisSummaryVantage.js :: SIEGE_MOTION_TWINS`,
  through the facts' new `siegeMotion` getter): advancing and easing take their twins; a holding siege keeps "have not moved".
- C46446 (F3) CURED: Black Market Revenue (an `isCriminal` income row) and a covert fence are a diffuse presence: the key reads them
  (`covertCrimeHeld`), the survival line reads the income row (it prints the desperation-theft line), the Defense tab prints the
  Diffuse block. LEFT, named: "organised crime has crowded out the church" (`power/rulingStructure.js:592`, read off
  `priorities.criminal` and `criminalEffective`, never the key): its seat should read `factsOf(record).crime` (organised = semi-organized
  or organized).

## Every new or changed line (the veto list)

1. `crisisSummaryVantage.js :: SIEGE_MOTION_TWINS` advancing: "The besiegers around {name} tighten their lines each week, and the
   lookouts wait for the night they attack." Read in r2s-under_siege-thorp-3 (smallest), r2s-under_siege-metropolis-3 (largest),
   bar0-city-under_siege+famine-rand-105 (siege and famine); 10 towns of the 720, 16 of the fresh 300 (every town that lost "have not moved").
2. The easing twin: "The besiegers around {name} have pulled their lines back, and the lookouts watch for the night they return." Prints in
   no town measured (no siege is born easing); true by its status.
3. `safetyLineTruth.js :: ROTA_TWINS` (read BEFORE the gate in `keptGuardLine`, so a rota town's line takes no gate-made pay word):
   "The {law} is unpaid, but walks the rounds properly." (the drawn "well paid, well equipped and patrols properly" of an unpaid rota:
   no wage, and no kit the gate would deny). Read in bar0-village-calm-rand-22 (C44796's own town; the guard pins it). "The {law} is
   disciplined but unpaid: neighbours who keep the rota, with little equipment." (the drawn "irregular pay"); "… exists on paper.
   Unpaid and poorly equipped"; "… is unpaid and poorly equipped": in no town measured.
4. The crisis case reaches the existing unpaid twins ("The local watch is held for the defence …", "… walks only the rounds the
   occupiers allow.", "The local watch still walks the rounds, but hunger is eroding the order it keeps."), the last newly printed in
   bar0-village-famine-rand-106 (it printed "is well paid and well equipped, but hunger …" beside "Nobody is paid, and the households
   hold the rota").
5. `payTruth`'s gate-1 paper twins: "The {law} exists on paper. Paid, but poorly equipped." (bar0-town-occupied-rand-103, -125: both
   printed "Chronically underpaid" beside a gate of 1); "… is paid, but poorly equipped"; "… exists on paper. Poorly equipped: these are
   volunteers …" (no town measured).
6. No new words for F3: the existing diffuse lines are reached in 69 more towns of the 720 (the Defense tab's "Criminal structure: Diffuse
   criminal presence" 33 -> 102 and its note; the defence desk's diffuse lines, e.g. "Crime at <N> is opportunistic and unorganized …"
   10 -> 36), and the survival line's "Theft of food, livestock, and stored goods by people with too little." 53 -> 57. Read in
   r2r-hamlet-1, r2r-village-26, r2s-wartime-town-0. THIS SILENCES THE DENIAL IN MORE THAN TWENTY TOWNS (told to the chair): each held a
   Black Market Revenue row or a covert fence the page also prints.

The inventory diff (720, base -> tip), read whole: GONE 1 ("have not moved", 10 -> 0); NEW 1 (its twin, 0 -> 10); FEWER 11, each a denial
of crime where the record holds some (the defence desk's "goes wrong one thing at a time" 69 -> 62, "who runs things on the quiet … blank
looks" 21 -> 16 / 8 -> 5 / 19 -> 18, "books record no gang, guild or racket" 12 -> 8 / 18 -> 16 / 24 -> 22 / 10 -> 9, the survival line
6 -> 1, "desperation theft" 71 -> 70: the duplicate entry folded where the survival line now prints it); MORE 10 (above; and "Patron
deity" 717 -> 720: r2r-thorp-0, -1, -3, each render worker's first town, a warm-up artifact of the harness, not a cure). The inheritors are
the eight lines above, each read where it prints.

## The declared moves (the census's 720, base a71788851 → tip)

- The 720: 5 records move, all in `economicState.safetyProfile.crimeTypes` (the survival line's text). The fresh 300: 5 records
  (3 `economicState.safetyProfile.guardEffectivenessDesc`, 2 `crimeTypes`). The crime key and the Tonight line are read at render, not
  stored. No draw moves.

## THE 525

0 of the 525 reference configurations move against 8aef8e7d4 (whole-record sha256, `g525.mjs`, both trees).

## THE BOOKS (BRIEF-BAR3 amendment 2, BRIEF-BAR4 amendment 2), each run alone through `sh scripts/gate-tail.sh`

Run alone at my tip (the seventeen law suites, the three of BRIEF-BAR3, amendment 2's ten files, and the 84 test files that name a
symbol I changed: 101 green). Red at my tip, classed:
- LAWS my cure turned, CURED at the cause: `tests/lint/factLayers.walker.test.js` (the crime leaf reads `availableServices`; the new
  `siegeMotion` getter needed its leaf row: both declared in `factLayers.js`, beside their families); `tests/lint/presumedThings.walker.test.js`
  (the two siege twins now declare `crisis: siege`); `tests/domain/crimeDeniedBesideBackgroundCrime.test.js` (its soak1k-362 anchor holds a
  Black Market Revenue row and a covert fence, as do all ten soak1k towns whose only pattern is Background crime: RE-KEYED BY IDENTITY to
  soak1k-362's own record made with nothing criminal held, with a dated note). Each green after.
- STORED FIGURES, NAMED, NOT RE-TAKEN (green at 8aef8e7d4, red at my tip):
  | test :: arm | old -> new | door |
  |---|---|---|
  | `tests/lint/proseWiringCensus.walker.test.js` :: car 0, the committed census is byte-identical | `docs/content/wiring-census.json` stale-bytes | the census script's write (the close re-takes it once; amendment 4) |
  | `tests/lint/writerReach.walker.test.js` :: the surfaceReach round-trip | "detail on causes": frozen `campaign-pdf=N dossier-pdf=N foundry=N web-display=N web-transitive=N world-book=N` -> `dossier-pdf=N foundry=N web-display=N web-transitive=N world-book=N` | the reach register's door (ruling WR1) |
- `npm run typecheck:ratchet` and `typecheck:domain:strict`: green. eslint on the touched files: green. The three test-corpus walkers of
  BRIEF-BAR3 amendment 11 and `engineCoreLazyEdge`, `layerBoundaries`: green.
- THE BUILD: `npm run build` green. `npm run verify:dist` REFUSED at the build tests: (a) `tests/build/vendorPdfLazy.test.js`'s first-paint
  closure rose 538 B (`siegeMotion.js` drew `conditionPromotion.js` eagerly): BOUGHT BACK (the siege's archetype held as a constant,
  pinned in the guard to `archetypeForStressor`'s own answer); green after a second build; (b) `tests/build/generationWorkerLazy.test.js`'s
  worker ceiling: 2,324,662 B against 2,322,103 B at the first build (+2,559 B). BOUGHT BACK 469 B (the rota twins as one regex table,
  read before the gate, which retired two of its pairs): 2,324,193 B, +2,090 B: what is left is the cure itself (the three fact leaves,
  220-320 B each minified; the twins; the crime reading). A CEILING, "A RISE IS NEVER A LANE'S EDIT: buy the bytes back, or take the
  ruling": NOT RAISED; THE CHAIR'S RULING IS ASKED. The boot smoke did not run (the strict dist refuses before it). `dist/` removed.

## Registrations owed

- Manifest entry owed: none (the new test file is under `tests/domain`, not `tests/generators`).
- Roster row owed: none (no goods module imported).
- New vocabulary: one getter beside its family in `src/domain/facts/factsOf.js` (`siegeMotion`, beside `crisis`); no dimension or atom
  added to `factVocabulary.js`.

## Named for other seats (one line each to the chair)

1. C6022's hook: `power/conflicts.js` (its facts' record lacks `defenseProfile`) + `steps/assembleSettlement.js:420` (no seat's), with
   my leaf `src/domain/facts/guardPay.js :: guardPayOf`.
2. The covert-service-only survival line: `steps/assembleSettlement.js:331` hands `settlement.availableServices` into
   `settleCrimeLinesToSignal`'s lists (no seat's); my side then reads `covertCrimeHeld({ economicState, availableServices })`.
3. The PDF Overview's "No criminal infrastructure has been identified" (`src/pdf/sections/Overview.jsx :: enforcementWords`, fed by
   `domain/display/shadowEconomyShown.js :: criminalsStandHere`): it should read `criminalStructureKeyOf` (non-null = crime stands).
4. `power/rulingStructure.js:592` "organised crime has crowded out": read the key.
5. The defence desk's "fall short on the watch's wages" (DS-DEF-11) where the watch is the Village rota: `guardPayOf` (BAR4-CORPUS-DEF).

## What is left, IN ORDER

0. The worker ceiling (+2,090 B at e52d55824's successor): the chair's ruling, or more bytes bought back (the siege getter on `factsOf` is in the worker only because `factsOf` is: ~320 B if the Tonight sheet handed the record instead).
1. The five named lines above, by their seats.
2. When item 2 lands, lower `OWED_COVERT_ONLY` in `tests/domain/bar4SafetyKinds.test.js` to 0.

## Instruments (scratchpad; each a few lines; re-made from the probes)

- The census: `census3.sh <tree> <out> 4 --count-only [--seeds seeds.fresh300.txt]` (lane/census-3-2026-11-14's probes, git-archived out).
- The count: `kinds.mjs <tree> <out-dir>` (env `WT=<tree with the detectors>`): every town's dump split to sentences, the three
  detectors of `tests/helpers/safetyKindDetectors.js` against `guardPayOf`, `siegeMotionOf`, `criminalStructureKeyOf` +
  `crimeReadingsOf`; prints instances, towns and the commonest lines; writes `kinds.json`.
- `f3m.mjs` (the key against the income and covert readings), `g525.mjs` / `g525cmp.mjs` (the 525's hashes whole and by top-level field,
  `TREE= OUTF=`), `runall.sh <tree> <label> <list>` (each test file alone).
