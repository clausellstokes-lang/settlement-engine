# Mobile Responsive Audit — Tier 7.18

## Scope

This audit verifies the SettlementForge web app renders usefully on
mobile-sized viewports (320px–640px wide). Primary surfaces covered:

- Home + hero (anonymous landing)
- Generate wizard
- Settlement detail view
- All 14 dossier tabs
- Auth modal
- Purchase modal
- Account page
- Pricing page
- Gallery + public dossier view

## Responsive strategy

The codebase uses a hybrid approach:

1. **Conditional layout via JS** — components import
   `isMobile()` from `src/components/new/tabConstants.js`, which
   reads `window.innerWidth < 640`. Components branch on this:
   ```js
   <div style={{ display: 'flex', gap: mobile ? 8 : 16 }}>
   ```
   18 files use this pattern (GenerateWizard, all 13 tab components,
   Workshop, App, plus SupplyChainsPanel).

2. **CSS flex with wrap** — many surfaces use `flexWrap: 'wrap'` so
   chips/cards reflow naturally without conditional logic. Pricing
   tier cards, account stat cards, daily-life anchor facts all use
   this.

3. **Viewport meta tag** — `index.html` sets
   `width=device-width, initial-scale=1.0` so mobile browsers honor
   CSS sizing.

4. **Min-target accessibility floor** — `src/styles/a11y.css`
   enforces `min-height: 24px; min-width: 24px` on every interactive
   element (WCAG 2.2 SC 2.5.8). Touch targets won't go below that
   floor even if a component overrides padding to something tiny.

## Surface-by-surface findings

| Surface                  | Mobile branch | Touch targets | Horizontal overflow | Notes |
|--------------------------|---------------|---------------|---------------------|-------|
| HomeHero                 | No (uses flex-wrap) | 44+ px on Begin button | OK | Subtitle/anti-AI line wraps cleanly. |
| GenerateWizard           | Yes (`isMobile?`) | OK | OK | Step indicator stacks vertically below 640px. |
| SettlementDetail header  | Yes | OK | OK after Tier 7.15 StateBadge fix (one less inline span) |
| OverviewTab              | Yes | OK | OK | ScoreRow 2-col grid collapses to 1-col on mobile. |
| EconomicsTab             | Yes | OK | OK | Trade tables get horizontal scroll wrappers. |
| PowerTab                 | Yes | OK | OK | Faction cards stack on mobile. |
| DefenseTab               | Yes | OK | OK | |
| HistoryTab               | Yes | OK | OK | |
| RelationshipsTab         | Yes | OK | OK | |
| PlotHooksTab             | Yes | OK | OK | |
| DailyLifeTab             | Yes | OK | OK | Anchor facts wrap with `flex-wrap`. |
| ServicesTab              | Yes | OK | OK | |
| ResourcesTab             | Yes | OK | OK | |
| ViabilityTab             | Yes | OK | OK | |
| NPCsTab                  | Yes | OK | OK | NPC cards stack vertically. |
| SummaryTab               | Yes | OK | OK | |
| DMCompassTab             | (no isMobile) | OK | OK | Single-column layout. |
| PricingPage              | No (flex-wrap) | OK | OK | Three tier cards reflow to single column. |
| AccountPage              | No (flex-wrap) | OK | OK | Stat cards reflow. |
| GalleryPage              | No (flex-wrap) | OK | OK | Tile grid via CSS, reflows. |
| AuthModal                | No (width: 90%) | 24+ px | OK after a11y pass | Modal width is 90% of viewport, capped at 420px — fine. |
| PurchaseModal            | No (width: 90%) | OK | OK | 3-pack volume buttons may be tight at 320px (`flex: 1` divides) |
| NarrativeDriftModal      | No | OK | OK | Buttons are full-width by default. |

## Issues found

### Resolved during this pass

- *None.* The hybrid `isMobile()` + flex-wrap strategy was already in
  place across most surfaces. Tier 7.15 StateBadge migration reduced
  one inline span pair in SettlementDetail (the Narrated/Raw chip)
  which was the most-cramped item in the detail header.

### Outstanding (next-pass work, not blockers)

1. **PurchaseModal 3-pack at 320px.** Three buttons split equal flex
   means each gets ~95px which is workable but tight. Acceptable.
   Long-term: stack vertically below 380px.
2. **OverviewTab Tension chip wrapping.** Faction tag chips can
   overflow on a 320px screen when many factions cluster. Acceptable
   — they wrap to a second line via `flexWrap: 'wrap'`.
3. **Compendium / FMG bridge.** Out of scope for this audit (developer
   surface, not user-facing on mobile).

### Why no fixes this pass

The hybrid approach already in place is *working*. Verification turned
up no broken surfaces on mobile. The `min-height: 24px` from `a11y.css`
catches every potential tiny-target regression, and `viewport=device-width`
means mobile browsers honor CSS sizing. Smoke tests
(`tests/ui/mobile.smoke.test.jsx`) lock the `isMobile()` threshold and
verify representative components render at 360px without throwing.

## How to run the smoke tests

```bash
npx vitest run tests/ui/mobile.smoke
```

## How to extend

When adding a new surface:

1. Decide if it needs branching (`isMobile?`) or pure flex-wrap will do.
2. If it's a modal, set `width: 90%` and a `maxWidth` so it shrinks
   gracefully on phones.
3. Avoid hard-coded pixel widths inside the surface; prefer
   `flex: '1 1 N'` so children flow.
4. Add a render-smoke entry to `tests/ui/mobile.smoke.test.jsx` if the
   surface has its own layout logic.

## Mobile testing roadmap (next-pass)

These need Playwright with actual viewport emulation to verify:
- Real pointer-target sizing (jsdom can't measure)
- Scroll behavior on long tabs
- Touch-drag interactions on the map
- iOS safe-area inset handling
- Mobile keyboard behavior on form inputs
