1. `[ledger]` The works about the town are up, and the country beyond them is plagued with beasts. On the works {settlement} keeps neither garrison nor militia.
   - `[face]` Neither garrison nor militia is kept, and the wall stands unheld. Beyond that wall the country about {settlement} is monster country.
   - `[face]` The circuit stands, and under arms the town holds nothing. The country lying about {settlement} runs with beasts.
   - `[face]` Beasts have the run of the country outside the town. The perimeter at {settlement} is up and unmanned.
2. `[visitor]` Beast country comes up to the wall about {settlement}, and the wall is unheld.
   - `[face]` Plagued country lies about {settlement}, and its perimeter stands without garrison or militia.
   - `[face]` Monsters are in the country up to the circuit of {settlement}, and the circuit is unmanned.
   - `[face]` Outside {settlement} the country is monster country, and nothing under arms stands on the town's works.
3. `[unfolding]` The wall about {settlement} goes on standing and goes on unheld in beast country.
   - `[face]` Monsters remain in the country about {settlement}, and the perimeter remains without garrison or militia.
   - `[face]` The country about {settlement} stays plagued, and the works stay up and empty.
   - `[face]` Beasts go on in the country about {settlement}, and the circuit goes on unmanned.

--- NOTES

**Pool.** DS-DEF-2 · `Beasts & Monsters: plagued, perimeter but NO force to hold it` · **draft round 2** · seat Opus 5 (Fable-unvalidated), writing for the Fable chair.
Card re-printed by `node scripts/prose-licence-card.mjs DS-DEF-2 'Beasts & Monsters: plagued, perimeter but NO force to hold it'` in `$SC/laneRW-DEF2`. The block's annex section re-read whole at `laneRW-DEF2/docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:2568-2740` for arms A1 and A11.
**3 variants · 12 faces (3 numbered rows + 9 `[face]` sub-rows) · claim-equal across all twelve (arm A6; MOVE-GRAMMAR §3.4: the claim is what the seed may never vary, the grammar is what it must).** No variant added, removed, merged or reordered; the three vids, their order and their angle tags are untouched.

---

## 0. THE GATE'S FEEDBACK, ANSWERED MEASURE BY MEASURE

**(a) THE REFUSAL — `1. \`[ledger]\` \`[plain]\` …`, a second bracketed tag on the numbered row. FIXED, and it was the round's whole blocking fault.**
`VARIANT_RE` at `scripts/generate-dossier-state-prose.mjs:224-226` is `/^(\d+)\.\s+\`\[([^\]]+)\]\`\s+(?:\`\[([^\]]+)\]\`\s+)?(.*)$/` — the optional second group exists so a causal variant can carry its AUDIENCE separately (`[counterforce · seat]` `[dm-only]`), and **both groups fold into the variant's `marks`**. `[plain]` written there is therefore published as a mark, and `tests/data/dossierStateProseProjection.contract.test.js` reds with `unclassified: [ 'plain' ]`. ARCH §2.5 gives the numbered row ONE angle tag plus at most `` `[grammar: Vn]` ``.
**How round 2 writes it, and the reading behind it.** The numbered row carries its existing angle tag and its text IS the variant's plain wording — exactly the shape of ARCH §2.5's own worked example, where `` `[plain]` `` occupies the single angle slot because that example's variant has no other angle. This pool's variants have angles (`[ledger]` · `[visitor]` · `[unfolding]`), which the brief forbids me to touch, so the angle slot is spoken for and the plain wording rides the numbered row bare. **Four wording faces per semantic variant are still delivered** (the numbered row plus three `[face]` sub-rows); the count is unchanged, only the tag is gone. **Vetoable**: if the chair wants `[plain]` marked explicitly, the projector needs a third capture group or a `plain:` line, which is a car in the projector lane and not a wording change.

