# TRAD-2 · UNIT 3 — CTR10 FINISHED: THE POOLS' FLOORS AND CONDITIONS VERIFIED, REGISTERED, AND THE PRINTED EXPORT

Read `TRAD-2-COMMON.md` first; it binds you. Base: `lane/trad-2-2026-11-20` at the commit your worktree starts on (it
carries unit 1: the draw key, houses through `houseSentenceName`, the scanner cure).

## Files you may change
`src/data/traditionDescriptionTable.js`, `src/domain/traditions/traditionDescription.js` (only where a floor or a
condition below is missing), `tests/domain/traditionDescription.test.js`,
`tests/lint/traditionDescriptionFrames.walker.test.js`, `src/pdf/sections/Traditions.jsx` and its own test file(s),
`docs/DESIGN_POOL_CENSUS.md` (the rows this brief names), `tests/lint/crisisScopedPools.register.json` and
`tests/lint/undeclaredLines.register.json` ONLY through their door, `scripts/census/pool-dominance.register.json` ONLY
through its door. Anything else: STOP and report.

## The owner's word and the chair's CTR10 (verbatim in `docs/chair/2026-11-20/seventh/prompts/TRAD-1.txt` on
`origin/lane/chair-2026-11-08`, ADDENDUM 1, "CTR10": read it whole: `git fetch origin lane/chair-2026-11-08 && git show
FETCH_HEAD:docs/chair/2026-11-20/seventh/prompts/TRAD-1.txt`)

TRAD-1 says most of CTR10 is in. VERIFY EACH CLAUSE BY AN ARM (a test that reds when the clause is broken), then build
what is missing:
1. FLOORS, as executed counts read off the table's own exports: S1 at least FOUR leads for each of the six acts; each
   keeper frame kind at least THREE; the founding cause and the dead's cause at least THREE each; the economy sentence
   at least THREE in each band. One arm that names the slot and its size when below its floor.
2. EVERY LINE A DECLARED LINE drawn through `drawDeclared` (`src/domain/facts/drawDeclared.js`, read whole; edit
   nothing there), in the closed vocabulary (`src/domain/facts/factVocabulary.js`, read whole; edit nothing). A line
   that presumes a thing (a market, a smith, a clergy, a river or coast, a granary, an outside trader) DECLARES it; an
   atom with no reader is listed under "needs a field" and its line kept out. Walk every authored line of the table and
   list, in your report, each line's presumption and its declaration; any undeclared presumption is a red you cure.
   `tests/lint/presumedThings*` must stay green with no row added for these lines.
3. THE CRISIS DIMENSION: the pools whose words can clash with a town's present crisis (a thanksgiving, a feast eaten
   in common, a fair of stalls and outside trading) opt in as crisis-scoped and are EXCLUDED under the crises that
   contradict them, each resolving to a TWIN that says only what is kept. For each opted pool list which crises exclude
   it and why (read the crisis atoms the vocabulary holds; never invent a crisis key). THE TEXT NEVER SAYS WHAT BECAME
   OF THE RITE THIS YEAR: an arm proves no frame states an outcome (the record's `lastOutcome` is not read unless the
   record holds it; if the leaf reads it, say where). Born arms: towns born under `famine`, `under_siege`, `occupied`,
   `wartime`, `plague_onset` (`generateSettlementPipeline({ …, selectedStressesRandom: false, selectedStresses: [crisis]
   }, null, { seed, customContent: {} })`) read no excluded line; the same seeds calm read as before.
4. THE REGISTERS (`docs/DESIGN_POOL_CENSUS.md` §1–§3.5 and §6, read whole): a row per pool where the house registers its
   pools (the census table and the line register the design names); the crisis-scoped register re-taken by its door
   (`RETAKE_DECLARATION_REGISTERS=1 npx vitest run tests/domain/facts/declarationRegisters.test.js`, then the test run
   plainly green) — if its scan does not see the leaf's crisis-scoped pools, find out why and report it; do NOT widen
   the scan; the pool-dominance register (`scripts/census/pool-dominance.mjs`): the leaf draws at render, so the corpus
   may never draw these pools: run it, report what it sees for `traditionDescription:*`, and only re-take by its door if
   it moves.
5. THE PRINTED EXPORT (CTR4: every surface that lists traditions reads the one leaf): `src/pdf/sections/Traditions.jsx`
   gains the description line, `audience: 'owner'` (the owner's export), composed by `describeTradition`, no wording of
   its own. Red first: a test that renders the section for a born town with a lit mirror and finds the description.
