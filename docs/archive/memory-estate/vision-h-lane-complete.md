---
name: ""
metadata: 
  node_type: memory
  title: "VISION LANE V-H complete (R-20..R-24) — palette, visible undo, empty rooms, error register, name audit"
  date: 2026-07-20
  tags: 
    - vision-wave
    - lane-complete
    - R-20
    - R-21
    - R-22
    - R-23
    - R-24
    - not-folded
  branch: claude/vision-h
  tip: 3668f33c
  base: 212758ad
  originSessionId: ff8b4b71-3ea5-4d7a-9793-42190018c11f
  modified: 2026-07-20T15:58:40.343Z
---

## What shipped (4 commits on claude/vision-h, tip 3668f33c, NOT folded/pushed)
- **a 30155087 — R-22 empty states**: new FLAT primitive `src/components/primitives/EmptyState.jsx`
  (clerk's-note idiom, no radius/shadow/tint, role="note"); adopted in GalleryMaps,
  GalleryCampaigns, ChroniclePanel, ServicesTogglePanel. First-open (CampaignEmptyState)
  + empty-library (SampleDashboard) already met the bar, left untouched. Pin: tests/ui/EmptyState.test.jsx.
- **b 932b732b — R-23 error-copy register**: 8 literals across 5 files → `t('errors.*')`
  (en.js errors namespace extended); shrink-only source-scan ratchet
  `tests/lint/errorCopyBaseline.test.js` + `scripts/.error-copy-baseline.json` frozen at
  **53 occurrences / 21 offender files**. Detector ignores the t()-migrated form,
  `e.message || 'x'` dynamic, and console.error (10-case proof).
- **c a0707902 — R-21 visible undo**: lazy `src/components/UndoHistoryPanel.jsx` surfaces the
  session `pulseUndoStack`; per-row "Return here" = existing `undoLastPulse` called (k+1)×
  (walk-back, NO new machinery). SECRETS-SAFE: rows read only calendar/interval/time scalars,
  never the snapshot body (covert marks live there). Mounted from WorldMapToolbar (WorldMap.jsx
  is at its 600 ceiling). Pin: tests/ui/UndoHistoryPanel.test.jsx.
- **d 3668f33c — R-20 command palette**: cmd/ctrl-K. Eager sliver `CommandPaletteHost.jsx`
  (key listener only, +562 B eager) + lazy `CommandPalette.jsx` (aria-combobox, jumps to
  pages/settlements/figures via navigate()). App.jsx held at EXACTLY 732 (net-zero combines).
  Pins: tests/ui/CommandPalette.test.jsx, CommandPaletteHost.test.jsx, tests/build/commandPaletteLazy.test.js.

## R-24 FINDING (pin-or-report → REPORT; no code change, owner-gated to fix)
Realm-scale name dedup: **faction names ARE deduped** (`dedupeWorldFactionNames`,
composeInstantWorld.js:168, F4 `_slot || compareCodepoint` tie-break) and already
PINNED (tests/lib/instantWorld/factionDedup.test.js:90-95). **Settlement names have NO
realm-scale dedup** and **NPC names have NO dedup at any scale** — the composer mints each
settlement independently; only faction dedup runs post-pass. Settlement pool ~900/culture
(≈15-20% collision for a mono-culture realm); NPC first-name pool ~119. Fixing needs
generation changes = golden-shift = OWNER-GATED. Evidence: assembleSettlement.js:71
(generateSettlementName, no used-set), npcGenerator.js:67/197 (pickFirst, no dedup).

## Gate (all green; NOT the full suite — brief's enumerated gates + verify:dist)
strict 0 · tsc 0 · lint 0 err · 149 focused+regression tests · build clean ·
verify:dist 165 tests · **closure 1,025,296 ≤ 1,040,000 (14,704 headroom; +562 B vs base
1,024,734, the palette host)**. Parked-golden set unaffected (no engine/gen/pdf code touched).

## FENCE (V-B territory) honored — seam-reports for the manager at fold
- R-22 no-news-yet: `WizardNewsPanel.jsx` (fenced) `emptyText` at :493/:502 — adopt EmptyState there at fold.
- R-23: `WizardNewsPanel.jsx` (2 literals) + `campaignSlice.js:193/:418` stay FROZEN in the error-copy
  baseline (fenced) — migrate to t('errors.*') and strike from `.error-copy-baseline.json` at fold.

## Vetoable judgments
- R-20 palette sources = the WHOLE saved-settlement library + all their NPCs (not only the active
  campaign), for a more useful jump bar. One-line filter to scope to active campaign if the owner prefers.
- R-22 built a NEW flat primitive rather than generalizing the GOLD-callout CampaignEmptyState (touching
  it would shift the tinted-callout kill-list count and is an aesthetic/taste call).
- See sizebaseline-exact-ceiling-hazard.md for the App.jsx=732 / WorldMap.jsx=600 net-zero technique.
