# MARKER packet — DS-DEF-2 · pool `Disasters & Famine: granary, NO medical provision`

Seat: opus (MARKER). Written under ADDENDUM 13 PART A (the entailment law, bars W11–W19) and PART B
(the referent law, bars W20–W27), the REGISTER CARD (with S2 and S3), RULES-V2-PART-B §1 / §16–16.2 /
§18 / §20–§23, MOVE-GRAMMAR §1–§3 and §4.4.1–4.4.3 (+ §1.4.1 THE THREAD), CLERK-LAWS §2.4.1 / §2.6.1,
ARCH-COMPOSED-PROSE-v2 §2.5 and §8.3.

VARIANT COUNT: **3** (vids 1, 2, 3). Faces owed at the rewrite: **four per variant = 12**.

---

## 0. THE CARD, THE READ, AND WHAT THE READ IS MADE OF

### 0.1 The licence card, as the script printed it

```
LICENCE (block DS-DEF-2 · role spine · key `Disasters & Famine: granary, NO medical provision`)
  reads:      disasterRowSituation(granary, hospital, church) (via DISASTER_ROW_POOL in defenseStateProse.js)
              (absent ⇒ no candidate; a modifier is silent, never "false")
  predicate:  disasterRowSituation(...) === granary, no medical provision
  bag:        {band: RESERVED, route: proper, settlement: proper}   FILLED here: {settlement}
  relation:   (a spine takes no relation)
  seat/form:  (not a seat-taker) / sentence      move: (none declared)     angle: ledger street unfolding
  attach:     (empty: a spine takes no attach set)
  echo:       spine mounts 1 (tabs: defense) · modifier mounts 0
              the echo key is this pool's WHOLE table-rung reading truncated at the first dot, so every
              pool selecting a row of DISASTER_ROW_POOL shares ONE echo key: a mount counted there may
              be a SIBLING ROW of the same table
  covert:     no
  source:     (none) · standing SOURCE-UNRESOLVED — NO citation licensed; a face naming a record holder
              is refused by arm A13
  may claim:  that the reader selects the row `granary, no medical provision` of `DISASTER_ROW_POOL`,
              as a STANDING fact of the record
  may NOT:    a count, a cause, a season, a future, a standpoint, a second fact, another civic object
              of the class `care`
  audience:   player (no mark)
  REFUSED COLUMNS, always: a totality over persons; an exemption from a duty; a named character and
              that character's fate; a theological claim about a deity
```

### 0.2 The annex header lines this pool sits under (`RECEIPT_POOLS_DOSSIER_STATE.md`, `### DS-DEF-2`)

- **STATE-KEY:** five fixed rows, each with a `scoreBand` badge, read against `config.monsterThreat`,
  the institution presence flags, and `compound.inst`.
- **SLOTS:** `{settlement}` `{band}` `{route}` — **SECTION-TARGET:** `defense` — **PDF PARITY:** parity.
- **PROVENANCE + FENCE (load-bearing here):** the lattice is dossier-native and this shape EXTENDS it
  into a pool; each branch today holds exactly ONE string, so every settlement in a branch says the same
  words. And the sentence that binds this pool hardest: *"Institution presence is a STANDING fact with
  no recorded history; the causal clauses here are capability clauses ... and never historical ones ...
  unless the history surface supplies the ancestry."*

### 0.3 The census row (`docs/content/wiring-census.json`, `rows[31]`)

`status: RESOLVED` · `rung: table` · `readsGrain: branch` · `variants: 3` · `grammars: 1` ·
`slotsFilled: [settlement]` · `objectClasses: [care, storehouse]` · `objectClass: care` ·
`sites: [defense.threatAssessment]` · `covert: false` · `attach: []` ·
`source.standing: SOURCE-UNRESOLVED`, `holderReason: "no mapping row resolves any field this pool reads"`.
Tier row (`tiers[65]`): **THIN**.

**`grammars: 1` is a live defect the rewrite must cure**: MOVE-GRAMMAR §2.1 requires min(k, 8) = **3**
distinct level-1 grammars in a pool of three, and the census says the pool carries one.

### 0.4 What the branch is actually made of (CONFIRMED — read at
`src/domain/display/stateProse/defenseStateProse.js:550-586`)

```js
function disasterRowSituation(granary, hospital, church) {
  if (granary) {
    if (hospital) return 'granary, hospital';
    return church ? 'granary, parish care' : 'granary, no medical provision';
  }
  return hospital ? 'no reserves, hospital' : 'no reserves, no medical provision';
}
```

