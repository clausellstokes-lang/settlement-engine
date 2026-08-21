# V5 PHOTOREAL — GENERATION PROMPTS (2026-08-04)

Written in the owner's own Prompt-1 style: named prompt, a parenthetical on the crop
strategy (cropping is still more reliable than prompting the cut), photoreal macro
photography language, the exact hex ladder, ONE warm directional light. Shared canon
clauses appear once here and are implied in every prompt below.

## The shared canon (append to every prompt)

> Photoreal macro photography, professional product shot, razor sharp, natural fibre and
> wood-grain detail. The wood is turned aromatic cedar in exactly this ladder: lit face
> #9C5A38, mid body #7A422A, deepest shadow and char #3F2013. One warm directional
> sunlight from the UPPER LEFT, soft true shadows falling down-and-right, gentle contact
> shadows where anything meets the wood. Feathers are greylag-goose: warm grey-brown with
> bold darker barring bands. Thread is oxblood-burgundy waxed silk. Ground is warm
> blank parchment, evenly lit, nothing else in frame. The shaft is DEAD STRAIGHT —
> no bend, no arc. No text anywhere except where the prompt names it, spelled exactly
> as given.

⚠ Light direction is the ESTATE's (upper-left, PLATE_LIGHT_DEG 225), NOT the scroll
shot's upper-right — the scroll shot canonizes shadow RATIOS only (spec Part 2).
⚠ Aspect: request the widest landscape the generator offers (21:9 preferred, 16:9
acceptable); portrait only where noted. Upscale targets assume `upscale_image` to 2K/4K
before cropping.

---

## P1 — The shaft strip master (asset SH-1)

**Prompt 1 — the bare half-barrel (the whole shaft wall-to-wall; we crop the bottom half
afterward — cropping is still more reliable than prompting the cut):**

> A single straight cylindrical cedar arrow shaft lying perfectly horizontal, spanning
> the ENTIRE frame edge to edge, both ends cut off by the frame, photographed dead-on
> from the side at close range so the shaft fills the middle third of the frame's
> height. Bare polished wood only: no fletching, no feathers, no thread, no lettering,
> no metal. Fine straight grain running along the shaft's length, subtle growth-line
> striping, the lit crest along the upper face falling smoothly to a deep shadowed
> lower edge. Warm parchment behind.

- Aspect: widest available (21:9). Upscale to ≥5760px wide.
- Crop: from the barrel's horizontal CENTERLINE down to the lower silhouette edge — that
  band IS the header strip (axis lands on the viewport top edge by construction). Keep
  the full-height master too (hero/About surfaces may want the upper half later).
- If upscaled width < 5760: extend by mirror-blend, seams placed under the lead whipping
  and cartouche columns (INVENTORY SH-1 note).
- remove_background: NOT USED (opaque band). Grade: curve-match the three hex anchors.

## P2 / P3 / P4 — The vane pairs (assets VN-C, VN-L, VN-R)

**Prompt 2 — the Create feather, twice (one feather, two attitudes on one sheet, so the
crossfade pair keeps one identity; we crop the two poses apart afterward):**

> The SAME single greylag-goose flight feather photographed twice on one parchment
> sheet, arranged one above the other with clear space between, identical barring in
> both. TOP POSE: the feather pressed flat and streamlined along the underside of a
> straight horizontal cedar shaft, hugging the wood, tip trailing right. BOTTOM POSE:
> the same feather with its bare quill lying along the shaft's underside, the soft body
> sagging gently below in a shallow relaxed curve, and the tapered tip sweeping back UP
> to touch the wood again — an aerodynamic vane at rest, NOT a hanging charm. The quill
> visibly runs along the wood before any droop. No thread, no bindings, no wrapping
> anywhere. Slender blade proportions, length about five times the depth, rounded
> tapered tip, a few loose fray fibres at the lower edge.

- P3 (Library): same prompt, "the largest and palest of the three — broad pale
  grey-cream body, the barring soft and wide"; deepest sag of the set.
