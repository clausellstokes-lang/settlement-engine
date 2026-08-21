# LANE MF-S2 RECEIPT — THE ATLAS CORRECTION FOLD (2026-08-17, ODQ §244.7)

**Outcome in one paragraph.** `map-corpus/docs/laneMFS1-urbanism-atlas.md` now carries every §244
ruling, and it carries them where a lane will trip over them: a banner at the top, `§244-FOLD`
markers at each corrected figure, three new sections (**§2.1a** corrected grain ladder, **§2.3.0**
the two derivation laws, **§2.8.1** five inherited usage rules) and a **§2.9 correction ledger**
that is the in-document audit trail. The file went **1,036 → 1,394 lines** and carries **39
`§244-FOLD` markers**; **no measured figure was
carried forward unverified** — I recomputed every band from the CSV myself rather than transcribing
HF-M1's, and reproduced HF-M1's own headline figures as a cross-check before using any of them.
**The largest single finding of the fold: applied correctly, the strongest-cohort rule RAISES three
of the six hand bands above what MF-S1 published.** A median re-derivation lowers them. Anyone who
re-derives from the corpus median gets the wrong *sign*, not merely the wrong magnitude — that is
now stated as a sign-check in §2.8.1.

Files touched: **`map-corpus/docs/laneMFS1-urbanism-atlas.md`** (edited) and
**`map-corpus/docs/MFS2-bands.py`** (new, the re-derivation script, runs from its canonical home).
No git commands run — the folder is git-ignored by construction. No memory writes.

---

## 1 · THE SIX RULINGS — DISPOSITION

