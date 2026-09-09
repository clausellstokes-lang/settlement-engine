# DS-DEF-11 · pool `UNWALLED-SMALL` · REWRITE draft, round 1

Writer: Opus 5 (Fable-unvalidated). Block DS-DEF-11 · role spine · key `UNWALLED-SMALL`.
Two existing variants, rewritten in place under their own numbers and their own angle tags;
none added, none removed, none merged. Three `[face]` sub-rows per variant (four wordings
per variant, the numbered row counting as the first). The typed lines of the pool
(RECEIPT / STATE-KEY / SLOTS / SECTION-TARGET / PROVENANCE) are untouched and not repeated.

---

## THE ROWS — the complete replacement for the pool's variant rows

1. `[street]` {settlement} is no larger than a village. The place stands without a wall.
   - `[face]` Village size is as far as {settlement} goes. Nothing walls the place.
   - `[face]` The size of {settlement} stops short of a town. The place goes unwalled.
   - `[face]` A village is the size {settlement} keeps. The place holds no wall.
2. `[visitor]` The village that {settlement} amounts to has no wall.
   - `[face]` No bigger than a village, {settlement} is a place without a wall.
   - `[face]` A village at its largest, {settlement} keeps no wall.
   - `[face]` What stands at {settlement} is a village and no wall.

---

## --- NOTES

### N0 · The card, and the claim set it licenses

The licence card printed for this pool (`node scripts/prose-licence-card.mjs DS-DEF-11
'UNWALLED-SMALL'`) carries TWO measured reads and no predicate branch:

- `reads: forces.walls.present (measured)` — at this key the value is negative: no wall stands.
- `reads: settlement.tier (measured)` — at this key the tier is village and below
  (`thorp` · `hamlet` · `village`, `defenseGenerator.js:124`'s own small set).
- `may claim: that present holds, as a STANDING fact of the record.`
- `bag: {defwork: bare-common, settlement: proper}` · `FILLED at this block's call sites: {settlement}`.
- `seat/form: (not a seat-taker) / sentence` · `covert: no` · `audience: player (no mark)`.
- `source: muster · standing LICENSED` — a citation licensed only where the provenance budget allows.
- `may NOT: a count, a cause, a season, a future, a standpoint, a second fact, another civic
  object of the class 'wall'.`
- REFUSED COLUMNS, always: a totality over persons; an exemption from a duty; a named character
  and that character's fate; a theological claim about a deity.

**The licensed claim set of this pool, therefore, is exactly two standing facts:**

- **C1 — NO WALL STANDS AT {settlement}.** Licensed by `reads: forces.walls.present (measured)`
  under `may claim: that present holds, as a STANDING fact of the record`. Realised as the
  ABSENCE move, class (a) LACK (MOVE-GRAMMAR §1.2 row 11: a `none-exists` world field, a fact of
  the WORLD, never of the record — R-DA-08's record/world line runs the other way and is not
  used here).
- **C2 — {settlement} IS NO LARGER THAN A VILLAGE.** Licensed by `reads: settlement.tier
  (measured)`, the second measured read, under the same `may claim` clause; the STATE-KEY line
  of the block spells the key as "no walls, village and below", so both halves of the key are
  the card's reads and neither is a `second fact` in the sense the card refuses. A THIRD fact is.

Every one of the eight wordings below carries C1 and C2 and nothing else. The four wordings of
each variant are claim-equal to each other (arm A6 reads across the faces). Both variants carry
the same two claims because the pool key is the conjunction of the card's two reads; they differ
lawfully in ANGLE, GRAMMAR, vocabulary and rhythm (C-sibling: siblings cohere in structural fact
and differ in standpoint and grammar).

### N1 · What the old sentences claimed, and what was dropped

**Old variant 1** — `[street]` `{settlement} is too small to wall and knows it; the town's safety
is its neighbours, its distance, and its unimportance.`

| claim in the old row | disposition | clause |
|---|---|---|
| the settlement is small | KEPT (C2) | card `reads: settlement.tier (measured)` |
| no wall (entailed by "to wall") | KEPT (C1) | card `reads: forces.walls.present (measured)` |
| the smallness EXPLAINS the absence ("too small to wall") | **DROPPED** | card `may NOT: a cause`; R-DST-B (a standing configuration field licenses a structural clause, never a historical one, and never composes the join) |
| "and knows it" — the town holds a view of its own state | **DROPPED** | card `may NOT: a standpoint`; REFUSED COLUMNS `a totality over persons`; the belief frame (R-DA-13's executable floor) |
| "the town's safety is its neighbours" | **DROPPED** | card `may NOT: a second fact` — no neighbour field is on the card's reads; the address law would require named neighbours |
| "its distance" | **DROPPED** | card `may NOT: a second fact` — no geography read on this card |
| "its unimportance" | **DROPPED** | card `may NOT: a second fact` and `a standpoint` — an evaluative judgment on the settlement, no field |
| "safety" as an outcome of the arrangement | **DROPPED** | card `may NOT: a future` — safety is a forecast in a noun; STATE never FATE (THE PROMISE) |
| the triad (neighbours, distance, unimportance) | **DROPPED with its claims** | R-DA-10's "two items or four, never habitually three" |
| the semicolon joint | replaced by two sentences | R-DA-03 (the qualification takes its own sentence, never a tail); R-DA-06's semicolon band |

**Old variant 2** — `[visitor]` `No wall marks where {settlement} ends; at this size the country
and the town simply agree to differ.`

| claim in the old row | disposition | clause |
|---|---|---|
| no wall | KEPT (C1) | card `reads: forces.walls.present (measured)` |
| "at this size" — the settlement is small | KEPT (C2) | card `reads: settlement.tier (measured)` |
| "where {settlement} ends" — the settlement has a marked extent/boundary | **DROPPED** | card `may NOT: a second fact`; no extent or geography field on this card |
| "at this size ... agree to differ" — the size EXPLAINS the absence | **DROPPED** | card `may NOT: a cause` |
| "the country" as a party | **DROPPED** | card `may NOT: a second fact`; no geography read |
| "the country and the town ... agree" — two collectives forming an agreement | **DROPPED** | R-DA-11 (nothing inanimate acts with intent; a comparison is a measurement in words); REFUSED COLUMNS `a totality over persons` on "the town" as a body that agrees |
| the ABSENCE fronted as the opening move | **RE-ORDERED** | MOVE-GRAMMAR §1.4 wall 3 (ABSENCE never opens); §1.2 row 11's "may NOT be the opening move". In the rewrite the tier PRESENT leads in variant 1 and the state is single-clause in variant 2 |

Nothing was added to either variant. No wording below asserts an office, a count, an
exemption, a holder, an event, a season, a future or a standpoint.

### N2 · The grammars, and the two openers

- **Variant 1 is V3 — PRESENT (C2, the tier) → LACK (C1, the wall)** (MOVE-GRAMMAR §2.1 level 1:
  "state key + a `none-exists` field"), realised as two sentences, the LACK second so the ABSENCE
  never opens (wall 3).
- **Variant 2 is V1 — PRESENT, the state key alone**, realised as ONE sentence whose single
  predicate carries the compound state `UNWALLED-SMALL`. This is the pool's second distinct
  level-1 grammar (A11's generalised rule: a pool of k variants carries min(k, 8) distinct
  level-1 grammars; k = 2 here, and the pool's admissible set is exactly {V1, V3} — V2, V4, V5,
  V6, V7 and V8 are filtered out because this card holds no structural-consequence field, no
  named object, no institution row, no unresolved state field, no event provenance and no
  `not-held` provenance field).
- **The settlement token opens ONE variant of the pool and no face** (wall 10: at most one
  variant per pool, never two adjacent). Row 1's numbered line is that one. **No `[face]`
  sub-row opens on `{settlement}`**, because T-F8 (ARCH §2.5) refuses a sentence face that opens
  on a `proper`-typed slot of the block's bag, and `settlement` is the bag's `proper` member.
- **Every row uses the slot set `{settlement}` and only it** — identical to the parent's set on
  every face (ARCH §2.5: a face whose `{slot}` set differs from the parent's is refused).
  `{defwork}` is in the bag but is NOT filled at this key: the SLOTS line mints it from the
  settlement's own wall-class institution by its recorded name, and an unwalled settlement has
  no such row. The generic word "wall" is the field's own civic noun, not a second civic object,
  so the card's `may NOT: another civic object of the class 'wall'` is not engaged.
- **Every row is sentence-form** (`seat/form: ... / sentence`): no fragment, none opening on a
  comma or a clause-list word.

### N3 · THE THREAD

- Variant 1's two sentences connect by carrying a noun forward: the second sentence's subject or
  object is **the place**, which picks up `{settlement}` from the first (MOVE-GRAMMAR §1.4.1: an
  added sentence carries a noun forward from the spine; a deliberate noun echo for the thread is
  lawful, and A11's echo bound counts facts, not nouns). No sentence changes subject in the
  middle of the passage and hands nothing back.
- Variant 2 is one sentence, so the thread applies only outward: it hands forward **{settlement}**,
  **village** and **wall**, each of which a later modifier can pick up.
- Each row is written to read as the passage's OPENER, because this is a spine and the composer
  puts the spine first. The card's `echo` line records **modifier mounts 0 (none)** for this
  pool today, so no sibling modifier follows; the rows are nonetheless written so that a later
  modifier can attach after any of them without a change of subject being stranded.
- The settlement is never called **the town** anywhere in the pool, because C2 asserts it is not
  one; "the place" is the referring noun (R-DA-22, one term for one thing, and the same-entry
  contradiction walker's C3-lexical arm).

### N4 · Face by face — the licence for every claim

**Variant 1 · `[street]` · V3 · PRESENT → LACK**

| # | wording | claims | licensing clause of the card |
|---|---|---|---|
| 1 (numbered row) | `{settlement} is no larger than a village. The place stands without a wall.` | C2 then C1 | C2: `reads: settlement.tier (measured)` + `may claim: ... as a STANDING fact`. C1: `reads: forces.walls.present (measured)` + the same `may claim`. Slot `{settlement}` from `bag ... FILLED: {settlement}`. |
| 2 `[face]` | `Village size is as far as {settlement} goes. Nothing walls the place.` | C2 then C1 | same two `reads` rows; "as far as ... goes" is a measurement in words (R-DA-11), not a figure. |
| 3 `[face]` | `The size of {settlement} stops short of a town. The place goes unwalled.` | C2 then C1 | same two `reads` rows. The contrast "short of a town" is licensed by wall 5 — the rejected alternative is a SIBLING POOL KEY of this block, `UNWALLED-LARGE` ("town and above"); it is not fronted as the subject and is not a closing move. |
| 4 `[face]` | `A village is the size {settlement} keeps. The place holds no wall.` | C2 then C1 | same two `reads` rows. |

**Variant 2 · `[visitor]` · V1 · PRESENT (the compound state key)**

| # | wording | claims | licensing clause of the card |
|---|---|---|---|
| 1 (numbered row) | `The village that {settlement} amounts to has no wall.` | C2 and C1 in one predicate | C2: `reads: settlement.tier (measured)`. C1: `reads: forces.walls.present (measured)`. Both under `may claim: that present holds, as a STANDING fact of the record`. The relative is "that", never "which". |
| 2 `[face]` | `No bigger than a village, {settlement} is a place without a wall.` | C2 and C1 | same two `reads` rows; the fronted phrase is attributive, carrying no connective of cause. |
| 3 `[face]` | `A village at its largest, {settlement} keeps no wall.` | C2 and C1 | same two `reads` rows. |
| 4 `[face]` | `What stands at {settlement} is a village and no wall.` | C2 and C1 | same two `reads` rows; the coordinate complement states the two facts side by side with no joint asserting a relation between them. |

**The tier wording, exactly.** Every face writes the tier as a CEILING — "no larger than a
village", "as far as ... goes", "stops short of a town", "the size {settlement} keeps", "amounts
to", "no bigger than", "at its largest", "what stands ... is a village". None writes "is a
village" flat, because `settlement.tier` at this key admits `thorp` and `hamlet` as well, and a
flat identity would over-state the read (the same-entry contradiction walker's C2 arm).

**The source move, deliberately absent.** The card licenses the holder (`source: muster ·
standing LICENSED`) "where the provenance budget allows". No face cites it. Part B §24 sets the
budget at ONE citation per unit and only for one of S3's three reasons — two accounts that
disagree, a count from an interested party, a record whose keeper is a power — and none of the
three holds here: the pool states no count, holds no second account, and MOVE-GRAMMAR §4.4.3
makes a citation on a fact whose holder is the office itself a finding. The exemplar registers
with raw text cite at zero per 786 sentences, so silence is the norm, not a gap.

### N5 · The walls, checked

No em dash · no exclamation · no digit or percent anywhere, and none in a connective · no
question · no `which`-clause (the two relatives are "that" and "what") · no "I", no "you", no
reader address · no expletive opener ("there is", "it is" — R-DA-07) · no future indicative and
no forecast · no figure, no sense verb on an abstraction, no inanimate acting with intent
(R-DA-11) · no simile · no triad · no digit-bearing time or count · no office, no count, no
exemption, no quantifier over a table column (R-DA-15) · no totality over persons · no named
character · no deity · no second-person or covert mark (`covert: no`, `audience: player (no
mark)`) · no `[plain]` marker on a spine row and exactly one bracketed tag per numbered row ·
no semicolon anywhere in the pool (the two shipped rows each carried one; R-DA-06's band).

### N6 · Bands reported, with their distance (soft rules, not walls — §16/§16.2)

These are REPORTED, per §16's channel rule (a soft rule reports its distance and fails only past
the depth, the budget or the ceiling). Nothing here is a wall breach.

1. **Close-kind spread (R-DA-04) is narrow.** Five of the eight wordings close on `wall`, two on
   `place`/`unwalled` (condition), one on `wall` in a coordinate. The close KINDS realised are
   absence, condition and object; `prohibition` and `a name not given` are unreachable, because
   the card licenses no duty and no unnamed party. The order wall (ABSENCE never opens) forces
   the wall to the tail of every V3 realisation. Distance: one soft rule, structurally bounded.
2. **Within-pool length spread (R-DA-05, within-pool sd ≥ 4.0) is not reached.** The eight
   wordings run 9 to 13 words; sentence lengths run 4 to 12. A two-fact spine cannot carry the
   band without adding a claim, and adding one is the wall. Distance: one soft rule; the
   remedy would be unlawful, so it is reported, never cured.
3. **Two of variant 2's four wordings front an attributive phrase** ("No bigger than a village,"
   / "A village at its largest,"). A fronted absolute can be HEARD as causal in English even
   where no causal connective is written. The refuters should read those two against `may NOT: a
   cause`. If either is judged to assert the join, the lawful substitutes already in the packet
   are the numbered row and face 4 of the same variant, which state the two facts with no
   fronting at all. Named here rather than left for the fold to find.
4. **The pool's grammar ceiling is NOT-EXECUTABLE.** R-DA-17's per-tab formula reports
   NOT-EXECUTABLE at n <= 2, and this pool's admissible level-1 set is exactly two members. The
   two variants take the two members, so the pool is at the arithmetic floor by construction.
5. **PERFECTION CEILING.** The pool is NOT inside every band (rows 1 and 2 above), so §16.1's
   suspect-at-zero flag does not fire.

### N7 · Sibling arms A1 and A11 — neither restated nor contradicted

Read against the block's four sibling pools:

- `WALLED-THREATENED`, `WALLED-QUIET`, `WALLED-STRAINED` all assert a wall standing; this pool
  asserts none. No contradiction: the pools are disjoint branches of one STATE-KEY.
- `UNWALLED-LARGE` is the block's mandatory `[counterforce]` arm and owns the town-and-above
  half: size that "usually buys stone", the money spent elsewhere, "the openness is itself a
  statement". This pool restates none of it — it makes no claim about what a size buys, no
  claim about defense spending, and no claim that the absence means anything. The one place the
  two touch is variant 1 face 3's "stops short of a town", which NAMES the sibling key as the
  rejected alternative, which is exactly what wall 5 requires of a contrast.
- Vocabulary held clear of the siblings for distance: `stone`, `circuit`, `weight`, `openness`,
  `ornament`, `enclosed`, `books`, `arithmetic`, `muster` and `watch` appear in no wording here.

### N8 · Refusals

**None.** Both variants were made lawful under the card, and both keep every licensed claim the
shipped sentence carried. No variant is banked as a refusal row; the banked count for this pool
is zero. The variant count is 2 before and 2 after, the vids and their order are unchanged, and
the face count rises from 0 to 6 sub-rows (8 wordings) — the ratchets move up only (§22).
