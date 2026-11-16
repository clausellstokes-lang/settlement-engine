# BAR6-AUDIT-G · HAND-BACK · LAW 5 WIDENED: the static inventory of every presumption, and the default-deny design, measured

Seat G of BRIEF-BAR6-AUDIT (`lane/chair-2026-11-08 :: docs/chair/2026-11-14/briefs/BRIEF-BAR6-AUDIT.md`). Branch `lane/bar6-audit-g-2026-11-16`, from the joined line's tip **600b7683a** (as the brief named it), with `lane/bar5-audit-a-2026-11-16` at c0ea05497 and `lane/bar5-audit-b-2026-11-16` at d40d6ab28 merged once (`--no-ff`). **Nothing is cured: no line under `src/` changes, no test file is added, no file another seat or an earlier auditor wrote is edited.** BAR5-AUDIT-B's `law5-inventory.mjs` is read, not edited: its literal scanner and channel reading are copied into this seat's own tool.

## The tools (all of this seat's letter; every run through `sh scripts/gate-tail.sh`)

| file | what it does |
|---|---|
| `tests/helpers/pageLaws/law5w.mjs` | THE LEXICON: thirteen classes (law 5's six crisis classes verbatim, and SIZE, GOODS, EASE, THREAT, OFFICE, SOVEREIGN, RESOURCE), the atom dimensions that answer each class, and one status a class for a line. A factory over the measured tree's own `factVocabulary.js`. |
| `docs/chair/2026-11-16/bar6/AUDIT/law5w-inventory-g.mjs` | THE INVENTORY: every prose line (four words or more) of `src/` (tests out): the state annex read structurally (block, pool, variant, `marks`, the pool's `poolMeta`), every other file by its literals with its object's `needs` / `excludes` / `crisis` / `twinOf` / `colour` / `tags`, the declaration channels of `scripts/lib/table-pools.mjs`, `declaredSet(...)`, and an arrival sense's house or trade key. `--render <dir>`: which lines a PAGE-COPY render prints. |
| `docs/chair/2026-11-16/bar6/AUDIT/defaultDeny-g.mjs` | POINT 2: the four scene groups, static and measured on the render's own towns with the draw's own rule (`declarationAdmits(declarationOf(line), factsOf(record))`). |
| `docs/chair/2026-11-16/bar6/AUDIT/controls-g.mjs` | POINT 3: every control row looked up in the inventory, both ways (the source's fragment in the printed text, the printed text's run in the source). |
| `docs/chair/2026-11-16/bar6/AUDIT/tables-g.mjs` | the tables below (`TABLES-G.md`), the fifty lines to judge, the overlap with BAR5. |
| `docs/chair/2026-11-16/bar6/AUDIT/runG.mjs` | **THE RUNNER FOR THE CHAIR**: `node docs/chair/2026-11-16/bar6/AUDIT/runG.mjs <render-dir> <out.json> [tree-root]` runs the three over the tree it stands in (or the one named) and any PAGE-COPY render, and prints the counts by class. Proved: it reproduces this hand-back's inventory byte for byte on the 150. |

Outputs committed beside them: `TABLES-G.md` (T1 to T6), `CONTROLS-G.json`, `DENY-G.txt` and `DENY-G.mute.json`, `PRECISION-G.md`.

**The render.** The 150 wide-read towns (`bar0-<shape>-rand-<27..41>`, ten shapes) were born and rendered at this branch's tip with PAGE-COPY (`census3.sh … 4 --seeds … --count-only`: exit 0, 150 dumps, 338 s). The brief has this seat render only for point 2's last question and to prove point 3, so the 720 and the fresh 300 were NOT rendered: this seat's counts are of the SOURCE (a static inventory needs no population), and "seen printed" is in the 150.

## 1 · THE TRUE STOCK, by class and by file

Of **6,236 distinct prose lines** of `src/` that hold a class word, **2,689 hold at least one class no declaration answers**; **1,154 of them sit in the 79 files whose lines the 150 towns' pages print**, and **546 were seen printed** in those 150 towns. By class (a line counts once a class; full table `TABLES-G.md` T1):

| class | lines | declared | STOCK, all of src | STOCK in printing files | STOCK seen printed |
|---|---:|---:|---:|---:|---:|
| outside (law 5) | 724 | 49 | 675 | 276 | 151 |
| size | 538 | 67 | 471 | 264 | 139 |
| office | 812 | 218 | 594 | 179 | 75 |
| goods | 836 | 425 | 411 | 181 | 68 |
| resource | 427 | 190 | 237 | 122 | 49 |
| sovereign | 201 | 0 | 201 | 90 | 44 |
| plenty (law 5, widened) | 196 | 40 | 156 | 68 | 24 |
| ease | 93 | 12 | 81 | 45 | 25 |
| threat | 52 | 17 | 35 | 13 | 2 |
| iron, animals, work, law (law 5) | 28 | 15 | 13 | 10 | 7 |
| **line·class pairs** | 3,907 | 1,033 | **2,874** | **1,248** | **584** |

"Declared" counts `declared` (an answering atom), `twin`, `scoped` (a `{crisis-scoped}` pool), `gate` (a tier word in the pool's key), `keyed` (an arrival sense keyed by a house or a trade) and `bound` (a house's own description or service, a title's own line: drawn only where that house or title stands; answers a goods, resource or office word, never a size or a crisis word). 614 of the 1,033 are `keyed` or `bound`: COARSE (see point 3: the butter of a "livestock" key in a town with no dairy). The stock splits: **none 2,438** (the line declares nothing at all) · **colour 250** (ruled "presumes nothing" while it holds a class word) · **other 182** (declares atoms, none for this class) · **any 4** (writes only `crisis: any` for a crisis class).

THE LARGEST PRINTING FILES (T2 has forty): `institutionDescVariants.js` 103 (size 42, outside 39, sovereign 19) · `people/titleSecretsPresentations.js` 70 (outside 43) · `institutionServices.js` 65 (outside 32, size 16, sovereign 10) · `cultureProfiles.js` 63 (size 32) · the annex's defence desk 59 (office 22, size 20) · `demandProfile.js` 50 (goods 43) · the annex's war-and-faith desk 49 · the general desk 45 (size 20) · `institutionalCatalog.js` 45 · `safetyProfile.js` 44 (office 23, size 16) · `npcData.js` 37 · `narrativeData.js` 33. A further 279 files hold 1,535 lines the 150 towns never print (the herald, the world pulse, the compendium, validators' messages): reported apart, not stock of a town page.

T3 · DECLARED FOR ONE CRISIS ONLY: 32 crisis-class lines (18 seen printed) whose declaration names one crisis kind and no family, most `excludes: ['crisis: under_siege']` beside `crisis: ['any']`: they pass a famine, a war, an occupation and a monster frontier unasked (C150831's porters, printed under a famine; C3247's "defended in the ordinary way", which excludes only `crisis: occupied`, printed under a siege).

T4 · THE SOVEREIGN WORDS: **lord / liege / overlord 121 lines in 48 files, every one undeclared** for the class (no `ruler:`, `war:` or crisis atom), 50 in printing files, 25 seen printed; **crown 54 lines in 24 files, all undeclared, 17 seen printed.** No line of `src/` declares a sovereign: the vocabulary's `ruler: lord` is read by no line that names one. (BAR5-THINGS' 98 in about 45 files and this inventory's 121 in 48 count different units: its, a reading of a line; this, distinct texts of four words or more. The orders agree.)

## 2 · THE DEFAULT-DENY DESIGN, MEASURED (`DENY-G.txt`)

THE STATIC HALF, the four scene groups (twins counted apart):

| group | pools | lines | NO class word (safe as written) | declared for every class | NEED a declaration | with a twin |
|---|---:|---:|---:|---:|---:|---:|
| SENSORY (`ARRIVAL_SENSES`, by trade key) | 32 | 107 | 60 | 45 | 2 | 42 |
| AMBIENT (`ARRIVAL_PEOPLE` by culture, `ARRIVAL_SCENES`) | 18 | 76 | 60 | 5 | 11 | 5 |
| ARRIVAL (`ARRIVAL_TENSIONS`, `ARRIVAL_MEMORIES`, `STRESS_DESCS`) | 34 | 162 | 124 | 15 | 23 | 3 |
| DAILY (the 13 annex pools the Daily Life tab prints) | 13 | 47 | 43 | 0 | 4 | 0 |

Under a lenient reading (a sense's house or trade key counts) SENSORY needs almost nothing; under a STRICT one (the key does not answer the good a line shows: the butter, the cloth carts, the forge) 21 of its 45 "declared" lines need a line atom. AMBIENT's needs are ease 3, goods 4, office 2, resource 2; ARRIVAL's are size 12 (siege and arrival lines naming streets, lanes, quarters), outside 4, goods 4.

THE MEASURED HALF: the render's fifteen towns of each shape, every pool a town can reach, the lines the town's own record admits today and under default-deny (a line prints only with no class word, or declared for every class it holds):

| shape | group | lines a reached pool prints, median: today → deny (strict) | pools under three TODAY in some town | NEWLY under three under deny (strict) |
|---|---|---|---:|---:|
| hamlet under siege | SENSORY / AMBIENT / ARRIVAL / DAILY | 2 → 2 (1) / 3 → 2 (2) / 3 → 3 (3) / 3 → 3 (3) | 6 / 8 / 8 / 6 | 0 (1) / 4 (4) / 0 / 0 |
| village famine | the same | 4 → 4 (2) / 3 → 2 (2) / 3 → 3 (3) / 3 → 3 (3) | 6 / 5 / 6 / 6 | 1 (7) / 3 (3) / 1 / 0 |
| thorp calm | the same | 3 → 2 (2) / 3 → 2 (2) / 3 → 3 (3) / 3 → 3 (3) | 4 / 5 / 7 / 6 | 1 (6) / 5 (5) / 0 / 0 |

**IS ANY POOL MUTE? Yes, but the pools are thin TODAY, before any deny.** A reached pool prints a median of two to four lines in these places already: 4 to 8 pools of each group fall under three lines in some town of each shape with no change at all. Default-deny would newly mute, in some town: AMBIENT 3 to 5 pools a shape (`ARRIVAL_SCENES.river` and `.guild`; `ARRIVAL_PEOPLE.celtic`, `.slavic`, `.germanic`, `.mesoamerican`), ARRIVAL one (`ARRIVAL_MEMORIES.pilgrimage_surge`: 2 → 0 in 3 famine villages), SENSORY one lenient and six or seven strict (`bread`, `livestock`, `cloth`, `smiths`, `herbs`, `tanners`: 4 → 1 or 2 strict); DAILY none. `DENY-G.mute.json` lists each pool, its towns and its counts.
**Caveat, said once:** the reach of a SENSORY key is approximated (the key's house or trade fragments against the record's houses, exports and income); an `ARRIVAL_SCENES` key and an `ARRIVAL_MEMORIES` key are counted as reached in every town, so `river` (reached here by all 45) overstates: a town draws one scene key and one memory key.
**The design that follows:** default-deny is affordable only WITH twins: the pools it mutes are the ones whose lines presume the trade or the ease outright and carry no twin (SENSORY has 42 twins for 107 lines and is the group that survives a lenient deny; AMBIENT has 5 for 76). The cure's order is: (i) give each AMBIENT and SENSORY line that names a good its own atom (`trade at work: <good>` widened beyond fish, kilns, stone, arcane; the dairy, the loom, the forge), (ii) twin the 11 + 23 lines that need one, (iii) then turn on the inverse default for the four groups (`{crisis-scoped}` already exists in the annex and in `ARRIVAL_CRISIS_SCOPED`, emptied by CENSUS-2f because "every line writes `crisis: any`": `crisis: any` is the blanket that defeats it, and it must stop answering a crisis class).

## 3 · THE LEXICON'S REACH: every control of kinds K2 and K4 (`CONTROLS-G.json`)

The 27 STANDS rows of K2 (11) and K4 (16) in the wide read, and 16 STANDS rows of the bar read (final72) classed by this seat as those families (K2: C40276, C43575, C17290, C0333, C5441, C0350, C3223, C5452, C42116; K4: C43925, C44306, C15951, C39608, C39734, C42840, C37887). Each found in the inventory with its class and its status, or said why not:

| outcome | wide (27) | bar (16) | rows |
|---|---:|---:|---|
| **A · CAUGHT: a class word, no declaration for it** (none / other / colour / any) | 5 | 10 | C154042 size:colour · C161931 office:colour · C26390 threat:colour · C94460 ease:any · C15780 plenty:other · C43575 work:colour · C0333, C5441 outside:colour · C0350, C3223, C5452 outside:other · C42116 law:none · C44306 office:colour · C39734 office:none · C42840 sovereign:other |
| **B · CAUGHT ONLY STRICT** (a sense key's house or trade "answers" the good) | 2 | 0 | C219863 goods:keyed (butter under `livestock`, no dairy) · C39804 goods:keyed (cloth carts under `cloth`, little cloth made) |
| **C · DECLARED, THE WRONG ATOM** (too coarse for the thing) | 1 | 1 | C115374 and C15951: `trade at work: kilns` answers glassworks and charcoal kilns, the line shows pots and fired clay |
| **D · DECLARED, THE WRONG BAND OR ONE CRISIS ONLY** | 4 | 0 | C209939 `tier: ≥ village` for "neighbourhoods" (needs ≥ town) · C184150 `food: ≥ importDependent` admits a town 10% short ("does not empty the tables") · C3247 excludes only `crisis: occupied`, printed under a siege · C217292 excludes siege and plague, not famine, beside `crisis: any` |
| **E · DECLARED, THE ATOM'S READER DISAGREES WITH THE PAGE** (M1: seats D and E) | 2 | 1 | C84094 `trade at work: stone` true by the mine's card, the Resources tab says no one works stone · C157891 `no hunger` while the bread rows are short · C40276 `food: ≥ secure` where the page says short every day |
| **F · DECLARED, NO ATOM FOR THE FACT** (a vocabulary gap) | 4 | 0 | C146255, C205552, C85036: `no threat`, `no danger coming` and no atom for a REGIONAL MONSTER THREAT (a frontier condition, not a crisis) · C91256: no atom for a power's MEMBER COUNT ("its members cannot agree", one headman) |
| **G · LEXICON MISS** (the presumption is in words no class holds) | 3 | 1 | C150831 porters and loaded frames (an ARRIVAL OF GOODS) · C113231 plots, terraces, raised fields (CROP FARMING) · C128237 "a small group of traders who come on market days" (SMALL FOR BIG: the size class reads only big words) · C43925 "significant military force for this scale" |
| **H · NOT A POOL LINE** (a record value, a slot, or a line composed at print) | 6 | 3 | C86447, C86484, C39608, C88481: the export and chain-output LISTS are record values (`economicState.primaryExports`, the chain's outputs): the cure moves the record (seat C's 6c) · C204663: `There is {resource} …`: the class word is the SLOT's fill · C158113, C171330, C37887: the Resources gap line ("No one here works the stone", "no charcoal burner finishes it") is TRUE alone and contradicts the chain's state (M1, seat D) · C17290: the food line is composed in `foodways.js` from fragments |

**The reach, in one line:** a class guard catches **15 of 43** (17 strict); the declaration-quality rules below (wrong atom, wrong band, one crisis only) catch **6** more; **3** are M1 reader disagreements, **4** need new atoms, **4** need new lexicon words, **9** are not pool lines. So the inventory finds the source line of 34 of the 43 controls, 33 with their class (not: the four lexicon misses, C204663's slot, and the five lines composed at print or read from the record), and a guard that read only "a class word and no declaration" would stop about **a third** of them: the false lines of this program are as often DECLARED WRONG as undeclared.

## 4 · THE BUILD GUARD, DESIGNED, NOT WRITTEN

**Its form.** `tests/lint/presumptionClasses.walker.test.js` (an enforcement walker by name, title and structure: CONTRIBUTING's five arms) over `tests/lint/presumptionClasses.shared.mjs`, reusing two existing machines rather than a third: the presumed-things walker's matcher (`src/domain/facts/registeredWords.js :: negates`, `sentencesOf`; its literal hash `literalHash`) and the census's declaration reading (`factVocabulary.js :: declarationOf`, `declarationOfTags`, `declarationOfMarks`; `scripts/lib/table-pools.mjs :: TABLE_POOLS`, `DECLARATION_CHANNELS`; the annex's `poolMeta`). Its lexicon is this seat's `law5w.mjs`, moved under `src/domain/facts/` beside `registeredWords.js` as ONE more table of words with their answering dimensions. Its arms:
1. **A class word with no answer reds**: every prose line of a printing pool (the annex; the enrolled tables; the literals of the printing files, i.e. every file the renders print from) that holds a class word and whose declaration names no atom of a dimension that answers the class.
2. **`crisis: any` answers no crisis class**, and **`colour` beside a class word reds** (R-AO: a colour line presumes nothing: a class word says it presumes something).
3. **A crisis class needs its families**: a plenty, ease, threat or outside line declares against the FAMILIES (`hunger`, `threat`), not one kind (T3's 32).
4. **A size word meets its band**: streets, quarters, wards, neighbourhoods, districts need `tier: ≥ town` (or `population: ≥ middling` where the record's band is fixed so); `tier: ≥ village` does not answer them (C209939).
5. **Exempt by rule, never by row**: a negated mention (`negates`); a line bound to its house, title, chain or power (the `bound` files, the chain and supply-chain tables); the record's own fact printed back (the founding reason, the route, a demand list); a slot whose fill is the class word is read on the page arm (the presumed-things walker's arm 2), not here.

**Its size: today's debt as a shrink-only register.** Key `file \t class \t literalHash(text)`, banked once at the guard's base through a door like `scripts/presumed-things-door.mjs` (`--bank` refuses a literal that did not stand at the base). By this inventory: **1,154 lines (1,248 line·class pairs) in 79 printing files**; after arm 5's exemptions, about **760 lines** (33 of the 50 judged lines stay flagged), of which about **600 are true presumptions** (26 of 50).

**Its false alarms, on fifty lines judged by hand (`PRECISION-G.md`, seed 616, drawn from the printing files' stock):** **26 of 50 stand; 24 are false alarms**: bound to a house, a power or a chain 7, the record's own fact (founding 3, route 1, demand list 2) 6, negation 4, word sense 5 ("wards" as spells, "barrels" in a hook, "as ever" of the land, "paid", one well-fed person), a hypothetical 1, a racket's object 1. Arm 5's three exemptions remove 17 of the 24: the designed guard flags **33 of the 50, and 26 of the 33 stand (79%)**. The seven left are word-sense alarms, cured by narrowing the word, never by banking the line. **A guard built on the lexicon as it stands (52%) would teach builders to bank; built with arm 5 it holds the bar a walker must (CONTRIBUTING: an enforcement walker's register only shrinks).**

## 5 · THE CURE'S FORM, by class (proposed, not made)

| class | the ONE FACT the line should declare | owner by file (BAR5 seat where its section names the file) | display only or the record? |
|---|---|---|---|
| outside | `crisis: threat` family / `route:` / `imports` (law 5's: BAR5-MARKS's dependence) | MARKS (`institutionDescVariants`, `institutionServices`, `institutionalCatalog`), THINGS (`titleSecretsPresentations` is in no seat's list) | display (declare and twin the lines) |
| size | `tier: ≥ town` (a band per word) | WORLD (`cultureProfiles`, `narrativeData`), SAFETY (DS-DEF, `safetyProfile`), THINGS (DS-GEN) | display |
| office | the house atoms that exist (`court`, `watch`, `militia`, `garrison`, `patrol`) and a NEW legal-house atom (BAR5-THINGS' notary) | SAFETY (DS-DEF, `safetyProfile`), THINGS (`npcData`), POWERS (DS-POW) | display; a new atom is vocabulary (owner-vetoable) |
| goods | `trade at work: <good>` WIDENED (dairy, cloth, pottery, forge, herbs, spice) and `exports` | THINGS (`arrivalProse`, `tradeAtWork.js`) | display; the widened atom reads the record (no record moves) |
| resource | the resource's worked state (`resourceAnalysis`'s exploitation, `source spent`) | CHAINS (the gaps writer), FOOD (DS-ECO) | display |
| sovereign | `ruler: lord` (exists, read by no line) or a war or an occupation supplying the realm's crown (ruling LD1) | MARKS (`institutionServices`), POWERS (`rulingStructure`), WORLD (`historyData`) | display |
| plenty, ease, threat | the families `hunger` and `threat`, not one kind; and a NEW atom for a regional monster threat (F) | SAFETY (DS-DEF-11, DS-DEF-1), FOOD (DS-ECO-9), THINGS (`arrivalProse`) | display; the new atom is vocabulary |

Nothing here moves a stored record except the export and chain-output lists (outcome H), which are seat C's.

## 6 · THE OVERLAP WITH THE ROUND IN FLIGHT (`TABLES-G.md` T6)

Of the 1,154 undeclared lines in printing files, **637 sit in a file or an annex desk a BAR5 seat's section names** (MARKS 215, WORLD 126, SAFETY 99, THINGS 98, FOOD 43, POWERS 41, MAGIC 13, CHAINS 2) and **517 in files no BAR5 seat names** (`titleSecretsPresentations.js`, `demandProfile.js`, the war-and-faith and stressor desks, `spatialGenerator.js`, `settlementQuickGuide.js`, …). Within the named files the round's LAW 5 rows are law 5's six crisis classes: **204 of the 637 lines hold one; 456 hold a WIDENED class no BAR5 seat was asked to declare.** The round holds, by the chair's own estimate, the K2 and K4 rows named to it (the lord's dues, the vintner, the luxury quarter, the herbs); of this seat's 43 controls, those that sit on a BAR5 seat's named line or file: C42840 (MARKS by name), C0333, C5441, C0350, C3223, C5452, C43575 (MARKS's files), C42116 (SAFETY by name), C44306 (THINGS by name), C43925, C39734 (POWERS by name), C15780, C219863, C39804, C84094, C94460, C150831, C115374, C15951 (`arrivalProse.js`: THINGS's file), C154042, C26390, C205552, C85036, C146255, C3247 (DS-DEF: SAFETY's desk), C184150, C40276, C157891 (DS-ECO: FOOD's desk), C91256 (DS-POW: POWERS's), C161931, C217292 (DS-GEN: THINGS's), C209939, C113231 (`cultureProfiles.js`: WORLD's): **the round owns the FILES of 39 of the 43** (add C128237 in `rulingStructure.js`: POWERS; C17290 in `foodways.js` and C204663 in DS-ECO: FOOD; C158113, C171330, C37887 from the gaps writer: CHAINS; only the four export and chain-output lists, C86447, C86484, C39608, C88481, sit in files no seat names), **but its sections name the LINE of only 6** (C42840 the lord's dues, C42116 the known thief, C44306 the notary, C43925 and C39734 the military descriptions, C15951 the kilns), and the chair's estimate adds the herbs (C15780). The rest is the next wave's by rule.

## FOR THE OWNER, IN PLAIN WORDS

The town pages are written from about **6,200 stock sentences that name something a town might not have** (a street, a court, a lord, cloth on a cart, a calm road). About **1,150 of them, in 79 source files that really print on a town's page, say nothing about when they are allowed to be printed**; about 600 of those are true risks once the obvious false alarms are set aside, and about **550 of them already printed in the last 150 towns read**. That is why every read of thirty towns finds forty new false sentences: the stock is wide, and one sentence at a time cannot drain it.

**One rule clears most of it, but not by itself.** A build check that fails any sentence naming such a thing without saying when it may print would have stopped about a third of the false sentences the readers found. The other two thirds DID carry a condition, and the condition was wrong: "needs a market" on spice piled high under a siege; "only if not occupied" on a line printed under a siege; "village or bigger" on neighbourhoods in a village of 128. So the check must also test the condition's QUALITY (the right fact, the right size, every kind of crisis, not one), and the vocabulary needs two new facts (a frontier with monsters; how many members a council has).

**Refusing by default is affordable, with work first.** If the scene pools printed only sentences that are safe or properly conditioned, a besieged hamlet, a famine village and a thorp would still have something to say in nearly every pool, but six or seven of the trade-smell pools and three to five of the street-scene pools would fall below three sentences in some towns. Those pools are already thin today. Writing the "after" twin of each such sentence (as was done for many trade smells: 42 twins) comes before switching the default on.

## Points this seat could not settle, said once

- The 720 and the fresh 300 were not rendered (the brief has this seat render only for points 2 and 3); every count here is of the source, and "seen printed" is in the 150.
- The default-deny reach of a scene key and a memory key is not modelled (each counted as reached everywhere), so `ARRIVAL_SCENES.river`'s and the memory pools' mute counts overstate; the sense keys' reach is approximated.
- The `office` and `goods` lexicons were narrowed once by hand (bare "court", "clerk", "officials", "stone", "river", "festival" dropped as word-sense alarms); the precision above is after that narrowing and before arm 5's exemptions.
