# Lane MF-W1b · **FINISHING W1 — THE SUBSTRATE** (§5 W1, ODQ §270.3): receipt

**Lane MF-W1b (Opus 5), 2026-08-17.** Predecessor: `laneMFW1SUB-receipt.md` (1 of 6 exit
criteria met, 1 partial, 4 unbuilt).
**Touched:** `mf-proto/build-out/**` — 15 source/harness files (one NEW) and 4 test files (two
NEW) — plus scratch under `MFW1B-*` / `laneMFW1B-*` and exemplars in `mf-proto-out/w1b/`.
⛔ **NO git write of any kind, NO repo gate, NO branch move, NO memory write, NO ODQ or spec
edit, NO stash.** The only repo access was READ-ONLY: `map-corpus/docs/GENERATION-SPEC.md` and
`git log`/`git worktree list`.
⚠ **THE MAIN WORKTREE'S HEAD MOVED UNDER ME MID-LANE** — `c6c8ee9a` at my first command,
`a8f91fb9` at my last. A sibling lane committed; I did not. Recorded because it is the
shared-tree hazard, and because any figure a successor diffs against a HEAD sha needs the sha.

---

## §0 · THE VERDICT, STATED FIRST

> ⭐⭐⭐ **ALL SIX EXIT CRITERIA ARE NOW MET, WITH ONE ARM OF ONE CRITERION HONESTLY NOT
> APPLICABLE AND SAID SO.** The `buildable` refusal mask is built and its census reads **0
> drawn bodies on refused ground over 21,982 bodies (12,105 distinct-site)** with two planted
> violations that red; `waterBearing` is on every water-bearing leaf and pinned DERIVED;
> the coastline carries two measured scales with the detail term **69% damped at the worked
> waterfront** and a counterfactual that withdraws it; and the suite moved **178 → 220 titles**,
> which is the gap the predecessor named as the largest. **96/96 renders under ceiling** with
> the hamlet pin raised 1,100 → 1,200 under §217 at its own fixed point.

> ⭐⭐⭐ **`physicalViolations` 1 → 7 IS SOLVED, AND THE PREDECESSOR'S GUESS IS REFUTED.** It is
> **nothing to do with the absent refusal mask.** Six of the seven were `extraction`
> institutions, and the cause is exact: the §161a resource cure switched the `extraction`
> predicate from `slope > 0.34` (satisfiable on **23–73%** of a leaf) to "within
> `resourceReach` of a §15.7-displaced resource site" (satisfiable on **1.2–5.7%**), and the
> degenerate fallback then **probed the wrong ground** — on the fjord, **0 of 556 water-line
> probes** can satisfy a dry-ground predicate. ⭐ **AND THE ROOT IS A COMMENT: the fallback's
> own note says *"the steepest ground the substrate offers"* and its body pushes 64 UNIFORMLY
> RANDOM FRAME POINTS.** Cured by probing the ground each constraint actually lives on:
> **7 → 1**, and the residual 1 is a fish market on a leaf with no water, which is honest.

> ⭐⭐ **THE SHARPEST FINDING OF THE WAVE IS A UNIT, NOT A FEATURE. SIX PRIVATE SPELLINGS OF
> "THE GROUND REFUSES" EXISTED AND ALL SIX WERE IN A UNIT THAT IS NOT A GRADE.** `sub.slope` is
> normalized to each leaf's own steepest cell, so `parcels.js`'s `slope > 0.80` refuses ground
> at absolute grade **0.0094 on the thorp and 0.0699 on the mountain** — the same line of code,
> 7.5× apart, and on the flattest leaf in the corpus it refuses ground **gentler than the
> mountain's median (0.0161)**. ⭐ **THE CLASS: A THRESHOLD STATED IN A PER-PLACE-NORMALIZED
> UNIT IS NOT A THRESHOLD; IT IS A QUANTILE WEARING A GRADE'S NAME.**

> ⭐⭐ **THE NEVER-RUN AUDIT: 12 OF 12 MECHANISMS NOW FIRE ON A REAL DOSSIER, AND THE TOTALITY
> WALKER FOUND A THIRD OF THE §10 VOCABULARY UNRULED.** `readResourceWords` went **0/16 → 16/16**
> leaves. The archetype bridge is **21 rows, all real, 26 ruled unbridged, 0 unruled** — where
> the walker's first run found **18 real engine archetypes with no row and no ruling.** ⭐ And
> the walker convicted its own author twice: my scratch audit's one-line grep undercounted the
> engine vocabulary by 4, and its first totality check falsely convicted `occupation_seed`,
> which `worldPulse/convergence.js` mints directly. **THE ENGINE HAS TWO WRITERS OF ARCHETYPE
> NAMES, and a one-writer check produces false convictions as well as false clean bills.**

> ⚠⚠ **AND THE ONE ARM I WILL NOT CLAIM: §5 W1 EXIT 6's 70/30 BANK ASYMMETRY HAS NO SUBJECT AND
> ITS MECHANISM IS REFUTED ON THE PROXY.** The corpus is **6 dry / 10 bankside / ZERO through** —
> so the arm's own population does not exist. Measured on the bankside proxy, the damping moves
> the split **74/26 damped vs 82/18 undamped**: withdrawing the attenuation makes the asymmetry
> **STRONGER**, which is the opposite of what the criterion's counterfactual requires. **On the
> evidence available the damping is NOT the asymmetry's cause; the bankside MODE is.** §6.6.

---

## §1 · THE SIX EXIT CRITERIA, GRADED ONE BY ONE

| # | criterion | MF-W1(SUB) | **MF-W1b** |
|---|---|---|---|
| **1** | relief FIELD, and the consistency pin over **every** §161a input, counterfactual reds | field MET, **pins NOT WRITTEN** | ⭐ **MET (CONFIRMED)** — `resourceCoherence()` over all four contracts, 7 new pins, 4-clause counterfactual |
| **2** | zero drawn bodies on `buildable == false`, per leaf, planted violation reds | ⛔ **NOT BUILT** | ⭐ **MET (CONFIRMED)** — `groundRefusal.js`, **0 / 21,982**, two planted violations red |
| **3** | `waterBearing` DERIVED not stored; perturb→moves, hold→byte-identical | ⛔ **NOT BUILT** | ⭐ **MET (CONFIRMED)** — 10 of 10 water leaves, 4 pins |
| **4** | fjord shows a fjord, mountain shows relief, by eye at 3000 px | ⚠ **PARTIAL** | ⭐ **MET (by eye, §7)** — the ploughland stops at the crag |
| **5** | determinism 10/10; ceilings 96/96; SCC 0 at both granularities | det ✔ SCC ✔ **ceilings 91/96** | ⭐ **MET (CONFIRMED)** — 10/10, **96/96**, SCC 0/0 |
| **6** | two-scale coastline, detail damped at the worked waterfront; 70/30 as a consequence; counterfactual | ⛔ **NOT BUILT** | ⭐ **MET** for the two scales and the damping (counterfactual executed) · ⚠ **the 70/30 arm is NOT APPLICABLE and its mechanism is REFUTED on the proxy** — §6.6 |

