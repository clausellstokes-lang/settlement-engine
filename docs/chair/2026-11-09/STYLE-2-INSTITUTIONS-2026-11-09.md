# STYLE-2-INSTITUTIONS — SW-2 · INSTITUTIONS-TEXT, the catalogue law applied (2026-11-09)

**Seat:** SW-2 of the second style wave, a child of the cloud chair (session `session_01FbPLbejcfwX5nii12VM673`). **Lane:** `lane/style-2-institutions-2026-11-09`, cut at `a7bc2e4ce` (the HEAD of `origin/lane/integration-2026-11-07`; `5b267578c` is an ancestor). **The law:** the owner's style law (WIRING-RULINGS-2026-11-07 §5 to §8), STYLE-RULINGS-2 ruling **A3, the catalogue law** (with A0, A9, A12), brief BRIEF-STYLE-2-WAVE §0 and §1 SW-2. **The worklist:** STYLE-AUDIT-2-SOURCES §2.1, the 80 rows on this manifest (`institutionalCatalog.js`'s rows are SW-7's and were not touched). Written 2026-11-09 from 01:3x UTC (`date`).

## 0. Outcome

- **80 of 80 rows done; 0 rows struck; 0 rows left.** 60 take the audit's NEW as drafted; **20 are AMENDED** under the census law (the audit's NEW added a fact, re-authored flavour beyond the minimal swap, kept a walker phrase, or tripped a validator). Every line is listed old → new in §2 for the owner's veto.
- **ONE cause, ONE commit:** "the catalogue law (A3): the institution identity text by minimal swaps". It moves the generator golden master and the espionage fence; it is an **UNSIGNED cause commit**. Nothing was re-recorded and nothing is signed here; the moved cells are listed in §5 for STYLE-2-MERGE.
- **The movement is these 80 swaps and nothing else (CONFIRMED, zero residue):** the 525 golden configurations and the 360 fence settlements generated at the base with only the 80 old → new string substitutions applied hash exactly to the tip (gm 0 of 525 residual; fence 0 of 360 residual).

## 1. The STOP and the files beyond the manifest (sent to the chair 01:1x UTC; the default taken)

- `institutionDescColour.js` is **not a byte copy**: it is a text-keyed declaration column (`DESC_VARIANT_COLOUR_DECLARATIONS`) whose keys must equal live variants. `tests/data/colourMarks4h.test.js` holds it equal to the CENSUS ledger `docs/census/declarations/institutionDescVariants.INSTITUTION_DESC_VARIANTS.json`; `tests/generators/institutionProseDeclared.test.js` holds `DESC_VARIANT_DECLARATIONS` and every service `desc` equal to the ledgers' `text`.
- **The default taken (the chair may veto):** in the same commit the `text` field of exactly the moved rows is re-keyed in the two ledgers: `institutionDescVariants.INSTITUTION_DESC_VARIANTS.json` 26 rows (22 colour, 1 declaring: `hamlet|Criminal|Smuggling waypoint#1`, 3 unmarked) and `institutionServices.INSTITUTION_SERVICES.json` 9 rows (1 declaring: `Palisade or earthworks|Gated entry`). Same `id`, same needs, excludes, crisis and colour verdict. A minimal swap adds no fact, so "presumes nothing" holds; each of the 22 colour lines was re-read for it. (The STOP message said 18 colour and 31 rows; the measured figures are 22 and 35, corrected here.) The colour column re-keys 22 keys; `DESC_VARIANT_DECLARATIONS` re-keys its one key (the smuggling waypoint).
- **The chair's ruling (received 01:39 UTC, sent 01:17): FIRST FIND THE LEDGERS' DOOR.** There is no deriving door. The ledgers are AUTHORED: their rows carry hand-read verdicts, and `docs/census/declarations/` names no emitter. The only scripts that touch them are `scripts/census/census4-extract-pools.mjs`, the phase-A extractor (it writes raw `{id,text}` pools to an out-dir and never writes the ledger), and `census4-validate-ledger.mjs`, the atom validator. The extractor is itself stale: it throws `RELATIONSHIP_STRENGTHS` at the base `a7bc2e4ce` and at the tip alike, so a re-run cannot serve as the proof. So the hand re-key stands, as the ruling provides. The coverage it proved was measured directly instead, with a scratch script over the live modules: every ledger row's `text` equals the live string at its `id`. That is 664 of 664 description rows and 976 of 978 service rows at the tip, the same as at the base. The two service rows that differ are the Mill's `Fulling cloth` and `Sawing timber`, the R-M rows `institutionProseDeclared` already exempts, unchanged. Both holding tests are green by cause.
- `supabase/functions/_shared/engineBundle.js` carries every one of these strings. It was **not touched**. It is named for STYLE-2-MERGE's one re-emit at the merged tip (the MERGE-CAR precedent `e55ea3d12`).

## 2. Every line, old → new (for the owner's veto)

`lit` means the OLD printed in the audit's 12 sample dossiers. "census re-read" says whether the audit's NEW was taken as drafted, or why it was amended.

### `src/data/institutionDescVariants.js` (26)

