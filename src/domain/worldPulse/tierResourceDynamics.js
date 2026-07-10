import { POPULATION_RANGES, TIER_ORDER, popToTier } from '../../data/constants.js';
import { canonExports, canonImports } from '../canonicalAccessors.js';
import { SUPPLY_CHAIN_NEEDS, RESOURCE_TO_CHAINS } from '../../data/supplyChainData.js';
import { RESOURCE_DATA } from '../../data/resourceData.js';
import { exactGoodId } from '../region/goodsCatalog.js';
import { stablePart } from './worldState.js';
import { intensityMultiplier, normalizeSimulationRules } from './simulationRules.js';
import { canRecoverResource, classifyResource } from './resourceTaxonomy.js';

// Minimum pressure for the city+ depletion floor to fire. The tier branch used to
// emit depletion candidates regardless of pressure, so a quiescent zero-pressure
// city still spammed ~8/tick — making resource_depletion the #1 candidate family.
// Gating it here leaves a ~0.13 hysteresis dead-zone above recovery's 0.32 ceiling.
const RESOURCE_CITY_FLOOR_PRESSURE = 0.45;

/** @param {any} value */
function clamp01(value) {
  const n = Number.isFinite(value) ? value : 0;
  return Math.max(0, Math.min(1, n));
}

/** @param {any} tier */
function tierRank(tier) {
  const idx = TIER_ORDER.indexOf(tier);
  return idx >= 0 ? idx : TIER_ORDER.indexOf('village');
}

/**
 * @param {any} pressureIdx
 * @param {any} settlementId
 * @param {any} kind
 */
function pressure(pressureIdx, settlementId, kind) {
  return pressureIdx?.get?.(settlementId, kind)?.score || 0;
}

/**
 * @param {any} pressureIdx
 * @param {any} settlementId
 */
function supportScore(pressureIdx, settlementId) {
  const food = pressure(pressureIdx, settlementId, 'food');
  const conflict = pressure(pressureIdx, settlementId, 'conflict');
  const trade = pressure(pressureIdx, settlementId, 'trade');
  const legitimacy = pressure(pressureIdx, settlementId, 'legitimacy');
  const disease = pressure(pressureIdx, settlementId, 'disease');
  return clamp01(1 - (food * 0.22 + conflict * 0.24 + trade * 0.2 + legitimacy * 0.2 + disease * 0.14));
}

// ── Tier-outcome APPLIER — extracted to ./tierOutcomeApply.js ───────────────
// The applier + its catalog helpers (entriesForTier, catalogEntryByName,
// existingInstitutionNames, promotion/demotion surgery) moved VERBATIM to the
// dependency-light leaf tierOutcomeApply.js (W2b byte-budget extraction): the
// SHIFT_TIER event handler reuses the single-source applier from the EAGER
// mutation router, and importing it from THIS module dragged the whole
// evaluation machinery (canonicalAccessors, supplyChainData, goodsCatalog,
// worldState, simulationRules, resourceTaxonomy) into the first-paint closure.
// Imported + re-exported verbatim here so every sim consumer is unchanged.
import {
  entriesForTier, catalogEntryByName, existingInstitutionNames,
  applyTierOutcomeToSettlement,
} from './tierOutcomeApply.js';
export { entriesForTier, catalogEntryByName, existingInstitutionNames, applyTierOutcomeToSettlement };

/**
 * @param {any} direction
 * @param {any} targetTier
 */
function requiredStreak(direction, targetTier) {
  const rank = tierRank(targetTier);
  return direction === 'promotion'
    ? Math.max(2, rank + 1)
    : Math.max(2, Math.ceil((rank + 1) / 2));
}

/**
 * @param {any} item
 * @param {any} pressureIdx
 */
