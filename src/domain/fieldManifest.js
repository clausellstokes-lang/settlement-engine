/**
 * domain/fieldManifest.js — Structural prevention: the two field
 * manifests, as data.
 *
 * Two bug classes kept regrowing faster than audits could weed them:
 *
 *   1. FROZEN-VS-LIVE — a generation-written field a long campaign
 *      contradicts because nothing marks whether the pulse must keep it
 *      live (`scores.disaster` froze for two days of work; the goods
 *      subsumption defect and the disaster freeze both appeared in NEW
 *      code written under the program's own discipline).
 *   2. DEAD WRITES — a field written "for the dossier" that no surface
 *      ever reads (`blockadeBypass`, `economicGates` until 1fd128e, the
 *      six dead reads found in an earlier audit).
 *
 * This module turns both classes into DATA that a walking test
 * (tests/joins/fieldManifest.test.js) enforces with comment-stripped
 * source scans — the same idiom as neighbourRelDynamics' CONSUMER_FILES
 * and regionalChannelCreatable's UNCREATABLE allowlist.
 *
 * HONEST LIMIT: new, unlisted fields cannot be auto-detected. The
 * manifest's value is that the LISTED contracts can never silently break
 * — a refactor that stops the pulse writing a declared-live field, or
 * deletes the last reader of a registered engine field, fails a unit
 * test instead of surviving until the next multi-agent audit. Every new
 * generation-written, campaign-relevant field family is expected to add
 * a row here in the same change that introduces it (additive — parallel
 * packages append without conflict; `catalogId` joined this way the moment
 * the entity-identity package landed).
 *
 * Regex fields are STRING SOURCES (compiled by the test) so this stays a
 * pure data module. Paths are repo-root-relative with forward slashes.
 */

