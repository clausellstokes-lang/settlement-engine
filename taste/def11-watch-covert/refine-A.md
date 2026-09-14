1. `[plain · dm-only]` The watch {settlement} keeps is bought out of the town's sight.
   - `[face]` A buyer holds the watch of {settlement}, and holds it well clear of what the town is told.
   - `[face]` Bought without public notice, {settlement}'s watch answers a buyer.
   - `[face]` Away from the town's talk, {settlement} keeps a watch that is bought.
2. `[plain · dm-only]` Under a covert arrangement the watch of {settlement} has a buyer.
   - `[face]` A bargain the town never hears keeps {settlement}'s watch bought.
   - `[face]` The purchase behind {settlement}'s watch stays out of the town's public word.
   - `[face]` Outside common knowledge {settlement} carries a bought watch.
3. `[plain · dm-only]` In {settlement} the watch is bought, and nothing of the buying reaches the town.
   - `[face]` A buyer has {settlement}'s watch, and the purchase goes unannounced.
   - `[face]` The watch of {settlement} is kept bought, and kept from the town's knowing.
   - `[face]` Beyond the town's hearing the purchase stands, and who holds {settlement}'s watch is not a public matter.

--- NOTES

## 0. THE FAILING MEASURE, ITS MECHANISM, AND ITS REMOVAL

The gate named ONE failing measure: `band depth · closers.abstractNounRate (over)` at
**8.6 band-widths on 1 of 12 faces**, the face being variant 2's `[plain · dm-only]` line
`Under a covert arrangement a buyer has the watch of {settlement}.` The pool's own walk was
already clean (`owned` = FAIL 0 · WITHHELD 0 · PASS 96, `findings` empty); the 48 WITHHELD
rows are the four spine tails the draft's §0 banked, and this arm writes no spine byte.

**The mechanism, read in the shipped instrument, not inferred.** `proseFingerprint.js:114`
takes each sentence's last word and strips it to letters — `{settlement}.` becomes
`settlement` — and `:147` scores it against
`/(ness|tion|sion|ity|ment|ance|ence|ship|hood|dom)$/`. The block's only `proper` slot ends
in **-ment**, so any face that CLOSES on `{settlement}` reads 1.000 against the exemplar band
`lo 0.0122 · hi 0.1151`, i.e. `(1 − 0.1151) / 0.1029 = 8.60` band-widths. The draft's other
eleven faces close elsewhere and score 0. I reproduced the gate's figure to the digit on the
shipped `fingerprint()` over the ten exemplar fingerprints in `prose-research/primary`
(`DRAFT FACE 4 OVER: closers.abstractNounRate=1 depth 8.60`), then re-ran the same instrument
over this packet: **no face of the twelve exceeds 1.75 band-widths on any of the 21 metrics.**
The refinement is therefore not "closer to the law" but AT it, on the one measure that failed.

**The fix is a word order, not a claim.** Variant 2's plain row keeps every word of its
licence and re-seats the slot so the line lands on the buyer: `Under a covert arrangement the
watch of {settlement} has a buyer.` Nothing is added, nothing is dropped, and the closer is
now a person the card names.

**The ceiling this pushed against, face by face.** Because each face is measured ALONE, a
one-sentence face turns every rate into 0 or 1, and the band arithmetic makes six of the
twenty-one metrics fatal at 1.000 under the 1.75 depth: `shareUnder8` (depth 2.19 — so eight
words is the floor and seven is unlawful), `shareOver30` (2.29), `adverbsPerSentence` (1.83 —
so a single `-ly` word fails a face), `parenthesisRate`, `triadRate`, `dialogueShare`. Every
face here sits inside all six by construction, and the whole set was re-measured, never
asserted.

## 1. WHAT MOVED, MEASURED — before → after

| measure | draft round 4 | this packet | instrument |
|---|---|---|---|
| faces over the 1.75 depth ceiling | **1 of 12** (8.60 band-widths) | **0 of 12** | shipped `fingerprint()` × the ten exemplar bands |
| faces closing on an abstract-suffix noun | 1 | 0 | `closers.abstractNounRate` |
| longest word-sequence shared with the twin pool `watch: bought (revealed)` | 4 (`the watch in {settlement}`) | 4 (`the watch of {settlement}`) | held, and it is the estate's term plus its slot |
| longest word-sequence shared between any two faces of this pool | 4 | 4 (`out of the town's`) | within-pool sibling distance |
| agent terms in play | `buyer` and `purchaser` | `buyer` alone | R-DA-22, one term for one thing |
| act nouns in play | `purchase`, `sale`, `buying` | `purchase`, `buying` | R-DA-22; `sale` withdrawn |
| faces carrying the spine's own thread noun `the town` | 5 | **8** | §1.4.1 THE THREAD |
| length range | 8–17 | 8–18 | R-DA-05 |
| within-pool length sd | 3.013 | **2.900** | R-DA-05 — DOWN 0.113, declared at refusal 4 |
| tail-qualified faces (a qualification hung after a comma) | 1 | 0 | R-DA-03 |

