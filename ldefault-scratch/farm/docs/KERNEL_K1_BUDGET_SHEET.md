# K-1 KERNEL BUDGET SHEET — the measured M1 envelope + proposed pinned tuning

**Wave:** K-1 (grammar interpreter + mesh emitter + render pipeline + the standing spine).
**Branch:** `claude/k1-grammar` (off K-0b `d4747d6c`). **Date:** 2026-07-21. **Machine:** the
measured M1 (Apple M1, 7-core GPU, Metal 3, 16 GB), per `docs/KERNEL_MAX_PROGRAM.md`.

The owner signs this sheet as **versioned tuning** (THE PROMISE §tuning: auto-proposed → owner-signed
→ versioned). The pinned constants live in code as `HARD_TIER_CEILINGS` (grammarIR.js — the fail-closed
machine envelope) and the per-tier `CATHEDRAL_CEILINGS` (tests/design/archMeshBudget.test.js — the
per-kind ~1.5× ceiling). Counts, never milliseconds — draw calls bind first on this machine.

---

## 1. MEASURED — the K-1 grammar cathedral (the exemplar), per LOD tier

Measured by `buildArchMesh(cathedralRuleset(), { seedId:'k1', tier })` on 2026-07-21.

| Tier | name | triangles | vertices | draws (submesh role-ranges) | interpreter meters (rules/shapes/terminals/rounds) | GLB bytes (POSITION+NORMAL+_AO) |
|------|------|-----------|----------|------------------------------|-----------------------------------------------------|----------------------------------|
| 0 | glyph (distant) | **108** | 190 | 8 | 10 / 10 / 8 / 1 | 7,692 |
| 1 | commons (near) | **396** | 1,038 | 14 | 15 / 15 / 14 / 1 | 34,900 |
| 2 | signature (full) | **2,172** | 5,206 | 42 | 52 / 52 / 42 / 1 | 172,924 |

Silhouette agreement across tiers (footprint + ridge): **identical AABB at every tier** —
`min = [-24, 0, 0]`, `max = [260, 590, 190]` (w 284 · h 590 · d 190). Pops change detail, never shape.
Material roles used at tier 2: **8** of the 12-role registry (ashlar, dressedStone, voussoir, tracery,
mullion, buttressStone, pinnacleStone, relief).

## 2. MEASURED — the byte-parity fragment (the flying buttress)

`emitMesh(interpret(buttressRuleset(20,49,1), tier:2))` == `buildButtressDirect(20,49,1)` **byte-equal**
(positions/normals/indices identical). triangles **192** · vertices 520 · draws 7 · GLB 17,976 bytes.

## 3. THE MEASURED CEILING vs the AUTHORED ARTIFACT

The M1 is **not triangle-bound** at signature scale (doc: signature authorable to ≤150,000 tris). The
K-1 cathedral is a single bay at 2,172 tris — a deliberately conservative exemplar proving the pipeline;
K-3 ornament (tracery depth, ribbed vaults, statuary) fills toward the ceiling. The binding limits and
their cures, as they actually bind:

| Limit | M1 measured ceiling | K-1 cathedral (tier 2) | headroom | cure |
|-------|---------------------|------------------------|----------|------|
| Draw calls / frame | ~200 (batched) | 42 | 4.7× | per-role submesh batching (already partitioned) |
| Triangles (signature) | ≤150,000 authored | 2,172 | 69× | K-3 fills; the M1 is not saturated |
| Eager bytes (first paint) | 1,040,000 hard | **+0 (dormant kernel)** | — | total laziness — closure Δ0 (§5) |

## 4. PROPOSED PINNED CONSTANTS (owner signs)

### 4a. `HARD_TIER_CEILINGS` — the interpreter's FAIL-CLOSED machine envelope (grammarIR.js)
Pinned at the doc's measured machine limits; a rule expansion breaching any is a build-time RED.

| Tier | rules | shapes | triangles | vertices |
|------|-------|--------|-----------|----------|
| 0 glyph | 400 | 400 | 300 | 1,200 |
| 1 commons | 4,000 | 4,000 | 6,000 | 24,000 |
| 2 signature | 60,000 | 60,000 | 150,000 | 600,000 |

### 4b. `CATHEDRAL_CEILINGS` — the per-kind meshBudget ceiling (~1.4–1.5× MEASURED)
The tight, kind-specific self-scoring ceiling (tests/design/archMeshBudget.test.js). Raise only with a
re-measure + a note; the draw-call budget (≤200) is the binding-first ceiling every tier must clear.

| Tier | tri ceiling (measured) | vertex ceiling (measured) | draw ceiling (measured) |
|------|------------------------|----------------------------|--------------------------|
| 0 | 200 (108) | 340 (190) | 16 (8) |
| 1 | 640 (396) | 1,650 (1,038) | 24 (14) |
| 2 | 3,300 (2,172) | 8,000 (5,206) | 64 (42) |

Byte-parity buttress fragment: tri ≤ 300 (192), draws ≤ 12 (7).

## 5. CLOSURE Δ0 (the eager-byte wall) — CONFIRMED

`npm run build` + BFS over the entry chunk's transitive static import closure:
**entry static closure = 1,039,995 bytes (7 chunks) — IDENTICAL to the K-0b base 1,039,995. Δ = 0.**
The `ARCH_KERNEL_LAZY_SENTINEL` appears in **no** closure chunk; **no** arch chunk is emitted into dist.
The whole K-1 kernel is imported by nothing shipped — zero eager bytes, forever, structurally.

## 6. THE VERTEX-INTERN DECISION (resolved before any golden was pinned)

**String key over float32-baked coordinates** — the committed K-0b `mesh.js:vertex()` mechanism, KEPT.
Cross-engine deterministic by two spec guarantees: `Math.fround` is IEEE round-to-nearest-exact, and
`Number.prototype.toString` is spec-mandated (shortest round-tripping decimal), so the same float32
value stringifies identically on every engine. It introduces no welding-tolerance knob (an integer-
quantized key would trade a real accidental-weld risk for an immeasurable speedup — the M1 is not
intern-bound). Per-vertex AO is a **parallel post-pass attribute, NOT folded into the intern key**, so
positions/normals/indices stay byte-identical to a direct build (proven by archByteEqual). This is
continuous with the existing K-0b goldens (no shift), and the K-1 SHA-256 exemplar hashes are pinned on
this basis (archMeshDeterminism.test.js, ARCH_GEOMETRY_VERSION 1).
