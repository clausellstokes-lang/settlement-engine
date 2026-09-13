LOCATOR (the pool heading as it already stands in the annex; NOT part of the paste): **arcane defense PRESENT**

THE REPLACEMENT ROWS (paste these under that heading, in place of its three variant rows):

1. `[ledger]` Arcane defense stands at {settlement}.
   - `[face]` What {settlement} keeps for its defense is partly arcane.
   - `[face]` Warding counts in the provision {settlement} makes for defense.
   - `[face]` The arcane has a share in the defense of {settlement}.
2. `[visitor]` The stranger who comes to {settlement} comes to a town with arcane provision in its defense.
   - `[face]` A newcomer at {settlement} arrives in a town where warding is kept.
   - `[face]` What guards a stranger at {settlement} is in part arcane.
   - `[face]` An outsider at {settlement} is under its arcane defense.
3. `[street]` The town at {settlement} is warded.
   - `[face]` Warding is in place at {settlement}.
   - `[face]` Arcane work goes on at {settlement} as part of its defense.
   - `[face]` Arcane provision belongs to the defense of {settlement}.

--- NOTES

**REFUSALS: none.** All three variants are written lawful under their own angle tags, in order, none added, none removed, none merged.

**THE ONE LICENSED CLAIM, AND ITS CLAUSE.** The card licenses exactly one claim on this pool: *may claim: that `magicWorks` holds, as a STANDING fact of the record*. Every one of the twelve wordings above asserts that claim and no other: arcane provision stands among the defenses of this settlement, as a standing fact. The card's `relation` is `(a spine takes no relation)`, its `attach` is empty, its `move` is `(none declared)`, its `predicate` is `(none recovered)`, and its `source` standing is SOURCE-UNRESOLVED with **no citation licensed** — so no face names a holder, a record, a roll or a keeper, and none carries a move the card does not declare.

**THE READS GRAIN, DECLARED (not a refusal; the known MEASURE hazard).** The card prints `reads: magicWorks` at BRANCH grain. The pool's own key function is `arcaneDefensePoolKey(forces, magicWorks)` at `src/domain/display/stateProse/defenseStateProse.js:1319`: it returns `null` when `magicWorks === false` and otherwise selects `'arcane defense PRESENT'` on `forces.magicDef.present`. The wiring census row for this pool (`docs/content/wiring-census.json`, row 59) carries `fieldsRead: ["forces", "forces.magicDef.present", "magicWorks"]` against `branchReads: ["magicWorks"]`. The presence claim these twelve wordings make is therefore licensed by the pool's OWN key field, `forces.magicDef.present`, which the census lists among `fieldsRead`; the card's `may claim` line is that selection printed at the coarser branch grain. Read at the branch grain alone and taken with no other clause, a strict refuter could hold that only "magic functions here" is licensed and that the whole pool — every shipped variant included — asserts more; that reading is named here rather than left for the fold. It is not treated as a refusal, because the pool key itself is the typed field and the shipped corpus's every variant of this pool asserts presence.

**THE VOCABULARY, LICENSED.** `arcane defense` is the STATE-KEY's own group name for this lens (block header: `Arcane Defense` (magicDef)). `arcane provision` is the engine's own name for the lens (`defenseStateProse.js:1300`, "DS-DEF-5 lens 5 — ARCANE PROVISION"). `warding` / `warded` is the shipped corpus's own word for the same fact on this pool (variant 3 as it stands). All four head terms are the same claim in four vocabularies, so the faces are claim-equal to each other (arm A6 reads across the faces). Bare plural `wards` is avoided estate-wide here because it collides with a town's districts and with a castle's baileys; every wording either says `arcane` or says `warding`, which no reader can mistake.

