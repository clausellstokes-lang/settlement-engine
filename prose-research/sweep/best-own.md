# BEST PARTS — own (the OWN-PROSE column of the cross-author matrix: everything the estate's prose measurably DOES today)

Extracted 2026-09-07 by the Opus extractor for the SettlementForge prose reconciliation (S12 input).

Inputs read in full: `PROBE_ALL.md` (the corrected 2026-09-06 edition — 34,508 admitted rows, 20 columns × 47 metrics, the tic tables, the two bible axes, the outlier lists, the crosscheck), `PROSE_INVENTORY.md` (the home census, the seed/pool laws, the register definitions), `RULES-V2-DRAFT.md` (Part A, Part A′, Part B0), all sixteen `*.fingerprint.json` files (`primary/tolkien-*`, `primary/martin-*`, `primary/dnd-*`, `primary/leguin-*` against the estate's own four: `estate-state`, `herald-pools`, `herald-crier`, `npc-ladder`), and `receipt-primary-samples.md` (the exemplar-vs-estate table with the three added measures).

**No exemplar column is a CONTROL here.** The estate's own four fingerprints are the control column of the cross-author matrix, and this file is written from the estate side: what our prose does, in figures, graded.

---

## How to read a row

- **What it does** — one sentence: the figure, and the register it was measured in.
- **On the page** — at most twelve verbatim words from a real example the probe printed. Empty where the behaviour is a rate with no single specimen.
- **Instruments** — the executed measurement paths that saw this behaviour independently. There are eleven in play across the file:

| id | instrument | what it is |
|---|---|---|
| I1 | `probe-all/metrics.mjs` via `run.mjs` | the 20 × 47 register table (§3) |
| I2 | `probe-all/mechanical.mjs` | the hard rules with **no length floor**, 53,662 prose-shaped strings (§5 Axis A) |
| I3 | `probe-all/run.mjs` outlier engine | the >2× / <0.5× median lists (§6) |
| I4 | `probe-all/metrics.mjs` tic miner | 2-to-4-gram lift, ≥ 3 distinct pools (§4) |
| I5 | `fingerprint.mjs` | the four estate fingerprints, the same tool that scored the exemplars |
| I6 | `primary/extras.py` | the three added measures: "rather than"/1k, ", which"/1k, TTR @ 4k tokens |
| I7 | `probe-all/crosscheck.mjs` | reproduction of the chair's published house rates from a wholly independent extraction path (§8) |
| I8 | `probe-all/bible.mjs` | the voice bible's own exemplar corpus, scored by the same instrument (§5) |
| I9 | the chair's first extractor | `corpus-metrics.json`, 3,431 variants, pre-dating the probe |
| I10 | the estate's shipped gates | `voiceMechanics.test.js` three tiers, the JSX baseline file, `kindPoolWalker.js`, `newsVoiceContract.walker` |
| I11 | the four Opus refuters | `sweep/PROBE_ALL_REFUTATION.md` — raw-byte scans and re-counts that produced R-1…R-15 / P-1…P-9 |

- **Strength** — mechanical, by instrument count: three or more STRONG, two MODERATE, one SINGLE.
- **Grade** — **STRENGTH** (keep), **FAULT** (the anti-AI catalogue convicts it), **NEUTRAL**.
- **Anti-AI** — the fault from `sweep/best-ai.md`'s numbered catalogue that this behaviour matches, or "none".
- **Drafted rules** — what `RULES-V2-DRAFT.md` already says about it, by rule id.
- **Transferable** — YES for a strength to keep, NO for a fault to cure, PARTIAL for neutral.

## The register map used below

The probe's nineteen columns are folded onto the reconciliation's six registers:

| reconciliation register | probe columns |
|---|---|
| **dossier-archivist** | R1 dossier STATE (2,262) · R2 causal join (467) · R7 institution gazetteer (2,169) · R8 world-data prose (1,738) · A-U / A-W annex rows (4,626 / 4,276) |
| **herald-pools** | R3 receipt pools (1,212) · R4 causal grammar + molds (133) · R4b disclosure/lifecycle (50) · R5 crier voice (373) · R17 rumor subject phrases (1,293) |
| **chronicle-line** | R12 treaty / war-status / chronicle documents (108) · the annex rows read as annals (A-U / A-W) |
| **dm-page** | R6 NPC cause-conjunction ladder, read aloud (1,659) · R11 event composer / realm verbs (216) · R14 generators' arrival tables (561) |
| **chrome** | R9 copy registry (619) · R16 JSX + PDF chrome (2,685) · the reader-facing residue of R15 (3,883) and R18 (5,673) |
| **compendium-docent** | R10 docent + glossary + operations (505) |

**Three cautions carried from the refutation, obeyed below.** (1) The tic columns are **not additive** — 28 of 196 rows are row-set subsets of a sibling, and R6's ten sum to 1,000 against a union of 744 [R-7]; every formula figure below is stated as its own row's count, never as a sum. (2) Twelve printed grams never occur literally — punctuation is erased before n-grams form [P-5]; where a gram below is a tokenizer artifact it is named as one. (3) Three of §6's readings are labelled PLAUSIBLE by the refuters because the command was paraphrased [R-15, P-3, P-4]; they are marked where used.

---

## A. LENGTH AND SHAPE BY REGISTER

### 1. The two-sentence ceiling holds in every diegetic register
**What it does.** The record registers keep to one sentence or two: three-plus-segment share is 0.004 in dossier-state, 0.006 in the causal join, 0.002 in the Herald receipt pools, 0.001 in the NPC ladder and 0.015 in the unwired annex, with segments per variant at 1.286 / 1.135 / 1.170 / 1.018 — against 0.221 in the generators' tables and 0.092 in chrome.
**On the page.** —
**Instruments.** I1, I7 (2,030 one-sentence and 11 three-sentence variants reproduced exactly), I9 · **Sources.** 3 · **Strength.** STRONG
**Registers.** dossier-archivist · herald-pools · chronicle-line
**Grade.** STRENGTH · **Anti-AI.** none — it is the standing cure for the paragraph-cascade failure.
**Drafted rules.** A1 ("one flowing sentence or two short ones — never a paragraph, a cascade or a list"), mechanised as `check-pair.mjs: THREE+ SENTENCES`; Part B refuses the paragraph-length composed variant outright.
**Transferable.** YES.

### 2. The dossier-state length band
**What it does.** Dossier-state runs at 16.8 words a segment, sd 7.2, p10 7 / p50 17 / p90 26, with 13.0% of segments under eight words and 2.1% over thirty.
**On the page.** "The town does not spend much time thinking about being attacked" (R1)
**Instruments.** I1, I5, I7 (mean, sd, all three percentiles and share-under-8 reproduced exactly or +0.1), I9 · **Sources.** 4 · **Strength.** STRONG
**Registers.** dossier-archivist
**Grade.** NEUTRAL — the mean sits inside the exemplar band (martin 20.4, leguin-all 15.7, dnd-rules 18.4); only the spread is a defect, and that is row 11.
**Anti-AI.** none at the mean; the sd feeds fault 5 (the metronome).
**Drafted rules.** A′-R1 names the register the Part A laws govern; B0.4 says the cure is not longer sentences by default.
**Transferable.** PARTIAL.

### 3. The causal join is the one long register and it has no short relief
**What it does.** R2 runs at 28.6 words a segment with **49.1% of segments over thirty words** — 98.2× the 0.005 corpus median, the largest single outlier in the estate — p10 14, p50 30, and only 1.7% of segments under eight words.
**On the page.** "The old hands at {settlement} measure a full granary against a year" (R2)
**Instruments.** I1, I3, I7 (0.491 exact against the published 0.49), I9 · **Sources.** 4 · **Strength.** STRONG
**Registers.** dossier-archivist
**Grade.** FAULT
**Anti-AI.** 5 (the metronome — uniform length and constant pacing) and 21 (length decay: the long sentence that keeps accumulating).
**Drafted rules.** A′-R2 rules that the sentence stays one but the joint is chosen — a colon for the cause, a period where the semicolon was a staple — and names opener spread as the first cure; B0.2 moves the qualification out of the subordinate clause into its own sentence.
**Transferable.** NO — cure it.

### 4. The NPC ladder is monotonically long
**What it does.** R6 runs at 22.6 words a segment with sd 4.0 and **p10 = 19** — no sentence under nineteen words at the tenth percentile; 9 of 1,689 segments (0.5%) are under eight words against a 0.46 corpus median (0.01×), the shortest is one word, and 21 are under twelve [R-14].
**On the page.** "The syndicate that held the arrangement is gone, but the stores" (R6)
**Instruments.** I1, I3, I5 (sd 4.0, shareUnder8 0.0047), I11 (the 9/1,689 re-count) · **Sources.** 4 · **Strength.** STRONG
**Registers.** dm-page
**Grade.** FAULT
**Anti-AI.** 5 (the metronome) and 17 (repetition without relief).
**Drafted rules.** A′-R6: "this register needs SHORT sentences and OPENER spread before anything else, and the two-sentence read-aloud law applies because it is spoken."
**Transferable.** NO — cure it.

### 5. The Herald receipt pool is the healthiest register in the estate
**What it does.** R3 runs at 12.2 words a segment, sd 5.0, 20.4% of segments under eight words, 0.1% over thirty, antithesis 0.012, gloss tail 0.034, rationed pet words 0.176 per variant — inside the exemplar band on length, tics and closers.
**On the page.** "{npc} is free of {captor} at last, and turns for {home}." (R3)
**Instruments.** I1, I5, I3 · **Sources.** 3 · **Strength.** STRONG
**Registers.** herald-pools
**Grade.** STRENGTH
**Anti-AI.** none on length; its own defect is rhythm (row 9) and pool uniformity (row 42).
**Drafted rules.** A′-R3 calls it the healthiest register and rules it **engine-side, persisted, golden-bound** — measure, do not touch before the freeze (A16); its law is the read-aloud two-sentence law, which it already keeps.
**Transferable.** YES — keep, and take it as the model for R1's short end.

### 6. Chrome is short and plain, and is the estate's nearest thing to the voice bible
**What it does.** The copy registry runs at 7.7 words a segment with 61.6% of segments under eight; JSX/PDF chrome at 8.1 with 59.9% — against the bible's own exemplar fingerprint of 8.1 and 64.2%. On Axis B they are the three nearest columns: R16 0.512, R15 0.650, R9 0.684.
**On the page.** "Generate a town in seconds. Then run the region for years." (R9)
**Instruments.** I1, I8, I2, I5-adjacent · **Sources.** 3 · **Strength.** STRONG
**Registers.** chrome
**Grade.** STRENGTH — with the caveat in row 57: 48 of the bible's 67 exemplars (71.6%) are themselves chrome, so this measures agreement, not superiority.
**Anti-AI.** none.
**Drafted rules.** A′-R9/A′-R16: their "tics" are product phrases that ARE the lexicon; **out of scope for the wave** — the bible governs them already.
**Transferable.** YES — keep, and keep the archivist voice off them (the owner's standing law).

### 7. The gazetteer entry is a short declarative unit
**What it does.** R7 runs at 8.8 words a segment with 47.2% under eight, 1.496 segments a variant and 6.9% three-plus-segment entries — the entry shape, not the sentence shape.
**On the page.** "A built water supply: conduits, cisterns, and fountains." (R7)
**Instruments.** I1, I3 · **Sources.** 2 · **Strength.** MODERATE
**Registers.** dossier-archivist
**Grade.** STRENGTH
**Anti-AI.** none; its own residue is the abstract closer (row 18).
**Drafted rules.** A′-R7: "the gazetteer entry closes on the thing, not the quality."
**Transferable.** YES.

### 8. The generators' arrival tables are the estate's only real burstiness
**What it does.** R14 carries sd 8.1 (the highest outside the causal join), a 3+-segment share of 0.221 — **11.6× the 0.019 median**, the widest shape-spread in the estate — 46.0% of segments under eight words, 3.9% over thirty, a within-pool word sd of 4.8 and only 40.0% of pools uniform in segment count.
**On the page.** "The market is open, the streets are swept, the guards" (R14)
**Instruments.** I1, I3, I4 · **Sources.** 3 · **Strength.** STRONG
**Registers.** dm-page
**Grade.** STRENGTH
**Anti-AI.** none — this is the one column that does not trip fault 5.
**Drafted rules.** A′-R14 names it "the estate's BEST rhythm… the model for R1's short end", and rules it ENGINE-SIDE generation input under A16: measure, never touch before the freeze.
**Transferable.** YES — it is the internal proof that the rhythm cure is achievable inside this house voice.

---

## B. RHYTHM

### 9. Neighbour variation is the widest measured gap between us and every exemplar
**What it does.** Consecutive sentences differ in length by 0.399 of their own mean in dossier-state, 0.330 in the Herald receipt pools, 0.178 in the crier and 0.167 in the NPC ladder — against 0.495 (dnd-flavor) to 0.805 (leguin-fiction), with tolkien-plain 0.733, leguin-nonfiction 0.740, tolkien-elevated 0.646, martin-narrative 0.593, martin 0.537, dnd-rules 0.520, martin-chronicle 0.508.
**On the page.** —
**Instruments.** I5 (the same tool scored both sides), I6 · **Sources.** 2 · **Strength.** MODERATE
**Registers.** dossier-archivist · herald-pools · dm-page
**Grade.** FAULT
**Anti-AI.** 5 (the metronome) and 8 (flat pressure — swappable sentences).
**Drafted rules.** B0.4 names this "THE WIDEST GAP" and sets the cure: consecutive variants and consecutive sentences differ — a short fact beside a long chain — and a pool's variants do not open alike (A11). A′-FINGERPRINTS: "the Herald's cure is RHYTHM and OPENER SPREAD, not vocabulary or tics."
**Transferable.** NO — cure it.

### 10. Three sentences in the same length band, over and over
**What it does.** Runs-of-three-in-the-same-length-band: the crier 0.727 (the estate's worst), the Herald receipt pools 0.597, dossier-state 0.320, the NPC ladder 0.282. The only exemplar columns above dossier-state are the D&D rules chapters (0.339 and 0.408) — which pay for it deliberately, to be scannable.
**On the page.** —
**Instruments.** I5, I6 · **Sources.** 2 · **Strength.** MODERATE
**Registers.** herald-pools · dossier-archivist · dm-page
**Grade.** FAULT
**Anti-AI.** 5 (the metronome).
**Drafted rules.** B0.7 makes the D&D comparison explicit — "the column we most resemble, and it is the most metronomic… paid for exactly the way we pay"; A′-R5 quotes the estate's own rule 10, "never three of a length in a row," and A′-R6 notes it has no purchase on the ladder.
**Transferable.** NO — cure it.

### 11. Sentence-length spread is compressed in every estate column
**What it does.** Words-per-segment sd: dossier-state 7.2, Herald receipt pools 5.0, crier 4.7, NPC ladder 4.0 — against tolkien 15.9–16.0, martin 12.7–12.8, leguin 11.1–13.0, dnd 8.5–8.9, and the bible's own 6.9.
**On the page.** —
**Instruments.** I1, I5, I7 (sd 7.2 exact), I9 · **Sources.** 4 · **Strength.** STRONG
**Registers.** all six
**Grade.** FAULT
**Anti-AI.** 5 (the metronome).
**Drafted rules.** B0.4; A′-R2's opener-spread cure; A11 (pool spread measured at the edit).
**Transferable.** NO — cure it.

---

## C. OPENERS

### 12. The same opener as the previous line
**What it does.** Same-opener-as-previous rate: the crier **0.4242** (two lines in five), the NPC ladder 0.3442, the Herald receipt pools 0.1890, dossier-state 0.1321 — against an exemplar band of 0.033 (martin) to 0.167 (leguin-fiction), with tolkien 0.065–0.095 and dnd 0.060–0.073.
**On the page.** —
**Instruments.** I5, I6 (0.132 the highest in the eight-column table) · **Sources.** 2 · **Strength.** MODERATE
**Registers.** herald-pools · dm-page · dossier-archivist
**Grade.** FAULT
**Anti-AI.** 9 (the fixed move order) and 17 (repetition without relief).
**Drafted rules.** A′-R5 ("the estate's worst opener repetition… vary the frame across the pool, not the vocabulary inside it"); A11; B0.4.
**Transferable.** NO — cure it.

### 13. Pools whose variants share a two-word opener
**What it does.** Share of multi-variant pools where two variants open on the same two words: R12 0.667, R18 0.583, R16 0.478, R2 0.231, R5 0.224, A-U 0.183, R1 0.112 (**79 of 708 pools**, reproduced exactly by the independent extractor).
**On the page.** —
**Instruments.** I1, I7 (79/708 exact), I9, I3 · **Sources.** 4 · **Strength.** STRONG
**Registers.** chronicle-line · dossier-archivist · herald-pools · chrome
**Grade.** FAULT
**Anti-AI.** 9 (the fixed move order) and 10 (sameness).
**Drafted rules.** A11 makes pool spread a test at the edit — "a rewrite may not make two variants of one pool share their first two words"; B-CLAIM records that nothing yet mechanises it, and names the gap as a chair car.
**Transferable.** NO — cure it.

### 14. The existential opener: "There is / It is"
**What it does.** R6 opens 185 of 1,689 segments (0.110) with `There/It is/was/are` — **18.3× the 0.006 corpus median**, the single strongest formula in the estate; 143 of them are `It is public`, 4 `It is known`, 34 `It is out` [P-4, PLAUSIBLE — re-execute before citing]. Dossier-state is 0.051; the D&D rules chapters are 0.002.
**On the page.** "It is public now: the shortfall was covered with bought coin" (R6)
**Instruments.** I1, I3, I4 (`it is public` n=146, lift 4,227), I5 (0.1096), I11 · **Sources.** 5 · **Strength.** STRONG
**Registers.** dm-page · dossier-archivist
**Grade.** FAULT
**Anti-AI.** 9 (the fixed move order), 14 (no one behind the sentence — the answer-shaped thing), 19 (copula dodges).
**Drafted rules.** A′-R6 names it the estate's strongest tic and puts opener spread first; B0.4.
**Transferable.** NO — cure it.

### 15. The participial opener is not one of our tics
**What it does.** Participial-opener rate: dossier-state 0.012, the estate's maximum is JSX chrome at 0.028, and eight columns sit at or below 0.010 — against the bible's 0.030, dnd-rules 0.034, leguin 0.025, tolkien 0.042.
**On the page.** —
**Instruments.** I1, I5, I6 · **Sources.** 3 · **Strength.** STRONG
**Registers.** all six
**Grade.** STRENGTH
**Anti-AI.** none — the catalogue's participial-significance close (fault 2, the glossary tail) needs this opener as its vehicle, and we do not have it.
**Drafted rules.** Nothing in Part A or B0 governs it; B0.8 covers the neighbouring case (the punctuation freedoms we decline).
**Transferable.** YES — keep the floor; if the D&D lever set is imported (B0.7), raising this dial is one of the cheapest available moves and it starts from a genuinely low base.

### 16. The town's own name is the second-commonest opener in the dossier
**What it does.** In 2,914 dossier-state sentences the openers are `the` 928, the settlement token 610, `what` 232, `a` 188, `there` 110, the settlement possessive 90, `nothing` 86, `it` 74.
**On the page.** —
**Instruments.** I5, I9 (`corpus-metrics.json` topOpeners, identical counts from the earlier extractor) · **Sources.** 2 · **Strength.** MODERATE
**Registers.** dossier-archivist
**Grade.** NEUTRAL leaning FAULT — one sentence in five opens on the place name, which is a legitimate archival move at some rate and a drum at this one; no rule has set the rate.
**Anti-AI.** 10 (sameness — the same well) and 17.
**Drafted rules.** None sets an opener-token ceiling. A′-R5's "vary the frame across the pool" is the nearest, and A2's seven standpoints are the mechanism that would do it.
**Transferable.** PARTIAL — needs a ruling, not a cure.

---

## D. CLOSERS

### 17. Landing on "it"
**What it does.** Pronoun-closer rate 0.1335 in dossier-state — **253 of 2,914 sentences end on the word "it"** — with the causal join at 0.125, the unwired annex 0.123 and the Herald join molds 0.128, against martin-chronicle 0.054, dnd-flavor 0.021 and the bible 0.015.
**On the page.** "and it is the combination rather than any single one" (R1)
**Instruments.** I1, I5 (topClosers: `it` 253), I6, I9 · **Sources.** 4 · **Strength.** STRONG
**Registers.** dossier-archivist · herald-pools · chronicle-line
**Grade.** FAULT
**Anti-AI.** 11 (no grain — the missing particular) and 19 (copula dodges).
**Drafted rules.** B0.3 "LAND ON A NOUN", with the refuter's note that v1's version was cited eight times and delivered once — "so it is checked, not claimed."
**Transferable.** NO — cure it.

### 18. The abstract-noun closer
**What it does.** Abstract-noun closer rate: R11 0.122, R10 0.114, R14 0.091, R7 0.086, R8 0.084, R6 0.078 (its top closer is `arrangement`, 63 times), dossier-state 0.044 — against dnd-rules 0.088 (the exemplar high) and dnd-flavor 0.021 (the same house, dial down).
**On the page.** —
**Instruments.** I1, I5, I6 · **Sources.** 3 · **Strength.** STRONG
**Registers.** dm-page · compendium-docent · dossier-archivist
**Grade.** NEUTRAL — inside the exemplar range everywhere, and the two highest columns are the two the drafted rules put out of scope.
**Anti-AI.** 6 (the evaluative close) at the margin; not convicted at these rates.
**Drafted rules.** A′-R7 ("closes on the thing, not the quality"); B0.7 names the abstract closer as one of the four D&D dials (0.088 → 0.021 between the two D&D columns).
**Transferable.** PARTIAL.

---

## E. ANTITHESIS AND TRIAD

### 19. The "rather than" reflex — the largest single fault in the corpus
**What it does.** "rather than" runs at 0.113 per variant in dossier-state (**255 of 2,262**), 0.071 in the causal join, 0.067 in the wired annex control (287 rows), 0.015 in the rumor phrases — against **0.00–0.32 per thousand words in every exemplar column and 5.33 per thousand in ours**. 259 of the estate's 323 antithesis hits are this one phrase. The combined R1+R2 count, 288 variants, was reproduced exactly by a second extractor.
**On the page.** "and it is the combination rather than any single one" (R1)
**Instruments.** I1, I3 (16.1× median), I6 (the per-1k measure, added because the shape row was carried by one lexical item), I7 (288 exact), I9 · **Sources.** 5 · **Strength.** STRONG
**Registers.** dossier-archivist · chronicle-line
**Grade.** FAULT
**Anti-AI.** 3 (reflexive antithesis — not X but Y).
**Drafted rules.** B0.1 puts it first in the queue; A8 saves the contrast where the rejected alternative names a **sibling pool key or a sibling band** and cuts it nowhere else; A10 forbids a rewrite from adding the shape back, including as a bare "X, not Y".
**Transferable.** NO — cure it, under A8's guard.

### 20. The antithesis shape beyond the phrase
**What it does.** Antithesis-shape rate 0.139 in dossier-state and 0.077 in the causal join against a 0.028 corpus median — with the wired annex at 0.082, the bible at 0.045, and an exemplar band of 0.011 (dnd-flavor... 0.013) to 0.040 (tolkien-elevated).
**On the page.** "is not an emergency arrangement, it is the week's work" (R1)
**Instruments.** I1, I5 (0.1088), I6, I3 · **Sources.** 4 · **Strength.** STRONG
**Registers.** dossier-archivist
**Grade.** FAULT
**Anti-AI.** 3.
**Drafted rules.** A10 counts the **shape**, not the phrase — the rubric's explicit design; A8 is the keep-test.
**Transferable.** NO — cure it.

### 21. The triad is nearly absent from our prose
**What it does.** Triad-list rate 0.009 in the estate fingerprint and 0.011 in dossier-state, 0.012 in the Herald receipt pools, 0.011 in the crier, 0.006 in inline prose; the estate's highest are the generators' tables 0.077 and the gazetteer 0.075 — against martin-chronicle 0.213, dnd-flavor 0.144, tolkien 0.113, leguin 0.058.
**On the page.** "The market is open, the streets are swept, the guards" (R14)
**Instruments.** I1, I5, I6, I9 (triadLists 26 in 2,914) · **Sources.** 4 · **Strength.** STRONG
**Registers.** dossier-archivist · herald-pools · dm-page
**Grade.** STRENGTH as compliance — we do not have the tricolon reflex the AI catalogue convicts — and simultaneously the measure of a device we have almost no access to.
**Anti-AI.** 4 (the rule of three) — **cleared**, and the constraint it imposes is that any deliberate import of the triad must be licensed per-instance, never as scaffolding.
**Drafted rules.** B0.5: "THE TRIAD IS A DEVICE, NOT A TELL, IN THIS COMPANY… never as scaffolding"; A′-R14 identifies our one home for it, "triads of concrete civic nouns… in Martin's chronicle manner."
**Transferable.** PARTIAL — keep the low floor as protection; raise it only where the form is exact.

### 22. Doubled adjectives are rationed to near zero
**What it does.** Doubled-adjective rate 0.009 in dossier-state (0.0144 on the fingerprint's own count), estate maximum 0.023 in the gazetteer — against dnd-flavor 0.041, tolkien 0.042, leguin-fiction 0.056.
**On the page.** —
**Instruments.** I1, I5, I6, I9 (21 in 2,914) · **Sources.** 4 · **Strength.** STRONG
**Registers.** all six
**Grade.** STRENGTH
**Anti-AI.** none — this is the ornament dial the catalogue's §19 lexicon fault runs on, and we sit under every exemplar.
**Drafted rules.** B0.7 names it as one of the four D&D dials; nothing bans it.
**Transferable.** YES — keep as a floor; it is also the cheapest dial if the evocative move is wanted.

---

## F. PUNCTUATION AND THE HARD RULES

### 23. Zero exclamation points in the entire reader-facing corpus
**What it does.** **0** exclamation points across all 53,662 prose-shaped strings, counted with the admission floor deliberately dropped so that any user-facing string qualifies. Every register column reads 0.
**On the page.** —
**Instruments.** I2 (the no-floor count), I1 (per-register counts), I5, I10 (`voiceMechanics.test.js` HARD ZERO tier) · **Sources.** 4 · **Strength.** STRONG
**Registers.** all six
**Grade.** STRENGTH
**Anti-AI.** none — it is the cure for fault 15 (manufactured emphasis) at its crudest level.
**Drafted rules.** B0.8: "WHAT WE DO THAT THEY DO NOT, kept on purpose… the exemplars' punctuation freedoms are NOT imported."
**Transferable.** YES — hold absolutely.

### 24. Zero em dashes in fourteen registers and in all JSX, with a named residue
**What it does.** 0 em dashes across the 28,700 combined strings of R1, R2, R3, R4, R4b, R5, R6, R7, R10, R12, R16, R17, A-U and A-W; **0 in JSX** (5,439 prose strings — the baseline file at this HEAD is three bytes). The residue is **57 distinct reader-facing strings in 13 files, 58 occurrences** [R-9], with `customContentSchema.js` 15, `crossSettlementConflicts.js` 11, `governanceNarrative.js` 9, `labelBands.js` 5; the admitted-corpus table reads R15 71 and R18 44.
**On the page.** —
**Instruments.** I2, I1, I5 (emDashRate 0 on all four estate fingerprints), I10 (the JSX baseline), I11 (the 57/13 re-count that replaced a published "6") · **Sources.** 5 · **Strength.** STRONG
**Registers.** all six
**Grade.** STRENGTH with a live residue.
**Anti-AI.** 18 (the em dash and punctuation tics) — cleared in the registers that matter.
**Drafted rules.** B0.2 explicitly **REFUSES** the em dash as the cure for the which-tail — "V-26a, zero em dashes, is the owner's law — the period is the estate's instrument"; B0.8. ⚠ A′-R15 carries the hazard for the residue: `safetyLabel` is a persisted `economyInputFingerprint` input.
**Transferable.** YES — keep, and burn the 57 down inside the wave.

### 25. The en-dash connector is a computed, unpublished breach
**What it does.** `mechanical.mjs` already computes `enDashConnector`: **65 breaches** — R15 53, **R16 7**, R18 4, R8 1 — and prints none of them. R16 is Axis B's number-one register and was headlined "zero em dashes"; R1, R2 and R6 are 0.
**On the page.** —
**Instruments.** I2 (the computation exists), I11 (the refuter who found it unprinted) · **Sources.** 2 · **Strength.** MODERATE
**Registers.** chrome · dossier-archivist
**Grade.** FAULT — a hard-rule breach class that no published figure carried.
**Anti-AI.** 18.
**Drafted rules.** Nothing. A′-R9/R16 declare chrome out of scope for the wave on the strength of an axis that did not measure this. **This is the one item in this file that no drafted rule covers.**
**Transferable.** NO — cure it, and publish the row.

### 26. Zero questions in every diegetic register
**What it does.** Question rate 0.000 in R1, R2, R3, R4, R4b, R6, R7, R10, R12, R17, A-U and A-W; the only non-zero columns are chrome (R9 0.034, R16 0.021), the long tail (R15 0.005, R18 0.003), the crier (0.005) and world-data (0.001) — against tolkien-plain 0.055, leguin 0.063, martin-narrative 0.081.
**On the page.** —
**Instruments.** I1, I5, I3 · **Sources.** 3 · **Strength.** STRONG
**Registers.** dossier-archivist · herald-pools · chronicle-line · compendium-docent
**Grade.** STRENGTH
**Anti-AI.** none.
**Drafted rules.** B0.8.
**Transferable.** YES.

### 27. Zero digits in the dossier and Herald registers
**What it does.** Digits-in-prose rate 0.000 in R1, R2, R3, R4, R4b, R5, R6, R17, A-U and A-W: durations render through the six-band time vocabulary and counts through the quantity bands.
**On the page.** —
**Instruments.** I1, I2, I10 (`lint/proseNumerics.test.js` plus the desk tests), I5 · **Sources.** 4 · **Strength.** STRONG
**Registers.** dossier-archivist · herald-pools · chronicle-line
**Grade.** STRENGTH
**Anti-AI.** none.
**Drafted rules.** A4 (BANDS ONLY — no digits, six-band durations, quantity-band counts, proportions in words never percent, and the T5 rule that a band-blind variant asserts no duration); inventory §7.8; B0.8. Part B refuses the essay's digits and dated headers outright.
**Transferable.** YES — hold absolutely.

### 28. Digits where the bible licenses them, and one case nobody has ruled on
**What it does.** Digits-in-prose: R10 0.111 (**37× the 0.003 median** — band-ladder specs), R15 0.054, R14 0.039, R9 0.032 (prices and timings), R7 0.030, R16 0.019, R11 0.014.
**On the page.** "A chapter of organised crime, workable only past 10,000 people." (R7)
**Instruments.** I1, I3, I2 · **Sources.** 3 · **Strength.** STRONG
**Registers.** compendium-docent · chrome · dm-page · dossier-archivist
**Grade.** NEUTRAL — the bible expressly permits digits in mechanical, scannable UI; the probe declines to rule on R7's `10,000 people` and hands it to the chair.
**Anti-AI.** none.
**Drafted rules.** A′-R7 says the numeral rule is contextual here — "a chair ruling, not a rewrite."
**Transferable.** PARTIAL — needs the ruling, not an edit.

### 29. Emphasis caps
**What it does.** 0 in every diegetic register; 33 all-caps tokens across the 28,700-string core (31 of them JSX, 2 the annex). Rates: R15 0.049, R11 0.042, R18 0.020, R9 0.016, R16 0.009.
**On the page.** —
**Instruments.** I2, I1 · **Sources.** 2 · **Strength.** MODERATE
**Registers.** chrome · dm-page
**Grade.** NEUTRAL — the probe labels caps an *indicator, not a verdict*: R9's are deity axis labels, R16's are acronyms (PII, GDPR, VTT).
**Anti-AI.** 15 (manufactured emphasis) if they were emphasis; they are not.
**Drafted rules.** None beyond the bible's own hard rule, which Axis A measures at zero for the record registers.
**Transferable.** PARTIAL.

### 30. The semicolon is the house joint
**What it does.** Semicolon rate: R6 **0.540** (every second line, four times the exemplar ceiling), R2 0.360, R4b 0.260, R5 0.198, A-U 0.187, R12 0.176, R1 0.170, R3 0.136 — against the bible 0.000, martin 0.024, dnd-rules 0.011, leguin-all 0.045, tolkien-elevated 0.122. The estate's raw counts reproduce to within one row on an independent extractor (385 against 386 in state, 168 against 169 in causal).
**On the page.** —
**Instruments.** I1, I5, I7 (−1 row on each), I9, I3 · **Sources.** 5 · **Strength.** STRONG
**Registers.** dm-page · dossier-archivist · herald-pools · chronicle-line
**Grade.** FAULT
**Anti-AI.** 5 (the metronome, in punctuation) and 17 (repetition without relief) — and the primary-samples reading names the mechanism: Tolkien's semicolons join two live clauses, "ours are overwhelmingly the joint in a fixed two-part template."
**Drafted rules.** A′-R2 ("a period where the semicolon was a staple"); A′-FINGERPRINTS flags R6's 0.53 as four times the exemplar ceiling; B0.2's cure is the period, not the em dash.
**Transferable.** NO — cure it.

### 31. The colon carries the causal joint
**What it does.** Colon rate: R2 0.364, R4b 0.280, R14 0.178, R6 0.138, R16 0.101 — against the bible 0.119, tolkien 0.125, martin-chronicle 0.008. Dossier-state sits at 0.072.
**On the page.** "the tribute has gone out through" (R2)
**Instruments.** I1, I5, I3 · **Sources.** 3 · **Strength.** STRONG
**Registers.** dossier-archivist · herald-pools · dm-page
**Grade.** FAULT in R2 (where colon 0.364 and semicolon 0.360 together mean nearly three variants in four are stapled), NEUTRAL elsewhere — the colon is inside the exemplar band for every other column.
**Anti-AI.** 5.
**Drafted rules.** A′-R2 rules the colon **in** as the chosen joint for the cause — the one place a drafted rule prescribes a punctuation mark rather than banning one.
**Transferable.** PARTIAL.

### 32. Parentheses are a DM-surface device
**What it does.** Parenthesis rate: R11 0.222 (**13.9× the 0.016 median**), R16 0.091, R18 0.064, R14 0.061, R8 0.047 — against dossier-state 0.005 and the bible's own 0.090.
**On the page.** "Institution name (e.g. \"Granary\", \"Temple of Mercy\")" (R11)
**Instruments.** I1, I3, I5 · **Sources.** 3 · **Strength.** STRONG
**Registers.** dm-page · chrome
**Grade.** NEUTRAL — "the DM-authoring surface annotates; consistent with the bible's parenthesis permission."
**Anti-AI.** none.
**Drafted rules.** A′-R11 rules the event composer out of scope; its law is terminology consistency.
**Transferable.** PARTIAL.

### 33. Contractions hold at zero in the record registers and leak in one
**What it does.** Contraction rate 0.000 in R1, R2, R3, R4, R4b, R5, R6, R10, R17, A-U and A-W. Non-zero: R9 0.050, **R8 0.048**, R14 0.029, R16 0.022, R12 0.019, R15 0.012, R18 0.009, R7 0.004.
**On the page.** "The terms may mean they owe something to an enemy" (R8)
**Instruments.** I1, I3 · **Sources.** 2 · **Strength.** MODERATE
**Registers.** dossier-archivist (the leak) · chrome (licensed)
**Grade.** STRENGTH for the record registers; **FAULT for R8**, which is a diegetic register carrying contractions at chrome's own rate.
**Anti-AI.** 23 (register invariance — the default breaking through).
**Drafted rules.** The bible bans contractions on trust surfaces; A′-R8 rules "no reconstruction pass beyond the breach", which does not reach this. **Undercovered.**
**Transferable.** PARTIAL — YES for the zero, NO for R8's 0.048.

---

## G. THE GLOSS AND THE PET WORDS

### 34. The gloss tail
**What it does.** ", which" rate 0.066 in dossier-state — **16.5× the 0.004 median**, the tic the chair's dossier ranked first among house habits — with the unwired annex at 0.062 (15.5×), the causal join 0.054, the generators' tables 0.052, the Herald receipt pools 0.034. **149 instances of ", which"** in 2,914 state sentences, 3.05 per thousand words, against **zero** in Martin's 12,422-word chronicle.
**On the page.** "which is a choice somebody made and is still paying for" (R1)
**Instruments.** I1, I3, I5 (0.0511), I6 (the per-1k measure), I9 (commaWhichTail 149) · **Sources.** 5 · **Strength.** STRONG
**Registers.** dossier-archivist · chronicle-line · herald-pools
**Grade.** FAULT
**Anti-AI.** 1 (the gloss — the summary second sentence) and 2 (the glossary tail).
**Drafted rules.** A9 guards the cut — the tail is cut **only after A8 has cleared it**, and a "That is / This is" sentence carrying the pool key's discriminating claim is not a gloss; B0.2 moves the qualification into its own sentence and refuses the em-dash alternative. A13 protects the gnomic closer from being swept up with it.
**Transferable.** NO — cure it, under A9's guard.

### 35. The summarising second sentence
**What it does.** Second-sentence-summary rate: R10 0.063, dossier-state 0.035, the gazetteer 0.031, JSX chrome 0.024, the annex 0.022 — against the bible's 0.000. The earlier extractor counted 80 `That/This/It` second sentences in 2,914.
**On the page.** —
**Instruments.** I1, I8 (bible 0), I9 (80) · **Sources.** 3 · **Strength.** STRONG
**Registers.** compendium-docent · dossier-archivist
**Grade.** FAULT — small in magnitude, and the catalogue's single most-named failure.
**Anti-AI.** 1 (the gloss — the summary second sentence).
**Drafted rules.** A9; A′-R1 lists gloss tails 0.066 among the register's own failures.
**Transferable.** NO — cure it.

### 36. The rationed pet-word load
**What it does.** Rationed pet words per variant: **R2 0.713** (the highest column in the estate), R1 0.536, A-W 0.411, R6 0.291, A-U 0.287, R14 0.246 — against the bible 0.060 and a field mean of 0.185. The independent crosscheck reproduces "already" at 26 and "kind of / sort of" at 29 exactly; the earlier extractor counted `enough to` 97, `its own` 70, `whatever` 49, `quiet(ly)` 26–59 (two pattern definitions), `nobody/no one/nothing` 512 occurrences against 333 variants.
**On the page.** "the town is at full strength anyway" (R1)
**Instruments.** I1, I7 (two exact reproductions), I9, I3 · **Sources.** 4 · **Strength.** STRONG
**Registers.** dossier-archivist · dm-page · chronicle-line
**Grade.** FAULT
**Anti-AI.** 19 (the AI lexicon — fillers) and 17.
**Drafted rules.** A10 is a **net test at the edit**: none of the nine may be *added* by a rewrite; A12 guards the adverb — before cutting "quiet(ly)", ask whether a sibling pool exists that the adverb distinguishes the variant from; A13 protects the corpus's deliberate devices from the same broom.
**Transferable.** NO — cure it, under A10/A12.

---

## H. SLOTS, TEMPLATES AND THE UNITS THE PROBE HAD TO INVENT

### 37. The slot-bearing template is the corpus's dominant shape
**What it does.** Slot-bearing share: R2 0.953, R1 0.777, A-U 0.754, R3 0.578, A-W 0.556, R4b 0.500, R18 0.441, R14 0.289 — against R7 0.000, R10 0.000, R5 0.032, R6 0.058. Nine thousand seven hundred and twenty-two raw walk leaves arrived **through a function**, of which 2,511 admitted rows carry an `fn-*` shape [R-2].
**On the page.** "{npc} rides out of {home}, bound for {dest}" (R3)
**Instruments.** I1, I11 (the corrected 9,722 / 2,511 figures), I10 (the shipped pool walkers) · **Sources.** 3 · **Strength.** STRONG
**Registers.** dossier-archivist · herald-pools · dm-page
**Grade.** NEUTRAL — this is the corpus's architecture, not a stylistic choice, and it is the surface every reconstruction rule has to survive.
**Anti-AI.** 9 (the fixed move order) is the risk the shape carries, and the owner's own ruling meets it: the structure is a **latent grammar, not a visible template**.
**Drafted rules.** A3 (the slot SET of a variant is fixed; each fill shape decides casing and article; a `phrase` or `bare-common` fill may not move to sentence-initial); A6 (a field licenses a structural clause, never a historical one); A7 and A17 (the pool key and block id are hash inputs); B-GRAMMAR (a closed set of move grammars, seeded, measured by a walker with a ceiling on any single order).
**Transferable.** PARTIAL — the shape stays; the visible-template failure is what the grammar rule exists to prevent.

### 38. Two registers are phrases, not sentences
**What it does.** R4 (133 phrases) and R17 (1,293) carry terminal-stop share **0.000** and exactly 1.000 segments a variant; they are admitted at ≥ 8 characters / ≥ 2 words, and a sentence-shape filter scores the whole 1,982-string legacy retrofit **zero**.
**On the page.** "travellers finding this town's soldiers billeted elsewhere" (R17)
**Instruments.** I1 (the `unit` row), I11 (R-12: removing them shifts R16 0.510→0.530, R15 0.648→0.666, R9 0.684→0.707), the inventory's own all-strings walk · **Sources.** 3 · **Strength.** STRONG
**Registers.** herald-pools
**Grade.** NEUTRAL — an instrument law, and one of the six traps the probe was built to avoid.
**Anti-AI.** none.
**Drafted rules.** A15 says the Herald and every other register get their own Part A after PROBE-ALL names them, and that the dossier-state laws are **NOT assumed to transfer**. A′-R9 records that the Axis-B mixing of units is a known defect [R-12].
**Transferable.** PARTIAL — carry the caveat into S12; never score a phrase register on a sentence metric.

### 39. A large share of admitted prose carries no terminal stop
**What it does.** Terminal-stop share: R8 0.469, R15 0.588, R16 0.615, R10 0.634, R18 0.660, R3 0.847, R12 0.852 — against 1.000 in R1, R2, R5, R6 and 0.993 in the unwired annex.
**On the page.** —
**Instruments.** I1, I11 ([P-1]) · **Sources.** 2 · **Strength.** MODERATE
**Registers.** dossier-archivist · chrome · compendium-docent · herald-pools
**Grade.** NEUTRAL — the second trap the probe avoided; terminal stop is never required for admission and the share is published so the column's kind is visible.
**Anti-AI.** none.
**Drafted rules.** None; the inventory §4b and §8 hold it.
**Transferable.** PARTIAL.

### 40. The crier is settlement-agnostic by construction
**What it does.** R5's slot-bearing share is **0.032** — it names no place at all, saying "the town" and "the front"; selection is pure FNV-1a, generation never imports it, and its address vocabulary lives in a registry (`NEWS_VOICE_ADDRESSES`) with its own walker.
**On the page.** "Word of the disaster passes from mouth to mouth" (R5)
**Instruments.** I1, I10 (`newsVoiceContract.walker`, `phrasedKindPools.walker`), the inventory's per-home census · **Sources.** 3 · **Strength.** STRONG
**Registers.** herald-pools
**Grade.** STRENGTH — the address chain is registered, walker-gated and deliberately place-free, which is what lets one crier line serve every settlement.
**Anti-AI.** none for the construction; its formula is row 47.
**Drafted rules.** A′-R5 rules the crier a **quoted in-world VOICE** that may keep a formula — but a pool's variants must not share the frame. A16 puts it display-side: byte-inert, a rewording is a declared text shift and nothing more.
**Transferable.** YES.

### 41. The Herald's unit is the headline fragment, and the read-aloud law already holds
**What it does.** R3's terminal-stop share is 0.847 with a 1-segment share of 0.832 and 1.170 segments a variant at 12.2 words — the headline plus at most one causal gesture, which is the annex's own HEADLINE definition.
**On the page.** "{dest} hears out {home}'s envoy" (R3)
**Instruments.** I1, I5, the inventory's register definitions (§2's three Herald registers) · **Sources.** 3 · **Strength.** STRONG
**Registers.** herald-pools
**Grade.** STRENGTH
**Anti-AI.** none.
**Drafted rules.** A′-R3: "Its rule is the read-aloud law (two sentences, who/what/where first) and it already keeps it"; A16 makes any rewording here **OWNER-GATED at the fixture**.
**Transferable.** YES — and it is the one strength the wave must not touch before the freeze.

---

## I. POOL SPREAD AND FORMULA REPETITION

### 42. Pools uniform in segment count
**What it does.** Share of multi-variant pools whose variants all have the same number of segments: R17 1.000, R4 1.000, R9 1.000, R12 1.000, **R6 0.955**, R15 0.907, R8 0.892, R3 0.843, R7 0.714, R5 0.672, R1 0.576 (**408 of 708**), R2 0.513, R14 0.400 — and **R16 0.242, the only register with real shape spread inside a pool** (0.36× the median). [P-3: R10 and R11's nulls enter the median as zeros; no outlier changes side.]
**On the page.** —
**Instruments.** I1, I7 (408/708 against a published 407, +1), I3, I9, I11 (the nulls finding) · **Sources.** 5 · **Strength.** STRONG
**Registers.** all six
**Grade.** FAULT
**Anti-AI.** 10 (sameness — echoed elements) and 5.
**Drafted rules.** A11 makes pool spread a test at the edit — "nor make every variant of a pool the same sentence count where they differed"; B-CLAIM records that **nothing yet mechanises A11**, that illustration pair 5 slipped through because of it, and that the pool's other variants are already loaded in `corpus`.
**Transferable.** NO — cure it, and build the checker.

### 43. Within-pool word spread
**What it does.** Mean within-pool word sd: R9 0.9, R12 1.1, R7 1.2, R15 1.2, R5 1.3, R6 1.5, R8 1.5, R17 1.5, R3 2.1, R1 2.9, R18 2.9 — against the bible's 6.5, JSX chrome 5.8, the causal join 5.1 and the generators' tables 4.8.
**On the page.** —
**Instruments.** I1, I3 · **Sources.** 2 · **Strength.** MODERATE
**Registers.** all six
**Grade.** FAULT
**Anti-AI.** 5, 10.
**Drafted rules.** A11; B0.4's "a short fact beside a long chain".
**Transferable.** NO — cure it.

### 44. The four-line quiet-week pool — the uniform-shape defect in miniature
**What it does.** One R12 pool is four near-identical lines, each 3.7% of a 108-row register, and it is read **weekly**: `passed quietly`, `without event`, `with little to note`, `slipped by` / `calm and uneventful` all mine at lift 2,105.
**On the page.** "The week slipped by, calm and uneventful." (R12)
**Instruments.** I4 (the tic table), I1 (R12's repeated-two-word-opener share 0.667 and uniform-pool share 1.000) · **Sources.** 2 · **Strength.** MODERATE
**Registers.** chronicle-line
**Grade.** FAULT
**Anti-AI.** 10 (sameness — the same well) and 17 (the loop).
**Drafted rules.** A′-R12 names it "the first candidate for pool spread (A11): four shapes for four lines."
**Transferable.** NO — cure it first; it is the cheapest visible win in the wave.

### 45. Two registers sit at the two-variant floor
**What it does.** Mean pool size: **R6 2.0 and R7 2.0** — against the arithmetically derived kind-pool floors of 8 (routine), 6 (notable) and 4 (major), and against R18 12.5, A-W 9.8, R16 8.8, A-U 6.9, R5 6.4, R2 6.0, R17 6.0, R14 5.0, R1 3.2.
**On the page.** —
**Instruments.** I1, I10 (`kindPoolWalker.js` derives the floor; 23 kinds sit on a frozen shrink-only backlog at depth exactly five) · **Sources.** 2 · **Strength.** MODERATE
**Registers.** dm-page · dossier-archivist
**Grade.** FAULT — the estate's own law says "a two-variant chronic kind is exactly as broken as an unregistered one."
**Anti-AI.** 10, 17.
**Drafted rules.** A7 forbids appending to a pool (the length is a seed input; a new sentence goes in a **new pool key by a chair act**). So this fault cannot be cured by the reconstruction wave at all — it needs a chair act, and no drafted rule schedules one.
**Transferable.** NO — cure it, outside the rewrite wave.

### 46. The single strongest formula in the estate
**What it does.** R6's `it is public` recurs in **146 of 1,659 variants (8.8%, lift 4,227)**, `came clean` in 164 (9.9%), `the syndicate` in 126, `public that` in 126, `destroyed but` in 75 (a tokenizer rendering of "destroyed, but" [P-5]). The ten mined tics cover a **union of 744 of 1,659 (44.8%)** — the rows are not additive [R-7].
**On the page.** "It is public that the {role} took the occupier's protection" (R6)
**Instruments.** I4, I1 (the "There/It is" opener row), I3, I11 (the union re-count) · **Sources.** 4 · **Strength.** STRONG
**Registers.** dm-page
**Grade.** FAULT
**Anti-AI.** 9 (the fixed move order — one template for every entry), 10, 17.
**Drafted rules.** A′-R6; B-GRAMMAR (a walker refuses any single order above a ceiling and any same-order-as-previous run) is the instrument that would hold the cure.
**Transferable.** NO — cure it.

### 47. The crier's frame
**What it does.** R5's mould shows through: `and the country` in **26 of 373 lines (7.0%, lift 1,192)**, `the matter of` 10 (2.7%), `market roads` 10, `came to nothing` 8, `the halls of` 8, `over the country` 7, `halls of rule` 7 — and its same-opener-as-previous rate is 0.4242, the estate's worst.
**On the page.** "The matter of arms stands unsettled, and every ear is turned" (R5)
**Instruments.** I4, I5, I1 · **Sources.** 3 · **Strength.** STRONG
**Registers.** herald-pools
**Grade.** FAULT — as a **pool-level** repetition; the formula itself is licensed.
**Anti-AI.** 9, 17.
**Drafted rules.** A′-R5 draws the exact line: the crier is a quoted in-world voice and **may keep a formula**, but a pool's variants must not share the frame — "vary the frame across the pool, not the vocabulary inside it." ⚠ A′-R5 also carries [R-7]: the top ten read as one mould partly because the rows overlap.
**Transferable.** NO for the pool-level repetition; the frame itself is YES.

### 48. The docent's formula is legible and licensed
**What it does.** R10's frames recur at 2–4%: `be undone with` 19 (3.8%), `with options` 14 (2.8%), `war order` 13, `options the` 12, `with the option` 11, `the map undo` 11. (`machinery with` is a tokenizer artifact [P-5].)
**On the page.** "It can be undone with the map undo." (R10)
**Instruments.** I4, I1, I11 (the artifact finding) · **Sources.** 3 · **Strength.** STRONG
**Registers.** compendium-docent
**Grade.** NEUTRAL — a documentation register whose formula is the reader's handrail.
**Anti-AI.** 9 in principle; not convicted, because the entries are read one at a time.
**Drafted rules.** A′-R10: "keep the template; vary the frame only where two entries sit side by side on one page."
**Transferable.** PARTIAL.

### 49. The rumor subject-phrase family repeats its head noun
**What it does.** R17 opens on one noun again and again: `travellers finding` 29 (2.2%), `travellers told` 14, `travellers passing` 11, `travellers advised` 10 — 64 of 1,293 phrases on four grams of the same head — with `entered against the` 10, `entered against a` 9 and `entered in` 16 forming a second frame.
**On the page.** "travellers finding a crossing closed that was open last season" (R17)
**Instruments.** I4, I1 (repeated-two-word-opener 0.006, uniform-pool 1.000) · **Sources.** 2 · **Strength.** MODERATE
**Registers.** herald-pools
**Grade.** FAULT — mild, and structurally constrained: these are subject phrases for a fixed grammatical slot.
**Anti-AI.** 10, 17.
**Drafted rules.** None specific; A15 defers the Herald's Part A, and A′ does not give R17 a row. **Undercovered.**
**Transferable.** PARTIAL.

---

## J. LEXICON, TELLS AND THE REGISTRY

### 50. The lexical half of the AI catalogue is already clear
**What it does.** AI lexical tells per variant, **exogenous** (product vocabulary excluded): R9 0.003, R10 0.002, R1 0.004, R3 0.004, R6 0.006, R16 0.007, R15 0.008 — against raw figures of 0.102 (R9) and 0.084 (R16) that are the product's own words. Juzek & Ward forms, exogenous: **4 in the entire corpus** (R7 2, R8 1, R14 1) against 164 raw in JSX chrome and 72 in inline prose.
**On the page.** —
**Instruments.** I1, I8 (the bible's own 0.015 raw / 0.000 exogenous), I2 · **Sources.** 3 · **Strength.** STRONG
**Registers.** all six
**Grade.** STRENGTH
**Anti-AI.** 19 (the AI lexicon) — **cleared**; the catalogue's structural half (5, 9, 15) is where we still resemble it.
**Drafted rules.** The chair's §2 reading states it: "not AI-flavoured… none of the lexical tells… Our failures are structural, house-flavoured, and measurable."
**Transferable.** YES — this is the estate's strongest single result and the reason the wave is aimed at structure.

### 51. Vocabulary is the narrowest column in the table
**What it does.** Type-token ratio at a **fixed 4,000-token window**: 0.211 against dnd-rules 0.242, martin-narrative 0.296, tolkien-all 0.296, dnd-flavor 0.295, martin-chronicle 0.301, tolkien-elevated 0.305, tolkien-plain 0.348 — the lowest of eight columns, by 13% against the next lowest, not by a factor.
**On the page.** —
**Instruments.** I6 (`primary/extras.py`, with the window fixed after an uncontrolled 20k window was found to penalise the long corpus) · **Sources.** 1 · **Strength.** SINGLE
**Registers.** dossier-archivist
**Grade.** FAULT — with the measurer's own caveat on the record: the estate corpus is many generated facets of *one* town, so some repetition is corpus construction rather than voice; but a reader of one dossier sees precisely this corpus.
**Anti-AI.** 10 (sameness — the same well) and 17.
**Drafted rules.** B0.6 licenses the cure: "the reconstruction may vary the civic noun and the verb across a pool's variants… within the finite-semantics law, never a new claim."
**Transferable.** NO — cure it, bounded by the finite-semantics law.

### 52. Dialogue is absent
**What it does.** Dialogue share 0.0003 in dossier-state, 0.0056 in the Herald receipt pools, **0.000** in the crier and the NPC ladder — against martin-narrative 0.271, martin 0.178, tolkien-plain 0.098, dnd-rules 0.044.
**On the page.** —
**Instruments.** I5, I6 · **Sources.** 2 · **Strength.** MODERATE
**Registers.** all six
**Grade.** STRENGTH as compliance — the catalogue's fault 13 (dialogue on the nose, curt, hooked, one voice) has no surface to land on.
**Anti-AI.** 13 — **cleared by absence**.
**Drafted rules.** None; A1's "the town's own voice about the town" implies it, and product scope forbids the named character's interior.
**Transferable.** YES — keep; and note that this is why no dialogue technique from any exemplar transfers.

### 53. Adverbs sit mid-band
**What it does.** Adverbs per segment: R1 0.163, R8 0.148, R2 0.130, R12 0.127, R14 0.113, R5 0.109, R6 0.090, R3 0.044 — against the bible 0.030, dnd-rules 0.140, dnd-flavor 0.228, martin-chronicle 0.280, tolkien-elevated 0.392, leguin 0.217.
**On the page.** —
**Instruments.** I1, I5, I6 · **Sources.** 3 · **Strength.** STRONG
**Registers.** dossier-archivist · dm-page
**Grade.** NEUTRAL — under every exemplar except the bible's slogan set; not an ornament problem.
**Anti-AI.** 19 (significance adverbs) — not convicted at this rate; A10 rations the specific pet adverbs, which is a different measure.
**Drafted rules.** A12 (the rationed adverb is checked against its sibling pool before it is cut); B0.7 names adverbs as one of the four D&D dials.
**Transferable.** PARTIAL.

### 54. One outright voice-bible violation, exactly one
**What it does.** `src/data/historyData.js:1326` uses the dev-side term "the PCs" on a generation input read on the Timeline — **1 occurrence in 53,662 prose-shaped strings**, and the bible's §5.3 says the term must never reach a user surface.
**On the page.** —
**Instruments.** I2 (the no-floor scan that found it), I1 (the per-register count row) · **Sources.** 2 · **Strength.** MODERATE
**Registers.** dossier-archivist
**Grade.** FAULT — unambiguous, and the smallest fault in this file.
**Anti-AI.** 23 (register invariance — the default breaking through) and 22 (instruction residue).
**Drafted rules.** A′-R8: "the estate's one hard-rule breach lives here… Rule: no reconstruction pass beyond the breach."
**Transferable.** NO — cure it.

### 55. The terminology registry is unmeasured by the hard-rule axis
**What it does.** Axis A measures four hard rules and not the 13-row terminology and verb registry. An independent count finds `DM-private` **5** (all JSX chrome), `publicly visible` / `public-safe` **4** (all JSX chrome) and `profit enormously` **3** (world-data plus the long tail). Not breaches: `AI-generated` 7 (sanctioned by §5.2) and supports/enables/attracts 72 (a preference).
**On the page.** —
**Instruments.** I11 (the independent count), I2 (the axis that missed it) · **Sources.** 2 · **Strength.** MODERATE
**Registers.** chrome · dossier-archivist
**Grade.** FAULT — twelve live registry breaches that the "four hard rules at zero" headline conceals.
**Anti-AI.** 23.
**Drafted rules.** A′-R9/A′-R16 rule chrome out of scope for the wave, on an axis that did not measure this. Together with row 25 this is the second place where "chrome is compliant" rests on an incomplete instrument.
**Transferable.** NO — cure it.

---

## K. REGISTER WALLS

### 56. Second person is confined to the two registers that license it
**What it does.** Second person appears in the generators' arrival tables (read to the table) and in chrome ("part of your campaign world", "your saved settlements", "You've hit the {limit}-save cap") and **nowhere in the record registers** — R1, R2, R3, R5, R6, R17, A-U and A-W carry it at zero, as does the whole dossier corpus.
**On the page.** "You cannot immediately say what, but the settlement has the quality" (R14)
**Instruments.** I1 (the register columns and the tic tables), I4, I10 (`proseLeak.test.js`, the copy tiers) · **Sources.** 3 · **Strength.** STRONG
**Registers.** dm-page · chrome (licensed) · all record registers (zero)
**Grade.** STRENGTH — the wall holds, measured, in both directions.
**Anti-AI.** none. The catalogue's viewer-absent third-person rule is met by the record registers without exception.
**Drafted rules.** A′-R14 ("second person is legitimate here — the arrival is read to the table"); A5 (audience is inherited: a `dm-only` mark carries unchanged and a covert seam may not leak into the player projection); the owner's standing law that the archivist voice is never transplanted onto chrome.
**Transferable.** YES — keep, and make it an explicit rule in Part B rather than an emergent property.

### 57. The bible-distance ordering, and what it does and does not prove
**What it does.** On Axis B, **R2 (2.263) and R1 (1.581) are the two least bible-like** — bootstrap P(bottom 3) 100% and 95.3% over 400 resamples — and R16 (0.512), R15 (0.650) and R9 (0.684) the most, though the third slot is undetermined (P(top 3): R15 80.8%, R16 64.3%, R9 43.5%). **48 of the 67 exemplars (71.6%) come from chrome surfaces**, and a diegetic-only exemplar set moves R1 to 1.880 and R2 to 2.498 — *further* away, ρ(published, diegetic-only) 0.567.
**On the page.** —
**Instruments.** I8, I1, I11 (the bootstraps, the diegetic-only reconstruction, R-11's effective-dimensionality finding of ~13 not 17, R-12's unit mixing) · **Sources.** 3 · **Strength.** STRONG
**Registers.** all six
**Grade.** NEUTRAL — a measurement with half its explanation withdrawn. The honest reading the probe itself gives: the registers furthest from the bible are furthest on exactly the four items already named as the house failure mode — the gloss, the reflexive contrast, the semicolon-stapled second idea, the pet-word set.
**Anti-AI.** none.
**Drafted rules.** A′-R9 carries the caveats verbatim; the chair's §2 reading states the conclusion — "the bible describes chrome, not the record."
**Transferable.** PARTIAL — use it to locate work, never as a quality verdict.

### 58. Four hard rules held at zero breach across nine registers
**What it does.** Summed breach (em dash + exclamation + emphasis caps + digits-in-prose) is **0.000** for R1, R2, R3, R4, R4b, R5, R6, R17 and A-U. The next lowest are R8 0.006, R12 0.009, R7 0.030 and R14 0.043; the highest are R15 0.121 and R10 0.111, both of which the probe labels indicators rather than verdicts.
**On the page.** —
**Instruments.** I2, I1, I10 · **Sources.** 3 · **Strength.** STRONG
**Registers.** dossier-archivist · herald-pools · chronicle-line · dm-page
**Grade.** STRENGTH — bounded by rows 25 and 55, which name what this axis does not see.
**Anti-AI.** none.
**Drafted rules.** B0.8; the bible's own §7 enforcement, three tiers.
**Transferable.** YES — keep, and widen the axis.

---

## L. THE ANNEX AS A REGISTER

### 59. The unwired annex carries the same debt as the wired corpus
**What it does.** The 4,626 rows authored in `docs/content/` and wired nowhere carry the gloss tail at **0.062** (15.5× the median, against A-W's 0.048 and R1's 0.066), pet words at 0.287, "There/It is" openers at 0.038 and pronoun closers at 0.123 — the same tics at the same rates as the prose already shipping. The one row where they diverge sharply is "rather than": A-U 0.009 against A-W's 0.067.
**On the page.** "and a decree binds only the hall that made it" (A-U)
**Instruments.** I1, I3, I11 ([R-5]: the wired join reads 8 CAUSAL rows where a raw-byte scan finds 129, 17.2%, and 13 line-wrapped rows are truncated — so the wired/unwired split is a **join figure and an upper bound**) · **Sources.** 3 · **Strength.** STRONG
**Registers.** chronicle-line · dossier-archivist
**Grade.** FAULT — "wiring imports the debt."
**Anti-AI.** 1, 3, 17 — the same three the wired corpus trips.
**Drafted rules.** A′-UNWIRED: "the reconstruction reads the annex, not the projection, so the unwired rows are rewritten WITH their wired siblings (they are one corpus in the doc)."
**Transferable.** NO — cure it in the same pass, not a later one.

### 60. The wired control is what the reader actually meets
**What it does.** The 4,276-row wired control runs at 15.7 words a segment, sd 8.6 (the widest spread of any record column), 6.3% of segments over thirty, antithesis 0.082, "rather than" 0.067 (**287 rows**), gloss 0.048, pet words 0.411 — and its commonest grams are the corpus's structural furniture: `the town` 736 (17.2%), `at {}` 703 (16.4%), `a stranger` 178 (4.2%).
**On the page.** "A stranger at {settlement} finds {creed}'s house on the main street" (A-W)
**Instruments.** I1, I4, I3 · **Sources.** 3 · **Strength.** STRONG
**Registers.** dossier-archivist · chronicle-line
**Grade.** NEUTRAL — it is the same content as R1/R2/R3 seen from the source side, excluded from every median by design; its value here is that its sd (8.6) is the estate's proof that the record register **can** carry exemplar-grade spread.
**Anti-AI.** none as a column.
**Drafted rules.** A′-UNWIRED; the probe's own §2 note that A-W is a control, not a register.
**Transferable.** PARTIAL.

---

## What the estate does that no exemplar column does, kept on purpose

Four absolutes, all measured on 53,662 strings with no length floor, all held by the record registers without exception: **zero em dashes** (against tolkien 0.048, leguin-nonfiction 0.074, dnd-flavor 0.038), **zero exclamations** (against tolkien-plain 0.065, leguin 0.033), **zero questions** (against martin-narrative 0.081, leguin 0.063), **zero digits**. B0.8 rules them kept: the exemplars' punctuation freedoms are not imported. Row 24's residue of 57 strings and row 25's 65 en-dash breaches are the debt against the first of the four, and they are the only debt.

## The three faults that are ours alone

Measured against all eight exemplar columns, three of our numbers are off the scale in the wrong direction and are not defensible as voice:

1. **"rather than" at 5.33 per thousand words** against a maximum of 0.32 anywhere else (row 19).
2. **", which" at 3.05 per thousand** against Martin's chronicle at 0.00 across 12,422 words (row 34).
3. **Same-opener-as-previous at 0.132** in the dossier and **0.424** in the crier, the highest figures in the whole table (row 12), sitting on top of a neighbour-variation floor of 0.399 that is below every exemplar (row 9).

## The two places a drafted rule is missing

- **Row 25 (the en-dash connector, 65 breaches).** No drafted rule covers it, and the register it most affects — JSX chrome, 7 breaches — is ruled out of scope on an axis that did not measure it.
- **Row 45 (the two-variant pool floor in R6 and R7).** A7 forbids appending to a pool, so the fault cannot be cured by a rewrite at all; it needs a chair act minting new pool keys, and nothing schedules one.

Two further undercovered items: **row 33** (contractions at 0.048 in a diegetic register) and **row 49** (the rumor family's repeated head noun) fall between A′ rows.
