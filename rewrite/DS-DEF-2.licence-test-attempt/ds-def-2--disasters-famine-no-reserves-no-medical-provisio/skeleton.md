# MARKER packet — DS-DEF-2 · pool `Disasters & Famine: NO reserves, NO medical provision`

Seat: opus (MARKER). Written under ADDENDUM 13 PART A (the entailment law, writer bars W11–W19) and
PART B (the referent law, writer bars W20–W27), ADDENDUM 12's W1–W10 and rulings R-i…R-viii′, the
REGISTER CARD with amendments S2 and S3, RULES-V2-PART-B §1 (R-DA-00…R-DA-24) / §16–16.2 / §18 /
§20 / §21–§23, MOVE-GRAMMAR §1–§3, §4.4.1–4.4.3 and §1.4.1 (THE THREAD), CLERK-LAWS §2.4.1 / §2.6.1,
ARCH-COMPOSED-PROSE-v2 §2.5 (the annex grammar) and §8.3 (the licence card).

VARIANT COUNT: **3** (vids 1, 2, 3). Faces owed at the rewrite: **four per variant = 12**.

WHERE THE BRIEF'S SEVEN ITEMS LIVE: (1) the number and angle tag and (2) the shipped sentence verbatim
head each block of §1; (3) every claim tagged LICENSED/UNLICENSED with its REFERENT LAYER is §1's
tables; (4) THE READS THE REWRITE MUST STATE is §2; (5) THE ANGLE'S STANCE is §3; (6) THE TURNS WORTH
KEEPING is §4; (7) WHAT WOULD MAKE THE REWRITE A REGRESSION is §5. §6 (the construction problem and the
grammar shortfall) and §7 (wiring rows for the chair) are the marker's additions.

⛔ THE VERDICT ON THE SHIPPED POOL, IN THE MARKER'S OWN COUNT. §1 tags **25 rows** across the three
variants: **7 are licensed or licensed in their core** (the `{settlement}` slot at 1.1 and 3.1; the two
flags carried as one condition at 1.9 and 3.7; the visitor's stance at 3.2; the granary named as the
building and absent at 3.3; the care house absent at 3.4's core), **17 are unlicensed**, and one (2.9)
is not a claim at all but a hole where the pool's read should be. Two of the seventeen are refuted by
the engine's own code rather than by a rule: the shipped text says the settlement holds NO FOOD (the engine gives every granary-less
roster 1.5 to 2.0 months of storage) and that it has NOBODY to treat the sick (the branch never
consults the church flag, which is REQUIRED true at hamlet). A third, "the town", names a tier this
pool can never fire at. The rewrite is not a polish here; it is a repair.

---

## 0. THE CARD, THE READ, AND WHAT THE READ IS MADE OF

### 0.1 The licence card, as `scripts/prose-licence-card.mjs` printed it (verbatim)

```
LICENCE (block DS-DEF-2 · role spine · key `Disasters & Famine: NO reserves, NO medical provision`)
  reads:      disasterRowSituation(granary, hospital, church) (via DISASTER_ROW_POOL in defenseStateProse.js)
              (absent ⇒ no candidate; a modifier is silent, never "false")
  predicate:  disasterRowSituation(granary, hospital, church) === no reserves, no medical provision
  bag:        {band: RESERVED, route: proper, settlement: proper}
              FILLED at this block's call sites: {settlement}
  relation:   (a spine takes no relation)   ← the relation is the MODIFIER's property (ARCH §4.5)
  seat/form:  (not a seat-taker) / sentence      move: (none declared)     angle: ledger street visitor
  attach:     (empty: a spine takes no attach set)
  echo:       spine mounts 1 (tabs: defense) · modifier mounts 0 (none)
              the echo table is keyed on this pool's WHOLE table-rung reading (truncated at the file's
              first dot), so every pool that selects a row of `DISASTER_ROW_POOL` shares ONE echo key:
              a mount counted there may be a sibling ROW of the same table
  covert:     no
  source:     (none) · standing SOURCE-UNRESOLVED
              NO citation is licensed: a face naming a record holder here is refused by arm A13
  may claim:  that the reader `disasterRowSituation(granary, hospital, church)` selects the row
              `no reserves, no medical provision` of `DISASTER_ROW_POOL` in `defenseStateProse.js`,
              as a STANDING fact of the record
  may NOT:    a count, a cause, a season, a future, a standpoint, a second fact, another civic object
              of the class `store`
  audience:   player (no mark)
  REFUSED COLUMNS, always: a totality over persons; an exemption from a duty (whoIsExempt is null
              everywhere); a named character and that character's fate (product scope); a theological
              claim about a deity (the deity doctrine)
```

### 0.2 The annex header lines this pool sits under (`RECEIPT_POOLS_DOSSIER_STATE.md`, `### DS-DEF-2`)

- **STATE-KEY:** five fixed rows (`Beasts & Monsters` · `Invasion & War` · `Internal Security` ·
  `Economic Survival` · `Disasters & Famine`), each with a `scoreBand` badge, read against
  `config.monsterThreat`, the institution presence flags and `compound.inst`.
- **SLOTS:** `{settlement}` `{band}` `{route}` — **SECTION-TARGET:** `defense` — **PDF PARITY:** parity.
- **PROVENANCE + FENCE, the load-bearing sentence for this pool:** *"Institution presence is a STANDING
  fact with no recorded history; the causal clauses here are capability clauses … and never historical
  ones … unless the history surface supplies the ancestry."* And the fence's first half: each branch
  today holds exactly ONE string, so every settlement in a branch says the same words — which is what
  the four faces cure.
