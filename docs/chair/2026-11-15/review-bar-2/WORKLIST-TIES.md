# REVIEW-BAR-2 worklist · TIES · people's ties, goals and the plot hooks

15 flagged sentences (HIGH 0), read at the joined line f8042b61a on 2026-11-15 (REVIEW-BAR-2: thirty fresh towns, each whole). EACH IS A CANDIDATE: a reader judged it against ONE town's facts (`town read in`): verify it by the record before you cure it. `towns` = how many of the 720 census towns printed the sentence at the read before (5d1e3096b, a day old; names and figures aside): the measure of its width, not of its falsity. The machine form is `WORKLIST-TIES.json` beside this file (each row's `fold` is its key in an inventory).

## YOUR FILES (no other seat holds them)

- `src/data/npcData.js`
- `src/domain/hookThemes.js`
- `src/data/powerSiblings.js`
- `src/generators/npcStructure.js`
- `src/data/personHooksByTitle.js`
- `src/data/people/goalFamilies.js`
- `src/domain/dossier/plotHooks.js`

## By file (flagged sentences · towns printing, summed)

- `src/data/npcData.js` · 4 · 693
- `src/domain/hookThemes.js` · 6 · 588
- `src/data/powerSiblings.js` · 2 · 202
- `src/generators/npcStructure.js` · 2 · 149
- `src/data/people/goalFamilies.js` · 1 · 4

## By writer (file :: function, table or pool; flagged sentences · towns printing, summed)

- src/domain/hookThemes.js :: AUTHORED_HOOK_THEMES · 6 · 588
- src/data/npcData.js :: STRESS_ECONOMIC_EFFECTS.mutual_leverage · 1 · 319
- src/data/npcData.js :: STRESS_ECONOMIC_EFFECTS.peer_rivalry · 1 · 224
- src/data/powerSiblings.js :: FACTION_DESC_SIBLINGS · 2 · 202
- src/generators/npcStructure.js :: reg · 2 · 149
- src/data/npcData.js :: STRESS_ECONOMIC_EFFECTS.bitter_history · 1 · 92
- src/data/npcData.js :: NPC_CRIMINAL_SECRETS_BY_HOLDER.magical · 1 · 58
- src/data/people/goalFamilies.js :: GOAL_FAMILY_LINES · 1 · 4

## The sentences, HIGH first, then widest first

