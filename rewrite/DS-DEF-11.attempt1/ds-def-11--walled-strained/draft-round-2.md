Seat: Opus 5 (Fable-unvalidated) · REWRITE draft round 2 · block DS-DEF-11 · pool key `WALLED-STRAINED`
Written 2026-09-09. Nothing outside this file was written; no dock was entered, no test was run.
The only command executed was the read-only licence-card script in `laneRW-DEF11`.

# DS-DEF-11 · `WALLED-STRAINED` — the rewritten variant rows

Two existing variants, rewritten in place under their own numbers, in their own order, with their
bracketed angle tags untouched. No variant added, none removed, none merged. Each variant is one
`[plain]` line — the numbered row's own text, per the grammar ruling at NOTE A — and three `[face]`
sub-rows: four wording faces, each a different vocabulary or rhythm inside the voice, none a
paraphrase of a sibling, every one standing alone because the render draws one face unweighted.

The pool's typed lines (ROLE, READS, RELATION, ATTACH, FORM, MOVE) are not mine and are not
repeated here.

---

## THE PASTE BLOCK

The bold heading below is shown for placement only; it already stands in
`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` under `### DS-DEF-11`, at line 5993 of the dock's
copy. What replaces the pool's current variant rows is the two numbered rows and their six
sub-rows, verbatim, with the three-space indent on every `- ` sub-row.

**`WALLED-STRAINED`**
1. `[ledger]` The {defwork} at {settlement} stands, and the muster is short of its funding.
   - `[face]` On the muster roll at {settlement} the pay is under its due, and the {defwork} holds.
   - `[face]` The wage roll at {settlement} is not met. The town's {defwork} is in place.
   - `[face]` Wages at {settlement} run short of the roll, and the {defwork} stands.
2. `[unfolding]` Pay for {settlement}'s muster stands open on the roll, and the {defwork} is up.
   - `[face]` Funding for the muster at {settlement} falls short of its wage, and the {defwork} holds.
   - `[face]` The pay due the muster is not made up at {settlement}. The town has its {defwork}.
   - `[face]` At {settlement} the muster is not paid to its full wage, and the {defwork} is in place.

---

## THE ROWS BEFORE (for the chair's eye; not part of the paste)

1. `[ledger]` {settlement}'s {defwork} stands better than the watch that should man it; stone keeps itself, and wages do not.  (eighteen words)
2. `[unfolding]` The {defwork} around {settlement} is sound and the muster behind it is thinning, which is the kind of arithmetic a town notices late.  (twenty-three words)

---

# --- NOTES

## A. THE GATE'S REFUSAL, ANSWERED — the numbered row carries ONE tag, and it is the ANGLE

Round 1 wrote `1. \`[ledger]\` \`[plain]\` …` on both numbered rows and was REFUSED as malformed
under ARCH §2.5 (R-DOS-G), convicted by execution: `marks: ["plain"]`, the projection contract red
with `unclassified: [ 'plain' ]`. The refusal is correct and the round-1 rows are withdrawn. The
cure is read off the projector and off the corpus, not guessed:

- The projector's own docblock states the row form: `` N. `[angle · tag]` text `` — ONE bracket
  slot, whose first token is the `angle` and whose remainder is `marks` (`rest.slice(1)`).
  `foldTags` takes a SECOND bracket as `extra` and pushes `extra.angle` into `marks`, which is
  exactly how `[plain]` became an unclassified mark.
- Across the whole of `RECEIPT_POOLS_DOSSIER_STATE.md`, numbered rows carrying a literal `[plain]`
  tag: **zero**. The nine `[face]` rows already in the file all hang off a numbered row whose one
  tag is its angle.
- The block's own already-rewritten sibling pool `WALLED-THREATENED` is the shipped exemplar of the
  grammar: `` 1. `[ledger]` <text> `` then three `` ␣␣␣- `[face]` <text> `` rows.

**Ruled for this packet:** the `[plain]` line is the numbered row's own text, structurally, not a
written tag. The angle tag stands as it stands and is not touched; the packet adds no second
bracket anywhere. The brief's phrase "its bracketed tag exactly as it stands, a `[plain]` line" is
read as one row bearing the angle tag and carrying the plain wording, which is the only reading
the projector accepts.

## B. THE FAILING MEASURE, MOVED — `shapes.whichTailRate`

