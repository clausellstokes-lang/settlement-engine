Block DS-DEF-5 · pool `militia PRESENT (no garrison)` · draft round 1 · Seat: Opus 5 (Fable-unvalidated)
Paste target: under the pool's bold heading in `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`, replacing rows 1 to 3 whole. Three variants, same vids, same order, same angle tags; four faces each.

1. `[ledger]` {settlement} is defended by its own people under arms.
   - `[face]` A muster of the town's own defends {settlement}.
   - `[face]` What {settlement} has for a defense is a militia of its own townspeople.
   - `[face]` {settlement} keeps a militia.
2. `[street]` The townspeople turn out under arms.
   - `[face]` The militia here is made up of people who live in the town.
   - `[face]` Arms here are in the town's own keeping.
   - `[face]` The town does its own defending.
3. `[counterforce]` The defense of {settlement} is the town itself, armed.
   - `[face]` Defense at {settlement} is a household matter.
   - `[face]` The muster at {settlement} is drawn from the town it defends.
   - `[face]` Arms and town are the same at {settlement}.

--- NOTES

**The card this pool is written against** (printed in the dock, `node scripts/prose-licence-card.mjs DS-DEF-5 'militia PRESENT (no garrison)'`), the clauses cited below by short name:
- **[may-claim]** "may claim: that `present` (truthy (no literal)) holds, as a STANDING fact of the record"
- **[predicate]** "forces.militia.present truthy (no literal)"
- **[bag]** "FILLED at this block's call sites: {settlement}"
- **[form]** "seat/form: (not a seat-taker) / sentence"; **[angle]** "counterforce ledger street"; **[audience]** "player (no mark)"; **[covert]** "no"
- **[source]** "muster · standing LICENSED — a citation of this holder is licensed where the provenance budget allows"
- **[may-not]** "a count, a cause, a season, a future, a standpoint, a second fact, another civic object of the class `force`"
- **[refused]** "a totality over persons; an exemption from a duty; a named character and that character's fate; a theological claim"

**One licence covers every face, and it is the only one any face spends.** Each of the twelve faces asserts exactly one claim — that the militia stands — under **[may-claim]**, in the present, as a standing fact of the record. No face carries a second claim, so the four faces of each variant are claim-equal to each other (arm A6 read across the faces) and the three variants are claim-equal to one another. Every face is one sentence, because **[may-not]** refuses a second fact and no computed consequence exists on this pool (no relation, no attach, no move declared), so amendment S2's riding clause has nothing to ride on.

**Per face, the licence of each claim.**

| # | face | claims | licence |
|---|---|---|---|
| 1a | {settlement} is defended by its own people under arms. | militia stands | [may-claim]; the slot from [bag]; no mark, [audience] |
| 1b | A muster of the town's own defends {settlement}. | militia stands | [may-claim]; "muster" as the civic body, not as a cited holder (see the provenance note) |
| 1c | What {settlement} has for a defense is a militia of its own townspeople. | militia stands | [may-claim]; the term named plainly (see the term note) |
| 1d | {settlement} keeps a militia. | militia stands | [may-claim]; "keeps" is the block's own verb for an institution standing (walls, watch, charter, arcane rows) — R-DA-22 |
| 2a | The townspeople turn out under arms. | militia stands | [may-claim], habitual present; no slot, matching the shipped variant's empty slot set |
| 2b | The militia here is made up of people who live in the town. | militia stands | [may-claim] + the term note; no quantifier, so no [refused] totality |
| 2c | Arms here are in the town's own keeping. | militia stands | [may-claim]; "keeping" is custody, not a place — no spatial fact is asserted |
| 2d | The town does its own defending. | militia stands | [may-claim] |
| 3a | The defense of {settlement} is the town itself, armed. | militia stands | [may-claim]; the condition close ("armed"), R-DA-04's varied kind |
| 3b | Defense at {settlement} is a household matter. | militia stands | [may-claim] + the term note |
| 3c | The muster at {settlement} is drawn from the town it defends. | militia stands | [may-claim] + the term note |
| 3d | Arms and town are the same at {settlement}. | militia stands | [may-claim]; an identity of the town with its arms, bounded to this town, so R-DA-12's generalisation test is not engaged |

**What the shipped sentences claimed and the card does not license — dropped, one for one.**

Variant 1 (`[ledger]`), shipped: "{settlement}'s defense is its own people under arms. They know the ground, they can be raised, and raising them stops everything else the town was doing."
- "is its own people under arms" — KEPT as the licensed claim.
- "They know the ground" — DROPPED: a second fact, and a capability no read of this pool holds ([may-not] "a second fact").
- "they can be raised" — DROPPED: a modal capacity beyond `present`; kept only as far as the term's own content (see the term note), never as a separate assertion.
- "raising them stops everything else the town was doing" — DROPPED: a cause, and a consequence with no event provenance and no computed-consequence field ([may-not] "a cause"; MOVE-GRAMMAR §1.2 row 7 requires double licensing).
- The second sentence goes with them; the variant is now one sentence.

