# TRAD-1 — THE HAND-BACK (handed over at the mark)

Written 2026-11-20 07:48 UTC (`date -u`). Branch `lane/trad-2026-11-20`. Commits: `39caf40ae` (proposal), `7e0dc118d`
(red arms as drafts), `30542f169` (the code), `8a5162b42` (the tests and the registers moved by cause), and this file's
commit. The seat passed its token mark (~400k by its own estimate; get_session reads 0); the chair seats a successor.

## THE HAND-OVER

### Built (and where)

- **The leaf** `src/domain/traditions/traditionDescription.js :: describeTradition(rec, settlement, { audience })` over
  **the table** `src/data/traditionDescriptionTable.js`. Returns `{ text, named: {houses, persons, powers, events}, parts:
  {keeper, origin} }`. Audience fails closed to `'reader'`.
- **CTR9, the shared page:** `src/domain/traditions/shownTraditions.js` (the tab's set rule once: mirror else genesis +
  custom, the admissibility filter, the calendar plan, the chip; `sharedTraditionRowsOf` for the save);
  `publicProseCompose.js` site `traditions` = a LIST of rows `{id, name, element, chip, when, text}` (the reader's text);
  no `PUBLIC_PROSE_VERSION` bump (a new site; no site's shape changed). `TraditionsTab.jsx`: `publicDossier` prints only
  the drawn rows ("No traditions are shared for X." where none is drawn); never derives from `id`. `OutputContainer.jsx`
  passes `publicDossier` and `playerView`. **The reader's text names no person at all** (the chair: no veto).
- **Most of CTR10 is ALREADY IN** (the chair's hand-over list assumed it was not started; it was done before the
  hand-over message arrived): every slot is a POOL drawn through `drawDeclared` (S1 leads: four an act; keeper frames:
  three each; cause frames: three each; economy: three each band); lines that presume a thing DECLARE it (`market`,
  `institution: smith`, `navigable`, `river`, `coast`); feast and fair leads and the harvest gloss are crisis-scoped
  (`CRISIS_SCOPED_ACTS`, `CRISIS_SCOPED_ELEMENTS`) with twins that say only what is kept (hunger: the feasts and
  "gives thanks for the harvest"; threat: "a fair of stalls and trading", "a fair with traders from outside"); the dead's
  cause needs the record's own severity `major` or `catastrophic`; the economy sentence is reworded (chief: "Nothing
  brings X more than market taxes."; lesser: "A good share of what X takes in comes from …"; only: "X lives by … alone.");
  the third (and fourth) fair and feast frames are in. Keeper houses are keyed by CATALOGUE ID (not name patterns) and
  read through `liveInstitutions` (a ruined house keeps no rite). The contest names NO power (the defence walker refuses
  a private guard/watch reader, and a war party is no keeper of games).

### Green (executed at `8a5162b42`'s tree, every run to a file and read by its count lines)

- My four files: **50 tests** (`tests/domain/traditionDescription.test.js`, `tests/lint/traditionDescriptionFrames.walker.test.js`,
  `tests/security/traditionDescriptionSharedPage.test.js`, `tests/security/traditionsPublicProse.pglite.test.js` — the
  last runs the net-current `_gallery_sanitize_public_json` in pglite: the rows come back byte for byte, `_seed` absent).
- Every test file of a module I changed (the tab's eight, the publicProse family, saves, every file naming OutputContainer,
  the composer, TraditionsTab or TraditionRow): **75 files passed, 1 skipped; 1,495 tests passed, 4 skipped**.
- `npm run typecheck:domain:strict` **exit 0** (the +2, then +8, cured); `npm run typecheck:ratchet` **exit 0**;
  `npm run lint` **exit 0**.
- `tests/lint` whole: **218 of 220 files passed; 3 tests red in 2 files** (below). Of the chair's eight, these are now
  GREEN: presumedThings (declarations + the strip ban: two unwraps restructured), negativeAssertionAnchor (20 sites
  carry `// anchored:` with their reason), ruinFilterRoster (live roster), defenceFactReaders (the guard/watch test
  removed), writerReach (re-frozen by its door `--write`: cohort 1385 → 1385), proseWiringCensus (re-written by its door:
  stamp only, 0 rows), domainAnyCastBaseline (the row type), the mutation manifest (three rows).

### Red, by name, with cause and intended cure

1. **`tests/lint/observedShapeReaders.walker.test.js`** (2 tests): `src/domain/facts/drawDeclared.js` gains four NEW
   "reads of a key no writer produces" on shape **`founding`** (`colour`, `id`, `text`, `twinOf`). CAUSE (inferred, not
   proven): the scanner resolves the pool my leaf hands `drawDeclared` (`ELEMENT_GLOSS[element]`, whose first key is
   `founding`) to the record's `history.founding` shape. INTENDED CURE: give the scanner a pool it can type — e.g. hand
   `drawDeclared` the pool through a typed local (`/** @type {ReadonlyArray<TraditionLine>} */`) or key the gloss table by
   a non-colliding container — then re-run `node scripts/check-observed-shape-readers.mjs` (must report 0 NEW). Do not
   bank rows.
2. **`tests/lint/sovereigntyLightingContract.walker.test.js`** (1 test): the lighting census counts test files; this lane
   adds four. CURE: re-take BY ITS DOOR on a clean tree (it refuses a dirty one):
   `LIGHTING_CENSUS_REFREEZE='TRAD-1' LIGHTING_CENSUS_NOTE='TRAD-1: four test files (the description, its walker, two security born tests)' npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js`,
   then run the walker plainly (green is the proof), commit `tests/lint/.lighting-census-baseline.json`.

### Not started

- **The successor's extension the chair named:** with EVERY address the curate screen can hide hidden (not only every
  hideable house), the drawn text byte-identical and naming nothing hidden. (The present INVERSION arm removes every
  hideable house and its cards' ties; extend it to `defaultVeilFor` + every `card:`/`field:` address via `applyVeil`.)
- **The search index's audience** (`src/domain/dossier/dossierSearch.js :: traditionsOf`): on a public view it still
  derives from `id` (the old wrong set) and indexes no description. Cure: on `publicDossier`, read
  `publicProseOf(view, 'traditions')` rows (name, chip, text); on the owner's views, add the description composed with the
  view's audience (`playerView` → reader). A born test on the public search.
- **The pool registers CTR10 names**: a row per pool in `docs/DESIGN_POOL_CENSUS.md`'s census and line register, the
  crisis-scoped register (`RETAKE_DECLARATION_REGISTERS=1 npx vitest run tests/domain/facts/declarationRegisters.test.js`
  — not yet run; it may or may not see `crisisScoped: true` passed to `drawDeclared` at a call site), and
  `scripts/census/pool-dominance` (the leaf draws at render, so the corpus may never draw these pools — measure, then say).
- **The measures after CTR10** and **the two sample sets for the owner** (thirty calm; twelve in crisis beside their calm
  readings). A ready script: the proposal's `tools/` plus `tools/measure2.mjs` (reads the src leaf; not yet run):
  per slot pool its draws, distinct lines, top share and every non-`drawn` resolution, read off the presumption ledger
  (`withPresumptionLedger`). Crisis towns: `generateSettlementPipeline({ …, selectedStressesRandom: false,
  selectedStresses: ['famine'|'under_siege'|'occupied'|'wartime'] })` (as `scripts/census/pool-dominance.mjs :: forced`).
- **The PDF** (`src/pdf/sections/Traditions.jsx`, mirror only): no description line yet.

### The measure before (proposal, `out/measure-owner.txt`, the first table) — and after: NOT re-taken on the final leaf

Before: 1,232 of 1,232 printed rites carry no description. The proposal's "after" (keeper 91%, cause 35%, economy 28%,
short 7.5%; worst shape 10 in 432) was the PROTOTYPE's; the final leaf differs (the contest names no power; persons only for
the owner; crisis twins; the dead's cause needs major/catastrophic). The successor re-takes it.

### Stored figures moved by this text (named, not signed)

`tests/components/dossierPhoneFloorAllViews.test.jsx`: World/Traditions mobile prose 1 → 5, desktop measured/sub14 1 → 5
(sub-floor counts 0). `scripts/.writer-reach-baseline.json` (door `--write`): `act on coreMotif` web-transitive N → R;
web-transitive 1073 → 1076; files +3. `docs/content/wiring-census.json` (door): stamp only.

### What a security reader should attack

The reader branch of `TraditionsTab.jsx` (does any path derive a set on `publicDossier`?); the composer site (it composes on
the OWNER's record with `audience: 'reader'`: wall two is by class — `isHideableHouse`, `isVeiledPower`, no person — so
the text is independent of a DM's per-card hides; the successor's curate-screen inversion proves it); the lit mirror's
`ownerLabel` on a full share (named only where the served powers hold that exact name and it is not veiled); the row keys
(`id, name, element, chip, when, text`: none matches `PRIVATE_KEY_RE`, proven through the SQL sanitizer).

### How my tools are run

`node docs/chair/2026-11-20/content/traditions/tools/trad-pool.mjs <dir>` births the 432-town pool (45 s). Then
`tools/measure.mjs <pool> <out.txt> owner`, `tools/samples.mjs <rows.json> <out.txt> 4`, `tools/shared.mjs`,
`tools/shared3.mjs` — all read the PROTOTYPE (`tools/describe.mjs`); point them at the src leaf for the final figures.
