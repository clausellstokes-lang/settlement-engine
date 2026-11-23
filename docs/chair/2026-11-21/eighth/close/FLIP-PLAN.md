# THE FLIP ON PAPER (CLOSE-5 unit (1); written 2026-11-23 04:02 UTC, read from `date -u`; NOT BUILT: no line of the flip's code is touched before the chair's "BUILD THE FLIP <tip>")

Read on `lane/close-5-2026-11-23` cut at e5d1ca80a (CLOSE-4's final hand-back). The sources: `CLOSE-RECIPE.md` (the order),
`close-2/census/final/CENSUS-FINAL.md` and its classed tables on `lane/close-2-2026-11-22` at b99d46e5b (the census of
c1128c8f6: point 102 + 103 JOIN + 104 FORTUNE-C + the lighting census + the three dials and the `powersList` row), the
paper flip lists (`FLIP-LIST.md` on `lane/seat-10-2026-11-21`; `measures/lasting/FLIP-LIST-B.md` on
`lane/fortune-7-2026-11-22`; `close-3/FLIP-LIST-VACANT.md` here), the chair's E30 .. E131, N25, N26, N28, N31.
The counts below are taken by `awk` over `gen-classed.tsv`, `domain-classed.tsv` (final) and `census/lit-ui-classed.tsv`
(the rehearsal's part 5: the final part 5 is "the SAME 12 BY NAME", not re-classed): 84 + 57 + 12 = 153 rows, ALL (a).

## 0. THE BASE, THE BRANCHES, THE PROOFS BETWEEN COMMITS
- THE BASE: the tip the chair names at "BUILD THE FLIP <tip>": the line holding point 106 DAILY-B (4e7fa5667), 107 VACANT
  (4ef6d6c32), 108 DAILY-C (8036cfe71), 109 PRONOUN (95180c283) and, if it has landed, PROSE-D. (At this writing the line
  is still 244fa84ef; `lane/stack-106-wip-2026-11-23` is at cb598376f with 106 and 107 merged: read-only.)
- THE BRANCH: `lane/close-5-2026-11-23-flip`, `git worktree add -b lane/close-5-2026-11-23-flip /home/user/wt/flip <tip>`,
  `node_modules` symlinked, `/node_modules` in `.git/info/exclude`. Every commit there; each merge a plain command.
- THE RED LIST AT THE BASE: `ci/RED-AT-LINE.tsv` at the chair's branch as it stands for that tip (61 rows today; DAILY-B
  owes `voiceMechanics` and `deadOperationRatchet`), matched BY CONTAINMENT.
- BETWEEN TWO COMMITS A RED HAS ONE CAUSE: after commit 1 every one of the 153 (and whatever the landed cures add, section
  2) reds for the flip alone; each later commit cures a named subset; nothing else moves in it.
- AFTER EVERY COMMIT THAT TOUCHES A TEST FILE: `tests/lint` whole (COMMON-EIGHTH 11), through `scripts/gate-mutex.sh`,
  to a log, read by `tail`; the lighting census and the mutation manifest re-taken BY THEIR OWN DOORS in their own commit
  when they red (a re-seed that changes a title moves the lighting census: certain for arm 4 of both wiring files, whose
  titles say "says the dial is dark").

## 1. THE COMMITS, IN ORDER

### Commit 1 — THE DIALS, THE TEXTS OF DARKNESS, THE `powersList` ROW (CLOSE-3 (3)(i); recipe steps 1, 1a, 1b)
- The three `sed` lines of the recipe's step 1, each pattern CHECKED to match one line at 244fa84ef:
  `src/domain/seat/seatLaw.js` (line 77), `src/domain/seat/seatCircumstances.js` (line 50),
  `src/domain/fortune/fortuneLaw.js` (line 85); `git diff --stat` 3 files, 3 lines.
- Step 1b: `src/domain/facts/factLayers.js :: LEAVES.powersList` (line 217 at the tip) to layer 4 with its eight reads,
  moved under `// ── layer 4: over the cast ──`.
- Step 1a, the texts: `src/domain/density/densityCreateBoundary.js :: GENERATION_LAWS.seat.why` and `.fortune.why`
  ("THE DIAL IS DARK, and that is the chair's ruling …") rewritten to say lit, with the day, on the living-content row's
  precedent. AUTHORED LINES: drafted by this seat in `close-5/WHY-DRAFT.md` and READ BY THE CHAIR BEFORE THEY ARE BUILT
  (COMMON-RULES 12). Their two pins: `seatLawWiring` and `fortuneLawWiring` arm 4 ("… a WIRED row that says the dial is
  dark, and why"): re-pinned to the lit why, the titles with them.
- THE 14 DIAL PINS (the census's DIAL PIN rows; turned here, IF THE CHAIR RULES Q1 so):
  `seatLawWiring` 3 (the vocabulary; 1. CREATE (dark); 2. CREATE (THE CLAMP)), `fortuneLawWiring` 3 (the same three),
  `livingContentLawWiring` 3 ("CREATE (dark, fired deliberately)", "⭐⭐ CREATE (THE SAME-SEED CONTROL, LIT)",
  "⛔ CREATE (THE CLAMP)"), `seat/seatContest` 3 ((5) twice, (8) the craft variant), `fortuneMeritSentence` U5b (b) and
  `fortuneLastingSentence` U7b (c) (a "law 1" town born markerless: the cure FORCES law 1 in the test's own config,
  COMMON-RULES 14 (c), never a re-pin of its value).
- Comments that state the darkness as a present fact, read once and re-worded only where they do:
  `densityCreateBoundary.js` (the clamp's paragraphs: "a build whose dial is dark", three places), `fortuneLaw.js` header
  property 3, `seatLaw.js` header, the two wiring files' headers ("4. THE REGISTER … whose why says the dial is dark") and
  their arm-1 comments ("absent on every birth while its dial is dark").
- PROOF (one run, through the mutex): `tests/lint/factLayers.walker.test.js` whole; `tests/domain/generationLawsSavedPlace.test.js`,
  `tests/domain/seat/seatLawSavedTown.test.js`, `tests/domain/fortuneLawSavedTown.test.js` (the saved-place tests);
  the six dial-pin files above; `close-2/census/provelit.mjs` (the mint lit, the dark twin not). Expected: all green.
- Size: the recipe's "4 files" becomes about 11 (3 dials, `factLayers.js`, `densityCreateBoundary.js`, six test files).

### Commit 2 and on — THE DOORS, ONE COMMIT A DOOR (recipe 2b step 2; each door's own report in its message)
| door | rows | its command | when |
|---|---|---|---|
| the goal-sentence hashes `tests/fixtures/goal-hashes-d3937c3f8.json` | 6 (`goalSentencesOnceInTown`, the six tiers: holdings moved thorp 2, hamlet 7, village 55, town 97, city 148, metropolis 46 at the census) | `node tests/fixtures/goalHashes.mjs <tree> <out.json>` (its header read first: a stored figure, re-recorded with the cause written; whether the file's name carries a commit is read there) | on the base holding PRONOUN (WORDS:want) |
| the Daily Life no-people fixture `tests/fixtures/daily-life-no-people-before.json` | 1 (`dailyLifeNoPeople`: 13 of 30 births off) | the test's own capture arm (its header read first); its MASKED parity arm read green after | on the base holding DAILY-B and DAILY-C (WORDS:daily) |
| the page census `scripts/census/page-census.register.json` | 1 (`pageCensus.walker`: P16three LOST, none gained) | the census's own `--write` (shrink only) | any |
| the lighting census, the mutation manifest; the wiring census, writer-reach, the tuning inventory, the observed-shape readers ONLY IF RED | — | each its own door | after the commits that move them (the census's part 4 lit was 3 red, all listed: no register red at the flipped tree itself) |

### Commits — THE HAND ANCHORS, ONE COMMIT A LANE'S FILES (recipe 2b step 3; CLOSE-3 (3)(iii))
131 rows by hand (153 less the 8 door rows less the 14 dial pins of commit 1), by the census's `lane-list` column. Every new value READ FROM THE FLIPPED BASE ITSELF,
never from the census's recorded message (section 2: the landed cures moved words), each read by cause against the lane's
paper list before it is written; a move no list and no census row explains STOPS the commit.
| commit | files | rows | kinds |
|---|---|---|---|
| SEAT (who rules) | 14 less the 3 dial-pin files of commit 1 and the door file `goalSentencesOnceInTown` = 10 | 29 less 9 dial pins less 6 door rows = 14 | born anchor 8 + 3, premise 3 |
| FORTUNE | 20 less `fortuneLawWiring` = 19 | 39 less 3 dial pins = 36; of them 2 STAY RED (below) | born anchor 17, premise 18, stored pin 1 (`bar5SafetyLawBand` in-test count: 21 lit against 45) |
| JOIN (neither lane's list: the two laws together) | 49 less the 2 dial-pin files and the 2 door files = 45, plus the 2 SEAT+FORTUNE files (`r3c9ReaderLinesTrue` 1, `relationLinesSayTheRecord` 2) IF Q5 | 82 less 2 dial pins less 2 door rows = 78, + 3 | born anchor 34, premise 41, stored pin 2 (in-test counts `magicAudience` 63/54, `magicMeasuresApart` 29/26), the (d?) guard 1 |
The files, by lane, with their row counts: `close-5/ANCHORS-BY-FILE.tsv` (84 rows: `powersReadTheRosterP31` stands in SEAT
with 1 row and JOIN with 4: Q5).
- STAY RED, NOT RE-PINNED (the chair's E112): `defenceParts` "R13: … the will counts no more than the armed bodies"
  (a listed row: the defence lane re-cuts its bound after the first deploy) and `dualHatPoliticalMass`'s ORIGINAL arm
  ("a small place keeps the power …"; FORTUNE-C added the lit arm beside it): both NAMED for the red list (Q4).
- THE TWO SURPRISES (CENSUS-FINAL): `seat/seatHolderLines` U6 (2) u6t-city-4 and `seat/seatChainHolder` arm 8
  u7p-metropolis-21 plant only the seat's dials, so lit fortune moves their births. Lean: PLANT THE FORTUNE DIAL DARK in
  their own configs (each test means the seat law alone; COMMON-RULES 14 (c)), else re-seed (Q3); seatChainHolder's
  office-word guard, masked by the liveness anchor before it, READ GREEN AFTER, and named in the commit.
- MASKED GUARDS READ GREEN AFTER THEIR RE-PIN: `display/tensionCause` (its owner-versus-public parity arms),
  `dailyLifeNoPeople` (its parity arm), `seatChainHolder` (the office word); `governingModifierSurfaces` r2r-city-56 is a
  premise that moved (the governing row eighth by power, out of the Summary's five): re-seeded to a city where the
  governing row is in the five, the guard "one reader for one fact on every surface" kept whole.

### The last commit — PREPARED AND NOT SIGNED (CLOSE-3 (3)(iv); recipe 5b, 5c)
- THE LIT GOLDEN TWIN `tests/property/generatorGoldenMasterLit.test.js` from `lane/close-1-2026-11-22-golden-wip`
  (ba0e1c288), WITHOUT its manifest, by pick of its own commits: its three rows red by name and NAMED for the red list
  (E111). No manifest, no shift record, no register row is written by this seat.
- THE HOME PAGE'S SAMPLE TOWN (5c), on the flipped tree only: `--check` (exit 1 expected), `--seed lf-033 --emit`,
  `--check` (exit 0); the two `landingFixtureFreshness` rows go green by it; the diff and the narration for the owner's
  eye in `FOR-THE-OWNER.md` (Q7).
- `close/FOR-THE-OWNER.md` from `FOR-THE-OWNER-DRAFT.md`, each item with its exact command after his signing: signing 1
  (the old master: its diff now includes PRONOUN's words, 238 of 525 rows by CLOSE-4's count; the "her distrusts" fault
  is CURED at point 109, the draft's warning re-written); signing 2 (the lit twin: its counts re-measured on the flipped
  tree, VACANT and PRONOUN included); the sizes measured on the flipped tree by one build (the five figures beside the
  line's: the census's lit worker +2,335 is the flip's; VACANT's +2,039 and PRONOUN's +1,202 are theirs, already named);
  the tuning drafts; the red-list rows to add.
- THEN: "FLIP <commit>" with the list for the owner.

## 2. WHAT THE LANDED CURES CHANGE IN THE RECIPE AND THE CENSUS'S LISTS
- POINT 109 "PRONOUN" moves WORDS in dark and lit births alike (390 of 900 dark; 919 strings a pronoun's case, 188 the they
  rung). THE CENSUS'S RECORDED LIT VALUES ARE STALE WHEREVER A LATER MENTION IS PINNED: the 15 anchors that pin words
  (ties 7: `bar2People2Trade` r2r-town-15, `bar3PeopleTies` r2r-town-14, `bar8People` 13b, `faultsWatch` 8 judge,
  `tailTies4Batch2`, `bar4PeopleKinds` x2; wants 7: `goalSentencesOnceInTown` six tiers, `tonightOwnGoal`; Daily Life 1:
  `dailyLifeNoPeople`) are re-pinned ONLY on the base holding 109 and 106/108, and every other born anchor's new value is
  read from the flipped base too, never copied from the census.
- POINT 107 "VACANT": 9 of 900 lit births move a holder's line (W3 to W3v, W1 to W1v), all under `succession_void`; its
  paper entry expects NO census row to move. Its own tests (arms (10) to (15) of `seatHolderLines`) plant their dials and
  stay green flipped. The U6 (2) surprise is re-pinned in `seatHolderLines.test.js` as VACANT left it.
- POINTS 106 AND 108 (the Daily Life page) and PROSE-D: by their seats' words no lit path changed; `dailyLifeNoPeople`'s
  door waits for both.
- WHAT THE CENSUS CANNOT HAVE SEEN: the test files points 106 to 109 (and PROSE-D) added or changed. So, AFTER COMMIT 1 and
  before any anchor, ONE LIT RE-READ through the mutex: those files, the 84 anchor files, and `tests/lint` whole; each red
  matched by name to the census's 153 and the red list: a red on neither is a SURPRISE, read by cause, and goes to the
  chair before anything is re-recorded; a census row now green is named GONE. The whole suite lit is CI's run on the
  pushed flip branch (rule 24a), read by name.
- E123's SLOW LIST: 33 rows of part 1 and 38 of part 2 over 8,000 ms lit with no budget of their own (`gen-slow.tsv`,
  `domain-slow.tsv`; 38 marked NEEDS-READ). OWED "a cure in one commit before the flip lands": the recipe has no step for
  it (Q2).

## 3. WHERE THE RECIPE AND THE CENSUS DISAGREE (the census, being later and on the final tree, governs unless the chair rules)
1. The goal-hash door: the recipe says 5 rows, "five tiers"; the census and SEAT-10's list say SIX tiers, 6 rows.
2. The hand anchors: the recipe (the rehearsal at e987c3e36) says 136 rows in 74 files (premise 64, born anchor 58, dial
   pin 14); the final census has 153 rows in 84 files (premise 63, born anchor 64, stored pin 11, dial pin 14, guard 1),
   8 of them door rows and 14 dial pins: 131 by hand.
3. WHERE THE DIAL PINS GO: CLOSE-3 (3)(i) puts "the texts of darkness (step 1a)" in commit 1, and step 1a's table lists the
   dial pins; the recipe's 2b puts "DIAL PIN 14, step 1a's list" among the hand anchors (step 3) and calls commit 1
   "4 files". (Q1.)
4. Step 1a's table names `seatContest` (5) only; the census has three `seatContest` rows ((5) twice, (8) the craft
   variant) and two JOIN dial pins step 1a does not list (`fortuneMeritSentence` U5b (b), `fortuneLastingSentence` U7b (c)).
5. The `why` texts and arm 4 of both wiring files: moves THE FLIP ITSELF MAKES (the census reds no test for them: the
   `sed` leaves the why untouched); they are in the recipe, not in the census.
6. `bar5SafetyLawBand`'s in-test count: the recipe says 22 against 45; the census 21 against 45 (re-measured in the test).
7. The recipe's section 3 (registers) "not yet rehearsed lit"; the census's part 4 found no register red on the flipped
   tree: the only register moves are the ones the anchor commits make (the lighting census by titles; the mutation
   manifest if a file it lists moves).
8. The recipe's 5c expected diffs are from the rehearsal tree e987c3e36, before PRONOUN, VACANT and the Daily Life page:
   re-rendered on the flipped base.
9. The recipe has no step for E123's budget commit (Q2) and none for the stay-red rows (E112: Q4).
10. Expected but not moved (no fault; ticked as "not moved"): SEAT-10's list names files the census found green
    (`governanceAccount`, `r3c8ReaderLinesTrue`, `truceRowAndOneDominant`, `seatHolderOnThePage`, `powerSeatRender`'s seat
    half and others); FLIP-LIST-B's "509 dark and 511 lit" against E112's "508" (not the flip's).
11. The branch: `lane/flip-2026-11-22` in the recipe and CLOSE-3.txt is `lane/close-5-2026-11-23-flip` (N3).

## 4. QUESTIONS FOR THE CHAIR (each with this seat's lean)
- Q1. The 14 dial pins in commit 1 (lean: yes; they pin the dial, not a birth; commit 1 then needs no later commit to be
  read green on its own proof).
- Q2. E123's budget commit: first on the flip branch, BEFORE the dials, test only, each NEEDS-READ row read by hand
  (lean), or a separate unit.
- Q3. The two surprises: plant the fortune dial dark in their configs (lean) or re-seed.
- Q4. `defenceParts` R13 and `dualHatPoliticalMass`'s original arm stay red and are named for the red list (E112) (lean:
  yes; the original arm alternatively forces law 1 in its own config, which would make it green and keep its meaning).
- Q5. A file in two lanes (`powersReadTheRosterP31`) and the 2 SEAT+FORTUNE files: commit by file in the JOIN commit (lean),
  or by row.
- Q6. The two lit `why` texts: this seat drafts, the chair reads before they are built (`close-5/WHY-DRAFT.md`, owed
  before the word).
- Q7. 5c's `--emit` on the flip branch by this seat (CLOSE-3 (iv)) or the chair's own step (E55): lean, this seat's, with
  the narration shown to the owner.
- Q8. While waiting, a READ-ONLY TRIAL on a scratch ref (`lane/close-5-2026-11-23-lit-scratch`: the stack's tip once it is
  gated, lit by `close-2/census/light.sh`), running only the 84 anchor files and the files 106 to 109 changed, through the
  mutex: the re-pin values and any surprise known before the word. It touches no line of the flip's branch.

## 5. THE CHAIR'S RULINGS ON THIS PLAN (its message received 2026-11-23 04:08 UTC; recorded 2026-11-23 04:12 UTC, read from `date -u`). THEY GOVERN SECTIONS 1 TO 4 WHERE THEY DIFFER
"THE PLAN IS TAKEN." Where the recipe and the census differ, THE FINAL CENSUS GOVERNS (six goal-hash tiers; 153 rows in
83 files [CORRECTED by this seat: 84 distinct files, 85 lane-file pairs, `powersReadTheRosterP31` in SEAT and JOIN]; the in-test counts as re-measured).
- Q1 YES: the 14 dial pins in commit 1; the two "law 1" towns FORCE law 1 in their own configs.
- Q2 YES: E123's budgets are THE FIRST COMMIT ON THE FLIP BRANCH, before the dials, test only; each NEEDS-READ row read by
  hand; each budget carries its lit measure in a comment in point 105's manner; no assertion changes; `tests/lint` whole
  after. THE LIST: `close-5/BUDGETS.md` (14 tests in 13 files; section B names 12 with budgets of their own for the chair).
  So the commits are: 0 the budgets; 1 the dials and the texts of darkness; the doors; the hand anchors by lane; the twin;
  the sample town.
- Q3 YES: the two surprises FORCE THE FORTUNE LAW TO 1 IN THEIR OWN CONFIGS; `seatChainHolder`'s office-word guard READ
  GREEN and named in the commit. THE DIFF: `close-5/CONFIGS.diff` (against cb598376f: `seatChainHolder :: bear`, file-wide,
  the file meaning the seat law alone). FOUND WHILE PREPARING IT: `seatHolderLines.test.js` at cb598376f (VACANT's arms
  (10) and (11)) ALREADY MOCKS `fortuneLaw.js` on its own switch `sw.fortune`, off by default, so U6 (2) is born with
  fortune dark on the flipped tree: THE SURPRISE IS EXPECTED GONE on the base holding VACANT, with no diff (PLAUSIBLE, to be
  read by run at the Q8 trial; if it still reds, the config form of Q3 applies to its `born`).
- Q4 SPLIT: `defenceParts` R13 STAYS RED AND LISTED; `dualHatPoliticalMass`'s ORIGINAL arm FORCES LAW 1 in its own config,
  its title says so, green beside FORTUNE-C's lit arm (`close-5/CONFIGS.diff`). So FORTUNE's commit leaves ONE row red.
- Q5 BY FILE, in the JOIN commit; each row's lane and cause in the message.
- Q6 THE TWO TEXTS TAKEN WITH ONE CHANGE (made in `close-5/WHY-DRAFT.md`): "(the owner's word, "switch it on", at the
  close)" became "(the first deploy's finish line, which the owner left to the chair on 2026-11-22: both laws landed and
  lit; E30)". Arm 4's re-pin as proposed, WITH ITS TOOTH: outside the quoted history the text holds no "dark".
- Q7 THIS SEAT'S, AS ITS OWN COMMIT, on the flipped tree, by 5c; the emitted town's stock narration WHOLE and the diff's
  summary in `FOR-THE-OWNER.md`; the chair puts it to the owner before the flip lands.
- Q8 YES, ON THE COMMIT THE CHAIR NAMES (the stack's DOORS commit once 108 and 109 are merged: WAIT for its word): lit by
  `close-2/census/light.sh`; the 84 anchor files and the files 106 to 109 changed; one heavy run at a time; pushed as
  `lane/close-5-2026-11-23-lit-scratch`, merged by nobody; a red on neither the census nor the red list goes to the chair
  before anything is recorded.
