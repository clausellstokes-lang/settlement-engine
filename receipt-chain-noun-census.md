# receipt-chain-noun-census.md — lane CHAIN-NOUN-CENSUS

**Lane** CHAIN-NOUN-CENSUS (Opus 5, read-only measurer for the Fable 5.1 chair)
**Dock** `$SC/laneDESKINT` at `7ef501df9` — clean, unmodified, no vitest run, no product edit.
**Working files** `$SC/chainnoun/` (rows.json · labels.json · seams.json · proposals.json · validation.json · table.md)
**Method** every figure below is produced by a node script importing the tree's OWN modules
(`supplyChainData.js`, the six `*.generated.js` corpora, `scripts/lib/dossier-slot-shapes.mjs`) and,
for the seam validation, by re-executing the projection contract test's detector regexes
verbatim in a scratch script. No test runner was invoked.

---

## 0. HEADLINE — THREE OF THE CHAIR'S PREMISES ARE OFF, AND ONE OF THEM CHANGES THE TABLE'S SIZE

| premise in the brief | measured | source line |
|---|---|---|
| "74 category headings" | **75** distinct values reach `{chain}` | `src/data/supplyChainData.js` — 74 `chain.label` rows **plus one** `labelsByResource` override |
| "38 seams" | **38** — CONFIRMED, exactly | 38 variants across 4 blocks, enumerated below |
| "83/301 visibly wrong" | the figure is REAL but it is **not a `{chain}` figure** and it understates this slot badly | `$SC/receipt-docket-2.md:186-215` |
| §0c-5's "35 article/demonstrative + 3 possessive" | **34 + 4** — `its {chain}` is a possessive determiner, counted on the wrong side | measured over the 38 seams |
| §0c-5's example list `Grain & Bread`, **`Raw Materials & Fuel`**, `Salt & Preservation` | the middle one is a **NEED heading**, not a chain label; it is not in the denominator | `supplyChainData.js:190` is `SUPPLY_CHAIN_NEEDS.raw_materials.label` |

⛔ **The 75th value.** `computeActiveChains.js:360-363` writes
`const label = chain.labelsByResource?.[resourceInputKey] || chain.label;`
so the override at `supplyChainData.js:334` (`precious_metals_mining.labelsByResource.gemstone_deposits
= 'Gem Mining & Lapidary'`) is a reachable `{chain}` value that is **not** any chain's `label`.
DOCKET-2 enumerated `chain.label` only and reported 74; §0c-5 already carries **75** and is right.
The cross-check is exact: DOCKET-2 reports "51 of 74 use '&'" and "71 of 74 keep an interior capital";
I measure **52 of 75** and **72 of 75** — the difference is that one row, which carries an ampersand.
**A table authored to 74 rows fails the totality arm on the gemstone branch.**

---

## 1. THE DENOMINATOR

### 1a. The producer chain, traced

```
src/data/supplyChainData.js  SUPPLY_CHAIN_NEEDS[need].chains[].label          (74 rows)
                             SUPPLY_CHAIN_NEEDS[need].chains[].labelsByResource[rk]  (1 row)
   ↓ re-exported            src/data/goods/chains.js:72
   ↓ read                   src/generators/computeActiveChains.js:360-363   ← THE MINT
   ↓ pushed                  computeActiveChains.js:365-371  activeChains.push({ … label … })
   ↓ stored                  settlement.economicState.activeChains[]  (src/domain/settlement.schema.js:648)
   ↓ read by the corpus      DS-ECO-5 / DS-SUP-1 / DS-SUP-2  ("`economicState.activeChains[]{…}`")
```

`computeActiveChains.js:365` is the **sole** `activeChains.push` in `src/` (verified by grep over the
whole tree). Nothing mutates `.label` afterwards: `chainMagicSubstitution.js` contains no `label`
assignment at all. So the vocabulary is **CLOSED at 75** — a static-data vocabulary, exhaustible.

⚠ **`economicState.customChains` is a DIFFERENT field** (`settlement.schema.js:649`, written at
`src/generators/steps/economyReconcilePass.js:328`) and carries DM-authored labels. It is an OPEN
vocabulary. `{chain}` is declared over `activeChains[]`, not over `customChains`, and **the table
stays total only while that holds.** If a desk is ever pointed at `customChains`, the totality arm
becomes unprovable in the same commit.

### 1b. The 75 values, the 38 seams, and the pool keys

**Seams naming `{chain}`: 38 of 2,266 variants across all six desks** — measured by walking every
`pools[key][]` entry in the six `*.generated.js` files and testing `slots.includes('chain') ||
text.includes('{chain}')`. Both tests agree on all 38 (no variant names the slot in text without
declaring it, or vice versa).

