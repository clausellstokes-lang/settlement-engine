1. `[ledger]` The country about {settlement} runs with creatures, and the town keeps people on the wall.
   - `[face]` About {settlement} the country is plagued, and the wall is held by people.
   - `[face]` People hold the wall at {settlement} in country thick with creatures.
   - `[face]` The wall at {settlement} stands in country entered as plagued, and the people on it are the town's.
2. `[street]` At {settlement} the country is thick with creatures, and people are on the wall in the ordinary course.
   - `[face]` Creatures are thick in the country about {settlement}, and the town puts people on the wall.
   - `[face]` In plagued country the wall at {settlement} is up, and on it stand the town's people.
   - `[face]` The town has people on the wall at {settlement}, and the country about it runs with creatures.
3. `[unfolding]` The creatures stay thick in the country about {settlement}, and the town goes on keeping people on the wall.
   - `[face]` People go on holding the wall at {settlement}, in country still thick with creatures.
   - `[face]` Where the country about {settlement} is plagued, the wall is still held by people.
   - `[face]` Held by people, the wall at {settlement} keeps standing, and the country about it stays plagued.

--- NOTES

**Pool.** DS-DEF-2 · `Beasts & Monsters: plagued, perimeter AND organized force` · draft round 1 · seat Opus 5 (Fable-unvalidated), for the Fable chair.

**What was read before a word was written.** `REGISTER-CARD.md` whole (with S2 and S3); `RULES-V2-PART-B.md` §1 whole (R-DA-00 … R-DA-24 and §1.W), §16, §16.1, §16.2, §18, §20, §21, §21.1–§21.4, §22, §23, §24; `sweep/MOVE-GRAMMAR.md` §1–§3 and §4.4.1–§4.4.3 and §1.4.1 (THE THREAD); `sweep/CLERK-LAWS.md` §2.4.1 and §2.6.1; `arch-prose/ARCH-COMPOSED-PROSE-v2.md` §2.5 (the annex grammar and every refusal row) and §8.3 (the licence card). The card was printed first by `node scripts/prose-licence-card.mjs DS-DEF-2 'Beasts & Monsters: plagued, perimeter AND organized force'` in `$SC/laneRW-DEF2`, and the block's annex section was read whole at `laneRW-DEF2/docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:2568-2726` — the pool's own three rows, the six sibling `Beasts & Monsters` spines, and the nineteen spines of the block's other four rows (arms A1 and A11: nothing below restates or contradicts a sibling). The projector's row grammar was read at source (`scripts/lib/dossier-annex-grammar.mjs:107`, `FACE_ROW_RE` — a face sub-row is a hyphen, then the face tag in code marks, then the sentence; the nine rows above are written in exactly that form, with three leading spaces as ARCH §2.5's example row has them). The selecting branch and its caller were read at `src/domain/display/stateProse/defenseStateProse.js:269-273, 383-388, 559-562, 591`, and the buckets at `src/domain/institutions/defenseInstitutionBuckets.js:84-99, 169-182`. **Declared:** the superseded first-attempt packet for this same pool (`$SC/rewrite/DS-DEF-2.attempt1/…/draft-round-1.md` and `refine.md`) was also read; the twelve wordings below are this seat's own and none is carried over, but four of that packet's findings are re-raised in §5 because they are the pool's, not its author's.

**Shape.** 3 variants (the three the corpus holds, in place, in order, under their own vids) · **12 wordings = 3 numbered rows + 9 `[face]` sub-rows**. Each numbered row opens on the variant's OWN angle tag exactly as it stands — `[ledger]`, `[street]`, `[unfolding]` — **one bracketed tag and no second; no `[plain]` anywhere** (`[plain]` is the modifier palette's angle and the projector mints a second tag as an unclassified mark). No variant added, removed, merged or reordered; the typed lines of the pool are untouched and not repeated here. ROLE `spine` · FORM `sentence` · MOVE (none declared) · audience player, no mark · relation none (a spine takes none).

