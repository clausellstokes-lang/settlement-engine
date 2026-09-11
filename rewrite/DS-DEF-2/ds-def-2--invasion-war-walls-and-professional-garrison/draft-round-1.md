# DS-DEF-2 · `Invasion & War`: walls AND professional garrison — REWRITE, draft round 1

Seat: Opus 5 (Fable-unvalidated), writer for the Fable chair · block DS-DEF-2 · role SPINE · 3 variants in, 3 variants out, 12 faces (4 per variant: the numbered row plus three `[face]` sub-rows).
Paste the block below under the pool's bold heading, in place of the pool's three existing numbered rows. The typed lines (ROLE / READS / RELATION / ATTACH / FORM / MOVE) are untouched and are not repeated here.
Status: IN PROGRESS — variants 1 to 3 written; the notes are being written.

1. `[ledger]` The works at {settlement} are entered as standing, and so are the soldiers.
   - `[face]` Soldiers are carried standing at {settlement}, and with them the works the town has built.
   - `[face]` Two things are entered at {settlement} and entered together: the works, and the town's muster.
   - `[face]` Both the town's works and the town's force are set down at {settlement} as standing.
2. `[visitor]` A stranger at {settlement} sees the works and the soldiers together.
   - `[face]` What a stranger sees at {settlement} is the works and, with the works, the soldiers.
   - `[face]` At {settlement} a stranger sees both the town's force and the works the town has built.
   - `[face]` A stranger reaches {settlement} and finds the works standing. Standing with them is the town's muster.
3. `[street]` The town has the works, and with the works it has soldiers.
   - `[face]` Soldiers are in the town, and the works stand with them.
   - `[face]` The town keeps its works. With those works stands the town's force.
   - `[face]` What the town has standing is the works, and the muster besides.

--- NOTES

## 0. The card every face is written against (printed read-only in laneRW-DEF2)

`LICENCE (block DS-DEF-2 · role spine · key Invasion & War: walls AND professional garrison)` —
**reads/predicate** `invasionRowSituation(walls, garrison, militia)` via `INVASION_ROW_POOL` in `defenseStateProse.js`, `=== walls, professional garrison`; **bag** `{band: RESERVED, route: proper, settlement: proper}`, FILLED here `{settlement}`; **relation** none (a spine takes none); **seat/form** sentence; **move** none declared; **angle** `ledger street visitor`; **source** `muster · standing LICENSED`, holder `null` on this row; **may claim** that the reader selects the row `walls, professional garrison`, as a STANDING fact of the record; **may NOT** a count, a cause, a season, a future, a standpoint, a second fact, another civic object of the class `force`; **audience** player.

The key is ONE keyed condition of TWO inputs, `walls === true` AND `garrison === true` (skeleton §0.2, chair R-v). The third input `militia` is never consulted on this branch, so every face is SILENT on a militia: it is neither asserted nor denied. Every face therefore states exactly two reads and their conjunction, and nothing else.