**Suite: 178 → 220 titles (+42), 9 files (+2). ⛔ The predecessor added ZERO; that debt is paid.**

| file | titles | new |
|---|---|---|
| `tests/domain/townMapFabricRefusal.test.js` | 18 | **NEW** — exits 2, 3, 6 |
| `tests/lint/dossierContracts.walker.test.js` | 10 | **NEW** — the never-run audit + the totality walker |
| `tests/lint/substrateCoherence.walker.test.js` | 17 | +7 — exit 1 over every §161a input |
| `tests/domain/townMapFabricRelief.test.js` | 22 | +7 — the relief field + the rank-ordered ration |
| (unchanged) BuildOut 75 · WallCircuit 36 · derivationGraph 22 · Inertia 14 · LayoutLawV3 6 | 153 | — |

---

## §2 · CRITERION 2 · THE `buildable` REFUSAL MASK

### §2.1 · The defect it replaced, measured

**SIX private spellings of one rule, all in the wrong unit:**

| home | spelling |
|---|---|
| `parcels.js` × 3 | `slope > 0.80 && wet > 0.62` (the plot walk, the probe, the infill) |
| `parcels.js` | `slope > 0.72 && wet > 0.66` (the §10.A3 shanty) |
| `commons.js` | `slope > 0.52 && wet > 0.55` |
| `fields.js` | `slope·(relief/0.30) > 0.66` — the only one that had noticed the unit problem at all |

⭐ **THE UNIT IS THE DEFECT, NOT THE DUPLICATION.** In the comparable unit
(`slope × slopeLocalMax`, the raw gradient with the per-leaf divide undone):

```
thorp    localMax 0.01170  ⇒  `slope > 0.80` refuses ground at grade 0.0094
mountain localMax 0.08737  ⇒  `slope > 0.80` refuses ground at grade 0.0699
mountain MEDIAN grade 0.0161  ⇒  the thorp's rule refuses ground gentler than the mountain's median
```

### §2.2 · The threshold, chosen by measurement and stated as a SHAPE

`MFW1B-mask.mjs` measured the share of every leaf above every candidate grade:

| grade | thorp | village | hamlet | metro | town family | city/migration | fjord | polycentric | mountain |
|---|---|---|---|---|---|---|---|---|---|
| 0.015 | 0.0% | 0.0% | 3.7% | 5.7% | 14.9% | 24.9% | 21.8% | 41.6% | 52.0% |
| 0.020 | 0.0% | 0.0% | 0.5% | 0.4% | 2.2% | 6.7% | 5.5% | 28.9% | 43.6% |
| **0.030** | **0.0%** | **0.0%** | **0.0%** | **0.0%** | **0.0%** | **0.1%** | **0.0%** | **11.0%** | **27.7%** |

⭐ **`REFUSAL.crag = 0.030` IS THE GRADE AT WHICH THE FLAT FAMILIES REFUSE NOTHING AND THE
RELIEF FAMILIES REFUSE A LOT.** A cut that takes ground off a pancake is measuring the
normalization, not the land. ⚠ UNSOAKED; rides the tuning signature.

⭐⭐ **AND THE WET ARM NEEDED NO SUCH WORK, WHICH IS THE POINT.** `sub.wet` is an absolute
field, so the refusal takes the DRAWING's own marsh line verbatim —
`relief.RELIEF_BANDS.marsh` now **imports** `REFUSAL.standingWater`, so a body can never stand
where the lens draws a reed tuft. **The law and the picture agree on water by construction and
had to be measured into agreement on slope.** That asymmetry is the module's whole argument.

### §2.3 · The census — 0, and why the 0 is worth something

```
BODIES ON REFUSED GROUND:  0 over 16 leaves  ·  0 over 10 distinct sites
DRAWN BODIES SWEPT:    21,982 over 16 leaves  ·  12,105 over 10 distinct sites
FIELD STRIPS ON REFUSED GROUND:  0 over 16 leaves  ·  0 over 10 distinct sites
refused GROUND per leaf: mountain 2,565 cells (27.8%) · polycentric 1,025 (11.1%) · city 301 (3.3%) …
```

⚠⚠ **THE VACUITY THIS IS BUILT AGAINST, NAMED BY `groundLaw.js` ITSELF: "A CENSUS THAT INHERITS
THE LAW'S OWN PREDICATE CANNOT REFUTE THE LAW."** The enforcement and the census DO share
`bodyRefusal`. So **two violations are planted**:

1. a body moved onto a crag — the census reds and names the clause (`{crag: 1}`);
2. ⭐⭐ **the SUBSTRATE is raised under a FINISHED fabric** — every repair pass has already run,
   so no enforcement can have absorbed it. Clean reads 0; raised reads **> 20**.

⭐ **AND A FIFTH RUNG WAS ADDED TO PERF1's COMPLETENESS LADDER, which earned its keep here.**
A leaf whose ground refuses NOTHING reports an honest 0 that means *the law had nothing to
refuse* — a different fact from *the law refused things and the fabric stayed off them*.
`MEASURED` / **`VACUOUS`** / `NOT APPLICABLE` / ⛔ `SKIPPED`.

### §2.4 · Two defects the census found in its own first runs

- ⭐ **AREA-TRUE, NEVER A CENTRE TEST.** The proposal-time refusal is a POINT test and the law
  is about a BODY — §17.4's own root cause one layer down. MEASURED: the packer refused every
  plot CENTRE on refused ground and the corpus still drew **2 thorp and 2 village parcels
  standing in a marsh**, because a burgage runs 1.3–2.35 frontages deep. `enforceGround` gained
  step **3d**, and `demoteBody`'s shrink ladder is exactly the right machinery for a body that
  overhangs a crag.