**(b) `shapes.whichTailRate` (over) = 12.514 band-widths on 1 of 3 faces — MOVED TO ZERO ON ALL TWELVE.**
The measured 1 of 3 is the pool's **shipped** variant 1, which the packet's refusal left standing: *"…a chokepoint requires people standing in it**, which** this town cannot supply for more than a night."* The detector is `rate(count(/, which\b/))` over sentences (`src/domain/prose/proseFingerprint.js:142`), and the shipped variant is two sentences with one hit, so it reads 0.5 against the band `{lo: 0.00, hi: 0.04}` (`tests/fixtures/grammarControls.js:202`). **No face in this packet contains the string `, which`, and no face contains the word `which` at all.** Grep-checkable. The band position moves 0.5 → 0.00 on variant 1 and holds 0.00 on variants 2 and 3, and it lands only once the grammar in (a) lets the packet apply — which is why (a) and (b) are one move, not two.

**(c) DEPTH ≤ 1.75 band-widths on every face (§16.2, the ENTRY grain).** Every metric with a hard ceiling is held at exact zero rather than inside a band, so no face carries an OVER exceedance on any of them: `whichTailRate` · `emDashRate` · `questionRate` · `exclamationRate` · `parenthesisRate` · `semicolonRate` · `colonRate` · `antithesisRate` · `triadRate` · `participialOpenerRate` · `doubledAdjectiveRate` · `thereIsOpenerRate` · `dialogueShare` · `adverbsPerSentence` · `closers.pronounRate` · `closers.abstractNounRate` · `wordsPerSentence.shareUnder8` · `wordsPerSentence.shareOver30`. Each is verified in §3 against its own regex.
**Declared, not chased:** `wordsPerSentence.neighbourVariation` and the three metrics whose band has a non-zero **lo** (`semicolonRate` 0.01, `colonRate` 0.01, `triadRate` 0.02, `adverbsPerSentence` 0.10, `abstractNounRate` 0.01, `sameOpenerAsPreviousRate` 0.03, `shareUnder8` 0.02, `shareOver30` 0.02, `neighbourVariation` 0.40, `runsOfThree` 0.15) are **structurally degenerate on a one-or-two-sentence unit**: `burst` is 0 by construction on every single-sentence face (`lens.slice(1)` is empty, `:107-108`), and a rate whose denominator is 1 or 2 can only be 0, 0.5 or 1. I do not manufacture a semicolon, a triad or an adverb to lift a face off a floor — a semicolon in particular manufactures an arm-Q finding (`entryWalker.js:914-917` splits on `;` and considers every part after the first), and §21.4 names plainness bought without a law behind it as the regression. Position on these is **reported as information** (§21.1), and the pool's spread is carried across the twelve faces (18 to 25 words on the two-sentence faces, 13 to 16 on the one-sentence faces) rather than forced inside each one.

**(d) Not a dry round.** The owned failing measure (b) moves from 0.5 to 0.00, and it moves only because (a) makes the rows applicable. Round 1's wordings are not merely re-tagged: every one of the twelve is rewritten for the ceiling (§21.1) — see §4.

---

## 1. WORD COUNT PER FACE

Whitespace tokens; `{settlement}` counts as one; the two-sentence faces show `(s1 + s2)`.

| variant | numbered row (`[plain]`) | `[face]` 1 | `[face]` 2 | `[face]` 3 |
|---|---|---|---|---|
| 1 · `[ledger]` (two sentences) | **25** (16 + 9) | **21** (11 + 10) | **18** (10 + 8) | **18** (10 + 8) |
| 2 · `[visitor]` (one sentence) | **14** | **13** | **16** | **16** |
| 3 · `[unfolding]` (one sentence) | **14** | **15** | **13** | **14** |

Mean 16.4 · min 13 · max 25. Shortest sentence 8 words, longest 16 — every sentence inside the `m` band (8 to 22), so `shareUnder8` and `shareOver30` read 0.0000 on all twelve.
**The sentence-count spread is held as shipped** (A11 / MOVE-GRAMMAR §3.4: where variants differed in sentence count they keep differing): variant 1 is two sentences in all four faces, variants 2 and 3 one.

---

## 2. THE CLAIM, AND THE CARD CLAUSE LICENSING EACH LIMB OF EACH FACE

