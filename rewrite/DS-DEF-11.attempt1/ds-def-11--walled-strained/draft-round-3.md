Seat: Opus 5 (Fable-unvalidated) · REWRITE draft round 3 · block DS-DEF-11 · pool key `WALLED-STRAINED`
Written 2026-09-09. Nothing outside this file was written; no dock was entered, no test was run.
The only command executed was the read-only licence-card script in `laneRW-DEF11`.

# DS-DEF-11 · `WALLED-STRAINED` — the rewritten variant rows

Two existing variants, rewritten in place under their own numbers, in their own order, with their
bracketed angle tags untouched. No variant added, none removed, none merged. Each variant is one
`[plain]` line — the numbered row's own text, per the grammar ruling carried at NOTE A — and three
`[face]` sub-rows: four wording faces, each a different vocabulary or rhythm inside the voice, none
a paraphrase of a sibling, every one standing alone because the render draws one face unweighted.

The pool's typed lines (ROLE, READS, RELATION, ATTACH, FORM, MOVE) are not mine and are not
repeated here.

**What moved this round: one face.** The gate's one failing owned measure is
`shapes.participialOpenerRate`, over by 28.24 band-widths on vid 2 face 1 and on that face alone.
It is cured at its cause and the other seven faces are left byte-identical, deliberately — the
reason is arithmetic, not timidity, and it is set out at NOTE B.

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
   - `[face]` The roll at {settlement} sets a wage above what the muster is paid, and the {defwork} holds.
   - `[face]` The pay due the muster is not made up at {settlement}. The town has its {defwork}.
   - `[face]` At {settlement} the muster is not paid to its full wage, and the {defwork} is in place.

---

## WHAT CHANGED SINCE ROUND 2 (one line, the whole diff)

| vid · face | round 2 | round 3 |
|---|---|---|
| 2 · face 1 | Funding for the muster at {settlement} falls short of its wage, and the {defwork} holds. | The roll at {settlement} sets a wage above what the muster is paid, and the {defwork} holds. |

Every other row is byte-identical to round 2. The claim set is unchanged on every face, this one
included: two claims, K1 and K2, as NOTE D sets them out.

---

## THE ROWS BEFORE THE REWRITE (for the chair's eye; not part of the paste)

1. `[ledger]` {settlement}'s {defwork} stands better than the watch that should man it; stone keeps itself, and wages do not.  (eighteen words)
2. `[unfolding]` The {defwork} around {settlement} is sound and the muster behind it is thinning, which is the kind of arithmetic a town notices late.  (twenty-three words)

---

# --- NOTES

## A. The grammar form, carried unchanged from round 2 and confirmed by the gate

Round 1 wrote a second bracket (`` 1. `[ledger]` `[plain]` … ``) and was REFUSED as malformed under
ARCH §2.5 (R-DOS-G): the projector reads ONE bracket slot whose first token is the ANGLE and whose
remainder is `marks`, so `[plain]` arrived as an unclassified mark. Round 2 wrote the numbered row
as its angle tag plus the plain wording, and the gate parsed the pool as two variants and eight
faces (its own words: "on 1 of 8 face(s)"), which is the receipt that the form is right. Round 3
does not touch it. The angle tags `[ledger]` and `[unfolding]` are not mine and were not touched.

## B. THE FAILING MEASURE, MOVED — `shapes.participialOpenerRate`, and why exactly one face moved

**The gate's report.** `shapes.participialOpenerRate` (over) = 28.24 band-widths on 1 of 8 faces,
vid 2 face 1, against the ENTRY-grain DEPTH ceiling of 1.75 band-widths (Part B §16.2).

**The cause, read off the instrument rather than guessed.** `src/domain/prose/proseFingerprint.js`
computes the measure as the share of SENTENCES whose first word ends in `ing` and is not on the
`NOT_PARTICIPLES` exception list. The word `Funding` ends in `ing` and is not on that list, so the
detector fires on it whether or not it is doing participial work in the sentence. The face is one
sentence, so its rate was 1.0000 — the ceiling of the metric, not a shading of it.

**The arithmetic that follows from the entry grain, and that governs this round.** At the ENTRY
grain a face is the unit and a one-sentence face has one sentence in its denominator, so ANY
shape-metric feature present in a one-sentence face scores 1.0000 and every such metric's band has
a floor at or near zero. A single semicolon, colon, parenthesis, question mark, `, which`, triad,
doubled adjective or `-ing` opener anywhere in a one-sentence face is therefore not a shading but a
band blow-out of the same order as this one. Six of the eight faces here are one sentence. This is
the whole reason round 3 changes one face and not eight: under §21.2 an unlawful set keeps its
round only if the failure count falls or holds WITH NO NEW FAILURE, and every discretionary edit to
a lawful one-sentence face is a coin toss against a metric whose entry-grain resolution is binary.

