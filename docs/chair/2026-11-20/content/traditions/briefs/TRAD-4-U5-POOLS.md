# TRAD-4 · UNIT 5 — CTR10 FINISHED: EVERY FRAME A DECLARED LINE, THE FLOORS BY ARMS, THE GLOSS POOLS RAISED, THE REGISTERS, THE PRINTED EXPORT

Written 2026-11-20 13:33 UTC (`date -u`) by TRAD-4. It SUPERSEDES `TRAD-2-U3-POOLS.md` (kept as history) and carries the
rulings since. Read `TRAD-2-COMMON.md` first; it binds you (read "TRAD-2" there as "TRAD-4", the integrator who reads
your diff line by line). Base: `lane/trad-4-2026-11-20` at `1f3cdc135` (units 1, 1c, 2, 4 and 4b are in). The working
line's point 82 is NOT in your base and you need nothing of it (below).

## Files you may change
`src/data/traditionDescriptionTable.js`, `src/domain/traditions/traditionDescription.js`,
`tests/domain/traditionDescription.test.js`, `tests/lint/traditionDescriptionFrames.walker.test.js`,
`src/pdf/sections/Traditions.jsx`, `tests/pdf/traditionsSection.test.jsx`, `docs/DESIGN_POOL_CENSUS.md` (the rows this
brief names), and ONLY THROUGH THEIR DOORS: `tests/lint/crisisScopedPools.register.json`,
`tests/lint/undeclaredLines.register.json`, `scripts/census/pool-dominance.register.json`. Anything else: STOP and
report (a new test file is a change the integrator must approve first: prefer arms in the files above).

## What stands at your base (measured by TRAD-4 at `1f3cdc135`; verify, do not trust)
- DECLARED ALREADY: `ACT_LEADS` (S1) and `ELEMENT_GLOSS` are `line({...})` rows with `needs` / `excludes` / `crisis` /
  `twinOf`; `CRISIS_SCOPED_ACTS = ['feast','fair']`, `CRISIS_SCOPED_ELEMENTS = ['harvest']`.
- BARE STRINGS, NOT DECLARED: `HOUSE_FRAMES`, `POWER_FRAMES`, `OWNER_FRAMES`, `CAUSE_FRAMES`, `ECONOMY_FRAMES` (three a
  kind). They already pass through the leaf's one `draw` (`traditionDescription.js :: draw` → `drawDeclared`), so a
  bare string is admitted undeclared.
- `ELEMENT_GLOSS` pools hold ONE line each (harvest two). The measure at the base: the most repeated shapes are a lead
  plus a one-line gloss ("A contest that welcomes the year's new growth." 5x of 1,232).
- `src/pdf/sections/Traditions.jsx` prints no description (it reads `describeTraditionWindow` only).
- `tests/lint/traditionDescriptionFrames.walker.test.js` holds "every event kind a rite of the dead may be kept in memory
  of has one authored phrase, and nothing else does", with NO red-first plant, and no arm proves the leaf OMITS the
  clause when an eligible type has no phrase (4b's proof was a scratch test, deleted).
- No row for `traditionDescription:*` in `docs/DESIGN_POOL_CENSUS.md`, the crisis-scoped register, the undeclared-lines
  register or the pool-dominance register.

## The work, each clause by an arm that reds when the clause is broken (red first, quoted in your report)
1. EVERY FRAME A DECLARED LINE. Convert every bare frame string of the five frame tables into a declared line in the
   house's form (`line({ text, needs?, excludes?, crisis?, twinOf? })`, the same helper the leads use; read
   `src/domain/facts/drawDeclared.js` and `src/domain/facts/factVocabulary.js` WHOLE first, edit neither). Walk every
   authored line of the table (leads, gloss, the five frame tables) and list in your report each line's presumption and
   its declaration. A line that presumes a thing DECLARES it; an atom with no reader goes under "needs a field" and its
   line is kept out. The table's own guards stay. Arm: a walker test that names any undeclared line of the table
   (planted bare string → red). `tests/lint/presumedThings*` stays green with no row added for these lines.
2. THE FLOORS, as executed counts off the table's own exports, one arm naming the slot and its size when below its
   floor: S1 at least FOUR leads per act (twins not counted); each keeper frame kind at least THREE; the founding cause
   (both `founding` and `foundingBare`) and the dead's cause at least THREE each; each economy band at least THREE.
   THE FLOOR RAISED BY TRAD-4 (CTR10 lets the seat raise it): EVERY `ELEMENT_GLOSS` pool at least THREE lines (twins not
   counted), each new line a plain statement of what the rite marks, declared like its pool's existing line (a
   `needs` the existing line carries, the new lines carry too; harvest's crisis twin pattern for any line that gives
   thanks or feasts). Count them in the same arm.
