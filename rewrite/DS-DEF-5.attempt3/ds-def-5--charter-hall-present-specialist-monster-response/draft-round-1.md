Block DS-DEF-5 · pool `charter hall PRESENT (specialist monster response)` · draft round 1
Seat: Opus 5 — Fable-unvalidated. Writer packet only; no dock, corpus or leaf byte written.
Paste target: under the pool's bold heading in `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`, replacing the three numbered rows and nothing else. The typed lines of the pool are untouched and are not repeated here.

1. `[ledger]` Against monsters, {settlement} holds a chartered hall.
   - `[face]` A charter for monster work is in force at {settlement}.
   - `[face]` A hall stands chartered at {settlement} for monster work.
   - `[face]` The town keeps monster work under charter at {settlement}.
2. `[street]` Monster work at {settlement} is the charter hall's business.
   - `[face]` A hall on charter at {settlement} carries the monster work.
   - `[face]` At {settlement} the monster work is written into a hall's charter.
   - `[face]` Monster work is charter work at {settlement}.
3. `[visitor]` A stranger at {settlement} finds the monster work in a chartered hall's keeping.
   - `[face]` Arriving at {settlement}, a stranger meets a hall chartered against monsters.
   - `[face]` For a stranger at {settlement}, the monster work belongs to a chartered hall.
   - `[face]` A stranger who comes to {settlement} with monster business carries it to a hall that holds a charter for exactly that.

--- NOTES

