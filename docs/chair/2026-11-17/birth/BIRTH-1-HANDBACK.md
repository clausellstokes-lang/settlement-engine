# BIRTH-1 · a house that buys its material has it brought in · HAND-BACK

Seat BIRTH-1 (`docs/chair/2026-11-14/briefs/BRIEF-BIRTH-1.md` on the chair's lane). Base: **4c3a3c03b** (the seam's
economy seat's branch; its tip read 4c3a3c03b when I started, so no later commit of it was taken). Branch
`lane/birth-1-2026-11-17`. Nothing merged. No draw edited: **no person, tie, name or house moves in any town** (the
table below, by birth over the 720, the 150 and the 525).

**How every figure was made.** Births: PAGE-COPY's `births.mjs` and `seedcfg.mjs` (the 720: `seeds.txt`; the 150:
`bar0-<shape>-rand-27..41`, the ten shapes of `seeds.bar0.txt`) and the audit's `birthsRef.mjs` (the 525), in a scratch
tree at the base and one at the tip. Counts: the audit's `q4rules.mjs` and `fieldDiff.mjs` unchanged; my own probes
beside this file (`birth1/`): `law.mjs` (the guard's law by kind), `exc.mjs` (its counted exceptions and the doubled-word
check), `pairs.mjs`, `srcpair.mjs`, `left.mjs` (item 6), `burners.mjs` (item 3). Every run was seen to end with exit 0.
Variants were measured by birth in a third scratch tree (`birth1/variant.sh`): never pushed.

## The proof that no person, tie, name or house moves (`fieldDiff.mjs`, base 4c3a3c03b against the tip)

| population | towns | changed | people (`npcs`) | ties (`relationships`) | name | roster (`institutions`) | stored field families moved (towns) |
|---|---|---|---|---|---|---|---|
| the census's 720 | 720 | 378 | **0** | **0** | **0** | **0** | `economicState.primaryImports` 377 · `resourceAnalysis.gaps` 293 · `economicViability.plotHooks` 33 · `economicViability.summary` 13 · `arrivalScene` 11 |
| the wide read's 150 | 150 | 71 | **0** | **0** | **0** | **0** | `economicState.primaryImports` 70 · `resourceAnalysis.gaps` 53 · `economicViability.plotHooks` 7 · `arrivalScene` 4 · `economicViability.summary` 3 |
| the 525 reference configurations | 525 | 141 | **0** | **0** | **0** | **0** | `economicState.primaryImports` 141 · `resourceAnalysis.gaps` 114 · `economicViability.plotHooks` 1 · `arrivalScene` 1 |

The final tip's births are byte for byte the measured tip's (the edits after it were at print). No other family moves: no
draw is taken (the import, the gaps and the hooks are written over what the draws already gave). At the first cut the
coherence receipt moved in 2 towns of the 720 and 1 of the 525 (the doubled grain, item 2): cured, it moves in none.

## The items

