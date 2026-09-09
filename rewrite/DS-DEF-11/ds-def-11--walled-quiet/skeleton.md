Seat: Fable 5.1 (MARKER, DS-DEF-11 · pool `WALLED-QUIET` · the skeleton the writer drafts from; nothing here is a face)

# DS-DEF-11 · `WALLED-QUIET` · SKELETON

Three shipped variants, vids 1 to 3, angles `[visitor]` `[elder]` `[ledger]` in that order. The rows below are the annex's at the dock tip (`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` lines 5976 to 5979) and the generated leaf carries the same three texts (`src/data/dossierStateProse/defense.generated.js` from line 5275, slots and vids as printed here). The writer rewrites these three, one for one, and gives each its three `[face]` sub-rows.

## 0. What the writer reads before the first word

### 0.1 The licence card (printed this session, `node scripts/prose-licence-card.mjs DS-DEF-11 'WALLED-QUIET'`, in the dock)

```
LICENCE (block DS-DEF-11 · role spine · key `WALLED-QUIET`)
  reads:      forces.walls.present   (measured)
              settlement.config.monsterThreat   (measured)
              settlement.defenseProfile.economicGates.military   (measured)
              (absent ⇒ no candidate; a modifier is silent, never "false")
  predicate:  (none recovered: the pool has no key-function branch)
  bag:        {defwork: bare-common, settlement: proper}
              FILLED at this block's call sites: {settlement} · NAMED BUT NEVER FILLED: {defwork}
  relation:   (a spine takes no relation)
  seat/form:  (not a seat-taker) / sentence      move: (none declared)     angle: elder ledger visitor
  attach:     (empty: a spine takes no attach set)
  echo:       spine mounts 2 (tabs: defense) · modifier mounts 0 (none)
  covert:     no
  source:     muster + road · standing LICENSED · two-source row
              a citation of this holder is licensed where the provenance budget allows
  may claim:  that `present` holds, as a STANDING fact of the record
  may NOT:    a count, a cause, a season, a future, a standpoint, a second fact, another civic object of the class `wall`
  audience:   player (no mark)
  REFUSED COLUMNS, always: a totality over persons; an exemption from a duty; a named character and that character's fate; a theological claim about a deity
```

### 0.2 The block's header lines (annex lines 5963 to 5969, the parts that bind this pool)