- **THE SAME-PAGE FENCE (C7, W2's ground).** The other four rows of this block render on the SAME
  defense page. A face here that generalises past its own read ("nothing here", "the town has no
  answer to anything") collides with `Invasion & War`, `Internal Security` and `Economic Survival`
  on the page the reader is looking at. Every claim stays inside the disaster row.

### 0.3 The census row (`docs/content/wiring-census.json`) — read, not summarised

`status: RESOLVED` · `rung: table` · `readsGrain: branch` · `keyFunction: DISASTER_ROW_POOL` ·
`variants: 3` · **`grammars: 1`** · `k: 2` · `rateBp: 4596` · `slotsFilled: [settlement]` ·
`objectClasses: [store, care]` · `objectClass: store` · `sites: [defense.threatAssessment]` ·
`attach: []` · `covert: false` · `narrowed: false` ·
`source.standing: SOURCE-UNRESOLVED`, `source.holder: null`,
`holderReason: "no mapping row resolves any field this pool reads"`.

Two figures on that row bind the rewrite:

- **`rateBp: 4596`** — this pool fires on **45.96 %** of the measured sample. It is the most-read
  disaster row in the product. Whatever it says, nearly half of all settlements say.
- **`grammars: 1` is a live defect.** MOVE-GRAMMAR §2.1 requires min(k, 8) = **3** distinct level-1
  grammars in a pool of three; the census says one. §6 below states exactly which members this card
  can license, and records the shortfall honestly rather than inventing a member.

### 0.4 What the branch is actually made of (CONFIRMED — read at
`src/domain/display/stateProse/defenseStateProse.js:550-586` in the dock)

```js
function disasterRowSituation(granary, hospital, church) {
  if (granary) {
    if (hospital) return 'granary, hospital';
    return church ? 'granary, parish care' : 'granary, no medical provision';
  }
  return hospital ? 'no reserves, hospital' : 'no reserves, no medical provision';
}
```

**This pool's branch is the conjunction of exactly TWO flag values. The third argument is never read.**

| # | constituent | value here | layer of the read | what the flag actually scans |
|---|---|---|---|---|
| F1 | `compound.inst.hasGranary` | **false** | **BODY-absence**, `storehouse` class | the substring `granar` over the roster's names (`priorityHelpers.js:63`) |
| F2 | `compound.inst.hasHospital` | **false** | **BODY-absence**, `care` class | `hospital` · `monastery` · `healer` · `friary` (`priorityHelpers.js:64`) |
| F3 | `compound.inst.hasChurch` | **NOT CONSULTED** | — | the granary branch alone reads it; this branch returns before it |

The block's own docblock says so in its own words (`:572-576`): a church counts as medical provision
**only in the granary branch**, because the corpus wrote `granary AND parish care only` and never a
matching `no reserves, parish care`, "so for a town with no reserves the split is hospital-or-nothing,
and the church is not consulted there". **Therefore no face of this pool may say, deny, or imply
anything about clergy, a parish, a shrine or anyone who tends the sick outside a hospital-class row.**
That is not a stylistic caution: at hamlet `Access to parish church` is `required: true`
(`institutionalCatalog.js:300`), so on a large share of this pool's own cells a church stands and the
corpus's sibling row calls its clergy the people who tend the sick.

### 0.5 THE TIER FACT — this pool is a village-and-below pool (CONFIRMED on the catalogue)

`hasGranary` is a TIER PROXY (W14's own list; ENTAILMENT-TABLE L-20). Read in the dock:

- `Town granary` — `institutionalCatalog.js:925`, **`required: true`**, `baseChance: 1` (tier `town`).
- `City granaries` — `:1590`, **`required: true`**, `baseChance: 1` (tier `city`).
- `metropolis` merges the CITY catalogue before its own (`steps/assembleInstitutions.js:243-245`), so
  the required city row reaches metropolis too; `State granary complex` `:2505` is an extra 0.7 draw.
- Below town, **no catalogue row matches `granar` at all**: the thorp's `Communal root cellar` `:111`
  does not, and it feeds `isolationSupport.js:47` instead.

**CONFIRMED: on a natively generated roster this pool can only fire at thorp, hamlet or village.**
(Edges not traced: an institution toggle, a `worldLaw.allowsInstitution` refusal, a ruin path, or
imported custom content could clear the flag at town+.) The census's 45.96 % is consistent with that.

**What follows for every face, as a prohibition:** the read holds no tier, so no face may NAME a tier —
and "the town" is the wrong one on every cell it can fire at. ADDENDUM 13 PART A item 5 names the
engine's own generic below town: **"the community"**. The safe subjects here are `{settlement}`, the
community, the place, and the record itself. W3 (the band marker) and W14 (the label bar) both convict
a bare "the town" on this pool.

### 0.6 The entailment rows that govern every face (ENTAILMENT-TABLE, defense desk; the desk's own §3/§4)

- **D-12 granary.** ENTAILS: *grain is stored · it buffers a harvest · communal at town.* NOT ENTAILED:
  *how full · how many months · who holds the key · drawn on · a count of buildings.* **ENGINE
  CONTRADICTS: "a granary means the town eats through a bad year."** And L-20: the stem is `granar`,
  **so the flag is about the BUILDING and never the stock** — *"a town with NO granary building still
  has a granary reading at 1.5 to 2.0 months"*.
- **CONFIRMED against the code, because this is the pool's largest trap.** `foodGenerator.js:161-165`:
  with no granary row the storage buffer is `['thorp','hamlet'].includes(tier) ? 1.5 : 1.0`, and
  `foodStockpile.js:190-193` mirrors it at `1.5 : 2.0`; a mill multiplies it by 1.25. **A settlement on
  this branch has months of stored food in the engine's own numbers.** Any face asserting an empty
  larder, no food, nothing put by, or hunger arriving at once is refuted by the producer.
- **D-13 hospital / infirmary.** ENTAILS (CONDITIONAL on a hospital-named row): *somewhere to put the
  sick · casualty treatment and outbreak containment.* NOT ENTAILED: *beds · physicians · a count ·
  that it can contain the outbreak · funding.* LABEL TRAP: `hasHospital` catches `monastery`, `healer`
  and `friary`, so its ABSENCE is the absence of all four keyword classes and of nothing else.
- **A-15 (the alias row).** Safe spellings for the care class: *"a house that takes in the sick"*,
  *"those tending the sick"*; **never "the hospital" from the boolean.** The referent table's own row
  gives *the infirmary · somewhere for the sick* (`REFERENT-TABLE` line 63).
- **The storehouse row (`REFERENT-TABLE` line 62).** `granary · the stores` — BODY, flag `hasGranary`;
  a `granary` holder row was **drafted and WITHDRAWN**. The ratified distinction: **"the granary (the
  building) · the stores (the stock) — never both in one word."**
- **W15 (alias bar) · W24 (record-word bar).** This card resolves NO holder, so **no record word at
  all** — no books, roll, rolls, register, ledger, account. The `[ledger]` tag is a STANDPOINT and
  licenses no record noun and no citation (R-vi: the office's own formula, "entered", "carried
  standing", is the ledger's lawful surface; "the roll shows" is a citation and is refused).
- **W17 (the crisis bar).** *A famine never entails a harvest failure or a season; a disease outbreak
  is "illness" or "sickness", **never "the plague"**.*

### 0.7 The civic-object classes, and the word the POOL KEY itself gets wrong

`CIVIC_OBJECT_CLASSES` (`src/domain/prose/wiringCensus.js:1301-1323`) splits, deliberately, at car 8a-8:

- `store` (**the STOCK**): `stores · reserve · reserves · stock · larder · harvest`
- `storehouse` (**the BUILDING**): `granary · silo · storehouse · warehouse`
- `care`: `hospital · infirmary · healer · medical · physician · ward`

The census files this pool as `objectClasses: [store, care]`, `objectClass: store` — because the POOL
KEY says *"NO reserves"*, a STOCK word, while the flag it reads is the BUILDING. **A face that writes
the key's own word writes the wrong object and makes the one claim the engine contradicts.** The
licensed spelling of F1's absence is the BUILDING: no granary, no storehouse, nothing built to hold
grain back. *Recorded for the chair as a KEY-LEVEL wiring observation (the key string, not a writer's
task); a key change on a shipped surface is owner-gated.*

---

## 1. THE SHIPPED VARIANTS, MARKED

Every claim is tagged **LICENSED `<card field or read>`** or **UNLICENSED `<the law it breaks>`**, and
separately **LAYER `<the layer of the noun>` vs READ `<the layer of the read>`**, per ADDENDUM 13
PART B rule 2: a noun whose layer does not match its read's is UNLICENSED under W20–W27. The read's
layer on this pool is **BODY-absence** on two institution flags (`storehouse` class and `care` class).

### VARIANT 1 — angle `[ledger]` (annex `:2721`)

**Shipped, verbatim:**

> `[ledger]` {settlement} holds no food against a bad year and has nobody to treat the sick; a failed harvest is immediate hardship here and a plague runs until it burns out.

| # | claim | licence | layer |
|---|---|---|---|
| 1.1 | the settlement is named `{settlement}` | **LICENSED** — `bag {settlement: proper}`, FILLED at this block's call sites (`defenseStateProse.js:621`, `properFill`) | LAYER **NONE** (the record's subject; a slot is not a referent claim) vs READ BODY-absence — no mismatch. Order constraint 10 is satisfied: the settlement token opens exactly one variant of this pool |
| 1.2 | it **holds no food** against a bad year — i.e. the STOCK is absent | **UNLICENSED** — this is the pool's central fault and it is refuted by code, not by taste. The read is `hasGranary`, whose stem is `granar`: **the BUILDING, never the stock** (L-20; REFERENT-TABLE line 62's "never both in one word"). The engine gives a granary-less roster 1.5–2.0 months of storage (`foodGenerator.js:161-165`; `foodStockpile.js:190-193`), so "holds no food" asserts an emptiness the producer denies, and D-12's NOT-ENTAILED column bars *how full* in either direction | LAYER **NONE** (a stock, per PART B rule 1: a stock is layer NONE) used on a **BODY-absence** read — mismatched under **W20**: the read reaches a ROW, not a quantity |
| 1.3 | **against a bad year** — a named bad harvest year as the thing not survived | **UNLICENSED** — the card's `may NOT: a season` (and a cause); **W17**: *a famine never entails a harvest failure or a season*. The granary's own entailment is *"it buffers a harvest"*, the standing function, not a crop year | LAYER **NONE** (an event/period) vs READ BODY-absence — the read holds no event |
| 1.4 | it **has nobody to treat the sick** | **UNLICENSED THREE TIMES OVER.** (i) *"nobody"* is a **totality over persons** — a REFUSED COLUMN on this card, always. (ii) **W22 THE PERSON BAR**: no person as a load-bearing referent; the care flag names rows, not people. (iii) It denies what the branch never reads: F3 (`hasChurch`) is not consulted here (`:572-576`), and `Access to parish church` is `required: true` at hamlet (`institutionalCatalog.js:300`), so on much of this pool's own tier range clergy stand in the record the sentence says hold nobody | LAYER **NONE / PERSON** (persons are never a referent, PART B rule 1) vs READ **BODY-absence, `care` class** — mismatched under **W20 and W22** |
| 1.5 | **a failed harvest is immediate hardship here** | **UNLICENSED** — a second fact (card `may NOT`) AND a CONSEQUENCE move without its licence: MOVE-GRAMMAR §1.2 row 7 double-licenses CONSEQUENCE on event provenance × a household row, and this card holds neither; the annex's own PROVENANCE fence says the clauses here are *capability* clauses and never historical ones. "immediate" is additionally a rate the record does not carry | LAYER **NONE** vs READ BODY-absence — the claim reaches past every row the read touches |
| 1.6 | **a plague** as the disease word | **UNLICENSED** — **W17** names this exact word: *a disease outbreak is "illness" or "sickness", never "the plague"*. (Note the sibling trap: `plagued` on this same block is monster activity, never disease — ADDENDUM 13 PART A item 4 — so the word collides with a producer token on the same page) | LAYER **NONE** vs READ BODY-absence |
| 1.7 | ...**runs until it burns out** | **UNLICENSED** — a FORECAST in gnomic dress. MOVE-GRAMMAR §1.3: FORECAST does not exist anywhere in the estate; R-DA-07 bars the bare future indicative and R-DA-12's generalisation test catches the timeless present, which is the harder breach. It also implies an unchecked spread over the population: a **totality over persons** again | LAYER **NONE** vs READ BODY-absence |
| 1.8 | the semicolon carrying 1.5–1.7 onto the first sentence | **UNLICENSED** — amendment **S2** lets a clause ride only where it is a CONSEQUENCE the engine COMPUTED of the sentence's own fact; nothing computes this. R-DA-03: the qualification takes its own sentence, never a tail; R-DA-06 rations the semicolon | n/a |
| 1.9 | the two absences named together as one condition | **LICENSED IN ITS CORE** — F1 false ∧ F2 false is ONE keyed condition (R-v: the reads of a key are one keyed condition, never a second fact). The fault is in 1.2 and 1.4's wording, not in pairing them | LAYER BODY-absence vs READ BODY-absence — **matched** |

