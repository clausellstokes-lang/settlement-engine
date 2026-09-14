1. `[plain · dm-only]` The watch {settlement} keeps has been bought out of public view.
   - `[face]` Another interest holds the watch {settlement} keeps, and holds it clear of the town's public dealing.
   - `[face]` Suborned without public notice, the watch {settlement} keeps stands bought.
   - `[face]` A buyer has the watch {settlement} keeps, and the buying stays covert.
2. `[plain · dm-only]` Under a covert arrangement the watch {settlement} keeps answers a purchaser.
   - `[face]` Unexposed, the purchase that holds the watch {settlement} keeps still stands.
   - `[face]` The buying of the watch {settlement} keeps sits outside the town's public word.
   - `[face]` Obedience in the watch {settlement} keeps runs to a covert buyer.
3. `[plain · dm-only]` In {settlement} the watch is bought, and the arrangement runs unremarked.
   - `[face]` To a buyer the watch {settlement} keeps is sold, and the selling stands without public notice.
   - `[face]` Bought, and covert, the watch {settlement} keeps answers a buyer.
   - `[face]` What {settlement} has for a watch is bought, and the buying goes unannounced.

--- NOTES

## 0. THE FAILING MEASURES, ANSWERED ONE BY ONE

The gate returned five failing measures and one absent one. Four are moved by construction and
the measurement that says so is named beside each; the fifth is moved as far as a wording set
can move it; the sixth is refused with its evidence.

**(1) Composed walk — WITHHELD 80 of 96 units, PASS 16; 25 findings "a second sentence naming
no second field" and 15 "a trailing coordinate naming no second field".** I read the arm rather
than guessing at it. `src/domain/prose/entryWalker.js:806-838` (`armQualify`) splits the composed
unit on sentence boundaries and on the SEMICOLON only, and returns early — licensed — on a
segment that either carries a `{slot}` or holds a phrase `bandReadings()` recognises. A modifier
face IS the composed unit's second sentence, so a face carrying neither is withheld every time it
is composed.

- Round 1's twelve faces carried `{settlement}` on four (variant 2) and on eight did not. The
  round-1 measurement in `taste/measure-draft.json` shows exactly that: twenty-five "second
  sentence" findings falling on those eight faces and on nothing else, three per face with one at
  four.
- **Round 2 carries `{settlement}` on all twelve faces**, once each, never as the opening token
  (T-F8). The arm returns at its slot test on every one of them.
- The other lawful exit — a band phrase — is REFUSED for this pool: `BAND_PHRASES` and
  `AUTHORED_MAGNITUDES` (`entryLexicons.js:33-55`) are quantity words, and the card's `may NOT`
  bars a count. A face bought past arm Q with "several" or "a handful" would buy a licence with an
  unlicensed claim, which §21.3 settles against.
- **One withholding in this pool is not mine and I cannot move it.** Twelve of the round-1
  findings read `a trailing coordinate naming no second field · built work stands on its own
  patience.` That is the second half of the shipped spine `WALLED-QUIET` variant 3, after its
  semicolon. It fires once per composed unit regardless of which face follows it. It is a spine
  row, outside this packet's fences, and it is reported here rather than absorbed.
- The semicolon face is gone (see (3)), so the three "trailing coordinate" findings that were
  mine are gone with it.

**(2) `closers.pronounRate` over by 10.249 band-widths on 1 of 12 faces.** The detector is
`proseFingerprint.js:148`, anchored on `^(it|them|him|her|us|me|you|this|that|there|here)$`
after non-letters are stripped. Round 1's variant 3 `[plain]` closed on "of it". **No face in
round 2 closes on a pronoun.** The twelve closing words are: view · dealing · bought · covert ·
purchaser · stands · word · buyer · unremarked · notice · buyer · unannounced.

**(3) `punctuation.semicolonRate` over by 7.736 band-widths on 1 of 12 faces.** Round 1's variant
1 face 2 carried the estate's one rationed semicolon. On a one-sentence face the rate is 1.000,
which is why the depth was eight band-widths and not a fraction of one. **Round 2 carries no
semicolon and no colon.** The "in name / in fact" line the semicolon served is not re-punctuated
and re-shipped: it is withdrawn on a second ground given at refusal 3 below.

