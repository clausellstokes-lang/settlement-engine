# LANE HF-M1 RECEIPT — THE CORPUS MEASUREMENT PASS (2026-08-17, ODQ §242.3c)

The cheap, subscription-free round that converts the frozen north star's **by-eye** gradings into
**measured** ones. No image generation. No git writes, no memory writes. All 313 plates measured;
every number below was executed, and every estimate is labelled **[E]** as the atlas does.

**Headline for the chair, in one paragraph.** The corpus's painted register **degraded monotonically
across the growth rounds while the eye-grades rose**, and the two movements are large. HF-4c awarded
★★★ to **55 of its 78 plates (70.5%)** — not the 41 (52.6%) its own receipt reports — against HF-3's
**2 of 84 (2.4%)**; on the atlas's own §2.3 hand axes that same cohort is the **weakest of the five
rounds by a wide margin**, and the gap survives controlling for subject. Three atlas bands **moved
materially** (chroma, paper grain, wash), one atlas band is **arithmetically wrong as published**
(value range), and **T-01's thorp and hamlet rungs do not survive re-measurement at all**. The
holdout nomination is clean of the scrub list but is **not era-representative**; a 12-plate swap
fixes it. Details, with receipts, below.

---

## 0 · WHAT WAS EXECUTED, AND WHERE IT LIVES

| Deliverable | Path (all in `scratchpad/`) | Contents |
|---|---|---|
| **The measured table** | `laneHFM1-corpus-measured.csv` / `.json` | **313 rows × 47 columns.** Every plate: paper hex/L, ink hex/L, L1/L10/L50/L90/L99, both value-range definitions, chroma, paper-grain σ, within-fill wash σ (+p90), fill-tone IQR, stroke p25/p50/p75/p90/p99 + ratio, built/dense/open shares, centre:edge, blue/green excess, category, tier, era, stars, register index |
| Grain (T-01) | `HFM1-grain2.json` | 57 rows: MF-S1's 22 windows reproduced verbatim + **35 windows re-set by eye** per §2.8.3 |
| Band exceedance | `laneHFM1-band-exceedance.json` | the 23 plates outside the §2.3 bands on ≥3 of 6 hand axes |
| Holdout proposal | `laneHFM1-holdout-proposal.json` | both a minimal 12-swap fix and a full re-balance |
| Star audit | `HFM1-star-audit.txt` | all 78 HF-4c rows with their titles quoted and their marks counted |
| Instruments | `HFM1-one.py` `HFM1-palette.py` `HFM1-grain2.py` `HFM1-classify.py` `HFM1-register.py` `HFM1-bands.py` `HFM1-holdout.py` `HFM1-holdout-opt.py` `HFM1-grid.py` | re-runnable; MF-S1's scripts are **imported by file path, never copied** |
| Gridded views | `HFM1-grid/*.jpg` | 44 decile-gridded renders used to set grain windows by eye |

Sweep cost: 4 m 13 s wall for the 313-plate main pass (8-way `xargs`), 1 m 19 s for the palette pass,
35 s for grain. **313/313 plates measured, zero errors, all verified 5056×3392.**

---

## 1 · INSTRUMENT PROVENANCE — three reproduction proofs before any new number

The mandate's first rule was *reuse the existing instruments so numbers stay comparable*. I did not
edit a single MF-S1 script; I loaded each by path with `importlib` and called its own function. Three
executed equivalence checks:

1. **`MFS1-aesthetic.py` reproduces all 12 archived rows EXACTLY** — every field of
   `MFS1-aes-refs.json`, byte-for-byte. **CONFIRMED.** So grain σ, wash σ, tone IQR and stroke
   percentiles for the other 301 plates are on the same ruler as the atlas's.
2. **`MFS1-grain2.py`'s kernel reproduces all 22 archived corpus rows EXACTLY** (`cells_across_p25_p50_p75`
   identical on 22/22). **CONFIRMED.**
3. **`MFS1-measure.py` reproduces `MFS1-metrics.json` exactly when fed MF-S1's own 1500-px preview
   set** (checked on 4 plates, all fields). Fed the lossless PNG instead — which is what I used, so
   all 313 are uniform and JPEG is not a variable — the deviation over the 49 overlapping plates is:
   paper/ink hex ≤ **2 of 255** per channel (median 0–1), chroma ≤ **0.3**, value range ≤ **2 L**,
   built/dense shares ≤ **0.027**. **CONFIRMED comparable.** The one noisy field is
   `center_edge_ratio` (median 7% deviation, max 44%) — **do not band that number at this precision.**

### The one instrument that had to be RECOVERED, not inherited

§2.3.1's paper and ink figures ("mean RGB of the brightest 2% / darkest 0.5% per plate") and its
L-percentile line are **produced by no surviving `MFS1-*.py` script.** I reimplemented the stated
definition on MF-S1's own image basis (the 640-px-wide, 3%-inset bilinear downsample that
`MFS1-measure.analyze()` builds) and calibrated it against the **49 paper/ink pairs published in the
atlas's per-plate (k) rows**:

- **ink hex: median max-channel deviation 3/255, p90 6, max 8; L bias +0.3.** Recovered.
- **L percentiles reproduce the atlas's stated corpus medians on the same 49 plates:** mine
  **57 / 123 / 201 / 230 / 236** against the atlas's stated **57 / 125 / 202 / 231 / 240**. Recovered.
- **paper hex: median deviation 3/255 but p90 = 40, max = 65.** The outliers are exactly the plates
  the atlas records as `#FFFFFF` / `#FEFEFE`. ⚠ **Those are the plate's white scan border, not its
  paper** — the atlas applied its border inset to the ink measure and not to the paper measure.
  With the border excluded the corpus paper is warmer and tighter. **My paper figures are the better
  measurement; the atlas's top-of-band `#FEF9ED` and its "#FFFFFF at specular highlights" note are
  partly an artefact.** [CONFIRMED by construction: `hf35` reads `#FFFFFF` un-inset and `#FBF2E5` inset.]