**Verdict on v1:** one fully licensed claim (1.1) and one licensed core (1.9); **seven unlicensed
claims**, two of which (1.2, 1.4) are contradicted by the engine's own code and one of which (1.6)
names a word the crisis bar prints by name. Nothing in this variant survives as a quotable turn
except its subject.

### VARIANT 2 — angle `[street]` (annex `:2722`)

**Shipped, verbatim:**

> `[street]` The town's answer to a bad season is the same as its answer to a sickness, which is to endure it and count afterwards.

| # | claim | licence | layer |
|---|---|---|---|
| 2.1 | **the town** as the subject | **UNLICENSED** — §0.5: `hasGranary` is a TIER PROXY and this pool fires only at thorp, hamlet or village on a native roster (`Town granary` and `City granaries` are `required: true`; metropolis merges the city catalogue). "The town" names a tier this pool cannot reach. **W14** (the label bar: the tier proxy) and **W3** (a band carries its marker; a bare value contradicts the head record). ADDENDUM 13 PART A item 5 gives the engine's own generic below town: *the community* | LAYER **NONE** (a tier token) vs READ BODY-absence — mismatched under **W20**: a tier word on a read that holds no tier |
| 2.2 | the settlement **has an answer** to a bad season — a policy, a practice, a disposition | **UNLICENSED** — an observable no field holds. The read is two presence flags; there is no policy, practice, plan or custom field anywhere on this card. It is also a **standpoint** (card `may NOT`) and, as a settlement-wide intention, **W23 THE FUSED-AGENT BAR**: "the town has decided" is the bar's own worked example | LAYER **NONE / AGGREGATE** (an attributed disposition of the whole place) vs READ BODY-absence — mismatched |
| 2.3 | **a bad season** | **UNLICENSED** — the card's `may NOT: a season`, in the plainest form the bar has; **W17** again | LAYER NONE vs READ BODY-absence |
| 2.4 | **a sickness** as the second pressure | **LICENSED IN ITS WORD, UNLICENSED IN ITS PLACE** — W17 names *"illness" or "sickness"* as the correct register for an outbreak, so the WORD is the right one; but this card carries no outbreak record at all, and the sentence predicates a response to one. What the card licenses is the absence of a care-class ROW, not an event to respond to | LAYER NONE vs READ BODY-absence, `care` class — mismatched |
| 2.5 | the two answers are **the same** — an equivalence between the two pressures | **UNLICENSED** — a relation between two referents that no field computes (**W23**), and a **maxim**: the sentence states a rule of the place rather than a fact of the record (R-DA-12's generalisation test; MOVE-GRAMMAR §1.3's VERDICT/MEANING non-moves). The engine scores disaster with one gated number (`defenseGenerator.js:608-618`) and never compares two responses | LAYER NONE vs READ BODY-absence |
| 2.6 | **`, which` is to endure it...** | **UNLICENSED AS A FORM** — the which-clause is barred outright by the writer's fence and by R-DA-03 (`, which` at ≤ 0.010 per variant, sixteen times the estate median today); MOVE-GRAMMAR order constraint 6 states it as a wall: QUALIFY never as a "which" tail | n/a |
| 2.7 | ...**to endure it** | **UNLICENSED** — an act attributed to the inhabitants as a body: a **totality over persons**, a REFUSED COLUMN, and **W22**. It is also a FEELING/disposition in act's clothing (MOVE-GRAMMAR §1.3: FEELING does not exist) | LAYER **PERSON/AGGREGATE** (never a referent) vs READ BODY-absence — mismatched under **W20, W22** |
| 2.8 | ...**and count afterwards** | **UNLICENSED** — a **count** is the first item on the card's `may NOT` line, and the implied thing counted is the dead: a totality over persons, and a **forecast** of what happens after an event the record does not hold | LAYER NONE vs READ BODY-absence |
| 2.9 | anything of the pool's own read | **ABSENT — and this is the variant's structural fault.** Variant 2 never states F1 or F2. It names no granary, no storehouse, no care house, no absence, no record. A reader who draws v2 learns that the place endures things. **ADDENDUM 7 (3)**: a variant that states only the key fact with no angle and no second read is refused; this one states *less* than that — it states the key fact not at all | n/a |

