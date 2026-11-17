# BRIEF-BIRTH-1 · a house that buys its material has it brought in: the import written at the birth, the coast, the worked-out ground

The chair, 2026-11-17. ONE BUILDER SEAT. You make exact what a read-only audit measured and prototyped
(`lane/birth-audit-2026-11-17` at 7adfa7055: `docs/chair/2026-11-17/birth/BIRTH-AUDIT-HANDBACK.md`, `PROTOTYPE.patch`, the
probes and their outputs beside it). NO PERSON, TIE, NAME OR HOUSE MOVES IN ANY TOWN BY YOUR WORK: you edit no draw.

## AMENDED 2026-11-17, about 04:30 UTC, ON THE OWNER'S WORD (it overrides the words below wherever they differ)

The owner, in the chair's chat, of a house whose material is bought in: a siege must not exclude it: "those failings
are simply true because in normal times it would be bought in ... rather than reworked." SO: THE IMPORT IS THE TOWN'S
ORDINARY-TIMES ARRANGEMENT. It is written for a buying house whose every input is `missing` WHEREVER THE TOWN'S ROUTE IS
CONNECTED, UNDER A SIEGE TOO; only an ISOLATED route (no route even in ordinary times) excludes it. Under a siege the
page then says the true thing by the leaf's existing rule: the house reads "Curtailed by the siege." (never a short mark
with no cause) and the import reads as every import does while the siege lasts. The words "a connected road no siege
shuts" (the ruling and item 2) and "no import word is written under a siege" (item 5's second arm) ARE WITHDRAWN: the
guard's second arm holds that no import word is written on an isolated route, none twice, and that a buying house with
no local source in a besieged town on a connected route carries the siege's mark and not the short mark. Item 6 reads
besieged towns among its twenty. The seat was sent these words at about 04:30 to join its running turn.

## The ruling you build (the chair's, BR2, vetoable by the owner)

