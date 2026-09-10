1. `[plain]` The purse at {settlement} falls short of the standing charge of its defences.
   - `[face]` What {settlement} lays out on its defences runs under their upkeep.
   - `[face]` Beside what its defences come to, {settlement} shows the lesser purse.
   - `[face]` Coin at {settlement} does not reach the keeping of its defences.
2. `[plain]` The upkeep of the defences at {settlement}'s charge is not met in full.
   - `[face]` What the defences at {settlement} take in upkeep is more than the purse meets.
   - `[face]` Above the purse at {settlement} stands the charge of keeping its defences.
   - `[face]` The keeping of {settlement}'s defences runs dearer than its purse.
3. `[plain]` The defences at {settlement} are kept on a purse short of their upkeep.
   - `[face]` For the keeping of its defences, {settlement} does not find the charge.
   - `[face]` Short of its upkeep is how the paid defence at {settlement} stands.
   - `[face]` Between the purse and the keeping of its defences, {settlement} stands short.

--- NOTES

Seat: Opus 5 — Fable-unvalidated · block `DS-GEN-3` · pool `purse: short` · draft round 3 ·
3 semantic variants · 12 faces (per variant: one `[plain]` and three `[face]` sub-rows; the
projector's own count of the sub-rows alone is 9). The typed lines (**ROLE** `modifier` ·
**FORM** `sentence` · **MOVE** `PRESENT` · **READS** `readings.economicGates.military` ·
**RELATION** `addition` · **ATTACH** `scores.military: CRITICAL` `scores.military: WEAK`) are
already in the annex and are NOT repeated here; the twelve rows above are the complete
replacement for the pool's `⟦TO-AUTHOR⟧` line and nothing else. The licence card was printed
first, in the read-only dock: `node scripts/prose-licence-card.mjs DS-GEN-3 'purse: short'`.

Word count per face, in the order written:

    variant 1 — 13 · 11 · 11 · 11
    variant 2 — 13 · 14 · 12 · 10
    variant 3 — 13 · 12 · 12 · 12

mean 12.00, min 10, max 14 — the working band's interior (10–14), clear of the `shareUnder8`
floor and the `shareOver30` ceiling on every face. Round 1 ran 10–15, round 2 ran 10–14 at mean
12.25; this round's spread is unchanged in width and its mean has moved down by a quarter of a
word, which is not a claim about anything and is reported only because position inside a band is
reported as information (§21.1).

## ANSWERING THE GATE, MEASURE BY MEASURE

