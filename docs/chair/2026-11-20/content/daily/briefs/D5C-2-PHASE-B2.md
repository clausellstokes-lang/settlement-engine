# D5C-2 — PHASE B2: THE CHAIR'S RULING ON P16 AND P20 (DAILY-5's builder)

Seat DAILY-5 (its hand-back `../DAILY-5-HANDBACK.md`). You BUILD; the seat reads your diff whole once and re-runs your red.
Branch `lane/daily-5-2026-11-23-c2-wip` (worktree `/home/user/wt-c2`, at 535b893a2: phase B's 34 lines, a0340325c, and its
measures). Commit by explicit pathspecs, never `--no-verify`, NO PUSH (the seat pushes). Build laws as phase B's brief
(`D5C-2-PHASE-B.md`, beside this file): read it, and `B-BUILD-COMMON.md`, and no wider than this file names.

## THE RULING (the chair to DAILY-5, queued 2026-11-23 01:57 UTC, in its words)
"(b). A LINE THAT NEEDS NOTHING HAS NO PLACE IN A BRANCH WHOSE OWN CONDITION IS AN ABSENCE (COMMON-RULES 1: each wording
declares the facts it needs; the ruling of 18:19 stands for every slot: a slot with no true line prints the EMPTY
string). ... P16 ... AND P20 ... EACH GAIN `["institution: dwellings"]` (the households whose people the line speaks of;
the words stay as taken). THE THREE PINS OF 18:19 STAY AS THEY ARE AND MUST BE GREEN on their no-house fixture; the
fourth pin (the eligible ids) is re-pointed to hold P16 to P20, by cause. THEN RE-MEASURE THE 900: `gathering_places`
still prints on 150 of 150 at every size, and no filled sentence or family rises over the bar. IF EITHER FAILS, STOP and
tell me the size and the count."

## THE CHANGE (the manifest: these three files, and the measures below; nothing else)
1. `src/data/dailyLife/gatheringPlaces.js`: `GATHERING_PLAIN` P16 and P20 `needs: []` -> `needs: ['institution: dwellings']`.
   Texts unchanged. The header's D5C-2 note gains one clause naming the ruling (the chair, 2026-11-23 01:57 UTC).
2. `tests/domain/dailyLifeNewLines.test.js`: P16 and P20's needs in `NEW_LINES` as in 1 (arm (a) reads them).
3. `tests/domain/dailyLifeGathering.test.js` "the pick is pickVariantMixed over the eligible lines ...": its expected
   eligible ids re-pointed to hold P16 to P20 WHERE THEIR NEEDS HOLD on that test's place, BY CAUSE (a comment naming
   phase B's lines and this ruling). Read the pin first; its meaning (the eligible list is the door's, the pick keyed)
   is kept, never loosened. If the pin cannot be re-pointed without changing what it guards: STOP and report.
The three 18:19 pins are NOT touched: `tests/domain/dailyLife.test.js` "prints the EMPTY string when no recognized
institutions present" and "every slot has non-empty text + valid shape"; `tests/domain/dailyLifeGathering.test.js` "a
place with no true line prints the EMPTY string ...". They must turn GREEN by the change in 1 alone. If one stays red:
STOP and report its failure text.

## RED FIRST
Before 1: run the three 18:19 pins and the fourth pin at 535b893a2 (all four red, titles). After: green.

## THE RE-MEASURE (through the gate mutex, to a file, never a pipe)
`measure.d4c.mjs` (`../measures/D4C/`) on your tip into `../measures/D5C/after2.out.txt`, and `reader.d5c.mjs` into
`../measures/D5C/reader.after2.out.txt`. THE TEST: table 2c's `gathering_places` prints 150/150 at EVERY size; 2a
FAMILIES at >= 23 of 150: none; 2b FILLED at >= 15 of 150: none. IF EITHER FAILS, STOP: commit nothing of the measure
beyond the files, and report the size and the count (no extra line: a line more is the chair's eye).

## PROOF AT YOUR LAST COMMIT
The 17 Daily Life files (`tests/domain/dailyLife*.test.js`, `tests/components/dailyLife*`,
`tests/pdf/dailyLifeChapterLines.test.jsx`), `tests/lint/dailyLifePossessive.walker.test.js` and
`tests/lint/samenessHideable.walker.test.js`: one run, counts. Known red: samenessHideable "PHASE 3, RULE 2" (the
seat's, by its door at the merge: NAME its new count, do not touch the register). eslint on touched files. No
`tests/lint` whole, no build. Commits: `fix(daily-5): D5C-2 P16 and P20 need dwellings (the chair's ruling of 01:57)`,
then `docs(daily-5): D5C-2 the re-measure after the ruling (measures/D5C after2)`.

## REPORT (at most 200 words, then STOP)
Shas; the four pins' red then green titles; the run's counts and failing titles; after2 against after: gathering's
places printing by size, the largest filled sentence and family by size, families at 15 to 22 (count), the reader's
figure by size and pooled; anything over the bar (size, count) if you stopped.
