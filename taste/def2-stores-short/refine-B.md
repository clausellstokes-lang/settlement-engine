1. `[plain]` More is eaten at {settlement} than is raised there and carried in.
   - `[face]` What is raised at {settlement} together with what is carried to it does not reach what the town eats.
   - `[face]` Consumption at {settlement} outruns what it raises and takes in.
   - `[face]` Food at {settlement} comes slower than it goes.
2. `[plain]` Out of what is raised and what is carried in, the town at {settlement} stands unfed.
   - `[face]` Nothing {settlement} raises or takes in is enough to keep the town fed.
   - `[face]` Added to what is carried in, what {settlement} raises does not come to the feeding of the town.
   - `[face]` Provision at {settlement} answers for less than the town eats.
3. `[plain]` At {settlement} the town goes short of food.
   - `[face]` Want of food is the condition {settlement} lives under.
   - `[face]` Enough food for the town lies beyond the sum of what {settlement} raises and what it takes in.
   - `[face]` In the matter of food the town at {settlement} does not keep pace with its own eating.

--- NOTES

REFINEMENT ARM B · Fable refiner, a different author from the drafter and from arm A · one for one over `draft-round-4.md`: twelve faces in, twelve out; no variant or face added, dropped, merged or reordered; every face carries `{settlement}` exactly once, never first and never last; every slot set byte-equal to its parent (§22 (a)/(e)). The card was re-read at the dock this round (`node scripts/prose-licence-card.mjs DS-DEF-2 'stores: short'` in `laneTASTE`): `may claim` that `label` holds as a standing fact; `may NOT` a count, a cause, a season, a future, a standpoint, a second fact, a store-class object, any field the spine tests; `source (none) · SOURCE-UNRESOLVED`, so no face cites a holder. Every face below asserts the one claim, the NET shortfall, and nothing else.

## PER FACE — what changed, and why

