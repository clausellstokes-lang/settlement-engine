import { institutionalCatalog } from '../../data/institutionalCatalog.js';
import { POPULATION_RANGES, TIER_ORDER, popToTier, tierAtLeast } from '../../data/constants.js';
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

/** @param {any} tier */
export function entriesForTier(tier) {
  const tierCatalog = /** @type {any} */ (institutionalCatalog)[tier] || {};
  const entries = [];
  for (const [category, group] of Object.entries(tierCatalog)) {
    for (const [name, spec] of Object.entries(group || {})) {
      entries.push({ name, category, spec: spec || {} });
    }
  }
  return entries;
}

/** @param {any} tier */
function requiredInstitutionsForTier(tier) {
  return entriesForTier(tier).filter(entry => entry.spec.required);
}

/** @param {any} name */
export function catalogEntryByName(name) {
  const needle = String(name || '').toLowerCase();
  for (const tier of TIER_ORDER) {
    const found = entriesForTier(tier).find(entry => entry.name.toLowerCase() === needle);
    if (found) return { ...found, nativeTier: tier };
  }
  return null;
}

/** @param {import('../settlement.schema.js').SimSettlement} settlement */
export function existingInstitutionNames(settlement) {
  return new Set((settlement?.institutions || [])
    .filter((/** @type {any} */ inst) => inst?.status !== 'removed' && !inst?._worldPulseInactive)
    .map((/** @type {any} */ inst) => String(inst.name || '').toLowerCase()));
}

/** @param {any} name */
function institutionId(name) {
  return `institution.${stablePart(name)}`;
}

/**
 * @param {any} entry
 * @param {any} tier
 * @param {any} outcome
 */
function newInstitution(entry, tier, outcome) {
  return {
    id: institutionId(entry.name),
    name: entry.name,
    category: entry.category,
    status: 'active',
    description: entry.spec.desc || '',
    tags: Array.isArray(entry.spec.tags) ? [...entry.spec.tags] : [],
    required: !!entry.spec.required,
    _worldPulseTierAdded: true,
    requiredForTier: tier,
    createdByWorldPulseOutcomeId: outcome?.id || null,
  };
}

/**
 * @param {import('../settlement.schema.js').SimSettlement} settlement
 * @param {any} toTier
 */
function promotionAdditions(settlement, toTier) {
  const names = existingInstitutionNames(settlement);
  return requiredInstitutionsForTier(toTier).filter(entry => !names.has(entry.name.toLowerCase()));
}

/**
 * @param {any} inst
 * @param {any} toTier
 */
function shouldRemoveForDemotion(inst, toTier) {
  if (!inst || inst.status === 'removed' || inst._worldPulseInactive) return false;
  if (inst._worldPulseTierAdded && inst.requiredForTier && !tierAtLeast(toTier, inst.requiredForTier)) return true;
  const entry = catalogEntryByName(inst.name);
  if (!entry) return false;
  if (entry.spec.minTier && !tierAtLeast(toTier, entry.spec.minTier)) return true;
  if (entry.spec.required && !tierAtLeast(toTier, entry.nativeTier)) return true;
  return false;
}

/** @param {any} inst */
function demotionFateForInstitution(inst) {
  const entry = catalogEntryByName(inst?.name);
  const category = String(inst?.category || entry?.category || '').toLowerCase();
  const text = `${inst?.name || ''} ${(inst?.tags || []).join(' ')} ${category}`.toLowerCase();
  if (/watch|guard|garrison|barrack|military|defense|fort|wall/.test(text)) return { fate: 'reduced_to_watch_post', status: 'remnant' };
  if (/academy|library|sage|wizard|mage|arcane|college|school/.test(text)) return { fate: 'abandoned', status: 'removed' };
  if (/market|guild|bank|merchant|warehouse|trade|craft|smith|mill/.test(text)) return { fate: 'privatized', status: 'remnant' };
  if (/temple|church|shrine|monastery|religious|divine/.test(text)) return { fate: 'survives_as_remnant', status: 'remnant' };
  if (/court|council|hall|bureau|civic|legal|government|administration/.test(text)) return { fate: 'downsized', status: 'remnant' };
  if (/thief|smuggl|criminal|gang/.test(text)) return { fate: 'captured_by_local_powers', status: 'remnant' };
  return { fate: 'hollowed_out', status: 'remnant' };
}

/**
 * @param {any} inst
 * @param {any} outcome
 * @param {any} toTier
 */