function tierEligibility(item, pressureIdx) {
  const settlement = item.settlement || {};
  const currentTier = settlement.tier || popToTier(settlement.population || 0);
  const rank = tierRank(currentTier);
  const pop = Math.max(0, Math.round(Number(settlement.population) || 0));
  const support = supportScore(pressureIdx, item.id);
  const nextTier = TIER_ORDER[rank + 1] || null;
  const previousTier = TIER_ORDER[rank - 1] || null;

  if (nextTier && pop >= (/** @type {any} */ (POPULATION_RANGES)[nextTier]?.min || Infinity) * 0.92 && support >= 0.62) {
    return {
      direction: 'promotion',
      fromTier: currentTier,
      toTier: nextTier,
      support,
      severity: clamp01((pop / (/** @type {any} */ (POPULATION_RANGES)[nextTier]?.min || pop)) * 0.45 + support * 0.55),
      reason: `${currentTier} is near ${nextTier} population and has sustained trade, defense, and legitimacy support.`,
    };
  }

  const currentMin = /** @type {any} */ (POPULATION_RANGES)[currentTier]?.min || 0;
  const hardPopulationFailure = previousTier && pop < currentMin * 0.82;
  const structuralFailure = previousTier && support <= 0.25;
  const strainedBelowFloor = previousTier && pop < currentMin && support < 0.45;
  if (hardPopulationFailure || structuralFailure || strainedBelowFloor) {
    return {
      direction: 'demotion',
      fromTier: currentTier,
      toTier: previousTier,
      support,
      severity: clamp01((1 - support) * 0.6 + (currentMin ? Math.max(0, 1 - pop / currentMin) : 0) * 0.4),
      reason: `${currentTier} is no longer supported by population, economy, defense, or legitimacy conditions.`,
    };
  }

  return null;
}

// rules is the normalized output of normalizeSimulationRules (see
// evaluateTierResourceDynamics); tierCandidate reads rules.majorChangesRequireProposal,
// mirroring resourceCandidatesFor in this module. item/drift/tick are left untyped to
// match that sibling and the file's strict-error baseline; rules carries a narrow
// inline type for the one flag it consults so it stays strict-clean.
/**
 * @param {any} item
 * @param {any} drift
 * @param {any} tick
 * @param {{ majorChangesRequireProposal?: boolean }} rules
 */
function tierCandidate(item, drift, tick, rules) {
  const minimum = requiredStreak(drift.direction, drift.toTier);
  if (drift.streak < minimum) return null;
  const chance = clamp01(0.18 + (drift.streak - minimum + 1) * 0.13 + drift.severity * 0.24);
  return {
    id: `candidate.tier.${drift.direction}.${stablePart(item.id)}.${tick}`,
    type: 'tier',
    candidateType: `tier_${drift.direction}`,
    ruleId: `tier_${drift.direction}`,
    ruleFamily: 'tier',
    targetSaveId: item.id,
    severity: drift.severity,
    probability: chance,
    // Honor majorChangesRequireProposal, consistent with resource_depletion in
    // this module: a tier change stays a DM proposal under the conservative
    // default (flag on), and auto-applies only when a campaign opts out of
    // proposal gating (flag off, e.g. dramatic_campaign).
    applyMode: rules.majorChangesRequireProposal ? 'proposal' : 'auto',
    headline: `${item.name || item.id} may ${drift.direction === 'promotion' ? 'rise' : 'fall'} to ${drift.toTier}`,
    summary: `${item.name || item.id} has met ${drift.direction} eligibility for ${drift.streak} advancement(s).`,
    reasons: [
      drift.reason,
      `Minimum streak ${minimum}; current streak ${drift.streak}.`,
      `RNG chance now ${Math.round(chance * 100)}%.`,
    ],
    tierChange: {
      saveId: item.id,
      fromTier: drift.fromTier,
      toTier: drift.toTier,
      direction: drift.direction,
    },
    proposalPayload: {
      kind: 'tier_change',
      saveId: item.id,
      fromTier: drift.fromTier,
      toTier: drift.toTier,
      direction: drift.direction,
    },
    metadata: {
      support: drift.support,
      streak: drift.streak,
      minimumStreak: minimum,
    },
    conflictTags: [`tier:${item.id}`, `proposal:tier:${item.id}`],
  };
}

/** @param {import('../settlement.schema.js').SimSettlement} settlement */
function resourceList(settlement) {
  return [
    ...(settlement?.config?.nearbyResources || []),
    ...(settlement?.nearbyResources || []),
  ].filter(Boolean).map(String).filter((value, index, arr) => arr.indexOf(value) === index);
}

/**
 * @param {import('../settlement.schema.js').SimSettlement} settlement
 * @param {any} resource
 */
function resourceState(settlement, resource) {
  const explicit = settlement?.config?.nearbyResourcesState?.[resource];
  if (explicit) return explicit;
  const depleted = new Set(settlement?.config?.nearbyResourcesDepleted || settlement?.nearbyResourcesDepleted || []);
  return depleted.has(resource) ? 'depleted' : 'allow';
}

/**
 * @param {any} item
 * @param {any} pressureIdx
 */
