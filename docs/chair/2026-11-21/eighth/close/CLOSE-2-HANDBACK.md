# CLOSE-2 — HAND-BACK (kept current at every push; last written 2026-11-22 17:55 UTC, read from `date -u`)

The close's second seat (prompt: the chair's seating message of 2026-11-22 17:41 UTC; it follows CLOSE-1, whose
`CLOSE-1-HANDBACK.md` section 0 is the map of the read-in). The chair: session_01ACmDYY29VRchM87v1yhL9Q (send_message).

## 0. WHERE THE SEAT STANDS — FINAL, STOPPED BY THE OWNER'S ORDER (2026-11-22 22:25 UTC; the chair's read of the record: 441,852)

THE OWNER'S ORDER (2026-11-22, verbatim, through the chair): "At the next hourly check. Focus all your attention and effort on
recording every lane's progress for handoff to a different account and stoping the progress of each lane once you have
recorded them." THIS SEAT IS STOPPED. A successor (on another account) needs this section, the files it names, and origin.

### THE REFS (all on origin)
| ref | tip | what it is |
|---|---|---|
| `lane/close-2-2026-11-22` | this push | this seat's records: this hand-back; `close/close-2/` (JOIN-RERUN, GOLDEN-LIT-PROOF, LOOSE-ENDS, contender/, oldmaster/, census/); the owner's draft `close/FOR-THE-OWNER-DRAFT.md`; the recipe's corrections; `close/briefs/PRONOUN.md` |
| `lane/close-2-lit-scratch-2026-11-22` | c1128c8f6 | THE FINAL CENSUS'S LIT REF: 383e752d5 (`lane/stack-100-wip-2026-11-22`: the line's point 102 + 103 JOIN + 104 FORTUNE-C + the lighting census) plus ONE commit by `close/close-2/census/light.sh` (the three dials and the `powersList` row: CLOSE-RECIPE steps 1 and 1b; 4 files, 5 lines). A scratch ref: never merged |
| `lane/close-2-2026-11-22-pronoun-wip` | f5fa6316a | PRONOUN (unit 3c, E117), STOPPED, UNPROVED IN PART, NOT READ BY CLOSE-2 (below) |
| `lane/close-1-2026-11-22-join-wip` | a1319f388 | JOIN: re-run by this seat; LANDED on the line as POINT 103 |
| `lane/close-1-2026-11-22-golden-wip` | ba0e1c288 | GOLDEN-LIT: proven by this seat (`close-2/GOLDEN-LIT-PROOF.md`); RULED E111: lands in the flip's own stack, LAST, red and listed |
The working line at the stop: `lane/join-2026-11-14` at 244fa84ef (point 105), by the chair's 21:00 line.

### (1) DONE
- JOIN's re-run (`close-2/JOIN-RERUN.md`): four plants red, dark 44/44, lit 35/44 = the nine dial pins; tests/lint the line's
  three; landed as point 103.
- GOLDEN-LIT's proof (`close-2/GOLDEN-LIT-PROOF.md`): every builder claim CONFIRMED; the dark master is 0/525 on the dark
  line too: THE OWNER SIGNS TWO RECORDS (E111); the twin's three red-list rows drafted there.
- The old master's diff for the owner (`close-2/oldmaster/OLD-MASTER-DIFF.md`): record commit a7a25bd39 (525/525 there,
  0/525 today); only WORDS moved, by points 77, 82, 83-85, 89, 91, 93, 96; it found the pronoun-case fault (E117).
