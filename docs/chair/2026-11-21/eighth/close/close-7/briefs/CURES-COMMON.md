READS WHOLE: this file; the chair's ruling `docs/chair/2026-11-24/tenth/read/RULING-R24.md` on `origin/lane/chair-2026-11-08` (`git -C /home/user/settlement-engine show origin/lane/chair-2026-11-08:<path>`); the measure `docs/chair/2026-11-21/eighth/close/close-7/reports/READ-24.md`; your chain's brief; each src function you change or name as a cause (by symbol, the function whole, once). WINDOW: 1,000,000 tokens (the middle tier).

# CLOSE-7 — THE CURES' COMMON LAW (for both builder chains; written by CLOSE-7 on the tenth chair's RULING-R24)

THE RULING GOVERNS. Where this file and the ruling differ, the ruling wins; say so in your report.

## Where you work
- YOUR WORKTREE per unit, each on its own branch CUT AT THE FLIP'S COMMIT d447ee31e (already made by CLOSE-7, node_modules and
  `.husky/_` linked): A1 `/home/user/wt/a1` (`lane/close-7-2026-11-24-a1-wip`), A2 `/home/user/wt/a2` (`...-a2-wip`), B1(ii)
  `/home/user/wt/b1ii` (`...-b1ii-wip`), B1(i) `/home/user/wt/b1i` (`...-b1i-wip`). You COMMIT there, by explicit paths, the
  receipts in the message. YOU NEVER PUSH, never merge, never switch or create a branch, never touch another unit's worktree,
  `/home/user/wt/lit` (read and run only: the BEFORE tree) or the main checkout's branch. CLOSE-7 reads your diff and pushes.
- Scripts and small outputs: `docs/chair/2026-11-21/eighth/close/close-7/<unit>/` in the main checkout (CLOSE-7 commits them).
  Large outputs and logs: `/tmp/claude-0/-home-user-settlement-engine/264f2cd3-2300-5be6-af7e-6509ebfae300/scratchpad/<UNIT>/`.
  REPORT: `docs/chair/2026-11-21/eighth/close/close-7/reports/<UNIT>.md` (not committed by you).

## The two corpora (R24-0: EVERY measure and EVERY proof on BOTH)
- C, the census 900: seeds `dp-<size>-<i>`, i 0..149, six sizes, `birthConfig({ settType })` (`close-7/read24/make-plan.mjs`).
- V, the visitor 900: the same seeds, each born with its size's row of the chair's `plan-lit.json`
  (`close-7/read24/make-visitor-plan.mjs`: `{ ...DEFAULT_CONFIG, settType, _randomizePriorities: true }`).
- READ-24's tools are yours to reuse: `close-7/read24/measure.census.jsx` (records), `analyze.mjs`, and the sameness door's text
  render (`scripts/sameness-census.mjs --measure --plan=<file> --text`). READ-25 (chain two) commits a runner of the page
  battery over a plan under `close-7/read25/`: use it for every PATTERN proof once it exists.
- A cure's proof says, for C and V each: the count before (on `/home/user/wt/lit`), the count after (0), and WHAT ELSE MOVED (a
  per-birth record hash over the 900, before and after, the births that differ listed with what differs).

## The law of every cure
1. RED FIRST, by name: the test fails on the BEFORE tree on the births the ruling names, and passes after. A PATTERN of the page
   battery (`src/domain/coherence/pageCensusFindings.js`) where the ruling asks for one, bar zero: read how a pattern row is
   added and registered (`PAGE_CENSUS_ROWS`, `scripts/census/page-census.register.json`, `tests/components/pageCensus.walker.test.jsx`)
   and enrol it by the register's own door only; say what you did.
2. COMMON-RULES binds (the one door `drawDeclared.js` for pools; a new atom in `factVocabulary.js` is a row for a fact the record
   already holds, LISTED in your report; no new draw; no line copied as index 0 of a new pool; no "the town" of the place).
3. A changed line: grep `tests/` for its old words before the commit; a pin that names them is re-stated in the same commit by its
   cause. NO GOLDEN, reference snapshot, tuning signature or `.golden-freeze-register.json`-frozen file is edited: such an edit is
   DROPPED and named in your report (N6).
4. GATES, one heavy run at a time through the mutex (two builders share this box), to a log, read by `tail`:
   `GATE_MUTEX_MAX_POLLS=400 sh /home/user/settlement-engine/scripts/gate-mutex.sh --run -- <command> > <log> 2>&1; echo "exit=$?" >> <log>`.
   After a change under `src/data` or `src/domain`: `tests/copy` WHOLE. After any change to a test file: `tests/lint` WHOLE (its
   known three reds: `proseCorpusBytes` RAW and GZIP, `proseComposed` A0b). Your unit's own test files and every test file that
   names a file or exported symbol you changed (a grep over `tests/`; both counts said). Never `npm run check`, never
   `test:ratchet`. Run `git fetch origin review-fixes-2026-07-08 && git branch -f review-fixes-2026-07-08 FETCH_HEAD` in the
   main checkout only if `tests/lint`'s `ledgerCitationIntegrity` reds (it is set at 235efce1a now).
5. STOP AND REPORT (do not invent) where the ruling's premise is false, a cure would move a census birth the ruling says must not
   move, or a red appears that is not your unit's and not on the known list.
6. A PHASE THAT ENDS IN "SEND TO THE CHAIR" ENDS YOUR TURN: write the report, give your final message, and wait; CLOSE-7 resumes
   you with the chair's word.
7. FINAL MESSAGE per phase at most 200 words: what was done, the counts before/after on C and V, the commit, what CLOSE-7 must
   send or rule; CONFIRMED vs PLAUSIBLE in one sentence. Everything else in the report.
