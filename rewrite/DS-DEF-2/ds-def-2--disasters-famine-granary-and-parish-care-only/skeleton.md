# MARKER SKELETON — DS-DEF-2 · pool `Disasters & Famine: granary AND parish care only`

Seat: opus (MARKER). Packet dir: `rewrite/DS-DEF-2/ds-def-2--disasters-famine-granary-and-parish-care-only/`.
VARIANT COUNT: **3** (angles `[ledger]` · `[street]` · `[visitor]`, in that order).
Run under ADDENDUM 13 PART A (entailment, bars W11–W19) and PART B (referent, bars W20–W27), beside W1–W10 of ADDENDUM 12.

---

## 0. THE LICENCE CARD, AS PRINTED (read-only script in the dock)

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
  echo:       spine mounts 1 (tabs: defense) · modifier mounts 0
              the echo table is keyed on this pool's WHOLE table-rung reading (truncated at the first dot),
              so every pool selecting a row of DISASTER_ROW_POOL shares ONE echo key
  covert:     no
  source:     (none) · standing SOURCE-UNRESOLVED
              NO citation is licensed: a face naming a record holder here is refused by arm A13
  may claim:  that the reader selects the row `granary, parish care` of `DISASTER_ROW_POOL`,
              as a STANDING fact of the record
  may NOT:    a count, a cause, a season, a future, a standpoint, a second fact,
              another civic object of the class `temple`
  audience:   player (no mark)
  REFUSED COLUMNS, always: a totality over persons; an exemption from a duty; a named character and that
  character's fate; a theological claim about a deity