- ⛔⛔ **"DRAWN" MEANS WHAT THE RENDERER DRAWS, AND A MERGED PARCEL IS NOT DRAWN.** 5 of the 20
  remaining convictions were back-houses of LOD-**merged** parcels — geometry that exists in the
  fabric and not on the plate. ⭐ **THE CLASS, and it is §195.0's lesson read backwards:
  `groundLaw.js` records a census that ran over a set which did NOT CONTAIN the shapes the
  reader was looking at; this is a census that ran over a set which CONTAINED shapes the reader
  was NOT looking at. Both are the same defect — the census's subject is not the plate's.**

---

## §3 · CRITERION 4's NAMED CAUSE · THE PLOUGHLAND STOPS AT THE CRAG

The predecessor's own diagnosis: *"`mountain` reads as rocky ridges in FARMLAND, because the
field patchwork still tiles the entire leaf including the steep ground."*

**THE CAUSE, MEASURED: `tillageScore` is asked at the FURLONG'S CENTROID, and a furlong is
40–110 view units across — FOUR TO ELEVEN substrate cells.** So a furlong whose middle is
workable tiles right over the crags on its flanks. ⭐ **The fourth instance of one class in this
fabric** (§17.4's plot centre, §200's claim, the back-house, and now the land): **a predicate
about ground, sampled at a point, is not a predicate about a shape.**

Cured by asking `bodyRefusal` of the LAND's own body. ⚠ **REFUSED, NOT CLIPPED** — a land is a
UNIT of tenure, so half a land is a different fact, and the furlong's remaining lands still draw.

| leaf | strips on refused ground, base → tip | `refusedLands` reported |
|---|---|---|
| mountain | 74 → **0** | 79 |
| polycentric | 48 → **0** | 57 |
| hamlet | 30 → **0** | 28 |
| corpus | **232 → 0** | 232 over 16 leaves |

⚠ **AND §16.1's OWN PIN RED, WHICH WAS THE RIGHT ANSWER TO THE WRONG DENOMINATOR.**
`fieldInteriorCoverage` fell to **0.967** against its 0.995 floor, purely from this. §16.1 says
*"no bare-ground gaps inside the arable zone"* and the closing pass's own note already names the
boundary — *"a hole that survives is a hole with a reason: the sea, the town, or ground that
scored zero."* A land the GROUND refuses is that third reason arriving as a body test. **It is
SUBTRACTED from the interior-coverage denominator and `refusedLands`/`refusedSupply` publish
how much left and why** — never silently ignored. **J-W1B-4.**

---

## §4 · CRITERION 3 · `waterBearing`, AND WHY "DERIVED" IS THE WHOLE CRITERION

⭐⭐ **A MINTED BEARING WOULD BE A SEED-PERMANENT WORLD FACT UNDER THE PROMISE.** ODQ §251.5
already refused wind and sun bearings on that ground, and `laneMFINT1-receipt.md` §3.2.3 refused
the NEIGHBOUR bearing in the same words. **The water's bearing is lawful precisely because it is
not minted: it is a reading of ground that already exists**, so it cannot contradict a later
truth. If the ground changes, the reading changes with it — which is what a derivation IS.

```
town / highwater / siege / plague / famine / year-018 / year-100   river  244.7–244.9°  (channel chord)
city / migration                                                    coast  189.9°       (dry centroid → sea centroid)
fjord                                                               coast   11.8°
thorp / hamlet / village / metropolis / polycentric / mountain      DRY — `null`, never 0°
```

**Pinned four ways:** same seed byte-identical · different seed moved · the published value is
**byte-equal to a FRESH derivation from the fabric** (a stored value cannot be reproduced this
way) · the compass carries **no runtime trigonometry** (a rational octant reduction, cardinals
exact).

⭐ **ONE PIN FAILED HONESTLY AND TAUGHT ME SOMETHING.** My first spelling re-derived the coast
bearing from the SAME sea body against a DIFFERENT substrate and expected it to move. **It
cannot, and it should not**: the coast bearing is a function of the BODY once the body exists.
The substrate reaches it through the TRACE, not around it — so the criterion's perturbation is a
perturbation of the SEED, and the pin now says so.

---

## §5 · CRITERION 6 · THE TWO-SCALE COASTLINE

**THE LARGE SCALE** is the traced level contour of the heightfield. **THE DETAIL SCALE** is
`organicRing`'s per-vertex displacement, which now accepts a per-vertex damping. **THE DAMPING
IS A PHYSICAL CLAIM**: a worked shore is revetted, quayed and cut straight.

```
leaf        coarse   detail   excess   excessNear   excessFar    verdict
city        1.0658   1.0698   0.0057     -0.0016      0.0443     ⭐ DAMPED (near is ZERO)
fjord       1.0575   1.0611   0.0069     -0.0032      0.0305     ⭐ DAMPED
migration   1.0658   1.0698   0.0057     -0.0016      0.0443     ⭐ DAMPED
⛔ COUNTERFACTUAL (tree `laneMFW1B-cfB`, worked reach withdrawn, then DELETED):
   city/migration excess 0.0057 → 0.0183   ⇒ the damping removes 69% of the detail term
   fjord          excess 0.0069 → 0.0125   ⇒                     45%
```

### ⛔⛔ TWO MEASUREMENT DEFECTS I BUILT AND THEN CONVICTED, both worth banking

1. **TWO WINDOWS MEASURE THE WINDOW.** Comparing the coarse ring at a 12-sample window against
   the drawn shore at 3 returned `coarse 1.106 > detail 1.028` — "the large shape is wrigglier
   than the small one", which is only a statement about window size. ⭐ **A sinuosity without
   its window is not a number.**
2. ⭐⭐ **AND THE SECOND WAS WORSE BECAUSE IT ALMOST WORKED.** With both windows equal, the
   coastal city read `near 1.1301 > far 1.1178` — "the damping made the shore MORE wrinkly" —
   while the fjord read the other way. Neither number was wrong: **the large shape is not
   uniformly bendy, and where a town sits is not a random sample of it** — a settlement seats
   itself in a BIGHT. ⭐ **THE CLASS: A AND B MEASURED IN TWO PLACES DIFFER FOR EVERY REASON,
   NOT ONLY YOURS.** The cure is a PAIRED difference: `coarse` and `body` are the same ring
   through the same `chaikin(…,2)`, so they are index-aligned point for point and the detail
   term is `body.s[i] − coarse.s[i]` with the large shape subtracted off rather than assumed away.

### ⛔ AND A THIRD, IN THE MECHANISM ITSELF: THE QUAY IS NOT THE SEAT