**The two lawful spellings this draft uses, and why.** The works read is spelled `the works` / `what the town has built` / `the town's works` — never `a line`, `a perimeter`, `an enclosure` (continuity NOT ENTAILED, entailment D-6: false of a `Gates (if walled)` town and of a post-ruin `Citadel`), never a material (W11, `{defmaterial}` unminted), never a height, a gate, a walkway, a manning or a condition. **The class word `the wall` is declined in every face of this draft** (the skeleton's §0.2 recommendation taken at its strictest: the key fires at town through `Gates (if walled)` and at city through `Citadel`, and one string is written for every firing). The force read is spelled `the soldiers` / `soldiers` / `the town's force` / `the town's muster` / `the muster` — the person-plural and class words ratified at ADDENDUM 13 A.5 and printed on the referent table's `soldiers` row — never `the garrison` baked (W12: the key also fires on `Barracks` towns where no `Garrison` row resolves), never `the militia`, `the watch` (W13), `the guard` (struck), `the men on the wall` (struck). **`professional` is not used as an adjective in any face** (skeleton fence 3: the label's engine meaning is "the garrison bucket, not the militia bucket", and the dictionary sense is entailed of a `Garrison` row and not of a `Barracks`); the discriminator rides on `the soldiers` and on `the muster`, the paid military's own class words. ONE force spelling per face (the card's `objectClass force` refuses a second object of the class; the projector's class guard cannot tell two force nouns apart, OV-25).

All three variants realise **V1 PRESENT** (skeleton §8: the only level-1 member this card licenses — V2 needs a structural-consequence field, V3/V8 a `none-exists` or `not-held` field, V4 a named-object field, V5 an institution row, V6 an unresolved value; none is on the card). The spread the census's `grammars: 2` asks for is carried by the ORDER of the two reads, the sentence count, and the construction, as §8 directs.

## 1. Per variant: the claims kept, the claims dropped

**vid 1 `[ledger]`** — shipped: *"{settlement} has a line and professionals to hold it, which is real deterrence against raiding and against a conventional assault; it is not a posture rated for a long siege without stores behind it."*
- KEPT (licensed): the town has the works (`walls === true`); the soldiers stand (`garrison === true`); the two on one row (the key's conjunction).
- DROPPED: *a line* — continuity NOT ENTAILED (D-6, W15); the substance is kept as `the works`. *to hold it* — a manning and a purpose no field records, and a relation between two BODY reads that no field computes (D-3, D-7, W23 by shape; ADDENDUM 8 ruling 2). *which is real deterrence* — a VERDICT (MOVE-GRAMMAR §1.3), a cause (the card's may-NOT), and a `which`-clause (a hard wall). *against raiding and against a conventional assault* — an event class no field records and a classification the engine does not model (W17 by shape; the engine's chrome at `threatAssessment.js:115` is not a licence, OW-20). *a posture rated* — an AGGREGATE word and a rating on a BODY read (W20, D-22). *a long siege* — no siege field, a hypothetical in the present indicative, a duration (A-24/W17; the card's "a season"). *without stores behind it* — a second fact of another cell (the Disasters row on the same tab; T-F12) and a same-page contradiction risk beside a `granary AND hospital` row (C7). The opener `{settlement}` is not carried into any face (T-F8, ARCH §2.5; a cure, not a regression).
- The lawful residue kept as rhythm, not as words: the `has … and …` conjunction shape (face 4 carries it as `Both … and …`; faces 1 and 2 as the coordinate `and so are` / `and with them`).

**vid 2 `[visitor]`** — shipped: *"A stranger sizing {settlement} up sees the two things that matter together (the wall and the men who belong to it) and revises what an attempt would cost."*
- KEPT (licensed): a stranger SEES (the visitor's eye, W27); the works; the soldiers; TOGETHER (the key's conjunction in one word — kept verbatim in face 1).
- DROPPED: *sizing {settlement} up* — the eye appraises (W27: it may see, never act or decide). *the two things that matter* — a standpoint and a ranking (W20); the count in words survives lawfully in vid 1 face 3, the "that matter" does not. *who belong to it* — a relation between the two bodies, a manning by another route, and a possessive binding the men to the wall (W1, W23). *revises what an attempt would cost* — the stranger decides, a hypothetical assault, and the deterrence claim by another door (W17, W27; the card's may-NOT "a future", "a cause").

**vid 3 `[street]`** — shipped: *"The town believes it could be held, and the belief is founded on something rather than on hope."*
- KEPT (licensed): only the frame `The town` as the street's subject (the town is the holder of its own roster, and "the town has / keeps …" states the presence read in the naming form).
- DROPPED: *believes* — a belief frame and a fused collective agent (R-DA-13's executable floor; W22, W23; D-F16/D-F18 by shape). *could be held* — a manning and a hypothetical outcome (A-24/W17). *founded on something* — a cause, and the hedged non-statement standing in for the two bodies (fault 29; R-DA-13's vague-authority floor). *rather than on hope* — a contrast whose rejected alternative names no sibling key or band, and a feeling (R-DA-02; the FEELING non-move).
- This variant's floor RISES: the shipped line names NEITHER read, and every face here states both at the street's stance. No face carries `{settlement}` — the parent's slot set is empty (ARCH §2.5).
