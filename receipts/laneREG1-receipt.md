# lane TE-REG-1 — THE FRONTAGE-FUSION WAVE — RECEIPT

BASE: `067a7e1f3761f56e478770db12134696640e91fa` (refs/preserve/map-sandbox-regg1-cliffs)
WORKTREE: `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad/laneREG1-tree` (detached)
CHARTER: docs/DESIGN_REGISTER_PROGRAM.md §5 REG-1 row, L-REG-2/-9, A2.2 exit repairs.

---

## RESUME POINT 1 (t+~30) — CONTEXT ABSORBED, DESIGN SETTLED, NOTHING WRITTEN YET

Read in full: the charter (§0/§2/§5/A1/A2), the DETAIL REGISTER, INSTRUMENTS.md, i6-frontage.mjs,
the REG-0 receipt, buildFabric.js, parcels.js (the cut), renderFolio §11/§11a, the INK ladder.
Viewed plates hf320-spec-street-hierarchy and hf208-spec-roof-ticks myself.

### THE MECHANISM THE WAVE LANDS ON (found, not invented)

`parcels.decideGap()` ALREADY decides every plot boundary and returns `kind:'party'` for the
common case — and `PLOT_SHAPE.partyGap = 0.035` frontages is deliberately left *"only so the ink
of one does not merge with the ink of the next into a single mass."* **That comment is §571.4's
defect stated at its source.** The wave closes exactly that residual where the decision was
already `party`, and nowhere else.

Second find: the INK ladder already declares `block` (2.0×) and `party` (0.5×) rungs
(renderFolio `INK_SCALE`). REG-1 puts real geometry under both.

### THE DESIGN

1. **packOrganism** publishes, ARMED ONLY, a per-parcel `fuse` record `{runKey, seq, party,
   afterAlley}` plus a per-run frame `{runKey, ax,ay,ux,uy,vx,vy, dir, frontV}`. `runKey` is the
   existing `spanKey` (organism|row|col|rank|span), so a new span, a new rank and a new block all
   break a run by construction; `seq` is `plotIndex`, so a CULLED candidate breaks the run
   (seq gap); `afterAlley` breaks at a cross-alley.
2. **frontageFusion.js** (new fabric module) runs LATE in buildFabric — over `drawn.parcels`
   (post ground-law, post access-law, post LOD merge) so it can only fuse bodies the leaf
   actually draws. It projects each member's FINAL polygon into its run's (u,v) frame, requires
   rectilinearity + a single v-interval per u-strip (else the member breaks the run), and emits
   per fused group: the skyline `polygon`, the `frontEdge` segments, the `partyLines`, the
   member keys, the modal material/tone.
3. **renderFolio**: fused members' fills are replaced by the mass; the mass's own street edge
   carries the 2× weight (L-REG-9: on the mass, not floating); interior party lines at 0.5×;
   the standalone `INK.block` blockfront bar of §11a is NOT emitted when fusion is armed.

### JUDGMENT CALLS SO FAR (all vetoable, §580 trace)

