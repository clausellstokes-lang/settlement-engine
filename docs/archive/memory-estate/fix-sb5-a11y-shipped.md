---
name: ""
metadata: 
  node_type: memory
  created: 2026-07-21
  type: wave-shipped
  scope: SB5 accessibility / UI-UX craft (batch B r2)
  commit: "201f5f53 on claude/sb5-a11y (base de590e3c, NOT folded)"
  originSessionId: ff8b4b71-3ea5-4d7a-9793-42190018c11f
  modified: 2026-07-21T05:11:21.729Z
---

# SB5 a11y/craft wave shipped @ 201f5f53 (claude/sb5-a11y)

19 findings: 8 fixed, 3 partial, 8 verified-deliberate → owner flags. One
commit, 20 files (+587/−105). Gate: domain-strict 0 bare · tsc 0 · lint 0
(2 pre-existing warnings confirmed at base) · 62 + 110 + 142 focused tests
green · re-gated green on the committed tree post-hook · NUL clean · closure
Δ = 0 eager bytes (static trace: all touched src modules lazy).

## Durable hazards / mechanisms
- ⚠ **primitives/Toast.jsx has ZERO production importers** — it is the intended
  chokepoint only; the LIVE toasts are inline (WorldMapOverlays for the world
  map — which had NO live semantics until SB5 — and per-component role=status
  regions). Adoption of the primitive by hosts is a recorded deferral.
- ⚠ **useDialogFocusTrap now skips tabindex="-1" descendants** in focusables()
  (browser Tab-order semantics). CommandPalette's roving role=option buttons
  DEPEND on this — reverting the filter breaks palette Tab containment.
- ⚠ **Window-dispatched keydown tests are a blind spot**: a wrapper
  stopPropagation kept UndoHistoryPanel's Escape/Tab broken while
  window-dispatched pins stayed green. Keyboard pins must ORIGINATE on
  in-dialog nodes (fireEvent.keyDown on the element, not window).
- **Persistent-polite-announcer pattern** (WCAG 4.1.3): role=status must
  pre-exist EMPTY and receive text as a CHANGE; role=alert may mount with
  content. Applied: Toast primitive, WorldMapOverlays, GalleryHubPage notice.
  DEFERRED sweep: PurchaseModal, SettlementsPanel, PricingPage, auth pages ×3,
  surveyorPanelKit, PendingChangesBar, BulkActionBar still mount role=status
  with text.
- **FMG iframe is now aria-hidden + tabIndex -1** (pointer unchanged); the
  sr-only "world map, in words" summary in WorldMapStage (data-testid
  world-map-in-words) is the SR equivalent — full spatial lens (roads,
  adjacency) deferred as a feature lane.
- Ratchet positions after SB5: errorCopy budget **48** (3 files struck),
  rawButton budget **45** (= measured; conversions are TASTE, owner),
  rawColor **1403 taut** (burn-down owner-queued; rule flips on at zero).
- New walkers: tests/ui/dossierTabGroups.walker.test.js (declared ⇄ registered
  24⇄24) · tests/docs/opsScriptsExist.test.js (probe/alarm/drill/load-test).
- CommandPalette strings live at t('palette.*'); localeParity test now
  honestly claims KEY parity only (extraction completeness has no gate;
  pseudo-locale visual QA is the instrument).

## Owner flags carried out of SB5
raw-button burn-down conversions (visual) · PipelineRail trigger emphasis ·
mobile realm gate + free-tier living-world (paid surface) · perf budget
ratification (e2e header) · VITE_ERROR_REPORT_URL deploy wiring · health
endpoint scheduling/monitoring · rendered-tree contrast scan (lane-scale).