**Verdict on v2:** **zero licensed claims.** Every clause is a standpoint, a maxim, a season, a count,
or an act of persons; the one read the pool exists to carry is missing. This variant is the pool's
worst and the rewrite's largest opportunity: the density floor (ADDENDUM 6) is measured against the
shipped sentence, and the shipped sentence here carries no licensed density at all.

### VARIANT 3 — angle `[visitor]` (annex `:2723`)

**Shipped, verbatim:**

> `[visitor]` A stranger looking for the granary or the sick-house at {settlement} is directed to neither, because there is neither.

| # | claim | licence | layer |
|---|---|---|---|
| 3.1 | the settlement is named `{settlement}` | **LICENSED** — `bag {settlement: proper}`; not the opener, so order constraint 10 holds across the pool | LAYER NONE vs READ BODY-absence — no mismatch |
| 3.2 | **a stranger** as the eye of the sentence | **LICENSED AS A STANCE** — **W27**: `[visitor]` is a stance and "a stranger" is the visitor's eye. The tag is not a body and licenses no holder's record; here it does neither | LAYER **NONE** (a stance device, not a referent) vs READ BODY-absence — admissible |
| 3.3 | **the granary** is not on the roster | **LICENSED** — the read itself: `hasGranary` false. REFERENT-TABLE line 62 gives the granary (the BUILDING) as the flag's own ratified noun, and this is the one place in the shipped pool where the building word is used for the building | LAYER **BODY-absence, `storehouse` class** vs READ BODY-absence — **matched**; W20's condition met (the read reaches the row) |
| 3.4 | **the sick-house** is not on the roster | **LICENSED IN ITS CORE, UNLICENSED AS SPELLED.** Core: `hasHospital` false entails no hospital, monastery, healer or friary row, so there is no care house — that IS the read. As spelled: "the sick-house" is a coined name for a class whose ratified spellings are *the infirmary · somewhere for the sick · a house that takes in the sick* (REFERENT-TABLE line 63; A-15). **W15** (a generic word only where the row it names resolves) and **R-DA-22** (one term for one thing, one name form) both take the coinage | LAYER **BODY-absence, `care` class** vs READ BODY-absence — **matched**; the fault is the lexicon, not the layer |
| 3.5 | the stranger **is directed to neither** — somebody answers him | **UNLICENSED** — **W27** states it exactly: the visitor's stranger *may see, never act, decide, **be told** or be given a name*. Being directed requires an unnamed inhabitant who does the directing: **W22 THE PERSON BAR**, and a relation between two referents the fields do not compute (**W23**) | LAYER **PERSON** (never a referent) vs READ BODY-absence — mismatched under **W20, W22, W27** |
| 3.6 | **because there is neither** | **UNLICENSED AS A CLAUSE, though its content is the read.** Three faults at once: (i) **W6 NO DOUBLED BEAT** — the clause restates the read the first half just made, which is the summarising beat; (ii) R-DA-07 strikes the expletive ("there is"); (iii) R-DA-03 bars the tail — the qualification takes its own sentence. MOVE-GRAMMAR order constraint 3 also bites: this is an ABSENCE sitting immediately beside another ABSENCE | LAYER BODY-absence vs READ BODY-absence — matched, but the form is refused |
| 3.7 | the pairing of the two absences as one condition | **LICENSED** — R-v: the two flags are one keyed condition. The conjoined naming of the two objects is the lawful shape of that condition | matched |