| the gate's failing measure, round 2 | what round 3 does | the receipt |
|---|---|---|
| **band depth · `shapes.participialOpenerRate` (over) on 1 of 12 faces — 28.24 band-widths on the worst face** (band entry: DEPTH ≤ 1.75 band-widths on every face) | **MOVED to 0 of 12.** The one offender was variant 2's fourth face, `Keeping the defences at {settlement} runs dearer than the purse.` — first word `Keeping`. It is replaced by `The keeping of {settlement}'s defences runs dearer than its purse.`, which keeps the whole of the density the gate did not object to (the cost as grammatical subject, the `runs dearer` magnitude, the ten-word line — §21.4: the compression is not traded for plainness) and moves only the word the metric reads. **No face of the twelve now begins on an `-ing` word**, so the metric is 0.0000 on every face, inside the band rather than 28.24 widths outside it. | `proseFingerprint.js:141` — `first.filter((w) => /ing$/.test(w) && !NOT_PARTICIPLES.test(w))` over `sentences.map((s) => wordsOf(s)[0]…)`. On a one-sentence face the rate is 0 or 1 and nothing between, so a single participial opener is a full-scale exceedance; the arithmetic reproduces the gate's own figure, `(1.0 − 0.0342) / 0.0342 = 28.24`, which pins the band at width 0.0342 and confirms the grain is the FACE, not the composed unit. The twelve first words are now `The · What · Beside · Coin · The · What · Above · The · The · For · Short · Between`. |
| **composed walk · Q · a trailing coordinate naming no second field — 12 findings** (band: FAIL 0 and WITHHELD 0 over the pool's composed units) | **NOT MOVED, and now PROVEN unmovable from this pool.** Refusal R2, upgraded from an argument to a measurement by a negative control this packet ran and round 2 did not. | See **THE NEGATIVE CONTROL** below: with **no modifier at all** the six attached spines produce Q = 1 per spine set — the same finding, on the same segment, byte for byte. |
| **composed walk · A3 — 12 findings** (same band) | **NOT MOVED, same proof.** Refusal R3. | Same control: A3 = 1 with the modifier removed entirely. |
| **composed walk · unit verdicts — FAIL 0 · WITHHELD 24 · PASS 48 of 72** (band: WITHHELD 0 · FAIL 0) | **HELD at FAIL 0; the 24 WITHHELD are the 12 + 12 above and are the two spines', one apiece.** The 48 units that pass are the four unpoisoned spines × twelve faces, and every one of the twelve faces contributes zero findings of its own to any unit. | The simulation below reproduces `24 units carrying ≥ 1 finding` exactly, and prints the two offending segments in full; both are spine text. |

**THE NEGATIVE CONTROL — the one thing this round adds that changes what the chair knows.**
Round 2 refused Q and A3 by reading `entryWalker.js:836-838` and `composedWalker.js:521-575`
and arguing that the segments belong to the spine. Arguing is not measuring, so this round ran
the two arms' own logic over the six shipped spines four ways — with this packet's faces, with
round 2's shipped faces, with an unrelated lawful modifier (`The mill at {settlement} turns on
water it does not own.`), and **with the modifier removed altogether**:

    round-3 (this packet)                  per-modifier: Q = 1   A3 = 1    (x12 faces => 12 / 12)
    round-2 (shipped)                      per-modifier: Q = 1   A3 = 1    (x12 faces => 12 / 12)
    control: an unrelated lawful modifier  per-modifier: Q = 1   A3 = 1    (x12 faces => 12 / 12)
    control: NO modifier at all            per-modifier: Q = 1   A3 = 1    (x12 faces => 12 / 12)

A finding that survives the deletion of everything this packet writes is not this packet's
finding. The Q segment is `the gate is shut at night by whoever is nearest to it.` — the half
after the semicolon of the `scores.military: CRITICAL` `[ledger]` spine, which carries no
`{slot}` and no member of `BAND_PHRASES`, so `armQualify`'s `consider` reaches its
`out.withheld.push` on the spine's own text. The A3 alternative is `rather than in what the
hall issues` — the tail of the `scores.military: WEAK` `[ledger]` spine, whose content words
`hall` and `issues` no sibling pool key of `DS-GEN-3` names, so `armA3` reaches its WITHHELD
row. Neither reads a byte a modifier can write, because the spine is composed FIRST and the
composed unit's text carries it whole. **The cure for both is a spine rewrite or an ATTACH
narrowing, and neither is this packet's to make** — the annex's typed lines are given to me,
and the finding is carried up below as F5 with the minimal repair each would need.

**The measures this round moved: one of the four (depth, 1 of 12 → 0 of 12), with no new
failure introduced anywhere.** Under §21.2 that is what keeps a refinement rather than
reverting it: the failure count falls and nothing is added. It is not a dry round.

## WHAT WAS CHANGED FROM ROUND 2, AND WHY (every byte accounted for)

Round 2's set was lawful on eleven faces, so §21.3's rule — the licensed wording wins over the
sharper one — argues for the smallest change that clears the metric, not a rewrite. Four faces
moved; eight are untouched or moved by one phrase, and each move is named:

1. **variant 2, fourth face — the gate's finding.** `Keeping the defences at {settlement} runs
   dearer than the purse.` → `The keeping of {settlement}'s defences runs dearer than its
   purse.` The participle is nominalised, the line stays ten words and stays the set's short
   line, and the cost keeps the subject seat. This is the round's required move.
2. **variant 1's `[plain]` tail.** `…falls short of what its defences come to in upkeep.` →
   `…falls short of the standing charge of its defences.` Round 2's tail closed on the
   preposition `upkeep`'s governing phrase through a strained `come to in upkeep`; the
   replacement closes on the civic noun the field names, which is R-DA-04's own ask, and buys
   `standing` — the register's word for a fact that holds, which is the STANDING half of the
   card's `may claim` said in one adjective instead of a clause.
3. **variant 1's third face.** `Beside the upkeep of its defences…` → `Beside what its defences
   come to…`, so that `upkeep` is not the head noun of three consecutive faces of one variant.
   The construction round 2 spent on the `[plain]` is moved here, where it is the fronted term
   of a comparison and reads as a magnitude rather than as a label.
4. **variant 2's second and third faces.** `What keeping its defences comes to is more than the
   purse at {settlement} meets.` → `What the defences at {settlement} take in upkeep is more
   than the purse meets.` (the `-ing` nominal moves out of the opener's neighbourhood and the
   slot moves forward, so the face reads as a statement about the town's defences rather than
   about an abstraction); `Above what {settlement} lays out stands the charge of keeping its
   defences.` → `Above the purse at {settlement} stands the charge of keeping its defences.`
   (`lays out` is left to variant 1's second face, where it is the only verb of outlay in the
   set, so the two variants no longer share their strongest phrase). The locative inversion —
   the strongest rhythm in the set — is kept exactly, per §21.4.

Variant 3 is untouched. It was lawful, its four faces carry the set's widest spread of close
kinds, and §21.2's "never a new one added" is best served by not touching a passing variant to
prove effort.

## THE TWELVE, CHECKED BY MACHINE (this round's own run, inline, no file written)

Every regex below was read out of the dock and re-declared inline; nothing in the dock was
executed but the licence-card script. Per face: word count, the two-word opener
`composedWalker.openerOfText` reads, the closer, and every flag.

    1a  13 w | the purse    | close: defences  | clean
    1b  11 w | what {}      | close: upkeep    | clean
    1c  11 w | beside what  | close: purse     | clean
    1d  11 w | coin at      | close: defences  | clean
    2a  13 w | the upkeep   | close: full      | clean
    2b  14 w | what the     | close: meets     | clean
    2c  12 w | above the    | close: defences  | clean
    2d  10 w | the keeping  | close: purse     | clean
    3a  13 w | the defences | close: upkeep    | clean
    3b  12 w | for the      | close: charge    | clean
    3c  12 w | short of     | close: stands    | clean
    3d  12 w | between the  | close: short     | clean
    distinct openers: 12 of 12 · faces carrying any flag: 0 · mean words: 12.00

The flag set run against every face: participial opener · `CONTRAST_SHAPES` (all eight limbs,
including the `less … than` and the `(and|or) not …` limbs) · the triad shape · the doubled
adjective · abstract-suffix closer · pronoun closer · `SPECIFICATIONAL_COPULA` (arm X) · each
of the twelve `CLAUSE_DETECTORS` that outrank PRESENT · the `There/It is` opener · `-ly`
adverbs net of `NOT_ADVERBS` · semicolon, colon, dash, bracket, quote, question and
exclamation · `which` · the seven modals · digits and percent · every `QUANTIFIERS` member ·
every `AUTHORED_MAGNITUDES` member · the 8/30-word band · the slot set · the opening slot
(T-F8). **Zero hits on all twelve.** Two consequences worth naming rather than leaving to be
found: every face falls through the detector stack to **PRESENT**, which is the move the annex
row declares, so `composedOrderOf` carries the declared move and not a silently reclassified
one; and no face opens on `{settlement}`, which ARCH §2.5's face row refuses outright.

The composed simulation over all 72 units (six spines × twelve faces) prints
`arm Q findings: 12 · arm A3 findings: 12 · units carrying ≥ 1 finding: 24`, with the two
segments named above and no third segment of any kind — the gate's figure reproduced from the
outside before the gate runs.

## WHAT EACH FACE CLAIMS, AND THE CARD CLAUSE THAT LICENSES IT

All twelve faces assert **exactly one claim, and it is the same claim in all twelve**: that
`readings.economicGates.military` holds — *what {settlement} lays out on the defences it funds
is below what keeping them comes to* — as a STANDING fact of the record. Nothing else is
asserted by any face.

| card clause | what it licenses, in every face |
|---|---|
| `reads: readings.economicGates.military (measured)` | the single fact each face states |
| `may claim: that military holds, as a STANDING fact of the record` | present tense, unhedged, undated, ungraded; `standing` in 1a and the plain indicative everywhere else |
| `seat/form: sentence / sentence · move: PRESENT · angle: plain` | one sentence per face, present, plain; the `[plain]` angle is the card's, so all three variants keep it |
| `relation: addition` | the empty opener: no connective before the face, the unit being `spine + ' ' + modifier`, and no clause seat anywhere (S2's joint is not taken) |
| `bag: {settlement: proper}`, FILLED `{settlement}` | the one slot every face names, exactly once, never first (T-F8); a modifier naming neither a slot nor a band word is the summarising beat (ARCH §8.3, arm Q), and `{settlement}` is the only naming this bag offers |
| `audience: player (no mark)` · `covert: no` | **no `dm-only` mark on any variant or face.** This pool's reader is the player; the covert mark belongs to the covert pools and is not this pool's to carry |
| `may NOT: a count · a cause · a season · a future · a standpoint · a second fact · any field the attached spine tests (axis · score)` | refusals R4–R10 |
| `source: muster · standing LICENSED` | **spent on nothing.** Zero provenance moves are authored; refusal R1, and finding F2 |

**Face by face.** Where a word could be read as a second claim, the reading is named here
rather than left for the refuter.

*Variant 1 — the purse set against the charge (money in the subject seat).*

- `[plain]` **The purse at {settlement} falls short of the standing charge of its defences.**
  The one claim (`may claim`); the town named once (`bag`). `falls short` is the pool key's own
  word and the register's plain measurement idiom, and it is not the CONSEQUENCE detector's
  `falls on`. `standing charge` is a magnitude of money in words with no figure in it
  (R-DA-11), and it carries the STANDING half of the claim in the adjective, so the sentence
  does not need a clause to say that the fact holds. The close lands on `defences`, the civic
  noun the field names.
- `[face]` **What {settlement} lays out on its defences runs under their upkeep.** The same
  claim as an insufficiency of outlay. `lays out` names an outlay and no amount (`may NOT: a
  count`); `runs under` is a measurement in words, not a spatial figure, and `upkeep` is a
  standing charge rather than an event, so nothing here is HISTORY (`may NOT` by R-DST-B: no
  event-provenance field exists on this block at all).
- `[face]` **Beside what its defences come to, {settlement} shows the lesser purse.** A fronted
  comparison. `lesser` is a magnitude class and not a stated count, and it is absent from both
  `QUANTIFIERS` and `AUTHORED_MAGNITUDES`, so no totality and no authored magnitude is spent.
  `shows` is the record's plain verb for what a town's arrangement presents; no holder of a
  record is named, so this is not a PROVENANCE move (refusal R1). The `its` opening the
  sentence resolves forward to `{settlement}`, which is also how the face threads back to the
  spine — see THE THREAD.
- `[face]` **Coin at {settlement} does not reach the keeping of its defences.** The plainest
  construction in the variant. `does not reach` is a measurement, not a declared absence:
  nothing is said to be missing from the record, so R-DA-08's GAP is not taken and no
  `not-held` field is needed to license one. It is also not the ABSENCE detector, whose
  negative limb is `does not (say|record|hold)`.

*Variant 2 — the charge as the thing unmet (the cost in the subject seat).*

- `[plain]` **The upkeep of the defences at {settlement}'s charge is not met in full.**
  `at {settlement}'s charge` is the field's own scope stated in three words: the generator gates
  the FUNDED portion, and the community baseline — armed households, terrain alarm — is unpaid
  and ungated, so the face says the paid part and nothing wider. `in full` is a completeness
  word, not a fraction, and no fraction word appears anywhere in the set.
