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

## The chair's notes reaching this seat after its batches (read 02:33 UTC; each vetoable by the owner), and their state
- (P23) TAIL-DISPLAY-CIVIC-2's row for governanceNarrative.js: X9 24578 "Stability: Rigid (militant theocracy); monsters
  on the roads" (2 towns, the journal): P16's G3 member: 2 -> 0 in the exports (after1.x.json). STRUCK, cured by 0eaea0870.
- (P25) the ties seat's rows named for these files: 23160 (37: "Town watch; it enforces ordinances ... and reports to the
  council." under a Feudal Appointee), 03038 (4), 22409 (2: "The village reeve disagrees." in a hamlet), B19180 (2: "The
  church wants approval rights ..." with only "Access to parish church"). By script their WRITER is
  `src/data/powerSiblings.js` (FACTION_DESC_SIBLINGS, BASELINE_CONFLICT_SIBLINGS), the sibling tables rulingStructure.js
  and governanceNarrative.js read, not these files: the successor cures them at the selector in this seat's files
  (a condition or a twin) or the chair rules powerSiblings.js into the group. NOT VERIFIED. `relationshipArchetypes.js`
  is the ties seat's (T6): not touched.
- READ-ALL-4 FAULTS IN NEW LINES (1) governanceAccount.js "The Military/Guard is at odds with it." / "The hall is at odds
  with the Military/Guard and the Religious Authorities.": CURED by 0b1b41459 (0 towns after; "The The" prints nowhere:
  powerNameInProse strips the leaf's "The" and sets its own article). (2) deriveBaselineConflict's monster rung "The
  <force> is stretched thin and <seat> cannot agree on whether to raise a levy or hire mercenaries." (config monsterThreat
  `plagued`): MEASURED at a5a9e4372: 11 towns print it; safety Very Safe 1 (r2s-infiltrated-village-3), Safe 5 (r2r-hamlet-6,
  -26, -51, r2r-village-7 ...), Moderate 5; 10 hire no company (the line debates hiring, it does not claim one). The false
  core is "stretched thin" beside a Safe or Very Safe label (6 towns): NEXT for the successor, with B02757 (the same rung's
  "A monster incursion last season destroyed outlying farms", 11, every one plagued, no event in PAST). NOT CURED.
- P21's HOLD IS LIFTED (the chair, 02:26 UTC): the density resize never changes the governing power (720 of 720), so
  `ruling body` takes new lines (the joined line at d817736d8 holds it: the one merge allowed). Not to be keyed on: the
  seat's capture state (moves after the write in 103 towns), its legitimacy crisis note (11). The one-member council's
  plural lines are the successor's to key; "Elder Council is being asked to do something about it and cannot agree what"
  is the record's class, named: leave it.
- The report diet (the chair, 02:03 UTC): no line per batch; one line at the hand-back, a stop, or a question.

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

