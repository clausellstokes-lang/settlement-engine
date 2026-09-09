Seat: Opus 5 (Fable-unvalidated) · REWRITE draft round 4 · block DS-DEF-11 · pool key `WALLED-STRAINED`
Written 2026-09-09. Nothing outside this file was written; no dock was entered, no test was run, no
commit was made. Two commands executed: the read-only licence-card script in `laneRW-DEF11`, and
read-only `git log` / `grep` over that dock to establish the receipt at NOTE A.

# DS-DEF-11 · `WALLED-STRAINED` — the rewritten variant rows

Two existing variants, rewritten in place under their own numbers, in their own order, with their
bracketed angle tags untouched. No variant added, none removed, none merged. Each variant is one
`[plain]` line — the numbered row's own text — and three `[face]` sub-rows: four wording faces per
variant, each a different vocabulary or rhythm inside the voice, none a paraphrase of a sibling,
every one standing alone because the render draws one face unweighted.

The pool's typed lines (ROLE, READS, RELATION, ATTACH, FORM, MOVE) are not mine and are not
repeated here.

**READ NOTE A FIRST. The gate feedback handed to this round is STALE**, and the receipt is in the
dock's own history: the measure it names was cured at round 3 and the face it quotes does not exist
anywhere in the dock. Round 4 therefore cannot move that measure — it is already at 0.0000 on 8 of
8 faces. What round 4 does instead is set out at NOTE B: **one face moves**, for a defect read off
the instrument's source rather than off the feedback, and the other seven hold.

---

## THE PASTE BLOCK

The bold heading is shown for placement only; it already stands in
`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` under `### DS-DEF-11`, at line 5991 of the dock's
copy at HEAD `a9d7e164b`. What replaces the pool's current variant rows is the two numbered rows
and their six sub-rows, verbatim, with the three-space indent on every `- ` sub-row.

**`WALLED-STRAINED`**
1. `[ledger]` The {defwork} at {settlement} stands, and the muster is short of its funding.
   - `[face]` On the muster roll at {settlement} the pay is under its due, and the {defwork} holds.
   - `[face]` The wage roll at {settlement} is not met. The town's {defwork} is in place.
   - `[face]` Wages at {settlement} run short of the roll, and the {defwork} stands.
2. `[unfolding]` Pay for {settlement}'s muster stands open on the roll, and the {defwork} is up.
   - `[face]` The roll at {settlement} sets a wage above what the muster is paid, and the {defwork} holds.
   - `[face]` Muster pay at {settlement} is not made up. The town has its {defwork}.
   - `[face]` At {settlement} the muster is not paid to its full wage, and the {defwork} is in place.

**Two variants · eight faces · word counts (authored grain, each `{slot}` token counted as one
word):** 1.0 = 13 · 1.1 = 16 · 1.2 = 14 · 1.3 = 12 · 2.0 = 14 · 2.1 = 17 · 2.2 = 13 · 2.3 = 17.

## WHAT CHANGED SINCE ROUND 3 (one line, the whole diff)

| vid · face | round 3 | round 4 |
|---|---|---|
| 2 · face 2 | The pay due the muster is not made up at {settlement}. The town has its {defwork}. | Muster pay at {settlement} is not made up. The town has its {defwork}. |

Every other row is byte-identical to round 3 and to the dock at HEAD. The claim set is unchanged on
every face, this one included: two claims, K1 and K2, as NOTE E sets them out.

## THE ROWS BEFORE THE REWRITE (for the chair's eye; not part of the paste)

1. `[ledger]` {settlement}'s {defwork} stands better than the watch that should man it; stone keeps itself, and wages do not.
2. `[unfolding]` The {defwork} around {settlement} is sound and the muster behind it is thinning, which is the kind of arithmetic a town notices late.

---

# --- NOTES

## A. THE GATE FEEDBACK HANDED TO THIS ROUND IS STALE — the receipt, and what follows from it

**What round 4 was told.** *"band depth · shapes.participialOpenerRate (over) = 28.24 band-widths
on 1 of 8 face(s) — vid 2 face 1, `Funding for the muster at {settlement} falls short of its wage,
and the {defwork} holds.`"*

**Why that is round 2's report and not round 3's.** Three receipts, all read-only, all from the
dock at `laneRW-DEF11`:

1. `git log -1` — HEAD is `a9d7e164b`, *"REWRITE 8b DS-DEF-11 draft round 3: 5/5"*. Its message
   states the outcome in the lane's own words: *"shapes.participialOpenerRate falls from 28.24
   band-widths over on 1 of 8 faces to inside band on 8 of 8, so the block's one failing owned
   measure clears and all five pools read inBand YES with zero owned FAIL."* The figure quoted
   back to round 4 — 28.24, 1 of 8 — is the BEFORE of that sentence.
2. `git show a9d7e164b` — the round-3 commit's whole diff is one line in the annex and one in the
   generated leaf, replacing exactly the face the feedback quotes:
   `- Funding for the muster at {settlement} falls short of its wage, and the {defwork} holds.`
   `+ The roll at {settlement} sets a wage above what the muster is paid, and the {defwork} holds.`
3. `grep -rn 'Funding for the muster'` over the entire dock returns nothing. The quoted face does
   not exist in the annex, in `src/data/dossierStateProse/defense.generated.js`, or anywhere else.
   The leaf at `defense.generated.js:5321` carries the round-3 wording.

**Verdict: CONFIRMED** (executed reads, quoted output). The named measure is cured and stands at
0.0000 on 8 of 8 faces. No wording round 4 could write would move it, because it is already at the
floor of the metric.

**What follows, and it matters more than this pool.** If the harness is handing each round the
report of the round *before last*, then every subsequent round is judged against a measure that is
already cured, no round can ever "move a failing owned measure", and the set banks as a refusal row
under the two-dry-rounds rule **while being lawful**. That is a false refusal, and it would be
recorded against a set the gate itself passed. *For the chair: the feedback plumbing is the finding
here, not the prose. This seat cannot inspect the harness; it can only report that the report is
one round behind.*

**And the banking rule does not reach this set in any case.** Part B §21.2 banks *"a set that
cannot be made lawful"*. This set IS lawful — 5/5, zero owned FAIL, inBand YES. Part B §21's
terminating condition for Phase 1 is *"continues until the wording set is inside every band"*, and
that condition is MET. Phase 1 for `WALLED-STRAINED` is COMPLETE, not exhausted. A quiet round here
is a Phase-1 termination and must not be written down as a refusal.

## B. WHAT ROUND 4 MOVES, AND WHY IT MOVES THAT AND NOT MORE

With the named measure cured, round 4 went looking for a failing measure in the only place left: the
instrument's source. `src/domain/prose/proseFingerprint.js` was read whole this round (221 lines),
and every one of its twenty-one detectors was computed by hand over all eight faces. One defect
came out of that reading, and it is the one face that moved.

**The defect — `closers.abstractNounRate` fires on a `{settlement}` token in sentence-final
position.** Line 114 takes each sentence's last word and strips it to letters
(`.replace(/[^A-Za-z'’]/g, '')`), and line 147 scores it against
`/(ness|tion|sion|ity|ment|ance|ence|ship|hood|dom)$/`. The authored-grain token `{settlement}`
strips to `settlement`, **which ends in `ment`**. Round 3's face 2.2 ended its first sentence on
`…is not made up at {settlement}.`, so on the authored grain — the grain Part B §18 states the
rewrite is argued from, *"the 2,266 R1 variants with `{slot}` markers intact"* — that face scored
`closers.abstractNounRate` = 1 of 2 sentences = **0.5000**, the only non-zero closer figure in the
pool. It is the only face of the eight with a sentence-final slot token; no other face in the pool,
and neither BEFORE row, ends a sentence on one.

**Label: PLAUSIBLE, not CONFIRMED, and the honesty owed with it.** This seat may not run the gate
(the fence permits one read-only script), so it cannot say whether the gate strips `{slot}` tokens
before measuring. Two readings, and the packet is written to be right under both:
- if the gate measures the authored grain with markers intact, as §18 says the rewrite is argued
  from, face 2.2 carried 0.5000 on that metric and round 4 removes it;
- if the gate strips slots first, face 2.2 carried 0.0000 and round 4's change is neutral on that
  metric and still costs nothing.
Under neither reading does the change make any measure worse — the hand computation at NOTE C shows
the replacement moving two metrics DOWN and one SIDEWAYS and nothing UP. Round 4 may therefore still
read DRY on owned measures. If it does, NOTE A's last paragraph governs: this is Phase-1 completion
on a lawful set, not a refusal.