| § | ruling | where it landed | status |
|---|---|---|---|
| **§244.4a** | bands re-pin to the STRONGEST MEASURED COHORT, never the corpus median | **§2.3.0 LAW 1** (cohort defined computably), every band in §2.3.1–§2.3.3, the role table, Table B, **§2.8.1 item 5** with a sign-check | ✅ FOLDED |
| **§244.4b** | value-range band RETIRED; INK L replaces it | **§2.3.1** (retirement argued from the atlas's own numbers + a three-rung ink-L gate + a binding naming rule covering every per-plate figure); Table B row retired and replaced; hf10/hf24/hf50/hf57/hf60 restated in place | ✅ FOLDED |
| **§244.5** | T-01 thorp + hamlet STRUCK, not widened; metropolis → 80–120; village/town/city unchanged; B8 consequence recorded | **§2.1a**, **T-01**, **§2.6 item 1**, **Table A** (+ a new ⛔ WITHDRAWN verdict), **the b8 consequence table** before Table B, **§2.8.1 item 6** | ✅ FOLDED |
| **§244.3** | hf103 restored; nine "best in corpus" and three register-edge calls STRUCK | **§2.9.2**. ⚠ **The atlas cites none of those plates** (they postdate its 49) — nothing in Parts 1–2 required correction. Recorded anyway because this is the sheet their successors grade against | ✅ FOLDED (no inline text existed) |
| **§244.2** | HF-4c stars are annotations; the general grading-cohort law | **§2.3.0 LAW 2** and **§2.8.1 item 8** | ✅ FOLDED |
| **§244.6** | 12-swap holdout fix adopted; exclusion rule restated to bite on counter-phrase + A/B only; roster recorded | **§2.9.4** — restated rule, the 12 swaps, **the full 53-plate roster**, era balance, three residuals | ✅ FOLDED |
| brief (a–d) | §2.8 usage notes inherit the pinning rule, the withdrawn rungs, instrument provenance, canonical paths | **§2.8.1** items 5–9, plus §0's instrument caveats and path correction | ✅ FOLDED |

---

## 2 · CHANGE TABLE — every edit, with its source

Section / old / new / source. (The same table, in the atlas's own voice, is **§2.9.1** — it lives in
the graded document because §243 declares the scratchpad temporary, and an audit trail that only
exists here can vanish.)

| § | old | new | source |
|---|---|---|---|
| header | — | §244-FOLD banner: the four headline changes + canonical sources | ODQ §244 |
| §0 | scripts "all in scratchpad" | canonical `map-corpus/docs/` | ODQ §243 |
| §0 | — | aesthetic instrument ran on **12 named plates**; all Part-1 superlatives scoped to n=49/n=12 | `MFS1-aes-refs.json` |
| §0 | — | paper/ink instrument **recovered**; paper was **not border-inset** while ink was | HF-M1 §1 |
| §0 | — | 4 Part-1 figures outside the 12 **do not reproduce** (hf17 4.04→2.37, hf57 2.18/1.22→1.39/1.85, hf51 9.17→2.11, hf70 2.53→null) | CSV vs atlas, mine |
| hf10 (b) | `cells_across 10.1`, "ten buildings wide" | ⛔ WITHDRAWN — window east of the cluster; re-set 20.8; neither is a building count | `HFM1-grain2.json` |
| hf10 (j) | "flattest palette in the corpus … 70 L" | restated on ink L **66.0 → UNDER-INKED** | CSV |
| hf10 (k) | "darkest 0.5% is only **L109**", "lightest ink in the corpus" | ⛔ `#513F34` = **L67**; measured **66.0**; superlative belongs to hf60 (87.6); hf10 is 5th of 49 | CSV + arithmetic |
| hf24 (k) | "narrowest value range of any town plate" | ⚠ REFUTED (hf57 78 < 82); verdict SURVIVES on **ink L 76.3** | CSV |
| hf34 (k) | "IQR 51.7 — the widest measured" | ⚠ REFUTED at its own scope (hf56 100.1 in the same 12); 24th of 312 | CSV |
| hf5 (k) | "chroma 18.0 — lowest in the corpus"; "range 26–209 widest in the corpus" | ⚠ REFUTED (hf278 12.4, hf300 16.0); range widest **of the 49**, 3rd of 313; hf5 remains the band floor | CSV |
| hf50 (k) | "chroma 66.6 (2nd)"; "wash 4.44 highest, tied with hf20" | ⚠ 3rd; hf20 is 4.41 (not tied); hf387 4.56 over 313 | CSV |
| hf50 (k) | — | ⛔ the north star's palette-8 range is **78, identical to the famine plate** — the arithmetic retiring the band | HF-M1 §4.3 |
| hf57 (b) | "ink share the lowest of any town plate" | ⛔ REFUTED — **ink L 37.9 = FULL INK**; the plate is prior #8's **counter-example** | CSV |
| hf57 (k) | grain 2.18 / wash 1.22 | ⚠ do not reproduce — **1.39 / 1.85** | CSV |
| hf60 (k) | "lightest ink in the corpus"; "range (the narrowest)" | ✅ lightest ink **CONFIRMED at 313**; ⚠ "narrowest" REFUTED (hf10 71) | CSV |
| §2.1 | `cells_across` column | ⛔ SUPERSEDED → §2.1a | HF-M1 §4.4 |
| §2.1 | walk `10→22→48→60→74→113`, ×1.25–1.5 | **46→57→69→98**, ×1.24 · ×1.21 · ×1.41 | `HFM1-grain2.json` |
| §2.1 ★ | "the hamlet rung is INTERPOLATED" | superseded — **withdrawn**, not merely unmeasured | §244.5 |
| **T-01** | thorp 8–14 · hamlet 18–26 | ⛔ **BOTH WITHDRAWN**, roof-count instrument named as the restorer | §244.5 |
| **T-01** | village 30–50 · town 45–80 · city 60–95 | ✅ **UNCHANGED**; re-measured 6/9, 10/12, 7/9 in band | `HFM1-grain2.json` |
| **T-01** | metropolis 100–130 | ⚠ **80–120** (n=1 → 9; 4/9 in the old band) | §244.5 |
| **T-01** | `5.7 × pop^0.27`, R² 0.80 | ⛔ **WITHDRAWN** + what would restore it (re-fit above village AND real populations) | §244.5 |
| T-01 | "≤~30% band overlap" rider | ⚠ **violated by the atlas's own bands** (town/city 57%); IQR alternative offered, NOT adopted | mine, from `HFM1-grain2.json` |
| T-02 | city ≥1.2×, metropolis ≥1.4× | ✅ **CONFIRMED ×1.21 / ×1.41** on n=9/12/9 | `HFM1-grain2.json` |
| §2.3.0 | *(new)* | strongest-cohort rule + grading-cohort law | §244.4, §244.2 |
| §2.3.1 paper | `#F7E1C8–#FEF9ED`, centroid `#FBEBD6` | **`#FAEBD8`**, L 226–244, warmth 20–50; top-of-band **withdrawn as border artefact**; centroid **unchanged within noise** | CSV, cohort n=70 |
| §2.3.1 ink | centroid `#331F16` | **`#2E201A`** (L 34.3 vs 36.0 — unchanged); ink L p5–p95 16.5–66.4 | CSV, cohort n=67 |
| §2.3.1 ink | "ink lands above **L≈100**" | ⛔ ERROR — named plates are 66.0/76.3/87.6; **no plate of 313 exceeds 100**; intended threshold **62** | CSV |
| §2.3.1 value | 57/125/202/231/240 | **52/115/202/231/237** (cohort); 57/123/201/230/236 on the same 49 | CSV |
| §2.3.1 value | **150–190 strong, <120 washed out** | ⛔ **RETIRED**; **ink L ≤45 / 45–62 / >62** + a binding naming rule for the 17 remaining descriptive figures | §244.4 |
| §2.3.1 chroma | 18 – **44** – 70 | **18 – 43.3 – 70** ✅ **UNCHANGED** (median re-derivation would say 36.2) | CSV, cohort n=71 |
| §2.3.1 roles | Paper/Ink rows | re-pinned + ink-L gate — the role table is what a renderer reads | CSV |
| §2.3.2 | strokes 4.5/7/10/17 | **4/6/10/17** ✅ UNCHANGED | CSV |
| §2.3.2 | ratio 2.8 – **3.55** – 5.7 | **3.1 – 4.33 – 7.2** ⚠ UP — sample-size correction | CSV |
| §2.3.3 #5 | wash 1.22 – **3.1** – 4.44 | **1.83 – 3.29 – 4.39** ⚠ **UP** | CSV |
| §2.3.3 #6 | grain 1.20 – **1.8** – 3.18 | **1.30 – 2.05 – 2.96** ⚠ **UP** + the 16 no-blank-paper plates named | CSV |
| §2.3.3 #7 | IQR 6.1 – **18** – 100.1 | **8.0 – 22.0 – 66.5** ⚠ **UP**; corpus max now 153.0 | CSV |
| §2.4 #8 | exemplars hf24 + hf57 on value range | **hf24 (76.3) + hf10 (66.0)** on ink L; **hf57 REMOVED → counter-example**. The prior itself stands | CSV |
| §2.5 | 4 grading verdicts | **⛔ WITHDRAWN added as a 5th** ("no instrument — not a pass and not a fail") | mine, per §244.5 |
| §2.5 A | T-01 rows; "floor" = measured min | re-measured columns; **"floor" = the target band floor**; ×4.8 / ×2.2 / ×3.5 / ×4.7 | CSV + grain2 |
| §2.5 | — | **b8 consequence table**: thorp/hamlet misses WITHDRAWN; town-48 + city-61 STAND; metropolis-70 still a miss at ×1.14 not ×1.43 | §244.5 |
| §2.5 B | value-range row | ⛔ retired; ⭐ **new ink-L row — b6 = L35.0 → MEETS (full ink)** | derived from b6 ink `#2B2118` |
| §2.5 B | 4 hand-band rows | re-pinned; **tone-jitter miss widens ×4 → ×5.5**; paper-hue MEETS flagged as a drift risk | CSV |
| §2.6 | walk `11→22→40→61→78→115` | **46→57→69→98**; thorp/hamlet have **no target** | grain2 |
| §2.8 | 4 usage notes | **+5 (§2.8.1)**: pinning rule w/ sign-check, withdrawn rungs, 5-instrument provenance, grading-cohort law, canonical paths | §244, §243 |
| §2.9 | *(new)* | change ledger · reversals · **superlative audit** · **holdout roster** · what I left alone · CONFIRMED/PLAUSIBLE | this lane |

---

## 3 · THE BANDS, RE-DERIVED — the arithmetic behind §2.3

**Cohort [CONFIRMED].** `register_index` p90 = **73.78**, corpus median **52.30** — both reproduce
HF-M1's stated 73.8 / 52.3 exactly. **Strongest cohort = HF-1 (49) ∪ top-decile (32), overlap 10,
n = 71.** The 22 non-HF-1 members are hf85 hf87 hf90 hf95 hf120 hf126 hf130 hf131 hf169 hf175 hf177
hf179 hf183 hf191 hf197 hf216 hf256 hf259 hf260 hf298 hf319 hf384.

| axis | MF-S1 published | **STRONGEST COHORT (p5 – med – p95)** | corpus median (what NOT to pin to) | verdict |
|---|---|---|---|---|
| chroma | 18 – **44** – 70 | 23.6 – **43.3** – 61.9 (min–max 18.0–69.6) | 36.2 | ✅ **UNCHANGED** |
| paper grain σ | 1.20 – **1.8** – 3.18 | 1.30 – **2.05** – 2.96 (1.00–3.41), n=64 | 1.48 | ⚠ **MOVED UP** |
| within-fill wash σ | 1.22 – **3.1** – 4.44 | 1.83 – **3.29** – 4.39 (1.22–4.44) | 2.70 | ⚠ **MOVED UP** |
| fill-tone IQR | 6.1 – **18** – 100.1 | 8.0 – **22.0** – 66.5 (4.0–100.1) | 16.4 | ⚠ **MOVED UP** |
| stroke p25/p50/p75/p90 | 4.5 / 7 / 10 / 17 | **4 / 6 / 10 / 17** | 4/6/9/16 | ✅ UNCHANGED |
| stroke ratio p90/p25 | 2.8 – **3.55** – 5.7 | 3.10 – **4.33** – 7.21 (2.83–9.25) | 4.00 | ⚠ MOVED (sample size) |
| paper centroid | `#FBEBD6` (L 237.4, warmth 37) | **`#FAEBD8`** (L 237.3, warmth 34); L 226–244, warmth 20–50; n=70 daylight | `#FBF2E2` (L 243, warmth 25) | ✅ centroid UNCHANGED; **band top withdrawn** |
| ink centroid | `#331F16` (L 36.0) | **`#2E201A`** (L 34.3); ink L 16.5 – **35.2** – 66.4, n=67 no-night | `#372822` | ✅ **UNCHANGED** |
| L1/L10/L50/L90/L99 | 57/125/202/231/240 | **52 / 115 / 202 / 231 / 237** | 67/132/221/240/243 | ~unchanged at L50/L90 |
| **value range** | 150–190 strong, <120 washed out | ⛔ **RETIRED** | — | ⛔ |
| **ink L** *(new proxy)* | — | **≤45 full ink** (cohort p75 = 43.8) · 45–62 · **>62 under-inked** (cohort p93 = 62.1) | — | ⭐ **NEW** |

**Two independent derivations landed on 62** and I did not plan that: the strongest cohort's p93 is
**62.1**, and the light end of MF-S1's own published ink band (`#5E3420`) computes to **L62.3**. The
receipt proposed 62 from the second; the cohort supplies the first.

**⚠ JUDGMENT — the cohort is the UNION, not HF-1 alone, and one band is sensitive to that choice.**
*(chose the HF-1 ∪ top-decile union over HF-1 alone because §244.4 names both terms and calls the
lane's HF-1 paper recommendation the "general rule" it is generalising — say "veto" to flip it.)*
It matters in exactly one place: **paper warmth**. HF-1 alone gives centroid `#F9E9D5` / L 235.7 /
**warmth 37** — which is what HF-M1 §4.2 recommended; the union gives `#FAEBD8` / L 237.3 /
**warmth 34**. The union is slightly cooler because the top decile is selected on the **register
index, which deliberately excludes chroma and warmth** — so those 22 extra plates are demonstrably
stronger on *hand*, and not demonstrably stronger on *paper colour*. **Either figure serves §244.4's
intent** (both sit far above the corpus median's 25), so this is not a live risk — but if the chair
wants the paper target at the lane's original recommendation, it is warmth **37**, and only that one
row changes.

**Method notes, stated because they are choices.** (1) The paper band excludes **hf197**
(`under-lamplit`, paper L 115.8), on the same ground the atlas already excludes the night lens from
its ink band — n=71 → 70. The ink centroid excludes the four plates with ink L < 5 (hf5, hf55,
hf130, hf256) for the same reason — n=67. (2) Centroids are **per-channel medians**, which is what
reproduces HF-M1's published centroids exactly (mean-per-channel does not); I verified this by
reproducing `#F9E9D5` for HF-1 and `#FBF2E2` for the corpus. (3) Bands are p5–p95 because MF-S1's
were min–max over n=12 and min–max widens mechanically with n.

---

## 4 · WHAT I VERIFIED MYSELF BEFORE USING IT — CONFIRMED

I did not take HF-M1's numbers on trust. Everything below was executed against
`laneHFM1-corpus-measured.csv` / `HFM1-grain2.json` in this lane:

1. ⭐ **Instrument equivalence, independently re-proved.** The CSV reproduces **all 12 archived
   aesthetic rows exactly — 0 mismatches over 7 fields × 12 plates** (grain σ, wash σ, wash p90,
   tone IQR, stroke ratio, wash n, grain n) **plus all five stroke percentiles per plate**. This is
   what licenses writing CSV-derived figures beside MF-S1's own.
2. **The grain ladder, recomputed from the JSON**: thorp 20.8–47.4–99.6 (n=7 excluding the oblique
   hf12), hamlet 28.0–41.1–66.0 (7), village 19.4–45.9–60.3 (9), town 41.0–57.0–79.0 (12), city
   52.0–69.0–90.0 (9), metropolis 70.2–97.6–119.6 (9). Every figure matches HF-M1's §4.4 exactly.
   In-band counts 6/9, 10/12, 7/9, 4/9 — all reproduce.
3. **Register / drift figures**: REG median by round 61.5 / 63.1 / 51.7 / 52.8 / **33.9**; wash by
   round 3.19 / 3.20 / 2.68 / 2.75 / **1.68**; HF-4c ★★★ = **55 of 78 (70.5%)** against HF-3's
   **2 of 84 (2.4%)**; HF-1 towns REG **64.2** / wash **3.45** / **zero** ★★★ against HF-4c towns
   **27.9** / **1.63** / **fifteen**. All exact.
4. **Paper drift**: warmth by round **37 / 27.5 / 24 / 23 / 24**; share inside L 222–244
   **95.9% → 83.3% → 52.4% → 55.6% → 57.7%**. Exact.
5. **The value-range refutation, reproduced end to end**: exactly **5 of 49** reach 150 (hf5 hf16
   hf55 hf56 hf59); **32 of 49** and **210 of 313 (67%)** sit under 120 on palette-8; true L1→L99
   median **173.8** (313) / **177.1** (49); **exactly 1 of 313** falls under 120 on the true range;
   hf50 = **78**, hf57 = **78**.
6. **The ink-L gate**: **43 of 313 = 13.7%** exceed 62; **5 of 71 = 7.0%** of the strongest cohort.
7. **`#513F34` = L67.1** by the atlas's own 0–255 Rec.601 convention, against its published L109;
   measured ink L 66.0. And `#684633` = 78.0, `#6F5546` = 91.1 — **none above 100**.
8. **b6's ink `#2B2118` = L35.0**, which is a *new* passing verdict, not a transcription.
9. **Holdout identity**: nomination = `kept`(23) ∪ `dropped`(30) = 53; adopted =
   (nomination − drop12) ∪ add12 = `minimal_swap.proposed` **exactly**; era becomes **6/6/17/13/11**,
   matching HF-M1's claim.
10. **Document integrity after editing**: 16 markdown tables, **0 ragged**; bold markers balanced in
    every paragraph (0 unbalanced); heading tree clean; `MFS2-bands.py` re-runs from its canonical
    home.

**PLAUSIBLE (reasoning, not executed)** — labelled as such in the atlas too:
- That the register drift is *caused* by the HF-4c prompt tail displacing the ink/wash law. Carried
  forward from HF-M1 unchanged; no A/B was run and none can be. **The experiment that would settle
  it:** re-issue an HF-1-era prompt and an HF-4c-era prompt against the same subject and measure
  both — which the frozen corpus and the cancelled subscription now make impossible, so it is
  effectively permanent.
- That the IQR bands I offer in T-01 would grade better than the published min–max bands. They
  satisfy the overlap rider arithmetically; **no leaf has been graded against them.** The settling
  experiment is cheap: re-grade b8's four surviving tiers against both band sets and see whether any
  verdict flips.

---

## 5 · REFUTED, BUT §244 DID NOT NAME IT — five findings

**5.1 ⛔ The atlas's own superlatives are the same failure §244.3 struck, at this document's scope.**
§244 struck nine "best in corpus" claims made over 78 plates. **Part 1 contains 32 "in the corpus"
superlatives made over 49 — and the aesthetic ones over 12.** I re-tested the testable ones over all
313 (§2.9.3). Four **stand at corpus scope** (hf72 chroma highest, hf60 lightest ink, hf10 lowest
built share, hf63 chroma 2nd). Ten are **scope-limited** (true of 49, false of 313). **Six are
refuted at their own scope** — false even of the sample they were drawn from:

| claim | truth |
|---|---|
| hf34 "IQR 51.7 — the widest measured" | hf56 = 100.1 **in the same 12-plate sample**; the atlas contradicts itself two sections apart |
| hf20 "wash 4.41 — highest in the whole corpus" | hf50 = 4.44 **in the same 12** |
| hf50 "chroma 66.6 — 2nd highest" | 3rd, at every scope |
| hf71 "chroma 65.3 — 3rd highest" | 4th, at every scope |
| hf5 "the most water-toned plate" | **2nd of 49 — and it is swapped with hf31's**, which is called "second-most water" and is actually 1st |
| hf10 "the lightest ink in the corpus" | 5th of 49; belongs to hf60 |

*Disposition:* I fixed the six inline (they are false as written), scoped the rest with a binding
rule in §0 plus the audit table in §2.9.3, and did **not** rewrite ten true-of-their-sample claims.
A grading sheet that deletes its predecessor's observations loses more than it gains.

**5.2 ⛔ The `L≈100` ink threshold is wrong, and it is the same defect as hf10's `L109`.**
§2.3.1 says plates whose ink lands above **L≈100** are the weakest. The three plates it names
measure 66.0 / 76.3 / 87.6 and **no plate of 313 exceeds 100** — so as written the sentence
identifies nothing. The threshold it was reaching for is **~62**, which is exactly where the
replacement gate sits. **One mis-transcribed luminance propagated into a document-level rule**;
finding hf10's L109 and finding the L≈100 rule are the same finding.

**5.3 ⚠ The `~30%` band-overlap rider was never satisfied by the atlas's own bands.** T-01 requires
that no tier's band overlap the next by more than ~30%. Published town 45–80 against city 60–95
overlap by 20 = **57% of each**. The re-pinned metropolis overlaps city by 43%. Measured IQR bands
(village 39–48, town 47–67, city 63–81, metropolis 81–107) satisfy it at every rung — **12.5% /
21.5% / 0%**. Recorded as a chair proposal in T-01, **not adopted**, because §244 ruled those three
bands unchanged and narrowing them is not mine to do.

**5.4 ⚠ Four Part-1 aesthetic figures do not reproduce.** hf17 `paper_grain_σ 4.04` (measured
**2.37**, and 4.04 sits **above the atlas's own published band ceiling of 3.18**), hf57 `2.18 / 1.22`
(**1.39 / 1.85**), hf51 "wash σ 9.17-equivalent" (**2.11**, and the phrasing is garbled), hf70
`2.53` (the plate has **no measurable blank paper at all**). All four are plates **outside the 12**
the aesthetic instrument was run on — so this is not instrument drift, it is figures from an
unreproducible run. Recorded in §0 and fixed at hf57 (which is load-bearing for banned prior #8).

**5.5 ⚠ The atlas's own `hf57` evidence contradicted its own banned prior.** Prior #8 bans
"thinning the whole ink hierarchy to express a state" and cited hf57 as an exemplar — but hf57's ink
measures **L37.9, full ink**, and the same document's hf57 (k) row correctly describes famine as
*accent subtraction*. **The prior is right and its exemplar was wrong.** hf57 is now recorded as the
counter-example — the plate that proves the corpus knows how to do it correctly — with hf24 (76.3)
and hf10 (66.0) as the true instances.

---

## 6 · WHAT I LEFT ALONE, AND WHY

- **All 26 targets except T-01/T-02, and every urbanism finding.** HF-M1 was a *register* pass; it
  measured no urbanism. T-03…T-26 are untouched.
- **The twelve banned priors.** All stand. Only prior #8's *exemplars* moved, because they were
  stated on a retired metric — the prohibition itself is unaffected.
- **The 17 descriptive "value range A–B" figures still standing in Part 1.** *(JUDGMENT: chose one binding naming
  rule in §2.3.1 over 22 individual rewrites — say "veto" to flip it.)* They are sound measurements
  of the palette-8 cluster range; only the *label* and the *gate* were wrong. Rewriting 17 rows from
  a different lane's instrument is 17 fresh chances to introduce an error, for no gain a single rule
  does not deliver. I edited only the rows where the figure carried a **quality verdict or a
  superlative** (hf10, hf24, hf50, hf57, hf60, hf5).
- **The 49 per-plate paper hexes**, though §0 now records they are not border-inset. Same reasoning:
  a documented caveat beats an undocumented rewrite.
- **The village / town / city grain bands** — §244 ruled them unchanged and the data agrees. I did
  not narrow them to their IQRs even though that would fix the overlap rider (see 5.3).
- **T-04's street figures.** `MFS1-streets.py` was deliberately not re-run at scale by HF-M1 (it
  inherits T-01's low-tier validity problem). Those numbers are **unrefreshed**, and §2.8.1 now says
  so rather than letting a lane assume they are current.
- **`center_edge_ratio` / T-03.** HF-M1 measured a median 7% and max 44% deviation on that field and
  said *do not band that number at this precision*. T-03's bands rest on it. I recorded the hazard
  in §2.8.1 item 7 and in §2.9.3 but **did not re-derive T-03** — that needs a better instrument,
  not a re-pin, and it was not in §244.
- **The ★★★ marks in `laneHF-CALIBRATION.md`.** §244.2 governs how they may be *used*; re-grading
  plates is Fable's, not an instrument's.

---

## 7 · DEFERRED — documented, not dropped

1. ⚠ **`map-corpus/README.md` line 4 of the standing rules is now stale.** It says the holdout *"must
   never be used to derive a calibration figure"* — the rule §244.6 restated, because with all 313
   measured it excludes everything. **The brief confined me to `map-corpus/docs/`, so I did not edit
   it.** Whoever owns the README should point that clause at §2.9.4's restated rule. **The roster
   itself is now recorded in the atlas**, so nothing is lost meanwhile.
2. ⛔ **The roof-count instrument for thorp/hamlet is specified but not built** (HF-M1 §8 flagged the
   same). Until it exists, T-01 has four rungs, not six, and no leaf may be graded at those tiers.
3. ⛔ **The `cells_across = f(population)` derivation cannot be restored from the corpus at all** —
   it needs settlements whose population is a fact, i.e. our own generator's output. Stated in T-01.
4. ⚠ **Trade (0 of 4) and institution (0 of 3) still have zero holdout coverage** after the adopted
   swap; specimen and series are excluded by the restated rule *by design*, these two are not.
5. ⚠ **hf12 in the holdout is an oblique/pictorial thorp.** HF-M1 flagged it for possible chair
   override (substitute `hf88`); §244.6 adopted the swap list as filed, so it stands, and the
   residual is recorded in §2.9.4.

---

## 8 · ONE THING THE CHAIR MAY WANT TO KNOW

**The correction is not uniformly bad news for the renderer, and the atlas now says so in both
directions.** Three verdicts improved: **T-02 is CONFIRMED** at ×1.21/×1.41 on n=9/12/9 (a ratio
target, so it survived the absolute re-pin intact — the one headline figure the measurement pass
*strengthened*); **b6's metropolis grain miss shrinks** from ×5.4 to ×4.7 because the ×5.4 was
measured against a withdrawn n=1 figure; and **b6 gains a MEETS** on the new ink-L axis at L35.0,
on the very axis where 13.7% of the reference corpus fails. Against that, **the tone-jitter miss
widens ×4 → ×5.5** under correct pinning, and **two of b8's reported grain misses were the grading
sheet's fault, not the renderer's**. A grading sheet that only ever moves against the thing it
grades is not being corrected — it is being ratcheted, and that is worth checking for deliberately.
