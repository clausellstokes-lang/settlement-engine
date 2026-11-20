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
