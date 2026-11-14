# READ-ALL worklist · TIES · people's ties, goals and the plot hooks

47 flagged sentences (HIGH 2), read at the joined line e5b421802 on 2026-11-14. EACH IS A CANDIDATE: a reader judged it against ONE town's facts (`town read in`): verify it by the record before you cure it. `towns` = how many of the 720 census towns print the sentence (names and figures aside): the measure of its width, not of its falsity. The machine form is `WORKLIST-TIES.json` beside this file (each row's `fold` is its key in an inventory).

## YOUR FILES (no other seat holds them)

- `src/data/npcData.js`
- `src/domain/hookThemes.js`
- `src/data/powerSiblings.js`
- `src/generators/npcStructure.js`
- `src/data/personHooksByTitle.js`
- `src/data/faceHonorifics.js`
- `src/data/people/goalFamilies.js`
- `src/domain/dossier/plotHooks.js`

## By file (flagged sentences · towns printing, summed)

- `src/data/npcData.js` · 15 · 2372
- `src/domain/hookThemes.js` · 14 · 1750
- `src/data/powerSiblings.js` · 6 · 242
- `src/generators/npcStructure.js` · 5 · 171
- `src/data/faceHonorifics.js` · 1 · 36
- `src/data/people/goalFamilies.js` · 4 · 29
- `src/data/personHooksByTitle.js` · 1 · 20
- `src/domain/dossier/plotHooks.js` · 1 · 1

## By writer (file :: function, table or pool; flagged sentences · towns printing, summed)

- src/domain/hookThemes.js :: AUTHORED_HOOK_THEMES · 14 · 1750
- src/data/npcData.js :: STRESS_ECONOMIC_EFFECTS.old_debt · 2 · 660
- src/data/npcData.js :: STRESS_ECONOMIC_EFFECTS.mentor_legacy · 2 · 604
- src/data/npcData.js :: STRESS_ECONOMIC_EFFECTS.peer_rivalry · 2 · 545
- src/data/npcData.js :: STRESS_ECONOMIC_EFFECTS.mutual_leverage · 1 · 299
- src/data/npcData.js :: STRESS_ECONOMIC_EFFECTS.genuine_respect · 1 · 189
- src/generators/npcStructure.js :: reg · 5 · 171
- src/data/powerSiblings.js :: FACTION_DESC_SIBLINGS · 3 · 142
- src/data/powerSiblings.js :: GOV_DESC_OF_UNNAMED_SEAT · 2 · 98
- src/data/npcData.js :: NPC_CRIMINAL_SECRETS_BY_HOLDER.economic_betrayal · 1 · 51
- src/data/faceHonorifics.js :: FACE_HONORIFICS.the dairy farmer · 1 · 36
- src/data/people/goalFamilies.js :: GOAL_FAMILY_LINES · 4 · 29
- src/data/personHooksByTitle.js :: PERSON_HOOKS_BY_TITLE.the theatre manager · 1 · 20
- src/data/npcData.js :: STRESS_ECONOMIC_EFFECTS.econ_crim_blur · 2 · 12
- src/data/npcData.js :: STRESS_ECONOMIC_EFFECTS.econ_mil_contract · 4 · 12
- src/data/powerSiblings.js :: BASELINE_CONFLICT_SIBLINGS · 1 · 2
- src/domain/dossier/plotHooks.js :: ECHO_PREFIXES · 1 · 1

## The sentences, HIGH first, then widest first

