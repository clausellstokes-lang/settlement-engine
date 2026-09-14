1. `[plain]` The food eaten at {settlement} comes in from outside the town.
   - `[face]` From beyond the town comes what {settlement} eats.
   - `[face]` Food is carried to {settlement} from other places.
   - `[face]` At {settlement} the food is fetched in from elsewhere.
2. `[plain]` For its food {settlement} depends on what comes in from outside.
   - `[face]` The town at {settlement} is fed on carried food.
   - `[face]` What the town eats at {settlement} arrives from other parts.
   - `[face]` In the matter of food the town at {settlement} lives on what arrives.
3. `[plain]` The stores at {settlement} are filled from other parts.
   - `[face]` Out of other places comes what the town at {settlement} lays in store.
   - `[face]` Carried food fills the store that {settlement} keeps.
   - `[face]` What {settlement} puts by in store is drawn from elsewhere.

--- NOTES

Seat: Opus 5 — Fable-unvalidated · block DS-DEF-2 · pool `stores: import-fed` · DRAFT ROUND 3 ·
3 variants · 12 faces (3 `[plain]` parents + 9 `[face]` sub-rows). The typed lines (ROLE
`modifier` · FORM `sentence` · MOVE `PRESENT` · READS
`settlement.economicState.foodSecurity.label` · RELATION `addition` · ATTACH
`Disasters & Famine: granary AND hospital`) are already in the annex and are NOT repeated here;
the rows above replace the pool's `⟦TO-AUTHOR⟧` line and nothing else. The licence card was
printed first: `node scripts/prose-licence-card.mjs DS-DEF-2 'stores: import-fed'`.

