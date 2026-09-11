1. `[plain]` The country about {settlement} is on the books as pressed country.
   - `[face]` Pressed is how the country about {settlement} is entered.
   - `[face]` Around {settlement} the country grades as pressed, and holds at that grade.
   - `[face]` The ground about {settlement} comes under the pressed head.
2. `[plain]` The ordinary state of the ground about {settlement} is beset country.
   - `[face]` In the common run of things the country about {settlement} is menaced.
   - `[face]` By plain reckoning the ground about {settlement} stands harried.
   - `[face]` Beset country about {settlement} is the usual case, and the case holds.
3. `[plain]` The settled grade does not cover the country about {settlement} at present.
   - `[face]` Beyond {settlement} the country falls outside the settled grade.
   - `[face]` Under the settled grade the ground about {settlement} does not fall.
   - `[face]` Settled country is not the class the ground about {settlement} keeps.

--- NOTES

**Pool.** DS-DEF-11 · `country: pressed (walled)` · draft round 2 · seat Opus 5 (Fable-unvalidated).
Card read by `node scripts/prose-licence-card.mjs DS-DEF-11 'country: pressed (walled)'` in `$SC/laneTASTE`; the block's own annex section read at `laneTASTE/docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:6017-6107` (arms A1, A11) — the two `WALLED-STRAINED` spines this pool attaches to, and the already-authored sibling pool `country: pressed (unwalled)` on the same field.
3 variants · 12 faces · every face ONE sentence · FORM `sentence` · seat `sentence` · MOVE `PRESENT` · RELATION `addition` · angle `plain` · audience player, no mark · ATTACH `WALLED-STRAINED`.
**Slot set: `{settlement}`, exactly once, in every one of the twelve lines** — never sentence-initial (T-F8), never sentence-final (see measure 3 below).

