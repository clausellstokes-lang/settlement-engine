# BIRTH-2 · the seed picks one supply story for each house and its material, and every part of the page tells it · HAND-BACK

Seat BIRTH-2 (`docs/chair/2026-11-14/briefs/BRIEF-BIRTH-2.md` on the chair's lane). Base **a55162cfa** (the joined line; it
holds BIRTH-1 and the round BAR7's economy seat). Branch `lane/birth-2-2026-11-17`. Nothing merged. **No person, tie, name
or house moves in any town** (the `fieldDiff` table below). The chair's ruling **BR7** (07:26 UTC, on my report that the
seed could not reach the birth from my files) gave me one hunk of `src/generators/steps/generateNarratives.js`: the one call
of `generateResourceAnalysis` takes `ctx._seed` as its 7th argument, and nothing else in that file.

**How every figure was made.** Births by PAGE-COPY's `births.mjs` and `seedcfg.mjs` (the 720: `seeds.txt`; the 150:
`bar0-<shape>-rand-27..41`) and the audit's `birthsRef.mjs` (the 525), in scratch trees at the base and at the tip (final
births `t3`, each part seen to end `EXIT 0`). Counts: the audit's `fieldDiff.mjs` unchanged; my probes beside this file
(`birth2/`): `story.mjs` (stories, implied grounds, ventures, the pairs), `law.mjs` (L1-L3 by the tree's own readers),
`table.mjs` (item 11), `marks.mjs` (item 3), `never.mjs` (item 2 (e)), `misc.mjs` (the siege, the fish market, the lines),
`find8.mjs` (LAW 8 and its controls).

## 11 · THE TABLE FOR THE OWNER: HOW OFTEN EACH STORY COMES UP (first, as the brief asks)

Every live house that works a material (the leaf's `MATERIAL_OF`: the buyers and the source houses), each counted once, in
its story. "Before" is BIRTH-1's tree (the base); "after" is this seat's. A house counted as "bought in" stands beside its
material on the town's imports; under a siege that import reads cut off and the house reads "Curtailed by the siege.".

**The census's 720 towns**

| the story | before: houses (towns) | after: houses (towns) | after, by size of town | after, by material (the largest) |
|---|---|---|---|---|
| 2 · the land has it | 2,254 (564) | **2,516 (573)** | thorp 30, hamlet 140, village 292, town 311, city 826, metropolis 917 | timber 565, grain 390, fish 318, iron 280, hides 217 |
| 1 · used up, bought in | 985 (246) | **1,044 (256)** | hamlet 3, village 7, town 148, city 280, metropolis 606 | grain 499, timber 280, iron 170, hides 66, salt 14 |
| 3 · never there, bought in | 2,144 (430) | **1,923 (423)** | thorp 13, hamlet 45, village 96, town 294, city 704, metropolis 771 | clay 446, iron 351, wool 325, timber 273, hides 249, grapes 137 |
| 4 · used up, not bought in: the house idle | 146 (121) | **147 (115)** | thorp 1, hamlet 17, village 15, town 7, city 13, metropolis 94 | iron 56, stone 53, fish 17, timber 7, wool 3, peat 3 |
| a bought-in story under a siege (cut off) | 85 (25) | **133 (26)** | — | grain 28, iron 20, clay 17, timber 14, wool 13 |
| no route even in ordinary times: bought in by the economy's own list / idle | 83 (23) / 5 (5) | 81 (22) / **11 (8)** | — | — |
| **5 · THE FAILED VENTURE: "Abandoned"** | 0 | **4 (4)** | town 2, city 2 | hides 2, clay 1, timber 1 |
| **5 · THE FAILED VENTURE: "Failing"** | 0 | **11 (11)** | hamlet 5, village 1, town 2, city 1, metropolis 2 | wool 3, timber 2, livestock 2, hides 2, peat 1, stone 1 |
| short, and no ground of its material used up (the leftovers: below, item 2 (e)) | 238 (141) | **71 (27)** | village 15, town 17, city 18, metropolis 21 | hides 16, wool 14, clay 13, iron 10 |

**The wide read's 150**: the land has it 455 → **525**; used up, bought in 109 → **123**; never there, bought in 336 →
**290**; idle 17 → **12**; cut off by a siege 74 → **127**; the failed venture 0 → **4 ("Abandoned", 4 towns)**; short with
no ground used up 111 → **25**.

THE ODDS AS BUILT (the leaf `houseKinds.js :: SUPPLY_ODDS`, "N in 60"): **the ground is there 45 · bought in 45 · a failed
venture 3**. Measured over the 720: of the 200 grounds the houses prove, **151 there, 49 used up (75.5% there)**; a failed
venture stands in **15 of the 720 towns (about one in fifty) and 4 of the 150**, never two in a town.

## The proof that no person, tie, name or house moves (`fieldDiff.mjs`, base a55162cfa against the tip's final births)

| population | towns | changed | people | ties | name | roster | stored field families moved (towns) |
|---|---|---|---|---|---|---|---|
| the census's 720 | 720 | 171 | **0** | **0** | **0** | **0** | `resourceAnalysis.gaps` 141 · `economicState.primaryImports` 116 · `resourceAnalysis.imports` 74 · `resourceAnalysis.priorityNotes` 17 · `arrivalScene` 7 · `economicViability.plotHooks` 6 · `economicViability.summary` 1 |
| the wide read's 150 | 150 | 42 | **0** | **0** | **0** | **0** | gaps 38 · imports 32 · `resourceAnalysis.imports` 15 · priorityNotes 5 · `arrivalScene` 3 · plotHooks 1 |
| the 525 reference configurations | 525 | 40 | **0** | **0** | **0** | **0** | gaps 32 · imports 15 (and the need list, priority notes in fewer) |

THE DECLARED MOVE (R5): the imports list (the words bought, now by the seed's pick, under a siege too), the gaps (written
as the reader answers), the need list `resourceAnalysis.imports.critical` (a ground a house proves is no critical import),
and what reads those after them at the same hour (priority notes, plot hooks, arrival scene). **No land list moves**: an
implied ground is stored nowhere (guard L4: the write site runs over a frozen config). **No new field.**

## The items

| # | item | done / left | before → after (the 720 · the 150) | guard |
|---|---|---|---|---|
| 1 | the kinds and the odds (`houseKinds.js`) | done | `TAKERS` 10, `RUNS_ON_BOUGHT` 3, `IMPLIED_GROUND` 6, `MATERIAL_OF`, `SUPPLY_ODDS`; the salt works' fishing grounds struck ("… worked out … (Fishing grounds)." in r2s-wartime-city-1 → gone); the second ring LEFT by name | L1, L5 |
| 2 | the one reading (`supplyStory.js`, new) | done; (e) LEFT by name | implied grounds in 175 · 31 towns; ventures 15 · 4 | L1-L5, BR7 |
| 3 | the reader | done | marks 451 → **336** · 142 → **54**; the fish market a buyer; the burner fed by bought timber; c1 (a taker fed by an import) **0** | L1, L3 |
| 4 | the birth | done | under a siege: buyers short with no cause **60 in 14 towns → 1 in 1** (r2s-under_siege-town-1) · 71 in 18 → 1; "Salted fish" beside a fish market short of fish **27 → 0** · 2 → 0 | L1, BR7 |
| 5 | the gap lines | done | "No timber reaches the charcoal burner." beside "Timber" **49 → 0** · 10 → 0; worked-out lines 49 → 66 · 8 → 7; the venture's line 15 · 4 | L1 |
| 6 | the page (Nearby Resources) | done | the section changes in **171 · 31 towns** | L1 (Depleted) |
| 7 | the other readers of the land list | named (below) | — | — |
| 8 | the card | LEFT by name (W3) | — | — |
| 9 | the held input items | re-measured, LEFT | LAW 8's LEFT: the same three at base and tip | `bar6MarksLaw8` (a) |
| 10 | the guard `tests/domain/supplyStoryLaw.test.js` | done | fails at the base (it cannot load there; its pair arm reads 49 towns there) | itself |
| 12 | the page after me, read | in part (below) | — | — |

### 1 · The kinds and the odds

`TAKERS` (cannot buy in what they take: worked out on a used-up ground whatever the town buys): stone quarry, mine, open-cast
mine, peat cutter, woodcutter's camp, shepherd, fisher's landing, fishing community, hunter's lodge, wildfowler.
`RUNS_ON_BOUGHT`, each with the word the imports list already holds: salt works **"Salt"** (the economy's necessity word:
`economy/primaryTradeLists.js:28`, `economy/tradeGoods.js:67`), charcoal burner **"Timber"** (`IMPORT_WORD.timber`, written in
156 towns by BIRTH-1), dairy farmer **"Livestock"** (`IMPORT_WORD.livestock`). `IMPLIED_GROUND`: stone quarry `stone_quarry`;
mine and open-cast mine `iron_deposits`; peat cutter `marshlands`; dairy farmer `grazing_land`; charcoal burner
`managed_forest`; the salt works none (off the coast its salt is bought: 50 salt works of the 720 tell "bought in").

THE SECOND RING, COUNTED, LEFT BY NAME (the census's 720, houses on no ground of their own, as the tip reads them): fisher's
landing 32, fishing community 15, woodcutter's camp 28, hunter's lodge 24, shepherd 22, wildfowler 2. Each kind's ground can
be chosen in one line (the landing: the sea's on a port route or coastal terrain, the river's on a river route or riverside
terrain; the woodcutter: managed woodland; the hunters: hunting grounds; the shepherd: grazing land; the wildfowler: the
marsh), but giving them a ground makes about one in four of them idle (a taker on a used-up ground) and marks ~30 houses the
round's surfaces do not yet read (the hunters' and the landings' marks read the siege's and the fisheries' own rules,
`GATES_WORK_HELD_BY_RECORD`, not this seat's file). I kept the cure to the six kinds the brief named; the row is one line
each in `IMPLIED_GROUND` for the owner's word.

### 2 · The one reading

`src/domain/facts/supplyStory.js` (import-free of every lazily pinned module: EG1; `tests/architecture` green):
`storySeed` (THE ONE READING OF THE SEED for the birth and the print, BR7 condition 1: an absent seed reads as the empty
string, which reads every implied ground there, every material bought where the town can trade, and no venture);
`seedPicks` (the kernel's own `fnv1a32` of `<seed>::<key>` mod 60: no draw); `impliedGroundsOf` (a), `boughtIn` (b),
`sourceStoryOf` (c), `ventureOf` (d), `impliedGroundsShown`, `ventureMarkText`, `ventureLineText`. Two readings decided in
the leaf and told here: a source house's OWN CHAINS (on its own grounds, on the record) speak first (a mine whose every chain
works its spent coal seam is worked out though iron lies near: without this 19 mines printed bare, LAW 8's
8b.extract); a chain of another ground hides none (the audit's c1). And the economy's own hour reads no implied ground
(`houseInputAtHand.js :: sawnGoodFed`): without it the sawmill gate made "Milled lumber" of a burner's woodland in 6 towns
(BR4 (b): "it is never written early").

**(e) "NEVER HAD IT AND BUYS NOTHING" OUTSIDE THE VENTURE, COUNTED, LEFT BY NAME**: **67 houses in the 720, every one on a
town with no route even in ordinary times** (potter 9, weavers 8, cobbler's guild 7, smith 6, fuller 6, glassmakers 6,
tanner 6, vintner 5, brickmaker 4, carpenters 4, cooper, glassblower, woodcarver, cobbler, tannery: r2r-village-34,
r2r-city-48, r2r-metropolis-9), plus 4 smiths in two occupied towns whose iron the occupation takes (r2s-occupied-town-3,
-city-1). They are buyers, not source houses: no house of theirs proves a ground, so the owner's fourth story would need a
ground invented for them; they print today as BIRTH-1 left them ("No clay reaches the potter." and the need line), true of a
town no road reaches. **The salt works off the coast on no road: 0 of the 720.**

### 3 · The reader, and the marks it moves (`marks.mjs`; houses the one fact marks short)

| | the 720, all | the 720, calm and connected | the 150, all | the 150, calm and connected |
|---|---|---|---|---|
| marks before → after | 451 → 336 | 96 → 71 | 142 → 54 | 29 → 16 |
| newly unmarked | 205 | 55 | 95 | 17 |
| newly marked | 90 | 30 | 7 | 4 |

NEWLY UNMARKED (the largest): "Charcoal burner: Short of timber." 58 (its woodland there, or the timber bought), "Fish market:
Short of fish." 29 (a buyer, fed by its fisheries' shortage import), "Dairy farmer: Short of livestock." 26, "Salt works:
Short of salt." 25 ("Salt" bought), and under a siege the buyers BIRTH-1 left with no cause (potters, vintners, glassmakers,
weavers 6-7 each). NEWLY MARKED, AND WHAT THE MARK SAYS: "Stone quarry: Short of stone." 12 and "Mine: Short of iron ore." 6
(the ground they prove, used up by the seed: worked out), "Mine: Short of coal./its materials." 9 (its own spent seam's chain,
above), the failed ventures ("Failing: a failed venture." / "Abandoned: a failed venture."), and buyers the seed left idle
on a spent ground whose rows carry no input mark (furrier's district 7, merchant guilds 6, beast trainers 4, dyer 4, tailor 3:
the round BAR7's surfaces).

THE FISH MARKET'S OTHER READERS OF THE DEPENDENCE TABLE (`SPENT_GROUND_WORKERS`, not edited): `houseInputAtHand.js` and
`resourceGenerator.js` now read it through `worksTheGround` (TAKERS beside it); no other file under `src/` reads it.

BIRTH-1's ratchet (`birthKindsLaw.test.js`'s counted exceptions: dairy 14 + 5, burner 14 + 4, salt works 8 + 1, fish market
18 + 1): **all 65 cured, struck by the test's own rule; the ratchet stands at 0.** THE 8a.mild CONTROL (item 3's "one control
to give back its own cause"): **LEFT by name**: `find8.mjs` finds NO house the seed left idle in the 720's calm towns whose
card head prints a milder state (0); the control stays on BIRTH-1's outbreak case (r2r-city-19), green.

### 4 · The birth

`importsBroughtAtBirth(record, seed)` writes a material's word exactly where its story says bought and the list lacks it:
(1) a buyer on its own spent ground, that ground's shortage word where the seed's pick has the town buy it; a refused word
leaves the whole material unbought (one answer a material); (1b) a source house that runs on bought-in material, its story's
word ("Salt", or its ground's shortage word); (2) a buyer none of whose inputs the reader answers: its ground used up, the
pick; never there, the plain word; the failed venture, nothing. **Under a siege too** (only a town with no route writes
nothing). No word twice (BIRTH-1's arm (c), green). The gap of each house is written by the same reader with the same seed.

### 5 · The gap lines

The gap line keeps its words ("No <good> reaches <the house>.": two readers parse it). A source house idle on the ground it
proves prints BIRTH-1's worked-out line by the Depleted list's label ("The stone quarry is worked out: its own ground is
depleted (Stone quarry)."). THE TWO NEW LINES (the owner's veto list, below) print once for the house, after its gap line or
alone where no chain asks it of an input (a mine, a peat cutter).

### 6 · The page

The Nearby Resources section prints a proven ground that is there without "Abundant", unlabelled under the section's own
title (`data-testid="resources-grounds-proven"`), and a proven ground used up in the "Depleted" group. **171 towns of the
720 and 31 of the 150** gain a ground there (r2r-hamlet-3, r2r-hamlet-8, r2r-hamlet-9).

### 7 · The other readers of the land list, NAMED (not routed: none is my file)

Page-side readers of `config.nearbyResources` / `nearbyResourcesDepleted`: `facts/registeredWords.js`,
`facts/leadingSourceSpent.js`, `facts/chainCarrier.js`, `display/tracePresentation.js`, `display/tradeListDisplay.js`,
`pdf/sections/Overview.jsx`, `pdf/lib/viewModel.js`, `pdf/lib/viewModelBodySlices.js` (THE PDF'S LAND LIST: it prints the
stored list only, so the PDF lacks the proven ground the tab prints, in 171 towns), `components/new/dailyLifeLogic.js`, and
the world pulse (`worldPulse/resourceDynamicsKernel.js`, `tierResourceDynamics.js`, `institutionLifecycleResourceRead.js`,
`settlementLifecycleKernel.js`, `settlementLifecycleFirstClass.js`, `applyWorldPulse.js`, `lineageMemberBirth.js`). The six
ground keys page-side: `stone_quarry` 7 lines in 4 files, `iron_deposits` 6 in 3, `grazing_land` 13 in 8, `managed_forest` 5
in 3, `marshlands` 6 in 4, `salt_flats` 2 in 2. A line declared on the ABSENCE of such a ground would not see the proven
ground in those 171 towns: NOT COUNTED line by line (my count ran out before it; the exposure is the 171 towns). Routed
through my leaf: my own files only (the reader, the birth's need list, the gap lines, the tab).
THE WORLD PULSE, IN THREE LINES: a simulated year reads the stored list only; a proven ground is never depleted or refilled
by it (it is not there to read), so a quarry on a proven ground stays as the seed told it; a year that adds or depletes a
stored ground of the house's own kind makes the record speak, and the house is then read by that stored ground instead.

### 8 · The card, LEFT BY NAME

The Resource Exploitation section prints no card for a proven ground (W3: up to 114 towns). The stage reader works from
`resourceAnalysis.exploitation` written at the economy's hour; printing a card from the house would be a second reading of
the chain, not one: left for the owner's word (W3's "the house's own stage only, never `exportValue`").

### 9 · The held input items, LEFT

Re-measured: LAW 8's 8a.input at my base and my tip reads exactly the three houses of `LEFT` (r2r-town-54's and
r2r-metropolis-19's butchers, r2s-religious_conversion-town-2's apothecary); none cured, `LEFT` unchanged. The grain-surplus
house (8i.surplus): not reached.

### 10 · The guard, `tests/domain/supplyStoryLaw.test.js`

Over the census's 720 and the 150 (every population the brief counts over: every tier, crisis and route): L1-L3 (every
source house's story on every surface; the venture's mark, line and empty imports; no gap line beside its own good's
import; no taker fed), L5 (the there-share in 0.63-0.87: four standard errors of 0.75 over ~200 grounds; the bought share
above 0.6, open upward because a material the economy already brings counts as bought; ventures 10-20 of the 720), BR7
(condition 2: the gap the birth wrote is the story the print reads, house by house, and the birth over its own product
brings no word), L4 (the same seed twice; a frozen config), W1 (the round trip, ten towns, below). Its negatives are found
lists with positive anchors; its seed loops collect every failure. At the base it cannot load (the leaf is born here) and
its pair arm reads 49 towns (BIRTH-1's burner pair). Green at the tip (5 tests, 93 s).

**THE ROUND TRIP (W1)**: ten census towns with a proven ground, generated again from `record.config` with `record._seed` (the
product's regenerate) and from that config read as a manual roster (`nearbyResourcesRandom: false`): **10 of 10 the same
people, ties, roster and story in both forms** (the guard's W1 arm). Nothing is stored, so nothing acts early.

### 12 · The page after me, read: IN PART

Not rendered (my count): the twenty-eight towns were not read through the renderer. Read instead by the record's own
readers over every town (the law above): no house at work beside its own good's import, no idle house unmarked (where its
rows take a mark), no export of a worked-out ground's good added by me (exports do not move: `fieldDiff`). LEFT for the
seventh read: the Outlook and the arrival scene beside an idle house (BAR7's surfaces; `arrivalScene` moves in 7 towns).

## The new lines a reader can see (each with three towns; the 720)

| line | towns | three |
|---|---|---|
| Resources: a proven ground, unlabelled (e.g. "Managed Woodland", "Stone quarry") | 171 | r2r-hamlet-3, r2r-hamlet-8, r2r-hamlet-9 |
| Resources: "The <house> is worked out: its own ground is depleted (<ground>)." (a proven ground used up) | 66 in all (49 before) | r2r-hamlet-23, r2r-hamlet-56, r2r-village-47 |
| Resources: "The <house> is failing: no <material> lies near and none is brought in." | 11 | r2r-hamlet-26, r2r-hamlet-27, r2r-hamlet-48 |
| Resources: "The <house> stands abandoned, a venture of an earlier time: no <material> lies near and none is brought in." | 4 | r2r-town-18, r2s-under_siege-city-1, r2s-slave_revolt-town-0 |
| mark: "Failing: a failed venture." / "Abandoned: a failed venture." | 11 / 4 (where the house's rows take an input mark) | r2r-hamlet-57, r2r-town-13, r2r-town-18 |

LINES GONE: "No timber reaches the charcoal burner." beside "Timber" (49 towns), "Salt works: Short of salt." (25), "The salt
works is worked out: its own ground is depleted (Fishing grounds)." (r2s-wartime-city-1).

## The re-keys (by identity, dated notes in each file)

- `tests/domain/birthKindsLaw.test.js`: arm 1, the law reads a house THE SEED LEFT IDLE and the failed venture as true marks;
  its 65 counted exceptions struck (all cured); its Fuller control r2r-village-14 → r2r-town-28 (the first fuller marked only
  read blind); arm 2, under a siege the site brings the town's ordinary-times words (BR3 (c)); a besieged town's site writes
  no word its record lacks; on no road still none.
- `tests/generators/bar4ScenePresumption.test.js` REACHABLE (MU1): its refusing town is composed in the owner's fourth story
  (the birth's buyer words struck); the arm is green at my tip (8 of 8 tests), the cloth twin proved again.
- `tests/domain/bar6SeamEcon.test.js` item 8: no town of 1,470 census-shaped births at my tip (the 720, the 150, 600 more
  r2r- towns, cities, metropolises) bears "a River Mill card listing Fulled cloth beside a Fuller short of wool"; the claim
  stands on the same town, r2r-metropolis-69, composed in the owner's fourth story (its "Wool" struck, the Fuller's stored gap
  `missing`): NOT house for house, named.
- `tests/domain/bar6MarksLaw8.test.js`: untouched (green; LEFT unchanged; the 8a.mild control left, above).

## The net (R11 and the brief's), each alone, to a file through `sh scripts/gate-tail.sh`

Run at the base FIRST (R11), then at the final tip (b5195bf02 and the hand-back commit after it, which changes no code).

| gate | base a55162cfa | tip |
|---|---|---|
| `npm run typecheck:domain:strict` | exit 0 · 1113, ceiling 1113 | exit 0 · 1113, ceiling 1113 |
| `npm run typecheck:ratchet` | exit 0 · 167, ceiling 167 | exit 0 · 167, ceiling 167 |
| `npx eslint` on my changed sources and tests | — | exit 0 |
| `npx vitest run tests/architecture` | exit 0 · 347 | exit 0 · 347 (it was RED at a cut of mine: `factHomesLazy` (a): my leaf, routed eager with its folder, read the lazy `crisisDependence.js` and `institutionServices.js`: cured by the copy `GROUND_YIELD`, EG1) |
| ONE `npm run build`, then `vendorPdfLazy` + `bootSmoke` | — | built in 50 s · 49 passed, 17 skipped (it was RED at the same cut: the goods roster found the leaf reading the member `resourceSemantics.js`; cured, the leaf reads no goods member) |
| my guard `tests/domain/supplyStoryLaw.test.js` | cannot load | exit 0 · 6 tests |
| `birthKindsLaw`, `bar6MarksLaw8`, `bar4ScenePresumption` | (red at the base as the brief says: MU1's cloth twin) | exit 0 · 3, 4, 8 tests |
| the classes door (R9) | `hits 1795 · banked 1938 · fresh 0 · stale 143` | the same line (no fresh row) |
| the things door (R9) | `fresh 39 · stale 72 · first-register stale 6 · banked 4688` | the same line (a cut of mine read 43: four shortage words I had copied into the leaf as strings; cured, the callers hand the word in) |
| `npx vitest run tests/lint` WHOLE (the walkers) | 27 files · 64 tests red | **27 files · 64 tests red, THE SAME 64 BY NAME: none new.** Under unchanged names, stored figures moved: the estate's file count 3668 → 3669 (my new test file), two counts fell (1440 → 1428, 1749 → 1748), the dark identities 30 → 18, and one stored hash (the close's, R10) |
| the earlier rounds' guards (`bar5*`, `bar6*`, domain and generators) | 21 files · 170 passed | 1 red (`bar6SeamEcon` item 8: its anchor r2r-metropolis-69's fuller is fed under the siege now): RE-KEYED by identity (below), then 6 of 6 green |

## RED AT MY TIP AND NOT AT MY BASE: LEFT BY NAME (my count reached its hand-back line before I could read them)

The sweep BIRTH-1 ran (every test file that names a reader or a file I changed: 76 files, `sweep.list`) at the base and the
tip: base 11 files · 15 tests red; tip 17 files · 26 tests red. **The ones red at the tip only, NOT CURED, NOT YET READ
(the reason given is my reading of the test's name, unverified):**

| file · test | likely cause |
|---|---|
| `tests/build/generationWorkerLazy.test.js` · the worker bundle under `WORKER_BUNDLE_CEILING_BYTES` | a stored figure (R10): the new leaf adds bytes to the worker; the close's |
| `tests/generators/bar4RecordHouseInput.test.js` · KEEP: a commercial sawmill with no timber (two arms) and its rung control | an anchor's sawmill now has timber of a proven woodland (r2r-city-115?): a re-key by identity |
| `tests/generators/gapSaysWhichKind.test.js` · missing: the TRUE gaps stay written | the same: a soak anchor (soak1k-9, -302) now fed by a proven ground or the siege's birth |
| `tests/generators/houseInputReaches.test.js` · (M-V) KEEP: isolated or besieged, the input does not reach | under a siege the birth now brings the ordinary-times word (BR3 (c)): the claim is untrue for the besieged half; a re-key |
| `tests/components/crisisStoppedRows.test.jsx` · S5, the births table | its anchors (r2r-town-54, r2r-city-49, BIRTH-1's re-keys) or a row the story now feeds |
| `tests/domain/bar4MarkPromise.test.js` · (a) THE ZERO over the 720; (d) the mark follows the gap line | (a) a new instance the detector finds (an idle buyer whose rows take no input mark: item 3's furrier, merchant guilds, dyer, tailor?); (d) its anchor r2r-town-54 |
| `tests/components/publicProseEquality.test.jsx` · services, soak1k-1 and soak1k-10 | a services line that differs between the owner's view and the shared page in two soak towns: NOT understood |
| `tests/pdf/tailExportsPdf3Batch3.test.jsx` · each NOT row | NOT understood (the PDF is no file of mine) |

THE ONE GONE (red at the base, green at the tip): `bar4ScenePresumption` REACHABLE (MU1), the brief's own red.
`tests/lint` (the walkers) and the earlier rounds' guards hold no new red (above). The whole suite was not run.

## For the owner's veto list (in plain words)

1. THE ODDS, one small table (`houseKinds.js :: SUPPLY_ODDS`): a source house where the land list names no ground of its
   kind: the ground is there **3 times in 4**; a ground used up where the town can trade: its material bought in **3 times in
   4**; a house that could be a failed venture is one **1 time in 20** (about one town in fifty shows one: 15 of the 720).
2. THE TAKERS (cannot buy in what they take): stone quarry, mine, open-cast mine, peat cutter, woodcutter's camp, shepherd,
   fisher's landing, fishing community, hunter's lodge, wildfowler. THE THREE THAT RUN ON BOUGHT-IN MATERIAL: salt works
   ("Salt"), charcoal burner ("Timber"), dairy farmer ("Livestock").
3. THE GROUND A HOUSE PROVES: a stone quarry its stone; a mine its iron; a peat cutter its bog; a dairy its pasture; a burner
   its woodland; a salt works off the coast none (it buys its salt).
4. THE ONLY NEW WORDS: the marks "Abandoned: a failed venture." and "Failing: a failed venture."; the lines "The <house>
   stands abandoned, a venture of an earlier time: no <material> lies near and none is brought in." and "The <house> is
   failing: no <material> lies near and none is brought in.". A proven ground prints without the word "Abundant"
   (one quarry does not prove plenty).
5. THE FAILED VENTURE IS NEVER: two in a town; a house whose material another house of the town works; a house whose material
   any import names; a buyer of grain, livestock, fish, grapes, glass sand or luxury goods (their reader answers them by the
   food record, the road or the trade).

## The books my cure moves (the close's)

The 525 reference configurations (gaps 32, imports 15 and fewer of the need list and notes); the census's stored marks (451
→ 336) and the PAGE-COPY renders; BIRTH-1's figures (its siege count 59 → 1, its burner pair 49 → 0, its exceptions 65 → 0).

## What is left, and for whom

THE ELEVEN RED FILES ABOVE (first: they are mine to cure or explain, by the brief). The second ring (item 1); "never had it" on no road (item 2 (e), 67 houses); the readers of item 7 (the PDF's land list
first); the card (item 8); the held input items (item 9); the twenty-eight towns' reading (item 12); the 8a.mild control's
idle house (none exists); the rows of idle buyers that take no input mark (furrier, merchant guilds, dyer, tailor: BAR7).