- `[face]` **What the defences at {settlement} take in upkeep is more than the purse meets.**
  The cost fronted as the subject of the comparison. `more than` is a magnitude relation and
  not a CONTRAST shape: no alternative is rejected, so wall 5 is never engaged, and the eight
  limbs of `CONTRAST_SHAPES` all miss it (checked, including `less … than`, which round 2's
  notes recorded as having passed by eleven characters on a face now retired).
- `[face]` **Above the purse at {settlement} stands the charge of keeping its defences.** A
  locative inversion, the strongest rhythm in the set, and the reason the face is kept in that
  shape under §21.4 rather than flattened to subject-verb-object. The close lands on the civic
  noun again. `stands` is the register's standing verb; the INSTITUTION detector needs one of
  its named institution nouns within forty characters of such a verb and finds none here.
- `[face]` **The keeping of {settlement}'s defences runs dearer than its purse.** The set's
  short line, which the register card licenses in as many words ("the short line exists"), at
  ten words — inside the band, above the `shareUnder8` floor. `dearer` is a magnitude in words
  and carries no figure. This is the replacement for the participial opener, and it is the one
  face this round was required to move.

*Variant 3 — the paid defence's standing condition (the thing kept, in the subject seat).*

- `[plain]` **The defences at {settlement} are kept on a purse short of their upkeep.** The
  STANDING form of the claim: the defences stand, and the purse under them is short. `kept on a
  purse` fences the sentence to money, so no reader takes it for a capability claim —
  capability is `scores.military`, the attached spine's own field, and is barred to this pool
  by `may NOT: any field the attached spine tests`. `are kept` is not the TRADITION detector's
  `is kept (here|in)`.
