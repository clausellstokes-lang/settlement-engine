/**
 * domain/region — curated public surface (code-quality-6).
 *
 * This barrel was seven `export *` wildcards, which re-exported the ENTIRE feed
 * engine (wizardNews.js) and every graph internal to every consumer — engine AND
 * UI. That is the class the Wave-2 feed-retention bust rode in on (+363 B eager):
 * a wildcard barrel means any eager import of ONE region symbol can drag the whole
 * region engine, feed generator included, into that consumer's chunk. The exports
 * below are now EXPLICIT and curated to the symbols actually imported across src +
 * tests (per the consumer census), so the surface is auditable and a stray eager
 * import pulls only what it names.
 *
 * FIRST PAINT: a first-paint module must NOT statically import this barrel — the
 * wizardNews feed generator sits behind it. Import the specific leaf instead
 * (mirrors spatial/index.js's "never enter the entry static closure" law).
 *
 * (region/migrations.js was removed as dead code — its three exports
 * — migrateRegionalGraphToLatest, withMigratedCampaignRegionalGraph,
 * migrateCampaignsRegionalGraphs — had no consumers; see
 * docs/DEAD_CODE_DISPOSITION.md.)
 */

export {
  goodsIntersect,
  normalizeGood,
  normalizeGoodsList,
} from './goodsCatalog.js';

export {
  deriveLocalDelta,
  deriveRegionalState,
} from './deriveRegionalState.js';

export {
  REGIONAL_CHANNEL_TYPES,
  REGIONAL_EVENT_LOG_LIMIT,
  REGIONAL_GRAPH_SCHEMA_VERSION,
  REGIONAL_TERMINAL_IMPACT_LIMIT,
  activeChannelsFrom,
  addRegionalChannels,
  advanceRegionalImpacts,
  appendRegionalEvent,
  canonicalRelationshipLabel,
  deriveRegionalGraphFromSaves,
  ensureRegionalGraph,
  isRegionalImpactAvailable,
  mintDirectedChannel,
  queueRegionalImpacts,
  relationshipChannelBundle,
  setRegionalChannelStatus,
  setRegionalImpactStatus,
  stablePart,
  syncRelationshipChannelBundle,
} from './graph.js';

export {
  deriveGraphWithDiscoveredCandidates,
  discoverDependencyCandidates,
} from './discoverDependencyCandidates.js';

export {
  applyRegionalImpact,
  conditionFromRegionalImpact,
  deriveRegionalImpacts,
  foldSameShockImpacts,
  legacyRegionalConditionId,
  propagateRegionalEvent,
} from './propagation.js';

// The feed engine — explicitly the only wizardNews symbols any consumer imports.
export {
  WIZARD_NEWS_SIGNIFICANCE,
  advanceWizardNewsFeed,
  appendWizardNewsEntries,
  applyPulseMover,
  deriveNewsThreads,
  deriveWizardNewsEntriesFromGraphChange,
  ensureWizardNewsFeed,
  summarizeWizardNews,
} from './wizardNews.js';
