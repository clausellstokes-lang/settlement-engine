# READ-ALL-3 worklist (the exports' read) · DISPLAY-CIVIC · rows the display composes on the Power tab, the Summary, and the World tabs (no fixed run to trace: find the writer first), and their own leaves

27 flagged sentences (HIGH 1), printed by the PDF or the Foundry journal and NOT by the tabs, read at the joined line f663a2699 on 2026-11-14. EACH IS A CANDIDATE: a reader judged it against ONE town's facts (`town read in`): verify it by the record before you cure it. `towns` = how many of the 720 census towns print the sentence (names and figures aside): the measure of its width, not of its falsity. The machine form is `WORKLIST-DISPLAY-CIVIC.json` beside this file (each row's `fold` is its key in an inventory).

## YOUR FILES (no other seat holds them)

- `(untraced)`
- `src/components/*`
- `src/domain/display/*`
- `src/domain/facts/*`

## By file (flagged sentences · towns printing, summed)

- `src/domain/display/threatAssessment.js` · 14 · 1297
- `src/domain/display/institutionDisplayName.js` · 2 · 65
- `src/domain/display/prosperityInCrisis.js` · 8 · 51
- `src/domain/display/labelBands.js` · 1 · 2
- `src/domain/display/validationOnPage.js` · 2 · 2

## By writer (file :: function, table or pool; flagged sentences · towns printing, summed)

- src/domain/display/threatAssessment.js :: buildThreatAssessment · 14 · 1297
- src/domain/display/institutionDisplayName.js :: INSTITUTION_DISPLAY_NAMES · 2 · 65
- src/domain/display/prosperityInCrisis.js :: prosperityInCrisisLine · 8 · 51
- src/domain/display/labelBands.js :: SAFETY_BANDS · 1 · 2
- src/domain/display/validationOnPage.js :: CHAIN_INPUTS · 2 · 2

## The sentences, HIGH first, then widest first