| # | item | done / left | before → after | guard |
|---|---|---|---|---|
| 1 | THE LEAF `src/domain/facts/houseKinds.js` | done | 47 ids of kind (i), 13 of kind (ii) with their grounds, 17 import words (the luxury goods quarter's "Luxury goods" added); each reason beside its id; imports nothing (EG1) | `birthKindsLaw.test.js` |
| 2 | THE IMPORT AT THE BIRTH (R2), `resourceGenerator.js :: importsBroughtAtBirth` | done | marks over the 720: **2,066 → 451**; born-short in calm connected towns: **563 houses in 144 towns → 36 in 33** (all counted exceptions of kind (ii)); the 150: 115 in 38 → 10 in 8 | arm 1, arm 2 |
| 2b | the buyer on a spent ground (measured apart) | done | spent-ground marks in calm connected towns of the 720: 124 → 60 (the 150: 25 → 19) | arm 1 |
| 3a | THE COAST (R5) | done | 4 marks of a salt works on a coast lifted; "No salt reaches the salt works." gone in 6 towns (r2r-village-36, r2r-village-53, r2r-town-3) | arm 1 |
| 3b | NO IMPORT FEEDS A SOURCE HOUSE | kept NARROW by the count; the rest LEFT by name | full (b) would newly mark 119 houses (49 more in calm connected towns) and cure none there; kept: a buyer's word feeds no source house: 49 charcoal burners R2 alone would have fed are read as at the base; newly marks 0 | arm 1 |
| 4 | THE WORKED-OUT GROUND (R4), `validationOnPage.js :: resourceGapLines` | done, in two lines | "No stone reaches the stone quarry." (45 towns) now followed by "The stone quarry is worked out: its own ground is depleted (Stone quarry)." | arm 1 (the page's mark held equal to the fact) |
| 5 | THE GUARD `tests/domain/birthKindsLaw.test.js` | done | fails at the base (148 of the 720's 225 calm connected towns, 38 of the 150's 64) | itself |
| 6 | THE PAGE AFTER ME, READ | done; one pair LEFT by name | one pair made by R2 (48 towns): its cure was measured and taken back (it broke the line's form, which two readers not mine parse); the rest named, none false | — |

### 1 · The leaf

`houseKinds.js` holds, for the owner to strike rows from (the APPENDIX below is the same table in plain words):
`BUYS_AND_WORKS` (47 catalogue ids: the smiths, the brewers and millers, the carpenters and coopers and sawmills, the
tanners and cobblers, the fuller and weavers, the potter, brickmaker, vintner, glassmakers, apothecary, the luxury goods
quarter, the fish market); `SOURCE_GROUNDS` (13 ids, each with the grounds that give it: the charcoal burner and the
woodcutter's camp, the dairy farmer and the shepherd, the stone quarry, the mines, the peat cutter, the salt works, the
landings, the hunter's lodge, the wildfowler); `IMPORT_WORD` (the imports list's own word for each chain key's good:
"Wool", "Timber", "Iron ore", "Clay and raw materials", "Raw hides and animal products", "Grapes and must", "Glass sand",
"Medicinal herbs", "Salted fish", "Grain", "Livestock", "Copper ore", "Precious metals and bullion", and "Luxury goods"
for the quarter); `BUYER_IMPORT_WORDS` (those words, item 3). It imports nothing. The audit's reasons stand beside each id
as comments, not strings: as strings they put 23 fresh rows on the classes door and 7 on the things door (both doors read
string literals); as comments neither door moves (below).

### 2 · The import at the birth

At `generateResourceAnalysis`, before the gaps are written, on a connected road no siege shuts
(`hasTradeRouteConnection`, `config.stressTypes` without `under_siege`), for each live native house of kind (i):
1. **a buyer on a spent ground of its own** (`housesOnSpentGround`; not a house that works the ground itself,
   `SPENT_GROUND_WORKERS`) has that ground's shortage import (`resourceShortageImport`), the word the economy writes only
   at a town or larger: "Game and hides (local hunting grounds exhausted)" (22 towns: r2r-metropolis-7, -8, -12),
   "Livestock and dairy (local grazing land depleted)" (17: r2r-village-20, r2r-city-3, r2r-metropolis-1), "Reeds, peat,
   and marsh herbs (local wetlands exhausted)" (8: r2r-village-24, r2r-metropolis-0, -8), "Herbs and forage (local
   gathering areas exhausted)" (5), "Iron ore (local iron mines exhausted)" (3), "Clay and ceramics materials (local clay
   pits exhausted)" (2), and four of one town each;
2. **a buyer every input of which the one reader answers `missing`** has its input's word.

**ONCE, BY THE GOOD, NOT BY THE STRING.** A word the list holds (its bracketed reason struck, any case) is not written
again, and a shortage word is not written where the list already brings the ground's yield by name: at the first cut the
birth wrote "Bulk grain (local grain fields depleted)" beside "Grain (a little, beside its own harvest)" in r2r-town-49
and r2s-insurgency-town-2, and the coherence receipt turned to `needs_review` there ("Grain stands as a primary import,
unqualified, where the town grows most of its need"): the doubled label of the sixth read. Cured; no town of the 720, the
150 or the 525 holds an import word twice, at the base or at the tip.

**THE SPENT GROUND READ THE SAME WAY (`houseInputAtHand.js :: housesOnSpentGround`).** Where the list already brought the
ground's yield by its own name, the spent-ground reading still marked the buyer, because it lifts a mark only by the
exact shortage label: "Apothecary: Short of herbs." beside "Medicinal herbs" (8 calm connected towns: r2r-city-21,
r2r-city-35, r2r-metropolis-5), the chandler (2), the butchers beside "Grain (a little, …)" (r2r-town-49). A buyer (never
a house that works the ground) is now fed by an import naming its ground's yield, as the one reader feeds it.

MEASURED APART (the 720; marks / spent-ground marks in calm connected towns): R2's missing-input words alone 639 / 124;
with the spent ground's shortage word 487 / 79; with item 3's narrow rule 525 / 79; with the spent reading above **451 /
60**. The 150: 154 / 25 → 142 / 19. Stored, the shortage words move the imports of 2 more towns of the 720 (375 → 377)
and 2 of the 150 (68 → 70), none of the 525.

### 3 · The reader

**(a) THE COAST (R5).** `desertSalt` is `local` on a port route or coastal terrain, after the spent-ground line (a salt
works on its own spent salt ground stays as the mark reads it). Lifts 4 marks; the gap line gone in 6 towns.

**(b) NO IMPORT AND NO ROAD FEEDS A SOURCE HOUSE: COUNTED BEFORE KEPT.** Measured by birth over the 720 (each beside R2
and R5):

| reading of (b) | marks of the 720 | born short in calm connected towns | newly marked | cured in calm connected towns |
|---|---|---|---|---|
| none (R2 + R5) | 487 | 26 in 25 | — | — |
| FULL: a source house answered only by its ground | 639 | 75 in 62 (+49) | 57 stone quarries "Short of stone." (r2r-hamlet-23, -48, r2r-village-8), 46 charcoal burners "Short of timber." (r2r-town-51, r2r-city-10, -17), 16 salt works "Short of salt." (r2r-hamlet-2, -45, -49) | 0 |
| no import feeds a source house | 582 | 55 in 50 (+29) | the 46 burners and the 16 salt works | 0 |
| no buyer's word (by its spelling) feeds a source house | 537 | 41 in 38 (+15) | 12 burners fed today by the economy's own "Timber" (r2r-town-51, r2r-city-10, -17) | 0 |
| **KEPT: a buyer's word the birth wrote feeds no source house** | **525** | **36 in 33** | **0** (no house is marked that the base did not mark) | the 12 below |

(b) as written newly marks far more than it cures, so ONLY THE PART THAT STOPS A BUYER'S IMPORT FEEDING A SOURCE HOUSE
IS KEPT, and it is kept without a new field: **the birth reads a source house over the list as the economy wrote it**
(`resourceGenerator.js :: supplyOfInput`, the list before the birth's words, on the record in the making only), so its
stored gap says `missing` where the base's did; **at print, a buyer's word (`BUYER_IMPORT_WORDS`) does not answer a
source house whose own stored gap says it lacks its input** (`houseInputAtHand.js`): such a word on such a list can only
be the birth's. THE ELEVEN WERE FORTY-NINE: R2 alone fed **49 charcoal burners of the 720** with the cooper's and the
carpenters' "Timber": 11 shifted to "Short of coal." (r2r-metropolis-2, -28, -40) and **38 lost their mark silently**
(r2r-hamlet-36, r2r-city-3, -40). Twelve of the 49 stand in calm connected towns (10 lifted silently: r2r-hamlet-52,
r2r-town-40, r2r-city-0; 2 shifted to coal: r2r-metropolis-28, -40). All 49 now read as at the base.

LEFT BY NAME FOR THE HELD DRAW SEAT (BIRTH-2), measured: the **57 stone quarries on no stone** answered by themselves
(`LOCAL_PRODUCERS`); the **16 salt works on no brine** fed by a "Salt" import (a siege's or a famine's necessity); the **46
charcoal burners** fed by the economy's own timber import. Each is a house drawn where the land does not give its
material; marking it here would mark a true house false-silent today, and BIRTH-2 removes it at its draw.

### 4 · The worked-out ground

A house of kind (ii), none of whose own grounds is live and one of which the record holds spent, keeps its gap line and
gains THE LINE AFTER IT, by the Depleted list's own label of the ground: "No stone reaches the stone quarry." / "The stone
quarry is worked out: its own ground is depleted (Stone quarry)." (45 towns of the 720: r2r-city-18, -27, -40; 6 of the
150: bar0-city-wartime-rand-31, -36, bar0-metropolis-calm-rand-28); "The dairy farmer is worked out: its own ground is
depleted (Open grazing land)." (r2r-hamlet-53, r2s-monster_pressure-village-2); "The salt works is worked out: its own
ground is depleted (Salt flats)." (r2r-metropolis-58) and "(Fishing grounds)." (r2s-wartime-city-1); the charcoal burner on
spent mountain timber (bar0-city-wartime-rand-34). The mark is unchanged.

**WHY TWO LINES, NOT ONE REWORDED (measured).** The gap line's own words are A CONTRACT TWO READERS NOT MINE PARSE: the
page's mark (`crisisStoppedRow.js :: housesShortOfInput`, `^No (.+?) reach(?:es)? …`, the good it marks) and the record's
detector (`tests/helpers/houseInputSplit.js`, `^No .+ reach(?:es)? the (.+)\.$`, the house). My first wording ("The stone
quarry is short of stone: its own ground is depleted (…).") took the marks off the cards (the chair's runD, 8a.input, rose
0 → 6 in two towns of the 150: a dairy farmer printed bare beside "Needed, and not brought in: livestock") and red the
detector in 24 towns; a wording that kept the head ("… from its own ground: …") still red the detector. The line after it
reads the worked-out ground and both readers read the gap line as before. The guard holds the page's mark equal to the one
fact, house for house, in every calm town it reads (0 disagreements over the 720 and the 150, at the base and the tip).

NAMED, THE ECONOMY'S, LEFT (the audit's counts at cfc2b680a): the exports of a spent own ground (4 towns export stone
beside a spent quarry; 7 a mine's ore); the chain card's state (13 stone chains and 8 salt chains on a spent own ground
stand in a state other than impaired); the income shares (1 "Stone Quarrying"; 27 shares naming iron or ore beside a
spent mine).

### 5 · The guard, `tests/domain/birthKindsLaw.test.js`

THE SEEDS, AND WHY THEY ARE ENOUGH: the law speaks only of calm towns on a connected road; every such town of the 720 is
one of its 360 `r2r-` towns (each `r2s-` town carries its crisis by name), and every such town of the 150 is one of its
five calm shapes (75 towns). The guard births all 435 and reads the 289 calm connected ones (225 + 64). Arm 2 births the
54 towns under a siege (the census's 24, the 150's 30) and reads every isolated town among the 435.
- **arm 1 · the law**: no house of kind (i) marked; none of kind (ii) but on a spent ground of its own; the COUNTED
  EXCEPTIONS (a ratchet, both ways): dairy farmer 14 + 5, charcoal burner 14 + 4, salt works 8 + 1 (the held draw seat's:
  a source house where the land does not give it; the audit counted 4 burners, the other 10 are those R2 alone fed), and
  the **fish market 18 + 1** on its own spent fisheries (the owner's table holds it (i); `crisisDependence.js ::
  SPENT_GROUND_WORKERS` holds it a house that works the ground, whose mark no import lifts: not this seat's file).
- **its positive control**: nine towns the law fails at the base (a potter, a vintner, a fuller, the weavers, a
  brickmaker, a cobbler's guild, a cooper, a smith, a luxury goods quarter), read BLIND (the birth's words struck): each
  house is marked again.
- **arm 2**: at the write site (`generateResourceAnalysis` over each town's own record, its words struck): the control
  towns gain words on their own road, a second reading brings none, and none under a siege or on an isolated route;
  every besieged or isolated town of the seeds gains none; no town holds an import word twice.

### 6 · The page after me, read

Rendered (PAGE-COPY's render, the tip tree): r2r-hamlet-3, -10, -30, -35, r2r-village-4, -6, -14, -20, -22, r2r-town-8,
-14, -18, -22, r2r-city-3, -5, -21, r2r-metropolis-1, -2, -7, -24 (every tier; each with a word written). Read: the
Economics tab's Imports line, every house's card, the Resources tab, the Outlook, the plot hooks. The pairs, counted over
the 720:
- **"No timber reaches the charcoal burner." beside the "Timber" the birth brings in for the cooper** (and the Outlook's
  "can stand, but only while timber keeps arriving", r2r-metropolis-2): **48 towns made by R2 (49 with one of the base):
  LEFT BY NAME.** Under the ruling the line is literally true (an import feeds a buyer, never the work on the ground: the
  timber arrives for the cooper and none reaches the burner), but a reader meets a town that buys timber and a burner that
  gets none. Its cure ("No timber reaches the charcoal burner from a ground of its own: none lies near.", 63 burners, 34
  dairies, 24 salt works on no ground) took the pair to 0, and was TAKEN BACK: it broke the line's form (above) and the
  anchors of four tests (`bar4RecordHouseInput` 73 of 129 detector cases, `readerValidationOnPage`, `bar4MarkPromise`
  (d)). The pair is the held draw seat's (BIRTH-2 does not draw a burner where no wood is), or a desk that may change the
  line's form with its two readers.
- **"Needed, and not brought in: <good>" beside the import of that good**: 0. The need lines of the goods the birth brings
  in are gone with the word ("…: grapes" 137 towns, "…: clay" 102, "…: mountain_timber" 49, "…: timber" 46, "…: glass
  sand" 12, "…: luxury goods" 11). Beside a word there stand only other goods: the smelter's other ores ("copper ore" 12,
  "gold/silver ore" 4 beside "Iron ore": r2r-town-53, r2r-city-36, -40): true, the iron is brought and the copper not.
- **The viability's verdict "economically self-sufficient" (the Outlook's "feeds itself and pays its own way") beside a
  word**: 48 towns (r2r-hamlet-3, -10, -17); every one imported at the base already (the verdict stands beside imports in
  162 towns of the base): NOT made by me; the economy's (`viability.js`), named.
- **A hook that the carts are late in a town the page calls well supplied**: 32 towns gain a hook on an imported strategic
  good ("The timber carts stopped coming a month ago …" 19, in place of "Timber is short this season …" 20; "The iron
  carts are three weeks late …" 6: r2r-hamlet-30, r2r-village-4, -26; a toll on the iron road 4; iron doubled 2); none of
  the 32 is a town the verdict calls self-sufficient, and the read towns' Outlook agrees ("can stand, but only while the
  goods it buys in keep arriving", r2r-hamlet-30). 0 false pairs.
- **An income row that says the town imports nothing**: none on any tab of the 20 (the one "Buys nothing" is a person's
  manner); the record holds no such row.

## The new lines a reader can see (each with three towns; the 720)

THE NEW LINES (the record's readers' own lines, `q4rules.mjs`; base 4c3a3c03b against the tip):

| line | towns of the 720 | three |
|---|---|---|
| Imports: Clay and raw materials | 174 | r2r-village-4, r2r-village-6, r2r-village-16 |
| Imports: Timber | 156 | r2r-hamlet-3, r2r-hamlet-17, r2r-hamlet-32 |
| Imports: Raw hides and animal products | 147 | r2r-village-9, r2r-village-14, r2r-village-27 |
| Imports: Wool | 146 | r2r-village-14, r2r-village-26, r2r-village-28 |
| Imports: Grapes and must | 137 | r2r-town-18, r2r-town-22, r2r-town-33 |
| Resources: The stone quarry is worked out: its own ground is depleted (Stone quarry). | 45 | r2r-city-18, r2r-city-27, r2r-city-40 |
| Imports: Iron ore | 40 | r2r-hamlet-10, r2r-hamlet-19, r2r-hamlet-26 |
| Imports: Game and hides (local hunting grounds exhausted) | 22 | r2r-metropolis-7, r2r-metropolis-8, r2r-metropolis-12 |
| Imports: Livestock and dairy (local grazing land depleted) | 17 | r2r-village-20, r2r-city-3, r2r-metropolis-1 |
| Imports: Luxury goods | 13 | r2r-city-21, r2r-city-23, r2r-metropolis-6 |
| Imports: Glass sand | 12 | r2r-town-8, r2r-town-35, r2r-town-40 |
| Imports: Reeds, peat, and marsh herbs (local wetlands exhausted) | 8 | r2r-village-24, r2r-metropolis-0, r2r-metropolis-8 |
| Imports: Herbs and forage (local gathering areas exhausted) | 5 | r2r-village-13, r2r-metropolis-6, r2s-occupied-metropolis-2 |
| Imports: Medicinal herbs | 4 | r2r-village-13, r2r-town-51, r2s-insurgency-town-2 |
| Imports: Salted fish | 4 | r2r-village-49, r2r-village-57, r2s-succession_void-village-0 |
| Imports: Iron ore (local iron mines exhausted) | 3 | r2r-metropolis-24, r2r-metropolis-33, r2s-monster_pressure-metropolis-2 |
| Resources: The dairy farmer is worked out: its own ground is depleted (Open grazing land). | 2 | r2r-hamlet-53, r2s-monster_pressure-village-2 |
| Imports: Clay and ceramics materials (local clay pits exhausted) | 2 | r2s-slave_revolt-metropolis-2, r2s-mass_migration-metropolis-0 |
| Imports: Timber (local managed woodland cleared) | 1 | r2r-village-22 |
| Resources: The salt works is worked out: its own ground is depleted (Salt flats). | 1 | r2r-metropolis-58 |
| Imports: Salted fish (local river fishery exhausted) | 1 | r2s-indebted-village-2 |
| Resources: The salt works is worked out: its own ground is depleted (Fishing grounds). | 1 | r2s-wartime-city-1 |
| Imports: Dressed stone (local quarry depleted) | 1 | r2s-wartime-metropolis-2 |

AND THE PLOT HOOKS (the viability's, over the imports the birth wrote; the 720): "The timber carts stopped coming a month
ago, and the builders are bidding against each other for what is left in the yards." 19 towns (r2r-town-34, -45,
r2r-city-53), in place of "Timber is short this season, …" (20); "The iron carts are three weeks late and the carters will
not say why. …" 6 (r2r-hamlet-30, r2r-village-4, -26); "A new toll on the iron road has made metal dear. …" 4 (r2r-city-36,
r2r-metropolis-33, r2s-politically_fractured-hamlet-0); "Iron has doubled in price this season, …" 2 (r2r-hamlet-35,
r2s-mass_migration-village-1); the viability's summary counts one operational dependency more in 13 towns
(r2r-hamlet-30, -35, r2s-politically_fractured-hamlet-0).

THE LINES GONE (the commonest; marks and the Resources tab's gap lines):

| line | towns of the 720 | three |
|---|---|---|
| mark: Potter: Short of clay. | 155 | r2r-village-4, r2r-village-16, r2r-village-27 |
| Resources: No clay reaches the potter. | 155 | r2r-village-4, r2r-village-16, r2r-village-27 |
| mark: Vintner: Short of grapes. | 137 | r2r-town-18, r2r-town-22, r2r-town-33 |
| Resources: No grapes reach the vintner. | 137 | r2r-town-18, r2r-town-22, r2r-town-33 |
| Needed, and not brought in: grapes | 137 | r2r-town-18, r2r-town-22, r2r-town-33 |
| mark: Weavers/Textile workers: Short of wool. | 134 | r2r-town-8, r2r-town-14, r2r-town-17 |
| mark: Brickmaker: Short of clay. | 124 | r2r-village-6, r2r-town-10, r2r-town-16 |
| Resources: No clay reaches the brickmaker. | 124 | r2r-village-6, r2r-town-10, r2r-town-16 |
| mark: Cobbler's guild: Short of hides. | 115 | r2r-town-6, r2r-town-14, r2r-town-15 |
| mark: Fuller: Short of wool. | 106 | r2r-village-14, r2r-village-26, r2r-village-28 |
| Needed, and not brought in: clay | 102 | r2r-village-6, r2r-village-16, r2r-village-48 |
| mark: Carpenters (5-15): Short of timber. | 95 | r2r-town-5, r2r-town-22, r2r-town-31 |
| Resources: No timber reaches the sawmill. | 94 | r2r-village-4, r2r-village-6, r2r-village-14 |
| mark: Cooper: Short of timber. | 90 | r2r-village-15, r2r-village-26, r2r-village-52 |

And the need lines of the goods brought in: "Needed, and not brought in: grapes" 137 towns, "…: clay" 102, "…:
mountain_timber" 49, "…: timber" 46, "…: glass sand" 12, "…: luxury goods" 11, "…: medicinal herbs" 4, "…: fish" 4.

## The books my cure moves (the close's; S8)

- **The 525 reference configurations (the golden master)**: `economicState.primaryImports` 141, `resourceAnalysis.gaps`
  114, `economicViability.plotHooks` 1, `arrivalScene` 1 (the audit's measure: 141 · 116 · 1 · 1).
- **The census's stored figures read off the record**: the marks of the 720 (2,066 → 451; the BR1 table of BAR6-RECORD,
  the 372 born-short towns: 563 born-short houses in 144 calm connected towns → 36 in 33), the 150 (381 → 142), the
  marks' counts of BAR6-MARKS, the PAGE-COPY renders of the 150 (moved at the tip; re-rendered here in scratch only).
- **The chair's runners over the 150** (base → tip; no rule's count rises): runB 0 → 0; runC 30 → 27 (6b-denied 5 → 2; 6a-w
  16, 7c-plenty 1, 7w-tone 8 unchanged); runD (LAW 8) 0 → 0; runE (LAW 9) 0 → 0 (11 apart, unchanged); runF (LAW 10) 44 → 44.
- **The presumption doors** (my cures add no fresh line): classes door "hits 1805 · banked 1938 · fresh 4 · stale 137" at the
  base and at the tip; things door "fresh 39 · stale 72 · first-register stale 6 · banked 4688" at the base and at the tip.
- **The test keys my cure makes untrue** (S5): below, under the net.

## What is left, and for whom

- **THE PAIR OF ITEM 6, LEFT**: "No timber reaches the charcoal burner." beside the timber the birth brings in for the buyers
  (48 towns of the 720); the held draw seat's, or a desk that may change the gap line's form with its two readers.
- **THE HELD DRAW SEAT (BIRTH-2)**: the source houses drawn where the land does not give their material: marked and true
  (the guard's counted exceptions in calm connected towns: dairy farmer 14 + 5, charcoal burner 14 + 4, salt works 8 + 1;
  in all the 720: 63 burners, 34 dairies, 24 salt works on no ground); and unmarked, answered falsely today: 57 stone
  quarries by themselves, 16 salt works by a "Salt" import, 46 charcoal burners by the economy's own timber (item 3).
- **THE OWNER'S TABLE AGAINST `crisisDependence.js`**: the fish market is (i) in the table and a ground worker in
  `SPENT_GROUND_WORKERS` (34 fish markets of the 720 marked on spent fisheries, 18 in calm connected towns): one of the two
  rows is struck by the owner.
- **BUYERS ON A SPENT GROUND WITH NO SHORTAGE WORD, OR OFF A ROAD**: furrier's district 3, apothecary 2, tailors and dyer
  3 (r2r-metropolis-14), ropemaker 1: none in a calm connected town.
- **THE ECONOMY'S** (item 4): the exports, chain states and income shares of a spent own ground; the viability's
  "self-sufficient" verdict beside imports (162 towns of the base).

## The net (S7), each alone, to a file through `sh scripts/gate-tail.sh`, at the tip cb596691e and after

| gate | result |
|---|---|
| `npm run typecheck:domain:strict` | exit 0 · "no strict-type regressions (1113 errors, ceiling 1113)" |
| `npm run typecheck:ratchet` | exit 0 · "no type regressions (167 error(s), ceiling 167)" |
| `npx eslint` on my changed sources and tests | exit 0 |
| `npx vitest run tests/architecture` | exit 0 · 21 files, 347 tests |
| ONE `npm run build`, then `tests/build/vendorPdfLazy.test.js tests/build/bootSmoke.test.js` | exit 0 (built in 37 s) · exit 0, 2 files, 49 passed, 17 skipped |
| my guard `tests/domain/birthKindsLaw.test.js` | exit 0 · 3 tests (fails at the base: 148 + 38 towns) |
| the two doors | unchanged from the base (above) |

THE WHOLE SUITE WAS NOT RUN (3,665 files; at four cores it read about 2,900 tests in 55 minutes before I stopped it). I ran
the net's guards and every test file that names a reader or a file I changed (73 files: `houseInputAtHand`,
`resourceGapLines`, `housesShortOf`, `housesShortOfInput`, `housesOnSpentGround`, `housesWantingTradeInput`,
`generateResourceAnalysis`, `resourceGenerator`, `validationOnPage`, `importsAsPrinted`, `houseKinds`, and the round's
`bar5*` / `bar6*` guards). 17 were red; each red one was run again at the base:

RED AT THE BASE WITH THE SAME MESSAGE (named, not chased): `tests/components/bar3LabelWords3.test.jsx`,
`tests/lint/ruinFilterRoster.walker.test.js` (114 against 113), `tests/domain/bar6ScenesGoods.test.js`,
`tests/domain/worldFactRederive.test.js`, `tests/domain/display/economyDeskReadsTheCards.test.js`,
`tests/domain/facts/apothecaryWorksTheHerbs.test.js`; and `tests/domain/bar5ChainsLaw3.test.js` (b), red at the base in 2
of its 6 controls (see below for the third).

RE-KEYED BY IDENTITY (dated notes in the file): `tests/generators/bar4RecordHouseInput.test.js`: the sawmill anchors
(r2r-village-4's Sawmill, r2r-town-2's Sawmill (commercial), now fed by the birth's timber) to census towns on no road
that bear the same claim, r2r-village-69 and r2r-city-115. Green.

**MADE UNTRUE BY MY CURE AND LEFT RED AT 7ba689f3b, BY NAME (since re-keyed: "THE RE-KEYS, DONE" below)**. Each anchors a born-short house
on a connected road that the birth now feeds; the same claim stands where no road reaches or a siege shuts it (the
candidates, read off the tip's births):
| test | the anchor my cure moved | a town that still bears the claim |
|---|---|---|
| `tests/components/crisisStoppedRows.test.jsx` S5, the births table | six born-short rows now fed | not searched |
| `tests/components/economicsImportsAreArrivals.test.jsx` | r2r-city-2: clay a need no trade meets (clay is now brought in) | a potter on no road: r2r-city-20, -48, -49 (calm, isolated) |
| `tests/domain/display/gapReadsPrintedImports.test.js` | r2r-city-2's "No clay reaches the potter."; r2r-city-28, r2s-plague_onset-town-5, r2s-politically_fractured-city-4 (their gaps are gone: the vacuity check reads 0) | the same potters on no road |
| `tests/generators/gapSaysWhichKind.test.js` | soak1k-4's Potter, clay `missing` → `imported` | a soak town on no road (not searched) |
| `tests/domain/bar4MarkPromise.test.js` (b), (d) | r2r-village-4 (gap-missing); the charcoal burner's line | r2r-village-69 (a sawmill on no road) |
| `tests/domain/bar5ChainsLaw3.test.js` (b) | r2r-town-49's control (the third; two were red at the base) | not searched |
| `tests/domain/bar6MarksLaw8.test.js` | (a) a house of its LEFT list is cured: the test's own words, "strike it from LEFT" (a ratchet that only shrinks); (b) r2r-city-0's 8a.input and 8a.mild controls | not searched |
| `tests/domain/bar6SeamEcon.test.js` item 8 | bar0-metropolis-calm-rand-27 and -39: the Fuller is fed (Wool brought in), so the card's "Fulled cloth" stands | a fuller on no road: r2r-village-23, r2r-town-54, r2r-city-48 (whether its card lists Fulled cloth: not read) |
| `tests/generators/houseInputReaches.test.js` KEEP "a smelter no input reaches is short of each" | r2r-city-5, -17, -36, r2r-metropolis-33: every smelter is now fed | **NONE**: no town of 1,945 census-shaped births (the 720, the 150, the 525 and 700 more `r2r-` seeds) bears an unfed smelter. The claim is retired by the cure: a ruling for the chair (it cannot be re-keyed and may not be loosened) |


## THE RE-KEYS, DONE (the chair's extension of 06:05 UTC; tests only, no source change)

Each claim moved BY IDENTITY to a town that still bears it (searched over the tip's births: the 720, the 150, the 525,
700 more `r2r-` seeds of the five tiers and 154 more `r2s-` seeds of two crisis shapes), the assertion's form kept, a
dated note in the file. Run at the tip with my guard: all green but `bar5ChainsLaw3`, red exactly as at the base.

| file | the anchor | the town it now stands on | at the tip |
|---|---|---|---|
| `tests/components/crisisStoppedRows.test.jsx` S5 | r2s-famine-town-1's brickmaker (tiles, bricks); r2s-occupied-city-3's potter (brick) | r2r-town-54 (a town on no road); r2r-city-49 (a city on no road) | green |
| `tests/components/economicsImportsAreArrivals.test.jsx` | r2r-city-2: clay a need, not an import | r2r-city-20 (a calm city on no road) | green |
| `tests/domain/display/gapReadsPrintedImports.test.js` | r2r-city-2's "No clay reaches the potter."; r2r-city-28, r2s-plague_onset-town-5, r2s-politically_fractured-city-4 | r2r-city-20; r2r-city-48, r2s-plague_onset-town-19, r2s-politically_fractured-city-27 (each of its own shape, on no road) | green |
| `tests/generators/gapSaysWhichKind.test.js` | soak1k-4's potter and brickmaker; soak1k-8's sawmill (it too is fed now) | soak1k-9 (the first soak birth reading both missing); soak1k-302 (the first reading the sawmill missing) | green |
| `tests/generators/houseInputReaches.test.js` KEEP | r2r-city-5, -17, -36, r2r-metropolis-33's smelters | THE CHAIR'S RULING: a CONSTRUCTED record (a smelter, no ore ground, nothing on the imports, an isolated route, through `generateResourceAnalysis`); the note says no town of 1,945 births bears it and that the seat after me may re-key it to a born town | green |
| `tests/domain/bar4MarkPromise.test.js` (b) | r2r-village-4's brickmaker (gap-missing) | r2r-town-54 (a town of the 720 on no road) | green |
| `tests/domain/bar5ChainsLaw3.test.js` (b) | r2r-city-21's vintner (idle craft, grapes needed and not brought in) | r2r-metropolis-54 (a calm town of the 720 on no road) | red as at the base: its other two controls (r2r-town-49, -39) fail at 4c3a3c03b with the same message |
| `tests/domain/bar6MarksLaw8.test.js` | (a) LEFT: 'r2r-town-51 · 8a.input · Apothecary (established)' cured (its herbs brought in): STRUCK by the test's own rule, the other three kept; (b) r2r-city-0's commercial sawmill (8a.input) and carpenters (8a.mild) | 8a.input: r2r-city-115 (the same house, a calm city on no road); 8a.mild: no timber house is marked short on a road any more, so the rule's own case, r2r-city-19 (a city of the 720, its daily markets marked under the outbreak, their card head milder) | green |
| `tests/domain/bar6SeamEcon.test.js` item 8 | bar0-metropolis-calm-rand-27 and -39 (their fullers fed) | r2r-metropolis-69 (under a siege, its road shut): the ONE town of 1,724 searched that bears a River Mill card listing "Fulled cloth" beside a fuller short of wool | green |
| (and, before) `tests/generators/bar4RecordHouseInput.test.js` | r2r-village-4's sawmill; r2r-town-2's commercial sawmill | r2r-village-69; r2r-city-115 | green |

Two re-keys are not house for house, named here: `bar6MarksLaw8`'s 8a.mild control now stands on a market under an
outbreak (no carpenters short on a road remain), and `bar6SeamEcon` item 8 holds one town where it held two (only one
bears it). eslint on the nine files and the type ratchet: exit 0.

## FOR THE SEAT AFTER ME (the chair's lines of 04:33 and 05:36 UTC)

THE SIEGE LINE OF 04:33 WAS NOT ACTED ON (it reached this session after the build; the 05:36 line supersedes it): the tree
is as built, and `importsBroughtAtBirth` returns nothing under a siege. The four counts the chair asked for, over the
census's 720 at the tip (`birth1/four.mjs`, base corpus against the tip's):

**(1) BUYERS UNDER A SIEGE ON A CONNECTED ROUTE LEFT "Short of …" WITH NO CAUSE (no import is written there): houses 59 in 11 towns.**

| the mark | houses | three towns |
|---|---|---|
| Potter · Short of clay. | 8 | r2r-metropolis-14, r2s-under_siege-town-0, r2s-under_siege-town-3 |
| Vintner · Short of grapes. | 6 | r2r-metropolis-14, r2s-under_siege-city-0, r2s-under_siege-city-2 |
| Glassmakers · Short of glass sand. | 6 | r2r-metropolis-14, r2s-under_siege-city-2, r2s-under_siege-metropolis-0 |
| Weavers/Textile workers · Short of wool. | 6 | r2s-under_siege-city-0, r2s-under_siege-city-2, r2s-under_siege-metropolis-0 |
| Cobbler's guild · Short of hides. | 5 | r2s-under_siege-town-1, r2s-under_siege-city-0, r2s-under_siege-city-2 |
| Fuller · Short of wool. | 5 | r2s-under_siege-city-0, r2s-under_siege-metropolis-0, r2s-under_siege-metropolis-1 |
| Brickmaker · Short of clay. | 4 | r2r-metropolis-14, r2s-under_siege-metropolis-0, r2s-under_siege-metropolis-1 |
| Tanner (established) · Short of hides. | 4 | r2s-under_siege-town-1, r2s-under_siege-city-0, r2s-under_siege-metropolis-1 |
| Cooper · Short of timber. | 3 | r2r-metropolis-14, r2s-under_siege-town-0, r2s-under_siege-town-1 |
| Woodcarver · Short of timber. | 3 | r2r-metropolis-14, r2s-under_siege-town-1, r2s-under_siege-city-1 |
| Sawmill (commercial) · Short of timber. | 2 | r2r-metropolis-14, r2s-under_siege-city-1 |
| Carpenters (5-15) · Short of timber. | 2 | r2r-metropolis-14, r2s-under_siege-city-1 |
| Tailor's guild · Short of livestock. | 1 | r2r-metropolis-14 |
| Dyer · Short of livestock. | 1 | r2r-metropolis-14 |
| Tailor · Short of livestock. | 1 | r2r-metropolis-14 |
| Tanners · Short of hides. | 1 | r2s-under_siege-city-2 |
| Fish market · Short of fish. | 1 | r2s-under_siege-metropolis-1 |

**(2) A WORD THE BIRTH BROUGHT IN BESIDE A SOURCE HOUSE SHORT OF THAT SAME MATERIAL: houses 53 in 51 towns.**

| the house and the word | houses | three towns |
|---|---|---|
| Charcoal burner short of timber beside "Timber" | 49 | r2r-hamlet-36, r2r-hamlet-52, r2r-town-40 |
| Mine short of iron ore beside "Iron ore (local iron mines exhausted)" | 2 | r2r-metropolis-24, r2s-monster_pressure-metropolis-2 |
| Fisher's landing short of fish beside "Salted fish (local river fishery exhausted)" | 1 | r2s-indebted-village-2 |
| Stone quarry short of stone beside "Dressed stone (local quarry depleted)" | 1 | r2s-wartime-metropolis-2 |

(The mine, the landing and the quarry stand on their own spent ground beside its shortage word, written for a buyer of the
same ground: an import feeds a buyer, never the work on the ground; the mark is the spent ground's, true.)

**(3) SOURCE HOUSES WITH NO GROUND OF THEIR OWN STILL MARKED IN CALM TOWNS ON A CONNECTED ROAD: houses 39 in 35 towns.**
The gap line each prints is the old one: the line "… from a ground of its own: none lies near." was measured and TAKEN
BACK (item 6), so none prints it.

| the house, its mark and its gap line | houses | three towns |
|---|---|---|
| Charcoal burner · Short of timber. · line: "No timber reaches the charcoal burner." | 16 | r2r-hamlet-26, r2r-hamlet-48, r2r-hamlet-52 |
| Dairy farmer · Short of livestock. · line: "No livestock reaches the dairy farmer." | 14 | r2r-hamlet-12, r2r-hamlet-14, r2r-hamlet-19 |
| Salt works · Short of salt. · line: "No salt reaches the salt works." | 8 | r2r-hamlet-18, r2r-town-15, r2r-town-29 |
| Peat cutter · Short of coal. · line: "(no gap line)" | 1 | r2r-village-14 |

("No ground of its own" here: none of the leaf's grounds of the house on the record, live or spent. The guard's exceptions
count 14 burners, not 16: two burners stand on a spent coal ground the spent-ground reading names, which the leaf does
not list among a burner's grounds; the peat cutter's mark is that same spent coal ground.)

**(4) EVERY WORD THE BIRTH WROTE, AND IN HOW MANY TOWNS OF THE 720** (the `IMPORT_WORD` words and the spent grounds'
shortage words of item 2):

| word | towns | three towns |
|---|---|---|
| Clay and raw materials | 174 | r2r-village-4, r2r-village-6, r2r-village-16 |
| Timber | 156 | r2r-hamlet-3, r2r-hamlet-17, r2r-hamlet-32 |
| Raw hides and animal products | 147 | r2r-village-9, r2r-village-14, r2r-village-27 |
| Wool | 146 | r2r-village-14, r2r-village-26, r2r-village-28 |
| Grapes and must | 137 | r2r-town-18, r2r-town-22, r2r-town-33 |
| Iron ore | 40 | r2r-hamlet-10, r2r-hamlet-19, r2r-hamlet-26 |
| Game and hides (local hunting grounds exhausted) | 22 | r2r-metropolis-7, r2r-metropolis-8, r2r-metropolis-12 |
| Livestock and dairy (local grazing land depleted) | 17 | r2r-village-20, r2r-city-3, r2r-metropolis-1 |
| Luxury goods | 13 | r2r-city-21, r2r-city-23, r2r-metropolis-6 |
| Glass sand | 12 | r2r-town-8, r2r-town-35, r2r-town-40 |
| Reeds, peat, and marsh herbs (local wetlands exhausted) | 8 | r2r-village-24, r2r-metropolis-0, r2r-metropolis-8 |
| Herbs and forage (local gathering areas exhausted) | 5 | r2r-village-13, r2r-metropolis-6, r2s-occupied-metropolis-2 |
| Medicinal herbs | 4 | r2r-village-13, r2r-town-51, r2s-insurgency-town-2 |
| Salted fish | 4 | r2r-village-49, r2r-village-57, r2s-succession_void-village-0 |
| Iron ore (local iron mines exhausted) | 3 | r2r-metropolis-24, r2r-metropolis-33, r2s-monster_pressure-metropolis-2 |
| Clay and ceramics materials (local clay pits exhausted) | 2 | r2s-slave_revolt-metropolis-2, r2s-mass_migration-metropolis-0 |
| Timber (local managed woodland cleared) | 1 | r2r-village-22 |
| Salted fish (local river fishery exhausted) | 1 | r2s-indebted-village-2 |
| Dressed stone (local quarry depleted) | 1 | r2s-wartime-metropolis-2 |

`IMPORT_WORD` words never written in the 720: "Copper ore", "Precious metals and bullion", "Grain", "Livestock".

## APPENDIX · THE OWNER'S TABLE (the leaf `src/domain/facts/houseKinds.js`, row for row: strike a row and the house leaves the rule)

### (i) A house that buys and works its material: brought in where nothing here answers it and a connected road no siege shuts reaches the town

| strike? | house (catalogue id) | why |
|---|---|---|
| [ ] | blacksmith | a forge works bought iron; ore and bar iron travel by any road |
| [ ] | blacksmiths 3 10 | the same forge, more of them |
| [ ] | resident smith part time | the same forge, part-time |
| [ ] | specialized metalworkers | fine metalwork from bought metal |
| [ ] | smelter | its line: "converts raw ore … whenever ore can be had"; ore is bought from the mines |
| [ ] | brewer | brews bought malt and grain |
| [ ] | brewery | the same, larger |
| [ ] | maltster | malts bought grain |
| [ ] | mill | grinds the grain brought to it |
| [ ] | mills 2 5 | the same, more of them |
| [ ] | bakers 5 15 | bakes bought flour |
| [ ] | alehouse | brews or buys ale |
| [ ] | butchers 3 8 | buys beasts at market |
| [ ] | carpenter | works bought planks |
| [ ] | carpenter part time | the same, part-time |
| [ ] | carpenters 5 15 | the same, more of them |
| [ ] | cooper | staves are bought |
| [ ] | woodcarver | carves bought wood |
| [ ] | shipyard | ship timber is the classic import |
| [ ] | river boatyard | the same, for river boats |
| [ ] | bowyer fletcher | bow staves and shafts are bought |
| [ ] | thatcher | buys reed and straw |
| [ ] | sawmill | its line: "converts raw logs … whenever logs can be had"; logs are floated and carted to the saw |
| [ ] | sawmill commercial | it saws logs brought to it, as the plain sawmill does |
| [ ] | cobbler | works bought leather |
| [ ] | cobbler s guild | the same, a guild |
| [ ] | tanner established | buys hides from the butchers and the herds |
| [ ] | tanners | the same |
| [ ] | tannery | its line: "converts hides … whenever hides can be had" |
| [ ] | furrier s district | buys pelts |
| [ ] | fuller | fulls cloth woven of bought wool |
| [ ] | weavers textile workers | weave bought yarn and wool |
| [ ] | tailor | sews bought cloth |
| [ ] | tailor s guild | the same, a guild |
| [ ] | dyer | dyes bought cloth |
| [ ] | ropemaker | buys hemp and reed |
| [ ] | chandler | buys tallow and wax |
| [ ] | potter | its line: "made whenever clay can be had"; clay is carted to the wheel |
| [ ] | brickmaker | its line: "whenever clay can be had … requires clay and fuel"; clay is carted to the kilns |
| [ ] | vintner | its line: "from local grapes or imported must": it presses what reaches the cellar |
| [ ] | glassblower | its line: "when sand can be had"; sand travels by any route |
| [ ] | glassmakers | the same |
| [ ] | apothecary | buys herbs and drugs |
| [ ] | alchemist shop | buys reagents |
| [ ] | luxury goods quarter | a quarter that sells what is brought |
| [ ] | fish market | it sells the catch brought to it |
| [ ] | fishmonger | the same |

### (ii) A house that is the source of its material: answered only by its own ground (never by an import or the road); on a coast the sea is the salt works' brine

| strike? | house (catalogue id) | its grounds | why |
|---|---|---|---|
| [ ] | charcoal burner | managed forest, mountain timber, shipbuilding timber | its line: "operates kilns in nearby woodland": charcoal is not burnt from bought logs |
| [ ] | woodcutter s camp | managed forest, mountain timber, shipbuilding timber | it fells the wood it stands in |
| [ ] | dairy farmer | grazing land, alpine pasture, fertile floodplain, camel herds | it keeps the herd it milks; milk does not travel and a herd grazes daily |
| [ ] | shepherd | grazing land, alpine pasture | it keeps the flock on its pasture |
| [ ] | stone quarry | stone quarry | its line: "the only source of proper building stone the place has had" |
| [ ] | mine | iron deposits, precious metals, gemstone deposits, coal deposits | it cuts the seam it stands on |
| [ ] | mine open cast | iron deposits, precious metals, gemstone deposits, coal deposits | the same, open-cast |
| [ ] | peat cutter | marshlands | it cuts the bog it stands on |
| [ ] | salt works | salt flats, desert salt, fishing grounds | its line: "evaporates saline brine … where brine lies near": the brine is its ground (on a coast, the sea) |
| [ ] | fisher s landing | fishing grounds, river fish | the boats fish the water off the landing |
| [ ] | fishing community | fishing grounds, river fish | the same |
| [ ] | hunter s lodge | hunting grounds | it hunts the grounds it stands in |
| [ ] | wildfowler | marshlands, hunting grounds | it hunts the marsh and the grounds |

### The words the birth writes on the imports list (each the list's own word for the good)

| the good (chain key) | the word | why |
|---|---|---|
| wool | Wool | the fuller's and the weavers' wool |
| alpineWool | Wool | the same wool, off the high pasture |
| timber | Timber | the carpenter's planks, the cooper's staves, the sawmill's logs |
| mountainTimber | Timber | the same timber, off the mountain |
| ironOre | Iron ore | the list's own word (`computeActiveChains.js :: UPSTREAM_IMPORT_LABELS`): the smith's and the smelter's iron |
| copperOre | Copper ore | the copper chain's own name of its ore |
| preciousMetals | Precious metals and bullion | the list's own word for bought gold and silver |
| hides | Raw hides and animal products | the list's own word: the tanner's and the cobbler's hides |
| grain | Grain | the crises' own necessity word, the miller's and the brewer's grain |
| clay | Clay and raw materials | the list's own word: the potter's and the brickmaker's clay |
| grapes | Grapes and must | the vintner's line: "from local grapes or imported must" |
| livestock | Livestock | the butcher's beasts |
| sand | Glass sand | the glassmakers' sand |
| desertGlass | Glass sand | the same sand, off the desert |
| herbs | Medicinal herbs | the crises' own necessity word, the apothecary's herbs |
| fish | Salted fish | the shortage list's own word, the fish market's catch |
| luxury | Luxury goods | the luxury goods quarter: the goods its own need line names |

