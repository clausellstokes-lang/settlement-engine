1. `[plain]` More is eaten at {settlement} than the town takes in.
   - `[face]` What is raised on {settlement}'s ground and what is carried to it fall short of what the town eats.
   - `[face]` Consumption at {settlement} outruns what the town draws in.
   - `[face]` Food at {settlement} runs behind the town's eating.
2. `[plain]` Out of what is raised and what is carried in, the town at {settlement} is not fed.
   - `[face]` Nothing {settlement} raises or takes in is enough to feed the town.
   - `[face]` Taken together with what is brought to it, what {settlement} raises does not come to the feeding of the town.
   - `[face]` Provision at {settlement} does not answer what the town eats.
3. `[plain]` At {settlement} the town is short of food.
   - `[face]` Want of food is where the town at {settlement} stands.
   - `[face]` Enough food for the town lies beyond what {settlement} raises and beyond what it takes in.
   - `[face]` In the matter of food the town at {settlement} does not keep level with its own eating.

--- NOTES

## 0. THE GATE'S FEEDBACK, ANSWERED MEASURE BY MEASURE

The gate returned three rows and one standing waiver. Every one was reproduced from the
shipped sources before a word was rewritten, and the reproduction is exact.

**The reproduction is validated against the gate's own printed figures.** Running the
transcribed arms over ROUND 3's twelve wordings × the three shipped
`Disasters & Famine: granary AND hospital` spines returns **Q = 12 · A3 = 12 · WITHHELD 24 ·
PASS 12 of 36 · FAIL 0** — the gate's four numbers to the digit. **CONFIRMED**, and with it
the site of every finding: `{"Q@S1":12,"A3@S3":12}`. Both sites are inside a spine.

