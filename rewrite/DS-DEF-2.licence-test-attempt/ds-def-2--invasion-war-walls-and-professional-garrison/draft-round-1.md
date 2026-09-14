# DS-DEF-2 · `Invasion & War`: walls AND professional garrison — REWRITE, draft round 1

Seat: Opus 5 (Fable-unvalidated), writer for the Fable chair · block DS-DEF-2 · role SPINE · 3 variants in, 3 variants out, 12 faces (4 per variant: the numbered row plus three `[face]` sub-rows).
Paste the block below under the pool's bold heading, in place of the pool's three existing numbered rows. The typed lines (ROLE / READS / RELATION / ATTACH / FORM / MOVE) are untouched and are not repeated here.
Status: COMPLETE — three variants rewritten in place, twelve faces, zero refusals.

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
   - `[face]` What the town has is the works, and the muster besides.

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

## 2. Per face: which card clause licenses each claim

Every face carries the SAME claim set, so arm A6 reads across the faces and finds them claim-equal: (i) the works stand — the card's `may claim`, the `walls === true` half of the predicate, layer BODY; (ii) the soldiers stand — the card's `may claim`, the `garrison === true` half, layer BODY; (iii) the two on one row — the key's own conjunction (`invasionRowSituation` returns this row only when both are true), never a relation, a holding or a cause. The table names the words that carry each half and the stance word that carries the angle. `{settlement}` appears exactly once in every face of vids 1 and 2 and in no face of vid 3, matching each parent's slot set (ARCH §2.5).

| vid · face | words | the works half (card `may claim`, `walls`) | the force half (card `may claim`, `garrison`) | the conjunction | the angle's own carrier | slots |
|---|---|---|---|---|---|---|
| 1 · row | 13 | "The works at {settlement}" | "the soldiers" | "and so are" (both entered on one row) | "are entered as standing" — the office's formula, R-vi/W7; no record noun, no citation (W24) | `{settlement}` |
| 1 · a | 15 | "the works the town has built" | "Soldiers" | "with them" (the skeleton's blessed conjunction phrase, order inverted) | "are carried standing" — the office's formula | `{settlement}` |
| 1 · b | 15 | "the works" | "the town's muster" | "entered together" plus the colon pair | "Two things are entered" — the formula; the count is in WORDS and is a count of the key's own two reads, never over persons (R-DA-16) | `{settlement}` |
| 1 · c | 15 | "the town's works" | "the town's force" | "Both … and …" | "are set down … as standing" — the formula, third spelling | `{settlement}` |
| 2 · row | 11 | "the works" | "the soldiers" | "together" — the shipped word, kept verbatim | "A stranger at {settlement} sees" — the eye, which may see and nothing else (W27) | `{settlement}` |
| 2 · a | 15 | "the works" (echoed for the thread) | "the soldiers" | "with the works" | "What a stranger sees at {settlement} is" — the eye in a cleft | `{settlement}` |
| 2 · b | 16 | "the works the town has built" | "the town's force" | "both … and …" | "a stranger sees" | `{settlement}` |
| 2 · c | 16 | "the works standing" | "the town's muster" | "Standing with them" | "A stranger reaches {settlement} and finds" — arrival, the visitor's own frame; two sentences, the second carrying "standing" and "them" forward (R-i, the thread at k = 0) | `{settlement}` |
| 3 · row | 12 | "the works" | "soldiers" | "with the works" | "The town has …" — the street's subject stating its own standing plainly | none |
| 3 · a | 11 | "the works" | "Soldiers" | "stand with them" | two short copular clauses, the street's idiom | none |
| 3 · b | 12 | "its works" / "those works" | "the town's force" | "With those works stands" | "The town keeps its works" — the naming form the taste kept; two sentences, the second carrying "works" forward (R-i) | none |
| 3 · c | 11 | "the works" | "the muster" | "besides" | "What the town has is" — the street's cleft | none |

**Provenance: ZERO citations in twelve faces.** The card prints `source: muster · standing LICENSED`, but the holder resolves `null` on this row (a garrison town has men under arms and no roll of them, OV-5), none of S3's three reasons is present (no two accounts, no interested count, no keeper who is a power), and the `[ledger]` angle is a STANDPOINT that licenses no record noun (W24). So no face says "the roll", "the books", "the record shows", or "according to" (W7, R-vi; §24's ceiling is a ceiling, and the exemplars with raw text cite at zero per 786 sentences).