- The loose ends (`close-2/LOOSE-ENDS.md`): stop 1 (the sameness program's, after the deploy); stop 2's three places; the
  contender measure (`close-2/contender/`, E113: the owner's, after the deploy).
- THE FINAL CENSUS, PARTS 1 TO 4 (`close-2/census/final/CENSUS-FINAL.md`, its tables beside it): gen 104 red / 20 listed /
  84 new, all (a); domain 60 / 3 / 57, all (a); tests/build 15 / 15 / 0; tests/lint 3 / 3 / 0 (the powers row holds); NO
  (d); 0 TIMEOUTS; `diff-classed.mjs` against the rehearsal (part 1: 5 new, 0 gone; part 2: 2 new, 2 gone); TWO SURPRISES
  (SEAT-B's `seatHolderLines` U6 (2) and `seatChainHolder` arm 8 plant only the seat's dials: lit fortune moves them; the
  second masks its office-word guard); the anchors that pin words (ties 7, wants 7, Daily Life 1); the list over 8,000 ms
  (a heuristic: 33 + 38 rows, to be read); the lit sizes (first paint 0 / -13 / -174, the worker +2,335, the engine 0).
- The owner's one page (`close/FOR-THE-OWNER-DRAFT.md`): the two golden signings, the old master's diff in his words, the
  pronoun fault before he signs, E112's reclass.

### (2) HALF DONE, EXACTLY WHERE
- THE CENSUS'S PARTS 5 AND 6: PART 5 RUNNING at this push (started 22:15:22 UTC), PART 6 NOT RUN; updated at the last push. A successor runs ONLY a part not marked ended
  here, on c1128c8f6, and classes it like parts 1 and 2 (the rehearsal's tables `census/lit-ui-classed.tsv`; part 6 had no
  new reds in the rehearsal).
- PRONOUN (`close/briefs/PRONOUN.md`; the builder's own report in the -wip at
  `docs/chair/2026-11-21/eighth/close/close-2/pronoun/PRONOUN-REPORT.md`): by the builder's words, PLAUSIBLE, NOT re-run and
  NOT read by CLOSE-2: MEASURED at c1144ba18 132 (template, later mention) pairs, 24 WRONG (23 ties, 1 want); BUILT
  2904f0475 (the leaf reads the case by the follower; walker `tests/lint/personMentionCase.walker.test.js`), registers
  076a7816c (lighting census) and fda719adf (mutation manifest); red first shown; tests/lint 3 red (listed), people 211
  green, 23 named files + golden 5 red (listed). NOT DONE: both typechecks, the build and VERIFY_DIST (the five figures),
  which goldens move; the seat's own read of the diff and re-run of red and green.

### (3) NEXT, IN ORDER
1. PRONOUN: read 2904f0475..f5fa6316a whole; re-run its red first and its gate (the brief's); run the two typechecks and one
   build with the five figures; then "PRONOUN <commit>" to the chair.
2. The census's parts not ended (above), then the report (`CENSUS-FINAL.md`) to the chair for the flip's builder (CLOSE-3,
   E131: the flip is CLOSE-3's, not this seat's).
3. The flip's hand anchors in the word-pinning files are re-pinned after PRONOUN and DAILY-B land.

### (4) HOW TO RE-RUN A CENSUS PART ON A FRESH MACHINE
`npm ci`; `git fetch origin review-fixes-2026-07-08 && git branch -f review-fixes-2026-07-08 FETCH_HEAD`; `git worktree add
<dir> origin/lane/close-2-lit-scratch-2026-11-22` (c1128c8f6); `ln -s <main checkout>/node_modules <dir>/node_modules`; edit
`O=` in `close/close-2/census/run-parts.sh` (or `run-rest.sh` for parts 5 and 6) to your scratch; `GATE_MUTEX_MAX_POLLS=400 sh
<that script> <dir> final`, in the background (each part 15 to 50 minutes on 4 cores; a background job's two-hour cap killed
this seat's first runner during part 5, so run parts 5 and 6 as their own job); then per part `node close/census/match.mjs
<part>.json <red list tsv>`, `node close/census/dump.mjs`, the classifier on `close/census/CLASSIFY-BRIEF.md`, `node
close/census/diff-classed.mjs close/census/lit-<part>-classed.tsv <yours>`, `node close/close-2/census/slow.mjs <dir> <part>.json`.
NOTE: in `run-parts.sh` the npm build's log and the tests/build part's log share the name `build.log` (the second
overwrites the first; the JSON is separate).
