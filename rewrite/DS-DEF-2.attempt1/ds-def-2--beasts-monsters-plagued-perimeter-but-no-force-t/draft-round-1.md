1. `[ledger]` `[plain]` A wall closes the town, and outside it the country is plagued with beasts. Neither garrison nor militia stands on {settlement}'s wall.
   - `[face]` Monster-ridden country lies about the town, and the perimeter stands. Under arms {settlement} puts nothing on that perimeter.
   - `[face]` Garrison and militia are both wanting, and the wall carries neither. Beyond that wall the country about {settlement} is plagued.
   - `[face]` The works about the town stand and go unheld. Outside those works the country about {settlement} is beast country.
2. `[visitor]` `[plain]` Beast country ends at the wall about {settlement}, and the wall itself is unheld.
   - `[face]` Round {settlement} plagued country comes up to a wall that stands without garrison or militia.
   - `[face]` Nothing under arms holds the works at {settlement}, and the country beyond them is monster country.
   - `[face]` The circuit about {settlement} stands unmanned, and outside it the country is plagued.
3. `[unfolding]` `[plain]` The wall goes on standing about {settlement} and goes on unmanned in a country of beasts.
   - `[face]` Outside {settlement} the country stays plagued, and the perimeter stays unheld.
   - `[face]` Monsters remain in the country about {settlement}, and the walled town keeps neither garrison nor militia.
   - `[face]` Beasts go on in the country about {settlement} and the works go on empty.

--- NOTES

**Pool.** DS-DEF-2 · `Beasts & Monsters: plagued, perimeter but NO force to hold it` · draft round 1 · seat Opus 5 (Fable-unvalidated), writing for the Fable chair.
Card printed by `node scripts/prose-licence-card.mjs DS-DEF-2 'Beasts & Monsters: plagued, perimeter but NO force to hold it'` in `$SC/laneRW-DEF2`. The block's own annex section re-read whole at `laneRW-DEF2/docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:2568-2726` for arms A1 and A11 — the six other `Beasts & Monsters` spine sets, the six `Invasion & War` sets, and the four `Internal Security`, four `Economic Survival` and five `Disasters & Famine` sets that share the defense page.
**3 variants · 12 faces (3 `[plain]` + 9 `[face]`) · every claim identical across all twelve (MOVE-GRAMMAR §3.4 arm C: the claim is what the seed may never vary; the grammar is what it must).**
ROLE `spine` · FORM `sentence` · MOVE none declared · RELATION none (a spine takes no relation) · ATTACH empty · angle `ledger unfolding visitor` · audience player, no mark · echo: spine mounts 1 (defense), modifier mounts 0 — **no modifier mounts on this spine today, so the composed unit is the spine alone.**
**Slot set: `{settlement}`, exactly once in every one of the twelve faces** — never sentence-initial (ARCH §2.5 T-F8: a `FORM: sentence` face may not open on a `proper`-typed slot), never sentence-final (`closers.abstractNounRate` reads the stripped slot as `…ment`). `{band}` and `{route}` are in the bag and the card records them as NOT FILLED at this block's call sites; a face naming either would be unreachable at every draw (arm D).

**Sentence-count spread held, deliberately (MOVE-GRAMMAR §3.4, A11: "where they differed in sentence count they keep differing").** Variant 1 is two sentences as shipped; variants 2 and 3 are one each, as shipped. **In every two-sentence face the `{settlement}` slot sits in the SECOND sentence**, because `armQualify` (`src/domain/prose/entryWalker.js:889-906`) calls `consider` on every sentence after the first and returns early only where that segment itself carries a `{slot}` or a band reading (`:892-895`). The pool's `reads` string resolves through `claimTokensOf` to the token `js)`, so the words-half of the second-field test cannot pass on this pool at all — the slot is the only licence available, and it is used. **Expected arm Q findings on this packet: zero.** All three shipped variants take one today (§4).

**Words per face** (whitespace tokens; `{settlement}` and `{settlement}'s` count one):

| variant | `[plain]` | `[face]` 1 | `[face]` 2 | `[face]` 3 |
|---|---|---|---|---|
| 1 · `[ledger]` (2 sentences) | **22** (14 + 8) | **18** (10 + 8) | **20** (11 + 9) | **19** (9 + 10) |
| 2 · `[visitor]` (1 sentence) | **14** | **15** | **16** | **13** |
| 3 · `[unfolding]` (1 sentence) | **16** | **11** | **16** | **14** |

