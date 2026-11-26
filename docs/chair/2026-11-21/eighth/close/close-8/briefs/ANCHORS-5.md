# BRIEF: ANCHORS-5 (the tenth chair's R24v, 2026-11-25 21:44 UTC). ONE BUILDER. TEST-ONLY. A SECURITY TEST.

## THE CHAIR'S WORDS (R24v, in substance)
CI's run on the line (45697196352 at 09c29806b) failed FIVE new rows, all in `tests/security/traditionDescriptionSharedPage.test.js`:
the "NOT VACUOUS" and "CONTROL" arms of the blocks "TRAD-3 UNIT 4, THE DEAD'S CAUSE" and "TRAD-4 UNIT 7 (1)". THE CAUSE (the chair
ran the file on the line's tree: 5 failed, 45 passed): one anchor town, `trad-dead-city-arabic-22` in the block's SPECS, holds NO
RITE OF THE DEAD after B1(i) ("expected 0 to be greater than 0"; the owner's description is ''), so the plant reaches nothing. The
hiding assertions themselves pass. THE CURE: the file states its own rule above those SPECS ("each moves to the first seed of its
own series that meets these blocks' own predicates"): re-pick that seed BY THAT RULE on the joined tree (the first of its
`trad-dead-city-arabic-<n>` series that holds a rite of the dead, a hideable house, and whatever else the two blocks' NOT VACUOUS
arms ask); assertions UNCHANGED; a RE-KEYED BY IDENTITY comment in the file's own form (cause B1(i), old seed, new seed). The
landing line must say that all 50 tests of that file pass and that the two NOT VACUOUS arms are green on every town of the SPECS.
It is a security test: a finder that finds no seed in 0 to 199 is a STOP, never a weakened arm.

## WHAT TO DO
1. Read the test file WHOLE once. Run it on the join as it stands (expect 5 red, 45 green: say the counts).
2. Find the new seed BY THE FILE'S OWN RULE: the first n of the series (in the series' own order, from 0) for which every
   predicate of both blocks' NOT VACUOUS arms holds on the joined tree. Write the finder as a throwaway script outside the repo
   (the scratchpad) or as the file's own finder if the file already has one; record each candidate tried and why it failed.
3. Edit ONLY the seed in SPECS and add the RE-KEYED BY IDENTITY comment in the file's own form (find an existing one in the file or
   in `tests/` to copy the form). No assertion, threshold or arm changes.
4. Run the file: 50 of 50. Confirm the two NOT VACUOUS arms run on EVERY town of the SPECS (read the arm: if it iterates SPECS,
   say so; if not, say which towns it covers). Then `tests/lint` whole (a test file changed): known reds `proseComposed` A0b,
   `proseCorpusBytes` RAW and GZIP, `writerReach` (rows owed elsewhere); any other is yours to name.

## WHERE
- THE JOIN: worktree `/home/user/wt/join`, branch `lane/close-8-2026-11-25-join`. Commit there by explicit paths (the one test
  file). DO NOT PUSH. Any other file: STOP and report.

## LAWS
- Every vitest run through `GATE_MUTEX_MAX_POLLS=40000 sh scripts/gate-mutex.sh --run -- <cmd> > <log> 2>&1; echo "exit=$?" >>
  <log>` (logs under `/tmp/claude-0/-home-user-settlement-engine/f9f37e55-dc9e-512d-9953-f1c7274d335f/scratchpad/a5-*.log`); read
  by tail/grep; never a gate through a pipe. Hooks never bypassed. A permission refusal stands: report it, try nothing else.

## REPORT (at most 200 words) as your final answer
Old seed, new seed, the candidates refused and why; the commit; 50/50; NOT VACUOUS coverage; tests/lint's reds by name.