| block | seams | pool keys |
|---|---|---|
| **DS-ECO-5** (Economics › Economic Flows chain cards) | **14** | IMPAIRED (canonical scarce), with a named dependency · VULNERABLE (canonical strained) · RUNNING (canonical stable): draw only with the note fields empty (R-DST-F) · MAGICALLY SUSTAINED: a small prop (low magicRecovery) · MAGICALLY SUSTAINED: a large prop (high magicRecovery) |
| **DS-SUP-1** | **5** | UPSTREAM LINK COVERED BY AN IMPORT · ENTREPÔT PASS-THROUGH (no workshop in the line) · BLOCKED: nothing can be got away |
| **DS-SUP-2** (LADDER › canonical supply-chain status) | **18** | STABLE · STRAINED · SCARCE · BLOCKED · CAPTURED · SUBSTITUTED · COLLAPSING |
| **DS-ECO-11** (Resources › the ground and its workings) | **1** | EXPLOITATION: partiallyExploited |
| | **38** | **16 distinct pool keys** |

⛔⛔ **THE 38TH SEAM HAS NO PRODUCER AND A CHAIN_NOUN TABLE CANNOT LIGHT IT.**
DS-ECO-11's one `{chain}` variant is *"The {chain} between {resource} and {good} is begun and not
finished here; what stands between the two is one {institution} the town does not have."* — and
DS-ECO-11 is the **only one of the four blocks that is MOUNTED** (`dossierMounts.js:431`,
`resources.groundAndWorkings`). Its lens is fed by `leadingExploitation(analysis)`
(`economyStateProse.js:745-766`), whose rows come from `resourceAnalysis.exploitation[bucket][]`,
written at `resourceGenerator.js:432` from **`RESOURCE_CHAINS`** — a *second, different* chain
vocabulary of **23 rows that carry no `label` field at all** (fields: `rawResource, processingTags,
processingInstitutions, intermediateGoods, finalProducts, exportValue, dependsOn`). The desk's
exploitation slot bag (`economyStateProse.js:978-983`) therefore supplies `resource`, `good` and
`institution` and **nothing that could fill `{chain}`**. Filling it from `rawResource` would render
*"The timber between timber and cloth…"* — the R-DST-ROLE defect the same file's own comment at
:972-977 exists to refuse. **So CHAIN_NOUN lights 37 seams, not 38**, and the 38th needs either a
re-authored variant (the chair's words) or a chain identity minted onto the exploitation row (a
producer change, and therefore a golden shift — see §4).

⛔ **AND THE OTHER 37 ARE ALL ON UNMOUNTED BLOCKS.** `UNMOUNTED_BLOCKS`
(`dossierMounts.js:483-489`) contains `DS-ECO-5`, `DS-SUP-1` and `DS-SUP-2`. So **the CHAIN_NOUN
table, landed alone, puts zero sentences in front of a reader.** It is necessary and not sufficient;
the second act is mounting those three blocks, which moves the shrink-only darkness ratchet
(live `UNMOUNTED_BLOCKS.length` = **15**, committed baseline `tests/lint/.dossier-mounts-baseline.json`
= **64**, so three mounts fall inside the ratchet and need no refreeze).

### 1c. The rendered sample "at this tip"

**At this tip every one of the 75 renders NOTHING.** `bareCommonFill` (`economyStateProse.js:273-281`)
returns `undefined` for a capitalised value, and no desk supplies a `chain` key at all — so under
anchored liveness all 38 variants are ineligible on every world. The sample column in §3 is
therefore the *counterfactual*: what the raw heading WOULD render if admitted, beside what the
proposal renders.

---

## 2. THE CASING / GRAMMAR CLASSIFICATION

### 2a. The predicate, measured (the table §0c-5's `{good}` half has, for `{chain}`)

`fillShapeViolation('bare-common', label)` over all 75:

| | refused | rule |
|---|---|---|
| as shipped | **75 of 75** | `COMMON-FILL-IS-CAPITALISED` — and nothing else. Zero determiner, dash, digit, engine-token or sentence-break refusals. |
| after a per-word lowercase | **0 of 75** | — |
| lowercase collisions created | **0** | (contrast `{good}`, where the same transform merges 11 pairs) |

### 2b. ⛔⛔ AND THE PREDICATE PASSING IS THE TRAP, PROVEN AGAINST THE TREE'S OWN WALKER

I rendered the naive per-word-lowercased headings into all 38 seams and ran the projection
contract test's four detector families verbatim (`ADJACENT-DETERMINERS`, `DOUBLED-WORD`,
the fill-anchored `DETERMINER-RUN`, and `DASH/DIGIT/RESIDUAL-SLOT-IN-FILL` —
`tests/data/dossierStateProseProjection.contract.test.js:93-111,147-177`):

```
lowercased-heading renders: 2850   detector failures: 0
```

**Zero.** The ampersand is invisible to every detector the estate owns, and `fillShapeViolation`
admits it. A wiring lane that lowercased the 75 headings would ship *"The raw materials & fuel is
running below what it should"* with a **fully green gate**. This is the assertion-that-cannot-fail
family in its exact shape, and it is a stronger statement than DOCKET-2's (which caught the
first-letter-only transform); the per-word transform §0c-5 contemplates is *also* unconvictable.

