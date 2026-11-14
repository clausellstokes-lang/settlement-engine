# RECORD-MEASURE-1 · the record itself cannot be so: every class measured, its cures shown before any is built

Base: the joined line at `06f36ad36` (lane/join-2026-11-14). Corpus: the census's 720 seeds born in a scratch worktree of
that base (`census3.sh <base> <out> 4`, the BEFORE run, exit 0; a second births in an untouched tree moved 0 fields in
0 of 720 towns: the corpus is deterministic, so every field diff below is the cure's own). Nothing under `src/` or
`tests/` is committed; every cure is a patch under `probes/RECORD-MEASURE-1/` that applies at the base.

**Read first, the one fact that reframes the flags.** The 533 flags were read at `e5b421802`; 48 commits under `src/`
have landed since, among them R2-CODE-A-12 and R2-CODE-A-13 (the founding walk reads the record; one founder on a
page). 523 of the 533 flags name a census town. Counted on the record AT THE BASE, some classes the readers saw widely
are now narrow (water: 16 towns) or no longer printed (the ranged house counts: 0 pages), and the founder class that
remains is a different set of pairs from the ones the readers quoted ("a disbanded military unit", "a famous
navigator" no longer occur at the base). Every count below is the base's, by script, not the flags'.

**The second read (the chair, 23:02 UTC: the list grew to 614).** The 81 new flags were grouped by the same script.
They show two classes the first list did not: an office with nobody in it (j) and a gendered title against its holder
(k), both added to the table. The rest fall into a–i. Their founder pairs again quote rows R2-CODE-A-13 already holds
(a counting-house merchant family, a shipwright family, foresters, a favoured noble's farmland). That confirms the
same tip: those pairs do not occur at the base.

**THE CHAIR'S RULINGS (23:17 UTC, each vetoable by the owner), copied as given.** C1-A GRANTED: the made list asks the
export's own gates, and a chain needs a house of THIS town, by `institutionalCatalog.js :: isFabricInstitution`. C2-A
GRANTED: the seven category keys leave the made list. FA GRANTED: the 48 silent Origin rows are the rule's own answer.
DA GRANTED AS A DECLARED MOVE (38 towns). The hired-house member (70) is DESIGNED and struck. h is DESIGNED for an inland
fish market, and the strict 37 are this seat's to measure next. Builders: TAIL-DEFECON (c1a, c2a), TAIL-NARRATIVE (fa),
TAIL-POWERS (da). **SAID BACK TO THE CHAIR:** the costs section below was pushed after the ruling. DA contradicts
the pin `powerCardOrderReads.test.js` SW-B1 · P50 (a thorp seated by priority reads "Headman's Authority"), so building
DA re-decides that pin, and TAIL-POWERS should hold it to the chair before building. C1-A reds two anchors of
`economicsProducedLocally.test.jsx`, one of them the smith's iron, which C1-A's gate should admit: TAIL-DEFECON reads it first.

## THE TABLE

"Printed": towns of the class whose dump holds the class's witness (the good, the house, the power, both founding
rows) in a tab (Summary/Systems/World/Table); the section where it is met is named. A witness test, not a reading:
it says the page can show the fault, not that a reader will call it so.

| class | the predicate on the record | towns /720 | thorp·ham·vil·town·city·metro | the maker | the page prints | candidates (measured) | recommendation · what it loses |
|---|---|---|---|---|---|---|---|
| **c1** made or exported with no house that makes it | a good of `economicState.localProduction ∪ primaryExports` matching a MAKER row (23 rows: gems, iron/metal, coal, glass, education, religious services, hospitality, flour/bread, sea salt, leather, barrels, dyed cloth, textiles, peat, ships, arms, bows, potions, books, coin, milled timber, stone, toll) while no institution (not an "Access to …" row) matches the row's house | **522** (433 without coal/peat) | 111·110·99·80·82·40 | `computeActiveChains.js :: deriveLocalProductionFromChains` step 1 (every land commodity of every nearby resource, no extraction gate) and step 2 (outputs of chains whose processor matched only "Access to …", the fuzzy matcher's frozen false match); the export side `deriveExportsFromChains` + tier goods (`Toll revenue`) | 452: Systems/Resources 328, Systems/Economics 292 | **C1-A** step 1 reads the export's own `RESOURCE_EXTRACTION_GATES`; step 2 keeps a chain only where a non-"Access to" house processes it → c1 **469** (358 w/o coal/peat); moves ONE family: `economicState.localProduction`, 407 towns; nothing else. **C1-B** C1-A + an "Access to" house processes no chain at the matcher → c1 468; moves localProduction 407, **activeChains 222**, primaryExports 13, primaryImports 6, npcs 4, history.founding 1, simulationTrace/receipt 222 | **C1-A.** Cures education 119→37, religious services 89→0, gems 102→51, iron/metal 69→0 on the made side. Loses nothing measured off its family. Does NOT touch the export side (toll 74, hospitality 26, sea salt 21, gems-as-jewelry 34) nor coal/peat, which are UNGATED BY DESIGN (the gate table's own comment: "surface-accessible fuel … gathered like foraging"): re-deciding those is the chair's, not a repair |
| **c2** a category key printed as a good | `localProduction` holds `trade access`, `maritime access`, `Toll income`, `Market taxes`, `luxury`, `Strategic control` or `water` | **302** | 46·54·35·50·56·61 | `resourceData.js` commodities (`trade_access` ×3 rows, `maritime_access`, `luxury` ×2, `water`) and chain outputs (`Toll income`, `Market taxes`, `Strategic control`) read by `deriveLocalProductionFromChains` | 302: Systems/Resources 302 | **C2-A** the made list keeps no category key → c2 **0**; moves `localProduction` only, 302 towns (exactly the class). **C2-B** the keys taken out of `RESOURCE_DATA` commodities → c2 83 (the chain-output keys stay); moves `resourceAnalysis.availableResources` **376** + localProduction 292 | **C2-A.** Exact; loses nothing measured. C2-B moves the resource card in 376 towns for a smaller cure |
| **a** a founder and an Origin row that cannot both be | the Origin row (`history.founding.reason`) names WHO began the place (21 rows: a naval base, a stronghold, an outpost, a toll or customs post, a grain depot, a sacred grove's religious settlement, herders, fishers, miners, mining companies, loggers, traders' fair, refugees, a noble's lodge, a household, a merchant, a soldier) and the founder's kind (`founder.js :: FOUNDER_KIND`) is not one that can be that who (the table: `classes.mjs :: ORIGIN_AGENT`, my reading, declared) | **154** | 25·28·21·30·27·23 | `narrativeGenerator.js` the founding draw (`pick(reasonPool)`, `pick(founders)`) through `foundingRowAdmits.js :: admittedRow / oneFounderRow`: R2-CODE-A-13's agreement table holds only rows that name a PERSON; rows that name an agent GROUP agree with every founder | 154: World/History (both rows) | **FA** the agent rows join `oneFounderRow`: a row whose agent the founder cannot be resolves draw-free onward to a row that agrees → a **0**; moves `history.founding.reason` only, 154 towns; 48 of them land on no row (silence), the rest on rows of their own terrain pool whose tests hold. **FB** the founder resolves draw-free to the next tier founder the Origin row admits → a 62 (a tier's four or five founders often hold no agreeing kind); moves foundedBy 107, reason 6, simulationTrace/receipt 18 | **FA.** Exact and in its own field. Loses the Origin row in 48 towns (null: the History tab prints no Origin line there). The agent table is a judgment; the chair rules its rows |
| **d** a power with no body, a body with no power line | a faction `Military/Guard·Military Party` at Significant+ with no garrison and no watch (32); `Headman's Authority` with no headman's house (38); a criminal/arcane power at Significant+ with no house of its kind (10); a Free company hall / Hired blades / Hireling hall while the defence profile's `mercenary` line is empty (70); `Thieves' guild (powerful)` beside a Suppressed/Minor thieves' faction (15) | **153** | 10·23·30·49·17·24 | headman: `power/rulingStructure.js` the small tier's fallback name (`topPriority > 65` military → "Headman's Authority", no roster read); hired: `defenseInstitutionBuckets.js :: DEFENSE_BUCKET_KEYWORDS.mercenary` holds none of the three houses | 153: World/NPCs 140, Systems/Institutions 138, Systems/Power 134 | **DA** (headman only) the name is said only where the roster holds a headman's house, else the tier's default Elder Council → d **123** (headman 38→0); moves 23 families in those 38 towns: factions, governingName, government, npcs 38, relationships 29, stress.cast 27, pressureSentence 20, factionRelationships 16, prominentRelationship 8, recentConflict 7, conflicts 5, currentTensions 3, primaryImports 1, legacyAnnotations 1, simulationTrace/receipt 38 | **DA, as a declared move** (the government's name is read by most of the page). THE HIRED MEMBER (70) IS RULED: `tests/generators/payOneHome.test.js` pins "a charter hall or a free company hall is not one [a contracted company]" (the reviewer's seed rv2-under_siege-town-1 "prints no hired swords"). Re-deciding it is the chair's; a page line ("a billet between contracts") would meet the reader without moving the record. Not tried: the made-whole twin of DA (a headman's house where the power is named) |
| **h** a house the land cannot have | Fish market / Fishmonger / Fishing community where the water home (`factsOf(record).water.kind`) is none, or a Fish market / fisher / peat cutter / woodcutter in desert (mountain: fish market) | **167** (strict, desert/mountain only: 37) | 0·1·14·33·54·65 | `institutionalCatalog.js` the Fish market row (village .3, town .45, city .55, metropolis .6; no water test) | 167: Systems/Institutions, Systems/Services, World/NPCs 167 | none tried | **NO CURE: DESIGNED.** The row's own text admits it inland: "The morning's catch or the week's salted barrels"; the Fishmonger row: "Near water: fresh. Inland: dried or salted." The strict 37 (desert, mountain) are the chair's to rule |
| **i** made and imported at once | a good in `localProduction` that `primaryImports` also lists (Salt where a Salt works stands) | 106 | 5·15·9·19·25·33 | `economicState.js :: normalizeFinalTradeLists` drops an export the town imports, not an import the town makes | 106: Systems/Economics 104 | none tried | measured only (Medicinal herbs 53, Salt 27, Grain 14, Timber 10, Wool 8): a shortfall import beside a small local yield is often true (plague 20, siege 11, famine 15 of the 106) |
| **g** a stability or legitimacy word against its neighbours | two Dominant powers (34); "Stable" beside a Legitimacy Crisis (9); "… theocracy" under a non-religious government with no Strong religious power (8); a council house under a theocratic government (8); "strong military presence" with no garrison (1+2) | 60 | 10·8·20·5·3·14 | `power/governanceNarrative.js` (the stability line), `factionDynamics.js` (power labels) | 60: Summary/Overview, Systems/Power | none tried | measured only |
| **f** "Lightly Defended" with every line empty | `defenseProfile.readiness.label` above Vulnerable while walls, garrison, militia, watch and mercenary are all empty | 24 | 17·4·3·0·0·0 | `defenseGenerator.js` → `bandLadders.js :: readinessBandOf`: UPKEEP-12 floors a HELD roster above Undefended; nothing caps an EMPTY one | 24: Summary/Overview, Systems/Defense | none tried (the mirror of UPKEEP-12: an empty roster reads at most Vulnerable; moves the label only) | measured only |
| **b** water where none is | water home none, and the roster holds docks, a harbour master, a shipyard, a boatyard, a fisher's landing, a river ferry or a barge company (b1), or a waterborne good is made or sold (b2) | b1 **16**, b2 12 | metropolis only (b2: one village) | the metropolis roster: the Docks and Harbour master rows carry `tradeRouteRequired: ['port','river']`, held anyway in 16 dry metropolises (the path that seats them was not traced) | 16 / 12: Systems/Institutions, Economics | none tried | measured only: the class the readers saw in towns and hills is gone at the base |
| **c3** too fine for the size | Education in a thorp (52); luxury in a thorp/hamlet (40); advanced arms in a thorp/hamlet or beside only a part-time smith (13) | 94 | 61·33·0·0·0·0 | as c1 / c2 | 52 | C1-A + C2-A → **30** | rides on C1-A/C2-A |
| **j** an office with nobody in it (NEW at the second read) | a Government-category house (not "Access to …") that no NPC holds (`npcs[].institution.key/family`) | 367 (thorp–village 140) | 50·45·45·62·83·82 | the people step seats faces for a capped few houses (`generators/people/`); the roster's government rows are not among those it must fill | 367: Systems/Institutions, Systems/Power (the house is named; its empty seat is what the reader infers) | none tried | measured only; in a city with eight NPCs an unseated "City administration" (48) is weaker than an unseated Village elder or headman in a thorp |
| **k** a gendered title against its holder (NEW at the second read) | an NPC `female` whose title holds "-man", "lord", "king", "brother", "father", or `male` whose title holds "woman", "mistress", "lady", "queen", "sister", "mother" | 268 | 26·28·31·38·77·68 | the house's `face` (`institutionalCatalog.js`: "the ferryman", "the front man", "the boat-headman", "the camp foreman", "the foundling-mother") and `people/mintTitles.js` ("the headman", "the lord"), minted with no reading of the drawn gender | 246: World/Relationships 186, Systems/Power 127 | none tried | measured only: the title is a page fact with one maker; a gender-paired face table is the natural cure and moves titles only |
| **e** a house the size cannot hold | a ranged house whose lower bound, at a declared people-a-unit (guilds 60, parish churches 250, taverns 50, mills 100), exceeds the population | 17 (threshold-bound) | 0·0·0·13·4·0 | the tier's fixed roster labels | **0**: the ranges no longer print at the base | none | the page already says nothing false |