So this pool's branch is the conjunction of exactly three flag values, and nothing else:

| # | constituent | value on this branch | layer of the read | what it reaches |
|---|---|---|---|---|
| F1 | `compound.inst.hasGranary` | **true** | **BODY** (`storehouse` class) | `granar` keyword (`priorityHelpers.js:63`) over `Town granary` `:925` (required), `City granaries` `:1590` (required), `State granary complex` `:2505` |
| F2 | `compound.inst.hasHospital` | **false** | **BODY-absence** (`care` class) | keywords hospital · monastery · healer · friary (`priorityHelpers.js:64`) |
| F3 | `compound.inst.hasChurch` | **false** | **BODY-absence** (`care` class, by this branch's own use of it) | keywords church · cathedral · temple · monastery · friary · shrine · priest · abbey (`:65`) |

The block's own docblock states the shape of F3: *"A CHURCH COUNTS AS MEDICAL PROVISION ONLY IN THE
GRANARY BRANCH"* — the corpus wrote `granary AND parish care only` but no matching `no reserves, parish
care`, so the church is consulted here and nowhere else in the lens. The pool's discriminating claim is
therefore the PAIR: **food held, and nothing of the care class at all** — that pair, and only that pair,
tells this pool apart from `granary AND hospital` and from `granary AND parish care only` on one side,
and from the two `NO reserves` pools on the other.

**The read's layer is BODY on all three constituents.** There is no band, score, ladder rung or label in
this read, so an AGGREGATE claim has nothing to stand on here; a body word of the `storehouse` or `care`
class IS licensed (W20's condition is met — the read reaches the rows). This pool is the opposite of its
own block's `Economic Survival: STRONG`, where D-F25 convicted "the garrison" on a band read.

### 0.5 The entailment rows that govern every face (ENTAILMENT-TABLE, defense desk)

- **D-12 granary.** ENTAILS: *grain is stored · it buffers a harvest · communal at town* (HOLDS).
  NOT ENTAILED: *how full · how many months · who holds the key · drawn on · a count of buildings.*
  **ENGINE CONTRADICTS: "a granary means the town eats through a bad year"** (`econHealthMult` to x0.45,
  `defenseGenerator.js:281-290`; disaster gate floor 0.55, `:608-618`). Also: `hasGranary` is a **TIER
  PROXY**, true on every town+ (required rows), false on every village-and-below whatever it stores.
- **D-13 hospital/infirmary.** ENTAILS (CONDITIONAL on a hospital-named row): *somewhere to put the sick ·
  casualty treatment and outbreak containment.* NOT ENTAILED: *beds · physicians · a count · that it can
  contain the outbreak · funding.*
- **D-14 church/parish/clergy.** ENTAILS (CONDITIONAL): *consecrated ground, a place of observance.*
  NOT ENTAILED: *resident clergy · a priest · **medical capability** · wealth · age · a bell.*
- **W14 (label bar), this desk's own list:** `hasGranary` is a tier proxy, *whatever it stores*;
  `hasChurch` is true on every hamlet from a church in ANOTHER settlement.
- **W15 (alias bar), the always-safe spellings that matter here:** *"the stores" / "what the town holds
  back"*; *"those tending the sick"*. **W24 (record-word bar):** this card resolves NO holder, so **no
  record word at all** — no books, rolls, register, ledger; and `[ledger]` is a STANDPOINT that licenses
  no record noun and no citation.
- **W17 (crisis bar):** *a famine never entails a harvest failure or a season; a disease outbreak is
  "illness" or "sickness", never "the plague".*

### 0.6 One wiring observation, recorded for the chair — NOT a writer's task

At **town** `Town granary` (`:925`) and `Parish churches (2-5)` (`:1260`) are both `required: true`; at
**city** `City granaries` (`:1590`) and `Parish churches (10-30)` (`:1828`) are both `required: true`.
So on a town or a city, F1 true forces F3 true, and the branch returns `granary, parish care`. Only at
**metropolis** are all four relevant rows draws — `State granary complex` 0.7, `Parish churches (50-100+)`
0.8, `Great cathedral` 0.6, `Major monasteries (5-10)` 0.55, `Hospital network` 0.55 — so this pool's cell
appears reachable at metropolis alone. CONFIRMED as to the `required` flags (read in
`src/data/institutionalCatalog.js`); **PLAUSIBLE, not measured**, as to "metropolis-only", because R-A
(a required row evicting an `exclusiveGroup` sibling) and R-C (the threat plan adding rows after the draw)
were not traced. **Nothing follows for a writer except a prohibition: the read holds no tier, so no face
may name one** — not "city", not "a great town", not "at this size".

---

## 1. THE SHIPPED VARIANTS, MARKED

Each claim is tagged **LICENSED `<card field or read>`** or **UNLICENSED `<the law it breaks>`**, and
separately **LAYER `<the layer of the noun>` vs READ `<the layer of the read>`** per ADDENDUM 13 PART B
rule 2 (a noun whose layer does not match its read's is UNLICENSED under W20–W27).

### VARIANT 1 — angle `[ledger]`

**Shipped, verbatim:**

> `[ledger]` {settlement} can feed itself through a failed harvest and has nothing at all against disease; a sickness here spreads until it stops of its own accord.

| # | claim | licence | layer |
|---|---|---|---|
| 1.1 | the town is named `{settlement}` | **LICENSED** — `bag {settlement: proper}`, FILLED at this block's call sites | LAYER **NONE** (the record's subject, not an institution noun) vs READ BODY — no mismatch; a slot is not a referent claim. Order constraint 10 satisfied: the settlement token opens exactly one variant of this pool |
| 1.2 | the town **can feed itself** through a harvest failure — i.e. the stored grain is SUFFICIENT to carry it | **UNLICENSED** — an observable the fields do not hold (D-12 NOT ENTAILED: *how full · how many months*; `storageMonths` is a separate field this read never touches), and the one claim D-12's ENGINE CONTRADICTS column names by its own words: *"a granary means the town eats through a bad year"* | LAYER **AGGREGATE/NONE** (a capacity of the whole town) vs READ **BODY** — mismatched under W20: the read reaches a granary ROW, not a capacity |
| 1.3 | **a failed harvest** as the thing survived | **UNLICENSED** — the card's `may NOT: a season` (and a cause); W17: *a famine never entails a harvest failure or a season*. The granary's own entailment is *"it buffers a harvest"*, which is the standing function, not a named crop year | LAYER **NONE** (an event) vs READ BODY — the read holds no event |
| 1.4 | the record holds **nothing against disease** — the care class is absent | **LICENSED IN ITS CORE** (F2 false ∧ F3 false) but **UNLICENSED AS PHRASED** — *"nothing at all"* is a totality on a column that is not `closed` (R-DA-15(i): a quantifier is licensed only by `closed` on the quantified column; `hasHospital`/`hasChurch` are keyword scans, `priorityHelpers.js:64-65`), and *"against disease"* frames the absence by an outcome in the WORLD where the register card licenses an absence **in the record** | LAYER **BODY-absence, `care` class** vs READ BODY-absence — **matched**; the fault is the quantifier and the frame, not the layer |
| 1.5 | **a sickness here spreads** | **UNLICENSED** — a second fact (card `may NOT`), and an observable no field holds: the read carries no outbreak, no transmission and no population model. W17: an outbreak entails nothing beyond its own record, and there is no outbreak record on this read at all | LAYER **NONE** vs READ BODY — the claim reaches past every row the read touches |
| 1.6 | ...**until it stops of its own accord** | **UNLICENSED** — a forecast in gnomic dress (A2 / R-DA-07: nothing takes the future; the timeless present is the harder breach, R-DA-12's generalisation test) and a **totality over persons** implied by an unchecked spread, which is a REFUSED COLUMN on this card | LAYER **NONE** vs READ BODY — same |
| 1.7 | the semicolon carrying 1.5–1.6 onto the first sentence | **UNLICENSED** — amendment S2 lets a clause ride only where it is a CONSEQUENCE the engine COMPUTED of the sentence's own fact; nothing computes this. R-DA-03: the qualification gets its own sentence, never a tail. R-DA-06 rations the semicolon | n/a |
| 1.8 | the contrast *food held · care absent* | **LICENSED** — R-DA-02 permits a contrast where the rejected alternative names a **sibling pool key**, and here it names two (`granary AND hospital`, `granary AND parish care only`). Not fronted; the lack completes with *and*, never *but* | LAYER BODY vs READ BODY — matched |

**Verdict on v1:** two licensed claims (1.1, 1.8) and one licensed core (1.4); four unlicensed claims,
of which 1.2 is refuted by the engine's own numbers and 1.5–1.6 are the pool's largest invention.

### VARIANT 2 — angle `[unfolding]`

**Shipped, verbatim:**

> `[unfolding]` The stores will carry the town through hunger. Nothing here will carry it through a plague, and the town has not built anything that would.

| # | claim | licence | layer |
|---|---|---|---|
| 2.1 | **the stores** exist — grain is held | **LICENSED** — D-12 ENTAILS *grain is stored*; and W15 names *"the stores"* an always-safe spelling. One caveat for the writer, not a fault here: A-10 splits `store` (the STOCK) from `storehouse` (the BUILDING) on purpose, and `hasGranary` is the BUILDING flag, so the noun is safe while no quantity or fullness rides on it | LAYER **BODY** (`storehouse`, read back as its stock) vs READ BODY — matched |
| 2.2 | the stores **will carry** the town through hunger | **UNLICENSED, doubly** — (a) a bare future indicative, which R-DA-07 bars *anywhere in this register* and A2 makes a FATE breach; (b) the same sufficiency claim as 1.2, which D-12's ENGINE CONTRADICTS column refutes | LAYER AGGREGATE/NONE (a capacity) vs READ **BODY** — mismatched (W20) |
| 2.3 | **hunger** as the thing outlasted | **UNLICENSED** — the card's `may NOT: a season`; W17 bars a famine entailing a season. The lawful form of the same fact is the granary's standing function (*it buffers a harvest*), not a named hungry stretch |  LAYER NONE (a condition) vs READ BODY — the read holds no famine record |
| 2.4 | **Nothing here** will carry it — the care absence | **LICENSED IN ITS CORE** (F2 ∧ F3 false); **UNLICENSED AS PHRASED** — *"Nothing here"* totalises over the town's whole record, where the read reaches three flags; plus the future indicative again | LAYER BODY-absence vs READ BODY-absence — matched; the quantifier and the tense are the faults |
| 2.5 | **a plague** | **UNLICENSED, named bar** — W17: *a disease outbreak is "illness" or "sickness", **never "the plague"***. There is no outbreak record on this read to name at all | LAYER NONE vs READ BODY |
| 2.6 | the town **has not built** anything | **UNLICENSED, named fence** — a HISTORY move on a standing configuration read. R-DST-B (MOVE-GRAMMAR §1.1): *a standing configuration field licenses a STRUCTURAL clause and never a HISTORICAL one*; the block's own PROVENANCE line says it in the same words (*"Institution presence is a STANDING fact with no recorded history"*). MOVE-GRAMMAR §1.2 row 2: HISTORY may not *"exist in R1 STATE at all"* | LAYER **AGGREGATE-as-agent** vs READ BODY — mismatched, and W23 (FUSED AGENT) bars the town as builder |
| 2.7 | ...**anything that would** [carry it] | **UNLICENSED** — a counterfactual capability of an unbuilt thing: a forecast about a body that is not on the record | LAYER NONE vs READ BODY |
| 2.8 | two ABSENCE moves adjacent (2.4 then 2.6) | **UNLICENSED** — MOVE-GRAMMAR §1.4 order constraint 3: *ABSENCE never opens and never sits beside another ABSENCE* | n/a |

**Verdict on v2:** one licensed claim (2.1) and one licensed core (2.4); six unlicensed claims. This is
the pool's worst variant: it takes the future twice, names a plague the desk bars by word, and asserts a
building history the block's own fence forbids.

### VARIANT 3 — angle `[street]`

**Shipped, verbatim:**

> `[street]` The town can outlast a hungry year at {settlement} and has no answer at all to a sick one, and knows which of the two it fears.

| # | claim | licence | layer |
|---|---|---|---|
| 3.1 | the town **can outlast** a hungry year | **UNLICENSED** — the sufficiency claim again (D-12 NOT ENTAILED *how many months*; ENGINE CONTRADICTS the eat-through-a-bad-year reading) | LAYER AGGREGATE/NONE vs READ **BODY** — mismatched (W20) |
| 3.2 | **a hungry year** | **UNLICENSED** — the card's `may NOT: a season`; W17 | LAYER NONE vs READ BODY |
| 3.3 | **at {settlement}** | **LICENSED** as a slot — but it is the pool's one craft fault worth naming beside the law: *"The town ... at {settlement}"* names one referent twice in one clause, and the locative implies the town and {settlement} are different things. Not a bar breach; a coherence fault the rewrite should not carry forward | LAYER NONE vs READ BODY |
| 3.4 | **no answer at all** to a sick one — the care absence | **LICENSED IN ITS CORE**; **UNLICENSED AS PHRASED** — the same unclosed-column totality as 1.4, and *"an answer"* is an efficacy frame: D-13 explicitly does NOT entail *that it can contain the outbreak* even where a hospital stands, so an absent hospital cannot be an absent answer | LAYER BODY-absence vs READ BODY-absence — matched; quantifier and frame are the faults |
| 3.5 | the town **knows** which of the two | **UNLICENSED** — a belief frame on a collective agent. MOVE-GRAMMAR §1.3: FEELING does not exist — *no field carries motive, belief or mood*. W22 (no person as knower), W23 (FUSED AGENT: *"the town has decided"* is the cited shape) | LAYER **AGGREGATE-as-knower** vs READ BODY — mismatched and barred |
| 3.6 | ...which of the two **it fears** | **UNLICENSED, the pool's hardest refusal** — a feeling; a standpoint (the card's `may NOT`); and a **totality over persons** (a REFUSED COLUMN on every card) smuggled through "the town" | LAYER AGGREGATE-as-feeler vs READ BODY |
| 3.7 | the contrast *food · care* | **LICENSED** — R-DA-02, as 1.8: the rejected alternative names sibling pool keys | LAYER BODY vs READ BODY — matched |
| 3.8 | three `and`-joined segments in one sentence | **UNLICENSED** — R-DA-03's 3+-segment share is shrink-only and the third segment is exactly the qualification the rule sends to its own sentence; R-DA-06's ">30 words" band applies | n/a |

**Verdict on v3:** two licensed items (3.3, 3.7) and one licensed core (3.4); five unlicensed claims,
ending on the pool's single clearest refusal (3.5–3.6).

---

## 2. THE READS THE REWRITE MUST STATE

**(a) Every read the card names for this pool.** The card names exactly one, at the branch grain:

> **R-0** — `disasterRowSituation(granary, hospital, church)` selects the row `granary, no medical
> provision` of `DISASTER_ROW_POOL` (`defenseStateProse.js:550-586`), as a **STANDING fact of the record**.

Because `readsGrain` is `branch` and the branch is defined over exactly three flag values, R-0 decomposes
into three statable facts, and the pool's twelve faces are built from these and nothing else:

- **R-1 (F1, BODY / `storehouse`).** A granary stands on this town's record. Entailed with it, and only
  this: *grain is stored* · *it buffers a harvest* · *it is communal at town*.
- **R-2 (F2, BODY-absence / `care`).** No hospital-class row stands.
- **R-3 (F3, BODY-absence / `care`).** No church- or parish-class row stands.
- **R-4 (the pair, and the pool's discriminating claim).** R-1 **together with** R-2 ∧ R-3 is what tells
  this pool from `granary AND hospital`, from `granary AND parish care only`, and from both `NO reserves`
  pools. A face that states only one half has silently become a sibling pool's face.

**(b) Every LICENSED claim of the shipped sentences**, carried forward as an obligation:

- the town named through `{settlement}` (v1.1, v3.3) — the slot, filled;
- the **contrast** *food held against care absent* (v1.8, v3.7) — lawful under R-DA-02 because the
  rejected alternative names sibling pool keys; this is R-4 in its shipped clothes;
- **grain is held / the stores exist** (v2.1) — D-12's own entailment, and the pool's one concrete
  `storehouse` noun;
- the **flat absence of the care class** (v1.4, v2.4, v3.4 in their cores) — the LACK, written in the
  record, with no quantifier and no outcome frame.

**(c) What R-0 does NOT hold, as a standing prohibition list for all twelve faces** (each already
convicted above): any quantity, fullness, months, or sufficiency of the grain · any harvest failure,
famine, hungry year, season or bad year as an event · the word *plague* · any outbreak, spread, or
containment · any building history (*built*, *has not built*, *put up*, *never raised*) · any future
indicative · any belief, knowledge, fear or preference of the town · any count · any tier word · any
citation or record word (SOURCE-UNRESOLVED; W24; arm A13) · any second civic object of the class `care`
beyond the absence itself · any person.

---

## 3. THE ANGLE'S STANCE FOR THIS POOL

The card's angle line reads `ledger street unfolding` — one tag per variant, and W27 fixes what a tag is:
these are **STANCES**, never bodies, and the stance's nouns are never a holder's record.

- **`[ledger]` (v1) — the office's own entry.** It may state R-1 and R-2 ∧ R-3 as entered: what stands,
  what does not, in the clerk's flattest order. It may **NOT** produce a record noun or a citation — W24
  is explicit that `[ledger]` is a standpoint and licenses *no* record noun ("the books show" is a
  citation), and this card resolves no holder at all. It may not grade what it enters.
- **`[street]` (v3) — the ordinary day at the civic thing.** It may state the same two facts from where
  they are met: the granary as a place in use, the absence as a place that is not there. It may **NOT**
  invent a person, a speaker, a reaction, a fear or a piece of common knowledge (W22, W23, and the FEELING
  non-move); "the street" is a vantage on civic objects, not a crowd with a mind. It may not become the
  `[visitor]` stance — this pool has no visitor face and a stranger may not be introduced to carry it.
- **`[unfolding]` (v2) — the state as it goes on standing.** This is the stance most easily lost, because
  its shipped realisation is a forecast twice over. The lawful realisation is **continuation, not
  prediction**: a condition that holds and keeps holding, in the present, with the edge subjunctive if an
  edge is wanted at all (A2; R-DA-07). It may **NOT** take *will*, *would come*, *until*, *by then*, or any
  timeless generalisation about what happens when sickness arrives.

All three stances share the same claim set (MOVE-GRAMMAR §3.4: a grammar may spend word order,
punctuation and a rationed phrase; it may never spend a CLAIM). The angles differ in *where the sentence
stands*, never in *what it knows*.

---

## 4. THE TURNS WORTH KEEPING (the density floor)

**Stated plainly: no clause in this pool is lawful verbatim.** Every one of the nine substantive clauses
carries at least one convicted word. What the rewrite may carry as it stands is smaller than a clause —
these nouns and these shapes:

**Lawful verbatim, as nouns:**

- **`the stores`** (v2) — W15's own always-safe spelling, and D-12's entailment *grain is stored*.
- **`the granary`** — not in the shipped rows, but the D-12 row's own class word, licensed because the
  read reaches the granary rows; the pool's sharpest concrete civic noun (R-DA-10).
- **`{settlement}`** — in the subject position of **exactly one** face per pool (order constraint 10).

**Lawful as shapes, with the one word that convicts each near-miss:**

| shipped clause (≤12 words) | the shape that is lawful | the word that must go |
|---|---|---|
| "has nothing at all against disease" | the LACK of the `care` class, stated flat, second-half, joined with *and* | **"at all"** (a totality on an unclosed column); and the outcome frame *against* |
| "has no answer at all to a sick one" | the same LACK, from the street's vantage | **"answer"** (efficacy D-13 does not entail even when a hospital stands), and **"at all"** |
| "Nothing here will carry it through a plague" | an absence in the sentence-second position, the record's own scope | **"will"** (future), **"plague"** (W17), **"Nothing here"** (totality over the record) |
| "The stores will carry the town through hunger" | the stored grain named as a standing thing | **"will"** and **"through hunger"** (a season) |

**The one structural turn that must survive**: the two-sided sentence — food held, care absent — is not
decoration here, it is R-4. R-DA-02 licenses it because the rejected alternative names sibling pool keys.
Every face should carry both halves; the variation is in which half leads, how the joint is made, and
which of the two bodies is named concretely.

---

## 5. WHAT WOULD MAKE THE REWRITE A REGRESSION HERE

**(a) The inventory line — the counts that may only rise (§22 "never trim", defined).**

| item | today | owed at the rewrite | reds if |
|---|---|---|---|
| semantic variants | **3** (vids 1, 2, 3) | **3**, one for one | a variant is deleted, merged, or left without a rewritten text |
| faces | 3 (one per variant) | **12** (four per variant, each a different vocabulary or rhythm inside the voice, never a paraphrase of its sibling) | any face fewer than four on any variant; a face withdrawn after shipping |
| distinct level-1 grammars | **1** (census `rows[31].grammars`) | **3** = min(k, 8) (MOVE-GRAMMAR §2.1) | the rewrite lands on one grammar again |
| angles | 3 (`ledger`, `unfolding`, `street`) | 3, one tag per spine row, `[plain]` being a modifier marker and not a fourth | two faces collapse into one stance |
| slots named | `{settlement}` | `{settlement}` | a face names `{band}` or `{route}`, which this block's call sites do not fill here |

A face that cannot be made lawful is **banked as a refusal row with its measurement**, never dropped
(§21.2); the banked count is printed and only ever falls.

**(b) A lost licensed read — the sharpest regression available here.** Dropping either half of R-4:

- drop R-1 (the granary) and the face becomes a `NO reserves, NO medical provision` face;
- drop R-2 ∧ R-3 (the care absence) and the face becomes a `granary AND hospital` or `granary AND parish
  care only` face.

Because the composer mounts one spine per town and this pool is the whole rung, a half-face is not a
thinner sentence — it is **the wrong town's sentence**. This is the regression to guard hardest.

**(c) A lost lawful turn.** Replacing the concrete civic nouns with abstractions — *provision*,
*capacity*, *preparedness*, *resilience*, *infrastructure* — trades the pool's one lawful vocabulary for
the summarising beat (R-DA-10: the concrete civic noun in a working sentence; the `abstractNounRate`
guard; ARCH §8.3's arm Q: a surface naming neither a slot nor a band word is the summarising beat).
Losing **"the stores"** or the granary itself is the concrete symptom.

**(d) A dropped angle.** `[unfolding]` is the one at risk: its only shipped realisation is two future
indicatives, so the easy repair is to flatten it into a second `[ledger]`. That is a dropped angle even
though the claim set survives. The lawful `[unfolding]` is continuation in the present — a standing
condition that keeps standing — and it must still read as a different stance from v1.

**(e) The regressions the density law names (§21.4).** Making a lawful compressed line **plainer with no
law behind the change** is itself the regression; "unclear" is not a finding unless a bar is broken.
So the rewrite may not answer this pool's difficulty by writing three flat inventory sentences.

**(f) New faults the rewrite must not import while curing the old ones.** Each is already refused above,
and each is the natural reach when the sufficiency claim is taken away: a citation or record word
(SOURCE-UNRESOLVED; W24; arm A13) · a holder of any kind · a person (W22) · a count · a tier word · the
word *plague* (W17) · a building history (the block's own PROVENANCE fence) · a totality over persons
(a REFUSED COLUMN) · a maxim or gnomic closer about hunger or sickness (R-DA-12) · an em dash, an
exclamation, a digit, a percent, or a `which`-clause (walls).

**(g) Two composition properties that red at the gate, not at the reading.**

- **THE THREAD (MOVE-GRAMMAR §1.4.1).** This pool is a **spine** (`role: spine`, `attach: []`, modifier
  mounts 0), so its face is **first** in the composed unit and every modifier that follows must be able to
  pick a noun up from it. Each face should therefore end on a civic noun a modifier can take forward —
  the granary, the stores, the sick — rather than on an abstraction or a closed evaluation. A face that
  ends on a summary hands nothing back.
- **THE ECHO KEY.** The card's own warning: the echo table is keyed on the whole table-rung reading and
  **every pool selecting a row of `DISASTER_ROW_POOL` shares one echo key**, so a mount counted against
  this pool may be a sibling ROW. A face may not assume it is the page's only disaster sentence, and no
  face may add a second disaster fact to "use up" the budget.

**(h) Sibling distance (A11).** Today v1 opens on `{settlement}`, v2 on *"The stores"*, v3 on *"The
town"* — narrowly distinct. Across **twelve** faces the same rule binds: no two faces of this pool share
their first two words, and the settlement token opens at most one of them.

---

## 6. SUMMARY FOR THE WRITER, IN ONE PARAGRAPH

This pool holds two facts and no more: a granary stands, and nothing of the care class does. Everything
else in the three shipped sentences — that the grain is enough, that a harvest failed, that a sickness
spreads, that the town has not built, that the town knows what it fears — is invention, and two of those
inventions are refuted by the engine's own numbers rather than merely unlicensed. The pool's whole
difficulty is that its shipped prose earned its force from the sufficiency claim, and the sufficiency
claim is exactly what D-12 contradicts. The ceiling here is a sentence that gets its force from the PAIR
instead: one thing held against one thing wholly absent, in concrete civic nouns, present tense, no
quantifier, no season, no outcome — and different in vocabulary and rhythm four times over, three times
in three stances.

---

## STATUS: COMPLETE. 3 variants marked; 24 claims tagged (8 per variant; 5 LICENSED, 3 LICENSED-IN-CORE, 16 UNLICENSED); sections 0–6 written.
