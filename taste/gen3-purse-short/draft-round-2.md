1. `[plain]` The purse at {settlement} falls short of what its defences come to in upkeep.
   - `[face]` What {settlement} lays out on its defences runs under their standing charge.
   - `[face]` Beside the upkeep of its defences, {settlement} shows the lesser purse.
   - `[face]` Coin at {settlement} does not reach the keeping of its defences.
2. `[plain]` The upkeep of the defences held at {settlement}'s charge is not met in full.
   - `[face]` What keeping its defences comes to is more than the purse at {settlement} meets.
   - `[face]` Above what {settlement} lays out stands the charge of keeping its defences.
   - `[face]` Keeping the defences at {settlement} runs dearer than the purse.
3. `[plain]` The defences at {settlement} are kept on a purse short of their upkeep.
   - `[face]` For the keeping of its defences, {settlement} does not find the charge.
   - `[face]` Short of its upkeep is how the paid defence at {settlement} stands.
   - `[face]` Between the purse and the keeping of its defences, {settlement} stands short.

--- NOTES

Seat: Opus 5 — Fable-unvalidated · block `DS-GEN-3` · pool `purse: short` · draft round 2 ·
3 semantic variants · 12 faces (4 per variant: one `[plain]`, three `[face]`). The typed lines
(**ROLE** `modifier` · **FORM** `sentence` · **MOVE** `PRESENT` · **READS**
`readings.economicGates.military` · **RELATION** `addition` · **ATTACH** `scores.military:
CRITICAL` `scores.military: WEAK`) are already in the annex and are NOT repeated here; the rows
above are the complete replacement for the pool's `⟦TO-AUTHOR⟧` line and nothing else. The
licence card was printed first, in the read-only dock:
`node scripts/prose-licence-card.mjs DS-GEN-3 'purse: short'`.

Word count per face, in the order written:
  variant 1 — 14 · 12 · 11 · 11
  variant 2 — 14 · 14 · 12 · 10
  variant 3 — 13 · 12 · 12 · 12
(mean 12.25, min 10, max 14 — inside the working band's INTERIOR, 10–14, and clear of both
edges: no face under eight words, none near thirty. Round 1 ran 10–15.)

## ANSWERING THE GATE, MEASURE BY MEASURE

| the gate's failing measure, round 1 | what round 2 does | how it was checked |
|---|---|---|
| **A13 · "a holder with no institution" × 6** — the citing face `By the muster roll's own account, {settlement} keeps its defences under their charge.` | **MOVED to 0.** The citation is withdrawn and the face is replaced by `Short of its upkeep is how the paid defence at {settlement} stands.` **Zero provenance moves are authored in this set**, so arm A13 returns before its first row on all twelve faces (`armA13`: `if (cited === 0) return out;`). This is not a wording repair — a citation is refused for this pool at every wording, and the ground is written into refusal R1 below. | `composedWalker.js:830-868` read; `provenanceCount` is `classifyMoves(...)` filtered to `PROVENANCE`, whose one detector is the twelve-kind regex at `moveGrammar.js:225`. Round 1's face matched its `the (?:muster\|toll) (?:roll\|…)` limb; no round-2 face contains any member of that vocabulary. |
| **Q · "a trailing coordinate naming no second field" × 12** on `the gate is shut at night by whoever is nearest to it.` | **NOT MOVED — and not movable from this pool.** The segment is the second half of the `scores.military: CRITICAL` `[ledger]` **SPINE**, after its semicolon. Refusal R2. | `entryWalker.js:836-838`: arm Q splits every sentence on `;` and considers each part after the first. The part carries no `{slot}` and no band word, so it is WITHHELD. My twelve faces each compose with that one spine — which is exactly where ×12 comes from. |
| **A3 × 12** | **NOT MOVED — also the SPINE's**, the `scores.military: WEAK` `[ledger]` line: `…counted in what the households own rather than in what the hall issues.` Refusal R3. | `CONTRAST_SHAPES` (`entryLexicons.js:304`) matches `rather than`; `armA3` reads the shape plus its tail to the next stop, whose content words are `hall`/`issues`, which no sibling pool key of `DS-GEN-3` supplies, so the band half is WITHHELD to the refuter. Arm A3 reads the WHOLE composed unit, so a modifier can only make this worse; **no round-2 face carries a contrast shape at all.** |
| **band FAIL 0 · WITHHELD 0 (every unit PASS)** | **HELD, with margin.** Every face stays 10–14 words (the `shareUnder8` floor and the `shareOver30` ceiling both untouched), no face closes on a pronoun, on `{settlement}`, or on a `-ment/-tion/-sion/-ity/-ness/-ance/-ence/-ship/-hood/-dom` noun, and no face adds a semicolon, colon, dash, bracket, quote, `-ly` adverb, doubled adjective or triad. | the twelve closers are `upkeep · charge · purse · defences · full · meets · defences · purse · upkeep · charge · stands · short` |

