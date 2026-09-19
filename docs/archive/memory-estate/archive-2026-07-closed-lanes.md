---
name: archive-2026-07-closed-lanes
description: Index lines for lanes closed/folded/pushed by 2026-07-31 — moved out of MEMORY.md at the 20KB compaction; each entry's topic file still holds full detail
metadata:
  type: project
---

# Closed-lane index entries (archived 2026-07-31)

- [minifold fold coordination](minifold-dead-op-fold-coordination.md) — ✅ FOLD LANDED (tree clean @ 018e4119 verified 2026-07-30); hold lifted; #14 landed @ b89a2025. See [[holistic-review-2026-07-30]].
- [Backup exposure](backup-exposure-2026-07-26.md) — ✅ CLOSED: ledger PUSHED (16f92435); composite-r4 PUSHED 2026-07-27 ~22:20 (origin 5f6abbfd, isolated full gate green, owner-ordered).
- [F4 pglite hook-timeout class](f4-pglite-hook-timeout-class.md) — ✅✅ CLASS RETIRED + PUSHED 2026-07-27 (full chain ada1252d→92b88c21→250bc4cf→790aa542→498e545b→28ba808d in file): ratchet zero-tolerance 18/18, helper-name law, jurisdiction pin, 98 pglite suites full-parallel with ZERO hook timeouts; RESIDUAL CLOSED @ 82e2ff08 (UNPUSHED as of ~22:30) — exec rule requires actual PGlite usage, walk covers ALL tests/security *.test.js.
- [Table-clerk lazy pin SHIPPED](table-clerk-lazy-pin-shipped.md) — ⭐ the 5-layer `tests/build/*Lazy.test.js` recipe; E-A manifest-entry rules inside.
- [factionRename de-eager + async cascade](faction-rename-de-eager-async-cascade.md) — ⭐ COMMITTED @ b89a2025 (verified at HEAD 2026-07-30): closure 1,041,231 → 1,034,021; ⚠️ renameFactionImpl is now ASYNC and took applyRename/applyOne/commitPendingEditScope with it; `.changed` off an un-awaited promise lies silently; store-action dispatch preserved because the dead-op ratchet scans for it.
- [Soak route vocab + lattice cure](soak-route-vocabulary-mountain-pass.md) — ⭐ COMMITTED @ 5f8dc783 (verified at HEAD 2026-07-30): vocab none→mountain_pass AND correlated-selector cure (route×threat 6/18 + route×magic 12/24 → all 21 pairs 100%, full-corpus pairwise pin added); soak PASS 1200/0; ⚠️ never give a selector the same phaseEvery as one it must decorrelate from; mountain_pass = neutral 'unknown' in tradeRouteSemantics (owner-gated); keep the impossible_route_claim oracle.
- [Criminal-capture ruling RESOLVED](criminal-capture-shift-owner-ruling.md) — owner ruled "recalibrate" 2026-07-26; ~6.75% capture = accepted tuning truth.
- [Net-current extractor anchor class CLOSED](netcurrent-extractor-anchor-class-closed.md) — ⭐⭐ CLOSED+PUSHED 2026-07-27 (@ d0fdcf7c chain, hashes + shared-tree lessons inside); ⚠️ never anchor a `.not.toMatch` create-regex (5 pinned deliberate); sibling create-TRIGGER/POLICY families closed @ 064bb460.
- [Intent atlas Phase A FOLDED](intent-atlas-phase-a-folded.md) — ✅ a794a4f8 + f0586279 + cf58a1c9; deferrals live in the fold-program record.
- [⭐ EP-l self-capture class CLOSED](ep-l-selfcapture-s3-closed.md) — COMMITTED @ 11c295c1 (S3 guard verified at HEAD 2026-07-30): S3 guard + 5 gauntlet pins + leaf pin, 184/184 green; ⚠️ seaRoads.test.js's S3 cell was PINNING THE DEFECT (embattled port === home) — re-pointed; T4/embassy weak-pins deferred (chip spawned); `roads*.test.js` glob does NOT cover `seaRoads*`.
- [VersionsTab queue #18 BUILT](versionstab-queue18-build-shipped.md) — ⭐ ✅ FOLDED @ b1aeec6d 2026-07-27; ⚠️ lazy pin needs a SECOND assertion when the PARENT surface is itself lazy; delta-card prop is `heading` not `title` (census).
- [Dead-op RETIREMENT half shipped](dead-op-retirement-half-shipped.md) — ✅ FOLDED @ b1aeec6d 2026-07-27: registry 170→158; ⭐ `updateConfig` now the ONLY writer of `state.config`; 4 held ops in the DEAD_OPERATIONS comment.
- [Dead-op WIRING half shipped](dead-op-wiring-half-shipped.md) — ✅ FOLDED @ b1aeec6d + destroyed-mark cure @ a7f3d6c6, BOTH PUSHED 2026-07-28 (origin tip a7f3d6c6, owner-ordered); ⚠️ `<tr><td><Suspense>` reds jsx-a11y (fallback text goes DIRECTLY in the td, aria-label names the tr); ⚠️ pre-push hook does NOT fire from scratch worktrees (worktree-scoped hook config) AND reds on WORKING-TREE dirt (factionRename.js 2 domain-strict errors block dirty-tree pushes).

## Folded 2026-08-03 (index compaction — each file keeps its full detail)
- [WR-8 stop-gate](wr8-stop-gate-and-pulse-headroom.md) — SUPERSEDED: gate ANSWERED @ 8c8eda59 (CR-WR8-A..D); headroom cured by the war-tranche splits.
- [R-BLD-8a/8b/8c](rbld8-coalition-chooser-repairs.md) — landed @ cb681e9d; the mutant-per-pin lesson lives on in the takeover file.
- [Decomp lane D](decomposition-wave-laneD-nonwar.md) — landed @ 947799f0; npcGenerator freed; settlementSlice remainder deferred on the loadEngine gate.
- [About split](about-split-landed.md) — @ d6c5af8e + repair tails e16c3d95/aaa6f3a4; aboutMapping.js = the ONE anchor writer; PUBLISHED_ANCHORS = the public URL contract.
- [Session opened](fable-validation-session-2026-08-01.md) + pause context docs/HANDOFF_2026-08-01_PAUSE.md @ b3417677 — superseded by the takeover file. WAVE P (300y runaway, ONE defect) in [population-runaway-300y.md]; 29 war rulings (A..S) = design law.
- [T4 ONE-REGEN batch](t4-one-regen-batch-landed.md) — 2026-07-28; golden corpus = 523 rows (not 187); id-space rule inside.
- [EP-l roster amendment](ep-l-roster-row-amendment-landed.md) — swept into 11c295c1.
- [Op-retirement cascade checklist](op-retirement-cascade-checklist.md) — 5 frozen artifacts; the stale-perl-anchor lesson graduated to the standing hazards.
- 2026-07-27 FOLD PROGRAM COMPLETE + PUSHED.
- [Wave B1 neutral-connected](neutral-connected-default-wave-b1.md) — @ 3183b3b9 dark; all-pairs QUADRATIC (k-NN k=3); normalizeEdge is a WHITELIST.
- [Intent atlas soak prior](intent-atlas-soak-prior-shipped.md) @ f0586279 · [L-6 formative loop](l6-formative-loop-shipped.md) INERT (new cache-sealing edge surface must wire it) · [Capability atlas](capability-atlas-shipped.md) ~600 rows/204 gaps · [Whole-system-engineer skill](whole-system-engineer-skill-installed.md) 11 amendments veto open.
