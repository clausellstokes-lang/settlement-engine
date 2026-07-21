# THE ARCHITECTURE KERNEL — cathedral-grade procedural buildings (research-backed, Fable, 2026-07-21)

Owner order (the walk): each institution rendered as a DETAILED, DISTINCTIVE 3D building —
a cathedral that emulates a real gothic reference (nave, transept, flying buttresses,
traceried windows, spire, statuary) — with per-building COSMETIC/DETAIL DRIFT keyed to
the two D&D alignment axes (lawful↔chaos, good↔evil), economic profile, and
terrain/resource. This supersedes the M-0 "recognizable massing" tier as the CEILING;
M-0 is the floor it climbs from. Backed by 4-agent research (wf_8f8917a5-363; sources in
the journal). VERDICT: buildable thoroughly, under our laws, as a multi-wave kernel.

## THE MECHANISM (research verdict): SHAPE GRAMMARS
The state of the art is CGA/split shape grammars (Müller 2006 CGA shape; Wonka 2003 split
grammars; CGA++ 2015 cross-shape events; Recompose 2024). A shape = symbol + scope
(oriented box) + geometry; rules rewrite shapes into child shapes building a shape tree;
leaves carry geometry. Core ops: extrude · comp(f) component-split · split(axis) with
absolute/relative/FLOATING(~) sizes + repeat(*) · roof ops · instance(asset) · occlusion
queries (context-sensitive: a window becomes wall where a wing abuts). Gothic ornament
(tracery, buttresses) = Havemann-Fellner GML: parametric compass-and-straightedge
constructions (circles + lines + booleans), boolean-free where possible.
**Determinism: CLEAN.** Interpretation is pure CPU geometry algebra; the only randomness
is per-shape seeded PRNG (seed → identical mesh). This is EXACTLY our pure-hash idiom
lifted from motifs to geometry. The condition-driven DRIFT the owner wants IS the
grammar's parameter vector — grammars were built to be parameterized.

## THE RENDER STACK (research verdict): GENERATE-3D → PROJECT-TO-SVG, viewer optional
Three candidates weighed; the winner is the HYBRID:
1. Grammar emits 3D GEOMETRY in PURE RATIONAL JS (IEEE-754 +,−,×,÷,√ are correctly-rounded
   and cross-machine stable; NO transcendentals/trig — the massing.js cavalier-rationals
   discipline extended). This mesh is the single source of truth.
2. CPU SOFTWARE-PROJECTION of that mesh to SVG (painter's-sort, the town draw-op
   vocabulary) = the CANONICAL artifact: byte-reproducible, print-grade, golden-pinnable,
   ZERO GPU in the artifact path. THIS is what ships and what goldens bind to.
3. OPTIONAL interactive three.js viewer over an OPTIONAL byte-reproducible GLB emitted
   from the same mesh — OWNER-GATED and NON-GOLDEN: WebGL raster is provably
   non-reproducible across GPUs (the basis of WebGL fingerprinting), so it may NEVER be a
   truth surface; and three.js is a ~150 KB gzip floor that CANNOT be eager (25 B budget
   margin) — it lives only as a lazy, opt-in, viewer-only lens the way react-pdf's vendor
   chunk stays out of the entry closure (vendorPdfLazy precedent). REJECTED as canonical
   for the same two reasons massing.js already rejected it: THE PROMISE + the budget.

## PRIOR ART (research verdict): BUILD, reuse sparingly
No off-the-shelf OSS reaches "textured isometric cathedral." Gothic tracery = ZERO
maintained libraries (academic only) — build it, we want to own it regardless.
Shape-grammar→façade = no maintained permissive JS lib (cgajs is a dead Apache prototype).
Reuse candidates (MIT), offline/tooling only: mxgmn/three-wfc (seeded WFC) for
constraint-driven kit assembly; building_tools (Blender, MIT) to BAKE a medieval/gothic
kit offline. The kernel itself is ours.

