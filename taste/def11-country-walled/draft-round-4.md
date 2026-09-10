1. `[plain]` On the books the country about {settlement} is entered at the beset grade.
   - `[face]` Beset is the grade {settlement}'s own country takes in the town's standing record.
   - `[face]` Around {settlement} the country is marked beset in the entry.
   - `[face]` Entered beset, the country about {settlement} keeps that grade wherever the books are kept.
2. `[plain]` Beset country about {settlement} stands as the ordinary state.
   - `[face]` About {settlement} the country is harried in the plain course of things.
   - `[face]` For the country about {settlement}, beset is the common case.
   - `[face]` Harried is the country about {settlement} in the case that stands.
3. `[plain]` Settled is a grade the country about {settlement} does not reach.
   - `[face]` Outside the settled grade the country about {settlement} is held in the record.
   - `[face]` The country about {settlement} misses the settled grade on the town's books.
   - `[face]` A settled grade the country about {settlement} does not carry.

--- NOTES

**Pool.** DS-DEF-11 · `country: pressed (walled)` · draft round 4 · seat Opus 5 (Fable-unvalidated).
Card read by `node scripts/prose-licence-card.mjs DS-DEF-11 'country: pressed (walled)'` in `$SC/laneTASTE`; the block's own annex section re-read at `laneTASTE/docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:6013-6107` (arms A1 and A11) — the two `WALLED-STRAINED` spines this pool attaches to, the three other spine sets of the block, and the two sibling modifier pools mounted beside it.
3 variants · 12 faces (3 `[plain]` + 9 `[face]`) · every face ONE sentence · FORM `sentence` · seat `sentence` · MOVE `PRESENT` · RELATION `addition` · angle `plain` · audience player, no mark · ATTACH `WALLED-STRAINED`.
**Slot set: `{settlement}`, exactly once, in every one of the twelve lines** — never sentence-initial (T-F8), never sentence-final (the `…ment` closer trap).

**Words per face** (whitespace tokens, `{settlement}` counting one):

| variant | `[plain]` | `[face]` 1 | `[face]` 2 | `[face]` 3 |
|---|---|---|---|---|
| 1 · the grade | **13** | **13** | **10** | **14** |
| 2 · the standing state | **9** | **12** | **10** | **11** |
| 3 · the band shortfall | **11** | **13** | **12** | **10** |

mean **11.5** · min **9** · max **14** · none under 8, none over 30.

---

## 1. THE GATE'S FEEDBACK, MEASURE BY MEASURE

The gate returned, for this pool: `composed walk · unit verdicts = FAIL 0 · WITHHELD 12 · PASS 12 of 24 (band FAIL 0 · WITHHELD 0)`; `composed walk · Q · a trailing coordinate naming no second field = 12 (band 0)`, the withheld segment being the SPINE's own clause; `REFUSALS: none — the projector accepted all 12 rows verbatim`.

**Round 3 hit its projected ceiling exactly.** It said the walk would read FAIL 0 · WITHHELD 12 · PASS 12 with all twelve findings on one clause of one spine and none on a modifier face. That is what the gate measured. Read against `$SC/taste/measure-draft.json`, the pool's row carries `verdict WITHHELD`, `units 24`, `walk.verdicts {FAIL: 0, WITHHELD: 12, PASS: 12}`, `findingCount 12`, `siblings[*].synonymSwaps 0`, `siblings[*].notExecutable 0`, `departure 0`, and twelve identical findings whose `clause` field is, on every row, `stone keeps itself, and wages do not.`

**So there is no failing measure of this pool's wording left to move.** I say that plainly rather than manufacturing motion. What round 4 does instead, under §21.1–§21.3 (the ceiling, not the middle; a lawful face just above the floor is not done), is push every face toward the ceiling on the axes the harness does not score, while holding every scored verdict where round 3 put it. §2 names each move and what it answers. §3 retires two latent failure states the single-ground taste run cannot show. §5 corrects two claims round 3 made to the sitting that its own data does not support — a correction is a result, and an uncorrected recommendation would have gone into fifteen authoring workflows.

