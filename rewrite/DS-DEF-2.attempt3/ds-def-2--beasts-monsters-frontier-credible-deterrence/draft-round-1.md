Seat: Opus 5 — Fable-unvalidated. Block `DS-DEF-2` · pool `Beasts & Monsters: frontier, credible deterrence` · REWRITE draft round 1.
Three variants in, three variants out: same vids, same order, same angle tags, none added, none removed, none merged.
Paste the block below under the pool's bold heading, in place of the pool's three numbered rows.

**`Beasts & Monsters`: `frontier`, credible deterrence**
1. `[ledger]` In frontier country, {settlement} keeps a wall and a force behind the wall.
   - `[face]` Around {settlement} the country is frontier country, and against it the town holds a perimeter and a force.
   - `[face]` A wall closes {settlement} against frontier country, and a force stands behind the wall.
   - `[face]` Frontier country lies outside {settlement}; inside the wall stands a force.
2. `[street]` The town has a wall and a force, and the country it stands in is frontier country.
   - `[face]` The wall is up, the force is kept, and the country past the wall is frontier country.
   - `[face]` What the town has in frontier country is a wall and a force.
   - `[face]` Here the town is walled and keeps a force, in frontier country.
3. `[counterforce]` Against frontier country {settlement} keeps a force, and a wall in front of the force, and not the one without the other.
   - `[face]` Neither the wall nor the force is missing at {settlement}, in frontier country.
   - `[face]` The force at {settlement} is not on its own in frontier country, and a wall stands around the town.
   - `[face]` At {settlement} the wall is not the whole of what the town keeps against frontier country, and neither is the force.

--- NOTES