- **J-REG1-1** — fusion is a LATE derivation over the drawn set, not a mutation of the cut.
  TRACE: composition-order law (buildFabric header) + §195.0 "a mark composed at render time is
  a mark no census can see"; the parcels themselves are untouched so the census/1:1 claim, the
  ground law and the access law all still see the same bodies. Watabou/FTG draw blocks as units
  (structure) and the corpus dresses them (hf320's block masses with interior division lines).
- **J-REG1-2** — the fused mass carries ONE fill (modal material, quantized mean tone); §10.A3's
  per-plot tone patchiness survives BETWEEN masses and on unfused singletons. TRACE: hf320's
  blocks are one tone subdivided by LINE, not by tint; the op saving funds later waves.
- **J-REG1-3** — a DERELICT plot breaks the run (a roofless shell must keep its dashed read).
- **J-REG1-4** — a WING plot FUSES (its street range is flush; the wing is a rear projection of
  the mass), a GABLE plot does not (the code's own comment: "the neighbours' rhythm breaks").

NEXT: write `frontageFusion.js`, arm the packer, wire buildFabric, then renderFolio.

---

## RESUME POINT 2 (t+~80) — BUILT AND DORMANT-CLEAN, AND THE EXIT'S FIRST LEG IS A FINDING

CHECKPOINT COMMIT `04e276485` on the detached lane tree.

### LANDED

`frontageFusion.js` (new) · `parcels.js` (fuse record + run frames, armed only) ·
`buildFabric.js` (stage 8 over the DRAWN set; publishes `fabric.fusion`, ABSENT unarmed) ·
`renderFolio.mjs` (masses replace member fills; the standalone blockfront bar is not emitted
when masses exist; its 2× weight re-homes onto the mass's own street edge; `INK_SCALE.party`
finally has geometry under it) · `exemplars.mjs` (`buildOne(spec, fabricOptions)` + `--fuse`).

**DORMANCY CONFIRMED (executed):** 28/28 SVG leaves and `manifest.json` byte-identical between
`base-out` (tip 067a7e1f3, pre-edit) and `off-out` (this tip, flag off).

**FUSION COUNTS (executed, `probeFusion.mjs`):** city 180 masses over 500 of 1,233 drawn plots
in 278 rank runs (2.78/mass, largest 7); town 158/436/892; metropolis 319/844/1,869;
village 18/50/103.

### ⛔⛔ THE FIRST EXIT LEG'S FLOOR IS A PROPERTY OF THE INSTRUMENT, NOT OF ANY DRAWING

Three executed receipts, in order:

1. **The specimen never achieved it either.** From the RECORDED baselines (`out/baselines.json`,
   not re-derived): `BASE-city.asDrawn.base` meanRun **11.17** / masses **620**;
   `SPEC-city.asDrawn.base` meanRun **11.21** / masses **613**. The specimen's own as-drawn gain
   over base is **+0.36 % / −1.1 %**. My tip at the same grid is **+0.4 % / −1.0 %** — the same
   magnitude, on the same instrument.
2. **Where +23.9 % / −41 % actually comes from.** `BASE-city.asDrawn.fused` is meanRun 13.88 /
   masses 362 — and `fused` is `close(built, 1.25u)`, a MORPHOLOGICAL CLOSE applied to the BASE
   plate's own mask. 11.17→13.88 is +24.3 %; 620→362 is −41.6 %. i6's own header states it:
   *"REG-0 measured exactly that: … runs 1709 → 1380 and meanRun 11.22 → 13.90"* — both figures
   from `masksFor(CITY)`, ONE plate. **The floor is the instrument's closing radius.**
3. **The close bridges gaps the charter forbids me to close.** At city (frontage 6.25) the close
   spans ≤ 2.5 u; the law's gap vocabulary is party 0.22 u, slot 1.00 u, packing-wedge 1.35 u,
   passage 2.63 u, fire-break 3.88 u. So the floor's −41 % is bought by fusing SLOTS and
   PACKING WEDGES — gaps `decideGap` gave a reason and the charter says must remain.

### ⚠⚠ AND THE INSTRUMENT CANNOT RESOLVE A PARTY GAP AT ITS OWN GRID — PROVED BY DIFFERENTIAL

At grid 1400 the cell is 0.714 u and the village party gap is 0.481 u, so the base's plots are
already fused BY RASTERISATION. Run as-is, only its own `--grid` knob moved (village leaf):

| grid | cell | base runs / meanRun / masses | fused runs / meanRun / masses |
|---|---|---|---|
| 1400 | 0.714 | 176 / 14.66 / 68 | 176 / 14.66 / 68 — **identical** |
| 2000 | 0.500 | 173 / 15.21 / 69 | 173 / 15.21 / 69 — **identical** |
| 2800 | 0.357 | 181 / 14.50 / 76 | **169 / 15.53 / 70** |

The delta appears exactly when the cell falls below the gap; the BASE's own figures move with
grid (masses 68 → 69 → 76) because rasterisation was fusing what the geometry had not.
⭐ THE CLASS, and it is instrument 1's own recorded class one turn out: **a mask metric cannot
see a defect finer than its cell, and a base that looks fused at grid N is a base measured at
grid N.**

### ⚠ AND F3 MOVES THE WRONG WAY BY CONSTRUCTION

`freestandingFraction` RISES (+0.0165 at city). F3's numerator is *bodies alone in their fused
component*, and a body is a drawn subpath — so replacing k members with ONE mass makes the mass
read as SOLITARY. F3 measures DRAW-level fusion (many bodies, one closed mask); it is blind to
GENERATION-level fusion (one body where there were many) and inverts on it.

NEXT: the resolved-grid table for every leaf, the full REG-I0 set (legs 2–4), the mutations.

---

# ⭐ FINAL STATE — COMPLETE. TIP `d1b32e339`

Two commits on the detached lane tree, both on top of `067a7e1f3`:
`04e276485` (the build, dormant-clean) · `d1b32e339` (the claim census, the law's epsilon, the
continuous street wall). ⛔ NOT SEALED BY THIS LANE — ref creation is outside the lane's grant;
the chair seals `d1b32e339`.

## §1 · FILE MANIFEST — every file touched, one line of why

| file | why |
|---|---|
| `src/domain/townMap/fabric/frontageFusion.js` **(new, 372 L)** | the wave: party-walled runs → one mass polygon + interior party segments + a marked street edge; plus `claimPenetration`, the law's own question asked of the new artifact |
| `src/domain/townMap/fabric/parcels.js` (+43 L) | publishes the per-plot `fuse` record (`runKey`/`seq`/`party`/`afterAlley`) and the per-run frame — the three facts only the cut knows. **ARMED ONLY**: unarmed it adds no key and returns the identical object |
| `src/domain/townMap/fabric/buildFabric.js` (+27 L) | ⛔ SINGLE-WRITER — three edits only: one import, `frontageFusion` threaded into the `packFabric` call, and stage 8 (the fuser over `drawn`) with `...(fusion ? { fusion } : {})` **appended at the END** of the published literal so no existing key's position moves |
| `harness/renderFolio.mjs` (+53 L) | masses replace member fills (the back-house of a fused member still draws); fused members' plot ticks give way to the mass's party lines at `INK.party`; **the standalone `INK.block` blockfront bar is not emitted when masses exist** and its 2× weight re-homes onto the mass's own street edge |
| `harness/exemplars.mjs` (+19 L) | `buildOne(spec, fabricOptions)` + a `--fuse` flag, so a lane can arm a dormant feature over the whole corpus without forking the driver. `{}` reproduces the sealed leaves byte for byte |
| `harness/laneREG1/probeFusion.mjs` **(new)** | the fabric-side counts per leaf |
| `harness/laneREG1/probeColumns.mjs` **(new)** | why a drawn body refuses to columnise, by cause |
| `harness/laneREG1/probeMut.mjs` **(new)** | the three convicting mutations |

⛔ **NO SHIPPED-SRC BYTES.** `src/domain/townMap/fabric/**` does not exist on `master`
(`git diff --stat master 067a7e1f3 -- src/domain/townMap/fabric` = 55 files, +29,303, all new) —
it is the map programme's sandbox, exactly as REG-G1's `cliffs.js` was.

## §2 · WHAT THE WAVE IS

`decideGap` **already** decides every plot boundary and returns `kind:'party'` for the common
case. `PLOT_SHAPE.partyGap = 0.035` frontages is then left between them, and its own comment says
why: *"The residual exists only so the ink of one does not merge with the ink of the next into a
single mass."* **That is §571.4's finding written at the line that causes it.** REG-1 closes that
residual where the decision was already `party`, and nowhere else.

The fusion is a LATE derivation over the **drawn** set (post ground-law, post access-law, post LOD
merge). The parcels are untouched, so the §5 census 1:1 claim, §17's ground law and every
drawn-body census still see exactly the bodies they saw before.

**What breaks a run, each meaning something** (the charter's *"gaps remain only where they mean
something"*): a non-party boundary (passage · slot · fire-break · drainage-slit · packing-wedge —
`decideGap` gave each its reason) · a cull (detected as a break in `seq`, so a hole is never
bridged) · a cross-alley · a new span/rank/block/organism (carried in `runKey` itself) · a
derelict plot · a gable-end plot · a body §17 reshaped. Landmarks, compounds, the wall band,
water claims, commons and district bounds break a run **for free** — none of them is a parcel.

## §3 · FUSION COUNTS, ALL 18 LEAVES (`probeFusion.mjs`)

| leaf | tier | parcels | eligible | runs | masses | fused | cov % | per mass | max | partyLines | frontEdges |
|---|---|---|---|---|---|---|---|---|---|---|---|
| thorp | thorp | 4 | 4 | 3 | **0** | 0 | 0.0 | – | – | 0 | 0 |
| hamlet | hamlet | 43 | 43 | 20 | 6 | 13 | 30.2 | 2.17 | 3 | 7 | 6 |
| village | village | 103 | 103 | 40 | 18 | 50 | 48.5 | 2.78 | 5 | 32 | 33 |
| town | town | 1016 | 892 | 255 | 158 | 436 | 48.9 | 2.76 | 7 | 277 | 259 |
| town-2 | town | 941 | 821 | 193 | 143 | 405 | 49.3 | 2.83 | 7 | 262 | 215 |
| city | city | 1487 | 1233 | 278 | 180 | 500 | 40.6 | 2.78 | 7 | 320 | 288 |
| metropolis | metropolis | 2290 | 1869 | 380 | 319 | 844 | 45.2 | 2.65 | 7 | 525 | 492 |
| polycentric | town | 981 | 877 | 263 | 139 | 382 | 43.6 | 2.75 | 7 | 243 | 212 |
| highwater | town | 1087 | 983 | 230 | 167 | 489 | 49.7 | 2.93 | 7 | 322 | 275 |
| mountain | village | 73 | 73 | 19 | 13 | 34 | 46.6 | 2.62 | 3 | 21 | 21 |
| fjord | town | 1103 | 931 | 248 | 160 | 431 | 46.3 | 2.69 | 7 | 271 | 250 |
| siege/plague/famine | town | 1016 | 892 | 255 | 158 | 436 | 48.9 | 2.76 | 7 | 277 | 259 |
| migration | city | 1487 | 1233 | 278 | 180 | 500 | 40.6 | 2.78 | 7 | 320 | 288 |
| year-018 / year-100 | town | 1046 | 922 | 258 | 169 | 470 | 51.0 | 2.78 | 7 | 301 | 277 |
| crossing | town | 1079 | 943 | 265 | 165 | 472 | 50.1 | 2.86 | 7 | 307 | 261 |

**2,460 masses over 6,804 fused plots across the corpus.** The thorp reports its own null (4
plots, 3 runs, no run reached two party-walled holdings) rather than inventing one.

Where the other half goes, measured on city (955 join opportunities): 743 are `party` (77.8 %) →
628 after alley/adjacency → 435 after gable/derelict → **320 actual joins**, the last 115 lost to
bodies §17 reshaped. `probeColumns.mjs`: 78.3 % of city bodies columnise, 252 refused as
non-rectilinear (ground-law clips), 15 as too few points, **0** as multi-interval.

## §4 · EXIT LEG 1 — ⛔ THE STATED FLOOR IS A PROPERTY OF THE INSTRUMENT, NOT OF ANY DRAWING

Three executed receipts (see RESUME POINT 2 for the full working):

1. `BASE-city.asDrawn.base` = 11.17 / 620. `SPEC-city.asDrawn.base` = 11.21 / 613 — **the
   specimen's own as-drawn gain over base is +0.36 % / −1.1 %.** My tip is +0.4 % / −1.0 % at the
   same grid: the same magnitude, on the same instrument.
2. `+23.9 % / −41 %` is `BASE-city.asDrawn.base → BASE-city.asDrawn.fused` — `close(built, 1.25u)`
   applied to the **base plate's own mask**. i6's header says so in as many words.
3. That close spans ≤ 2.5 u, and the law's gap vocabulary at city is party 0.22 · slot 1.00 ·
   wedge 1.35 · passage 2.63 · fire-break 3.88. **Its −41 % is bought by fusing slots and packing
   wedges** — gaps the charter says must remain.

**And the instrument cannot resolve a party gap at its own grid.** At 1400 the cell is 0.714 u;
the city party gap is 0.219 u and the village's 0.481 u, so the base is already fused BY
RASTERISATION. Proved by moving only i6's own `--grid` (village): identical at 1400 and 2000
(176/14.66/68), and the delta appears at 2800 (base 181/14.50/76 → fused **169/15.53/70**) — the
moment the cell falls below the gap. The BASE's own figures move with grid, which is the tell.

**And F3 inverts.** `freestandingFraction` RISES (+0.0165 at city) because its numerator is
*bodies alone in their fused component* and a body is a drawn subpath — so replacing k members
with ONE mass makes the mass read as SOLITARY. F3 measures DRAW-level fusion (many bodies, one
closed mask) and is blind to GENERATION-level fusion (one body where there were many).

### 4a · THE FULL TABLE AT THE RECORDED GRID (1400), ALL 18 LEAVES

Reported for baseline continuity. `Δ` columns are tip vs base; `FLOOR` is the base plate's own
morphological-close figure, i.e. the number §4 shows no drawing reaches.

| leaf | meanRun base→on | Δ% | FLOOR | masses base→on | Δ% | FLOOR | runs base→on | ratio Δ |
|---|---|---|---|---|---|---|---|---|
| thorp | 22.41 → 22.41 | 0 | 22.41 | 4 → 4 | 0 | 4 | 21 → 21 | 0 |
| hamlet | 13.32 → 13.32 | 0 | 15.59 | 35 → 35 | 0 | 25 | 97 → 97 | 0 |
| village | 14.66 → 14.66 | 0 | 17.56 | 68 → 68 | 0 | 45 | 176 → 176 | 0 |
| town | 10.55 → 10.57 | +0.2 | 12.79 | 549 → 546 | −0.5 | 363 | 1533 → 1529 | 0 |
| town-2 | 12.28 → 12.32 | +0.3 | 16.41 | 424 → 422 | −0.5 | 212 | 938 → 935 | −0.0001 |
| **city** | 11.17 → 11.22 | +0.4 | 13.88 | 620 → 614 | −1.0 | 362 | 1758 → 1744 | −0.0021 |
| **metropolis** | 11.18 → 11.18 | 0 | 14.62 | 866 → 866 | 0 | 509 | 2184 → 2184 | 0 |
| polycentric | 10.04 → 10.10 | +0.6 | 11.40 | 542 → 536 | −1.1 | 416 | 1413 → 1404 | 0 |
| highwater | 12.11 → 12.11 | 0 | 15.99 | 543 → 543 | 0 | 291 | 1476 → 1476 | 0 |
| mountain | 17.04 → 17.04 | 0 | 23.49 | 37 → 37 | 0 | 11 | 118 → 118 | 0 |
| fjord | 10.97 → 10.97 | 0 | 12.98 | 555 → 555 | 0 | 392 | 1415 → 1415 | 0 |
| siege/plague/famine | 10.55 → 10.57 | +0.2 | 12.79 | 549 → 546 | −0.5 | 363 | 1533 → 1529 | 0 |
| **migration** | 11.17 → 11.22 | +0.4 | 13.88 | 620 → 614 | −1.0 | 362 | 1758 → 1744 | −0.0021 |
| year-018 / year-100 | 10.80 → 10.80 | 0 | 13.25 | 548 → 547 | −0.2 | 360 | 1500 → 1500 | 0 |
| crossing | 11.26 → 11.27 | +0.1 | 14.25 | 601 → 600 | −0.2 | 349 | 1498 → 1497 | 0 |

### 4b · THE FULL TABLE AT A GRID THAT RESOLVES THE LEAF'S OWN PARTY GAP

The same instrument, run as-is, with only its own documented `--grid` moved.
**THE RULE, RECORDED BEFORE MEASURING:** `partyGap = plotFrontage × 0.035` (the law's own value);
`N` = the smallest multiple of 200 with cell `1000/N ≤ partyGap`, capped at 6400. No row hit the
cap. A base still partly fused by rasterisation makes every Δ below a **lower bound**.

| leaf | gap u | N | cell | meanRun base→on | Δ% | masses base→on | Δ% | runs base→on |
|---|---|---|---|---|---|---|---|---|
| thorp | 0.910 | 1200 | 0.833 | 24.10 → 24.10 | 0 | 5 → 5 | 0 | 20 → 20 |
| hamlet | 0.477 | 2200 | 0.455 | 13.98 → 13.98 | 0 | 35 → 35 | 0 | 94 → 94 |
| village | 0.481 | 2200 | 0.455 | 15.05 → **15.59** | **+3.6** | 73 → **70** | **−4.1** | 174 → 168 |
| town | 0.173 | 5800 | 0.172 | 10.65 → 10.73 | +0.8 | 598 → 589 | −1.5 | 1574 → 1562 |
| town-2 | 0.242 | 4200 | 0.238 | 11.85 → 11.90 | +0.4 | 485 → 482 | −0.6 | 997 → 993 |
| **city** | 0.219 | 4600 | 0.217 | 10.32 → **10.71** | **+3.8** | 813 → **770** | **−5.3** | 1978 → 1899 |
| **metropolis** | 0.194 | 5200 | 0.192 | 9.66 → 9.77 | +1.1 | 1190 → 1174 | −1.3 | 2619 → 2589 |
| polycentric | 0.165 | 6200 | 0.161 | 9.82 → 9.94 | +1.2 | 626 → 613 | −2.1 | 1501 → 1483 |
| highwater | 0.186 | 5400 | 0.185 | 12.39 → 12.40 | +0.1 | 577 → 575 | −0.3 | 1496 → 1495 |
| mountain | 0.420 | 2400 | 0.417 | 18.15 → 18.15 | 0 | 37 → 37 | 0 | 113 → 113 |
| fjord | 0.169 | 6000 | 0.167 | 10.66 → 10.85 | +1.8 | 624 → 610 | −2.2 | 1502 → 1477 |
| siege/plague/famine | 0.173 | 5800 | 0.172 | 10.65 → 10.73 | +0.8 | 598 → 589 | −1.5 | 1574 → 1562 |
| **migration** | 0.219 | 4600 | 0.217 | 10.32 → **10.71** | **+3.8** | 813 → **770** | **−5.3** | 1978 → 1899 |
| year-018 / year-100 | 0.173 | 5800 | 0.172 | 10.85 → 10.90 | +0.5 | 601 → 594 | −1.2 | 1546 → 1539 |
| crossing | 0.185 | 5600 | 0.179 | 11.29 → 11.44 | +1.3 | 647 → 633 | −2.2 | 1556 → 1535 |

**VERDICT ON LEG 1: NOT MET AS WORDED, and the finding is that it is not meetable as worded** —
by this wave, by the specimen, or by any drawing that keeps its lawful gaps. The measured
generative gain on the city-class leaves is **+3.8 % mean run / −5.3 % fronting masses**, and it
matches the specimen's own draw-level gain in kind while beating it in magnitude.

## §5 · EXIT LEG 2 — NO REGRESSION ON THE OTHER INSTRUMENTS

⚠ EVERY FIGURE BELOW WAS RE-CAPTURED AT THE COMMITTED TIP `d1b32e339`, not at the checkpoint the
code first passed them on — the front-edge merge landed between the two runs, and an exit status
captured before the last edit is a status about different code.

**The censuses (i10, ALL 18 leaves, dormant vs ARMED): IDENTICAL and both ZERO.**
Straddle = **0 of 79** district regions on 12 walled leaves; cross-check (no band) 10 of 79
(the recorded baseline); outside-circuit bodies = **0 of 15,326** members; §240.1 hull vertices
outside own ring = 0.
⭐ POSITIVE CONTROL, because an identity proves nothing without one: the armed shim's `buildOne`
returns `fabric.fusion` with 180 masses on city and the lane tree's returns none — so the i10
identity is a real null result, not a shim that never armed.

**i2 route-trace (city / town / village, dormant vs armed): byte-identical numbers.** city
void=181,598 floor=3.87 gates=6, bottlenecks `16/1.0817 10/1.2718 10/1.1973 16/1.0815 10/2.4245
10.49/1.0627` — the same list on both sides. I2_PASS both.

**i3 chunking (ALL 18): identical — 8 of 18 leaves inside their tier-conditioned band**, the same
8, the same region counts.

**i8 no-drift trace: I8_PASS, identical to the sealed base** — traced=28, driftJustified=3,
UNTRACED MISSES=0, staleRows=0, watabou=10 ftg=10 corpus=25 DRIFT=3. My renderFolio edits added
no op class.

**The raster instruments (i1/i4/i5/i7, headless Chrome at 2200, base vs fused):**

| instrument | city | town | village | metropolis |
|---|---|---|---|---|
| **i1 squint.street** | 1.5706 → **1.7230 (+9.7 %)** | 1.4781 → **1.6353 (+10.6 %)** | 1.3087 → **1.3700 (+4.7 %)** | 1.0642 → **1.2116 (+13.9 %)** |
| i1 squint.wall | 2.2462 → 2.3181 (+3.2 %) | 2.2517 → 2.3016 (+2.2 %) | n/a | 1.4761 → 1.5417 (+4.4 %) |
| i1 squint.water | 4.6354 → 4.4706 (−3.6 %) | n/a | n/a | n/a |
| **i5 street:ground** | 1.8818 → **1.9506 (+3.7 %)** | 1.7529 → **1.8160 (+3.6 %)** | 1.9003 → 1.9159 (+0.8 %) | 1.7052 → **1.7934 (+5.2 %)** |
| i5 wall:all | 7.2925 → 7.4201 (+1.7 %) | 7.7536 → 7.8035 (+0.6 %) | n/a | 5.7671 → 5.8779 (+1.9 %) |
| i5 water:ground | 1.3168 → 1.2830 (−2.6 %) | 1.5164 → 1.4956 (−1.4 %) | n/a | n/a |
| i4 salience (group mean of 4) | 1.0047 → 1.0182 (+1.3 %) | 0.5738 → 0.5756 (+0.3 %) | 0.6302 → **0.5916 (−6.1 %)** | 1.7564 → 1.8237 (+3.8 %) |
| i7 hue (all arms) | unchanged to 4 dp | unchanged | unchanged | unchanged |

⭐ **`squint.street` is REG-1's OWN NAMED EXIT** (*"squint test passes at 200px"*) and it rises on
every leaf measured, by 4.7–13.9 %. It passed at base too, so this is an improvement rather than
a repair — the cure is a STROKE cure and the squint is the instrument that can see it.

⚠ **THE THREE ARMS THAT MOVE THE WRONG WAY, NAMED WITH THEIR FIGURES AND NOT BURIED.** No pass/
fail verdict changes anywhere in the set. (i) `i4` village group mean −6.1 % — the mass carries
ONE fill (J-REG1-2), so the fabric luminance population changes and Glass's Δ denominator with
it; village is where the fused share of a small population is largest. (ii) `i5 water:ground`
−2.6 % at city, −1.4 % at town: city's was ALREADY FAILING at base (1.3168 < 1.35) and town's
still passes. (iii) `i1 squint.water` −3.6 % at city, from 4.64 against a floor of 1.0.
All three are handed to REG-3/REG-6 to re-measure once the fills are theirs.

## §6 · EXIT LEG 3 — DORMANCY, BYTE-IDENTICAL

`base-out` (rendered at `067a7e1f3` BEFORE any edit) vs `off-out` (rendered at `d1b32e339`, flag
OFF): **29 of 29 files identical, 0 differing** — 18 parchment leaves + 10 lens variants +
`manifest.json`. Per-leaf sha256 (first 16, base = off on every row):

`thorp df2f3f5b4f705260` · `hamlet 0f7c965a0f9b55dd` · `village 8c027538172907d7` ·
`town 511f0c017d762128` · `town-2 31958855cda8e905` · `city 3449ace03d809add` ·
`metropolis 1ab8da8db714cb82` · `polycentric 51222421462fc6e7` · `highwater 808a948a7a0f479a` ·
`mountain 7229acb862d147f8` · `fjord 14ba476f349704de` · `siege aff31d387c7c9273` ·
`plague 856eed378d07129f` · `famine adefd9e20408ea67` · `migration b6123ea52608657b` ·
`year-018 2f0df5590579f573` · `year-100 0a86258ef57858e9` · `crossing 899c94460b6dd96e`

⭐ AND `city 3449ace03d809add` IS BYTE-IDENTICAL TO REG-0's OWN `base-city-city-parchment.svg`,
so this base reproduces the sealed `ee0db96d3` renders and the recorded baselines apply directly.

⚠ NO TEST SUITE WAS RUN: the sandbox tree carries no `node_modules` beyond `seedrandom` (the
standing lane hazard). It is not needed for this wave and the reason is a proof rather than an
excuse — every existing test builds the fabric unarmed, and the unarmed path is byte-identical
end to end on all 29 artifacts.

## §7 · EXIT LEG 4 — DETERMINISM

`on-out` vs `on-out2`, two full armed renders of the corpus: **29 of 29 identical, 0 differing.**

## §8 · EXIT LEG 5 — THE CONVICTING MUTATIONS (`probeMut.mjs`)

The shipped guard is `claimPenetration`: **a fused mass may stand in no claim** — street, water or
circuit — sampled at 0.5 u along every mass edge against the ground law's own claim set, at the
estate's own `PENETRATION_EPS`.

| case | masses | fused | penetrations | street | circuit | water | worst u |
|---|---|---|---|---|---|---|---|
| **LAW (shipped)** | 180 | 500 | **0** | 0 | 0 | 0 | 0 |
| M1 un-fuse one rank | 179 | 493 | 0 | 0 | 0 | 0 | 0 |
| M2 fuse across a street (`runKey` drops ROW) | 180 | 499 | **177** | 177 | 0 | 0 | 2.982 |
| M3 fuse across the band (`runKey` → organism) | 19 | 38 | **9,464** | 9,440 | **13** | 11 | 8.091 |

**M1's rendered arm, as a LADDER** (city, i6 run as-is at N=4600):

| | masses | runs | meanRun | fronting masses | ratio |
|---|---|---|---|---|---|
| LAW | 180 | 1899 | **10.71** | **770** | 0.5255 |
| un-fuse 1 run | 179 | 1899 | 10.71 | 770 | 0.5255 |
| un-fuse 20 runs | 160 | 1929 | 10.53 | 787 | 0.5252 |
| un-fuse 60 runs | 120 | 1933 | 10.51 | 789 | 0.5252 |
| **un-fuse ALL** | **0** | **1978** | **10.32** | **813** | 0.5277 |

Monotone, and the bottom rung returns the leaf **to the dormant base's own figures to the digit**.

⚠⚠ **ONE RANK IS BELOW A LEAF-WIDE METRIC'S RESOLUTION, AND SAYING SO IS THE POINT.** The first
spelling un-fused the largest single run — 7 of 1,233 drawn plots — and read `10.65 → 10.65`. That
is not the mutation failing to bite; it is a whole-leaf mean asked to resolve 0.6 % of its own
population, and reporting it as "no change" would have been a **false acquittal**. ⭐ THE CLASS:
*a mutation must be scaled to the resolution of the instrument that judges it.* The same single-
rank mutation on the VILLAGE, where one run is a much larger share, bites cleanly:
**15.59 → 15.41, masses 70 → 71.**

**LIVENESS, three leaves:** city 7/7 applicable and all ok · town 7/7 all ok · village 5/7
applicable and all ok — M2 changed no mass on that leaf (inert, not refuted) and M3's circuit arm
has no subject (the village is UNWALLED). ⭐ Applicability is REPORTED, never folded into BROKEN:
a control reading zero because its subject does not exist is not a failing control, and printing
it as one trains the reader to ignore reds.

**⭐ A FOURTH, UNCHARTERED CHECK THE EXIT DID NOT ASK FOR — zero standalone blockFront ops,
executed rather than asserted.** In the fused render the 2×-weight `stroke-linecap="square"` path
contains **exactly** the mass front edges and **none** of `blocks[].front`:
city 358 → 288 segments (= 288 mass front edges, 0 block fronts), town 258 → 259 (= 259, 0),
village 29 → 33 (= 33, 0). That is the charter's REG-1 third exit clause, measured.

## §9 · OP-COUNT DELTA PER TIER vs `OP_CEILING_BY_TIER`

**No tier is exceeded; no `§217` raise is proposed or needed; every leaf FALLS.**

| leaf | tier | ceiling | base | fused | Δ | headroom |
|---|---|---|---|---|---|---|
| thorp | thorp | 1000 | 904 | 903 | −1 | 97 |
| hamlet | hamlet | 1200 | 1126 | 1112 | −14 | 88 |
| village | village | 1800 | 1226 | 1198 | −28 | 602 |
| mountain | village | 1800 | 1529 | 1512 | −17 | 288 |
| town | town | 4600 | 4386 | 4169 | −217 | 431 |
| town-2 | town | 4600 | 4526 | 4392 | −134 | 208 |
| polycentric | town | 4600 | 4378 | 4146 | −232 | 454 |
| highwater | town | 4600 | 4451 | 4309 | −142 | 291 |
| fjord | town | 4600 | 4584 | 4329 | **−255** | 271 |
| siege | town | 4600 | 4396 | 4118 | −278 | 482 |
| plague | town | 4600 | 4393 | 4176 | −217 | 424 |
| famine | town | 4600 | 4392 | 4175 | −217 | 425 |
| year-018 | town | 4600 | 4340 | 4197 | −143 | 403 |
| year-100 | town | 4600 | 4388 | 4260 | −128 | 340 |
| crossing | town | 4600 | 4421 | 4282 | −139 | 318 |
| city | city | 6400 | 5799 | 5409 | **−390** | 991 |
| migration | city | 6400 | 5803 | 5413 | −390 | 987 |
| metropolis | metropolis | 9700 | 7985 | 7369 | **−616** | 2331 |

Per-tier mean Δ: thorp −1 · hamlet −14 · village −22.5 · town −190 · city −390 · metropolis −616.
**The corpus's tightest headroom improves from 16 ops (fjord) to 88 (hamlet).**

⚠⚠ AND THE FIRST SPELLING WAS +37…+67 ON THE TOWN TIER, WHICH LEFT FJORD AT **4,596/4,600 — FOUR
OPS**. Cause: `frontEdge` was emitted per u-STRIP, and the strips split wherever the BACK steps
(a rear wing) while the facades stay flush — so a continuous street wall was a chain of abutting
segments, each with a pair of `linecap="square"` overshoots at joints on a line whose entire
meaning is that it is CONTINUOUS. Merging on the FRONT extent alone took city 630 → 288 and made
every leaf negative. ⭐ THE CLASS: **when a mark's op count scales with a quantity the mark does
not depend on, the emission is wrong before it is expensive.**

## §10 · JUDGMENT CALLS — all vetoable, with the §580 trace

| # | call | trace |
|---|---|---|
| **J-REG1-1** | Fusion is a LATE derivation over the DRAWN set, not a mutation of the cut. | The composition-order law + §195.0 (*"a mark composed at render time is a mark no census can see"*). The parcels are untouched, so census/law/access see the same bodies. STRUCTURE from the leads (Watabou/FTG draw blocks as units), DRESS from the corpus (hf320's block masses with interior division lines), TRUTH invariant. |
| **J-REG1-2** | The fused mass carries ONE fill (modal material, mean-quantised tone); §10.A3's per-plot patchiness survives BETWEEN masses and on every unfused plot. | hf320 (viewed): its blocks are one tone subdivided by LINE, not by tint. **Named cost, measured:** i4 village group mean −6.1 %. Hand to REG-3/REG-6. |
| **J-REG1-3** | A DERELICT plot breaks the run. | A roofless shell must keep its own `fill:none` dashed read; hf379's unroofed rung is HATCHED, not filled, and giving it a mass fill would draw it as roofed. Costs city ~82 join opportunities. Conservative: it preserves a shipped truth expression rather than changing one that is not this wave's. |
| **J-REG1-4** | A WING plot fuses; a GABLE plot does not. | Not taste — geometry. The wing's street range is flush and full-width (the wing is a rear projection of the mass, which is what hf320's blocks show). The gable plot's building is inset `w×0.16` on BOTH sides, so its side walls do not reach the plot boundary and **it cannot share a wall**; fusing it would invent one. The packer's own comment (*"the neighbours' rhythm breaks"*) agrees, but the warrant is the inset. |
| **J-REG1-5** | The exit's leg-1 floor is reported as UNMEETABLE AS WORDED rather than quietly re-scoped, and the measurement that does answer the wave's question is supplied beside it (§4b), under a grid rule recorded before measuring. | §441 J7 (*a charter's CONFIRMED row is a hypothesis*) + A2.2's own discipline that exit figures are measured, not asserted. The chair rules; nothing here changes the exit. |
| **J-REG1-6** | The claim census borrows `reservedGround.PENETRATION_EPS` rather than minting a tolerance. | That module's header states the rule: *"a census stricter than the constraint it audits convicts every legal abutment."* Minting my own read 4,980 penetrations on the lawful leaf. |
| **J-REG1-7** | The model instruments are armed via a symlink shim tree (`armed-tree`) whose only real file is a `buildOne` that flips the default. | The instruments are preserved and must run AS-IS; they take `--wt` and call `buildOne(spec)` with one argument. Every other module resolves through a symlink to the lane tree's real file, so Node's realpath gives the SAME module instance — it is literally the same code with one default flipped. A positive control proves the shim arms. |

## §11 · DEFERRED, WITH REASONS (documented, not bugs to re-find)

1. **The i6 blind spot is NOT cured here.** F2 cannot see a sub-cell gap at its recorded grid and
   F3 inverts on generative fusion. Curing either means editing a preserved instrument, which is
   outside this lane's grant. **Chartered question for the chair:** does REG-I0 gain (a) a
   per-leaf grid rule tied to the leaf's own party gap, and (b) an F3 whose body population is
   *holdings* rather than *drawn subpaths*? Both are one-line changes to i6 and both are the
   chair's to sign.
2. **The three raster arms that moved the wrong way** (§5) — handed to REG-3/REG-6, which own the
   fills and the ink ladder.
3. **The derelict and gable exclusions** (J-REG1-3/-4) cost city ~193 join opportunities. Both are
   deliberate; a REG-3 wave that gives the unroofed rung its hatch could revisit the first.
4. **Coverage is 40–51 %, not higher, and that is what the law earns** — 77.8 % of city boundaries
   are `party`, and the ladder down to 320 joins is itemised in §3. Raising it means changing
   `decideGap`, which is tuning-signature territory and not this wave's.
5. **The taste gate is not this lane's to close.** Crops rendered and inspected
   (`crops/base-city.png` vs `crops/on2-city.png`, viewBox `680 710 110 110`, headless Chrome);
   the floating heavy bars are gone and the ranks read as block masses against bright street
   voids. The owner's CT-0 verdict stands outstanding.

## §12 · EXACT RE-RUN

```
T=.../scratchpad/laneREG1-tree                     # detached at d1b32e339
S=.../44d62321-.../scratchpad                      # this lane's working dir
A=$S/armed-tree                                    # the symlink shim (see J-REG1-7)

node $T/harness/exemplars.mjs $S/off-out           # dormant   — must equal base-out byte for byte
node $T/harness/exemplars.mjs $S/on-out  --fuse    # armed
node $T/harness/laneREG1/probeFusion.mjs           # from $T
node $T/harness/laneREG1/probeColumns.mjs          # from $T
node $T/harness/laneREG1/probeMut.mjs --leaf=city --grid=4600
node $S/runI6.mjs         $S/base-out $S/on-out $S/i6-table.json
node $S/runI6resolved.mjs $S/base-out $S/on-out $S/i6-resolved.json
node $S/runRaster.mjs
cd .../reg-instruments
node i10-censuses.mjs --wt=$T --leaves=ALL   ;  node i10-censuses.mjs --wt=$A --leaves=ALL
node i3-chunking.mjs  --wt=$T --leaves=ALL   ;  node i3-chunking.mjs  --wt=$A --leaves=ALL
node i2-route-trace.mjs --wt=$T --leaf=city  ;  node i2-route-trace.mjs --wt=$A --leaf=city
node i8-nodrift-trace.mjs --wt=$T
```