## Handed back (02:45 UTC, at the mark; the account's usage warning on)
This seat stops after batch 2 at its budget, by file. The successor's order, widest first: the monster rung's "stretched
thin" beside a Safe label (6) with B02757 (11); B02464 (58, a size-true twin); the rulingStructure.js rows (21207 49,
07269 45, 23333 34, 04923 32, 03509 31 ...); the governingStressVignettes.js rows (05663 27, 15434 21 ...); P25's rows
(their text in data/powerSiblings.js: the chair's word on the file first); the one-member council's plural lines (P21,
the hold lifted: merge the joined line at d817736d8, re-take BEFORE there). The scratch trees are this container's
only: re-make the instruments as above.

---

# TAIL-POWERS-4 · the fourth seat (session_01ACmDYXF2rc56G4cPvXrn2b), kept current after every batch

Base: this branch at **a207c871b** (read back from origin; TAIL-POWERS-3's close). Scratch worktrees outside the
repository (`cen` the BEFORE census at the base, `cen2` the AFTER at e046a2ac4, `wt` the edits); local branch `tp4-b`,
pushed by explicit refspec; the main checkout untouched. No merge made (no row of this seat's needed `ruling body`).

## The chair's rulings since (2026-11-15; each vetoable by the owner), copied
- (P26, 02:42 UTC) THE TWO TABLES `FACTION_DESC_SIBLINGS` AND `BASELINE_CONFLICT_SIBLINGS` of src/data/powerSiblings.js
  are LENT to this seat (the sibling tables its files read); the rest of that file is the ties seat's and is not touched.
- (P27) THE ORDER, BY WIDTH as WHAT IS LEFT lists it: B02464 (58: the false core is the small thorp: a size-true twin);
  21207 (49: verify first); 07269 (45); P25's 23160 (37, in the lent table) with its three small kin; 23333 (34), 04923
  (32), 03509 (31); the vignettes' 05663 (27), 15434 (21); 21621 (24); 20987 / 00170 (20 + 20); then down to 13 towns.
  The monster rung's "stretched thin" under a Safe label (11 towns, 6 Safe or Very Safe) goes with B02757. A row printing
  in fewer than five towns waits (the military family's seven single rows wait: they need the final roster at a step
  that does not have it: NAMED). P20 STANDS. `ruling body` is safe at every step and takes new lines (the joined line at
  d817736d8 holds it: the only merge). Not to be keyed on: the seat's capture state, its legitimacy crisis note.
- (P28, 02:44 UTC; it reached this seat only at 03:32, after batches 1 and 2: the seat had not read its notifications
  at its start) THE FIRST ACT: merge the joined line at d817736d8 (a merge commit of its own, the only merge) and resolve
  governanceAccount.js's section 1 THE SEAT: THE DECLARED TWIN (P4) STANDS; X2's "under the Occupation Authority" yields
  in those sentences (what it leaves unused removed); X2's guard re-keyed to the twin BY IDENTITY; any other change X2
  made in the file stands. Measure: the 28 occupied towns print the twin and nothing else moves in the account.
- (U1) The account's weekly usage warning is on: commit and push every batch the moment it holds; WHAT IS LEFT current
  in the same push; hand back at 250,000 or about seventy minutes; one line to the chair at the hand-back only.

## How the two batches were measured (the first seat's declared efficiency)
Batch 1 moves `powerStructure.recentConflict` (and its reader `pressureSentence`), batch 2 `powerStructure.factions[].desc`:
disjoint, so ONE census before (a207c871b, `runs/before`, exit 0) and ONE after (e046a2ac4, `runs/after`, exit 0), the
inventory diff read once per batch's rows. FIELD DIFF (the 720, both batches): towns 109, families 3:
`powerStructure.recentConflict` 64 (batch 1: 23 thorps + 6 small estates + 11 monster + 24 revolt), `pressureSentence` 22
(its reader), `powerStructure.factions[].desc` 53 (batch 2). Nothing else moved.

## Batch 1 · 160c99790 · a conflict line claims what the place bears (governanceNarrative.js; the lent BASELINE table)
Verified by the record (the 720 at the base): B02464 prints in 58 (thorp 23, hamlet 20, village 15; thorps hold 6 to 30
souls); 20987 / 00170 in 20 (hamlet 3, village 3: "three estates" in places of 42 to 291); the monster rung's military
line in 11 (no monster raid in any PAST; its order label Safe or Very Safe in 6: "The militia is present and responsive");
21621 in 24 (4 a size; thorps and hamlets have no streets).
- B02464: a declared sibling set (needs `tier: ≥ hamlet`), twin "... and those on each side of it no longer speak to one
  another." The site's facts now carry the tier (`factsOf({ institutions, tier })`; no other set reads it). 58 -> 35 (the
  23 thorps), inherited town for town by the twin.
- 20987 / 00170 (+ "The families that lost them have not forgotten."): a declared set (needs `tier: ≥ town`), twin "A
  merchant has bought land the old landholding family once held, and the family has not forgotten." 20 -> 14 (the 6).
- B02757 and "stretched thin": the military line reworded: "Monsters prowl near the outlying farms, and no one here can
  agree whether to raise a levy or pay others to drive them off." 11 -> 0 (with the 7 seat variants of "The <force> is
  stretched thin and <seat> cannot agree ..."). A first wording ("hire mercenaries against them") rose the presumed-things
  walker by 1 (the word `mercenary`, a NEW line, not bankable): reworded before commit.
- 21621: "parts of the settlement are contested" (every size): 24 -> 0, inherited by the new wording 24.
Guard: tests/generators/power/tailPowers4Batch1.test.js (8 pairs red at the base, 3 KEEP green). Pin re-keyed by
identity: tests/generators/coherenceRepairPass.test.js "repairs defense before power prose" (the military branch's new
words; green at base and tip). Registers: the 3 presumed-things rows the cure left stale (streets 75da3dc0, garrison and
mercenary 664e6208) removed by the door's own `--shrink` (shrink-only; nothing banked).

## Batch 2 · e046a2ac4 · the seat's own line; "all ecclesiastical" only under the church's seat (rulingStructure.js)
No line added (P20: 799 of 799).
- 03509: the town body "Town Council" over another seat (Arcane 4, Military 5, Church 6, Merchant 6, Corrupt 4 of the 31)
  printed the council's "merchants, guilds, and prominent families compete for seats" as the governing line: the seat's
  own line of the existing tables prints. 31 -> 6 (the 6 left: a Town Council seat). Inherited: "Clergy hold substantial
  political authority ..." +6, "Merchant interests dominate the council ..." +6, "Military commanders hold direct
  political authority ..." +5, "The governing body is systematically compromised ..." +4, "Mages govern ..." +4: each the
  seat's own, read where it prints.
- 04923: "tithes, land, and courts are all ecclesiastical" needs an Ecclesiastical seat (Theocratic and Church Councils
  take their own rungs above it); else the ladder's next existing line. 32 -> 3 (the 3 left: an Ecclesiastical Council).
  Inherited: "Church holds substantial temporal power; tithes fund civic works and the clergy's opinion on appointments
  carries decisive weight." +29 (a church of 25 and over, Significant or Strong, under a crown, a duke, a guild or a
  city-state: its existing condition). A first try REWORDED the line (no condition): the walker read its "clergy" as a
  fresh presumption: reverted before commit.
Guard: tests/generators/power/tailPowers4Batch2.test.js (6 pairs red at the base, 3 KEEP green).
Silenced elsewhere (both batches): none. "Patron deity" and its two premium lines 717 -> 716 (r2r-thorp-3, the first town
of a render worker: the render race TAIL-POWERS-3 named; its record moved only in recentConflict).

## Batch 3 · 6c2fe3344 · the vignettes claim no workshop and no guild (governingStressVignettes.js)
Verified by the record (at e046a2ac4): 05663 prints in 27 (8 thorps of 6 to 30 souls, 5 hamlets: "the farms and
workshops" where a thorp of 8 holds no workshop); 15434 in 21 (13 with no guild: "two guild masters stayed away"). Both
REWORDED to claim what every printing town bears (above, the veto list). Measured by one census before (e046a2ac4,
`runs/after`) and one after (6c2fe3344, `runs/after3`, exit 0): FIELD DIFF towns 48, families 1
(`powerStructure.recentConflict` 48). Rows: 05663 27 -> 0 GONE, 15434 21 -> 0 GONE, each inherited by its new wording
town for town; nothing else in fewer towns. Guard: tests/generators/power/tailPowers4Batch3.test.js (4 pairs red at the
base). The presumed-things walker: fresh 147 (no rise); the files naming the vignettes: the 4 carried reds only.

## The merge · eb5e2ab0d · the joined line at d817736d8 (ruling P28)
One conflict, governanceAccount.js section 1 (two hunks): resolved to the declared twin; X2's `occupierOf`, `occupier`,
`under` removed (used nowhere else); X2's guard tests/components/tailDisplayCivicBatch1.test.jsx re-keyed by identity (its
three occupied rows read "<the hall> answers to the occupiers of <place>."); green. MEASURED by the account over the
720 records (`acct.mjs`, the merged module against the joined line's): 28 towns print the twin, 0 print "under the
Occupation Authority"; every other difference is this branch's own landed cures (P3's "The Guard", the Neutrals, P4's
occupier "at odds with" the hall in r2s-occupied-metropolis-1). Reds after the merge in the files naming the account
(engineCoreLazyEdge x2, r3c9ReaderLinesTrue n15, powerStateProseDesk 5a and ALIVENESS): red at d817736d8 itself, CARRIED.
NOT re-taken: a census at the merged tree (the successor's BEFORE: take it first).

## The gates (base a207c871b against the tip e046a2ac4)
eslint (touched files) 0; typecheck:domain:strict 0; typecheck:ratchet 0; the presumed-things walker --check: fresh 147,
strips fresh 1 at the base and at the tip (no rise), stale 0 at the tip. The 71 test files naming the touched files: the
base's reds CARRIED, the same at the tip (powerStateProseDesk 5a and ALIVENESS, the driven golden, the generator golden;
mergeLadderHeldKeys A2 A5 A6, pipelinePinnedChoosers A1 A6, mundaneRealmAcceptance, proseNumerics, proseWiringCensus x3,
editCorpusRatchet A3 A4 A7 A8: 18, named, not this seat's). The twelve-birth grid: 2 falls at the tip, the base's 2
(r2r-city-0 P7a, r2s-insurgency-metropolis-0 P7a): no rise. Registers named stale: the goldens (as carried).

## EVERY NEW OR CHANGED LINE (this seat; the owner's veto), with towns read
- NEW (twin, B02464): "A dispute over grazing rights and water access has run for two seasons, and those on each side of
  it no longer speak to one another." 23 thorps: r2r-thorp-37 (6 souls), r2r-thorp-4 (30), r2s-infiltrated-thorp-3 (a crisis).
- NEW (twin, 20987/00170): "A merchant has bought land the old landholding family once held, and the family has not
  forgotten." 6: r2r-hamlet-15 (42), r2r-village-6 (291); no crisis among the 6.
- REWORDED (B02757): "Monsters prowl near the outlying farms, and no one here can agree whether to raise a levy or pay
  others to drive them off." 11: r2r-hamlet-6 (57), r2s-infiltrated-metropolis-3 (33,900), r2s-infiltrated-village-3.
- REWORDED (21621): "The rebels' buildings are marked, and parts of the settlement are contested." 24 (every one a slave
  revolt): r2s-slave_revolt-thorp-1 (15), r2s-slave_revolt-metropolis-2 (127,443).
- Batch 2 adds no line: its inheritors are the tables' existing lines (above).
- REWORDED (05663): "Conscription has taken the workers, and every household is short-handed." 27 (every one wartime):
  r2s-wartime-thorp-3 (6 souls), r2s-wartime-city-2 (13,169), r2r-hamlet-5 (97).
- REWORDED (15434): "Pamphlets against those in charge pass from hand to hand, and several who were expected stayed away
  from the last assembly." 21: r2s-insurgency-thorp-2 (9), r2r-thorp-52 (25), r2r-metropolis-26 (21,872).

## Rows struck or named (this seat)
- 21207 (49): STRUCK by P4's test: every printing town is an Elder Council with NO legitimacy crisis (the crisis half was
  cured by the first seat). NAMED for the chair: 24 of the 49 read "Contested" legitimacy beside "people follow them out
  of respect" (no ruling covers Contested).
- 07269 (54 by record): 44 of the 54 print under a MINOR merchant power (P1: false of Minor); the cure is the claim
  settler's (power/claimStanding.js :: settleClaimsToLabel, the first seat's P1 rung), the other seat's file: NAMED.
