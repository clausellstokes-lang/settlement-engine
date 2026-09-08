# UI Migration Map — Tier 7.15 / 7.16

This document is the canonical rollout plan for the design-system
primitives built in P64–P68. It also doubles as the migration map
deliverable for Tier 7.16 — every legacy component / inline pattern
that should adopt a primitive is listed here with its target,
ownership, and wave status.

> **Scope.** The primitives themselves live in `src/components/primitives/`
> and are independently tested. What *this* document tracks is **where
> they should be consumed**. A primitive that exists but is never wired
> in adds no value; this map closes that gap.

## Primitive inventory

| Primitive                          | Built in | Domain backing                  | Status        |
|------------------------------------|---------:|---------------------------------|---------------|
| `RegenerationDeltaCard`            | P64      | `domain/regenerationDelta.js`   | Wave 1 done   |
| `RegenerationModeSelector`         | P65      | `domain/regenerationMode.js`    | Pending wire  |
| `CanonBadge`                       | P66      | `domain/canonStatus.js`         | Pending wire  |
| `BandPill`                         | P67      | `domain/qualitativeBands.js`    | Pending wire  |
| `CausalViewTabs`                   | P68      | `domain/causalViews.js`         | Pending wire  |
| `StateBadge` (lifecycle states)    | earlier  | `copy/strings.js` (state.*)     | Wave 1 done   |
| `FounderBadge`                     | P70      | `lib/founderSeats.js`           | Done          |
| `AiOverlayViolations`              | P54      | `domain/aiOverlayVerifier.js`   | Done          |
| `EditableText`                     | P53      | `domain/userEdits.js`           | Done          |

## Phasing rationale

The redesign rollout is deliberately incremental so we never ship a
"half-themed" surface. Each wave is shippable on its own — the legacy
appearance still works, the primitives just take over the hottest spots
first.

- **Wave 1 — Lifecycle indicators** *(this commit)*
  Replace every inline draft/canon/narrated/raw chip with `StateBadge`.
  Low-risk: the primitive existed before; we're collapsing duplication.

- **Wave 2 — Qualitative bands** *(next)*
  Find ad-hoc `colorByScore()` ternaries and replace with `BandPill`
  driven by `domain/qualitativeBands.js`. Highest-impact targets are
  band-style readouts in Overview, Viability, Economics, Defense.

- **Wave 3 — Entity provenance** *(after qualitative bands)*
  Add `CanonBadge` next to entity names in NPCs, Power (factions), and
  Relationships tabs. Mostly visible on user-authored or event-applied
  entities; generated+draft entities render nothing (the silent
  majority).

- **Wave 4 — Regenerate surfaces**
  Wire `RegenerationModeSelector` into the GenerateWizard step that
  exposes regenerate, replacing the current "regenerate?" toggle.
  Wire `CausalViewTabs` into PowerTab / DMCompassTab where multiple
  causal views (faction-led, stressor-led, terrain-led) coexist.

- **Wave 5 — Cleanup**
  Sweep remaining inline pills/badges and replace with primitives.
  Mark legacy ad-hoc styles as `// deprecated — use StateBadge / BandPill`
  comments so the next sweep is grep-able.

## Wave 1 — Lifecycle indicators

| Target file                          | Old pattern                                  | Status      |
|--------------------------------------|----------------------------------------------|-------------|
| `SettlementDetail.jsx` Narrated/Raw  | inline `<span>` with sparkles icon + colors  | ✅ Migrated |
| `OutputContainer.jsx` ai-layer chip  | inline pill near generate button             | Pending     |
| `SettlementsPanel.jsx` lock indicator | inline lock icon + box                       | Pending     |

## Wave 2 — Qualitative bands

| Target                                  | Current pattern                                   | Replacement                                          |
|-----------------------------------------|---------------------------------------------------|------------------------------------------------------|
| OverviewTab `ScoreRow` colors           | ternary on numeric score → color hex              | `BandPill domain="capacity" ref={…}`                 |
| OverviewTab Food Deficit bar            | `foodBal.deficitPercent`-driven color             | `BandPill band="strained\|critical\|collapsed" labelBefore="Food"` |
| ViabilityTab posture readout            | ad-hoc `colorByPosture()`                         | `BandPill domain="defense" ref={…}`                  |
| DailyLifeTab `AnchorFact` accent colors | per-band hex picks in component body              | wrap `AnchorFact` to consume `BandPill` internally   |
| EconomicsTab prosperity chip            | inline chip near prosperity label                 | `BandPill domain="substrate" ref={…}`                |

## Wave 3 — Entity provenance

| Target                                  | When to render                                    | Replacement                                       |
|-----------------------------------------|---------------------------------------------------|---------------------------------------------------|
| NPCsTab — NPC name row                  | Every NPC; canon/user-authored/event get a badge  | `<CanonBadge entity={npc} />` (silent on draft)   |
| PowerTab — Faction list                 | Every faction; same logic                         | `<CanonBadge entity={faction} />`                 |
| RelationshipsTab — Edge labels          | When a relationship is user-edited                | `<CanonBadge entity={rel} verbose={false} />`     |
| OverviewTab — leader name (if any)      | When leader is event-installed or user-renamed    | `<CanonBadge entity={leader} />`                  |

## Wave 4 — Regenerate surfaces

| Target                                  | Old pattern                                       | Replacement                                       |
|-----------------------------------------|---------------------------------------------------|---------------------------------------------------|
| GenerateWizard regenerate step          | Hard-coded "Regenerate" button                    | `<RegenerationModeSelector value={…} onChange={…} />` |
| PowerTab causal lens picker             | Tabs implemented ad-hoc                           | `<CausalViewTabs value={…} onChange={…} />`       |
| DMCompassTab arrow source toggle        | Inline radio group                                | `<CausalViewTabs />`                              |
| OutputContainer regenerate button group | Single regenerate spends credits                  | `<RegenerationModeSelector />` + delta card recap |

## Test coverage strategy

Each migrated component should keep at least one rendering smoke test
that asserts the new primitive is in the DOM (e.g. by role="status" or
aria-label). The legacy inline pattern shouldn't have its own test —
once the migration lands, the primitive's existing tests are the
authoritative coverage.

## Non-goals

- This is **not** a styling sweep. The legacy components keep their
  existing layout; only the embedded indicator-style elements migrate.
- This is **not** the BODY token sweep (Tier 7.19) — that's a separate
  effort across `<p>` / `<div>` text styles.
- This is **not** an accessibility audit (Tier 7.17). The primitives
  include their own `role="status"` + `aria-label`, but a full a11y
  pass is its own tier.

## Working agreement

When you touch a legacy component for any reason, take 30 seconds to
check if any inline indicator on that surface is listed above. If yes,
fold the migration into the same commit — that's how the long tail
gets done.