### 2c. The three classes

| class | count | roster |
|---|---|---|
| **reads correctly after "the" as-is** (lowercase only) | **5** | `River Mill Industry` · `Camel Caravan Trade` · `Planar Trade` · `Black market` · `Forced Labour Economy` |
| **AMBIGUOUS** — grammatical after a determiner, but reads as an activity or an analyst's category rather than a line of supply | **4** | `River Fishing` · `Floodplain Agriculture` · `Food Processing` · `Strategic Crossroads Toll` |
| **needs a NOUN REWRITE** | **66** | everything else |

The 66 decompose by the defect that survives lowercasing:

| defect | count | why the seam refuses it |
|---|---|---|
| ampersand conjunction (`Grain & Bread`) | 52 | an `&` in a reader's sentence; §0c-3's *"the Highly diversified — …"* defect in a smaller hat |
| the word `and` joining two heads (`Alpine Wool and Dairy`) | 6 | same coordination problem, spelled out |
| **plural head noun** (`Fortifications`, `Mercenary Forces`, `Luxury Goods`, `Spellcasting Services`) | 4 | ⭐ **NEW — §0c-5 did not measure this.** The seams are singular throughout: *"The {chain} **is** running"*, *"The {chain} **runs**"*, *"Nobody talks about the {chain}. **It** works"*. This is the `{resource}` number defect (`singularBareCommonFill`, `economyStateProse.js:311-315`) reaching a second slot. **16 of the 75 labels end in a plural word** overall. |
| singular, no conjunction, still not a supply line (`Mountain Timber`, `Mountain Pass Control`, `Standing Garrison`, `Organised Crime`) | 4 | *"The standing garrison is running below what it should"* names troops, not a line; *"Everything on the standing garrison"* is not English |

### 2d. Does "83/301 visibly wrong" hold?

**It holds as DOCKET-2 defined it, and it is not about this slot.** `$SC/receipt-docket-2.md:186-192`
shows 301 = **74 `{chain}` + 30 `{resource}` + 197 `{good}`** — the three casing-class slots pooled —
and 83 is the count still visibly wrong after a **first-letter-only** lowercase
(`value[0].toLowerCase() + value.slice(1)`), which leaves every interior capital standing.
It is therefore neither a `{chain}` denominator (that is 75, not 74, and not 301) nor a measurement
of the transform §0c-5 actually contemplates.

**Re-measured for `{chain}` alone, under the per-word transform: 66 of 75 headings (88%) still read
wrong** — against 83/301 (27.6%) — because what survives a per-word lowercase is not casing at all.
It is that a category heading is not a singular common-noun phrase. Any reading of "83/301" as
"most of them are fine" is **REFUTED**.

---

## 3. THE PROPOSED NOUN TABLE — A DRAFT COLUMN, NOT A RULING

Constraints applied to every row: bare-common (no article), lowercase, digit-free, no em/en dash,
no engine token, **singular head noun** (§2c), setting-agnostic, and injective (75 distinct values).
`fillShapeViolation('bare-common', …)`: **0 violations over all 75.**
Cross-product render (75 × 38 = **2,850** sentences) through the contract test's detectors:
**0 mechanical defects.** The failures below are ones I found by READING, which is the only
instrument that catches them.

**⚠ THE `X` COLUMN — the one seam my draft fails.** DS-SUP-2 · COLLAPSING · street is the corpus's
only GENITIVE on the fill: *"People are leaving the {chain}'s trades."* A `trade`-headed noun
renders *"People are leaving the **fur trade's trades**."* **22 of my 75 proposals are trade-headed and fail that one seam** — and two of those 22
(`camel caravan trade`, `planar trade`) are trade-headed because the PRODUCER HEADING already is,
so no re-heading can save them. Two exits, both the chair's: re-head those 24 (`line` / `run` / `traffic`),
or re-author that single variant (*"People are leaving those trades."*). **I recommend the second** —
one sentence against twenty-two nouns, and it is the only exit for the two headings that carry
"Trade" in the producer string.

**⚠ A weaker note on the other side.** 48 of 75 proposals are `line`-headed (47 after the revision), and DS-SUP-2 · STABLE ·
ledger already opens *"The line holds."* → *"The line holds. Every input the grain line needs is
present."* Repetitive, not wrong; no detector sees it; the chair may want a second head word.

**⚠ Two proposals read weakly in two seams** and are marked in the notes: `fortification supply` and
`parish supply` in DS-ECO-5 · VULNERABLE · street (*"The people working the fortification supply…"*)
and DS-SUP-2 · SUBSTITUTED · threshold (*"What holds the parish supply up…"*).

**⚠ `Alpine Wool and Dairy`** — I proposed `upland wool and dairy line` rather than keeping
"alpine", which is an Earth-place derivation and the brief asks for setting-agnostic.
**⚠ `Weapons & Armor`** — the label is US-spelled; my draft says `weapon and armour line`. The
corpus's own spelling convention is the chair's call.

