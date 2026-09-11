# MARKER packet — DS-DEF-2 · pool `Disasters & Famine: NO reserves, NO medical provision`

Seat: opus (MARKER). Written under ADDENDUM 13 PART A (the entailment law, writer bars W11–W19) and
PART B (the referent law, writer bars W20–W27), ADDENDUM 12's W1–W10 and rulings R-i…R-viii′, the
REGISTER CARD with amendments S2 and S3, RULES-V2-PART-B §1 (R-DA-00…R-DA-24) / §16–16.2 / §18 /
§20 / §21–§23, MOVE-GRAMMAR §1–§3, §4.4.1–4.4.3 and §1.4.1 (THE THREAD), CLERK-LAWS §2.4.1 / §2.6.1,
ARCH-COMPOSED-PROSE-v2 §2.5 (the annex grammar) and §8.3 (the licence card).

VARIANT COUNT: **3** (vids 1, 2, 3). Faces owed at the rewrite: **four per variant = 12**.

⛔ THE ONE-LINE VERDICT ON THE SHIPPED POOL. Of the pool's fourteen distinct claims, **three are
licensed** (the settlement slot; the granary's absence from the roster; the care house's absence from
the roster) and **eleven are not**. Two of the eleven are refuted by the engine's own code rather than
by a rule: the shipped text says the settlement holds NO FOOD (the engine gives every granary-less
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
