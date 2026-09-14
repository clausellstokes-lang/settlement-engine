# DS-DEF-11 · `UNWALLED-SMALL` — REWRITE, draft round 1

Seat: Opus 5 (Fable-unvalidated), Opus WRITER for the Fable chair.
Block DS-DEF-11 · pool key `UNWALLED-SMALL` · role SPINE · 2 variants in, 2 variants out,
8 wordings (2 × ([plain] + 3 [face])). No variant added, removed, merged or reordered;
both vids keep their numbers, their bracketed tags and their order.

Paste the block below under the pool's bold heading, in place of today's two numbered rows.
The pool's typed lines (ROLE / READS / RELATION / ATTACH / FORM / MOVE) are untouched and
are not repeated here.

---

1. `[street]` `[plain]` {settlement} is a small town, and it carries no wall.
   - `[face]` The record enters no wall at {settlement}, and enters the town as small.
   - `[face]` Nothing walled stands at {settlement}. The town is small.
   - `[face]` In size {settlement} is small, and the place stands without a wall.

2. `[visitor]` `[plain]` No wall marks where {settlement} ends, and the town is small.
   - `[face]` The town is small, and no wall goes round {settlement}.
   - `[face]` Walls are no part of {settlement}. The place is small.
   - `[face]` The small town of {settlement} reaches its limit without a wall.

---

--- NOTES

## A. The licence card this pool is written to (printed, `scripts/prose-licence-card.mjs DS-DEF-11 'UNWALLED-SMALL'`)

    role spine · reads `forces.walls.present` (measured) + `settlement.tier` (measured)
    predicate (none recovered) · bag {defwork: bare-common, settlement: proper},
    FILLED at this block's call sites: {settlement}
    relation (a spine takes no relation) · seat/form (not a seat-taker) / sentence
    move (none declared) · angle street visitor · attach (empty) · covert no
    source muster · standing LICENSED (citation only where the provenance budget allows)
    may claim: that `present` holds, as a STANDING fact of the record
    may NOT: a count, a cause, a season, a future, a standpoint, a second fact,
             another civic object of the class `wall`
    REFUSED COLUMNS, always: a totality over persons; an exemption from a duty;
             a named character and that character's fate; a theological claim

The pool therefore carries exactly TWO claims, and every one of the eight wordings carries
both and nothing else (arm A6, claim-equal):

- **W** — the wall fact: `forces.walls.present` is false for this town, stated as a standing
  fact of the record. Licensed by `reads: forces.walls.present` and by `may claim: that
  present holds, as a STANDING fact of the record`.
- **S** — the size fact: `settlement.tier` is village and below. Licensed by
  `reads: settlement.tier`, and it is the pool key's discriminating claim against the sibling
  pool `UNWALLED-LARGE` (U9). See refusal R7 for the reading this rests on.

## B. Per-face licence (which card clause licenses each claim)

**Variant 1 `[street]`**

| wording | claims | licence |
|---|---|---|
| `[plain]` {settlement} is a small town, and it carries no wall. | S, W | S ← `reads: settlement.tier`; W ← `reads: forces.walls.present` + `may claim`; slot ← `bag {settlement: proper}` FILLED |
| `[face]` The record enters no wall at {settlement}, and enters the town as small. | W, S | W ← `reads: forces.walls.present` + `may claim` (the record-grade form the card names); S ← `reads: settlement.tier`; "the record" is the register's own compiling frame (R-DA-01), NOT a provenance citation of a holder (see R10) |
| `[face]` Nothing walled stands at {settlement}. The town is small. | W, S | W ← `reads: forces.walls.present` (the negation is bounded to the wall class, i.e. the read itself, so it is not a totality over an unclosed column); S ← `reads: settlement.tier` |
| `[face]` In size {settlement} is small, and the place stands without a wall. | S, W | S ← `reads: settlement.tier`; W ← `reads: forces.walls.present` + `may claim`. "In size" is a frame of measurement, never a causal joint (see R1) |

**Variant 2 `[visitor]`**

| wording | claims | licence |
|---|---|---|
| `[plain]` No wall marks where {settlement} ends, and the town is small. | W, S | W ← `reads: forces.walls.present` + `may claim`; S ← `reads: settlement.tier`. "where {settlement} ends" is the complement of the wall fact (the bound the wall does not mark) and asserts no geography field |
| `[face]` The town is small, and no wall goes round {settlement}. | S, W | S ← `reads: settlement.tier`; W ← `reads: forces.walls.present` |
| `[face]` Walls are no part of {settlement}. The place is small. | W, S | W ← `reads: forces.walls.present` (the plural is the class the read covers, never a second civic object); S ← `reads: settlement.tier` |
| `[face]` The small town of {settlement} reaches its limit without a wall. | S, W | S ← `reads: settlement.tier`, carried in a nominal (see R11); W ← `reads: forces.walls.present` + `may claim` |