**(4) `shapes.adverbsPerSentence` over by 1.826 band-widths on 3 of 12 faces.** The detector is
`\b\w+ly\b` minus `NOT_ADVERBS` (`proseFingerprint.js:69,115-118`); one adverb on a one-sentence
face is 1.000 per sentence. The three were "quietly", "Covertly" and "quietly". **Round 2 carries
no word ending in -ly at all.** "Covertly" is replaced by the adjective "covert", which keeps the
field's own token for arm A0b without the adverb.

**(5) depth ok share 7 of 12, band 12 of 12.** This is the arithmetic consequence of (2), (3) and
(4) and not an independent measure. The round-1 data shows the five clean faces all sitting at the
same deepest value — `wordsPerSentence.neighbourVariation`, 1.597 band-widths UNDER — which is
structural: a one-sentence face has no neighbour, so its burstiness is zero and no wording can
raise it. 1.597 sits inside the ENTRY depth of 1.75 (§16.2), so a face that carries no semicolon,
no -ly word and no pronoun closer reports `depthOk: true`. **Every round-2 face is written to that
floor**, and the shapes that could lift a face above it are excluded by construction: no colon, no
em dash, no parenthesis, no quotation mark, no question or exclamation, no `, which` tail, no
`X, Y, and Z` triad, no "not X but Y" / "rather than" / "less X than" antithesis, no participial
opener, no "There is" / "It is" opener, no abstract-noun closer, and no doubled adjective. That
last one is worth naming because it was a live trap: `adjPairs` is
`\b\w+(ed|ing|ous|ful|less|ive|al|ant|ent|y) and \w+(ed|ing|ous|ful|less|ive|al|ant|ent|y)\b`
(`proseFingerprint.js:119`), so a draft line reading "Suborned and undeclared" would have scored a
doubled adjective on a one-sentence face. Every `and` in this set is preceded by a comma, which the
regex does not cross; the pair is written out of the set rather than measured after it.

I also checked one boundary the round-1 set sat on: `wordsPerSentence.shareUnder8` is 1.000 on a
face of seven words. Round 1's shortest were exactly eight and cleared it. **The shortest face here
is ten words**, so the margin is no longer one word wide.

**(6) The norm bit (`rateBp` / `departure`) — REFUSED, with its measurement.** See refusal 1.

## 1. THE THREE VARIANTS, AND WHAT SEPARATES THEM

The card licenses ONE claim — `may claim: that covert holds, as a STANDING fact of the record` —
so the three semantic variants are three SHAPES of that claim, declared as such rather than
smuggled as three facts:

