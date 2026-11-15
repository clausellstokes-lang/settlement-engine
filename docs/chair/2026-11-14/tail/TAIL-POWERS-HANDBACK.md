# TAIL-POWERS · the hand-back (kept current after every batch)

Seat: TAIL-POWERS (session_01ACmDYYAR58f9iwRCD2uHod), builder of the READ-ALL worklist POWERS. Chair: session_01ACmDYZrFEVXyZEUg1NDxxC.
Base: the joined line lane/join-2026-11-14 at **bcad1a358**, read back from origin before the first act. Branch: lane/tail-powers-2026-11-14
(pushed from a scratch worktree's local branch `tp-wt` by explicit refspec; the repository's main checkout was never staged, committed or reset).

## The rulings worked to (the chair's, 2026-11-14; each vetoable by the owner), copied
- (P1) A POWER'S STANDING IN A SENTENCE READS THE POWER'S OWN STRENGTH (one home): "close behind", "holds real influence", "contesting every
  decision" are false of a power the record gives as Suppressed or Minor: measure the sentences by the strength of the power they name; cure
  at the rung that writes them.
- (P2) A "How they deal" presentation that offers a meal, bread, a room or the hunting as usual needs what it offers (no failed food under a
  famine; the ground not depleted; a traveller's welcome not under a siege): declarations in the form the table already uses, a twin where a
  title would fall mute.
- (P3) A power named in a sentence takes its prose form from the leaf src/domain/display/powerSentenceName.js ("The Guard", not
  "Military/Guard"): every writer in your files calls it.
- (P4) "People follow the elders out of respect" beside a legitimacy crisis; "governs <town>" under an occupation: the governance line reads
  the record's legitimacy and the occupation: a twin true in that state.
- (P5) THE TITLE WORD ON A PERSON: build PART 10's L3 design as designed, measured its way.
- The brief's laws (BRIEF-TAIL.md): silence is true, a silence of true lines over twenty towns told first; a state left mute takes a twin; no
  ceiling raised; a draw is not moved; under a siege nothing comes in or goes out, under a famine no line offers the food that failed; one home
  for one fact; no new vocabulary word without the chair; every new or reworded line listed for the owner's veto.

## How the batches were measured (one declared efficiency)
Batches 1 and 2 touch disjoint surfaces (batch 1: the people cards' title lines, `npcs[].presentation` / `npcs[].secret`; batch 2: the power
cards, `powerStructure.factions[].desc`), so they were measured by ONE census before (at bcad1a358) and ONE after (both cures), the
inventory diff read once per batch's rows; the field diff shows each batch's own families only. One commit each.

- (P6, the chair 23:13 UTC) src/data/faceHonorifics.js is moved to this group, WHOLE, for P5; its readers (people/ties.js,
  domain/people/patronage.js, the pipeline's npc1Role/npc2Role) are not: build in the leaf, STOP on a part that needs a reader.
- (P7, the chair 23:17 UTC) "HEADMAN'S AUTHORITY" WITH NO HEADMAN'S HOUSE: DA (lane/record-measure-2026-11-14,
  docs/chair/2026-11-14/probes/RECORD-MEASURE-1/da.patch) granted as a declared move in rulingStructure.js: 38 towns and no other,
  23 families in those 38; its own commit. (P8, 23:41 UTC) DA STANDS; re-key tests/generators/powerCardOrderReads.test.js
  SW-B1·P50's military row by identity in DA's commit (with a headman's house "Headman's Authority", with none the size's civic
  seat; `desc` never the MIXED line); the golden NAMED; page effect to check: Headman's Authority 70 -> 32 towns, to Elder Council.

## Batch 1 · 12d8fd0a9 · the title lines need what they offer (P2) · src/data/people/titleSecretsPresentations.js
Rows CURED (towns printing before -> after, by the inventory diff; each drop equals the row's measure by the record):
11127 126->115 · 11047 121->114 · 11229 94->92 · 11327 83->80 · 11289 36->31 · 11315 89->83 (siege half) · B10713 39->36 ·
B10741 36->34 · 17122 57->53 · B16114 16->14 (siege half) · 17060 9->5 · 16932 65->0 (reworded). Also silenced, false the same way:
the master of the hunt's "best places to hunt." 13->12, the postmaster's riders' news 43->42 (both under a siege).
B10713 still prints in the town it was read in (r2s-occupied-*): READ TRUE under an occupation (games go on under an occupier) and kept.
Rows STRUCK (true by the record):
- B16523 fishmonger's stale fish: the secret claims no volume; a fishmonger who stands sells what fish comes, and stale fish sold as
  fresh is likelier, not false, when the catch fails.
- B10688 maltster "Sells malt to anyone who pays": 1 siege town, no famine; the buyers are the town's own.
- 10996, 16953 the harbour master's berths / harbour: every printing town holds a dock or harbour house (35 / 26); "trade access road"
  is the route class, not the water.
- B16461 camp foreman's tokens "from the foreman's own store": the store is the foreman's own (a truck system), no house claimed.
- 17541 caravanserai keeper (1 town, r2r-town-54): the town's route is `isolated` while a Caravanserai stands: the RECORD's own
  incoherence (every line of the title presumes caravans on a road): NAMED for the institutions/roster lane.
Rows PARKED (the vocabulary has no atom for a chain's input or a depleted resource, and the birth facts the title draw reads hold no
economy; NO NEW WORD without the chair): the potter and brickmaker's clay B10797 (93), B10668 (89), B16083 (85), B16204 (71); the
vintner's grapes 11176 (68), 11202 (60), B15974 (58), B10758 (56), 17453 (55); the quarry master's depleted stone B10693 (52); the
tanner's hides B10687 (47); the collier's timber B10676 (40); the dairy farmer's livestock B10584 (16), B10633 (15), B16106 (9),
B16648 (9), B10689 (8), B16543 (6), B16107 (1); the depletion halves of 11315 (hunting ground worked out) and B16114 (ore).
The word needed: "a chain works its input here" (domain/facts/chainWorking.js already answers it) as an atom, AND the title draw's
facts (people/representatives.js :: titleTown, not this group's) built after the economy. Measure = the towns printing (the reader's
LAND gap holds in the town read; not re-counted per town).
- 17190 castellan "let the walls go unrepaired": 16 of 61 printing towns also print "Fresh repairs show on <town>'s town walls ..."
  (a defence writer, not this group): NAMED for the defence lane (the visible repair or the secret: one home for the walls' state).

## Batch 2 · 21dc7fa4b · a standing sentence reads the power it names (P1); the elders' seat line reads the legitimacy (P4)
Files: generators/factionDynamics.js (powerLabelOf, one home), power/claimStanding.js, power/factionStanding.js,
power/rulingStructure.js (one argument on the existing line).
Rows CURED: 12831 111->0 · 20360 94->0 · 16773 84->0 · 28617 50->0 · 13421 73->50 (Suppressed 29->0) · 06026 55->17 (Suppressed
49->0) · 07269 51->45 (Suppressed 7->0) · 21207 108->37 (Legitimacy Crisis 71->0) · 16581 31->16 (Crisis 15->0). Also silenced,
false by P1: "Craft masters ... present in every civic dispute" 29->8 (21 towns, Minor/Suppressed craft guilds), the leading
merchants' "consistent civic presence" 31->30 (Suppressed).
Rows STRUCK (true by the record, numerically): 20266 (95 of 95 cards: the clergy ARE ahead of that arcane power), 20053 (17 of 17),
20362 (14 of 14: the craft guild is ahead), 20593 and 20600 and every "The gap between them and ... is narrow" (114 of 114: rank 2,
gap <= 6), 13756 LESSER_LANDED (claims no more than a Suppressed family bears: "limited political reach ... rarely decisive").
The governance account's seat rows B01698, B11535, B11562, B11564, B01914, B11563, B01715, B11541, B01720 ("<N>, the boat-headman
and Elder, holds its seat"): the reader's PEOPLE header gave the first title only; by memberships every such person (140 cards:
Elder 73, Household Elder 37, Headman 30) is FIRST of the governing power: true.
Field diff (both batches, the 720): factions[].desc 284 towns / 510 (batch 2 only); npcs[] families batch 1 only (above).
Pin re-keyed by identity: tests/generators/power/claimRungsCommanding.test.js "the same people" at Suppressed.

## EVERY NEW OR CHANGED LINE (the owner's veto), with towns it was read in (smallest, largest, a crisis)
- "Secret: Buys up grain that was meant for bread in the lean months, at a price no household can match" (65; was "the bakers
  cannot match"): r2r-village-57 (261), r2r-metropolis-14 (271,164, a siege), r2s-famine-city-3 (a famine).
- "Merchants with local reach; they trade here, but have little say in how the place is run." (30): r2s-insurgency-town-0 (2,117),
  r2r-metropolis-10 (159,896), r2s-under_siege-town-3. READ: on r2r-metropolis-10 the merchants' card then says "The craft guilds are
  present but outpaced; merchants set prices ..." (prices in the market, not the hall: read true; for the veto).
- "The trades regulate their own production and apprenticeships; a reliable secondary presence in civic life." (54): r2r-town-43
  (366), r2s-succession_void-metropolis-3 (295,750), r2s-occupied-city-2.
- "The trades regulate their own production and apprenticeships, but carry little weight beyond the workshops." (55): r2r-town-2
  (914), r2s-occupied-metropolis-3 (262,531, an occupation; read on the page beside "The merchants consistently outvote them").
- "The oldest heads of the community still decide things together, but fewer and fewer people accept their word." (71):
  r2s-under_siege-thorp-2 (6 souls, a siege), r2s-recently_betrayed-village-2 (394). NOTE: on r2s-under_siege-thorp-2 the Elder
  Council has ONE member, so "heads ... decide things together" (the original line's own plurality) is false there: the law "a
  body that must agree needs a body of more than one": a guard owed on the original and its twin (count the one-member councils).
- "Elders guide the community by custom, not by formal authority, but fewer and fewer people accept their word." (15; reworded
  after the after-run for the style law's "rather than": the same towns by construction, the births guard reads it in r2r-thorp-19
  and r2r-thorp-25): r2r-thorp-29 (11), r2r-village-26 (335), r2r-thorp-54.
Existing lines now printing in more towns (inheritors, read true at their labels): the arcane advisory rung (+111), "The merchants
consistently outvote them ..." (+84), "The craft guilds are present but outpaced ..." (+77), and batch 1's (in its commit).

## Rows named for other lanes
- 17541 caravanserai in an isolated town (the roster); 17190 the walls' repair state (defence); the parked chain-input rows (the
  vocabulary and people/representatives.js :: titleTown).
- B11586 "the senior guild master and Alderman" on a woman, B11556 "Lord Mayor" on a woman: P5's shape (the title word on a person):
  carried to P5, below.

## Registers named stale
None re-taken. The generator golden (tests/property/generatorGoldenMaster.test.js) was red at the base and stays red: the merge seat's
re-record carries this move (factions[].desc, npcs[] presentation and secret families above).

## The named test files (79 naming the touched files), base against tip
Base bcad1a358: 24 failed tests (mergeLadderHeldKeys, powerStateProseDesk, r3c9ReaderLinesTrue, captureBirthScale,
pipelinePinnedChoosers, powerEconomyFreshness, proseNumerics, proseWiringCensus.walker, editCorpusRatchet, espionageDormancyFence,
generatorGoldenMaster): CARRIED, not this seat's. At the cure: the same set but two (mergeLadderHeldKeys A7 and editCorpusRatchet
A5 passed: timing), and two new reds, both cured before the commit (the claim pin re-keyed; the style law's "rather than").

## What is left of the worklist (by width), and what is next
- P7/P8 DA (Headman's Authority with no headman's house; 38 towns): NOT STARTED (the next seat's first item, its own commit).
- P5 (faceHonorifics.js :: styledTitleOf, PART 10's L3): NOT STARTED.
- P4's occupation half: 02559 Duke governs (16, 1 occupied), 02606 consortium (17, 1 occupied), "Free Elder Council ... no lord stands
  over" under an occupation (1): measured, not cured.
- The rest of the table: rulingStructure's 23333 "Undermanned and underfunded" beside a Fortress (34), 03509 "merchants, guilds ...
  compete for seats" (33), 04923 church "all ecclesiastical" (32), 02622 "aldermen, guild masters" (18), 18060 (14), 03925 "thin
  economy" in a prosperous town (12: needs prosperity in the rung's context), 11810 (11), 17652 (8); claimStanding 06725, 18554,
  10424 (a council named where none sits); factionStanding 22803 (53), 00339 (37), 22709 (22), 04348, 20686; governanceNarrative
  (28 rows, 297), factionDynamics computeFactionRelationships (33, 130), dmPowerLines (30, 157), governanceAccount standingSentence
  ("Crime has left ... contested" with no crime, 7 rows), governingStressVignettes (7), stressFactions (4), handlerTieLines (2),
  settlementNarrative TIE_GLOSS (2), factionProfile (2), powerStrata (2), conflictIssues (1), stressPowerFaces (1).
- Guards owed: the one-member council's plural lines (above).
- THE EXPORTS' ROWS (the chair's note X9, 00:00 UTC, read after this seat's last batch): docs/chair/2026-11-14/read-all-3/WORKLIST3-
  POWERS.md and .json on the chair's lane, 32 rows (1 HIGH) that only the PDF and the journal print: NOT READ by this seat, LEFT whole
  for the next. Measure with `SURFACES=PDF,Journal python3 inventory.py <out-dir> x.json` (re-fetch the instrument); check NO-SEAT
  and currentTensions rows against `npcs[].memberships` and `history.currentTensions` first. Batches 1 and 2 were measured on the
  tabs only; their writers print on every surface, so their export rows (if any of the 32) may already be fewer.
- `powerSentenceName`: this seat did not change its signature (or call it anew).

## How the instruments are re-made
The census: `git archive origin/lane/census-3-2026-11-14 docs/chair/2026-11-14/probes/CENSUS-3 | tar -x -C <dir>`;
`sh <dir>/.../census3.sh <tree with node_modules> <out> 4` (~15 min births+render, ~7 min count). The inventory and its diff:
READ-ALL's inventory.py / inventory_diff.py (`python3 -I`). This seat's scripts (scratch, re-made in minutes): a pickled index of
the corpus per town (tier, population, crisis kinds, npcs' title/presentation/secret/memberships, institutions, powerStructure);
a label scan (each sentence's power and its powerLabel; the named rival's label and share); a field diff by family (flatten each
record, array indices folded to [], towns and values per path).

