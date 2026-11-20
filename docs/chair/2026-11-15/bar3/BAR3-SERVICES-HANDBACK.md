# BAR3-SERVICES · hand-back (kept current after every batch)

Seat BAR3-SERVICES (group SERVICES), branch `lane/bar3-services-2026-11-15`, cut from the joined line at 59185b62a (read
back from origin: 59185b62a). Worklists: `docs/chair/2026-11-15/review-bar-3/WORKLIST-SERVICES.*` (8 rows) and
`docs/chair/2026-11-15/review-wide/WORKLIST-SERVICES.*` (1 row), on the chair's lane.

## The directions worked to (BRIEF-BAR3, section BAR3-SERVICES; each measured first)

- (S1) UNDER A SIEGE THE INSTITUTIONS TAB'S ROWS PRINT AS ORDINARY TRADE while the Services tab marks the same houses
  impaired or stopped (Daily markets, market squares, Butchers, Carpenters, Printing house, Weavers, Granaries; a Vintner
  short of grapes; a Periodic market "price discovery" in a besieged hamlet): the last round put the mark on one leaf for
  the Services rows: the Institutions rows read the same leaf.
- (S2) A SERVICE'S DESCRIPTION THAT PRESUMES A BODY THE TOWN LACKS ("The guild adjudicates conflicts." with no guild;
  "Formal church forgiveness, delivered by clergy..." and "Fake relics, forged dispensations, and corrupt clergy..." where
  the town has only access to a neighbour's church; "The organization decides what flows through here." with no such
  organization): the description is admitted by the house that would do it, or takes a twin that names the town's own form.
- (S3) "Fish sold daily from the morning catch." with the fishery depleted and no short mark; the Chroniclers' exchange's
  services on offer while its house is stopped by the siege; "Anyone with goods and the stall fee can sell at <town>'s
  market..." under a siege: the same marks.

THE PREMISES MEASURED (the 720 at 59185b62a):
- S1's premise is FALSE AS WORDED at this base: the Institutions tab already reads the one leaf (`crisisStoppedRow.js`) for
  its houses (the mark before the description) and for its service doors ("(stopped)", "(short)"), and wears the same
  chain tag ("Impaired") the Services tab's rows wear (read in the dumps of r2s-under_siege-city-0..3: Butchers, Carpenters,
  Weavers, City granaries, Daily markets all "Impaired" on both tabs; Merchant guilds' "Trade brokerage (stopped)"). What is
  true of S1 is the state the leaf did not mark on EITHER tab: the periodic market's trading day under a siege (cured, B1.4),
  and the vintner short of grapes (cured, B1.3). The S1 cure is therefore in the leaf's tables, which both tabs read.
- S2's church half: on the 720, "Indulgences and dispensations" prints only where a church stands (31 towns: parish
  churches, a cathedral): FALSE in none; the state (only access to a neighbour's church) is in the read town alone
  (bar0-hamlet-under_siege-rand-7). Cured all the same (B1.5). "Fake relics..." is `src/generators/safetyProfile.js`'s:
  NAMED below.
- S3's fish half: the SV6 reading took a house's grounds off the record's chains only, and the Fish market is named by no
  chain in most towns (its river fishery's chain is processed by the cooper and the merchant guilds): 16 towns of the 720.

## Batch 1 (S1, S2, S3: C22221, C5102, C13905, C14652, C14655, C14664, C25841 cured; C24313, C33899 named)

### B1.1 — a fishing house no chain names, on spent fisheries, is short of fish (C22221, S3)
`crisisDependence.js :: GROUNDS_WORKED_OFF_CHAIN` (fish_market, fishing_community, fisher_s_landing -> fishing_grounds,
river_fish) and `crisisStoppedRow.js :: housesOnSpentGround`: where no chain names the house as a processor, the house
takes the record's chains on the town's own fisheries of those kinds, and SV6's own reading judges it (every one on the
Depleted list, none kept by magic; a ground worker, so no import lifts it) -> "Short of fish." (the house's row and the
rows that live on its input; "Wholesale trade" and "Preserved fish" stay declared free, fed by the salted import).
Measure before: 16 towns (15 Fish markets, 1 Fishing community) printed the morning catch unmarked on all-spent fisheries;
after: 15 cured; 1 LEFT (r2s-plague_onset-thorp-2: its depleted fishery runs no chain on the record, so the reading has no
ground to judge: the record's). The read town bar0-metropolis-calm-rand-8: marked. (A first form read
`config.nearbyResources` and a chain's magic status itself: `factLayers.walker` red it as a new magic reader; re-cured to
join the existing, banked reading instead.)

### B1.2 — the chroniclers' exchange's rows carry its siege mark (C5102, S3)
The exchange is out of `SERVICE_FREE_OF_HOUSE`: where the siege stops the house, "Written answer", "Archive consultation"
and "Claim grading" print "Stopped by the siege." with it. Measure before: 7 towns (6, 6, 7 rows) printed the house
stopped and its rows on offer; after: 0. The pin `bar2ServicesRows.test.jsx` KEEP's r2r-metropolis-14 row (the archive
unmarked under a siege) moves by this declared cure into this batch's MARKED (dated note in that file).

