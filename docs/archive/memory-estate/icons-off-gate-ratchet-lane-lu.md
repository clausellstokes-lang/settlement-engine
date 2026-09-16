---
created: 2026-08-03
tags: [ui, icons, ratchet, structural-prevention, hazard, lane-LU]
commits: [423270de, bc224ce2]
---

# The icons-off gate is now enforced (lane LU) — and IconButton blocks the rest

## The hazard that bit (durable, generalisable)
`src/components/primitives/IconsContext.js` documented the ratified icons-off
redesign AND NAMED ITS SEVEN CONSUMERS IN PROSE. **Four of the seven never called
`useIconsOn`** — IconButton, StateBadge, CanonBadge, PhaseBadge. Every state badge
in the product had been rendering its lucide glyph straight through the redesign
that banned it, and no test could see it.

**CLASS: a docstring that enumerates its own consumers is a claim, not a census.**
Whenever a module's comment lists "the things that consult me", that list must be
pinned from source or it will drift. Cure shipped:
`tests/lint/lucideTotality.test.js` proves membership from the source every run.

## What exists now — MAINTAIN, DO NOT BYPASS
`tests/lint/lucideTotality.test.js` (@ bc224ce2, 463 lines, 9 tests). Pattern-1
inventory ratchet over three ENUMERATED lists, frozen 2026-08-03:
- `MAP_SUBTREE` (45) — the chair's surviving Realm-map exception. **Enumerated,
  deliberately NOT a `src/components/map/**` glob** (a glob = ghost headroom).
- `GATE_PRIMITIVES` (9) — Button, Badge, BottomSheet, Dialog, ActionRail,
  FounderBadge, DesktopOnlyGate, Disclosure, InstitutionCard. Membership PROVED
  from source (the crown-jewel pin, cures the hazard above).
- `FROZEN_DIRECT_IMPORTERS` (127) — SHRINK-ONLY, exact-set equality. Deleting a
  row is the ONLY legal move. A cleared file left in the list also reds.
- `NO_ICON_CHANNEL` (3) — StateBadge/CanonBadge/PhaseBadge pinned at zero.

All three mutants proved to fire (new importer / stale row / lying primitive),
each reverted via **cp backups, never checkout** (shared tree).

## ⛔ THE BLOCKER THAT GATES THE WHOLE SWEEP — chair must rule
`IconButton.jsx`'s entire child is `<Icon size={s.icon} />` in a FIXED
24/28/36/44px box. It is icon-ONLY by construction, so gating it yields ~70
EMPTY LABELLED BOXES, not quieter controls. **55 of the 127 remaining offenders
carry an IconButton, and only 8 files sit in families with none** — so this is
not a side question, it gates whole-family closure across nearly the whole estate.
Two cures, chair picks:
 (a) a `glyph` prop — each call site supplies the unicode text twin (RECOMMENDED:
     matches Badge/Dialog/BottomSheet, keeps density, degrades gracefully)
 (b) relax the fixed box, render the REQUIRED `label` as text (total immediately,
     but restyles 70 surfaces incl. some under the fenced nav lane)

## Sweep recipe (in the test header too)
1. icon passed to a gated primitive → already suppressed; deleting the prop is
   dead-code removal, ZERO layout delta.
2. direct render → delete the render **AND ITS SLOT**. A bare icon in a `gap`
   flex row is safe alone; an icon in its OWN sized/bordered element takes the
   element with it (see Dialog.jsx, DesktopOnlyGate.jsx, InstitutionCard.jsx).
   ⚠️ The literal SPACE in `<Icon /> {label}` is itself a dead slot — remove it.
3. affordance (close/chevron/+/-) → keep a channel: unicode TEXT glyph, which
   IconsContext rules "not icons and unaffected by this gate".
4. delete the file's row from FROZEN_DIRECT_IMPORTERS.

## Open chair question (recorded, not decided)
`MAP_SUBTREE` is the map subtree AS TODAY (chair's "opt in as today"), which is
WIDER than a diagram: ~42 of 45 are panels/toolbars whose icons are chrome; only
MapLegend/TierIcon/RelationshipEdges match the stated reason "icons encode data".
Narrowing is a chair call.