| sev | towns | id | section | town read in | sentence (as that town prints it) | what the reader said | writer |
|---|---|---|---|---|---|---|---|
| MED | 319 | C13193 | World/Relationships | bar0-hamlet-calm-rand-4 | They cooperate efficiently and neither trusts the other at all. | Tian Ma and Xiao Gao 'neither trusts the other at all' contradicts 'disagree often and trust completely' for the same pair | src/data/npcData.js (line 2104 at f8042b61a) STRESS_ECONOMIC_EFFECTS.mutual_leverage |
| MED | 224 | C18001 | World/Relationships | bar0-metropolis-calm-rand-3 | Every client Khutulun Dzungar wins is one Ulugh Taichiud lost, and the reverse. | innkeeper Khutulun Dzungar and chief magistrate Ulugh Taichiud 'win and lose clients' as rivals; PEOPLE gives them unrelated trades (Merchant Guilds vs Shadow Senate) | src/data/npcData.js (line 2051 at f8042b61a) STRESS_ECONOMIC_EFFECTS.peer_rivalry |
| MED | 151 | C10144 | Summary/Plot Hooks | bar0-city-wartime-rand-5 | A lender has bought the note on their shop and wants it settled by the end of the month. | a note on 'their shop' for the garrison commander, whose house is the Garrison; no shop in her record | src/domain/hookThemes.js (line 225 at f8042b61a) AUTHORED_HOOK_THEMES |
| MED | 151 | C26509 | Summary/Plot Hooks | bar0-town-calm-rand-5 | A lender has bought the note on their shop and wants it settled by the end of the month. | hook gives Timur Kovalev (company captain, Free company hall) a shop with a note on it; PEOPLE gives him no shop | src/domain/hookThemes.js (line 225 at f8042b61a) AUTHORED_HOOK_THEMES |
| MED | 101 | C6878 | Systems/Power | bar0-city-wartime-rand-3 | Well-funded city watch; it keeps order reliably and is growing more sure of its own authority. | calls the watch well-funded and reliable at order; Defense says resource-constrained, inadequate equipment, irregular pay, and a crime wave outruns those in charge | src/data/powerSiblings.js (line 97 at f8042b61a) FACTION_DESC_SIBLINGS |
| MED | 101 | C9046 | Systems/Power | bar0-city-wartime-rand-4 | Well-funded city watch; it keeps order reliably and is growing more sure of its own authority. | says the watch keeps order reliably; the Tensions say crime is rising faster than those in charge can answer, and Law & order is Strained | src/data/powerSiblings.js (line 97 at f8042b61a) FACTION_DESC_SIBLINGS |
| MED | 92 | C23104 | World/Relationships | bar0-metropolis-calm-rand-5 | Ignatz Uhl and Isidor Klein have been placed on the same council committee. | Isidor Klein sits only on The Underground (veiled), not Grand Council; placed on a council committee with Ignatz Uhl | src/data/npcData.js (line 2296 at f8042b61a) STRESS_ECONOMIC_EFFECTS.bitter_history |
| MED | 85 | C26505 | Summary/Plot Hooks | bar0-town-calm-rand-5 | They received a directive from the hierarchy that contradicts their own theology. | hook under Timur Kovalev (company captain) says a directive from the hierarchy contradicts their theology; he holds no priestly office | src/domain/hookThemes.js (line 193 at f8042b61a) AUTHORED_HOOK_THEMES |
| MED | 79 | C28736 | Summary/Plot Hooks | bar0-town-occupied-rand-4 | The guard captain has a file. | hook is about Itzam Pech, who IS the watch captain (PEOPLE); 'the guard captain has a file... works for the guard captain' treats them as another person | src/domain/hookThemes.js (line 239 at f8042b61a) AUTHORED_HOOK_THEMES |
| MED | 75 | C20059 | World/NPCs | bar0-metropolis-calm-rand-4 | Leads the faith in quiet times, at peace with the seat beside it. | says the dean is 'at peace with the seat'; Religious Authorities contests the seat and 'the clergy cannot accept' the Senate's lead | src/generators/npcStructure.js (line 362 at f8042b61a) reg |
| MED | 74 | C25301 | World/NPCs | bar0-town-calm-rand-3 | Constraint: With nothing threatening, it is hard to win the coin and the say that would be needed if trouble came. | 'With nothing threatening' for the commander, but stability is Tense — regional monster threat and the page calls the monster threat constant | src/generators/npcStructure.js (line 260 at f8042b61a) reg |
| MED | 61 | C10139 | Summary/Plot Hooks | bar0-city-wartime-rand-5 | They have stopped believing, have told no one, and still lead the prayers every week. | Zoya Kovalyov is the garrison commander (War Council); nothing makes her a priest leading weekly prayers | src/domain/hookThemes.js (line 205 at f8042b61a) AUTHORED_HOOK_THEMES |
| MED | 61 | C25638 | Summary/Plot Hooks | bar0-town-calm-rand-4 | They have stopped believing, have told no one, and still lead the prayers every week. | hook under Zenobia Flavius (craft-guild master) says they lead the prayers weekly; priestly duty belongs to the dean | src/domain/hookThemes.js (line 205 at f8042b61a) AUTHORED_HOOK_THEMES |
| MED | 58 | C7331 | World/NPCs | bar0-city-wartime-rand-3 | Secret: Has been using magic to alter memories of specific events | says the guildmaster uses magic; the page says no arcane practitioners on the rolls, arcane support None, reliance none, and DEFENCE magic is none | src/data/npcData.js (line 943 at f8042b61a) NPC_CRIMINAL_SECRETS_BY_HOLDER.magical |
| MED | 4 | C25259 | World/NPCs | bar0-town-calm-rand-3 | Wants Get the most out of the work at the salt works while it runs well, and put the gains by. | salt works 'runs well' but LAND gap: it lacks its salt input and no salt reaches it; page marks it short | src/data/people/goalFamilies.js (line 473 at f8042b61a) GOAL_FAMILY_LINES |
