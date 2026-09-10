Seat: Opus 5 — SKEPTIC, Fable-unvalidated. Lens: THE FIGURES AND THE SIZES.

# S12 SKEPTIC PASS — every corpus figure and size in Part B, re-derived

**Scope.** `RULES-V2-PART-B.md` (598 lines, read in full) and `sweep/RECONCILIATION-DOSSIER.md`
(387 lines, read in full). Every figure below was re-derived by a command this seat executed:
from the fourteen `primary/*.fingerprint.json` and the four estate columns, from `PROBE_ALL.md`'s
own table, or by a script over the product tip. **No figure is taken from the main tree.**

**Tree.** Product corpus `$SC/laneB6` at `3b1c0eaa5` (`git rev-parse --short HEAD` = `3b1c0eaa5`).
`git status --porcelain | wc -l` = **0 before**, **0 after**. Read-only throughout; every script
ran with cwd under this scratchpad and wrote only here.

**Method.** `band.mjs` builds the exemplar BAND from the fourteen primaries (`bands.txt`);
`r6b/r6c/r6d.mjs` import the R6 ladder leaves and count per stage; `chron.mjs`/`rest.mjs` import
the chronicle homes; `run1–run6.mjs` and `bdash.mjs` parse string literals (comments stripped) so
that a figure over "strings" is never contaminated by prose in a comment block.

---

## 1. THE EXEMPLAR BAND, RE-DERIVED (the licence for every size)

Executed over `primary/*.fingerprint.json`, n = 14. Estate columns beside it.

| metric | exemplar band (min .. max) | estate-state | herald-pools | herald-crier | npc-ladder |
|---|---|---|---|---|---|
| wordsPerSentence.sd | 8.5 (dnd-rules-srd52) .. 16.0 (tolkien-elevated) | 7.2 | 5.0 | 4.7 | 4.0 |
| neighbourVariation | 0.495 (dnd-flavor) .. 0.805 (leguin-fiction) | 0.399 | 0.330 | 0.178 | 0.167 |
| shareUnder8 | 0.0292 (martin-chronicle) .. 0.3333 (leguin-nf-spoken) | 0.1301 | 0.2038 | 0.0783 | 0.0047 |
| semicolonRate | 0.0085 .. 0.1220 (tolkien-elevated) | 0.1325 | 0.1164 | 0.1869 | 0.5308 |
| antithesisRate | 0.0082 (dnd-rules-srd52) .. 0.0401 (tolkien-elevated) | 0.1088 | 0.0099 | 0.0051 | 0.0071 |
| whichTailRate | 0.0000 (martin-chronicle) .. 0.0370 (leguin-nf-spoken) | 0.0511 | 0.0289 | 0.0000 | 0.0071 |
| adverbsPerSentence | **0.059 (martin-narrative) .. 0.392 (tolkien-elevated)** | 0.162 | 0.044 | 0.109 | 0.090 |
| doubledAdjectiveRate | 0.0057 .. 0.0556 (leguin-fiction) | 0.0144 | 0.0049 | 0.0101 | 0.0107 |
| thereIsOpenerRate | 0.0016 (dnd-flavor) .. 0.0556 (leguin-fiction) | 0.0515 | 0.0197 | 0.0076 | 0.1096 |
| closers.abstractNounRate | 0.0122 .. 0.1151 (dnd-rules-srd52) | 0.0439 | 0.0381 | 0.0202 | 0.0776 |
| closers.pronounRate | 0.0213 (dnd-flavor) .. 0.1083 (leguin-nf-spoken) | **0.1335** | 0.0769 | 0.0455 | 0.0586 |
| sameOpenerAsPreviousRate | 0.0334 (martin-chronicle) .. **0.1667** (leguin-fiction) | 0.1321 | 0.1890 | 0.4242 | 0.3442 |
| runsOfThreeSameLengthBand | 0.1538 .. **0.4082** (dnd-rules-srd52) | 0.3202 | 0.5973 | 0.7273 | 0.2820 |

