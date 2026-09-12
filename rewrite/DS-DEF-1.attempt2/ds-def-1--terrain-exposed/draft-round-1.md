Seat: Opus 5 — Fable-unvalidated. Block `DS-DEF-1` · pool key `terrain EXPOSED` · draft round 1.
Three variants in, three variants out; same vids, same order, same angle tags; three face sub-rows each.
The rows below are the complete replacement for the pool's variant rows, ready to paste under the pool's heading.

1. `[visitor]` The approaches to {settlement} lie open, and the ground carries no part of the defense.
   - `[face]` Open country comes up to {settlement} on every side, and a defense takes nothing from such ground.
   - `[face]` No ground about {settlement} serves a defense. The country is level to the edge of the town.
   - `[face]` The horizon runs unbroken around {settlement}, and the ground beneath the town does nothing in its defense.
2. `[ledger]` The ground at {settlement} counts for nothing in the defense of the town.
   - `[face]` The defense of {settlement} owes nothing to its ground.
   - `[face]` Nothing in the site of {settlement} tells in the town's defense.
   - `[face]` In any account of its defense, {settlement} takes nothing from its site.
3. `[street]` No hill stands over {settlement} and no narrows guard the approach. The ground gives the town no cover.
   - `[face]` Nothing overlooks {settlement} and nothing pinches the approach, and the ground takes no part in the defense.
   - `[face]` The country about {settlement} shows no rise and no narrows, and the defense takes nothing from the ground.
   - `[face]` The town has no hill to hold and no narrows to close, and the ground at {settlement} does not enter the defense.

--- NOTES

**The card, as printed** (`node scripts/prose-licence-card.mjs DS-DEF-1 'terrain EXPOSED'`), with the clause labels used below:
- **C-READ** — `reads: text(terrain) (via TERRAIN_DEFENCE_OF in defenseStateProse.js)`; absent means no candidate.
- **C-PRED** — `predicate: text(terrain) … === Plains`.
- **C-CLAIM** — `may claim: that (=== Plains) holds, as a STANDING fact of the record`.
- **C-BAG** — `bag: {band: RESERVED, counterpart: proper, route: proper, settlement: proper}`, **FILLED at this block's call sites: {settlement}**.
- **C-ROLE** — `role spine` · `form sentence` · `move (none declared)` · `angle: ledger street visitor` · `relation: a spine takes no relation` · `attach: empty`.
- **C-NOT** — `may NOT: a count, a cause, a season, a future, a standpoint, a second fact`.
- **C-SRC** — `source: (none) · standing SOURCE-UNRESOLVED`; **no citation is licensed** (arm A13), so no face names a holder.
- **C-REFUSED** — always: a totality over persons; an exemption from a duty; a named character and that character's fate; a theological claim.

**The claim set every face carries, and nothing else.** C-READ is `TERRAIN_DEFENCE_OF(terrain)`, so the field's own value has two faces of one fact and the pool key is the second of them: **K1** the site's ground is open and level (C-PRED, `=== Plains`), and **K2** that ground bears no part of the defense (C-READ, the classification the key `terrain EXPOSED` names). K1 and K2 are one licensed claim read off one field, not a fact and a second fact, so a face may carry both in one sentence without engaging C-NOT's second-fact bar; a face carrying them as two sentences states the same one claim in the clerk's two strokes. Variant 2's four faces carry K2 alone, because the shipped `[ledger]` sentence asserted the site's nil defensive worth and named no landform; adding K1 there would be adding a claim (§21 to §23: never add).

**Per variant: what was kept, what was dropped, and under which law.**

