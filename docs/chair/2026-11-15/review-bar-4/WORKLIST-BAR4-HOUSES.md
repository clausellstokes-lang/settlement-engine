# WORKLIST · BAR4-HOUSES

7 rows: 7 STANDS.

STANDS: a real contradiction by the strict second check (the page against its own town). WEAK: one loose word (cure where one word settles it; never rewrite a true line to chase a tone). LEFT-BY-BAR3: a row the round before left, with where its measure is. A FLAG IS STILL A CANDIDATE: verify each row by the record before you cure it. The read towns are NOT among the 720: bear one alone to see its record (`docs/chair/2026-11-14/probes/READ-ALL/packets10/seeds.bar4.txt`). The writers below were traced by the chair with `grep -F` of the fixed words under `src/` at 640266f64: check each.

## C37943 · STANDS · bar0-town-calm-rand-23 · Systems/Institutions

> At fixed times he stands in the market square and calls out the proclamations, the prices, and the news.

WHY: The card says 'he' and 'His' and then names a female crier as its connection. The pronouns come from the catalogue's stock description (record institutions Town crier desc), but on the page they misgender the named holder. Nothing reconciles them.
- evidence: At fixed times he stands in the market square ... His employer is the town, or else a guild. — cal-15.txt C37943-C37944
- evidence: Connection: Crier Ghalia al-Din — cal-15.txt C37945
- evidence: Ghalia al-Din (f), the crier @ Town crier — cal-15.txt PEOPLE; record npcs gender "female"
- writer (the words "At fixed times he stands"): src/data/institutionDescVariants.js

## C40862 · STANDS · bar0-town-occupied-rand-22 · Systems/Institutions

> A town with timber to hand supplies the region's building work, and keeps a standing crew to do it.

WHY: The town's woodland is cleared, it imports timber, and it exports no lumber, so it neither has timber to hand nor supplies the region's building. The Forest terrain and the Ancient Grove do not help, because the grove's wood is exported as 'Sacred wood', not building timber.
- evidence: A town with timber to hand supplies the region's building work — cal-16 C40862
- evidence: Managed Woodland (depleted); Timber & Lumber [impaired; its resource Managed woodland depleted] — header LAND
- evidence: imports: ... Timber (local managed woodland cleared) — header TRADE; exports list no lumber
- writer (the words "A town with timber to hand"): src/data/institutionDescVariants.js src/data/institutionDescColour.js

## C39560 · STANDS · bar0-town-occupied-rand-21 · Systems/Institutions

> It answers to no one in particular, but the work gets done.

WHY: The town council, headed by the Church Council's own head, is said to answer to no one, while the page repeatedly says the council answers to the occupiers. This town's Institutions tab carries no 'ordinary times' disclaimer.
- evidence: The forces of another power hold Divoburg, and its own officials take their orders. — cal-16.txt C39323
- evidence: The Church Council answers to the occupiers of Divoburg. — cal-16.txt C39840
- evidence: Nothing large is settled in the hall until the occupiers have approved it. — cal-16.txt C39845
- evidence: Connection: Warden of the Council Luba Kuznetsov, the dean — cal-16.txt C39561 (head of Church Council)
- writer (the words "answers to no one in particular"): src/data/institutionDescVariants.js

## C19810 · STANDS · bar0-hamlet-under_siege-rand-22 · Systems/Economics

> Market vendors and shared dining customs make food distribution visibly civic.

WHY: The Economics tab does carry the caveat 'The descriptions here are of ordinary times. While the siege lasts, a row it touches is marked.' The market is plainly touched (Stopped), though, and this line about market vendors handing out food carries no mark, so it contradicts the page's own Stopped market.
- evidence: Market vendors and shared dining customs make food distribution visibly civic. — cal-07.txt C19810 (Systems/Economics, Food Security, no mark)
- evidence: Stopped by the siege. Monthly or seasonal trading day. — cal-07.txt C19659 (Periodic market)
- evidence: No food comes into Saltocastra by trade. ... hunger is already here. — cal-07.txt C19805-C19807
- writer (the words "shared dining customs"): src/data/cultureProfiles.js src/domain/foodways.js

## C47050 · STANDS · bar0-village-famine-rand-22 · Systems/Economics

> Fermentation, pickling, and drying stretch the harvest through winter.

WHY: The line says preserving carries the harvest through winter, but the village has about three days of food, no granary, and hunger already. 'Preserved foods' among the goods made here does not make that true now.
- evidence: Fermentation, pickling, and drying stretch the harvest through winter. — cal-19 C47050
- evidence: No granary; about three days in the larder. — cal-19 C47049; stores 0.1 months (granary False) — header FOOD
- evidence: Many households go short, and hunger is already here. — cal-19 C47048
- writer (the words "Fermentation, pickling, and drying"): src/data/cultureProfiles.js

## C48079 · STANDS · bar0-village-famine-rand-23 · Systems/Economics

> Fermentation, pickling, and drying stretch the harvest through winter.

WHY: Under an active famine whose failed source is the grain harvest, this unmarked line says preserving stretches 'the harvest' through winter. The page itself says the harvest was lost for a second season, about a month is in store, and the winter ahead will be hungry. Its other harvest rows carry 'Scarce in the famine'; this one does not.
- evidence: Fermentation, pickling, and drying stretch the harvest through winter. — cal-19.txt C48079 (Systems/Economics, Food Security, no mark)
- evidence: Ravengrad has lost its harvest for a second season. — cal-19.txt C47723
- evidence: The grain harvest failed this year ... The winter ahead will be hungry. — cal-19.txt C48381-C48382
- evidence: Harvest Scarce in the famine. — cal-19.txt C48038
- evidence: stores 1 months (granary False) · failed source grain · famine cut 50% — header FOOD
- writer (the words "Fermentation, pickling, and drying"): src/data/cultureProfiles.js

## C33207 · STANDS · bar0-thorp-calm-rand-21 · Systems/Economics

> Its own food is game from the woods.

WHY: THE CHAIR: the same page has every family tilling a holding 'all for the table' (C33132): 'its own food is game' contradicts it || the checker (WEAK): Game is the record's only food source, and the hunting grounds are available, so the sentence matches the record. But the same page has every family tilling a holding for the table, and 'its own food is game' leaves that out. It is a mismatch of emphasis between two true facts, not a flat falsehood.
- evidence: "foodSources": ["game"], "foodwaysLine": "Its own food is game from the woods.", activeChains ["Hunting & foraging"] — record s.economicState.foodSecurity
- evidence: Hunting Grounds (available) — cal-12.txt LAND
- evidence: Each family tills a small holding, all of it for the table. — cal-12.txt C33132 (Subsistence farming)
- writer (the words "Its own food is"): src/domain/foodways.js
