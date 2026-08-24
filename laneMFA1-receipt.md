# LANE MF-A1 RECEIPT — THE PAINTED-FOLIO CLOSURE (aesthetic prototype)
### Lane MF-A1 (Fable), 2026-08-16. ODQ §208. Advisory deliverable: nothing here touches either git tree; scratchpad only.
### Inputs (frozen): mf-proto-out/b6 exemplar SVGs+PNGs · map-refs/ corpus (anchors hf3, hf30, hf14, hf5, hf60, hf61, hf62) · laneMFC charter §8/§9/§11.12 · laneMFS1-urbanism-atlas.md §2.3/§2.5/§2.6 (landed mid-lane; reconciled below).
### Honesty key: **[M]** measured, quoted from an executed run in this lane · **[E]** eye-read from viewed renders/crops · CONFIRMED/PLAUSIBLE per the standing law.

---

## §1 · THE §9 TENSION, RESOLVED (the design argument — vetoable)

§9.2 says "flat hand-pigment … NO gradients, NO painterly blending"; the owner's later order says the maps must **LOOK like** the reference corpus, which is visibly *painted*. The resolution this lane designed and prototyped:

**"Flat wash" is a statement about SEMANTIC COLOR, not about pigment physics.** In every anchor, one parcel = one flat pigment decision — no parcel is shaded, no gradient carries meaning. What makes the references read painted is that each flat decision is executed by a HAND on PAPER: the pigment granulates (within-fill σ 1.2–4.4 [M, MF-S1]), pools at the wash edge (tidemark rims [E, hf3/hf30]), misses the ink line by a few px (mis-registration 2–8 px [E, MF-S1 §2.3.3.4]), the line trembles and varies, and the sheet itself has grain, stains, and age. **The folio idiom evolves as: flat washes stay flat as *decisions*; the EXECUTION layer gains the hand.** No gradient ever encodes information; every §9 legibility law (ink-first, lineweight=meaning, roads-palest) is preserved and in fact *amplified* (the weight ladder got steeper). §11.12(b) already chartered "the hand raised" (seeded waver + paper grain) as a v1 member — this lane is that rider, executed and extended to the wash layer.