WORD COUNT PER FACE (`taste-measure.mjs:125`'s own counter — whitespace tokens, a slot is one):

| variant | `[plain]` | `[face]` 1 | `[face]` 2 | `[face]` 3 |
|---|---|---|---|---|
| 1 | 11 | 8 | 8 | 9 |
| 2 | 11 | 9 | 10 | 13 |
| 3 | 9 | 13 | 8 | 10 |

n = 12 · min 8 · max 13 · mean 9.92 · sample sd 1.78. Round 2 ran 9–12, mean 10.25, sd 0.97.
No face is under eight words, so `wordsPerSentence.shareUnder8` stays at 0 on every face and the
2.192-band-width exceedance round 2 cleared does not return; no face is over twenty-two, so every
face stays in the middle length band and `shareOver30` stays 0.

## THE GATE'S THREE MEASURES, ANSWERED ONE BY ONE

| the gate's failing measure | round 3 | how it was established |
|---|---|---|
| composed walk · `Q` · *a trailing coordinate naming no second field* · 12 findings (band: WITHHELD 0) | **NOT MOVED. UNSATISFIABLE FROM THIS POOL — a sitting row under §21, not a dry round.** The twelve findings are one per composed unit of the `[ledger]` spine, and the segment the arm reads contains zero bytes of any modifier. Proof and the minimal spine cure below (REFUSAL 1). | `entryWalker.js:817-838` read line by line against the three spine texts at `RECEIPT_POOLS_DOSSIER_STATE.md:2700-2702` |
| composed walk · `A3` · 12 findings (band: WITHHELD 0) | **NOT MOVED. UNSATISFIABLE FROM THIS POOL — a sitting row.** The twelve are one per composed unit of the `[counterforce]` spine; the alternative the arm scores is bounded by the spine's own full stop and cannot reach a modifier. Proof and the minimal spine cure below (REFUSAL 2). | `composedWalker.js:521-573` walked by hand over the counterforce text |
| composed walk · unit verdicts FAIL 0 · WITHHELD 24 · PASS 12 of 36 (band: FAIL 0 · WITHHELD 0) | **HELD at FAIL 0; WITHHELD stays 24 for the two reasons above and for no reason this pool owns.** The twelve `[street]` units PASS in round 2 and every property that made them pass is preserved by construction (below). Round 3 adds no finding of its own: no face carries a semicolon, so `armQualify`'s coordinate limb never fires on a modifier; every face names `{settlement}`, so the second-sentence limb returns early on every one of the 36 units; no face matches `CONTRAST_SHAPES`, so `A3` gains nothing. | the arm-by-arm walk below |

**Why this is a REFUSAL and not a dry round.** §21 phase 1 defines a DRY round as one that moves no
failing measure *and* bands the set for a second attempt; it also says in the same breath that **an
unsatisfiable set is a sitting row**. These two measures are not unsatisfiable *for this pool's
wording* — they are unsatisfiable *by any wording of any modifier at this attach*, because the text
both arms read is the spine's and the composer always seats the spine first. A third draft round of
this pool cannot move them, a fourth cannot, and neither can the refinement round: the lever is in
`Disasters & Famine: granary AND hospital`, which is not this packet's to write. The measures round 3
COULD move — the ones the owner's §21.1/§21.2 name as the ceiling — are moved, and are reported
below with their numbers.

## WHAT ROUND 3 MOVED (the ceiling, §21.1 — "the band is a licence, not a target")

| named target | round 2 | round 3 | the rule behind it |
|---|---|---|---|
| distinct CLOSING words over the twelve faces | **5** (`town`×3 · `places`×3 · `elsewhere`×3 · `outside`×2 · `eats`) | **10** (`town` · `eats` · `places` · `elsewhere` · `outside` · `food` · `parts` · `arrives` · `store` · `keeps`; only `parts` and `elsewhere` recur, and never inside one variant) | R-DA-04 — land on the civic noun the field names, and VARY THE KIND OF CLOSE; the close-kind histogram is the arm this direction is owed to |
| CLOSE KINDS represented (`entryLexicons.js` `CLOSE_KINDS`) | one (unclassified source-word closes, plus `eats`) | three — an unclassified source close (`outside`, `elsewhere`, `places`, `parts`), a `standingFact` close (`keeps`), and a close on the pool's own object (`store`, `food`) | R-DA-04; "always end on an object" is itself a fixed move (Kay 30's guard), so the kind is varied, not the position |
| within-pool LENGTH SPREAD | range 9–12, sd 0.97 | range 8–13, sd 1.78 | R-DA-05 — rhythm follows load, the pool is the unit of spread; round 2's refusal 3 reported the narrowing as the band's price, and round 3 buys back what the eight-word floor allows |
| faces threading a LITERAL noun with ALL THREE spines | 3 of 12 | **6 of 12**, the other six carrying a noun from two spines and taking the second limb of §1.4.1 (the turn outward, placed last — which is where the composer always seats this modifier) | §1.4.1 THE THREAD (owner, ~21:4x), the wall that arrived after round 2 |
| distinct two-word OPENERS (A11 spread) | 12 of 12 | 12 of 12, held | R-DA-05; A11 — no two variants of one pool share their first two words |
| A5 sibling distance | 0 synonym swaps; mean within-variant content overlap ≈ 1,094 bp | 0 synonym swaps; mean ≈ 1,003 bp (v1 1,167 · v2 1,183 · v3 655) | `composedWalker.js:617` — the arm reports only an exact content-token match at 10,000 bp; both rounds are an order of magnitude clear, and the number is reported because §21.1 names sibling distance as a refinement target, not because either round is near the floor |

Sibling distance is reported HONESTLY and not claimed as a sweep: variant 3 is wider than round 2's
by 0.66 of round 2's figure, variant 1 is wider by a third, and **variant 2 is NARROWER than round
2's 1,032 bp**, because round 3 spends variant 2's four faces on the town-as-subject reading rather
than scattering them across four different subjects. That is a deliberate trade for the thread and
for the read-aloud ear, and it is stated rather than buried.

## WHAT EACH FACE CLAIMS, AND THE CARD CLAUSE THAT LICENSES IT

All twelve faces assert exactly ONE claim, the same claim, with no second: that
`settlement.economicState.foodSecurity.label` holds — the food the town eats reaches it from
outside — as a STANDING fact of the record.

