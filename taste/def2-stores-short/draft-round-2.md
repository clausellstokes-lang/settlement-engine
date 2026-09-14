1. `[plain]` More is eaten at {settlement} than the town takes in.
   - `[face]` All the food that comes to {settlement}, grown or carried, still leaves the town short of what it eats.
   - `[face]` Food to be had at {settlement} does not go round.
   - `[face]` What lies in hand at {settlement} does not stretch to feed the town.
2. `[plain]` The town does not feed itself out of what {settlement} raises and brings in.
   - `[face]` For its food the town at {settlement} comes up short.
   - `[face]` Nothing that {settlement} raises or takes in is enough to feed the town.
   - `[face]` Enough food is beyond {settlement} as things stand.
3. `[plain]` What the town eats at {settlement} outruns the food in hand.
   - `[face]` A shortfall in food stands between what {settlement} eats and what it comes by.
   - `[face]` Short in food is how the town at {settlement} stands.
   - `[face]` In the matter of food the town at {settlement} does not come by enough to eat.

--- NOTES

## 0. THE GATE'S FEEDBACK, ANSWERED MEASURE BY MEASURE

The instrument was **reproduced exactly** before a word was rewritten. Bands = leave-one-out min–max over the ten leaf exemplar registers in `prose-research/primary/*.fingerprint.json` (`dnd-flavor`, `dnd-rules-srd52`, `dnd-rules`, `leguin-fiction`, `leguin-nonfiction-spoken`, `leguin-nonfiction-written`, `martin-chronicle`, `martin-narrative`, `tolkien-elevated`, `tolkien-plain`); the metric definitions were read verbatim from `laneTASTE/src/domain/prose/proseFingerprint.js:125-155` (`NOT_ADVERBS :69`, `NOT_PARTICIPLES :71`), and the depth arithmetic is `scoreAgainstBands`/`bandsFrom` (`:179-220`). Scoring round 1's twelve faces through that reproduction returns **28.24 on one face and 8.60 on one face and nothing else above 1.75** — the gate's two figures to the digit, on:

- `shapes.participialOpenerRate` **28.24** → round 1 variant 3's `[plain]`, *Feeding itself is beyond…* (the detector is `first word ends in "ing"`, `:141`);
- `closers.abstractNounRate` **8.60** → round 1 variant 2's `[plain]`, *…the town's own requirement.* (the detector is the closer suffix set `ness|tion|sion|ity|ment|ance|ence|ship|hood|dom`, `:147`).

**CONFIRMED**, therefore, and not inferred: the measure is per FACE, a single-sentence face scores 0 or 1 on every 0/1 metric, and one hit is a whole-band-run breach.

| gate measure | round 1 | round 2 | how it was moved |
|---|---|---|---|
| `closers.abstractNounRate` over | 8.60 on 1 of 12 | **0 on 0 of 12** | no closer in the suffix set survives; the twelve closers are `in · eats · round · town · in · short · town · stand · hand · by · stands · eat` |
| `shapes.participialOpenerRate` over | 28.24 on 1 of 12 | **0 on 0 of 12** | no face opens on an `-ing` word; both gerund-subject openings are gone |
| depth ok share | 10 of 12 | **12 of 12 (band: 12 of 12)** | executed above; the worst remaining depth on every face is `neighbourVariation` 1.60, structural to a one-sentence unit and inside the 1.75 ceiling |
| composed walk WITHHELD | 24 of 36 | pre-existing on the spines, not movable from this pool — see §1 | one composed-unit breach removed (3 → 1) as a free gain |
| pool length spread (R-DA-05 direction) | mean 11.25, sd 2.16, min 8, max 15 | **mean 12.33, sd 2.98, min 8, max 19** | not a gate row; moved deliberately toward the band |

**A measure the round-1 draft was silently passing, and round 2 nearly broke.** `wordsPerSentence.shareUnder8`'s band is 0.0292–0.3333, so a face **under eight words** scores 1.0 and sits **2.19 band-widths** outside — over the 1.75 entry ceiling. Two short faces (six and seven words) were drafted for the register card's "the short line exists" and were withdrawn on measurement; the floor is now eight words. **This is a chair row: at the ENTRY grain a one-sentence unit cannot carry the register's short line at all.** The short line is a POOL property (a pool whose faces range 8 to 19) and cannot be an entry property; §16.2's entry grain and the register card's short-line licence are in tension, and this pool resolves it toward the measurable one.