### B1.3 — the vintner's wine is marked where the page says no grapes reach it (C25841, S1, S3)
`INPUT_GAP_HELD_EVERYWHERE` re-measured: the record no longer holds the vintner's gap everywhere (184 towns · 11 gapped;
the table's own count read "184 of 184" at d7c032485) nor the glassblower's (13 · 1). Both out; the table stays, empty.
Measure before: 11 towns printed "No grapes reach the vintner." on the Resources tab and "Table wine" / "Wine wholesale"
unmarked (6 of them under a siege), and 1 town gapped the glassblower; after: 0 for the vintner ("Short of grapes.").

### B1.4 — the periodic market's trading day under a siege (C13905, S1)
`HOUSE_DEPENDENCE.periodic_market` adds `travellers` (its trading day is the country coming in): under a siege the house
and its rows print "Stopped by the siege."; under an outbreak they were already curtailed (gatherings). 1 town of the 720
(r2s-under_siege-hamlet-3) and the read town bar0-hamlet-under_siege-rand-6. THE SIBLINGS READ for the same state: the
market square's "Weekly market" and the weekly market were already stopped; daily markets, multiple market squares and
district markets are markets inside the walls (S8 stands: their stock is the town's own); the black market's stock is in
the town. THE CLASS'S OTHER STATE, the fishing houses under a siege (their boats are on the water beyond the walls:
`fisher_s_landing`, `fishing_community` add `beyond the gates`): 10 towns (6, 4) printed the catch unmarked under a siege.

### B1.5 — the rows name the body the town has (C14655, C14652, C14664, S2)
`servicesGenerator.js`: (i) the `crimeIsGovt` rows fire where the town's only criminal house is a smuggling waypoint (the
stress reads "smuggling" as a criminal house: no guild, no criminal power stands; 1 town of the 720, r2r-village-53, and
the read town) as where a Thieves' Guild stands (3 towns), so the two rows are REWORDED to what all bear: "Dispute
resolution (criminal)": "Quarrels are settled by those who run the crime here. Their judgment is final, and resisting it is
unwise." and "Contraband licensing": "Those who run the crime here decide what moves through. Anyone who moves goods
without their leave is removed." (4 towns of the 720, 3 of them true lines reworded true: under the twenty); "Contraband
licensing" is declared on goods (a siege stops it). (A first form keyed a twin on the waypoint by name: `factLayers.walker`
red it as a new crime reader; re-cured by the rewording, no reader.) (ii) under `religiousFraud`, where no house of worship
of the town's own stands (`hasInstitution(roster, 'temple')`, the access row excluded), the indulgences' twin "Absolution on
paper, sealed in a distant authority's name and sold to whoever will pay." (names no registered thing; 0 towns of the 720:
all 31 that print the row hold a church; the read town).