// ── Manifest 1: frozen-vs-live ─────────────────────────────────────────────
// Every generation-written, campaign-relevant field family, declared as:
//   mode 'live'     — the pulse must keep it true; pulseWriter names the
//                     ONE 'file#function' responsible, and the walking
//                     test verifies that file still writes the field
//                     (writeProbe overrides the default `field:` scan for
//                     shorthand-property writers).
//   mode 'snapshot' — a generation verdict; display may show it, but it
//                     must NEVER be preferred over a declared live
//                     sibling. `guards` pin the preference pattern at the
//                     declared sites (mustMatch keeps a required fallback
//                     chain alive; mustNotMatch bans the bug pattern).
export const FROZEN_VS_LIVE = Object.freeze([
  {
    path: 'defenseProfile.scores.disaster',
    field: 'disaster',
    mode: 'live',
    pulseWriter: 'src/domain/worldPulse/foodStockpile.js#advanceFoodStockpile',
    displayRule: 'The Disasters & Famine row may prefer the persisted score ONLY because the '
      + 'writeback re-grades it through the persisted gate every tick; legacy saves without it '
      + 'must keep falling through to live resilienceScore.',
    guards: [{
      file: 'src/domain/display/defenseDisplay.js',
      mustMatch: 'scores\\.disaster\\s*\\?\\?\\s*r\\.economicState\\?\\.foodSecurity\\?\\.resilienceScore',
      why: 'legacy saves degrade gracefully: no persisted disaster score → live resilience',
    }],
  },
  {
    path: 'defenseProfile.scores.{military,internal,monster,economic,magical}',
    field: null,
    mode: 'snapshot',
    pulseWriter: null,
    displayRule: 'Generation verdicts with NO live sibling. Display-as-generated is honest '
      + 'today. Whichever package gives any of them a pulse writeback must flip its row to '
      + 'live and name the writer.',
    guards: [],
  },
  {
    path: 'economicState.foodSecurity.storageMonths',
    field: 'storageMonths',
    mode: 'live',
    pulseWriter: 'src/domain/worldPulse/foodStockpile.js#advanceFoodStockpile',
    displayRule: 'Displays read the tick-advanced stock, never a cached generation value.',
    guards: [],
  },
  {
    path: 'economicState.foodSecurity.resilienceScore',
    field: 'resilienceScore',
    mode: 'live',
    pulseWriter: 'src/domain/worldPulse/foodStockpile.js#advanceFoodStockpile',
    // Shorthand property write (`resilienceScore,`) — the default `field:`
    // probe would miss it.
    writeProbe: '(?<![.\\w])resilienceScore\\s*,',
    displayRule: 'The storage slice is re-graded from the current granary each tick; the '
      + 'structural remainder is stashed once as stockpile.resilienceRest.',
    guards: [],
  },
  {
    path: 'economicState.foodSecurity.deficitPct',
    field: 'deficitPct',
    mode: 'live',
    pulseWriter: 'src/domain/worldPulse/foodStockpile.js#advanceFoodStockpile',
    displayRule: 'Displays read the EFFECTIVE deficit (blockade/famine/tithe/drawdown applied); '
      + 'the structural base lives in stockpile.baseDeficitPct.',
    guards: [],
  },
  {
    path: 'economicState.foodSecurity.surplusPct',
    field: 'surplusPct',
    mode: 'live',
    pulseWriter: 'src/domain/worldPulse/foodStockpile.js#advanceFoodStockpile',
    displayRule: 'Zeroed while an effective deficit holds; restored from the structural base.',
    guards: [],
  },
  {
    path: 'economicState.foodSecurity.{dailyNeed,dailyProduction}',
    field: null,
    mode: 'snapshot',
    pulseWriter: null,
    displayRule: 'Deliberate snapshot. The food model is population-scale-invariant (audit '
      + 'REFUTED the freshness harm: ratios cancel; live re-derivation would be byte-identical). '
      + 'If refugee influxes should strain per-capita food, that is a model-design decision.',
    guards: [],
  },
  {
    // Resolution is LIVE-FIRST from the standing
    // institution roster; the verdict is FALLBACK ONLY for rosters with no
    // name signal either way (legacy/custom-renamed content). A roster whose
    // only sniffable transport lies removed/destroyed is a NEGATIVE signal —
    // the verdict is not consulted, and the next blockade takes the full cut.
    // magicExists gates both paths (the verdict encodes it; the resolver
    // re-checks it).
    path: 'economicState.foodSecurity.magicTradeChannel',
    field: null,
    mode: 'snapshot',
    pulseWriter: null,
    displayRule: 'Generation verdict for the blockade-bypass channel. Consumers must derive '
      + 'the channel live-first from standing institutions (resolveBlockadeBypassChannel); a '
      + 'circle destroyed mid-campaign must not keep feeding a besieged city.',
    guards: [{
      file: 'src/domain/worldPulse/foodStockpile.js',
      mustMatch: 'resolveBlockadeBypassChannel',
      mustNotMatch: 'magicTradeChannel\\s*\\?\\?',
      why: 'the verdict-first preference (`fs.magicTradeChannel ?? sniff`) was the bug pattern',
    }, {
      file: 'src/domain/worldPulse/stressorGates.js',
      mustMatch: 'resolveBlockadeBypassChannel',
      mustNotMatch: '\\.magicTradeChannel',
      why: 'the deadzone gate read the raw verdict directly — consumers derive the channel live-first',
    }],
  },
  {
    path: 'powerStructure.factions[] (per-faction live state: capture rung, momentum band, rivals…)',
    field: 'updatedByPulse',
    mode: 'live',
    pulseWriter: 'src/domain/worldPulse/factionCompetition.js#projectFactionStatesOntoSettlement',
    displayRule: 'Faction live state projects onto powerStructure.factions with '
      + 'updatedByPulse provenance and identity no-ops; the dossier faction panel reads the '
      + 'projection, never worldState.factionStates directly.',
    guards: [],
  },
  {
    path: 'neighbourNetwork[].relationshipType',
    field: 'neighbourNetwork',
    mode: 'live',
    pulseWriter: 'src/domain/worldPulse/applyWorldPulse.js#writeRelationshipLabelToNeighbourNetworks',
    displayRule: 'R3/H11: pulse relationship evolution writes back to both settlements’ '
      + 'neighbourNetwork links so dossier/threats/PDF/AI stop asserting stale labels.',
    guards: [],
  },
  {
    path: 'regionalGraph.edges[].relationshipType',
    field: 'relationshipType',
    mode: 'live',
    pulseWriter: 'src/domain/region/graph.js#deriveRegionalGraphFromSaves',
    displayRule: 'R3/H10: a rebuild refreshes the edge label from the live neighbour links '
      + 'instead of freezing it at first build.',
    guards: [],
  },
  {
    path: 'population',
    field: 'population',
    mode: 'live',
    pulseWriter: 'src/domain/worldPulse/populationDynamics.js#applyPopulationOutcomeToSettlement',
    writeProbe: '(?<![.\\w\'"`])population\\s*:',
    displayRule: 'Moves every tick (growth/loss/migration); no display may cache it.',
    guards: [],
  },
  {
    path: 'tier',
    field: 'tier',
    mode: 'live',
    pulseWriter: 'src/domain/worldPulse/tierResourceDynamics.js#applyTierOutcomeToSettlement',
    writeProbe: '(?<![.\\w\'"`:])tier\\s*:',
    displayRule: 'Live BY PROPOSAL: tier moves only through the proposal gate, with the '
      + 're-verify-current-state apply guard (C2).',
    guards: [],
  },
]);

