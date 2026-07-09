import { institutionalCatalog } from '../../data/institutionalCatalog.js';
import { POPULATION_RANGES, TIER_ORDER, popToTier, tierAtLeast } from '../../data/constants.js';
import { SUPPLY_CHAIN_NEEDS, RESOURCE_TO_CHAINS } from '../../data/supplyChainData.js';
import { RESOURCE_DATA } from '../../data/resourceData.js';
import { exactGoodId } from '../region/goodsCatalog.js';
import { stablePart } from './worldState.js';
import { intensityMultiplier, normalizeSimulationRules } from './simulationRules.js';
import { canRecoverResource, classifyResource } from './resourceTaxonomy.js';

/** @typedef {import('./worldState.js').WorldState} TrdWorldState */
/** @typedef {ReturnType<typeof normalizeSimulationRules>} SimRules */
/** @typedef {{ get?: (id: string, kind: string) => ({ score?: number } | null | undefined) }} TrdPressureIndex */
/**
 * @typedef {Object} TRDInstitution
 * @property {string} [id]
 * @property {string} [name]
 * @property {string} [category]
 * @property {string} [status]
 * @property {string[]} [tags]
 * @property {boolean} [required]
 * @property {string} [requiredForTier]
 * @property {boolean} [_worldPulseInactive]
 * @property {boolean} [_worldPulseTierAdded]
 * @property {(string|null)} [removedByWorldPulseOutcomeId]
 * @property {string} [remnantReason]
 * @property {(string|null)} [createdByWorldPulseOutcomeId]
 */
/**
 * @typedef {Object} TRDConfig
 * @property {unknown[]} [nearbyResources]
 * @property {Record<string, unknown>} [nearbyResourcesState]
 * @property {unknown[]} [nearbyResourcesDepleted]
 * @property {string} [tier]
 * @property {string} [settType]
 */
/**
 * @typedef {Object} TRDSettlement
 * @property {string} [tier]
 * @property {number} [population]
 * @property {TRDInstitution[]} [institutions]
 * @property {TRDConfig} [config]
 * @property {{ primaryExports?: unknown[], primaryImports?: unknown[] }} [economicState]
 * @property {unknown[]} [nearbyResources]
 * @property {unknown[]} [nearbyResourcesDepleted]
 * @property {unknown[]} [tierHistory]
 * @property {unknown[]} [institutionHistory]
 * @property {unknown[]} [resourceHistory]
 */
/**
 * @typedef {Object} TRDItem
 * @property {string} id
 * @property {string} [name]
 * @property {TRDSettlement} [settlement]
 * @property {{ resourcePressure?: { value?: unknown } }} [system]
 */
/**
 * @typedef {Object} TRDSpec
 * @property {boolean} [required]
 * @property {string} [desc]
 * @property {string[]} [tags]
 * @property {string} [minTier]
 * @property {string} [exclusiveGroup]
 */
/**
 * @typedef {Object} TRDEntry
 * @property {string} name
 * @property {string} category
 * @property {TRDSpec} spec
 */
/**
 * @typedef {Object} TRDOutcome
 * @property {(string|null)} [id]
 * @property {{ fromTier?: string, toTier?: string, direction?: string, saveId?: string }} [tierChange]
 * @property {{ resource?: string, state?: string, saveId?: string }} [resourcePatch]
 * @property {string} [headline]
 * @property {string} [candidateType]
 */
/**
 * @typedef {Object} TierDrift
 * @property {string} direction
 * @property {string} fromTier
 * @property {string} toTier
 * @property {number} support
 * @property {number} severity
 * @property {string} reason
 * @property {number} [streak]
 * @property {number} [lastEvaluatedTick]
 */

/** @param {unknown} value @returns {number} */
function clamp01(value) {
  const n = Number.isFinite(value) ? /** @type {number} */ (value) : 0;
  return Math.max(0, Math.min(1, n));
}

