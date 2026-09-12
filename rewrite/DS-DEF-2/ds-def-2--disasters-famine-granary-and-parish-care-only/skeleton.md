Seat: MARKER (opus), DS-DEF-2 · pool `Disasters & Famine: granary AND parish care only` · the skeleton the writer drafts from; nothing here is a face.

# DS-DEF-2 · `Disasters & Famine: granary AND parish care only` · SKELETON

Three shipped variants, vids 1 to 3, angles `[ledger]` `[street]` `[visitor]` in that order. The rows below are the annex's (`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:2705-2708`) and the generated leaf carries the same three texts with the same vids, angles and slot sets (`src/data/dossierStateProse/defense.generated.js:920-943`; the pool's manifest row at `:1370-1384` reads `role: spine`, `variantCount: 3`, `faceCounts: [1,1,1]`, `vids: [1,2,3]`, `readsCount: 1`, `attach: []`). The writer rewrites these three, one for one, and gives each its four `[face]` sub-rows.

⚠ **THE SLOT SETS ARE NOT UNIFORM ACROSS THIS POOL, and that is a wall.** Vid 1 and vid 3 carry `{settlement}`; **vid 2 carries NO SLOT AT ALL** (`"slots": []` at `defense.generated.js:932`). A face's slot set must equal its parent's (ARCH §2.5's face-row refusals), so **vid 2's four faces never name the town** and vid 1's and vid 3's four faces each carry `{settlement}` exactly once. A sentence-form face may not OPEN on a `proper`-typed slot either (T-F8), so `{settlement}` sits inside the sentence, never first.

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

## VARIANT 1 · vid 1 · `[ledger]` · slots `{settlement}` · canonical at index zero

### 1.1 The shipped sentence, verbatim

> There is food stored at {settlement} and there are clergy who tend the sick: reserves against hunger, and against disease something better than nothing and well short of a hospital.

⚠ **This sentence is the legacy display string rewritten close to the bone, and BOTH halves are inherited.** `threatAssessment.js:176-188` reads *"Granary provides food buffer. The community can absorb a bad harvest without immediate hardship."* + *"Parish clergy provide basic wound care: better than nothing, worse than a hospital."* **The shipped variant's *something better than nothing and well short of a hospital* is that second string with the words moved**, and its first half is the first string's buffer reading. Naming the inheritance is the point: the legacy string is the reason the error reads as authoritative, and it sits one click below the sentence on the same tab.

### 1.2 Every claim it makes, on the new test

- **FOOD IS STORED at the town — a stock, asserted as present.** — ⛔ **CONTRADICTED, and this is the packet's first principal finding.** `hasGranary` matched the substring `granar` on the roster (`priorityHelpers.js:63`) and nothing more. The block's set rules in as many words: *hasGranary is a TIER PROXY (every town-plus, no village-and-below) and says nothing whatever about the stock inside it*. The stock is `economicState.foodSecurity.storageMonths`, re-derived every tick by the world pulse with its `blockaded`, `famished` and `tithed` flags (`foodStockpile.js:404-430`). **The stockpile is the record; the sentence is wrong.** A granary emptied by a blockade still reads `hasGranary: true`, and the badge printed beside this sentence will have fallen while the sentence has not (§0.9).
- **THERE ARE CLERGY.** — **SAFE, and it is stronger than the shipped line makes it sound.** `Parish churches (2-5)` is `required: true, baseChance: 1` at the town tier and `Parish churches (10-30)` is the same at city (`institutionalCatalog.js:1260-1265, 1828-1833`), so across nearly the whole preimage the parishes are IN the town, PLURAL, and the clergy resident. ⭐ And the key's FALSE leg positively excludes the monastic reading: `monastery` and `friary` are on `hasHospital`'s list as well as `hasChurch`'s, so **these are parish clergy and never a religious community** (`priorityHelpers.js:64-65`).
- **THE CLERGY TEND THE SICK.** — ⛔⛔ **CONTRADICTED, and it is the one clause in the whole block that the block's contradiction set names by name.** `rewrite/rulings-DEF2-v14.txt`, under *THE FOUR SHIPPED CLAUSES THAT ARE STILL FALSE and must not be carried forward*: **`clergy who tend the sick` (hasChurch records parishes, not care)**. The catalog's own service lists for the matching rows are *religious services*, *pilgrimage*, *theological education* (`economicData.js:390-400`); the parish rows' descs are *Multiple parishes within town* and *One per neighborhood*. **The block's set is the record.** ⚠ The estate's legacy strings at `threatAssessment.js:186` and `defenseDisplay.js:239` assert the care reading too, and they are display prose rather than typed fields — **the ruling governs and the neighbour string is not a defence.**
- **RESERVES AGAINST HUNGER.** — ⛔ **CONTRADICTED twice.** It is the stock claim restated (above), and *reserves* is additionally a magnitude the read has no band word for (floor 2a). ⚠ Note how close the legitimate word sits: the catalog's own service string for the granary rows is literally `emergency reserves` (`economicData.js:56-57`). **The building's stated PURPOSE is reserves; the town's possession of reserves is the contradiction.** That distinction is the whole craft problem of this pool and the writer should hold it exactly: *a building for holding grain against a later day stands here* is safe; *there is grain in it* is not.
- **AGAINST DISEASE, SOMETHING** — i.e. the town HAS medical provision of some degree. — ⛔ **CONTRADICTED.** It is the care reading in its weakest form and it is still the care reading. The key's medical leg is FALSE, and what the true leg holds is a parish, not a provision.
- **BETTER THAN NOTHING.** — ⛔ **CONTRADICTED as written; the SHAPE is licensed and worth keeping.** It rates the care that the record denies. But the move underneath it is legitimate: R-DA-02 licenses a contrast where the rejected alternative names a sibling pool, and **both siblings exist by name** — `granary, NO medical provision` on one side and `granary AND hospital` on the other. **This variant sits exactly between two branches of the same table, and that position is a real fact the writer may use.** It is the position that must be stated, never the quality of the care.
- **WELL SHORT OF A HOSPITAL.** — **the CLAIM is SAFE; the WORDING carries a magnitude.** *There is no hospital here* is the key's own FALSE leg, flatly true, and it is the ABSENCE move (class (a), LACK — a `none-exists` world field) which R-DA-02 and MOVE-GRAMMAR §1.2 row 11 both license, provided it does not open the variant and does not sit beside another absence. **But *well short of* rates a distance nothing measures** — floor 2a. ⭐ And the absence is bigger and more specific than the shipped line admits: it is **no hospital, no monastery, no friary and no healer**, four named roster rows at once (`institutionalCatalog.js:845, 1267, 1275, 1805, 1814, 2378, 2385`). The shipped line spends the pool's best licensed fact on a comparison instead of stating it.
- **The colon and the coordinated tail.** — not a claim, but it LEAVES with the rewrite. The colon is licensed as one chosen joint (R-DA-06), but what rides behind it is a second and a third fact joined by *and*. R-DA-03: the qualification gets its own sentence, never a tail, never a third. Amendment S2 admits one computed consequence as a clause and this is not one.
- **Implicitly: the town WEIGHED the two provisions, or settled for less.** — the face does not quite assert it and must not. There is no decision field and no ancestry behind an institution boolean; the block's fence says these are capability clauses and never historical ones. **FLOOR-2b** if written.

### 1.3 The reads this pool reaches (material for the rewrite of vid 1)

- **The granary as a BUILDING OF A NAMED PURPOSE.** The catalog's own descs are the estate's: *Communal grain storage. Buffers harvests, prevents famine.* (town, `:928`), *Multiple large grain stores distribute food across the city. State managed.* (city, `:1593`), *State-administered granary network holding strategic reserves.* (metropolis, `:2508`). The service lists add `grain storage`, `emergency reserves`, `rationing`, `strategic reserve` (`economicData.js:50-88`). **All of that is what the building IS FOR. None of it is what the building CONTAINS.**
- **The granary is REQUIRED at town and at city** (`required: true, baseChance: 1`, `:926-927, 1591-1592`), so across most of the preimage this is not a thing the town acquired — it is a thing every place of this size has.
- **The parishes, plural, resident, and required at town and city.**
- **The FALSE medical leg as a four-name absence** — the single most specific licensed fact in the pool.
- **The pool's POSITION between two named sibling branches** of the same table.
- REACHED BY THE ENGINE AND NOT BY THE KEY, and therefore the writer's boundary: the stock, the months, the deficit, the blockade, the famine flag, the relief gate, the badge, every stress, the route, the port, the tier name, the population, every other institution.

### 1.4 ⭐ WHAT WOULD BE FALSE HERE (vid 1)

Every row of §0.8 is reachable from this variant. The five it walks into hardest:

| row | why this variant, specifically |
|---|---|
| **the care reading** | the shipped line breaks it outright and the block's set names the clause. **No clergy who tend, nurse, treat, care for, look after or attend anyone. No wound care, no sickbed, no infirmary, no healer** |
| **the stock** | the shipped line breaks it twice (*food stored*, *reserves*). The `[ledger]` angle will reach for a quantity by reflex and there is no quantity here at all |
| **a magnitude** | *well short of*, *something better than nothing*, *modest*, *substantial*, *ample* are each a measurement of a thing the read does not measure |
| **a named holder** | the `[ledger]` angle plus a parish is the strongest pull to a refused citation in the block (§0.6). **No register, no roll, no tally, no book, no count, no sexton, no warden** |
| **a decision** | *settled for*, *chose*, *has not built*, *makes do with* each assert an ancestry the institution booleans do not carry |

### 1.5 The preimage, as it bites vid 1

See §0.9 whole. For this variant in particular: the face prints on a town, a city and a metropolis; on a town with a wall and professionals and on one with neither; **under an ACTIVE FAMINE banner and under a PLAGUE-ONSET banner**; over its own *Upkeep underfunded: relief funding at NN%* note; and **beside a live badge that may read CRITICAL while the sentence describes a granary.** *There is a granary and there are parishes* survives every one of those. *There is food stored* survives a famine banner badly and a blockade not at all. *Clergy who tend the sick* survives nothing, because the ruling denies it on every town in the range at once.

### 1.6 The angle's stance in one sentence

`[ledger]` is the clerk's view, what the books, rolls and counts show (the annex's own gloss at `RECEIPT_POOLS_DOSSIER_STATE.md:120`) — so here it may set down flatly WHAT STANDS and WHAT DOES NOT, in the order a clerk would, giving the absence its own weight and putting the qualification in its own sentence; **but on this pool it may not name a book, a roll, a register or a keeper**, because the card resolves no holder and the parish register is the very record it would reach for, so its ledger quality must come from the ORDER and the FLATNESS of the sentence and never from a cited record.

