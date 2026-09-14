Seat: Opus 5 — Fable-unvalidated

# RECONCILE — the NPC cause-conjunction ladder (R6)

**NOTHING IN THIS FILE IS VALIDATED.** It is written by the Opus seat under the owner's 2026-09-07 ~09:50 seat directive; the Fable chair retrovalidates through `docs/FABLE_RETROVALIDATION_QUEUE.md` at the next ledger act. No rule here is applied anywhere, no corpus text changes, and no byte of the shipped surface moves on the strength of this document.

Written 2026-09-07 10:07 EDT (`date` in the same shell). Corpus read at branch `review-fixes-2026-07-08`, HEAD **29a4ff20d** — the twelve role files are `D` (deleted) in the working tree by another session's WIP, so every figure below is measured against `git show HEAD:` copies exported to a scratch tree, never against the working tree.

Guard cleared: `sweep/EXEMPLAR-BEST-PARTS.md` exists (86,609 bytes, mtime 09-07 09:38). S10b has run; the matrix is read, not invented.

---

## 0. WHAT THIS REGISTER IS, AND WHAT LICENSES A SENTENCE IN IT

R6 is the NPC cause-conjunction ladder: **1,662 authored lines in 14 files**, resolved to one speakable line per compromised office-holder on the lazy dossier NPC card. It is ROLE-bound prose about people and never about a named person's fate.

**The typed key is four fields and nothing else** (`causeConjunctionContent.js` `normalizeKey`): `{role, situation, causeClass, lifecycleStage}`, plus an `ageBand` that only the generic floor reads. `role` is one of twelve archetypes (+ a `{role}` slot filled by `roleNoun`); `causeClass` is a closed 14 (`FLOOR_CAUSE_CLASSES`), each carrying exactly one authored mechanism phrase (`CAUSE_MECHANISM_PHRASE`, e.g. `underfunded` → "the coin ran short"); `lifecycleStage` is a closed 6 (`LIFECYCLE_STAGES`); `situation` is `compromised-covert` / `compromised-revealed`.

**Four rungs, measured at HEAD:**

| rung | pools | lines | mean words | what it is |
|---|---:|---:|---:|---|
| full (`role × situation × causeClass × stage`) | 12 | 24 | 35.4 | the hand-picked dramatic conjunctions |
| role (`role × causeClass × stage`) | 1,008 | 1,512 | 22.9 | the Tier-1 table |
| class (`causeClass × stage`) | 84 | 126 | 21.7 | role-agnostic, `{role}` slot |
| floor (`STAGE_TEMPLATES`) | 6 | 18 | — | **outside R6's 14-file roster** |

**The pick is `variants[fnv1a32(seedId::keyStr) % variants.length]`.** A7 binds exactly: rewrite in place, never add, remove or reorder. The pool's LENGTH is a seed input.

**The import census is CONFIRMED display-side.** `git grep causeConjunction -- src` outside the module itself returns exactly one importer: `src/components/new/npcComponents.jsx:11`. `PROSE_INVENTORY.md:260` also names `display/discourseKernel.js`, which does not exist in this checkout. So A16's classification of R6 as a display-side side-car holds by census, and a rewording here is a declared text shift, not a golden shift. It is still reader-facing product copy: every text-moving rule below is marked `changesShippedSurface: true` and is owner-signed under ruling (7).

### 0a. My own measurement (executed, not cited)

Every figure in this subsection is from `measure*.mjs` run over the HEAD export; each is re-derivable by importing `ROLE_CONTENT`, `CLASS_CONTENT` and `FULL_CONTENT` and walking to the array leaves.

- **1,110 pools, 1,680 lines** (1,662 excluding the 18 floor templates); **1,713 segments**.
- **Pool sizes: 546 singletons · 558 pairs · 6 triples.** 49.2% of pools give the seed nothing to choose.
- **Length**: mean 22.46, p10 19, p50 22, p90 28, min 1, max 39. Under-8 segments **13 of 1,713 (0.0076)**; over-30 **71 (0.0414)**.
- **Joints**: semicolon on 904 of 1,680 lines (0.538, 905 semicolons total — one per line where present); colon 236 (0.140); both 7; **neither 547**; `", and "` in **1,202 (0.715)**.
- **Clause-chain arity** (splitting on `;` `:` and `, and|but|so|yet `): 1→21, **3→998 (0.600)**, 2→478, 4→160, 5→5.
- **Opening moves**: the-noun-other 790 (0.475) · state-copula 312 (0.188) · subordinate-circumstance 228 (0.137) · **existential-disclosure 184 (0.111)** · other 80 · wh-nominal 40 · indefinite-noun 28. Same-move-as-previous 0.221. **Within a pool, only 34 of 558 multi-variant pools (0.061) give every variant the same move, and exactly ONE pool of 564 shares a two-word opener.**
- **First word**: `the` 1,111 of 1,680 (0.661), `it` 183, `with` 148, `when` 75.
- **Stage is the template.** Per stage:

| stage | n | mean | sd | min–max | semicolon | colon | `", and"` | its formula |
|---|---:|---:|---:|---|---:|---:|---:|---|
| attributed | 378 | 27.0 | 4.1 | 18–39 | 0.75 | 0.17 | 0.88 | — |
| re-caused | 182 | 21.4 | 2.0 | 18–28 | 0.42 | 0.00 | 0.96 | "now" in 147 (0.808) |
| reformed | 364 | 21.4 | 2.2 | 15–29 | 0.88 | 0.01 | 0.40 | "came clean" in 165 (0.453) |
| historicized | 184 | 20.8 | 2.8 | 15–36 | **0.98** | 0.01 | 0.03 | ", but … still" in 110 (0.598) |
| exposed-public | 372 | 23.1 | 3.1 | 16–41 | 0.09 | 0.43 | 0.96 | a disclosure formula in 296 (0.796); 177 open with one |
| re-adjudicated | 182 | 21.6 | 1.9 | 17–27 | **0.00** | **0.00** | **1.00** | "(destroyed\|gone), but" in 116 (0.637) |

- **Closers**: "arrangement" 63 · "it" 46 · "them" 38 · "now" 26. By kind: abstract-arrangement family 120, pronoun 103 (0.062), adverb/deictic 114, **other (noun etc.) 1,325 (0.797)**. B0.3 substantially already holds here.
- **Institutions outside the causeClass's own vocabulary**: **90 of 1,662 (0.054)** — guild 18, council 12, tithe 11, magistrate(s) 11, auditor(s) 10, court 7, creditor(s) 6, roll 5, census 5, inspector(s) 5, duty sergeant 1. ⚠ **UPPER BOUND**, from my own licensing regex; a per-line adjudication is owed (see §5).
- **Interior predicates**: 112 lines (0.067) carry one; 44 are `knows`, of which **36 have THE TOWN as subject**. The residue attributed to the bearer — fear 25, want 15, shame 6, loyalty 5, believe(s/d) 7, appetite 3, conviction 2, guilt 1 — is ~76 lines (0.046).
- **Zero**: digits, contractions, second person, questions, exclamations, capitalised mid-sentence tokens (no proper names). **Em dashes 0 in R6's 14 files** — the 2 in the tree live in `causeLifecycleVocabulary.js`, the floor, which PROBE_ALL's R6 roster does not include. This CONFIRMS PROBE's `R6 em dashes = 0` and locates the residue.
- `will/shall` in 16 lines; `would/could/might` in 35.
- Role nouns are evenly spread: captain 134 · claimant 128 · boss 127 · ruler 122 · adept 114 · envoy 114 · healer 113 · priest 111 · foreman 100 · agitator 97 · official 93; `{role}` slot in 97 lines.

**Reconciliation with PROBE_ALL.** PROBE reports 1,659 deduped variants / 1,689 segments; I count 1,662 / 1,713 undeduped — the gap is dedup. PROBE's existential-opener figure carried a refutation flag [P-4] ("the published 184 of 1,659 is a third quantity, first-segment-only openers"). **My measurement settles it**: 184 line-initial of 1,680 (0.1095) and 185 any-segment of 1,713 (0.1080) are both real and different, exactly as [P-4] said. The published 0.110 is sound; the denominator was the confusion.

### 0b. The fingerprint, against the exemplar table