// ── Manifest 2: producer/consumer registry (dead-field CI) ────────────────
// DM-facing, engine-written fields with their intended consumer files. The
// walking test fails when the producer no longer writes a registered field
// (read with no writer) or when NO consumer file still reads it (dead
// write). Seeded with the fields this program fixed; additive by design.
// Probes are regex sources; defaults in the test cover `field:` /
// `.field =` writes and `.field` reads.
export const ENGINE_FIELD_REGISTRY = Object.freeze([
  {
    field: 'economicGates',
    path: 'defenseProfile.economicGates',
    producer: 'src/generators/defenseGenerator.js',
    consumers: [
      'src/domain/display/defenseDisplay.js',   // funding attribution per readiness row
      'src/domain/worldPulse/foodStockpile.js', // disaster gate for the live writeback
    ],
  },
  {
    field: 'disaster',
    path: 'defenseProfile.scores.disaster',
    producer: 'src/generators/defenseGenerator.js',
    consumers: ['src/domain/display/defenseDisplay.js'],
  },
  {
    field: 'magicNote',
    path: 'economicState.activeChains[].magicNote',
    producer: 'src/generators/chainMagicSubstitution.js',
    consumers: [
      'src/domain/supplyChainState.js',
      'src/domain/worldPulse/stressorGates.js',
      'src/components/new/tabs/EconomicsTab.jsx',
      'src/components/new/tabs/ViabilityTab.jsx',
    ],
  },
  {
    field: 'magicRecovery',
    path: 'economicState.activeChains[].magicRecovery',
    producer: 'src/generators/chainMagicSubstitution.js',
    consumers: [
      'src/domain/supplyChainState.js',        // carried into the canonical envelope
      'src/components/new/tabs/EconomicsTab.jsx',
    ],
  },
  {
    field: 'upstreamNote',
    path: 'economicState.activeChains[].upstreamNote',
    producer: 'src/generators/computeActiveChains.js',
    consumers: [
      'src/domain/supplyChainState.js',
      'src/components/new/SupplyChainsPanel.jsx',
      'src/pdf/sections/SupplyChainFlow.jsx',
    ],
  },
  {
    field: 'importChannel',
    path: 'economicViability.metrics.foodBalance.importChannel',
    producer: 'src/generators/economicGenerator.js',
    consumers: ['src/domain/display/dossierViewModel.js'],
  },
  {
    field: 'magicFoodOffset',
    path: 'economicViability.metrics.foodBalance.magicFoodOffset',
    producer: 'src/generators/economicGenerator.js',
    consumers: [
      'src/domain/display/dossierViewModel.js',
      'src/generators/aiLayer.js',
    ],
  },
  {
    field: 'blockadeBypass',
    path: 'economicState.foodSecurity.stockpile.blockadeBypass',
    producer: 'src/domain/worldPulse/foodStockpile.js',
    producerProbe: '(?<![.\\w])blockadeBypass\\s*,', // shorthand property write
    consumers: ['src/domain/display/dossierViewModel.js'], // deriveBlockadeRelief
  },
  {
    // Entity-identity package: generation stamps canonical institution ids
    // alongside labels; joins flip id-first with label-fallback for legacy
    // and DM-authored content. institutionLifecycle.js consumes the field
    // INDIRECTLY through the shared institutionMatchesProcessor helper — the
    // direct field read this registry scans for lives at the join itself.
    field: 'catalogId',
    path: 'institutions[].catalogId',
    producer: 'src/generators/steps/assembleInstitutions.js',
    consumers: ['src/generators/computeActiveChains.js'],
  },
  {
    field: 'conditionId',
    path: 'regionalGraph.impacts[].conditionId',
    producer: 'src/domain/region/propagation.js',
    consumers: [
      'src/domain/region/propagation.js', // apply path materializes under it
      'src/domain/region/graph.js',       // merge preserves the load-bearing id
    ],
  },
  {
    // The canonical chain envelope itself: deriveSupplyChainState's output is
    // the registered surface; these are its load-bearing consumers.
    field: 'deriveAllSupplyChainStates',
    path: 'deriveSupplyChainState / deriveAllSupplyChainStates (canonical chain envelope)',
    producer: 'src/domain/supplyChainState.js',
    producerProbe: 'export function deriveAllSupplyChainStates',
    readProbe: 'deriveAllSupplyChainStates|deriveSupplyChainState',
    consumers: [
      'src/domain/region/deriveRegionalState.js',
      'src/domain/aiGrounding.js',
      'src/domain/explanation.js',
    ],
  },
]);

// ── Tombstones: dead writes REMOVED by this program ────────────────────────
// Fields deleted because nothing read them. The walking test asserts the
// file no longer mentions them — a dead field cannot quietly return without
// arriving through the registry above (i.e., with a reader).
export const REMOVED_DEAD_FIELDS = Object.freeze([
  {
    field: 'hasRegionalSignal',
    file: 'src/domain/region/deriveRegionalState.js',
    removed: 'Write-only boolean on deriveLocalDelta; every consumer thresholds '
      + 'changes[].magnitude itself.',
  },
]);
