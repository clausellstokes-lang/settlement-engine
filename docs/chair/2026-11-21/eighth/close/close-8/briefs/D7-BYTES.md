# BRIEF: D7's BYTES (CLOSE-8's cure 3c; the tenth chair's G24). ONE BUILDER. A UNIT OF SOURCE (build config).

## THE CHAIR's WORDS
G24: D7 (BIRTH-1, `lane/birth-1-2026-11-25-d7-wip` 710a49473) raised first paint raw 1,181,337 -> 1,187,083 (+5,746; gzip +1,646;
Brotli +1,409) and the worker +3,221 (at D7's base): `factsOf -> crisisBody -> people/stressPowerFaces` brings the face table
(`src/data/stressPowerFaces.js`, through `src/domain/people/stressPowerFaces.js`) into the eager chunk. "No second home for the
names; SIZE-BACK's method (the lazy-domain list, behaviour proven unchanged) is tried on it; the rest is named for the owner's size
signing." START-CLOSE-8 (3c): "SIZE-BACK's method (vite.config.js's lazy-domain list; behaviour proven unchanged: no reader on the
eager path) tried on `src/domain/facts/crisisBody.js` and the face table; what it does not buy back is named with its figure."

## THE PRECEDENT (read it, no wider)
SIZE-BACK b67b29cdc (on the line): `git show b67b29cdc -- vite.config.js` and its message; it put `landWithholding.js` (and
looked at `foodProduction.js`) on `vite.config.js :: FIRSTPAINT2_LAZY_DOMAIN`, as A1's `sickCare.js` was, and proved: (1) the five
build figures before and after; (2) `VERIFY_DIST=1 npx vitest run tests/build` whole with only its listed reds (the same reds
before and after); (3) BEHAVIOUR UNCHANGED: the first reader of each file on a page named, and its lazy chunk shown loaded before
that reader runs (a first render that lacks the fact for one frame is a fault, not a saving). If a file has a reader on the eager
path that cannot wait, that half is NOT built: say which and why.

## WHAT TO DO
1. Measure first, in the worktree as cut (the join with D7 in it): `npm run build` (through the mutex) and the five figures (first
   paint raw/gzip/Brotli, the generation worker, the engine chunk) as `VERIFY_DIST=1 npx vitest run tests/build/vendorPdfLazy.test.js
   tests/build/generationWorkerLazy.test.js` reports them (read those two tests' headers for where each figure prints).
2. Find every importer of `crisisBody.js` and of the face table modules (`git grep`), and the path that makes them eager.
3. Try the method: the lazy-domain list (and `factHomesLazy`'s guarded list if the precedent shows it is needed). Re-build;
   re-measure; prove behaviour (3). No second home of any name or table; no code moved between files unless the precedent did so.
4. If the method cannot buy back some or all of the bytes without an eager reader waiting, build nothing for that part and name
   it with its figure.

## WHERE
- Worktree `/home/user/wt/d7-bytes` on branch `lane/close-8-2026-11-25-d7-bytes-wip`, cut by CLOSE-8 at the JOIN's tip (D7 in it);
  node_modules and `.husky/_` linked. Commit by explicit paths. DO NOT PUSH.
- Files you may change: `vite.config.js`, and a lint/build test's guarded lazy list ONLY if the precedent changed the same list.
  Anything else: STOP and report.
- Measures: `/home/user/settlement-engine/docs/chair/2026-11-21/eighth/close/close-8/d7-bytes/` (uncommitted).

## LAWS
- Every build and vitest run through `GATE_MUTEX_MAX_POLLS=40000 sh scripts/gate-mutex.sh --run -- <cmd> > <log> 2>&1; echo
  "exit=$?" >> <log>`; logs read by tail/grep; never a gate through a pipe; one heavy run at a time.
- NEVER `npm run build:edge-shared` (the chair's order: once, at the very end of the program).
- The hooks are never bypassed. Typechecks (`npm run typecheck:ratchet`, `npm run typecheck:domain:strict`: 167 and 1113) in the
  worktree before green; `tests/lint` whole if a test file changed.
- No budget, golden or register re-recorded. A permission refusal stands: report it, try nothing else.

## REPORT (at most 300 words + one table), also to `d7-bytes/REPORT.md`
The commit; the five figures before/after with the budgets; `tests/build` reds before/after by name; behaviour proof; what is not
bought back, with its figure.