/** @param {string | undefined} tier @returns {number} */
function tierRank(tier) {
  const idx = TIER_ORDER.indexOf(/** @type {string} */ (tier));
  return idx >= 0 ? idx : TIER_ORDER.indexOf('village');
}

/**
 * @param {TrdPressureIndex | null | undefined} pressureIdx
 * @param {unknown} settlementId
 * @param {string} kind
 * @returns {number}
 */
function pressure(pressureIdx, settlementId, kind) {
  return pressureIdx?.get?.(/** @type {string} */ (settlementId), kind)?.score || 0;
}

/**
 * @param {TrdPressureIndex | null | undefined} pressureIdx
 * @param {unknown} settlementId
 * @returns {number}
 */
function supportScore(pressureIdx, settlementId) {
  const food = pressure(pressureIdx, settlementId, 'food');
  const conflict = pressure(pressureIdx, settlementId, 'conflict');
  const trade = pressure(pressureIdx, settlementId, 'trade');
  const legitimacy = pressure(pressureIdx, settlementId, 'legitimacy');
  const disease = pressure(pressureIdx, settlementId, 'disease');
  return clamp01(1 - (food * 0.22 + conflict * 0.24 + trade * 0.2 + legitimacy * 0.2 + disease * 0.14));
}

/** @param {unknown} tier @returns {TRDEntry[]} */
export function entriesForTier(tier) {
  const tierCatalog = institutionalCatalog[/** @type {keyof typeof institutionalCatalog} */ (tier)] || {};
  /** @type {TRDEntry[]} */
  const entries = [];
  for (const [category, group] of Object.entries(tierCatalog)) {
    for (const [name, spec] of Object.entries(group || {})) {
      entries.push({ name, category, spec: /** @type {TRDSpec} */ (spec || {}) });
    }
  }
  return entries;
}

/** @param {unknown} tier @returns {TRDEntry[]} */
function requiredInstitutionsForTier(tier) {
  return entriesForTier(tier).filter(entry => entry.spec.required);
}

/** @param {unknown} name @returns {(TRDEntry & { nativeTier: string }) | null} */
export function catalogEntryByName(name) {
  const needle = String(name || '').toLowerCase();
  for (const tier of TIER_ORDER) {
    const found = entriesForTier(tier).find(entry => entry.name.toLowerCase() === needle);
    if (found) return { ...found, nativeTier: tier };
  }
  return null;
}

/** @param {TRDSettlement | null | undefined} settlement @returns {Set<string>} */
export function existingInstitutionNames(settlement) {
  return new Set((settlement?.institutions || [])
    .filter(inst => inst?.status !== 'removed' && !inst?._worldPulseInactive)
    .map(inst => String(inst.name || '').toLowerCase()));
}

/** @param {string} name @returns {string} */
function institutionId(name) {
  return `institution.${stablePart(name)}`;
}

/**
 * @param {TRDEntry} entry
 * @param {string} tier
 * @param {TRDOutcome | null | undefined} outcome
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

/** @param {TRDSettlement | null | undefined} settlement @param {string} toTier @returns {TRDEntry[]} */
function promotionAdditions(settlement, toTier) {
  const names = existingInstitutionNames(settlement);
  return requiredInstitutionsForTier(toTier).filter(entry => !names.has(entry.name.toLowerCase()));
}

/** @param {TRDInstitution | null | undefined} inst @param {string} toTier @returns {boolean} */
function shouldRemoveForDemotion(inst, toTier) {
  if (!inst || inst.status === 'removed' || inst._worldPulseInactive) return false;
  if (inst._worldPulseTierAdded && inst.requiredForTier && !tierAtLeast(toTier, inst.requiredForTier)) return true;
  const entry = catalogEntryByName(inst.name);
  if (!entry) return false;
  if (entry.spec.minTier && !tierAtLeast(toTier, entry.spec.minTier)) return true;
  if (entry.spec.required && !tierAtLeast(toTier, entry.nativeTier)) return true;
  return false;
}

