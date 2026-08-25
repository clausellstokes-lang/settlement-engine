---
name: map-overlay-svg-attr-lineage-gap
description: "⚠️ LIVE on the phase55 lineage: MapOverlay lost data-map-overlay-svg in the wave-4f-2 merge, so campaign thumbs composite bare terrain — a master-merge reconciliation item; guard test exists on the master lineage"
metadata: 
  node_type: memory
  type: project
  originSessionId: 99c46bda-1e45-48c3-92d1-1355f8153617
---

`src/lib/mapThumb.js` `serializeOverlaySvg` composites the settlement-markers overlay onto campaign
gallery thumbnails via `document.querySelector('[data-map-overlay-svg]')`. The attribute lives on
MapOverlay.jsx's root `<svg>`. As of 2026-07-14:

- **Master lineage (this branch family): contract INTACT.** The gallery foundation commit
  `3c9ad9ad` (2026-06-25) added the query and the tag together; both present ever since.
- **Phase 5.5 lineage: contract BROKEN and LIVE** on `review-fixes-2026-07-08` (local + origin)
  and every offshoot checked (round21-*, phase55-*, review-fix-golden-track, usage-telemetry, …).
  The "Merge wave 4f-2" commit (`9b092d55`) ported mapThumb.js onto that lineage, but the
  spatial-engine-rewritten MapOverlay.jsx kept its own version and silently dropped the tag —
  every `map_with_campaign` thumb there composites bare terrain, invisibly, because a null overlay
  is the documented best-effort fallback. A review finding dispatched 2026-07-14 described this as
  "never set anywhere"; that grep was true only of the phase55 lineage.

**Why:** This is a concrete instance of the [[third-lineage-mystifying-ride]] collision class —
a cross-lineage port that lost its counterpart edit in the 3-way. It will NOT self-heal: the
master-merge must keep the attribute wherever MapOverlay.jsx resolves.

**How to apply:** (1) During any master↔review-fixes reconciliation, verify the merged
MapOverlay.jsx root `<svg>` still carries `data-map-overlay-svg`. (2) The guard is
`tests/components/mapOverlayThumbContract.test.jsx` (commit `ab1c30ba` on
claude/brave-babbage-67b994, proven non-vacuous: stripping the attribute fails 2 pins) — once that
test is present in the merged tree, the gate catches the drop automatically; until then it is a
manual check. (3) If fixing the phase55 lineage directly, the fix is one line: add
`data-map-overlay-svg=""` to the MapOverlay root `<svg>` (~line 240 there), plus cherry-pick the
guard test. Related: [[comprehensive-review-fix-program]], [[reconciliation-decisions]].
