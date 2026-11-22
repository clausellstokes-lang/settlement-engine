# READ-ALL-3 worklist (the exports' read) · POWERS · the powers: standing, claims, governance, the people's power lines

32 flagged sentences (HIGH 1), printed by the PDF or the Foundry journal and NOT by the tabs, read at the joined line f663a2699 on 2026-11-14. EACH IS A CANDIDATE: a reader judged it against ONE town's facts (`town read in`): verify it by the record before you cure it. `towns` = how many of the 720 census towns print the sentence (names and figures aside): the measure of its width, not of its falsity. The machine form is `WORKLIST-POWERS.json` beside this file (each row's `fold` is its key in an inventory).

## YOUR FILES (no other seat holds them)

- `src/data/faceHonorifics.js`
- `src/data/people/handlerTieLines.js`
- `src/data/stressPowerFaces.js`
- `src/domain/factionProfile.js`
- `src/data/people/titleSecretsPresentations.js`
- `src/data/people/dmPowerLines.js`
- `src/generators/power/*`
- `src/domain/dossier/powerStrata.js`
- `src/domain/display/governanceAccount.js`
- `src/generators/factionDynamics.js`

## By file (flagged sentences · towns printing, summed)

- `src/generators/power/claimStanding.js` · 4 · 166
- `src/generators/power/rulingStructure.js` · 8 · 124
- `src/data/people/titleSecretsPresentations.js` · 10 · 80
- `src/generators/power/stressFactions.js` · 5 · 42
- `src/generators/power/governanceNarrative.js` · 1 · 13
- `src/data/faceHonorifics.js` · 1 · 2
- `src/generators/power/conflictIssues.js` · 2 · 2
- `src/generators/power/conflicts.js` · 1 · 1

## By writer (file :: function, table or pool; flagged sentences · towns printing, summed)

- src/generators/power/claimStanding.js :: CLAIM_RUNGS · 4 · 166
- src/generators/power/rulingStructure.js :: generatePowerStructure · 8 · 124
- src/data/people/titleSecretsPresentations.js :: ROWS · 10 · 80
- src/generators/power/stressFactions.js :: applyStressEventFactions · 5 · 42
- src/generators/power/governanceNarrative.js :: deriveBaselineStability · 1 · 13
- src/data/faceHonorifics.js :: FACE_HONORIFICS.the foundling-mother · 1 · 2
- src/generators/power/conflictIssues.js :: BASE_ISSUES · 2 · 2
- src/generators/power/conflicts.js :: buildConflictPlotHooks · 1 · 1

## The sentences, HIGH first, then widest first

