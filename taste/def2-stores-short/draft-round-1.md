1. `[plain]` Less food comes to hand at {settlement} than the town eats.
   - `[face]` A shortfall stands at {settlement} between what the town gathers in and what it eats.
   - `[face]` Neither what {settlement} raises nor what it brings in comes up to the need.
   - `[face]` Set against what it eats, the food {settlement} has is short.
2. `[plain]` The provision at {settlement} does not answer the town's own requirement.
   - `[face]` For food, {settlement} stands under its own need.
   - `[face]` What the town must have, {settlement} does not come by.
   - `[face]` Enough food is beyond the reach of {settlement} as things stand.
3. `[plain]` Feeding itself is beyond {settlement} as the town now stands.
   - `[face]` The town does not feed itself out of what {settlement} can raise and take in.
   - `[face]` Short of what it eats is how {settlement} stands.
   - `[face]` Whatever {settlement} can find, the town still comes up short.

--- NOTES

**The card this set was written against** (read at the dock by `node scripts/prose-licence-card.mjs DS-DEF-2 'stores: short'`): role `modifier` · reads `settlement.economicState.foodSecurity.label` (measured) · bag `{band: RESERVED, route: proper, settlement: proper}`, FILLED `{settlement}` · relation `addition` · seat/form `sentence / sentence` · move `PRESENT` · angle `plain` · attach `Disasters & Famine: granary AND hospital` (narrowed by hand) · covert `no` · audience `player (no mark)` · source `(none) · SOURCE-UNRESOLVED` · may claim: **that `label` holds, as a STANDING fact of the record**.

**The predicate, grounded.** The block's own key-function branch is not recovered by the card, so the class was read off the producing leaf (`src/generators/foodGenerator.js:339-359`): the label set is `Deficit — Active Famine` · `Deficit` · `Import-Dependent` · `Pressured` · `Surplus` · `Secure`, and the sibling pool `stores: import-fed` takes `Import-Dependent`. So `stores: short` is the `Deficit` pair, and `deficit` at `:329` is `max(0, rawDeficit − importCoverage − magicOffset)` — **net of imports and of the magic offset** (CONFIRMED by reading the file). Every face therefore asserts the NET shortfall (what the town raises plus what it brings in, together, under what it eats) and never the weaker local-only shortfall: a face asserting only local insufficiency would carry a different typed claim from its siblings and break the face contract (arm C, MOVE-GRAMMAR §3.4).

**Why every face carries `{settlement}`.** ARCH §8.3: *a modifier whose surface names neither a slot nor a band word is not licensed — it is the summarising beat (arm Q; S14).* `band` is RESERVED in this bag and `route` is unfilled, so the only lawful naming is `{settlement}`, and it is carried by all twelve faces so the slot set is identical within each variant (T-F8). No face opens on it: a sentence face opening on a `proper`-typed slot is refused by the same table.

**The three semantic variants.** All three carry the one licensed claim (arm C forbids a claim difference inside a pool) and differ in construction, not in assertion: **1** compares the two quantities as flows (what comes to hand against what is eaten); **2** states the provision against the town's requirement as a nominal measure; **3** states the town's own feeding as a standing incapacity. Close kinds vary across the set (a condition · an object · a measurement in words); no face closes on a pronoun (R-DA-04's `closers.pronounRate`).

**Per face — the clause that licenses each claim**

*Variant 1 — the balance.*
- `[plain]` *Less food comes to hand at {settlement} than the town eats.* — the shortfall: `may claim: that label holds, as a STANDING fact`; the town named: `bag {settlement}` (FILLED). "comes to hand" was chosen over "comes into" so the sentence covers what is grown as well as what is brought in — the net class, per `foodGenerator.js:329`.
- `[face]` *A shortfall stands at {settlement} between what the town gathers in and what it eats.* — same single claim; "gathers in" is the union of the label's own sources. `stands` is stative, not an intent verb on an inanimate (R-DA-11's third class); this is the nearest figure risk in the set and is named here for the refuter.
- `[face]` *Neither what {settlement} raises nor what it brings in comes up to the need.* — the correlative names the label's two arithmetic sources and asserts only their sum against need; it is not a CAUSE move (no `causes[]` field is read) and stays true where the import rate is zero (`importCoverageRate` = 0 on route `none`, `:300-317`).
- `[face]` *Set against what it eats, the food {settlement} has is short.* — a comparison written as a measurement in words, the form R-DA-11 licenses in place of a figure.

*Variant 2 — the provision against the requirement.*
- `[plain]` *The provision at {settlement} does not answer the town's own requirement.* — the antique air sits in the noun (`provision`), never in the syntax (R-DA-18).
- `[face]` *For food, {settlement} stands under its own need.* — the short line, licensed by the register card ("Run long or short as the load demands. The short line exists.").
- `[face]` *What the town must have, {settlement} does not come by.* — a fronted object; "must have" is a need, not a want or a motive (R-DA-14 bars the interior).
- `[face]` *Enough food is beyond the reach of {settlement} as things stand.* — "as things stand" marks the STANDING grain the card licenses and blocks a reading as an event.

*Variant 3 — the town's own feeding.*
- `[plain]` *Feeding itself is beyond {settlement} as the town now stands.* — gerund subject; present, no future indicative (R-DA-07, A2).
- `[face]` *The town does not feed itself out of what {settlement} can raise and take in.* — "raise and take in" is again the net pair; no count, no cause.
- `[face]` *Short of what it eats is how {settlement} stands.* — a fronted predicate; the state, never the fate.
- `[face]` *Whatever {settlement} can find, the town still comes up short.* — concessive fronting; the concession is over the label's own sources, not over an unheld fact.