**The cure and its measurement.** The replacement face opens on `The`. Across the pool the sentence
openers are now `The` · `On` · `The` · `The` · `Wages` · `Pay` · `The` · `The` · `The` · `At`, in
the ten sentences the eight faces and two numbered rows hold. **Words ending in `ing` in first
position: zero.** `shapes.participialOpenerRate` = 0.0000 on 8 of 8 faces and on both numbered
rows, depth 0.00 band-widths, inside band. The failing owned measure moves. **This round is not
dry.**

**No measure was traded for it.** The replacement face was written against the detector list in
`proseFingerprint.js` line by line, and carries: no semicolon, no colon, no em dash, no question
mark, no exclamation, no parenthesis, no digit, no quotation mark; no `, which`; no `not X but`, no
`rather than`, no `, not` + lower case, no `less X than`, so `shapes.antithesisRate` stays 0; one
comma only, so the triad pattern (two commas then `and`) cannot match; the only ` and ` in the face
is preceded by a comma, so the doubled-adjective pattern cannot match; no word ending in `ly`, so
`shapes.adverbsPerSentence` stays 0; it does not open `There is` / `It is`; it is one sentence of
seventeen words, so `shareUnder8` and `shareOver30` are both 0 and `sameOpenerAsPreviousRate` has an
empty numerator; it closes on `holds`, which is neither an abstract-noun suffix nor a pronoun, so
both closer rates stay 0.

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
The claim set is unchanged from round 2, which was unchanged from round 1 in substance.

- **K1 — this settlement holds a defence work of the wall class, and it is present and standing.**
  Licensed by the card's `reads` line, first path, `forces.walls.present` (measured). A declared
  read is not optional: ARCH §4.4's walker arm A0b convicts an UNDER-claim, "a declared field the
  text never claims", so K1 is asserted and not merely presupposed. The predicate of presence, and
  nothing beyond presence, is what each face states: `stands`, `holds`, `is in place`, `is up`,
  `has its {defwork}`.
- **K2 — the paid military establishment is funded below what it requires.** Licensed by the card's
  `predicate` line, `economicGates.military < 1`, and stated under the card's `may claim` line as a
  STANDING fact of the record: `short of its funding`, `the pay is under its due`, `the wage roll is
  not met`, `run short of the roll`, `stands open on the roll`, `sets a wage above what the muster is
  paid`, `not made up`, `not paid to its full wage`.
- **The slots** are exactly the card bag and exactly the set both BEFORE rows carried: `{settlement}`
  (proper) once and `{defwork}` (bare-common) once in every face, the numbered rows included. The
  SLOTS arm compares sets; no face adds or drops one.
- **No third claim anywhere.** No face states a relation between the wall and the paid force, a
  cause, a count, a season, a future, a standpoint or a second civic object of the class `wall`. The
  two facts sit side by side; nothing joins them but coordination or adjacency, which asserts no
  edge.

### Face by face — the card clause behind each claim

Variant 1 `[ledger]`, the roll and the sum:

| # | face | K1 licensed by | K2 licensed by | construction | words |
|---|---|---|---|---|---|
| 1.0 | `[plain]` The {defwork} at {settlement} stands, and the muster is short of its funding. | `reads` · `forces.walls.present` | `predicate` + `may claim` | K1 first, coordinate | 13 |
| 1.1 | On the muster roll at {settlement} the pay is under its due, and the {defwork} holds. | `reads` · `forces.walls.present` | `predicate` + `may claim` | fronted record adjunct, K2 first | 16 |
| 1.2 | The wage roll at {settlement} is not met. The town's {defwork} is in place. | `reads` · `forces.walls.present` | `predicate` + `may claim` | two sentences, the thread on the town | 14 |
| 1.3 | Wages at {settlement} run short of the roll, and the {defwork} stands. | `reads` · `forces.walls.present` | `predicate` + `may claim` | bare-noun opener, the short line | 12 |

Variant 2 `[unfolding]`, the term left standing open:

| # | face | K1 licensed by | K2 licensed by | construction | words |
|---|---|---|---|---|---|
| 2.0 | `[plain]` Pay for {settlement}'s muster stands open on the roll, and the {defwork} is up. | `reads` · `forces.walls.present` | `predicate` + `may claim`, read as the STANDING-OPEN specialisation of PRESENT (MOVE-GRAMMAR §1.2 move 10: a state field whose value is a term unmet), declarative, never an interrogative | K2 first, the open term named | 14 |
| 2.1 | The roll at {settlement} sets a wage above what the muster is paid, and the {defwork} holds. | as above | as above; the shortfall stated as a MEASUREMENT IN WORDS between the wage the record fixes and the wage paid, which is the register card's licensed form of a comparison | the record is the subject; comparative; K2 first | 17 |
| 2.2 | The pay due the muster is not made up at {settlement}. The town has its {defwork}. | as above | as above | two sentences, closing on the object | 16 |
| 2.3 | At {settlement} the muster is not paid to its full wage, and the {defwork} is in place. | as above | as above | fronted place adjunct | 17 |

The `[unfolding]` angle is carried by the OPEN reading of the same predicate — a wage that stands
unmet is a term standing open — not by a second claim and not by a trajectory. The angle tag is not
mine to touch and was not touched.

## E. The new face, examined on its own (vid 2, face 1)

**"The roll at {settlement} sets a wage above what the muster is paid, and the {defwork} holds."**

- **The claim, and that it is the same claim.** The face asserts K2 as a comparison between the wage
  the record fixes and the wage the muster is paid, and K1 as presence. It does NOT assert that the
  muster is unpaid, which would over-claim `military < 1` into `military = 0`; the comparative keeps
  the claim at BELOW ITS REQUIREMENT, exactly as `short of its funding`, `under its due` and `not
  paid to its full wage` do on the sibling faces. No numeral and no number word appears, so the
  card's refused `count` is not touched: a comparison is a measurement in words (register card;
  R-DA-11).
- **Why `sets` and not `shows`.** `shows` is the verb of MOVE-GRAMMAR §4.4.3's own citation example
  ("the toll roll, which the Salters keep, shows…"), so a record that SHOWS a fact reads as the
  PROVENANCE move, which REF-1 below refuses for this face set on budget. `sets` states what the
  record fixes and attributes nothing to a source's testimony. It is no further from the office than
  round 2's already-standing `On the muster roll at {settlement} the pay is under its due`, which
  locates the same fact on the same record.
- **Why `sets` is not inanimate intent (R-DA-11).** A record that sets, carries or says a figure is
  the estate's own clerical idiom, not an ascribed will: ARCH §2.5's exemplar annex row is written
  `thinner than the wage roll says`. The verb reports the reading of the record; it gives the roll
  no purpose, no preference and no act. Declared here so a refuter can rule against it on the record
  rather than have to find it.
