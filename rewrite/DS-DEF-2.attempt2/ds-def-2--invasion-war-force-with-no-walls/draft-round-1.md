Seat: Opus 5 — Fable-unvalidated. Block `DS-DEF-2` · pool key `Invasion & War: force with NO walls` · draft round 1.
Three variants in, three variants out; same vids, same order, same angle tags; three face sub-rows each; no `[plain]` marker anywhere.
The rows below are the complete replacement for the pool's variant rows, ready to paste under the pool's bold heading. The pool's typed lines are untouched and are not repeated.

1. `[ledger]` The garrison at {settlement} is professional. The town it belongs to is unwalled.
   - `[face]` Soldiers by trade are stationed at {settlement}, and no defensive work stands about the town.
   - `[face]` A standing company of professionals is kept at {settlement}. The town keeps no perimeter.
   - `[face]` Regulars are posted at {settlement}, and no wall stands.
2. `[street]` The town's defense is the people it keeps under arms, and no wall stands anywhere about the place.
   - `[face]` This place has soldiers and no wall.
   - `[face]` Here the defense is a body of soldiers, and the town has no wall.
   - `[face]` What defends the town is people, and nothing is built for the defense.
3. `[visitor]` Soldiers stand at {settlement}, and no line runs about the town.
   - `[face]` A force under arms belongs to {settlement}, and the town has no perimeter.
   - `[face]` People under arms are kept at {settlement}, and the town that keeps them has no wall.
   - `[face]` The armed force at {settlement} is posted in a town that has no wall at any point.

--- NOTES

**The card, as printed** (`node scripts/prose-licence-card.mjs DS-DEF-2 'Invasion & War: force with NO walls'`), with the clause labels used below:
- **C-READS** — `reads: invasionRowSituation(walls, garrison, militia)` (via `INVASION_ROW_POOL` in `defenseStateProse.js`); absent means no candidate.
- **C-PRED** — `predicate: … === no walls, professional garrison`.
- **C-MAY** — `may claim: that (=== no walls, professional garrison) holds, as a STANDING fact of the record`.
- **C-BAG** — `bag: {band: RESERVED, route: proper, settlement: proper}`, **FILLED at this block's call sites: {settlement}**.
- **C-ROLE** — `role spine` · `form sentence` · `move (none declared)` · `angle: ledger street visitor` · `relation: a spine takes no relation` · `attach: empty` · `echo: spine mounts 1 (defense tab)`.
- **C-NOT** — `may NOT: a count, a cause, a season, a future, a standpoint, a second fact`.
- **C-SRC** — `source: muster · standing LICENSED`; a citation is licensed **where the provenance budget allows**.
- **C-REFUSED** — always: a totality over persons; an exemption from a duty; a named character and that character's fate; a theological claim about a deity.
- **C-COVERT** — `covert: no`; `audience: player (no mark)`.

**The claim set every face carries, and nothing else.** C-READS returns one value, and the pool key is that value: **K1** a force under arms stands at the town, and **K2** the town has no wall. K1 and K2 are the two halves of one field's one value (C-PRED), so a face carrying both states one licensed claim in two strokes and does not engage C-NOT's second-fact bar; K2 is the ABSENCE move class (a) LACK, licensed by the predicate's own `no walls` half (MOVE-GRAMMAR §1.2 row 11), stated flat with no completing "but" (R-DA-02). **The professional grade of K1 is carried in variant 1 only**, because variant 1's shipped sentence is the only one that graded the force (*"a professional force"*); variants 2 and 3 said *people* and *soldiers*, and grading them would be adding a claim (§21–§23: never add). Nothing on this card licenses a rating of what the force can do, a siege, an attacker, a fight, or a reason, so none of the twelve wordings holds one.

**Per variant: what was kept, what was dropped, and under which law.**

