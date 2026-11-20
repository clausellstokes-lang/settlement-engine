# BAR6-CULTURE · HAND-BACK (the culture, the history, the faith and the general desk)

Base `afa46d644` (the joined line, as named). Branch `lane/bar6-culture-2026-11-16`. Every count below is my auditors'
own runners (`runC.mjs`, `runE.mjs`, `runF.mjs`, `runG.mjs`) over PAGE-COPY renders of the 150 wide-read towns, the
census's 720 and the fresh 300, at the base and at the tip, my writers only (a 6a instance counts when its line is in one
of my files). The renders and the runners' outputs live outside every tree; how to re-make them is the last section.

## THE RULES

| rule | the two readings, and where | the one fact made / read | BEFORE 150 · 720 · 300 (instances/towns) | AFTER 150 · 720 · 300 | cured by the one change / line by line | named exclusions | guard and positive control |
|---|---|---|---|---|---|---|---|
| 10g-span (one event, one length) | the timeline's `{duration}` (`historyGenerator.js :: generateEventNarrative`, one to five) against the tensions' fixed "three" (`historyTemplate.js :: buildCurrentTensionTokens`) | `historyData.js :: ownEventDuration`, read through `placedTensionTokens`: the tension copies its own past event's length | 1/1 · 0 · 0 | 0 · 0 · 0 | the one change | none | `tests/domain/bar6CultureLines.test.js`; control C133674 built as a record (the detector fires on 2 and three) |
| 10g-legacy (a rebuilding after a blow that destroyed nothing) | DS-GEN-16 `LEGACY-RECOVERED` v2 ("Much of what stands … was built after the X") against the event's kind on `history.historicalEvents` | NEW ATOM `legacy ruin` (`src/domain/facts/legacyRuin.js`: the top legacy's event is a `disaster` or a great fire, flood, plague, siege or raid, past occupation); v2 declares it; two twins `no legacy ruin` | 6/6 · 24/24 · 6/6 | 0 · 0 · 0 | the one change (display only) | none | the guard; control C55011 built (the detector fires; the atom refuses) |
| 6d-court (a hall of justice where no court sits) | DS-GEN-17 `ADMINISTERED` (the key's `hasCourtSystem`) against the Defense tab's Legal Infrastructure row (`defence.js :: courtHoldersOf`, the live roster). The `court` atom's town-hall name test disagrees with that row BY DESIGN (37 of the 720, its own comment) | NEW ATOM `court sits` (factsOf getter over `courtHoldersOf`); the three court lines declare it (and `prison`, and `court` for the lexicon); a twin `no court sits` | 1/1 · 2/2 · 1/1 | 0 · 0 · 0 | the one change (display only) | none | the guard; control C161931 (the line's claim, its declaration, the twin) |
| 6d-fields (fields credited where nothing is farmed) | the culture's flavour sentence (`cultureProfiles.js`) against the food record's sources (`foodways.js :: SOURCE_WORDS`) | the sentence names its grain ("Maize and other grain from intensive plots …"), so the composer keeps it only where grain feeds the place | 8/8 · 20/20 · 9/9 | 0 · 0 · 0 | one reworded line (moves the stored `foodwaysLine`) | none | the guard (no field claim where no grain) |
| 6a culture (a size word below its band) | the culture template's arch detail and foodways against the tier | the existing `tier` band: neighbourhoods `tier: ≥ town` (was `≥ village`), with its twin to a village; the bazaar's neighbourhood shrines `≥ town` with a new twin; street kitchens `≥ village` | 1/1 · 6/6 · 2/2 (6a-size, my writers) | 0 · 0 · 0 | line by line (three rows) | none | the guard (no town word in a smaller place's printed detail; no hamlet street kitchens); control C209939 |
| 6a-w (WEAK, counted apart) | as above, one loose word | as above, and the arrival's "Nobody in the street pays attention" takes a hamlet twin (`tier: ≤ hamlet`, draw-free) | 8/8 · 60/55 · 17/14 | 4/4 · 38/36 · 4/4 before the arrival twin (the rest are DS-DEF lines, BAR6-DEFDESK's, and the arrival line, cured after these renders: the guard holds it) | | | the guard (no hamlet arrival names a street) |
| 9e.heresy, ruling HR2 | the Faith tab's DS-FTH-4 heresy pools (`safetyProfile.flags.heresySuppression`) against the Magic tab's "Religious acceptance" (the envelope, `magicProfile.js :: deriveReligiousAcceptance`) | `src/domain/facts/heresyStance.js`: the row reads the flag at print (hunted or preached → hostile); the stored envelope is left as it is | 1/1 · 1/1 · 0 | 0 · 0 · 0 | the one change (display only) | none | the guard; control C84616 built as a page (law9 fires on "indifferent", not on "hostile") |
| B4 (LAW 5 widened, my files) | auditor G's inventory | declarations on the atoms that answer each class; one twin; reviewed reasons in my table | 225 lines (cultureProfiles 62, general desk 45, war-and-faith desk 49, stressors desk 19, narrativeData 33, historyData 17) | 167 in the inventory, every one in `docs/chair/2026-11-16/bar6/AUDIT/tables/G.exclusions.BAR6-CULTURE.json` with its reason: **0 left** | 58 by a declaration, a twin or a rewording | 167 reviewed reasons (by class: the lexicon's false hits, "books" as ledgers, feast days; a pool keyed by the state it names, an occupation's troops, a pilgrim season; a raw culture row printed only at a town or larger) | runG over the tip |

