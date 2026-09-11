Seat: Opus 5 — Fable-unvalidated

# REFUTE — the NPC cause-conjunction ladder (R6)

**NOTHING IN THIS FILE IS VALIDATED UNTIL THE CHAIR'S SITTING.** Written by an Opus 5 refuter under
the seat directive of 2026-09-07 ~11:15 (Fable manages, architects and judges; Opus implements and
verifies). Retrovalidation is owed through `docs/FABLE_RETROVALIDATION_QUEUE.md` at the next ledger
act. No corpus byte moved; no walker built; no rule applied; no rule adopted or withdrawn by me.

Written 2026-09-07 (`date` in the same shell). Session HEAD at the time of writing is **c5722e98a**;
every corpus figure below was re-derived from `git show 29a4ff20d:` exports of the fourteen R6 files,
which is the sha the reconciliation binds itself to. My re-derivation script and the exported pool
table are at `scratchpad/r6/` in this session's scratchpad (`count.mjs`, `chk.mjs`, `pools.json`).

## 0. What I re-executed, and what it confirmed

I did **not** take the reconciliation's word for one number. Independent re-derivation at 29a4ff20d:

| the file's claim | my measurement | verdict |
|---|---|---|
| 1,662 lines (role 1,512 · class 126 · full 24) | 1,512 / 126 / 24 = 1,662 | **CONFIRMED** |
| 1,104 pools, 546 singletons, 558 pairs, none larger | histogram `{1: 546, 2: 558}`, 1,104 pools | **CONFIRMED** |
| the whole §0a per-stage table (n, mean, min–max, semicolon, colon, signature) | every one of the 36 cells reproduced exactly | **CONFIRMED** |
| gender: 234 male-pronoun lines, 0 female, all role rung | 234 / 0, all role rung | **CONFIRMED** |
| sustainer: 100 of 182 name the syndicate, 156 assert it fallen | 100 / 156 | **CONFIRMED** |
| exactly three price multiples | exactly three (`three times over`, `three times the risk`, `four times the posted price`) | **CONFIRMED** |
| formula counts (came clean 165 · It is public 143 · is out 127 · syndicate 147 · still 280 · now 295 · nobody 75 · quietly 21 · already 22 · whoever 27) | all ten reproduced exactly | **CONFIRMED** |
| `will` 16 · `would/could/might` 35 · imperatives 4 · `you/your` 0 · digits 0 · em dashes 0 | all six reproduced exactly | **CONFIRMED** |
| 3+-sentence share 0.001; full rung 31–41 with none under 31; register min 15, max 41 | 2 of 1,662 (0.0012); 31–41; 15 / 41 | **CONFIRMED** |
| re-adjudicated comma-and in 182 of 182 | 182 of 182 | **CONFIRMED** |
| the full rung is 12 of 2,016 addressable keys; `{full: 12, role: 2004, class: 0, floor: 0}` | 12 pools measured; the assertion is in `tests/domain/causeConjunctionContent.test.js` verbatim | **CONFIRMED** |
| C3's seam: the phrase renders on `npc.corrupt` alone, `npcInteriority` fail-closed beside it | `npcInteriority({ npc })` is called with no `includeGroundTruth` (defaults hidden); the phrase has no gate | **CONFIRMED** |
| the fingerprint row (sd 4.0, p10 19, p90 28, under-8 0.0047, neighbour 0.167, semicolon 0.531, there/it 0.110, same-opener 0.344, abstract closer 0.078, pronoun closer 0.059) | every value matches `npc-ladder.fingerprint.json` | **CONFIRMED** |
| the exemplar bands (same-opener 0.033–0.167 · there/it 0.0016–0.056 · sd 8.5–16.0 · under-8 floor 0.029 · neighbour 0.495–0.805 · semicolon ceiling 0.122 · pronoun closer 0.021–0.108 · estate-state 0.052 / 0.044 / 0.399) | every band reproduced from the fifteen fingerprint JSONs | **CONFIRMED** |
| PROBE's R6 column (colon 0.138, tics union 744 of 1,659, pools uniform 0.955, tells 0.006) | matches `PROBE_ALL.md` lines 299–356, 17, 870 | **CONFIRMED** |
| every cited kept- row I sampled (≈120 rows across all nine files) | present, and every one graded VERIFIED_VERBATIM or VERIFIED_SUBSTANCE; **no PARTIAL, no absent row** | **CONFIRMED** |