**Twelve faces, all clean, on the 0/1 metrics that cost a run of band-widths** — measured, not asserted: participial opener 0/12 (28.24 each) · antithesis shape 0/12 (30.09) · which-tail 0/12 (26.03) · doubled adjective 0/12 (18.93) · there/it-is opener 0/12 (17.49) · pronoun closer 0/12 (10.25) · em dash 0/12 (8.69) · abstract-noun closer 0/12 (8.60) · semicolon 0/12 (7.74) · colon 0/12 (6.99) · triad 0/12 (4.62) · parenthesis 0/12 (3.08) · dialogue 0/12 (2.68) · over-30 0/12 (2.29) · under-8 0/12 (2.19) · one `-ly` adverb 0/12 (1.83). Digits, percents, questions and exclamations: zero. Two-word openers: twelve distinct.

**A tic the round-1 draft carried unmeasured.** `shapes.antithesisRate`'s regex (`:139`) includes `\bless [^.,;]{1,30} than\b`. Round 1's variant 1 `[plain]` opened *Less food comes to hand at {settlement} than…*, and it escaped only because the rendered span between "less" and "than" was 31 to 34 characters for the town names measured — **a short town name puts it inside the thirty-character window and the face scores 30.09 band-widths**. That construction is gone. It is a live authoring hazard for the whole wave: **`less X than Y` is an antithesis to this instrument, and whether it fires depends on the length of the town's name.**

## 1. THE COMPOSED WALK — WHY NO WORDING IN THIS POOL MOVES IT (a refusal, with the arithmetic)

Thirty-six units = three shipped `granary AND hospital` spines × twelve faces. The verdicts partition **exactly** by spine — 12 · 12 · 12 — and re-running my reproduction over spine+face for all thirty-six reproduces that partition and names each cause:

- **spine 1 (`[ledger]`)** carries the clause the gate quoted; the arm Q finding "a trailing coordinate naming no second field" is sited in **the spine's own text** ("the town can take a failed harvest or an outbreak"), and my reproduction independently red-lines all twelve of that spine's units on `punctuation.semicolonRate` (3.33 band-widths) — again the spine's own semicolon. Twelve of twelve, whatever the modifier says.
- **spine 3 (`[counterforce]`)** carries `rather than` in "the reason is in the two buildings **rather than** in the luck" — a literal member of the antithesis regex and of wall 5's CONTRAST class, which is what A3 reports on ("the band half is the refuter's": the arm can see the shape and cannot see whether a sibling key or band names the rejected alternative, so it withholds by construction, §8.4's WITHHELD channel). My reproduction red-lines all twelve of that spine's units at **14.42 band-widths on `shapes.antithesisRate`**, with the hit inside the spine.
- **spine 2 (`[street]`)** is the clean one: PASS 12.

**REFUSAL R1 — the 24 WITHHELD units cannot be discharged from inside this packet.** Both causes are sited in the spine pool's text (`RECEIPT_POOLS_DOSSIER_STATE.md`, the `Disasters & Famine: granary AND hospital` pool, variants 1 and 3), and CLERK-LAWS §2.6.1 keys a finding on its SITE: a modifier cannot retire a finding whose site is the spine's clause. Rewriting those two spines is the spine pool's own row, not this one. **Named for the sitting: the `granary AND hospital` spine pool carries one semicolon-joined trailing coordinate and one `rather than`, and every modifier that ever attaches to that pool inherits both.**

**What was moved for free.** Round 1 put two faces and one `[plain]` in "The…", colliding with spine 2's own opener and pushing `openers.sameOpenerAsPreviousRate` to 1.0 (2.50 band-widths) on three composed units. Round 2 leaves one — variant 2's `[plain]`, kept because it is the plainest true statement of that variant and §21.4 forbids trading a strong line for a plainer one with no law behind the change. Composed units over depth from openers: **3 → 1 of 36.**

**What was moved for the reading.** Round 1's face *Neither what {settlement} raises nor what it brings in comes up to the need* sat directly under spine 3's *Neither a failed harvest nor an outbreak…* — the same correlative, fronted, one sentence later. It is withdrawn. So is the concessive *Whatever {settlement} can find, the town still comes up short*, the second contrast-shaped face in the set. Neither is a paraphrase-loss: their semantic work is carried by variant 1's face 1 and variant 2's face 2 in constructions that carry no rejected alternative.

