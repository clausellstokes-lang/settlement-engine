Seat: MARKER (opus), DS-DEF-2 · pool `Disasters & Famine: granary AND hospital` · the skeleton the writer drafts from; nothing here is a face.

# DS-DEF-2 · `Disasters & Famine: granary AND hospital` · SKELETON

Three shipped variants, vids 1 to 3, angles `[ledger]` `[street]` `[counterforce]` in that order. The rows below are the annex's (`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:2700-2703`) and the generated leaf carries the same three texts with the same vids, angles and slot sets (`src/data/dossierStateProse/defense.generated.js:896-918`; the pool's manifest row at `:1354-1368` reads `role: spine`, `variantCount: 3`, `faceCounts: [1,1,1]`, `vids: [1,2,3]`, `readsCount: 1`, `attach: []`). The writer rewrites these three, one for one, and gives each its four `[face]` sub-rows.

⚠ **THE SLOT SETS ARE NOT UNIFORM ACROSS THIS POOL, and that is a wall.** Vid 1 and vid 3 carry `{settlement}`; **vid 2 carries NO SLOT AT ALL** (`"slots": []` at `defense.generated.js:908`). A face's slot set must equal its parent's (ARCH §2.5's face-row refusals), so **vid 2's four faces never name the town** and vid 1's and vid 3's four faces each carry `{settlement}` exactly once. A face that adds the town's name to vid 2, or drops it from vid 1 or vid 3, is refused by the projector before any reader sees it. A sentence-form face may not OPEN on a `proper`-typed slot either (T-F8), so `{settlement}` sits inside the sentence, never first.

**THE TEST THIS PACKET IS MARKED UNDER (ADDENDUM 14, the owner 2026-09-12).** A face is LAWFUL unless it CONTRADICTS the record. Silence is permission. "The card does not license it" is not a finding and the tag `unlicensed` does not appear anywhere below. Claims are tagged SAFE, CONTRADICTED (with the field, file and line, and which of the two is the record) or FLOOR-2.

⭐ **THE ONE THING THE WRITER MUST UNDERSTAND BEFORE THE FIRST WORD: THIS POOL'S SECOND HALF IS NOT A HOSPITAL.** `compound.inst.hasHospital` is a keyword match over the institution roster's NAMES — `hasAny(names, ['hospital','monastery','healer','friary'])` (`src/generators/priorityHelpers.js:64`). At town tier the flag is set by `Small hospital` (`baseChance: 0.3`) **or** by `Monastery or friary`, whose own catalog description reads *"Religious community. May operate hospital/school."* (`src/data/institutionalCatalog.js:1267-1273`) and whose base chance is HIGHER at `0.4`. So on a large share of the towns this pool prints on there is no ward, no bed, no sick-house — there is a religious community that the record declines to say runs one. **All three shipped variants assert a place that takes in the sick, and all three are contradicted on that subset.** The block's own contradiction set rules it in as many words: *a house that takes in the sick is licensed only on a hospital-named row* (`rewrite/rulings-DEF2-v14.txt`). The shipped SPINE survives — this town has both halves of a disaster answer, which its siblings do not — and most of the shipped vocabulary does not.

---

## 0. What the writer reads before the first word

### 0.1 The licence card, printed this session in the dock (`node scripts/prose-licence-card.mjs DS-DEF-2 'Disasters & Famine: granary AND hospital'`)

```
LICENCE (block DS-DEF-2 · role spine · key `Disasters & Famine: granary AND hospital`)
  reads:      disasterRowSituation(granary, hospital, church) (via DISASTER_ROW_POOL in
              defenseStateProse.js)
              (absent ⇒ no candidate; a modifier is silent, never "false")
  predicate:  disasterRowSituation(granary, hospital, church) === granary, hospital
  bag:        {band: RESERVED, route: proper, settlement: proper}
              FILLED at this block's call sites: {settlement}
  relation:   (a spine takes no relation)
  seat/form:  (not a seat-taker) / sentence      move: (none declared)
              angle: counterforce ledger street
  attach:     (empty: a spine takes no attach set)
  echo:       spine mounts 1 (tabs: defense) · modifier mounts 0 (none)
              the echo table is keyed on this pool's WHOLE table-rung reading (truncated at
              the file's first dot) and NOT on a producer-token root, so every pool that
              selects a row of `DISASTER_ROW_POOL` shares ONE echo key: a mount counted
              there may be a sibling ROW of the same table
  covert:     no
  source:     (none) · standing SOURCE-UNRESOLVED
              NO citation is licensed: a face naming a record holder here is refused by A13
  THE TEST (ADDENDUM 14): a face is LAWFUL unless it CONTRADICTS the record. SILENCE IN THE
              RECORD IS PERMISSION. "The card does not license it" is NOT a finding. This
              card says what the read REACHES, never the bounds of what may be written.
  may claim:  that the reader `disasterRowSituation(granary, hospital, church)` selects the
              row `granary, hospital` of `DISASTER_ROW_POOL` in `defenseStateProse.js`, as a
              STANDING fact of the record
  may NOT:    a magnitude outside the read's own band word (floor 2a), an elapsed course, a
              dated cause or a season (floor 2b), a prediction the pulse adjudicates
              (floor 2b), another civic object of the class `care`
  audience:   player (no mark)
  REFUSED COLUMNS, always: a totality over persons; an exemption from a duty (whoIsExempt is
              null everywhere); a named character and that character's fate (product scope);
              a theological claim about a deity (the deity doctrine)
```

⚠ **Four card lines are load-bearing here, and two of them are stricter on this pool than on any other row of the block.**

1. **`may NOT: a magnitude outside the read's own band word` — AND THIS READ HAS NO BAND WORD AT ALL.** Alone among the five threat rows, rows 1, 2, 3 and 5 are keyed on BOOLEANS; only row 4 (`Economic Survival`) carries a band word. So on this pool the magnitude floor is total: the read is `true × true` and nothing else. **No face may say how much grain, how many beds, how many months, how long, how deep, how full, how many sick, or how bad a year.** Not a figure, not a spelled count, not "a year", not "a season", not "weeks", not "enough". The record knows that the buildings are on the roster and nothing whatever about what is inside them.
2. **`may NOT: another civic object of the class `care``.** The medical half is ONE roster row. A face may not add a second: no apothecary, no almshouse, no midwife, no herbalist, no infirmary beside the thing the flag names. (The apothecary rows exist in the catalog — `Apothecary` at village, `Apothecary (established)` at town, `Apothecary district` at city — and set no flag this pool reads.)
3. **`source: (none) · SOURCE-UNRESOLVED`.** No holder resolves for this reading, so **no face may name a record or its keeper** — not the granary's tally, not the sexton's register, not the almoner's book, not the parish roll, not "the count", not "the books". Arm A13 refuses the face outright. The `[ledger]` angle must find its voice in the ORDER and the FLATNESS of the sentence, never in a named record.
4. **`covert: no` and `audience: player`.** Every face here is read by the player; there is no DM twin to carry the harder reading, and there is no pen line. Whatever the writer will not say to a player is simply not said.

### 0.2 The block's header lines (annex lines 2567 to 2592, the parts that bind this pool)

- **RECEIPT:** `src/domain/display/threatAssessment.js:28-195` (`buildThreatAssessment`) · rendered `src/components/new/tabs/DefenseTab.jsx:150-183` · the walls predicate `src/domain/causalState.js:300-315` (`defenseProfileHasWalls`).
- **STATE-KEY:** five fixed rows (`Beasts & Monsters` · `Invasion & War` · `Internal Security` · `Economic Survival` · `Disasters & Famine`), each with a `scoreBand` badge rendered beside the prose, read against `config.monsterThreat`, the institution presence flags, and `compound.inst`. This pool is **row 5's `granary && hospital` branch** — the first branch of a four-way tree, and the only one of the five that reads THREE flags and consults only two of them.
- **SLOTS:** the block declares `{settlement}` `{band}` `{route}`; only `{settlement}` is filled at this block's call sites, and this pool's three parents are NOT uniform. See the wall above.
- **SECTION-TARGET:** `defense`.
- **PROVENANCE + FENCE.** The header's binding sentence for this pool: *institution presence is a STANDING fact with no recorded history; the causal clauses here are **capability** clauses and never **historical** ones unless the history surface supplies the ancestry.* On this row that means the granary and the medical house may be stated as things the town HAS and things they are FOR. They may not be stated as things that have already carried the town through anything, and they may not be stated as things that will.

### 0.3 The register card's six one-line registers — the DOSSIER line is this pool's

> *The dossier: the record itself; the clerk's third person; the six shapes of its closed set; the town's name is not the default opener.*

The other five are named so the writer knows which voices are NOT in reach here: the NPC ladder (read aloud, role-bound), the Herald (the estate's one quoted in-world voice), the chronicle (a borrowed body of headlines), the DM page (candid, second person to the referee), and chrome/the docent (the product speaking to the person who runs it). **A face here that addresses anybody, quotes anybody, or grades anything has left the register.**

The card's three questions before any sentence ships: *Which field licenses it? Which claims does it carry, and are they the same claims as before? What does it leave standing open?*

### 0.4 The owner's rules that bind every face, restated once

Four wording FACES per semantic variant, each a different vocabulary or rhythm inside the voice, never a paraphrase of its sibling. Never trim. An unweighted seeded roll picks the face at render, so **every face must stand alone** and must read well immediately after the spine and after any sibling modifier — the writer does not choose its place. The exemplar, not the practical. No em dash, no exclamation mark, no digit or percent in a connective, no which-clause. THE THREAD: an added sentence carries a noun forward from the one before it, or its change of subject is the passage's one turn outward and sits last.

⚠ **THE NO-DIGIT RULE AND THE MAGNITUDE FLOOR COINCIDE ON THIS ROW.** The page around this sentence prints figures at every side — the readiness bar is drawn at `width: ${sc}%` and the row's own numeric score is computed at `DefenseTab.jsx:185` as `scores.disaster ?? foodSecurity.resilienceScore ?? Math.round(((econ*0.4)+(granary?60:20)+(hospital?70:church?40:10))/2)`. The prose is the one place on that row where the reader gets the state and never the number. **No face may carry a quantity in any form.**

### 0.5 ⭐ THE READS THIS POOL REACHES — MATERIAL a writer may use, never a bound on what may be written

| what | where | what it actually is |
|---|---|---|
| the key function | `src/domain/display/stateProse/defenseStateProse.js:580-586` (`disasterRowSituation`), `:592-594` (`disasterRowPoolKey`) | `if (granary) { if (hospital) return 'granary, hospital'; return church ? … : … } return hospital ? … : …` — this pool is the FIRST branch and the only one that never consults `church` |
| the table | `defenseStateProse.js:548-554` (`DISASTER_ROW_POOL`) | five rows, TOTAL over the situations the corpus carries; this lens is never silent |
| `compound.inst.hasGranary` | `src/generators/priorityHelpers.js:63` | `hasAny(names, ['granar'])` — a substring match over the roster's names |
| `compound.inst.hasHospital` | `src/generators/priorityHelpers.js:64` | `hasAny(names, ['hospital','monastery','healer','friary'])` — a substring match over FOUR keywords, three of which are not hospitals |
| `compound.inst.hasChurch` | `src/generators/priorityHelpers.js:65` | READ by the key function and NOT CONSULTED on this branch — the writer knows nothing about the parish here, either way |
| `{settlement}` | `defenseStateProse.js` (`properFill(text(settlement?.name))`) | the town's own name, a `proper`-typed slot |
| the producer's own prose for this row | `src/domain/display/threatAssessment.js:181-190` | *"Granary provides food buffer. The community can absorb a bad harvest without immediate hardship."* + *"Hospital infrastructure enables disease containment and systematic quarantine."* |

**The producer's two sentences are the record's own reading of this branch, and the writer should note what they do NOT say.** They say the granary *provides a buffer* and the hospital *enables containment and quarantine* — CAPABILITIES, both. Neither says the town has come through anything, and neither says it will. The shipped variants all turned the capability into an outcome, and that is the pool's structural fault rather than a wording problem.

**Material the record holds that is silent on this pool and is therefore the writer's** (silence is permission — none of these may be ASSERTED as facts of this town, but all of them are the world the sentence sits in): the granary rows' own descriptions, the medical rows' own descriptions, the fact that both classes of house are charitable and religious in origin, the fact that the granary at city tier is state-managed, and the whole shape of what a town-plus settlement carries beside them. §0.9 and the three `⭐ WHERE THE FLAVOUR IS` sections spend this.

### 0.6 The provenance move, priced for this pool: ZERO, and it is a wall rather than a recommendation

The card prints `source: (none) · standing SOURCE-UNRESOLVED`, so arm A13 refuses any face that names the holder of this record. The exemplar registers with raw text cite at zero per seven hundred and eighty-six sentences (Part B §24), so this is also the norm and not a deprivation. **The temptation on this pool is specific and must be named: the granary and the hospital are both institutions that keep books, and every one of those books is barred.** No tally, no almoner, no sexton, no register, no roll, no return.

### 0.7 ⭐ THE PAGE AROUND THE SENTENCE — and on this row the neighbourhood is the densest in the block

#### 0.7.1 The four sibling prose rows on this block, which print above this one on every town

`buildThreatAssessment` returns five rows in a fixed order and this pool is the FIFTH. So the reader has already read four sentences from this same desk in this same voice before reaching it: the beasts row, the invasion row, the internal-security row, and the economic-survival row. **A face that opens on the settlement token is the fifth in a column that has already opened on it up to four times** — R-DA-17's ceiling and MOVE-GRAMMAR wall 10 both bite here, and vid 2 carries no slot at all, which is the pool's own relief valve.

#### 0.7.2 ⛔ THE SHARPEST HAZARD IN THE PACKET: another desk speaks about THIS GRANARY, in prose, on THIS TAB

`DS-DEF-6 · Defense › Supporting capabilities` mounts its `logistics` lens on the same page (`defenseStateProse.js:1648-1651`, rendered through `supportingLines` at `DefenseTab.jsx`), and its key function is `supplyLogisticsPoolKey(hasGranary, hasPort, tradeRouteAccess)` — **the same `hasGranary` flag this pool reads.** Its three granary pools ship these first lines:

- `Logistics & Supply: Granary + port` — *"{settlement} holds stored food and keeps the sea; …"*
- `Logistics & Supply: Granary in isolation` — *"{settlement} holds reserves and nothing else; …"*
- `Logistics & Supply: Granary with road supply` — *"{settlement} keeps stores and is fed by the roads; …"*

⛔ **This pool's shipped vid 1 opens `{settlement} holds food against a bad year`. On a granary town, one of the three sentences above prints a few rows below it on the same tab.** `holds stored food` / `holds reserves` / `keeps stores` against `holds food` is a same-page echo of the same fact in the same construction, and A11's spread arms and the sibling-distance arm both read it. **The writer must put the granary into a construction that none of those three uses.** This is the single most valuable thing in the packet for the draft.

#### 0.7.3 The status table on the same tab prints both halves as labels, with notes

`deriveSupportingCapabilities` (`src/domain/display/defenseDisplay.js:236-246`) renders two rows the reader can see at once:

- **Medical Readiness** — status `Hospital present`, note *"Casualty treatment, outbreak containment, recovery capacity."*
- **Logistics & Supply** — status `Granary present`, note one of *"Granary + sea access. Historically the hardest siege posture to break."* / *"Granary in isolation. Endurance depends entirely on stored reserves."* / *"Granary with road supply. Cut the roads, cut the supply."*

⚠ **The third of those varies on `tradeRouteAccess`, which this pool does not read.** A face that says anything about how supply reaches the town, or about roads, or about the sea, will be right on one town and wrong beside the note on the next. **Say nothing about how the food gets there.**

#### 0.7.4 The numeric badge beside this very row can disagree with the prose

`DefenseTab.jsx:185` computes this row's score as `scores.disaster ?? foodSecurity.resilienceScore ?? …`, and `scores.disaster` is `resilience × disasterGate` where `disasterGate = min(1, 0.55 + econOutput/50 × 0.45)` (`src/generators/defenseGenerator.js:608-617`). **A town with a granary and a hospital and a poor economy prints a LOW number beside a prose row about having both.** The prose does not read the score and must not sound as though it did: no face may rate the arrangement, call it strong, adequate, good, or sufficient, or otherwise speak the badge's job.

### 0.8 ⭐ WHAT WOULD BE FALSE HERE — the contradiction rows THIS key can walk into, and the CLOSED ROSTERS

**From the block's own contradiction set (`rewrite/rulings-DEF2-v14.txt`), the rows this key can actually reach:**

| # | the row, as ruled | the field | what it forbids on this pool |
|---|---|---|---|
| C1 | *`hasGranary` is a TIER PROXY (every town-plus, no village-and-below) and says nothing whatever about the stock inside it* | `compound.inst.hasGranary` · `priorityHelpers.js:63` | no face says the store is full, deep, well-kept, stocked, sufficient, or that the town has grain enough; the record holds the BUILDING and not the grain |
| C2 | *`hasHospital` fires on a first-level divine healer (a person) and on a monastery that MAY run one, so a house that takes in the sick is licensed only on a hospital-named row* | `compound.inst.hasHospital` · `priorityHelpers.js:64` · the roster row `institutionalCatalog.js:1267-1273` | no face asserts a ward, a bed, a sick-house, a surgeon, a quarantine, or "somewhere to put the sick" — the sentence must be true of a religious community too |
| C3 | *`hasChurch` fires on every hamlet from a church in ANOTHER settlement and records parishes rather than care* | `compound.inst.hasChurch` · `priorityHelpers.js:65` | the sibling pool's shipped clause *"clergy who tend the sick"* is one of the four the rulings name as still FALSE; it may not be imported here, and the church is not consulted on this branch at all |
| C4 | *the readiness band word is exactly the ladder's reading and a badge on one arm says nothing of another* | `defenseProfile.scores` | no face borrows the `Economic Survival` band, the walls, the muster, or any other row's posture to explain this one |
| C5 | *none of the five key functions reads `config.stressTypes`, so a face about a quiet gate can print under an ACTIVE SIEGE banner* | `config.stressTypes` | see §0.9 — this is the hardest wall on this particular pool, because two of the stress types are exactly this row's two subjects |
| C6 | *the ENGINE MEANINGS: `plagued` is MONSTER ACTIVITY and never disease* | `config.monsterThreat` | a face reaching for plague vocabulary must never touch the word `plagued`, which on this desk means creatures |

**⛔ THE CLOSED ROSTERS THIS POOL TOUCHES — a body the roster does not carry may not be asserted.**

**(a) The granary roster.** Exactly three native catalog names can set `hasGranary`:

| name | tier | odds | the catalog's own description |
|---|---|---|---|
| `Town granary` (`institutionalCatalog.js:925-931`) | town | `required: true, baseChance: 1` | *"Communal grain storage. Buffers harvests, prevents famine."* |
| `City granaries` (`:1590-1596`) | city | `required: true, baseChance: 1` | *"Multiple large grain stores distribute food across the city. State managed."* |
| `State granary complex` (`:2505-2510`) | metropolis | — | *"State-administered granary network holding strategic reserves."* |

⛔ **There is NO village, hamlet or thorp granary row.** ⛔ **There is no grain pit, no tithe barn, no storehouse, no silo, no corn loft** — the recorded object is the granary, and it is singular at town, PLURAL at city, and a NETWORK at metropolis. A face that says "the granary" is right at town and wrong at city.

**(b) The medical roster.** The names that can set `hasHospital` on a town-plus settlement:

| name | tier | odds | the catalog's own description |
|---|---|---|---|
| `Small hospital` (`:1275-1281`) | town | `0.3` | *"Care for sick poor. Usually religious-run."* |
| `Monastery or friary` (`:1267-1273`) | town | `0.4` | *"Religious community. May operate hospital/school."* |
| `Major hospital` (`:1814-1820`) | city | `0.5` | *"Large facility for sick poor."* (a bed count follows; it is a magnitude and is barred) |
| `Multiple monasteries` (`:1805-1812`) | city | `0.6` | *"Different religious orders."* |
| `Hospital network` (`:2385-2391`) | metropolis | `0.55` | *"Multiple hospitals and infirmaries across districts. Organized medical care at population scale."* |
| `Major monasteries (5-10)` (`:2378-2384`) | metropolis | `0.55` | *"Five to ten major monastic houses: scholarly, contemplative, and charitable functions at scale."* |

⛔ **On every tier the monastic row is at least as likely as the hospital row, and at town tier it is likelier.** ⛔ **`Almshouse` (town, `0.3`) and `Foundling home` (city, `0.2`) are tagged `healing` and set NO flag this pool reads** — a town may be thick with charitable houses and still take this branch from one name only. ⛔ **`Healer (divine, 1st level)` (village, `0.4`) sets the flag but is unreachable here**, because its tier carries no granary and tier catalogs do not merge downward (`src/generators/steps/assembleInstitutions.js:244` merges only city into metropolis).

**(c) Custom content is OUT.** `nativeSemanticNames` returns the empty string for any materialized custom entity (`src/domain/content/customContentSemanticAuthority.js:38-47`), so a player's bespoke hall named "State Granary" grants no flag. **The roster that fires this pool is the native catalog alone**, and the writer may therefore rely on the six-plus-three names above being the whole world of this reading.

**(d) Not a faith pool.** No deity axis, no pantheon rank, no settlement standing, no suppressed flag is in reach. The medical house is religious in the roster's own descriptions, and that is a fact about an INSTITUTION's origin, never a theological claim — the deity doctrine bars the second and says nothing about the first.

### 0.9 ⭐ THE PREIMAGE — the range of towns this key selects

**The key is a pair of BOOLEANS, so one face prints across every country, culture, terrain and stress state the pair admits.** `config.monsterThreat` may be `plagued`, `frontier` or `settled`; the town may be walled or open, garrisoned or bare, prosperous or destitute; the key reads none of it.

**The ONE narrowing the pool does get, and the writer may lean on it: this pool is TOWN-PLUS.** No village-or-below roster row contains `granar`, and the three that do are `required: true, baseChance: 1` at town and city (`assembleInstitutions.js:282` includes every required row unless a world law or a `forceExclude` toggle removes it). **Two consequences follow and both matter:**

1. Essentially every town, city and metropolis carries a granary. **The granary half of this key is near-constant across the preimage, and the MEDICAL half is what actually distinguishes this pool from its two granary siblings.** A face that spends its whole energy on the grain is spending it on the part that is nearly always true.
2. The town is town-sized or larger. It has a market square, a parish with burial grounds, a watch of some kind. **A face may safely assume a settlement of that scale and may not assume anything finer.**

⛔ **THE HARDEST WALL: the key reads no stress field, and two of the engine's stress types are this row's own two subjects.** `config.stressTypes` may carry `famine`, `plague_onset`, `under_siege`, `occupied`, `indebted`, `politically_fractured` or `insurgency` (`priorityHelpers.js:292-300`), and `foodGenerator.js:341-343` writes `foodSecurity.label = 'Deficit — Active Famine'` whenever the famine stress is set. **A face that says a failed harvest does not become a catastrophe here prints, on that subset, beside a banner reading Active Famine.** The same face prints on a town under siege whose stores are being counted down by the world pulse. Write nothing about an outcome; write about what the town HAS.

**The lawful contrast, and it is the only one.** MOVE-GRAMMAR wall 5 licenses a CONTRAST only where the rejected alternative names a SIBLING POOL KEY or a sibling band. This pool has four siblings in the same table and they are the whole of what may be contrasted against: `granary AND parish care only`, `granary, NO medical provision`, `NO reserves, hospital present`, `NO reserves, NO medical provision`. **A face may set this town against a town with the store and no medicine, or the medicine and no store. It may not set it against luck, against chance, against most places, or against nothing at all.**

---

## VARIANT 1 · vid 1 · `[ledger]` · slots `{settlement}` · canonical at index zero

### 1.1 The shipped sentence, verbatim

> `[ledger]` {settlement} holds food against a bad year and has somewhere to put the sick; between them the town can take a failed harvest or an outbreak without either becoming a catastrophe.

⚠ This is the producer's own two sentences compressed into one and then pushed one step further than they go. `threatAssessment.js:181-190` reads *"Granary provides food buffer. The community can absorb a bad harvest without immediate hardship."* and *"Hospital infrastructure enables disease containment and systematic quarantine."* The producer stops at CAPABILITY; the shipped variant converts it to OUTCOME. Both of this variant's real faults are inherited from that one move.

### 1.2 Every claim it makes, on the new test

| # | the claim | verdict |
|---|---|---|
| 1 | The town holds stored food. | **SAFE** — `hasGranary` is true by predicate, and the roster rows are `required: true, baseChance: 1` at town and city. |
| 2 | The stored food is held AGAINST a bad year — that is what it is for. | **SAFE** on the purpose reading; the catalog's own description says *"Buffers harvests, prevents famine."* ⚠ **The magnitude reading is FLOOR-2 and the writer must not sharpen it:** `foodGenerator.js:158-165` computes `storageMonths` as five at a town granary, seven at a city's, twelve at a metropolis complex, and this pool reads none of it. "A bad year" must stay a purpose and must never become a duration. |
| 3 | The town has somewhere to put the sick. | ⛔ **CONTRADICTED.** FIELD `compound.inst.hasHospital`, `src/generators/priorityHelpers.js:64`, matching the roster row `Monastery or friary` at `src/data/institutionalCatalog.js:1267-1273`, whose own description is *"Religious community. May operate hospital/school."* **The roster is the record.** On the monastic branch — the LIKELIER branch at town tier — there is no place that takes in the sick, only a house that might. The rulings row C2 states the rule directly. |
| 4 | A failed harvest does not become a catastrophe here. | ⛔ **CONTRADICTED** on the famine subset. FIELD `config.stressTypes` → `foodSecurity.label`, `src/generators/foodGenerator.js:341-343`, which writes `'Deficit — Active Famine'` on a town this key selects without consulting it. **The stress field is the record.** |
| 5 | An outbreak does not become a catastrophe here. | ⛔ **CONTRADICTED** on the `plague_onset` subset, same field and same reason (`priorityHelpers.js:292-300`). |
| 6 | The two together are what produce that outcome ("between them"). | **FLOOR-2** — a prediction the pulse adjudicates, and an elapsed course. The producer's verbs are *provides* and *enables*; the variant's is *can take*, which is a claim about an event that has not happened. |
| 7 | The two things are distinct. | **SAFE** — `granar` and the hospital keywords are disjoint substrings and resolve to separate roster rows. |

### 1.3 The reads this pool reaches (material for the rewrite of vid 1)

§0.5 whole. For the `[ledger]` angle specifically, the material worth reaching for is the ROSTER's own character rather than any quantity: the granary is *communal* at town and *state managed* at city; the medical house is, on every tier, a charitable and religious foundation. Those are facts the record holds about what KIND of thing each is, and a ledger sentence that states a kind is stating a fact.

### 1.4 ⭐ WHAT WOULD BE FALSE HERE (vid 1)

C1, C2, C4 and C5 from §0.8 all bite this variant. The two that will decide the rewrite:

- ⛔ **"somewhere to put the sick" is the contradicted clause** and no synonym rescues it: a ward, a house for the sick, a place for the ill, a roof for the fevered, beds — all assert the same thing the monastic branch denies. **The lawful form names the town's capacity to ANSWER sickness, not a room it puts sickness in.**
- ⛔ **"without either becoming a catastrophe" is the contradicted outcome** and no hedge rescues it either, because a hedge would be a modality the card does not carry and the register card bars a forecast in any mood. **The lawful form states what stands, and lets the reader draw the consequence.**

Also barred: the settlement token as the OPENER is arithmetically expensive here (this is the fifth row from one desk on one tab — §0.7.1), and `{settlement}` may not open a sentence-form face at all (T-F8).

### 1.5 The preimage, as it bites vid 1

This is the canonical-at-zero variant: it is what a falsy seed draws and what the annex's canonical form keeps live. **It therefore prints on the widest slice of the preimage of any of the three**, including every famine town, every besieged town and every monastic-flag town. A face here must be true of a metropolis with a granary network and a scholarly monastery, and of a town with one communal store and one small hospital, and of both while a famine banner is on the page.

### 1.6 The angle's stance in one sentence

`[ledger]` is the compiled record stating what the town holds, in the order a clerk sets it down — **the two standing facts and the relation between them, flat, with no verdict and no outcome.**

### 1.7 The turns worth keeping

- **`holds food against a bad year`** — the PURPOSE construction is sound and is the producer's own reading; but see §0.7.2, because `holds` collides with DS-DEF-6's `holds stored food` / `holds reserves` on the same page. Keep the idea, change the verb.
- **`between them`** — a genuinely good joint: it states that the two facts combine without saying what they produce. This is the one clause in the pool worth carrying verbatim into a face.
- **The semicolon** — R-DA-06 licenses one joint per variant and the shipped placement is correct: two standing facts, then the relation. The rhythm is right even where the claims are not.

### 1.8 What would make the rewrite of vid 1 a regression

Trading the density for plainness with no law behind the change (the density law, Part B §21.4). Replacing the contradicted outcome clause with a hedge instead of with a fact. Dropping the second half of the pool's discriminating claim — **the whole point of this key against its siblings is that BOTH halves are present, so a face that names only the grain has lost the pool.** And adding a citation, which the card refuses outright.

### 1.9 ⭐ WHERE THE FLAVOUR IS (vid 1)

- **Both of this row's buildings are charities, and nobody has written that.** The granary is *communal* grain storage; the hospital is *"Care for sick poor. Usually religious-run."* The town's answer to hunger and its answer to sickness are the SAME KIND of answer — an endowed house that takes in people who cannot pay — and the pool's two halves are therefore one institution twice, not two unrelated buildings. That is a real, particular, unused reading of this exact state.
- **At city tier the store is STATE MANAGED** (`institutionalCatalog.js:1590-1596`), which means the reserve is not the town's to open. A stranger notices a building the town cannot unlock. The record holds this and no shipped row has touched it.
- **What a stranger would actually notice is the SIZE of the doors and the absence of a queue.** The record says the buildings are there; it says nothing about what is in them, and a sentence that notices the building and declines the inventory is exactly what the record knows and exactly what the shipped row failed to do.

---

## VARIANT 2 · vid 2 · `[street]` · **NO SLOT** — this variant never names the town

### 2.1 The shipped sentence, verbatim

> `[street]` The town has a place for grain and a place for the ill, and knows exactly what having both is worth.

⚠ **`"slots": []` at `defense.generated.js:908`.** All four of this variant's faces are written without `{settlement}`. This is a gift rather than a constraint: it is the pool's one relief from a tab that has already opened on the town's name up to four times (§0.7.1).

### 2.2 Every claim it makes, on the new test

| # | the claim | verdict |
|---|---|---|
| 1 | There is a place for grain. | **SAFE** — the granary is a roster row and a building. |
| 2 | There is a place for the ill. | ⛔ **CONTRADICTED.** Same field, file and line as vid 1's claim 3: `compound.inst.hasHospital` at `priorityHelpers.js:64` matching `Monastery or friary` at `institutionalCatalog.js:1267-1273`. **The roster is the record.** The parallel construction makes it worse rather than better — it asserts that the two are the same kind of building, and on the monastic branch the second is a religious community that keeps no such place. |
| 3 | The two are a matched pair, one for each disaster. | **SAFE** as a statement of what the town holds; ⚠ the parallelism is carrying claim 2 and falls with it. |
| 4 | The town knows what having both is worth. | **SAFE on the test** — nothing in the record denies it, and "the town" reads as the civic body rather than as a totality over persons, so the REFUSED COLUMNS line is not engaged. ⚠ **But it is the MEANING move, which does not exist anywhere in the estate** (MOVE-GRAMMAR §1.3: no field holds what a fact means; a second clause is a second FACT of a varied kind or nothing). It is also the summarising beat arm Q was written for. **The writer should expect a refuter to name it, and should replace it with a second fact rather than defend it.** |
| 5 | The town knows it EXACTLY. | **FLOOR-2** — "exactly" is a magnitude word attached to a valuation, on a read that carries no magnitude at all. |

### 2.3 The reads this pool reaches (material for the rewrite of vid 2)

§0.5 whole. The `[street]` angle's material is the part of the roster a person on the street would meet: two buildings that are open to people who cannot pay, a store that is communal at town and state-run at city, a house of religion that takes in the sick poor. **None of it is a quantity, which suits this angle — the street does not count.**

### 2.4 ⭐ WHAT WOULD BE FALSE HERE (vid 2)

- ⛔ **"a place for the ill"** is the contradicted clause; see C2 and vid 1's §1.4. The parallel `a place for X and a place for Y` construction is precisely the shape the roster refuses, because it makes the two rows the same kind of thing.
- ⛔ **C1 bites the first half too if a face sharpens it:** "a place for grain" is safe because it names a building; "grain in the place" is not, because the record holds no stock.
- ⛔ **The face may not name the town**, in any form, including a demonstrative that does the naming's work.
- ⚠ **C5 (the stress preimage):** a street face about a town that is comfortable with its arrangements prints under an Active Famine banner. The `[street]` angle is the most exposed of the three to this, because its whole stance is how the arrangement FEELS to live beside.

### 2.5 The preimage, as it bites vid 2

Slotless, so it prints identically on every town the key selects — the writer gets no discriminating handle at all and must write a sentence that is true of a metropolis and of a small town without either sounding like the other's. **The compensation is that the sentence never has to carry a proper noun, so its rhythm is free.**

### 2.6 The angle's stance in one sentence

`[street]` is the town as the town experiences its own arrangements — **what an ordinary week looks like with both of these houses standing, stated as a fact of the place and never as a mood.**

### 2.7 The turns worth keeping

- **The parallel pair as a SHAPE** — *a place for X and a place for Y* is the right rhythm for this pool, because the pool IS a pair. The shape is worth keeping; the second half's noun is what has to move.
- **`having both`** — the phrase that names the pool's discriminating claim in two words, and the cheapest way any face will ever name it. Worth carrying.
- **The slotless opening on `The town`** — correct for a fifth row on a tab that has said the name four times.

### 2.8 What would make the rewrite of vid 2 a regression

Adding `{settlement}` (refused by the projector). Trading the pair-shape for a single clause, which loses the discriminating claim. Replacing the gloss with a second gloss. Making the street angle sound like the ledger angle — the pool's sibling distance is measured, and these two are the closest pair in it.

### 2.9 ⭐ WHERE THE FLAVOUR IS (vid 2)

- **Both houses are for the people who cannot pay.** The store is communal; the hospital is *"Care for sick poor."* **What a person on the street would actually notice is that a man with money uses neither** — he buys grain at the market square (a `required` row at every town-plus tier) and he pays a physician or an apothecary (`Apothecary (established)`, town). The two buildings this row is about are the ones you go to when you have run out of the other options, and that is a concrete social fact the record's own descriptions hold and no shipped row has used.
- **What someone would avoid or complain about:** at city tier the granary is *state managed*, so the town's own people cannot open it; the decision belongs elsewhere. A complaint about a full store you are not allowed into is the most street-level thing this state makes available.
- **What the absence looks like on the ground** is visible right beside it: the siblings of this key are towns with the store and no medicine, or the medicine and no store, and the street in those towns knows which one it is. The contrast is lawful (§0.9) and it is the only contrast that is.

---

## VARIANT 3 · vid 3 · `[counterforce]` · slots `{settlement}` · **the most damaged of the three**

### 3.1 The shipped sentence, verbatim

> `[counterforce]` Neither a failed harvest nor an outbreak turns into a catastrophe at {settlement}, and the reason is in the two buildings rather than in the luck.

### 3.2 Every claim it makes, on the new test

| # | the claim | verdict |
|---|---|---|
| 1 | A failed harvest does not turn into a catastrophe here. | ⛔ **CONTRADICTED** on the famine subset. FIELD `config.stressTypes` → `foodSecurity.label = 'Deficit — Active Famine'`, `src/generators/foodGenerator.js:341-343`. **The stress field is the record.** ⚠ **Worse than vid 1's version:** the present indicative states it as a standing universal rather than a capacity, so there is no reading on which it is merely optimistic. |
| 2 | An outbreak does not turn into a catastrophe here. | ⛔ **CONTRADICTED** on the `plague_onset` subset, `priorityHelpers.js:292-300`. |
| 3 | Both outcomes are governed by the same two things. | **FLOOR-2** — a prediction the pulse adjudicates. |
| 4 | There are exactly TWO buildings. | ⛔ **CONTRADICTED** on the city and metropolis branches. FIELD `compound.inst`, read against the roster: `City granaries` is *"Multiple large grain stores"* (`institutionalCatalog.js:1590-1596`), `State granary complex` is a *"network"* (`:2505-2510`), `Multiple monasteries` is plural by name (`:1805-1812`), `Hospital network` is *"Multiple hospitals and infirmaries across districts"* (`:2385-2391`), and `Major monasteries (5-10)` is five to ten houses (`:2378-2384`). **The roster is the record, and it counts higher than two on most of this pool's larger towns.** |
| 5 | Both of them are BUILDINGS. | ⛔ **CONTRADICTED** on the monastic branch: `Monastery or friary` is a *"Religious community"* and `Major monasteries (5-10)` are *"monastic houses"* with *"scholarly, contemplative, and charitable functions"* — a community and its functions, not a building that answers sickness. Same field and line as vid 1's claim 3. |
| 6 | The reason is the buildings RATHER THAN luck. | **SAFE on the test** — nothing in the record denies it. ⛔ **But it breaches MOVE-GRAMMAR wall 5 and R-DA-02:** a CONTRAST is licensed only where the rejected alternative names a sibling pool key or a sibling band, and `luck` names neither. This is a manufactured antithesis, the exact shape the antithesis arm counts. **The lawful rejected alternative is a sibling row** (§0.9). |
| 7 | The town is named. | **SAFE** — `{settlement}`, correctly placed inside the sentence rather than at its head. |

### 3.3 The reads this pool reaches (material for the rewrite of vid 3)

§0.5 whole. For `[counterforce]`, the usable material is the pool's position in its own table: this is the FIRST branch of a four-way tree, and its three siblings are the states this town is not in. **The counterforce reading of this key is that the town has closed BOTH doors that its siblings leave open, and that reading is licensed by the sibling keys themselves.**

### 3.4 ⭐ WHAT WOULD BE FALSE HERE (vid 3)

Every row of §0.8 except C6 reaches this variant, and it is the only one of the three that walks into C1 (the count), C2 (the building), and C5 (the stress) at once.

- ⛔ **"the two buildings" must go** — it is a COUNT, which the magnitude floor bars on a boolean read, and it is contradicted by the roster's plural rows.
- ⛔ **"turns into a catastrophe" must go** — present-indicative outcome, contradicted by the stress field.
- ⛔ **"rather than in the luck" must go** — an unlicensed contrast under wall 5, and `luck` is additionally a claim about causation the world does not model.
- ⚠ **The counterforce angle's own temptation is to name what an attacker or a season CANNOT do.** That is a prediction in the negative and falls under the same floor as the positive. **The lawful counterforce move here is to state what the town has SHUT, not what will fail to happen.**

### 3.5 The preimage, as it bites vid 3

This variant's two contradictions are tier-correlated in opposite directions: **"the two buildings" is most wrong on the largest towns** (where both roster rows are plural), and **"a place that answers sickness" is most wrong on the smallest** (where the monastic row is likeliest). There is no tier at which the shipped sentence is fully true. A face must survive both ends.

### 3.6 The angle's stance in one sentence

`[counterforce]` is the state read as a thing that stands AGAINST a named pressure — **what this town has that the pressure would have to get past, stated as a standing arrangement and never as an outcome.**

### 3.7 The turns worth keeping

- **The two named pressures, `a failed harvest` and `an outbreak`** — these are the right two nouns, they are the row's own two subjects, and they are not magnitudes. Worth carrying almost verbatim.
- **The `Neither … nor` opening** — a strong, clerk-flat shape that is not the settlement token and is not shared with either sibling variant. The shape survives even though what it currently governs does not.
- **Putting `{settlement}` late in the sentence** — correct, and the writer should keep it there.

### 3.8 What would make the rewrite of vid 3 a regression

Replacing "the two buildings" with "the two institutions" or "both" and calling the count cured — the count is cured only by not counting. Keeping the contrast and swapping `luck` for `chance` or `nothing`. Softening the outcome into a subjunctive and thereby importing a modality the pool does not carry. Losing the two named pressures, which are the best-earned nouns in the whole pool.

### 3.9 ⭐ WHERE THE FLAVOUR IS (vid 3)

- **The concrete counterforce fact this state holds, and nobody has written it: a town-plus settlement with both of these rows also has, by roster, `Parish burial grounds` — a `required` row at town** (`institutionalCatalog.js:1289-1295`) **and a `Cemetery network` at metropolis** (`:2392-2398`). **So the town carries the house that keeps people through a bad year, the house that takes them when they sicken, and the ground that takes the ones neither reaches.** That is three standing civic facts of one chain, all on the roster, and the third is the one that makes the first two mean something. A counterforce face that reaches for the third without asserting an outcome would be the sharpest thing in this block.
- **What a stranger would notice:** the granary and the religious house are both endowed, which means they both have a keeper who answers to somebody other than the town. Neither is the town's to spend. A counterforce sentence that notices the arrangement is not the town's own is stating a fact about an institution's origin and touching no theology.
- **What the absence looks like on the ground** is the three sibling keys, and a lawful contrast may name one: the town with the store and no medicine, the town with the medicine and no store. **This is the only rejected alternative the wall permits, and it is a far better one than luck.**

---

## 4. THE PACKET'S OWN VERDICT, for the writer's first pass

**What survives from the shipped pool:** the SPINE (this town holds both halves of a disaster answer, which three of its four siblings do not); the two pressure nouns, `a failed harvest` and `an outbreak`; the joint `between them`; the phrase `having both`; the pair-shape of vid 2; the `Neither … nor` opening of vid 3; and the slotless opening that keeps vid 2 off the settlement token.

**What does not survive, and why, in one line each:**
1. **A place that takes in the sick** (all three variants) — contradicted by the roster's `Monastery or friary` branch, which is the likelier branch at town tier.
2. **Any outcome clause** — contradicted by `config.stressTypes`, which this key never reads and which carries `famine` and `plague_onset`.
3. **`the two buildings`** — a count on a boolean read, contradicted by the roster's plural rows at city and metropolis.
4. **`rather than in the luck`** — a contrast whose rejected alternative names no sibling key or band (wall 5).
5. **`knows exactly what having both is worth`** — the MEANING move, which the estate does not have, with a magnitude word attached.

**The single highest-value instruction for the draft:** §0.7.2. Another desk speaks about this same granary, in this same voice, a few rows below on the same tab, and it opens `holds stored food` / `holds reserves` / `keeps stores`. **Put this pool's grain into a construction none of those three uses, and the pool's biggest visible fault on a real page is gone.**

**The second:** stop at capability. The producer's own verbs for this branch are *provides* and *enables* (`threatAssessment.js:181-190`). Every contradiction in this pool except the roster ones comes from the shipped rows walking one step past them.