**Verdict on v3:** **the strongest of the three.** It carries both halves of the read on the right
nouns (3.3 licensed outright, 3.4 licensed in core), and its faults are a person who acts, a coined
name, and a doubled beat — all curable without losing a claim. It is the only variant whose licensed
content survives the marking.

---

## 2. THE READS THE REWRITE MUST STATE (the skeleton rule, ADDENDUM 7 item 2)

**Every variant states the whole read, in its own angle's stance, in its own construction.** The card
names ONE read; its value is a PAIR, and R-v settles that the pair is one keyed condition and never a
second fact — so stating both halves is not two facts, it is the fact.

### 2.1 The card's read, stated as its two constituents

| id | the read, as a face must carry it | the licensed noun | the bar that shapes it |
|---|---|---|---|
| **R1** | **No granary-class row stands on this settlement's record.** The BUILDING is absent | *the granary · the storehouse · nothing built to hold grain back* (`storehouse` class) | **Never a stock word** (`stores · reserve · reserves · stock · larder · harvest`) and never an emptiness: the engine holds 1.5–2.0 months of storage regardless (§0.6). Never *how full*, *how many months*, *drawn on*, or a count of buildings (D-12) |
| **R2** | **No care-class row stands on this settlement's record.** No hospital, monastery, healer or friary | *the infirmary · somewhere for the sick · a house that takes in the sick* (`care` class) | **Never "the hospital" from the boolean** (A-15); never *beds, physicians, a count, funding* (D-13); never a person and never a totality over persons (W22, the REFUSED COLUMN) |
| **R1∧R2** | **The two together are the row this reader selects**, as a STANDING fact of the record (the card's `may claim`, verbatim) | — | Never with the church, the parish or the clergy on either side of it: **F3 is not consulted on this branch** (`:572-576`) |

### 2.2 The bag, the standing and the audience — read facts a face obeys silently

- `{settlement}` is the one FILLED slot; `{band}` and `{route}` are in the bag but unfilled at this
  block's call sites, so **no face may name a band word or a route word** — a slot with no content
  keeps its form (R-DA-22) and a band word here would be an AGGREGATE noun on a BODY read (W20).
- `source: (none) · SOURCE-UNRESOLVED` ⇒ **no citation, no holder, and under W24 no record word at
  all.** The fact is stated on the read's own nouns.
- `covert: no`, `audience: player (no mark)` ⇒ no DM pen line, no withholding, nothing marked.
- `echo: spine mounts 1 · modifier mounts 0` ⇒ nothing attaches to this spine; the face is the whole
  unit on the page for this row, and it sits beside the block's four sibling rows (C7).

### 2.3 The licensed claims of the shipped sentences, which the rewrite must not lose

| from | the licensed claim | where it must survive |
|---|---|---|
| 1.1 / 3.1 | the settlement named through `{settlement}` | at least one variant opens on it (order constraint 10 caps it at one) |
| 3.3 | **the granary named as the building it is, and absent** | R1 above; this is the shipped pool's one fully licensed body noun |
| 3.4 (core) | **the care house absent** — no hospital, monastery, healer or friary | R2 above, on a ratified spelling |
| 1.9 / 3.7 | the two absences carried as ONE condition, not two facts | every variant |
| 3.2 | the visitor's eye as a lawful stance device | variant 3's angle |
| 2.4 (word only) | *sickness* as the register's word for illness (W17) | available to any face; never "plague" |

### 2.4 The licensed density available to replace what the rewrite drops (ADDENDUM 7 item 2:
**"never with nothing"**)

