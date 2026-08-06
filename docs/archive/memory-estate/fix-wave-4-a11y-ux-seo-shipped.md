---
name: ""
metadata: 
  node_type: memory
  created: 2026-07-20
  type: milestone
  scope: fix-wave-4 (a11y/UX/SEO) on claude/composite-r4
  commit: 84a34cfa
  status: "shipped, NOT folded/pushed"
  originSessionId: ff8b4b71-3ea5-4d7a-9793-42190018c11f
  modified: 2026-07-21T02:00:54.365Z
---

# Fix wave 4 shipped — hover states, keyboard escape, honest canonicals

ONE commit 84a34cfa on claude/composite-r4 (minifold worktree, base e457d923). Closure 1,038,150 / 1,040,000 (Δ +66 eager — the two primitives' published custom properties only). Gate: domain-strict 0, tsc 0, eslint 0 on touched, ratchets 132/132, surfaces 52/52, VERIFY_DIST tests/build 197/197, NUL clean.

## What landed (4 findings)
1. **idx7 hover** — Button/IconButton publish `--sf-btn-bg` (+ IconButton `--sf-btn-hover-bg` from its previously-dead TONES.hover data); `.sf-btn` rules in `src/styles/a11y.css` supply base + `:hover:not(:disabled)` with a color-mix ink fallback. Enforcer: state-set completeness suite in `tests/components/designPrimitives.test.jsx` (CSS machinery pins + 10-variant/6-tone census).
2. **idx37 keyboard trap** — deleted the blanket wrapper `onKeyDown stopPropagation` in `CommandPalette.jsx` (React root attachment meant NO keydown from inside ever reached the window-level trap/host). Pins now fire from INSIDE the dialog.
3. **idx28 (PARTIAL)** — SettlementPalette hint leads with the real keyboard outcome (QuickInspector overview peek) instead of dead-ending; pointer-drag instruction retained.
4. **idx36 canonical** — `injectGalleryMeta` (api/_galleryMeta.js) now stamps `link rel=canonical` in lockstep with og:url; covers gallery-meta.js + meta-shell.js at the chokepoint; per-kind round-trip pins in tests/build/.

## Why / hazards worth keeping
- ⚠ **Window-listener dialogs vs wrapper stopPropagation**: the shared `useDialogFocusTrap` AND CommandPaletteHost listen on **window**; ANY wrapper stopPropagation on keydown inside such a dialog silently kills Escape/Tab/chords (React 17+ root attachment). Canonical pattern (Dialog/BottomSheet) never stops keydown. Test-shape trap: pins that dispatch on `window` directly CANNOT see this bug — pin from inside the dialog node.
- ⚠ **Primitive hover mechanism**: inline `background` beats any class rule, so hover lives on CSS custom properties published inline + class rules in a11y.css. A caller inline `background` override deliberately wins (e.g. CommandPalette active row). Don't reintroduce inline `background:` in Button/IconButton — it would sever the hover machinery (the designPrimitives census will red).
- rawColorLiteral ratchet walks `.js/.jsx/.ts/.tsx` ONLY — the `#1c1409` in a11y.css is not counted.

## Scoped follow-on (deliberately deferred — documented, not a bug to re-find)
**Keyboard placement commit for the world map** (idx28 remainder): a real keyboard flow needs a target semantics — FMG placement resolves a pointer coordinate through the iframe bridge (`bridge.placeSettlement({x,y})` iframe-relative; image mode inverse-projects through the overlay transform). Suggested shape: place-at-view-centre commit (image mode via store `addPlacement`, FMG via bridge at iframe centre), fine-tune by pointer. Blockers that made it a follow-on, not part of this wave: WorldMap.jsx is at its tolerance-0 sizeBaseline ceiling (any net line rejects) and the flow needs bridge/iframe refs held only there.
