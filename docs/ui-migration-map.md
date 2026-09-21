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
| `BandPill`                         | P67      | `domain/qualitativeBands.js`    | ⚰ Retired     |
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

- **Wave 2 — Qualitative bands** *(the primitive is retired; the ladder took over)*
  `primitives/BandPill.jsx` was DELETED on 2026-09-18 with zero production
  importers, and its stated domain backing `domain/qualitativeBands.js` has no
  `src/` consumer either — only its own unit test and
  `tests/lint/bandPolaritySingleSourceScan.test.js` read it. So this wave is no
  longer "wire a primitive in". What exists instead is the **label ladder**
  (`src/components/new/labelLadder.js`, re-exporting `tokenCase` / `statusCase`
  from `src/domain/display/labelCase.js`; the rule is docs/UIUX_PRINCIPLES.md P7
  as rewritten when the primitive went — and the uppercase label the old P7
  mandated was itself the defect the ladder removed), plus the two surviving
  **local** band pills, each owned by the surface that renders it:
  `dossier/EngineSections.jsx` `BandPill({ band })` over `BAND_COLOR`, and
  `new/tabs/SubstrateTab.jsx` `BandPill({ variable, band })` over `BAND_TONE`,
  with `causalBandWord` for the one lower-is-better variable. The remaining work
  is to put the leftover per-band hex picks behind one shared band source and to
  run every band WORD through the ladder — not to import a component that no
  longer exists.

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
  Sweep remaining inline pills/badges onto a primitive where one exists, and
  onto the label ladder where one does not. Mark legacy ad-hoc styles as
  `// deprecated — use StateBadge / the label ladder` comments so the next sweep
  is grep-able. (`BandPill` is deliberately absent from that breadcrumb: naming a
  deleted primitive in a grep-able marker is how these rows went stale.)

## Wave 1 — Lifecycle indicators

| Target file                          | Old pattern                                  | Status      |
|--------------------------------------|----------------------------------------------|-------------|
| `SettlementDetail.jsx` Narrated/Raw  | inline `<span>` with sparkles icon + colors  | ✅ Migrated |
| `OutputContainer.jsx` ai-layer chip  | inline pill near generate button             | Pending     |
| `SettlementsPanel.jsx` lock indicator | inline lock icon + box                       | Pending     |

## Wave 2 — Qualitative bands

The `Replacement` column named `BandPill` on every row. That primitive is gone,
so each row is restated against what this tip actually renders.

| Target                                  | Pattern on this tip                               | Where it goes                                        |
|-----------------------------------------|---------------------------------------------------|------------------------------------------------------|
| OverviewTab `ScoreRow` colors           | `scoreBand` + `scoreColor` off `SCORE_BAND_CUTS`  | ✅ Done — one shared domain band source (`domain/display/defenseScoreBands.js`), word through `statusCase` |
| OverviewTab Food Deficit bar            | *(no such element)*                               | ⚰ Struck — the owner removed the standalone callout on 2026-07-22; Food Security carries the signal off `economicState.foodSecurity.label` / `.color` |
| ViabilityTab posture readout            | no `colorByPosture()` exists; `VERDICT_INK[verdict.tone]` plus an inline `sevColor` ternary | Put `sevColor`'s severity ladder behind a shared source; the words already run through `tokenCase` |
| DailyLifeTab `AnchorFact` accent colors | per-band hex picks in the component body (`safetyColor`, `foodColor`, `PROSPERITY_COLORS`) | **The live gap.** Give the three accents one band source, then the ladder for their words |
| EconomicsTab prosperity chip            | `PROSPERITY_COLORS[eco.prosperity]` module map    | Fold that map into the same shared band source; the chip's words are already on `tokenCase` |

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
