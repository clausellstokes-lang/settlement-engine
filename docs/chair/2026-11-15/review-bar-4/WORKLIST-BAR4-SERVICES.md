# WORKLIST · BAR4-SERVICES

10 rows: 5 STANDS, 3 WEAK, 2 LEFT-BY-BAR3.

STANDS: a real contradiction by the strict second check (the page against its own town). WEAK: one loose word (cure where one word settles it; never rewrite a true line to chase a tone). LEFT-BY-BAR3: a row the round before left, with where its measure is. A FLAG IS STILL A CANDIDATE: verify each row by the record before you cure it. The read towns are NOT among the 720: bear one alone to see its record (`docs/chair/2026-11-14/probes/READ-ALL/packets10/seeds.bar4.txt`). The writers below were traced by the chair with `grep -F` of the fixed words under `src/` at 640266f64: check each.

## C0341 · STANDS · bar0-city-under_siege+famine-rand-21 · Systems/Institutions

> ServicesIron refining

WHY: The smelter's only ore is imported, the siege stops all road imports, and the page marks the iron-using Blacksmiths Impaired, yet Iron refining is offered with no mark. Nothing in the town supplies iron ore (its veins are precious metal).
- evidence: SmelterCrafts / ServicesIron refining — dump Systems/Institutions lines 270-273 (no Impaired, no 'Short of' mark, unlike BlacksmithsCraftsImpaired line 226)
- evidence: Smelter: Smelter runs on imported iron ore — header LAND gaps; record s.resourceAnalysis.gaps (chain 'iron ore', kind 'imported')
- evidence: Enemies are camped around Qingkou, and nothing comes in by road. — cal-01.txt C0067
- writer (the words "Iron refining"): src/generators/services/serviceCategoryTables.js src/data/institutionServices.js src/data/crisisDependence.js

## C0543 · STANDS · bar0-city-under_siege+famine-rand-21 · Systems/Services

> Iron refining

WHY: Same fault as C0341 on the Services tab: the row is unmarked under a siege that cuts its only (imported) ore.
- evidence: Iron refining / Smelt raw ore into pig iron ... / Smelter — cal-01.txt C0543-C0545 (no mark), beside 'Horseshoeing Impaired ... Needs Iron + fuel' C0515-C0519
- evidence: Smelter: Smelter runs on imported iron ore — header LAND gaps
- evidence: Trade by road, gate and water has stopped — cal-01.txt C0093

## C6632 · STANDS · bar0-city-under_siege+famine-rand-23 · Systems/Services

> Street food

WHY: The row offers roasted meats with no mark, in a famine whose failed source is livestock. On the same tab, fresh meat is marked 'Scarce in the famine' and fresh produce carries its own famine wording. The rules say no line under a famine offers the food that failed.
- evidence: Street food / Hot food sold to working people. / Pies, stews, roasted meats. — cal-03 C6632-C6634, no mark
- evidence: Fresh meat / Scarce in the famine. Beef, pork, mutton. — cal-03 C6622-C6623
- evidence: failed source livestock · famine cut 65% · gap 94% · stores 0.1 months — header FOOD
- evidence: availableServices.food: {name: Street food, desc: ... Pies, stews, roasted meats., institution: Daily markets} — record, no crisis mark
- writer (the words "roasted meats"): src/data/institutionServices.js

## C19622 · STANDS · bar0-hamlet-under_siege-rand-22 · Systems/Institutions

> Armed escort

WHY: The page promises that every row the siege touches is marked, and it marks the traveller rows (Lodging, Pasturage), yet escort through dangerous territory, which means travelling out past the besiegers, is printed on offer with no mark. Nothing in the town says escorts still get through.
- evidence: Armed escort — cal-07.txt C19622 and C19705, both printed with no mark
- evidence: Adventuring party escort through dangerous territory. — cal-07.txt C19706
- evidence: Enemies are camped around Saltocastra, and nothing comes in by road. — cal-07.txt C19513
- evidence: Trade by road, gate and water has stopped — cal-07.txt C19533
- evidence: While the siege lasts, a row it touches is marked. — cal-07.txt C19611, C19703
- writer (the words "Armed escort"): src/generators/services/serviceCategoryTables.js src/generators/computeActiveChains.js src/data/institutionServices.js src/data/supplyChainData.js

## C46104 · STANDS · bar0-village-famine-rand-21 · Systems/Institutions

> ServicesLumber milling