This is an unusually clean measurement record and the refutations below should be read against it:
the file's arithmetic is sound, its sources exist, and its per-stage table is exact. What fails is
concentrated in **the proposed SIZES and two of the twelve tests**, not in the diagnosis.

---

## 1. THE FINDINGS

### R6-OP-01 — NL-8(a): the 0.10 n-gram ceiling is unsatisfiable in English. **HIGH. REFUTED.**

NL-8's statement is *no phrase may recur across more than a tenth of any stage's lines*, and its
size is **no 2–4-gram above 0.10 of any stage's lines**. Neither is scoped to content words or to a
lift threshold. Measured per stage at 29a4ff20d, the number of distinct **2-grams** already above
0.10 of a stage's lines, and the worst offenders:

| stage | 2-grams over 0.10 | the top ones |
|---|---:|---|
| attributed | 2 | `and the` 0.69 · `with the` 0.13 |
| re-caused | 22 | `and the` 0.59 · `but the` 0.52 · `now and` 0.41 |
| reformed | 7 | `and the` 0.76 · `came clean` 0.45 · `with the` 0.34 |
| historicized | 7 | `but the` 0.97 · `and the` 0.25 |
| exposed-public | 9 | `and the` 0.71 · `it is` 0.51 · `that the` 0.43 |
| re-adjudicated | 24 | `but the` **1.00** · `and the` 0.80 · `the syndicate` 0.54 |

`and the` is over the ceiling in all six stages and `but the` in three. **No reconstruction of any
quality can meet the size as written**, because the ceiling as stated forbids the coordinating
conjunction. A ceiling nothing can satisfy is not a guard: the walker fires on everything and is
therefore ignored, or it is silently narrowed at build time to something the rule never names — and a
silently narrowed threshold is exactly the class of instrument the estate has been burned by.

The rule's own test names the tic miner (`probe-all/metrics.mjs` I4), which carries a **lift** column
the size does not mention; and PROBE's R-7 warns that the miner's rows are row-set subsets of one
another and must never be summed. So the instrument the test names and the size the rule states are
not the same instrument.

**CURE.** State the filter in the size. Two candidates, both executable: (a) apply the ceiling only
to grams whose corpus lift exceeds a stated threshold (the miner's own column — `came clean` and
`it is public` clear it, `and the` does not); or (b) apply it only to n-grams containing at least one
content word, with a closed function-word stoplist published with the rule. Then re-derive the
per-stage ceiling against that filter, because 0.10 was chosen against an unfiltered denominator and
will not mean the same thing against a filtered one.

---

### R6-OP-02 — NL-12: both limbs of the STAGE-PAIR test pass today. **HIGH. REFUTED.**

NL-12 convicts the historicized stage of restating the attributed cost rather than adding a fact, and
proposes: *lexical overlap between a pool's historicized line and its attributed line ≤ **0.40** of
content words*, plus *a check that the historicized line carries at least one noun the attributed
line does not*. I built the stage-pair walker over all 168 role × cause cells:

- content-word overlap: **mean 0.270, median 0.273, p90 0.400, max 0.600**; only **15 of 168** cells
  are over 0.40. The proposed ceiling licenses **91% of the very corpus the rule convicts**.
- the new-noun assertion: **168 of 168** historicized lines already carry at least one content noun
  their attributed sibling does not. The assertion **cannot fail on the corpus as it stands**, and
  will not fail on any rewrite, because a stage that names a resolution necessarily introduces a
  token the attributed line lacks.

(My stoplist and lemmatisation are mine, not the walker's; but a definitional difference cannot move
a 0.27 mean to the far side of 0.40, and cannot move 168/168 off the ceiling.)