function resourcePressure(item, pressureIdx) {
  const systemValue = item?.system?.resourcePressure?.value;
  if (Number.isFinite(systemValue)) return clamp01(systemValue / 100);
  return clamp01(pressure(pressureIdx, item.id, 'food') * 0.4 + pressure(pressureIdx, item.id, 'trade') * 0.35 + pressure(pressureIdx, item.id, 'conflict') * 0.25);
}

/** @param {any} value */
function tokenSet(value) {
  return new Set(String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .split(/\s+/)
    .filter(token => token.length >= 4));
}

/**
 * @param {any} text
 * @param {any} resource
 */
function textMatchesResource(text, resource) {
  const resourceTokens = tokenSet(resource);
  if (!resourceTokens.size) return false;
  const haystack = String(text || '').toLowerCase();
  return [...resourceTokens].some(token => haystack.includes(token));
}

// Mirror of goodsCatalog's comparable(): annotation-stripped, alnum-only form
// so 'River fish (taxed by occupation)' compares equal to 'River fish'.
/** @param {any} value */
function comparableLabel(value) {
  return String(value || '')
    .replace(/\([^)]*\)/g, ' ')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Resource key → the trade labels its economy actually prints on the ledger:
// RESOURCE_DATA tradeGoods plus every good along the chains the resource feeds
// (raw inputs, intermediates, outputs — deriveExportsFromChains exports raw
// forms and processed outputs alike, and substitution can run a sibling chain
// like river_fishing off 'Fishing grounds'). The key's own words
// ('fishing_grounds') rarely appear in those labels ('River fish', 'Raw wool'),
// which is why a token match alone called canonically-exported resources
// local-only. Static data, so resolved once per resource key.
const resourceGoodsVocabularyCache = new Map();
/** @param {any} resource */
function resourceGoodsVocabulary(resource) {
  const key = String(resource || '');
  const cached = resourceGoodsVocabularyCache.get(key);
  if (cached) return cached;
  const goods = new Set(/** @type {any} */ (RESOURCE_DATA)[key]?.tradeGoods || []);
  for (const composite of /** @type {any} */ (RESOURCE_TO_CHAINS)[key] || []) {
    const [needKey, ...innerParts] = String(composite).split('.');
    const chain = (/** @type {any} */ (SUPPLY_CHAIN_NEEDS)[needKey]?.chains || []).find((/** @type {any} */ c) => c.id === innerParts.join('.'));
    if (!chain) continue;
    for (const good of chain.rawInputs || []) goods.add(good);
    for (const good of chain.intermediateGoods || []) goods.add(good);
    for (const good of chain.outputs || []) goods.add(good);
  }
  const vocabulary = {
    labels: new Set([...goods].map(comparableLabel).filter(Boolean)),
    ids: new Set([...goods].map(exactGoodId).filter(Boolean)),
  };
  resourceGoodsVocabularyCache.set(key, vocabulary);
  return vocabulary;
}

/**
 * @param {any} labels
 * @param {any} resource
 */
function tradeListMatchesResource(labels, resource) {
  const vocabulary = resourceGoodsVocabulary(resource);
  return (labels || []).some((/** @type {any} */ label) => {
    const id = exactGoodId(label);
    if (id != null && vocabulary.ids.has(id)) return true;
    return vocabulary.labels.has(comparableLabel(label));
  });
}

/** Exported for pin tests: classification feeds depletion trade-load and the
 *  primary-export recovery block, so mislabeling an exported resource as
 *  local-only underweights it in the drift logic.
 *  @param {import('../settlement.schema.js').SimSettlement} settlement
 *  @param {any} resource */
export function resourceEconomicRole(settlement, resource) {
  // Route through the canonical accessors, NOT settlement.economicState.primaryExports
  // directly: a legacy save stores the trade lists under the `exports`/`imports` alias,
  // which canonExports/canonImports resolve. Reading primaryExports directly here would
  // see empty lists and misclassify every resource as local_resource (the same
  // dead-field class as the capacityModel bug canonicalAccessors was created to fix).
  const exportsList = canonExports(settlement);
  const importsList = canonImports(settlement);
  // Canonical goods vocabulary first (verbatim chain labels + exact good ids,
  // which survive subsumption renames); token match stays as the fallback for
  // custom labels that mention the resource by name.
  const exportAnchor = tradeListMatchesResource(exportsList, resource)
    || textMatchesResource(exportsList.join(' '), resource);
  const importDependency = tradeListMatchesResource(importsList, resource)
    || textMatchesResource(importsList.join(' '), resource);
  if (exportAnchor && importDependency) return 'export_and_import';
  if (exportAnchor) return 'primary_export';
  if (importDependency) return 'primary_import';
  return 'local_resource';
}