**Why only one face moved, and why the drafter deliberately did not push the other seven toward the
ceiling.** §21.1 and §21.2 want every face pushed toward the band's higher end, and *"lawful is not
done"*. That push belongs to Phase 2 and **not to this seat**, for a reason stronger than the
entry-grain caution round 3 gave (which this round withdraws as over-stated: the detector list is
readable and an edit against it is verifiable, not a coin toss). The stronger reason is §23. The
owner's taste runs two arms — an Opus refiner and a Fable refiner — and both are specified to refine
**"from one lawful Opus draft"**. The owner's decision on the WAVE's staffing rests on comparing
those two arms on a common baseline. A drafter who keeps polishing after the set is lawful moves
that baseline, and the table the owner is meant to read stops measuring what it was built to
measure. So the draft is held at its lawful state and the ceiling push is handed forward with named
targets at NOTE G, which is exactly the form §21.2 asks for (*"with named targets beyond the gate"*).

## C. THE MOVED FACE, COMPUTED AGAINST ALL TWENTY-ONE DETECTORS

**Round 3:** `The pay due the muster is not made up at {settlement}. The town has its {defwork}.`
**Round 4:** `Muster pay at {settlement} is not made up. The town has its {defwork}.`

Sentence split by `sentencesIn` (line 83): two sentences either way. Lengths by `wordsOf`: round 3
= 11 and 5; round 4 = 8 and 5.

| metric | round 3 | round 4 | note |
|---|---|---|---|
| `closers.abstractNounRate` | 0.5000 | **0.0000** | the defect; last words `up` and `defwork`, neither matching the suffix set |
| `openers.sameOpenerAsPreviousRate` | 0.5000 | **0.0000** | openers were `the` · `the`; now `muster` · `the` |
| `wordsPerSentence.neighbourVariation` | 0.750 | 0.462 | `\|5−8\|/1/6.5`; non-zero either way, so the face keeps its burst |
| `wordsPerSentence.shareUnder8` | 0.5000 | 0.5000 | unchanged: the second sentence alone is under eight |
| all eighteen others | 0.0000 | 0.0000 | verified individually below |

The eighteen, each checked against its own regex rather than by eye: no `;` and no `: ` so
`semicolonRate` and `colonRate` are zero and amendment S2's clause seat stays unspent; no `—` or
`--`, no `?`, no `!`, no `(`, no `"` or `“`; `shapes.antithesisRate` needs `not … but`, `rather
than`, `, not` + lower case, or `less … than`, and `is not made up` matches none of the four —
there is no comma anywhere in the face, which also makes `triadRate` (two commas then `and`)
unmatchable and `doubledAdjectiveRate` (a suffixed word immediately followed by ` and `)
unmatchable, since the face contains no ` and ` at all; no word ends in `ly`, so
`adverbsPerSentence` is zero; the face opens on neither `There is` nor `It is`; no first word ends
in `ing`, so `participialOpenerRate` stays at the zero round 3 bought; no `, which`; neither closing
word is a pronoun; `runsOfThreeSameLengthBand` needs three sentences and a variant may hold two.
`shareOver30` is zero at eight and five words.

**Claim-equality, the wall that governs the change.** The replacement asserts K2 as `Muster pay …
is not made up` and K1 as `The town has its {defwork}` — the same two claims, in the same order, as
the row it replaces, whose second sentence it keeps verbatim. Nothing was added and nothing dropped.
Slots are `{settlement}` once and `{defwork}` once, the same set as every sibling face and as both
BEFORE rows, so the SLOTS arm sees no difference.

**THE THREAD is preserved, and this was the constraint that shaped the wording.** A spine sits FIRST
in the composed passage, so a spine's own second sentence can never spend the passage's one turn
outward — it must hand a noun forward. `The town has its {defwork}` carries `{settlement}` forward
as `the town`, exactly as the round-3 row did. Every alternative opener this seat tried for the
second sentence broke that (an `Its` whose antecedent was ambiguous between the roll and the town, a
`Behind` or `Even so` that asserted an edge the card refuses, a `Stone` that named a second civic
object of the class `wall`), so the fix was made in the FIRST sentence instead and the thread left
untouched.

