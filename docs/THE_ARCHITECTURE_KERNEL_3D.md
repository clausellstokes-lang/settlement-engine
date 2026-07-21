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

## CORRECTION 3 — RENDER/FIDELITY: SVG has a hard ceiling → NO-COMPROMISE decision
v1 claimed CPU-projected SVG reaches the reference bar. **FLAWED.** Flat-primitive SVG
(poly/line/circle/rect/path, constant fill, scalar opacity — no gradient/filter/image op)
is flat/cel shading BY CONSTRUCTION: it categorically cannot render the soft shadows,
ambient occlusion, and material texture the owner's reference names.

**OWNER RULING (2026-07-21): NO COMPROMISE — the highest ceiling.** SVG-as-fidelity is
REJECTED (it caps fidelity; the rule forbids the cap). The corrected stack targets the
maximum reachable ceiling on TWO surfaces at once:
- The grammar → rational-JS MESH is the single source of truth. THE PROMISE binds HERE:
  the mesh (geometry, placement, alignment-driven detail params) is byte-deterministic and
  golden-pinned. This is "the world."
- **CANONICAL PLATE = a DETERMINISTIC OFFLINE CPU RENDERER at maximum fidelity.** Key
  insight that makes "highest ceiling" and "byte-reproducible" NOT a tradeoff: film-quality
  rendering is CPU/OFFLINE (RenderMan, path tracers) — the GPU's edge is SPEED, not
  CEILING, and the canonical plate is generated ONCE (no real-time budget), so a CPU
  renderer's fidelity is capped only by authoring effort, not the medium. It can do
  per-pixel shading, ambient occlusion, soft-shadow penumbrae, material texture, and up to
  path-traced global illumination. Determinism is preserved by keeping ALL math in the
  byte-exact set — transcendentals (BRDF pow/exp, sin/cos) resolved through PINNED RATIONAL
  LOOKUP TABLES (as fine as needed), never runtime Math.sin/exp (ECMA-262 impl-varying).
  Encoded by a pinned in-repo deterministic PNG encoder; delivered as SVG embedding the
  raster plate as a data: URI with vector linework overlaid. Byte-reproducible,
  golden-pinnable, ZERO GPU, generation-time only, eager budget UNTOUCHED. THE PROMISE
  stays LITERAL.
- **INTERACTIVE VIEWER = the absolute-highest LIVE ceiling (GPU/WebGL/PBR), opt-in,
  non-golden.** Same seed → same mesh → same world; the live view's pixels are
  device-dependent, which is fine because it is a VIEW of the identical world, not the
  canonical truth (two cameras photographing one statue). Lazy-chunked per the react-pdf
  vendor precedent, zero eager bytes.
- SVG-only vector survives as a SECONDARY print/plotter/line-art export, never the ceiling.

⚠ THE ONE CONSTITUTIONAL FORK I WILL NOT DECIDE ALONE (owner-queue #1, below): the
deterministic CPU renderer reaches the reference bar ONLY if tabulated lighting hits the
needed precision. K-0's spike renders it so you SEE the real ceiling of the
PROMISE-keeping path. IF it reaches the reference → no tension, ship it. IF it provably
cannot → the No-Compromise rule and THE PROMISE genuinely collide (GPU render as canonical
would go higher but breaks byte-determinism), and THAT trade is a conscious constitutional
call only the owner makes — THE PROMISE is ratified "never re-litigate," so I surface it
with the spike's evidence rather than silently break it.

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
  Bézier DrawOp add); ALSO render a MAX-FIDELITY deterministic CPU raster swatch of the same
  fragment — NOT a flat-Lambert placeholder but the real ceiling of the PROMISE-keeping
  path: per-pixel shading + soft-shadow penumbra + ambient occlusion + material texture via
  pinned rational tables, so the owner judges the ACTUAL deterministic ceiling against the
  reference. GATES: (a) tracery-without-trig proven executable; (b) hidden-surface — does
  dy-sort survive buttress cyclic overlap or is Newell/rational-BSP needed, byte-stable
  under ties; (c) measured ops + bytes vs OP_CEILING extrapolated → the per-building LOD law
  BEFORE any wave; (d) **THE CEILING EXHIBIT** — the deterministic max-fidelity raster plate
  beside the owner's reference image, answering the only question left: does the
  PROMISE-keeping renderer MEET the bar (ship it, no tension) or NOT (surface the
  GPU-vs-PROMISE constitutional fork with evidence). The engraving-vector plate ships too as
  the print/line-art comparison, but per the No-Compromise ruling it is NOT a fidelity
  candidate.
- K-1 grammar interpreter + projector, spec'd against K-0-measured reality.
- K-3 ornament sublibrary + the K-4 PARAMETER CONTRACT frozen (the condition-vector surface
  every grammar must expose).
- K-2 the per-institution kit LAST (the totality-contracted expensive wave, written once
  against the frozen op vocabulary + parameter surface).
- K-4 full drift binding + goldens. K-5 optional viewer (owner-gated).

## OWNER-QUEUE (the true gates, before any build):
1. ⭐⭐ THE PROMISE-vs-CEILING FORK (RESOLVED to highest-ceiling by the No-Compromise
   ruling, pending K-0 evidence): the canonical render is the deterministic max-fidelity
   CPU renderer (keeps THE PROMISE literal) at the highest tier it can reach. K-0 shows
   whether that tier meets the reference bar. ONLY IF it provably cannot does a second
   owner decision arise — consciously relaxing THE PROMISE's byte-guarantee for the
   canonical image to allow GPU rendering as canonical. Surfaced with spike evidence; never
   decided unilaterally (THE PROMISE is constitutional). The GPU INTERACTIVE VIEWER ships
   regardless as the highest live ceiling (non-canonical).
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
