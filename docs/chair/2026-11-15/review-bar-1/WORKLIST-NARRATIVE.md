# READ-ALL worklist · NARRATIVE · the told history: origin prose and the narrative tables

9 flagged sentences (HIGH 1), read at the joined line e5b421802 on 2026-11-14. EACH IS A CANDIDATE: a reader judged it against ONE town's facts (`town read in`): verify it by the record before you cure it. `towns` = how many of the 720 census towns print the sentence (names and figures aside): the measure of its width, not of its falsity. The machine form is `WORKLIST-NARRATIVE.json` beside this file (each row's `fold` is its key in an inventory).

## YOUR FILES (no other seat holds them)

- `src/generators/narrativeGenerator.js`
- `src/generators/narrative/settlementOriginProse.js`
- `src/data/narrativeData.js`
- `src/data/stressInstitutionEffects.js`
- `src/generators/narrativeText.js`
- `src/domain/facts/founder.js`
- `src/generators/narrative/foundingRowAdmits.js`

## By file (flagged sentences · towns printing, summed)

- `src/data/narrativeData.js` · 5 · 50
- `src/data/stressInstitutionEffects.js` · 3 · 43
- `src/generators/narrativeText.js` · 1 · 0

## By writer (file :: function, table or pool; flagged sentences · towns printing, summed)

- src/data/narrativeData.js :: STRESS_NOTES.under_siege · 1 · 19
- src/data/stressInstitutionEffects.js :: STRESS_INSTITUTION_EFFECTS.famine · 1 · 16
- src/data/stressInstitutionEffects.js :: STRESS_INSTITUTION_EFFECTS.excludes · 1 · 15
- src/data/narrativeData.js :: STRESS_DESCS.wartime · 2 · 14
- src/data/narrativeData.js :: STRESS_NOTES.occupied · 1 · 14
- src/data/stressInstitutionEffects.js :: STRESS_INSTITUTION_EFFECTS.needs · 1 · 12
- src/data/narrativeData.js :: STRESS_DESCS.under_siege · 1 · 3
- src/generators/narrativeText.js :: PRESSURE_SENTENCES · 1 · 0

## The sentences, HIGH first, then widest first

| sev | towns | id | section | town read in | sentence (as that town prints it) | what the reader said | writer |
|---|---|---|---|---|---|---|---|
| HIGH | 7 | C2758 | Summary/Overview | bar0-city-wartime-rand-2 | Khanserai is prosperous in a way that feels wrong. | says prosperous; STATE prosperity is Poor and C2771/C2772 say Poor while the war lasts | src/data/narrativeData.js (line 376 at e5b421802) STRESS_DESCS.wartime |
| MED | 19 | C5934 | World/History | bar0-hamlet-under_siege-rand-2 | The founders chose this place for its trade, water and good ground. | founders chose it for its trade and good ground; trade access is isolated with no imports or exports, and it began as a hidden refuge | src/data/narrativeData.js (line 414 at e5b421802) STRESS_NOTES.under_siege |
| MED | 16 | C2103 | World/NPCs | bar0-city-under_siege+famine-rand-2 | Secret: Sold the settlement's emergency grain reserves three months ago at peak price and reported them destroyed in a flood | names a flood that destroyed emergency grain; no flood is in CRISIS, QUARRELS, TENSIONS or PAST, and the granary holds 5.5 months of stores | src/data/stressInstitutionEffects.js (line 77 at e5b421802) STRESS_INSTITUTION_EFFECTS.famine |
| MED | 15 | C1864 | World/NPCs | bar0-city-under_siege+famine-rand-2 | Their family left last week | family 'left last week' under an active siege with gates shut; nothing has come through the gates since the siege began | src/data/stressInstitutionEffects.js (line 44 at e5b421802) STRESS_INSTITUTION_EFFECTS.excludes |
| MED | 14 | C11128 | World/History | bar0-town-occupied-rand-2 | The founders came here to be far from other people's rule. | founders came 'to be far from other people's rule'; FOUNDING says a merchant consortium that needed a waypoint and decided to own it | src/data/narrativeData.js (line 425 at e5b421802) STRESS_NOTES.occupied |
| MED | 12 | C2178 | World/NPCs | bar0-city-under_siege+famine-rand-2 | Secret: Is receiving grain shipments through a covert route and selling them at triple the official price after dark | grain shipments arriving by a covert route; siege shuts gates and roads and no food comes in by trade (FOOD brought in 0%) | src/data/stressInstitutionEffects.js (line 102 at e5b421802) STRESS_INSTITUTION_EFFECTS.needs |
| MED | 7 | C2759 | Summary/Overview | bar0-city-wartime-rand-2 | The forges work past dark, the warehouses are full, the coin is moving, and all of it points one direction, toward a war that is not fought here but is paid for here. | warehouses full, coin moving, forges busy contradicts Poor prosperity, food deficit, and the resource-scarcity tension | src/data/narrativeData.js (line 376 at e5b421802) STRESS_DESCS.wartime |
| MED | 3 | C0014 | Summary/Overview | bar0-city-under_siege+famine-rand-2 | A runner comes out of the small side gate, sees your group, stops. | a runner comes out of the gate and meets arrivals; under siege nothing comes in or goes out by road, gate or water | src/data/narrativeData.js (line 163 at e5b421802) STRESS_DESCS.under_siege |
| MED | 0 | C2766 | Summary/Overview | bar0-city-wartime-rand-2 | Every capable pair of hands Khanserai could spare, and several it could not, has gone to the war; what remains is losing people and resources by attrition (a workshop closed for want of a master, a field unsown for want of a back) while Merchant oligarchy reports the settlement loyal and does not report the rest. | says every capable pair of hands has gone to the war; the Crisis tab says conscription took a third of working-age men | src/generators/narrativeText.js (line 250 at e5b421802) PRESSURE_SENTENCES |