The gate reported `shapes.whichTailRate` OVER by **26.027 band-widths on 1 of 2 faces**, against an
ENTRY-grain DEPTH ceiling of 1.75 band-widths (Part B §16.2). The measurement was taken on the
pool's SHIPPED rows, which the round-1 refusal left in place; the offending tail is variant 2's
`which is the kind of arithmetic a town notices late`.

- The exemplar band for this shape is **0.0000 to 0.0370** (Part B §11, the D1–D8 correction row),
  so the band's floor is zero and a rate of zero is INSIDE the band, not under it.
- These rows contain the token `which` **zero times** in eight faces. Sixteen sentences, no
  relative tail of any kind, no `, which`, no `which is`, no `which means`.
- Therefore `whichTailRate` = 0.0000, depth 0.00 band-widths, inside band on 2 of 2 variants and on
  8 of 8 faces. The failing owned measure moves. This round is not dry.

Wall 6 of MOVE-GRAMMAR §1.4 (`QUALIFY never as a "which" tail; never a third sentence`) is held
twice over: no face runs past two sentences either, so R-DA-03's 3+-segment share also stays at
zero for this pool.

## C. The licence card this draft was written against

Printed by `node scripts/prose-licence-card.mjs DS-DEF-11 'WALLED-STRAINED'` in the dock, verbatim
in its load-bearing lines:

- `reads:` `forces.walls.present` (measured) and `settlement.defenseProfile.economicGates.military`
  (measured); absent implies no candidate, and a modifier is silent, never "false".
- `predicate:` `settlement.defenseProfile.economicGates.military < 1`
- `bag:` `{defwork: bare-common, settlement: proper}`; FILLED at this block's call sites
  `{settlement}`; NAMED BUT NEVER FILLED `{defwork}`.
- `relation:` a spine takes no relation. `seat/form:` not a seat-taker, sentence. `move:` none
  declared. `angle:` ledger, unfolding.
- `source:` muster, standing LICENSED; a citation of this holder is licensed where the provenance
  budget allows.
- `may claim:` that `military` (< 1) holds, as a STANDING fact of the record.
- `may NOT:` a count, a cause, a season, a future, a standpoint, a second fact, another civic
  object of the class `wall`.
- `audience:` player, no mark. REFUSED COLUMNS always: a totality over persons; an exemption from a
  duty; a named character and that character's fate; a theological claim.

## D. The claim set every face carries, and the clause that licenses each claim

Two claims, and only two. All eight faces carry both and nothing else, so the faces are
claim-equal to each other (arm A6) and the two variants cohere in structural fact (CLERK-LAWS C5).
The claim set is unchanged from round 1; only the wording, the construction and the tag form moved.

- **K1 — this settlement holds a defence work of the wall class, and it is present and standing.**
  Licensed by the card's `reads` line, first path, `forces.walls.present` (measured). A declared
  read is not optional: ARCH §4.4's walker arm A0b convicts an UNDER-claim, "a declared field the
  text never claims", so K1 must be asserted and not merely presupposed. The predicate of presence,
  and nothing beyond presence, is what each face states: `stands`, `holds`, `is in place`, `is up`,
  `has its {defwork}`.
- **K2 — the paid military establishment is funded below what it requires.** Licensed by the card's
  `predicate` line, `economicGates.military < 1`, and stated under the card's `may claim` line as a
  STANDING fact of the record: `short of its funding`, `the pay is under its due`, `the wage roll
  is not met`, `run short of the roll`, `stands open on the roll`, `falls short of its wage`, `not
  made up`, `not paid to its full wage`.
- **The slots** are exactly the card bag and exactly the set both BEFORE rows carried: `{settlement}`
  (proper) once and `{defwork}` (bare-common) once in every face, the numbered rows included. The
  SLOTS arm compares sets; no face adds or drops one.
- **No third claim anywhere.** No face states a relation between the wall and the paid force, no
  face states a cause, a count, a season, a future, a standpoint or a second civic object of the
  class `wall`. The two facts sit side by side; nothing joins them but coordination or adjacency,
  which asserts no edge.

### Face by face — the clause behind each claim

Variant 1 `[ledger]`, the roll and the sum:

