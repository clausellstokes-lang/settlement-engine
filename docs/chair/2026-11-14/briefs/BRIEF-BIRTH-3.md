# BRIEF-BIRTH-3: the owner's supply rule made whole on the joined tree (the seed writes once, the record tells)

You are BIRTH-3, the successor of BIRTH-2. This file is your whole assignment and binds you as written. Read, in this
order: this file; `docs/chair/2026-11-14/briefs/BRIEF-BIRTH-2.md` on the chair's lane (THE OWNER'S DESIGN: the table of
stories, the kinds, the odds; it binds you still, except where this file changes it); rulings BR3 to BR8 in
`docs/chair/2026-11-17/bar7/RULINGS.md` (BR8 is new and changes BR5 and BR7); rules R1 to R12 at the top of
`docs/chair/2026-11-14/briefs/BRIEF-BAR7.md`; the second reader's findings on BIRTH-2,
`docs/chair/2026-11-17/birth/BIRTH-2-SECOND-READ.md` (H1 to H3, M1 to M5, its answers (a) to (k): it is your worklist's
evidence: verify each before you cure it); at your checkout, BIRTH-2's hand-back
`docs/chair/2026-11-17/birth/BIRTH-2-HANDBACK.md` and its probes beside it (`birth2/`: you re-run them). Read nothing
more on the chair's lane.

YOUR CHECKOUT IS BIRTH-2's BRANCH (`lane/birth-2-2026-11-17` at 95f30800458501e90b79e24ddcaa4e287f4b5c97), and your own
and only branch, `lane/birth-3-2026-11-17`, is cut from that tip. YOUR FIRST ACT, AND YOUR ONLY MERGE: bring the joined
line into your branch, so that you cure ON THE JOINED TREE (the round's guards that the supply rule moves live only on
the line):
  git fetch origin lane/join-2026-11-14
  git merge --no-ff 7cf3cb9f0fd58217e73b36eaa2f8a6373660c2ba     (the line's tip: the round BAR7's six landed seats)