- `[face]` **For the keeping of its defences, {settlement} does not find the charge.** `the
  charge` is a quantity of money, not a totality over persons, so the REFUSED COLUMNS line is
  untouched and no `closed` column is quantified (R-DA-15). Round 1's `the whole charge` stays
  retired: `whole` is a `QUANTIFIERS` member judged against a column's `closed` flag, and this
  pool resolves no closed column.
- `[face]` **Short of its upkeep is how the paid defence at {settlement} stands.** A fronted
  predicate closing on a standing condition; present indicative, no subjunctive edge, no future
  (A2; STATE never FATE). `the paid defence` restates the field's scope in three words for a
  reader who meets this face without the `[plain]`. It is not a specificational copula — `is
  how` is not among `is (what|who|the only|the one)` — so arm X is not engaged and no
  exhaustivity is entailed.
- `[face]` **Between the purse and the keeping of its defences, {settlement} stands short.**
  The shortfall stated as the distance between two named things, which is R-DA-11's "a
  comparison is a measurement in words" taken literally. The close is a condition, which varies
  the close KIND against this variant's other three (R-DA-04 asks for the kind to vary, not the
  word).

**The close kinds across the twelve**, since R-DA-04 measures the kind and not the last word:
eight faces close on a present CONDITION of a civic thing (1a, 1b, 1d, 2a, 2b, 2d, 3c, 3d) and
four on the civic OBJECT itself (1c, 2c, 3a, 3b). No face closes on a generalisation, a moral,
an uplift or a hook; none closes on a pronoun, on the slot, or on an abstract-suffix noun.

