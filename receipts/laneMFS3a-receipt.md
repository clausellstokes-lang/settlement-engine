# LANE MF-S3a RECEIPT — THE PLAN-STRUCTURE COMPENDIUM

**Lane:** MF-S3a (Opus 5) · **Date:** 2026-08-17 · **Orders:** ODQ §245 (plan-structure study) as sharpened mid-lane by **§246** (the reconstruction question: "if you had to create these exact same images using OUR process, how would you do it?").
**Deliverable:** `/Users/cstokes/Desktop/settlement-engine/map-corpus/docs/MORPHOLOGY-PLAN.md`
**Read-only lane:** no git commands run, no memory writes, no edits to `laneMFS1-urbanism-atlas.md` (treated as read-only throughout, since MF-S2 is editing it concurrently).

---

## 1 · EXCLUSIONS — STATED AS REQUIRED

**HOLDOUT: 91 plates excluded. CONFIRMED.**
`laneHFM1-holdout-proposal.json` was parsed for every `hf<n>` token appearing anywhere in the file — the `proposed`, `kept`, `added` and `dropped` arms **and** both arms of the 12-swap `minimal_swap` fix. The conservative union is **91 distinct plates**, all present on disk. The narrower reading (`proposed ∪ minimal_swap.proposed`) is 81; I took the wider union per the brief's "conservatively".

Excluded ids: hf4, hf5, hf12, hf21, hf22, hf27, hf31, hf32, hf41, hf42, hf56, hf59, hf61, hf73, hf87, hf89, hf92, hf94, hf102, hf103, hf105, hf120, hf122, hf125, hf126, hf127, hf129, hf130, hf132, hf134, hf136, hf143, hf145, hf147, hf156, hf168, hf172, hf176, hf180, hf183, hf191, hf192, hf195, hf200, hf221, hf223, hf230, hf231, hf232, hf233, hf234, hf237, hf240, hf242, hf246, hf258, hf259, hf265, hf266, hf267, hf269, hf272, hf273, hf275, hf281, hf282, hf285, hf288, hf289, hf290, hf294, hf301, hf311, hf312, hf326, hf333, hf334, hf335, hf336, hf339, hf344, hf345, hf346, hf349, hf354, hf355, hf365, hf367, hf371, hf382, hf384.

**No holdout plate was opened, measured, viewed or cited.** Verified mechanically: the sampling frame (`MFS3a-frame.py`) removes them before any plate path is constructed, and every measured row keys off that frame.

### ⚠ THE EXCLUSION AUDIT CAUGHT A REAL LEAK — recorded because the catch is the point

The measurement pipeline was clean throughout (0 holdout rows in `MFS3a-planmetrics.json` / `MFS3a-voidmetrics.json`, 0 holdout keys in the window table). But a **final text audit of the prose found seven holdout ids cited as illustrative examples** — hf22, hf240, hf266, hf269, hf290, hf311, and then hf288 which I introduced *while fixing the first six*. None came from viewing a plate; all came from the calibration index's textual descriptions. That is still contamination of the holdout's purpose, so all seven were removed:

- five were **re-sourced to studiable plates** (hf330, hf296+hf270, hf331, hf138/hf72/hf62, hf307+hf100);
- one — **§10.3, the DESIRE PATHS finding — was WITHDRAWN entirely**, because its sole source was a holdout plate that the calibration index records as *the only plate in the corpus that draws unofficial movement*, so there is no second studiable witness. The section slot is left in the document carrying the withdrawal notice rather than renumbered, so the withdrawal is visible; its ledger row (§12) and its ranking entry (§13 rank 11) were updated to match.

**Final re-audit: 0 holdout ids cited; 0 cited plates outside the studiable frame; 80 distinct plates cited.** The lesson worth carrying: *a text audit is a separate gate from a pipeline audit, and the fix pass needs its own audit* — my first correction introduced a new leak.

**STUDIABLE FRAME: 222 plates.** By category: town 49 · specimen 28 · terrain 27 · zoom 15 · city 15 · village 12 · stressor 11 · fantastical 10 · systems 8 · underground 7 · metropolis 6 · lens 6 · thorp 5 · hamlet 5 · series 5 · chrome 4 · exp 4 · trade 3 · institution 2. By era: HF-1 35 · HF-2 21 · HF-3 54 · HF-4b 51 · HF-4c 61.