| # | face | K1 licensed by | K2 licensed by | construction | words |
|---|---|---|---|---|---|
| 1.0 | `[plain]` The {defwork} at {settlement} stands, and the muster is short of its funding. | `reads` · `forces.walls.present` | `predicate` + `may claim` | K1 first, coordinate | 13 |
| 1.1 | On the muster roll at {settlement} the pay is under its due, and the {defwork} holds. | `reads` · `forces.walls.present` | `predicate` + `may claim` | fronted record adjunct, K2 first | 16 |
| 1.2 | The wage roll at {settlement} is not met. The town's {defwork} is in place. | `reads` · `forces.walls.present` | `predicate` + `may claim` | two sentences, the thread on the town | 14 |
| 1.3 | Wages at {settlement} run short of the roll, and the {defwork} stands. | `reads` · `forces.walls.present` | `predicate` + `may claim` | bare-noun opener, short line | 12 |

Variant 2 `[unfolding]`, the term left standing open:

| # | face | K1 licensed by | K2 licensed by | construction | words |
|---|---|---|---|---|---|
| 2.0 | `[plain]` Pay for {settlement}'s muster stands open on the roll, and the {defwork} is up. | `reads` · `forces.walls.present` | `predicate` + `may claim`, read as the STANDING-OPEN specialisation of PRESENT (MOVE-GRAMMAR §1.2 move 10: a state field whose value is a term unmet), declarative, never an interrogative | K2 first, the open term named | 14 |
| 2.1 | Funding for the muster at {settlement} falls short of its wage, and the {defwork} holds. | as above | as above | gerund opener, coordinate | 15 |
| 2.2 | The pay due the muster is not made up at {settlement}. The town has its {defwork}. | as above | as above | two sentences, closing on the object | 16 |
| 2.3 | At {settlement} the muster is not paid to its full wage, and the {defwork} is in place. | as above | as above | fronted place adjunct | 17 |

The `[unfolding]` angle is carried by the OPEN reading of the same predicate — a wage that stands
unmet is a term standing open — not by a second claim and not by a trajectory. The angle tag is
not mine to touch and was not touched.

## E. The walls and bands each face was checked against

Checked by hand against the walls of Part B §16 (2), MOVE-GRAMMAR §1.3, §1.4 and §1.4.1, ARCH §2.5,
and the register card with amendments S2 and S3.

- **Walls.** No em dash, no exclamation, no digit, no percent, no question mark, no `which`, in any
  face or numbered row. No future indicative, no `will`, no `shall`: STATE never FATE (A2; NL-6).
  No figure, no sense verb on an abstraction, no inanimate intent (R-DA-11) — every verb is a
  copula or a measurement verb (`stands`, `holds`, `is in place`, `is up`, `has`, `run short`,
  `falls short`, `is not met`, `is not made up`, `is not paid`, `stands open`).
- **Sentence count.** Six faces are one sentence, two are two sentences (1.2 and 2.2); no face
  reaches three, so R-DA-03's third-segment arm cannot fire. No semicolon and no colon anywhere,
  so amendment S2's clause seat stays open on every face.
- **THE THREAD (MOVE-GRAMMAR §1.4.1).** A spine sits FIRST in the composed passage, so its own
  second sentence cannot be the passage's one turn outward. Both two-sentence faces therefore hand
  a noun forward rather than turning: 1.2's second sentence carries `{settlement}` forward as
  `the town's`, and 2.2's as `the town`. Every face closes on a civic thing a following modifier
  can pick up — the funding, the {defwork}, the roll — so each reads as well after a sibling
  modifier as it does directly after nothing.
- **A11 spread.** Eight distinct first-two-word openers across the pool: `The {defwork}` · `On the`
  · `The wage` · `Wages at` · `Pay for` · `Funding for` · `The pay` · `At {settlement}`. The two
  numbered rows open `The {defwork}` and `Pay for`, so the variant-level rule is held with room.
  Sentence counts are no longer uniform across the pool (1 and 2 both carry a two-sentence face),
  which is a gain against the FLATTENED arm; the BEFORE was uniform at one sentence.
- **Order wall 10 / R-DA-17.** No row and no face opens on the `proper`-typed slot, which is also
  ARCH §2.5's T-F8 refusal for a sentence-form row. Both BEFOREs opened on `{settlement}` or on
  `The {defwork} around {settlement}`; the settlement-token opener is now zero across the pool.
  One face (2.3) carries the token in second position, behind `At`.
