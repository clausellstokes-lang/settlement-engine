Seat: Opus 5 — Fable-unvalidated. Block DS-DEF-11 · pool `UNWALLED-LARGE` · role spine · draft round 1.
Two variants in, two variants out; same vids, same order, same angle tags; four wording faces each.
Paste target: under the bold pool line `**`UNWALLED-LARGE`**` in `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`, replacing rows 1 and 2.

1. `[counterforce]` Past village size, {settlement} carries no wall.
   - `[face]` The town is no village, and nothing walls {settlement}.
   - `[face]` Larger than any village, {settlement} stands open.
   - `[face]` Ranked with the towns, {settlement} is not walled.
2. `[ledger]` By weight {settlement} is a town or larger, and it holds no wall.
   - `[face]` No circuit runs about {settlement}, a town at least in weight.
   - `[face]` Entered among the towns, {settlement} has no walls.
   - `[face]` Weight enough for a town stands to {settlement}, and no wall does.

--- NOTES

**The card, as read.** `reads: forces.walls.present (measured)` and `settlement.tier (measured)`; `may claim: that present holds, as a STANDING fact of the record`; `may NOT: a count, a cause, a season, a future, a standpoint, a second fact, another civic object of the class wall`; `bag {defwork, settlement}` with **FILLED at this block's call sites: {settlement}**; `source: muster · standing LICENSED`; `audience: player (no mark)`; `covert: no`.

**The two licensed claims, and the reading behind them (vetoable).** Every one of the eight faces asserts exactly these two and nothing else:
- **C1 — the wall.** `forces.walls.present` is false, as a standing fact of the record. Licensed by the `reads` row and by `may claim: that present holds, as a STANDING fact`; the pool key `UNWALLED-LARGE` is the value.
- **C2 — the band.** `settlement.tier` stands above the village band (town and above). Licensed by the second `reads` row. The card's `may NOT: a second fact` is read as barring a fact outside the card's two reads, not as barring the second of the two reads; the tier claim is also the pool key's discriminator against the sibling pool `UNWALLED-SMALL`, and dropping it would strike the clause that carries the key's discriminating claim (U9). Stated here so the chair or a refuter can veto the reading rather than infer it.

**Per face — the clause that licenses each claim.**

