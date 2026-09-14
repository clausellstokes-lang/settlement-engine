# DS-DEF-1 · `readiness CRITICAL` · REWRITE draft round 2
Seat: Opus 5 (Fable-unvalidated) · block `DS-DEF-1` · role `spine` · 3 variants in, 3 variants out, 12 faces (4 per variant).
Paste-ready: the three numbered rows below are the COMPLETE replacement for the pool's three variant rows under the bold pool line `**readiness `CRITICAL`**` (`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:2562-2574`). Same vids, same order, none added, none removed, none merged. The pool declares no typed lines (ROLE, READS, RELATION, ATTACH, FORM, MOVE) in the annex today; none is touched and none is repeated here.

1. `[ledger]` Readiness at {settlement} stands at the floor.
   - `[face]` What {settlement} holds to its defense comes to nothing.
   - `[face]` Graded for readiness, {settlement} takes the lowest mark the scale carries.
   - `[face]` Undefended is what {settlement} amounts to.
2. `[street]` The town has no defense at all.
   - `[face]` Nothing the town keeps answers as a defense.
   - `[face]` Whatever else the town holds, it holds no defense.
   - `[face]` The town's defense runs to nothing.
3. `[visitor]` A stranger comes to the middle of {settlement} and meets no defense on the way.
   - `[face]` The stranger who reaches {settlement} passes no defense.
   - `[face]` What a stranger walks into at {settlement} is a town with no defense.
   - `[face]` Nothing at {settlement} stands in a stranger's way.

--- NOTES

## 0. THE GATE'S FEEDBACK, ANSWERED MEASURE BY MEASURE

The gate returned ONE failing owned measure on round 1:

| the measure | round 1 | what round 2 does | round 2, reasoned |
|---|---|---|---|
| band depth · `shapes.participialOpenerRate` (over) = **28.24** band-widths on **1 of 12** faces (band DEPTH at most 1.75 on every face) | the one face is variant **3, face 1**: *Arriving at {settlement}, a stranger finds the town undefended.* — `proseFingerprint.js:141` counts a sentence whose FIRST word ends in `-ing` and is not on the `NOT_PARTICIPLES` list, so on a one-sentence face the rate is 1.0000 against a band top near 0.035 | that face, and only that face, is re-drawn: **The stranger who reaches {settlement} passes no defense.** Its first word is `The`; no face in the pool now opens on an `-ing` word | `participialOpenerRate` = **0.0000** on all twelve faces; the depth on this metric falls from 28.24 to 0 band-widths and the face's `exceeded` count falls from 1 to 0 |

**The measure is moved, and it is the only one that was failing.** The other eleven faces stood at `exceeded: 0` with `depthOk: true` and `budgetOk: true` at the face grain, so this round changes none of them: under §16.1 the PERFECTION CEILING is *a finding, never a rewrite trigger*, and under §21.3 an effort that swaps a lawful face for a differently lawful one buys nothing and risks a new failing state, which §21.2 forbids ("never a new one added"). Nothing else in the pool is touched: same three vids, same order, same tags, same slot sets, same claim.

**Two collateral readings, printed so they are not mistaken for drift.**
- **The participial FLOOR is not driven to zero.** R-DA-18 holds `participial 0.0117 (≤ 0.020)` as a floor of the register, not a prohibition; the pool keeps a participial opener in variant 1, face 2 (*Graded for readiness,*), which is a PAST participle and is not what `:141` counts (`/ing$/` on the first word). The failing shape was the `-ing` opener alone, and only the `-ing` opener is removed.
- **`wordsPerSentence.neighbourVariation` at the corpus grain rises, not falls.** The replaced face is eight words where it was nine, so the pool's twelve-face length string reads 7 · 9 · 11 · 6 / 7 · 8 · 9 · 6 / 15 · 8 · 13 · 8, and the burst measure computes 0.418 against round 1's 0.394 — the corpus grain's deepest reading (`neighbourVariation`, 0.326 band-widths UNDER, inside the 1.75 depth) moves toward its band rather than away. The corpus-grain BUDGET reading (11 of 13 exceeded) is not in the gate's `failing` list for any pool of this block and is not treated here as an owned measure; it is recorded so the next round does not discover it as new.

