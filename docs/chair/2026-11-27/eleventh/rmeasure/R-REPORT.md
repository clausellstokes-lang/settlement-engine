# R-MEASURE: the whole-town items over C and V (900 births each), at df0401af6

Every count is a script's (CONFIRMED) unless marked PLAUSIBLE. Pages = the owner's dossier as OutputContainer renders it with the census store, every tab and disclosure walked; share = toPublicSafe -> projectShareVeil -> OutputContainer readOnly playerView (PublicDossierView's props); PDF = buildPrintProse + the Daily Life slots + composeCrisisPage (the PDF's own composers, not its renderer).

## R1 builder's reason as prose (Crisis)

- **Home:** src/domain/crisis/crisisCast.js :: CAST_REASONS.nextInLine, appended by deriveCrisisCast's take() and STORED in the cast row; printed by src/domain/crisis/crisisPage.js :: composeCrisisPage (Crisis tab, PDF CrisisSections) and by src/domain/crisis/crisisHooks.js :: castSentence (the crisis plot hooks, 'In the famine, X … takes the worst of it: <reason>.')
- **Fault test:** a printed line holds the nextInLine sentence (always a fault: it is the builder's note, not prose)
- **Count:** C 12 (Tho 0 Ham 0 Vil 6 Tow 1 Cit 4 Met 1), innocent 0; V 9 (Tho 0 Ham 1 Vil 5 Tow 1 Cit 1 Met 1), innocent 0
- **Kind of cure:** BIRTH (stored reason); a view cure reaches every record. composeCrisisPage and crisisHooks' castSentence drop the fixed '; next in line, …' suffix of a stored reason (a print-time strip of a constant: reaches every saved town; rewording the constant alone moves births).
- **Other surfaces:** share: yes, through the crisis plot hook on Plot Hooks (C 8, V see sub) though the Crisis tab is hidden there; PDF: yes (CrisisSections, measured through composeCrisisPage); session sheet: crisis hooks (PLAUSIBLE) | PDF composers (measured): C 12, V 9
- **Worked example:** C dp-village-5: {"view":"Summary/Crisis","line":"bears the brunt: Religious Authorities · its people tend the sick; next in line, the first choice already holding a role that contradicts this one"}

## R2 doubled sentence ends

- **Home:** src/components/new/SummaryTab.jsx :: characterSentence (recentConflict + '.'), a tab unmounted since X-5 (dossierLazyTabs.js); no live tab prints one
- **Fault test:** any printed line (owner and share, every tab) matching '..' (not an ellipsis), '. .', '?.', '!.', ',.', ';.', ':.', '.,' or '.;'
- **Count:** C 0 (Tho 0 Ham 0 Vil 0 Tow 0 Cit 0 Met 0), innocent 900; V 0 (Tho 0 Ham 0 Vil 0 Tow 0 Cit 0 Met 0), innocent 900
- **Kind of cure:** FORMAT. none needed on a live surface; if SummaryTab is ever re-mounted, drop the appended '.' when recentConflict already ends a sentence.
- **Other surfaces:** PDF state prose + daily life + crisis page, Tonight sheet: scanned, 0
- **Worked example:** (none)
- **Note:** Ioannorion's 'were beaten..' came from the retired Summary tab the chair's quick render mounted.

## R3 second name lower-cased (dossier)

- **Home:** src/components/new/SummaryTab.jsx :: tokenCase(v.source) (unmounted); the live PlotHooksTab uses nameOrTokenCase
- **Fault test:** a person's name printed with its second word lower-cased (case-sensitive), on any owner or share line
- **Count:** C 0 (Tho 0 Ham 0 Vil 0 Tow 0 Cit 0 Met 0), innocent 800; V 0 (Tho 0 Ham 0 Vil 0 Tow 0 Cit 0 Met 0), innocent 817
- **Kind of cure:** FORMAT. none on the dossier (PlotHooksTab is already right).
- **Other surfaces:** see R3 session row
- **Worked example:** (none)

## R3 second name lower-cased (session sheet)

- **Home:** src/components/session/SessionMode.jsx :: 'Threads to pull' heading tokenCase(hook.source)
- **Fault test:** the session sheet's hook headings (collectPlotHooks less the Tonight sheet's, first 12, tokenCase(source)) include a person's name with a lower-cased second word
- **Count:** C 892 (Tho 149 Ham 149 Vil 150 Tow 145 Cit 149 Met 150), innocent 0; V 893 (Tho 148 Ham 150 Vil 149 Tow 149 Cit 147 Met 150), innocent 0
- **Kind of cure:** FORMAT. SessionMode's heading takes nameOrTokenCase(hook.source), as PlotHooksTab does (one call).
- **Other surfaces:** session sheet only (measured through its view models: composeTonightSheet, collectPlotHooks, tokenCase); dossier, share: no; PDF PlotHooks: no tokenCase (PLAUSIBLE)
- **Worked example:** C dp-thorp-0: {"heading":"Zhong wu","of":3}
- **Note:** The dossier's own Plot Hooks tab is clean (R3: 0 on C and V, 800/817 pages print hook names correctly).

