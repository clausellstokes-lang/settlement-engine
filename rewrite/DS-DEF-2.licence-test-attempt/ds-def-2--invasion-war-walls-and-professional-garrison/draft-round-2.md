# DS-DEF-2 · `Invasion & War`: walls AND professional garrison — REWRITE, draft round 2

Seat: Opus 5 (Fable-unvalidated), writer for the Fable chair · block DS-DEF-2 · role SPINE · 3 variants in, 3 variants out, 12 faces (4 per variant: the numbered row plus three `[face]` sub-rows).
Paste the block below under the pool's bold heading, in place of the pool's three existing numbered rows. The typed lines (ROLE / READS / RELATION / ATTACH / FORM / MOVE) are untouched and are not repeated here.
Round 2 answers the gate's two owned measures and moves BOTH of them; ten of the twelve faces are round 1's, byte for byte, because the gate reported no failing measure on them and §21.2 forbids adding a failing state while removing one.
Status: COMPLETE — three variants rewritten in place, twelve faces, zero refusals.

1. `[ledger]` The works at {settlement} are entered as standing, and so are the soldiers.
   - `[face]` Soldiers are carried standing at {settlement}, and with them the works the town has built.
   - `[face]` Two things are entered at {settlement} and entered together, the works and the town's muster.
   - `[face]` Both the town's works and the town's force are set down at {settlement} as standing.
2. `[visitor]` A stranger at {settlement} sees the works and the soldiers together.
   - `[face]` What a stranger sees at {settlement} is the works and, with the works, the soldiers.
   - `[face]` At {settlement} a stranger sees both the town's force and the works the town has built.
   - `[face]` A stranger reaches {settlement} and finds the works standing. The town's muster stands with the works.
3. `[street]` The town has the works, and with the works it has soldiers.
   - `[face]` Soldiers are in the town, and the works stand with them.
   - `[face]` The town keeps its works. With those works stands the town's force.
   - `[face]` What the town has is the works, and the muster besides.

--- NOTES

## 0. THE GATE'S FEEDBACK ON ROUND 1, ANSWERED MEASURE BY MEASURE (both owned measures MOVED; the round is not dry)