By the audit's count at the joined line's cfc2b680a: of the 2,066 houses the page marks short in the census's 720 towns,
2,058 are BORN short and 8 are the crisis's; a born-short house stands in 464 of the 720 towns and in 151 of its 225
towns with no crisis and a connected road. THE RULE BY KIND OF HOUSE:
- (i) A HOUSE THAT BUYS AND WORKS ITS MATERIAL (a potter and clay, a fuller and wool, a smith and iron, a vintner and
  grapes: the audit's table `out/q2.table.md`, its list `BUYS_AND_WORKS` in the prototype) HAS IT BROUGHT IN where
  nothing here answers it and a connected road no siege shuts reaches the town: THE IMPORT IS WRITTEN AT THE BIRTH (the
  audit's R2), in the imports list's own words, and the page then reads that house as it reads every house on an
  imported input (at work; "Curtailed by the siege." under one).
- (ii) A HOUSE THAT IS THE SOURCE OF ITS MATERIAL (a stone quarry, a charcoal burner, a dairy farmer, a salt works, the
  mines and landings) IS NEVER FED BY AN IMPORT OR BY THE ROAD: an import feeds a buyer, never the work on the ground.
  ON A COAST THE SEA IS THE SALT WORKS' GROUND (R5). On a ground of its own that the record has spent it is read as
  WORKED OUT (R4): the page's gap line says so and no longer says its material "reaches" it from elsewhere.
- THE SOURCE HOUSE AT ITS DRAW (the audit's R3b) IS NOT YOURS: it re-draws people in about a quarter of the census's towns
  and is held for the owner's word. Your guard names what it would have cleared as counted exceptions.

## What you read first, and no more

1. THIS FILE.
2. `git fetch origin lane/birth-audit-2026-11-17`; from 7adfa7055: `docs/chair/2026-11-17/birth/BIRTH-AUDIT-HANDBACK.md`
   WHOLE (its Q3 is your map of the code; its Q4 gives each rule's measured effect; its Q5 the edits and the guard),
   `PROTOTYPE.patch` (your starting point, NOT your product: it carries an environment switch and rules you do not
   build), `out/q2.table.md` (the kinds: THE OWNER'S TABLE TO STRIKE ROWS FROM: keep it readable by a person who knows
   no code). Its probes are yours to run and to extend in files of your own.
3. On the chair's lane (`git fetch origin lane/chair-2026-11-08`): `docs/chair/2026-11-14/briefs/BRIEF-BAR6-SEAM.md`:
   ONLY its rules S1 to S9 (they bind you as a seam seat is bound, except where this file says otherwise) and its
   section SEAM-ECON (the seat whose final tip is your base: what it did to two of your files);
   `docs/chair/2026-11-16/bar6/RULINGS-AFTER-SEATING.md` (EG1 above all: a fact the eager closure reads imports no
   module pinned lazy; AX1; PL1).

## Your base, your branch, your files

YOUR BASE is the tip your prompt names (the joined line with the seam's ECON seat's final commits, or the line after the
seam has landed). Your one branch is `lane/birth-1-2026-11-17`. You merge nothing.
YOUR FILES: `src/domain/facts/houseKinds.js` (NEW: an import-free leaf: the kinds by catalogue id, the source houses'
grounds, the imports' words; no environment switch); `src/generators/resourceGenerator.js`;
`src/domain/facts/houseInputAtHand.js`; `src/domain/display/validationOnPage.js` (item 4 only); your guard
`tests/domain/birthKindsLaw.test.js` (NEW); the tests your cure makes untrue, RE-KEYED BY IDENTITY (S5). NOT YOURS: any
draw (`src/generators/steps/assembleInstitutions.js`, `src/generators/cascadeGenerator.js`, `steps/cascadePass.js`),
`src/generators/steps/assembleSettlement.js`, `vite.config.js`, `package.json`, the economy's files, the trade lists'
display. NO NEW FIELD ON THE SAVED RECORD (the import joins `economicState.primaryImports`, which exists). NO NEW ATOM.

## Your items, in this order

1. THE LEAF. `houseKinds.js`: the (i) ids, the (ii) ids with the grounds that give each, the import word of each chain
   key's good, each with the audit's one line of reason beside it. Add the luxury goods quarter's word (the audit's four
   houses left). It imports nothing (EG1).
2. THE IMPORT AT THE BIRTH (R2), at `resourceGenerator.js :: generateResourceAnalysis`, before the gaps are written:
   for each live native house of kind (i) whose every input the one reader answers `missing`, on a connected road no
   siege shuts, the input's word joins `economicState.primaryImports` (once; a word already there is not doubled: the
   sixth read flagged a doubled import label elsewhere). The gap is then written `imported`. ALSO A BUYER ON A SPENT
   GROUND WITH NO SHORTAGE IMPORT (the audit's "what is left" 2: 169 houses in 91 towns of the 720): the ground no
   longer answers, so the same rule applies; use the list's shortage word where `resourceSemantics.js ::
   resourceShortageImport` gives one. Measure it apart and say what it moves.
3. THE READER (`houseInputAtHand.js`): (a) THE COAST (R5): `desertSalt` is `local` on a port route or coastal terrain;
   (b) NO IMPORT AND NO ROAD FEEDS A SOURCE HOUSE: a house of kind (ii) is answered only by its ground. COUNT BEFORE YOU
   KEEP (b): the audit says 16 salt works on no brine are fed today by a "Salt" import and 57 stone quarries on no stone
   answer their own input (`LOCAL_PRODUCERS`); and under R2 alone 11 charcoal burners would read a cooper's bought
   "Timber" as their own. Say how many houses (b) newly marks, in which towns, and what the mark says there. IF (b)
   NEWLY MARKS MORE THAN IT CURES IN CALM TOWNS ON A CONNECTED ROAD, keep only the part that stops a buyer's import
   feeding a source house (the eleven) and leave the rest BY NAME for the held draw seat.
4. THE WORKED-OUT GROUND (R4), at `validationOnPage.js :: resourceGapLines`: a source house on its own spent ground reads
   the spent ground (the audit: 45 quarries print "No stone reaches the stone quarry." beside "Dressed stone (local
   quarry depleted)"), in the words the mark and the Depleted list already use. The exports and the chain states of a
   spent own ground are the economy's: NAME them, with the audit's counts, and leave them.
5. THE GUARD, `tests/domain/birthKindsLaw.test.js`, over fixed seeds of the census and of the 150 (say which, and why
   they are enough): "in a town with no crisis and a connected road, no house of kind (i) is marked short; none of kind
   (ii) but on a spent ground of its own, or as a counted exception the held draw seat owns" (the audit counts those
   after R2 and R5: dairy farmer 14, salt works 8, charcoal burner 4 in the 720). Its positive control: it FAILS at your
   base. AND A SECOND ARM: no import word is written under a siege or on an isolated route, and none twice.
6. THE PAGE AFTER YOU, READ: render twenty towns of your choice across the tiers where your import was written and READ
   the Economics tab's Imports line, the house's card, the Resources tab and the Outlook: does any line now say
   something false (an income row that says the town "imports nothing"; a hook that says the carts are late in a town
   the page calls well supplied; "Needed, and not brought in" beside the import)? Each such pair is named in your
   hand-back with its count over the 720; you cure those that are in your files and leave the rest by name.

## Your measures (S6), before and after, with the audit's probes

`q1census.mjs` (marks by cause), `q4rules.mjs` (born-short in calm connected towns: the audit's base 563 houses in 144
towns of the 720 and 115 in 38 of the 150), `fieldDiff.mjs` (THE PROOF THAT NO PERSON, TIE, NAME OR HOUSE MOVES: run it
over the 720, the 150 and the 525 reference configurations and print its table in your hand-back), and the chair's
runners over the 150 at your base and your tip (`docs/chair/2026-11-16/bar5/AUDIT/runB.mjs`,
`docs/chair/2026-11-16/bar6/AUDIT/runC.mjs` to `runF.mjs`): no rule's count rises. A DECLARED MOVE (B5): the stored
families you move and how many of the 525 (the audit: imports 141, gaps 116, plot hooks 1, arrival scene 1).

## Your net, your hand-back

Your net is S7's, with ONE `npm run build` and `npx vitest run tests/build/vendorPdfLazy.test.js
tests/build/bootSmoke.test.js` (you add a facts leaf and change imports in one). Stored figures are the close's (S8).
Hand-back `docs/chair/2026-11-17/birth/BIRTH-1-HANDBACK.md`: your items (done with the count before and after and its
guard, or left with the reason), `fieldDiff`'s table, the new lines a reader can see (each with three towns), the pairs
of item 6, the books your cure moves, what is left for the held draw seat. Budget: hand back at 450,000 of your count.
One line to the chair at the end, 150 words at most.
