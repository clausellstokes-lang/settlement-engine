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


---

# TAIL-POWERS-2 · the successor seat (session_01ACmDYZCZqQsMwqRr8R9gvo), kept current after every batch

Base: this branch at **40238d3ab** (read back from origin; the predecessor's docs commit 097dc8bda landed after and is under my
commits). Scratch worktrees outside the repository; local branch `tp2-b`, pushed by explicit refspec; the main checkout untouched.

## The chair's rulings since (2026-11-15 00:20 UTC; each vetoable by the owner), copied
- (P10) THE GROUP IS SPLIT IN TWO SEATS BY FILE. THIS SEAT: `rulingStructure.js` (DA, and its rows 23333, 03509, 04923, 02622,
  18060, 03925, 11810, 17652), `governanceNarrative.js` (28 rows), `governanceAccount.js`, `governingStressVignettes.js`, and
  P4's occupation half (02559, 02606, the "no lord stands over" line under an occupation). NOT THIS SEAT (TAIL-POWERS-B, on
  lane/tail-powers-b-2026-11-14): factionDynamics.js, dmPowerLines.js, factionStanding.js, claimStanding.js, stressFactions.js,
  handlerTieLines.js, factionProfile.js, powerStrata, conflictIssues.js, stressPowerFaces.js, settlementNarrative's TIE_GLOSS,
  titleSecretsPresentations.js, faceHonorifics.js (so P5 and P6 are B's).
- (P7, P8) DA FIRST, ITS OWN COMMIT, A DECLARED MOVE; the pin SW-B1 · P50's military row re-keyed by identity; the golden named.
- (X9) THE EXPORTS' READ (read-all-3/WORKLIST3-POWERS, 32 rows): take the rows of this seat's files with a batch of the same
  writer, measured with `SURFACES=PDF,Journal python3 inventory.py`. `powerSentenceName`'s signature is unchanged by this seat.
- (P11) `rival power` and `ruling body` atoms are being built elsewhere: a line that needs one is PARKED with its measure.

## DA · d68805134 · "Headman's Authority" only where the roster holds a headman's house (rulingStructure.js)
Built from RECORD-MEASURE-1's da.patch on one line (F31's module ceiling: the test counts `split('\n').length`, so
rulingStructure.js may hold 799 lines by `wc -l`; it holds 799). Measured: Headman's Authority governs 71 -> 33 towns (38 had
no headman's house; the 38 seat Elder Council: village 16, hamlet 12, thorp 10; none prints the MIXED line). DECLARED MOVE, the
field diff (fielddiff.mjs, 720): 38 towns, 23 families, the measuring seat's own figures (in the commit). Page (the inventory
diff): "Governed by Headman's Authority" and its family 70 -> 32 towns, as the chair measured; the Elder Council family +38.
Pin re-keyed by identity: powerCardOrderReads SW-B1 · P50 (with a Village headman: "Headman's Authority"; with none: Elder
Council; never the MIXED line). The generator golden and espionageDormancyFence's driven golden: red at the base, stay red:
THE OWNER'S DOOR, named, not re-taken.
THE INHERITORS READ: "Elder Council (dominant/significant) armed backing" (4 + 4), "Elder Council vs Military/Guard" (3): the
measuring seat's predicted shape (a military-minded thorp reads as an Elder Council with armed backing): true. "The Elder
Council governs <N>." +28, "The oldest heads ... decide things together; people follow them out of respect" +13 (legitimacy
not in crisis there), "Few in <N> still accept the Elder Council's right to rule." +17: true at their labels.
ONE INHERITOR IS A KNOWN FALSE CLASS (NAMED, not cured here): in 14 of DA's 38 towns the Elder Council has ONE member on the
roster (npcs[].memberships) and the page prints a plural line ("decide things together", "its members cannot agree", "the
whole ... must agree"). The same 14 printed the plural "its members cannot agree" under the headman's name before; the class
(a one-member seat with a plural line) is 97 towns at the base and 102 after DA. The council's body is minted after the power
step (the people step), so the cure reads the roster after birth: the predecessor's "guard owed" below; writers rulingStructure
(the Elder Council's desc) and dmPowerLines / the temper lines (B's files). One line to the chair.

## Batch 1 · a708f0cf9 · P4's occupation half: the seat answers to the occupiers
Files: power/governingStressVignettes.js (occupiedSeatLine, a declared pool), power/rulingStructure.js (one call on the
stress line), domain/display/governanceAccount.js (the seat draws' twins, declared; the occupier off the "orders" line).
Rows CURED (towns, before -> after): 02559 16 -> 15 · 02606 17 -> 16 · "The elders of the hamlet decide things together, and
no lord stands over them." 27 -> 26 · 00382 1 -> 0 · the occupier's "no longer takes its orders" / "takes its orders no longer"
4 + 4 -> 0. Also silenced, false by P4 the same way (28 towns, over twenty: told to the chair): every seat line and every
"<seat> governs <town>." / "<town> is governed by <seat>." in the 28 occupied towns (66 town-lines; every one in those 28).
The record coincides: occupation stress = the governing row's `occupied` mark = an Occupation Authority, in 28 of 720.
Field diff: powerStructure.factions (the governing desc) 28 towns, nothing else. Measured with DA by one census before and one
after (disjoint towns: DA's 38 are calm or unoccupied small places; checked by script that every lost line lost its town in
DA's 38 or these 28). The cure was re-formed after the after run (the walker: a line that says "occupation" is declared
on the crisis atom and drawn through the door): the record re-born byte-equal (fielddiff: 0 towns) and the account's opening
re-computed equal to the after pages in all 720.

## EVERY NEW OR CHANGED LINE (this seat; the owner's veto), with towns read
- "<Seat> keeps the seat, but under the occupation nothing it decides stands without the occupiers' approval." (28; the
  seat's name by powerSentenceName): r2s-occupied-thorp-0 (13 souls), r2s-occupied-hamlet-2 (the Free Elder Council),
  r2s-occupied-metropolis-3 (262,531). NOTE: the exports print it as "Household Council (governing): Household Council keeps
  the seat, ..." (the name twice): true, for the veto.
- "<The seat> answers to the occupiers of <town>." in the account's three seat draws, the headless ("It has no head.") and
  the unnamed seat (28): r2s-occupied-thorp-0, r2s-occupied-metropolis-2 ("The Ducal Governorship answers to the occupiers
  of Nokhoihan."), r2s-occupied-metropolis-3.
- The occupier at the competitive tie now prints on the existing "<X> is at odds with it." / "The hall is at odds with <X>."
  (4 + 4): r2s-occupied-thorp-1, r2s-occupied-city-0.

## Rows struck or named (this seat)
- 12720 "Lightly defended" (80): the Defense verdict's readiness label (defenseProfile.readiness.label, printed by the
  defence views), not governanceNarrative's (the string only names the label there): NAMED for the defence lane.
- The exports' rows (X9) of this seat's files: 07413, 25617, 25916 GONE AT THE BASE (batch 2's claim rungs); left: 22578
  (= the tab row 04923), 17038 (= 18060), 24575 (= 15278), 16925 (militia patrol with no militia, 9), 12246 (the High
  Theocratic Council given the Grand Council's guild-masters line, 6), 17039 (= 18061).

## What is left of this seat's files (by width, measured at 40238d3ab)
- FIRST (the chair's rulings P16 and P17, 00:45 UTC, reached this seat only at 01:27, after its count; each vetoable by the
  owner; NOT STARTED): (P16) G2, G3 AND G5 GRANTED, from the record seat's patch (lane/record-measure-2-2026-11-14,
  docs/chair/2026-11-14/probes/RECORD-MEASURE-2/g235.patch: rulingStructure.js, governanceNarrative.js; its report's row and
  paragraph g): a bare "Stable" beside a Legitimacy Crisis reads "Tense (the seat has lost the people's trust)" (9 towns;
  `stability` only); the two theocracy words need a religious seat or a religious power of weight (8 and 8: rows 16601,
  16602); "strong military presence" needs a force (3: row 15278). Each moves its own label and nothing else; no new red; ONE
  commit, a declared move; the new stability word listed for the owner's veto. (P17) DA'S LAW FOR THE ARCANE COUNCIL: it
  governs in 6 towns with no arcane house: a government of a kind only where a house of that kind stands, else the next
  priority, else the size's civic seat; its own commit with its field diff. NOTE for both: rulingStructure.js is at F31's
  ceiling (799 lines by wc), so a line must be saved or folded.
- governanceAccount.js: P3 NOT MET: powerNameInProse does not read powerSentenceName: "The Military/Guard takes its orders no
  longer." (36 towns), "... is at odds with it." (24), "... no longer takes its orders." (18) and lists: 48 towns print "The
  Military/Guard" in the account. The cure: powerNameInProse reads the leaf (one line). NEXT, its own batch. Then the
  "Crime has left ... contested" rows B05801-B05822 (7, one town each: the safety cause read as crime), B11589 / B02095 (the
  merchant master holds the City/City-State Council's seat beside a quarrel, 4 + 3), 03254 (2), B17765 (1). 19716 (the
  Merchant Guilds "take its orders no longer" beside a stable tie: the relationship is factionDynamics', B's file). B11586,
  B11556 (a title word on a woman): P5, B's.
- governanceNarrative.js (28 rows): the baseline conflict ladder (deriveBaselineConflict): B02464 grazing dispute 57, 20194
  church veto over "council appointments" 24, 20987 / 00170 the merchants outbuying noble estates in a hamlet 16 + 16, the
  "military commanders ... civilian courts ... losing ground" family (21057-21067, B20041: 1 each, the governing power
  "losing ground" while Dominant), B00338 / B13657 rival guilds 5 + 2, B02757 monster incursion 6; the stress vignettes
  21621 (24), 20273 / B19612 (7), 20963 (5), 21564 / 22394 (2); the stability labels 15278 (13), 16601 / 16602 (5 + 2);
  B13714 (13). None verified yet.
- governingStressVignettes.js: 05663 (27), 15434 (21), 22121 (13), 15215 (13), B21342 (13), 21190 (9), 20626 (4).
- rulingStructure.js: 23333 (34), 03509 (33), 04923 (32), 02622 (18), 18060 (14), 03925 (12), 11810 (11), 17652 (8), 13525 (5),
  18061 (4), 10422 (2); none verified yet. Line budget: 799 of 799 (F31): a cure there needs a split or a line saved.
- Guards owed: the one-member seat's plural lines (97 -> 102 towns, above).

## How this seat's instruments are re-made
As the predecessor's, plus: `births-only.sh` and `fielddiff.mjs` from lane/record-measure-2026-11-14
(docs/chair/2026-11-14/probes/RECORD-MEASURE-1/) for a record-only check in a minute; a node script that re-computes
`governanceAccountOf` over a corpus and checks each town's page holds its opening (to re-verify a display cure without a render).
NEVER edit the tree a census is reading (render and the writers' trace read it to the end): edit in a second worktree.


---

# TAIL-POWERS-3 · the third seat (session_01ACmDYaMFkHSYP5593hvxgZ), kept current after every batch

Base: this branch at **288be89f4** (read back from origin; TAIL-POWERS-2's last hand-back commit). Scratch worktrees
outside the repository; local branch `tp3-b`, pushed by explicit refspec; the main checkout untouched. BEFORE census at
288be89f4 (`runs/before`, exit 0); each batch's AFTER is the next one's BEFORE.

## The chair's rulings since (2026-11-15; each vetoable by the owner), copied
- (P16) G2, G3 AND G5 GRANTED (RECORD-MEASURE-2's g235.patch: rulingStructure.js, governanceNarrative.js): a bare "Stable"
  beside a Legitimacy Crisis reads "Tense (the seat has lost the people's trust)" (9 towns; `stability` only); the two
  theocracy words need a religious seat or a religious power of weight (8 and 8); "strong military presence" needs a
  force (3). Each moves its own label and nothing else; no new red where it was measured. ONE COMMIT, A DECLARED MOVE;
  the new stability word on the veto list.
- (P17) DA'S LAW FOR THE ARCANE COUNCIL: it governs in 6 towns with no arcane house: a government of a kind only where
  a house of that kind stands, else the next priority, else the size's civic seat; its own commit, its field diff.
- (P20) THE CEILING OF `rulingStructure.js` STANDS: a cure that adds lines there moves an equal weight out into a leaf of
  its own (a new file beside it), in the same commit; the ceiling is not raised and nothing is banked.
- (P21) The one-member Elder Council's plural lines (14 of DA's towns; the class 102): a line about a council of many
  needs the atom `ruling body` (on the joined line, not this branch): when the order reaches such lines here, merge
  origin/lane/join-2026-11-14 AT eb054d53f (the only merge), re-take BEFORE at the merged tree, then key them with a twin
  true under one ruler. BUT WAIT for the chair's word on whether the density resize can change the governing power's
  one-or-many kind after a line is written: until then such lines are PARKED with their measure.
- (P22) "12720 Lightly defended" is the defence display's seat's (class f): not this seat's.
- (X9) The exports' read (read-all-3/WORKLIST3-POWERS.json): the rows of this seat's files, with a batch of the same
  writer; measured with `SURFACES=PDF,Journal python3 inventory.py <out-dir> x.json`.
- A rule of the instrument: a census's tree is not edited until its count finishes (this seat: one detached worktree a
  census, the edits in a third).

## Batch 1 · 0b1b41459 + 0eaea0870 · the account's power names (P3); the stability word (P16)
- 1a, 0b1b41459 (domain/display/governanceAccount.js; display only): `powerNameInProse` and `pluralPowerName` read
  `powerSentenceName`. Page (inventory diff, tabs): every "Military/Guard" line of the account GONE (18 + 14 + 9 + 8 + 3
  + 3 + 2 + 1 + 1 town-lines; 62 towns by the account re-computed), each inherited by its "The Guard ..." twin, town for
  town; "The # Bloc will back whichever side meets its price." 3 -> 0, inherited by "The Neutrals will back whichever side
  meets their price." 3 (+ 1 in a list): the leaf's name for "Third Bloc (Neutrals)" is plural, and the verb agrees.
- 1b, 0eaea0870 (power/governanceNarrative.js, power/rulingStructure.js), A DECLARED MOVE: FIELD DIFF (the 720)
  towns 20, families 1: `powerStructure.stability` (G2 9, G3 8, G5 3; the measuring seat's own figures). Rows (tabs):
  16601 "Rigid (militant theocracy)" 5 -> 0, 16602 (… monsters on the roads) 2 -> 0; 15278 "Ordered (strong military
  presence)" 13 -> 16: the 1 without a garrison gone (and 2 with the monster suffix), 4 inherited from G3 (r2r-city-18,
  metropolis-29, -36, -37): every one of the 16 (and the 24 towns printing any "strong military presence") has a garrison
  on the record, so the row is CURED where false and STRUCK where it prints. "Stable (theocratic governance)" 5 -> 4.
  NEW: "Tense (the seat has lost the people's trust)" 9. "Tense — regional monster threat" +2 (G5's two monster towns).
  P20: rulingStructure.js stays at 799 lines by wc: G2 is the return's own expression, G5 rides on the institution flags
  the call already passes (`instFlags: { ...instFlags, garrisonStands }`); no line added, none moved, none banked.
- Silenced elsewhere: none. "Patron deity" and its two premium lines 719 -> 717 (r2r-thorp-0, r2r-thorp-2): the first town
  of two render workers; their records are byte-equal to the base and nothing of this batch reaches the religion panel: a
  render race, NAMED (not a cure).
- Guard: tests/generators/power/tailPowers3Labels.test.js (9 pairs red at the base; 4 KEEP green; a plant, garrisonStands
  forced false, reds KEEP r2r-town-9, not committed).

## P17 · STRUCK by the record (no commit)
The 6 towns are r2r-town-1, -11, -49, r2s-famine-town-3, r2s-plague_onset-town-3, r2s-wartime-town-1. DA's law already
governs the Arcane Council (power/rulerKin.js :: drawCouncilOfAKind: a government of a kind is drawn only where
`hasHouseOfKind(institutions, kind)`, else the next priority, else the size's civic seat), and in each of the 6 the
record holds an arcane house by that test, AND the seat's own holder comes from it (`npcs[].memberships`: the Arcane
Council's rank 1): a Teleportation circle's circle-keeper (4 towns) or an Alchemist shop's alchemist (2). The measuring
seat's name test (/mage|wizard|arcane|enchant|academy of magic|hedge wizard/) misses both houses. Whether an alchemist
is an arcane house is the house-kind catalogue's call (people/representatives.js :: houseKindOf), not this seat's file.

## Batch 2 · a5a9e4372 · a baseline conflict line about the seat's rival needs the rival (governanceNarrative.js)
A DECLARED MOVE. `deriveBaselineConflict` (rolls nothing; written to `powerStructure.recentConflict`) takes three facts
from `buildGovernanceLabels`: P16's G3 atom `theocraticSeat`, `seatIsReligious` (the RELIGIOUS name test on the governing
row), `seatIsMilitary` (/military|garrison|war council/ on it); and the signals' `hasOwnChurch` (a church, cathedral,
monastery or temple that is not "Access to …"). The crusader rung and the heresy rung need `theocraticSeat`; the
religion rung is not said under a religious seat, and its first line needs `hasOwnChurch`; the military rung is not
said under a military seat. Each falls to the ladder's next rung; no line is new or reworded.
FIELD DIFF (the 720, batch 1's tree against this one): towns 29, families 2: `powerStructure.recentConflict` 29,
`pressureSentence` 9 (its reader). Rows (tabs, inventory diff after1 -> after2): 20273 commander-prelate 7 -> 0 GONE ·
B19612 "The garrison is mobilizing." 7 -> 0 GONE · 21564 / 22394 the church court 2 -> 0 GONE · 21066 2 -> 0, 21067 1 -> 0,
21062 1 -> 0 GONE · 20194 church veto 24 -> 16 (11 false gone: 9 under the church's own seat, 2 with no church of their
own; 3 inherited, each with a cathedral and a civic house under a ducal, city-state or military seat) · 20963 "The mages'
# is very quiet" 5 -> 2 (the 2 left stand under a High Theocratic Council; their "quarter" with a Wizard's tower only is
LEFT, measure 2). THE INHERITORS, read by record: "<seat> has been debating market levies … the merchants have stopped
attending" +7 (a live market and a hall each); "A monster incursion last season destroyed outlying farms" +5 (each
plagued, its stability saying the monster threat: B02757's class, not cured here); "The merchant class is outbuying noble
landholdings" +4 (metropolises with a noble power and a live market); "The most devout households want a say …" +3 (the
hamlets: the line's declared twin); "The military commanders … and Ducal Governorship / Democratic assembly is losing
ground" +2 (a Significant guard beside a Strong seat). A FIRST TRY (not committed) also gated "The church wants approval
rights over market day" on a church of its own: it pre-empted that line's declared twin in 24 towns; reverted.
Silenced elsewhere: none ("Patron deity" and "From here you raise …" 1 town less: r2r-thorp-3, the first town of a
render worker, its record unmoved: the render race named under batch 1).
Guard: tests/generators/power/tailPowers3Conflict.test.js (8 pairs red at the base; 3 KEEP green).
Pin re-keyed by identity (in the commit): tests/generators/governanceNarrative.test.js GS-4's heresy town (no roster)
keeps its governing row and gains a religious power of 30; its world-law question is unchanged; green at base and tip.

## The gates (base 288be89f4 against the tip a5a9e4372)
eslint (touched files) 0; typecheck:domain:strict 0; typecheck:ratchet 0; the presumed-things walker --check: fresh 147,
strips fresh 1 at the base and at the tip (no rise; none in this seat's files). The 60 test files naming the touched
files (2 workers): the base's 18 reds in 9 files (the generator golden, the driven golden, the merge-ledger A1-A8, the
pools' ALIVENESS, the debt and census baselines, the dry read: CARRIED, named, not this seat's), the tip's the same 18
after the pin above. The twelve-birth grid (--grid): 2 falls at the base, the same 2 at the tip (r2r-city-0 P7a,
r2s-insurgency-metropolis-0 P7a): no rise.

## EVERY NEW OR CHANGED LINE (this seat; the owner's veto), with towns read
- NEW: "Tense (the seat has lost the people's trust)" (P16's G2 word; `powerStructure.stability`, 9 towns, tabs and
  exports): r2r-thorp-23 (the smallest), r2r-village-10, r2r-town-44 (the largest it reaches); every one a Legitimacy
  Crisis; no siege, famine or occupation among the 9.
- CHANGED (a power's prose form, P3): "The Guard no longer takes its orders." / "The Guard takes its orders no longer." /
  "The Guard is at odds with it." / "The hall is at odds with the Guard." and their lists (62 towns): r2r-hamlet-10,
  r2s-under_siege-town-2 (a siege), r2s-slave_revolt-metropolis-2. "The Neutrals will back whichever side meets their
  price." (3 + 1): r2s-politically_fractured-town-3, r2r-metropolis-39, r2s-politically_fractured-metropolis-2.
- Batch 2 adds no line: the inheritors are the ladder's existing lines (above, read).

## Rows struck or named (this seat)
- P17: STRUCK by the record (above).
- 15278 "Ordered (strong military presence)": CURED where false (G5) and STRUCK where it prints: all 24 towns printing
  any "strong military presence" after batch 1 hold a garrison on the record.
- The render race (NAMED for the census's owner): the first town a render worker draws (r2r-thorp-0/-2 in one run,
  r2r-thorp-3 in the next) sometimes prints without the premium religion panel and the troops line; records equal.
- The after-count of batch 1's census was killed for memory (exit 137) while two grid runs shared the machine; its
  corpus and dumps were complete and are what the inventory reads; the count (patterns) was not re-run.

## What is left of this seat's files (by width; towns PRINTING at a5a9e4372, the tabs; NOT verified unless said)
- rulingStructure.js (799 of 799 lines, P20): 21207 49 (the elders "out of respect" line: P4's legitimacy half was
  cured by the first seat; what prints is the calm remainder, verify), 07269 45, 23333 34, 04923 32, 03509 31, 02622 18,
  06026 17, 02606 16 / 02559 15 (true where they print: the false ones were the 28 occupied, cured), 18060 14, 16581 14,
  03925 12, 11810 11, 17652 8, 18061 4, 13525 4, 10422 2. A cure there moves an equal weight out to a new leaf (P20) or,
  as batch 1 did, adds no line.
- governanceNarrative.js: 12720 80 (P22: the defence display's, not this seat's); B02464 58 (the ladder's last rung, the
  grazing-and-water quarrel "between the families on each side": measured at the base, of 57 printing towns 7 have
  under 15 souls and 41 hold no grazing resource in the analysis, but 39 have a herding house and every one has
  subsistence farming: the false core is the small thorp's "families on each side"; the cure wants a size-true twin,
  unbuilt); 21621 24 (the slave revolt's "streets" in a thorp); 20987 / 00170 20 + 20 (the merchants outbuying noble
  estates: batch 2 added 4 true metropolises; the false ones are the hamlets); B13714 13; B02757 11 (a monster raid
  "last season" with no event in PAST; every printing town is plagued); B00338 6 / B13657 2; 20963 2 (above); the
  military family's "<seat> is losing ground" where the seat is Dominant and the guard Minor (21057, 21060, 21061, 21063,
  21064, 21065, B20041: 1 each: the rung needs the guard's strength against the seat's, a reading of the final roster
  this ladder does not have at its step).
- governingStressVignettes.js: 05663 27, 15434 21, B21342 13, 22121 13, 15215 13, 21190 9, 20626 4.
- governanceAccount.js: the seat-holder's styled title (B11535 15, B01698 15, B11562 8, B11564 4, B01914 3, B11541 2,
  B01715 2, B11563 1, B01720 1: "<N>, the boat-headman and Elder, holds its seat": the honorific the seat styles on its
  holder, not on the roster: the styled title is faceHonorifics' (B's file); the account only prints it); B11586 /
  B11556 (P5, B's); B11589 4 / B02095 3 (the merchant master holds the City/City-State Council's seat beside a quarrel);
  03254 2; B17765 1; the "Crime has left ... contested" rows B05801-B05822 (1 each).
- PARKED (P21): the one-member council's plural lines, until the chair's word on the density resize.
- The exports (X9): 24575 (= 15278) cured with it; 22578 (= 04923), 17038 (= 18060), 16925, 12246, 17039 (= 18061) left.

## How this seat's instruments are re-made
As TAIL-POWERS-2's. Plus: one detached worktree per census (the census reads its tree to the end of its count) and a
third for edits; never more than one census and one test run at once on this machine (two grid runs beside a census
cost a count to the memory killer). `acct.mjs` (scratch): governanceAccountOf over a corpus, a JSON line a town, to
diff a display cure without a render. `rc.py` (scratch): a pickled index of the corpus (recentConflict, government,
the roster's labels, the houses, stress, monster threat) and a regex query over the conflict line.
