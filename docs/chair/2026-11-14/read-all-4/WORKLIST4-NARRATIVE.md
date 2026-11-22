# READ-ALL worklist · NARRATIVE · the told history: origin prose and the narrative tables

2 flagged sentences (HIGH 0), read at the joined line e5b421802 on 2026-11-14. EACH IS A CANDIDATE: a reader judged it against ONE town's facts (`town read in`): verify it by the record before you cure it. `towns` = how many of the 720 census towns print the sentence (names and figures aside): the measure of its width, not of its falsity. The machine form is `WORKLIST-NARRATIVE.json` beside this file (each row's `fold` is its key in an inventory).

## YOUR FILES (no other seat holds them)

- `src/generators/narrativeGenerator.js`
- `src/generators/narrative/settlementOriginProse.js`
- `src/data/narrativeData.js`
- `src/data/stressInstitutionEffects.js`
- `src/generators/narrativeText.js`
- `src/domain/facts/founder.js`
- `src/generators/narrative/foundingRowAdmits.js`

## By file (flagged sentences · towns printing, summed)

- `src/generators/narrativeText.js` · 2 · 2

## By writer (file :: function, table or pool; flagged sentences · towns printing, summed)

- src/generators/narrativeText.js :: PRESSURE_SENTENCES · 1 · 1
- src/generators/narrativeText.js :: famineFoodIsPower · 1 · 1

## The sentences, HIGH first, then widest first

| sev | towns | id | section | town read in | sentence (as that town prints it) | what the reader said | writer |
|---|---|---|---|---|---|---|---|
| MED | 1 | 00068 | Summary/Overview | r2s-monster_pressure-village-3 | Tallkhel has drawn its edges inward (fields left unworked, a mill kept turning for its buyers) trading the harvest it needs for a perimeter the able-bodied can actually hold. | 'trading the harvest it needs' for a perimeter held by the able-bodied; FOOD shows surplus 17%, DEFENCE shows no walls and no militia | src/generators/narrativeText.js (line 183 at e5b421802) PRESSURE_SENTENCES |
| MED | 1 | 00860 | Summary/Overview | r2s-famine-metropolis-1 | Since the fishing failed, whoever holds the food in Hongji holds the power, and its strongest powers are fighting over the stores. | 'strongest powers fighting over the stores'; the only QUARREL is Ducal Governorship vs Merchant Guilds over a new levy, not food stores | src/generators/narrativeText.js (line 87 at e5b421802) famineFoodIsPower |
