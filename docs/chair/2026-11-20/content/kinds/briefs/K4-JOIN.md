# K4-JOIN — THE TROUBLE LAW JOINS THE OTHER BIRTH LAWS, IN THEIR FORM, DARK (lane KINDS-2, unit 3)

Seat: KINDS-2 (integrator). You are its builder for this unit. YOU DO NOT PUSH; never the main checkout
`/home/user/settlement-engine` (only `git worktree add` from it); never `--no-verify`, reset, stash or clean.
WORKTREE: `git worktree add -b lane/kinds-2-2026-11-24-k4 ../kinds2-k4 lane/kinds-2-2026-11-24` (the seat names the tip
in your prompt), then `ln -s /home/user/settlement-engine/node_modules ../kinds2-k4/node_modules`. Commit there by explicit
paths. Every test run: `sh scripts/gate-mutex.sh --run -- sh scripts/gate-tail.sh <command…>` to a log; the full log's
path is the tail's second-last line; read by grep/tail. Never a gate through a pipe. `tests/lint` WHOLE after any change
to a test file; `tests/copy` WHOLE after a change under `src/domain` or `src/data`.

## THE LAW AS IT STANDS (read whole: `src/domain/trouble/troubleLaw.js`; the three changed lines of
`src/generators/historyGenerator.js :: buildHistoricalEvent`, by `grep -n "KINDS-1 K1"`)
The leaf already has the seat law's form (`TROUBLE_LAW_CONFIG_KEY`, `TROUBLE_LAW_VERSIONS = [1, 2]`,
`DEFAULT_…`, `WEIGHTED_…`, `NEW_SETTLEMENT_TROUBLE_LAW_VERSION` at law 1 typed `{number}`, the reader, the mint), and
`densityCreateBoundary.js :: birthConfig` already clamps and mints it (the fifth row of `GENERATION_LAWS`, after fortune).
THE PATTERN YOU FOLLOW, read whole: `src/domain/seat/seatLaw.js` (above all `withRecordSeatLaw`), and
`tests/domain/generationLawsSavedPlace.test.js` (the one test that walks a saved place under every law at once).

