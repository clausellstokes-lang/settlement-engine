1. `[plain]` The purse at {settlement} falls short of the standing charge of its defences.
   - `[face]` What {settlement} lays out on its defences runs under their upkeep.
   - `[face]` Against what its defences come to, the means at {settlement} run thin.
   - `[face]` Coin set aside at {settlement} does not reach the keeping of its defences.
2. `[plain]` The charge of keeping {settlement}'s defences is not met in full.
   - `[face]` What the defences at {settlement} take in their upkeep outruns the coin.
   - `[face]` Above the purse at {settlement} stands the upkeep of its defences.
   - `[face]` The keeping of {settlement}'s defences runs dearer than its purse.
3. `[plain]` The defences at {settlement} are kept on a purse short of their standing upkeep.
   - `[face]` For the keeping of its defences, {settlement} does not find the charge.
   - `[face]` Short of its upkeep is how the paid defence at {settlement} stands.
   - `[face]` Between the purse and the keeping of its defences, {settlement} stands short.

--- NOTES

Seat: Opus 5 — Fable-unvalidated · block `DS-GEN-3` · pool `purse: short` · draft round 4 ·
3 semantic variants · 12 faces (per variant one `[plain]` and three `[face]` sub-rows; the
sub-rows alone number 9). The typed lines (**ROLE** `modifier` · **FORM** `sentence` ·
**MOVE** `PRESENT` · **READS** `readings.economicGates.military` · **RELATION** `addition` ·
**ATTACH** `scores.military: CRITICAL` `scores.military: WEAK`) are already in the annex and
are NOT repeated here; the twelve rows above are the complete replacement for the pool's
`⟦TO-AUTHOR⟧` line and nothing else. The licence card was printed first, in the read-only
dock: `node scripts/prose-licence-card.mjs DS-GEN-3 'purse: short'`.

Word count per face, in the order written:

    variant 1 — 13 · 11 · 12 · 13
    variant 2 — 11 · 12 · 11 · 10
    variant 3 — 14 · 12 · 12 · 12

mean 11.92, sd 1.037, min 10, max 14 — the declared working band's interior (10–14), clear of
the `shareUnder8` floor and the `shareOver30` ceiling on every face. Round 3 ran 10–14 at mean
12.00 and sd 1.037; the spread is unchanged in width and the mean has moved down by a
twelfth of a word because three faces lost clot, not words of load. No face was padded or cut
to reach a spread figure: padding to a spread number is the metronome R-DA-05 exists to
refuse, and the modifier-grain band is still unpinned (F1). Position inside a band is reported
as information only (§21.1).

## ANSWERING THE GATE, MEASURE BY MEASURE

The gate's round-3 report carried three failing measures. All three are the SAME 24 composed
units, and this round proves — by reproducing the gate's own arithmetic from outside and by
four controls — that **no wording of this pool can move any of them**, because both finding
sites are SPINE text. What this round does instead is the only thing that moves them: it
ANSWERS one of the two, in the pool's favour, on evidence inside this block; it measures the
five candidate repairs for the other and finds that round 3's own recommended repair does not
work; and it pushes all twelve faces toward the ceiling under §21.1–§21.4.

