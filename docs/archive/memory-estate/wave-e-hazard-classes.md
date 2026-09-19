---
name: wave-e-hazard-classes
description: "Four hazard classes discovered + cured during wave E (satellite topography) 2026-07-31 — stride aliasing, single-seed vacuous pins, per-tick fork stream theft, parity-blind determinism passes"
metadata: 
  node_type: memory
  type: project
  originSessionId: c69772bd-e324-4e1d-b1ee-b7482c7741fc
  modified: 2026-07-31T21:55:25.646Z
---

Wave E (satellite topography, 2026-07-31) surfaced four reusable hazard classes, each with a shipped cure in-tree:

1. **Arithmetic-stride aliasing over grid/cell arrays** — an evenly spaced integer stride resonates with the map's row width (measured: stride 6 on a 12-wide grid selected two columns; the whole mountain ridge became structurally unreachable). Cure: golden-ratio additive-recurrence (Weyl) subset sampler (`spreadIndices` in steadingTopography.js) — no resonance at any width. ANY future code subsampling FMG cell arrays by stride has this bug.
2. **Single-seed story pins are vacuous for restrictions** — the strike-seam pin passed GREEN with the seam restriction fully deleted. Cure: totality over a seed family (32 seeds; control reds 26/32 off-seam). A restriction pin must be a family, never an anecdote.
3. **Per-tick keyed forks hide stream theft** — a fork rebuilt per tick (`satellite:<parent>:<tick>`) localizes a stolen draw to that tick; a 30-tick spatial-vs-aspatial trace stayed byte-identical WITH draws moved onto the main fork. Cure: DRAW ACCOUNTING — wrap rng.fork to count draws per key and assert equality between arms (reds on a single stolen draw).
4. **Double-pass determinism pins are blind to call-order state whose period divides the pass length** — a hidden parity counter survived a 16-seed double pass. Cure: structural purity scan of module source (no module-scope let/var, no globalThis/Date/Math.random) ALONGSIDE the behavioral pass.

**Also load-bearing facts:** the frozen spatial digest does NOT persist per-settlement seed cells (`pack.c/p/h/biome` absent — `territory[cell] === parentIndex` is the only "near this parent" primitive); quantized cost band 111..140 is reachable ONLY via the river term (the sole water-proximity signal in the frozen raster); moving a file from generators→domain puts it under domain-strict zero-tolerance (use the declared-row-shape cast idiom); domainGeneratorsBoundary ratchet prescribes "move the leaf down or DI the fn" — follow it, never widen BASELINE_EDGES.

**Why:** each class will re-bite any spatial/deterministic work (cartography TC especially — cell sampling everywhere).
**How to apply:** cite the cures as the house idioms in future spatial-wave briefs; the draw-accounting instrument and Weyl sampler are reusable as-is.
