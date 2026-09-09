Seat: Opus 5 — Fable-unvalidated. Block `DS-DEF-2` · pool key `Internal Security: detention without process` · REWRITE draft round 1.
Paste target: under the bold pool line **`Internal Security`: detention without process** in `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`, replacing rows 1 to 3 entire. Three variants in, three variants out; same vids, same order, same angle tags; four wordings each (the numbered row plus three `[face]` sub-rows). The pool's typed lines are untouched and not repeated here.

1. `[ledger]` At {settlement} the town can hold a person and has no court.
   - `[face]` A prison at {settlement} is the town's and a court is not.
   - `[face]` Detention at {settlement} stands where a court does not.
   - `[face]` A person can be held at {settlement} and cannot be tried.
2. `[visitor]` A stranger at {settlement} finds no court in the town.
   - `[face]` Visitors at {settlement} arrive in a town that keeps no court.
   - `[face]` A newcomer to {settlement} meets no court.
   - `[face]` A traveller at {settlement} stands in a town where no court sits.
3. `[street]` The town can put a person away at {settlement} and cannot say on what grounds.
   - `[face]` Shutting a person away at {settlement} takes no court.
   - `[face]` Held at {settlement}, a person is held outside any court.
   - `[face]` What the town can do at {settlement} is hold a person; what it cannot do is put one before a court.

--- NOTES

REFUSALS: none. All three variants are written lawful; no variant is banked.

**THE CARD, AS THIS PACKET READS IT.** The card's `may claim` line names one read (`court`) but the `reads` line lists two (`court`, `prison`), both `not-produced`, and the pool key is their JOINT value. The branch is `!hasCourtSystem && hasPrison` (`src/domain/display/threatAssessment.js:145-149`, the `Detention without systematic prosecution` arm), so the licensed claim is one composite standing fact of the record with two halves:

- **(A)** the town holds a place of detention (`prison` present);
- **(B)** the town holds no court (`court` absent — an ABSENCE move of class (a) LACK, a `none-exists` world field).

Nothing else on the card is claimable here: `may NOT` refuses a count, a cause, a season, a future, a standpoint and a second fact, and `source` stands SOURCE-UNRESOLVED, so no wording cites a holder. `bag` is FILLED at this block's call sites at `{settlement}` alone, so every wording carries `{settlement}` exactly once and its slot set equals its parent's. `role: spine` · `form: sentence` · `angle: ledger street visitor` — the three tags stand exactly as the shipped rows carry them, one bracketed tag per row, no `[plain]`.

**WHICH CARD CLAUSE LICENSES WHICH CLAIM, PER FACE.** Every wording asserts only (A) and/or (B), both under `may claim` read as above; `{settlement}` under `bag` FILLED; the angle framing under `angle:` and carries no claim of its own.

| # | wording | claims | licensing clause | words |
|---|---|---|---|---|
| 1 | At {settlement} the town can hold a person and has no court. | A, B | `may claim` (both halves) · `bag` · `angle: ledger` | 12 |
| 1 | A prison at {settlement} is the town's and a court is not. | A, B | as above | 12 |
| 1 | Detention at {settlement} stands where a court does not. | A, B | as above | 9 |
| 1 | A person can be held at {settlement} and cannot be tried. | A, B | as above | 11 |
| 2 | A stranger at {settlement} finds no court in the town. | B | `may claim` (the `court` half) · `bag` · `angle: visitor` | 10 |
| 2 | Visitors at {settlement} arrive in a town that keeps no court. | B | as above | 11 |
| 2 | A newcomer to {settlement} meets no court. | B | as above | 7 |
| 2 | A traveller at {settlement} stands in a town where no court sits. | B | as above | 12 |
| 3 | The town can put a person away at {settlement} and cannot say on what grounds. | A, B | `may claim` (both halves) · `bag` · `angle: street` | 15 |
| 3 | Shutting a person away at {settlement} takes no court. | A, B | as above | 9 |
| 3 | Held at {settlement}, a person is held outside any court. | A, B | as above | 10 |
| 3 | What the town can do at {settlement} is hold a person; what it cannot do is put one before a court. | A, B | as above | 21 |

Claim-equality across the faces of one variant (arm A6, read across the faces and never back to the old sentence) holds by construction: variant 1's four wordings each assert {A, B}; variant 2's four each assert {B}; variant 3's four each assert {A, B}. In variant 3 the street register states (B) as the town's incapacity to state grounds rather than as the word `court` in the parent row; that is the same LACK in the town's own idiom, and the three faces name the court outright so the parent cannot be read as a second fact.