| gate measure | band | round 3 | round 4 | how it moved |
|---|---|---|---|---|
| composed walk · unit verdicts | FAIL 0 · WITHHELD 0 | FAIL 0 · WITHHELD 24 · PASS 12 | FAIL 0 · WITHHELD 24 · PASS 12 | **not movable from this packet — REFUSAL R1, now PROVEN by counterfactual (§1), not argued** |
| composed walk · Q · a trailing coordinate naming no second field | 0 | 12 | 12 | as above; all 12 sited in spine 1's post-semicolon clause |
| composed walk · A3 · a contrast whose rejected alternative no sibling key names | 0 | 12 | 12 | as above; all 12 sited in spine 3's `rather than in the luck` |
| composed walk · findings sited in a FACE read alone | — | 0 of 12 | **0 of 12** | no finding of any class was added by this round's rewrite |
| band arm (entry grain) | FAIL 0 · WITHHELD 0 | FAIL 0 · WITHHELD 0 | **FAIL 0 · WITHHELD 0** | held; every one of the twelve is CLEAN on every transcribed detector (§3) |
| **R-DA-05 · within-pool word-count sd** (the register's own figure: `2.9 → ≥ 4.0`) | ≥ 4.0 | **3.13** (below) | **4.28 pop · 4.47 sample** (inside) | **MOVED, and this is the round's non-dry measure.** The length set went from `8–20, mean 11.83` to `8–20, mean 13.00` with a deliberately bimodal spread: `10 · 19 · 9 · 8 · 17 · 12 · 20 · 10 · 8 · 10 · 16 · 17` |
| sibling distance, whole pool (the sitting's own column) | reported | mean 592bp · max 5000bp | **mean 506bp · max 4286bp** | improved |
| sibling distance, within variant | reported | mean 385bp · max 1667bp | mean 555bp · max 2000bp | **REGRESSED, reported not hidden — §5 F7** |
| A5 rows (a wording set that is four synonym swaps) | 0 | 0 | 0 | `armA5`'s only shipped floor is `floorBp = 10000` AND `sameOpener` AND `sameSegments`; sameOpener pairs are 0 in both rounds, so the arm is unreachable either way |
| projector | — | none | none | twelve one-sentence `FORM: sentence` rows, each opening on a capital that is not a `proper` slot and closing on its own stop (arm A9) |

**This round is not dry.** It moves a failing measure that the rules state and the gate's
printed table did not carry — R-DA-05's within-pool spread, from 3.13 (outside) to 4.28
(inside) — it lowers the whole-pool sibling overlap, and it adds no new finding of any class
on any arm. It also converts REFUSAL R1 from an argument into a mechanical proof (§1).

**§21.1 / §21.2 / §21.3, applied and not merely cited.** Every one of the twelve was rewritten
toward the ceiling except one, and the exception is deliberate: `1a` is carried forward
unchanged because I judge it already at the ceiling for its slot, and **§21.4 forbids changing
a lawful line with no law behind the change**. Every other substitution has a law behind it,
named per face in §4.

## 1. REFUSAL R1, PROVEN — no wording in this pool can reach either arm's input

`unitsOfPool` (`scripts/taste-measure.mjs:233-286`) builds the unit as `` `${spineFace} ${face}` ``
— spine, one space, modifier, verbatim, because every taste pool is an `addition` at the
SENTENCE seat whose connective list holds the EMPTY OPENER. The three spines are the shipped
`Disasters & Famine: granary AND hospital` pool, and the 36 verdicts partition exactly
12 · 12 · 12 by spine.

- **Spine 1 `[ledger]` carries a semicolon.** `armQualify` (`entryWalker.js:807-838`) splits the
  unit into sentences and then splits EACH SENTENCE on `;`, considering every part after the
  first. Spine 1's part is *between them the town can take a failed harvest or an outbreak
  without either becoming a catastrophe*, which names no `{slot}` and no band phrase, so it is
  WITHHELD once per unit. **Q = 12, every one sited in the spine.**
- **Spine 3 `[counterforce]` carries `rather than`.** `armA3` (`composedWalker.js:521-570`)
  extracts the alternative as the shape plus what follows up to the next `[.;,]` — here
  *rather than in the luck* — and licenses it only where a word of a SIBLING POOL KEY names it.
  `contentWords` over all 28 sibling keys of `DS-DEF-2` does not hold `luck`. **A3 = 12, every
  one sited in the spine.**
- **Spine 2 `[street]` carries neither shape.** Its twelve units are the pool's PASS column.

**THE COUNTERFACTUAL, executed.** A probe face stuffed with three slots and five band phrases
(`Several hundred {settlement} {band} {route} thousands a handful of some many.`) was composed
onto spine 1 and walked. The unit splits into two sentences; the segment `armQualify` considers
is still spine 1's own post-semicolon clause, still carries **zero** slots and zero band
phrases, and is still WITHHELD. **The modifier's text is not an input to that arm at all.**
The same holds for A3, which reads `options.siblingKeys` and never the modifier: the twelve
alternatives extracted from the 36 units are byte-identical between round 3 and round 4, whose
wordings share almost no vocabulary.

CLERK-LAWS §2.6.1 keys a finding on its SITE. Both sites are in the spine pool's own bytes.
**The reachable floor for this packet is FAIL 0 · WITHHELD 24 · PASS 12, and it is reached in
both rounds.** Named for the sitting, unchanged from round 3 and now with a proof behind it:
the `Disasters & Famine: granary AND hospital` spine pool carries one semicolon-joined trailing
coordinate and one `rather than`, and **every modifier that ever attaches to that pool inherits
both** — `stores: import-fed` sits behind the same three spines and reads the same 24. The cure
is the spine pool's own round, not this one; this packet does not author spine text and does
not write the ATTACH line.

## 2. THE CARD, READ AT THE DOCK

`node scripts/prose-licence-card.mjs DS-DEF-2 'stores: short'`, executed this round:

`role modifier` · `reads settlement.economicState.foodSecurity.label` (measured; absent ⇒ no
candidate, and a modifier is silent, never "false") · `predicate` authored in
`defenseStateProseCandidates.js` and NOT recovered by the card · `bag {band: RESERVED,
route: proper, settlement: proper}`, FILLED at this block's call sites `{settlement}` ·
`relation addition` (no relation-table row joins this field to the spine's primary field;
addition is the claim-free floor, ARCH §4.5) · `seat/form sentence / sentence` · `move PRESENT` ·
`angle plain` · `attach Disasters & Famine: granary AND hospital` (narrowed by hand) ·
`covert no` · `audience player (no mark)` · `source (none) · standing SOURCE-UNRESOLVED` ·
**may claim: that `label` holds, as a STANDING fact of the record** · **may NOT: a count, a
cause, a season, a future, a standpoint, a second fact, another civic object of the class
`store`, any field the attached spine tests (`disasterRowSituation(granary, hospital, church)`)**.

**The predicate, re-grounded at the leaf.** `src/generators/foodGenerator.js`:
`deficit = Math.max(0, rawDeficit − importCoverage − magicOffset)` (`:329`),
`deficitPct = deficit / dailyNeed × 100` (`:330`), and the ladder `Deficit — Active Famine` when
`stressFamine` (`:341-343`), `Deficit` above 40 (`:344-346`), `Import-Dependent` above 15
(`:347-348`, which the sibling pool takes). So `stores: short` is the pair
`{Deficit, Deficit — Active Famine}` and the shortfall it names is **net of imports and of the
magic offset**. Two consequences the set obeys: every wording asserts the NET shortfall and none
asserts local-only insufficiency, which would be a different typed claim and break claim
equality across a variant's four faces (arm A6); and no wording states the magnitude, though the
branch holds one, because the card bars a count. The record understates and never overstates.

**Why every face names `{settlement}` exactly once and none opens or closes on it.** ARCH §8.3:
a modifier whose surface names neither a slot nor a band word is not licensed and reads as the
summarising beat. `band` is RESERVED and `route` unfilled, so `{settlement}` is the only lawful
naming; one occurrence per face makes the `{slot}` set byte-equal across each variant's four
faces (arm A6). It is also load-bearing on arm Q: a face without it would be read as *a second
sentence naming no second field* and would add three withheld units of its own. No face opens on
it (T-F8, arm A9) and no face closes on it (R10 below, a measured hazard).

## 3. THE MEASUREMENT, EXECUTED THIS ROUND ON THIS SET

Every detector below was transcribed verbatim from `src/domain/prose/entryLexicons.js`,
`src/domain/prose/entryWalker.js`, `src/domain/prose/composedWalker.js` and
`src/domain/prose/proseFingerprint.js` and run over all twelve faces.

```
1a  n=10  opener="more is"         close="in"        CLEAN
1b  n=19  opener="what is"         close="eats"      CLEAN
1c  n= 9  opener="consumption at"  close="in"        CLEAN
1d  n= 8  opener="food at"         close="eating"    CLEAN
2a  n=17  opener="out of"          close="fed"       CLEAN
2b  n=12  opener="nothing {}"      close="town"      CLEAN
2c  n=20  opener="taken together"  close="town"      CLEAN
2d  n=10  opener="provision at"    close="eats"      CLEAN
3a  n= 8  opener="at {}"           close="food"      CLEAN
3b  n=10  opener="want of"         close="stands"    CLEAN
3c  n=16  opener="enough food"     close="in"        CLEAN
3d  n=17  opener="in the"          close="eating"    CLEAN
```

CLEAN means zero on every one of: semicolon · colon · em dash · question · exclamation ·
parenthesis · `shapes.antithesisRate` · `CONTRAST_SHAPES` (all eight members) · triad ·
`, which` · doubled adjective · `There/It is` opener · dialogue quote · future indicative
(`will`/`shall`, a C4 **FAIL** channel) · C3's historical lexicon (`had|were|was|used to|once|
formerly|no longer`) · `SPECIFICATIONAL_COPULA` (both alternatives) · `BARE_RELATIVE` ·
`RECORD_CITATION` · digit or percent · participial opener · abstract-noun closer ·
pronoun closer · `-ly` adverb (none is a `NOT_ADVERBS` member, so the count is a true zero) ·
under 8 words · over 30 words · `PROVENANCE_LEXICONS` capacity, actor, spatial and dated ·
`SUPPLY_CLAIM_LEXICONS` route and processing · `QUANTIFIERS` · `BAND_PHRASES` +
`AUTHORED_MAGNITUDES` · `COUNT_NOUNS` · `CARDINAL_WORDS` · `DUTY_STEM_NOUNS` ·
`OFFICE_NOUN_CANDIDATES` · the store-class noun list · the spine's tested fields and every
event word beside them.

**Lengths** `10 · 19 · 9 · 8 · 17 · 12 · 20 · 10 · 8 · 10 · 16 · 17` — mean 13.00,
**sd 4.282 (population) / 4.472 (sample)**, min 8, max 20. Round 3 read 3.13 / 3.27. The floor
is the eight-word wall of F1 and the ceiling is what one licensed claim can honestly carry;
the spread is bimodal by design, not padded.

**Twelve distinct two-word openers, and none collides with a spine's.** First words:
`more · what · consumption · food · out · nothing · taken · provision · at · want · enough · in`.
The three spines' first words are `settlement` (from the slot), `the` and `neither`. Nothing
in this set opens on any of the three, so `openers.sameOpenerAsPreviousRate` reads **0 on all
36 composed units** — the improvement round 3 won is preserved, and it constrains the authoring:
a face may not open on *The*, on *Neither*, or on the slot.

**The band arm.** The exceedance profile is a property of the GRAIN, not of these words: a
one-sentence unit reads a structural zero on every consecutive-pair and per-sentence-rate metric
whose exemplar band has a floor above zero. It is identical for all twelve and identical to
round 3's (13 of 21 exceeded against a budget of 14; deepest 1.597 band-widths on
`wordsPerSentence.neighbourVariation` against an entry ceiling of 1.75). The gate confirms it:
band FAIL 0 · WITHHELD 0. F5 below carries the chair row.

## 4. PER FACE — THE CLAUSE THAT LICENSES EACH CLAIM, AND THE LAW BEHIND EACH SUBSTITUTION

Every face asserts exactly one typed claim: **that `foodSecurity.label` holds**, in the present,
as a standing fact of the record. No face carries a second field, a cause, a count, a season, a
modality, a standpoint or a holder. The three variants are three ANGLES on that one claim and
their slots are unchanged from round 3 (§22 (a): a rewrite changes the words, never the sentence
the slot stands for).

### Variant 1 — the two quantities set against each other

- `[plain]` **More is eaten at {settlement} than the town takes in.** (10) — the shortfall as a
  comparison written as a measurement in words, which is what R-DA-11 licenses in place of a
  figure. **Carried unchanged from round 3 by judgment:** it is the sharpest form the plain row
  can take, and §21.4 forbids replacing a lawful line with no law behind the change.
- `[face]` **What is raised on {settlement}'s ground and what is carried to it fall short of what
  the town eats.** (19) — the long line. Both arithmetic sources are named and the compound
  subject asserts that their SUM falls short, which is `:329`'s net class exactly. *Substituted
  for round 3's 20-word face and the law is R-DA-03 and the register card's "a qualification is a
  sentence, never a tail": round 3 carried an interpolated `, taken together,` between subject and
  verb, and this states the same sum with no interpolation and no comma at all.* `fall short of`
  is a literal measure.
- `[face]` **Consumption at {settlement} outruns what the town draws in.** (9) — the
  administrative vocabulary of the set, and its shortest complete comparison. `outruns` and
  `draws in` are literal; nothing inanimate is given intent (R-DA-11's third barred class).
  *Substituted for round 3's `Food reaching {settlement} stops short of the town's own eating.`
  under R-DA-10 (vary the noun across the pool): round 3 spent `food` in three of its four
  variant-1 faces.*
- `[face]` **Food at {settlement} runs behind the town's eating.** (8) — the short line of the
  pool, at the exact floor the instrument permits (F1). *Substituted under §21.4's own rule read
  the other way: this is denser than round 3's `Beside what is eaten, the food {settlement} comes
  by does not stand level.` (13), and density that rewards the reader is part of the ceiling.*
  `runs behind` is a measurement in words. It carries `Food` forward as its first word, which is
  spine 1's own noun.

### Variant 2 — out of what it raises and takes in, the town is not fed

- `[plain]` **Out of what is raised and what is carried in, the town at {settlement} is not fed.**
  (17) — both sources named, so the claim is the net one. The passive is deliberate: *does not
  feed itself* spends an agency and *cannot feed itself* spends a capacity the field does not
  hold, and `can feed` / `could feed` are literal members of `PROVENANCE_LEXICONS.capacity`, a C3
  **FAIL** channel. `is not fed` asserts only the standing state. *The fronted adverbial was
  lengthened from round 3's 14 by naming both sources in the same shape (`what is raised and what
  is carried in`), which is the parallel the clerk's ear wants and the spread R-DA-05 asks for.*
- `[face]` **Nothing {settlement} raises or takes in is enough to feed the town.** (12) — a
  negative existential over the food, not an antithesis: no `not X but Y`, no `rather than`, no
  `, not`, measured zero on `shapes.antithesisRate` and on all eight `CONTRAST_SHAPES` members.
  `Nothing` is not a `QUANTIFIERS` member and the word-boundary locator does not read `no` inside
  it; it is also an explicit `NOT_PARTICIPLES` member, so its `-ing` ending raises no participial
  opener. `enough` is a sufficiency word, not a count, and not a band phrase.
- `[face]` **Taken together with what is brought to it, what {settlement} raises does not come to
  the feeding of the town.** (20) — the long line of the variant; `Taken together` states in the
  open that the SUM is the subject, which is the net class again, and the nominal `the feeding of
  the town` is a different rhythm from the finite verbs of its three siblings. *`brought` rather
  than `carried` under R-DA-10: `carried` is already spent twice in this pool.*
- `[face]` **Provision at {settlement} does not answer what the town eats.** (10) — the antique
  air in the noun and never in the syntax, which is R-DA-18 exactly. *Sharpened from round 3's
  `... does not answer the town's need.` under §21.1: `need` is an abstraction the field does not
  hold, `what the town eats` is the licensed fact.*

### Variant 3 — the condition named flat

- `[plain]` **At {settlement} the town is short of food.** (8) — the flattest statement the card
  licenses: the state, named, with nothing set against it, and the short line the register card
  asks to exist. *Compressed from round 3's `At {settlement} the town is short in the matter of
  food.` (11) under §21.4: the four intervening words carried no fact.*
- `[face]` **Want of food is where the town at {settlement} stands.** (10) — `want of` is the
  register's own noun for a lack. `is where` is deliberately not `is what`: the specificational
  copula `\b(is|are|was|were)\s+(what|who|the only|the one)\b` entails exhaustivity over a column
  and would be withheld by arm X on an open column. State, never fate (A2). **Carried unchanged
  from round 3 by judgment**, on the same ground as `1a`.
- `[face]` **Enough food for the town lies beyond what {settlement} raises and beyond what it
  takes in.** (16) — sufficiency stated as out of reach, with the two sources as the respect in
  which it is out of reach rather than as a second fact. The repeated `beyond` is the office's own
  parallel, which the register card licenses in as many words: *the WORD may recur; the FACT must
  not.* *Grown from round 3's 8-word `Enough food is beyond {settlement} as things stand.`, whose
  `as things stand` did no work the present tense was not already doing.*
- `[face]` **In the matter of food the town at {settlement} does not keep level with its own
  eating.** (17) — the clerk's own frame, and `keep level with` is the measurement in words in a
  fourth vocabulary. *Substituted for round 3's `What lies in hand at {settlement} does not stretch
  to feed the town.` and the law is the card's `may NOT`: `in hand` reads as a HOLDING, the
  attached spine asserts that the town HOLDS food against a bad year, and a face that appears to
  deny the spine's own tested field is exactly what the card's last clause bars. This is the one
  substitution this round made on a licensing ground rather than a craft one, and it removes a
  latent refuter finding that neither the gate nor round 3 had named.*

### The thread (owner, 2026-09-08 ~21:4x; MOVE-GRAMMAR §1.4.1)

The composer places this modifier, not the writer, so every face was read after each of the three
spines and after a foreign modifier. **Every face carries FOOD forward** — the noun all three
spines hold (spine 1 *holds food*, spine 2 *a place for grain*, spine 3 *a failed harvest*) —
either as the word itself or as `eats` / `eating` / `feeding`, and every face also carries **the
town** or **{settlement}**, which spines 1 and 2 hold. No face changes subject in the middle of
the passage and hands nothing back: where the grammatical subject shifts (`Want of food`,
`Enough food for the town`, `Consumption`), it re-anchors on the spine's own noun inside the same
clause, so no face needs to be the passage's one turn outward and none is placed last by need.
**No face opens on a pronoun, a bare demonstrative, or a possessive whose referent is outside the
sentence**, so each reads as well after a foreign modifier as after its own spine, and each
stands alone. `stores: import-fed` and this pool are mutually exclusive on the label (`Deficit`
versus `Import-Dependent`, `foodGenerator.js:344-348`), so the two modifiers never co-occur.

## 5. REFUSALS — a refusal is a result

**R1 — the 24 remaining WITHHELD composed units.** §1, now with an executed counterfactual behind
it rather than an argument. Carried from round 3; the disposition is unchanged and the ground is
stronger.

**R2 (pre-existing, carried, waived at the gate) — the ATTACH object-class refusal, T-F12.**
`DOSSIER_STATE DS-DEF-2 :: stores: short: ATTACH Disasters & Famine: granary AND hospital` — the
spine's key and this modifier's key name the same civic object class `store`, which the projector
reads as a restatement the field guard cannot see; waived only under `--taste`. This is an
ATTACH-LINE refusal, not a wording refusal: no rewording changes which key the annex's ATTACH
names, and this packet does not write that line. The set is written so the two claims sit on
different things regardless — the spine's is the HOLDING, this pool's is the FLOW — and this
round hardened that separation by removing `in hand` (§4, variant 3's fourth face).

**R3 — no face may name a store, a granary, a reserve, a stock, a loft or a barn.** The pool KEY
reads `stores: short`, but the card's `reads` is `foodSecurity.label` and its `may claim` is that
the label holds. A stockpile level is a different field and the granary is the attached spine's
own tested field. **The key string is data; it licensed nothing.** Twelve faces, zero store-class
nouns, measured.

**R4 — no famine, hunger, plague, sickness or harvest word.** The class is
`{Deficit, Deficit — Active Famine}` and a face must be true of both; `Deficit` alone carries no
famine, and famine is an event class `MOVE: PRESENT` cannot take in any case. `sick`, `hospital`,
`church` and `harvest` are additionally the attached spine's tested or named fields.

**R5 — no season, no date, no rate.** The card's `may NOT` names a season outright; `each winter`
and `year on year` additionally assert a time band or a rate, which R-DA-16 gives to the COUNT and
TIME moves this pool does not carry, and `PROVENANCE_LEXICONS.dated` would fail C3's lexical half
outright. Round 3's `as things stand` is gone for the weaker reason that it did no work.

**R6 — no keeper, no citation, no provenance move.** `source: (none) · standing
SOURCE-UNRESOLVED`: the card states that NO citation is licensed and that arm A13 refuses a face
naming a record holder here. MOVE-GRAMMAR §4.4.3 licenses the provenance move only where the
census's `source` column resolves the holder for this town; it does not. Register card amendment
S3 is unreachable from this pool until SEAM car 5b lands the holder census. `RECORD_CITATION`
reads zero on the set, and the near-miss is worth naming: *the record carries it so* and *the
account of food shows* both fire that regex on the bare noun.

**R7 — no capacity verb.** `can feed`, `could feed`, `can hold`, `could hold`, `has room for` and
`capacity for` are literal members of `PROVENANCE_LEXICONS.capacity` and take C3's **FAIL** channel
on a state-only field. The set carries no `can` and no `could` at all.

**R8 — no face under eight words.** Refused on measurement, not on taste: seven words costs 2.19
band-widths on `wordsPerSentence.shareUnder8` at the entry grain, over the 1.75 entry ceiling. The
set's floor is exactly eight, twice, which the instrument counts as NOT under eight.

**R9 — no `less X than Y`, no `not X but Y`, no `, not`, no `rather than`, no `and not`.** All
five are literal members of `CONTRAST_SHAPES`, and a sixth member (`never … so much as`) and a
seventh (`not …, it is`) are barred with them. A face carrying any of them would ADD an A3
finding to all three of its composed units, on top of the twelve the spine already owns.

**R10 — no face ends on `{settlement}`.** Mechanical: the closer test strips non-letters, so a
line closing on the slot is scored on the token `settlement`, which ends in `ment` and fires
`closers.abstractNounRate` at **8.60 band-widths**. **A wave-wide authoring hazard on every pool
whose bag offers `{settlement}`, and invisible to the author because the slot is not a word.**

**R11 — no face may open on `The`, on `Neither`, or on the slot.** New this round, and measured:
the three spines' first words are `settlement`, `the` and `neither`, and the fingerprint's
`openers.sameOpenerAsPreviousRate` compares FIRST WORDS across the composed unit's two sentences.
A face opening on any of the three reads 1.0 on that metric for three of its composed units
(2.50 band-widths). Opening on the slot is separately refused by T-F8 and arm A9. **This is a
per-ATTACH-SET constraint, not a per-pool one: it changes with whichever spines the ATTACH names,
and no card or annex line carries it today.**

**R12 — no synonym swap to move a reported column.** Three candidate substitutions in variant 3
(`victuals` and `provender` for `food`, a second verb for `stands`) would have cut the
within-variant sibling overlap from 555bp toward round 3's 385bp. They were REFUSED on R-DA-22
(*one term for one thing*; the reverse thesaurus is fault 17). The overlap column is reported
below as it fell out, not as it could have been gamed.

## 6. FINDINGS CARRIED UP (not refusals of a face)

- **F1 (carried, re-measured).** A `FORM: sentence` modifier face must be **8 to 30 words**: 7
  costs 2.19 band-widths on `shareUnder8` and 31 costs 2.29 on `shareOver30`, both over the 1.75
  entry ceiling. This set runs 8 to 20, mean 13.00, sd 4.28. Recommended for car 6 as the modifier
  band, ahead of the measurement. **The chair row inside it stands: at the ENTRY grain a
  one-sentence unit cannot carry the register card's short line below eight words at all; the
  short line is a POOL property here, not an entry property.**
- **F2 (carried, unchanged).** ARCH §2.5 refuses an ATTACH on a spine whose branch `tests` the
  modifier's field. This spine's BRANCH tests `granary/hospital/church` and passes, but the row's
  BADGE is scored at `DefenseTab.jsx:185` as
  `scores.disaster ?? r.economicState?.foodSecurity?.resilienceScore ?? …` — a **sibling field of
  the same root** as this pool's `label`, exactly the coarseness the card's own echo line warns
  of. Whether a badge read counts as a `tests` for the refusal is a chair question.
- **F3 (carried, sharpened).** The spine and this modifier are true together and read as a
  tension: the spine says the town holds food against a bad year, this modifier says the balance
  is short. `relation: addition` is the claim-free floor the card assigns because no RELATION TABLE
  row joins the two fields (§4.5). Every face lands the addition on the FLOW and never on the
  HOLDING. **Honest disposition: this is a `consequence`-shaped pair seated as `addition` for want
  of a table row.** No face was softened to hide it (§21.4), and this round removed the one face
  (`What lies in hand …`) that blurred the two.
- **F4 (carried, CONFIRMED twice).** The gate's per-face band arm and the composed walk disagree
  about who owns a finding: all twelve are lawful at the face grain while 24 of 36 composed units
  carry a spine-sited finding. **A modifier pool can be lawful and its every composed unit
  withheld.** The taste's staffing table wants a column separating *the modifier's findings* from
  *the findings the modifier inherits from its spine*, or a modifier lane reads its spine's debts
  as its own for a third round. The cheap form: `taste-measure.mjs` already knows each piece's
  `role` and each finding's site — attribute a walk finding to the piece whose text holds it, and
  print the two counts. **This round supplies the number that makes the column trivial to fill:
  findings sited in a FACE read alone = 0 of 12, in both rounds.**
- **F5 (carried).** `wordsPerSentence.neighbourVariation` reads **1.597 band-widths outside on
  every single-sentence face**, because burst is structurally zero at one sentence and the exemplar
  floor is 0.495. It is under the 1.75 entry ceiling by 0.153 today, so twelve of twelve pass, but
  the margin is an artefact of the grain and any band re-cut that raises that floor turns **every
  one-sentence modifier face in the corpus red at once**. It also costs one of the 13 exceedances
  against a budget of 14. **A chair row, and a cheap one: exclude consecutive-pair statistics at
  the entry grain, as MOVE-GRAMMAR §0's reading-order caveat already does for the register grain.**
- **F6 (carried from round 3, now with an eleventh trap).** Round 2's C3 breach was a five-letter
  substring inside an idiom (`had` in *to be had*) that no reading of the wording as prose would
  find. The traps this set navigates are of that shape: the `{settlement}` closer (R10); `can feed`
  inside a capacity idiom (R7); `less … than` fired by a rendered town name's length (R9); the
  specificational `is what` (variant 3's second face); `the record carries` firing
  `RECORD_CITATION` on a bare noun (R6); and now **the spine's first word deciding which words a
  face may open on (R11)**. **Recommendation for the wave, restated and now sized: publish a
  one-page LEXICAL TRIPWIRE CARD beside the licence card — eleven word-level traps with their
  band-width costs — because they cost nothing at authoring and a full round at the gate.**
- **F7 (new, and a regression this round declares rather than hides).** Within-variant sibling
  overlap rose from 385bp to 555bp (max 1667 → 2000) while whole-pool overlap FELL from 592bp to
  506bp (max 5000 → 4286). The rise is arithmetic and concentrated in variant 3: `contentWords`
  stops `town`, `settlement`, `what` and `than`, so an eight-word plain row such as `At
  {settlement} the town is short of food.` has a content set of exactly two words and any shared
  token is a large ratio. Widening the length spread to satisfy R-DA-05 therefore RAISES this
  column by construction. **The two measures pull against each other at the entry grain, and the
  sitting should know that before it cuts A5's floor from the shipped distribution.** No gate row
  moved: `armA5`'s only shipped floor is 10000bp AND `sameOpener` AND `sameSegments`, and
  sameOpener pairs are 0 in both rounds, so the arm reports nothing either way.

## 7. MARKS, TAGS, AND WHAT WAS EXECUTED

`covert: no` and `audience: player (no mark)`, so no variant carries a `dm-only` mark and the
covert-pool rule does not reach this pool. No `[grammar: Vn]` tag is written: ARCH §2.5 scopes
that tag to spine and turn variants, not to a modifier pool. All three variants are `V1` (PRESENT
alone) by licensing and not by habit — V2 needs a structural-consequence field, V3 a
`none-exists` field, V4 a named object, V5 an institution row, V6 an unresolved state value, V7
event provenance and V8 a `not-held` field, and the card holds none of them; MOVE-GRAMMAR §2.1's
"min(k, 8) distinct level-1 grammars per pool" is **NOT-EXECUTABLE on a one-move modifier pool**,
which is a chair row rather than a defect of this set.

**Executed this round** — `node scripts/prose-licence-card.mjs DS-DEF-2 'stores: short'` in the
read-only dock; whole-file reads of `src/domain/prose/entryLexicons.js`,
`src/domain/prose/proseFingerprint.js`, the relevant arms of `src/domain/prose/entryWalker.js`
(`armQualify`, `armExhaustivity`, `bandReadings`, `sentencesOf`) and
`src/domain/prose/composedWalker.js` (`armA3`, `armA5`, `armA6`, `armA9`, `siblingDistance`,
`contentWords`, `ALTERNATIVE_STOP`, `openerOfText`), `scripts/taste-measure.mjs` `unitsOfPool`,
`src/generators/foodGenerator.js:320-362`, and the whole `DS-DEF-2` section of
`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` (all 28 pool keys, the six `Disasters & Famine`
spine pools, and both shipped modifier rows); and a transcription of those detectors run outside
the dock over (a) round 3's twelve wordings × three spines, **reproducing the gate's Q = 12,
A3 = 12, WITHHELD 24, PASS 12, FAIL 0 exactly**, (b) this round's twelve at the face grain, (c)
all thirty-six composed units, and (d) the slot-and-band counterfactual of §1. **No file was
written outside this packet; no dock byte was written; no test was run; nothing but the licence
card script executed in the dock.**
