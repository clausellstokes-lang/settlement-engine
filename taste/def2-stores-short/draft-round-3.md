1. `[plain]` More is eaten at {settlement} than the town takes in.
   - `[face]` What is grown at {settlement} and what is carried in do not, taken together, amount to what the town eats.
   - `[face]` Food reaching {settlement} stops short of the town's own eating.
   - `[face]` Beside what is eaten, the food {settlement} comes by does not stand level.
2. `[plain]` Out of what is raised and brought in, the town at {settlement} is not fed.
   - `[face]` Nothing that {settlement} raises or takes in is enough to feed the town.
   - `[face]` Provision at {settlement} does not answer the town's need.
   - `[face]` For its food the town at {settlement} comes up short.
3. `[plain]` At {settlement} the town is short in the matter of food.
   - `[face]` Want of food is where the town at {settlement} stands.
   - `[face]` What lies in hand at {settlement} does not stretch to feed the town.
   - `[face]` Enough food is beyond {settlement} as things stand.

--- NOTES

## 0. THE GATE'S FEEDBACK, ANSWERED MEASURE BY MEASURE

Every gate row this round is a COMPOSED WALK row, and the walk was **reproduced exactly**
before a word was rewritten. The composed unit is built by `scripts/taste-measure.mjs`
`unitsOfPool` (`:233-286`) as `` `${spineFace} ${face}` `` — the spine's sentence, one space,
the modifier's sentence, verbatim — over the three shipped `Disasters & Famine: granary AND
hospital` spines × this pool's twelve wordings = **36 units**. The three failing arms were
transcribed from their shipped sources and run over all 36:

- **Q** — `entryWalker.js` `armQualify` (`:807-838`): splits the unit into sentences, then
  splits each sentence on `;` and CONSIDERS every part after the first. A part naming a
  `{slot}` (`SLOT_RE :150`) or a band phrase (`bandReadings :251`) is licensed and returns;
  anything else is WITHHELD as *a trailing coordinate naming no second field* (`:837`).
- **A3** — `composedWalker.js` `armA3` (`:521-570`): matches `CONTRAST_SHAPES`
  (`entryLexicons.js:304`) anywhere in the UNIT, then licenses the rejected alternative only
  where a SIBLING POOL KEY's content words name it; otherwise WITHHELD (`:565`).
- **C3** — `entryWalker.js` `armC3` (`:527-560`): the semantic half fires on
  `/\b(had|were|was|used to|once|formerly|no longer)\b/` (`:546`) and withholds *is this
  clause historical?* (`:548`).

Run over ROUND 2's twelve wordings the reproduction returns **Q = 12 · A3 = 12 · C3 = 3 ·
WITHHELD 25 of 36 · PASS 11** — the gate's four figures to the unit. **CONFIRMED**, and with
it the site of every finding.

| gate measure | round 2 | round 3 | how it was moved |
|---|---|---|---|
| composed walk · C3 · *is this clause historical?* | **3** | **0** | the whole cause was one wording: round 2's `Food to be had at {settlement} does not go round.` — `\bhad\b` matches inside **to be had**, and the arm fired once per spine. The idiom is gone from the set; no wording carries `had`, `was`, `were`, `once`, `formerly`, `no longer`. |
| composed walk · unit verdicts | FAIL 0 · WITHHELD **25** · PASS 11 | FAIL 0 · WITHHELD **24** · PASS **12** | the C3 unit on the clean spine returns to PASS; the other 24 are spine-sited (§1) |
| composed walk · Q · trailing coordinate | 12 | **12** | **NOT MOVABLE FROM THIS PACKET — REFUSAL R1**, with the arithmetic in §1 |
| composed walk · A3 | 12 | **12** | **NOT MOVABLE FROM THIS PACKET — REFUSAL R1**, with the arithmetic in §1 |
| findings, total | 27 | **24** | |
| projector | none against the packet's rows | none | no row's shape changed: twelve one-sentence `FORM: sentence` wordings, each opening on a capital that is not a slot and closing on its own stop (arm A9, `composedWalker.js:698-745`) |

**This round is not dry.** It moves a failing measure to zero (C3 3 → 0), moves the unit
verdicts (WITHHELD 25 → 24, PASS 11 → 12) and adds no new finding of any class on any arm.

**The bands, re-measured this round and not inherited.** Leave-one-out min–max over the ten
leaf exemplars in `prose-research/primary/*.fingerprint.json`, metric definitions transcribed
from `src/domain/prose/proseFingerprint.js:99-152`, depths by `scoreAgainstBands :160-186`,
entry numbers `taste-measure.mjs` `ENTRY_NUMBERS` (BUDGET two thirds, DEPTH 1.75). **All
twelve wordings: 13 of 21 metrics exceeded (budget 14 — OK), deepest exceedance 1.597
band-widths on every one (ceiling 1.75 — OK).** The deepest is `neighbourVariation`, which is
structurally 0 on any one-sentence unit; see F5. Zero on every 0/1 tic that costs a run of
band-widths, measured not asserted: participial opener 0/12 (28.24 each) · antithesis shape
0/12 (30.09) · which-tail 0/12 (26.03) · doubled adjective 0/12 (18.93) · there/it-is opener
0/12 (17.49) · pronoun closer 0/12 (10.25) · em dash 0/12 (8.69) · abstract-noun closer 0/12
(8.60) · semicolon 0/12 (7.74) · colon 0/12 (6.99) · triad 0/12 (4.62) · parenthesis 0/12
(3.08) · dialogue 0/12 (2.68) · over-30 0/12 (2.29) · under-8 0/12 (2.19) · one `-ly` adverb
0/12 (1.83). Digits, percents, questions, exclamations: zero. Future indicative (`will` /
`shall`, a C4 **FAIL** channel at `entryWalker.js:645`): zero.

**Lengths in words:** 10 · 20 · 10 · 13 · 15 · 13 · 9 · 10 · 11 · 10 · 13 · 8 — mean 11.83,
sd **3.13** (round 2: 2.98), min 8, max 20. R-DA-05's within-pool spread direction is ≥ 4.0
and is still short of it; the floor is the eight-word wall of F1 and the ceiling is what a
single licensed claim can honestly carry. Widened deliberately this round by the interpolated
qualifier in variant 1's first face, which also sharpens the claim (§2).

**Twelve distinct two-word openers, and none collides with a spine's.** `openerOfText`
(`composedWalker.js:576-579`) normalises a slot to `{}`: `more is · what is · food reaching ·
beside what · out of · nothing that · provision at · for its · at {} · want of · what lies ·
enough food`. The three spines open on `settlement` (from `{settlement}`), `the` and
`neither`. Round 2 left one wording opening on *The*, which met spine 2's own opener and put
`openers.sameOpenerAsPreviousRate` at 1.0 on three composed units (2.50 band-widths). **This
round: 0 of 36.** Round 2's row was kept under §21.4 (never make a line plainer without a law
behind it); it is replaced here by a wording that is not plainer, so §21.4 is not engaged.

## 1. THE COMPOSED WALK — WHY NO WORDING IN THIS POOL MOVES THE REMAINING 24 (a refusal, with the arithmetic)

The 36 verdicts partition **exactly** by spine, 12 · 12 · 12, and the reproduction names each
cause in the spine's own bytes (`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`, the
`Disasters & Famine: granary AND hospital` pool):

- **spine 1 `[ledger]`** carries a semicolon. `armQualify` splits on it and considers the
  part after it — *between them the town can take a failed harvest or an outbreak without
  either becoming a catastrophe* — which names no `{slot}` and no band phrase, so it is
  WITHHELD on every one of that spine's twelve units. **Q = 12, all sited in the spine.**
- **spine 3 `[counterforce]`** carries `rather than` in *the reason is in the two buildings
  rather than in the luck*. `armA3` reads the alternative as `rather than in the luck`, whose
  only content word after the stop list is **luck**; no sibling POOL KEY of `DS-DEF-2` holds
  it, so the band half is WITHHELD on every one of that spine's twelve units. **A3 = 12, all
  sited in the spine.**
- **spine 2 `[street]`** carries neither shape. Its twelve units are the pool's PASS column.

**REFUSAL R1 — the 24 remaining WITHHELD units cannot be discharged from inside this packet,
and the mechanism says so, not the taste.** `armQualify` licenses a segment by what is IN
THAT SEGMENT; the segment is the spine's own post-semicolon clause and no modifier sentence
is ever read for it. `armA3` licenses an alternative against `options.siblingKeys` — the
block's pool KEY STRINGS — and the modifier's text is not consulted at all. Two arms, two
inputs, and the modifier's wording is an input to neither. CLERK-LAWS §2.6.1 keys a finding on
its SITE; both sites are in the spine pool's text. **Named for the sitting: the
`Disasters & Famine: granary AND hospital` spine pool carries one semicolon-joined trailing
coordinate and one `rather than`, and EVERY modifier that ever attaches to that pool inherits
both — `stores: import-fed` sits behind the same two spines and will read the same 24.**
Rewriting those two spines is the spine pool's row. The reachable floor for this packet is
**FAIL 0 · WITHHELD 24 · PASS 12**, and it is reached.

## 2. THE CARD, AND THE CLAUSE UNDER EVERY CLAIM

Read at the dock: `node scripts/prose-licence-card.mjs DS-DEF-2 'stores: short'`.

`role modifier` · `reads settlement.economicState.foodSecurity.label` (measured; absent ⇒ no
candidate) · `predicate` authored in `defenseStateProseCandidates.js` and **not recovered by
the card** · `bag {band: RESERVED, route: proper, settlement: proper}`, FILLED at this block's
call sites `{settlement}` · `relation addition` (no relation-table row joins this field to the
spine's primary field; addition is the claim-free floor, ARCH §4.5) · `seat/form sentence /
sentence` · `move PRESENT` · `angle plain` · `attach Disasters & Famine: granary AND hospital`
(narrowed by hand) · `covert no` · `audience player (no mark)` · `source (none) · standing
SOURCE-UNRESOLVED — NO citation is licensed; arm A13 refuses a face naming a record holder
here` · **may claim: that `label` holds, as a STANDING fact of the record** · **may NOT: a
count, a cause, a season, a future, a standpoint, a second fact, another civic object of the
class `store`, any field the attached spine tests (`disasterRowSituation(granary, hospital,
church)`)**.

**The predicate, re-grounded this round at the leaf and not inherited.** The card does not
recover the branch, so the class was read off the producing code, `src/generators/
foodGenerator.js`: `deficit = Math.max(0, rawDeficit − importCoverage − magicOffset)` (`:329`),
`deficitPct = deficit / dailyNeed × 100` (`:330`), and the label ladder `Deficit — Active
Famine` when `stressFamine` (`:341-343`), `Deficit` when `deficitPct > 40` (`:344-346`),
`Import-Dependent` when `> 15` (`:347-348`) — which the sibling pool takes. So `stores: short`
is the pair `{Deficit, Deficit — Active Famine}`, and the shortfall it names is **net of
imports and of the magic offset**. Two consequences the set obeys: every wording asserts the
NET shortfall and none asserts local-only insufficiency, which would be a different typed
claim and break claim equality across the four faces (arm A6); and no wording states the
magnitude, though the branch holds one (above two fifths of the daily need) — the card bars a
count, so the record understates and never overstates.

**Why every wording names `{settlement}` and none opens on it.** ARCH §8.3: a modifier whose
surface names neither a slot nor a band word is not licensed — it is the summarising beat
(arm Q). `band` is RESERVED and `route` is unfilled, so `{settlement}` is the only lawful
naming; it stands exactly once in every row, so the `{slot}` set is byte-equal across each
variant's four faces (arm A6, `composedWalker.js:645-668`). It is also load-bearing on arm Q:
a wording that dropped it would be read as *a second sentence naming no second field* and
would add three withheld units of its own. No row opens on it (T-F8's face refusal, arm A9).

### Per face — the clause that licenses each claim

*Variant 1 — the two quantities set against each other. Closes on: a condition · a condition
· a condition · a measurement.*

- `[plain]` **More is eaten at {settlement} than the town takes in.** (10) — the shortfall as
  a comparison written as a measurement in words, which is the form R-DA-11 licenses in place
  of a figure. Licensed by `may claim: that label holds, as a STANDING fact`; the town named
  by `bag {settlement}` FILLED. Present indicative, no modality, no cause, no count.
- `[face]` **What is grown at {settlement} and what is carried in do not, taken together,
  amount to what the town eats.** (20) — the long line of the pool. The interpolated *taken
  together* is not padding: it states that the SUM of the two arithmetic sources falls short,
  which is exactly `:329`'s net class, and it forecloses the reading that either source alone
  is meant. `grown` and `carried` name the two sources without asserting either is non-zero,
  so the wording stays true where `importCoverage` is zero. Measured clean on the triad and
  antithesis regexes despite its two commas.
- `[face]` **Food reaching {settlement} stops short of the town's own eating.** (10) — `stops
  short of` is a literal measure, not a figure (R-DA-11's three barred classes: no sense verb
  on an abstraction, no inanimate acting with intent, no simile). `reaching` covers arrival
  from any source, so the net class holds.
- `[face]` **Beside what is eaten, the food {settlement} comes by does not stand level.** (13)
  — a fronted comparison; `stand level` is the measurement in words again, in a different
  vocabulary. `comes by` is obtaining from any source. No rejected alternative is named, so
  no CONTRAST move is made and wall 5 is not engaged.

*Variant 2 — the town is not fed out of what it raises and brings in. Closes on: a condition ·
an object · a condition · a condition.*

- `[plain]` **Out of what is raised and brought in, the town at {settlement} is not fed.**
  (15) — both sources named, so the claim is the net one. The passive is deliberate: `does
  not feed itself` and `cannot feed itself` both spend something the field does not hold (an
  agency and a capacity respectively; B-CLAIM, and `can feed` is a literal member of
  `PROVENANCE_LEXICONS.capacity`, a C3 **FAIL** channel). `is not fed` asserts only the
  standing state.
- `[face]` **Nothing that {settlement} raises or takes in is enough to feed the town.** (13)
  — a negative existential over the food, not an antithesis: no `not X but Y`, no `rather
  than`, no `, not …`; measured 0 on `shapes.antithesisRate` and on `CONTRAST_SHAPES`.
  `Nothing` is not a member of `QUANTIFIERS` and the word-boundary locator does not read `no`
  inside it (`entryWalker.js:205-209`), so no totality arm fires. `enough` is a sufficiency
  word, not a count, and is not a band phrase.
- `[face]` **Provision at {settlement} does not answer the town's need.** (9) — the antique
  air sits in the noun (`provision`) and never in the syntax, which is R-DA-18 exactly. The
  shortest line but one, and the plainest: the register card's "the short line exists" is
  reachable at the entry grain only down to eight words (F1).
- `[face]` **For its food the town at {settlement} comes up short.** (10) — a fronted
  adverbial; `comes up short` closes on a condition. No modal, no cause, no second fact.

*Variant 3 — the condition named flat. Closes on: an object · a condition · an object · a
condition.*

- `[plain]` **At {settlement} the town is short in the matter of food.** (11) — the flattest
  statement the card licenses: the state, named, with nothing set against it. The clerk's `in
  the matter of` frame. `matter` is `CLOSE_KINDS.abstraction`'s own word and is deliberately
  NOT the closer; the line lands on `food`.
- `[face]` **Want of food is where the town at {settlement} stands.** (10) — `want of` is the
  register's own noun for a lack. `is where` is deliberately not `is what`: the
  specificational copula `\b(is|are|was|were)\s+(what|who|the only|the one)\b`
  (`entryLexicons.js:332`) entails exhaustivity over a column and would be withheld by arm X
  on an open column. State, never fate (A2, NL-6).
- `[face]` **What lies in hand at {settlement} does not stretch to feed the town.** (13) — `in
  hand` is a state of availability, not a held object: it names no granary, store, reserve,
  stock or loft, which the card bars twice over (`another civic object of the class store`;
  `any field the attached spine tests`). `stretch` is a literal measure verb.
- `[face]` **Enough food is beyond {settlement} as things stand.** (8) — the pool's short
  line, at the exact floor the instrument permits (F1). `as things stand` marks the STANDING
  grain the card licenses and blocks a reading as an event; no future indicative, no
  subjunctive edge asserted (R-DA-07, A2).

### The thread (owner, 2026-09-08 ~21:4x; MOVE-GRAMMAR §1.4.1)

The composer places this modifier, not the writer, so every wording was read after each of
the three spines and after a foreign modifier. **Every wording carries FOOD forward** — the
noun all three spines hold (spine 1 *holds food*, spine 2 *a place for grain*, spine 3 *a
failed harvest*) — and ten of twelve also carry **the town** or **{settlement}**, which spines
1 and 2 hold. No wording changes subject in the middle of the passage and hands nothing back;
where the grammatical subject shifts (variant 3's *Want of food*, variant 1's *What is
grown…*), it re-anchors on the spine's own noun inside the same clause, so no wording needs
to be the passage's one turn outward. No wording opens on a pronoun or a bare demonstrative,
so each reads as well after a foreign modifier as after its spine, and each stands alone
(NL-13). `stores: import-fed` and this pool are mutually exclusive on the label (`Deficit`
versus `Import-Dependent`, `foodGenerator.js:344-348`), so the two modifiers never co-occur in
one unit.

## 3. REFUSALS — a refusal is a result

**R1 — the 24 remaining WITHHELD composed units.** Stated in full in §1, with the 12 · 12 · 12
partition, the two spine sites, and the mechanical reason no wording can reach either arm's
input. Carried forward from round 2, and this round it is CONFIRMED by reproduction rather
than argued.

**R2 (pre-existing, carried) — the ATTACH object-class refusal, T-F12.** `DOSSIER_STATE
DS-DEF-2 :: stores: short: ATTACH Disasters & Famine: granary AND hospital` — the spine's key
and this modifier's key name the same civic object class `store`, which the projector reads as
a restatement the field guard cannot see; waived only under `--taste`. This is an ATTACH-LINE
refusal, not a wording refusal: no rewording of twelve wordings changes which key the annex's
ATTACH names, and this packet does not write the ATTACH line. The set is written so the two
claims sit on different things regardless — the spine's is the HOLDING (a granary and a
hospital exist), this pool's is the FLOW (the food balance is short). **The disposition on
record: the refusal is the key string's, not the prose's, and it is the sitting's to lift,
narrow or let stand.**

**R3 — no wording may name a store, a granary, a reserve, a stock or a loft.** The pool KEY
reads `stores: short`, but the card's `reads` is `foodSecurity.label` and its `may claim` is
that the label holds. A stockpile level is a different field, and the granary is the attached
spine's own tested field. **The key string is data; it licensed nothing.** Twelve wordings,
zero store-class nouns.

**R4 — no famine, hunger, plague or sickness word.** The class is
`{Deficit, Deficit — Active Famine}` and a wording must be true of both; `Deficit` alone
carries no famine, and famine is an event class `MOVE: PRESENT` cannot take in any case.
`sick`, `hospital` and `church` are additionally the attached spine's tested fields.

**R5 — no season, no date, no rate.** The card's `may NOT` names a season outright; `year on
year` and `each winter` additionally assert a rate or a time band, which R-DA-16 gives to the
COUNT and TIME moves this pool does not carry. `PROVENANCE_LEXICONS.dated` would fail the
lexical half of C3 outright.

**R6 — no keeper, no citation, no provenance move.** `source: (none) · standing
SOURCE-UNRESOLVED`: the card states that NO citation is licensed and that arm A13 refuses a
wording naming a record holder here. MOVE-GRAMMAR §4.4.3 budgets the provenance move from the
exemplar bands and licenses it only where the census's `source` column resolves the holder for
this town; it does not. Register card amendment S3 is unreachable from this pool until SEAM
car 5b lands the holder census. Three drafted wordings naming a keeper (*the record shows*,
*by the town's own reckoning*, *the account of food*) were withdrawn on the card, and
`RECORD_CITATION` (`entryLexicons.js:335`) reads zero on the set.

**R7 — no capacity verb.** `can feed`, `could feed`, `can hold`, `could hold` are literal
members of `PROVENANCE_LEXICONS.capacity` and take the **FAIL** channel of C3 on a state-only
field. Two drafted wordings using *cannot feed itself* were withdrawn on that ground, not on
taste; the set carries no `can` or `could` at all.

**R8 — no short line under eight words.** Refused on measurement, not on taste: 2.19
band-widths outside `wordsPerSentence.shareUnder8` at the entry grain, over the 1.75 entry
ceiling. The set's floor is exactly eight (`Enough food is beyond {settlement} as things
stand.`), which the instrument counts as NOT under eight.

**R9 — no `less X than Y` construction.** A literal member of `shapes.antithesisRate`'s regex,
worth 30.09 band-widths, and whether it fires depends on the rendered town name's length.
Carried from round 2, where round 1's opening line escaped it by an accident of name length.

**R10 — no wording ends on `{settlement}`.** New this round, and mechanical: the closer test
strips non-letters, so a line closing on the slot is scored on the token `settlement`, which
ends in `ment` and fires `closers.abstractNounRate` at **8.60 band-widths**. Two drafted
wordings closing on the town's name were withdrawn on measurement. **This is a wave-wide
authoring hazard on every pool whose bag offers `{settlement}`, and it is invisible to the
author because the slot is not a word.**

## 4. FINDINGS CARRIED UP (not refusals of a face)

- **F1 (carried, re-measured).** A `FORM: sentence` modifier face must be **8 to 30 words**:
  7 costs 2.19 band-widths on `shareUnder8` and 31 costs 2.29 on `shareOver30`, both over the
  1.75 entry ceiling. This set runs 8 to 20, mean 11.83, sd 3.13. Recommended for car 6 as the
  modifier band, ahead of the measurement. **The chair row inside it stands: at the ENTRY
  grain a one-sentence unit cannot carry the register card's short line below eight words at
  all; the short line is a POOL property here, not an entry property.**
- **F2 (carried, unchanged).** ARCH §2.5 refuses an ATTACH on a spine whose branch `tests` the
  modifier's field. This spine's BRANCH tests `granary/hospital/church` and passes, but the
  row's BADGE is scored at `DefenseTab.jsx:185` as
  `scores.disaster ?? r.economicState?.foodSecurity?.resilienceScore ?? …` — a **sibling field
  of the same root** as this pool's `label`, exactly the coarseness the card's own echo line
  warns of. Whether a badge read counts as a `tests` for the refusal is a chair question.
- **F3 (carried, sharpened).** The spine and this modifier are true together and read as a
  tension: the spine says the town holds food against a bad year, this modifier says the
  balance is short. `relation: addition` is the claim-free floor the card assigns because no
  RELATION TABLE row joins the two fields (§4.5). Every wording lands the addition on the FLOW
  and never on the HOLDING, which is the spine's. **Honest disposition: this is a
  `consequence`-shaped pair seated as `addition` for want of a table row.** No wording was
  softened to hide it (§21.4).
- **F4 (carried, now CONFIRMED rather than argued).** The gate's per-face band arm and the
  composed walk disagree about who owns a finding: every wording here is 12 of 12 lawful at
  the face grain while 24 of 36 composed units carry a spine-sited finding. **A modifier pool
  can be lawful and its every composed unit withheld.** The taste's staffing table wants a
  column separating *the modifier's findings* from *the findings the modifier inherits from
  its spine*, or a modifier lane reads its spine's debts as its own for another round. The
  cheap form: `taste-measure.mjs` already knows each piece's `role` and each finding's site —
  attribute a walk finding to the piece whose text holds it, and print the two counts.
- **F5 (carried).** `wordsPerSentence.neighbourVariation` reads **1.597 band-widths outside on
  every single-sentence wording**, because burst is structurally zero at one sentence and the
  exemplar floor is 0.495. It is under the 1.75 entry ceiling by 0.153 today, so twelve of
  twelve pass — but the margin is an artefact of the grain, not a property of the prose, and
  any band re-cut that raises that floor turns **every one-sentence modifier face in the
  corpus red at once**. It is also 1 of the 13 exceedances against a budget of 14, so it costs
  a slot as well as a margin. **A chair row, and a cheap one: exclude consecutive-pair
  statistics at the entry grain, as MOVE-GRAMMAR §0's reading-order caveat already does for
  the register grain.**
- **F6 (new).** Round 2's own C3 breach was a five-letter substring inside an idiom — `had` in
  *to be had* — and no reading of the wording as PROSE would find it. Three of the four
  regex-class hazards this set navigates are of that shape (R10's `{settlement}` closer;
  `can feed` inside a capacity idiom; `less … than` fired by a town name's length).
  **Recommendation for the wave: publish a one-page LEXICAL TRIPWIRE CARD beside the licence
  card — the eight word-level traps with their band-width costs — because they are cheap to
  avoid at authoring and cost a full round to find at the gate.**

## 5. MARKS, TAGS, AND WHAT WAS EXECUTED

`covert: no` and `audience: player (no mark)`, so no variant carries a `dm-only` mark; the
covert-pool rule does not reach this pool. No `[grammar: Vn]` tag is written: ARCH §2.5 scopes
that tag to spine and turn variants, not to a modifier pool.

**Executed this round** — `node scripts/prose-licence-card.mjs DS-DEF-2 'stores: short'` in
the read-only dock; reads of `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` (the block's six
shipped `Disasters & Famine` spine pools and both modifier rows),
`src/domain/prose/composedWalker.js`, `src/domain/prose/entryWalker.js`,
`src/domain/prose/entryLexicons.js`, `src/domain/prose/proseFingerprint.js`,
`scripts/taste-measure.mjs`, `src/generators/foodGenerator.js:320-362`, and the ten leaf
fingerprints under `prose-research/primary/`; and a faithful re-implementation of
`fingerprint()` + the band arithmetic + arms Q, A3, C3, C4-future and X, run over (a) round
2's twelve wordings × three spines — **reproducing the gate's Q = 12, A3 = 12, C3 = 3,
WITHHELD 25, PASS 11 exactly** — and (b) this round's twelve wordings at the face grain and
all thirty-six composed units. **No file was written outside this packet; no dock byte was
written; no test was run; nothing but the licence-card script executed in the dock.**