**The card, as this packet reads it.** Printed from `node scripts/prose-licence-card.mjs DS-DEF-2 'Beasts & Monsters: frontier, credible deterrence'`.
- **MAY-CLAIM** (verbatim): that the reader `beastsRowSituation(family, perimeter, force)` selects the row `frontier country, perimeter and force` of `BEASTS_ROW_POOL` in `defenseStateProse.js`, as a STANDING fact of the record. The row has three limbs and the packet keys every claim to them:
  - **C1** the country is frontier country (`family === 'frontier'`, the row's first limb).
  - **C2** the town has a perimeter (`perimeter === true`; `walls` at the call site, by `defenseProfileHasWalls`).
  - **C3** the town has a force (`force === true`; `garrison || militia` at the call site — so the force is named generically in every face, never as a garrison and never as a militia, because the reading does not distinguish them).
- **MAY-NOT** (verbatim): a count, a cause, a season, a future, a standpoint, a second fact. **REFUSED COLUMNS:** a totality over persons; an exemption from a duty; a named character and that character's fate; a theological claim.
- **BAG:** `{band: RESERVED, route: proper, settlement: proper}`, FILLED at this block's call sites `{settlement}`. Every face's slot set is exactly its parent's: variant 1 `{settlement}`, variant 2 `{}` (as the shipped row), variant 3 `{settlement}`. `{band}` is RESERVED and `{route}` is unfilled at these call sites, so neither is written.
- **FORM:** sentence. **SOURCE:** `muster · standing LICENSED`, spent at zero — see the provenance row below.

**Per face, the licensing clause of every claim it makes.** No face makes a claim outside C1–C3 (and C4 on variant 3).

*Variant 1 `[ledger]` — grammar V1 (PRESENT), the state key alone.*
- **1** "In frontier country, {settlement} keeps a wall and a force behind the wall." — `In frontier country` = C1 · `a wall` = C2 · `a force` = C3 · `{settlement}` = the bag's filled proper slot. Close kind: object (the wall), a deliberate noun echo, lawful under MOVE-GRAMMAR §1.4.1.
- **1-a** "Around {settlement} the country is frontier country, and against it the town holds a perimeter and a force." — `the country is frontier country` = C1 · `a perimeter` = C2 · `a force` = C3. `against it` is the block's own frame (STATE-KEY: what the town has standing against each pressure), not a cause.
- **1-b** "A wall closes {settlement} against frontier country, and a force stands behind the wall." — `A wall closes` = C2 · `frontier country` = C1 · `a force stands` = C3.
- **1-c** "Frontier country lies outside {settlement}; inside the wall stands a force." — `Frontier country` = C1 · `the wall` (definite reference, existence asserted) = C2 · `a force` = C3. One semicolon in the pool (R-DA-06's joint, 0.083 per variant against a band edge of 0.130).

*Variant 2 `[street]` — grammar V1 (PRESENT); no slot, as the shipped row.*
- **2** "The town has a wall and a force, and the country it stands in is frontier country." — `a wall` = C2 · `a force` = C3 · `frontier country` = C1. The relative clause is a bare `that`-less restrictive, never a `which`.
- **2-a** "The wall is up, the force is kept, and the country past the wall is frontier country." — C2 · C3 · C1. `is kept` is maintenance in the clerk's idiom, agentless; it asserts no cost and no payer.
- **2-b** "What the town has in frontier country is a wall and a force." — C1 · C2 · C3, as a pseudo-cleft; the rhythm is the face's difference, not a synonym swap.
- **2-c** "Here the town is walled and keeps a force, in frontier country." — `walled` = C2 · `a force` = C3 · `frontier country` = C1.

*Variant 3 `[counterforce]` — grammar V1 (PRESENT) plus one CONTRAST.*
- **C4** (variant 3 only) the rejected alternative is the SIBLING POOL KEY `frontier country, force without a perimeter` of the same `BEASTS_ROW_POOL`. Licensed by R-DA-02 (a contrast is kept only where the rejected alternative names a sibling pool key or sibling band) and by MOVE-GRAMMAR wall 5 (never fronted as the subject; the closing move of one variant only in this pool). C4 adds no claim: the row is exclusive, so "and not the force without the wall" asserts only what the reading already asserts.
- **3** "Against frontier country {settlement} keeps a force, and a wall in front of the force, and not the one without the other." — C1 · C3 · C2 · C4. Close kind: a name not given.
- **3-a** "Neither the wall nor the force is missing at {settlement}, in frontier country." — C2 · C3 · C1 · C4 (the restraint stated as the two limbs' non-absence). `Neither ... nor` quantifies the row's two named limbs, never persons, so the closed-world clause (CLERK-LAWS §1.3 / H-4) is not engaged.
- **3-b** "The force at {settlement} is not on its own in frontier country, and a wall stands around the town." — C3 · C1 · C4 · C2.
- **3-c** "At {settlement} the wall is not the whole of what the town keeps against frontier country, and neither is the force." — C2 · C1 · C4 · C3.

**What the shipped sentences claimed and this draft DROPS (the rewrite's purpose; the shipped breach is the corpus's known state).**
- Variant 1's second sentence, whole: "Most of what comes out of the country will not press a defended perimeter, and most of what comes here does not." — DROPPED. It carried (i) a quantity over an unenumerated population (`Most`), MAY-NOT "a count"; (ii) a bare future indicative (`will not press`), a FATE breach under A2 / R-DA-07 and MAY-NOT "a future"; (iii) an effect of the perimeter on what approaches, MAY-NOT "a cause"; (iv) a second fact no field holds, MAY-NOT "a second fact". Nothing in it resolved to `beastsRowSituation`.
- Variant 2, three claims DROPPED: `takes the frontier seriously` (a standpoint, MAY-NOT; and a belief frame under R-DA-13); `has taken it seriously long enough` (a duration with no event-provenance field, R-DA-19 / MOVE-GRAMMAR §1.2 row 2); `ordinary rather than anxious` (a standpoint and a feeling, the FEELING non-move, plus an antithesis shape R-DA-02 refuses without a sibling-naming alternative).
- Variant 3, three claims DROPPED: `Very little reaches {settlement}` (a quantity and an outcome, MAY-NOT "a count"); `and the reason is that` (an explicit cause, MAY-NOT "a cause" — and the same six-word cause frame is a template tic across this block, appearing on `Economic Survival: STRONG` and `Disasters & Famine: granary AND hospital`); `the arrangements are visible from a long way off` (a particular no field holds — hollow specificity, fault 24 / R-DA-10).
- KEPT from all three: only C1, C2, C3 — every claim the card licenses that the shipped sentence made. Nothing is added. Variant 2's shipped `the arrangements` is the row's own perimeter-and-force limbs named plainly; the packet records this as the one reading judgment in the set, vetoable at the sitting.

**REFUSALS (a refusal is a result).**
1. **No variant is refused.** All three are written lawful under the card, the walls and the bands.
2. **POOL-LEVEL REFUSAL — the distinct-grammar rule cannot be met.** MOVE-GRAMMAR §2.1 asks a pool of k variants to carry min(k, 8) DISTINCT level-1 grammars. The card licenses ONE reading and no second typed field: there is no `none-exists` field (no V3), no named-object field (no V4), no institution row (no V5), no unresolved state (no V6), no event provenance (no V7) and no `not-held` field (no V8). Under §3.2's licensing filter the drawable set is `{V1}`, so all three variants are V1 (PRESENT) and the pool shows one grammar. This is a licensing fact, not a wording fault, and is not curable at the writer's desk; the variation is carried by angle, limb order, close kind and rhythm instead. Recorded for the sitting.
3. **PARTIAL REFUSAL — the `[counterforce]` angle cannot be met in its event form.** The palette defines `[counterforce]` as "the thing that did NOT happen". A not-happening is an event claim, and no event-provenance field is licensed here (MAY-NOT "a cause", "a second fact"). The angle is therefore realised as a STANDING restraint: the sibling-key contrast C4. If the sitting holds that `[counterforce]` requires an event negation, variant 3 is unsatisfiable under this card and becomes a sitting row; the packet's reading is that the standing contrast is the angle's lawful form on a state pool.
4. **REPORTED, not cured — within-pool sentence-length spread.** Twelve faces run 11 to 22 words, mean 15.8, sd ≈ 3.5, against R-DA-05's within-pool direction of sd ≥ 4.0. Padding a lawful face to move the figure would be the regression §21.4 names (plainer or longer with no law behind the change), so the figure is reported and left. Every other measured band the draft targets: zero digits, zero em dashes, zero `which`, zero questions, zero exclamations, zero expletive openers, zero future indicatives, zero pronoun closers, one semicolon in twelve faces, one antithesis shape (variant 3's contrast, sibling-key licensed).
5. **DELIBERATE ZERO — the provenance move.** The card marks `source: muster · standing LICENSED`. No face cites it. Two grounds: §24's ceiling (one citation per unit, only for two disagreeing accounts, a count from an interested party, or a record whose keeper is a power — none of the three obtains here, and the exemplar registers cite at zero per 786 sentences, so a citation here would be the habit a refuter names); and MOVE-GRAMMAR §4.4.3 (a citation on a fact whose holder is the office itself is a finding — the muster is the town's own organ and the compiling office would be citing its own books). S3's split is honoured: the player's page states the fact as compiled; the keeper and its interest belong to the referee's page.
6. **FORM NOTES for the projector.** Every row carries exactly ONE bracketed angle tag; no `[plain]` marker appears anywhere (it belongs to modifier rows and the projector refuses it on a spine). No row — parent or face — opens on a `proper`-typed slot of the bag (T-F8): `{settlement}` never stands first. Each variant's faces share the parent's slot set exactly. Three face sub-rows per variant, no more and no fewer.
7. **THREAD (owner, 2026-09-08 ~21:4x).** This pool is the SPINE; it is read first and hands the thread forward. Every face ends on a civic noun a modifier can pick up — the wall, the force, the town, frontier country — and no face ends on a pronoun or an abstraction. Face 1-c is the pool's one two-clause face and its second clause carries `the wall` forward from the first; it therefore reads as one passage, not two starts.
8. **SIBLINGS (arms A1 and A11).** Checked against the block's other twenty-two pools: no face restates a sibling's opening (the shipped `The country around {settlement} is thick with creatures` of the `plagued, perimeter AND organized force` row is why face 1-a opens `Around {settlement}` and not `The country around`), no face reuses the block's `and the reason is` cause frame, and no face contradicts a sibling in structural fact. The `frontier, force without a perimeter` sibling is named only as the rejected alternative of variant 3, which is what R-DA-02 licenses.