- **1a** `More is eaten at {settlement} than the town takes in.` → **`More is eaten at {settlement} than is raised there and carried in.`** The pool fixes `takes in` as the IMPORT term (2b, 3c set it against `raises`), so the draft compared eating with imports alone, a weaker claim than the card's net one (`foodGenerator.js:329`, the deficit is net of `importCoverage`); the comparison now runs against both sources, in the same agentless passive as the first half, so the line is one measurement in words from end to end.
- **1b** `What is raised on {settlement}'s ground and what is carried to it fall short of what the town eats.` → **`What is raised at {settlement} together with what is carried to it does not reach what the town eats.`** `{settlement}'s ground` was a particular no field holds and is gone (R-DA-20); `together with` puts the SUM in the subject where the claim lives, and `does not reach` is the measuring verb that reads as one quantity set against another, the long line kept long and its three `what` limbs kept parallel.
- **1c** `Consumption at {settlement} outruns what the town draws in.` → **`Consumption at {settlement} outruns what it raises and takes in.`** `outruns` is kept, it is the best word in the face; `draws in` was a third wording of the import term (R-DA-22) and named imports only, so the object is now the sum in the pool's own two terms; the line is shorter and claim-exact, the compact administrative face of the variant.
- **1d** `Food at {settlement} runs behind the town's eating.` → **`Food at {settlement} comes slower than it goes.`** The draft's `Food at {settlement}` could be read as the holding, the very blur the drafter removed from 3d; `comes slower than it goes` is the FLOW against the eating in eight words, the pool's short line kept at the floor and made denser (§21.4, compression that rewards the reader), and it frees `runs` from doubling `outruns` in 1c.
- **2a** `… the town at {settlement} is not fed.` → **`… the town at {settlement} stands unfed.`** The fronted pair of sources is kept as the variant's shape; `stands unfed` states the standing condition in the clerk's own verb, with no agent implied and no capacity spent, where `is not fed` merely negated; the frame `the town at {settlement}` is retained here and in 3d only (the draft spent it four times).
- **2b** `… is enough to feed the town.` → **`… is enough to keep the town fed.`** The negative existential is the one shape in the pool that states insufficiency without a comparison and is kept; `keep the town fed` lands the close on the CONTINUING state, which is what a label is, and `fed` is a closer no sibling in the variant shares. The rationed words hold at the draft's count (`nothing` 1, `enough to` 1; no rise).
- **2c** `Taken together with what is brought to it, what {settlement} raises …` → **`Added to what is carried in, what {settlement} raises does not come to the feeding of the town.`** `brought` was a fourth import wording (R-DA-22) and `to it` a cataphor resolved only by the slot four words on; `Added to` is the ledger's own arithmetic word and states the sum as the operation it is, the nominal `the feeding of the town` kept because it is the variant's one non-finite rhythm.
- **2d** `Provision at {settlement} does not answer what the town eats.` → **`Provision at {settlement} answers for less than the town eats.`** The antique noun and the verb `answer` are kept; `answers for less than` turns a bare negation into the measurement the card licenses (R-DA-11: a comparison is a measurement in words) and is the sharper statement of the same claim. Measured: `less than` does not match the contrast regex in any of its three homes (`\bless [^.,;]{1,30} than\b` needs a second `than`), in the face alone and in all three composed units.
- **3a** `At {settlement} the town is short of food.` → **`At {settlement} the town goes short of food.`** The flattest statement, kept at eight words; `goes short of` is the idiom of want as a standing condition, one word sharper than the copula and no less plain.
- **3b** `Want of food is where the town at {settlement} stands.` → **`Want of food is the condition {settlement} lives under.`** `Want of` kept as the register's noun for a lack; the specificational `is what` still refused; the predicate now names the state as a CONDITION the town lives under rather than a place it stands, a different rhythm from every sibling, and the third `the town at {settlement}` frame is cleared.
- **3c** `… lies beyond what {settlement} raises and beyond what it takes in.` → **`… lies beyond the sum of what {settlement} raises and what it takes in.`** Two `beyond`s scoped over each source separately, the weaker per-source claim; `the sum of` scopes one `beyond` over both, which is the claim the card licenses, said in the clerk's arithmetic and not the poet's parallel.
- **3d** `… does not keep level with its own eating.` → **`… does not keep pace with its own eating.`** The clerk's frame `In the matter of food` is kept; `keep pace with` is flow against flow, which is what the label measures (daily production and cover against daily need), where `keep level` was a balance of standing quantities; `its own` stays at the draft's count (1 → 1), kept as the emphasis the drafter defended.

## THE MEASUREMENT — executed on this set with the detectors transcribed inline (nothing written but this packet; nothing run in any dock but the licence card)