**Density (§21.4), stated so a refuter can rule on it.** The first sentence went from eleven words
to eight. That is not a plainer line: `Muster pay` is the clerk's compound for the same fact `the
pay due the muster` states at length, and the compression is the ceiling, not a retreat from it. No
sentence was removed, no face withdrawn, no variant merged — §22 permits shortening a sentence
inside its band and forbids only cutting sentences. The pool stands at two variants and eight faces,
as it did at rounds 2 and 3.

**Sibling distance.** `Muster pay` as a bare compound reaches no other face: variant 2's siblings
own `Pay for {settlement}'s muster`, `The roll … what the muster is paid` and `the muster is not
paid to its full wage`; variant 1's own `the muster is short of its funding`, `the muster roll` and
`Wages`. The opener `Muster` is unique across all eight faces, which now open `The` · `On` · `The` ·
`Wages` · `Pay` · `The` · `Muster` · `At`.

## D. The licence card this draft was written against

Printed by `node scripts/prose-licence-card.mjs DS-DEF-11 'WALLED-STRAINED'` in the dock, verbatim
in its load-bearing lines:

- `reads:` `forces.walls.present` (measured) and `settlement.defenseProfile.economicGates.military`
  (measured); absent implies no candidate, and a modifier is silent, never "false".
- `predicate:` `settlement.defenseProfile.economicGates.military < 1`
- `bag:` `{defwork: bare-common, settlement: proper}`; FILLED at this block's call sites
  `{settlement}`; NAMED BUT NEVER FILLED `{defwork}`.
- `relation:` a spine takes no relation. `seat/form:` not a seat-taker, sentence. `move:` none
  declared. `angle:` ledger unfolding.
- `source:` muster, standing LICENSED; a citation of this holder is licensed where the provenance
  budget allows.
- `may claim:` that `military` (< 1) holds, as a STANDING fact of the record.
- `may NOT:` a count, a cause, a season, a future, a standpoint, a second fact, another civic object
  of the class `wall`.
- `audience:` player, no mark. REFUSED COLUMNS always: a totality over persons; an exemption from a
  duty; a named character and that character's fate; a theological claim.

## E. The claim set every face carries, and the clause that licenses each claim

Two claims, and only two. All eight faces carry both and nothing else, so the faces are claim-equal
to one another (arm A6) and the two variants cohere in structural fact (CLERK-LAWS C5). The claim
set is unchanged from round 3, which was unchanged from round 2.

- **K1 — this settlement holds a defence work of the wall class, and it is present and standing.**
  Licensed by the card's `reads` line, first path, `forces.walls.present` (measured). A declared
  read is not optional: ARCH §4.4's walker arm A0b convicts an UNDER-claim, *"a declared field the
  text never claims"*, so K1 is asserted and not merely presupposed. The predicate of presence, and
  nothing beyond presence, is what each face states: `stands`, `holds`, `is in place`, `is up`,
  `has its {defwork}`.
- **K2 — the paid military establishment is funded below what it requires.** Licensed by the card's
  `predicate` line, `economicGates.military < 1`, and stated under the card's `may claim` line as a
  STANDING fact of the record: `short of its funding`, `the pay is under its due`, `the wage roll is
  not met`, `run short of the roll`, `stands open on the roll`, `sets a wage above what the muster is
  paid`, `is not made up`, `not paid to its full wage`.
- **The slots** are exactly the card bag and exactly the set both BEFORE rows carried: `{settlement}`
  (proper) once and `{defwork}` (bare-common) once in every face and in both numbered rows.
- **No third claim anywhere.** No face states a relation between the wall and the paid force, a
  cause, a count, a season, a future, a standpoint or a second civic object of the class `wall`. The
  two facts sit side by side; nothing joins them but coordination or adjacency, which asserts no
  edge. The card's `may NOT: a second fact` bars a fact beyond the card's two declared reads, not
  the second of the two the card declares — the STATE-KEY `WALLED-STRAINED` is itself the
  conjunction (walls, impaired upkeep), and A0b convicts a face that drops either half.

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
| 2.2 | Muster pay at {settlement} is not made up. The town has its {defwork}. | as above | as above | two sentences, the compound subject, closing on the object | 13 |
| 2.3 | At {settlement} the muster is not paid to its full wage, and the {defwork} is in place. | as above | as above | fronted place adjunct | 17 |

The `[unfolding]` angle is carried by the OPEN reading of the same predicate — a wage that stands
unmet is a term standing open — not by a second claim and not by a trajectory. The angle tags
`[ledger]` and `[unfolding]` are not mine to touch and were not touched.

## F. The walls and bands the whole pool stands checked against

Checked by hand against the walls of Part B §16, MOVE-GRAMMAR §1.3, §1.4 and §1.4.1, ARCH §2.5, the
detector list read this round in `proseFingerprint.js`, and the register card with amendments S2
and S3.

- **Walls.** No em dash, no exclamation, no digit, no percent, no question mark, no `which`, in any
  face or numbered row. No future indicative, no `will`, no `shall`: STATE never FATE (A2; NL-6). No
  figure, no sense verb on an abstraction, no inanimate intent (R-DA-11) — every verb is a copula, a
  record verb or a measurement verb (`stands`, `holds`, `is in place`, `is up`, `has`, `sets`, `run
  short`, `is not met`, `is not made up`, `is not paid`, `stands open`).
- **Sentence count.** Six faces are one sentence, two are two sentences (1.2 and 2.2); no face
  reaches three, so R-DA-03's third-segment arm cannot fire. No semicolon and no colon anywhere, so
  amendment S2's clause seat stays unspent on every face.
- **THE OPENER WALL (R-DA-17; ARCH §2.5's T-F8).** No face and no numbered row opens on the
  `proper`-typed slot `{settlement}`. The BEFORE of variant 1 did. Several candidate rewrites for
  face 2.2 were discarded for this reason alone.
- **THE THREAD.** Both two-sentence faces hand a noun forward rather than turning: 1.2's second
  sentence carries `{settlement}` forward as `the town's`, and 2.2's as `the town`. Every face
  closes on a civic thing a following modifier can pick up, and every face reads the same after the
  spine's own position and after any sibling modifier, because both its nouns are named inside it.