## A. The card, printed and read

`node scripts/prose-licence-card.mjs DS-DEF-1 'readiness CRITICAL'` returns: role **spine**; **reads** `scoreBand(readinessScore)` via `READINESS_ROW_POOL` in `defenseStateProse.js`; **predicate** `=== CRITICAL`; **bag** `{band: RESERVED, counterpart: proper, route: proper, settlement: proper}`, FILLED at this block's call sites: `{settlement}`; **relation** none (a spine takes no relation) and **attach** empty (a spine takes no attach set); **seat/form** not a seat-taker / `sentence`; **move** none declared; **angle** `ledger street visitor`; **echo** spine mounts 1 (tabs: defense); **covert** no; **source** `(none)` standing SOURCE-UNRESOLVED, so NO citation is licensed and a face naming a record holder is refused by arm A13; **may claim** that the reader `scoreBand(readinessScore)` selects the row `CRITICAL` of `READINESS_ROW_POOL`, as a STANDING fact of the record; **may NOT** a count, a cause, a season, a future, a standpoint, a second fact; **audience** player (no mark); **REFUSED COLUMNS, always** a totality over persons, an exemption from a duty, a named character and that character's fate, a theological claim.

The clause labels used below:
- **C1** — the card's `may claim` line, read with `reads` and `predicate`: the band this town returns for readiness is `CRITICAL`, the bottom of `scoreBand`'s four (`STRONG` / `ADEQUATE` / `WEAK` / `CRITICAL`, block STATE-KEY at `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:2504-2508`). This is a STANDING fact, one claim, and it is the ONLY claim this card licenses.
- **C2** — the card's `bag` line: `{settlement}`, `proper`, FILLED at this block's call sites.
- **C3** — the card's `angle` line: `ledger`, `street`, `visitor`; each numbered row keeps its own tag unchanged.
- **C4** — the card's `seat/form` line: `sentence`, so every row and every face is sentence-form and opens on a capital that is not a `proper`-typed slot (ARCH §2.5 seam contract; T-F8).

**The band's content, and its fence.** `CRITICAL` on `scoreBand(readinessScore)` is a SUMMARY measure. The block's own PROVENANCE + FENCE (`:2510-2516`) states that the readiness word "is a summary of the five arms and asserts nothing about any one of them", and routes `guardEffectivenessDesc` — the watch — to `DS-DEF-3`. So the licensed register of every wording here is the town's defense TAKEN WHOLE, and no wording in this packet names a wall, a watch, a garrison, a militia, a muster, a gate or a charter. The replacement face obeys the same fence: *passes no defense* is the summary band rendered at the visitor's angle, and says nothing about who does or does not stop a stranger.

## B. Licence, face by face — the clause behind every claim

Every one of the twelve wordings asserts exactly ONE claim, C1, and nothing else; the four faces of each variant are therefore claim-equal to each other (arm A6 read across the faces, not back to the shipped sentence). No face asserts a count, a cause, a season, a future, a standpoint, a second fact, a totality over persons, an exemption, a named character or a theological claim.