The rule has measured the wrong quantity. The fault it names is visible in its own Figure and is a
**frame** fault, not a vocabulary-overlap fault: `but the` occurs in **0.97** of historicized lines
and the stage's semicolon rate is 0.978. Lexical overlap is low precisely *because* the stamp is
structural — the same shape carrying different nouns.

**CURE.** Replace both limbs. (a) Make the primary assertion a **frame** share: the
`… is mended, but the … still …` template, measured today at ≈0.97 of historicized lines by the
`but the` proxy, driven under a stated ceiling — this fails hard today and is the fault the rule
actually saw. (b) Keep a new-fact limb but raise it above triviality: require the historicized line
to carry a **civic-thing noun naming a consequence** that the attributed line does not, adjudicated
by a skeptic against the pool key, not any novel token. (c) Re-derive the overlap number after the
frame is broken, or drop it; 0.40 is above the status quo and cannot be the direction of travel.

---

### R6-OP-03 — NL-7: the `dnd-flavor` licence is a misread of the wrong column. **MEDIUM. REFUTED (the size).**

NL-7 proposes *abstract-noun closer 0.078 → ≤ 0.05*, licensed by "the estate's own dossier rate"
(0.044) **and `dnd-flavor` at 0.021**. From `primary/dnd-flavor.fingerprint.json`:

- `closers.abstractNounRate` = **0.077**
- `closers.pronounRate` = **0.0213**

0.021 is `dnd-flavor`'s **pronoun** closer rate. Its abstract-noun closer rate is **0.077** — within
a thousandth of the ladder's own 0.0776. The read-aloud exemplar this register is allocated D&D for
sits **exactly where the ladder sits** on the metric NL-7 proposes to halve. Confirmed against
PROBE_ALL line 330 and the full fifteen-fingerprint sweep: the exemplar range for this metric is
0.012 (martin-narrative) to 0.115 (dnd-rules-srd52), and the ladder is mid-band, not out of band.

What survives: the "arrangement" closer at 63 (a single noun taking 3.8% of all closes), the verdict
closes named by example, and K 30's *vary the KIND* proposition — none of which need this figure.
What falls: the ≤0.05 size, whose only remaining licence is one internal estate number.

**CURE.** Withdraw 0.021 and restate: the abstract-closer rate is **in band** against every exemplar
including the read-aloud one, so NL-7's size should be set on the two things that are out of band —
the single-noun concentration (`arrangement` 63 → a stated ceiling) and the **kind** distribution the
CLOSER-KIND walker will produce — and the rate limb should be dropped or deferred until that walker
has a baseline. Correct the same figure wherever else it is carried.

---

### R6-OP-04 — NL-1 and NL-8(a): the 0.10 ceiling is above the rate its own sentence says it may not exceed. **MEDIUM. REFUTED (the licence).**

Both rules justify 0.10 identically: *the crier's own licensed-formula rate for a QUOTED voice
(A′-R5, "and the country" 7%), and the ladder is not a quoted voice, so it may not exceed what the
crier is allowed.* The measured crier rate is **26 of 373 = 7.0%** (`best-own.md` §, `EXEMPLAR-BEST-PARTS.md`
row 47). **0.10 > 0.070.** The size is 43% above the number the sentence uses to bound it, and the
reasoning delivers the opposite of what the reasoning says.

Compounding it: `and the country` is a **second-clause tail** in A′-R5's own printed example, not an
opener — the herald refuter made exactly this correction on the sibling register. Using a tail-frame
rate as the licence for a per-stage **opener** ceiling is a category mismatch on top of the arithmetic
one.

**CURE.** Either set both ceilings at **≤ 0.07** and keep the stated reasoning, or keep 0.10 and
license it from something else entirely — and in NL-1's case from an **opener** figure, not a tail
figure. Do not carry the present sentence: it convicts its own number.

---

### R6-OP-05 — NL-5 / C5: the licensed set is 64 lines, not 30, and the cure budget is unscoped. **MEDIUM. REFUTED.**

