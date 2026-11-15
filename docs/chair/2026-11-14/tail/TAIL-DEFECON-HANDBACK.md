# TAIL-DEFECON · hand-back (kept current after every batch)

Seat: TAIL-DEFECON (builder), group DEFECON (the safety, defence and economy generators and their display). Branch
`lane/tail-defecon-2026-11-14`, cut from the joined line `lane/join-2026-11-14` at **bcad1a358** (read back from origin,
2026-11-14 23:02 UTC). Worklist: `docs/chair/2026-11-14/read-all/WORKLIST-DEFECON.{md,json}` on the chair's lane (88
rows, read at e5b421802). Seats: TAIL-DEFECON (batch 1), -2 (batch 2, the pilgrim gate), -3 (batch 3), -4 (the merge of
the joined line at d817736d8, batch 4, D28's table). At the base every one of the 88 folds still prints, in the town it was read in, in exactly the
worklist's count: none was struck "gone at the base".

## The rulings worked to (the chair's, 2026-11-14; each vetoable by the owner)

- (D1) AN INCOME ROW IS BORNE OUT BY THE PAGE: "Agricultural Rents … from tenant farmers" in a place of subsistence
  holdings (360 towns print the row: measure in how many no landlord or tenant stands); "Armed escort & mercenary hire"
  where no company stands (240).
- (D2) ONE HOME FOR ONE FACT: "Highly diversified" beside "two or three trades"; "buying in what its own land does not
  provide" where nothing is imported; the food-endurance line against the stores line.
- (D3) Under a siege "everyone comes and goes by the gates", "exports semi-finished goods" and "stalls that pay their
  fees" take a twin true under the siege, or the condition they need.
- (D4) THE DEFENCE RATING'S REBUILD IS NOT TOUCHED (bandLadders.js, its registers, its goldens): a row that needs a band
  changed is a STOP: tell the chair.
- (D5) The defence lane's last seat left measured rows in these files (a fish line, the gates under a siege, the crime
  summary): a matching row reads ONLY that row of "WHAT IS LEFT" in `docs/chair/2026-11-12/UPKEEP-HANDBACK.md`.
- (D6, 23:17 UTC) THE "MADE HERE" LIST IS NOT WHAT THE TOWN'S HOUSES MAKE (a good made or exported with no house that
  makes it in 522 of 720 towns; a category key printed as a good in 302). The maker is this group's
  `computeActiveChains.js :: deriveLocalProductionFromChains`. Two cures granted, patches applying at 06f36ad36
  (`lane/record-measure-2026-11-14`, `docs/chair/2026-11-14/probes/RECORD-MEASURE-1/c1a.patch`, `c2a.patch`; report
  `docs/chair/2026-11-14/RECORD-MEASURE-1.md`, rows c1 and c2 only): C1-A (step 1 asks the export's own
  RESOURCE_EXTRACTION_GATES; step 2 keeps a chain only where a house of THIS town processes it, read through
  `institutionalCatalog.js :: isFabricInstitution`, not the patch's regex) and C2-A (the seven category keys leave the made
  list). Target: localProduction ONLY moves, 407 towns (C1-A) and 302 (C2-A); c1 522 -> 469, c2 302 -> 0; another family
  moving is a STOP. Placed FIRST.
- (D7, 23:41) C1-A's gate: c1a.patch reds `tests/components/economicsProducedLocally.test.jsx` (2). THE SMITH'S IRON
  STAYS: a good is made where a house that WORKS it stands (smith, forge, smelter), not only where one digs it; widen the
  gate so that anchor stays green UNCHANGED. The other anchor ("a thorp that walks to a neighbour's church"): if it
  anchors a good whose maker stands on the roster (not an "Access to …" row) the gate is wrong; if a good no house makes,
  re-key it by identity and name what prints instead. The golden (525 configs under the four cures) and
  coherenceAgreeCures' gate tally (2 red at 06f36ad36) are NAMED, not re-taken. Check against: c2 302 -> 0; c1 printed
  452 -> 403; c3 52 -> 12.
- (X9, 00:00) The exports' read: `docs/chair/2026-11-14/read-all-3/WORKLIST3-DEFECON.{md,json}` on the chair's lane (43
  rows, 1 HIGH: watch towers and muster drills where the defence holds no one, 157 towns). Take a batch writer's rows
  there in the same batch (measure with `SURFACES=PDF,Journal python3 inventory.py`); that read's header showed no seats
  and lacked `history.currentTensions`.
- (D8, 00:05) PEACE_IRON_HOOKS' three literals in `foodBalance.js` (~854–856) are TAIL-CRISIS-2's, by exception: NOT
  EDITED here (this seat never touched them). Still this group's: the iron carts hook's CONDITION (row 20893, 39 towns,
  false where the town imports no iron).
- (D9, 2026-11-15 00:15) THE GROUP IS SPLIT IN THREE SEATS BY FILE. TAIL-DEFECON-2 (this branch):
  `economy/economicState.js` (but the one call of `deriveLocalProductionFromChains` near line 739), `incomeLineSiblings.js`,
  `prosperity.js`, `tradeGoods.js`, `viability.js`, `foodBalance.js` (but the three PEACE_IRON_HOOKS literals, D8; the
  iron carts hook's CONDITION, row 20893, is ours), `resourceGenerator.js`, `src/data/resourceData.js`,
  `isolationGenerator.js`, `steps/cascadePass.js`. TAIL-DEFECON-C (lane/tail-defecon-c-2026-11-14): `computeActiveChains.js`
  and D6/D7. TAIL-DEFECON-D (lane/tail-defecon-d-2026-11-14): `defenseDisplay.js`, `dossierViewModel.js`,
  `safetyProfile.js`, `safetyLineTruth.js`.
- (D10, 00:15) "Agricultural Rents … from tenant farmers" where no landlord stands (320 of 360): THE NAME IS FALSE THERE AS
  WELL AS THE TEXT (the PDF and the journal print the name alone). Cured AT THE SOURCE as a DECLARED MOVE: where the town
  stands no lord's steward or reeve and no feudal or manor power, the source takes a twin NAME that claims no rent and a
  twin text that names no tenant (the plainest word the generator already uses for a farming place's own yield; both
  listed for the veto); the readers keep working (`incomeLineSiblings.js`, `resourceGenerator.js`; ONE line by exception
  in `src/domain/worldPulse/treasury.js`'s map, the new name the same `land_rents` home). The field diff by family in the
  commit: the source's name and text in those towns and nothing else.
- (X9, restated 00:15) the exports' rows of these files with a batch of the same writer, measured with
  `SURFACES=PDF,Journal python3 inventory.py`; check that read's rows against the record first (no seats in its header,
  no `history.currentTensions`).
- (D14, 2026-11-15 00:39) THE PILGRIM GATE (#15707, X9 20913): (a) GRANTED, the arrival re-draw accepted as a DECLARED
  MOVE: Pilgrim Trade leaves the income rows of the 26 towns that stand no shrine, cathedral, monastery or abbey; the
  field diff by family on the 720, in the commit, shows the income row in those 26 and the arrival scene in the 14 AND
  NOTHING ELSE (anything else: stop again); every new arrival line in the 14 READ against its town's record and listed in
  the commit body with its town, a false one NAMED for the history seat (the arrival writer's group), not cured here. Its
  own commit, apart from the batch; X9 20913 with it.
- (D17, 00:43) `src/generators/resourceGenerator.js` is SHARED: its GAP LOGIC (whether an input reaches a house; the gaps
  and priority notes it writes) is TAIL-DEFECON-R's (lane/tail-defecon-r-2026-11-14). This seat keeps ONLY the income
  label's key near line 46 (D10's reader, done in batch 2) and row 15458 if its writer is not the gap logic; if 15458 or
  the file's other row IS the gap logic, it is named for that seat.
- (D21, 01:12) The three siege notes are ACCEPTED into D14's move: its terms read the income row in the 26, the arrival
  scene in the 14, the note "Settlement is under active siege. Trade income above reflects pre-siege operations…" in those
  3, AND NOTHING ELSE. The gate is committed as its own commit, the fourteen arrival scenes' new lines read and listed.
- (D22, 01:13) Two rows named for `economicState.js` by TAIL-DEFECON-C (at e44627128): (1) the mercenary hire's inheritor
  near line 587, "garrison contracts and armed escort" (8 towns): read where it prints (a garrison or an escort?), cure
  if false; (2) row 28528 (waterborne freight under a siege: false in 1 of the 3 towns that print it). With a batch of
  that file, after the fish rows.
- (D23, 2026-11-15) A CLASS MEASURED, not this seat's to move: prose written before its facts are final (true when
  drawn, false because the record moved afterwards; about a hundred rows of the whole read): such a row is NAMED with
  that reason.
- (D24, 01:28) `src/data/resourceData.js`'s "Defended Pass" (named by TAIL-DISPLAY-CIVIC-2; its hand-back's second
  seat's "rows named" on `lane/tail-display-civic-2026-11-14`): verify by the record (a pass, a fort or a toll house where
  the label prints?) and take it with this group's `resourceData.js` batch.
- (D27, 2026-11-15 02:25, to TAIL-DEFECON-4) THE ORDER IS BY WIDTH: foodBalance's B05887 (106 towns), the alchemy line
  (83), B00188 (60), B27952 (24), 15458 after its check; then the resourceData readers with D24; a row printing in fewer
  than five towns waits.
- (D28, 02:25) THE CATALOGUE'S DOUBTED COMMODITIES, MEASURED BEFORE ANY IS MOVED: `RESOURCE_DATA[k].commodities` gives a
  river fishery and fishing grounds SALT, date palms GRAIN, precious metals GEMS, an ancient grove HONEY, oasis water
  DATES, river mills PROCESSED TEXTILES, hot springs MEDICINAL HERBS. At the merged tree: per pair, the towns that print
  the good as made or exported on its strength alone; who reads `commodities`; the judgement by plain sense. ONE LINE TO
  THE CHAIR with the table BEFORE any pair is changed: a pair that moves only the made list and its pills in under thirty
  towns may then be cured as a declared move in its own commit; a pair that moves income, exports or a founding waits
  for the chair's word.
- (D29, 02:25) OWED, named by TAIL-DEFECON-3: ONE SHARED LEAF for the income-mix cut (today `prosperity.js ::
  INCOME_LEADER_FROM` mirrors `economyStateProse.js`'s `LEADER_FROM`, a file not this group's, the two pinned to agree
  by `tailDefeconBatch3Lines.test.js`): NAMED for the close below; not built.
- (U1, 02:25) the weekly usage warning: commit and push every batch the moment it holds, WHAT IS LEFT current in the same
  push; hand back at 250,000 (or about seventy minutes by time); one line to the chair at a hand-back, a stop, D28's
  table, or a question.
- (D31, 2026-11-15, the chair's answer to D28's table) NONE OF THE PAIRS IS MOVED NOW. The two lists are gated AT THE LISTS:
  the export side by C1-E (the -c- branch; not in the tree merged here), the made list by D30 (TAIL-DEFECON-C-3: a made good
  only where a house makes or works it; a gathered good only where the land gives it and it is worked). Both salts and the
  gems are then silenced by the house gate without touching the data; the data moves only for a pair that STILL prints
  false after those land (hot springs' herbs the likely one). The table and the judgement stand below under D28 for the
  seat that re-measures.
- (02:03, to every seat) the account's weekly usage warning is on: push every batch the moment it holds, with this
  file's WHAT IS LEFT current; hand back at the mark; one line to the chair at a hand-back, a stop or a question only;
  WIDEST FIRST (a row printing in fewer than five towns waits behind every wider row of these files).
- And BRIEF-TAIL's laws (silence is true; a mute state takes a twin; no draw moved; siege/famine; agreement; one home;
  no new vocabulary word; no `src/pdf/` or `src/foundry/`; every new line listed for the veto).

