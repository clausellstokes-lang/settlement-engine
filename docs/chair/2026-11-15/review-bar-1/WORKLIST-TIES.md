# READ-ALL worklist · TIES · people's ties, goals and the plot hooks

3 flagged sentences (HIGH 0), read at the joined line e5b421802 on 2026-11-14. EACH IS A CANDIDATE: a reader judged it against ONE town's facts (`town read in`): verify it by the record before you cure it. `towns` = how many of the 720 census towns print the sentence (names and figures aside): the measure of its width, not of its falsity. The machine form is `WORKLIST-TIES.json` beside this file (each row's `fold` is its key in an inventory).

## YOUR FILES (no other seat holds them)

- `src/data/npcData.js`
- `src/domain/hookThemes.js`
- `src/data/powerSiblings.js`
- `src/generators/npcStructure.js`
- `src/data/personHooksByTitle.js`
- `src/data/people/goalFamilies.js`
- `src/domain/dossier/plotHooks.js`

## By file (flagged sentences · towns printing, summed)

- `src/data/powerSiblings.js` · 1 · 101
- `src/domain/hookThemes.js` · 1 · 61
- `src/data/people/goalFamilies.js` · 1 · 56

## By writer (file :: function, table or pool; flagged sentences · towns printing, summed)

- src/data/powerSiblings.js :: FACTION_DESC_SIBLINGS · 1 · 101
- src/domain/hookThemes.js :: AUTHORED_HOOK_THEMES · 1 · 61
- src/data/people/goalFamilies.js :: GOAL_FAMILY_LINES · 1 · 56

## The sentences, HIGH first, then widest first

| sev | towns | id | section | town read in | sentence (as that town prints it) | what the reader said | writer |
|---|---|---|---|---|---|---|---|
| MED | 101 | C7293 | Systems/Power | bar0-metropolis-calm-rand-2 | Well-funded city watch; it keeps order reliably and is growing more sure of its own authority. | calls the city watch 'well-funded'; the defence page says garrison and watch are resource-constrained, inadequate equipment, irregular pay | src/data/powerSiblings.js (line 87 at e5b421802) FACTION_DESC_SIBLINGS |
| MED | 61 | C11266 | Summary/Plot Hooks | bar0-village-calm-rand-2 | They have stopped believing, have told no one, and still lead the prayers every week. | Aleidis Krause is the militia captain, not clergy; the priest is Norbert Krause, so 'still lead the prayers every week' does not fit her | src/domain/hookThemes.js (line 205 at e5b421802) AUTHORED_HOOK_THEMES |
| MED | 56 | C12412 | World/NPCs | bar0-village-famine-rand-2 | Wants Learn whether Tserenpuntsag Qonggirad can still pay what is owed. | priest wants to learn whether Tserenpuntsag can still pay what is owed, but the debt runs the other way: Zümür Merkit owes Tserenpuntsag | src/data/people/goalFamilies.js (line 531 at e5b421802) GOAL_FAMILY_LINES |
