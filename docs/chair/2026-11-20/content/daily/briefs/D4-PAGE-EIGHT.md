# D4-PAGE-EIGHT — DAILY-4's unit (P): the Daily Life page prints ALL its lines (the chair's E110)

Seat: DAILY-4 (branch `lane/daily-4-2026-11-22`). Builder branch: `lane/daily-4-2026-11-22-page-wip`, cut at the seat's
tip (L12 cut and 4c merged on it). Red-first commit(s) by explicit pathspecs; never `--no-verify`; no push. Read
`B-BUILD-COMMON.md` beside this file for the build laws; this file governs where it says more.

## Why
The first deploy's third condition is "THE DAILY LIFE PAGE PRINTS ALL ITS LINES" (the owner, 2026-11-22: "just skip that
step and have it generate with the rest of the dossier"). `deriveDailyLife` derives eight public slots and the
owner-only `commoner_resentments_dm`; the tab and the PDF chapter print only point 95's three
(`domain/dailyLife.js :: DAILY_LIFE_PAGE_SLOTS`).

## What changes (and nothing else)
1. `src/domain/dailyLife.js :: DAILY_LIFE_PAGE_SLOTS` becomes the EIGHT public slots in THE CHAIR'S ORDER (E110; not the
   table's own order): `outsider_impressions`, `dawn_work`, `food_culture`, `gathering_places`, `child_warnings`,
   `commoner_resentments`, `unspoken_topics`, `recent_changes`. Its comment says the order is the chair's E110 (a
   newcomer's eye first, what lies beneath next, what is new last). Never the owner-only slot in it.
2. `src/components/new/tabs/DailyLifeTab.jsx`: prints every slot of `DAILY_LIFE_PAGE_SLOTS` (it already reads it), each
   from the document the page is handed; a slot with no line prints NOTHING (no empty row, no label alone). EACH LINE
   PRINTS IN THE FORM THE TAB USES TODAY FOR ITS THREE (the sentence alone in the `daily-life-engine` box, no slot label:
   verify and say so); the five new ones follow that same form. The chair confirmed the order (18:15 UTC). The stale
   comment ("The other five slots join when built") is corrected.
3. THE OWNER-ONLY LINE: on the tab ONLY where the read is the owner's own (`!publicDossier && !playerView`), derived with
   `deriveDailyLife(r, { audience: 'owner' })` (or the slot's own derivation with that audience, whichever the module
   exports; say which), printed as ONE line DIRECTLY AFTER the public resentment's line (or where that line would be,
   if the public slot is empty), MARKED by the dossier's EXISTING owner-only mark (find it: e.g. the `data-layer="dm"`
   box and muted "For the DM only" line of `tabs/WhoRunsThisTownPanel.jsx`, or a shared component the tabs use; name
   what you chose and where it is used already). NO NEW STYLE. If no reusable mark exists, STOP and report before
   inventing one. Never on `publicDossier`, never on `playerView`, never in the PDF (E59 stands: the chapter passes no
   audience).
4. The PDF chapter (`src/pdf/sections/IdentityDailyLife.jsx :: dailyLifeLinesOf`) already reads
   `DAILY_LIFE_PAGE_SLOTS`: it prints the eight with no edit; verify.
5. Tests: `tests/pdf/dailyLifeChapterLines.test.jsx` (4c's) is the PDF differential and keeps passing (its tab read is
   the `daily-life-engine` box's `p` lines: if the owner-only line sits inside that box on the default — owner — read,
   the differential must compare the PUBLIC lines; keep the owner-only line OUTSIDE the box's `p` set or adjust the
   test's reader with a comment, and say which). Any existing tab test pinning three lines
   (`tests/components/dailyLifeAutomatic.test.jsx` and whatever greps find) is re-pointed BY CAUSE, never loosened.

## Proof
- RED FIRST, one new test file `tests/components/dailyLifePageEight.test.jsx` (a name OUTSIDE the mutation manifest's
  pattern: census|scan|baseline|ratchet|walker|killlist|parity|coverage|governance|freshness|integrity|exhaustiveness|
  roundtrip|golden|contract|pin), over at least 30 births, five a size (4c's recipe, seeds `d4p-<size>-<i>`):
  (a) the page's printed public lines EQUAL the eight derived, non-empty, in E110's order;
  (b) the owner-only line PRESENT on the owner's read wherever `deriveDailyLife(r, { audience: 'owner' })` carries it
      (force it as `tests/pdf/dailyLifeChapterLines.test.jsx` (b) does, or `tests/domain/dailyLifeOwnerSlot.test.js`),
      directly after the public resentment, carrying the mark; ABSENT (its text nowhere in the container) on
      `publicDossier` and on `playerView`; non-vacuous (the count of places carrying it > 0);
  (c) the PDF chapter's lines equal the tab's PUBLIC eight (or say that 4c's test (a) already proves it at eight).
  Run on the base (src unchanged): red, titles and counts said. Then green.
- `tests/lint` WHOLE after the change (COMMON-EIGHTH 11; through the mutex, to a log, never a pipe). Known reds on
  the lane: `proseComposed.walker` A0b, `proseCorpusBytes` RAW and GZIP. Every failing title BY NAME.
- `tests/components/dossierPhoneFloorAllViews.test.jsx`, `tests/components/publicProseEquality.test.jsx`,
  `tests/components/publicProseVeilInvariance.test.js` (find their real paths) WHOLE; if the taller tab moves the
  phone floor's stored rows, re-take them ONLY BY THEIR OWN DOOR and name each row and its cause.
- `tests/pdf` whole; every test file under `tests/` naming `DailyLifeTab`, `DAILY_LIFE_PAGE_SLOTS`, `dailyLife.js`'s
  changed export, or `IdentityDailyLife`: one run, counts said.
- `tests/copy/voiceMechanics.test.js` (no em dash or banned literal enters `DailyLifeTab.jsx`), eslint on touched files,
  `npm run typecheck:ratchet` and `npm run typecheck:domain:strict` (their ceilings unmoved).
- NO build by the builder (the seat builds once, after).

## Report (at most 300 words)
Commit sha(s); the red titles and counts; each run's counts and failing titles by name; the mark chosen; whether the
owner-only line is inside the engine box; any stored row re-taken and its door. Never print a log whole.

Files you may read: this brief, `B-BUILD-COMMON.md`, the files named above, the tests that name them, the walkers that
red and their registers.
