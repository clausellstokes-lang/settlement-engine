# REVIEW INTAKE — lane record (2026-11-06)

Lane `lane/review-intake-2026-11-06`, cut from master `a07ee4e0a`. Brief: the chair's
BRIEF-REVIEW-INTAKE-2026-11-06 (three outside reviews of the generator, the owner's note on
mills). Seat: Opus 5.5, builder.

## Unit 1 — the measurement (1,000 soak settlements, `soak1k-0 … soak1k-999`, `cellFor(i)`, born as `soak-review/corpus.mjs :: birth` births them)

Scratch harness (uncommitted): it walks each born record and counts the five items below.

| item | measured on the 1,000 | reading |
|---|---|---|
| (a) service rows whose `institution` is a PROXY_SERVICE_HOSTS key | **4,195 rows in 974 settlements**. By host: Housing (180-1000) 637 · Housing (1000-5000) 632 · Dwellings (80-180) 513 · Dwellings (4-16) 433 · Multiple water sources 419 · Sewage system 342 · Massive prison 322 · Dwellings (17-80) 252 · Access to external mill / Common grazing land / Farmland 167 each · Water source 144. By tier: thorp 667 · hamlet 496 · village 799 · town 937 · city 656 · metropolis 640. Worst rows: Housing → "Food and drink (all grades)" 666; Massive prison → "Criminal trials" 114, "Civil disputes" 114, "Notary services" 94; Farmland / Common grazing land → "Grain milling" 167 each; Sewage system → "Food and drink" 160 | CONFIRMED, live in every tier |
| (b) 'Water Dependency' entries | **0 in `economicViability.warnings`** (the brief's location is wrong: the entries carry severity `dependency`, so `generateEconomicViability` files them under **`economicViability.dependencies`**, counted by `metrics.dependencyCount` and the summary sentence). In `dependencies`: **1,569 entries in 476 settlements**. By industry title: Mills 355 · Brewery 246 · Sawmill (commercial) 233 · Dyer 218 · Mill 121 · Tanner (established) 108 · Sawmill 107 · Brewer 73 · Tannery 68 · **Guild governance 21 · Guild consortium 19** (the name matcher's second arm: `"dyers' guild".includes("guild")`). Split: **every one of the 1,569 sits in a place WITH a water row**; 502 of them also have a river or port route (the matcher reads the route only when terrain is absent); 0 have river/coast terrain. 18 settlements' on-screen verdict reads "Viable with critical dependencies" ONLY because of these entries (`dossierViewModel.js` counts `dependencies`) | CONFIRMED, and wider than the brief: it does reach the screen, through the verdict label |
| (c) "X exists but lacks access to Y" gaps | **6,568 lines in 982 settlements**. Class of the input: on the imports list (`imports.critical`) **3,915** · in `availableResources` **796** · supplied by a local producer (`localInstitutionSupplies` rule) **625** · none of these **1,232** (all 1,232 on a terrain whose vocabulary allows the input; it simply was not rolled nearby). Commonest: Potter→clay [imported] 353 · Smelter→copper ore [imported] 347 · Brickmaker→clay [imported] 340 · Access to external mill→grain [local] 274 · Stone quarry→stone [local] 209 · Bakers→grain [none 180 / imported 174] · Market square→desert_salt [imported] 120 | CONFIRMED; 1,421 of the lines (available + local) are not gaps at all |
| (d) one roster, the same text on two NPCs | same `secret.what` on two NPCs: **459 rosters**; same `goal.short`: **634 rosters** | CONFIRMED (instrument only, unit 5) |
| (e) receipt trace flag vs record | `generationCoherenceReceipt` → provenance evidence reads "No step trace was persisted" while `simulationTrace` is present: **1,000 of 1,000**. Cause: `steps/assembleSettlement.js` builds the receipt (line 336) BEFORE it copies `ctx.simulationTrace` onto the settlement (line 350) | CONFIRMED live (instrument only, unit 5; the cure is a line-order move the chair rules — it moves every golden row) |

None of (a), (b), (c) measures 0, so all three cures proceed.