- **V1** states the purchase and holds the concealment inside the same predicate ("bought out of
  public view", "holds it clear of", "without public notice", "stays covert").
- **V2** puts the concealment in the governing position and seats the purchase under it ("Under a
  covert arrangement", "Unexposed, the purchase", "sits outside the town's public word", "runs to
  a covert buyer").
- **V3** states the divided keeping as the town's own standing condition ("In {settlement} the
  watch is bought", "To a buyer … is sold", "answers a buyer", "What {settlement} has for a watch").

Slot sets are equal inside every variant and across all twelve faces: exactly one `{settlement}`,
never first. `{defwork}` is in the card's bag but NOT in its FILLED set, so a face naming it would
red arm D as a slot the composer never fills; it is not used.

## 2. PER FACE — THE CARD CLAUSE THAT LICENSES EACH CLAIM

Two clauses do most of the work and are stated once instead of twelve times. **The purchase** in
every face is `reads: compromised.covert` under `may claim: that covert holds`; `bought`, `sold`,
`purchase`, `suborned`, `buyer`, `purchaser` and `obedience … runs to` are that one field's value
in six vocabularies, never six facts. **The concealment** in every face is the other half of the
same field value — `covert` is `compromised` AND not exposed — and is always written as a property
of what is PUBLIC, never of what anyone knows (refusal 2). Where a face's second half is a
coordinate, it restates the field's own second half and asserts no second column; that reading is
declared here for the refuter rather than assumed.

**V1 `[plain]`** *The watch {settlement} keeps has been bought out of public view.*
`may claim` (the purchase) · `bag: {settlement}` FILLED (the slot) · the concealment as the
absence of a PUBLIC showing, not of a record. Classifies INSTITUTION: `watch` + `keeps` inside the
detector's forty-character window (`moveGrammar.js:232`), which is the `MOVE:` the annex row declares.

**V1 `[face]` a** *Another interest holds the watch {settlement} keeps, and holds it clear of the town's public dealing.*
"Another interest" is indefinite and carries no name, no office and no count (`may NOT: a count`;
REFUSED COLUMNS: a named character). The doubled `holds` is the office's own formula on the WORD,
which the register card licenses, and the FACT does not recur.

**V1 `[face]` b** *Suborned without public notice, the watch {settlement} keeps stands bought.*
`suborned` is the exact legal verb for a bought officer; the antique air sits in the noun and the
verb, never in the syntax (R-DA-18). The shortest line in V1 — the short line exists.

**V1 `[face]` c** *A buyer has the watch {settlement} keeps, and the buying stays covert.*
Carries `covert` itself, which is the only token `claimTokensOf('compromised.covert')` returns, so
this is one of the four faces on which arm A0b passes without a vocabulary entry.

**V2 `[plain]`** *Under a covert arrangement the watch {settlement} keeps answers a purchaser.*
One clause, no coordinate. `answers` is the INSTITUTION detector's own duty verb and asserts the
captured allegiance, which is what `compromised` holds — not a duty the institution table would
have to license (no `counts`, `levies`, `collects`, `registers`, `musters`: every member of
`DUTY_PREDICATES` is out of this set, because `whoItCounts` is `closed: false` at this tip).

**V2 `[face]` a** *Unexposed, the purchase that holds the watch {settlement} keeps still stands.*
`unexposed` is the engine's own discriminator against the sibling pool's `revealed`. A condition
close, which is a member of R-DA-04's closed set.

**V2 `[face]` b** *The buying of the watch {settlement} keeps sits outside the town's public word.*
"the town's public word" is what the town states publicly — publicity, not knowledge and not a
record. Deliberately NOT "the town's books", "roll", "register" or "ledger": those match the
PROVENANCE detector (`moveGrammar.js:225`) and the card refuses every citation (refusal 1).

**V2 `[face]` c** *Obedience in the watch {settlement} keeps runs to a covert buyer.*
The noun `obedience` is inherited from this pool's public twin, `watch: bought (revealed)`
variant 2, which is D13's rule and not an accident: the covert twin carries the public sibling's
qualifier unchanged and the public sibling never leaks the covert one. Distance from the twin is
kept in the predicate — the twin says the obedience is bought and the town hides none of it; this
says where the obedience runs and that the buyer is covert.

**V3 `[plain]`** *In {settlement} the watch is bought, and the arrangement runs unremarked.*
The town-sited form, and the one face that opens on the slot's own phrase without opening on the
slot. Classifies PRESENT rather than INSTITUTION (no duty verb follows `watch`), which is the
variant's point: V3 is the state-shaped one.

**V3 `[face]` a** *To a buyer the watch {settlement} keeps is sold, and the selling stands without public notice.*
The same transaction from the other side; `sold` and `selling` are one claim in a second
vocabulary. Sixteen words, level with V1 face a as the longest in the set, and the only two that
reach the shipped spines' own length floor.

**V3 `[face]` b** *Bought, and covert, the watch {settlement} keeps answers a buyer.*
The compressed form: the two halves of the field value fronted as the condition, the institution
and its allegiance behind them. §21.4 is the licence — compression that rewards the reader is part
of the ceiling, and a reader's question about a dense but lawful line is not a verdict against it.

**V3 `[face]` c** *What {settlement} has for a watch is bought, and the buying goes unannounced.*
`unannounced` is the twelfth and last of the concealment vocabularies, so no two faces in the set
repeat one. Checked against `SPECIFICATIONAL_COPULA` (`entryLexicons.js:332`): the fronted "What"
is not the `is what` the first limb matches, and the second limb requires a sentence opening on
"the", which this does not.

## 3. WORD COUNTS (whitespace tokens; `{settlement}` counts one, as `wordsOf` splits on `\s+`)

V1: 11 · 16 · 10 · 12    V2: 11 · 11 · 13 · 11    V3: 11 · 16 · 10 · 13
Mean 12.1 · range 10 to 16 · every face inside the 8-to-30 interval where both
`wordsPerSentence.shareUnder8` and `.shareOver30` read zero, and none within one word of either
edge. The shipped spines of this block run 15 to 26 words, so the modifier sits under the sentence
it follows and the composed unit's second sentence is the shorter one.

## 4. THE SPREAD, MEASURED ON THE SET ITSELF

All twelve faces differ in their first two words: *The watch · Another interest · Suborned without ·
A buyer · Under a · Unexposed, the · The buying · Obedience in · In {settlement} · To a · Bought,
and · What {settlement}*. Seven faces are a single clause and five carry a coordinate, so the
rhythm is not uniform. Ten of twelve classify as the declared `MOVE: INSTITUTION` under
`CLAUSE_DETECTORS`, measured by running the detector and the clause splitter over the twelve rather
than asserted (up from seven in round 1); the two that fall to PRESENT are V3's plain row and its
face c, where no duty verb follows `watch` — reported, not asserted as a pass.
Close kinds under R-DA-04: nine conditions and three "a name not given" (the buyer and the
purchaser are never named).

## 5. REFUSALS — a refusal is a result

**1. THE NORM BIT — REFUSED, and it is not a wording defect.** The gate asks for "a measured rate
in bp with its departure". Both numbers are read off data, not off prose. `taste-measure.mjs:471`
and `:539` take `rateBp` from the wiring census's RATE row and `departure` from
`DOSSIER_PROSE_NORMS[block::pool]`. I checked both sources rather than assert it. The RATE corpus
at `taste/m3/rate-merged.json` carries 276 rows; seven are DS-DEF-11's and every one of them is a
SPINE pool (`country: pressed (walled)` 6693 bp · `country: pressed (unwalled)` 6693 · WALLED-STRAINED
5924 · UNWALLED-SMALL 3008 · WALLED-THREATENED 638 · UNWALLED-LARGE 352 · WALLED-QUIET 13). **Not
one row in the whole corpus has a pool key containing "covert", and no modifier pool of this block
has a row at all** — which is exactly what this pool's licence card says to expect: "a modifier has
no key-function branch, so the census records its READING (the `annex` rung)". The norm leaf states
the consequence in its own header: "A POOL WITH NO ROW IS ABSENT, NOT ZERO … A pool the RATE corpus
never fired has no measurable norm, so its bit is OWED rather than assumed"
(`src/data/proseNorms.generated.js:9-11`). So the bit is OWED, and it is owed to a census car that
emits rate rows for modifier pools, not to a writer. **No wording of these twelve faces can move
it, and none was attempted.** What I can give in its place is the pool's measured exposure, since
its three ATTACH spines all carry rows and bits: WALLED-STRAINED 5924 bp (departure 0) ·
WALLED-THREATENED 638 bp (departure 1) · WALLED-QUIET 13 bp (departure 1). The three are mutually
exclusive states of one block, so the pool's attach surface is 505 of 768 towns, 6575 bp, of which
651 bp sits on the two departure-1 spines. Those are the attach set's numbers, honestly labelled as
the attach set's and not as this pool's own.

**2. THE PROVENANCE FACE — REFUSED, unchanged from round 1 and now checked against the detector.**
The natural clerk move here is to name the holder of the record ("the watch's own count", "the
watch's roll"). The card is explicit: `source: (none) · standing SOURCE-UNRESOLVED` and "NO
citation is licensed: a face naming a record holder here is refused by arm A13". The PROVENANCE
detector matches `the watch(?:'s)? (books|roll|rolls|register|registers|count|ledger|ledgers)`
among its twelve holder kinds; no face in this set can match it, because after "the watch" every
face has `{settlement}` or "of" or a copula, never a record noun. The provenance count for this
pool is zero by refusal, not by omission, and the whole face family stays refused until SEAM car 5b
resolves a holder for `compromised.covert`.

**3. THE KNOWLEDGE FACE — REFUSED, and round 1's best line goes with it.** "the town does not know
it" is the most natural rendering of `covert` and it is a TOTALITY OVER PERSONS, which the card
refuses in every column. Every face states the concealment as a property of what is PUBLIC: out of
public view · clear of the town's public dealing · without public notice · stays covert · a covert
arrangement · unexposed · outside the town's public word · a covert buyer · runs unremarked ·
without public notice · covert · goes unannounced. Round 1's "In name the watch is the town's; in
fact it is bought" is withdrawn on this ground and on a second: "in name X, in fact Y" is a
CONTRAST whose rejected alternative names no sibling pool key and no sibling band, which R-DA-02
bars even though the antithesis regex does not catch this spelling. Under §21.3 the licensed
wording wins over the sharper one. The line survives in this refusal row with its measurement and
is not trimmed.

**4. THE COUNT, THE CAUSE, THE SEASON AND THE BUYER'S NAME — REFUSED.** How many of the town's
offices are bought, who bought them, when, and why are all barred (`may NOT: a count, a cause, a
season, a future`; REFUSED COLUMNS: a named character and that character's fate). "a buyer", "a
purchaser", "another interest" and "a covert buyer" are indefinite and carry no name, no office and
no number. Round 1's "someone's keeping" is gone as well: it read as a hedge, and "a buyer" is the
sharper licensed word.

**5. THE SECOND CIVIC OBJECT — REFUSED, and it costs the thread its most obvious noun.** The nouns
the spines hand forward are the `{defwork}`, the muster and its wages. All three are fields the
attached spines TEST (`forces.walls.present`, `settlement.defenseProfile.economicGates.military`),
and the card bars both "any field the attached spine tests" and "another civic object of the class
`force`". So the thread is carried on **the town** in all twelve faces — `{settlement}` in every
one, "the town's" in three — which is the one noun every attach spine names, and the watch enters
immediately beside it. On `WALLED-STRAINED` variant 1 the spine already names the watch, so the
thread is doubled there; on the two `WALLED-QUIET` variants the watch is the passage's one turn
outward and it sits last, which is where §1.4.1 puts it.

**6. THE INSTITUTION'S NAME — a licensing hazard carried forward, not curable by wording.**
`SECURITY_INSTITUTION_RE` (`src/domain/corruption.js:630`) matches
`watch|garrison|constab|guard|magistrate|court|barracks`, and `compromisedSecurityInstitutions`
returns the matched institution's own recorded NAME. The card's bag offers no slot for that name,
so every face must write the pool key's own word, `watch` — and on a town whose compromised body is
the court or the barracks, all twelve faces name the wrong institution. The cure is a minted slot on
this pool, on the `{defwork}` precedent in this block's own SLOTS line, which is a chair act on the
annex row. Recorded again because a second round of wording still cannot fix it.

**7. THE `MOVE: INSTITUTION` TAG — three of twelve still classify as PRESENT, and the detector is
why.** The INSTITUTION arm needs an institution noun followed within forty characters by one of
`keeps|holds|takes|levies|collects|counts|registers|hears|issues|answers|sits|rules|decides`.
"the watch is bought" carries none of them. Ten faces now carry `watch … keeps` or `watch …
answers` in one clause unit and classify; the two that do not are V3's plain row and its face c.
Forcing them
would mean giving the watch a duty it performs — that it keeps its posts, walks its wards, hears
complaints — which is a `whatItDoes` claim the institution table does not hold (`whatItDoes` is
`closed: false` at this tip, CLERK-LAWS §1.2 NOTE). The tag disagreement is reported rather than
bought with an unlicensed fact. The detector has no arm for a CAPTURED institution, which is the
finding underneath it.
