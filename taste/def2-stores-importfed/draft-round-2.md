1. `[plain]` The food eaten at {settlement} is brought in from outside the town.
   - `[face]` From outside the town comes the food that {settlement} eats.
   - `[face]` Food is carried to {settlement} out of other places.
   - `[face]` At {settlement} the food is fetched in from elsewhere.
2. `[plain]` For its food {settlement} depends on what comes in from outside.
   - `[face]` The town lives on food carried into {settlement} from elsewhere.
   - `[face]` In the matter of food, {settlement} is provisioned from outside the town.
   - `[face]` What keeps {settlement} fed is drawn in from other places.
3. `[plain]` The stores at {settlement} are filled from outside the town.
   - `[face]` The reserve held at {settlement} is laid in from elsewhere.
   - `[face]` What stands in store at {settlement} comes from other places.
   - `[face]` Food put by at {settlement} is carried in from outside.

--- NOTES

Seat: Opus 5 — Fable-unvalidated · block DS-DEF-2 · pool `stores: import-fed` · draft round 2 ·
3 variants · 12 faces. The typed lines (ROLE `modifier` · FORM `sentence` · MOVE `PRESENT` ·
READS `settlement.economicState.foodSecurity.label` · RELATION `addition` · ATTACH
`Disasters & Famine: granary AND hospital`) are already in the annex and are NOT repeated; the
rows above replace the pool's `⟦TO-AUTHOR⟧` line and nothing else. The licence card was printed
first: `node scripts/prose-licence-card.mjs DS-DEF-2 'stores: import-fed'`.

Word count per face, in the order written:
  variant 1 — 12 · 10 · 9 · 9
  variant 2 — 11 · 10 · 12 · 10
  variant 3 — 10 · 10 · 10 · 10
(mean 10.25, min 9, max 12; every face at or above the 8-word floor the shareUnder8 band sets,
and far below the 30-word ceiling shareOver30 sets.)

## ANSWERING THE GATE, MEASURE BY MEASURE

