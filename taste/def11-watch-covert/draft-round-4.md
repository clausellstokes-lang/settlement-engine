1. `[plain · dm-only]` The watch {settlement} keeps is bought out of public sight.
   - `[face]` Another interest holds the watch in {settlement}, and holds it well clear of the town's common dealing.
   - `[face]` Bought without public notice, the watch of {settlement} answers a buyer.
   - `[face]` Away from the town's talk, {settlement}'s watch is bought.
2. `[plain · dm-only]` Under a covert arrangement a buyer has the watch of {settlement}.
   - `[face]` A covert bargain keeps the watch of {settlement} bought.
   - `[face]` The purchase that stands behind {settlement}'s watch stays out of the town's public word.
   - `[face]` Beyond common knowledge {settlement} carries a bought watch.
3. `[plain · dm-only]` In {settlement} the watch is bought, and the town hears nothing of the buying.
   - `[face]` To a purchaser the watch of {settlement} is sold, unannounced.
   - `[face]` The sale of {settlement}'s watch stands, and stands unspoken.
   - `[face]` Who holds {settlement}'s watch is not a public matter, and the purchase runs outside the town's hearing.

--- NOTES

## 0. THE GATE'S MEASURE, ANSWERED — THE REFUSAL IS RE-CONFIRMED AND NOW CLOSED

The gate returned one failing measure in two forms — `composed walk · unit verdicts`
(FAIL 0 · WITHHELD 48 · PASS 48 of 96) and `composed walk · Q · a trailing coordinate naming
no second field` (40 listed of 48) — and its own finding line already names the offending
clause a SPINE clause on `WALLED-QUIET`.

**Re-measured this round, not carried from round 3.** Read directly from
`taste/measure-draft.json` (`round: 3`, `at: 2026-09-09T04:37:57`), this pool's
`walk.verdicts` is `{"FAIL":0,"WITHHELD":48,"PASS":48}` and `walk.findingCount` is 48. Every
one of the 40 listed findings carries `klass: "Q"`, `channel: "WITHHELD"`, and a `clause`
that is the second half of a SPINE's own semicolon:

| the clause the arm quotes | its spine, at `RECEIPT_POOLS_DOSSIER_STATE.md` | listed |
|---|---|---|
| `built work stands on its own patience.` | `WALLED-QUIET` variant 3, line 6033 | 12 |
| `stone keeps itself, and wages do not.` | `WALLED-STRAINED` variant 1, line 6036 | 12 |
| `the threat is on the town's books as plainly as the grain.` | `WALLED-THREATENED` variant 1, line 6026 | 12 |
| `the town knows what it is for and checks it.` | `WALLED-THREATENED` variant 2, line 6027 | 4 of 12 (the print stops at the 40 cap) |

The arithmetic closes with no remainder. Twelve rows against eight attached spine variants
(`WALLED-QUIET` 3 · `WALLED-STRAINED` 2 · `WALLED-THREATENED` 3) is 96 units, which is the
`units` figure the harness prints. Exactly four of those eight spine variants carry a
post-semicolon clause; 4 × 12 = 48 — the withheld count, the finding count, and the sum of
the table once the capped row is restored. Scanning all 40 listed clauses for any word this
packet has ever written — bought, buyer, buying, purchase, purchaser, bargain, sale, sold,
covert — returns the empty set.

**The mechanism, read in the shipped code.** `src/domain/prose/entryWalker.js:810` splits the
composed text into sentences and `:836-839` then splits **every** sentence on `/\s*;\s*/` and
calls `consider` on each part after the first — the spine's sentence included. `consider`
(`:818-822`) returns licensed only where the segment carries a `{slot}` or a `bandReadings()`
phrase. The four clauses above carry neither, their bytes are the spine's, and this packet
writes no spine byte. The finding is spine-owned and the count is a function of this pool's
SIZE, not its quality: at five faces per variant it would read 60 with no wording fault
anywhere in it.

**What round 4 adds, and why the refusal is now closed rather than merely repeated.** There
is exactly ONE wording that would make the 48 disappear, and this round found it, tested it
against the grammar, and refuses it:

