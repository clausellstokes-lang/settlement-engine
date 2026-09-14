1. `[plain · dm-only]` The watch {settlement} keeps is bought out of public sight.
   - `[face]` Another interest holds the watch {settlement} keeps, and holds it clear of public dealing.
   - `[face]` Suborned without public notice, the watch of {settlement} stands bought.
   - `[face]` A buyer has {settlement}'s watch, and the buying stays out of common talk.
2. `[plain · dm-only]` Under a covert arrangement the watch in {settlement} answers a purchaser.
   - `[face]` Unexposed, the purchase that holds {settlement}'s watch still stands.
   - `[face]` The buying of the watch {settlement} keeps sits outside the town's public word.
   - `[face]` Obedience in the watch that {settlement} keeps runs to a covert buyer.
3. `[plain · dm-only]` In {settlement} the watch is bought, and the arrangement runs unremarked.
   - `[face]` To a buyer the watch {settlement} keeps is sold, and the selling stands without public notice.
   - `[face]` Bought, and covert, the watch of {settlement} answers a buyer.
   - `[face]` What {settlement} has for a watch is bought, and the buying goes unannounced.

--- NOTES

## 0. THE FAILING MEASURE, ANSWERED — AND REFUSED, WITH ITS ARITHMETIC

The gate returned ONE failing measure in two forms: `composed walk · Q · a trailing coordinate
naming no second field` (≥ 40 findings, the list capped at 40 of 48) and `composed walk · unit
verdicts` (FAIL 0 · WITHHELD 48 · PASS 48 of 96). They are the same 48 events counted twice —
one finding per withheld unit.

**Every one of those 48 events belongs to a shipped SPINE sentence, and not one belongs to this
packet.** The measurement says so and the arithmetic closes without remainder.

Read from `taste/measure-draft.json`, this pool's `walk.findings` (40 listed of 48; channel
WITHHELD ×40, klass Q ×40, zero of any other class):

| the clause the arm names | its spine | listed |
|---|---|---|
| `built work stands on its own patience.` | `WALLED-QUIET` variant 3, after its semicolon | 12 |
| `stone keeps itself, and wages do not.` | `WALLED-STRAINED` variant 1, after its semicolon | 12 |
| `the threat is on the town's books as plainly as the grain.` | `WALLED-THREATENED` variant 1, after its semicolon | 12 |
| `the town knows what it is for and checks it.` | `WALLED-THREATENED` variant 2, after its semicolon | 4 (of 12; the print stops at the 40 cap) |

The pool composes 12 rows (3 variants × 4 faces) against 8 attached spine variants
(`WALLED-QUIET` 3 + `WALLED-STRAINED` 2 + `WALLED-THREATENED` 3) = **96 units**, which is the
number the gate reports. Exactly **4 of those 8 spine variants carry a post-semicolon tail**;
4 × 12 = **48**, which is the withheld count, the finding count, and the sum of the table above
once the capped row is restored to 12. There is no residue for a finding of this packet's own,
and a scan of all 40 listed clauses for any packet word — bought, buyer, purchase, covert,
suborned, unexposed, obedience, buying — returns **the empty set**.

**Why no wording in this pool can move it.** `src/domain/prose/entryWalker.js:809-839`
(`armQualify`): the arm splits the composed text into sentences (`raw`), calls `consider` on
`raw[1…]`, then splits **each** sentence on `/\s*;\s*/` and calls `consider` on every part after
the first. `consider` returns licensed when the segment carries a `{slot}` or a `bandReadings()`
phrase, and withholds otherwise. The four clauses above are the second halves of the spines'
own semicolons; their text is fixed at `RECEIPT_POOLS_DOSSIER_STATE.md:6027-6044`, this packet
writes no spine byte, and a modifier composed after a spine cannot alter a segment the spine
already contains. **This is a REFUSAL with its measurement, not an unattempted round.**

Two consequences worth putting on the record rather than absorbing:

- The measure is monotone in this pool's SIZE, not its quality: 48 = 4 × the row count. Growing
  the family from four faces to five would raise the withheld count to 60 with no wording fault
  anywhere in it. The number is therefore not usable as a quality signal on this pool while the
  spine tails stand.
- The cure is a spine act, outside this packet's fences: either the four spine tails are
  rewritten to name a second typed field (or to lose their semicolons), or arm Q is given a
  provenance for inherited spine segments so a modifier is not withheld for its neighbour's
  clause. Both are the chair's, and both are named here rather than attempted.

**What round 3 did with the round instead.** §21.2 and §21.3 bind whether or not the gate can be
moved: every set is refined toward the ceiling, an unlawful set keeps its refinement if its
failure count falls or holds with no new failure. The failure count holds at 48 (spine-owned)
and this round adds none. The named targets pushed, each verifiable on the rows above:

1. **Tense — the standing fact put in the present.** Round 2's `has been bought` (variant 1
   plain) and `has been ... ` constructions carried a perfect on a state-only reading. The
   register card's present stands and R-DA-07 wants the copula, not a history flavour on a field
   that holds none. Every row now states the fact in the present: `is bought`, `stands bought`,
   `holds`, `answers`, `runs`, `sits`, `is sold`. This also widens the margin on arm C3's
   semantic half, which withholds on `\b(had|were|was|used to|once|formerly|no longer)\b` —
   zero hits across twelve rows.
2. **The thread (owner, ~21:4x), made deliberate and varied.** Every spine names {settlement},
   and five of the eight also carry *keeps / keeping* (`{settlement} keeps its {defwork}`,
   `keeps a {defwork}`, `{settlement} keeps this one`) or *the town* (`The town pays little`,
   `the town knows what it is for`). Each face picks a noun forward from that stock and places
   it early, so the modifier reads as the passage's next sentence and not as a fresh start.
   Round 2 did this with ONE phrase — `the watch {settlement} keeps` — on 9 of 12 rows, which is
   a thread bought at the price of a pool signature. Round 3 spreads it over seven forms:
   `the watch {settlement} keeps` ×4 · `{settlement}'s watch` ×2 · `the watch of {settlement}`
   ×2 · `the watch in {settlement}` ×1 · `the watch that {settlement} keeps` ×1 ·
   `In {settlement} the watch` ×1 · `What {settlement} has for a watch` ×1.
3. **Sibling distance widened inside each variant.** The four rows of a variant now differ in
   head noun (the watch · another interest · a participle · a buyer), in rhythm, and in the noun
   the covert half lands on (sight · dealing · notice · talk; purchaser · stands · word · buyer;
   unremarked · notice · buyer · unannounced). No face is a synonym swap of a sibling.
4. **Length spread opened.** Round 2 ran 10–16 with variant 2 flat at 11/11/13/11. Round 3 runs
   9–16 with every variant carrying a long, a middle and a short: 10/14/10/13 · 11/9/13/12 ·
   11/16/10/13.
5. **Zero new failing states.** Every guard round 1 and round 2 paid for is held by
   construction: `{settlement}` on all twelve rows (arm Q's own licence for THIS packet's
   sentence, which is `raw[1]` of the composed unit); no semicolon and no colon; no word ending
   in -ly; no pronoun closer and no abstract-suffix closer; no digit, em dash, exclamation,
   question, parenthesis or quotation mark; no `, which`; no antithesis shape; no triad; no
   `X and Y` adjective pair (every `and` in the set is preceded by a comma, which the detector's
   regex does not cross); no `-ing` opener; and no row opening on the `proper`-typed slot
   (T-F8).

## 1. THE LICENCE, FACE BY FACE

The card is one reading with two halves, and every row asserts those two and nothing else:

- **(α) the watch is bought** — `reads: compromised.covert` (measured); `may claim: that covert
  holds, as a STANDING fact of the record`; **MOVE:** `INSTITUTION` (the institution's
  allegiance, by the card's own seat).
- **(β) the buying is not public** — the `.covert` leaf of the same reading; the card's `covert:
  YES` is why it is stated and why every variant carries `dm-only`.
- **(γ) the town named** — `bag: {settlement: proper}`, FILLED at this block's call sites; the
  slot is the packet's only slot and its presence is also what licenses this sentence past arm Q
  (`entryWalker.js:820`).

`RELATION: addition` is honoured throughout: no row asserts a join to the spine's fact — no
because, no therefore, no so, no while, no despite.

| # | face | words | α licensed by | β licensed by | γ |
|---|---|---|---|---|---|
| 1 | `[plain]` The watch {settlement} keeps is bought out of public sight. | 10 | `is bought` ← `compromised.covert` | `out of public sight` ← the `.covert` leaf | `{settlement}` |
| 1a | Another interest holds the watch {settlement} keeps, and holds it clear of public dealing. | 14 | `another interest holds` ← the same reading (a purchaser holds the watch) | `clear of public dealing` | `{settlement}` |
| 1b | Suborned without public notice, the watch of {settlement} stands bought. | 10 | `stands bought` | `without public notice` | `{settlement}` |
| 1c | A buyer has {settlement}'s watch, and the buying stays out of common talk. | 13 | `a buyer has` | `stays out of common talk` | `{settlement}'s` |
| 2 | `[plain]` Under a covert arrangement the watch in {settlement} answers a purchaser. | 11 | `answers a purchaser` | `under a covert arrangement` | `{settlement}` |
| 2a | Unexposed, the purchase that holds {settlement}'s watch still stands. | 9 | `the purchase … still stands` | `unexposed` | `{settlement}'s` |
| 2b | The buying of the watch {settlement} keeps sits outside the town's public word. | 13 | `the buying of the watch` | `outside the town's public word` | `{settlement}` |
| 2c | Obedience in the watch that {settlement} keeps runs to a covert buyer. | 12 | `obedience … runs to a buyer` | `covert` | `{settlement}` |
| 3 | `[plain]` In {settlement} the watch is bought, and the arrangement runs unremarked. | 11 | `is bought` | `runs unremarked` | `{settlement}` |
| 3a | To a buyer the watch {settlement} keeps is sold, and the selling stands without public notice. | 16 | `is sold` to a buyer | `without public notice` | `{settlement}` |
| 3b | Bought, and covert, the watch of {settlement} answers a buyer. | 10 | `answers a buyer` | `covert` | `{settlement}` |
| 3c | What {settlement} has for a watch is bought, and the buying goes unannounced. | 13 | `is bought` | `goes unannounced` | `{settlement}` |

Nothing else is claimed. No row carries a count, a cause, a season, a future, a standpoint, a
second fact, a second civic object of the class `force`, or any of the three fields the attached
spines test (`forces.walls.present` · `settlement.config.monsterThreat` ·
`settlement.defenseProfile.economicGates.military`) — which is why no face names the wall, the
work, the country, the threat, the muster, or a wage, upkeep or purse, even where such a noun
would have made the thread to the spine easier to see.

## 2. REFUSALS — each with the clause that refuses it

1. **The gate's one failing measure, refused as unreachable from inside this packet.** 48 of 48
   Q findings are the four spine tails listed in §0; `entryWalker.js:837` reads the spine's own
   post-semicolon segments; the packet writes no spine byte. Banked as a refusal row with its
   measurement (§21.2's "banked, never trimmed"), and named as a sitting row: the cure is a
   spine rewrite or an arm-Q provenance for inherited segments, and both are the chair's.
2. **A provenance face — refused.** The thread would be well served by naming who holds the
   record of the purchase (the watch's own count, a factor's book, the elders' memory). The card
   reads `source: (none) · standing SOURCE-UNRESOLVED · NO citation is licensed: a face naming a
   record holder here is refused by arm A13`. No face names a holder; `provenance.citations` and
   `provenance.a13` stay at 0 for this pool. This also strikes `the town's books`, the one thread
   noun `WALLED-THREATENED` variant 1 offers.
3. **A `{defwork}` thread — refused.** The card's bag lists `defwork: bare-common` but records it
   unfilled at this block's call sites, and arm D fails a slot the composer never fills
   (`entryWalker.js:791-795`). `{settlement}` is the packet's only slot on every row.
4. **A band word as arm Q's licence — refused.** `bandReadings()` would license a segment
   carrying `several`, `a handful`, `some` (`entryLexicons.js:33-55`), and the shortest route to
   a licensed second segment runs through one. The card's `may NOT` bars a count; §21.3 settles a
   choice between a sharper wording and a licensed one in favour of the licensed one. The slot
   carries the licence instead, on all twelve rows.
5. **A short line under eight words — refused, on measurement.** The register wants the short
   line (R-DA-06: `< 8` at 0.017 → ≥ 0.030), and two drafts of face 1b and 3b sat at seven words.
   On a one-sentence face `wordsPerSentence.shareUnder8` is 1.000, which lands band-widths above
   the exemplar band and would have put `depthOk` false on a face that is otherwise clean —
   a new failing state, which §21.2 forbids a refinement to add. The shortest row is nine words.
6. **The semicolon, the -ly adverb and the pronoun closer — refused, as in round 2**, on the
   round-1 measurements (7.736, 1.826 and 10.249 band-widths). They are not re-attempted; the
   density they were carrying is written into word order instead.
7. **An inverted or self-naming copula — refused.** `A bought watch is what {settlement} keeps`
   reads well and is arm X's shape (`entryWalker.js:851-870`, exhaustivity over an open column /
   self-naming, both WITHHELD). Row 3c keeps the pseudo-cleft on the neutral side —
   `What {settlement} has for a watch is bought` — which round 2 shipped and which the arm did
   not fire on.
8. **`answers to`, `in the pay of`, `beholden to` — refused.** Each is a `RELATION_LEMMAS` member
   (`entryLexicons.js:233-241`) and arm C6 fails a relation no join field holds; the card's
   relation is `addition`. Rows 2, 2c and 3b use `answers a purchaser` / `runs to a buyer` /
   `answers a buyer`, which name the same licensed fact without the join lemma.

## 3. WHAT THIS ROUND DOES NOT CLAIM

The four movements in §0 are voice measures — tense, thread, sibling distance, length spread —
and the gate does not score them. **On the gate's own two failing measures this round is flat by
construction, and the flatness is proved rather than pleaded.** If the chair reads a round that
cannot move a spine-owned measure as dry, the honest disposition is the refusal row of §2.1 with
its arithmetic, not a further round against the same wall.
