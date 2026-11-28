# BAR3-DEFECON hand-back (2026-11-15)

Seat BAR3-DEFECON: the GENERATORS' half of BAR3-LABELS's list (its "What is left" items 1, 3 and 4, generator rows).
Start: the labels branch's tip 8b45191a5 (read: `lane/bar3-defecon-2026-11-15` stood at 8b45191a5, as named; the line's
merge 52f0a1684 is in it). Branch `lane/bar3-defecon-2026-11-15`. Worked in a scratch worktree detached at 8b45191a5
(pushed by explicit refspec), beside a second detached tree at 8b45191a5 (display-only commits over 52f0a1684: its records
are 52f0a1684's) for the books.

## The rulings I worked to
- BRIEF-BAR2 (the method) with BRIEF-BAR3's twelve amendments; the chair's prompt (items 1 to 6, each measured first).
- One home for one fact: the temple leaf (`facts/institutions.js :: hasInstitution(record, 'temple')`) for the church of
  the place's own; the crime structure's key (`facts/criminalStructureKey.js :: criminalStructureKeyOf`) for the one ring;
  the Food Security row's carrier rule (`domain/display/foodCarrier.js :: carriersOf`: under a siege nothing comes in but
  by a port's own ships); the income record's own "dominating" cut (`incomeLineSiblings.js :: trueIncomeDesc`, the tithes
  row is the largest) for the theocratic flag.

## Batch 1: the safety and food lines against the town's own state (records moved: DECLARED below)

Measured on the census's 720 at 8b45191a5 by script over `corpus.ndjson.gz` (and the readers' 150 towns, born alone):