| measure | round 4 | refine B |
|---|---|---|
| detector sweep, all twelve (semicolon · colon · em dash · question · exclamation · parenthesis · digit · `CONTRAST_SHAPES` and the fingerprint antithesis · triad · `, which` and any `which` · doubled adjective · participial opener · `There/It is` · `-ly` adverb · abstract-noun closer · pronoun closer · `SPECIFICATIONAL_COPULA` · `BARE_RELATIVE` · `RECORD_CITATION` · C3 historical lexicon · `FUTURE_INDICATIVE` · `QUANTIFIERS` · `PROVENANCE_LEXICONS.capacity` · `RELATION_LEMMAS` · the store-class list and the spine's tested and event words · the classifier's PROVENANCE, ABSENCE, CONSEQUENCE, OPEN, GEOGRAPHY and OBJECT rows) | CLEAN | **CLEAN, 0 findings** |
| pair arms against the draft face for face (`DURATION` added · `COUNT` moved · `RATION` risen · antithesis shape added · slot set) | — | **0 findings** |
| words per face | 8–20 · mean 13.00 · sd 4.282 pop | 8–19 · mean 13.17 · **sd 4.038 pop / 4.218 sample** (R-DA-05's ≥ 4.0 held) |
| lengths | 10 · 19 · 9 · 8 · 17 · 12 · 20 · 10 · 8 · 10 · 16 · 17 | 12 · 19 · 10 · 8 · 16 · 13 · 18 · 10 · 8 · 9 · 18 · 17 |
| two-word openers | 12 distinct, none a spine's first word | **12 distinct, none `the` / `neither` / the slot** |
| closers (kind varied) | in ×3 · eats ×2 · eating ×2 · town ×2 · fed · stands · food | in ×3 · eats ×2 · eating · goes · unfed · fed · town · food · under |
| composed units (spine + face, `unitsOfPool`'s join) | 36 · two sentences each · `sameOpenerAsPreviousRate` 0 | **36 · two sentences each · 0** |
| sibling overlap, within variant | mean 555bp · max 2000bp | mean 662bp · max 2857bp (1a/1b share `raised`, `carried`) |
| sibling overlap, whole pool | mean 506bp · max 4286bp | mean 687bp · max 4286bp |
| citations (A13) | 0 | **0** |

The overlap column rose for the same reason arm A's did and it is declared, not buried: the R-DA-22 discipline puts the pool's two import terms and its one local term into more faces (1a, 1c and 3c now each name the sum), and the `contentWords` ruler stops `town`, `what` and `than`, so a shared `raises` or `carried` is a large ratio on a ten-word line. No synonym was swapped to lower it (R12, fault 17). `armA5`'s shipped floor (10000bp AND same opener AND same sentence count) reports nothing either way: same-opener pairs are 0.

## WHAT DID NOT MOVE

- **The 24 WITHHELD composed units are the spine's.** Both sites are inside the `Disasters & Famine: granary AND hospital` pool's own bytes (spine 1's post-semicolon coordinate, arm Q; spine 3's `rather than in the luck`, arm A3); the harness's `owned` block reads FAIL 0 · WITHHELD 0 · PASS 36 for this pool at round 4 and no wording here can move the inherited 24. Round 4's refusal R1 stands with its counterfactual.
- **The claim.** One typed claim per face, `foodSecurity.label` holds, in the present, net of imports; no count, cause, season, magnitude, future, standpoint, second fact, store-class object, holder or citation. Round 4's refusals R2–R12 were re-checked face by face and all bind.
- **The thread (MOVE-GRAMMAR §1.4.1).** Every face carries FOOD forward (`eaten`, `eats`, `eating`, `food`, `feeding`, `fed`, `consumption`, `provision`) and every face names `{settlement}`; eight also carry `the town`. No face opens on a pronoun, a demonstrative or a possessive with its referent outside the sentence, so each reads after any of the three spines and after a foreign modifier, and none needs the last place. The one shift of subject in the variant, from the HOLDING the spine states to the FLOW, is the fact itself and not a turn outward.

## CARRIED UP (findings, not refusals of a face)

- **F-B1 (new, wiring, not this packet's to cure).** The producer writes the famine label as `Deficit — Active Famine` (`src/generators/foodGenerator.js:342`, an em dash); the defense leaf tests `food === 'Deficit × Active Famine'` (`src/domain/display/stateProse/defenseStateProseCandidates.js:139`, a multiplication sign) with no map between them, where the general desk carries exactly that map (`generalStateProse.js:266`). So `stores: short` fires on `Deficit` alone and is silent under an active famine. The wording set is true of both values and needs no change; the class the card names is narrower than the drafter's `{Deficit, Deficit — Active Famine}` until the leaf reads through the map. A chair row for the SEAM or LIGHT train.
- **F-B2 (carried from round 4 F7, with a third cause).** Claim precision, the one-term rule and the length spread all pull sibling overlap UP at this grain; the sitting should read the column with that in mind before cutting A5's floor.

## FENCE — declared exactly

Only this file was written. No dock byte was written, no test was run, nothing was committed. In `laneTASTE` the one thing executed was `node scripts/prose-licence-card.mjs DS-DEF-2 'stores: short'`; the detectors in the table above were transcribed from `entryLexicons.js`, `proseFingerprint.js`, `composedWalker.js`, `moveGrammar.js` and `scripts/check-pair.mjs` into an inline `node -e` run that imported nothing from any dock and wrote no file.