| # | producer heading | supplyChainData.js | need category | class | **proposed noun (draft)** | fails genitive seam | counterfactual: the raw heading in a real seam |
|---|---|---|---|---|---|---|---|
| 1 | `Grain & Bread` | :19 | Food Security | NOUN REWRITE | grain line |  | The grain & bread is running below what it should. |
| 2 | `Livestock & Dairy` | :33 | Food Security | NOUN REWRITE | livestock and dairy line |  | The livestock & dairy is running below what it should. |
| 3 | `Salt & Preservation` | :63 | Food Security | NOUN REWRITE | salt and curing line |  | The salt & preservation is running below what it should. |
| 4 | `Foraging & Smallholding` | :79 | Food Security | NOUN REWRITE | foraging and smallholding line |  | The foraging & smallholding is running below what it should. |
| 5 | `Fishing & Seafood` | :96 | Food Security | NOUN REWRITE | seafood line |  | The fishing & seafood is running below what it should. |
| 6 | `River Fishing` | :123 | Food Security | AMBIGUOUS | river fishery |  | The river fishing is running below what it should. |
| 7 | `Hunting & Trapping` | :138 | Food Security | NOUN REWRITE | hunting and trapping line |  | The hunting & trapping is running below what it should. |
| 8 | `Brewing & Malting` | :151 | Food Security | NOUN REWRITE | brewing and malting line |  | The brewing & malting is running below what it should. |
| 9 | `Horse & Animal Trade` | :164 | Food Security | NOUN REWRITE | horse and stock trade | X | The horse & animal trade is running below what it should. |
| 10 | `Timber & Lumber` | :196 | Raw Materials & Fuel | NOUN REWRITE | lumber line |  | The timber & lumber is running below what it should. |
| 11 | `Iron & Metalwork` | :217 | Raw Materials & Fuel | NOUN REWRITE | iron and metalwork line |  | The iron & metalwork is running below what it should. |
| 12 | `Stone & Construction` | :230 | Raw Materials & Fuel | NOUN REWRITE | stone and building line |  | The stone & construction is running below what it should. |
| 13 | `Fuel & Heating` | :243 | Raw Materials & Fuel | NOUN REWRITE | fuel and firewood line |  | The fuel & heating is running below what it should. |
| 14 | `Clay & Ceramics` | :256 | Raw Materials & Fuel | NOUN REWRITE | clay and pottery line |  | The clay & ceramics is running below what it should. |
| 15 | `Smelting & Refining` | :270 | Raw Materials & Fuel | NOUN REWRITE | smelting line |  | The smelting & refining is running below what it should. |
| 16 | `Reed & Marsh Harvest` | :282 | Raw Materials & Fuel | NOUN REWRITE | reed and marsh line |  | The reed & marsh harvest is running below what it should. |
| 17 | `Boatbuilding & River Transport` | :306 | Raw Materials & Fuel | NOUN REWRITE | boatbuilding and river line |  | The boatbuilding & river transport is running below what it should. |
| 18 | `Mining & Coinage` | :319 | Raw Materials & Fuel | NOUN REWRITE | mining and coinage line |  | The mining & coinage is running below what it should. |
| 19 | `Gem Mining & Lapidary` | :334 | Raw Materials & Fuel | NOUN REWRITE | gem mining and lapidary line |  | The gem mining & lapidary is running below what it should. |
| 20 | `Mining & Quarrying` | :343 | Raw Materials & Fuel | NOUN REWRITE | mining and quarrying line |  | The mining & quarrying is running below what it should. |
| 21 | `Harbour and Maritime` | :366 | Raw Materials & Fuel | NOUN REWRITE | harbour trade | X | The harbour and maritime is running below what it should. |
| 22 | `Shipbuilding and Timber` | :378 | Raw Materials & Fuel | NOUN REWRITE | shipbuilding line |  | The shipbuilding and timber is running below what it should. |
| 23 | `River Mill Industry` | :390 | Raw Materials & Fuel | LOWERCASE-ONLY | river mill industry |  | The river mill industry is running below what it should. |
| 24 | `Floodplain Agriculture` | :402 | Raw Materials & Fuel | AMBIGUOUS | floodplain farming line |  | The floodplain agriculture is running below what it should. |
| 25 | `Mountain Timber` | :414 | Raw Materials & Fuel | NOUN REWRITE | mountain lumber line |  | The mountain timber is running below what it should. |
| 26 | `Alpine Wool and Dairy` | :426 | Raw Materials & Fuel | NOUN REWRITE | upland wool and dairy line |  | The alpine wool and dairy is running below what it should. |
| 27 | `Oasis Water and Agriculture` | :438 | Raw Materials & Fuel | NOUN REWRITE | oasis water and farming line |  | The oasis water and agriculture is running below what it should. |
| 28 | `Date Palms and Orchards` | :450 | Raw Materials & Fuel | NOUN REWRITE | orchard line |  | The date palms and orchards is running below what it should. |
| 29 | `Desert Glass and Sand` | :471 | Raw Materials & Fuel | NOUN REWRITE | desert glass line |  | The desert glass and sand is running below what it should. |
| 30 | `Textiles & Cloth` | :492 | Manufacturing & Crafts | NOUN REWRITE | cloth and weaving line |  | The textiles & cloth is running below what it should. |
| 31 | `Leather & Hides` | :514 | Manufacturing & Crafts | NOUN REWRITE | leather and hide line |  | The leather & hides is running below what it should. |
| 32 | `Food Processing` | :531 | Manufacturing & Crafts | AMBIGUOUS | food processing line |  | The food processing is running below what it should. |
| 33 | `Weapons & Armor` | :546 | Manufacturing & Crafts | NOUN REWRITE | weapon and armour line |  | The weapons & armor is running below what it should. |
| 34 | `Luxury Goods` | :560 | Manufacturing & Crafts | NOUN REWRITE | luxury goods line |  | The luxury goods is running below what it should. |
| 35 | `Glass & Print` | :585 | Manufacturing & Crafts | NOUN REWRITE | glass and printing line |  | The glass & print is running below what it should. |
| 36 | `Bowyer & fletcher` | :598 | Manufacturing & Crafts | NOUN REWRITE | bow and fletching line |  | The bowyer & fletcher is running below what it should. |
| 37 | `Cloth Finishing & Clothing` | :611 | Manufacturing & Crafts | NOUN REWRITE | cloth finishing line |  | The cloth finishing & clothing is running below what it should. |
| 38 | `Leatherworking & Cordwaining` | :628 | Manufacturing & Crafts | NOUN REWRITE | leatherworking line |  | The leatherworking & cordwaining is running below what it should. |
| 39 | `Pottery & Brickmaking` | :642 | Manufacturing & Crafts | NOUN REWRITE | pottery and brick line |  | The pottery & brickmaking is running below what it should. |
| 40 | `Beekeeping & Wax` | :654 | Manufacturing & Crafts | NOUN REWRITE | beekeeping and wax line |  | The beekeeping & wax is running below what it should. |
| 41 | `Spices & Dyes` | :679 | Trade & Entrepôt | NOUN REWRITE | spice and dye trade | X | The spices & dyes is running below what it should. |
| 42 | `Silk & Luxury Textiles` | :698 | Trade & Entrepôt | NOUN REWRITE | silk and fine cloth trade | X | The silk & luxury textiles is running below what it should. |
| 43 | `Letters of Credit & Finance` | :718 | Trade & Entrepôt | NOUN REWRITE | credit and lending trade | X | The letters of credit & finance is running below what it should. |
| 44 | `Storage & Logistics` | :736 | Trade & Entrepôt | NOUN REWRITE | warehouse and carting trade | X | The storage & logistics is running below what it should. |
| 45 | `Furs & Pelts` | :752 | Trade & Entrepôt | NOUN REWRITE | fur trade | X | The furs & pelts is running below what it should. |
| 46 | `Wine & Spirits` | :767 | Trade & Entrepôt | NOUN REWRITE | wine and spirit trade | X | The wine & spirits is running below what it should. |
| 47 | `Caravan & Overland Trade` | :783 | Trade & Entrepôt | NOUN REWRITE | overland caravan trade | X | The caravan & overland trade is running below what it should. |
| 48 | `Strategic Crossroads Toll` | :807 | Trade & Entrepôt | AMBIGUOUS | crossroads toll trade | X | The strategic crossroads toll is running below what it should. |
| 49 | `Camel Caravan Trade` | :820 | Trade & Entrepôt | LOWERCASE-ONLY | camel caravan trade | X | The camel caravan trade is running below what it should. |
| 50 | `Mountain Pass Control` | :833 | Trade & Entrepôt | NOUN REWRITE | mountain pass trade | X | The mountain pass control is running below what it should. |
| 51 | `Standing Garrison` | :855 | Defense & Security | NOUN REWRITE | garrison supply line |  | The standing garrison is running below what it should. |
| 52 | `Fortifications` | :875 | Defense & Security | NOUN REWRITE | fortification supply |  | The fortifications is running below what it should. |
| 53 | `Mercenary Forces` | :894 | Defense & Security | NOUN REWRITE | mercenary hire trade | X | The mercenary forces is running below what it should. |
| 54 | `Adventuring & Escort` | :907 | Defense & Security | NOUN REWRITE | escort and adventuring trade | X | The adventuring & escort is running below what it should. |
| 55 | `Herbalism & Remedies` | :934 | Healing & Medicine | NOUN REWRITE | herb and remedy line |  | The herbalism & remedies is running below what it should. |
| 56 | `Hospital & Surgery` | :957 | Healing & Medicine | NOUN REWRITE | hospital and surgery line |  | The hospital & surgery is running below what it should. |
| 57 | `Divine & Magical Healing` | :979 | Healing & Medicine | NOUN REWRITE | divine and magical healing line |  | The divine & magical healing is running below what it should. |
| 58 | `Maps & Cartography` | :1010 | Knowledge & Information | NOUN REWRITE | mapmaking line |  | The maps & cartography is running below what it should. |
| 59 | `Scholarship & Publishing` | :1023 | Knowledge & Information | NOUN REWRITE | scholarship and printing line |  | The scholarship & publishing is running below what it should. |
| 60 | `Intelligence & Communications` | :1037 | Knowledge & Information | NOUN REWRITE | courier and intelligence line |  | The intelligence & communications is running below what it should. |
| 61 | `News & Public Information` | :1054 | Knowledge & Information | NOUN REWRITE | news line |  | The news & public information is running below what it should. |
| 62 | `Alchemy & Reagents` | :1075 | Arcane & Magical | NOUN REWRITE | alchemy and reagent line |  | The alchemy & reagents is running below what it should. |
| 63 | `Spellcasting Services` | :1090 | Arcane & Magical | NOUN REWRITE | spellcasting trade | X | The spellcasting services is running below what it should. |
| 64 | `Magical Items & Enchanting` | :1110 | Arcane & Magical | NOUN REWRITE | enchanting line |  | The magical items & enchanting is running below what it should. |
| 65 | `Planar Trade` | :1138 | Arcane & Magical | LOWERCASE-ONLY | planar trade | X | The planar trade is running below what it should. |
| 66 | `Parish & Faith` | :1170 | Religion & Civic | NOUN REWRITE | parish supply |  | The parish & faith is running below what it should. |
| 67 | `Law & Governance` | :1205 | Religion & Civic | NOUN REWRITE | law and governance line |  | The law & governance is running below what it should. |
| 68 | `Pilgrimage & Holy Sites` | :1229 | Religion & Civic | NOUN REWRITE | pilgrim trade | X | The pilgrimage & holy sites is running below what it should. |
| 69 | `Taverns & Social Life` | :1260 | Entertainment & Culture | NOUN REWRITE | tavern trade | X | The taverns & social life is running below what it should. |
| 70 | `Performance & Theater` | :1284 | Entertainment & Culture | NOUN REWRITE | playhouse trade | X | The performance & theater is running below what it should. |
| 71 | `Gambling & Arena` | :1301 | Entertainment & Culture | NOUN REWRITE | gambling and arena trade | X | The gambling & arena is running below what it should. |
| 72 | `Smuggling & Contraband` | :1323 | Criminal Economy | NOUN REWRITE | smuggling trade | X | The smuggling & contraband is running below what it should. |
| 73 | `Black market` | :1348 | Criminal Economy | LOWERCASE-ONLY | black market |  | The black market is running below what it should. |
| 74 | `Organised Crime` | :1371 | Criminal Economy | NOUN REWRITE | organised crime trade | X | The organised crime is running below what it should. |
| 75 | `Forced Labour Economy` | :1393 | Criminal Economy | LOWERCASE-ONLY | forced labour economy |  | The forced labour economy is running below what it should. |

