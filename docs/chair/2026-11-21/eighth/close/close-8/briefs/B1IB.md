# BRIEF: B1(i)b, THE FURRIER'S DISTRICT LIVES ON WHAT ITS LODGE LIVES ON (the tenth chair's R24r 6; for POINT 119). ONE BUILDER.

## THE RULING (R24r 6, verbatim in substance)
"THE HUNTER'S LODGE'S SUCCESSOR, 'Furrier's district', IS NOT WITHHELD (18 of 40 desert cities and metropolises hold it with no
hunting grounds and no fur import): not a regression of 117; a unit for 118 ('B1(i)b': the successor lives on what its lodge lives
on; red first; the every-birth census arm)." G45 placed it first among point 119's units.
B1(i) (on the line since point 117) is "the land withholds a house: the desert withholds fish, timber, game"
(`src/domain/landWithholding.js`, read by the institution step; lazy-pinned in `vite.config.js :: FIRSTPAINT2_LAZY_DOMAIN`). A
Hunter's lodge in a city or metropolis is succeeded by a "Furrier's district" (find where: the catalogue's tier/succession rows),
and the successor is not asked the lodge's question.

## WHAT TO DO (THE FORM OF EVERY UNIT: measure first, red first, the rule a check over every birth)
1. MEASURE on C and V (plans: `close-8/tools/make-plan.mjs`, `make-visitor-plan.mjs plan-lit.json`; births by `close-8/tools/
   births.mjs` with a measure module of your own): every birth holding a Furrier's district; of them, those with no hunting ground
   (the native ground keys the lodge reads) and no fur/game import; by size and terrain, three seeds each. Read the CAUSE in the code:
   where the lodge is withheld, where the successor is placed, why it skips the rule.
2. RED FIRST: a test that fails on the base for the fault, on named births.
3. THE CURE: the successor is withheld exactly where its lodge would be (the same predicate, ONE home: the successor asks
   landWithholding's own question; no second copy of the rule, no new table of names; a row is read by its catalogue id, never by
   its display name). No other house moves. No draw moves beyond what removing the house itself moves (say what moves).
4. THE RULE AS A CHECK OVER EVERY BIRTH of C and V, with an oracle INDEPENDENT of the leaf (the raw config's native grounds and the
   economy's imports against the roster): faults before -> 0 after. Records moved by field (`close-8/tools/measure-keys.mjs`),
   every moved field named with its cause; the battery's page moves on C and V if cheap (`close-8/tools/page-battery.mjs`).
5. A SAVED TOWN must not change (D13's principle, G45): the withholding happens at birth and a stored record is never re-dealt:
   show that a record born on the base and loaded on your tip is unchanged (the load/normalize path), or say why it cannot be.

## WHERE
- Worktree `/home/user/wt/b1ib`, branch `lane/close-8-2026-11-25-b1ib-wip`, cut by CLOSE-8 at the join's tip 3836a832e3;
  node_modules and `.husky/_` linked. Commit there by explicit paths. DO NOT PUSH.
- Files: `src/domain/landWithholding.js` and the site that places the successor (name it), a new or existing test, the lighting
  census by its door if a new test file changes its count (its own commit:
  `LIGHTING_CENSUS_REFREEZE='CLOSE-8-B1IB' LIGHTING_CENSUS_NOTE='B1(i)b' npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js`,
  red by design, then green without the env), the mutation manifest row if the test's basename or directory requires one. A file
  under `src/domain/display/gallery*`, `src/lib/gallery*`, `supabase/`, the simulator, the map or advance time: STOP.
- Measures: `/home/user/settlement-engine/docs/chair/2026-11-21/eighth/close/close-8/b1ib/` (raw data as *.jsonl).

## LAWS
- Every heavy run through `GATE_MUTEX_MAX_POLLS=40000 sh scripts/gate-mutex.sh --run -- <cmd> > <log> 2>&1; echo "exit=$?" >> <log>`;
  logs by tail/grep; never a gate through a pipe. Hooks never bypassed. First paint: `landWithholding.js` is lazy-pinned; an eager
  import of it is a STOP. Before green: both typechecks (167, 1113); your tests; `tests/copy` whole; `tests/lint` whole (known reds:
  proseComposed A0b, proseCorpusBytes RAW and GZIP). No golden, register (other than lighting by its door) or budget re-recorded;
  goldens your unit moves are NAMED. A permission refusal stands: report it, try nothing else.

## REPORT (at most 300 words + one table) as your final answer
The measure (counts by size/terrain, seeds, the cause read); red before/green after; the every-birth check before/after on C and V;
records moved by field; the saved-town proof; gates; goldens named.