## THE WORK, EACH ITEM ITS OWN COMMIT (red-first where it cures)
1. SHAPE 2, CURED IN THE SEAT LAW'S FORM. KINDS-1 pinned a legacy edge: a save with NEITHER `config` nor `_config`,
   whose history is regenerated while the form holds a lit world's config, re-rolls its troubles under law 2
   (`regenSection` hands `regenHistoryPipeline` the form's config). The seat law cured its own twin of this
   (`seatLaw.js :: withRecordSeatLaw`, applied in `src/generators/generateSettlementPipeline.js :: regenHistoryPipeline`
   and `:: regenNPCsPipeline`). Add `withRecordTroubleLaw(config, record)` to `troubleLaw.js` in exactly that form
   (the record's marker through the one resolver, or none; same reference when they agree; never called at birth), and
   apply it in `regenHistoryPipeline` ONLY (the one regen road that reaches `buildHistoricalEvent`; say how you checked
   that `regenNPCsPipeline` and the tick re-derive do not), composed with the seat's call on the same line or the next,
   one import line. The leaf's header names the new importer. No packed lines.
   RED FIRST: the shape-2 arm below, run WITHOUT the cure, red; with it, green.
2. THE JOIN'S ARM: `tests/domain/generationLawsSavedPlace.test.js` gains `LAW_READINGS.trouble` (the register arm
   demands it): `reader: ['src/domain/trouble/troubleLaw.js', 'resolveTroubleLawVersion']`, and `moves` = THE TWO BARS
   the law moves, read through the build's own leaf on the world: `crimeWaveBar(configOf(w), w.economicState)` and
   `guildSwapBar(configOf(w), w.powerStructure?.factions)` (G.readers.trouble.module). WHY BARS AND NOT THE TENSIONS:
   `regenSection('history')` mints a FRESH RANDOM seed, so a tension reading cannot equal across two walks, and (a)
   compares the lit walk with the dark walk step by step; the tensions themselves stay proved in
   `tests/domain/trouble/troubleLawSavedTown.test.js` (bounded re-rolls). Nothing else in the file changes unless a
   arm reds for a reason you can name; then STOP and report before editing an arm. Every arm (a) to (g) must be GREEN
   with the trouble row walked; say for each that it walked the row (e.g. (f): the lit birth's guild bar is not 0.7).
   THE ANSWER TO SHAPE 2 FROM THIS ARM: (e)'s last block demands that `regenHistoryPipeline` write the same bytes with
   the form's lit markers and without them, for a place with neither config: show it RED with item 1's cure planted
   out (if it does NOT red for this fixture, say so: then the trouble file's own shape-2 arm is the red-first).
3. THE ONE BORN PIN. `tests/domain/trouble/troubleLawWiring.test.js` "1. CREATE (dark)" today pins `birthConfig(null)`
   against the density and living-content keys only (it is red at point 113: the seat and fortune laws are lit).
   The join's arm (g) is now THE ONE pin of what a new place is born with (it spreads every row's mint, the trouble
   law's included). Re-shape arm 1 as the seat and fortune wiring files' CREATE arms were (read
   `tests/domain/seatLawWiring.test.js` and `tests/domain/fortuneLawWiring.test.js`'s arm 1 for the form): it asserts
   its OWN key only (absent at the dark dial), and points at generationLawsSavedPlace (g) as the pin on the flip's list.
4. `tests/domain/trouble/troubleLawSavedTown.test.js`: arm "5. THE LEGACY EDGE, shape 2 (PINNED…)" becomes the CURE's
   arm: a save with neither config nor _config, its history regenerated while the form holds a LIT world's config,
   re-rolls under LAW 1 (its tensions equal the same pass with the form's marker removed, the same `_regenSeed`), with a
   live negative control (the same pass on the place given a `config` carrying 2 differs). Red without item 1's cure.
   Its header's sentence about the legacy edge follows. No other arm of the file changes unless it reds; if one reds at
   point 113 for a reason that is not yours, STOP and report it by name.
5. THE REGISTER ROW: `densityCreateBoundary.js :: GENERATION_LAWS.trouble.why` says THE DIAL IS DARK and that LIGHTING
   IT IS ONE COMMIT ON THE OWNER'S YES (the numbers of `TROUBLE_WEIGHT_TUNING` are a draft table he signs), that a
   saved place keeps the law it was born under (the regen re-keys the history pass to the record's law,
   `withRecordTroubleLaw`), and the chunk fact as it stands. Keep `troubleLawWiring` arm 4 (which reads this text) green.
   The leaf's header: drop the stale "on the fortune lane" phrasing (the fortune law is on the line now); keep every
   true sentence; the owner's two rules verbatim stay.
6. REGISTERS YOUR CHANGES MOVE, each by its own door, each its own commit with before -> after: the tuning inventory
   (`TUNING_INVENTORY_REFREEZE='KINDS-2 K4' TUNING_INVENTORY_NOTE='<note>' npx vitest run tests/lint/tuningRegister.walker.test.js`,
   then the ordinary run green: line numbers only, no value moves); the lighting census (its walker: `grep -l
   LIGHTING_CENSUS_REFREEZE tests/lint`; titles before -> after); the mutation manifest and the wiring census if red.
   A shrink-only ceiling that must RISE is a STOP. A golden or a born figure moved is a STOP (the dark birth does not
   change: nothing here runs at birth).

## THE SWEEP (at your last commit)
`tests/lint` WHOLE; `tests/domain/trouble/`; `tests/domain/generationLawsSavedPlace.test.js`;
`tests/domain/seatLawWiring.test.js`, `tests/domain/fortuneLawWiring.test.js`, `tests/domain/seat/seatLawSavedTown.test.js`,
`tests/domain/fortuneLawSavedTown.test.js` (whichever exist); `grep -rln "regenHistoryPipeline\|troubleLaw" tests` and
run every file it names; `tests/copy` WHOLE. Every failing title by name against
`git show origin/lane/chair-2026-11-08:docs/chair/2026-11-20/seventh/ci/RED-AT-LINE.tsv` (match by containment).

## FILES YOU MAY READ
The files named above, whole where you change them; walkers' headers and failing arms; nothing wider.

## REPORT (at most 300 words)
Your branch and commits; item 1's red-first (the failing title and its message, then green); for each arm (a)-(g) one
phrase on how it walked the trouble row; the shape-2 answer in two sentences; registers before -> after; the sweep's
counts and every red by name, on the list or not; any STOP. CONFIRMED for what you ran, PLAUSIBLE for what you read.
