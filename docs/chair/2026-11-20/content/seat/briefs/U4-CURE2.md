# U4-CURE2: R1 reads the transfer edge's STRUCTURED keys, never its sentence (the chair, 14:32Z). Builder B4d (SEAT-5's). Written 2026-11-20T14:34:31Z, read from `date -u`.

Read `briefs/COMMON.md` first; it governs where this brief is silent. Then read `briefs/U4-CURE-REPORT.md`, which is cure 2 and its three identities that are left.

**Your base.** Cut branch `lane/seat-2026-11-20-u4-cure2` from `fbf77bfa2` (`origin/lane/seat-2026-11-20-u4-cure-wip`: U4 plus cures 1 and 2) in worktree `/home/user/wt-u4cure2`. SEAT-5 cuts it and symlinks `node_modules`. Do not change U4's behaviour, cure 1 or cure 2.

## The ruling you build to (the chair, 14:32Z, verbatim in substance)
`writerReach.walker` identity **`narrative on factionRelationships`** moved N to R on five surfaces (campaign-pdf, dossier-pdf, foundry, web-transitive, world-book). The cause is `src/domain/seat/holderOfSeat.js :: transferTakerOf`, which compares `rel.narrative` to `takerLine(taker, form)`.

**Cure by cause:** read R1's taker from the edge's STRUCTURED keys only (the two powers in `pair`, the `type` and the `direction`), never from its sentence. A fact parsed out of prose is refused.

`transferRulingPower` writes the edge as `{ pair: [<form>, <taker>], type: 'symbiotic', direction: 'stable', narrative: … }` (`rulingPower.js`, the `symbioticNarrative` block). It also converts the taker's existing edge, re-keyed, to that type and direction.

The two other identities (`recentConflict on powerStructure` via `transferSays`, `priorityMilitary on config` via `seatCircumstances.js`) are RULED necessary. SEAT-5 re-records them at the merge. Do not touch them, and do not touch `transferSays`.

## Step 0: MEASURE FIRST, before any edit (this measure can refute the cure)
Born towns can already carry a `symbiotic`/`stable` edge between the governing row and another power. A structured-only read would then answer R1 at birth, where U3 measured R1 0 of 0 on both pools.

Using `measure-holder.mjs`'s two pools (default and presets), report:
- (a) at birth, the number of towns where some edge has `pair` holding the current form plus another power's row and has `type === 'symbiotic' && direction === 'stable'` (the false R1 a structured read would answer), by size;
- (b) on each pool, after one, two and three transfers through the real `transferRulingPower` (winners taken as `coupContenders(s)[0]`, else the heaviest non-governing power; cause `coup`, and also `election`), whether a structured-only read answers exactly the taker the current `transferTakerOf` answers;
- (c) any later writer that edits that edge's `type` or `direction` after a transfer (grep the writers of `factionRelationships`: `factionDynamics.js`, the world pulse, the events), named by `path :: symbol`.

**If (a) is non-zero, or (b) differs, or (c) names a writer that breaks the read, the structured keys alone cannot carry R1. STOP.** Write the counts in your report and name which other STRUCTURED field of the record a transfer writes (the `previousGovernments` row, the winner's `ascendant` modifier, the `transfer` descriptor, if stored), with the counts each would answer. Change no code and tell SEAT-5. The chair rules. You never parse prose, and you never invent a discriminator.

## Step 1 (only if Step 0 is clean): the cure
`transferTakerOf` matches an edge by `pair` holding the current form and a taker, plus `type === 'symbiotic'` and `direction === 'stable'`. It never reads `narrative`. The tie-break via `transferSays` stays as it is.

Remove `takerLine` if nothing else reads it. Update the leaf's header comment ("R1, WHAT IT READS"). `holderOf`'s API and every answer stay unchanged on every fixture of `holderOfSeat.test.js` and `seatContest.test.js`, and on Step 0's pools before and after the cure (0 differences, counted).

## Step 2: the CS11 arm, RED FIRST (the chair: "Either way, a test red first")
Add a new arm (10) in `tests/domain/seat/holderOfSeat.test.js`. For every audience that is not the owner's (`'reader'`, missing, `null`, `''`, `'public'`, `'dm'`), `holderOf` on a SERVED document (`publicSafe.js :: toPublicSafe`, read-only use as in arm (4)) reads that document alone and names no criminal and no hidden power. That means no such name anywhere in `JSON.stringify` of the answer, `holderName` and `person` included.

The fixtures are towns whose last transfer's taker is:
- (a) a criminal power;
- (b) a hidden power;
- (c) an open power whose edge sits beside a criminal power's symbiotic/stable edge on the same form (the structured read's own hazard).