**(A) IS ALWAYS THE MODAL, NEVER OCCUPANCY.** `hasPrison` licenses the town's capacity to hold, not that anyone is held. Every wording keeps the modal or the generic ("can hold", "can be held", "shutting a person away takes", "held at {settlement}, a person is held" as a generic conditional). No wording asserts that a person is in fact confined today, and none asserts a count.

**WHAT WAS DROPPED, AND UNDER WHICH LAW** (the rewrite's purpose; the shipped breach is the corpus's known state).

- Variant 1's `which makes enforcement here a matter of who is doing it`: dropped on four counts. It is a which-tail (order wall 6; R-DA-03; the brief's no-which-clause); `makes` is a CAUSE (`may NOT: a cause`); "a matter of who is doing it" is a STANDPOINT on how power is exercised (`may NOT: a standpoint`) and names an agency the card's two reads do not hold; and it is a second fact riding the sentence with no computed-consequence licence (S2's guard; `may NOT: a second fact`).
- Variant 1 opened on `{settlement}`. The annex seam contract refuses a sentence-form row opening on a `proper`-typed slot of the block's bag (ARCH §2.5, T-F8), so no row and no face in this packet opens on the slot. R-DA-17's "the town's name is not the default opener" is satisfied by construction.
- Variant 2's `is careful in a way he would not need to be in a town with courts`: the stranger's conduct and its warrant asserted as a fact of the world is exactly `may NOT: a standpoint`; the counterfactual town is a modality no field holds; and `he` is the gendered line the C3 arm reds on. Dropped. What survives is what the contrast presupposed and the card licenses: (B).
- Variant 2's `and cannot say precisely why`: an interior state of a person (a belief frame, floored at zero by R-DA-13's executable limb and by the register card's "never on a belief"), and a second fact. Dropped.
- Variant 3's `and has learned not to ask on whose`: `has learned` is a HISTORICAL claim with no event-provenance field behind it (R-DST-B / A6: a standing configuration field licenses a structural clause and never a historical one); "not to ask" is a behavioural totality over the town's persons (`REFUSED COLUMNS`: a totality over persons); and it is a third clause and a second fact. Dropped.
- No claim is ADDED anywhere. The twelve wordings assert the branch and nothing beside it.

**THE ONE JUDGMENT THIS PACKET MAKES, RECORDED FOR VETO.** Variant 2 carries (B) alone. The shipped `[visitor]` sentence asserts nothing about detention — its only licensed content is the court's absence, which its contrast presupposes — and "never ADD a claim" therefore governs, so no face of variant 2 writes the prison. The consequence is stated plainly so the chair can rule the other way: on its surface words variant 2 no longer distinguishes this pool from the sibling `Internal Security: no legal infrastructure`, whose branch also holds no court, and only the reader's branch does that work. Adding (A) to variant 2 would read in the pair instrument as an ADDED claim, not a kept one, and so needs a chair act. If the chair rules for adding it, the lawful shape is the prison first and the court's absence last (order wall 3 bars an ABSENCE from opening a variant), for example a stranger finding cells at {settlement} and no court.

**PROVENANCE: NOT AVAILABLE, NOT DECLINED.** The card prints `source: (none) · standing SOURCE-UNRESOLVED` and states that no citation is licensed here, arm A13 refusing any face that names a record holder. So the question Part B §24's ceiling would decide (one citation per unit, on one of amendment S3's three reasons) is not reached in this pool: no wording names a keeper, a roll or a book. Recorded, not deferred.

**THE SHIPPED FENCE NOTE VERSUS THE CARD, FLAGGED NOT DECIDED.** The DS-DEF-2 provenance block in `RECEIPT_POOLS_DOSSIER_STATE.md` licenses *capability* clauses in this cluster ("walls without people cannot be held"). The card does not — `may NOT: a cause` — and the brief binds every claim to the card and to nothing else. So no wording here says what detention without a court amounts to, costs, or produces. This is a live disagreement between the shipped authoring note and the licence card; it is the chair's, and the same disagreement is flagged in this block's `Invasion & War: walls with NO force` packet.

