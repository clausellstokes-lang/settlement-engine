# SettlementForge Regional Causality Engine

This document records the implementation architecture for the campaign-level
regional engine. The goal is not to replace the local settlement simulator. The
local simulator remains authoritative for each settlement; the regional layer
connects settlements through confirmed causal channels and turns local events
into queued regional consequences.

## Principles

- Local truth first: `eventPipeline`, `deriveSystemState`, `deriveCausalState`,
  `computeActiveChains`, and `activeConditions` remain the core local systems.
- Campaign graph second: regional causality lives on the campaign, not inside a
  single settlement dossier.
- Confirmed channels only: discovery creates suggested channels. The DM decides
  what becomes campaign canon. Suggested channels never propagate by default.
- Conditions over mutation: regional impacts materialize primarily as
  `activeConditions` or queued impacts, not silent edits to target settlements.
- Bounded waves: local events create direct impacts first, then optional
  decayed multi-hop waves through confirmed channels.
- GM visibility: channels carry `public`, `gm`, or `hidden` visibility. This is
  a presentation/GM-facing control, not a separate simulation graph.

## New Domain Modules

The implementation starts in `src/domain/region/`:

- `goodsCatalog.js` normalizes prose labels such as "Bulk grain and
  foodstuffs" into stable ids such as `grain`. Unknown labels become
  `custom.<slug>` and remain lossless.
- `deriveRegionalState.js` projects one settlement/save into a campaign-facing
  read model: exports, imports, services, local production, route state,
  depleted goods, active chains, active conditions, and causal bands.
- `graph.js` defines the campaign regional multigraph: nodes, directed edges,
  channels, queued impacts, delay/age lifecycle, visibility, and regional event
  log entries.
- `discoverDependencyCandidates.js` discovers suggested P0 channels between
  saved settlements.
- `propagation.js` derives impacts from a local before/after event, aggregates
  them into bundles, queues them on the graph, and can materialize an impact as
  an active condition.
- `migrations.js` keeps campaign regional graph records schema-versioned.

## Current P0 Channels

`trade_dependency`: supplier -> dependent. If the supplier loses exports,
production, or an important chain, the dependent receives import pressure.

`export_market`: buyer/market -> exporter. If the buyer loses route access or
trade connectivity, the exporter receives market-loss pressure.

`trade_route`: endpoint -> endpoint. Route cuts propagate connectivity pressure
across confirmed route channels.

## Governance, Force, And Social Channels

The same channel envelope now supports conservative P1/P2 propagation:

- `political_authority`: authority shocks and legitimacy shocks can become
  `regional_authority_instability`.
- `tax_obligation`: trade/revenue shocks can become
  `regional_tax_revenue_disruption`.
- `military_protection`: security or authority shocks can become
  `regional_protection_gap`.
- `war_front` and `resource_competition`: raids, route cuts, depletion, and
  resource loss can become `regional_conflict_pressure`.
- `service_dependency`: health or authority shocks can become
  `regional_service_disruption`.
- `religious_authority`, `criminal_corridor`, `migration_pressure`, and
  `information_flow` map to explicit regional active-condition archetypes.

Discovery remains advisory. Relationship-derived channels such as patron,
client, allied, hostile, rival, cold war, criminal network, or religious
authority start as `suggested`; they do nothing until confirmed.

## Campaign Integration

Campaign records now carry:

```js
campaign.regionalGraph = {
  schemaVersion: 2,
  nodes: [],
  edges: [],
  channels: [
    {
      type: 'trade_dependency',
      from: 'supplier-save-id',
      to: 'dependent-save-id',
      status: 'suggested | confirmed | dormant | disabled',
      visibility: 'public | gm | hidden',
      strength: 0.7,
      confidence: 0.8,
      goods: [],
    },
  ],
  queuedImpacts: [
    {
      status: 'queued | applied | ignored | expired | resolved',
      delayTicks: 0,
      ageTicks: 0,
      maxAgeTicks: 12,
      waveDepth: 0,
      sourceImpactId: null,
    },
  ],
  eventLog: [],
  updatedAt: '<iso>',
}
```

```js
campaign.wizardNews = {
  schemaVersion: 1,
  currentTick: 0,
  entries: [
    {
      tick: 3,
      significance: 'major | notable',
      scope: 'settlement | regional | realm',
      headline: 'Millcross faces import shortage',
      summary: 'Queued via trade dependency around Grain...',
      impactIds: [],
      channelIds: [],
      settlementIds: [],
      reasons: ['high severity', 'critical goods involved'],
    },
  ],
  updatedAt: '<iso>',
}
```

