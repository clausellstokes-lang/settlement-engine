# THE ARCHITECTURE KERNEL — cathedral-grade procedural buildings (Fable, 2026-07-21)
## v2 — CORRECTED after Fable-tier adversarial verification (wf_4326e20d-c29)

Owner order (the walk, CONFIRMED): **EVERY institution** rendered as a DETAILED,
DISTINCTIVE 3D building — the cathedral (real gothic reference: nave, transept, flying
buttresses, traceried windows, spire, statuary) is the stated EXEMPLAR and fidelity BAR;
the mandate covers smithy, mill, keep, guildhall, market, temple, dock, manor, inn,
moot-hall, mage-tower, and every kind, built-in AND custom, each to that bar, each with
per-building DRIFT keyed to the two D&D alignment axes (lawful↔chaos, good↔evil), economic
profile, and terrain/resource. Totality is the contract: the detail walker reds if any
kind lacks a grammar — no generic boxes.

**VERIFICATION STATUS (2026-07-21):** the v1 design was pressure-tested by six Fable-tier
skeptics + a Fable reconciler (all `model: fable`, mandated to REFUTE). Verdict:
**GO-WITH-REVISIONS.** The kernel concept, determinism basis, build-from-scratch ruling,
drift substrate, and no-GPU law SURVIVED six hostile attacks. Four decisions were
corrected (below); one owner decision is now the true gate. This v2 records the
corrections. Do NOT dispatch the old K-1.

═══════════════════════════════════════════════════════════════════
## CORRECTION 1 — MECHANISM: a THREE-RUNG stack, not "shape grammars"
Split grammars provably CANNOT produce curves (Zmugg et al., Visual Computer 2013:
"split grammars as such are unable to handle curved shapes") — and gothic is DEFINED by
curves (pointed arches, rose windows, tracery, the apse/chevet). So the grammar is the
best-in-class SKELETON but NOT the detail mechanism. Restated honestly:
1. STRUCTURE — CGA/split grammar + CGA++ cross-shape events: massing, bay rhythm, façade
   subdivision, buttress-flyer coordination. (Grammar genuinely beat every rival:
   WFC = no global structure + discrete drift; SDF = sharp-edge loss + op-budget blow-up
   + transcendental ban; neuro-symbolic = illegal under AI-never-draws + float inference.)
2. CURVED DETAIL — a Havemann-Fellner-style parametric CONSTRUCTION library (circles +
   lines + booleans under sqrt-only discipline). This is the LOAD-BEARING cathedral-grade
   rung, co-equal with the grammar, NOT a sub-bullet — its op-budget and authoring cost
   DOMINATE the program (K-3 is the real risk center).
3. INSTANCED ASSETS — baked kit pieces for repeated statuary.
   NEW OP the split vocabulary lacks: a RADIAL/n-gon prism scope (apse, round towers) on
   hardcoded rational direction tables (the townMapModel.js:18 integer-table precedent) —
   else curved MASSING has no owner between the box-split layer and the ornament library.

## CORRECTION 2 — DETERMINISM: SOUND, with four build-time guardrails
{+,−,×,÷,√} in JS is byte-reproducible cross-machine (ES2025 makes √ correctly-rounded;
de facto on all earlier engines via IEEE hardware √). The full gothic vocabulary fits IF:
(a) BEZIER-ONLY CURVES — every arc as cubic Béziers in model space; NEVER the SVG arc `A`
command (its x-rotation param needs atan2, a transcendental). (b) n-foil/rose counts whose
cos(2π/n) is NOT in the {+,−,×,÷,√} closure (n=7,9,11… — Gauss-Wantzel) use pinned literal
kappa constants, not runtime trig — the doc's v1 "compass-and-straightedge" framing was
mathematically FALSE for those counts; corrected. (c) projection stays affine-rational.
(d) √ pinned/guarded per the massing.js precedent.

## CORRECTION 3 — RENDER/FIDELITY (the v1 error that mattered most): SVG has a hard ceiling
v1 claimed CPU-projected SVG reaches the reference bar. **FLAWED.** Flat-primitive SVG
(poly/line/circle/rect/path, constant fill, scalar opacity — no gradient/filter/image op)
is flat/cel shading BY CONSTRUCTION: it categorically cannot render the soft shadows,
ambient occlusion, and material texture the owner's reference names. Corrected stack:
- The grammar → rational-JS MESH stays the single source of truth.
- CPU SVG projection is DEMOTED to the STRUCTURAL + PRINT/PLOTTER surface (the engraving
  look), still byte-reproducible and golden-pinnable.
- NEW fidelity surface: a DETERMINISTIC CPU SOFTWARE RASTERIZER over the same mesh —
  scanline/edge-function fill, per-pixel Lambert from the one fixed NW light, baked AO +
  soft-shadow penumbrae from fixed RATIONAL sample tables, integer-hash stone grain, all
  in the massing.js op discipline. Encoded by a pinned in-repo deterministic PNG encoder;
  delivered as the hybrid the draw-op contract already allows: an SVG embedding the raster
  plate as a data: URI with vector linework overlaid. Golden-pinnable bytes, ZERO GPU,
  generation-time cost only, eager budget UNTOUCHED. (three.js remains the optional,
  owner-gated, non-golden interactive viewer only.)