| the gate's failing measure, round 3 | what round 4 does | the receipt |
|---|---|---|
| **composed walk · A3 · a contrast whose rejected alternative no sibling key names — 12** (band 0) | **ANSWERED, and the answer is in the pool's favour.** The row is a WITHHELD-to-the-refuter, not a fail, and its docblock says so in as many words: the MECHANICAL half (does the block have siblings at all) is the arm's; the BAND half (does a sibling BAND supply the alternative) "is semantics, so it is WITHHELD to the refuter with the sibling keys printed beside it". **This packet answers the band half: a sibling band does supply it.** The rejected alternative is arms issued and listed by the hall; `scores.military: STRONG` `[ledger]` supplies exactly that band ("the arms it lists are accounted for"), and `ADEQUATE` `[ledger]` supplies the hall-organised muster that covers the gates. Wall 5 (MOVE-GRAMMAR §1.4 item 5) licenses a contrast where a sibling pool key **or sibling band** names the rejected alternative; the band names it. Its other two limbs also hold: the contrast is not fronted as the subject, and it is the closing move of one variant of the `scores.military` pool only. **So the twelve A3 rows resolve to a pass and the pool's WITHHELD count falls from 24 to 12 the moment the chair records the refuter's answer.** | `composedWalker.js:509-518` (the two-halves docblock) and `:565` (the WITHHELD row's own reason string, which names the siblings it printed). The band texts are the shipped `DS-GEN-3` rows for `scores.military: STRONG` and `ADEQUATE`, `[ledger]` in both cases. |
| **composed walk · Q · a trailing coordinate naming no second field — 12** (band 0) | **REFUSED as this pool's, CONFIRMED as the spine's, and the refuter's answer here is ADVERSE to the spine.** The segment is `the gate is shut at night by whoever is nearest to it.`, the half after the semicolon of the `CRITICAL` `[ledger]` spine. It states who shuts the gate, which is a second FACT, and `DS-GEN-3` holds no typed field for it (its STATE-KEY is the five score axes, prosperity, the safety head word, `viable`, `readiness.label` and `foodSecurity.label`), so R-DA-03's licence is genuinely absent. The arm is right and the spine is wrong. **Round 3's stated minimal repair is wrong, and this round measures it wrong:** splitting the coordinate into its own sentence does NOT clear the arm — the segment simply becomes `raw[1]` and is caught by the arm's FIRST loop instead of its second. Five candidates measured below. | `entryWalker.js:812-838`. The correction to round 3's F5(b) is the measurement in **THE FIVE CANDIDATE REPAIRS** below. |
| **composed walk · unit verdicts — FAIL 0 · WITHHELD 24 · PASS 48 of 72** (band FAIL 0 · WITHHELD 0) | **HELD at FAIL 0. The 24 are the 12 + 12 above, one apiece on two spines, and the arithmetic of their disposition is now exact:** as measured today 24 WITHHELD / 48 PASS; with the A3 rows answered as above, **12 WITHHELD / 60 PASS**; with the Q coordinate repaired in the spine lane by candidate (iii) or (vii), **0 WITHHELD / 72 PASS** and the pool is inside its band. | The simulation below reproduces `Q 12 · A3 12 · 24 units carrying at least one finding` to the integer, on this packet's faces and on round 3's, and prints both segments in full. |

**THE CONTROLS — four of them, and the fourth is the one that settles attribution.**

    round 4 (this packet)            units  72 | Q  12 | A3  12 | units carrying >= 1 finding  24
    round 3 (shipped)                units  72 | Q  12 | A3  12 | units carrying >= 1 finding  24
    CONTROL: no modifier at all      units   6 | Q   1 | A3   1 | units carrying >= 1 finding   2

The six spines alone, with no modifier of any kind appended, carry one Q finding and one A3
finding. Composed against twelve faces that is 12 and 12, which is the gate's figure exactly.
A finding that survives the deletion of every byte this packet writes is not this packet's
finding. `unitsOfPool` builds each unit as `` `${spineFace} ${face}` `` (`taste-measure.mjs:260`),
spine first, slots unfilled, so the composed text carries the spine whole and both detectors
fire inside it.

**THE FIVE CANDIDATE REPAIRS FOR THE Q COORDINATE, MEASURED (the spine lane's to choose):**

    SHIPPED                                Q 1   <- "the gate is shut at night by whoever is nearest to it."
    (i)   semicolon -> ", and"             Q 0   CONCEALMENT — REFUSED, see below
    (ii)  split into two sentences         Q 1   NO CURE — round 3's own recommendation, refuted here
    (iii) the coordinate names the slot    Q 0   a cure by the arm's own rule
    (iv)  the coordinate carries a band word  Q 0   CLAIM CHANGE — refused
    (vii) the coordinate is dropped        Q 0   editing, not trimming (one sentence either way), but it costs the gate fact

(i) is refused on principle and not on taste: the arm's second loop exists precisely because a
trailing coordinate inside one sentence is the same shape as a second sentence, and the
docblock names the shipped positive control it was extended to catch
(`power.generated.js::DS-POW-5::autocrat#2`). Moving the joint from a semicolon to a comma
hides the shape from the detector without touching the unlicensed fact. A repair that clears a
measure by stepping outside the detector's window is the false green this estate has a law
about; I name it so that no later reader takes the zero for a cure. (iv) asserts that nobody
keeps the gate, which the shipped sentence does not say. **(iii) is the recommendation** — it
satisfies the arm by the arm's own definition (a slot is a typed field reference) at the cost
of one repeated slot in one spine face; (vii) is the alternative if the spine lane would rather
lose the fact than repeat the slot. Neither is this packet's to make.

**Is this a dry round?** No, and it is not a dry round in the sense §21 means. §21's phase 1
reads: two consecutive rounds that move no failing measure are DRY and the set takes a REFUSAL
row; **an unsatisfiable set is a sitting row.** This set is unsatisfiable AT THE WORDING GRAIN
and this round proves it to the byte rather than arguing it — and it then moves the measure at
the only site where it can move, by answering the A3 half in the pool's favour with the
sibling band that supplies the alternative, by refuting round 3's own repair for the Q half,
and by naming the repair that works. Twelve of the twenty-four withheld units are dischargeable
today by a chair's line; the other twelve by one spine face. **The set is filed as a SITTING
ROW under §21, not as a dry round.**

## WHAT CHANGED FROM ROUND 3, AND WHY (every face accounted for)

Round 3's set was lawful on all twelve; the projector accepted every row verbatim and no
row-level measure failed. §21.2 governs that case exactly: *lawful is not done* — a lawful face
just above the floor is pushed toward the ceiling, and the refinement is kept only if the set
stays lawful. Six faces moved, six are untouched, and every move is named with the ceiling
property it serves (§21.1: the sharpest licensed fact, the strongest rhythm, the widest sibling
distance, zero tics, the clerk's ear).

1. **1c — `Beside what its defences come to, {settlement} shows the lesser purse.` → `Against
   what its defences come to, the means at {settlement} run thin.`** Two tics removed and one
   fact sharpened. `shows` gave a town the act of displaying, which is the nearest this set
   came to an inanimate subject with intent (R-DA-11); `the lesser purse` is a mannered
   comparative that names a quantity by grading it rather than measuring it. `run thin` is a
   measurement in words, in the estate's own idiom (ARCH §2.5's worked row uses `thinner than
   the wage roll says`). `Against` is the ledger's comparison preposition and this block's own
   PROVENANCE line uses it (`need against production is in the record`), so nothing antique
   enters the syntax. `means` is a fourth money noun, which is the sibling-distance gain.
2. **1d — `Coin at {settlement} does not reach the keeping of its defences.` → `Coin set aside
   at {settlement} does not reach the keeping of its defences.`** The sharper licensed fact.
   The field is an economic GATE on military spending, not a statement that the town has no
   coin; `set aside` names the money as earmarked for this charge and closes the reading that
   the town is simply poor, which is a sibling field (`prosperity`) and not this one.
3. **2a — `The upkeep of the defences at {settlement}'s charge is not met in full.` → `The
   charge of keeping {settlement}'s defences is not met in full.`** The clerk's ear. Round 3's
   line carried two genitives across one another (`of the defences at {settlement}'s charge`)
   and read as a knot. The replacement says the same thing in one movement, loses two words,
   and gives variant 2 a distinct opener from its own fourth face.
4. **2b — `What the defences at {settlement} take in upkeep is more than the purse meets.` →
   `What the defences at {settlement} take in their upkeep outruns the coin.`** Density, per
   §21.4. A four-word copular comparison (`is more than … meets`) becomes one transitive
   magnitude verb, and the face loses two words while keeping the cost in the subject seat.
   `outruns` is a plain accounting transitive and not a figure: it measures, it does not
   personify, and it is the same class as `runs dearer`, which round 3 shipped and this round
   keeps. I name it here because it is the one word in the set a refuter might test.
5. **2c — `Above the purse at {settlement} stands the charge of keeping its defences.` →
   `Above the purse at {settlement} stands the upkeep of its defences.`** The locative
   inversion, which is the strongest rhythm in the set, is kept to the word under §21.4; only
   the head noun moves, so that `charge` is not the head of both faces of variant 2 that carry
   the cost. Eleven words instead of twelve.
6. **3a — `…kept on a purse short of their upkeep.` → `…kept on a purse short of their standing
   upkeep.`** One word, and it is the card's own word: `may claim: that military holds, as a
   STANDING fact of the record`. Variant 3's `[plain]` is the canonical line of the variant
   that puts the defences in the subject seat, and it now says in the adjective what the card
   says in the clause, without spending a sentence on it.

**Untouched, and deliberately so:** 1a (the `[plain]` that carries the pool key's own two words,
`purse` and `short`), 1b, 2d (the set's short line at ten words, and the face round 3 was
required to move off a participial opener), 3b, 3c and 3d. §21.2's "never a new one added" is
best served by not disturbing a passing face to prove effort, and §21.3's rule decides every
case where a sharper wording and a licensed one part company in favour of the licensed one.

## THE TWELVE, CHECKED BY MACHINE (this round's own run, inline, no file written)

Every regex and word list below was read out of the dock and re-declared by hand in a script
run from outside it. Per face: word count, the two-word opener `composedWalker.openerOfText`
reads, the closing word, and every flag.

     1  13w  [the purse    ] close: defences  clean
     2  11w  [what {}      ] close: upkeep    clean
     3  12w  [against what ] close: thin      clean
     4  13w  [coin set     ] close: defences  clean
     5  11w  [the charge   ] close: full      clean
     6  12w  [what the     ] close: coin      clean
     7  11w  [above the    ] close: defences  clean
     8  10w  [the keeping  ] close: purse     clean
     9  14w  [the defences ] close: upkeep    clean
    10  12w  [for the      ] close: charge    clean
    11  12w  [short of     ] close: stands    clean
    12  12w  [between the  ] close: short     clean
    distinct openers 12 of 12 · faces carrying any flag 0 · mean 11.92 · sd 1.037

The flag set run against every face: participial opener (the metric that failed at round 2 and
is 0.0000 on all twelve here) · `CONTRAST_SHAPES`, all eight limbs including `less … than` and
`(and|or) not …` · `SPECIFICATIONAL_COPULA`, both limbs · the pronoun closer and the
abstraction closer of `CLOSE_KINDS` · every `QUANTIFIERS` member (`no`, `any`, `every`, `only`,
`whole` and the rest) · every `AUTHORED_MAGNITUDES` member · every `COUNT_NOUNS` member · nine
of the twelve `CLAUSE_DETECTORS` that outrank PRESENT, including CONSEQUENCE (whose `cost` limb
is why no face uses the word *cost*), INSTITUTION, TRADITION, ABSENCE and PROVENANCE · the
carve-out token list (`now`, `still`, `since`, `no longer`, …) that R-DST-W4-c makes a hard
constraint on this block · `which` · the seven modals · digits, percent, em dash, semicolon,
colon, question and exclamation · `-ly` adverbs · the slot set and the opening slot (T-F8).
**Zero hits on all twelve.** Three consequences worth naming rather than leaving to be found:
every face falls through the detector stack to **PRESENT**, which is the move the annex row
declares, so the composed order carries the declared move and not a silently reclassified one;
no face opens on `{settlement}`, which ARCH §2.5's face row refuses outright (T-F8); and every
face carries exactly one slot, `{settlement}`, byte-equal to its parent's set (arm A6).

`armA5` measured over each variant's six face pairs: no pair shares an opener, and the widest
content-token overlap in the set is 3,333 basis points (variant 3, faces 0 and 3) against the
arm's conservative floor of 10,000. No pair is a synonym swap.

## WHAT EACH FACE CLAIMS, AND THE CARD CLAUSE THAT LICENSES IT

All twelve faces assert **exactly one claim, and it is the same claim in all twelve**: that
`readings.economicGates.military` holds — *what {settlement} puts to the defences it funds is
below what keeping them comes to* — as a STANDING fact of the record. Nothing else is asserted
by any face.

| card clause | what it licenses, in every face |
|---|---|
| `reads: readings.economicGates.military (measured)` | the single fact each face states |
| `may claim: that military holds, as a STANDING fact of the record` | present tense, unhedged, undated, ungraded; `standing` in 1a and 3a, the plain indicative everywhere else |
| `seat/form: sentence / sentence · move: PRESENT · angle: plain` | one sentence per face, present, plain; the `[plain]` angle is the card's, so all three variants keep it |
| `relation: addition` | the empty opener: no connective before the face, the unit being `spine + ' ' + modifier`, and no clause seat anywhere (S2's joint is not taken) |
| `bag: {settlement: proper}`, FILLED `{settlement}` | the one slot every face names, exactly once, never first (T-F8); a modifier naming neither a slot nor a band word is the summarising beat (ARCH §8.3, arm Q), and `{settlement}` is the only naming this bag offers |
| `audience: player (no mark)` · `covert: no` | **no `dm-only` mark on any variant or face.** This pool's reader is the player; the covert mark belongs to the covert pools and is not this pool's to carry |
| `may NOT: a count · a cause · a season · a future · a standpoint · a second fact · any field the attached spine tests (axis · score)` | refusals R4–R10 |
| `source: muster · standing LICENSED` | **spent on nothing.** Zero provenance moves are authored; refusal R1, and finding F2 |

**Face by face.** Where a word could be read as a second claim, the reading is named here
rather than left for the refuter.

*Variant 1 — the money in the subject seat (purse · outlay · means · coin).*

- `[plain]` **The purse at {settlement} falls short of the standing charge of its defences.**
  The one claim (`may claim`); the town named once (`bag`). `falls short` is the pool key's own
  word and the register's plain measurement idiom, and it is not the CONSEQUENCE detector's
  `falls on`. `standing charge` is a magnitude of money in words with no figure in it
  (R-DA-11) and carries the STANDING half of the claim in the adjective. The close lands on
  `defences`, the civic object the field names.
- `[face]` **What {settlement} lays out on its defences runs under their upkeep.** The same
  claim as an insufficiency of outlay. `lays out` names an outlay and no amount (`may NOT: a
  count`); `runs under` is a measurement in words, not a spatial figure; `upkeep` is a standing
  charge and not an event, so nothing here is HISTORY — this block holds no event-provenance
  field at all, which its own receipt calls the purest case in the corpus.
- `[face]` **Against what its defences come to, the means at {settlement} run thin.** A fronted
  comparison. `Against` is the ledger's comparison preposition, not opposition, and the block's
  own PROVENANCE line uses the same construction. `come to` is amount-to and is not the
  CONSEQUENCE detector's `comes out of`. `thin` is a magnitude in words, absent from both
  `QUANTIFIERS` and `AUTHORED_MAGNITUDES`. `means` is what a town can pay with; it names no
  count and no source, so this is not a PROVENANCE move (refusal R1). The `its` opening the
  sentence resolves forward to `{settlement}`, which is also how the face threads back to the
  spine — see THE THREAD.
- `[face]` **Coin set aside at {settlement} does not reach the keeping of its defences.** The
  plainest construction in the variant. `set aside` fences the sentence to the money earmarked
  for this charge, so no reader takes the face for a poverty claim — poverty is `prosperity`, a
  sibling pool's field. `does not reach` is a measurement, not a declared absence: nothing is
  said to be missing from the record, so R-DA-08's GAP is not taken and no `not-held` field is
  needed to license one; and it is not the ABSENCE detector, whose negative limb is
  `does not (say|record|hold)`.

*Variant 2 — the cost in the subject seat (the charge · what they take · the upkeep · the keeping).*

- `[plain]` **The charge of keeping {settlement}'s defences is not met in full.** The cost as
  the thing unmet. `in full` is a completeness word and not a fraction; no fraction word appears
  anywhere in the set. Eleven words, and the shortest `[plain]` of the three.
- `[face]` **What the defences at {settlement} take in their upkeep outruns the coin.** The cost
  fronted as the subject of the comparison. `outruns` is a magnitude relation and not a CONTRAST
  shape: no alternative is rejected, so wall 5 is never engaged, and all eight limbs of
  `CONTRAST_SHAPES` miss it. It measures rather than personifies; the estate's own worked row
  spends the same class of verb.
- `[face]` **Above the purse at {settlement} stands the upkeep of its defences.** A locative
  inversion, the strongest rhythm in the set, kept in that shape under §21.4 rather than
  flattened to subject-verb-object. `stands` is the register's standing verb; the INSTITUTION
  detector needs one of its named institution nouns within forty characters of such a verb and
  finds none here. The close lands on the civic object again.
- `[face]` **The keeping of {settlement}'s defences runs dearer than its purse.** The set's
  short line, which the register card licenses in as many words ("the short line exists"), at
  ten words, inside the band and above the `shareUnder8` floor. `dearer` is a magnitude in words
  and carries no figure. This is round 3's replacement for the participial opener and it is
  kept to the byte.

*Variant 3 — the defences in the subject seat (the thing kept, standing on short money).*

- `[plain]` **The defences at {settlement} are kept on a purse short of their standing upkeep.**
  The STANDING form of the claim: the defences stand, and the purse under them is short.
  `kept on a purse` fences the sentence to money, so no reader takes it for a capability claim;
  capability is `scores.military`, the attached spine's own field, and is barred to this pool by
  `may NOT: any field the attached spine tests`. `are kept` is not the TRADITION detector's
  `is kept (here|in)`.
- `[face]` **For the keeping of its defences, {settlement} does not find the charge.** `the
  charge` is a quantity of money, not a totality over persons, so the REFUSED COLUMNS line is
  untouched and no `closed` column is quantified (R-DA-15). Round 1's `the whole charge` stays
  retired: `whole` is a `QUANTIFIERS` member judged against a column's `closed` flag, and this
  pool resolves no closed column.
- `[face]` **Short of its upkeep is how the paid defence at {settlement} stands.** A fronted
  predicate closing on a standing condition; present indicative, no subjunctive edge, no future
  (A2; STATE never FATE). `the paid defence` restates the field's scope in three words for a
  reader who meets this face without the `[plain]`, and it is the one place in the set that
  scope is stated. It is not a specificational copula — `is how` is not among
  `is (what|who|the only|the one)` — so arm X is not engaged and no exhaustivity is entailed.
- `[face]` **Between the purse and the keeping of its defences, {settlement} stands short.**
  The shortfall stated as the distance between two named things, which is R-DA-11's "a
  comparison is a measurement in words" taken literally. The close is a condition, which varies
  the close KIND against this variant's other three.

**The close kinds across the twelve** (R-DA-04 measures the kind, not the last word): four faces
close on a present CONDITION — `thin` (1c), `in full` (2a), `stands` (3c), `short` (3d) — and
eight on the OBJECT, the civic thing or the money named for it: `defences` (1a, 1d, 2c),
`upkeep` (1b, 3a), `coin` (2b), `purse` (2d), `charge` (3b). No face closes on a generalisation,
a moral, an uplift or a hook; none closes on a pronoun, on the slot, or on an abstract-suffix
noun. The two kinds R-DA-04's set also holds — a prohibition and an absence — are not spent
here: an absence close would take R-DA-08's GAP, which this pool has no `not-held` field to
license (refusal R1's neighbour), and a prohibition close would assert a rule no field holds.

## THE THREAD (owner, ~21:4x; MOVE-GRAMMAR §1.4.1)

The composed unit is `spine + ' ' + modifier`, so every face is read as the passage's SECOND
sentence — after any of the six attached spines, and after any sibling modifier the composer
seats first. The six spines share exactly one noun with one another, `{settlement}`: three
speak of the watch, the arms and the households (`WEAK`) and three of the muster, the gate and
the arrangement (`CRITICAL`). So `{settlement}` is the only noun a face can carry forward and
be certain of, and every face carries it, once, never first. §1.4.1 licenses that echo in its
own words: A11's echo bound counts facts, not nouns, and a deliberate noun echo for the thread
is lawful.

Past the town, each face reaches for the nearest thing the spine has just put on the page.
Every face names `defences`, the class the watch, the muster, the arms and the gate all belong
to, so the second sentence lands on the same civic object the first was about, seen from the
money side. No face changes subject in the middle of the passage and no face needs to be the
passage's one turn outward: each states one fact about the thing already under discussion, and
each is a complete sentence that reads the same whether it is seated second or fourth.

Round 3 reported its own weakest pairing rather than hiding it, and this round reports the same
one because it is still the set's longest reach: variant 2's third face after the `CRITICAL`
`[street]` spine, where the spine's subject is the town's luck and the face's is the cost. The
face now reads `Above the purse at {settlement} stands the upkeep of its defences`, so the
town's name still arrives in the fifth word and the thread is picked up before the new subject
lands. It is the pairing a refuter would name and I name it first.

## RESTATEMENT AND CONTRADICTION, CHECKED AGAINST THE SIX ATTACHED SPINES (arms A1, A11)

The six spines assert a **capability** band on `scores.military` — a watch against a garrison,
arms counted in households rather than issued from the hall, a town that does not think of
itself as fighting; nothing that would stop a comer, no muster worth the name, nobody having
wanted the place. This pool asserts a **funding** fact on `readings.economicGates.military`. No
face names the axis, the band, the muster, the arms, the watch, the gate, the households or the
hall, so nothing is said twice (A11), and no band-governed noun is extractable from any face,
so arm A1 has no overlap to report as a restatement or as a conflict.

Nothing contradicts either, and the ground is worth stating because the `CRITICAL` `[visitor]`
spine reads like a denial that any defence exists. It is not one: it is a capability judgment,
and the gate this pool reads is written only under `hasAnyDefense`, so on every town that can
draw this pool at least one paid defence exists to be underfunded. At `CRITICAL` that may be
the walls alone, which is exactly why no face names paid men (refusal R7).

## REFUSALS — what could not be made lawful, and why (a refusal is a result)

1. **THE PROVENANCE MOVE — REFUSED for this pool at every wording.** The licence card prints
   `source: muster · standing LICENSED`, which reads as a licence; the walker's third limb is
   the one that binds — `if (held.holder === null)` gives **WITHHELD, "a holder with no
   institution"**: the holder kind resolves to no institution in this town's roster, so the
   cited record has nobody keeping it (`composedWalker.js:856-859`). The limb is keyed on the
   POOL, not on the wording, so no citation of any holder passes here: a different holder is not
   licensed by the card, and the licensed holder has no institution. Round 1 spent one face on
   that gap and took six A13 findings for it; rounds 2, 3 and 4 author none. The banked round-1
   face stays in this packet's history as a refusal row with its measurement (§22 (b)) and the
   family stays at four.
2. **The `Q` finding on 12 of 72 composed units — REFUSED as this pool's; it is the SPINE's,
   proved by control and by the composition rule.** The segment is the half after the semicolon
   of the `CRITICAL` `[ledger]` spine. With the modifier deleted entirely the finding still
   fires, unchanged, on the same segment; and it cannot be reached from a modifier by
   construction, because `unitsOfPool` seats the spine first and the arm splits on sentence
   boundaries, so the spine's semicolon coordinate is never in the same segment as a face. The
   refuter's answer on the merits is ADVERSE to the spine: the coordinate is a second fact and
   the block holds no typed field for it. Five repairs are measured above; (iii) is recommended,
   (i) is refused as a concealment, and round 3's own recommendation (ii) is refuted. Carried up
   as F5.
3. **The `A3` finding on 12 of 72 composed units — REFUSED as this pool's, and ANSWERED in the
   pool's favour on the merits.** The alternative is `rather than in what the hall issues`, in
   the `WEAK` `[ledger]` spine. It also survives the modifier's deletion. But the row is a
   WITHHELD to the refuter, not a fail, and this packet answers it: `hall` and `issues` are
   named by no sibling pool KEY (verified — the key set's content words hold neither), and wall
   5 is satisfied on its BAND half instead, by `scores.military: STRONG` `[ledger]` and
   `ADEQUATE` `[ledger]`, which are the sibling bands that supply arms issued and listed by the
   hall. Nothing in the wording of this pool bears on it either way; no face of this set carries
   a contrast shape at all.
4. **A count, a share or a ratio** ("half its keep", "two parts of three"). REFUSED: card `may
   NOT: a count`; the no-digit wall (A4, R-DA-16); every member of the count and
   `AUTHORED_MAGNITUDES` sets is absent from all twelve faces, so no face adds one against its
   `[plain]` parent (A6). The gate's own arithmetic is a number the record does not state.
5. **A cause** ("the town's trade cannot carry it"). REFUSED: card `may NOT: a cause`. Refused
   **against the world, not by it** — the economic output genuinely drives the gate, so a causal
   face would be TRUE and still unlicensed: that driver is a second field this pool does not
   read, and MOVE-GRAMMAR §1.2 row 2 gives HISTORY and CAUSE only to an event-provenance field,
   which this block holds nowhere. Named again so no later author re-proposes it as an obvious
   improvement.
6. **A season, a term or a date** ("this year the purse is short", "since the last levy").
   REFUSED: card `may NOT: a season`; every such word is a DURATION member and would be an A6
   addition against the parent; a term boundary is a HISTORY move with no event-provenance field
   behind it; and `since` is on this block's own carve-out token list (R-DST-W4-c), which makes
   it a hard constraint here rather than a band.
7. **Paid men, wages, the garrison or the watch** ("the garrison's wages are behind"). REFUSED
   on two independent grounds: the gate is written wherever ANY defence exists — walls alone
   will do — so a wages claim is false on a walls-only town and would break claim equality
   inside the variant (arm C / A6); and the watch and the garrison are institutions the attached
   spines work in, so naming them risks A11 as well as `may NOT: any field the attached spine
   tests`.
8. **An edge or a future** ("unpaid defences would go unrepaired"). REFUSED: card `may NOT: a
   future`; a subjunctive edge here would assert a capability outcome, which is the spine's
   field. THE PROMISE: state never fate. No face carries `will`, `would`, `could`, `can`, `may`,
   `might` or `shall`.
9. **A second fact of any kind** — what the shortfall reaches, what the purse holds instead, who
   makes it up. REFUSED: card `may NOT: a second fact`; `RELATION: addition` holds no
   `consequence.clause` joint, so S2's clause seat is not available to this pool and no face
   carries a semicolon, a colon or a joint.
10. **A contrast face** ("kept on coin and not on wages"; "paid in part rather than in full").
    REFUSED twice: wall 5 licenses a contrast only where a sibling pool key or band names the
    rejected alternative, and this block's siblings name none of these; and the antithesis SHAPE
    is the estate's most-exceeded band, so a contrast face would spend depth on a shape this
    pool does not need. All twelve faces are positive statements of one magnitude relation.
11. **A `dm-only` face.** NOT AUTHORED: `covert: no · audience: player (no mark)`. The covert
    pools mark every variant; this one marks none.
12. **A totality** ("the charge is never met", "nothing in the purse answers it"). REFUSED: the
    REFUSED COLUMNS line (a totality over persons) and R-DA-15's quantifier rule — a quantifier
    is licensed only by a `closed` column, and this pool resolves none.
13. **THE SENTENCE-SPLITTER ROUTE TO A CLEAN Q — FOUND, MEASURED, AND REFUSED.** There is
    exactly one wording move by which a modifier can take the Q finding to zero, and it is
    worth recording so that no later author finds it and takes it for a cure. `armQualify`
    splits on `/(?<=[.?!])\s+(?=[A-Z"'(])/` — a lookahead on a capital, a quote or a bracket.
    A face beginning with `{settlement}` would not match it, the whole composed unit would
    collapse into one `raw` element, and the spine's semicolon coordinate would then be joined
    to a segment carrying the slot and would be licensed. It is refused three times over: ARCH
    §2.5's face row refuses a sentence face that opens on a `proper`-typed slot of the block's
    bag outright (T-F8), so the projector would reject the row before any gate saw it;
    R-DA-17's "the settlement token opens at most one variant per pool" would be broken twelve
    times; and it cures nothing — it blinds the detector to a defect that is still there. A
    measure cleared by stepping outside the instrument's window is the false green, not a fix.
14. **A second level-1 GRAMMAR. DECLARED, not concealed.** Of MOVE-GRAMMAR §2.1's V1–V8 only
    **V1 (PRESENT alone)** is licensable here: no `none-exists` field (V3), no `not-held`
    provenance (V8), no named-object field (V4), no institution row (V5), no unresolved-value
    field (V6), no structural-consequence field (V2), no event provenance (V7). §3.1's rule is
    to write only the members the block licenses and never to write one empty, so the three
    variants vary in SUBJECT, VERB and RHYTHM inside V1 — the money, the cost, the paid defence
    — and not in grammar. A walker should read the one grammar as the licensing filter's own
    result and not as a flat pool.

## FINDINGS CARRIED UP

- **F1 — the modifier sentence band is still UNPINNED.** ARCH §6.1 pins a FRAGMENT estimate and
  the unit's `<= 2 sentences · <= 3 facts`, but no word band for `FORM: sentence` at the
  MODIFIER grain; R-DA-05/R-DA-06's figures are REGISTER-grain over whole variants. This set was
  written to a declared working band of **8–16 words, interior 10–14**, and lands at mean 11.92.
  The number wants setting at car 6, with a within-pool spread floor decided beside it: R-DA-05
  asks a POOL for a within-pool sd of at least 4.0 words, and that figure was measured on
  multi-sentence R1 variants. **A one-sentence modifier face cannot reach it without a second
  claim.** This set's sd is 1.037 and round 3's was the same; twelve one-sentence faces of one
  fact will always sit near there. Either the sd floor takes a modifier-grain value at car 6 or
  the walker declares it NOT-EXECUTABLE at this grain, and both are better than a silent fail.
  The per-face grain also makes every RATE metric 0-or-1 on a single-sentence face, so
  `shareUnder8`, the participial opener, the antithesis shape, the triad, the which-tail, the
  doubled adjective and both closer rates are walls in all but name at this grain — which is
  what the gate's round-2 figure of 28.24 band-widths on one participial opener was really
  telling us.
- **F2 — the licence card's `source` line and arm A13 disagree on this pool, and the card is the
  friendlier of the two.** The card prints `source: muster · standing LICENSED`, which a writer
  reads as "a citation is licensed here"; the walker withholds every citation because the holder
  KIND resolves to no institution in the town's roster. Round 1 spent a face on that gap. **The
  card should print the institution resolution beside the standing** — or print `NO citation is
  licensed`, as it does for an unresolved source — so the next writer is not invited into the
  same refusal. This remains the one instrument change this packet asks for, and it is now three
  rounds old.
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
  a funding fact is orthogonal to a capability band at every rung. **Widening the attach to three
  would cost no re-authoring**, and it would add 36 units of which none carries either of this
  pool's two spine-borne findings, so the pool's PASS share would rise from 48/72 to 84/108 with
  no wording change at all. The echo bound cannot arbitrate — the card records that this pool's
  read is absent from the census's fact index and that the echo table is keyed on a coarser
  producer-token root — so the ATTACH set is the only guard, which is why the disagreement wants
  a ruling rather than a shrug.
- **F5 — SHARPENED, and it is the finding that decides whether this pool's number means
  anything: the composed walk charges a modifier pool for its spines' defects, and the estate
  already has the ruling that fixes it.** Twenty-four of this pool's seventy-two unit verdicts
  are WITHHELD, the band is `WITHHELD 0`, and every one of the twenty-four survives the deletion
  of the modifier. **CLERK-LAWS §2.6.1 is the precedent, in the chair's own words:** *"a rewrite
  may not ADD a FAIL" is enforceable only when a finding is keyed on its SITE (the text or
  offset) as well as its class, arm and column; a class-only key reads a second fault of an
  inherited class as `added 0`.* The pair instrument already carries the site in its `claimKey`
  for exactly this reason. The composed walk does not, and so it attributes a spine's site to a
  modifier's pool. Three routes, in the order I would rank them: **(a)** the composed walk keys
  a finding on the PIECE whose text carries the segment and a pool's verdict counts only
  findings on its own piece — `piecesOf` already exists and armA13 already uses it, so the
  machinery is present and §2.6.1 is the ruling that says a site-key is required; **(b)** the
  two spines are repaired in the spine lane, the Q coordinate by candidate (iii) and the A3 row
  by a chair's line recording the refuter's answer, which costs one spine face and one sentence
  respectively; **(c)** the pool's ATTACH is narrowed away from the two `[ledger]` spines, which
  I rank last because it cures the measurement by shrinking the product, and the card's attach
  set is already narrower than the architecture's (F4). **The choice is the chair's; the
  measurement is not.** Under (a) or (b) this set reads FAIL 0 · WITHHELD 0 · PASS 72 of 72 with
  the twelve rows above unchanged.
- **F6 — NEW: a walker's WITHHELD channel is being read as a failure, and two of the estate's
  arms say in their own docblocks that it is not.** `armA3` writes "the band half is the
  refuter's" and prints the sibling keys beside the row so a human can answer it; `armQualify`
  writes "a second fact or a summarising beat is the refuter's call". Both are questions put to
  a person, and the taste gate is scoring the unanswered question as a failed measure against
  whichever pool happened to be composed when it was asked. On this pool the two answers differ
  — A3 resolves in the pool's favour, Q resolves against the spine — and neither answer is a
  number the walker can produce. **The gate should carry a fourth column: WITHHELD-UNANSWERED
  beside WITHHELD-ANSWERED**, and a pool's band should read the answered channel. Otherwise
  every pool that attaches to a spine carrying a refuter question is unsatisfiable by
  construction, and the taste's staffing table (§23) will be comparing authors on a number none
  of them can move.

## WHAT WAS EXECUTED

`node scripts/prose-licence-card.mjs DS-GEN-3 'purse: short'` in the read-only dock — the one
script this seat may run there. Read whole or by the named section: `REGISTER-CARD.md` (whole,
with amendments S2 and S3); `RULES-V2-PART-B.md` §1 (R-DA-00 to R-DA-24 and §1.W), §16, §16.1,
§16.2, §18, §20, §21, §21.1, §21.2, §21.3, §21.4, §22, §23; `sweep/MOVE-GRAMMAR.md` §1–§3 and
§4.4.1–§4.4.3, with §1.4.1; `sweep/CLERK-LAWS.md` §2.4.1 and §2.6.1;
`arch-prose/ARCH-COMPOSED-PROSE-v2.md` §2.5 and §8.3. In the dock, READ ONLY:
`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` §DS-GEN-3 whole (the six attached spines, the
block's other pools, and this pool's row), `src/domain/prose/composedWalker.js` (arms A3, A5,
A6 and A13, `openerOfText`, `siblingDistance`, `contentWords`, `piecesOf`),
`src/domain/prose/entryWalker.js` (`armQualify`, `armExhaustivity`, `bandReadings`, `SLOT_RE`,
`sentencesOf`), `src/domain/prose/entryLexicons.js` (`CONTRAST_SHAPES`,
`SPECIFICATIONAL_COPULA`, `CLOSE_KINDS`, `BAND_PHRASES`, `AUTHORED_MAGNITUDES`, `COUNT_NOUNS`,
`QUANTIFIERS`, `RECORD_CITATION`, `FUTURE_INDICATIVE`), `src/domain/prose/moveGrammar.js`
(`CLAUSE_DETECTORS`, `clauseUnits`) and `scripts/taste-measure.mjs` (`unitsOfPool`, `facesOf`,
`words`, `bandPositionOf`, the per-pool verdict and the `siblingKeys` it supplies). The three
verification runs above executed from standard input, outside every dock, with every regex and
word list re-declared by hand; **no dock byte was written, no test was run in any dock, and no
file outside this packet was created or modified.**