| # | face | the claim it makes | licensing clause |
|---|---|---|---|
| 1 | row `[ledger]` | readiness for this town stands at the bottom of the grade | **C1**; slot `{settlement}` by **C2**; tag by **C3**; sentence form by **C4** |
| 1 | f1 | same claim, worded as the accounting of what the town holds to its defense | **C1**; **C2**; **C3** |
| 1 | f2 | same claim, worded as the grading itself; "the scale" is `scoreBand`'s own four-band ladder, named by the card's **reads** line and by nothing outside it | **C1** + **reads**; **C2**; **C3** |
| 1 | f3 | same claim, worded flat and inverted | **C1**; **C2**; **C3** |
| 2 | row `[street]` | the town's defense stands at nothing | **C1**; no slot (the parent carries none); **C3**; **C4** |
| 2 | f1 | same claim, worded as what the town keeps | **C1**; no slot; **C3** |
| 2 | f2 | same claim, worded as a concession | **C1**; no slot; **C3** |
| 2 | f3 | same claim, worded as a reckoning | **C1**; no slot; **C3** |
| 3 | row `[visitor]` | same claim, framed at arrival | **C1**, the arrival framing by **C3** (`visitor` is a declared angle of this pool); **C2**; **C4** |
| 3 | f1 **(re-drawn this round)** | same claim, framed at arrival, the arrival carried in a restrictive relative on the subject and the band in one blunt transitive predicate | **C1** + **C3**; **C2**; sentence form and the non-slot opener by **C4** |
| 3 | f2 | same claim, framed at arrival, fronted relative | **C1** + **C3**; **C2** |
| 3 | f3 | same claim, framed at arrival, with the town's defense as the absent subject | **C1** + **C3**; **C2** |

Nothing in the table is licensed by a second field, because the card declares none: `relation` is empty, `attach` is empty, `move` is undeclared, `source` is unresolved. Variant 3's relative clause is `who`, never `which` (wall 6; `shapes.whichTailRate` counts `, which` and reads 0.0000 here), and it carries the same arrival frame the numbered row carries — it is the angle's frame, not a second fact.

## C. What each old sentence claimed, what was kept, and what was dropped

Carried from round 1 unchanged, because round 2 moves a SHAPE and no claim. Dropping the unlicensed claim is the rewrite's purpose; the shipped breach is the corpus's known state. Nothing is added anywhere.

**Variant 1 `[ledger]`, shipped:** "{settlement} is effectively undefended. There is no arrangement here that would slow a serious attempt on the town by more than the time it takes to walk in."
- KEPT: C1, carried by "effectively undefended".
- DROPPED, the whole second sentence, for four reasons at once: (a) it is a SECOND SENTENCE that glosses the first and asserts no second field — the **MEANING** non-move (MOVE-GRAMMAR §1.3) and R-DA-03/R-DA-12's second-sentence-summary figure, which stands at 0.000; (b) "no arrangement here" asserts over every one of the five arms, which the block's own fence at `:2510-2516` forbids the readiness word from doing; (c) "would slow … by more than the time it takes to walk in" is an invented measurement of an attempt's progress — a count and a particular no field holds (card **may NOT**: a count; fault 24, hollow specificity); (d) the projection of what an attempt would meet is a capacity outcome beyond the summary band (card **may NOT**: a second fact, a future).
- ALSO CORRECTED IN FORM, no claim moved: the expletive opener "There is" (R-DA-07's `thereIsOpenerRate`), and the row opening on the `{settlement}` slot (ARCH §2.5's seam contract; MOVE-GRAMMAR §1.4 wall 10).

**Variant 2 `[street]`, shipped:** "The town knows perfectly well what it could not survive, and the knowledge shapes what it will and will not provoke."
- KEPT: C1, which the shipped sentence carried only obliquely inside "what it could not survive"; it is now stated as the fact it is.
- DROPPED: (a) "the town knows perfectly well" — a BELIEF FRAME and a STANDPOINT (card **may NOT**: a standpoint; R-DA-13's belief-frame floor, EXECUTABLE now and standing at zero), and a totality over persons in the bargain (REFUSED COLUMNS); (b) "the knowledge shapes what it will and will not provoke" — a SECOND FACT joined by a CAUSE (card **may NOT**: a cause, a second fact), and a claim about the town's conduct that no field on this card holds; (c) "will and will not provoke" reads as a bare future of the town's acts (A2, THE PROMISE: state never fate).

**Variant 3 `[visitor]`, shipped:** "A stranger reaches the centre of {settlement} without being stopped, challenged or counted by anybody at all."
- KEPT: C1, framed at arrival under the card's `visitor` angle.
- DROPPED: (a) "by anybody at all" — a TOTALITY OVER PERSONS, a refused column always; (b) "counted" — an INSTITUTION assertion about who counts, licensed only by a row of the institution table (MOVE-GRAMMAR §1.2 row 5; CLERK-LAWS §1.3), which this card does not carry; (c) "stopped, challenged" as the acts of the watch — the block's own fence routes `guardEffectivenessDesc` to `DS-DEF-3` (`:2515-2516`), so this block may not say what the watch does or fails to do; (d) the habitual triad "stopped, challenged or counted" (R-DA-10: two items or four, never habitually three; §16 (6): the tricolon is a machine signature measured at the exemplars' rate).
- The shipped verb *reaches* returns in this round's face 1, where it carries the arrival and nothing else; the three unlicensed claims stay dropped.