## 3. The pool's walls, checked face by face

- **Both reads in every face, with the conjunction** — no face is an inventory line; no face states one body alone (ADDENDUM 7 rule 3, the skeleton's density floor).
- **One force object per face** (`objectClass force`): `the soldiers` · `Soldiers` · `the town's muster` · `the town's force` · `the muster`, never two spellings in one face.
- **Silence on a militia** in all twelve faces: neither asserted nor denied (the reader never consults `militia` on this branch).
- **The four faces of a variant differ in CONSTRUCTION**, not vocabulary alone (W4, ADDENDUM 7 rule 4): vid 1 runs works-first coordinate · soldiers-first with inversion · an enumerated colon pair · a `Both … and …` coordination under one predicate; vid 2 runs the plain seeing sentence · a cleft · a `both … and …` inside the seeing frame · a two-sentence arrival with an inverted second; vid 3 runs the have-frame · two short copular clauses · a two-sentence keep-frame with an inverted second · a cleft.
- **A11 spread:** the three variants' first two words are "The works" · "A stranger" · "The town" — no two alike, and none is the settlement token.
- **T-F8:** no face opens on `{settlement}`; the two faces that begin with "At {settlement}" open on the capital "At", not on the slot.
- **Sentence counts:** vid 1 four one-sentence faces; vid 2 three of one and one of two; vid 3 three of one and one of two.
- **Closes, varied in kind and never a verdict:** a body ("the soldiers", "the town's muster", "the town's force", "the muster"), an object ("the works", "what the town has built"), a condition ("as standing"). No face closes on a rating, a maxim, a hook or a cause. One face closes on a pronoun ("with them", vid 3 face a) and it is a sub-face, never the spine's own row, since a modifier may follow the row (R-DA-04's pronoun-closer ceiling; k = 2).
- **The thread (R-i, §1.4.1):** each two-sentence face carries a noun forward from its first sentence ("the works … those works"; "standing … Standing with them"); every one-sentence face hands the works or the soldiers forward for the modifiers that may follow, and none closes on an abstraction.
- **Hard walls, all twelve faces:** no em dash, no exclamation, no digit, no `which`-clause, no question, no first or second person, no figure, no sense verb on an abstraction, no intent for an inanimate or collective thing, no future indicative, no totality over persons, no belief frame, no count of men, no season or duration, no cause, no badge or posture word, no pay, wages, upkeep or keeping word for the military gate (DS-DEF-11's cell), no strength or thinning of the force (DS-DEF-5's cell), no siege, raid, assault, attempt, attacker or stores (W17; the Disasters row's cell), no material or material source (W11).
- **The same page (C7, A1/A11):** the Beasts rows on this tab name the same two bodies; this pool spells them "the works" and "the soldiers", which is what those rows can also spell them, and contradicts neither. Nothing here touches pay or morale (the Economic Survival row) or the stores (the Disasters row) or the court and the gaol (Internal Security).

## 4. Refusals

**None.** All three variants were made lawful under the card, the two ratified tables and the bars W1–W27; no variant is banked as a refusal row, and no face was written that a law refuses.

Two fences the skeleton left open are recorded here as taken, not decided:
1. **The force's name (skeleton fence 1, open row 1).** `the garrison` is refused in every face because the key also fires on `Barracks` towns where no `Garrison` row resolves (W12). If CAR 8b-W-2 mints a derived force-name fill from the resolved garrison-bucket row, a face may take the specific noun through the fill and nothing else in this pool moves.
2. **"professional(s)" (skeleton fence 3).** Not used. If the chair rules the label's own adjective lawful at its ENGINE meaning, vid 1's shipped "professionals" returns as a candidate face word and nothing else moves.
3. **The capability joint (skeleton fence 2).** Refused throughout: no face predicates holding, manning, defending or a cost on either body. Only the key's bare conjunction is stated. If the chair rules the capability clause lawful for this block, these faces stay lawful as they stand and a sharper joint becomes available to a refinement round.

Status: COMPLETE — three variants, twelve faces, notes and refusals all written.
