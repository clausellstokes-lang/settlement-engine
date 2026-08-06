---
name: ""
metadata:
  node_type: memory
  title: "ENFORCER E-I shipped — keyboard map-placement (bar 9), eager Δ=0 CONFIRMED at the 29 B margin"
  date: 2026-07-21
  tags:
    - tranche-2
    - enforcer
    - E-I
    - accessibility
    - bar-9
    - keyboard-placement
    - not-folded
  branch: claude/e-i-keyboard
  tip: ed704fe9
  base: b339e178
  originSessionId: ff8b4b71-3ea5-4d7a-9793-42190018c11f
  modified: 2026-07-21T07:43:34.146Z
---

# ENFORCER E-I shipped — keyboard map-placement @ claude/e-i-keyboard ed704fe9 (base b339e178, NOT folded)

**What:** THE_APLUS_EXECUTION_ARCHITECTURE §E-I (bar 9, repo-provable half). Enter on a
placeable SettlementPalette card arms a keyboard placement session over the map; arrows steer
(Shift = 10% steps), Enter commits, Escape cancels, focus returns to the card. ONE commit
ed704fe9; 6 files; the 4-parked-goldens expectation untouched (no full suite run — focused
gates only, per the brief).

**Architecture (the budget-driven shape):**
- `src/components/map/KeyboardPlacementControl.jsx` — NEW lazy leaf, own chunk, mounted only
  when a session arms. WorldMap.jsx has ZERO edits (tolerance-0 at exactly 600 effective);
  the session is hosted by **WorldMapStage** (274 effective, already holds bridgeRef/
  iframeRef/mapContainerRef/overlayTransformRef). JUDGMENT (vetoable): stage-hosting over the
  brief's literal "net-zero hook in WorldMap" — same lazy-leaf architecture, no ceiling risk.
- NO second commit path: FMG mode drives `bridge.placeSettlement` (handleDrop's exact seam;
  the `fmg:settlementPlaced` echo runs the store's authoritative addPlacement gate); image
  mode reuses handleDrop's inverse-projection → addPlacement directly.
- ONE announcer: the palette's F28 aria-live footer, exposed to the stage via `announcerRef`
  (the transformOut ref idiom). `PLACEMENT_REJECT_COPY` is now exported from useMapBridge so
  the gate's refusals have one spelling in toast + live region.

**Budget receipt:** closure 1,039,971 / 1,040,000 (29 B margin). Δ = 0 bytes CONFIRMED —
base b339e178 built in a detached temp worktree, both dists measured with vendorPdfLazy's own
BFS: 1,039,971 → 1,039,971. No owner-reclaim dependency.

**Hazards learned (durable):**
- ⚠ `fmg:settlementPlacedReply` resolves ONE message-task BEFORE the `fmg:settlementPlaced`
  push commits to the store (sf-bridge posts reply then push) — anything confirming a
  placement after `await placeSettlement()` must POLL the store briefly (the control's
  `waitForPlacement(reply.burgId)`); an immediate read is a false "not placed".
- ⚠ Three ratchets bite new map-UI code beyond the memorized four: `fallback={null}` Suspense
  pin (tests/lint/loadingNarrationRatchet — new boundaries need a NARRATED fallback),
  boxShadow kill-list ceiling (use `outline` for contrast rings — "depth is ink"), and
  tests/lint/clampPrimitiveBaseline (NEVER define a local clamp/clamp01 — import
  `src/kernel/math.js`).
- ⚠ A scratchpad-located temp worktree does NOT walk up to the main tree's node_modules
  (`vite: command not found`); symlink `node_modules` from the main tree into it to build.
- tests/ui/settlementPalette.a11y.test.jsx now pins the E-I contract (arming, honest
  blockers, announcerRef seam) — the old "mouse or touch" dead-end assertions are GONE by
  design; don't "restore" them.

**How to apply:** fold this branch like the other enforcer lanes; the new pin is
tests/ui/keyboardPlacement.test.jsx (6 tests, live mapSlice store — a real gate round-trip,
not mock theater). At fold, re-measure the closure (the 29 B margin is the whole game).