**Two latent failures cured in the same effort** (neither was a finding yet; both were one wording-width away, and §21.2 asks the round to remove failing states rather than only the named ones):

- Round 1's `Less coin goes to the defences at {settlement} than their keeping.` passed `A3` **by eleven characters**: `CONTRAST_SHAPES` carries `\bless [^.,;]{1,30} than\b`, and the span between `less ` and ` than` in that face was 41 characters. Any tightening of the line would have fired wall 5 in a block whose siblings do not name the alternative. The `less … than` construction is gone from the set.
- Round 1 carried `cost` (variant 1's `[plain]`) and `pays for` / `paid for` (variant 2's `[plain]`, faces 2b and 3c). Both are members of the **CONSEQUENCE** clause detector (`moveGrammar.js:222`), which outranks the PRESENT fallback — so those faces classified as a CONSEQUENCE move while the annex row declares **MOVE: `PRESENT`**, and `composedOrderOf` carried the wrong move into the composed order id. **No round-2 face contains a CONSEQUENCE token**; all twelve fall through to PRESENT, which is what the row declares. Named as a finding of round 1 against itself, not smuggled.

## WHAT EACH FACE CLAIMS, AND THE CARD CLAUSE THAT LICENSES IT

All twelve faces assert **exactly one claim, the same claim**: that `readings.economicGates.military`
holds — *the outlay {settlement} makes on the defences it pays out for is below what keeping them
comes to* — as a STANDING fact of the record. Nothing else is asserted by any face.

| card clause | what it licenses, in every face |
|---|---|
| `reads: readings.economicGates.military (measured)` | the single fact each face states |
| `may claim: that military holds, as a STANDING fact of the record` | the present tense, unhedged, undated, ungraded |
| `seat/form: sentence / sentence · move: PRESENT · angle: plain` | one sentence per face, present tense, plain; the `[plain]` angle is fixed by the card, so all three variants keep it |
| `relation: addition` | the empty opener: no connective before the face, the unit being `spine + ' ' + modifier` |
| `bag: {settlement: proper}`, FILLED `{settlement}` | the one slot every face names, exactly once; a modifier naming neither a slot nor a band word is the summarising beat (ARCH §8.3, arm Q), and `{settlement}` is the only naming this bag offers |
| `audience: player (no mark)` · `covert: no` | no `dm-only` mark on any variant; this pool's reader is the player, and the covert mark is not this pool's to carry |
| `may NOT: a count · a cause · a season · a future · a standpoint · a second fact · any field the attached spine tests` | refusals R4–R9 |

**Face by face** — the claim each makes, and the clause behind it. Where a face uses a word that
could be read as a second claim, that reading is named rather than left for the refuter.