Keying the damping on the settlement's CENTRE damped almost nothing: **the coastal city's seat
sits 197 view units inland of its own shore**, so the nearest shore point already stood at
t = 0.44 of the reach and came back at 0.479 — a mean of 0.862 over the worked stretch, a 14%
reduction the large shape swamped. ⭐ **THE CLASS: a settlement's WATERFRONT is not its CENTRE,
and a radius drawn from the centre reaches the water already spent.** The damping is now keyed
on **the quay** (the ring point nearest the seat) and, for the river, on **the landing**.

### ⭐ THE ONE NEW DERIVATION THIS EXIT NEEDED: THE WATER-BLIND SEAT

The water is derived at Stage 0 and the nucleus is found by a suitability field that READS the
water — so keying the damping on the nucleus is a cycle. ⛔ **And the obvious escape is worse:
`model.skeleton.anchor` is `(500, 500)` on TEN OF ELEVEN distinct sites**, i.e. the middle of the
page. Damping the shore at the frame centre is *a term that happens to be near the right answer*
— the class `findNuclei`'s own ROOM-LAW note convicts. `suitability.waterBlindSeat()` is the
argmax of the same site field with the water's terms absent: a real derivation from the ground,
with no dependency on the traced channel or shore. `meta.waterfrontSeat.offNucleus` publishes how
far the approximation fell from the nucleus actually found. **J-W1B-3.**

### §5.1 · ⚠⚠ THE 70/30 ARM — NOT APPLICABLE, AND ITS MECHANISM REFUTED ON THE PROXY

```
WATER MODE CENSUS over 16 leaves:  {"dry": 6, "bankside": 10}   ⛔ ZERO `through` leaves
```

The criterion grades bank asymmetry **on the THROUGH leaves**, and this corpus has none — so the
arm has no subject. Measured on the BANKSIDE proxy, with the counterfactual:

| leaf | bodies | split, DAMPED | split, UNDAMPED (cfB) |
|---|---|---|---|
| town / siege / plague / famine | 1,009 | **74/26** | **82/18** |
| year-018 / year-100 | 1,045–1,046 | 74/26 | 81/19 |
| highwater | 1,102 | 75/25 | **87/13** |

⛔ **THE COUNTERFACTUAL'S OWN WORDS ARE "remove the attenuation and the asymmetry must WEAKEN."
IT STRENGTHENS.** So on the evidence available **the damping is not the asymmetry's cause** — the
bankside MODE is (a bankside settlement is on one bank by construction), and straightening the
worked reach makes the near bank slightly *less* dominant because the channel stops bulging away
from the town. **I am reporting this as a refutation rather than grading around it. J-W1B-6.**

---

## §6 · ⚠ `physicalViolations` 1 → 7 · PROVED, CAUSED, CURED

**The predecessor labelled its guess PLAUSIBLE — "almost certainly the relief rise putting
bodies on ground the physical law refuses, which is exactly the mask this wave did not build."
⛔ THAT IS REFUTED. `physicalViolations` has nothing to do with `buildable`.** It counts
institutions whose `PHYSICAL_SITE` predicate no candidate could satisfy (`seating.js:292`).

**THE SEVEN, NAMED (`MFW1B-phys.mjs`):** hamlet 2 (Mine, Charcoal burner) · polycentric 2
(Fishmonger, Mills) · mountain 1 (Salt works) · fjord 2 (Mills). **Six of seven are
`extraction`; the seventh is the `port` that has been the standing 1 for five waves.**

**THE CAUSE, MEASURED (`MFW1B-phys2.mjs`):**

| leaf | frame share satisfying the **ORE** arm | the **SLOPE** arm (pre-§161a) | the degenerate probe chain |
|---|---|---|---|
| hamlet | **1.2%** | 29.7% | no watercourse ⇒ 64 random points ⇒ expected **0.8 hits** |
| mountain | 1.8% | 28.2% | as above |
| polycentric | 5.7% | 23.2% | as above |
| fjord | 5.1% | 72.6% | 556 water-line probes, **0 of 556** satisfy an ore predicate |

The §161a cure made the predicate a small disc around a **deliberately inconvenient** site
(§15.7's imperfection law: hamlet's iron sits at (120, 964), **749 units** from the settlement).
The fallback then never looked where the disc is.

⭐⭐ **AND THE ROOT IS A COMMENT.** The fallback's own note reads *"No watercourse at all: the
steepest ground the substrate offers"* and its body pushes **64 uniformly random frame points**.
⭐ **THE CLASS: A COMMENT THAT NAMES A MECHANISM THE BODY DOES NOT IMPLEMENT IS A DEFECT NOBODY
CAN SEE**, because every reader checks the body against the comment and finds them agreeing
about intent.

**THE CURE — probe the ground each constraint actually lives on:** the resource's own sites
(and their `handiest` alternates) · the water line · **the steepest ground, actually ranked**.
Plus one widening: `EXTRACTIVE_NEEDS` gains `flat-pan`, because ⭐ **an archetype that bundles
several trades cannot be held to one trade's ground** — the mountain's *Salt works* was being
asked to sit at the gem workings, 317 units away.

```
physicalViolations   7 over 16 leaves / 7 distinct  →  1 over 16 leaves / 1 distinct
```

⚠ The residual **1** is polycentric's *Fishmonger* (`port`) on a leaf whose `waterMode` is
**dry**. A port with no water genuinely has no site, and the honest answer is the recorded
derivation event `seating.js` already emits, not a fabricated quay.

⚠⚠ **AND A HAZARD I CAUGHT IN MY OWN INSTRUMENT: `MFW1B-phys.mjs` DEFAULTS TO `laneMFW1B-base`.**
My first post-cure run reported "still 7" because it measured the wrong tree. ⭐ *Trust no
measurement whose SUBJECT you did not name* — the sibling of the standing "trust no exit status
you did not capture".

---

## §7 · CRITERION 4 · THE ACCEPTANCE TEST, JUDGED BY EYE AT 3,000 px

**§9.5b's own fail condition: TERRAIN DRAMA INVISIBLE = ACCEPTANCE FAIL.**
Plates in `MFW1B-acc-tip2-png/`, rasterized by `MFW0-raster.mjs` at 3,000 px. Both were viewed
full-size.