/** @param {TRDInstitution | null | undefined} inst @returns {{ fate: string, status: string }} */
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
 * @param {TRDInstitution} inst
 * @param {TRDOutcome | null | undefined} outcome
 * @param {string} toTier
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

/** @param {string} direction @param {string} targetTier @returns {number} */
function requiredStreak(direction, targetTier) {
  const rank = tierRank(targetTier);
  return direction === 'promotion'
    ? Math.max(2, rank + 1)
    : Math.max(2, Math.ceil((rank + 1) / 2));
}

/**
 * @param {TRDItem} item
 * @param {TrdPressureIndex | null | undefined} pressureIdx
 * @returns {TierDrift | null}
 */
function tierEligibility(item, pressureIdx) {
  const settlement = item.settlement || {};
  const currentTier = settlement.tier || popToTier(settlement.population || 0);
  const rank = tierRank(currentTier);
  const pop = Math.max(0, Math.round(Number(settlement.population) || 0));
  const support = supportScore(pressureIdx, item.id);
  const nextTier = TIER_ORDER[rank + 1] || null;
  const previousTier = TIER_ORDER[rank - 1] || null;

  if (nextTier && pop >= (POPULATION_RANGES[/** @type {keyof typeof POPULATION_RANGES} */ (nextTier)]?.min || Infinity) * 0.92 && support >= 0.62) {
    return {
      direction: 'promotion',
      fromTier: currentTier,
      toTier: nextTier,
      support,
      severity: clamp01((pop / (POPULATION_RANGES[/** @type {keyof typeof POPULATION_RANGES} */ (nextTier)]?.min || pop)) * 0.45 + support * 0.55),
      reason: `${currentTier} is near ${nextTier} population and has sustained trade, defense, and legitimacy support.`,
    };
  }

  const currentMin = POPULATION_RANGES[/** @type {keyof typeof POPULATION_RANGES} */ (currentTier)]?.min || 0;
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

/**
 * @param {TRDItem} item
 * @param {TierDrift & { streak: number }} drift
 * @param {number} tick
 */
function tierCandidate(item, drift, tick) {
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
    applyMode: 'proposal',
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

/** @param {TRDSettlement | null | undefined} settlement @returns {string[]} */
function resourceList(settlement) {
  return [
    ...(settlement?.config?.nearbyResources || []),
    ...(settlement?.nearbyResources || []),
  ].filter(Boolean).map(String).filter((value, index, arr) => arr.indexOf(value) === index);
}

/** @param {TRDSettlement | null | undefined} settlement @param {string} resource @returns {unknown} */
function resourceState(settlement, resource) {
  const explicit = settlement?.config?.nearbyResourcesState?.[resource];
  if (explicit) return explicit;
  const depleted = new Set(settlement?.config?.nearbyResourcesDepleted || settlement?.nearbyResourcesDepleted || []);
  return depleted.has(resource) ? 'depleted' : 'allow';
}

/** @param {TRDItem} item @param {TrdPressureIndex | null | undefined} pressureIdx @returns {number} */
function resourcePressure(item, pressureIdx) {
  const systemValue = item?.system?.resourcePressure?.value;
  if (Number.isFinite(systemValue)) return clamp01(/** @type {number} */ (systemValue) / 100);
  return clamp01(pressure(pressureIdx, item.id, 'food') * 0.4 + pressure(pressureIdx, item.id, 'trade') * 0.35 + pressure(pressureIdx, item.id, 'conflict') * 0.25);
}

/** @param {unknown} value @returns {Set<string>} */
function tokenSet(value) {
  return new Set(String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .split(/\s+/)
    .filter(token => token.length >= 4));
}

/** @param {unknown} text @param {unknown} resource @returns {boolean} */
function textMatchesResource(text, resource) {
  const resourceTokens = tokenSet(resource);
  if (!resourceTokens.size) return false;
  const haystack = String(text || '').toLowerCase();
  return [...resourceTokens].some(token => haystack.includes(token));
}

// Mirror of goodsCatalog's comparable(): annotation-stripped, alnum-only form
// so 'River fish (taxed by occupation)' compares equal to 'River fish'.
/** @param {unknown} value @returns {string} */
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
/** @type {Map<string, { labels: Set<string>, ids: Set<string | null> }>} */
const resourceGoodsVocabularyCache = new Map();
/** @param {unknown} resource @returns {{ labels: Set<string>, ids: Set<string | null> }} */
function resourceGoodsVocabulary(resource) {
  const key = String(resource || '');
  const cached = resourceGoodsVocabularyCache.get(key);
  if (cached) return cached;
  const goods = new Set(RESOURCE_DATA[/** @type {keyof typeof RESOURCE_DATA} */ (key)]?.tradeGoods || []);
  for (const composite of RESOURCE_TO_CHAINS[/** @type {keyof typeof RESOURCE_TO_CHAINS} */ (key)] || []) {
    const [needKey, ...innerParts] = String(composite).split('.');
    const chain = (SUPPLY_CHAIN_NEEDS[/** @type {keyof typeof SUPPLY_CHAIN_NEEDS} */ (needKey)]?.chains || []).find(c => c.id === innerParts.join('.'));
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

/** @param {unknown[] | null | undefined} labels @param {unknown} resource @returns {boolean} */
function tradeListMatchesResource(labels, resource) {
  const vocabulary = resourceGoodsVocabulary(resource);
  return (labels || []).some(label => {
    const id = exactGoodId(label);
    if (id != null && vocabulary.ids.has(id)) return true;
    return vocabulary.labels.has(comparableLabel(label));
  });
}

/** Exported for pin tests: classification feeds depletion trade-load and the
 *  primary-export recovery block, so mislabeling an exported resource as
 *  local-only underweights it in the drift logic. */
/** @param {TRDSettlement | null | undefined} settlement @param {unknown} resource @returns {string} */
export function resourceEconomicRole(settlement, resource) {
  const economicState = settlement?.economicState || {};
  const exportsList = economicState.primaryExports || [];
  const importsList = economicState.primaryImports || [];
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
 * @param {TRDItem} item
 * @param {TrdPressureIndex | null | undefined} pressureIdx
 * @param {SimRules} rules
 * @param {number} tick
 * @param {TierDrift | null | undefined} previousDrift
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
    // CADENCE DAMPING (E4-2b): a larger settlement genuinely consumes local
    // resources faster — but that has to be a BOUNDED PRESSURE TERM, not an
    // unconditional trigger. The old gate `effectivePressure >= 0.64 || rank >=
    // tierRank('city')` OR-bypassed the threshold, so every calm city/metropolis
    // rolled depletion for EVERY resource EVERY tick regardless of real demand —
    // and because exhaustibles (iron, stone, gems, salt) return canRecover:false,
    // a peaceful city one-way ratcheted them to PERMANENT depletion on a long
    // campaign. Fold tier in as a small, capped additive extraction load so
    // depletion tracks ACTUAL pressure (export load, food/trade/conflict stress):
    // a calm city now sits below the gate; only a city under genuine demand
    // crosses it. Tier still shows up in severity below, so a city that does
    // cross depletes harder than a village at the same pressure.
    const tierLoad = Math.min(0.18, Math.max(0, rank - tierRank('town')) * 0.06);
    const effectivePressure = clamp01(pressureScore + tradeLoad + tierLoad);
    if (state !== 'depleted' && effectivePressure >= 0.64) {
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
      const recovery = canRecoverResource(resource, /** @type {any} */ (settlement), /** @type {any} */ ({
        demotion: previousDrift?.direction === 'demotion',
        pressureScore,
        quietRecovery,
      }));
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
 * @param {Partial<TrdWorldState> | null | undefined} worldState
 * @param {{ settlements?: TRDItem[] } | null | undefined} snapshot
 * @param {TrdPressureIndex | null | undefined} pressureIdx
 * @param {{ simulationRules?: unknown, tick?: number, interval?: string }} [context]
 */
export function evaluateTierResourceDynamics(worldState, snapshot, pressureIdx, context = {}) {
  const rules = normalizeSimulationRules(context.simulationRules || worldState?.simulationRules);
  const tick = Number.isFinite(context.tick) ? /** @type {number} */ (context.tick) : (worldState?.tick || 0);
  const settlementTickStates = { ...(worldState?.settlementTickStates || {}) };
  const candidates = [];
  /** @type {Record<string, unknown>} */
  const driftBySettlement = {};
  // Tier candidate ids are tick-suffixed, so an unresolved tier proposal would
  // gain a duplicate every eligible tick: one pending tier proposal per
  // settlement. Streak tracking continues so a resolved proposal re-emits.
  const pendingTierProposals = new Set(/** @type {Array<{ status?: string, outcome?: { tierChange?: { saveId?: unknown } } }>} */ (worldState?.proposals || [])
    .filter(proposal => proposal?.status === 'pending' && proposal?.outcome?.tierChange?.saveId != null)
    .map(proposal => String(/** @type {{ tierChange: { saveId: unknown } }} */ (proposal.outcome).tierChange.saveId)));

  for (const item of snapshot?.settlements || []) {
    const previous = /** @type {{ tierDrift?: Partial<TierDrift> }} */ (settlementTickStates[item.id] || {});
    const eligibility = rules.tierDriftEnabled ? tierEligibility(item, pressureIdx) : null;
    let tierDrift = null;
    if (eligibility) {
      const prior = /** @type {Partial<TierDrift>} */ (previous.tierDrift || {});
      const sameTrack = prior.direction === eligibility.direction && prior.toTier === eligibility.toTier;
      tierDrift = {
        ...eligibility,
        streak: sameTrack ? (prior.streak || 0) + 1 : 1,
        lastEvaluatedTick: tick,
      };
      const candidate = tierCandidate(item, tierDrift, tick);
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
 * @param {TRDSettlement | null | undefined} settlement
 * @param {TRDOutcome | null | undefined} outcome
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
  /** @type {Array<{ name?: string, category?: (string|null), fate?: string, tier?: string }>} */
  const institutionFates = [];

  if (direction === 'promotion') {
    // A required institution may already exist as an inactive remnant (e.g.
    // closed by the institution lifecycle during a lean stretch, or left
    // behind by an earlier demotion) — promotionAdditions cannot see those
    // because existingInstitutionNames excludes them. Reactivate the remnant
    // instead of appending a same-name duplicate.
    const additions = promotionAdditions(settlement, /** @type {string} */ (toTier));
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
        return newInstitution(entry, /** @type {string} */ (toTier), outcome);
      });
    institutions = [...institutions, ...fresh];
  } else {
    institutions = institutions.map(inst => {
      if (!shouldRemoveForDemotion(inst, /** @type {string} */ (toTier))) return inst;
      institutionFates.push({
        name: inst.name,
        category: inst.category || catalogEntryByName(inst.name)?.category || null,
        fate: demotionFateForInstitution(inst).fate,
        tier: toTier,
      });
      return deactivateForDemotion(inst, outcome, /** @type {string} */ (toTier));
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
 * @param {TRDSettlement | null | undefined} settlement
 * @param {TRDOutcome | null | undefined} outcome
 */
export function applyResourceOutcomeToSettlement(settlement, outcome) {
  if (!settlement || !outcome?.resourcePatch) return settlement;
  const { resource, state } = outcome.resourcePatch;
  const config = settlement.config || {};
  /** @type {Record<string, unknown>} */
  const resourceStateMap = { ...(config.nearbyResourcesState || {}) };
  resourceStateMap[/** @type {string} */ (resource)] = state;
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
