# LANE MF-I1 — THE DECIDING INSTRUMENTS (ODQ §304)

**Seat:** Opus implementation lane under ODQ §291.5. I build and verify; judgment-dense calls are
RAISED to the Fable chair, never decided here.
**Scope honoured:** writes confined to `map-corpus/docs/` (new `MFI1-*` instruments and their
outputs) plus ONE ⟦FOLD §304⟧ edit set in `map-corpus/docs/GENERATION-SPEC.md` at the end.
No git operations, no repo gate, nothing under `docs/**` at repo root, nothing in `src/`.
**Honesty key:** **[M]** measured by an instrument in this lane · **[E]** eye-read by me ·
**CONFIRMED** = executed evidence quoted · **PLAUSIBLE** = reasoning only.

---

## §0 · EXCLUSION ARITHMETIC (LAW L6, stated first because it governs every figure below)

`MFI1-exclusions.py --report`, executed:

```
{"plates_on_disk": 313, "holdout_arm_proposed": 53, "holdout_arm_minimal_swap": 53,
 "holdout_arms_intersection": 25, "holdout_union_excluded": 81,
 "holdout_union_present_on_disk": 81, "plates_admissible": 232,
 "plates_excluded": 81, "arithmetic": "313 on disk - 81 holdout = 232 admissible",
 "scrub_34_naming_barred": 34, "scrub_intersect_holdout": []}
```

**313 on disk − 81 excluded = 232 admissible.** The brief names a 53-id roster, and
`laneHFM1-holdout-proposal.json` contains TWO 53-id arms — the lane's `proposed` set and the
`minimal_swap.proposed` set it recommended *in place of* it (`laneHFM1-receipt.md` §5.3: *"I
recommend the minimal one"*), intersecting in 25 ids for a union of 81. Every MFI1 instrument
excludes the **UNION**, which is correct under either adoption.

⭐ **AND THE ADOPTED ARM IS ON RECORD AFTER ALL** — `corpus_integrity.py` resolves it in code:
`final_eval = proposal["minimal_swap"]["proposed"]`, asserted to be *"the final evaluation
roster"* of 53 unique ids. So the adopted set is the **minimal-swap** arm, and this lane's union
is a strict superset of it: **no holdout member was touched, and 28 admissible plates were
excluded unnecessarily.** Recorded as **R-1** so a later lane can narrow the frame deliberately
rather than by drift. (The same gate independently reproduces this lane's other two arithmetic
figures: the 91-id conservative union and the 34-plate scrub.)

`corpus_integrity.py` was run read-only after every file this lane wrote and reports
`"status": "ok"` with `plan_instruments rows 49` and `register rows 313` — **nothing this lane
added moves it.**

Not one holdout id is opened, measured, or named anywhere in this receipt or in any MFI1 output.
**Zero of MFS3a's 49 hand-set windows fall in the excluded union** (MF-S3a had already applied a
conservative 91-plate exclusion when it set them), so the primary subject set loses nothing.

The **34-plate lettering scrub** is carried in `MFI1-exclusions.py` as `naming_barred()` and is
deliberately NOT an exclusion: ODQ §298.1c ratifies *geometry yes, naming never*. Every MFI1
instrument reads geometry and tone only and emits no naming observation.

---

## §1 · WHAT WAS BUILT

| file | gap | what it is |
|---|---|---|
| `MFI1-exclusions.py` | — | LAW L6 in code: the single place the holdout roster is spelled |
| `MFI1-footprints.py` | **G-40(iii)** | footprint-scale rectangularity + its synthetic positive control |
| `MFI1-g39.py` | **G-39** | runs §4.1c's four-outcome decision rule as written |
| `MFI1-roofs.py` | §298.4c | roof-count instrument for the withdrawn thorp/hamlet rungs |
| `MFI1-tone.py` | **G-40(ii)** | per-epoch between-region fill-tone separation |
| `MFI1-towers.py` | **G-40(i)** | tower spacing along the circuit |
| `MFI1-q1guard.py` | §297.7b | the Q-1 guard — REDS on a verdict against a withdrawn rung |

*(All seven landed. §2–§7 report them; §8 raises the judgment calls; §11 records the spec fold.)*