**SLOTS.** Every wording carries exactly `{settlement}`, once — the card's bag is `{band: RESERVED, counterpart: proper, faction: proper, settlement: proper}` and FILLED at this block's call sites is `{settlement}` alone, so no face names an unfilled slot. Every face's slot set equals its parent's (the projector's face rule). No wording opens on `{settlement}`: the form is `sentence` and T-F8 refuses a sentence face opening on a `proper`-typed slot; wall 10 and R-DA-17 are satisfied a fortiori (the settlement token opens zero variants of this pool).

**WHAT EACH VARIANT DROPPED, AND WHY.**

- **Variant 1 `[ledger]`** kept: arcane provision stands in the defenses (card: *may claim*). Dropped: the enumeration "detection, wards, and an answer to things that conventional arrangements cannot see coming" — three particulars the card does not license (card: *may NOT a second fact*; R-DA-10's hollow specificity and the habitual triad; finite semantics: no particular no field holds), and inside it a comparative claim about what conventional arrangements can see, which is a second fact and a standpoint (card: *may NOT a standpoint*).
- **Variant 2 `[visitor]`** kept: the same standing fact, landed on what a person arriving meets (angle `visitor` is on the card's own angle line). Dropped: "at the gate" — a gate asserts a perimeter, which is the sibling pool `walls PRESENT` / `walls ABSENT`'s fact and contradicts the ABSENT sibling (arm A1: neither restate nor contradict; card: *may NOT a second fact*); "in a way he cannot quite identify" — an interior, the FEELING non-move (MOVE-GRAMMAR §1.3; R-DA-14; card: *may NOT a standpoint*); "and is not told about it" — a disclosure practice no field holds (card: *may NOT a second fact*). The male pronoun of the shipped row is gone with them, which also clears the C3 gendered-pronoun arm.
- **Variant 3 `[street]`** kept: the same standing fact in the town's plain register. Dropped: "the town does not discuss" — a second fact about public practice, and a totality over persons (card's REFUSED COLUMNS); "would notice immediately if they stopped" — a counterfactual asserting the town's dependence, a second fact and a totality over persons (card: *may NOT a second fact*); the existential opener "There are" (R-DA-07's expletive floor).

**PER FACE — THE CLAUSE THAT LICENSES EACH CLAIM.** Each row below lists every claim the wording makes.

| # | face | claims made | licensing clause |
|---|---|---|---|
| 1 | `Arcane defense stands at {settlement}.` | (i) arcane defense stands here, as a standing fact | (i) card *may claim*, at the pool key's own field `forces.magicDef.present`; slot `{settlement}` from the card's bag, FILLED |
| 1a | `What {settlement} keeps for its defense is partly arcane.` | (i) the same | (i) as above; "keeps" is the block's own verb for a held institution and adds no fact |
| 1b | `Warding counts in the provision {settlement} makes for defense.` | (i) the same | (i) as above; "provision" is the engine's own lens name, not a second fact |
| 1c | `The arcane has a share in the defense of {settlement}.` | (i) the same | (i) as above; "a share" is partitive, not a count (card *may NOT a count*) |
| 2 | `The stranger who comes to {settlement} comes to a town with arcane provision in its defense.` | (i) the same | (i) as above; the arriving stranger is the angle's vantage, and the predicate lands on the town, so no claim attaches to any person |
| 2a | `A newcomer at {settlement} arrives in a town where warding is kept.` | (i) the same | (i) as above; the warding is placed in the town, never at a gate or an approach (no spatial fact the field does not hold) |
| 2b | `What guards a stranger at {settlement} is in part arcane.` | (i) the same | (i) as above; that a person in the town is covered by the town's defense is entailed by the claim, not a second one |
| 2c | `An outsider at {settlement} is under its arcane defense.` | (i) the same | (i) as above; same entailment as 2b |
| 3 | `The town at {settlement} is warded.` | (i) the same | (i) as above; the shipped row's own word for this fact |
| 3a | `Warding is in place at {settlement}.` | (i) the same | (i) as above |
| 3b | `Arcane work goes on at {settlement} as part of its defense.` | (i) the same | (i) as above; present habitual, a structural clause, never historical (R-DST-B / A6) |
| 3c | `Arcane provision belongs to the defense of {settlement}.` | (i) the same | (i) as above |

**THE WALLS, CHECKED ON ALL TWELVE.** No em dash · no exclamation · no question · no digit or percent · no `which`-clause (and no relative clause carrying a second fact) · no first or second person · no future indicative and no forecast · no existential opener · no figure, sense verb on an abstraction, or inanimate intent · no citation, holder, roll or keeper · no office, count, duty or exemption (nothing is asserted of the institution table) · no named character and no fate · no theological claim · no totality over persons · one sentence each, so no second-sentence summary and no gloss tail.

**THE THREAD (owner, 2026-09-08 ~21:4x).** This pool is a SPINE, so its wording opens the composed passage and hands nouns forward. Each of the twelve ends on a noun a modifier can carry: the town's name (1, 1c, 3a, 3c), `defense` (1b, 2, 2c, 3b), `arcane` as the standing condition (1a, 2b), `kept` (2a), `warded` (3). None ends on a pronoun (R-DA-04's pronoun-closer ceiling), and the close varies in kind across the set — a name, a civic noun, a condition, a participle.

**SPREAD (A11 / R-DA-05).** No two of the twelve share their first two words: `Arcane defense` · `What {settlement}` · `Warding counts` · `The arcane` · `The stranger` · `A newcomer` · `What guards` · `An outsider` · `The town` · `Warding is` · `Arcane work` · `Arcane provision`. The three variant rows run 5, 16 and 6 words, which widens the within-pool spread the shipped rows lacked (25, 20, 18). The pool holds one licensed claim, so all four faces of a variant are necessarily claim-equal; the distance between them is carried by vocabulary and rhythm — a bare declarative, a fronted `What`-clause, a partitive, a doubled verb, a pseudo-cleft, a copula with a prepositional tail, a present habitual.

**SIBLINGS THIS SPINE SITS BESIDE (arms A1 and A11).** Within DS-DEF-5: `walls PRESENT/ABSENT`, `garrison PRESENT`, `militia PRESENT (no garrison)`, `watch PRESENT`, `NO organized force at all`, `mercenary / contracted forces PRESENT`, `charter hall PRESENT/ABSENT`, and this pool's own `arcane defense ABSENT`. No wording above names a wall, a gate, a perimeter, a soldier, a garrison, a militia, a watch, a hall, a contract or a payment, so none restates or contradicts a sibling on a tab where several mount together. The frame "what defends {settlement}" was drafted and dropped because the `mercenary` spine already opens on it and the echo would read as the office's tic rather than its formula.