| vid | the shipped sentence's claims | disposition |
|---|---|---|
| 1 `[ledger]` | (a) a professional force is kept; (b) no perimeter; (c) *it answers raiders well*; (d) *cannot hold a siege*; (e) *because there is nothing here to hold* | (a) KEPT as K1 with its grade, (b) KEPT as K2 (C-MAY on C-PRED's two halves). (c) DROPPED: a rating of a capability, licensed by no field on this card — `{band}` is RESERVED in C-BAG, so the block's own badge is not writable at this call site — and VERDICT/RATING is a move that does not exist (MOVE-GRAMMAR §1.3; CL-7 requires a typed rating field). (d) DROPPED: a second fact about a siege, barred by C-NOT and unlicensed by C-READS. (e) DROPPED: a cause, named in C-NOT outright. |
| 2 `[street]` | (a) the defense is people; (b) not works; (c) *people can be gone around* | (a) KEPT as K1 ungraded, (b) KEPT as K2. (c) DROPPED: a second fact — a capability of an unnamed attacker — barred by C-NOT; the *rather than* antithesis of (a)/(b) is dropped as a shape (R-DA-02: R1 measures 0.113 against a ≤ 0.020 band edge), the two halves written as plain coordination instead. |
| 3 `[visitor]` | (a) *a stranger sees*; (b) soldiers; (c) no line for them; (d) *and can see how that decides where any fight would happen* | (b) KEPT as K1 ungraded, (c) KEPT as K2. (a) DROPPED: a standpoint, named in C-NOT, and a per-entry FRAME / VANTAGE, which MOVE-GRAMMAR §1.3 lists among the moves that do not exist anywhere in the estate (the office's origin is declared once on the front matter — R-DA-01, fault 9 at document scale). (d) DROPPED: a second fact and a forecast about a fight that has not happened (C-NOT; A2, STATE never FATE). **The `[visitor]` tag stands unchanged and is realised as the town's outward fabric — what stands at the place and what does not — never as an assertion that anybody is looking.** |

**Face by face — the clause that licenses each claim, and the word count.**

*Variant 1 `[ledger]`, the record's own entry; the force graded, the institutional nouns.*
1. parent, 13 words — "The garrison … is professional" = K1 with C-PRED's `professional garrison` value; "The town it belongs to is unwalled" = K2 by C-PRED's `no walls` half. Two sentences, as the shipped variant had two (§3.4: a rewrite may not spend the pool's spread, and sentence count is part of it). THE THREAD: *it* carries the garrison forward into the second sentence. Slot: one `{settlement}`, C-BAG.
2. face, 15 words — "Soldiers by trade are stationed at {settlement}" = K1 graded in the trade idiom; "no defensive work stands about the town" = K2.
3. face, 14 words — "A standing company of professionals is kept at {settlement}" = K1 graded; "The town keeps no perimeter" = K2. Two sentences again; *the town* carries {settlement} forward.
4. face, 9 words — "Regulars are posted at {settlement}" = K1 graded (*regulars* is C-PRED's `professional` in the plainest available noun); "no wall stands" = K2, the shortest form of the lack.

*Variant 2 `[street]`, the town's own speech; the force ungraded, and no slot in any wording, exactly as the shipped row carried none (ARCH §2.5's face rule: a face's `{slot}` set may not differ from its parent's).*
1. parent, 18 words — "the people it keeps under arms" = K1 ungraded (C-MAY on C-PRED's positive half at the shipped row's own grain); "no wall stands anywhere about the place" = K2. *anywhere* quantifies over works, never over persons (C-REFUSED untouched).
2. face, 7 words — "This place has soldiers" = K1 ungraded; "and no wall" = K2. The pool's short line (R-DA-05's `< 8 words` floor: 1 of 12, 0.083 against ≥ 0.030).
3. face, 14 words — "a body of soldiers" = K1 ungraded, unquantified, no count (C-NOT's count bar); "the town has no wall" = K2.
4. face, 13 words — "What defends the town is people" = K1 ungraded; "nothing is built for the defense" = K2, scoped to the defense so that it claims no absence of any other fabric.

*Variant 3 `[visitor]`, the place's outward fabric; the force ungraded; no observer, no vantage.*
1. parent, 11 words — "Soldiers stand at {settlement}" = K1 ungraded; "no line runs about the town" = K2. *line* is the sibling key `walls AND professional garrison`'s own noun used in the negative from this key's own field, which is the field's content and not a restatement of the sibling's claim.
2. face, 13 words — "A force under arms belongs to {settlement}" = K1 ungraded (the force is the town's, which is C-PRED's content); "the town has no perimeter" = K2.
3. face, 16 words — "People under arms are kept at {settlement}" = K1 ungraded; "the town that keeps them has no wall" = K2, with *them* threading the force into the lack.
4. face, 17 words — "The armed force at {settlement} is posted" = K1 ungraded; "in a town that has no wall at any point" = K2. A defining *that* clause, never a `, which` tail (R-DA-03).

**Walls checked on every one of the twelve faces.** No em dash · no exclamation · no question · no digit, numeral or percent · no `which`-clause · no semicolon and no colon · no first or second person · no past tense and no future indicative (there is no event-provenance field on this pool, so the HISTORY move is absent by MOVE-GRAMMAR §1.2 row 2) · no existential opener (`There is` / `It is` at zero) · no figure, no sense verb on an abstraction, no inanimate intent · no named character and no fate · no deity · no exemption, no duty and no office beyond the garrison C-PRED returns · no count word and no band word (`{band}` is RESERVED, C-BAG) · no `{route}` · exactly one `{settlement}` in each wording of variants 1 and 3 and none in any wording of variant 2, so every face's slot set is identical to its parent's · **no wording opens on `{settlement}`**, the `proper`-typed slot (ARCH §2.5's seam contract, T-F8; the shipped `[ledger]` row opened on it and no longer does).

**Order walls (MOVE-GRAMMAR §1.4).** STATE precedes everything in all twelve (wall 1). **The LACK never opens a wording and never sits beside a second ABSENCE** (wall 3) — this is why every one of the twelve leads on the force and lets the missing work follow, and why no wording pairs *no wall* with a second absence. No CONTRAST is fronted and none closes more than one variant (wall 5): the *rather than* of the shipped `[street]` row is gone and the antithesis-shape count for the pool is zero. No `, which` tail and no third sentence (wall 6); every wording is one or two sentences, per A1. The settlement token opens nothing here (wall 10).

**Citation (C-SRC).** The source resolves — `muster · standing LICENSED` — and **no face names it, deliberately.** §24's ceiling admits one citation per unit and only for one of S3's three reasons; none holds here, because this pool states no count, carries no two disagreeing accounts, and holds no typed fact that the muster's keeper is a power. MOVE-GRAMMAR §4.4.3 adds that a citation on a fact whose holder is the office itself is a finding. Zero is the lawful reading, not an omission.

**Siblings (arms A1 and A11), neither restated nor contradicted.** No wording asserts a wall (`walls AND professional garrison`, `walls with citizen militia`, `walls with NO force`), none denies a militia (`militia only` — `militia` is not tested at this cell, so no *only*, *whole* or *all* is written of the force), and none says the town has nothing (`neither walls nor force`). **No terrain word is written** — no *open*, no *level*, no *ground*, no *country* — because `DS-DEF-1`'s `terrain EXPOSED` and `terrain FAVOURABLE to the defender` own that fact on the same tab. The nearest neighbour inside this block is `Beasts & Monsters: frontier, force without a perimeter`, whose shipped rows carry *"no wall for them to stand on"* and *"whatever comes chooses where the fighting happens"*; no wording here uses either idiom, and the fight-and-attacker material is dropped outright as unlicensed.

**The thread (owner, 2026-09-08 ~21:4x).** This pool is the SPINE, so it leads the composed passage and hands a noun forward rather than picking one up. Every wording closes on a spine noun a modifier can carry — the town, the wall, the perimeter, the defense, the place — and none closes on a pronoun (R-DA-04: pronoun closers 0 of 12, against the register's 0.1335 and the ≤ 0.055 band edge). In the two-sentence wordings the second sentence carries a noun forward: *garrison → it*, *{settlement} → the town*. Each wording reads whole on its own, so it stands wherever the composer seats a modifier after it.

**Measured, and reported as a distance (§16's band channel), not cured.** Word counts are 13 · 15 · 14 · 9 | 18 · 7 · 14 · 13 | 11 · 13 · 16 · 17; mean 13.33, **within-pool sd 3.04 population and 3.17 sample, against R-DA-05's ≥ 4.0 floor** — one band-widthless direction figure missed by roughly a fifth. The cause is stated rather than padded: the shipped wordings carried their length in the unlicensed second facts (the siege, the rating, the cause, the fight), and every lawful sentence here says the same two facts. Padding a face to raise the sd would either add a claim or make a lawful line plainer with no law behind the change, which §21.4 names as the regression. Reported for the refiner and the walker; one wording exceeds the short-line floor and none exceeds thirty words.

**Refusals: none.** All three variants were made lawful under the card; no variant is banked, and the banked count for this pool stays at zero.

**Two judgments recorded for the chair, vetoable.**
1. **The block's PROVENANCE paragraph against the card.** The block header licenses *capability* clauses ("walls without people cannot be held") and refuses only historical ones. Read on its own that paragraph would keep the shipped *cannot hold a siege* and *people can be gone around*. The card is the narrower authority and the brief's instruction is explicit — a claim the card does not license is dropped — so both are dropped here. If the chair reads the block paragraph as licensing a capability clause on this spine, the drop is reversible in one refinement round and the four `[ledger]` faces are where it would land.
2. **The observer in the `[visitor]` angle.** *A stranger sees* is dropped as a standpoint (C-NOT) and as a per-entry vantage (MOVE-GRAMMAR §1.3), and the angle survives as the routing tag it is — the same reading the `DS-DEF-1` packet took on the same ground. The stricter reading available to a refuter is that the visibility of the absence was itself the shipped row's content; on that reading the cure spends a claim. The reading taken here is that no field holds a stranger, so nothing typed was spent.