*Variant 1 — the purse set against the charge (money as the subject).*
- `[plain]` **The purse at {settlement} falls short of what its defences come to in upkeep.** — the one claim (`may claim`); the town named (`bag`). `falls short` is the pool key's own word and the register's plain measurement idiom; `come to in upkeep` is a magnitude in words, never a sum (`may NOT: a count`).
- `[face]` **What {settlement} lays out on its defences runs under their standing charge.** — the same claim as a negation of sufficiency. `lays out` is the outlay and names no amount; `standing charge` is the record's word for a fact that holds, so the sentence closes on the STANDING half of `may claim`.
- `[face]` **Beside the upkeep of its defences, {settlement} shows the lesser purse.** — a fronted comparison; `lesser` is a magnitude class, not a stated count (R-DA-16's COUNT move is not taken). `shows` is the record's plain verb for what a town's arrangement presents; no holder of a record is named, so it is not a PROVENANCE move (refusal R1).
- `[face]` **Coin at {settlement} does not reach the keeping of its defences.** — the shortest construction in the variant; `does not reach` is a measurement, not a declared absence: nothing is said to be missing from the record (R-DA-08's GAP is not taken, and no `not-held` field exists to license it).

*Variant 2 — the upkeep as the thing unmet (the cost as the subject).*
- `[plain]` **The upkeep of the defences held at {settlement}'s charge is not met in full.** — `held at {settlement}'s charge` is the field's own scope: the generator gates only the FUNDED portion, and the community baseline (armed households, terrain alarm) is unpaid and ungated, so the face says the paid part and nothing wider. `in full` is a completeness word, not a fraction.
- `[face]` **What keeping its defences comes to is more than the purse at {settlement} meets.** — the cost fronted as the subject of the comparison; `more than` is a magnitude relation and not a CONTRAST shape (no rejected alternative is named — wall 5 is never engaged).
- `[face]` **Above what {settlement} lays out stands the charge of keeping its defences.** — a locative inversion, the strongest rhythm in the set; the close lands on the civic noun the field names (`defences`), which is R-DA-04's own ask.
- `[face]` **Keeping the defences at {settlement} runs dearer than the purse.** — the short line the register card licenses ("the short line exists"); `dearer` is a magnitude in words and carries no figure. Its compression is deliberate under §21.4 and is not to be traded for plainness.

*Variant 3 — the paid defence's standing condition (the thing kept, as the subject).*
- `[plain]` **The defences at {settlement} are kept on a purse short of their upkeep.** — the STANDING form of the claim: the defences stand, and the purse under them is short. `kept on a purse` fences the sentence to money, so no reader takes it for a capability claim — capability is `scores.military`, the attached spine's own field, and is barred to this pool (`may NOT: any field the attached spine tests`).
- `[face]` **For the keeping of its defences, {settlement} does not find the charge.** — `the charge` is a quantity of money, not a totality over persons, so the REFUSED COLUMN (a totality over persons) is untouched and no `closed` column is quantified (R-DA-15). Round 1's `the whole charge` is retired here: `whole` is a QUANTIFIER (`entryLexicons.js:93`) judged against a column's `closed` flag, and this pool has no closed column to license it.
- `[face]` **Short of its upkeep is how the paid defence at {settlement} stands.** — the replacement for round 1's citing face. A fronted predicate closing on a standing condition; present indicative, no subjunctive edge, no future (A2; STATE never FATE). `the paid defence` is the field's scope again, in three words.
- `[face]` **Between the purse and the keeping of its defences, {settlement} stands short.** — the shortfall stated as the distance between two named things, which is R-DA-11's "a comparison is a measurement in words" taken literally; the close is a condition, varying the close kind against this variant's other three.

## THE THREAD (owner, ~21:4x; MOVE-GRAMMAR §1.4.1)

The composed unit is `spine + ' ' + modifier`, so every face is read as the passage's SECOND
sentence, after any of the six attached spines and after any sibling modifier the composer seats
first. The six spines share exactly one noun with each other — `{settlement}` — because three of
them speak of the watch, the arms and the households (`WEAK`) and three of the muster, the gate
and the arrangement (`CRITICAL`). So `{settlement}` is the only noun a face can carry forward and
be sure of, and every face carries it, once, never in first position (T-F8). §1.4.1's own sentence
licenses that echo: **A11's echo bound counts facts, not nouns, and a deliberate noun echo for the
thread is lawful.**

Beyond the town, each face reaches for the nearest thing the spine has just put on the page:
`defences` picks up the watch, the arms and the muster the spine names in its own words, so the
second sentence lands on the same civic object the first was about, seen from the money side. No
face changes subject in the middle of the passage, and none needs to be the passage's turn outward:
each is one sentence stating one fact about the thing already under discussion.

The pairing I would report as the weakest is variant 2's `Above what {settlement} lays out stands
the charge of keeping its defences.` after the `CRITICAL` `[street]` spine (`What protects
{settlement} is that nobody has wanted it…`), where the spine's subject is the town's luck and the
face's is the charge: the thread there runs through `{settlement}` alone. Reported, not hidden.

## RESTATEMENT AND CONTRADICTION, CHECKED AGAINST THE SIX ATTACHED SPINES (arms A1, A11)

The six spines assert a **capability** band on `scores.military` — the watch against a garrison,
arms counted in households rather than issued from the hall, a town that does not think of itself
as fighting; nothing that would stop a comer, no muster worth the name, nobody having wanted the
place. This pool asserts a **funding** fact on `readings.economicGates.military`. No face names the
axis, the band, the muster, the arms, the watch, the gate, the households or the hall, so nothing
is said twice (A11), and `typedFactsOf` extracts no band-governed noun from any face, so arm A1 has
no overlap to report as a restatement or a conflict. Nothing contradicts either: the gate is
written only under `hasAnyDefense`, so on every town that can draw this pool at least one paid
defence exists to be underfunded — at `CRITICAL` that may be the walls alone, which is why no face
names paid men (refusal R6).

## REFUSALS — what could not be made lawful, and why (a refusal is a result)

1. **THE PROVENANCE MOVE — REFUSED for this pool at every wording, and this is the round's main
   correction.** The licence card prints `source: muster · standing LICENSED`, which reads as a
   licence; the walker's third limb is the one that binds: `if (held.holder === null)` →
   **WITHHELD, "a holder with no institution"** — *the holder kind resolves to no institution in
   this town's roster, so the cited record has nobody keeping it*
   (`composedWalker.js:856-859`). The limb is keyed on the POOL, not on the wording, so no
   citation of any holder can pass here: a different holder is not licensed by the card, and the
   licensed holder has no institution. **Zero citations are authored.** The banked round-1 face
   stays in this packet's history under §22 (b) as a refusal row with its measurement; the family
   stays at four and nothing is trimmed.
2. **The `Q` finding on 12 of 72 composed units — REFUSED, it is the SPINE's.** The segment arm Q
   withholds on is `the gate is shut at night by whoever is nearest to it.`, the half after the
   semicolon in the `CRITICAL` `[ledger]` spine. No wording of a modifier changes a clause that
   stands before it; the cure is a spine rewrite, which is not this packet's to write.
3. **The `A3` finding on 12 of 72 composed units — REFUSED, it is the SPINE's.** `rather than` in
   the `WEAK` `[ledger]` spine, whose rejected alternative (`what the hall issues`) no sibling pool
   key of this block names. Same reasoning: my faces sit in the following sentence, and A3 reads
   the unit whole, so the only thing a modifier can do here is avoid adding a second contrast —
   which it does.
4. **A count, a share or a ratio** ("half its keep", "two parts of three", "sixty in the hundred").
   REFUSED: card `may NOT: a count`; the no-digit wall (A4, R-DA-16); and every member of
   `check-pair`'s COUNT lexicon is absent from all twelve faces, so no face adds one against its
   `[plain]` parent (A6). The gate's own arithmetic is a number the record does not state.
5. **A cause** ("the town's trade cannot carry it", "a thin revenue leaves the defences unpaid").
   REFUSED: card `may NOT: a cause`. **Refused against the world, not by it** — the economic output
   genuinely drives the gate, so a causal face would be TRUE and still unlicensed: that driver is a
   second field this pool does not read, and MOVE-GRAMMAR §1.2 row 2 gives HISTORY/CAUSE only to an
   event-provenance field. Named again so no later author re-proposes it as an obvious improvement.
6. **Paid men, wages, the garrison or the watch** ("the garrison's wages are behind"). REFUSED on
   two independent grounds: the gate is written wherever ANY defence exists — walls alone will do —
   so a wages claim is false on a walls-only town and would break claim equality inside the variant
   (arm C / A6); and the watch and the garrison are institutions the attached spines work in, so
   naming them risks A11 as well as `may NOT: any field the attached spine tests`.
7. **A season, a term or a date** ("this year the purse is short", "since the last levy").
   REFUSED: card `may NOT: a season`; every one of those words is in the DURATION lexicon and would
   be an A6 addition against the parent; and a term boundary is a HISTORY move with no
   event-provenance field behind it (R-DA-19).
8. **An edge or a future** ("unpaid defences would go unrepaired"). REFUSED: card `may NOT: a
   future`; and a subjunctive edge here would assert a capability outcome, which is the spine's
   field. THE PROMISE: state never fate. No face carries `will`, `would`, `could`, `can`, `may`,
   `might` or `shall`.
9. **A second fact of any kind** — what the shortfall reaches, what the purse holds instead, who
   makes it up. REFUSED: card `may NOT: a second fact`; `RELATION: addition` holds no
   `consequence.clause` joint, so no face carries a clause seat, and no face carries a semicolon or
   a colon.
10. **A contrast face** ("kept on coin and not on wages"; "paid in part rather than in full").
    REFUSED twice: wall 5 licenses a contrast only where a sibling pool key or band names the
    rejected alternative, and this block's siblings name none of these; and the antithesis SHAPE is
    the estate's most-exceeded band, so a contrast face would spend depth on a shape the pool does
    not need. All twelve faces are positive statements of one magnitude relation.
11. **A `dm-only` face.** NOT AUTHORED: `covert: no · audience: player (no mark)`.
12. **A totality** ("the charge is never met", "nothing in the purse answers it"). REFUSED: the
    REFUSED COLUMNS line ("a totality over persons") and R-DA-15's quantifier rule — a quantifier
    is licensed only by a `closed` column, and this pool resolves none. Round 1's `the whole
    charge` is withdrawn under this row.
13. **A second level-1 GRAMMAR. DECLARED, not concealed.** Of MOVE-GRAMMAR §2.1's V1–V8 only **V1
    (PRESENT alone)** is licensable here: no `none-exists` field (V3), no `not-held` provenance
    (V8), no named-object field (V4), no institution row (V5), no unresolved-value field (V6), no
    structural-consequence field (V2), no event provenance (V7). §3.1's rule is to write only the
    members the block licenses and never to write one empty, so the three variants vary in SUBJECT,
    VERB and RHYTHM inside V1 (the purse · the upkeep · the paid defence), not in grammar. A walker
    should read the one grammar as the licensing filter's own result, not as a flat pool.

## FINDINGS CARRIED UP (unchanged in substance from round 1; re-stated so the chair has them in one place)

- **F1 — the modifier sentence band is still UNPINNED.** ARCH §6.1 pins a FRAGMENT estimate and
  the unit's `≤ 2 sentences · ≤ 3 facts`, but no word band for `FORM: sentence` at the MODIFIER
  grain; R-DA-05/R-DA-06's figures are REGISTER-grain over whole variants. This set was written to
  a declared working band of **8–16 words, interior 10–14**, and lands at mean 12.25 (10–14). The
  number wants setting at car 6, with a within-pool spread floor decided beside it: one fact at one
  seat cannot reach a wide spread without a second claim, and padding to a spread figure is the
  metronome R-DA-05 exists to refuse.
- **F2 — the licence card's `source` line and arm A13 disagree on this pool, and the card is the
  friendlier of the two.** The card prints `source: muster · standing LICENSED`, which a writer
  reads as "a citation is licensed here"; the walker withholds every citation because the holder
  KIND resolves to no institution in the town's roster. Round 1 spent a face on that gap. **The
  card should print the institution resolution beside the standing** — or print
  `NO citation is licensed` as it does for an unresolved source — so the next writer is not
  invited into the same refusal. This is the one instrument change this packet asks for.
- **F3 — ARCH §6.5's relation ground is wrong on this pool; the card's is right; both land at
  `addition`, so no byte moves.** §6.5 says the relation row `(economicGates.military,
  scores.military)` has the spine's field as an endpoint; the shipped table's row joins the
  economic output to `economicGates.military`, and `scores.military` appears in no row. The card's
  stated ground — no table row joins this field to the spine's primary field, so `addition` is the
  claim-free floor — is the correct one.
- **F4 — the ATTACH sets disagree between the architecture and the shipped annex.** ARCH §6.5
  narrows this pool to `WEAK`, `CRITICAL` and **`ADEQUATE`**; the annex row and the licence card
  name two, `CRITICAL` and `WEAK`. This set was written against the card's two and then read
  against the three `ADEQUATE` spines as well: every face is true there, none restates, none
  contradicts, because a funding fact is orthogonal to a capability band at every rung. **Widening
  the attach to three would cost no re-authoring.** The echo bound cannot arbitrate, because the
  card records that this pool's read is absent from the census's fact index and the echo table is
  keyed on a coarser producer-token root — so the ATTACH set is the only guard, which is why the
  disagreement wants a ruling rather than a shrug.

## MECHANICAL CHECKS RUN ON THE TWELVE FACES (by script, over this file's variant block)

Zero digits, zero percent signs, zero em or en dashes, zero semicolons, zero colons, zero
exclamation and question marks, zero `which`, zero second-person pronouns; zero modal verbs
(`will · would · could · can · may · might · shall`); zero members of the CONSEQUENCE, PROVENANCE,
ABSENCE and CONTRAST detectors; zero QUANTIFIERS (`every · all · each · only · none · any · no ·
whole · entire`); zero AUTHORED_MAGNITUDES (`half · some · many · several · a few · a handful …`);
zero DURATION words; zero office nouns. Every face carries `{settlement}` exactly once and never in
first position; every face names the defences, so each claims the field it reads; all twelve
two-word openers are distinct; no face closes on a pronoun, on the slot, or on an abstract-suffix
noun.

## WHAT WAS EXECUTED

`node scripts/prose-licence-card.mjs DS-GEN-3 'purse: short'` in the read-only dock (the one
script this seat may run there). Reads, whole or by the named section: `REGISTER-CARD.md` (whole,
with amendments S2 and S3); `RULES-V2-PART-B.md` §1, §16–§16.2, §18, §20, §21–§21.4, §22, §23;
`sweep/MOVE-GRAMMAR.md` §1–§3, §4.4.1–§4.4.3, §1.4.1; `sweep/CLERK-LAWS.md` §2.4.1, §2.6.1;
`arch-prose/ARCH-COMPOSED-PROSE-v2.md` §2.5 and §8.3 (with §2.4 and §8.4 read for the face key and
the arm roster); and in the dock, read only: `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`
§DS-GEN-3 whole (the six attached spines and this pool's row), `src/domain/prose/composedWalker.js`
(arms A0b, A1, A3, A9, A13 and `composedOrderOf`), `src/domain/prose/entryWalker.js` (arms Q, C5,
C6, D, X; `bandReadings`, `typedFactsOf`, `holds`), `src/domain/prose/entryLexicons.js` (the
lexicons quoted above), `src/domain/prose/moveGrammar.js` (the clause detectors) and
`scripts/check-pair.mjs` (the DURATION/COUNT/CONTRAST/RATION sets). **No dock byte was written; no
test was run in any dock; no file outside this packet was created or modified.**
