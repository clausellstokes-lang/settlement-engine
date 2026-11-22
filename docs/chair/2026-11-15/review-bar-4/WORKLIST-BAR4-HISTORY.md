# WORKLIST · BAR4-HISTORY

5 rows: 1 STANDS, 1 WEAK, 3 LEFT-BY-BAR3.

STANDS: a real contradiction by the strict second check (the page against its own town). WEAK: one loose word (cure where one word settles it; never rewrite a true line to chase a tone). LEFT-BY-BAR3: a row the round before left, with where its measure is. A FLAG IS STILL A CANDIDATE: verify each row by the record before you cure it. The read towns are NOT among the 720: bear one alone to see its record (`docs/chair/2026-11-14/probes/READ-ALL/packets10/seeds.bar4.txt`). The writers below were traced by the chair with `grep -F` of the fixed words under `src/` at 640266f64: check each.

## C24951 · STANDS · bar0-metropolis-calm-rand-21 · World/History

> A surge of magic no one could contain marked the temple district and everyone caught in it, and what it did has never entirely worn away

WHY: The live wild-magic tension is the legacy of the PAST event 'The Wild Magic' (same template, and the hooks speak of 'the affected district', singular). The same History tab places that one surge in the temple district and, a few lines up, in the merchants' quarter. Nothing in the town says the surge struck two districts.
- evidence: A surge of magic no one could contain marked the temple district — cal-09.txt C24951 (World/History, The Wild Magic); record s.history.historicalEvents[The Wild Magic].description
- evidence: An uncontrolled surge of magic left its mark on the merchants' quarter — cal-09.txt C20952, C24923; record s.history.currentTensions[type wild_magic].description
- evidence: The affected district is slowly spreading its strangeness — record s.history.currentTensions[wild_magic].plotHooks
- writer (the words "A surge of magic no one could contain"): src/data/historyDescVariants.js

## C53689 · LEFT-BY-BAR3 · (a wide-read town: seeds in docs/chair/2026-11-14/probes/READ-ALL/packets9/seeds.wide.txt; the row in docs/chair/2026-11-15/review-wide/) · World/History

> two events each given as what shaped the city (the pilgrimage; the Interregnum)

WHY: LEFT by BAR3-PLACES-3: not located in the 720: bear its read town first.

## C26792 · LEFT-BY-BAR3 · (see BAR3-PLACES-3-HANDBACK.md, the first holder's item 5) · World/History

> …the right to rule is widely questioned…

WHY: LEFT by BAR3-PLACES-3: the page shows the council endorsed; the cure needs the late record (BRIEF-BAR3 amendment 6): ONE LINE to the chair with the one key first.
- writer (the words "widely questioned"): src/data/historyData.js

## C14176 · LEFT-BY-BAR3 · (3 of 161: see BAR3-POWERS-HANDBACK.md) · Systems/Power

> Behind <seat> by too much to challenge openly, so they get their way through petitions and procedure instead.

WHY: PARKED by BAR3-POWERS: `src/generators/power/factionStanding.js` rank 1 prints beside a Contested seat in 3 of 161 towns; the display-side file was not that seat's: it is yours this round.
- writer (the words "too far behind to challenge"): (untraced: trace it first)

## C26840 · WEAK · bar0-metropolis-calm-rand-22 · Systems/Power

> Thieves' Guild works against Grand Guild Consortium, and Grand Guild Consortium is winning.

WHY: The Consortium does have the upper hand: it is Dominant against a Minor Thieves' Guild and hunting it in earnest. But 'is winning' claims more than the record's own narrative ('not catching all of it ... does not go away') and sits badly beside the page's crime-wave line. It overstates the case rather than being plainly false.
- evidence: Grand Guild Consortium (Dominant) ... Thieves' Guild (Minor) — cal-10.txt GOVERNMENT; power 38 vs 12 in record s.powerStructure.factions
- evidence: "captureState": "adversarial", "narrative": "Grand Guild Consortium is hunting Thieves' Guild in earnest but not catching all of it; Thieves' Guild pulls back and regroups, and does not go away." — record s.powerStructure.factionRelationships
- evidence: Crime is rising faster than those in charge can answer it — cal-10.txt C25027 (crime-wave tension)
- evidence: stability: Unstable (pervasive organized crime) — cal-10.txt GOVERNMENT
- writer (the words "is winning"): src/generators/factionDynamics.js src/data/dossierStateProse/warFaith.generated.js src/data/dossierStateProse/stressors.generated.js src/data/people/dmPowerLines.js
