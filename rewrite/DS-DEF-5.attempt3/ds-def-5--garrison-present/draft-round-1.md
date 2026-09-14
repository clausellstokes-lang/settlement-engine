1. `[ledger]` {settlement} keeps a garrison of its own, in arms and in place.
   - `[face]` The town's garrison at {settlement} is held in standing service.
   - `[face]` A standing force is kept at {settlement}, kept by the town.
   - `[face]` The soldiery at {settlement} is permanent, and the town's.
2. `[street]` Soldiers at {settlement} are kept standing.
   - `[face]` The soldiers at {settlement} are a fixture, and the town's own.
   - `[face]` The town keeps its own soldiers at {settlement}.
   - `[face]` A body of soldiers stands at {settlement}, kept there by the town.
3. `[visitor]` A stranger who comes to {settlement} comes to a town that keeps soldiers.
   - `[face]` A stranger at {settlement} finds soldiers, and finds them the town's own.
   - `[face]` What a stranger meets at {settlement} is soldiery the town keeps.
   - `[face]` To a stranger at {settlement}, the soldiers are the town's, and permanent.

--- NOTES

**The card this pool is written against** (`node scripts/prose-licence-card.mjs DS-DEF-5 'garrison PRESENT'`): role spine · reads `forces.garrison.present` (measured) · predicate truthy, no literal · bag `{band, counterpart, faction, settlement}`, FILLED at this block's call sites `{settlement}` · no relation, no attach (a spine takes neither) · form sentence · move none declared · angle `ledger street visitor` · source `muster · standing LICENSED` · **may claim:** that `present` holds, as a STANDING fact of the record · **may NOT:** a count, a cause, a season, a future, a standpoint, a second fact, another civic object of the class `force` · audience player (no mark) · refused always: a totality over persons, an exemption from a duty, a named character and that character's fate, a theological claim.

**The claim set every one of the twelve faces carries, and nothing besides.**
- C1 — a garrison (a standing force, soldiers) is present at {settlement}. Licensed by `reads: forces.garrison.present (measured)` + `predicate: present truthy` + `may claim: that present holds`.
- C2 — the force is this settlement's own, the town being its holder. Licensed by the read itself: the card's field is this block's settlement-scoped institution record, and `bag ... FILLED: {settlement}` is the only holder any face may name. C2 asserts whose the garrison is; it denies no sibling pool's fact (a town may hold both a garrison and contracted forces — arm A11).
- C3 — the fact is a standing one, not an occasion (`standing`, `permanent`, `kept`, `a fixture`, `in place`). Licensed by `may claim: ... as a STANDING fact of the record`; the word `standing` is the block's own STATE-KEY group name (`Standing Forces`).
- C4 (variant 3 only, and a framing rather than a claim) — the presence is what a stranger meets. Licensed by the card's `angle:` line, which names `visitor` as one of this pool's three angles; the face asserts C1–C3 and no interior, no procedure and no reaction of the stranger.
- Slots: `{settlement}` alone in every numbered line and every face, so each variant's face set carries the parent's exact `{slot}` set (ARCH §2.5, T-F8).

**Per face.**
1 `[ledger]` line — C1 (`a garrison`), C2 (`of its own`), C3 (`in arms and in place`). Close: a condition of the civic thing.
1a — C1 (`garrison`), C2 (`The town's`), C3 (`standing service`). Close: an object.
1b — C1 (`A standing force`), C3 (`is kept`), C2 (`kept by the town`). Asyndetic doubling, one clause, no second fact.
1c — C1 (`The soldiery`), C3 (`is permanent`), C2 (`and the town's`).
2 `[street]` line — C1 (`Soldiers`), C3 (`kept standing`). The short line; C2 not carried, which is lawful because a face may state fewer WORDS, never fewer than the pool's licensed claims are worth — see the claim-equality note below.
2a — C1, C3 (`a fixture`), C2 (`the town's own`). `fixture` is the one idiom in the pool: a dead-metaphor noun for a permanent presence, kept under §21.4 (compression and idiom that reward the reader are part of the ceiling), not a figure under R-DA-11 — it makes no comparison and gives nothing inanimate an intent.
2b — C2 (`The town keeps its own`), C1 (`soldiers`), C3 (`keeps`). Close: the town's name.
2c — C1 (`A body of soldiers`), C3 (`stands`, `kept there`), C2 (`by the town`).
3 `[visitor]` line — C4 frame (`A stranger who comes`), C1 (`soldiers`), C2/C3 (`a town that keeps soldiers`). The repeated `comes to` is a figure of syntax, not of sense.
3a — C4 (`A stranger ... finds`), C1 (`soldiers`), C2 (`the town's own`).
3b — C4 (`What a stranger meets`), C1 (`soldiery`), C2/C3 (`the town keeps`).
3c — C4 (`To a stranger`), C1 (`the soldiers`), C2 (`the town's`), C3 (`permanent`).

**Claim equality across the faces (arm A6 reads across the faces, not back to the old sentence).** Every face asserts C1 and C3. C2 is carried by ten of twelve; face 2 and face 3b's `the town keeps` are the two ends of the same possessive, and no face asserts a claim another face's set lacks. Face 2 (`Soldiers at {settlement} are kept standing.`) carries C1 and C3 and leaves C2 unsaid — an omission, never a denial (R-DA-21: omission is information; nothing in the face contradicts C2).

