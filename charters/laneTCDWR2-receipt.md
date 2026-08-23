STARTED 2026-08-23T21:12:08Z

## LANE TC-DW0-R2 — AMEND THE DWELLINGS CHARTER + ARCHITECTURE (ODQ §484)
Model mark: [OPUS-RUN · FABLE-VALIDATION OWED]. SOLO, lane cap TWO: no sub-agents, no Workflow.
Skills loaded: anthropic-skills:deep-work, anthropic-skills:judgment-ledger, anthropic-skills:structural-prevention (pending).

## RESUME POINT 1 — inputs read
- draft-DW-SKEPTIC-REPORT.md (44,281 B) READ WHOLE.
- draft-DWELLINGS-CHARTER.md parts READ WHOLE via DW0-merge/{head,sec-0..9,sec-sigma}.md (sum 164,528 + 11 separators = 164,539 B: matches).
- draft-DWELLINGS-ARCHITECTURE.md parts: pending.
- Assemblers confirmed: DW0-merge/assemble.sh (head + sec-0..9 + sec-sigma), DW0-arch-merge/assemble.sh (arch-head + arch-0..6).
- df -k / free: 17,695,416 KB (>= 3,000,000 OK).
RESUME1 2026-08-23T21:13:57Z

## RESUME POINT 2 — worktree up, probes 1-3 executed
- Worktree `$SP/laneTCDWR2-tree` detached at 00e7af612d428078634d52ea37054bd00b773ca6 (= claude/composite-r4, UNMOVED).
- `npm ci` NPMCI_EXIT=0; `ls node_modules | wc -l` = 468; df free 16,982,724 KB.
- Probe files written to the WORKTREE ROOT only (DWR2-occ.mjs, DWR2-pipe.mjs, DWR2-dup.mjs). Nothing under src/ docs/ tests/.
- PROBE 1 (fixture corpus V2_GOLDEN_CONFIGS, 20 rows, LIT): 132 wards / 528 ward edges / 1098 parcels / 2131 buildings.
  Occupancy over BUILDINGS_PER_PARCEL band: 123/598 (20.6%); max 7. IDENTICAL FOOTPRINTS: 0.
  Frontage outer edge: n=1098 min 25.1 p10 33.9 p25 38.8 median 44.0 p75 51.0 p90 56.0 max 74.0 mean 44.7 (reproduces the panel EXACTLY).
  Ward plan extent: spanX median 163 max 233; spanY median 154 max 235.
- PROBE 2 (48 real generateSettlementPipeline settlements, 6 tiers x 8 seeds, LIT): 32/48 (66.7%) THREW.
  thorp 7/8 hamlet 6/8 village 8/8 town 8/8 city 3/8 metropolis 0/8.
  29 of 32 = "N institution bindings exceed the <tier> cap of N"; 3 of 32 = TC-3 byte band at city.
  MECHANISM: MAXIMUM_INSTITUTION_BINDINGS {8,12,20,32,64,96} vs measured canonical-scene-building counts
  thorp 7..10 (med 9) / hamlet 10..18 (med 17) / village 33..39 (med 36) / town 52..59 (med 56) / city 39..50 (med 46) / metropolis 47..58 (med 53).
  The cap ladder RISES monotonically; the real curve PEAKS AT TOWN and falls. The two curves cross.
  Ward cap: never exceeded (districts 1..7 vs caps 8..48).
  Occupancy over band on survivors: 228/624 (36.5%), max 11.
- PROBE 3 (attribution): 183 duplicate-footprint groups, 369/2839 rows (13.0%).
  100% attributed: SAME parcel, SAME medial subcell, SAME shrink permille. Zero duplicate parcel polygons. Zero rounding collapse.
- A3 measurement: `townCartographyEnabled` is VIRTUAL, declared false at simulationRules.js:783, PRESENTATION-SIDE, and set true NOWHERE in src (grep exit 1). 8 test files compile LIT.
  `buildInteriorModel` has ONE consumer outside its own dir: src/components/interior/InteriorView.jsx:58 — UNGATED.
RESUME2 2026-08-23T21:23:35Z

