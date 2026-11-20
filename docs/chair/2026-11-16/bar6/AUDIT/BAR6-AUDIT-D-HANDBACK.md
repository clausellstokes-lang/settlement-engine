# BAR6-AUDIT-D · LAW 8 · one state for a thing on every surface — HAND-BACK

Seat D of BRIEF-BAR6-AUDIT (the chair's lane: `docs/chair/2026-11-14/briefs/BRIEF-BAR6-AUDIT.md`). Rendered at the joined
line's tip 600b7683a, in a scratch worktree with its own `npm ci`, with `lane/bar5-audit-a-2026-11-16` (c0ea05497) and
`lane/bar5-audit-b-2026-11-16` (d40d6ab28) merged once. Nothing under `src/` changed; no test file added; no file of
another seat edited (seat B's `pageB.mjs`, `law2.mjs`, `law3.mjs` and `traceB.mjs` are read and run as they are).

THE DETECTOR: `tests/helpers/pageLaws/law8.mjs`. THE RUNNER (for the chair, over ANY PAGE-COPY render):

    node docs/chair/2026-11-16/bar6/AUDIT/runD.mjs <render-dir> <out.json> [SECOND-CHECK.final221.json SECOND-CHECK.final72.json]

It prints counts by rule (towns, instances, distinct lines, things), runs LAW 2 and LAW 3 unchanged beside it (their
rules of this shape: the round in flight's), marks each LAW 8 instance that sits on a line they find (`heldBy`), and with
the second-check files prints the controls table (`controlsD.json`; exit 3 when a STANDS control is missed or an
EXPLAINED one found). `tablesD.mjs` builds `TABLES-D.md` from the outputs; `sampleD.mjs` makes the seeded precision draw.
Runs: `tables-d/RUN-D.{150,bar30,720,300}.txt`. Draws: `tables-d/PRECISION-D.720*.md`.

THE RULES. A THING is a house, a service, a good a house works, a ground, a harvest, an export, an income, an operation,
a person's trade. Its WORST STATE is read once from the page's own lines; an instance is the same thing on another surface
with no mark and no word of it (a chip under a marked card is covered: the second check's rule 1).
- 8a.input · a good the page says is not had ("Needed, and not brought in: X"; "<work> here depend on X from outside, which the siege has cut off"; "the smiths have nothing to mend tools with"; "No X reaches the H." for H alone; under a shut siege, a house's "Short of X." or a marked row's "Needs X"), on every bare house whose trade cannot go on without X (the record's "Required by H", or the house's trade by name). A good the page says is produced locally, available or (no siege) imported is skipped. `8a.mild`: the same where the page gives the house "Vulnerable" (WEAK, counted apart).
- 8b.extract · a mine or quarry whose every ground is printed depleted, its extraction bare. 8b.person · a person's "How they deal" that sells, grinds or mixes, where the person's house is starved (8a/8b), "Short of X." or "Stopped by"; not a line hedged on the input ("when there is clay to be had") or selling stock ("what is on the shelves").
- 8c.harvest · "Grain at harvest" bare under "Harvest Scarce in the famine." or a failed grain; 8c.export · food on the export list under the same; 8c.failed · a market's wares naming the failed source; 8c.surplus · a house that "only runs when grain is in surplus", bare in a famine.
- 8d.export · under a siege, a service-economy row "· Service · Export○ Operational" beside "none of them can reach a buyer now", or left off the page's own export list; 8d.income · under a siege, an income row bare whose chain of the same name is Impaired on depleted ground, beside marked rows (not a row that says its iron is imported); 8d.transport · under a siege that closes the road, a land-transport Services row bare beside other transport rows stopped (not boats).
- 8e.crime · the Defense tab's active operation whose card is "Stopped by the siege."; 8e.open · "<house> is open but short of supplies" where the card is stopped and every service with it; 8e.outlook · a house the Outlook names "critically impaired", bare on its card; 8e.svcOutput · a service-economy row Operational whose output is a service the page stops.

## 0. THE SURFACE CENSUS (where the page prints a house, a service, a chain, a resource, an export, an income, an operation or a trade)

| # | tab | row form as printed | component · the file that decides its state | reads the mark leaf (`crisisStoppedRow.js :: rowMarkText`)? |
|---|---|---|---|---|
| S1 | Institutions | `<House> · <Category>[ · Impaired]` / `[Stopped by…│Curtailed by…│Scarce in…│Short of X.] <desc>` / `Services · <svc>[ (stopped│curtailed│scarce│short)] · …` | `InstitutionsTab.jsx` · `crisisStoppedRow.js`, its short cause `housesShortOfInput` (the record's gaps only) and `houseInputAtHand.js` | YES |
| S2 | Services | `<svc>[ Impaired]` / `[mark] <desc>` / `<House>` / `[Needs X.…]` / `[<town>'s <House> is open but short of supplies, …]` | `ServicesTab.jsx` · the same leaf; the closing line `dossierStateProse/economy.generated.js` | rows YES; the closing line NO |
| S3 | Economics · Income Sources | `<n>%` / `<Source> [mark] <desc>` | `EconomicsTab.jsx` · `economicsCrisisMarks.js` → `rowStoppedBy(…,'income')`, `INCOME_TRADE_HOUSES` | YES, by the share's source and its trade's houses; NOT by the chain of the same name |
| S4 | Economics · Trade Profile | `Exports` / `a · b · c`; `Imports` / …; `Needed, and not brought in: …`; `Produced locally` / … | `EconomicsTab.jsx` · `tradeListDisplay.js`, `criticalImportsShown.js` | NO (lists print bare) |
| S5 | Economics · Service economy | `<Label> · Service[ · Export](○ Operational│ · Impaired)` / `Via: · <house>` / `<output>` | `EconomicsTab.jsx` (the services block, `svcImpaired` from `impairedHousesOf`) · record `economicState.institutionalServices[].status` | NO: the house's impairment only; not the siege's export reach, not a chip's stop |
| S6 | Economics · Economic Flows | `<Chain> · <cat>(✓ Running│○ Operational│ · Impaired)` / `From` / `<ground>[ (depleted)]` / `Via` / houses / `Outputs│Normally yields` / goods / `Contributes to <income> - n%` | `EconomicsTab.jsx` · `chainStateShown.js`, `economicsCrisisMarks.js` | YES (the card); its outputs NO (LAW 3 `L3.outputs`) |
| S7 | Economics · Food Security | the food line, the stores line | `foodways.js`, `foodBalance.js` | partly (BAR5-FOOD) |
| S8 | Resources | `Nearby Resources` / `Abundant│Depleted` / grounds; `Commodities available` / list; `Gaps & Opportunities` / `No X reaches the H.`; the depleted sentence `Nothing more can be taken from the …` | `ResourcesTab.jsx` · `validationOnPage.js :: resourceGapLines`, `economy.generated.js` | NO (lists print bare: LAW 3 `L3.failedFood`) |
| S9 | Defense | `Active criminal operations` / `<Operation>` / `<note>` | `DefenseTab.jsx` (`crimInsts`, `criminalOpNote`) | NO |
| S10 | NPCs | `How they deal <line>`; `Wants <line>` | `npcComponents.jsx` · `npcGenerator.js`, `npcData.js` (by the person's trade) | NO |
| S11 | Outlook | `Active Stress Effects` / `<n> institutions critically impaired by siege: A, B, …` | `ViabilityTab.jsx` · `generators/economy/viability.js` | NO (its own list, drawn apart from the marks) |
| S12 | Overview, Plot Hooks, the crisis prose | "War has taken the iron … the smiths have nothing to mend tools with"; "<work> here depend on X from outside, which the siege has cut off"; "none of them can reach a buyer now" | `economy.generated.js`, the crisis hooks | it IS a worst-state source; the rows do not read it |

The PDF, the Tonight sheet and the Foundry journal print S1–S6 again (`pdf/sections/*`, `foundry/journalPages.js`, which read the leaf); LAW 8 counts the dossier tabs only, as the second check reads them.

## 1. THE CONTROLS

Every STANDS control of every sub-rule is FOUND and no EXPLAINED control is (`controls off: 0` on the 150 and the bar's 30,
`tables-d/RUN-D.150.txt`, `RUN-D.bar30.txt`). HELD = found by a LAW 2/3 rule of the round in flight, not by LAW 8.

| rule | control | verdict of the check | found by |
|---|---|---|---|
| 8a | C2044 C25035 C25141 C73413 C127752 C145096 C124324 C16139 C16118 | STANDS | 8a.input |
| 8a | C217422 (the maltster) | STANDS | 8c.surplus |
| 8a | the glassblower beside C191251 (EXPLAINED itself; the brief's expected row) | — | 8a.input |
| 8a | bar: C8174 C11307 C0333 C0927 C31652 | STANDS | 8a.input (C31652 also 8b.person) |
| 8a | bar: C5441 · C3231 | STANDS | HELD: L2.siege.abroad · L2.famine.meat |
| 8b | C93275 · C93688 C88140 | STANDS | 8b.extract · 8b.person |
| 8b | C84503, C20632 | WEAK (apart) | clear |
| 8c | C211281 C213905 · C217521 · C210715 | STANDS | 8c.harvest · 8c.failed · 8c.export |
| 8c | bar: C42947 C42011 | STANDS | HELD: L3.failedFood |
| 8d | C5702 C26071 C26077 C33585 · C25863 · C96793 | STANDS | 8d.export · 8d.income · 8d.transport |
| 8d | bar: C8475 | STANDS | HELD: L2.war.animals |
| 8e | C8633 · C25827 | STANDS | 8e.crime · 8e.open |
| 8e | bar: C3874 C3911 · C17893 | STANDS | 8e.svcOutput · HELD: L3.chainOverStopped |
| NEG | C91105 C91625 C92201 C94583 C95095 C95709 (a chip under a stopped card), C19306 C37273 (the card Impaired), C89452 (the siege-time line), C93420, C10978, C86893, C0343 | EXPLAINED | all clear |

## 2. THE COUNTS (`TABLES-D.md`: by rule and population, the thirty commonest distinct lines of each rule with their towns, the writer files, the overlap)

| population | towns with a standing instance | instances | distinct lines | things (a house or a row once a town) | 8a.mild apart (WEAK) |
|---|---|---|---|---|---|
| the 150 (wide read, rand-27..41) | 59 (39 a hundred) | 293 | 79 | 147 | 33 in 10 towns |
| the census's 720 | 217 (30 a hundred) | 842 | 84 | 353 | 178 in 48 towns |
| the fresh 300 | 106 (35 a hundred) | 573 | 80 | 287 | 95 in 21 towns |

By rule (towns · instances · distinct lines · things), 150 / 720 / 300:
- 8a.input 46·200·49·78 / 186·702·59·267 / 84·412·55·159
- 8b.person 25·29·8·29 / 98·103·9·103 / 48·57·9·57; 8b.extract 1·2·2·1 / 0 / 0
- 8c (harvest, export, failed, surplus together) 7·13·7·8 / 2·2·2·2 / 3·5·3·3
- 8d.export 12·28·6·28 / 9·25·8·25 / 26·67·7·67; 8d.income 3·3·1·3 / 2·2·1·2 / 1·1·1·1; 8d.transport 2·4·2·2 / 1·3·3·1 / 1·2·2·1
- 8e.crime 7·7·1·7 / 4·4·1·4 / 18·18·1·18; 8e.outlook 1 / 0 / 3; 8e.open 1 / 0 / 0; 8e.svcOutput 5 / 1 / 8

THE COMMONEST LINES (the 720; full lists in TABLES-D.md): 8a: the vintner's "Table wine · Wine wholesale" where grapes are
needed and not brought in (the largest single family: 137 of 352 8a cards before the narrowing), then the cooper's barrels,
the carpenters' and woodcarvers' work where timber is, the luxury quarter's retail, the glassblower's vessels. 8b.person:
the vintner's "Sells by the cask and the bottle" (48), the sawmill's "Cuts to measure and sells by the length" (27), the
salt works' "Sells by the sack and the cart" (10). 8d: "<Service> · Service · Export○ Operational" (legal, entertainment,
religious, military, scholarly, alchemical, port, planar).

BY WRITER FILE (`traceB.mjs` over the 720's 113 distinct lines: 74 traced). The false line's text is written by
`src/data/institutionServices.js` (the service rows: 8a, 8d.transport), `src/data/people/titleSecretsPresentations.js`
(8b.person), `src/components/new/tabs/EconomicsTab.jsx` (the service economy, the export list: 8d.export, 8c.export,
8e.svcOutput), `src/generators/economy/incomeLineSiblings.js` (8d.income), `src/data/dossierStateProse/defense.generated.js`
(8e.crime). THE FAULT is not the text but the missing mark: the file that should give it is in section 4 for every rule.
The facts they should have read are printed by `dossierStateProse/economy.generated.js` (the siege's reach and its cut),
`criticalImportsShown.js`/`tradeListDisplay.js` ("Needed, and not brought in"), `validationOnPage.js` (the gap lines),
`crisisStoppedRow.js` (the marks other rows carry), `generators/economy/viability.js` (the Outlook's list).

## 3. PRECISION (judged by the second check's rules: STANDS, WEAK, EXPLAINED)

The draw: `sampleD.mjs` over the 720, seed 720 (all rules), then seed 721 for the rules narrowed after it
(`tables-d/PRECISION-D.720.md`, `tables-d/PRECISION-D.720.draw2.md`, each instance with its row, its `against` and the
lines around it). A rule with fewer than twenty instances in the 720 is judged whole, with the 150's instances beside it.

| rule | draw | STANDS | WEAK | EXPLAINED | verdict |
|---|---|---|---|---|---|
| 8a.input | seed 720 | 14 | 6 | 0 | under 17: NARROWED. The 5 WEAK were rows the page gives a milder state ("Blacksmiths · Crafts · Vulnerable", "Tool manufacture Vulnerable" beside "the smiths have nothing to mend tools with"); 1 was a luxury quarter where only spices are not brought in. Now: a house the page calls Vulnerable is counted apart as `8a.mild`; spices alone no longer starve a luxury quarter. |
| 8a.input | seed 721 (narrowed) | 20 | 0 | 0 | 20/20: vintners (grapes needed, not brought in), coopers and woodcarvers (timber), a glassblower (glass sand), smiths (metals), an apothecary (herbs cut off), a brewery (grain cut off). |
| 8a.mild | — | — | all | — | WEAK BY CONSTRUCTION (counted apart, not in LAW 8's standing count): the page prints a state, too mild for its own worst one. It is LAW 9's shape (a state word with two readings): seat E's. |
| 8b.person | seed 720 | 19 | 1 | 0 | 19/20. WEAK: a toll mill that "will grind for anyone who pays", where "No grain reaches the mill" (the customers bring the grain). Stands: the vintner "sells by the cask and the bottle" where grapes are needed and not brought in (8 of 20), the sawmill "cuts to measure" Short of timber (5), the salt works Short of salt (2), the dairy Short of livestock (= C88140), the glassblower (2), the apothecary under the herbs' cut. |
| 8b.extract | 150, whole (0 in the 720) | 2 | 0 | 0 | one house (the control C93275, both tabs). |
| 8c.harvest | 150, whole (0 in the 720) | 8 | 0 | 0 | four famine villages: "Grain at harvest" bare under "Harvest Scarce in the famine." (two are controls). |
| 8c.export | 720 + 150, whole | 4 | 0 | 0 | food exports bare under a scarce harvest or a failed grain ("Milled flour", "Dates and fruit", "Date harvest · Desert grain"). |
| 8c.failed, 8c.surplus | 150, whole | 3 | 0 | 0 | the controls C217521 and C217422 (both tabs). |
| 8d.export | seed 720 | 20 | 0 | 0 | 20/20: "· Service · Export○ Operational" beside "none of them can reach a buyer now" or an export list that leaves the service out; port revenue and planar commerce included (the same tab prints Planar Trade Impaired). |
| 8d.income | seed 720 | 3 | 1 | 3 | under 17: NARROWED. EXPLAINED: "Iron imported from mining regions and worked locally" beside a depleted ground (the row says where its iron comes from); WEAK: the row in a famine town (it still works what it holds). Now: siege only, and a row that says it is imported is skipped. |
| 8d.income | seed 721 (narrowed, whole) + 150 | 5 | 0 | 0 | "Iron & Metalwork Metal is smelted or worked here." under a siege beside its chain Impaired on depleted ground (= C25863). |
| 8d.transport | seed 720 | 3 | 11 | 0 | under 17: NARROWED. WEAK: barge construction and boat repair (filed under Transportation; a siege by road stops no boatwright). Now: water craft are skipped. |
| 8d.transport | seed 721 (narrowed, whole) + 150 | 7 | 0 | 0 | horse boarding, grooming, pack animal sales under a siege that closes the road, beside the other transport rows stopped (= C96793). |
| 8e.crime | 720 + 150, whole | 11 | 0 | 0 | "Smuggling Network" in the Defense tab's active operations, its card "Stopped by the siege." (= C8633). |
| 8e.open, 8e.outlook | 150, whole | 2 | 0 | 0 | the control C25827; the Mercenary quarter bare where the Outlook lists it among the houses critically impaired. |
| 8e.svcOutput | 720 + 150, whole | 6 | 0 | 0 | "Military Contracts · Service · Export○ Operational" (output "Armed escort & mercenary hire") beside "Mercenary hire (stopped)" (1) or "Escort (stopped)" (5). The escort-only form is the weakest of LAW 8's standing forms; every one of the six also sits under the siege's export reach (8d.export holds the same row). |

## 4. THE CURE'S FORM, by rule (proposed, not made)

THE ONE FACT FOR ALL OF LAW 8: the mark leaf `src/domain/display/crisisStoppedRow.js :: rowMarkText` already gives the
Institutions and Services rows their state from TWO causes (a crisis's declared dependence; a house short of its input).
Every instance below is either (i) a WORST STATE THE LEAF DOES NOT READ, or (ii) A SURFACE THAT DOES NOT READ THE LEAF.

| rule | THE ONE FACT (where the worst state should be read) | the surfaces that do not read it (file) | display only, or the stored record? |
|---|---|---|---|
| 8a.input | "This house's input is not had" is decided ONLY from the house's own gap line (`housesShortOfInput`: `resourceAnalysis.gaps` read through `validationOnPage.js :: resourceGapLines`) and the spent ground (`houseInputAtHand.js :: housesOnSpentGround`). It must also read (1) the critical imports' named house (`resourceAnalysis.imports.reasons` "Required by <house>", printed as "Needed, and not brought in": the vintner, the glassblower), (2) the critical imports' unnamed goods for every live house whose trade is that good (timber for the cooper, the woodcarver, the carpenters; metals for the smiths), and (3) the siege's and the war's own cut ("depend on X from outside, which the siege has cut off": `dossierStateProse/economy.generated.js`; "War has taken the iron": the war hook). ONE READER: `houseInputAtHand(record, chainKey, house)` returning 'missing' for those, read by `rowShortOf`. | `InstitutionsTab.jsx`, `ServicesTab.jsx` (through the leaf: they print what it gives) | DISPLAY ONLY (the mark is printed from the record; nothing stored moves). The PDF and the journal read the same leaf and follow. |
| 8a.mild | The card's state word ("Vulnerable", from the chain's status) and the leaf's mark are two readings of one house: where the leaf has a worse state the card prints it. | `InstitutionsTab.jsx` head, `ServicesTab.jsx` title (`chainStateShown.js`) | display |
| 8b.person | The person's own trade line is drawn by trade (`npcGenerator.js`, `data/people/titleSecretsPresentations.js`) and printed bare. It should read the person's house's mark (`rowMarkText(settlement, 'house', house)`) and take the mark's form or a twin. | `npcComponents.jsx` (World/NPCs) | display (a twin chosen at print reads the record; choosing it at the draw would move the stored NPC text) |
| 8b.extract | `houseInputAtHand.js :: housesOnSpentGround` (SV6) is the fact's home and reads the Depleted list; the open-cast mine of the control town (its every chain "From Iron ore deposits (depleted)", the Resources tab's "Nothing more can be taken") is NOT marked by it. WHY IT MISSES THAT MINE IS NOT TRACED (its catalogue id is `mine`, which `SPENT_GROUND_WORKERS` holds; the builder starts at that function with this town: bar0-hamlet-under_siege-rand-34). | through the leaf | display |
| 8c.harvest, 8c.export, 8c.failed, 8c.surplus | The famine's mark reads `foodRecord.failedSource` (a failed livestock source marks the dairy) but not the harvest's own "Scarce in the famine" (the income row's mark): the farmland's "Grain at harvest", the trade profile's food exports and a market's livestock do not read it; the maltster's own condition ("only runs when grain is in surplus") reads no surplus. One fact: the famine's scarce goods as the page marks them on the income row, read by the rows that sell them and the export list. | `ServicesTab.jsx`/`InstitutionsTab.jsx` through `crisisDependence.js` (no GRAIN on the farmland's harvest row under a livestock failure); `EconomicsTab.jsx` trade profile (`tradeListDisplay.js`) | display |
| 8d.export | The service economy card prints the record's `economicState.institutionalServices[].status` and its export tag; its impairment reads only its houses (`impairedHousesOf`). The siege's own reach ("none of them can reach a buyer now", `economy.generated.js`, from `stress`) is not read. One fact: under a stopping crisis that closes trade, an exportable service card reads the leaf's `rowStoppedBy(…, 'income')` of its own export, or prints its export as stopped. | `EconomicsTab.jsx` (the services block, lines ~255-275) | display; the stored `status: 'operational'` is the record's (curing it there moves the record of every besieged town with a service economy: count before) |
| 8d.income | The income share is marked by its source (`INCOME_DEPENDENCE`, `INCOME_TRADE_HOUSES`); "Iron & Metalwork" under a siege is not, while its chain of the same name prints Impaired on depleted ground. One fact: the share titled by a chain reads that chain's crisis state (`chainStateShown.js`). | `EconomicsTab.jsx` through `economicsCrisisMarks.js` | display |
| 8d.transport | The road's closing marks the transport rows declared TRAVELLERS; the stable's boarding and the pack-animal trader's sales are declared NONE (the dependence table), as BAR5-MARKS (a) names for the stables. | `data/crisisDependence.js` (the declaration) | display |
| 8e.crime | The Defense tab lists `crimInsts` by name with a note (`criminalOpNote`) and reads no mark. One fact: the list reads `rowMarkText(settlement, 'house', inst)`. | `DefenseTab.jsx` | display |
| 8e.open | The Services tab's closing line ("<town>'s <house> is open but short of supplies") is drawn from the prose pool for an impaired house and does not read that the house's every service is stopped: it needs a stopped twin. | `dossierStateProse/economy.generated.js` and its caller in `ServicesTab.jsx` | display |
| 8e.outlook | The Outlook's "N institutions critically impaired by siege" (`generators/economy/viability.js`) is a list drawn apart from the marks: a house it names is bare on its card. One fact: the list and the card read one reading (the leaf), or the list prints only what the leaf marks. | `viability.js` (stored in the record's viability block), `ViabilityTab.jsx` | THE STORED RECORD if cured at `viability.js` (the list is stored): count the reference configurations first; display only if the card reads the list |
| 8e.svcOutput | As 8d.export: the service card's output does not read its services' stops. | `EconomicsTab.jsx` | display |


## 5. THE OVERLAP WITH THE ROUND IN FLIGHT (things; `TABLES-D.md` last table; a thing with surfaces on two classes counts in each)

| class | 150 | 720 | 300 |
|---|---|---|---|
| 8a on the critical imports' named house (the vintner, the glassblower): BAR5-CHAINS (b), "the short mark reads … the critical imports' named house" | 23 | 155 | 55 |
| 8a on the war's iron (WM1) or a LAW 2 line (siege.cutgood, war.iron): BAR5-MARKS (b) and its LAW 2 rules | 9 | 8 | 26 |
| 8d.transport (the stables, the beasts for travellers): BAR5-MARKS (a) | 3 | 1 | 1 |
| 8c.export of a failed grain: BAR5-FOOD (a) | 0 | 1 | 0 |
| THE NEXT WAVE: 8a on a good by trade (timber for the cooper, woodcarver, carpenters; metals for the smiths; luxury goods; grain, wool or timber the siege cuts) | 46 | 105 | 80 |
| THE NEXT WAVE: 8b.person, 8b.extract, 8c (but the one above), 8d.export, 8d.income, 8e (all) | 83 | 136 | 157 |

BAR5-CHAINS (b) holds the record-named house on the Institutions and Services rows only: its PERSON (8b.person: 48 of the
720's 103 are vintners) does not read the mark, so a cure of (b) alone leaves that line standing.

## 6. FOR THE OWNER, IN PLAIN WORDS

About one town in three (30 of every hundred in the census, 35 in a fresh draw) prints at least one thing in two states:
the page says a good cannot be had, or the siege lets nothing out, and somewhere else on the same page the house that needs
that good, or the export that cannot leave, is printed as an ordinary day with no mark. In the census's 720 that is 353
things on 842 lines, written by only about 80 distinct sentences, because the same few rows repeat from town to town: a
cure by rule reaches them all.

How much one fact clears: most of those things (319 of 353 in the census, nine in ten; 193 of 287 fresh, two in three) are ONE fact, "this
house's input is not had", which the mark already prints when the record's own gap says so but does not read from the
page's "Needed, and not brought in", from the siege's cut or from the war's iron, and which the person's own trade line
does not read at all. Read once (one reader, `houseInputAtHand.js`, read by the mark and by the person's line), it clears
the vintners, coopers, carpenters, smiths and glassblowers and their people. The round in flight already holds four to
five in ten of those (163 of 319 in the census, 81 of 193 fresh: the vintner's family, the war's iron); the rest, and every siege-export row (a service sold abroad "Operational"
while the page says nothing reaches a buyer: 67 rows in 26 of a fresh 300), are the next wave's. None of these cures, in the form proposed (at print), moves
a stored town except the Outlook's list of impaired houses, which is stored: three things in the fresh 300.

NOT MEASURED HERE: the 8a.mild rows (the page prints "Vulnerable" where its own line says the thing cannot be had: WEAK,
LAW 9's shape, seat E's); why the open-cast mine escapes the spent-ground mark (section 4, 8b.extract).