### 3a. The four most awkward seams, and the stress renders

| # | seam | the demand it places on the fill |
|---|---|---|
| A | DS-SUP-2 · COLLAPSING · street — *"People are leaving the {chain}'s trades."* | **genitive on the fill**; kills every `trade`-headed noun |
| B | DS-SUP-2 · CAPTURED · street — *"Everything on the {chain} goes through the same hands now…"* | **locative** *on the X*; needs a line/route, not an institution |
| C | DS-ECO-5 · VULNERABLE · street — *"The people working the {chain} are not idle…"* | the fill must be **workable by people** |
| D | DS-ECO-5 · RUNNING · street — *"Nobody talks about the {chain}. It works, it has worked…"* | **singular pronoun `it` + singular verbs** — the number constraint §2c found |
| E | DS-SUP-2 · STABLE · ledger — *"The line holds. Every input the {chain} needs is present…"* | the seam **already says "line"**; a `line`-headed fill repeats |
| F | DS-SUP-2 · SUBSTITUTED · threshold — *"What holds the {chain} up is a working, not a road."* | *holds X up* wants a structure, not an abstraction |

Executed stress renders (`$SC/chainnoun/`):

```
A  People are leaving the planar trade's trades.              ← FAIL (trade's trades)
A  People are leaving the black-market trade's trades.        ← FAIL
A  People are leaving the grain line's trades.                ← ok
B  Everything on the grain line goes through the same hands now, …           ← ok
B  Everything on the fortification supply goes through the same hands now, … ← weak
C  The people working the parish supply are not idle and are not comfortable. ← weak
C  The people working the grain line are not idle and are not comfortable.    ← ok
D  Nobody talks about the grain line. It works, it has worked, …              ← ok
E  The line holds. Every input the grain line needs is present, …             ← repetitive
F  What holds the parish supply up is a working, not a road.                  ← weak
```