- P4 (Realm): same prompt, "the darkest and warmest of the three — deep smoky
  grey-brown, narrow crisp barring"; shortest of the set.
- ⚠ The three lanes are prompted a tonal step apart ON PURPOSE — the separation law's
  per-lane value stagger arrives in the material, not just the comp.
- Aspect: 16:9 or 3:2 landscape per canvas, one canvas per lane (3 jobs).
- Crop: the two poses apart; each becomes the lane's flight (top) and rest (bottom) cut.
- remove_background MUST PRESERVE: the fray fibres at the lower cut, the translucent
  quill tip, the soft barb edges — review every matte at 400%; re-matte by hand
  (luminance edge refine) before accepting a shaved silhouette. The parchment ground is
  chosen for this separation; if a matte still eats fray, regenerate that lane on a
  mid-grey ground (R4's grey ground demonstrably separates pale feathers cleanly).
- Upscale only if the cropped pose lands under ~2× its retina target.

## P5 — The cartouche band (asset CT-1)

**Prompt 5 — the burned-frame cartouche (generated CLOSED like the canon; we crop
through the frame's top run afterward so the arms die into the viewport cut):**

> A wide elegant cartouche burned into the flat lit face of a cedar shaft: a thin
> scorched char frame line with softly cusped bracket ends, drawn as one closed outline
> with a shallow decorative dip at the center of its bottom rule, a hair-thin gold
> inlay line tracing just inside the char. Inside, the single word "SettlementForge"
> in engraved antique cartographer's roman capitals-and-lowercase, the S and the F with
> restrained swash flourishes, every letter a crisp char-edged incision filled with
> burnished gold leaf, in exactly this gold: #D4AF45. The O of "Forge" is NOT a letter:
> in its place sits an oversized dark-red wax seal, solid oxblood wax (#5D1C19 family),
> slightly overlapping the F beside it and the r after it, with a small plain TRIANGLE
> pressed deep into the wax as its only device, the impression's lip dark toward the
> light. Faint singe halo feathering into the grain around every burn. The lettering
> band occupies most of the frame's width.

- Reference-conditioning: pass the R2 p3 crop (x 0–50%, y 48–74%) as the style/reference
  image if the endpoint accepts one — it is the owner-curated canon for this asset.
- Aspect: widest available; the band must land ≈7:1 after crop — prompt at 21:9 and
  letter-space generously. Batch THREE seed variants for the cull (spelling +
  swash quality + seal legibility are all one-shot risks).
- Crop: through the frame's TOP RULE (removes it; the arms then hit the crop edge and
  die into the viewport cut — F4's geometry by construction); foot lands at y≈31/38 of
  the band. Sub-crops kept: letters-only, frame-only, seal-only.
- Layer split (pipeline, not the generator): char frame + beds + halo extracted as a
  MULTIPLY layer (darkening-only — the strip's grain survives beneath the halo);
  gold letters + hairline as a NORMAL alpha layer.
- ⚠ SPELLING GATE: "SettlementForge" exactly — one capital S, one capital F, the seal AS
  the O, no second O, no doubled letters (the SettlementFoOrge precedent is real, and
  R1/R2/R6 all render the wordmark with the seal-as-O so the model has form). Letter
  census at the cull: 15 glyph slots, seal in slot 10 of "Forge"'s O position.
- Upscale to 4K before the layer split; deliver 560×76 + sub-crops.

## P6 / P7 — The burned route labels (assets RT-1..3)

**Prompt 6 — burns and words, gilded (all three words on one barrel so the material
matches; we crop per word afterward):**

> Three separate words branded into the lit face of a straight cedar shaft, spaced far
> apart in one straight line along the grain: "Compendium" then "Gallery" then
> "About". Each word in small engraved antique roman letterforms, every glyph a crisp
> branded incision with a charred bed and a faint singe halo feathering into the
> grain, the incision floor filled with burnished gold leaf in exactly #D4AF45. The
> char bed shows as a fine dark ring around every gold letter. Nothing else on the
> wood.

- P7 (the active set): identical, with the gold one step lighter and brighter —
  "pale bright burnished gold leaf, #E9CD70 family" (JUDGMENT: #E9CD70 approximates the
  estate GILT_LIGHT token; the build binds the final grade to the real token — flagged,
  vetoable).
- Aspect: 21:9. Two jobs (idle canvas, active canvas).
- Crop: per word with the full singe halo included (halo pad ≥ 8px source).
- Layer split: same multiply/normal split as CT-1 — char+halo multiply, gold normal.
- ⚠ SPELLING GATE per word: "Compendium" (10), "Gallery" (7), "About" (5) — letter
  census at the cull; a single bad word regenerates ALONE on a wood patch (WD-1 grounds
  the retake so the material still matches).
- Contrast gate (the §1d fork survives the photo build): gold core vs its own char bed
  ≥ 7.50:1 PER GLYPH, measured on the delivered pixels with the PIL sampler; the bed,
  not the wood, carries the claim.

## P8 — The fletch labels (assets FL-1..3)

**Prompt 8 — the three names on the feathers (one canvas per state; we crop per word):**

> Three short words hand-lettered in opaque cream-white pigment, painted small and
> crisp on the dark smoky vane of a grey goose feather, one word per feather section,
> spaced far apart: "Create" then "Library" then "Realm". Antique roman letterforms,
> slightly raised paint sitting ON the barbs, the barb texture faintly visible through
> the strokes' edges. The feather ground is deep smoky grey-brown.

- Second canvas (active set): "warm pale-gold pigment, #E9CD70 family" — same layout.
- Aspect: 21:9. Two jobs.
- Crop: per word, generous pad; delivered as alpha ink-layers (the paint only — the
  feather ground stays the live vane beneath).
- Contrast gate: ≥ 6.60:1 against the composited vane ground (the PARCH-on-ladder floor,
  measured on the COMPOSITE since the ground is the real feather); if a lane's feather
  runs too pale under its label (Library is the pale lane), the label sits in that
  blade's darkest third — placement note for the comp, not a new asset.
- ⚠ SPELLING GATE: "Create" (6), "Library" (7), "Realm" (5).

## P9 — The Sign In fitting (asset SI-1)

**Prompt 9 — the one mounted metal fitting (shot on parchment for the cutout):**

> A small rectangular brass plate fitting with softly cusped corners and two tiny
> brass mounting pins, lying flat on warm parchment. The face is polished burnished
> gold-brass, engraved with the words "Sign In" in small dark antique roman capitals,
> the engraving filled with near-black patina. A soft true shadow falls down-and-right.

- Aspect: 3:2 or 1:1. One job.
- Crop: tight with shadow EXCLUDED (SD-2 re-derives the cast at composite so it obeys
  the depth table); remove_background preserves the pin heads and the plate's crisp
  edge highlights.
- ⚠ SPELLING GATE: "Sign In" — two words, capital S, capital I.

## P10 — The seal fallback (asset CT-2, CONTINGENT — only if the R6 crop culls muddy at 30px)

**Prompt 10 — the simplified strike (one seal, shot straight on):**

> A single dark-red sealing-wax medallion on warm parchment, solid oxblood wax
> (#5D1C19 family) with a naturally irregular squeezed rim, pressed with a plain bold
> TRIANGLE as its only device — a deep clean impression, the lip dark toward the
> upper-left light, the floor of the impression slightly darker than the surrounding
> wax. No lettering, no other ornament. Macro, straight on.

- Aspect: 1:1. One job, batched with P6–P9 so the contingency costs no extra round-trip;
  discarded unused if the R6 crop reads at 30px.
- Crop/deliver: 96px master → 90/80/32 rungs per INVENTORY CT-2.
- The rung question is owner-signed (spec open question 2 answered from pixels for the
  drawn strike); the PHOTO strike at 30px gets the same judged-from-pixels treatment at
  the glance-cull.
