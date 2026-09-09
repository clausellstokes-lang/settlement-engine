1. `[plain]` The country about {settlement} is entered as beset country on the books.
   - `[face]` Beset is how {settlement}'s own country takes its grade.
   - `[face]` Under the beset head the country about {settlement} stands.
   - `[face]` Around {settlement} the country is set down as beset country.
2. `[plain]` The ordinary case of the country about {settlement} is beset country.
   - `[face]` In the common run of things the country around {settlement} stands harried.
   - `[face]` Beset country about {settlement} is the standing case of the record.
   - `[face]` By the usual reckoning the country about {settlement} counts as beset.
3. `[plain]` The settled grade does not cover the country about {settlement} as the record stands.
   - `[face]` About {settlement} the country falls outside the settled grade.
   - `[face]` Outside the settled grade the country about {settlement} is held.
   - `[face]` Settled is not the grade the country about {settlement} carries.

--- NOTES

**Pool.** DS-DEF-11 · `country: pressed (walled)` · draft round 3 · seat Opus 5 (Fable-unvalidated).
Card read by `node scripts/prose-licence-card.mjs DS-DEF-11 'country: pressed (walled)'` in `$SC/laneTASTE`; the block's own annex section re-read at `laneTASTE/docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:6017-6107` (arms A1 and A11) — the two `WALLED-STRAINED` spines this pool attaches to, and the sibling pool `country: pressed (unwalled)` authored on the same field.
3 variants · 12 faces (3 `[plain]` + 9 `[face]`) · every face ONE sentence · FORM `sentence` · seat `sentence` · MOVE `PRESENT` · RELATION `addition` · angle `plain` · audience player, no mark · ATTACH `WALLED-STRAINED`.
**Slot set: `{settlement}`, exactly once, in every one of the twelve lines** — never sentence-initial (T-F8), never sentence-final (the closer trap, §4 below).

**Words per face** (whitespace tokens, `{settlement}` counting one):
- variant 1 — **12 · 9 · 9 · 10**
- variant 2 — **11 · 12 · 11 · 11**
- variant 3 — **14 · 9 · 10 · 10**
- mean 10.67 · min 9 · max 14 · none under 8, none over 30

---

## 1. THE GATE'S FEEDBACK, MEASURE BY MEASURE

I reconstructed both findings from the shipped instrument before writing a word, and both reconstructions are exact against `$SC/taste/measure-draft.json`.

### (a) `composed walk · C3 · a processing claim on a goods sentence` = 8 findings — **CURED, 8 → 0.**

The detector is `SUPPLY_CLAIM_LEXICONS.processing` in `src/domain/prose/entryLexicons.js:189`, whose members are

> `salted, smoked, cured, dried, milled, tanned, brewed, forged, woven, fulled, malted, pressed, refined, smelted`

