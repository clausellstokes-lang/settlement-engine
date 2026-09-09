Block DS-DEF-5 · pool `charter hall PRESENT (specialist monster response)` · draft round 2
Seat: Opus 5 — Fable-unvalidated. Writer packet only; no dock, corpus or leaf byte written.
Paste target: under the pool's bold heading in `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`, replacing the three numbered rows and their face sub-rows and nothing else. The typed lines of the pool are untouched and are not repeated here.

1. `[ledger]` Against monsters, {settlement} holds a chartered hall.
   - `[face]` A charter for monster work is in force at {settlement}.
   - `[face]` A hall stands chartered at {settlement} for monster work.
   - `[face]` The town keeps monster work under charter at {settlement}.
2. `[street]` Monster work at {settlement} is the charter hall's business.
   - `[face]` A hall on charter at {settlement} carries the monster work.
   - `[face]` At {settlement} the monster work is written into a hall's charter.
   - `[face]` Monster work is charter work at {settlement}.
3. `[visitor]` A stranger at {settlement} finds the monster work in a chartered hall's keeping.
   - `[face]` A hall chartered against monsters is what a traveller meets at {settlement}.
   - `[face]` For a stranger at {settlement}, the monster work belongs to a chartered hall.
   - `[face]` A stranger who comes to {settlement} with monster business carries it to a hall that holds a charter for exactly that.

--- NOTES

**ROUND 2 — THE GATE'S MEASURE, ANSWERED.** The gate returned exactly one failing owned measure on round 1: `shapes.participialOpenerRate (over) = 28.24 band-widths on 1 of 12 face(s)`, against a DEPTH of at most 1.75 band-widths per face. The single offending row was variant 3's first face, which opened on a present participle (`Arriving at {settlement}, …`) and so measured a participial-opener rate of 1.0 on its own one-sentence grain, against a band edge of 0.020 (`fingerprint.mjs`, first word matching `/ing$/` outside the stoplist; `probe-all/metrics.mjs` computes the same first-word test). The cure is a rewrite of that face in place under the same variant number and the same `[visitor]` tag:

- WAS: `Arriving at {settlement}, a stranger meets a hall chartered against monsters.` (11 words, participial opener, rate 1.0)
- NOW: `A hall chartered against monsters is what a traveller meets at {settlement}.` (12 words, determiner opener, rate 0.0)

The measure moves from 1 of 12 faces to **0 of 12 faces**; the pool's participial-opener rate is 0.000, inside the band (`≤ 0.020`, Part B §1 R-DA-18's HOLD floor of 0.0117 and §16's band reading of every Figure). The round is therefore NOT dry: the one failing owned measure moved, and moved to zero. **Nothing else in the pool was touched** — the other eleven faces are byte-identical to round 1, because every measure they carry passed and Part B §21.3's rule that a licensed wording beats a sharper one applies at the draft phase too; churning passing rows risks a new failure for no gate gain. The claim set is untouched by the cure (see the licence trace below): the replaced face asserts the same single claim as its predecessor and as its three siblings, so arm A6's read across the faces is unchanged.

**Shape re-check on the new face, against the other measured shapes.** No `, which` tail; no em dash; no exclamation; no question; no colon or semicolon; no digit or percent; no `There is` / `It is` expletive opener (R-DA-07); no triad; no antithesis shape (`not X but Y`, `rather than`); no doubled adjective; no second-sentence summariser (the face is one sentence); no evaluative closer. The face closes on the settlement slot inside a prepositional phrase and the sentence's civic subject is the hall (R-DA-04's civic-noun landing). The cleft (`X is what Y meets at Z`) is a word-order spend, licensed by MOVE-GRAMMAR §3.4, and is not the rate-bearing shape of any measured tell.

**Sibling distance for the new face (arms A1 and A11).** The block's other `[visitor]` rows use `A stranger who comes to {settlement} …` (garrison), `What a stranger meets at {settlement} is …` (garrison face), `A stranger enters {settlement} unmet …` (no organized force), `The stranger who comes to {settlement} …` and `A newcomer at {settlement} arrives …` (arcane defense). The new face takes none of those openings, and takes `traveller` as its figure so that no other pool in the block shares its subject noun. It neither restates nor contradicts a sibling: the sibling pools speak of soldiery, watch, walls and warding, and this pool speaks only of the charter.