| face | C1 (walls.present false) | C2 (tier above the village band) | slot |
|---|---|---|---|
| 1 line, `carries no wall` | `reads: forces.walls.present` · `may claim: present, STANDING` | `reads: settlement.tier` (`Past village size` = the band boundary against `UNWALLED-SMALL`) | `bag {settlement}` FILLED |
| 1a, `nothing walls {settlement}` | same | `The town is no village` = the same boundary, negative form | same |
| 1b, `stands open` | same (the enclosure's absence as a present condition) | `Larger than any village` = the boundary, comparative form | same |
| 1c, `is not walled` | same | `Ranked with the towns` = the band named from above (`town and above`) | same |
| 2 line, `it holds no wall` | same | `a town or larger` = the band stated exactly | same |
| 2a, `No circuit runs about` | same (`circuit` is this row's own shipped term for the absent wall, not a second civic object) | `a town at least in weight` = the band as a floor | same |
| 2b, `has no walls` | same | `Entered among the towns` = band membership | same |
| 2c, `and no wall does` (ellipsis of `stands to {settlement}`) | same | `Weight enough for a town` = the band as a floor | same |

**What was dropped, and under which clause.**
- Variant 1, `a size that usually buys stone`: the tier half is KEPT (C2); the regularity — what a size of that kind ordinarily produces — is a claim over a population of towns that no field holds. Dropped under `may NOT: a cause` and the generalisation test (R-DA-12).
- Variant 1, `and has not bought it`: an act that did not occur is a HISTORY move; the card holds no event-provenance field and licenses `present` as a STANDING fact only (R-DST-B; MOVE-GRAMMAR §1.2 row 2). The standing negative is kept; the purchase frame is dropped.
- Variant 1, `whether that is confidence or thrift`: two candidate motives. Dropped under `may NOT: a cause` and `may NOT: a standpoint`.
- Variant 1, `the openness is itself a statement`: a MEANING move — what the fact means (MOVE-GRAMMAR §1.3; R-DA-03's second-sentence gloss; R-DA-12's evaluative close). Dropped.
- Variant 2, `is spending its defense money on something else`: a fact of the purse, outside both `reads`. Dropped under `may NOT: a second fact` and `may NOT: a cause`.
- Variant 2, `and the books say what`: a citation of a holder the card does not license (the card's licensed holder is the **muster**, not the treasury's books), and a hook that promises a fact the unit does not state. Dropped under S3, the card's `source` row, and the close rule (no hook — R-DA-04 / H-9).
- Nothing was added to any face.

**The provenance move, deliberately not spent.** The card licenses a citation of the **muster** where the budget allows. §24 sets the ceiling at one citation per unit, on a licensed holder, for one of S3's three reasons only: two accounts that disagree, a count from an interested party, a record whose keeper is a power. None of the three obtains here — the pool holds one standing fact and its band, no count, no second account — and the exemplar registers with raw text cite at zero per 786 sentences, so a citation on this unit would be the habit §24 names as a refuter's finding. Recorded as a decision, not an oversight.

**Declared judgment calls and band positions (a refuter should look here first).**
1. **No face opens on `{settlement}`.** The seam contract (ARCH §2.5) refuses a sentence face opening on a `proper`-typed slot of the block's bag (T-F8), and R-DA-17 keeps the settlement token off the default opener. Both shipped rows of this pool led on `{settlement}` or on `A town of {settlement}'s weight`; none of the eight faces does now. The cost is that four of eight faces take a fronted adjunct before the subject; the shapes are otherwise spread across subject-first, absence-subject, comparative-fronted and abstract-subject-with-ellipsis.
2. **`{defwork}` is not used.** The card's bag carries it, but the card records it unFILLED at this block's call sites, and the block's SLOTS line refuses a variant needing a wall-class row to a settlement that has none — which is every settlement this pool fires on. Every face's slot set is `{settlement}` alone and equals its parent's.
3. **The absence does not open the passage in six of eight faces.** MOVE-GRAMMAR wall 3 (ABSENCE never opens) is read as governing the GAP class (R-DA-08, a fact of the record); R-DA-02 licenses the world LACK as the first half with no completing "but". Two faces (1a, 2a) open on the lack under that reading. Neither carries a completing "but". If the chair reads wall 3 as covering the LACK too, those two faces are the ones to revert.
4. **No holder, no record-gap.** No face says the record does not hold a wall; the absence written is the world's (`walls.present` false), never the register's. A GAP would need a typed `not-held` field the card does not carry.
5. **Sibling distance (arms A1, A11).** The sibling pool `UNWALLED-SMALL` owns `No wall marks where {settlement} ends` and `too small to wall and knows it`; no face here opens on `No wall`, uses `marks where`, or attributes knowledge to the town. The `WALLED-*` pools own `keeps`, `stands better`, `enclosed the way working things are enclosed`, `on the town's books` and `the kind of arithmetic`; none is used. No face contradicts a sibling: this pool's town is above the village band, which is the small pool's own boundary read from the other side.
6. **Length and spread.** Faces run 7 to 13 words against the shipped rows' 20 and 22. The shortening is forced by the licence, not by plainness (§21.4): every word cut carried an unlicensed claim, and no lawful compression was traded for a flatter line. Within-pool word-count spread is accordingly narrow (7, 9, 7, 8, 13, 11, 8, 12; sd about 2.2) and sits below R-DA-05's within-pool floor of 4.0 — reported as a band distance, with the cause named, not padded away. Two claims and no cause is the whole of what this pool may say.
7. **Joints.** Both shipped rows joined on a semicolon (a pool rate of 1.0 against R-DA-06's ceiling of 0.130). No face uses one; the joints are a comma or nothing. No colon, no em dash, no `which`, no digit, no percent, no question, no exclamation.
8. **THE THREAD.** This pool is a spine, so each face is written to hand a noun forward to whatever modifier the composer seats next: six of eight close on the wall or its absence (the noun both DEF-11 modifiers — the pressed country, the bought watch — reach back for), and the two that close on the band (1a's `{settlement}`, 2a's `a town at least in weight`) leave the town noun in the last phrase. No face closes on a pronoun.
9. **Claim-equality across faces (arm A6).** The four faces of each variant assert C1 and C2 and nothing else, so they are claim-equal to each other; the two variants are claim-equal too, which is what arm C requires of a pool's grammars, and they are held apart by angle, vocabulary and rhythm rather than by claim.

**REFUSALS: none.** Both variants were made lawful under the card. No variant is banked; no face is withdrawn; the variant count stays at two and the face count rises from one to four per variant.