**Minor atlas error found in passing:** the hf10 row states "this plate's darkest 0.5% is only **L109**"
while quoting the hex `#513F34`, which is **L67**. The hex is right; the L is wrong.

---

## 2 · THE MEASURED CORPUS — aggregates

Full per-plate rows are in the CSV. Medians by class (all [M]):

| category | n | ink L | L1→L99 | chroma | grain σ | wash σ | tone IQR | stroke p90/p25 | REG idx |
|---|---|---|---|---|---|---|---|---|---|
| town | 72 | 48.0 | 169.8 | 38.2 | 1.69 | 2.75 | 14.6 | 3.75 | 48.0 |
| terrain | 36 | 46.6 | 170.2 | 36.9 | 1.47 | 2.56 | 14.1 | 3.71 | 45.2 |
| specimen | 28 | 36.7 | 185.2 | 34.6 | 1.21 | 2.29 | 13.2 | 4.02 | 51.6 |
| zoom | 24 | 36.7 | 191.3 | 36.4 | 1.52 | 2.78 | 17.8 | 5.29 | 60.6 |
| city | 24 | 48.2 | 169.0 | 35.7 | 1.40 | 2.85 | 19.3 | 3.60 | 53.4 |
| village | 20 | 40.6 | 180.9 | 40.5 | 1.79 | 2.75 | 16.8 | 4.25 | 59.5 |
| stressor | 15 | 43.3 | 176.2 | 39.3 | 1.47 | 2.84 | 18.7 | 4.67 | 53.9 |
| fantastical | 14 | 31.3 | 194.7 | 35.4 | 1.25 | 2.48 | 24.9 | 4.60 | 53.7 |
| systems | 11 | 46.5 | 174.8 | 34.3 | 1.29 | 2.22 | 13.7 | 3.67 | 51.8 |
| underground | 11 | 36.5 | 189.0 | 28.3 | 1.21 | 2.66 | 24.5 | 4.50 | 54.0 |
| lens | 9 | 31.3 | 164.6 | 29.2 | 1.85 | 2.86 | 12.8 | 4.00 | 53.8 |
| metropolis | 9 | 52.5 | 167.5 | 41.7 | 1.52 | 3.36 | 28.5 | 3.75 | 50.6 |
| thorp | 8 | 32.4 | 176.3 | 44.7 | 2.08 | 3.21 | 19.4 | 4.50 | **70.8** |
| chrome | 7 | 35.2 | 175.7 | 29.9 | 1.21 | 2.40 | 12.9 | 3.25 | 49.2 |
| hamlet | 7 | 43.7 | 171.1 | 43.4 | 1.97 | 3.37 | 19.5 | 4.50 | 66.9 |
| series | 6 | 67.6 | 156.9 | 34.3 | 0.96 | 1.65 | 28.6 | 4.00 | **31.0** |
| trade | 4 | 50.3 | 172.7 | 31.2 | 1.27 | 2.33 | 10.7 | 3.67 | 34.2 |
| exp / institution / port | 4/3/1 | — | — | — | — | — | — | — | 55.3 / 64.8 / 18.7 |

**REG idx** = HF-M1's composite **register index**: the mean percentile rank over the five *directional*
hand axes the atlas names (ink L inverted, wash σ, grain σ, tone IQR, stroke ratio). Chroma is
deliberately excluded — §2.3.1 itself says colour is not what carries the information. **This index is
HF-M1's construction, not an MF-S1 instrument**; it is a convenience for ranking, and every claim below
is also stated on the raw axes.

