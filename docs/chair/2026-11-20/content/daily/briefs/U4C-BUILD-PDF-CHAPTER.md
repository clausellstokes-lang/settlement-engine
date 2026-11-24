# DAILY-3 · U4c — THE PDF'S CHAPTER 02 PRINTS THE PAGE'S DAILY LIFE LINES (the chair's E59, 2026-11-22 08:28 UTC)

Read whole, once: this file; `measures/U4C/REPORT.md` and `measures/U4C/prototype.patch` (paths under
`docs/chair/2026-11-20/content/daily/`); `CLAUDE.md`; `src/components/**/DailyLifeTab.jsx` (its `ENGINE_SLOTS` and
`engineLines`); `src/pdf/sections/IdentityDailyLife.jsx`; `src/pdf/SettlementPDF.jsx`; `src/pdf/lib/viewModel.js ::
dailySlice` (read; NOT changed). Nothing wider than these and the tests you run or add.

## Where you work
Worktree and branch named by DAILY-3 at dispatch (`lane/daily-3-2026-11-22-4c-wip`), cut from the lane AFTER the working
line's merge (the page of point 95 on it). Trailer `Claude-Session: https://claude.ai/code/session_01ACmDYYZpEdm9Ag2ikDGTf9`.
You commit; you do NOT push or merge.

## The ruling, exactly (E59)
1. DERIVE IN THE CHAPTER (`SettlementPDF.jsx` or `IdentityDailyLife.jsx`), NEVER in `viewModel.js :: dailySlice`: one home
   for the derivation (`domain/dailyLife.js :: deriveDailyLife` / `deriveDailyLifeSlot`), two callers (the tab, the
   chapter). The slot order is the TAB'S OWN (`ENGINE_SLOTS`): import it or a shared constant from ONE home, never a copy
   (A LITERAL HAS ONE HOME); if sharing needs a new tiny module, it lives beside the derivation, lazy, and you say so.
2. The PUBLIC slots only, in that order, a slot empty or "—" dropped; NO audience is passed: `commoner_resentments_dm`
   never prints in the PDF, whatever record it is handed.
3. The food-balance callout UNCHANGED; a saved AI account keeps today's rule (visible, read-only).
4. RED FIRST, then green: (a) a DIFFERENTIAL test: for the same records (5 a size, or an existing fixture), the chapter's
   printed Daily Life lines EQUAL the tab's `engineLines`; (b) a PIN: the chapter prints no owner-only slot (hand it a
   record whose owner read carries a non-empty `commoner_resentments_dm`, e.g. criminal opportunity forced high as
   `tests/domain/dailyLifeOwnerSlot.test.js` does, and assert that text appears nowhere in the rendered chapter).
5. GREEN: your tests; `tests/pdf` WHOLE; `tests/components` WHOLE; every test naming `IdentityDailyLife`, `SettlementPDF`,
   `DailyLifeTab` or `dailyLife` (grep); `tests/lint` WHOLE; eslint; both typechecks. Every heavy run through
   `sh scripts/gate-mutex.sh --run -- <cmd>` to a file. The goldenViewModel snapshot must HOLD; a stored snapshot that
   moves is NAMED and LEFT RED (never re-recorded) and you STOP and report it. Known reds not yours: those on
   `RED-AT-LINE.tsv` (DAILY-3 gives you the list file's path at dispatch).
6. BYTES: no eager byte (`EAGER_FIRST_PAINT_MODULES` unchanged); DAILY-3 builds and measures the PDF's size and first paint.

## Files you may touch
`src/pdf/sections/IdentityDailyLife.jsx`, `src/pdf/SettlementPDF.jsx`; the tab's `ENGINE_SLOTS` export only (no other
line of `DailyLifeTab.jsx`); your NEW test file(s) under `tests/pdf/`. Nothing under `src/domain/`, `src/data/`,
`supabase/`, `tests/security/`; no register.

Final message: at most 200 words plus one table: commit shas; red (titles, lines) and green counts with `tests/lint`
whole's failing titles by name; what moved; anything left red by rule 5.

## DAILY-3's ruling at dispatch (the builder's stop: `tests/architecture/layerBoundaries.test.js` holds `src/pdf` at zero
imports from `src/components`)
The slot order's ONE home is `src/domain/dailyLife.js` itself: one exported frozen constant (`DAILY_LIFE_PAGE_SLOTS`)
beside `DAILY_LIFE_EMPTY_SLOT_TEXT`; the tab's `ENGINE_SLOTS` becomes that import; the chapter imports it with
`deriveDailyLifeSlot`. The file list gains `src/domain/dailyLife.js` for that constant only; the layer arm is not widened;
`tests/architecture` whole joins the green set.
