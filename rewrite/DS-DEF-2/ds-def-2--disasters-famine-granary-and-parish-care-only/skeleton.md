Seat: MARKER (opus), DS-DEF-2 · pool `Disasters & Famine: granary AND parish care only` · the skeleton the writer drafts from; nothing here is a face.

# DS-DEF-2 · `Disasters & Famine: granary AND parish care only` · SKELETON

Three shipped variants, vids 1 to 3, angles `[ledger]` `[street]` `[visitor]` in that order. The rows below are the annex's (`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:2705-2708`) and the generated leaf carries the same three texts with the same vids, angles and slot sets (`src/data/dossierStateProse/defense.generated.js:920-943`; the pool's manifest row at `:1370-1384` reads `role: spine`, `variantCount: 3`, `faceCounts: [1,1,1]`, `vids: [1,2,3]`, `readsCount: 1`, `attach: []`). The writer rewrites these three, one for one, and gives each its four `[face]` sub-rows.

⚠ **THE SLOT SETS ARE NOT UNIFORM ACROSS THIS POOL, and that is a wall.** Vid 1 and vid 3 carry `{settlement}`; **vid 2 carries NO SLOT AT ALL** (`"slots": []` at `defense.generated.js:933`). A face's slot set must equal its parent's (ARCH §2.5's face-row refusals), so **vid 2's four faces never name the town** and vid 1's and vid 3's four faces each carry `{settlement}` exactly once. A sentence-form face may not OPEN on a `proper`-typed slot either (T-F8), so `{settlement}` sits inside the sentence, never first.

**THE TEST THIS PACKET IS MARKED UNDER (ADDENDUM 14, the owner 2026-09-12).** A face is LAWFUL unless it CONTRADICTS the record. Silence is permission. "The card does not license it" is not a finding and the tag `unlicensed` does not appear anywhere below. Claims are tagged SAFE, CONTRADICTED (with the field, file and line, and which of the two is the record) or FLOOR-2.

⭐⭐ **THIS POOL CARRIES THE ONLY SHIPPED CLAUSE IN THE WHOLE BLOCK THAT THE BLOCK'S OWN CONTRADICTION SET NAMES BY NAME AS STILL FALSE.** Of the four clauses `rewrite/rulings-DEF2-v14.txt` lists under *THE FOUR SHIPPED CLAUSES THAT ARE STILL FALSE and must not be carried forward*, one is this pool's vid 1: **`clergy who tend the sick` (hasChurch records parishes, not care)**. It is not an isolated slip. The same CARE reading is asserted again in vid 2 (*nurse*) and again in vid 3 (*a modest infirmary*), so **all three shipped variants break the same ruling in three different vocabularies**, and the writer's principal job is to carry the medical half of this pool WITHOUT asserting that anybody treats anybody.

⭐ **AND THE SECOND FINDING IS THE STOCK.** All three shipped rows assert that the town HAS FOOD — *food stored*, *reserves against hunger*, *can eat through a bad year*, *a full store*. `hasGranary` is a **TIER PROXY** and *says nothing whatever about the stock inside it* (the block's set, verbatim). The live stock is a different field on a different clock, and the badge printed beside this very sentence is driven by that other field. **Between them, the care reading and the stock reading account for nearly every content word the three shipped rows contain.**

---

## 0. What the writer reads before the first word

### 0.1 The licence card, printed this session in the dock (`node scripts/prose-licence-card.mjs DS-DEF-2 'Disasters & Famine: granary AND parish care only'`)

```
LICENCE (block DS-DEF-2 · role spine · key `Disasters & Famine: granary AND parish care only`)
  reads:      disasterRowSituation(granary, hospital, church) (via DISASTER_ROW_POOL in defenseStateProse.js)
              (absent ⇒ no candidate; a modifier is silent, never "false")
  predicate:  disasterRowSituation(granary, hospital, church) === granary, parish care
  bag:        {band: RESERVED, route: proper, settlement: proper}
              FILLED at this block's call sites: {settlement}
  relation:   (a spine takes no relation)
  seat/form:  (not a seat-taker) / sentence      move: (none declared)     angle: ledger street visitor
  attach:     (empty: a spine takes no attach set)
  echo:       spine mounts 1 (tabs: defense) · modifier mounts 0 (none)
              the echo table is keyed on this pool's WHOLE table-rung reading (truncated at the
              file's first dot) and NOT on a producer-token root, so every pool that selects a
              row of `DISASTER_ROW_POOL` shares ONE echo key: a mount counted there may be a
              sibling ROW of the same table
  covert:     no
  source:     (none) · standing SOURCE-UNRESOLVED
              NO citation is licensed: a face naming a record holder here is refused by arm A13
  THE TEST (ADDENDUM 14, the owner 2026-09-12): a face is LAWFUL unless it CONTRADICTS the record.
              SILENCE IN THE RECORD IS PERMISSION. "The card does not license it" is NOT a finding.
              This card says what the read REACHES, never the bounds of what may be written.
  may claim:  that the reader `disasterRowSituation(granary, hospital, church)` selects the row
              `granary, parish care` of `DISASTER_ROW_POOL` in `defenseStateProse.js`, as a
              STANDING fact of the record
  may NOT:    a magnitude outside the read's own band word (floor 2a), an elapsed course, a dated
              cause or a season (floor 2b), a prediction the pulse adjudicates (floor 2b),
              another civic object of the class `temple`
  audience:   player (no mark)
  REFUSED COLUMNS, always: a totality over persons; an exemption from a duty (whoIsExempt is null
              everywhere); a named character and that character's fate (product scope); a
              theological claim about a deity (the deity doctrine)
```

⚠ **Four card lines are load-bearing here and each is stricter than it looks.**

1. **`source: (none) · SOURCE-UNRESOLVED` — and on this pool the absence was a DELIBERATE WITHDRAWAL, twice.** The holder table records that two rows were drafted and struck on their own evidence, naming both of this pool's nouns: *`granary` (its only writers are a prose phrase map and a binding counter, neither of which keeps a store's record)* and *`church` (a `pick()` inside a history strand and a classifier regex)* (`src/domain/prose/holderTable.js:157-161`). So **no face may name a record or its keeper** — not the granary's tally, not the parish register, not the book, not the roll, not the count, not the wardens.
   ⚠ **This bites harder here than anywhere else in the block, because THE PARISH IS A REAL RECORD-KEEPER IN THIS TOWN AND IT IS IN THE HOLDER TABLE.** `holderTable.js:296-302` carries a `parish` row, roster-backed, with three named services (`Register of the dead`, `Central register`, `Records`) and three duties named. **The parish keeps records in this town; it does not keep THIS record.** A face that reaches for the parish register because a parish is nearby has cited a holder the read does not resolve, and arm A13 refuses it. The distinction is exact and the writer must hold it: *a record-keeper is present* is not *this fact has a keeper*.
2. **`may NOT: another civic object of the class `temple``.** The pool's key already fires on the faith house. A face may not put a SECOND one beside it — no shrine alongside the church, no chapel beyond the parish, no second house of any faith.
3. **`may NOT: a magnitude outside the read's own band word`.** The read is three BOOLEANS. There is no band word and there is no quantity at all. **A granary is present; how much is in it, how many months it covers, how full it is, how deep it runs are all outside the read.** *A full store* is a magnitude. *Reserves against hunger* is a magnitude by implication. So is *enough*, *ample*, *thin*, *half*, *a year's worth*.
4. **`may NOT: a prediction the pulse adjudicates`.** The world pulse adjudicates the food stockpile, blockade, famine and the disaster score itself (§0.9's clock row). *Can eat through a bad year*, *will hold*, *would carry the town*, *plague burns out* are the pulse's to decide.

### 0.2 The block's header lines (the annex's, the parts that bind this pool)

- **RECEIPT:** `src/domain/display/threatAssessment.js:28-195` (`buildThreatAssessment`) · rendered `src/components/new/tabs/DefenseTab.jsx:150-183` · the walls predicate `src/domain/causalState.js:300-315` (`defenseProfileHasWalls`).
- **STATE-KEY:** five fixed rows (`Beasts & Monsters` · `Invasion & War` · `Internal Security` · `Economic Survival` · `Disasters & Famine`), each with a `scoreBand` badge (`STRONG` / `ADEQUATE` / `WEAK` / `CRITICAL`) rendered beside the prose, read against `config.monsterThreat`, the institution presence flags and `compound.inst`. This pool is **row 5's `granary, parish care` branch**, and row 5 is the ONE row of the five whose badge is RE-JUDGED as the campaign runs (§0.9).
- **SLOTS:** the block declares `{settlement}` `{band}` `{route}`; only `{settlement}` is filled at this block's call sites. See the wall above: this pool's three parents are NOT uniform and each face inherits its own parent's set.
- **SECTION-TARGET:** `defense`.
- **PROVENANCE + FENCE (the block's own, quoted in substance).** The `buildThreatAssessment` lattice is dossier-native and this shape EXTENDS it rather than replacing it; the corpus's job here is that each branch currently holds exactly ONE string, so every settlement in a branch says the same words. **Institution presence is a STANDING fact with no recorded history; the causal clauses here are CAPABILITY clauses and never HISTORICAL ones** unless the history surface supplies the ancestry. It does not here. ⚠ The fence is written about institutions and this pool is made of nothing but institutions, so it binds every word: **there is no when, no who built it, no since, no after the last outbreak, no the town learned.**
- **Composition fences.** A SPINE, sentence form, no relation and no attach set, ONE spine mount on the defense tab, ZERO modifier mounts. ⭐ And the fact budget closes the door for good: ARCH §6.4's per-cell arithmetic puts this exact cell at **k = 0** — *`granary AND parish care only` and `granary, NO medical provision` {granary, hospital, church} k = 0*. **Three fields tested, no free fact seat, so no modifier can ever attach here under today's bound.** The composed unit is the spine ALONE. Every face is the whole paragraph, start to finish, with nothing before it and nothing after it.
- **PDF PARITY:** parity (`viewModel.js` defense slice) — every face prints in the PDF as well as on the tab.

### 0.3 The register card's six one-line registers (the dossier line is this pool's)

- The dossier: the record itself; the clerk's third person; the six shapes of its closed set; the town's name is not the default opener.
- The NPC ladder: read aloud to the players; role-bound; never a named interior; the stage licenses the claim, never the shape.
- The Herald: the estate's one quoted in-world voice; report mode; flattest where hottest; the bill lands apart from the deed.
- The chronicle: a borrowed body of headlines; its own prose is frames and dressings; the quiet year is one sentence of varied shape.
- The DM page: candid; the why only from a typed field; second person to the referee alone; it grades, never hedges.
- Chrome and the docent: never the archivist; the product speaking to the person who runs it; mechanics first, one term per thing, the label as the only emphasis.

### 0.4 The owner's rules that bind every face, restated once

Four wording faces per semantic variant, each a different vocabulary or rhythm inside the voice, never a paraphrase of its sibling. Never trim (Part B §22: the counts only rise; a face that fails the gate stays in the annex as a refusal row with its measurement). An unweighted seeded roll picks the face at render, so every face must stand alone. The exemplar, not the practical. No em dash, no exclamation mark, no digit or percent in a connective, no which-clause. The clerk who was there, compiling from records, citing a holder only where the card licenses a source and the budget allows — **and here the card licenses none.**

⚠ **The no-digit rule and the no-magnitude rule meet on this pool and the writer will feel it.** The read has no band word to hand the reader as a quantity — unlike `Economic Survival`, which at least has STRONG. Here there are three yes-or-no facts and nothing else, and **every instinct to say how much will be a contradiction rather than a style choice.** The lawful quantity vocabulary on this pool is the PRESENCE and the ABSENCE, and nothing between them.

**THE THREAD (MOVE-GRAMMAR §1.4.1).** This pool is a SPINE with no modifiers, and the defense tab stacks the five rows' prose as one italic block of paragraphs above the five bars (`DefenseTab.jsx:313-320`). **This row is ALWAYS LAST** — see §0.7.1, which fixes its position exactly. So its thread duty runs one way only: **it must pick up a noun from the paragraph above it and it hands nothing forward, because nothing follows it.** It is the reader's last word on the town's defences, and the one paragraph in the block that may lawfully close the whole block.

**THE DENSITY LAW (Part B §21.4).** Compression and idiom that reward the reader are part of the ceiling. "Unclear" is not a finding unless a law is broken. Do not trade density for plainness.

---

## 0.5 ⭐ THE READS THIS POOL REACHES — MATERIAL a writer may use, never a bound on what may be written

The predicate is THREE BOOLEANS through one branch (`src/domain/display/stateProse/defenseStateProse.js:550-595`):

```
function disasterRowSituation(granary, hospital, church) {
  if (granary) {
    if (hospital) return 'granary, hospital';
    return church ? 'granary, parish care' : 'granary, no medical provision';
  }
  return hospital ? 'no reserves, hospital' : 'no reserves, no medical provision';
}
```

The caller hands it `civicFlag(compound.hasGranary)`, `civicFlag(compound.hasHospital)`, `civicFlag(compound.hasChurch)` (`:660-663`), where `compound` is `settlement.economicState.compound.inst`. **This lens is TOTAL: it is never silent** (the desk's own docblock, `:559`).

⭐ **The desk's docblock also records exactly why this pool exists, and the writer should read it as the shape of the thing:** *a church counts as medical provision ONLY in the granary branch, and that is the corpus's own shape rather than a choice* — the corpus wrote `granary AND parish care only` but no matching `no reserves, parish care` pool, **so the situation set is five and not six** (`:572-576`). This pool is the one branch in the block where a faith house is being read as a health fact, and the block's own contradiction set then rules that reading FALSE. That tension is the packet's centre and §0.8 settles it.

| read | what it holds on this key | holder | what it puts in a writer's hand | what the record can deny about it |
|---|---|---|---|---|
| `compound.inst.hasGranary` = **true** | one of the roster names matched the substring `granar` (`src/generators/priorityHelpers.js:63`) | **NONE.** `granary` was drafted as a holder row and WITHDRAWN (`holderTable.js:158-159`) | **a building of a named class stands in this town and its whole recorded purpose is keeping grain against a later day.** The catalog's own service lists are the estate's: `grain storage`, `emergency reserves`, and at the larger rows `rationing` and `strategic reserve` (`src/data/economicData.js:50-88`) | ⛔ **the stock.** *hasGranary is a TIER PROXY and says nothing whatever about the stock inside it* (the block's set). A granary standing empty under a blockade reads `true` here forever |
| `compound.inst.hasHospital` = **FALSE** | NONE of `hospital`, `monastery`, `healer`, `friary` matched (`priorityHelpers.js:64`) | NONE | ⭐ **this is the sharpest true fact in the packet and no shipped row uses it.** The FALSE leg is a four-name absence, not one: **no hospital, no monastery, no friary, and no healer of any kind** — `Small hospital`, `Major hospital`, `Hospital network`, `Monastery or friary`, `Multiple monasteries`, `Major monasteries (5-10)` and `Healer (divine, 1st level)` are each absent from this town's roster (`src/data/institutionalCatalog.js:845, 1267, 1275, 1805, 1814, 2378, 2385`). **The absence is licensed, it is specific, and it is the one thing here a writer may state flatly** | nothing denies it; it is the key's own leg |
| `compound.inst.hasChurch` = **true** | one of `church`, `cathedral`, `temple`, `monastery`, `friary`, `shrine`, `priest`, `abbey` matched (`priorityHelpers.js:65`) | **NONE.** `church` was drafted as a holder row and WITHDRAWN (`holderTable.js:159-160`) | **a faith establishment of the parish class stands in this town.** ⭐ And because `hasHospital` is FALSE, **the match is NOT `monastery` and NOT `friary`** — those two names are on BOTH lists. So the thing that fired this leg is a church, a cathedral, a temple, a shrine, a priest or an abbey, and never a monastic house | ⛔ **CARE.** *hasChurch records parishes rather than care* (the block's set), and *clergy who tend the sick* is named in that document as one of four shipped clauses that are still false |

### 0.5.1 ⭐ THE DERIVATION THE SHIPPED ROWS NEVER MADE — what tier this pool actually sits on, and what that hands the writer

`hasGranary` matches only `granar`, and the catalog carries exactly three granary rows: **`Town granary`** at the TOWN tier (`institutionalCatalog.js:925`), **`City granaries`** at CITY (`:1590`) and **`State granary complex`** at METROPOLIS (`:2505`). **There is no granary at village, hamlet or thorp.** That is what the block's set means by *a TIER PROXY (every town-plus, no village-and-below)*.

**Two consequences, and the second one corrects a reading of the block's set that would otherwise mislead the writer.**

1. **The preimage of this pool is TOWN, CITY or METROPOLIS and nothing smaller.** Which narrows the range considerably against the block's other rows, and is worth §0.9's own line.
2. ⭐ **The block's set warns that `hasChurch` fires on every hamlet from a church in ANOTHER settlement — and THAT WARNING CANNOT REACH THIS POOL.** The rows it describes are `Access to parish church` at thorp (`:50`, *Walk 2-5km to village church for services*) and at hamlet (`:300`, *Travel to village church. 2-5km distance typical*). **Neither tier can hold a granary, so neither can select this pool.** At town and above the church rows are `Parish churches (2-5)` (`:1260`), `Parish churches (10-30)` (`:1828`), `Cathedral (10,000+ only)` (`:1796`), `Parish churches (50-100+)` (`:2364`) and `Great cathedral` (`:2371`). **So on THIS pool the faith houses are IN the town, they are PLURAL on every parish row, and the clergy are resident.** A writer may say the parishes are here. The ruling that still binds is the narrower one and only the narrower one: **presence is licensed, CARE is not.**

### 0.5.2 The reads this desk performs and this key does NOT reach

- **No stress.** `config.stressTypes` is read by NO key function of this block. This pool prints under `famine`, `plague_onset`, `under_siege`, `occupied`, `indebted`, `monster_pressure` and `wartime`, each of which renders its own banner on the same tab (`DefenseTab.jsx:240-245`). **A famine banner and a plague banner both sit directly above a paragraph about hunger and sickness.**
- **No live food.** `economicState.foodSecurity` — `storageMonths`, `deficitPct`, `resilienceScore`, and the `stockpile` record with its `blockaded`, `blockadeBypass`, `famished`, `tithed` and `deployed` flags (`src/domain/worldPulse/foodStockpile.js:404-430`) — is read by this key NOWHERE. **It is read by the badge printed beside the sentence.** See §0.9.
- **No route, no port, no isolation.** `config.tradeRouteAccess` and `compound.inst.hasPort` are invisible here, and they are DS-DEF-6's surviving lens (§0.7.3).
- **No population, no culture, no country, no terrain, no walls, no force, no court, no prison, no score.**
- **No apothecary, no almshouse** — see §0.9.3, where their absence from the read is the writer's opportunity rather than a bar.

---

## 0.6 The provenance move, priced for this pool: ZERO, and the temptation here is the highest in the block

The card prints `source: (none) · standing SOURCE-UNRESOLVED` and says in its own line that **no citation is licensed and a face naming a record holder is refused by arm A13.**

- **No named keeper, no named record, in any face.** Not the granary's tally, the parish register, the sexton's book, the wardens' count, the elders, the treasury, the muster, the toll bar, the road.
- ⚠ **The `[ledger]` angle plus a parish is the single strongest pull toward a refused citation anywhere in DS-DEF-2.** The parish register is one of the estate's genuine record institutions — three named services, roster-backed, three duties (`holderTable.js:296-302`), and the catalog calls the sexton's ground register *the town's longest unbroken record* (`institutionalCatalog.js:1292`). **All of that is true of the town and none of it is the holder of THIS fact.** The `[ledger]` face must sound like the record without naming one: flat order, the fact first, the qualification in its own sentence.
- The exemplar registers with raw text cite at zero per 786 sentences (Part B §24), so zero is also the norm.

---

## 0.7 ⭐ THE PAGE AROUND THE SENTENCE

### 0.7.1 This paragraph is ALWAYS LAST, on every town that reaches it

The block renders `['beasts','invasion','internal','economic','disaster']` in that order, filtering out silent rows (`DefenseTab.jsx:112-114`), and the first surviving paragraph gets the larger font (`:319`, `i===0?FS.sm:FS.xs`). Of the five keys:

- `beastsRowPoolKey` **can be silent** (`defenseStateProse.js:429-440`).
- `invasionRowPoolKey` is **TOTAL over six** (`:443-492`).
- `internalRowPoolKey` is **TOTAL over four** (`:493-508`).
- `economicRowPoolKey` **can be silent** (a non-finite score returns null, `:540-543`).
- `disasterRowPoolKey` is **TOTAL over five** (`:580-595`).

**Therefore this paragraph is never first, never the large-font line, and always the last thing the reader meets in the block.** Its neighbour above is `Economic Survival` where the score is finite and `Internal Security` where it is not.

- **The sentence before it** is about what the town can KEEP PAYING FOR while a pressure runs (the four economic bands), or about law, process, enforcement and force (the four internal rows).
- **Nothing follows it.** No thread is handed on. ⭐ **So this is the one pool in the block where the register card's *leave one matter standing open* can land on the block's own last line, and where a close of a varied kind (R-DA-04) actually closes something.**

### 0.7.2 ⛔ THE SHARPEST HAZARD ON THE PAGE: the paragraph immediately ABOVE is made of this row's own biggest neighbour-fact

`Economic Survival` is a score whose dominant term is **months of stored food, capped at seventy of the hundred** (`src/generators/defenseGenerator.js:265-269`, from `config._foodSecurity.storageMonths`). So the paragraph directly above this one is, arithmetically, mostly a paragraph about grain — and this one is about a granary.

**The discriminating line between them is exact and the writer should hold it.** The economic row says what the town can go on SPENDING while something runs long. This row says what the town HAS STANDING against two specific things, hunger and sickness, and it says so by naming buildings. **A face here that reaches for endurance, months, carrying on, paying through or holding out has written the paragraph above it.** This row's subject is what is BUILT, and what is NOT.

### 0.7.3 On the same tab, in the expandable rows below, the estate says all of this again in plain English — and TWO of those strings are the reason the error looks authoritative

The five bars expand into `assess` prose and a funding note (`DefenseTab.jsx:341-344`). The Disasters row's own expansion reads, verbatim from `threatAssessment.js:176-188`:

> *Granary provides food buffer. The community can absorb a bad harvest without immediate hardship.* + *Parish clergy provide basic wound care: better than nothing, worse than a hospital.*

And the DEFENSE POSTURE rows on the same tab print `Medical Readiness — status **Clergy care**, note *Parish care. Basic wound and disease management.*` and `Logistics & Supply — status **Granary present**` (`defenseDisplay.js:237-241`).

⚠⚠ **BOTH HALVES OF THE SHIPPED VID 1 ARE THE LEGACY STRING REWRITTEN CLOSE TO THE BONE**, exactly as the sibling `Economic Survival: STRONG` packet found for its own row. *something better than nothing and well short of a hospital* is `better than nothing, worse than a hospital` with the words moved. **The legacy strings are display prose, not typed fields; the block's contradiction set is the record, and it rules the care reading false.** The writer must not take comfort from the neighbour string. It is the same error, one click away, and it is the reason the error reads as authoritative.

⭐ **The funding note under THIS row is `relief funding`.** `READINESS_GATE_FOR['Disasters & Famine']` is `['disaster', 'relief funding']` (`defenseDisplay.js:283`), and the note *Upkeep underfunded: relief funding at NN%* renders under this row whenever `economicGates.disaster` is below one (`:317-321`). That gate is `Math.min(1, 0.55 + (econOut / 50) * 0.45)` — **identity only at `economyOutput >= 50`, floor 0.55** (`defenseGenerator.js:611-614`). So across a large part of this pool's range **the note directly beneath the sentence says the town's relief is underfunded.** A face that says the town is provided for, ready, or wants for nothing is contradicted one line below itself.

### 0.7.4 DS-DEF-6's `Medical Readiness` pools are SILENCED because this row speaks

The desk's own docblock names this pool by its key function (`defenseStateProse.js:1476-1479`): *MEDICAL READINESS ⇄ DS-DEF-2 row 5, `disasterRowPoolKey`. DS-DEF-2's row reads `hasGranary` × `hasHospital` × `hasChurch` and speaks BOTH the reserve and the medical halves; this lens is the second half of that sentence on its own.* All three `Medical Readiness` pools sit in `DEF6_C3_BLOCKED_POOLS` (`:1498-1500`) and never print.

**Two consequences.** First, there is no same-tab prose collision on the medical half: those words are not on the page. Second, and for the chair rather than the writer: **the C3 block was justified on the ground that this row already speaks the medical reading.** A rewrite that drops the medical half entirely from all twelve faces weakens that justification, and the packet records it here rather than leaving it to be re-found. **The lawful medical content is the ABSENCE (no hospital, no monastery, no friary, no healer) beside the PRESENCE of the parishes — never the care.**

⭐ **And the one DS-DEF-6 lens that SURVIVES is the granary against the supply route.** The docblock is explicit: *LOGISTICS & SUPPLY is not the granary again — it is the granary against the SUPPLY ROUTE (port, isolation, road), and no other block on this leaf can see `config.tradeRouteAccess` or `compound.inst.hasPort` at all* (`:1483-1486`). **So the port, the roads, the carts, isolation and what happens when a road is cut are that lens's sentence and not this one's.** This key cannot see any of them.

### 0.7.5 The granary speaks again on another tab, from the LIVE field

`DS-ECO-2`'s granary tile reads `granaryOutlook` — the seasonal outlook with its own band, derived from the live stockpile (`economyStateProse.js:418-424`, mounted at `:1013-1014`) — and `DS-GEN-17`'s `institutionsPoolKey` resolves `PROVISIONED` on `hasGranary === true || hasHospital === true` (`generalStateProse.js:1178-1184`). **The stock reading belongs to DS-ECO-2 and it has the field for it. This pool does not.**

---

## 0.8 ⭐ WHAT WOULD BE FALSE HERE — the contradiction rows THIS key can walk into

The block's own set is `rewrite/rulings-DEF2-v14.txt`. The rows below are the ones this key can actually reach.

| the claim that would be false | the field that denies it, and which of the two is the record |
|---|---|
| ⛔⛔ **CLERGY WHO TEND THE SICK · NURSING · CARE · TREATMENT · WOUND CARE · AN INFIRMARY · A SICK-HOUSE · A HEALER · A PHYSICIAN · ANYBODY WHO LOOKS AFTER ANYBODY** | **the block's set, by name, as one of the four shipped clauses that are still false: *'clergy who tend the sick' (hasChurch records parishes, not care)*.** `hasChurch` is a substring match over `church`, `cathedral`, `temple`, `monastery`, `friary`, `shrine`, `priest`, `abbey` (`priorityHelpers.js:65`) and the catalog rows it matches at this pool's tiers are parish and cathedral rows whose services are *religious services*, *pilgrimage*, *theological education* (`economicData.js:390-400`) — not care. **The block's set is the record; the sentence is wrong, and the `threatAssessment.js:186` and `defenseDisplay.js:239` display strings that say otherwise are legacy prose, not fields** |
| ⛔ **A STOCK: food stored, reserves, a full store, grain in hand, what the town HAS PUT BY, months of buffer, enough, plenty, thin, half-full** | **the block's set, verbatim: *hasGranary is a TIER PROXY (every town-plus, no village-and-below) and says nothing whatever about the stock inside it*.** The stock is `economicState.foodSecurity.storageMonths` on the live stockpile (`foodStockpile.js:404-407`), which this key never reads and which the world pulse moves every tick. **The stockpile is the record.** A granary blockaded to nothing still reads `hasGranary: true` |
| ⛔ **CAN EAT THROUGH A BAD YEAR · WILL CARRY THE TOWN · WOULD SURVIVE A FAILED HARVEST · ABSORB A BAD HARVEST · PLAGUE BURNS OUT** | FLOOR-2b, a prediction the pulse adjudicates. `foodStockpile.js` runs the deficit, the relief, the blockade, the famine flag and the capacity every tick (`:390-473`), and the plague is `stressGenerator.js`'s roll. **The pulse is the record.** The lawful form is the standing capability or the subjunctive edge, never the outcome |
| ⛔ **A SECOND FAITH HOUSE: a shrine beside the church, a chapel as well, a temple too, another house** | the card's own line, `may NOT: another civic object of the class `temple``. The key fires ONCE on the faith leg and licenses one class of object |
| ⛔ **A MONASTERY, A FRIARY, MONKS, AN ABBEY THAT NURSES, A RELIGIOUS HOUSE THAT TAKES THE SICK IN** | `hasHospital` is FALSE here and it matches `monastery` and `friary` as well as `hospital` and `healer` (`priorityHelpers.js:64`). **So the FALSE leg positively excludes a monastic house.** ⚠ `abbey` fires `hasChurch` alone and can be present — but an abbey that takes in the sick is the care claim again, and the almshouse (`institutionalCatalog.js:1285`) is a house for *the destitute poor, aged, and disabled who cannot work*, which is not the sick |
| ⛔ **A DECISION, A PRIORITY, WHAT THE TOWN CHOSE, WHAT IT SPENT ITS THINKING ON, WHAT IT NEGLECTED, WHAT IT HAS NOT BUILT YET** | the block's fence: these are CAPABILITY clauses and never HISTORICAL ones. **There is no decision field and no ancestry behind an institution boolean.** *Which of the two the town has spent its thinking on* is the shipped vid 3 and it is FLOOR-2b |
| ⛔ **A CAUSE, A DATE, A FOUNDING, A SINCE, AN AFTER THE LAST OUTBREAK, A PLAGUE THE TOWN REMEMBERS** | FLOOR-2b and the block's fence. **The institution booleans are a generation-time snapshot with no recorded history** (`defenseStateProse.js:604-609` makes the same point about the force buckets) |
| ⛔ **A MAGNITUDE OF ANY KIND** | floor 2a. **The read has no band word at all — it is three booleans**, so *substantial*, *modest*, *ample*, *considerable*, *a great store*, *a small parish* are each a quantity nothing holds. Note *modest* in the shipped vid 3 |
| ⛔ **A COUNT, A FIGURE, A SPELLED NUMBER, A SEASON, A NUMBER OF MONTHS OR PARISHES** | no digits in prose (A4); floor 2b bars a season; and the parish rows are RANGES (`2-5`, `10-30`, `50-100+`) so no count is fixed across the range |
| ⛔ **THE TOWN IS PROVIDED FOR · NOTHING HERE IS SHORT · THE RELIEF IS FUNDED** | `economicGates.disaster` floors at `0.55` and reaches identity only at `economyOutput >= 50` (`defenseGenerator.js:611-614`, persisted at `:649`), and `deriveDefenseReadiness` renders *Upkeep underfunded: relief funding at NN%* under this exact row whenever it is below one (`defenseDisplay.js:283, 317-321`). **The note is the record, and it is one click below the sentence** |
| ⛔ **NOTHING HAS GONE WRONG HERE · THE TOWN HAS NOT BEEN TESTED · NO SICKNESS HAS COME** | FLOOR-2b (an elapsed course) and the stress preimage. **No key function of this block reads `config.stressTypes`**, so this face prints under an ACTIVE FAMINE banner, an ACTIVE PLAGUE-ONSET banner, a siege and an occupation. The banner is the record |
| ⛔ **A TOTALITY OVER PERSONS: everyone is fed, nobody goes hungry, the whole town is looked after, every parish, all the clergy** | the REFUSED COLUMNS line, and an exemption from a duty (`whoIsExempt` is null everywhere) |
| ⛔ **A THEOLOGICAL CLAIM: the god answers, prayer works, faith protects the town, the saints keep it** | the DEITY DOCTRINE (faith is culture, never theology). ⚠ **That the town PRAYS is culture and is safe; that praying does anything is not** |
| ⛔ **A NAMED CHARACTER: the priest by name, a family, an inn, a lane, a road** | product scope, and a pooled face is authored once and drawn by every town whose key matches, so a minted name prints identically across a region |
| ⛔ **THE PORT, THE ROADS, ISOLATION, A CUT SUPPLY LINE, CARTS ARRIVING** | this key reads no route at all, and **that reading is DS-DEF-6's `Logistics & Supply`, which is the one lens on the tab that SURVIVED because nothing else can see it** (`defenseStateProse.js:1483-1486`). Writing it here is taking a live lens's only subject |
| ⛔ **THE BADGE READ ALOUD: the town rates well against disasters, its readiness is strong** | MOVE-GRAMMAR §1.3, no MEANING move — and here it is worse than a gloss, because **the badge is on a different clock from the prose and they can disagree outright** (§0.9) |

**THE CLOSED ROSTERS THIS POOL TOUCHES (floor 1).** A body, building, record-keeper, force or faith-house these do not carry may not be asserted: the institution roster read through the LIVE ruin-filtered roster (`institutionRoster.js`, `liveInstitutions`); the tier catalog (`institutionalCatalog.js` — and at this pool's tiers the medical rows are ABSENT by the key's own FALSE leg); the faction list; the faith entries; the NPC office roster; **and the holder table (`holderTable.js`), which for this pool resolves NOTHING — `granary` and `church` were each drafted as rows and withdrawn on their own evidence (`:157-161`).** Everything else is silence, and silence is permission.

**Not a faith pool.** ⚠ **This pool reads a faith BUILDING and is still not a faith pool**, and the distinction matters because the temptation is real. The deity's four axes, the DERIVED temper (`deityTemper()`, never the inert stored `temperamentAxis`), the PANTHEON rank and the SETTLEMENT standing kept apart, and the suppressed flag beside the standing — **none of them is read by `disasterRowSituation`, none may be asserted, and no face may name a deity, a rite, a doctrine, a rank or a standing.** `hasChurch` is a substring match on an institution name and it carries no theology whatever.

---

## 0.9 ⭐ THE PREIMAGE — the range of towns this key selects

`Disasters & Famine: granary AND parish care only` fires on **every town whose roster matches `granar`, does NOT match any of `hospital`/`monastery`/`healer`/`friary`, and DOES match one of `church`/`cathedral`/`temple`/`shrine`/`priest`/`abbey`** — and on nothing else about the town. Three booleans, nothing more.

- **TOWN, CITY or METROPOLIS, and never smaller** (§0.5.1). The granary leg is a tier floor. This is the block's narrowest tier range and it is the one genuinely useful preimage fact the pool has: **the reader is always looking at a place with districts, not a hamlet.**
- **Every country tier** (`plagued`, `frontier`, `settled`), **every route, every terrain, every culture, every population inside those tiers.** None is read.
- **Every defensive posture.** This key reads no walls, no garrison, no militia, no watch, no court, no prison. **The same face prints on a town whose `Invasion & War` paragraph says there is a line and professionals to hold it, and on one whose paragraph says there is no line and no force.**
- **Every stress state, including the two that make a complacent face absurd.** No key function of this block reads `config.stressTypes`. **This face prints under an ACTIVE FAMINE banner and under a PLAGUE-ONSET banner** — the two stresses whose subject is this paragraph's subject. ⚠ That is the preimage row a writer is most likely to walk into, because a paragraph about hunger and sickness invites a reassuring register, and the banner directly above may say the hunger and the sickness are happening now.
- **Every funding state of the relief gate.** `economicGates.disaster` floors at `0.55`, so a town in this pool may print *Upkeep underfunded: relief funding at 55%* under the sentence.
- ⭐⭐ **AND HERE IS THIS POOL'S OWN CLOCK PROBLEM, WHICH IS THE OPPOSITE OF EVERY OTHER ROW'S IN THE BLOCK.** The tab's caption says the bars are *as judged at the first survey; Disasters & Famine is re-judged as the campaign advances* (`DefenseTab.jsx:313`). And it is: the world pulse recomputes `scores.disaster` every tick as `resilienceScore × economicGates.disaster` and writes it back, precisely so that *the 'Disasters & Famine' row does not stay frozen at the generation value while a siege eats the granary* (`foodStockpile.js:390-473`, the comment at `:390-397` verbatim in substance). **So the BADGE beside this sentence is LIVE and the SENTENCE is FROZEN.** The prose reads three generation-time institution booleans that never move; the badge reads a live resilience score that moves every week. **They can and will disagree: the badge can read CRITICAL under a blockade while the prose is still describing a granary.** A face written as a report of what STANDS in the town survives that. A face written about what the town HAS, HOLDS, CAN DO or WILL MANAGE does not.

A face must contradict no state in that range, not merely the town on this skeleton.

---