C5 rules that *knows / is learning / has learned* with a collective subject at `exposed-public` "stays
(30 lines)", and NL-5's walker then fails **every other mental predicate on every subject**. Measured
at 29a4ff20d over the whole roster:

- lines carrying a knows/learn predicate: **101**
- by stage: exposed-public **64** · attributed **27** · historicized 4 · reformed 3 · re-adjudicated 2 · re-caused 1
- lines with a knows/learn predicate and no mention of the town at all: **54**

Two consequences. First, C5's licensed-set figure is wrong by a factor of two: the exposed-public
knows/learn population is **64**, not 30. Second — and this is the substantive one — NL-5's walker as
specified fails the **37 knows/learn lines outside `exposed-public`** on the stage restriction alone,
plus every exposed-public line whose subject is not collective. The subjects in that residue are not
edge cases: *the law is learning*, *the archive knows*, *each army has learned*, *the adept's auguries
have learned*, *the boss's own people learned it*, *the streets have learned*, *both congregations know*.
None of these is a bearer-interior line, so none is inside the "64 bearer-interior + 12 residue"
inventory the rule sizes itself on, and §8 OQ1 sends only that inventory to adjudication.

The rule's proposition is right and its 46 hands are real. What is refuted is the **size and the
adjudication budget**: the rule states a cure of ~76 lines and specifies a walker that convicts a
materially larger and differently-shaped set.

**CURE.** (a) Correct C5 to the measured 64. (b) Before the walker is built, run the (subject class ×
predicate lemma × stage) census over all 101 knows/learn lines and publish it, so the allow-list is
written against the actual subject inventory rather than against "the town". (c) Add those lines to
OQ1's adjudication list explicitly — today OQ1 names the 90 offices, the 16 `will` lines and the
64+12, and this population is in none of the three.

---

### R6-OP-06 — NL-10: R6 is a `dm-page` register, where direct address is licensed. **MEDIUM. REFUTED (the size).**

NL-10 drives four imperative openers to zero and holds second person at zero, grounding the second
limb on "own row 56 … zero in every record register". But `best-own.md` line 46 maps the registers,
and its `dm-page` row reads: **R6 NPC cause-conjunction ladder, read aloud** (with R11 and R14).
`best-ai.md`'s own register list describes `dm-page` as DM-only, candid, **second person allowed** —
and best-own's drafted A′-R14 licenses second person for R14 on the same page-family ground ("the
arrival is read to the table"). R6 sits in that family, not in the archivist's.

So row 56's zero is a **measurement of what is**, not a law about what may be, and NL-10 converts it
into a ratchet without any source that binds *this* register. Three of the four imperatives are in the
**full rung** — the hand-picked dozen whose authored intent §8 OQ3 already puts to the owner on
length. The same question is unasked for its voice, and it is the same twenty-four lines.

I do not refute the proposition (a covert line may name the tell and may not name the watcher, and
`Watch the captain on pay day` states what the speaker wants the reader to do, which fault 13's
constraint bars on `dm-page` explicitly). I refute the **size of 0 arriving without the owner**.

**CURE.** State the register mapping (`best-own.md`:46, R6 → `dm-page`) in NL-10, so the reader can
see that the ladder's audience law is the DM page's and not the archivist's. Then either fold the
four imperatives into OQ3 as a single authored-intent question covering the full rung's length **and**
its address, or carry the 4 → 0 size explicitly as an owner-signed reversal of an authoring decision.
The second-person-at-zero limb should be restated as an observation the register may keep, not as a
law inherited from the record registers.

---

### R6-OP-07 — NL-1: the Statement asserts a runtime mechanism the register lacks, and one clause is vacuous on half the pools. **MEDIUM. REFUTED (the wording).**

NL-1's Statement says the opening move and the move order "are drawn by seed from a closed set of
grammars", and its Move-grammar repeats "the draw is seeded". Its own Guard then says the opposite:
the distribution is an **authoring-time** property, because the only runtime draw is
`variants[h % length]` over a pool. The file accepted precisely this correction for the joint (NL-3)
and did not carry it into NL-1's own two mechanism sentences. This is the charter-the-permission /
measure-the-mechanism failure in its normal shape: the ruling is right, the named mechanism is not.

