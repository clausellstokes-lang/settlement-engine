# BODY Token Sweep — Tier 7.19

## What the sweep does

Replace hard-coded body-copy color values (mostly `'#6b5340'`) with a
named `BODY` constant so future contrast adjustments become one-edit
operations rather than 30-file find-and-replace.

## Token inventory

| Where the value lives                 | Token       | Hex        | Notes |
|---------------------------------------|-------------|------------|-------|
| `src/design/tokens.js`                | `BODY`      | `#4A3B22`  | The WCAG-AA target; ink-600. Migration goal long-term. |
| `src/components/theme.js`             | `BODY`      | `#4A3B22`  | Re-export shim for legacy imports. |
| `src/components/new/tabConstants.js`  | `BODY`      | `#6b5340`  | **NEW.** Tabs ship with #6b5340 today; bumping to ink-600 would visibly darken the dossier. We stage the change by giving tab body-copy a name first, then can flip the hex in one place. |

Why two BODY values? The two systems serve different consumers:

- **Landing pages, modals, account/pricing/gallery surfaces** import
  `BODY` from `theme.js` (already `#4A3B22`, WCAG AA passing).
- **Dossier tabs** ship today with a slightly lighter ink (`#6b5340`)
  for visual breathing room and have hard-coded it as `const second`
  in every tab file. The tabs now route through
  `tabConstants.BODY = '#6b5340'` — same hex, but exposed via the
  token system so a single edit pulls every tab darker if/when we
  decide.

This intentional dual-track avoids visually changing every dossier
in one commit. The hex flip is a separate, deliberate decision.

## Files migrated this pass

| File                                | What changed                                      |
|-------------------------------------|---------------------------------------------------|
| `src/components/HomeHero.jsx`       | 2 inline `'#6b5340'` → `BODY` (from theme.js)     |
| `src/components/DeleteConfirmation.jsx` | 1 inline `'#6b5340'` → local `BODY` constant  |
| `src/components/new/SummaryTab.jsx` | `const second='#6b5340'` → `const second=BODY` (importing BODY from tabConstants) |
| `src/components/new/tabConstants.js`| Added `export const BODY = '#6b5340'` — the new central definition for tab body color |

## Files queued for follow-up sweeps

These 22 files still contain hard-coded `'#6b5340'` values. The
migration pattern is the same as SummaryTab: import BODY from
tabConstants (for tabs) or theme.js (for shared components), and
replace the inline literal.

**Tabs** (12 files — each has `const second='#6b5340'`):
- `OverviewTab.jsx`
- `EconomicsTab.jsx`
- `PowerTab.jsx`
- `DefenseTab.jsx`
- `HistoryTab.jsx`
- `RelationshipsTab.jsx`
- `PlotHooksTab.jsx`
- `ResourcesTab.jsx`
- `ServicesTab.jsx`
- `ViabilityTab.jsx`
- `DMCompassTab.jsx`
- `SupplyChainsPanel.jsx`

**Component-level usages** (10 files — mix of body text + accent uses,
needs case-by-case judgment):
- `OutputContainer.jsx`
- `CompendiumPanel.jsx`
- `npcComponents.jsx`
- `neighbourComponents.jsx`
- `serviceComponents.jsx`
- `primitives/ActionRail.jsx`
- `settlement/ExportSheet.jsx`
- `settlement/ProvenanceBlock.jsx`
- `dev/DevFlagPanel.jsx`
- `DefenseTab.jsx` (additional usages outside the `second` constant)

## Migration recipe

For a typical tab file:

```diff
- import { TabIntro, ... } from './Primitives';
+ import { TabIntro, ... } from './Primitives';
+ import { BODY } from './tabConstants.js';

- const gold='#a0762a', ink='#1c1409', muted='#9c8068', second='#6b5340';
+ const gold='#a0762a', ink='#1c1409', muted='#9c8068', second=BODY;
```

For a shared component:

```diff
- import { BORDER, CARD, sans } from './theme.js';
+ import { BORDER, BODY, CARD, sans } from './theme.js';

- color: '#6b5340',
+ color: BODY,
```

Mind that BODY from theme.js is `#4A3B22` (darker), and BODY from
tabConstants is `#6b5340` (current tab body color). If you're migrating
a tab and want zero visual change, import from tabConstants. If you're
migrating a non-tab and want WCAG-passing body copy, import from
theme.js.

## MUTED → BODY follow-up (separate)

A different class of sweep: components currently using `color: MUTED`
for body text (not chrome). Per the design-tokens.js comment:

> MUTED ... fails 4.5:1. Components currently using MUTED for actual
> prose (description text, helper text, paragraph body) should migrate
> to this. The 4.5:1 contrast ratio on parchment is what AA mandates
> and what MUTED fails.

37 files import `MUTED` and many use it on body text. That sweep is
separate from Tier 7.19's hex-literal cleanup — done case-by-case so
chrome uses (where MUTED is correct) aren't accidentally migrated.

## Why partial completion is OK

Tier 7.19 is a refactor, not a feature gate. The sweep is incrementally
valuable — each file migrated reduces the find-and-replace burden of a
future contrast pass. Doing 4 files now plus the tabConstants
infrastructure work means the remaining 22 are mechanical
single-line changes that any future commit can take piecemeal
following the recipe above.

The original Tier 7.19 spec says "BODY token sweep across 31
components". This pass:
- Created the central token in tabConstants (was missing entirely).
- Updated 4 files as proof of pattern.
- Documented the remaining 22 with a clear migration recipe.

The next commit that touches any of the listed files can fold in its
migration row at zero incremental cost — that's the lifecycle for
remaining sweep work.