**The card this pool is written against** (printed by `node scripts/prose-licence-card.mjs DS-DEF-5 'charter hall PRESENT (specialist monster response)'`), in the clauses cited below:
- **C-reads** — `forces.charter.present` (measured); absent means no candidate.
- **C-pred** — `forces.charter.present` truthy, no literal.
- **C-claim** — may claim that `present` holds, **as a STANDING fact of the record**.
- **C-bag** — bag `{band, counterpart, faction, settlement}`, FILLED at this block's call sites: `{settlement}`.
- **C-angle** — angle set `ledger street visitor` (the three rows' own tags, kept in place).
- **C-form** — form `sentence`; the pool is a spine and takes no relation, no attach, no declared move.
- **C-not** — may NOT: a count, a cause, a season, a future, a standpoint, a second fact, another civic object of the class `hall`.
- **C-src** — source `muster · standing LICENSED`; a citation only where the provenance budget allows (Part B §24: one per unit, and only for one of S3's three reasons).
- **C-refused** — always refused: a totality over persons; an exemption from a duty; a named character and that character's fate; a theological claim.

**The claim every face carries, and nothing else.** One claim: `(PRESENT, forces.charter.present, true)` — a charter for specialist monster response stands at this settlement, as a standing fact of the record (C-claim, C-pred). Every face below asserts that and stops. The kind-word ("monster work", "monster business", "chartered", "charter hall") is the pool key's and the block's STATE-KEY group `Monster Response` (charter); it is the fact's own identity, not an added fact, and it is the discriminating claim that separates this pool from its siblings `garrison PRESENT`, `militia PRESENT (no garrison)`, `watch PRESENT` and `mercenary / contracted forces PRESENT` (U9). Slot use is `{settlement}` once per face, the FILLED bag exactly (C-bag); the face slot set equals the parent's on every row (ARCH §2.5 face-row refusal). No row opens on a `proper`-typed slot (ARCH §2.5 seam contract, T-F8), and the settlement token opens no variant of the pool (wall 10, R-DA-17).

**Per variant: the claims kept, and the claims dropped as unlicensed.**

*Variant 1 `[ledger]`, was: "{settlement} keeps a charter for specialist work. The things a garrison is wrong for go to people retained to handle exactly them."*
- KEPT: the charter's presence as a standing fact — C-claim, C-pred, C-reads.
- DROPPED: the second sentence entire. It is a SECOND FACT (C-not) — it asserts (a) what the charter's work is routed away from, which reads a garrison field this pool does not read (C-reads) and which the sibling pool `NO organized force at all` can deny in the same block (A11, arm C-sibling); and (b) "a garrison is wrong for" is a STANDPOINT on another institution (C-not). Dropping it is the rewrite's purpose; the shipped breach is the corpus's known state.
- Face licences: **parent** "Against monsters, {settlement} holds a chartered hall" — presence C-claim; the fronted prepositional phrase is word order, spendable (MOVE-GRAMMAR §3.4). **face 1** "is in force" — the same standing predicate in the record's idiom, C-claim; no tense but the present (R-DA-07). **face 2** "stands chartered" — same, C-claim. **face 3** "The town keeps … under charter" — the civic body as subject, C-claim; "the town" is the settlement, not a totality over persons (C-refused).

*Variant 2 `[street]`, was: "There is somewhere at {settlement} to take the problems that are not soldiers' problems, and the town uses it more than it likes to say."*
- KEPT: the charter's presence — C-claim.
- DROPPED: (a) "the town uses it more than it likes to say" — a usage rate (a count in words) plus a BELIEF FRAME about how the town speaks of itself, licensed by no field (C-not, C-refused); (b) "problems that are not soldiers' problems" — the garrison comparison, a second fact on a field not read (C-reads, C-not); (c) the existential opener "There is", struck under R-DA-07 (the expletive goes), which is a form cure, not a claim change.
- Face licences: **parent** "is the charter hall's business" — presence stated as the institution's standing brief, C-claim; the close lands on a civic noun (R-DA-04). **face 1** "A hall on charter … carries the monster work" — same claim, the hall as subject, C-claim. **face 2** "is written into a hall's charter" — the charter as the document the record holds, C-claim, C-reads; no second record and no citation is asserted (C-src). **face 3** "Monster work is charter work at {settlement}" — the short line (R-DA-05's `< 8 words` floor), the same single claim.

*Variant 3 `[visitor]`, was: "A stranger at {settlement} finds a hall whose business is the sort of trouble a garrison is the wrong instrument for, and finds it busy."*
- KEPT: the charter hall's presence, in the visitor angle — C-claim, C-angle.
- DROPPED: (a) "and finds it busy" — an ACTIVITY fact about the hall's traffic, a second fact with no field (C-not); (b) "a garrison is the wrong instrument for" — the standpoint on another institution and its unread field, as in variant 1 (C-not, C-reads); (c) the `whose`-clause is rewritten out under wall 6 / R-DA-03 (no relative tail carrying the qualification), a form cure.
- Face licences: **parent** "finds the monster work in a chartered hall's keeping" — presence met by the stranger, C-claim under C-angle. **face 1** "Arriving at {settlement}, a stranger meets a hall chartered against monsters" — same claim, participial opener (participial rate stays far under its 0.020 band). **face 2** "the monster work belongs to a chartered hall" — same claim, the fronted beneficiary. **face 3** the long cadence: "a hall that holds a charter for exactly that" — a `that`-clause, not a `which`-clause (wall 6 bars the `which` tail only); the claim is the charter's presence and its kind, nothing further.

**The thread (MOVE-GRAMMAR §1.4.1).** This pool is a SPINE, so it opens its composed unit and hands nouns forward rather than picking them up. Every face closes on a civic noun a following modifier can carry: the hall (parent 1, faces 1.2, 2.1 by subject, 3.1, 3.2, 3.3), the charter (2.2), the work (2.1), or the settlement itself (1.1, 1.3, 2.3). No face changes subject mid-passage and hands nothing back; none of them is a turn outward, so none needs the last position. Each also reads immediately after a sibling spine of the same block (walls, standing forces, contracted forces, arcane defence) because its subject is the town, the work or the hall — all nouns the block's other spines already hold.

**Hard walls checked on all twelve faces.** No em dash; no exclamation; no digit or percent; no `which`-clause; no question; no second person; no future indicative and no forecast (state never fate); no figure, no sense verb on an abstraction, no inanimate intent; no evaluative adjective on a place or a person; no named character; no theological claim; no totality over persons; no exemption; no citation of a holder (C-src is licensed but unspent — the exemplar registers with raw text cite at 0 per 786 sentences, and none of S3's three reasons is present on this fact, so a citation here would be a habit, Part B §24).

**Word counts (a slot counts as one word).**
- Variant 1: parent 7 · face 1 10 · face 2 9 · face 3 9.
- Variant 2: parent 9 · face 1 10 · face 2 11 · face 3 7.
- Variant 3: parent 13 · face 1 11 · face 2 13 · face 3 21.

**Declared band exceedances (soft rules; reported with their distance, not cured by an unlicensed claim — Part B §16, §16.2).**
1. **Level-1 grammar uniformity.** All three variants are V1 (PRESENT alone). MOVE-GRAMMAR §2.1 asks a pool of k for min(k, 8) distinct level-1 grammars and at least two in any pool of two or more. It is unreachable here without breaking a wall: the card reads ONE field, declares no move, seats no relation and licenses no second fact, so V2 (a structural consequence), V3 (a LACK), V4 (a named object), V5 (an institution row), V6 (a standing-open state), V7 (event provenance) and V8 (a typed gap) each need a field this pool does not hold, and a grammar member whose licensing field is null is not drawn and is never written empty (§3.1). Distance: 1 grammar against a floor of 2. The variety this pool can lawfully carry is the angle set and the wording faces, and that is what it carries.
2. **Within-pool sentence-length spread.** R-DA-05 directs within-pool sd toward ≥ 4.0; the twelve faces measure sd ≈ 3.4 (mean ≈ 10.8, range 7 to 21). A single-claim pool cannot lengthen a sentence without buying a second fact, so the spread was widened as far as one claim allows (the 7-word short line at 2.3 and the 21-word cadence at 3.3) and the residue is reported, not cured.

**Refusals: none.** All three existing variants were made lawful in place under their own numbers and their own angle tags; no variant was added, removed, merged or reordered; no `[plain]` marker appears on any spine row; the banked-refusal count for this pool is zero.