## 2. THE CARD, AND THE CLAUSE UNDER EVERY CLAIM

Read at the dock: `node scripts/prose-licence-card.mjs DS-DEF-2 'stores: short'`.

`role modifier` · `reads settlement.economicState.foodSecurity.label (measured)` · `predicate` authored in `defenseStateProseCandidates.js`, **not recovered by the card** · `bag {band: RESERVED, route: proper, settlement: proper}`, FILLED at this block's call sites `{settlement}` · `relation addition` (no relation-table row joins this field to the spine's primary field) · `seat/form sentence / sentence` · `move PRESENT` · `angle plain` · `attach Disasters & Famine: granary AND hospital` (narrowed by hand) · `covert no` · `audience player (no mark)` · `source (none) · standing SOURCE-UNRESOLVED — NO citation is licensed; arm A13 refuses a face naming a record holder here` · **may claim: that `label` holds, as a STANDING fact of the record** · **may NOT: a count, a cause, a season, a future, a standpoint, a second fact, another civic object of the class `store`, any field the attached spine tests (`disasterRowSituation(granary, hospital, church)`)**.

**The predicate, grounded (unchanged from round 1, re-verified).** The card does not recover the branch, so the class was read off the producing leaf, `src/generators/foodGenerator.js:339-359`: the label set is `Deficit — Active Famine` · `Deficit` · `Import-Dependent` · `Pressured` · `Surplus` · `Secure`, and the sibling pool `stores: import-fed` takes `Import-Dependent`. `stores: short` is therefore the `Deficit` pair, and `deficit` at `:329` is `max(0, rawDeficit − importCoverage − magicOffset)` — **net of imports and of the magic offset**. Every face asserts the NET shortfall and none asserts local-only insufficiency, which would be a different typed claim and would break claim equality across the four faces (arm A6).

**Why every face names `{settlement}` and none opens on it.** ARCH §8.3: a modifier whose surface names neither a slot nor a band word is not licensed. `band` is RESERVED and `route` is unfilled, so `{settlement}` is the only lawful naming; it appears exactly once in every row, so the `{slot}` set is identical across each variant's four faces (T-F8, arm A6). The earliest slot position in the set is three (`Nothing that {settlement}…`), so no row opens on a `proper`-typed slot (T-F8's face refusal, ARCH §2.5).

### Per face — the clause that licenses each claim

*Variant 1 — the two quantities set against each other. Close kinds: condition · condition · condition · object.*

- `[plain]` **More is eaten at {settlement} than the town takes in.** (10) — the shortfall as a measured comparison: `may claim: that label holds, as a STANDING fact`; the town named: `bag {settlement}` FILLED. A comparison written as a measurement in words is the form R-DA-11 licenses in place of a figure. Present indicative, no modality, no cause.
- `[face]` **All the food that comes to {settlement}, grown or carried, still leaves the town short of what it eats.** (19) — the long line of the pool. `grown or carried` is a disjunction covering the label's two arithmetic sources without asserting either is non-zero, so the face stays true where `importCoverageRate` is zero (`foodGenerator.js:300-317`). `All` quantifies a mass of food, never a person or an office: the card's `REFUSED COLUMNS` bars a totality over persons, and R-DA-15's `closed` requirement governs offices, counts and exemptions — neither is engaged. Named for the refuter as the set's one totality word.
- `[face]` **Food to be had at {settlement} does not go round.** (10) — `to be had` is the clerk's idiom for availability from any source, so the net class is preserved; `go round` states insufficiency without naming a quantity (the card bars a count). Closes on a condition.
- `[face]` **What lies in hand at {settlement} does not stretch to feed the town.** (13) — `in hand` is a state of availability, not a held object: it names no granary, store, reserve or stock, which the card bars twice over (`another civic object of the class store`; `any field the attached spine tests`). `stretch` is a literal measure verb, not a figure.

*Variant 2 — the town does not feed itself. Close kinds: condition · condition · object · condition.*