## RESUME POINT 3 — probes 4-7 executed; A2 and A4 both SETTLED BY MEASUREMENT
- PROBE 4 (A2, merge tolerance, 1,056 adjacent same-edge triples over the fixture corpus):
  646/1056 (61.2%) NOT exactly collinear — the panel reproduced.
  BUT max perpendicular deviation of the middle cut from the chord = 0.7070 plan units, maxSquared 0.4999.
  The suite's own withinWard tolerance is distSq <= 1 (tests/domain/townCartographyParcels.test.js:169) and its comment states the
  sqrt(0.5) = 0.70711 lattice bound. Measured max lands on the theoretical bound to four decimals.
  Triples exceeding the suite's constant: 0/1056. Chord-triangle vertices passing withinWard: 3168/3168.
  Symmetric difference max 44.50 sq plan units = at most 1.403% of the merged parcel's own area (median 0.213%).
- PROBE 5 (the FAILING CONTROL, per ODQ 503's "a control that cannot fail proves nothing"):
  vertex-crossing pairs n=528, devSq min 291.30 / p50 1007.4 / max 3183.6 — 0/528 would pass distSq <= 1. The control bites.
  Merged triangles: 1056/1056 are 3-vertex (the polygon.length===3 pin at :265 stays green); medial-subcell pack failures 0/4224.
- PROBE 6/7 (A4). ⭐ THE PANEL'S MF-4 IS ITSELF REFUTED: a plan-unit-to-physical scale DOES exist.
  PLAN_UNIT_CM_BY_TIER at src/domain/townScene/compileTownSceneManifest.js:99-108 = {thorp 10, hamlet 14, village 20,
  town 30, city 50, metropolis 80} centimetres per plan unit. It ships as manifest.space.planUnitCm, is validated as a
  positive integer at manifestContract.js:216, is consumed by compileTownSceneGeometry.js and the 3D runtime, and is
  ALREADY READ INSIDE the cartography stage at cartographyBuildings.js:333.
  Under it, four candidate frontage measurables (pooled median ft / B3 spread / Pantin >=30ft admission):
    M1 parcel outer edge (today's DW-2a spec)   83.5 ft  88% GRAND        99%  <- vacuous, confirms the panel
    M2 half of it (the subcell street face)     41.8 ft  3/20/39/38       77%  <- available at ALLOCATION time
    M3 drawn building's longest edge            25.9 ft  1/37/31/26/5     31%  <- needs a drawn footprint
    M4 drawn building's street-facing edge      14.0 ft  18/56/14/7/0      7%  <- 5% below the SHOP floor
  Under M2 every one of B3's five buckets fires SOMEWHERE and the ladder maps onto TIER
  (thorp SHOP 50%/NARROW 50%; metropolis WIDE 23%/GRAND 77%).
  Settlement extent under the landed scale (median, m): 37/85/121/244/417/646 vs plausible 50-150/100-250/200-400/250-700/600-1200/1500-3000.
RESUME3 2026-08-23T21:29:25Z

## RESUME POINT 4 — every measurement in hand; editing begins
- MF-6 recounted INDEPENDENTLY: §2.2 holds 57 distinct new cell names (10 group rows, zero duplicates, zero collisions with the
  28 ROOM_KINDS); §2.3 holds 60 distinct new fixtures (zero duplicates, zero collisions with the 22 FURNISHING_KINDS).
- MF-7 CONFIRMED and it CHANGES THE ARITHMETIC: `ROOM_KINDS.dais` (interiorTemplates.js:42) has ZERO `room('dais'` producers
  (control `room('hall'` = 2); its four src hits are the two enum definitions plus two FURNISHING usages at :140 and :166).
  `'stall'` = 1 hit, the definition. So DW-1a retires TWO members, and 28 - 2 + 57 = 83 — the charter's headline 83 is RIGHT
  while BOTH figures under it (retire 1, add 56) were wrong. Fixtures: 22 + 60 = 82 (was 81); all 22 existing furnishings have a
  live producer (the five singletons pew/altar/counter/workbench/bunk each traced to a `room(...)` furnish list), so no fixture retires.
- Cross-reference sweep: 648 references checked mechanically (575 charter + 73 architecture) for EXISTENCE — 0 dangling.
  Semantic adjudication of all 24 band references found the 2 the panel named (charter L1403 §4.6 and L1682 §6.2 cite B12 for the
  acquisition/partition band; it is B9 — L2066 gets it right) and ONE the panel did not: arch-3's Pass-B stage labels
  [B1]..[B6] COLLIDE with the charter's band ids and are a SECOND name for the charter §4.5's own T1..T5.
- arch-1.5's "33 new files" recounted: the arch-1.1 tree holds 30 .js entries; with programMinimumTable.js replaced by
  index.js + 11 shelf files the true figure is 41 (the panel said 40, missing the index.js arch-1.2 itself names as a CREATE row).
- B4 measured LIVE, not latent: over 60 real pipeline settlements the emitted `economicState.prosperity` labels are
  Prosperous 22 / Moderate 15 / Comfortable 11 / Poor 9 / Struggling 3. `Moderate` — 25% of settlements — matches NO arm of
  interiorModel.js:83-86 and reaches the interior only through the fall-through default, landing on the same 0.5 as Comfortable.
  Canonical vocabulary is PROSPERITY_TIERS (7 rungs) at src/data/constants.js:50-52.
- PROBE 8, the CG-1 re-derivation basis (24 real pipeline settlements per tier, DARK compile so nothing throws) —
  canonical scene buildings min/p50/max vs MAXIMUM_INSTITUTION_BINDINGS:
    thorp 7/8/12 vs 8 (7/24 over) · hamlet 13/17/20 vs 12 (24/24) · village 30/34/39 vs 20 (24/24) ·
    town 48/55/61 vs 32 (24/24) · city 36/47/51 vs 64 (0/24) · metropolis 48/53/59 vs 96 (0/24).
  The cap ladder RISES monotonically; the measured curve PEAKS AT TOWN and FALLS at city. MAXIMUM_WARDS never bites (1..7 vs 8..48).
- Probe files in the worktree root, to be deleted before the final cmp:
  DWR2-occ.mjs DWR2-pipe.mjs DWR2-dup.mjs DWR2-merge.mjs DWR2-scale.mjs DWR2-band0.mjs DWR2-front2.mjs DWR2-prosp.mjs DWR2-cg1.mjs
RESUME4 2026-08-23T21:34:30Z

## FINAL

**Lane TC-DW0-R2 (ODQ §484 / §504.6), `[OPUS-RUN · FABLE-VALIDATION OWED]`. SOLO — no sub-agents, no Workflow.**

### Sizes and provenance
| Deliverable | Bytes | Lines | Was | Provenance |
|---|---|---|---|---|
| `draft-DWELLINGS-CHARTER.md` | **237,547** | 3,071 | 164,539 | 12 part files via `DW0-merge/assemble.sh` |
| `draft-DWELLINGS-ARCHITECTURE.md` | **141,659** | 2,165 | 103,566 | 8 part files via `DW0-arch-merge/assemble.sh` |
| `draft-DW-RATIFICATION-BRIEF.md` | **19,626** | 300 | (new) | authored; 3,249 words ≈ 5.4 pages, inside the 6-page cap |

**PROVENANCE PROVED, not asserted:** both documents were copied aside, both assemblers re-run, and both
outputs `cmp`-IDENTICAL to the copies. The deliverables are exactly what the assemblers emit; no byte was
hand-edited after assembly.

### C0
**C0 = 0** on all three deliverables (scanned in python for any char < 0x20 other than LF/TAB, plus DEL).
**Emoji = 0** on all three (ranges U+1F300–U+1FAFF and U+2700–U+27BF). The ⛔/⭐/⚠ marks are the estate's
existing convention, present in the pre-amendment drafts.

### Disposition counts
- **10 of 10 MUST-FIX dispositioned — all FIXED.** MF-4 is fixed *after being refuted*: the panel's claim
  that no plan-unit-to-physical scale exists is false, and the band was repaired on the true cause instead.
- **4 OVERSTATED and 2 UNDERSTATED dispositioned** (2 + 2 explicitly labelled in the report, plus 2 further
  passages it treats as overstatements without the label).
- **5 preference-bands acted on** (B1, B8, B9, B13, B14); B15 confirmed already honest and left standing.
- **AMENDMENT RECORD: 13 rows in the charter (§Σ), 10 in the architecture (arch-6)**, each naming its change,
  its panel finding and its evidence.
- **Ledger deltas:** home table 28 → **31 rows** (15 CONFIRMED / 6 CORRECTED / 8 REFUTED / 1 PARTIAL / 1 SPLIT);
  judgments 10 → **12** (J11 the CG train, J12 the frontage measurable; J3, J5 and J10 rewritten);
  deferrals 8 → **11** (D-9 the B9 balance, D-10 the absolute settlement size, D-11 the count inversion);
  chair decisions 5 → **6** (C6 new, C5 discharged); bands 19 → **20 rows** with BAND ZERO first.
- **Cross-references:** 648 swept in the pre-amendment pair (2 semantic errors, both the B12→B9 the panel
  named, plus one collision the panel did not — arch-3's Pass-B labels); **976 swept in the amended pair
  (820 charter + 156 architecture) with ZERO dangling.**
- **Cars:** 41 DW cars / **45** DW commits (EST-1 +3, EST-2 +1) / **47** dispatched with CG-1 and CG-2.

### The figures re-derived by executed probe (9 node probes, detached worktree, nothing committed)
- **Capacity.** Occupancy over `BUILDINGS_PER_PARCEL`: **123/598 (20.6%) fixture corpus, max 7**;
  **228/624 (36.5%) pipeline, max 11**. Identical footprints: **183 groups, 369/2,839 rows (13.0%)**,
  attribution **100% same-parcel/same-subcell/same-permille** — ruled a DEFECT, chartered CG-2.
- **Merge.** 646/1,056 (61.2%) triples non-collinear, BUT max perpendicular deviation **0.7070** plan units
  (theoretical lattice bound sqrt(0.5) = 0.70711), max squared **0.4999** against the suite's constant of **1**,
  **0/1,056 exceedances**; symmetric difference ≤ **1.403%** of the parcel; 1,056/1,056 merged parcels
  three-vertex; **0/4,224** subcell pack failures. Failing control: vertex-crossing devSq **291.3–3,183.6,
  0/528 pass**. Quad theorem **528/528**.
- **Scale.** `PLAN_UNIT_CM_BY_TIER` = `{10,14,20,30,50,80}` cm/unit at `compileTownSceneManifest.js:99-108`.
  Frontage in feet, pooled median: whole edge **83.5** (Pantin admits **98.8%**) · **slot face 41.8 (77%)** ·
  building's longest wall 25.9 (31%) · street wall 14.0 (7%). Street clause: **163/1,098 (14.8%)** near a street.
- **CG-1.** **32/48 (66.7%) of real pipeline settlements throw**; 29 the binding cap, 3 the TC-3 byte band.
  Canonical scene buildings vs caps `{8,12,20,32,64,96}`: thorp 7/8/12 · hamlet 13/17/20 · village 30/34/39 ·
  town 48/55/61 · city 36/47/51 · metropolis 48/53/59 — **hamlet, village and town fail 24/24**.
- **Vocabulary.** 57 new cells / 60 new fixtures, zero duplicates, zero collisions; TWO dead room members
  (`stall`, `dais`); `28 − 2 + 57 = 83` and `22 + 60 = 82`.
- **B4.** Emitted prosperity over 60 settlements: Prosperous 22 / **Moderate 15** / Comfortable 11 / Poor 9 /
  Struggling 3 — `Moderate` matches no arm of `interiorModel.js:83-86` and takes the default. LIVE, 25%.
- **C5/performance** (from the panel, folded in): ~30 ms generate + ~140 ms map compile at metropolis =
  **~170 ms of a 2,000 ms budget**; 1.3 ms per building on click; ~309 ms eager worst case.

### Cleanliness
Nine probe scripts (`DWR2-occ/-pipe/-dup/-merge/-scale/-band0/-front2/-prosp/-cg1.mjs`) were written to the
WORKTREE ROOT only — never under `src/`, `docs/` or `tests/` — executed, and deleted.
`git status --porcelain` in `$SP/laneTCDWR2-tree` (excluding `node_modules`): **0 lines**.
`git diff HEAD`: empty, exit 0. Untracked non-`node_modules`: **0**.
`git rev-parse HEAD` = `00e7af612d428078634d52ea37054bd00b773ca6`, unmoved;
`claude/composite-r4` re-derived at the end = the same sha. **Nothing committed, staged or pushed.**
The main repo was never written.

### THE SENTENCE THE CHAIR NEEDS
**Ratify: the three refuted claims are replaced by executed measurement with failing controls and the
circular premise is deleted and re-argued from a testable rule — but ratification now also commits the estate
to repairing somebody else's landed cartography stage (CG-1, CG-2) before DW writes its first line, because
that stage throws on two thirds of real settlements and puts 13% of its buildings on ground another building
already holds.**
FINAL 2026-08-23T22:05:43Z