**THE THREAD (owner, ~21:4x).** Every face carries a noun forward from the spine set it attaches to — `the town`, `food`, `{settlement}`, `eats` all appear in the three shipped `granary AND hospital` variants — so no face changes subject without handing something back, and none needs to be the passage's turn outward. Each was read after all three spines and after a foreign modifier; the re-anchoring on `{settlement}` is what makes it safe in any position, since the composer, not the writer, chooses the place.

**Refusals — no face was refused; four WORDINGS were, and three findings are carried up**

1. **REFUSED wording: any face naming the stores, the store, the reserve or the loft.** The pool KEY is `stores: short`, but the card's `reads` is `foodSecurity.label` and its `may claim` is that the *label* holds. A stockpile level is a different field (`foodSecurity.storage` / `stockpile`, read at `EngineSections.jsx:76`), and the card's `may NOT` bars *another civic object of the class `store`* and *any field the attached spine tests* — the spine's branch is `disasterRowSituation(granary, hospital, church)`, so the granary is the spine's. The set therefore says nothing about a store, a granary or a quantity held. **The key string is data; it licensed nothing.**
2. **REFUSED wording: "hunger", "famine", "a hungry year", "short commons".** The class is `{Deficit, Deficit — Active Famine}` and a face must be true of BOTH; `Deficit` alone carries no famine, so a famine word would assert an event the field does not hold on most towns in the class, and famine is an event class the modifier's `MOVE: PRESENT` cannot take in any case.
3. **REFUSED wording: any seasonal or dated frame ("each winter", "by the spring", "year on year").** The card's `may NOT` names a season outright; "year on year" additionally asserts a rate.
4. **REFUSED wording: any face naming a keeper ("the tally the reeve keeps", "by the town's own count").** `source: (none) · standing SOURCE-UNRESOLVED` — the card states plainly that **NO citation is licensed** and that arm A13 refuses a face naming a record holder here. The provenance move (MOVE-GRAMMAR §4.4.3) is out of budget for this pool until the holder census (SEAM car 5b) resolves it, and REGISTER-CARD amendment S3 is therefore unreachable from this pool in round 1.

**Findings carried up (not refusals of a face)**
- **F1 — the sentence band for a modifier is UNPINNED in the documents read.** ARCH §6.1 pins `FRAGMENT length ≤ 12 words (ESTIMATE; measured at car 6)` and the unit's `≤ 2 sentences / ≤ 3 facts`, but no word band for `FORM: sentence` at the modifier grain; R-DA-05/R-DA-06's figures (`wordsPerSentence.sd ≥ 8.5`, `> 30 words ≤ 0.340`, `< 8 words ≥ 0.030`) are measured on the REGISTER, over whole variants, and cannot be read onto a twelve-face add-on pool. This set was written to a declared working band of **8 to 16 words, interior 10 to 14**, taken from the load a one-sentence addition can carry beside a spine that already runs 20 to 30 words. Measured: 11 · 15 · 14 · 11 / 11 · 8 · 10 · 11 / 10 · 15 · 9 · 10 (mean 11.25, min 8, max 15). **A chair row: the modifier sentence band wants a number at car 6.**
- **F2 — the ATTACH may sit closer to the modifier's own field than the refusal rule can see.** ARCH §2.5 refuses an `ATTACH` on *a spine whose branch `tests` the modifier's field*. This spine's BRANCH tests `granary/hospital/church` and passes that rule, but the row's BADGE is scored at `DefenseTab.jsx:185` as `scores.disaster ?? r.economicState?.foodSecurity?.resilienceScore ?? …` — a **sibling field of the same root** as this pool's `label`. The card's own echo line warns of exactly this coarseness ("a mount counted there may be reading a sibling field of the same root"). The attach is lawful as written; whether a badge read counts as a `tests` for the refusal is a chair question, and it is the one place this pool could be a fact said twice on one row.
- **F3 — the spine and the modifier are true together, and read as a tension.** The `granary AND hospital` spine says the town holds food against a bad year; this modifier says the food balance is short. Both are licensed, from different fields, and `relation: addition` is the claim-free floor the card assigns because no RELATION TABLE row joins them (§4.5). The faces were written so the addition lands on the FLOW (what comes to hand against what is eaten) and never on the HOLDING, which is the spine's — but a refuter reading the composed unit will feel the join, and the honest disposition is that this is a `consequence`-shaped pair seated as `addition` for want of a table row. **Named for the sitting; no face was changed to soften it, since softening would trade the licensed claim for a plainer one (§21.4).**

**Marks.** `covert: no` and `audience: player (no mark)`, so no variant carries a `dm-only` mark. No `[grammar: Vn]` tag is written: ARCH §2.5's tag row scopes that tag to spine and turn variants, not to a modifier pool.

**What was executed.** `node scripts/prose-licence-card.mjs DS-DEF-2 'stores: short'` in the read-only dock; reads of `RECEIPT_POOLS_DOSSIER_STATE.md:2568-2740` (the block's shipped spines), `src/generators/foodGenerator.js:1-40, 258-360`, `src/components/new/tabs/DefenseTab.jsx:185`, `src/components/dossier/EngineSections.jsx:76`; and a mechanical check of these twelve faces for a digit, a percent, an em dash, an exclamation, a question, a semicolon, a colon, `which` and `will` (**zero hits**) and for first-two-word collision across all twelve (**none**). No dock byte was written; no test was run.