## THE DRIFT MODEL (feasibility CONFIRMED at code — the axes already exist)
The owner's alignment axes are ALREADY in the typed state, derivable, no schema add:
- Lawful↔chaos: computeLawfulness (worldPulse/disposition.js:512); good↔evil: computeMalice
  (:544); ALIGNMENT_TUNING (:571). Deity axes evil01/chaos01 (worldPulse/deityAxes.js;
  customContentSchema.js:162,193). Moral drift target: spatial/moralDrift.js.
- Economic profile: prosperity band + trade web (existing). Terrain/resource:
  resolveTerrain.js:40,57 + nearbyResources. Corruption covert/revealed: corruption.js:597.
So the building-detail parameter vector = f(alignment[law,good] × prosperity × terrain ×
resource × age × condition) — the SAME cosmetic-field cohesion laws already written (M-0b),
now feeding GRAMMAR PARAMETERS instead of flat motifs. Lawful/good → ordered symmetric
ornament, bright glass, maintained; chaotic/evil → asymmetric skew, darkened, defaced,
weathered; poverty strips flourishes; terrain/resource changes material. Deterministic
pure-hash over (seedId, anchorKey, conditionVector).

## WHERE IT LIVES / THE LAWS IT INHERITS
- New lazy leaf src/domain/townMap/architectureKernel.js (+ tracery/, grammar/ leaves);
  pure, store-free, the townMap source-scan purity bans (no Date/random/localeCompare/trig).
- The massingSet seam generalizes to an architectureSet capability — absent from every
  shipped lens ⇒ byte-dormant by construction (M-0's proven pattern).
- Silhouette totality walker → detail totality walker: every institution kind maps to a
  grammar or the explicit default; unmapped REDS. Custom institutions ride the four-rung
  ladder (typed grammar-class pick → supply-chain → name-match → category floor).
- Determinism golden per (kind, conditionVector, lens); op-budget on the grammar
  derivation; the picturesque gate (manager + owner eyes on real renders per wave).

## SEQUENCING (multi-wave, research-backed; each wave gated + owner taste checkpoint)
K-1 GRAMMAR CORE: the shape-grammar interpreter (extrude/split/comp/repeat/instance/
   occlusion) + CPU SVG projector, proven deterministic + dormant. Sample: one cathedral
   grammar to the reference bar. OWNER CHECKPOINT before K-2.
K-2 THE KIT: per-institution grammars (cathedral, keep, mill, market, guildhall, …) to
   recognizable-detailed; the detail totality walker.
K-3 GOTHIC ORNAMENT: the GML tracery/buttress/statuary-niche sublibrary (the owned,
   build-from-scratch layer).
K-4 THE DRIFT BINDING: wire the alignment×economy×terrain condition vector into grammar
   params; per-axis visual-consequence tables; determinism goldens across the vector.
K-5 THE VIEWER (owner-gated, optional): lazy three.js + byte-reproducible GLB export, a
   non-golden opt-in lens.
The four map VIEWS (M-1..M-4) consume the kernel's output the same as they'd consume
massing; VTT stays legibility-first (kernel detail muted there).

## HONEST SIZING
This is the LARGEST single build discussed — larger than the whole prior map suite. It is
a research-backed KERNEL with its own constitution, not a lane. M-0's massing ships as the
floor NOW (already folded); the architecture kernel is the ceiling, built in gated waves
K-1..K-5, each with an owner taste checkpoint. Recommendation: authorize K-1 (grammar core
+ one reference-bar cathedral) as the proof; judge the sample; then commit the rest or
hold at the massing floor. Nothing here violates a law — determinism, THE PROMISE, the
budget, and FINITE-SEMANTICS all hold because the canonical artifact is pure-CPU geometry,
never GPU pixels, and the AI (if ever used for a custom grammar pick) classifies into the
finite grammar vocabulary, never draws.
