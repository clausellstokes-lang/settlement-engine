# LANE TE-REG-I0 — THE LEGIBILITY INSTRUMENT SET · COMPLETE

**Charter:** `docs/DESIGN_REGISTER_PROGRAM.md` A2.1 item 3 (REG-I0, first car of the REG arc),
A2.2, §6, A1.3. **Mode:** SOLO, sandbox-only. No repo bytes, no ref moves, no gates, no memory
writes, no edits to the REG-0 workspace (read + execute only).
**Workspace:** `…/31585ce2…/scratchpad/reg-instruments/`
**Subject:** the sealed fabric at `ee0db96d3` (`…/scratchpad/reg0/w3f-tree`) and its renders.

## STATUS — EXIT MET

| Exit clause (A2.1 item 3) | State |
|---|---|
| All instruments run green on their own controls | **9 of 9 batteries LIVE** |
| Baselines at the sealed renders (city, village, +town) | `out/baselines.json`, 60.8 KB, 5 plates + 3 model leaves |
| Every figure carries its denominator | yes — `{instrument, value, denominator (in words), band, pass}` |
| The two censuses reported as integers | **A = 0 of 79 · B = 0 of 15,326** (corpus-wide) |
| Every instrument has a deliberately-failing control | yes — 4 broken plates + 6 fixture perturbations |
| Formulas minted | `INSTRUMENTS.md`, numerator + denominator named on all ten |

Determinism: `run-baselines.mjs` twice → **md5 `f70ec19746de94274d13af7da1365231` both times.**

## THE TWO ORDERED CENSUSES (§571.2)

Both **ZERO**, measured over the WHOLE exemplar corpus (18 leaves, 12 walled) — a new subject:
the shipped pins assert these laws on four synthetic fixtures, never on the corpus leaves the
renders are made from.

- **A · STRADDLE = 0** of **79 district regions** on 12 walled leaves. Pre-cure was 14 of 46.
  Instrument: the law's own `districtStraddlers(partition, node)` — band-aware, old-core rings
  excluded. Measured by geometry, never by reading the `wallSide` stamp the cure itself writes.
  Independent no-band cross-check reads **10 of 79** — all faubourg regions at minSide 1.05–2.14%,
  i.e. wall-BAND residue, an order of magnitude below the smallest real pre-cure straddler (4.7%).
- **B · OUTSIDE-CIRCUIT BODIES = 0** of **15,326 members** of a walled epoch (25,001 drawn bodies
  across all leaves; 6,083 lawfully in the suburb). Pre-cure was 1,331 of 19,563 (6.8%).
  Predicate lifted verbatim from the sealed §241.6 pin.
- **§240.1 hull containment = 0** vertices outside their own ring.

Census liveness (a zero is what a DEAD instrument returns): the PRE-CURE `growthUmbrella.partition`
reads 2/5 straddlers · a straddler planted on the circuit's claim line is +1 exactly · rings×0.95
strands 4 bodies · only-the-old-core-ring strands 791.

## FINDINGS

1. **The charter's squint polarity is REFUTED.** It expected BEFORE-city to fail and AFTER to
   pass. Measured, the sealed base PASSES all three squint arms. The base already separates its
   structural roles at 200px; what it fails is whether the fabric aggregates into blocks, which is
   instrument 6's question. The BEFORE-fails/AFTER-passes polarity DOES appear honestly on
   instruments 5 and 7, at floors derived from §9.7's own arithmetic.
2. **⭐ LANDMARK SALIENCE FAILS ON EVERY SEALED PLATE, AND DECOYS BEAT THE REAL ANCHORS.**
   BASE-town landmarks 0.574 vs matched decoys 1.035; SPEC-city 0.422 vs 0.809. The instrument is
   proven live by a `loud-landmark` positive control (2.085, all four masses pass, >2× its decoys).
   This is §571.4's third defect measured: importance is carried by tone and the tone is not
   detectable above fabric variation. **It is REG-3's target, quantified.**
