# TRAD-2 · UNIT 1 — THE LEAF'S LINT REDS, BY CAUSE, AND HOUSES THROUGH THE HOUSE'S HELPER

Read `TRAD-2-COMMON.md` first; it binds you. Base: `lane/trad-2-2026-11-20` at the commit your worktree starts on.

## Files you may change
`src/domain/traditions/traditionDescription.js`, `src/data/traditionDescriptionTable.js` (only if a cure needs it),
`tests/domain/traditionDescription.test.js`, `tests/lint/traditionDescriptionFrames.walker.test.js`. Anything else:
STOP and say why in your report.

## What TRAD-2 measured at the base (2cc20afb1), executed
- `tests/lint/observedShapeReaders.walker.test.js`: 2 tests red. `node scripts/check-observed-shape-readers.mjs` exits
  1 with 8 NEW identities in two files TRAD-1 did NOT change: `src/domain/facts/drawDeclared.js` (`text`, `twinOf`,
  `id`, `colour` "on founding") and `src/domain/facts/factVocabulary.js` (`needs`, `excludes`, `crisis`, `tags` "on
  founding"). `--report` shows the receivers: `(line).text`, `(l).twinOf`, `(line).id`, `(line).colour`, `o.needs` …
  Bisect by file: reverting `traditionDescription.js` alone makes all 8 vanish; reverting the table, `shownTraditions.js`,
  `publicProseCompose.js` or `TraditionsTab.jsx` does not. These receivers are DECLARED LINES, not
  `history.founding`: the scanner's name-prior grounding is misled by something in the leaf. NOT the cause (each
  tried, still 8 NEW): renaming the table's `founding` keys in `ELEMENT_GLOSS` and `CAUSE_FRAMES`; writing
  `CAUSE_FRAMES['founding']`; renaming the leaf's local `const founding`.
- `tests/lint/drawDeclaredKeys.walker.test.js`: 2 tests red ("every caller passes a key"; "a generator-time key leads
  with the stream seed or names the settlement; a display key uses its seed or identity; the rest are listed"), both on
  `src/domain/traditions/traditionDescription.js :: draw` (the call passes `key` as a shorthand property, and the key —
  `${rec.id}#…` — carries no settlement identity). TRAD-1's hand-back missed this red.
- The leaf names a house through its own `houseInProse` (`institutionHouseLabel` then its own stripping and article
  rule), not through `src/data/houseSentenceName.js :: houseSentenceName`. Example of the breach: a town holding the
  catalogue's "Colosseum/arena" keeps a contest there; the private rule prints "the Colosseum", the house's prose form
  is "Arena".

## What you do
1. OBSERVED SHAPES: pin the exact construct in the leaf that grounds those receivers to `founding` (the scanner is
   `scripts/lib/legacy-reader-shape-scan.mjs`; read it, edit nothing under `scripts/`). Cure it IN THE LEAF so the
   scanner grounds correctly (e.g. a typed local or a renamed binding, whatever the evidence shows); the checker must
   report 0 NEW and the walker go green. Never `--write`, never a row. State the construct and why it misled the scan.
2. THE DRAW KEY: the call passes `key:` explicitly, and the key carries the settlement's identity in the house's own
   display convention (read how the other display callers the walker accepts build theirs). It must be the SAME on the
   owner's record and on whatever the save draws for the reader (the composer runs on the owner's record), and stable
   across a save and a reload. Do not spell a variable to satisfy the regex: the key must truly carry identity. The pick
   will move for some rites: count, on the 432-town pool
   (`node docs/chair/2026-11-20/content/traditions/tools/trad-pool.mjs <dir>`), how many owner descriptions change
   between the base and your tree, and report it (rendered text only; nothing stored moves).
3. HOUSES: name a house through `houseSentenceName` (keep what the leaf strips that the helper does not cover, e.g. a
   "Multiple …" plural, only if the reason is stated in a comment by symbol; if the house's label needs a rule the
   helper lacks, STOP and report rather than extend a private copy). RED FIRST: an arm in
   `tests/domain/traditionDescription.test.js` with a planted "Colosseum/arena" house and a contest rite: red on the
   base ("the Colosseum"), green after ("the arena").
4. Keep every existing arm of the four traditions test files green, and `tests/security/traditionDescriptionSharedPage.test.js`
   green (run it; do not edit it).