Each fixture is a town-size case, per COMMON.

RED FIRST: run the arm on the base code. If it is red there, record its failing titles. If it is green at base, prove it can convict with a named PLANT in `holderOfSeat.js` (for example, `servable` returning true), run red, restore, and record both counts and the plant's text.

## Files you own
- `src/domain/seat/holderOfSeat.js` (`transferTakerOf`, `takerLine`, the header comment);
- `tests/domain/seat/holderOfSeat.test.js` (arm (10), plus an equality arm for Step 1 if you need one);
- a measure script under `docs/chair/2026-11-20/content/seat/u4cure2/` (ONE command; it writes its output beside itself; run it from a scratch copy);
- your report `briefs/U4-CURE2-REPORT.md`.

Not yours: `rulingPower.js`, `rulingPowerCoup.js`, `seatCircumstances.js`, every register and census, and `factionDynamics.js`.

## Green before you hand back
- your arms, plus `holderOfSeat.test.js` and `seatContest.test.js`;
- every test file naming `holderOfSeat` or `rulingPowerCoup` (`grep -rl`);
- `layerBoundaries`, `engineCoreLazyEdge` and `densityCreateBoundary.walker`;
- `writerReach.walker`, measured per identity as in cure 2's report: `narrative on factionRelationships` NO LONGER differs, and exactly the two ruled identities remain;
- `typecheck:ratchet`, `typecheck:domain:strict` and `lint`;
- `sh docs/chair/2026-11-20/content/seat/confine/confine-two.sh fbf77bfa2 <your tip>` EQUAL (both hashes).

Do NOT run `tests/lint` whole; SEAT-5 runs it at the merge. Run every gate through `sh scripts/gate-tail.sh <command>` into a file and read its count lines, never through a pipe. No test run with GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE, GIT_COMMON_DIR, GIT_OBJECT_DIRECTORY or GIT_PREFIX set.

Commit by explicit paths: one commit for the arm's red-first evidence (or the plant record) and the cure, one for the report. Put the red and green counts in each message, with SEAT-5's trailers (`Co-Authored-By` and `Claude-Session` as in the lane's commits). **Do NOT push.** A census is never yours. Hand back to SEAT-5 in at most 300 words: outcome first, plus one CONFIRMED-vs-PLAUSIBLE sentence.

## ADDENDUM (SEAT-5, 2026-11-20T14:43:16Z): Step 0 STOPPED; Step 2 alone goes to builder B4e
B4d's Step 0 (`briefs/U4-CURE2-REPORT.md`, `4780d9e6c`) refuted the structured-only read. A born seat already has a symbiotic/stable edge with its military power in 163 of 900 default towns and 111 of 960 presets towns. The chair rules (i). **Step 1 is NOT built.** `holderOfSeat.js` is not yours.

**B4e builds Step 2 ONLY:** arm (10) in `tests/domain/seat/holderOfSeat.test.js`, exactly as Step 2 above. Add fixture (d): a born-shape town whose seat has a symbiotic/stable edge with its MILITARY power and no transfer on record, where every non-owner audience's answer names no criminal or hidden power and does not answer R1.

Your base is branch `lane/seat-2026-11-20-u4-cure2` at `4780d9e6c`, worktree `/home/user/wt-u4cure2`. Your files are that one test file and a section appended to `briefs/U4-CURE2-REPORT.md`.

**RED FIRST.** If the arm is green on the code as it stands, prove it convicts with a named PLANT in `holderOfSeat.js`: run it red, restore it, and record both counts and the plant's text. `git diff --quiet fbf77bfa2 -- src/` must hold at your tip.

**Green:**
- the arm, plus `holderOfSeat.test.js` and `seatContest.test.js` whole;
- `lint` on the test file.

Commit by explicit paths with the counts in the message and SEAT-5's trailers. Do not push. Hand back in at most 200 words.

## ADDENDUM 2 (SEAT-5, 2026-11-20T14:47:15Z): THE CHAIR'S RULING ON (i), 14:44Z. Step 1 is replaced by Step 1′ below, for B4e after Step 2.
**RULED:** (i) `narrative on factionRelationships` is RE-RECORDED WITH ITS CAUSE, like (ii) and (iii), on FOUR CONDITIONS, because a fact read from a sentence breaks the day the sentence is reworded. SEAT-5 re-records at the merge; you never do. Condition (4) is Step 2's arm. Step 1′ builds (1) to (3):

1. **ONE MATCHER** for the transfer's own sentences. One exported function in `src/domain/seat/holderOfSeat.js` answers both what `transferTakerOf` compares today with `takerLine` (the edge's narrative) and what `transferSays` reads in `recentConflict`. There is no scattered equality and no second template anywhere in the leaf. Today's answers stay unchanged on every fixture, and `seatContest.test.js` stays green.
2. **A FROZEN LIST OF WORDINGS** held beside the matcher: every wording those sentences have had under the seat's law, which today is one for the edge and two for `recentConflict` (coup; lawful passage, with and without the demotion clause). The matcher matches ANY wording in the list. A test drives the REAL `rulingPower.js :: transferRulingPower` (every cause) and pins it INTO the list, so a later change of wording reds until the old wording is ADDED, never replaced. A fixture town carrying the frozen wording still reads its holder when a made-up NEW wording is put first in the list (the matcher takes the list as a parameter, or the test builds one from the exported list).
3. **THREE ARMS BY MEASURE:**
   - (a) the seat's birth edge with its military power (symbiotic/stable, no transfer on record) names NOBODY as taker;
   - (b) is U5's (no town reads two takers after U5; it is in U5's brief, not yours);
   - (c) A POWER THE DM RENAMES AFTER A TRANSFER. Find the rename path (the events registry and `events/mutateWorld.js`; name it by `path :: symbol`), run it on a transferred town, and say what `holderOf` answers for the owner and the reader: the right power, or nobody. Pin THAT answer. If it answers a WRONG power, STOP and tell SEAT-5; do not cure it.

