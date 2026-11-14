# READ-ALL-3 worklist (the exports' read) · TIES · people's ties, goals and the plot hooks

29 flagged sentences (HIGH 1), printed by the PDF or the Foundry journal and NOT by the tabs, read at the joined line f663a2699 on 2026-11-14. EACH IS A CANDIDATE: a reader judged it against ONE town's facts (`town read in`): verify it by the record before you cure it. `towns` = how many of the 720 census towns print the sentence (names and figures aside): the measure of its width, not of its falsity. The machine form is `WORKLIST-TIES.json` beside this file (each row's `fold` is its key in an inventory).

## YOUR FILES (no other seat holds them)

- `src/data/npcData.js`
- `src/domain/hookThemes.js`
- `src/data/powerSiblings.js`
- `src/generators/npcStructure.js`
- `src/data/personHooksByTitle.js`
- `src/data/people/goalFamilies.js`
- `src/domain/dossier/plotHooks.js`

## By file (flagged sentences · towns printing, summed)

- `src/data/npcData.js` · 19 · 2303
- `src/data/powerSiblings.js` · 6 · 158
- `src/data/personHooksByTitle.js` · 1 · 20
- `src/data/people/goalFamilies.js` · 3 · 3

## By writer (file :: function, table or pool; flagged sentences · towns printing, summed)

- src/data/npcData.js :: STRESS_ECONOMIC_EFFECTS.mentor_legacy · 4 · 654
- src/data/npcData.js :: NPC_FACTION_LOYALTY.other · 3 · 644
- src/data/npcData.js :: NPC_FACTION_LOYALTY.government · 4 · 519
- src/data/npcData.js :: STRESS_ECONOMIC_EFFECTS.wary_alliance · 1 · 285
- src/data/powerSiblings.js :: FACTION_DESC_SIBLINGS · 4 · 131
- src/data/npcData.js :: NPC_FACTION_LOYALTY.criminal · 1 · 81
- src/data/npcData.js :: STRESS_ECONOMIC_EFFECTS.mil_crim_corruption · 2 · 45
- src/data/npcData.js :: STRESS_ECONOMIC_EFFECTS.mil_crim_suppression · 2 · 38
- src/data/powerSiblings.js :: GOV_DESC_OF_UNNAMED_SEAT · 2 · 27
- src/data/npcData.js :: NPC_CRIMINAL_SECRETS_BY_HOLDER.economic_betrayal · 1 · 21
- src/data/personHooksByTitle.js :: PERSON_HOOKS_BY_TITLE.the theatre manager · 1 · 20
- src/data/npcData.js :: NPC_CRIMINAL_SECRETS_BY_HOLDER.historical · 1 · 16
- src/data/people/goalFamilies.js :: GOAL_FAMILY_LINES · 3 · 3

## The sentences, HIGH first, then widest first

