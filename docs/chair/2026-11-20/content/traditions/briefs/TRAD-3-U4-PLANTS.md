# TRAD-3 · UNIT 4 — THE READER'S TEXT READS NO FIELD A LATER ACT OF THE DM CAN WITHHOLD (THE CHAIR'S TWO PLANTS)

Read `TRAD-2-COMMON.md` first; it binds you (read "TRAD-2" there as "TRAD-3", the integrator who reads your diff line by
line). Base: `lane/trad-3-2026-11-20` at the commit your worktree starts on (it carries unit 1, unit 1c and unit 2).

## Files you may change
`src/domain/traditions/traditionDescription.js`, `tests/security/traditionDescriptionSharedPage.test.js` (the
traditions' own born test), `tests/domain/traditionDescription.test.js`, and in `scripts/mutation-coverage-manifest.json`
ONLY the `rationale` string of the row `tests/security/traditionDescriptionSharedPage.test.js` (it must describe unit 2's
arms and yours; read unit 2's arms at the end of that file first). Anything else: STOP and report.

## The rule (CTR11, the seventh chair; vetoable by the owner)
THE READER'S TEXT IS A FUNCTION ONLY OF FACTS NO ACT OF THE DM CAN HIDE: every word it names AND every word it chooses,
over the rows and fields a reader can ever be served, by CLASS (never by name, never by today's settings). The owner's
page is unchanged. The reader's text is drawn at the owner's save (`shownTraditions.js :: sharedTraditionRowsOf`) and
served later, so a field a later hide or a later sweep can withhold must not reach it.

## The two findings, executed by TRAD-3 (scratch probes at 441ec3b32)
1. `history.founding.foundedBy` is an editable field, and veil-22's name sweep
   (`git show origin/lane/veil-22-2026-11-20:src/domain/display/gallerySecondHomes.js`, `sweepHiddenNames`: every
   non-floor string holding a hidden name leaves the projection) removes it when it holds a hidden house's name, while
   the reader's founding sentence (`CAUSE_FRAMES.founding`, chosen over `foundingBare` by foundedBy's presence) still
   prints it. Planted "Smuggling network" (a hideable house) into foundedBy of a born city: the reader's text read
   "...kept since Sanctavetum was founded by Smuggling network, 276 years ago."
   THE CURE, BY CLASS: for the reader, the founding clause never reads `foundedBy` (always the bare pool, its key and
   draw unchanged otherwise). The owner's page keeps "founded by …".
2. A house's `function` eye (`galleryVeil.js :: CARD_KINDS.institution.fields.function`: `tags`, `facets`,
   `serviceKeys`) removes the house's own `tags`, which the `market` fact reads (`facts/market.js ::
   isMarketInstitution`: a house's own tags, else the catalogue's for its NAME). Born houses' tags equal the
   catalogue's, so no born text moves; but a DM-authored house differs: a market rite in a town whose only market is a
   DM-authored house with `tags: ['market']` reads "…that celebrates the market." with the tags and drops it with them
   hidden (42 rites of 40 pool towns, constructed).
   THE CURE, BY CLASS: the reader's view (`readerView`) removes from every house every field the function eye can
   remove, read from the veil's own declaration (`CARD_KINDS.institution.fields.function`, IMPORTED, never copied; you
   edit nothing in galleryVeil.js), so every fact the reader's text admits by is read from a house's floor (its name).

## Red first (each arm run red at your base, its failing title and assertion quoted in your report)
- PLANT 1 (in `tests/security/traditionDescriptionSharedPage.test.js`): born towns (several tiers) holding a hideable
  house: write that house's name into `history.founding.foundedBy`; the rows the save draws (`sharedTraditionRowsOf`)
  and every reader description name nothing of it; AND the reader's rows are BYTE-IDENTICAL with foundedBy as born,
  deleted, and planted (the choice of pool does not depend on it). Control: the OWNER's founding sentence still names
  the planted value (the plant reaches the leaf). Non-vacuity: at least one drawn row carries a founding cause.
- PLANT 2 (same file): a DM-authored house (a name `catalogIdForName` does not know) with `tags: ['market']`, the town's
  only market house (remove the native market houses in the plant), a rite of the market element: the reader's rows are
  byte-identical with the house's function-eye fields present and removed (`applyVeil` with
  `field:institution:<id>:function` hidden, and by hand). Control: the OWNER's description does change (the plant
  reaches the fact). Non-vacuity: the town holds the rite.
- Update the census comment at the head of `traditionDescription.js` (S1's `market` now reads a house's name only for a
  reader; S3 founding: the reader never reads foundedBy) and unit 2's clause paragraph in the security file where it
  says the founding's "whether foundedBy stands" is safe: it was not; say so in one line.

## Measures for your report
- On the 432 pool (`node docs/chair/2026-11-20/content/traditions/tools/trad-pool.mjs <dir>`): how many READER
  descriptions move (base vs your commit) and how many OWNER descriptions move (must be 0).
- THE CONFINEMENT: `node docs/chair/2026-11-20/content/traditions/tools/born.mjs <repoRoot> <out.ndjson>` in an archive
  of your base and at your commit, then `cmp` (1,245 documents byte-identical expected).

## Item 3 is NOT yours yet
The dead's cause printing `event.name` is the same class (the sweep removes a whole event whose name holds a hidden
name); the chair is ruling on it. Do not touch it unless TRAD-3 sends you the ruling.
