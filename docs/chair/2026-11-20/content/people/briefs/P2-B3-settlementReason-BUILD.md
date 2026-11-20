# PEOPLE-2 builder B3: why the place is here (`settlementReason[]`), built (written 2026-11-20T17:30Z)

READ WHOLE FIRST: `docs/chair/2026-11-20/content/people/PROPOSAL-settlementReason.md`, `READ-M3-origins.md`, `measures/m3-pools.mjs` (the wordings with needs and excludes, AS WRITTEN THERE), then each source file you change, whole.

## The chair's rulings (verbatim where quoted; they govern where the proposal or the read differs)
- 17:13: "settlementReason's one argument in `steps/generateNarratives.js`: APPROVED." Pool dominance: "a new pool takes NEW rows by the register's own door, the cause in the commit; an existing row only shrinks."
- 17:21, item 2: "why the place is here, road 8: "Built on the road across the open plain, among its own grain fields."; small places 1: "A few households {ground}, each with its own work."; small places 4 also excludes `famine`."
- 17:21, item 3: "THE BAR IS BY THE SENTENCE, OVER ALL PLACES OF A SIZE (about 15%; 150 places a size; a top to 20% passes as sampling)."
- 17:21, item 4: "`src/data/settlementReasonVariants.js` …; one argument in `steps/generateNarratives.js`; the one `return` line in `generateSettlementReason` … THE PICK is `pickVariantMixed` … over the combined list wherever a new wording is eligible; where none is eligible the lines are returned as they came, byte for byte. The power-of-two law is not extended to computed lists. New pool-dominance rows by the register's own door. Seeded text tests are re-keyed by identity or widened to the variant pool. Two-tree: 0 non-string differences."
- 17:21, item 5: "no wording may NEED a house of a hideable kind (`src/domain/people/cardVeil.js :: isHideableHouse`) or any fact about crime; every OTHER house a wording needs is LISTED in your hand-back, pool by pool, for the security reader at the join."
- PEOPLE-1's fix, kept: "Grain from outside is ground here alongside its own; …" also needs `grain`.

## Files you own (nothing else)
- `src/data/settlementReasonVariants.js` (NEW): the pools (rows `{ text, needs, excludes }`; today's line is the head of the combined list at the pick, not a stored row) and `variedReasonLines(lines, ctx)` as the proposal's §6.1 describes, picking with `pickVariantMixed([today's line, ...eligible], key)` (keys as the proposal names them, on the birth's `_seed`); a falsy seed or no eligible wording returns `lines` byte for byte.
- `src/generators/narrativeGenerator.js :: generateSettlementReason`: the closing `return lines;` becomes the ONE call (plus its import line). Nothing else in that file.
- `src/generators/steps/generateNarratives.js`: ONE handed argument carrying the facts (`factsOf` over what the step holds, per the proposal), ON ITS OWN LINE (the chair, 17:38: another lane adds a call line in this file); name that line, as written, in your final message.
- BASE (the chair, 18:46): the working line at 8196e5712 (the goals landing), merged into the integrator's lane at d28a9bb15; your branch starts there. Your call line in `narrativeGenerator.js` and your argument in `steps/generateNarratives.js` each on a line of its own.
- The census declaration file for the new pools (beside the files under `docs/census/declarations/`); the new data file's row in `tests/lint/presumedThings.shared.mjs`; the pool-dominance register's NEW rows by its own door (existing rows only shrink; the cause in your commit). Walkers green BY DECLARATION.
- The seeded text tests that key on a moved line (`originRowsRefused`, `bar5WorldLines` KEEP, `tailNarrativeRows` and any the proposal's §3 names), re-keyed BY IDENTITY or widened to the variant pool, each named in your commit. Any other red naming `settlementReason`: stop and report.
- Your new test file(s) under `tests/generators/` (basename avoiding census|scan|baseline|ratchet|walker|killlist|parity|coverage|governance|freshness|integrity|exhaustiveness|roundtrip|golden|contract|pin).

NOT YOURS: `src/kernel/proseHash.js` (merged into your base by the integrator); `settlementOriginProse.js` (its law 3 is NOT extended); `factVocabulary.js` (no atom; if one is needed, stop and report); every other line of `narrativeGenerator.js`; `historyData.js`, `historyGenerator.js`, `npcData.js`; the power files; `npcStructure.js`; `supabase/`, `src/domain/veil/`, `tests/security/`; `package.json`, `package-lock.json`.

## Red first, then green
1. RED before, GREEN after: on 150 places a size (`hxd-<size>-0..149`), no `settlementReason` sentence (names masked) prints in more than 20% of a size's places (today: one text in every city).
2. A seedless record and a place with no eligible wording: `lines` returned byte for byte.
3. Every printed wording over the 900 places: `needs` hold, `excludes` do not (through `drawDeclared`); the road 8, small places 1 and small places 4 rows as ruled; "its own" never where `grain` is false.
4. THE HIDEABLE RULE as a test over every row's `needs`.
5. Two trees: `node docs/chair/2026-11-20/content/tools/confinement/trees.mjs <base> <your tip> <workdir>`: 0 non-string differences; list the strings that move.
6. Re-run `docs/chair/2026-11-20/content/people/measures/m3-origins.mjs` (n = 150) against your built tree: top sentence share by size, before and after, in your commit message.

GREEN at your last commit, every run through `sh scripts/gate-mutex.sh --run -- <command>`, read by `sh scripts/gate-tail.sh` (never through a pipe): your tests; every test file that names `settlementReason`, `generateSettlementReason`, `generateNarratives` or `settlementOriginProse`; `tests/lint` WHOLE; `npm run typecheck:ratchet`; `npm run typecheck:domain:strict`; `npm run lint`. Never the whole suite; never a census. The golden master moves: say which rows, sign none.

## Hand-back
Commits on your branch (red first, then the cure), by explicit paths, the cure's message carrying its receipts and ending:
Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_019yED1QfbBhtLaDuWfGxc42
Never push, never a pull request, never `--no-verify`. Final message at most 250 words: the commits; the return line and the handed argument as written; the shares before and after by size; the house list by pool; every red you saw and whose it is.