Subject sets: **all 49 of MF-S3a's hand-set windows are admissible** (MF-S3a had already applied a
91-plate exclusion when it set them, so the primary frame loses nothing to L6), plus **7
footprint-resolving windows this lane hand-set** (hf260, hf341, hf342, hf375 zoom + hf16, hf126,
hf128 village, the last three quoted unchanged from `HFM1-grain2.py`'s own table). `hf341` sits on
the 34-plate lettering scrub: its **geometry** is used and **no naming observation** is drawn from
it. 56 windows measured in all.

---

## §2 ⭐⭐ G-40(iii) · FOOTPRINT RECTANGULARITY — BUILT, VALIDATED, AND ITS RECOVERY MEASURED

`MFI1-footprints.py` · outputs `MFI1-control.json`, `MFI1-footprints.json`,
`MFI1-overlay/<key>-<mode>.png`

**Quantity.** Per drawn footprint, `rectangularity = area / area of its MINIMUM-AREA BOUNDING RECT`
(rotating calipers on the convex hull; no `cv2` dependency). Reported with `convexity`,
`elongation`, `area_cells` and bearing; per window the p10/p25/p50/p75/p90 and the share at or
above the control's rectangle reading.

### 2.1 · THE POSITIVE CONTROL — and it is not rectangles-only, because a rectangles-only control cannot fail

`--control` renders a synthetic plate in the corpus's tonal register with planted ground truth:
free-standing RECTANGLES, RECTANGLES WITH A RIDGE LINE, L-SHAPES, WEDGES, ELLIPSES, and ADJACENT
PAIRS separated by one outline gap; five fill tones spanning the corpus range including two pale
ones; hatching and hedge-dot distractors. Every planted shape's **analytic** rectangularity is
computed by the *same* rotating-calipers routine on its ideal vertices, so `bias = measured −
analytic` is attributable to extraction alone. Twelve runs: 3 seeds × 4 cell pitches (22/33/44/66
px). **CONFIRMED, `MFI1-control.json`, at the operating point (pitch ≥ 33 px):**

| mode | recovery min | recovery median | merge max | split max | spurious max |
|---|---|---|---|---|---|
| `mass` | **0.973** | **0.9875** | 0.038 | **0.000** | 0.054 |
| `region` | **0.943** | **0.9688** | 0.038 | 0.135 | 0.193 |

**And the reference readings that make the corpus numbers mean anything — a perfect rectangle does
NOT read 1.000 through this extractor:**

| planted shape | analytic | measured `mass` | measured `region` |
|---|---|---|---|
| **rectangle** | 1.000 | **0.921** | **0.927** |
| rectangle with a ridge line | 1.000 | 0.921 | 0.926 |
| adjacent pair (one outline gap) | 1.000 | 0.926 | 0.926 |
| **L-shape** | 0.77–0.78 | **0.704** | **0.703** |
| ellipse | 0.785 | 0.771 | 0.771 |
| **wedge (right triangle)** | 0.500 | **0.557** | **0.561** |

⭐ **The instrument DISCRIMINATES** — 0.92 for a rectangle against 0.70 for an L and 0.56 for a
wedge — which is the property a rectangularity metric has to have and which a rectangles-only
control would never have shown.

⚠ **THE OPERATING POINT IS A MEASURED CONSTRAINT, NOT A PREFERENCE.** At a 22 px cell pitch the
spurious rate is **0.57** (absolute-size ink furniture clears a pitch-relative area floor); at
33 px and above it is ≤ 0.05. So the instrument **autoscales every window's render longside so the
cell pitch lands at 40 px**, capped at the plates' native 5056. That also removes the scale
confound from every published figure — the ODQ §298.5e discipline applied before the fact rather
than after.

### 2.2 · TWO EXTRACTOR DEFECTS THE VALIDATION SHEET CAUGHT (MF-S3a's law: the instrument is not trusted until the sheet is looked at)

1. ⛔ **Per-pixel luminance thresholding was REFUTED by its own overlay.** The corpus draws
   buildings at several fill tones, so one cut runs *through* the range: dark buildings came out
   whole, mid buildings came out with a bite taken out of them — a notch that is pure instrument
   and reads as low rectangularity — and pale buildings vanished. **Cure: classify NOT-INK REGIONS
   WHOLE by their own median tone against a per-window paper reference.** The ink outline is
   tone-independent; a region can then be in or out but never half in. `hf3` moved 0.707 → 0.848
   on the cure and the sheet shows whole buildings.
2. ⛔ **The vegetation test convicted OCHRE ROOFS.** `G − (R+B)/2 > 6` scores +25 on an ochre roof
   at ≈(205,175,95); the corpus's vegetation is a sage that is genuinely *greener than it is red*.
   **Cure: `G − R > 3`.** Declared shift, both sides published: pooled `rect_p50` moved
   **0.6923 → 0.6945** (`mass`) and **0.7208 → 0.7230** (`region`) — the G-39 outcome is
   unchanged, which makes this a robustness datum rather than a fit. Pre-fix output preserved at
   `laneMFI1-footprints-PREGREENFIX.json`.

### 2.3 ⭐⭐ THE FINDING THAT MATTERS MOST, AND IT IS ABOUT THE SUBJECT, NOT THE INSTRUMENT

**AT TOWN AND CITY SCALE THIS CORPUS DOES NOT DRAW INDIVIDUAL BUILDING FOOTPRINTS AT ALL.** Its
dense fabric is drawn as **continuous perimeter-block RANGES with serrated frontages** — one
unbroken band around a block, with no party lines inside it. Both extraction modes agree and the
sheets show it plainly (`MFI1-overlay/hf364-mass.png` and `-region.png`: the tinted masses are
whole ranges). **[E, CONFIRMED at the sheet.]**

That is why the instrument runs in **TWO MODES whose errors point in opposite directions**, and
publishes both: `mass` bridges interior detail lines (right for a village or a zoom, wrong in dense
fabric where a terrace fuses); `region` treats every ink-bounded fill region as its own component
(right in dense fabric, wrong on a large detailed building, which it splits — and two halves of a
rectangle are two rectangles, so *that* error inflates rectangularity). **A verdict that holds in
both modes does not depend on the choice.** It is also why this lane hand-set a **footprint-
resolving** subject set — the zoom plates and the village tier, the only frames where the corpus
draws one building at a time — and reports it separately.

### 2.4 · THE CORPUS READING

**CONFIRMED, `MFI1-footprints.json` / `MFI1-g39.json`.** Read against the control's rectangle
ceiling, never against 1.0:

| subject set | mode | windows | footprints | rect p25 / **p50** / p75 | ÷ rect ceiling | share ≥ ceiling |
|---|---|---|---|---|---|---|
| all grain-valid | `mass` | 37 | 4,317 | 0.620 / **0.6945** / 0.752 | 0.754 | 1.3% |
| all grain-valid | `region` | 38 | 9,705 | 0.647 / **0.7230** / 0.810 | 0.780 | 1.9% |
| MFS3a frame | `mass` | 27 | 3,837 | — / **0.6936** / — | 0.753 | — |
| MFS3a frame | `region` | 28 | 8,841 | — / **0.7222** / — | 0.779 | — |
| **footprint-resolving** | `mass` | 10 | 480 | — / **0.7078** / — | 0.768 | — |
| **footprint-resolving** | `region` | 10 | 864 | — / **0.7269** / — | 0.784 | — |

⭐ **The corpus's drawn masses read at the control's L-SHAPE reference (0.70), not at its RECTANGLE
reference (0.92)** — and they do so in every mode and every subject set. Two robustness checks
that could have overturned it and did not: **the reading is FLAT IN SIZE** (mass-mode `rect_p50`
runs 0.699 / 0.685 / 0.656 / 0.709 / 0.687 / 0.664 / 0.654 / 0.717 across eight size bins from
<0.15 to >8 cell², so it is not a small-component discretisation artefact), and the control's own
rectangle reading is likewise flat in size (0.891 / 0.913 / 0.936 / 0.948 / 0.939 across the same
range). Thorp and hamlet windows are **excluded from both arms** — ODQ §244.5 invalidates the cell
pitch there and both the autoscale and the area band are keyed to it; measured on hf90 the pitch
comes from furrow spacing, the houses land at ~1.7% of the window, and every one is dropped as
over-size while the hedgerows are kept. That is the documented trap, reproduced.

---

## §3 ⭐⭐ G-39 · THE DECISION RULE, RUN AS WRITTEN — THE OUTCOME IS ROW 2

`MFI1-g39.py` · output `MFI1-g39.json`. **This lane does not decide what follows. §4.1c already
did, before the numbers existed. What follows is the row the numbers land in.**

**THE RULE, QUOTED VERBATIM from GENERATION-SPEC.md §4.1c ("THE DECISION RULE, written before the
numbers so it cannot be fitted afterwards"):**

> | outcome | what follows |
> |---|---|
> | **arm 1 disordered AND arm 2 rectangular** | ⭐ **hypothesis SUPPORTED.** G-38's grid-chaos axis is scoped to the *cut* geometry and forced toward zero as pieces approach building size; G-37's vocabulary is the small-scale half. **This is the rework §261 is gating** |
> | **arm 1 disordered AND arm 2 ALSO irregular** | ⛔ **hypothesis REFUTED for our target.** The corpus's buildings are not rectangular and imitating a generator's squareness would move us *away* from it. **G-38 keeps its four axes; the chaos scoping is not adopted** |
> | **arm 1 ordered** (contradicting §2.4) | ⛔ **stop and re-examine the instrument, not the hypothesis** — it would contradict figures this document publishes as CONFIRMED |
> | **arm 2 unmeasurable** (G-40(iii) not built) | ⚠ **the hypothesis stays a hypothesis and drives nothing.** *An untestable diagnosis is not a licence to rework* |

### 3.1 · ARM 1 — LARGE SCALE. **DISORDERED [M, CONFIRMED]**, n = 31 whole-settlement windows

| metric | p10 | **p50** | p90 | the spec's published figure |
|---|---|---|---|---|
| `orientation_order_phi` | 0.052 | **0.0983** | 0.207 | 0.044 – **0.103** – 0.433 ✅ reproduces |
| `orientation_entropy` | 3.343 | **3.4728** | 3.525 | — |
| `block_solidity_p50` | 0.652 | **0.7455** | 0.794 | **0.748** ✅ reproduces |
| `block_elongation_p50` | 1.788 | **2.143** | 2.543 | **2.14**, band 1.6–3.0 ✅ reproduces |
| `block_elongation_p90` | 3.228 | **4.612** | 6.570 | — |

All three disorder tests pass: φ p50 **0.0983 < 0.30**, solidity **0.7455 < 0.90**, elongation
**2.143 > 1.50**. ⭐ The three headline figures **reproduce the spec's own published values to
within rounding** — which is itself a check on the re-derivation, and it means the third rule row
("arm 1 ordered → re-examine the instrument") is not in play.

### 3.2 · ARM 2 — SMALL SCALE. **IRREGULAR [M, CONFIRMED]**, unanimously

Cut = the midpoint of the control's rectangle and L-shape readings — **0.8125** (`mass`) /
**0.8150** (`region`). Every one of the four aggregates in §2.4 sits at **0.694–0.727**, i.e. below
the cut and *at the L-shape reference*, with **1.3–1.9%** of footprints reaching the rectangle
reading. **Four of four aggregates: IRREGULAR.**

### 3.3 ⛔⛔ THE OUTCOME

> ### **arm 1 disordered AND arm 2 ALSO irregular → hypothesis REFUTED for our target.**
> **"The corpus's buildings are not rectangular and imitating a generator's squareness would move
> us *away* from it. G-38 keeps its four axes; the chaos scoping is not adopted."**

⭐ **And §4.1c's own honest note survives intact and should be read beside this**: *even if the
hypothesis is refuted, the MECHANISM it inspired survives independently* — G-37's fit-the-footprint
has its own three legs and its own measured miss and does not rest on this test. **What the test
governed was whether we may say WHY we did it, and the answer is now: not on these grounds.**

⚠ **THE ONE SCOPE CAVEAT, RAISED not buried (R-2).** §4.1c's arm 2 asks about *"the buildings
inside them"*. §2.3 shows that at town tier and above **this corpus draws ranges, not buildings**,
so in the MFS3a frame the arm-2 subject is partly a category the plates do not contain. **This does
not change the outcome** — the footprint-resolving subset, which contains only frames where single
buildings *are* drawn, returns 0.708 / 0.727, the same verdict — but the chair may wish to record
that arm 2 was answered on two subject sets rather than one, and that the corpus's answer to *"are
the small pieces rectangular"* is partly **"the corpus does not draw small pieces there at all."**

---

## §4 · G-40(ii) · PER-EPOCH TONE CONTRAST — BUILT, AND IT READS **NULL**

`MFI1-tone.py` · output `MFI1-tone.json`. Subjects: MORPHOLOGY-PLAN §6.2's own measured epoch
window pairs, plus two non-epoch within-plate district contrasts as comparison cases.

**Quantity and its invariances, stated as the brief requires.** `d_paper(region) = paper_L(PLATE) −
median fill L(region)`, with the paper reference taken **once per plate and shared by both regions**
so the plate's paper tone divides out; `delta_tone = |d_paper(A) − d_paper(B)|`, plus `delta_chroma`,
a standardised separation, and a bounded **overlap coefficient** of the two per-mass tone
distributions. **INVARIANT TO** window size and area (every quantity is a statistic of a
distribution over drawn masses, never a count — §298.5e's lesson applied by construction), the
plate's paper tone, and the render longside (checked, not asserted: hf26 reads 23.17 / 23.16 / 24.0
at longsides 2200 / 3000 / 3800). **NOT INVARIANT TO** the ink threshold or the fill classification,
both published per row. ⚠ The first build **autoscaled** to window A's grain pitch, which made
different pairs incomparable — the sweep caught it (hf274 read 15.8 L autoscaled and 2.8–5.0 L at
every fixed longside), and the instrument now uses a **fixed longside and never consults a grain
kernel at all**.

### 4.1 · THE ZERO POINT IS MEASURED, NOT ASSUMED

`--null` runs the identical comparison **between the two halves of ONE region**. **Within-region
null: `delta_tone` p50 10.96 L, p90 18.73 L, overlap p50 0.405** (n = 2 adequately-powered nulls).
A pair separation must clear that to mean anything. ⚠ The first build's null ran at **25 L (p90 42
L)** because the solid-dark-mass arm was admitting thick ink junctions whose luminance is ink's;
that arm is now off for tone, and any mass whose median L sits at or below the plate's ink
threshold is dropped by name and counted. **The null convicted the instrument and the instrument
was fixed — which is what a null is for.**

### 4.2 · THE READING [M, CONFIRMED at longside 3000]

| pair | kind | Δtone (L) | Δchroma | overlap | n masses | powered? | reads |
|---|---|---|---|---|---|---|---|
| hf26 old → **burnt** quarter | epoch | **24.00** | 33.5 | 0.184 | 33 / 13 | ✅ | ⭐ clears the null |
| hf26 old → new quarter | epoch | 23.16 | 14.5 | 0.121 | 33 / **8** | ⛔ under | suggestive only |
| hf274 Oldbank → Newcharter | epoch | **2.75** | 7.5 | 0.374 | 62 / 20 | ✅ | **NULL** |
| hf239 vicus → castra camp | epoch | **6.17** | 12.0 | 0.431 | 28 / 87 | ✅ | **NULL** |
| hf347 core → outer ring | epoch | 33.66 | 4.0 | 0.000 | 9 / **1** | ⛔ under | uninterpretable |
| hf40 rich → poor | district | 9.33 | 2.0 | 0.077 | **5** / 13 | ⛔ under | uninterpretable |
| hf72 east → west nucleus | district | **0.34** | 13.5 | 0.376 | 25 / 18 | ✅ | **NULL** ✅ *the negative control behaves* |

⭐⭐ **THE ANSWER G-40(ii) WAS BUILT TO GIVE: the corpus does NOT separate its epochs by fill
tone.** Of the four §6.2 epoch pairs, two are adequately powered and **both read at or below the
instrument's own within-region null**. The only powered contrast that clears the null is hf26's
**BURNT** quarter — a fire scar, which is §161g's demotion vocabulary, **not a material vintage**.
And the negative control (two nuclei of one town, contemporaneous) reads **0.34 L**, which is the
behaviour that makes the null readings believable.

⛔ **CONSEQUENCE FOR THE GATED MECHANISM.** "Building material varies per epoch" was sitting in
§4.1b's ungated list waiting for exactly this number. **It now has one, and the number says the
corpus has no such signature.** Under §258.2 the mechanism cannot claim a corpus warrant; if it is
adopted it must be adopted as a **deliberate departure from the corpus register**, argued on
legibility grounds and labelled as such — not as something the plates do. **That is a chair
ruling, not this lane's.**

⚠ **HONEST LIMIT (R-3).** Three of seven pairs are underpowered because MF-S3a's `@part`
sub-windows are small and the fill classifier keeps few masses in them. A stronger reading needs
larger sub-windows (or a lower area floor) on hf347 and hf40, and re-set `@newquarter` bounds on
hf26. **Absence of a detectable separation at n=2 powered epoch pairs is weak evidence of absence,
and I am not claiming more than the table says.**

---

## §5 · THE ROOF-COUNT INSTRUMENT (§298.4c) — BUILT; ITS COUNTS ARE **UPPER BOUNDS**

`MFI1-roofs.py` · outputs `MFI1-roofs.json`, `MFI1-roofoverlay/<id>.png`. It counts **drawn
building masses** in the low-tier windows, quoted **unchanged from `HFM1-grain2.py`'s own table**
so the roof figure and the withdrawn grain figure are read off the same frame. It never consults
the grain kernel — that is the whole point, since §244.5 invalidated it at these tiers.

### 5.1 · MEASUREMENTS — **NOT BANDS, AND NOT EVEN PROPOSED RUNGS** [M]

| tier | windows (holdout excluded) | measured roof counts | p50 |
|---|---|---|---|
| **thorp** | 6 | 3 · 9 · 11 · 11 · 17 · 25 | 11 |
| **hamlet** | 5 | 20 · 25 · 26 · 40 · 49 | 26 |
| village *(reference rung, NOT withdrawn)* | 6 | 6 · 15 · 19 · 30 · 34 · 45 | 24.5 |

⭐ For scale: on `hf90` — §244.5's own witness — the grain kernel returns **99.6 "cells across"**
(MF-S3a's re-implementation returns 55.0) while this instrument returns **25 masses** against
**16 hand-counted buildings**. The instrument is measuring the right *kind* of thing.

### 5.2 ⛔ THE RECOVERY FIGURE, MEASURED AND UNFLATTERING [E, executed against the overlay]

On `hf90`: instrument **25**, hand count **16** drawn building masses, true positives **14**.
**Recall 0.875 · precision 0.56.** False positives: one well plus ~10 **hedge-bank fragments** at
field boundaries near the window edge. False negatives: two houses dropped by the outline test.
Longside stability is mixed — 6 of 8 sampled plates stable across 2000/2600/3400 (hf90 27/25/25,
hf85 11/11/10), 2 unstable (hf86 8/11/32, hf10 2/3/5).

⛔ **THEREFORE THE COUNTS MAY NOT SET A BAND, AND I PROPOSE NO RUNGS.** The brief asked for
measurements not adoption; the honest report is one step short of even that — at precision 0.56
these figures are **upper bounds** and the tier separation they show (thorp 11 vs hamlet 26) is not
yet clean enough to carry a target. **What it needs is one more pass on a single named
false-positive class: hedge-bank fragments at field boundaries.** RAISED as **R-4**.

⚠ **AND ONE AMBIGUITY THAT IS THE CHAIR'S, NOT MINE (R-5): "twelve roofs" is not defined.**
§244.5 calls hf90 a TWELVE-ROOF thorp. I count **16 drawn building masses** in the hand-set window
(and the window covers only part of the plate). If "roof" means a roof *plane*, an L-plan house
under two pitches is two; if it means a drawn mass, it is one. The instrument counts **masses** and
says so. I have not reconciled the two by choosing the flattering reading.

### 5.3 · WHAT THIS DOES **NOT** DO

It does not restore T-01's thorp and hamlet rungs. Those stay **WITHDRAWN**. §257.3(b)'s standing
disposition is untouched: the numbers may remain a *generation input* labelled
UNVALIDATED-BY-INSTRUMENT; they may not be *graded*. The Q-1 guard below enforces exactly that.

---

## §6 · G-40(i) · TOWER SPACING — **THE PLATE-SIDE INSTRUMENT IS NOT DELIVERED, AND I SAY SO**

`MFI1-towers.py` · output `MFI1-towers.json`.

**Plate-side extraction was attempted and is NOT reliable.** The prototype finds a circuit
candidate but cannot separate a tower bulge from a gatehouse, a corner thickening, or a wall-side
building, and I have no ground truth at zoom resolution to measure it against. **It therefore
publishes NO spacing figure at all** — publishing one would be precisely the unmeasured-recovery
disease ODQ §298.5a named when it refused the junction extractor's absolute band. **I did not fake
a recovery rate.**

### 6.1 · WHAT IS DELIVERED INSTEAD

**(a) The generated-side instrument, specified to the point of implementation** (module docstring):
from the circuit polyline R and tower arc-length positions, `towers_per_unit_length = n / L(R)`;
`spacing_cv = sd(gaps)/mean(gaps)` over the n closed-ring gaps; `spacing_cv_robust`; and
⭐ **`corner_share` — the share of towers within `tol` of a ring vertex whose exterior angle
exceeds `corner_deg`, which is the quantity that actually tests S13's corner rule and which no
instrument has ever reported.** `spacing_cv` is the dimensionless comparison quantity;
`towers_per_unit_length` must always carry its unit (§298.5e).

**(b) A hand-counted calibration sample, 5 non-holdout walled plates [E, 1500 px, ±stated]:**

| plate | circuit | towers | ± | gates |
|---|---|---|---|---|
| hf324 | hedged bank + ditch | **0** | 0 | 0 |
| hf239 | *vallum et fossa* | **0** | 0 | 4 |
| hf364 | masonry, round towers | 10 | 2 | 5 |
| hf347 | masonry, round towers, **smooth oval** | 17 | 3 | 4 |
| hf331 | masonry, D-shaped mural towers | 25 | 4 | 4 |

### 6.2 ⭐⭐ THE FINDING THAT DOES NOT NEED THE INSTRUMENT

**TWO OF FIVE WALLED PLATES CARRY A CIRCUIT WITH ZERO TOWERS** — hf239's is a rampart and ditch
with rounded corners, four gates and no bastions anywhere; hf324's is a hedged bank. **And of the
three masonry circuits, all three space towers ALONG THE RUN — hf347's outer circuit is a smooth
oval with no corners at all and still carries seventeen.**

⛔ **So "towers at wall corners" (S13 / §3.4 #7 / **SUB-3**) is at best PART of the corpus's
vocabulary and is not its governing rule.** A corners-only mechanism would emit nothing on a smooth
circuit and would emit towers on two circuits that should have none. **SUB-3 is held under §258.2
for want of a signature; this lane's reading is that the signature it needs is not "corner
occupancy" but "presence-then-spacing": first whether the circuit is masonry at all, then
`spacing_cv` along it.** That reframing is a proposal, and it is the chair's to accept — **R-6**.

*(Bonus, recorded because it is `circuitDemotion`'s vocabulary drawn: hf347 shows two former wall
towers surviving inside the fabric as circular "TOWER DWELLING" buildings — MORPHOLOGY-PLAN §6.3's
transformation table, visible on the plate.)*

---

## §7 · THE Q-1 GUARD (§297.7b) — BUILT, **PROVEN TO FIRE**, AND CURRENTLY GREEN

`MFI1-q1guard.py`. It REDS when one sentence or table row of a grading surface **(a)** names a
withdrawn rung (`thorp` / `hamlet`), **(b)** names the withdrawn quantity (the T-01 grain /
cells-across family), and **(c)** carries a grading verdict token — and does **not** carry a
withdrawal marker. The conjunction is what keeps it quiet on the many correct sentences that say
the rung *is* withdrawn.

**The planted-violation arm is part of the instrument, and it is executed:**

```
$ python3 MFI1-q1guard.py --selftest
Q-1 guard self-test PASSED — 3 planted violations fired, 5 near-misses stayed quiet, file walk fired.
SELFTEST_EXIT=0
```

The five near-misses are quoted from the real documents, including
`| village | 9.6 | 17.0 | 30-50 | MISSES x1.76 from the floor |` (a *live* rung, must not fire)
and GENERATION-SPEC's own withdrawal rows. The file-walk arm writes a planted grading surface to a
temp directory and asserts the directory walk fires on it, so the walk is exercised and not just
the matcher.

**Live scan, executed:**

```
$ python3 MFI1-q1guard.py
Q-1 guard: scanned 16 markdown surfaces under .
GREEN — no grading verdict is issued against a withdrawn rung.
SCAN_EXIT=0
```

Exit codes are `0` green / `1` RED / `2` self-test failure, so it drops straight into a gate beside
`corpus_integrity.py`. ⚠ It scans `map-corpus/docs/**.md` only; extending it to `docs/**` at repo
root is a one-line change this lane's scope forbade.

---

## §8 ⭐⭐ RAISED — judgment-dense calls, decided provisionally so work could proceed, all vetoable

| id | the call | what I did, and why | what a veto costs |
|---|---|---|---|
| **R-1** | **The exclusion frame is 28 plates wider than it needed to be.** I excluded the UNION (81) of the two 53-id arms; `corpus_integrity.py` names the **minimal-swap** arm as *the final evaluation roster*, which I found only after the runs | **Left the union in place.** It is a strict superset — no holdout member was touched and no figure is wrong, only narrower than necessary | Re-running the three corpus instruments against the 53. **Zero** MFS3a windows and **one** low-tier window sit in the difference, so the published figures would barely move; the value is that the frame stops being conservative by accident |
| **R-2** | **On what subject set is §4.1c's arm 2 answered?** The rule assumes the corpus draws buildings inside blocks; at town tier and above it draws **ranges** | Reported **both** — the MFS3a frame and a hand-set footprint-resolving set — and they agree | None; the outcome is identical either way. But the chair may want the scope recorded in the §4.1c block itself |
| **R-2b** | **The arm-2 threshold is not in §4.1c.** The rule says "rectangular" / "irregular" and puts no number on either | Cut at the **midpoint of the control's own rectangle (0.921) and L-shape (0.704) readings = 0.8125**, anchored on a control that never saw the corpus. ⚠ **Disclosure: I had seen preliminary corpus values (0.67–0.86) before fixing this cut.** The corpus reads 0.69–0.73, so any cut between 0.74 and 0.92 gives the same verdict — the choice is not load-bearing, and I am telling you rather than implying otherwise | Re-running `MFI1-g39.py` with a different constant; seconds |
| **R-3** | **Three of seven tone pairs are underpowered** (hf347 outer ring n=1, hf40 rich n=5, hf26 new quarter n=8) | Marked `underpowered` and excluded from the reading rather than quoted | Re-setting three `@part` windows and one re-run. Would strengthen a NULL result that currently rests on two powered epoch pairs |
| **R-4** | **The roof instrument's precision is 0.56** | Published the figure and **refused to propose rungs** | One targeted pass on the hedge-bank-fragment class. Until then §298.4c's "restores two rungs" is *not* discharged — the instrument exists, the restoration does not |
| **R-5** | **"Twelve roofs" is undefined** — planes or masses? | Instrument counts **masses** and says so; my hand count is 16 in the window | A definition sentence from the chair. It changes what any future band means |
| **R-6** | **SUB-3's signature may be the wrong quantity.** The hand pass refutes corners-only as the governing rule | Proposed **presence-then-spacing** (is the circuit masonry at all; then `spacing_cv` along it) and left SUB-3 held | Nothing built either way; §258.2 keeps SUB-3 held until a signature is named |
| **R-7** | **Two extractor cures were applied AFTER first corpus numbers existed** (§2.2) | Both are defects the validation sheet convicted, not tunings toward an answer; **both sides published**, pre-fix output preserved, outcome unchanged | Auditable in one diff |
| **R-8** ⛔⛔ | **The entire `map-corpus/docs` tree is STAGED FOR DELETION by another session** — 71 `D` entries, `git ls-files` returns 0, every file also shows untracked. §12 | **Touched nothing.** No git operation of any kind; foreign staged state is the owner's | Committing that index as it stands removes GENERATION-SPEC.md, MORPHOLOGY-PLAN.md, every MFS3a/HFM1 instrument, all seven MFI1 instruments and this fold from the repo. **Confirm intent and scope before any commit** |

---

## §9 · RE-RUN RECORD — every figure above is reproducible from these lines

Interpreter: `mfs3a-venv` (python 3.9.6; numpy 2.0.2 · scipy 1.13.1 · scikit-image 0.24.0 ·
Pillow 11.3.0). ⚠ The system `python3` has **no numpy**; `MFI1-exclusions.py` and `MFI1-q1guard.py`
are pure-stdlib and run under it, the rest need the venv. **All writers are DRY-RUN BY DEFAULT**
(the MFS3a/HFM1 convention); `--write` persists via a `.tmp` + `os.replace`.

```
python3 MFI1-exclusions.py --report
python3 MFI1-q1guard.py --selftest ; python3 MFI1-q1guard.py
<venv>/bin/python MFI1-footprints.py --control --write      # -> MFI1-control.json
<venv>/bin/python MFI1-footprints.py --plates  --write      # -> MFI1-footprints.json  (56 windows)
<venv>/bin/python MFI1-footprints.py --overlay hf3 hf33 hf364 hf90   # -> MFI1-overlay/
<venv>/bin/python MFI1-g39.py --write                       # -> MFI1-g39.json
<venv>/bin/python MFI1-roofs.py --write --overlay --scales  # -> MFI1-roofs.json, MFI1-roofoverlay/
<venv>/bin/python MFI1-tone.py --write --scales             # -> MFI1-tone.json
<venv>/bin/python MFI1-towers.py --write                    # -> MFI1-towers.json
```

Self-named logs in this scratchpad: `laneMFI1-probe.log` (the threshold probe that refuted the
local-adaptive mask), `laneMFI1-control*.log`, `laneMFI1-corpusrun{,2,3}.log`, `laneMFI1-roofs*.log`,
`laneMFI1-tone*.log`, `laneMFI1-g39*.out`, and `laneMFI1-footprints-PREGREENFIX.json`.

⚠ **The overlay sheets are REGENERABLE and only the six that carry a finding are kept on disk**
(21 MB; a full pass writes ~90 MB and MF-S3a's convention is that the sheets are working evidence,
not artefacts). Regenerate any of them with
`MFI1-footprints.py --overlay <ids>` / `MFI1-roofs.py --overlay`.

**Validation sheets that were LOOKED AT** (MF-S3a §0.4's binding convention): `hf3-mass` (convicted
the per-pixel threshold), `hf33-region` (showed the dense-fabric fusion), `hf364-mass` /
`hf364-region` (⭐ the range-not-footprint finding), `hf342-region` (a wall-band survey style the
extractor reads only partly — recorded), `hf90` roof sheet ×3 (convicted the vegetation test, then
the outline test, then gave the recovery figure).

---

## §10 · WHAT REMAINS FALSE OR UNBUILT AFTER THIS LANE — stated so nobody re-finds it

1. **G-40(i) plate-side extraction: NOT DELIVERED.** Generated-side spec + a 5-plate hand sample
   only. The corpus-side band does not exist and this lane did not invent one.
2. **§298.4c's "restores two rungs": NOT DISCHARGED.** The instrument exists; at precision 0.56 the
   restoration does not. T-01 thorp/hamlet stay withdrawn and the Q-1 guard now enforces it.
3. **The withdrawn population fit** (`cells_across ≈ 5.7 × population^0.27`) is **not** restored
   either — it was fitted on a grain quantity, and a roof count is a different quantity. Re-fitting
   it needs the clean counts of item 2 first.
4. **Style heterogeneity is unmeasured.** The corpus mixes true-plan (hf3, hf33), oblique-pictorial
   (hf20, hf90) and wall-band survey (hf342) styles, and the footprint instrument reads them
   differently. No style flag exists in any register. **This is a new gap and I am not minting a
   G-number for it; it is offered to the chair.**
5. **Thorp/hamlet footprint rectangularity is unmeasured** and stays so until item 2 gives those
   tiers a scale reference that is not the grain kernel.

---

## §11 · THE ⟦FOLD §304⟧ EDIT SET — one batch, ten anchors, all in `map-corpus/docs/GENERATION-SPEC.md`

| anchor | what the fold records |
|---|---|
| **§4.1c** (after the decision table) | ⭐⭐ **THE OUTCOME, recorded IN the block per its own rule**: arm 1 DISORDERED with its four figures, arm 2 IRREGULAR with its figures *and the control's reference points*, **OUTCOME = ROW 2, HYPOTHESIS REFUTED**, the §261.3 block discharged **by refutation**, plus the range-not-footprint scope caveat and the disclosure that the arm-2 cut is the lane's, not the block's |
| **§4.3** dependency graph, G-40 edges | per-arm edge status: (iii) BUILT AND SPENT · (ii) BUILT AND READS NULL · (i) STILL OPEN and narrowed |
| **§4.3** dependency graph, G-39 edge | block DISCHARGED BY REFUTATION; the principle may not be cited at all |
| **gap ledger rank 5 — G-40** | BUILT stamp with the headline recovery figures and the honest refusal on (i) |
| **gap ledger rank 26 — G-39** | the outcome, and **G-39 IS CLOSED** |
| **W0 wave row — G-40** | status triad; ⛔ **W0 does not close on G-40** — the tower arm is still owed |
| **W0 wave row — G-39** | ✅ DONE, rule applied as written, W3 may not cite the principle |
| **SUB-2** | the footprint half **now has its number and may be graded**, with the ceiling stated |
| **SUB-3** + the two mechanism rows (**towers**, **per-epoch material**) | SUB-3 STILL HELD and its *stated mechanism* now in doubt (2 of 5 circuits carry zero towers; a smooth oval carries 17); per-epoch material **not promoted — G-40(ii) read NULL** |
| **§2.1 T-01 + §2.6 register rows** | the roof instrument exists **and the rungs stay withdrawn** (precision 0.56, no band); the Q-1 guard now enforces the prohibition by machinery |

**Checks executed after the fold, both read-only:** `MFI1-q1guard.py` → **GREEN over 16 surfaces,
exit 0** (it did not fire on my own new withdrawal prose — a real test of the near-miss arm), and
`corpus_integrity.py` → **exit 0**, `plan_instruments rows 49`, `register rows 313`, `scrub ids 34`.
Nothing this lane wrote moves either gate.

---

## §12 ⛔⛔ SHARED-TREE ALARM — NOT MINE, NOT TOUCHED, AND THE CHAIR NEEDS TO SEE IT

`git ls-files map-corpus/docs/` returns **0**. `git status --porcelain map-corpus/` returns **71
staged deletions (`D `)**, and every on-disk file in that directory — including
`GENERATION-SPEC.md` itself — now also appears as **untracked (`??`)**.

**Another session has staged the removal of the ENTIRE `map-corpus/docs` tree from tracking.** The
files are all present on disk and everything above was measured against them; but **if that index
is committed as it stands, `GENERATION-SPEC.md`, `MORPHOLOGY-PLAN.md`, every `MFS3a-*`/`HFM1-*`
instrument, all seven `MFI1-*` instruments and this entire ⟦FOLD §304⟧ leave the repository.**

⚠ It may be deliberate — the standing IP-exposure item says *two documents must leave the repo* —
but **a whole-tree untracking is very much wider than two documents**, and a 71-file staged
deletion is not something a lane should discover by accident. **I performed no git operation of any
kind** (my brief forbids it, and foreign staged state is the owner's). **RAISED as R-8: confirm the
staged deletion is intended and scoped before anything is committed.**