## Batch 1 · the safety profile's lines (`safetyProfile.js`, `safetyLineTruth.js`) · commit (this batch)

Verified by script over the base census's records (`economicState.safetyProfile` of the 720). Measure = towns where the
record makes the sentence false (of the towns that print it).

| row | sentence (short) | prints | false | cure |
|---|---|---|---|---|
| 15308 H | "Organized crime has filled the power vacuum left by absent or failed civil authority" | 4 | 4 (no criminal seat governs in any) | twin at assembly (`settleRosterCrimeLines`): "… keeps its own order where the civil authority's reach fails, and extracts a price for it." where no criminal seat governs |
| 23466 H | "… little crime; the local guard sees to that" | 1 | 1 (no garrison, watch or militia) | the clause is cut where no force is named: "Visitors can walk anywhere at any hour, and there is little crime." |
| 18208, B11404 | "Some goods change hands here without a licence or a duty paid. (It is noticed, and so far it does little harm.)" | 242 / 206 | 70 (every thorp and hamlet: no licence, no duty) | thorp/hamlet twin: "A little changes hands here quietly, between neighbours, and no one reckons it up." B11404 elsewhere STRUCK: in a village and up, untaxed trade that does little harm is true without a fence |
| 07371, 07373 | "Everyone comes and goes by the gates, so smugglers have to get past the …" | 257 (record) | 7 (under siege) | (D3) siege twin, declared `crisis: siege`: " The gates are shut against the siege, and the <force> hold(s) them." |
| 09714 | "… and the stalls that pay their fees lose custom to the ones that do not" | 150 | 33 (15 under siege; 18 with no market) | (D3) siege twin "With the siege closed round the place, what goods are left change hands in back rooms and after dark, at whatever the holder asks."; no-market twin "Goods change hands here in back rooms and after dark, and nobody accounts for them." |
| B03371 | "An active overland smuggling operation moves contraband through the settlement" | 163 (record) | 4 (under siege) | siege twin, declared: "The siege has shut the roads, so what contraband is already inside is hoarded and sold dear by those who know the patrol schedules." (+ the court note; the gate note dropped) |
| 05801 | "Controlled goods (grain, salt, preserved meat) … through unofficial channels" | 75 | 36 (thorps, hamlets) | thorp/hamlet twin: "What food is put by goes to whoever can pay the holder's price." (names no food, so offers none that failed) |
| B14103 | "Nobody here is paid to keep order." | 72 | 3 (occupied) | occupation twin, declared `crisis: occupation`: "No one of the place is paid to keep order; the occupiers keep their own. A quarrel goes …" (the frame's draw kept) |
| 14654 | "No single dominant organisation: just the steady pressure …" | 38 | 9 (a criminal power on the roster) | twin at assembly: "Petty theft, minor fraud, and opportunistic violence are persistent, driven by too many people with too little, and too few consequences for taking." |
| 18752, 11777, 21987 | the war-profiteering line (crown contracts, inspectors, the reputation for supply) | 33 | 15 (thorps, hamlets) | thorp/hamlet twin: "Whatever the army's buyers will take is sold to them dear, and not all of it is as sound as it is said to be." |
| 03039 | "A small industry has emerged to provide all three." | 33 | 15 | thorp/hamlet twin: "Deserters passing through need food and discretion, and some here give both. Officially classified as harbouring criminals." |
| B27552 | "Wealthy families paying poorer ones to send sons …" | 33 | 15 | silent in a thorp or a hamlet (the wartime state keeps its desc and two crime lines) |
| 09343 | "Forged residence documents, unofficial lodging, underground routes for those authorities have turned away." | 32 | 8 (thorps, hamlets) | twin: "Lodging and a way onward, sold quietly to newcomers who were told to move on." |
| 16495 | "Religious buildings, land, and endowments … contested" | 28 | 7 (no religious house; "Access to parish church" is not one) | silent there (the conversion state keeps its three other lines) |
| 02876 | "A part from the wizard's tower has gone missing …" | 26 | 25 (no wizard's tower) | silent where no tower stands (the arcane black market's crime line stays). A twin naming the black market or a practitioner would be a NEW undeclarable line to the presumed-things walker (no house atom yet) |
| 16568 | "… tribute paid to whoever controls their street" | 3 | 2 (hamlets) | thorp/hamlet twin: "Residents protect themselves through their neighbours, or by paying whoever is strongest." |
| 20612, 20616 | "The garrison and city watch is well paid … / walks the usual rounds" | 35 / 25 | 35 / 25 (a compound subject, a singular verb) | plural verbs where the force noun joins two (`manyForce`): every guard frame, the paper line, the state-crime line, the patrol-cut line (`patrolTruth`, `paperTruth` read both) |
| 18786 | "… enforcers who can be bought" of an adventurers' charter hall | 16 | 3 (no garrison, watch or militia: the hall is the only "force") | the paper branch is not taken for a charter hall; its own branch prints (then the purse line: "The adventurers' charter hall takes bounty work against threats, …") |
| 18708 | "Street-level confrontations between insurgent supporters and those who keep order." | 18 | 14 (no force of any kind) | a declared set on the twin (`guardPresence`): "Confrontations between the rebels' supporters and those loyal to the current authority. Officially categorised as riot and disorder." |

STRUCK (true by the record): **07212** "Enforcement struggles to distinguish …" (90): a force stands in every printing town
(the reader's r2s-succession_void-thorp-0 has a household levy, the militia home). **B03720** "Arcane black market" (26):
a crime type's name, not a house. **B03295** (3): an alchemist and criminal houses stand in all three. **20990, 20992,
20993** (13, 4, 2): "Suppressed" is a power's strength, not its absence; the guilds' own guards are theirs (the line names
no hired company).

Guard: `tests/generators/tailDefeconSafetyLines.test.js` (22 GONE pairs red at bcad1a358, 18 KEEP pairs green before and
after; the vacuum line kept where a criminal seat governs).

AFTER RUN (census at the batch's tree, `inventory_diff.py before.json after1.json <the 30 rows>`; sentences 29,874 ->
29,887; gone 19, new 32, fewer 32, more 3, moved 0): every cured row GONE (15308, 23466, 20612, 20616) or FEWER by exactly
its measure on the page (18208 242->172, B11404 206->136, 07371 194->188 and 07373 50->49 (the 7 sieges), 09714 150->117,
B03371 108->105 (its 3 siege towns on the page), 05801 75->39, B14103 72->69, 14654 38->29, the wartime five 33->18,
09343 32->24, 16495 28->21, 02876 26->1, 18708 18->4, 18786 16->13, 16568 3->1); the six struck rows unchanged. EVERY
OTHER LINE THAT LOST TOWNS is a clause of a cured line (the routes and the gate note of the siege smuggling line 163->159,
55->54; the court-note tail "Chronically underpaid and poorly equipped." 5->2 of the charter hall; the vacuum line's
"It provides a form of order …" 4->0; the conscription and contested-property clauses) or ONE heading: "Safety & Crime"
186->185, the source label of r2s-wartime-town-2's only safety hook (the tower hook, silenced: no tower stands there).
MORE TOWNS: the charter hall's own branch lines 15->18 (#18786's three villages). THE INHERITORS (35, every one a twin
of this batch) read where they print: r2r-hamlet-1 ("A little changes hands …", Off-book), r2r-metropolis-14 (the siege
drag line), r2s-under_siege-city-0 (the plural guard line and the shut gates), r2r-thorp-22 (the rebels' line),
r2s-occupied-thorp-1 (the occupation line), r2r-village-24 (the charter hall's branch): each true there. (Seen, not
mine: r2r-hamlet-1's next line "small enough to annoy the clerks" puts clerks in a hamlet; another writer.)

THE DECLARED MOVE (`corpus.ndjson.gz` before and after, field diff by family on the 720): ONLY
`economicState.safetyProfile`: guardEffectivenessDesc 223 towns; crimeTypes[] 119 fields in 93 towns (22 lists shorter:
conscription fraud and contested property silenced); economicDragDesc 103; plotHooks 46 fields in 24 towns (25 lists
shorter: the tower hook); safetyDesc 3. No draw moved (the frames keep their hash pick; no roll is added or removed).

GATES: strict-domain 0; type ratchet 0; eslint on the touched files 0 (safetyProfile.js held under max-lines: the batch's
twins and the roster settle live in safetyLineTruth.js); presumed-things walker 147 fresh at the base, 147 with the batch
(every new line declares its crisis, `crisis: siege` / `crisis: occupation`, or names no registered thing); the grid 0
rises (2 falls, named below); the 98 test files naming the two files: 15 red, 14 of them red at the base (CARRIED:
generationForkCensus, defensePostureAgainstItsFacts, proseWiringCensus.walker, crimeLineDisqualifiers,
poolDominance.walker, factLayers.walker, hookTruthAtBirth, coherenceAgreeCures, powerStateProseDesk,
editWorldFactResources, defenseTabFlow, generatorGoldenMaster, espionageDormancyFence, institutionBudgetPromise; the same
30 tests red); the fifteenth, `safetyLinesSayTheRecord.test.js` #459, a pin the plural cure moves, RE-KEYED BY IDENTITY in
this commit (the twin regex takes the plural; the cured regex takes both verb forms).

## Batch 2 · the income rows of `generateEconomicState` (TAIL-DEFECON-2) · commit (this batch)

Seat TAIL-DEFECON-2, from this branch's tip 345f13157 (read back from origin, 2026-11-15 00:15 UTC). Before run: the
census at 345f13157 (29,887 tab sentences, the predecessor's after run to the sentence; 35,781 on the PDF and journal).
Measure = towns where the record makes the row false, of the towns that print it (`corpus.ndjson.gz` of the base).

| row | sentence (short) | prints | false | cure |
|---|---|---|---|---|
| 03348 (D10), X9 21442 | "Agricultural Rents · Payments in kind or coin from tenant farmers" | 360 | 324 (no lord's steward or reeve, no feudal, manor or noble power); 5 more stand only a noble power (the Highborn Circle, a Manor Household) and no house | AT THE SOURCE, the house the generator can see (the economy runs before the powers are drawn): where no "Lord's steward" or "Lord's reeve" stands, the source is **"Harvest"** and its line **"What the households grow and raise on their holdings; the main living at this scale."** (329 towns: the 324, and the 5 noble-power towns, where the twin is still true: it claims no landlord and denies none). A "Village reeve" is elected from the peasantry: not a landlord. Readers kept: `houseOfWorkLine` and Grain Sales' gate (`hasIncomeSource('harvest')` beside `'agricultural'`, so no row is unlocked), `resourceGenerator.js` (Agriculture's support), `treasury.js :: INCOME_SOURCE_FORMS` ('Harvest' -> land_rents, the one line by exception) |
| 11426 | "… and contract-grade enchanting brings steady coin" | 83 | 83 (a four-item subject) | "bring"; the line's banked first-register row re-keyed BY IDENTITY (`tests/lint/presumedThings.register.json`, the same file, the new hash) |
| B17543, X9 02882 | "A busy market for spell services" under a siege | 83 | 5 | `Spellcasting Services` joins `SIEGE_CLOSED_SOURCES`: under a siege the row prints its label and share alone (6 towns: the 5, and r2r-metropolis-14, whose lower line "Adventurers and merchants both pay well …" is false under a siege too). A siege twin ("sold only to the people inside …", the alchemy twin's form) was written and WITHDRAWN: an undeclared siege line, a walker rise |
| 00386, X9 20913 (siege) | "Offerings, … from visiting pilgrims" under a siege | 7 (record) | 7 | `Pilgrim Trade` joins `SIEGE_CLOSED_SOURCES` (label and share alone) |
| 16644 | "River Tolls · Tolls on river traffic …" under a siege | 48 | 1 | `River Tolls` joins `SIEGE_CLOSED_SOURCES` |
| 17619 | "Security Contracts · … a privatised protection tax on trade" | 13 | 1 (under a siege; "Merchant Guilds Suppressed" is a strength, not an absence: struck there) | `Security Contracts` joins `SIEGE_CLOSED_SOURCES` |
| B05884 | "Smuggling Network Revenue" where no smuggling house stands | 78 | 22 (a "Front Businesses" house named it) | `hasSmuggling` reads 'smuggl' only: the 22 take the plain label (Black Market Revenue 11, Shadow Economy (untaxed) 11; a front business is a criminal house, so "the criminals who run them" stays true there) |
| 06146, 06148, X9 29696 | "… but it goes to the criminals who run them" | 65 / 34 / 99 | 48 / 13 (no criminal house and no criminal power); 10 more stand a criminal power and no house | where `safetyProfile.criminalInstitutions` is empty: **"… bring money in here, but none of it reaches the treasury."** (71 towns: the 61 and the 10, where it is still true) |

PARKED (a STOP, told to the chair 2026-11-15 ~01:00): **15707, X9 20913 (no house)**: Pilgrim Trade where no shrine,
cathedral, monastery or abbey stands: 26 of 87 (13 "Graveyard, Parish church", 11 "Parish churches (2-5)", 2 "Parish
churches (10-30)"). The gate (`hasInst('shrine', 'cathedral', 'monaster', 'abbey', 'relic')`) was measured and withdrawn:
`arrivalScene` reads the row, and 14 of the 26 re-draw their arrival scene (the false pilgrim line goes, but the hash pick
moves unrelated lines: bells, the well, a notary's clerk): a draw moved outside the row's pool. Awaiting the chair's
ruling: accept the re-draw as a declared move, or leave the row and name the arrival writer's pilgrim line for its group.

STRUCK (true by the record): **X9 13189** "Import and export taxes, anchorage fees, and customs inspection on all cargo"
(55): the row stands only on docks, a harbour master or a shipyard, whose office inspects cargo; a plague does not stop
customs. **X9 08786** "Entry and exit tolls collected at the city gates …" (49): a plague or a dangerous road does not
lift a toll; under a siege the row is already silent.

Guard: `tests/generators/tailDefeconIncomeRows.test.js` (10 GONE pairs red at 345f13157, 7 KEEP pairs green before and
after; a plant (the lord's-man condition never met) reds the rents KEEP pair, not committed). Pins re-keyed BY IDENTITY:
`houseOfWorkEarns.test.js` (the first row is "Harvest" where no lord's man stands, else "Agricultural Rents"),
`coherenceAgreeCures.test.js` (the farming row is either name), the walker's first-register row of the spell line.

AFTER RUN (the census at the batch's tree; the 26 parked towns re-born with the gate withdrawn and merged; their
arrival scenes equal the base's): tabs 29,887 -> 29,894 (gone 1, new 8, fewer 9, more 1, moved 5); exports 35,781 ->
35,785. Every row FEWER by exactly its measure or GONE: 03348 360 -> 31 (the 329); 11426 83 -> 0; B17543 83 -> 78;
15707 83 -> 78 (its 5 sieges on the tabs; the gate parked); 00386 4 -> 2; 16644 48 -> 47; 17619 13 -> 12; B05884 78 -> 56;
06146 65 -> 24 (-52, +11 the renamed smuggling towns with a criminal house); 06148 34 -> 26 (-19, +11); X9 21442 360 -> 31,
29696 99 -> 50, 20913 87 -> 80, 02882 83 -> 78; 13189 and 08786 unchanged. EVERY OTHER LINE THAT LOST TOWNS: r2r-metropolis-14's
lower spell line (91 -> 90, false under its siege). MOVED: three lines of the deity card ("Patron deity", "Assign a patron
god …", "Upgrade to premium …", 718 -> 718), a render flake on a worker's first town (r2r-thorp-0 before, r2r-village-9
after), not this batch. THE INHERITORS read where they print: r2r-hamlet-1 (Harvest; "none of it reaches the treasury"),
r2s-under_siege-thorp-2 (Harvest under a siege: no sale claimed), r2r-city-13 ("Black Market Revenue … the criminals who
run them": its Front Businesses stand), r2r-town-12 (Shadow Economy, the same), r2r-metropolis-14 (Pilgrim Trade and
Spellcasting Services, label alone): each true there.

THE DECLARED MOVE (`corpus.ndjson.gz` before and after, field diff by family on the 720): ONLY
`economicState.incomeSources`: `source` 351 towns (Harvest 329; the smuggling label 22), `desc` 455 towns (by row: the rents
329, "bring" 78, the treasury twin 71, the smuggling line 22, the siege silences 15); no percentage and no weight moved (a renamed criminal row
sorts among equal shares by its new name in 7 towns, the same rows reordered). No draw moved.

GATES: strict-domain 0; type ratchet 0 (167, ceiling 167); eslint on the touched files 0; presumed-things walker 147
fresh at the base, 147 with the batch, identical rows; the grid 0 rises (the same 2 falls, named below); the 42 test
files naming the touched files: 15 red, the same 15 red at the base (CARRIED: r3c10FoodLinesTrue, r3c9ReaderLinesTrue,
worldFactRederive, coherenceAgreeCures (its gate tally), observedShapeReaders.walker, proseWiringCensus.walker,
writerReach.walker).

## Batch 3 · the lines of `incomeLineSiblings.js` and their neighbours (TAIL-DEFECON-3) · commit (this batch)

Seat TAIL-DEFECON-3. The pilgrim gate (D14, D21) was pushed by TAIL-DEFECON-2 at **5f67f382d** after this seat had read
the tip as 8dc6ad497; this seat measured it again on its own census, got the same field diff (income 26, arrival 14,
the siege note 3, nothing else), dropped its duplicate commit and built on 5f67f382d. Arrival reads that differ from
5f67f382d's: r2r-village-19's "small shrine set into a wall" is judged TRUE here (a wall niche, not a house of
pilgrimage); r2r-village-3's "Carts of grain rattle toward the mills while the ovens send the smell of bread …" is FALSE
in part (one grain mill, no baker); r2s-slave_revolt-city-2's "the sound of the workings never quite stops" is a
CANDIDATE under the revolt. All are named for the history seat below.

Before run: the census at the gate (5f67f382d's behaviour; 29,897 tab sentences, 35,785 PDF and journal). Measure =
towns where the record makes the line false, of the towns that print it (`corpus.ndjson.gz`).

| row | sentence (short) | prints | false | cure |
|---|---|---|---|---|
| B07361 B07357 B07355 B07356 B07359, X9 10219 06426 06427 (D5's #77) | the fish lines ("Fish is sold here, fresh or preserved." / "Catch landed here …" / "Catch landed and sold …; salt fish …") | 92 / 28 / 38 | 8 under a famine whose failed source is fish; 28 where every fishery near the place is depleted (19 of them buy salted fish in) | `trueIncomeDesc`: silent under the fish famine; where the fishery is fished out, **"The fishery here is fished out; the fish sold now is salted and bought in."** if salted fish is bought (first ten imports), else silent (D5: silence ruled true) |
| 18655, X9 15745 | "Local quarry provides dressed stone to regional builders …" | 39 | 2 (they sell no stone; they buy cut stone) | twin **"Stone is quarried here for the place's own building."** where no stone is exported |
| 07231, X9 29522 | "Transit duties, warehouse fees, and re-export premiums …" (Entrepôt Trade) | 78 | 20 (villages: no warehouse, toll, customs or caravan house) | the literal moves to `incomeLineSiblings.js` (`ENTREPOT_LINE`, tradeGoods.js imports it); twin **"Goods passing through the crossroads, and what their traders spend while they stop."** |
| 11808, X9 22711 | "Revenue from international trade …" under a siege | 15 | 1 | `International Commerce` joins `SIEGE_CLOSED_SOURCES` (label and share alone) |
| 10700 (D2) | "Highly diversified — multiple major revenue streams" beside "two or three trades" | 236 | 196 (the income mix's leader holds 20–49%: the page's own "two or three sources between them") | ONE HOME: `deriveEconomicComplexity` reads `incomeMixPoolKey` (economyStateProse.js); "Highly" only on a broad spread, else the ladder's existing rung "Diversified — broad institutional economic base" (no new vocabulary word) |
| 20893 (D8, the CONDITION only) | the iron hooks ("The iron carts are three weeks late …", the merchants, the toll, the war line) | 39 / 30 / 23 / 12 | 6 / 2 / 4 / 2 (the import list holds no iron) | the hook's condition adds `importHeld(facts, /\b(?:iron|metal)/i)`; the three PEACE_IRON_HOOKS literals untouched |
| 04271, B04151, B10921 | "Banks stand here, but the city does little trade." / "Its banks find little business to do." | 3 | 3 (17–19 exports, 9–10 imports) | the warning stands only where the export list is short (fewer than four) |
| 30890 | "Add craft guilds: smiths, weavers, tanners, etc." | 1 | 1 (Blacksmiths and a Tanner stand) | the advice names only the crafts the roster lacks ("Add craft guilds: weavers, etc.") |
| 16403, X9 11882 (`cascadePass.js`) | "Regulates port and airship traffic, assigns berths …" | 14 | 14 (added only off the water: road, crossroads, isolated) | **"Regulates airship traffic, assigns mooring berths, collects anchorage fees."** (no draw moved: `rng.chance` untouched) |

STRUCK (true by the record): **11871** "Local ore feeds the smithy directly." (79): a live iron deposit and a smith
stand in all 79. **B11289** "Metal is smelted or worked here." (61): a forge house stands in all 61. **D22 (1)** "Military
services — garrison contracts and armed escort" (5 on the tabs): a barracks and military strength ≥ 60 in every
printing town. **B27712** (`isolationGenerator.js`, 2) "… not enough without the wizard": the wizard keeps the magical
TRANSIT; what it carries counts as "brought in", not as food "by magic" (that figure is conjured food).

Guard: `tests/generators/tailDefeconBatch3Lines.test.js` (15 GONE pairs red at the base, 8 KEEP pairs green before and
after; a plant (the quarry line always takes its twin) reds the quarry KEEP, not committed). Registers re-keyed BY IDENTITY in this
commit: the widened walker register's entrepôt row moves from `tradeGoods.js` to `incomeLineSiblings.js` (the same
literal and hash); the harbour row takes its new literal and hash; the two craft-advice rows (the literal no longer
stands) are removed as stale. Walker 147 fresh, the base's.

AFTER RUN (census at the batch's tree; `inventory_diff.py` against the gate's run): tabs 29,897 -> 29,901 (gone 11, new
15, fewer 26, more 10, moved 3: the deity card's render flake); exports 35,785 -> 35,792. EVERY ROW FEWER BY EXACTLY ITS
MEASURE OR GONE: the fish "sold here" 92 -> 66 (26), "landed and sold" 38 -> 34 (4), "landed here" 28 -> 22 (6); the quarry
39 -> 37; the entrepôt 75 -> 56 on the tabs (19: the twentieth is a siege town, already label-only), 29522 75 -> 56;
international commerce 15 -> 14; 10700 236 -> 40; the iron hooks 39 -> 33, 27 -> 25, 23 -> 19, 11 -> 9; the banks and the
craft advice GONE; 16403 and 11882 14 -> 0. EVERY OTHER LINE THAT LOST TOWNS: the headings and counts the hooks feed
("Strategic Resource" 104 -> 90, "Outlook" 258 -> 245, "Warnings (#)" 56 -> 53, the summary's "N plot hooks available"),
and the economy prose the complexity label keys ("… a spread of trades …" -> "… a broad base of trades …", the rung's own
prose, 6 lines). THE INHERITORS read where they print: "Diversified — broad institutional economic base" (200;
r2r-city-0, r2s-wartime-city-1, r2r-metropolis-8) and its prose "… gets by on a broad base of trades …" (84), "lives on
a broad base of trades …" (12+7+7+4), "Traffic on <N>'s road is steady, and a broad base of trades …" (8+3+3+1): true
beside "two or three sources between them" (many trades, none dominant), and one home now. The fish twin (19; r2r-city-14,
r2r-city-35), the label alone (12+5; r2r-city-44 famine), the quarry twin (2), the entrepôt twin (19; r2r-town-23,
r2r-village-9), the harbour line (14), International Commerce alone (r2s-under_siege-metropolis-1), "Add craft guilds:
weavers, etc." (r2s-politically_fractured-city-2): true. Where an iron hook left the hooks panel, five `history` hooks
now show in the freed place (the record unmoved: they were drawn before): named below.

THE DECLARED MOVE (`corpus.ndjson.gz`, the gate's run and this batch's, field diff by family on the 720): ONLY
`economicState.economicComplexity` 196 towns; `economicState.incomeSources` 57 (descs only: fish 36, entrepôt 20,
quarry 2, international 1, with overlaps); `economicViability.plotHooks` 14 and its `summary` 13 (the hook count);
`economicViability.warnings` 4 and `metrics.warningCount` 3 (the banks 3, the craft advice 1); `institutions` 14 (the
harbour master's desc). No draw moved.

GATES: strict-domain 0; type ratchet 167/167; eslint on the touched files 0; presumed-things walker 147 fresh = base
(identical rows, after the re-keys above); the grid 0 rises (the same 2 falls, r2r-city-0 P7a and
r2s-insurgency-metropolis-0 P7a, named stale low); the 110 test files naming the touched files: 7 files red, the same
13 tests red at the base (CARRIED: famineStoresOneRounding, worldFactRederive, coherenceAgreeCures (the gate rows),
generationForkCensus, urbanBandInstitutions, proseNumerics, proseWiringCensus.walker). Two reds of this batch were cured
before the push: `vendorPdfLazy.test.js` (importing `incomeMixPoolKey` pulled the economy prose desk into the first-paint
graph: the cut is now `prosperity.js :: INCOME_LEADER_FROM`, the desk's `LEADER_FROM` mirrored, and the batch's guard
pins the two readings to agree at eight leader shares; a leaf both read is owed: `economyStateProse.js` is not this
group's file); `coherenceAgreeCures.test.js` "… no hook says war took their iron" RE-KEYED BY IDENTITY (an iron hook prints
exactly where the import list holds iron; agree-village-28 buys none).

## Batch 4 · by width (D27): the food heading, the alchemist, the revolt, the half-worked chain (TAIL-DEFECON-4) · b40f795b2

Seat TAIL-DEFECON-4, from this branch's tip 2ac50c55d; FIRST ACT: the joined line merged at **d817736d8** (21e578caa, a
merge commit of its own, clean; pushed). Before run: the census at 21e578caa (tabs 30,129 sentences; PDF and journal
35,969; `/home/user/inst4/before`, outside every tree). Measure = towns where the record makes the row false, of the
towns that print it (`corpus.ndjson.gz`).

| row | sentence (short) | prints | false | cure |
|---|---|---|---|---|
| B05887 | "Crisis Cutting the Food Supply" (the food crisis note's heading) | 106 towns (186 notes) | 41: the note is a crisis that ADDS MOUTHS (occupiers 20, newcomers 21) beside a gap | a mouths note takes the file's own heading **"Crisis Adding Mouths to Feed"**, gap or none (its priority line "The crisis is cutting into the food supply now." stands: the gap is real). The reader's own flag (a plague, "famine cut 0%") is TRUE: the plague, the siege, the levy, a revolt and a famine each cut production in the canonical writer (`foodGenerator.js`, ×0.75 / siege / ×0.85 / ×0.8 / the famine's keep) |
| 03703, X9 03932 | "A thriving alchemical trade … draws customers from surrounding settlements" | 83 | 13 (the town's own label Poor 11, Struggling 2) | the alchemist's EXISTING plain line "Herbal remedies, minor alchemical preparations, and potion sales. The local alchemist supplements conventional trade." where the label is Subsistence, Struggling or Poor; set in `economicState.js` right after `deriveProsperityLabels` (nothing between `trueIncomeDesc` and there reads a desc). Plague onset (1, Comfortable), occupation (4, all Poor: covered) judged by the label alone |
| B27952 | "With the enslaved workers in revolt, the outlying fields lie idle and nobody is bringing in the harvest." | 24 | 24 (the revolt takes a fifth: productionMult 0.8; 86% still grown in the reader's town) | reworded in all 24: **"With the enslaved workers in revolt, the outlying fields lie idle, and less of the harvest is coming in."** |
| 15458 (D3) | "Partial processing - exports semi-finished goods" (Export Potential) | 152 towns (179 rows) | 138 rows (131 whose goods are on no export list; 7 under a siege) | the writer is `resourceGenerator.js :: evaluateInstitutionDeps` (export potential), NOT the gap logic (D17 checked): reworded in every row, **"Partial processing - worked only to semi-finished goods"** (claims no export; true in the 41 rows that do export them) |

STRUCK (true by the record): **B00188** the grain importer under a siege (2 siege towns of 60: r2s-under_siege-city-0,
r2s-under_siege-metropolis-3): a teleportation circle carries food past the siege in both (importCoverage > 0) and grain is
on both import lists; the hook names no road. The other 58 print it under no siege.

Guard: `tests/generators/tailDefeconBatch4Lines.test.js` (6 GONE pairs red at 21e578caa, 3 KEEP pairs green before and
after; a plant (the alchemy twin always taken) reds the alchemy KEEP, not committed). Re-keyed BY IDENTITY:
`foodCrisisHeadingReadsRecord.test.js` (a mouths note is headed by its mouths, gap or none; a field crisis "Cutting"
exactly where a gap stands).

THE DECLARED MOVE (`corpus.ndjson.gz` at 21e578caa and at the batch, field diff by family on the 720): ONLY
`resourceAnalysis.exports[].reason` 152 towns; `economicViability.issues[].title` 41; `issues[].message` and
`.description` 24; `economicState.incomeSources[].desc` 13. No draw moved.

GATES: strict-domain 0; type ratchet 167/167; eslint on the touched files 0; presumed-things walker identical to the base
(fresh 145 · stale 2 at the merged base: the base's, not this batch's); the grid 0 rises (the same 2 falls, r2r-city-0 P7a and
r2s-insurgency-metropolis-0 P7a, named stale low); the 48 test files naming the touched files: the
base's 14 reds CARRIED (famineStoresOneRounding, r3c10FoodLinesTrue (2), worldFactRederive, coherenceAgreeCures (the gate
tally, 2), foodDiversity, incomeLinesSayTheRecord, urbanBandInstitutions G5, labelJoins, proseWiringCensus.walker (4)),
none new (three seen red under the census's load were timeouts; green alone).

AFTER RUN (census at b40f795b2, `/home/user/inst4/after4`; `inventory_diff.py` against the census at 21e578caa): tabs
30,129 -> 30,131 (gone 2, new 4, fewer 5, more 2, moved 0); PDF and journal 35,969 -> 35,969. EVERY ROW GONE OR FEWER BY
EXACTLY ITS MEASURE: 15458 152 -> 0; B27952 24 -> 0; B05887 106 -> 68 on the tabs (the 41 mouths notes, less the 3
occupied-and-famine towns whose famine note keeps "Cutting" truly; still in the town read, r2s-plague_onset-thorp-0, where
it is true: struck), 181 -> 143 on the exports; 03703 / X9 03932 83 -> 70 (13); B00188 60 -> 60 (struck). EVERY OTHER LINE
THAT LOST TOWNS: the deity card's three lines 718 -> 716 (the render flake seen in batches 2 and 3; not this batch: no
deity field moved). THE INHERITORS read where they print: "Partial processing - worked only to semi-finished goods" (152;
r2r-city-1, r2r-metropolis-14 under its siege); "Crisis Adding Mouths to Feed" (+38 tabs, +41 exports; r2r-city-3
newcomers beside a gap, r2s-occupied-hamlet-0 occupiers); the revolt line (24; r2s-slave_revolt-city-0); the
alchemist's plain line (13; r2r-city-19, Poor, an alchemist stands): each true there.

### D28 · the catalogue's doubted commodities (measured at 21e578caa; NONE MOVED; the table sent to the chair ~02:47; the chair ruled D31)

Towns where the good prints on the made list or the export list with no house that makes or works it and no other
resource on the ground that yields it (regex over the roster; a candidate count, not a cure's measure):

| pair | near | made list | exported | on its strength alone | judgement |
|---|---|---|---|---|---|
| fishing grounds → salt | 96 | 80 | 39 | 21 | false (a fishery makes no salt) |
| river fishery (`river_fish`) → salt | 87 | 50 | 0 | 42 | false (fresh water) |
| date palms → grain | 18 | 15 | 14 | 0 (a farm stands wherever it prints) | false by sense; prints nowhere alone |
| precious metals → gems | 117 | 35 | 5 | 25 | false (gold and silver are not gems) |
| ancient grove → honey | 401 | 350 | 125 | 238 | true (wild honey) |
| oasis water → dates | 16 | 16 | 10 | 11 | true |
| river mills → processed textiles | 50 | 30 | 12 | 11 | doubtful (a fulling mill needs a cloth house) |
| hot springs → medicinal herbs | 109 | 109 | 15 | 44 | false (springs give waters, not herbs) |

READERS of `commodities` (each pair moves more than the made list, so EVERY pair WAITS the chair's word):
`tradeGoods.js :: getCommoditiesForResources` (the commodity set the exports draw on), `computeActiveChains.js:955` (the
made list, TAIL-DEFECON-C's), `resourceGenerator.js` (depletion matching ~457, generic chains ~137), `domain/facts/chainWorking.js`,
`domain/display/tradeListDisplay.js`, `domain/inferSupplyChains.js`, `domain/display/validationOnPage.js`,
`domain/worldPulse/resourceTaxonomy.js`, `domain/edit/pools.js`.

## TAIL-DEFECON-5 · five record cures (rulings R1 to R5), each its own commit, each a DECLARED MOVE

Seat TAIL-DEFECON-5, from this branch's tip 81100e11e; FIRST ACT: the joined line merged at **3e482b329** (694621784, a
merge commit of its own, clean; pushed). The patches were measured at the joined line's c8116d79 (RECORD-MEASURE-3).
BEFORE: births-only at 694621784 (`/home/user/inst5/b0`, outside every tree); the page census at the same tree
(`/home/user/inst5/cbefore`). Each cure: births-only in the tree, `fielddiff.mjs` against the commit before.

THE RULINGS (the chair's, 2026-11-15 04:40 UTC, on the third measure's report; each vetoable by the owner):
- (R3) ONE FOOD LEDGER (c3a; `foodBalance.js`): the viability's view reads the writer's split (its imports, its magic) and
  its shortfall is the tab's remainder. Expected: `economicViability.metrics.foodBalance` in 226 towns and its readers;
  `viable` and the stores do not move (if either moves, stop).
- (R2) ONE SHADOW FIGURE (c2a; `economicState.js`, `incomeLineSiblings.js`): the criminal income row held at the capture in
  both normalisers. Expected: `incomeSources` 229, `economicComplexity` 35; prosperity does not move. NOT c2b.
- (R1) THE ECONOMIC RATING'S CAP (c1b; `defenseGenerator.js :: computeDefenseScores`, LENT): where the printed prosperity
  is Poor or below, the economic score is at most 64. Expected: the score 55, the guard line 30, the conditions 17; the
  readiness does not move. The 30 guard lines and the 17 conditions read where they print.
- (R5) THE ENTREPÔT FLAG (c6a; `economicState.js`): the flag only where an entrepôt chain stands, written after the
  chains: 41 thorps, hamlets and villages; one field.
- (R4) THE MAGIC SHARE'S ROUNDING (c4a; `foodGenerator.js`, LENT): the share of the pounds published, rounded as the
  offset is: `foodRecord.magicPct` in 22 towns. NOT c4b.
- (U1) the account's weekly usage warning: every cure pushed the moment it holds, this file's WHAT IS LEFT in the same push.

| cure | commit | field diff (births, 720) | the report's? |
|---|---|---|---|
| R3 c3a | 7ce6db273 (+ e1577f2cd: under the module ceiling, byte-identical) | 226 towns, 7 families: `economicViability.metrics.foodBalance` 226, `.summary` 23, `.issues` 22, `.dependencies` 15, `.plotHooks` 10, `history.currentTensions` 9, `history.siegeNarrative` 1; `viable` and the stores unmoved | YES, family for family |
| R2 c2a | 9cc8c6826 | 229 towns, 2 families: `economicState.incomeSources` 229, `economicState.economicComplexity` 35; prosperity unmoved | YES |

### R3 · one food ledger (c3a, and one rule more)

c3a as measured, and ONE RULE MORE the tests it did not run asked for: the view's per cent is the share its pounds give
and **never 0 beside a pound short** (the tab's own floor, `foodRowShown.js`; within V-FOOD-PCT's one step). Without it
c3a published "16 lb beside 0% of 3216" (STOP-1's view-sign law, red) and the record's summary read "△ VIABLE WITH
PROVISIONING STRAIN: 0% of daily food need remains uncovered" in 4 towns. With it the field diff is the report's to the
family (the rule moves only values inside `metrics.foodBalance`). After: the view's pounds equal the tab's remainder in
720 of 720 (221 differed), its import the writer's (211 differed), its per cent the tab's in 720 (50 differed).

THE INHERITORS, read: "Settlement cannot cover ~65 lbs …" for ~66 (r2s-under_siege-hamlet-2; the tab's "Short: 65");
"~1879" for ~1881 (r2s-under_siege-town-0); "The crisis is cutting into the food supply now." in place of "There are
more mouths to feed, but the shortfall is still made up." (r2r-town-36: the tab prints "Short: 1 lbs/day", 1%): each true
by the tab. NAMED, not this group's file: `src/domain/viabilitySummary.js:50` re-derives the summary's per cent from the
pounds with no floor, so 4 towns' record summary reads "0% of daily food need remains uncovered" (r2r-town-36,
r2s-occupied-town-2, r2s-monster_pressure-town-1, r2s-slave_revolt-village-0): it prints on no surface of the 720 (the
summary reaches no dump); the leaf to read is the view's own `deficitPercent`. Also named: the writer's own rounding (its
`deficitPct` against its pounds, 17 small towns, e.g. r2r-thorp-32 13% beside a 1 lb remainder of 16), the report's
"smaller fault inside the writer", `foodGenerator.js`.

RE-KEYED BY IDENTITY (the anchors were the fault R3 removes): `economicsFoodBalanceRowOneHome.test.jsx` (the two homes
read one import), `economicsFoodTradeUnderSiege.test.jsx` (the metric reads the record: nothing comes in under the
siege), `foodModelSingleWriter.test.js` CONTRADICTION KILLER (the view's shortfall is the tab row's, pound for pound;
it was keyed to the writer's per cent, which the writer lets read 0 beside a few pounds), `foodMagicChannelPrint.test.js`
(the two CONTROL fixtures' writer publishes its own gap and split, as the writer does). Guard:
`tests/generators/tailDefecon5RecordCures.test.js` (R3: 4 GONE red at 694621784, 2 KEEP green before and after).
GATES: eslint on the touched files 0; the walker identical to the base (fresh 145 · stale 3 · first-register stale 2);
the grid identical (the base's 2 falls, r2r-city-0 P7a, r2s-insurgency-metropolis-0 P7a); the 52 test files naming the
view: the base's 9 reds CARRIED (famineStoresOneRounding, worldFactRederive, foodDiversity (2), tailCrisisIronHooks,
urbanBandInstitutions G3 and G5, labelJoins, the golden master), none new.

### R3's ceiling (e1577f2cd)

R3 left `foodBalance.js` at 915 lines: `economicStructure.test.js` (every economy/ module under 900) red, missed by R3's
test list (it names no food file); found running R2's. NO CEILING IS RAISED: R3's arm takes every record that publishes
the split, so the old proportional arm (which needed the same two fields) was dead; it and its comment went, and R3's
comments were cut: 870 lines. Births-only on the 720: 0 towns moved against R3.

### R2 · one shadow figure (c2a, in one home)

c2a's rule, written ONCE: `incomeLineSiblings.js :: shareIncomeRows(rows, held)` (a criminal row held at `held`, the lawful
rows sharing the rest, the residue to the largest lawful row; with no criminal row the old normalisation), called by
both normalisers (`economicState.js` stage 3, held at the capture it was pushed with; `keepRowsThePageBearsOut`, held at
the share stage 3 gave it). c2a as patched put `economicState.js` at 909 lines (over the ceiling); in one home it is 885.
Births-only: the record IDENTICAL to c2a as patched (0 towns against the patch's tree), 229 / 35 against R3. After: the
criminal row equals the capture in 236 of 236 (8 before); every town's shares sum to 100; no row at 0.

THE INHERITORS, read: (a) the income rows' ORDER (161 towns: the list is sorted by share; no row's text moves: the set of
"source :: line" is identical in all 720). (b) `economicComplexity` in 35 (the ladder's own cut, a row at 20% or more
caps the count at 8): r2r-city-17 "Highly diversified — multiple major revenue streams" for "Diversified …" (15 rows,
none at 20% now: Market Taxes 25 → 19, the syndicate 9 → 18, its capture); r2r-city-19 "Diversified — broad institutional
economic base" for "Highly diversified …" (the smuggling row at its capture, 23%, now leads; 13 rows): each true by the
ladder. The page's inheritors (the income mix's leader prose) are read in the census after all five.

Guard: `tailDefecon5RecordCures.test.js` (R2: 4 GONE red at e1577f2cd, 2 KEEP green before and after). GATES: eslint 0;
the walker and the grid identical to the base; the 62 test files naming the two files or the income rows: the base's 23
reds CARRIED (crisisStoppedRows (2), coherenceAgreeCures (2), generationForkCensus (4), incomeRowsBorneOut, labelJoins,
observedShapeReaders.walker (6), proseWiringCensus.walker (5), the golden master, semanticFixtures), none new.

## The veto list (every new or changed line, with towns it was read in)

Batch 4 (TAIL-DEFECON-4; towns from the before census, where the line now prints: the smallest and the largest, a crisis among them):

- (41) the heading "Crisis Adding Mouths to Feed" (the file's own) over the occupiers' and the newcomers' notes BESIDE A GAP, with "The crisis is cutting into the food supply now." — r2s-occupied-thorp-1 (thorp, occupied/famine); r2s-occupied-metropolis-3 (metropolis, occupied); r2r-city-3 (city, mass_migration)
- (24) "With the enslaved workers in revolt, the outlying fields lie idle, and less of the harvest is coming in." — r2s-slave_revolt-thorp-1 (thorp); r2s-slave_revolt-metropolis-2 (metropolis); both slave_revolt
- (13) the alchemist's existing line "Herbal remedies, minor alchemical preparations, and potion sales. The local alchemist supplements conventional trade." under "Apothecary & Alchemy" where the label is Poor or Struggling — r2r-town-36 (town, mass_migration); r2s-plague_onset-city-1 (city, plague_onset); r2s-famine-city-2 (city, famine)
- (152) "Partial processing - worked only to semi-finished goods" — r2r-hamlet-16 (hamlet, famine); r2r-metropolis-14 (metropolis, under_siege); r2s-under_siege-village-0 (village, under_siege)

Batch 3 (TAIL-DEFECON-3; towns from the after census: the smallest and the largest it reaches, a crisis among them):

- (200) "Diversified — broad institutional economic base" (the ladder's existing rung, where the income mix's leader holds 20–49%; the veto's alternative needs a new rung word, the chair's) — r2s-wartime-city-1 (city 2054, wartime); r2r-metropolis-8 (metropolis 344689, succession_void); r2r-city-0 (city)
- (19) "The fishery here is fished out; the fish sold now is salted and bought in." — r2r-town-3 (town 1168, insurgency); r2s-religious_conversion-metropolis-1 (metropolis 42064, religious_conversion); r2r-city-14 (city)
- (19) "Goods passing through the crossroads, and what their traders spend while they stop." — r2r-village-9 (village 95, succession_void); r2s-insurgency-town-2 (town 2081, insurgency)
- (14) "Regulates airship traffic, assigns mooring berths, collects anchorage fees." — r2s-occupied-metropolis-0 (metropolis 28723, occupied); r2s-mass_migration-metropolis-3 (metropolis 248369, mass_migration)
- (2) "Stone is quarried here for the place's own building." — r2r-hamlet-16 (hamlet 20, famine); r2s-succession_void-hamlet-0 (hamlet 99, succession_void)
- (1) "Add craft guilds: weavers, etc." (the advice names only the absent crafts) — r2s-politically_fractured-city-2 (city 5280, politically_fractured)
- the fish lines silent (label and share alone) under a fish famine (8) or a fished-out water with no salted fish bought (9) — r2s-famine-hamlet-0 (hamlet, famine); r2s-famine-city-0 (city, famine); r2r-hamlet-10 (hamlet)
- International Commerce, label and share alone under a siege — r2s-under_siege-metropolis-1 (metropolis, under_siege)


Batch 2 (TAIL-DEFECON-2; towns from the after census: the smallest and the largest it reaches, a crisis among them):

- (329) source **"Harvest"** (the rents row's twin name; the veto's alternative: "Farm Yield") with **"What the households grow and raise on their holdings; the main living at this scale."** — r2r-thorp-36 (thorp 5); r2s-recently_betrayed-village-2 (village 394, recently_betrayed); r2s-under_siege-thorp-2 (thorp 6, under_siege)
- (78) "A busy market for spell services. Identification, augury, message sending, and contract-grade enchanting bring steady coin." (was "brings") — r2r-town-6 (town 1614); r2s-succession_void-metropolis-3 (metropolis 295750, succession_void); r2r-city-51 (city 2414, politically_fractured)
- (71) "Untaxed trade, fencing and theft bring money in here, but none of it reaches the treasury." — r2s-plague_onset-thorp-2 (thorp 9, plague_onset); r2s-famine-city-0 (city 2909, famine); r2r-hamlet-1 (hamlet)
- (22) the smuggling label's plain names where a front business, not a smuggling house, stands ("Black Market Revenue", "Shadow Economy (untaxed)", with their "Untaxed trade, fencing and theft …" line) — r2r-town-11; r2r-city-13; r2s-under_siege-city-2 (under_siege)
- (7) Pilgrim Trade, label and share alone under a siege — r2s-under_siege-village-0 (village 281); r2r-metropolis-14 (metropolis 271164); both under_siege
- (6) Spellcasting Services, label and share alone under a siege — r2s-under_siege-city-3 (city 5059); r2r-metropolis-14 (metropolis 271164); both under_siege
- (1) River Tolls and (1) Security Contracts, label and share alone under a siege — r2s-under_siege-metropolis-3 (metropolis 46730, under_siege)

Batch 1:

(towns from the after census: the smallest and largest it reaches, a crisis among them)

- (70) "A little changes hands here quietly, between neighbours, and no # reckons it up." — r2s-infiltrated-thorp-3 (thorp 6, infiltrated); r2r-hamlet-24 (hamlet 100, famine); r2r-hamlet-16 (hamlet 20, famine)
- (46) "The garrison and city watch maintain standard patrol coverage." — r2s-recently_betrayed-city-0 (city 2407, recently_betrayed); r2r-metropolis-10 (metropolis 159896); r2s-occupied-city-1 (city 10359, occupied)
- (38) "The garrison and city watch patrol on a regular round, so petty theft is often caught and planned crime seldom is." — r2r-city-39 (city 2866); r2r-metropolis-13 (metropolis 328486); r2s-occupied-city-2 (city 13152, occupied)
- (36) "What food is put by goes to whoever can pay the holder's price." — r2s-under_siege-thorp-2 (thorp 6, under_siege); r2r-hamlet-24 (hamlet 100, famine); r2r-hamlet-0 (hamlet 22, under_siege)
- (35) "The garrison and city watch are well paid, well equipped and patrol properly." — r2s-wartime-city-1 (city 2054, wartime); r2s-mass_migration-metropolis-3 (metropolis 248369, mass_migration); r2r-city-44 (city 2408, famine)
- (29) "You will see the garrison and city watch on the rounds most hours of the day; they catch the careless and miss the careful." — r2s-insurgency-city-3 (city 3504, insurgency); r2r-metropolis-8 (metropolis 344689, succession_void); r2s-famine-city-3 (city 11818, famine)
- (25) "The garrison and city watch walk the usual rounds." — r2r-city-38 (city 2853); r2s-succession_void-metropolis-3 (metropolis 295750, succession_void); r2s-famine-city-0 (city 2909, famine)
- (18) "Goods change hands here in back rooms and after dark, and nobody accounts for them." — r2r-thorp-10 (thorp 10, monster_pressure); r2r-village-26 (village 335, insurgency); r2r-thorp-54 (thorp 17, famine)
- (16) "The garrison and city watch are disciplined but resource-constrained: motivated with inadequate equipment and irregular pay." — r2r-city-28 (city 6009); r2r-metropolis-56 (metropolis 109654); r2s-monster_pressure-city-0 (city 6454, monster_pressure)
- (15) "Whatever the army's buyers will take is sold to them dear, and not all of it is as sound as it is said to be." — r2s-wartime-thorp-3 (thorp 6, wartime); r2r-hamlet-5 (hamlet 97, wartime); r2s-wartime-hamlet-3 (hamlet 84, wartime/famine)
- (15) "Deserters passing through need food and discretion, and some here give both." — r2s-wartime-thorp-3 (thorp 6, wartime); r2r-hamlet-5 (hamlet 97, wartime); r2s-wartime-hamlet-3 (hamlet 84, wartime/famine)
- (15) "With the siege closed round the place, what goods are left change hands in back rooms and after dark, at whatever the holder asks." — r2r-village-55 (village 102, under_siege); r2r-metropolis-14 (metropolis 271164, under_siege); r2r-village-43 (village 149, under_siege)
- (14) "Confrontations between the rebels' supporters and those loyal to the current authority." — r2s-insurgency-thorp-2 (thorp 9, insurgency); r2r-village-34 (village 355, insurgency); r2s-insurgency-hamlet-0 (hamlet 35, insurgency/famine)
- (9) "Petty theft, minor fraud, and opportunistic violence are persistent, driven by too many people with too little, and too few consequences for taking." — r2s-plague_onset-village-3 (village 197, plague_onset); r2s-mass_migration-city-2 (city 7126, mass_migration); r2s-famine-town-2 (town 407, famine)
- (8) "Lodging and a way onward, sold quietly to newcomers who were told to move on." — r2s-mass_migration-thorp-3 (thorp 7, mass_migration); r2s-mass_migration-hamlet-0 (hamlet 83, mass_migration); r2s-mass_migration-thorp-1 (thorp 16, mass_migration)
- (6) "The gates are shut against the siege, and the garrison and city watch hold them." — r2s-under_siege-city-1 (city 2679, under_siege); r2s-under_siege-metropolis-1 (metropolis 70862, under_siege); r2s-under_siege-city-0 (city 13252, under_siege)
- (5) "The garrison and city watch keep what rounds they can while the supplies they need are cut off." — r2s-under_siege-city-1 (city 2679, under_siege); r2s-under_siege-metropolis-1 (metropolis 70862, under_siege); r2s-under_siege-city-0 (city 13252, under_siege)
- (4) "Organized crime keeps its own order where the civil authority's reach fails, and extracts a price for it." — r2r-village-53 (village 269, politically_fractured); r2s-wartime-town-3 (town 1949, wartime); r2s-slave_revolt-town-3 (town 1271, slave_revolt)
- (4) "You will see the garrison and town watch on the rounds most hours of the day; they catch the careless and miss the careful." — r2r-town-13 (town 1671, mass_migration); r2r-town-51 (town 2465); r2s-politically_fractured-town-2 (town 1738, politically_fractured)
- (4) "The garrison and town watch maintain standard patrol coverage." — r2s-infiltrated-town-2 (town 660, infiltrated); r2r-town-35 (town 2149, recently_betrayed); r2r-town-44 (town 776)
- (4) "The garrison and town watch patrol on a regular round, so petty theft is often caught and planned crime seldom is." — r2r-town-39 (town 1115); r2s-occupied-town-1 (town 1994, occupied); r2s-succession_void-town-1 (town 1263, succession_void)
- (4) "The siege has shut the roads, so what contraband is already inside is hoarded and sold dear by those who know the patrol schedules." — r2s-under_siege-metropolis-2 (metropolis 33734, under_siege); r2r-metropolis-14 (metropolis 271164, under_siege); r2s-under_siege-metropolis-0 (metropolis 46527, under_siege)
- (4) "Arrests do happen." — r2s-under_siege-metropolis-2 (metropolis 33734, under_siege); r2r-metropolis-14 (metropolis 271164, under_siege); r2s-under_siege-metropolis-0 (metropolis 46527, under_siege)
- (3) "The garrison and town watch are well paid, well equipped and patrol properly." — r2r-town-10 (town 754); r2r-town-25 (town 1655, infiltrated); r2s-monster_pressure-town-1 (town 1295, monster_pressure)
- (3) "The garrison and town watch are disciplined but resource-constrained: motivated with inadequate equipment and irregular pay." — r2r-town-16 (town 996); r2r-town-15 (town 2344); r2r-town-28 (town 2273)
- (3) "No # of the place is paid to keep order; the occupiers keep their own." — r2s-occupied-thorp-1 (thorp 17, occupied/famine); r2s-occupied-village-1 (village 132, occupied); r2s-occupied-hamlet-0 (hamlet 20, occupied/famine)
- (2) "Residents protect themselves through their neighbours, or by paying whoever is strongest." — r2r-hamlet-54 (hamlet 39); r2r-hamlet-19 (hamlet 84)
- (2) "The garrison and town watch walk the usual rounds." — r2s-succession_void-town-0 (town 1089, succession_void); r2s-under_siege-town-2 (town 2453, under_siege)
- (1) "Visitors can walk anywhere at any hour, and there is little crime." — r2r-village-49 (village 168); r2r-village-49 (village 168)
- (1) "The garrison and town watch keep what rounds they can while the supplies they need are cut off." — r2r-town-9 (town 2161); r2r-town-9 (town 2161)
- (1) "The garrison and town watch exist on paper." — r2r-town-19 (town 1590); r2r-town-19 (town 1590)
- (1) "The gates are shut against the siege, and the town watch holds them." — r2s-under_siege-town-3 (town 2192, under_siege); r2s-under_siege-town-3 (town 2192, under_siege)


## Rows named for other groups · registers named stale · guards owed

- (batch 3, the arrival writer `src/generators/narrative/arrivalScene.js`, for the history seat; the gate's new lines)
  FALSE: r2s-infiltrated-town-1 "Bolts of cloth and bales of wool fill the carts waiting on the road out." (no cloth or
  wool exported); r2s-plague_onset-village-0 "Horse traders show their animals at the edge of the settlement …" (no horse
  or pack trader); r2s-under_siege-city-1 "The smell of horses and hay comes from the stables." (no stable); r2r-village-3
  "Carts of grain rattle toward the mills while the ovens send the smell of bread down every lane." (one grain mill, no
  baker). CANDIDATE: r2s-slave_revolt-city-2 "… the sound of the workings never quite stops." (under the revolt).
  JUDGED TRUE here (5f67f382d calls it false): r2r-village-19 "… a small shrine set into a wall." (a wall niche).
- (batch 3, `history` hooks now shown where an iron hook left the panel; the record is unmoved, their truth is the
  history writer's) CANDIDATES: r2s-monster_pressure-hamlet-2 "The threat is being exaggerated by someone who profits
  from wartime contracts." (no war); r2r-village-4 "The vigilantes have begun targeting innocents …" (no stress);
  r2r-hamlet-30 "Those in power are paying people to speak for them at the gatherings …". Plausible: r2r-hamlet-35 "A
  would-be heir …", r2s-politically_fractured-hamlet-0 "A relic claimed by both sides …" (both politically fractured).
- (batch 3) D22 (2), row 28528 "Waterborne freight services (cargo, pilotage)" under a siege (r2s-under_siege-metropolis-3):
  the label is the chain's `exportLabel` (`computeActiveChains.js`: TAIL-DEFECON-C's), and it is one member of a CLASS:
  every export under a siege (that town prints seven: legal services, military contracts, cultural tourism, planar
  trade …). NAMED for TAIL-DEFECON-C and the chair: a siege filter on the export list is a cure of the exports' writer.
- (batch 3) B11285 "Coal is dug here and sold on …" under the row name "Iron & Metalwork" (2: r2r-town-39,
  r2s-wartime-hamlet-0: coal dug and exported, no forge): the LINE is true, the ROW'S NAME is false; a twin name is a
  declared move with `treasury.js`'s map (not this group's): PARKED with its measure, 2 of 2.
- (batch 3, `viability.js`, seen, not cured) the summary's "has 1 operational dependency that require active management.
  1 plot hooks available." (agreement), every town with one: widest-first, for the next batch of `viability.js`.

- (batch 2) the arrival scene's pilgrim lines ("Pilgrims in travel-stained cloaks queue patiently for their turn at the
  holy places", "Pilgrims crowd the road in, and every second stall sells candles, tokens or someone's blessing") print
  where no house of pilgrimage stands (14 of the 26 towns of #15707): `src/generators/narrative/arrivalScene.js` reads the
  Pilgrim Trade income row; NAMED for its group, with the chair's ruling on #15707.

- The page-census grid's register: two falls (r2r-city-0 P7a, r2s-insurgency-metropolis-0 P7a) — stale low, NAMED, not re-taken (re-derived at the close).

## TAIL-DEFECON-6 · the four red files of the food and the stores, classed (2026-11-15)

Seat TAIL-DEFECON-6, from this branch's tip 887ff8eec. FIRST ACT: the joined line merged at **76a735ad** (it holds e81bf16f3):
139f5d2b, a merge commit of its own, clean. Work tree: a detached scratch worktree with its own `npm ci`, pushed by explicit
refspec. Each red run ALONE at 139f5d2b first: **7 reds** (famineStoresOneRounding 1, storesSpanFigure 1, r3c10FoodLinesTrue
3, editWorldFactResources 2). f663a2699 is NOT green for any of the four (all red there too), so each bisect starts from the
file's own last green point on the joined line's first parent, then inside the lane its merge brought.

| red | turned at (first parent → in the lane) | class | after |
|---|---|---|---|
| famineStoresOneRounding (1) | 33b12cbe (JOIN-1 · 9, coherence-upkeep) → **05ec9b60** (COHERENCE-UPKEEP, ruling 6: the full granary keeps `boughtShare('stores', keepOf(prosperity))` of its months; declared 225 of 360, all down) | (ii) RE-KEYED: soak1k-2452 now 5.3 (open, prints five); the only other famine granary at 5.5–5.9 in soak1k-952..3952 is **soak1k-1445** (metropolis, 5.9, held) | 1 failed → 3 passed (7506b770) |
| storesSpanFigure (1) | 33b12cbe → **05ec9b60** (the same move) | (ii) RE-KEYED: rpf-thorp-succession_void-13 now 1.2; the nearest same-shape thorp (no granary, 1.5) is **-20** | 1 failed → 3 passed (0a6493e0) |
| r3c10FoodLinesTrue (d) (1) | 3e482b32 (JOIN-8 · 19, tail-defecon-c) → **680d16b5** (the catalogue's D34 (a): the hot springs give no herbs; `resourceAnalysis.gaps` 16 of 720) | (ii) RE-KEYED: rr3-town-famine-isolated-1 holds no partial gap now; nearest same shape **-2** (famine town, an established apothecary beside the partial herbs chain, Alchemist shop missing) | 3 failed → 2 failed (4d0b097d) |
| r3c10FoodLinesTrue (a) (2) | red since the file's birth merge c2c12792: **825bcf24** (W2-FIX-DATA-HISTORY item B, `src/data/cultureProfiles.js`, first parent 8f222ff8, a declared data move) reworded celtic's "Herding and mixed farming …" to "Herds and field grain set a strongly seasonal food calendar." (stands only where herds AND grain feed the place) | (iii) NAMED: not the economy generators' file; the arm reads the culture by `/\bherding\b/` and its herd towns hold no grain | LEFT, red (the chair's) |
| editWorldFactResources A2, A6 (2) | green at its re-capture 4182e976; 77e480ac (JOIN-1 · 1, r3-code-c) → **9a3239ae** (R3-CODE-C-2 #457 #1163, `resourceGenerator.js` export rows; declared 54 of 720, `resourceAnalysis` only) | NAMED, NOT RE-CAPTURED: the six PRE_CHANGE digests are whole-world hashes and row 21's `derived` is the golden master's own control row; their re-capture (the file's plant ritual) re-takes a golden, which this seat's brief forbids. Every later generator move (05ec9b60, D34, R3, R2 …) moves them again | LEFT, red (the owner's door / the chair's ruling) |

OWED BY TAIL-DEFECON-5, done (82840f4a): `tailDefecon5RecordCures.test.js`'s R3 rows' bare `.not.toBe(old)` →
`expectAbsentWithAnchor([viewShort], old, short)` (the same assertion, anchored on the tab's figure); 12 passed before and after.

PROOF (each red alone before/after, above). No source file touched; no assertion changed in a re-key (the member only, the
move named in the commit and in a comment beside the member). Files naming a touched test (`r3c9ReaderLinesTrue`,
`houseInputReaches`): 1 failed | 11 passed before and after, the same red. eslint on the four touched files 0; the full type
ratchet exit 0; the negative-anchor and seed-loop walkers: the base's 4 reds before and after, none naming a touched file;
the twelve-birth grid (`page-census.mjs --grid`) exit 0, 2 falls (r2r-city-0 P7a, r2s-insurgency-metropolis-0 P7a) at
139f5d2b and after: no rise. No record moved (tests only): no census owed.

LEFT: r3c10 (a) and editWorldFactResources A2/A6, named above. Not built (ruling U3): R6, R1, R5, R4.

## What is left (TAIL-DEFECON-5, HANDED BACK by time after R2, 2026-11-15 ~05:50 UTC)

Pushed: the merge 694621784; R3 7ce6db273 and its ceiling e1577f2cd; R2 9cc8c6826 (its first push was refused by the type
ratchet, `isCriminal` on two rows' JSDoc types: fixed in the unpushed commit, behaviour unchanged). The meter read 0;
judged by time (about seventy minutes): no third cure could carry its tests, gates and push inside it.

LEFT, in this order (the rulings above stand, and R6 below: c2c goes after R2, before R1; each patch applies clean at 9cc8c6826, `git apply --check`):
1. (R1) c1b, `defenseGenerator.js :: computeDefenseScores` (LENT). Expected 55 / 30 / 17, readiness unmoved; READ the 30
   guard lines and the 17 conditions where they print. Its comment to be put in the file's form (the patch's names the
   measure). The reds to expect: the test files naming `scores.economic` / `defenseScoreBands` (not yet run).
2. (R5) c6a, `economicState.js` (one line, no line added: the module is at 885 of the 900 ceiling). Expected 41, one field.
3. (R4) c4a, `foodGenerator.js` (LENT). Expected `foodRecord.magicPct` 22. Check `foodGenerator.js` against any size pin.
4. THE CENSUS AFTER all five (`census3.sh` at the tip, `inventory.py`, `inventory_diff.py before.json after.json`), read
   through the inventory diff: what each move takes off the page. THE BEFORE is taken: `/home/user/inst5/cbefore` and
   `/home/user/inst5/before.json` (29,945 tab sentences at 694621784; the container's: re-made by `census3.sh` at
   694621784 if lost). The births BEFORE: `/home/user/inst5/b0` (694621784), after R3 `b3`, after R2 `b2s`.
5. The veto list: the five moves with their counts (R3 226 towns, R2 229; the rest when made). No sentence was written by
   R3 or R2: their moved lines are figures in existing lines (listed in their sections above).

THE CHAIR'S THREE LATER MESSAGES (queued 04:40-05:06, read by this seat only after its hand-back; the next seat's):
- (R6, 04:44 UTC; vetoable by the owner) A SIXTH CURE, after R2 and with it in the order: THE CAPTURE WITH NOTHING BEHIND
  IT (c2c, on lane/record-measure-3-2026-11-15 at 0e7f7234, its row-2 section): where NO criminal house stands and the
  capture is 10 or less, the record holds a capture of nothing (169 towns hold a shadow economy with no house, chain or
  income behind it). Expected: `blackMarketCapture` 232 towns, `economicDragDesc` 104, NOTHING ELSE (else stop and say
  it). Its own commit, a declared move; its tests run here, every inheritor read (the capture's tier readers are listed in
  the report). The measuring seat named no pin for any patch: the tests are the builder's for all six.
- (U2, 04:49) four red files touching this group's files, each to be classed (a regression cured; a pin a declared move
  explains, re-keyed by identity; or one line here with the file and the commit that moved it, `git log -S`). MEASURED
  ALONE by this seat at 694621784 and at 7849e2c32: IDENTICAL, 7 reds (editWorldFactResources 2, famineStoresOneRounding 1,
  r3c10FoodLinesTrue 3, storesSpanFigure 1): neither R3 nor R2 moves them; NOT YET CLASSED (no `git log -S` taken).
- (05:06) every NEW test: negatives anchored through `tests/helpers/anchoredNegatives.js`, seed loops through the totality
  helper, no literal state-prose sentence as an anchor (`tests/helpers/drawnProse.js`); do not edit
  `scripts/mutation-coverage-manifest.json`. OWED: `tailDefecon5RecordCures.test.js` was written before this was read:
  its R3 GONE rows carry a bare `.not.toBe(old)` (paired with a positive `toEqual`, but not through the helper); bring it
  to the helpers with the next cure's rows.

NAMED, not this group's files (from R3): `src/domain/viabilitySummary.js:50` (its own per cent, no floor: 4 towns' record
summary "0% … remains uncovered"; on no surface); the writer's rounding in `foodGenerator.js` (17 small towns' `deficitPct`
against its pounds). TESTS: the lesson of R3's ceiling: a cure's test list must include `tests/generators/economicStructure.test.js`
(size pins name no file).

THE INSTRUMENTS (this seat's): `git archive` CENSUS-3, READ-ALL, RECORD-MEASURE-1 (births-only.sh, fielddiff.mjs, load.cjs)
and RECORD-MEASURE-3 (the patches) into `/home/user/inst5`; `CENSUS3_PROBES=<CENSUS-3> sh births-only.sh <tree> <out>`
(~1 min); `node fielddiff.mjs <a>/corpus.ndjson.gz <b>/corpus.ndjson.gz 3`. Ad hoc checks in `/home/user/inst5/scripts`
(movedtext.cjs: a field's strings that left and arrived, by town; pcttab.cjs: the view against the tab's row; inv.mjs:
the food invariants), not committed. Work tree `/home/user/wt5` (local branch `tdc5`, pushed by explicit refspec to
`lane/tail-defecon-2026-11-14`; the main checkout holds that branch name); the census base tree `/home/user/wt5base`.

## What is left (TAIL-DEFECON-4, after batch 4, 2026-11-15)

HANDED BACK by time (about fifty-five minutes; the seat's mark is seventy, and no batch of this group's files is left
that is five towns wide and this group's to cure). Pushed: the merge 21e578caa, batch 4 b40f795b2 and its after run
(above). THE NEXT BEFORE RUN: batch 4's after run (`/home/user/inst4/after4`, outside every tree; it does not survive the
container): re-run `census3.sh` at the branch tip.

Left, widest first (D27), by file:
1. D28 / D31: no pair moves now; RE-MEASURE the table (above) after C1-E and D30 land; the data moves only for a pair still
   false then (hot springs → medicinal herbs the likely one).
2. NAMED, not this group's files (measured at 21e578caa):
   - B14842 "Pilgrim hospitality" exported (83 towns; 27 stand no inn, lodging, hostel, hospice, tavern, caravanserai or
     bath house): the reader is `computeActiveChains.js:743` (the export list from `RESOURCE_DATA[k].tradeGoods`):
     TAIL-DEFECON-C. A data cure (dropping it from `hot_springs.tradeGoods`) would silence it in the 56 true towns: not taken.
   - D24 "Defended Pass" (29 towns, false in 12: no fort, garrison, toll, watch, wall, militia or gate): the readers
     humanise the KEY `defended_pass`; the data's own label is "Mountain Pass". The leaf is `RESOURCE_DATA[k].label`; the
     printers are display files (the resource chips, "Nearby resources: …": `domain/display/tracePresentation.js` and its
     neighbours): the display seat.
   - 14622 the oasis line "It sends out dried dates, date wine and water rights" (16): the goods are
     `src/data/resourceChains.js:254` `finalProducts` (not this group's file) read by the chain display: TAIL-DEFECON-C.
   - the fish chains' goods under a fish famine (22820 11, 10282 10, 22836 9, 22837 8) and 24992 the Brickmaker with no
     clay (23): the chain display's rows (`activeChains`' outputs, computeActiveChains.js): TAIL-DEFECON-C.
   - the viability summary's agreement ("1 operational dependency that require …", "1 plot hooks available"): written by
     `src/domain/viabilitySummary.js:62` (not this group's) and cut by `domain/display/viabilityFilter.js`: it prints on
     no surface of the 720 dumps. STRUCK from this list (the record field holds it; named for that file's group).
3. Under five, waiting: 23808 (1), 16293 (1), B29907 (2), 22847 / 10284 (3), 22821 (2), 22838 / 09012 (1).
4. D29 OWED, for the close: ONE SHARED LEAF for the income-mix cut (`prosperity.js :: INCOME_LEADER_FROM` and
   `economyStateProse.js :: LEADER_FROM`, pinned to agree by `tailDefeconBatch3Lines.test.js`): a leaf under
   `src/domain/` both read; not this group's to build alone (the prose desk is another group's file).
5. Struck in batch 4: B00188, and B05887 under a field crisis. Named earlier and still standing: 28528 (TAIL-DEFECON-C),
   B11285 (parked), the arrival writer's lines (the history seat).

## What is left (TAIL-DEFECON-3, after batch 3, 2026-11-15)

Pushed: batch 3 (this file's section above), on the pilgrim gate 5f67f382d. THE NEXT BEFORE RUN: batch 3's after run
(`/tmp/dc3/after3`, outside every tree; it does not survive the container): re-run `census3.sh` at the branch tip.

Left, widest first, by file (measures from the census at the gate):
1. `incomeLineSiblings.js` · the alchemy line 03703, X9 03932 (83): "A thriving alchemical trade … draws customers from
   surrounding settlements": candidates 13 Poor or Struggling, 4 occupied, 3 plague onset (no siege: that twin stands).
   The prosperity label is computed AFTER `trueIncomeDesc` runs (economicState.js ~823), so a prosperity gate needs a
   reorder (a move): measure it, or gate on the crises alone.
2. `resourceData.js` (X9 and D24): the fish chains' goods under a fish famine (22820 11, 10282 10, 22836 9, 22837 8,
   22847 3, 10284 3, 22821 2, 22838 1, 09012 1); B14842 "Pilgrim hospitality" (77); 24992 the Brickmaker with no clay
   (23); 14622 the oasis exports where nothing is exported (16); 16293 (1); D24 "Defended Pass". These are DATA rows:
   the false print is a READER's (the chain display, the export list) that does not ask the famine or the roster.
   Find each reader first; a reader outside this group is NAMED.
3. `foodBalance.js`: B05887 "Crisis Cutting the Food Supply" under a plague with no failed source (106); B00188 the
   grain importer under a siege (60; `siegeCutsImports` already twins it: check what still prints); B27952 the slave
   revolt's idle fields where the food word is Secure (24); 23808 (1).
4. `resourceGenerator.js`: 15458 "exports semi-finished goods" (152, D3): check its writer first (D17: if the gap logic,
   name it for TAIL-DEFECON-R); B29907 (2).
5. `viability.js`: the summary's agreement (above).
6. Struck in batch 3: 11871, B11289, D22 (1), B27712. Named: 28528 (TAIL-DEFECON-C), B11285 (parked).

## What is left (TAIL-DEFECON-2, HANDED BACK by time after batch 2, 2026-11-15 ~01:15 UTC)

The seat handed back by time (about 62 minutes; the brief's 250,000 in about eighty) before a batch it could not finish.

THE PILGRIM GATE (D14, D21): DONE, its own commit (the one after the batch-2 hand-back). Measured: tabs 29,894 -> 29,897;
15707 78 -> 56 on the tabs (the 22 that print it whole; the siege label alone 5 -> 2; r2r-town-34 prints it folded as
"<N> Trade": the 26), X9 20913 80 -> 57; field diff (the batch-2 tree with and without the gate, on the 720): ONLY
incomeSources in the 26, arrivalScene in the 14, coherenceNotes in the 3. THE ARRIVAL INHERITORS, READ (NAMED for the
history seat, `src/generators/narrative/arrivalScene.js`, the false ones; not cured here): FALSE in r2r-village-19 "Someone has
left fresh flowers at a small shrine set into a wall." (no shrine stands); r2s-under_siege-city-1 "The smell of horses and
hay comes from the stables." (no stable stands, and a siege); r2s-infiltrated-town-1 "Bolts of cloth and bales of wool
fill the carts waiting on the road out." (no weaver; neither cloth nor wool is exported); r2s-plague_onset-village-0
"Horse traders show their animals at the edge of the settlement, where herders and townsfolk meet." (no horse trader
stands; only common grazing). TRUE: the other 10 towns' new lines (grain and mills, flour, looms, ovens and bakers, malt
and an ale house, a market, a mine's spoil heaps, a moneylender among banking houses, a church bell).

(The gate as measured before D21, for the record:) A SECOND STOP sent to the chair at ~01:10. The gate is one condition on
the Pilgrim Trade push in `economicState.js :: generateEconomicState` (the line `if (ecoInstFlags.religionInfluence > 68
&& (tradeRoute === 'crossroads' || tradeRoute === 'road')) {` takes `&& hasInst('shrine', 'cathedral', 'monaster',
'abbey', 'relic')`, the words in a frozen array beside the income lines). Its census, measured at the batch-2 tree: the
field diff on the 720 shows `economicState.incomeSources` in the 26 (the row leaves; the rest re-shared), `arrivalScene` in
the 14 AND `coherenceNotes` in 3 siege towns (r2s-under_siege-village-0, -town-1, -city-1): `narrativeGenerator.js:597`
(not this group's) writes "Settlement is under active siege. Trade income above reflects pre-siege operations. Current
effective trade is likely zero or severely restricted." wherever, under a siege, an income source's name contains
"trade"; there Pilgrim Trade was the only one, so the note leaves the page (2 prints each). D14 says anything else is a
stop: the chair's ruling on the 3 notes is awaited. The 14 arrival towns and what they lose and gain (to be READ, per
D14, when the gate is committed): r2r-village-3, r2r-village-9, r2r-village-19, r2r-town-16, r2r-town-24,
r2s-under_siege-city-1, r2s-infiltrated-village-2, r2s-infiltrated-town-1, r2s-plague_onset-village-0,
r2s-plague_onset-village-1, r2s-monster_pressure-town-0, r2s-slave_revolt-city-2, r2s-wartime-village-1,
r2s-wartime-village-2 (the guard's GONE pairs for it: r2r-village-3 and r2r-village-9 lose "Pilgrim Trade", Church Tithes
prints; KEEP r2r-village-13, a cathedral town).

THEN: batch 2's other rows are DONE. By D9 the rows of
`computeActiveChains.js` (03905, 28528; D6/D7) and of `defenseDisplay.js`, `dossierViewModel.js` are the other two seats'.
NEXT, in this seat's order: `incomeLineSiblings.js` with the fish rows (B07361 B07357 B07355, this writer's B07356
B07359; X9 10219 06426 06427; D5: the fish row of UPKEEP-HANDBACK's "WHAT IS LEFT"), the alchemy line (03703, X9 03932),
the ore and metal lines (11871, B11289, B11285), the quarry line (18655, X9 15745); then `prosperity.js` (10700 D2),
`tradeGoods.js` (2), `resourceGenerator.js` (2: 15458 D3), `resourceData.js` (1), `foodBalance.js` (3, and D8's iron
carts CONDITION, row 20893), `viability.js` (4), `cascadePass.js` (1), `isolationGenerator.js` (1); and X9's rows of
these files. THE NEXT BEFORE RUN: this batch's after run (`/tmp/dc2/afterF`, outside every tree; it does not survive the
container): re-run `census3.sh` at the branch tip.

## What is left of the worklist (HANDED BACK at the budget, 2026-11-15 00:10 UTC, after batch 1)

The seat handed back by time (66 minutes; the brief's 250,000 in about eighty) before a batch it could not finish.

1. FIRST (D6, D7): C1-A and C2-A in `computeActiveChains.js :: deriveLocalProductionFromChains`. Not begun.
2. Batch 2, MEASURED on the base record and ready to cure (`economicState.js :: generateEconomicState`, lines 69-368 at
   6b8a9b993), measure = towns false of towns printing:
   - 03348 (D1) "Agricultural Rents … from tenant farmers": 320 of 360 (thorps 112, hamlets 104, villages 104) stand no
     landlord (no lord's steward or reeve, no feudal or manor power). The SOURCE label "Agricultural Rents" is read by
     `src/domain/worldPulse/treasury.js` (`'Agricultural Rents': 'land_rents'`, not this group's file),
     `incomeLineSiblings.js:204` and `resourceGenerator.js:46`: cure the DESC only (a twin naming no tenant), or the label
     with treasury.js named for its group.
   - 15707 Pilgrim Trade with no shrine, relic site, cathedral, abbey or monastery: 26 of 87; 00386 the same under a siege:
     7.
   - 11426 "Identification, augury, message sending, and contract-grade enchanting brings": a four-item subject, 83 of 83
     (-> "bring").
   - B17543 "A busy market for spell services" under a siege: 5 of 83. 16644 River Tolls under a siege: 1 of 48.
   - B05884 "Smuggling Network Revenue" where no smuggling house stands (`hasSmuggling` reads 'front', so Front
     Businesses name it): 22 of 78.
   - 06146 / 06148 "it goes to the criminals who run them" with no criminal house or power: 48 of 65, 13 of 34.
   - 17619 Security Contracts (13): not yet measured (Merchant Guilds Suppressed; under a siege trade is halted).
   - The fish rows of this writer (B07356, B07359) go with the fish rows of `incomeLineSiblings.js` (B07361 B07357
     B07355; D5: read only the fish row of UPKEEP-HANDBACK's "WHAT IS LEFT").
3. Not begun: `incomeLineSiblings.js` (8), `computeActiveChains.js` (2: 03905 D1 mercenary hire 240, 28528 waterborne
   freight under a siege), `prosperity.js` (10700 D2), `tradeGoods.js` (2), `resourceGenerator.js` (2: 15458 D3), 
   `resourceData.js` (1), `foodBalance.js` (3, and D8's iron carts condition, row 20893), `viability.js` (4),
   `cascadePass.js` (1), `isolationGenerator.js` (1), `defenseDisplay.js` (15), `dossierViewModel.js` (6); and X9's
   43 export rows.

THE NEXT SEAT'S BEFORE RUN: the census at 6b8a9b993 is this seat's after run (`/tmp/defecon/after1`, outside every
tree; it does not survive the container): re-run `census3.sh` at the branch tip.

## How the instruments are re-made

`git archive origin/lane/chair-2026-11-08 docs/chair/2026-11-14/probes/READ-ALL` and
`git archive origin/lane/census-3-2026-11-14 docs/chair/2026-11-14/probes/CENSUS-3` into a directory outside every tree;
`census3.sh <tree> <out> 4`; `inventory.py <out> before.json`; `inventory_diff.py before.json after.json <rows.json>`.
The verification scripts are ad hoc python over `corpus.ndjson.gz` (a slim index: tier, stresses, roster names, factions,
the defence buckets, the safety profile), not committed.