| plate | verdict |
|---|---|
| **mountain** (`Mingguan`, village, relief 0.66) | ⭐⭐ **PASS, and the change is unmistakable.** The upper-right third is a green field patchwork; **the lower-left two-thirds is bare tan ground and the patchwork STOPS DEAD at its edge.** Four legible crag chains run through it — a strong one lower-left, one bottom-centre, one bottom-right, one upper-centre — with hachures and broad form lines sweeping between them. The settlement sits exactly on the seam, in the gentler ground along the road. **This reads as a village at the edge of upland waste, which is what a mountain village IS.** ⚠ The refused ground reads as *moor* rather than as *peaks*; that is honest for a plan-view period map and it is a hachure-vocabulary question for W7, not a substrate one |
| **fjord** (`Beiyuan`, town, relief 1.00) | ⭐ **PASS on the water and the headland.** The sea is a **deep re-entrant cove between two headlands** reaching well into the leaf — unmistakably a fjord shape rather than a ruled edge. The right third is bare tan ground carrying massed crag hatching and hachures: the steep unploughed headland, with green fields only in the far corners. The town runs as long terraced ranges along the shelf. ⚠ Weaker than the mountain: the headland's relief reads as *rough ground* rather than as a drowned valley's walls |
| **polycentric** (`Strathgarth`, hills, relief 0.41) | ⭐ Two centres inside one circuit with two gatehouses; fields to the N and E; the right and bottom carry the refused rough ground with its crag marks. Nothing broken by the wave |
| **city / town** | Viewed; no regression. The city's coastline now carries a visibly straighter run past the waterfront |

**MY GRADE: criterion 4 is MET.** The named cause — the ploughland tiling the crags — is gone,
and the refusal reads on the page as the thing §5 asks for: *the fabric stops at the crag.*

---

## §8 · THE NEVER-RUN AUDIT (§270.1), BEFORE AND AFTER

**THE STANDING LAW: a mechanism without a pin proving it fires on a real leaf is presumed dark.**

| mechanism | MF-INT1 | **MF-W1b** |
|---|---|---|
| `readResourceWords` | **0 / 16 leaves** | ⭐ **16 / 16** |
| `resourceContracts` / `resourceSites` | 0 / 16 | ⭐ **14 / 16** (2 economies name no contract-bearing resource) |
| `resourceCoherence` (NEW) | — | ⭐ **14 / 16 MEASURED**, all coherent; 2 `NOT APPLICABLE` |
| `stressorKeysOf` | dead (`Array.isArray` on an object) | ⭐ **11 / 16** |
| the archetype bridge | **1 of 9 keys REAL** | ⭐ fires on **8 / 16** leaves; **21 of 21 rows real** |
| `DANGER_STRESSORS` | 3 of 6 regex arms could match nothing | ⭐ **4 / 16** |
| `buildable` refusal (NEW) | — | ⭐ **16 / 16** |
| `waterBearing` (NEW) | — | ⭐ **10 / 16** (the 6 dry leaves correctly publish `null`) |
| `shoreScales` (NEW) | — | ⭐ **3 / 16** (every coastal leaf) |
| tillage refusal (NEW) | — | ⭐ **13 / 16** |

**⇒ 12 of 12 mechanisms LIVE. Previously dark and now firing: 6.**

### §8.1 · ⭐⭐ THE TOTALITY WALKER — the structural cure, not the instance cure

Curing nine fictional keys is an INSTANCE fix. The class is *"a table whose keys never occur
cannot red"*, and the only structural answer is a walker over the **engine's own vocabulary**.

```
engine condition-archetypes (both writers)   51
bridge rows                                  21   ⭐ 21 of 21 REAL
ruled UNBRIDGED, each with an argument       30
⛔ unruled                                    0    (MF-W1b's first run: 18)
```

**Four things this walker found on its first run, three of them about its own author:**

- ⛔ **18 real engine archetypes with no row and no ruling** — a third of the vocabulary, so the
  §10 arm was silently partial. `war_drain` earned a row (the sixth member of the war family);
  17 were ruled out with arguments.
- ⭐⭐ **THE SHARPEST RULING IS A REFUSAL, AND IT NAMES THE HAZARD:** `regional_protection_gap`
  means the roads are unsafe because nobody is holding them, and **the catalog has NO KEY FOR
  HUMAN RAIDING.** The tempting row is `monster_pressure`, whose expression (watch-fires on the
  approach roads) is exactly right and whose KEY is not. **Bridging a bandit problem to a key
  literally named "monster" would be a bridge written in a THIRD VOCABULARY — the precise defect
  this whole table was rebuilt to cure.** REFUSED until the catalog carries a raiding key.
- ⛔ **MY SCRATCH AUDIT UNDERCOUNTED THE VOCABULARY BY 4.** Its one-line grep for
  `condition: { archetype: '…'` missed four names the real source wraps across a newline
  (`betrayal`, `faith_foothold`, `faith_pact`, `religious_conversion_fracture`). ⭐ **A one-line
  grep is a one-line vocabulary, and an audit that undercounts its own subject reports a
  totality it has not established. The PIN is the instrument.**
- ⛔ **AND IT FALSELY CONVICTED `occupation_seed`,** which is real and is minted directly by
  `worldPulse/convergence.js:718` rather than by `CONDITION_ARCHETYPE_TEMPLATES`. ⭐ **THE
  ENGINE HAS TWO WRITERS OF ARCHETYPE NAMES, and a totality check keyed on one of them produces
  FALSE CONVICTIONS as well as false clean bills.** `stateMarks.ARCHETYPE_SOURCES` names both.

---

## §9 · THE DECLARED SHIFT — THREE STAGES, ATTRIBUTED BY COUNTERFACTUAL