and **`pressed` is on it.** `armC3` (`entryWalker.js:553-561`) matches at word boundary and pushes to WITHHELD with the column `supplyChainState chain row`. Round 2 carried `pressed` in four faces (variant 1's plain, f1, f2, f3); the walk composes 4 faces × 2 spine variants = **8 units**, which is the reported count to the digit.

**This round contains the word `pressed` nowhere.** The grade the record enters is written **`beset`**, and variant 1's four faces carry it as the record's own classification word. I also swept the rest of both supply lexicons: no face contains `salted · smoked · cured · dried · milled · tanned · brewed · forged · woven · fulled · malted · refined · smelted`, nor a route claim (`upriver · downriver · upstream · downstream · overland · inland · by road · by river · by sea · over the pass · along the coast`) — round 2's `Beyond {settlement}` opener is withdrawn for the same family of reasons (see refusal R5).

⚠ **This is a hazard for the whole authoring wave, not a fact about this pool.** `pressed` is the POOL KEY's own word — `country: pressed (walled)` — and the natural first draft of any such pool quotes its key. Any pool whose key word collides with a supply-chain participle (`pressed`, `cured`, `dried`, `milled`, `forged`, `refined`) will take a WITHHELD on every face that speaks its own name. This belongs in the writers' prompt as a one-line wall.

### (b) `composed walk · Q · a trailing coordinate naming no second field` = 12 findings — **NOT THE MODIFIER'S. Uncurable by any wording of this packet; refusal R11, with the receipt.**

The finding's `clause` field in `measure-draft.json` is, on all twelve rows, verbatim:

> `stone keeps itself, and wages do not.`

That is not my text. It is the second half of **spine variant 1 of `WALLED-STRAINED`** (`RECEIPT_POOLS_DOSSIER_STATE.md:6043`): `{settlement}'s {defwork} stands better than the watch that should man it; stone keeps itself, and wages do not.`

The mechanism, read out of `armQualify` (`entryWalker.js:809-839`):

1. `walkComposed` runs `walkEntry` over the WHOLE composed unit, `spine + ' ' + face` (`composedWalker.js:938`; `taste-measure.mjs:245-282`).
2. The arm splits the unit into sentences on `/(?<=[.?!])\s+(?=[A-Z"'(])/`, then splits **each sentence on `;`** and calls `consider` on every part after the first (`:835-838`).
3. `consider` returns early only if the SEGMENT itself carries a `{slot}` or a band word (`:819-822`). The segment `stone keeps itself, and wages do not.` carries neither, so it is WITHHELD once per unit — **12 units, because only spine variant 1 of the two holds a semicolon.**

12 (spine 1) + 8 (the four `pressed` faces × 2 spines), overlapping on 4 units, is exactly the reported `WITHHELD 16 · PASS 8 of 24 · findings 20`. The arithmetic closes with nothing left over, which is how I know there is no third, hidden failing measure.

**No lawful wording of a modifier face can move it.** The one text property that would suppress it is a face that does not begin a new sentence — if the face opened on a lower-case word or on `{settlement}`, the unit would not split and the post-semicolon segment would swallow the face's slot and be licensed. Both are refused by law: ARCH §2.5's seam contract requires a `FORM: sentence` row to begin on a capital that is not a `proper`-typed slot, and T-F8 refuses a sentence face opening on a proper slot outright. I record the observation and decline the trick.

**The finding is sound and belongs to the spine.** `stone keeps itself, and wages do not` is a second fact licensed by no second typed field — a general maxim in the coordinate position, which is R-DA-12's gnomic closer and §16's own list of the machine's signatures. The lawful cure is a rewrite **in place** of that spine variant's own wording at the wave (its slot survives, §22(a); shortening a sentence inside its band is editing, not trimming) — either a period where the semicolon is, or a second clause naming the upkeep field the spine already tests. That is the `WALLED-STRAINED` spine set's refinement round and not this packet's; I have no fence to touch it and would not want the modifier's writer holding the pen on a spine.

### (c) The projected walk after this round

Every finding attributable to this pool's wording is gone. On the same 24 units the walk should read **FAIL 0 · WITHHELD 12 · PASS 12, findings 12**, all twelve on one clause of one spine, none on a modifier face. That is this packet's ceiling under the spine as it stands today, and it is the number the sitting should hold me to.

---

## 2. WHAT ELSE MOVED, BEYOND THE TWO REPORTED MEASURES (§21.1–§21.3: the ceiling, not the middle)

The gate reported two measures. §21.2 says a lawful face that sits just above the floor is still pushed toward the ceiling, so three further things changed, each for a stated reason:

1. **The two coordinate tails are withdrawn.** Round 2 closed 1-f2 on `, and holds at that grade` and 2-f3 on `, and the case holds`. Neither names a second typed field, so each is the same shape the Q arm was written to catch — a summarising beat, §16(6)'s named machine signature — and each survived only because `armQualify`'s trailing-coordinate limb splits on `;` and not on `, and`. Passing an instrument by falling outside its split is not passing. **No face in this round carries a coordinate tail.** This is the round's largest craft change and the one I would defend first.
2. **One term for one thing (R-DA-22).** Round 2 alternated `country` and `ground` for the same thing. This round uses **`country` in all twelve faces** and lets the variation live in the predicate and the syntax, which is the harder and more defensible reading of the rule; `ground` appears nowhere. The register card's own line covers the recurrence: *the WORD may recur; the FACT must not*.
3. **The length spread is widened lawfully.** Round 2 ran 9–12 (sd ≈ 1.1); this round runs 9–14 (sd ≈ 1.4) by lengthening variant 3's plain line, which also sharpens it (`as the record stands` is a frame on the same fact, not a second one). The window is bounded above by the COMPOSED grain and not by the face grain: against the 18-word spine 1, a 10-word face puts `wordsPerSentence.neighbourVariation` at 0.571 — the band interior (0.495–0.805) — while a 16-word face would put it at 0.118, 1.2 band-widths UNDER the floor. **The modifier is where this register's short line now lives, and its lawful window is roughly nine to fourteen words.** Worth a sitting line.

---

## 3. THE ONE CLAIM, AND THE THREE CONSTRUCTIONS

Every one of the twelve faces asserts exactly one typed claim and nothing else: `settlement.config.monsterThreat`, resolved by `measuredMonsterFamily` to `plagued` or `frontier`, stated as a STANDING fact of the record. CONFIRMED at this tip at `defenseStateProseCandidates.js:63` (`family === 'plagued' || family === 'frontier'`) and `defenseStateProse.js:217-222` (`MONSTER_FAMILY_OF` total over `plagued · frontier · heartland→settled`). The claim never varies; the grammar must.

- **Variant 1 — THE GRADE.** The record classes the country at the beset grade. Four constructions: a plain predication naming the books · an inversion of manner on a possessive frame · a fronted rubric with a bare intransitive close · an agentless passive of a different record verb.
- **Variant 2 — THE STANDING CASE.** Being beset is the country's ordinary condition and not an occasion — carried by four different words for ordinariness (`ordinary · common · standing · usual`), which is where this variant's vocabulary spread lives.
- **Variant 3 — THE BAND SHORTFALL.** The country does not come under `settled`, the third value of the same three-value family — this pool's one contrast, written so that it matches **none** of `CONTRAST_SHAPES` (`entryLexicons.js:304`): no `rather than`, no `not X but Y`, no `, not x`, no trailing `and not x`. Arm A3 therefore answers NOT-EXECUTABLE rather than WITHHELD, and a WITHHELD is never a pass (`entryWalker.js:874`).

**Sibling distance (arm A5, `composedWalker.js:617`).** All twelve openers are pairwise distinct across the whole pool, not merely inside each variant: `the country · beset is · under the · around {} · the ordinary · in the · beset country · by the · the settled · about {} · outside the · settled is`. A5 fires only when two faces share opener AND sentence count AND content tokens at the floor; no pair shares even the opener, so the expected `synonymSwaps` is 0. A11's cross-variant rule (no two variants share their first two words) holds on `The country / The ordinary / The settled`.

**The thread (owner, 2026-09-08 ~21:4x; MOVE-GRAMMAR §1.4.1).** The composer puts the spine first and this modifier last, so each face is the passage's **one turn outward** — from the town's stone and its wages to the country it stands in — which is the shape the wall licenses for a change of subject. It hands a noun back in the same breath: all twelve name `{settlement}`, so the turn lands on this town's country and not on a general landscape. **No face carries a pronoun that points outside its own sentence** (the only pronoun-shaped words in the packet are `its grade` and `its` in variant 1's f1, both bound to `country` inside that sentence), so every face also reads cleanly in second position after the sibling modifier `watch: bought (revealed)` — *"…In {settlement} the buying of the watch stands on the plain public record. Beset is how {settlement}'s own country takes its grade."*