Variant 2 (`[street]`), shipped: "The town turns out when it must and goes back to work after, and understands that this is a different thing from having soldiers."
- "turns out" — KEPT.
- "and goes back to work after" — DROPPED: a second fact about what follows a raising; the sequence is an event shape, not the standing fact.
- "understands that this is a different thing from" — DROPPED: a standpoint, and a belief frame ([may-not] "a standpoint"; R-DA-13's belief-frame floor).
- "having soldiers" — DROPPED: another civic object of the class `force` ([may-not]); it is also the sibling pool `garrison PRESENT`'s own subject, and A1 forbids restating a sibling.

Variant 3 (`[counterforce]`), shipped: "{settlement} could keep soldiers and does not; the town has decided that arming itself when needed costs less than paying anybody to be armed all year."
- "could keep soldiers and does not" — DROPPED: another civic object of the class `force`, asserted as absent ([may-not]).
- "the town has decided" — DROPPED: a standpoint, and an intent the record holds no field for.
- "costs less than paying anybody to be armed all year" — DROPPED: a cause; a comparison of costs the card holds no economic read for; "all year" is a season ([may-not] names the count, the cause and the season together); and "paying anybody to be armed" names the contracted-forces sibling.
- What survives is only the militia's presence, so variant 3 is rewritten as the same claim in the counterforce SHAPE (see the counterforce note).

Nothing is added to any variant. No slot beyond `{settlement}` is used, and the slot set of every face equals its parent's: variants 1 and 3 carry `{settlement}`, variant 2 carries none, exactly as shipped.

**The term note (the closest call in the set, flagged for the refuters).** Faces 1a, 1c, 2b, 3b and 3c render the militia in plain civic words — the town's own people under arms, a militia of its own townspeople, made up of people who live in the town, a household matter, drawn from the town it defends. This seat treats the plain naming of the institution as the TERM's own content under FINITE-SEMANTICS and R-DA-22 (one term for one thing; the clerk names the field's value, never invents beside it), not as a second fact about composition. The shipped variant did the same ("its own people under arms"), so the reading is the corpus's, not this draft's. If the chair rules the other way, every face in the set reduces to the bare form of 1d and 2d ("{settlement} keeps a militia", "The town does its own defending"), which are lawful under the narrow reading and are deliberately placed one per variant so the set survives that ruling without a re-draft.

**The counterforce note (a pressure recorded, not a refusal).** The `[counterforce]` angle's shipped content was the whole of the rejected alternative — a garrison the town could keep and does not, priced against a militia. Every part of that is refused by the card's [may-not] column, and R-DA-02's sibling-key licence for a CONTRAST cannot reach past it, because the card is the licence and nothing else is. Variant 3 therefore carries its angle by SHAPE rather than by contrast: the counterforce is the identity of the defender with the defended (3a, 3c, 3d) and the placing of defense inside the household rather than in a body of its own (3b). No face says or implies that another force is absent. If a chair ruling later licenses `forces.garrison.present` as a sibling-key contrast on this pool — the pool's own key carries "(no garrison)" and the card lists that path as a MEASURED read — variant 3 takes a sharper face and this note is the place to reopen it. Written as a live question, not a deferral.

**The provenance note.** [source] licenses a citation of the muster "where the provenance budget allows". No face cites it. §24 sets the budget at one citation per unit and only for one of S3's three reasons — two accounts that disagree, a count from an interested party, a record whose keeper is a power — and none of the three obtains here: the card holds no second account, no count, and the muster is the militia's own roll, so a citation would be the office citing its own books, which §4.4.3 names as a finding. The exemplar registers cite at zero per 786 sentences. "Muster" appears in 1b and 3c as the civic BODY, not as an attributed source; no face says the fact comes from the roll.

**Walls checked on every face.** No digit, no percent, no em dash, no exclamation, no question, no `which`-clause, no semicolon, no colon. No future indicative and no subjunctive (STATE never FATE). No existential opener. No first or second person. No quantifier over persons, so no [refused] totality and no exemption. No named person and no fate. No deity. No figure: "hands" does not appear in the final set, "keeping" is custody and "the town itself, armed" is an identity, not a comparison. No evaluative adjective on the town or its people. Every face is licensed by the block's own field and by no other.

**Band positions reported (information, never a verdict).**
- Word counts, in the order written: 1a 9 · 1b 8 · 1c 13 · 1d 4 || 2a 6 · 2b 13 · 2c 8 · 2d 6 || 3a 9 · 3b 7 · 3c 11 · 3d 8. Mean 8.5.
- Faces under eight words: 4 of 12 (0.333), against R-DA-06's floor of 0.030 — the short line exists here, deliberately, one per variant.
- Sentences per face: 1 everywhere. The shipped pool ran two sentences in two of its three variants; the fall is the dropped claims, not a trim (§22: cutting words inside a band is editing; no variant, slot or face is removed, and the count of wordings rises from 3 to 12).
- Word-length sd across the twelve faces is about 2.8, below the ≥ 4.0 band edge measured on shipped R1 pools. Reported under §16's channel rule as a distance, not a fail; a set carrying one claim in one sentence cannot reach that sd without adding a claim, and adding one is refused.
- Opener spread: twelve distinct first-two-word pairs; the settlement token opens one variant only (variant 1, faces 1a and 1d), never variant 2 or 3, which cures the shipped pool's two settlement-opening variants against R-DA-17 wall 10.
- Close kinds: object (arms, town, militia, households), persons (townspeople), condition (armed), custody (keeping), proper name ({settlement}). One condition close, no pronoun close, one abstract close (3b "matter").
- Sibling distance: no face reuses the vocabulary of a sibling pool in this block — "standing force", "soldiers", "answerable ... as work" and gate-counting belong to `garrison PRESENT`; "no command, no training" to `NO organized force at all`; "keeps a watch" and night-walking to `watch PRESENT`; "contracted", "terms" and "engagement" to the mercenary pool. None appears here.

**Refusals: none.** All three variants are written lawfully under the card. Two pressures are recorded above rather than banked: the term note (a chair reading that would narrow the set, with the fallback faces already in it) and the counterforce note (a chair ruling that would widen variant 3).
