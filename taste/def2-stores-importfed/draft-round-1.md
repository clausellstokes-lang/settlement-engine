1. `[plain]` Food comes into {settlement} from outside.
   - `[face]` The food eaten at {settlement} is brought in from elsewhere.
   - `[face]` What {settlement} eats reaches it from beyond the town.
   - `[face]` The stock of food at {settlement} is drawn in from other places.
2. `[plain]` For its food {settlement} depends on what comes in from outside.
   - `[face]` The town lives on what is carried into {settlement}.
   - `[face]` In the matter of food, {settlement} is provisioned from outside the town.
   - `[face]` The feeding of {settlement} comes from elsewhere.
3. `[plain]` The stores at {settlement} fill from outside the town.
   - `[face]` The reserve at {settlement} is laid in from elsewhere.
   - `[face]` What stands in store at {settlement} comes from beyond the town.
   - `[face]` Food put by at {settlement} is carried in from other places.

--- NOTES

Seat: Opus 5 — Fable-unvalidated · block DS-DEF-2 · pool `stores: import-fed` · draft round 1 · 3 variants · 12 faces.
The typed lines already in the annex (ROLE modifier · FORM sentence · MOVE PRESENT · READS
`settlement.economicState.foodSecurity.label` · RELATION addition · ATTACH `Disasters & Famine: granary AND hospital`)
are NOT repeated here; the rows above replace the pool's single `⟦TO-AUTHOR⟧` line and nothing else.
The licence card was printed first: `node scripts/prose-licence-card.mjs DS-DEF-2 'stores: import-fed'`.

## THE CLAIM EVERY FACE MAKES, AND WHAT LICENSES IT

Every one of the twelve faces asserts exactly ONE typed claim, the same claim, with no second:
that `settlement.economicState.foodSecurity.label` holds `Import-Dependent` — the food the town eats
comes to it from outside — as a STANDING fact of the record.

| clause of the card | what it licenses in every face |
|---|---|
| `reads: settlement.economicState.foodSecurity.label (measured)` | the single fact each face states |
| `may claim: that label holds, as a STANDING fact of the record` | the present, unhedged, unqualified assertion; no face grades, hedges or dates it |
| `seat/form: sentence / sentence · move: PRESENT · angle: plain` | one sentence, present tense, the copula or a plain arrival verb; the `[plain]` mark kept on all three variants because the card fixes the angle — no new angle is minted here |
| `relation: addition` | the empty opener: each face is written to be read as the unit's second sentence with no connective before it, after any of the three spine faces |
| `bag: {settlement}` FILLED at this block's call sites | the one slot every face names — and it is the reason every face names it: a modifier whose surface names neither a slot nor a band word is the summarising beat (ARCH §8.3, arm Q / S14). The bag's `route` is `proper` but unfilled at these call sites and `band` is RESERVED, so neither is used |
| `audience: player (no mark)` · `covert: no` | no `dm-only` mark on any variant; the covert twin belongs to another pool |

Face by face, the additional wording-level licence:

- **1 `[plain]` / 1a / 1b / 1c** — the subject is the food itself; the arrival verb (`comes into`, `is brought in`, `reaches`, `is drawn in`) states the label and nothing more. `other places` and `beyond the town` name no place and no route: they are the label's own complement, not a GEOGRAPHY move (which would need a geography field this pool does not read).
- **2 `[plain]` / 2a / 2b / 2c** — the subject is the town; `depends on`, `lives on`, `is provisioned`, `the feeding of` are four renderings of the same standing dependence. Nothing here names a buyer, a price, a road or a season, so no field beyond the card's one is touched.
- **3 `[plain]` / 3a / 3b / 3c** — the subject is the stock the row's cell already holds. These four PRESUPPOSE a store and ASSERT only where its contents come from. The presupposition is discharged by the card's own `attach`: this pool attaches to `Disasters & Famine: granary AND hospital` alone, where the spine asserts the granary; so on every ground where a face can render, the store exists. No face claims the granary's presence, which is a field the spine tests and the card refuses.

Mechanical checks I ran by hand on the twelve faces (the harness re-measures them):
words per face 6 · 10 · 9 · 12 | 11 · 9 · 12 · 7 | 9 · 9 · 11 · 11 (mean 9.67, sd 1.79, min 6, max 12);
all twelve openers distinct under A11's first-two-words rule with the slot normalised;
no face opens on `{settlement}` (T-F8); no face closes on a pronoun (R-DA-04's pronoun-closer ceiling);
no semicolon in any face, so arm Q reads no trailing coordinate; no em dash, no digit, no percent,
no exclamation, no question, no `which`-clause, no existential opener; no member of check-pair's
DURATION, COUNT, CONTRAST or RATION lexicons appears in any face, so arm A6's claim-equality half
gains nothing a parent lacks; each face's slot set is byte-equal to its parent's ({settlement}).

THE THREAD. The composed unit is `spine + ' ' + modifier` verbatim (addition, empty opener), so every
face is written to be read as the passage's last sentence after each of the cell's three spine faces.
Variant 1 carries the spine's own noun *food* forward (spine 1 "holds food", spine 2 "a place for grain");
variant 2 carries *the town* forward (present in all three spines); variant 3 carries the store the spine
has just named (spine 1 "holds food", spine 2 "a place for grain", spine 3 "the two buildings") and turns
it outward — where its contents come from — in the last position, which is where the rule permits the turn.
The weakest pairing I can see is variant 2's shortest face after spine 3 (`counterforce`), which names
neither food nor a store: it threads on `{settlement}` and the matter of eating alone. Reported, not hidden.

## REFUSALS — what could not be made lawful, and why (a refusal is a result)

1. **A citation of the record's holder** (S3's PROVENANCE move: "the count is the granary's own"). REFUSED by the
   card: `source: (none) · standing SOURCE-UNRESOLVED · NO citation is licensed: a face naming a record holder
   here is refused by arm A13`. Zero provenance moves are authored in this set.