The unlicensed clauses carry most of the shipped pool's weight, so the drafter needs somewhere lawful
to spend. Everything in this list is licensed by the card or by a ratified table, and nothing in it
raises the claim set:

1. **THE SIBLING CONTRAST (R-DA-02).** A contrast is licensed where the rejected alternative names a
   **sibling pool key**, and this pool has four siblings: `granary AND hospital`, `granary AND parish
   care only`, `granary, NO medical provision`, `NO reserves, hospital present`. So a face may set this
   record against what a granary-holding record, or a hospital-holding record, has. Never fronted;
   never the closing move of more than one variant in the pool; the lack is the first half with no
   completing "but".
2. **THE TWO OBJECT CLASSES, SPELLED APART.** The `storehouse` word and the `care` word are different
   civic classes (`wiringCensus.js:1301-1323`) and the census files this pool under both. Naming each
   on its own noun is licensed specificity that costs no claim — and it is exactly the distinction the
   shipped text blurs.
3. **THE FUNCTION, NOT THE ATTRIBUTE (W9: entailments are MAY, never MUST).** D-12's ENTAILS column
   (*grain is stored · it buffers a harvest · communal*) and D-13's (*somewhere to put the sick*) give
   each class its purpose in the engine's own terms. A face may name what the absent thing would be
   FOR, because that is what the word means; it may not name what such a thing typically HAS.
4. **THE OFFICE'S OWN FORMULA (R-vi).** *entered · carried standing · stands so on the record* is the
   `[ledger]`'s lawful surface — a formula, not a citation, and not a record noun.
5. **THE NEGATED PRESENT (R-ii + W10).** Stating a read negatively is a PRESENT move with a negated
   surface, not the ABSENCE move, so it may open a variant — **at most one such opener per variant**.
   This is the mechanism that lets a two-absence pool open lawfully at all.
6. **THE STANDING-FACT CLOSE, VARIED IN KIND (R-DA-04).** The close is a KIND drawn from {condition ·
   prohibition · absence · object · a name not given}; four faces per variant must not all close on an
   absence.

---

## 3. THE ANGLE'S STANCE, ONE SENTENCE PER VARIANT (and what each may NOT invent)

The three tags this card names are `ledger street visitor`, in that order, and W27 rules all three are
**STANCES** — a way of stating the fact, never a body, never a holder's record. The block's PROVENANCE
line adds the fence that binds every one of them here: institution presence is a STANDING fact with no
recorded history, so every stance states a capability, never an event and never an ancestry.

### 3.1 VARIANT 1 — `[ledger]`

**THE STANCE, in one sentence:** the compiling office states the two absences flatly as what the
record carries, in the office's own formula, measuring nothing it cannot read and citing nobody.

**It MAY:** name the granary and the care house on their own class nouns; carry the office's formula
(*entered*, *carried standing*); set the record against a sibling key's record (R-DA-02); state the
pair as one standing condition.
**It may NOT invent:** a holder or a record noun of any kind (`source: (none)`; W24 — the `[ledger]`
tag licenses NO record noun and no citation, and "the roll shows" is refused by R-vi); a measurement,
a count, a duration, a month, a share; a standpoint on the fact (the card's `may NOT`); the office's
opinion of the arrangement (MOVE-GRAMMAR §1.3, VERDICT does not exist).

### 3.2 VARIANT 2 — `[street]`

**THE STANCE, in one sentence:** the same two absences at ground level — the ordinary, unremarkable
form of the fact, stated as where a thing would stand and does not.

**It MAY:** use the plainest civic nouns for the two classes; state the absence as a condition of the
place rather than of the paperwork; run short (NL-2 / R-DA-05: the short line exists, and this is the
variant with the least to carry).
**It may NOT invent** — and this is the variant that invented most: a practice, a custom, a habit or a
routine (no custom field exists on this card); what anyone knows, fears, expects, does or endures
(**W22**, and a totality over persons is a REFUSED COLUMN); a decision or a disposition of the place
as an agent (**W23**); a season, a bad year, a count, or an equivalence between two pressures; a maxim
about how the place meets trouble (R-DA-12). **`[street]` is a vantage, not a population.**

### 3.3 VARIANT 3 — `[visitor]`

**THE STANCE, in one sentence:** a stranger's eye finds the two things absent by looking for them.

**It MAY:** look, arrive, cross, pass, find nothing — perception is the stance's whole licence; name
both classes as the things not found; close on what the eye did not meet.
**It may NOT invent** (W27, quoted): the stranger *may see, never **act**, **decide**, **be told** or
be given a name*. So nobody directs him, nobody tells him, nobody answers him, he asks no one, and he
draws no conclusion about the place. **The shipped variant breaks exactly this** (3.5). He also never
carries a holder's record (W27's last clause) and never becomes a person with a history.

