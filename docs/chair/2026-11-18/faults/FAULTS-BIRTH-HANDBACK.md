# FAULTS-BIRTH hand-back

Seat FAULTS-BIRTH of the round FAULTS (BRIEF-FAULTS, ruling FR8). Base 4288049ba (`lane/faults-base-2026-11-18`); branch
`lane/faults-birth-2026-11-18`. Files touched: `src/domain/facts/houseKinds.js`, `src/domain/facts/supplyStory.js`,
`src/domain/facts/houseInputAtHand.js`, `src/generators/resourceGenerator.js` (all four on my row), my guard
`tests/domain/faultsBirth.test.js`, this file. No odds changed, no story added, NO NEW LINE OF TEXT, no new field on the
saved record, no stored figure re-taken. Every pick is the seed's keyed hash (`supplyStory.js :: seedPicks`) and takes no
draw: over the 30, the 150, the 720 and the 525, at base and tip, **0 towns move a person, a tie, a name or a house**
(BIRTH-AUDIT's `fieldDiff.mjs`: `people 0 · ties 0 · name 0 · roster 0` in every population).

Commits (each pushed at once): 405deb2bf (the title) · cade1620e (items 1 and 2) · 2ec495b92 (item 3) · 5e890e566 (the guard)
· 7c396a207 (item 1: the food record is never unsaid) · 743c037d4 (item 1: nor the exports) · 9b7fb22dd (supplyStoryLaw P2
re-keyed) · 5f099849a (three older tests re-keyed). **My tip: 5f099849a.**

## The rules, before and after (the 30 · the 150 · the 720)

Births by PAGE-COPY's `births.mjs`, renders by its `census3.sh --count-only`, at the base (4288049ba) and at my tip; my counters
in scratch (`ring2.mjs`, `vent.mjs`, `never2.mjs`, `reading.mjs`, `conseq.mjs`) beside BIRTH-2's `table.mjs` and `never.mjs`.

| rule | base | tip |
|---|---|---|
| (a) takers of the second ring on no stored ground of their own, that tell NO story | 7 in 5 · 14 in 14 · **123 in 106** | **0 · 0 · 0** |
| (a) of them, at work on the ground they prove (the land list shows it as proven) | — | 6 · 12 · **110** (fishers 47, woodcutters 24, hunters 22, shepherds 16, wildfowler 1) |
| (a) of them, idle on it used up, marked short, the ground under Depleted | — | 1 · 2 · **13** (shepherds 6, woodcutters 4, hunters 2, wildfowler 1) |
| (a) runJ 11b.fish | 4 (3t) · 0 · **14 (9t)** | 4 (3t) · 0 · **7 (7t)** |
| (a) runJ 11b.fishTitle | 0 · 0 · **4 (2t)** | 0 · 0 · **0** |
| (a) runJ 11b (all) | 6 · 6 · 36 | 6 · 4 · **23** (11b.wool 0 · 2 · 2 → 0 · 0 · 0) |
| (b) towns with a failed venture | 2 · 3 · **11** | 2 · 3 · **9** |
| (b) a venture beside a house that keeps or yields its material | r2r-hamlet-27, r2s-politically_fractured-hamlet-0 (720) | **0** |
| (c) short, no ground of its material used up (`never.mjs` with the page's Depleted reading) | 0 · 19 in 7 · **64 in 25** | 0 · 7 in 4 · **26 in 13** |
| (c) of them on a route isolated in ordinary times with a material a ground gives | 0 · 12 · **37** | **0 · 0 · 0** (+ 1 cobbler of the 720 fed by item 1's hunting grounds) |
| runH 8i.surplus (measured only, item 4) | 0 · 0 · 0 | 0 · 0 · 0 |
| runJ / runK / runH, every other rule | — | **no rule rises** (below) |

THE 11b.fish LEFT (7 in 7 towns of the 720): none is a second-ring landing on no stored ground (all 47 such now prove their water);
they are the "How they deal Talks about the boats, the catch …" person line (6, FAULTS-PEOPLE's FR5) and one secret line of a
mine; FAULTS-PEOPLE's and FAULTS-ROWS's, not mine.

THE RUNNERS (each over the base's render and the tip's): runJ, runK, runH over the 30 and the 150: **identical**, save runJ's
150 (11b 6 → 4: the wool lines of an idle shepherd now carry their mark). runJ over the 720: **0 new instances, 15 gone** (11b.fish
14 → 7, 11b.fishTitle 4 → 0, 11b.wool 2 → 0, 11a.atWork 9 → 8, 11e.offer 15 → 14). runH over the 720: identical. runK over the 720:
the same two lines of r2r-hamlet-21 pass from `12d.enough` (1 town) to `12d.enough.wide` (22 → 23 towns): its need list "stone,
salt" lost "salt" (the proven fishing grounds give it); the instance is the one it was, counted in the wider family. The controls
(`--controls` on the 30): runJ's and runK's tables identical at base and tip (both exit 3 at the base already: other seats' rows).
The two doors (R9) read the same last line at base and tip: `hits 1788 · banked 1938 · fresh 3 · stale 153 · ceiling 1938` and
`fresh 38 · stale 72 · first-register stale 7 · banked 4688 · strips fresh 0 stale 0 banked 107`: no fresh line of mine.

## 1 · THE SECOND RING (FR8 (a)) — done

`houseKinds.js :: IMPLIED_GROUND` gains the six: the woodcutter's camp the managed forest, the shepherd the grazing land, the
fisher's landing and the fishing community the fishing grounds, the hunter's lodge and the wildfowler the hunting grounds (the
wildfowler's game: the marsh's yield is reeds, "Short of reeds." would be false). Their story is the first ring's: the seed's
keyed pick `<seed>::ground::<ground>` (45 of 60 there), BY THE GROUND (one answer a town), stored nowhere; a used-up ground writes the
idle row the first ring writes (`writeStoryRows`), read back off the stored record (BR8). TWO CALLS OF MINE, each vetoable:
- **THE SECOND RING IS NEVER THE FAILED VENTURE** (`SECOND_RING`): no venture's line was ever written for them ("The shepherd is
  failing: no wool lies near …" would be a new printed line, and the hunters have no material word); the venture's candidates are
  those it had.
- **A FACT OF THE RECORD IS NEVER UNSAID** (`supplyStory.js :: groundPicksAtBirth`), as the pick already holds an import the
  record brings: where the town's own food record names the ground's food as what it eats (`foodLand.js`: a fishing row on water
  makes fish a food source with no ground stored: "its food is the day's catch") or its own exports name the ground's raw yield
  ("Furs and pelts"), the ground is there. Found by my own measure: the first cut spent bar0-thorp-calm-rand-47's water beside
  "beyond that, what it puts on the table itself is the day's catch" (runJ 11b.fish over the 30 rose 4 → 5) and r2r-village-2's
  hunting grounds beside its exported furs (runH 8j.exports 0 → 1; leftChainCards (b) red). So every landing on no stored ground
  proves its water (47 of 47 in the 720: each town's food record names fish); the seed decides the shepherds, the woodcutters, the
  hunters and the wildfowler. No house of the first ring moves by this rule (measured: the two commits differ in 2 towns of the
  720, both hunters).

THE TWO TOWNS OF THE BRIEF: **r2r-village-36** now proves its Fishing Grounds (Resources tab, PDF, journal: "Nearby resources: …,
Fishing Grounds, …"); the landing's "Fresh fish" / "Catch of the day." and the arrival scene's "Racks of drying fish line the way
in" stand true beside it; the fishmonger's fish is local, so the birth no longer writes "Salted fish". **r2s-religious_conversion-
village-0**: the same, and "fish" and "desert_salt" leave its need list ("Needed, and not brought in" and the income line's "cannot
go on without fish" with them).

EVERY CONSEQUENCE (an implied ground feeds every house that works its goods, `houseInputAtHand`'s live-ground reading). Over the
720, beyond the 106 towns of the ring itself, **another house's story, input, mark, the imports written at the birth or the need list
change in 22 towns**:
- another house's STORY: r2r-hamlet-27 (the dairy: abandoned → the land has it), r2s-politically_fractured-hamlet-0 (the dairy:
  abandoned → idle, "Short of livestock.": item 2);
- another house's MARK: r2r-hamlet-27 ("Failing: a failed venture." → none), r2s-politically_fractured-hamlet-0 (→ "Short of
  livestock."), r2s-under_siege-town-1 (the Tanner (established) and the Cobbler's guild: "Curtailed by the siege." → none: the
  proven hunting grounds give the hides), r2s-recently_betrayed-village-2 (the Cobbler: "Short of hides." → none);
- another house's INPUT (imported or missing → local): the salt works of r2r-hamlet-18, r2r-village-38, r2r-village-39,
  r2s-under_siege-village-3, r2s-indebted-village-0, r2s-religious_conversion-village-0 (the fishing grounds' salt, as a stored one
  gives it); the tanners and cobblers of r2r-village-9, r2r-town-2, r2r-town-51, r2s-famine-town-1, r2s-recently_betrayed-town-1,
  r2s-under_siege-town-1 (the hunting grounds' or the pasture's hides); the fishmongers of r2r-village-36 and
  r2s-religious_conversion-village-0;
- the IMPORTS written at the birth (a word no longer brought): "Raw hides and animal products" in r2r-village-9, r2r-town-2,
  r2r-town-51, r2s-under_siege-town-1, r2s-famine-town-1; "Salted fish" in r2r-village-36 and r2s-religious_conversion-village-0;
- the NEED LIST (`resourceAnalysis.imports.critical`) loses a good in 15 towns: salt (r2r-thorp-0, -41, -45, r2r-hamlet-21,
  r2s-under_siege-thorp-3), desert salt (r2r-hamlet-18, r2r-village-36, -38, -39, r2s-under_siege-village-3, r2s-indebted-village-0,
  r2s-religious_conversion-village-0), livestock (r2r-hamlet-27; "livestock for meat and draft" r2s-under_siege-town-1), mountain
  timber (r2r-village-3), fish (r2s-religious_conversion-village-0).
TEN TOWNS READ THROUGH THE RENDERER, the base's dump beside the tip's (every surface: the tabs, the Tonight sheet, the PDF, the
journal): r2r-hamlet-27, r2s-politically_fractured-hamlet-0, r2r-village-36, r2s-religious_conversion-village-0, r2r-village-9,
r2s-under_siege-town-1, r2s-recently_betrayed-village-2, r2r-hamlet-18, r2r-village-34, r2r-hamlet-56. Each reads one story on
every surface; quoted where it matters below. One reading for the owner: in r2s-politically_fractured-hamlet-0 the dairy is worked
out ("The dairy farmer is worked out: its own ground is depleted (Open grazing land).", "Depleted: Open Grazing Land") beside a live
"Common grazing land" house of the roster: a common overgrazed, true enough, and better than the base's failed venture there.

## 2 · THE VENTURE'S PICK (FR8 (b)) — done

The birth's `usersOf` (`resourceGenerator.js :: birthPicksOn`, read by `supplyStory.js :: ventureAtBirth`) counts the houses that
KEEP or YIELD the material (`houseKinds.js :: KEEPS_OR_YIELDS`, each with the catalogue's own line: the shepherd and the shepherd
collective, the common grazing land, the stable yard, the stable master, the stable district and the pack animal trader keep
livestock; the shepherd collective yields wool; the hunter's lodge yields hides). **r2r-hamlet-27 now tells the owner's SECOND
story** (the land has it): its Shepherd proves the grazing land (there, by the seed), the Dairy farmer is at work and unmarked, and
every part agrees: the Institutions and Services tabs drop "Failing: a failed venture." (house and all three rows), the Resources
tab and the PDF list "Open Grazing Land" as proven, "Needed, and not brought in: livestock." and the PDF's "IMPORT DEPENDENCIES ·
CRITICAL · Livestock" and its gap line go, and the income line's "Some of Jabalistan's work cannot go on without livestock …" with
them. The second venture the rule refuses, r2s-politically_fractured-hamlet-0 (a dairy beside Common grazing land), tells the
owner's FOURTH story: its grazing land picked used up, the dairy idle and marked "Short of livestock." on the card, its three rows
and the chips, "Depleted: Open Grazing Land" and "The nearby grazing land is used up." on the Resources tab and in the PDF.
**THE VENTURE TOWNS OF THE 720: 11 → 9 — UNDER THE OWNER'S 10.** I change no odds (`SUPPLY_ODDS.abandoned` stays 3 of 60). The 150
keep their 3, the 30 their 2. `supplyStoryLaw.test.js :: L5` ("a failed venture stands in 10 to 20 of its towns") is RED at my tip
for that reason alone ("expected 9 to be greater than or equal to 10"): the band is the owner's calibration; I neither move the
odds nor touch the band. FOR THE OWNER: 4 of 60 would likely restore the band; that is his to say.

## 3 · THE ISOLATED BUYERS (FR8 (c)) — done, two materials left by name

`houseInputAtHand.js :: neverHeldGroundsUsed`, read by `impliedGroundsOnPage` (the Resources tab's Nearby Resources, the PDF's
land list, the journal: the one reader they share): on a route isolated even in ordinary times, a live native buyer
(`BUYS_AND_WORKS`) of a family of `MATERIAL_OF`, marked short (`housesShortOf`), on no spent ground of its own, not the venture,
whose material no ground of the record or of a house gives: the ground of that material is USED UP, a reading of the stored record
alone (no seed: such a town buys nothing in, so the story is the only one), stored nowhere. The house keeps its idle mark and its
line. The ground is the first of the Depleted list's yields that gives the material (`supplyStory.js :: groundOfFamily`: iron ore
the iron deposits, clay the river clay, timber the managed forest, glass sand the glass sand, grapes the vineyards).
AT THE BASE, BY KIND (the 720): potter 9, weavers 8, blacksmith 6, fuller 6, glassmakers 6, vintner 5, tanner (established) 5,
cobbler's guild 5, brickmaker 4, carpenter 2, carpenters (5-15) 2, cooper, glassblower, woodcarver, cobbler, tannery 1 each, and an
alchemist on a road. **37 houses in 23 towns now tell the fourth story** (the 150: 12 in 6); the grounds read used up, by town: river
clay 9, glass sand 7, iron deposits 6, managed forest 5, vineyards 5 (the 150: river clay 3, glass sand 2, managed forest 2, iron 1,
vineyards 1).
FIVE TOWNS READ, before and after: **r2r-village-34** (the potter, the blacksmith): before, both marked short and the land list
silent; after, "Depleted · Iron Ore Deposits · Clay Deposits" and "The nearby iron deposits and river clay are used up." on the
Resources tab and the PDF ("Depleted: Iron Ore Deposits, Clay Deposits"), the marks unchanged. **r2r-village-0** (the blacksmith):
"Depleted: Iron Ore Deposits". **r2r-town-9** (carpenters, cooper, glassblower): "Managed Woodland", "Glass sand" under Depleted.
**r2r-city-48** (glassmakers, brickmaker, vintner; its weavers and fuller left, below): "Glass sand", "Clay Deposits", "Vineyards"
under Depleted. **r2r-town-54** (potter, brickmaker; its fuller left): "Clay Deposits" under Depleted.
LEFT BY NAME, no ground of the land list gives them (`GROUND_YIELD`): **WOOL 14** (weavers 8, fuller 6) and **HIDES 11** (tanner
(established) 5, cobbler's guild 5, tannery 1), in 12 towns of the 720 (the 150: hides 6, wool 1, in 4). And one house that is not
of this item: the alchemist shop of r2s-religious_conversion-town-2, short of medicinal herbs on a connected road.

## 4 · runH's 8i.surplus — measured only

0 at the base and 0 at my tip over the 30, the 150 and the 720 (BIRTH-3's one town of the 150 is gone at this base). Nothing built.

## NEW OR CHANGED LINES: NONE WRITTEN. The existing lines that now print where they did not (three towns each)

- "The <house> is worked out: its own ground is depleted (Open grazing land)." — bar0-hamlet-under_siege-rand-47, r2r-hamlet-56,
  r2r-village-32 (9 towns); "(Hunting grounds)." — bar0-hamlet-under_siege-rand-28, r2r-village-2 (tip: r2r-village-20),
  r2s-monster_pressure-hamlet-3 (5); "(Managed woodland)." — r2r-hamlet-33, r2r-village-20, r2s-politically_fractured-hamlet-1 (4).
- the marks "Short of livestock." (bar0-village-calm-rand-29, r2r-hamlet-56, r2r-village-32), "Short of timber." (r2r-hamlet-33,
  r2r-village-20, r2s-politically_fractured-hamlet-1), "Short of game." (r2r-village-20, r2s-monster_pressure-hamlet-3,
  r2s-slave_revolt-hamlet-1), and their sieged forms "Curtailed by the siege. Short of livestock." (bar0-hamlet-under_siege-rand-47,
  r2s-under_siege-hamlet-3) and "Stopped by the siege. Short of game." (bar0-hamlet-under_siege-rand-28): forms the base already
  prints for a mine and a landing on a spent ground (r2r-metropolis-14, r2s-under_siege-village-1).
- the land list's proven grounds: "Fishing Grounds" (57 towns; bar0-thorp-calm-rand-45, bar0-village-calm-rand-45, r2r-village-36),
  "Hunting Grounds" (27; bar0-town-calm-rand-47, r2r-hamlet-18, r2s-under_siege-town-1), "Managed Woodland" (23; r2r-thorp-0,
  r2r-thorp-33, r2r-thorp-35), "Open Grazing Land" (15; bar0-village-calm-rand-45, r2r-hamlet-27, r2r-village-9).
- "Depleted" with a ground and "The nearby … is used up." (the Resources tab's existing writer): river clay (12; r2r-village-34,
  r2r-village-43, r2r-town-54), managed woodland (11; r2r-hamlet-33, bar0-village-famine-rand-40, r2s-recently_betrayed-village-2),
  glass sand (9; r2r-town-9, r2r-city-20, r2r-city-48), iron deposits (7; r2r-village-0, r2r-village-23, r2r-village-34), open grazing
  land (9; r2r-hamlet-56, r2s-politically_fractured-hamlet-0, r2s-mass_migration-hamlet-1), hunting grounds (6; r2r-village-20,
  r2s-monster_pressure-hamlet-3, bar0-hamlet-under_siege-rand-28), vineyards (6; r2r-city-48, r2r-city-49, r2r-metropolis-9).
- one priority note: "Military focus highlights gap: timber processing is incomplete, strategic vulnerability." in r2r-village-20
  (its woodcutter's spent wood gives the gap it reads).
- GONE: "The dairy farmer is failing: no livestock lies near and none is brought in." (r2r-hamlet-27,
  r2s-politically_fractured-hamlet-0) and their "Failing: a failed venture." marks.

## DECLARED MOVES (R5)

The stored record's field families that move, against the base (BIRTH-AUDIT's `fieldDiff.mjs`, my tip's births):
| population | towns moved | families | people · ties · name · roster |
|---|---|---|---|
| the 30 | **1** (bar0-hamlet-under_siege-rand-47) | `resourceAnalysis.gaps` 1 | 0 · 0 · 0 · 0 |
| the 150 | **2** (bar0-hamlet-under_siege-rand-28, bar0-village-calm-rand-29) | `resourceAnalysis.gaps` 2 | 0 · 0 · 0 · 0 |
| the 720 | **34** | `resourceAnalysis.gaps` 24 · `resourceAnalysis.imports` 15 · `economicState.primaryImports` 7 · `resourceAnalysis.priorityNotes` 1 | 0 · 0 · 0 · 0 |
| THE 525 | **0 of 525** (sha256 of each record, the golden's own `hashFor`) | — | — |

The 720's 34, by family: gaps (an idle taker's row, the dairies' rows, the salt works', tanners' and fishmongers' rows no longer
"imported"): r2r-hamlet-18, -27, -33, -56, r2r-town-34, r2r-village-2, -9, -20, -32, -36, -38, -39, -47, r2s-indebted-village-0,
r2s-mass_migration-hamlet-1, r2s-monster_pressure-hamlet-3, r2s-politically_fractured-hamlet-0, -1, r2s-religious_conversion-
village-0, r2s-slave_revolt-hamlet-1, r2s-succession_void-hamlet-0, r2s-under_siege-hamlet-3, -village-3, r2s-wartime-village-3;
the need list: r2r-hamlet-18, -21, -27, r2r-thorp-0, -41, -45, r2r-village-3, -36, -38, -39, r2s-indebted-village-0,
r2s-religious_conversion-village-0, r2s-under_siege-thorp-3, -town-1, -village-3; the imports: r2r-town-2, -51, r2r-village-9, -36,
r2s-famine-town-1, r2s-religious_conversion-village-0, r2s-under_siege-town-1; the priority note: r2r-village-20. The other 94 of
the 128 towns whose page moves move by a reading only (the proven or depleted grounds, stored nowhere). NO DRAW: the picks are
`fnv1a32` of keyed strings; no town of any population moves a person, a tie, a name or a house. Nothing touches
`settlementMigrations.js` or `mutateEntities.js`: a town saved before this round reads its second-ring takers as "there" (no idle
row is stored: BR4's own reading of an old record) and its isolated buyers as the fourth story (a reading).

THE STORIES, the owner's table (BIRTH-2's `table.mjs`, houses (towns)), base → tip, the 720: the land has it 2,534 (573) → **2,584
(592)**; used up, bought in 1,097 (265) → 1,095 (264); never there, bought in 1,878 (423) → **1,829 (392)**; under a siege, never
there 103 (18) → 96 (14); idle 129 (104) → **138 (111)** (no route 10 → 11, under a siege 4 → 5); the failed venture "Failing" 8 →
**6**, "Abandoned" 3 → 3. (`table.mjs`'s own "short, no ground used up" reads `usedGroundOf` only, 64 → 63: the isolated buyers' grounds
are the page's reading, `impliedGroundsOnPage`, which `never2.mjs` reads: 64 → 26.) The 150: the land has it 527 → 534, never there
281 → 278, idle 11 → 12. The 30: the land has it 114 → 118, never there 64 → 59.

## STORED FIGURES MY WORK MOVES (the close's; none re-taken)

- the golden master (`tests/fixtures/generator-golden-master.json`): **0 of the 525 rows move** against the base (the base itself
  differs from the stored file in 499, the close's).
- runJ's, runK's, runH's figures over the 720 (above); the auditors' RUN-J/K/H files are not mine to rewrite.
- the venture count the guard L5 holds (10 to 20 of the 720): 11 → 9 (above).
- the lint walkers' registers, censuses and counts: the estate's file count (`sovereigntyLightingContract.walker`, "THE CENSUS IS AN ASSERTION"): stored 3641, measured
  3690 at the base, **3691 at my tip** (my one new file, `tests/domain/faultsBirth.test.js`); `writerReach.walker`'s frozen
  `shapesDigest` (stored 05cdd05bb5cc…): measured 25b8a5539fa9… at the base, **bd73f89e16a5… at my tip** (the births move; its two
  tests red at both, by that digest alone).

## THE THREE VIEWS (N4)

`supplyStoryLaw.test.js :: BR8` (the record, the record without its seed, `toPublicSafe`, the share veil, and the birth's pick,
over the 720 and the 150): **green at my tip** (as at the base): the three views tell one story in every town of the 870. My guard holds `impliedGroundsOnPage` equal across the three views in its 19 anchor towns.

## THE GUARD — `tests/domain/faultsBirth.test.js` (12 tests)

At the base (the file copied in): **9 red** (every positive: the second ring proves its ground; the two towns of the brief; the food
record and the exports are never unsaid; the lone woodcutter; the two dairies; the constructed dairy and tanner; the isolated buyers;
the isolated smith), **3 green** (its negatives: a taker on a stored ground proves nothing; a venture still stands where no house
keeps its material; the three views). At my tip: **12 green**. Every seed loop collects its
failures (`collectSeedFailures`); each positive has a negative beside it (a lone charcoal burner IS picked; a lone dairy and a lone
tanner ARE picked; with no food record or no export of its yield the seed spends the ground; a connected road implies nothing; hides
imply nothing). Anchors: towns of the 720 and the 150 whose supply story no other seat of this round lifts, and constructed records.

## OLDER TESTS RE-KEYED BY IDENTITY (R8), each with a dated note beside it

- `tests/domain/supplyStoryLaw.test.js :: P2` (the venture's mark on every tab): its anchor "more than 9 ventures rendered" over the
  720 (9 now): the same claim over the 720 and the 150 (12).
- `tests/domain/bar8Marks2.test.js :: (5)`: the fishmongers of r2r-village-36 and r2s-religious_conversion-village-0 run on local
  fish now: the claim on r2r-village-49 and r2r-village-57 (with r2s-indebted-village-2); the tannery of r2r-village-9 is fed by its
  pasture's hides: the claim on r2s-religious_conversion-village-3, its two anchors asserted.
- `tests/domain/leftMarks.test.js :: M3`: r2s-politically_fractured-hamlet-0 is no venture: bar0-town-calm-rand-32 (a potter venture,
  its only mark).
- `tests/pdf/leftPdfReadsTheTabs.test.jsx` (the negatives): r2r-village-0 now reads its iron used up: r2r-village-1 (added to the
  sample).
- `tests/components/leftChainCards.test.jsx :: (b)` went red at 7c396a207 (r2r-village-2's exported furs beside its idle lodge) and
  is cured, not re-keyed, by 743c037d4.

## THE NET (each gate alone through `sh scripts/gate-tail.sh`, in git worktrees of the base and of my tip)

| gate | base (4288049ba) | tip (5f099849a) |
|---|---|---|
| `npm run typecheck:domain:strict` | 0 | **0** |
| `npm run typecheck:ratchet` | 0 | **0** |
| `npx eslint` (my five files) | (my guard absent: 2) | **0** |
| `npx vitest run tests/architecture` | 347 / 347 | **347 / 347** |
| ALL of `tests/lint` (JSON) | 41 tests in 23 files red | **the same 41 by name; 39 of 42 messages identical; the 3 that differ are the two figures above** |
| `npx vitest run tests/joins` | 425 / 425 | **425 / 425** |
| N3 `pipelineContract`, `isolatedTrade`, `publicProseEquality` | green | **green** |
| N3 `pipelinePinnedMode` (3 red: the golden moved, 38 rows) · `generationForkCensus` (3 red: the control row's hash, the fnv1a32 callers 54 against 23, A4) | red | **the same 3 + 3, the same messages** (0 of the 525 move by me) |
| `supplyStoryLaw` | green | **1 red: L5 only** ("expected 9 to be greater than or equal to 10"), declared above; BR8 (the three views), L1-L3, P2 (re-keyed), W1, L4, M1, M4 green |
| `birthKindsLaw`, `bar6MarksLaw8`, `bar8FishRows` | green | **green** |
| `bar8Marks2` | green | **green** (re-keyed) |
| my guard `faultsBirth` | 9 red · 3 green | **12 green** |
| ONE `npm run build`, then `vendorPdfLazy` + `bootSmoke` | 0; 49 passed · 17 skipped | **0; 49 passed · 17 skipped** |
| THE OLDER TESTS naming what I changed (`grep -rlE` of IMPLIED_GROUND, SECOND_RING, KEEPS_OR_YIELDS, ventureAtBirth, birthPicksOn, impliedGroundsOnPage, groundGives, groundOfFamily, neverHeldGroundsUsed, usersOf, houseKinds, supplyStory, and the helpers that read them): `bar2ServicesRows`, `leftChainCards`, `bar4CorpusEcoKinds`, `leftMarks`, `bar8Rows`, `houseInputReaches`, `upkeepVocation`, `leftPdfReadsTheTabs`, `bar4MarkPromise`, `bar6PeopleLaw10` | green | **green** (leftMarks, leftPdfReadsTheTabs re-keyed; leftChainCards cured) |

Before the last two code commits an intermediate tip (7c396a207) read bar8Marks2, leftChainCards, leftMarks and
leftPdfReadsTheTabs red: each followed above. The renders: the tip's 30 and 150 at 7c396a207, whose births equal my tip's (0 of
the 180 records differ); the tip's 720 at 7c396a207 with r2r-village-2 and r2r-town-34 re-rendered at 5f099849a (the only two
records that differ; the other 718 byte-identical).

## THE SCRATCH MERGE (N5)

The line's tip (`lane/join-2026-11-14` at 70e557d5b) is an ancestor of my base: the merge is "already up to date". Clean.

## WHAT I LEFT, BY NAME

- `supplyStoryLaw :: L5` red: the failed venture in 9 of the 720, under the owner's band (odds unchanged: the owner's).
- Wool 14 and hides 11 isolated buyers (no ground gives them); the alchemist of r2s-religious_conversion-town-2 (a connected road).
- The second ring as the failed venture (refused: it would print new lines).
- The landing implies "Fishing grounds" on a river too (one ground a kind, as the first ring's mine implies iron); not raised.
- The "How they deal Talks about the boats …" line (FAULTS-PEOPLE) and the cards (FAULTS-ROWS): theirs.
- NOT RAISED: code clean-up (none built).


## FR21 (the chair's ruling of 2026-11-18, after READ-BIRTH) — the follow-up, one commit an item

**Tip: c5f2fcc82.** Commits: 4edec0cd1 (4) · 2d92861ec (3) · 6f7584adc (2) · cc5840c17 (1) · d51b8b47a (7) · c5f2fcc82 (1: the guard's
bought/refused arm) · this section. Base for every count below: 4288049ba; "the old tip": 703d5962b (its source equals 5f099849a's).

**(4) THE EXPORT RULE — MEASURED, THEN REMOVED.** (a) By the writer's code: "(transit)" is the entrepôt's mark ("Entrepôt transit
goods — flagged distinctively … a transit good passes through untouched", `computeActiveChains.js` §3). r2r-village-2's stored
export is plain "Furs and pelts" (written by §2 off `furs_north`, a chain both exportable AND an entrepôt, whose own note says "Furs
travel from the hunting grounds through trading posts"), and the page re-marks it "(transit)" (`tradeListDisplay.js ::
pillAsPrinted`) because the page's reader of a chain's carrier (`chainCarrier.js :: chainCarrierOf`) reads `transit` ("it runs on
passing trade") for a chain whose ground is not on the stored land list. AN IMPLIED GROUND IS ON NO STORED LIST, so by the page's
own reader no export can prove one: the furs are other places', the lodge sits on the road. The matcher is removed (no second
reading); r2r-village-2 and r2r-town-34 are spent again by their seed (their lodges "Short of game.", "The hunter's lodge is worked
out: its own ground is depleted (Hunting grounds)."). (b) The guard holds it to the page: over the census's 720, no active chain's
own ground (`chainCarrierOf(...).kind === 'own'`) is a ground a house implies (`faultsBirth :: FR21 (4b)`, 200+ implied grounds read).
CONSEQUENCE, FOR THE CHAIR: the pill "Furs and pelts (transit)" of r2r-village-2 now prints beside its idle lodge, the entrepôt
card's named house: `tests/components/leftChainCards.test.jsx :: (b)` ("no output and no pill names a good whose every maker is
marked short") is RED at my tip on that one instance (`r2r-village-2 · Exports Furs and pelts (transit) · Hunter's lodge`), as it
was at 7c396a207; runH's 8j.exports reads it too (below). Both read a transit pill as made; the card's naming of the lodge as the
furs' source is the naming debt. Not narrowed, not re-keyed (the test's claim is over all the towns), and no label changed: yours.

**(3) A RIVER'S FISHING GROUND GIVES NO SALT.** `houseInputAtHand.js :: impliedGroundGoods`: an implied ground gives its key and its
catalogue goods save the sea's own; on water that is no sea (`tradeRouteSemantics.js :: waterAccessKind`, the world law's reading)
the fishing grounds give fish and no salt. The input reader and the birth's need list read the one helper. The six river towns
(r2r-village-38, -39, r2s-under_siege-village-3, r2s-indebted-village-0, r2r-hamlet-18, r2s-religious_conversion-village-0): each
salt works reads `imported` and story `bought`, unmarked (r2s-under_siege-village-3: "Curtailed by the siege."), exactly as at the base;
"desert_salt" is back on all six need lists; and "salt" on the need lists of r2r-thorp-0, -41, -45, r2r-hamlet-21,
r2s-under_siege-thorp-3, as at the base (runK's r2r-hamlet-21 re-class undone). A stored fishing ground keeps the catalogue's goods.

**(2) THE COMMON PROVES THE PASTURE (the chair's ruling).** `supplyStory.js :: GROUND_KEPT_BY`: where a live Common grazing land
stands, the pick does not spend the grazing land. The twelve towns, before → after, each now the owner's second story (the pasture
proven; the dairy and the shepherd at work): r2r-hamlet-52, r2r-hamlet-56 (shepherd and dairy "Short of livestock." → none),
r2r-village-32 (shepherd → none), r2r-village-46, r2r-village-47 (both → none), r2s-under_siege-hamlet-3 (shepherd "Curtailed by
the siege. Short of livestock." → "Curtailed by the siege.", the siege's mark as at the base), r2s-occupied-village-1 (dairy → none),
r2s-politically_fractured-hamlet-0 (dairy → none), r2s-indebted-hamlet-2 (dairy → none), r2s-succession_void-hamlet-0 (both → none),
r2s-monster_pressure-hamlet-3, r2s-mass_migration-hamlet-1 (shepherd → none); "Depleted: Open Grazing Land", "The nearby grazing
land is used up." and the worked-out lines leave all twelve. LEFT BY NAME: 8 towns of the 720 whose grazing land THE RECORD ITSELF
stores spent beside a common (`config.nearbyResourcesDepleted`, not the pick's; nothing here rewrites a stored record):
r2r-hamlet-53, r2r-village-15, -20, -49, r2s-infiltrated-village-0, r2s-plague_onset-village-1, r2s-succession_void-hamlet-3,
r2s-monster_pressure-village-2 (the same 8 at the base).

**(1) WOOL AND HIDES TAKE THEIR GROUNDS.** `supplyStory.js :: groundGives` reads, beside the Depleted list's one yield a ground
(`GROUND_YIELD`, held equal to its source), the record's own words (`ALSO_GIVES`): the hunting grounds give hides ("Game and hides
(local hunting grounds exhausted)", `resourceSemantics.js`), the pastures give wool (the catalogue's grazing goods: livestock, wool,
dairy, animal hides; the alpine pasture's own word, "Wool, dairy, and livestock …"). Every reader of a material's ground reads the
one `groundGives`: the isolated buyers' reading (FR8 (c)), the birth's `usedGroundOf` and the venture's pick. One more fault the
measure found and the item cures: on a connected road beside a spent pasture, the pasture's shortage word ("Livestock and dairy (local
grazing land depleted)") names no wool, so no seed could ever feed a wool house there (every one fell idle); where a ground's word
names another good, the birth buys or refuses the material by its own word ("Wool", "Raw hides …") under the same keyed pick
(`resourceGenerator.js :: importsBroughtAtBirth` (2)). AT THE OLD TIP: 24 houses marked "Short of hides." / "Short of wool." in the
720, 20 of them (all on isolated routes) beside no used-up ground of their material (r2r-village-23, r2r-town-54, r2r-city-48, -49,
-51, r2r-metropolis-9, -44, -54, r2s-politically_fractured-town-2, r2s-indebted-town-3, r2s-mass_migration-town-2), plus 4 ventures.
AT MY TIP (the 720 and the 150): **44 houses marked short of hides or wool, every one beside a used-up ground of its material under
Depleted** (the owner's fourth story), and the 4 ventures (r2r-town-13, -18, r2s-infiltrated-town-1, r2s-wartime-city-3) unchanged.
On a connected road, of the wool and hides towns on a used-up ground (the 720 and the 150): bought in 140, idle 8 (r2r-city-45,
r2r-metropolis-12, -38, -41, r2s-occupied-metropolis-2, bar0-town-occupied-rand-33, bar0-city-wartime-rand-37,
bar0-metropolis-calm-rand-38: the seed's refusal, the houses "Short of wool." / "Short of hides." beside "Depleted: …"). No new text: every
line is one that prints already (the marks, "Depleted", "The nearby grazing land is used up.", the arrival scene's twin "Little cloth
is made here, and the cloth that is sold was brought in from elsewhere." in r2s-occupied-metropolis-2).

**(5) THE VENTURES.** After (2): 9 of the 720 (unchanged), 3 of the 150. After (1): **9 of the 720** (r2r-hamlet-26, -48, -57,
r2r-village-45, r2r-town-13, -18, r2s-under_siege-city-1, r2s-infiltrated-town-1, r2s-wartime-city-3: the reader's nine, the same
houses and versions), **3 of the 150**, 2 of the 30. No stop. `supplyStoryLaw :: L5` stays red at 9 ("expected 9 to be greater than
or equal to 10"): the floor the last close re-records.

**(6) THE DECLARED MOVES, CORRECTED.** The reader is right: at the old tip (5f099849a's births, base against tip) the 720 moved
**33** towns, not 34: `resourceAnalysis.gaps` 22 (not 24: r2r-town-34 and r2r-village-2 equal the base), `resourceAnalysis.imports`
15, `economicState.primaryImports` **8** (not 7: r2r-town-34 lost "Raw hides and animal products", which my list missed),
`resourceAnalysis.priorityNotes` 1. My figures had been taken from 7c396a207's births. THIS FOLLOW-UP'S MOVES, births of my tip against
the base, by field family, every town:
- **the 30: 1** (bar0-hamlet-under_siege-rand-47: `resourceAnalysis.gaps`, `resourceAnalysis.imports`, `economicState.primaryImports`).
- **the 150: 7**: `resourceAnalysis.gaps` 4 (bar0-hamlet-under_siege-rand-28, bar0-hamlet-calm-rand-29, bar0-village-calm-rand-29,
  bar0-hamlet-under_siege-rand-36); `economicState.primaryImports` 5 (bar0-hamlet-calm-rand-29, bar0-town-occupied-rand-33,
  bar0-hamlet-under_siege-rand-36, bar0-city-wartime-rand-37, bar0-metropolis-calm-rand-38); `resourceAnalysis.imports` 1
  (bar0-village-calm-rand-29).
- **the 720: 32**: `resourceAnalysis.gaps` 22 (r2r-hamlet-27, -33, -52, -56, r2r-village-2, -9, -20, -32, -36, -46, -47, r2r-town-34,
  r2s-under_siege-hamlet-3, r2s-occupied-village-1, r2s-politically_fractured-hamlet-0, -1, r2s-indebted-hamlet-2,
  r2s-succession_void-hamlet-0, r2s-monster_pressure-hamlet-3, r2s-religious_conversion-village-0, r2s-slave_revolt-hamlet-1,
  r2s-wartime-village-3); `economicState.primaryImports` 18 (r2r-hamlet-52, r2r-village-9, -32, -36, -46, r2r-town-2, -34, -51,
  r2r-city-45, r2r-metropolis-12, -38, -41, r2s-under_siege-hamlet-3, r2s-under_siege-town-1, r2s-famine-town-1,
  r2s-occupied-metropolis-2, r2s-monster_pressure-hamlet-3, r2s-religious_conversion-village-0); `resourceAnalysis.imports` 8
  (r2r-hamlet-27, r2r-village-3, -36, -46, -47, r2s-under_siege-town-1, r2s-occupied-village-1, r2s-religious_conversion-village-0);
  `resourceAnalysis.priorityNotes` 1 (r2r-village-20); `arrivalScene` 1 (r2s-occupied-metropolis-2).
- **the 525: 0 of 525** (sha256 of each record, the golden's own `hashFor`; the stored file differs from the base in 499, the close's).
- **NO DRAW**: with the moved families struck, every record's sha256 is equal, base against tip: 30 of 30, 150 of 150, 720 of 720;
  no person, tie, name or house moves (`fieldDiff.mjs`: 0 · 0 · 0 · 0 in each population).

**(7)** `leftPdfReadsTheTabs`' sample comment now says what r2r-village-0 (a used-up ground off the stored list) and r2r-village-1
(none) print.

**THE PROOFS.** My guard, `tests/domain/faultsBirth.test.js`, 17 tests: at the old tip the six FR21 positives are RED, each by its own
claim (an exported "Furs and pelts" kept the ground there; the six river salt works read local; the twelve pastures read used up; the
isolated tanner and fuller implied nothing; 11 of 15 hides and wool towns printed a short mark with no ground; r2r-city-45 bought
"Wool" by the old word) and FR21 (4b), a claim held to the page's reader and no cure, green there as here. AT MY TIP: 17 green. UNDER
MUTATION (each cure reverted alone in a scratch copy of my tip): emptying `ALSO_GIVES` reds the two (1) tests; buying the pasture's
word in place of the material's reds the (1) bought/refused test; emptying `GROUND_KEPT_BY` reds (2); emptying `SEA_GOODS` reds (3);
restoring an export matcher reds (4). `supplyStoryLaw`: L1 to L3, L4, BR8 (the record, the record without its seed, `toPublicSafe`,
the share veil, the birth's pick, over the 720 and the 150), P2, W1, M1, M4 green; L5 red at 9, the same message as the old tip.

**THE NET, tip against tip** (each gate alone through `sh scripts/gate-tail.sh`, in a git worktree of my tip; the old tip's net above):
| gate | the old tip (5f099849a) | my tip (d51b8b47a; c5f2fcc82 adds a guard test only) |
|---|---|---|
| `typecheck:domain:strict` · `typecheck:ratchet` · `eslint` (my files) | 0 · 0 · 0 | **0 · 0 · 0** |
| `tests/architecture` · `tests/joins` | 347 · 425 green | **347 · 425 green** |
| ALL of `tests/lint` | 41 red (23 files) | **the same 41 by name, all 42 messages identical** (the estate's count 3691 and writerReach's digest bd73f89e16a5… as at the old tip) |
| N3: `pipelineContract`, `isolatedTrade`, `publicProseEquality` · `pipelinePinnedMode`, `generationForkCensus` | green · red | **green · the same reds, the same messages** |
| `supplyStoryLaw` | L5 red (9) | **L5 red (9), the same message; all else green** |
| `birthKindsLaw`, `bar6MarksLaw8`, `bar8Marks2`, `bar8FishRows`, the older tests of my list | green | **green, save `leftChainCards (b)`: RED, one instance (item (4), above)** |
| my guard | 12 green | **17 green** (at c5f2fcc82) |
| ONE `npm run build`, `vendorPdfLazy` + `bootSmoke` | 0; 49 passed · 17 skipped | **0; 49 passed · 17 skipped** |
| the two doors (R9) | `fresh 3 · stale 153` · `fresh 38 · stale 72` | **the same lines** |

**THE RUNNERS** (full renders of the 30, the 150 and the 720 at my tip; each record of the render byte-equal to my tip's births):
- the 30 and the 150: runJ, runK, runH identical to the base, save runJ's 150 (11b 6 → 4, the idle shepherd's wool lines marked:
  as at the old tip). The controls of the 30 (`--controls`): runJ's and runK's tables identical at base and tip.
- the 720, by rule (base | old tip | my tip): runJ 11b.fish 14 | 7 | **7**, 11b.fishTitle 4 | 0 | **0**, 11b.wool 2 | 0 | **0**,
  11a.atWork 9 | 8 | **8**, 11e.offer 15 | 14 | **14**, every other rule equal; runK **equal to the base** in every rule (12d.enough 2 | 0
  | 2 and 12d.enough.wide 44 | 46 | 44: (3) gives r2r-hamlet-21 back its "salt"); runH 8k.trade.mild 4 | 4 | 4, and **8j.exports 0 | 0 |
  1: RISES**, one instance: r2r-village-2, "Exports lists Furs and pelts (transit); every house that makes it (Hunter's lodge) is marked
  short": the consequence of (4), with leftChainCards (b) above. FOR THE CHAIR: both read the transit pill as made by the lodge.
  Three ways out, none mine to choose: the pill reads its transit carrier, the entrepôt card stops naming the lodge as the furs' maker,
  or the rule of (4) is reversed for this one town. I changed nothing of either reader.

**WHAT FR21 LEAVES, BY NAME**: the transit-pill instance (above); the 8 towns whose stored grazing land is spent beside a common
(above); the alchemist of r2s-religious_conversion-town-2, short of medicinal herbs on a connected road (FR8's, not this ruling's);
`supplyStoryLaw :: L5` at 9 (the close's floor).