### (a) The 12 WITHHELD are the spine's, and now the receipt is corpus-wide, not one pool's

`armQualify` (`src/domain/prose/entryWalker.js:809-839`) splits the composed unit on `/(?<=[.?!])\s+(?=[A-Z"'(])/`, then splits **each sentence** on `;`, and calls `consider` on every part after the first. `consider` returns early only when the SEGMENT itself carries a `{slot}` or a band reading (`:819-822`). The segment `stone keeps itself, and wages do not.` is the post-semicolon half of `WALLED-STRAINED` spine variant 1 (`RECEIPT_POOLS_DOSSIER_STATE.md:6036`) and carries neither. Twelve faces × the one spine of the two that holds a semicolon = 12.

Round 3 established this for this pool. Round 4 establishes it for the whole taste sample, because the sitting is about to price a wave on these numbers:

| pool | findings | the text every finding traces to | line |
|---|---|---|---|
| `country: pressed (walled)` | 12 | `WALLED-STRAINED` #1 | `:6036` |
| `country: pressed (unwalled)` | 48 | `UNWALLED-LARGE` #1 `:6044`, `UNWALLED-LARGE` #2 `:6045`, `UNWALLED-SMALL` #1 `:6040`, `UNWALLED-SMALL` #2 `:6041` | spines |
| `watch: bought (revealed)` | 48 | `WALLED-QUIET` #3 `:6033`, `WALLED-STRAINED` #1 `:6036`, `WALLED-THREATENED` #1 `:6026`, `WALLED-THREATENED` #2 `:6027` | spines |
| `watch: bought (covert)` | 48 | the same four | spines |
| `stores: short` | 24 | DS-DEF-2 spine `:2701`, DS-DEF-2 `[counterforce]` spine `:2703` | spines |
| `stores: import-fed` | 24 | the same two | spines |
| `purse: short` | 24 | DS-GEN-3 `CRITICAL` spine `:5342`, DS-GEN-3 `WEAK` spine `:5341` | spines |

