# DAILY-4 HAND-BACK (kept current at every push; a successor needs this file and the briefs only)

Seat DAILY-4 (session_01ACmDYaBKhNdEcUSm1G57q1), eighth chair session_01ACmDYY29VRchM87v1yhL9Q. Assignment:
`origin/lane/chair-2026-11-08:docs/chair/2026-11-21/eighth/prompts/DAILY-4.txt`. Predecessor: `DAILY-3-HANDBACK.md`
(its section 1 was this seat's brief; its sections 2 and 3 stand).

## 1. WHERE THE LANE STANDS (written 2026-11-22 21:05 UTC) — "DAILY-B", the lane's landing line
- `lane/daily-4-2026-11-22` (pushed with this file) = DAILY-3's hand-over b1bcb067d (+ its docs tip 9d8c0fb11) + (0a) L12
  cut + (0b) U4c, the PDF chapter + unit P, the page prints all its lines (the chair's E110) + THE LINE AT POINT 102
  (c1144ba18, merged b84c5eccc) + the registers by their doors + the owner's file. NOTHING IS BUILT AND UNMERGED.
  Builder branches (local only, merged): `-l12-wip` e52394c64, `-page-wip` 3f4442b81; DAILY-3's `-4c-wip` 5c5ab5466.
- THE UNITS, each red re-run by the seat, diff read once:
  (0a) 1387e6ec5: L12 ("The lord's steward is obeyed, but not much liked.") out of the legitimacy pool, named NOT BUILT
  for after the first deploy with E107's shape (`house: lord's steward` beside `office: lord's steward` and `sovereign`);
  the steward's answering row out of `registeredWords.js :: HOUSE_FAMILIES` (headman, reeve stay); the ATOM
  `office: lord's steward` STAYS, unused (no walker reds on it). Red 3 of 18.
  (0b) 86dc24708: the PDF's chapter 15 ("Identity & Daily Life", `IdentityDailyLife.jsx`; the file's header said 02, now
  corrected) prints the page's public lines, derived in the chapter, no audience (the owner-only slot never in the PDF).
  Red 2 of 2. Writer-reach by its door (E108) 8144c500b: one row, `yearsAgo on legacyAnnotations` dossier-pdf N to R; at
  the line's merge the line already reads that row R, so no row moves there (0ed34e8a6).
  (P) a28af1b74: `dailyLife.js :: DAILY_LIFE_PAGE_SLOTS` = the eight public slots in E110's order (outsider_impressions,
  dawn_work, food_culture, gathering_places, child_warnings, commoner_resentments, unspoken_topics, recent_changes); the
  tab and the PDF chapter read it; each line the sentence alone, no label (the three's form); the owner-only
  `commoner_resentments_dm` on the owner's own read only (`!publicDossier && !playerView`, `{ audience: 'owner' }`),
  after the public resentment, in `WhoRunsThisTownPanel.jsx`'s existing mark (`data-layer="dm"`, "For the DM only.");
  never in the PDF. Red 2 of 2. THIS UNIT IS WHAT MAKES THE PAGE WHOLE (DAILY-3.txt's unit 4, never done before it).
- THE LINE'S MERGE (b84c5eccc): NO SOURCE CONFLICT. Six conflicts, registers and stored rows: observed-shape readers
  e3dcf6b73 (rung 46; 1,553 to 1,551 identities, 2,215 to 2,208 findings: all in `dailyLife.js`, the lane's: `status on
  chains`, `outputs on chains` gone, `name on chains` 3 to 1); wiring census f18b17e90 (stamp only, 0 rows, 0 bytes);
  writer-reach 0ed34e8a6 (cohort 1,366, DARK 1,406, no row, no identity new; stamps only); lighting census 7db50552d
  (3,774 to 3,779: six lane test files added, one removed); `HAND_CEILING` 83 = 77 + the lane's six (both comments, the
  line's first; handPools 83 rows, the union); `phoneChromeFloor.census` /create, /settlements, /gallery moved +1 by BOTH
  sides, re-measured at the merged tree: 620, 863, 665 (never a sum).
- RULE 8 (COMMON-EIGHTH 14) AT 7db50552d (+ docs): THE DARK PROOF EQUAL: 900 births (M1's), sha256
  a54e0bb8df0390a9d6e5edc799d56a0781c55d12d27e80df17de87871f888acb at the line's tip and the lane's, every size equal
  (`owner/dark-proof.mjs`). ONE RUN of 685 test files (tests/lint, copy, store, architecture, docs whole; the 294 that
  name a changed module or exported symbol, kept 294 of 294: none is a births-road-only file; the lane's own 15; the
  three walkers): 8,740 tests, 6 RED, ALL ON THE LIST (proseComposed A0b; proseCorpusBytes RAW, GZIP; colourMarks4h;
  narrativeQualityCorpus x2). ROWS 61 AND 62 CURED: `tests/copy/voiceMechanics.test.js`, `tests/store/
  deadOperationRatchet.test.js` 40 of 40 green. ONE BUILD + `VERIFY_DIST=1 tests/build`: 623 tests, 15 red, all on the
  list. FIGURES, lane vs line, both built here: first paint 1,180,816 / 376,063 / 315,822 vs 1,184,741 / 376,987 /
  316,646 (-3,925 / -924 / -824: the entry chunk 489,170 to 485,043; PLAUSIBLY U4b's retired requestDailyLife leaving
  the eager store, `aiSlice.js` -244 lines); the worker 2,710,153 vs 2,709,263 (+890, NAMED for the owner); the engine
  chunk 932,369 equal. The office leaf is not in the entry chunk (its forms absent there). PDF (lazy): SettlementPDF
  194,667 to 194,977; pdfRender worker 3,024,568 to 3,116,415.
- THE OWNER'S FILE: `owner/OWNER-FILE.md` (with `owner/before.md`, `owner/after.md`; the page's six places before and
  after; the chair's preview `owner/PREVIEW-E110.md`).
- MEASURES ASKED (900 births, `hxd-<size>-0..149`): each slot's commonest sentence by size, at most 14% (metropolis
  resentments); "People do as the Headman's Authority says, but few of them think well of it." 0, 2, 1, 0, 0, 0% (the
  L5 frame with any body 13, 9, 7, 7, 3, 1%); "Ask who decides things here, and a visitor hears more than one name."
  0, 1, 11, 9, 11, 5%. `secondMentions` / `personMention`: no Daily Life file reads either.
- NEXT: the chair's landing of DAILY-B. A red at the landing's step f or in CI is this lane's first unit.

## 2. RULINGS IN FORCE FOR THIS SEAT (each the chair's)
1. E107/E108: L12 cut, named for after the first deploy; 4c's writer-reach row re-frozen by its door.
2. E110: the page prints the eight in the ruled order; the owner-only line on the owner's read only, the existing mark;
   never in the PDF. 18:15: the order confirmed; the tab's line form (no label) kept.
3. The chair's 18:59: merge point 102 after unit P, once; rule 8 once.

## 3. FOR THE CHAIR (open, named only)
- The sameness census's stale "Generate Daily Life: Narrative refinement" row: still in `scripts/census/sameness-census.register.json` (DAILY-3's note: its door
  refused on a rise outside this lane, hamlet NPCsTab InfoPill shareAll 1.00 > 0.7). Untouched.
- `src/copy/en.js` `ai.dailyLife.*` keys: no reader in `src`. The owner's AI copy; untouched.
- The owner's: the server's AI daily-life function and its price row: untouched.
