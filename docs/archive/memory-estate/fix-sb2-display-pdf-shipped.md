---
name: ""
metadata:
  node_type: memory
  title: FIX WAVE SB2 shipped — display/chronicle/DM-screen/PDF (11 findings)
  date: 2026-07-21
  branch: claude/sb2-display-pdf
  commit: a997039b
  base: 084549e4
  status: committed NOT folded/pushed
  tags:
    - fix-wave
    - display
    - chronicle
    - dm-screen
    - pdf
    - world-book
    - session-ledger
  originSessionId: ff8b4b71-3ea5-4d7a-9793-42190018c11f
  modified: 2026-07-21T04:08:31.356Z
---

# FIX WAVE SB2 shipped — the display layer reads true

**State:** claude/sb2-display-pdf @ **a997039b** (base 084549e4, worktree vision-i, NOT folded/pushed). 16 files, 545+/28−, one gated commit. Gate: domain-strict 0 · full tsc 0 · eslint 0/0 on touched · 131 focused tests + 3 goldens GREEN (timelineTrackGolden / ageOverlayGolden / chroniclersLetterGolden) · 4 lane-end ratchets GREEN · tests/pdf 292/293 (the 1 red = parked goldenViewModel, verified identical on clean base in a temp worktree) · NUL scan clean. ONE-REGEN QUEUE: empty.

## What shipped (10 fixed/deferred, 1 struck)
- **TimelapsePanel** unmount now RESTORES the pre-mount `timelapseTick` (ref captured at first render) instead of null — the town map's "Show the years" selection survives a Timelapse visit. Mount-still-activates is design, kept.
- **Session Ledger**: stressor picker + clerk vocabulary go through `canonStressors`; exposure offers ONLY `exposureTargets()` — a **mirror of affordanceManifest.compromisedTargets living in domain/tableLedger.js** because the manifest is a LAZY LEAF pinned to the composer chunk (cross-chunk import = the recorded chunk-rebalance hazard). Parity-pinned in tests/domain/tableLedger.test.js — keep the pin if either side moves.
- **World Book**: chronicle chapter sorts ASCENDING by tick (production feed is newest-first; the old pin's hand-ascending fixture never saw it); player mode feeds `collectRealmSummary` a covert-filtered wizardNews projection so realm majors/arcs agree with the player chronicle; map/receipts read only mechanical fields (documented in-code).
- **wizardNews.normalizeEntry** now passes `covert: true` through (conditional spread, the V-17 `source` idiom — byte-neutral for every generated feed since nothing writes covert today) so the book's `isCovertEntry` player filter is live end-to-end.
- **buildTimelineTrack** same-tick records now COLLAPSE into one frame (the documented contract) — findIndex-by-tick and frameAtTick can no longer resolve different frames.
- **ChronicleScrollback** anchors the scrub selection to a TICK (null = follow newest); a new advance prepending a frame no longer shifts the DM's selection.
- **Counterseal mirror test** now pins per-element PAINT ROLE (fill vs stroke) + stroke widths + the rendered react-pdf paint props — a role flip can no longer pass on geometry equality alone.
- **DEFERRED (documented in ageOverlay.js header, GROWTH-VS-SCRUB):** aged-map growth infill ignores the scrub week — the fabric mirror has no per-week stock history; the cure is a timestamped stocks history = new persisted signal = owner-gated schema change.
- **STRUCK (stale):** "compaction strips stressor.covert" — SS2 @ 525e0979 already preserves covert in compactOutcomeForHistory (top-level + stressor).

## Hazards / follow-ups for the fold
- ⚠️ **SB1 seam left open (deliberate):** `applyTableEvent` (src/store/settlementRenameHelpers.js) still ignores the mutation's veto result and commit clears the queue — the picker fix removes the trigger (no un-vetoable target can be picked), but the store-side success-ghosting itself is SB1's perimeter.
- ⚠️ Player-face covert redaction in the realm chapter is LATENT until something writes covert marks into wizardNews (imports/future producers) — the pins exercise it with fixtures.
- Behavior shifts declared in the commit body: book chronicle order (oldest-first on real feeds) + player realm covert drop. No golden moved.