Second: the Statement's third clause — *no two consecutive variants of a pool open alike* — has no
purchase on **546 of 1,104 pools (49.5%)**, which hold one variant and therefore have no consecutive
variants. B-GRAMMAR's own acceptance test ("one block in two grammars") is unreachable for those
pools for the same reason. NL-8's Move-grammar says this, honestly, of a third of the *lines*; it is
not said in NL-1, where the assertion lives.

Third, a presentation point that matters for a reader deciding whether the size bites: NL-1's headline
ceiling (no two-word opener above 0.10 of a stage) **already passes today for two of the six stages** —
attributed (max `with the` 31/378 = 0.082) and historicized (max 14/184 = 0.076). The Figure prints
only the four failing stages.

**CURE.** Rewrite the Statement and Move-grammar to authoring-time language ("the opening move is
chosen across a pool's variants and its sibling pools from a closed set", B-GRAMMAR's own "variants
rewritten in place in different grammars"). Move the singleton limitation from NL-8 into NL-1's
Statement, where the vacuous clause is. Print all six stages in the Figure with the two that already
pass marked as such. And state the arithmetic bound the closed set imposes: a closed set of four
grammars cannot put any per-move share below 0.25, so OQ7's per-move floor cannot later be set
under that without enlarging the set.

---

### R6-OP-08 — NL-2: the sd target is below both the exemplar floor and its own named proof. **MEDIUM. REFUTED (one size).**

NL-2 proposes **sd 4.0 → ≥ 6.5**, licensed by: "sd 6.5–8.0 is ACHIEVED inside this house voice by the
arrival tables (own row 8: sd **8.1**)". The proof is 8.1; the band named is 6.5–8.0, which does not
contain 8.1; and the target set is 6.5, which is below the exemplar floor of **8.5**
(`dnd-rules-srd52`, the lowest of the fifteen fingerprints) and below the internal proof. A target
that no exemplar and no internal proof sits at is not licensed by either.

Second, smaller: the under-eight size (0.0047 → 0.06–0.10) is stated while the rule's own Guard says
the under-eight floor "and any arity ceiling are derived from the measured single- and double-claim
shares" of a **proposition census that has not been run** (OQ11). A size cannot be both proposed and
unsettable in the same rule.

**CURE.** Set the sd target at **≥ 8.1** (the internal proof) with the exemplar floor 8.5 as the aim
after the walk, exactly as the neighbour-variation limb is already handled (0.40 now, 0.50–0.73 as
the aim) — the file already knows this pattern and applied it to one metric and not the other. And
mark the under-eight number explicitly as *pending OQ11*, not as a proposed size.

---

### R6-OP-09 — §0a / NL-7: the "it" closer is 48, not 46. **LOW. REFUTED (the figure).**

`npc-ladder.fingerprint.json` `closers.topClosers` reads `["it", 48]`. The reconciliation prints 46
in NL-7's Figure. Every other closer in the list (arrangement 63, them 38, now 26, not 22, again 19,
over 19) is exact. **CURE:** 46 → 48.

---

### R6-OP-10 — NL-1: "one pool of 564" — the denominator appears nowhere. **LOW. REFUTED (the figure).**

I measured the claim directly: **558** pools hold two or more variants, and exactly **one** of them
(`the rival | the rival`) shares a two-word opener — rate 0.0018, matching PROBE's 0.002. The file's
own §0 gives 558 pairs; PROBE's deduped count is 554. **564 is neither.** The finding (one pool, the
estate's best figure) is CONFIRMED; only the denominator is wrong. **CURE:** 564 → 558, or cite
PROBE's 554 and say which denominator is used.

---

### R6-OP-11 — file-wide: the distinct-hand rule is applied in two directions. **LOW. REFUTED (the method, not the grades).**

§0's method states two collapsing rules: *an author's own several documents are one hand*, and *a
relay counts with the critic it relays*. They conflict where an author is quoted by a critic, and the
file resolves the conflict differently in different rules, each time toward the printed number:

- `dnd:603` (Cordell & Mearls **via Hartlage**) and `dnd:604` (Nephew **via Hartlage**) are counted as
  two labels but must collapse into Hartlage for NL-1's D&D limb to be 6.
- `martin:841` (Martin **via Germani**) is counted as its own hand for M 33's limb to be 5.
- the nine Hobb interview rows (`468/49/41/42/244/164/39/16/17`), relayed by six different venues, are
  collapsed into one Hobb for H 8's limb to be 12.

Applied consistently, NL-1 is **20** hands under relay-collapse throughout and **22** under
author-collapse throughout; the file prints 21, which requires one rule for D&D and the other for
Martin. I checked the arithmetic of every rule's stated sum and **all twelve add up internally**, and
no grade moves under any of the three readings (every limb is far above three voices). But ruling (2)
makes the count the standing, so the count should be reproducible.

**CURE.** Pick one rule and state it once: I would take *the primary speaker is the hand wherever the
row records the primary's own words; the relay is the hand only where the row records the relay's
characterisation*. Then re-run every "Sources: N distinct" line against it, and publish the per-rule
hand list so a reader can re-count without re-reading nine kept- files.

---

### R6-OP-12 — NL-4: B-CLAIM does not contain the carve-out attributed to it. **LOW. REFUTED (the citation).**

NL-4's Obeys says *removing an unheld claim is the one removal B-CLAIM requires*. B-CLAIM's text
(`RULES-V2-DRAFT.md`:59) is: a reconstruction may spend punctuation, word order and a rationed phrase;
it may not spend a claim, a modality, a threat class, or a pool's spread. There is no carve-out in it,
and no "removal it requires". The substance is right — ruling (5) mandates the removal and outranks a
Part B drafting rule — but the authority is misattributed, and B-CLAIM is precisely the instrument
this wave uses to stop rules from quietly deleting content.

**CURE.** Restate as: *ruling (5) requires this removal; B-CLAIM's bar on spending a claim is not
engaged, because an unlicensed assertion is not a claim the pool was entitled to hold.* Same
outcome, and it puts the load on the ruling that actually carries it.

---

### R6-OP-13 — NL-3: one of the five hands is the sweep's own measurement. **LOW. NOT REFUTED (noted).**

NL-3's five: Le Guin (SINGLE, all six rows one hand), Robinson, Germani, Kullmann & Siepmann, and
`dnd:1009/1010` — which are **"Finder measurement over SRD 5.1 … pdftotext extraction"**, i.e. this
programme's own instrument, graded VERIFIED_SUBSTANCE. Counting it among "independent voices" makes
the independent count **4**, not 5. The file already grades the rule *STRONG on the measurement,
MODERATE on the exemplar rows* and says the licence is chiefly the 4.15× figure, which I re-derived
and confirm. So the grade stands; only the arithmetic of "5 distinct" is soft.

**CURE.** Print it as *4 independent hands + 1 own-instrument measurement*, and keep the grade.

---

### R6-OP-14 — §4: the fault-24 override is declared against a constraint the file never shows binds. **LOW. REFUTED (the framing).**

§4.4 declares an override of fault 24's *a gap in the record is recorded as a gap*, saying it "binds
the record registers and the DM page". `best-own.md`:46 places R6 **in** the DM page family, so the
constraint does bind, and the override is a real weakening of a STRONG-evidenced constraint (15
documents) taken on the seat's own authority rather than the owner's. Separately, the override may not
be needed at all: §4.1's case is a line that never renders, and omitting a line for an event that did
not happen is not a clerk filling a gap — fault 24 bars fabrication, not silence.

**CURE.** State R6's register mapping once, in §0 (it is load-bearing for §4, NL-10 and every fault
citation in §1's ai paragraph, and it appears nowhere in the file). Then either withdraw the override
as unnecessary — the no-stamp case is outside fault 24's scope — or carry it into §8 as an owner
question, since a declared override of a STRONG constraint is the kind of act ruling (7) reserves.

---

