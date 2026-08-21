# RETRO-E2 — EVIDENCE MEMO FOR THE FABLE CHAIR
## Corpus / measurement / atlas cluster: §242, §244, §245+§246, §249, §250, §251, §261

**Scope.** Read-only verification of the mechanical substrate under seven Opus-chaired
ledger rows. I did not rule on any judgment, edit any file, run the repo gate, or touch git.
Everything labelled **CONFIRMED** below I executed or observed directly in this session;
**PLAUSIBLE** means the receipt asserts it and I could not execute the check.

**Working scripts** (read-only, in this session's scratchpad): `retro-E2-stars.py`,
`retro-E2-stars3.py`, `retro-E2-bands.py`, `retro-E2-cohort.py`, `retro-E2-warmth.py`.

### Standing caveat the chair must hold before reading anything below

Several primary artifacts have been **edited after the rows were collected** (the §287
whole-system review, 2026-08-19/20). Verified mtimes and deltas:

| artifact | as-filed | now | change |
|---|---|---|---|
| `map-corpus/docs/laneHF4-receipt.md` | Aug 17 02:05, 21176 B | Aug 19 23:07, 21510 B | the "41 of 78" sentence was **rewritten in place** to say the claim is wrong |
| `map-corpus/docs/laneMFS1-urbanism-atlas.md` | §249 reports 1,394 lines / 39 fold markers | **1,468 lines / 40 `§244-FOLD` markers** | grew 74 lines after the fold |
| `map-corpus/docs/MORPHOLOGY-PLAN.md` | §250 as filed | Aug 20 01:50 | now carries "CLOSED LEGACY EVALUATION EXCLUSION", the corrected **34**-plate scrub, and a cite to SPEC §10.17 |
| `map-corpus/docs/MORPHOLOGY-CONTEXT.md` | §251 as filed | Aug 20 01:50 | now carries a "STATUS CORRECTION (SPEC §10.17)" block |

The **as-filed** text of `laneHF4-receipt.md` survives at
`…/a244e7a3-…/scratchpad/laneHF4-receipt.md` line 239 and I used it for the §244 check.
No as-filed copy of the atlas or either compendium exists in the old scratchpad; where I
verify §249/§250/§251 figures I am verifying them against **post-edit** artifacts.

⚠ **Concurrent writer.** `docs/OWNER_DECISION_QUEUE.md` grew from 714,533 to 721,417 bytes
*during* this session (a sibling lane appending below §287). I re-checked every ODQ line
anchor cited below after the write: all six section headers and both spot-quotes still
resolve to the same lines. Cite by section number, not line, if this memo is read later.

---

# §242 — corpus freeze at 313 + the holdout ruling

## (a) HF-4c's taste calls as a class — "41 of 78 at ★★★", the nine "best in corpus", hf389 superseding hf103/hf104

**EVIDENCE.**
- As-filed receipt, `…/a244e7a3-…/scratchpad/laneHF4-receipt.md:239`:
  `- **The star ratings themselves.** I awarded ★★★ to 41 of my 78.`
- `map-corpus/docs/HFM1-star-audit.txt` (last lines):
  `TOTALS: rows=78  ***=55  **=20  *=1  none=2` /
  `laneHF4-receipt.md §8 states: 'I awarded ★★★ to 41 of my 78.'  MEASURED: 55 of 78 (70.5%).`
- **I re-parsed `laneHF-CALIBRATION.md` independently** (section `## LANE HF-4c`, abs
  lines 286–395; my own first-bold-run star parser, not the lane's script):
  `rows matching '- **hf<N>': 78` · `counts by stars: {0: 2, 1: 1, 2: 20, 3: 55}` ·
  `set equal: True` against the audit's 55-id list, `diff mine-audit: set()`.
- Same parser over the sibling sections: **HF-3 `n=84 3star=2 rate=0.024`**,
  **HF-4b `n=72 3star=2 rate=0.028`**, HF-2 `n=30 3star=0`.

**STATUS: CONFIRMED.** §242.4's number (41) is the lane's own as-filed figure; the true
figure is 55 and the audit reproduces byte-exactly under an independently written parser.
HF-4c's rate is **25× its immediate predecessor's on the identical instrument**.

**DOUBTS.**
1. §242.4 recorded the 41 as an honest caveat *"flagged by the lane and accepted"*. The lane
   flagged the softening; it did not flag that its own count was wrong. §242 therefore
   ratified a self-report the chair had not audited. §244.2 caught it one row later — but
   the ratification is what §242(a) is being asked to re-derive, and the ratification rested
   on a false denominator.
2. The audit's rule ("longest ★ run inside the row's FIRST bold run") counts
   `hf375 ★★★ CONTENT / ⛔ TITLE MUST BE REPLACED`, `hf350 ★★★ content, HARD CULTURE-BAKE
   NOTE` and `hf356 ★★★ content, HARD CULTURE-BAKE NOTE` as full ★★★. Several of the 55
   carry disqualifying flags in the same title block. The 70.5% is the honest reading of
   what was written; the chair may want a second count that excludes flagged rows.

## (b) The lane's own 78 stay holdout-eligible (provenance vs grading-confidence)

**EVIDENCE.** `map-corpus/docs/laneHFM1-receipt.md:451-460`:
> ⚠ **This lane has now made that rule vacuous: with all 313 plates measured, every plate is
> a figure-derivation plate.**

`docs/OWNER_DECISION_QUEUE.md:10930-10941` (§287.10, 2026-08-20):
> exact file/register closure is 313/313/313, but **all images were previously
> viewed/measured**, aggregate figures use all 313, CONTEXT used descriptions of excluded
> ids, and the compiled spec cites ids later selected into the roster. It is a **closed
> legacy pixel-evaluation subset** … not an untouched calibration holdout. **Removing
> citations cannot restore blindness. A true claim requires a new sealed external set.**

**STATUS: CONFIRMED that the premise dissolved.**

**HOW §287.10 BEARS ON §242(b).** §242(b) is a ruling about *which plates are eligible for
a blind reserve*. §287.10 establishes there is no blind reserve to be eligible for. The
ruling is therefore **moot in effect, but its reasoning is not thereby vindicated** — it was
already unsound at the time on the lane's own later finding (§244.6), and §287.10 goes one
step further than §244.6 did: not merely "every plate contributed to an aggregate" but
"every image was viewed." **Recommended chair disposition: RATIFY the reasoning (provenance
was not the objection), MOOT the ruling, and record that eligibility rulings over this
roster have no forward force.**

## (c) The scrub-list disposition (teach geometry, never naming)

**EVIDENCE.** `docs/OWNER_DECISION_QUEUE.md:8692-8698` — *"**THE 8-ITEM SCRUB LIST**"*.
I parsed the receipt's own scrub section (`map-corpus/docs/laneHF4-receipt.md:174-192`):
**35 distinct plate ids across 8 numbered categories**, and §287.11 corrects it to **34**
(`hf373` is the cured replacement, falsely captured by the old regex). `MORPHOLOGY-PLAN.md`
§0.2 now carries the corrected 34-id list; my parse of the receipt minus that list returns
exactly `['hf373']`.

**STATUS: CONFIRMED — and the row's own wording is a trap.**

**DOUBT — SHARP.** "**THE 8-ITEM SCRUB LIST**" reads as *eight plates*. It is **34 plates in
eight categories**, a 4.25× understatement. A downstream lane reading §242.3(a) alone —
which is what a ledger row is for — would apply an 8-plate scrub. The substantive ruling
(geometry yes, naming never) is sound and I have no objection to it; the *count in the
ledger* should be amended to 34.

## (d) Is the 53-plate / 16.9% holdout the right size and spread once the PIL numbers land?

**EVIDENCE — arithmetic, all recomputed from `laneHFM1-holdout-proposal.json`:**
- `53/313 = 16.93%` → **16.9% CONFIRMED.**
- Roster algebra closes exactly: `kept(23) ∪ added(30) = proposed(53)`; original nomination
  `kept ∪ dropped = 53`; `minimal == (orig − mdrop) | madd` → `True`.
- Era distribution of the **original 53**: `HF-1 0 · HF-2 7 · HF-3 26 · HF-4b 15 · HF-4c 5`
  — reproduces `laneHFM1-receipt.md:436-440` exactly (−15.7pp / +3.6 / +22.2 / +5.3 / −15.5).
- Era distribution after the adopted 12-swap: `6 / 6 / 17 / 13 / 11` — reproduces the
  receipt's `era becomes 6 / 6 / 17 / 13 / 11` exactly.
- **Scrub intersection = ∅** for all three rosters (original, minimal, full-rebalance), tested
  against both the 35-id raw set and the corrected 34-id set. `laneHFM1-receipt.md:423`'s
  "Zero intersection with the §6 scrub list" **CONFIRMED**.
- Three-number reconciliation, `laneHF4-receipt.md:22-25`: `78 / 78 / (358−46)÷4 = 312÷4 = 78`.
  **CONFIRMED.** Corpus chain `163 + 72 (HF-4b) + 78 (HF-4c) = 313` closes.
- **I verified the corpus inventory directly**: 313 PNGs, **all 313 at exactly 5056×3392**,
  313 previews, 313 unique `hf-job-id` tEXt chunks, zero plates missing the chunk.

**STATUS: CONFIRMED on every arithmetic and inventory claim.**

**HOW §287.10 BEARS ON §242(d).** §242(d) asked whether 16.9% is the right *size and spread*.
§287.10 makes the question unanswerable in its own terms: a set that was fully viewed has no
size at which it becomes a calibration holdout. **The size/spread question is void; what
survives is the §244.6 finding that the set was era-unrepresentative, which remains a true
fact about the roster's composition and is worth keeping as a design lesson for the "new
sealed external set" §287.10 requires.** Note also that §287.10's "zero trade and zero
institution coverage" **CONFIRMED** from my category tally of the adopted 53 — and that it
also has **zero `series` coverage (0/6)**, which §249.4c named in the receipt but dropped
from the ledger row.

---

# §244 — the measurement pass's rulings

## (a) ⭐ THE BAND-PINNING AMENDMENT — "pin to the strongest measured cohort, never the corpus median"

**Does it reproduce from the measured CSV? YES, and exactly.** I ran `MFS2-bands.py` (the
lane's own instrument) and independently recomputed every figure from
`laneHFM1-corpus-measured.csv`.

**Cohort definition and membership — CONFIRMED.**
`register_index: n=313 corpus median=52.30 TOP-DECILE THRESHOLD p90=73.78`
`HF-1 cohort n=49 | top-decile n=32 (overlap 10) | STRONGEST COHORT n=71`
My independent recomputation returned identical values (median 52.3, p90 73.78, union 71).
`MFS2-bands.json MATCHES — dry run, no write` — the published JSON is reproducible.

**The three bands, and the sign-flip claim (§249.1's headline, but §244.4's rule):**

| axis | MF-S1 published | STRONGEST (n=71) | HF-1 alone (n=49) | top-decile (n=32) | CORPUS MEDIAN (n=313) |
|---|---|---|---|---|---|
| paper grain σ | 1.8 | **2.05** | 2.19 | 1.96 | **1.48** |
| within-fill wash σ | 3.1 | **3.29** | 3.19 | 3.38 | **2.70** |
| fill-tone IQR | 18 | **22.0** | 17.9 | 29.2 | **16.4** |
| chroma | 44 | 43.3 | 46.3 | 40.5 | 36.2 |
| paper warmth R−B | — | 33.0 | 37.0 | 31.5 | 25.0 |
| stroke ratio p90/p25 | 3.55 | 4.33 | 4.00 | 5.67 | 4.00 |

**STATUS: CONFIRMED.** The sign-flip is real on all three: strongest-cohort moves the band
**up**, corpus median moves it **down**, for grain, wash and IQR. A re-deriver taking the
median gets the wrong sign, exactly as claimed. **How far apart:** grain 2.05 vs 1.48 (the
median band is **28% below** the strongest); wash 3.29 vs 2.70 (**18% below**); IQR 22.0 vs
16.4 (**25% below**); warmth 33 vs 25 (**24% below**). The drift the amendment is protecting
against is a quarter of the band's value — material, not cosmetic.

**The drift itself — CONFIRMED, and it is monotone.** Recomputed per era:

| round | n | ★★★ | rate | REG idx | ink L | wash σ | grain σ | tone IQR | chroma | paper L | warmth | in L222–244 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| HF-1 | 49 | 0 | 0.0% | 61.5 | 37.9 | 3.19 | 2.19 | 17.9 | 46.3 | 235.7 | **37** | **95.9%** |
| HF-2 | 30 | 0 | 0.0% | 63.15 | 40.15 | 3.20 | 1.78 | 19.3 | 42.65 | 240.85 | 27.5 | 83.3% |
| HF-3 | 84 | 2 | 2.4% | 51.7 | 40.6 | 2.68 | 1.40 | 17.5 | 36.85 | 243.5 | 24 | 52.4% |
| HF-4b | 72 | 2 | 2.8% | 52.75 | 44.25 | 2.75 | 1.54 | 18.85 | 34.75 | 243.3 | 23 | 55.6% |
| HF-4c | 78 | 55 | 70.5% | 33.9 | 52.0 | 1.68 | 1.17 | 11.65 | 33.2 | 243.75 | 24 | 57.7% |

Every cell reproduces `laneHFM1-receipt.md:133-137` and `:319-323` (differences are
half-up vs banker's rounding on `.x5` only). The "96% → ~55%" paper-band collapse and the
"warmth 37 → 24" fall are **CONFIRMED**.

**Within-subject de-confounding — CONFIRMED exactly:**
`town HF-1 n=19 REG=64.2 washσ=3.45 grain=2.42 inkL=38.9 3star=0` ·
`town HF-4c n=25 REG=27.9 washσ=1.63 grain=1.21 inkL=60.2 3star=15` ·
`city HF-1 n=7 REG=54.0 washσ=2.95` / `city HF-4c n=6 REG=24.2 washσ=1.52` ·
`terrain HF-3 n=18 REG=45.2 washσ=2.70` / `terrain HF-4c n=11 REG=30.1 washσ=1.35`.
The receipt's "HF-1" label on the terrain row is a typo for HF-3; its own parenthetical
"(18 HF-3 vs 11 HF-4c)" is correct.

**DOUBTS — and the second one is material.**

1. **The register index triple-counts texture.** `register_index` is the mean percentile over
   five axes, three of which (wash σ, grain σ, tone IQR) are all measures of tonal mottle.
   The index is the lane's own construction and it says so ([E] on the weighting). It is a
   ranking convenience, and the receipt does re-state each claim on raw axes — so the
   *conclusions* survive. But the index is also the **selector for the top-decile arm of the
   pinning cohort**, which produces the next doubt.

2. ⛔ **The tone-IQR raise (18 → 22) is circular; the grain and wash raises are not.**
   The top-decile arm is selected *on an index containing grain σ, wash σ and tone IQR*, then
   used to re-derive bands on those same axes. The circularity is measurable:
   - grain: HF-1 alone **2.19**, top-decile **1.96** — the top-decile arm *lowers* the union.
     The raise above 1.8 comes from HF-1, independent of the index. **Sound.**
   - wash: HF-1 alone **3.19**, top-decile **3.38** — HF-1 alone already exceeds the published
     3.1. **Sound**; the selection adds 0.10.
   - **tone IQR: HF-1 alone 17.9, published 18.0 — essentially identical. Top-decile 29.2.
     The entire 18 → 22 raise comes from the arm selected on tone IQR.**

   So of §249.1's "three of the six bands raised", **two are raised on independent evidence
   and one is raised by selecting on itself.** This matters because §249.4a's amendment cures
   the *opposite* case (axes the index does **not** score pin to HF-1 alone) while leaving
   the self-selected axes untouched. **Recommended: the amendment should be symmetric — an
   axis that is a *component of the selection index* should also pin to HF-1 alone, which
   would put tone IQR back at 17.9 ≈ the published 18.**

3. **Sample-size vs corpus-change is separated for the six bands but not for warmth.** The
   receipt's honest three-column comparison (published / n=313 / on-MF-S1's-own-49) is present
   for the aesthetic axes; the paper re-pin is argued from the era table only. Since HF-1 *is*
   MF-S1's 49, the warmth argument is not confounded — but the chair should note the paper
   re-pin rests on a **single cohort of 49**, not on a cross-checked design.

## (b) Striking rather than widening T-01's thorp/hamlet rungs, and the withdrawal of MF-B8's low-tier misses as instrument artifacts

**Is the instrument-artifact claim supported by the data? YES — and it is corroborated
downstream and in code.**

**EVIDENCE.** Recomputed from `HFM1-grain2.json` (57 rows: 22 REPRO + 35 NEW):

| tier | MF-S1 band | HF-M1 re-measured (min / med / max) | n | in band |
|---|---|---|---|---|
| thorp | 8–14 | **20.8 / 47.4 / 99.6** | 7 | **0 / 7** |
| hamlet | 18–26 | **28.0 / 41.1 / 66.0** | 7 | **0 / 7** |
| village | 30–50 | 19.4 / **45.9** / 60.3 | 9 | 6/9 |
| town | 45–80 | 41.0 / **57.0** / 79.0 | 12 | 10/12 |
| city | 60–95 | 52.0 / **69.0** / 90.0 | 9 | 7/9 |
| metropolis | 100–130 | 70.2 / **97.6** / 119.6 | 9 | **4/9** |

Every figure in §244.5 reproduces. `hf90-thorp-plains` returns **99.6** with the recorded
note `dispersed open-field thorp; furlong hatching inside window`. `hf10`'s MF-S1 window
`[.36,.38,.63,.70]` against a cluster at `x 0.13–0.44` — the window opens at 0.36 and runs to
0.63, so roughly **70% of its width is east of the cluster**. Re-set to `[.13,.31,.45,.70]`
it returns **20.8** against MF-S1's 10.1.

**Independent corroboration I found that the row does not cite:** the downstream plan lane
hard-coded the finding into its own instrument —
`map-corpus/docs/MFS3a-voids.py:8`: `buildings (ODQ 244.5).  Rows below village carry grain_valid:false.`
`:108`: `r["grain_valid"] = fr[pid]["tier"] not in ("thorp","hamlet")`.
All four thorp/hamlet whole-windows in `MFS3a-voidmetrics.json` carry `grain_valid: false`.
The finding became machinery, not just a note.

**STATUS: CONFIRMED.** Striking rather than widening is the right disposition: the low-tier
numbers are not merely wide, they are measuring hedges and furrows. You cannot widen a band
out of numbers you know are measuring the wrong object. The consequent withdrawal of MF-B8's
thorp/hamlet rows is correct.

**DOUBTS.**
1. ⚠ **The instrument's window-dependence is not confined to the low tiers, and §244.5
   applies the finding asymmetrically.** `cells_across` is a raw count across a hand-set
   window (`MFS3a-voids.py:53-56`, `pitch = ww/med`), so it scales linearly with window width
   at fixed plot size. The receipt's own "Contaminated rows I am flagging rather than hiding"
   list names **hf105** (`ribbon city measured across its short axis`) and **hf101**
   (`harbour water inside the box`) — both are **inside the 9-plate metropolis set from which
   the 80–120 re-pin is computed**. The chair should note that thorp/hamlet were struck for
   contamination while metropolis was re-pinned over a set containing two rows flagged for the
   same class of contamination. (I checked the re-pin's robustness: dropping hf101 and hf105
   leaves 70.2 / 81 / 89 / 97.6 / 107.3 / 113.9 / 119.6 — the 80–120 band survives, so the
   ruling holds; the *reasoning* is inconsistent, not the number.)
2. **The B8 metropolis verdict deserves one more sentence than the row gives it.** §244.5 says
   B8's 70 is "a smaller miss than reported but still a miss." B8's 70 is **within 0.3 of
   hf389's 70.2**, the corpus's own weakest metropolis plate. Whether 70 is a miss depends on
   whether the band is a floor or a distribution — the row treats it as a floor without saying so.

## (c) Retiring the value-range band in favour of ink L

**EVIDENCE — all recomputed from the CSV.**
- `hf50` (the atlas's declared north star) `value_range_pal8 = 78`; `hf57` (the famine plate
  it calls weak) `= 78`. **Identical. CONFIRMED.**
- `pal8 under 120 (HF-1 49): 32 of 49` — **CONFIRMED** (the receipt's "32 of its own 49").
- `pal8 under 120 (all 313): 210 of 313` = 67.1% — **CONFIRMED**.
- `pal8 >=150 (HF-1 49): ['hf5','hf16','hf55','hf56','hf59']` — exactly the five the receipt
  names. **CONFIRMED.**
- True `L_range_1_99`: median **173.8** over 313, **177.1** over HF-1's 49, and **exactly one
  plate of 313 falls under 120**. **CONFIRMED.**
- The proposed ink-L gate: `hf10 66.0 · hf24 76.3 · hf60 87.6` all >62 (flagged);
  `hf57 37.9` unflagged; `ink L > 62.2: 42 = 13.4%` of 313. **All CONFIRMED.**

**STATUS: CONFIRMED.** The band is self-contradicting under both readings and the
replacement is arithmetically sound.

**DOUBT.** The receipt's own defence of the gate says it leaves `hf50 at 70.2 correctly
flagged as a deliberately low-contrast lens` — but §4.3 of the same document calls hf50 **the
atlas's declared aesthetic north star**. The adopted quality gate flags the declared north
star as under-inked. That is either a defensible exception or evidence the threshold is set
one notch tight; §244.4 adopts ink L without resolving it, and §249.2 installs the gate
(≤45 / 45–62 / >62) into the graded atlas with the tension unresolved.

## (d) Demoting HF-4c's star grades to annotations

**EVIDENCE.** Substrate is §242(a) above: 55/78 (70.5%) vs HF-3's 2/84 (2.4%) and HF-4b's
2/72 (2.8%), on the identical parse, with the cohort measuring weakest of five rounds on every
hand axis and within every subject. Also **CONFIRMED**: the corpus-wide ★★★ total is
**59** (55 + 2 + 2) = 18.85% of 313, matching `laneHFM1-receipt.md:441`.

**STATUS: CONFIRMED.** The demotion is the minimum honest response to the data.

**DOUBT.** The receipt's own recommendation was **split the mark** (a TEACHING mark and a
measured REGISTER mark), not demote. §244.2 took the demotion and left the split unadopted;
§249 does not restore it. The measured register mark exists in the CSV today at no cost. The
chair may want to note that the row spent the finding without taking the cure the lane offered.

## (e) The three reversed adjudications, especially restoring hf103 as grain flagship

**EVIDENCE — all recomputed.**
- **hf389 vs the metropolis band.** `hf389 = 70.2` — the **lowest of the nine**;
  `hf103 = 113.9`, `hf100 = 119.6`, `hf102 = 107.3`, `hf101 = 107.0`, `hf104 = 89.0`,
  `hf34 = 97.6`, `hf105 = 81.0`, `hf374 = 81.0`. 70.2 is **30% below** the old T-01 floor of
  100 and level with the *city* band median (69.0). Its filename is
  `hf389-city-metropolis-grain-max`. **CONFIRMED — the plate named grain-max has the coarsest
  grain of the nine.** REG idx: hf389 43.3 (33rd pct) vs hf103 63.0, hf104 65.8, hf34 69.0.
- **The nine "best in corpus" claims.** Top-decile threshold **73.8**, corpus median **52.3**
  (both recomputed). My percentile recomputation returns **84 / 67 / 51 / 44 / 33 / 32 / 26 /
  21 / 14 / 8** for hf386 / hf379 / hf291 / hf360 / hf389 / hf338 / hf348 / hf303 / hf327 /
  hf356 — **identical to `laneHFM1-receipt.md:177-186`. None is top-decile; three are bottom
  quintile. CONFIRMED.**
- **The three register-edge calls.** `hf289 chroma 35.0`, my rank **180 of 313** (receipt says
  177 — a tie-handling difference at chroma 35.0, immaterial); true maxima
  `hf72 69.6 · hf63 68.4 · hf50 66.7 · hf71 65.4`. `hf355 L50 202.5`, darkness rank **65 of
  313**; plainly-non-night darker plates `hf11 126.8 · hf131 145.4 · hf31 158.0 · hf235 163.8`.
  `hf300 REG 63.2 = 73rd percentile, chroma 16.0`. **All three CONFIRMED as refuted/partly
  refuted.**
- **Instrument recovery.** L-percentile medians over the 49 HF-1 plates recomputed:
  **56.6 / 123.2 / 201.0 / 230.4 / 235.5** → the receipt's `57 / 123 / 201 / 230 / 236`.
  **CONFIRMED.** (The atlas's stated `57/125/202/231/240` differs most at L99 by 4.5 L, which
  is the border-inset artefact the receipt separately identifies.)

**STATUS: CONFIRMED on all three reversals.**

**DOUBT.** The receipt's own recommendation was to **split the role** — hf103 keeps grain/scale
flagship, hf389 is *retained* as the large-scale wall-shape exemplar **and renamed**, because
"grain-max" will mis-teach anyone who trusts filenames. §244.3 records only the restoration of
hf103. **The rename is not in the ledger and the file on disk is still
`hf389-city-metropolis-grain-max.png`** (verified). That is a live mis-teaching surface.

---

# §245 / §246 — the morphology study and the reconstruction reframing

This row is a **dispatch and a framing**, not a measurement, so there is little mechanical
substrate to verify. What I can attest:

## (a) The chair-added study dimensions beyond the owner's list

**EVIDENCE.** `docs/OWNER_DECISION_QUEUE.md:8834-8848` names the added dimensions
(growth sequence, anomaly catalogue, scale invariants, regional morphotypes, void hierarchy).
Every one landed as a section with executed instruments behind it:
- growth sequence → `MORPHOLOGY-PLAN.md` §6 (§6.1 epoch counts, §6.2 the measured pairs,
  §6.3 the fossilised circuit) — and §6.3's `circuitDemotion` became §250.5's "biggest missing
  mechanism";
- void hierarchy → `MFS3a-voidmetrics.json`, 49 rows × `void_n_ge4pw2`, `void_largest_pw2`,
  `void_2nd_over_1st`;
- scale invariants → the four tier-invariants of §250.6a;
- anomaly catalogue → `MORPHOLOGY-PLAN.md` §12 (verified present, e.g. line 526 hf239's
  camp-frays-at-the-gates row);
- regional morphotypes → `MORPHOLOGY-CONTEXT.md` §8.

**STATUS: CONFIRMED** that the additions were productive — the single highest-value output of
the whole study program (`circuitDemotion`, §250.5) came from a chair-added dimension the owner
did not name. That is the strongest available argument for (a).

## (b) THE CALIBRATION RULING — register-and-kind, never pixel-identity

**EVIDENCE.** `docs/OWNER_DECISION_QUEUE.md:8865-8869`. This ruling is **load-bearing for
everything else in my cluster** and I flag one consequence the row does not draw:

⚠ **The register-and-kind target is what makes §244's band-pinning amendment coherent, and it
is also what makes §250's "elevate the measured X:T to a derivation law" questionable.** If the
target is *kind*, then a measured corpus statistic is evidence about the *register* we are
aiming at; if the target were pixel-identity, matching 0.024 exactly would be the goal. §250
elevates a single measured ratio to a first-class law with census bands — which is closer to
pixel-identity thinking than to kind-matching. The two rows sit in tension and neither names it.

**STATUS: the ruling is PLAUSIBLE-as-framing** (it is a definition, not a measurement).
It is later re-stated verbatim in `GENERATION-SPEC.md` and became §261.4's precedence law, so
it has propagated widely and a reversal would be expensive.

## (c) The two-lane split and synthesis into one specification

**EVIDENCE.** Both lanes delivered and the synthesis exists: `MORPHOLOGY-PLAN.md` (verified
present; §250 reports 756 lines), `MORPHOLOGY-CONTEXT.md` (160,706 bytes on disk — §251's
"160 KB" **CONFIRMED**), `GENERATION-SPEC.md` (890,527 bytes as of Aug 20 03:48).

**STATUS: CONFIRMED delivered.**

**DOUBT.** The split's stated purpose was depth, and it produced **two lanes with materially
different holdout discipline on the same day** — see §250(sharp)/§251 below. The plan lane
excluded 91 and cites **0**; the context lane excluded 81 in code and cites **49** of them in
prose. A single lane could not have diverged from itself this way. That is a real cost of the
split that §245/§246 did not anticipate and §251 did not record.

---

# §249 — the atlas fold's rulings

## (a) The cohort amendment — union in general, HF-1 alone for axes outside the register index (paper warmth at 37, not 34)

**Recomputed. The ruling's direction is right; its two numbers do not come from the same estimator.**

**EVIDENCE.**
- `MFS2-bands.py` own stdout: `paper_hex centroid STRONGEST n=71 #F7E9D6` ·
  `paper_hex centroid HF-1 n=49 #F8E9D4` · `paper_hex centroid corpus n=313 #FAF0E0`.
- `MFS2-bands.json` `paper_warmth_RmB`: `STRONGEST med 33.0` · `HF-1 med 37.0` ·
  `top-dec med 31.5` · `corpus med 25.0`. My independent recomputation returns the same.
- `laneMFS1-urbanism-atlas.md:924`: *"HF-1 alone gives centroid `#F9E9D5` / warmth **37** …
  the union gives `#FAEBD8` / warmth **34**"*.
- `laneMFS2-receipt.md:109`: `paper centroid … #FAEBD8 (L 237.3, warmth 34); … n=70 daylight`.
- My centroid recomputation: **strongest cohort, daylight-filtered (n=70, excluding `hf197` at
  paper L 115.8) → `#F9EBD7`, R−B = 33.63 → 34.** The published 34 **reproduces**.
  **HF-1 daylight (n=49) → `#F8E9D4`, R−B = 35.88 → 36.** The published 37 does **not**
  reproduce as a centroid; **37 is the HF-1 median**.

**STATUS: CONFIRMED that the two figures come from different estimators.**

**DOUBTS — this is the item I would put in front of the chair first on §249.**
1. ⛔ **The 37-vs-34 gap mixes a median against a centroid.** Computed consistently the gap is
   either **35.9 → 33.6 (centroid vs centroid, 2.3 units)** or **37.0 → 33.0 (median vs median,
   4.0 units)**. The published comparison (37 vs 34) is neither. The **ruling's direction
   survives under both** — HF-1 alone is warmer than the union on every estimator — so I would
   not disturb the ruling. But **37 is now the binding renderer target**, and on the estimator
   the atlas itself nominates (centroid) the HF-1 figure is **36**.
2. **The atlas is internally inconsistent by one unit in the same sentence.**
   `laneMFS1-urbanism-atlas.md:924` gives HF-1 as `#F9E9D5 / L 235.7 / warmth 37`. `#F9E9D5`
   has R−B = **36**, and `L 235.7` is HF-1's **median** paper L, not the centroid's L. Three
   estimators in one clause.
3. **The narrow amendment is the right shape but points the wrong way.** "Any axis NOT
   represented in the register index pins to HF-1 alone" cures dilution on unscored axes. The
   *larger* hazard is the opposite one — axes that **are** components of the index get inflated
   by selecting on themselves (see §244(a) doubt 2: tone IQR 18 → 22 is entirely selection).
   **Recommended: extend the amendment to both directions.**

## (b) Retiring the ≤30% band-overlap rider; tier legibility is multi-channel; IQR bands not adopted

**EVIDENCE.** `docs/OWNER_DECISION_QUEUE.md:9043-9050`. The measured town/city grain overlap of
57% is not directly recomputable from the artifacts I hold (the atlas's own figure), so
**PLAUSIBLE**. What I *can* confirm supports it: town median 57.0 (range 41–79) vs city median
69.0 (range 52–90) from `HFM1-grain2.json` — the ranges overlap over 52–79, i.e. the great
majority of both. **Grain alone plainly does not separate town from city. CONFIRMED in
substance.**

**STATUS: the retirement is CONFIRMED-in-substance; the exact 57% is PLAUSIBLE.**

**DOUBT.** The stated reason for not adopting IQR bands — *"narrowing them would silently move
MF-B8's standing verdicts"* — is a **governance** reason, not an evidential one. It is honest
and I think it is right, but the chair should notice that the ledger is declining a
methodological improvement to protect a grading sheet. That is a precedent worth being
deliberate about.

## (c) Accepting the withdrawn rungs and the unrestorable population fit

**EVIDENCE.** `laneHFM1-receipt.md:402-404`: the `cells_across ≈ 5.7 × population^0.27` fit is
*"fitted over 11 plates including hf10 — the fit inherits the fault."* The atlas installs a
fifth verdict, **⛔ WITHDRAWN ("no instrument — not a pass and not a fail")**.

**STATUS: CONFIRMED as the correct disposition.** The ⛔ WITHDRAWN verdict is a genuine
structural improvement: it is exactly the mechanism that stops an unmeasurable target from
masquerading as a pass or a fail, and it is the cure for the "PARTIAL is the status that hides"
class. I would ratify this without reservation.

**DOUBT.** §249.4c names the roof-count instrument as "queued". It is still **not built** —
`laneHFM1-receipt.md:560` records it as specified-not-built, and I found no roof-count
instrument in `map-corpus/docs/`. Two withdrawn rungs and the population fit are all waiting on
one unbuilt instrument.

## (d) The superlative-audit class as a general law

**EVIDENCE.** `laneMFS1-urbanism-atlas.md:1273-1300` (§2.9.3) — the audit table exists, 26 rows,
with ✅ STANDS / ⚠ scope-limited / ⛔ REFUTED verdicts and the n=12 / n=49 / n=313 columns.
`MFS2-bands.py`'s own `SUPERLATIVE AUDIT` block re-runs nine of the atlas's claims at corpus
scope and I executed it — e.g. `CLAIM: hf56 IQR 100.1 = by far the widest measured` →
`[('hf165',153.0),('hf201',144.3),('hf56',100.1)…]`; `CLAIM: hf55 stroke p90 35 = heaviest` →
`[('hf277',51.0),('hf165',46.0),('hf202',39.0),('hf193',38.0),('hf55',37.0)]`. The instrument
is real and re-runnable.

**STATUS: CONFIRMED. The law ("a superlative is a claim and must be measured at its stated
scope") is well-founded and mechanised.**

**DOUBT — a precision error in the row's own summary.** §249.3 says *"six false even of the
12-plate sample they were drawn from."* The atlas's table marks five rows **REFUTED AT ITS OWN
SCOPE** (hf34 IQR, hf20 wash, hf50 chroma, hf71 chroma, hf5 blue-excess) plus the hf31 water
swap — and **hf71, hf5, hf10, hf24, hf60, hf51 and hf40 are not in the 12** at all; their
"own scope" is the 49. The count of six is defensible; **"of the 12-plate sample" is not.**
A row about scope discipline mis-states its own scope.

**Also noted:** four Part-1 aesthetic figures outside the 12 do not reproduce (`hf17, hf57,
hf51, hf70` — `laneMFS1-urbanism-atlas.md:1209`); I spot-verified hf57: published
`grain σ 2.18 / wash σ 1.22`, measured **1.4 / 1.9** in the CSV. **CONFIRMED.**
T-02 also **CONFIRMED**: city/town = 69.0/57.0 = **×1.2105**; metropolis/city = 97.6/69.0 =
**×1.4145** — both within 0.01 of the published ×1.2/×1.4 target.

---

# §250 — the plan compendium's rulings

## (a) ⭐ Elevating junction mix to a first-class derivation law — is X:T 0.024 a corpus artifact or a real morphological truth?

**RECOMPUTED FROM THE MEASURED DATA. The number is exact; its interpretation is where the
row overreaches.**

**EVIDENCE — every figure in `MORPHOLOGY-PLAN.md:86-92` reproduces from
`MFS3a-planmetrics.json` (35 `part == "whole"` rows):**

| node type | min | median | max | (doc) |
|---|---|---|---|---|
| dead end | 0.110 | **0.208** | 0.391 | 0.110 / 0.209 / 0.391 |
| T or Y | 0.510 | **0.653** | 0.738 | identical |
| X | 0.000 | **0.015** | 0.055 | identical |
| star (deg ≥5) | 0.000 | **0.000** | 0.009 | identical |
| **X : T** | 0.000 | **0.024** | 0.085 | identical |

Also reproduced: mean degree 2.133 / **2.469** / 2.667; edge:node 1.17 / **1.403** / 1.551;
γ 0.393 / **0.473** / 0.520. `1/0.0241 = 41.5` (the doc's "forty-three T per X" is the
reciprocal of a slightly different rounding — 43 vs 41.5; immaterial but not exact).
`windows with X_share > 0.055: []` and `star_n == 0 in 27 of 35` — the doc says "22 of 35",
**a discrepancy**: I count **27** windows with zero degree-≥5 nodes, not 22.
Absolute counts across the 35 windows: **180 X-nodes against 6,618 T-nodes.**

**STATUS: CONFIRMED as arithmetic. The measurement is real, reproducible and correctly reported
(bar the 22-vs-27 slip).**

### What the data CAN say
The corpus's drawn street graphs, as extracted by this skeletonizer at 1600 px, are
overwhelmingly degree-3. **Whatever a generator must match to look like these plates, it is not
a lattice.** As a *target-matching* rule this is well-founded.

### What the data CANNOT say, and where §250.2 overreaches
1. ⚠ **The instrument decomposes crossings, and 180 X-nodes is a small number to rest a law on.**
   A hand-drawn (image-model-drawn) crossing whose strokes are offset by a few pixels
   skeletonizes into **two T-nodes**, not one X. `MFS3a-plangraph.py` prunes branches shorter
   than `spur_min_branch_px: 28`; a connecting stub longer than that survives as a second T.
   The near-total absence of degree-≥5 nodes (median 0.000, max 0.009) is itself consistent with
   an extractor that splits high-degree nodes. **Nothing in the study measures the extractor's
   X-recovery rate**, and no synthetic positive control was run.
2. ✅ **But there IS one real internal positive control, and it is the strongest thing in the
   row's favour.** `hf239@camp` — a deliberately drawn Roman castra grid — measures
   `X_share 0.0882`, **6× the corpus median and the maximum of all 49 windows**, alongside the
   highest trustworthy φ (0.5848). So the extractor **can** see X where X is drawn. That
   establishes **relative discrimination** (planned vs organic) on solid ground.
3. ⛔ **It does not establish the absolute 0.024.** A real Roman grid should read X:T near or
   above 0.5, not 0.088. The positive control shows the instrument under-detects X by a large,
   unmeasured factor. **The rank ordering is trustworthy; the level is not.** Adopting
   `X:T ≤ 0.09` as a *census band* on generated output is therefore a comparison between a
   generated vector graph (where every crossing is exact) and a raster-extracted drawn graph
   (where crossings are lost). **These are not the same measurement and the band will red on
   correct output** — precisely the failure class §251.4b identified for §200's clearance census.
4. ⛔ **The row's stated rationale is a claim about the real world that the corpus cannot
   support.** `MORPHOLOGY-PLAN.md:96` argues *"Real organic accretion produces T-junctions…
   The X-junction is a design act; the T-junction is a growth act."* Under §261, the corpus is
   an **image model's** output. X:T 0.024 is a fact about **what nano-banana-pro draws when
   prompted for historical settlement plans** — not evidence about historical urban form.
   §261.4's own law ("only the corpus is evidence about the corpus") cuts both ways: the corpus
   is evidence about the *target*, and nothing more. §259.4 then compounded this by citing
   Watabou's Voronoi geometry as *explaining* our 43:1 — which §261 correctly downgraded.
   I found **no independent historical-evidence source for junction mix** in
   `HISTORICAL-URBANISM-EVIDENCE.md` (zero hits for `junction` / `crossroad`).

**Recommended framing for the chair: ADOPT as a register-matching target with the instrument
caveat recorded and a same-instrument census (extract the generated map to raster and run the
same skeletonizer, or measure the extractor's X-recovery on a synthetic grid first).
REFUSE the "real accretion produces T" rationale — it is unsourced and §261 forbids it.**

## (b) The GAP-B general law (a statistic may be a census and forbidden as a generator input)

**EVIDENCE.** `MORPHOLOGY-PLAN.md:174` — `radialDensityFalloff` is a *symptom* of age/wealth/
land-use; fitting to it re-bakes the concentric prior. §250.6b generalises it and explicitly ties
it to §244.4 ("the same disease as pinning bands to the corpus median").

**STATUS: the law is sound and I would ratify it. PLAUSIBLE as to the specific claim that
fitting `radialDensityFalloff` re-bakes concentricity** (no experiment was run; it is an
argument, correctly labelled as a correction rather than a measurement).

**NOTE.** §259.4/D11 offered a *second* argument for GAP-B — that Watabou's radial gradient runs
through a defective distance routine, so *"if we fitted to the corpus's gradient noise, we
fitted to a bug."* **Under §261 that argument is void**: the corpus was never produced by
Watabou, so its gradient cannot be an artifact of Watabou's bug. **GAP-B survives on §250's own
reasoning; D11's leg must be struck.** The chair should check no downstream document leans on D11.

## (c) The four tier-invariants (junction mix, dead-end rate, φ, block elongation)

**EVIDENCE — recomputed per tier over the 35 whole windows:**

| tier | n | X:T | dead-end | φ | block elong p50 |
|---|---|---|---|---|---|
| thorp | 2 | 0.0135 | 0.252 | 0.113 | 2.02 |
| hamlet | 2 | 0.0186 | 0.153 | 0.273 | 1.58 |
| village | 3 | 0.0164 | 0.208 | 0.085 | 1.97 |
| town | 17 | 0.0287 | 0.195 | 0.119 | 2.08 |
| city | 7 | 0.0119 | 0.219 | 0.069 | 2.45 |
| metropolis | 4 | 0.0259 | 0.225 | 0.095 | 2.21 |

**STATUS: CONFIRMED that no monotone trend is detectable.**

**DOUBT — the claim is a negative result on n=2 per low tier.** Thorp, hamlet, village rest on
**2, 2 and 3 windows**. A negative result at n=2 cannot establish invariance; it can only fail
to detect variance. Block elongation does show a mild town→city rise (2.08 → 2.45) that the
sample cannot rule in or out. **The engineering ruling ("do not scale these dials with tier")
is defensible on its own merits — moving them changes kind, not size — but the row presents it
as MEASURED and it is not measured at the low tiers.** I would ratify the *rule* and amend the
*warrant*.

## (d) circuitDemotion's promotion to wave-nine first-order

**EVIDENCE.** `MORPHOLOGY-PLAN.md:419-421` — the complete transformation table
(`wall→ring street`, `gate→street widening + frontage break`, `tower→circular footprint`,
`ditch→garden band`, `intervallum→carriageway`), `[E, CONFIRMED at 1500px zoom on hf347]`,
with the argument that §240 + §239.3 make multi-circuit settlements imminent and nothing says
what happens to the superseded ring. **Independently corroborated by the other lane**:
`docs/OWNER_DECISION_QUEUE.md:9159-9161` (§251.3) reports MF-S3b finding the same fossilisation
on disjoint evidence.

**STATUS: the mechanism's necessity is CONFIRMED by argument and independently duplicated.
The vocabulary itself is [E] — one plate, eye-read at zoom, n=1.**

**DOUBT.** The whole five-element table rests on **hf347 alone**, and hf347 is separately flagged
in the calibration index as `keeper, MORPHOLOGY FLAG — use for evidence, not for shape`, and its
own core sub-window is flagged untrustworthy (11 graph nodes). A single flagged plate is thin
warrant for a five-row transformation table promoted to wave-nine first-order. The *promotion*
is right — the gap is real and the consequence (every new ring erases history) is severe — but
the **table's specific contents should be re-derived at n≥2 before implementation**, and I found
no second witness for it.

## (e) ⛔ The epoch calibration figures (newer = 1.8–2.9× coarser; order by founding mode; max 4 epochs)

**THIS IS MY SHARPEST DISCONFIRMING FINDING IN THE CLUSTER.**

### (e1) The 1.8–2.9× grain range is an instrument artifact of unequal window widths

**EVIDENCE — arithmetic, from `MFS3a-voidmetrics.json` and `MFS3a-voids.py`.**

`MFS3a-voids.py:53-56` establishes the kernel:
```
med = float(np.median(runs))          # dark-run COUNT per scan line across the window
pitch = ww/max(med,1e-6)              # ww = window width in px
out.update(cells_across_p50=round(med,1), cell_pitch_px=round(pitch,2))
```
`cells_across` is a **raw count across a hand-set window**; it scales linearly with window width
at fixed plot size. `cell_pitch_px` is the **plot module in px**, and because both sub-windows of
a pair come from the same plate rendered at the same `longside=1600`, pitch is directly
comparable within a pair. Measured:

| pair | cells A → B | **cells ratio** | window width A → B | **window ratio** | pitch A → B | **PITCH RATIO (the real coarsening)** |
|---|---|---|---|---|---|---|
| hf26 old → newquarter | 46.9 → 16.3 | **2.88×** | 960 → 480 | **2.00×** | 20.45 → 29.50 | **1.44×** |
| hf274 oldbank → newcharter | 47.2 → 26.6 | **1.77×** | 640 → 480 | **1.33×** | 13.55 → 18.05 | **1.33×** |
| hf347 core → outerring | 17.4 → 9.8 | **1.78×** | 287 → 225 | **1.28×** | 16.54 → 23.00 | **1.39×** |
| hf239 (castra=older) → vicus | 33.8 → 30.0 | 1.13× | 544 → 480 | 1.13× | 16.11 → 16.00 | **0.99×** |

Every published ratio decomposes exactly as **pitch ratio × window-width ratio**
(1.44 × 2.00 = 2.88 ✓; 1.33 × 1.33 = 1.77 ✓; 1.39 × 1.28 = 1.78 ✓).

**STATUS: CONFIRMED that the published range is inflated. On the window-independent quantity the
epoch coarsening is 1.33× – 1.44×, not 1.8× – 2.9×, and hf239 is 0.99× (no coarsening at all).**

**Why this matters most.** §244.5 struck T-01's low rungs **for exactly this instrument defect**
— `cells_across` is window-dependent and MF-S1's hf10 window was misplaced. **§250.4 then adopted
a binding number produced by the same defect, one row later, and the ODQ elevates it to
"§240's binding numbers."** The finding did not travel from the row that made it to the row that
needed it. If §240's epoch generator is tuned to make newer fabric 1.8–2.9× coarser, it will
overshoot the corpus by roughly 35–100%.

**Second, smaller problem:** the range 1.8–2.9× is **min–max over n=3 pairs**, and the fourth
measured pair (hf239, 0.99×) is excluded from it. A quarter of the evidence contradicts the
direction and is handled by re-framing (correctly, as founding-mode) rather than by widening the
band. Additionally hf347's core window resolves so little that the same doc refuses to trust its
φ; its grain pair carries the largest window-ratio distortion after hf26.

### (e2) "Order tracks FOUNDING MODE, not age" — CONFIRMED and well-founded

`hf239@camp φ 0.5848` vs `hf239@vicus φ 0.0739` = **7.91×** (doc: 7.9× ✓);
`hf26@newquarter 0.6517` vs `hf26@old 0.0694` = **9.39×** (doc says **9.5×** — should be 9.4×);
`hf274@newcharter 0.3179` vs `hf274@oldbank 0.1308` = 2.43× (doc: 2.4× ✓).
The hf239 inversion (planned epoch is the *oldest*) is real in the data and is the correct
generalisation. **This is the strongest part of §250.4 and I would ratify it as filed.**
The `φ > 0.8 is drawn wrong` ceiling is also well-supported (max trustworthy φ = 0.6517).

### (e3) "MAX 4 legible epochs anywhere in 313 plates" — the ledger overstates the scope

**EVIDENCE.** `MORPHOLOGY-PLAN.md:387`: *"Not one **studiable** plate legibly shows more than
four."* `MORPHOLOGY-PLAN.md:45`: **studiable frame is 222**, not 313 (91 excluded).
`MORPHOLOGY-PLAN.md:53`: *"all 222 studiable plates were passed over via `laneHF-CALIBRATION.md`'s
per-plate index … and **36 were viewed directly**."* The count is tagged **[E, CONFIRMED]** — an
eye count.

**STATUS: the claim is CONFIRMED at its true scope and OVERSTATED in the ledger.** §250.4's
*"MAX 4 legible epochs anywhere in 313 plates"* is wrong on two counts: the frame was 222, and
only **36 plates were directly viewed**; the other 186 were read through index prose. This is
the same failure §249.3 banked as law one row earlier — **a superlative must be measured at its
stated scope.** The chair should amend the figure to "max 4 across 36 directly-viewed plates of
a 222-plate studiable frame," which is still a useful corroboration of §240.2's ring ceilings but
is not a fact about 313.

## (bonus) The holdout discipline recorded as exemplary — VERIFIED CLEAN

**EVIDENCE.** I scanned `MORPHOLOGY-PLAN.md` for every `hf\d+` token and intersected against the
conservative 91-id exclusion: **80 distinct ids cited, 0 from the excluded set, 0 from the live
53.** §10.3 is present as a withdrawal notice in its own section slot
(`MORPHOLOGY-PLAN.md:564`, `:705`, `:733`).

**STATUS: CONFIRMED. §250.7's praise is earned, and this is the cleanest discipline in the
cluster.** It also makes the contrast with §251 (below) unmistakable.

---

# §251 — the context compendium's rulings

## (a) Re-sequencing §214's terrain arm behind a relief substrate while letting its wall arm proceed

**EVIDENCE.** `docs/OWNER_DECISION_QUEUE.md:9166-9172` — §214's terrain arm (hachure tightening
with gradient, crag hatch by land form, terraces on each band's own curve) has no relief field to
consume; b6 carries a single `RELIEF 0.30` scalar.

**STATUS: PLAUSIBLE.** The b6 scalar claim is a live-source assertion I did not execute against a
b6 leaf. The *inference* is sound on its face: a per-band curve cannot be derived from one scalar.
Splitting the arms (terrain re-sequenced, wall/iconography proceeds) is the minimum-loss
disposition and I have no objection.

**DOUBT.** The row says *"the dependency was recorded nowhere."* That is the finding worth
generalising, and §251 does not: **an arm blocked on a missing substrate field is a class, not an
instance.** No sweep was ordered for other §150–§245 items with the same shape.

## (b) §240 and the run-chain must land TOGETHER

**EVIDENCE.** `docs/OWNER_DECISION_QUEUE.md:9172-9176` — three rings derived without run typing
come out CONCENTRIC, *"the exact prior the corpus spent three growth rounds and eleven deformed
plates failing to beat."* The eleven-deformed-plates figure traces to §242.2 (`it survived three
rounds and deformed at least eleven plates`) and the cure at n=5 including the siege town.

**STATUS: PLAUSIBLE — the concentric-without-run-typing claim is an argument, not an experiment.**
No three-ring output was generated and measured for concentricity. It is a strong argument
(§252.3a later confirms a metropolis third circuit is derived and capped, so the case is live),
and the cost asymmetry it invokes is real: landing §240 alone ships a known defect and then pays a
declared shift twice.

**Is it strong enough to bind the sequence?** In my reading **yes, but for a reason the row does
not state**: the binding force comes not from the concentricity prediction (unexecuted) but from
**§250.5's independently-found `circuitDemotion` gap** — multiple circuits without demotion erase
history regardless of whether they are concentric. Two independent lanes converged on
"don't land rings alone." The chair may want to re-base the ruling on the stronger leg.

## (c) Keying §200's clearance exemption to run type on 7/7-some-runs / 0/7-every-run evidence

**EVIDENCE.** `MORPHOLOGY-CONTEXT.md:843`:
> **[M-view, n=7 walled plates]: 7 of 7 have a wall-side street on SOME runs. 0 of 7 have one
> on EVERY run.**
Restated at `:2084` and the consequence at `:2123` (*"§200's wall-clearance census will red on
correct output"*).

**STATUS: CONFIRMED as recorded; the inference is logically strong even at n=7.**
The claim doing the work is **0/7 on every run** — a universal ("wall-side street on every run")
is refuted by a single counterexample, and there are seven. So the conclusion *"a global rule is
wrong; this must be a per-run derivation"* is robust at this n in a way that a positive frequency
claim would not be. The consequential half — that §200's census reds on correct output — follows
directly and is the kind of finding that saves a wave.

**DOUBTS.**
1. `[M-view]` = eye-read, not instrumented. There is no wall-side-street measurement anywhere in
   `MFS3a-planmetrics.json` or `MFS3a-voidmetrics.json`. The finding cannot be re-run.
2. n=7 walled plates were drawn from a studiable frame that excluded 81 plates. Walled-plate
   coverage in the corpus is larger than 7; the sample is what the lane opened, not what exists.

## (d) ⭐ "Plausible settlement, implausible world" and the fix is mostly four existing dossier fields

**EVIDENCE.** `docs/OWNER_DECISION_QUEUE.md:9139-9149`:
> **AND ALMOST NONE OF THE FIX IS A NEW RENDERING CAPABILITY: it is four dossier fields
> (`supplyChains`, `neighbors`, `institutions`, `resources`) that the map today reads FOR LABELS
> AND NEVER FOR GEOMETRY.**

Mechanism tally: **3 HAVE + 18 PARTIAL + 23 MISSING + 1 NOT-DERIVABLE = 45** ✓ (arithmetic closes).
Census: `MFS3B-context-census.csv` = **232 rows × 52 columns** ✓ matching "232 eligible".
Exclusion: `mfs3b-excluded.txt` = **81 unique ids**, and I verified it equals exactly
`proposed ∪ minimal_swap.proposed` from `laneHFM1-holdout-proposal.json`. ✓

**STATUS: the arithmetic is CONFIRMED. The four-fields claim is PARTLY REFUTED by the live source
and by §287.**

**DOUBTS — three, and the first two are already on the record from §287.**
1. ⛔ **The field names are wrong and the guarantees do not exist.** `docs/OWNER_DECISION_QUEUE.md`
   §287.9 (line ~10925) folds the live-source corrections: *"resources live under
   `resourceAnalysis`, neighbour facts are split and lack guaranteed bearings, canonical generated
   `supplyChains` is not guaranteed, and the dossier PDF already renders a legacy map."*
   I verified the `supplyChains` half directly: `src/domain/supplyChainState.js:136` types it
   `@property {LegacyChain[]} [supplyChains]` — **optional** — and `:603` reads it via a
   fallback chain (`… || settlement.supplyChains`); `tests/domain/supplyChainState.test.js:338`
   is titled *"reads from the legacy top-level supplyChains field too."* **The field §251.2 names
   as one of the four is a legacy fallback, not the canonical home.**
2. ⚠ **"The map … never for geometry" is false for one of the two map surfaces.**
   `src/components/map/ChainEdges.jsx` — *"ChainEdges — draws supply chain paths between
   settlements"* — consumes chains derived from `savedSettlements + placements` and emits **path
   geometry**. That is the campaign/world map, not the town map, so §251.2's claim survives for
   the settlement map it means. But the ledger sentence says "the map", the product has two, and
   the claim is being used as **"the most actionable finding of the entire study program."**
   It should be scoped to the town map explicitly.
3. **The claim's force depends on "four fields" being cheap.** With `resources` under a different
   root, `neighbors` lacking guaranteed bearings, and `supplyChains` not canonically generated,
   the fix is **not** "read four existing fields for geometry" — it is "establish three of four
   fields as guaranteed, then read them for geometry." That is a different size of job, and it
   changes the row's headline.

## ⛔ (e) A finding §251 does not record: the two lanes had opposite holdout discipline

**EVIDENCE — executed.** I scanned both compendiums for every `hf\d+` token and intersected
against each lane's own stated exclusion:

| document | exclusion claimed | distinct ids cited | **excluded-set ids cited** | **live-holdout (53) ids cited** |
|---|---|---|---|---|
| `MORPHOLOGY-PLAN.md` | 91 (conservative) | 80 | **0** | **0** |
| `MORPHOLOGY-CONTEXT.md` | 81 (narrow, in code) | 176 | **49** | **33** |

Samples from the context document:
- `:183` `| a break of bulk | … | hf157, ★hf381 …, hf295 |`
- `hf267` ×3, `hf311` ×9, `hf365` ×8, `hf349` ×5, `hf355` ×5, `hf333` ×5, `hf354` ×4 …
- `★hf335` appears as a **starred exemplar**, and hf335 is a member of the adopted 53.

The lane was **not deceptive about it**: `laneMFS3b-receipt.md:148` says two ids *"are
holdout-excluded and were read only in the index"*, `MORPHOLOGY-CONTEXT.md:61` says *"81 plates
were excluded and never opened by this lane"*, and `:996` tags a specific pair the same way.
I checked whether any excluded id carries an `[M-view]` tag of its own: the seven lines where
`[M-view]` co-occurs with an excluded id all attach the tag to a **different** plate on the same
line. **No evidence any excluded plate was viewed.** The leak is index-derived prose citation.

**STATUS: CONFIRMED. §251.1's framing — "81 holdout plates excluded by the UNION rule enforced
IN CODE" — is accurate for the census (232 rows) and for image-opening, and materially
incomplete for the document's prose.**

**Why this matters to the chair.** §250.7 was collected the **same day, by the same chair**,
praising the plan lane for **withdrawing an entire finding (§10.3) rather than cite one holdout
plate**, and banking *"A STUDY TAKES THE LOSS RATHER THAN CONTAMINATE THE HOLDOUT"* as **LAW**.
The very next row records a lane that cited 49 excluded ids — 33 of them live holdout members —
without noting the divergence. The law was banked and broken in adjacent rows. §287.10 caught it
three days later (*"CONTEXT used descriptions of excluded ids"*) and the file now carries a
STATUS CORRECTION block at `MORPHOLOGY-CONTEXT.md:44`. **§251 as filed should be amended to
record the asymmetry, and §250.7's law should be restated to cover index prose, not only images.**

---

# §261 — the corpus-provenance correction

## (a) Do §259's twelve divergences carry any weight now that the corpus is an independent artifact?

**First, the provenance correction's factual basis — CONFIRMED, and independently verifiable.**

**EVIDENCE — executed on the artifacts, not taken from the row:**
- **All 313 plates carry a PNG `tEXt` chunk `hf-job-id` with a UUID; 313 unique ids; zero plates
  missing it.** Example: `hf10-thorp-plains.png` → `tEXthf-job-id\x006d74d6d0-134e-4787-b658-44ee423aa180`.
  These are **Higgsfield job ids** — mechanical proof the plates came from an image-generation
  pipeline, not from any procedural generator's export.
- **All 313 measure exactly 5056×3392** (I read the IHDR of every file), matching the
  image-generation delivery spec, and matching `laneHF4-receipt.md:27` (*"Every plate verified at
  5056×3392 by PIL"*).
- Model label on the record: `docs/OWNER_DECISION_QUEUE.md:4516` `nano_banana_pro@4k by
  executed-call receipts`; `:5729-5730` *"the platform routed the nano_banana_pro request to its
  nano_banana_2 backend; 4K (5056x3392) was delivered"*; `laneHF4-receipt.md:27` *"Model
  honest-label `nano_banana_2` on all 78, as in every prior wave."*
- Owner testimony (the decisive leg) at `docs/OWNER_DECISION_QUEUE.md:9781-9788`.

**STATUS: CONFIRMED. The corpus is an independent image-generation artifact and the correction is
right.** This is one of the few claims in the cluster verifiable from file bytes alone.

⚠ **One precision note:** §261.1 names the generator *"nano-banana-pro"*. The receipts record the
request as `nano_banana_pro@4k` **served by the `nano_banana_2` backend** on every wave. The row
states as fact a label the receipts qualify. Immaterial to the ruling; worth not propagating.

**Now the twelve. I read the divergence table at `map-corpus/docs/PRIOR-ART-WATABOU.md:922-933`
(D1–D12) and classified each by what OUR side of the disagreement actually was:**

| | rows | what §261 does to them |
|---|---|---|
| **Our inference came from the CORPUS** (so a disagreement with Watabou is two sources differing, not our error) | **D1** (tower spacing even), **D3** (chaos at small scale), **D11** (radial gradient strength) | attribution **must be struck**; content becomes a candidate mechanism only |
| **Our "inference" was an internal design choice, never inferred from Watabou at all** | **D2** (§165 affinity), **D9** (ward diversity engine) | not refutations of anything of ours; §259.4 itself concedes *"our organism model stands ahead"* |
| **Genuine mechanism readings about Watabou, which is all §261.3 preserves them as** | **D4, D5, D6, D8, D10** | survive as candidate mechanisms, each now needing §261.4's third leg |
| **Product-evolution note** | **D7** (no water in 2017) | never a claim about us |
| **Already the §261 finding, one row early** | **D12** — *"the painterly richness is the imitator's contribution"*, tagged **C-adjacent** | the study contained the evidence that would have corrected the framing |

**MY ANSWER TO (a): the twelve carry real but much narrower weight — five survive intact as
mechanism candidates, three had their attribution wrongly assigned to us, two were never about the
corpus, one is a product note, and one (D12) is §261 itself.** Nothing is lost that was load-bearing.

⛔ **DOUBT — §261.2b upgrades the evidence grade in the act of correcting the attribution.**
It says *"The twelve divergences stand as **FACTS**; their ATTRIBUTION is withdrawn."* But
`laneMFX2-receipt.md:121-123` states: *"**Every source-derived finding is PLAUSIBLE, not
CONFIRMED.** Execution was forbidden, so nothing here is backed by observed program output"* —
and they are readings of a **2017 snapshot** of a product our corpus was allegedly imitating in
its **2024+** form. §259.6 records the same limit. **Calling them FACTS in a correction row is
exactly the CONFIRMED/PLAUSIBLE slippage the doctrine forbids.** They are PLAUSIBLE static
readings. The chair should downgrade the word.

## (b) Does the chaos-at-large-scale hypothesis survive testing against the corpus's own block elongation and plot variance?

**EVIDENCE — I recomputed the corpus figures over the 35 whole windows:**
`block_solidity_p50` min 0.503 / **med 0.748** / max 0.861 ·
`block_elongation_p50` 1.557 / **2.142** / 3.418 · `block_elongation_p90` 2.559 / **4.406** / 9.357 ·
`block_area_cv` 0.646 / **1.596** / 3.994 · `block_circularity_p50` 0.126 / **0.324** / 0.578 ·
whole-settlement φ 0.044 / **0.103** / 0.433.

**And I found the test was correctly constructed and correctly left unrun.**
`map-corpus/docs/GENERATION-SPEC.md:3468-3510` builds it as **G-39** with a
**decision rule written before the numbers**:
> **ARM 1 — THE LARGE SCALE. Runnable today** … `block_solidity_p50` (corpus median **0.748**)
> … **Arm 1 is close to confirmed on our own published figures. It is arm 2 that decides.**
> **ARM 2 — THE SMALL SCALE. ⛔ NOT RUNNABLE TODAY.** ⭐ **CONFIRMED by enumerating the key names
> of `MFS3a-planmetrics.json` and `MFS3a-voidmetrics.json`: the finest spatial SHAPE metric we
> hold is BLOCK-scale.** There is **no footprint-rectangularity measure of any kind** …
> | **arm 2 unmeasurable** | ⚠ **the hypothesis stays a hypothesis and drives nothing.**
> *An untestable diagnosis is not a licence to rework* |

**I independently confirmed arm 2's premise**: I enumerated every key in both JSONs and there is
no building/footprint shape statistic — the finest are `block_solidity_p50`,
`block_circularity_p50`, `block_elongation_p50/p90`. `cells_across` is grain, not shape.

**MY ANSWER TO (b): the hypothesis's LARGE-SCALE half is supported by the corpus's own numbers
(solidity 0.748 = a quarter of the convex hull is not block; circularity 0.324; φ 0.103 whole-
settlement), and its SMALL-SCALE half — the half that decides it — is UNTESTABLE with every
instrument the program owns. §261.3's gate is therefore holding correctly and no rework should
start.** The written-before-numbers decision rule is good practice and I would ratify it.

## (c) The third-leg requirement for ADOPT verdicts

**EVIDENCE.** `docs/OWNER_DECISION_QUEUE.md:9825-9834` (§261.4) and its landing in
`GENERATION-SPEC.md:93-108` as a three-column table (CAUSE / LOOK / DIRECTION) with leg (b)
requiring *"a corpus metric that actually exists in `laneHFM1-corpus-measured.csv`,
`MFS3a-planmetrics.json`, `MFS3a-voidmetrics.json` or `MFS2-bands.json`"* — i.e. the leg is
**mechanically checkable**, not rhetorical. `GENERATION-SPEC.md:108`: §263.5 records it working —
*"10 FTG adoptions grew all three legs, two were flagged weak on (c) in place, and **6 mechanisms
were pushed out of the ranking entirely**."*

**STATUS: CONFIRMED as landed and as having bite** (6 mechanisms excluded is a real, costly
outcome, which is the evidence that a gate is not decorative).

**DOUBT.** Leg (b) names four artifact files as the universe of acceptable corpus metrics. **Three
of the four contain figures I have shown above to be instrument-confounded** (`cells_across`
window-dependence in `MFS3a-voidmetrics.json`, the X-recovery question in
`MFS3a-planmetrics.json`, the selection circularity in `MFS2-bands.json`'s tone IQR). The gate
enforces that a number *exists*; it does not enforce that the number is *valid*. **Recommended:
leg (b) should require the metric be named **and** its known instrument caveats declared.**

## (d) Did the propagated framing error contaminate anything beyond the rows §261 retracts?

**§261.2 retracts exactly three things: §254.1's framing, §259.4's scoring, §259.7's fidelity
check. I swept for the framing and found it standing in two more places.**

**EVIDENCE — case-insensitive sweep of `docs/OWNER_DECISION_QUEUE.md` for `imitat`:**
- `:9329` (**§254.1**) — *"our 313-plate corpus is an IMAGE MODEL'S IMITATION of Watabou's
  Medieval Fantasy City Generator"*. §261.2a retracts *"§254.1's 'original mechanism behind the
  style' framing"* — arguably covering this, but the imitation sentence itself is left in place
  and is the more quotable one.
- ⛔ `:9509` (**§256.2**) — *"Our corpus is an image model's **PAINTERLY IMITATION** of that style
  and it MEASURES RICHER than the original on the axes we grade."* **§256 is not named anywhere
  in §261.2's retraction list.** §261.4 says it *"sharpens §256"* — it does not retract §256.2's
  factual premise.

**This is the answer to (d): yes, and the surviving instance is the worse one.** §256 is an
**OWNER LAW** row whose §256.3 operational test is declared *"binding on MF-X1/MF-X2/MF-SPEC"*.
Its conclusion (the corpus measures richer; do not chase the original's look) is independently
true and survives — but its stated **premise** is the retracted framing, and the ODQ is
append-only, so any lane that reads §256 in isolation inherits the error from a row labelled
OWNER LAW.

**Downstream documents are clean, and I verified it rather than assuming it:**
- `GENERATION-SPEC.md:81-86` carries the correction verbatim (*"⛔ THE CHAIR'S OWN EARLIER
  FRAMING … IS RETRACTED (§261.1/§261.2a). Nothing in this document may rest on it."*) and
  `:134` records a **mechanical contamination sweep** over `watabou`, `imitat*`, `prior.art`,
  `procedural generator`, `the original`, `FTG`, `image generator`, `north star`, `reference art`,
  `the style`.
- `MORPHOLOGY-PLAN.md`: **0** occurrences of `imitat`. `MORPHOLOGY-CONTEXT.md`: **0**.
- `laneMFS1-urbanism-atlas.md`: **2** occurrences, neither about provenance
  (`:1419` "misread as validation", `:1468` "not a statistical imitation of these 49 pictures").

**Recommended chair action on (d): amend §256.2 in place (or add a §261.2d) so the retraction
covers the OWNER LAW row. Nothing else in §254–§260 needs touching.**

---

# RANKED DISCREPANCIES ACROSS THESE ROWS

Ranked by consequence to the build, not by size of the error.

**1. ⛔ §250.4's epoch grain range (1.8–2.9× coarser) is an instrument artifact of unequal
window widths.** Decomposed exactly: every published ratio = pitch ratio × window-width ratio.
The window-independent coarsening is **1.33× – 1.44×** (and 0.99× on the fourth pair). The ODQ
makes 1.8–2.9× **§240's binding numbers**; a generator tuned to them will overshoot the corpus by
35–100%. **This is the same defect §244.5 struck T-01's low rungs for, adopted one row later.**
*Substrate: `MFS3a-voids.py:53-56`, `MFS3a-voidmetrics.json`, table in §250(e1) above.*

**2. ⛔ §251's context lane cites 49 excluded ids — 33 of them live-holdout members — in prose,
while §250 banked "a study takes the loss rather than contaminate the holdout" as LAW in the
adjacent row.** The plan lane cites **0 of 91**. The ledger records the plan lane's discipline as
exemplary and does not record the context lane's divergence. Caught later by §287.10.
*Substrate: my token scan of both compendiums; `MORPHOLOGY-CONTEXT.md:44,61,996`;
`laneMFS3b-receipt.md:148`.*

**3. ⛔ §249.1's tone-IQR raise (18 → 22) is circular — the axis is a component of the index the
cohort is selected on.** HF-1 alone gives **17.9**, essentially the published 18. Grain and wash
survive on independent evidence; tone IQR does not. §249.4a's amendment cures the opposite
(unscored) case and leaves this one. *Substrate: `MFS2-bands.json` `fill_tone_iqr`
STRONGEST 22.0 / HF-1 17.9 / top-dec 29.2 / corpus 16.4.*

**4. ⚠ §250.2's rationale for the junction law is a claim about the real world the corpus cannot
support, and the absolute 0.024 is instrument-limited.** The number reproduces exactly (X:T
median 0.024 over 35 windows, 180 X vs 6,618 T) and the hf239 castra control proves the extractor
sees X where X is drawn (0.088, 6× median) — so *relative* discrimination is sound. But a
raster-extracted drawn graph and a generated vector graph are not the same measurement, and
`X:T ≤ 0.09` as a census band on generated output will red on correct output. No independent
historical source for junction mix exists in the repo. *(Minor: the doc says "22 of 35 have zero
deg≥5"; I count **27**. And "forty-three T per X" is 41.5 on the median.)*

**5. ⛔ §261.2b upgrades PLAUSIBLE to FACT.** *"The twelve divergences stand as FACTS"* —
`laneMFX2-receipt.md:121` says *"Every source-derived finding is PLAUSIBLE, not CONFIRMED."*
A correction row committing the doctrine's own labelling error.

**6. ⛔ §256.2 still carries the retracted provenance framing verbatim, uncorrected, in an
OWNER LAW row.** `docs/OWNER_DECISION_QUEUE.md:9509`. §261.2 retracts §254.1, §259.4 and §259.7
and does not name §256. Downstream documents are clean; the ledger is not.

**7. ⛔ §251.2's four-fields claim is wrong on field names and guarantees, and false for one of
the product's two map surfaces.** `supplyChains` is an optional legacy fallback
(`src/domain/supplyChainState.js:136,603`); `resources` lives under `resourceAnalysis`;
`neighbors` lacks guaranteed bearings (§287.9). `src/components/map/ChainEdges.jsx` already
consumes chains as **geometry** on the campaign map. The row's headline —
*"the most actionable finding of the entire study program"* — needs both scopings.

**8. ⚠ §242.3(a)'s "8-ITEM SCRUB LIST" is 34 plates in 8 categories** — a 4.25× understatement in
a row whose whole purpose is to tell downstream lanes which plates not to cite for naming.
*(Verified: 35 raw ids in `laneHF4-receipt.md:174-192`, minus `hf373` per §287.11.)*

**9. ⚠ §250.4's "MAX 4 legible epochs anywhere in 313 plates" was measured over a 222-plate
studiable frame of which 36 were directly viewed** — the exact scope failure §249.3 banked as
law one row earlier.

**10. ⚠ §249.4a's warmth ruling compares a median (37) against a centroid (34).** Consistently
computed the gap is 2.3 (centroid) or 4.0 (median), and the HF-1 centroid is **36**, not 37.
The ruling's direction survives on every estimator; the binding number is one unit warm of the
atlas's own nominated estimator. The atlas contradicts itself within one clause
(`laneMFS1-urbanism-atlas.md:924`: `#F9E9D5` is R−B 36, labelled 37, with a median L).

**11. ⚠ §244.5 applies its contamination finding asymmetrically.** Thorp/hamlet struck for
contamination; metropolis re-pinned to 80–120 over a 9-plate set containing **hf101** and
**hf105**, which the same receipt lists as contaminated. (I checked: the band survives their
removal — the reasoning is inconsistent, not the number.)

**12. ⚠ Two adopted cures were never executed.** hf389 is still on disk as
`hf389-city-metropolis-grain-max.png` despite §244.3 refuting exactly that property and the
receipt recommending a rename; and the lane's recommended **split of the star mark into TEACHING
and REGISTER** — buildable today from the CSV — was not adopted by §244.2 or §249.

**13. ⚠ §250.6a's four tier-invariants are a negative result on n=2/2/3 at the low tiers.**
Defensible as an engineering rule; presented as measured.

**14. ⚠ §250.5's five-row `circuitDemotion` vocabulary rests on hf347 alone**, a plate flagged
in the calibration index as *"use for evidence, not for shape"* whose own core sub-window is
declared untrustworthy. The promotion is right; the table needs a second witness.

**15. ⚠ Artifact drift.** The atlas is now **1,468 lines / 40 fold markers** against §249.2's
1,394 / 39; `laneHF4-receipt.md` was **rewritten in place** to fold in the correction that §244.2
made against it; both compendiums were edited on Aug 20. The as-filed HF-4 receipt survives only
in the old session scratchpad, which §243 declares temporary.

---

## What reproduced perfectly, so the chair can spend its attention elsewhere

Every one of these I executed and matched to the digit: the 78-row / 55-★★★ star audit under an
independently written parser; the five-round register table; the within-subject de-confounding;
all six band re-derivations and the three sign flips; the paper-drift table (96% → 55%,
warmth 37 → 24); the value-range refutation (hf50 = hf57 = 78; 32/49 and 210/313 under 120;
exactly one plate under 120 on the true range); the ink-L gate's behaviour on all five named
plates; the T-01 re-measurement at every tier; T-02 at ×1.2105 / ×1.4145; the nine
best-in-corpus percentiles; all three register-edge refutations; the L-percentile instrument
recovery; the entire holdout algebra (53 = 16.93%, era 0/7/26/15/5 → 6/6/17/13/11, zero scrub
intersection, 91 conservative and 81 narrow exclusions both exact); the three-number credit
reconciliation; the junction-mix table; the φ ratios; the corpus inventory (313 plates, all
5056×3392, 313 unique job ids, 313 previews); and `MFS2-bands.json MATCHES — dry run, no write`.

**The measurement work in this cluster is of high quality. The failures are almost entirely in
the transit from receipt to ledger row — scope widened, estimators mixed, caveats dropped, and
one instrument-validity finding that failed to travel from the row that made it to the row
that needed it.**
