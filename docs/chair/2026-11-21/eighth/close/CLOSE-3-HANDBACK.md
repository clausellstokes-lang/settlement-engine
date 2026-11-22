# CLOSE-3 — HAND-BACK (FINAL at the owner's stop of 2026-11-22 22:58 UTC; for a reader who has never seen this session)

The close's third seat, seated beside CLOSE-2 by the eighth chair (session_01ACmDYY29VRchM87v1yhL9Q, on the old account:
NOT reachable from the next account). Prompt: `docs/chair/2026-11-21/eighth/prompts/CLOSE-3.txt` on `lane/chair-2026-11-08`
(written 2026-11-22 21:10 UTC). Two units: (1) "VACANT" (the chair's E131); (3) THE FLIP. THE OWNER'S ORDER of 2026-11-22
(relayed by the chair 22:20 UTC, verbatim): "At the next hourly check. Focus all your attention and effort on recording
every lane's progress for handoff to a different account and stoping the progress of each lane once you have recorded
them." This seat STOPPED at 22:58 UTC.

## 0. WHERE THE SEAT STANDS (FINAL; every branch on origin)

| ref | tip | state |
|---|---|---|
| `lane/close-3-2026-11-22` (this lane) | this push | docs only: this hand-back; `briefs/VACANT.md` (the builder's brief); `close-3/` (re-count, flip-list entry, lit moves, proof scripts) |
| `lane/close-3-2026-11-22-vacant-wip` | 2b8cc2946 | VACANT's code, cut from the line's tip 244fa84ef: fc0ec46a0 the cure (READ WHOLE by this seat, proven below); 003a1723b the lighting census by its door; 2b8cc2946 CURE ONE, a WORK-IN-PROGRESS commit (its diff NOT read by this seat; its proof below) |
| `lane/close-3-lit-scratch-2026-11-22` | 1637eb736 | fc0ec46a0 + the flip's three dials + the `powersList` row (`close-2/census/light.sh`): a SCRATCH ref, never merged; it does NOT carry cure one |
| `lane/close-2-lit-scratch-2026-11-22` | c1128c8f6 | the lit ref this seat read (CLOSE-2's; read only) |

### (1) DONE, WITH COMMITS
VACANT (E131): the fault, lit only and new with the flip: a page says "No one holds the seat at {place}."
(`governanceAccount.js`, on `chain.absence.kind === 'missing_seat'`) while the seat law's holder carries a standing line
(W3, "They sit in the {form} themselves…") and the form<->holder row a relation line (W1).
- THE RE-COUNT (RUN; `close-3/VACANT-RECOUNT.md`, script `close-3/vacant-recount.mjs`; 600 lit births on c1128c8f6): 19
  empty seats; 10 clash: W3 on all 10, W1 on 6 (town 1, city 3, metropolis 6); all under `succession_void`; 0 empty seats
  outside it.
- THE PREDICATE: `missing_seat` holds exactly when the governing row carries the `vacant` modifier (under a vacancy the
  chain names no person); page, chain and `src/domain/people/seatKeeper.js :: isSeatVacant` agree on 600 of 600. The writer
  reads `isSeatVacant` (no second copy). The birth knows it at the power step (`applyStressEventFactions` writes `vacant`
  before `annotateFactionStanding` and `computeFactionRelationships`) and at the final-record pass
  (`factionStanding.js :: settleSeatHolderToRecord`), both through `factionDynamics.js :: seatHolderApartOf` (it now returns
  `vacant`). `rosterText.js` untouched.
- THE CURE fc0ec46a0 (built by this seat's builder; diff READ WHOLE by this seat): two pools in `src/data/seatHolderLines.js`,
  the chair's wordings verbatim: `standingVacant` (W3v) "They held the {form's} seat, and it stands empty now." / "They sat
  in the {form} until its seat fell empty." / "The {form} was theirs, and no one sits in its seat today."; `relationVacant`
  (W1v) "The {form} is the office here, and the seat {holder} held in it stands empty." / "{holder} sat in the {form} until
  its seat fell empty." / "The {form's} seat was filled by {holder}, and no one fills it now." No line needs
  `{holder|one|many}`. Drawn through the SAME mixed key (the key names the base pool; only the pool differs). W2 unchanged.
  The final-record pass cuts and replaces across both pools. `seatHolderFindings.js` judges the holder's lines BEFORE its
  `missing_seat` return: `seat_vacant_held_line` (empty seat + W3/W1) and `seat_held_vacant_line` (held seat + W3v/W1v).
  Tests: `tests/generators/seat/seatHolderLines.test.js` arms (10) red-first on the ten seeds, (11) the tooth over 135 lit
  births (19 empty, 10 with a holder apart; 20.0 s, budget 120 s), (12) the findings judge, (13) the pools verbatim.
- RUN BY THIS SEAT at fc0ec46a0 / 003a1723b: RED on the line (the cure's data file and test planted on 244fa84ef, no writer):
  10 of 10 red, W3 on all ten, W1 on the same six. GREEN: the seat file 17 of 17. THE DARK PROOF EQUAL: 900 dark births
  (`dp-<size>-<i>`, 150 a size, through `birthConfig`; `close-3/births-sha.mjs`) sha
  242edc8ec4756f00ddf52ef2d235f8aabe732f94d8e4eda0d992ab8c81e07119 on 244fa84ef AND on fc0ec46a0. LIT MOVES: 900 lit
  births (`lm-*`): c1128c8f6 fb3f0172… vs 1637eb736 f7e08e98…: 9 of 900 move (thorp 1, town 3, city 2, metropolis 3), each
  ONLY the holder's description (W3 -> W3v) and, in six, the form<->holder row (W1 -> W1v) (`close-3/VACANT-LIT-MOVES.txt`).
  REGISTERS: the lighting census by its door, 003a1723b (titles 31,865 -> 31,869; files 3,775 unchanged); `HAND_CEILING`
  unmoved at 77 (the builder's run); the prose bytes unmoved (the builder's run). RULE 8 (COMMON-EIGHTH 14): `tests/lint`
  whole 3 red of 3,354 (the line's three: `proseCorpusBytes` RAW, GZIP, `proseComposed` A0b) + `ledgerCitationIntegrity`
  NOT LOADABLE (see below); `tests/copy tests/store tests/architecture tests/docs` 2 red (voiceMechanics, deadOperationRatchet:
  listed); 35 files that name a changed module or symbol + the three walkers: 1 red (`powerEconomyFreshness` A4: listed).
  ONE BUILD (RUN): first paint 1,184,973 / 377,025 / 316,531 (the line on this box 1,184,741 / 376,987 / 316,646: +232 /
  +38 / -115), the worker 2,710,804 (+1,541), the engine chunk 932,591 (+222): MEASURED AT fc0ec46a0, BEFORE cure one,
  signed by nobody. `tests/build` (VERIFY_DIST=1): 18 red = the line's 15 + `domainGeneratorsBoundary` x2 (REAL: the
  findings module imported `src/generators/factionDynamics.js`, a new domain->generators edge; a shrink-only ratchet: the
  cause of cure one) + `bootSmoke` (a stray `public/map/libs/tinymce/plugins/__exact_set_probe__.js` written by a concurrent
  test of the same run; `bootSmoke` alone is green on the line on this box; NOT re-run alone on the wip).
- THE REFUSED FETCH: the builder's permission check REFUSED `git fetch origin review-fixes-2026-07-08 && git branch -f
  review-fixes-2026-07-08 FETCH_HEAD`; it was retried by no hand. THE CHAIR RULED (21:58 UTC): `tests/lint/ledgerCitationIntegrity.test.js`
  is NAMED in the landing line as red on this box for that cause alone; every other `tests/lint` file is this unit's to
  answer for; the landing stack, which holds the ref, is that file's proof.

### (2) HALF DONE, AND EXACTLY WHERE
CURE ONE (ruled by this seat 22:2x UTC, building when the stop came): the findings judge must import NOTHING from
`src/generators/`: `src/data/seatHolderLines.js` exports `SEAT_HOLDER_PATTERNS` (per pool, one RegExp per line derived from
the table, the `factionStanding.js :: RANK_STANDINGS` idiom: fixed parts escaped, every slot `[^.]+?`, anchored at a sentence
start); `seatHolderFindings.js` matches by them; new arm (14): every pattern matches every filled line of its own pool and
no filled line of another. STATE AT THE STOP: committed as WIP 2b8cc2946 (22:42 UTC, the builder's; its diff NOT YET READ by this seat). The builder reports: `SEAT_HOLDER_PATTERNS` derived from the table; the judge reads them and imports nothing from `src/generators/`; arm (14) added, and it CAUGHT one overlap (W1v's "{holder} sat in the {form} until its seat fell empty." matched W3v's "They sat in the {form}…"), cured IN THE DERIVATION, not the wordings: a `{holder}` slot reads `(?!They )[^.]+?` (a departure from "every slot `[^.]+?`": the successor reads it and rules it); GREEN by the builder's run: the seat file whole 18 of 18 (arm (11): the pattern judge and the exact read agree on 135 lit births). UNRUN at the stop: `tests/lint` whole (in flight at the stop, no result), `tests/build/domainGeneratorsBoundary.test.js`, `tests/architecture`, eslint, `typecheck:ratchet`, and the lighting census re-take by its door for arm (14)'s ONE new title (31,869 -> 31,870 expected; the commit body's census line is garbled: it means one title).
NOT RUN after cure one: the build and its five figures, `tests/build` whole (`domainGeneratorsBoundary` and `bootSmoke` alone
are the reds to read), the lit twin re-cut on the cure's tip and its lit moves, the dark proof again (the cure touches only
the judge and the data file's exports: PLAUSIBLY equal).

### (3) NEXT, IN ORDER
1. Finish cure one on `lane/close-3-2026-11-22-vacant-wip`: the seat file, `tests/lint` whole, `tests/build/domainGeneratorsBoundary.test.js`
   and `tests/architecture` green; then ONE build, `VERIFY_DIST=1 npx vitest run tests/build` (the line's 15 only; `bootSmoke`
   re-run alone), the five figures beside the line's (first paint 1,184,741 / 376,987 / 316,646; worker 2,709,263; engine
   932,369): any rise NAMED for the owner, signed by nobody; the dark proof (`close-3/births-sha.mjs 150 dp`, expect
   242edc8e…); the lit twin re-cut (`close-2/census/light.sh`) and its lit moves (`births-sha.mjs 150 lm`, compare with
   `fb3f0172…`'s per-birth file; expect the same 9).
2. "VACANT <commit>" to the landing (the next stack), with: the red 10/10 and green; the dark proof's sha; the lit moves 9 of
   900; the lighting census by its door; `ledgerCitationIntegrity` named as red by the refused fetch alone (the chair's ruling).
3. THE FLIP: NOT STARTED, AND NOT TO BE STARTED BY THIS SEAT. It is built from `CLOSE-RECIPE.md` (steps 1, 1a, 1b; 2b's four
   commits) on a base the chair names that holds PRONOUN (CLOSE-2's), VACANT and the Daily Life landings (the word-pinning
   anchors: ties 7, wants 7, Daily Life 1), with CLOSE-2's final census as its whole-suite run; the census's two surprises
   (`seat/seatHolderLines` U6 (2) u6t-city-4 and `domain/seat/seatChainHolder` arm 8 u7p-metropolis-21, which plant only the
   seat's dials) re-pinned by seed, and the office-word guard after the second re-read GREEN after.

### (4) THE PAPER FLIP LIST'S ENTRY FOR VACANT
`close-3/FLIP-LIST-VACANT.md`: dark nothing moves; lit 9 of 900 births move, only the holder's W3 and W1 lines; the chair's
read of CLOSE-2's census parts 1 and 2 found no red that pins a W1 or W3 line on a missing seat, so VACANT is expected to
move NO census row (if one shows, it is this entry's, class (a)).

## 1. WORKTREES ON THIS BOX (scratch; lost with the container)
`/home/user/wt/vacant` (the wip), `/home/user/wt/vlit` (the lit twin), `/home/user/wt/lit` (c1128c8f6), `/home/user/wt/line`
(244fa84ef, built: its five figures equal LINE-NOW's). `.git/info/exclude` carries `/node_modules` so the lighting door reads a
worktree with a `node_modules` symlink as clean.