## 2. WHAT I TRIED TO REFUTE AND COULD NOT

Recorded so the chair can see the search was symmetric.

- **Every figure in §0a, §0b and the twelve Figure blocks** — re-derived independently; the table
  above lists what matched. I found three errors (R6-OP-03, -09, -10) in roughly ninety printed
  numbers.
- **NL-4's three Brackwater breaches** — the gender asymmetry (234/0 against a 50/50 field), the
  sustainer asserted on one of two terminal paths (100/156 of 182), and the three multiples are all
  exactly as stated. This is the strongest rule in the file and I could not dent it. Its guard is not
  vacuous against the owner's own sentence: the only-construction bar plus the `whoIsExempt` column
  is what would have stopped *the priest is the only person the bailiff does not count*.
- **NL-6** — 16 `will`, 35 `would/could/might`, and the three adjudication examples are all present
  and correctly characterised; the rule grades itself MODERATE on four hands and rests on A2 and THE
  PROMISE, which is the honest grading.
- **NL-9** — I checked whether the three assertions pass today (the failure mode the file itself
  caught in the draft's "overlap"). They do not: the full rung's p10 is 31 against a register p10 of
  19, its median is far outside the role rung's interquartile range, and the register max is 41
  against the proposed 34. The test can fail. The 3+-sentence limb is a ratchet at a measured 0.0012,
  which is legitimate.
- **NL-11** — "None measured" is stated plainly rather than hidden, the walker is a property test
  that can fail, and all 27 hands are present and VERIFIED.
- **C3's product seam** — verified in the code by symbol, as described.
- **Standing laws** — no rule introduces a digit, a named character's fate, a theological claim, a
  hedge marking a source the engine never made, or the archivist's voice onto chrome; no rule rations
  an element by adventure importance; every shape change (the SUSTAINER slot, the `gender` read, pool
  growth, the tier marker) is declared owner-gated, and every text move owner-signed. I looked
  specifically for a shape change dressed as a text move and did not find one.
- **Source existence** — I sampled roughly 120 cited rows across all nine kept- files. Every one was
  present and VERIFIED; **no PARTIAL row and no absent row is cited anywhere in this file.**

## 3. SEVERITY ROLL-UP

| id | rule | severity | refuted |
|---|---|---|---|
| R6-OP-01 | NL-8(a) | HIGH | yes |
| R6-OP-02 | NL-12 | HIGH | yes |
| R6-OP-03 | NL-7 | MEDIUM | yes (the size) |
| R6-OP-04 | NL-1, NL-8(a) | MEDIUM | yes (the licence) |
| R6-OP-05 | NL-5, C5 | MEDIUM | yes |
| R6-OP-06 | NL-10 | MEDIUM | yes (the size) |
| R6-OP-07 | NL-1 | MEDIUM | yes (the wording) |
| R6-OP-08 | NL-2 | MEDIUM | yes (one size) |
| R6-OP-09 | NL-7 / §0a | LOW | yes (the figure) |
| R6-OP-10 | NL-1 | LOW | yes (the figure) |
| R6-OP-11 | file-wide | LOW | yes (the method) |
| R6-OP-12 | NL-4 | LOW | yes (the citation) |
| R6-OP-13 | NL-3 | LOW | no (noted) |
| R6-OP-14 | §4 | LOW | yes (the framing) |
| — | NL-6, NL-9, NL-11, NL-4 substance, C3 | — | no |

Two HIGH findings are both **tests**, and both are the same failure in two forms: a threshold set
without executing the walker against the corpus first. NL-8(a)'s fires on everything; NL-12's fires
on nothing. Neither would have survived one run of the instrument it names. Every proposed SIZE in
this file should be executed against 29a4ff20d before it goes to the owner's walk — the diagnosis
is sound and the arithmetic is sound, but a size is a claim about a measurement and four of them are
not.

Seat: Opus 5 — Fable-unvalidated. Nothing here is validated until the chair's sitting;
retrovalidation owed through `docs/FABLE_RETROVALIDATION_QUEUE.md`. No corpus byte moved; no walker
built; no rule applied.