The chair's rehearsal and JOIN-17's own trial both found this merge CLEAN; after it `git rev-parse HEAD:src` reads
caeaf820fb8805e356cf81f28651ce513b91535a and `HEAD:tests` reads e11b5ea5f61cf785056ac6fbd148726417b243fb. If it
conflicts or a tree differs, STOP and tell the chair in one line. Commit it (your harness's trailer), push your branch,
and THAT TREE IS YOUR BASE for every measure "at your base" below. After it you merge nothing more. Every file of
BIRTH-2 is in your tree and is YOURS now, and so are the round's guards its cure moves. Your tip will land on the line
as one point (it already holds the line's tip).

## WHAT WENT WRONG, IN ONE PARAGRAPH (the chair's own fault first)

BIRTH-2 built what the chair's rulings BR5 and BR7 asked: nothing stored, and the page reads the town's seed to tell
each house's story. BUT EVERY SHARED VIEW OF A TOWN IS STRIPPED OF ITS SEED (`src/domain/display/publicSafe.js`: the
seed is confidential on every shared page, gallery view and the DM screen). There the story is read with an empty seed
(every proven ground there, every material bought, no venture) while the stored gaps and imports carry the birth's
seeded story: TWO VIEWS OF ONE TOWN TELL TWO STORIES. The chair did not know the shared page has no seed. Besides: the
failed venture's mark prints on no tab; the venture's own ground still feeds its neighbours; BIRTH-2's count ran out
with eight test files red and several items left.

## RULING BR8 (the chair's, vetoable): THE SEED WRITES ONCE, AT THE BIRTH; EVERY VIEW READS THE RECORD

1. NO READER AT PRINT, IN ANY VIEW, READS THE SEED, or anything worked out from it at read time. `seedOfRecord` and
   every default `seed = seedOfRecord(record)` go. The seed enters the supply rule at ONE place: the birth's writer (the
   resource analysis, handed the seed by BR7's one argument).
2. THE BIRTH WRITES EVERY STORY IT PICKS INTO THE FIELDS THE PAGE ALREADY STORES: the import's word where the story is
   "bought in" (as today, under a siege too: BR3); A GAP ROW for every house its story leaves without its material:
   the house idle on a used-up ground (with its worked-out line, as today) and the failed venture (its row's line is
   the venture's own line), WHETHER OR NOT A CHAIN ASKS THE MATERIAL (a mine or a peat cutter no chain asks has no row
   today: it gets one); NOTHING for a house the land answers (a listed ground, or a ground the house proves: BR4).
3. THE ONE READING IS A FUNCTION OF THE STORED RECORD ALONE: bought = the word stands on the stored imports; idle,
   worked out or a failed venture = its stored gap row (the venture is known by its row: by its line's own words, or by
   a `kind` value if every reader of the gap rows can take one WITHOUT A NEW FIELD: your call, said in the hand-back);
   the land has it = a source house with no such row and no word (its ground is listed, or the house proves it). The
   Resources tab's proven and depleted grounds are read the same way.
4. THE GAP LINE'S CONTRACT STANDS ("No <good> reaches <the house>." is parsed by `crisisStoppedRow.js ::
   housesShortOfInput` and `tests/helpers/houseInputSplit.js`: never reworded; a cause is the line after it).
5. NO NEW FIELD ON THE SAVED RECORD; THE SEED STAYS CONFIDENTIAL: nothing is stored but what the page already prints.
6. A TOWN SAVED BEFORE THIS RULE tells the story its stored rows tell (it reads as BIRTH-1 left it; a source house on no
   listed ground with no row proves its ground: BR4).
7. YOUR GUARD HOLDS THE THREE EQUAL: for every born town of your corpus, the stories, the marks, the gap lines and the
   Resources tab's grounds read from (a) the record, (b) the record with `_seed` and `config._seed` deleted, (c) its
   public projection (`toPublicSafe`, and the share veil as `tests/components/publicProseEquality.test.jsx` builds it)
   ARE IDENTICAL; and the story the birth picked for EVERY house (source or buyer) equals the story read back from the
   record it wrote.

## YOUR WORK, IN THIS ORDER (hand back what is done and name the rest; push after each)

**P1 · BR8** (the second reader's H1; its (a), M5): as above, with the guard of point 7.

**P2 · THE FAILED VENTURE'S MARK PRINTS WHEREVER THE SHORT MARK WOULD** (H2). The tabs, the person's card and the PDF
ask the short reading before the mark (`rowShortOf`), and BIRTH-2 made that reading empty for the venture. Carry the
venture THROUGH THE SAME GATE in the leaf (`src/domain/display/crisisStoppedRow.js`) so that every caller prints
"Abandoned: a failed venture." or "Failing: a failed venture." in place of "Short of ...", with no edit of a caller.
If a caller still needs one hunk, these three are yours BY NAME, one hunk each, said in the hand-back:
`src/components/new/tabs/InstitutionsTab.jsx`, `src/components/new/tabs/ServicesTab.jsx`,
`src/pdf/lib/crisisMarksOnPage.js`. Your guard asserts the mark ON A RENDERED TAB and in the PDF's reading: never
empty for a venture.

**P3 · THE VENTURE IS WHAT BR6 SAYS** (H3, M1, M2). A venture proves no ground: its own implied ground is not there, for
the page AND for the reader (it feeds no neighbour); no "worked out" line beside its line; "never a whole trade"
counts EVERY live house that uses the material, in whatever table it sits (the butcher, the bowyer, the thatcher: the
houses that buy and work), and no stored ground of the land list that yields the material stands (a burner beside a
stored coastal timber is no venture). Re-measure the ventures (they should stay about one town in fifty: say the
figure; do not tune the odds silently).

**P4 · THE RED FILES AND THE JOIN** (the list below, by name). Two are real faults that P1 and P2 cure
(`publicProseEquality`, `bar4MarkPromise` (a)): they go green by the cure, never by a re-key. The others are anchors
the cure has fed: re-key each BY IDENTITY with a dated note (same claim, another anchor: a town that cannot buy in, a
taker on a used-up ground, or a planted record); a guard is never narrowed. THE SCENE GUARD'S ARM
(`tests/generators/bar4ScenePresumption.test.js`, "REACHABLE (MU1)"): BIRTH-2 re-composed it; the round's scenes seat
has since cured the cloth twin in src. At your base, try BIRTH-2's edit REVERTED: if the whole guard is green without
it, it stays reverted; else keep the smallest composition that is green, and say which.

**P5 · SMALL THINGS.** (i) The venture's two lines agree in number ("no hides lie near"; "no livestock lies near"),
and the peat cutter's material is peat. (ii) THE SIEGE: other readers of the stored imports ignore a siege and now see
words in 26 besieged towns (`generalStateProse.js :: craftReasonPoolKey`, `economyStateProse.js ::
tradeProfilePoolKey`, `dossierViewModel.js`): MEASURE whether any line of a besieged page now says a material IS
bought in; cure it at the reader by the siege's own reading (each such file is yours for that one hunk), or name it
with its count. (iii) THE WORKER BUNDLE (`tests/build/generationWorkerLazy.test.js`, the ceiling): its rise is THE
OWNER'S, never a seat's edit: MEASURE the worker bundle's bytes at the line's tip and at your tip, say the number and
what would buy it back; do not touch the ceiling.

**P6 · WHAT BIRTH-2 LEFT, if your count allows, in this order:** the PDF's land list and the other readers of the land
list read the proven and the depleted grounds as the Resources tab does (its item 7: 171 towns exposed: the PDF first:
`src/pdf` land-list readers are yours for that, by name in your hand-back); the held input items (its item 9: the
maltster that needs a grain surplus); the 67 no-road buyers that "never had it" (its item 2 (e)); the card (item 8);
twenty-eight towns read through the renderer (item 12); the second ring.

## THE JOIN'S REDS BY NAME (the chair's full checks at that merged tree: its local trial of the same merge)

Run 09:15 to 09:41 UTC on 2026-11-17 at the merged tree (src caeaf820fb8805e356cf81f28651ce513b91535a, tests
e11b5ea5f61cf785056ac6fbd148726417b243fb). GREEN THERE: the two type gates, eslint, the architecture guards, the bar6
and bar5 guards, THE SCENE GUARD (8 of 8, with BIRTH-2's re-composed arm and the scenes seat's src cure both in), the
build and its two tests; both doors without a fresh row (classes: hits 1787, stale 151; things: fresh 39 as on the
line, stale 72); the walkers under `tests/lint` IDENTICAL TO THE LINE'S BY NAME.

RED THERE AND NOT ON THE LINE: YOURS (ten files):

| file | test | what it is |
|---|---|---|
| `tests/components/publicProseEquality.test.jsx` | services, soak1k-1, soak1k-5 and soak1k-10: every owner player-view line is on the shared page | A REAL FAULT (H1): green by P1, never by a re-key |
| `tests/domain/bar4MarkPromise.test.js` | (a) THE ZERO over the census's 720 | A REAL FAULT (H2): green by P2 |
| `tests/domain/bar4MarkPromise.test.js` | (d) the mark follows the page's gap line | read it (the second reader: its anchor is r2r-hamlet-9): green by the cure, or a re-key |
| `tests/components/bar7EconTab.test.jsx` | BAR7-ECON item 1 (8f), each control: the share opens with the mark; its line of ordinary times follows it | the round's economy guard: a control the story moved: read it; a re-key by identity unless it is a fault |
| `tests/generators/bar7Scenes.test.js` | BAR7-SCENES item 1 (8k.trade), rand-32's houses planted: the Potter, the Brickmaker and the Charcoal burner all short beside working Glassmakers | the round's scenes guard: a PLANTED record with stored gap rows: under BR8 a stored row tells the story, so it should go green by P1; if not, a re-key |
| `tests/components/crisisStoppedRows.test.jsx` | S5, the births table | an anchor (the second reader: likely r2s-famine-hamlet-2's dairy) |
| `tests/generators/bar4RecordHouseInput.test.js` | KEEP: the gap line the record now asks for prints, and the mark has its line; KEEP: a commercial sawmill with no timber; POSITIVE CONTROL (the rung arm) | anchors (a proven woodland feeding a sawmill): BR8 may cure them (their rows are stored); else re-keys |
| `tests/generators/gapSaysWhichKind.test.js` | missing: the TRUE gaps stay written | anchors soak1k-9, soak1k-302 |
| `tests/generators/houseInputReaches.test.js` | (M-V) KEEP: where the town is isolated or besieged the input does not reach it | the two besieged anchors are bought in by BR3 (c): re-key them to towns that cannot buy in |
| `tests/pdf/tailExportsPdf3Batch3.test.jsx` | each NOT row | anchors (r2r-metropolis-24's burner; r2s-occupied-city-2's salt works): the PDF is not wrong |
| `tests/build/generationWorkerLazy.test.js` | the worker bundle under its ceiling | THE OWNER'S: measure, do not touch (P5 (iii)) |

RED ON THE LINE ALREADY, NOT YOURS (leave them; name them in your compare): `tests/lint/ruinFilterRoster.walker.test.js`
"the scan reads CODE" (a stored count); `tests/domain/tailCorpusDefGuards.test.js` two rows of batch 6 (DS-DEF-3 Safe
v2 and v3); `tests/lint/factLayers.walker.test.js` three tests (the legalHouse row, the register's DS-ECO-6 rows);
`tests/lint/mutationCoverageManifest.test.js` TOTALITY (registrations owed by the round's guards: yours is NAMED, the
manifest is a shared tool); `tests/lint/tuningRegister.walker.test.js` (a stored inventory); the other walkers as on
the line (27 files).

## YOUR FILES

Every file BIRTH-2's brief gave it (`src/domain/facts/houseKinds.js`, `src/domain/facts/supplyStory.js`,
`src/domain/facts/houseInputAtHand.js`, `src/generators/resourceGenerator.js`,
`src/domain/display/validationOnPage.js`, `src/components/new/tabs/ResourcesTab.jsx`, the supply rule's hunks of
`src/domain/display/crisisStoppedRow.js`, the narratives step's one argument), its guard
`tests/domain/supplyStoryLaw.test.js` and the tests it re-keyed; the files this brief names for one hunk each; by rule
R8 every test in the list above and any other your cure makes untrue; your hand-back
`docs/chair/2026-11-17/birth/BIRTH-3-HANDBACK.md` and your probes beside it. NOT YOURS: every other file;
`src/generators/steps/assembleSettlement.js`, `vite.config.js`, `package.json`; `src/domain/display/publicSafe.js` (the
seed's confidentiality is not yours to change: your cure needs no seed); the files of the seats in flight (SECRETS-1:
`src/data/rareSecrets.js`, `src/generators/people/rareSecrets.js`, one hunk beside each call of `dealGoals` in
`narrativeGenerator.js` and `generateSettlementPipeline.js`; BAR7-ORDER: `guardLineUnderTheLaw.js`).

## THE MEASURES (each at your base and at your tip, by BIRTH-2's probes re-run; base first)

The owner's table again (the stories by houses and towns over the census's 720 and the wide read's 150; the ventures,
"Abandoned" and "Failing"; the odds as built); `fieldDiff` (no person, tie, name or roster moves; the stored rows that
move: the gaps grow by the rows written for houses no chain asked: DECLARED, with the count); the marks; the pairs
(the burner, the fish market); the siege without a cause; THE THREE EQUAL (point 7: towns where the three differ at
your base, and 0 at your tip); the auditors' runners over the 150 (no rule's count rises; the maltster's 8i.surplus
said).

## YOUR NET BEFORE YOUR LAST PUSH (each alone, through `sh scripts/gate-tail.sh`, never a pipe)

The two type gates; eslint on your changed sources; `npx vitest run tests/architecture`; your guard and every test of
the list above; the round's guards (`tests/domain/bar7*.test.*`, `tests/generators/bar7*.test.*`,
`tests/components/bar7*.test.*`, the bar6 and bar5 guards, the scene guard); the PDF anchors
(`tests/pdf/tailExportsPdf2Batch2.test.jsx`, `tests/pdf/tailExportsPdf3Batch3.test.jsx`,
`tests/pdf/seamPdfReadsTheTabs.test.jsx`); ALL OF `tests/lint` AT YOUR BASE AND AT YOUR TIP, COMPARED BY NAME (every
test red at your tip and not at your base is yours); the two doors (`--check`: no fresh row); ONE `npm run build` with
`npx vitest run tests/build/vendorPdfLazy.test.js tests/build/bootSmoke.test.js tests/build/generationWorkerLazy.test.js`
(the last red only by the owner's ceiling, with your measured bytes).

## HAND-BACK

`docs/chair/2026-11-17/birth/BIRTH-3-HANDBACK.md`: the owner's table FIRST; each finding of the second reader (H1 to
H3, M1 to M5) with what you verified, what you cured and its guard; the list above, test by test (green by the cure;
re-keyed to what; left, with the reason); the scene guard's arm; the three small things with their numbers; P6 item
by item; the net; what is left by name; for the owner's veto list in plain words: what changed in what a reader sees.
Budget: hand back at 700,000 of your count, then push nothing more. PUSH EARLY AND OFTEN: after P1, after P2, after
P3. One line to the chair at the end, 150 words at most. ASK the chair only if a cure needs a file this brief does not
give you, or a new field: one line, with your default.