2. **A share or a count** ("above a seventh of what it eats", "the greater part"). REFUSED: card `may NOT: a count`;
   A4's no-digit wall; the totality and magnitude lexicons. The label's own reading behind the badge is a percentage
   band, and a percentage is exactly what a face may not carry.
3. **A cause** ("the ground will not feed it", "the harvest fell short"). REFUSED: card `may NOT: a cause`; R-DA-19
   admits an event move only where an event-provenance field exists, and this pool reads a standing label.
4. **A season or a span** ("through the winter", "every year the same"). REFUSED: card `may NOT: a season`; the
   DURATION lexicon; R-DA-16's time bands are anchored by a field this pool does not read.
5. **A contrast face** — the shape the shipped DS-GEN-3 spine uses for this very label ("well fed and not self-fed";
   "does not grow what it eats"). REFUSED here: R-DA-02 keeps a contrast only where the rejected alternative names a
   SIBLING POOL KEY or a sibling band, and this pool's one sibling is `stores: short`, which names a deficit and not
   local raising; the CONTRAST and RATION arms count the shape. Every face is therefore written positively, and
   `rather than`, `not X but Y` and the bare negation are absent from all twelve. This is the single largest
   difference between what this modifier may say and what the general desk's spine already says.
6. **Naming the granary, the sick-house, the parish or any second store object.** REFUSED twice by the card:
   `may NOT ... another civic object of the class store` and `may NOT ... any field the attached spine tests
   (disasterRowSituation(granary, hospital, church))`. Variant 3 speaks of *the stores*, *the reserve*, *what stands
   in store* and *food put by* — the pool's own object under its own key, never a second one, never the building.
7. **Naming a road, a cart, a market, a trader or a named good** (grain, salt, bread). REFUSED: the bag's `route` is
   not filled at this block's call sites, and a named good or actor is a particular no field holds (R-DA-10's
   hollow-specificity fault; the office roster behind C2). Note that the spine's `street` face says "a place for
   grain"; a modifier face saying *grain* would still be unlicensed, because it would also render after the two
   spine faces that name no good.
8. **An edge or a future** ("a cut route would empty it"). REFUSED: card `may NOT: a future`; STATE never FATE (A2).
   The compendium ladder's "a cut trade route turns it into a crisis" is a reading of the band, not a claim this
   pool's field licenses.
9. **A second fact of any kind** — the reserve's size, the route's state, what the dependence costs. REFUSED: card
   `may NOT: a second fact`; the fact budget on this cell (`k ≤ 1`, ARCH §6.4); wall 6 (never a third sentence,
   never a which-tail). No face carries a clause seat: `RELATION: addition` holds no `consequence.clause` joint.
10. **A cleft or inverted copula** ("what {settlement} eats is what other places raise"). REFUSED: arm X reads a
    specificational copula as entailing the ONLY value of its column, which no `closed` flag here licenses.
11. **A `dm-only` face.** NOT AUTHORED: the card reads `covert: no · audience: player (no mark)`.
12. **A second and third level-1 GRAMMAR.** DECLARED, not concealed: of MOVE-GRAMMAR §2.1's V1–V8 only **V1
    (PRESENT alone)** is licensable for this pool — the block holds, for this read, no `none-exists` field (V3),
    no `not-held` provenance field (V8), no named-object field (V4), no institution row (V5), no unresolved-value
    field (V6), no structural-consequence field (V2) and no event provenance (V7). §3.1's rule is to write only the
    members the block licenses and never to write a member empty, so the three variants vary in SUBJECT, VERB and
    RHYTHM inside V1 (the food · the town · the stock) rather than in grammar. A pool of three showing one grammar
    is the licensing filter's own result here, and the walker should read it as such rather than as a flat pool.

## TWO THINGS THE SITTING SHOULD SEE

- **The within-pool length spread is below R-DA-05's register floor.** The three `[plain]` lines run 6 · 11 · 9 words
  (sd 2.06) against that rule's within-pool floor of 4.0, which was cut on R1's 708 spine pools. One fact at one seat
  carries one load; padding a face to reach a spread figure is the metronome the rule exists to refuse (fault 5, and
  the density law of Part B §21.4). Reported as a measurement, not cured by inflation. Across all twelve faces the
  spread is 6–12 words, sd 1.79.
- **The standing ATTACH refusal is the mechanics', not the wording's.** The projector refuses this ATTACH by name
  (T-F12: the spine's key and the modifier's key name the same civic object class `store`) and the taste runs it
  only under `--taste`. Nothing in this wording set lifts that refusal, and no face was written to argue with it.