---

## 4. THE WIRING SHAPE — MEASURED, NOT DESIGNED

### 4a. Where the table lives

`src/domain/display/stateProse/economyStateProse.js`, beside `ACCESS_NOUN` (:172-178) and
`COMPLEXITY_NOUN` (:211-223), declared in `SLOT_FILL_TABLES` (:252-255):

```js
export const SLOT_FILL_TABLES = Object.freeze({
  access: ACCESS_NOUN,
  complexity: COMPLEXITY_NOUN,
  chain: CHAIN_NOUN,          // ← the new row
});
```

This is exactly what §0c-5 already ruled (`RECEIPT_POOLS_DOSSIER_STATE.md:308-312`) and the
mechanism enforces it: `tests/data/dossierStateProseProjection.contract.test.js:418-505` walks the
**filesystem** of `src/domain/display/stateProse/`, treats every exported string map as a candidate
fill table, and reds unless it is either declared in `SLOT_FILL_TABLES` against a slot the annex
registers or listed by name in `NOT_A_FILL_TABLE`. **An undeclared `CHAIN_NOUN` export is a red,
not a silence.** The annex already registers `{chain}` as `bare-common`
(`RECEIPT_POOLS_DOSSIER_STATE.md:176`), and `SLOT_FILL_SHAPES` (`economyStateProse.js:236-244`)
already carries the mirror row — **no annex or mirror edit is needed.**