**CONFIRMED: all 204 findings the harness LISTS, across all seven pools and three blocks, are raised on shipped SPINE text. Zero are raised on any writer's modifier face.** Every clause string above was grepped back to its line in the annex; the `F25 a cited record's content :: the books say` row is the `UNWALLED-LARGE` `[ledger]` spine's own tail, and the two `A3` rows (`rather than in the luck`, `rather than in what the hall issues`) are the `[counterforce]` and `WEAK` spines' own contrast shapes.

**The counted total is 228, not 204, and the difference is a gap in the instrument.** The seven pools' declared `findingCount` sums to 228; their `findings` arrays hold 204 rows, because three pools (`country: pressed (unwalled)`, `watch: bought (revealed)`, `watch: bought (covert)`) declare 48 and list 40. Twenty-four findings are therefore counted but not listed, and cannot be attributed from the JSON at all. My claim is exactly as wide as the evidence: 204 of 204 listed, and 24 unlisted. The harness should emit every finding it counts, or print the cap it applied — a per-piece attribution built on a truncated array is short by more than a tenth of the sample, and the truncation falls on the three pools with the most findings.

This is the packet's most transferable finding and it is now a measurement rather than an argument. If the taste table attributes findings to the writer of the pool, all seven sets are refused for a debt no writer of a modifier can reach, and seven refiners are dispatched against wording that is already at its ceiling.

### (b) The one text property that would move it, and why I refuse it again

If a face opened on a lower-case word, the sentence split would not fire, the unit would be one "sentence", and the post-semicolon part would then contain the face and its `{settlement}` — so `consider` would return early and all twelve findings would vanish. That is the whole mechanism, and it is a trick, not a cure: ARCH §2.5's seam contract requires a `FORM: sentence` row to begin on a capital that is not a `proper`-typed slot, and the face sub-row refusal T-F8 bars a sentence face opening on a proper slot outright. The card's `seat/form: sentence / sentence` closes the other door — `FORM: fragment` is refused as a form that disagrees with the relation's seat, and in any case the typed lines are the annex's and not mine to move. Passing an instrument by falling outside its split is not passing (that principle also cost round 3 its two coordinate tails). **Refusal R11 stands, restated.**

**The lawful cure exists and is the chair's.** `stone keeps itself, and wages do not` is a second fact licensed by no second typed field — a maxim in the coordinate position, R-DA-12's gnomic closer and one of the machine signatures Part B §16(6) names. It is cured in place at the wave, inside the spine pool's own refinement round: a period where the semicolon is, or a second clause naming the upkeep field the spine already tests (`settlement.defenseProfile.economicGates.military`). Its slot survives and its text is kept in the annex history, so §22 is not engaged. Vetoable; not this writer's fence, and I would not want a modifier's author holding the pen on a spine.

---

## 2. WHAT MOVED THIS ROUND, AND WHAT EACH MOVE ANSWERS

### (1) The record frame stops being the pool's default — 10 of 12 faces down to 5 of 12

Round 3 put a record noun (`books`, `record`, `head`, `entry`, `reckoning`) in ten of twelve faces. Part B §16(4) is explicit that the *spread* is the measure: the same rule broken the same way everywhere is the template, and a reader meeting this pool across towns meets the frame, not the fact. R-DA-01 points the same way — the compiling office is declared once at the front and never per entry.

This round makes **variant 2 wholly world-facing**: its four faces state the standing condition of the country and name no record at all. Variants 1 and 3 keep the frame their semantics require (variant 1 IS the act of grading; variant 3 IS a grade not reached). Record nouns now stand in 5 of 12 faces — 1-plain, 1-f1, 1-f3, 3-f1, 3-f2 — and the pool no longer says "the record" the same way everywhere.

The licence is unchanged by the move. The card reads `may claim: that monsterThreat holds, as a STANDING fact of the record`. "of the record" fixes the modality — compiled, standing, not historical — and does not oblige the surface to name the record. A face that says the country is beset states the licensed fact; a face that says the books say so states it and frames it. Both are licensed; only one of them may be the pool's habit.

### (2) Variant 2 stops being four synonyms for one word

Round 3's variant 2 varied `ordinary · common · standing · usual` across four faces of one shape. `synonymSwaps` measured 0 because arm A5 fires only on a shared opener plus sentence count plus content tokens at the floor — but §23 hands the refuter a wider test ("a face that paraphrases its sibling instead of changing vocabulary or rhythm"), and four adjectives in one frame is what that sentence describes. This round gives variant 2 four rhythms instead: a plain predication (`stands as the ordinary state`), a fronted place phrase with a different condition word (`is harried in the plain course of things`), a fronted prepositional frame with the grade word inverted (`beset is the common case`), and a full inversion on the condition word (`Harried is the country … in the case that stands`).

### (3) The thread is picked up earlier

The owner's thread wall (MOVE-GRAMMAR §1.4.1) asks the added sentence to carry a noun forward or to make its change of subject the passage's one turn outward, placed last. This modifier can only take the second route — the card's `may NOT` bars every noun the spine actually owns (another civic object of class `wall`, and any field the spine tests: `forces.walls.present`, `settlement.defenseProfile.economicGates.military`), which forecloses the wall, the watch, the muster and the wages as nouns. So the turn outward is the licensed thread, and `{settlement}` is the noun handed back.

What round 4 improves is *where* it is handed back. Round 3 delayed the slot to word 9 of 12 in one face and word 8 of 14 in another. This round: positions 7 · 5 · 2 · 6 | 4 · 2 · 5 · 6 | 8 · 8 · 4 · 7 — mean 5.3, maximum 8, and in every face the town's name arrives before the sentence's second half closes. No face carries a pronoun that reaches outside its own sentence, so each also reads cleanly in second position after a sibling modifier: *"…In {settlement} the buying of the watch stands on the plain public record. Around {settlement} the country is marked beset in the entry."*

### (4) Length: the spread widened, the mean deliberately not chased

9 to 14 words, mean 11.50, sd 1.50 — against round 3's 9 to 14, mean 10.67, sd 1.44. **That is a small move and I will not dress it as a large one.** What changed is placement rather than range: round 3 put its two shortest lines (9 · 9) inside variant 1 and ran variant 2 flat at 11 · 12 · 11 · 11; this round runs variant 1 at 13 · 13 · 10 · 14 and gives each variant one line noticeably shorter than its siblings, so the rhythm varies inside every variant instead of between them. I did **not** raise the mean toward the middle of the harness's own length classes, and §5 gives the measurement behind that decision. §21.4 is the reason of principle: a one-claim sentence padded to sixteen words is plainer, not denser, and a refinement that trades density for plainness is the regression the owner named.

---

## 3. TWO LATENT FAILURE STATES RETIRED (they cannot show on the taste's single ground)

Neither of these was a finding in round 3's measurement. Both are shapes that the walker fails or notes on grounds the taste run does not exercise, and this pool fires on 66.93 % of towns (`rateBp 6693`), so "it passed on this ground" is not a receipt.

- **`counts as` is withdrawn from variant 2.** `counts` is a member of `DUTY_PREDICATES` (`src/domain/prose/entryLexicons.js:110-122`). `armC2` limb (c) (`entryWalker.js:496-509`) resolves it against `ground.columns.whatItCounts`: where the column is not supplied the finding lands in `notExecutable`, and **where the column's values are empty it lands in `out.fails` — a FAIL, not a WITHHELD** ("a duty no institution carries"). The taste harness supplies one ground whose service rows are non-empty, so round 3's `counts as beset` was clean there and would be a FAIL on any settlement in the firing population whose instantiated services are empty. No face in this round contains `counts`, `counted` or `counting`.
- **`reckoning` and the rubric noun `head` are withdrawn.** `reckons` and `reckoned` are `DUTY_PREDICATES`; `reckon` is a `DUTY_STEM_NOUNS` member raising a C2 NOTE with the ambiguity named (`:129-131`, `entryWalker.js:511-519`). The gerund escapes both lists on today's spelling, which is exactly the kind of margin I decline to sit on. `heads` is a count noun in the population list (`entryLexicons.js:64`); the bare rubric `head` is inert only while no band word governs it, and it was the packet's most obscure word besides.

---

## 4. LICENCE, CLAUSE BY CLAUSE

Every one of the twelve faces asserts exactly one typed claim: `settlement.config.monsterThreat`, resolved by `measuredMonsterFamily` to `plagued` or `frontier`, stated as a standing fact. The claim does not vary across the pool; only the grammar does (MOVE-GRAMMAR §3.4, arm C).

| face(s) | the claim it makes | the card clause that licenses it |
|---|---|---|
| all 12 | the country about this town is beset / harried / short of the settled grade | `reads: settlement.config.monsterThreat`; `predicate` ∈ {plagued, frontier}; **`may claim: that monsterThreat holds, as a STANDING fact of the record`**; MOVE `PRESENT` (MOVE-GRAMMAR §1.2 row 1 — a standing configuration field licenses a structural clause) |
| all 12 | `{settlement}` | `bag: {defwork: bare-common, settlement: proper}`, **FILLED at this block's call sites: `{settlement}`**; never sentence-initial (T-F8) |
| every `beset` | the union of the two firing values | the pool key's own claim reworded. `frontier` and `plagued` are refused (R2): the pool fires on the union, and either value word is false on half the population it fires on. `beset` is the union's one honest word, and it is on no instrument's lexicon |
| 1-plain, 1-f1, 1-f2, 1-f3 | the fact is a classification the record carries, entered at a named grade | the `of the record` half of `may claim`. The field is a tier (`MONSTER_THREAT_TIERS`), so naming its grade is the field's own shape, and A4's no-digit rule makes the band a WORD (R-DA-16). Four record verbs, none with the record as grammatical subject (R7) |
| 2-plain, 2-f1, 2-f2, 2-f3 | the condition stands; it is the ordinary state, not an occasion | the **STANDING** clause of `may claim`, read against MOVE-GRAMMAR §1.2 row 2: HISTORY needs an event-provenance field and this pool holds none, so the eventless reading is the only licensed one. This variant states it rather than leaving it to be inferred, and names no record (see §2(1)) |
| 2-f1, 2-f3 `harried` | the country presses on the town | the field's own meaning — one condition word beside the grade word. No actor, no event, no count, no season: the four the card refuses |
| 3-plain, 3-f1, 3-f2, 3-f3 | the country does not come under the `settled` grade | `MONSTER_FAMILY_OF` is total over `plagued · frontier · settled`, so `settled` is a **sibling band of this pool's own read field** — the one licence R-DA-02 and MOVE-GRAMMAR §1.4 wall 5 give a contrast. No second field is touched, and no face matches any member of `CONTRAST_SHAPES` (`entryLexicons.js:304`): no `rather than`, no `not X but Y`, no `, not x`, no trailing `and not x`. Arm A3 therefore answers NOT-EXECUTABLE rather than WITHHELD, and a WITHHELD is never a pass (`entryWalker.js:874`) |
| 1-f3 `wherever the books are kept`, 3-f1 `in the record` | the grading is the record's, as it is held now | the `of the record` half again — a frame on the same fact, not a second fact, so S2's clause seat and R-DA-03's second sentence are both unengaged. `are` is outside `RECORD_CITATION`'s verb set (`say|says|show|shows|hold|holds|carry|carries|name|names|record|records|have|has`, `:335`) and the record never speaks |

**The shapes held at zero, each checked against its detector.** No `{settlement}`-final closer (`closers.abstractNounRate` reads the stripped slot as `…ment`, depth 8.60). No pronoun closer (`closers.pronounRate`, and `one` is in the set — which killed three natural drafts ending `a beset one`). No `-ly` adverb (`shapes.adverbsPerSentence`; it killed `ordinarily` twice this round). No `-ing` opener (`shapes.participialOpenerRate`); `Entered` is a past participle and is outside `/ing$/`. No `There is` / `It is` opener. No adjective pair of the `\w+(ed|ing|ous|ful|less|ive|al|ant|ent|y) and \w+…` shape (`shapes.doubledAdjectiveRate` — it killed `plain and unexceptional` and `standing and ordinary`). No comma triad. No semicolon, colon, em dash, question, exclamation, parenthesis, digit or percent. No `which`. No `will` or `shall` (`FUTURE_INDICATIVE`). No `was · were · had · used to · once · formerly · no longer` (`armC3`'s semantic half, `entryWalker.js:547`). No quantifier from `QUANTIFIERS` (`every · all · each · only · none · everyone · everybody · everything · any · no · whole · entire · without exception · to a man · universally`) — which is why variant 3 negates with `not` and never with `no`. No member of `PROVENANCE_LEXICONS` (capacity, spatial, actor, dated) — a FAIL channel on a state-only block. No member of `SUPPLY_CLAIM_LEXICONS` (processing or route) — `pressed` above all. No `RECORD_CITATION`. No `SPECIFICATIONAL_COPULA`: every `is` in the packet is followed by a bare predicate, a participle or a determiner phrase, never by `what`, `who`, `the only` or `the one`, and no face has the form `The x … is the y`. No `BARE_RELATIVE`. No `answers to` (`entryLexicons.js:233`'s patronage list, which killed a face this round).

**Close kinds, across the pool** (`CLOSE_KINDS`, `entryLexicons.js:307-322`): `grade · record · entry · kept` | `state · things · case · stands` | `reach · record · books · carry` — record nouns, grade words, condition words and standing verbs in a mix, two abstraction closers of twelve, no pronoun closer, no pool-wide single kind.

**Sibling distance.** All twelve openers are pairwise distinct on their first two words across the whole pool, not merely inside each variant: `On the` · `Beset is` · `Around {}` · `Entered beset` · `Beset country` · `About {}` · `For the` · `Harried is` · `Settled is` · `Outside the` · `The country` · `A settled`. A11's cross-variant rule holds on the three `[plain]` lines — `On the` / `Beset country` / `Settled is`. Expected `synonymSwaps` is 0, as in round 3.

---

## 5. TWO CORRECTIONS TO ROUND 3's OWN RECOMMENDATIONS

Round 3 put two rules to the sitting. Its own harness output does not support either, and both were headed for the writers' prompt.

- **WITHDRAWN: "the modifier's lawful window is nine to fourteen words", argued from a composed `wordsPerSentence.neighbourVariation` against an eighteen-word spine.** The band arm does not score the composed unit. Every `band` row in `measure-draft.json` carries `sentences: 1` — it scores the face alone — and **all 84 faces of all seven pools return the identical row**: `scored 21 · exceeded 13 · exceededShare 0.619 · deepest wordsPerSentence.neighbourVariation 1.597 under · budgetOk true · depthOk true · perfectionSuspect false`. Those 84 faces run from 8 words (`stores: import-fed`) to 20 (`stores: short`). The band position of a one-sentence face is therefore wording-insensitive at this grain, and the only length-sensitive scored metrics are `wordsPerSentence.shareUnder8` (fires at l < 8) and `shareOver30` (fires at l > 30). The lawful window is 8 to 30. A window of nine to fourteen was an unmeasured constraint about to become a design constraint — the failure mode the estate has already recorded once.
- **CONFIRMED AND KEPT: the `{settlement}`-as-closer trap.** `closers.abstractNounRate` reads the stripped slot as `settlement`, which matches `/ment$/` (`proseFingerprint.js:147`). It belongs in the writers' prompt as a one-line wall, along with the pool-key collision wall round 3 found (`pressed` is a member of `SUPPLY_CLAIM_LEXICONS.processing`, so any pool whose key word is `pressed · cured · dried · milled · forged · refined` takes a WITHHELD on every face that speaks its own name).

**The band position, reported as information only** (§21.1). `exceededShare` 0.619 sits between §16.2's ENTRY-grain human median (0.57) and p90 (0.67), at depth 1.597 against the ENTRY depth of 1.75 and 13 exceedances against the ENTRY budget of `floor(21 × 2/3) = 14`. The set is inside the human band with one exceedance of headroom, which is the discipline behind every zero in §4: two more scored shapes would put the pool over budget. `perfectionSuspect` is false, so the set is not flagged for being too clean.

---

## 6. REFUSALS (a refusal is a result)

- **R1 — THE SOURCE CITATION, REFUSED; the provenance count for this pool is 0, deliberately.** The card prints `source: road · standing LICENSED`. Register card S3 licenses a citation on the player's page only where a clerk would cite — two accounts that disagree, a count from an interested party, a record whose keeper is a power — and none of the three holds here: the road is not a power, the fact is not a count, and no second account exists. S3's own sentence is that the player's page states the fact as compiled and the referee's page names the keeper. MOVE-GRAMMAR §4.4.3 adds that a citation on a fact whose holder is the office itself is a finding, and budgets the move from the exemplar bands rather than licensing a habit. Chair-vetoable: if the sitting wants the move exercised on this pool, the lawful form is `The country about {settlement} is beset country by the road's account.`, and it should be one face of twelve, never four. No face matches the PROVENANCE detector's holder kinds (`moveGrammar.js:225`); `the books` and `the record` are common nouns naming no holder, which is what SITTING §Q.2 narrowed the detector to exclude.
- **R2 — THE VALUE WORDS `frontier` AND `plagued`, REFUSED.** The predicate is a union of two bands; a face naming either is false on the other half of the population the pool fires on.
- **R3 — THE `{defwork}` SLOT, REFUSED.** It is in the bag and the card records it as NOT FILLED at this block's call sites; a face naming it would be unreachable at every draw (arm D, "a slot the composer never fills"). `{settlement}` alone is used, once per face, so arm A6's slot-set identity holds across all twelve.
- **R4 — THE WALL, THE GATE, THE WATCH, THE MUSTER, THE WAGES, THE STONE, REFUSED AS NOUNS.** `may NOT … another civic object of the class wall, any field the attached spine tests (forces.walls.present · settlement.defenseProfile.economicGates.military)`. This is also what forecloses the easy thread — carrying the spine's own noun forward — because on this pool the spine's nouns ARE its tested fields (arm A1: a modifier neither restates nor negates its spine). The turn outward is the thread that remains, and it is the licensed one.
- **R5 — THE SPATIAL AND BOUNDARY FACES, REFUSED.** `Settled country stops short of {settlement}`, `Beside {settlement} the country stands entered as beset` and `Where {settlement} sits, the country is harried` all assert a geometry on a field that holds none (MOVE-GRAMMAR §1.2 row 8; `PROVENANCE_LEXICONS.spatial`). `about` and `around` are the field's own vagueness and claim no perimeter; `surrounds` and `beyond` stay dropped.
- **R6 — THE PRACTICAL READING, REFUSED** (`not safe to be out in`, `not safe to cross`). That is the danger's COST to the town, and CONSEQUENCE is double-licensed by event provenance × a household or office row (R-DA-19). Neither exists here.
- **R7 — THE RECORD AS GRAMMATICAL SUBJECT, REFUSED.** `The books put the country at beset`, `The record grades the country` — the first two escape `RECORD_CITATION` on their verbs, which is precisely why the refusal is stated as a law and not left to the regex. Naming the compiling office per entry is R-DA-01's once-declared frame returning by the back door. Every record reference in this packet is oblique — `on the books`, `in the entry`, `in the record`, `wherever the books are kept` — and the record never says anything.
- **R8 — THE SPECIFICATIONAL AND CLEFT FORMS, REFUSED.** `Beset is what the record enters about {settlement}`, `What holds about {settlement} in the common way is beset country`, `the grade … is the one it carries`. The first and third match `SPECIFICATIONAL_COPULA`; the second escapes the regex and is refused anyway, because a wh-cleft entails that its focus exhausts an open column, which is the arm's whole reason to exist.
- **R9 — QUANTIFIERS, REFUSED.** Licensed only by a `closed` column, and the card's REFUSED COLUMNS line shuts that door permanently. Two drafts died here again this round: `no settled grade covers the country about {settlement}` and `nothing settled covers it`.
- **R10 — THE SIBLING POOL'S VOCABULARY, REFUSED BY CRAFT (not by law).** `country: pressed (unwalled)` is authored on the SAME field with `dangerous ground · rough country · hard country · hostile · not quiet · unquiet · trouble · threat · live danger`, and with the verbs `lies about · runs through · holds close · sits about`. The two pools are mutually exclusive by the walls polarity class, so no unit carries both and no arm compares them — but a shared line or verb across two pools on one field is a template a refuter would name on sight. This pool owns a disjoint family: the record's GRADE (`beset · settled · grade · entry · books · record`) and one condition word (`harried`), with `stands · takes · keeps · marked · misses · carry · held` for verbs. Nothing here repeats a phrase or a verb of the sibling pool.
- **R11 — THE Q FINDING, REFUSED AS NOT THE MODIFIER'S; §1(a) and §1(b) carry the receipt.** Twelve WITHHELD rows whose clause is `stone keeps itself, and wages do not.`, the post-semicolon half of `WALLED-STRAINED` spine variant 1 (`:6036`). No lawful modifier wording reaches it; the only text property that would suppress it is refused twice over by ARCH §2.5's seam contract and T-F8, and the form line is not mine to move. **Recommended chair cure, vetoably:** the spine variant is rewritten in place at the wave, under the spine pool's own refinement round.
- **R12 — `counts as`, RETIRED AS A LATENT FAIL.** §3, first bullet. A duty predicate resolved against `whatItCounts`; a FAIL on any firing settlement whose instantiated service rows are empty, which the taste's single ground cannot show.
- **R13 — `reckoning` AND THE RUBRIC `head`, RETIRED.** §3, second bullet. One sits a spelling away from `DUTY_PREDICATES`; the other a plural away from the population count nouns.
- **R14 — THE LENGTH TARGET, REFUSED.** I did not push the faces toward the middle of the 8-to-30 window. §21.4: compression that rewards the reader is part of the ceiling, and padding a one-claim sentence to sixteen words buys a band position by trading density for plainness, which is the named regression. The spread is widened instead; the position is reported as information (§5).

