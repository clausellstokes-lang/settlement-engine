# BRIEF CLOSE-FIXTURE: THE HOME PAGE'S SAMPLE TOWN IS BORN ON THE BUTTON'S ROAD (CLOSE-1; written 2026-11-22 08:21 UTC, read from `date -u`)

THE CHAIR'S RULING E55 (2026-11-22 08:20 UTC): a unit that LANDS, before the flip, as "CLOSE-FIXTURE <commit>" (or with
JOIN). The fault (CONFIRMED by CLOSE-1, `close/measures/LANDING-FIXTURE-PROBE.md`): `scripts/generate-landing-fixture.mjs`
births with `generateSettlementPipeline(forgeConfigFor(st), …)` WITHOUT `birthConfig`; the live "Forge this exact town"
road (`src/store/settlementGenerateAction.js :: generateSettlementAction`) births THROUGH `birthConfig`. Dark, the two
births of seed `lf-033` differ only in `config`/`_config` (the lit density and living-content markers); with the seat
and fortune dials lit they differ in economicState, powerStructure, npcs, history, arrivalScene, defenseProfile and
simulationTrace. `tests/build/landingFixtureFreshness.test.js` cannot see it: it re-runs the same script.

## Where you work
Your own worktree `/home/user/wt/fixture` on branch `lane/close-1-2026-11-22-fixture-wip`, cut from
`lane/close-1-2026-11-22` (CLOSE-1 makes both; `node_modules` is a symlink, never add it). You COMMIT by explicit
paths; you NEVER push. Scratch for logs: the path CLOSE-1 gives you. Every heavy run through
`sh scripts/gate-mutex.sh --run -- timeout <s> <command…> > <log> 2>&1; echo "exit=$?" >> <log>`, never through a pipe;
never `npm run check`, never the whole suite; no git REPOSITORY variable (`GIT_DIR`, `GIT_WORK_TREE`,
`GIT_INDEX_FILE` …) in the environment of a test.

## THE FILES YOU OWN (change nothing else; STOP and report if you must)
- `scripts/generate-landing-fixture.mjs`
- `tests/build/landingFixtureFreshness.test.js` (only if the cure needs it, e.g. the roster loaded first)
- NEW `tests/build/landingFixtureForgeRoad.test.js`
You may READ: those three, `src/store/settlementGenerateAction.js`, `src/domain/density/densityCreateBoundary.js`
(`birthConfig`, `GENERATION_LAWS`), `src/domain/content/livingContentSeam.js` (`loadLivingContentRoster`), the
landing's replay of the fixture (`src/components/home/LandingArtifacts.jsx`, `src/components/howto/ForgeExactDemo.jsx`),
and existing tests that drive `generateSettlementAction` (find one by grep) for the store's harness.

## What you build
1. THE CURE: every birth the script makes (the town AND its neighbours: each is a birth) goes through `birthConfig`,
   with `await loadLivingContentRoster()` before the first birth, exactly as the store's road does. Keep
   `storeConfigFor`/`forgeConfigFor` as the recorded inputs (the fixture records what the button replays); the birth
   wraps them. If a sync export (`buildRegion`, `analyze`, `buildFixture`) cannot await, load the roster once in
   the script's entry and in every test that calls them, and say so.
2. THE TEST THAT CLOSES THE CLASS (red first): for the fixture's own seed and settType
   (`committedProvenance` or the fixture module), the town the script's birth produces EQUALS, compared WHOLE
   (`toEqual` on the whole settlement, config included), the town `generateSettlementAction` forges from the same
   `{ seed, config }` the landing replays. Arm (a) under the tree's own dials; arm (b) LIT: every row of
   `GENERATION_LAWS` lit by `vi.doMock` of its `module` with the row's `mint` returning
   `{ [row.configKey]: <its lit version> }` (a small table keyed by `configKey`, with an assertion that EVERY row
   has an entry, so a new law forces the table to grow; the graph re-imported after the mock, the SAVED-TOWN form,
   `tests/domain/fortuneLawSavedTown.test.js :: buildUnder`). Plain `it`, not `it.each`.
   RED FIRST: at your cut, before the cure, arm (a) must fail (the config markers differ). Record the failing title and
   the first two lines of its message.

## Proofs to report (CONFIRMED / PLAUSIBLE)
- red before the cure, green after: the new file; `tests/build/landingFixtureFreshness.test.js` (its two rows are on
  the line's red list as STALE, rows "a fresh derivation reproduces the committed module BYTE FOR BYTE" and "the
  script's own --check arm agrees": say whether they are red before and after, and WHAT the cured derivation changes
  against the committed module, in a few lines: a `diff` of `renderFixtureModule(buildFixture(…))` against the
  committed file, counted, the changed field names listed). YOU NEVER RUN `--emit` and never write
  `src/components/home/landingFixture.js`.
- CLOSE-1 also runs your new file on its lit scratch tree: leave the file runnable from any tree.
- `tests/lint` WHOLE at your last commit (COMMON-EIGHTH 11), with its count; the lighting census or the mutation
  manifest re-taken by their own doors only if they red (say which, with the door's command); `npm run typecheck:ratchet`,
  `npm run typecheck:domain:strict`, `npm run lint`.

## Your report (at most 350 words and one table)
Commits, red-first evidence, the proofs' counts, the fixture's byte change in plain words, anything you could not do.
