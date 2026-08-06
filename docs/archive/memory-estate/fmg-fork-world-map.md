---
name: fmg-fork-world-map
description: "THE WORLD MAP IS AZGAAR'S FMG — public/map/ is a 636-file vendored MIT fork (LICENSE-FMG.txt), MODIFIED across 16+ commits; owner order 2026-07-20: the fork IS in full-system review scope (mods/security/determinism/integration/upgrade-hygiene); iframe + sf-bridge.js postMessage RPC; geography from FMG, depth from SettlementForge"
metadata: 
  node_type: memory
  type: project
  originSessionId: 4e5bd424-21ab-4307-ba41-bd048bb9061e
  modified: 2026-07-20T21:22:50.844Z
---

The realm/world map is a VENDORED FORK of Azgaar's Fantasy Map Generator (MIT):

- `public/map/` = the whole FMG fork (~636 files incl. heraldry charges, modules, libs).
  License carried at `public/map/LICENSE-FMG.txt`. Vendored plain files — deliberately
  NO submodule/subtree (tried 2026-04, reverted: conflict noise).
- Integration = iframe (driven by `src/components/WorldMap.jsx`, `FMG_URL` cachebuster)
  + ONE extracted bridge: `public/map/sf-bridge.js` (~1,136 lines, typed postMessage
  RPC; binds FMG globals svg/pack/d3/cells/regenerateMap/seed) + exactly 4 scattered
  inline patches in `public/map/main.js` (SW disable ~16, branded error ~275, drag-MIME
  branches ~597/607 — search markers `settlementforge`/`sf-`).
- Division of labor (docs/azgaar-bridge.md): "the map provides geography (terrain,
  rivers, borders, cultures); your settlements provide depth."
- Upgrade runbook: `docs/fmg-fork.md` (diff new release, reapply 4 patches, leave
  sf-bridge alone, bump 3 cachebusters, npm run check + manual walk).
- ⚠️ `public/map/` sits OUTSIDE eslint/tsc/vitest/prettier by design — its only gates
  are named in fmg-fork.md. ROUND 3 intake carries: sf-bridge RPC security/origin
  audit + gate-coverage verification + upstream-currency check.
- FMG's native .map load survives the patches ⇒ users can bring existing Azgaar
  worlds — the adoption lever is inherent, no import feature needed.

**Why:** 2026-07-18 the manager mis-scored crown 2 ("world map generators") as a gap
vs Azgaar and proposed an import bridge — without checking the tree. The owner
corrected ("our FMG fork is literally azgaar's system"); verified same day. Crown 2
is Azgaar-class BY CONSTRUCTION plus the living layer.

**OWNER ORDER (2026-07-20, supersedes the outside-review posture):** "review
azgaard as well. treat it as part of this system. because while the fork is
there, we have modified the code." The fork is IN full-system review scope —
modification census (git history since vendoring f386f48d shows 16+ commits,
BROADER than the 4-patch claim above; the runbook's patch list must be verified
against reality or upgrades silently drop mods), security surface, bridge
determinism/integration, upgrade hygiene. House style-ratchets still don't apply
to third-party idioms; correctness/security/determinism review DOES.

**How to apply:** never score/design the world-map surface against Azgaar as an
external rival. Remaining crown-2 work = house coherence of realm chrome
(deep-craft C5) + optional house FMG style preset (vetoable). MIT attribution rides
the ⛔OWNER legal-consult carve-out. Related: [[comprehensive-review-fix-program]],
[[map-overlay-svg-attr-lineage-gap]], [[settlement-map-workstream]].