The card gives ONE read — `beastsRowSituation(family, perimeter, force)` via `BEASTS_ROW_POOL` in `defenseStateProse.js` — and ONE licensed value, `plagued country, perimeter without force`. Grounded at `src/domain/display/stateProse/defenseStateProse.js:336-386` with its call site `:591`, that value is three limbs of one typed state:

- **L1** the family is `plagued`;
- **L2** `perimeter` is true — by `defenseProfileHasWalls` (`src/domain/causalState.js:300-315`), never a presence check on `institutions.walls`;
- **L3** `force` is false — and `force` at the call site is `garrison || militia`, so the licensed absence is of BOTH and of nothing else.

Every face carries all three and nothing more. The licensing clause is the same twelve times and is quoted once: **`may claim: that js) (=== plagued country, perimeter without force) holds, as a STANDING fact of the record`**, realised as MOVE-GRAMMAR §1.2 row 1 (PRESENT — a standing configuration field licenses a structural clause and never a historical one). The slot is licensed by **`bag: {band: RESERVED, route: proper, settlement: proper} · FILLED at this block's call sites: {settlement}`**. `role: spine` and `relation: (a spine takes no relation)` are why no face reaches for a joint to a neighbouring fact.

| face | L1 · plagued country | L2 · the perimeter | L3 · neither garrison nor militia |
|---|---|---|---|
| 1 · row | `the country beyond them is plagued with beasts` | `The works about the town are up` | `{settlement} keeps neither garrison nor militia` |
| 1 · f1 | `the country about {settlement} is monster country` | `the wall stands` | `Neither garrison nor militia is kept` · `unheld` |
| 1 · f2 | `The country lying about {settlement} runs with beasts` | `The circuit stands` | `under arms the town holds nothing` |
| 1 · f3 | `Beasts have the run of the country outside the town` | `The perimeter at {settlement} is up` | `unmanned` |
| 2 · row | `Beast country comes up to` | `the wall about {settlement}` | `the wall is unheld` |
| 2 · f1 | `Plagued country lies about {settlement}` | `its perimeter stands` | `without garrison or militia` |
| 2 · f2 | `Monsters are in the country up to` | `the circuit of {settlement}` | `the circuit is unmanned` |
| 2 · f3 | `the country is monster country` | `the town's works` | `nothing under arms stands on` |
| 3 · row | `in beast country` | `The wall about {settlement} goes on standing` | `goes on unheld` |
| 3 · f1 | `Monsters remain in the country about {settlement}` | `the perimeter remains` | `without garrison or militia` |
| 3 · f2 | `The country about {settlement} stays plagued` | `the works stay up` | `and empty` |
| 3 · f3 | `Beasts go on in the country about {settlement}` | `the circuit` | `goes on unmanned` |

**The angles, realised without a second claim.** `[ledger]` is the flat two-part entry — the arrangement, then what stands in it. `[visitor]` is realised as **word order only**, the outside-in order an approach meets the three limbs in (country → perimeter → absence), which MOVE-GRAMMAR §3.4 lists among the three things a grammar MAY spend; no face asserts a person, an act of perception or a reaction (refusal R3). `[unfolding]` is realised as **durative aspect on a standing fact** (`goes on standing` · `remain` · `stays` · `go on`), never as a trend: HISTORY takes an event-provenance field only (MOVE-GRAMMAR §1.2 row 2) and this block holds none.

**THE THREAD (MOVE-GRAMMAR §1.4.1) on the four two-sentence faces.** Row: `works` → `works`. f1: `wall` → `that wall`, and the second sentence is the passage's one turn outward, placed last. f2: `the town` → `{settlement}`, the turn outward last. f3: `the town` → `The perimeter at {settlement}`, the town carried forward into its own works. Nothing changes subject mid-passage and hands nothing back. **The one-sentence faces of variants 2 and 3 are single passages and take the rule vacuously**, but each is written to read after a spine and after a sibling modifier: every one opens on the country or on the perimeter as a bare civic subject and none opens on a connective, a pronoun or a `proper`-typed slot (ARCH §2.5 T-F8).