**THE THREAD (owner, 2026-09-08 ~21:4x; MOVE-GRAMMAR §1.4.1).** This pool is a SPINE, so each wording opens its passage and hands nouns forward rather than picking one up. Every wording closes on a civic noun or a standing condition a modifier can take up — the court, the town, the trying of a person, the holding — and none of the twelve depends on a preceding sentence to parse or to resolve a pronoun. Each is one sentence, so no wording carries an internal seam that could break the thread; `may NOT: a second fact` makes the single sentence the only lawful shape here anyway. Every wording also reads correctly after a sibling modifier, because its subject is named in full (the town, a prison, a person, a stranger) and never carried in from outside.

**WALLS CHECKED ON EVERY WORDING.** No em dash · no exclamation · no question · no digit or percent · no `which` · no first or second person · no gendered pronoun · no future indicative (every wording is present, the capacity carried by `can`/`cannot`) · no figure, no sense verb on an abstraction, no inanimate intent · no expletive opener ("There is" / "It is") · no citation · no named character · no theological claim · no exemption from a duty · no count · no quantifier over persons ("every", "all", "only", "none", "nobody", "anyone"). Every wording is one sentence of `FORM: sentence`, opens on a capital that is not a `proper`-typed slot, and carries `{settlement}` exactly once. No ABSENCE opens a wording and no two absences sit adjacent (order wall 3): every wording asserts (A) or the angle's frame first and lands (B) at or near the close.

**SPREAD (A11, R-DA-05), REPORTED AS INFORMATION.**
- First two words, all twelve distinct: "At {settlement}" · "A prison" · "Detention at" · "A person" · "A stranger" · "Visitors at" · "A newcomer" · "A traveller" · "The town" · "Shutting a" · "Held at" · "What the". At the variant grain the three parents are "At {settlement}" · "A stranger" · "The town".
- Lengths 7, 9, 9, 10, 10, 11, 11, 12, 12, 12, 15, 21; mean 11.6. Two wordings at 9 and one at 7 hold R-DA-06's short-line floor; the 21-word cleft carries the top of the spread; nothing approaches the over-30 ceiling.
- Shapes across the twelve: plain declarative, ellipsis-parallel ("is the town's and a court is not"), locative subordinate ("stands where"), passive pair ("can be held and cannot be tried"), the visitor's four encounter verbs (finds, arrive, meets, stands), gerund-subject, fronted participle, and one cleft with the pool's single semicolon (R-DA-06's rationed joint, one instance in twelve).
- Vocabulary lanes kept apart: variant 1 the record's institutional nouns (prison, detention, court, the town's); variant 2 the arrival verbs (finds, arrive, meets, stands, sits); variant 3 the plain civic verbs (put away, shutting away, held, hold).

**BANDS KNOWINGLY EXCEEDED, REPORTED NOT CURED (§16.1/§16.2; the PERFECTION CEILING makes a pool at zero exceedances a finding).**
1. **Close kind (R-DA-04).** Nine of twelve close on the ABSENCE kind and three on a CONDITION; the set {object, prohibition, name-not-given} is not reached. This is forced, not chosen: order wall 3 bars the absence from opening, so (A) leads and (B) closes, and the card licenses no third fact to close on. Curing it would need an added claim.
2. **Participial fronting (R-DA-18's 0.020 floor).** One wording of twelve is fronted by a participle ("Held at {settlement}, …"), which is above the exemplar floor at this grain. It is kept for the rhythm spread and reported.
3. **Lexical mirror with the sibling `Internal Security: court without detention`.** That pool's shipped row says the town tries offences it cannot hold anyone for; this pool says the reverse. The verbs "hold" and "try" are the two reads' own verbs and cannot be spent away, so the two pools mirror each other in vocabulary by necessity. Neither restates nor contradicts the other (arms A1 and A11): the claims are complementary branch values of the same two fields.

**SIBLINGS ON THE TAB (arms A1 and A11).** The four pools that co-render beside this one on the defense tab are the monster row, the invasion row, the economic-survival row and the disasters row. No wording here touches their vocabulary — no creature or country, no wall, perimeter, garrison or militia, no revenue, pay or reserves, no granary or sick-house — and no wording contradicts them. Inside the `Internal Security` family, the shipped phrases "legal machinery", "order rests on force alone", "a procedure rather than a favour", "the watch's temper", "money and exile", "the purse or the road" and "nowhere to take it" belong to the sibling keys and appear in none of these twelve; in particular no wording here names the watch, which this card's `reads` do not hold.
