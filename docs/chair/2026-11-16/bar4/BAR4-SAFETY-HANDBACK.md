# BAR4-SAFETY hand-back (2026-11-16) · FINAL at the chair's word of 10:18 UTC

Base: `lane/bar4-safety-2026-11-16` at a71788851 = 8aef8e7d46 plus the close's hand-back (docs only). Second tree of the
books: 8aef8e7d4. Work in a scratch worktree (detached; pushed with an explicit refspec).

## THE KINDS

| kind | detector (file :: function) | settled fact | 720 before → after (instances / towns) | fresh 300 before → after | named exclusions | guard and positive control |
|---|---|---|---|---|---|---|
| F1 how the guard is paid | `tests/helpers/safetyKindDetectors.js :: guardPayInstances` (claims table `GUARD_PAY_CLAIMS`) | `src/domain/facts/guardPay.js :: guardPayOf` (the funded gate `defenseProfile.economicGates.military`; `unpaid` where no garrison stands and every watch is the Village watch rota) | 8 / 2 → **0 / 0** | 15 / 4 → **0 / 0** | none | `tests/domain/bar4SafetyKinds.test.js` over the whole 720 and the read towns (the guard line and the quarrels' hooks); controls: each rota twin's state on a constructed Village-watch record at gate 1 and 0.8 (ruling MU1: the base line fires, the cured line does not), and "Chronically underpaid" at gate 1 fires |
| F2 whether the besiegers move | `… :: siegeMotionInstances` (`SIEGE_MOTION_CLAIMS`) | `src/domain/facts/siegeMotion.js :: siegeMotionOf` (the status of the condition the siege promotes to, `SIEGE_ARCHETYPE`, pinned to `archetypeForStressor`: the one the stressor desk's direction pool speaks) | 30 / 10 → **0 / 0** | 48 / 16 → **0 / 0** | none | same file (the Tonight sheet, `composeTonightSheet`); control: the pool's own "have not moved" under a worsening siege fires |
| F3 whether crime has a structure | `… :: crimeStructureInstances` (`CRIME_STRUCTURE_CLAIMS`, with `crimeReadingsOf`) | `src/domain/facts/criminalStructureKey.js :: criminalStructureKeyOf`, now reading the record's own criminal income row and covert criminal services (`covertCrimeHeld`: at the least `diffuse`) | 18 / 18 → **0 / 0** | 15 / 10 → **0 / 0** | none | same file (the crime patterns and the powers' lines); the PDF Overview line is counted by the census; control: "No criminal infrastructure" beside a Black Market Revenue row fires |

The counts are the census's dumps (every printed line: the tabs, the Tonight sheet, the PDF text and the Foundry journal, so a line on
three surfaces counts three), read by the detectors against each town's record (`corpus.ndjson.gz`), at a71788851 and at my final tip.
The chair's grants SF1 (of 08:59 and 09:25 UTC) gave me the one-argument and one-reading edits outside my files that F1 and F3 needed
(listed under the rows).

## The rows