| line | lit | code | OLD | NEW (as committed) | census re-read |
|---|---|---|---|---|---|
| 30 | dark | machinery-leak | Every household works some 12-16 acres, enough to stay alive and no more. | Every household works just enough land to stay alive, and no more. | AMENDED: audit NEW doubled 'enough' ("just enough land, enough to"); one clause |
| 31 | dark | machinery-leak | Each family tills roughly 12-16 acres, all of it for the table. | Each family tills a small holding, all of it for the table. | audit's NEW taken |
| 58 | dark | machinery-leak | Services mean a 2-5km walk to the village house of worship. | Services mean a walk of a few miles to the village house of worship. | audit's NEW taken |
| 59 | dark | machinery-leak | The nearest house of worship is the village's, a 2-5km walk away for services. | The nearest house of worship is the village's, a walk of a few miles away for services. | audit's NEW taken |
| 79 | dark | retired-word | One head of household carries the settlement's voice by common habit rather than any appointment. Nobody named them to it; everybody defers to it anyway. | One head of household carries the settlement's voice by common habit, with no appointment behind it. Nobody named them to it; everybody defers to it anyway. | audit's NEW taken |
| 86 | lit | machinery-leak | A well or a spring, yielding at least 2-4 gallons a person each day. | A well or a spring, yielding at least a bucketful a person each day. | audit's NEW taken |
| 87 | lit | machinery-leak | Water from a well or spring, a bare 2-4 gallons per person daily. | Water from a well or spring, barely a bucketful per person each day. | audit's NEW taken |
| 95 | dark | retired-word | One fit adult musters from every household when the alarm is raised. Their arms are hunting bows, spears, and sharpened tools rather than a soldier's kit. | One fit adult musters from every household when the alarm is raised. Their arms are hunting bows, spears, and sharpened tools; no one has a soldier's kit. | AMENDED: audit NEW 'nobody has a soldier's kit' trips the defence-words battery (\bno\b does not read 'nobody': a false 'soldiers without a garrison' finding, thorp/crossroads #011); 'no one' is read as the denial |
| 202 | dark | machinery-leak | The nearest house of worship is the village's, a typical 2-5km off. | The nearest house of worship is the village's, usually a few miles off. | audit's NEW taken |
| 203 | lit | machinery-leak | None of its own; the village's lies a usual 2-5km away. | None of its own; the village's lies usually a few miles away. | audit's NEW taken |
| 207 | lit | retired-word | A gated ground at the settlement edge, tended household by household. Families lie in rows by house rather than by standing, which is custom here and not want. | A gated ground at the settlement edge, tended household by household. Families lie in rows by house, whatever their standing; that is custom here, not want. | AMENDED: audit NEW split into three sentences and added 'has nothing to do with'; kept the OLD's own two facts in one sentence |
| 219 | dark | retired-word | A single trusted figure runs things by common agreement rather than any office. The rulings are matters of sense, not procedure. | A single trusted figure runs things by common agreement, holding no office. The rulings are matters of sense, not procedure. | audit's NEW taken |
| 255 | dark | retired-word | Contraband moves through here, skirting the tolls and the customs checks. The hamlet takes its cut in goods rather than coin. | Contraband moves through here, skirting the tolls and the customs checks. The hamlet takes its cut in goods, not coin. | AMENDED: audit NEW 'never in coin' strengthens the fact; 'not coin' is the OLD's own |
| 522 | lit | retired-word | Held by royal charter. The town's chief economic engine. | Held by royal charter. The heart of the town's trade. | AMENDED: audit NEW 'Most of the town's buying and selling happens here' states a share the record does not hold; the plain fact 'chief economic engine' stands for, in the sibling's own register ('a principal source of the town's trade') |
| 526 | lit | machinery-leak | The central plaza where the weekly market and the fairs are held. Fifty to a hundred yards to a side. | The central plaza where the weekly market and the fairs are held. | audit's NEW taken |
| 527 | dark | machinery-leak | A broad open square, 50 to 100 yards across, given over to market days and fairs. | A broad open square given over to market days and fairs. | audit's NEW taken |
| 558 | lit | machinery-leak | Coordinates caravan assembly, departure times, and word of the roads. Merchants register cargo, take on guards, and pool ventures here. The town's forerunner to the city's Caravan masters' exchange. | Coordinates caravan assembly, departure times, and word of the roads. Merchants register cargo, take on guards, and pool ventures here. | audit's NEW taken |
| 559 | dark | machinery-leak | Where regional caravans are mustered, scheduled, and briefed on their routes. Traders enrol their goods, hire escorts, and strike joint ventures, on the scale that precedes a city's Caravan masters' exchange. | Where regional caravans are mustered, scheduled, and briefed on their routes. Traders enrol their goods, hire escorts, and strike joint ventures. | audit's NEW taken |
| 903 | lit | retired-word | Fortunes told by Deception rather than any real magic, for a few coins each. | Fortunes told by Deception, with no real magic in them, for a few coins each. | audit's NEW taken |
| 934 | dark | machinery-leak | The city-scale form: permanent offices where caravan masters, merchants, and armed escorts do business. It handles bonded freight, route intelligence, the assembly of armed convoys, and the settling of commercial disputes. | Permanent offices where caravan masters, merchants, and armed escorts do business. It handles bonded freight, route intelligence, the assembly of armed convoys, and the settling of commercial disputes. | audit's NEW taken |
| 974 | lit | machinery-leak | The guild scale of the listening trade. Correspondents kept on several roads, an archive that sets one report against another, and a fixed price for an answer in writing. Costly, and the only counter that grades a claim before selling it. | A guild house of the listening trade. Correspondents kept on several roads, an archive that sets one report against another, and a fixed price for an answer in writing. Costly, and the only counter that grades a claim before selling it. | audit's NEW taken |
| 1119 | lit | machinery-leak | Full-time keepers of order, numbering about 1% of the city. | Full-time keepers of order, about one for every hundred people in the city. | audit's NEW taken |
| 1174 | lit | machinery-leak | The covert guild scale. Brokers deal in knowledge by the piece, attach a grade to it, and will build a claim to order for a patron with the coin. It settles where the talk already runs thickest. | A covert guild. Brokers deal in knowledge by the piece, attach a grade to it, and will build a claim to order for a patron with the coin. It settles where the talk already runs thickest. | audit's NEW taken |
| 1182 | dark | machinery-leak | A lone hand or small cell, working below the level that would sustain an assassins guild. Work comes through criminal go-betweens: less dependable, but deniable. | A lone hand or small cell, in a place too small to keep an assassins guild. Work comes through criminal go-betweens: less dependable, but deniable. | audit's NEW taken |
| 1183 | dark | machinery-leak | One killer, or a handful, operating beneath the threshold an assassins guild would need. Contracts arrive by way of criminal intermediaries, less reliable and for that reason harder to trace back. | One killer, or a handful, in a place too small to keep an assassins guild. Contracts arrive by way of criminal intermediaries, less reliable and for that reason harder to trace back. | audit's NEW taken |
| 1211 | dark | retired-word | Servants made rather than born, if magic permits it. | Servants made, not born, if magic permits it. | AMENDED: audit NEW also swapped 'made'→'built' and 'if'→'where': not a needed swap |

### `src/domain/display/institutionVocabulary.js` (14)

| line | lit | code | OLD | NEW (as committed) | census re-read |
|---|---|---|---|---|---|
| 58 | dark | retired-word | Tellers of fortunes who trade in cold reading and showmanship rather than real divination. Cheap, convincing, and entirely mundane. | Tellers of fortunes who trade in cold reading and showmanship, with no real divination behind it. Cheap, convincing, and entirely mundane. | audit's NEW taken |
| 130 | dark | retired-word | A buyer of stolen goods known by face rather than name, through whom hot property moves without a word written down. | A buyer of stolen goods known by face but not by name, through whom hot property moves without a word written down. | audit's NEW taken |
| 148 | dark | machinery-leak | The guild form of the listening house, with paid correspondents on several roads and an archive that checks one road against another. The only counter in the city where a claim is graded before it is sold. | A guild house for news, with paid correspondents on several roads and an archive that checks one road against another. The only counter in the city where a claim is graded before it is sold. | audit's NEW taken |
| 159 | dark | retired-word | Part-time guards who walk the night and hold the gates. Keepers of order rather than a fighting force. | Part-time guards who walk the night and hold the gates. They keep order; they are not a fighting force. | audit's NEW taken |
| 177 | dark | retired-word | An occasional trading day held by habit rather than charter, on any flat ground that will hold a crowd. | An occasional trading day held by habit, with no charter, on any flat ground that will hold a crowd. | audit's NEW taken |
| 188 | dark | retired-word | A fortified overnight stop with stabling, water, and provisions, built for caravans and loaded wagons rather than comfort. | A fortified overnight stop with stabling, water, and provisions, built for caravans and loaded wagons, not for comfort. | audit's NEW taken |
| 208 | dark | machinery-leak | A post that assembles caravans, sets departures, and sells route intelligence. The town-scale forerunner of a city's caravan exchange. | A post that assembles caravans, sets departures, and sells route intelligence. | audit's NEW taken |
| 216 | dark | machinery-leak | Houses that lend, exchange coin, and issue letters of credit. Real banking, viable only at city scale. | Houses that lend, exchange coin, and issue letters of credit. Real banking, found only in cities. | audit's NEW taken |
| 248 | dark | machinery-leak | A formal school of music and performance, with an amphitheatre and dormitories, viable only in a large city. | A formal school of music and performance, with an amphitheatre and dormitories, found only in a large city. | audit's NEW taken |
| 261 | dark | retired-word | A single respected figure who acts as authority by acknowledgement rather than election. Decisions are practical, not formal. | A single respected figure who acts as authority because people accept it, not because anyone elected them. Decisions are practical, not formal. | AMENDED: audit NEW 'everyone accepts'/'voted' widened the OLD's 'acknowledgement'/'election' |
| 303 | dark | machinery-leak | The residence and workshop of a single wizard of real ability, viable only where a place is large enough to want one. | The residence and workshop of a single wizard of real ability, found only where a place is large enough to want one. | audit's NEW taken |
| 310 | dark | machinery-leak | A workshop that crafts magic items, viable only in a large and wealthy city. | A workshop that crafts magic items, found only in a large and wealthy city. | audit's NEW taken |
| 322 | dark | retired-word | A plot at the settlement edge where the dead are laid, kept by the households themselves rather than by any clergy. | A plot at the settlement edge where the dead are laid, kept by the households themselves, not by any clergy. | AMENDED: audit NEW 'with no clergy' says no clergy exist; the OLD says the clergy do not keep it |
| 330 | dark | machinery-leak | A bishop's seat and the mark of a major city, viable only where the population is large enough to sustain it. | A bishop's seat and the mark of a major city, found only where the population is large enough to sustain it. | AMENDED: only the ladder word 'viable' swapped; the audit's re-phrase of the rest is not needed |

### `src/data/institutionServices.js` (9)

| line | lit | code | OLD | NEW (as committed) | census re-read |
|---|---|---|---|---|---|
| 551 | dark | machinery-leak | Toll collected on goods sold. A percentage to the lord or municipality. | Toll collected on goods sold. A share goes to the lord or municipality. | audit's NEW taken |
| 656 | dark | mechanism-first | Process fish and meat using produced salt. Vertical integration of the salt operation. | Process fish and meat using the salt produced here. | AMENDED: audit NEW added 'cured on site at the works' (a place fact the definition does not hold); the jargon sentence leaves, the OLD's fact stays |
| 1116 | lit | machinery-leak | Near-instant magical message delivery to any node in the network. | Near-instant magical message delivery to any station on the network. | audit's NEW taken |
| 1135 | dark | retired-word | Teach reading, writing, and arithmetic. Often the only education available. | Teach reading, writing, and reckoning. Often the only education available. | audit's NEW taken |
| 1215 | lit | retired-word | Formal diplomatic relations with extraplanar entities and factions. | Formal diplomatic relations with extraplanar entities and powers. | audit's NEW taken |
| 1223 | dark | retired-word | Knowledge of other planes: geography, factions, and dangers. | Knowledge of other planes: geography, powers, and dangers. | audit's NEW taken |
| 1552 | dark | machinery-leak | Buy stolen items at 20-40% of value. No questions asked. | Buy stolen items for a fraction of their worth. No questions asked. | audit's NEW taken |
| 1589 | dark | retired-word | Controlled access through the perimeter. Strangers must state business. | Controlled access through the perimeter. Anyone entering must state their business. | audit's NEW taken |
| 1658 | dark | retired-word | A place where parties from rival factions can meet quietly. | A place where parties from rival powers can meet quietly. | audit's NEW taken |

### `src/data/spatialData.js` (15)

| line | lit | code | OLD | NEW (as committed) | census re-read |
|---|---|---|---|---|---|
| 91 | dark | machinery-leak | Multiple garrison facilities require city-scale population and military investment. | Multiple garrison facilities require a city's population and military investment. | audit's NEW taken |
| 109 | dark | machinery-leak | Complex multi-district water distribution requires metropolis-scale population and resources. | Complex multi-district water distribution requires the population and resources of a metropolis. | audit's NEW taken |
| 122 | dark | machinery-leak | A market square at village scale is the weekly market clearing. Town-scale gets a formal paved square with a royal charter. | In a village the market square is the cleared ground where the weekly market meets. A town gets a formal paved square with a royal charter. | audit's NEW taken |
| 132 | dark | machinery-leak | Multiple permanent market squares require city-scale trade volume. | Multiple permanent market squares require the trade of a city. | audit's NEW taken |
| 157 | dark | machinery-leak | Extreme specialization requires metropolis-scale trade volume. | Extreme specialization requires the trade of a metropolis. | audit's NEW taken |
| 167 | dark | disconnected | Global trade requires major trade infrastructure: port access or substantial overland networksstructure with banking. | Global trade requires major trade infrastructure: port access or substantial overland networks, with banking. | audit's NEW taken |
| 211 | dark | machinery-leak | An extensive network of them requires city-scale population. | An extensive network of them requires a city's population. | audit's NEW taken |
| 225 | dark | machinery-leak | Multiple religious houses require city-scale wealth and population. | Multiple religious houses require a city's wealth and population. | audit's NEW taken |
| 273 | dark | machinery-leak | Formal civic administration requires town-scale governance. | Formal civic administration begins at the size of a town. | audit's NEW taken |
| 296 | dark | machinery-leak | Vast prisons require metropolitan-scale criminal justice system. | Vast prisons require the courts and justice system of a metropolis. | audit's NEW taken |
| 315 | dark | machinery-leak | Every conceivable trade requires metropolis-scale population. | Every conceivable trade requires the population of a metropolis. | audit's NEW taken |
| 408 | dark | machinery-leak | Multiple competing criminal organizations require city-scale population. | Multiple competing criminal organizations require a city's population. | audit's NEW taken |
| 431 | dark | machinery-leak | Network-scale smuggling requires an established operation and storage infrastructure. Port access is a bonus but not required for overland networks. | A smuggling network grows from an established operation with places to store its goods. A port helps, but overland networks do without one. | audit's NEW taken |
| 445 | dark | machinery-leak | Competing guilds require metropolis-scale adventuring demand. | Competing guilds need the adventuring trade of a metropolis. | audit's NEW taken |
| 462 | dark | machinery-leak | A tower-dwelling wizard establishes their own supply chain at this scale. | A wizard who keeps a tower arranges their own supplies. | AMENDED: audit NEW added 'reagents' (a fact not held); 'supply chain at this scale' becomes the plain fact |

### `src/generators/servicesGenerator.js` (5)

| line | lit | code | OLD | NEW (as committed) | census re-read |
|---|---|---|---|---|---|
| 207 | dark | mannered | The guild adjudicates conflicts. Their judgment is final; resistance is inadvisable. | The guild adjudicates conflicts. Its judgment is final, and resisting it is unwise. | AMENDED: audit NEW 'those who resist it are made to regret it' adds a consequence the line does not state; 'inadvisable' becomes its plain word |
| 215 | dark | mannered | The organization decides what flows through here. Operators without authorization are removed. | The organization decides what flows through here. Anyone who moves goods without its leave is removed. | AMENDED: audit NEW 'driven out' re-states 'removed'; the OLD's verb kept |
| 234 | dark | mannered | Practitioners working outside guild oversight: cheaper, less traceable, and legally inadvisable. | Practitioners working outside guild oversight: cheaper, harder to trace, and against the law. | audit's NEW taken |
| 284 | dark | mannered | Establish a legitimate face for operations that benefit from appearing above board. | Establish a legitimate face for work that needs to look above board. | AMENDED: audit NEW changed the service's imperative form to a noun phrase; minimal swap of 'operations that benefit from appearing' |
| 355 | dark | machinery-leak | Move recovered goods, no questions: expect 30-50% of value. | Move recovered goods, no questions: expect a third to half of their value. | AMENDED: audit's quantity in words, the OLD's 'of value' kept |

### `src/generators/isolationGenerator.js` (5)

| line | lit | code | OLD | NEW (as committed) | census re-read |
|---|---|---|---|---|---|
| 26 | dark | machinery-leak,mechanism-first | A hedge wizard maintains the settlement's load-bearing magical transit. Local production and irregular tracks carry part of the burden, but the support plan falls short without their work. | A hedge wizard keeps the settlement's magical transit working. What the settlement makes for itself and what comes over the rough tracks cover part of its needs, but not enough without the wizard. | AMENDED: 'load-bearing' leaves; audit NEW's 'magical way in and out' re-authored 'magical transit' (plain already); 'it' made explicit |
| 27 | dark | machinery-leak,mechanism-first | A resident wizard maintains the settlement's load-bearing magical transit. Their role is civic, not merely commercial, because the city falls below its support requirement without it. | A resident wizard keeps the settlement's magical transit working. The work is a civic duty as well as a trade: without it the city cannot bring in what it needs. | AMENDED: audit NEW kept 'not merely' — a walker phrase (A10); stated plainly |
| 28 | dark | machinery-leak,mechanism-first | A tower of wizards maintains the settlement's load-bearing magical transit. Local systems carry much of the burden, but they cannot support the whole metropolis alone. | A tower of wizards keeps the settlement's magical transit working. The city's own works and roads bring in much of what it needs, but not enough for the whole metropolis. | AMENDED: audit NEW 'cannot keep the whole metropolis alone' kept the OLD's frame; plainer |
| 82 | dark | machinery-leak | ${infraName} provides load-bearing capacity where physical access is unreliable. | ${infraName} carries goods and people where the roads cannot be trusted. | audit's NEW taken |
| 89 | dark | machinery-leak | A permanent teleportation circle provides load-bearing capacity where physical access is unreliable. Local production and irregular routes still contribute, but cannot carry the settlement alone. | A permanent teleportation circle carries goods and people where the roads cannot be trusted. What the settlement makes and what comes over the rough routes still help, but cannot keep it alone. | AMENDED: audit NEW 'by the rough routes' → 'over' (the sibling's word); otherwise the audit's |

### `src/data/supplyChainData.js` (4)

| line | lit | code | OLD | NEW (as committed) | census re-read |
|---|---|---|---|---|---|
| 765 | lit | machinery-leak | Silk is not produced locally at any tier. Port cities control import; crossroads cities control inland distribution. | Silk is not produced locally anywhere. Port cities control import; crossroads cities control inland distribution. | audit's NEW taken |
| 1216 | lit | machinery-leak | Planar goods are extreme-value entrepôt items. Only metropolis-level settlements can support the infrastructure. | Planar goods are extreme-value entrepôt items. Only a metropolis can support the infrastructure. | audit's NEW taken |
| 1311 | dark | machinery-leak | Holy sites generate economic activity through pilgrim spending: effectively a non-trade income stream. | Holy sites bring in money through what pilgrims spend: income that does not depend on trade. | audit's NEW taken |
| 1413 | lit | machinery-leak | Smuggling is the dark entrepôt model. Goods that cannot be taxed or declared flow through criminal infrastructure. | Smuggling is the entrepôt trade run in the dark. Goods that cannot be taxed or declared flow through criminal networks. | audit's NEW taken |

### `src/generators/economy/tradeGoods.js` (1)

| line | lit | code | OLD | NEW (as committed) | census re-read |
|---|---|---|---|---|---|
| 143 | lit | machinery-leak | Transit duties, warehouse fees, and re-export premiums from goods passing through the crossroads position. | Transit duties, warehouse fees, and re-export premiums from goods passing through the crossroads. | audit's NEW taken |

### `src/generators/computeActiveChains.js` (1)

| line | lit | code | OLD | NEW (as committed) | census re-read |
|---|---|---|---|---|---|
| 351 | lit | machinery-leak | the mill toll captures any excess. Loss of mill access would break this chain. | the mill toll takes any surplus. Without the lord's mill, there would be no flour at all. | AMENDED: audit NEW 'If the lord shut the mill to them' adds an actor's act; the OLD says only 'loss of mill access' (the lord's mill is named earlier in the same note) |

## 3. The deltas (measured in a clean worktree at the parent `a7bc2e4ce`, and at this lane's working tree)

| cause | gm /525 | fence /360 | herald | prose /1,050 | witness | pdf |
|---|---|---|---|---|---|---|
| the catalogue law (A3): the institution identity text by minimal swaps | **369** | **282** | 0 | 0 | 0 | 0 |

- **gm:** the suite's own `hashFor` over `goldenCorpus()`; the base reproduces the committed manifest 525 of 525.
- **fence:** its FENCE 1 rows (`tier · route · seed · sha(stable(settlement))`). The base digest equals the pinned constant, so the 282 rows are the fence's own.
- **herald** (`heraldKnowledgeDeskGolden`), **witness** (`presetLightingWitness`) and **pdf** (`tests/pdf/goldenViewModel.test.js` and its snapshot) are green at the base and green at the tip. The PDF snapshot holds no description that moved, so nothing is re-keyed there.
- **prose:** `node scripts/prose-manifest-cells.mjs --out` at the base and at the tip gives byte-identical files (36,689,979 bytes each), so the delta is 0 of 1,050. The suite itself is **red at the base** (its drift arm 1,050 of 1,050, its provenance, refusal-2, mixed-audience and four-seeds arms). That red belongs to the base, not to this lane, and is byte-identical at the tip.
- **Pins:** no card pin, component test or PDF snapshot quotes any of the 80 OLD texts. A repo-wide grep of every OLD found only the ledgers, the colour column, the edge bundle, a design-doc mention, and one hand-written fixture in `tests/domain/display/publicSafe.test.js`. That fixture is not a pin of the catalogue text and is left as it is. **Nothing was loosened.**
- **`tests/domain/worldFactRederive.test.js` A7** reds at the tip with the same cause: a stride of 4 rows against the committed golden-master fixture. It falls when STYLE-2-MERGE re-records the master; it is not touched.

## 4. The referee (the 1,000; `soak-review.mjs --count 1000 --workers 4`, seeds `soak1k-0..999`)

| | before (base `a7bc2e4ce`) | after (this lane) |
|---|---|---|
| run | 1,000 settlements, 702 findings, 0 errors, CLIMB | 1,000 settlements, 702 findings, 0 errors, CLIMB |
| the twenty most-repeated frames (`repetition-prose.json` `top`, chrome dropped) | 439 · 367 · 306 · 306 · 297 · 293 · 263 · 260 · 232 · 225 · 225 · 208 · 206 · 203 · 203 · 199 · 199 · 195 · 195 · 194 | **identical: the same twenty frames, the same towns** (none from this manifest's files) |
| findings | 766 lines | **byte-identical once sorted** (no check moved) |
| `coh:tier-noun` | 0 findings on these lines; 273 `battery.tier-noun` record judgments | 0 on these lines; the same 273, seed for seed |
| this manifest's lines in the 60 sample dossiers | OLD printed 270 times in 50 towns | NEW printed 272 times in 50 towns; 31 distinct NEW lines print; **0 OLD left** |

**The walker's phrases (A10) in this manifest's string literals** (two or more words, comments blanked; the ten files, the colour column included), before → after:

| phrase | before | after | what remains |
|---|---|---|---|
| `rather than` | 20 | **0** | none |
| the retired word | 11 | 8 | labels and keys only: "Multiple criminal factions" (an institution name; vocabulary, services, spatial constant, descVariants keys), the service name "Faction information", `servicesGenerator`'s keyword `'criminal faction'`. All are SW-8's (A8: labels by the owner's map) |
| `not merely` | 3 | 2 | descVariants "Horses are changed here, not merely rested." and its colour key: a row the audit judged PASS (intake, §7) |
| `a stranger` / `strangers` | 0 / 1 | 0 / 0 | none |
| `arithmetic` | 1 | **0** | none |
| measurement-speak (`km`, gallons, acres, yards, `%` with a figure) | 22 | **0** | none |
| the ladder words (`*-scale`, "guild scale", "viable only") | 41 | 16 | rows the audit judged PASS: "A city-scale exchange…", "A city-scale yard…" (descVariants and colour), "Large-scale …", "District-scale …", "City-scale grain storage…" (services), five spatial reasons ("town-scale population", "City-scale civic administration", "Large-scale incarceration", "Colosseum-scale", "Large-scale illegal market"), "Viable only near flats or salt springs" (vocabulary; a fact, not the ladder). Intake, §7 |
| `the record` · `the ledger` · `the engine/simulator/simulation` · `per cent` · `the roster` | 0 | 0 | none |

## 5. The moved cells, for STYLE-2-MERGE's signing (nothing signed here)

The cause commit is `8b38ac2f3` (its parent `a7bc2e4ce`).

**Generator golden master: the 369 moved keys** (the suite's own `keyOf`):

```
city|arabic|coastal|port|civilized|golden-master-v3
city|arabic|desert|road|civilized|golden-master-v3
city|arabic|forest|isolated|civilized|golden-master-v3
city|arabic|hills|road|civilized|golden-master-v3
city|arabic|mountain|road|civilized|golden-master-v3
city|arabic|plains|road|civilized|golden-master-v3
city|arabic|riverside|river|civilized|golden-master-v3
city|celtic|coastal|port|civilized|golden-master-v3
city|celtic|desert|road|civilized|golden-master-v3
city|celtic|forest|isolated|civilized|golden-master-v3
city|celtic|hills|road|civilized|golden-master-v3
city|celtic|mountain|road|civilized|golden-master-v3
city|celtic|plains|road|civilized|golden-master-v3
city|celtic|riverside|river|civilized|golden-master-v3
city|east_asian|coastal|port|civilized|golden-master-v3
city|east_asian|desert|road|civilized|golden-master-v3
city|east_asian|forest|isolated|civilized|golden-master-v3
city|east_asian|hills|road|civilized|golden-master-v3
city|east_asian|mountain|road|civilized|golden-master-v3
city|east_asian|plains|road|civilized|golden-master-v3
city|east_asian|riverside|river|civilized|golden-master-v3
city|germanic|coastal|port|civilized|golden-master-v3
city|germanic|desert|road|civilized|golden-master-v3
city|germanic|forest|isolated|civilized|golden-master-v3
city|germanic|hills|road|civilized|golden-master-v3
city|germanic|mountain|road|civilized|golden-master-v3
city|germanic|plains|road|civilized|golden-master-v3
city|germanic|riverside|river|civilized|golden-master-v3
city|greek|coastal|port|civilized|golden-master-v3
city|greek|desert|road|civilized|golden-master-v3
city|greek|forest|isolated|civilized|golden-master-v3
city|greek|hills|road|civilized|golden-master-v3
city|greek|mountain|road|civilized|golden-master-v3
city|greek|plains|road|civilized|golden-master-v3
city|greek|riverside|river|civilized|golden-master-v3
city|latin|coastal|port|civilized|golden-master-v3
city|latin|desert|road|civilized|golden-master-v3
city|latin|forest|isolated|civilized|golden-master-v3
city|latin|hills|road|civilized|golden-master-v3
city|latin|mountain|road|civilized|golden-master-v3
city|latin|plains|road|civilized|golden-master-v3
city|latin|riverside|river|civilized|golden-master-v3
city|mediterranean|coastal|port|civilized|golden-master-v3
city|mediterranean|desert|road|civilized|golden-master-v3
city|mediterranean|forest|isolated|civilized|golden-master-v3
city|mediterranean|hills|road|civilized|golden-master-v3
city|mediterranean|mountain|road|civilized|golden-master-v3
city|mediterranean|plains|road|civilized|golden-master-v3
city|mediterranean|riverside|river|civilized|golden-master-v3
city|mesoamerican|coastal|port|civilized|golden-master-v3
city|mesoamerican|desert|road|civilized|golden-master-v3
city|mesoamerican|forest|isolated|civilized|golden-master-v3
city|mesoamerican|hills|road|civilized|golden-master-v3
city|mesoamerican|mountain|road|civilized|golden-master-v3
city|mesoamerican|plains|road|civilized|golden-master-v3
city|mesoamerican|riverside|river|civilized|golden-master-v3
city|norse|coastal|port|civilized|golden-master-v3
city|norse|desert|road|civilized|golden-master-v3
city|norse|forest|isolated|civilized|golden-master-v3
city|norse|hills|road|civilized|golden-master-v3
city|norse|mountain|road|civilized|golden-master-v3
city|norse|plains|road|civilized|golden-master-v3
city|norse|riverside|river|civilized|golden-master-v3
city|slavic|coastal|port|civilized|golden-master-v3
city|slavic|desert|road|civilized|golden-master-v3
city|slavic|forest|isolated|civilized|golden-master-v3
city|slavic|hills|road|civilized|golden-master-v3
city|slavic|mountain|road|civilized|golden-master-v3
city|slavic|plains|road|civilized|golden-master-v3
city|slavic|riverside|river|civilized|golden-master-v3
city|south_asian|coastal|port|civilized|golden-master-v3
city|south_asian|desert|road|civilized|golden-master-v3
city|south_asian|forest|isolated|civilized|golden-master-v3
city|south_asian|hills|road|civilized|golden-master-v3
city|south_asian|mountain|road|civilized|golden-master-v3
city|south_asian|plains|road|civilized|golden-master-v3
city|south_asian|riverside|river|civilized|golden-master-v3
city|steppe|coastal|port|civilized|golden-master-v3
city|steppe|desert|road|civilized|golden-master-v3
city|steppe|forest|isolated|civilized|golden-master-v3
city|steppe|hills|road|civilized|golden-master-v3
city|steppe|mountain|road|civilized|golden-master-v3
city|steppe|plains|road|civilized|golden-master-v3
city|steppe|riverside|river|civilized|golden-master-v3
hamlet|arabic|coastal|port|civilized|golden-master-v3
hamlet|arabic|desert|road|civilized|golden-master-v3
hamlet|arabic|forest|isolated|civilized|golden-master-v3
hamlet|arabic|hills|road|civilized|golden-master-v3
hamlet|arabic|mountain|road|civilized|golden-master-v3
hamlet|arabic|plains|road|civilized|golden-master-v3
hamlet|arabic|riverside|river|civilized|golden-master-v3
hamlet|celtic|coastal|port|civilized|golden-master-v3
hamlet|celtic|desert|road|civilized|golden-master-v3
hamlet|celtic|forest|isolated|civilized|golden-master-v3
hamlet|celtic|hills|road|civilized|golden-master-v3
hamlet|celtic|mountain|road|civilized|golden-master-v3
hamlet|celtic|plains|road|civilized|golden-master-v3
hamlet|celtic|riverside|river|civilized|golden-master-v3
hamlet|east_asian|coastal|port|civilized|golden-master-v3
hamlet|east_asian|desert|road|civilized|golden-master-v3
hamlet|east_asian|forest|isolated|civilized|golden-master-v3
hamlet|east_asian|hills|road|civilized|golden-master-v3
hamlet|east_asian|mountain|road|civilized|golden-master-v3
hamlet|east_asian|plains|road|civilized|golden-master-v3
hamlet|east_asian|riverside|river|civilized|golden-master-v3
hamlet|germanic|coastal|port|civilized|golden-master-v3
hamlet|germanic|desert|road|civilized|golden-master-v3
hamlet|germanic|forest|isolated|civilized|golden-master-v3
hamlet|germanic|hills|road|civilized|golden-master-v3
hamlet|germanic|mountain|road|civilized|golden-master-v3
hamlet|germanic|plains|road|civilized|golden-master-v3
hamlet|germanic|riverside|river|civilized|golden-master-v3
hamlet|greek|coastal|port|civilized|golden-master-v3
hamlet|greek|desert|road|civilized|golden-master-v3
hamlet|greek|forest|isolated|civilized|golden-master-v3
hamlet|greek|hills|road|civilized|golden-master-v3
hamlet|greek|mountain|road|civilized|golden-master-v3
hamlet|greek|plains|road|civilized|golden-master-v3
hamlet|greek|riverside|river|civilized|golden-master-v3
hamlet|latin|coastal|port|civilized|golden-master-v3
hamlet|latin|desert|road|civilized|golden-master-v3
hamlet|latin|forest|isolated|civilized|golden-master-v3
hamlet|latin|hills|road|civilized|golden-master-v3
hamlet|latin|mountain|road|civilized|golden-master-v3
hamlet|latin|plains|road|civilized|golden-master-v3
hamlet|latin|riverside|river|civilized|golden-master-v3
hamlet|mediterranean|coastal|port|civilized|golden-master-v3
hamlet|mediterranean|desert|road|civilized|golden-master-v3
hamlet|mediterranean|forest|isolated|civilized|golden-master-v3
hamlet|mediterranean|hills|road|civilized|golden-master-v3
hamlet|mediterranean|mountain|road|civilized|golden-master-v3
hamlet|mediterranean|plains|road|civilized|golden-master-v3
hamlet|mediterranean|riverside|river|civilized|golden-master-v3
hamlet|mesoamerican|coastal|port|civilized|golden-master-v3
hamlet|mesoamerican|desert|road|civilized|golden-master-v3
hamlet|mesoamerican|forest|isolated|civilized|golden-master-v3
hamlet|mesoamerican|hills|road|civilized|golden-master-v3
hamlet|mesoamerican|mountain|road|civilized|golden-master-v3
hamlet|mesoamerican|plains|road|civilized|golden-master-v3
hamlet|mesoamerican|riverside|river|civilized|golden-master-v3
hamlet|norse|coastal|port|civilized|golden-master-v3
hamlet|norse|desert|road|civilized|golden-master-v3
hamlet|norse|forest|isolated|civilized|golden-master-v3
hamlet|norse|hills|road|civilized|golden-master-v3
hamlet|norse|mountain|road|civilized|golden-master-v3
hamlet|norse|plains|road|civilized|golden-master-v3
hamlet|norse|riverside|river|civilized|golden-master-v3
hamlet|slavic|coastal|port|civilized|golden-master-v3
hamlet|slavic|desert|road|civilized|golden-master-v3
hamlet|slavic|forest|isolated|civilized|golden-master-v3
hamlet|slavic|hills|road|civilized|golden-master-v3
hamlet|slavic|mountain|road|civilized|golden-master-v3
hamlet|slavic|plains|road|civilized|golden-master-v3
hamlet|slavic|riverside|river|civilized|golden-master-v3
hamlet|south_asian|coastal|port|civilized|golden-master-v3
hamlet|south_asian|desert|road|civilized|golden-master-v3
hamlet|south_asian|forest|isolated|civilized|golden-master-v3
hamlet|south_asian|hills|road|civilized|golden-master-v3
hamlet|south_asian|mountain|road|civilized|golden-master-v3
hamlet|south_asian|plains|road|civilized|golden-master-v3
hamlet|south_asian|riverside|river|civilized|golden-master-v3
hamlet|steppe|coastal|port|civilized|golden-master-v3
hamlet|steppe|desert|road|civilized|golden-master-v3
hamlet|steppe|forest|isolated|civilized|golden-master-v3
hamlet|steppe|hills|road|civilized|golden-master-v3
hamlet|steppe|mountain|road|civilized|golden-master-v3
hamlet|steppe|plains|road|civilized|golden-master-v3
hamlet|steppe|riverside|river|civilized|golden-master-v3
metropolis|arabic|coastal|port|civilized|golden-master-v3
metropolis|arabic|desert|road|civilized|golden-master-v3
metropolis|arabic|forest|isolated|civilized|golden-master-v3
metropolis|arabic|hills|road|civilized|golden-master-v3
metropolis|arabic|mountain|road|civilized|golden-master-v3
metropolis|arabic|plains|road|civilized|golden-master-v3
metropolis|arabic|riverside|river|civilized|golden-master-v3
metropolis|celtic|coastal|port|civilized|golden-master-v3
metropolis|celtic|desert|road|civilized|golden-master-v3
metropolis|celtic|forest|isolated|civilized|golden-master-v3
metropolis|celtic|hills|road|civilized|golden-master-v3
metropolis|celtic|mountain|road|civilized|golden-master-v3
metropolis|celtic|plains|road|civilized|golden-master-v3
metropolis|celtic|riverside|river|civilized|golden-master-v3
metropolis|east_asian|coastal|port|civilized|golden-master-v3
metropolis|east_asian|desert|road|civilized|golden-master-v3
metropolis|east_asian|forest|isolated|civilized|golden-master-v3
metropolis|east_asian|hills|road|civilized|golden-master-v3
metropolis|east_asian|mountain|road|civilized|golden-master-v3
metropolis|east_asian|plains|road|civilized|golden-master-v3
metropolis|east_asian|riverside|river|civilized|golden-master-v3
metropolis|germanic|coastal|port|civilized|golden-master-v3
metropolis|germanic|desert|road|civilized|golden-master-v3
metropolis|germanic|forest|isolated|civilized|golden-master-v3
metropolis|germanic|hills|road|civilized|golden-master-v3
metropolis|germanic|mountain|road|civilized|golden-master-v3
metropolis|germanic|plains|road|civilized|golden-master-v3
metropolis|germanic|riverside|river|civilized|golden-master-v3
metropolis|greek|coastal|port|civilized|golden-master-v3
metropolis|greek|desert|road|civilized|golden-master-v3
metropolis|greek|forest|isolated|civilized|golden-master-v3
metropolis|greek|hills|road|civilized|golden-master-v3
metropolis|greek|mountain|road|civilized|golden-master-v3
metropolis|greek|plains|road|civilized|golden-master-v3
metropolis|greek|riverside|river|civilized|golden-master-v3
metropolis|latin|coastal|port|civilized|golden-master-v3
metropolis|latin|desert|road|civilized|golden-master-v3
metropolis|latin|forest|isolated|civilized|golden-master-v3
metropolis|latin|hills|road|civilized|golden-master-v3
metropolis|latin|mountain|road|civilized|golden-master-v3
metropolis|latin|plains|road|civilized|golden-master-v3
metropolis|latin|riverside|river|civilized|golden-master-v3
metropolis|mediterranean|coastal|port|civilized|golden-master-v3
metropolis|mediterranean|desert|road|civilized|golden-master-v3
metropolis|mediterranean|forest|isolated|civilized|golden-master-v3
metropolis|mediterranean|hills|road|civilized|golden-master-v3
metropolis|mediterranean|mountain|road|civilized|golden-master-v3
metropolis|mediterranean|plains|road|civilized|golden-master-v3
metropolis|mediterranean|riverside|river|civilized|golden-master-v3
metropolis|mesoamerican|coastal|port|civilized|golden-master-v3
metropolis|mesoamerican|desert|road|civilized|golden-master-v3
metropolis|mesoamerican|forest|isolated|civilized|golden-master-v3
metropolis|mesoamerican|hills|road|civilized|golden-master-v3
metropolis|mesoamerican|mountain|road|civilized|golden-master-v3
metropolis|mesoamerican|plains|road|civilized|golden-master-v3
metropolis|mesoamerican|riverside|river|civilized|golden-master-v3
metropolis|norse|coastal|port|civilized|golden-master-v3
metropolis|norse|desert|road|civilized|golden-master-v3
metropolis|norse|forest|isolated|civilized|golden-master-v3
metropolis|norse|hills|road|civilized|golden-master-v3
metropolis|norse|mountain|road|civilized|golden-master-v3
metropolis|norse|plains|road|civilized|golden-master-v3
metropolis|norse|riverside|river|civilized|golden-master-v3
metropolis|slavic|coastal|port|civilized|golden-master-v3
metropolis|slavic|desert|road|civilized|golden-master-v3
metropolis|slavic|forest|isolated|civilized|golden-master-v3
metropolis|slavic|hills|road|civilized|golden-master-v3
metropolis|slavic|mountain|road|civilized|golden-master-v3
metropolis|slavic|plains|road|civilized|golden-master-v3
metropolis|slavic|riverside|river|civilized|golden-master-v3
metropolis|south_asian|coastal|port|civilized|golden-master-v3
metropolis|south_asian|desert|road|civilized|golden-master-v3
metropolis|south_asian|forest|isolated|civilized|golden-master-v3
metropolis|south_asian|hills|road|civilized|golden-master-v3
metropolis|south_asian|mountain|road|civilized|golden-master-v3
metropolis|south_asian|plains|road|civilized|golden-master-v3
metropolis|south_asian|riverside|river|civilized|golden-master-v3
metropolis|steppe|coastal|port|civilized|golden-master-v3
metropolis|steppe|desert|road|civilized|golden-master-v3
metropolis|steppe|forest|isolated|civilized|golden-master-v3
metropolis|steppe|hills|road|civilized|golden-master-v3
metropolis|steppe|mountain|road|civilized|golden-master-v3
metropolis|steppe|plains|road|civilized|golden-master-v3
metropolis|steppe|riverside|river|civilized|golden-master-v3
thorp|arabic|riverside|river|civilized|golden-master-v3
thorp|celtic|riverside|river|civilized|golden-master-v3
thorp|east_asian|riverside|river|civilized|golden-master-v3
thorp|germanic|riverside|river|civilized|golden-master-v3
thorp|greek|riverside|river|civilized|golden-master-v3
thorp|latin|riverside|river|civilized|golden-master-v3
thorp|mediterranean|riverside|river|civilized|golden-master-v3
thorp|mesoamerican|riverside|river|civilized|golden-master-v3
thorp|norse|riverside|river|civilized|golden-master-v3
thorp|slavic|riverside|river|civilized|golden-master-v3
thorp|south_asian|riverside|river|civilized|golden-master-v3
thorp|steppe|riverside|river|civilized|golden-master-v3
town|arabic|coastal|port|civilized|golden-master-v3
town|arabic|desert|road|civilized|golden-master-v3
town|arabic|forest|isolated|civilized|golden-master-v3
town|arabic|hills|road|civilized|golden-master-v3
town|arabic|mountain|road|civilized|golden-master-v3
town|arabic|plains|road|civilized|golden-master-v3
town|arabic|riverside|river|civilized|golden-master-v3
town|celtic|coastal|port|civilized|golden-master-v3
town|celtic|desert|road|civilized|golden-master-v3
town|celtic|forest|isolated|civilized|golden-master-v3
town|celtic|hills|road|civilized|golden-master-v3
town|celtic|mountain|road|civilized|golden-master-v3
town|celtic|plains|road|civilized|golden-master-v3
town|celtic|riverside|river|civilized|golden-master-v3
town|east_asian|coastal|port|civilized|golden-master-v3
town|east_asian|desert|road|civilized|golden-master-v3
town|east_asian|forest|isolated|civilized|golden-master-v3
town|east_asian|hills|road|civilized|golden-master-v3
town|east_asian|mountain|road|civilized|golden-master-v3
town|east_asian|plains|road|civilized|golden-master-v3
town|east_asian|riverside|river|civilized|golden-master-v3
town|germanic|auto|random_trade|civilized|gm-seed-a
town|germanic|auto|random_trade|civilized|gm-seed-b
town|germanic|auto|random_trade|civilized|gm-seed-c
town|germanic|auto|random_trade|civilized|golden-master-v3
town|germanic|coastal|port|civilized|golden-master-v3
town|germanic|desert|road|civilized|golden-master-v3
town|germanic|forest|isolated|civilized|golden-master-v3
town|germanic|hills|road|civilized|golden-master-v3
town|germanic|mountain|mountain_pass|civilized|golden-master-v3
town|germanic|mountain|random_trade|civilized|gm-seed-a
town|germanic|mountain|random_trade|civilized|gm-seed-b
town|germanic|mountain|random_trade|civilized|gm-seed-c
town|germanic|mountain|random_trade|civilized|golden-master-v3
town|germanic|mountain|road|civilized|golden-master-v3
town|germanic|plains|crossroads|civilized|golden-master-v3
town|germanic|plains|isolated|civilized|golden-master-v3
town|germanic|plains|mountain_pass|civilized|golden-master-v3
town|germanic|plains|none|civilized|golden-master-v3
town|germanic|plains|port|civilized|golden-master-v3
town|germanic|plains|river|civilized|golden-master-v3
town|germanic|plains|road|civilized|gm-seed-a
town|germanic|plains|road|civilized|gm-seed-b
town|germanic|plains|road|civilized|gm-seed-c
town|germanic|plains|road|civilized|golden-master-v3
town|germanic|plains|road|frontier|golden-master-v3
town|germanic|plains|road|plagued|golden-master-v3
town|germanic|plains|road|safe|golden-master-v3
town|germanic|riverside|river|civilized|golden-master-v3
town|greek|coastal|port|civilized|golden-master-v3
town|greek|desert|road|civilized|golden-master-v3
town|greek|forest|isolated|civilized|golden-master-v3
town|greek|hills|road|civilized|golden-master-v3
town|greek|mountain|road|civilized|golden-master-v3
town|greek|plains|road|civilized|golden-master-v3
town|greek|riverside|river|civilized|golden-master-v3
town|latin|coastal|port|civilized|golden-master-v3
town|latin|desert|road|civilized|golden-master-v3
town|latin|forest|isolated|civilized|golden-master-v3
town|latin|hills|road|civilized|golden-master-v3
town|latin|mountain|road|civilized|golden-master-v3
town|latin|plains|road|civilized|golden-master-v3
town|latin|riverside|river|civilized|golden-master-v3
town|mediterranean|coastal|port|civilized|golden-master-v3
town|mediterranean|desert|road|civilized|golden-master-v3
town|mediterranean|forest|isolated|civilized|golden-master-v3
town|mediterranean|hills|road|civilized|golden-master-v3
town|mediterranean|mountain|road|civilized|golden-master-v3
town|mediterranean|plains|road|civilized|golden-master-v3
town|mediterranean|riverside|river|civilized|golden-master-v3
town|mesoamerican|coastal|port|civilized|golden-master-v3
town|mesoamerican|desert|road|civilized|golden-master-v3
town|mesoamerican|forest|isolated|civilized|golden-master-v3
town|mesoamerican|hills|road|civilized|golden-master-v3
town|mesoamerican|mountain|road|civilized|golden-master-v3
town|mesoamerican|plains|road|civilized|golden-master-v3
town|mesoamerican|riverside|river|civilized|golden-master-v3
town|norse|coastal|port|civilized|golden-master-v3
town|norse|desert|road|civilized|golden-master-v3
town|norse|forest|isolated|civilized|golden-master-v3
town|norse|hills|road|civilized|golden-master-v3
town|norse|mountain|road|civilized|golden-master-v3
town|norse|plains|road|civilized|golden-master-v3
town|norse|riverside|river|civilized|golden-master-v3
town|slavic|coastal|port|civilized|golden-master-v3
town|slavic|desert|road|civilized|golden-master-v3
town|slavic|forest|isolated|civilized|golden-master-v3
town|slavic|hills|road|civilized|golden-master-v3
town|slavic|mountain|road|civilized|golden-master-v3
town|slavic|plains|road|civilized|golden-master-v3
town|slavic|riverside|river|civilized|golden-master-v3
town|south_asian|coastal|port|civilized|golden-master-v3
town|south_asian|desert|road|civilized|golden-master-v3
town|south_asian|forest|isolated|civilized|golden-master-v3
town|south_asian|hills|road|civilized|golden-master-v3
town|south_asian|mountain|road|civilized|golden-master-v3
town|south_asian|plains|road|civilized|golden-master-v3
town|south_asian|riverside|river|civilized|golden-master-v3
town|steppe|coastal|port|civilized|golden-master-v3
town|steppe|desert|road|civilized|golden-master-v3
town|steppe|forest|isolated|civilized|golden-master-v3
town|steppe|hills|road|civilized|golden-master-v3
town|steppe|mountain|road|civilized|golden-master-v3
town|steppe|plains|road|civilized|golden-master-v3
town|steppe|riverside|river|civilized|golden-master-v3
```

**Espionage fence: the 282 moved FENCE 1 rows** (seed suffix `SUBw4-fence1-<tier>-<route>-NNN`):

- city/crossroads (15): #000 #001 #002 #003 #004 #005 #006 #007 #008 #009 #010 #011 #012 #013 #014
- city/isolated (8): #000 #001 #002 #004 #005 #009 #012 #013
- city/port (15): #000 #001 #002 #003 #004 #005 #006 #007 #008 #009 #010 #011 #012 #013 #014
- city/road (8): #002 #006 #007 #009 #010 #011 #013 #014
- hamlet/crossroads (15): #000 #001 #002 #003 #004 #005 #006 #007 #008 #009 #010 #011 #012 #013 #014
- hamlet/isolated (13): #000 #001 #002 #004 #005 #006 #007 #008 #009 #010 #012 #013 #014
- hamlet/port (12): #000 #002 #003 #004 #005 #007 #008 #009 #010 #011 #013 #014
- hamlet/road (12): #000 #004 #005 #006 #007 #008 #009 #010 #011 #012 #013 #014
- metropolis/crossroads (15): #000 #001 #002 #003 #004 #005 #006 #007 #008 #009 #010 #011 #012 #013 #014
- metropolis/isolated (10): #000 #001 #002 #003 #004 #005 #008 #011 #013 #014
- metropolis/port (15): #000 #001 #002 #003 #004 #005 #006 #007 #008 #009 #010 #011 #012 #013 #014
- metropolis/road (9): #000 #001 #006 #007 #008 #009 #010 #011 #012
- thorp/crossroads (15): #000 #001 #002 #003 #004 #005 #006 #007 #008 #009 #010 #011 #012 #013 #014
- thorp/isolated (15): #000 #001 #002 #003 #004 #005 #006 #007 #008 #009 #010 #011 #012 #013 #014
- thorp/port (14): #000 #001 #002 #003 #004 #005 #006 #008 #009 #010 #011 #012 #013 #014
- thorp/road (15): #000 #001 #002 #003 #004 #005 #006 #007 #008 #009 #010 #011 #012 #013 #014
- town/crossroads (15): #000 #001 #002 #003 #004 #005 #006 #007 #008 #009 #010 #011 #012 #013 #014
- town/isolated (14): #000 #001 #002 #003 #004 #005 #006 #007 #008 #010 #011 #012 #013 #014
- town/port (13): #000 #001 #003 #004 #005 #006 #007 #008 #009 #010 #011 #012 #013
- town/road (13): #000 #001 #002 #003 #004 #005 #006 #007 #008 #009 #010 #012 #013
- village/crossroads (15): #000 #001 #002 #003 #004 #005 #006 #007 #008 #009 #010 #011 #012 #013 #014
- village/port (3): #002 #003 #010
- village/road (3): #003 #008 #014

Fence corpus digest: base `fe0dde0e158b7d0075dd9f0c58517800665467fc040fc3c502ef3a96c012096c` (equal to the pinned `PRE_COUPLING_CORPUS_SHA`), tip `15e3eb5e43526a175d05a55ce119d556b162e39acb1981a0a121a158bf656286`.

## 6. Gates (each read through its own exit; the output kept in scratch)

- **The governing suites** (the 95 test files that name a changed module or ledger; vitest collected 91): 1,325 passed, 5 failed, 42 skipped. Of the 5, **3 are red at the base** and byte-identical at the tip: `layerBoundaries` (the dependency-cycle set), and `proseWiringCensus.walker` (the dry read; the committed census stamp). **2 are this cause's unsigned shift:** `generatorGoldenMaster` (369) and `worldFactRederive` A7 (the same fixture). The espionage fence (282) reds at the tip with the same cause. `colourMarks4h`, `institutionProseDeclared`, `census4Ledger.walker`, `dossierContent`, `defenceTwinLines`, `villageWatchRow`, `tierNounPoolDraws`, `tierNounKeptRulings` and `institutionDescDraw` are green.
- **The three record walkers** through `sh scripts/gate-tail.sh` (the results are at the end of this file).
- **The edge bundle** (`engineBundleReplay`) goes stale with any `src/` edit and is named for the merge seat's re-emit (§1).

## 7. Noticed (the intake rule; for the chair to place, none is SW-2's to take)

- **PASS rows still carrying walker phrases or ladder words** (§4's "what remains"): the "not merely rested" variant, the two "A city-scale …" variants (with their colour keys and ledger rows), the services' "Large-scale" / "District-scale" / "City-scale" descriptions, and five spatial reasons. They are on the walker's baseline; the merge seat's downward re-measure or a later lane takes them.
- **`spatialData` "Multiple adventurers' guilds"** gates at `minTier: "city"`, but its reason says the trade "of a metropolis" (the OLD said "metropolis-scale"). The swap kept the OLD's fact. The mismatch between the gate and its reason is a data question, not a style question.
- **The defence-words battery reads "no" but not "nobody"** (`DENIAL_BEFORE`). The audit's NEW for the household levy ("nobody has a soldier's kit") raised a false "soldiers without a garrison" finding in a thorp (fence row thorp/crossroads #011). The line was amended to "no one". Any style lane that writes "nobody" or "none" before a defence term will meet the same narrow reading, which the battery's own header says is deliberate.

## 8. CONFIRMED against PLAUSIBLE

**CONFIRMED** (executed): the 80 swaps at their rows; the ledger and column re-keys (both holding tests green); zero residue on gm (0 of 525) and on the fence (0 of 360); the six deltas; the referee's frames, findings and tier-noun figures; the walker-phrase counts. **PLAUSIBLE** (judgment): that each amended line keeps exactly the OLD's facts, and that each of the 60 audit NEWs taken adds none. Each was re-read against its OLD and its sibling variant; the owner's veto is the check. The large data files (`institutionDescVariants.js`, `institutionServices.js`, `supplyChainData.js`, `computeActiveChains.js`) were read by their headers and by the region around every row and its sibling variants, not end to end. The small files were read whole.

## What stays

Nothing on this lane's 80 rows. §7 lists what was noticed beyond them.

## The record walkers (at the commit's tree, through `sh scripts/gate-tail.sh`, exit 1)

`npx vitest run tests/lint/sourceCitationIntegrity.walker.test.js tests/lint/ledgerCitationIntegrity.test.js tests/lint/testRatchet.test.js`: **110 passed, 1 failed.** `ledgerCitationIntegrity` is green, with the local branch ref `review-fixes-2026-07-08` set at `origin/review-fixes-2026-07-08` (235efce1a). `testRatchet` is green. The one red is the roster's **`tree` arm: 147 against the frozen 139.** It reads 147 at the base `a7bc2e4ce` as well, measured in the clean worktree: MERGE-WAVE's shift records from 9288badee on, the base's own red, **not touched**. The roster's `dated` arm reads **169**, equal to this lane's bump (168 → 169, this record).