- **A11 spread.** Eight distinct first-word openers across the faces: `The` · `On` · `The` ·
  `Wages` · `Pay` · `The` · `Muster` · `At`. Sentence counts are not uniform across the pool, which
  is a gain against the FLATTENED arm; the BEFORE was uniform at one sentence per variant.
- **R-DA-04, the close.** The close kinds are a condition (six) and an object (2.2, closing on
  `{defwork}`). No face closes on a pronoun; after this round's change no face closes on a word the
  abstract-noun detector matches.
- **Rationed patterns.** Zero instances of `rather than`, `which is`, `which means`, `nobody`, `no
  one`, `nothing`, `its own`, `whatever`, `enough to`, `enough that`, `kind of`, `sort of`, `quiet`,
  `still`, `yet`, `already`, `regardless`, `in any case`. The BEFORE of variant 2 carried `which is`
  and `kind of`; both stay at zero.
- **DURATION, TIME and COUNT words.** None appears in any face and none appeared in either BEFORE.
  `full wage`, `its due` and `a wage above what the muster is paid` are band words against a
  requirement, never a quantity: no numeral, no number word, no headcount.
- **Arms A1 and A11 against the block's other four pools.** The siblings own `danger`, `country`,
  `books`, `account`, `entry`, `enters`, `repair`, `upkeep`, `charge`, `cost`, `bears`, `carries`,
  `working fabric`, `in service`, `mended`, `sound`, `fit for use`, `enclosure`, `closed against`,
  `present peace`, `ahead of any present need`, `cheaper`, `easier to keep than to raise`, `pays
  little`, `built work`, `patience`, `too small to wall`, `safety`, `neighbours`, `distance`,
  `unimportance`, `agree to differ`, `buys stone`, `confidence`, `thrift`, `openness`, `statement`,
  `weight`, `circuit`, `defense money`. **Not one of those words appears in this packet.** `town` is
  the one common noun shared, and it is a civic noun the register cannot avoid rather than a
  distinguishing vocabulary item. No face restates a sibling pool's claim and none contradicts one:
  the sibling pools speak to danger, to peace, and to the absence of a wall, and this pool speaks to
  the purse alone.

## G. NAMED TARGETS FOR THE PHASE 2 REFINEMENT ROUND (§21.2's "named targets beyond the gate")

Handed forward rather than taken, for the §23 reason at NOTE B. Each is a ceiling matter on a
lawful face, not a failure.

1. **Face 1.2 carries `openers.sameOpenerAsPreviousRate` = 0.5000** — both its sentences open on
   `The`. It is in band (round 3 passed with two such faces and only the participial measure
   flagged), and it is now the only face in the pool with a repeated opener, since 2.2's went to
   zero this round. The fix is the same shape as 2.2's: change the FIRST sentence's opener, never
   the second's, because the second sentence carries the thread.