- `armQualify` at `:810` splits `String(entry.text)` **raw**, on
  `/(?<=[.?!])\s+(?=[A-Z"'(])/`. The estate's own `sentencesOf` at `:160` first replaces
  every `{slot}` with `X` and only then splits — so the two functions disagree about where a
  sentence begins. A face whose first character is `{` therefore fails the lookahead in
  `armQualify` alone: the spine and the modifier fuse into one "sentence", the semicolon
  split then yields `built work stands on its own patience. {settlement} …`, that segment
  carries a slot, and all 48 findings vanish.
- **REFUSED, twice over.** ARCH §2.5's face table refuses "a sentence face opening on a
  `proper`-typed slot of the block's bag (T-F8)", and `{settlement}` is the bag's only
  `proper` slot; and the move would cure nothing — it would blind a live arm to a defect that
  is really there, which is the false-green class the estate has already been bitten by.

So the packet's search space is now exhausted and named, not merely reported unexplored.
**This is a REFUSAL with its measurement and its closure** (§21.2's "banked, never trimmed";
§21 phase 1's "an unsatisfiable set is a sitting row"), and it carries two rows for the
chair:

1. **A walker defect, found this round:** `armQualify` reads unnormalised text while
   `sentencesOf` normalises slots. A modifier face beginning on a slot is invisible to arm Q's
   sentence split today. Whichever way the chair rules the finding, the two splitters should
   agree.
2. **The cure for the 48 is a spine act, outside these fences:** either the four spine tails
   name a second typed field or lose their semicolons, or arm Q gains a provenance for
   segments a modifier INHERITED from its spine. Both are the chair's.

## 1. THE MEASURES THIS ROUND DID MOVE — six, each with its before and after

Round 3 was flat on the gate's own count and said so. This round is not a second flat round:
it moves six measured properties of the packet, five of which a refuter or the harness reads
directly, and it adds no new failing state.

| # | measure | round 3 | round 4 | the law |
|---|---|---|---|---|
| 1 | within-pool length sd, in words | 1.951 | **3.013** | R-DA-05 (within-pool sd 2.9 → ≥ 4.0) |
| 2 | length range | 9–16 | **8–17** | R-DA-05; the register card's "the short line exists" |
| 3 | longest word-sequence shared with the twin pool `watch: bought (revealed)` | 7 words | **5 words** | A11 · C-sibling · the refuters' "paraphrases its sibling" |
| 4 | rows carrying the phrase `the watch {settlement} keeps` | 4 | **1** | R-DA-10's rationed-word ceiling (≤ 0.200) |
| 5 | participial openers in twelve | 3 | **1** | R-DA-18's participial floor (0.0117 → ≤ 0.020) |
| 6 | rows carrying the spine's own thread noun `the town` | 1 | **5** | §1.4.1 THE THREAD |

**(1) and (2), the arithmetic.** Round 3's twelve read 10 · 14 · 10 · 13 · 11 · 9 · 13 · 12 ·
11 · 16 · 10 · 13 (sum 142, mean 11.833, sd 1.951). Round 4's read 10 · 17 · 11 · 9 · 11 · 9 ·
14 · 8 · 14 · 10 · 9 · 17 (sum 139, mean 11.583, sd 3.013) — a 54 % rise toward R-DA-05's
floor, with every variant now carrying a long, two middles and a short. The floor of 4.0 is
NOT reached, and the reason is declared rather than padded around: closing the last band-width
needs a face near twenty words or one under eight, and the second is measurably unlawful (see
refusal 5) while the first would buy sd with words the fact does not need — the density law
(§21.4) forbids trading the line's compression for a statistic. **8 is the safe floor**:
`wordsPerSentence.shareUnder8` counts sentences strictly under eight words, so the eight-word
face 2c is the pool's short line at no cost, where round 3's refused seven-word draft would
have put `shareUnder8` at 1.000.

**(3), the twin-pool distance — the round's largest quality move.** `watch: bought (revealed)`
sits three rows above this pool in the same block and reads the sibling leaf of the same
field. Round 3 shared three CONSTRUCTIONS with it: `What {settlement} has for a watch is …`
(seven words, against the twin's `What {settlement} has for a watch is sold in the town's
plain sight.`), `Obedience in … {settlement}'s watch …` (against the twin's `Obedience in
{settlement}'s watch is bought in sight of the town.`), and `The … of the watch {settlement}
keeps …` (against the twin's plain row). All three are gone: the longest word-sequence this
pool now shares with the twin is **five words**, `the watch {settlement} keeps is`, and it
survives on purpose — it is the plain row's plainest available wording and it is the estate's
term for the thing plus a copula, not a borrowed construction. The nouns are deliberately NOT
thesaurused away with them: R-DA-22 wants ONE TERM FOR ONE THING, so watch, bought, buyer and
purchase stay the estate's terms for these facts, and only the SENTENCE SHAPES are made
disjoint. A pool that renamed the watch to look varied would be the reverse thesaurus, fault
17.

**(4) and (5), the pool signature.** Round 3 leaned on one phrase — `the watch {settlement}
keeps` — for four of twelve rows, and that phrase is also the twin pool's. It now appears
once, in the plain of variant 1, where the plainest available wording belongs; the other
eleven rows carry `the watch in {settlement}` · `the watch of {settlement}` (×4) ·
`{settlement}'s watch` (×4) · `In {settlement} the watch` · `{settlement} carries a … watch`.
Round 3 opened three of its twelve rows on a participle (`Suborned without public notice,`,
`Unexposed,` and `Bought, and covert,`); two are
gone. `Bought without public notice,` is the pool's one participial opener, and the doubled
adjective of `Bought, and covert,` — which round 3 shipped on the reasoning that the
detector's regex does not cross a comma — is withdrawn rather than kept on a detector's
blindness.

**(6), the thread, anchored on the spine's own noun.** The eight attachable spines carry
`{settlement}` everywhere, `keeps` / `keeping` in five of them, and `the town` in two
(`The town pays little for its {defwork}` and `the town knows what it is for`). Round 3
carried `the town` in one row of twelve. Round 4 carries it in five (1a, 1c, 2b, 3, 3c) and
`keeps` in two (1, 2a), so the modifier reads as the passage's next sentence from whichever
salience slot it lands in, and `the watch` — the noun the spine does not hold — is the
passage's one turn outward. §1.4.1's own clause covers the repetition: "A11's echo bound
counts facts, not nouns: a deliberate noun echo for the thread is lawful."

**Zero new failing states**, held by construction and each checked against the shipped
detector rather than asserted: `{settlement}` on all twelve rows (which is what licenses each
face's own sentence past arm Q at `entryWalker.js:819`); no row opening on the `proper` slot
(T-F8); no semicolon and no colon; no word ending in -ly; no pronoun closer and no `-ness`
closer (round 4's draft of 2b closed on `business` and was changed to `word` for that reason);
no digit, em dash, exclamation, question, parenthesis or quotation mark; no `, which`; no
member of `CONTRAST_SHAPES` (`entryLexicons.js:304` — note that 3c's `is not a public matter,`
is safe because that regex's `, not` alternative needs the comma immediately BEFORE `not`, and
its `(and|or) not` alternative needs the two words adjacent); no member of
`SPECIFICATIONAL_COPULA` (`:332` — no `is what`, and no row of the shape `The x … is the y`,
which is why 2b reads `stays out of` and not `is the …`); no `RELATION_LEMMAS` member (`:232`
— `answers a buyer` carries the licensed fact without `answers to`); no `PROVENANCE_LEXICONS`
capacity, spatial, actor or dated phrase (`:246`); no `SUPPLY_CLAIM_LEXICONS` processing or
route word (`:187`); no `OFFICE_NOUN_CANDIDATES` noun (`:210` — `watch` is not on it, and
`watch captain` is avoided); no `DUTY_PREDICATES` or `DUTY_STEM_NOUNS` (`:110`, `:129`); no
`QUANTIFIERS` member (`:93` — `nothing` is not on that list, and `no`, `any`, `every`, `only`
are absent from all twelve); no `CARDINAL_WORDS`; no `RECORD_CITATION` shape (`:335`); no
`FUTURE_INDICATIVE` (`:338`); and no `\b(had|were|was|used to|once|formerly|no longer)\b`, so
armC3's semantic half stays silent and every row states the fact in the present.

## 2. THE LICENCE, FACE BY FACE

The card is one reading with two halves, and every row asserts those two and nothing else:

- **(α) the watch is bought** — `reads: compromised.covert` (measured); `may claim: that
  covert holds, as a STANDING fact of the record`; **MOVE:** `INSTITUTION`, the card's own
  seat (who holds the institution's obedience).
- **(β) the buying is not public** — the `.covert` leaf of that same reading; `covert: YES` is
  why it is stated at all and why every variant carries `dm-only`.
- **(γ) the town named** — `bag: {settlement: proper}`, FILLED at this block's call sites. It
  is the packet's only slot, and it is also what licenses each face's own sentence past arm Q.

`RELATION: addition` is honoured throughout: no row asserts a join to the spine's fact — no
because, no therefore, no so, no while, no despite.

| # | face | words | α licensed by | β licensed by | γ |
|---|---|---|---|---|---|
| 1 | `[plain]` The watch {settlement} keeps is bought out of public sight. | 10 | `is bought` | `out of public sight` | `{settlement}` |
| 1a | Another interest holds the watch in {settlement}, and holds it well clear of the town's common dealing. | 17 | `another interest holds` — a purchaser holds the watch, the same reading | `well clear of the town's common dealing` | `{settlement}` |
| 1b | Bought without public notice, the watch of {settlement} answers a buyer. | 11 | `answers a buyer` | `without public notice` | `{settlement}` |
| 1c | Away from the town's talk, {settlement}'s watch is bought. | 9 | `is bought` | `away from the town's talk` | `{settlement}'s` |
| 2 | `[plain]` Under a covert arrangement a buyer has the watch of {settlement}. | 11 | `a buyer has the watch` | `under a covert arrangement` | `{settlement}` |
| 2a | A covert bargain keeps the watch of {settlement} bought. | 9 | `keeps … bought` | `covert` | `{settlement}` |
| 2b | The purchase that stands behind {settlement}'s watch stays out of the town's public word. | 14 | `the purchase that stands behind … watch` | `stays out of the town's public word` | `{settlement}'s` |
| 2c | Beyond common knowledge {settlement} carries a bought watch. | 8 | `a bought watch` | `beyond common knowledge` | `{settlement}` |
| 3 | `[plain]` In {settlement} the watch is bought, and the town hears nothing of the buying. | 14 | `is bought` | `the town hears nothing of the buying` | `{settlement}` |
| 3a | To a purchaser the watch of {settlement} is sold, unannounced. | 10 | `is sold` to a purchaser | `unannounced` | `{settlement}` |
| 3b | The sale of {settlement}'s watch stands, and stands unspoken. | 9 | `the sale … stands` | `unspoken` | `{settlement}'s` |
| 3c | Who holds {settlement}'s watch is not a public matter, and the purchase runs outside the town's hearing. | 17 | `who holds {settlement}'s watch` | `is not a public matter` · `outside the town's hearing` | `{settlement}'s` |

**The three variants, and what separates them.** The card licenses ONE claim, so the three
semantic variants are three SHAPES of that claim and are declared as such rather than smuggled
as three facts. V1 puts the purchase in the main clause and the covertness in its condition;
V2 makes the covertness the frame and seats the purchase under it; V3 states the fact and its
silence as coordinates. No variant adds a fact to another; the slot set is `{settlement}` on
all four rows of all three (arm A6).

Nothing else is claimed. No row carries a count, a cause, a season, a future, a standpoint, a
second fact, a second civic object of the class `force`, or any of the three fields the
attached spines test (`forces.walls.present` · `settlement.config.monsterThreat` ·
`settlement.defenseProfile.economicGates.military`) — which is why no face names the wall, the
work, the muster, the threat, the country, a wage, an upkeep or a purse, even where such a
noun would have made the thread to the spine easier to see.

## 3. REFUSALS — each with the clause that refuses it

1. **The gate's one failing measure, refused as unreachable from inside this packet, and now
   with its search space closed.** 48 of 48 Q findings are the four spine tails of §0;
   `entryWalker.js:836-839` reads the spine's own post-semicolon segments; the packet writes
   no spine byte; and the single wording that WOULD move the count — a face opening on
   `{settlement}`, exploiting the disagreement between `armQualify`'s raw split at `:810` and
   `sentencesOf`'s slot-normalised split at `:160` — is refused by ARCH §2.5 T-F8 and would
   blind a live arm rather than cure it. Banked as a refusal row with its measurement, and
   named as a sitting row with the walker defect beside it.
2. **A provenance face — refused.** The thread would be well served by naming who holds the
   record of the purchase. The card reads `source: (none) · standing SOURCE-UNRESOLVED · NO
   citation is licensed: a face naming a record holder here is refused by arm A13`. No face
   names a holder; `provenance.citations` and `provenance.a13` stay at 0. This also strikes
   `the town's books`, the one thread noun `WALLED-THREATENED` variant 1 offers.
3. **A `{defwork}` thread — refused.** The card's bag lists `defwork: bare-common` but records
   it UNFILLED at this block's call sites, and arm D fails a slot the composer never fills
   (`entryWalker.js:786-795`). `{settlement}` is the packet's only slot on every row.
4. **A band word as arm Q's licence — refused.** `bandReadings()` would license a segment
   carrying `several`, `a handful` or `some` (`entryLexicons.js:33-58`), which is the shortest
   route to a licensed segment. The card's `may NOT` bars a count, and §21.3 settles a choice
   between a sharper wording and a licensed one in favour of the licensed one. The slot carries
   the licence instead, on all twelve rows.
5. **A short line under eight words — refused, on measurement.** The register card wants the
   short line and R-DA-06 wants `< 8` to rise, but on a one-sentence face
   `wordsPerSentence.shareUnder8` would read 1.000, several band-widths outside the exemplar
   band, and could put `depthOk` false on a face that is otherwise clean — a NEW failing state,
   which §21.2 forbids a refinement to add. The pool's short line is eight words (2c), which
   scores identically to nine on that metric and buys the rhythm at no cost.
6. **The semicolon, the -ly adverb and the pronoun closer — refused**, on rounds 1 and 2's own
   measurements (7.736, 1.826 and 10.249 band-widths). Not re-attempted; the density they were
   carrying is written into word order.
7. **The antithesis — refused.** "In name the town's, in fact a buyer's" is the sharpest
   available shape for V3 and is barred: R-DA-02 licenses a contrast only where a sibling pool
   key or band names the rejected alternative, and no sibling names "not bought". V3 states the
   fact and its silence instead.
8. **The inverted and self-naming copula — refused.** `A bought watch is what {settlement}
   keeps` and `The covert side of {settlement}'s watch is the side a buyer keeps` both fire
   `SPECIFICATIONAL_COPULA` (`entryLexicons.js:332`) and land in arm X's WITHHELD channel
   (`entryWalker.js:851-870`). Neither is written; 2b was rebuilt around `stays out of` for
   this reason.
9. **`answers to`, `in the pay of`, `beholden to` — refused.** Each is a `RELATION_LEMMAS`
   member (`entryLexicons.js:232-238`) and arm C6 fails a relation no join field holds; the
   card's relation is `addition`. Rows 1b and 2 name the same licensed fact with `answers a
   buyer` and `a buyer has`.
10. **A claim that the buyer is unnamed in the record — refused.** `The buyer of {settlement}'s
    watch goes unnamed in public` reads well and was drafted. The card licenses that the
    arrangement is covert, not that a record exists in which a name is missing; that is the
    ABSENCE move's GAP class, which needs a `not-held` record field (MOVE-GRAMMAR §1.2 row 11)
    and would also open on an absence, which wall 3 forbids. 3c states who holds the watch as
    "not a public matter" instead — the covert leaf, not a record gap.
11. **`does a buyer's bidding` — refused.** It is the sharpest wording found for 1b and the
    density law would welcome it, but it asserts that somebody gives orders, which is
    `PROVENANCE_LEXICONS.actor`'s class on a state-only field (`entryLexicons.js:258-262`;
    armC3 at `:541-546`). `answers a buyer` carries the same licensed fact with no actor.
12. **The within-pool length sd floor of 4.0 — NOT REACHED, declared rather than padded.** The
    set reaches 3.013 from 1.951. The remaining band-width needs either a sub-eight face
    (refusal 5) or a face near twenty words carrying no more fact than one of eleven, and
    §21.4 forbids buying a statistic with words the line does not need.

## 4. WHAT THIS ROUND CLAIMS, AND WHAT IT DOES NOT

It does NOT claim to have moved the gate's two printed measures. They are one spine-owned
count of 48, re-measured from the harness's own JSON this round, invariant in this packet's
size, and now shown to have exactly one wording cure that the annex grammar itself refuses.

It DOES claim six measured movements of the packet's own properties (§1), each with a before
and an after a reader can recompute from the two draft files and the `lengths` block of
`measure-draft.json`, and zero new failing states. If the chair reads a round that cannot move
a spine-owned measure as dry regardless, the honest disposition is refusal row 3.1 with its
arithmetic and its closure — a sitting row, not a fifth round against the same wall.
