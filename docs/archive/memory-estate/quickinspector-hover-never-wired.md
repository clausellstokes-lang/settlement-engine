---
name: quickinspector-hover-never-wired
description: "Map-icon hover-peek was NEVER wired originally (QuickInspector's MapOverlay docstring was aspirational since birth; NOT a wave-4f-2 regression). NOW BUILT 2026-07-14 as new wiring on PlacementsLayer (review-fixes, unstaged) — see the BUILT + VERIFIED note."
metadata: 
  node_type: memory
  type: project
  originSessionId: 025c2556-cdab-451d-8731-2d5ac85c7bb8
---

RESOLVED (2026-07-14): docstring CORRECTED @ ccd0d670 (master lineage, branch
claude/confident-leavitt-5b2441) to name SettlementPalette as the real emitter + note the
unimplemented original intent; review-fixes-2026-07-08 needs the same via cherry-pick (its checkout
had foreign WIP). Wiring the map-marker hover was DECLINED (new interaction — markers use
onPointerDown for drag; touch/debounce Qs). VETOABLE — say "wire map hover" to build it + a guard test.

STATUS CHANGE (2026-07-14, later): the owner EXERCISED the veto — a launched brief commissioned the
map-icon hover wiring on review-fixes-2026-07-08 (pointer handlers on placement icons emitting
setHoveredSettlementId/clearHoveredSettlementId, selection-wins gating, guard test, budget-neutral,
no golden shift). The brief framed it as "restore lost emission / wave-4f-2 casualty" — that framing
stays FALSE (verified again on both lineages this session: only SettlementPalette emits; PlacementsLayer
binds only drag onPointer{Down,Move,Up,Cancel}); build it as NEW wiring, nothing to compare against on
master (master's guard test ab1c30ba covers data-map-overlay-svg only).

BUILT + VERIFIED + COMMITTED (2026-07-14): the wiring shipped on review-fixes-2026-07-08 (tip 5a78af5a)
in worktree `hungry-driscoll-e12282`, COMMITTED @ 4d669b32 (owner said "commit" — the brief's "leave
unstaged" default overridden in-chat). NOT pushed. lint-staged pre-commit hook ran but rewrote nothing
(disk hash == HEAD blob, matches gate-verified bytes). Changes — all inside src/components/map/
(lazy subtree → first-paint budget untouched, no dist build needed; no golden surface):
- `PlacementsLayer.jsx`: `onPointerEnter`/`onPointerLeave` on each placement-icon wrapper `<g>` emitting
  `setHoveredSettlementId(it.settlementId)` / `clearHoveredSettlementId()`. Touch guard
  (`if (e.pointerType === 'touch') return`) — a tap fires pointerenter with no paired leave → would stick.
  Enter/leave (NOT over/out) so a multi-shape glyph's internal transitions don't re-fire. Drag-start
  clears the peek in `handleDragPointerDown` (pointer capture swallows the pairing leave). Selection-wins
  is left to QuickInspector's existing `if (selectedId) return null` gate (matches the palette — no emitter
  check needed). Added `data-hover-settlement-id={settlementId}` as the guard-test anchor.
- `QuickInspector.jsx`: docstring now names both real emitters (PlacementsLayer + SettlementPalette).
- NEW `tests/ui/placementsLayerHover.test.jsx`: 4 asserts (mouse-enter emits, leave clears, touch no-emit,
  drag-start clears). Proven to have teeth via negative control (breaking each wiring → the matching test
  fails). Full gate GREEN: tsc 0, eslint 0, vitest 8719 pass + 11 skip / 788 files.
KEY MECHAN: `hoveredSettlementId` is EPHEMERAL top-level store state (NOT part of persisted `mapState`),
auto-cleared only on `resetMapState` (campaign deselect) — no persistence/undo lifecycle to thread.
NOTE: only PlacementsLayer owns hoverable settlement icons; MarkersLayer = annotation pins
(selectedAnnotationId), HitLayer = invisible annotate click-catcher — correctly excluded. Map SVG icons
aren't focusable, so there is no keyboard-hover analog (the map is an untabbable surface, per palette F28).

Recon hypothesis DISCONFIRMED (2026-07-14). QuickInspector.jsx (src/components/map/) claims in its
docstring: "The hover-emit lives in MapOverlay (placement marker handlers)." A recon suspected this
was a second silent casualty of the wave-4f-2 merge (like the real
[[map-overlay-svg-attr-lineage-gap]]), i.e. that master still emitted map-marker hover and
review-fixes lost it.

That is false. Evidence:
- The ONLY `setHoveredSettlementId` caller is `SettlementPalette.jsx` (list-card hover) — on
  review-fixes (1ccf84a9), master (d024286e), AND the merge-base (acf59a00). The map never emitted it.
- `git log --all -S setHoveredSettlementId -- src/components/map/*` returns exactly ONE commit:
  9868fd52 (Phase 108 W9), the feature's *birth* — which added only the palette-hover.
- That birth commit's QuickInspector already contained the "hover-emit lives in MapOverlay" line
  verbatim → aspirational from day one.
- Marker/hit/placement layers (PlacementsLayer/MarkersLayer/HitLayer) bind only
  `onPointer{Down,Move,Up}` — no hover events, on either lineage. And no file `MapOverlay.jsx`
  exists under src/components/map/ at all (the real one is src/components/MapOverlay.jsx, the layer
  composition root, which does not emit hover).

So: the hover-peek fires ONLY from the SettlementPalette list, never from hovering map icons. This
is a stale docstring + an unimplemented design intent — NOT a merge regression.

**Why:** matters because "restore hover from master" was the conditional fix premise; the premise
is false — there is nothing on master to restore. Wiring map-marker hover would be NEW capability
(owner-gated: new-capability-vs-repair), not a repair.

**How to apply:** don't re-file as a regression. If the owner wants it, two separate owner-gated
choices: (1) correct the docstring to say the emitter is SettlementPalette; (2) wire map-marker
onPointerEnter → setHoveredSettlementId as new work (add a guard test then).
