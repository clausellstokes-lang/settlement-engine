1. `[plain]` The food eaten at {settlement} is brought into the town from other parts.
   - `[face]` Into {settlement} comes the food the town eats.
   - `[face]` Provision at {settlement} is fetched in from elsewhere.
   - `[face]` At {settlement}, food is a thing carried in.
2. `[plain]` What is eaten at {settlement} is carried to the town from outside.
   - `[face]` For what it eats, {settlement} looks to other places.
   - `[face]` Carried in, the food at {settlement} feeds the town.
   - `[face]` The town at {settlement} is kept fed from other parts.
3. `[plain]` The stores at {settlement} are filled with what arrives.
   - `[face]` Out of other places comes the food that {settlement} lays up in store.
   - `[face]` Food from other parts fills the store that {settlement} keeps.
   - `[face]` What {settlement} puts by in store is carried food.

--- NOTES

Seat: Opus 5 — Fable-unvalidated · block DS-DEF-2 · pool `stores: import-fed` · DRAFT ROUND 4 ·
3 variants · 12 faces (3 `[plain]` parents + 9 `[face]` sub-rows). The typed lines (ROLE
`modifier` · FORM `sentence` · MOVE `PRESENT` · READS
`settlement.economicState.foodSecurity.label` · RELATION `addition` · ATTACH
`Disasters & Famine: granary AND hospital`) are already in the annex and are NOT repeated
here; the rows above replace the pool's `⟦TO-AUTHOR⟧` line and nothing else. The licence card
was printed first (`node scripts/prose-licence-card.mjs DS-DEF-2 'stores: import-fed'`) and
the block's own section of `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:2568-2704` was read
for the three shipped spines this modifier composes behind.

## WORD COUNT PER FACE (whitespace tokens, a slot counted as one — `taste-measure.mjs:125`)

| variant | `[plain]` | `[face]` 1 | `[face]` 2 | `[face]` 3 |
|---|---|---|---|---|
| 1 | 13 | 8 | 8 | 8 |
| 2 | 12 | 9 | 9 | 10 |
| 3 | 9 | 13 | 10 | 9 |

n = 12 · min 8 · max 13 · mean 9.833 · sample sd **1.850** (round 3: mean 9.92, sd 1.78;
round 2: 10.25, sd 0.97). No face is under eight words, so `wordsPerSentence.shareUnder8`
stays 0 and round 2's band exceedance does not return; no face is over twenty-two, so
`shareOver30` stays 0.

## THE GATE'S THREE MEASURES, ANSWERED ONE BY ONE

| the gate's failing measure | round 4 | ground |
|---|---|---|
| composed walk · `Q` · *a trailing coordinate naming no second field*, the gate's own text now naming the SPINE clause `between them the town can take a failed harvest or an outbreak without either becoming a catastrophe.` · 12 findings (band 0) | **NOT MOVED, AND NOT MOVABLE BY ANY WORDING OF ANY MODIFIER AT THIS ATTACH. A SITTING ROW UNDER §21, NOT A DRY ROUND** — and the gate's own report has now moved from naming the finding to naming the spine as its site, which is the attribution round 3 proved. Re-proved this round from the source, independently (REFUSAL 1). | `entryWalker.js:809-848` read line by line against `RECEIPT_POOLS_DOSSIER_STATE.md:2700` |
| composed walk · `A3` · *a contrast whose rejected alternative no sibling key names*, the gate's own text now naming the SPINE phrase `rather than in the luck` · 12 findings (band 0) | **NOT MOVED, AND NOT MOVABLE BY ANY WORDING. A SITTING ROW.** Re-proved from the source (REFUSAL 2). | `composedWalker.js:521-590` walked by hand over `:2702` |
| composed walk · unit verdicts FAIL 0 · WITHHELD 24 · PASS 12 of 36 (band FAIL 0 · WITHHELD 0) | **FAIL HELD AT 0.** The 24 WITHHELD decompose exactly: 12 = the `[ledger]` spine's `Q`, 12 = the `[counterforce]` spine's `A3`, 12 PASS = the `[street]` spine. **No unit's verdict is owed to a byte this packet writes**, in round 3 or round 4, and the arithmetic is `3 spineFaces × 12 faces = 36` from `taste-measure.mjs:252-262`. | the arm-by-arm walk below |

