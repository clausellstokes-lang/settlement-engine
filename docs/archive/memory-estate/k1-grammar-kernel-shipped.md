---
name: ""
metadata: 
  node_type: memory
  type: project
  date: 2026-07-21
  title: K-1 grammar kernel shipped (gate-verified)
  branch: claude/k1-grammar
  tip: c812d179
  base: d4747d6c (K-0b)
  originSessionId: 230c87b4-b237-4d1b-a63e-af48dfb233a0
  modified: 2026-07-22T01:45:18.359Z
---

# K-1 — the 3D building GRAMMAR KERNEL, shipped + gate-verified

The first wave of the owner-ordered MAXIMUM 3D building kernel. A **dark/dormant** shape-grammar
under `src/domain/townMap/arch/` (imported by NOTHING shipped — closure Δ0), the frozen contract every
later K-wave (K-2..K-5) compiles into. Branch `claude/k1-grammar` off K-0b `d4747d6c`; gate-verified at
`c812d179` (two prior WIP-checkpoint commits 57c97d2d source + 172258a7 spine tests, folded by the
manager across a session-limit interruption, then gate-verified).

## Why (what K-1 is)
- **12-op two-phase interpreter** (grammarIR/ops/frames/occlusionIndex/interpreter): a Shape =
  {sym, scope(origin, frameRef into pinned frames, size), attrs(materialRole, lodTier, params), path}.
  Ops: split(repeat/~/remainder) · comp · extrude · inset · offset · orient · defer · emit(box|spire|
  extrudeConvex) · prism(n-gon) · sweep(profile) · instance · occlude. Phase 1 massing → freeze
  occlusion index → phase 2 fires cross-shape EVENTS ((eventName-codepoint,index) order) + resolves
  pending occludes. **FAILS CLOSED** on unregistered symbol/op or a HARD_TIER_CEILINGS breach.
- **`defer(tier)`** yields all 3 LOD tiers from ONE derivation prefix — the SHELL massing is shared,
  only ornament gates on tier, so footprint+ridge AGREE by construction (silhouette law in 3D).
- **Mesh emitter** over K-0b `mesh.js` (REUSED verbatim → intern is bit-identical): +per-vertex CPU AO
  (aoBake) +crease-edge ink index (dihedral) +per-triangle material-role submeshes (12-role registry).
- **Exporters**: glb.js extended for an optional `_AO` attr (no-AO path byte-identical to K-0b golden);
  plate.js = z-buffered software raster over the mesh (rational orthographic, per-role+AO+crease ink,
  TONE_LUT, 3 canonical angles); the K-0b raw-WebGL2 viewer reused +AO +ink pass +qualityLevel hook.
- **N_GON_DIRS** registry (rationalTables) extends HEPTA_DIRS to n∈{3..9,12,16}, pinned integer literals
  (off-engine) — the curved-massing owner, no trig.
- Deliverables: exhibit `public/landing-maps/k1-exhibit/` (3-tier cathedral GLBs t0/t1/t2 +buttress-
  grammar.glb +plate triptych +viewer index.html); budget sheet `docs/KERNEL_K1_BUDGET_SHEET.md`.

## How to apply / gate receipts (executed 2026-07-21)
- **BYTE-PARITY** (the wave's adversarial check): `interpret+emit(buttressRuleset)` ==
  `buildButtressDirect` bit-for-bit — the grammar path adds ZERO drift (tests/architecture/archByteEqual).
- Cathedral 3 tiers: tris **108 / 396 / 2172**, verts 190/1038/5206, draws 8/14/42; identical AABB
  every tier ([-24,0,0]..[260,590,190]). Goldens = SHA-256 exemplars, ARCH_GEOMETRY_VERSION 1.
- Closure = **1,039,995 = the K-0b base, Δ 0** (arch dormant; ARCH_KERNEL_LAZY_SENTINEL absent).
- domain-strict 0 · full tsc 0 · eslint 0 · transcendental 0 new · NUL 0 · VERIFY_DIST 31/31.
- Two full-suite shards: **EXACTLY the 4 parked golden families** red (beliefMapGolden, goldenViewModel,
  generatorGoldenMaster, worldpulseDeityGolden — all fail in isolation, unreachable from dormant arch);
  advancePauseResume is parallelism-flaky (9/9 in isolation).

## Sharp hazards (each recorded because it bit or nearly bit)
- ⚠ **The k0GeometryTracery arch-dir transcendental scan is NON-RECURSIVE** — it misses `arch/rulesets/`.
  `tests/architecture/archViewWall.test.js` adds the RECURSIVE purity+view-wall scan (covers rulesets/).
  Any new arch subdir needs archViewWall coverage or its purity is unguarded.
- ⚠ **VERTEX-INTERN = string key over float32-baked coords** (K-0b mesh.js, KEPT). Cross-engine exact
  (IEEE fround + spec Number→String). AO is a PARALLEL post-pass attr, NEVER in the intern key — that is
  what keeps geometry byte-identical to a direct build. Do not fold AO/role into the key.
- ⚠ **domain-any baseline 2246 (ceiling 2252, only 6 headroom left)** — the grammar's dynamic rule-data
  boundary is 4 honest any-holes (grammarIR OpArgs=1, ops resolveArg 2 + TerminalRec spec 1), baselined
  via `node scripts/count-domain-any.mjs --update`. K-2 grammar growth must budget against 6 headroom.
- ⚠ **rawColorLiteral budget 1403→1405** was a K-0b INHERITANCE, not K-1: K-0b's `spike.js` shipped 2
  engraving-plate hex (INK/PAPER) un-triaged at the d4747d6c fold. spike.js is k0Determinism-byte-pinned
  → tokenizing would break the plate golden → the raise is the only PROMISE-safe move (ledgered in-file).
- ⚠ **E-A mutation plant** = `mutation-sweep.sh` "kernel/unwalked arch ruleset" (check_caught_planted):
  a new file in `arch/rulesets/` reds `archLodLadder.walker` (registration totality). Manifest entry is
  the join key. archMeshBudget (tests/design) has a rationale manifest entry.
- ⚠ **Cathedral goldens are pinned bytes** — any emitter/ruleset geometry change bumps ARCH_GEOMETRY_
  VERSION + reprints the SHA exemplars (a DECLARED same-seed shift, never silent).
- The K-5 `qualityLevel` hook lives ONLY in the generated viewer (view-layer, default 1.0); archViewWall
  pins that NO golden arch file references it — it can never touch geometry/plate/GLB.

## Deferred / next
- K-2..K-5 extend RULESETS against this frozen contract (K-3 ornament fills toward the 150k-tri ceiling;
  the cathedral is a deliberately conservative 2172-tri exemplar). The budget sheet awaits owner signature.