Apart (never law): 10g-legacy-answer (v1 "what the town built in answer still stands", WEAK) 1 · 4 · 1 → 2 · 4 · 0.

## B3: MY CONTROLS BETWEEN THE RENDERS (REGRESS over the 150)

`regress.py r-base-150 r-tip-150 <my seven rows> --list`: rows 7 · SAME 3 · CHANGED 0 · GONE 4.
- GONE C113231 bar0-metropolis-calm-rand-31 · Intensive plots, terraces, raised fields, and tribute redistribution support dense populations.
- GONE C161931 bar0-town-calm-rand-30 · The town is visibly governed: a hall of justice, a gaol. (now: "… keeps a gaol of its own, though no court sits here to try anyone.")
- GONE C209939 bar0-village-calm-rand-41 · Causeways and managed water divide the settlement into organized neighborhoods.
- GONE C55011 bar0-city-wartime-rand-32 · Much of what stands in Kaltenturm now was built after the economic divide … (now: "… came through the economic divide and set itself to rights afterwards …")
- SAME C84616 bar0-hamlet-calm-rand-32 (the hunt line is true; the fault was its pair): the Magic row CHANGED, "Religious acceptance · indifferent" → "Religious acceptance · hostile" (the one row of the 150 that moved).
- SAME C18731 bar0-city-under_siege+famine-rand-33 (WEAK; its pair already read "Hostile outside the faith's own houses", unchanged).
- SAME C133674 bar0-metropolis-calm-rand-36 (the event line is the record's): its pair CHANGED, "A sickness moved through the settlement for three seasons" → "for 2 seasons" (the one tension of the 150 that moved).

## THE VETO LIST (every new or changed line, with towns it is read in at the tip)

New vocabulary: `legacy ruin` (beneath `danger coming`, the history's own presence) and `court sits` (beneath `court`); their leaves `legacyRuin.js` and the getter over `defence.js :: courtHoldersOf`; and `heresyStance.js` (no atom).
1. DS-GEN-16 LEGACY-RECOVERED v3 `[street · no legacy ruin]` "{settlement} came through the {calamity} and set itself to rights afterwards; that legacy is {timeband_age}." · bar0-city-wartime-rand-32 (and every non-ruin legacy town).
2. DS-GEN-16 LEGACY-RECOVERED v4 `[elder · no legacy ruin]` "The {calamity} is behind {settlement} now, and the town that came through it is the one that stands; that legacy is {timeband_age}." · bar0-town-calm-rand-29, bar0-town-calm-rand-41.
3. DS-GEN-17 ADMINISTERED v4 `[visitor · no court sits]` "{settlement} keeps a gaol of its own, though no court sits here to try anyone." · bar0-town-calm-rand-30.
4. cultureProfiles mesoamerican foodways, reworded: "Maize and other grain from intensive plots, terraces, and raised fields, with tribute redistribution, support dense populations." · bar0-city-wartime-rand-28, bar0-town-occupied-rand-32.
5. cultureProfiles south-asian arch twin (new): "shaded doorways open onto the ground between the houses" · bar0-hamlet-calm-rand-27.
6. cultureProfiles mesoamerican arch twin (existing, now reaching villages): "a raised path and a water channel run between the house compounds" · bar0-thorp-calm-rand-27, bar0-hamlet-under_siege-rand-31, bar0-village-calm-rand-41.
7. The plague tension's length: "A sickness moved through the settlement for 2 seasons …" (the event's own number) · bar0-metropolis-calm-rand-36.
8. The Magic tab's row under the heresy flag: "Religious acceptance · hostile" · bar0-hamlet-calm-rand-32.
9. narrativeData ARRIVAL_SCENES.ordinary twin (new, after the renders): "A child runs past you on the road into {name}, … Nobody else on the road pays attention." · thorps and hamlets only (16 of the 720 drew the original).
10. Rewordings that drop a size word (batch 4; a declaration there thinned a partition of the projection's authoring bill): DS-GEN-1 crime_wave "… warned twice before nightfall where not to go …", "Whatever holds {settlement} after dark …"; DS-GEN-9 "… the oldest houses still show it.", "… still shows in its houses and habits.", "… the place where it happened has never been rebuilt.", "{settlement} has parts that do not match each other …"; DS-POP-1 "… Whole rows of houses stand empty." Display only.
11. The declarations of batch 2 change no text; their list is the commit `21a5f2de1` and my table.

## THE BOOKS MY CURES MOVE (named, not re-taken)

- THE 525: 42 of 525 reference configurations move against `afa46d644`: `culturalIdentity` 42 (its `architecturalDetail` 21; the materialized foodways sentence), `economicState` 35 (`foodSecurity.foodRecord.foodwaysLine`). No history, arrival or other field moves in the 525 (measured before the arrival twin: it reaches thorps and hamlets of the grid that drew that line). The goldens and the golden-derived files red for that.
- `docs/census/declarations/STRESS_DESCS.json` and `CULTURE_PROFILES_DAILY.json` (the Phase A ledgers): `tests/domain/facts/census2dTables.test.js` and `census2eTables.test.js`, arms "every ledger line is at its path, verbatim" (the reworded mesoamerican foodways row) and "every row declares what the ledger says" (the ten STRESS_DESCS rows that now declare a tier). The ledger's door is the close's.
- `tests/domain/facts/textOf.test.js` "the arrival tables carry their declarations": the declared-row count 189 → 191 at the second push (the two bare rows of batch 2 became declared), and one more with the arrival twin.
- `docs/content/wiring-census.json`: STALE AT THE BASE (four stamped composers moved by the round before); I re-took it locally only to regenerate my desks' files and restored it each time (a re-taken census moves none of the generated files at the base: measured). My annex edits move its rows too.
- The build guard's register (BAR6-GUARD, ruling BG1): my declarations make its rows for my lines stale.
- Red at the base and at my tip with the same message (named, not chased): `tests/lint/factLayers.walker.test.js` (the `legalHouse` leaf touches `availableServices`), `tests/components/publicProseEquality.test.jsx` (soak1k-5 services), `tests/domain/worldFactRederive.test.js` (A7), `tests/domain/facts/census2eTables.test.js` (POLITICAL_FLAVOR), `tests/lint/proseComposed.walker.test.js` (A0b, GUARD THE GUARD), `tests/data/dossierStateProseProjection.contract.test.js` (the stale census).

## THE NET (at the tip, then every red file again at the base)

Run: the seventeen law suites, BRIEF-BAR3's three, BRIEF-BAR4's nine, BRIEF-BAR5's four, the BAR5 guards, my guard, and
every test file that pins a symbol I changed (63 files). `npm run typecheck:domain:strict`, `npm run typecheck:ratchet`
and eslint on my changed files ran in every lane push's hook (exit 0) and eslint by hand on each batch (exit 0).

- MY REGRESSIONS, CURED BEFORE HAND-BACK: `tests/ui/generalDeskTabFlow.test.js` (the anchors' spec now hands
  `factsOf(fixture)`, as drawnProse.js asks); `tests/lint/tuningRegister.walker.test.js` (my named number, then a bare
  decimal: the half is written `* 2 >= 1`); `tests/data/dossierStateProseProjection.contract.test.js` "names the
  authoring bill" and "reads NOTHING from a partitioned pool" (my declarations on a partition's last lines: those lines
  are reworded instead, or carry a reason).
- RED AT MY TIP ONLY, STORED FIGURES MY DECLARED CURES MOVE: census2d/census2e's two ledger arms, textOf's count (above).
- RED AT BOTH, SAME ARM (the base's, not chased): `dossierStateProseProjection.contract` (nine arms, the stale census),
  `tailHouses1Gaps`, `census2eTables` POLITICAL_FLAVOR, `generationForkCensus`, `pipelinePinnedMode`, `tieProseDeclared`,
  `factLayers.walker`, `observedShapeReaders`, `presumedThings`, `proseComposed`, `proseCorpusBytes`,
  `proseEntryContradiction`, `proseTasteCorruption`, `proseWiringCensus`, `tuningRegister` ("matches the committed
  inventory exactly"), `writerReach`, `publicProseEquality`, `worldFactRederive`. A count inside one of these that my
  cure moved (presumedThings, writerReach, observedShapeReaders, proseCorpusBytes) is the close's to re-take with the rest.
- GREEN: my guard `tests/domain/bar6CultureLines.test.js` (positive controls and the zero over the 720), the BAR5
  guards, and the rest of the net.

## REGISTRATIONS OWED

- New test file `tests/domain/bar6CultureLines.test.js` (under `tests/domain`: no mutation-manifest entry).
- No new import of a goods module. New modules `src/domain/facts/legacyRuin.js` and `heresyStance.js` import nothing; `factsOf.js` now imports `courtHoldersOf` from `defence.js`, which it already imported.

## WHAT IS LEFT, IN ORDER

1. The WEAK 6a-w lines of the defence desk ("which few streets", "a knife in an alley"): BAR6-DEFDESK's (its size atom).
2. 10g-legacy-answer (v1 "what the town built in answer still stands"), WEAK, apart: 4 towns of the 720 print it after an event that destroyed nothing. Declaring it `legacy ruin` too leaves two twins there (three lines would be the floor B7 asks of a twin's pool): the next seat's call.
3. HR2's stored envelope `magicProfile.religiousAcceptance` is left as it is; `magicProfile.js`'s summary text ("Religious acceptance: …") still prints the envelope's word where it is printed (not my file).
4. Of the 164 reasons, the culture's raw rows (printed only at a town or larger) are the largest group; a twin a row would let them leave by declaration instead.

## FOR THE OWNER, IN PLAIN WORDS

A town's history no longer tells one plague as lasting two seasons in one place and three in the next; a city is no
longer said to have been rebuilt after a quarrel that knocked nothing down; a town with only a gaol is no longer called
"visibly governed: a hall of justice"; a herding metropolis is no longer said to live off its terraced fields; a village
no longer has neighbourhoods; and a hamlet whose faith hunts magic as heresy no longer reads, on its Magic tab, that the
faith is indifferent to it. Every line of my files that presumed a size, a trade, a road or an office now says what it
presumes, or carries the reason it is true where it prints. The new wordings above are yours to veto.

## HOW THE INSTRUMENTS ARE RE-MADE

PAGE-COPY (`census3.sh <tree> <out> 3 --seeds <file> --count-only`, the seeds: `seeds150` = `bar0-<shape>-rand-<27..41>`,
`seeds.txt`, `seeds.fresh300.txt`); the runners `node docs/chair/2026-11-16/bar6/AUDIT/run{C,E,F,G}.mjs <render> <out.json>`;
my rules counted over their outputs with a writer filter (a 6a line counts when its text is in one of my files); REGRESS
over my seven rows. Four workers with anything else beside them ran this container out of memory twice: three, alone.