| sev | towns | id | section | town read in | sentence (as that town prints it) | what the reader said | writer |
|---|---|---|---|---|---|---|---|
| HIGH | 240 | 20491 | PDF/DefenseSecurity | r2s-plague_onset-thorp-0 | Nobody here treats the sick, and a plague would run until it burned out. | 'Nobody here treats the sick, and a plague would run'; PEOPLE has Jiahao Wu who tends the sick, and the plague is already here | src/domain/display/threatAssessment.js (line 346 at f663a2699) buildThreatAssessment |
| MED | 206 | 04982 | PDF/DefenseSecurity | r2s-plague_onset-town-2 | Arrest, trial and gaol all work here. | claims arrest, trial and gaol all work; legitimacy crisis (score 5), Plague Unrest, safety Dangerous, and no court on HOUSES | src/domain/display/threatAssessment.js (line 292 at f663a2699) buildThreatAssessment |
| MED | 187 | 26932 | PDF/DefenseSecurity | r2s-plague_onset-town-1 | The hospital can isolate the sick and keep an outbreak from spreading. | hospital 'can isolate the sick and keep an outbreak from spreading'; the plague is already running and safety is Dangerous, plague unrest | src/domain/display/threatAssessment.js (line 341 at f663a2699) buildThreatAssessment |
| MED | 154 | 28629 | PDF/DefenseSecurity | r2s-famine-town-2 | There is a court but almost nowhere to hold anyone. | says there is a court; HOUSES has a Town hall but no court | src/domain/display/threatAssessment.js (line 294 at f663a2699) buildThreatAssessment |
| MED | 110 | 22279 | PDF/DefenseSecurity | r2s-occupied-thorp-1 | Quiet country, and nothing organised is kept against it. | 'Quiet country' under Occupation: stability Suppressed, curfew, resistance simmering, Occupation Authority Significant | src/domain/display/threatAssessment.js (line 239 at f663a2699) buildThreatAssessment |
| MED | 104 | 29824 | PDF/DefenseSecurity | r2s-plague_onset-thorp-0 | Violence and organised crime are the main danger here. | 'organised crime' the main danger; thorp of 14, no watch or force, safety word is Dangerous plague conditions | src/domain/display/threatAssessment.js (line 289 at f663a2699) buildThreatAssessment |
| MED | 97 | 06493 | PDF/DefenseSecurity | r2s-under_siege-city-0 | Charter hall handles anything above the garrison usual remit. | names a Charter hall; true here (charter: adventurers' guilds) but tag reaches towns whose DEFENCE charter is none and HOUSES has no charter hall | src/domain/display/threatAssessment.js (line 213 at f663a2699) buildThreatAssessment |
| MED | 89 | 22277 | PDF/DefenseSecurity | r2s-famine-city-3 | Quiet country, and far more defences than it calls for. | calls it quiet country with far more defences than needed; STATE safety Strained under famine, stability Desperate, hunger eroding order | src/domain/display/threatAssessment.js (line 233 at f663a2699) buildThreatAssessment |
| MED | 44 | 22278 | PDF/DefenseSecurity | r2s-under_siege-town-0 | Quiet country, and little is kept against it. | quiet country, little kept against it; CRISIS is an Active Siege, safety Desperate | src/domain/display/threatAssessment.js (line 236 at f663a2699) buildThreatAssessment |
| MED | 37 | 27231 | PDF/DefenseSecurity | r2s-plague_onset-city-0 | The monastic infirmary treats the sick one at a time; an outbreak would outrun it. | 'an outbreak would outrun it' treats outbreak as hypothetical; CRISIS is an outbreak under way (Disease Outbreak, Plague) | src/domain/display/threatAssessment.js (line 343 at f663a2699) buildThreatAssessment |
| MED | 33 | 04153 | Journal/Institutions | r2r-thorp-58 | Access to a house of worship: A walk of a few miles to the village house of worship for services. | a walk of miles to a village church for services; roads cut by the besiegers, Active Siege | src/domain/display/institutionDisplayName.js (line 90 at f663a2699) INSTITUTION_DISPLAY_NAMES |
| MED | 32 | 04155 | Journal/Institutions | r2r-under_siege-thorp-1 | Access to a house of worship: Services mean a walk of a few miles to the village house of worship. | services a walk of miles to a village church; HOUSES only access, siege cuts the road | src/domain/display/institutionDisplayName.js (line 90 at f663a2699) INSTITUTION_DISPLAY_NAMES |
| MED | 19 | 30561 | PDF/DefenseSecurity | r2r-hamlet-10 | Watch rotations are thin. | 'Watch rotations are thin'; DEFENCE says watch: none | src/domain/display/threatAssessment.js (line 191 at f663a2699) buildThreatAssessment |
| MED | 9 | 17197 | PDF/DefenseSecurity | r2s-slave_revolt-town-2 | Money enough to ride out a long crisis, laid by before the revolt: emergency measures can be paid for, and the garrison kept paid while it lasts. | claims money enough to ride out a long crisis; STATE gives prosperity Poor, safety Critical and legitimacy 23 | src/domain/display/prosperityInCrisis.js (line 100 at f663a2699) prosperityInCrisisLine |
| MED | 9 | 17185 | PDF/DefenseSecurity | r2s-famine-city-0 | Money enough to ride out a long crisis, laid by before the famine: emergency measures can be paid for, and the garrison kept paid while it lasts. | 'Money enough to ride out a long crisis, laid by'; STATE prosperity Struggling, legitimacy crisis, viable False | src/domain/display/prosperityInCrisis.js (line 100 at f663a2699) prosperityInCrisisLine |
| MED | 9 | 17193 | PDF/DefenseSecurity | r2s-plague_onset-city-3 | Money enough to ride out a long crisis, laid by before the outbreak: emergency measures can be paid for, and the garrison kept paid while it lasts. | 'Money enough to ride out a long crisis, laid by'; STATE prosperity is Poor and legitimacy Crisis | src/domain/display/prosperityInCrisis.js (line 100 at f663a2699) prosperityInCrisisLine |
| MED | 8 | 17199 | PDF/DefenseSecurity | r2s-under_siege-city-3 | Money enough to ride out a long crisis, laid by before the siege: emergency measures can be paid for, and the garrison kept paid while it lasts. | 'Money enough to ride out a long crisis' but STATE prosperity is Struggling and the city imports Capital | src/domain/display/prosperityInCrisis.js (line 100 at f663a2699) prosperityInCrisisLine |
| MED | 8 | 17192 | PDF/DefenseSecurity | r2s-occupied-city-3 | Money enough to ride out a long crisis, laid by before the occupation: emergency measures can be paid for, and the garrison kept paid while it lasts. | 'Money enough to ride out a long crisis' vs STATE prosperity Poor and 14493 'what the city earns now goes to them' | src/domain/display/prosperityInCrisis.js (line 100 at f663a2699) prosperityInCrisisLine |
| MED | 5 | 17171 | PDF/DefenseSecurity | r2s-plague_onset-town-3 | Money enough for a short crisis, laid by before the outbreak; a long siege would start eating the reserves within months. | laid by before the outbreak yet says a long siege would eat the reserves; the crisis is a plague, no siege | src/domain/display/threatAssessment.js (line 320 at f663a2699) buildThreatAssessment |
| MED | 5 | 17189 | PDF/DefenseSecurity | r2r-town-36 | Money enough to ride out a long crisis, laid by before the migration: emergency measures can be paid for, and the defenders kept paid while it lasts. | claims money enough to ride out a long crisis and pay defenders; STATE prosperity is Poor, legitimacy crisis | src/domain/display/prosperityInCrisis.js (line 100 at f663a2699) prosperityInCrisisLine |
| MED | 3 | 27635 | PDF/DefenseSecurity | r2s-under_siege-town-2 | The primary threats here are internal. | primary threats are internal; CRISIS is Under Siege, an external threat | src/domain/display/threatAssessment.js (line 235 at f663a2699) buildThreatAssessment |
| MED | 2 | 17167 | PDF/DefenseSecurity | r2s-famine-town-3 | Money enough for a short crisis, laid by before the famine; a long siege would start eating the reserves within months. | laid by before the famine, yet says a long siege would eat the reserves; the crisis is Famine, no siege | src/domain/display/threatAssessment.js (line 320 at f663a2699) buildThreatAssessment |
| MED | 2 | 17196 | PDF/DefenseSecurity | r2s-slave_revolt-town-1 | Money enough to ride out a long crisis, laid by before the revolt: emergency measures can be paid for, and the defenders kept paid while it lasts. | claims money enough to ride out a long crisis and pay defenders; STATE prosperity is Poor, safety Critical | src/domain/display/prosperityInCrisis.js (line 100 at f663a2699) prosperityInCrisisLine |
| MED | 2 | 24578 | Journal/Power | r2r-metropolis-16 | Stability: Rigid (militant theocracy); monsters on the roads | prints stability as militant theocracy; GOVERNMENT is a Democratic assembly with Religious Authorities only Minor, and safety Very Safe | src/domain/display/labelBands.js (line 80 at f663a2699) SAFETY_BANDS |
| MED | 1 | 19746 | Journal/Resources & Production | r2r-thorp-32 | Nearby resources: Hot Springs Mineral, Mountain Timber, Grazing Land, Defended Pass, Stone Quarry | 'Defended Pass' while DEFENCE is none on every force and no walls; LAND names it Mountain Pass | src/domain/display/validationOnPage.js (line 128 at f663a2699) CHAIN_INPUTS |
| MED | 1 | 19744 | Journal/Resources & Production | r2r-town-30 | Nearby resources: Hot Springs Mineral, Mountain Timber, Grain Fields, Ancient Grove, Defended Pass | lists a Defended Pass; DEFENCE has no garrison, militia, wall or hired force, only a Town watch; GOVERNMENT calls it underdefended | src/domain/display/validationOnPage.js (line 128 at f663a2699) CHAIN_INPUTS |
| MED | 1 | 17200 | PDF/DefenseSecurity | r2r-city-56 | Money enough to ride out a long crisis, laid by before the split between the powers and the debt crisis: emergency measures can be paid for, and the garrison kept paid while it lasts. | claims money enough to ride out a long crisis and the garrison kept paid; STATE prosperity is Poor and one crisis is Indebted to Outside Power | src/domain/display/prosperityInCrisis.js (line 100 at f663a2699) prosperityInCrisisLine |
