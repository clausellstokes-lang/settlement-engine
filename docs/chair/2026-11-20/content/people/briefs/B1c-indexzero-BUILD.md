# PEOPLE-1 builder B1c: one home for every index 0 (`npcStructureVariants.js`), built

Written 2026-11-20T20:30Z by the integrator (PEOPLE-1).

THE CHAIR'S RULING (20:30 UTC, verbatim): "RULED ON (4): (b), THE LAW WHOLE, and it is yours to staff now (your record reads 275,811 by my read at 20:19: there is room for one builder's diff). ONE HOME FOR EVERY INDEX 0: index 0 leaves all 28 pools of `npcStructureVariants.js`; `pooledLineOf` composes [the T row, ...the pool] for every key, the T row's own declaration serving as index 0; the pick's indices unchanged (the gates' `#n` keys stand); the two census declaration files lose their roughly 300 mechanical lines by their own doors, not by hand where a door exists. WHY (b) AND NOT THE ONE-POOL PATCH: 28 copies of a literal beside their originals is a drift waiting to happen (a copy edited and its original not), and (a) would leave 27 of them; the copies are also bytes the worker carries twice. PROOFS: red first (a test that the data file holds no line equal to a T literal; and that every pooled key's index 0 IS the T row, byte for byte); the two-tree proof: 0 differences of any kind (this unit moves no printed word); the re-keyed tests green; the presumption walker green with the banked row untouched in `npcStructure.js`. THEN the doors in your order ((3) pool dominance tightened, (5) the lighting census, (6) the tuning inventory with its reason), the build's first-paint figures, "PEOPLE <commit>", and the hand-over to PEOPLE-2 the same hour. If the builder finds that `pooledLineOf` cannot take the T row's declaration without changing which line a place prints anywhere, STOP: then it is (a) for the one pool and (b) goes to PEOPLE-2 as its own unit."

WHY: `tests/lint/presumptionClasses.walker.test.js` reds on a fresh hit. Index 0 of the position pool `government__economic_stress__dominant` ("Holds the seat while money is short, and people judge the seat by what it can no longer pay for.") is banked (office:none) under `src/generators/npcStructure.js`, and its literal now ALSO stands in `src/data/npcStructureVariants.js`. The literal must have one home.

BASE: the integrator's lane `lane/people-1-2026-11-20` at its tip (B1 and B1b merged, with the fill fix 628301ccb). Read B1's brief (`briefs/B1-npcStructure-BUILD.md`) for the house rules; they all hold.

## What you build
1. `src/data/npcStructureVariants.js`: drop index 0 from every pool of `POSITION_VARIANTS` and `CONSTRAINT_VARIANTS` (28 pools). Every remaining row keeps its order. Update the header comment: the pools now hold the siblings ONLY, and the caller composes index 0 from the writer's own T row.
2. `src/generators/npcStructure.js :: pooledLineOf` (and its two call sites in `enrichNPCsWithStructure`): compose the pool as `[the T row's own line (tmpl.position / tmpl.constraint, the declared row itself, with its own needs and excludes), ...pools[key]]` for every key. Index 0 stays a candidate unconditionally, as today. The positions are unchanged, so the `CONSTRAINT_ROW_GATES` `#n` keys and the ledger's `lineId` stand. Nothing else changes.
3. The two census declaration files, `docs/census/declarations/npcStructureVariants.POSITION_VARIANTS.json` and `…CONSTRAINT_VARIANTS.json`: their index-0 rows leave by the files' own door if one exists (look at `scripts/census/census4-extract-pools.mjs` and its siblings first). Edit by hand ONLY where no door writes them, and say which you did.
4. Tests, by identity, none weakened:
   - `npcPositionPools` / `npcConstraintPools`: the "index 0 is the T line" arms now assert the composition.
   - The `memberOf` / `resolved` helpers in `bar2PeopleTies`, `bar5PowersStanding`, `npcStructureBody` and `tailTies3Batch1` accept the T line as index 0 exactly as before. Take it from the writer's table (the tests already slice T), never by re-typing a literal.
   - Any `VARIANTS.length` premise moves by 28 (e.g. 78 → 64): say each one.

## Red first, then green
1. RED before your change, GREEN after, committed first: a test that `npcStructureVariants.js` holds NO text equal to any T line of `npcStructure.js` (position or constraint), and that for every pooled key the composed index 0 IS the T row, byte for byte.
2. THE TWO TREES: `node docs/chair/2026-11-20/content/tools/confinement/trees.mjs <base> <your tip> <workdir>`. Base = the lane tip you started on. It must read 0 differences OF ANY KIND, string or not. This unit moves no printed word. If ANY string moves, STOP and report: that is the chair's STOP condition.
3. `tests/lint/presumptionClasses.walker.test.js` green, with the banked row untouched in `npcStructure.js` (do NOT touch the register).

GREEN at your last commit, every run through `sh scripts/gate-mutex.sh --run -- <command>` (set `GATE_MUTEX_MAX_POLLS=300`), read by `sh scripts/gate-tail.sh` (never through a pipe):
- your tests and the 4 re-keyed tests;
- `tests/generators/people/`;
- `tests/lint/presumptionClasses.walker.test.js` and `tests/lint/declarationRegisters*` (whatever names the declaration files);
- `tests/domain/facts/declarationRegisters.test.js`;
- `npm run typecheck:ratchet`, `npm run typecheck:domain:strict`, `npm run lint`.

Do NOT run tests/lint whole, the whole suite or any census: the integrator does. The pool-dominance register, the lighting census and the tuning inventory are the INTEGRATOR's doors: do not touch them.

## Files you own (nothing else)
`src/data/npcStructureVariants.js`, `src/generators/npcStructure.js` (only `pooledLineOf` and its two calls), the two declaration JSONs, the six test files named above, and one new red test under `tests/generators/people/` (basename avoiding census|scan|baseline|ratchet|walker|killlist|parity|coverage|governance|freshness|integrity|exhaustiveness|roundtrip|golden|contract|pin).

## Hand-back
Commits on your worktree branch, the red test first and then the cure, staged by explicit paths, receipts in the message (the red, the green, the trees). Never amend. The message ends:
Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_019yED1Rzt4qD1sri7MHNbHp
Never push, never a pull request, never `--no-verify`. Final message at most 150 words: the commits, the trees' reading, every red you saw and whose it is.