3. THE CRISIS DIMENSION, VERIFIED: for each crisis-scoped pool (feast, fair, harvest, and any pool you opt in under item
   1) list which crisis atoms exclude it and why (read the atoms the vocabulary holds; never invent a crisis key); each
   excluded line resolves to a TWIN that says only what is kept. Born arms: towns born under `famine`, `under_siege`,
   `occupied`, `wartime`, `plague_onset` (`generateSettlementPipeline({ …, selectedStressesRandom: false,
   selectedStresses: [crisis] }, null, { seed, customContent: {} })`) read no excluded line, owner and reader; the same
   seeds calm read the calm lines (non-vacuity: at least one excluded line is drawn calm). THE TEXT NEVER SAYS WHAT
   BECAME OF THE RITE THIS YEAR: an arm proves no frame states an outcome; if the leaf reads `lastOutcome`, say where.
4. THE TOTALITY OF THE KIND PHRASES, A COMMITTED ARM (the chair, 13:32): RED FIRST, a type planted into
   `DEAD_EVENT_TYPES` with no `DEAD_EVENT_PHRASES` entry is named by the walker; AND a born rite of the dead whose only
   eligible event is of a type with no phrase prints NO cause clause for the reader (fail-closed, never "undefined",
   never `event.name`), proven in `tests/domain/traditionDescription.test.js` by constructing the record.
5. THE REGISTERS: a row per pool where the house registers its pools (`docs/DESIGN_POOL_CENSUS.md` §1–§3.5 and §6, read
   whole); the crisis-scoped register re-taken by its door (`RETAKE_DECLARATION_REGISTERS=1 npx vitest run
   tests/domain/facts/declarationRegisters.test.js`, then the same plainly green); if its scan does not see the leaf's
   pools, find out why and report it; do NOT widen the scan. The pool-dominance register
   (`scripts/census/pool-dominance.mjs`): run it, report what it sees for `traditionDescription:*`, re-take by its door
   only if it moves.
6. THE PRINTED EXPORT (CTR4: every surface that lists traditions reads the one leaf): `Traditions.jsx` gains the
   description line, `audience: 'owner'`, composed by `describeTradition`, no wording of its own. Red first: render the
   section for a born town with a lit mirror and find the description.

## The laws since TRAD-2's brief (all bind every line you author)
- NO PRONOUN AFTER A POWER'S NAME in any new line (the chair, 13:32: point 82's agreement for "it" of a plural-named
  power is not in your base): repeat the name or recast. A verb after a power or a house takes its number through
  `src/data/people/powerSentenceName.js :: powerVerb` (the `POWER_FRAME_VERBS` slot pattern); no frame makes a HOUSE the
  subject of a verb. A power through `governanceAccount.js :: powerNameInProse`; a house through
  `src/data/houseSentenceName.js`.
- CTR11 (the reader's text a function only of facts no act of the DM can hide; every word it names AND chooses): no new
  line reads a field the reader's view strips, and no new choice of word (rank, share, count, "only", superlative) for
  the reader is computed over a row of the hideable class. The reader never reads `foundedBy`, a house's function-eye
  fields, or `event.name`.
- CTR6, the owner's calm rule: a description states; no line dramatises; the level-law arm holds every new line. CTR2:
  a cause word only in a CAUSE frame.
- THE DRAWN SET DOES NOT MOVE: `sharedTraditionRowsOf`'s set and ids are untouched by this unit (descriptions move,
  rows do not).
- FORTUNE: if any line you add reads the fortune label ("prosperous", "poor"), say so. None should.
- No born town moves (the confinement: TRAD-4 re-runs it at the merge; touch nothing the generator runs).

## Measures for your report (by the existing tools; no new measuring helper)
- `node docs/chair/2026-11-20/content/traditions/tools/trad-pool.mjs <dir>` then
  `node docs/chair/2026-11-20/content/traditions/tools/measure2.mjs <dir>/pool.ndjson <out.txt> owner|reader` at your
  base and your commit: the ALL row, the SHORT share, distinct descriptions, the top three repeated shapes, before → after.
- Owner and reader descriptions moved (counts), and the reason class of the moves (gloss raised; declarations).

## Your commit and your branch
ONE commit on your worktree's branch, by explicit paths, hooks ON. The integrator pushes your branch as
`trad4-u5-wip` while you work if the session's usage runs low: commit early, amend nothing, a second commit is allowed
only if the integrator asks for it.
