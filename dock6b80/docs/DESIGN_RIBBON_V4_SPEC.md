# RIBBON V4 — THE WAR ARROW REPAINT (consultation spec, two parts, chair-accepted)

OWNER DIRECTIVES BOUND: (1) the WORDMARK ITSELF is the mounted/gilded artifact (no plate) with the seal-o, artistic medieval; (2) vane slant MIRRORED on x, EVERY border parallel incl. the band's two outer ends; (3) edges lightly frayed toward real feathers; (4) the active indicator moves to the TOP (the quill line); (5) shaft wood goes red/dark-brown (cedar/mahogany war shaft), feather base = the bottom-border dark ink family; PLUS: shapes locked, MAXIMUM PHOTOREALISM THROUGH TEXTURE AND DETAIL (splits, barb flow, grain, thread-true whipping).

## PART 1 — structure + color (verbatim from the design consultation)

### (a) The gilded wordmark
Three layers, drawn (aria-hidden) wordmark only:
1. THE BOLE BED — Armenian-bole dark red-brown field behind the full wordmark run: scorched/branded-in patch of shaft, edge irregularity via fixed-seed turbulence, color-interpolation-filters="sRGB". It is the gilding's contrast bed: the bar's lit sheen tops near L 0.15 and NO plausible gold clears 4.5:1 there. The bole's opaque core extends 3px past the wordmark's measured ink extents; NEW PIN (HEADER_RIDERS-style): bole ⊇ ink+3px, every core pixel ≤ L 0.06.
2. THE LEAF — gold-FILLED letters (fill carries contrast). One vertical two-stop gradient GILT_LIGHT #E6CB6F → GILT #D4AF45, one upper-left light. EVERY stop L ≥ 0.44 (≥4.8:1 on the bole). Modelling lives in keyline + bole, never a dark gold stop.
3. THE KEYLINE — 0.75px near-black outline (PLATE_KEYLINE #241B0C) per glyph; character only, zero contrast claim; NO bevel/emboss at 20px x-height.
THE PLATE RETIRES from the header entirely; the Device survives as favicon/PDF assets. THE SEAL-O BECOMES A GILDED LETTER WHOSE BOWL HOLDS THE WAX: a gold annulus (same GILT ladder) is the o's stroke, SEAL_WAX fills between ring and counter, the counter stays a true hole. Mandatory for legibility (bare wax on dark wood ~1.8:1); ⚠️ OWNER-VETO CANDIDATE — fallback = wax on a gold foil rosette.

### (b) The color system
SHAFT (cedar/mahogany, cylinder model kept, ~2.7:1 range): SHEEN #9C5A38, SHAFT #83492C, BODY #7A422A (L≈0.082), EDGE #5E3220, RIM #3F2013.
FEATHER ladder (bottom-border ink family): LEAD #453D31, VANE #332C22, TIP #211C15, SHEEN #4E4537, SHEEN_LIFT #5A5040.
Arithmetic: PARCH_100 (L 0.826) on BODY = 6.6:1 ✓; on SHEEN_LIFT = 6.6:1 ✓; GILT on bole ≥ 4.8:1 ✓. EVERY dark-ink rider FLIPS REGISTER to parchment (reference tabs, Sign In, account chips — chips need pale retones).
TWO PAIRINGS THAT CANNOT CLEAR: (1) THE MID-RUSSET DEAD BAND — any wood body L between ~0.145 and ~0.252 fails BOTH registers; COMMIT TO L ≤ 0.13 (the single most important DON'T: do not ship the middle of the wood range). (2) vane-vs-wood ~1.7:1 — re-scope that 1.4.11 pin: identification carried by the 6.6:1 labels + the gold indicator; silhouette reads via sheen, hang (lower half sits on the ~11:1 parchment page), edge-light.
WRAPS deepen to oxblood #521F12 / gloss #7E3A24. Chroma stays rationed: low-chroma earth wood; saturation is the seal's alone; gold is metal.
PIN POLARITY FLIPS: riderFloorTone takes each rider's darkest ground; gold/parchment riders fail toward the LIGHTEST composited tone under their ink — the derivation pin needs a per-rider polarity field or it goes vacuously green.

### (c) The band geometry
Mirror the lean: edges run (x0,0)→(x0−RUN,BAND). SEAT's sign flips with it. Under upper-left light the mirrored exposed leading rims genuinely face the light (the 0.50→0.62 compensation can relax); keep the contact/cast shadow split. Drop the FRAME's squared ends: Create's left and Realm's right edges become TRUE PARALLELS — four identical slashes ascending into Realm. Outer ends resolve at the quill line: each wrap aligns to the quill-line corner, its thread painting over the corner 2–3px (existing zIndex 1); below the bar the slash hangs free over the page. Wood beyond the outermost slash is shaft, not a gap.
FRAY: overshooting barb ENDS — hairs 1–3px, spacing ~1.2 comb gaps, deviating ≤4° from the lean, 0.4px at 0.3 opacity, unitHash-driven, EXPOSED edges only (leading rims, two outer ends, bottom); lapped-under edges show none.
INDICATOR: THE QUILL LINE — a gold bar y 0..2.5 spanning the active lane between its lap boundaries, ends slant-cut at the lean, ~0.5px of sheen visible above (reads ON the shaft, not browser chrome). MUST use GILT_LIGHT (L ≥ 0.58): house GOLD measures 2.2:1 against the sheen zone; the bright leaf clears 3:1 — one gold family for gilding and indicator.
⚠️ CUMULATIVE-AUDIT ADDENDUM (owner directive trace, 2026-08-04): THE OLD BOTTOM GOLD UNDERLINE IS RETIRED — the quill line REPLACES it, never joins it; a pin asserts NO active-state paint exists below the vane (the owner's "move it to the top" means moved, not duplicated). The fletch labels KEEP their semibold 600 (the owner's "bolded font, balanced" directive) — pin the weight through the repaint. The brightened-cell half of the active grammar survives alongside the quill line.

### (d) Risks
Pin-polarity flip; the gilded-seal semantic shift (owner-veto; fallback rosette); wrap invisibility on same-hue wood (hence oxblood); mobile bar re-measures HEADER_RIDERS on its own height.

## PART 2 — photorealism through texture (verbatim)

### 1. Feather anatomy
SPLITS: two per cell, exposed edges only (lower cut; leading rim), unitHash-placed, never a lapped-under edge. Filled sliver polygon (4 points, authored) along the barb direction: mouth 1.6–2.2px, tapering to zero over 35–60% of vane depth. Two strokes: seam in TIP #211C15 (sliver fill, 0.55 opacity) + one 0.4px lit hairline #6A5F4E offset 0.5px upper-left, RETINA-ONLY. A third hairline-only split per cell exists solely for 2x. Splits re-roll deterministically (bounded hash walk) if the sliver would enter a label calm zone.
BARB FLOW: barbs are single quadratics sharing ONE bow: (x,0)→(x−RUN,BAND), control (x−0.28·RUN, 0.62·BAND) — steeper off the rachis, flattening toward the cut, sagitta ~4 units (≈5% depth, ~3.5px). ONE-CURVE LAW: every barb, both split slivers' axes, and the sheen bands' side edges use these two fractions; per-lane variation confined to spacing and brightness. The 5% cap keeps barb-vs-edge divergence under ~12° so the straight slashes still read combed. CELL EDGES STAY DEAD STRAIGHT — shapes locked.
SHEEN: three per-lane bands keep hashed positions/widths; side edges take the bow; each band's leading edge gains a 1px brighter margin at SHEEN tone. No tone above SHEEN_LIFT anywhere — the 6.6:1 label floor untouched.

### 2. Wood (all darkening-direction only; pale latewood streaks BANNED — they walk toward the dead band)
GROWTH LINES (1x tone-structure): second turbulence pass, seed 11, baseFrequency 0.004 0.55, matrix-thresholded to 2–3 broad wavering streaks per 320px tile, RIM-tone wash ≤9% alpha.
EXISTING GRAIN (seed 7) retoned to EDGE-tone wash; GRAIN_AMP re-derived against the parchment register (ground may not rise above L 0.1447; darkening is free).
PORE FLECKING (retina-only): seed 13, baseFrequency 0.35 0.08 (flecks elongated along the shaft), ~4% coverage at 6% alpha. 1x integrates matte; 2x resolves as pores.

### 3. Whipping (thread-true)
At this bar the shaft reads ~9.5mm → silk ≈ 2.6px/turn — four turns per 10px wrap. Replace TURNS with a 2.6px-period 90° repeating gradient: 0.4px WRAP_EDGE #2E0F08 inter-turn shadow, 1.2px WRAP #521F12 body, 1.0px WRAP_GLOSS #7E3A24 satin crest on the light (left) side of each turn; the vertical barrel gradient (retoned oxblood) multiplies over it — both cylinders share the light.
TIE-OFF: one authored diagonal pass per wrap at the band's lean — 2.6px WRAP_GLOSS stroke at 0.5 opacity bordered by 0.4px WRAP_EDGE hairlines, crossing the lower third (lead) / upper third (trail), hash-jittered ±2px, ending in a 1.5px clipped nub. Reads "wound and locked" at 1x, thread at 2x. No label rides a wrap; no contrast claim.

### 4. Thresholds + calm zones
TONE-STRUCTURE AT 1x (≥1.2px or areal tone): vane gradient, bowed sheen, quills, split seams, growth lines, winding turns, tie-off, bole, gilt fill, indicator.
RETINA-ONLY (≤0.6px, each <2% effective ink so 1x integrates as tone — the corrugated-metal law inverted): comb, fray, split lit-hairlines, pore flecks, inter-turn shadows.
CALM ZONES for the composited-AA pin (label ink extent +6px x / +3px y): no split slivers; no tone lighter than SHEEN_LIFT ever; darkening layers permitted. The wordmark's calm zone is the bole core (opaque, pinned ≤ L 0.06, painted OVER all wood texture — wood layers excluded by construction).

### 5. Layer order + cost
BAR: base → cylinder → grain(7) → growth(11) → flecks(13) → bole(17, edge-displaced) → keyline → gilt → seal collet.
LANE: quad fill → sheen → split slivers → split hairlines → comb (masked) → rachis → indicator → fray/edge-light outside the clip.
All turbulence fixed-seed, sRGB declared; all placement unitHash; the bow is two shared constants (no trig). Added nodes ~9 (splits) + 2 (tie-offs); turbulence layers single rects; everything static, no filters on ancestors — one raster, cached for the sticky header's lifetime.