## THE THREAD (owner, ~21:4x; MOVE-GRAMMAR §1.4.1)

The composed unit is `spine + ' ' + modifier`, so every face is read as the passage's SECOND
sentence — after any of the six attached spines, and after any sibling modifier the composer
seats first. The six spines share exactly one noun with one another, `{settlement}`, because
three speak of the watch, the arms and the households (`WEAK`) and three of the muster, the
gate and the arrangement (`CRITICAL`). So `{settlement}` is the only noun a face can carry
forward and be certain of, and every face carries it, once, never first. §1.4.1 licenses that
echo in its own words: A11's echo bound counts facts, not nouns, and a deliberate noun echo for
the thread is lawful.

Past the town, each face reaches for the nearest thing the spine has just put on the page.
Every face names `defences`, which is the class the watch, the muster, the arms and the gate
all belong to, so the second sentence lands on the same civic object the first was about, seen
from the money side. No face changes subject in the middle of the passage, and no face needs to
be the passage's one turn outward: each states one fact about the thing already under
discussion, and each is a complete sentence that reads the same whether it is seated second or
fourth.

Round 2 reported its own weakest pairing rather than hiding it — variant 2's third face after
the `CRITICAL` `[street]` spine, where the spine's subject is the town's luck and the face's is
the charge. That pairing is improved this round without being solved: the face now opens on
`Above the purse at {settlement}`, so the town's name arrives in the fifth word instead of the
third-from-last, and the thread through `{settlement}` is picked up before the new subject is
introduced rather than after. It remains the set's longest reach, and I report it again as the
one pairing a refuter would name.

## RESTATEMENT AND CONTRADICTION, CHECKED AGAINST THE SIX ATTACHED SPINES (arms A1, A11)