**THE PRE-EXISTING STRUCTURAL REFUSAL, carried unchanged and still not mine to cure.**
`ATTACH WALLED-STRAINED: the spine's key and the modifier's key name the same civic object class 'wall' (T-F12)`. The gate confirms it is live in the shipped build and waived only under `--taste`, which the shipped projector never passes — so the pool cannot land while the key reads as it does. It is a **key-string** collision (`walled` in `country: pressed (walled)` against `WALLED-STRAINED`), not a text property: no wording of mine can move it, and the guard cannot tell a key that NAMES the wall from a key that merely distinguishes the walled BRANCH. **Recommended chair cure, vetoably:** rename the modifier pool to a key naming no civic object class. `country: beset (strained)` is exact on both halves — the ATTACH set is precisely `WALLED-STRAINED`, its sibling attaches to the two `UNWALLED-*` keys, and no face in this packet says `pressed`. A key rename is a seed input (A7/A17) and therefore a chair act; the twelve rows above are unaffected by it, since no face names the key.

---

## 7. WHAT THE SITTING SHOULD TAKE FROM THIS PACKET

1. **A modifier's gate verdict is not a modifier's property — and this is now measured across the whole sample, not argued from one pool.** All 204 listed findings, seven pools, three blocks, every one on shipped spine text; zero on any writer's face (§1(a), with the line for each, and with the 24 counted-but-unlisted rows declared). If the taste table attributes findings to the pool, all seven sets are refused for a spine debt and seven refiners are dispatched against wording already at its ceiling. **Attribute findings per piece.** The composed walker already carries the information it needs to do this: the withheld segment is matched against the spine's own text before the face is appended.
2. **The band arm scores the FACE, not the composed unit,** and returns the identical row for every one-sentence face in the sample regardless of wording or length. Two consequences: a face-grain band figure cannot discriminate between drafts, so it should not be read as a quality signal; and any length rule derived from a *composed* metric — as round 3's was — is unmeasured. The band's real length walls are 8 and 30 (§5).
3. **Scan every planned pool key against the lexicons before a writer is dispatched.** `pressed` is the pool key's own word and a member of `SUPPLY_CLAIM_LEXICONS.processing`; it cost this pool eight WITHHELD rows in round 2 for quoting its own name. `counts`, `reckons`, `register`, `muster`, `toll`, `assess` and `tithe` are all duty lemmas that a key or a natural first draft will reach for. Hand the writer the collision list with the brief.
4. **A single-ground taste run cannot show a per-settlement FAIL.** `counts as beset` was clean on this run and is a FAIL on any firing settlement with empty service rows (§3). Either the harness walks two grounds — one with the columns full, one with them empty — or every packet is asked, as this one was, to check its predicates against the column arms by hand.