## CORRECTION 4 — DRIFT BINDING: axes are real but DEAD at the render surface as wired
The axes exist and are continuous, but v1 read the wrong field. Fixes:
(a) DEITY term resolves `config.primaryDeitySnapshot ?? latentPantheonOf(settlement).patron`
    — primaryDeitySnapshot is populated for ZERO normally-generated settlements (executed
    probe 0/48; premium-activation-gated), so as v1-wired the chaos/evil poles NEVER fire
    and the law axis spans only 0.52–0.68. The latent-patron fallback is present 48/48 and
    TIER-INVARIANT (activation copies latent verbatim), so it PRESERVES one-golden-per-seed
    and THE PROMISE, and widens the law span to 0.37–0.80. ⚠ OWNER FLAG: it surfaces a
    latent deity's ALIGNMENT (not name) cosmetically to free tiers.
(b) `buildTownMapModel(settlement, mapEdits, conditionVector?)` gains the vector param —
    without it the occupation/war-scar/moralDrift ornament is unreachable from the map
    forever; absent vector ⇒ byte-identical dormancy.
(c) Calibrate grammar-parameter ramps to MEASURED band occupancy (not assumed 0..1); pin
    the band constants with a distribution golden.

## CONFIRMED UNDER ATTACK (survived, stand):
- BUILD-FROM-SCRATCH for the grammar core + gothic ornament — every OSS candidate failed on
  license (CC-BY-SA/no-license/paid EULA), maintenance (dead 2017-2021), fidelity (nothing
  permissive reaches gothic ornament), or the trig-free law. Reuse only offline: three-wfc
  / building_tools to BAKE kits (MIT). The kernel is ours.
- THE NO-GPU / THE PROMISE / FINITE-SEMANTICS laws — all hold: canonical artifact is pure
  CPU (vector OR software-raster), never GPU pixels; AI (if ever used for a custom grammar
  pick) classifies into the finite grammar vocabulary, never draws.

═══════════════════════════════════════════════════════════════════
## CORRECTED SEQUENCING — K-0 spike is the real proof gate (do NOT dispatch old K-1)
v1's K-1 was internally contradictory (its "reference-bar cathedral" needs tracery that
lived in K-3) and front-loaded the two ALREADY-PROVEN properties (determinism + dormancy
shipped with M-0 massing) while deferring all three live risks. Corrected order:
- **K-0 — the grammar-less SPIKE (days, not a wave; THE CHEAPEST FALSIFIER):** hand-code
  in direct JS (no interpreter) ONE traceried gothic window + ONE flying-buttress bay in
  the massing.js purity discipline; push through a minimal projector extension (the
  Bézier DrawOp add); ALSO render a small deterministic RASTER swatch of the same fragment
  (flat Lambert + hard shadow + hash grain; AO deferred). GATES: (a) tracery-without-trig
  proven executable; (b) hidden-surface — does dy-sort survive buttress cyclic overlap or
  is Newell/rational-BSP needed, byte-stable under ties; (c) measured ops + SVG bytes vs
  OP_CEILING extrapolated → the per-building LOD law BEFORE any wave; (d) **THE FORK
  EXHIBIT** — both plates (engraving-vector and render-raster) in front of the OWNER with
  the question "WHICH BAR GOVERNS?" The owner's answer decides whether the rasterizer
  stage exists, before one grammar is authored.
- K-1 grammar interpreter + projector, spec'd against K-0-measured reality.
- K-3 ornament sublibrary + the K-4 PARAMETER CONTRACT frozen (the condition-vector surface
  every grammar must expose).
- K-2 the per-institution kit LAST (the totality-contracted expensive wave, written once
  against the frozen op vocabulary + parameter surface).
- K-4 full drift binding + goldens. K-5 optional viewer (owner-gated).

## OWNER-QUEUE (the true gates, before any build):
1. ⭐ THE FIDELITY-BAR FORK — engraving-vector look vs render-raster look. This single
   answer decides whether the software-rasterizer stage exists and roughly doubles-or-not
   the render scope. Surfaced by K-0's fork exhibit; the owner picks from real plates.
2. LATENT-ALIGNMENT COSMETIC SURFACING — the drift fix (a) shows a latent deity's alignment
   cosmetically to free tiers; owner ok/veto.
3. GO on K-0 itself (days-long spike; the only thing that needs authorizing to start).

## HONEST SIZING
Largest single build discussed; a research-backed kernel, not a lane. M-0 massing ships as
the FLOOR now (folded). The v1 design had four real flaws — mechanism mis-naming, an SVG
fidelity ceiling, a dead drift field, and a non-decisive proof wave — ALL caught by
Fable-tier verification before a line of code, which is precisely why the owner ordered
research at the Fable tier. Recommendation: authorize K-0 (the spike + the fork exhibit);
its four gates + the owner's fidelity-fork answer de-risk the entire kernel for the cost of
days, before K-1 grammar work begins.