**Sibling distance (A11).** The twelve first-two-word keys are pairwise distinct: `The works` · `Neither garrison` · `The circuit` · `Beasts have` · `Beast country` · `Plagued country` · `Monsters are` · `Outside {settlement}` · `The wall` · `Monsters remain` · `The country` · `Beasts go`. Within variant 1 the four second sentences are also distinct from each other and from all twelve openers: `On the` · `Beyond that` · `The country` · `The perimeter`. **One term for one thing inside every face** (R-DA-22): each face names the perimeter under exactly ONE noun — `works` · `wall` · `circuit` · `perimeter` — and never a second civic object of the class, which is the card's `may NOT` by name and the shipped variant 1's breach (`the line` beside `a wall`).

**Arms A1 and A11 against the block's other spines.** `plagued, perimeter AND organized force` owns `thick with creatures`; `plagued, NO perimeter and NO force` owns `embattled country` and `nothing organized`; the `frontier` sets own `active frontier`, `armed people` and `the muster roll`; the `settled` sets own `very little in the country`. None of those appears here. DS-DEF-11's `country: pressed` pools read the same producer field on the same page and own `beset · harried · pressed` and the record-grade family (`grade · entered · marked · the books`); this packet uses none of them, so a reader meeting both blocks meets two vocabularies rather than one template (Part B §16(4): the same rule broken the same way everywhere is the template).

---

## 3. THE SHAPES HELD AT ZERO, EACH AGAINST ITS OWN DETECTOR

Checked by hand against `src/domain/prose/proseFingerprint.js:115-149` and the published lexicons in `src/domain/prose/entryLexicons.js`.