`npc-ladder.fingerprint.json` against `primary/*.fingerprint.json` and the estate controls:

| figure | ladder | estate-state | crier | pools | exemplar band |
|---|---:|---:|---:|---:|---|
| words/sentence sd | **4.0** | 7.2 | 4.7 | 5.0 | 8.5 – 16.0 |
| p10 | **19** | 7 | 8 | 6 | 4 – 11 |
| share under 8 | **0.0047** | 0.130 | 0.078 | 0.204 | 0.029 – 0.333 |
| neighbour variation | **0.167** | 0.399 | 0.178 | 0.330 | 0.495 – 0.805 |
| semicolon rate | **0.531** | 0.133 | 0.187 | 0.116 | 0.008 – 0.122 |
| "There/It is" openers | **0.110** | 0.052 | 0.008 | 0.020 | 0.0016 – 0.056 |
| same opener as previous | **0.344** | 0.132 | 0.424 | 0.189 | 0.033 – 0.167 |
| triad rate | 0.055 | 0.009 | 0.010 | 0.011 | 0.044 – 0.213 (inside) |
| pronoun closers | 0.059 | 0.134 | 0.046 | 0.077 | 0.021 – 0.108 (inside) |
| antithesis rate | 0.007 | **0.109** | 0.005 | 0.010 | 0.008 – 0.040 (below) |

**The register's shape in one sentence:** the ladder is the estate's *most* disciplined register on the faults the dossier is convicted of (antithesis 0.007 against R1's 0.139; "rather than" 0.000; gloss tail 0.007; digits, em dashes, contractions and second person all zero) and the estate's *least* varied register on every measure of rhythm, joint and opening. **A′-R6 is right and its emphasis is right: this register needs SHORT sentences and OPENER spread before anything else.** Nothing lexical is wrong with it.

### 0c. The number that decides the register

`ai:936` (Mark Williams, editor, *The New Publishing Standard*, 2026, VERIFIED_VERBATIM): AI models optimised for coherence tend toward **uniform sentence lengths, typically fifteen to twenty-five words**, with consistent grammar.

The ladder's p10 is 19, p50 22, p90 28, mean 22.6, sd 4.0. **It sits inside the named signature band, and its variance is a quarter of the nearest exemplar's.** `martin-chronicle` sits at a HIGHER mean (25.9) with sd 12.7 and reads as a chronicle; the tell is not the mean, it is the flatness. Everything below is aimed there.

---

## 1. ALLOCATION — which authors this register draws on, and why

Ruling (1) governs: **allocate, never average.** No weights are used; the proposal's Kay 35 / Le Guin 20 / Wolfe 5 / Hobb 10 are UNSUPPORTED at 0 sources (`FIVE_AUTHOR_CHECK.md` C1) and do not appear here. Each allocation below names the evidence and the register-specific reason it fits.

### Allocated

**HOBB — the anchor, on the check's own register map.** `FIVE_AUTHOR_CHECK.md` A14 is the only rule candidate in the whole check whose register column names R6 by name: *"Hobb → the NPC cause-conjunction ladder (R6), ROLE-bound; never a named character's interior fate."* Its standing is **16 documents / 12 witnesses / 11 non-Hobb** — the third-largest bucket of 363 kept rows. That is an evidenced allocation, not a weight. It enters in the check's own **corrected** form and with both of its stripped limbs left behind: **"what it meant" is CONTRADICTED for a record register by five independent documents** (C14) and **"what they kept" is refused** on one off-shape hit (C15). Sharpest rows: `hobb:207` "the same duty manifests both domestically and politically"; `hobb:325` domestic and political worsening tracked together; `hobb:278` no melodrama, no screaming.

**D&D — the register is read aloud, and this is the only lane with a body of evidence on the spoken line.** `PROSE_INVENTORY.md:257` classes R6 as *read-aloud causal receipts*; A′-R6 says the two-sentence read-aloud law applies "because it is spoken." `kept-dnd.json` carries **99 rows on read-aloud/boxed text** against 0 in Hobb and 0 in Martin. Crucially the D&D sources **disagree on the number** — `dnd:94` two sentences, `dnd:314` one or two, `dnd:98` three lines never five, `dnd:97` four sentences under 100 words, `dnd:99` under 250 words — and that disagreement is exactly what licenses **a band with a distribution, never a number** rather than a new threshold to hit exactly.

**TOLKIEN — for parataxis, and against our use of it.** The Tolkien lane is the best-sourced account of the and-chain in the sweep (`tolkien:54` Turner, `tolkien:157` McIntosh, `tolkien:254` Shippey's "loose semantic fit", `tolkien:656`/`657` Kullmann & Siepmann, `tolkien:663` Bolding), and every source makes it a **marked** register — "stylistically marked, signalling something extraordinary", reserved for the Ride of the Rohirrim and the Pelennor, and split CULTURALLY between Rohirrim and Gondor. The ladder runs `", and"` at 0.715 and a three-part clause chain at 0.600. Tolkien is allocated here because he is the strongest evidence that we are using his marked device as wallpaper. `tolkien:404` (the Shire's offices described by what they actually do — the Shirriffs round up stray livestock) is allocated to the institution rule.

**WOLFE — for the office as an executor, and for the metronome comparison.** `wolfe:443` (Crampton): the torturers "are the executors of a sentence decided elsewhere" — the exact shape this register needs, an office described by the procedure that reaches it rather than by a summary of what it is. `wolfe:891` (Kim Stanley Robinson): reading Wolfe after uniformly paced fiction is "as on music after a metronome" — the register's condition named by a novelist. `wolfe:372` (Macdonald): the narration withholds screams and details of pain and keeps the fact — the discipline that lets a compromise be recorded without melodrama.

**LE GUIN — for the rhythm law and the absence form.** `leguin:264` (*Steering the Craft*): **"There is no optimum sentence length. The optimum is variety."** This is the one-line charter for §2's NPC-L3. `leguin:481` (*The Matter of Seggri*): the frame records a killing by "naming exactly what the record does not contain" — the model for §4's absence rule. `leguin:241`/`531` are the GUARD on the expletive rule: the passive is "one of the lovely versatile" tools, not a thing to purge.

**KAY — for the register contrast and the cost.** `kay:5` (Randall): Darien's death is short sentences, concrete description, matter-of-fact tone, against the high style elsewhere — the register tracks who is perceiving. `kay:244` (McBean): "Triumphs are provisional. Victories are costly." `kay:94` (Cawsey interview): the far-off emperor's death means less than the hired hand's broken leg — the scale at which a compromised office matters. `kay:128` (Psychopomp): revelation of character **through action**.

**MARTIN — for the narrator's stance and the repetition warning.** `martin:424` (Gauthier): a dry omniscient narrator gives basic reports of actions with **no personal thoughts or motives**. `martin:632` (Martin's own Windycon GoH speech): a writer who repeats himself too often is "on the road toward stagnation and self-parody" — the register's 546 singleton pools and six stage formulas, named by the author whose worst outcome they are.

**ai — the fault catalogue, as constraints only.** `ai:936` (§0c). `ai:73` (Bakhshi, measured: LLM tricolon 7.13 per document vs 3.73 for human experts). `ai:276` (Shao et al.: generated articles "connect separate facts into unverifiable relationships" — a failure distinct from hallucination; this is the Brackwater fault named in the literature). `ai:50`/`ai:76`/`ai:781–783`/`ai:536`/`ai:507`: no prompt, temperature or penalty restores diversity — if it is not pool structure it has not been transferred.

### Not allocated to this register, with the reason