| vid | the shipped sentence's claims | disposition |
|---|---|---|
| 1 `[visitor]` | (a) the town sits open; (b) no ground here helps it; (c) *everything the town has must be built rather than found* | (a) and (b) KEPT as K1 and K2 (C-PRED, C-READ). (c) DROPPED: a second fact about the town's works, licensed by no field on this card (C-NOT "a second fact"); it also quantifies a totality over an open column (CLERK-LAWS C4) and carries a standing obligation the card does not hold. |
| 2 `[ledger]` | (a) the site gives the town nothing defensively; (b) *every advantage the town holds is one it has paid for*; (c) *and must keep paying for* | (a) KEPT as K2 (C-READ). (b) DROPPED: a CONSEQUENCE / BILL claim, double-licensed only by event provenance and a household or office row (MOVE-GRAMMAR §1.2 row 7), which this spine has not got; "every advantage" is also a C4 quantifier over an open column. (c) DROPPED: a continuing obligation reading forward off a standing field (C-NOT "a future"; A2, STATE never FATE). |
| 3 `[street]` | (a) the town has no hill and no narrows; (b) *and does not pretend otherwise*; (c) *what the town holds it holds by standing on it* | (a) KEPT as K1 stated as the lack the field holds, with K2 written beside it. (b) DROPPED: a standpoint and a belief frame about the town (C-NOT "a standpoint"; R-DA-13's belief-frame floor). (c) DROPPED: a life-general closer over the town's holdings, licensed by no field (R-DA-12, the generalisation test; C-NOT "a second fact"). |

**Face by face — the clause that licenses each claim.**

*Variant 1 `[visitor]`, the ground as it stands to anyone coming at the town.*
1. parent, 15 words — "the approaches … lie open" = K1 by C-PRED; "the ground carries no part of the defense" = K2 by C-READ. Slot: one `{settlement}`, C-BAG. Close: the office's own noun, an absence kind (R-DA-04).
2. face, 17 words — "Open country comes up to {settlement} on every side" = K1 by C-PRED; "a defense takes nothing from such ground" = K2 by C-READ.
3. face, 17 words — "No ground about {settlement} serves a defense" = K2 by C-READ (the negation is the classification's own content, not an added totality: the quantified subject is the read's own field); "The country is level to the edge of the town" = K1 by C-PRED.
4. face, 17 words — "The horizon runs unbroken around {settlement}" = K1 by C-PRED, a measurement in words and not a figure (R-DA-11); "the ground beneath the town does nothing in its defense" = K2 by C-READ.

*Variant 2 `[ledger]`, the site's standing in the town's defensive account; no landform named.*
1. parent, 13 words — "counts for nothing in the defense of the town" = K2 by C-READ. No source named (C-SRC).
2. face, 9 words — "The defense of {settlement} owes nothing to its ground" = K2 by C-READ, the subject inverted; the short line is R-DA-05's spread, not a trim (§22: shortening inside the band is editing).
3. face, 11 words — "Nothing in the site of {settlement} tells in the town's defense" = K2 by C-READ; the compression is the density law (§21.4), not an obscurity.
4. face, 12 words — "In any account of its defense, {settlement} takes nothing from its site" = K2 by C-READ; "any account" is the office's own compiling, not a cited holder (C-SRC, §24's one-citation ceiling untouched).

*Variant 3 `[street]`, the lack of defensive landform, plainly.*
1. parent, 18 words — "No hill stands over {settlement} and no narrows guard the approach" = K1 by C-PRED, written as the lack the field holds (the LACK is the predicate's own content, not R-DA-08's `not-held` record gap, so no absence-field is claimed); "The ground gives the town no cover" = K2 by C-READ.
2. face, 17 words — "Nothing overlooks {settlement} and nothing pinches the approach" = K1 by C-PRED; "the ground takes no part in the defense" = K2 by C-READ.
3. face, 18 words — "shows no rise and no narrows" = K1 by C-PRED; "the defense takes nothing from the ground" = K2 by C-READ.
4. face, 22 words — "no hill to hold and no narrows to close" = K1 by C-PRED; "the ground at {settlement} does not enter the defense" = K2 by C-READ.

**Walls checked on every one of the twelve faces.** No em dash · no exclamation · no question · no digit and no percent · no `which`-clause · no semicolon and no colon · no first or second person · no future indicative · no citation and no holder named (C-SRC) · no count word and no band word (`{band}` is RESERVED, C-BAG) · no season, no cause, no history, no standpoint, no belief frame · exactly one `{settlement}` in every face and no other slot, so every face's slot set is identical to its parent's (ARCH §2.5, the face-row refusal) · **no wording opens on `{settlement}`**, the proper-typed slot (ARCH §2.5's seam contract and T-F8; the shipped `[visitor]` row opened on it and no longer does) · no totality over persons, no exemption, no named character, no deity (C-REFUSED).

**Siblings (arms A1 and A11), neither restated nor contradicted.** The `readiness` bands own the town's arrangements, works and watch, and no face here says anything about them: a `STRONG` town on open ground is a real state, and every face confines its nil-worth claim to what the *ground* does. The `strategic value` pools own what the town is worth to a taker, so no face says the site is worth nothing simply — always worth nothing *in a defense*. `terrain FAVOURABLE` is the same field's other value and can never render beside this one; its licensed vocabulary (the approach, the terrain carrying part of the defense) is used here in the negative from the same field, which is the field's content and not a restatement of the sibling's claim. `DS-DEF-2`'s threat rows and `DS-DEF-10`'s per-arm badges are untouched.

**The thread (owner, 2026-09-08 ~21:4x).** This pool is the SPINE, so it leads the passage and hands a noun forward rather than picking one up. Every face closes on a spine noun a modifier can carry: the ground, the town, the country, the site, the defense, the cover. No face closes on a pronoun (R-DA-04) and none of the twelve depends on a neighbour to be read.

**Refusals: none.** All three variants were made lawful under the card; no variant is banked, and the banked count for this pool stays at zero.

**One judgment recorded for the chair, vetoable.** R-DA-02 would license a contrast here, because the rejected alternative is named by a sibling band (`terrain FAVOURABLE`). No face uses one: the antithesis shape is the register's measured tell, the shape ceiling is a down-direction band, and the contrast would have had to assert what *does* defend the town, which this card does not license. The licence is left unspent deliberately, not overlooked.