**Files:** `src/domain/seat/holderOfSeat.js` (the matcher, the frozen list, `transferTakerOf`, `transferSays`, `takerLine`, the header comment), `tests/domain/seat/holderOfSeat.test.js`, and your report section.

**Green:** as the brief's "Green before you hand back", with `writerReach.walker` expected red on exactly the three ruled identities (name them), and `confine-two.sh fbf77bfa2 <your tip>` EQUAL.

## ADDENDUM 3 (SEAT-5, 2026-11-20T15:18:23Z): THE CHAIR'S RULING ON (3)(c), 15:17Z: FAIL CLOSED INSIDE THE LEAF
**RULED:** where no edge matches the CURRENT form exactly, but an edge on the current seat's pair matches a frozen wording written for ANOTHER form, the record holds a transfer the read cannot attribute. R1 answers NOBODY there, for both audiences, with no fall-through to R2 or R3. A wrong power named is worse than none. The rule lives in `holderOfSeat.js` only.

The three conditions:
1. **"NOBODY" IS AN OMISSION, NEVER A STATEMENT.** Every surface prints what it printed before a taker could be read: the seat's form with no taker named. None prints that the seat is empty, vacant or unheld. Pin it on the owner's page and on a reader's. On the renamed-seat town, `dossier/powerStrata.js :: derivePowerStrata`, on the record and on `toPublicSafe`'s served document, names the seat's form and matches no `/vacant|empty|unheld|no one holds|nobody holds/i`. Its contender list is the contest's with no holder removed. State in the report which surfaces read `holderOf` today, by `path :: symbol`.
2. **MEASURE BEFORE THE MERGE:** on both pools of born towns (`measure-holder.mjs`'s pools), the new rule fires in 0. Add the count to your measure script. Any other count STOPS you: report it with one town's record beside it.
3. **RED FIRST:** the rename-the-seat case (today "Coin Exchange" for "Merchant Guilds") is pinned to answer nobody. It is red at `5b95aaaf5` and green with the rule. Record both counts.

**NOT TOUCHED:** the rename's lower-case miss (`factionRename.js`). It is a named survivor for after the deploy, beside the stored transfer marker.

**Green:** as addendum 2's, plus the measure's 0. `confine-two.sh fbf77bfa2 <tip>` EQUAL.