| clause of the licence card | what it licenses, in every face |
|---|---|
| `reads: settlement.economicState.foodSecurity.label (measured)` | the single fact each face states, and the only one |
| `may claim: that label holds, as a STANDING fact of the record` | the present tense throughout, unhedged, undated, ungraded; no face counts, causes, seasons, forecasts or takes a standpoint |
| `seat/form: sentence / sentence · move: PRESENT · angle: plain` | one sentence per face, capital-initial, terminal stop, present tense, a plain arrival verb or the copula; all three variants keep the `[plain]` mark because the card fixes the angle |
| `relation: addition` | the empty opener: the connective list at this seat holds only the empty opener, so the composed unit is `spine + ' ' + face` verbatim (`taste-measure.mjs:239`), and no face carries a joint of its own |
| `bag: {band: RESERVED, route: proper, settlement: proper}` · FILLED `{settlement}` | `{settlement}` is the only slot any face names, once per face, never as the opening token. `band` is RESERVED and `route` is not filled at this block's call sites, so neither appears — arm D fails a slot the composer never fills, and A9 fails a sentence face that opens on a `proper`-typed slot |
| `audience: player (no mark)` · `covert: no` | no `dm-only` mark on any variant or face; this pool's reader is the player, and the covert twin is not authored |
| `source: (none) · standing SOURCE-UNRESOLVED · NO citation is licensed` | zero PROVENANCE moves: `provenanceCount` reads 0 on all twelve, so `armA13` returns before it emits anything |

**Variant 1 — the food is the subject; the fact is that it arrives.** `comes in`, `comes`, `is
carried`, `is fetched in` are four verbs for the one arrival, and the four faces run
subject-first, locative inversion, short flat, and framed-by-place. `outside the town`, `other
places`, `elsewhere`, `beyond the town` are the label's own complement and name no place and no
road; they are not a GEOGRAPHY move, which would need a geography field this pool does not read.

**Variant 2 — the town is the subject, and the fact is a standing dependence.** `depends on`, `is
fed on`, `arrives`, `lives on`. Nothing names a buyer, a price, a road, a carrier, a season or a
share, so no field beyond the card's one is touched. The thirteen-word fourth face is the pool's
long line and the eight- and nine-word faces are its short ones; the length follows the load
(R-DA-05), not a metronome.

