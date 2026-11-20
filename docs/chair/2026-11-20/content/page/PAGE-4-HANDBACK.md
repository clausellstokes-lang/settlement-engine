# PAGE-4's hand-back (the display lane after PAGE-1)

Kept current at every push; last written 15:25 UTC 2026-11-20 (`date -u`). A successor needs THIS FILE and the briefs
under `docs/chair/2026-11-20/content/page/briefs/` only. The seat's prompt:
`git show origin/lane/chair-2026-11-08:docs/chair/2026-11-20/seventh/prompts/PAGE-4.txt`. PAGE-1's hand-back
(`PAGE-1-HANDBACK.md`, true at `a67e1b502`) holds the rulings 1-8 and the measures; this file adds what came after.

## Where it stands

- BRANCH `lane/page-4-2026-11-20`, cut at PAGE-1's final tip `a67e1b502` ("THE LANE IS YOURS", the chair 14:29 UTC).
- MERGED: CARD (S1, S2) from `lane/page-1-2026-11-20-card` `c03e48972` (merge `fe1ff5410`). Red 7 of 7 at base re-run by
  PAGE-4; green and the merge's gates green: see the table.
- MERGED: MAGIC (S5) from `lane/page-1-2026-11-20-magic` `dcb3b2744` (merge `fdec4d96f`; phoneChromeFloor's floors and
  the wiring census's producerIndexFiles re-measured by their doors at the merged tree: 620/863/665, 1437).
- MERGED: CARD-SERVED (the chair's condition (1) on CARD) from `page-4-card-served-2026-11-20` `e26476fa5` (merge
  `cf997215b`); the lighting census refrozen by its door for MAGIC's and CARD-SERVED's two new test files (`2cae388bc`).
- OUT: MAGIC-AUDIENCE (brief `briefs/MAGIC-AUDIENCE.md`, the chair's three conditions on MAGIC's Overview line), its
  builder on local branch `page-4-magic-audience-2026-11-20` from `65b324b5e`. ADDED TO IT (15:2x): the ONE red on the lane,
  `tests/lint/observedShapeReaders.walker.test.js` (2 tests): `magicMeasuresApart.js :: magicHeadlineScope` reads the raw
  `config.magicExists` (a key no writer produces, ceiling 0); the cure reads magic's existence through the page's leaf.
  Until it merges, tests/lint is 219/220 files at the lane tip.

## The rulings that came after PAGE-1's list (the chair's; each vetoable by the owner)

9. 13:22 (amended 13:50) THE SIDES AS SHOWN, the reader's rules: (1) a power's name ONLY through a row's `named` wording,
   filled through `governanceAccount.js :: powerNameInProse`; a row without `named` is never named; (2) only where the
   document in hand holds EXACTLY ONE power of the kind meant (the ruler: its governing power), else the row's words;
   (3) never the same power on two sides of one tension: the later side keeps its words; (4) `presumes` checked FIRST: a
   town lacking the house shows `without` (null `without` DROPS the side); (5) a side the generator wrote over follows
   the data file header's rules 2-4, rule 3 reading the slot row's `without` first; (6) every side as shown begins with a
   capital; (7) reads only the document given; a served document lacking a withheld power is a town without it; a guard
   that no surface prints a side except through the reader; the session sheet's three labels call it at the join (not
   PAGE-4's to build). Tests for (1)-(3) red first on a MADE-UP roster.
10. 14:17 CARD's words APPROVED (`words/PAGE-1-WORDS.md` at `bcac8ab77`). Two conditions at its merge: (1) the weight on a
   served page is ranked among the powers the document in hand holds; a power with no figure prints "first of <power>"
   with NO weight (test on a made-up served document, red first): brief `CARD-SERVED.md`; (2) the removed people-tab
   filter is accepted; a switch "Heads of powers" is added as its own small unit AFTER S1-S5 only if it costs under about
   thirty lines in the people tab; else left out and said so.
11. 14:23 THE SIDES TABLE: `src/data/tensionSideMeanings.js` and `tests/data/tensionSideMeanings.test.js`, taken BYTE FOR
   BYTE from `c5da1cfb3` on `origin/lane/page-5-2026-11-20` (`git show c5da1cfb3:<path> > <path>`), never edited (a wrong
   row goes to the chair). The census of side readers: `docs/chair/2026-11-20/content/page/SIDE-READERS.md` at `837394d8f`
   on that lane. A SECOND data file follows (`src/data/tensionCauses.js`, a trouble's sentence from causes the document
   holds): ONE module serves both, same surfaces, same guard.
12. 14:29 MAGIC's words APPROVED. Its Overview line may print to EVERY audience on three conditions, each a test at the
   merge: composed only from the document in hand; per audience, the chains it names are a subset of the chains that
   audience's Magic tab prints; listed below for the security reader.
13. 14:29 OUTPUT's drag clause: NO mirror of the generator's weights in a display file. The share in words stands. The
   clause names only a drag that is a plain fact of the record, no weight, no ranking: no market or fair -> "held back by
   having no market"; if the stored record carries the drags' own terms (`economicState.compound`) it reads those;
   else no clause. No generator threshold copied.
14. 13:32 and 14:29, every seat: nothing only in a container (unfinished branches pushed as `-wip`); never commit while a
   push of that branch is in flight; `git ls-remote` before every push; one builder at a time.

## The order

CARD (merged) -> CARD-SERVED -> MAGIC (`lane/page-1-2026-11-20-magic` `dcb3b2744`) -> OUTPUT and SAFETY as they arrive
(relayed by the chair; words to the chair before each merge) -> THE SIDES AS SHOWN (`briefs/SIDES.md` + rulings 9 and 11)
-> "Heads of powers" if under thirty lines.

## For the security reader at the join

- THE CARD'S WEIGHT reads ONE served field: `powerStructure.factions[].power` (via `cardPowers.js :: powersOf`), ranked
  only among the roster rows of the document in hand that carry a finite figure (`cardStandingRead.js :: powerWeightHere`).
- CARD-SERVED: a power the card's membership names but the document's roster does NOT hold is never named in the
  Standing row (`cardStandingRead.js :: cardFirstOfWeights`, fail closed); a held power with no figure prints
  "first of <power>" with no weight. NOT CURED HERE, FOR THE SECURITY READER: the card's separate power line
  (`cardPowers.js :: cardPowerLine`, pre-existing) names every power in the card's memberships whether or not the served
  roster holds it (CARD-SERVED's builder's measurement).
- MAGIC's Overview line (`magicMeasuresApart.js :: magicMeasuresApartLine`) prints to every audience on the chair's three
  conditions; their tests are MAGIC-AUDIENCE's (to be filled at its merge).

## Merge receipts

| Unit | Merge | Red at base | Green | Gates |
|---|---|---|---|---|
| CARD | `fe1ff5410` | 2 files failed, 7 of 7 tests (PAGE-4's re-run) | 8 files, 65 of 65 (the 8 test files the unit touched) | lighting 34/34; wiring `--check` exit 0; tests/lint 220 files, 3271/3271; typecheck:ratchet 0; domain:strict 0; lint 0 |
| MAGIC | `fdec4d96f` | 1 file, 2 of 2 tests (PAGE-4's re-run) | 11/11 with the floor census | see the row below |
| CARD-SERVED | `cf997215b` | 5 of 6 in its new file at `2e29d60ea` (PAGE-4's re-run on a `git archive`; the builder recorded 3 of 14 over more files) | at `2cae388bc`: 8 files 45/45 (CARD, CARD-SERVED, MAGIC and the view-model/journal tests) | at `2cae388bc`: lighting 34/34; wiring 0; tests/lint 219/220 files, 3269/3271 (observedShapeReaders, MAGIC's raw read: with MAGIC-AUDIENCE); both typechecks 0; lint 0 |