## C. Word counts

| row | wording | words | sentences | close (R-DA-04 kind) | opener |
|---|---|---|---|---|---|
| 1 | `[plain]` | 10 | 1 | object (`wall`) | {settlement} |
| 1 | face a | 13 | 1 | condition (`small`) | The record |
| 1 | face b | 9 (5 + 4) | 2 | condition (`small`) | Nothing walled |
| 1 | face c | 12 | 1 | object (`wall`) | In size |
| 2 | `[plain]` | 11 | 1 | condition (`small`) | No wall |
| 2 | face a | 10 | 1 | the name (`{settlement}`) | The town |
| 2 | face b | 10 (6 + 4) | 2 | condition (`small`) | Walls |
| 2 | face c | 11 | 1 | object (`wall`) | The small |

A slot counts as one word. Eight wordings, sixteen faces' worth of nothing hidden:
2 variants × 4 faces = **8 wordings**, all shipped, none banked.

## D. Measured band positions (reported, not asserted as a gate)

- em dashes 0 · exclamations 0 · digits 0 · percents 0 · question marks 0 · `, which` 0 (walls, all held)
- semicolons **0 of 8** (both shipped variants carried one each, 2 of 2; the joint is now a
  comma-and, a period, or nothing — R-DA-06's rationed semicolon taken to zero on this pool)
- pronoun closers **0 of 8** (R-DA-04 ceiling 0.055)
- settlement-token openers **1 of 8 = 0.125** (R-DA-17 register ceiling 0.167, target 0.150);
  no two adjacent variants open on it, and only variant 1's `[plain]` does
- triads **0** (the shipped variant 1 carried one: "its neighbours, its distance, and its
  unimportance" — R-DA-10 ceiling 0.020; see refusal R3)
- sentences under 8 words **4 of 10 = 0.400** (R-DA-06 floor 0.030)
- sentences over 30 words **0** (ceiling 0.340)
- words per sentence: 10, 13, 5, 4, 12, 11, 10, 6, 4, 11 — mean 8.6, **sd 3.29** (see refusal R6)
- distinct level-1 grammars across the two variants: variant 1 leads on the state (PRESENT on
  the tier half, then the wall half); variant 2 leads on the wall half. Both realise PRESENT
  over the block's STATE-KEY; the pool's two members differ in which half of the key opens and
  in sentence count across their faces (§3.2's min(k, |set|) at k = 2).

## E. Sibling distance (arms A1 and A11 — neither restate nor contradict)

Vocabulary reserved to the block's sibling pools and deliberately NOT used here:
`{defwork}` · ornament · enclosed / enclosure · present peace · easier to keep than to raise ·
built work · patience · stone · wages · muster · watch · arithmetic · reached a size ·
buys stone · confidence or thrift · openness · statement · weight · circuit · defense money ·
the books say. Nothing here asserts a wall, a watch, an upkeep or a purse, so nothing
contradicts `WALLED-THREATENED`, `WALLED-QUIET`, `WALLED-STRAINED` or `UNWALLED-LARGE`, and
nothing restates `UNWALLED-LARGE`'s counterforce claim (which is about money, not size).

## F. THE THREAD (§1.4.1) and the spine's position

The two two-sentence faces hand a noun forward: variant 1 face b's "The town" and variant 2
face b's "The place" both carry {settlement} forward as the subject of the second sentence.
No face turns outward at all, so no face needs the one turn placed last. As the SPINE this
pool is written first in the composed passage, so every wording is built to end on a noun a
modifier can pick up — `wall`, `small`, `town`, `place`, or the settlement's own name — and
none of them ends on a pronoun.

## G. REFUSALS AND REMOVALS (a refusal is a result)

Both variants are written; neither is banked. The refusals below are (i) claims of the shipped
text that the card does not license and that ruling 5 requires be removed (R-DA-15's obeys row
6: an unlicensed claim "is not a claim the pool was entitled to hold... the B-CLAIM bar is not
engaged"), each named so the annex history carries what left; and (ii) two laws this pool
cannot meet, with the measurement.

**R1 — variant 1, the causal join REMOVED.** "too small to wall" asserts that the tier causes
the wall's absence. Card: `may NOT: a cause`. The two facts are now set side by side with no
causal joint anywhere in the eight wordings, and no fronted circumstance that implies one.

**R2 — variant 1, the standpoint REMOVED.** "and knows it" asserts the town's knowledge.
Card: `may NOT: a standpoint`; also R-DA-14 (no interior) and the register card's "no assigned
reaction".

**R3 — variant 1, three unlicensed facts REMOVED.** "the town's safety is its neighbours, its
distance, and its unimportance" claims (a) a safety state, (b) neighbouring settlements,
(c) a distance, (d) an importance rating. The card reads two fields and neither holds any of
them; `may NOT: a second fact`. The construction was also a triad (R-DA-10) and an evaluative
close (R-DA-12).

**R4 — variant 2, the figure REMOVED.** "the country and the town simply agree to differ"
gives two inanimate abstractions an intent and an agreement. R-DA-11 (nothing inanimate acts
with intent; a comparison is a measurement in words); also a fact on no read.

**R5 — variant 2, the fronted circumstance REMOVED.** "at this size" fronted before the second
clause reads as the cause of the wall's absence (the same implicature R1 names). The tier is
now stated flat, as its own predicate, in every wording.

**R6 — a law this pool CANNOT meet: R-DA-05's within-pool spread.** The floor is
`words-per-sentence sd ≥ 4.0`; this pool measures **3.29**. The licence bounds the spine to two
facts, and the only way to reach the floor on two facts is to add words that carry no claim —
which §21.4's density law names as the regression ("a refinement that made a lawful line
plainer with no law behind the change") and which §22 does not permit as a substitute for
compression. The pool is written at the compressed ceiling and the spread is reported short.
CHAIR ROW: on a spine pool of two facts the spread law should be measured on the COMPOSED
unit (spine plus its modifiers), not on the spine's own pool; the composed unit is where the
sentence lengths actually vary. Offered as a sitting row, not decided here.

**R7 — a reading this draft rests on, flagged for the sitting.** The card's
`may NOT: a second fact` is read as barring a fact OUTSIDE the card's two `reads`, not as
barring the second of the two reads. `settlement.tier` is printed as a measured read and is
the pool key's own discriminating claim against `UNWALLED-LARGE` (U9's protected claim). If
the chair reads the clause strictly — only `forces.walls.present` claimable — then the size
fact is unlicensed, all eight wordings carry a refusal, **and so do both shipped variants**,
and the pool becomes indistinguishable in prose from `UNWALLED-LARGE`. The strict reading is a
refusal row for the whole pool, not for this draft alone.

**R8 — the slot set, declared.** The card's bag names `{defwork: bare-common, settlement:
proper}` but FILLED at this block's call sites is `{settlement}` alone. No face uses
`{defwork}`: the block's SLOTS proviso says a settlement with no wall-class row is not offered
a variant that needs one, and `UNWALLED-SMALL` is by construction that settlement. Every face's
`{slot}` set equals its parent's (ARCH §2.5 refuses a face whose slot set differs).

**R9 — the ABSENCE-opener reading, flagged.** Three of the eight wordings open on the negative
("Nothing walled…", "No wall…", "Walls are no part of…"). This draft is written under the
reading that `forces.walls.present` IS this block's STATE-KEY field, so its negative value is
a **PRESENT** move (MOVE-GRAMMAR §1.2 row 1, "a standing configuration field: the block's
STATE-KEY"), not the ABSENCE move, and order wall 3 ("ABSENCE never opens") does not bite.
The ABSENCE move's class (a) LACK is licensed by a `none-exists` field DISTINCT from the state
key (V3 = state key + `none-exists`), which this pool has not got. If the walker's classifier
reads these as ABSENCE openers instead, variant 2's `[plain]`, variant 1's face b and
variant 2's face b red, and the pool's entire subject becomes unopenable — every wording would
then have to open on the settlement token or on the tier, which R-DA-17 caps at one variant per
pool and fault 9 names as a fixed move. The chair's call; the draft names the fork.

**R10 — the provenance move DECLINED, deliberately.** The card licenses the muster as a
standing source and permits a citation "where the provenance budget allows". No face cites.
§24's ceiling is one citation per unit and only for one of S3's three reasons; none obtains
here (there are no two disagreeing accounts, the pool states no count, and the wall fact is not
the muster's record). §24 also measures the exemplar registers at 0 citations per 786 sentences
and names a citation habit as a refuter's finding. "The record" in variant 1's face a is the
office's own compiling frame (R-DA-01), not a holder citation — §4.4.3 is explicit that a
citation on a fact whose holder is the office itself is a finding.

**R11 — an appositive, flagged not refused.** Variant 2's face c packs the tier claim into a
nominal ("The small town of {settlement}"). MOVE-GRAMMAR §9.1 records that a move packed into
a nominal appositive is invisible to arm A's classifier and reads as an arm-A disagreement
with a correct tag; the appositive arm is OWED. Lawful as written; named so the walker lane
does not read it as a mis-tag.

**R12 — the tag line, a paster's note.** The brief asks for the number, the bracketed tag
exactly as it stands, a `[plain]` line and three `[face]` sub-rows. ARCH §2.5's example puts
`[plain]` where this pool's rows carry their angle tag, so both are printed above, angle first
(`` `[street]` `[plain]` ``). If the projector's grammar takes one tag per numbered row, the
angle tag is the one that stands and `[plain]` is dropped from the row; the chair's call, and
it moves no byte of the prose.
