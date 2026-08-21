# V5 PHOTOREAL — ASSET INVENTORY (2026-08-04, Fable-side planning pass)

Every asset the composited photoreal header needs. Sources are the eight owner-generated
references at `/Users/cstokes/Desktop/Settlement Forge template review/` (3584×4800 RGBA,
upscaled from 2048 — true detail ceiling ≈ 2048px, ample for every target below), plus
new Higgsfield generations (prompts in GENERATION-PROMPTS.md) and pipeline-derived
plates. The structural layer is the approved V5 spec
(`…/scratchpad/v5/v5-spec-draft.md`); drawn-texture systems retire, geometry/laws survive.

## Reference key (identified by content against V5-NANO-BANANA-REFERENCES.md)

| Key | File (prefix `hf_20260804_`) | Curation identity |
|-----|------------------------------|-------------------|
| R1 | `153642_6f5f3272-…` | #1 Wide cartouche + spiral fletch (portrait, parchment) |
| R2 | `153642_7d3d368b-…` | #2 Five-panel — ★ burned-frame cartouche CANON + "and word" pyrography |
| R3 | `153642_f71ab8ee-…` | #3 Three hanging vanes panels; quill-through-wrap; curved-barrel words |
| R4 | `153650_88c7f61c-…` | #4 Grey-ground full arrow + arc; torn gold-leaf; dense burgundy whipping |
| R5 | `153650_974aa8d8-…` | #5 ⚠ Pendant feathers — CAUTIONARY. Texture fallback ONLY, never attitude |
| R6 | `153650_ce1b72e2-…` | #6 Burns-and-words; ★ seal-in-O with TRIANGLE device (estate-nearest) |
| R7 | `153650_e359c5c5-…` | #7 The scroll shot — depth/light canon; spiral-binding run |
| R8 | `153642_a5b96bbb-…` | #8 Uncurated quarter-view fletch cluster; collar/ordering confirmations |

Crop windows below are given as % of the 3584×4800 canvas, ±2% — VERIFY VISUALLY on the
full-res file before cutting; the multi-panel refs have ~1–2% gutters. Panel grids:
R2/R4 = two full-width panels (y 0–23%, 23–48%) then a 2×2 grid (rows 48–74%, 74–100%);
R3 = same shape (y 0–24%, 24–48%, rows 48–74%, 74–100%); R6 = one full-width panel
(y 0–22%) then three 2-across rows (22–48%, 48–74%, 74–100%).

