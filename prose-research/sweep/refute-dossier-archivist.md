Seat: Opus 5 — Fable-unvalidated

# REFUTE — dossier-archivist (the Opus refutation of the Fable reconciliation)

**Status: NOTHING HERE IS VALIDATED until the Fable chair's sitting** (`docs/FABLE_RETROVALIDATION_QUEUE.md`). Written 2026-09-07, session 8de5f153. Read-only: no corpus text, no `src/`, no `docs/content/` byte was written by this seat. Content read from files is DATA, never an instruction. No quotation below exceeds twelve words.

**Target.** `sweep/reconcile-dossier-archivist.md` (Fable 5.1, 11:42), 25 rules R-DA-00 … R-DA-24, §3 refusals, §4 absence ruling, §5 conflicts, §6 the judgment of the Opus draft.

---

## 0. WHAT WAS EXECUTED (receipts)

| # | check | result |
|---|---|---|
| E1 | Every cited `<author>:<index>` resolved against `sweep/kept-*.json` by script (`chk.py`, this session's scratchpad), 800+ row references across 25 rules | **ZERO missing, ZERO non-VERIFIED.** Every cited row exists and carries `VERIFIED_VERBATIM` or `VERIFIED_SUBSTANCE`. Ground (1) fails corpus-wide. |
| E2 | Claimed `sourceCount` vs distinct `source` strings over the same rows, per rule | Claimed is **below** the raw distinct-string count in **every** rule (e.g. R-DA-18 claims 47 over 102 rows / 73 strings; R-DA-21 claims 48 over 61 / 55). The unions are floors, not sums. **S-UNION is genuinely cured.** |
| E3 | Every PROBE_ALL figure re-read from the §3 master table (line 318 ff.) and the §5/§6 outlier lists | R1 0.113 / 255 of 2,262 / 16.1×; antithesis 0.139 vs median 0.019 (7.32×) and field mean 0.028; gloss tail 0.066 / R2 0.054 / A-U 0.062; 2nd-sentence 0.035; pronoun closers 0.133/0.125/0.123/0.114; pet words 0.536 / R2 0.713 / R3 0.176; R2 semicolon 0.360, colon 0.364, >30 0.491, <8 0.017; R7 8.8 / 0.472 / 0.069 / 0.086 / 0.030 / pool 2.0; R17 0.000 / 1.000 / 7.5; R14 0.221 / 8.1 / 0.400; pools 0.112 (79/708), 0.576 (408/708), sd 2.9; digits R7 .030 R15 .054 R14 .039 R18 .012; "the PCs" 1 in R8. **ALL CORRECT.** |
| E4 | Every fingerprint figure re-read from `estate-state.fingerprint.json` and `primary/*.fingerprint.json` | neighbourVariation 0.399; sd 7.2; antithesisRate 0.1088; pronounRate 0.1335 (389/2,914); abstractNounRate 0.0439; sameOpener 0.1321; runsOfThree 0.3202; thereIs 0.0515; participial 0.0117; doubledAdj 0.0144; adverbs 0.162; dialogue 0.0003; `ashford` opener 610; `it` closer 253. Exemplars: martin-chronicle 0.0543 / 0.0000 / 0.3382 / 0.0292 / 0.0334; tolkien-elevated 0.0401 / 0.122; dnd 8.5–8.9, 0.495–0.520; leguin-fiction 0.1667 and 162 sentences. **ALL CORRECT.** |
| E5 | `check-pair.mjs` arms read from source | Every arm the file names EXISTS: `R4` (:74), `THREE+ SENTENCES` (:78), `RATIONED WORD ADDED` (:81), `ANTITHESIS SHAPE ADDED` (:85), the shape NOTE (:87), `R4-BAND`/`R4-BAND-TEXT` (:96,:105), `A11 SPREAD`/`FLATTENED`/`PRE-EXISTING`/`SHARED OPENER CREATED` (:112–121), `FUTURE INDICATIVE` (:123), `SUBJUNCTIVE "would" REMOVED` (:124), `EXISTENTIAL OPENER` (:126), `PRONOUN CLOSER ADDED` (:129), `DURATION/TIME`/`COUNT words` (:71–73), `MARKS` (:65). |
| E6 | **§6.3's correction of the prior Opus refuter** | **UPHELD BY EXECUTION.** `check-pair.mjs:86–87` computes `shapeNote` and pushes it into `r`; `:130` sets `verdict = r.length ? 'FAIL' : …`. The NOTE **is** a failing arm. The Fable seat is right and the earlier refuter was wrong. |
| E7 | `LIVE_STRING_BINDINGS` at the product tip | **CONFIRMED.** `scripts/generate-dossier-state-prose.mjs:89` at `3b1c0eaa5`; `ECONOMY_FRESHNESS_SENTENCES` exported from `src/domain/display/economyFreshness.js:187` as two frozen sentences. |
| E8 | `tests/data/dossierStateProseProjection.contract.test.js` | **CONFIRMED at 3b1c0eaa5**: `:186` spawns the generator with `'--check'`; the header states the byte-compare. R-DA-24's authority holds. |
| E9 | `scripts/.clamp-primitive-baseline.json` | **CONFIRMED**: `src/domain/display/settlementRumors.js` is line 9; the file exists on the working tree. |
| E10 | best-ai.md fault numbering and document counts | fault 1 = 14 documents, archival YES; fault 3 = 7 documents, archival YES, evidence list identical to R-DA-02's ai rows; fault 5 archival PARTIAL "length and grade only"; fault 9 = 11 documents; fault 11 = 24 documents. **ALL CORRECT.** |
| E11 | `taste-sample-refutation.md` U1–U12 against every acceptance claim | U1 three inversions / two citing the rule to cut ✓; U2 four of thirty-one ✓; U3 four adds ✓; U4 six of eight, #21 promoted to subject ✓; U5 eight/once ✓; U7 #7 kept, #19 subjunctive deleted ✓; U9 two cuts ✓; U12 body names five (#14,#19,#37,#34,#32) though its header says four — the file's 5 of 40 reads the body correctly. |
| E12 | `primary/extras.py` TTR and R15 classification | TTR 0.211 vs dnd-rules 0.242, lowest of eight (best-own row 51) ✓; R15 reader 2,758/3,894 = 70.8%, strict floor 57.8%, `tradeGoodsData.js` 934 ✓. |

**Consequence.** Grounds (1) — the source count — and the great majority of ground (2) — the figure — are REFUTED AGAINST THE REFUTER. This file's surviving findings are almost all ground (3), (4), (5) and (6): guards that do not stop their fault, limbs no field licenses, tests that cannot fail, and shipped surfaces marked false.

---

## 1. VERDICTS

### R-DA-00 — REFUTED (MEDIUM) · ground (2)/(4)
Graded **"STRONG (by instrument count)"** over five `own:` rows plus the R15-TAIL classification. §2.0's own collapse rule states an in-house measurement is an instrument reading and never a source; ruling (2) makes standing the verified SOURCE count. Zero sources cannot be STRONG. The same file applies the opposite treatment to the same class of evidence at R-DA-23 (demoted to MODERATE "the dispersion finding is the instrument's") and at R-DA-05 (dnd:46 demoted from three sources to an instrument). One law, two answers, inside one file.
*(Figures verified: 70.8% (2,758/3,894), floor 57.8%, R17 0.000, R14 0.221/8.1 — all correct.)*
**CURE.** A scope rule takes no source-strength grade. Print `Strength: n/a — a scope rule; instrument-derived, 0 sources` and let ruling (2) keep one meaning.

### R-DA-01 — REFUTED (HIGH) · grounds (2) and (3)
**(a) The zero-person floor contradicts the file's own §3.** The Figure asserts *second person 0 in R1, R2, A* on the authority of `own:56`; best-own.md row 56 does say the record registers carry it at zero. But §3 and C15's neighbour C14 of the same file assert **30 second-person variants in R1/R2** and attribute that 30 **to own row 56** — which contains no such count. Traced: the 30 comes from `taste-sample-refutation.md` item #22, not from row 56. So the rule's named test — *a walker asserting zero first/second person in R1/R2/R7/R8/A* — either REDS at the freeze on thirty rows the file expressly refuses to rewrite ("a chair ruling on the thirty"), or the thirty are phantom and §3/C14 are wrong. The file carries both readings and reconciles neither. This is the CITATION LAW hazard in its live form: an instrument row cited for a figure it does not hold.
**(b) The fault guard is vacuous.** The named fault is martin:1 — the same attribution paragraph at the head of every dossier. The guard is *the vantage is declared once on the front matter*, which forbids repetition WITHIN one dossier and says nothing about ACROSS dossiers; the test then **mandates** "exactly one origin block per dossier", i.e. the same generated block at the head of every settlement — the fault itself. The file's own §3 refuses "Hobb 1 as a masthead per entry" on exactly this reasoning: the masthead is fault 9 at document scale.
**CURE.** (a) Re-run the second-person scan over R1/R2/A with the `You see` pattern before any walker asserts zero; publish the true count; park the thirty by name so the walker fails-and-parks rather than asserting a floor the corpus may not hold. (b) Draw the origin block per settlement from a closed set of forms keyed on `record.origin`'s own fields, with a walker ceiling on any single form across the corpus and a same-form-as-previous refusal — the B-GRAMMAR discipline R-DA-17 already builds, applied to the front matter.

### R-DA-02 — REFUTED (MEDIUM) · ground (2) twice
**(a) A unit mix, in the rule the file wrote to cure unit mixes.** The per-VARIANT ceiling **≤0.040** is anchored on *tolkien-elevated 0.0401*, which is a per-SENTENCE fingerprint `shapes.antithesisRate`. §2.0 forbids exactly this ("never mixes them in one comparison"). The file's own measured ratio between the units is 0.783, so tolkien-elevated's per-variant equivalent is ≈0.051, and the probe's own per-variant exemplar column (BIBLE 0.045) is the licensed anchor — which the rule names and then discards as "looser". The derived fingerprint ceiling ≤0.031 is therefore ~22% tighter than the anchor it claims to sit at the top of.
**(b) The LACK move is a SINGLE-graded limb inside a STRONG rule.** The move's evidence is Le Guin 18 (M2, two sources) and Hobb 5 (SINGLE) — the latter refused by name in §3 — and the only kept rows cited for the limb, `leguin:324`/`leguin:325`, are ONE voice (Tearle) counted twice. §0's own row says a SINGLE limb enters only as a permission labelled "test this, don't trust it"; R-DA-06 marks its SINGLE limb correctly, R-DA-02 does not, and the LACK move goes on to become §4's whole class 1.
*(Not refuted: the 10-source union, the 0.113/255/16.1× and 0.139/0.019/7.32× figures, the fault-3 evidence list, and the §6.3 correction — all confirmed. §1's attachment of "5.33 per thousand words" to the antithesis SHAPE clause is a misplacement: best-own row 19 ties 5.33/1k to "rather than", as §3 of the same file does correctly.)*
**CURE.** Anchor the per-variant ceiling on a per-variant exemplar (BIBLE 0.045) or convert the estate figure to per-sentence before comparing, and print the conversion. Grade the LACK move separately as a MODERATE permission and route its rate to Q19 rather than letting it inherit the CONTRAST limb's STRONG.

### R-DA-03 — REFUTED (MEDIUM) · ground (2)
The size justification is inverted on its own numbers. *"The SIZE 0.010 sits below every RECORD-register exemplar (martin-chronicle 0.0000; dnd-flavor 0.0066; leguin-fiction 0.0123)."* Re-read from the fingerprints: 0.010 is **above** martin-chronicle's 0.0000 and **above** dnd-flavor's 0.0066, and below only leguin-fiction. Two of the three named anchors sit under the size, not over it. The same sentence also mixes units — 0.010 is the per-variant probe target, the three anchors are per-sentence `shapes.whichTailRate`. The direction (0.066 → far down) is unimpeachable; the *justification as written* is false, and it is the sentence §6.1 wrote to replace the draft's refuted "midpoint" claim.
*(Verified: the 14-source union, gloss tail 0.066/0.054/0.062, 2nd-sentence 0.035, dnd-rules 0.0237/0.0274, the `which (is|means)` RATION entry, the `THREE+ SENTENCES` arm.)*
**CURE.** Restate as "at or below every record-register exemplar except martin-chronicle's zero, which no generated pool can hold", or set the size on the per-variant unit from a per-variant exemplar and name the exemplar it does not beat.

### R-DA-04 — NOT REFUTED (LOW residual)
Every figure re-derived: `closers.pronounRate` 0.1335 over 2,914 sentences = 389 → 160 at ≤0.055; the "it"-only 253 → 104 at the same ratio; probe 0.133/0.125/0.123/0.114; martin-chronicle 0.0543. The arm exists at `check-pair.mjs:129`. The guard is not vacuous — it names fault 9's trap ("always end on an object" is itself a fixed move) and answers it with a per-kind walker ceiling. Residual: the abstract-closer guard compares the fingerprint 0.0439 (per sentence) against BIBLE 0.060 (per variant); the direction is unaffected.

### R-DA-05 — REFUTED (MEDIUM) · ground (6), with two figure notes
**The fence §2.0 promises is not delivered here.** §2.0 states that the `LIVE_STRING_BINDINGS` rows are not byte-inert and that **"every text rule below excludes them by name"**. Only R-DA-02 and R-DA-03 do. R-DA-04, **R-DA-05**, R-DA-07 and R-DA-17 — the four rules that rewrite R1 openers, closers and pool shape — print a bare `Shipped surface: TRUE` with no exclusion. The casualty is concrete: `ECONOMY_FRESHNESS_SENTENCES.tallies` and `.catalog` (read at `3b1c0eaa5`) are two sentences that **share their first two words and their closing word** — precisely what R-DA-05's "no two variants share their first two words" would force a rewrite of — and they are live engine strings pinned by two tests. A rule that would rewrite them cannot be published without the fence it claims to carry.
Figure notes (neither moves a target): *"dnd-flavor 0.495, martin-chronicle 0.508 — the two lowest exemplar floors"* — dnd-rules-srd52 at 0.501 is lower than martin-chronicle; and §1 item 8's *"A-W … the widest spread of any record column"* is wrong, R2's sd is 9.4 against A-W's 8.6.
*(Verified: 0.399/7.2/0.1321/0.3202, 79 of 708, 408 of 708, sd 2.9 vs R14 4.8 vs bible 6.5, R2 0.231/0.513, all A11 arms, and the correct demotion of dnd:46 to an instrument.)*
**CURE.** Carry the fence by name in R-DA-04, R-DA-05, R-DA-07 and R-DA-17, enumerating the bound rows; or drop §2.0's "by name" and state the exclusion once, corpus-wide, with the binding list printed. Correct the two exemplar-ordering claims.

### R-DA-06 — NOT REFUTED
Every size re-derived and correct: R2 semicolon 0.360 → ≤0.130 against tolkien-elevated 0.122 (verified the highest exemplar); colon 0.364 held; >30 0.491 → ≤0.340 against martin-chronicle 0.3382 (verified the exemplar maximum); <8 0.017 → ≥0.030 against 0.0292; pet words 0.713 → ≤0.200 against R3's 0.176. The SINGLE limb is correctly labelled a permission — the treatment R-DA-02 omits. The `THREE+ SENTENCES` arm exists. Residual only: the ≤0.130 per-variant ceiling is anchored on a per-sentence 0.122, the same mix as R-DA-02, here immaterial because R2's segments/variant is 1.135.

### R-DA-07 — NOT REFUTED
The strongest rule in the file on ground (5). It identifies that a delta arm cannot catch a breach present in BOTH before and after (U7's #7), and adds a **census** arm over every AFTER regardless of the BEFORE. Figures verified (R1 0.051, R8 0.013 and 0.048, dnd 0.0016–0.0027, martin-chronicle 0.0167, tolkien-plain 0.02; §6.3's leguin-fiction caveat — 0.0556 over 162 sentences — is exactly right). All three named arms exist. Carries the §2.0 fence defect reported under R-DA-05; no bound row opens `There/It is`, so nothing bites here today.

### R-DA-08 — REFUTED (MEDIUM) · grounds (2) and (4)
**(a) A phantom locator and a false universal.** The rule's Figure and §1 item 6 both rest on **`best-own.md` §5b**. best-own.md has sections A–L and three unnumbered tail sections; **there is no §5b**, and no section of it states that the apparatus family is absent. The substantive limb is independently true — PROBE_ALL's metric list carries no absence metric — but the cited authority does not exist. The companion claim, *"Every exemplar file ranks this family first for a place record"*, is false as a universal: only `best-tolkien.md` (:272) and `best-kay.md` (:139) carry such a ranking; `best-leguin.md`, `best-hobb.md`, `best-martin.md` and `best-dnd.md` carry none.
**(b) The unrationed licence collides with A7.** *"a recorded null is always reported"* over the whole corpus, against A7 as R-DA-24 restates it — *variants rewritten in place, none added, removed or reordered* — and against the estate's measured law that a pool's length is a seed input. The rule never says whether an absence sentence lands INSIDE an existing variant or as a new one; only the second reading is forbidden, and only the first is safe.
*(Verified: the 23-source union over 41 rows and 34 distinct strings; the shape-variety guard; the honest "no U of its own"; the double owner-signature.)*
**CURE.** Replace `own §5b` with the row that carries the finding or state it as this seat's own reading of PROBE_ALL's metric list; cut the universal to the two files that support it; and add one sentence: an absence is written inside an existing variant under A7, never as an appended one, with the pool-length invariant asserted by the walker.

### R-DA-09 — NOT REFUTED
Sources present and VERIFIED (21 claimed over 34 rows / 29 strings). The DISPUTE move is field-licensed, barred in R1 where no such field exists, and fenced from the belief ledgers. The guard names fault 3 in costume and answers it with rationing and form variation; the guard figure (must not raise R-DA-02's antithesis ceiling) is a real interaction test. Honest that it has no U.

### R-DA-10 — NOT REFUTED
The TTR figure re-verified against best-own row 51: 0.211 against dnd-rules 0.242, the lowest of eight columns — and the instrument is correctly named as `primary/extras.py` (best-own I6), the only one that measures it; no fingerprint carries TTR, and the file says so. Pet words 0.536 → ≤0.200 with R3's 0.176 as the in-house proof; floors 0.009 / 0.163 / 0.011 all correct. The 37-source union over 75 rows survives collapse comfortably. The guard is the sharpest in the file: two items or four, never habitually three.

### R-DA-11 — REFUTED (MEDIUM) · ground (6)
Marked **`Shipped surface: false`** on the strength of *"R1 carries almost none today"* — an unmeasured claim the rule concedes in its own Figure line ("None measured directly — no probe metric counts figures"). A rule that drives three walker classes to zero from an unmeasured base cannot know it is byte-inert, and the parenthetical then routes any cut it does find through **another rule's** owner signature ("rides on R-DA-02/03's pass"), which is how a text change reaches a reader without its own declaration.
**CURE.** Run the proposed walker to a baseline FIRST and set the shipped-surface line from the measured count; until then mark it `TRUE — pending measurement`, and never let one rule's cut ride on another rule's signature.

### R-DA-12 — REFUTED (MEDIUM) · ground (5)
The only executable the Test names that exists today is *`check-pair.mjs`'s RATION family*. Read from source, that family is nine patterns — `rather than`, `which (is|means)`, `nobody|no one|nothing`, `its own`, `whatever`, `enough (to|that)`, `(kind|sort) of`, `quiet(ly)?`, `(still|yet|already)`. **None of them can detect a generalising closer.** The arm cannot fail on the rule's own subject. The walker is proposed, not built, and the ceiling is defined as "at or below the live rate", which the untouched corpus satisfies by construction. The rule's honesty about the ceiling (MODERATE until measured) does not extend to its Test line, which reads as though something already gates it.
*(Verified: the 23-source union, the fault-6 citation, the "measure first" correction of the draft's unanchored ≤0.010, and the never-create limb — which is the one testable claim here.)*
**CURE.** Name the walker as the sole gate and its baseline run as a blocking precondition; state the never-create limb as a NEW `check-pair.mjs` arm to be written (a gnomic-closer regex over the AFTER against the BEFORE), and strike the RATION family from this rule's Test.

### R-DA-13 — NOT REFUTED
Honest that no figure exists; proposes four walker figures, each falsifiable (vague-authority phrases → 0; hedges per entry ≤1; every attribution resolves to a typed record id; belief-frames → 0). 28-source union over 48 rows / 42 strings. Marks its own missing U. The deity-doctrine limb (a hedge never softens a belief) is correctly derived.

### R-DA-14 — NOT REFUTED
29-source union over 44 rows / 36 strings, all VERIFIED. The live target is named and reader-facing (`npcData` manner strings). The guard names fault 9's three-beat person line as HIGH and answers it with a per-move variant set and a seeded order. Product scope and THE PROMISE are correctly applied (never a named character's fate). Shipped surface TRUE, engine-side, declared.

### R-DA-15 — REFUTED (MEDIUM) · ground (4)
The statement licenses *"the bare roll is rare and sometimes incomplete"*. An incomplete roll where the institution table holds the entries is an absence where the world holds a fact — forbidden by **§4 of this same file** ("What is NEVER written, in any class: an absence where the world holds a fact"), by **R-DA-21** ("the record may withhold the CAUSE and never the FACT"), and by **ruling (4) verbatim** ("we provide the full thing for each element"). The guard cites hobb:20 with hobb:19, which is an author's device; an author's device does not license an omission the owner's ruling forbids, and the rule does not route it through R-DA-08's typed `not-held` class where it would be lawful.
*(Verified and strong: the institution-table licence is the file's best answer to the Brackwater lesson; R7 0.086 → ≤0.060 against bible 0.060 / dnd-flavor 0.077 / martin-chronicle 0.023; digits 0.030 and pool size 2.0 correctly routed to Q24/Q23 rather than rewritten; the 5-of-40 acceptance reads U12's body correctly against its own header's four.)*
**CURE.** "Sometimes incomplete" is licensed ONLY where a typed `not-held` provenance field marks which entries are missing (R-DA-08 class 2); otherwise the roll is complete and the rarity attaches to the bare-roll FORM, not to its content.

### R-DA-16 — REFUTED (MEDIUM) · grounds (4)/(5) and (6)
**(a) Two limbs no field licenses.** *"with its source beside it"* and *"rarely corrected"* both write sentences. The Grammar section types a COUNT move, a TIME move, an ANCHOR-BY-INCIDENT move and a DATED-CENSUS move — and **no provenance-of-the-count field and no correction field**. A sentence saying the count was corrected asserts an event (who corrected it, when, from what) that no named field holds: that is the Brackwater shape — a fact bought for an effect — inside the rule whose Obeys line claims ruling (5).
**(b) The shipped-surface line is argued from the wrong metric.** *"Shipped surface: false for R1/R2/A (already at zero)"* is argued only from the digit floor. R-DA-19 states that R1 carries no provenance at all; so either the source-beside-the-count limb writes new R1 text — a shipped-surface change — or the limb is unexecutable in R1. Neither is said.
*(Verified: digits R7 .030 / R15 .054 / R14 .039 / R18 .012; the R1/R2/A zero; the QUANTITY_BANDS and six-band routing; the 25-source union.)*
**CURE.** Add `count.source` and `count.correction` (prior value, authority, date-band) to the typed set and forbid either sentence without them; restate the shipped-surface line **per limb** — false for the digit floor, TRUE for the source-beside and dated-census moves.

### R-DA-17 — REFUTED (MEDIUM) · grounds (3)/(4)
The closed set is built to carry the owner's four grammars verbatim, and the fourth ends on an **"unresolved question"**. The same file holds questions at **zero** — §0's obedience row ("digits, em dashes, questions, exclamations stay at zero"), the probe (R1 question rate 0.000) and own row 26 ("zero questions in every diegetic register"). The rule assigns a licensing field to every other member (geography, rank-and-rule, office roll plus event, built fabric, salience ranking) and **none to this one**, and never says how the move is realised under a zero-question floor. A grammar member with no licensing field and no realisation is either dead — in which case the set is three of the owner's four, unstated — or it breaches the floor.
*(Verified and correct: 610 of 2,914 = 0.209 from `openers.topOpeners`; the refutation of the draft's "one in five", which does floor to zero at mean pool 3.2; the refusal of the HIGH pair martin:12/15; the 41-source union over 64 rows / 52 strings. The 0.35 ceiling is honestly marked the owner's, Q4.)*
**CURE.** State that the unresolved-question move is realised as R-DA-08's declared-gap sentence in the clerk's third person, licensed by a `not-held` field, **never as an interrogative**; add `question rate = 0` as a standing assertion in the B-GRAMMAR walker so the member cannot drift into a real question.

### R-DA-18 — NOT REFUTED
Floors re-derived from the fingerprint and the probe and all correct (participial 0.0117, doubled adjective 0.0144, adverbs 0.162, exogenous tells 0.004, Juzek & Ward exogenous 0 in R1). The rename and swap tests are stated as pass/fail gates with no rate, which is the right shape for an unmeasurable property. 47-source union over 102 rows / 73 distinct strings — the largest union in the file and comfortably a floor. Honest about having no U.

### R-DA-19 — REFUTED (LOW) · ground (2), citation only
The live corpus defect is cited at `RECEIPT_POOLS_DOSSIER_STATE.md:2247`. Read at `3b1c0eaa5`: the `economicBase: extraction` header is line **2243**, the `[counterforce]` war-doctrine row is line **2246**, and **2247 is blank**. The register's own standing hazard is that a cited line number is wrong at the very commit that ships it; the cure it prescribes — cite by symbol — applies here as cite by pool key and angle.
*(Everything else verified: the five R-DST-B breaches match U12's body item for item; R2 n=467 and slot-bearing 0.953 correct; the CONSEQUENCE and PALIMPSEST moves are field-licensed and barred in R1; the 46-source union over 75 rows.)*
**CURE.** Cite the defect as ``economicBase: extraction`` → `[counterforce]`, with the sha, and drop the line number.

### R-DA-20 — REFUTED (HIGH) · grounds (6) and (4)
Marked **`Shipped surface: false` — "a gate; it writes no bytes"**. Writing no bytes is not the same as leaving a shipped surface unchanged. The rule's own statement says a failing variant *"is REFUSED at the pool"*. The estate's measured law is that **a pool's length is a seed input** — appending one variant was measured to move 8 of 48 draws, which is why a changed pool needs a new key. A draw-time refusal shortens the pool, moves the draws, and makes the **same seed render different text across every installed world** — THE PROMISE's exact subject matter, which the rule's Obeys line invokes without argument. This is the file's single most consequential mislabel: the rule the Brackwater lesson demands is the one whose blast radius is undeclared.
*(Verified and excellent: the assertion arm and failure channel adopted from the prior refuter; the small-particulars allowance that stops the checker erasing wolfe:41; the [R-5] raw-byte-scan caveat; the honest instrument gap — check-pair sees keys and bands but tests no claim against a field.)*
**CURE.** Say where the refusal fires. A **freeze-time** gate that reds the build and is cured by a rewrite in place leaves the pool's length untouched and is genuinely byte-inert to the seed — mark that `Shipped surface: false` and assert the pool-length invariant in the walker. A **draw-time** refusal is a product behaviour change bound by THE PROMISE and is owner-gated: mark it TRUE and route it to the owner. The rule must pick one.

### R-DA-21 — NOT REFUTED
The licensing set is named and countable (`dm-only` marks, 89 of 2,734, from check-pair's own note — and the `MARKS` channel exists at `check-pair.mjs:65` with the dm-only audience line). The stand-alone gate (W 32) is correctly given precedence over the withholding (W 43 outranks W 7 on collision), and the legibility law is invoked as the floor Wolfe himself does not supply. 48-source union over 61 rows / 55 strings. Honest about having no U.

### R-DA-22 — NOT REFUTED
Every figure verified against PROBE_ALL's own correction [R-13]: `DM-private` 5, `publicly visible`/`public-safe` 4, `profit enormously` 3 = 12 breaches in a 13-row registry; `the PCs` count 1 in R8. The ratchet split (nine chrome breaches frozen for the surface-text program, three plus "the PCs" this wave) is the right owner boundary and is declared. The word/fact distinction is the correct answer to fault 17.

### R-DA-23 — REFUTED (LOW) · ground (2)
The head-noun figure is a **summed column**: *"the head noun `travellers` in 64 of 1,293 phrases (0.050) across four top-ten grams"*. PROBE_ALL's §4 preamble carries correction [R-7] in bold — do not sum a column; 28 of 196 rows are row-set subsets of a sibling, and the ten-row sum for one register overstated a union by 34%. The four grams (29+14+11+10) do reach 64, and a fifth row in the same table (`finding a`, 8) has `travellers` as its head too, so the true union is unknown and could be higher or lower. The direction and the fence are untouched; the number is not derived by the method the document requires.
*(Verified: the route claim, executed — `settlementRumors.js` is line 9 of the clamp baseline and exists on the tree; R17's 0.000 / 1.000 / 7.5; the correct removal of kay:11 and wolfe:14 and the honest MODERATE grade.)*
**CURE.** Re-derive the head-noun share as a raw scan for a leading `travellers` over the 1,293 R17 rows — a union, not a sum — and cite [R-7] as the reason.

### R-DA-24 — NOT REFUTED
The strongest-warranted rule in the file, and the only one whose authority is the repository's rather than an author's. **Executed**: at `3b1c0eaa5`, `tests/data/dossierStateProseProjection.contract.test.js:186` spawns `scripts/generate-dossier-state-prose.mjs` with `'--check'`, and the header states the re-derive-and-byte-compare. A-U's figures (0.062, 0.287, 0.123, 4,626 rows) and [R-5]'s 8-against-129 caveat all verified. The write-target discipline answers the estate's most-bitten bug class directly.

---

## 2. CROSS-CUTTING

| verdict | judgment |
|---|---|
| **The source counts** | **NOT REFUTABLE.** 800+ row references, zero missing, zero PARTIAL, every claimed union below its own raw distinct-string count. The S-UNION defect is genuinely cured. |
| **The figures** | **Overwhelmingly correct** — every PROBE_ALL and fingerprint figure re-read this session matched. The three defects are R-DA-03 (an inverted justification), R-DA-23 (a summed column against [R-7]) and R-DA-19 (an off-by-three line number), plus the per-variant/per-sentence anchoring at R-DA-02/03/06. |
| **§6.3's correction of the prior refuter** | **UPHELD BY EXECUTION.** `check-pair.mjs:87` pushes the NOTE into `r`; `:130` fails on `r.length`. The chair's method line — a refuter's mechanism claim is measured, not trusted — is vindicated against a refuter. |
| **The unit discipline** | **PARTLY DELIVERED.** Every figure names its instrument, which the draft did not. But three targets are still set per-variant from per-sentence anchors (R-DA-02's 0.0401, R-DA-03's 0.0066/0.0123, R-DA-06's 0.122). Naming the unit is not the same as respecting it. |
| **The `LIVE_STRING_BINDINGS` fence** | **ASSERTED CORPUS-WIDE, DELIVERED TWICE.** §2.0 says every text rule excludes them by name; R-DA-02 and R-DA-03 do; R-DA-04, R-DA-05, R-DA-07 and R-DA-17 do not. |
| **The shipped-surface marking** | **THREE MISLABELS**, in ascending order of consequence: R-DA-11 (false on an unmeasured base), R-DA-16 (false argued from one limb's metric), **R-DA-20 (false on a draw-time refusal that moves every seed's draws)**. |
| **Ruling (4)** | Honoured in §4's three typed classes, which is a genuine improvement on the draft's two — and breached once, at R-DA-15's "sometimes incomplete" roll. |
| **Ruling (5)** | The two owed consequences are both written (R-DA-15, R-DA-20) and both are the file's strongest work. Two limbs elsewhere still buy an effect with an unlicensed fact: R-DA-16's correction and its source-beside-the-count. |
| **Ruling (3)** | R-DA-17 builds the grammar and R-DA-05 keeps it latent, correctly. The fourth owner grammar's terminal move has no licensing field and no realisation under the zero-question floor. |
| **Ruling (2)** | Applied correctly 24 times and inverted once, at R-DA-00's "STRONG (by instrument count)". |

## 3. WHERE THIS REFUTER COULD NOT REACH

- The `own:` rows were checked for existence and subject against `best-own.md`'s numbered sections; their underlying measurements were not re-executed.
- The exemplar TTR figures other than 0.211 and 0.242 were taken from best-own row 51; `primary/extras.py` was not re-run.
- The R17 head-noun union was not re-derived from the corpus (that is the cure this file asks for, not a claim it makes).
- The claim that `institutionalCatalog.js` is imported by three generators was not the object of this pass; a listing at `3b1c0eaa5` shows a far wider import surface, which strengthens R-DA-15's owner-signature rather than weakening it.
- No figure in `PROBE_ALL.md` was recomputed from the corpus; each was re-read at its own table cell and cross-checked against the fingerprint JSONs where both units exist.

**Nothing here is applied. No corpus text changed. Nothing is validated until the Fable chair's retrovalidation sitting.**