| row(s) | the state that makes the line false | false / printing (720) | cure (file :: where) |
|---|---|---|---|
| C20212 C26238 "Everyone comes in by the gates, where the guard sees them." | a house moves goods beneath the walls (the V7 reading, `BENEATH_THE_WALLS`) | 8 / 20 | `safetyProfile.js` Very Safe branch: twin `GATES_KEPT_SMUGGLERS_BENEATH` (`safetyLineTruth.js`) |
| C55188 "The constant monster threat keeps the guard exceptionally well-drilled and alert." | no garrison and no watch (militia volunteers or no one) | 8 / 13 | twin `MONSTER_THREAT_NO_DRILL` |
| C55187 "The walls leave few ways in, and the guard watches them." (the gate line's no-gate twin) | no gate, and in every town it printed no watch or garrison | 8 / 8 | the declared twin reworded: "The walls leave few ways in." |
| C25320 "A quarrel goes to the heads of the oldest families, and most are settled before they come to blows." (the no-watch vantage and its occupation twin) | the safety label reads violence (Dangerous, Critical, Desperate) | 18 / 72 | `quarrelUnderViolence`: "…though many come to blows first." |
| C14930 religious fraud: "The church's moral authority provides cover… corrupt clergy" | no church of the place's own (only access to a neighbour's) | 0 / 31 on the 720; the read town (bar0-hamlet-under_siege-rand-7) | the cover reads the temple leaf; twin `RELIGIOUS_FRAUD_NO_CHURCH` |
| C12387 "No single dominant organisation" (background crime) | the Defense tab's crime structure is "organized" (one ring) | 1 / 30 (r2s-occupied-town-1); the read town | `settleRosterCrimeLines` takes its existing twin also where `oneRingRules` (at assembly, the late re-read) |
| `flags.theocraticEconomy` ("Economic activity flows through religious institutions…", and the flag's other readers) | the tithes row is not the income record's largest, or no religious power stands at Strong or Dominant | 17 / 20 (16 of them printed the note) | settled at assembly in the same late re-read (`settleTheocraticFlag`, `theocraticEconomyStands`) |
| C10009 C19458 the siege's "What is already in store is all there will be until it lifts." | food still grown inside (every one) or made by magic | 31 / 31 | `foodBalance.js`: the note reads the record's own production and magic provision (`siegeStoresNote`) |
| C20434 "Settlement cannot cover ~N lbs … and has no dependable trade route." under a siege | the figure counted an import a closed siege lets in (the tab's Short does not) | 3 / 31 siege printings (r2s-under_siege-town-2, -metropolis-3; the read town) | `foodBalance.js`: `siegeGap` (the figure only; the band and verdict unchanged) |

STRUCK, true by the record:
- C30841 "A court exists, though there is nowhere to hold the guilty." (bar0-city-wartime-rand-11): no prison on the record
  in all 28 towns (the 7 with a "Dungeon delving supply district" hold no prison either). The false line is the Commander's
  SECRET of a prisoner who died "in the cells": NAMED for BAR3-PEOPLE (`npcs[].secrets`: a cell where no prison stands).
NAMED, not mine:
- C30870 "Ask who runs crime here and the answer is one ring." beside "Multiple criminal factions" / "Rival gangs" (6 of the
  26 towns printing that vantage; the read town bar0-city-wartime-rand-11 among them): the ring note follows the structure's
  key, and the key is "organized" there by ruling T28 (`facts/criminalStructureKey.js :: oneOrganisationRules`: one criminal
  power, the read town's "Corrupt City Council", Strong). Whether a rival-gangs house beside one ruling power is one ring is
  the leaf's ruling: for the chair (the leaf is no seat's of mine).
- The crime-wave rows (C17459 "Crime exists but is well-managed" 9 of 33 false; C22802 "It is noticed, and so far it does
  little harm" 37 of 136; C31257 "Thieves are scarce now" 6 of 28): MEASURED, NOT CURED. The `crime_wave` tension is drawn
  by the history at the narratives step, after the economy, so the safety profile cannot read it. Asked the chair
  (amendment 6) for ONE key, `tensions: settlement.history?.currentTensions`, handed to the existing late re-read
  `settleCrimeLinesToSignal` at `assembleSettlement.js` (~line 331); no answer before my hand-back.

Readers' towns: every cured row cured in the town it was read in (bar0-metropolis-calm-rand-7 and town-calm-rand-6 gates;
hamlet-calm-rand-12 monster and few-ways; thorp-calm-rand-8 quarrel; hamlet-under_siege-rand-7 fraud;
city-under_siege+famine-rand-14/-18 stores; -rand-19 shortfall; -rand-15 the no-dominant line).

Files: `src/generators/safetyProfile.js`, `src/generators/safetyLineTruth.js`, `src/generators/economy/foodBalance.js`.
Guard: `tests/domain/bar3DefeconLines.test.js` (10 NOT pairs anchored on the twin that prints instead, the one-ring and
theocratic arms; 4 KEEP pairs): every NOT arm red at 8b45191a5 (run in the base tree), KEEP green; the three corpus walkers
(`negativeAssertionAnchor`, `seedLoopTotality`, `proseDrawnAnchors`) name no line of it (their reds name only the last
round's `bar2*` files, as at the base). Manifest entry owed: none (not under `tests/generators`). Roster row owed: none (no
goods module imported).
RE-KEYED BY IDENTITY (the file's own form, a dated note): `tests/components/defenseNoWatchNoGuards.test.jsx`'s arm counts the
no-watch pool's members WHOLE; the quarrel's declared twin is now a member beside its original (the same absence said). For
the chair's veto: it was RED at my tip (91, needing > 98.1), green at the base.

## Every new or changed line (the veto list)
- " The guard keeps the gates, but smugglers have ways in beneath the walls." : r2r-city-18 (city), r2r-metropolis-29
  (metropolis), bar0-metropolis-calm-rand-7.
- " The constant monster threat keeps everyone here on their guard." : r2r-hamlet-11 (hamlet), r2r-village-6 (village),
  bar0-hamlet-calm-rand-12.
- " The walls leave few ways in." : r2r-hamlet-11, r2r-hamlet-41 (hamlet), r2r-village-8 (village).
- "Nobody here is paid to keep order. A quarrel goes to the heads of the oldest families, though many come to blows first."
  (and the occupation twin's same tail) : r2r-hamlet-19 (hamlet), r2s-insurgency-thorp-0 (thorp), r2s-under_siege-village-2
  (a siege).
- "Fake relics and forged dispensations are sold here in the faith's name, by people who treat it as a commercial
  opportunity." : bar0-hamlet-under_siege-rand-7 (a siege; the only town it reaches of the 870 read).
- The siege's food note, "…What is still grown here and what is already in store are all there will be until it lifts." :
  r2r-thorp-45 (thorp), r2r-village-43 (village), r2s-under_siege-metropolis-3 (a siege); "…What is still grown here, what
  magic makes, and what is already in store are all…" : r2r-village-21, r2s-under_siege-thorp-1, r2s-under_siege-hamlet-2.
- "Settlement cannot cover ~N lbs…" (figure only): r2s-under_siege-town-2 (1,978 -> 2,560), r2s-under_siege-metropolis-3,
  bar0-city-under_siege+famine-rand-19.
- The background-crime twin (existing words) in r2s-occupied-town-1; the theocratic note silenced in 15 towns
  (r2r-metropolis-3, r2r-town-8, r2s-indebted-metropolis-0 …); it stands in r2r-town-54, r2r-town-19,
  r2s-insurgency-town-0.

## The declared moves (field diff by family on the 720, base 8b45191a5 -> tip)
80 towns move: `economicViability.issues[].message`/`.description` 31 (the stores note; the shortfall figure in 2);
`economicState.safetyProfile.guardEffectivenessDesc` 18; `.flags.theocraticEconomy` 17; `.safetyDesc` 16;
`coherenceNotes` 15 (the theocratic note); `economicState.safetyProfile.crimeTypes[].desc` 1;
`history.currentTensions[].description`/`.specificIssue` 1 (r2s-under_siege-metropolis-3: the tension copies the shortfall
text). No draw moves (every cure is a twin in the slot that drew).

## THE 525
36 of the 525 reference configurations move against 8b45191a5 (= 52f0a1684's records), family `economicState` only (hashed
per configuration at both trees through the golden's own corpus, `tests/helpers/goldenMasterCorpus.js`).

## THE BOOKS (at my hand-back; my time budget ran out before the whole set finished)
Run ALONE at my tip, each through `sh scripts/gate-tail.sh` (`runall.sh`): the files that pin a symbol I changed
(`settleCrimeLinesToSignal`, `NO_WATCH_SMALL`, `SAFETY_LINE_SIBLINGS`, `gatesSmugglersLine`, `settleRosterCrimeLines`,
`deriveFoodBalanceAnalysis`, the changed lines: 22 files, 224 tests): GREEN, after one regression cured
(`defenseNoWatchNoGuards`, re-keyed by identity above; `urbanBandInstitutions`' two reds were time-outs under the census's
load and pass alone). Gates: eslint on the touched files 0; the strict-domain gate 0 (1113, ceiling 1113); the type ratchet
0 (a JSDoc regression of mine cured).
THE LAW SUITES (amendment 2's twenty), at my tip: green `rosterDuplicateDraws`, `hookThemeDraws`, `upkeepVocation`,
`layerBoundaries`, `defenceFactReaders`, `noLegacyFactionReaders`, `ruinFilterRoster`, `siteCoherenceRatchet`; RED
`pipelinePinnedMode`, `generationForkCensus` (golden-derived: red at the base on purpose, amendment 10; my cures move 36 of
the 525 besides); `factLayers` was RED (a docks-family name test in my siege gap: `'port'` spelled and the home's reader
aliased): CURED (the home's own `hasInstitution(record, 'docks')`, the route read as `waterAccessKind` maritime and
`tradeRouteTier` major): green alone after. `presumedThings`: the stale rows my rewording left went out by the door's
shrink mode in this commit (3 rows, and 1 of the first register); FIVE FRESH HITS NAMED FOR THE CLOSE (amendment 3), each
true wherever it prints by my measure: foodBalance `siege` "The siege has cut every road in…" (prints only under a siege);
safetyLineTruth `armedForce` " The guard keeps the gates, but smugglers…" (8 towns, Very Safe with walls, gates and a
force); safetyProfile `temple`/`clergy` the church line (now printed only where the temple leaf holds); `walls` " The walls
leave few ways in." (printed only where walls stand). NOT RUN BEFORE MY HAND-BACK (owed to the successor, each alone at the
tip and, if red, at 52f0a1684): `observedShapeReaders`, `writerReach` (my late re-read adds REAL readers of
`incomeSources` and `powerLabel` at assembly: a frozen reach row may read stale: NAMED, amendment 4), `proseComposed`,
`proseEntryContradiction`, `proseWiringCensus`, `engineCoreLazyEdge` (safetyLineTruth now imports
`facts/criminalStructureKey.js`), `tuningRegister`, `chainPrintSites`; and re-runs of `presumedThings` after the shrink.
THE INVENTORY DIFF: the after-census was in flight at my hand-back (`c-after/`, my tip before the last two walker cures,
which change no line in the 720 but a coastal crossroads under siege): `inventory_diff.py before.json after.json` is OWED.
THE BOOKS MY CURES MOVE (named, not re-taken): the 525 (36, `economicState`); the presumed-things fresh five (above).

## What is left, IN ORDER
1. THE CRIME-WAVE ROWS (the prompt's item 1 head): C17459 (9 of 33), C22802 (37 of 136), C31257 (6 of 28), measured above.
   Waits on the chair's word on the one assembly key. With it: in `settleCrimeLinesOnly` (safetyProfile.js) settle
   `safetyDesc`'s "Crime exists but is well-managed." lead, `economicDragDesc`'s "It is noticed, and so far it does little
   harm." and the occupation line's "Thieves are scarce now;" to twins where `crimeWaveStands` (the labels leaf's reading of
   `history.currentTensions`); the label is not touched.
2. L3's generator rows: "Complete production chain in place" over a vulnerable chain (C7614, `resourceGenerator.js ::
   buildViabilityReport`): NOTE the ruling R3-CODE-C-2 in the function's header ("no map between this model and the chain
   model is built, the row reads this analysis's own data"): the chain's "vulnerable" is the chain model's; ask the chair
   before reading it. "Grain export" / "Surplus food" (C7514 C18969 C7264) are the outputs of `src/data/supplyChainData.js`
   (no seat's of mine) printed by the display: NAMED. The depleted commodity (C32888 C32884 C30646; L5's dates) not measured.
3. L5's first header flag (hired forces none beside a Hired blades house whose captain sits on the War Council): not reached.
4. C30870 (above): the chair's ruling on T28 beside a rival-gangs house.

## Instruments (scratchpad; each is a few lines)
- The census: `census3.sh <tree> <out> 4 --count-only` from `lane/census-3-2026-11-14`'s probes, git-archived out;
  `inventory.py` / `inventory_diff.py` from the chair's READ-ALL probes. Births alone: `births.mjs` (TREE, OUT, SEEDS).
- The measures (`m/`): `m1.mjs` `m2.mjs` `m3.mjs` `m4.mjs` (each row's state over a corpus; `TREE=<tree> CORPUS=<gz>`),
  `theo.mjs` (the flag's towns), `fdiff.mjs <a.gz> <b.gz>` (the field diff by family), `g525.mjs` (the 525's hashes,
  `TREE= OUTF=`), `runall.sh <tree> <label> <files>` (each file alone through gate-tail).