**Every band correction Part B carries reproduces exactly.** dnd-flavor `abstractNounRate` = 0.077
and `pronounRate` = 0.0213 (A5/NL-7/CC-13's correction — CONFIRMED); abstract-closer band
0.0122–0.1151 (A12's "0.012–0.115"); antithesis floor 0.0082 = dnd-rules-srd52 (D1's correction);
whichTail band 0.0000–0.0370 (H-2/E3); thereIs band 0.0016–0.0556 with leguin-fiction over 162
sentences (R-DA-07); neighbourVariation floors dnd-flavor 0.495, dnd-rules-srd52 0.501,
martin-chronicle 0.508 (hunter D7's correction); sd floor 8.5; shareUnder8 band 0.029–0.333 with
dnd-flavor 0.0787 (H-7/chair E1); pronoun-closer band 0.021–0.108 (H-3); semicolon ceiling 0.122
(NL-3/R-DA-06); documentation abstract-closer sub-band 0.077–0.1151 (CC-13). **Nine corrections,
nine reproductions.** PROBE_ALL's ration median **0.106** and adverb median **0.057** also reproduce
from its own median column, and PROBE's `adverbs / segment` is commensurable with the fingerprint's
`adverbsPerSentence` (R1 0.163 vs estate-state 0.162), so the two instruments may be compared.

---

## 2. SIZES THAT FAIL THE CHAIR'S OWN §0.2 LAW ("the estate MEDIAN is never a target; the exemplar BAND is the licence")

### 2.1 CL-6 — adverbs 0.127 → ≤ 0.06 · REFUTED (HIGH)
R12's 0.127 sits **inside** the exemplar band 0.059–0.392 — 10 of the 14 exemplars are above it.
The proposed ≤ 0.06 is set at the **corpus median 0.057**, expressly forbidden as a target, and
lands below 13 of 14 exemplars, a hair above the band floor 0.059. `reconcile-chronicle-line.md:73`
**prints that band itself** (`0.059–0.392`) in the same row as the 0.127; `refute-chronicle-line.md:89`
re-derived the figures, called them correct, and wrote "the adverb and feeling-word limbs stand as
written" — the band law was never applied to the size. The same rule's `doubled adjective
0.019 → 0` is the same class: 0.019 is inside 0.0057–0.0556 (7 of 14 exemplars above it) and 0 is
below all fourteen. CL-6 is `Shipped: TRUE`, display-side, owner-signed, and drives the R12
rewrite. Internally inconsistent too: R-DA-10/R-DA-18 **hold** the dossier's *higher* adverb rate
0.163 as a floor while CL-6 halves the chronicle's lower 0.127.

### 2.2 R-DA-05 — two of its four fingerprint sizes cut in-band figures · REFUTED (HIGH)
- `runsOfThree` 0.3202 → ≤ 0.28. Band 0.1538–0.4082; 0.3202 is **in band** (dnd-rules 0.3392 and
  dnd-rules-srd52 0.4082 sit above it). The target 0.28 is also in band. No exemplar and no
  internal proof is cited at 0.28.
- `sameOpenerAsPreviousRate` 0.1321 → ≤ 0.090. Band 0.0334–**0.1667**; 0.1321 is **in band**.
  Part B knows this band: **NL-1 uses "the band's top 0.167"** to justify R6's ≤ 0.20, and
  dossier §4.A item 3 prints "the exemplar band … is 0.033–0.167". R-DA-05 cuts against the same
  band without declaring a narrowing.
- The other two are licensed and stand: sd 7.2 → ≥ 8.5 (below the band floor) and
  neighbourVariation 0.399 → ≥ 0.50 (below the band floor). `refute-dossier-archivist.md:18`
  verified R-DA-05's *readings* ("ALL CORRECT") but never tested its *sizes* against the band.

Contrast the honest form: **R-DA-07** cuts 0.051 → ≤ 0.020 on a figure that is also in the full
band (0.0016–0.0556) but **states the narrowing in writing** ("the record registers are the
anchor"). R-DA-05 does not.

---

## 3. UNIT ERRORS THAT SURVIVED THE FOLD

§1.0's unit law names three per-variant ceilings anchored on per-sentence exemplars —
"R-DA-02's 0.0401, R-DA-03's 0.0066/0.0123, R-DA-06's 0.122" — and promises "Those sizes are
re-anchored below." Two were; one was not.

| rule | re-anchored? | evidence |
|---|---|---|
| R-DA-02 | YES | re-anchored on the **per-variant BIBLE column 0.045** (PROBE_ALL BIBLE antithesis = 0.045, CONFIRMED) and the per-sentence figure printed separately as 0.045 × 0.783 |
| R-DA-06 | YES | argues the conversion is immaterial at R2's **1.135 segments/variant** (PROBE_ALL, CONFIRMED) |
| **R-DA-03** | **NO** | keeps ≤ 0.010 *per variant* and merely "restates the justification" against per-sentence exemplars |

R1's own conversion factor is **1.286 segments/variant** (PROBE_ALL). In R1's unit the
record-register exemplars sit at 0.000 (martin-chronicle), 0.029 (tolkien-elevated) and 0.035
(dnd-rules-srd52) — so ≤ 0.010 is roughly **3× stricter** than the nearest non-zero record
exemplar, not "at or below every record-register exemplar" as the rule states. The direction
(0.066 → down; band top 0.0370) is right and the size is not unsatisfiable; the **justification**
is wrong, and R-DA-03 is `Shipped: TRUE`, owner-signed.

**R-DA-04** carries a smaller instance of the same: it writes "the per-variant size is set on the
probe's own unit" and then applies the per-sentence anchor value 0.055 to all four probe columns
(R1 0.133 / R2 0.125 / A-U 0.123 / A-W 0.114) unchanged. Its direction is licensed — the estate's
0.1335 is the one metric here genuinely **above** the band (top 0.1083). Its arithmetic is exact
(0.1335 × 2,914 = 389; 0.055 × 2,914 = 160; 253 × 160/389 = 104).

---

## 4. DOCK RE-TAKES — the figures marked "re-take at laneB6"

All executed at `3b1c0eaa5`. **The R6 stage table discharges clean**: total authored lines
**1,662** (Part B's figure exactly), stages exposed-public 372 · re-adjudicated 182 · reformed 364 ·
re-caused 182 · attributed 378 · historicized 184.

| Part B figure | re-taken at 3b1c0eaa5 | verdict |
|---|---|---|
| exposed-public "It is" 181/372 = 0.487 | 181/372 = 0.4866 | CONFIRMED |
| re-adjudicated "The syndicate"+"The old" 147/182 = 0.808 | 147/182 = 0.8077 | CONFIRMED |
| reformed "With the"+"When the" 151/364 = 0.415 | 151/364 = 0.4148 | CONFIRMED |
| re-caused "What first" 32/182 = 0.176 | 32/182 = 0.1758 | CONFIRMED |
| NL-8 "came clean" 165/364 = 0.453 | 165/364 = 0.4533 | CONFIRMED |
| NL-8 "still" 280 = 0.168 | 280/1662 = 0.1685 | CONFIRMED |
| NL-8 "It is public" 143/372 = 0.384 | **146/372 = 0.3925** | REFUTED (+3) |
| NL-12 `but the` ≈ 0.97 of historicized | 178/184 = 0.9674 | CONFIRMED |
| NL-4 234 gendered male / 0 female | 234 (`he|him|his|himself`) / 0 | CONFIRMED |
| NL-4 "the syndicate" 100 of 182 | 100/182 | CONFIRMED |
| NL-4 "156 assert it fallen" | 142–144 of 182 on any clean lexicon | not reproduced |
| NL-5 101 knows/learn, 64 exposed-public, 37 outside | 88/52/36 stated lexicon; 111/71/40 widened | not reproduced |
| NL-6 `will` 16 · would/could/might 35 | 16 · 35 | CONFIRMED |
| NL-10 "you"/"your" 0 | 0 | CONFIRMED |
| NL-9 register max 41 · p10 19 · 3+-sentence 0.0012 | 41 · 19 · 2/1662 = 0.0012 | CONFIRMED |
| NL-7 top closers: arrangement 63, it 48, them 38, now 26 | 63 / **48 per sentence** (46 per variant) / 38 / 26 | CONFIRMED — the 46→48 correction is a UNIT correction: 48 is `npc-ladder.fingerprint.json` `topClosers` over 1,688 **sentences**; 46 is the count over 1,662 **variants** |

### 4.1 NL-1/NL-8a's raw-bigram ground — CONFIRMED decisively
`and the` per stage at the product tip: attributed 0.693 · re-caused 0.588 · reformed 0.764 ·
historicized 0.250 · exposed-public 0.712 · re-adjudicated 0.797. **Over 0.10 in all six**, so a
raw-bigram ≤ 0.07 ceiling is unsatisfiable and the lift-filtered / content-word formulation is
necessary. The crier's proof rate 26/373 = 0.0697 ✓.

### 4.2 NL-2 and NL-9 are jointly satisfiable — CONFIRMED
Current R6: mean 23.0 words, min 15, max 41, sd 3.76 (per variant; 4.0 per sentence). NL-9 caps
the max at ≤ 34 while NL-2 asks sd ≥ 8.1 with the mean held. On [4, 34] with mean 23 the maximum
attainable variance is ≈ 209 (sd ≈ 14.5), so variance 65.6 is comfortably reachable — and only via
the short line NL-2 separately requires (under-eight 0.06–0.10). The two sizes agree.

---

## 5. THE HERALD AND THE CHRONICLE AT THE PRODUCT TIP

### 5.1 The em-dash ruling — CONFIRMED
`newsVoice.js` at `3b1c0eaa5`: **398 string literals, 0 containing an em dash**; the file's 33 em
dashes are every one of them inside comments. `discourseKernel.js` 0/80; `warReceiptPools.js`
0/477. H-12's "HELD at 0" and B-DASH's "the 27 crier em dashes are the LEDGER tree's" both stand,
and the refuter's ground (2)/(6) rightly falls. The two crier interrogatives are exactly where
H-12 places them: `newsVoice.js:442` (`succor`) and `:496` (`reframe`) — the file's only two
question strings. `newsVoice.js:97` reads "…and every household is counted for the levy." — the
one LIVE BREACH, verbatim at the tip.

### 5.2 `warReceiptPools.js` — the denominator is 85, and 23 is not the line count
Parsed by const boundary: WAR_RECEIPTS 75 + PEACE_RECEIPTS 8 + HEGEMONY_RECEIPTS 2 = **85 keyed
pools** (`DECREE_DEFAULT_RECEIPTS` is a flat array of 4 lambdas, not a record of pools).
- **Part B contradicts itself**: §3.0 prints "pool count 85"; H-8 prints "7 of 86 pools". 85 is right.
- Pools carrying a first-person line: **7** ✓ (resource_pressure, foreign_clash, ingratitude_debt,
  dependency_by_design, spheres_understanding, bonds_of_commerce, hopelessness).
- The one **mixed cell is `ingratitude_debt` (3 of 4)** ✓ — exactly as H-8 says.
- First-person **lines: 27** (`\b(we|our|ours|us)\b/i`), or 21 case-sensitive. **Neither is 23.**
  Both §3.0 and H-8 print 23 and neither states a lexicon.

### 5.3 CL-5's re-derivation on 39 — CONFIRMED exactly
`TREATY_COMPLIANCE_VOICE` imported: **13 families × 3 states (honored/strained/defaulted) = 39
cells, 39 authored strings**. Two-part joints **35** ✓ · lines opening on "The" **36** ✓ ·
semicolons **16** ✓ · one-move lines 39 − 35 = **4** ✓. The reconcile's pre-cure 42-cell
denominator (38/39/17 of 42) is correctly withdrawn; Part B's re-cut numbers are the product's.

### 5.4 CL-1's quiet pools — CONFIRMED, and the sd target is tight but reachable
`QUIET_FALLBACK` = 4 spans × 4 variants = 16 lines, byte-identical in shape across week / month /
season / year. `quiet*` stem in **8** lines (index 0 "passed quietly" ×4 + index 2 "A quiet …" ×4)
→ the "8 → 4" figure is the stem, and the target keeps index 0 ✓. "calm and uneventful" **×4** ✓
(index 3 of each pool). PROBE's R12 repeated-opener 0.667 = 4 of 6 pools ✓ and CL-1 alone reaches
it. On `sd per pool ≥ 3.0`: the week pool is 4/5/7/7 words, sd **1.30** today; with index 0 fixed
at 4 words and the span noun mandatory in every line (`:102`), reaching 3.0 needs at least one
line near 14 words (e.g. 4/6/9/14 gives sd 3.77). Reachable, but the rewrite brief should say so.

### 5.5 CL-2 and CL-8 — CONFIRMED exactly
CL-2's **10** future-indicative strings are exactly the ten, in Part B's stated split:
5 in `demographicReading.js` (one "There is room to grow here…", four "Some will leave…"),
4 in `threatAssessment.js`, 1 in `treatyDocument.js` (the `frayingLine`, "The seam that will tear
first"). CL-8's two new sites are exact: `chroniclersLetter.js:303` is the recall's `when` via
`tickCalendarLabel`, `:423` is `letterToPlainText`'s "(the record from … through …)".

---

## 6. CHROME — TWO CITATIONS FOR THE OWNER'S SIGNATURE THAT DO NOT HOLD

### 6.1 `operationRegistry.js:280` — a comment · REFUTED on the citation
Part B §6.0 flagged this one "re-taken at laneB6 before CC-1's flag is final"; the re-take was
never done. At `3b1c0eaa5`, `operationRegistry.js:280` is `// docket, so it is a real setter of
durable state and belongs in the census proper.` The second-person docent string is at **:284**
(`setAdvanceAutoResolve.description`, "…those decisions wait for you."). CC-1's *count* of three
docent strings survives; the line cited to the owner in dossier §4.D is wrong. The two
`bandLadders.js` citations are exact: **:220** "Not a dial you set. An output you read." and
**:224** "These are the states you will see." (second person **and** the future indicative CC-8
lists for cure).

### 6.2 B-DASH — `searchIndex.js` carries **0** em-dash strings, not 2 · REFUTED (HIGH)
Scanned at the product tip, comments stripped: `customContentSchema.js` **15** ✓ ·
`labelBands.js` **5** ✓ · `dossierViewModel.js` **1** ✓ · `searchIndex.js` **0** (its 12 em dashes
are all in comments; raw `grep -c` = 12, string literals = 0). So the R15 reader-facing total is
**21, not 23**, and B-DASH's headline "**61** reader-facing strings → 0" becomes **59** (R18's 38
not re-taken here — 546 files, out of this lens's reach). This is the list dossier §4.D puts in
front of the owner for signature, so the over-count is on the signature page.

Supporting: B-DASH's R15 accounting (23 reader-facing + 60 dev = 83 em-dash **strings**) cannot be
reconciled with PROBE_ALL §3's R15 em-dash **occurrence** count of 71 — strings can never exceed
occurrences. Either [R-10] scans a wider file set than the probe's 3,883 deduped variants, or one
of the two counts is wrong. Neither deliverable reconciles them. R18 is the same shape:
38 + 14 + 3 + 2 = 57 strings against PROBE_ALL's 44 occurrences.

---

## 7. R-DA-17 / §4.A ITEM 3 — THE OPENER BASELINE IS UNDERSTATED

`estate-state.fingerprint.json` `openers.topOpeners`: `["the", 928], ["ashford", 610], ["what",
232], ["a", 188], ["there", 110], ["ashford's", 90]`, over **2,914** sentences.
- "the settlement token 610 of 2,914 (0.209)" — CONFIRMED as printed.
- But **`ashford's` is a separate opener token at 90**. The settlement *name* opens
  **700 of 2,914 = 0.240**, not 0.209. The direction and the ≤ 0.167 ceiling are unaffected; the
  **baseline the owner is asked to set his number against** (dossier §4.A item 3, one of the
  owner's three numbers) understates the fault by about a seventh.

---

## 8. ARITHMETIC AND ACCOUNTING — CONFIRMED

- §12's counts: dossier 25 + ladder 13 + Herald 12 + chronicle 12 + DM page 13 + chrome 16 = **91** ✓;
  89 inherited + 2 added ✓; 16 survived as written + 73 on a cure = 89 ✓ (the named 16 count to 16 ✓).
- Dossier §2's **79 for signature** = 91 − 10 shipped-false − R-DA-09 − R-DA-16 ✓.
- R-DA-00: R15 reader share 2,758/3,894 = 0.7082 ✓; §8's residue 2,758 − 1,415 − 225 = 1,118 ✓.
- CC-11/B-DASH en-dash 53 + 7 + 4 + 1 = 65 ✓ (the per-register split not re-taken — UNTESTED).
- CC-5's ration multiples: R16 0.106/0.106 = 1.0× ✓, R9 0.094/0.106 = 0.89× ✓, target 0.57× ≈ 0.060 ✓.
- [P-3]'s carried ratios: R16 repeated-opener 3.79× ✓ and uniform 0.242/0.714 = 0.339× ✓.
- H-11 `the compromise` 8/50 = 16.0% ✓; NL-1's crier proof 26/373 = 0.0697 ✓;
  R-DA-05's 79/708 = 0.112 ✓ and 408/708 = 0.576 ✓; R-DA-06's R2 sd 9.4 > A-W 8.6 ✓.
- Every PROBE_ALL cell quoted in Part B §§1–6 that this seat spot-checked (about sixty) reproduces
  from PROBE_ALL's own table. **No PROBE_ALL misquotation was found.**

---

## 9. WHAT THIS LENS DID NOT TEST

R18's 38 reader-facing em-dash strings (546 files); the en-dash split across R15/R18/R8; the
`[R-8]` bible recut (21 of 67 rows) and CC-5's dependent ration; `dm-only-measure.mjs`'s republished
§5.0 cells (fd36f0298, a different sha); the 22 second-person R1 rows (fd36f0298 vs 6e8692b36 vs
own row 56 — three counts, none re-taken here); R7's mean pool 2.0 and its NOT-EXECUTABLE finding;
the `[R-12]` phrase-register law; the two Fable specs (`MOVE-GRAMMAR.md`, `CLERK-LAWS.md`), which
are the seventh lens's.
