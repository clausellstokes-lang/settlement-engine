---
name: capability-atlas-shipped
description: "2026-07-26 the full G-2b capability mapping shipped — docs/SETTLEMENT_CAPABILITY_ATLAS.md in minifold (uncommitted); 593+ rows, 200-gap ledger, 30-item owner queue; corrects several stale prior beliefs"
metadata: 
  node_type: memory
  type: project
  originSessionId: c991982e-0a25-44fe-a023-b240c17f982e
  modified: 2026-07-26T19:30:27.327Z
---

**The full mapping the owner ordered 2026-07-26 ("do the full mapping", Fable maps / Opus verifies) is BUILT**: `docs/SETTLEMENT_CAPABILITY_ATLAS.md` in the minifold worktree (claude/composite-r4 @ 8033ddbe + live tree), UNCOMMITTED, ~12.3k lines. 15 domain slices, each Opus-adversarially verified in place; assembly embeds slices byte-verbatim; an Opus completeness critic re-derived 11 denominators (all matched) and found 7 boundary findings (2 critical) applied in a follow-up fix+recheck pass. Slice sources remain at the c991982e session scratchpad `atlas/` dir.

**Why:** This is the G-2b "full capability matrix" prerequisite for the Settlement Workbench cutover ([[game-grade-program-rearchitected]], [[dossier-editor-capability-atlas-verdict]]). Atlas = derived read-only projection ONLY (verb registry ban stands).

**How to apply:** Treat the atlas as the row-level authority on what is editable/actionable/influenceable; re-verify reach lines before relying on them (dated code-traced snapshot, goes stale silently). Key numbers: 40 composer verbs (31 authorable), 180 registry ops + 72 exempt (NOT 181), **11 command kinds** (not 7) incl. 6 custom-content, 3 surveyor-flagged; 25 renderTab cases / 24 lazy exports; 25 EDITABLE_FIELDS paths but only 2 live EditableText mounts (**1 of 25 prose paths reachable**); 107 influenceable rows; destination recs: inspector 201 / contextual-tool 96 / legacy-retained 62 / canvas 51 / dock 42 / retired 35.

**Corrections to prior beliefs (verified by Opus critic):** commandRegistry walker now EXISTS (untracked, 11-kind pin) — the no-walker claim in [[dossier-editor-capability-atlas-verdict]] is stale; custom-content consumers gap closed by untracked work (named residual remains); regen edit-loss on the NPC branch is FIXED in the uncommitted tree but STILL LIVE on committed lineage (atlas CONFLICT 1 — unadjudicated); a field-level declared frozen-vs-live substrate EXISTS (`src/domain/fieldManifest.js`, walker-enforced) even though the op→affected-systems substrate remains unbuilt.

**Sharpest new findings:** advertised-undo class — 4 of 5 undoLastPulse advertisers never arm a snapshot; 31 dead registered ops (incl. setLock — types.js "NOT IMPLEMENTED — there is no locks engine"); deity premium gate hand-mirrored fail-open; flag-on review blackout = G-2b promotion blocker (free-tier owner loses both review surfaces); eventNarrativeSnapshots: paid AI record, 2 writers, 0 readers, silent cap 10; VersionsTab sells manual snapshot + diff that don't exist; realm lane has 4 DM-reachable settlement-terminal-death verbs → settlement-fate census is THREE lanes.

30-item owner-decision queue lives in atlas Part VII (Edit-toggle keep/retire is #1). 3 fact CONFLICTs + 1 schema conflict (influenceable lever-field spelling fork) recorded, unadjudicated.