## D. The walls, checked over all twelve wordings

Zero em dashes · zero exclamation marks · zero question marks · zero digits and zero percents · zero `, which` clauses · zero first or second person · zero citations and no record holder named anywhere (**source** none, standing SOURCE-UNRESOLVED; arm A13; MOVE-GRAMMAR §4.4.3 — "the scale" in 1 f2 is the reader named by the card's own **reads** line, not a holder of a record) · zero bare future indicatives and zero subjunctive edges · zero figures, no sense verb on an abstraction, no inanimate intent · zero evaluative adjectives on the place · zero gendered pronouns (NL-4 — the re-drawn face names the stranger and takes no pronoun for it) · no named character, no exemption, no theological claim. Spelling follows the shipped block's own form, **defense** (R-DA-22, one name form; `:2545`, `:2560`).

**Form.** Each numbered row carries exactly ONE bracketed angle tag, its own, unchanged: 1 `[ledger]` · 2 `[street]` · 3 `[visitor]`. No `[plain]` marker appears anywhere; it belongs to modifier rows and the projector refuses it on a spine. Face sub-rows are written to `FACE_ROW_RE` (`scripts/lib/dossier-annex-grammar.mjs:107`).

**Slots.** The parent's slot set is preserved per variant, as ARCH §2.5 requires of a face: variant 1 carries `{settlement}` in all four wordings, variant 3 carries `{settlement}` in all four — the re-drawn face included — and variant 2 carries no slot in any of its four. `{band}` is RESERVED and unused; `{counterpart}` and `{route}` are not filled at this block's call sites and are unused. No row and no face opens on `{settlement}` (T-F8).

## E. Spread, close and thread

**Word counts.** 1: 7 · 9 · 11 · 6. 2: 7 · 8 · 9 · 6. 3: 15 · 8 · 13 · 8. Range 6 to 15; the short line exists four times over (R-DA-05's `< 8 words` floor; R-DA-06's 0.030).

**First words within variant 3** — `A` / `The` / `What` / `Nothing` — remain four distinct openers, so the pool's `sameOpenerPairs` stays at 0 in all three variants. This is why the re-drawn face does not open on `A stranger`, which would have matched the numbered row's opener and traded one failing measure for another.

**Close kinds** vary across R-DA-04's closed set: conditions (`the floor`, `undefended`, `no defense at all`), absences (`comes to nothing`, `runs to nothing`, `no defense`), objects (`the scale carries`, `a defense`, `a stranger's way`, `on the way`). No wording closes on a pronoun (`closers.pronounRate` 0.0000).

**Head nouns disperse** across *readiness · defense · the town · a stranger · the scale · the mark*, rather than leaning on one pet word (R-DA-10's rationed-word ceiling).

**Faces are not paraphrases of their siblings.** Variant 3 now runs a fifteen-word arrival period (*comes to the middle … meets no defense on the way*) · an eight-word restrictive-relative subject with one transitive verb (*The stranger who reaches … passes no defense*) · a thirteen-word fronted relative (*What a stranger walks into …*) · an eight-word inverted absence (*Nothing at … stands in a stranger's way*). The four verbs are *comes/meets · reaches/passes · walks into · stands*, and no two faces share a predicate. Variants 1 and 2 are unchanged and were already spread on this measure (round 1 §E).

**THE THREAD** (owner, 2026-09-08 ~21:4x; MOVE-GRAMMAR §1.4.1). This pool is a SPINE and is composed FIRST, so no wording here depends on a preceding sentence, and each must stand alone from a cold start — which the unweighted seeded roll requires and which every one of the twelve does. What the spine owes the passage is a noun the next sentence can pick up: the re-drawn face ends holding out *defense* and carries *{settlement}* and *the stranger* besides, so a terrain or strategic-value modifier seated after it has the same thread to take that the other eleven hand forward. No wording turns its subject over mid-passage, because each is one sentence carrying one claim.

## F. Two judgment calls, carried forward from round 1, still open

**(i) No subjunctive edge is written in this pool.** R-DA-07 and MOVE-GRAMMAR §1.4 wall 2 permit an edge in the subjunctive, and the shipped variant 1 reached for one (*would slow a serious attempt*). This packet writes none, because at this band every available edge projects what an attempt would meet, and that is a capacity outcome the card's **may NOT** line bars as a second fact and a future. If the chair rules that a bare subjunctive restatement of the band is C1 in the mood the rules require for edges, the `[visitor]` and `[street]` variants have room for one apiece; this packet does not spend it.

**(ii) The `[visitor]` angle is realised WITH the stranger.** The card declares `angle: ledger street visitor`, and every shipped `[visitor]` row in this block realises the angle with a stranger arriving. This packet keeps that shape, in the re-drawn face as in the other three: the stranger performs no interior act, is assigned no reaction, is given no perception of an abstraction and is never a named or gendered person, so what is asserted remains C1 and the stranger is the frame's grammatical subject, not an asserted standpoint (NL-1: the stage licenses the claim, never the shape). **This still diverges from the sibling `readiness ADEQUATE` packet in this same block, which removed the observer** on the reading that any observer form is a standpoint under R-DA-01. The two packets cannot both be right and the difference is visible in one block, so it stays one question for the chair rather than two decisions. **If the chair rules the observer out, variant 3's four faces are re-drawn in this block's outward, thing-first register; the variant is not refused and nothing is banked** — the shape changes, the claim does not.

## G. REFUSALS

**No variant refusal. Three of three are written lawful under the card; the banked count for this pool stands at zero, as it did after round 1 (§22 (d): the banked count only ever falls).**

Two POOL-level laws this pool cannot meet by any wording, carried from round 1 so they are not re-found as wording faults:

- **The level-1 grammar set (MOVE-GRAMMAR §2.1) cannot be satisfied.** A pool of k variants is to carry min(k, 8) DISTINCT level-1 grammars, at least two in any pool of two or more. This card resolves ONE reading, declares no relation, no attach set, no move and no source, and holds no second field, so V2 (needs a structural-consequence field), V3 (needs `none-exists`), V4 (needs a named object), V5 (needs an institution row), V6 (needs an unresolved state value), V7 (needs event provenance) and V8 (needs a `not-held` field with provenance) are all unlicensed here. All three variants are V1 `PRESENT`, and §3.1's own law applies — a member whose licensing field is null is not drawn and is not written empty. The pool's variation lives entirely in its angles and its wordings. This is the card's arithmetic, not a fault of the draft.
- **The shipped sentence-count spread (2 / 1 / 1) is not preserved; the pool is 1 / 1 / 1.** MOVE-GRAMMAR §3.4 says a rewrite may not spend a pool's spread, and A11's "where they differed in sentence count they keep differing" is that spread's sentence-count limb. It cannot be held here: variant 1's second sentence carried nothing but unlicensed claims (§C), and a lawful second sentence would need a second typed field, which the card does not hold; a second sentence restating C1 is the MEANING non-move at 0.000. B-CLAIM is a WALL (Part B §16 (1)) and the spread limb is a BAND (§16 (2)), so the wall takes it. Recorded, with its measurement: one sentence lost from one variant, zero variants lost, zero faces lost, twelve faces standing. Under §22 this is editing, not trimming — the slot, the vid and the order are untouched, and the shipped wording survives in the annex history.