| sev | towns | id | section | town read in | sentence (as that town prints it) | what the reader said | writer |
|---|---|---|---|---|---|---|---|
| HIGH | 147 | 22767 | Summary/Plot Hooks | r2r-hamlet-34 | They know who committed a crime the guard is currently investigating. | a crime the guard is investigating; DEFENCE has no garrison or watch, only a citizen militia | src/domain/hookThemes.js (line 144 at e5b421802) AUTHORED_HOOK_THEMES |
| HIGH | 27 | 20473 | Systems/Power | r2s-occupied-hamlet-2 | The elders of the hamlet decide things together, and no lord stands over them. | 'no lord stands over them' under Occupation: a Dominant Occupation Authority does | src/data/powerSiblings.js (line 104 at e5b421802) GOV_DESC_OF_UNNAMED_SEAT |
| MED | 340 | 00828 | Summary/Overview | r2r-village-21 | Eberhard Huber has started repaying the debt in coin. | 'has started repaying the debt in coin'; the other says it has been repaid in small amounts ever since | src/data/npcData.js (line 2201 at e5b421802) STRESS_ECONOMIC_EFFECTS.old_debt |
| MED | 320 | 00669 | Summary/Overview | r2r-village-21 | Osterhild Lehmann has asked Severin Wolf for a vote against Severin Wolf's own interests. | asks the headman for 'a vote'; Headman's Authority holds no votes | src/data/npcData.js (line 2200 at e5b421802) STRESS_ECONOMIC_EFFECTS.old_debt |
| MED | 312 | 01204 | Summary/Overview | r2s-under_siege-hamlet-1 | Radmila Bogdanov lost the last contract to Konstantin Sokolov by a single vote, and has learned who cast it. | contract lost 'by a single vote'; a Headman's Authority has no voting body | src/data/npcData.js (line 2041 at e5b421802) STRESS_ECONOMIC_EFFECTS.peer_rivalry |
| MED | 307 | 00699 | Summary/Overview | r2r-thorp-24 | Fabia Varro has begun teaching Minucia Aquila's methods as Fabia Varro's own. | Fabia teaches Minucia's methods; other lines make Fabia the teacher whose methods Minucia uses | src/data/npcData.js (line 2072 at e5b421802) STRESS_ECONOMIC_EFFECTS.mentor_legacy |
| MED | 299 | 22432 | Summary/Overview | r2r-village-21 | The vote Eberhard Huber needs from Yolanda Krause comes up next week, and Yolanda Krause has named a new price. | 'the vote ... comes up next week'; a Headman's Authority has no voting body | src/data/npcData.js (line 2102 at e5b421802) STRESS_ECONOMIC_EFFECTS.mutual_leverage |
| MED | 297 | 01167 | World/Relationships | r2s-occupied-thorp-1 | Anusaya Bhat learned the work at Shashi Bajaj's side for seven years. | Anusaya learned at Shashi's side; the other line says Anusaya took Shashi in as apprentice | src/data/npcData.js (line 2055 at e5b421802) STRESS_ECONOMIC_EFFECTS.mentor_legacy |
| MED | 236 | 03130 | Summary/Plot Hooks | r2s-under_siege-town-1 | A traveller passed through asking which nights their door is left unbarred, and was gone by morning. | a traveller passed through and left by morning; Under Siege no one passes through | src/domain/hookThemes.js (line 266 at e5b421802) AUTHORED_HOOK_THEMES |
| MED | 233 | 00438 | Summary/Overview | r2s-under_siege-hamlet-1 | Konstantin Sokolov and Evtim Bogdanov will both present proposals at the next council session. | 'next council session'; GOVERNMENT is a Headman's Authority with no council | src/data/npcData.js (line 2040 at e5b421802) STRESS_ECONOMIC_EFFECTS.peer_rivalry |
| MED | 219 | 02506 | Summary/Plot Hooks | r2s-under_siege-town-1 | A cousin has arrived to stay without warning, and spends every day watching one particular house. | a cousin has just arrived to stay; Under Siege no one arrives by road | src/domain/hookThemes.js (line 296 at e5b421802) AUTHORED_HOOK_THEMES |
| MED | 203 | 22583 | Summary/Plot Hooks | r2r-thorp-41 | Their oldest friend has started paying for drinks with new silver and will not say where it came from. | Paying for drinks presumes a tavern; tag reaches thorps (this one of 22) with no inn | src/domain/hookThemes.js (line 269 at e5b421802) AUTHORED_HOOK_THEMES |
| MED | 189 | 20322 | Summary/Overview | r2s-under_siege-hamlet-0 | The council has asked Gaius Corvinus and Egeria Varro to audit each other's accounts. | 'the council has asked'; GOVERNMENT is a Headman's Authority alone, no council | src/data/npcData.js (line 2171 at e5b421802) STRESS_ECONOMIC_EFFECTS.genuine_respect |
| MED | 189 | 22560 | Summary/Plot Hooks | r2r-thorp-58 | Their best customer owes them a year's takings and has started avoiding their street. | best customer, a year's takings and 'their street' in a thorp of 7 with no market | src/domain/hookThemes.js (line 285 at e5b421802) AUTHORED_HOOK_THEMES |
| MED | 160 | 20646 | Summary/Plot Hooks | r2s-under_siege-town-0 | The goods are still arriving. | 'the goods are still arriving'; Under Siege, imports cover None, nothing comes in | src/domain/hookThemes.js (line 210 at e5b421802) AUTHORED_HOOK_THEMES |
| MED | 137 | 03018 | Summary/Plot Hooks | r2s-under_siege-town-2 | A shipment they weren't expecting arrived and is now in their warehouse. | an unexpected shipment arrived; Under Siege and trade access isolated, no shipment comes in | src/domain/hookThemes.js (line 208 at e5b421802) AUTHORED_HOOK_THEMES |
| MED | 112 | 02892 | Summary/Plot Hooks | r2s-occupied-hamlet-0 | A petition they set aside has gathered names from half their street, and the people who signed it want an answer this week. | petition signed by 'half their street' in a hamlet of 20 | src/domain/hookThemes.js (line 152 at e5b421802) AUTHORED_HOOK_THEMES |
| MED | 101 | 28616 | Systems/Power | r2s-occupied-city-2 | Well-funded city watch; it keeps order reliably and is growing more sure of its own authority. | watch keeps order and grows surer of its authority; GOVERNMENT has Military/Guard Suppressed under occupation | src/data/powerSiblings.js (line 87 at e5b421802) FACTION_DESC_SIBLINGS |
| MED | 89 | 16774 | World/NPCs | r2r-hamlet-57 | Runs a smaller house behind the leading one in quiet times. | 'a smaller house behind the leading one'; tag x89 reaches hamlets with no trading houses | src/generators/npcStructure.js (line 300 at e5b421802) reg |
| MED | 81 | 20685 | Summary/Plot Hooks | r2r-thorp-16 | The guard captain has a file. | 'The guard captain has a file'; DEFENCE: garrison none, watch none; only a household levy | src/domain/hookThemes.js (line 239 at e5b421802) AUTHORED_HOOK_THEMES |
| MED | 81 | 22757 | Summary/Plot Hooks | r2r-thorp-16 | They know because someone who works for the guard captain also works for them. | 'someone who works for the guard captain'; DEFENCE has no garrison or watch, so no guard captain | src/domain/hookThemes.js (line 239 at e5b421802) AUTHORED_HOOK_THEMES |
| MED | 80 | 00183 | Summary/Plot Hooks | r2s-occupied-town-2 | Three guards have gone missing in the same district on night patrol. | three guards lost in the same district; a town of 310 has no districts | src/domain/hookThemes.js (line 164 at e5b421802) AUTHORED_HOOK_THEMES |
| MED | 71 | 02676 | Systems/Power | r2s-occupied-hamlet-1 | A headman settles disputes and gives the orders here. | headman 'gives the orders here' under Occupation; the Occupation Authority stands equal and stability Suppressed | src/data/powerSiblings.js (line 105 at e5b421802) GOV_DESC_OF_UNNAMED_SEAT |
| MED | 51 | 17103 | World/NPCs | r2s-politically_fractured-thorp-1 | Secret: Has been quietly shorting investments they publicly recommend, profiting from collapse | 'shorting investments they publicly recommend'; tag reaches th, here a thorp of 10 with no bank, exchange or merchant house | src/data/npcData.js (line 1029 at e5b421802) NPC_CRIMINAL_SECRETS_BY_HOLDER.economic_betrayal |
| MED | 46 | 28599 | Summary/Plot Hooks | r2r-town-37 | Weapons from the armoury have been disappearing in small quantities for months. | Weapons go missing from the armoury; HOUSES has no armoury or garrison | src/domain/hookThemes.js (line 165 at e5b421802) AUTHORED_HOOK_THEMES |
| MED | 44 | 03139 | Summary/Plot Hooks | r2s-under_siege-metropolis-3 | A valuable cargo was reported lost at sea. | cargo lost at sea; trade access is river, terrain plains, no sea | src/domain/hookThemes.js (line 214 at e5b421802) AUTHORED_HOOK_THEMES |
| MED | 37 | 23160 | Systems/Power | r2s-under_siege-town-2 | Town watch; it enforces ordinances, manages disorder, and reports to the council. | watch reports to the council; GOVERNMENT is a Feudal Appointee and lists no council | src/data/powerSiblings.js (line 85 at e5b421802) FACTION_DESC_SIBLINGS |
| MED | 36 | 14612 | Systems/Resources | r2s-occupied-hamlet-3 | No livestock reaches the dairy farmer. | 'no livestock reaches the dairy farmer', yet the farmer keeps cattle or goats and the hamlet has common grazing | src/data/faceHonorifics.js (line 40 at e5b421802) FACE_HONORIFICS.the dairy farmer |
| MED | 29 | 10338 | World/NPCs | r2r-city-31 | Heads the casters in quiet times; their place is secure and their spells are in demand. | says the casters' place is secure and spells in demand; GOVERNMENT lists Arcane Orders as Suppressed | src/generators/npcStructure.js (line 451 at e5b421802) reg |
| MED | 20 | 21114 | Summary/Plot Hooks | r2s-occupied-metropolis-0 | The new play mocks someone powerful by another name, and the house is full every night. | Full house every night, yet safety is Controlled — Occupation Curfew | src/data/personHooksByTitle.js (line 78 at e5b421802) PERSON_HOOKS_BY_TITLE.the theatre manager |
| MED | 19 | 27051 | World/NPCs | r2s-indebted-village-2 | Wants Show the rest of Merchant Guilds that Giselbert Schneider can be wrong, without ever saying so aloud. | 'the rest of Merchant Guilds' makes Giselbert Schneider a guild member; 02086 makes him mine captain and Headman of the rival power | src/data/people/goalFamilies.js (line 201 at e5b421802) GOAL_FAMILY_LINES |
| MED | 18 | 16778 | World/NPCs | r2s-religious_conversion-hamlet-0 | Runs a smaller house while money is short and the bigger houses take more of the trade. | presumes 'the bigger houses' taking trade; hamlet of 80 has one pawnbroker and no trading houses | src/generators/npcStructure.js (line 284 at e5b421802) reg |
| MED | 18 | 05716 | World/NPCs | r2s-religious_conversion-hamlet-0 | Constraint: The work the big houses leave alone is the work that pays least. | 'the big houses' do not exist in a hamlet of 80 | src/generators/npcStructure.js (line 286 at e5b421802) reg |
| MED | 17 | 12589 | World/NPCs | r2r-village-48 | Leads the faith while rivals fight over the seat, and both sides want its blessing. | rivals fighting over the seat; crisis is Infiltrated not succession, and 10846 says Household Council outweighs everyone wanting its place | src/generators/npcStructure.js (line 341 at e5b421802) reg |
| MED | 15 | 21278 | Summary/Plot Hooks | r2s-plague_onset-thorp-0 | The person who settled every quarrel here has died, and two neighbours both expect to take their place. | the one who settled every quarrel has died; Elder Kenji Wang holds the seat and guides by consensus | src/domain/hookThemes.js (line 314 at e5b421802) AUTHORED_HOOK_THEMES |
| MED | 8 | 24514 | World/NPCs | r2s-monster_pressure-metropolis-0 | Wants Find a second supplier of precious metals, so one lost cart cannot stop the work at the banking district. | presumes a supplier of precious metals; TRADE imports none and 14222 says gold/silver ore is not brought in | src/data/people/goalFamilies.js (line 433 at e5b421802) GOAL_FAMILY_LINES |
| MED | 6 | 22483 | World/Relationships | r2r-city-3 | The warehouse keeps two inventories, and only one is shown to the customs house. | an inventory is shown to the customs house; HOUSES has no customs house | src/data/npcData.js (line 1661 at e5b421802) STRESS_ECONOMIC_EFFECTS.econ_crim_blur |
| MED | 6 | 02528 | Summary/Overview | r2r-city-3 | A customs officer has asked Photios Glabas for the names of every supplier. | a customs officer demands supplier names; HOUSES has no customs house | src/data/npcData.js (line 1678 at e5b421802) STRESS_ECONOMIC_EFFECTS.econ_crim_blur |
| MED | 4 | 03038 | Systems/Power | r2s-occupied-town-0 | A small group of traders who come on market days; they speak up in small disputes but carry little weight beyond them. | calls Merchant Guilds a few traders who come on market days; HOUSES has resident Merchant guilds (3-8) and 02819 has merchants report to it | src/data/powerSiblings.js (line 91 at e5b421802) FACTION_DESC_SIBLINGS |
| MED | 3 | 00899 | World/Relationships | r2s-wartime-town-3 | Hedwig Maier hired Ignatz Schröder's company after the last caravan was lost. | Hedwig hires Ignatz Schröder's company; DEFENCE hired: none, and Ignatz runs the town watch, not a company | src/data/npcData.js (line 1810 at e5b421802) STRESS_ECONOMIC_EFFECTS.econ_mil_contract |
| MED | 3 | 20323 | Summary/Overview | r2s-wartime-town-3 | The council wants Ignatz Schröder's company under the watch's command. | wants Ignatz Schröder's company put under the watch, but Ignatz Schröder runs the town watch | src/data/npcData.js (line 1825 at e5b421802) STRESS_ECONOMIC_EFFECTS.econ_mil_contract |
| MED | 3 | 01624 | World/Relationships | r2s-famine-city-1 | Asger Yngvarsson's soldiers wear Mord Torvaldsson's colours on the road and take Mord Torvaldsson's orders without question. | a hired company of soldiers under contract; DEFENCE hired: none and HOUSES has no mercenaries or hired blades | src/data/npcData.js (line 1808 at e5b421802) STRESS_ECONOMIC_EFFECTS.econ_mil_contract |
| MED | 3 | 02650 | Summary/Overview | r2s-famine-city-1 | A guard from Asger Yngvarsson's company was killed protecting Mord Torvaldsson's cargo. | a guard from a hired company; DEFENCE hired: none, no mercenary house | src/data/npcData.js (line 1823 at e5b421802) STRESS_ECONOMIC_EFFECTS.econ_mil_contract |
| MED | 2 | 22409 | Systems/Power | r2r-hamlet-59 | The village reeve disagrees. | 'The village reeve'; a hamlet ruled by Household Council has no reeve | src/data/powerSiblings.js (line 43 at e5b421802) BASELINE_CONFLICT_SIBLINGS |
| MED | 1 | 26039 | World/NPCs | r2s-famine-thorp-1 | Wants Keep the accounts of the local fence's people balanced, and show them to anyone who asks. | the fence shows its accounts to anyone who asks; the fence is never spoken of aloud | src/data/people/goalFamilies.js (line 339 at e5b421802) GOAL_FAMILY_LINES |
| MED | 1 | 26467 | World/NPCs | r2s-religious_conversion-town-3 | Wants Learn why people favour Church Council, and do better for Merchant Guilds. | presumes people favour Church Council; GOVERNMENT legitimacy is Legitimacy Crisis and Church Council only Minor | src/data/people/goalFamilies.js (line 279 at e5b421802) GOAL_FAMILY_LINES |
| MED | 1 | 07549 | Summary/Plot Hooks | r2s-indebted-metropolis-0 | Families who lived through it tell it this way: the vacuum is being maintained deliberately by an outside power that benefits from the instability | speaks of a power vacuum; CRISIS is debt and Arcane Senate (Strong) holds the seat | src/domain/dossier/plotHooks.js (line 198 at e5b421802) ECHO_PREFIXES |