/**
 * @param {any} item
 * @param {any} pressureIdx
 * @param {any} rules
 * @param {any} tick
 * @param {any} previousDrift
 */
function resourceCandidatesFor(item, pressureIdx, rules, tick, previousDrift) {
  const settlement = item.settlement || {};
  const resources = resourceList(settlement);
  if (!resources.length) return [];
  const rank = tierRank(settlement.tier);
  const pressureScore = resourcePressure(item, pressureIdx);
  const multiplier = intensityMultiplier(rules);
  const out = [];

  for (const resource of resources.slice(0, 8)) {
    const state = resourceState(settlement, resource);
    const economicRole = resourceEconomicRole(settlement, resource);
    const taxonomy = classifyResource(resource);
    const tradeLoad = economicRole === 'primary_export' || economicRole === 'export_and_import' ? 0.12 : economicRole === 'primary_import' ? 0.06 : 0;
    const effectivePressure = clamp01(pressureScore + tradeLoad);
    if (state !== 'depleted' && (effectivePressure >= 0.64 || (rank >= tierRank('city') && effectivePressure >= RESOURCE_CITY_FLOOR_PRESSURE))) {
      const severity = clamp01(effectivePressure * 0.55 + rank / (TIER_ORDER.length - 1) * 0.35 + multiplier * 0.1);
      out.push({
        id: `candidate.resource.deplete.${stablePart(item.id)}.${stablePart(resource)}.${tick}`,
        type: 'resource',
        candidateType: 'resource_depletion',
        ruleId: 'resource_depletion',
        ruleFamily: 'resource',
        targetSaveId: item.id,
        severity,
        probability: clamp01(0.05 + severity * 0.34),
        applyMode: rules.majorChangesRequireProposal && severity >= 0.78 ? 'proposal' : 'auto',
        headline: `${resource.replace(/_/g, ' ')} may be depleted`,
        summary: `${item.name || item.id} is consuming ${resource.replace(/_/g, ' ')} faster than it recovers.`,
        reasons: [
          `Resource pressure ${effectivePressure.toFixed(2)} and tier ${settlement.tier || 'unknown'}.`,
          'Higher settlement tiers consume local resources more aggressively.',
          economicRole !== 'local_resource' ? `Economic role: ${economicRole.replace(/_/g, ' ')}.` : null,
        ].filter(Boolean),
        resourcePatch: { saveId: item.id, resource, state: 'depleted' },
        metadata: { resource, fromState: state, toState: 'depleted', economicRole, resourceTaxonomy: taxonomy },
        conflictTags: [`resource:${item.id}:${resource}`],
      });
    } else if (state === 'depleted' && ((pressureScore <= 0.32 && economicRole !== 'primary_export') || previousDrift?.direction === 'demotion')) {
      // CADENCE DAMPING (E4-2b): exhaustibles (iron/stone/gem/salt/clay and
      // strategic resources) return canRecover:false from the taxonomy — once
      // depleted they could never come back, so a calm settlement's resources
      // only ever ratcheted down. A SUSTAINED CALM (very low pressure) now opens
      // a slow, event-gated recovery for them: prospecting reopens seams,
      // substitution and trade backfill demand. It is damped (low probability)
      // and bounded (quiet only) — calm becomes gradual recovery, not permanent
      // decay — while a resource under any real pressure still cannot regrow.
      const quietRecovery = pressureScore <= 0.2;
      const recovery = canRecoverResource(resource, settlement, {
        demotion: previousDrift?.direction === 'demotion',
        pressureScore,
        quietRecovery,
      });
      if (!recovery.canRecover) continue;
      // Exhaustible/magical recovery is deliberately slow — a fraction of the
      // renewable rate. It represents years of prospecting, not a season's regrowth.
      const slow = recovery.taxonomy.recoveryMode === 'manual' || recovery.taxonomy.recoveryMode === 'requires_high_magic';
      const severity = clamp01((1 - pressureScore) * 0.5 + (previousDrift?.direction === 'demotion' ? 0.22 : 0));
      out.push({
        id: `candidate.resource.recover.${stablePart(item.id)}.${stablePart(resource)}.${tick}`,
        type: 'resource',
        candidateType: 'resource_recovery',
        ruleId: 'resource_recovery',
        ruleFamily: 'resource',
        targetSaveId: item.id,
        severity,
        probability: clamp01((slow ? 0.02 : 0.08) + severity * (slow ? 0.1 : 0.34)),
        applyMode: 'auto',
        headline: `${resource.replace(/_/g, ' ')} may recover`,
        summary: `${item.name || item.id} consumes less ${resource.replace(/_/g, ' ')}, allowing it to become available again.`,
        reasons: [
          `Resource pressure ${pressureScore.toFixed(2)} is low enough for recovery.`,
          recovery.reason,
          previousDrift?.direction === 'demotion' ? 'Demotion pressure implies reduced consumption.' : null,
          economicRole !== 'local_resource' ? `Economic role: ${economicRole.replace(/_/g, ' ')}.` : null,
        ].filter(Boolean),
        resourcePatch: { saveId: item.id, resource, state: previousDrift?.direction === 'demotion' ? 'abundant' : 'allow' },
        metadata: { resource, fromState: state, toState: previousDrift?.direction === 'demotion' ? 'abundant' : 'allow', economicRole, resourceTaxonomy: recovery.taxonomy },
        conflictTags: [`resource:${item.id}:${resource}`],
      });
    }
  }
  return out;
}

