# PEOPLE-2 builder B4: who founded the place and how it was survived (`history.founding.foundedBy`, `.overcoming`), built (written 2026-11-20T18:19Z)

Its own unit, AFTER B3, on the LANDED line the chair names (`narrativeGenerator.js` is in the goals landing). READ WHOLE FIRST: `docs/chair/2026-11-20/content/people/PROPOSAL-founding.md` (§0 is M5's, then M3's §1 to §6), `measures/m3-pools.mjs` (the 108 founder wordings and the 36 overcoming, with needs), `measures/m5-*.mjs` and M5's 20 cures in §0, then each source file you change, whole.

## The chair's ruling (18:16 UTC, verbatim)
"FOUNDING (72ddf15a4): READ WHOLE: the 108 founder wordings in `m3-pools.mjs`, M5's 20 cures, the 36 overcoming. APPROVED TO BUILD, as its own unit after B3, on the LANDED line (I name its commit shortly: `narrativeGenerator.js` is in the goals landing).

RULED (your §0.6 and §6):
1. BOTH TREES: the pool is built on your lane (History tab, PDF, Foundry: 600 of 600); the traditions card takes it at the join. 2. M5's 20 cures: ACCEPTED. The 13 one-comma wordings: DROP THE COMMA wherever the clause still reads (I name three below). 3. The age after the founder: the traditions lane's; I order it there now. 4. §6.1 the shape: ACCEPTED (one wrapping call in `genArrivalDetail`; one canonical map the matchers read). The pick is `pickVariantMixed`. 5. §6.3 the noble founders with no lord today: LEFT (a grant two centuries old needs no lord now). §6.4 the prosperity fallback: LEFT.

REWORDED BY THE CHAIR:
- family, isolated: "a single extended family who settled far from the trade roads and never left".
- soldier, isolated: "...who wanted to be far from any road and found the place for it".
- refugees, isolated: "...who found the place defensible and far from the trade roads".
- serfs: "{ground}" row: "escaped serfs who settled {ground} beyond the reach of their former masters" (nobody hides on an open plain); isolated row: no comma.
- religious authorities, monastery: "religious authorities who built a house of their order here as a centre for their work in the region" (true for a friary too).
OVERCOMING:
- THE LORDS' rows are number-free (one kind is a single lord): Moderate 1 "by paying what was demanded of them and no more"; Poor "by paying more than the place could spare", "by bowing to demands for longer than anyone liked"; Prosperous "by keeping on good terms with those who held the land around them", "by making the place worth more as a friend than as a prize".
- Poor threat 1: "only after losing much of what they had to the attacks" (no harvest at a port).
- Prosperous land 2: "by putting the good years' surplus aside against the bad ones".
- 'competition from nearby markets' LEAVES the `rival` kind (no claim, no dispute) for its own kind `market`: Moderate "by selling what the nearer markets did not", "by dealing fairly until buyers came back"; Poor "by selling for less than they could afford, for years", "only after losing their first buyers to the nearer markets"; Prosperous "by offering what the nearer markets could not", "by winning the nearer markets' buyers early".
All else AS WRITTEN. Re-take both projections on 150 a size on the built tree."

INTEGRATOR'S READING: a "..." in a reworded founder line keeps that row's own opening words as written in `m3-pools.mjs`. The 13 one-comma wordings: drop the comma where the clause still reads without it, keep it where dropping it breaks the sentence; list all 13 in your final message, each as built.

