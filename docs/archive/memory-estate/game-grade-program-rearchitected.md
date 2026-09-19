---
name: game-grade-program-rearchitected
description: "2026-07-24 UNCOMMITTED rewrite of GAME_GRADE_PROGRAM.md in minifold — G-numbering replaced, G-1/G-2a/G-3/G-4a IMPLEMENTED flag-off; the ledger's \"nothing built yet\" is STALE"
metadata: 
  node_type: memory
  type: project
  originSessionId: b393f918-f75e-470b-8e34-78c7bbed8bb8
  modified: 2026-07-26T08:40:17.575Z
---

Verified 2026-07-26 (3 Opus verifiers against the minifold worktree, claude/composite-r4 @ 8033ddbe). The tree carries ~1,012 dirty/untracked files, including a 1,383-line rewrite of docs/GAME_GRADE_PROGRAM.md (program-state block dated 2026-07-24), a modified GAME_GRADE_AUDIT.md, and untracked docs/GAME_GRADE_PROMOTION_CONTRACT.json.

**The G-identifiers were renumbered.** Committed @ 8033ddbe (what [[game-grade-ux-doctrine]] describes): G-0 purge · G-1 editor dead-end · G-2 forecast · G-3 needsAttention · G-4 verbs+ticker · G-5 query web · G-6 re-score. Working-tree rewrite: G-0 rebaseline · G-1 settlement transaction spine (ChangeIntent/ChangeReceipt envelopes) · G-2 Settlement Workbench vertical slice (2a proof / 2b family migration+cutover) · G-3 canonical RealmItem read model · G-4 Herald command brief (4a proof / 4b parity) · G-5 surface slices (Generator/Map/Custom/Library) · G-6 prevention+rendered gate.

**Implementation checkpoint in the doc:** G-1 foundation, G-2a (src/components/dossier/SettlementWorkbench.jsx — EntityInspector overlay + inline ChangeDock), G-3, and code-provable G-4b slices are IMPLEMENTED behind default-off flags `settlementWorkbench=false` / `heraldCommandBrief=false` (src/lib/flagRegistry.js:39). G-2b migration, lived G-4b, broader G-5, G-6 remain open. Promotion contract keeps both defaults off.

**Standing rulings inside the rewrite** (do not re-litigate without the owner): no cross-layer entityVerbs registry owning permissions/dispatch/navigation product-wide — domain-local capability descriptors only (PROGRAM.md ~:310-315, a deliberate reversal of the committed G-4 design); the separate edit-mode prelude is superseded — Author is entered at a field, task views are not global modes; §12 bans inferred causal AI and a universal verb registry; THE PROMISE is codified as law 1 (byte-identical payloads, whitelisted observability only); per-order marginal forecast and terrain-at-cursor stay owner-gated.

**Why:** any session that plans game-grade work from the ledger commit f2aec41f ("nothing built yet") or from the old G-numbering will misplan and may collide with the live implementation.

**How to apply:** treat the minifold working tree, not 8033ddbe, as the program of record; re-read docs/GAME_GRADE_PROGRAM.md fresh each session until this fold lands; the uncommitted rewrite + implementation need a fold/commit decision from the owner. See [[dossier-editor-capability-atlas-verdict]] and [[regen-edit-loss-hazard]].