`campaignSlice` exposes actions to initialize, rebuild, discover, confirm,
disable, replace, and queue regional graph data. It also owns the queued impact
lifecycle: mature delayed impacts, apply an impact into the target save as an
active condition, ignore it, resolve an applied condition, expire stale queued
items, and preserve terminal statuses across later rediscovery. This stores
inside the existing campaign JSON shape first; dedicated Supabase tables can
come later if collaboration or large graph concurrency requires it.

Campaign folders render a compact graph summary: confirmed/suggested channel
counts, ready/queued/applied/resolved impact counts, delayed-impact tick
controls, top suggested channels, top queued impacts, batch apply/ignore
controls, a filtered causal-chain viewer, expandable source/channel/condition
drill-downs, and recent regional event pings.

Settlement detail pages render a regional causality inbox near the local event
timeline. Incoming queued impacts can be applied or ignored from the dossier;
applied impacts can be resolved from the same surface. Apply/resolve updates the
open detail state immediately and persists through the save service.

The world map renders regional graph context through `RegionalCausalityLayer`.
Confirmed channels appear as color-coded network lines, GM-only channels render
dashed when enabled, and queued/applied/resolved impacts appear as target
markers. Layer toggles and filters live beside relationships, supply chains,
roads, labels, and markers. The regional map layer can filter channel types,
impact statuses, GM-only channels, and minimum impact severity.

Wizard News is the campaign-facing audit layer for the same system. It is
populated from actual regional graph transitions: new queued impacts, delayed
impacts becoming ready, status changes to applied/ignored/expired/resolved, and
graph replacements produced by canon event propagation. The map page exposes a
campaign workspace toggle that switches between the map and Wizard News.
Wizard News groups entries into `Most Significant News` and `Realm Notables`,
then by tick, so a DM can review the consequences of each time advancement
without losing the spatial map.

Significance is deterministic and explainable. `wizardNews.js` scores entries
from severity, impact kind, channel type, multi-settlement scope, cascade depth,
critical goods, and lifecycle transition. Major news captures high-severity
events, multi-hop cascades, broad settlement paths, and serious applied effects.
Routine or lower-severity changes become notables. Each entry stores the reasons
used for classification so future UI, exports, or AI summaries can explain why
the item was promoted.

Supply-chain derivation reads regional active conditions as pressure. A stable
food chain with a high-severity `regional_import_shortage`, for example, derives
as `scarce` and carries `regionalPressures[]` explaining why.

## Event Flow

1. Opening a saved settlement hydrates `activeSaveId`, lifecycle state, and the
   settlement payload from that save.
2. A canon local event is applied through the existing event pipeline.
3. The active save is updated with the mutated settlement and fresh
   `campaignState`.
4. `deriveLocalDelta(before, after, { event })` extracts regional signals.
5. Confirmed outgoing channels are selected from the campaign graph.
6. P0/P1/P2 rules derive direct regional impacts from confirmed channels.
7. Optional bounded waves transmit decayed impacts through further confirmed
   channels, avoiding loops through `pathSettlementIds`.
8. Impacts are grouped into bundles and queued on the regional graph.
9. Focus policy decides whether the target gets full, partial, or queued
   application.
10. Applied impacts become active conditions such as
   `regional_import_shortage`, `regional_export_market_loss`, or
   `regional_route_disruption`.

## Verification Coverage

The implementation is pinned by:

1. Domain tests for graph migration, discovery, propagation, delay/expiry,
   multi-hop decay, condition materialization, and Wizard News classification.
2. Store tests for campaign impact apply, resolve, batch actions, and delayed
   impact advancement, including Wizard News feed population.
3. Map overlay tests for placement projection and channel/status/severity
   filtering.
4. Seeded Playwright coverage for apply, resolve, delayed tick advancement,
   causal drill-downs, discover, confirm, the Wizard News map workspace, and
   regional map layer controls.

## Future Build Steps

1. Move campaign graph persistence to dedicated tables if multi-user
   collaboration or graph-level conflict resolution becomes necessary.
2. Add conflict-resolution UI for simultaneous GM/player edits once campaign
   collaboration exists.
3. Add optional analytics around which suggested channels GMs confirm or
   ignore, so discovery heuristics can be tuned from real usage.