---

## 4. THE BAND, AND THE SHAPES DELIBERATELY AVOIDED

Round 2's measured band position was identical for all twelve faces (`scored 21 · exceeded 13 · share 0.619 · deepest neighbourVariation 1.597 under · budgetOk true · depthOk true`), because at the FACE grain a one-sentence text drives most rate metrics to a constant. The 13/21 sits one exceedance below the ENTRY budget floor (`floor(21 × 2/3) = 14`), so the discipline is to add none. Every face in this round therefore keeps all of:

| shape | why zero | where the trap is |
|---|---|---|
| a face ending on `{settlement}` | `proseFingerprint.js:114` strips the braces and reads `settlement`, which matches `/ment$/` → `closers.abstractNounRate = 1.0`, **depth 8.60** | five band-widths past the ENTRY DEPTH on its own — the single deepest trap in the file |
| a pronoun closer (`it · them · this · that · there · here · one`) | `closers.pronounRate` → 1.0, depth 10.25 | killed two natural drafts (`…and keeps it`, `…is a beset one`) |
| an `-ly` adverb | `shapes.adverbsPerSentence` → 1.0, depth 1.83 | zero adverbs, not "few"; killed `ordinarily`, `commonly` |
| under 8 or over 30 words | `shareUnder8` / `shareOver30` → 1.0, depths 2.19 / 2.29 | the floor is nine words in practice |
| semicolon · colon · em dash · question · exclamation · parenthesis · digit · percent | walls, and `armQualify`'s own `;` split | the spine's semicolon is exactly what this round is refusing to imitate |
| `which` · a which-tail | R-DA-03 wall 6; the connectives leaf refuses `which` (ARCH §2.5) | spine 2 carries one, pre-existing, not mine |
| `will` / `shall` | `FUTURE_INDICATIVE`, `entryLexicons.js:338`; STATE never FATE | — |
| `was · were · had · once · formerly · no longer` | `armC3`'s semantic half WITHHOLDS on any of them (`entryWalker.js:547`) | a free WITHHELD for a past-tense verb that says nothing extra |
| `every · all · each · only · none · any · no · whole · entire` | `QUANTIFIERS` (`:93`), licensed only by a `closed` column, and the card's REFUSED COLUMNS line shuts that door | killed `no settled country lies about {settlement}` |
| `unsettled`, `not settled` | the OPEN detector (`moveGrammar.js:226`) would classify the face OPEN against a pool declaring `MOVE: PRESENT` | variant 3 negates the COVERING, never the word `settled` itself: `Settled is not the grade…` puts `settled` before `not`, which the regex cannot reach |
| `the rolls say` / `the books hold` | `RECORD_CITATION` (`:335`) → arm F25 WITHHELD | the packet writes `on the books`, `of the record`, `as the record stands` — a record NAMED, never a record REPORTING |
| `is what` · `is who` · `is the only` · `is the one`; `The x … is the y` | `SPECIFICATIONAL_COPULA` (`:332`) → arm X, exhaustivity over an open column | killed `Beset is what the record enters`, `the grade … is the one it carries` |
| `falls on` · `cost` · `the bill` | the CONSEQUENCE detector (`moveGrammar.js:227`); a cost is double-licensed by event provenance × a household row, and this pool has neither | `falls outside` is safe and is checked against the regex, which reads `falls on` |
| the OBJECT, GEOGRAPHY, INSTITUTION, PERSON, TRADITION, HISTORY detectors | each would classify a face out of `MOVE: PRESENT` | no `the ground here`, `the site`, `the river`, `inland`, `since the`, `by tradition`, no institution noun with a duty verb, no office |