**Every wording is ONE sentence.** Twelve of twelve split to exactly one segment on arm Q's own boundary (`/(?<=[.?!])\s+(?=[A-Z"'(])/`) and on `;`, so this spine contributes zero withheld trailing segments to any composed unit that ever mounts a modifier on it. Today's rows contribute three (a colon in variants 1 and 2, a semicolon plus a trailing coordinate in variant 3).

**Slot set: `{settlement}`, exactly once, in every one of the twelve lines** — never sentence-initial (ARCH §2.5's T-F8 refusal for a sentence-form row) and never sentence-final (the abstract-closer trap). `{band}` and `{route}` are in the bag but RESERVED and unfilled at this block's call sites (`defenseStateProse.js:558`), so neither appears.

**Words per wording** (whitespace tokens, `{settlement}` counting one):

| variant | numbered row | `[face]` 1 | `[face]` 2 | `[face]` 3 |
|---|---|---|---|---|
| 1 · `[ledger]` | **15** | **13** | **11** | **18** |
| 2 · `[street]` | **18** | **16** | **16** | **17** |
| 3 · `[unfolding]` | **19** | **14** | **14** | **16** |

mean **15.58** · min **11** · max **19** · sd **2.31** (sample) · none under 8, none over 30.

---

## 1. THE CLAIM SET, AND WHY ALL TWELVE CARRY THE WHOLE CONJUNCTION

The card prints ONE licensed claim:

> `may claim:` that `js)` (=== plagued country, perimeter and force) holds, **as a STANDING fact of the record**

That claim is a CONJUNCTION, not three facts: `beastsRowPoolKey(monsterThreat, perimeter, force)` (`:383-388`) returns this pool's key only when `measuredMonsterFamily` is `plagued` AND `walls.present` AND `garrison || militia` — an exact `if and only if`. Its three limbs are therefore the pool key's discriminating claim, and MOVE-GRAMMAR §3.4 forbids a rewrite to drop the discriminating claim of the key (U9). So every one of the twelve wordings states all three limbs, and the four faces of a variant are claim-equal to each other by construction (arm A6):

| limb | the read that licenses it | what it does NOT license |
|---|---|---|
| the country about the town is plagued | `config.monsterThreat` → `measuredMonsterFamily` → the family word `plagued` (`:269-273, 591`) | how many, what kind, what they have done, when, or a season |
| a wall stands | `forces.walls.present`, a non-empty `walls` bucket (`:560`; buckets at `defenseInstitutionBuckets.js:84-87`) | material, extent, quality, a gate, or any second civic object of the class |
| people hold it | `garrison \|\| militia` (`:591`; buckets at `:88-95`) | which of the two, how many, whether paid, what they do, how often |

**Why the old variant 2 and variant 3 gain a limb they did not spell out, and why that is not an added claim.** Variant 2 said the wall (its gates) and the force (its rotations) and not the country; variant 3 said the country's pressure and what the town had built and not the force. Under the card the three are ONE claim with one licensing predicate, and a row that spells two of them renders a state the branch cannot produce — it reads as a sibling pool (`plagued, perimeter but NO force to hold it`, `:2600-2603`). Stating the pool's own conjunction in full is stating the claim the row already made, not a second one; the rewrite adds no claim outside the card, and §6 lists everything it drops.

**Why `people` and not `garrison`, `militia`, `watch` or `soldiers`.** The branch reads `garrison || militia`, so either institution word is false on the half of the firing population that has the other, and `watch` is a bucket this branch never consults. `people` is the one term true on the whole population, and it is the corpus's own word in this row. **Why `wall` and one name form only:** R-DA-22 (one term for one thing). Today the block spells the same object `wall`, `line`, `perimeter` and `works` across twenty-six pools; this packet uses `wall` throughout, and the block-wide name-form ruling is flagged in §5, not taken.

**Why the possessive is used twice and no more.** `1-f3` (`the people on it are the town's`) and `2-f2` (`the town's people`) say whose the force is. That is licensed and narrow: `standingDefenseForces` partitions the settlement's OWN live institutions (`defenseInstitutionBuckets.js:169-182`) and `mercenary` is a separate bucket (`:98-99`) this branch does not read, so the possessive names the buckets that fired and asserts nothing about the one that did not. It is never written as a contrast with a hired force (that would be R-DA-02's unlicensed antithesis).

---

## 2. LICENCE, WORDING BY WORDING — every claim against the card clause that licenses it

`P` = the plagued-country limb · `W` = the perimeter limb · `F` = the force limb, all three of the card's single `may claim` line, MOVE `PRESENT` (MOVE-GRAMMAR §1.2 row 1: a standing configuration field licenses a STRUCTURAL clause). `{settlement}` in every row is the card's `bag: {settlement: proper}`, FILLED at this block's call sites.

| wording | its claims | the card clause that licenses each |
|---|---|---|
| 1 (`[ledger]`) | `runs with creatures` = P · `the wall` = W · `the town keeps people on the wall` = F | `predicate` (`=== plagued country, perimeter and force`) + `may claim … as a STANDING fact`. `keeps` is habitual present: the arrangement that stands, no event, no frequency |
| 1-f1 | `the country is plagued` = P (the field's own value word) · `the wall` = W · `held by people` = F | the same one clause; `plagued` is the value `measuredMonsterFamily` returns, not a characterisation |
| 1-f2 | `country thick with creatures` = P · `the wall` = W · `People hold` = F | the same; the corpus's own rendering of the value word, kept from the old row |
| 1-f3 | `entered as plagued` = P, framed as the record's entry · `the wall … stands` = W · `the people on it are the town's` = F | the **`of the record`** half of `may claim` (the fact is compiled and entered, standing). It names no keeper and no reporting verb, so it is neither a `RECORD_CITATION` (`entryLexicons.js:335`) nor the PROVENANCE move (`moveGrammar.js:225`) — see R9. One face of twelve, by the spread rule (Part B §16(4)) |
| 2 (`[street]`) | `thick with creatures` = P · `the wall` = W · `people are on the wall` = F · `in the ordinary course` = the STANDING modality | `may claim … as a STANDING fact of the record`: the fact stands, it is not an occasion. Precedent for the standing idiom in this voice: the accepted DEF-11 faces (`the ordinary state`, `the common case`) |
| 2-f1 | `Creatures are thick` = P · `the wall` = W · `the town puts people on the wall` = F | the same clause; `puts` is the habitual present of a standing arrangement, never a dated act (no event provenance exists in this block) |
| 2-f2 | `In plagued country` = P · `the wall … is up` = W · `on it stand the town's people` = F | the same clause; `is up` is the copula the register keeps (R-DA-07), and the inversion spends word order only (MOVE-GRAMMAR §3.4) |
| 2-f3 | `runs with creatures` = P · `the wall` = W · `The town has people on the wall` = F | the same clause |
| 3 (`[unfolding]`) | `stay thick` = P · `the wall` = W · `goes on keeping people` = F | the **STANDING** clause again: the `[unfolding]` angle is realised as durative present ONLY — no future indicative, no span, no season, no change asserted (A2; R-DA-07; MOVE-GRAMMAR §1.3 FORECAST does not exist) |
| 3-f1 | `still thick with creatures` = P · `the wall` = W · `People go on holding` = F | the same; `still` and `go on` are aspect, not time measured |
| 3-f2 | `is plagued` = P · `the wall` = W · `still held by people` = F | the same |
| 3-f3 | `stays plagued` = P · `the wall … keeps standing` = W · `Held by people` = F | the same |