The six spines assert a **capability** band on `scores.military` — a watch against a garrison,
arms counted in households rather than issued from the hall, a town that does not think of
itself as fighting; nothing that would stop a comer, no muster worth the name, nobody having
wanted the place. This pool asserts a **funding** fact on `readings.economicGates.military`. No
face names the axis, the band, the muster, the arms, the watch, the gate, the households or the
hall, so nothing is said twice (A11), and `typedFactsOf` extracts no band-governed noun from
any face, so arm A1 has no overlap to report as a restatement or as a conflict.

Nothing contradicts, either, and the ground is worth stating because the `CRITICAL` `[visitor]`
spine reads like a denial that any defence exists. It is not one: it is a capability judgment
("nothing that would stop anybody"), and the gate this pool reads is written only under
`hasAnyDefense`, so on every town that can draw this pool at least one paid defence exists to
be underfunded. At `CRITICAL` that may be the walls alone, which is exactly why no face names
paid men (refusal R7).

## REFUSALS — what could not be made lawful, and why (a refusal is a result)

1. **THE PROVENANCE MOVE — REFUSED for this pool at every wording.** The licence card prints
   `source: muster · standing LICENSED`, which reads as a licence; the walker's third limb is
   the one that binds — `if (held.holder === null)` → **WITHHELD, "a holder with no
   institution"**, *the holder kind resolves to no institution in this town's roster, so the
   cited record has nobody keeping it* (`composedWalker.js:856-859`). The limb is keyed on the
   POOL, not on the wording, so no citation of any holder passes here: a different holder is
   not licensed by the card, and the licensed holder has no institution. Round 1 spent one face
   on that gap and took six A13 findings for it; round 2 withdrew the citation and the arm
   returned to zero; round 3 authors none. The banked round-1 face stays in this packet's
   history as a refusal row with its measurement (§22 (b)) and the family stays at four.
2. **The `Q` finding on 12 of 72 composed units — REFUSED, it is the SPINE's, and this round
   proves it.** The segment is `the gate is shut at night by whoever is nearest to it.`, the
   half after the semicolon of the `CRITICAL` `[ledger]` spine. **With the modifier deleted
   entirely the finding still fires**, unchanged, on the same segment. The minimal repair is
   the spine's: give that coordinate a `{slot}` or a band word, or split it into its own
   sentence. Carried up as F5.
3. **The `A3` finding on 12 of 72 composed units — REFUSED, it is the SPINE's, same proof.**
   `rather than in what the hall issues`, in the `WEAK` `[ledger]` spine, whose rejected
   alternative no sibling pool key of `DS-GEN-3` names. **It also survives the modifier's
   deletion.** The minimal repair is a sibling key naming the alternative, or a spine rewrite
   dropping the contrast; arm A3 reads the composed unit whole, so the only thing a modifier
   can do is refrain from adding a second contrast — and no face of this set carries a contrast
   shape at all.
4. **A count, a share or a ratio** ("half its keep", "two parts of three"). REFUSED: card `may
   NOT: a count`; the no-digit wall (A4, R-DA-16); every member of the COUNT and
   `AUTHORED_MAGNITUDES` sets is absent from all twelve faces, so no face adds one against its
   `[plain]` parent (A6). The gate's own arithmetic is a number the record does not state.