**What round 4 therefore did, under §21.3.** An unlawful set is pushed toward the ceiling as
far as one effort allows, exactly as a lawful one is. The three measures above are the
spine's; the measures this pool owns were re-cut for the ceiling and are reported with their
numbers below. Nothing was made plainer for its own sake (§21.4).

## WHAT ROUND 4 MOVED (the ceiling, §21.1 — "the band is a licence, not a target")

| named target | round 3 | round 4 | rule |
|---|---|---|---|
| the repeated FRAME `The town at {settlement}` | **4 of 12 faces** — a template by the back door | **1 of 12** (face 2.3 only) | R-DA-05's fault-5 trap; the same shape everywhere is the machine's signature (§16 (4) SPREAD) |
| distinct CLOSING words | 10 of 12 | **11 of 12** (`parts` · `eats` · `elsewhere` · `in` · `outside` · `places` · `town` · `arrives` · `store` · `keeps` · `food`; the one repeat, `parts`, sits in two different variants) | R-DA-04 |
| CLOSE KINDS represented | three | **four** — a source phrase (`from other parts`, `from elsewhere`, `from outside`, `to other places`), a CONDITION close on the verb (`the town eats`, `carried in`, `what arrives`), an OBJECT close on a civic thing (`the town`, `in store`, `carried food`), and a STANDING-FACT close on the holding verb (`{settlement} keeps`) | R-DA-04: the KIND varies, never the position; "always end on an object" is itself a fixed move (kay:30) |
| within-pool LENGTH SPREAD | 8–13, sd 1.78 | 8–13, sd **1.850** | R-DA-05 (the ≥ 4.0 floor stays unreached and unreachable — REFUSAL 19) |
| distinct two-word OPENERS | 12 of 12 | 12 of 12, held (`the food` · `into {}` · `provision at` · `at {}` · `what is` · `for what` · `carried in` · `the town` · `the stores` · `out of` · `food from` · `what {}`) | A11 spread, `composedWalker.js:openerOfText` |
| VERB inventory over the pool | 4 arrival verbs | **9 verbs** — `brought` · `comes` · `fetched` · `carried` · `looks` · `feeds` · `kept fed` · `fills` · `lays up` / `puts by` | R-DA-22 (one term per thing) read with the card's "the WORD may recur; the FACT must not" |
| NOUN inventory for the one fact | food · town · store | food · **provision** · town · store · stores | R-DA-18 — the antique air lives in the NOUN, never in the syntax |
| faces opening on the same two words as the SPINE they follow | 1 (`The town …` behind the `[street]` spine's `The town has …`) | **0** — no face opens `The town` where the street spine already does; face 2.3 carries the frame mid-sentence | R-DA-05 `sameOpenerAsPreviousRate`, measured over the reading sequence and therefore over the composed unit |

**Reported honestly, not claimed as a sweep.** Faces carrying a LITERAL noun of all three
spines fall from 6 of 12 to **5 of 12** (1.`[plain]`, 1.1, 2.`[plain]`, 2.2, 2.3). That count
is a metric this seat invented in round 3, not a rule: §1.4.1's wall is satisfied by all 12
either way, because the composer seats this modifier LAST in every one of the 36 units and
the wall's second limb — the change of subject as the passage's one turn outward, placed last
— is exactly this modifier's position. The one face that lost the count is 1.3, `At
{settlement}, food is a thing carried in.`, which was NOT padded back to `the town's food`
because §21.4 forbids trading a dense lawful line for a plainer one with no law behind the
change. Sibling distance: the nearest pair in the pool is 2.2 / 2.3 at ≈ 2,222 bp of content
overlap (`food`, `town` shared of a nine-word union); every other pair is under 1,500 bp, and
`composedWalker.js:617` reports only an exact match at 10,000 bp, so the pool is far clear of
the arm and the number is given because §21.1 names sibling distance as a target, not because
anything is near the floor.

## WHAT EACH FACE CLAIMS, AND THE CARD CLAUSE THAT LICENSES IT

All twelve faces assert exactly ONE claim, the same claim, with no second: that
`settlement.economicState.foodSecurity.label` holds — the food the town eats reaches it from
outside — as a STANDING fact of the record.

| clause of the licence card | what it licenses, in every face |
|---|---|
| `reads: settlement.economicState.foodSecurity.label (measured)` | the single fact each face states, and the only one |
| `may claim: that label holds, as a STANDING fact of the record` | the present tense throughout, unhedged, undated, ungraded; no face counts, causes, seasons, forecasts or takes a standpoint |
| `seat/form: sentence / sentence · move: PRESENT · angle: plain` | one sentence per face, capital-initial, terminal stop, present tense, a plain arrival or filling verb; all three variants keep the `[plain]` mark because the card fixes the angle |
| `relation: addition` | the empty opener: at this seat the connectives list holds only the empty opener, so the composed unit is `spine + ' ' + face` verbatim (`taste-measure.mjs:260`), and no face carries a joint of its own |
| `bag: {band: RESERVED, route: proper, settlement: proper}` · FILLED `{settlement}` | `{settlement}` is the only slot any face names, exactly once, and never as the opening token — arm D fails a slot the composer never fills, and A9 fails a sentence face that opens on a `proper`-typed slot |
| `audience: player (no mark)` · `covert: no` | no `dm-only` mark on any variant or face; the covert twin is not authored |
| `source: (none) · standing SOURCE-UNRESOLVED · NO citation is licensed` | zero PROVENANCE moves: `provenanceCount` reads 0 on all twelve, so `armA13` emits nothing but its count |

**Variant 1 — the food is the subject, and the fact is that it arrives.** Four verbs for the
one arrival (`is brought`, `comes`, `is fetched`, `carried`) across four rhythms:
subject-first passive, locative inversion, a short flat declarative, a fronted locative with
a copular predicate. `other parts`, `elsewhere`, `outside`, `into the town` are the label's
own complement; they name no place, no road and no distance, so none is a GEOGRAPHY move.
`Provision` is the antique-air noun R-DA-18 licenses — a noun, never a syntax.

**Variant 2 — the town is the subject, and the fact is a standing dependence.** `is carried
to`, `looks to`, `feeds`, `is kept fed`. Nothing names a buyer, a price, a road, a carrier, a
season or a share. Face 2.2 fronts a participle (`Carried in, …`), face 2.1 fronts a purpose
phrase (`For what it eats, …`); those two carry the pool's rhythmic range and are its only
two comma-bearing faces.

**Variant 3 — what the town has laid by is the subject, and the fact is where its contents
came in from.** These four PRESUPPOSE a store and ASSERT only the origin of what fills it.
The presupposition is discharged by the card's own `attach`: this pool attaches to `Disasters
& Famine: granary AND hospital` alone, where the spine asserts the store, so on every ground
where a face can render, the store exists. No face asserts the granary, the sick-house or any
second civic object. The verb `fills` / `lays up` / `puts by` is used and `hold` is
deliberately NOT: the `[ledger]` spine already reads "{settlement} holds food against a bad
year", and a modifier saying "holds food" behind it restates the spine's own fact.

## HOW EVERY ARM WAS KEPT GREEN (the twelve faces, walked by hand against the shipped instruments)

- **`armQualify` second-sentence limb (`entryWalker.js:836`).** Every composed unit splits into
  `[spine, face]` at the spine's terminal stop, so the face IS `raw[1]`. Every face names
  `{settlement}`, so `[...text.matchAll(SLOT_RE)].length` is non-zero and the arm returns before
  it withholds — on all 36 units. A face without a slot would ADD 36 findings; that is why no
  face is written with a bare deictic.
- **`armQualify` coordinate limb (`:845`).** No face carries a semicolon, so
  `sentence.split(/\s*;\s*/)` returns one part for every modifier and the loop never enters.
- **`armA3` (`composedWalker.js:521`).** No face matches `CONTRAST_SHAPES`
  (`entryLexicons.js:304`) — no `rather than`, no `not X, but Y`, no `, not x`, no `less X
  than`, no `never … so much as`, no trailing `and/or not …`.
- **`armA9` (`:691`).** Every face opens on a capital that is not a slot and ends on a period.
- **`armA1` (`:363`).** No face carries a `BAND_PHRASES` member (`entryLexicons.js:33`), so
  `typedFactsOf(...).bands` is empty on every modifier piece and neither a restatement nor a
  conflict can be emitted across the join.
- **`armA13` (`:830`).** `classifyMoves` returns no `PROVENANCE` on any face — no `the …
  books/roll/register`, no `the elders say`, no `according to`, no `from the road`.
- **`armA5` / `check-pair` A6.** Each face's slot set (`{settlement}`) and mark set (empty) are
  byte-equal to its parent's, and no face adds or loses a token of the DURATION, COUNT,
  CONTRAST or RATION lexicons — none of the twelve carries any member of any of the four.
- **`armC4`.** No `QUANTIFIERS` member (`entryLexicons.js:93`: `every`, `all`, `each`, `only`,
  `none`, `everyone`, `everybody`, `everything`, `any`, `no`, `whole`, `entire`, …), so no
  totality is asserted over an open column; no `will` or `shall`, so no bare future.
- **`armC3`.** No `was`/`were`/`had`/`once`/`formerly`/`no longer`, so the semantic half never
  withholds; no member of `SUPPLY_CLAIM_LEXICONS` (`:187`) — no `upriver`, `overland`, `by
  road`, `by river`, `by sea`, and no `salted`, `milled`, `dried`, `pressed` — so neither the
  route nor the processing half fires.
- **`armExhaustivity` / `SPECIFICATIONAL_COPULA` (`:332`).** No face carries `is what` / `are
  what` / `is who` / `is the only` / `is the one`, and no face has the shape `The <lowercase> …
  is the <lowercase>` — no face contains `is the` or `are the` at all.
- **`armC2`.** No `OFFICE_NOUN_CANDIDATES` member and no duty predicate; the faces name no
  office, count or exemption.
- **The banded metrics.** No face carries a semicolon, colon, em dash, question mark,
  exclamation, parenthesis, quotation mark, digit, percent, `-ly` adverb, `, which` tail,
  `X-ed and Y-ed` pair, triad, `There is` / `It is` opener or `-ing` opening word; **no face
  ends on `{settlement}`** (the closer reader strips the braces and `settlement` ends in
  `-ment`, the abstract-suffix metric — round 2's 8.6-band-width finding), and no face ends on
  a pronoun.

## THE THREAD (§1.4.1), FACE BY FACE

The three spines this modifier composes behind hold these nouns —
`[ledger]` {settlement}, food, year, sick, town, harvest, outbreak, catastrophe ·
`[street]` town, place, grain, ill, both, worth ·
`[counterforce]` harvest, outbreak, catastrophe, {settlement}, reason, buildings, luck.
**No single noun is literal in all three** (`town` is absent from the counterforce spine,
`{settlement}` from the street spine), so the widest available thread is a face carrying both
`the town` and `{settlement}`.

| face | noun carried forward | threads literally |
|---|---|---|
| 1.`[plain]` | food · town · {settlement} | all three |
| 1.1 | food · town · {settlement} | all three |
| 1.2 | {settlement} | ledger, counterforce (street: the turn outward, last) |
| 1.3 | food · {settlement} | ledger, counterforce (street: the turn outward, last) |
| 2.`[plain]` | town · {settlement} | all three |
| 2.1 | {settlement} | ledger, counterforce (street: the turn outward, last) |
| 2.2 | food · town · {settlement} | all three |
| 2.3 | town · {settlement} | all three |
| 3.`[plain]` | {settlement} · stores | ledger, counterforce (street: `stores` answers "a place for grain") |
| 3.1 | food · {settlement} · places | ledger, counterforce (street: `places` answers `place`) |
| 3.2 | food · {settlement} · store | ledger, counterforce (street: `store` answers "a place for grain") |
| 3.3 | food · {settlement} · store | ledger, counterforce |

Five of twelve carry a literal noun from every spine; the other seven take §1.4.1's second
limb without strain, because the passage's one turn outward — from what the town has laid by
to where it came in from — is exactly the shift this modifier makes, and the composer always
seats it last.

## REFUSALS — what could not be made lawful, and why (a refusal is a result)

1. **The `Q` finding on 12 of 36 units — REFUSED. CONFIRMED by reading the arm a second time,
   from the source, this round.** `armQualify` splits the composed unit into sentences at
   `/(?<=[.?!])\s+(?=[A-Z"'(])/`, then splits EACH sentence on semicolons and considers every
   part after the first. The `[ledger]` spine is ONE sentence carrying ONE semicolon, so its
   second part is considered alone: `between them the town can take a failed harvest or an
   outbreak without either becoming a catastrophe.` It names no slot and holds no
   `BAND_PHRASES` reading, so `consider` withholds — once per unit, twelve units. **The
   modifier is a different element of `raw` and cannot enter that segment**, for a reason that
   is itself a law: the composed text is `${spineFace} ${face}` (`taste-measure.mjs:260`), so a
   face could only be swallowed into the spine's sentence by opening lower-case or on
   `{settlement}` — and `armA9` FAILS a sentence-seat modifier on both (`:691-750`), as does
   the annex's seam contract (ARCH §2.5). Every escape is a wall. **THE MINIMAL SPINE CURE, for
   the chair, not for this packet:** the ledger spine's post-semicolon clause must carry the
   slot — `…; between them {settlement} can take a failed harvest or an outbreak without either
   becoming a catastrophe.` Replacing the semicolon with a full stop does NOT cure it: the
   clause then becomes `raw[1]` and the second-sentence limb withholds on the same words.
2. **The `A3` finding on 12 of 36 units — REFUSED. CONFIRMED by walking the arm from the
   source.** Only the `[counterforce]` spine matches `CONTRAST_SHAPES`, on `rather than`. The
   arm takes `tail = body.slice(at, at + phrase.length + 60)` and cuts it at the first `.`, `;`
   or `,` — the period after `luck`. The alternative is therefore exactly `rather than in the
   luck`, whose only content word of four letters or more outside `ALTERNATIVE_STOP` is
   **`luck`**, and no pool key of DS-DEF-2 names `luck`, so the band half is withheld to the
   refuter. The modifier's first character sits beyond that stop and is never read; and the
   `named` set the arm matches against is built from SIBLING POOL KEYS, not from any face's
   text, so no wording can supply the hit. **THE MINIMAL SPINE CURE:** drop the contrast
   (`…and the reason is in the two buildings.`), or make the rejected alternative name a word a
   sibling pool key holds.
3. **THE CROSS-CHECK that decides refusals 1 and 2 without trusting this seat, in one command.**
   Both findings are properties of the spine pool alone, so the sibling packet
   `def2-stores-short` — a different modifier, different words, the same `ATTACH` — must show
   the same shape: `Q` 12, `A3` 12, WITHHELD 24 of 36, PASS 12. If it does not, this refusal is
   wrong and I want to be told so. If it does, the row belongs to `Disasters & Famine: granary
   AND hospital` and the two modifier pools are being charged for it twice.
4. **A citation of the record's holder** (S3 / MOVE-GRAMMAR §4.4.3's PROVENANCE move). REFUSED
   by the card: `source: (none) · standing SOURCE-UNRESOLVED · NO citation is licensed`; arm
   A13 would withhold a holder the census does not license. Zero provenance moves authored.
5. **A count, a share or a magnitude** ("more than half of what it eats"). REFUSED: card `may
   NOT: a count`; A4's no-digit wall; `check-pair`'s COUNT lexicon; and the reading behind the
   label is a band, which is precisely what a face may not carry.
6. **A cause** ("the ground will not feed it", "the harvest falls short"). REFUSED: card `may
   NOT: a cause`; R-DA-19 admits an event move only where an event-provenance field exists, and
   this pool reads a standing label.
7. **A season or a span** ("through the winter", "year after year", "already"). REFUSED: card
   `may NOT: a season`; every one of those is in `check-pair`'s DURATION lexicon and would be an
   A6 addition against the parent. This is why no face names a `year`, though both the ledger
   spine and the pool's own subject invite one.
8. **A contrast face** ("brought in rather than raised"; "carried, not sown"). REFUSED three
   times: wall 5 licenses a contrast only where a sibling pool key or band names the rejected
   alternative, and this pool's nearest sibling, `stores: short`, names a deficit and not local
   raising; the antithesis shape scores 1.0 against an exemplar band of 0.0082–0.0401; and a
   modifier contrast would ADD an `A3` finding to a pool already carrying twelve it did not
   cause.
9. **The negative half of the label** ("food the town does not raise"; "nothing here is
   grown"). REFUSED: the card licenses "that `label` holds", and the label holds that the food
   comes in — that the town raises NONE of it is an inference the field does not carry. It
   would also be a LACK move, which R-DA-02 licenses only on a `none-exists` field, and
   `nothing` / `no` would engage `QUANTIFIERS` and `armC4`.
10. **"food that other places raise" / "what other parishes grow" / "what other parts send".**
    REFUSED: whether the exporting place raised the food, and whether it acted to send it, are
    facts no field holds; `parishes` is an institution claim under R-DA-15. Every face's
    outside is a SOURCE, never an agent — which is why `looks to other places` (a dependence)
    is written and `other places send it` (an act) is not.
11. **"the people at {settlement} eat what is carried in".** REFUSED, and NEW this round: `the
    people` is a totality over persons, which the card's REFUSED COLUMNS bar always. The civic
    actor in every face is `the town`, which is the register's own subject and the shipped
    spines' (`the town can take a failed harvest`, `the town has a place for grain`).
12. **Naming the granary, the sick-house, a warehouse, a barn or any second store object.**
    REFUSED twice by the card: `may NOT … another civic object of the class store`, and `may
    NOT … any field the attached spine tests`. Variant 3 speaks of `the stores`, `the store`,
    `in store` and `what {settlement} puts by` — the pool's own object under its own key, the
    contents and the holding, never a second building.
13. **Naming a road, a cart, a market, a carrier, a gate or a wall, or a named good** (grain,
    bread, salt). REFUSED: the bag's `route` is not filled at this block's call sites; a mode of
    carriage is a route claim (`by road`, `by river` are in `SUPPLY_CLAIM_LEXICONS` by name, and
    `by carriage` is the same class); `gate` and `wall` are objects the block's own walls
    predicate tests; and a named good is a particular no field holds — the `[street]` spine says
    "a place for grain", but the same face also renders behind two spines that name no good.
14. **An edge or a future** ("a cut road would empty the stores"). REFUSED: card `may NOT: a
    future`; STATE never FATE; `armC4`'s bare-future arm.
15. **A second fact of any kind** — the reserve's size, the road's state, what the dependence
    costs. REFUSED: card `may NOT: a second fact`; and `RELATION: addition` seats no
    `consequence` clause, so amendment S2's clause seat is not open to this pool even though S2
    is signed (SITTING §N).
16. **A cleft or an inverted copula** ("what {settlement} eats is what other places raise";
    "carried food is what the stores hold"). REFUSED: `armExhaustivity` reads a specificational
    copula as entailing the ONLY value of its column, and no `closed` flag licenses that here.
    Faces 1.1 and 3.1 are locative inversions carrying no copula and are not this shape. This
    refusal cost the pool two otherwise strong lines this round.
17. **A `dm-only` face.** NOT AUTHORED: the card reads `covert: no · audience: player (no
    mark)`.
18. **A second level-1 GRAMMAR.** DECLARED, not concealed: of MOVE-GRAMMAR §2.1's V1–V8 only
    **V1 (PRESENT alone)** is licensable here — no `none-exists` field (V3), no `not-held`
    provenance (V8), no named-object field (V4), no institution row (V5), no unresolved-value
    field (V6), no structural-consequence field (V2), no event provenance (V7). §3.1's rule is
    to write only the members the block licenses and never to write one empty, so the three
    variants vary in SUBJECT, VERB, LENGTH and RHYTHM inside V1 (the food · the town · what is
    put by) rather than in grammar. A pool showing one grammar here is the licensing filter's
    own result and should be read as such, never as a flat pool.
19. **The within-pool sd floor of R-DA-05 (≥ 4.0 words).** NOT REACHED, at 1.850, and not
    reachable: one fact at one seat with an eight-word floor and a plain angle has no lawful
    way to a twenty-word face without a second claim, and padding to a spread figure is the
    metronome R-DA-05 exists to refuse (a threshold hit exactly IS the fault, kay:44). Round 4
    moved it from 1.78 to 1.850 by lengthening two faces with content — `lays up in store`, `is
    brought into the town` — and by refusing to lengthen a third with `that is`.
20. **The `ATTACH` class collision** — `Disasters & Famine: granary AND hospital` and `stores:
    import-fed` name the same civic object class `store` (T-F12), which the shipped projector
    refuses structurally and `--taste` waives. Not curable from the wording: it is a property of
    the two KEYS, and the cure is a chair act on the attach set or on the object-class list the
    census emits. Carried unchanged from rounds 2 and 3, and named here so it is not read as an
    authoring fault.