- **R-DA-04, the close.** The close kinds are a condition (six) and an object (2.2, closing on
  `{defwork}`). No face closes on a pronoun, so `closers.pronounRate` for this pool is 0.000.
- **Rationed patterns.** Zero instances of `rather than`, `which is`, `which means`, `nobody`,
  `no one`, `nothing`, `its own`, `whatever`, `enough to`, `enough that`, `kind of`, `sort of`,
  `quiet`, `still`, `yet`, `already`, `regardless`, `in any case`. The BEFORE of variant 2 carried
  `which is` and `kind of`; both fall to zero, which no arm penalises.
- **Antithesis shape** stays at zero, as in both BEFOREs: no `not X but`, no `, not X.`, no
  `less X than`. Variant 1's BEFORE comparative, `stands better than the watch`, is gone for the
  claim reason at REF-2, not for a shape reason.
- **DURATION, TIME and COUNT words.** None appears in any face and none appeared in either BEFORE,
  so none is added and none is lost. `full wage` and `its due` are band words against a
  requirement, never a quantity: no numeral, no number word, no headcount.
- **Sibling distance (arms A1 and A11), measured against the block's other four pools.** The
  siblings own `danger`, `country`, `books`, `account`, `entry`, `repair`, `upkeep`, `charge`,
  `cost`, `bears`, `working fabric`, `in service`, `mended`, `sound`, `fit for use`, `enclosure`,
  `closed against`, `present peace`, `cheaper`, `easier to keep than to raise`, `pays little`,
  `built work`, `patience`, `too small to wall`, `safety`, `neighbours`, `distance`,
  `unimportance`, `agree to differ`, `buys stone`, `confidence`, `thrift`, `openness`, `statement`,
  `weight`, `circuit`, `defense money`. **Not one of those words appears in this packet.** This
  pool's field is the muster, the roll, the wage, the pay, the funding and the wages, which no
  sibling pool touches. `stands` is shared with two siblings and is kept deliberately: it is the
  block's licensed predicate for wall presence, and the register card holds that the WORD may
  recur where the FACT does not.

## F. Density, the ceiling, and what moved since round 1 (Part B §21.1 to §21.4)

Word counts — variant 1: thirteen, sixteen, fourteen, twelve. Variant 2: fourteen, fifteen,
sixteen, seventeen. Round 1's range was eleven to sixteen; this round's is twelve to seventeen,
against a block that ships at fifteen to twenty-six. Nothing was made plainer: every face gained
either a record noun the licence already holds (`the muster roll`, `the wage roll`, `its due`,
`its full wage`) or a construction that carries the same two claims in a different shape.

Round 1's own declared weakness was that all eight faces were coordinate — "the fact, and the
fact" — differing in lead noun and length but not in construction. That is the target this round
moved, under §21.1's ceiling rule and §21.3's one-effort rule:

| construction | round 1 | round 2 |
|---|---|---|
| coordinate, K1 first | 2 | 1 |
| coordinate, K2 first | 6 | 3 |
| fronted adjunct (record or place) | 0 | 2 |
| two sentences, the thread carried | 0 | 2 |

The trade §21.3 names was taken twice, both times for the licensed wording. Round 1's `garrison`
is withdrawn from every face: a garrison is troops stationed in a fortification, so the word
re-asserts by implication the very wall-to-force link the engine denies (ARCH T-F2: the generator
exempts built walls from the pay gate and no engine edge has `walls` as an endpoint), which is the
card's refused `a second fact`. `the military account` is withdrawn as well, because
`WALLED-THREATENED` already owns `account` and `books` at two of its faces and A1 refuses the
restatement. Both replacements — `the muster roll`, `the wage roll` — are the gate's own record
objects and cost nothing in density.

**The sharpest remaining target, named for the refiner rather than hidden.** The noun `muster`
carries K2 in six of the eight faces, because the licence holds exactly one object for that claim
and R-DA-10's per-pool noun variation is bounded above by the licence. The varied nouns available
are the records around it — the roll, the wage roll, the muster roll, the pay, the funding, the
wages — and all six are used. A refiner wanting a seventh noun must either get a licence for one or
accept the repetition as the licence's own shape.

## G. REFUSALS

