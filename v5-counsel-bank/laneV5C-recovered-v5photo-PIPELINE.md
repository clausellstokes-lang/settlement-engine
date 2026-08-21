# V5 PHOTOREAL — EXECUTION PIPELINE (2026-08-04)

The chair's run order. Assets and prompts are in ASSET-INVENTORY.md /
GENERATION-PROMPTS.md beside this file. Every phase ends on a receipt; the owner
glance-cull is the one human gate before compositing begins.

## Phase 0 — Reference crops (zero generation cost; run first)

Cut from the 3584×4800 originals at `/Users/cstokes/Desktop/Settlement Forge template
review/` (windows in the inventory are ±2% — verify visually before cutting):

1. TH-1 lead whipping (R2 p2 or R4 p6) · TH-2 trail whipping (R6 row4-right or R8)
2. TH-3 tail collars ×3 (R8, R3 p6, R2 p6) · TH-4 spiral crossings ×2 (R1 or R7)
3. TH-5 tie-off diagonal (R2 p6)
4. CT-2 seal master (R6 row3-left — the triangle-device seal-in-O)
5. WD-1 wood patches (R2 p4, R6 row3-right clean cedar)

Immediately test CT-2 at 30px/60px: if the triangle impression is legible, P10 is
cancelled before the batch. Note: the refs are 2048-upscales — treat ~2048px as the true
detail ceiling; every Phase-0 target is far below it, so no upscale pass is owed here.

## Phase 1 — Generation batch A (the big canvases)

One `generate_image_batch`: P1 shaft strip · P2/P3/P4 vane pairs (one canvas per lane) ·
P5 cartouche ×3 seed variants (spelling/swash/seal are one-shot risks — cull picks one).
= 7 jobs. `jobs_wait`, then ONE `show_generation_by_ids`. Pass the R2 p3 crop as P5's
reference image if the endpoint takes one.

## Phase 2 — Generation batch B (lettering + fitting + contingency)

One batch: P6 route-labels idle · P7 route-labels active · P8 fletch-labels idle ·
P8-active fletch-labels · P9 Sign In · P10 seal fallback (only if Phase 0 cancelled it,
drop it). = 5–6 jobs. Any misspelled word regenerates ALONE on a WD-1 wood patch ground
in a small follow-up batch — never re-roll a whole canvas for one bad word.

## Phase 3 — THE OWNER GLANCE-CULL (checkpoint; nothing composites before it)

Present per asset, at true size and at 400%:
- SPELLING CENSUS on every lettering asset — letter counts per the prompts' gates;
  the SettlementFoOrge precedent makes this a hard gate, human eyes not OCR.
- Vane attitude vs THE PENDANT LAW: quill visibly along the shaft before any droop;
  rest pose reads vane-at-rest, never charm (R5 is the pinned counter-example).
- Cartouche: pick 1 of 3 variants; check the seal-as-O overlaps its neighbors, the
  triangle reads, the swash S/F land, the frame's cusped ends survive the top crop.