---

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

**The claim every face carries, and nothing else.** One claim: `(PRESENT, forces.charter.present, true)` — a charter for specialist monster response stands at this settlement, as a standing fact of the record (C-claim, C-pred). Every face below asserts that and stops. The kind-word (`monster work`, `monster business`, `chartered`, `charter hall`, `chartered against monsters`) is the pool key's and the block's STATE-KEY group `Monster Response` (charter); it is the fact's own identity, not an added fact, and it is the discriminating claim that separates this pool from its siblings `garrison PRESENT`, `militia PRESENT (no garrison)`, `watch PRESENT` and `mercenary / contracted forces PRESENT` (U9). Slot use is `{settlement}` once per face, the FILLED bag exactly (C-bag); the face slot set equals the parent's on every row (ARCH §2.5 face-row refusal). No row opens on a `proper`-typed slot (ARCH §2.5 seam contract, T-F8), and the settlement token opens no variant of the pool (wall 10, R-DA-17).

**Per variant: the claims kept, and the claims dropped as unlicensed.**

*Variant 1 `[ledger]`, was: "{settlement} keeps a charter for specialist work. The things a garrison is wrong for go to people retained to handle exactly them."*
- KEPT: the charter's presence as a standing fact — C-claim, C-pred, C-reads.
- DROPPED: the second sentence entire. It is a SECOND FACT (C-not) — it asserts (a) what the charter's work is routed away from, which reads a garrison field this pool does not read (C-reads) and which the sibling pool `NO organized force at all` can deny in the same block (A11, arm C-sibling); and (b) "a garrison is wrong for" is a STANDPOINT on another institution (C-not). Dropping it is the rewrite's purpose; the shipped breach is the corpus's known state.
- Face licences: **parent** "Against monsters, {settlement} holds a chartered hall" — presence C-claim; the fronted prepositional phrase is word order, spendable (MOVE-GRAMMAR §3.4). **face 1** "is in force" — the same standing predicate in the record's idiom, C-claim; no tense but the present (R-DA-07). **face 2** "stands chartered" — same, C-claim. **face 3** "The town keeps … under charter" — the civic body as subject, C-claim; "the town" is the settlement, not a totality over persons (C-refused).

*Variant 2 `[street]`, was: "There is somewhere at {settlement} to take the problems that are not soldiers' problems, and the town uses it more than it likes to say."*
- KEPT: the charter's presence — C-claim.
- DROPPED: (a) "the town uses it more than it likes to say" — a usage rate (a count in words) plus a BELIEF FRAME about how the town speaks of itself, licensed by no field (C-not, C-refused); (b) "problems that are not soldiers' problems" — the garrison comparison, a second fact on a field not read (C-reads, C-not); (c) the existential opener "There is", struck under R-DA-07 (the expletive goes), which is a form cure, not a claim change.
- Face licences: **parent** "is the charter hall's business" — presence stated as the institution's standing brief, C-claim; the close lands on a civic noun (R-DA-04). **face 1** "A hall on charter … carries the monster work" — same claim, the hall as subject, C-claim. **face 2** "is written into a hall's charter" — the charter as the document the record holds, C-claim, C-reads; no second record and no citation is asserted (C-src). **face 3** "Monster work is charter work at {settlement}" — the short line (R-DA-05's short-line floor), the same single claim.