| the gate's failing measure, round 1 | what round 2 does | how it was checked |
|---|---|---|
| band depth · `wordsPerSentence.shareUnder8` (over) at **2.192** band-widths on **2 of 12** faces | **MOVED to 0 of 12.** The two faces under eight words (v1 `[plain]` at 6, v2's third face at 7) are rewritten at 12 and 10. A face is scored ALONE (`taste-measure.mjs` `bandPositionOf(face, …)`), so one sentence under eight words scores 1.0 against a band of 0.0292–0.3333 — the 2.192 is arithmetic, not taste, and the only cure is the eighth word. Every face now runs 9–12. | the ten leaf fingerprints in `prose-research/primary/`, banded leave-out-nothing as `exemplarBands` does, and each face scored on `proseFingerprint`'s own formulas |
| band depth · `closers.abstractNounRate` (over) at **8.6** band-widths on **1 of 12** faces | **MOVED to 0 of 12.** The offender was v2's first face, which closed on the slot: `closers` strips `{}` and reads `settlement`, and `settlement` ends in **-ment**, which is the metric's own suffix list. That face now closes on `elsewhere`. **No face in this set ends on `{settlement}`**, and no face ends on a `-ness/-tion/-sion/-ity/-ment/-ance/-ence/-ship/-hood/-dom` word. | the same scorer; the twelve closers are now `town · eats · places · elsewhere · outside · elsewhere · town · places · town · elsewhere · places · outside` |
| depth ok share **9 of 12** faces (band: 12 of 12) | **MOVED to 12 of 12.** With the two rows above cleared, every face's deepest exceedance is `wordsPerSentence.neighbourVariation` at **1.597 band-widths UNDER**, inside the entry DEPTH of 1.75 (§16.2). That figure is structural and unremovable: a one-sentence face has no neighbour, so burst is 0 by construction, and every face in this estate carries it. | scored face by face; deepest = 1.597 on all twelve |
| exceeded-count against the entry BUDGET | **13 of 21 scored**, against a budget of `floor(21 × 2/3)` = 14. Held, with one metric of headroom; that is why no face carries a semicolon, a colon, a dash, a bracket, a quote mark, an `-ly` adverb, a doubled adjective or a triad — each of those is an exceedance ADDED to a budget already at 13. | same run |
| A5 sibling distance | no pair inside any variant shares its opener AND its sentence count AND its content-word set; **12 of 12 openers are distinct** across the whole pool (`the food · from outside · food is · at {} · for its · the town · in the · what keeps · the stores · the reserve · what stands · food put`). | `siblingDistance`'s own three tests, re-run by hand |
| A6 claim equality (`check-pair` with the longer arm suppressed) | no face adds a DURATION, COUNT, CONTRAST or RATION token its `[plain]` parent lacks, and none loses one; every face's slot set is byte-equal to its parent's (`{settlement}`), and no face carries a mark. | the five lexicons of `check-pair.mjs:67-78`, differenced face against parent |
| composed walk · `Q` × 12 · `A3` × 12 (WITHHELD 24 of 36) | **NOT MOVED — and not movable from this pool. Both are the SPINE's text.** See the two refusal rows below, with the segments the arms actually read. | the two regexes run against the three spine faces verbatim |

## WHAT EACH FACE CLAIMS, AND THE CLAUSE THAT LICENSES IT

All twelve faces assert exactly ONE claim, the same claim, with no second: that
`settlement.economicState.foodSecurity.label` holds — the food the town eats comes to it from
outside — as a STANDING fact of the record.

| clause of the card | what it licenses, in every face |
|---|---|
| `reads: settlement.economicState.foodSecurity.label (measured)` | the single fact each face states |
| `may claim: that label holds, as a STANDING fact of the record` | the present tense, unhedged, undated, ungraded; no face counts, causes, seasons or forecasts |
| `seat/form: sentence / sentence · move: PRESENT · angle: plain` | one sentence per face, present tense, a plain arrival verb or the copula; the `[plain]` mark is kept on all three variants because the card fixes the angle |
| `relation: addition` | the empty opener — no connective before the face, because the connectives leaf holds only the empty opener at this seat, and the unit is `spine + ' ' + modifier` verbatim |
| `bag: {settlement}` (FILLED at this block's call sites) | the one slot every face names. It is named in EVERY face deliberately: a modifier naming neither a slot nor a band word is the summarising beat (ARCH §8.3, arm Q), and `armQualify` reads the modifier as the unit's SECOND SENTENCE and withholds on it unless it carries a slot. The bag's `route` is unfilled here and `band` is RESERVED, so neither is used |
| `audience: player (no mark)` · `covert: no` | no `dm-only` mark on any variant; this pool's reader is the player |

Variant by variant:

- **Variant 1 — the food is the subject.** `brought in`, `comes`, `carried`, `fetched in` are
  four verbs for the one arrival. `outside the town`, `other places`, `elsewhere` name no place
  and no road: they are the label's own complement, not a GEOGRAPHY move, which would need a
  geography field this pool does not read. Face 1 is a locative inversion (`From outside the
  town comes…`) — a rhythm, not a cleft: no copula, so arm X's specificational reading is not
  in play.
- **Variant 2 — the town is the subject, and the fact is a standing dependence.** `depends on`,
  `lives on`, `is provisioned`, `keeps fed`. Nothing names a buyer, a price, a road, a season or
  a share, so no field beyond the card's one is touched.
- **Variant 3 — the stock the cell already holds is the subject.** These four PRESUPPOSE a store
  and ASSERT only where its contents come from. The presupposition is discharged by the card's
  own `attach`: this pool attaches to `Disasters & Famine: granary AND hospital` alone, where the
  spine asserts the store, so on every ground where a face can render, the store exists. No face
  asserts the granary's presence — that is a field the spine tests and the card refuses.

## REFUSALS — what could not be made lawful, and why (a refusal is a result)

1. **The `Q` finding on 12 of the 36 composed units — REFUSED, it is the spine's.** The arm
   splits on SEMICOLONS, and only the `[ledger]` spine carries one. Run verbatim, the segment
   the arm reads is `between them the town can take a failed harvest or an outbreak without
   either becoming a catastrophe` — no slot in it, no band word, so `armQualify` withholds.
   Every one of my twelve faces composes with that spine, which is where the ×12 comes from.
   Nothing a modifier can be worded as changes a clause that stands before it; the cure is a
   rewrite of the `[ledger]` spine, which is not this packet's to write. **CONFIRMED** by running
   the arm's own split and slot test on the three spine texts.
2. **The `A3` finding on 12 of the 36 composed units — REFUSED, it is the spine's.** Only the
   `[counterforce]` spine matches `CONTRAST_SHAPES`, on `rather than`. The arm then reads the
   alternative as the shape plus its tail to the next stop — `rather than in the luck` — whose
   one content word is `luck`, which no sibling pool key of DS-DEF-2 names, so the band half is
   withheld to the refuter. My faces sit in a later sentence and never enter the segment the arm
   reads. **CONFIRMED** by running `CONTRAST_SHAPES` against the three spine texts: `[ledger]`
   none, `[street]` none, `[counterforce]` `rather than`.
3. **The within-pool LENGTH SPREAD is narrower than in round 1, and this is the band's price.**
   Round 1 ran 6–12 words; round 2 runs 9–12. Clearing `shareUnder8` puts a hard floor of eight
   words under every face, and one fact at one seat has no lawful way to reach twenty without a
   second claim — padding to a spread figure is the metronome R-DA-05 exists to refuse. Reported
   as a measurement, not cured by inflation, and the two constraints that bound it are named.
4. **A citation of the record's holder** (S3's PROVENANCE move). REFUSED by the card:
   `source: (none) · standing SOURCE-UNRESOLVED · NO citation is licensed`. Zero provenance
   moves are authored in this set; `provenanceCount` should read 0 on all twelve.
5. **A count or a share** ("more than half of what it eats"). REFUSED: card `may NOT: a count`;
   A4's no-digit wall; `check-pair`'s COUNT lexicon. The reading behind the label is a percentage
   band, and a percentage is precisely what a face may not carry.
6. **A cause** ("the ground will not feed it", "the harvest fell short"). REFUSED: card
   `may NOT: a cause`; R-DA-19 admits an event move only where an event-provenance field exists,
   and this pool reads a standing label.
7. **A season or a span** ("through the winter", "year after year"). REFUSED: card
   `may NOT: a season`; every one of those words is in the DURATION lexicon and would be an A6
   addition against the parent.
8. **A contrast face** ("well fed and not self-fed"; "brought in rather than raised"). REFUSED
   twice over: wall 5 licenses a contrast only where a sibling pool key or band names the
   rejected alternative, and this pool's one sibling, `stores: short`, names a deficit and not
   local raising; and the antithesis shape scores 1.0 against a band of 0.0082–0.0401, which is
   thirty band-widths — a single contrast face would fail the depth number on its own. All
   twelve faces are therefore positive: no `rather than`, no `not X but Y`, no bare negation.
9. **Naming the granary, the sick-house, the parish, or any second store object.** REFUSED twice
   by the card: `may NOT … another civic object of the class store`, and `may NOT … any field the
   attached spine tests`. Variant 3 speaks of `the stores`, `the reserve`, `what stands in store`
   and `food put by` — the pool's own object under its own key, never a second one, never the
   building.
10. **Naming a road, a cart, a market, a trader, or a named good** (grain, salt, bread). REFUSED:
    the bag's `route` is not filled at this block's call sites, and a named good or actor is a
    particular no field holds. The `[street]` spine says "a place for grain"; a face saying
    *grain* would still be unlicensed, because the same face also renders after the two spines
    that name no good.
11. **An edge or a future** ("a cut road would empty the stores"). REFUSED: card `may NOT: a
    future`; STATE never FATE.
12. **A second fact of any kind** — the reserve's size, the road's state, what the dependence
    costs. REFUSED: card `may NOT: a second fact`; the fact budget on this cell (k ≤ 1); no face
    carries a clause seat, because `RELATION: addition` holds no `consequence.clause` joint.
13. **A cleft or an inverted copula** ("what {settlement} eats is what other places raise").
    REFUSED: arm X reads a specificational copula as entailing the ONLY value of its column, and
    no `closed` flag licenses that here. Face 1.1's inversion carries no copula and is not this
    shape.
14. **A `dm-only` face.** NOT AUTHORED: the card reads `covert: no · audience: player (no mark)`.
15. **A second level-1 GRAMMAR.** DECLARED, not concealed: of MOVE-GRAMMAR §2.1's V1–V8 only
    **V1 (PRESENT alone)** is licensable for this pool — no `none-exists` field (V3), no
    `not-held` provenance (V8), no named-object field (V4), no institution row (V5), no
    unresolved-value field (V6), no structural-consequence field (V2), no event provenance (V7).
    §3.1's rule is to write only the members the block licenses and never to write one empty, so
    the three variants vary in SUBJECT, VERB and RHYTHM inside V1 (the food · the town · the
    stock) rather than in grammar. A pool showing one grammar here is the licensing filter's own
    result, and the walker should read it as such rather than as a flat pool.

## THE THREAD (owner, ~21:4x)

The composed unit is `spine + ' ' + modifier`, so every face is written to be read as the
passage's last sentence after each of the cell's three spine faces, and each carries a noun
forward rather than changing the subject mid-passage:

- **Variant 1** picks up *food*, which the `[ledger]` spine states outright ("holds food"), the
  `[street]` spine names as grain, and the `[counterforce]` spine implies in "a failed harvest".
- **Variant 2** picks up *the town* — present in all three spines, twice by name and once as the
  slot — and turns outward on the last clause, which is the position the rule permits.
- **Variant 3** picks up the store the spine has just named ("holds food" · "a place for grain" ·
  "the two buildings") and says where it fills from. The turn outward sits last in every face.

The pairing I would report as the weakest is variant 2's second face after `[counterforce]`,
which names neither food nor a store and threads on the town and the matter of eating alone.
Reported, not hidden.