### 1.7 The turns worth keeping

- ***short of a hospital*** — the claim is the key's own FALSE leg and it is the pool's best licensed fact. Worth carrying into ONE face as a flat absence with the magnitude removed, and finding three other constructions of the same absence for the rest.
- **The two-part shape: what the town has against hunger, then what it has against sickness.** That is the key's own structure (two legs, one branch) and it is licensed. **What must change is the content of the second part.**
- **The position between the siblings** — the contrast move, kept as a POSITION and never as a rating.
- What to drop: *food stored* and *reserves* (contradicted), *clergy who tend the sick* (contradicted and named), *something better than nothing* (rates the denied care), *well short of* (a magnitude), the colon's coordinated third fact (barred).

### 1.8 What would make the rewrite of vid 1 a regression

Vid 1 not first, or not `[ledger]`, or its slot set not `{settlement}` alone, or fewer than four faces, or no longer the pool's canonical index-zero line. A face that opens on the `{settlement}` proper slot (T-F8). A face carrying a which-tail, an em dash, a digit, a spelled count, a third sentence, or a summarising second sentence that says what the first one MEANT. **Any face that carries the care reading forward in new words — *the priests do what they can*, *the church takes the sick in*, *the parish is what passes for medicine here* are all the same finding.** Any face that asserts grain, a stock or a quantity. Any face that names a record or its keeper. Any face that opens on the absence (wall 3) or sets two absences side by side.