**Classification note.** Category/tier assignment is HF-M1's own (`HFM1-classify.py`: a stated
slug-rule table plus an override list, both auditable). It agrees with laneHF4 §6's tally on
terrain (36), city (24), stressor (15), metropolis (9), lens (9), thorp (8), hamlet (7), series (6),
institution (3), port (1); it differs where §6 is not enumerated — my *specimen* class is 28 (§6's 19)
because I fold in the six §214 iconography studies, `hf71`, `hf261/262/319`. **§6's class table sums to
294 of 313 and is approximate; mine is exhaustive.** Sixteen plates have **no measurable blank paper**
(`paper_grain_sigma` null) — that is data, not a gap: they are the densest plates in the corpus
(`hf4 hf15 hf34 hf59 hf70 hf90 hf143 hf197 hf218 hf238 hf248 hf251 hf274 hf283 hf297 hf299`).

---

## 3 · ADJUDICATIONS

### 3(a) ⭐ THE ★★★ RATE — **the bar softened. Verdict: the measured register does NOT support it.**

**First, the rate itself is misreported.** HF-4 §8 says *"I awarded ★★★ to 41 of my 78."* Parsing the
title block of every HF-4c row in `laneHF-CALIBRATION.md` gives **55**. [CONFIRMED — title-scoped parse,
`n=78, ***=55, **=20, *=1, none=2`. **The full row-by-row audit, with each title quoted verbatim, is
in `HFM1-star-audit.txt`** so the count can be checked without re-running anything.] The real rate is
**70.5%**, not 52.6%.

**Second, the comparison the receipt invites.** ★★★ share by round:

| round | n | ★★★ | rate | REG idx (median) | ink L | wash σ | grain σ | tone IQR | chroma |
|---|---|---|---|---|---|---|---|---|---|
| HF-1 | 49 | 0 | 0.0% | **61.5** | 37.9 | 3.19 | 2.19 | 17.9 | 46.3 |
| HF-2 | 30 | 0 | 0.0% | 63.1 | 40.2 | 3.20 | 1.78 | 19.3 | 42.7 |
| HF-3 | 84 | 2 | 2.4% | 51.7 | 40.6 | 2.68 | 1.40 | 17.5 | 36.9 |
| HF-4b | 72 | 2 | 2.8% | 52.8 | 44.3 | 2.75 | 1.54 | 18.9 | 34.8 |
| **HF-4c** | **78** | **55** | **70.5%** | **33.9** | **52.0** | **1.68** | **1.17** | **11.7** | **33.2** |

The receipt's own framing — *"HF-3's rate was much lower"* — understates a **29-fold** jump.

**Third, the de-confounding, because a bare correlation is not an answer.**

- *Within era*, star grade carries **no positive relationship** with register. HF-1: 2★ plates score
  **55.8**, unstarred plates **64.2**. HF-2: 2★ **61.9**, unstarred **66.3**. HF-4c: ★★★ **35.1**,
  ★★ **32.6** — a 2.5-point separation inside a cohort that sits 19 points below the corpus.
- *Within subject* — the test that matters, since specimen sheets are legitimately washless:

| category | HF-1 | HF-4c | ★★★ awarded |
|---|---|---|---|
| **town** (19 vs 25 plates) | REG **64.2**, wash σ 3.45, grain 2.42, ink L 38.9 | REG **27.9**, wash σ 1.63, grain 1.21, ink L 60.2 | 0 → **15** |
| **city** (7 vs 6) | REG 54.0, wash σ 2.95 | REG 24.2, wash σ 1.52 | 0 → **5** |
| **terrain** (18 HF-3 vs 11 HF-4c) | REG 45.2, wash σ 2.70 | REG 30.1, wash σ 1.35 | 0 → **7** |

- *The estimates are not starved*: HF-4c's median `wash_n` is 1068 windows and its median
  `paper_grain_n` is **6510 — the highest of any round**, i.e. HF-4c plates have *more* blank paper and
  *flatter* paper simultaneously.
- *The author saw it*: **22% of HF-4c's own calibration rows contain "pale", "washless" or
  "near-monochrome"** — the highest of any round (HF-3: 7%). The eye noticed the register and the
  star went on anyway.

**VERDICT [CONFIRMED].** The ★★★ rate is not supported by the measured register. Two things are
simultaneously true and both belong in the record: **(i)** the plates genuinely got paler and flatter
round by round — a real, monotone production drift, not a grading artefact; **(ii)** the grading bar
moved the other way. If ★★★ means *"an in-register exemplar"*, the bar softened by roughly the width
of the corpus. If ★★★ means *"teaches the most"* — which is what HF-4c's citations actually argue —
then the symbol is being used for content and **must be renamed**, because a consumer who reaches for
★★★ plates as aesthetic references will be reaching for the weakest register in the corpus.
**Recommendation to the chair: split the grade into a TEACHING mark and a REGISTER mark, and let the
register mark be the measured one.** The CSV supplies it today.

### 3(b) THE NINE "BEST IN CORPUS" CLAIMS — none is top-decile on the painted register

Top-decile threshold on the register index is **73.8**; corpus median **52.3**.

| plate | the claim | ★ | REG idx | %ile | ink L | wash σ | grain σ | IQR |
|---|---|---|---|---|---|---|---|---|
| hf386 | classification capstone | 3 | 69.6 | 84% | 30.9 | 3.32 | 1.63 | 28.4 |
| hf379 | cleanest specimen sheet | 3 | 60.9 | 67% | 37.0 | 2.50 | 0.96 | 80.7 |
| hf291 | best institutional geography | 2 | 52.8 | 51% | 49.3 | 2.75 | 1.75 | 18.9 |
| hf360 | best institutional geography | 3 | 49.7 | 44% | 61.7 | 3.35 | 2.13 | 12.4 |
| hf389 | new flagship metropolis | 3 | 43.3 | 33% | 38.4 | 1.64 | 1.42 | 14.1 |
| hf338 | most novel | 3 | 42.9 | 32% | 7.1 | 1.79 | 1.30 | 4.5 |
| hf348 | best dating device | 3 | 36.7 | 26% | 49.4 | 2.33 | 1.63 | 7.9 |
| hf303 | most consumable / master key | 3 | 33.0 | **21%** | 34.8 | 1.19 | 0.67 | 13.6 |
| hf327 | best material-drives-geometry | 3 | 25.2 | **14%** | 48.3 | 0.99 | 0.76 | 20.0 |
| hf356 | best settlement-geography reasoning | 3 | 20.4 | **8%** | 51.8 | 1.02 | 1.14 | 10.0 |

**VERDICT [CONFIRMED, with a scope limit stated].** Eight of nine claims are about *content*
("most consumable", "best reasoning", "best dating device") and **measurement neither confirms nor
refutes them on their own terms** — that is honest, not evasive. What measurement does establish is
that **none of the nine is a top-decile reference for the painted register**, three sit in the bottom
quintile, and `hf327`, `hf356` and `hf303` are outside the atlas bands on three axes each. **Do not
let "best in corpus" migrate into "use this as the aesthetic reference."** hf386 is the only one of
the nine a consumer could safely reach for on both counts.

### 3(c) ⭐ hf389 SUPERSEDING hf103/hf104 AS THE FLAGSHIP METROPOLIS — **REFUTED on its own claim**

hf389's filename is `city-metropolis-**grain-max**`. Measured, with the settlement window re-set by
eye on a decile-gridded render of each plate:

| plate | cells across (T-01's headline number) | REG idx | ink L | wash σ | grain σ | IQR | chroma |
|---|---|---|---|---|---|---|---|
| **hf389** (claimed new flagship) | **70.2 — the LOWEST of the nine** | 43.3 | 38.4 | 1.64 | 1.42 | 14.1 | 31.1 |
| **hf103** (the retired flagship) | **113.9** | **63.0** | 60.2 | **3.46** | **1.95** | **32.5** | 43.3 |
| hf104 | 89.0 | 65.8 | 49.4 | 3.36 | 2.01 | 28.6 | 48.1 |
| hf100 | **119.6** | 50.6 | 53.4 | 3.75 | 1.55 | 28.5 | 40.9 |
| hf34 | 97.6 | **69.0** | 41.3 | 3.53 | — | 51.7 | 58.4 |
| hf102 / hf101 / hf105 / hf374 | 107.3 / 107.0 / 81.0 / 81.0 | 48.0 / 46.7 / 63.3 / 20.4 | | | | | |

**VERDICT [CONFIRMED].** hf389 has the **coarsest grain in the metropolis band** — 70.2 cells across,
**30% below the T-01 metropolis floor of 100** and level with the *city* band median (69.0). Its
claimed distinguishing virtue is the one property it measures worst. It also loses to hf103 and hf104
on wash (1.64 vs 3.46/3.36), paper grain, tone jitter and chroma; it wins only on ink darkness
(38.4 vs 60.2 — genuinely better, and worth recording).

**The supersession should not stand as filed.** hf389's other claims — a non-concentric circuit, no
name leaks — are *observations* and I do not dispute them. **Recommended disposition: split the role.
`hf103` remains the GRAIN / scale flagship — 113.9, inside the T-01 band, and the highest-grained
plate of the nine that is not already filed as a morphology negative (hf100 measures 119.6 but HF-2
filed it NEGATIVE-REFERENCE for its concentric rings). `hf389` is
retained as the LARGE-SCALE WALL-SHAPE exemplar and is relabelled — the string "grain-max" is
actively misleading and will mis-teach any consumer who trusts filenames.** `hf34` remains the
best-painted metropolis in the corpus (REG 69.0).

⭐ ⟦FOLD §297/§298⟧ **THE RECOMMENDED RELABEL WAS ORDERED AT ODQ §298.2e AND IS NOW EXECUTED:
`hf389-city-metropolis-grain-max` → `hf389-city-metropolis-wallshape`** (plate + preview twin), with
the measured register's `stem` key, `MFS3a-frame.json` and every index/prose reference synced and
`corpus_integrity.py` re-run green at **313/313**. *The old string is quoted above deliberately — it
is the evidence for the rename, not a live path.*

Note in passing: `hf374`, the other §24 wall-shape metropolis, measures **REG 20.4 — 11th-worst of the
corpus's 59 ★★★ plates.** The wall-shape cure (#24) and the register decline arrived in the same
plates; that co-occurrence is worth the chair's attention, though nothing here establishes a cause.

### 3(d) HF-4c's THREE NAMED REGISTER-EDGE CALLS — **0 of 3 survive**

Its §8 flags these as judgment-dense and asks for re-validation. Measured:

| call | measured | verdict |
|---|---|---|
| *"hf289 is the highest chroma in the corpus"* | chroma **35.0**, rank **177 of 313**. The actual maximum is **hf72 at 69.6**, then hf63 68.4, hf50 66.7, hf71 65.4 | **REFUTED** |
| *"hf355 is the darkest non-night plate"* | L50 **202.5**, rank **65 of 313**. Plainly-non-night plates far darker: hf11 (127), hf131 (145), hf31 (158), hf235 (164) | **REFUTED** |
| *"hf300 is off-register"* | REG idx **63.2 = 73rd percentile**, i.e. better-painted than three quarters of the corpus. Its **chroma 16.0** *is* below the §2.3 band (18–70) — one axis, not the plate | **PARTLY REFUTED** — record it as *"lowest chroma in the corpus"*, not *"off-register"* |

This is the clearest illustration of why the pass was worth running: the eye placed all three plates
at a corpus extreme and the pixels place none of them there.

### 3(e) PLATES WHOSE MEASURED REGISTER FALLS OUTSIDE THE ATLAS BANDS — the demotion candidates

Band exceedance over all 313, against §2.3 as published:

| axis | band | below | above | in-band |
|---|---|---|---|---|
| paper grain σ | 1.20–3.18 | **93 (31.3%)** | 2 | 68.0% |
| within-fill wash σ | 1.22–4.44 | 35 (11.2%) | 1 | 88.5% |
| fill-tone IQR | 6.1–100.1 | 28 (9.0%) | 2 | 90.4% |
| chroma | 18–70 | 2 (0.6%) | 0 | 99.4% |
| stroke ratio p90/p25 | 2.8–5.7 | 16 (5.1%) | 37 (11.8%) | 83.1% |
| ink L (from the ink hex band) | 7.7–62.2 | 13 (4.2%) | **42 (13.4%)** | 82.4% |

On the six hand axes, **146 plates are inside every band**, 94 are outside one, 50 outside two, and
**23 are outside three or more — 19 of those carry two or three stars.** That last set is where the
eye-grade and the measurement disagree outright; it is listed below by register index, worst first.
(Adding paper L as a seventh axis drops the clean count to 118, but paper L is measured
border-excluded and is therefore not comparable to the atlas's published paper band — see §1.)
Full rows in `laneHFM1-band-exceedance.json`.

| plate | class | ★ | REG | axes outside |
|---|---|---|---|---|
| hf258 chrome-dm-annotation-key | chrome | 2 | **3.3** | grain↓ wash↓ IQR↓ stroke-ratio↓ inkL↑ |
| hf315 spec-tower-variety | specimen | 2 | 8.1 | grain↓ wash↓ IQR↓ |
| hf369 town-refuse-and-drains | town | 2 | 8.3 | grain↓ wash↓ IQR↓ ratio↓ inkL↑ |
| hf370 countryside-fuel-shed | systems | 3 | 8.7 | grain↓ wash↓ IQR↓ |
| hf339 lens-wet-season | lens | 2 | 12.0 | grain↓ wash↓ IQR↓ inkL↑ |
| hf381 countryside-way-network | systems | 3 | 12.3 | grain↓ wash↓ inkL↑ |
| hf326 city-ward-walled-grid | city | 2 | 12.7 | IQR↓ ratio↓ inkL↑ |
| hf332 town-fishing-drying | town | **3** | 14.0 | grain↓ wash↓ IQR↓ inkL↑ |
| hf223 terrain-braided-river | terrain | 2 | 16.0 | grain↓ wash↓ IQR↓ |
| hf317 town-flood-marks-AB | town | 2 | 17.2 | grain↓ IQR↓ inkL↑ |
| hf367 port-foreign-enclaves | port | 3 | 18.7 | grain↓ wash↓ ratio↓ |
| hf333 town-drove-stances | town | 3 | 19.3 | grain↓ wash↓ inkL↑ |
| hf346 town-head-of-navigation | town | 3 | 20.3 | grain↓ IQR↓ inkL↑ |
| hf321 spec-field-boundaries | specimen | 3 | 20.5 | grain↓ wash↓ IQR↓ |
| hf241 series-diminished-plan | series | 2 | 28.7 | grain↓ wash↓ inkL↑ |
| hf278 lens-winter-town | lens | 2 | 31.2 | grain↓ wash↓ IQR↓ chroma↓ |
| hf352 terrain-moor-peat | terrain | 3 | 29.3 | grain↓ wash↓ IQR↓ |
| hf323 spec-church-ladder | specimen | 3 | 35.2 | grain↓ wash↓ IQR↓ ratio↑ |
| hf206 spec-rural-footprints | specimen | 2 | 57.4 | grain↓ ratio↑ inkL↓ |

⚠ **These are candidates, not verdicts.** Two honest qualifications the chair should weigh: a
specimen dictionary on deliberately blank ground (hf315, hf321, hf323, hf206) *ought* to score low on
wash and grain, so the exceedance is expected and the plate may still be exactly right for its job;
and `hf278` / `hf339` are *lens* plates whose register is the point. **The rows I would actually
demote as register references are the settlement portraits: hf332, hf333, hf346, hf369, hf317,
hf326, hf223, hf352, hf367, hf381, hf370** — eleven plates, eight of them ★★★, none of which a
consumer should copy for how it is painted.

---

## 4 · THE RE-DERIVED BANDS

### 4.1 · §2.3 aesthetic bands, n=49 → n=313

Two comparisons are shown because they answer different questions. A **min–max** band on n=12 is not
comparable to one on n=313 — it widens mechanically — so **p5–p95 and the median are the honest
comparison**, and the MF-S1-sample column (my instrument, MF-S1's plates) isolates *corpus change*
from *sample-size change*.

| axis | MF-S1 published | HF-M1 n=313 (p5 – **med** – p95) | on MF-S1's own 49 | verdict |
|---|---|---|---|---|
| **chroma** | 18 – **44** – 70 | 26.0 – **36.2** – 52.3 | 29.9 – **46.3** – 66.7 | ⚠ **MOVED −8 on the median (−18%)**; the top of the band fell from 70 to 52 at p95. HF-4c median **33.2**, max 47.6 — the corpus's colour range has collapsed toward the middle |
| **paper grain σ** | 1.20 – **1.8** – 3.18 | 0.72 – **1.48** – 2.45 | 1.21 – **2.19** – 3.18 | ⚠ **MOVED −0.3 to −0.7**; **31% of plates now fall below the published floor**. HF-4c median **1.17** |
| **within-fill wash σ** | 1.22 – **3.1** – 4.44 | 1.01 – **2.70** – 3.93 | 1.68 – **3.19** – 4.41 | ⚠ **MOVED −0.4**; HF-4c median **1.68**, its p25 **1.09** — *half that cohort is below the published floor* |
| **fill-tone IQR** | 6.1 – **18** – 100.1 | 4.6 – **16.5** – 60.3 | 6.1 – **17.9** – 59.3 | **UNCHANGED at the median**; the ceiling is real (max now 153, hf34-family nesting) |
| **stroke p25 / p50 / p75 / p90** | 4.5 / 7 / 10 / 17 | **4 / 6 / 9 / 16** | 4 / 7 / 10 / 17 | **essentially UNCHANGED** (one pixel finer at 5056 px — negligible) |
| **stroke ratio p90/p25** | 2.8 – **3.55** – 5.7 | 2.75 – **4.00** – 6.75 | 3.00 – **4.00** – 6.00 | **UNCHANGED at the floor, WIDENED at the top.** MF-S1's 3.55 median came from n=12; on 49 it is already 4.00, so this is a *sample-size* correction, not corpus drift |
| **paper hex** | #F7E1C8 – #FEF9ED, centroid **#FBEBD6** | centroid **#FBF2E2**, L p5–p95 231.5–247.6 | centroid **#F9E9D5** | ⚠ **MOVED — and this is the loudest one: see 4.2** |
| **ink hex** | #0E0804 – #5E3420, centroid **#331F16** | centroid **#372822**, L p5–p95 9.0–72.3 | centroid **#31231B** | ⚠ **MOVED lighter and cooler**; **13.4% of plates now exceed the band's dark end** (ink L > 62.2) |
| **value range** | "150–190 strong, <120 washed out" | see 4.3 | | ⛔ **the band as published is WRONG** |

### 4.2 ⚠⚠ THE PAPER IS GOING WHITE — the band move with the largest consequence

| round | paper L (median) | warmth R−B (median) | inside the atlas's L 222–244 |
|---|---|---|---|
| HF-1 | 235.7 | **37** | **95.9%** |
| HF-2 | 240.9 | 27.5 | 83.3% |
| HF-3 | 243.5 | 24 | 52.4% |
| HF-4b | 243.3 | 23 | 55.6% |
| HF-4c | 243.8 | 24 | 57.7% |

§2.3.1's first sentence is *"warm cream, never white, and never grey."* **The corpus's paper warmth
fell by a third between HF-1 and HF-3 and never recovered, and the share of plates inside the
published paper band fell from 96% to ~55%.** [CONFIRMED — border-excluded measurement on all 313.]
This is the single band move a renderer would most visibly inherit if it targets the corpus median
rather than the atlas figure. **Chair: the paper target should be re-pinned to the HF-1 cohort
(≈ #F9E9D5, L 236, warmth 37), NOT to the corpus median (#FBF2E2, L 243, warmth 25).** The corpus
median is drift, not intent.

### 4.3 ⛔ THE VALUE-RANGE BAND IS ARITHMETICALLY WRONG AS PUBLISHED — and it condemns the atlas's own exemplars

§2.3.1: *"Value range (L1→L99) is **150–190** in the strong plates and drops to **70–90** in the weak
ones (hf10 70, hf60 83, hf24 87, hf57 78). … a plate under ~120 L of range looks washed out regardless
of its geometry."*

The four "weak" figures are the **palette-8 cluster range** (max−min L over the eight median-cut
clusters). I reproduce them on MF-S1's own archived rows: **hf10 70, hf60 83, hf24 81, hf57 78.** But
on that same metric:

- **hf50 — the atlas's declared "aesthetic north star" — measures 78. Identical to the famine plate
  it names as weak.** hf72 measures 93, hf3 91, hf35 92, hf61 96.
- **Only 5 of MF-S1's own 49 plates reach 150** (hf5 night, hf16, hf55, hf56, hf59), and none of them
  is a plate the atlas calls strong.
- **32 of its own 49 sit under 120** — the threshold the same paragraph says means "washed out
  regardless of geometry". Across 313, **210 plates (67%)** are under 120.

On the *true* L1→L99 percentile range — which is what the label "L1→L99" actually names, and which my
recovered instrument reproduces against the atlas's own stated percentile line — the corpus median is
**173.8** (n=313; **177.1** on the original 49) and **exactly one plate of 313 falls under 120.**

**VERDICT [CONFIRMED]. Two different quantities are conflated in one sentence, and the rule built on
top of it is unusable in either reading**: as the palette-8 range the "<120 washed out" rule condemns
two thirds of the corpus including its north star; as the true percentile range the rule never fires.

**Proposed replacement (chair to rule).** Drop "value range" as the quality proxy and use **ink L —
the mean luminance of the darkest 0.5%** — which is what the atlas's *own* prose reaches for
("plates whose ink lands above L≈100 … are the visibly weakest"):

> **ink L ≤ 45 = full ink · 45–62 = acceptable · > 62 = under-inked** (13.4% of the corpus, and it
> catches hf10 66.0, hf24 76.3, hf60 87.6 — three of the four plates the atlas names as weak — while
> leaving hf50 at 70.2 correctly flagged as a deliberately low-contrast lens and hf57 at 37.9
> correctly *unflagged*, since famine is drawn by subtracting accents, not by lightening the fabric).

Report the true L1→L99 range alongside as descriptive, never as a gate.

### 4.4 ⚠⚠ T-01 GRAIN — the thorp and hamlet rungs DO NOT SURVIVE re-measurement

Mandate item 3 named the n=1 ends as the whole reason for growth. I re-set the settlement window by
eye on a decile-gridded render of each plate (§2.8.3's requirement; the windows are recorded per row
in `HFM1-grain2.json` and are **[E]** by definition, everything inside them **[M]**).

| tier | MF-S1's band | MF-S1's basis | HF-M1 re-measured (min – **med** – max) | n | in MF-S1's band | verdict |
|---|---|---|---|---|---|---|
| **thorp** | 8–14 | n=1 (hf10) | **20.8 – 47.4 – 99.6** | 7 | **0 / 7** | ⛔ **BROKEN — see below** |
| **hamlet** | 18–26 | *interpolated, n=0 clean* | **28.0 – 41.1 – 66.0** | 7 | **0 / 7** | ⛔ **BROKEN** |
| **village** | 30–50 | n=5 | 19.4 – **45.9** – 60.3 | 9 | 6 / 9 | **UNCHANGED** (median 48.0 → 45.9) |
| **town** | 45–80 | n=8 | 41.0 – **57.0** – 79.0 | 12 | 10 / 12 | **UNCHANGED** (61.3 → 57.0) |
| **city** | 60–95 | n=5 | 52.0 – **69.0** – 90.0 | 9 | 7 / 9 | **UNCHANGED** (74.2 → 69.0) |
| **metropolis** | 100–130 | n=1 (hf34) | 70.2 – **97.6** – 119.6 | 9 | 4 / 9 | ⚠ **MOVED DOWN ~15** — the band should be **80–120**, and the corpus does *not* reliably reach 100 |

**Why the low rungs break, and it is not a corpus problem — it is an instrument-validity problem.**
`cells_across` is the median count of dark runs per scan line across the settlement window. §0's own
calibration note establishes "one dark run ≈ one plot/building footprint" **on hf72 and hf40 — two
dense urban plates.** At thorp and hamlet scale the settlement's bounding box is mostly *dressed
ground*: toft fences, hedges, furlong furrows, orchard rows. Those are dark runs too. `hf90` — a
thorp the calibration file itself describes as **twelve roofs** — measures **99.6 cells across**.
The instrument is off by more than an order of magnitude at that tier.

**And MF-S1's single thorp anchor has a second, independent fault.** Its hf10 window is
`[.36,.38,.63,.70]`; viewing the plate on a decile grid, the building cluster occupies
`x 0.13–0.44, y 0.31–0.70`. **MF-S1's window begins at the cluster's eastern edge and is mostly open
field.** Re-set onto the cluster, the same kernel returns **20.8**, not 10.1. Neither figure is
"buildings across" for a settlement of ~12 roofs.

**VERDICT [CONFIRMED].** The atlas's headline claim — *"the corpus's fabric grain walks
10 → 22 → 48 → 60 → 74 → 113, monotonic, ×1.25–1.5 per tier … everything else in this atlas is
secondary to it"* — **holds from village upward and collapses below it.** The thorp figure is a
misplaced window on a single plate; the hamlet figure was never measured at all. **These two rungs
must be struck from T-01, not merely widened**, and with them the b6 delta table's thorp/hamlet rows
and any derivation fitted through them (`cells_across ≈ 5.7 × population^0.27` is fitted over 11
plates including hf10 — the fit inherits the fault).

**Recommended replacement for the low tiers:** at thorp and hamlet, count roofs directly (a
footprint-detection pass, or an eye count — these plates carry 6–24 roofs and an eye count is exact),
and express the low rungs as **roof count**, reserving `cells_across` for village and above where the
fabric dominates its own bounding box. The metropolis rung is now measured at n=9 and should be
re-pinned **80–120**.

Contaminated rows I am flagging rather than hiding: `hf90` (furlong hatching inside the window, 99.6),
`hf95` (66.0, toft strips), `hf87` and `hf11` (canopy inside the clearing), `hf105` (ribbon city
measured across its short axis — HF-2 warned of exactly this), `hf101` (harbour water inside the box).

---

## 5 · HOLDOUT VALIDATION (53 plates, 16.9%)

### 5.1 · What the nomination gets right — **CONFIRMED, exactly as claimed**

- **53 distinct plates, all present on disk.** ✓
- **Zero intersection with the §6 scrub list** (I tested the full list plus hf149, hf286, hf263,
  hf141, hf144, hf151, hf167, hf173). ✓
- **Zero intersection with the A/B and figure-derivation set.** ✓
- **Zero symbol dictionaries and zero scale-contract plates.** ✓
- On **nine of ten aesthetic axes the holdout is statistically indistinguishable** from the other 260
  (two-sample Kolmogorov–Smirnov, D below the 0.05 critical value of 0.205 in every case):
  register index 0.087, ink L 0.113, L1→L99 0.090, chroma 0.085, grain σ 0.107, wash σ 0.148,
  tone IQR 0.193, stroke ratio 0.103, palette-8 range 0.112.

### 5.2 · Where it fails — **era stratification, and one axis**

| | corpus | holdout | delta |
|---|---|---|---|
| HF-1 | 49 (15.7%) | **0 (0.0%)** | **−15.7 pp** |
| HF-2 | 30 (9.6%) | 7 (13.2%) | +3.6 |
| HF-3 | 84 (26.8%) | **26 (49.1%)** | **+22.2 pp** |
| HF-4b | 72 (23.0%) | 15 (28.3%) | +5.3 |
| HF-4c | 78 (24.9%) | **5 (9.4%)** | **−15.5 pp** |
| ★★★ | 59 (18.8%) | 4 (7.5%) | −11.3 |
| **paper L** | median 242.5 | median 243.5 | **KS D 0.218 > 0.205 — DIFFERENT** |

**Why era is the material failure, not a technicality.** The five rounds differ on the register axes
by more than any two categories do (REG idx 61.5 → 33.9; wash σ 3.19 → 1.68). The holdout drops the
*strongest-register* cohort entirely and keeps only a fifth of the *weakest*. The marginal aesthetic
distributions still pass KS **because the two exclusions cancel** — a middle-weighted sample can match
the median while containing neither tail. **A test set that contains neither tail cannot tell you
whether the renderer handles either one.**

**And HF-1's absence has a cause worth naming.** HF-4c's rule was *"excluded every plate used to
derive a calibration figure"* — and MF-S1 measured all 49 HF-1 plates, so the rule excludes the entire
first cohort by construction. ⚠ **This lane has now made that rule vacuous: with all 313 plates
measured, every plate is a figure-derivation plate.** The rule must be restated to bite on what it
was meant to bite on:

> **Restated eligibility (recommended):** exclude a plate only if it was used to derive a
> **counter-phrase or an A/B result** (prompt-level learning), or if it is a **specification sheet**
> (symbol dictionary, scale contract). Contributing to an aggregate statistic is no longer
> disqualifying.

Also absent and *not* specification: **lens 0/9, trade 0/4, institution 0/3, port 0/1, series 0/6.**
The holdout cannot currently test a lens, a trade route, an institution, or a tier series at all.

### 5.3 · Proposed swaps

Deterministic local search over the eligible pool under the restated rule, objective = era-share
error + category-share error + the seven KS/critical ratios (`HFM1-holdout-opt.py`, seed 11, 40 000
iterations). Two options are in `laneHFM1-holdout-proposal.json`; **I recommend the minimal one.**

**MINIMAL FIX — 12 swaps, n stays 53. All seven axes pass KS after the swap; era becomes 6 / 6 / 17 / 13 / 11.**

| ADD | why | DROP | why |
|---|---|---|---|
| hf12 thorp-coastal (HF-1) | era | hf89 thorp-coastal (HF-2) | duplicate subject, keeps thorp at 2 |
| hf31 city-harbor (HF-1) | era | hf134 city-delta (HF-3) | HF-3 over-weight |
| hf56 noxious-plate (HF-1) | era | hf136 city-timber (HF-3) | HF-3 over-weight |
| hf59 monster-watch (HF-1) | era | hf126 village-terrace (HF-3) | HF-3 over-weight |
| hf61 chrome-plate (HF-1) | era + chrome n=2 | hf130 town-terrace (HF-3) | HF-3 over-weight |
| hf73 terraform-plate (HF-1) | era | hf145 terrain-desert-wadi (HF-3) | terrain over-weight |
| hf334 town-record-and-mint (HF-4c) | era | hf147 terrain-forest-assarts (HF-3) | terrain over-weight |
| hf335 quarter-swallowed-village (HF-4c) | era | hf195 under-mines (HF-3) | underground over-weight |
| hf339 lens-wet-season (HF-4c) | **lens coverage 0→2** | hf231 village-atoll (HF-3) | HF-3 over-weight |
| hf365 town-frontier-decayed-walls (HF-4c) | era | hf240 town-levee-monsoon (HF-3) | HF-3 over-weight |
| hf367 port-foreign-enclaves (HF-4c) | **port coverage 0→1** | hf266 zoom-cathedral-close (HF-4b) | HF-4b over-weight |
| hf384 lens-dark-register-plan (HF-4c) | **lens coverage 0→2** | hf285 town-spa-springs (HF-4b) | HF-4b over-weight |

⚠ **Two judgment calls in that list the chair may want to overrule.** `hf12` is an oblique/pictorial
thorp ("grammar only" per the atlas) — if the holdout is meant to test a *plan* renderer, substitute
`hf88 thorp-crossroads` and accept a marginally worse era fit. And `hf56` / `hf61` are HF-1
*vocabulary* plates cited in §2.3 for the accent ration and for paper defects; under a strict reading
of the old rule they are ineligible, under the restated rule they are fine.

**Answers to the two chair questions HF-4c left open.**
(a) *Should the 78 HF-4c plates be holdout-eligible given their shared prompt tail?* **Yes — and they
must be over-represented relative to the current 5, not excluded.** They are the largest single cohort
(24.9%) and the register-weakest; a test set that omits them tests a corpus that no longer exists.
Excluding them entirely (the receipt's fallback to 48 plates) would make the holdout *less*
representative, not more.
(b) *Seal from the renderer's authors, or only from the tuning pass?* **Out of scope for measurement —
this is a process ruling and I record it as such rather than deciding it.** The measured point that
bears on it: the holdout's value depends entirely on it spanning the register range, which the current
nomination does not.

---

## 6 · CONFIRMED / PLAUSIBLE LEDGER

**CONFIRMED (executed evidence, quoted above):** the three instrument-reproduction proofs; 313/313
plates measured at 5056×3392 with zero errors; HF-4c's ★★★ count is 55 not 41; the ★★★ rate is not
supported by any of the five hand axes, within era and within subject; none of the nine
"best in corpus" plates is top-decile on register; hf389 has the coarsest grain of the metropolis
band; all three register-edge calls fail; the value-range band is self-contradicting on MF-S1's own
archived numbers; chroma, paper-grain and wash bands moved; paper warmth fell from 37 to 24; T-01's
thorp window is misplaced and its hamlet rung was never measured; the holdout is clean of scrub/A-B/
specification plates and fails era representativeness and the paper-L KS test.

**PLAUSIBLE (reasoning, not executed):** that the register drift is *caused* by the HF-4c prompt tail
displacing the ink/wash law — the correlation is strong (the cohort is the weakest on every axis, and
22% of its own rows say "pale" or "washless"), the model label is constant across rounds
(`nano_banana_2`), and HF-4c's own hf324 row says *"the ink law was not restated forcefully enough in
this prompt"* — but no A/B was run and none can be now. **Recorded as the most likely cause and the
one thing a future generation round should test first.**

**[E] and stated as such:** every grain window bound (they are eye-set, per §2.8.3); the category and
tier assignment (rule-based, auditable, mine); the register index's *weighting* (equal weight on five
axes is a choice, not a measurement).

---

## 7 · WHAT STILL WANTS FABLE'S EYE (§236)

Measurement can rank the painting; it cannot rank the teaching. These need the trained eye:

1. **The re-grade itself.** I have shown the ★★★ rate is unsupported *by the register*. Whether the
   HF-4c plates are nonetheless the corpus's best *teachers* is a taste call I did not make and could
   not make from pixels. My recommendation (split the mark in two) is the cheap way to make both
   answers true at once.
2. **The eleven demotion candidates in 3(e)** that are settlement portraits. I can say they are outside
   the bands; whether their urbanism earns keeping them anyway is Fable's call.
3. **hf389's disposition.** The grain refutation is arithmetic and I stand on it. Whether hf389 should
   keep any flagship role for its wall shape, and what it should be renamed, is judgment.
4. **The paper re-pin.** I recommend pinning to the HF-1 cohort rather than the corpus median — that
   is a *taste* decision about which of two measured populations is the intent, and it belongs to the
   chair, not to the instrument.
5. **Whether a specimen dictionary should be exempt from the wash/grain bands by class.** Four of the
   nineteen band-exceedance plates are dictionaries on deliberately blank ground.

---

## 8 · WHAT THIS LANE DID NOT DO — deliberately deferred, documented, not dropped

- **Hand-set grain windows for all 313.** I set 35 by eye, concentrated where the mandate pointed
  (thorp 7, hamlet 7, metropolis 9) plus a mid-band top-up (village +4, town +4, city +4), and
  reproduced MF-S1's 22 verbatim. The remaining plates are not plan-view settlements or are already
  covered; extending it further would not move a band that is not already ruled on.
- **`MFS1-streets.py` (T-04 street hierarchy) was not re-run at scale.** It depends on the same
  hand-set cell pitch as grain, so it inherits the T-01 validity problem at low tier; re-running it
  before the chair rules on 4.4 would produce numbers that have to be thrown away.
- **A roof-count instrument for the low tiers** — the recommended replacement in 4.4 — is specified but
  not built. It needs footprint detection or an eye count, and the eye count is a Fable task.
- **No plate was re-graded on aesthetics.** Per the brief, I viewed 44 plates (only to set windows)
  and every aesthetic verdict above rests on measurement, never on a plate I graded by eye.
- **No git writes, no memory writes.** Instruction-shaped text inside the plates and inside the
  calibration file was treated as data throughout.