/**
 * @param {any} worldState
 * @param {any} snapshot
 * @param {any} pressureIdx
 * @param {any} context
 */
export function evaluateTierResourceDynamics(worldState, snapshot, pressureIdx, context = {}) {
  const rules = normalizeSimulationRules(context.simulationRules || worldState?.simulationRules);
  const tick = Number.isFinite(context.tick) ? context.tick : worldState?.tick || 0;
  const settlementTickStates = { ...(worldState?.settlementTickStates || {}) };
  const candidates = [];
  const driftBySettlement = /** @type {any} */ ({});
  // Tier candidate ids are tick-suffixed, so an unresolved tier proposal would
  // gain a duplicate every eligible tick: one pending tier proposal per
  // settlement. Streak tracking continues so a resolved proposal re-emits.
  const pendingTierProposals = new Set((worldState?.proposals || [])
    .filter((/** @type {any} */ proposal) => proposal?.status === 'pending' && proposal?.outcome?.tierChange?.saveId != null)
    .map((/** @type {any} */ proposal) => String(proposal.outcome.tierChange.saveId)));

  for (const item of snapshot?.settlements || []) {
    const previous = settlementTickStates[item.id] || {};
    const eligibility = rules.tierDriftEnabled ? tierEligibility(item, pressureIdx) : null;
    let tierDrift = null;
    if (eligibility) {
      const prior = previous.tierDrift || {};
      const sameTrack = prior.direction === eligibility.direction && prior.toTier === eligibility.toTier;
      tierDrift = {
        ...eligibility,
        streak: sameTrack ? (prior.streak || 0) + 1 : 1,
        lastEvaluatedTick: tick,
      };
      const candidate = tierCandidate(item, tierDrift, tick, rules);
      if (candidate && !pendingTierProposals.has(String(item.id))) candidates.push(candidate);
    }
    settlementTickStates[item.id] = {
      ...previous,
      tierDrift,
    };
    driftBySettlement[item.id] = tierDrift;

    if (rules.resourceDriftEnabled) {
      candidates.push(...resourceCandidatesFor(item, pressureIdx, rules, tick, tierDrift));
    }
  }

  return {
    worldState: { ...worldState, settlementTickStates },
    candidates,
    driftBySettlement,
  };
}

/**
 * @param {import('../settlement.schema.js').SimSettlement} settlement
 * @param {any} outcome
 */
export function applyResourceOutcomeToSettlement(settlement, outcome) {
  if (!settlement || !outcome?.resourcePatch) return settlement;
  const { resource, state } = outcome.resourcePatch;
  const config = settlement.config || {};
  const resourceStateMap = { ...(config.nearbyResourcesState || {}) };
  resourceStateMap[resource] = state;
  const depletedSet = new Set(config.nearbyResourcesDepleted || settlement.nearbyResourcesDepleted || []);
  if (state === 'depleted') depletedSet.add(resource);
  else depletedSet.delete(resource);
  return {
    ...settlement,
    config: {
      ...config,
      nearbyResourcesState: resourceStateMap,
      nearbyResourcesDepleted: [...depletedSet],
    },
    resourceHistory: [
      ...(Array.isArray(settlement.resourceHistory) ? settlement.resourceHistory.slice(-11) : []),
      {
        resource,
        state,
        outcomeId: outcome.id,
        reason: outcome.headline || outcome.candidateType,
      },
    ],
  };
}
