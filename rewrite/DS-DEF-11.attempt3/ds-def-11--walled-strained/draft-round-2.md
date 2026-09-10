# DS-DEF-11 · `WALLED-STRAINED` · REWRITE draft round 2

*Seat: Opus 5 — Fable-unvalidated. Two existing variants, rewritten in place under their own
numbers and their own angle tags; no variant added, removed, merged or reordered. Four wordings
per variant: the numbered line is face one, the three `[face]` sub-rows are faces two to four.
The pool's typed lines are untouched and are not repeated. Round 2 answers the gate's refusal and
its one failing measure; what changed and why is set out under `--- NOTES`, measure by measure.*

**`WALLED-STRAINED`**
1. `[ledger]` The {defwork} at {settlement} is the town's. Its muster is paid short of the upkeep.
   - `[face]` At {settlement} the {defwork} is a work the town owns. The outlay against its muster falls under the charge.
   - `[face]` The {defwork} is {settlement}'s own. What the town's muster costs runs past its funding.
   - `[face]` The {defwork} is held by the town at {settlement}. What it sets aside for the muster does not reach the wage.
2. `[unfolding]` The {defwork} of {settlement} is in the town's hands. Upkeep for its muster is a term unmet.
   - `[face]` At {settlement} the town is walled with the {defwork}. The account for its muster's pay is one the town has not answered.
   - `[face]` The town at {settlement}, the {defwork} its own, has the muster's wage unsettled.
   - `[face]` The town at {settlement} owns the {defwork}. What the muster's upkeep comes to is a charge not made good.

--- NOTES

## A. THE GATE'S FEEDBACK, ANSWERED MEASURE BY MEASURE

**REFUSAL, wall 10 across the join (T-F8) — ANSWERED, and answered past the letter of the rule.**
The rule has two limbs: the projector refuses ANY sentence-form face that opens on a `proper`-typed
slot (`dossier-annex-grammar.mjs:690-697`, `assertFaces`), and the grammar's own wall 10 allows the
settlement token to open at most one variant per pool and never two adjacent (MOVE-GRAMMAR §1.4
item 10; R-DA-17). Round 1 opened variant 1's numbered line and all three of its faces on
`{settlement}` and was refused whole. **In this packet not one of the eight wordings opens on
`{settlement}` — zero, not one** — so neither limb can fire on either limb's reading, and the
"never two adjacent" clause is vacuous here. Every wording opens on `The`, `At` or `What`; the
settlement token appears inside every wording, as the slot law requires, and opens none of them.

**`shapes.whichTailRate` (over) = 26.027 band-widths on 1 of 2 faces — ANSWERED.** The measure is
`rate(count(/, which\b/))` (`src/domain/prose/proseFingerprint.js:142`). The breaching text is the
SHIPPED variant 2, whose tail reads *which is the kind of arithmetic a town notices late*; it stayed
in the pool because round 1's packet was refused whole and no packet word was edited in. **This
packet contains no `which` at all — not as a tail, not as a relative, not as a word** — in any of
the eight wordings, so the pool's rate goes to zero the moment the packet lands. The measure cannot
move by any other act: it is a property of the shipped row, and the row is replaced or it is not.
That is the failing owned measure this round moves, so the round is not dry.

**Band DEPTH at most 1.75 band-widths on every face — reported.** No wording carries an em dash, an
exclamation, a question, a digit, a percent, a parenthesis, a colon, a semicolon, a quotation mark,
a `which`, an expletive opener (`There is` / `It is`), a participial opener, a triad, an antithesis
frame (`not X but`, `rather than`, `, not …`, `less … than`), a first or second person, a future
indicative, a figure, or an adverb in `-ly`. The one soft rule this pool exceeds deliberately is
R-DA-05's within-pool length spread, reported in §E below with its reason.

## B. THE CARD, AS THIS PACKET READS IT (one interpretive call, restated so it can still be vetoed)

The card licenses two measured reads — `forces.walls.present` and
`settlement.defenseProfile.economicGates.military` — and its `may claim` line names the gate alone.
This packet keeps BOTH halves of the old sentences' claim, on three grounds, and the chair can strike
the first half with one word if it reads the card the other way.

1. **This pool is a SPINE, and a spine's PRESENT move is licensed by the block's STATE-KEY**
   (MOVE-GRAMMAR §1.2 row 1: "a standing configuration field: the block's STATE-KEY"). The key is
   `WALLED-STRAINED` — *walls, impaired upkeep* — so the walled half and the strained half are one
   condition of the record, not two facts joined.