Closers across the pool, by kind, so the pool does not close one way: `books · grade · stands · country` / `country · harried · record · beset` / `stands · grade · held · carries` — a civic thing, a grade, a standing verb, a condition, in a mix, with none abstract-suffixed and none a pronoun.

---

## 5. LICENCE, CLAUSE BY CLAUSE (which card clause licenses which claim)

| face(s) | the claim it makes | the card clause that licenses it |
|---|---|---|
| all 12 | the country about this town is beset / harried / outside the settled grade | `reads: settlement.config.monsterThreat`; `predicate: measuredMonsterFamily ∈ {plagued, frontier}`; **`may claim: that monsterThreat holds, as a STANDING fact of the record`**; MOVE `PRESENT` (MOVE-GRAMMAR §1.2 row 1 — a standing configuration field licenses a STRUCTURAL clause) |
| all 12 | `{settlement}` | `bag: {defwork: bare-common, settlement: proper}`, **FILLED at this block's call sites: `{settlement}`**; never sentence-initial (ARCH §2.5's face row, T-F8) |
| 1-plain (`entered … on the books`), 1-f1 (`takes its grade`), 1-f2 (`the beset head`), 1-f3 (`is set down`) | the fact is a classification the record carries | the **`of the record`** half of `may claim`. The field is a tier (`MONSTER_THREAT_TIERS`), so naming its grade is the field's own shape, and A4's no-digit rule makes the band a WORD (R-DA-16). The record is never the grammatical subject and never reports — see refusal R7 |
| every `beset` | the union of the two firing values | the pool KEY's own claim, re-worded. Naming `frontier` or `plagued` is refused (R2): the pool fires on the union and either value word is false on half of it. `beset` is the union's one honest word and, unlike `pressed`, is on no instrument's lexicon |
| 2-plain, 2-f1, 2-f2, 2-f3 (`ordinary · common · standing · usual`) | the condition stands; it is not an incident | the **STANDING** clause of `may claim`, read against MOVE-GRAMMAR §1.2 row 2: HISTORY needs an event-provenance field, which this pool has none of, so the eventless reading is the only licensed one — and this variant states it rather than leaving it to be inferred |
| 2-f1 `harried` | the country presses on the town | the field's own meaning, one condition word beside the grade word. No actor, no event, no count, no season — the four the card refuses |
| 3-plain, 3-f1, 3-f2, 3-f3 (`the settled grade` / `Settled is not the grade`) | the country falls outside the `settled` band | `MONSTER_FAMILY_OF` is total over `plagued · frontier · settled`, so `settled` is a **sibling band of this pool's own read field** — the one licence R-DA-02 and MOVE-GRAMMAR §1.4 wall 5 give a contrast. No second field is touched, and the shape matches no member of `CONTRAST_SHAPES` |
| 3-plain (`as the record stands`) | the grading is the record's, as it is held now | the `of the record` half again; it is a frame on the same fact, not a second fact, so S2's clause seat and R-DA-03's second sentence are both unengaged. This is the packet's boldest row and the first place a refuter should look |