### 1.9 ⭐ WHERE THE FLAVOUR IS (vid 1)

- ⭐⭐ **THE PARISH'S RECORDED WORK WITH A PLAGUE IN THIS ESTATE IS THE GROUND, NOT THE SICKBED — and that is licensed, concrete, and exactly the sentence the ruling leaves standing.** Burial is `required: true, baseChance: 1` at every tier in the range: `Parish burial grounds` at town, whose desc says *each parish keeps its own ground beside its church, and a parish that has filled its ground buries beyond the gate instead*; `Burial grounds and charnel house` at city, where *the parish grounds inside the walls filled generations ago* and *the carts that go out at dusk are a fixed part of the city's evening*; `Cemetery network` at metropolis (`institutionalCatalog.js:1289-1294, 1835-1840, 2392-2396`). **So the true shape of this town's answer to a sickness is not that the clergy nurse anybody. It is that the parishes are where the dead go, and they are already set up for it.** That is a genuinely grim, genuinely particular, entirely licensed reading of the same two legs, and no shipped row in the block has come near it. ⚠ Keep it a STANDING arrangement (the ground is beside the church, the parishes each keep their own) and never an elapsed course (not *the ground filled after the last outbreak*).
- ⭐ **THE ABSENCE HAS A SHAPE A STRANGER COULD WALK.** The FALSE leg is four named rows missing at once, and two of them are BUILDINGS a town of this size normally has — `Small hospital` at town, `Monastery or friary` at town at a `baseChance` of 0.4 with the desc *Religious community. May operate hospital/school.* (`:1267-1273`). **So this is a town where the monastery roll missed.** What that looks like on the ground is a place with districts, markets and several parishes and **no door anywhere that is for being ill behind.** Not a lack of kindness; a lack of an address.
- ⭐ **WHAT THE TOWN DOES HAVE IS ALMOST CERTAINLY A SHOP.** `Apothecary (established)` sits at the town tier at a `baseChance` of 0.8, tagged `healing`, with the desc *a proper shop with a trained herbalist, stocked inventory, and a back room for consultations… Some double as chirurgeons* — **and `apothecary` matches none of `hasHospital`'s four substrings, so it is invisible to this key and does not disturb the branch** (`institutionalCatalog.js:1166-1171`, `priorityHelpers.js:64`). ⚠ **A face may not ASSERT one** (0.8 is not 1, and floor 1 bars a body the roster may not carry), **but the writer should know it**, because it is the reason the honest sentence here is not *there is nothing* — it is that what there is was never organised for it. The thing the record denies is a SYSTEM, not a remedy.
- **The granary is not an achievement.** `required: true, baseChance: 1` at town and city. **Every place this size has one.** So the `[ledger]` register for the first leg is the flattest possible: it is the thing that is there because places of this size have one, and the record notes it the way a record notes a market square. Any warmth in the sentence belongs to the second leg or to nothing.

