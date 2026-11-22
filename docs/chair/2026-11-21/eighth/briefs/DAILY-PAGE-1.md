# DAILY-PAGE-1: the Daily Life page prints the engine's own lines, and its button goes (the eighth chair's brief for ONE builder; written 2026-11-22 04:39 UTC)

## The owner's order, verbatim (the whole message, 2026-11-22, received between 04:31 and 04:34 UTC)
"So, remove the button prompt for Daily life and simply generate it automatically. The original design was for an ai
synthesize through that button. But since we scrapped that, just skip that step and have it generate with the rest of
the dossier."

## What the chair told him it means (he may veto any line of it)
- NO BUTTON, no "save to enable" line, no credits on the Daily Life page. The engine's own Daily Life lines print as
  soon as the dossier opens, for every place, saved or not: the three rebuilt lines on the line since point 90 (how the
  day starts, where people gather, what children are warned about). The other five join the same block when built.
- An AI-written daily-life account ALREADY SAVED on a settlement still prints, read-only (nothing a user paid for
  disappears). No way to make or re-make one remains on the page.
- THE SERVER IS NOT TOUCHED: no edge function, no pricing row, no migration, no store action is removed by this unit.
- THE PDF chapter is NOT built by this unit: you REPORT what it prints today and what would move (below).

## Where you work
- ONLY in `/home/user/wt/dailypage`, the worktree of `lane/daily-page-1-2026-11-22`, cut from the working line at
  f5295e425. `git rev-parse HEAD` must begin f5295e425 and `git status --short` must print nothing when you start.
- YOU PUSH NOTHING, merge nothing, open no pull request, check out no other branch, never reset, clean or stash.
  Never `npm run check`, never the whole suite, never `--no-verify`. Commits by explicit paths.
- Every test or build run goes `sh scripts/gate-mutex.sh --run -- timeout <seconds> <command> > <log> 2>&1; echo "exit=$?" >> <log>`,
  never through a pipe; read a log by `tail` and by its count lines. Vitest runs also write
  `--reporter=default --reporter=json --outputFile=<scratch>/<name>.json`. `--maxWorkers=3`.
- Scratch: `/tmp/claude-0/-home-user-settlement-engine/8cf8a422-746a-5d9a-aaf1-7aea4ebc1089/scratchpad/dailypage/`.
- Read first, and no wider than you need: CLAUDE.md; `src/components/new/tabs/DailyLifeTab.jsx` WHOLE;
  `src/components/new/dailyLifeLogic.js`; in `src/domain/dailyLife.js` the header and `deriveDailyLifeSlot`;
  `src/components/OutputContainer.jsx` around `executeAiAction` and the `daily_life` case;
  `src/components/dossier/DossierAiConfirms.jsx`; the tests your grep finds for the names below.
- The last two lines of every commit message, after a blank line:
  `Co-Authored-By: Claude Fable 5.2 <noreply@anthropic.com>`
  `Claude-Session: https://claude.ai/code/session_01ACmDYY29VRchM87v1yhL9Q`
  Every hour you write in a file is read from `date -u` in the command that writes it. No model name in any file.

## COMMIT 1: the page (red first)
1. RED FIRST: a new test `tests/components/dailyLifeAutomatic.test.jsx` (jsdom), on six born places, one a size (the
   recipe other component tests use: `birthConfig` and `generateSettlementPipeline`; say the seeds): (a) with NO
   interaction the page holds the text of `deriveDailyLifeSlot('dawn_work', record)`, of `'gathering_places'` and of
   `'child_warnings'`, in that order; (b) no control and no line offers to make a daily-life account: no
   `daily-life-offer`, no text "Generate Daily Life", saved or unsaved (`saveId` given or null); (c) on a shared read
   (`publicDossier`, and `playerView`) rendered from `toPublicSafe(record)`, the three texts printed are those derived
   FROM THAT DOCUMENT (`deriveDailyLifeSlot(key, toPublicSafe(record))`), never from the owner's record; say for the six
   whether any differs from the owner's and why; (d) mounting the page calls `requestDailyLife` never (a spy on the
   store's action). Show it red on the untouched tree.