**Variant 3 — what the town has put by is the subject, and the fact is where it came in from.**
These four PRESUPPOSE a store and ASSERT only where its contents come from. The presupposition is
discharged by the card's own `attach`: this pool attaches to `Disasters & Famine: granary AND
hospital` alone, where the spine asserts the store, so on every ground where a face can render the
store exists. No face asserts the granary's presence, the hospital's, or any second civic object —
those are fields the attached spine tests, which the card refuses twice over. The verb in the
`[plain]` line is `are filled`, deliberately NOT `hold`: the `[ledger]` spine already reads
"{settlement} holds food against a bad year", and a modifier that says "hold food" behind it
restates the spine's own fact.

## HOW EVERY ARM WAS KEPT GREEN (the twelve faces, walked by hand against the shipped instruments)

- **`armQualify` second-sentence limb (`entryWalker.js:836`).** Every composed unit splits into
  `[spine, face]` at the spine's terminal stop, so the face IS `raw[1]` and is the segment the arm
  considers. Every face names `{settlement}`, so `[...text.matchAll(SLOT_RE)].length` is non-zero and
  the arm returns before it withholds — on all 36 units. This is not decoration: a face without a
  slot would add 36 findings.
- **`armQualify` coordinate limb.** No face carries a semicolon, so `sentence.split(/\s*;\s*/)`
  returns one part for every modifier and the loop never enters.
- **`armA3`.** No face matches `CONTRAST_SHAPES` — no `rather than`, no `not X but Y`, no `, not x`,
  no `less X than`, no `never … so much as`, and no trailing `and not …` / `or not …`.
- **`armA9`.** Every face opens on a capital that is not a slot, and closes on its own stop.
- **`armA6` / `check-pair` with the longer arm suppressed.** Each face's slot set (`{settlement}`)
  and mark set (empty) are byte-equal to its parent's, and no face adds or loses a token of the
  DURATION, COUNT, CONTRAST or RATION lexicons (`check-pair.mjs:66-77`) — none of the twelve carries
  any member of any of the four.
- **`armA1`.** No face carries a `BAND_PHRASES` reading, so `typedFactsOf(...).bands` is empty on
  every modifier piece and no restatement or conflict can be emitted across the join.
- **`armA13`.** `classifyMoves` returns no `PROVENANCE` on any face — no `the … books/roll/register`,
  no `the elders say`, no `from the road`.
- **`armC4`.** No `QUANTIFIERS` member (`every`, `all`, `each`, `only`, `none`, `any`, `no`, `whole`,
  `entire`), so no totality is asserted over an open column; no `will` or `shall`, so no bare future.
- **`armC3`.** No `was`/`were`/`had`/`once`/`formerly`/`no longer`, so the semantic half never
  withholds; no member of `SUPPLY_CLAIM_LEXICONS` — no `upriver`, `overland`, `by road`, `by river`,
  and no `salted`, `milled`, `dried`, `pressed` — so the route/processing half never fires.
- **`armExhaustivity`.** No face carries `is what` / `are what` / `is who` / `is the only` / `is the
  one`, and no face has the shape `The <lowercase> … is the <lowercase>`.
- **`armC2`.** No office noun and no duty predicate; the faces name no office, count or exemption.
- **`armCitation`.** No `RECORD_CITATION` shape.
- **The banded metrics.** No face carries a semicolon, colon, em dash, question mark, exclamation,
  parenthesis, quotation mark, digit, `-ly` adverb, `, which` tail, `X-ed and Y-ed` adjective pair,
  triad, `There is`/`It is` opener or `-ing` opening word; **no face ends on `{settlement}`** (the
  closer reader strips the braces and `settlement` ends in `-ment`, the metric's own suffix — round
  2's 8.6-band-width finding), and no face ends on a pronoun.

## THE THREAD (§1.4.1), FACE BY FACE

The three spine faces this modifier composes behind hold these nouns:
`[ledger]` — {settlement}, food, year, sick, town, harvest, outbreak, catastrophe ·
`[street]` — town, place, grain, ill, both, worth ·
`[counterforce]` — harvest, outbreak, catastrophe, {settlement}, reason, buildings, luck.
**No single noun is literal in all three**, so the widest available thread is a face carrying both
`{settlement}` (literal in ledger and counterforce) and `the town` (literal in ledger and street).

| face | noun carried forward | which spines it threads literally |
|---|---|---|
| 1.`[plain]` | food · town · {settlement} | all three |
| 1.f1 | town · {settlement} | all three |
| 1.f2 | food · {settlement} | ledger, counterforce (street: the turn outward, last) |
| 1.f3 | food · {settlement} | ledger, counterforce (street: the turn outward, last) |
| 2.`[plain]` | food · {settlement} | ledger, counterforce (street: the turn outward, last) |
| 2.f1 | town · {settlement} | all three |
| 2.f2 | town · {settlement} | all three |
| 2.f3 | food · town · {settlement} | all three |
| 3.`[plain]` | {settlement} | ledger, counterforce (street: `store` answers "a place for grain") |
| 3.f1 | town · {settlement} | all three |
| 3.f2 | food · town · {settlement} | all three |
| 3.f3 | {settlement} · store | ledger, counterforce (`store` answers "the two buildings") |

Six of twelve carry a literal noun from every spine, against three of twelve in round 2. The other
six take §1.4.1's second limb without strain, because the composer seats this modifier LAST in every
one of the 36 units: the passage's one turn outward — from what the town has laid by to where it
came in from — is exactly the shift this modifier makes, and it is always in the licensed position.

## REFUSALS — what could not be made lawful, and why (a refusal is a result)

1. **The `Q` finding on 12 of 36 units — REFUSED. The segment is the spine's and no modifier text
   reaches it. CONFIRMED by reading the arm.** `armQualify` splits the composed unit into sentences,
   then splits EACH sentence on semicolons and considers every part after the first. The `[ledger]`
   spine is one sentence carrying one semicolon, so its second part is considered on its own:
   `between them the town can take a failed harvest or an outbreak without either becoming a
   catastrophe.` It names no slot and holds no `BAND_PHRASES` reading, so the arm withholds — once
   per unit, twelve units, twelve findings. **The modifier is a different element of `raw` entirely
   and cannot enter that segment**, for a reason that is itself a law: the composed text is
   `${spineFace} ${face}` and the sentence split fires on `(?<=[.?!])\s+(?=[A-Z"'(])`, so a face
   would have to open lower-case or on `{settlement}` to be swallowed into the spine's sentence —
   and `armA9` FAILS a sentence-seat modifier on both ("does not open on a capital"; "opens on a
   proper-typed slot"), as does the annex's own seam contract (ARCH §2.5). Every escape from this
   finding is a wall. **THE MINIMAL SPINE CURE, for the chair, not for this packet:** the ledger
   spine's post-semicolon clause must carry the slot — e.g. `…; between them {settlement} can take a
   failed harvest or an outbreak without either becoming a catastrophe.` Replacing the semicolon
   with a full stop does NOT cure it: the second sentence then becomes `raw[1]` and the arm's
   second-sentence limb withholds on the same words.
2. **The `A3` finding on 12 of 36 units — REFUSED. The alternative the arm scores is bounded by the
   spine's own full stop. CONFIRMED by walking the arm.** Only the `[counterforce]` spine matches
   `CONTRAST_SHAPES`, on `rather than`. The arm then takes `tail = body.slice(at, at + 11 + 60)` and
   cuts it at the first `.`, `;` or `,` — which is the period after `luck`, at offset 23. The
   alternative is therefore exactly `rather than in the luck`, whose only content word after
   `ALTERNATIVE_STOP` (`rather` and `than` are both on it) is **`luck`**, and `luck` is named by no
   pool key of DS-DEF-2, so the band half is withheld to the refuter. The modifier's first character
   sits at offset 24 or later and is never read. **THE MINIMAL SPINE CURE:** drop the contrast from
   the counterforce spine (`…and the reason is in the two buildings.`), or make the rejected
   alternative name a word a sibling pool key holds.
3. **A CROSS-CHECK the chair can run in one command, which decides the refusal without trusting this
   seat.** Both findings are properties of the spine pool alone, so the sibling packet
   `def2-stores-short` — a different modifier, different words, same `ATTACH` — must show exactly the
   same shape: `Q` 12, `A3` 12, WITHHELD 24 of 36. If it does not, this refusal is wrong and I want
   to be told so. If it does, the row belongs to `Disasters & Famine: granary AND hospital` and the
   two modifier pools are being charged for it twice.
4. **A citation of the record's holder** (S3 / MOVE-GRAMMAR §4.4.3's PROVENANCE move). REFUSED by
   the card: `source: (none) · standing SOURCE-UNRESOLVED · NO citation is licensed`; arm A13 would
   withhold on a cited holder the census does not license. Zero provenance moves are authored.
5. **A count, a share or a magnitude** ("more than half of what it eats", "most of its bread").
   REFUSED: card `may NOT: a count`; A4's no-digit wall; `check-pair`'s COUNT lexicon; and the
   reading behind the label is a percentage band, which is precisely what a face may not carry.
6. **A cause** ("the ground will not feed it", "the harvest falls short"). REFUSED: card `may NOT: a
   cause`; R-DA-19 admits an event move only where an event-provenance field exists, and this pool
   reads a standing label.
7. **A season or a span** ("through the winter", "year after year", "already"). REFUSED: card `may
   NOT: a season`; every one of those words is in `check-pair`'s DURATION lexicon and would be an A6
   addition against the parent.
8. **A contrast face** ("brought in rather than raised"; "carried, not sown"). REFUSED three times
   over: wall 5 licenses a contrast only where a sibling pool key or band names the rejected
   alternative, and this pool's nearest sibling, `stores: short`, names a deficit and not local
   raising; the antithesis shape scores 1.0 against an exemplar band of 0.0082–0.0401, some
   twenty-four band-widths, which fails the entry DEPTH number on its own; and a modifier contrast
   would ADD an `A3` finding to a pool already carrying twelve it did not cause.
9. **The negative half of the label** ("food the town does not raise"; "nothing here is grown").
   REFUSED, and this is a change from an earlier temptation: the card licenses "that `label` holds",
   and the label holds that the food comes in — that the town raises NONE of it is an inference the
   field does not carry. It would also be a LACK move, which R-DA-02 licenses only on a
   `none-exists` field, and `nothing`/`no` would engage `QUANTIFIERS` and `armC4`.
10. **"food that other places raise" / "what other parishes grow".** REFUSED: whether the exporting
    place raised the food or itself imported it is a fact no field holds, and `parishes` is an
    institution claim under R-DA-15.
11. **Naming the granary, the sick-house, a warehouse or any second store object.** REFUSED twice by
    the card: `may NOT … another civic object of the class store`, and `may NOT … any field the
    attached spine tests`. Variant 3 speaks of `the stores`, `the store`, and `what {settlement} puts
    by` — the pool's own object under its own key, the contents and never the building.
12. **Naming a road, a cart, a market, a carrier, or a named good** (grain, bread, salt). REFUSED:
    the bag's `route` is not filled at this block's call sites; a mode of carriage is a route claim
    (`by road`, `by river` are in `SUPPLY_CLAIM_LEXICONS` by name and `by carriage` is the same
    class); and a named good is a particular no field holds — the `[street]` spine says "a place for
    grain", but the same face also renders behind two spines that name no good.
13. **An edge or a future** ("a cut road would empty the stores"). REFUSED: card `may NOT: a future`;
    STATE never FATE; `armC4`'s bare-future arm.
14. **A second fact of any kind** — the reserve's size, the road's state, what the dependence costs.
    REFUSED: card `may NOT: a second fact`; the fact budget on this cell; and `RELATION: addition`
    seats no `consequence` clause, so amendment S2's clause seat is not open to this pool.
15. **A cleft or an inverted copula** ("what {settlement} eats is what other places raise").
    REFUSED: `armExhaustivity` reads a specificational copula as entailing the ONLY value of its
    column, and no `closed` flag licenses that here. Face 1.f1 and face 3.f1 are locative inversions
    carrying no copula and are not this shape.
16. **A `dm-only` face.** NOT AUTHORED: the card reads `covert: no · audience: player (no mark)`.
17. **A second level-1 GRAMMAR.** DECLARED, not concealed: of MOVE-GRAMMAR §2.1's V1–V8 only **V1
    (PRESENT alone)** is licensable for this pool — no `none-exists` field (V3), no `not-held`
    provenance (V8), no named-object field (V4), no institution row (V5), no unresolved-value field
    (V6), no structural-consequence field (V2), no event provenance (V7). §3.1's rule is to write
    only the members the block licenses and never to write one empty, so the three variants vary in
    SUBJECT, VERB, LENGTH and RHYTHM inside V1 (the food · the town · what is put by) rather than in
    grammar. A pool showing one grammar here is the licensing filter's own result and should be read
    as such rather than as a flat pool.
18. **The within-pool sd floor of R-DA-05 (≥ 4.0 words).** NOT REACHED, at 1.78, and it is not
    reachable: one fact at one seat with an eight-word floor and a plain angle has no lawful way to
    reach a twenty-word face without a second claim, and padding to a spread figure is the metronome
    R-DA-05 exists to refuse. Round 3 moved it from 0.97 to 1.78 — the whole of what the floor and
    the fact allow — and reports the remainder rather than buying it.
19. **The `ATTACH` class collision** — `Disasters & Famine: granary AND hospital` and `stores:
    import-fed` name the same civic object class `store` (T-F12), which the shipped projector refuses
    structurally and `--taste` waives. Not curable from the wording: it is a property of the two KEYS,
    and the cure is either a chair act on the attach set or the object-class list the census emits.
    Carried, unchanged from round 2, and named here so it is not read as an authoring fault.
