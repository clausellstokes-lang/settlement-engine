---
name: ""
metadata: 
  node_type: memory
  type: project
  title: "K-0b SHIPPED — the rotatable high-fidelity gothic 3D MESH + WebGL viewer + deterministic GLB (dark, closure-Δ0)"
  date: 2026-07-21
  tags: 
    - architecture-kernel
    - k0b
    - 3d-mesh
    - webgl-viewer
    - glb
    - deterministic-geometry
    - watertight
    - dark-gated
    - closure-delta-0
    - non-golden-view
  branch: claude/k0b-3d-viewer
  base: 30aadb61
  tip: d4747d6c
  originSessionId: 230c87b4-b237-4d1b-a63e-af48dfb233a0
  modified: 2026-07-21T22:33:09.560Z
---

# K-0b — the FULL 3D STRUCTURE (owner ruling v2 deliverable)

Builds on K-0 (30aadb61). Answers the owner's "a FULL 3D STRUCTURE, not a plate ... as much
fidelity as possible" (docs/THE_ARCHITECTURE_KERNEL_3D.md, CORRECTION 3 + mesh-max-fidelity para).
Proves TWO things the owner can SEE: (1) the deterministic gothic geometry reaches high
architectural fidelity as a REAL 3D triangle mesh; (2) it is a NAVIGABLE 3D structure (orbit/zoom).
Spike is DARK — imported by nothing shipped.

## What shipped (branch claude/k0b-3d-viewer off 30aadb61)
- **New pure dormant arch leaves** (src/domain/townMap/arch/, all 0 transcendental sites):
  - `mesh.js` — flat-shaded mesh algebra: createMesh / addTri / addQuad / addBox /
    `addExtrudedConvex` (wall-band slab prism) / `addTube` (swept rect cross-section: flyer,
    tracery bars, rings) / `addSpire` (pinnacle, cap) / finalizeMesh. Positions **float32-baked
    via Math.fround** so the JS mesh and the GLB agree bit-for-bit + are cross-engine stable.
  - `cathedralSection.js` — `buildCathedralSection()` assembles ONE gothic nave-bay section:
    pierced nave wall (thickness+reveals), two-light lancet (archivolt, mullion, 2 cusped
    sub-arches, 6 trefoils, tympanum oculus+quatrefoil), 7-fold ROSE (outer ring, septfoil from
    the pinned HEPTA_DIRS, 7 spoke-mullions, hub), gable+rake coping, plinth/sill/impost courses,
    ashlar-block relief band, TWO flying buttresses (stepped pier + weathering cap + pinnacle +
    swept arced flyer + wall-spring corbel). 16 elements.
  - `glb.js` — deterministic binary glTF encoder (fixed layout POSITION f32 / NORMAL f32 / indices
    u32, LE DataView, fixed JSON key order, 4-byte pad). `encodeGlb` + `glbJsonString` (shared
    `gltfTree` = single source of truth).
- **scripts/generate-k0b.mjs** (`--check`) — emits the exhibit; renders 2 CPU stills via an inline
  z-buffer rasterizer (build-time only; trig allowed there). Self-checks mesh+GLB double-build byte
  identity before writing.
- **public/landing-maps/k0b-exhibit/** — `index.html` (self-contained raw **WebGL2** viewer: embeds
  the GLB as base64, parses it in-page, orbit/zoom/auto-spin, Lambert+hemispheric+fill+rim shading)
  + `gothic-bay.glb` + `still-oblique.png` + `still-front.png`.
- **tests/architecture/k0bMesh.test.js** — determinism (mesh+GLB double-run), non-degeneracy,
  unit normals, watertightness, depth-in-3-axes, GLB header/JSON/round-trip.

## Receipts (all CONFIRMED, executed)
- mesh: 3,924 tris / 6,602 verts; **watertight (0 odd-multiplicity position-edges)**; all normals
  unit (maxErr 3.8e-8); 0 degenerate tris; z-span ~190 (real depth, not a plate).
- determinism: mesh double-build identical (positions/normals/indices); GLB double-build byte-
  identical (206,500 B); `--check` clean; GLB round-trips (accessors match, min/max bound data,
  indices in range).
- **closure Δ0: first-paint static closure = 1,039,995 B == the K-0 base** (brief's stated base);
  arch mesh identifiers (buildCathedralSection/encodeGlb/gothic-nave-bay/…) absent from EVERY dist
  JS chunk. Zero-eager law holds.
- gates: 37 tests/architecture green (25 K-0 + 12 K-0b); transcendental ratchet green; domain-strict
  0; tsc full 0; eslint 0; NUL 0; build clean; VERIFY_DIST 220/220.
- live viewer verified in-browser: renders, auto-orbits, drag-orbit + pause-spin work, 0 console
  errors. Fidelity (viewed stills+live): recognizable high-fidelity gothic bay — nave/tracery/rose/
  buttress/pinnacle/gable all present in TRUE 3D, openings see-through, proportions right.

## Hazards / how-to-apply (⚠ read before touching K-0b or K-1)
- ⚠ **Watertightness is GUARANTEED-BY-CONSTRUCTION** only because every mesh.js primitive is an
  individually CLOSED solid (box/extruded-convex-prism/tube-with-caps/spire). The test asserts zero
  odd-multiplicity POSITION-edges. Any NEW primitive that is not a closed solid (an open strip, a
  half-cut hole) breaks the guarantee — add caps or the test reds. The wall is pierced by
  band-prism decomposition (chords via sqrt), NOT by CSG/earcut — deliberately, to keep closure free.
- ⚠ **The arch-dir transcendental scan (k0GeometryTracery.test.js) auto-covers ALL arch/*.js** incl.
  mesh/cathedralSection/glb. New arch files MUST stay trig-free: no Math.cos/sin/tan/acos/asin/atan/
  atan2/pow/exp/log/cbrt/hypot/sinh/cosh/tanh and no `**`. Math.sqrt + Math.fround are OK. The
  transcendental-math ratchet (src/domain TREES, CEILING 49) also covers them → 0 sites required.
  **scripts/ is NOT scanned** — the viewer camera + still rasterizer use trig freely (a NON-golden view).
- ⚠ **Do NOT remove the Math.fround position-bake in mesh.js** — it is what makes the JS mesh and the
  GLB byte-agree and stay cross-engine deterministic. Without it the GLB-parity test + THE PROMISE
  cross-engine claim break.
- ⚠ GLB uses **UNSIGNED_INT (u32) indices** → the viewer needs WebGL2 (or WebGL1+OES_element_index_uint).
  The shipped viewer is WebGL2 and shows a graceful error otherwise.
- Both stills are the SAME byte length (2,074,543) — NOT a bug: png.js is stored-DEFLATE, so size is a
  pure function of WxH (960x720), identical for any same-dimension image.
- **NON-GOLDEN VIEW, GOLDEN GEOMETRY**: the live WebGL pixels are device-dependent and deliberately
  un-pinned; only the mesh vertex data + GLB bytes are golden. Stated in the test-file headers.
- Owner-queue #1 (the PROMISE-pins-geometry-not-pixels affirmation) is UNCHANGED by K-0b — K-0b is the
  requested evidence, not the ratification. K-1 (grammar interpreter) is the next kernel wave.