---

## 6. REFUSALS (a refusal is a result)

- **R1 — THE SOURCE CITATION, REFUSED; the provenance count for this pool is 0, deliberately.** The card prints `source: road · standing LICENSED`. Register card S3 licenses a citation on the PLAYER's page only where a clerk would cite — two accounts that disagree, a count from an interested party, a record whose keeper is a power — and none holds here: the road is not a power, the fact is not a count, and no second account exists. S3's own sentence is that the player's page states the fact **as compiled** and the referee's page names the keeper. MOVE-GRAMMAR §4.4.3 adds that a citation of a holder that is the office itself is a finding, and budgets the move from the bands rather than licensing a habit. Chair-vetoable: if the sitting wants the move exercised on this pool, the lawful form is `The country about {settlement} is beset country by the road's account.` and it should be **one** face of twelve, never four. `provenanceCount` on this packet is 0 by construction — no face matches the PROVENANCE detector's twelve holder kinds (`moveGrammar.js:225`), and `the books` / `the record` are common nouns naming no holder, which is exactly what SITTING §Q.2 narrowed the detector to exclude.
- **R2 — THE VALUE WORDS `frontier` AND `plagued`, REFUSED.** The predicate is a union of two bands; a face naming either is false on the other half of the population the pool fires on.
- **R3 — THE `{defwork}` SLOT, REFUSED.** It is in the bag and the card records it as NOT FILLED at this block's call sites; a face naming it would be unreachable at every draw (arm D's `a slot the composer never fills`). `{settlement}` alone is used, once per face, so arm A6's slot-set identity holds on all twelve.
- **R4 — THE WALL, THE GATE, THE WATCH, THE MUSTER, THE WAGES, REFUSED AS NOUNS.** `may NOT … another civic object of the class wall, any field the attached spine tests (forces.walls.present · settlement.defenseProfile.economicGates.military)`. This also forecloses the easy thread — carrying the spine's own noun forward — because on this pool the spine's nouns ARE its tested fields (arm A1: a modifier neither restates nor negates its spine). The turn outward is the thread that remains, and it is the licensed one.
- **R5 — THE SPATIAL AND BOUNDARY FACES, REFUSED.** `Settled country stops short of {settlement}`, `Dangerous ground begins where the town's ground ends`, and round 2's opener `Beyond {settlement}` all assert a geometry on a field that holds none (MOVE-GRAMMAR §1.2 row 8; `PROVENANCE_LEXICONS.spatial`). `about` and `around` are the field's own vagueness and claim no perimeter; `surrounds` was dropped in round 2 and stays dropped.
- **R6 — THE PRACTICAL READING, REFUSED** (`not safe to be out in`, `not safe to cross`). That is the danger's COST to the town, and CONSEQUENCE is double-licensed by event provenance × a household or office row (R-DA-19). Neither exists here.
- **R7 — THE RECORD AS GRAMMATICAL SUBJECT, REFUSED.** `The record holds…`, `the books say…` match `RECORD_CITATION` and are WITHHELD by arm F25; naming the compiling office per entry is R-DA-01's once-declared frame coming back by the back door. Every record reference in this packet is oblique and verbless — `on the books`, `of the record`, `as the record stands` — and the record never says anything.
- **R8 — THE SPECIFICATIONAL FORMS, REFUSED.** `Beset is what the record enters about {settlement}`, `the grade … is the one it carries` match `SPECIFICATIONAL_COPULA` and entail an exhaustive column (arm X). Every `is` in this packet is followed by a bare predicate or a participle, never by `what`, `who`, `the only`, `the one`, and no face has the shape `The x … is the y`.
- **R9 — QUANTIFIERS, REFUSED.** Licensed only by a `closed` column, and the card's REFUSED COLUMNS line closes that door for good. Two natural drafts died here: `no settled country lies about {settlement}` and `the grade holds in every reading`.
- **R10 — THE SIBLING POOL'S VOCABULARY, REFUSED BY CRAFT (not by law).** `country: pressed (unwalled)` is authored on the SAME field with `dangerous ground · pressed country · hard country · hostile country · not quiet · unquiet · trouble · the threat stands · live danger runs`. The two pools are mutually exclusive by the walls polarity class, so no unit carries both and no arm compares them — but a byte-shared line across two pools on one field is a template a refuter would name on sight. This pool owns a disjoint family: the record's GRADE (`beset · settled · head · grade · books · record`) and one condition word (`harried`). Nothing here repeats a phrase of the sibling pool, and round 2's `Trouble sits in the country about {settlement}` neighbours (`sits in the country`, `runs through the country`) were rejected in drafting for that reason.
- **R11 — THE Q FINDING, REFUSED AS NOT THE MODIFIER'S; see §1(b) for the receipt.** Twelve WITHHELD rows whose clause is `stone keeps itself, and wages do not.` — the post-semicolon half of `WALLED-STRAINED` spine variant 1. No lawful modifier wording reaches it; the only text property that would suppress it (a face that does not open a new sentence) is refused twice over by ARCH §2.5's seam contract and T-F8. **Recommended chair cure, vetoably:** the spine variant is rewritten in place at the wave — a period for the semicolon, or a second clause naming the upkeep field the spine already tests — under the spine pool's own refinement round, not this writer's fence.