**What the old sentences claimed and this rewrite DROPS, with the law that drops it.**
- Variant 1, `people whose work is the defense of this town` — a duty/function predicate. It needs an INSTITUTION move on a `whatItDoes` column of the institution table (R-DA-15; MOVE-GRAMMAR §1.2 row 5); the card reads one boolean and licenses no table row, and the card's `may NOT` bars a second fact. DROPPED.
- Variant 1, `who are answerable for it as work` — an accountability claim on persons, again a table column this card does not read; also a second fact riding one sentence outside S2's consequence carve-out (the register card's amendment S2). DROPPED. With them goes the colon, whose second limb was a MEANING move (§1.3: no field holds what a fact means).
- Variant 2, `rather than to a season` — the card's `may NOT: a season`, and a CONTRAST whose rejected alternative is not named by a sibling pool key on this card (wall 5, MOVE-GRAMMAR §1.4). DROPPED.
- Variant 2, `with all the friction and all the reliability of one` — a VERDICT/evaluative pair (§1.3's non-moves; R-DA-12's generalisation test) and a totality word on the record's own assessment. DROPPED with its semicolon.
- Variant 3, `at the gate` — asserts a perimeter. Walls ride `defenseProfileHasWalls` in the sibling pools `walls PRESENT` / `walls ABSENT`; asserting a gate here is another civic object the card does not license and a contradiction of the sibling pool in a town without walls (card `may NOT`; arm A1/A11; CLERK-LAWS C-sibling). DROPPED.
- Variant 3, `is counted at the gate ... and is counted again on the way out` — a procedure and a count. The card's `may NOT: a count`, and the procedure is a duty the institution table does not hold. DROPPED.
- Variant 3, `by somebody whose job that is` — the same duty claim as variant 1's. DROPPED.
- ADDED: nothing. No face carries a claim outside C1–C4.

**Refusals (a refusal is a result).**
- R1, pool-level, NOT CURABLE IN THE DRAFT — **the distinct level-1 grammar floor.** MOVE-GRAMMAR §2.1 requires a pool of k variants to carry min(k, 8) DISTINCT level-1 grammars, at least two in any pool of two or more. After the licensing filter this pool has exactly one drawable member: V1 (PRESENT). V2 needs a structural-consequence field, V3 a `none-exists` field, V4 a named object, V5 an institution row, V6 an unresolved state value, V7 event provenance, V8 a `not-held` field with provenance; the card reads `forces.garrison.present` and nothing else, and §2.1's own rule is that a member whose licensing field is null is filtered out rather than written empty. All three variants and all twelve faces are V1. The variation this pool can lawfully carry is angle, opener, close-kind and rhythm, not grammar. No variant is unlawful; the floor is.
- R2, pool-level, DELIBERATE — **the provenance move is refused on every face.** The card marks `source: muster · standing LICENSED`, so a citation would be permitted where the budget allows; it is not taken. MOVE-GRAMMAR §4.4.3: a citation on a fact whose holder is the office itself is a finding, and the muster roll is the standing force's own book. None of S3's three reasons is met either (no two accounts disagree; no count is claimed; the keeper is not a power over this fact). Part B §24 puts the ceiling at one citation per unit and records the exemplar registers citing at 0 per 786 sentences, so twelve faces of one pool are the wrong place to spend it.
- R3, pool-level, REPORTED BAND POSITION, not a failure — **within-pool length spread.** R-DA-05's within-pool sd floor is ≥ 4.0 words. Measured here: the three numbered lines are 12, 6 and 13 words (sd 3.09); the twelve faces are 12, 10, 11, 9, 6, 11, 8, 12, 13, 12, 11, 12 (mean 10.58, sd 1.94). A single boolean claim gives no lawful material for a long-period sentence — the only ways to lengthen are a second fact, a cause, a count, a season or a contrast, all four barred by the card — so the distance is reported under §16 (a soft rule reports its distance) rather than bought with an unlicensed clause.

**Walls checked on every face.** No em dash, no exclamation, no question, no digit or percent, no `which`-clause, no first or second person, no future indicative, no named character, no deity, no totality over persons, no exemption, no hedge, no belief frame, no simile or inanimate intent. Every face is one sentence (A1). Openers: the settlement token opens ONE variant of the three and two faces of twelve (0.083 of faces), under R-DA-17's ≤ 0.167 register ceiling and clear of it rather than sitting on it (wall 10; Kay 44). Joints: `, and` on five of twelve faces, the rest asyndetic or single-clause. Close kinds vary across the pool: a condition (`in place`, `permanent`), an object (`standing service`, `soldiers`), the town, the settlement name.

**The thread (§1.4.1).** This pool is the SPINE, so each face opens the composed passage and must hand a noun forward to whatever modifier the composer seats next. Every face closes on or carries one of three catchable nouns — the garrison / the soldiers / the town — and none of them turns outward, so a following modifier can pick up the subject and no face is forced into the passage's one turn. No face reads as an answer to a sentence before it, because none stands before it.