Mean **16.2** · min **11** · max **22**. No sentence under 8 words and none over 30, so `wordsPerSentence.shareUnder8` and `shareOver30` both read 0 on every face. **I did not push the faces toward the middle of that window** (§21.4: compression that rewards the reader is the ceiling; a one-claim sentence padded to buy a band position trades density for plainness, which is the named regression).

---

## 1. THE ONE CLAIM, AND WHAT LICENSES EACH LIMB OF IT

The card gives this pool ONE read — `beastsRowSituation(family, perimeter, force)` via `BEASTS_ROW_POOL` — and ONE licensed value: `plagued country, perimeter without force`. Grounded at `src/domain/display/stateProse/defenseStateProse.js:336-386` and its call site `:591`, that value is exactly three limbs of one typed state:

- **L1** the corpus family is `plagued` (`MONSTER_FAMILY_OF`, the producer's `plagued` tier);
- **L2** `perimeter` is true — the walls predicate `defenseProfileHasWalls`, never a presence check on `institutions.walls`;
- **L3** `force` is false — and `force` at the call site is `garrison || militia`, so the licensed absence is of BOTH, and of nothing else.

Every face carries all three limbs and nothing beyond them. `may claim: that (=== plagued country, perimeter without force) holds, as a STANDING fact of the record` is the whole licence, and it is the same licence twelve times.

| face | L1 the plagued country | L2 the perimeter | L3 neither garrison nor militia | card clause |
|---|---|---|---|---|
| 1-plain | `the country is plagued with beasts` | `A wall closes the town` | `Neither garrison nor militia stands on {settlement}'s wall` | `predicate === plagued country, perimeter without force`; `may claim … as a STANDING fact`; MOVE PRESENT (MOVE-GRAMMAR §1.2 row 1 — a standing configuration field licenses a structural clause) |
| 1-f1 | `Monster-ridden country` | `the perimeter stands` | `Under arms {settlement} puts nothing on that perimeter` | as above; `bag … FILLED: {settlement}` |
| 1-f2 | `the country about {settlement} is plagued` | `the wall carries neither` | `Garrison and militia are both wanting` | as above |
| 1-f3 | `the country about {settlement} is beast country` | `The works about the town stand` | `go unheld` | as above |
| 2-plain | `Beast country` | `the wall about {settlement}` | `the wall itself is unheld` | as above |
| 2-f1 | `plagued country` | `a wall` | `stands without garrison or militia` | as above |
| 2-f2 | `the country beyond them is monster country` | `the works at {settlement}` | `Nothing under arms holds` | as above |
| 2-f3 | `the country is plagued` | `The circuit about {settlement}` | `stands unmanned` | as above |
| 3-plain | `in a country of beasts` | `The wall goes on standing` | `goes on unmanned` | as above |
| 3-f1 | `the country stays plagued` | `the perimeter` | `stays unheld` | as above |
| 3-f2 | `Monsters remain in the country about {settlement}` | `the walled town` | `keeps neither garrison nor militia` | as above |
| 3-f3 | `Beasts go on in the country about {settlement}` | `the works` | `go on empty` | as above |

**The `{settlement}` slot in all twelve** is licensed by `bag: {band: RESERVED, route: proper, settlement: proper} · FILLED at this block's call sites: {settlement}`.

**The angles, realised without a second claim.** `[ledger]` is the flat two-part entry: the arrangement, then what stands in it. `[visitor]` is realised as **word order only** — the outside-in order an approach meets the three limbs in (country, then perimeter, then the absence) — which MOVE-GRAMMAR §3.4 lists among the three things a grammar MAY spend. `[unfolding]` is realised as **durative aspect on a standing fact** (`goes on standing` · `stays plagued` · `remain` · `go on empty`), never as a trend: MOVE-GRAMMAR §1.2 row 2 gives HISTORY an event-provenance field only, and this block holds none.

**THE THREAD (MOVE-GRAMMAR §1.4.1).** All four two-sentence faces hand a noun forward from the spine's own first sentence: `wall` → `wall` (1-plain), `perimeter` → `perimeter` (1-f1), `wall` → `wall` (1-f2), `works` → `works` (1-f3). In each, the second sentence is also the passage's one turn outward — from the town's own arrangement to the country beyond it — and it sits last. Nothing changes subject mid-passage and hands nothing back.

**Sibling distance (A11).** All twelve faces are pairwise distinct on their first two words: `A wall` · `Monster-ridden country` · `Garrison and` · `The works` · `Beast country` · `Round {settlement}` · `Nothing under` · `The circuit` · `The wall` · `Outside {settlement}` · `Monsters remain` · `Beasts go`. The four second sentences of variant 1 are distinct from each other and from all twelve firsts: `Neither garrison` · `Under arms` · `Beyond that` · `Outside those`. **Close kinds vary across the pool** (`CLOSE_KINDS`, `entryLexicons.js:307-322`): civic nouns (`wall`, `perimeter`, `militia`), standing facts (`stands`), condition words (`unheld`, `empty`, `plagued`, `kept`, `neither`), objects (`beasts`, `country`) — no pool-wide single kind, no pronoun closer, no abstraction closer.

**Arms A1 and A11 against the block's other spines.** This pool neither restates nor contradicts its neighbours. `plagued, perimeter AND organized force` owns `thick with creatures`; `plagued, NO perimeter and NO force` owns `embattled country`; `frontier, credible deterrence` owns `active frontier`; `settled` owns `the country around … very little`. None of those phrases, and neither of those two condition words, appears here. DS-DEF-11's `country: pressed` pools read the same producer field on the same page and own `beset · harried · pressed` and the record-grade family (`grade · entered · marked · the books`); this packet uses none of them, so a reader meeting both blocks meets two vocabularies rather than one template.

---

## 2. THE SHAPES HELD AT ZERO, EACH AGAINST ITS DETECTOR

Checked by hand against the published lexicons (`src/domain/prose/entryLexicons.js`) and the fingerprint's own regexes (`src/domain/prose/proseFingerprint.js:115-149`).

- **No `, which`** (`shapes.whichTailRate`; MOVE-GRAMMAR §1.4 wall 6). The shipped variant 1 carries one; see §4.
- **No digit, percent, em dash, exclamation, question, parenthesis, semicolon or colon.** The semicolon and the colon are refused for cause: `armQualify` splits each sentence on `;` and considers every part after the first (`:914-917`), so a semicolon manufactures the exact finding this packet exists to avoid.
- **No quantifier** from `QUANTIFIERS` (`every · all · each · only · none · everyone · everybody · everything · any · no · whole · entire · without exception · to a man · universally`). Every negation is carried by `neither … nor`, `without`, `nothing` or `un-` prefixes. `nothing` is deliberately not a member; bare `no` and `whole` each killed a draft this round (`no garrison`, `the whole way round`).
- **No band phrase and no authored magnitude.** `nobody` and `no one` are `quantityWords(0)` and would put a band on a boolean field; both are refused, twice over (`nobody to man it` was the shipped variant 1's phrasing). No count noun from `COUNT_NOUNS` appears at all, so `armC1` has nothing to pair.
- **No duty predicate or duty stem** (`counts · musters · registers · assesses · tithes · levies · tolled …`, and the bare stems `muster · count · toll · register`). `muster` is the natural word for the absent force in this register and is refused for that reason: it raises a C2 NOTE as a stem and a FAIL as a predicate.
- **No office noun** from `OFFICE_NOUN_CANDIDATES`. `garrison` and `militia` are the call site's own two institution reads, not offices, and are named only in the absence.
- **No member of `PROVENANCE_LEXICONS`** — capacity (`can hold`, `could hold`, `has room for`), spatial (`ringed by`, `built along`, `set back from`, `on the far bank`), actor (`ordered`, `founded`, `rebuilt`), dated (`in the year`, `years ago`). `could hold` killed a face this round; `about`, `round`, `outside` and `beyond` claim no geometry the field lacks, since a perimeter's inside and outside are the object's own nature.
- **No member of `SUPPLY_CLAIM_LEXICONS`** — `pressed` above all, which is DS-DEF-11's pool-key word and a `processing` member.
- **No contrast shape** (`CONTRAST_SHAPES`, and `shapes.antithesisRate`): no `rather than`, no `not X but Y`, no `, not x`, no `and not x`, no `less … than`, no `never … so much as`.
- **No specificational or cleft copula** (`SPECIFICATIONAL_COPULA`): no `is what`, `is who`, `is the only`, `is the one`, and no face of the form `The x … is the y`. Three natural drafts died here (`What stands at {settlement} is a wall …`).
- **No record citation** (`RECORD_CITATION`) and no record as grammatical subject. See refusal R1.
- **No bare relative** (`BARE_RELATIVE`), no `will` or `shall` (`FUTURE_INDICATIVE`), no `was · were · had · used to · once · formerly · no longer` (`armC3`'s semantic half, `entryWalker.js:547`).
- **No `-ly` adverb** (`shapes.adverbsPerSentence`), **no `-ing` opener** (`shapes.participialOpenerRate` — `Monster-ridden` is a past participle compound and outside `/ing$/`), **no `There is` / `It is` opener**, **no doubled-adjective pair** of the `\w+(ed|ing|ous|ful|less|ive|al|ant|ent|y) and \w+…` shape, **no comma triad** (no face carries more than one comma).
- **No pronoun closer and no abstract-noun closer.** Twelve last words: `wall · perimeter · plagued · country · unheld · militia · country · plagued · beasts · unheld · militia · empty`.
- **No evaluative adjective on a place** (R-DA-10). `good work` is refused; see §4.

---

## 3. WHAT THE FOUR FACES OF EACH VARIANT DO DIFFERENTLY

Not paraphrase: each face changes the vocabulary of at least two of the three limbs, or changes the construction of all three.

- **Variant 1.** `[plain]` coordinates the arrangement and closes on the flat correlative negation. `[face] 1` opens on the country as a compound adjective, gives the perimeter a bare two-word beat (`and the perimeter stands`), and fronts `Under arms`. `[face] 2` inverts the order entirely — the absence first, the perimeter second, the country as the turn outward — and closes the first sentence on an ellipsis (`carries neither`). `[face] 3` uses the anaphoric `stand and go unheld` and lands the second sentence on the bare naming `is beast country`.
- **Variant 2.** `[plain]` runs the approach inward and closes on `the wall itself is unheld`. `[face] 1` fronts the place phrase and uses a `that`-relative for the absence. `[face] 2` fronts the absence and turns outward inside one sentence. `[face] 3` takes a third perimeter noun (`circuit`) and a third absence word (`unmanned`), and inverts the tail.
- **Variant 3.** `[plain]` doubles the durative auxiliary (`goes on … goes on`). `[face] 1` doubles a different one (`stays … stays`) and is the pool's shortest face. `[face] 2` uses `remain` once and carries the perimeter as an attributive (`the walled town`). `[face] 3` uses `go on … go on` across two different subjects.

---

## 4. WHAT THE SHIPPED ROWS CARRIED THAT THIS DRAFT DOES NOT — EACH DROP WITH ITS LAW

**The ruling I am writing under, stated so it can be vetoed.** The brief binds me to keep every claim a variant carried and add none, and separately to license every claim by the card and by nothing else. Where the shipped text carries a claim the card refuses, the two collide. I resolve it by R-DA-15's own words — *"an unlicensed office/count/exemption is not a claim the pool was entitled to hold (ruling 5 requires its removal — the B-CLAIM bar is not engaged)"* — read with §22's confirmed edge (*"today's exact wording leaves the product when it fails the voice; its slot survives; its text stays in the annex history"*) and R-DA-20 (*a sentence asserting what the fields do not hold is rewritten in place*). **No slot is removed, no variant merged, no tag touched, the order unchanged; only unlicensed claims are dropped, and every one is named here.** If the chair reads the brief the other way, these are the rows to send back.

**Variant 1, shipped:** *"{settlement} has a wall and nobody to man it. The line is a chokepoint on paper and a chokepoint requires people standing in it, which this town cannot supply for more than a night."*

- `, which this town cannot supply` — **dropped.** MOVE-GRAMMAR §1.4 wall 6 and R-DA-03: a QUALIFY is never a `which` tail. `shapes.whichTailRate` scores it directly.
- `a chokepoint requires people standing in it` — **dropped.** A life-general proposition licensed by no field: MOVE-GRAMMAR §1.3's non-move MEANING, and R-DA-12's generalisation test. It is also the gnomic closer Part B §16(6) names as a machine signature.
- `cannot supply for more than a night` — **dropped.** A capacity claim on a state-only field (`PROVENANCE_LEXICONS.capacity`; R-DST-B) and a duration the card refuses under `may NOT: a count`.
- `the line … on paper` — **dropped.** A verdict on the record against the world (MOVE-GRAMMAR §1.3, VERDICT / UPLIFT), and `the line` beside `a wall` is a second civic object of the class `wall`, which the card refuses by name.
- `nobody to man it` — **reworded, not dropped.** The claim (no force) is kept in all four faces; the band word `nobody` is not, because `quantityWords(0)` on a boolean read is a band the field does not hold.

**Variant 2, shipped:** *"A stranger walks the perimeter at {settlement} and finds long stretches of good work with nobody on them, in a country where that matters a great deal."*

- `A stranger walks … and finds` — **dropped.** A PERSON with a recorded act, licensed only by a ROLE field (MOVE-GRAMMAR §1.2 row 3); this pool holds none. The register card is flat about it: no persona, no assigned reaction, the compiler shows only through what the record holds. The card's own `may NOT: … a standpoint` says the same thing. **The `[visitor]` tag survives untouched and the angle survives as word order** — the outside-in order an approach meets the three limbs in — which §3.4 licenses a grammar to spend. See refusal R3 for the tension this leaves open.
- `long stretches of good work` — **dropped on both halves.** `long stretches` asserts an extent that `defenseProfileHasWalls` does not hold (it is a boolean predicate), and `good work` is an evaluative adjective on a civic object (R-DA-10). A draft of `[face] 2` carried `Long stretches of wall` for two rounds of my own drafting before I refused it on the first ground.
- `in a country where that matters a great deal` — **dropped.** A verdict closer, and `that matters` is a second fact about the fact (MOVE-GRAMMAR §1.3; R-DA-12). The country limb is kept in every face as the licensed L1.

**Variant 3, shipped:** *"The works at {settlement} are doing less each season as the watch thins, and the thinning is not being reversed."*

- `each season` — **dropped.** The card refuses a season by name. `each` is also a `QUANTIFIERS` member.
- `are doing less … as the watch thins` — **dropped.** A trend and a cause in one clause. HISTORY takes an event-provenance field only (MOVE-GRAMMAR §1.2 row 2), and R-DST-B is the licensing law: a standing configuration field licenses a structural clause and never a historical one.
- `the watch` — **dropped.** The read is `garrison || militia`. The watch is an institution this pool does not read, and DS-DEF-11 owns a `watch:` pool of its own; naming it here would restate a neighbour's field (arm A1).
- `the thinning is not being reversed` — **dropped.** A claim about what is not happening over time, on a field with no time in it; STATE never FATE (A2, THE PROMISE).
- **What is kept is the aspect.** `[unfolding]` on a standing configuration field can lawfully be a condition that goes on standing, and that is what all four faces do.

---

## 5. REFUSALS (a refusal is a result)

- **R1 — THE SOURCE CITATION, REFUSED; the provenance count for this pool is 0, deliberately.** The card prints `source: muster · standing LICENSED — a citation of this holder is licensed where the provenance budget allows`. It is not allowed here, on three independent grounds. (i) Register card S3 licenses a citation only where a clerk would cite — two accounts that disagree, a count from an interested party, a record whose keeper is a power — and none holds: there is no second account, the fact is not a count, and the muster roll's keeper is not a power on this settlement. (ii) Part B §24 sets the budget at a ceiling of one citation per unit and records that the exemplar registers with raw text cite at **0 per 786 sentences**, so a citation habit is a refuter's finding. (iii) **The holder the card names is the thing the fact says does not exist.** `force` is `garrison || militia` and it is false; citing the muster roll for the absence of a muster is the shape MOVE-GRAMMAR §4.4.3 calls a finding — the office does not cite its own books. **Chair-vetoable:** if the sitting wants the move exercised on this pool, the lawful form is `…, and the muster roll carries neither.` on ONE face of twelve, never four; the DM page is where S3 puts the keeper and its interest.
- **R2 — `{band}` AND `{route}`, REFUSED.** Both are in the bag and the card records them as not filled at this block's call sites; a face naming either is unreachable at every draw (arm D, "a slot the composer never fills"). `{settlement}` alone is used, once per face, so arm A6's slot-set identity holds across all twelve.
- **R3 — THE `[visitor]` PERSONA, REFUSED; AND THE ONE LAW THIS POOL CANNOT FULLY MEET, DECLARED.** The card's `may NOT` list refuses a standpoint outright, while the pool's `angle` line records `visitor` as one of its three authored angles. I cannot satisfy both readings of that card at once, so I state which way I went and why: **no face asserts a person, an act of perception or a reaction**, and the `[visitor]` angle is carried by word order alone. **If the chair reads `angle: visitor` as licensing an asserted observer, variant 2 is the row to send back** — under that reading the shipped `A stranger walks … and finds` would be lawful and my rewrite drops a licensed claim; under the reading I took, the shipped row is the defect. This is a card-internal contradiction, not a wording problem, and it will recur on every `[visitor]` row in the estate. **Recommended sitting ruling:** the `angle` line records the authored angle and never licenses a claim; a standpoint is realised as order and selection, never as an asserted observer. Not mine to rule.
- **R4 — A SECOND WALL-CLASS OBJECT, REFUSED.** The card refuses `another civic object of the class 'wall'`. Each face names the perimeter exactly once and under exactly one term (`wall` · `perimeter` · `works` · `circuit`), so R-DA-22's one-term-for-one-thing holds inside every face while the four faces still differ in vocabulary. `gate`, `line`, `rampart`, `ditch` and `stone` are all refused; the shipped variant 1's `the line` beside `a wall` is the breach this closes.
- **R5 — THE PURPOSE CLAUSE, REFUSED.** `walled against them`, `built to hold them`, `the wall is the town's answer` all assert a purpose or an intent the field does not hold, and `built` asserts a history besides. The wall is stated as standing, never as meant.
- **R6 — THE PRACTICAL AND COST READINGS, REFUSED.** `the town cannot hold it`, `a beast that comes over goes unanswered`, `the wall buys the town nothing` are CONSEQUENCE, which is double-licensed by event provenance **and** a household or office row (MOVE-GRAMMAR §1.2 row 7; R-DA-19). Neither exists on this block.
- **R7 — THE RECORD FRAME, REFUSED FOR THIS POOL.** No face names books, rolls, an entry or a grade. The frame is lawful in principle (the `of the record` half of `may claim`) but DS-DEF-11's neighbouring pools on the same page and the same producer field already carry it, and a shared frame across two pools of one field is the template a refuter names on sight (Part B §16(4): the same rule broken the same way everywhere is the template). This pool's family is the arrangement itself.
- **R8 — THE BAND AND COUNT WORDS, REFUSED.** `nobody`, `no one`, `a handful`, `few`, `men`, `hands`, `people`. The force read is boolean; a band word on it is a count the card refuses and a C1 candidate the field cannot ground.
- **R9 — `muster`, `watch`, `warden`, `captain`, REFUSED.** The first two for the reasons in §2 and §4; the last two are `OFFICE_NOUN_CANDIDATES` members with no instantiated role behind them (CLERK-LAWS §1.2 NOTE 2).
- **R10 — THE SIBLING POOLS' VOCABULARY, REFUSED BY CRAFT.** `thick with creatures`, `embattled`, `nothing organized`, `beset`, `harried`, `pressed`, `grade`, `entered`, `the books`. §1's last paragraph carries the roster and where each is owned.
- **R11 — THE LENGTH TARGET, REFUSED.** The faces are not pushed toward the middle of the 8-to-30 window (§21.4). The spread is widened instead — 11 to 22 words, with each variant carrying one face noticeably shorter than its siblings — and the position is reported as information only (§21.1).

**No variant is banked as unlawful.** All three are written in full and I believe all twelve faces lawful under the card as I read it. The one law this packet cannot settle by itself is R3, and it is a ruling rather than a rewrite.

---

## 6. WHAT ROUND 2 OR THE REFINER SHOULD MEASURE

1. **The Q arm on this pool, before and after.** All three shipped variants take a Q finding today — variant 1 on its second sentence (which carries neither slot nor band), variants 2 and 3 on their trailing coordinates. This draft is written so that every second sentence carries the slot and no face carries a semicolon. **Predicted: FAIL 0 · Q 0 on all twelve faces.** If the harness returns otherwise, the prediction is wrong and I want the clause it names.
2. **`claimTokensOf` on this pool's `reads` string returns `js)`.** The census's `reads` for DS-DEF-2 row 1 is a function signature with a file path in it, so the words-half of arm Q's second-field test is inert on every pool of this block and the slot is the only licence a second sentence can carry. That is an instrument row, not a wording row, and it will bite every DS-DEF-2 writer the same way.
3. **R3 is a sitting question, not a round-2 target.** No amount of redrafting resolves a card that records `visitor` as an angle and refuses a standpoint as a claim.
