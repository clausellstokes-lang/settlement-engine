# BAR6-HOUSES · HAND-BACK

Seat BAR6-HOUSES of BRIEF-BAR6 (the houses' own descriptions and services declare their size, their outside and their sovereign; LAW 5 WIDENED's largest files; ruling SV1). Base: `lane/join-2026-11-14` at afa46d644. Branch: `lane/bar6-houses-2026-11-16`. Commits: 9fa69a146 (the atom, the lines, the reasons, the guard), 34290d9ec (the brewery's siege twin), a804fa1b5 (true guard named, crisis read import-free, EG1), 9caad42da (this hand-back, a test re-keyed), **244981234 (THE FROZEN LEAF: `sovereign.js` imports nothing; blob 50b0fa0d4e446ac5289b74b2d5ed19c7d41f6f51; the chair's word under XA1)**, and the hand-back's last update. Merged nothing.

## THE RULES

| rule | the two readings, and where | the one fact made | 150 · 720 · 300, BEFORE → AFTER | one change cured / line by line | named exclusions | the guard · its positive control | LAW 5W, my files, before → after |
|---|---|---|---|---|---|---|---|
| **6e THE SOVEREIGN WORDS** (seat C's rule; ruling SV1) | a house's line names a crown or a lord (`institutionDescVariants.js`, `institutionServices.js`) vs the record, which gives none (government, powers, houses, people, founding; or a war or an occupation) | **`sovereign`** (new vocabulary: beneath `ruler` in `factVocabulary.js`; leaf `src/domain/facts/sovereign.js :: sovereignOf`; `factsOf.js`; `factLayers.js` layer 4). It holds in 484 of the 720, 198 of the 300, and agrees with seat C's supply reading in every town of both | seat C's runner (`runC.mjs`): **0 · 0 · 0 → 0 · 0 · 0** (BAR5 cured "the lord's dues"; C's detector spares "crown or lord", so it counted nothing at my base). **On the record**, the houses' stored lines that name a crown or a lord where the record gives no sovereign (the guard's reading): **3 · 5 · 2 → 0 · 0 · 0** | all by the atom: two late sets (the village market's "charter from crown or lord", 3 · 3 · 2 twinned; the Speaking Stones "held only by the crown", 0 · 2 · 0 twinned) | none | `tests/domain/bar6HousesSovereign.test.js` arm (c): zero in r2r-village-2, r2r-village-6, r2r-metropolis-34 (each red at afa46d644 on the record); POSITIVE CONTROL a free village built in the test whose market holds the charter line (fires; with a lord's steward it does not) | sovereign lines in my files: 36 → **0 left** (10 declared on the atom, 26 reviewed reasons; G's lexicon does not yet count the atom: see below) |
| **LAW 5 WIDENED** (auditor G; B4) | a line holds a class word (size, outside, plenty, ease, law, goods, sovereign) and its declaration answers none | the existing atoms and dependences: `tier` (size), the crisis families, the rows' own dependence (`crisisDependence.js`), and `sovereign` | G's static inventory, my files' stock: **249 → 0** (96 + 62 + 41 + 50; `institutionDescColour.js` 0) | 11 in code (8 services on the atom; 2 late sovereign sets; the butcher's hunger twin), plus the brewery's siege twin (a lexicon miss of G's, the wide read's C16139); 238 by reviewed reason | `docs/chair/2026-11-16/bar6/AUDIT/tables/G.exclusions.HOUSES.json` (238 rows, `{ file, text, reason }`; held live by the guard) | the guard's arms (b) and "the reviewed reasons are live"; the butcher under a siege (r2s-under_siege-town-0) and the brewery under a siege (bar0-city-under_siege+famine-rand-33), each red at afa46d644 | G's inventory AS IT STANDS reads 96 · 61 · 41 · 50 at my tip: it does not count `sovereign` (its `CLASS_DIMS.sovereign` is `ruler, war, crisis`: ruling CD1 gives that table to BAR6-GUARD). Counting the atom: 94 · 53 · 41 · 50. After the reasons: **0 · 0 · 0 · 0** |

THE LINES DECLARED ON `sovereign` (the chair's ask, given apart, as left for GUARD's class table): `institutionServices.js` 8 (Lord's appointee: "Implement the lord's directives at local level.", "Collect rents and taxes owed to the lord.", "Represent the lord's interests in local disputes."; Lord's steward: "Oversee the lord's properties, staff, and revenues.", "Negotiate supply contracts for the lord's household."; Noble governor: "Govern in the name of the crown or great noble house."; Royal seat: "Rare opportunity to petition the monarch directly."; Village reeve: "Collect dues owed to the lord and accounting for common resources.") and `institutionDescVariants.js :: DESC_LATE_SIBLINGS` 2 (the market's charter; the Speaking Stones).

## B3 · THE WIDE READ'S STANDING ROWS IN MY FILES (REGRESS over the 150, base afa46d644 → tip a804fa1b5)

`regress.py base-w150 tip-w150 SECOND-CHECK.final221.json --verdict STANDS --list`: rows 102 · SAME 101 · CHANGED 0 · **GONE 1** · not on the base as quoted 14.
- **GONE C16139** bar0-city-under_siege+famine-rand-33 | "Commercial-scale ale and beer production supplying taverns and regional distribution." (the brewery's twin: "… for the taverns; while the siege holds the roads none of it goes further.").
- SAME C16118 (the apothecary's "medicinal herbs … all available" under the siege) and SAME C217422 (the maltster's "only runs when grain is in surplus", its "Malted barley" chip unmarked): both are K1, "a row on offer unmarked": the fault is the missing mark, which is the mark leaf's (BAR6-MARKS, LAW 8's 8a.input). Named for it, not cured here.
No 6e row of the wide read stands (seat C's controls: C42840 is the bar read's, cured by BAR5-MARKS; C48148, C48270, C48442 are EXPLAINED).

THE PAGES (every dump at base and tip, diffed): 16 of the 150, 25 of the 720 and 30 of the 300 change, and **every changed line is one of my four cures** (the charter, the Speaking Stones, the butcher, the brewery). The butcher's twin prints only under the siege and the famine (39 towns of the 150 and 300, all `city-under_siege+famine`; in the 720, 20 towns, each a siege or a famine drawn); the original stands in every calm, war and occupied town.

## LAW 5 WIDENED · THE REVIEWED REASONS (238), by class

| reason | rows | how it was checked |
|---|---:|---|
| SIZE · TIER-BOUND: drawn only under its house's own registry entry, every tier it prints at within the word's band | 64 | the registry walked (`institutionalCatalog[tier]`, the variants' `tier|shelf|name` keys, the service menus through `resolveServiceCatalogKey`): every one prints at a town or larger (streets: a village or larger). The inventory reads no tier in a PAIRS or `at.<tier>` key |
| CRISIS CLASS · DECLARED BY ITS ROW'S DEPENDENCE (`crisisDependence.js`: travellers, goods, gatherings, imported input, food) | 77 | the ruling S1 (a row is marked, not rewritten). Checked on the page: in the 30 siege towns of the 150 every printing of these lines carries its mark (324 marked, 0 bare, after the butcher was twinned) |
| A DEMAND LIST (`demandProfile.js`): an import label the record's own import list carries | 49 (+1 also a word sense) | G's arm 5 ("a demand list") |
| SOVEREIGN · ITS OWN HOUSE GIVES IT (a lord's steward, reeve or appointee, a noble governor, a royal seat) | 16 | `sovereignOf` reads the live house's name; the guard holds every house drawn with those menus to a sovereign name |
| SOVEREIGN · NEGATED ("no lord's man", "no higher lord") | 6 | G's arm 5 |
| SOVEREIGN · BESIDE THE TOWN'S OWN AUTHORITY ("crown or town", "lord or municipality") | 3 | the page law's own `SOV_SPARED` |
| WORD SENSE (quarters = lodging, wards = spells, feast day, unhurried, an idle raider, gossip as news, disputes settled from the roll) | 14 | read one by one |
| OUTSIDE · true under every crisis, hypothetical, hedged in its own words, a body not traffic, the past, maps of routes | 8 | read one by one |
| NEVER PRINTED (`ceiling.reason`, a registry note) | 2 | on no page of the three populations |

## THE VETO LIST (every new or changed line, with towns it is read in at the tip)

1. NEW VOCABULARY: the atom `sovereign` (`factVocabulary.js`, beneath `ruler`), its leaf `sovereign.js`. Read in every town (484 of the 720 hold it).
2. "A weekly sale of local goods, held under a charter." (twin of the market's "A charter from crown or lord is required."): r2r-village-2, bar0-village-famine-rand-109 (a famine), r2s-monster_pressure-village-2; also r2r-village-6, bar0-village-calm-rand-129, three of the 150's calm villages. Village only.
3. "Speaking Stones, … held only by the richest powers." (twin of "… held only by the crown or the great guilds."): r2r-metropolis-34, r2s-slave_revolt-metropolis-0. Metropolis only.
4. "Whatever meat can be had, slaughtered and dressed on premises or nearby." (the butcher's hunger twin of "Beef, pork, mutton. …"): r2s-under_siege-town-0 (smallest, a siege), r2s-famine-metropolis-2 (largest, a famine), bar0-city-under_siege+famine-rand-33.
5. "Commercial-scale ale and beer production for the taverns; while the siege holds the roads none of it goes further. Major grain consumer and employer." and its town form ("… Supplies the town's taverns; while the siege holds the roads none of it goes further. …"): bar0-city-under_siege+famine-rand-33, r2s-under_siege-city-2, r2r-metropolis-14 (a siege drawn). City and metropolis in these populations.
6. The eight service definitions that now declare `needs: ["sovereign"]` and the butcher's `excludes: ["crisis: hunger"]`: text unchanged.
7. Out of the colour column (`institutionDescColour.js`): the two texts that now declare (a declaring text is never a colour line).

## THE BOOKS MY CURES MOVE (named, not re-taken)

| test | arm | at afa46d644 | at my tip | the door its header names |
|---|---|---|---|---|
| `tests/data/colourMarks4h.test.js` | the colour column holds the ledger's colour texts | 490 of 492 | 488 of 492 | the ledger `docs/census/declarations/institutionDescVariants.INSTITUTION_DESC_VARIANTS.json` |
| `tests/generators/houseDescLateReRead.test.js` | the table: every key an original with one twin (length) | 26 (pinned 11) | 30 | the table's own count |
| `tests/generators/institutionProseDeclared.test.js` | each service definition carries the ledger's declaration | red at the first row (BAR5's "dues owed") | the same, and 9 definitions more declare (8 `sovereign`, the butcher's hunger) | the services ledger |
| `tests/lint/presumedThings.walker.test.js` | declare the thing, never add a row (fresh hits) | 32 | 36 | `scripts/presumed-things-door.mjs`. The four are the brewery's lines naming the taverns (now read in the late table), TRUE WHEREVER THEY PRINT: 137 of 137 brewery towns of the three populations hold a tavern (grant PT3) |
| `tests/build/vendorPdfLazy.test.js` / `verify:dist` | the first-paint Brotli budget | 306,074 B | 306,495 B (+421: the leaf rides eager engine-core) | the owner's size budget |
| `tests/build/generationWorkerLazy.test.js` | the worker bundle ceiling | 2,410,819 B | 2,415,566 B (+4,747: the twins and their comments) | `WORKER_BUNDLE_CEILING_BYTES` |

RE-KEYED BY IDENTITY (the file's own form, dated): `tests/components/crisisStoppedRows.test.jsx`'s KEEP row r2s-under_siege-city-1 (the butcher's Fresh meat under the siege now prints its hunger twin; the assertion, "prints, unmarked", unchanged; 1 town). Green at my tip.

THE REFERENCE: **0 of the 525 reference configurations move** against afa46d644 (each record hashed by top-level field at both ends).

## THE NET (each file run alone, to a file, through `sh scripts/gate-tail.sh`)

GREEN at my tip: `typecheck:domain:strict` (1113, ceiling 1113), `typecheck:ratchet` (167, ceiling 167), eslint on every changed file, my guard (17 of 17), the round before's guards (`tests/domain/bar5*.test.js tests/generators/bar5*.test.js`: 60 of 60), `tests/architecture` (all, engineCoreLazyEdge included), rosterDuplicateDraws, hookThemeDraws, upkeepVocation, layerBoundaries, defenceFactReaders, noLegacyFactionReaders, ruinFilterRoster, siteCoherenceRatchet, chainPrintSites (no `dist/`), customContentPresentationClaims, regenDerivedState, styleLaw, deepCraftKillList, economicStructure, stressSecretDeclared, defensePostureAgainstItsFacts, corpusEcoTailGuards, negativeAssertionAnchor, seedLoopTotality, proseDrawnAnchors, crisisStoppedRows, and the files that pin my symbols (bar4HousesPresumptions, dossierContent, tierNounPoolDraws, tailHouses11RowsLeft, bar5MarksLaw2, defenceTwinLines, w2FixDataServices, serviceAuthorNotes, factVocabulary, delegatedGetters, census4Ledger, heldKeyWriterCensus, institutionDescDraw).

RED AT afa46d644 AND AT MY TIP WITH THE SAME MESSAGE (the base's, named, not chased): pipelinePinnedMode, generationForkCensus, factLayers.walker (legalHouse's undeclared `availableServices`; the sovereign leaf's own reads trace exactly), observedShapeReaders, writerReach, proseComposed, proseEntryContradiction, proseWiringCensus, tuningRegister, proseCorpusBytes, tieProseDeclared, mutationCoverageManifest, tailHouses1Gaps, proseTasteCorruption, wiringCensusDeclared; `verify:dist` refuses at both on the stored first-paint budget and the goods roster (WEAVE ST-2).

RED AT MY TIP ONLY: the four stored figures of the table above (moved by my declared cures). No law of the net is red at my tip that is green at the base.

## EG1, MET TWICE (the atom's import edges)

1. At 9fa69a146 the leaf imported `facts/crisisKind.js` (pinned lazy): engineCoreLazyEdge red. Cured at a804fa1b5 (the stress container through `canonicalAccessors.js`).
2. A FRESH BUILD at a804fa1b5 found a second edge engineCoreLazyEdge cannot see: the build places `sovereign.js` in EAGER engine-core (factsOf is generator-reached), and its import of `facts/liveInstitutionNames.js` (excised to a lazy chunk) drew coherence-lazy, narrative-mutations and data-lazy into first paint (`vendorPdfLazy.test.js`: "no prose leaf reaches a first-paint chunk" and "the FIX-B2 chunks are absent from the entry closure", both green at afa46d644). THE CURE, pushed on the chair's word at 244981234: the leaf imports nothing; the stress container and the live roster's native names are spelled inline as their homes spell them. Measured: the same reading (484 of 720, 198 of 300, 94 of 150; seat C's agreement in all); the two arms green again; tests/architecture, both typechecks and the leaf's layer trace green. The guard's arm (a2) holds the inline readers equal to their homes (`canonStressors`, `liveInstitutionNames`) on every branch built in the test and on every town it bears; measured whole, equal in all 720, 300 and 150.

THE TWO ARMS, exactly: `tests/build/vendorPdfLazy.test.js` › "ARCH car 2 — the corpus rides data-lazy, and that chunk has a row › no prose leaf reaches a first-paint chunk, the entry chunk or the eager data chunk" and "Tier 9.7 — vendor-pdf lazy load contract › the FIX-B2 anchored-leaf chunks are ABSENT from the entry transitive static closure".

THE LESSON FOR EVERY SEAT'S NET: a seat that adds a fact the generators reach (a leaf `factsOf.js` imports) needs ONE `npm run build` and `tests/build/vendorPdfLazy.test.js` in its net: `tests/architecture/engineCoreLazyEdge.test.js` sees the lazy PINS of vite.config.js, not its EXCISIONS, and only a built graph shows where Rollup places the new module.

## REGISTRATIONS OWED

None. My one new test file is under `tests/domain/` (no mutation-manifest entry). No new import of a goods module. No line of `assembleSettlement.js` touched; no new field on the saved record.

## WHAT IS LEFT, IN ORDER

1. Done: the import-free leaf, pushed at 244981234 on the chair's word. BAR6-PEOPLE's and BAR6-POWERS's copies of the leaf (taken at a804fa1b5) hold the old blob; the chair resolves them to 50b0fa0d4 at the join.
2. For BAR6-GUARD: add `sovereign` to the lexicon's `CLASS_DIMS.sovereign` (ruling CD1); then my files' count reads 0 without the reasons for the 10 lines declared on the atom.
3. For BAR6-MARKS: C16118 (the apothecary's herbs) and C217422 (the maltster) stand as unmarked rows (LAW 8, 8a.input); the brewery's grain mark too.
4. For the close: the books above; the presumed-things register's four fresh hits (PT3, true where printed).
5. The atom's words are seat C's `SOV_FACT` (steward, governor, reeve, manor and appointee give a sovereign): one reading with the page law's detector. If a read finds a steward or a governor of a guild giving a false lord, the cure is one word list in `sovereign.js` and `law6.mjs` together.

## HOW THE INSTRUMENTS ARE RE-MADE

PAGE-COPY (`census3.sh <tree> <out> 4 --seeds <file> --count-only`) at afa46d644 and at a804fa1b5, for the 150 (`bar0-<shape>-rand-<27..41>`), the 720 (`seeds.txt`) and the fresh 300 (`seeds.fresh300.txt`); `runC.mjs` and `law5w-inventory-g.mjs --render` over each; REGRESS over the 150. My scripts (outside every tree, not committed): the tier walk of the registry, the dependence classifier, the exclusion table's builder, the record-side 6e count, the 525 hasher.

## FOR THE OWNER, IN PLAIN WORDS

The town pages sometimes said a house answers to "the crown" or "a lord" in a town that has neither: a free village whose market "needs a charter from crown or lord", a metropolis ruled by its own council whose Speaking Stones "only the crown" may hold. There is now one fact the generator checks: does anything in this town (its government, its powers, its houses, its people, its founding, or a war or an occupation) give it a sovereign? Where nothing does, the line says what is true instead. Across 1,170 generated towns this removed every such line (10 of them), and it changed nothing in the 525 reference towns. Two small lines also stopped lying under a siege: the butcher no longer offers "beef, pork, mutton" in a starving, besieged city, and the brewery no longer sends ale out "for regional distribution" through closed roads. Every other line of these four files that names a size, a traveller, a good or a lord was checked against what the town really holds, and each one's reason is written down where the next guard can read it.
