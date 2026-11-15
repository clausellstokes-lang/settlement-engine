# TAIL-DEFECON · hand-back (kept current after every batch)

Seat: TAIL-DEFECON (builder), group DEFECON (the safety, defence and economy generators and their display). Branch
`lane/tail-defecon-2026-11-14`, cut from the joined line `lane/join-2026-11-14` at **bcad1a358** (read back from origin,
2026-11-14 23:02 UTC). Worklist: `docs/chair/2026-11-14/read-all/WORKLIST-DEFECON.{md,json}` on the chair's lane (88
rows, read at e5b421802). At the base every one of the 88 folds still prints, in the town it was read in, in exactly the
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

## The veto list (every new or changed line, with towns it was read in)

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

- (batch 2) the arrival scene's pilgrim lines ("Pilgrims in travel-stained cloaks queue patiently for their turn at the
  holy places", "Pilgrims crowd the road in, and every second stall sells candles, tokens or someone's blessing") print
  where no house of pilgrimage stands (14 of the 26 towns of #15707): `src/generators/narrative/arrivalScene.js` reads the
  Pilgrim Trade income row; NAMED for its group, with the chair's ruling on #15707.

- The page-census grid's register: two falls (r2r-city-0 P7a, r2s-insurgency-metropolis-0 P7a) — stale low, NAMED, not re-taken (re-derived at the close).

## What is left (TAIL-DEFECON-2, HANDED BACK by time after batch 2, 2026-11-15 ~01:15 UTC)

The seat handed back by time (about 62 minutes; the brief's 250,000 in about eighty) before a batch it could not finish.

FIRST: THE PILGRIM GATE (D14), MEASURED AND HELD: a SECOND STOP sent to the chair at ~01:10. The gate is one condition on
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