**LETTERING SCRUB: 35 plates**, parsed from `laneHF4-receipt.md`. No naming/lettering observation anywhere in the compendium is drawn from any of them. Three (hf306, hf298, hf309) are cited **for geometry only** and are marked as such at every use, per the brief ("their geometry is fine").

---

## 2 · SAMPLE SIZES

| Layer | n | Basis |
|---|---|---|
| Studiable frame read via the calibration index | 222 | `laneHF-CALIBRATION.md` per-plate entries (what each teaches + recorded defects) |
| Plates viewed directly (full plate, zoom, or gridded contact sheet) | 36 | 3 contact sheets of 12 + 6 individual + 2 zooms + 4 validation sheets |
| **MEASURED windows** | **49** | 35 whole-settlement + 14 within-plate quarter/epoch sub-windows |
| Plates carrying measured windows | 36 | — |

**Measured whole-settlement composition:** thorp 2 · hamlet 2 · village 3 · town 17 · city 7 · metropolis 4.
**Sub-windows (the within-plate discriminator set):** hf26 old / newquarter / burnt · hf72 east / west · hf121 huddle · hf239 camp / vicus · hf347 core / outerring · hf40 rich / poor · hf274 oldbank / newcharter.

**Windows are HAND-SET** (`MFS3a-windows.json`), following the `MFS1-grain2.py` convention and carrying its warning verbatim: a window is the analyst's eye-bounds and must be re-set per plate.

---

## 3 · INSTRUMENTS (all saved beside the doc in `map-corpus/docs/`)

| File | Role |
|---|---|
| `MFS3a-frame.py` → `MFS3a-frame.json` | studiable frame; holdout + scrub exclusions |
| `MFS3a-plangraph.py` | hull, street space, street graph (junction typing, dead ends, mesh), Boeing orientation entropy/φ, block area–shape–solidity, backland green |
| `MFS3a-voids.py` | grain (cells across), street width in plot-widths via distance transform, void hierarchy |
| `MFS3a-contact.py` | percent-gridded contact sheets for hand-setting windows |
| `MFS3a-overlay.py` | visual validation sheets |
| `MFS3a-run.py` | driver over the window table |
| `MFS3a-windows.json` | the hand-set windows |
| `MFS3a-planmetrics.json` / `MFS3a-voidmetrics.json` | the 49-window outputs |

Environment: a scratch venv (numpy 2.0.2, scipy 1.13.1, scikit-image 0.24.0, networkx 3.2.1) — the system python has PIL only. Nothing was installed into the project.

---

## 4 · CALIBRATIONS PERFORMED BEFORE ANY NUMBER WAS BELIEVED

1. **Street threshold.** Global Otsu on a town plate returns ~118 and separates ink from not-ink — the wrong split. Otsu on the **non-ink subset** returns ~190 and correctly separates block fill (L 167–172) from street/void (L 212–220). Even that fails on ward-washed plates (hf34), so the shipped rule is **local-adaptive** (`L > localmean(7.5% longside) + 12`): the street is always the palest thing in its own neighbourhood. Verified visually on hf34, hf72, hf40, hf26.
2. **Spur pruning.** Unpruned skeletons report **54–72% dead ends** — an artifact. After pruning: 11–39%. The unpruned figures are recorded here so no future lane quotes them.
3. **Grain degeneracy below village tier.** hf90, a twelve-roof thorp, returns **55.0 cells across**. This is ODQ §244.5's exact trap in a new instrument. All thorp/hamlet rows carry `grain_valid:false` and enter no band aggregate.
4. **Colour probe.** Roof vs sage backland are separated by the green index `2G−R−B` (sage 21, terracotta roof 2), not by luminance (both L≈167).

---

## 5 · VISUAL VALIDATION EXECUTED — CONFIRMED