## Files you own (nothing else)
- `src/data/foundingVariants.js` (NEW): the founder wordings by canonical row, the overcoming wordings by table × kind (the new `market` kind as ruled), each `{ text, needs, excludes }`; the canonical map (variant → canonical row); `withFoundingWordings(arrival, foundingState, seed)` picking with `pickVariantMixed([today's row, ...eligible], '<seed>::history.founding.foundedBy')` and `'<seed>::history.founding.overcoming'`; a falsy seed or no eligible wording returns the object as it came, byte for byte.
- `src/generators/narrativeGenerator.js :: genArrivalDetail`: the ONE wrapping call on its `return { … }` (the `return {` line and its closing line), plus the import line. Nothing else in the file.
- `src/domain/facts/founder.js` and `src/domain/facts/foundingRowAdmits.js`: ONLY the reads through the canonical map, so every agreement table and `FOUNDER_KIND` read the canonical row (each line touched listed in your final message).
- The census declaration for the new pools; the new data file's row in `tests/lint/presumedThings.shared.mjs` and its rows in `tests/lint/presumptionClasses.register.json` where a noble row's `sovereign` class carries over; pool-dominance NEW rows by the register's own door. Walkers green BY DECLARATION.
- The seeded tests named in the proposal's §3 (`foundingOneFounder`, `tailNarrativeRows`, `foundingRowsRead`, `founderHamletNoMill`, any other naming `foundedBy`/`overcoming`), re-keyed by identity or read through the canonical map, each named in your commit. `missingLeaves.test.js` must hold untouched (the table is not edited).
- Your new test file(s) under `tests/generators/` (basename avoiding census|scan|baseline|ratchet|walker|killlist|parity|coverage|governance|freshness|integrity|exhaustiveness|roundtrip|golden|contract|pin).

NOT YOURS: `historyData.js`, `historyGenerator.js`, `npcData.js`; `FOUNDERS_BY_TIER` and `OVERCOMING_BY_PROSPERITY` (the draws stay as written); `src/kernel/proseHash.js`; `factVocabulary.js` (no atom); the traditions writer (`traditionDescription.js`, the traditions lane's); `supabase/`, `src/domain/veil/`, `tests/security/`; `package.json`, `package-lock.json`.

## Red first, then green
1. RED before, GREEN after: on 150 places a size, neither `foundedBy` nor `overcoming` prints its commonest sentence in more than 20% of a size's places.
2. A seedless record: byte for byte as today. The random stream: `trees.mjs` 0 non-string differences; list the strings that move (`historyBeats.js :: deriveFoundingCause`, `deriveFirstProsperitySource`, the AI grounding bundle).
3. Every printed wording over the 900 places: needs hold, excludes do not; every variant read raw by `founderOf` gives its canonical row's kind; `sovereign.js` words kept; `speakTierNoun` leaves each wording unchanged; every founder wording a lowercase noun phrase and every overcoming wording an adverbial phrase (the `historyBeats` composers).
4. THE HIDEABLE RULE (the chair, 17:21): no wording NEEDS a house of a hideable kind (`src/domain/people/cardVeil.js :: isHideableHouse`) or a crime fact; every other house a wording needs listed in your final message, pool by pool.
5. Both projections re-taken on the BUILT tree, 150 a size (start from `m5-*.mjs`; write `measures/b4-shares.mjs` and its `.out.txt`): top shares before and after in your commit message.

GREEN at your last commit, through `sh scripts/gate-mutex.sh --run -- <command>`, read by `sh scripts/gate-tail.sh` (never through a pipe): your tests; every test file naming `founder`, `foundedBy`, `overcoming`, `genArrivalDetail`, `foundingRowAdmits` or `historyBeats`; `tests/lint` WHOLE; `npm run typecheck:ratchet`; `npm run typecheck:domain:strict`; `npm run lint`. Never the whole suite; never a census. The golden master moves: say which rows, sign none.

## Hand-back
Commits on your branch (red first, then the cure), by explicit paths, ending:
Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_019yED1QfbBhtLaDuWfGxc42
Never push, never a pull request, never `--no-verify`. Final message at most 250 words: the commits; the wrapping call and every line touched in `founder.js` / `foundingRowAdmits.js`; the 13 comma wordings as built; the shares before and after; the house list; every red and whose it is.

## The chair's common rule 2 (20:36 UTC): A LITERAL HAS ONE HOME
"An existing line is never copied into a pool file as its index 0: the pool handed to the door is composed at the call site as [the existing line, ...the new siblings]."
INTEGRATOR'S READING FOR THIS UNIT: `foundingVariants.js` never retypes a row of `FOUNDERS_BY_TIER` or `OVERCOMING_BY_PROSPERITY`, neither as a row, nor as a map key, nor as a map value. Each variant names its canonical row BY REFERENCE (tier and index, or table, kind and index, into the imported table), and the canonical map is BUILT from the imported table at module load, so a reworded table row moves with it. The pick composes `[the drawn row, ...eligible]` at the call. A test asserts that no string literal in `foundingVariants.js` equals a row of either table. If the shape will not hold this, stop and report.