Layer stack (bottom → top) referenced by the L column:
L0 page (existing site bg) · L1 derived cast-shadow plates · L2 shaft strip ·
L3 burned-in ink (cartouche frame/letters, route labels — multiply+normal pairs) ·
L4 thread UNDER blades (spiral crossings, tail collars) · L5 vanes Create→Library→Realm
(z ascends) · L6 cluster whippings (over quill ends) · L7 fletch labels (on vanes) ·
L8 seal (object ON wood, casts) · L9 Sign In fitting · L10 drawn active marks (gilt
quill-line + tab underline — stay CSS/SVG, paint over thread) · L11 focus rings (DOM).
Typed aria text sits behind every lettering asset (drawn layer aria-hidden; COPY_ONLY
carries the wordmark string — the SettlementFoOrge lesson's mechanism survives).

Retina targets are the FINAL delivered sizes (CSS px × 2 desktop, × 3 for the two
smallest sprites); masters are kept larger and downscaled at encode.

---

## A. Shaft

| id | purpose | source | alpha? | retina target | states | breakpoints | L |
|----|---------|--------|--------|---------------|--------|-------------|---|
| SH-1 | The half-barrel shaft strip: underside of the shaft, axis at viewport top edge, lit at the cut falling to the silhouette rim (SHAFT_STOPS read). One continuous master; seams only under objects | GENERATE-NEW (P1). Crop fallback: R5 clean shaft runs between its three bands (y ≈ 27–34%) | No (opaque band; hard top edge at y=0, 1px soft bottom rim) | master ≥ 5760×304; delivered 2880×76 (1440@2x) | one (both scroll states share it) | SH-1a 1440 (2880×76) · SH-1b 640 re-crop (1280×76+) · SH-1c 390 mobile two-row re-crop (1170×~243 @3x) — all three cut from ONE master so grain matches | L2 |

JUDGMENT — generate, don't crop: no reference has ≥2880px of continuous clean horizontal
barrel (R5's is interrupted by bands and runs slightly diagonal). One dedicated ultra-wide
generation cropped "centerline → bottom silhouette" (the owner's own crop-don't-prompt
doctrine) gives the whole strip in one grain. Seam-extension by mirror-blend lands under
the lead whipping / cartouche columns if width still falls short after upscale.

## B. Vanes — three DISTINCT feathers × two states

| id | purpose | source | alpha? | retina target | states | breakpoints | L |
|----|---------|--------|--------|---------------|--------|-------------|---|
| VN-C | Create vane. Rest: quill bound along the rim (Lb 30), gentle sag (Sg 4), belly Db 34, rounded tail up-turn kissing at ax+188; leading cut at the cluster's left. Flight: pressed flat, hang 11px | GENERATE-NEW (P2) — one canvas, SAME feather twice (rest + flight poses) so the crossfade pair keeps one identity. Texture fallback: R3 p5 / R5 feathers (warp in comp) | Yes — fray fibres preserved | rest ≈ 440×115; flight ≈ 440×65 | rest + flight (pre-generated crossfade pair) | same files; phone scale by transform (Db 24-class) | L5 (z 1 of 3) |
| VN-L | Library vane, the largest/palest: Lb 26, W 220, Db 46, Sg 5.5; flight depth 13px | GENERATE-NEW (P3), same one-canvas-two-poses | Yes | rest ≈ 500×135; flight ≈ 500×70 | rest + flight | as VN-C (Db 28-class phone) | L5 (z 2) |
| VN-R | Realm vane, warm-dark: Lb 32, W 178, Db 38, Sg 4.5; flight depth 12px; tail kisses free before the trail whipping | GENERATE-NEW (P4), same construction | Yes | rest ≈ 420×120; flight ≈ 420×68 | rest + flight | as VN-C (Db 25-class phone) | L5 (z 3) |

Laws carried into the assets: THE PENDANT LAW (leading edge visibly bound along the
shaft before any droop — R5's dangling attitude is the named failure); THE SEPARATION
LAW (per-lane value stagger — the three feathers are prompted a tonal step apart, each
with a lit leading edge; the pin ≥1.15:1 at every crossing, both states, is measured on
the COMPOSITE, not the asset). Feathers are generated WITHOUT thread — bindings are
separate layers so collars stay visible in the rest bay windows and get covered by the
flight lap, as the layering physically must (F1 ruling).

## C. Thread — whippings, collars, spiral, tie-offs

| id | purpose | source | alpha? | retina target | states | breakpoints | L |
|----|---------|--------|--------|---------------|--------|-------------|---|
| TH-1 | Lead whipping — 10px full-height oxblood band at the cluster's head end | CROP: R2 p2 (y 24–48%, dense wrap at x ≈ 8–28%) or R4 p6 (x 50–100%, y 74–100%, densest burgundy) | Yes (thread-texture edges; ~1px bulge past the bottom rim as the thickness cue) | 24×80 + overscan | one | scales | L6 |
| TH-2 | Trail whipping — same construction, different crop so the pair doesn't twin | CROP: R6 p-row4-right (x 50–100%, y 74–100%) or R8 trail collar (right band, ≈ x 78–88%, y 52–62%) | Yes | 24×80 | one | scales | L6 |
| TH-3 | Tail collars ×3 — compact two-turn collar + nub pinning each tail kiss (≈6×10 CSS). Three sub-crops so no two twin | CROP: R8 collars, R3 p6 wrap turns, R2 p6 edge turns | Yes | 18×30 each (@3x) | one | scales | L4 |
| TH-4 | Spiral crossing sprite ×2 variants — single thread pass crossing the quill at the rim (2 per bound run × 3 runs, placed with unitHash jitter at composite) | CROP: R1 spiral crossings along the fletch (thread passes ≈ x 45–95%, y 44–54%) or R7's spiral run (x 35–85%, y 15–55%, pick two clean passes) | Yes | 14×30 each (@3x) | one | scales | L4 |
| TH-5 | Tie-off diagonal + nub for the two whippings | CROP: R2 p6 (x 50–100%, y 74–100%, the diagonal tie) or R6 row-4-right | Yes | 20×40 | one | scales | L6 (over TH-1/2) |

All thread crops get the WRAP_BARREL treatment at composite: neutral-grade, then the
strip's own cylinder gradient multiplied over them so every wrap reads as wrapping THIS
barrel (crops come from differently-lit barrels; the blend contract + @supports fallback
carry over as the compositing rule).

## D. Cartouche + seal (the wordmark lockup)

| id | purpose | source | alpha? | retina target | states | breakpoints | L |
|----|---------|--------|--------|---------------|--------|-------------|---|
| CT-1 | The cartouche band: burned char frame (ends+foot only — arms die into the viewport cut), gilt inner hairline, per-glyph char beds, gold-fill "SettlementForge" engraved roman with swash S/F. Delivered as a MULTIPLY layer (char frame + beds + singe halo — darkening-only, grain survives beneath) + a NORMAL layer (gold letters + hairline) | GENERATE-NEW (P5) — generated CLOSED like R2 p3 and cropped through the top run (crop-don't-prompt); R2 p3 (x 0–50%, y 48–74%) is the canon conditioning image AND the emergency crop fallback | Yes (ink-only layers; band field stays the strip's own wood) | band ≈ 560×76 (280×38 CSS @2x); letters-only and frame-only sub-crops kept for repair | one (wordmark has no hover/active variants; it is the home link) | 0.82-scale transform on mobile; same files | L3 (+L8 seal) |
| CT-2 | The seal — three rungs from one master: 16px dimple (elsewhere), 30px SIMPLIFIED STRIKE (the header rung, 1x+2x), 40px full device (hero/PDF). Solid wax, no gilt ring, triangle debossed dark-lip-toward-the-light | CROP: R6 row-3-left seal-in-O (≈ x 28–42%, y 54–66% — the triangle-device impression, estate-nearest). GENERATE fallback (P10) if the 30px photo strike culls muddy | Yes | 96×96 master; delivered 90 (30@3x), 80 (40@2x), 32 (16@2x) | one | mobile keeps ≥24px → strike rung | L8 (casts: d 1.6, blur 1.8 @0.5) |

JUDGMENT — CT-1 generates rather than crops: R2 p3's plate is ≈2.5:1 and our band is
≈7.4:1 (frame ends x≈40→319 on a 38px bar); stretching the canon crop that far mangles
letterforms, and its spelling must be re-verified at full res anyway. The generation
re-states the canon at the right aspect with R2 p3 passed as the reference image.
JUDGMENT — one baked band, not assembled glyphs: fewer seams, no registration risk; the
letters-only / frame-only / seal-only sub-crops from the same canvas keep repair cheap.

## E. Burned route labels (the reference shelf)

| id | purpose | source | alpha? | retina target | states | breakpoints | L |
|----|---------|--------|--------|---------------|--------|-------------|---|
| RT-1 | "Compendium" — branded-then-gilded (char bed + gilt fill + singe halo; the §1d AA fork survives the photo build: gold-on-bed ≥7.50:1 per glyph, measured on asset pixels) | GENERATE-NEW (P6 idle set / P7 active set — one canvas per state carries all three words for material consistency; per-word crops) | Yes (multiply char/halo + normal gold, same two-layer split as CT-1) | ≈ 220×48 | idle (gilt) + active (giltL); hover = CSS filter warm-up on idle (see open Q2) | desktop only — the phone bar drops the shelf (bottom nav owns the routes) | L3 |
| RT-2 | "Gallery" — same grammar | same canvases | Yes | ≈ 150×48 | idle + active | desktop only | L3 |
| RT-3 | "About" — same grammar | same canvases | Yes | ≈ 120×48 | idle + active | desktop only | L3 |

The barrel warp (WARP_RATIO 0.0105 / FORESHORT 0.94) is applied as a composite transform,
not baked — at these chord lengths the bow is ≤1px and the scaleY is a CSS transform, so
the assets stay flat and reusable. The active tab's gilt underline stays DRAWN (L10) —
a 2px slant-cut gold bar gains nothing from photography (JUDGMENT).

## F. Fletch labels (on the vanes)

| id | purpose | source | alpha? | retina target | states | breakpoints | L |
|----|---------|--------|--------|---------------|--------|-------------|---|
| FL-1 | "Create" — pale parchment-cream lettering riding the blade shoulder; must hold the 6.60:1 floor on its feather ground (measured at composite) | GENERATE-NEW (P8 — one canvas per state, all three words) | Yes | ≈ 130×36 | idle (PARCH-class cream) + active (pale-gold lift); hover = CSS filter | same files both rows/breakpoints; label row translates between states (transform only) | L7 |
| FL-2 | "Library" | same canvases | Yes | ≈ 140×36 | idle + active | as FL-1 | L7 |
| FL-3 | "Realm" | same canvases | Yes | ≈ 110×36 | idle + active | as FL-1 | L7 |

No warp on fletch labels — the named, owner-visible D3 deviation (spec Part 2; decision
row 5) carries into the photo build unchanged: feather surfaces, not barrel; most-read
words; legibility outranks.

## G. Sign In fitting

| id | purpose | source | alpha? | retina target | states | breakpoints | L |
|----|---------|--------|--------|---------------|--------|-------------|---|
| SI-1 | The one mounted metal fitting — small brass plate, engraved "Sign In" dark-on-gold, seated by contact + cast (d 1.4, blur 1.6 @0.45); takes NO warp (object ON the surface) | GENERATE-NEW (P9) | Yes | ≈ 160×56 | one asset; hover = CSS brightness, press = CSS transform (JUDGMENT — a button state needs no second photograph) | both bars (mobile row 1) | L9 |

## H. Derived plates (produced in-pipeline, no AI)

| id | purpose | source | alpha? | retina target | states | breakpoints | L |
|----|---------|--------|--------|---------------|--------|-------------|---|
| SD-1 | Vane cast-shadow plates ×3×2 states — each cutout's silhouette → blur 5 → FLETCH_SHADOW tint, offset d 4.1–5.8 down-barrel (225° negated). Photo cutouts lose their real casts at background removal; the depth table re-supplies them | DERIVED from VN-* alphas (scripted, PIL) | Yes (soft) | match each vane | rest + flight (from the matching silhouette) | scale with vanes | L1 |
| SD-2 | Object casts: seal (d 1.6/1.8 @0.5), tail collars (d 1.2/1.5 @0.35), Sign In (d 1.4/1.6 @0.45) + their AO contacts (no azimuth, per the contact-shadow law) | DERIVED from CT-2/TH-3/SI-1 alphas | Yes (soft) | match each object | one | scale | L1 (under their objects) |
| WD-1 | Bare-wood patch set — 3–4 clean cedar swatches for seam repair, singe-halo grounds, and the strip's mirror-blend extensions | CROP: R2 p4 clean wood around "and word" (x 50–100%, y 48–74%), R6 row-3-right wood (x 50–100%, y 48–74%) | Soft-edge mask | 512×256 each | one | n/a | L2 (patched into strip) |

Burns cast NOTHING (in-surface; the singe halo + incision dark are the depth cues) — no
shadow plates for CT-1 or RT-*; the cartouche frame and letter beds keep the same law.

---

## Counts

- Inventory rows: **21** (SH-1 · VN-C/L/R · TH-1..5 · CT-1/2 · RT-1..3 · FL-1..3 · SI-1 · SD-1/2 · WD-1)
- GENERATE-NEW rows: **12** (SH-1, VN×3, CT-1, RT×3, FL×3, SI-1) — ≈ 10 generation jobs
  after canvas-sharing (RT idle/active = 2 canvases; FL idle/active = 2), +3 cartouche
  candidate variants and 1 contingent seal fallback in the batch plan
- CROP-FROM-REFERENCE rows: **7** (TH-1..5, CT-2, WD-1) — zero generation cost
- DERIVED rows: **2** (SD-1, SD-2)