- **The whole document-frame family (T1–T4, T7, T8, T51).** The ladder is not a document; it is one spoken sentence on a card. A per-line vantage, bibliography, palimpsest or run-in label would be fault 9 in its purest form (M 1's "same three-clause attribution paragraph pasted at the head of every dossier"). The frame is declared once, elsewhere, or not at all.
- **The chronicle family (T15 elegy, T34 compression-as-annal, T43 the backward gaze).** R6 records a STATE at a STAGE. It has no annal to compress and no outcome to look back from.
- **The Herald's formula licence (A′-R5).** The crier "may keep a formula" because it is a quoted in-world VOICE (R-DST-I). The ladder is not a quoted voice — dialogue share is 0.000 — so it inherits none of that permission. This is the single most important non-transfer for this register: the ladder's six stage formulas look like the crier's licensed frame and are not.
- **Chrome's mechanics (§6 of the fold).** Ruling (7): the archivist voice is never transplanted onto chrome, and the traffic does not run the other way either.

---

## 2. THE RULES

Ten rules. Each is imperative, register-bound, and carries its distinct-source count re-counted from the kept rows it cites (the same page twice is one source; relays collapsed onto the critic they relay). Where a figure is mine rather than PROBE's, it is marked *(measured at 29a4ff20d)*.

---

### NPC-L1 — THE STAGE MAY NOT CHOOSE THE JOINT

**Statement.** In this register the connective and the disclosure formula are chosen by what the line carries, never by its `lifecycleStage`; no stage may hold any single joint (semicolon · colon · comma-conjunction) above a ceiling, and no stage may sit at zero on two of the three.

**Sources: 7 distinct.** `ai:98` (Vollmer) · `ai:665` (Guo) · `ai:936` (Williams) · `ai:657` (nostalgebraist) · `ai:27` (O'Sullivan, HSSC 12) · `leguin:264` (Le Guin, *Steering the Craft*) · `kay:5` (Randall, *Canadian Literature* 129).
**Authors:** ai (as constraint) · Le Guin · Kay.

**Figure.** *(measured at 29a4ff20d)* re-adjudicated: semicolon **0/182**, colon **0/182**, `", and"` **182/182**. historicized: semicolon **180/184 (0.978)**, `", and"` 5/184. exposed-public: colon 0.43, semicolon 0.09. reformed: semicolon 0.88. The register-wide PROBE figures (semicolon 0.540, 4.15× the median; colon 0.138) are an average over six mutually exclusive regimes. **Direction: flatten the stage→joint correlation.** **Proposed SIZE:** no stage above **0.55** on any one joint (the register's own current semicolon rate, so no stage may be more joint-uniform than the register already is), and each stage at **≥ 0.10** on at least two of the three. The number that licenses it: 1.00 and 0.978 are the two observed maxima; 0.55 is the register's own mean behaviour and is therefore a floor of honesty, not an invented threshold.

**Fault as a template / the guard.** Fault 9 (fixed move order), 13 rows in the fold's check — the loudest fault in the catalogue. The trap in the cure is worse than the fault: a per-stage quota is a rota, and L 24's own warning (fold §4, T24) is that "vary the lengths as an alternation is a metronome at a longer period." **Guard:** the joint is picked by the SEEDED draw over the joints the line's own clause count admits — a two-part line cannot take a colon-plus-semicolon — never by a per-stage budget, and the walker measures the resulting distribution rather than enforcing a rota.

**Move-grammar.** A CONSTRAINT ON ORDER plus a licensing field: the joint is a typed MOVE whose licensing field is the **clause count the `causeClass` mechanism supplies**, never `lifecycleStage`. R-DST-B holds: the joint is structure, and structure is licensed by a standing configuration field.

**Obeys.** (1) allocated to Le Guin/Kay/ai on evidence, no weights. (2) the 7 sources are counted, not the authors' fame. (3) this IS the owner's directive applied to punctuation — six visible templates replaced by a seeded choice. (5) no new fact is introduced; only the joint moves. (6) B-CLAIM: punctuation is spendable, a claim is not. (7) no digits, no em dashes, no change to what is asserted.

**Test.** A new `check-pair.mjs` arm **STAGE-JOINT**, plus a standalone walker computing per-stage joint shares over the 14 files. ⚠ Prerequisite: `check-pair.mjs` loads only `src/data/dossierStateProse` + the causal pools (lines 16–31); its corpus loader must be extended to R6's leaf shape before any arm can run here. Acceptance: **U4** (count the SHAPE, not the phrase — a semicolon rewritten as a colon at the same position moves a column, not the failure), **U10** (evaluated against the pool's other variants at edit time), **U2** (the two-sentence ceiling is not breached to buy a joint).

**Strength: STRONG. Changes a shipped surface: yes** — owner-signed.

---

### NPC-L2 — THE THREE-PART CHAIN IS A MARKED DEVICE, NOT THE SPINE

**Statement.** In this register a three-clause chain is reserved for the line that has three things to say; it is never the default arc. The chain's length follows how many things happened, and a chain is admitted at most once per pool.

**Sources: 8 distinct.** Turner (`tolkien:54`, `tolkien:158`, `tolkien:323` — relays collapsed) · Shippey (`tolkien:254`) · Kullmann & Siepmann (`tolkien:55`, `656`, `657`) · McIntosh (`tolkien:157`) · Halbrooks (`tolkien:295`) · Bolding (`tolkien:663`) · Töyrylä (`kay:49`) · Bakhshi (`ai:73`). A ninth document, `ai:229` (Wikipedia, *Rule of three*), is cited for the GUARD and not counted.
**Authors:** Tolkien (primary) · Kay · ai.

**Figure.** *(measured at 29a4ff20d)* **clause-chain arity 3 in 998 of 1,662 lines (0.600)**; `", and"` in 1,202 of 1,680 (0.715). **This instrument does not exist in PROBE_ALL** — its `triad-list rate` (R6 0.055, 2.04× the median) counts NOUN triads and reads the register as almost clean. The clause chain is the register's largest structural tell and has never been measured. **Direction: down.** **Proposed SIZE:** arity-3 share **0.600 → ≤ 0.25**, with arity-2 and arity-4-or-more each at **≥ 0.15**; `", and"` line share **0.715 → ≤ 0.40**. The numbers that license it: `ai:73`'s measured human-expert tricolon rate is **3.73 per document against the LLM's 7.13** — a ratio of 0.523, and 0.600 × 0.523 ≈ 0.31; K 25's own bound ("two items or four-or-more, never three") argues lower; 0.25 is the stricter of the two and is offered as *test this, don't trust it*.

**Fault as a template / the guard.** Fault 4 (the rule of three, 6 rows) and fault 5 (the metronome). The over-correction is the danger: `ai:229` establishes the tricolon as a **canonical human device** — Caesar, Lincoln, the fairy tales — so a ban produces the arity-2 metronome instead. **Guard:** chain length is irregular and driven by how many things happened (T A4, `tolkien:54`); the chain is CULTURALLY split, not authorially applied (`tolkien:663`, Rohirrim vs Gondor) — here the split is by `causeClass`, so a chained pool and an unchained pool are different mechanisms, not different moods; and Kay's limb (`kay:49`) reserves the polysyndetic chain for loss.

**Move-grammar.** A MOVE with an order constraint: `[mechanism] → [what the office does] → [what the town has now]` is one grammar among a closed set, not the grammar. The licensing field is `causeClass` — a mechanism with two consequences gets two clauses.

**Obeys.** (1) Tolkien is allocated here on 6 collapsed sources, against a proposal that gave him nothing in this register. (2) the standing is 8 sources, not Tolkien's fame. (3) the closed set gains members; the claim never varies. (6) B-CLAIM: word order is spendable. (7) no digits; nothing rises in register.

**Test.** A walker arm **CHAIN-ARITY** over the 14 files reporting the arity histogram per `causeClass` and per stage; a `check-pair.mjs` arm refusing a rewrite that RAISES arity. Acceptance: **U2** (a chain may not be broken into three sentences to lower arity — the two-sentence ceiling is hard), **U4** (arity 3 → arity 2 that keeps the same three claims in two clauses has moved a column, not the failure), **U11** (no count or duration word is added to fill a fourth clause).

**Strength: STRONG. Changes a shipped surface: yes** — owner-signed.

---

### NPC-L3 — THE SHORT LINE EXISTS

**Statement.** This register carries short lines. A line whose load is one fact is written at the length of one fact, and no stage is written at a single length.

**Sources: 14 distinct.** Le Guin (`leguin:264`) · Dyson Logos (`dnd:94`) · Merwin (`dnd:97`) · Revivify Games (`dnd:98`) · Sly Flourish (`dnd:99`) · Dungeon Master's Workshop (`dnd:100`) · Hoffman/Crook DC Adventure Format (`dnd:314`) · Paizo/Dungeon (`dnd:12`) · Bryce Lynch (`dnd:103`) · Kullmann & Siepmann (`tolkien:656`) · Randall (`kay:5`) · Kim Stanley Robinson (`wolfe:891`) · Williams (`ai:936`) · Vollmer (`ai:98`). Guo (`ai:665`) and nostalgebraist (`ai:657`) corroborate and are not double-counted against `ai:936`'s claim.
**Authors:** Le Guin (the charter) · D&D (the band) · Tolkien · Kay · Wolfe · ai.

**Figure.** *(measured at 29a4ff20d)* under-8 segments **13 of 1,713 (0.0076)**; p10 **19**; min 1, max 39; sd **4.0**. PROBE: 0.01× the corpus median of 0.46 [R-15]; sd 4.0 against an exemplar band of **8.5 – 16.0** and against `martin-chronicle`'s under-8 floor of **0.029**, the lowest of fourteen exemplar columns. **Direction: up, on variance first.** **Proposed SIZE:** under-8 share **0.0076 → 0.06 – 0.10**; sd **4.0 → 6.5 – 8.0**. The numbers that license them: 0.029 is the lowest under-8 share any exemplar sustains, so anything at or under it is not defensible as "a house voice"; 0.06 is twice that floor and still a quarter of `leguin-fiction`'s 0.241, keeping the register recognisably a record. For sd, **the estate's own arrival tables reach sd 8.1** (own row 8; A′-R14 "the model for R1's short end") — an internal, already-shipping proof that this house voice can hold that spread, so 6.5–8.0 is an achieved figure, not an aspiration. **The mean is NOT moved** (see §5 C6).

**Fault as a template / the guard.** Fault 5 (the metronome) and fault 10 (sameness). The cure's own trap is named by the same lane: `ai:103` — "short punchy standalone fragments used for manufactured emphasis" is its own tell, and `ai:572`/`ai:536` show that a diversity knob costs coherence. **Guard:** length follows LOAD (`leguin:264`; fold §4 T24: "never alternate by rota"); the short line carries a NEW FACT, never a verdict (T A5); and the shortest line lands at the highest impact rather than at a fixed position (`kay:5` — "Sentences are short, description is concrete" is a register contrast bound to who is perceiving).

**Move-grammar.** A licensing field, not a move: the `causeClass` mechanism phrase is one fact; a line that carries only it is licensed to be short. R-DST-B holds — a short line asserts less, never more.

**Obeys.** (1) the D&D lane is allocated because this register is spoken, evidenced at 99 read-aloud rows against 0 in Hobb and Martin. (2) 14 sources. (3) variance is the mechanism by which no order becomes visible. (4) length is HOW an element is written, never WHICH gets written — D N6's size-to-purpose is refused and does not enter. (6) B-CLAIM: shortening may not spend a claim; the checker's `LONGER` and R4 arms both fire. (7) no digits appear in a shortened line.

**Test.** A fingerprint delta: re-run `fingerprint.mjs` over the reconstructed R6 and require sd ≥ 6.5 and under-8 ≥ 0.06 with the same-seed pick set unchanged. `check-pair.mjs` arms already present: `THREE+ SENTENCES`, `LONGER`, `R4`, `A11 SPREAD`. Acceptance: **U2** (never three sentences), **U5** (a shortened line must still close on a checkable thing — R6/B0.3 was "cited eight times and delivered once"), **U3** (no rationed word added to pad a short line into a chain).

**Strength: STRONG. Changes a shipped surface: yes** — owner-signed.

---

### NPC-L4 — THE EXISTENTIAL DISCLOSURE OPENER IS RATIONED, AND THE COPULA IS KEPT

**Statement.** "It is / There is / It was / There are" opens this register rarely and never as a stage's signature. Strike the expletive; keep the plain copula.

**Sources: 6 distinct.** Robin D. Laws / Pelgrane (`dnd:112`) · Dragon Writers' Guidelines (`dnd:183`) · Ronny's 5E Writer's Guide (`dnd:998`) · WotC Ravenloft guidance (`dnd:907`) · the SRD 5.1 finder measurement (`dnd:1011`) · Le Guin quoting *Steering the Craft* (`leguin:241`, `leguin:531` — one hand, one source, and it is the GUARD).
**Authors:** D&D (primary) · Le Guin (the guard).

**Figure.** PROBE_ALL §6: **"There/It is" opener rate 0.110 against a corpus median 0.006 — 18.3×, the single largest outlier in the estate.** *(measured at 29a4ff20d)*: 184 of 1,680 lines open with it; **143 are "It is public", 34 are "It is out", and 177 of the 184 sit inside one stage.** **Direction: down, and spread.** **Proposed SIZE:** register-wide **0.110 → ≤ 0.035**, and **≤ 0.20 within any single stage**. The numbers that license them: the exemplar band runs 0.0016 (`dnd-flavor`) to 0.0556 (`leguin-fiction`), and the estate's own dossier-state sits at 0.0515 — so 0.035 is inside the exemplar band and below our own worst diegetic register, while remaining above `dnd-rules`'s 0.0027, which would be a purge.

**Fault as a template / the guard.** Faults 9, 14 and 19. The over-correction is the whole risk: **`dnd:1011` measures the SRD at is/are 24.84 per thousand words against was/were 0.65** — a rules register that is overwhelmingly copular and reads as plain, not as machine-avoidance. **Guard:** D 9's own limb — "the mill grinds" written for every "the mill is" reads as machine-avoidance; `leguin:241` — the passive is "one of the lovely versatile" tools where it belongs; and `leguin:484`/`490` show a civic record legitimately reporting in the agentless passive. **Only the expletive `There/It + BE` in OPENING position is rationed**; nothing else about the copula moves.

**Move-grammar.** The existential disclosure is one MOVE in the closed opening set (§NPC-L9), and its licensing field is `lifecycleStage = exposed-public` — but a licence is not a mandate, and a move that fires on 0.476 of its licensed lines is a template.

**Obeys.** (1) D&D allocated on a present-tense/active-voice body of 6 sources; Le Guin allocated as the guard against over-correction. (2) counted, not famous. (3) removing a stage's signature opener is precisely "the move ORDER varies by a seeded choice." (5) an expletive carries no fact, so nothing is bought or lost. (6) B-CLAIM: word order is spendable. (7) present tense and the record register are unchanged.

**Test.** `check-pair.mjs` already carries **`EXISTENTIAL OPENER ADDED`** (line 127) — the arm exists and needs only the R6 corpus loader. A fingerprint delta on `shapes.thereIsOpenerRate`. Acceptance: **U6** (the STATE comes first — a rewritten opener may not front the cause to escape the expletive), **U5** (the rewritten line still lands on a checkable thing), **U9** (a "That is / This is" replacement that carries the pool key's discriminating claim is not a gloss and is not cut).

**Strength: MODERATE** — 6 sources, but the positive form ("what to open with instead") is deferred to NPC-L9 and to §7.Q3. **Changes a shipped surface: yes** — owner-signed.

---

### NPC-L5 — NO SENTENCE NAMES AN OFFICE THE KEY DOES NOT CARRY

**Statement.** A line in this register may name only the bearer's own role noun and the institution its `causeClass` mechanism actually carries. Any other office — a guild, a council, an auditor, a magistrate, a census, a tithe — is written only where a typed INSTITUTION TABLE says the settlement has one, and never as a kicker.

**Sources: 7 distinct.** Wikipedia *The Shire* (`tolkien:404`) · Crampton / Ultan's Library (`wolfe:443`) · Hobb, Finncon 5000 Words (`hobb:466`) · Orr, *NYT* (`martin:711`) · Shao et al. (`ai:276`) · Wikipedia *Large language models* (`ai:259`) · Denyse Allen (`ai:333`, `ai:334`).
**Authors:** Tolkien · Wolfe · Hobb · Martin · ai (as constraint).

**Figure.** *(measured at 29a4ff20d)* **90 of 1,662 lines (0.054)** name an institution outside the vocabulary of their own line's `causeClass`: guild 18 · council 12 · tithe 11 · magistrate(s) 11 · auditor(s) 10 · court 7 · creditor(s) 6 · roll 5 · census 5 · inspector(s) 5 · duty sergeant 1. The conjunction key holds `{role, situation, causeClass, lifecycleStage, ageBand}` and **no institution field, no relation field, no exemption field**. ⚠ **This figure is an UPPER BOUND** produced by my own licensing regex; some hits are false positives (a muster *roll* under `garrison-drained` is arguably the mechanism's own noun). **Direction: to 0 for the genuinely unlicensed subset.** **Proposed SIZE:** after adjudication, the unlicensed residue goes to **0**; the licensed residue is re-anchored to a typed field. The number that licenses it: there is no rate at which an unheld fact is acceptable — this is the Brackwater lesson, and the ratio is not a dial.

**Fault as a template / the guard.** `ai:276` names the exact failure: generated prose "connects separate facts into unverifiable relationships (red-herring / overspeculation), a failure **distinct from outright hallucination**." That is the Brackwater sentence — the bailiff who counts and the priest who is not counted — and it is why this rule is not satisfied by a fact-checker. Fault 24's inverse (a FACT where the world holds a gap). **Guard:** the office is described by what it actually DOES (`tolkien:404` — the Shirriffs' chief duty is rounding up stray livestock) and by the procedure that reaches it (`wolfe:443` — the executors of a sentence decided elsewhere), so an institution enters as a duty performed, never as a summary paragraph (W 24's fault). The roll stays **rare and sometimes incomplete** (H 20); a bare enumeration is licensed only where the world enumerates (`hobb:466`).

**Move-grammar.** A LICENSING FIELD, and the one this reconciliation asks the owner to build. R-DST-B in its sharpest form: an institution is a standing configuration fact and licenses a STRUCTURAL clause; the moment a line says the guild *did* something it needs event provenance the key does not carry. **The owed consequence of ruling (5):** an institution table typed as `{settlement, office, holder-role, what it does, who it counts, who is exempt}`, with the ladder permitted to name only offices the table returns for that settlement.

**Obeys.** (1) four authors allocated because each supplies a different half — Tolkien the duty, Wolfe the procedure, Hobb the enumeration bound, Martin the consequence (`martin:711` "when kingdoms ignore debts, the bankers show up" is an institution arriving because a typed fact obliged it). (2) 7 sources. (4) an institution the world has no fact for is an honest absence, never a manufactured detail. (5) this rule IS ruling (5), stated for this register. (6) B-CLAIM: removing an unlicensed office removes a claim the world never held, which is the one removal the rule requires. (7) FINITE SEMANTICS — the clerk may only fill from a typed bucket; DEITY DOCTRINE — a tithe or a temple office is culture, and its theology is never asserted.

**Test.** Two instruments. (a) A **SAME-ENTRY CONTRADICTION WALKER** (ruling 5's second owed consequence): for every line, resolve its `{role, causeClass, stage}` and refuse any office noun not returned by the institution table for that key, and refuse any line whose facts contradict a sibling variant of the same pool. (b) A per-line adjudication pass over the 90 by a skeptic, producing the true count before any byte moves. Acceptance: **U12** (R-DST-B — an unlicensed office is the same class of breach as "the town is arranged around it"), **U9** (an institution clause that IS the pool key's discriminating claim is not cut), **U1** (the sibling-key test runs before the cut, not after).

**Strength: STRONG. Changes a shipped surface: yes** — owner-signed, and gated behind the institution table's existence.

---

### NPC-L6 — THE PERSON IS AN OFFICE AND A DEED; THE INTERIOR IS NOT A FIELD

**Statement.** This register records what an office-holder did and what it costs the town. It does not record what the bearer wants, fears, believes, regrets or is ashamed of. "The town knows" is licensed by the stage; "the priest believes" is licensed by nothing.

**Sources: 7 distinct.** Gauthier, *The Cosmic Circus* (`martin:424`) · Psychopomp interview (`kay:128`) · Kay, Ethical Society address (`kay:720`) · Abalieno (`hobb:278`) · Shippey (`tolkien:479`) · Macdonald (`wolfe:372`) · Kullmann & Siepmann (`tolkien:647`). Reinforced by `FIVE_AUTHOR_CHECK.md` C14, where "what it meant" is CONTRADICTED for a record register by five further independent documents.
**Authors:** Martin · Kay · Hobb · Tolkien · Wolfe.

**Figure.** *(measured at 29a4ff20d)* 112 of 1,662 lines (0.067) carry an interior predicate; **36 of them are "the town knows / is learning"**, which is the `exposed-public` stage's own definition and stays. The residue attributed to the BEARER is ~76 lines (**0.046**): fear 25 · want 15 · believe 7 · shame 6 · loyalty 5 · appetite 3 · conviction 2 · guilt 1. **Direction: bearer-interior to 0; the town's knowing kept.** **Proposed SIZE:** 0.046 → **0.000** for the bearer. The number that licenses it: the key holds no motive field at all, so the licensed rate is exactly zero — this is not a ration.

**Fault as a template / the guard.** Fault 1 in its cruellest form (W 15's flat deed followed by "it was terrible") and fault 9 (a fixed motive slot in every entry). **Guard:** the technique IS the missing second sentence (W 2); some office-holders are recorded by an office alone, with no deed at all (K 37); the reaction is an ACT, never a feeling (H 24); and the over-correction — a register with no people in it — is guarded by `kay:128` (revelation of character **through action**) and `hobb:278` (dramatic events rendered without melodrama, which is a positive craft, not an absence).

**Move-grammar.** A licensing field with an empty domain. R-DST-B: no field on the key carries motive, so no clause may assert it. **R-DST-B's state-never-fate limb also binds:** the bearer's compromise is a STATE at a stage, never a trajectory.

**Obeys.** (1) five authors allocated, each supplying an independent form of the same prohibition. (2) 7 sources plus C14's five. (3) removing the motive clause removes a slot that was appearing at a fixed position. (4) the interior is a slot the world has no fact for, and this register's answer is OMIT (see §4). (5) a motive is the purest case of a sentence buying an effect with a fact. (7) **THE PROMISE and PRODUCT SCOPE** — measured: capitalised mid-sentence tokens **0**, second person **0**, so no named character and no reader-addressed fate exists here today, and this rule is the ratchet that keeps it so. Hobb's "what it meant" (C14) and "what they kept" (C15) do not ride along.

**Test.** A **MENTAL-PREDICATE WALKER** over the 14 files, keyed on grammatical subject: a mental predicate whose subject is `the town` / `the crews` / a collective passes; one whose subject is the bearer's role noun fails. This is an inventory ratchet (only-shrinks) so a future authoring pass cannot reintroduce the class. `check-pair.mjs` arms: `FUTURE INDICATIVE ADDED (STATE never FATE)` (line 123). Acceptance: **U12** (the field-licence test), **U5** (the line still closes on a checkable thing after the motive clause goes), **U3** (no rationed word is added in its place).

**Strength: STRONG. Changes a shipped surface: yes** — owner-signed.

---

### NPC-L7 — A POOL OF ONE IS NOT A POOL, AND THIS REGISTER CANNOT MINT A KEY

**Statement.** Record, do not silently carry, that half this register's pools offer the seed nothing to choose — and record that A7's stated cure is unavailable here, so growing a pool requires an owner-gated one-time re-draw or nothing changes.

**Sources: 7 distinct.** DK & Hatzel (`ai:50`) · Wenger & Kenett, PNAS (`ai:76`) · Yun et al., UCSD (`ai:781`, `ai:782`, `ai:783`) · Moon, Green & Kushlev (`ai:536`) · Dugan et al. (`ai:507`) · Kirk et al. (`ai:740`) · Martin, Windycon GoH speech (`martin:632`).
**Authors:** ai (as constraint) · Martin.

**Figure.** *(measured at 29a4ff20d)* **546 of 1,110 pools are singletons (0.492)**. Three of six lifecycle stages are singleton by construction: **re-caused 182 pools / 182 lines · historicized 183 / 184 · re-adjudicated 182 / 182** — **548 lines (0.330 of the register)** where every NPC in every town at that key sees the identical sentence. PROBE's own row 45 records R6 mean pool size **2.0 against derived floors of 8 / 6 / 4**. **Direction: up.** **Proposed SIZE: none set — this is a schedule question, not a dial.**

**The register-specific finding.** `EXEMPLAR-BEST-PARTS` §7.Q23 proposes the cure as "a chair act minting new pool keys." **That act is not available in R6.** The key is the closed cross-product `{role × causeClass × lifecycleStage}` derived from the worldPulse stamp by `normalizeKey`; `conjunctionVariantsFor` addresses only those keys, so an authored key nothing stamps would never be read. The only lawful growth is APPENDING to an existing pool — which A7 forbids, and which the standing hazard *a pool's length is a seed input* prices exactly: appending one variant to a pool of two moves the pick for roughly a third of that key's bearers, and to a pool of one for half. There is no free route.

**Fault as a template / the guard.** Fault 10 (sameness) and fault 17 (the loop). `martin:632` names the destination: "on the road toward stagnation and self-parody." **Guard:** `ai:50`, `ai:76`, `ai:781–783`, `ai:536` and `ai:507` between them establish that **no prompt, temperature, penalty or model swap restores diversity** — the fold's closing note is exact: "if it cannot be expressed as pool structure, it has not been transferred." So nothing at render time may be offered as this problem's answer.

**Move-grammar.** None directly; it is the precondition for every seeded-variation rule above. A seeded choice over a set of one is not a choice, so NPC-L1, L2 and L9 cannot show variation on 33% of this register until this is settled.

**Obeys.** (2) the standing is 7 sources. (3) B-GRAMMAR is unimplementable on a singleton pool, so this is the directive's blocking dependency. (7) THE PROMISE — a re-draw changes which sentence an ALREADY-INSTALLED world shows for an already-lived compromise, which is why it is owner-gated and cannot be decided here.

**Test.** A **POOL-FLOOR RATCHET**: an only-shrinks test asserting the count of singleton pools per stage never rises, run now to pin the 546 before anything moves. Then, if and only if the owner buys the re-draw, a same-seed diff over a fixed NPC roster reporting exactly how many bearers change line. Acceptance: **U10** (R5/A11 evaluated against the pool's other variants — with one variant there is nothing to evaluate, which is the finding), **U2** (a new variant is one or two sentences).

**Strength: STRONG. Changes a shipped surface: yes — and it is OWNER-GATED**, not merely owner-signed: it is a one-time same-seed display re-draw on installed worlds.

---

### NPC-L8 — THE SPOKEN LINE STOPS AT THE REACTION POINT, AND ITS LENGTH IS A BAND, NOT A TIER

**Statement.** Length in this register is a distribution, never a number and never a function of the rung a line was authored at. A line stops where the DM would stop and the table would answer.

**Sources: 9 distinct.** Justin Alexander (`dnd:660`) · Hoffman & Crook, DC Adventure Format (`dnd:314`) · Dyson Logos (`dnd:94`) · Shawn Merwin (`dnd:97`, `dnd:118`) · Revivify Games (`dnd:98`) · Sly Flourish (`dnd:99`) · Dungeon Master's Workshop (`dnd:100`) · Paizo/Dungeon (`dnd:12`) · Bryce Lynch (`dnd:103`).
**Authors:** D&D, sole — and its internal DISAGREEMENT is the evidence.

**Figure.** *(measured at 29a4ff20d)* the FULL rung's 24 lines run **31 – 41 words with zero under 31**; the role rung means 22.9 and the class rung 21.7. The `attributed` stage means **27.0 (max 39)**. **So the register pays for drama in length, at both the tier and the stage level.** **Direction: decouple length from rung and from stage.** **Proposed SIZE:** the FULL rung's floor from **31 → the register's own p10 of 19 or below**, and the register's maximum from **41 → ≤ 34**. The numbers that license them: the lane's own bounds are two sentences (`dnd:94`), one or two brief sentences (`dnd:314`), three lines never five (`dnd:98`), four sentences under 100 words (`dnd:97`) and under 250 words (`dnd:99`) — a spread of more than an order of magnitude, which is why **a band and not a number**; 34 is our own p90 (28) plus one sd (4 → 6.5 after NPC-L3), which keeps the long tail without the 41-word line.

**Fault as a template / the guard.** Fault 5. `dnd:94`'s finding is behavioural, not aesthetic: "you get two sentences. Period" before players stack dice; `dnd:103` reports the failure state — the players are on their phones. **Guard:** the reaction point is a PLACE in the description past which the world must not move without the players (`dnd:660`), so the stop is chosen by content, not counted; the band has a distribution (D 40); and `dnd:118`'s test is the ear, not the ruler — read it aloud.

**Move-grammar.** An order constraint: the last move in any grammar is the one the table can answer, so a line may not end on a move that only sets up another. The licensing field is `lifecycleStage` for WHAT is disclosed and never for HOW LONG.

**Obeys.** (1) D&D is allocated alone here, on a body of 99 read-aloud rows, because this register is spoken — Hobb and Martin carry zero rows on it. (2) 9 sources; their disagreement is carried, not averaged. (3) a fixed length per rung is a visible template. (4) **D N6's size-to-purpose-in-play is REFUSED as a rule about which elements get written**; it enters only as HOW a line is written. (6) B-CLAIM: a shortened line keeps its claim, its modality and its threat class. (7) read-aloud is the register's own law and nothing rises.

**Test.** A **TIER-LENGTH walker** reporting the length distribution per rung and per stage, requiring the rung distributions to overlap. A fingerprint delta on `wordsPerSentence.p90` and `shareOver30`. Acceptance: **U2** (never more than two sentences, whatever the rung), **U5** (the new close is a checkable thing), **U7** (a `[threshold]`-shaped edge stays subjunctive when a long line is cut).

**Strength: STRONG. Changes a shipped surface: yes** — owner-signed.

---

### NPC-L9 — THE OPENING MOVE IS A SEEDED CHOICE FROM A CLOSED SET, AND THE POOL ALREADY PROVES IT

**Statement.** No single opening move may hold this register. The move is drawn by seed from the closed set, and the pool-level spread the register already achieves is extended to the register level.

**Sources: 4 distinct**, plus the owner's ruling as the governing instrument. Kay, Ysabel journal (`kay:680` / `kay:976` — one hand, one source: punctuation varied by context, speaker and rhythms) · Le Guin (`leguin:264`) · Randall (`kay:5`) · Vollmer (`ai:98`). Membership of the closed set is **§7.Q3, the owner's**, and is not decided here.
**Authors:** Kay · Le Guin · ai.

**Figure.** *(measured at 29a4ff20d)* seven opening moves: the-noun-other **790 (0.475)** · state-copula 312 (0.188) · subordinate-circumstance 228 (0.137) · existential-disclosure 184 (0.111) · other 80 · wh-nominal 40 · indefinite-noun 28. First word `the` in **1,111 of 1,680 (0.661)**. Fingerprint `sameOpenerAsPreviousRate` **0.344** against an exemplar band of 0.033 – 0.167. **But:** within a pool, only **34 of 558** multi-variant pools (0.061) give every variant the same move, and **exactly one pool of 564 shares a two-word opener** (PROBE: 0.002, the estate's BEST figure on that metric — R1 sits at 79 of 708). **Direction: the register-level monopoly down; the pool-level spread untouched.** **Proposed SIZE:** no single opening move above **0.30** (from 0.475), every member of the set at **≥ 0.05**; `sameOpenerAsPreviousRate` **0.344 → ≤ 0.20**. The numbers that license them: 0.167 is the exemplar band's top (`leguin-fiction`), and 0.20 is one notch above it — chosen deliberately not to hit a threshold exactly (K 44).

**Fault as a template / the guard.** Fault 9. The trap is that a ceiling becomes a quota and the moves cycle. **Guard:** the move is chosen by a SEEDED draw whose input is the key, so two pools with the same shape do not alternate; and **the register's own pool-level behaviour is the working proof**, so the cure is to extend a mechanism that already works rather than import one.

**Move-grammar.** This is the grammar rule proper: the opening move is the first typed MOVE, the set is closed, the draw is seeded, and the walker refuses any single order above the ceiling and any same-order-as-previous run (B-GRAMMAR, verbatim). **Membership is deferred to §7.Q3** — this rule sets the ceiling only.

**Obeys.** (1) Kay and Le Guin allocated for the mechanism (punctuation and length varied by context and speaker), not for a voice. (3) this IS the owner's directive, and its verbatim warning — "Present state. Historical sentence. Official account. …over and over" — is the 0.475 figure. (6) B-GRAMMAR's own acceptance bar: the taste sample must show one block in two grammars.

**Test.** The **B-GRAMMAR WALKER**: per-move share, same-move-as-previous run length, and a refusal above the ceiling. A fingerprint delta on `openers.sameOpenerAsPreviousRate`. Acceptance: **U10** (R5 evaluated against the pool's other variants at edit time — the arm `A11 SHARED OPENER CREATED` at `check-pair.mjs:120` already exists), **U6** (the STATE stays first — a new opening move may not front the cause), **U1** (a moved opener may not drop a word naming a sibling key).

**Strength: MODERATE** — 4 sources for the mechanism, and the closed set's membership is owner-gated. **Changes a shipped surface: yes** — owner-signed.

---

### NPC-L10 — THE MODALITY IS ADJUDICATED, NOT SPENT

**Statement.** Adjudicate the sixteen lines carrying `will`/`shall` one by one before any of them is touched: a habitual or generic `will` is a standing fact; a bare future indicative about the bearer or the town is a FATE breach.

**Sources: 3 distinct.** Robin D. Laws / Pelgrane (`dnd:112`) · Ronny's 5E Writer's Guide (`dnd:998`) · Dragon Writers' Guidelines (`dnd:183`).
**Authors:** D&D.

**Figure.** *(measured at 29a4ff20d)* `will`/`shall` in **16 lines**; `would`/`could`/`might` in **35**. Examples that must split in adjudication: *"The tainted priests will consecrate anything for the right fee"* (habitual, a standing fact) against *"There is an investigation the watch will never open"* (a standing negative, not a forecast). **Direction: adjudicate, then zero the forecasts only.** **Proposed SIZE: none — 16 lines is a per-line question, and a rate would be a licence to leave some.**

**Fault as a template / the guard.** Fault 7 (forced closure) and the register-costume form K 6 names — *"it would later be said…"* is the metronome in period dress. **Guard:** `dnd:112`'s cure is the present indicative in hypotheticals ("Keletny burns the car"), not a modal purge; the subjunctive is the corpus's own device for an edge (A2's `[threshold]`), and `check-pair.mjs:124` already fires on `SUBJUNCTIVE "would" REMOVED` precisely because the last reconstruction deleted one (refuter U7, item #19).

**Move-grammar.** A licensing field: `lifecycleStage` describes where a compromise STANDS. There is no field carrying what happens next, so no move may forecast.

**Obeys.** (2) 3 sources, graded honestly. (5) a forecast is the clearest case of a sentence asserting what no field holds. (6) B-CLAIM: **a modality may not be spent** — this is the rule's whole content. (7) PRODUCT SCOPE and THE PROMISE: never a named character's fate, and no sentence that predicts one.

**Test.** `check-pair.mjs` arms **`FUTURE INDICATIVE ADDED (STATE never FATE)`** (line 123) and **`SUBJUNCTIVE "would" REMOVED`** (line 124), both already written. A skeptic adjudication of the 16 before any edit. Acceptance: **U7**, verbatim — it is the U that invented this arm.

**Strength: SINGLE-to-MODERATE** (3 sources, one lane). **Changes a shipped surface: yes, if any line moves** — owner-signed.

---

## 3. TECHNIQUES ADMIRED AND REFUSED FOR THIS REGISTER

| technique | why it is refused HERE |
|---|---|
| **T1 the compiled record with a declared vantage** (W 17 S13, T F1 S9, and five more) | The ladder is one spoken sentence on a card, not a document. A per-line frame is fault 9 in its named form (M 1: "the same three-clause attribution paragraph pasted at the head of every dossier"). The vantage is declared once elsewhere or not at all (D 4). |
| **T2 the apparatus declares its own limits** (T F2 S5, H 19 S5, L 4 S3, D 23 S4) | The ladder's rung IS its declared limit, structurally (§4). A textual gap line repeated across a stage becomes H 19's "metronome of lacunae" instantly — this register has only six stages and 1,662 lines. |
| **T15 elegy as a standing fact** (K 17 S6, T H1 S6, L 47 S8) | K 17 names the valedictory close "the single most recognisable AI paragraph ending". The register's closers already land on a noun or a thing in 0.797 of lines; an elegy would import fault 6 into the one place it is absent. |
| **T43 the backward gaze / prolepsis** (K 6 S3; §3.2 OPEN for the chronicle) | Settled here by THE PROMISE and PRODUCT SCOPE: the ladder states a STATE at a STAGE; a told outcome makes a bearer's fate. Kay's own not-transferable list bars it from the record. |
| **T6 the compiler shows through / the dry aside** (M 5 S5, L 42 S4, T F6 M2) | §3.6 is OPEN and §7.Q12 is the owner's. Independently: this register has no compiler. The line is a receipt a DM speaks, and an aside inside it becomes a persona (W's not-transferable 12, "very mannered and arch"). |
| **T20 register by standing, with an untagged quoted voice** (T C1 S9, W 20 S7, D 5 S5) | Dialogue share **0.000** measured. Conflict 3.1 is SETTLED: no dialogue technique from any exemplar transfers to a record register. The crier's quoted-voice licence (R-DST-I) does not extend here. |
| **T37 negative narration / H 18's rhythm of buts** (H 5 1, H 18 1, L 18 M2) | Antithesis shape here is **0.007**, the lowest of any estate register and below the whole exemplar band. Importing a first-half negation would MANUFACTURE the exact fault (fault 3, 7 documents) the dossier is being cured of. §3.18's direction is settled; the rate for R6 is zero. |
| **T27 the figure policy beyond the literal** (K 21 S3, L 28 S6) | The Brackwater lesson generalises: a figure that implies a fact asserts it. With no institution table, a metaphor about counting, tithing or weighing is an unlicensed claim wearing a vehicle. K 21's own bound (no extended metaphor) is the floor, not the ceiling, here. |
| **T38 counts as words, time by reign, the dated census** (K 22 S5, D 31 S6, M 14 M2) | Measured: **digits 0, count words 0, duration bands 0**. A4 binds; the key carries no count and only the FLOOR reads `ageBand`. A worded count here would need a field that does not exist. |
| **T7 the palimpsest** (K 36 S4, W 23 S6, D 44 S5) | No provenance field beyond `ageBand`, which the role and class rungs never read. "What stood before" is exactly `historicized`'s job and is already a stage, not a device. |
| **Hobb's "what it meant"** (H1's third limb) | **CONTRADICTED** for a record register by five independent documents (`FIVE_AUTHOR_CHECK.md` C14); the verified carriers point to meaning by OMISSION instead. |
| **Hobb's "what they kept"** (H1's fourth limb) | Refused on one off-shape hit in 363 rows; the row of that shape was struck at r7 (C15). Revival is owner-gated on the triage re-key. |
| **D&D's second person / "as you approach"** (D 5's inverse; `dnd:104`, `dnd:107`) | Measured second person **0**. `dnd:104` is the lane's own cure ("Move from the second-person point of view to the third person"); `dnd:107` bars predicting the party's future. We hold it at zero and this rule is the ratchet. |
| **Wolfe's lying narrator** (W 13b M2; W 14 1 the escape valve) | Settled as a product law (§3.14): the dossier is the ground truth the game state reconciles against. W 14's escape valve is a QUOTED voice, and this register has none. |
| **D N6 description sized by purpose in play** | **Refused by the owner, 09-07 01:20.** It enters only as HOW a line is written (NPC-L8), never as which conjunctions get authored or how much each gets. |

---

## 4. THE ABSENCE RULE FOR THIS REGISTER

**Ruling: in the NPC cause-conjunction ladder an empty slot is OMITTED, and the absence is carried STRUCTURALLY by the rung the ladder falls to — never written as a sentence saying nothing is known.**

**Why this and not the honest-absence line.** Ruling (4) requires every dossier element to get the full FORM, and distinguishes full form from full content: a slot the world has no fact for is an honest absence, never a manufactured detail, and *which* of omission or "no entry" applies is a register decision. This register has **no slots**. A line is one sentence, not a form with fields; there is nothing to write "no entry" into. What it has instead is a **four-rung fallback whose entire declared purpose is that no surface renders empty** (`causeLifecycleVocabulary.js` header: "THIS file is the generic FLOOR so no surface ever renders empty").

So the full form is always delivered — every conjunction key resolves to a line — and the honest absence is **that the line becomes less specific, never that it becomes more specific about less**:

- **full rung** — the world holds a role, a situation, a cause and a stage that were all worth hand-authoring together.
- **role rung** — the situation is not distinctive; the line is written from role × cause × stage.
- **class rung** — the role is not known or not built; the line is role-agnostic and the `{role}` slot is filled by lookup.
- **floor** — the cause and the stage alone, in a generic template, with the age band read.

**The rule this reconciliation states, and the live breach it names.** *A lower rung may never carry a fact a higher rung would have needed a field for.* The 90 unlicensed-institution lines of NPC-L5 are exactly this breach: the class rung (126 role-agnostic lines) and the role rung name guilds, councils, auditors and censuses that no rung's key holds. **The ladder is inventing where it should be generalising** — descending a rung is supposed to REMOVE specificity, and today it sometimes adds it.

**And the second half, which is a prohibition.** An absence in this register is never written as prose. "The reason is not recorded", "the record does not say", "how it began is unknown" — none of these may be authored, because with six stages and one sentence apiece a gap line becomes D 23's repetition-across-a-dossier and H 19's "metronome of lacunae" within four NPCs. `leguin:481` is the model that is admitted and the one that is not: the Seggri frame records a killing "by naming exactly what the record does not contain", which works because it happens **once in a long document**. This register has no long document to hide it in. **The rung is the record of how much is known, and it is silent about itself.**

Under ruling (4)'s wording, this is a case where "we provide the full thing for each element" is satisfied by the LADDER, and where writing the absence would be the manufactured detail.

---

## 5. CONFLICTS THE EVIDENCE DOES NOT SETTLE

**C1 — A7 prescribes a cure this register cannot execute.**
*Side one:* A7, verbatim: "a sentence that must say something new goes in a NEW pool key by a chair act, never appended." §7.Q23 schedules that act for R6 and R7.
*Side two:* the code. `normalizeKey` + `conjunctionVariantsFor` address only the closed cross-product `{role × causeClass × lifecycleStage}` derived from the worldPulse stamp; an authored key nothing stamps is dead data. The only growth path is appending, and `variants[fnv1a32(...) % variants.length]` makes the pool's length a seed input.
**OPEN.** The evidence leaves exactly one route — an owner-gated one-time same-seed re-draw — and no source or standing law authorises it. Carried to the owner as the register's form of Q23.

**C2 — Tolkien's parataxis and Hobb's parataxis land on the same 0.715 and prescribe different cures.**
*Side one:* T A4 (`tolkien:54`, `157`, `254`, `656`, `657`, `663`) — the and-chain is the EVENT marker, stylistically marked, and split CULTURALLY between two peoples. Cure: reserve it, give it to one `causeClass` family.
*Side two:* H 15 (`hobb:86`, `hobb:90` — **Matthew Oliver, Mythlore 41.1, alone**; the fold's own note says "Oliver alone on the breach limb", and my re-count over the kept rows confirms ONE distinct source against Tolkien's six) — "extensive parataxis, elevated figurative language, and parallelism" mark the moment the record voice BREAKS. Cure: remove it from the record voice entirely.
**OPEN** (§3.4, §7.Q10). Neither reading licenses 0.715, but T reserves and H expels, and no evidence adjudicates. NPC-L2's proposed ceiling is compatible with both and commits to neither.

**C3 — the `situation` dimension is dropped for 1,638 of 1,662 lines, and A5 says audience is inherited.**
*Side one:* the module's own header — "rungs 2-3 are situation-agnostic (one line serves covert and revealed where the read does not change — the brief's rule)"; and the dossier is the DM's document, so a covert compromise stated plainly leaks to nobody.
*Side two:* A5 and the refuter's §4.1 — "whatever walker the wave gets must read marks from the leaf, not from the author's memory." `npcComponents.jsx:235` renders the phrase on `npc.corrupt` alone, with no `publicSafe` or `dm-only` gate in the path.
**OPEN.** This is a product ruling about who reads the NPC card, which I did not establish, not a prose ruling. Flagged because it is a standing-law surface.

**C4 — the read-aloud band is licensed but its edges are not.**
*Side one:* nine D&D sources give two / one-or-two / three / four / five sentences and 100 / 250 words. The spread licenses a band.
*Side two:* K 44 S8 — "a threshold hit exactly IS the fault"; §7.Q4 makes the walker's ceiling the owner's number.
**OPEN in the number.** NPC-L8's 34-word maximum is derived from our own p90 + sd and is offered as *test this, don't trust it*.

**C5 — is "the town knows" a licensed public fact or an interiority breach?**
*Side one:* it is the `exposed-public` stage's own definition — the stage IS the knowing — and 36 lines depend on it.
*Side two:* `martin:424` and C14 forbid a record stating inner life at all, and **no field distinguishes "the town knows" from "the town believes"**; belief is DEITY-DOCTRINE-adjacent the moment it touches a temple office (11 tithe lines).
**Ruled here as licensed for `knows` at `exposed-public` only**, and carried OPEN for the general case: a `believes` with no belief field is unlicensed, and nothing currently tells them apart.

**C6 — does `ai:936` convict our mean or our variance?**
*Side one:* `ai:936` names uniform LENGTHS, "typically fifteen to twenty-five words". Our mean is 22.6, inside it.
*Side two:* `ai:98`, `ai:665`, `ai:657` and Holtzman (`ai:1044`/`1045`) all name the low VARIATION, not the mean; and `martin-chronicle` sits at a HIGHER mean (25.9) with sd 12.7 and reads as a chronicle.
**OPEN**, because no source separates the two claims. NPC-L3 therefore **moves the variance and holds the mean**, explicitly as a hypothesis to measure, per *charter the permission, measure the mechanism*.

---

## 6. OPEN QUESTIONS

1. **The 90 unlicensed-institution lines need per-line adjudication by a skeptic before any byte moves.** My licensing regex is an upper bound and certainly contains false positives (a muster *roll* under `garrison-drained`; a *council* under `occupation`). The true count is unknown and is the input to NPC-L5's size.
2. **`check-pair.mjs` cannot run on this register today.** Its corpus loader (lines 16–31) reads `src/data/dossierStateProse` and the causal pools only. Every arm cited above needs an R6 loader that walks `ROLE_CONTENT` / `CLASS_CONTENT` / `FULL_CONTENT` to their array leaves and reconstructs the pool key as `role|causeClass|stage`. That is a prerequisite car, not a rule.
3. **Is the FULL rung's 31–41-word floor authored intent or drift?** Twenty-four lines, zero under 31. If drama was deliberately priced in length, NPC-L8 contradicts an authoring decision and the owner should say so.
4. **The institution table's shape is proposed, not specified.** `{settlement, office, holder-role, what it does, who it counts, who is exempt}` is my reading of ruling (5)'s wording; whether it is a per-settlement generated table or a closed vocabulary is an architecture decision outside this reconciliation.
5. **The em-dash residue in `causeLifecycleVocabulary.js` (2 instances) sits outside R6's measured roster** and outside R15/R18's classified residue as far as I can tell. It is two bytes of a hard rule and belongs to whoever owns the floor module.
6. **§7.Q23's schedule for R6** — given C1, the question the owner is being asked is not "when do we mint keys" but "do we buy a one-time re-draw on installed worlds, and for which of the three singleton stages first."
7. **Membership of the closed opening set (§7.Q3) is not decided here**, so NPC-L9 sets a ceiling over the seven moves the register happens to have rather than over an authored set.

---

## 7. WHAT THIS FILE DOES NOT DO

No corpus text changed. No rule is applied anywhere. No walker, arm or table named above was built. No figure was taken from the working tree, which carries another session's deletions. Every proposed SIZE is a number offered with the measurement that licenses it and is a hypothesis for the owner's walk of a refuted-and-cured taste sample, per ruling (7).

Seat: Opus 5 — Fable-unvalidated. Retrovalidation owed at the next ledger act.