**REF-1 — the provenance move is refused across this face set, though the card licenses the
holder.** The card names the muster a LICENSED standing source and says a citation is licensed
"where the provenance budget allows". The budget does not allow it here, on three grounds, of
which the first is decisive and is sharper than round 1's:
- Part B §24 sets the provenance ceiling at one citation per unit **and only for one of S3's three
  reasons**: two accounts that disagree, a count from an interested party, a record whose keeper is
  a power. This pool holds none of the three — one account, no count (a count is the card's own
  refused column), and no typed fact making the muster a power.
- MOVE-GRAMMAR §4.4.3: "a citation on a fact whose holder is the office itself is a finding — the
  office does not cite its own books." The compiling office holds the muster roll.
- A single citing face would carry a claim its three siblings do not, and arm A6 requires the four
  faces to be claim-equal; citing in all four is the citation habit §24 makes a refuter's finding,
  against exemplar registers that cite at zero per 786 sentences.

Naming `the muster roll`, `the wage roll` or `the roll` as the record that is short is a PRESENT
move on a record object, not a provenance move, and is recorded here as the reading this draft
used. *For the chair: whether a provenance face may be claim-unequal to its siblings, or whether
provenance belongs to a variant rather than to a face, is not a call this seat can make.*

**REF-2 — variant 1: three claims removed as unlicensed.** Ruling 5, as R-DA-15 states it, is the
authority: an unlicensed claim "is not a claim the pool was entitled to hold", its removal is
required, and the B-CLAIM bar is not engaged. So this rewrite does not preserve the BEFORE's whole
claim set, and the departure is declared rather than quiet.
- `stone keeps itself, and wages do not` is a general law about the world: the card's refused
  `a cause`, R-DA-12's generalisation test, and the MEANING non-move of MOVE-GRAMMAR §1.3.
  `Stone keeps itself` is also inanimate intent, which R-DA-11 refuses.
- `the watch that should man it` asserts a link between the wall and the paid force. The engine
  denies that link (ARCH T-F2). Under the card that is `a second fact`. Separately, `the watch` is
  the civic object of this block's own sibling modifier pool `watch: bought` (ARCH §6.3), so a
  spine naming it restates a sibling.
- `stands better than` is the same unlicensed link stated as a relative measurement.

**REF-3 — variant 2: four claims removed as unlicensed**, under the same authority. This is the
refusal that clears the gate's reported measure.
- `which is the kind of arithmetic a town notices late` is a `which` tail (wall 6; R-DA-03), a
  standpoint (the card's refused list) and a gnomic closer (R-DA-12). It carried two rationed
  patterns as well. **This is the text behind `shapes.whichTailRate` at 26.027 band-widths; the
  packet removes it and the measure goes to zero.**
- `is thinning` asserts a trajectory. No trend field is read here, and R-DST-B rules that a
  standing configuration field licenses a structural clause and never a historical one.
- `around {settlement}` asserts geometry. The block's own wall class includes `inner citadel`,
  which does not surround a town, so the claim is false for part of the class; MOVE-GRAMMAR's
  PRESENT row refuses a spatial fact the field does not hold.
- `is sound` asserts a maintenance condition. The read is presence, not condition; the block's
  recorded law is that built walls keep standing, which licenses `stands` and not `sound`.

**REF-4 — a wiring row, not a text law: `{defwork}` is NAMED BUT NEVER FILLED at this block's call
sites**, on the card's own printing. A piece with an unfillable slot drops itself (ARCH §0, step
six), so every variant of this pool may be silent at render today. The slot is kept in all eight
faces because the SLOTS arm fails any face whose slot set differs from the BEFORE's, and because a
slot is not a wording. Raised for the chair, not cured here. Carried unchanged from round 1.

**REF-5 — a sitting question, carried unchanged from round 1.** Once the unlicensed decoration is
gone, the two variants assert the same two claims and are told apart only by their angle and their
grammar. That is lawful and C-sibling asks exactly that, but the pool's semantic width is now
visibly the width of its licence: one key, two reads. Whether `WALLED-STRAINED` should carry two
variants of one claim set, or whether the second wants a licence of its own, is a sitting question
and is not decided here.

**Not lawful, refused, or banked: none of the eight faces.** Both variants are written and both are
lawful as written. The refusals above are a licensed move this seat may not take (REF-1), two
declared claim removals the licence compels (REF-2, REF-3), a wiring finding (REF-4) and a sitting
question (REF-5).