- **Sibling distance inside variant 2 (arm A6's companion, the never-a-paraphrase rule).** The three
  siblings take the PAY, the MUSTER and the PLACE as their subjects (`Pay for {settlement}'s
  muster…`, `The pay due the muster…`, `At {settlement} the muster…`). This face takes THE RECORD as
  its subject and states the shortfall as a relation between two amounts rather than as a negated
  payment; it is the only face in the pool that carries K2 without a negation. Vocabulary reaching
  no sibling face: `sets`, `above`, `what`.
- **Sibling distance from the block's other four pools (arms A1 and A11).** The siblings own
  `danger`, `country`, `books`, `account`, `entry`, `enters`, `repair`, `upkeep`, `charge`, `cost`,
  `bears`, `carries`, `working fabric`, `in service`, `mended`, `sound`, `fit for use`, `enclosure`,
  `closed against`, `present peace`, `ahead of any present need`, `cheaper`, `easier to keep than to
  raise`, `pays little`, `built work`, `patience`, `too small to wall`, `safety`, `neighbours`,
  `distance`, `unimportance`, `agree to differ`, `buys stone`, `confidence`, `thrift`, `openness`,
  `statement`, `weight`, `circuit`, `defense money`. **Not one of those words appears in this
  packet.** `carries` and `enters` were both candidate verbs for this face and were both put aside
  for that reason.
- **THE THREAD (MOVE-GRAMMAR §1.4.1).** One sentence, so no internal hand-forward is owed. As a
  SPINE this face sits first in the composed passage; it closes on the `{defwork}`, the civic thing
  the block's modifiers attach to, so a following modifier of any salience picks up a noun the
  sentence just put down. It reads the same immediately after nothing and after any sibling
  modifier, because it depends on no antecedent: both its nouns are named inside it.
- **The opener wall (R-DA-17; ARCH §2.5's T-F8).** The face does not open on the `proper`-typed slot
  of the block's bag. Across the pool no row and no face does, and the settlement-token opener is
  zero — the BEFORE of variant 1 opened on it.

## F. The walls and bands the whole pool stands checked against

Checked by hand against the walls of Part B §16, MOVE-GRAMMAR §1.3, §1.4 and §1.4.1, ARCH §2.5, the
detector list in `proseFingerprint.js`, and the register card with amendments S2 and S3.

- **Walls.** No em dash, no exclamation, no digit, no percent, no question mark, no `which`, in any
  face or numbered row. No future indicative, no `will`, no `shall`: STATE never FATE (A2; NL-6). No
  figure, no sense verb on an abstraction, no inanimate intent (R-DA-11) — every verb is a copula, a
  record verb or a measurement verb (`stands`, `holds`, `is in place`, `is up`, `has`, `sets`, `run
  short`, `is not met`, `is not made up`, `is not paid`, `stands open`).
- **Sentence count.** Six faces are one sentence, two are two sentences (1.2 and 2.2); no face
  reaches three, so R-DA-03's third-segment arm cannot fire. No semicolon and no colon anywhere, so
  amendment S2's clause seat stays open on every face and `punctuation.semicolonRate` and
  `colonRate` are 0.0000 on 8 of 8.
- **THE THREAD.** A spine sits FIRST in the composed passage, so its own second sentence cannot be
  the passage's one turn outward. Both two-sentence faces therefore hand a noun forward rather than
  turning: 1.2's second sentence carries `{settlement}` forward as `the town's`, and 2.2's as `the
  town`. Every face closes on a civic thing a following modifier can pick up.
- **A11 spread.** Eight distinct first-two-word openers across the faces: `The {defwork}` · `On the`
  · `The wage` · `Wages at` · `Pay for` · `The roll` · `The pay` · `At {settlement}`. The two
  numbered rows open `The {defwork}` and `Pay for`. Sentence counts are not uniform across the pool,
  which is a gain against the FLATTENED arm; the BEFORE was uniform at one sentence per variant.
- **R-DA-04, the close.** The close kinds are a condition (six) and an object (2.2, closing on
  `{defwork}`). No face closes on a pronoun, so `closers.pronounRate` for this pool is 0.0000, and
  none closes on an abstract-noun suffix, so `closers.abstractNounRate` is 0.0000.
- **Rationed patterns.** Zero instances of `rather than`, `which is`, `which means`, `nobody`, `no
  one`, `nothing`, `its own`, `whatever`, `enough to`, `enough that`, `kind of`, `sort of`, `quiet`,
  `still`, `yet`, `already`, `regardless`, `in any case`. The BEFORE of variant 2 carried `which is`
  and `kind of`; both stay at zero.
- **Antithesis shape** stays at zero, as in both BEFOREs: no `not X but`, no `, not X`, no `less X
  than`. The new face's `above` is a measurement, not an antithesis, and matches no arm of the
  detector.
- **DURATION, TIME and COUNT words.** None appears in any face and none appeared in either BEFORE.
  `full wage`, `its due` and `a wage above what the muster is paid` are band words against a
  requirement, never a quantity: no numeral, no number word, no headcount.
- **The density law (§21.4).** Nothing was made plainer. The replaced face was fifteen words and
  the replacement is seventeen; it trades a gerund subject for a record subject and a negation for a
  measurement, both of which carry more of the licence, not less. No sentence was removed, no
  variant merged, no face withdrawn: the pool stands at two variants and eight faces, as it did at
  round 2 (§22, never trim).

## G. REFUSALS

**REF-1 — the provenance move is refused across this face set, though the card licenses the
holder.** The card names the muster a LICENSED standing source and says a citation is licensed
"where the provenance budget allows". The budget does not allow it here, on three grounds:
- Part B §24 sets the provenance ceiling at one citation per unit **and only for one of S3's three
  reasons**: two accounts that disagree, a count from an interested party, a record whose keeper is
  a power. This pool holds none of the three — one account, no count (a count is the card's own
  refused column), and no typed fact making the muster a power.
- MOVE-GRAMMAR §4.4.3: a citation on a fact whose holder is the office itself is a finding — the
  office does not cite its own books. The compiling office holds the muster roll.
- A single citing face would carry a claim its three siblings do not, and arm A6 requires the four
  faces to be claim-equal; citing in all four is the citation habit §24 makes a refuter's finding,
  against exemplar registers that cite at zero per 786 sentences.

Naming `the muster roll`, `the wage roll` or `the roll` as the record that fixes or fails the wage
is a PRESENT move on a record object, not a provenance move, and is recorded here as the reading
this draft used — including for the new face's `sets`, whose choice over `shows` is argued at NOTE
E. *For the chair: whether a provenance face may be claim-unequal to its siblings, or whether
provenance belongs to a variant rather than to a face, is not a call this seat can make.*

**REF-2 — variant 1: three claims removed as unlicensed** (carried from round 2; the authority is
ruling 5 as R-DA-15 states it — an unlicensed claim is not a claim the pool was entitled to hold,
its removal is required, and the B-CLAIM bar is not engaged, so the departure from the BEFORE's
claim set is declared rather than quiet).
- `stone keeps itself, and wages do not` is a general law about the world: the card's refused
  `a cause`, R-DA-12's generalisation test, and the MEANING non-move of MOVE-GRAMMAR §1.3. `Stone
  keeps itself` is also inanimate intent, which R-DA-11 refuses.
- `the watch that should man it` asserts a link between the wall and the paid force. The engine
  denies that link (ARCH T-F2: the generator exempts built walls from the pay gate). Under the card
  that is `a second fact`. Separately, `the watch` is the civic object of this block's own sibling
  modifier pool `watch: bought` (ARCH §6.3), so a spine naming it restates a sibling.
- `stands better than` is the same unlicensed link stated as a relative measurement.

**REF-3 — variant 2: four claims removed as unlicensed**, under the same authority; carried from
round 2, and the refusal that cleared round 2's reported measure.
- `which is the kind of arithmetic a town notices late` is a `which` tail (order wall 6; R-DA-03), a
  standpoint (the card's refused list) and a gnomic closer (R-DA-12).
- `is thinning` asserts a trajectory. No trend field is read here, and R-DST-B rules that a standing
  configuration field licenses a structural clause and never a historical one.
- `around {settlement}` asserts geometry. The block's own wall class includes `inner citadel`, which
  does not surround a town, so the claim is false for part of the class.
- `is sound` asserts a maintenance condition. The read is presence, not condition; the block's
  recorded law is that built walls keep standing, which licenses `stands` and not `sound`.

**REF-4 — a wiring row, not a text law: `{defwork}` is NAMED BUT NEVER FILLED at this block's call
sites**, on the card's own printing. A piece with an unfillable slot drops itself (ARCH §0, step
six), so every variant of this pool may be silent at render today. The slot is kept in all eight
faces because the SLOTS arm fails any face whose slot set differs from the parent's, and because a
slot is not a wording. Raised for the chair, not cured here. Carried unchanged from rounds 1 and 2.

**REF-5 — a sitting question, carried unchanged.** Once the unlicensed decoration is gone, the two
variants assert the same two claims and are told apart only by their angle and their grammar. That
is lawful and C-sibling asks exactly that, but the pool's semantic width is now visibly the width of
its licence: one key, two reads. Whether `WALLED-STRAINED` should carry two variants of one claim
set, or whether the second wants a licence of its own, is a sitting question and is not decided
here.

**REF-6 — NEW, and the one this round adds: the seven lawful faces were deliberately NOT pushed
toward the ceiling in this round, and the reason is the entry grain, not the effort.** §21.1 and
§21.2 want every face pushed toward the band's higher end. At the ENTRY grain a one-sentence face
puts one sentence in the denominator of every shape rate, so any feature it acquires scores 1.0000
and blows its band by an order of magnitude — this round's own failing measure is the demonstration,
at 28.24 band-widths for one word. Six of the eight faces are one sentence. §21.2 keeps a round only
if the failure count falls or holds WITH NO NEW FAILURE, so a discretionary rewrite of a lawful
one-sentence face risks converting a clean set into a failing one for a gain no measure reports.
This seat therefore cured the cause and left the rest. *For the chair: the ceiling push on the seven
lawful faces belongs to the Phase 2 refinement round (§21.2), where a different author holds it and
the gate re-runs with revert-to-lawful behind it. Naming it here so it is deferred on the record and
not lost.*

**Not lawful, refused, or banked: none of the eight faces.** Both variants are written and both are
lawful as written. The refusals above are a licensed move this seat may not take (REF-1), two
declared claim removals the licence compels (REF-2, REF-3), a wiring finding (REF-4), a sitting
question (REF-5) and one declared deferral (REF-6).
