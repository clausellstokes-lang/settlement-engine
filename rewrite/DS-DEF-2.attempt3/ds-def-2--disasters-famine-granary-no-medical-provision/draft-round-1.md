# DS-DEF-2 · `Disasters & Famine: granary, NO medical provision` · REWRITE draft round 1

Seat: Opus 5 (Fable-unvalidated) · writer · block DS-DEF-2 · role spine · draft phase (Part B §21 phase 1).
The rows below are the COMPLETE replacement for the pool's variant rows: three variants in place under
their own numbers, their own angle tags unchanged, three `[face]` sub-rows each. No variant added, none
removed, none merged. The typed lines of the pool are untouched and not repeated here.

---

1. `[ledger]` A granary is kept at {settlement}, and for the sick nothing is kept.
   - `[face]` The reserve at {settlement} is grain. The sick have no provision.
   - `[face]` Grain is held in store at {settlement}. For the sick the town holds nothing.
   - `[face]` What {settlement} has in store is grain; for the sick it has no house.
2. `[unfolding]` The town goes on with a granary and goes on without any provision for the sick.
   - `[face]` Day to day the store holds grain, and nothing is set aside for sickness.
   - `[face]` Grain is in the store, and against sickness the town has no provision.
   - `[face]` In the ordinary run of things the store has grain, and for sickness the town keeps no house.
3. `[street]` The place has its granary at {settlement} and nothing standing for the sick.
   - `[face]` Grain is stored at {settlement}. Nothing of the kind is kept for sickness.
   - `[face]` The store at {settlement} is for the grain, and the sick have no such place.
   - `[face]` Provision at {settlement} means grain, and for sickness it means nothing.

---

--- NOTES

## 0. The card, and the claim set every face carries

The licence card for this pool (`node scripts/prose-licence-card.mjs DS-DEF-2 'Disasters & Famine: granary,
NO medical provision'`) reads:

- **reads / predicate** — `disasterRowSituation(granary, hospital, church)` (via `DISASTER_ROW_POOL` in
  `defenseStateProse.js`) `=== granary, no medical provision`. Verified at source: the call site passes
  `civicFlag(compound.hasGranary)`, `civicFlag(compound.hasHospital)`, `civicFlag(compound.hasChurch)`
  (`src/domain/display/stateProse/defenseStateProse.js:661-662`), and the branch reached is
  `granary === true`, `hospital === false`, `church === false` (`:580-586`).
- **may claim** — that the reader selects this row, as a STANDING fact of the record.
- **may NOT** — a count, a cause, a season, a future, a standpoint, a second fact, another civic object
  of the class `care`.
- **source** — none; standing SOURCE-UNRESOLVED; **no citation is licensed** (arm A13).
- **bag** — `{band: RESERVED, route: proper, settlement: proper}`; FILLED at this block's call sites:
  `{settlement}`.
- **seat/form** — spine, `sentence`; a spine takes no relation and no attach set.

**The licensed claim set, and it is the whole of it — two limbs of ONE row value, not two facts:**

- **C1 (PRESENT)** — the settlement holds a granary. Licensed by the row's `granary` limb (`may claim`:
  the row is selected). Realised as the standing presence of the store and of grain in it, never as a
  quantity, a stock level, a purpose or a capability.
- **C2 (LACK)** — the settlement holds no medical provision. Licensed by the row's `no medical provision`
  limb (`hospital === false && church === false`). Realised at the CLASS level, or on the single
  house-for-the-sick object the reads holds false; never as a second enumerated care object, which the
  card's `may NOT` closes.

C1 and C2 are the two limbs of the pool key itself, so carrying both is not the refused "second fact":
the refused second fact is any fact outside the row. All twelve faces carry exactly C1 and C2, so arm A6
reads claim-equal ACROSS the faces of each variant and across the three variants.

## 1. What was dropped from each shipped sentence, and under which law

**Variant 1, shipped:** *"{settlement} can feed itself through a failed harvest and has nothing at all
against disease; a sickness here spreads until it stops of its own accord."*

| dropped | law |
|---|---|
| "can feed itself through a failed harvest" — a capability over an unheld future event, and a season | card `may NOT`: a season, a future · MOVE-GRAMMAR §1.3 FORECAST does not exist · R-DA-07 (STATE never FATE) |
| "a sickness here spreads until it stops of its own accord" | card `may NOT`: a second fact, a future · MOVE-GRAMMAR §1.3 FORECAST · Part B R-DA-19 (no CONSEQUENCE without event provenance; none is held here) |
| "nothing **at all**" as an absolute on the care class | R-DA-15 (i): a quantifier is licensed only by `closed` on the quantified column; the LACK is stated flat (R-DA-02) |