**The shapes held at zero, each checked against its detector at source.** No digit, percent, em dash, exclamation, question, semicolon, colon or parenthesis. No `which` (R-DA-03). No `will`/`shall` (`FUTURE_INDICATIVE`). No past-tense event verb and no `HISTORY` member (`since the`, `after the`, `was built` …) — `entered` and `Held` are participles of a standing entry, with no temporal anchor. No `QUANTIFIERS` member (`entryLexicons.js:93` — `every · all · each · only · none · any · no · whole · entire …`), which is why nothing here is negated with `no`. No `DUTY_PREDICATES` and no `DUTY_STEM_NOUNS` (`:110, :126` — `muster`, `roll`, `count`, `register` are all absent, so the pool takes not even a C2 NOTE). No `EXEMPTION_LEMMAS` or `AMBIGUOUS_EXEMPTION_LEMMAS`. No `CONTRAST_SHAPES` match (`:304`). No `SPECIFICATIONAL_COPULA` match (`:332`: `are the town's` is not `are the only`/`are the one`, and no line has the form `the X … is the Y`). No `RECORD_CITATION` (`:335`). No pronoun closer and no abstraction closer (`CLOSE_KINDS`, `:312-322`). No `-ly` adverb, no `-ing` opener, no expletive `There is`/`It is` anywhere. No doubled-adjective shape `\w+(ed|ing|ous|ful|less|ive|al|ant|ent|y) and \w+` — every coordinate here is preceded by its own comma. No triad. Of `moveGrammar.js`'s `CLAUSE_DETECTORS` (`:200-238`) **none fires**: `the wall` stays singular so OBJECT does not open (`the walls` is its member), no INSTITUTION noun stands beside a verb, no GEOGRAPHY member, no TRADITION member (`is kept here/in` avoided), no CONSEQUENCE member, no ABSENCE, OPEN, CONTRADICTION, PERSON or PROVENANCE member. Every clause therefore classifies `PRESENT`, which is the V1 grammar.