3. **The sealed base's water is ACHROMATIC** — 64% of the water body is below saturation 0.06, and
   the fill is `#9ca4a3` (hue 172°, grey-green). REG-0's post-paint re-statement fixes it: the
   specimen reads dominant hue 195°, conformance 0.67. Confirms the §574 FTG-leg failure REG-0's
   own header describes, now measurable.
4. **BASE-town chunking FAILS: 2 legible wards of 6 regions** (band [5,9]). Four of the town's six
   district regions are below 5,000 sq units. City 6/8 PASS, village 2/2 PASS on its conditioned
   band [2,9].
5. **Three op classes are DRIFT** (traceable to none of the three references), each with a written
   justification: §12.3 walk-scale rings, §12.5 countryside event marks, §10 state expressions.
   All three are the engine's TRUTH layer becoming ink — the thing no fixed picture can supply.
   31 op classes total: 28 traced, 0 untraced misses. By reference: corpus 25, watabou 10, ftg 10.
6. **The village circuit never closes in ink** — a half-ring plus 12 wet cuts means no bridging
   radius (0→45 units tested) encloses anything, so "intramuros" must come from the model's
   `closedPolygon`, not from a flood of the drawing. Named in i6, with the flood kept as a
   fallback that says so.

## THE FOUR DEFECTS THE CONTROLS CAUGHT (full write-ups in INSTRUMENTS.md)

1. **Cohen's d could not see a flattened role**; **1 − OVL** scored 0.84 on a water body repainted
   green. Settled on **Glass's Δ** (denominator from the GROUND alone).
2. **Masks could not express a hole** — subpaths OR-ed instead of one winding rule. Water covered
   27% of the plate and 64% of "water" px were fabric showing through filled holes.
3. **Selectors at 1100² sampled against a 2200² raster** — every contrast pair read ≈1.01 on every
   plate, which looks exactly like a catastrophic finding.
4. **A saturation-weighted circular mean** returned 79° for a bimodal water population containing
   no 79° anywhere.

Three further breaks were the CONTROLS being wrong, not the instruments (sever disc leaving
snappable corners · a "wilderness" gate sited by eye onto a road · a straddler planted on a
bounding box rather than the claim line). All annotated at their sites.

## DELIBERATELY DEFERRED — documented, not a bug to re-find

- **`hue.canopy`** (i7 `DEFERRED_ARMS`): the ten-role classifier has no CANOPY role; section 4's
  batched trees fall into `detail`/`ground`. Cure: one branch in `lib/classify.mjs` keyed on the
  sealed `trees` colour. Owner: REG-5.
- The **register leg** (wash-σ, tone-IQR, lineweight, grain vs the 313-plate corpus) is not
  re-minted — it exists at `map-corpus/docs/`.
- **Gallery variety, interaction latency, zoom-level proofs** (A1.3) — chartered, not built here.

## CHAIR'S NUMBERS, ALL VETOABLE

squint Δ floor 1.0 (Cohen's "large effect") · chunking area floor 5,000 sq units and ceiling 9
(Miller) · landmark 1.0 each / 1.5 group · contrast wall:all 3.00 and water:ground 1.35
(street:ground 2.10 is §9.7's own arithmetic) · hue bands water 185–265°, field 35–70°, town
0–60°, SAT_FLOOR 0.06, GREY_MAX 0.50, conformance 0.60 · straddle cross-check tol 1% ·
i6 gate-bridge 18 units. Route-trace floor is DERIVED per leaf (`web.widths.blockLane`).

## FILES

`INSTRUMENTS.md` (the index, the four defects, the blind-silhouette protocol) ·
`i1`,`i2`,`i3`,`i4`,`i5`,`i6`,`i7`,`i8`,`i10` `.mjs` · `mk-controls.mjs` · `run-baselines.mjs` ·
`lib/{png,geom,svg,classify,morph,pixels}.mjs` · `out/baselines.json` · `out/i10-corpus.json` ·
`out/i{1,2,3,4,5,6,7,8,10}-controls.json` · `ctrl/CTRL-*.svg` · `png/CTRL-*.png`, `png/BASE-town.png` ·
`renders/base-town-town-parchment.svg`.