## R4 imminent threat beside its crisis in force (Daily Life)

- **Home:** src/data/dailyLife/recentChanges.js :: RECENT_CHANGES['threat.<kind>.any.imminent'] (T0/T1), drawn by src/domain/dailyLife.js :: deriveRecentChanges (acute open threat at stage imminent)
- **Fault test:** Daily Life prints a line of a threat.<kind>.*.imminent pool while the record's stress holds that kind's crisis (plague->plague_onset, famine, siege->under_siege, monster_pressure)
- **Count:** C 12 (Tho 3 Ham 2 Vil 3 Tow 3 Cit 1 Met 0), innocent 0; V 6 (Tho 0 Ham 2 Vil 2 Tow 0 Cit 2 Met 0), innocent 2
- **Kind of cure:** VIEW GATE. deriveRecentChanges skips an imminent-stage threat branch whose crisis is in force (or the imminent lines declare an exclusion atom 'crisis: <kind>'); view-time, so every saved town is reached (the shared page's stamped prose needs PUBLIC_PROSE_VERSION).
- **Other surfaces:** PDF: yes (IdentityDailyLife's slots); share: yes (Daily Life prints there) | share (measured): C 12, V 6 | PDF composers (measured): C 12, V 6
- **Worked example:** C dp-thorp-24: {"kind":"plague","crisis":"plague_onset","line":"A fever has begun to go round, and people are keeping their distance. There is sickness about, and it is getting close to a real outbreak."}

## R5/R10/R12 solvency line beside a present debt / no savings

- **Home:** A lines: src/data/dossierStateProse/economy.generated.js :: DS-ECO-8 pools.COMFORTABLE vid 1 ('purse closes every year ahead … money laid by behind it') and vid 2 ('People here put things by, and can.'), Daily Life standingOfLiving; src/domain/display/dossierViewModel.js :: deriveViability ('feeds itself and pays its way', SS2 'owes no one'). B lines: defense.generated.js :: DS-DEF-2 pools['Economic Survival: WEAK'] vid 5 ('would have to borrow the money first'), vids 1/2 ('nothing laid by'); DS-ECO-8 STRUGGLING v5; DS-POW-6 'operation role unlicensed revenue' v2; historyData.js indebted/foreign-debt tensions and hooks; unspokenTopics.js
- **Fault test:** on one page: a savings line (DS-ECO-8 COMFORTABLE v1/v2) beside a no-savings/borrow line (DS-DEF-2 WEAK), or any solvency line (savings, 'pays its way', 'owes no one') beside a PRESENT debt of the place (indebted crisis, the external-debt tension, its hooks, DS-ECO-8 v5, DS-POW-6 v2, Daily Life's owed-to-outsiders lines, other present-tense place-debt sentences); a sentence naming a person is a person's debt and is not counted
- **Count:** C 165 (Tho 23 Ham 26 Vil 19 Tow 20 Cit 27 Met 50), innocent 202; V 89 (Tho 8 Ham 15 Vil 10 Tow 10 Cit 20 Met 26), innocent 125
- **Kind of cure:** VIEW GATE. DS-ECO-8 COMFORTABLE v1/v2 and deriveViability's 'pays its way'/'owes no one' rows each read the same two facts the B homes read (economic survival grade WEAK; a present place debt: stress indebted or an external-debt tension) and stand down to a sibling that claims no savings and no freedom from debt; view-time desks, so all saved towns are reached (shared page: PUBLIC_PROSE_VERSION bump).
- **Other surfaces:** share: yes (both lines printed on the share); PDF: yes (state prose daily_life + defense + the viability rows) | share (measured): C 88, V 46 | PDF composers (measured): C 47, V 22
- **Worked example:** C dp-thorp-3: {"a":"World/Daily Life :: Khansaray's purse closes every year ahead.","b":"Systems/Defense :: Khansaray has nothing laid by to pay for a long defence, and whoever is called to make one knows it."}
- **Note:** The 'soft' pair (a solvency line beside the grade Weak only) is counted apart in R5R10R12-softWeak.

## R5 soft pair: solvency line beside the grade Weak only

- **Home:** OverviewTab Systems Health 'Economic Resilience' and DefenseTab 'Economic Survival' (defenseProfile score band) against the A lines above
- **Fault test:** an A line on a page whose only B is the Weak grade
- **Count:** C 151 (Tho 52 Ham 59 Vil 40 Tow 0 Cit 0 Met 0), innocent 0; V 62 (Tho 19 Ham 27 Vil 16 Tow 0 Cit 0 Met 0), innocent 0
- **Kind of cure:** WORDING. no change proposed until the owner says whether 'Weak' resilience contradicts 'pays its way' (it need not: one is a margin, the other a shock).
- **Other surfaces:** share: yes; PDF: yes (PLAUSIBLE)
- **Worked example:** C dp-thorp-2: {"a":"Systems/Outlook :: Rossford feeds itself and pays its way, and buys in some of what it cannot make for itself.","b":"Summary/Overview :: Economic ResilienceWeak"}

## R6 scarcity tension that never names the good

- **Home:** src/data/historyData.js :: HISTORICAL_EVENTS_DATA resource_scarcity (description; byMemory.unanchored.description), stored in history.currentTensions[].description at birth
- **Fault test:** a page prints the scarcity tension ('a critical resource is running short' / 'became scarce') and another of its lines names the short good (DS-ECO shortfall 'brings up enough <good>', 'no <good> lies near', '<Good> is short this season', '<good> supply is tighter')
- **Count:** C 12 (Tho 0 Ham 0 Vil 2 Tow 2 Cit 3 Met 5), innocent 73; V 14 (Tho 0 Ham 0 Vil 2 Tow 2 Cit 7 Met 3), innocent 82
- **Kind of cure:** BIRTH (stored description); a view cure can reach it. where the record names the short good (the same reader as DS-ECO's shortfall line), the tension prints a named twin ('Timber is running short …'); print-time, so saved towns are reached; the stored string stays.
- **Other surfaces:** share: yes (History/Overview tensions); PDF: yes (HistoryFounding currentTensions, PLAUSIBLE) | share (measured): C 12, V 14 | PDF composers (measured): C 0, V 0
- **Worked example:** C dp-village-23: {"tension":"World/History :: A critical resource became scarce, causing hoarding and price gouging","named":["Systems/Economics: enough timber"]}

## R6 one tension led into more than one hook

- **Home:** src/components/new/SummaryTab.jsx (unmounted) printed the tension above each of its hooks; the live PlotHooksTab groups a tension's hooks under one heading
- **Fault test:** a tension description printed twice or more within one snapshot of one panel (the walk's per-snapshot repeat count)
- **Count:** C 0 (Tho 0 Ham 0 Vil 0 Tow 0 Cit 0 Met 0), innocent 900; V 0 (Tho 0 Ham 0 Vil 0 Tow 0 Cit 0 Met 0), innocent 900
- **Kind of cure:** FORMAT. none on a live surface.
- **Other surfaces:** none measured
- **Worked example:** (none)

## R7 'not every account squares' with no tab saying which

- **Home:** src/data/dossierStateProse/general.generated.js :: DS-GEN-11 pools['criticalIssueCount: critical contradictions on the record'] (7 vids), keyed by src/domain/display/stateProse/generalStateProse.js :: criticalIssuePoolKey (count > 0 OR battery judgment needs_review), shown by ViabilityTab's verdictLines
- **Fault test:** the pool prints and the Outlook tab prints no non-stress critical issue by title (only stress consequences count, or the count is 0 and the battery said needs_review: its findings print only on the staff panel)
- **Count:** C 94 (Tho 6 Ham 11 Vil 21 Tow 41 Cit 6 Met 9), innocent 23; V 78 (Tho 6 Ham 8 Vil 15 Tow 34 Cit 10 Met 5), innocent 40
- **Kind of cure:** VIEW GATE. criticalIssuePoolKey counts only the issues the Outlook tab lists as contradictions (not stress_consequence) and does not take recordClean=false alone; else the pool is silent.
- **Other surfaces:** share: yes; PDF: yes (buildPrintProse viability) | share (measured): C 94, V 78 | PDF composers (measured): C 94, V 78
- **Worked example:** C dp-thorp-28: {"line":"A visitor who asks about Kallichori in more than one place will come away with answers that do not fit together.","cause":"count 0, battery needs_review","titles":[]}
- **Note:** Cause of the 117 C / 118 V pages that print the pool: count 0 with the battery's 'needs_review' (C 83, V 69: the battery's findings print only on the staff panel), only stress consequences (C 11, V 9), a non-stress critical issue (C 23, V 40: the Outlook lists it by title: innocent when it does).

## R8 'game from the woods' with no woodland

- **Home:** src/domain/foodways.js :: SOURCE_PHRASES.game[0], stored at birth as economicState.foodSecurity.foodRecord.foodwaysLine and record.foodwaysLine; re-read at print by foodwaysLineShown
- **Fault test:** the page prints 'game from the woods' and the record's nearbyResources hold none of managed_forest, ancient_grove, shipbuilding_timber, mountain_timber and its terrain is not forest
- **Count:** C 0 (Tho 0 Ham 0 Vil 0 Tow 0 Cit 0 Met 0), innocent 38; V 19 (Tho 13 Ham 3 Vil 3 Tow 0 Cit 0 Met 0), innocent 17
- **Kind of cure:** VIEW GATE (stored line, print-time re-read exists). the print-time re-read swaps 'game from the woods' for its sibling 'the hunters' game' where the record holds no woodland (reaches every saved town).
- **Other surfaces:** share: yes; PDF: yes (IdentityDailyLife foodways) | share (measured): C 0, V 19 | PDF composers (measured): C 0, V 0
- **Worked example:** V dp-thorp-24: {"line":"Each holding grows for its own table, and beyond that its food is game from the woods. Smoking, drying, fermenting, and winter storage are central household technologies.","terrain":"plains","res":["hunting_grounds","crossroads_position","gemstone_deposits"]}
- **Note:** Every C birth holds woodland (C's resources always include a woodland resource), so the test cannot fire on C; V: 19 faults (thorp 13), e.g. a plains thorp with hunting grounds only.

## R8 commodity listed under a category its page says is needed and not brought in

- **Home:** src/domain/display/commoditiesShown.js :: commoditiesShown (resourceData commodities, e.g. gemstone_deposits -> 'luxury') against src/domain/display/tradeListDisplay.js :: importsAsPrinted(record).needed ('Needed, and not brought in: … luxury goods')
- **Fault test:** a commodity chip equals, after stripping ' goods' and a plural s, a name on the page's 'Needed, and not brought in' list
- **Count:** C 120 (Tho 0 Ham 0 Vil 52 Tow 68 Cit 0 Met 0), innocent 740; V 37 (Tho 0 Ham 0 Vil 20 Tow 17 Cit 0 Met 0), innocent 692
- **Kind of cure:** VIEW GATE. importsAsPrinted's needMetBy also counts a commodity the place's own resources list (a need met at home is not printed as unmet).
- **Other surfaces:** share: yes; PDF: Needed line not printed, commodities yes (no pair) | share (measured): C 120, V 37
- **Worked example:** C dp-village-2: {"need":"Needed, and not brought in: stone, luxury goods.","chips":["luxury"]}

## R11 date palms print grain the food record does not name

- **Home:** src/data/resourceData.js :: date_palms (commodities ['grain','dates'], tradeGoods 'Desert grain') against economicState.foodSecurity.foodRecord.foodSources
- **Fault test:** date_palms held, foodSources lack grain, and the page prints 'Desert grain' or a 'grain' row on Economics/Resources
- **Count:** C 0 (Tho 0 Ham 0 Vil 0 Tow 0 Cit 0 Met 0), innocent 0; V 14 (Tho 1 Ham 5 Vil 2 Tow 2 Cit 4 Met 0), innocent 7
- **Kind of cure:** BIRTH. date_palms' commodities and trade goods carry 'dates' only, or the food record admits the palms' grain at birth; a view cure could hide the printed 'grain' rows but not the stored exports or the refused field rite.
- **Other surfaces:** share: yes; PDF: yes (PLAUSIBLE) | share (measured): C 0, V 14
- **Worked example:** V dp-thorp-22: {"sources":[],"lines":["Systems/Economics: Date harvestDesert grainWater rightsOasis provisionsMedicinal herbsWild honey"]}
- **Note:** C holds no date palms (0 pages). V: 21 date-palm pages; 14 print 'Desert grain' with no grain among the food sources: 7 with a non-empty source list (livestock or game: the field-rite-refused class the list counted ~4 of 2,700) and 7 with an EMPTY source list (the rite stands there: unanswered).

## R13 a role title where a name belongs (tie lines)

- **Home:** src/data/people/personMention.js :: secondMentions (rule 2: a later mention takes the card's role 'as the card states it'), over the tie lines of src/data/npcData.js (pairProse), stored at birth in relationships[].description/tension
- **Fault test:** in a sentence that names a person in full, a card's bare capitalised role (no article: 'Elder', 'Headman') stands alone (not before a name, not in a power's name, not after 'the' or in an apposition)
- **Count:** C 243 (Tho 4 Ham 30 Vil 36 Tow 57 Cit 57 Met 59), innocent 506; V 210 (Tho 0 Ham 27 Vil 43 Tow 41 Cit 51 Met 48), innocent 529
- **Kind of cure:** BIRTH (stored tie strings); a view cure can reach ties. secondMentions' rule 2 takes a role only when it reads as a description ('the miller'), else falls to rule 3 (the surname); a print-time pass could swap a bare npc1Role/npc2Role back to the surname on stored ties only.
- **Other surfaces:** share: yes (same count); PDF: yes (Relationships prints descriptions, PLAUSIBLE)
- **Worked example:** C dp-thorp-87: {"view":"World/Relationships","line":"Someone else has learned what favour Eirik Ragnarsson owes Brynjar Eriksson, and now has a hold on Elder too.","title":"Elder"}

## OVERVIEW-NAMES-THE-SEAT

- **Home:** src/domain/summary/settlementQuickGuide.js :: governsLine (via src/components/new/overviewIdentity.js :: overviewIdentityOf; the share reads the stamped publicProse 'overview:identity')
- **Fault test:** the Overview prints 'Governed by <power>' while the Power tab's 'The seat' names a person of the roster
- **Count:** C 872 (Tho 146 Ham 148 Vil 148 Tow 141 Cit 147 Met 142), innocent 28; V 879 (Tho 148 Ham 148 Vil 149 Tow 143 Cit 147 Met 144), innocent 21
- **Kind of cure:** VIEW GATE. governsLine names holderOf(settlement, {audience}).person where one holds the seat ('Governed by <power>, seat held by <name>'), the power alone where the seat is empty or the face is veiled to the reader; the stamped share line needs PUBLIC_PROSE_VERSION.
- **Other surfaces:** share: yes ('Governed by' printed there) | share (measured): C 872, V 879
- **Worked example:** C dp-thorp-0: {"overview":"Governed by Elder Council","power":"The seatZhong Wu, the head shepherd and Elder"}

## OVERVIEW-NAMES-THE-SEAT: holders veiled / withheld on the share

- **Home:** src/domain/seat/holderOfSeat.js :: holderOf (reader audience drops a veiled face) / src/domain/people/cardPowers.js :: cardInstitutionVeilOf
- **Fault test:** of the SEAT pages: the card veil says 'veiled' (cardInstitutionVeilOf), or the share's Power tab 'The seat' names another or no holder
- **Count:** C 0 (Tho 0 Ham 0 Vil 0 Tow 0 Cit 0 Met 0), innocent 0; V 39 (Tho 0 Ham 0 Vil 0 Tow 18 Cit 14 Met 7), innocent 0
- **Kind of cure:** VIEW GATE. the share's Power paragraph and the Institutions connection read the same reader holderOf the seat cell reads (or the seat cell stops withholding a face nothing else hides); a governsLine cure must read the reader's holderOf.
- **Other surfaces:** share
- **Worked example:** V dp-town-7: {"holder":"Donal Murphy","veiled":false,"shareSeat":"The seatNo named seat-holder stands in the record. The chain ends, honestly, at the power.","shareNamesHolderAnywhere":true}
- **Note:** Card veil 'veiled': 0 on C and V. But on V 39 share pages (town 18, city 14, metropolis 7; the owner's Power reads '<power> … criminal sway') print the seat cell as 'No named seat-holder stands in the record. The chain ends, honestly, at the power.' while the SAME share names the holder in the Power paragraph ('Donal Murphy, the mayor, holds its seat') and on Institutions ('Connection: Lord Mayor Donal Murphy'): the share contradicts itself, and if the withholding is meant, it leaks.

## R5 + R10 + R12: the pair table (line A, line B, pages on C, pages on V)

| line A | line B | C | V |
|---|---|---|---|
| A pays its way (Outlook) | B other place debt (borrow/debt/owes, no person) | 195 | 121 |
| A pays its way (Outlook) | B Economic Resilience Weak (Overview) | 172 | 66 |
| A purse closes ahead (DL) | B other place debt (borrow/debt/owes, no person) | 134 | 53 |
| A money laid by (DL purse) | B other place debt (borrow/debt/owes, no person) | 134 | 53 |
| A puts things by (DL) | B other place debt (borrow/debt/owes, no person) | 123 | 48 |
| A pays its way (Outlook) | B Economic Survival Weak (Defense) | 77 | 24 |
| A purse closes ahead (DL) | B Economic Resilience Weak (Overview) | 63 | 26 |
| A money laid by (DL purse) | B Economic Resilience Weak (Overview) | 63 | 26 |
| A puts things by (DL) | B Economic Resilience Weak (Overview) | 61 | 20 |
| A pays its way (Outlook) | B hook: creditor / loan / collectors | 44 | 26 |
| A pays its way (Outlook) | B would have to borrow (Defense) | 46 | 19 |
| A puts things by (DL) | B hook: creditor / loan / collectors | 39 | 16 |
| A had money laid by | B other place debt (borrow/debt/owes, no person) | 32 | 20 |
| A purse closes ahead (DL) | B hook: creditor / loan / collectors | 34 | 15 |
| A money laid by (DL purse) | B hook: creditor / loan / collectors | 34 | 15 |
| A purse closes ahead (DL) | B Economic Survival Weak (Defense) | 29 | 14 |
| A money laid by (DL purse) | B Economic Survival Weak (Defense) | 29 | 14 |
| A puts things by (DL) | B Economic Survival Weak (Defense) | 30 | 10 |
| A pays its way (Outlook) | B history: borrowed from a foreign power / debt called in | 25 | 15 |
| A puts things by (DL) | B would have to borrow (Defense) | 23 | 7 |
| A purse closes ahead (DL) | B would have to borrow (Defense) | 19 | 8 |
| A money laid by (DL purse) | B would have to borrow (Defense) | 19 | 8 |
| A pays its way (Outlook) | B nothing laid by for a defence | 10 | 13 |
| A puts things by (DL) | B history: borrowed from a foreign power / debt called in | 17 | 5 |
| A purse closes ahead (DL) | B history: borrowed from a foreign power / debt called in | 13 | 6 |
| A money laid by (DL purse) | B history: borrowed from a foreign power / debt called in | 13 | 6 |
| A pays its way (Outlook) | B present place debt (other homes) | 11 | 5 |
| A pays its way (Outlook) | B tension: owes a heavy debt to an outside power | 10 | 5 |
| A had money laid by | B hook: creditor / loan / collectors | 8 | 7 |
| A puts things by (DL) | B present place debt (other homes) | 9 | 5 |
| A puts things by (DL) | B tension: owes a heavy debt to an outside power | 9 | 3 |
| A puts things by (DL) | B nothing laid by for a defence | 6 | 5 |
| A purse closes ahead (DL) | B present place debt (other homes) | 6 | 4 |
| A money laid by (DL purse) | B present place debt (other homes) | 6 | 4 |
| A purse closes ahead (DL) | B nothing laid by for a defence | 5 | 3 |
| A money laid by (DL purse) | B nothing laid by for a defence | 5 | 3 |
| A puts things by (DL) | B daily life: what the place owes | 5 | 3 |
| A purse closes ahead (DL) | B tension: owes a heavy debt to an outside power | 5 | 3 |
| A money laid by (DL purse) | B tension: owes a heavy debt to an outside power | 5 | 3 |
| A pays its way (Outlook) | B daily life: what the place owes | 4 | 1 |
| A had money laid by | B history: borrowed from a foreign power / debt called in | 3 | 2 |
| A owes no one | B other place debt (borrow/debt/owes, no person) | 0 | 5 |
| A purse closes ahead (DL) | B DS-POW-6 v2 the town's debts start in one house | 2 | 1 |
| A money laid by (DL purse) | B DS-POW-6 v2 the town's debts start in one house | 2 | 1 |
| A puts things by (DL) | B indebted crisis in force | 1 | 2 |
| A owes no one | B Economic Resilience Weak (Overview) | 0 | 3 |
| A purse closes ahead (DL) | B daily life: what the place owes | 2 | 0 |
| A money laid by (DL purse) | B daily life: what the place owes | 2 | 0 |
| A puts things by (DL) | B DS-POW-6 v2 the town's debts start in one house | 2 | 0 |
| A pays its way (Outlook) | B DS-POW-6 v2 the town's debts start in one house | 1 | 1 |
| A owes no one | B Economic Survival Weak (Defense) | 0 | 2 |
| A had money laid by | B tension: owes a heavy debt to an outside power | 1 | 0 |
| A had money laid by | B present place debt (other homes) | 1 | 0 |

## R10 and R12, split out (CONFIRMED)

- DS-ECO-8 STRUGGLING v5 ("Whoever keeps {S}'s purse pays the most pressing debt…") prints on C 8 / V 21 pages; beside a solvency line on 0 / 0.
- DS-POW-6 'operation role unlicensed revenue' v2 ("The town's debts start in one house…") prints on C 8 / V 11; beside a solvency line on C 5 / V 2 (e.g. V dp-town-63: "Katokastro's purse closes every year ahead. … there is money laid by behind it." beside "The town's debts start in one house and are collected in another…").
- R12 "owes no one" (deriveViability SS2) prints on C 0 / V 5 (thorps, hamlets); beside a PRESENT place debt on 0 / 0 (only beside the Weak grade, 3 of 5). The 4-of-300 master-born case does not recur on this tree's V.

## R9 (design fact, read: PLAUSIBLE)

The draw is `src/domain/traditions/genesis.js :: deriveFoundingTraditions`, pure and seeded from the record's `_seed` (else `id`), reading the tier, `config` (terrain, culture, tradeRouteAccess), the deity snapshot, and for the field rite `economicState.foodSecurity.foodRecord.foodSources` + the farmland atom (`fieldRiteRefused`). It runs at VIEW time in preview (TraditionsTab through `shownTraditions.js`, which drops rows whose declared need the place lacks) and once at the first-lit tick (`traditionsKernel.js`), which stores the recs. A needs-aware draw for NEW births only: YES, behind a NEW floor literal read by `settlement.schema.js :: bornAtOrAfter` (as `FIELD_RITE_SINCE` does), but only if `GENERATOR_VERSION` (now '0.10.0', the stamp every town born and saved from this tree carries) is bumped with it; a floor of '0.10.0' itself would re-deal every town already saved at 0.10.0. Lit towns keep their stored recs either way.

## THE VACUOUS ROW (CONFIRMED)

The cell on this tree is the same seven places as the test's CELL (C dp-hamlet-117, dp-village-51, -54, -76; V dp-hamlet-100, -139, dp-village-76); none holds fish (foodSources: [], game, livestock). A hand-set record: V dp-hamlet-139 with `economicState.foodSecurity.foodRecord.foodSources = ['fish']` stays in the cell (famine true, production adequate, fish true); renamed "Frostdale" (the pick is keyed by name) it prints the fare "Every fish that comes in is counted, and the shares are measured out house by house." (K2) and Dawn Work "Every hand that can be spared is out at first light, and what comes in is counted before it is eaten." (K1): (c)'s "neither C7 nor K2" FAILS on it. Under its own name (Frostdal) with fish it prints fare "Most households eat less than they need, and the children are fed first." and dawn "Those who fish are out before light, and what they bring back decides what is eaten that day." (tools/vacuous.mjs, vacuous2.mjs).
Side reading (my births, deriveDailyLife audience owner): K1 prints at C dp-village-54, C dp-village-76 and V dp-hamlet-100, NOT at the test's K1_PLACES (C dp-hamlet-117, V dp-hamlet-139, which print "Dawn work is the search for food: …"). If so, close7Mirror (c) is red on this tree for at least four of its seven rows (not run: no vitest).

## METHOD

Births: `birthConfig(row.config)`, `{ seed, customContent: {} }`, plans `plan-C.json` (config {settType}) and `plan-V.json` (plan-lit configs), born fresh on /home/user/wt/rmeasure at df0401af6. Render: esbuild bundle of the tree's own OutputContainer and walk (tools/harness.jsx, build.mjs, boot.mjs; jsdom; the census's mocks and store), plain node, niced, one process at a time in chunks of 75 (the first single process grew past 2.3 GB, so the batch was cut). The walk is the tree's walkDossier copied with one addition: per-snapshot repeat counts. Analysis: tools/analyze.mjs (results res-C.json, res-V.json; an-C.txt, an-V.txt). Corpora: C.jsonl, V.jsonl (owner views, share views, repeats, the stamped record), 0 errors of 1,800.