| sev | towns | id | section | town read in | sentence (as that town prints it) | what the reader said | writer |
|---|---|---|---|---|---|---|---|
| HIGH | 32 | 25356 | PDF/NotableNPCs | r2s-famine-thorp-0 | Talks about the catch, the weather and the boats; quick to offer a meal of fish. | quick to offer a meal of fish; Active Famine, failed source is fish, stores 0.1 months | src/data/people/titleSecretsPresentations.js (line 873 at f663a2699) ROWS |
| MED | 111 | 04922 | Journal/Power | r2s-plague_onset-city-1 | Arcane Orders: Mages and arcane practitioners hold real influence through monopoly on magical services and the latent fear their capabilities inspire. | Arcane Orders hold real influence through monopoly; GOVERNMENT lists Arcane Orders Suppressed | src/generators/power/claimStanding.js (line 79 at f663a2699) CLAIM_RUNGS |
| MED | 50 | 07413 | Journal/Power | r2s-plague_onset-city-0 | Craft Guilds: Well-organised craft guilds with established trade monopolies; a persistent civic voice that merchant houses must negotiate with, not ignore. | Craft Guilds called a persistent civic voice merchants must negotiate with; GOVERNMENT lists Craft Guilds Suppressed | src/generators/power/rulingStructure.js (line 627 at f663a2699) generatePowerStructure |
| MED | 37 | 25870 | Journal/Power | r2s-politically_fractured-thorp-1 | The Independent Bloc: Claims legitimate authority through different means; controls a distinct district or institution. | 'controls a distinct district or institution': population 10 cannot hold a district; HOUSES lists no institution for the Bloc | src/generators/power/stressFactions.js (line 110 at f663a2699) applyStressEventFactions |
| MED | 32 | 22578 | Journal/Power | r2s-plague_onset-city-1 | Religious Authorities: Church institutions hold direct temporal power; tithes, land, and courts are all ecclesiastical. | church holds direct temporal power, courts all ecclesiastical; the City-State Council governs and Multiple courthouses are commercial, criminal and church | src/generators/power/rulingStructure.js (line 599 at f663a2699) generatePowerStructure |
| MED | 28 | 29025 | Journal/Power | r2s-under_siege-town-0 | Thieves' Guild: Criminal network operating in shadows; controls illicit trade and profits from the gap between law and enforcement. | Thieves' Guild controls illicit trade; GOVERNMENT lists it as Suppressed | src/generators/power/claimStanding.js (line 88 at f663a2699) CLAIM_RUNGS |
| MED | 22 | 15253 | Journal/NPC 1 | r2s-famine-thorp-0 | Keeps the best fishing waters for their own family's boats by telling the others they are fished out: The other boats are starting to notice how full one family's nets come back | one family's nets come back full; FOOD failed source is fish, fishing failed, famine cut 65% | src/data/people/titleSecretsPresentations.js (line 865 at f663a2699) ROWS |
| MED | 14 | 17038 | Journal/Power | r2s-famine-village-1 | Military/Guard: Significant military force for this scale; the commander's opinion on civic matters carries institutional weight. | calls Military/Guard Significant; GOVERNMENT has it Dominant; DEFENCE shows only a citizen militia and no garrison, defence Vulnerable | src/generators/power/rulingStructure.js (line 551 at f663a2699) generatePowerStructure |
| MED | 14 | 15267 | Journal/NPC 1 | r2r-thorp-40 | Knows of a path over the hills that no one else uses, and guides people across it for a fee: The people who cross that way are not people who want to be seen, and someone is looking for them | a path over the hills; terrain is Plains | src/data/people/titleSecretsPresentations.js (line 1559 at f663a2699) ROWS |
| MED | 14 | 16694 | Journal/Power | r2s-occupied-village-2 | Merchant Guilds: Dominant commercial class at a trade nexus; they set prices, control warehousing, and fund the council. | says Merchant Guilds control warehousing and fund the council; HOUSES has no warehouse and no guild house, and the council is under occupation | src/generators/power/claimStanding.js (line 52 at f663a2699) CLAIM_RUNGS |
| MED | 13 | 24575 | Journal/Power | r2r-village-49 | Stability: Ordered (strong military presence) | 'Ordered (strong military presence)'; DEFENCE has no garrison, militia, watch or hired force, only an adventurers' charter hall | src/generators/power/governanceNarrative.js (line 285 at f663a2699) deriveBaselineStability |
| MED | 13 | 29028 | Journal/Power | r2s-under_siege-town-3 | Thieves' Guild: Underworld effectively controls vice, smuggling, and key officials; the nominal government tolerates this because it cannot currently change it. | underworld controls key officials, government merely nominal; Thieves' Guild is only Significant and Guild Council is a Strong governing power | src/generators/power/claimStanding.js (line 81 at f663a2699) CLAIM_RUNGS |
| MED | 9 | 16925 | Journal/Power | r2s-recently_betrayed-hamlet-0 | Military Party: Armed patrol of able-bodied residents; the settlement's primary recourse when disputes turn physical. | describes an armed patrol of residents; DEFENCE shows militia none, watch none, garrison none | src/generators/power/rulingStructure.js (line 558 at f663a2699) generatePowerStructure |
| MED | 6 | 12246 | Journal/Power | r2s-infiltrated-metropolis-3 | High Theocratic Council (governing): A grand council of senior officials, guild masters, and appointed magnates governs the metropolis; the council is always split into camps, and real power shifts between blocs. | High Theocratic Council is Dominant yet described as a council of guild masters and magnates 'always split into camps'; legitimacy Approved | src/generators/power/rulingStructure.js (line 345 at f663a2699) generatePowerStructure |
| MED | 5 | 11934 | Journal/NPC 1 | r2s-plague_onset-hamlet-0 | Has been hunting on land that belongs to someone else and selling the game in the market: The landowner has found the snares and is asking who set them | game sold 'in the market'; HOUSES has no market and the town is under plague | src/data/people/titleSecretsPresentations.js (line 1645 at f663a2699) ROWS |
| MED | 5 | 25617 | Journal/Power | r2r-city-43 | The Commercial Circle: Craft guilds regulating production and apprenticeships; a reliable secondary presence in civic life. | describes The Commercial Circle as craft guilds, a reliable secondary presence; Craft Guilds is its own power in QUARRELS, in high conflict with it, and the Circle is Suppressed | src/generators/power/rulingStructure.js (line 630 at f663a2699) generatePowerStructure |
| MED | 4 | 17039 | Journal/Power | r2s-occupied-metropolis-1 | Military/Guard: Significant military presence; officers hold political influence disproportionate to formal civic rank. | Military/Guard 'significant presence', officers hold influence; GOVERNMENT lists Military/Guard as Suppressed under occupation | src/generators/power/rulingStructure.js (line 552 at f663a2699) generatePowerStructure |
| MED | 4 | 25916 | Journal/Power | r2r-city-23 | The Merchant Bloc: Craft guilds regulating production and apprenticeships; a reliable secondary presence in civic life. | describes The Merchant Bloc as craft guilds regulating apprenticeships, a reliable secondary presence; GOVERNMENT lists Craft Guilds separately and The Merchant Bloc as Suppressed | src/generators/power/rulingStructure.js (line 630 at f663a2699) generatePowerStructure |
| MED | 2 | 21444 | Journal/NPC 2 | r2r-hamlet-18 | Pays the people who collect the salt tax to count fewer sacks than leave the works: When the counts are checked, the salt master and the collectors will go down together | sacks of salt leaving the works are counted; LAND gaps say the salt works lacks its salt input (salt flats absent) | src/data/people/titleSecretsPresentations.js (line 1094 at f663a2699) ROWS |
| MED | 2 | 25719 | Journal/Power | r2r-city-25 | The Free Alliance: Resident agent of the external creditor; formally an observer, in practice a veto on fiscal decisions. | describes The Free Alliance as the creditor's resident agent; GOVERNMENT lists a separate Creditor's Representative, and the Alliance has its own convenor | src/generators/power/stressFactions.js (line 127 at f663a2699) applyStressEventFactions |
| MED | 2 | 00956 | Journal/Tonight | r2s-indebted-city-3 | Franz Lehmann (the foundling-mother | Franz Lehmann is (m) in PEOPLE but printed with the female title 'the foundling-mother' | src/data/faceHonorifics.js (line 138 at f663a2699) FACE_HONORIFICS.the foundling-mother |
| MED | 1 | 12380 | Journal/Tonight | r2s-insurgency-thorp-1 | Holds the seat): Secret: Knows of a path over the hills that no one else uses, and guides people across it for a fee. | 'a path over the hills': terrain is Plains; LAND lists no hills or pass | src/data/people/titleSecretsPresentations.js (line 1559 at f663a2699) ROWS |
| MED | 1 | 23580 | PDF/NotableNPCs | r2s-plague_onset-village-2 | Sells leather to anyone; cash only. | tanner 'sells leather'; LAND gaps say the tannery lacks access to livestock and to animal hides | src/data/people/titleSecretsPresentations.js (line 920 at f663a2699) ROWS |
| MED | 1 | 23594 | Journal/NPC 3 | r2s-plague_onset-village-2 | Sells thin leather as thick by stretching it on the frame and selling it by the hide: The cobblers and saddlers who bought it would know the moment it wore through | tanner sells thin leather by the hide; LAND gaps say the tannery lacks livestock and animal hides, so it has no leather to sell | src/data/people/titleSecretsPresentations.js (line 914 at f663a2699) ROWS |
| MED | 1 | 11991 | Journal/NPC 3 | r2s-mass_migration-village-2 | Has been taking children to tread the clay for a few coppers a day, and one of them was hurt badly: The child's family took the money to keep quiet, and the money has run out | children treading clay for the brickmaker; LAND gaps give the Brickmaker no access to clay | src/data/people/titleSecretsPresentations.js (line 222 at f663a2699) ROWS |
| MED | 1 | 10879 | PDF/NotableNPCs | r2r-village-16 | Generous with a cup and with talk; hears everything the taverns say. | 'hears everything the taverns say'; HOUSES has no ale house, tavern or inn | src/data/people/titleSecretsPresentations.js (line 273 at f663a2699) ROWS |
| MED | 1 | 05973 | Journal/Plot Hooks | r2s-recently_betrayed-town-0 | Bread went up twice this month, and a baker says he was told to raise it. (Religious Authorities vs Craft Guilds) | a baker is told to raise bread prices; HOUSES has no Bakers | src/generators/power/conflictIssues.js (line 132 at f663a2699) BASE_ISSUES |
| MED | 1 | 05970 | Journal/Plot Hooks | r2r-town-10 | Bread went up twice this month, and a baker says he was told to raise it. (Merchant Guilds vs Military/Guard) | a baker raises bread; HOUSES has no bakers or bakery (butchers, mills only) | src/generators/power/conflictIssues.js (line 132 at f663a2699) BASE_ISSUES |
| MED | 1 | 20049 | Journal/Plot Hooks | r2r-city-19 | Neither has refused yet. (Religious Authorities vs Royal Authority) | 'Neither has refused yet' for Religious vs Royal; QUARRELS and 22559 say rites are already refused to the other power's members | src/generators/power/conflicts.js (line 43 at f663a2699) buildConflictPlotHooks |
| MED | 1 | 25733 | Journal/Power | r2s-occupied-metropolis-3 | The Garrison Bloc: External administrative body; all significant decisions require approval or reversal. | describes The Garrison Bloc as an external administrative body whose approval is needed; GOVERNMENT lists it as a local Minor power, the Occupation Authority being the outside one | src/generators/power/stressFactions.js (line 90 at f663a2699) applyStressEventFactions |
| MED | 1 | 25872 | Journal/Power | r2s-indebted-metropolis-0 | The Independent Bloc: Resident agent of the external creditor; formally an observer, in practice a veto on fiscal decisions. | calls The Independent Bloc the creditor's resident agent; PEOPLE gives that role to Creditor's Representative, while the Bloc has its own speaker | src/generators/power/stressFactions.js (line 127 at f663a2699) applyStressEventFactions |
| MED | 1 | 25630 | Journal/Power | r2s-indebted-metropolis-2 | The Common Interest: Resident agent of the external creditor; formally an observer, in practice a veto on fiscal decisions. | calls The Common Interest the creditor's resident agent; PEOPLE gives that role to Creditor's Representative, the Common Interest has a commoners' tribune | src/generators/power/stressFactions.js (line 127 at f663a2699) applyStressEventFactions |