The gate returned exactly two failing measures, each on ONE face of twelve, both of the family `band depth` (the ENTRY grain's ceiling, §16.2: DEPTH at most 1.75 band-widths per face). Neither is a wall; each is a soft rule whose depth ran past the entry ceiling on a single face, so the cure is per-face and surgical. The other ten faces are untouched by design: §21.2 requires a round to remove failing states and add none, and every edit to a passing face is a fresh draw against twenty-one rate metrics.

**Measure 1 · `punctuation.colonRate` (over) = 6.987 band-widths on 1 of 12 faces.**
- The face: vid 1 face b, round 1 — *"Two things are entered at {settlement} and entered together: the works, and the town's muster."* One colon in one sentence of fifteen words is a rate the exemplar band cannot hold at the face grain (the register's own joint distribution, §1: the colon is a rationed permission, and one instance on a single short face reads as a template, not a spend). No other face of the twelve carries a colon, which is why the gate counted 1 of 12.
- The cure: the colon is replaced by the appositive comma. **Round 2: "Two things are entered at {settlement} and entered together, the works and the town's muster."** `colonRate` on this face falls to zero, which is the rate on the other eleven faces and inside the band (the gate reported no `under` condition on those eleven, so zero is band-lawful for this metric at this grain).
- What did NOT change: the claim set (identical, word for word, on both reads and the conjunction), the slot set (`{settlement}`, once, never as the opener), the count-in-words frame `Two things are entered … and entered together` (the construction that distinguishes this face from its three siblings — an enumerated pair under one predicate, W4's construction contract kept), the force spelling (`the town's muster`, one force object), and the word count (15, unchanged). The enumeration survives as an enumeration; only its punctuation moved. This is not a density trade (§21.4): no fact is stated more plainly, no idiom is smoothed, and the change has a law behind it — the entry-grain depth ceiling of §16.2.

**Measure 2 · `shapes.participialOpenerRate` (over) = 13.62 band-widths on 1 of 12 faces.**
- The face: vid 2 face c, round 1 — *"A stranger reaches {settlement} and finds the works standing. Standing with them is the town's muster."* The second sentence opens on a participle (`Standing …`), and one participial opener across a two-sentence face is a rate of one in two sentences — the deepest exceedance in the set, and the machine-signature family §16 names (the shape, not the claim, is the tell). No other face opens on a participle: vid 3 face b's second sentence opens on a preposition (`With those works stands …`), which this metric does not count, and `Soldiers are carried standing …` opens on a noun.
- The cure: the inverted participial clause becomes a plain subject-first statement, and the pronoun `them` becomes the noun it carried, so the thread is carried by a NOUN rather than a pronoun and the face no longer closes on a pronoun (R-DA-04's pronoun-closer ceiling, which round 1 spent once already on vid 3 face a). **Round 2: "A stranger reaches {settlement} and finds the works standing. The town's muster stands with the works."** `participialOpenerRate` on this face falls to zero.
- What did NOT change: the claim set (the stranger sees; the works stand; the muster stands; the two together — identical), the slot set (`{settlement}`, once, not the opener), the two-sentence ARRIVAL construction that is this face's contract against its three one-sentence siblings (W4), the force spelling (`the town's muster`, one force object), the visitor's stance (the eye reaches and finds and does nothing else, W27), and the thread inside the face (R-i at k = 0: the second sentence carries `the works` forward from the first, now by the noun itself). Word count 15 → 16.
- Why not the obvious inversion (`With them stands the town's muster`): it cures the participle but lands the face on vid 3 face b's exact fronted-and-inverted rhythm, which trades a band exceedance for a sibling-distance finding — a new failing state, which §21.2 forbids.

**Measures the gate did NOT report, and which round 2 therefore does not touch:** no wall was breached in round 1 (no em dash, digit, exclamation, `which`-clause, question, second person, forecast, figure, or unlicensed claim), no refuter finding was returned, and no other of the twenty-one rate metrics was reported outside the entry band on any face. Ten faces are carried forward byte for byte.

## 1. The card every face is written against (printed read-only in laneRW-DEF2)

`LICENCE (block DS-DEF-2 · role spine · key Invasion & War: walls AND professional garrison)` —
**reads/predicate** `invasionRowSituation(walls, garrison, militia)` via `INVASION_ROW_POOL` in `defenseStateProse.js`, `=== walls, professional garrison`; **bag** `{band: RESERVED, route: proper, settlement: proper}`, FILLED here `{settlement}`; **relation** none (a spine takes none); **seat/form** sentence; **move** none declared; **angle** `ledger street visitor`; **source** `muster · standing LICENSED`, holder `null` on this row; **may claim** that the reader selects the row `walls, professional garrison`, as a STANDING fact of the record; **may NOT** a count, a cause, a season, a future, a standpoint, a second fact, another civic object of the class `force`; **audience** player (no mark).

The key is ONE keyed condition of TWO inputs, `walls === true` AND `garrison === true` (skeleton §0.2, chair R-v). The third input `militia` is never consulted on this branch, so every face is SILENT on a militia: it is neither asserted nor denied. Every face therefore states exactly two reads and their conjunction, and nothing else.

**The two lawful spellings this draft uses, and why.** The works read is spelled `the works` / `what the town has built` / `the town's works` — never `a line`, `a perimeter`, `an enclosure` (continuity NOT ENTAILED, entailment D-6: false of a `Gates (if walled)` town and of a post-ruin `Citadel`), never a material (W11, `{defmaterial}` unminted), never a height, a gate, a walkway, a manning or a condition. **The class word `the wall` is declined in every face** (the skeleton's §0.2 recommendation at its strictest: the key fires at town through `Gates (if walled)` and at city through `Citadel`, and one string is written for every firing). The force read is spelled `the soldiers` / `Soldiers` / `the town's force` / `the town's muster` / `the muster` — the person-plural and class words ratified at ADDENDUM 13 A.5 and printed on the referent table's `soldiers` row — never `the garrison` baked (W12: the key also fires on `Barracks` towns where no `Garrison` row resolves), never `the militia`, `the watch` (W13), `the guard` (struck), `the men on the wall` (struck). **`professional` is not used as an adjective in any face** (skeleton fence 3: the label's engine meaning is "the garrison bucket, not the militia bucket"; the dictionary sense is entailed of a `Garrison` row and not of a `Barracks`); the discriminator rides on `the soldiers` and on `the muster`, the paid military's own class words. ONE force spelling per face (the card's `objectClass force` refuses a second object of the class; the projector's class guard cannot tell two force nouns apart, OV-25).

All three variants realise **V1 PRESENT** (skeleton §8: the only level-1 member this card licenses — V2 needs a structural-consequence field, V3/V8 a `none-exists` or `not-held` field, V4 a named-object field, V5 an institution row, V6 an unresolved value; none is on the card). The spread the census's `grammars: 2` asks for is carried by the ORDER of the two reads, the sentence count, and the construction, as §8 directs. Round 2 changes neither grammar nor order on any face.

## 2. Per variant: the claims kept, the claims dropped (unchanged from round 1; restated so this file stands alone)

**vid 1 `[ledger]`** — shipped: *"{settlement} has a line and professionals to hold it, which is real deterrence against raiding and against a conventional assault; it is not a posture rated for a long siege without stores behind it."*
- KEPT (licensed): the town has the works (`walls === true`); the soldiers stand (`garrison === true`); the two on one row (the key's conjunction).
- DROPPED: *a line* — continuity NOT ENTAILED (D-6, W15); the substance is kept as `the works`. *to hold it* — a manning and a purpose no field records, and a relation between two BODY reads that no field computes (D-3, D-7, W23 by shape; ADDENDUM 8 ruling 2). *which is real deterrence* — a VERDICT (MOVE-GRAMMAR §1.3), a cause (the card's may-NOT), and a `which`-clause (a hard wall). *against raiding and against a conventional assault* — an event class no field records and a classification the engine does not model (W17 by shape; the engine's chrome at `threatAssessment.js:115` is not a licence, OW-20). *a posture rated* — an AGGREGATE word and a rating on a BODY read (W20, D-22). *a long siege* — no siege field, a hypothetical in the present indicative, a duration (A-24/W17; the card's "a season"). *without stores behind it* — a second fact of another cell (the Disasters row on the same tab; T-F12) and a same-page contradiction risk beside a `granary AND hospital` row (C7). The opener `{settlement}` is not carried into any face (T-F8, ARCH §2.5; a cure, not a regression).
- The lawful residue kept as rhythm, not as words: the `has … and …` conjunction shape (face c carries it as `Both … and …`; the row and face a as the coordinate `and so are` / `and with them`; face b as the count frame).

**vid 2 `[visitor]`** — shipped: *"A stranger sizing {settlement} up sees the two things that matter together (the wall and the men who belong to it) and revises what an attempt would cost."*
- KEPT (licensed): a stranger SEES (the visitor's eye, W27); the works; the soldiers; TOGETHER (the key's conjunction in one word — kept verbatim in the numbered row).
- DROPPED: *sizing {settlement} up* — the eye appraises (W27: it may see, never act or decide). *the two things that matter* — a standpoint and a ranking (W20); the count in words survives lawfully in vid 1 face b, the "that matter" does not. *who belong to it* — a relation between the two bodies, a manning by another route, and a possessive binding the men to the wall (W1, W23). *revises what an attempt would cost* — the stranger decides, a hypothetical assault, and the deterrence claim by another door (W17, W27; the card's may-NOT "a future", "a cause").

**vid 3 `[street]`** — shipped: *"The town believes it could be held, and the belief is founded on something rather than on hope."*
- KEPT (licensed): only the frame `The town` as the street's subject (the town is the holder of its own roster, and "the town has / keeps …" states the presence read in the naming form).
- DROPPED: *believes* — a belief frame and a fused collective agent (W22, W23; D-F16/D-F18 by shape). *could be held* — a manning and a hypothetical outcome (A-24/W17). *founded on something* — a cause, and the hedged non-statement standing in for the two bodies (fault 29). *rather than on hope* — a contrast whose rejected alternative names no sibling key or band, and a feeling (R-DA-02; the FEELING non-move).
- This variant's floor RISES: the shipped line names NEITHER read, and every face here states both at the street's stance. No face carries `{settlement}` — the parent's slot set is empty (ARCH §2.5).

## 3. Per face: which card clause licenses each claim

Every face carries the SAME claim set, so arm A6 reads across the faces and finds them claim-equal: (i) the works stand — the card's `may claim`, the `walls === true` half of the predicate, layer BODY; (ii) the soldiers stand — the card's `may claim`, the `garrison === true` half, layer BODY; (iii) the two on one row — the key's own conjunction (`invasionRowSituation` returns this row only when both are true), never a relation, a holding or a cause. The table names the words that carry each half and the stance word that carries the angle. `{settlement}` appears exactly once in every face of vids 1 and 2 and in no face of vid 3, matching each parent's slot set (ARCH §2.5). The two rows marked **R2** are the cured faces.

| vid · face | words | the works half (card `may claim`, `walls`) | the force half (card `may claim`, `garrison`) | the conjunction | the angle's own carrier | slots |
|---|---|---|---|---|---|---|
| 1 · row | 13 | "The works at {settlement}" | "the soldiers" | "and so are" (both entered on one row) | "are entered as standing" — the office's formula, R-vi/W7; no record noun, no citation (W24) | `{settlement}` |
| 1 · a | 15 | "the works the town has built" | "Soldiers" | "with them" (the skeleton's blessed conjunction phrase, order inverted) | "are carried standing" — the office's formula | `{settlement}` |
| 1 · b **R2** | 15 | "the works" | "the town's muster" | "entered together" plus the appositive pair | "Two things are entered" — the formula; the count is in WORDS and is a count of the key's own two reads, never over persons (R-DA-16) | `{settlement}` |
| 1 · c | 15 | "the town's works" | "the town's force" | "Both … and …" | "are set down … as standing" — the formula, third spelling | `{settlement}` |
| 2 · row | 11 | "the works" | "the soldiers" | "together" — the shipped word, kept verbatim | "A stranger at {settlement} sees" — the eye, which may see and nothing else (W27) | `{settlement}` |
| 2 · a | 15 | "the works" (echoed for the thread) | "the soldiers" | "with the works" | "What a stranger sees at {settlement} is" — the eye in a cleft | `{settlement}` |
| 2 · b | 16 | "the works the town has built" | "the town's force" | "both … and …" | "a stranger sees" | `{settlement}` |
| 2 · c **R2** | 16 | "the works standing" / "the works" | "The town's muster" | "stands with the works" | "A stranger reaches {settlement} and finds" — arrival, the visitor's own frame; two sentences, the second carrying the noun "the works" forward (R-i, the thread at k = 0) | `{settlement}` |
| 3 · row | 12 | "the works" | "soldiers" | "with the works" | "The town has …" — the street's subject stating its own standing plainly | none |
| 3 · a | 11 | "the works" | "Soldiers" | "stand with them" | two short copular clauses, the street's idiom | none |
| 3 · b | 12 | "its works" / "those works" | "the town's force" | "With those works stands" | "The town keeps its works" — the naming form the taste kept; two sentences, the second carrying "works" forward (R-i) | none |
| 3 · c | 11 | "the works" | "the muster" | "besides" | "What the town has is" — the street's cleft | none |

**Provenance: ZERO citations in twelve faces.** The card prints `source: muster · standing LICENSED`, but the holder resolves `null` on this row (a garrison town has men under arms and no roll of them, OV-5), none of S3's three reasons is present (no two accounts, no interested count, no keeper who is a power), and the `[ledger]` angle is a STANDPOINT that licenses no record noun (W24). So no face says "the roll", "the books", "the record shows", or "according to" (W7, R-vi; §24's ceiling is a ceiling, and the exemplars with raw text cite at zero per 786 sentences).

## 4. The pool's walls, checked face by face (re-checked whole after the two cures)

- **Both reads in every face, with the conjunction** — no face is an inventory line; no face states one body alone (ADDENDUM 7 rule 3, the skeleton's density floor).
- **One force object per face** (`objectClass force`): `the soldiers` · `Soldiers` · `the town's muster` · `the town's force` · `the muster`, never two spellings in one face. Face 2 · c names `the town's muster` once and repeats only the WORKS noun, so it carries one force object (the repeated noun is the thread, not a second object).
- **Silence on a militia** in all twelve faces: neither asserted nor denied (the reader never consults `militia` on this branch).
- **The four faces of a variant differ in CONSTRUCTION**, not vocabulary alone (W4, ADDENDUM 7 rule 4): vid 1 runs works-first coordinate · soldiers-first with inversion · a count frame with an appositive pair · a `Both … and …` coordination under one predicate; vid 2 runs the plain seeing sentence · a cleft · a `both … and …` inside the seeing frame · a two-sentence arrival whose second sentence is subject-first; vid 3 runs the have-frame · two short copular clauses · a two-sentence keep-frame with an inverted second · a cleft. Both cures kept their face's declared construction: b stayed the enumerated pair, c stayed the two-sentence arrival.
- **A11 spread:** the three variants' first two words are "The works" · "A stranger" · "The town" — no two alike, and none is the settlement token.
- **T-F8:** no face opens on `{settlement}`; the one face that begins "At {settlement}" opens on the capital "At", not on the slot.
- **Sentence counts:** vid 1 four one-sentence faces; vid 2 three of one and one of two; vid 3 three of one and one of two. Unchanged by round 2.
- **Openers, after the cure:** noun ("The works", "Soldiers", "Two things", "Both", "The town", "What", "A stranger"), preposition ("At", "With"). ZERO participial openers in twelve faces (round 1: one).
- **Punctuation, after the cure:** ZERO colons, zero semicolons, zero em dashes, zero exclamations, zero question marks, zero parentheses in twelve faces; the comma is the only internal mark (round 1: one colon).
- **Closes, varied in kind and never a verdict:** a body ("the soldiers", "the town's force", "the muster"), an object ("the works", "what the town has built"), a condition ("as standing", "together"). No face closes on a rating, a maxim, a hook or a cause. ONE face closes on a pronoun ("with them", vid 3 face a) and it is a sub-face, never a spine's numbered row, since a modifier may follow the row (R-DA-04's pronoun-closer ceiling; k = 2). Round 2 spends no second pronoun close: face 2 · c now lands on "the works".
- **The thread (R-i, §1.4.1):** each two-sentence face carries a NOUN forward from its first sentence ("its works … those works"; "the works standing … with the works"); every one-sentence face hands the works or the soldiers forward for the modifiers that may follow, and none closes on an abstraction.
- **Hard walls, all twelve faces:** no em dash, no exclamation, no digit, no `which`-clause, no question, no first or second person, no figure, no sense verb on an abstraction, no intent for an inanimate or collective thing, no future indicative, no totality over persons, no belief frame, no count of men, no season or duration, no cause, no badge or posture word, no pay, wages, upkeep or keeping word for the military gate (DS-DEF-11's cell), no strength or thinning of the force (DS-DEF-5's cell), no siege, raid, assault, attempt, attacker or stores (W17; the Disasters row's cell), no material or material source (W11).
- **The same page (C7, A1/A11):** the Beasts rows on this tab name the same two bodies and spell the wall read "the works" ("the works stand at the town", "the works standing"); this pool spells it the same way, as the referent law's rule 3 requires, and contradicts neither. Nothing here touches pay or morale (the Economic Survival row), the stores (the Disasters row), or the court and the gaol (Internal Security). The sibling row `walls with citizen militia` states a part-time force; this pool is silent on the militia and so cannot contradict it.

## 5. Refusals

**None.** All three variants were made lawful under the card, the two ratified tables and the bars W1–W27; no variant is banked as a refusal row, and no face was written that a law refuses. Round 2 adds no refusal and withdraws none: the two cured faces were lawful in claim before the cure and are lawful in claim after it, and the cure was to a soft rule's depth, never to a wall.

Three fences the skeleton left open are recorded here as taken, not decided (carried forward from round 1, unchanged):
1. **The force's name (skeleton fence 1, open row 1).** `the garrison` is refused in every face because the key also fires on `Barracks` towns where no `Garrison` row resolves (W12). If CAR 8b-W-2 mints a derived force-name fill from the resolved garrison-bucket row, a face may take the specific noun through the fill and nothing else in this pool moves.
2. **"professional(s)" (skeleton fence 3).** Not used. If the chair rules the label's own adjective lawful at its ENGINE meaning, vid 1's shipped "professionals" returns as a candidate face word and nothing else moves.
3. **The capability joint (skeleton fence 2).** Refused throughout: no face predicates holding, manning, defending or a cost on either body. Only the key's bare conjunction is stated. If the chair rules the capability clause lawful for this block, these faces stay lawful as they stand and a sharper joint becomes available to a refinement round.

## 6. Round 2's own record (for the gate and the sitting)

| | round 1 | round 2 |
|---|---|---|
| variants | 3 | 3 (same vids, same order, same angle tags, none added, none removed, none merged) |
| faces | 12 | 12 |
| faces changed | — | 2 (vid 1 face b; vid 2 face c) |
| faces carried byte for byte | — | 10 |
| `punctuation.colonRate` faces over band | 1 of 12 (depth 6.987) | 0 of 12 |
| `shapes.participialOpenerRate` faces over band | 1 of 12 (depth 13.62) | 0 of 12 |
| claims added or dropped | — | none: the claim set of every face is identical to round 1's, and round 1's to the licensed set of its shipped variant |
| refusals | 0 | 0 |

Both owned failing measures moved; neither cure touched a claim, a slot set, an angle tag, a declared construction, a sentence count or a force spelling. Status: COMPLETE.