- `[plain]` **The town does not feed itself out of what {settlement} raises and brings in.** (14) — both sources named, so the claim is the net one; `does not feed itself` is a standing fact, deliberately not `cannot feed itself`, because a capacity modal would spend a modality the field does not hold (B-CLAIM; ruling 6).
- `[face]` **For its food the town at {settlement} comes up short.** (10) — fronted adverbial, no rejected alternative, so no CONTRAST move is made (wall 5). `comes up short` closes on a condition.
- `[face]` **Nothing that {settlement} raises or takes in is enough to feed the town.** (13) — a negative existential over the food, not an antithesis: no `not X but Y`, no `rather than`, no `, not …`; measured at 0 on `shapes.antithesisRate`. `enough` is a sufficiency word, not a count.
- `[face]` **Enough food is beyond {settlement} as things stand.** (8) — the shortest face the entry band permits (see §0). `as things stand` marks the STANDING grain the card licenses and blocks a reading as an event; no future indicative (A2, R-DA-07).

*Variant 3 — the eating measured against the food. Close kinds: object · condition · condition · condition.*

- `[plain]` **What the town eats at {settlement} outruns the food in hand.** (11) — the deficit stated from the consumption side. `outruns` is the set's nearest figure risk and is named here for the refuter: it is a comparative measure verb on a quantity, not a sense verb on an abstraction and not an inanimate acting with intent (R-DA-11's two barred classes). It is also the set's densest line, and §21.4 protects it from being made plainer without a law behind the change.
- `[face]` **A shortfall in food stands between what {settlement} eats and what it comes by.** (14) — `stands` is stative, not intentional. `between X and Y` is a measured comparison, not a rejected alternative.
- `[face]` **Short in food is how the town at {settlement} stands.** (10) — a fronted predicate; the state, never the fate (A2, NL-6's estate analogue).
- `[face]` **In the matter of food the town at {settlement} does not come by enough to eat.** (16) — the clerk's `in the matter of` frame; `come by` is obtaining from any source, so the net class holds.

### The thread (owner, 2026-09-08 ~21:4x; MOVE-GRAMMAR §1.4.1)

The composer places this modifier, not the writer, so every face was read after each of the three spines and after a foreign modifier. Each face carries a noun forward from the spine set — **food**, **the town**, **{settlement}** are in all three spines and in every face here — so no face changes subject mid-passage and hands nothing back, and none needs to be the passage's one turn outward. Where the grammatical subject shifts (variant 3's `what the town eats`, `a shortfall in food`), it re-anchors on the spine's own nouns in the same clause. `stores: import-fed` and this pool are mutually exclusive on the label, so the two modifiers never co-occur.

## 3. REFUSALS — a refusal is a result

**R1 — the 24 WITHHELD composed units.** Stated in full in §1, with the 12·12·12 partition and both spine sites named. Not movable from this packet.

**R2 (pre-existing, carried forward) — the ATTACH object-class refusal, T-F12.** `DOSSIER_STATE DS-DEF-2 :: stores: short: ATTACH Disasters & Famine: granary AND hospital` — the spine's key and this modifier's key name the same civic object class `store`, which the projector reads as a restatement the field guard cannot see, waived only under `--taste`. This is an ATTACH-line refusal, not a wording refusal: no rewording of twelve faces changes which key the annex's ATTACH names, and the set was written so that the two claims sit on different things anyway — the spine's is the HOLDING (a granary and a hospital exist), this pool's is the FLOW (the food balance is short). **The disposition on record: the refusal is the key string's, not the prose's, and it is the sitting's to lift, narrow or let stand.**

**R3 — no face may name a store, a granary, a reserve, a stock or a loft.** The pool KEY reads `stores: short`, but the card's `reads` is `foodSecurity.label` and its `may claim` is that the label holds. A stockpile level is a different field (`foodSecurity.storage` / `stockpile`, read at `EngineSections.jsx:76`), and the granary is the attached spine's own tested field. **The key string is data; it licensed nothing.** Twelve faces, zero store-class nouns.

**R4 — no famine, hunger, plague or "short commons" word.** The class is `{Deficit, Deficit × Active Famine}` and a face must be true of both; `Deficit` alone carries no famine, and famine is an event class that `MOVE: PRESENT` cannot take in any case.

**R5 — no season, no date, no rate.** The card's `may NOT` names a season outright; `year on year` and `each winter` additionally assert a rate or a time band, which R-DA-16 gives to the COUNT/TIME moves this pool does not carry.

**R6 — no keeper, no citation, no provenance move.** `source: (none) · standing SOURCE-UNRESOLVED`: the card states that NO citation is licensed and that arm A13 refuses a face naming a record holder here. MOVE-GRAMMAR §4.4.3 budgets the provenance move from the exemplar bands and licenses it only where the census's `source` column resolves the holder for this town; it does not. Register card amendment S3 is unreachable from this pool until SEAM car 5b lands the holder census.