```

### 0.1 The block's annex header lines (DS-DEF-2)
- **STATE-KEY:** five fixed rows, each with a `scoreBand` badge, read against `config.monsterThreat`, the institution presence flags and `compound.inst`. This pool is **row 5, `Disasters & Famine`**.
- **SLOTS:** `{settlement}` `{band}` `{route}` — but the card's bag is FILLED only at `{settlement}` for this block's call sites. **`{band}` is RESERVED and `{route}` is unfilled here: a face naming either renders an unfilled slot.**
- **SECTION-TARGET:** `defense`. **PDF PARITY:** parity.
- **PROVENANCE + FENCE (the block's own, verbatim in substance):** the shape EXTENDS the shipped `buildThreatAssessment` lattice rather than replacing it; every branch today holds exactly ONE string, so every settlement in a branch says the same words. Institution presence is a **STANDING fact with no recorded history**; the causal clauses on this desk are *capability* clauses and never *historical* ones unless the history surface supplies the ancestry. Two standing defects must not be reintroduced (the `plagued`+nothing lowercase lead; the walls predicate) — neither touches this pool.

### 0.2 What the read actually resolves (code, read in the dock)
- `defenseStateProse.js:661-663` — `disasterRowPoolKey(civicFlag(compound.hasGranary), civicFlag(compound.hasHospital), civicFlag(compound.hasChurch))`.
- `defenseStateProse.js:580-586` — `if (granary) { if (hospital) return 'granary, hospital'; return church ? 'granary, parish care' : 'granary, no medical provision'; }`.
- So this pool fires on, and ONLY on: **`hasGranary === true` AND `hasHospital === false` AND `hasChurch === true`.**
- `priorityHelpers.js:63-65` — `hasGranary` = substring `granar`; `hasHospital` = `hospital · monastery · healer · friary`; `hasChurch` = `church · cathedral · temple · monastery · friary · shrine · priest · abbey`.
- **Two consequences the writer must hold:**
  1. **This pool is TOWN OR LARGER.** `hasGranary` is a TIER PROXY (L-20, D-12): `Town granary` is `required: true` at town (`institutionalCatalog.js:925`) and `City granaries` at city (`:1590`); no village-and-below row matches the stem. So the tier band here is town-plus, and `Parish churches (2-5)` is `required: true` at town (`:1260`).
  2. **On THIS branch the church row can never be a monastery or a friary**, because both set `hasHospital` and would route to `granary, hospital`. The church flag here is one of `church · cathedral · temple · shrine · priest · abbey`. No face may lean on a monastic infirmary.
- **The composition fences.** `objectClassesOf` reads the POOL KEY only: this key names **`granary` (class `storehouse`)** and **`parish` (class `temple`)**, so a modifier naming either class is refused at this site by T-F12; the word `care` is NOT a token of the `care` class (`hospital · infirmary · healer · medical · physician · ward`, `wiringCensus.js:1315`), so a care-class modifier is NOT refused by the key — an instrument note, not a writer's licence.
- **SAME-PAGE HAZARD (C7).** The defense tab's per-arm badge prints the engine's own string beside this row: `defenseDisplay.js:237-239` renders `status: 'Clergy care'` with the note *Parish care. Basic wound and disease management.* on exactly this configuration. That string is product code, OUTSIDE the rewrite's corpus (OW-20, recorded for the owner, not acted). It is **not a licence** for a face — but a face asserting a TOTALITY of absence against disease would contradict the engine's own string on the same rendered page. The safe statement is the LACK of the hospital-class row, never "nothing against disease".

---

## 1. THE READS THE REWRITE MUST STATE

Every read the card names, plus every LICENSED claim standing in the shipped rows. **W9: the density floor counts the CARD'S READS, not the entailment table's attributes.** All four are the pool's whole distinction — drop R3 and the pool cannot be told from `granary AND hospital`; drop R4 and it cannot be told from `granary, NO medical provision`.

| # | the read | layer | note |
|---|---|---|---|
| R1 | a granary-class row stands on this settlement's roster (`granary` arg TRUE) | **BODY** | the building, not the stock; town-or-larger by the tier proxy |
| R2 | grain is held in store there and it buffers a harvest (D-12 ENTAILS, carried from v1's licensed clause) | **BODY** | never how full, how many months, who holds the key, drawn on, a count of buildings |
| R3 | **NO hospital-class row stands** (`hospital` arg FALSE) — no hospital, no monastery, no friary, no healer row | **BODY, in the negative** | MOVE-GRAMMAR ABSENCE class (a) LACK: flat, never the opener, never adjacent to another absence, no completing "but" (R-DA-02) |
| R4 | a church-class row stands (`church` arg TRUE); at town `Parish churches (2-5)` is a required row | **BODY** | the house of the faith, NOT a capability and NOT a keeper of records |
| R5 | the three together select the row `granary, parish care` of `DISASTER_ROW_POOL`, as a STANDING fact of the record | the record's own key | stated as a standing condition, never as a capability grading |
| R6 | `{settlement}` is the one filled slot | — | `{band}` and `{route}` render unfilled here |

**The always-safe spellings on this pool** (W15, A-10, A-14, A-15, referent rows 62–64):
- the granary row: *the granary* (the building — the roster carries the row here, so the building word is available) · *the stores* / *what the town holds back* (the stock) — **never both in one word**.
- the church row: *a house of the faith* · *the parish* **as the place, never as a record** — never *the cathedral* or *the church* from `hasChurch` alone; "the clergy" is CONDITIONAL at best and asserts residence the flag does not hold.
- the absent hospital row: *no infirmary* · *no house that takes in the sick* — the `care` words in the negative only.
- **No record word and no citation at all** (W24): the card prints standing SOURCE-UNRESOLVED, so *the register*, *the books*, *the roll*, *the parish register* are all refused, and the `[ledger]` tag licenses none of them.

---

## 2. VARIANT 1 — `[ledger]`

### 2.1 The shipped sentence, verbatim
> `[ledger]` There is food stored at {settlement} and there are clergy who tend the sick: reserves against hunger, and against disease something better than nothing and well short of a hospital.

### 2.2 Every claim it makes
THE READ'S LAYER for this pool: **BODY** (three institution-row flags the read reaches). A noun at any other layer is refused under W20–W27.

| # | claim | verdict | referent layer (claim / read) |
|---|---|---|---|
| 1 | Food is held in store at the settlement. | **LICENSED** — `hasGranary === true` (the `granary` arg of `disasterRowSituation`); D-12 ENTAILS "grain is stored". | BODY / BODY — matches. |
| 2 | Those stores are held against hunger (a buffer). | **LICENSED** — D-12 ENTAILS "it buffers a harvest; communal at town". No depth, duration or fill may attach. | BODY / BODY — matches. |
| 3 | The settlement is named. | **LICENSED** — bag `{settlement: proper}`, the one filled slot. | slot / — |
| 4 | Clergy are resident at the settlement. | **UNLICENSED — an observable the fields do not hold.** D-14 NOT ENTAILED: "resident clergy; a priest". `hasChurch` fires on `Access to parish church` (a church 2–5 km away in another settlement), `Wayside shrine` ("No resident clergy"), and `Priest (resident)` with no building. | **ROLE** asserted on a **BODY** read → W20 (layer bar) and W22 (a ROLE word only on a read that records it; this read records none). |
| 5 | Those clergy tend the sick — the parish supplies medical care. | **UNLICENSED — a second fact and an observable the fields do not hold.** D-14 NOT ENTAILED: "medical capability"; D-14 ENGINE CONTRADICTS "Clergy care from `hasChurch`". W14 THE LABEL BAR: the pool key's own words *parish care* are an ENGINE LABEL read at its engine meaning, never at its dictionary sense — **the key does not license the claim its name makes.** The ratified entailment table names this exact face at annex `:2706` in its list of live corpus faces more knowledgeable than the simulation. | **ROLE** on a **BODY** read → W20, W22. |
| 6 | The settlement's provision against disease is "better than nothing". | **UNLICENSED — a standpoint and a rating.** No typed rating field on this read; VERDICT is not a move of the grammar (MOVE-GRAMMAR §1.3). The arm's grading lives on another surface (`defenseDisplay.js:313`, DS-DEF-6 Medical), which this card does not read. | **AGGREGATE** (a grade) on a **BODY** read → W20. |
| 7 | That provision falls "well short of a hospital". | **SPLIT.** The CONTRAST itself is structurally lawful — A8 / R-DA-02 permit a rejected alternative that a SIBLING POOL KEY names, and `Disasters & Famine: granary AND hospital` is exactly that sibling; the underlying fact is the read `hasHospital === false`. But AS WRITTEN it is a graded comparison of a CAPABILITY, not the flat LACK of a row. **UNLICENSED as a grading; LICENSED only in its flat form** (no hospital-class row stands here). | BODY-in-absence (lawful) fused with AGGREGATE grading (unlawful). |
| 8 | The colon tail restates the two preceding clauses as what they amount to. | **UNLICENSED — a MEANING move.** MOVE-GRAMMAR §1.3: no field holds what a fact means. W6 NO DOUBLED BEAT: a clause that restates the read it follows is the summarising beat. S2 admits ONE riding clause and only where it is a CONSEQUENCE the engine computed of the sentence's own fact; a gloss is not that. | — |

**Not charged, recorded:** the opener is the expletive *There is* — R-DA-07 strikes the expletive; this is a soft band matter for the writer, not a licence failure.

### 2.3 The reads the rewrite must state, here
All of R1–R6 in §1. This face today states R1 and R2 lawfully, inverts nothing, and reaches R3 only through a graded comparison and R4 only through an unlicensed capability. **The rewrite of variant 1 must carry R3 as a flat lack and R4 as a standing house of the faith.**

### 2.4 The angle's stance, in one sentence
`[ledger]`: the clerk enters and measures what stands — the granary row, the absent hospital row, the parish row — as standing facts of the record, **and cites nothing** (W8, W24: the `[ledger]` tag is a STANDPOINT and licenses no record noun, no "the books show", no source, because the card prints SOURCE-UNRESOLVED); it may set two matters side by side, and it may **not** grade either of them, assign the town an intent, or say what the arrangement means.

### 2.5 The turns worth keeping (the density floor)
- `There is food stored at {settlement}` — lawful on R1 (the expletive is the writer's to cure inside the band).
- `reserves against hunger` — lawful on R2: existence and purpose, with no quantity attached. This is the pool's sharpest licensed compression and a face may carry it as it stands.
- The two-matters-side-by-side construction (hunger, then disease) is the ledger's own lawful shape and is the variant's declared grammar under W4.

### 2.6 What would make the rewrite a regression here
1. **A lost licensed read** — dropping `reserves against hunger` (R2) and falling back to bare presence ("there is a granary"), which trades density for plainness with no law behind the change (§21.4).
2. **Keeping a known breach as a floor** — carrying "clergy who tend the sick" or any medical capability of the parish forward because it reads well. ADDENDUM 13 W11's pattern binds generally: a shipped breach is **dropped** by the rewrite, never kept as a floor.
3. **An inventory line** — resolving the cure into a list of three flags with no civic landing; the record lands on the civic thing the fact names and stops there.
4. **A lost lawful turn** — losing the lawful CONTRAST with the sibling `granary AND hospital` altogether: the flat lack IS the pool's distinguishing read, and R-DA-02 licenses it as the first half, flat and alone.
5. **A dropped angle** — the ledger seeing rather than measuring (the visitor's work), or the ledger acquiring a record noun or a citation it is barred from.
6. **A new breach under S2** — replacing the gloss tail with a second riding clause that is not a computed consequence of the sentence's own fact.

---

## 3. VARIANT 2 — `[street]`

### 3.1 The shipped sentence, verbatim
> `[street]` The town can eat through a bad year. What it does about a plague is pray and nurse, in that order.

### 3.2 Every claim it makes
THE READ'S LAYER: **BODY**, as above.

| # | claim | verdict | referent layer (claim / read) |
|---|---|---|---|
| 1 | The town can survive — eat through — a bad year on what it holds. | **UNLICENSED — an observable the fields do not hold, and the engine contradicts it.** D-12 ENGINE CONTRADICTS, verbatim in the ratified table: *a granary means the town eats through a bad year* (`econHealthMult` falls to ×0.45, `defenseGenerator.js:281-290`; the disaster gate floors at 0.55, `:608-618`). It also asserts a DURATION — D-12 NOT ENTAILED "how many months" (`storageMonths` is a separate field this card does not read). **The licensed remainder is R2 only: grain is stored and it buffers a harvest.** | **AGGREGATE** (a capacity over a span) on a **BODY** read → W20. |
| 2 | The settlement faces, or may face, a plague. | **UNLICENSED — a forecast and a second fact.** W17 THE CRISIS BAR: a disease outbreak is *illness* or *sickness*, **never "the plague"**. No stress record is read by this card at all; the three flags are the whole read. | **NONE** (a condition) on a **BODY** read → W20. |
| 3 | The town's answer to such a sickness is prayer. | **UNLICENSED — a forecast, an act no field records, and a belief frame.** MOVE-GRAMMAR §1.3: FORECAST does not exist; STATE never FATE. A TRADITION move needs a custom / rite / creed field and this card holds none. The deity doctrine sits on top of any observance claim. | **TRADITION / ROLE** on a **BODY** read → W20, W19. |
| 4 | The town's answer is also nursing — the parish tends the sick. | **UNLICENSED** on the same ground as variant 1 claim 5: D-14 NOT ENTAILED "medical capability"; D-14 ENGINE CONTRADICTS "Clergy care from `hasChurch`"; the key's own word *care* is a LABEL read at engine meaning (W14). | **ROLE** on a **BODY** read → W20, W22. |
| 5 | Prayer comes before nursing — "in that order". | **UNLICENSED — a maxim close and an ordering no field holds.** The register card forbids the kicker (an effect bought with a fact) and the close on a moral; R-DA-12's generalisation test convicts it. | — |
| 6 | "The town" is an agent that decides and does. | **UNLICENSED — a fused agent.** W23: no relation between referents that no field computes, and "the town has decided" is the bar's own example. W22 bars the person-plural as a load-bearing decider. | POWER/AGGREGATE fused / **BODY** read. |
| 7 | The settlement is named. | — **the `{settlement}` slot is NOT used in this variant.** Lawful in itself (R-DA-17 caps the settlement opener), and recorded because the composed passage must still resolve its referent from the spine. | slot / — |

**The pool-level fault in this variant:** it states **one** of the four reads (R1, and in an engine-contradicted form), and states **neither R3 nor R4** in any licensed form. "pray and nurse" gestures at the church arm without asserting `hasChurch === true`, and the hospital's absence is nowhere. This is the variant with the least licensed content in the pool.

### 3.3 The reads the rewrite must state, here
All of R1–R6 in §1, and **R3 and R4 must be built in from nothing** — the shipped face carries neither.

### 3.4 The angle's stance, in one sentence
`[street]`: what is ordinary and unremarkable about the arrangement as the town lives with it — the store that is simply there, the house of the faith on its ground, the absence of any house that takes in the sick — stated in the clerk's third person **without a person as agent, without a decision, without a prediction of what the town would do, and without a maxim to close on**; the street angle may say a thing is unsurprising here, and may not say what the town thinks, fears, prays or intends.

### 3.5 The turns worth keeping (the density floor)
- **Nothing in this variant survives whole.** Its first sentence is engine-contradicted; its second carries four unlicensed claims and a maxim close.
- What survives as SHAPE, not as text: the two-sentence construction — a standing fact, then a second standing fact of a different kind — is variant 2's declared grammar and is the refiner's to keep under W4 (THE CONSTRUCTION CONTRACT). The rewrite must not move variant 2 onto variant 1's construction.
- The register card's own permission applies here more than anywhere in the pool: *the short line exists*, and a plain second sentence stating the lack is the lawful use of that shape.

### 3.6 What would make the rewrite a regression here
1. **Carrying "can eat through a bad year" forward** because it is the pool's most memorable clause. It is the one claim in this pool the ENGINE ITSELF contradicts, and the owner's principle is that the prose may be more elegant than the data and never more knowledgeable.
2. **A lost licensed read** — leaving R3 and R4 unstated again. A second face that states only the granary makes this pool indistinguishable from `granary, NO medical provision` for every seed that draws variant 2.
3. **A lost lawful turn** — collapsing the two sentences into one and taking the variant onto variant 1's grammar (W4 CONSTRUCTION COLLAPSE, the named regression of the DS-DEF-11 refute round).
4. **A dropped angle** — the street angle turning into the ledger's measure, or into a second visitor.
5. **A new maxim** — replacing "in that order" with any other closing generalisation; the gnomic closer is the lowest-ceiling member of the CLOSE set and is measured before it is capped.
6. **A totality of absence** — writing "there is nothing here against sickness". The read is the absence of a hospital-class ROW, not an absence of care in the world, and the engine's own badge string prints *Clergy care* on the same page (C7).

---

## 4. VARIANT 3 — `[visitor]`

### 4.1 The shipped sentence, verbatim
> `[visitor]` A stranger finds a full store and a modest infirmary at {settlement}, and can see which of the two the town has spent its thinking on.

### 4.2 Every claim it makes
THE READ'S LAYER: **BODY**, as above.

| # | claim | verdict | referent layer (claim / read) |
|---|---|---|---|
| 1 | A stranger arrives at the settlement and observes it. | **LICENSED** — the `[visitor]` stance. W27: "a stranger" is the visitor's eye; it may **see**, and never act, decide, be told, or be given a name. | stance, not a referent / — |
| 2 | There is a store of food at the settlement. | **LICENSED** — R1 / R2. ("store" is a `store`-class STOCK word on a BUILDING read; the roster carries the granary row here, so both the building word and the stock word are available — the fault in this clause is the modifier, not the noun.) | BODY / BODY — matches. |
| 3 | That store is **full**. | **UNLICENSED — a count and an observable the fields do not hold.** D-12 NOT ENTAILED, first item: "how full". The fill band is `granary.band` on DS-ECO-2, a reading at layer **NONE** that this card does not read (referent table row 184 / 198). | **NONE** (a stock band) on a **BODY** read → W20. |
| 4 | There is an **infirmary** at the settlement. | **UNLICENSED — the sharpest breach in the pool.** This branch is reached ONLY where `hasHospital === false`; the clause names the precise `care`-class body the read denies (`hasHospital` matches hospital · monastery · healer · friary — all four absent). The ratified referent table already flags this face at annex `:2708`. It is also a same-entry contradiction of the pool's own key (CLERK-LAWS C3/C5). | **BODY named against a read that denies the row** → W20; a false BODY. |
| 5 | That infirmary is **modest** — a grade of its capacity. | **UNLICENSED — a rating with no rating field.** D-13 NOT ENTAILED: "beds; physicians; a count; that it can contain the outbreak; funding". Compounds the breach in claim 4. | **AGGREGATE** on a **BODY** read → W20. |
| 6 | The town chose between the two and spent more thought on one of them. | **UNLICENSED — a cause, an intent, and a fused agent, and the engine contradicts the premise.** W23 FUSED-AGENT ("the town has decided" is the bar's own example); W22 PERSON BAR. And roster law **R-A**: a `required: true` row is pushed without a draw (`assembleInstitutions.js:283-293`) — **`Town granary` and `Parish churches (2-5)` are BOTH required at town**, so no choice was made between them and none can be read off the roster. | POWER/AGGREGATE fused / **BODY** read. |
| 7 | A stranger can see that priority. | **UNLICENSED — a standpoint and a verdict.** MOVE-GRAMMAR §1.3: VERDICT / MEANING do not exist. W27 lets the visitor's eye see a standing fact; it does not let it read a decision off a roster. | — |
| 8 | The settlement is named. | **LICENSED** — bag `{settlement: proper}`. | slot / — |

**The pool-level fault in this variant:** it states R1 lawfully, **inverts R3** (asserting the very body the read denies), and states R4 nowhere at all — the "infirmary" stands in the place where the house of the faith should be.

### 4.3 The reads the rewrite must state, here
All of R1–R6 in §1. **R3 must be inverted back to a lack and R4 must be built in from nothing.** This is the variant where the visitor's eye does the most work for free: what a stranger can see standing, and what a stranger can see is not there, are exactly R1, R3 and R4.

### 4.4 The angle's stance, in one sentence
`[visitor]`: a stranger's eye passing through a town of this size records what stands and what is absent — a granary, a parish church, and no house that takes in the sick — **as things seen**, and may not act, decide, be told, be given a name, read an intention off what it sees, grade what it finds, or produce an accounts fact.

### 4.5 The turns worth keeping (the density floor)
- `A stranger finds ... at {settlement}` — the frame is lawful as it stands (W27) and is variant 3's declared construction under W4; a face may carry the frame verbatim with a lawful object.
- The **seen-and-not-seen pairing** is the lawful heart of this variant: the visitor finding one thing standing and another not there is the exemplary use of the LACK on this pool, and it is the one place in the pool where R3 lands as something observed rather than as a comparison.
- No other clause of variant 3 survives: `a full store`, `a modest infirmary`, and the whole second half are unlicensed.

### 4.6 What would make the rewrite a regression here
1. **Keeping "a modest infirmary"** — or any hospital-class body, hedged or graded — because it makes the sentence concrete. It asserts the row the key denies; it is the pool's known breach and the rewrite drops it.
2. **Keeping "a full store"** — the fullness is a different desk's reading and a count this card refuses; "a store" alone is lawful and loses nothing but the false precision.
3. **A lost licensed read** — letting the visitor see only the granary. The visitor is the angle best placed to carry R3 and R4 together; a rewrite that drops either wastes the stance.
4. **A lost lawful turn** — losing the seen/not-seen pairing and replacing it with a single observation, or moving variant 3 onto variant 1's ledger construction (W4).
5. **A dropped angle** — the stranger being told something, being given a name, deciding, or pronouncing; or the stranger becoming the ledger by producing a measure.
6. **A substituted verdict** — replacing "which of the two the town has spent its thinking on" with any other closing judgment (what the arrangement says about the place, what it would mean in a bad year). The close must be a standing fact of a varied kind, never a verdict.

---

## 5. POOL-LEVEL NOTES FOR THE DRAFTER (nothing here is a new licence)

### 5.1 The pool's whole licensed content, in one place
Four body facts and nothing else: **a granary row stands · grain is held there and buffers a harvest · no hospital-class row stands · a church-class row stands.** Every other claim in the three shipped sentences is unlicensed. The pool is town-or-larger, and both of its present rows are `required: true` at town — so nothing here was chosen, afforded, prioritised or built in response to anything.

### 5.2 The trap this pool is built on
**The key names what the key is not licensed to claim.** The pool is called `granary AND parish care only`, and *care* is the one thing `hasChurch` does not entail (D-14 NOT ENTAILED "medical capability"; D-14 ENGINE CONTRADICTS "Clergy care from `hasChurch`"; W14 THE LABEL BAR). The producer's own docblock says as much in the code: *A CHURCH COUNTS AS MEDICAL PROVISION ONLY IN THE GRANARY BRANCH, and that is the corpus's own shape rather than a choice* (`defenseStateProse.js:573-578`). All three shipped variants reach for the key's own word and all three break on it. **The pool's distinction from its two siblings is a BODY PRESENCE and a BODY ABSENCE, not a grade of care**, and a face that states the two bodies plainly is both lawful and sharper than a face that grades a capability the engine does not hold.

*Recorded for the chair, not acted:* the engine's own badge string on the same tab does grade it (`defenseDisplay.js:237-239`, `:313`, status `Clergy care`, note *Parish care. Basic wound and disease management.*). That string is product code outside the rewrite's corpus (OW-20) and is **not** a licence for a face; it is also the reason no face may write a totality of absence against sickness (C7, same page).

### 5.3 The thread, and the four faces
- **R-i binds at k = 0:** this is a spine of FORM `sentence`, so a face's own second sentence must carry a noun forward from its first — the granary, the stores, the parish, the house of the faith. A face whose second sentence changes subject and hands nothing back is a disconnect the refuters will name.
- The composer orders modifiers by salience with the spine first, and the drafter does not choose the face's place: **each face must read well immediately after the spine and after any sibling modifier.**
- **Four faces per semantic variant**, each a different vocabulary or rhythm inside the voice, never a paraphrase of its sibling, differing in CONSTRUCTION and not vocabulary alone, and **claim-equal to each other** (A6 reads across the faces). *(Recorded: the brief's title line still reads "three faces each"; the brief's own cure item (4) and the owner's four-variants rule read four. The drafter writes four.)*
- **Never trim:** the three variants keep their vids, their angle tags, their order and their one bracketed tag each; a second bracketed tag on a numbered line is refused by the projector.

### 5.4 The surface walls that bind every face here
No em dash · no exclamation · no digit or percent · no `which`-clause · no question · no second person · no figure, sense verb on an abstraction, or intent for an inanimate thing · no forecast (the edge is subjunctive) · no citation and no record noun (SOURCE-UNRESOLVED) · no count, no season, no cause, no standpoint, no totality over persons · no named character · no theological claim · `{band}` and `{route}` unfilled at this block's call sites.

### 5.5 The pool's regression list, consolidated
1. Any medical capability, grade or comparison of the parish (the pool's known breach, in all three variants).
2. `a modest infirmary` — a body the read denies (variant 3).
3. `a full store` — a fill the card does not read (variant 3).
4. `can eat through a bad year` — engine-contradicted (variant 2).
5. Any intent, choice or priority of the town — both rows are required (variant 3, and the fused-agent shape in variant 2).
6. Any face that states fewer than all four reads, or that states them as a bare list with no civic landing (the inventory line, refused by the gate against this skeleton and failed by the refuters).
7. Any lawful shipped clause dropped rather than kept as one of the four faces — specifically `reserves against hunger` and the visitor's `A stranger finds ... at {settlement}` frame (the density law, ADDENDUM 6 and the brief's §64 ruling).

---

*Packet complete. Marker: opus. Variants marked: 3.*