KEPT: C1, C2. The rewritten variant and its faces state the granary as a standing presence and the lack
flat, with no completing "but" (R-DA-02's LACK limb).

**Variant 2, shipped:** *"The stores will carry the town through hunger. Nothing here will carry it
through a plague, and the town has not built anything that would."*

| dropped | law |
|---|---|
| "will carry" (twice) — bare future indicative | R-DA-07 / A2: no bare future indicative in this register; THE PROMISE |
| "the town has not built anything that would" — a negative history | R-DA-19 / MOVE-GRAMMAR row 2: HISTORY exists only on an event-provenance field, and none is held; the card refuses a cause |
| "through hunger" / "through a plague" as the events carried through | card `may NOT`: a season, a future |
| "carry the town" as a figure of the stores | R-DA-11 (no figure; a comparison is a measurement in words) |

KEPT: C1, C2. The [unfolding] angle is realised as ASPECT on the standing state ("goes on with", "day to
day", "in the ordinary run of things") — a continuing present, never a trend, a history or a
forecast, since no field holds change.

**Variant 3, shipped:** *"The town can outlast a hungry year at {settlement} and has no answer at all to a
sick one, and knows which of the two it fears."*

| dropped | law |
|---|---|
| "knows which of the two it fears" — a belief frame and a feeling, over the town as a whole | card `may NOT`: a standpoint · REFUSED COLUMNS: a totality over persons · MOVE-GRAMMAR §1.3 FEELING does not exist · R-DA-14 (seen, not meant) |
| "can outlast a hungry year" — capability, season, future | card `may NOT`: a season, a future |
| "no answer at all to a sick one" as an absolute | R-DA-15 (i) quantifier; R-DA-02 flat LACK |
| the third coordinate clause | R-DA-03 (never a third; the qualification takes its own sentence) |

KEPT: C1, C2.

Nothing was ADDED to any variant. Every face's assertion set is `{C1, C2}` and nothing else.

## 2. Per face: which card clause licenses which claim

Every row below reads: claim ← licensing clause. `bag` = the card's FILLED bag `{settlement}`; `no source`
= no citation appears anywhere in the pool, per the card's SOURCE-UNRESOLVED line.

**Variant 1 `[ledger]`** — slot set `{settlement}` on all four faces (parent and faces identical, per
ARCH §2.5's face rule). No face opens on the `proper`-typed slot (T-F8).

| # | face | claims and their licence |
|---|---|---|
| 1 | *A granary is kept at {settlement}, and for the sick nothing is kept.* | C1 ← `may claim` (the row's `granary` limb), as a standing presence · C2 ← the row's `no medical provision` limb, stated at the class level · `{settlement}` ← bag · close: a present condition (R-DA-04's condition kind) · the repeated verb is the office's formula, and the FACT does not recur (register card) |
| 2 | *The reserve at {settlement} is grain. The sick have no provision.* | C1 ← the `granary` limb, named as the reserve (the code's own axis word, `:546` "reserves against medical provision") · C2 ← the `no medical provision` limb, class level, in its own sentence (R-DA-03) and placed last as the one turn outward (§1.4.1) · `{settlement}` ← bag |
| 3 | *Grain is held in store at {settlement}. For the sick the town holds nothing.* | C1 ← the `granary` limb · C2 ← the `no medical provision` limb · `{settlement}` ← bag · the second sentence is the qualification in its own sentence (R-DA-03) and carries the verb forward (THE THREAD, §1.4.1) |
| 4 | *What {settlement} has in store is grain; for the sick it has no house.* | C1 ← the `granary` limb · C2 ← the `no medical provision` limb, on the single house-for-the-sick object the reads holds false (`hospital === false`), never a second care object · `{settlement}` ← bag |

**Variant 2 `[unfolding]`** — slot set EMPTY on all four faces, as the shipped variant carries no slot.

| # | face | claims and their licence |
|---|---|---|
| 1 | *The town goes on with a granary and goes on without any provision for the sick.* | C1 ← the `granary` limb · C2 ← the `no medical provision` limb · "goes on" is aspect on the standing state, licensed by the row being a STANDING fact of the record; it asserts no span, no change and no cause |
| 2 | *Day to day the store holds grain, and nothing is set aside for sickness.* | C1 ← the `granary` limb · C2 ← the `no medical provision` limb · "day to day" frames the present; it names no season and no year (the card refuses a season) |
| 3 | *Grain is in the store, and against sickness the town has no provision.* | C1 ← the `granary` limb, as a plain standing fact with no act behind it · C2 ← the `no medical provision` limb; "against sickness" is the row's own axis (`:546` "reserves against medical provision"), not a cause |
| 4 | *In the ordinary run of things the store has grain, and for sickness the town keeps no house.* | C1 ← the `granary` limb · C2 ← the `no medical provision` limb, on the house object the reads holds false |

**Variant 3 `[street]`** — slot set `{settlement}` on all four faces. No face opens on the slot.

| # | face | claims and their licence |
|---|---|---|
| 1 | *The place has its granary at {settlement} and nothing standing for the sick.* | C1 ← the `granary` limb · C2 ← the `no medical provision` limb, class level · `{settlement}` ← bag · "the place" varies the civic noun across the pool (R-DA-10) and keeps this variant's opener distinct from variant 2's (A11's shared-opener arm) |
| 2 | *Grain is stored at {settlement}. Nothing of the kind is kept for sickness.* | C1 ← the `granary` limb · C2 ← the `no medical provision` limb; "of the kind" carries the store forward, so the second sentence is threaded and not a bare subject change (§1.4.1) · `{settlement}` ← bag |
| 3 | *The store at {settlement} is for the grain, and the sick have no such place.* | C1 ← the `granary` limb · C2 ← the `no medical provision` limb, the absence predicated of the civic object ("no such place"), never of the persons — REFUSED COLUMNS bars a totality over persons · `{settlement}` ← bag |
| 4 | *Provision at {settlement} means grain, and for sickness it means nothing.* | C1 ← the `granary` limb · C2 ← the `no medical provision` limb · `{settlement}` ← bag |

## 3. The walls, checked face by face (all twelve)

- **No digit, no percent, no em dash, no exclamation, no question mark, no `, which`** — zero occurrences.
- **No citation** — no holder, roll, book, register or keeper is named anywhere; the card licenses none
  (SOURCE-UNRESOLVED, arm A13).
- **No future indicative; no subjunctive fate** — zero. Every face is present indicative.
- **No expletive opener** (`There is` / `It is`) — zero (R-DA-07).
- **No pronoun closer** — closing words: stands · provision · nothing · house · sick · sickness ·
  provision · house · sick · sickness · place · nothing (R-DA-04).
- **ABSENCE never opens, never sits beside another absence** — every face opens on the PRESENT limb (C1)
  and lands C2 second; one absence per face (wall 3, R-DA-08).
- **The settlement token opens no variant and no face** — wall 10 / R-DA-17 / T-F8; the pool's shipped
  variant 1 opened on it and no longer does.
- **No standpoint, no observer, no feeling, no knowing** — no "a stranger", no "the town knows", no
  "anyone can see". The angle tags `[ledger]`, `[unfolding]`, `[street]` are kept exactly as the rows
  carry them and are realised as REGISTER (word choice and rhythm), never as an asserted standpoint,
  because the card refuses a standpoint as a claim.
- **One bracketed tag per numbered row; no `[plain]` anywhere** — `[plain]` is the modifier-row marker and
  the projector refuses it on a spine.
- **Face slot sets equal the parent's** — variant 1 `{settlement}`, variant 2 empty, variant 3
  `{settlement}` (ARCH §2.5, the face refusal list).
- **No face is longer than the sentence it replaces** — shipped lengths were 26 / 27 / 27 words; the
  longest new face is 18. Shortening inside the band is editing, not trimming (Part B §22); no variant,
  face or slot was removed.
- **Density (Part B §21.4)** — the compression here is the card's, not plainness for its own sake: every
  word cut carried a refused claim (a season, a future, a cause, a standpoint, an absolute). No lawful
  line was made plainer with no law behind the change.

## 4. Sibling distance (arms A1 and A11) — neither restated nor contradicted

The block's four sibling `Disasters & Famine` pools and what this pool must not borrow or deny:

| sibling pool | its shipped ground | this pool's position |
|---|---|---|
| `granary AND hospital` | food held AND a place for the sick | shares C1, DENIES its care limb — no contradiction, the rows are disjoint by construction (`:580-586`) |
| `granary AND parish care only` | food held AND clergy who tend the sick | shares C1, denies its care limb |
| `NO reserves, hospital present` | no food, a hospital | opposes on both limbs |
| `NO reserves, NO medical provision` | neither | shares C2, opposes C1 |

No face reuses a sibling's wording: the shipped phrases "holds food against a bad year", "somewhere to put
the sick", "food stored", "clergy who tend the sick", "nobody to treat the sick", "sick-house" appear in no
face. "Nobody to treat the sick" was avoided deliberately: it is a totality over persons, which the card's
REFUSED COLUMNS bars, and it stands as a shipped breach in the sibling pool, not as a model.

## 5. REFUSALS

**One refusal, at the POOL grain. No variant is refused; all three are written and all three are lawful
on the walls and the card.**

- **REFUSAL P-1 — the pool cannot carry three DISTINCT level-1 grammars.** MOVE-GRAMMAR §2.1 requires a
  pool of k variants to carry `min(k, 8)` distinct level-1 grammars (k = 3 here). Every drawable member is
  removed by the licensing filter (§3.1) except one:
  - **V3 `PRESENT → LACK`** — DRAWABLE: the state key plus a `none-exists` field. All three variants and
    all twelve faces realise V3.
  - **V1 `PRESENT`** alone — REFUSED: it would drop C2, so it is not claim-equal to its siblings.
  - **V2 `PRESENT → CONSEQUENCE(structural)`** — NOT DRAWABLE: no structural-consequence field; the card
    refuses a cause.
  - **V4 `OBJECT → PRESENT`** — NOT DISTINCT: the granary is the row's own state limb, not a separate
    named-object field, so an OBJECT-first face classifies as V3 with the clauses swapped; writing it as a
    second grammar would be a distinction the classifier cannot see and the data does not hold.
  - **V5 `INSTITUTION → PRESENT`** — NOT DRAWABLE: no INSTITUTION TABLE row is licensed here; the card
    names no `whatItDoes` column, and asserting what the granary does would be an unlicensed claim.
  - **V6 `PRESENT → OPEN`** — NOT DRAWABLE: no typed unresolved/contested state field exists on a leaf
    (SITTING A12; MOVE-GRAMMAR §9 supersession of V6's licensing).
  - **V7** — R2 only, and no event provenance here. **V8 `PRESENT → GAP`** — NOT DRAWABLE: the absence is a
    world LACK (`hospital === false`), not a `not-held` RECORD field; writing it as a record gap would be
    the fault R-DA-08 names (a gap declared where the world holds the fact).

  The refusal is UNCHANGED FROM THE SHIPPED STATE — the three shipped variants are also one grammar — and
  it cannot be cured by a rewrite, because every second grammar requires a field the block does not hold
  and the rewrite may never add a claim to manufacture one. **Measurement:** distinct level-1 grammars in
  the pool = 1, required = 3, deficit = 2; the variation this pool actually carries is the angle register
  and the four wording faces per variant (12 faces where 3 sentences shipped). Recorded here as a refusal
  row with its measurement, never trimmed (Part B §21.2, §22 (b)).

## 6. Measurement of this draft (executed over the twelve rows above, this session)

| measure | this pool | band / direction it is read against |
|---|---|---|
| digits · percents · em dashes · exclamations · question marks · `, which` | 0 each | walls (A4, B-DASH, B0.8, wall 6) |
| citations | 0 | the card licenses none (SOURCE-UNRESOLVED, A13); §24's ceiling is one per unit and the exemplars cite at 0 per 786 sentences |
| bare future indicative · `will` / `shall` / `would` | 0 | R-DA-07, A2, THE PROMISE |
| existential opener (`There is` / `It is`) | 0 | R-DA-07: R1 0.051 → ≤ 0.020 |
| unlicensed quantifier (`every`, `all`, `only`, `none`, `nobody`, `anyone`) | 0 | R-DA-15 (i); the REFUSED COLUMNS' totality over persons |
| pronoun closers | 0 of 12 | R-DA-04: 0.1335 → ≤ 0.055 |
| faces opening on the `proper` slot `{settlement}` | 0 of 12 | T-F8; wall 10 / R-DA-17 |
| distinct openers WITHIN each variant's four faces | 4 of 4, 4 of 4, 4 of 4 | A11 |
| distinct openers across the three variant rows | 3 of 3 (`A granary` · `The town` · `The place`) | A11's shared-opener arm; R-DA-05's repeated-opener pools 0.112 → ≤ 0.030 |
| words per sentence: n · mean · sd | 16 · 10.31 · **4.13** | R-DA-05 within-pool sd 2.9 → ≥ 4.0 — MET |
| sentences under eight words | 0.438 | R-DA-06 `< 8` 0.017 → ≥ 0.030 — MET (the short line exists) |
| longest face against the shipped sentence it replaces | 18 vs 26 / 27 / 27 | check-pair `LONGER`; §22 (shortening inside the band is editing) |
| absence as the opening move | 0 of 12 | wall 3 / R-DA-08 |
| claim set per face | `{C1, C2}` for all 12 | arm A6 across the faces; arm C-pair against the shipped claim set minus the dropped unlicensed claims |

The measurement is a mechanical scan of the twelve rows executed here; it is **not** a walker run. The
B-GRAMMAR walker, `check-pair.mjs` and the entry walker are the gate's instruments and have not been run
against this packet — that is the lane's step, not the writer's, and no claim of a passing gate is made.

## 7. Counts

- Variants written: **3** (vids 1, 2, 3 — same numbers, same order, same angle tags).
- Faces written: **12** (each variant's numbered line plus three `[face]` sub-rows).
- Refusals: **1**, at the pool grain (P-1 above). Zero variant-level refusals.