2. **The K1 predicate repeats across the pool** — `stands` twice, `holds` twice, `is in place`
   twice, plus `is up` and `has its`. A refiner should know before touching it that this is
   licence-bound, not laziness: the card's `may claim` is presence and nothing beyond presence, and
   round 3 already refused `is sound` for exactly that reason. §21.3 governs — where one effort must
   choose between a sharper wording and a licensed one, the licensed one wins. The width available
   is in SUBJECT and SHAPE, not in the verb.
3. **The two plain lines are the thinnest wordings in the set** (`the {defwork} is up`; `stands, and
   the muster is short of its funding`) and they are drawn as often as any face. They were left
   alone this round because they are lawful and because they are the baseline the two arms are
   measured from; a refiner is under no such constraint.

## H. REFUSALS

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
this draft used. *For the chair: whether a provenance face may be claim-unequal to its siblings, or
whether provenance belongs to a variant rather than to a face, is not a call this seat can make.*

**REF-2 — variant 1: three claims removed as unlicensed** (carried from rounds 2 and 3; the
authority is ruling 5 as R-DA-15 states it — an unlicensed claim is not a claim the pool was
entitled to hold, its removal is required, and the B-CLAIM bar is not engaged, so the departure from
the BEFORE's claim set is declared rather than quiet).
- `stone keeps itself, and wages do not` is a general law about the world: the card's refused `a
  cause`, R-DA-12's generalisation test, and the MEANING non-move of MOVE-GRAMMAR §1.3. `Stone keeps
  itself` is also inanimate intent, which R-DA-11 refuses.
- `the watch that should man it` asserts a link between the wall and the paid force. The engine
  denies that link (ARCH T-F2: the generator exempts built walls from the pay gate). Under the card
  that is `a second fact`. Separately, `the watch` is the civic object of this block's own sibling
  modifier pool `watch: bought` (ARCH §6.3), so a spine naming it restates a sibling.
- `stands better than` is the same unlicensed link stated as a relative measurement.

**REF-3 — variant 2: four claims removed as unlicensed**, under the same authority; carried from
rounds 2 and 3.
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
slot is not a wording. Raised for the chair, not cured here. Carried unchanged from rounds 1, 2 and 3.

**REF-5 — a sitting question, carried unchanged.** Once the unlicensed decoration is gone, the two
variants assert the same two claims and are told apart only by their angle and their grammar. That
is lawful and C-sibling asks exactly that, but the pool's semantic width is now visibly the width of
its licence: one key, two reads. Whether `WALLED-STRAINED` should carry two variants of one claim
set, or whether the second wants a licence of its own, is a sitting question and is not decided here.

**REF-6 — NEW, and the one this round adds: three of the twenty-one rate metrics cannot be
non-zero on any variant in this estate, and a fourth cannot be non-zero on a one-sentence face.**
Read off `proseFingerprint.js` this round, not inferred:
- `runsOfThreeSameLengthBand` counts from index 2 of the sentence-length array (line 123), so it is
  identically 0.0000 for any unit of fewer than three sentences. A1 caps a variant at two sentences.
  **No face of any pool in this rewrite can ever score it.**
- `openers.sameOpenerAsPreviousRate` and `wordsPerSentence.neighbourVariation` are identically
  0.0000 for any one-sentence unit (an empty `slice(1)`; an empty burst reduction). Six of this
  pool's eight faces are one sentence.
- If any of those bands carries `lo > 0`, every affected face sits UNDER its band by construction,
  on an exceedance no author can cure by any wording. `scoreAgainstBands` skips only zero-WIDTH
  bands (line 191), not zero-floor ones, so the under-side arm does fire.
*For the chair: this is a measurement-grain row, not a prose row, and it bears on §16.2's own
declaration that the ENTRY-grain numbers are PROVISIONAL on one author's texts. Either those three
metrics are declared NOT-EXECUTABLE at the entry grain, or the entry bands for them are re-derived
on units the estate can actually produce. This seat raises it and does not decide it.*

**Not lawful, refused, or banked: none of the eight faces.** Both variants are written and both are
lawful as written. The refusals above are a licensed move this seat may not take (REF-1), two
declared claim removals the licence compels (REF-2, REF-3), a wiring finding (REF-4), a sitting
question (REF-5) and one measurement-grain finding (REF-6). **No variant of this pool fails a law
this seat can name.**