2. **`forces.walls.present` is carried as a MEASURED read, not merely a candidacy gate.** The card's
   own parenthetical distinguishes the two ("absent ⇒ no candidate; a modifier is silent, never
   'false'"), and the exemplar card at ARCH §8.3 refuses *a granary's presence* precisely because the
   granary is NOT among that card's reads. This card's `may NOT` refuses "another civic object of the
   class `wall`", which by its own wording leaves the first one available.
3. **The rewrite rule requires it.** Every claim the card licenses that the old sentence made is
   KEPT; both old sentences made the wall's presence their subject.

What is NOT licensed, and appears nowhere: the {defwork}'s CONDITION (sound, whole, well kept,
better than anything), because no read measures it. Every wording says the enclosure IS the town's
and nothing about how it fares. **If the chair reads `may NOT: a second fact` as reaching the
presence read as well, both variants lose their first sentence and the pool collapses to the gate
alone; that ruling is the chair's and this packet is written under the reading above.**

## C. WHAT EACH FACE CLAIMS, AND THE CARD CLAUSE THAT LICENSES EACH CLAIM

Both variants carry the same two-claim set, and the four faces of each variant are claim-equal to
each other (arm A6 reads across the faces).

**C1 — the {defwork} is present and is the town's.** Licensed by `reads: forces.walls.present
(measured)`, by the STATE-KEY's `WALLED` half (§B.1), and by `bag: {defwork: bare-common}` for the
noun. Realised, one wording each, never twice the same: *is the town's* (1) · *a work the town owns*
(1a) · *is {settlement}'s own* (1b) · *is held by the town* (1c) · *is in the town's hands* (2) ·
*the town is walled with* (2a) · *the {defwork} its own* (2b) · *the town owns the {defwork}* (2c).
No wording predicates a state of repair, an age, a builder, a circuit, a geometry or a second
wall-class object.

**C2 — the town's military upkeep gate is unmet.** Licensed by `reads:
settlement.defenseProfile.economicGates.military (measured)`, `predicate: military < 1`, and
`may claim: that military (< 1) holds, as a STANDING fact of the record`. Realised, one vocabulary
each: *paid short of the upkeep* (1) · *the outlay falls under the charge* (1a) · *what it costs runs
past its funding* (1b) · *what it sets aside does not reach the wage* (1c) · *a term unmet* (2) ·
*an account the town has not answered* (2a) · *the wage unsettled* (2b) · *a charge not made good*
(2c). **The gate is written as a shortfall and never as a non-payment**: `military < 1` is funding
below what upkeep comes to, not funding at zero, so no wording says the muster is unpaid, deserting,
thinning or absent.

**The slot bag.** `{settlement}` is licensed by `bag: {settlement: proper}` and `{defwork}` by
`bag: {defwork: bare-common}`. All eight wordings name exactly `{defwork} {settlement}` — the parent's
set — so the face slot rule (`assertFaces`, A6) and the pair instrument's SLOTS arm both hold, and
eligibility cannot differ inside the wording set.

**The moves, per variant, unchanged from round 1.** Variant 1 is **V4 (OBJECT → PRESENT)**: the named
enclosure, then the standing shortfall. Variant 2 is **V6 (PRESENT → OPEN)**: the walled state, then
the unmet term named as standing open — the OPEN QUESTION move's own licence (a term unmet, a wage
unsettled, an account unanswered, a charge not made good; declarative always, never interrogative).
All four faces of a variant keep that variant's move order, so no face disagrees with its `grammar:`
tag, and the pool of two carries two distinct level-1 grammars as MOVE-GRAMMAR §2.1 requires.

## D. WHAT WAS DROPPED, AND UNDER WHICH REFUSAL

Dropping these is the rewrite's purpose; the shipped wordings are the corpus's known state.

- Variant 1 dropped **the comparison of the wall's condition to the watch's** (*stands better than the
  watch that should man it*): a condition claim no read measures; a DUTY (*should man it*) absent from
  the institution table; and an office, *the watch*, the card does not hold — the C2 office arm
  licenses by vocabulary and `sheriff`, `constable`, `sergeant` are held by no instantiated role list
  (CLERK-LAWS §1.2 NOTE 2), so an uninstantiated guard office is cited or withheld, and it is withheld.
  The licensed noun for this field is the muster (the card's own `source` row).
- Variant 1 dropped **"stone keeps itself, and wages do not"**: a CAUSE (`may NOT`) and a life-general
  closer (R-DA-12's generalisation test). It is also the nearest thing in the block to a sibling's
  sentence, so keeping it would breach arm A1 as well.
- Variant 2 dropped **"is sound"** (a condition, `may NOT`), **"is thinning"** (a movement over time:
  the card licenses a STANDING value and refuses a season and a future), and **"which is the kind of
  arithmetic a town notices late"** (a `which` tail, a standpoint and a verdict — three refusals, and
  the pool's one failing measure).
- **Nothing was added.** No wording carries a count, a cause, a season, a future, a standpoint, a
  totality over persons, a belief frame, an exemption, a named character, a deity, a second
  wall-class object, or a claim about who mans, raised or repairs the work.

## E. FORM, BANDS AND SIBLING DISTANCE (reported, not gates)

- **Word counts.** Variant 1: 15 · 19 · 14 · 21. Variant 2: 17 · 22 · 13 · 19. Pool mean 17.5,
  standard deviation 3.08 — under R-DA-05's within-pool floor of 4.0, and reported as the one soft
  rule this pool exceeds deliberately. With one licensed assertion and one licensed noun, a longer
  line can only be bought with an unlicensed claim or with padding, and the density law (§21.4)
  forbids buying a metric with either. The spread was widened where a longer or shorter line was the
  better sentence and nowhere else: 2a carries the town's non-answer in full, 2b is a single
  appositive sentence of thirteen words.
- **Sibling distance (arms A1 and A11).** Round 1 restated three sibling wordings and this round
  removes all three: *holds its place* (`WALLED-THREATENED` 1a), *belongs to the town*
  (`WALLED-THREATENED` 2c) and *has its {defwork}* (`WALLED-THREATENED` 3c). This packet also avoids
  the verbs the two quiet-and-threatened pools own outright — *stands*, *standing*, *is possessed of*,
  *is up*, *keeps*, *entered*, *carried*, *walled by*, *a fixture of*, *takes the form of*, *to
  {settlement}'s name* — so no wording here restates or contradicts a sibling spine. The one shared
  verb is *owns*, used once in each variant in a different rhythm and a different clause position.
- **Provenance, deliberately unspent.** The card marks `source: muster · standing LICENSED`, so a
  citation would be lawful, but §24's ceiling permits one only for two accounts that disagree, a count
  from an interested party, or a record whose keeper is a power, and none of the three holds here; the
  exemplar registers with raw text cite at zero per 786 sentences. No wording names a record-holder,
  and no wording says *on the books* or *by the roll*: the office does not cite its own books
  (MOVE-GRAMMAR §4.4.3).
- **THE THREAD.** This pool is a SPINE, so each wording is written to OPEN a passage rather than to
  follow one, and to read the same after any sibling modifier. Inside each wording the second
  sentence carries a noun forward from the first — *the town* or its *its* — so the shift from the
  enclosure to the purse is threaded and never a mid-passage disconnect: *is the town's → Its muster*
  (1), *the town owns → its muster* (1a), *the town's muster* (1b), *the town → What it sets aside*
  (1c), *the town's hands → its muster* (2), *the town → its muster's pay* (2a), one sentence (2b),
  *The town → the muster's upkeep* (2c). Every wording ends on the civic thing a modifier can pick
  up — the upkeep, the charge, the funding, the wage, the term, the account, the charge again — and
  none turns outward, since the turn outward belongs to the modifier that follows.
- **Openers.** Within every wording the two sentences open on different words, so the pool adds no
  `openers.sameOpenerAsPreviousRate` hit; across the pool the openers are *The* (five), *At* (two)
  and, at the sentence level, *What* (three) and *Upkeep* (one).

## F. TWO HAZARDS FOR THE CHAIR, NEITHER A REFUSAL

1. **`{defwork}` is NAMED BUT NEVER FILLED at this block's call sites** (the card's own `bag` row),
   while `{settlement}` is filled. Every wording here uses `{defwork}`, because the BEFORE sentences do
   and the pair instrument fails a rewrite that changes the slot set. If the block lights while
   `{defwork}` resolves to nothing, all eight wordings render with an unfilled marker. That is a
   wiring row, not a text law, and the block landed dark; it is raised so it is not met at first render.
2. **The wall name class includes a PLURAL member.** `defenseGenerator.js` mints `'wall'`,
   `'citadel'`, `'palisade'`, `'earthwork'`, `'inner citadel'` and **`'massive walls'`**, and every
   `a {defwork} is …` construction in this block's siblings breaks agreement on the last of them
   (*a massive walls*, *massive walls is*). This packet uses **`the {defwork}`** or a bare possessive in
   all eight wordings, so every one of them reads correctly on the plural fill as well as the singular.
   The siblings' rows are not this packet's to change; the hazard is raised for whoever holds them.

## G. REFUSALS

**None.** Both variants are written, both carry four wordings, and both are lawful under the reading
declared in §B. No variant is banked, and nothing was trimmed: the pool's two variants keep their
vids, their order and their angle tags, and the face count rises from one to four on each.