Overlay sheets generated and **looked at** for: hf72, hf40, hf34, hf26, hf3, hf33, plus a four-panel window sheet for hf239@camp, hf239@vicus, hf26@newquarter, hf26@old. In the last sheet the extracted skeletons visibly trace the *via principalis*/*via praetoria* cross in the camp, a tangle in the vicus, and a clean lattice in the Quartiere Nuovo — the windows sit on real fabric and the graph is the real street web. This is what promotes the φ headline from PLAUSIBLE to **CONFIRMED**.

---

## 6 · EPISTEMIC LABELS

### CONFIRMED (I executed the measurement or read the pixels in this lane)
- Junction mix: T/Y 0.510–**0.653**–0.738; X 0.000–**0.015**–0.055; dead end 0.110–**0.209**–0.391; deg≥5 essentially zero (22 of 35 windows have none). X:T median **0.024**.
- Mesh: mean degree 2.13–**2.47**–2.67; edge/node 1.17–**1.40**–1.55; γ 0.393–**0.473**–0.521.
- Orientation-order φ: whole settlements 0.044–**0.103**–0.433. Within-plate planned/organic pairs: hf239 camp 0.585 vs vicus 0.074 (7.9×); hf26 new 0.652 vs old 0.069 (9.5×); hf274 newcharter 0.318 vs oldbank 0.131 (2.4×).
- Per-epoch grain deltas: hf26 46.9→16.3 (2.9×); hf274 47.2→26.6 (1.8×); hf347 17.4→9.8 (1.8×).
- Wealth deltas within hf40: dead-end 0.215 (rich) vs 0.296 (poor); backland green 0.006 vs 0.000.
- Block shape: elongation 1.56–**2.14**–3.42; circularity 0.126–**0.324**–0.578; solidity 0.503–**0.748**–0.861; area p90/p10 5.8–**13.6**–204.5.
- Width hierarchy p97/p50: 1.79–**3.32**–7.30 (distance-transform method).
- Voids: count ≥4 plot-widths² median 7 (range 0–24); polycentricity index (2nd/1st void) — 12 of 34 monocentric (<0.15), 13 of 34 polycentric (>0.55).
- Tier invariants: T/Y, X, dead-end share and φ are flat across village→metropolis; grain, hierarchy depth, district count, epoch count and void count are not.
- Grain by tier from my own windows: village 29.0–**39.2**–45.1 · town 29.2–**54.5**–65.0 · city 25.8–**62.0**–72.0 · metropolis 82.1–**84.3**–101.0.
- The three failed auto-hull detectors (§13.4 of the doc).
- hf347's fossilised-circuit vocabulary — Old Wall Lane, wall stub, old gate gap, filled-ditch gardens, tower dwellings — read at 1500px zoom.

### PLAUSIBLE (reasoning from evidence I did not directly execute)
- Legible district counts per tier and legible epoch counts per tier — **[E]** eye counts over the plates I viewed, not a census of all 222.
- The ordinary:notable footprint ratio (2–5% at town, 1–2% at city) — **[E]**, counted on plates where both were countable.
- District adjacency pairs that "never" occur — **[E]** over the plates I viewed; not an exhaustive corpus census.
- The six monotony-avoidance devices — **[E]** structural reading at zoom.
- The claim that φ>0.8 is "drawn wrong" — rests on n=1 rigidly-planned quarter (hf26 at 0.652) plus the corpus's own recorded defect list; the exact ceiling is a proposal, not a measurement.

### EXPLICITLY WITHHELD
- **hf347@core φ = 0.707** resolves only 11 graph nodes and is used in no conclusion.
- **Grain below village tier** — not reported at all.
- **The green-backland measure is one-way only**: a high score evidences backland; a low score does not disprove it (a plate that draws yards in roof tone scores 0).
- **No corpus-wide incidence counts were minted** for features needing per-plate inspection; where such a figure was needed I cited the existing record (ODQ §240.2, atlas T-10).

---

## 7 · RANKED GAP LIST (for the chair; proposals only)

| Rank | Gap | Verdict | One-line proposal |
|---|---|---|---|
| **1** | Frontage-first generation + the plot series | MISSING (§18.5 deferred) | **Recommend un-deferring §18.5.** Three independent findings converge on one object; present from hamlet tier up; unlocks block silhouette, backland core, court frequency and district legibility as side effects |
| **2** | Epochs carry no grain / φ / bearing / attachment mode | PARTIAL | §240's axis is being built now (MF-ARCH-2); attach the three measured dials to each epoch or the axis lands visually inert |
| **3** | `circuitDemotion` — the fossilised circuit | MISSING | One transformation table at each epoch boundary: wall→ring street, gate→widening, tower→circular building, ditch→garden band. Highest leverage per unit cost in the study |
| **4** | Junction-type discipline (X:T) | MISSING | `junctionMix` bands + generate by attachment, not intersection. A leaf can satisfy §201/§202 perfectly and still emit an all-X lattice |
| **5** | Wealth drives tone but not geometry | PARTIAL | Grain, backland extinction and dead-end rate are all measurably wealth-driven |
| **6** | Events have no spatial footprint | PARTIAL ⚠ | `eventFootprint` — **flagged, not designed**; grazes the event/persistence surface, which is owner-gated |
| **7** | `intramuralVacancy` + bearing-preserving dead-block handoff | PARTIAL | Completes the demotion discriminator; gives §239.4's recorded dividend something to draw |
| **8** | Surveyed-not-built occupancy | MISSING | Removes the machine-perfect-grid defect *by construction* instead of by jitter |
| **9** | Centre typology + second-authority-mints-second-centre | PARTIAL | Six structurally distinct centre types; we appear to have one square primitive |
| **10** | Jurisdictional institution duplication | PARTIAL | Needs a flag, not geometry. Makes hf331 reproducible |
| **11** | Works layer · desire paths · moved settlements | MISSING | Real, derivable, correctly last |

**Corrections offered to existing atlas targets** (named so the chair can rule, not asserted): atlas **GAP-B**'s `radialDensityFalloff` should be kept as a *census* but **forbidden as a generator input** — the radial reading is a symptom of (age, wealth, land use) and fitting to it would bake in the concentric prior the program has spent three rounds fighting (§1.5). Atlas **GAP-C**'s width classes should be *quantisers over a derived graph load*, not the source of width (§1.4). Atlas **GAP-H**'s district-legibility census now has a measured band to use: neighbouring characterised districts differ by ≥1.4× median block area or ≥1.3× cells-across (§4.2).

---

## 8 · §246 COMPLIANCE

- **Every finding carries a RECONSTRUCTION FORM** — mechanism (stage, inputs, rule), derivation home (named dossier fact), verdict (HAVE / PARTIAL / MISSING / NOT-DERIVABLE).
- **RECONSTRUCTION TRACES section added** — 8 plates traced (hf26, hf347, hf72, hf40, hf331, hf306, hf239, hf93), spanning hamlet → metropolis and organic / planned / polycentric / stratified / dual-authority / ruined / military-founded. Each states the required dossier facts, the pipeline sequence, what we would emit today, and where it diverges. **No trace uses a holdout plate**; hf306 is traced on geometry only.
- **Divergences ranked** by traces and plates affected (10 rows).
- **Calibration note honoured**: the target is stated throughout as register and kind, never pixel-identity; §10.6 catalogues the corpus's own *plan-level* defects we must not inherit, and several findings note where our truth layer already beats the reference (hf40's dithered frontier, named institutions as outliers).
- **NOT-DERIVABLE items are filed separately** in §14 (five items) rather than dressed as rules.

---

## 9 · WHAT I DID NOT DO

- No git commands (the corpus folder is git-ignored by construction, per §243.2).
- No memory writes.
- No edit to the atlas or any file outside `MORPHOLOGY-PLAN.md` and the `MFS3a-*` instruments/JSON.
- No duplication of MF-S3b's context half; geography, water, walls-as-defence, edges, institution siting, circulation and regional morphotypes are cross-referenced (**→ S3b**), not covered.
- Did not census all 222 studiable plates individually — 36 viewed, 222 read via the calibration index. Stated in the doc's §0.3 rather than implied.
- Did not attempt footprint-level segmentation; the instrument measures blocks and street space, never individual buildings, and the doc says so at every use.
