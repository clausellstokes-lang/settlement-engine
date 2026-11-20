# PAGE-4's brief: CARD-SERVED (the card's weight on a served page; the chair's condition (1) of 14:17 UTC)

Written by PAGE-4, 2026-11-20 14:31 UTC (`date -u`). It binds ONE builder under the common law of `BUILD.md` beside this
file (render only, born documents hashed equal at base and tip, red first, authored lines in the report, pinned renders
by their own doors, gates to files, ONE commit, no push, no pull request). Base: `lane/page-4-2026-11-20` with CARD
merged (`cardStandingRead.js` and its tests are CARD's, merged from `c03e48972`).

## The chair's condition, verbatim (14:17 UTC)

"THE WEIGHT ON A SERVED PAGE: it is ranked among the powers the document in hand holds; if that document carries no
power figure for a power (a served page may withhold raw measures), the row prints 'first of <power>' WITH NO WEIGHT:
a test on a made-up served document, red first."

## Today (read `src/domain/display/cardStandingRead.js` WHOLE)

`cardFirstOfWeights` LEAVES OUT a power with no figure (`powerWeightHere` returns null), so a card first of such a power
prints NO Standing row at all (the card, the PDF's `standingLine`, the Foundry journal's `firstOfLine`). The ranking
already reads only `powersOf(settlement)`, the document in hand (`powerStructure.factions[].power`).

## The cure (in `cardStandingRead.js` and its callers only as needed)

1. A power the card stands FIRST of that the document's roster (`powersOf`) HOLDS but gives no finite `power` figure:
   the part is kept with NO weight. The card prints "first of <power>"; the Foundry row "First of: <power>"; the PDF's
   Standing "first of <power>". Two parts mix: "first of A, the strongest power here; first of B".
2. FAIL CLOSED: a power the card's membership names but the document's roster does NOT hold (a withheld power on a
   served document) prints NOTHING in this row: never its name. (This reader must not name a power the document in hand
   lacks; measure first whether `cardPowerParts` already filters, and say so.)
3. The ranking is unchanged: only powers with a figure are ranked; a figureless power is not counted.
4. No new words beyond dropping the weight clause. No file outside `src/domain/display/cardStandingRead.js`,
   `src/pdf/lib/viewModel.js`, `src/foundry/journalPages.js`, `src/components/new/npcComponents.jsx` and their tests.

## The tests (red first, on MADE-UP documents, never a quoted pool sentence)

(a) A made-up served document: three powers, one carrying no `power` field; a card first of the figureless one prints
"first of <it>" with no weight (card render AND `cardStandingLine` AND the view model's `firstOfLine`). Red at base.
(b) A made-up served document whose roster lacks a power the card's membership names (rank 1): the Standing row
names no such power (and is absent when it was the only one). Red at base if today names it; else a pin, said so.
(c) The weighted case unchanged (CARD's own tests stay green untouched).

## The report (at most 400 words)

The commit; the surfaces changed (file :: symbol); red-then-green receipts (paths under
`docs/chair/2026-11-20/content/page/build/CARD-SERVED/`); the born-hash proof's two counts (the 300 and the census's
720; you may reuse CARD's `build/CARD/bornHash.mjs`); each gate's count line; the answer to 2's measurement.
