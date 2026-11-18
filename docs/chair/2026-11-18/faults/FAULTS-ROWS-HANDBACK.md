# FAULTS-ROWS hand-back

Seat FAULTS-ROWS of the round FAULTS (BRIEF-FAULTS, rulings FR3 and FR4; then the chair's FR12, which gave me the three I
had left, and FR14, which gave me two one-line edits). Base d75011e68 (FAULTS-NEED's atom at the rehearsal base 4288049ba);
branch `lane/faults-rows-2026-11-18`, tip __TIP__.

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
→ "Where salted and dried fish is sold, from an open stall or a small covered market. No fresh catch comes in here." The
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
| "Where salted and dried fish is sold, from an open stall or a small covered market. No fresh catch comes in here." | bar0-village-calm-rand-47 (its one town in the three populations) |

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
__FIGURES__

## 6. The net, base and tip, each gate alone (`sh scripts/gate-tail.sh`)

__NET__

## 7. Left by name

- Nothing of FR3, FR4 or FR12 is left.
- Not raised: nothing.