- **STATE-KEY:** `WALLED-QUIET` is glossed by the block as *walls, no live threat*; its siblings are `WALLED-THREATENED` (walls, live threat) and `WALLED-STRAINED` (walls, impaired upkeep). The desk's key function (`src/domain/display/stateProse/defenseStateProse.js`, `wallRationalePoolKey`) reaches this key only when ALL THREE of the card's reads hold: the walls are present; the military upkeep gate is NOT below one (STRAINED outranks and takes any gate below one); and the measured monster family is `settled` (the producer's tier word is `heartland`, with `low` as its alias; `frontier` and `plagued` go to THREATENED; an absent tier returns null and the desk says nothing). The card's predicate line reads "none recovered"; the branch is as stated here, read this session.
- **SLOTS:** `{settlement}` (proper) and `{defwork}` (bare-common, the settlement's own wall-class institution by its RECORDED name, never a baked or invented noun; a settlement with no wall-class row is not offered a variant that needs one). The desk fills `{defwork}` from the first standing wall-class name (`defworkFill`). The card's bag line says `{defwork}` is NAMED BUT NEVER FILLED at the census's call sites; the desk code fills it. This is a census-versus-code disagreement and a WIRING row for the chair, not a wording row; the writer keeps `{defwork}` on every row exactly as the shipped parents carry it.
- **PROVENANCE:** both halves of the enclosure mechanism are structural reads of live fields (the threat side and the purse side). *WHEN the wall was raised has NO backing fact at this tip and is deliberately absent.* This block is the why-frame for the fortification fact alone and composes BESIDE `DS-DEF-5` (the armed-forces surface) and `DS-DEF-10` (the arms ladder), never over the same cell twice.
- **Composition fences:** a sentence-form spine; no relation, no attach; two spine mounts on the defense tab, zero modifier mounts today. The face-row refusals of ARCH §2.5 bind every sub-row: a face whose `{slot}` set differs from its parent's is refused; a sentence face may not open on the `proper`-typed slot of the bag; no face beyond the pinned count.

### 0.3 The register card's six one-line registers (the dossier line is the one this pool lives under)

- The dossier: the record itself; the clerk's third person; the six shapes of its closed set; the town's name is not the default opener.
- The NPC ladder: read aloud to the players; role-bound; never a named interior; the stage licenses the claim, never the shape.
- The Herald: the estate's one quoted in-world voice; report mode; flattest where hottest; the bill lands apart from the deed.
- The chronicle: a borrowed body of headlines; its own prose is frames and dressings; the quiet year is one sentence of varied shape.
- The DM page: candid; the why only from a typed field; second person to the referee alone; it grades, never hedges.
- Chrome and the docent: never the archivist; the product speaking to the person who runs it; mechanics first, one term per thing.

### 0.4 The owner's rules that bind every face, restated once

Four wording faces per semantic variant, each a different vocabulary or rhythm inside the voice, never a paraphrase of its sibling. Never trim (Part B §22: counts only rise; a face that fails stays in the annex as a refusal row). An unweighted seeded roll picks the face at render, so every face stands alone. The exemplar, not the practical. Every claim licensed by the card and by nothing else. No em dash, no exclamation mark, no digit, no which-clause. The clerk who was there, compiling from records. THE THREAD (MOVE-GRAMMAR §1.4.1): this pool is a SPINE, so it is FIRST in its composed unit; every face must hand a noun forward that a modifier can pick up (the `{defwork}`, the country, the roll) and must close on a standing fact, never on a set-up. The composer orders modifiers by salience after the spine; the spine does not choose what follows it.

### 0.5 The reads, resolved to what each licenses (the writer's one table)

| read | what it holds for this key | the holder (source) | what it licenses in words | what it does NOT license |
|---|---|---|---|---|
| `forces.walls.present` | true: a standing wall-class institution is on the town's roll (perimeter read is `standingDefenseForces`, so a thrown-down wall keys UNWALLED, never here) | the muster roll (`holderTable.js` line 188: `walls` → muster) | the `{defwork}` stands; the town keeps, has, holds standing, carries as standing its `{defwork}` | a count of walls; a second wall-class object; when it was raised; its condition beyond standing; a future ("will stand", "goes on standing" as a forecast) |
| `settlement.config.monsterThreat` measured to the `settled` family | the country's threat tier is the settled band (heartland / low), MEASURED not defaulted; the STATE-KEY's own gloss is *no live threat* | the road (`holderTable.js` line 234: `monsterThreat` → road; "the look of things") | the country is quiet; no live threat stands against the town; the settled band as a standing condition of the country | a peace (a war-and-treaty state is another holder's record); a cause ("so the wall is not needed"); a season or a span ("these years"); a forecast of the threat returning; a geography word for the band (`heartland` is a tier label, not a place) |
| `settlement.defenseProfile.economicGates.military` not below one | the upkeep gate on the paid defenses (the generator's comment names garrison wages and wall maintenance) sits at identity: the funded portion is paid at its full rate; with walls present the gate is always recorded (walls count toward `hasAnyDefense`), so QUIET implies the gate is exactly one | the muster roll (`holderTable.js` line 195: `economicGates` → muster) | the wall's upkeep is met; the paid defense is funded in full; nothing on the roll is short | a sum or a rate ("pays little", "cheap"); a comparison of costs; that the town pays little BECAUSE it asks little; the generator's stone-versus-wages asymmetry (that is STRAINED's mechanism and has no work to do where the gate is one) |

**The chair's brief for this packet orders every read stated.** The card's may-claim line names `present` alone and refuses "a second fact"; attempt3's refinement wrote twelve rows on `present` alone and its own ledger (refine.md, hazard 1) recorded that the pool's discriminating claim (the quiet) was absent from every row, so the spines were claim-identical to a THREATENED spine. The three reads are the STATE-KEY's one composite condition and are stated as ONE PRESENT move on the STATE-KEY (MOVE-GRAMMAR §1.2 row 1: the block's STATE-KEY is a licensing field), joined by co-ordination, apposition or a rationed semicolon, NEVER by a causal joint ("because", "now that", "so", "since"). A face that states the three as three facts with a cause between them has bought the cause. The marker records this reading so a refuter judges the faces on the brief, not on the narrower card line; the tension itself is the chair's to close.

### 0.6 The provenance move, priced for this pool

The card licenses a citation of the holder where the budget allows. The ceiling is ONE per unit (Part B §24), and only for one of S3's three reasons: two accounts that disagree; a count from an interested party; a record whose keeper is a power. None obtains on this key: the muster and the road hold two DIFFERENT facts (the wall, the country), not two accounts of one; no count is stated; the muster is not marked interested by the holder table (its line 110 to 111). So the exemplar rate is zero and a citation here is a habit, a refuter's finding. If the writer spends the one anyway, it goes on the `[ledger]` variant only, names the roll for the wall's entry, and never the office's own books (MOVE-GRAMMAR §4.4.3). Recommendation: zero.

### 0.7 What attempt3's refuters failed on this pool, so the writer does not walk into it

- A durative that reads as a future: *goes on standing*, *up it remains* (FAILED under the register card and R-DST-B: the present stands, no forecast). A stative verb's own aspect is licensed; a tail that asserts continuance forward is not.
- A summarising second beat: *Set down as standing, the {defwork} stands* and *Entered as standing, the {defwork} stands* (FAILED: the record never sums up the beat before; one predicate once).
- A cleft whose exhaustive reading claims the wall is all the town has: *What {settlement} has is a {defwork}* (FAILED on the card's "another civic object of the class wall" by the cleft's totality).
- Two faces that are one paraphrase: *The {defwork} is carried as standing* beside *Set down as standing, the {defwork} stands* (FAILED under the four-faces rule).
- A cross-pool signature: an *Entered ...,* participial opener also used by `UNWALLED-LARGE` (a spread finding under A11 and MOVE-GRAMMAR §3.4).
- `holds` of a wall imports resistance, a THREATENED claim, on the pool whose key is no live threat (the refiner's own note; keep it out).

---

## VARIANT 1 · `[visitor]`

### 1.2 Shipped sentence, verbatim

> {settlement} keeps a {defwork} the present peace does not obviously require, and keeping it is cheaper than ever needing it again.

### 1.3 Every claim it makes

- {settlement} keeps a {defwork}: a standing wall-class work is the town's. **LICENSED** `forces.walls.present` (the card's may-claim: present as a standing fact). *keeps* is the verb the attempt3 refiner cleared as this pool's; it is licensed as holding-standing, and no further.
- The present is quiet: the country carries no live threat. **LICENSED** `settlement.config.monsterThreat` measured to `settled` (the STATE-KEY's gloss, *no live threat*).
- That quiet is a *peace*. **UNLICENSED**: a second fact from a holder the card does not read (a peace is a war-and-treaty state, the politics and war records; the road holds a threat tier, not a treaty).
- The peace does not require the wall. **UNLICENSED**: a cause (the wall's justification, stated in the negative; the card refuses a cause).
- *obviously*: an observer grades the requirement. **UNLICENSED**: a standpoint (the card refuses a standpoint; the record has no persona and assigns no reaction).
- Keeping the wall is cheaper than needing it. **UNLICENSED**: a count (a cost comparison no field holds; the gate reads at one and says the upkeep is met, never what it costs against an alternative).
- *ever needing it again*: the wall may be needed in a future. **UNLICENSED**: a forecast (the card refuses a future; no field says what comes next).
- *again*: the wall was once needed. **UNLICENSED**: a history (the PROVENANCE line: when the wall was raised, and so any past need, has no backing fact and is deliberately absent).
- The whole second clause as a rule of thumb about keeping walls. **UNLICENSED**: a maxim (the generalisation test, R-DA-12; the record never closes on a maxim).

### 1.4 The reads the rewrite must state

- `forces.walls.present`: the `{defwork}` stands, as a standing fact (LICENSED claim carried from the shipped line: *{settlement} keeps a {defwork}*).
- `settlement.config.monsterThreat` → `settled`: the country carries no live threat (LICENSED content carried from the shipped line: the quiet, without the word *peace*).
- `settlement.defenseProfile.economicGates.military` not below one: the wall's upkeep is met, the paid defense funded in full (not in the shipped line; owed by the brief).

### 1.5 The angle's stance

The visitor states what a stranger notices first, without being told (the annex §0b palette): the wall standing, the country quiet, the wall kept up; it may say the seen condition of the enclosure and the road, from the muster and the road as compiled by the office, and it may NOT judge whether the wall is required, price its keeping, forecast its need, recall its raising, or read the purse (the gate is a books fact; the visitor states it only as the wall being kept, never as a sum). No "I", no "you", no persona: the visitor is a standpoint of ORDER (what is seen first), not a voice.

### 1.6 The turns worth keeping (lawful clauses, verbatim)

- *{settlement} keeps a {defwork}* (the presence as a standing fact; the verb cleared for this pool; the pool's one settlement-token opener, which order constraint 10 allows once).
- The shape of a present condition set beside a quiet: *the present ... does not* is not keepable as words (it carries *peace* and the cause), but the MOVE it gestures at, the wall stated and the quiet stated beside it without a joint, is the density floor the rewrite must reach.

### 1.7 What would make the rewrite a regression here

- Inventory: vid 1 is not the first row, or its angle is not `[visitor]`, or its slot set is not `{settlement}` + `{defwork}`, or it has fewer than four wordings, or it is no longer the pool's canonical index-zero line.
- A lost licensed read: any face that drops the standing wall, or drops the quiet the shipped line already carried, or omits the met upkeep the brief orders.
- A lost lawful turn: no face keeps *{settlement} keeps a {defwork}* or a same-claim variant of it.
- A dropped angle: a face that reads the books (a sum, a rate), remembers (a length, a date), or judges (a requirement).
- A re-import of the unlicensed claims: *peace*, *require*, *obviously*, *cheaper*, *ever ... again*, or any maxim shape.
- A durative tail that reads forward (attempt3's failure at this variant's face three); a second settlement-token opener anywhere in the pool; a face opening on `{settlement}` as a proper slot in a sub-row (T-F8); a face that ends on a set-up rather than a standing fact the modifiers can pick up.

---

## VARIANT 2 · `[elder]`

### 2.2 Shipped sentence, verbatim

> The {defwork} stands ahead of any present need; walls are easier to keep than to raise, and {settlement} keeps this one.

### 2.3 Every claim it makes

- The {defwork} stands. **LICENSED** `forces.walls.present`.
- There is no present need of it: the country carries no live threat. **LICENSED** in content by `settlement.config.monsterThreat` → `settled`.
- *need*: the quiet framed as an absence of requirement for the wall. **UNLICENSED**: a cause frame (whether the wall is needed is a justification no field holds; the card refuses a cause).
- *ahead of*: the wall stands BEFORE a need, which orders the wall against a need that may come. **UNLICENSED**: a forecast (a need to come is a future) and, read the other way, a history (the wall was raised before any need; the PROVENANCE line bars the raising).
- Walls are easier to keep than to raise. **UNLICENSED**: a maxim (a generalisation over walls in the world, the record never closes on one); a count (a comparison of two costs no field holds); a totality (walls as a class); and *raise* is the history the block refuses.
- {settlement} keeps this one. **LICENSED** in content (`forces.walls.present`) but **UNLICENSED** as placed: it restates the sentence's own opening fact (the register card: the WORD may recur, the FACT must not), and *this one* sets the town's wall against other walls, an implied second civic object of the class wall, which the card refuses.
- The semicolon joint between the standing fact and the maxim. **UNLICENSED** as a joint: S2 licenses one clause for a COMPUTED consequence of the sentence's own fact; a maxim is not a computed consequence.

### 2.4 The reads the rewrite must state

- `forces.walls.present`: the `{defwork}` stands (LICENSED claim carried: *The {defwork} stands*).
- `settlement.config.monsterThreat` → `settled`: no live threat stands against the town (LICENSED content carried: the absence of a present threat, without the *need* frame).
- `settlement.defenseProfile.economicGates.military` not below one: the wall's upkeep is met (not in the shipped line; owed by the brief; the shipped *keep* verb is the lawful hook for it: the town keeps the wall, and its keeping is paid).

### 2.5 The angle's stance

The elder is the memory frame, the condition as something with a length to it (the annex §0b palette). On this pool that length has NO backing field: the PROVENANCE line bars the raising date and the threat tier is a standing configuration with no span. So the elder here may carry length only in the stative verb's own aspect (*stands*, *keeps*, *has standing*) and in the plainness of a thing long taken as given, and may NOT state a span, an age, a date, a reign, a "still", a "yet", a "no longer", a forecast, or a maxim; it may not attribute the fact to the elders as a holder (the elders are not this pool's source; the card's holders are the muster and the road). The elder's licence in this pool is the hardest of the three, and the wall against it is Part B's FATE census: no face takes the future.

### 2.6 The turns worth keeping (lawful clauses, verbatim)

- *The {defwork} stands* (the presence, the copula-free stative, the register's plain opening on the civic noun).
- *{settlement} keeps* (as a verb phrase, without *this one*; the keeping is the licensed hook for the upkeep read).

### 2.7 What would make the rewrite a regression here

- Inventory: vid 2 is not the second row, or its angle is not `[elder]`, or its slot set is not `{defwork}` + `{settlement}`, or it has fewer than four wordings.
- A lost licensed read: any face that drops the standing wall, the quiet, or the met upkeep.
- A lost lawful turn: no face carries *The {defwork} stands* or a same-claim stative.
- A dropped angle: an elder face that is only the visitor's seen wall or the ledger's entered wall, with no length in its aspect; or an elder face that buys its length with a span, a date or a *still*.
- A re-import: *ahead of*, *need*, *easier to keep than to raise*, *this one*, or any maxim joined by a semicolon.
- A face that opens on `{settlement}` (order constraint 10: the pool's one settlement opener is variant 1's); two faces sharing their first two words with variant 3's rows (*The {defwork}* is this variant's opener and A11 counts it across the pool: keep variant 3 off it); a *which*; a durative that forecasts.

---

## VARIANT 3 · `[ledger]`

### 3.2 Shipped sentence, verbatim

> The town pays little for its {defwork} now that it asks little of it; built work stands on its own patience.

### 3.3 Every claim it makes

- The town has a {defwork} (*its {defwork}*). **LICENSED** `forces.walls.present`.
- The town pays little for it. **UNLICENSED**: a count (a quantity of outlay no field holds; the licensed read is the gate at one, which says the upkeep is MET IN FULL, the opposite direction from *little*).
- The town asks little of the wall: no live threat presses it. **LICENSED** in content by `settlement.config.monsterThreat` → `settled`.
- *now that*: the low outlay is caused by the low demand. **UNLICENSED**: a cause (the card refuses a cause; the two reads are co-ordinate conditions, not a mechanism).
- *now*: a time marker on the condition. **UNLICENSED** as a season (the card refuses a season; the threat band carries no span and no onset).
- Built work stands on its own patience. **UNLICENSED**: a figure (patience is a feeling given to stone, an intent on an inanimate thing, R-DA-11), a maxim (a generalisation over built work), a totality (built work as a class), and a second fact. Its kernel (built walls keep standing regardless of pay) is the generator's recorded rule the PROVENANCE line cites for the purse side, but it is not a read on this card and the card is the only licence; and on THIS key the gate is one, so the stone-versus-wages asymmetry has no work to do here (it is `WALLED-STRAINED`'s turn).
- The semicolon joint. **UNLICENSED** as a joint (S2: a computed consequence only; a maxim is not one).

### 3.4 The reads the rewrite must state

- `forces.walls.present`: the `{defwork}` stands, as the roll carries it (LICENSED claim carried: *its {defwork}*, the town's wall).
- `settlement.config.monsterThreat` → `settled`: the country carries no live threat (LICENSED content carried: *asks little of it*, without the causal *now that*).
- `settlement.defenseProfile.economicGates.military` not below one: the wall's upkeep is met in full on the roll (the shipped line's *pays* is the wrong direction; the ledger's lawful statement is that nothing on the muster is short, the paid defense is funded at its full rate).

### 3.5 The angle's stance

The ledger is the clerk's view, what the books, rolls and counts show (the annex §0b palette), and on this pool the books ARE the card's holders: the muster roll carries the wall and the upkeep gate, the road carries the threat tier. The ledger may state the wall as entered standing, the upkeep as met on the roll, the country as the road reports it, in the office's own formula (*entered*, *carried*, *set down*, *on the roll*, *the roll shows*); it may NOT state a sum, a rate, a comparison of costs, a cause between the purse and the quiet, a maxim about built work, or a figure. A citation of the roll is licensed by the card but priced at zero here (§0.6): the office does not cite its own compiled books by habit, and none of S3's three reasons obtains. Note the shipped line names no `{settlement}` slot (*The town*); the shipped parent's slot set is `{defwork}` alone, and a face whose slot set differs from its parent's is refused (ARCH §2.5), so every face of this variant carries `{defwork}` and no `{settlement}` unless the chair rules the parent's slot set may change (a wiring row, not the writer's).

### 3.6 The turns worth keeping (lawful clauses, verbatim)

- *its {defwork}* (the possessive carries the presence as the town's own, which is the roll's way of holding it).
- *The town* as the subject (the pool's one row that does not spend the proper slot; keeps the settlement opener count at one for the pool and keeps this variant's first two words apart from variant 2's *The {defwork}*).
- The MOVE of *asks little of it* (the quiet stated as what is asked of the wall, a measurement in words, not a peace and not a need), keepable in substance once the *now that* joint is cut.

### 3.7 What would make the rewrite a regression here

- Inventory: vid 3 is not the third row, or its angle is not `[ledger]`, or its slot set is not `{defwork}` alone, or it has fewer than four wordings.
- A lost licensed read: any face that drops the standing wall, the quiet, or the met upkeep; or a face that states the upkeep in the shipped line's direction (*pays little*, *cheap*, *costs the town nothing*).
- A lost lawful turn: no face keeps the town's ownership of its `{defwork}` or the quiet as what is asked of the wall.
- A dropped angle: a ledger face with no roll in it (a visitor's seen wall in the ledger's slot), or a ledger face that cites the office's own books, or spends a citation with no S3 reason.
- A re-import: *pays little*, *now that*, *patience*, *built work stands*, or any maxim joined by a semicolon.
- The two attempt3 ledger failures: a summarising second beat (*set down as standing, the wall stands*) and a face that paraphrases a sibling face; a participial *Entered ...,* opener shared with `UNWALLED-LARGE`; a *which*; a digit; an em dash.

---

## 4. Pool-wide regression lines (the inventory the chair's gate walks)

- Three variants, vids 1 2 3, in the shipped order, angles visitor elder ledger; none added, none removed, none merged, none reordered; index zero canonical.
- Four wordings per variant after the rewrite (the numbered line and three `[face]` sub-rows), twelve in all; the face count is a ratchet that reds on a fall.
- Slot sets held to the shipped parents: `{settlement} {defwork}` · `{defwork} {settlement}` · `{defwork}`.
- Exactly one variant opens on the settlement token (variant 1), never two adjacent; no sub-row opens on `{settlement}`; no two variants share their first two words; no face is a paraphrase of a sibling face.
- Every wording states the three reads as one composite standing condition with no causal joint; none carries a peace, a need, a requirement, a cost, a comparison, a maxim, a figure, a span, a date, a raising, a forecast, a durative that reads forward, a *which*, a digit, an em dash or an exclamation mark.
- Every wording closes on a standing fact and hands a noun forward (the `{defwork}`, the country, the roll) for the thread; none closes on a set-up, a pronoun, or an abstract noun.
- Citations: zero, or at most one on variant 3 naming the roll, never the office.
- Hazards for the chair, not the writer: the card's `{defwork}` NAMED BUT NEVER FILLED line against the desk's `defworkFill`; the card's predicate line "none recovered" against the key function's three-way branch read this session; the may-claim line (present alone) against the brief's order to state every read.