**The thread.** Every attachable spine carries `{settlement}`; five carry `the town` or
`the town's`; `WALLED-QUIET` and `WALLED-STRAINED` carry `keeps` / `keeping`. Eight of the
twelve faces now pick up `the town` and three pick up `keeps`, so the face reads as the
passage's next sentence from any salience slot, and `the watch` — the noun no spine holds —
is the one turn outward. Where a face's subject is the buyer or the purchase (faces 2, 4, 7,
9), the slot still carries the thread and the new subject IS the turn outward, which is what
the wall licenses.

## 2. THE LICENCE, HELD EXACTLY — nothing added

Re-read from the card this round (`prose-licence-card.mjs DS-DEF-11 'watch: bought (covert)'`).
Two claims and one slot, on all twelve rows: **(α)** the watch is bought — `reads:
compromised.covert`, `may claim: that covert holds, as a STANDING fact`, MOVE `INSTITUTION`
(who holds the institution's obedience); **(β)** the buying is not public — the same leaf,
which is why every variant keeps its `dm-only` mark; **(γ)** `{settlement}`, the bag's only
FILLED slot, and also what licenses each face's own sentence past arm Q.

`RELATION: addition` is honoured — no `because`, `therefore`, `so`, `while`, `despite`, and
no face joins its fact to the spine's. No face names a count, a cause, a season, a future, a
standpoint, a second civic object of class `force`, or any of the three fields the spines test
(`forces.walls.present` · `settlement.config.monsterThreat` ·
`settlement.defenseProfile.economicGates.military`) — so no wall, work, muster, threat,
country, wage or purse appears, even where such a noun would have made the thread easier.
`provenance.citations` and `provenance.a13` stay at **0**: the card reads
`source: (none) · standing SOURCE-UNRESOLVED`, so no face names a holder, and no face names a
record at all — which is why the covertness is written on the town's sight, talk, word,
hearing and knowing, and never on a roll, a book or a register.

Every face was scanned against the shipped lexicons and returned empty:
`QUANTIFIERS` (so no `no`, `any`, `every`, `only`), `CARDINAL_WORDS`, `DUTY_PREDICATES`,
`DUTY_STEM_NOUNS`, `OFFICE_NOUN_CANDIDATES`, `RELATION_LEMMAS` (so `answers a buyer`, never
`answers to`), all four `PROVENANCE_LEXICONS` classes, both `SUPPLY_CLAIM_LEXICONS` classes,
`CONTRAST_SHAPES`, `SPECIFICATIONAL_COPULA`, `RECORD_CITATION`, `FUTURE_INDICATIVE`,
`BARE_RELATIVE`, and armC3's past-tense markers. No semicolon, colon, em dash, question,
exclamation, parenthesis, quotation mark, `, which`, digit or `-ly` word anywhere; no face
opens on the `proper` slot (T-F8); no face is under eight words; the slot set is
`{settlement}` on all twelve (arm A6).

## 3. THE TWELVE, ONE LINE EACH — what changed and why

**Variant 1** — the purchase in the main clause, the covertness as its manner.

1. **plain** — `out of public sight` → `out of the town's sight`: the covertness is now written
   on the thread noun the spines carry, so the plainest row is also the most threaded, at no
   cost in claim or compression.
2. **face 1** — `Another interest holds …` → `A buyer holds …`: the draft's vaguest word, an
   abstraction standing in for the agent the card actually names, is replaced by the card's own
   agent; and `well clear of the town's common dealing` → `well clear of what the town is told`
   both sharpens β to the town's knowledge and drops the phrase this pool was sharing with the
   twin's `common dealing`.
3. **face 2** — kept the fronted past participle, which is the pool's one such rhythm, and
   moved `the watch of {settlement}` to `{settlement}'s watch` so the four faces of variant 1
   run four different forms of the one term rather than three.
4. **face 3** — `{settlement}'s watch is bought` → `{settlement} keeps a watch that is bought`:
   the town becomes the keeper, which is the spine's own verb (`keeps a {defwork}`,
   `keeps this one`), and it also breaks the five-word overlap with the twin's plain row that
   the earlier `the watch in {settlement} is` had opened.

**Variant 2** — the covertness as the frame, the purchase seated under it.

5. **plain** — `a buyer has the watch of {settlement}.` → `the watch of {settlement} has a
   buyer.`: **this is the failing face.** The slot leaves the closing position, the sentence
   lands on the person the INSTITUTION move is about, and the 8.60 band-widths go to 0 with
   the claim, the frame and the word count untouched.
6. **face 1** — `A covert bargain keeps …` → `A bargain the town never hears keeps …`: the
   system's label for the state is replaced by the in-world fact the label stands for, which is
   the sharper of the two and costs one word.