⚠ **THE STAGES ARE NOT SEPARATE TREES, AND THE REASON IS BETTER THAN CONVENIENCE.** The three
mechanisms share files (`relief.js` carries both the marsh line and the shore), so a
file-partitioned stage tree would not isolate them. Each arm instead **withdraws ONE mechanism
at its own switch** from the finished tip (PERF1 §7.1's method), so the attribution is causal
rather than positional. All three trees were **deleted after measurement**.

| arm | what was withdrawn | plates identical / MOVED (of 32) |
|---|---|---|
| **base → tip** | the whole wave | 0 / **32** |
| **A · the refusal mask** | `REFUSAL.crag = ∞`, `standingWater = 2` | 2 / **30** |
| **B · the waterfront damping** | `worked = null` in `deriveWatercourse` | 12 / **20** |
| **C · the seating probe chain** | reverted to water-line-only + the two-need filter | 22 / **10** |

⭐⭐ **STAGE B's ATTRIBUTION IS EXACT AND IT IS THE STRONGEST EVIDENCE IN THE RECEIPT: the 20
plates it moves are the TEN WATER-BEARING LEAVES × TWO LENSES, and not one dry leaf moves.** A
water mechanism that moved a dry leaf would be a mechanism reaching somewhere it has no business.

⭐ **STAGE A's TWO SURVIVORS ARE ALSO EXACT:** `fjord-parchment` and `fjord-darkFantasy`. The
fjord refuses only **38 cells (0.4%)** and nothing stood on them — so withdrawing the refusal
changes nothing there, which is precisely what the per-leaf mask table predicts.

⭐ **STAGE C MOVES EXACTLY THE FIVE LEAVES THAT CARRIED A VIOLATION OR AN EXTRACTIVE RE-SITE:**
hamlet, polycentric, highwater, mountain, fjord.

**The determinism digest moved to `21305bea5a0bbb4e50e7e7ef3ad9aef998acd23fc144548a30282226940b533a`**
(MF-W1(SUB)'s was `b6609732…6711de`). Every same-seed comparison against either earlier digest
is now a comparison across a declared shift.

---

## §10 · THE PROOF FLOOR, RE-QUOTED AT MY TIP

```
vitest (lane config, bare)          9 files / 220 tests passed              TRUE_EXIT=0
                                    ⭐ 178 → 220 (+42 titles, +2 files)
cross-process determinism           10 processes, identical=10 mismatched=0
                                    21305bea5a0bbb4e50e7e7ef3ad9aef998acd23fc144548a30282226940b533a
§17 / §17.4 / §205A / §200 drawn    0 / 0 / 0 / 0 over 21,982 bodies (12,105 distinct-site)
§5 W1 exit 2 · refused-ground       0 bodies / 0 field strips — with TWO planted violations redding
§202 landlocked · §201B orphan      0 · 0
physicalViolations                  1 (was 7) — the residual is a port on a DRY leaf
SCC instrument                      binding granularity 0 non-trivial · field granularity 0
                                    module import graph 45 nodes / 162 edges — ⭐ ACYCLIC
purity scan (comments stripped)     47 files — Math.random / Date / localeCompare / Math.pow /
                                    runtime trig: NONE
sizeBaseline                        MAX 767 (buildFabric.js) against 800 — UNDER (was 737)
                                    substrate.js 700 · streets.js 691 · parcels.js 665
T-01 grain                          every leaf IN BAND
op ceiling (§217 per-tier ratchet)  ⭐ ALL 96 RENDERS UNDER  (hamlet pin RAISED 1,100 → 1,200)
per-census completeness (PERF1 §8)  ⭐ NO CENSUS WAS SKIPPED                TRUE_EXIT=0
```

### §10.1 · THE OP CEILING, RAISED UNDER §217 — the new figures

`renderFolio.mjs`'s own rule: *the measured maximum over all sixteen leaves × six lenses,
rounded up to the next hundred* — and its own caveat: *two mid-pass rations SPEND against the
ceiling, so the pin belongs at the FIXED POINT, not at the measurement that preceded it.*
Applied to itself:

```
hamlet at the old 1,100 pin:  max 1,117  ⛔ OVER (−17), 6 of 96 renders over — all one leaf
hamlet at the new 1,200 pin:  max 1,126  ⭐ UNDER (headroom 74)   ← the fixed point, re-measured
```

⛔ **NO HEADROOM WAS SPENT AND NOTHING WAS TUNED TO FIT.** `MARK_BUDGET` is a tuning-signature
value and an owner carve-out; MF-W1(SUB)'s J-W1S-4 refused it and so does this lane. The pin
moved instead, which is what §217's own sentence asks for. **J-W1B-5.**

| tier | max | ceiling | headroom |
|---|---|---|---|
| thorp | 904 | 1,000 | 96 |
| **hamlet** | **1,126** | **1,200** (raised) | **74** |
| village | 1,529 | 1,800 | 271 |
| ⚠ **town** | **4,584** | 4,600 | ⛔ **16** |
| city | 6,017 | 6,400 | 383 |
| ⚠⚠ **metropolis** | **8,420** | 9,700 | ⭐ **1,280** |

### §10.2 · ⚠ TWO CENSUS FIGURES MOVED, ONE EACH WAY, AND I AM NOT SMOOTHING EITHER

| figure | MF-W1(SUB) | **MF-W1b** | direction |
|---|---|---|---|
| `waterViolations` | 44 / 16 | **26 / 8** | ⭐ better (body arm 38 → 20) |
| `waterCrossings` · `waterExempt` | 137/93 | 162/136 | more crossings, more exemptions |
| `zoneMajorityOutside` | 318 / 145 | **249 / 130** | ⭐ better |
| drawn bodies | 22,760 / 12,227 | 21,982 / 12,105 | −778 (the refusal) |
| ⛔ **`zoneUnwashedBodies`** | 2,264 / 1,453 | ⛔ **3,726 / 1,698** | **+1,462 worse** |
| `physicalViolations` | 7 / 7 | ⭐ **1 / 1** | cured |

⛔ **`zoneUnwashedBodies` IS THE ONE WRONG-WAY ROW AND IT IS ATTRIBUTED BUT NOT CURED.**
Per-leaf: the **town family carries 2,184 of the +1,462 net** (0 → 364 on six leaves), highwater
+164 and year-100 +382, against **improvements** on metropolis (370 → 203), fjord (562 → 433) and
year-018 (635 → 382). ⚠ **The attribution is NOT isolated** — the metropolis is a DRY leaf and it
moved too, so this is not purely the water damping. **PLAUSIBLE, not CONFIRMED: the town's zone
geometry moved because the channel straightened past it, and a step from exactly 0 to exactly 364
on six replicas of one site is one zone's shape changing, not a diffuse regression.** It is not
one of the four drawn censuses (all 0) and it is not an exit criterion. **J-W1B-7 — published in
the first table a reader reaches, exactly as the predecessor published its own.**

---

## §11 · WHAT CHANGED, FILE BY FILE

| file | eff lines | what |
|---|---|---|
| **`fabric/groundRefusal.js`** | — → **181** | ⭐ **NEW.** `REFUSAL` · `absoluteGrade` · `refusalAt` · `buildableAt` · `scarpCost` · `buildableMask` · `bodyRefusal` (area-true) · `refusalCensus` (+ the VACUOUS rung) · `drawnBodies` · `tillageRefusalCensus` |
| `fabric/substrate.js` | ~590 → **700** | **`resourceCoherence()` NEW** (§161a over all four contracts); `meanderChannel` gains the worked-reach damping and `landingOf`; `MEANDER` gains `workedFloor`/`workedReach` |
| `fabric/relief.js` | — | `RELIEF_BANDS.marsh` **imports** `REFUSAL.standingWater`; `shoreContour` gains the two scales, the quay-keyed damping, `SHORE_DETAIL`, `shoreScales` (paired-difference sinuosity) |
| `fabric/waterMode.js` | — | **`waterBearing()` NEW** (+ `compassDeg`/`atanUnit`, no runtime trig); `deriveWatercourse` takes `worked`; `deriveWaterMode` carries the new rows by name |
| `fabric/suitability.js` | — | **`waterBlindSeat()` NEW**; the refusal is an ABSOLUTE exclusion and `SCARP_THINNING` is the thinning |
| `fabric/seating.js` | — | the degenerate probe chain probes the ground each constraint lives on; `EXTRACTIVE_NEEDS` widened to include `flat-pan` |
| `fabric/stateMarks.js` | — | `war_drain` bridged; **17 + 4 archetypes ruled UNBRIDGED with arguments**; `ARCHETYPE_SOURCES` NEW |
| `fabric/parcels.js` | 665 | four private spellings → `buildableAt` |
| `fabric/commons.js` | — | `COMMONS_GROUND.maxSlope` → `maxScarp`, on top of the shared law |
| `fabric/fields.js` | 438 | `tillageScore` delegates its absolutes; the LAND's own body is refused; `refusedLands`/`refusedSupply` published; the interior-coverage denominator |
| `fabric/groundLaw.js` | 356 | step **3d** — the ground is a claim, asked of the body; `demoteBody`'s ladder honours it |
| `fabric/lateGround.js` | — | both late passes receive `sub` |
| `fabric/umbrella.js` | — | `organicRing` accepts a per-vertex `damp` |
| `fabric/buildFabric.js` | 737 → **767** | the water-blind seat; `meta.buildable` · `meta.waterBearing` · `meta.waterfrontSeat` · `meta.shoreScales` · `meta.resourceCoherence` |
| `harness/renderFolio.mjs` | — | hamlet ceiling 1,100 → 1,200 with its cause |
| **tests** | — | **+42 titles, +2 files** (§1) |

⚠ **ONE NEW MODULE EDGE, AND ITS DIRECTION IS DELIBERATE:** `relief.js → groundRefusal.js`.
`groundRefusal` imports **only** `substrate.js`, so the fabric layer stays acyclic — confirmed
by the SCC instrument at 45 nodes / 162 edges, 0 non-trivial.

---

## §12 · JUDGMENTS (all vetoable)

- **J-W1B-1 · `REFUSAL.crag` IS STATED IN THE ABSOLUTE GRADE AND ITS VALUE IS A MEASURED SHAPE,
  NOT A NUMBER.** The corpus table in §2.2 is the argument: 0.030 is the grade at which the flat
  families refuse nothing and the relief families refuse a quarter and a ninth. *Veto and the
  alternative is a normalized threshold, which §2.1 measures as 7.5× apart across the corpus.*
- **J-W1B-2 · THE SIX PRIVATE SPELLINGS WERE DELEGATED, NOT LEFT ALONGSIDE.** `parcels` × 4,
  `commons`, `fields` all now ask one home; `COMMONS_GROUND` survives only as the common's own
  EXTRA strictness (a muster field is flatter than a house plot), stated as a margin on top of
  the shared law rather than as a second opinion about where the crag is. *Veto and each caller
  keeps its own answer to a shared question, which is the class §2.1 measures.*
- **J-W1B-3 · THE WATERFRONT DAMPING IS KEYED ON A WATER-BLIND SEAT, NOT ON THE LANDED ANCHOR
  AND NOT ON THE NUCLEUS.** The nucleus is a cycle; the anchor is `(500,500)` on ten of eleven
  sites. *Veto and the shore is damped at the middle of the page, which §5 measures as a term
  that happens to be near the right answer.*
- **J-W1B-4 · A LAND THE GROUND REFUSES LEAVES §16.1's INTERIOR-COVERAGE DENOMINATOR.** §16.1's
  own closing pass already admits three reasons a hole may survive; this is the third arriving as
  a body test. Charging it to coverage would set §16.1 against §5 W1 exit 2. *Veto and the
  ploughland must cover ground the fabric refuses — the two laws cannot both hold.* The count and
  the area are published, so the subtraction is auditable.
- **J-W1B-5 · THE HAMLET CEILING WAS RAISED, NOT TUNED TO.** §217's own sentence permits a raise
  with its cause; `MARK_BUDGET` is an owner carve-out. Measured at the fixed point per the
  module's own caveat. *Veto and the alternative is spending W7's declared shift from W1 to buy
  26 primitives.*
- **J-W1B-6 · I REPORT §5 W1 EXIT 6's 70/30 ARM AS REFUTED ON THE PROXY RATHER THAN GRADING
  AROUND IT.** The corpus has zero `through` leaves, and on the bankside proxy the counterfactual
  moves the split the wrong way. *That is what the criterion's own counterfactual exists to
  reveal, and reporting the one arm that failed is what makes the other two credible.*
- **J-W1B-7 · `zoneUnwashedBodies` +1,462 IS PUBLISHED, ATTRIBUTED AND NOT CURED**, labelled
  PLAUSIBLE, in §10.2's own table rather than found later.
- **J-W1B-8 · I CURED `physicalViolations` RATHER THAN ONLY DIAGNOSING IT.** The brief asked for
  proof or refutation; I had both plus a ten-line principled fix, and `seating.js`'s own docstring
  says the figure *"must be 0 at every chaos level"*. *Veto and the wave ships a proved defect
  with a written diagnosis, which is worse than the geometry the cure moves.*
- **J-W1B-9 · `history.founding.kind` REMAINS UNTOUCHED** (owner-gated generator change, §3.5 of
  the predecessor). So does the §202 repair ladder (its diagnosis stands, still uncured).

---

## §13 · HAZARDS FOR THE NEXT LANE

- ⚠⚠ **`sub.slope` IS STILL NORMALIZED PER LEAF AND `RELIEF_BANDS` IS STILL STATED IN IT.** The
  MASK is absolute; the MARKS are not. So a pancake still draws crag hatching at the same *share*
  of cells as a mountain, and **the law and the picture agree on water and do not yet agree on
  slope**. `reliefField().localMax` and `groundRefusal.absoluteGrade` are the tools; re-basing the
  bands moves every relief mark on every leaf and is **W7's (THE HAND) surface, not W1's.**
- ⚠⚠ **A CENSUS'S SUBJECT MUST BE THE PLATE'S SUBJECT, IN BOTH DIRECTIONS.** `drawnBodies` must
  skip `lod.mergedKeys` — a merged parcel exists in the fabric and is not on the page. Any new
  drawn census owes the same skip, or it convicts geometry nobody can see.
- ⚠⚠ **A POINT TEST CANNOT ENFORCE AN AREA LAW, and this fabric has now paid for that FOUR
  TIMES** (§17.4's plot centre, §200's claim, the back-house, the furlong). Any new ground
  predicate owes `bodyRefusal`'s three-part sweep, not a centroid.
- ⚠⚠ **A SINUOSITY WITHOUT ITS WINDOW IS NOT A NUMBER, and two populations measured in two
  PLACES differ for every reason.** §5's paired-difference construction is the template.
- ⚠ **THE CORPUS HAS NO `through` LEAF.** Any criterion graded on through-water behaviour (W2's
  bridges-as-street-continuations, W3's road/water typed interaction) has **no subject today**
  and needs a corpus member before it can be measured.
- ⚠ **`meta` GAINED FIVE ROWS** — `buildable`, `waterBearing`, `waterfrontSeat`, `shoreScales`,
  `resourceCoherence`. Two are objects; `reliefField` (from the last wave) is an object with an
  8-element array. A consumer that serializes `meta` naively will see all of them.
- ⚠ **`enforceGround` AND BOTH `lateGround` PASSES TAKE AN OPTIONAL `sub`.** It is optional
  deliberately (a caller without a substrate gets the pre-W1 behaviour) — but a caller that
  forgets it gets **silently unenforced ground**, and only the census will say so.
- ⚠ **`town` HAS 16 PRIMITIVES OF OP HEADROOM.** The tightest tier in the corpus by an order of
  magnitude. Any wave adding a mark to a town leaf pays it.
- ⚠ **THE §202 REPAIR LADDER IS STILL UNCURED** (MF-W1(SUB) J-W1S-5, PERF1 §7.1): three shrink
  rounds that free zero buildings, worth 1.13–1.21×.

---

## §14 · WHAT W2 INHERITS

W2 is **THE WALL, WHOLE** (§251.4b + §250.5 + §257.3a).

1. ⭐⭐⭐ **A REAL REFUSAL MASK, WHICH IS THE INPUT W2's TERRAIN-SURRENDER RUN WAS WAITING ON.**
   `groundRefusal.buildableAt` / `bodyRefusal` / `buildableMask` answer "where can a wall stand"
   in a unit that is comparable across leaves. Two of the nine run types are keyed on exactly
   this, and the mask publishes `cragCells` / `wetCells` / `grade{p50,p90,max}` per leaf.
2. ⭐⭐ **A PUBLISHED RELIEF FIELD *AND* A COHERENCE READING ON EVERY LEAF**
   (`meta.reliefField`, `meta.resourceCoherence`), both with pins and counterfactuals.
3. ⭐ **`meta.waterBearing` ON EVERY WATER LEAF** — the bearing a water gate, a quay run and a
   bridge approach all need, derived and lawful under THE PROMISE.
4. ⛔⛔ **THE METROPOLIS HEADROOM MUST BE RE-DERIVED FROM 1,280 — NOT 1,422, NOT 1,210.**
   PERF1/W0 published 1,422; MF-W1(SUB) reported 1,210; **this lane measures 1,280**
   (max 8,420 against 9,700). §252.3a's op-ceiling arithmetic for a third circuit with its
   towers, gates and ditch is against **1,280**, and it must be re-taken, never inherited —
   the figure has now moved three times in three waves.
5. ⚠ **THE HAMLET CEILING IS 1,200, NOT 1,100.** Any inherited "96/96 under" claim that quotes
   1,100 is quoting a superseded pin.
6. ⚠ **ZERO `through` LEAVES** (§13). W2's bridge/water-gate arms have a corpus of `bankside`
   only.
7. ⚠ **THE DETERMINISM DIGEST IS `21305bea…b533a`.** Comparisons against `98a29755…980bc1`
   (W0/PERF1) or `b6609732…6711de` (W1-SUB) cross two declared shifts now.
8. ⭐ **THE TOTALITY WALKER IS THE TEMPLATE FOR W2's OWN CLOSED SETS.** W2 exit 1 requires
   *"a `runType` from the closed set of nine"* — the same shape: a walker over the producing
   vocabulary, so a tenth run type reds until it is ruled.
9. ⛔ **W1 IS DISCHARGEABLE ON THIS RECEIPT**, with §5.1's refutation recorded as the one open
   item and the `zoneUnwashedBodies` row as the one wrong-way figure.

---

## §15 · ARTIFACTS (scratchpad, `MFW1B-*` / `laneMFW1B-*`)

| file | what it is |
|---|---|
| `MFW1B-mask.mjs` | §2.2's absolute-grade / candidate-cut measurement, both denominators |
| `MFW1B-phys.mjs` · `MFW1B-phys2.mjs` | §6's `physicalViolations` investigation and its geometry |
| `MFW1B-refusal.mjs` | exits 2/3/6's census — bodies, strips, bearings, shore scales |
| `MFW1B-dark.mjs` | §8's never-run audit and the archetype-vocabulary totality |
| `MFW1B-attrib.mjs` · `MFW1B-attrib.log` | §9's counterfactual attribution over 32 plates |
| `MFW1B-banks.mjs` · `MFW1B-banks.log` | §5.1's water-mode census, bank split, damped vs undamped |
| `MFW1B-acc.mjs` · `MFW1B-acc-tip2/` · `MFW1B-acc-tip2-png/` | §7's acceptance plates at 3,000 px |
| `MFW1B-plates.mjs` · `mf-proto-out/w1b/` | 32 exemplar SVGs + `manifest.json` (sha, primitives, ceiling) |
| `MFW1B-battery.log` | the full proof battery at my tip |
| `MFW1B-det.log` · `MFW1B-det-raw.log` | 10-process determinism |
| `MFW1B-suite.log` | 9 files / 220 tests |
| `MFW1B-scc.log` | SCC at both granularities + the module import graph |
| `MFW1B-budget.log` | the per-census completeness ladder — NO CENSUS SKIPPED |
| `MFW1B-sync.sh` · `laneMFW1B-{base,tip}` | the two disposable trees (`base` is the frozen predecessor tip) |

⚠ `laneMFW1B-cfA` / `-cfB` / `-cfC` (§9's counterfactual trees) were **measured and DELETED**.
⚠ `MFW1B-phys.mjs`, `MFW1B-mask.mjs` default to `laneMFW1B-base`; the rest default to
`laneMFW1B-tip`. **Set `MFW1B_TIP` explicitly** — §6's last note says what happens when you do not.