### 4b. Does a slot-shape contract test assert totality over the producer vocabulary?

**Not generically — totality is per-table and hand-built, and `COMPLEXITY_NOUN`'s is the model.**
`tests/domain/economyStateProseDesk.test.js:907-956` holds four arms:

| arm | what it asserts | the CHAIN_NOUN analogue |
|---|---|---|
| TOTAL FORWARD | every value the producer can emit has a fill | exhaust `SUPPLY_CHAIN_NEEDS` for `chain.label` ∪ `labelsByResource[*]` → **75**, every one keyed |
| TOTAL BACKWARD | every authored phrase has a producer value behind it | no orphan rows |
| INJECTIVE | no two producer values share a phrase | 75 distinct (my draft is injective) |
| SHAPE | `fillShapeViolation` against the ANNEX's shape, not the desk's mirror | already 0/75 for the draft |

⛔ The forward arm must exhaust the **data**, not a transcribed list — and it must read
`labelsByResource` as well as `label`, or it goes green on 74 and the gemstone branch renders
silence on a live page. That single omission is what produced the brief's "74".

⚠ **The desk must not import the generator.** `COMPLEXITY_NOUN` keys off `labelBands.js`'s
`COMPLEXITY_LABEL` precisely so the display leaf never reaches into `src/generators`
(`economyStateProse.js:191-203`). `SUPPLY_CHAIN_NEEDS` lives in `src/data/supplyChainData.js`
(re-exported by `src/data/goods/chains.js`) — a **data** leaf, not a generator — so keying
`CHAIN_NOUN` off it directly is consistent with that rule. But it is a ~60 KB table
(`computeActiveChains.js:12-17` calls it "~60 KB" and deliberately keeps it off the first-paint
closure); **importing it into a desk that rides a tab chunk is a bundle question the chair should
size before the lane wires it.** Transcribing the 75 keys as literals avoids the import and
re-creates the duplicated-constant hazard `COMPLEXITY_NOUN`'s docblock names. That trade-off is a
real fork and is the one design decision this census cannot settle for you.

### 4c. Which tests pin the current `{chain}` fill

**None.** `grep -c chain` over `tests/domain/economyStateProseDesk.test.js` and
`tests/data/dossierStateProseProjection.contract.test.js` returns **0** in both. The slot is dark by
absence, not by assertion — so nothing has to be unpinned, and nothing currently green will red.

### 4d. Which registers move

| register | authority | moves? |
|---|---|---|
| the cross-product render walker | `dossierStateProseProjection.contract.test.js:506-530`, `expect(renders).toBeGreaterThanOrEqual(35)` | **YES, upward, inside a floor.** Current renders = **90** (5 ACCESS × 7 `{access}` seams + 11 COMPLEXITY × 5 `{complexity}` seams). With CHAIN_NOUN: **2,940** (+2,850). A floor assertion, so **no refreeze** — it just does 2,850 more renders. |
| prose-numerics ceiling | `tests/lint/proseNumerics.test.js` + `.prose-numerics-baseline.json` | **NO.** It scans for engine float/scalar notation in authored prose; a digit-free noun table adds no row. |
| writer-reach ratchet | `tests/lint/writerReach.walker.test.js` | **NO.** It asks whether a *generated fact* reaches a customer surface. `activeChains[].label` is already read by `src/components/new/tabHelpers.js:77` and `src/pdf/lib/viewModel.js`. No new generated key. |
| dossier mount darkness | `tests/lint/dossierMountRegistry.walker.test.js:555-571`, `tests/lint/.dossier-mounts-baseline.json` | **NO for the table alone** (live 15 ≤ committed 64). **YES if the same car mounts DS-ECO-5/DS-SUP-1/DS-SUP-2** — it falls to 12, which the shrink-only ratchet accepts without refreeze. |
| generator goldens | `tests/property/generatorGoldenMaster.test.js` (`sha256(JSON.stringify(settlement))`) | **NO for the table.** **YES — and catastrophically — if anyone re-words the 75 headings.** See §4e. |
| test-file censuses / lighting census | (per the standing lane laws) | **NO new test file** if the four arms go into the existing `economyStateProseDesk.test.js`, exactly as DOCKET-2's J4 did for `vocabularyTotality.walker.test.js`. Only titles move. |

