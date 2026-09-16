---
name: intent-atlas-phase-a-folded
description: Intent atlas Phase A COMMITTED @ a794a4f8 (composite-r4/minifold) 2026-07-27; freshness 8-red = declared staleness until owner regen; deferrals listed
metadata: 
  node_type: memory
  type: project
  originSessionId: 9da82bae-e647-4a0f-a67e-4df673241f0a
  modified: 2026-07-27T18:36:43.087Z
---

Intent atlas Phase A (wave L-2a) folded at **a794a4f8** on claude/composite-r4 (minifold worktree), 2026-07-27. Purely additive: src/domain/intentAtlas.js + intentAtlas.distillate.json (0.2.0) + intentAtlasBundle.js/.meta.json + intentAtlasIdFree + intentAtlasBundle.freshness tests + ONLY their two E-A manifest entries (carved from a 9-hunk dirty manifest via index plumbing; other 7 hunks = L-5/R-5b/L-3b/aiCharter lanes, still dirty in-tree).

**Why:** owner said "commit" after the NUL-fix verification session; fold coupling per each manifest kindNote demanded test+entry same-commit. The briefed raw-0x00 cellKey separator was already resolved in-tree by a concurrent session (separator now `'|'`, module-internal only — no persisted-output shift). Gates at commit: controlBytes 4/4, idFree 83/83, freshness 18/26 — the 8 reds are DECLARED staleness (bundle sourceHash 1b2370dbc1754c39 vs live ddd4d023ae7793f6), standing until the owner authorizes `npm run build:edge-shared` in the staleness lane.

**How to apply:** don't re-find the freshness reds as a bug; they clear only via owner-gated bundle regen. Deferred, documented in the commit body: build-edge-shared.mjs registration hunks (mixed with aiCharter — ride that fold); scripts/distill-intent-atlas.mjs + tests/domain/intentAtlasSoakDistiller.test.js (L-8a unit, rides its own fold); docs/DESIGN_AI_INTENT_ATLAS.md + DESIGN_AI_CAPABILITY_LADDER.md (untracked, [[ai-intent-atlas-and-tier-ladder-open]] M42/M43 veto open). Related: [[generation-remediation-gate-state]], [[minifold-tree-is-live]].
