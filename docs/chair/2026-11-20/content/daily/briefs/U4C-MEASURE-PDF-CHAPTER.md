# DAILY-3 · U4c-M — MEASURE FIRST: what moves if the PDF's chapter 02 prints the page's Daily Life lines

A MEASURE, not a build: nothing is committed to `src/` or `tests/`; your one deliverable is a report file.

## Where you work
- Worktree `/home/user/wt-daily3-4c`, DETACHED at b03a31560 (`lane/stack-96-wip-2026-11-22`: the working line with
  points 94 to 96, the Daily Life page of point 95 included). `node_modules` is symlinked. You may edit files there
  freely to PROTOTYPE; you commit nothing there; at the end `git -C /home/user/wt-daily3-4c diff > <report dir>/prototype.patch`.
- Your report goes in `/home/user/settlement-engine/docs/chair/2026-11-20/content/daily/measures/U4C/REPORT.md` (+ the patch
  beside it). Write nothing else in `/home/user/settlement-engine`.

## The chair's word (the unit you measure for)
"THE PDF'S CHAPTER 02 (`src/pdf/sections/IdentityDailyLife.jsx`; `viewModel.js :: dailySlice`) prints the same public
lines the page prints, from the document the print is handed; the food-balance callout stays; a saved AI account still
prints where one is saved. MEASURE FIRST which stored snapshot or golden would move, by test file and title … a snapshot
that would move is named and left red, never re-recorded."

## What to do
1. Read whole, once: `src/components/**/DailyLifeTab.jsx` (how point 95 prints `ENGINE_SLOTS` from the document it is
   handed: the order, the empty-slot rule, the audience); `src/pdf/sections/IdentityDailyLife.jsx`; `src/pdf/lib/viewModel.js`
   (`dailySlice` and what calls it); how the PDF is handed its document (owner vs shared: find `toPublicSafe` or the
   audience on the print path). Say in the report which document the print derives from, with `path :: symbol`.
2. PROTOTYPE the smallest change that makes chapter 02 print the page's public lines in the page's order from that
   document (`deriveDailyLife(doc)`, NO audience: the owner-only slot never prints in a PDF unless the print path is the
   owner's and the chair rules it), keeping the food-balance callout and the saved AI account. Note the bytes: the PDF is
   lazy; say whether `dailyLife.js` or `src/data/dailyLife/*` would enter any EAGER chunk (read `vite.config.js ::
   FIRSTPAINT2_LAZY_DOMAIN` and the lazy-pdf build test's rule; no build needed unless you cannot tell).
3. RUN, through `sh scripts/gate-mutex.sh --run -- <cmd>` to a file (never through a pipe; one run at a time; the machine
   is shared with another builder): `tests/pdf` whole, and every test file under `tests/` that names `IdentityDailyLife`,
   `dailySlice` or `SettlementPDF` (grep), FIRST on the untouched tree (the baseline reds) and THEN with the prototype.
4. REPORT (at most 80 lines): which document the print derives from; the prototype in ten lines; EVERY test that goes
   red with the prototype and was green without it, by file and title, classed as (a) a stored snapshot or golden
   (name the stored file), (b) a pin of today's chapter text, (c) a real fault of the prototype; the baseline reds by
   name; whether any byte would go eager; anything the chair must rule (e.g. the owner-only slot in an owner's print).

Rules: CLAUDE.md binds. No GIT_DIR / GIT_WORK_TREE / GIT_INDEX_FILE etc. in a test's environment. Never `npm run check`,
never the whole suite. If your permission check refuses an action, the refusal stands: report the command and reason.
Final message: at most 200 words: the moved tests by class (counts and names), the document the print derives from, any
eager byte, what the chair must rule.