*Variant 3 `[visitor]`, was: "A stranger at {settlement} finds a hall whose business is the sort of trouble a garrison is the wrong instrument for, and finds it busy."*
- KEPT: the charter hall's presence, in the visitor angle — C-claim, C-angle.
- DROPPED: (a) "and finds it busy" — an ACTIVITY fact about the hall's traffic, a second fact with no field (C-not); (b) "a garrison is the wrong instrument for" — the standpoint on another institution and its unread field, as in variant 1 (C-not, C-reads); (c) the `whose`-clause is rewritten out under wall 6 / R-DA-03 (no relative tail carrying the qualification), a form cure.
- Face licences: **parent** "finds the monster work in a chartered hall's keeping" — presence met by the stranger, C-claim under C-angle. **face 1 (ROUND 2, replaced)** "A hall chartered against monsters is what a traveller meets at {settlement}" — the same single presence claim, C-claim, C-pred, under C-angle; `chartered against monsters` is the pool key's own kind-word and asserts no second civic object of the class `hall` (C-not); `a traveller` is the visitor angle's generic figure and names no character (C-refused); the cleft is word order only (MOVE-GRAMMAR §3.4). **face 2** "the monster work belongs to a chartered hall" — same claim, the fronted beneficiary. **face 3** the long cadence: "a hall that holds a charter for exactly that" — a `that`-clause, not a `which`-clause (wall 6 bars the `which` tail only); the claim is the charter's presence and its kind, nothing further.

**The thread (MOVE-GRAMMAR §1.4.1).** This pool is a SPINE, so it opens its composed unit and hands nouns forward rather than picking them up. Every face closes on, or turns on, a civic noun a following modifier can carry: the hall (parent 1, faces 1.2, 2.1 by subject, 3.1 by subject, 3.2, 3.3), the charter (2.2), the work (2.1), or the settlement itself (1.1, 1.3, 2.3, 3.1). No face changes subject mid-passage and hands nothing back; none of them is a turn outward, so none needs the last position. The replaced face 3.1 puts the hall in the subject seat and the settlement in the close, so it hands forward both nouns the block's modifiers attach to. Each face also reads immediately after a sibling spine of the same block (walls, standing forces, contracted forces, arcane defense) because its subject is the town, the work or the hall — all nouns the block's other spines already hold.

**Hard walls checked on all twelve faces.** No em dash; no exclamation; no digit or percent; no `which`-clause; no question; no second person; no future indicative and no forecast (state never fate); no figure, no sense verb on an abstraction, no inanimate intent; no evaluative adjective on a place or a person; no named character; no theological claim; no totality over persons; no exemption; no citation of a holder (C-src is licensed but unspent — the exemplar registers with raw text cite at 0 per 786 sentences, and none of S3's three reasons is present on this fact, so a citation here would be a habit, Part B §24).

**Word counts (a slot counts as one word).**
- Variant 1: parent 7 · face 1 10 · face 2 9 · face 3 9.
- Variant 2: parent 9 · face 1 10 · face 2 11 · face 3 7.
- Variant 3: parent 13 · face 1 12 · face 2 13 · face 3 21.

**Declared band exceedances (soft rules; reported with their distance, not cured by an unlicensed claim — Part B §16, §16.2).**
1. **Level-1 grammar uniformity.** All three variants are V1 (PRESENT alone). MOVE-GRAMMAR §2.1 asks a pool of k for min(k, 8) distinct level-1 grammars and at least two in any pool of two or more. It is unreachable here without breaking a wall: the card reads ONE field, declares no move, seats no relation and licenses no second fact, so V2 (a structural consequence), V3 (a LACK), V4 (a named object), V5 (an institution row), V6 (a standing-open state), V7 (event provenance) and V8 (a typed gap) each need a field this pool does not hold, and a grammar member whose licensing field is null is not drawn and is never written empty (§3.1). Distance: 1 grammar against a floor of 2. The variety this pool can lawfully carry is the angle set and the wording faces, and that is what it carries. Unchanged by round 2.
2. **Within-pool sentence-length spread.** R-DA-05 directs within-pool sd toward ≥ 4.0; the twelve faces now measure sd ≈ 3.6 (mean ≈ 10.9, range 7 to 21), a shade wider than round 1's ≈ 3.4 because the replaced face runs one word longer. A single-claim pool cannot lengthen a sentence without buying a second fact, so the spread stands as far as one claim allows (the 7-word short line at 2.3 and the 21-word cadence at 3.3) and the residue is reported, not cured.

**Refusals: none.** All three existing variants stand lawful in place under their own numbers and their own angle tags; no variant was added, removed, merged or reordered; no face was withdrawn (Part B §22: the round-2 cure is a one-for-one substitution of one face's wording, never a removal); no `[plain]` marker appears on any spine row; the banked-refusal count for this pool is zero.