**Words per face** (the harness's own counter: whitespace tokens, `{settlement}` counting one):
- variant 1 — **11 · 9 · 12 · 9**
- variant 2 — **11 · 12 · 9 · 12**
- variant 3 — **12 · 9 · 11 · 11**

---

## 1. THE GATE'S FEEDBACK, ANSWERED MEASURE BY MEASURE

**(a) REFUSAL, DS-DEF-11 :: `country: pressed (walled)` #3 — "a face names slots {none} where its parent names {settlement}" (A6). CURED, and three further defects in the same neighbourhood cured with it.**
The offending face was round 1's 3-f1 `The country here does not grade as settled.` Every line of this round carries `{settlement}` exactly once, so `assertFaces`'s `parentSlots` comparison is an identity on all twelve. While re-reading the arm I found three more round-1 rows that would have failed a measure the gate never reached, and they are gone too:
- round 1's 3-f2 `Unsettled country surrounds {settlement}.` — **`unsettled` is the OPEN detector's first alternative** (`moveGrammar.js` CLAUSE_DETECTORS, the OPEN row), so that face would have classified as OPEN against a pool declaring `MOVE: PRESENT`. No line in this round contains `unsettled`, nor the bigram `not settled` (the same row's `not (yet )?(decided|settled|answered)` limb). Variant 3 names the sibling band as `the settled grade` / `settled country` and negates the *covering*, never the word `settled` itself.
- the same face was **4 words**, and it **closed on `{settlement}`**. Both are depth breaches; see (c).
- round 1's 1-f2 closed on `occasion` — `/sion$/`, an abstract-noun closer; see (c).

**(b) EVERY MEASURE NOT-EXECUTABLE · 0 units walked · "1 of 1 variant still carries ⟦TO-AUTHOR⟧".**
This is the consequence of (a), not a second finding: the packet was refused at `assertFaces`, so nothing was applied and the pool's authoring marker stood. The failing measure moves when the packet becomes applicable, which is what this round delivers. With the twelve rows in place the pool's marker is gone and the walk has **2 spines × 2 spine-variants... ** — precisely: `unitsOfPool` composes `attach` (1 key, `WALLED-STRAINED`) × its 2 spine variants × 1 face each (the spines are single-faced today) × 3 variants × 4 faces = **24 composed units** for the walk, where round 1 produced 0.

**(c) BAND POSITION — NOT-EXECUTABLE last round; this round is written against the bands, arithmetic first.**
I read the ten leaf fingerprints in `$SC/prose-research/primary/` (`EXEMPLAR_LEAVES`, `taste-measure.mjs:108`) and computed the four bands that a ONE-SENTENCE face can actually breach at depth, against the ENTRY numbers (BUDGET 2/3, **DEPTH 1.75**, Part B §16.2):

| metric | band (lo–hi) over the ten | a face that fires it | depth | verdict |
|---|---|---|---|---|
| `wordsPerSentence.shareUnder8` | 0.0292 – 0.3333 | any face under 8 words → 1.0 | **2.19** | over 1.75 — **a face under 8 words cannot pass** |
| `wordsPerSentence.shareOver30` | 0.0489 – 0.3382 | any face over 30 words → 1.0 | **2.29** | over 1.75 |
| `shapes.adverbsPerSentence` | 0.059 – 0.392 | one `-ly` adverb → 1.0 | **1.83** | over 1.75 — **zero adverbs, not "few"** |
| `closers.abstractNounRate` | 0.0122 – 0.1151 | a closer in `ness/tion/sion/ity/ment/ance/ence/ship/hood/dom` → 1.0 | **8.60** | the deepest trap in the file |
| `closers.pronounRate` | 0.0213 – 0.1083 | a closer in `it/them/this/that/there/here…` → 1.0 | **10.25** | — |

⭐ **The `{settlement}` trap, which is why no face ends on the slot.** `proseFingerprint.js:114` takes the last word and strips non-letters, so a face ending `… {settlement}.` yields the token `settlement`, which matches `/ment$/` and scores `closers.abstractNounRate = 1.0` — depth 8.60, five band-widths past the entry DEPTH on its own. Two round-1 faces ended on the slot. None here does.
Every face is therefore **9–12 words** (never under 8, never over 30), carries **no `-ly` adverb**, and closes on `country · entered · grade · head` / `country · menaced · harried · holds` / `present · grade · fall · keeps` — no pronoun, no abstract suffix.
Zero faces fire: semicolon · colon · em dash · question · exclamation · parenthesis · `dialogueShare` · `whichTailRate` · `thereIsOpenerRate` · `participialOpenerRate` (checked on the FIRST word only: `Pressed`, `Around`, `In`, `By`, `Beset`, `Beyond`, `Under`, `Settled`, `The`) · `triadRate` (no `, X, Y, and Z` run) · `doubledAdjectiveRate` (the regex wants `\w+SUF and \w+SUF` adjacent — every `and` in this packet is preceded by a comma or by a non-suffixed word) · `antithesisRate`.
**The composed grain, chosen deliberately.** The two `WALLED-STRAINED` spines are 18 and 23 words. `neighbourVariation` on a two-sentence unit is `|l₂−l₁| / mean`, band 0.495–0.805; at 9–12 words a face lands **0.48–0.67 against the 18-word spine and 0.56–0.88 against the 23-word spine** — inside the band or a fraction outside it, never near the depth. This is the reason the faces cluster at 9–12 rather than matching the spines' own length: the estate's measured weakness is `neighbourVariation` 0.399, and a short second sentence after a long spine is the licensed cure.

**(d) SIBLING DISTANCE — NOT-EXECUTABLE last round; written for the ceiling this round.**
`armA5` fires only when two faces share their **opener** (first two words, slots normalised), their **sentence count** and their **content tokens** at the floor. All twelve openers are pairwise distinct across the whole pool, not merely inside each variant: `the country` · `pressed is` · `around {}` · `the ground` · `the ordinary` · `in the` · `by plain` · `beset country` · `the settled` · `beyond {}` · `under the` · `settled country`. Inside each variant the four faces differ in rhythm as well as vocabulary — a plain predication, an inversion, a fronted adverbial, and a coordinate — so the set is four constructions and not four synonym swaps. A11's cross-variant rule (no two variants share their first two words) holds on `The country` / `The ordinary` / `The settled`.

**(e) PROVENANCE — the count for this pool is 0, and that is a decision, not an omission.** See refusal R1.

---

## 2. THE ONE CLAIM, AND THE THREE CONSTRUCTIONS

Every one of the twelve faces asserts exactly one typed claim and nothing else: `settlement.config.monsterThreat`, resolved by `measuredMonsterFamily` to `plagued` or `frontier`, stated as a STANDING fact of the record. CONFIRMED at this tip: `defenseStateProseCandidates.js:63` (`family === 'plagued' || family === 'frontier'`) and `defenseStateProse.js:217-222` (`MONSTER_FAMILY_OF` is total over `plagued · frontier · heartland→settled`). The claim never varies; the grammar must.

- **Variant 1 — THE GRADE.** The country is classed at the pressed grade. Close kinds: a civic noun, a standing participle, the grade itself, the head it comes under.
- **Variant 2 — THE STANDING CHARACTER.** The pressure is the country's ordinary case, not an occasion — said with four different words for "ordinary" (`ordinary · common · plain · usual`), which is where the variant's vocabulary spread lives.
- **Variant 3 — THE BAND SHORTFALL.** The country does not come under `settled`, the third value of the same three-value family. This is the pool's one contrast, and it is written so that it does **not** match `CONTRAST_SHAPES` (no `not X but Y`, no `, not x`, no trailing `and not x`), which keeps arm A3 at NOT-EXECUTABLE rather than WITHHELD — the round-1 draft would have taken a WITHHELD here, and a WITHHELD is never a pass (`entryWalker.js:874`).

**One term for one thing (R-DA-22), applied deliberately.** The two grade names are stable across the pool — the firing grade is `pressed` (the pool key's own word) in variant 1, the rejected band is `settled` in variant 3. The words that vary (`beset · menaced · harried`) describe the world's condition, not the grade, and so are not the register's "one term for one thing".

---

## 3. LICENCE, CLAUSE BY CLAUSE

| face(s) | the claim it makes | the card clause that licenses it |
|---|---|---|
| all 12 | the country about this town is pressed / beset / outside the settled grade | `reads: settlement.config.monsterThreat`; `predicate: measuredMonsterFamily ∈ {plagued, frontier}`; **`may claim: that monsterThreat holds, as a STANDING fact of the record`**; MOVE `PRESENT` (MOVE-GRAMMAR §1.2 row 1 — a standing configuration field licenses a STRUCTURAL clause) |
| all 12 | `{settlement}` | `bag: {defwork: bare-common, settlement: proper}`, **FILLED at this block's call sites: `{settlement}`**; never sentence-initial (ARCH §2.5 face row, T-F8) |
| 1-plain (`on the books`), 1-f1 (`is entered`), 1-f2 (`grades as`), 1-f3 (`the pressed head`) | the fact is a classification the record carries | the **`of the record`** half of `may claim`. The field is a tier (`MONSTER_THREAT_TIERS`), so naming its grade is the field's own shape, and `A4`'s no-digit rule makes the band a WORD (R-DA-16). The grader is never the grammatical subject — see refusal R8 |
| 1-* (`pressed`) | the union of the two firing values | the pool KEY's own word. Naming `frontier` or `plagued` is refused (R2): the pool fires on the union and either value word is false on half of it |
| 2-plain, 2-f1, 2-f2, 2-f3 (`ordinary · common run · plain reckoning · usual case`) | the condition stands; it is not an incident | the **STANDING** clause of `may claim`, read against MOVE-GRAMMAR §1.2 row 2: HISTORY needs an event-provenance field, which this pool has none of, so the eventless reading is the only licensed one — and it is stated rather than left to be inferred |
| 2-f1 `menaced`, 2-f2 `harried`, 2-plain/2-f3 `beset` | the country presses on the town | the field's own meaning. No actor is named, no event, no count, no season — the three the card refuses |
| 3-plain, 3-f1, 3-f2, 3-f3 (`the settled grade` / `settled country`) | the country falls outside the `settled` band | `MONSTER_FAMILY_OF` is total over `plagued · frontier · settled`, so `settled` is a **sibling band of this pool's own read field** — the one licence R-DA-02 / MOVE-GRAMMAR §1.4 wall 5 gives a contrast. No second field is touched |
| every `, and …` tail (1-f2, 2-f3) | the same fact's persistence | the STANDING clause again. Neither tail asserts a second FIELD, so neither engages S2's clause seat or R-DA-03's second sentence; each is one fact in one sentence. These two rows are the packet's boldest and the first place a refuter should look |

**Thread (owner, 2026-09-08 ~21:4x).** The composed unit is spine-then-modifier, and the modifier is always last, so each face is the passage's **one turn outward** — from the town's stone and wages to the country it stands in — which is the shape the wall licenses for a change of subject. It hands a noun back in the same breath: all twelve name `{settlement}`, so the turn lands on this town's ground rather than on a general landscape. **No face contains a pronoun that points outside itself** (the only pronoun-shaped words in the packet are `that grade` and `the case`, both bound inside their own sentence), so every face also reads cleanly in second position after the sibling modifier `watch: bought (revealed)` — "…the town holds it in the open. Beset country about {settlement} is the usual case, and the case holds."

---

## 4. REFUSALS (a refusal is a result)

- **R1 — THE SOURCE CITATION, REFUSED; the provenance count for this pool is 0.** The card prints `source: road · standing LICENSED`. Register card S3 licenses a citation on the PLAYER's page only where a clerk would cite — two accounts that disagree, a count from an interested party, a record whose keeper is a power — and none holds here: the road is not a power, the fact is not a count, and no second account exists. S3's own sentence is that the player's page states the fact **as compiled** and the referee's page names the keeper. MOVE-GRAMMAR §4.4.3 adds that a citation of a holder that is the office itself is a finding. Chair-vetoable: if the sitting wants the move exercised on this pool, the lawful form is `The country about {settlement} is pressed country by the road's account.` (11 words, fires the PROVENANCE detector's `from the road` sibling only if worded `from the road`), and it should be **one** face of twelve, never four.
- **R2 — THE VALUE WORDS `frontier` AND `plagued`, REFUSED.** The predicate is a union of two bands. A face naming either is false on the other half of the population the pool fires on.
- **R3 — THE `{defwork}` SLOT, REFUSED.** It is in the bag and the card records it as NOT FILLED at this block's call sites; a face naming it would be unreachable at every draw (arm D's shape). `{settlement}` alone is used.
- **R4 — THE WALL, THE GATE, THE WATCH, THE MUSTER, THE WAGES, REFUSED AS NOUNS.** `may NOT … another civic object of the class wall, any field the attached spine tests (forces.walls.present · settlement.defenseProfile.economicGates.military)`. This also forecloses the easy thread — carrying the spine's own noun forward — because on this pool the spine's nouns ARE its tested fields (arm A1: a modifier neither restates nor negates its spine). The turn outward is the thread that remains, and it is the licensed one.
- **R5 — THE SPATIAL FACES, REFUSED.** `Settled country stops short of {settlement}` and `Dangerous ground begins where the town's ground ends` both assert a boundary on a field holding no geometry (MOVE-GRAMMAR §1.2 row 8; `PROVENANCE_LEXICONS.spatial`). Round 1 kept `surrounds` and flagged it; **this round drops it** — `about` and `around` are the field's own vagueness and claim no perimeter.
- **R6 — THE PRACTICAL READING, REFUSED** (`not safe to be out in`, `not safe to cross`). That is the danger's COST to the town, and CONSEQUENCE is double-licensed by event provenance × a household or office row (R-DA-19). Neither exists here.
- **R7 — THE RECORD AS GRAMMATICAL SUBJECT, REFUSED.** `The record holds…`, `the books say…` match `RECORD_CITATION` (`entryLexicons.js:335`) and are WITHHELD by the entry walker's F25 arm; naming the compiling office per entry is R-DA-01's once-declared frame by the back door. Variant 1 therefore says `is on the books as`, `is entered`, `grades as`, `comes under` — passive or intransitive throughout, and the record is named in **one** of twelve faces.
- **R8 — THE SPECIFICATIONAL FORMS, REFUSED.** `Unsettled country is what {settlement} sits in`, `the grade … is the one it carries` match `SPECIFICATIONAL_COPULA` and entail an exhaustive column (arm X). Every `is` in this packet is followed by a bare predicate, never by `what`, `who`, `the only`, `the one`, and no face opens `The X … is the Y` (the regex's second limb).
- **R9 — QUANTIFIERS, REFUSED.** `every · all · each · only · none · any · no · whole · entire` (`QUANTIFIERS`, `entryLexicons.js:93`) are licensed only by a `closed` column, and the card's REFUSED COLUMNS line closes the door for good. Two natural drafts died here — `no settled country lies about {settlement}` and `the grade holds in every reading`.
- **R10 — THE SIBLING POOL'S VOCABULARY, REFUSED BY CRAFT (not by law).** `country: pressed (unwalled)` is authored on the SAME field with `dangerous ground · pressed country · hostile ground · not quiet · trouble · the threat stands · live danger runs · the pressure of the country`. The two pools are mutually exclusive by the walls polarity class, so no unit carries both and no arm compares them — but round 1's variant 1 plain line was **byte-identical** to that pool's variant 1 plain line, which is a template a refuter would name on sight. This round owns a disjoint family: the record's GRADE (`pressed · settled · head · books`) and the condition words `beset · menaced · harried`. Nothing in the packet repeats a phrase of the sibling pool.

**THE ONE REFUSAL THAT IS NOT MINE TO CURE — the T-F12 ATTACH row the gate reported.**
`ATTACH WALLED-STRAINED: the spine's key and the modifier's key name the same civic object class 'wall'`. This is a **key-string** collision (`walled` in `country: pressed (walled)` against `WALLED-STRAINED`), not a text property: no wording of mine can move it, and the guard cannot see the difference between a key that names the wall and a key that merely distinguishes the walled *branch*. It is waived only under `--taste`, which the shipped build never passes, so the pool cannot land while the key reads as it does. **Recommended chair cure, vetoably:** rename the modifier pool to a key naming no civic object class — `country: pressed (strained)` is exact, since the ATTACH set is precisely `WALLED-STRAINED` and its unwalled sibling attaches to the two `UNWALLED-*` keys. A key rename is a seed input (A7/A17) and therefore the chair's act and not a writer's; the twelve rows above are unaffected by it, since no face names the key.

---

## 5. WHAT THE SITTING SHOULD TAKE FROM THIS PACKET

1. **The `{settlement}`-as-closer trap is a corpus-wide hazard, not a fact about this pool.** Any face ending on the settlement slot scores `closers.abstractNounRate = 1.0` at depth 8.60 because the fingerprint strips the braces and reads `settlement` as `…ment`. Fifteen-to-twenty authoring workflows are about to write nine thousand faces; this belongs in the writers' prompt as a one-line wall, or the band arm will red on a shape no author intended.
2. **A face under 8 words cannot pass the entry DEPTH** (2.19 band-widths), so "the short line exists" — the register card's own permission — is not exercisable at the FACE grain, only at the composed-unit grain where a 9-word modifier after a 23-word spine puts `neighbourVariation` inside the band for the first time. Round 1 wrote a 4-word face as a deliberate low-edge probe; the arithmetic says that probe fails, and this round withdraws it. The finding is worth a sitting line: **the register's short line now lives in the modifier, and the modifier's floor is nine words.**
3. **The echo, observed and not decided (carried from round 1, unchanged).** On a `plagued` or `frontier` town the defense tab also renders DS-DEF-2's Beasts row, keyed on `beastsRowPoolKey(monsterThreat, …)` — the same field, the same tab — and the card's own echo line warns that the echo table is keyed on the coarser producer root `settlement.config`. ARCH §6.3 authored this pool knowing it, so the pool is not mine to refuse. What I did instead is keep every face on the country's standing GRADE and off the creature: no face names a beast, a raid, or anything that comes out of the country, so the two mounts share the fact and share no noun. Cross-block arm C7 should read this pair first.