### 4e. IS A HEADING VOCABULARY CHANGE A PERSISTED-SHAPE CHANGE?

**Adding CHAIN_NOUN: NO — it is display-side only, and that is provable.** The map lives in
`src/domain/display/stateProse/`, is keyed on a string already on the settlement, and writes
nothing back. No `activeChains` field is created, renamed or removed.

**Re-authoring the 75 headings themselves: YES, on two independent grounds, and it must not be
done as part of this act.**

1. **The headings are PERSISTED.** `settlement.economicState.activeChains[]` is declared on the
   settlement type (`src/domain/settlement.schema.js:648`) and the whole settlement is serialized:
   the generator golden master maps `"tier|culture|terrain|trade|threat|seed"` →
   `sha256(JSON.stringify(settlement))` (`tests/property/generatorGoldenMaster.test.js:11-15`).
   Every heading string is inside that hash. Changing one is a **same-seed output shift** requiring
   `UPDATE_GOLDEN=1` and an explicit shift record — the class the doctrine says must never ride
   silently.
2. **⛔ AND IT WOULD SILENTLY UN-TOTAL THE TABLE ON EVERY EXISTING SAVE.** A save written before the
   re-wording carries the OLD label string. A `CHAIN_NOUN` keyed on the NEW strings has no row for
   it, `bareCommonFill(undefined)` returns `undefined`, and the sentence goes dark — while the
   in-tree totality arm stays green, because it exhausts the *current* data. That is a
   reader-visible regression no gate in the estate can see. **THE ONLY SAFE SHAPE IS: leave the 75
   producer strings exactly as they are and put every reader-facing word in the display-side map.**
   §0c-5's ruling ("the cure is on the TABLE side") is right, and this is the mechanism behind it.

---

## 5. EVERYTHING THE PREMISE GOT WRONG — CONSOLIDATED

| claim | verdict | measured figure | source |
|---|---|---|---|
| "74 category headings" | **WRONG, by one** | **75** distinct reachable values | `computeActiveChains.js:360-363` + `supplyChainData.js:334` |
| "38 seams name `{chain}`" | **CONFIRMED** | 38 of 2,266 variants, 4 blocks, 16 pool keys | the six `*.generated.js` corpora |
| "83/301 visibly wrong" | **REAL but MISATTRIBUTED and MISLEADING here** | 301 = 74+30+197 across three slots; 83 = survivors of a *first-letter-only* lowercase. For `{chain}` under a per-word lowercase: **66 of 75 (88%)** still read wrong | `$SC/receipt-docket-2.md:186-215` |
| §0c-5: "35 article/demonstrative + 3 possessive" | **off by one on each side** | **34** article/demonstrative (32 `the`/`The` + 2 `this`) + **4** possessive (3 `'s`, 1 `its`). Total 38/38 supplying a determiner: **CONFIRMED** | measured over the 38 seams |
| §0c-5's example `Raw Materials & Fuel` as a chain label | **WRONG — it is a NEED heading** | the 11 need headings are a separate vocabulary and never reach `{chain}` | `supplyChainData.js:190` |
| §0c-5: "52 of 75 carrying an ampersand" | **CONFIRMED exactly** | 52 of 75 | measured |
| implicit: "the cure is a casing table" | **INCOMPLETE** | casing is 75/75 of the *predicate* refusal and ~14% of the *reading* defect; **coordination (58) and number (4+) are the rest** | §2c |
| implicit: "the table lights the slot" | **INCOMPLETE** | it lights **37 of 38**; DS-ECO-11's seam has no producer, and the other 37 sit on **UNMOUNTED** blocks | §1b |

## 6. WHAT I DID NOT DO

- **No test was run** (whole-suite proof holds the gate mutex). Every "0 detector failures" figure
  above comes from re-executing the contract test's regexes verbatim in a scratch node script, not
  from vitest. Label: **CONFIRMED as a measurement of those regexes over those strings**; the claim
  "the suite would be green" is **PLAUSIBLE** until someone runs it.
- **No generation was run.** I did not sample generated settlements, so I cannot say how many of the
  75 headings appear on a typical world, nor reproduce the header's "0 of 318 over 24 settlements".
- **Nothing was built or edited.** The dock is byte-clean at `7ef501df9`.
- The `{good}` half of §0c-5 was not re-measured; this lane's scope is `{chain}`.