**JUDGMENT: chose "flat-decision / painted-execution" over (a) literal §9.2 flatness (fails the owner's LOOK order — it is the convicted mosaic) and (b) free painterly rendering (breaks era law + legibility ladder) — say "veto" to flip it.**

## §2 · WHAT THE ANCHORS ARE, MECHANICALLY (the study)

Sampled with MFA1-sample.py (full-res, PIL; clusters = median-cut on 1200 px; grain = σ of L minus 9px-median at native res; stains = σ of 33px-blurred L) — all **[M]** unless marked:

| Property | hf3 village | hf30 city | hf14 mining | b6 town flat | b6 city flat |
|---|---|---|---|---|---|
| Paper cluster | #F1DEC7/#F6E7D3 | #EDD8BC | #EBD9C4 | #D3CAAF (base #ded5b8) | #E2D9C1 |
| Ink/dark cluster share | #7D6E5C 7.9% | **#432E22 12.2% + #83674F 10.4%** | #5B4A41 10.9% | #8D846F 10.9% (L132 — not ink) | #4B3B2B 8.1% |
| L 5th percentile | 111 | **46** | 75 | 105 | 72 |
| Paper grain σ (native) | 21.1* | 11.4 | — | **5.2** (pure AA) | — |
| Low-freq stain σ | 23.8 | 30.6 | — | **8.5** | — |
| Corner-vs-center ΔL | −18.6 | +4.1 | −22.3 | (composition, not vignette) | — |

\* hf3's margin box caught label ink; treat 11–12 as the clean grain figure (hf61 blank area: 10.9).

Wash-edge profile, hf3 green field **[M]**: L rises to 188 in the 2-px band just inside the boundary, then settles to 178.7 at the core — a real ±9 L radial structure; the darkest pooled rim sits in the ink-adjacent pixels (visually evident [E], excluded by the sampling predicate). Three-tone water (dark bank line / mid band / pale channel heart) [E, hf30 river crop]. Extramural fabric drawn lighter-weight than intramural [E, hf30 wall crop] — lineweight-encodes-centrality. hf5 confirms the darkFantasy register: night pigment inside the frame, paper margins stay warm. hf61 supplies the chrome vocabulary (drawn cartouche moldings, banded scale bars, ink spatter, fold creases).

**The measured essence of the gap:** hf30 carries ~22% of its pixels at ink-dark values while b6 has effectively no dark mass; reference paper is *lighter and warmer* than b6's ground (contrast runs both directions); b6 texture ≈ 0 at both frequencies. The atlas independently measured the same three absences (Table B: grain 0.00, wash σ 0.00, exact registration).

## §3 · THE PAINTED-FOLIO STACK (design; each mechanic → observed property → cost)

Prototype: `mf-proto/aesthetic/MFA1-paint.mjs` — a standalone post-lens transform over the frozen b6 SVGs. All texture lives in **8 filter defs applied per-GROUP** (never per-op); geometry additions are the aging overlay + water banks + foxing. Determinism: every stochastic choice derives from fnv1a(`${manifestSeed}::a1-paint:v1`) → mulberry32, fixed draw order; parcel jitter uses its own stream (`::a1-parcel:v1`) so parcel count never perturbs other draws; feTurbulence seeds are drawn from the same stream (lawful per the brief).

| # | Mechanic | Observed property it closes | Implementation | Op cost |
|---|---|---|---|---|
| P1 | Paper base | corpus paper #F7E1C8–#FEF9ED (atlas [M]) | base rect → #F2E3C9 | 0 |
| P2 | Grain | grain σ 1.2–3.2 (atlas [M]); b6 = 0 | feTurbulence 0.85/2oct → alpha-matrix, full-frame rect | +1 rect |
| P3 | Stains | low-freq stain σ 19–31 [M]; hard tidemark edges via discrete transfer | feTurbulence 0.0095/4oct → feComponentTransfer discrete → warm brown | +1 rect |
| P4 | Vignette + fold | corners −10..−22 L [M]; fold creases [E hf3/hf30/hf61] | blurred inset frame ring (feGaussianBlur 34) + 1 faint fold path | +2 |
| P5 | Foxing | 3–8 discrete defects/leaf (atlas [E]) | 2–4 seeded ellipses | +2..4 |
| W1 | Warm remap | every anchor cluster R>G>B; b6 greens grey-cool | pure hex→hex function (greens→warm sage, creams warmed, water→grey-green, inks→umber) | 0 |
| W2 | Wash mottle | within-fill σ 1.2–4.4 median 3.1 (atlas [M]) | feTurbulence 0.062/3oct composite-in per wash group | 0 |
| W3 | Pooled edge + parcel paint | tidemark rims [E]; per-fill tone IQR ≈18 (atlas [M]); §2.2's 4–6 muted tones; §9.2 paper-breathing | per-wash-path rim stroke (self-color −26 L, 0.5 α) + seeded hue-family/tone jitter + pale-parcel drift toward paper; water fills get a true dark coastline rim | 0 (attrs on existing paths) |
| W4 | Wash slop (mis-registration) | fills run 2–8 px off the ink (atlas: "the decisive tell") | feDisplacementMap scale 5.5 on pure-wash groups (ground washes, squares, yards) — ink layers not displaced | 0 |
| I1 | Warm ink | ink centroid #331F16 (atlas [M]) | remap keeps b6's #2B2118 family, nudged warm | 0 |
| I2 | Weight ladder | p90/p25 = 2.8–5.7, ≥5 weights/leaf (atlas [M]); b6 fabric uniform 0.84 | band-scaled widths: walls ×1.3, landmarks ×1.35, fabric ×1.5, hairlines ×1.6 + darkened hairline hue | 0 |
| I3 | The hand (waver) | every ref line trembles ~1 px; §11.12(b) chartered | feTurbulence 0.055 + feDisplacementMap 2.2 on fabric/landmarks ink; text groups stay crisp | 0 |
| M1 | Mass shadow | hard SE cast under masses [E hf3/hf30]; §9.5 era-legal NW light | feFlood+feComposite+feOffset(2,2) chain (not feDropShadow — 1.1-safe) | 0 |
| M2 | **Block perimeter (GAP-D, adopted)** | block silhouette heavy, party seams thin (atlas §2.6.2) | feMorphology dilate 0.9 of fabric SourceAlpha, dark flood, merged under source: abutting buildings fuse into one heavy-perimeter mass, interior seams stay thin | 0 |
| A1 | Three-tone water | hf30: heavy bank line, mid band, pale channel heart | wide cool strokes dup'd: bank #45331F ×1.18 under + heart ×0.5 lighter over; sea fills get the coastline rim (W3) | +2/water path (town: 2) |

Everything else (roads palest, curved ward labels, marginalia, legend, heraldry) is already right in b6 and passes through untouched — the atlas grades those MEETS and this lane concurs.

## §4 · RECONCILIATION WITH MF-S1 (landed mid-lane; per brief)

**Adopted, with citations:** paper band + ink centroid (§2.3.1) — base moved to #F2E3C9, ink kept warm; within-fill σ and grain σ bands (§2.3.3.5/.6) — used as tuning targets and *measured with the atlas's own instrument* (§5 below); tone-jitter IQR ≈18 with the confetti warning (§2.3.3.7) — implemented as bounded ±7 L + hue-family pick; wash mis-registration as the decisive tell (§2.3.3.4) — implemented as W4; the eight-weight ladder (§2.3.2) — approximated to 6+ effective weights (hairline 0.4-band, rims 2.1, fabric 1.26, landmarks ~2, walls ~5.1, block-perimeter mass); **GAP-D two-tier block stroke — adopted in-prototype** via feMorphology (M2), exactly because it interacts with every ink decision; "the page is light, the ink is the event" (§2.3.1 value law) — drove the stain/grain reduction round.

**Differ / defer, argued:** (1) §2.3.3.5's "must be geometry or tiled pattern, never a raster filter, to survive PDF projection" — this lane **keeps SVG filters for the screen/qlmanage path** and records the PDF fallback as wave-eight work (react-pdf renders no SVG filters; the fallback candidates are a pattern-tile build of P2/W2 in defs-side geometry, or one pre-rasterized seeded texture tile per leaf embedded at export). Rationale: filters are op-free, byte-deterministic, and CONFIRMED in the harness rasterizer; a geometry port multiplies defs complexity now for a surface (PDF plate) whose pricing member (MF-7) is not yet built. The brief's "note, do not solve" clause governs. (2) Per-stroke width modulation and corner overshoot (§2.3.3.1/.3) — **not implementable as a post-lens transform** (they need path-level redraws); recorded ABSENT in the prototype, mechanisms endorsed for lens integration. (3) The atlas's grain/wash numbers were measured at 5056 px; the instrument is scale-sensitive (§5 caveat) — recorded, not a disagreement.

## §5 · MEASUREMENTS (all [M], executed this lane)

**The atlas's own instrument (MFS1-aesthetic.py) on the painted output**, vs corpus bands and b6:

| Property | Corpus [M, atlas] | b6 [M, atlas] | A1 painted [M, this lane] |
|---|---|---|---|
| paper_grain σ | 1.20–3.18, median 1.8 | **0.00** | **3.5 @1500px / 3.3 @3000px** — at/just above the band ceiling; scale-stable |
| wash_within σ median | 1.22–4.44, median 3.1 | **0.00** | **2.2 (town) / 1.29–1.46 (city, town@3000)** — in band |
| wash_within σ p90 | up to 5.5 | 0–3.6 | 2.8–4.6 — in band |
| fill_tone IQR | 6.1–100.1, median ≈18 | 4.0 (16.5 city) | **21.1–23.8 (city) / 28.2 (town @3000px)** — in band; town@1500 reads 5.2 (see caveat) |
| lineweight ratio p90/p25 | 2.8–5.7, median 3.55 | fabric uniform | **4.33 (city@1500)** — in band; 6.5 (town@1500), 23.0 (town@3000) — see caveat |
| Ink / paper hue | #331F16 / #FBEBD6 | #2B2118 / #F3EBD6 | warm-remapped from b6's (both MEETS per atlas) |

**Instrument caveats (recorded so nobody inherits a stale number):** (a) the window classifier keys off the plate's bright mode; a full-bleed painted map (no paper margins) depresses `paper_L_mode` (town 191, city 153) and distorts the paper/wash bins — the atlas itself marked b6's value-range row "not assessed" for the same reason; (b) stroke-ratio and IQR are strongly render-scale-sensitive (town IQR 5.2@1500 → 28.2@3000; ratio 6.5→23) because thin strokes and small parcels only resolve at scale — corpus numbers were taken at 5056 px; cross-scale comparisons must fix the scale. (c) village leaf: wash_n=7 — the instrument cannot classify its pale parcels; its IQR row is unusable.

**Ops (draw elements, text excluded) and size:**

| Leaf | b6 draw ops | A1 draw ops | Δ | b6 KB | A1 KB | ceiling 2200 |
|---|---|---|---|---|---|---|
| town | 202 | 212 | **+10** | 261 | 273 | 9.6% used |
| village | 110 | 116 | **+6** | 140 | 144 | 5.3% |
| city | 253 | 261 | **+8** | 337 | 341 | 11.9% |

Plus 8 filter defs and ~64–82 text elements per leaf (unchanged). Stroke additions to existing paths cost zero ops.

**Determinism — CONFIRMED:** two runs per exemplar, sha256-identical SVGs (town 7c90033d…c0fc, village bf6d302e…41d4c, city 835bdafb…94b8), matching the shipped files; different seed (mf-town-02) → different bytes (2 distinct hashes). Raster determinism: qlmanage twice on the painted town → **pixel-identical PNGs** (PIL data compare, True).

**qlmanage fidelity — CONFIRMED by rendering and looking:** probe sheet MFA1-probe.svg exercised every primitive in isolation (feTurbulence grain, discrete-transfer stains, feDisplacementMap waver+slop, feFlood/feComposite/feOffset shadow, feGaussianBlur vignette, pattern fill, feDropShadow, nested filter chains, text under overlay) — all render in the harness rasterizer; feMorphology confirmed in the final renders (block perimeters visible in the town zoom). No silent drops observed on any technique used.

**Render cost [M]:** qlmanage 1500 px city: flat 0.33 s → painted 3.33 s wall (~×10; the filters, chiefly the full-frame turbulence). Absolute cost is tolerable per leaf but is real evidence for batch exports (a 100-leaf time-lapse export pays ~5 min of filter time at this scale in a software rasterizer). Browsers GPU-composite these filters; not measured here (hazard §8.1).

## §6 · SELF-JUDGMENT AGAINST §8.3b (absolute distance, never progress)

**Glance range (full map at ~1100 px):** the painted leaves sit in the corpus's register — warm lit paper, aged sheet, dark ink event, grey-green water with banks, articulate patchwork. Put beside hf62/hf30/hf3 they read as *plainer, cleaner cousins* — recognizably the same folio family, not the same hand's richness. **Could sit beside the reference without embarrassment at glance range: yes, marginally — the register matches; the density of drawn incident does not.**

**Study range (zoom):** honest distance remains **substantial**, and it is now dominated by GEOMETRY, not paint: hf30's fabric is contiguous block-masses with carved-street negative space and 2–4× our packing (the atlas's T-01/T-02/T-07/T-08 rows — grain, frontage continuity, burgage series); our painted fabric is individually-outlined small buildings, blocked only where b6's geometry happens to abut them. Within paint itself, the residuals are: per-stroke width modulation, corner overshoot, per-BUILDING wash mis-registration (needs the lens to split building wash from building ink — a one-pass architecture change at integration, not reachable post-hoc), roof-ridge tick pairs, and the countryside's six ground primitives (T-24, the b6 countryside's biggest absence). **The ink pass is the idiom's soul and ours is now hierarchical and trembling, but it is still a plotted hand next to hf30's brush.**

**What closes the rest:** (1) wave-eight geometry per the atlas's §2.6.1/2 (grain walk + true block silhouette/burgage frontage — GAP-A/GAP-D/SCOPE-1); (2) the lens-integrated ink/wash split enabling per-building mis-registration + width-modulated stroke outlines (atlas §2.3.3.1/.4 mechanics); (3) countryside primitives (T-24); (4) chrome escalation (T-25) + hf61's furniture. The painted-execution layer prototyped here then rides on top unchanged — its mechanics are orthogonal to all four.

## §7 · OP-CEILING VERDICT

**FITS. No amendment proposed.** The painterly cost lands almost entirely in 8 defs-side filters (op-free) and ≤ +10 draw elements per leaf; the richest painted leaf (city, 261 ops) uses 11.9% of the 2,200 ceiling. §11.12(b)'s ~480-op headroom at metropolis is untouched. The one cost that is NOT op-denominated is render time (×10 in a software rasterizer, §5) — flagged for MF-7's export pricing, not for the op law.

## §8 · HAZARDS FOR THE INTEGRATING WAVE

1. **Browser-vs-qlmanage parity is unproven.** Every technique is CONFIRMED in qlmanage (WebKit software path). Browsers differ in feTurbulence tiling seams, filter region defaults, and feMorphology radius rounding — the integration wave must render the same leaf in the real app surface and diff. (The textPath precedent, in reverse.)
2. **react-pdf renders no SVG filters.** The whole texture stack silently vanishes on the PDF plate. Declared fallback options in §4; MF-7 must price one. A leaf that looks painted on screen and flat in the bound book is a coherence bug under §12's document conceit.
3. **feDisplacementMap on wash groups moves COSMETIC paint only** — but if the integrating lens ever puts a truth anchor (clickable region) inside a slopped group, hit-geometry and painted pixels part company by up to ~8 px. Law for integration: slop wraps only anchor-free wash layers (the prototype already scopes it so: ground washes, squares, yards).
4. **Filter-region clipping:** waver/slop displace up to ~8 units; elements within that distance of the frame edge need the filter's -4%/108% region (set) or they clip. A future frameless crop export must re-check.
5. **The aging overlay sits over text** at α≤0.10 stain / 0.30-slope grain — legible in all renders viewed, but the accessible lens must EXCLUDE the whole aging layer (contrast law); vtt likewise wants P2/P3 off or halved. Lens gating is one conditional in the transform.
6. **Instrument scale-sensitivity** (§5 caveat) — pin any future aesthetic-band tests to a declared raster scale or the bands are meaningless (the hand-keyed-address rot class, measurement flavor).
7. **The b6 'fields' group mixes wash and ink**, forcing mottle-without-slop there; the integrated lens should emit washes and ink as separate sibling groups per layer so W4 can cover every wash (and per-building mis-registration becomes possible). This is the one lens-architecture change the painted stack wants from wave eight.
8. **Full-frame turbulence render cost** scales with export batch size (§5); cache the rasterized paper layer per (seed, lens, scale) if export time ever binds.

## §9 · JUDGMENT ROWS (all vetoable)

- **JUDGMENT: flat-decision/painted-execution resolution of §9.2 vs the LOOK order** (§1) — chose evolving the idiom's execution layer over literal flatness or free paint.
- **JUDGMENT: SVG filters over geometry/pattern texture** (contra atlas §2.3.3.5) because op-free + deterministic + harness-proven; PDF fallback deferred to MF-7 with two named candidates — say "veto" to mandate geometry-tile texture now.
- **JUDGMENT: GAP-D adopted via feMorphology approximation** rather than true polygon-union block silhouettes — the visual read (heavy fused perimeter, thin party seams) is achieved for zero geometry work; the true union pass stays wave-eight (it also unlocks courts/frontage which morphology cannot).
- **JUDGMENT: aging overlay applied over chrome/labels** (the sheet ages as one object, matching every anchor) at α low enough for legibility — say "veto" for a labels-above-aging variant.
- **JUDGMENT: anchor pairing for the side-by-sides** — town→hf62 (bankside portrait), village→hf3, city→hf30; hf31 excluded per the atlas ("pictorial; grammar only").
- **JUDGMENT: one tuning round after the instrument run** (grain 5.4→3.5, stain α 0.13→0.10, paper toward the band) then stop — further taste iteration without owner eyes is spend without signal.

## §10 · DELIVERABLES (all under scratchpad/)

- `mf-proto/aesthetic/MFA1-paint.mjs` — the transform (standalone, seeded, documented; the blueprint module).
- `mf-proto/aesthetic/MFA1-sample.py` · `MFA1-probe.svg(+.png)` — the reference-measurement tool and the rasterizer-fidelity probe sheet.
- `mf-proto-out/a1/MFA1-{town,village,city}-painted.svg` + `.png` (1500 px) + `hi/MFA1-town-painted.svg.png` (3000 px).
- Side-by-sides: `mf-proto-out/a1/MFA1-sbs-{town,village,city}-full.jpg` (b6 | painted | reference) and `MFA1-sbs-town-zoom.jpg` (study-range triptych).
- Determinism evidence: `MFA1-det-*-r1/r2.svg` (+altseed), `rd1/rd2/` pixel-identical rasters.
- Study crops: `mf-proto/aesthetic/MFA1-crop-*.jpg`, previews `MFA1-view-*.jpg`, `MFA1-prev-*.jpg`.

**Not done, deliberately:** watercolor/darkFantasy lens variants (the stack is lens-parametric — night pigment = the same mechanics over hf5's palette — but only parchment was proven; deferred with the §109 acceptance set in view); browser-surface render check (hazard 1); any edit to mf-proto/build-out (B7's ground, untouched); memory writes (per brief).