5. **A cause** ("the town's trade cannot carry it"). REFUSED: card `may NOT: a cause`. Refused
   **against the world, not by it** — the economic output genuinely drives the gate, so a
   causal face would be TRUE and still unlicensed: that driver is a second field this pool does
   not read, and MOVE-GRAMMAR §1.2 row 2 gives HISTORY and CAUSE only to an event-provenance
   field, which this block holds nowhere (its own receipt calls it "the purest case in the
   corpus" for having no provenance at all). Named again so no later author re-proposes it as
   an obvious improvement.
6. **A season, a term or a date** ("this year the purse is short", "since the last levy").
   REFUSED: card `may NOT: a season`; every such word is a DURATION member and would be an A6
   addition against the parent; and a term boundary is a HISTORY move with no event-provenance
   field behind it (R-DA-19).
7. **Paid men, wages, the garrison or the watch** ("the garrison's wages are behind"). REFUSED
   on two independent grounds: the gate is written wherever ANY defence exists — walls alone
   will do — so a wages claim is false on a walls-only town and would break claim equality
   inside the variant (arm C / A6); and the watch and the garrison are institutions the
   attached spines work in, so naming them risks A11 as well as `may NOT: any field the
   attached spine tests`.
8. **An edge or a future** ("unpaid defences would go unrepaired"). REFUSED: card `may NOT: a
   future`; a subjunctive edge here would assert a capability outcome, which is the spine's
   field. THE PROMISE: state never fate. No face carries `will`, `would`, `could`, `can`,
   `may`, `might` or `shall`.
9. **A second fact of any kind** — what the shortfall reaches, what the purse holds instead,
   who makes it up. REFUSED: card `may NOT: a second fact`; `RELATION: addition` holds no
   `consequence.clause` joint, so S2's clause seat is not available to this pool and no face
   carries a semicolon, a colon or a joint.
10. **A contrast face** ("kept on coin and not on wages"; "paid in part rather than in full").
    REFUSED twice: wall 5 licenses a contrast only where a sibling pool key or band names the
    rejected alternative, and this block's siblings name none of these; and the antithesis
    SHAPE is the estate's most-exceeded band, so a contrast face would spend depth on a shape
    this pool does not need. All twelve faces are positive statements of one magnitude
    relation.
11. **A `dm-only` face.** NOT AUTHORED: `covert: no · audience: player (no mark)`. The covert
    pools mark every variant; this one marks none.
12. **A totality** ("the charge is never met", "nothing in the purse answers it"). REFUSED: the
    REFUSED COLUMNS line (a totality over persons) and R-DA-15's quantifier rule — a quantifier
    is licensed only by a `closed` column, and this pool resolves none.
13. **A second level-1 GRAMMAR. DECLARED, not concealed.** Of MOVE-GRAMMAR §2.1's V1–V8 only
    **V1 (PRESENT alone)** is licensable here: no `none-exists` field (V3), no `not-held`
    provenance (V8), no named-object field (V4), no institution row (V5), no unresolved-value
    field (V6), no structural-consequence field (V2), no event provenance (V7). §3.1's rule is
    to write only the members the block licenses and never to write one empty, so the three
    variants vary in SUBJECT, VERB and RHYTHM inside V1 — the purse, the charge, the paid
    defence — and not in grammar. A walker should read the one grammar as the licensing
    filter's own result and not as a flat pool.

## FINDINGS CARRIED UP

- **F1 — the modifier sentence band is still UNPINNED.** ARCH §6.1 pins a FRAGMENT estimate and
  the unit's `≤ 2 sentences · ≤ 3 facts`, but no word band for `FORM: sentence` at the MODIFIER
  grain; R-DA-05/R-DA-06's figures are REGISTER-grain over whole variants. This set was written
  to a declared working band of **8–16 words, interior 10–14**, and lands at mean 12.00. The
  number wants setting at car 6, with a within-pool spread floor decided beside it: one fact at
  one seat cannot reach a wide spread without a second claim, and padding to a spread figure is
  the metronome R-DA-05 exists to refuse. **Sharpened this round:** the per-face grain is now
  confirmed arithmetically (the gate's 28.24 pins the participial band's width at 0.0342 on a
  single-sentence unit), which means every rate metric is 0-or-1 on a face and a band with a
  low ceiling is an absolute prohibition at this grain rather than a rate. That is a fact about
  the instrument the band-setting car needs: at the FACE grain, `shareUnder8`, the participial
  opener, the antithesis shape, the triad, the which-tail, the doubled adjective and both
  closer rates are walls in all but name.
- **F2 — the licence card's `source` line and arm A13 disagree on this pool, and the card is
  the friendlier of the two.** The card prints `source: muster · standing LICENSED`, which a
  writer reads as "a citation is licensed here"; the walker withholds every citation because
  the holder KIND resolves to no institution in the town's roster. Round 1 spent a face on that
  gap. **The card should print the institution resolution beside the standing** — or print `NO
  citation is licensed`, as it does for an unresolved source — so the next writer is not
  invited into the same refusal. This remains the one instrument change this packet asks for,
  and it is now two rounds old.
- **F3 — ARCH §6.5's relation ground is wrong on this pool; the card's is right; both land at
  `addition`, so no byte moves.** §6.5 says the relation row `(economicGates.military,
  scores.military)` has the spine's field as an endpoint; the shipped table's row joins the
  economic output to `economicGates.military`, and `scores.military` appears in no row. The
  card's stated ground — no table row joins this field to the spine's primary field, so
  `addition` is the claim-free floor — is the correct one.
- **F4 — the ATTACH sets disagree between the architecture and the shipped annex.** ARCH §6.5
  narrows this pool to `WEAK`, `CRITICAL` and **`ADEQUATE`**; the annex row and the licence card
  name two. This set was written against the card's two and then read against the three
  `ADEQUATE` spines as well: every face is true there, none restates, none contradicts, because
  a funding fact is orthogonal to a capability band at every rung. **Widening the attach to
  three would cost no re-authoring.** The echo bound cannot arbitrate — the card records that
  this pool's read is absent from the census's fact index and that the echo table is keyed on a
  coarser producer-token root — so the ATTACH set is the only guard, which is why the
  disagreement wants a ruling rather than a shrug.
- **F5 — NEW, and the reason this round's refusals are worth reading: the composed walk is
  charging a modifier pool for its spines' defects, and the taste's numbers will be wrong
  unless the chair separates them.** Twenty-four of this pool's seventy-two unit verdicts are
  WITHHELD, the band is `WITHHELD 0`, and **every one of the twenty-four survives the deletion
  of the modifier**. As the table stands, no lawful wording of `purse: short` can ever reach
  the band, so the set is unsatisfiable by construction and §21's "an unsatisfiable set is a
  sitting row" is engaged — not because the wording failed, but because a unit verdict is
  keyed on a text two pools wrote and attributed to one of them. Three routes, in the order I
  would rank them: (a) the composed walk attributes a finding to the PIECE whose text carries
  the segment (`piecesOf` already exists and armA13 already uses it, so the machinery is
  present), and a modifier pool's verdict counts only findings on its own piece; (b) the two
  spines are repaired in the spine lane — the `CRITICAL` `[ledger]` semicolon coordinate given
  a slot or split into its own sentence, and the `WEAK` `[ledger]` `rather than` clause rewritten
  or its alternative named by a sibling key; (c) the pool's ATTACH is narrowed away from the
  two `[ledger]` spines, which I rank last because it cures the measurement by shrinking the
  product and the card's own attach set is already narrower than the architecture's (F4). **The
  choice is the chair's; the measurement is not.**

## WHAT WAS EXECUTED

`node scripts/prose-licence-card.mjs DS-GEN-3 'purse: short'` in the read-only dock — the one
script this seat may run there. Read whole or by the named section: `REGISTER-CARD.md` (whole,
with amendments S2 and S3); `RULES-V2-PART-B.md` §1 (R-DA-00 to R-DA-24 and §1.W), §16, §16.1,
§16.2, §18, §20, §21, §21.1, §21.2, §21.3, §21.4, §22, §23; `sweep/MOVE-GRAMMAR.md` §1–§3 and
§4.4.1–§4.4.3, with §1.4.1 and §9.1; `sweep/CLERK-LAWS.md` §2.4.1 and §2.6.1;
`arch-prose/ARCH-COMPOSED-PROSE-v2.md` §2.5 and §8.3. In the dock, READ ONLY:
`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` §DS-GEN-3 whole (the six attached spines, the
block's other pools, and this pool's row), `src/domain/prose/composedWalker.js` (arms A3 and
A13, `openerOfText`, `piecesOf`), `src/domain/prose/entryWalker.js` (`armQualify`,
`armExhaustivity`, `bandReadings`, `SLOT_RE`), `src/domain/prose/entryLexicons.js`
(`CONTRAST_SHAPES`, `SPECIFICATIONAL_COPULA`, `RECORD_CITATION`, `FUTURE_INDICATIVE`,
`BAND_PHRASES`, `AUTHORED_MAGNITUDES`, `COUNT_NOUNS`, `QUANTIFIERS`),
`src/domain/prose/moveGrammar.js` (`CLAUSE_DETECTORS`) and `src/domain/prose/proseFingerprint.js`
(the metric block, `NOT_PARTICIPLES`, `NOT_ADVERBS`). The two verification runs above executed
inline from standard input with every regex re-declared by hand; **no dock byte was written, no
test was run in any dock, and no file outside this packet was created or modified.**