- **`, which` → 0 on all twelve**, and the word `which` appears nowhere. MOVE-GRAMMAR §1.4 wall 6; R-DA-03. **This is the round's owned measure.**
- **No digit, percent, em dash, exclamation, question mark, parenthesis, quotation mark, semicolon or colon.** The semicolon and colon are refused for cause (arm Q splits on `;`).
- **No `-ly` adverb** anywhere, so `adverbsPerSentence` reads 0.000; the register's lift is in the noun, not the modifier (R-DA-18).
- **No participial opener**: the twelve first words are `The · Neither · The · Beasts · Beast · Plagued · Monsters · Outside · The · Monsters · The · Beasts`, none matching `/ing$/`.
- **No `There is` / `It is` opener** (R-DA-07's expletive).
- **No doubled adjective**: the only `X and Y` adjective pairs are `up and unmanned` and `up and empty`, and `up` does not match `\w+(ed|ing|ous|ful|less|ive|al|ant|ent|y)`.
- **No comma triad**: no face carries more than one comma, so `,[^,.]+,[^,.]+,? and` cannot match.
- **No antithesis shape**: no `rather than`, no `not X but Y`, no `, not x`, no `less … than`.
- **No pronoun closer and no abstract-noun closer.** The sixteen sentence-final words are `beasts · militia · unheld · country · nothing · beasts · town · unmanned · unheld · militia · unmanned · works · country · militia · empty · unmanned` — no member of `/^(it|them|him|her|us|me|you|this|that|there|here)$/` and no member of `/(ness|tion|sion|ity|ment|ance|ence|ship|hood|dom)$/`. **The close KINDS vary** (R-DA-04, `CLOSE_KINDS` at `entryLexicons.js:312-321`): civic nouns (`militia`, `works`), objects (`beasts`, `country`, `town`), conditions (`unheld`, `unmanned`, `empty`, `nothing`) — no single kind owns the pool.
- **No quantifier** from `QUANTIFIERS` (`every · all · each · only · none · everyone · everybody · everything · any · no · whole · entire · without exception · to a man · universally`). Every negation is carried by `neither … nor`, `without`, `nothing` or an `un-` prefix. Bare `no` killed a face this round (`no garrison on it`), as did `the whole circuit`.
- **No band word and no authored magnitude.** `nobody` and `no one` are `quantityWords(0)` / `AUTHORED_MAGNITUDES` and would put a band on a boolean read; both refused, though `nobody to man it` is the shipped variant 1's own phrasing. No `COUNT_NOUNS` member appears, so `armC1` has nothing to pair.
- **No duty predicate and no duty stem** (`musters · counts · registers · levies · tolled …`). `muster` is the natural word for the absent force here and is refused for exactly that reason: a C2 NOTE as a stem, a FAIL as a predicate.
- **No office noun** from `OFFICE_NOUN_CANDIDATES` — no `warden`, `captain`, `sheriff`, `constable`, `sergeant` (CLERK-LAWS §1.2 NOTE 2: those three are held by no instantiated role list). `garrison` and `militia` are the call site's own two institution reads, not offices, and appear only inside the absence.
- **No member of `PROVENANCE_LEXICONS`** — no capacity (`can hold`, `has room for`), no spatial idiom (`ringed by`, `built along`, `set back from`), no actor (`ordered`, `founded`, `rebuilt`), no dated form. `about`, `outside`, `beyond` and `up to` claim no geometry the field lacks, because a perimeter's inside and outside are the object's own nature.
- **No member of `SUPPLY_CLAIM_LEXICONS`**, `pressed` above all — DS-DEF-11's pool-key word.
- **No specificational or inverted copula** (`SPECIFICATIONAL_COPULA`, arm X): no `is what`, `is who`, `is the only`, `is the one`. Exhaustivity is never entailed, so no `closed` column is needed.
- **No bare relative** (`BARE_RELATIVE`: `name/title/call + what/who/whom/which`), **no `will` or `shall`** (`FUTURE_INDICATIVE`; A2, THE PROMISE), **no `was · were · had · used to · once · formerly · no longer`** (`armC3`'s semantic half, `entryWalker.js:547`).
- **No record citation** (`RECORD_CITATION`) and no record as grammatical subject — see refusal R1.
- **Arm Q**: in all four two-sentence faces the second sentence carries `{settlement}`, so `consider` returns at `entryWalker.js:892` on the slot test before it reaches the withhold. **Predicted arm Q findings on this packet: zero.** All three shipped variants take one today.

---

## 4. WHAT ROUND 2 CHANGED IN THE WORDING, AND WHY (the ceiling, §21.1 / §21.3)

The claim set is byte-identical to round 1's; the wordings are not. Every change is toward a sharper licensed fact, a wider sibling distance or a stronger rhythm, and none is toward plainness (§21.4).

- **Variant 1's row now opens on the works and closes its second sentence on the absence**, so the ledger's two beats are the arrangement then what stands in it, in that order, with the slot in the second sentence where arm Q needs it. Round 1's `A wall closes the town` asserted a closure the boolean predicate does not carry; `are up` asserts standing and nothing else.
- **`unheld` / `unmanned` / `holds nothing` / `stay up and empty` are now distributed one per face** instead of `unheld` recurring across three; the four faces of each variant no longer share an absence word.
- **The four perimeter nouns are now assigned one per face across all three variants** (`works` · `wall` · `circuit` · `perimeter`), so no face repeats a sibling's civic noun and R-DA-22 holds inside each.
- **Round 1's `Monster-ridden country lies about the town` is gone.** A hyphenated compound adjective on a place is the exogenous tell R-DA-18's floor watches; `Monsters are in the country` and `Beasts have the run of the country` are plainer in vocabulary and denser in fact.
- **`Beasts have the run of` and `runs with beasts` are kept deliberately** under §21.4: both are literally true of a plagued country (the beasts run; the country is where), neither is a figure under R-DA-11 — no sense verb on an abstraction, no inanimate intent — and both are the compression that rewards the reader. A refuter's `unclear` is not a finding here unless a law is named.
- **Every sentence is now 8 to 16 words**, against round 1's 8-to-14 with two 20-plus totals; the pool's spread lives across the faces (13 to 25 words) rather than inside them, because `neighbourVariation` cannot be moved on a one-sentence face at all.

---

## 5. WHAT THE SHIPPED ROWS CARRIED THAT THIS DRAFT DOES NOT — EACH DROP WITH ITS LAW

**The ruling I am writing under, restated so it can be vetoed.** The brief binds me to keep every claim a variant carried and add none, and separately to license every claim by the card and by nothing else. Where shipped text carries a claim the card refuses, the two collide. I resolve it by R-DA-15's own words — *an unlicensed office/count/exemption is not a claim the pool was entitled to hold (ruling 5 requires its removal — the B-CLAIM bar is not engaged)* — read with §22's confirmed edge (*today's exact wording leaves the product when it fails the voice; its slot survives; its text stays in the annex history*) and R-DA-20 (*a sentence asserting what the fields do not hold is rewritten in place*). **No slot removed, no variant merged, no tag touched, the order unchanged; only unlicensed claims dropped, and every one named here.**

**Variant 1, shipped:** *"{settlement} has a wall and nobody to man it. The line is a chokepoint on paper and a chokepoint requires people standing in it, which this town cannot supply for more than a night."*
- `, which this town cannot supply` — **dropped.** MOVE-GRAMMAR §1.4 wall 6 and R-DA-03: a QUALIFY is never a `which` tail. **This is the gate's measured breach.**
- `a chokepoint requires people standing in it` — **dropped.** A life-general proposition licensed by no field: MOVE-GRAMMAR §1.3's non-move MEANING, R-DA-12's generalisation test, and the gnomic closer Part B §16(6) names as a machine signature.
- `cannot supply for more than a night` — **dropped.** A capacity claim on a state-only field (`PROVENANCE_LEXICONS.capacity`; R-DST-B) and a duration the card refuses under `may NOT: a count`.
- `the line … on paper` — **dropped.** A verdict on the record against the world (MOVE-GRAMMAR §1.3, VERDICT), and `the line` beside `a wall` is the second civic object of the class `wall` the card refuses by name.
- `nobody to man it` — **reworded, not dropped.** The claim survives in all four faces; the band word does not, because `quantityWords(0)` on a boolean read is a magnitude the field does not hold.

**Variant 2, shipped:** *"A stranger walks the perimeter at {settlement} and finds long stretches of good work with nobody on them, in a country where that matters a great deal."*
- `A stranger walks … and finds` — **dropped.** A PERSON with a recorded act, licensed only by a ROLE field (MOVE-GRAMMAR §1.2 row 3); this pool holds none. The register card is flat about it — no persona, no assigned reaction — and the card's own `may NOT: … a standpoint` says the same. The `[visitor]` tag survives untouched and the angle survives as word order (§3.4). See R3.
- `long stretches of good work` — **dropped on both halves.** `long stretches` asserts an extent `defenseProfileHasWalls` does not hold, it being a boolean predicate; `good work` is an evaluative adjective on a civic object (R-DA-10).
- `in a country where that matters a great deal` — **dropped.** A verdict closer, and a second fact about the fact (MOVE-GRAMMAR §1.3; R-DA-12). The country limb is kept in every face as the licensed L1.

**Variant 3, shipped:** *"The works at {settlement} are doing less each season as the watch thins, and the thinning is not being reversed."*
- `each season` — **dropped.** The card refuses a season by name; `each` is also a `QUANTIFIERS` member.
- `are doing less … as the watch thins` — **dropped.** A trend and a cause in one clause. HISTORY takes an event-provenance field only (MOVE-GRAMMAR §1.2 row 2), and R-DST-B is the licensing law: a standing configuration field licenses a structural clause and never a historical one.
- `the watch` — **dropped.** The read is `garrison || militia`; the watch is an institution this pool does not read, and DS-DEF-11 owns a `watch:` pool of its own (arm A1).
- `the thinning is not being reversed` — **dropped.** A claim about what is not happening over time, on a field with no time in it. STATE never FATE (A2; THE PROMISE).
- **What is kept is the aspect.** `[unfolding]` on a standing configuration field is lawfully a condition that goes on standing, and that is what all four faces do.

---

## 6. REFUSALS (a refusal is a result)

- **R0 — THE `[plain]` TAG ON THE NUMBERED ROW, REFUSED, and the refusal is the gate's own.** §0(a). Four faces per variant are delivered without it.
- **R1 — THE SOURCE CITATION, REFUSED; the provenance count for this pool is 0, deliberately.** The card prints `source: muster · standing LICENSED — a citation of this holder is licensed where the provenance budget allows`. It is not allowed here, on three independent grounds. (i) Register card S3 licenses a citation only where a clerk would cite — two accounts that disagree, a count from an interested party, a record whose keeper is a power — and none holds. (ii) Part B §24 sets the budget at a ceiling of one citation per unit and records the exemplar registers citing at **0 per 786 sentences**, so a citation habit is a refuter's finding. (iii) **The holder the card names is the thing the fact says does not exist**: `force` is `garrison || militia` and it is false, so citing the muster roll for the absence of a muster is the shape MOVE-GRAMMAR §4.4.3 calls a finding — the office does not cite its own books. **Chair-vetoable:** if the sitting wants the move exercised on this pool, the lawful form is a trailing `and the muster roll carries neither` on ONE face of twelve, never four; the DM page is where S3 puts the keeper and its interest.
- **R2 — `{band}` AND `{route}`, REFUSED.** Both sit in the bag and the card records them as NOT FILLED at this block's call sites; a face naming either is unreachable at every draw (arm D). `{settlement}` alone is used, once per face, so arm A6's slot-set identity holds across all twelve.
- **R3 — THE `[visitor]` PERSONA, REFUSED; AND THE ONE LAW THIS POOL CANNOT SETTLE BY ITSELF, DECLARED.** The card's `may NOT` list refuses a standpoint outright while the card's `angle` line records `visitor` as one of the pool's three authored angles. **I cannot satisfy both readings at once.** I went the way that keeps the wall: no face asserts a person, an act of perception or a reaction, and `[visitor]` is carried by word order alone. **If the chair reads `angle: visitor` as licensing an asserted observer, variant 2 is the row to send back** — under that reading the shipped `A stranger walks … and finds` is lawful and my rewrite drops a licensed claim; under mine, the shipped row is the defect. This is a card-internal contradiction, not a wording problem, and it recurs on every `[visitor]` row in the estate. **Recommended sitting ruling:** the `angle` line records the authored angle and never licenses a claim; a standpoint is realised as order and selection, never as an asserted observer. Not mine to rule, and no redraft resolves it.
- **R4 — A SECOND WALL-CLASS OBJECT, REFUSED.** `gate`, `line`, `rampart`, `ditch`, `stone`, `palisade`. Each face names the perimeter once, under one of `works` · `wall` · `circuit` · `perimeter`.
- **R5 — THE PURPOSE CLAUSE, REFUSED.** `walled against them`, `built to hold them`, `the wall is the town's answer` assert a purpose the field does not hold, and `built` asserts a history besides. The perimeter is stated as standing, never as meant.
- **R6 — THE PRACTICAL AND COST READINGS, REFUSED.** `the town cannot hold it`, `a beast that comes over goes unanswered`, `the wall buys the town nothing` are CONSEQUENCE, double-licensed by event provenance AND a household or office row (MOVE-GRAMMAR §1.2 row 7; R-DA-19). Neither exists on this block.
- **R7 — THE RECORD FRAME, REFUSED FOR THIS POOL.** No face names books, rolls, an entry or a grade. Lawful in principle (the `of the record` half of `may claim`), but DS-DEF-11's pools on the same page and the same producer field already carry it, and a shared frame across two pools of one field is the template a refuter names on sight.
- **R8 — THE BAND AND COUNT WORDS, REFUSED.** `nobody`, `no one`, `a handful`, `few`, `men`, `hands`, `people`. The force read is boolean; a band word on it is a count the card refuses.
- **R9 — `muster`, `watch`, `warden`, `captain`, REFUSED.** §3's duty-stem and office-noun rows.
- **R10 — THE SIBLING POOLS' VOCABULARY, REFUSED BY CRAFT.** `thick with creatures`, `embattled`, `nothing organized`, `beset`, `harried`, `pressed`, `grade`, `entered`, `the books`. §2's last paragraph carries the roster and where each is owned.
- **R11 — THE LENGTH TARGET AND THE BAND MIDDLE, REFUSED.** No face is padded toward a band's interior. §0(c) and §21.1: the band is a licence, not a target, and position is reported as information.

**No variant is banked as unlawful.** All three are written in full and all twelve faces are lawful under the card as I read it. The single unresolved law is R3, and it is a sitting ruling rather than a rewrite.
