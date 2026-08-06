---
name: ""
metadata: 
  node_type: memory
  type: project
  date: 2026-07-21
  title: "K-0 architecture spike shipped (deterministic gothic ceiling, dormant leaf)"
  branch: claude/k0-architecture-spike
  commit: 30aadb61
  base: 305889b8 (claude/composite-r4)
  worktree: .claude/worktrees/vision-c
  tags: 
    - architecture-kernel
    - townMap
    - 3d
    - determinism
    - gothic
    - k0
    - dormant-leaf
    - cpu-raster
  originSessionId: 230c87b4-b237-4d1b-a63e-af48dfb233a0
  modified: 2026-07-21T21:51:39.124Z
---

# K-0 ARCHITECTURE SPIKE — the deterministic gothic ceiling

The cheapest-falsifier proof for docs/THE_ARCHITECTURE_KERNEL_3D.md. Grammar-LESS: hand-coded
geometry + a max-fidelity deterministic CPU renderer under **src/domain/townMap/arch/** (8 pure
leaves: rationalTables, geom, png, gothicWindow, flyingButtress, project, raster, spike),
imported by NOTHING shipped. Driver: `scripts/generate-k0-spike.mjs --check`. Tests:
`tests/architecture/k0{GeometryTracery,Projector,Determinism}.test.js` (19). Exhibit:
`public/landing-maps/k0-exhibit/{k0-cathedral.plate.png, k0-cathedral.engraving.svg, index.html}`.

## The four gate answers (all PROVEN, executed)
- **(a) tracery WITHOUT trig** — YES. Pointed arches / trefoils / enclosing gable are
  constructible in the {sqrt2, sqrt3} closure (KAPPA, ARC60_HANDLE = 4/3*(2-sqrt3)). The oculus
  is a deliberate SEPTFOIL (7 lobes): 7 is non-constructible (Gauss-Wantzel), so its ring is a
  PINNED literal `HEPTA_DIRS` (cos/sin*1e4). Zero Math.cos/sin/pow; every curve a cubic Bezier,
  never arc `A`. The transcendental-math ratchet holds all arch/ files at 0 sites.
- **(b) hidden surface byte-stable** — YES, via `sortRenderables`: dy-sort with a (depth,
  id-codepoint) tiebreak, permutation-invariant (pinned). The fragment has NO cyclic overlap
  (pier/flyer strictly in front of wall), so a Newell/rational-BSP split was NOT needed — recorded.
- **(c) LOD** — ~33 vector draw-ops for the fragment (1 window + 1 buttress bay). One fully-
  traceried cathedral extrapolates to ~500 ops = ~25% of the whole-town OP_CEILING (2200,
  tests/design/townMapOpBudget.test.js) ALONE. Verdict: a per-building LOD ladder is mandatory
  (full tracery for signatures, massing silhouettes for commons, glyphs for distant fill).
- **(d) the ceiling plate** — a pure-CPU raster: per-pixel Lambert (fixed light), rounded-relief
  tracery (tube-normal from distance-to-medial-axis), ambient occlusion (glass recess + ground
  contact), a soft cast shadow (flyer projected onto the wall, penumbra ramp), procedural ashlar
  stone (running-bond coursing + integer-hash grain + weathering), tone-mapped through the pinned
  TONE_LUT, encoded by an in-repo deterministic PNG encoder. **Double run = byte-identical PNG+SVG
  (cmp-clean).** HONEST fidelity read (verified by viewing the plate via Read): reads clearly as a
  detailed gothic window fragment — shading present, AO visible, stone texture reads, tracery crisp,
  septfoil rose legible, buttress a 3D mass. NOT photoreal (no global illumination, simple massing,
  slightly cel-flat in flat stone). Leans toward "the PROMISE-keeping path CAN reach a high bar";
  the owner's eye vs the actual reference image is the remaining call (the constitutional fork).

## Hazards / mechanisms a successor MUST know
- **DORMANCY proven**: arch/ imported by nothing shipped; ABSENT from every dist chunk (grep for
  HEPTA_DIRS/renderPlate etc = 0); entry closure = **1,039,995 raw B / 7 files** on base 305889b8,
  Δ=0 (I touched no shipped file — all additions are new files). NOTE: the ledger's "1,039,977" is
  for bff01718; base moved +~18 B via the M-0 fold — that is base drift, not this spike.
- **Transcendental ratchet is absolute** (tests/lint/transcendentalMathBaseline.test.js): a NEW
  src/domain file gets baseline 0 and `current.files` must EQUAL `baseline.files`. Any Math.pow/
  sin/cos/exp/log or `**` fails. Use only {+,-,*,/} + Math.sqrt/round/min/max/abs/floor/imul; put
  non-constructible constants in PINNED literal tables; kappa/tan15 via Math.sqrt is fine (spec-exact).
- **domain-strict tsc gotchas** (baseline is empty {total:0}): a JSDoc `@type` must sit DIRECTLY
  above the `export const` — an intervening `const` steals the annotation (LIGHT_MODEL bug). And
  inner `Object.freeze([a,b])` on a tuple literal breaks tuple inference (readonly number[] !=
  [number,number]) — freeze the OUTER array only and let the `@type` contextually type the tuples.
- **Rasterizer works in SUPERSAMPLED space** (W*ss): all command geometry is in OUTPUT space, so
  EVERY ring/line must be scaled by ss inside renderPlate — else content lands in the top-left
  1/ss quadrant (the bug that cost a debug cycle). halfWidth/penumbra/groundY are pre-scaled by ss.
- **Facade light is FRONT-upper-left, not the map's NW top-down light.** LIGHT_MODEL = (-0.42, +0.50,
  +0.76): west lit, east shaded, +y (viewer side) so the elevation is lit not backlit, and a member
  in front casts its shadow BACK onto the wall. Using the map's -y NW light backlit the facade and
  cast the flyer shadow off-frame.
- **PNG encoder is DEFLATE-stored (uncompressed)** → 1.5 MB for 720^2 RGB. Deterministic by
  construction (no compression search). A fixed-Huffman deflate would cut ~5-10x if repo size matters.

## The kernel program context
This de-risks OWNER-QUEUE #1 (the PROMISE-vs-CEILING fork) with real pixels. Next per the doc:
K-1 grammar interpreter + projector (spec'd against these measured realities), then K-3 ornament
sublibrary + the K-4 parameter contract, then K-2 the per-institution kit, then K-4 drift + goldens.
The arch/ projector (bezier draw-op + sort) and the raster are throwaway PROOF, not the shipped K-1.
