# D4-L12-CUT — DAILY-4's unit (0a): L12 is cut from this landing (the chair's E107)

Seat: DAILY-4 (branch `lane/daily-4-2026-11-22`). Builder branch: `lane/daily-4-2026-11-22-l12-wip`, cut at the
seat's tip. ONE commit (or two: the test first is fine), explicit pathspecs, never `--no-verify`, no push (the seat
pushes). Read `B-BUILD-COMMON.md` beside this file for the build laws; this file governs where it says more.

## Why
On four steward thorps (hxd-thorp-52, -59, -93, -140) the page says "the reeve" holds the Feudal Stewardship's seat
and no steward's house stands: L12 ("The lord's steward is obeyed, but not much liked.") asserted a second officer
(E95's condition 2 failed). The chair (E107) ruled L12 gains `house: lord's steward`; by DAILY-3's count it is cut
from this landing and named for after the first deploy with that shape (`house: lord's steward` beside
`office: lord's steward` and `sovereign`).

## What changes (and nothing else)
1. `src/data/dailyLife/commonerResentments.js`: the L12 row leaves the `legitimacy` pool; the header comment says L8 to
   L11 (the four office lines) and that L12 is NOT BUILT, for after the first deploy, with the ruled shape above.
   Ids are NOT renumbered (L13 stays L13).
2. `src/domain/facts/registeredWords.js :: HOUSE_FAMILIES`' answering expression: the `lord's steward` arm goes
   (headman and reeve STAY); the comment says two rows (headman, reeve) and why the steward's went.
3. THE ATOM `office: lord's steward` (factVocabulary.js, facts/officeForms.js) STAYS, unused, for L12's return —
   UNLESS a walker reds on an atom no line needs; then report that walker's title before changing anything.
4. `tests/domain/dailyLifeOffice.test.js`: arm (d) re-pointed to L8..L11 (L11 then L13), L12 asserted ABSENT from the
   pool; the false-0 arm without L12's special case; the header names L12 NOT BUILT. The atom arms (a)-(c) for the
   steward's form stay (the atom stays).
5. Any register that recorded L12's needs or the steward's answering row (look first at
   `tests/lint/presumptionClasses.register.json`, `tests/lint/presumedThings.widened.register.json`, the mutation
   manifest, the lighting census) is re-taken ONLY BY ITS OWN DOOR (its script or `--update` path named in the
   walker's own header), each row that leaves named in the commit. A shrink-only door is never raised.

## Proof
- RED FIRST: the changed `dailyLifeOffice.test.js` run on the base (src unchanged): the new absence arm(s) fail; say
  the titles and counts. Then the cut: green.
- `tests/lint` WHOLE after the change (COMMON-EIGHTH 11) — through the mutex, to a log, never a pipe:
  `sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint > <log> 2>&1; echo "EXIT $?" >> <log>`
  (if the mutex's own usage differs, read its header). Every failing title BY NAME. Known reds on the line:
  `proseComposed.walker` A0b, `proseCorpusBytes` RAW and GZIP, and `writerReach.walker` "the surfaceReach grammar
  round-trips…" is NOT expected here (that is the 4c unit's).
- `tests/domain/dailyLife*.test.js` and `tests/data/dailyLife*` (whatever exists) and every test file that names
  `commonerResentments` or `HOUSE_FAMILIES` (grep `tests/`), one run.
- eslint on the touched src files.
- The ledger ref must exist locally: `git rev-parse --verify review-fixes-2026-07-08` (it does).

## Report (at most 250 words)
The commit sha(s); the red titles; the counts of each run (files, tests, failed by name); each register row that
left; whether the atom stayed. Never print a log whole.

Files you may read: this brief, `B-BUILD-COMMON.md`, the files named above, the walkers that red, their registers.