7. **face 2** — `The purchase that stands behind …` → `The purchase behind …`: three words of
   scaffolding cut with no loss of fact, which is editing inside the band and not trimming
   (§22's own carve-out).
8. **face 3** — `Beyond common knowledge` → `Outside common knowledge`: `beyond` reads first as
   *surpassing* and only then as *outside*, and the fact is the second one; the eight-word
   floor is held exactly, so this stays the pool's short line at no metric cost.

**Variant 3** — the fact and its silence as coordinates.

9. **plain** — `and the town hears nothing of the buying` → `and nothing of the buying reaches
   the town`: the same two words of claim, inverted so the line lands on the town rather than
   on the act, which puts the thread noun in the closing position of the pool's canonical row.
10. **face 1** — `To a purchaser the watch of {settlement} is sold, unannounced.` → `A buyer has
    {settlement}'s watch, and the purchase goes unannounced.`: the draft hung `unannounced` as a
    tail qualification, which R-DA-03 refuses outright; it is now a coordinate limb, and
    `purchaser` goes with it under R-DA-22's one-term rule.
11. **face 2** — `The sale of {settlement}'s watch stands, and stands unspoken.` → `The watch of
    {settlement} is kept bought, and kept from the town's knowing.`: the doubled verb that made
    the draft's line land is kept, but on `kept`, which is the spines' own verb, and `sale` —
    the third word this pool held for one act — goes.
12. **face 3** — `Who holds {settlement}'s watch is not a public matter, and the purchase runs
    outside the town's hearing.` → `Beyond the town's hearing the purchase stands, and who holds
    {settlement}'s watch is not a public matter.`: the two limbs are swapped so the face opens on
    a frame instead of a relative subject — variant 3's four faces now run inversion, coordinate,
    doubled verb and fronted frame — and the close moves off `hearing` onto `matter`, giving the
    pool a second close KIND (R-DA-04's `abstraction` beside face 8's `civicNoun`) where the
    draft's twelve offered one.

## 4. REFUSALS — banked with their measurement, never trimmed

1. **The 48 inherited WITHHELD rows — refused as unreachable, and the draft's closure stands.**
   `owned.findings` is empty; all 48 are the four post-semicolon spine tails at
   `entryWalker.js:836-839`, which this arm cannot write. The one wording that would move the
   count — a face opening on `{settlement}`, exploiting the disagreement between `armQualify`'s
   raw split and `sentencesOf`'s slot-normalised one — is refused twice over by ARCH §2.5's T-F8
   and by the false-green class. Re-confirmed this round from `measure-draft-base.json`, not
   carried on trust. The walker defect the draft named (`armQualify` reads unnormalised text)
   still stands as a sitting row.
2. **A provenance face — refused, again.** The thread would be best served by naming who holds
   the record of the purchase, and the card refuses it by name (`NO citation is licensed … arm
   A13`). This is the sharpest available move and it is unlicensed, so §21.3 settles it against
   the sharper wording. It also strikes every record noun from the pool, which is why β is
   written on the town's senses throughout.
3. **A face under eight words — refused, on measurement.** A seven-word face reads
   `shareUnder8 = 1.000`, which is 2.19 band-widths outside and a NEW failing state, which
   §21.2 forbids a refinement to add. The set's floor is eight words (face 8), which scores
   identically to nine and buys the short line free.
4. **The within-pool length sd — DOWN 0.113, declared rather than padded.** 3.013 → 2.900. Both
   rounds sit far below R-DA-05's 4.0 floor and neither is lawful on it; the draft bought its
   0.113 with a seventeen-word face whose length came from a tail qualification (R-DA-03) and a
   third act noun (R-DA-22), and both were the right things to remove. Closing the gap needs a
   face near twenty words carrying no more fact than one of eleven, and §21.4 forbids buying a
   statistic with words the line does not need. The range widened (8–17 → 8–18) and the
   measure is reported, not defended.
5. **The antithesis — refused.** `In name the town's, in fact a buyer's` is the sharpest shape
   the material offers for variant 3 and R-DA-02 bars it: no sibling key or band names the
   rejected alternative as a claim this pool may make, and the shape reads 30.09 band-widths
   outside on `shapes.antithesisRate` at 1.000. Variant 3 states the fact and its silence as
   coordinates instead.
6. **`Nobody in {settlement} is told who has bought the watch` — refused.** It is the most
   direct wording of β found this round and it is a totality over persons, which the card
   refuses as a COLUMN, always.
7. **A record-gap face (`the buyer goes unnamed`) — refused**, as in the draft: that is the
   ABSENCE move's GAP class, which needs a `not-held` record field (MOVE-GRAMMAR §1.2 row 11).
   Face 12 says who holds the watch is not a public matter — the covert leaf, not a gap.
8. **The semicolon, the `-ly` adverb and the pronoun closer — refused**, on the earlier rounds'
   measurements (7.74, 1.83 and 10.25 band-widths on a one-sentence face). Not re-attempted;
   the density they carried is written into word order.