| sev | towns | id | section | town read in | sentence (as that town prints it) | what the reader said | writer |
|---|---|---|---|---|---|---|---|
| HIGH | 1 | 06985 | PDF/NotableNPCs | r2r-metropolis-2 | Collect the tribute the dragon demands before it comes to collect it itself. — End the bad blood between The Guard and Thieves' Guild before the next generation inherits it. | names a dragon demanding tribute; HOUSES has no Dragon resident and PEOPLE lists no dragon | src/data/people/goalFamilies.js (line 1031 at f663a2699) GOAL_FAMILY_LINES |
| MED | 312 | 16470 | PDF/Relationships | r2s-occupied-hamlet-1 | Mentor and Successor Étaín Walsh named Fiona Sullivan as successor in front of witnesses. | occupying governor names the local headman her successor; QUARRELS has the two powers tense and escalating, occupier does not mentor local successor | src/data/npcData.js (line 2059 at f663a2699) STRESS_ECONOMIC_EFFECTS.mentor_legacy |
| MED | 311 | 16469 | PDF/Relationships | r2s-occupied-hamlet-0 | Mentor and Successor Sarnai Jalayir made Toghan Jadaran's career, and Toghan Jadaran rarely says so. | makes the occupying governor the eldest's protege; relations give Elder Council and Occupation Authority as competitive, escalating, and under occupation the elders do not rule freely | src/data/npcData.js (line 2046 at f663a2699) STRESS_ECONOMIC_EFFECTS.mentor_legacy |
| MED | 285 | 21809 | PDF/Relationships | r2s-under_siege-village-0 | Pragmatic Alliance Reed Batab and Kan Coh joined against a threat that has since passed, and each is now asking what the alliance is still for. | joined against a threat that has since passed; CRISIS is an Active Siege | src/data/npcData.js (line 2117 at f663a2699) STRESS_ECONOMIC_EFFECTS.wary_alliance |
| MED | 236 | 03950 | Journal/Plot Hooks | r2s-under_siege-town-1 | A traveller passed through asking which nights their door is left unbarred, and was gone by morning. (Chae Deng) | a traveller passed through and left by morning; Active Siege, nothing comes in or goes out | src/data/npcData.js (line 1299 at f663a2699) NPC_FACTION_LOYALTY.other |
| MED | 219 | 03004 | Journal/Plot Hooks | r2s-under_siege-town-1 | A cousin has arrived to stay without warning, and spends every day watching one particular house. (Sheng Ito) | a cousin has arrived to stay unannounced; Active Siege, no one comes in | src/data/npcData.js (line 1329 at f663a2699) NPC_FACTION_LOYALTY.other |
| MED | 189 | 28558 | Journal/Plot Hooks | r2r-thorp-58 | Their best customer owes them a year's takings and has started avoiding their street. (Sulayman al-Hassan) | best customer and 'their street'; thorp of 7 with dwellings along the bank, no market, under siege | src/data/npcData.js (line 1318 at f663a2699) NPC_FACTION_LOYALTY.other |
| MED | 157 | 28943 | Journal/Plot Hooks | r2s-under_siege-village-2 | They've been meeting privately with someone from outside the settlement whose identity they won't disclose. (Vinod Deshpande) | meets someone from outside the settlement; Active Siege, isolated, imports and exports none; no one comes in under siege | src/data/npcData.js (line 1173 at f663a2699) NPC_FACTION_LOYALTY.government |
| MED | 147 | 28931 | Journal/Plot Hooks | r2r-hamlet-34 | They're not telling the guard. (Vangchug Jadaran) | 'They're not telling the guard'; DEFENCE gives garrison none and watch none, only a citizen militia | src/data/npcData.js (line 1171 at f663a2699) NPC_FACTION_LOYALTY.government |
| MED | 112 | 03614 | Journal/Plot Hooks | r2s-occupied-hamlet-0 | A petition they set aside has gathered names from half their street, and the people who signed it want an answer this week. (Toghan Jadaran) | petition gathered names from half their street; hamlet of 20 has no street | src/data/npcData.js (line 1179 at f663a2699) NPC_FACTION_LOYALTY.government |
| MED | 103 | 03275 | Journal/Plot Hooks | r2r-village-35 | A ledger they swore was complete is missing the pages for one season, and an auditor is coming to read it. (Dragana Ivanov) | 'an auditor is coming' prints in siege, occupation and plague towns (tag S O P) where nobody arrives by road or gate | src/data/npcData.js (line 1184 at f663a2699) NPC_FACTION_LOYALTY.government |
| MED | 101 | 17043 | Journal/Power | r2s-famine-city-0 | Military/Guard: Well-funded city watch; it keeps order reliably and is growing more sure of its own authority. | says Military/Guard keeps order reliably; stability Desperate (hunger eroding order), safety Strained, relation to Royal Authority tense | src/data/powerSiblings.js (line 87 at f663a2699) FACTION_DESC_SIBLINGS |
| MED | 81 | 28819 | Journal/Plot Hooks | r2r-thorp-16 | They know because someone who works for the guard captain also works for them. (Reiko Wu) | 'works for the guard captain': DEFENCE shows no garrison, watch or hired force; no guard captain; population 10 | src/data/npcData.js (line 1270 at f663a2699) NPC_FACTION_LOYALTY.criminal |
| MED | 29 | 00634 | Journal/Relationships & Neighbours | r2s-occupied-hamlet-1 | Fiona Sullivan & Étaín Walsh — Mentor and Successor | writes occupier and headman as mentor and successor; QUARRELS has them tense, escalating | src/data/npcData.js (line 2046 at f663a2699) STRESS_ECONOMIC_EFFECTS.mentor_legacy |
| MED | 26 | 10615 | Journal/Power | r2s-occupied-hamlet-2 | Free Elder Council (governing): The elders of the hamlet decide things together, and no lord stands over them. | says no lord stands over the elders; Occupation Authority (Dominant) rules alongside, stability Suppressed under occupation | src/data/powerSiblings.js (line 103 at f663a2699) GOV_DESC_OF_UNNAMED_SEAT |
| MED | 24 | 07276 | PDF/Relationships | r2r-city-19 | Corrupt Arrangement Rónnat MacKenzie's arrest record looks good because Kathleen MacIntyre chooses which crimes get solved, and Kathleen MacIntyre's silver pays for the favour. | Rónnat MacKenzie is the lodge master @ Veteran's lodge, not a watch officer with an arrest record; Kathleen MacIntyre is the front man | src/data/npcData.js (line 1731 at f663a2699) STRESS_ECONOMIC_EFFECTS.mil_crim_corruption |
| MED | 21 | 07278 | PDF/Relationships | r2s-occupied-metropolis-2 | Corrupt Arrangement Altankhuyag Naiman's people are never searched on Otgontuya Taichiud's watch. | Otgontuya Taichiud is the lanista of the Gladiatorial school, not the watch commander (Ariun Nogai); she has no 'watch' to search on | src/data/npcData.js (line 1735 at f663a2699) STRESS_ECONOMIC_EFFECTS.mil_crim_corruption |
| MED | 21 | 04213 | PDF/Relationships | r2s-plague_onset-metropolis-0 | Active Suppression The war between Dokuz Salji'ud and Güchlüg Dörbete is fought in raids, informants, and paperwork. | war fought in raids between Dokuz Salji'ud and the thieves' guildmaster; PEOPLE: Dokuz Salji'ud is the lanista, no enforcement role | src/data/npcData.js (line 1766 at f663a2699) STRESS_ECONOMIC_EFFECTS.mil_crim_suppression |
| MED | 21 | 11965 | Journal/NPC 1 | r2s-politically_fractured-thorp-1 | Has been quietly shorting investments they publicly recommend, profiting from collapse: Civil fraud liability and the permanent destruction of a reputation built over decades | shorting publicly recommended investments: thorp of 10 with no market or finance house in HOUSES | src/data/npcData.js (line 1030 at f663a2699) NPC_CRIMINAL_SECRETS_BY_HOLDER.economic_betrayal |
| MED | 20 | 27350 | Journal/Plot Hooks | r2s-occupied-metropolis-0 | The new play mocks someone powerful by another name, and the house is full every night. (Eleni Glabas) | play's house 'full every night'; safety is Controlled, Occupation Curfew | src/data/personHooksByTitle.js (line 78 at f663a2699) PERSON_HOOKS_BY_TITLE.the theatre manager |
| MED | 17 | 04209 | PDF/Relationships | r2s-plague_onset-metropolis-0 | Active Suppression Dokuz Salji'ud hunts Lkhagvajav Ongirad's operation street by street, and Lkhagvajav Ongirad moves it one street ahead. | Dokuz Salji'ud 'hunts' an operation street by street; PEOPLE: Dokuz Salji'ud (f) is the lanista @ Gladiatorial school, not an enforcer | src/data/npcData.js (line 1775 at f663a2699) STRESS_ECONOMIC_EFFECTS.mil_crim_suppression |
| MED | 16 | 30553 | Journal/NPC 1 | r2s-mass_migration-hamlet-3 | Was the informant whose report triggered a purge that destroyed innocent lives: The report was accurate in some ways but deliberately misleading in others | an informant's report triggered a purge; PAST records only an Occupation 5 years ago, no purge | src/data/npcData.js (line 1005 at f663a2699) NPC_CRIMINAL_SECRETS_BY_HOLDER.historical |
| MED | 13 | 25907 | Journal/Power | r2s-under_siege-city-1 | The Martial Alliance: Well-funded city watch; it keeps order reliably and is growing more sure of its own authority. | describes The Martial Alliance as a well-funded city watch keeping order reliably; the city watch is its own house; STATE says Struggling under siege | src/data/powerSiblings.js (line 87 at f663a2699) FACTION_DESC_SIBLINGS |
| MED | 10 | 25995 | Journal/Power | r2s-plague_onset-city-2 | The Order of the Watch: Well-funded city watch; it keeps order reliably and is growing more sure of its own authority. | Order of the Watch 'keeps order reliably'; safety is Dangerous — Plague Unrest, Order of the Watch only Minor | src/data/powerSiblings.js (line 87 at f663a2699) FACTION_DESC_SIBLINGS |
| MED | 7 | 26057 | Journal/Power | r2s-famine-city-0 | The Shield Compact: Well-funded city watch; it keeps order reliably and is growing more sure of its own authority. | 'keeps order reliably'; GOVERNMENT stability is Desperate, hunger eroding order | src/data/powerSiblings.js (line 87 at f663a2699) FACTION_DESC_SIBLINGS |
| MED | 2 | 02763 | Journal/NPC 1 | r2s-occupied-hamlet-1 | Fiona Sullivan: Mentor and Successor. Étaín Walsh named Fiona Sullivan as successor in front of witnesses. | occupying governor names the village headman her successor; relations give their powers as tense and escalating | src/data/npcData.js (line 2059 at f663a2699) STRESS_ECONOMIC_EFFECTS.mentor_legacy |
| MED | 1 | 00909 | Journal/Power | r2s-succession_void-hamlet-0 | Free Elder Council (governing): The elders of the hamlet decide things together, and no lord stands over them. | says no lord stands over the elders; PEOPLE has Zenobia Cicero 'the lord' of The Highborn Circle, a Strong power | src/data/powerSiblings.js (line 103 at f663a2699) GOV_DESC_OF_UNNAMED_SEAT |
| MED | 1 | 11074 | Journal/NPC 3 | r2r-hamlet-18 | Get the most out of the work at the salt works while it runs well, and put the gains by. — Rise together with Eanán Fitzgerald, and share what they win. | 'salt works ... runs well'; LAND gaps say the salt works exists but lacks access to its salt input | src/data/people/goalFamilies.js (line 473 at f663a2699) GOAL_FAMILY_LINES |
| MED | 1 | 18508 | PDF/NotableNPCs | r2r-metropolis-26 | Motive: Learn who really runs the beast trainers, and what it would take to replace them. — Be the one who kept the work at the merchant guilds alive through the shortage. | 'kept the work alive through the shortage'; PAST records no shortage and FOOD is Secure | src/data/people/goalFamilies.js (line 396 at f663a2699) GOAL_FAMILY_LINES |
