1. `[plain · dm-only]` The watch {settlement} keeps is bought without the town's knowledge.
   - `[face]` Bought out of the town's view, the watch of {settlement} is a buyer's watch.
   - `[face]` A buyer holds the watch in {settlement}, and holds it unseen by the town whose watch it is.
   - `[face]` Beyond the town's notice, {settlement}'s watch is bought.
2. `[plain · dm-only]` Unknown to the town, the watch of {settlement} has a buyer.
   - `[face]` Out of the town's sight stands the bargain that keeps {settlement}'s watch bought.
   - `[face]` Outside the town's ken, the purchase behind {settlement}'s watch holds.
   - `[face]` Under cover a buyer has the say over {settlement}'s watch.
3. `[plain · dm-only]` A bought watch is kept in {settlement}, and the town is told nothing of the buying.
   - `[face]` Bought is the watch of {settlement}, and the town has not heard as much.
   - `[face]` Unaware, {settlement} keeps a watch that is bought.
   - `[face]` Who holds {settlement}'s watch is not known in the town, and the buying goes unspoken.

--- NOTES

## 0. THE FAILING MEASURE, REMOVED, AND THE SET RE-MEASURED

The gate's one failing measure was `band depth · closers.abstractNounRate (over)` at 8.6
band-widths on variant 2's `[plain · dm-only]` line, `Under a covert arrangement a buyer has
the watch of {settlement}.` The mechanism is in the shipped instrument
(`src/domain/prose/proseFingerprint.js:114,147`): the closing word is stripped to letters, so
`{settlement}.` reads `settlement`, and `settlement` ends in `-ment`, which is on the
abstract-suffix list. Any face that CLOSES on the slot reads 1.000 against the exemplar band
0.0122 to 0.1151, which is (1 minus 0.1151) over 0.1029 = 8.60 band-widths. The cure is a
word order and not a claim: no face of the twelve closes on `{settlement}`.

Re-measured on the fingerprint's own formulas over the ten exemplar bands
(`prose-research/primary/*.fingerprint.json`, min to max, the same bands the harness prints,
0.0122 to 0.1151 on this metric): every one of the twelve faces exceeds 13 of the 21 scored
metrics (share 0.619, inside the entry budget of two thirds), and the deepest exceedance on
every face is `wordsPerSentence.neighbourVariation` at 1.597 under, which is the profile the
draft's eleven clean faces already carried. No face exceeds 1.75 on any metric. Failing
states: before 1, after 0, none added.

Closers, twelve of twelve off the abstract list and off the pronoun list: knowledge · watch ·
is · bought · buyer · bought · holds · watch · buying · much · bought · unspoken. Lengths
10 · 14 · 18 · 8 · 11 · 13 · 10 · 10 · 16 · 14 · 8 · 15, range 8 to 18, within-pool sd 3.223
(the draft 3.013). Twelve distinct two-word openers. Longest word run shared with the twin
pool `watch: bought (revealed)`: four words, `the watch of {settlement}`, the estate's term
and its slot. Longest run shared between any two faces of this pool: four words,
`{settlement} and the town` (faces 3 and 3a), the slot and the thread noun. Longest run
shared with the draft: eight words, `holds the watch in {settlement} and holds it` (face 1b
against the draft's 1a), which is the doubled-verb shape that row was written to refine and
which face 1b keeps on purpose. `the town` carried on ten of twelve faces, `keeps` or `kept`
on three; the watch is the passage's one turn outward on every face.

Every face was checked against the shipped lexicons and returned empty: `QUANTIFIERS`,
`CARDINAL_WORDS`, `AUTHORED_MAGNITUDES`, `DUTY_PREDICATES`, `DUTY_STEM_NOUNS`,
`OFFICE_NOUN_CANDIDATES`, `RELATION_LEMMAS`, all four `PROVENANCE_LEXICONS` classes,
`CONTRAST_SHAPES`, `SPECIFICATIONAL_COPULA`, `RECORD_CITATION`, `FUTURE_INDICATIVE`, armC3's
past-tense markers, the move classifier's PROVENANCE regex (`provenanceCount` 0 on all
twelve; arm A13 silent, as the card requires), and `check-pair`'s DURATION, COUNT and RATION
lists read face against parent (nothing added on any face). No modal, no join word, no
semicolon, colon, em dash, question, exclamation, parenthesis, quotation mark, `, which`,
digit or `-ly` word. No face opens on `{settlement}` (T-F8); every face carries exactly
`{settlement}` (arm A6, arm D); every face is one sentence closed by its own stop (arm A9).
No face names a wall, a threat, a muster, a wage, a purse, the country, the word `present`
or anything the attached spines test. No face names a record or a holder: the card reads
`source: (none) · SOURCE-UNRESOLVED`, so the covertness is written on the town's knowledge,
view, sight, notice, ken and hearing, never on a roll or a book.

## 1. THE LICENCE, HELD

One reading, `compromised.covert`, whose producer (`src/domain/corruption.js:663`) is a
security institution carrying a corruption impairment flagged covert, or a corrupt NPC housed
in it, and whose own gloss is that a bought watch shields recruits whether or not the town
knows it is bought. Two claims and one slot on all twelve rows: the watch is bought (a buyer,
a bargain, a purchase, a buyer's watch, the say over the watch: the INSTITUTION move, who
holds the institution's obedience); the buying is not known to the town (the covert leaf, and
why every variant keeps `dm-only`); `{settlement}`. `RELATION: addition` honoured, no join
word anywhere. `the town` is the civic body the spines themselves credit with knowing and
noticing, never a totality over persons.

## 2. THE TWELVE, ONE LINE EACH

1. plain: `out of public sight` became `without the town's knowledge`; the covertness is now
   written on the thread noun the spines carry and as the fact the engine holds (the town
   does not know), sharper than sight.
2. 1a: `Another interest holds the watch in {settlement}, and holds it well clear of the town's
   common dealing` became `Bought out of the town's view, the watch of {settlement} is a
   buyer's watch`: the vague `another interest` is replaced by the card's own agent, the
   borrowed twin phrase `common dealing` goes, and the line lands on `a buyer's watch`, the
   whole fact in three words.
3. 1b: `Bought without public notice, the watch of {settlement} answers a buyer` became `A buyer
   holds the watch in {settlement}, and holds it unseen by the town whose watch it is`: the
   doubled verb carries the rhythm, and the close sets the buyer's hold against the town's
   ownership in syntax alone, with no contrast word and no comment.
4. 1c: `Away from the town's talk` became `Beyond the town's notice`: unnoticed is the sharper
   fact than untalked-of; the eight-word short line is kept at the floor the metric allows.
5. 2 plain (the failing face): `Under a covert arrangement a buyer has the watch of
   {settlement}.` became `Unknown to the town, the watch of {settlement} has a buyer.`: the
   slot leaves the closing position and the 8.60 band-widths go to zero; the system's label
   `covert arrangement` is replaced by the fact it stands for, and the frame stays first,
   which is this variant's shape.
6. 2a: `A covert bargain keeps the watch of {settlement} bought` became `Out of the town's sight
   stands the bargain that keeps {settlement}'s watch bought`: the frame is fronted and the
   verb inverted before its subject, the clerk's own cadence, and the label word goes.
7. 2b: `The purchase that stands behind {settlement}'s watch stays out of the town's public word`
   became `Outside the town's ken, the purchase behind {settlement}'s watch holds`: three words
   of scaffolding cut inside the band, the antique air put in the noun `ken` as the register
   card licenses and nowhere in the syntax, and the line closes on a standing fact.
8. 2c: `Beyond common knowledge {settlement} carries a bought watch` became `Under cover a buyer
   has the say over {settlement}'s watch`: the sharpest licensed statement of the INSTITUTION
   move (who holds the watch's obedience) in the idiom of the record, two compressions in ten
   words under the density law.
9. 3 plain: `In {settlement} the watch is bought, and the town hears nothing of the buying`
   became `A bought watch is kept in {settlement}, and the town is told nothing of the buying`:
   `kept` picks up the spines' verb, `is told nothing` states the concealment as an act done
   to the town rather than a failure of its hearing, and the ration word `nothing` stays at the
   parent's count.
10. 3a: `To a purchaser the watch of {settlement} is sold, unannounced` became `Bought is the
    watch of {settlement}, and the town has not heard as much`: the tail qualification R-DA-03
    refuses is gone, `purchaser` and `sold` go under R-DA-22's one term for one thing, and the
    predicate-first inversion opens the line.
11. 3b: `The sale of {settlement}'s watch stands, and stands unspoken` became `Unaware,
    {settlement} keeps a watch that is bought`: the pool's second eight-word line, the town as
    keeper in the spine's own verb, the whole covert fact in the one fronted word.
12. 3c: `Who holds {settlement}'s watch is not a public matter, and the purchase runs outside the
    town's hearing` became `Who holds {settlement}'s watch is not known in the town, and the
    buying goes unspoken`: `not a public matter` sharpened to `not known`, and the second limb
    compressed to three words that land.

## 3. REFUSALS, BANKED

1. A provenance face (`the watch's own count`, `the town's books`): refused, the card licenses
   no citation (`arm A13`), and the classifier's PROVENANCE regex would count it.
2. `in a buyer's pay`, `does a buyer's bidding`, `answers to`: refused, the first is
   `RELATION_LEMMAS`'s shape in other words, the second asserts orders given on a state-only
   field, the third is on the list. `has the say over` carries the same licensed fact as a
   standing condition.
3. `off the town's books`, `the buyer goes unnamed`: refused as the ABSENCE move's GAP class,
   which needs a `not-held` record field the block does not carry.
4. `in the dark`, `behind the town's back`: refused under the figure policy; `under cover` and
   `ken` are kept as literal words of the record, not figures.
5. `the town none the wiser`, `nobody in {settlement}`: refused, `none` is a quantifier
   judged against a closed column and the second is a totality over persons.
6. A seven-word face: refused on measurement, `shareUnder8` would read 1.000 at 2.19
   band-widths, a new failing state; eight is the floor and two faces sit on it.
7. The 48 inherited WITHHELD rows are the four spine tails, outside these fences; `owned` was
   already FAIL 0 WITHHELD 0 and stays so by construction (no semicolon, `{settlement}` in
   every face).
