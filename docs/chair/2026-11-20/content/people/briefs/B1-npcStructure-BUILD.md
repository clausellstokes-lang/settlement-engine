# PEOPLE-1 builder B1: the person's place in the order, built (DRAFT until the chair's ruling is quoted below)

THE CHAIR'S RULING (quoted verbatim by the integrator before this builder is seated): _pending_.

## What you build
The pools of `PROPOSAL-activeConstraint.md` §4 and `PROPOSAL-structuralPosition.md` §4 (both in `docs/chair/2026-11-20/content/people/`), AS AMENDED by `READ-M1-npcStructure.md` and the ruling above: struck lines stay struck, rewritten lines are written as the read says, wordings needing an atom the chair has not granted are LEFT OUT (listed in your hand-back), never written against a stand-in.

## Files you own (nothing else)
- `src/data/npcStructureVariants.js` (NEW: `CONSTRAINT_VARIANTS`, `POSITION_VARIANTS`, keyed by the T key; each row `{ text, needs, excludes }` in the house's declared-line shape; index 0 of every pool is today's exact line).
- `src/generators/npcStructure.js` (read WHOLE first): the two writes in `enrichNPCsWithStructure` choose through `pickVariant` (`src/kernel/proseHash.js`) over the eligible rows (resolved by `src/domain/facts/drawDeclared.js` against `factsOf(settlement)`, as the template rows are), keyed `'<settlement _seed>::npcStructure.activeConstraint::<card id>'` and `'…structuralPosition…'`. A falsy seed takes index 0. No new random draw: the stream is untouched. `holderHouseLineOf`, `HOLDS_THE_SEAT`, `positionForStanding` and every refusal keep their law (the low-standing twin stays bound to index 0).
- The census declaration file for the new pools (beside `docs/census/declarations/npcStructure.T.json`, one row per wording with its `needs` and `excludes`), and the new data file's row in `tests/lint/presumedThings.shared.mjs`: the presumption walkers green BY DECLARATION, never by an exemption.
- The seeded text tests that key on a line your change moves, re-keyed BY IDENTITY (the house practice), each named in your commit: `npcStructureBody.test.js` (rpf-town-calm-13), `bar2PeopleTies.test.js` (r2r-village-13, r2r-village-46), `tailTies3Batch1.test.js` (three rows), `bar5PowersStanding.test.js` (bar0-metropolis-calm-rand-21). Any other red that names your field: stop and report.
- Your new test file(s) under `tests/generators/people/` (basename avoiding the mutation manifest's pattern: census|scan|baseline|ratchet|walker|killlist|parity|coverage|governance|freshness|integrity|exhaustiveness|roundtrip|golden|contract|pin).

NOT YOURS: `src/domain/facts/factVocabulary.js` (read-only: the chair appends atoms), `npcData.js`, anything under `src/generators/power/`, `supabase/`, `src/domain/veil/`, `tests/security/`, `package.json`, `package-lock.json`, every register and census baseline (the integrator re-takes them).

## Red first, then green
1. RED before your change, GREEN after (commit the test first or show its red in your message): of 30 calm cities (`hxd-city-0..29`), no constraint sentence on more than 6 of them, and no position sentence on more than 6 (today: the calm default on nearly all).
2. A seedless call of `enrichNPCsWithStructure` prints index 0 on every row (canonical-at-zero).
3. Every printed wording on 100 born places a size: its `needs` hold and its `excludes` do not (read through `drawDeclared`); no calm row's wording appears in a crisis place; the two word guards (`npcStructureSeatPlain`'s MACHINERY and DEFENCE_WORDS; `seatHolderOnThePage`'s SUBORDINATE on the holder) pass over every wording in the data file.
4. The random stream untouched: `node docs/chair/2026-11-20/content/tools/confinement/trees.mjs <base> <your tip> <workdir>` reads 0 non-string differences; list the strings that move (these two fields and whatever quotes them, e.g. `npcProfile.js :: publicReputation`).
5. Re-run `docs/chair/2026-11-20/content/people/measures/m1-npcStructure.mjs` against your tree: the top share by size, before and after, in your commit message.

GREEN at your last commit, every run through `sh scripts/gate-mutex.sh --run -- <command>`, read by `sh scripts/gate-tail.sh` (never through a pipe): your tests; every test file that names `npcStructure`; `tests/lint` WHOLE; `npm run typecheck:ratchet`; `npm run typecheck:domain:strict`; `npm run lint`. Never the whole suite; never a census. Reds that are not yours: the generator's golden master (`tests/property/generatorGoldenMaster.test.js`) moves: say which rows, sign none.

## Hand-back
Two commits on `lane/people-1-b1-2026-11-20` (one a field, constraint first), by explicit paths, each message carrying its receipts (red, green, trees, shares) and ending:
Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_019yED1Rzt4qD1sri7MHNbHp
Never push, never a pull request, never `--no-verify`. Final message at most 250 words: the commits, the shares before and after, the strings that moved, every red you saw and whose it is.
