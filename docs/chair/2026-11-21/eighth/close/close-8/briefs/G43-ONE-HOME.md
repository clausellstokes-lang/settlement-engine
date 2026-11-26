# BRIEF: G43, THE GRAZING FLAG'S ONE HOME (the tenth chair's ruling G43, 2026-11-26 00:28 UTC). ONE BUILDER. A CURE ON THE JOIN.

## THE FAULT (found by CLOSE-8's typecheck after merging E3 onto D3)
- D3 (BIRTH-1) added `src/generators/power/governanceLabelRoster.js :: governanceLabelRosterOf`, read by
  `src/generators/power/rulingStructure.js` where the sentence is re-written over the repaired roster
  (`projection.sentenceInstitutions`). It COPIED rulingStructure's inline flag in the OLD argument shape:
  `noGrazingQuarrel: noGrazingQuarrelOf({ institutionNames: instNames, pastoral: economicState?.foodSecurity?.chains?.['Pastoral & livestock'] === true, grounds: config?.nearbyResources })`
- E3 (WORDS-2) changed `src/data/powerSiblings.js :: noGrazingQuarrelOf` to `({ leadingFood, grounds, terrain, route })` and its
  one call in rulingStructure to
  `noGrazingQuarrelOf({ leadingFood: economicState?.foodSecurity?.foodRecord?.foodSources?.[0], grounds: nativeSemanticResourceKeys(config), terrain: config?.terrainType, route: config?.tradeRouteAccess })`.
- The merge is textually clean; `npm run typecheck:ratchet` reds +1 (TS2353) in governanceLabelRoster.js, and at run time D3's
  re-write path would undo E3's rule (G13; G19 (1): native ground keys only, no custom-content leak).

## THE RULING (verbatim in substance)
"THE CURE IS ONE HOME, NOT A SECOND COPY BROUGHT UP TO DATE. BUILD, as its own commit on the join: ONE function that computes the
flag from the birth's own inputs (config and economicState, exactly E3's arguments: `leadingFood` from
`economicState.foodSecurity.foodRecord.foodSources[0]`, `grounds` by `nativeSemanticResourceKeys(config)`, `terrain`, `route`), and
BOTH sites call it: `rulingStructure.js` (its inline expression leaves, which also gives that file back lines under its ceiling) and
`governanceLabelRoster.js :: governanceLabelRosterOf`. Its home: where both may import it without a new layer edge (say where and
why in the commit). PROOF: (1) a test that `noGrazingQuarrelOf(` is called from exactly ONE place in `src` (the walker's form the
repository already uses for a one-reader rule); (2) the two typechecks; (3) D3's and E3's own tests now."

## WHAT TO DO
1. Read whole, once: `governanceLabelRoster.js`, `data/powerSiblings.js`'s `noGrazingQuarrelOf` region and the file's header, the
   rulingStructure.js region around both call sites (and its imports), and one existing one-reader walker as the form (e.g.
   `tests/lint/beastsGradeOneReader.walker.test.js`). Check the repository's layer rules (a lint/architecture test on imports
   between `src/data`, `src/domain`, `src/generators`) before choosing the home.
2. Build the one function (a name that says what it is, e.g. `noGrazingQuarrelOfBirth(config, economicState)`), both sites
   calling it, rulingStructure's inline expression gone. Byte-for-byte the same flag E3's rulingStructure call computes today.
3. The one-call-site test (code lines only: comments and strings blanked, as the form does). If its basename holds a mutation-
   manifest word (walker, census, ...), add its manifest row (`kind: rationale`, as P9's beastsGradeOneReader row in
   `scripts/mutation-coverage-manifest.json`) with a planted-mutation proof executed (a second call planted, red; reverted, green).
4. Run: both typechecks (167, 1113); D3's tests (`tests/domain/powerSentenceSettledRoster.test.js`) and E3's
   (`tests/generators/bar8Powers.test.js`, `tests/generators/power/conflictLadderReadsRoster.test.js`,
   `tests/generators/power/tailPowers4Batch1.test.js`, `tests/generators/pressureHonoursNeeds.test.js`); your test; `tests/lint`
   whole (a test file changed): its known reds now are `proseComposed` A0b, `proseCorpusBytes` RAW and GZIP, `writerReach`
   (two frozen rows owed elsewhere), and the lighting census if your new test file changes its count: in that case re-take the
   lighting census by its door in a SEPARATE commit (`LIGHTING_CENSUS_REFREEZE='CLOSE-8-G43' LIGHTING_CENSUS_NOTE='G43: the one
   home's walker' npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js` through the mutex; it fails BY DESIGN on
   the refreezing run; re-run without the env: green) and say so.

## WHERE
- THE JOIN ITSELF: worktree `/home/user/wt/join`, branch `lane/close-8-2026-11-25-join`, at b0815cab58 (E3 merged). Commit there by
  explicit paths. DO NOT PUSH. No other unit's files: `src/generators/power/governanceLabelRoster.js`,
  `src/generators/power/rulingStructure.js`, the home you choose (a file of src that both may import, or a new leaf), your test,
  `scripts/mutation-coverage-manifest.json` (your row only), `tests/lint/.lighting-census-baseline.json` (by its door only).
  Anything else: STOP and report.
- Another builder works in `/home/user/wt/goals-i13` on goals.js: do not touch it.

## LAWS
- Every vitest/tsc run through `GATE_MUTEX_MAX_POLLS=40000 sh scripts/gate-mutex.sh --run -- <cmd> > <log> 2>&1; echo "exit=$?" >>
  <log>` (logs under `/tmp/claude-0/-home-user-settlement-engine/f9f37e55-dc9e-512d-9953-f1c7274d335f/scratchpad/g43-*.log`); read
  logs by tail/grep; never a gate through a pipe. Hooks never bypassed. No golden, register or budget re-recorded (the lighting
  census by its door, as above, is the one exception, ruled G42 (a)). A permission refusal stands: report it, try nothing else.

## REPORT (at most 250 words + one table) as your final answer
The commit(s) and the home with its reason; the one-call-site test and its planted proof; each run's count; anything you could
not do.