---

## 4. THE TURNS WORTH KEEPING (the density floor, ADDENDUM 6 — quoted verbatim, lawful as they stand)

These are the shipped clauses a face may carry **unchanged**. The list is short because the pool is
thin: the drafter's obligation is to REPLACE the dropped weight with §2.4's licensed density, not to
match the shipped word count with the shipped material.

| # | verbatim from the shipped pool | why it stands | how it may be carried |
|---|---|---|---|
| T1 | `A stranger looking for the granary` | the visitor's eye doing the one thing the stance licenses (looking), on the flag's own ratified building noun. MARKER'S RULING: *looking* is seeing and is lawful; *being directed* is being told and is not (W27) | v3's opening frame; the object may be either class or both |
| T2 | `at {settlement}` | the naming form in its non-opening position, which keeps order constraint 10 satisfied across the pool | any variant that does not open on the slot |
| T3 | `the granary` | REFERENT-TABLE line 62's ratified noun for `hasGranary`, used for the BUILDING — the shipped pool's one correct object word | R1 in any variant |
| T4 | `a sickness` | W17's own register for an outbreak (*"illness" or "sickness"*), correct where "a plague" in v1 is barred by name | available as vocabulary; never as an event this record holds |
| T5 | `to treat the sick` | D-13's function in the engine's own terms; lawful as the PURPOSE of the absent care house, unlawful only in v1's "nobody to treat the sick" | R2 stated as function: what is missing is the place for it |

Everything else in the three shipped sentences is either unlicensed or a coinage (3.4's `sick-house`),
and none of it is a floor.

---
## 5. WHAT WOULD MAKE THE REWRITE A REGRESSION HERE

### 5.1 The pool-level regressions (any one of these fails the block whatever else improves)

1. **THE INVENTORY LINE.** *"{settlement} has no granary and no infirmary."* — the key fact, no angle,
   no second read, no construction. ADDENDUM 7 item 3 refuses it at the gate and the refuters fail it.
   A pool of two absences is the easiest pool in the desk to write as a list, and that is the trap.
2. **LOSING R1's BUILDING NOUN.** If the rewrite drops "the granary" for a stock word ("no reserves",
   "nothing put by", "an empty larder") it trades the pool's one licensed body noun for the one claim
   the engine refutes. That is the shipped pool's fault re-committed, not cured.
3. **LOSING R2 ALTOGETHER.** Variant 2 already states neither read; a rewrite that keeps a
   ground-level line with no care-class noun in it repeats the hole.
4. **CURING THE PERSONS BY DELETING THE PLACE.** The cheap cure for 1.4, 2.7 and 3.5 is to write
   nothing where the persons were. That is a lost read, not a cure: the weight goes to §2.4's licensed
   density (the sibling contrast, the two classes spelled apart, the function of the absent thing).