- The 30px seal strike (photo crop or P10): legible or muddy — owner's eyes decide.
- Per-lane tonal stagger across the three vanes (the separation law's material half).
Rejects loop to a targeted retake list (single-asset regenerations, batch C if needed).

## Phase 4 — Background removal + layer extraction

Two DIFFERENT mechanisms — do not swap them:
- OBJECT CUTOUTS (`remove_background`): VN-* poses, CT-2 seal, SI-1 fitting, TH-* crops
  that need cleaner mattes. ⚠ Review every matte at 400% for what the model eats:
  FRAY FIBRES and translucent quill tips on feathers, THREAD TAILS and nubs on
  tie-offs, pin heads on the fitting. A shaved silhouette is a REJECT — re-matte by
  luminance edge refine, or regenerate that lane on mid-grey ground (P2 note).
- BURNED-INK EXTRACTION (scripted, PIL — never remove_background): CT-1 and RT-* split
  into a MULTIPLY layer (char frame/beds + singe halo — divide by the local wood base
  tone; darkening-only, so the strip's real grain survives beneath every halo: the
  darkening-only law carried into the photo build) and a NORMAL alpha layer (gold
  letters + gilt hairline). Scripts live in this scratchpad, not the repo.

## Phase 5 — Upscale + normalization

- `upscale_image` only where a delivered crop lands under ~2× its retina target
  (expected: SH-1 to ≥5760w, CT-1 to 4K pre-split; thread crops are already
  oversampled — do NOT upscale them).
- Curve-match every asset to the hex anchors (#9C5A38 / #7A422A / #3F2013; gold
  #D4AF45; wax #5D1C19-family) — one shared grade so ten generations read as one shoot.
- LIGHT AUDIT: highlights must sit upper-left (estate 225°). Crops from
  differently-lit refs may be mirrored ONLY if flip-safe: thread wraps are; feathers
  are NOT (flipping breaks the mirrored down-left comb lean — re-crop or re-light by
  grade instead).
- SH-1: verify grain runs shaft-wise after crop (the GRAIN_AMP direction proof's
  photo analog); cut SH-1a/b/c breakpoint crops from the ONE master.

## Phase 6 — Encode + budget

- AVIF primary + WebP fallback (`<picture>`), PNG only where alpha gradients band.
- Retina sizes per inventory; strip @2x, small sprites @3x.
- FIRST-PAINT BUDGET: the rest-state critical set (SH-1a, 3 rest vanes, CT-1 layers,
  CT-2 strike, RT idle ×3, FL idle ×3, SI-1, thread sprites) targets ≤ 350KB encoded
  (JUDGMENT — proposed number, vetoable; measured at encode, not assumed). Preload
  ONLY the rest set (`<link rel=preload as=image>` on the LCP-relevant strip +
  cartouche). Flight poses + active lettering fetch on idle
  (requestIdleCallback / first scroll intent) — they are never first-paint.

## Phase 7 — Composite build (how assets flow in)

- LAYER STACK: L0 page → L1 derived shadow plates (SD-1/2: silhouette → blur → tint per
  the spec Part-2 depth table; burns cast nothing) → L2 SH-1 strip → L3 burned ink
  (CT-1/RT multiply layers, then their gold normal layers) → L4 thread-under-blades
  (TH-3 collars, TH-4 spiral crossings) → L5 vanes Create→Library→Realm → L6 whippings
  + TH-5 tie-offs → L7 fletch labels → L8 seal → L9 Sign In → L10 drawn active marks
  (gilt quill-line + slant-cut underline, CSS/SVG — alone paint over thread) → L11
  focus rings (DOM rectangles, R2's generous hit targets, absolute in the sticky
  header, zero layout height).
- BLEND RULES: char/halo layers = multiply (grain survives); thread sprites get the
  strip's cylinder gradient multiplied over them (the WRAP_BARREL contract, with the
  @supports fallback compositing flat-tinted variants); everything else normal.
- WARP: WARP_RATIO 0.0105 arc + FORESHORT 0.94 scaleY applied as transforms on CT-1 and
  RT-* placements; fletch labels flat (the named D3 deviation, unchanged).
- TWO-STATE MACHINE: rest/flight = two stacked <img>/layer sets per vane lane,
  opacity crossfade 240ms ease-out; threshold 40 down / 8 up (hysteresis, never
  per-frame morph); label row moves by transform only; prefers-reduced-motion =
  instant swap; ANCHOR_OFFSET and the layout box identical in both states (hang is
  paint — overflow:visible on the zero-inset box, the V4 law).
- A11Y/TEXT: every lettering image aria-hidden; real <a>/<button> text behind
  (transparent/visually-hidden), COPY_ONLY carries "SettlementForge"; the typed strings
  are the canonical spelling — the drawn-vs-typed equivalence pin becomes "asset
  matches the typed string at the glance-cull census".

## Phase 8 — Verification gates (receipts before "done")

1. SEPARATION PIN on composite screenshots, BOTH states at 1x: ≥1px seam/edge line at
   ≥1.15:1 local contrast at every crossing; every peel-off shows its cut.
2. Gold-on-bed ≥7.50:1 PER GLYPH on delivered RT/CT pixels (PIL sampler, WCAG ratios);
   fletch labels ≥6.60:1 on their composited feather grounds; wax stays red-family
   (H≈3°, never the char or wood tone).
3. BREAKPOINT LAW: 1440 and 390 receipts shot; ⚠ THE 640 RECEIPT REMAINS OWED AT BUILD
   (deliberately — the 640 composition is a design decision this plan does not own;
   assets don't preclude it: the strip master re-crops, everything else transforms).
4. Weight receipt: encoded rest-set bytes vs the 350KB target; LCP unchanged vs the
   drawn mock (measure, don't assert).
5. Byte-scan every file this pipeline writes (zero NULs — the authored-NUL hazard).

## Named risks → mitigations

- **Photo feathers vs the separation law at 1x** — three dark feathers lap into one
  slug. Mitigated in THREE places: prompts stagger the lanes tonally (P2/P3/P4), each
  feather is prompted with a lit leading edge, and the comp keeps thin seam-shadow /
  edge-light strokes at the two crossings; the pin is MEASURED on the composite in
  both states before accept. If a crossing still fails, darken the under-blade's tail
  third (multiply plate), not the whole lane.
- **Seam-matching the shaft strip across breakpoints** — three crops from ONE master
  guarantee one grain; mirror-blend extension seams land under the lead whipping and
  cartouche columns only; grain direction verified in Phase 5. Never source the 640
  strip from a second generation.
- **Asset weight vs the first-paint budget** — AVIF+WebP, rest-set-only preload, flight
  and active variants on idle, @2x caps (no @3x except the two smallest sprites),
  and the 350KB measured gate (Phase 6).
- **Generated-lettering misspells** — hard human census at the glance-cull; per-word
  retakes on WD-1 grounds; typed aria strings stay canonical so a bad asset can never
  silently ship the wrong name.
- **remove_background eating fray/thread tails** — 400% matte review is a gate, not a
  courtesy; parchment/grey grounds chosen per asset for separation; re-matte before
  regenerate, regenerate before accept-shaved.
- **Crossfade identity between rest and flight** — solved at the source: one canvas,
  same feather, two poses (P2–P4). If a pair still mismatches at the cull, the
  fallback is warping the REST cutout into the flight pose in the comp (mesh warp) —
  recorded fallback, not the default, because warped barbs read wrong at macro.
