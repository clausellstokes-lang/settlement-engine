# THE SHARE VEIL IS PAUSED (2026-11-23): THE HAND-OFF

Written by the ninth chair (session_01FbPLbdpQrxXktCeSf32d4j) on the owner's order. This file is the one place to start
for whoever takes the share veil up again, on any account. It is an index with the state of every piece; the detail is
in each seat's PAUSE BLOCK (the top of its hand-back's first section) and in the chair's record,
`docs/chair/2026-11-23/ninth/CHAIR-HANDOFF-NINTH.md` (entries N1 to N116, newest last). Every hour here was read from a
clock when written. Section 2's "PAUSED" commits are filled in as each seat's line arrives; a line that still reads
"awaited" was not yet in when this file was last pushed.

## 0. The order

The owner, to the ninth chair, on 2026-11-23 at about 16:11 UTC, verbatim: "Pause and record the progress to the veil
work for handoff. Focus all your remaining effort on the close lane".

Done at 16:12 UTC: every seat of the veil was told to stop at a safe point, push everything, write a pause block and
send one line "<SEAT> PAUSED <documents commit>". Two runs in flight were let finish, because hours of each were
already spent and nothing follows them: chain C's whole proof of "STORED-PROSE" (started 12:58:03 UTC, five to six
hours) and the join's whole-page comparison "PAGES" (ends about 16:45 UTC). Nothing was merged. No seventh seat was
created. The owner may still say "stop them now".

NOTHING OF THE VEIL IS IN THE WORKING LINE (`lane/join-2026-11-14` at 9b0ffaa97) AND NOTHING OF IT IS DEPLOYED.
Migrations 211 and 212 are applied nowhere but local test databases. The veil is not live: no finding below exposes
anything today.

## 1. Where the veil stands, in plain words

The share veil decides what a shared page (the gallery page, the party link, an import, a shared map) may show of a
town when its maker hides something: the page must read as if the hidden thing was never there, and the server must
send exactly what the page copy (the "twin") would.

- THE LANE'S TIP: `lane/veil-41-2026-11-23-tip` at b58abc48b73f8f832a985b5863c68f87a8d7c7c9 ("PIN-3 MERGED", N89). It is
  one test file ahead of 23bb8b8ae (PIN-2). 212, the twin and the registry are byte-equal at both.
- THE BAR "R3" (N88) IS NOT MET: GATE-1 reads 4 of 92 (7 more LOWER BY RULE), GATE-2 reads 20 red cells. It must read:
  GATE-1 0 of 92 beside its listed towns; GATE-2 0 red cells over the towns not listed by rule; the eight listed towns
  read apart, by name, every difference with its rule.