5. **A DROPPED ANGLE.** Three tags, three stances: a `[street]` face built as a second `[ledger]`
   measure, or a `[visitor]` face that states the record instead of what an eye meets, is the
   construction-collapse regression **W4** names (the draft's declared grammar per variant is the
   refiner's to keep) and R-iv convicted on DS-DEF-11.
6. **FOUR FACES THAT ARE ONE FACE IN FOUR COATS.** ADDENDUM 7 item 4: the four faces differ in
   CONSTRUCTION, not vocabulary alone. Four ways to say "no granary, no infirmary" with different
   adjectives is a refusal, and the unweighted seeded roll means each must stand alone.
7. **A NEW TIER WORD.** Replacing "the town" with "the village" is the same fault in the other
   direction: the read holds no tier, and naming one contradicts the head record on the other tiers
   the pool fires at (W3, W14). `{settlement}`, *the community*, *the place*, or the record itself.
8. **A CITATION OR A RECORD NOUN.** `SOURCE-UNRESOLVED` plus W24 means no books, roll, rolls,
   register, ledger, account or return may enter any face — and arm A13 fails a face naming a holder.
   The `[ledger]` tag invites exactly this and licenses none of it.
9. **TRIMMING.** §22's definition: the counts only ever rise. Three variants stay three, each grows to
   four faces, and a face that cannot be made lawful is banked as a refusal row with its measurement.
10. **A PLAINER FLOOR BOUGHT WITH NOTHING.** §21.4: a refinement that makes a lawful line plainer with
    no law behind the change is the regression. The owner's question is the most memorable sentence
    **without increasing the claim set** — and this pool's claim set is two absences and a name.

### 5.2 The per-variant regression, stated against what each shipped line does

| variant | what the rewrite must NOT lose | what it must NOT keep |
|---|---|---|
| **1 `[ledger]`** | the `{settlement}` opener (the pool's one licensed opener); the pair carried as one condition | the stock claim (1.2); the season (1.3); the totality over persons (1.4); the consequence with no provenance (1.5); the word *plague* (1.6); the forecast (1.7); the riding semicolon (1.8) |
| **2 `[street]`** | nothing — **this variant has no licensed content to lose**, which makes it the one place where any licensed sentence is an improvement and where the density floor must be met from §2.4 alone | the tier word (2.1); the town's "answer" (2.2); the season (2.3); the equivalence maxim (2.5); the `, which` (2.6); the endurance of persons (2.7); the count (2.8) |
| **3 `[visitor]`** | **T1's looking-for frame, T3's building noun, and the care-class absence** — the pool's licensed core lives here and a rewrite that loses it regresses the pool even if every rule passes | the directing (3.5); the coinage *sick-house* (3.4 as spelled); the doubled beat and its expletive (3.6) |

---

## 6. THE CONSTRUCTION PROBLEM THIS POOL SETS (for the drafter, from the walls)

### 6.1 Two absences, and MOVE-GRAMMAR wall 3

Wall 3: **ABSENCE never opens and never sits beside another ABSENCE.** This pool's whole read is two
absences, so the naive shapes are all unlawful. The licensed way through, from the rulings:

- **R-ii**: a NEGATED SURFACE ON A PRESENT READ is not an absence opener. So one constituent may be
  written as a negated PRESENT (*"{settlement} keeps no granary"*) and may open the unit — **at most
  one such opener per variant (W10)**.
- The other constituent takes the **LACK** move (ABSENCE class (a), licensed by the `none-exists`
  field the flag is), placed not-first and not adjacent to another absence, with **no completing
  "but"** (R-DA-02).
- A **sibling contrast** (§2.4 item 1) is the lawful thing to put between them.

### 6.2 The grammar shortfall, recorded honestly

MOVE-GRAMMAR §2.1 requires min(k, 8) = **3** distinct level-1 grammars for a pool of three; the census
reports **1**. Filtering the level-1 set by this card's licensing fields:

| member | licensed here? | why |
|---|---|---|
| **V1 PRESENT** | **YES** | the state key alone |
| **V3 PRESENT → LACK** | **YES** | the state key plus a `none-exists` field, which both flags are |
| V2 PRESENT → CONSEQUENCE(structural) | no | no structural-consequence field on this card; the disaster score is a different read |
| V4 OBJECT → PRESENT | **QUESTION FOR THE CHAIR** | V4 wants a *named-object* field (`good`, `assetId`, a built-fabric field). The granary is a class word from a flag, not a named object — the marker reads V4 as NOT licensed, and records it rather than deciding a member into existence |
| V5 INSTITUTION → PRESENT | no | the institution TABLE is not read here, and the rows in question are absent |
| V6 PRESENT → OPEN | no | no state field whose value is unresolved/contested/pending |
| V7 HISTORY → PRESENT | no | R2-only, and no event provenance exists (the PROVENANCE fence) |
| V8 PRESENT → GAP | no | GAP needs a typed `not-held` RECORD field with provenance; `SOURCE-UNRESOLVED` is the absence of a holder, not that field — and W24 bars the record nouns a GAP sentence would need |

**So this card licenses two members for three variants.** The rewrite can and should raise `grammars`
from 1 to 2 honestly; the third distinct grammar is **not available from the closed set on this card**,
and inventing a member to satisfy the count would be the worse fault. RECORDED FOR THE CHAIR as a
grammar-debt row for this pool (and, since the four siblings of `DISASTER_ROW_POOL` read the same
shape, plausibly for the whole disaster lens).

### 6.3 THE THREAD (§1.4.1, and R-i at k = 0)

`echo` says modifier mounts 0, so nothing attaches; but R-i is explicit that a spine's own second
sentence carries a noun forward from its first **regardless of k**, because the face is written once
and composed under every k the census later rules. So in any two-sentence face, the second sentence
picks up a noun from the first — the granary, the place for the sick, the settlement — or its change
of subject is the passage's one turn outward and sits last. A11's echo bound counts FACTS, not nouns:
a deliberate noun echo for the thread is lawful here.

Each face must also read well **immediately after the spine and after any sibling modifier**, since
the writer does not choose its place — and it sits on a page with four sibling rows of the same block
(C7), so no face may generalise past the disaster row.

---

## 7. WIRING OBSERVATIONS RECORDED FOR THE CHAIR (not a writer's task, nothing acted)

1. **THE KEY'S OWN WORD.** The pool key says `NO reserves` — a `store` (STOCK) class word — while the
   flag it reads is `hasGranary`, the BUILDING (`storehouse` class, split from `store` at car 8a-8).
   The census inherits it as `objectClass: store`. Every writer of this pool is invited by the key
   itself to make the one claim the engine refutes. A key change on a shipped surface is owner-gated;
   recorded, not proposed.
2. **THE TIER PROXY.** CONFIRMED that `Town granary` (`:925`) and `City granaries` (`:1590`) are
   `required: true` and that metropolis merges the city catalogue (`steps/assembleInstitutions.js:243-245`),
   so all five `no reserves` / `granary` pools are tier-sorted by a flag that is not about tier. The
   licence card prints no tier; ADDENDUM 13 PART A's D-item (f) already charters `entails:` lines per
   read for CAR 8b-W-2, and the tier each pool can fire at is OW-17's row.
3. **THE UNREAD THIRD ARGUMENT.** `disasterRowSituation(granary, hospital, church)` names three
   parameters and this branch reads two; the census's `reads` line prints all three. A refuter reading
   the census alone would believe the church is licensed here. The card's `may claim` is correct; the
   `reads` string is the hazard.
4. **`grammars: 1` against a licensable maximum of 2** (§6.2) — the census's target of 3 is
   unreachable on this card's fields.