**Openers, first two words, all twelve pairwise distinct** (A11): `The country` · `About {settlement}` · `People hold` · `The wall` | `At {settlement}` · `Creatures are` · `In plagued` · `The town` | `The creatures` · `People go` · `Where the` · `Held by`. The three numbered rows are distinct on A11's own rule.

**Closes, counted rather than characterised.** Variant 1: `wall · people · creatures · town's`. Variant 2: `course · wall · people · creatures`. Variant 3: `wall · creatures · people · plagued`. Four distinct last words inside every variant; none on a pronoun, none on an abstraction, none on the slot. Kinds vary: five land on the civic noun the field names (`CLOSE_KINDS.civicNoun`), the rest on the condition or on the people.

**The four rhythms inside each variant** (the owner's four-faces law: a different vocabulary or rhythm, never a paraphrase of a sibling). Variant 1: a plain compound; a fronted place phrase with a passive; the short line, eleven words, subject-first with a trailing frame; a main clause with a coordinate naming whose the people are. Variant 2: a fronted slot phrase with a standing tail; a compound opening on the creatures; a fronted frame closing on a full inversion (`on it stand the town's people`); a plain compound opening on the town. Variant 3: a durative compound; a durative subject-first line with a trailing frame; a fronted `Where` clause; a fronted participial with two durative verbs.

**THE THREAD (MOVE-GRAMMAR §1.4.1).** Each row hands a concrete noun forward for whatever mounts after it: the numbered rows close on `wall`, on the standing `course` (with `wall` and `people` in the clause before it), and on `wall`. The three nouns a modifier of this block can pick up — the wall, the people, the country — stand in every one of the twelve wordings, so no attaching modifier is left without a subject to carry, and no face depends on standing in any particular place.

---

## 3. WHAT THE REWRITE CURES, MEASURED

**(a) Three arm-Q debtors leave the pool.** Today's variant 1 carries a colon and a three-part tail, variant 2 a colon and a three-part tail, variant 3 a semicolon and a trailing coordinate (`; the posture is survivable, and survivable is the most that can be said of it here.`) that names no typed field. `armQualify` withholds every segment after the first that carries no `{slot}` and no band reading, so every composed unit built on those rows inherits the finding — and the taste sample's own measurement is that all 204 listed findings across seven pools were raised on shipped SPINE text, never on a writer's face. Twelve of twelve wordings here are one segment.

**(b) Eight unlicensed claims leave the product** (§6, one by one, each with the law it fails).

**(c) The pool's own template goes.** All three of today's variants land the same way — a statement and then a verdict about it (`answered it properly`; `nobody treats any of it as unusual`; `survivable is the most that can be said of it here`). That trailing evaluative beat is one of the four machine signatures Part B §16(6) names, in three of three variants; the SPREAD, not the single line, is what convicts it (§16(4)).

**(d) The pool stops opening on the town's name twice.** Today two of three variants front `{settlement}` or `Defense at {settlement}`; R-DA-17 allows the settlement token to open at most one variant per pool. Here it opens none, and the register's 0.209 opener share falls by three rows.

---

## 4. THE LEVEL-1 GRAMMAR COUNT, STATED RATHER THAN ASSUMED

MOVE-GRAMMAR §3.2 asks a pool of k variants for `min(k, |set|)` distinct level-1 grammars, the set filtered by the licensing fields the block holds. Filtered here: V2 needs a structural-consequence field (none), V3 a `none-exists` field (all three limbs are PRESENT), V5 an institution row (the card licenses none), V6 an unresolved state field (none), V7 event provenance (none — the block's own PROVENANCE fence at `:2579-2592` says the causal clauses here are capability clauses and never historical ones), V8 a `not-held` field (none). **V1 is the only member whose licensing fields are non-null**, so `min(3, 1) = 1` and the rule is satisfied at one. The variation this pool can lawfully carry is rhythm and vocabulary, which is what the four-faces law asks of it. V4 (`OBJECT → PRESENT`) is reachable only by writing the plural `the walls`, which is a block-wide name-form act and is flagged in §5 rather than taken.

---

## 5. CARRIED TO THE CHAIR (four rows; none is this writer's fence)

1. **The rung-3 licence card is unreadable at its most important line.** `claimTokensOf` takes the last dot-separated segment of the field path, and this pool's read is the census's synthetic label `beastsRowSituation(family, perimeter, force) (via BEASTS_ROW_POOL in defenseStateProse.js)` — so the card prints ``may claim: that `js)` … holds`` and the field's claim vocabulary is the two dead tokens `js)` / `js)s`. A face segment naming `perimeter`, `force` or `family` therefore claims nothing under arm Q's second licence. One `FIELD_SYNONYM_ROWS` entry citing the branch cures both. Four rows of this block share the shape.
2. **The block needs ONE name form for the perimeter and one for the force before its twenty-six pools land.** The block today spells one object `wall`, `line`, `perimeter`, `works` and one force `garrison`, `militia`, `watch`, `soldiers`, `professionals`. R-DA-22 is a register wall and no single pool's writer can hold it.
3. **A within-pool word-count spread figure measured on VARIANTS cannot gate a claim-equal FACE family.** R-DA-05's R1 figure is `sd 2.9 → ≥ 4.0`; this pool reads **2.31** and was not padded to reach it. The load a variant's length tracks is its claim, and arm A6 makes all twelve wordings here claim-equal, so the only way to move the figure is padding — the regression §21.4 names in terms. The figure needs a grain, exactly as §16.2 gave the three numbers one. Reported as information (§21.1).
4. **`moveGrammar.js`'s CONSEQUENCE detector is blind to the cost verbs this corpus actually uses.** Its members are `cost · costs · paid for · pays for · falls on · fell on · the bill · charged to · comes out of · is borne by · at the expense of · at a loss · the loss is`; today's variant 3 states a cost as `is being spent doing it` and walks past the arm. `spent · spends · eats · takes out of · comes off` are owed to the walker lane; the refusal in §6 (R7) is the licence's, not a detector's.

---

## 6. REFUSALS (a refusal is a result; every one stays in the annex history under §22)

Every claim today's three rows carry that the card does not license, with the law it fails. **No variant of this pool is refused as unwritable: all three are rewritten lawfully above, and the refusals below are claims dropped, which is the rewrite's purpose.**

- **R1 — `and the town has answered it properly` (variant 1), DROPPED.** VERDICT is one of the moves that do not exist anywhere in the estate (MOVE-GRAMMAR §1.3); the card's `may NOT` line names a standpoint outright; `properly` is an evaluative adverb on the town's own arrangement (R-DA-10, R-DA-12).
- **R2 — `and both are in use constantly` (variant 1), DROPPED.** `both` is a count over a closed pair (`may NOT: a count`); `in use` asserts an employment that a presence flag does not hold; `constantly` is a frequency claim and an adverb the register holds at a floor.
- **R3 — `is not an emergency arrangement, it is the week's work` (variant 2), DROPPED.** A CONTRAST is licensed only where the rejected alternative names a sibling pool key or a sibling band (R-DA-02; MOVE-GRAMMAR §1.4 wall 5), and none of the six sibling `Beasts & Monsters` keys is "an emergency arrangement". `the week's work` is a span, refused beside the season on the card's `may NOT` line.
- **R4 — `the rotations run, the gates close on time` (variant 2), DROPPED.** A gate is `another civic object of the class 'wall'`, refused on the card's own line; a rotation and a closing time are duties and schedules no institution row carries (the `whatItDoes` column is `closed: false`, CLERK-LAWS §1.2 NOTE). The three-part chain is also R-DA-10's triad by habit.
- **R5 — `and nobody treats any of it as unusual` (variant 2), DROPPED.** FEELING is a non-move (MOVE-GRAMMAR §1.3): no field carries mood, belief or how a thing is taken. `any` is a quantifier over an open column, which the card's REFUSED COLUMNS line shuts permanently; the sentence is also a totality over persons.
- **R6 — `What {settlement} has built` (variant 3), DROPPED.** An act of construction is HISTORY, licensed by an event-provenance field alone (MOVE-GRAMMAR §1.2 row 2; R-DST-B). This block holds none, and its own PROVENANCE fence says so in terms.
- **R7 — `and is being spent doing it` (variant 3), DROPPED.** CONSEQUENCE is double-licensed by event provenance × a household, trade or office row (MOVE-GRAMMAR §1.2 row 7; R-DA-19; H-3). Neither half exists here. See §5 row 4: no instrument catches this phrasing, so the refusal is the licence's.
- **R8 — `the posture is survivable, and survivable is the most that can be said of it here` (variant 3), DROPPED.** A summarising second beat closing on a maxim: R-DA-12's gnomic closer, R-DA-03's second-sentence summary (figure → 0.000), and a machine signature Part B §16(6) names. `the most that can be said` is a claim about the record's own limits with no `not-held` field behind it (R-DA-08's licence used without the licence).
- **R9 — THE SOURCE CITATION, REFUSED; the provenance count for this pool is 0, deliberately.** The card prints `source: muster · standing LICENSED`, so a citation is *permitted where the budget allows* — and the budget is a CEILING of one per unit restricted to S3's three reasons (Part B §24): two accounts that disagree, a count from an interested party, a record whose keeper is a power. None holds (there is no second account of this branch, the claim is not a count, and the muster is no power over whether a wall stands). §24 measures the exemplar registers with raw text at 0 citations per 786 sentences, and MOVE-GRAMMAR §4.4.3 makes a citation on a fact whose holder is the office itself a finding in its own right. **Chair-vetoable:** if the sitting wants the move exercised here, the lawful form is one face of twelve, never four.
- **R10 — `garrison`, `militia`, `watch`, `soldiers`, `the guard`, REFUSED AS TERMS FOR THE FORCE**, and **R11 — `line`, `perimeter`, `works`, and the plural `the walls`, REFUSED AS TERMS FOR THE WALL.** The grounds are in §1 and §5 row 2; `the walls` is additionally the one wording that would fire the OBJECT detector and buy the pool a second level-1 grammar, and that is a block-wide ruling, not one writer's.
- **R12 — THE PURPOSE CLAUSE, REFUSED.** `a wall against them`, `the wall faces the country`, `people enough for what comes out of it` all state what the wall is FOR. Purpose is a cause in a different coat, and the card's `may NOT: a cause` bars it.
- **R13 — EVALUATIVE CONDITION WORDS, REFUSED.** `bad country`, `hard country`, `dangerous ground`, `a serious wall` are evaluative adjectives on a place, held at zero in the record registers (R-DA-10). The field's own value word `plagued` and the corpus's own `thick with creatures` do the same work and are licensed.
- **R14 — THE LENGTH TARGET, REFUSED**, with the figure it fails named rather than hidden: §5 row 3.