- 23333 (42 by record): "Undermanned and underfunded; unable to enforce law consistently" beside a Fortress (21) or
  Well-Defended (17) readiness: the line is drawn by the military PRIORITY before the defence profile; readiness reaches
  only the replay. A cure wants the line reworded to the force's political weight (41 of 42 Suppressed or Minor) or the
  replay's label: NOT built (P20; no time for its census).
- FOUND, NOT A ROW (P3's class, the chair's call): rewriteFactionPhrasing (governanceNarrative.js) sets the bare seat
  name for "the council" ("... and Elder Council cannot agree", "Household Council filed a formal protest"): 221 towns'
  recentConflict at the base. The cure is the leaf's prose form with its article (`the ${powerSentenceName(seat)}`); a
  reword in 221 towns, so told before it is built.

## What is left of this seat's files (by width; towns PRINTING at e046a2ac4, the tabs; NOT verified unless said)
- powerSiblings' lent tables: P25's 23160 (37: "Town watch; it enforces ordinances ... and reports to the council." under
  a Feudal Appointee; FACTION_DESC_SIBLINGS, `watch` set) with 03038 (4), 22409 (2), B19180 (2): NOT VERIFIED.
- rulingStructure.js (799 of 799): 07269 (named above), 23333 (named above), 02622 18, 06026 17, 02606 16 / 02559 15 (true
  where they print), 18060 14, 16581 14, 03925 12, 11810 11, 17652 8; under five towns: wait.
