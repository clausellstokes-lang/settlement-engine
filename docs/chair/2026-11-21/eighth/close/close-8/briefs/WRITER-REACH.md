# BRIEF: THE WRITER-REACH ROWS OF D6 AND P9 (START-CLOSE-8 (3d); the tenth chair's G20, G37 (i)). ONE BUILDER. A REGISTER BY ITS DOOR.

## THE TWO ROWS
- D6 (WORDS-1, "the contender's word"): `src/domain/dossier/powerStrata.js` now reads a tie's `type`, so the frozen register
  `scripts/.writer-reach-baseline.json`'s surfaceReach row "type on factionRelationships" moves web-transitive N -> R. START-CLOSE-8
  (3d): "re-taken BY ITS OWN DOOR in its own commit; the diff sent to me". WORDS-1 found the door's `--write` (shrink-only) would
  also re-freeze the base's own drift (closure sizes, digests) when tried on an older tree: say whether that is so here.
- P9 (BIRTH-2, "the beasts grade on settled land"): "monster on economicGates" and "monster on scores" LOSE web-display, because the
  one reader of `.monster` is now the leaf `src/domain/facts/beastsReadiness.js`, outside the display directories. G37 (i) (the
  chair): "the register must stay TRUE: the page does display it. If the door can declare a fact leaf as a reader on display's
  behalf, declare it so the reach stays true; else re-take by `node scripts/check-writer-reach.mjs --write` and send the chair the
  diff with those rows named and the gap written down."
- Today `tests/lint/writerReach.walker.test.js` reds on the join ("the surfaceReach grammar round-trips": "monster on
  economicGates is missing from the frozen surfaceReach", web-display), and D6's row behind it.

## WHAT TO DO
1. Read `scripts/check-writer-reach.mjs`'s header and its options (and its register/declaration files it names) WHOLE enough to
   answer: does the door have a form to declare a module as a reader on a surface's behalf (a display-reader declaration, an alias
   list, a surface map)? Quote the form or say "none" with the place you looked.
2. P9 FIRST: if the form exists, declare `src/domain/facts/beastsReadiness.js` through it as display's reader (the smallest entry
   the form allows), so the two monster rows keep web-display; run the door's check; its own commit. If none exists, do NOT edit the
   register by hand: go to 3 and name the gap.
3. Then run the door's `--write` (through the mutex if it runs vitest or births; else directly), in its own commit for D6's row
   (and P9's rows if 2 found no form). BEFORE committing: `git diff --stat` and the row-level diff of the register: list EVERY row
   that moved with its old -> new value; any row other than the three named above is a STOP (do not commit; report it).
   If the door REFUSES (shrink-only refusing a rise), commit nothing; report its exact message.
4. Run `tests/lint/writerReach.walker.test.js` (green expected) and `tests/lint` whole (known reds: `proseComposed` A0b,
   `proseCorpusBytes` RAW and GZIP; name any other).

## WHERE
- THE JOIN: worktree `/home/user/wt/join`, branch `lane/close-8-2026-11-25-join` (CLOSE-8 tells you its tip). Commit there by
  explicit paths. DO NOT PUSH. Files: the writer-reach register and the door's declaration file if one exists. Anything else: STOP.

## LAWS
- Every vitest run through `GATE_MUTEX_MAX_POLLS=40000 sh scripts/gate-mutex.sh --run -- <cmd> > <log> 2>&1; echo "exit=$?" >>
  <log>` (logs `/tmp/claude-0/-home-user-settlement-engine/f9f37e55-dc9e-512d-9953-f1c7274d335f/scratchpad/wr-*.log`); read by
  tail/grep. Hooks never bypassed. A permission refusal stands: report it, try nothing else.

## REPORT (at most 250 words) as your final answer
The form found or "none"; the commits; the register's row diff (every moved row, old -> new); the gap written down if any; the
walker and tests/lint counts.