---

## VARIANT 2 · vid 2 · `[street]` · slots **NONE** · two sentences

### 2.1 The shipped sentence, verbatim

> The town can eat through a bad year. What it does about a plague is pray and nurse, in that order.

⚠ **THIS VARIANT NAMES NO TOWN AND ITS FOUR FACES MAY NOT EITHER.** `"slots": []` at `defense.generated.js:932`. A face whose slot set differs from its parent's is refused by the projector (ARCH §2.5's face-row refusals). **Every face of vid 2 says *the town* or an equivalent and never `{settlement}`.** That is a constraint and also a gift: this is the one variant in the pool free of the proper-noun opener problem, and it may open on any plain civic fact it likes.

### 2.2 Every claim it makes, on the new test

- **THE TOWN CAN EAT THROUGH A BAD YEAR.** — ⛔ **CONTRADICTED twice over, and it is the stock claim in its most confident form.** (a) The stock: *hasGranary is a TIER PROXY and says nothing whatever about the stock inside it* (the block's set); the live quantity is `foodSecurity.storageMonths`, moved every tick by the pulse (`foodStockpile.js:404-407`). (b) The outcome: **a bad year is exactly what the world pulse adjudicates** — the deficit, the relief, the capacity, the blockade and the `famished` flag are all its arithmetic (`:390-473`) — so this is FLOOR-2b, a prediction the simulation decides, in the same family as the block set's struck *takes this town with ladders*. **The pulse is the record.** ⚠ And the preimage makes it worse than abstract: **this face prints under an ACTIVE FAMINE banner**, where the record is saying on the same screen that the town is not eating through the year.
- **A BAD YEAR IS A THING THAT HAPPENS TO THIS TOWN.** — **SAFE as a conditional frame**, and the granary rows' own descs carry it (*Buffers harvests, prevents famine*, `institutionalCatalog.js:928`). ⚠ Safe only in the subjunctive or the general-conditional; a face that says a bad year is coming, or that the last one was survived, is FLOOR-2b.
- **WHAT THE TOWN DOES ABOUT A PLAGUE IS PRAY.** — **SAFE.** The parishes are present and required across the range, and that the town prays is CULTURE, which the deity doctrine permits. ⚠ **The line it must not cross is theology:** that the town prays is a practice; that the praying helps, that the god answers, that faith holds the sickness off is a theological claim and refused outright. ⭐ Note that the estate has already written this exact idea from inside a different field: the almshouse's residents *receive food and shelter; in return they pray for their benefactors* (`institutionalCatalog.js:1285`). Praying as a recorded civic act is the estate's own register.
- **AND NURSE.** — ⛔ **CONTRADICTED. It is the named-false care clause in one word.** *hasChurch records parishes, not care*. The whole weight of vid 1's finding lands on this single verb.
- **IN THAT ORDER.** — ⛔ **falls with the care claim, and carries its own fault besides.** It asserts a PRIORITY between two practices, which is a judgment about how the town conducts itself that no field holds; and the second of the two practices does not exist in the record. ⚠ The turn is genuinely good writing and the writer will want to save it — **it can only be saved by finding two things the record DOES hold whose order is itself a recorded fact**, and the record holds no such ordering here.
- **THE TOWN HAS AN ANSWER TO A PLAGUE.** — ⛔ **CONTRADICTED by the key's own FALSE leg.** Whatever the town does when a sickness comes, the record's statement about it is that there is no hospital, no monastery, no friary and no healer. **The honest second sentence is about what is not arranged, not about what is done instead.**
- **The two-sentence shape and the flat second-sentence turn.** — not a claim, and it is the best-built thing in the pool. A1 admits one or two sentences; the second sentence is a second FACT of a varied kind and not a gloss of the first (MOVE-GRAMMAR §1.3). **The SHAPE survives the rewrite intact; only the content of the second sentence must go.**

### 2.3 The reads this pool reaches (material for the rewrite of vid 2)

- **The town's own talk about two arrangements: one building that is there because every place this size has one, and no building at all for the other thing.**
- **Prayer as a recorded civic practice**, with the parishes present, plural and required.
- **The four-name medical absence**, which is the whole of the second leg's licensed content.
- **The pool's position between its two named siblings.**
- REACHED BY THE ENGINE AND NOT BY THE KEY: everything in §0.5.2. ⚠ For this variant specifically, the writer must remember that **`plague_onset` is a real stress state this face prints under** and that nothing in the key knows whether it is running.

### 2.4 ⭐ WHAT WOULD BE FALSE HERE (vid 2)

| row | why this variant, specifically |
|---|---|
| **the care reading** | one verb, *nurse*, and it is the named clause. Also barred: *tends*, *treats*, *sees to*, *takes in*, *looks after*, *does what it can for* |
| **a prediction the pulse adjudicates** | *can eat through*, *will get through*, *would last*, *sees out*, *rides out*, *comes through* are each the pulse's verdict taken in advance |
| **the stock** | the first sentence is the stock claim with a verb on it |
| **a theological claim** | the `[street]` angle plus prayer is the one place in DS-DEF-2 where the deity doctrine can actually be broken. **The town praying is safe; the prayer working is not** |
| **the famine and plague banners** | ⛔ this is the variant most exposed to the stress preimage, because both of its sentences are about the two things the banners name. **Nothing reassuring, nothing settled, nothing in the past tense** |

### 2.5 The preimage, as it bites vid 2

See §0.9 whole. This variant carries no slot, so it prints identically on every town in the range with no proper noun to soften it — **the same twelve words on a metropolis with a state granary complex and on a town whose granary is the one required building of its kind.** And the confident first sentence prints under a famine banner on any town the stress roll has touched. ⚠ **`[street]` is the angle that invites a settled, communal, we-know-what-we-do register, and the preimage is the reason that register must stay a description of arrangements rather than of outcomes.**

### 2.6 The angle's stance in one sentence

`[street]` is the town's own talk about its condition (the annex's gloss at `:121`) — so here it may say plainly what the place is set up for and what it is not, in the flat idiom of people who have never had to think about it; **but it may not report what the town gets through, what it manages, or what it has learned**, because those are the pulse's verdicts and an ancestry the record does not hold.