- SIX PIECES WERE IN WORK. NONE HAS MERGED INTO THE TIP SINCE PIN-3. In the order they would merge:
  1. "STORED-PROSE" (chain C): built; its whole proof was let run to its end; then a chair reads its diff.
  2. "R4-IDS" (chain B): the person-id re-key; its last SQL piece was being built.
  3. "IMPORT-DOOR" (the doors, with the shared-map hole "MAP-COVERT"): prepared; it merges after R4-IDS.
  4. "R5-DESC" (chain A): the rival's cure is proven; the standing reader's cure and the unit's proof are open.
  5. "R3-TELL-5" (chain A's second seat, never seated): the first gate's last cures; nothing has run.
  6. "LEGACY-TELLS" with "R5-TENSION" (chain C's next unit): measured, not built.
  Then THE JOIN of the tip with the working line (prepared: five red test files, causes not yet found), the bar's one
  proof of the whole, the security reader (`docs/chair/2026-11-21/eighth/veil/READERS-LIST.md`, 37 rows; the reader's
  draft start message `prompts/DRAFT-START-REVIEW-VEIL-16.txt`), one top-tier read of 212's final text, and then the
  owner's own hands: migrations 204 to 212, the merge, the deploy.
- THE CHAIR'S HONEST ESTIMATE at the pause, said as a guess: more than a day of machine time with six seats, likely two.
  The longest road is chain A: on one machine an arm run on the full pools costs hours (N111).

## 2. The pieces

Each seat's session may still take a message after the pause (a fresh container is given to it; ITS MACHINE IS GONE and
is re-made by the recipe in its pause block). A seat whose context has passed about 570,000 is not woken to work: its
successor is seated with the start message named below.

### 2.1 Chain A, "R5-DESC" (VEIL-40, then VEIL-48)
- VEIL-40 (session_01FbPLbfZtJ6FDJfq3MCUbon) HANDED OVER AND STOPPED: `lane/veil-40-2026-11-23` at a3bc0dc9d. Its
  packet is `docs/chair/2026-11-20/veil/COHERENCE-VEIL-HANDBACK-PART42.md`, section 1, block 0 ("VEIL-40 HANDS OVER").
- VEIL-48 (session_01FbPLbbhLQxTNjSrMJPCXX2) was seated at 16:09:51 UTC; the pause order reached it at 16:29 (its
  first line and one surprise crossed it). PAUSED AT 9e5697d40 (`lane/veil-48-2026-11-23`; every run stopped at
  16:30:34 UTC; no builder was ever started). ITS PAUSE BLOCK IS PART 47, SECTION 1, BLOCK 0. Its start message
  `prompts/START-VEIL-48.txt` (on this lane) IS THE PACKET FOR A RESUME.
- WHAT VEIL-48 FOUND IN ITS TWENTY MINUTES: (a) the rival and PIN-3 merge into the code branch plainly, with no
  conflict; those two merges stand ONLY IN ITS CONTAINER and are re-made by two plain merges; (b) THE PRE-PUSH HOOK
  REFUSES THE MERGED CODE BRANCH: `src/domain/veil/pageRederive.js`: 1 strict typecheck error against a baseline of 0
  (TS2345 at :283: `annotateFactionStanding` is called with a `seat` argument the callee's signature types as null);
  the same reads on 0544c77ad; it was not bypassed and not cured. Two cures were named (a JSDoc on `seat` in
  `factionStanding.js`; a typed annotation at the call). The flip's commit 3b5a37a23 already gives that writer a JSDoc
  that types `seat`, so the error leaves at the join with the working line; whether it is cured on the lane before then
  is the next chair's ruling. NOT EXPLAINED: how the earlier pushes of that code passed the same hook. (c) Its
  instruments' tally on a fresh machine: 79 EQUAL, 13 LOWER.
- CODE, all on origin, none merged into another: `lane/veil-40-2026-11-23-r5desc-wip` aa54a6791 (the code branch);
  `-r5rival-wip` 61a99a90d (the rival's cure); `-sskip-wip` 0544c77ad (instruments only, nothing in `src/`).
- PROVEN: THE RIVAL LEAVES WITH ITS HOST (N63): red on the full pools 2,736 of 2,736 hiding rival-reads served beside
  the withheld host; green 0 lone of 14,528; server = twin 0 misses; never-there base diff 0; its diff read whole by
  VEIL-40 without fault (N112).
- FOUND BY VEIL-48 IN ITS FIRST MINUTES: three scripts PART 42 names lived only in VEIL-40's `/var/tmp`
  (`rivalgates-run.sh`, `push.sh`, `mutex-order.txt`): they are re-written from the committed chain scripts; the stored
  pools (today-born and master-born, 440 each) died with VEIL-40's machine and are re-made by the tests builder's
  `b2.sh` dump.
- OPEN, IN ORDER: the standing reader's deciding count (never started) and its cure (the page's reader skips the seven
  rival texts: N95, N101, N102), red first on a slice; the rival's chains, arms on slices, after, cost; the merges with
  PIN-3; the tests builder's owed re-runs and its third part; the unit's ONE proof on the stacked tree (a new pool and
  both gates, NOT WORSE than 4 of 92 and 20; every arm on the full pools in one hold; the whole-document form at the
  gallery and the link; the two name seeds of N104; the two mask documents); then "TIP? R5-DESC".
- RULINGS THAT BIND IT: N63, N90, N94, N95, N101, N102, N104, N106, N111 (the slice rule), N112.

### 2.2 Chain A's second seat, "R3-TELL-5" units (iv), (v), (vi) (VEIL-49: NEVER SEATED)
- Nothing measured, nothing cured. The instruments, the (v)(1) arm and the (vi) teeth are written and were never run:
  `lane/veil-40-2026-11-23-t5-wip` at b096065e5 (`out/v40/t5/T5-HANDBACK.md`, `T5M-HANDBACK.md`).
- ITS START MESSAGE is made by one command from `prompts/DRAFT-START-VEIL-49.txt`:
  `python3 -I docs/chair/2026-11-23/ninth/tools/fill49.py <HH:MM> <date> <VEIL-40's documents commit> "<tip branch at
  commit>" <repo root>` (committed on this lane; it fills every blank from PART 42's block 0: the machine's recipe for
  T5 alone, the rival's base 61a99a90d, its hand-back PART 48).
- IT IS ON THE BAR'S ROAD: GATE-1 reaches 0 only with its cures. It merges AFTER R5-DESC, with a proof of its own.
- RULINGS THAT BIND IT: N86, N88, N102 (2) (the measures come first as counts; (v)(2)'s sent crime wave withdrawn where
  the crime signal is false; (v)(3) made joint; `bnAt`), N106, N111.

### 2.3 Chain B, "R4-IDS" (VEIL-42, session_01FbPLbd4KVbm2owKo72ukoY)
- PAUSED AT 47f8d31fe (`lane/veil-42-2026-11-23`; its line queued 16:31:38 UTC). ITS PAUSE BLOCK IS PART 44, SECTION 1,
  BLOCK (0): the branches, what is proven with each receipt, what is open in five items to "TIP? R4-IDS", the machine.
- CODE: `-r4ids-wip` ab05aa487 (the unit, with the tip and PIN-3 merged and "TONIGHT-2" merged, re-run by the seat: red 2
  of 5, green 22 of 22); `-tonight-wip` 57e847ce8 (merged); `-meas-wip` d71a3ee44 (THE WHOLE-DOCUMENT INSTRUMENT
  `out/v42/meas/`, frozen at 5130df7df, used by every unit: N90; `RECIPES.md` beside it); `-sql2-wip` 040a405e0 (THE
  SQL BUILDER'S UNIT, STOPPED BY THE PAUSE, "WIP, UNPROVED", NOT merged into the -wip: 212 edited in `_gallery_veil_rekey`
  and, for N106, in the two guard lines of `_gallery_veil_roster_choices`; BY THE BUILDER'S OWN RUNS, not re-run and not
  read by the seat: the two guards red 352 to 0 on master-born and 33 to 0 on the control, the plant, no today-born read
  moved (6,720 of 6,720), the lint pin `tests/lint/veilTypeofGuard.walker.test.js` red on both old lines then green).
- FOUND BY ITS INSTRUMENT ON REAL MASTER-BORN DOCUMENTS (N106; the reader's row 36): a guard of 212 that passes on an
  absent key writes shares the stored list never had (352 of 3,360 reads). THE CURE IS GRANTED TO THIS UNIT: two lines
  (`is distinct from 'number'` at the tip's :2295 and :2326), red first, a plant, a lint pin. Chain A takes the two
  lines at its merge.
- OWNER-FACING: the id unit changes the wording of one "tonight" line on the owner's own page in 2 of 1,808 test towns.
- OPEN, IN ORDER: the SQL builder's unit with the two guard lines; the seat's proof; "TIP? R4-IDS"; then the chair tells
  the doors' seat "R4-IDS MERGED <commit> on <branch>".
- RULINGS THAT BIND IT: N77, N84, N90, N106, N107 (two `tests/copy` reds are the tip's, not its).

### 2.4 The doors, "IMPORT-DOOR" with "MAP-COVERT" (VEIL-44, session_01FbPLbf229d4Ks1UJSnj8vb)
- PAUSED AT 25cb48fde (`lane/veil-44-2026-11-23`; its line queued 16:22:35 UTC). ITS PAUSE BLOCK IS PART 46, SECTION 0:
  the branches, what is proven with each receipt, what is open in order to "TIP? IMPORT-DOOR", the machine.
- CODE: `-door-wip` db9fddc7d (the tip with the shared map's red and "the import equals the read": TESTS ONLY, 212
  untouched); `-mapcovert-wip` 6edc79094 and `-trad4-wip` c2afc9878 (both merged into it); `-mcsql-wip` d56bc1ab6 (THE
  NARROW GREEN, STOPPED BY THE PAUSE: 212 and its rollback EDITED AS "WIP, UNPROVED": `get_gallery_map` restated as the
  link's read; the rollback rehearsed equal; NONE of its proofs ran; its hand-back `out/v44/mcsql/MCSQL-HANDBACK.md` is
  read first; nothing of it merged).
- PROVEN: THE SHARED-MAP HOLE HAS ITS RED FIRST (a shared map's member and the map's import serve a covert tie's copy
  at Reveal off: the member 24 sends, the import 24); "the import equals the gallery read" 0 of 840 shares, with a
  tooth; doors-3's arms 51 of 51; the census of 63 definer functions.
- OPEN, IN ORDER: the narrow green of the map member (`get_gallery_map` restated in 212 as 211's statement plus the
  member's overrides in the link's form: N95); the world snapshots' measure; the two front-page lists (N85; the
  reader's row 33); the speed measure and arm (N115: a read's cost grows with the number of public rows, on master
  too); the single restatement at the doors' merge AFTER R4-IDS; the door-equality arm; "TIP? IMPORT-DOOR".
- NAMED TO THE OWNER, NOT CHANGED: the map import's paid gate (072: no premium check on the server).
- RULINGS THAT BIND IT: N76, N77, N84, N85, N90, N95, N115. Successor's draft: `prompts/DRAFT-START-VEIL-47.txt`.

### 2.5 Chain C, "STORED-PROSE", then "LEGACY-TELLS" with "R5-TENSION" (VEIL-41, session_01FbPLbd3QgeKoNgJK2yVomF)
- PAUSED: awaited (after its proof's end). Documents `lane/veil-41-2026-11-23` (fd384b5d6 before the pause); hand-back
  PART 43.
- CODE: `-c2-wip` ced3b1de7 (the unit: no `publicProse` is served on any shared read in the first deploy; the pins;
  PIN-3); `-tension-wip` e7d48edf4 before the pause (R5-TENSION: measured, the party-list half in work).
- THE PROOF (started 12:58:03 UTC on ced3b1de7): the per-read hashes; the prose check; the whole-document form on the
  140 at two doors and on both stored sets; the read-stored gates on the tip and on the unit; the 55-file set; the
  rollback and the catalogue; `tests/lint` and `tests/copy` whole; typecheck, eslint, one build. ITS RESULT, STEP BY
  STEP, IS IN THE SEAT'S PAUSE BLOCK.
- BEFORE ANY "TIP? STORED-PROSE": A CHAIR READS THE UNIT'S DIFF (the 212 hunk, the twin, the registry rows, the pins),
  with "table A" and "line B" from the seat's `PINS-REPORT.md` (N96 (d)). No one has read that diff as chair yet.
- THEN "LEGACY-TELLS" with "R5-TENSION" (the mask word "an unseen interest" in a tension's party list: 2 of 1,948
  documents; the four tells a master-born place can carry: the reader's row 24): `prompts/DRAFT-START-VEIL-45.txt`.
- RULINGS THAT BIND IT: N49, N85, N90, N96, N99.

### 2.6 The join of the tip with the working line (VEIL-43, session_01FbPLbe3RSwLtDXde5aCrSm)
- PAUSED: awaited (after PAGES' end). Documents `lane/veil-43-2026-11-23` (9792b3869 before the pause); hand-back
  PART 45. The trial join: `-join-wip` 9e6547f0f (the lane's tip with the line 9b0ffaa97).
- DONE: "GATES" (the join moves no birth and neither gate: N81); "SITES"; "GATE-MAP" and "LOWER-7" (N88); "REDS"
  whole: THE JOIN'S NEW REDS ARE FIVE FILES (`fortuneLawMerits` U5a (S), `fortuneLastingSentence` U7b (d),
  `tensionCause` CAUSES-PARITY-2 F, `traditionDescriptionSharedPage` TRAD-2 UNIT 2, `recentConflictReaders.walker`:
  `transferTakerOf`); "NAMES" complete: ONE path names a withheld power on the tip as it stands, a shown power's
  standing sentence on 2 of 95 places, and chain A's unit is its cure (N104, N105); "PAGES" (the whole rendered page
  compared): its tables are in the seat's pause block; its first finding is read by the chair as the lane's own rule
  VR31 and was being confirmed (N109).
- OPEN, IN ORDER: `tests/copy` whole (N107: two reds of the tip are code patterns in string literals); "REDS-CAUSE" (the
  cause of each of the five; THE CHAIR RULES EACH CURE: its lean for the paragraph on who governs: fail closed on a
  veiled read, or a re-deriver in `rederiveForPage`); the gates' listed-apart mode (N88 (e)); "VR42-NOTICE" (its words
  are the chair's to rule); "GUARD-PIN"; then the build of unit (2), the lit unit with "13G x S" (N108; the reader's
  row 37), and the bar's proof. Successor's draft: `prompts/DRAFT-START-VEIL-46.txt` (rulings (a) to (l)).
- RULINGS THAT BIND IT: N81, N87 to N91, N103 to N105, N107 to N110.

## 3. The chair's rulings a resume is bound by (the record holds each with its reasons)

N63 the rival leaves with its host. N77, N84 the doors are held to one read; the map member is the party link's read.
N85 the front-page lists fold into the frozen rule; R5-TENSION. N86 T5's units. N88 THE BAR RE-STATED; the eight listed
towns; the list a ratchet; VR42-NOTICE. N90 THE WHOLE-DOCUMENT FORM (chain B's instrument, copied, never re-written;
the pool-wide run once, at the bar). N91 PAGES. N92 a push with nothing to send starts the whole check: guard every
push. N94, N95, N101, N102 THE STANDING A SHARED PAGE PRINTS (the table's own sentence for the served roster, on every
read of every document; on a master-born document the difference from the owner's page is listed by class; no new
served fact). N96 the mask word's two paths. N99 a hand-over only at a step's end. N103 PAGES' split; the chips' order
is jsonb's. N104, N105 NAMES. N106 a guard that passes on an absent key. N107 two copy reds. N108 "13G x S": a public
read prints the two war notes, a Reveal DM read omits them. N109 the class VR31. N111 NO ARM RUNS ITS RED AND GREEN ON
THE FULL POOLS; T5 a seat of its own. N112 VEIL-40's hand-over. N115 the speed of a read. N116 this pause.

## 4. Open with the owner (the veil's; none blocks the close lane)

0. THE WORKING LINE IS NOT TO BE RELEASED TO USERS BEFORE THE VEIL'S HIDING IS IN IT. SAID TO HIM AT THE PAUSE (N117),
   with the chair's recommendation: land the flip on the working line (that is not a release); no merge or deploy to
   users until the veil is resumed and finished; a smaller safe subset can be scoped if he asks. THE CHAIR'S OWN PROBE on
   the line at 9b0ffaa97 (`docs/chair/2026-11-23/ninth/tools/covertcopy.probe.js.txt` (rename it to `.test.js` in a scratch directory to run it with vitest) and its output beside it; 180
   births): in 10 of 180 the page's "prominent relationship" is a COVERT tie and the public projection serves that copy
   (both names, type, text) while the tie itself is dropped from the served list. The cause, read in code:
   `genRelNarrative` scores every tie and returns a copy without the flag; the key is on every public allowlist (206,
   207, 210; `publicSafe.js` :65); the line holds no covert case for it. On the veil lane 211 hides it at three doors
   and the doors unit at the map. Production today holds no such tie (0 of 140 master-born). It is ONE verified case;
   the reader's list holds the others (the stored prose, the standing sentences, the ids, the rival, the doors).
1. PAGES PUBLISHED BEFORE THE VEIL: put to him with the chair's recommendation (the gallery page as today with the
   covert copy no longer served; the party link and the map member under the default veil); the counts given (7 of 140
   today-born test towns hold a covert tie; 0 of 140 master-born). NOT ANSWERED. It is asked again before any deploy
   of the veil.
2. OLD TOWNS' STANDING SENTENCES (N102): a shared page words them by today's rules; his own page keeps the stored
   words; they differ on 2,776 of 3,744 door-rows of the old test towns. Told to him; he may overrule. His later
   choice: his own page reads the same sentence.
3. THE BAR'S LISTED TOWNS (N88): told to him, with his veto.
4. THE MAP IMPORT'S PAID GATE: named to him; unchanged.
5. THE SIGNINGS that are his alone stay unsigned (worker size, engine chunk, first-paint budgets, the size rows of the
   state sentences, one frozen-file budget raise: N56).

## 5. How to resume

1. Read this file, then the record's top block, then each seat's pause block.
2. SIX SEATS WORK AT A TIME (the owner's rule); a successor is seated only after its predecessor has stopped; a start
   message is a file pushed BEFORE its session is created.
3. THE ORDER: chain A first (the longest road), with its second seat for T5 beside it; chain B; chain C's "TIP?" (after
   a chair has read its diff) and its next unit; the doors after "R4-IDS MERGED"; the join last.
4. EVERY UNIT: red first; the whole-document form (N90); a slice for a builder's red and green and the full pools once
   per unit (N111); the "TIP?" line answered by the chair's grant and E116's five steps; every push guarded (N92).
5. AT THE BAR: `prompts/DRAFT-START-REVIEW-VEIL-16.txt` filled and the security reader seated; then one top-tier read of
   212's final text; then the owner's hands.

## 6. What not to do

Apply 211 or 212 to nothing but a local database. Merge nothing of the veil into the working line but through the
join. Build nothing against a ruling of section 3 without a new ruling. Do not re-run a proof whose receipts are
pushed unless its tree has moved. Do not serve a new fact to cure a page fault (N102). Do not read a gate through a
pipe. Do not take a recorded approval as a grant: the pull request's merge, the deploy, every migration and the
production credentials are the owner's hand.