**R7 — no short line under eight words.** Refused on measurement, not on taste: 2.19 band-widths outside `wordsPerSentence.shareUnder8` at the entry grain. Two drafted faces (six and seven words) were withdrawn. Recorded as the chair row in §0.

**R8 — no `less X than Y` construction.** Refused on measurement: it is a literal member of the `shapes.antithesisRate` regex, worth 30.09 band-widths, and whether it fires depends on the rendered town name's length. Round 1's variant 1 `[plain]` carried it and escaped by an accident of name length.

## 4. FINDINGS CARRIED UP (not refusals of a face)

- **F1 (round 1, now answered by measurement).** The modifier sentence band was unpinned in the documents. It is now pinned from the instrument, not from taste: **a `FORM: sentence` modifier face must be 8 to 30 words**, because 7 costs 2.19 band-widths on `shareUnder8` and 31 costs 2.29 on `shareOver30`, both over the 1.75 entry ceiling. This set runs 8 to 19, mean 12.33, sd 2.98. **Recommended for car 6 as the modifier band, ahead of the measurement.**
- **F2 (carried, unchanged).** ARCH §2.5 refuses an ATTACH on a spine whose branch `tests` the modifier's field. This spine's BRANCH tests `granary/hospital/church` and passes, but the row's BADGE is scored at `DefenseTab.jsx:185` as `scores.disaster ?? r.economicState?.foodSecurity?.resilienceScore ?? …` — a **sibling field of the same root** as this pool's `label`, exactly the coarseness the card's own echo line warns of. Whether a badge read counts as a `tests` for the refusal is a chair question.
- **F3 (carried, sharpened).** The spine and the modifier are true together and read as a tension: the spine says the town holds food against a bad year, this modifier says the balance is short. `relation: addition` is the claim-free floor the card assigns because no RELATION TABLE row joins the two fields (§4.5). Every face lands the addition on the FLOW and never on the HOLDING, which is the spine's. **Honest disposition: this is a `consequence`-shaped pair seated as `addition` for want of a table row.** No face was softened to hide it (§21.4).
- **F4 (new).** The gate's per-face band arm and MOVE-GRAMMAR's own composed-unit reading disagree about who owns a finding. Every face here is 12 of 12 clean at the face grain while 24 of 36 composed units carry a spine-sited finding. **A modifier pool can be lawful and its every composed unit withheld.** The taste's staffing table wants a column separating "the modifier's findings" from "the findings the modifier inherits from its spine", or a modifier lane will read its spine's debts as its own for another round.
- **F5 (new).** `wordsPerSentence.neighbourVariation` reads **1.60 band-widths outside on every single-sentence face**, because burst is structurally zero when there is one sentence and the exemplar floor is 0.495. It is under the 1.75 ceiling today by 0.15, so twelve of twelve pass — but the margin is an artefact, not a property of the prose, and any band re-cut that raises that floor turns **every** one-sentence modifier face in the corpus red at once. **A chair row, and a cheap one: exclude consecutive-pair statistics at the entry grain, as MOVE-GRAMMAR §0's reading-order caveat already does for the register grain.**

## 5. MARKS, TAGS, AND WHAT WAS EXECUTED

`covert: no` and `audience: player (no mark)`, so no variant carries a `dm-only` mark; the covert-pool rule does not reach this pool. No `[grammar: Vn]` tag is written: ARCH §2.5 scopes that tag to spine and turn variants, not to a modifier pool.

**Executed this round** — `node scripts/prose-licence-card.mjs DS-DEF-2 'stores: short'` in the read-only dock; reads of `RECEIPT_POOLS_DOSSIER_STATE.md` (the block's six shipped `Disasters & Famine` spine pools and both modifier rows), `src/domain/prose/proseFingerprint.js:40-160`, and the ten leaf fingerprints under `prose-research/primary/`; and a faithful re-implementation of `fingerprint()` + `bandsFrom()` + `scoreAgainstBands()` run over (a) round 1's twelve faces — reproducing 28.24 and 8.60 on the two faces the gate named and nothing else above 1.75 — and (b) round 2's twelve faces at the face grain and all thirty-six spine+face composed units. **No file was written outside this packet; no dock byte was written; no test was run.**