function deactivateForDemotion(inst, outcome, toTier) {
  const fate = demotionFateForInstitution(inst);
  return {
    ...inst,
    status: fate.status,
    _worldPulseInactive: true,
    worldPulseFate: fate.fate,
    demotedByWorldPulseOutcomeId: outcome?.id || null,
    removedByWorldPulseOutcomeId: fate.status === 'removed' ? (outcome?.id || null) : inst.removedByWorldPulseOutcomeId,
    removedReason: `Demoted below ${inst.requiredForTier || catalogEntryByName(inst.name)?.nativeTier || 'higher'} tier support; fate: ${fate.fate.replace(/_/g, ' ')}.`,
    remnantReason: fate.status === 'remnant'
      ? `No longer fully supported after demotion to ${toTier}; survives as ${fate.fate.replace(/_/g, ' ')}.`
      : inst.remnantReason,
  };
}

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
      const recovery = canRecoverResource(resource, settlement, {
        demotion: previousDrift?.direction === 'demotion',
        pressureScore,
      });
      if (!recovery.canRecover) continue;
      const severity = clamp01((1 - pressureScore) * 0.5 + (previousDrift?.direction === 'demotion' ? 0.22 : 0));
      out.push({
        id: `candidate.resource.recover.${stablePart(item.id)}.${stablePart(resource)}.${tick}`,
        type: 'resource',
        candidateType: 'resource_recovery',
        ruleId: 'resource_recovery',
        ruleFamily: 'resource',
        targetSaveId: item.id,
        severity,
        probability: clamp01(0.08 + severity * 0.34),
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
export function applyTierOutcomeToSettlement(settlement, outcome) {
  if (!settlement || !outcome?.tierChange) return settlement;
  const { fromTier, toTier, direction } = outcome.tierChange;
  // Self-contained re-verify (same contract as applyInstitutionLifecycleOutcome):
  // proposals re-apply this from the stored outcome, possibly many ticks after
  // the candidate fired. A stale fromTier must not rewind the tier — that runs
  // roster surgery in the wrong direction and writes a bogus tierHistory entry.
  const currentTier = settlement.tier || popToTier(settlement.population || 0);
  if (currentTier !== fromTier) return settlement;
  let institutions = Array.isArray(settlement.institutions) ? [...settlement.institutions] : [];
  const institutionFates = /** @type {any[]} */ ([]);

  if (direction === 'promotion') {
    // A required institution may already exist as an inactive remnant (e.g.
    // closed by the institution lifecycle during a lean stretch, or left
    // behind by an earlier demotion) — promotionAdditions cannot see those
    // because existingInstitutionNames excludes them. Reactivate the remnant
    // instead of appending a same-name duplicate.
    const additions = promotionAdditions(settlement, toTier);
    const reactivated = new Set();
    institutions = institutions.map(inst => {
      const match = additions.find(entry => entry.name.toLowerCase() === String(inst?.name || '').toLowerCase());
      if (!match || !(inst.status === 'removed' || inst._worldPulseInactive)) return inst;
      reactivated.add(match.name.toLowerCase());
      institutionFates.push({
        name: inst.name,
        category: inst.category || match.category,
        fate: 'reactivated',
        tier: toTier,
      });
      return {
        ...inst,
        status: 'active',
        impairments: [],
        _worldPulseInactive: false,
        _worldPulseEconomyClosed: false,
        worldPulseFate: null,
        required: true,
        requiredForTier: toTier,
        _worldPulseTierAdded: true,
        createdByWorldPulseOutcomeId: inst.createdByWorldPulseOutcomeId || outcome?.id || null,
      };
    });
    const fresh = additions
      .filter(entry => !reactivated.has(entry.name.toLowerCase()))
      .map(entry => {
        institutionFates.push({
          name: entry.name,
          category: entry.category,
          fate: 'added',
          tier: toTier,
        });
        return newInstitution(entry, toTier, outcome);
      });
    institutions = [...institutions, ...fresh];
  } else {
    institutions = institutions.map(inst => {
      if (!shouldRemoveForDemotion(inst, toTier)) return inst;
      institutionFates.push({
        name: inst.name,
        category: inst.category || catalogEntryByName(inst.name)?.category || null,
        fate: demotionFateForInstitution(inst).fate,
        tier: toTier,
      });
      return deactivateForDemotion(inst, outcome, toTier);
    });
  }

  return {
    ...settlement,
    tier: toTier,
    config: {
      ...(settlement.config || {}),
      tier: toTier,
      settType: toTier,
    },
    institutions,
    tierHistory: [
      ...(Array.isArray(settlement.tierHistory) ? settlement.tierHistory.slice(-11) : []),
      {
        fromTier,
        toTier,
        direction,
        outcomeId: outcome.id,
        institutionFates,
      },
    ],
    institutionHistory: [
      ...(Array.isArray(settlement.institutionHistory) ? settlement.institutionHistory.slice(-23) : []),
      ...institutionFates.map(fate => ({
        ...fate,
        outcomeId: outcome.id,
        reason: `World Pulse ${direction} to ${toTier}.`,
      })),
    ].slice(-24),
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