**THE PRE-EXISTING STRUCTURAL REFUSAL, carried unchanged from round 2 and still not mine to cure.**
`ATTACH WALLED-STRAINED: the spine's key and the modifier's key name the same civic object class 'wall' (T-F12)`. This is a **key-string** collision (`walled` in `country: pressed (walled)` against `WALLED-STRAINED`), not a text property: no wording of mine can move it, and the guard cannot tell a key that NAMES the wall from a key that merely distinguishes the walled BRANCH. It is waived only under `--taste`, which the shipped build never passes, so the pool cannot land while the key reads as it does. **Recommended chair cure, vetoably:** rename the modifier pool to a key naming no civic object class — `country: beset (strained)` is now exact on both halves, since the ATTACH set is precisely `WALLED-STRAINED`, its unwalled sibling attaches to the two `UNWALLED-*` keys, and this round's text no longer says `pressed` either. A key rename is a seed input (A7/A17) and therefore a chair act; the twelve rows above are unaffected by it, since no face names the key.

---

## 7. WHAT THE SITTING SHOULD TAKE FROM THIS PACKET

1. **A pool key's own word can be a lexicon word.** `pressed` cost this pool eight WITHHELD rows for quoting its own key. The wave should scan every planned pool key against `SUPPLY_CLAIM_LEXICONS`, `QUANTIFIERS`, `PROVENANCE_LEXICONS` and the OPEN detector before a writer is dispatched, and hand the writer the collision list with the brief.
2. **A modifier's gate verdict is not a modifier's property.** Sixteen of twenty-four WITHHELD units, and twelve of twenty findings, came from one clause of one spine that the modifier can neither reach nor repair. The taste table should attribute findings **per piece**, or a spine's debt will be read as a writer's failure, and a refiner will be sent to push a wording set that was already at its ceiling. This is the round's most transferable finding.
3. **The `{settlement}`-as-closer trap is corpus-wide.** Any face ending on the settlement slot scores `closers.abstractNounRate = 1.0` at depth 8.60, because the fingerprint strips the braces and reads `settlement` as `…ment`. Fifteen-to-twenty authoring workflows are about to write thousands of faces; this belongs in the writers' prompt as a one-line wall, or the band arm will red on a shape no author intended.
4. **The register's short line now lives in the modifier, and its window is nine to fourteen words** — floored by `shareUnder8` (depth 2.19 at eight) and ceilinged by the COMPOSED `neighbourVariation` against an eighteen-word spine, not by any face-grain rule. A sixteen-word face is lawful alone and 1.2 band-widths under the floor once composed.
