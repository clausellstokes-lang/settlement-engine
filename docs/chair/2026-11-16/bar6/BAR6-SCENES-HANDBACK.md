# BAR6-SCENES · HAND-BACK · a scene shows no good, no ease and no traffic the town cannot give

Seat BAR6-SCENES of BRIEF-BAR6 (`lane/chair-2026-11-08 :: docs/chair/2026-11-14/briefs/BRIEF-BAR6.md`). Branch
`lane/bar6-scenes-2026-11-16`, cut from the joined line at **afa46d644**; nothing merged. Work in scratch worktrees only.
Rulings worked to: the brief's B1 to B8, DD1, and the chair's TW1 and EG1 of 2026-11-16.

## THE RULES

Counts are the auditors' own runners (`runC.mjs`, `runE.mjs`, `runF.mjs`, from the base tree, unchanged) over PAGE-COPY
renders at afa46d644 and at the tip, **my rules and my writers only** (towns = instances in every row: one instance a town).

| rule | the two readings, and where | the one fact made | 150 before → after | 720 before → after | fresh 300 before → after | cured by the fact / line by line | named exclusions | guard, positive control |
|---|---|---|---|---|---|---|---|---|
| 6b nomaker / denied (a good shown) | the arrival sense pool is opened by a loose match on a house's name (`narrative/arrivalScene.js :: chooseSense`) / the page's own lists: the maker houses, Produced locally, the Exports, the short marks, the Resources gap | `trade at work: <good>` widened (`tradeAtWork.js :: GOOD_TRADES`: dairy, cloth, ironwork, herbs, spice, cut stone, woodwork), read from the roster (a maker not short: `housesShortOf`), Produced locally, the Exports, an import past no siege | 8 → **0** | 23 → **0** (1) | 21 → **0** (3) | the fact, declared on each sense line that shows the good; a twin keeps every slot | none | `tests/domain/bar6ScenesGoods.test.js`; C219863, C84094, C15780 |
| 6b out (goods on the road out) | the dominant pool is opened by the exports OR the income shares / the Exports | `exported: <good>` (`goodExported.js`, beneath `exports`) | 2 → **0** | 12 → **0** | 4 → **0** | the fact on the four "road out" lines; the cloth and the crates twins reworded; the kiln crates send nothing out | none | as above; C39804, C115374 |
| 7c (arrival) plenty under want | the spice stalls "piled" / the famine and the siege | the spice line declares `crisis: hunger` and `crisis: under_siege` (and the spice fact) | 1 → **0** | 1 → **0** | 2 → **0** | line | none | as above; C15780 |
| 7d traffic | the porters and the singing work party / the route, the siege | declarations on the two lines (`route: isolated`, `crisis: under_siege`), each with a twin | 2 → **0** | 1 → **0** (1) | 1 → **0** | line by line | none | as above; C150831, C94460 |
| 9e.quietly | "Nobody … sells enchanting … done quietly" / the page's enchanting chain and its Integral reliance | none needed: the twin reworded to claim neither ("No sign in X offers enchanting by the hour; what magic is worked here is the work of its own houses, not a trade on the street.") | 1 → **0** | 2 → **0** | 0 → **0** | line | none | as above; C32780 |
| 9f.loyal | `narrativeText.js :: PRESSURE_SENTENCES.wartime` (losing) / `powerStructure.publicLegitimacy` | `legitimacy crisis` (`legitimacyCrisis.js`, beneath `ruler`) | 1 → **0** | 4 → **0** | 2 → **0** | the fact; the row resolves draw-free to the next row (the pool's own resolution) | none | as above; C76517 |
| 10h (the Overview's pressure line) | `narrativeText.js` interpolates `r.topFaction` / `r.govFaction` raw / `powerSentenceName` | none new: every pressure row reads the powers through `powerSentenceName` (one wrapper on the export) | 0 → **0** | 1 → **0** | 0 → **0** | the leaf, once for every row | none | as above; F's r2s-politically_fractured-metropolis-0 |

(6b's "before" splits: 150 denied 2 · nomaker 6 · out 2; 720 denied 2 · nomaker 21 · out 12; 300 denied 1 · nomaker 20 · out 4.
6b-w, WEAK and apart: 0 / 6 / 2 before → 0 / 3 / 2 (the cloth carts where the Exports carry the wool alone).)

HOW THE AFTER IS MEASURED: the 150 rendered whole at the final tip **243310395**; the 720 and the fresh 300 rendered whole at
ee364db07, where (n) residues stood (720: one spice stall, one porters' twin; 300: two spice lines, one herbs twin), each
cured at 243310395 and its town reborn there (all now print a true line), and the guard reads 0 over the 720 at 243310395.

THE GUARD: `tests/domain/bar6ScenesGoods.test.js` reads the arrival scene and the pressure sentence of the census's 720 births
by the AUDITOR'S OWN RULES (`law6.mjs :: GOODS`, its out-scene and negation words; 9e, 9f, 7d, 10h by their records), never
by the facts the cure made. **Red at afa46d644 in 42 of the 720** (6b-nomaker 38, 6b-out 21, 9f 4, 9e 2, 7d 1, 10h 1:
shown by a copy of the file run at the base and removed), **0 at the tip**. Positive control: a record made from the wide
read's own rows (C219863, C39804, C84094, C15780, C32780, C94460, C150831, C76517, F's 10h line) fires every rule. TW1's
case: a double where every smith is short: the forge line refused, its twin admitted. And the facts pinned
(the grazing name opens no dairy; a tailor makes no cloth; a mine cuts no stone; an import of spice counts past no siege).

## B3 · THE CONTROLS (REGRESS over the 150, `--verdict STANDS --list`)

`regress.py r-base-150 r-fin-150 <my nine STANDS rows of SECOND-CHECK.final221.json> --verdict STANDS --list` (base afa46d644, tip 243310395):

```
rows 8 · SAME 0 · CHANGED 0 · GONE 8 · (not on the base as quoted 1; town not rendered 0)
  GONE C150831 bar0-thorp-calm-rand-27 | Porters bent under loaded frames file past, and someone counts them in.
  GONE C15780 bar0-city-under_siege+famine-rand-33 | Spice and drying herbs scent every lane, and the stalls are piled with them.
  GONE C219863 bar0-village-famine-rand-40 | Someone is churning butter in a doorway, and the rhythm of it carries.
  GONE C32780 bar0-city-under_siege+famine-rand-39 | Nobody in Kallipolis sells enchanting by the hour, and what magic is done here is done quietly.
  GONE C39804 bar0-city-wartime-rand-27 | Bolts of cloth and bales of wool fill the carts waiting on the road out.
  GONE C76517 bar0-city-wartime-rand-40 | The settlement is loyal.
  GONE C84094 bar0-hamlet-calm-rand-32 | The chink of chisels on stone carries on the wind.
  GONE C94460 bar0-hamlet-under_siege-rand-36 | A work party heads out together, singing, with tools on their shoulders.
  NOBASE C115374 bar0-metropolis-calm-rand-32 | Crates of pots and glassware, packed in straw, wait for the carts on the road out.
```
C115374's sentence was already reworded at the base (BAR5-THINGS's kilns); its town's crates line is reworded again here.

## B4 · LAW 5 WIDENED, my files (auditor G's inventory, `law5w-inventory-g.mjs`, over each tree)

`src/data/arrivalProse.js`, `src/generators/narrativeText.js`, `src/domain/facts/tradeAtWork.js` (and the two new leaves):
**21 lines in the stock at afa46d644 → 0 at the tip**: 7 leave by a declaration that answers their class or a reword
(the spice stalls' plenty; the singing work party's ease; the old judge's office, reworded "An elder"; four pressure rows'
size words, `tier: ≥ village` or `tier: ≥ town`), 14 by a reviewed reason in my own table
`docs/chair/2026-11-16/bar6/AUDIT/tables/G.exclusions.BAR6-SCENES.json` (word senses: "judge it out loud", household
stores, a household pot, a cartload the route answers, a negated tax collector; memories of years past; the betrayal's own
fact; the migration's own movement; the walls branch measured by its file; the crisis-scoped `stable` pool). No new line
of mine enters the stock.

## B5 · THE DECLARED MOVES

- `arrivalScene` (stored): **55 of the 525 reference configurations move, all in that one field** (each born at
  afa46d644 and at the tip, hashed whole and by field: `bar5/THINGS/ref525.mjs`; re-taken at the final tip 243310395). `pressureSentence` moves in no reference
  configuration (the grid is calm); it moves in the wartime towns under a legitimacy crisis (4 of the 720) and wherever a
  pressure row named a power with a prose form, or a thorp or hamlet drew a street row.

## B7 · NO POOL THINNER (DD1)

Every town of the 150, the 720 and the fresh 300 (born at the base), each arrival pool it can reach, the lines it admits (an
original, or its twin where it is refused), at the base and at the tip (`depth.mjs`): **no pool falls newly under three in
any town**; brewers, cloth, kilns (dominant), the Norse people and the tanners are deeper than at the base. The inverse
default (`ARRIVAL_CRISIS_SCOPED`) is NOT turned on for any pool: the base already leaves the kilns' dominant pool under
three in 208 towns (BAR5-THINGS's unanswered kiln kinds), so no pool meets DD1's condition for it.

## THE VETO LIST (every new or changed line; three towns it prints in at the tip)

Each line as it reads at the tip; the towns are where it prints among the 1,170 (the 150 at 243310395, the 720 and the fresh 300
at ee364db07). A twin printed in none is reached only where its original is refused; my guard and `depth.mjs` prove it
admitted there. The pressure rows keep their words (they gain declarations only), except that a power is named by its prose
form.

- "The ring of hammer on anvil carries over the roofs of {name}.": 1 towns (e.g. r2s-occupied-village-1)
- "The anvil at {name} is quiet more days than it rings, for want of iron.": 0 towns (none of the 1,170 draws it; reached where its original is refused)
- "You hear the forge work before you see it: hammer on iron, steady as a heartbeat.": 0 towns (none of the 1,170 draws it; reached where its original is refused)
- "The forge is banked low, and no hammer sounds from it today.": 0 towns (none of the 1,170 draws it; reached where its original is refused)
- "A drift of forge smoke hangs over the roofs, and somewhere under it a hammer keeps time.": 0 towns (none of the 1,170 draws it; reached where its original is refused)
- "Only a thin thread of smoke rises from the forge, and no hammer keeps time under it.": 0 towns (none of the 1,170 draws it; reached where its original is refused)
- "A smith quenches a blade in a hiss of steam, and the sound follows you down the lane.": 2 towns (e.g. r2r-village-40, r2s-insurgency-village-0)
- "A smith sits in the forge doorway with no iron on the anvil.": 0 towns (none of the 1,170 draws it; reached where its original is refused)
- "Every forge you pass is making something meant for a war, and the carts on the road out are full of it.": 2 towns (e.g. bar0-city-wartime-rand-104, bar0-city-wartime-rand-108)
- "Every forge you pass is making something meant for a war, and the army takes all of it.": 0 towns (none of the 1,170 draws it; reached where its original is refused)
- "Sacks of flour are stacked shoulder high by the roadside, waiting to be carted out.": 9 towns (e.g. bar0-metropolis-calm-rand-28, r2r-village-1, r2r-village-9)
- "Sacks of flour are stacked against a wall, all of it for the ovens here.": 0 towns (none of the 1,170 draws it; reached where its original is refused)
- "Bales of hides and bundled pelts crowd the carts on the road out.": 2 towns (e.g. bar0-town-calm-rand-119, bar0-town-calm-rand-33)
- "Bales of hides and bundled pelts are stacked high in the tanning yard.": 0 towns (none of the 1,170 draws it; reached where its original is refused)
- "Barrels are stacked by every doorway, and the carts on the road out are loaded with more.": 2 towns (e.g. bar0-village-calm-rand-39, r2r-village-32)
- "Barrels are stacked by every doorway, and all of it is for the cups here.": 0 towns (none of the 1,170 draws it; reached where its original is refused)
- "A loom clatters behind an open shutter.": 0 towns (none of the 1,170 draws it; reached where its original is refused)
- "Someone sits stitching a seam behind an open shutter.": 0 towns (none of the 1,170 draws it; reached where its original is refused)
- "Lengths of dyed cloth hang drying in bright strips between the houses.": 0 towns (none of the 1,170 draws it; reached where its original is refused)
- "A length of cloth hangs in a shop doorway, brought in from elsewhere to be cut and sewn.": 0 towns (none of the 1,170 draws it; reached where its original is refused)
- "The thump of the fulling stocks carries from the cloth yard.": 0 towns (none of the 1,170 draws it; reached where its original is refused)
- "Bolts of cloth are measured out on a shop counter, a length at a time.": 0 towns (none of the 1,170 draws it; reached where its original is refused)
- "A dyer walks past with hands stained to the wrist.": 0 towns (none of the 1,170 draws it; reached where its original is refused)
- "Someone walks past with a measuring cord round their neck and a bolt of cloth under one arm.": 0 towns (none of the 1,170 draws it; reached where its original is refused)
- "The clatter of looms follows you through {name}, from one shutter to the next.": 33 towns (e.g. bar0-city-wartime-rand-111, bar0-city-wartime-rand-38, bar0-metropolis-calm-rand-109)
- "Here and there someone works cloth behind a shutter in {name}, though little of it goes out these days.": 4 towns (e.g. bar0-city-under_siege+famine-rand-116, bar0-city-under_siege+famine-rand-123, bar0-town-calm-rand-128)
- "Bolts of cloth and bales of wool fill the carts waiting on the road out.": 7 towns (e.g. bar0-metropolis-calm-rand-125, bar0-town-calm-rand-130, r2r-city-32)
- "Bolts of cloth and bales of wool are stacked in the shops, and none of it is going anywhere.": 29 towns (e.g. bar0-city-under_siege+famine-rand-108, bar0-city-under_siege+famine-rand-110, bar0-city-under_siege+famine-rand-115)
- "Bolts of cloth hang drying in long bright strips across the yards.": 31 towns (e.g. bar0-city-under_siege+famine-rand-104, bar0-city-under_siege+famine-rand-129, bar0-city-under_siege+famine-rand-35)
- "Bolts of cloth brought in from elsewhere are stacked in the shops, waiting to be cut.": 1 towns (e.g. r2s-recently_betrayed-metropolis-3)
- "Someone is churning butter in a doorway, and the rhythm of it carries.": 13 towns (e.g. bar0-thorp-calm-rand-112, bar0-thorp-calm-rand-117, bar0-thorp-calm-rand-40)
- "Someone is mending a hurdle in a doorway, and the knock of the mallet carries.": 26 towns (e.g. bar0-hamlet-calm-rand-107, bar0-hamlet-calm-rand-31, bar0-hamlet-calm-rand-40)
- "The chink of chisels on stone carries on the wind.": 0 towns (none of the 1,170 draws it; reached where its original is refused)
- "The rasp of a saw and the smell of fresh-cut wood come from a workshop yard.": 5 towns (e.g. r2r-thorp-42, bar0-city-under_siege+famine-rand-37, bar0-village-calm-rand-115)
- "A saw hangs on its nail in a workshop yard, with no wood on the trestles.": 0 towns (none of the 1,170 draws it; reached where its original is refused)
- "Sawn planks stand stacked to season against a wall.": 8 towns (e.g. r2r-thorp-0, r2r-thorp-33, r2r-thorp-45)
- "A few old planks lean against a wall, grey with weather.": 1 towns (e.g. bar0-town-occupied-rand-128)
- "Curls of shavings and chips of bark blow across the lane.": 5 towns (e.g. r2r-thorp-41, bar0-hamlet-calm-rand-105, bar0-town-calm-rand-36)
- "Old shavings lie trodden into the lane, and no new ones blow across it.": 0 towns (none of the 1,170 draws it; reached where its original is refused)
- "The knock of a mallet on wood keeps time somewhere close.": 3 towns (e.g. r2r-thorp-35, r2s-religious_conversion-thorp-3, r2s-insurgency-hamlet-3)
- "A workshop door stands open on an idle bench, and no mallet sounds from it.": 0 towns (none of the 1,170 draws it; reached where its original is refused)
- "Crates of pots, packed in straw, stand stacked in the kiln yard.": 2 towns (e.g. bar0-city-wartime-rand-118, bar0-metropolis-calm-rand-126)
- "The yard where crates of pots once waited for the carts stands nearly empty.": 0 towns (none of the 1,170 draws it; reached where its original is refused)
- "Spice and drying herbs scent every lane, and the stalls are piled with them.": 7 towns (e.g. bar0-metropolis-calm-rand-124, bar0-town-calm-rand-117, r2r-metropolis-21)
- "A few bundles of drying herbs hang by the stalls, and there is little else to scent the lanes.": 9 towns (e.g. bar0-city-under_siege+famine-rand-109, bar0-city-under_siege+famine-rand-126, bar0-city-under_siege+famine-rand-33)
- "Sacks of herbs and spices stand open in the doorways, and the smell of them clings to your clothes.": 5 towns (e.g. bar0-town-occupied-rand-114, r2r-city-4, r2r-town-14)
- "A doorway here and there sells remedies, and the bitter smell of them reaches the lane.": 2 towns (e.g. bar0-city-under_siege+famine-rand-29, bar0-town-occupied-rand-39)
- "No sign in {name} offers enchanting by the hour; what magic is worked here is the work of its own houses, not a trade on the street.": 7 towns (e.g. bar0-city-under_siege+famine-rand-39, bar0-metropolis-calm-rand-117, bar0-town-calm-rand-31)
- "An elder listens to two neighbours by a gate and says nothing until both are finished.": 24 towns (e.g. r2r-thorp-36, r2r-thorp-49, bar0-city-wartime-rand-36)
- "Racks of drying fish and smoked meat stand beside the houses, laid in against the winter.": 4 towns (e.g. bar0-city-wartime-rand-102, bar0-town-occupied-rand-105, bar0-town-occupied-rand-41)
- "Empty drying racks stand beside the houses, waiting for whatever can be laid in against the winter.": 21 towns (e.g. bar0-thorp-calm-rand-122, bar0-thorp-calm-rand-35, r2r-thorp-20)
- "A work party heads out together, singing, with tools on their shoulders.": 31 towns (e.g. r2r-thorp-34, r2r-thorp-40, r2r-thorp-51)
- "A work party gathers inside the defences with tools on their shoulders, to shore up whatever needs it.": 2 towns (e.g. bar0-city-under_siege+famine-rand-107, bar0-hamlet-under_siege-rand-36)
- "Porters bent under loaded frames file past, and someone counts them in.": 27 towns (e.g. bar0-thorp-calm-rand-109, r2r-thorp-22, r2r-thorp-25)
- "A neighbour comes in from the fields with a basket on one hip, and someone asks how the day went.": 1 towns (e.g. bar0-thorp-calm-rand-27)


## NEW VOCABULARY (B6; each vetoable by the owner)

- `trade at work:` keys `dairy`, `cloth`, `ironwork`, `herbs`, `spice`, `cut stone`, `woodwork`, beside the trades
  (`factVocabulary.js`; reader `tradeAtWork.js :: GOOD_TRADES`).
- `exported: <good>` (cloth, flour, hides, ale, arms), beneath `exports` (`goodExported.js`).
- `legitimacy crisis`, beneath `ruler` (`legitimacyCrisis.js`).

## THE BOOKS MY CURES MOVE (named, not re-taken)

| test | arm | old → new | door |
|---|---|---|---|
| `tests/property/generatorGoldenMaster.test.js` and the golden-derived files | the reference digests | 55 of 525 configurations, `arrivalScene` | the owner's golden regen (`UPDATE_GOLDEN`) |
| `tests/domain/facts/textOf.test.js` | declared arrival rows | 189 → 224 | re-keyed by identity in the file (this batch's own count) |
| `tests/domain/facts/census2dTables.test.js` | declaring pressure rows | 23 → 28 | re-keyed by identity (this batch's own count) |
| `docs/census/declarations/PRESSURE_SENTENCES.json` | five rows' declarations; wartime(losing)[0]'s stale text | made to match the source | the census ledger (the walker reads it in place) |
| `tests/data/tailHistoryBatch4.test.js`, `tailHistoryBatch6.test.js`, `tests/generators/bar2PlacesRows.test.js`, `bar4ScenePresumption.test.js`, `migrationDirection.test.js`, `tests/domain/facts/census2fColour.test.js` | anchors naming a reworded twin, the vocabulary's keys, a declared row's text | re-keyed by identity with dated notes | in the files |

RED AT afa46d644 AND AT MY TIP, THE SAME ARMS AND MESSAGES (the base's, not chased): `tests/domain/facts/census2eTables.test.js`
(POLITICAL_FLAVOR "every row declares what its ledger lines say"), `tests/lint/presumedThings.walker.test.js` (2 arms, the
same 32 entries), `tests/lint/observedShapeReaders.walker.test.js` (4; the same inventory, confirmed by a scan of both
trees), `proseWiringCensus.walker` (13), `writerReach.walker` (6), `proseEntryContradiction.walker` (4), `factLayers.walker`
(2), `proseComposed.walker` (2), `tuningRegister.walker` (1), `pipelinePinnedMode` (3), `generationForkCensus` (3),
`proseCorpusBytes` (2), `proseTasteCorruption.walker` (1), `tailHouses1Gaps` (1), `tieProseDeclared` (2), and of the wider
vocabulary net `dossierStateProseProjection.contract` (9), `vendorPdfLazy` (1), `houseDescLateReRead` (1),
`institutionProseDeclared` (1), `npcLoyaltyGuardRows` (1), `colourMarks4h` (2).

GREEN AT MY TIP: `typecheck:domain:strict`, `typecheck:ratchet`, eslint on every changed file, my guard,
`tests/architecture` (21 files, the chair's EG1: no new lazy edge), the arrival, pressure and census suites that name my
pools, `negativeAssertionAnchor`, `seedLoopTotality`, `proseDrawnAnchors`, `styleLaw`. The round before's guards (`tests/domain/bar5*.test.js`, `tests/generators/bar5*.test.js`): 9 files, 60 tests, green.

## REGISTRATIONS OWED

None by design: the guard is under `tests/domain/` (no mutation-manifest entry); no goods module is newly imported
(`canonicalAccessors.js` and `crisisKind.js` only); no new lazy edge (EG1 green).

## NAMED FOR OTHER SEATS (sent to the chair)

- BAR6-CULTURE (the general desk, DS-GEN): "{settlement}'s market handles more than the town could ever use" under a
  famine (3 of the 720, 2 of the fresh 300): my section's (c) names it, but the line is the general desk's.
- BAR6-POWERS: LAW 10h's Plot Hooks rows (4 of the 720): `hookLines.js :: hookPartyOf`.

## WHAT IS 1. Nothing of my rules stands in the three populations. What my rules still see is other seats': the famine market line
   (DS-GEN, BAR6-CULTURE) and the Plot Hooks' roster labels (BAR6-POWERS).
2. The cloth carts (6b-w, WEAK, apart): `exported: cloth` admits a wool export, so "Bolts of cloth and bales of wool" leave
   where only the wool does (3 of the 720, 2 of the 300). A split (`exported: wool`) with its own twin would end it.
3. The guard's 9e arm reads the old enchanting sentence, which no longer exists; it stays as a door against its return.
4. DD1's inverse default is not turned on: the kilns' dominant pool is under three in 208 towns at the base by BAR5-THINGS's
   design (an unanswered kiln kind refuses its line and its twin).
5. For the close: the 55 reference configurations (`arrivalScene`) and the stored-figure tests named above., IN ORDER

1. Nothing of my rules stands in the three populations. What my rules still see is other seats': the famine market line
   (DS-GEN, BAR6-CULTURE) and the Plot Hooks' roster labels (BAR6-POWERS).
2. The cloth carts (6b-w, WEAK, apart): `exported: cloth` admits a wool export, so "Bolts of cloth and bales of wool" leave
   where only the wool does (3 of the 720, 2 of the 300). A split (`exported: wool`) with its own twin would end it.
3. The guard's 9e arm reads the old enchanting sentence, which no longer exists; it stays as a door against its return.
4. DD1's inverse default is not turned on: the kilns' dominant pool is under three in 208 towns at the base by BAR5-THINGS's
   design (an unanswered kiln kind refuses its line and its twin).
5. For the close: the 55 reference configurations (`arrivalScene`) and the stored-figure tests named above.

## FOR THE OWNER, IN PLAIN WORDS

The arrival paragraph used to pick its sounds and smells from a loose match on a house's name, so a village with common
grazing heard butter churned, a mining hamlet heard chisels on stone, and a city that only earns from the wool trade saw
carts of cloth leave on a road its exports never use. Each such line now asks the town's own lists whether the good is
really made, sold or sent out, and where it is not, a sibling line that is true takes its place, so no paragraph goes
quiet. The war's pressure line no longer calls a town loyal whose people the Power tab says have lost faith in their
rulers, and it names the Guard as "The Guard", not "Military/Guard". The wording of every new line is yours to veto.