### 2.7 The turns worth keeping

- **The two-sentence shape with the turn at the second sentence.** It is the pool's best structure and it survives the rewrite.
- **The flat, unrhetorical second-sentence opener** (*What it does about X is…*). ⚠ Worth ONE face at most — it is a distinctive construction and four faces of it would be a template rather than a family.
- **Prayer as the named practice** — licensed, and the shipped line's one wholly safe content word.
- **The plague as the thing the second leg is about.** The subject is right; the predicate is wrong.
- What to drop: *can eat through a bad year* (contradicted and a forecast), *nurse* (the named-false clause), *in that order* (falls with it).

### 2.8 What would make the rewrite of vid 2 a regression

Vid 2 not second, or not `[street]`, or **carrying any slot at all**, or fewer than four faces. A face carrying a which-tail, an em dash, a digit, a spelled count, a third sentence, or a summarising second sentence. Any face that predicts an outcome. Any face that asserts the stock. Any face that carries the care reading forward. **Any face that makes prayer efficacious**, which converts a licensed cultural fact into a refused theological one. Four faces that all use the *What it does about X is Y* construction.

### 2.9 ⭐ WHERE THE FLAVOUR IS (vid 2)

- ⭐ **THE ORDINARINESS IS THE FACT, and it is the `[street]` angle's own property.** The granary is `required: true` at town and city: **nobody in this town thinks of it as a provision, because there has never been a version of the place without one.** The parishes are the same — required, plural, one per neighbourhood at city (`:1830`). **So the town's own talk about the first half of this row is no talk at all**, which is a genuinely different sentence from a town congratulating itself, and it is what the record actually supports.
- ⭐ **THE ASYMMETRY IS WHAT A TOWNSMAN WOULD ACTUALLY NAME.** One of these two things has a building, a purpose written on it and a reason everyone can state. The other has a set of parishes whose recorded work is the ground outside the gate. **What someone here would complain about is not that there is no care; it is that the two halves of the same row are not the same kind of thing at all** — and that asymmetry is exactly what the key holds and what no shipped row has said.
- ⭐ **A TOWN THIS SIZE WITH NO HOUSE FOR IT IS A TOWN WHERE THE SICK STAY HOME.** That is not asserted anywhere and nothing denies it: the record holds no hospital, no monastery, no friary and no healer, and a place with districts and several parishes and none of those four has nowhere for anybody to be moved TO. **What the absence looks like on the ground is that nothing moves** — no cart, no door, no ward, no separate place — and the writer may reach for that shape without asserting an act. ⚠ Keep it a standing arrangement of the town and never a narration of an outbreak.
- **What a stranger would avoid.** Nothing, and that is the point: **there is no quarter of this town to keep clear of, because the town has never concentrated the thing anywhere.** The absence of a hospital is also the absence of a place a sickness is known to be.

