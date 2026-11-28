# FAULTS-ROWS hand-back

Seat FAULTS-ROWS of the round FAULTS (BRIEF-FAULTS, rulings FR3 and FR4; then the chair's FR12, which gave me the three I
had left, and FR14, which gave me two one-line edits). Base d75011e68 (FAULTS-NEED's atom at the rehearsal base 4288049ba);
branch `lane/faults-rows-2026-11-18`, tip 70ad007d1 and the hand-back after it.

| commit | item |
|---|---|
| 92bf8283a | 1 · the fair's two lines (FR3) |
| 4a4fb286b | the guard's twin check anchored |
| 885ab85a4 | 4 · the fair's third line (FR12 (1)) |
| 4ead74772, d581e6d15 | 5 · the luxury quarter's two lines; their colour marks struck (FR12 (2)) |
| 44558c5f5 | 6a · the fish swap's one fact in one leaf (FR12 (3)): no record moves |
| 3e78dc113 | 6b · the atom `fish bought in` and the fish market's card (FR4, FR12 (3)) |
| 385124a7e | FR14 (1) · `assembleSettlement`'s `mutates` gains `institutions`: no record moves |
| 56b82c6cc | FR14 (2) · the goods roster's row for `fishBoughtIn.js` |
| 70ad007d1 | 6 · the fish twin names no market (its first wording was a fresh line of the presumed-things door) |

Files: `src/data/institutionDescVariants.js` (the late sets); `src/data/institutionDescColour.js` (two marks struck, FR12
(2)); `docs/census/declarations/institutionDescVariants.INSTITUTION_DESC_VARIANTS.json` (the two ledger rows, CL18's form);
NEW `src/domain/facts/fishBoughtIn.js`; `factVocabulary.js`, `factLayers.js`, `factsOf.js` (the atom's lines);
`src/generators/steps/generateNarratives.js` (the one hunk of `boughtFishRowsInPlace` and its two import lines);
`src/generators/steps/assembleSettlement.js` (one word, FR14 (1)); `src/domain/goods.schema.js` (one roster row, FR14 (2));
tests: NEW `tests/generators/faultsRows.test.js` (the guard), `tests/generators/houseDescLateReRead.test.js` (the count,
re-keyed 30 → 36 in four dated steps), `tests/helpers/calmFactsDouble.js` and `tests/domain/crisisBlindDossierProse.test.js`
(the atom's two helper rows).

## 1. The items

Every cure is a LATE SET (`DESC_LATE_SIBLINGS`, read by `assembleSettlement.js :: readHouseDescsLate` after the last roster
write): the need list and the bought fish are settled after the description draw, so the late re-read is the line's place.
No draw moves (the same roll, the same variant index everywhere). Each set is the original and ONE TWIN.

### Item 1 · THE FAIR (FR3), cured

| the line | its twin |
|---|---|
| "Regional merchants. Luxury goods available." | "A yearly fair for regional merchants. The luxuries the town wants do not reach it." |
| "Merchants from across the region, and luxuries to be had." | "A yearly gathering of the region's merchants, though the luxuries the town wants do not come with them." |

The original `excludes: ['crisis: under_siege', 'need not brought in: luxury']`; the twin `needs: ['need not brought in:
luxury'], excludes: ['crisis: under_siege']`. THE ORDER OF THE TWO DECLARATIONS: the siege is the draw's
(`DESC_VARIANT_SIBLINGS`): a town under siege at the draw stores the siege twin, which is no late key, so the late re-read
never reaches it (r2s-under_siege-town-2: the siege twin beside "Needed, and not brought in: Quality textiles"). Each late
member also declares the siege off, so a siege settled after the draw keeps the original as at the base (noted for the birth
check) and never takes the twin's "held" (no such town in the three populations).

FALSE at the base, the twin at the tip: the thirty bar0-town-calm-rand-45 (C32296); the 150 none; the 720 r2r-town-10,
r2r-town-56 ("Quality textiles", of the page's own luxury class), r2r-town-57, r2s-recently_betrayed-town-0,
r2s-monster_pressure-town-3, r2s-wartime-town-2 (auditor J counted 5; the atom reads 6). STANDS (no luxury unmet): 1 of the
thirty, 4 of the 150, 16 of the 720 (r2r-town-31 and -48 beside salt, -49 beside gold/silver ore, -54 beside livestock …).

### Item 4 · THE FAIR'S THIRD LINE (FR12 (1)), cured

"A yearly draw for regional traders, with fine goods on offer." → "A yearly draw for regional traders, though the fine goods
the town wants do not reach it." The same declarations as item 1. FALSE at the base: the thirty bar0-town-calm-rand-46,
bar0-town-occupied-rand-46, -47; the 150 bar0-town-occupied-rand-35; the 720 r2r-town-47, r2r-town-50, r2s-famine-town-1,
r2s-indebted-town-1. Stands beside gold/silver ore and salt (bar0-town-occupied-rand-31, bar0-town-calm-rand-41) and with no
need unmet (bar0-town-occupied-rand-34, -40).

R7 for the fair: the draw pool `town|Economy|Annual fair` (the catalogue line and its two variants) keeps its three lines in
every town; each twin takes its own original's place.

### Item 5 · THE LUXURY QUARTER'S TWO LINES (FR3, FR12 (2)), cured

Both were marked colour lines ("read; presumes nothing") and the marks were false. STRUCK (`institutionDescColour.js`, the
two lines only, given by FR12), and the two ledger rows of
`docs/census/declarations/institutionDescVariants.INSTITUTION_DESC_VARIANTS.json` (`city|Crafts|Luxury goods quarter#0`
and `#1`) carry the late declaration in CL18's form: `colour: false` with a `colourReadBy` note naming it (recorded there, not
in `excludes`, as every late-declared key of that ledger is). `tests/data/colourMarks4h.test.js` stays green (the column holds
exactly the ledger's colour texts).

| the line | its twin |
|---|---|
| "Silks, spices, and other precious goods." | "Fine goods of every kind, though the spice or silk the town wants never arrives." |
| "The trade in silk, spice, and precious things." | "Fine things are traded here, though the spice or silk the town wants does not reach it." |

The original `excludes: ['need not brought in: spice', 'need not brought in: silk']` (the draw declares no siege, so none is
declared); the twin declares nothing (it is true wherever either good is unmet). The late re-read speaks the tier's noun, so in
a city it prints "the city wants". The second twin was first written "The trade in fine things, though …" (4ead74772): auditor
J's offer reading takes "the trade in" beside "spice" for an offer, so d581e6d15 says the same without the offer phrase.

FALSE at the base, the twin at the tip. The second line: the 150 bar0-city-wartime-rand-28, bar0-metropolis-calm-rand-34;
the 720 (auditor J's seven) r2r-city-29, r2r-city-48, r2r-city-50, r2r-metropolis-4, r2s-politically_fractured-metropolis-1,
r2s-monster_pressure-metropolis-2, r2s-wartime-city-0. The first line: the 150 bar0-city-under_siege+famine-rand-29; the 720
SIXTEEN (my first hand-back said 13 and listed 16): r2r-city-17, -33, -47, -49, -57, r2r-metropolis-18, -26, -37, -51, -53,
r2s-indebted-city-3, r2s-insurgency-metropolis-0, -2, r2s-mass_migration-city-0, -2, r2s-mass_migration-metropolis-1. No town
of the three needs silk. THE ORE TOWNS STAND (the chair's ruling on my reading): gold/silver ore is the mint's want, not the
quarter's wares (r2r-city-21, -23, -30, -36, r2r-metropolis-0, -1, -17 …).

### Item 6 · THE FISH MARKET'S CARD (FR4, FR12 (3)), cured on ONE NEW ATOM

NEW VOCABULARY (on the owner's veto list): `fish bought in`, a presence, beneath `trade at work`'s fish key in
`factVocabulary.js` (with its `FactsLike` property), its leaf row in `factLayers.js` (layer 4; reads `config`,
`economicState`, `institutions`, `resourceAnalysis`), its getter in `factsOf.js`, its calm double (`false`: a calm place
lands its own catch) and its presence setter.

ONE FACT, ONE READER: `src/domain/facts/fishBoughtIn.js :: fishBoughtIn(record)`, A NEW SMALL LEAF (not `supplyStory.js`:
that file holds both readings but deliberately reads no `resourceSemantics.js`, its shortage words handed in by callers).
True where the fish ground is used up (`supplyStory.js :: usedGroundOf(record, 'fish')`) AND the imports hold its shortage word
(`importsHold` of `resourceShortageImport(ground)`). It reads the imports first: no import, no fish bought in. The verdict is
the same, and the layer walker sees the read on its grid. Import-clean for the eager core (EG1): `supplyStory.js` and
`resourceSemantics.js` ride it already. `generateNarratives.js :: boughtFishRowsInPlace` reads this function in place of its
two calls (44558c5f5): AT THAT COMMIT ALONE the 900 births and the 525 are byte-equal to the commit before it.

The card: "Where the day's catch is sold, from an open stall or a small covered market. Prices sink fast. Fish will not wait."
→ "Salted and dried fish is sold here, from an open stall or under a small roof. No fresh catch comes in." The
original `excludes: ['fish bought in']`; the twin `needs: ['fish bought in']`; its draw declaration (`navigable`) stands.
FALSE at the base: bar0-village-calm-rand-47 (the thirty; its market's row "Preserved fish"): the twin at the tip. The live
fishery r2r-village-2 (the 720, "Fresh fish retail") keeps the line. Every idle fish town's card and mark byte-equal (no fish
card or row of the 900 moves but the one). THE ATOM IS THE SWAP: over every fish-market town of the 900 at the base, 36
bought (each "Preserved fish", no "Fresh fish retail"), 307 not (99 sell "Fresh fish retail", 4 of them idle; 208 inland
markets carry "Preserved fish" by the roll's own inland swap, not bought); the guard holds the atom to the leaf and the row on
the 73 fish-market towns of the thirty's and the 150's shapes.

## 2. The rules, before and after

Auditor J's runner (`runJ.mjs`, LAW 11; `--controls` on the thirty) and K's (`runK.mjs`, LAWS 12 to 15) over PAGE-COPY renders
(census3.sh, `--count-only`) of the thirty, the 150 and the 720 at the base and at the tip (d581e6d15's text; FR14 moves no
record).

| rule | the thirty | the 150 | the 720 |
|---|---|---|---|
| 11e.offer · luxury (the fair) | 1 → **0** | 0 → 0 | 5 → **0** |
| 11e.offer · spices (the quarter) | 0 → 0 | 2 → **0** | 7 → **0** |
| 11b.fish · the fish card | 1 → **0** (11b.fish 4 → 3) | 0 → 0 | 0 → 0 |
| the fair's third line beside an unmet luxury (my count; J reads none) | 3 → **0** | 1 → **0** | 4 → **0** |
| the quarter's first line beside unmet spices (my count; J reads none) | 0 → 0 | 1 → **0** | 16 → **0** |
| LAW 11, all (instances) | 14 → 12 | 27 → 25 | 128 → 116 |
| LAWS 12 to 15 (runK) | 9 → 9 | 75 → 75 | 247 → 247 (byte-equal outputs) |

No rule of either runner rises. THE CONTROL C32296 (bar0-town-calm-rand-45): FOUND at the base, CLEAR at the tip. The controls
run exits 3 at the base and at the tip alike (other seats' STANDS controls; "controls off" 14 → 15 is C32296 leaving).

## 3. Every new line, with three towns it prints in (the owner's veto list)

| the new line | three towns |
|---|---|
| "A yearly fair for regional merchants. The luxuries the town wants do not reach it." | bar0-town-calm-rand-45, r2r-town-56, r2r-town-57 |
| "A yearly gathering of the region's merchants, though the luxuries the town wants do not come with them." | r2r-town-10, r2s-monster_pressure-town-3, r2s-wartime-town-2 |
| "A yearly draw for regional traders, though the fine goods the town wants do not reach it." | bar0-town-calm-rand-46, bar0-town-occupied-rand-35, r2r-town-47 |
| "Fine goods of every kind, though the spice or silk the town wants never arrives." (spoken "the city", "the metropolis") | bar0-city-under_siege+famine-rand-29, r2r-city-17, r2r-metropolis-18 |
| "Fine things are traded here, though the spice or silk the town wants does not reach it." (spoken likewise) | bar0-city-wartime-rand-28, r2r-city-29, r2r-metropolis-4 |
| "Salted and dried fish is sold here, from an open stall or under a small roof. No fresh catch comes in." | bar0-village-calm-rand-47 (its one town in the three populations) |

Each prints on the house's three surfaces (the Institutions tab, the card, the PDF), as its original did. The shared page
prints the owner's card (N4: the guard's `toPublicSafe` arms). Neither door shows a fresh line of mine (R9, section 6). New
vocabulary: `fish bought in` (item 6).

## 4. Declared moves (R5) · field family `institutions[].desc`

- THE STORED RECORDS OF THE 900 (the thirty, the 150, the 720), base against tip: 858 byte-equal; **42 move**, each in ONE
  house's `desc` only (every other byte of the record equal): the thirty 5 (bar0-town-calm-rand-45, -46, bar0-town-occupied-rand-46,
  -47, bar0-village-calm-rand-47), the 150 4 (bar0-town-occupied-rand-35, bar0-city-wartime-rand-28, bar0-metropolis-calm-rand-34,
  bar0-city-under_siege+famine-rand-29), the 720 33 (the towns named in section 1).
- THE PRINTED PAGE (every tab, the Tonight sheet, the PDF, the journal): the same 42 dumps differ, each only by its card's
  lines; EVERY OTHER HOUSE'S DESCRIPTION, IN EVERY TOWN, BYTE-EQUAL; every fish card and mark but the one byte-equal.
- THE 525 (the golden's own procedure, `sha256(JSON.stringify(settlement))`, hashed in scratch, the manifest not written):
  **0 of 525 move**, at every commit of the branch.
- No draw moves. No new field on the saved record; nothing reaches `settlementMigrations.js` or `mutateEntities.js`. 44558c5f5
  (the leaf the swap reads) and 385124a7e (the declaration): each proved byte-equal on the 900 and the 525 against the commit
  before it.

## 5. Stored figures my work moves (the close's; I re-take none)

- `tests/generators/houseDescLateReRead.test.js`: the late table's count 30 → 36 (re-keyed in my commits, four dated notes).
- THE STEPS' DECLARATIONS (FR14 (1), `assembleSettlement`'s `mutates` gains `institutions`), each red at the tip with this
  message, the close's to re-take:
  - `tests/lint/generationForkRegistry.contract.test.js` (A2): "the register declares one row per live pair: expected 77 to be 78".
  - `tests/generators/generationForkCensus.test.js` (A3e, red at the tip only): "the measured pair set is the registry's, not a
    literal: expected 78 to be 77" (A1, A4, A6 red at both, the same messages).
  - `tests/lint/heldKeyWriterCensus.walker.test.js` (A2): "a held-key writer step appeared or retired: expected [ …(15) ] to deeply
    equal [ …(14) ]" (assembleSettlement now a declared writer of `institutions`).
  - `tests/joins` (red at the tip only): "the declared institution producer/mutator chain matches the canonical order: expected
    [ 'assembleInstitutions', …(6) ] to deeply equal [ 'assembleInstitutions', …(5) ]".
- `tests/lint/poolDominance.register.json` (not touched): the pool `ledger:institutionDescVariants:DESC_LATE_SIBLINGS`, red at
  both: top1 0.8107 over 2002 draws in 1154 towns → 0.8102 over 2539 draws in 1218 towns (my seven keys join the pool; the
  ceiling 0.6364 unmoved). The pools I touch: `DESC_LATE_SIBLINGS` only.
- `tests/lint/presumptionClasses.register.json` (the close's `--shrink`): stale rows 153 → 154: the fish card's row ("plenty",
  1cac5c3cc9305cf8) is stale: the card now declares what it presumes. Hits 1793 → 1792. No fresh line (8 → 8).
- `tests/property/espionageDormancyFence.test.js` (red at both, "THE DRIVEN CORPUS MOVED"): its 360-town hash 8938469f… at the
  base → a8fb5418… at the tip (the stored 8e5881d6…): my desc moves.
- `tests/build/generationWorkerLazy.test.js` (red at both): the worker bundle 2540378 B → 2543561 B (ceiling 2356121 B).
- `tests/lint/sovereigntyLightingContract.walker.test.js` (red at both): the estate's file count 3691 → 3692.
- `tests/lint/readerShapeResolver.test.js` (red at both): `maxReadTokenLength` 264 → 263 at this pair of runs (263 → 262 at the
  first pair: the figure moves between runs of one tree; ceiling 256).
- `scripts/mutation-coverage-manifest.json` (the totality test, red at both): my guard joins the list of invariant files with no
  entry.
- The golden master (`tests/fixtures/generator-golden-master.json`): red at both with the same 499 rows drifted; my move is 0
  of 525 (section 4).

## 6. The net, base and tip, each gate alone (`sh scripts/gate-tail.sh`)

Base d75011e68 and tip 56b82c6cc (each in a clean clone of its commit; 70ad007d1 changes one twin's words only: the guard,
the presumed-things walker and both doors re-run there), each gate alone through `scripts/gate-tail.sh`.

| gate | base | tip |
|---|---|---|
| `npm run typecheck:domain:strict`, `npm run typecheck:ratchet` | green | green |
| `npx eslint` (my thirteen files) | | green |
| `npx vitest run tests/architecture` (with `engineCoreLazyEdge`) | green | green |
| ALL of `tests/lint` (JSON) | 26 files red | the same names save two (the fork register's A2, the held-key census's A2: section 5); messages equal save those of section 5 |
| `npx vitest run tests/joins` | green | RED, the declared mutator chain (section 5: FR14 (1)) |
| ONE `npm run build`; `vendorPdfLazy`, `bootSmoke` | build green; `vendorPdfLazy` red (`chainWorking.js` declared l, the tree says E: FAULTS-NEED's); `bootSmoke` green | the same; `vendorPdfLazy` the same message (my roster row in) |
| N3 `pipelineContract` | green | green (red at 3e78dc113 on the bound trade_partner case; FR14 (1) cures it) |
| N3 `isolatedTrade`, `publicProseEquality` | green | green |
| N3 `pipelinePinnedMode` | red (A1, A2, A5) | the same messages |
| N3 `generationForkCensus` | red (A1, A4, A6) | the same three, and A3e (section 5) |
| `bar8Rows`, `bar8FishRows`, `census5dTablePools`, `colourMarks4h`, `faultsNeed`, `houseDescLateReRead`, `crisisBlindDossierProse` | green | green |
| `poolDominance.walker` | red (3) | the same three; one figure (section 5) |
| `presumedThings.walker` | red (38; 79 stale) | the same (38; 79) at 70ad007d1 |
| door `presumption-classes-door --check` | `hits 1793 · banked 1938 · fresh 8 · stale 153 · ceiling 1938` | `hits 1792 · banked 1938 · fresh 8 · stale 154 · ceiling 1938` |
| door `presumed-things-door --check` | `fresh 38 · stale 72 · first-register stale 7 · banked 4688 · strips fresh 0 stale 0 banked 107` | the SAME (at 70ad007d1) |
| `tests/domain/facts` | 1 red | the same, the same message |
| THE OLDER TESTS (178 files naming what I changed: `institutionDescVariants`, `DESC_LATE_SIBLINGS`, `readHouseDescsLate`, the colour column, the ledger, `generateNarratives`, `factsOf`, `factVocabulary`, `factLayers`, the calm double; one JSON run per tree, compared by name and message) | 8 red | the same 8 names; two messages move (the worker bundle, the driven fence: section 5) |
| `generatorGoldenMaster` | red (499 rows) | the same |
| MY GUARD `tests/generators/faultsRows.test.js` | RED: 4 failed (the fair's and the quarter's UNMET and TABLE), 4 skipped (the fish arm: its leaf is absent) | green, 12 of 12 |

N5, THE SCRATCH MERGE: `lane/join-2026-11-14` is at 70e557d5b, already in my base: "Already up to date", clean. N4: the
guard's `toPublicSafe` arms print the owner's card on the shared page in every town they read. EG1: the new leaf rides the eager
core; `engineCoreLazyEdge` and `bootSmoke` green after one build.

## 7. Left by name

- Nothing of FR3, FR4 or FR12 is left.
- Not raised: nothing.


## FR20 (the chair's ruling after READ-THREE), tip fed4d9af8 and the hand-back after it

| commit | item |
|---|---|
| 00635b8d9 | (1) HIGH · merge of `lane/faults-need-2026-11-18` at e5fb6347c (one conflict, `tests/helpers/calmFactsDouble.js`: NEED's `needNotBroughtIn` with `any: false` and my `fishBoughtIn: false`, both kept); the guard reads the luxury labels from `tradeListDeclarations.js :: LUXURY_CLASS` (NEED's FR13 removed `LUXURY_LABELS_COPY`). The merge differs from NEED's tip only in my own files. The guard green at the merge. |
| c49bd8a16 | (2) MED · the fish card's two siblings: the catalogue line and the pool's #0 take the late set, the twins in the chair's words. |
| fed4d9af8 | (3) MED → a class · the late re-read resolves the draw-time sibling sets on the final facts FIRST. |

### (2) The fish card's two siblings

| the line | its twin (the chair's words) |
|---|---|
| "An open-air stall or small covered market where the day's catch is sold. Prices drop fast. Fish doesn't wait." (`institutionalCatalog.js`) | "An open-air stall or small covered market where salted and dried fish is sold. No fresh catch is landed here." |
| "An open stall or small roofed market for selling the day's catch. The price falls quickly, for fish keeps no better than a day." (#0) | "An open stall or small roofed market for salted and dried fish, brought in from elsewhere. The catch is no longer landed here." |

Moves: r2r-village-11 (the 720; the catalogue line beside "Preserved fish") takes its twin; idle r2r-village-45 (#0) and the live
fisheries (bar0-village-calm-rand-46, -32, bar0-village-famine-rand-45, r2s-occupied-village-2: the catalogue line) keep theirs.
THE DOORS (named, not reshaped, as the ruling asks): `presumed-things-door --check` reads THREE FRESH LINES, all the thing
`market`: both twins (the words "small covered market" and "small roofed market", which their originals carry too, banked
under the originals' own rows) and the catalogue line's own text, now a literal in `institutionDescVariants.js` (it was banked
under `institutionalCatalog.js`): fresh 38 → 41. THE SMALLEST CHANGE I PROPOSE: the close banks the three rows beside their
originals' (the words are the chair's and true; the presumption is the original's, a market where fish is sold). The classes door
reads no fresh line (3 → 3) and two rows stale (the two originals, now declared: 154 → 156).

### (3) The draw-time sets, read on the final facts

`assembleSettlement.js :: readHouseDescsLate` (the hunk FR20 gives, and its import line): a house whose stored description
(tier noun aside) is the original of a `DESC_VARIANT_SIBLINGS` set is resolved through that set on the final record's facts
FIRST (`resolveSibling`, the first admitted member; none admitted: kept and noted), then the late table reads the result as
before. `settledStressTypes` and the draw unchanged; no new text; no draw moves; no hash read.

MEASURED FIRST (a): the 900 and 600 fresh random-stress births (r2r-town-, r2r-city-, r2r-village-2000..2199), at c49bd8a16,
re-resolved in scratch; then BORN at the change: the moved houses equal the prediction exactly (6 of the 900, 19 of the 600;
each record moves in that house's `desc` only, and the Mercenary quarter's in its alias
`defenseProfile.institutions.mercenary[0].desc`, the same house object). EVERY MOVE, ONE BY ONE:

| population | town | house | crisis on the record (forced at the draw) | the move |
|---|---|---|---|---|
| the 900 | bar0-city-under_siege+famine-rand-28 | Mercenary quarter | under_siege+famine (forced: under_siege+famine) | CORRECTION |
| the 900 | bar0-city-wartime-rand-29 | Mercenary quarter | wartime (forced: wartime) | CORRECTION |
| the 900 | bar0-city-under_siege+famine-rand-30 | Mercenary quarter | under_siege+famine (forced: under_siege+famine) | CORRECTION |
| the 900 | bar0-city-wartime-rand-35 | Mercenary quarter | wartime (forced: wartime) | CORRECTION |
| the 900 | r2r-metropolis-14 | Toll bridge | under_siege (forced: none) | emergent under_siege: its crisis twin |
| the 900 | r2s-under_siege-city-1 | Mercenary quarter | under_siege (forced: under_siege) | CORRECTION |
| fresh | r2r-town-2060 | Fish market | none (forced: none) | CORRECTION |
| fresh | r2r-town-2069 | Toll bridge | under_siege (forced: none) | emergent under_siege: its crisis twin |
| fresh | r2r-town-2069 | Annual fair | under_siege (forced: none) | emergent under_siege: its crisis twin |
| fresh | r2r-town-2147 | Charcoal burner | none (forced: none) | CORRECTION |
| fresh | r2r-town-2156 | Customs house | none (forced: none) | CORRECTION |
| fresh | r2r-town-2170 | Town granary | famine (forced: none) | emergent famine: its crisis twin |
| fresh | r2r-city-2045 | Toll bridge | under_siege (forced: none) | emergent under_siege: its crisis twin |
| fresh | r2r-city-2045 | Burial grounds and charnel house | under_siege (forced: none) | emergent under_siege: its crisis twin |
| fresh | r2r-city-2061 | Toll bridge | under_siege (forced: none) | emergent under_siege: its crisis twin |
| fresh | r2r-city-2061 | Burial grounds and charnel house | under_siege (forced: none) | emergent under_siege: its crisis twin |
| fresh | r2r-city-2111 | Mercenary quarter | wartime (forced: none) | CORRECTION |
| fresh | r2r-city-2119 | Burial grounds and charnel house | under_siege (forced: none) | emergent under_siege: its crisis twin |
| fresh | r2r-city-2119 | Toll bridge | under_siege (forced: none) | emergent under_siege: its crisis twin |
| fresh | r2r-city-2122 | Burial grounds and charnel house | under_siege (forced: none) | emergent under_siege: its crisis twin |
| fresh | r2r-city-2122 | Toll bridge | under_siege (forced: none) | emergent under_siege: its crisis twin |
| fresh | r2r-city-2147 | Mercenary quarter | wartime (forced: none) | CORRECTION |
| fresh | r2r-city-2159 | Mercenary quarter | none (forced: none) | CORRECTION |
| fresh | r2r-city-2175 | Mercenary quarter | occupied (forced: none) | CORRECTION |
| fresh | r2r-city-2191 | Mercenary quarter | none (forced: none) | CORRECTION |

THE CORRECTIONS (13: moves in towns whose move is not an emergent crisis's twin), each against the final record, DECLARED:
- Mercenary quarter in a city, nine towns ("Organized sellsword companies. Major forces (hundreds to thousands)." → "…Real
  forces, a few score to a few hundred blades apiece."): the original declares `tier: = metropolis`, refused in a city; at the
  draw the twin's `mercenary` was unanswered (no force yet), so the original was kept; on the final record the force stands and
  the twin is admitted. Forced crises (bar0-city-under_siege+famine-rand-28, -30, bar0-city-wartime-rand-29, -35,
  r2s-under_siege-city-1), emergent wartime or occupation (r2r-city-2111, -2147, -2175) and none (r2r-city-2159, -2191).
- r2r-town-2060 Fish market: "the morning's catch" (`navigable`) in a town with no navigable water on the final record
  (water: none) → the inland twin (salted, smoked and dried fish by cart).
- r2r-town-2147 Charcoal burner: "Kiln crews in the surrounding woodland" (`terrain: forest`) in a desert → its twin.
- r2r-town-2156 Customs house: "…via the port or main roads" (`institution: docks`) with no docks → "…by the main roads".
NO MOVE IS UNEXPLAINED; nothing stopped.

(b) THE 525: 0 of 525 move (c49bd8a16 against fed4d9af8's tree, the golden's own procedure; no reference configuration rolls an
emergent crisis that a draw-time set reads).

(c) AFTER, in both populations: no besieged town (67 of the 900, 9 of the 600) keeps the non-siege original of a set that holds a
siege twin; no siege twin stands in a town with no siege (0 and 0).

(d) THE GUARD'S ARM (`tests/generators/faultsRows.test.js`, "FR20 (3)"): an emergent siege (r2r-town-2069: the toll bridge and
the fair; r2r-city-2045 and r2r-city-2122: the toll bridge and the burial grounds) reads its siege twins; a forced siege
(r2s-under_siege-town-2) reads as before; a sweep of 60 fresh towns and cities holds the law of (c) both ways (a crisis the
confirm pass dropped leaves no twin). RED at c49bd8a16, which is also the mutation with the pass removed (3 of 4 cases, 3 of 60
towns), GREEN at fed4d9af8 (the guard 15 of 15).

(e) BY MESSAGE, c49bd8a16 against fed4d9af8, each alone: `generationForkCensus` the same; `pipelinePinnedMode` the same;
`houseDescLateReRead` green, the same; `census4Ledger.walker` green, the same; `pipelineContract` green; the golden master the
same; both doors the same. `poolDominance.walker` MOVES: "every drawn pool has a row" gains
`ledger:institutionDescVariants:DESC_VARIANT_SIBLINGS` (the pass notes the draw-time sets under the pool id and kind the draw
site's own inland arm uses; the register row is the close's); `DESC_LATE_SIBLINGS`'s figure 1228 → 1226 towns (top1 0.8110, the
ceiling unmoved). Lint otherwise the same names and messages (`readerShapeResolver` 262 → 261: the figure moves between runs).
I re-take nothing.
