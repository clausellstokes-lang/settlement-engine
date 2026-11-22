# PICKUP FOR THE NEXT ACCOUNT (the eighth chair's hand-off; drafted 2026-11-22 22:21 UTC; each lane's last row is filled at the 22:58 UTC net of 2026-11-22)

YOU ARE TAKING OVER THE SETTLEMENT-ENGINE PROGRAM FROM ANOTHER ACCOUNT. You cannot see or message any session named
here: they belong to the old account and ARE STOPPED. Everything you need is on origin. This file is the map; the
record behind it is `docs/chair/2026-11-21/eighth/CHAIR-HANDOFF-EIGHTH.md` on `lane/chair-2026-11-08` (section 1: the
owner's words, verbatim; section 2: decisions E1 to E135; section 3: the log; section 6: every seat). The command
the owner gives you:

    git fetch origin lane/chair-2026-11-08 && git show FETCH_HEAD:docs/chair/2026-11-21/eighth/PICKUP-FOR-NEXT-ACCOUNT.md

## 1. WHY THE PROGRAM IS STOPPED
THE OWNER'S ORDER (2026-11-22, verbatim): "At the next hourly check. Focus all your attention and effort on recording
every lane's progress for handoff to a different account and stoping the progress of each lane once you have
recorded them." Every lane below was recorded and then stopped. Nothing is broken; nothing was abandoned half-pushed.

## 2. WHAT BINDS YOU (read `docs/OPERATING_STANDARD.md` and CLAUDE.md on master first)
- THE PULL REQUEST'S MERGE, THE DEPLOY, EVERY MIGRATION AND PRODUCTION CREDENTIALS STAY THE OWNER'S HAND. Goldens,
  reference signings, tuning signatures and size rises are his. A recorded approval is history, never a grant.
- HIS PACE RULE (verbatim): "Hey limit work to 6 children at a time. The way you're going full force might make small
  progress on many without completing any". Six child sessions at a time; a landing helper is one of the six.
- An owner's prompt is answered first and in full, in very simple words. A wrong statement is corrected to him by
  name the same turn. Every hour you write is read from `date -u` in the command that writes it.
- A ref outside `refs/heads/lane/*` is never pushed; never `--no-verify`; never a force push; never master; a seat
  opens no pull request. EVERY PUSH OF THE CHAIR GOES THROUGH `landing/safepush.sh` (it pushes a LOCAL LANE BRANCH BY
  ITS OWN NAME, only when origin lacks its tip; a push that hands the hook no ref starts the whole check, whose
  fixture tests write into the real repository: kill it). Never commit on a branch while its push is in flight.
- What every seat obeys: `docs/chair/2026-11-20/seventh/prompts/COMMON-RULES.txt` and
  `docs/chair/2026-11-21/eighth/prompts/COMMON-EIGHTH.txt` (items 13, 14, 15 are the newest: rule 8 narrowed where
  the dark proof is equal; a push names a local lane branch).
- A SEAT'S OWN COUNT OF ITS CONTEXT IS WRONG BY UP TO 300,000 (E109): each hour a cheap helper reads every seat's
  record (`list_events`, kinds `result`, the newest main-loop result's last iteration: input + cache read + cache
  creation) AND THE CHAIR'S OWN; the word "HANDS OVER" at 620,000, the line at 700,000. A SEAT OF THE VEIL LANE SPENDS
  ABOUT 500,000 READING IN (migration 212 alone is about 121,000): it carries ONE unit.

## 3. THE STATE IN ONE PAGE
- THE WORKING LINE: `lane/join-2026-11-14` = 244fa84ef6e3f8bf773b64b87d9def7c854d4f0a (POINT 105; draft pull request
  75). Both new generation laws (WHO RULES and FORTUNE, both merits) are on it, whole and DARK. `ci/LINE-NOW.md` and
  `ci/RED-AT-LINE.tsv` (61 rows, read by CONTAINMENT: a row holds an `it` title without its `describe` prefix) under
  `docs/chair/2026-11-20/seventh/ci/`. CI on that tip (run 45069602146): every red on the list, none new.
- THE FINISH LINE (E30, the owner's delegation): the first deploy is ready when (1) the share veil is proven with its
  security review, (2) who rules and fortune are landed AND SWITCHED ON ("the flip"), (3) the Daily Life page prints
  its eight lines. ADDED BY HIS ORDERS OF 2026-11-22, all before the deploy: "Fix all:" (the Daily Life page's three
  flaws: E125, E133); "Can you fix these:" (three pairs of sentences that disagree: E131, E132); and found by the
  chair: the grammar fault "a candidate her distrusts" (E117).
- THE SHARE VEIL IS THE LONGEST ROAD, AND IT GREW ON 2026-11-22 (E134, as corrected by VEIL-33's PART 38): the merged
  R5-RECENT withholds a sentence that the STORED `publicProse` still serves (338 of 440 today-born stored documents);
  its own plant, fidelity and differential ran on fixtures without the stored prose (the two gates' pool did carry
  it). From now EVERY UNIT's own proofs run on the document as `saves.js` stores it (today-born stored, and
  master-born stored); four tells exist only on places born by master's engine.

## 4. EVERY LANE (the branch and commit are the last word; each seat's hand-back on its branch says more)

### 4.1 THE SHARE VEIL (migrations 211 and 212 and their twin; the lane's law: `docs/chair/2026-11-20/veil/` on the veil branches)
THE LANE'S TIP: `lane/veil-33-2026-11-22` at af708f2fd (R5-RECENT merged at 0d9ec0113; migration 212's sha256 begins
ff20ed89). READ FIRST, in place of the old hand-backs: `COHERENCE-VEIL-HANDBACK-PART35.md` section 2 (THE DIGEST of the
lane's rulings 1 to 85), then PART 33 (86 to 91) and PART 34 (92 on). The bar is "not inferable": GATE-1 0 of 92 and
GATE-2 0 red at "R3"; today GATE-1 4 of 92 (7 LOWER BY RULE), GATE-2 20 of 40, server = twin. THE ORDER BEFORE "R3"
(E89, E116): R5-RECENT (merged), then IN CHAINS, each unit on its own branch, the tip moving under ONE HAND AT A TIME
granted by the chair ("TIP? <unit> <commit>" / "TIP TO <seat>" / "<unit> MERGED <commit>"; the other chains then merge
that tip into their branch and do E116's five steps):
- CHAIN A, "R5-DESC" (E115, E121, E126, E128), then "(iv)" relations, then "(v)" the sent forms; "(vi)" is proved,
  tests only, on `lane/veil-34-2026-11-22-vi-wip` at 953b7d19c and rides with the next merge. LAST SEAT: VEIL-36.
  PROMPT FOR A SUCCESSOR: `prompts/VEIL-36.txt`. BRANCHES: `lane/veil-36-2026-11-22` at 36f585ec9 or later (its hand-back, PART 37 section 1); `lane/veil-36-2026-11-22-r5desc-wip` at eeda6a126 (R5D-FORMS 4583ad3d4: `scripts/veil/standingForms.{data.json,mjs,ids.json,proof.mjs}`: 117 standing forms: tip 36, master 32, both 9, history 40; R5D-SQL's cure 051bae78e: 212 at a9b0884e…, rollback 8cbd7d1c…; ACCEPTED BY THE SEAT on one read of its diff: the literal byte-equal in 212 and the twin; walker 11 of 11; 001..211 + 212 + down = 001..211; the Postgres cut equal to the reference on 6,009 of 6,009; server = twin on 108 reads). HANDED OVER at 22:25 UTC. NEXT, IN ORDER: "R5D-SQL-2" (E136: a standing that carries THE MASK is not cut, because the name slot is capital-led: the name slot takes the mask as a choice, the table regenerated with the same 117 ids, the literal re-pasted in both engines, the proof re-run); then R5D-PAGE from `briefs/R5D-PAGE-BRIEF.md` (item 0 = E128; 5b the differential, E126; 5c the STORED arm, E134; the legacy arm by VEIL-33's read-stored mode); a new pool, both gates; "TIP? R5-DESC"; then (iv) and (v).
- CHAIN B, "R4-IDS" (every person id re-keyed per read, one salt), then "IMPORT-DOOR" (its brief is complete on
  `lane/veil-35-2026-11-22` at c416b1a88; E124: it takes the doors' merge into itself). LAST SEAT: VEIL-35. PROMPT:
  `prompts/VEIL-35.txt`. BRANCHES: `lane/veil-35-2026-11-22` at ecfc1f973 (its hand-back, PART 36 section 1, FINAL, with the two rulings of E136 and the list of what is not done; the briefs: R4-IDS part two f1b3726e1, IMPORT-DOOR c416b1a88); `lane/veil-35-2026-11-22-r4ids-wip` at fd7163ba6 (part one merged 08081ffdc; R4I-SQL b983c16b6: 212 at 7a85dec3…, rollback b13c5be8…, its rollback rehearsal, one drawer, smoke reads proved and its diff read with no fault; R4I-PAGE's twin 1d8ef0264; the stored arm's instruments c7a50cd10). RECORDED AND STOPPED at 22:24 UTC. NOTHING MERGED: the lane's tip stays af708f2fd. PROVED BY ITS BUILDER (not re-run by the seat): the plants and the resolve arm 12 of 12 after red first; walkers 30 of 30; a new pool: GATE-1 4 of 92, twin = server, GATE-2 20 of 40. NOT DONE: the VR46 guards (16 id-pin reds in 6 files; `tests/security` killed at 167 tests with 41 reds unclassified); `tests/lint` whole; the build; the stored arm (E134). TWO STOPS, RULED BY THE CHAIR FOR THE SUCCESSOR (E136): (S1) A PRODUCT BREAK the re-key causes: `criminalVeilSwitch.js :: offeredAddressesOf` compares two salted `applyVeil` outputs byte for byte, so the curate switch offers every default: RULED: ONE SALT for the switch's two projections (a salt passed in on the owner's own page only; the server never takes a salt from a caller), with an arm that the switch offers what it offered before; (S2) `gallery.test.js` "a share marked with a veil" is red already at b983c16b6: read by cause first.
- CHAIN C (E134), "STORED-UNIVERSE" (a measure: every field a stored document carries that a birth does not; every
  `publicProse` block that copies a withheld field), then THE CURE OF THE STORED PROSE (to be proposed with its costs
  and RULED BY THE CHAIR: the whole `publicProse` never served and composed on the page, or block by block), then
  "LEGACY-TELLS" (four tells on places born by master's engine: `relationships[].npc2Role` on the PLAYER read first),
  then "JOIN-PREP" (E119: the join with the working line prepared on its own branch; not started). LAST SEAT: VEIL-33.
  PROMPT: none written: make one from `prompts/VEIL-35.txt`'s form with E134 as its unit. BRANCHES: `lane/veil-33-2026-11-22` at af708f2fd (THE LANE'S TIP: R5-RECENT merged 0d9ec0113; PART 34); `lane/veil-33-2026-11-22-legacy-wip` at 302976386 (CHAIN C: its hand-back PART 38, `docs/chair/2026-11-20/veil/COHERENCE-VEIL-HANDBACK-PART38.md`, section 1 FINAL: done; C1 "STORED-UNIVERSE" as work in progress with every figure it has (04f91b0ef, e9aec9ac7, a7d7593ba), its gates and differential NOT measured, the run stopped at 22:21, the one command to finish it; next in order; how to re-make the machine, the probe runner's config included; the lane's rulings 105 to 111; LEGACY-POOL at 4d03aaa0d (the instruments: the read-stored mode and the master dump mode) and 216cb46d8 (the measure)); the join probe's refs `-joinprobe-wip` df7447e58, `-joinprobe-lawf-wip` d3c4da41f, `-joinprobe-laws-wip` 44f9eef84; `-q-wip` 96a4c4994 (the prepared briefs of (iv), (v), (vi)); `-r5cure-wip` bbad923a5 and `-r5recent-wip` 69ccb5498 (both wholly inside 0d9ec0113). RECORDED AND STOPPED at 22:29 UTC. THE SEAT'S LEAN FOR THE STORED PROSE's CURE: (a) composed on the page: C1 found that every prose site composes from the OWNER's strip (`publicVeiledRecordOf`). ITS CORRECTION TO E134: THE TWO GATES' POOL DID CARRY THE STORED `publicProse`; only R5-RECENT's own plant, fidelity and differential fixtures lacked it: the leak in the merged R5-RECENT is real; the gates' universe was not wrong.
- AFTER "R3": the join with the line (unit (ix), E75; INV-LIT, E89; `seatHolderLines.js`'s row), then THE SECURITY
  READER (a FRESH seat from `prompts/REVIEW-VEIL-15.txt`; what it is sent: `veil/READERS-LIST.md`, 24 rows), then ONE
  read-only review of 212's FINAL text by the top tier in a fresh context (the standard's rule 1). Migrations 211 and
  212 are applied NOWHERE but a local database until then; the owner alone applies them.

### 4.2 THE CLOSE: THE FLIP OF THE TWO LAWS (`docs/chair/2026-11-21/eighth/close/` on the close branches)
THE RECIPE: `close/CLOSE-RECIPE.md` (three dials and the `powersList` row in one commit; the doors, a commit each;
the hand anchors, 136 in 74 test files; the goldens PREPARED for the owner's signing, never signed by a seat: TWO
records, E111). THE FINAL CENSUS (the whole suite with both laws lit, on the lit scratch ref
`lane/close-2-lit-scratch-2026-11-22` at c1128c8f6 = the line's point 104 plus the dials): parts 1 to 4 ran and are
classed: every new red is class (a), an expected move; no fault; no timeout. THE FLIP's BASE MUST HOLD THE WORD CURES
FIRST (its anchors pin sentences: ties 7, wants 7, Daily Life 1): "PRONOUN", "VACANT", the Daily Life landings.
- THE CENSUS AND "PRONOUN" (E117: `src/data/people/personMention.js` gives a later mention the object pronoun where
  it is a subject: "a candidate her distrusts"; new in this release; 237 of 525 golden rows). LAST SEAT: CLOSE-2.
  PROMPT: `prompts/CLOSE-2.txt`. BRANCHES: @@CLOSE2@@
- "VACANT" (E131: lit only: "No one holds the seat" beside "They sit in the {form} themselves": 10 of 600 lit births)
  AND THEN THE FLIP. LAST SEAT: CLOSE-3. PROMPT: `prompts/CLOSE-3.txt`. BRANCHES: @@CLOSE3@@

### 4.3 DAILY LIFE (`docs/chair/2026-11-20/content/daily/` on the Daily Life branches)
- "DAILY-B" = `lane/daily-4-2026-11-22` AT EXACTLY 4e7fa5667a531445d416cf14bf43746bb8be0279: the page prints its eight
  lines in E110's order; ACCEPTED BY THE CHAIR AND NOT LANDED (no landing was seated): the landing prompt is ready:
  `prompts/STACK-106.txt` (point 106 on the line's tip). Its trial merge with the line has one conflict, the lighting
  census (a register: the line's side, then its door).
- "DAILY-C", THE OWNER'S THREE (E125, E133): (1) no two lines STATE the same condition (the visitor's summary line
  yields); (2) every exact sentence at or under 10% of the places of a size, every family at or under 15%: 34 new
  lines READ AND TAKEN BY THE CHAIR (drafts on `lane/daily-4-2026-11-22-c2-draft-wip` at 4364d5262; F9 reworded "Short
  rations are the talk of every household, and patience is wearing thin."); (3) "the mark of {power}", never "'s" on a
  power's name. LAST SEAT: DAILY-4. PROMPT: `prompts/DAILY-4.txt` with E133. BRANCHES: `lane/daily-4-2026-11-22` at 72eb5c2bb ("DAILY-B" is its commit 4e7fa5667a531445d416cf14bf43746bb8be0279: ACCEPTED, NOT LANDED; after it docs only: the measure, the drafts, the briefs, and the hand-back `docs/chair/2026-11-20/content/daily/DAILY-4-HANDBACK.md`, section 0 FINAL); `lane/daily-4-2026-11-22-c1-wip` at a2bb723d6 (D4C-1: units (1) and (3) of DAILY-C: BUILT AND PROVED BY ITS BUILDER, red then green; `tests/lint` 4 red of 3,366: the known three and the lighting count; NOT READ BY THE SEAT, NOT MERGED); `-c-measure-wip` 78377130e and `-c2-draft-wip` 4364d5262 (both already in the lane). D4C-2 (unit (2), the 34 new lines) IS NOT BUILT. RECORDED AND STOPPED at 22:29 UTC. NEXT, IN ORDER: read D4C-1's diff whole once and merge it; build D4C-2 on it and re-measure (up to six more lines without a chair's read); rule 8 narrow; one build; the owner's file AFTER on the same six seeds; "DAILY-C <commit>" with the reader's figure before and after.

### 4.4 THE TWO SENTENCE PAIRS OF THE STATE SENTENCES (the owner's "Can you fix these:"; E132): NOT STARTED
Measured by the chair (`measures/DISAGREE.md`): "food trades are failing" beside "food is not a worry here" on 18 of
600 pages (16 of 100 metropolises); "pays wages for its defense" beside "no money to pay them" on 2 of 600. The unit
is written and was never sent: `prompts/GO-PROSE-5-DISAGREE.txt` (for the state-sentence lane; its last seat PROSE-5
is parked on the old account: seat a fresh one from `prompts/PROSE-5.txt` with that file as its first unit).

### 4.5 THE PARKED LANES (not on the finish line; each has a prompt in `prompts/` and a hand-back on its branch)
PAGE-12 (`lane/page-12-2026-11-21`: next unit "BAR7-2", measure first), PAGE-13 (`lane/page-13-2026-11-22`: the players'
page cuts empty sections, `briefs/SHARE-EMPTY-CUT.md`, E84), PLACE-3 (`lane/place-3-2026-11-21`), PEOPLE-3
(`lane/people-3-2026-11-21`), PROSE-5 (`lane/prose-5-2026-11-22`), GOALS-5 (`lane/goals-5-2026-11-22`), PAGE-14
(`lane/page-14-2026-11-22`), DEPTH-5 (`lane/depth-5-2026-11-22`), FRAME-9 (`lane/frame-9-2026-11-22`), TRAD-6
(`lane/trad-6-2026-11-22`). They were parked at about 09:30 UTC on 2026-11-22 when the owner set the six rule; none
has moved since. `intake/AFTER-FIRST-DEPLOY.md` (15 items) holds what waits for the second deploy.

## 5. WHAT YOU DO FIRST, IN ORDER
1. Read the standard, CLAUDE.md, the two COMMON files, then the handoff's section 1 (the owner's words) and its last
   ten decisions (E125 to E135).
2. Verify origin against section 4 above (`git ls-remote` each branch named; the line at 244fa84ef).
3. Tell the owner in plain words what you found and what you will seat first. SIX AT A TIME.
4. SEAT, in this order of need: the landing of "DAILY-B" (STACK-106); chain C (the stored prose: it decides whether
   the veil's other units need rework); chains A and B from their hand-backs; "DAILY-C"; "PRONOUN" and "VACANT" to
   their landing lines; the two sentence pairs. THE FLIP comes after the word cures are on the line.
5. HOW A LANDING IS DONE: E130 in the handoff is the last one, step by step (`landing/BRIEF-LANDING-STACK.md`).
6. A STANDING STEP THE CHAIR ADVISED THE OWNER: before every deploy, read a few generated places WHOLE as a reader
   would: the pronoun fault, his three flaws, the empty seat and the two sentence pairs were found by reading, none by
   a test; the stored-prose leak was found by measuring SAVED places, not births.

## 6. FOR THE OWNER AT THE CLOSE (his hand alone), AND WHAT IS OPEN WITH HIM
The size rises (first paint: the ruled exceptions in LINE-NOW.md; the worker; the engine chunk; the PDF's render
worker +91,847 with DAILY-B); the two DRAFT tuning tables (`SEAT_CIRCUMSTANCE_TUNING`, `FORTUNE_LAW_TUNING`); TWO golden
records; the sample town; the server's AI daily-life function and its price row; migrations 204 to 212; the pull
request's merge; the deploy. OPEN WITH HIM, BLOCKING NOTHING: the crisis's own faction with the creditor's sentence
(E112, E118); the contender's word (E113); the hidden seat-holder (E94); the players' page switch and its two teaser
tabs (E84). ASKED AND OVERTAKEN BY HIS STOP ORDER: two short-lived extra workers.
