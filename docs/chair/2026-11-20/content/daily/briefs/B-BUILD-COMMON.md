# DAILY-1 · THE BUILD'S COMMON LAW (every build builder of DAILY-1 reads this first; then its unit brief)

Checkout: your own git worktree of branch `lane/daily-1-2026-11-20` cut by DAILY-1 (the unit brief names its path and
branch, `lane/daily-1-2026-11-20-b<n>`); `node_modules` is a symlink to `/home/user/settlement-engine/node_modules`.
Read whole, once: `CLAUDE.md`; `briefs/LINES-COMMON.md` (its rules 1 to 8 bind the code too); `src/domain/dailyLife.js`;
`src/kernel/proseHash.js`; your unit's LINES file and the chair's rulings on it quoted in your unit brief (a ruling
outranks the LINES file). The slots are DERIVED AT READ (never stored): no born record, no golden moves.

THE SHAPE (one for every slot):
1. EVERY NEW POOL IN ITS OWN NEW DATA FILE under `src/data/dailyLife/` (one file a slot, frozen arrays of
   `{ text, needs: [...] }` a branch, index 0 = today's text where it is kept). No pool text in `dailyLife.js`.
2. NEEDS are evaluated by ONE new module `src/domain/dailyLife/dailyLifeNeeds.js :: needsHold(record, needs)` reading only
   fact homes under `src/domain/facts/` (and the named fields the LINES files list where no home answers). A need
   name with no evaluator THROWS in tests (no silent false). No need may read a hideable house
   (`src/domain/people/cardVeil.js :: isHideableHouse`) or a crime fact: a test walks every pool's needs and reds on one.
3. THE PICK: `pickVariantMixed(eligible, \`${record.name}::dailyLife.<slot>::<branch>\`)`; no new draw; a nameless record
   picks index 0 of the eligible list. A house a wording names goes through
   `src/domain/display/institutionSentenceNoun.js :: institutionSentenceNoun` with "the" before it, from the LIVE,
   non-hideable, non-access-only roster.
4. A slot with no true line is the EMPTY string (ruling 18:19).
5. REGISTRATION: find how the presumption / fact-layers walkers reach pools (`tests/lint/factLayers.shared.mjs ::
   corpusPools`, `scripts/fact-layers-door.mjs`) and register each new data file THERE BY DECLARATION (never an
   exemption). If a walker cannot reach `src/data/dailyLife/`, say so and write the rows SAME-1's hand list
   (`samenessHideable.handPools.json`, not on this base) will need, in your report, for the join.
6. WHAT MOVES BY ITS OWN DOOR in your commit: `tests/domain/dailyLife.test.js` regex pins (re-read, not loosened to
   pass: a pin that guarded a meaning keeps that meaning); `tests/lint/presumptionClasses.register.json` and
   `presumedThings.widened.register.json` rows for `dailyLife.js` (regenerate by their own script, never by hand: find
   it). THE EDGE BUNDLE (`aiGroundingBundle` source hash) IS NOT REBUILT: the chair does it at the close; its
   freshness test reds and you say so.
7. RED FIRST: each unit's red is written and run BEFORE the code change, its failing title and its failing line
   recorded in the commit message; then green.
8. GREEN AT YOUR COMMIT, every run to a file, read by its count lines via `sh scripts/gate-tail.sh <command>` (never
   through a pipe): your test files; `tests/domain/dailyLife.test.js`; every test file that imports `dailyLife.js`
   (grep); `npx eslint` on the touched files; `npm run typecheck:ratchet`; `npm run typecheck:domain:strict`; every
   heavy run through `scripts/gate-mutex.sh` (read its usage). NEVER the whole suite, NEVER `npm run check`, never a
   census (the lighting and wiring censuses are DAILY-1's). No test run with GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE,
   GIT_COMMON_DIR, GIT_OBJECT_DIRECTORY or GIT_PREFIX in the environment.
9. COMMIT on your branch by explicit paths, the receipts in the message (red title + failing line, green counts), the
   author as configured (Claude <noreply@anthropic.com>) and these two trailer lines at its end:
   `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` and
   `Claude-Session: https://claude.ai/code/session_019yED1PbWpqcpuYta68kBgG`. You do NOT push (DAILY-1 pushes).
10. Touch nothing under `src/components/`, `src/pdf/`, `supabase/`, `tests/security/`, `src/generators/`. A need you
    cannot meet without one of them: STOP and say so.
11. Your final message: at most 300 words plus one table: outcome first; commits; red (title, line) and green
    counts; what moved and by which door; what you could not do; one CONFIRMED-vs-PLAUSIBLE sentence.