2. `DailyLifeTab.jsx`: REMOVE the offer paragraph and the Button, `generate`, and every state, hook, label and
   message that served only them (the cost resolver, the loading and progress and error state, `LOAD_MSGS`, the
   keyframes). ADD, in the place the button held: the three lines, each non-empty text its own paragraph, in the
   parchment box and type the narrative used; order `dawn_work`, `gathering_places`, `child_warnings`; NO heading and
   no label (each sentence names its own subject); a slot whose text is empty or "—" prints nothing; where all three
   are empty the box is absent. They are derived from the settlement THE PAGE IS HANDED (`r`), once per render pass
   (memoised on `r`). KEEP, below them and unchanged in look, the saved AI account where the store holds one
   (`aiDailyLife`, through `formatDailyLifeResult`), read-only: no regenerate, no overlay.
3. `OutputContainer.jsx` and `DossierAiConfirms.jsx`: the page is no longer handed `onRequestDailyLife`; remove the
   `dailyLife` branch of the confirm flow ONLY IF nothing else reaches it (say what you found). The store's
   `requestDailyLife` action and `operationRegistry`'s row STAY (dead for now; listed for the owner's close).
4. Every test that pinned the button, the offer or their words is brought to the new page BY ITS OWN MEANING (a test
   that proved "the offer names only houses the place has" has lost its subject: remove it and say so; a walker that
   counts the page's lines is re-recorded by ITS OWN DOOR with the count before and after). A register moves only by
   its own door; a shrink-only door is raised by nobody; a stored hash of a page or a PDF snapshot that would move is
   NOT re-recorded: name it and leave it red.
5. GREEN: the new test; `tests/components`, `tests/ui` and `tests/pdf` whole; every test file anywhere under
   `tests/` that names `DailyLifeTab`, `dailyLifeLogic` or `OutputContainer`; `tests/lint` whole;
   `npm run typecheck:ratchet`; `npm run typecheck:domain:strict`; `npm run lint`. Failing rows BY NAME against
   `/home/user/wt/chair/docs/chair/2026-11-20/seventh/ci/RED-AT-LINE.tsv` (file and title): a red not on it is yours
   to cure or to report, never to skip.
6. FIRST PAINT, by ONE build after the change (`npm run build`, then `VERIFY_DIST=1 npx vitest run tests/build/vendorPdfLazy.test.js tests/build/generationWorkerLazy.test.js`):
   the three first-paint figures (raw, gzip, Brotli), the worker's and the engine chunk's, beside the line's
   1,179,511 / 375,172 / 315,169, 2,671,005 and 926,608. NOT ONE BYTE UP in first paint: if it rises, itemize file by
   file, change nothing more, and report: the chair rules.

## COMMIT 2: what no longer prints (only if commit 1 is green)
The local narrative (`buildLocalDailyLifeNarrative`, `DAILY_LIFE_LOCAL_CRISIS_SCOPED`, its helpers) and the offer line
(`dailyLifeLogic.js :: dailyLifeOfferLine`) print nowhere after commit 1. Remove them WITH their declarations
(`docs/census/declarations/DAILY_LIFE_TAB.json` and whatever ledger holds the offer line) and re-take each census or
register that counted them BY ITS OWN DOOR, naming every row that leaves. IF THIS TURNS OUT WIDER THAN ABOUT TEN FILES
or needs a door you cannot run cleanly, STOP after commit 1 and report what commit 2 would touch: the chair decides.

## REPORT ONLY, build nothing: the PDF
What does chapter 02 (`src/pdf/sections/IdentityDailyLife.jsx`, `vm.daily` in `src/pdf/lib/viewModel.js`) print for
daily life today, with and without a saved AI account? What would printing the same three lines there touch (files,
and WHICH stored snapshots or goldens would move, by test file and title)?

## Your final message (at most 400 words and one table)
The commits; red first (the count before and after); the green runs as counts; every test you removed or re-pointed,
one line each with why; every register moved, by its door, with before and after; the size figures beside the line's;
(c)'s answer for the six places; the PDF report; anything the brief did not settle. Say CONFIRMED for what you
executed and PLAUSIBLE for what you only read. If your own permission check refuses a command, the refusal stands:
say which command and stop there.