- C44796 (F1) CURED: the Village watch is an unpaid rota (the catalogue's row; its two descriptions say "Nobody is paid"): the guard
  line's pay claims take the rota's twin (`safetyLineTruth.js :: rotaTruth`, applied in `safetyProfile.js :: keptGuardLine`).
- C7336 (F1) STRUCK at its end: "well paid" reads the funded gate (1 in that city: the defenders' pay's one home, LB4). The false half
  is the hook (C6022).
- C6022 (F1) CURED under SF1 (b): `steps/assembleSettlement.js:420` hands `settlement.defenseProfile` to `generateConflicts` (ONE
  argument; no line added, moved or split); `power/conflicts.js` carries it into the hook's facts record and reads `guardPayOf` off
  the same record; the drawn hook is unchanged (the pool, its order, its size), and ONLY where it is "The guard has not been paid this
  month" and the guard is paid in full does its twin print IN PLACE (`conflictIssues.js :: UNPAID_GUARD_HOOK_PAID_TWIN`). The
  regen's call (`generateSettlementPipeline.js:601`) hands none: it keeps the born quarrels (RG1c), so the twinned text is carried.
- C2020, C20892 (F2) CURED: the Tonight sheet's watch line reads the siege's motion (`crisisSummaryVantage.js :: SIEGE_MOTION_TWINS`,
  through the facts' new `siegeMotion` getter): advancing and easing take their twins; a holding siege keeps "have not moved".
- C46446 (F3) CURED: Black Market Revenue (an `isCriminal` income row) and a covert fence are a diffuse presence: the key reads them
  (`covertCrimeHeld`); the survival line reads the same two (SF1 (c): `assembleSettlement.js`'s late re-read's lists carry
  `services: settlement.availableServices`, ONE argument on its own line, 332 at my tip); the Defense tab prints the Diffuse block; the PDF
  Overview's enforcement line reads the key (SF1 (d): `pdf/sections/Overview.jsx`, `factsOf(settlement).crime !== 'none'` beside
  `criminalsStandHere`); and the religious power's "organised crime has crowded out" stands only where the key reads an organisation
  (SF1 (d): `power/rulingStructure.js:591`, `factsOf({ institutions, economicState }).crime`: measured over both populations, the power
  step's key and the final key agree in all 6 printing towns: 4 kept, 2 diffuse silenced, bar0-village-calm-rand-104, -famine-rand-111).

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
5b. `conflictIssues.js :: UNPAID_GUARD_HOOK_PAID_TWIN`: "The guard is paid in full every month, and the other side wants to know whose
   purse it comes out of." Read in r2r-city-32, r2r-city-46, bar0-city-wartime-rand-114 (every town that drew the unpaid hook beside a
   funded guard: 2 of the 720, 1 of the fresh 300; bar0-city-under_siege+famine-rand-23, the read town, is the class).
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

## The declared moves (records, base a71788851 → final tip, field diff by family)

- The 720: 8 records move. 6 `economicState.safetyProfile.crimeTypes` (the survival line: r2r-village-12, -24, -26, r2s-wartime-village-1,
  r2s-wartime-town-0, r2s-mass_migration-village-1); 2 `conflicts` and `powerStructure.conflicts` ONLY (the hook's twin: r2r-city-32,
  r2r-city-46: SF1 (b)'s proof: every other town of the 720 is byte-identical). No draw moves.
- The fresh 300: 7 records. 3 `guardEffectivenessDesc` (the gate-1 paper twin in bar0-town-occupied-rand-103 and -125; the rota's famine
  twin in bar0-village-famine-rand-106); 2 `powerStructure.factions` (the religious line: bar0-village-calm-rand-104, -famine-rand-111);
  2 `crimeTypes` (bar0-village-famine-rand-108, -111); 1 `conflicts` (the hook's twin: bar0-city-wartime-rand-114).
- The crime key and the Tonight line are read at render, not stored.

## THE 525

0 of the 525 reference configurations move against 8aef8e7d4 (whole-record sha256 by `g525.mjs` in both trees, re-taken at the final tip).

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
  | `tests/lint/writerReach.walker.test.js` :: the surfaceReach round-trip (ruling WR1: a real reader added; the first row it trips at the final tip is "isCriminal on incomeSources", the reader `covertCrimeHeld` adds; at e52d55824 it tripped on "detail on causes") | "detail on causes": frozen `campaign-pdf=N dossier-pdf=N foundry=N web-display=N web-transitive=N world-book=N` -> `dossier-pdf=N foundry=N web-display=N web-transitive=N world-book=N` | the reach register's door (ruling WR1) |
- `npm run typecheck:ratchet` and `typecheck:domain:strict`: green. eslint on the touched files: green. The three test-corpus walkers of
  BRIEF-BAR3 amendment 11 and `engineCoreLazyEdge`, `layerBoundaries`: green.
- After SF1 (b)-(d), alone at the final tip: `regenDerivedState` (RG1c's born-quarrels arm), `customContentPresentationClaims`,
  `sourceCitationIntegrity.walker`, `holderCitesBySymbol`, `heldKeyWriterCensus.walker`, `ruinFilterRoster.walker`,
  `generationForkRegistry.contract`, `generationForkCensus`, `hookThemeDraws`, `rosterDuplicateDraws`, `powerStructure` (its packed-lines
  ceiling: my first form packed one line in `conflicts.js`, unpacked), `presumedThings.walker` (the hook stays inline in its row; the twin
  declares `guardPresence`), and every test naming the conflict pools: green. `ledgerCitationIntegrity` is red at my tip AND at
  8aef8e7d4 with the same message (the scratch worktree holds no local `review-fixes-2026-07-08` ref): the environment's, not mine.
  The law suites and amendment 2's ten files re-run alone at the final tip: 28 green, the two stored figures above.
- THE BUILD: `npm run build` green. `npm run verify:dist` at the final tree REFUSES on THREE SIZE CEILINGS (each a ceiling: NOT
  raised by me; each is the cure's own code, the three fact leaves, the twins and the crime reading; the chair's ruling of 09:21 UTC
  ruled at 10:18 UTC: RULING B3 COVERS ALL THREE, NAMED MOVES FOR THE CLOSE). THE BOOKS MY CURES MOVE, the size ceilings:
  | test :: arm | ceiling -> final tree | where the bytes are |
  |---|---|---|
  | `tests/build/generationWorkerLazy.test.js` :: the worker bundle stays under its measured ceiling | 2,322,103 -> 2,324,849 B (+2,746) | e52d55824 (+2,559), 3297cbe36 (-469: the rota table), the SF1 commit (+656: the hook's twin and the pay read) |
  | `tests/build/vendorPdfLazy.test.js` :: the engine chunk still exists (lazy) and remains large (its upper bound) | < 878,554 -> 880,408 B (+1,854) | the same generator code (safetyLineTruth, guardPay, conflicts, rulingStructure) |
  | `tests/build/vendorPdfLazy.test.js` :: the entry static closure under the first-paint budget (raw, gzip, Brotli) | 1,132,308 -> 1,133,011 raw (+703); 360,756 -> 361,008 gzip; 302,830 -> 302,934 Brotli | the eager facts and the Tonight sheet: `siegeMotion.js` and its `factsOf` getter, `covertCrimeHeld`, the siege twins |
  THE CORRECTION, in the chair's words: first paint was never measured before: the size arms are skipped without VERIFY_DIST=1;
  the close's doors will measure with VERIFY_DIST=1. `verify:dist` refuses on these three alone.
  In detail, A CORRECTION OF MY e52d55824 HAND-BACK: I wrote the first-paint rise "bought back, green after a second build". It was NOT measured:
  `vendorPdfLazy` run alone SKIPS its size arms unless `VERIFY_DIST=1` (14 skipped). The bytes holding `conditionPromotion.js` out of the
  eager closure did come back (the siege's archetype is a constant), but the closure stays over by the figures above.
  The boot smoke did not run (the strict dist refuses before it). `dist/` removed.

## Registrations owed

- Manifest entry owed: none (the new test file is under `tests/domain`, not `tests/generators`).
- Roster row owed: none (no goods module imported).
- New vocabulary: one getter beside its family in `src/domain/facts/factsOf.js` (`siegeMotion`, beside `crisis`); no dimension or atom
  added to `factVocabulary.js`.

## Named for other seats

1. BAR4-CORPUS-DEF (the chair sends it): DS-DEF-11 "fall short on the watch's wages" where the watch is the Village rota reads
   `guardPayOf` ('unpaid').

## What is left, IN ORDER

1. The close: re-record the three size ceilings under B3 (measured with VERIFY_DIST=1), `docs/content/wiring-census.json`, and the
   writerReach register's rows (WR1).
2. BAR4-CORPUS-DEF: DS-DEF-11 against `guardPayOf`.
3. Nothing else of mine: the three kinds read 0 in both populations, and the guard holds them.

## Instruments (scratchpad; each a few lines; re-made from the probes)

- The census: `census3.sh <tree> <out> 4 --count-only [--seeds seeds.fresh300.txt]` (lane/census-3-2026-11-14's probes, git-archived out).
- The count: `kinds.mjs <tree> <out-dir>` (env `WT=<tree with the detectors>`): every town's dump split to sentences, the three
  detectors of `tests/helpers/safetyKindDetectors.js` against `guardPayOf`, `siegeMotionOf`, `criminalStructureKeyOf` +
  `crimeReadingsOf`; prints instances, towns and the commonest lines; writes `kinds.json`.
- `f3m.mjs` (the key against the income and covert readings), `g525.mjs` / `g525cmp.mjs` (the 525's hashes whole and by top-level field,
  `TREE= OUTF=`), `runall.sh <tree> <label> <list>` (each test file alone).