## THE FIVE CURED CLASSES, a paragraph each

**c1 · made with no house (522).** The made list is not a list of what the town's houses make: it is every commodity
of every resource the land holds, plus the first two outputs of every resource-activated chain, and the parish chain
runs wherever "Access to parish church" stands because the fuzzy matcher's 12-character prefix of "Parish church"
is inside it (a false match the matcher's own comment freezes). C1-A asks the export's gate table, which already
exists for this reason, before a land commodity is called made, and asks of a chain that a house of THIS town
processes it (the patch spells it `/^access to/`; the home for that question is `institutionalCatalog.js ::
isFabricInstitution`, which a builder should read instead). It moves one field in 407 towns. What remains (469) is
three things the cure does not touch, each with its own maker: coal and peat, ungated by design; the EXPORT side
(`Toll revenue` with no toll house 73, hospitality with no inn 26, sea salt with no salt works 21); and houses my
MAKER table does not know (a tanner is "Tanners"/"Tanner (established)": leather 55 is mostly real). Inheritors: where
"stone" leaves, the chain's own "Quarried stone" now survives the catalog's collapse (23 towns); the same for
Milled lumber 7, Game meat 6, River fish 4, Cut gemstones 2. C1-B does the matcher's work at the source and moves the
chain card in 222 towns for one town more: not worth it.

**c2 · a category as a good (302).** "trade access", "maritime access", "luxury" and "water" are resource commodities
(`resourceData.js`), "Toll income", "Market taxes" and "Strategic control" chain outputs, and the made list prints
them as goods. C2-A filters them out of the made list (a declared list of seven); exact, one field, the class's own
302 towns. C2-B edits the data instead and moves what the resource card shows in 376 towns for 219 cured.

**a · founder against origin (154).** The R2-CODE-A-13 rule holds the Origin rows that name a PERSON to their founder;
the rows that name a GROUP (herders, fishers, a fair's traders, a military post, a religious settlement) agree with
anyone. FA adds those rows to the same resolution with a kind table and cures the class in its own field. Its cost: 48
towns print no Origin row (the walk finds no agreeing row of the pool, and silence is the rule's own answer). FB turns
the other way (the founder follows the Origin row) and is weaker (62 left), because a tier offers four or five founders.

**d · power and body (153).** Two makers, one of them ruled. "Headman's Authority" is the small tier's fallback name for
a military-minded place with no government house, read from the priority alone; DA reads the roster for a headman and
otherwise names the default. It cures 38 and is the widest move of the five (the government's name is read by NPC
titles, relationships, the crisis cast, the pressure sentence). The hired-house member (70) is a design pinned by a test.

**h · land (167) instead of a fifth cure.** Named in the brief's spirit ("cannot be so"): it can be so, by the row's own
text. The strict desert/mountain 37 are the chair's.

## WHAT THE PAGE GAINS AND LOSES (the AFTER census: C1-A + C2-A + FA + DA together)

(filled from `inventory_diff.py` on the BEFORE and AFTER runs; see the section below)

## WHAT IT COSTS ELSEWHERE (eleven focused files run in the AFTER tree; NAMED, nothing re-taken)

`vitest run` over the founding, made-here, chains, power-card, ruler-kind, pay and golden-master files: 7 failed of
126. None of the five is banked in `scripts/.test-ratchet-baseline.json`.
- `tests/property/generatorGoldenMaster.test.js`: 525 configs move (all four cures together). The golden is the owner's door, never re-taken here.
- `tests/components/economicsProducedLocally.test.jsx` (2): "a thorp that walks to a neighbour's church" and "a hamlet with no potter, no sawmill and no church … its smith's iron stays". Both are anchors on the made list's current content, and **C1-A's**. The second is a real objection: iron with a smith and no mine is held as made by design (the smith works bought iron). C1-A's extraction gate for `iron_deposits` (mine, smelter, blacksmith, forge) should admit it, so the failure needs a builder's reading before C1-A is built.
- `tests/generators/foundingWalkLandsTested.test.js` W3 (1 of 5 guard towns): a cured row moves; **FA's**.
- `tests/generators/powerCardOrderReads.test.js` SW-B1 · P50: "a thorp seated by priorityMilitary 80 … expected 'Headman's Authority'". **DA CONTRADICTS A PIN**: the priority-seated headman is DECIDED (the government line is the seat's own). DA is therefore a re-decision, the chair's, not a repair. Its made-whole twin (seat a headman where the power is named) does not contradict the pin.
- `tests/generators/coherenceAgreeCures.test.js` (2, the gate tally): **RED AT THE BASE ALREADY** (2 failed at 06f36ad36, unbanked), not the cures'. Reported, not touched.

## HOW THE INSTRUMENTS ARE RE-MADE

1. `git archive origin/lane/census-3-2026-11-14 docs/chair/2026-11-14/probes/CENSUS-3` and `git archive
   origin/lane/chair-2026-11-08 docs/chair/2026-11-14/probes/READ-ALL docs/chair/2026-11-14/read-all` to a directory
   outside every tree; a scratch worktree of the base with `npm ci` (each candidate tree symlinks that `node_modules`).
2. BEFORE: `sh <CENSUS-3>/census3.sh <base tree> <out>/before 4` (~20 min). A candidate's record:
   `CENSUS3_PROBES=<CENSUS-3> sh births-only.sh <candidate tree> <out>/<c>` (~1 min), then
   `node fielddiff.mjs <before>/corpus.ndjson.gz <c>/corpus.ndjson.gz [depth]` (the field diff by family) and
   `node classes.mjs <candidate tree> <c>/corpus.ndjson.gz <c>.classes.json` (every class's count).
3. `node pageprint.mjs <classes.json> <corpus> <dumps>`: the "printed" column. `c1split.mjs`: c1 by made / exported.
4. `group_flags.py`: the first keyword grouping of the 533 flags (it found the class names; the counts are the
   predicates', not the flags').
5. Patches: `c1a c1b c2a c2b fa fb da .patch`, each `git apply` at `06f36ad36`.