WHY: Neighbouring rows carry their shortage marks (Dairy 'Short of livestock', Mill '(scarce)'), but the Sawmill's service prints unmarked on both tabs. The record says it has no timber, and no line of the page anywhere says the sawmill is short.
- evidence: ServicesLumber milling — cal-18 C46104 (Sawmill row, no mark); Lumber milling / Raw logs into planks and beams. — C46158-C46159 (Services, no mark)
- evidence: Sawmill: Sawmill exists but lacks access to timber — header LAND gaps
- evidence: Short of livestock. A dairy ... — cal-18 C46109; ServicesGrain milling (scarce) — C46099
- writer (the words "Lumber milling"): src/generators/services/serviceCategoryTables.js src/data/institutionServices.js src/data/crisisDependence.js

## C6093 · WEAK · bar0-city-under_siege+famine-rand-23 · Systems/Institutions

> ServicesFresh bread

WHY: The Institutions row is missing the mark that the Services tab gives the same service (Impaired). Impaired is not stopped, and the granary still holds a few days of grain, so listing bread as a service is not flatly false. Only the mark is missing.
- evidence: ServicesFresh bread — cal-03 C6093 (Institutions, Bakers row, no mark)
- evidence: Fresh bread Impaired / Needs Grain — cal-03 C6608, C6613 (Systems/Services)
- evidence: Bakers (5-15): Bakers runs on imported grain — header LAND gaps; imports cover None — header STATE
- evidence: Stores: a granary, about three days of grain — cal-03 C5807
- writer (the words "Fresh bread"): src/generators/services/serviceCategoryTables.js src/data/institutionServices.js src/data/crisisDependence.js

## C6795 · WEAK · bar0-city-under_siege+famine-rand-23 · Systems/Economics

> Stone Quarrying

WHY: The income label lacks the 'Stopped by the siege' mark that its sibling incomes and the quarry's own house row carry. It is a bare label of a 2% share by the record, though, and makes no claim of its own. Only the mark is missing.
- evidence: Stone Quarrying — cal-03 C6795 (bare label; record economicState.incomeSources[13] desc "")
- evidence: Pilgrim Trade Stopped by the siege. / Toll Revenue Stopped by the siege. — cal-03 C6794, C6785
- evidence: Stopped by the siege. A stone quarry and its dressing yards ... ServicesCut stone (stopped) — cal-03 C6343, C6345
- writer (the words "Stopped by the siege"): src/data/crisisDependence.js src/domain/display/crisisStoppedRow.js src/pdf/lib/crisisMarksOnPage.js

## C45429 · WEAK · bar0-village-calm-rand-23 · Systems/Services

> Divine healing magic for the sick and injured.

WHY: 'Reliance: None' is not contradicted: one priest's service beside a midwife and an apothecary is not structural reliance, and the tab scopes itself to arcane work. But 'Medical role: absent' sits beside a priest offering divine healing magic in a medium-magic world, and elsewhere the product counts houses of worship as magic suppliers. That is a real but minor mismatch, between a role rating and one service row.
- evidence: Healing / Divine healing magic for the sick and injured. / Priest (resident) — cal-18.txt C45428-C45430; record s.availableServices.healing[4]
- evidence: Medical role: absent — cal-18.txt C45671
- evidence: Reliance on magic: None / Nothing structural at Gankhuubulag depends on arcane work. — cal-18.txt C45668, C45674
- writer (the words "Divine healing magic for the sick"): src/data/institutionServices.js
- writer (the words "Medical role"): src/domain/display/magicProvisionShown.js

## C22221 · LEFT-BY-BAR3 · r2s-plague_onset-thorp-2 (of the 720) · Systems/Services

> the fish stall's morning catch, unmarked, on a spent fishery

WHY: PARTIAL by BAR3-SERVICES (ef0803d97): 15 of 16 towns cured; this one's depleted fishery runs no chain on the record, so the cure's reading misses it.

## C7595 · LEFT-BY-BAR3 · bar0-city-wartime-rand-6 (a read town of REVIEW-BAR-3) · Systems/Resources

> ✓ Fully exploited

WHY: AMBIGUOUS after BAR3-LABELS-3: its cure covers a siege; this town is AT WAR: measure whether a war stops or curtails that field work by the record; cure for that state or strike with the measure.
- writer (the words "Fully exploited"): src/components/new/tabs/ResourcesTab.jsx src/domain/display/economicsCrisisMarks.js