- governanceNarrative.js: 12720 80 (P22: not this seat's); B02464's 35 left (hamlets and villages: true by the size);
  20987 / 00170's 14 left (towns and up); B13714 13; B00338 6 / B13657 2; 20963 2; the military family's singles (wait).
- governingStressVignettes.js: (05663, 15434 cured, batch 3) B21342 13, 22121 13, 15215 13, 21190 9.
- governanceAccount.js: as TAIL-POWERS-3 left it (the styled-title rows are faceHonorifics', B's).
- The one-member council's plural lines (P21, the hold lifted): merge the joined line at d817736d8 first.

## How this seat's instruments are re-made
As TAIL-POWERS-3's, plus (scratch, minutes): `idx.py <corpus> <out.pkl>` (per town: tier, population, stress, monster
threat, stability, recentConflict, seat, legitimacy, each faction's name/label/power/desc, houses, readiness, PAST) and
`fdiff.py <before corpus> <after corpus>` (every record flattened, array indices folded, towns per family). A red at the
base is shown by copying the base's files over the edit tree (`git show HEAD:<f> > <f>`), running, and restoring from a
tar of the tip's files; a census's tree is never touched while it runs.

## Handed back (03:45 UTC, at the mark by time; the meter reads 0; the account's usage warning on)
This seat stops after batch 3 and P28's merge (tip eb5e2ab0d). The successor's BEFORE is a census AT THE MERGED TREE
(it holds the joined line now). The order then, widest first: P25's 23160 (37) and kin (the lent FACTION table); 23333
(42 by record: a reword to the force's weight, P20); B21342 / 22121 / 15215 (13 each, the vignettes); the 221-town
article fault if the chair rules it in; the one-member council's plural lines (P21: `ruling body` is now on this branch).