---

## VARIANT 3 · vid 3 · `[visitor]` · slots `{settlement}`

### 3.1 The shipped sentence, verbatim

> A stranger finds a full store and a modest infirmary at {settlement}, and can see which of the two the town has spent its thinking on.

⭐ **This is the most contradicted single sentence in the pool: it asserts a magnitude the read cannot hold, a stock the read does not reach, a BUILDING the read's own FALSE leg positively excludes, and a decision the record has no field for — four findings in twenty words.**

### 3.2 Every claim it makes, on the new test

- **A STRANGER CAN FIND THESE THINGS BY LOOKING.** — **SAFE as the angle's frame.** `[visitor]` is *what a stranger notices first, without being told* (`RECEIPT_POOLS_DOSSIER_STATE.md:122`), and a granary and parish churches are large, sited, public buildings. The frame is licensed; what the stranger is said to find is not.
- **A STORE EXISTS.** — **SAFE.** It is the granary leg.
- **THE STORE IS FULL.** — ⛔ **CONTRADICTED twice.** (a) The stock: *hasGranary is a TIER PROXY and says nothing whatever about the stock inside it* — **the flag is TRUE on a granary blockaded to the boards** (`foodStockpile.js`'s `blockaded` and `famished` flags, `:418-421`). (b) The magnitude: the read has no band word at all, so *full* measures something nothing measures (floor 2a). **The stockpile is the record.**
- **A MODEST INFIRMARY EXISTS.** — ⛔⛔ **CONTRADICTED at the roster, and this is the hardest single contradiction in the packet, because the sentence asserts the very object class the key's FALSE leg denies.** `hasHospital` is FALSE here, and it matches `hospital`, `monastery`, `healer` and `friary` (`priorityHelpers.js:64`): **there is no hospital, no monastery, no friary and no healer on this town's roster, and an infirmary is a building of exactly that class.** Floor 1, the closed roster: a body the roster does not carry may not be asserted. The block's set adds the same finding from the other side: *hasHospital fires on a first-level divine healer (a person) and on a monastery that MAY run one, so a house that takes in the sick is licensed only on a hospital-named row* — **and this is not a hospital-named row; it is the row where those rows are absent.** ⚠ *Modest* also rates a size nothing holds.
- **THE TOWN HAS SPENT ITS THINKING ON ONE OF THE TWO.** — ⛔ **FLOOR-2b, and it is the pool's clearest example of an ancestry the record does not carry.** There is no decision field, no priority field and no history behind an institution boolean; the block's fence rules that the clauses here are CAPABILITY clauses and never HISTORICAL ones unless the history surface supplies the ancestry, and it does not. ⚠ Sharper still: **the granary is `required: true, baseChance: 1` at town and at city** (`institutionalCatalog.js:926-927, 1591-1592`) — **nobody decided anything.** The town has it because every place of that size has it. The sentence attributes a judgment to a town that made none.
- **A STRANGER CAN SEE THE COMPARISON.** — ⛔ falls with the clause above. The comparison is of two investments the record does not measure, so there is nothing to see.
- **The two things are COMPARABLE, of a kind, sited near one another, weighable against each other.** — **SAFE as a shape and this is what should survive.** The key really does hold two legs of one branch, and R-DA-02 licenses a contrast where the rejected alternative names a sibling. **The comparison is licensed; its terms are not.**

### 3.3 The reads this pool reaches (material for the rewrite of vid 3)

- **Two buildings-classes a stranger can see from the street: the granary, and the parish churches.** Both are large, sited, public and required across nearly the whole range.
- **A third thing a stranger CANNOT see, because it is not there** — and for the visitor angle, that is the strongest licensed move in the pool: **the ABSENCE is what a stranger discovers by looking for something and not finding it**, which is class (a) LACK, flat, and licensed (MOVE-GRAMMAR §1.2 row 11). ⚠ It may not OPEN the variant and may not sit beside a second absence (wall 3).
- **The tier floor**: this is always a town, a city or a metropolis (§0.5.1), so the stranger is always in a place with districts, market squares and more than one parish. **A stranger's frame here can be a walk across a real place, not a glance at a hamlet.**
- REACHED BY THE ENGINE AND NOT BY THE KEY: everything in §0.5.2 — and for this variant especially, **the route and the port, which are DS-DEF-6's surviving lens and the most natural thing for a visitor face to reach for** (§0.7.4).

### 3.4 ⭐ WHAT WOULD BE FALSE HERE (vid 3)

| row | why this variant, specifically |
|---|---|
| **an infirmary, a sick-house, a healer's door, a hospice, a ward** | ⛔ the key's FALSE leg excludes four named roster rows at once. **This is the one contradiction in the pool that a reader could catch from the tab alone**, because the Medical Readiness row beside it prints status `Clergy care`, not a building |
| **a full store, a stocked store, sacks to the roof, a lean store, an empty one** | the stock is not read here in EITHER direction. **A face may not say the granary is full and may not say it is empty** |
| **a decision, a preference, a priority, what the town cares about** | the granary is a required building at this tier. Nobody chose it |
| **the road, the port, the carts, what supplies the place** | DS-DEF-6's `Logistics & Supply` is the one lens on this tab that survived precisely because it owns the granary-against-the-route reading and nothing else can see it (`defenseStateProse.js:1483-1486`). **A visitor face arriving by road is one clause from taking it** |
| **a magnitude** | *full*, *modest*, *considerable*, *a good size*, *a poor one* — the read holds no quantity of any kind |
| **a named person: the man at the granary door, the priest who answers** | product scope, and a pooled face prints identically across a region |

### 3.5 The preimage, as it bites vid 3

See §0.9 whole. The visitor frame is the one most exposed to the TIER SPREAD: the same stranger walks into a town with one required granary and a handful of parishes, and into a metropolis with a state granary complex and parish churches by the hundred (`institutionalCatalog.js:2364-2369, 2505-2510`). **A face that describes the size, the number or the grandeur of either thing is false at one end of that range or the other.** What holds across all of it is that both are PRESENT and public, and that the medical class is ABSENT. ⚠ And the stranger arrives under whatever banner the stress roll set: **a visitor face written as a pleasant arrival prints under a plague-onset banner.**

### 3.6 The angle's stance in one sentence

`[visitor]` is what a stranger notices first, without being told (`:122`) — so here it may report what is visible from the street of a place with districts, and above all **it may report the thing that is looked for and not found**, which is the one angle in the pool that can spend the FALSE leg as an experience rather than as an entry; **but it may not appraise, size, count, or read a town's intentions off its buildings.**

### 3.7 The turns worth keeping

- **The stranger-finds frame**, which suits the pool's two visible buildings. ⚠ The shipped opener *A stranger finds…* is used by the `[visitor]` variants of several sibling pools in this block (`Beasts & Monsters: plagued, perimeter but NO force`, `Invasion & War: walls with NO force`, `Disasters & Famine: NO reserves, NO medical provision` and others). **Wall 10 and R-DA-17 both bear on that: four faces here all opening *A stranger…* would be the template the whole rewrite exists to remove.** Vary the entry across the four.
- **The comparison of the two legs**, kept as a position and never as an appraisal.
- **The absence as something DISCOVERED rather than recorded** — the shipped sibling pool for `NO reserves, NO medical provision` already does this well (*is directed to neither, because there is neither*), and **the same move is available here for the medical half alone.**
- What to drop: *a full store* (contradicted, twice), *a modest infirmary* (contradicted at the roster), *which of the two the town has spent its thinking on* (FLOOR-2b), *modest* and *full* as magnitudes.

### 3.8 What would make the rewrite of vid 3 a regression

Vid 3 not third, or not `[visitor]`, or its slot set not `{settlement}` alone, or fewer than four faces. A face that opens on the `{settlement}` proper slot (T-F8). A face carrying a which-tail, an em dash, a digit, a spelled count, a third sentence, or a summarising second sentence. **Any face asserting a building of the medical class in any word** — infirmary, sick-house, hospice, ward, hospital, healer's door, a house that takes anyone in. Any face asserting the stock in either direction. Any face reading an intention off a building. Any face that opens on the absence or sets two absences side by side. Four faces that all open *A stranger*.

### 3.9 ⭐ WHERE THE FLAVOUR IS (vid 3)

- ⭐⭐ **WHAT A STRANGER WOULD NOTICE IS THAT THE TWO THINGS ARE NOT THE SAME KIND OF BUILDING.** The granary is a single named purpose with a door and a use written on it — *communal grain storage* at town, *multiple large grain stores distribute food across the city. State managed.* at city (`:928, 1593`). The parishes are the opposite: **not one building but several, distributed, one per neighbourhood at city scale** (`:1830`), each with its own ground beside it. **So the town's answer to hunger is a place, and its answer to sickness is a geography.** That is visible from the street, entirely licensed, and no shipped row in the block has used it.
- ⭐ **THE THING A STRANGER WOULD ACTUALLY ASK FOR AND NOT GET IS A DIRECTION.** The sibling pool for `NO reserves, NO medical provision` closes on being *directed to neither, because there is neither* — and half of that experience is available here exactly: **ask for the granary and you are pointed at it; ask where the sick are taken and the question has no address.** ⚠ Keep it as the shape of the town rather than as a narrated encounter with a named person, and give it its own sentence: it is the ABSENCE move and it may not open the variant.
- ⭐ **THE PARISH GROUND IS VISIBLE AND IT IS THE PART A VISITOR READS WRONG.** Every tier in the range has required burial ground beside or beyond the parish — at city, *new ground has been bought outside the gates, and the carts that go out at dusk are a fixed part of the city's evening* (`:1838`). **A stranger arriving in the evening sees the carts and reads them as ordinary, because they are.** That is a licensed, concrete, wholly un-inventoried thing the record makes available, and it says what this pool says without once claiming anybody was nursed.
- **What nobody complains about.** The granary; it is required and universal at this size. **What somebody would complain about is the distance** — with the parishes distributed one per neighbourhood and no single house for the sick, whatever is done is done wherever the person already is. The record does not deny it and the key does not read it.

---

## 4. WHAT THE PACKET LEAVES FOR THE CHAIR

- ⭐ **THE ESTATE CONTRADICTS ITSELF ACROSS SURFACES ON THIS POOL AND THE RULING RESOLVES IT ONLY FOR THE PROSE.** `threatAssessment.js:186` prints *Parish clergy provide basic wound care*, `defenseDisplay.js:237-239` prints status `Clergy care` and note *Parish care. Basic wound and disease management.*, and the block's contradiction set rules the same reading FALSE for this pool's prose. **After this rewrite, the prose paragraph and the expandable row directly beneath it will disagree about whether anybody is cared for.** That is a display-string question, not a corpus one, and it is not this lane's to decide — recorded here so it is not re-found.
- **THE DS-DEF-6 C3 JUSTIFICATION IS TOUCHED.** The three `Medical Readiness` pools are blocked on the ground that this row *speaks BOTH the reserve and the medical halves* (`defenseStateProse.js:1476-1479`). After the rewrite this row speaks the medical half as an ABSENCE rather than as a provision. The block still holds on the reserve half and on the absence, but the justification's wording is now wider than the row's content.
- **THE BADGE AND THE PROSE ARE ON DIFFERENT CLOCKS AND THIS IS THE ONLY ROW IN THE BLOCK WHERE THEY ARE.** The world pulse re-judges `scores.disaster` every tick (`foodStockpile.js:390-473`); the prose key reads three frozen institution booleans. No face can cure this and none should try; it is a wiring observation for whoever owns the composed tab.
- **THE `no reserves, parish care` GAP IS THE CORPUS'S, NOT A BUG.** The desk's docblock says so in its own words (`defenseStateProse.js:572-576`): the situation set is five and not six because the corpus wrote this pool but no matching no-reserves twin, so **for a town with no granary the church is not consulted at all.** Deliberately deferred, documented, not a bug to re-find.