### Struck / named
- C24313 "No office, no title, no vote." (13 towns): FALSE BY THE RECORD in 13 of 13 (a single household head speaks for the town where a council governs): every town that prints it has
  an Elder Council power. The writer is `src/data/institutionDescVariants.js` (the household elder's variant, `needs
  ['ruler: elder'], excludes ['ruling body']`): NAMED for BAR3-PLACES (the fact it needs: a governing council power
  excludes the line).
- C33899 "Connection: Dairyman <N>" (31 towns print the shape): the writer is `src/data/faceHonorifics.js` ("the dairy
  farmer": ["Dairyman", "Dairy Farmer"]) through the people's seat-keeper display: NAMED for BAR3-PEOPLE (the leaf: the
  holder's sex picks the form; "Dairy Farmer" is true of either).
- S2's "Fake relics, forged dispensations, and corrupt clergy..." is `src/generators/safetyProfile.js :: religiousFraud`'s
  crime-type line (its cover clause reads `inst.hasChurch`, which matches "Access to parish church"): NAMED for the seat
  that holds safetyProfile.js (the leaf: `domain/facts/institutions.js :: hasInstitution(record, 'temple')`).

### The batch's guard
`tests/components/bar3ServicesRows.test.jsx`: MARKED 8 pairs, REWORDED 5 pairs (every pair red at 59185b62a: run there
alone, 2 failed | 1 passed, the KEEP arm green; the base also stands as the plant: each pair reds against it), KEEP 3 rows
and KEEP_WORDS 1 row (green at both). Green at the tip.

## Every new or changed line (THE VETO LIST)

| line | towns it is read in |
|---|---|
| "Short of fish." on a fish market / fishing community no chain names (B1.1) | r2r-town-29 (town), r2s-plague_onset-thorp-2 (thorp, an outbreak), bar0-metropolis-calm-rand-8 (metropolis) |
| "Stopped by the siege." on the chroniclers' exchange's rows (B1.2) | r2r-metropolis-14 (metropolis, a siege), r2s-under_siege-city-0 (city), r2s-under_siege-metropolis-0 |
| "Short of grapes." on the vintner's rows (B1.3) | r2r-city-48 (calm city), bar0-city-under_siege+famine-rand-9 (siege and famine), r2r-metropolis-14 |
| "Stopped by the siege." on the periodic market and its rows (B1.4) | r2s-under_siege-hamlet-3 (hamlet), bar0-hamlet-under_siege-rand-6 (hamlet) — the smallest it reaches; no larger town holds a periodic market under a siege |
| "Stopped by the siege." on the fishing community's / landing's catch (B1.4) | r2s-under_siege-thorp-0 (thorp), the 10 siege towns of B1.4 |
| "Dispute resolution (criminal)": "Quarrels are settled by those who run the crime here. Their judgment is final, and resisting it is unwise." | r2r-village-53 (village, a waypoint only), r2s-wartime-town-3 (town, war, a Thieves' Guild), r2s-mass_migration-town-2 (town), bar0-hamlet-under_siege-rand-7 (hamlet, a siege) |
| "Contraband licensing": "Those who run the crime here decide what moves through. Anyone who moves goods without their leave is removed." (marked "Stopped by the siege." under one) | the same four |
| "Absolution on paper, sealed in a distant authority's name and sold to whoever will pay." | bar0-hamlet-under_siege-rand-7 (the only town that bears it: none of the 720) |

## Rows named for other seats

- BAR3-PLACES: C24313 (institutionDescVariants.js, 13 of 13 towns false by the record: an Elder Council governs).
- BAR3-PEOPLE: C33899 (faceHonorifics.js, "Dairyman" for a woman).
- the holder of `src/generators/safetyProfile.js`: "Fake relics, ... corrupt clergy" where only a neighbour's church is
  reached (its `inst.hasChurch` matches the access row).
- the holder of `src/data/dossierStateProse/general.generated.js`: "Anyone with goods and the stall fee can sell at
  <town>'s market without a guild's leave." under a siege (S3; 4 towns of the 720 print it, none under a siege).

### The inventory diff (before 59185b62a -> after, the 720)

Read whole (`inventory_diff.py before.json after.json` over both worklists' rows). The after census was taken at the
batch's first form (B1.1 read the town's grounds itself; B1.5 a waypoint twin); the final form differs from it in two
places only, each measured by the record at the final tip instead: B1.1 marks 15 towns, not 16 (the thorp whose fishery
runs no chain stays unmarked), and B1.5's rows are the reworded pair in 4 towns (the records' diff below).
- sentences 30017 -> 30037; gone 0; new 20; fewer 11; more 6.
- THE ROWS: C22221's sentence still prints (its mark is a sentence of its own): "Short of fish." 33 -> 49 towns (final: 48),
  "ServicesFresh fish retail (short)" 10 -> 21 (the Institutions doors); C5102: "Archive consultation (stopped)",
  "Claim grading (stopped)", "Written answer (stopped)" 0 -> 6 each (the doors) and the Services rows marked; C25841:
  "Short of grapes." 0 -> 11, "Table wine (short)" 0 -> 7, "Wine wholesale (short)" 0 -> 7; C14652, C14655: 4 -> 3 at the
  census form, 4 -> 0 at the final tip (reworded in all four); C13905: the periodic market's rows take "Stopped by the
  siege." (a sentence the town printed already; no count moves); C14664: 0 towns of the 720.
- FEWER, every one explained: "ServicesFresh fish retail" 72 -> 57, "ServicesFresh fish" 40 -> 37, "ServicesTable wine"
  57 -> 53, "ServicesGlass vessels" 7 -> 6, "ServicesWritten answer" 6 -> 5, "ServicesFresh fish (short)" 8 -> 7: the
  Institutions doors' text, now carrying "(short)" / "(stopped)" (false unmarked there, by B1.1-B1.4); the four criminal
  sentences 4 -> 3: B1.5 (true in the 3 Thieves' Guild towns and reworded true, under the twenty).
- THE INHERITORS (19, read where they print): each is a mark or a door word of B1.1-B1.4 ("Short of fish.", "(short)",
  "(stopped)", "Short of grapes.", "Short of glass sand.", the supplied head line "A row marked short is what its house
  makes when supplied." in 4 towns that now mark a row short) or B1.5's first-form rows in r2r-village-53 (superseded by the
  final rewording): each true by the record measure of its batch.

### Declared move (field diff by family, the final tip against 59185b62a)
- The 720: 4 records move, `availableServices` only (the two reworded rows in the four `crimeIsGovt` towns; no draw
  moved: no other leaf of any record differs). The display cures (B1.1-B1.4) move no record.
- THE 525 REFERENCE CONFIGURATIONS: 0 of 525 move (each record hashed whole at both trees).

### Gates (batch 1, the final tip)
eslint on the touched files: exit 0. The strict-domain gate: 1113, ceiling 1113. The type ratchet: 167, ceiling 167. The
twelve-birth grid (`page-census.mjs --grid`): 0 falls. The presumed-things walker: red at both trees with the same
message (below); my one fresh hit (the indulgences' first twin named "church" and "clergy") cured by its rewording.

## THE BOOKS MY CURES MOVE

The narrow net (BRIEF-BAR3 amendment 2), each file run ALONE through `gate-tail.sh` at the tip, and every red file again
alone at 59185b62a:
- (a) the files that pin a symbol I changed (`grep -rl` of the symbols: INPUT_GAP_HELD_EVERYWHERE, SERVICE_FREE_OF_HOUSE,
  HOUSE_DEPENDENCE, housesShortOfInput, rowShortOf, crisisDependence, crisisStoppedRow, generateAvailableServices, the
  renamed rows): 17 files, ALL GREEN at the tip (bar2ServicesRows, bar3ServicesRows, crisisStoppedRows,
  displayEconCrisisMarks, displayEconRelianceFoodWords, journalMarksCrisisRows, notableAbsences,
  servicesGeneratorTierSentinel, servicesStructure, upkeepHired, upkeepVocation, proxyIsNotProvider, services (joins),
  serviceCategoryRegistration, tailExportsPdf2Batch2, tailExportsPdf3Batch3, generationWorkerLazy).
- (b) the twenty law suites: 14 green at the tip; 6 RED AT BOTH TREES WITH THE SAME MESSAGE (the base's, not mine):
  `pipelinePinnedMode` (3 failed: the golden manifest's rows), `generationForkCensus` (1: the golden control row's
  hash), `presumedThings.walker` (2: three powers' "City watch; ..." lines, powerSiblings / claimStanding /
  rulingStructure, fresh and stale), `writerReach.walker` (4: "importPct on foodSecurity" and its mutants),
  `proseWiringCensus.walker` (2: the committed census's bytes), `engineCoreLazyEdge` (2: `domain/facts/ironAtHand.js ->
  domain/facts/crisisKind.js`). A LAW RED AT MY TIP ONLY: `factLayers.walker` at the batch's first form (a crime reader and
  a magic reader added): CURED AT ITS CAUSE (re-cured to no new reader), green at the final tip.
- THE BOOKS MY CURES MOVE: NONE. No stored figure moves by a declared cure of mine (0 of the 525; no register's row; the
  one pin moved is `bar2ServicesRows.test.jsx`'s KEEP row of the chroniclers' archive, a guard of the line B1.2 changes,
  carried into this batch's MARKED with a dated note in that file).

## Left of my worklist (in order, for a successor)

1. THE SAME SHAPE AS C5102, NOT CURED (a house marked "Stopped by the siege." whose own rows SERVICE_FREE_OF_HOUSE
   declares free print on offer beside it; SV1's judgment that the rows are true, so it is the house's mark that
   over-claims): Inns and taverns (district) "Entertainment" 6 towns, Luxury goods quarter "Custom commissions" 6,
   Inn (multiple) "Meals and drink" 3 (+2 outbreak), Cartographer's workshop "Map making" / "Copying" 3 (+3 outbreak),
   Cemetery network "Central register" 3, Travelers' inn "Meals" 1, Listening post "Claim weighing" 3 (outbreak). The cure is
   a wording question for the chair (the house's mark for a house partly stopped, or the rows marked as B1.2 did): measured by
   `marks2.mjs`.
2. THE FIELD WORK BEYOND THE GATES UNDER A SIEGE (S3's class, other houses): farmland 7, subsistence farming 11, charcoal
   burner 6, mine 5, salt works 3, dairy farmer 3, woodcutter's camp 2, shepherd 2, beekeeper 1 siege towns print their
   house unmarked (`siegeworkers.mjs`); each a declaration in `crisisDependence.js` (gates), to be read row by row first.
3. r2s-plague_onset-thorp-2: a fishing community on a depleted fishery that runs no chain (B1.1's one town left; the
   record's).
4. The salt works on spent flats beside live fishing grounds and the Mine on no ore ground (left by BAR2-SERVICES).
5. NAMED FOR OTHER SEATS (not mine to cure): C24313 (BAR3-PLACES), C33899 (BAR3-PEOPLE), "Fake relics ... corrupt clergy"
   (safetyProfile.js's holder), and S3's "Anyone with goods and the stall fee can sell at <town>'s market without a
   guild's leave." under a siege (`src/data/dossierStateProse/general.generated.js`: 4 towns of the 720, none under a
   siege; the read town alone: the holder of the state-prose corpus).

## How the instruments are re-made

`git archive` of `docs/chair/2026-11-14/probes/READ-ALL` (chair's lane) and `docs/chair/2026-11-14/probes/CENSUS-3`
(census lane) to a scratch directory; `census3.sh <tree> <out> 4` at 59185b62a and at the tip; `inventory.py <out>
<json>`; `inventory_diff.py before.json after.json <the two worklists' rows>`. The read towns born alone with
`births.mjs` over `packets8/seeds.bar3.txt` + `packets9/seeds.wide.txt`. My measures, each a few lines over
`corpus.ndjson.gz` and the tree's own leaf (`crisisStoppedRow.js`): `fish.mjs`, `workers.mjs` (ground-working houses by
chain, ground state and mark), `marks.mjs` / `marks2.mjs` (a marked house's rows unmarked), `wine.mjs`, `vgap.mjs` (the
S7 table re-measured), `siegeworkers.mjs`, `svcstate.mjs`, `s1.mjs`, `s2.mjs` (the S2 rows by the bodies the town has),
`elder.mjs`, `golden.mjs` (the 525 configurations hashed, by family).
