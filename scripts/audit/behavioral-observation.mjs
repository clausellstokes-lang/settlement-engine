/**
 * Normalize one whole-world soak run into the pure behavioral-certification
 * observation shape. This file is an audit adapter: it reads the production
 * result but never changes simulation state or chooses outcomes.
 */

import {
  BEHAVIORAL_MOVER_FAMILIES,
  BEHAVIORAL_OBSERVATION_VERSION,
  CERTIFICATION_HORIZONS,
} from '../../src/domain/certification/behavioralContract.js';
import { prosperityRank } from '../../src/data/constants.js';

const FAMILY_TOKENS = Object.freeze({
  pressure: Object.freeze([
    'pressure', 'stressor', 'condition', 'aftermath', 'famine', 'disease',
    'outbreak', 'crime', 'unrest', 'corruption', 'scarcity', 'shortage',
  ]),
  place: Object.freeze([
    'resource', 'depletion', 'discovery', 'tier', 'institution', 'settlement',
    'calamity', 'disaster', 'season', 'harvest', 'urban', 'founding', 'terminal',
  ]),
  population: Object.freeze([
    'population', 'migration', 'migrant', 'emigration', 'exodus', 'refugee',
    'flight', 'birth', 'death',
  ]),
  economy: Object.freeze([
    'trade', 'market', 'economy', 'economic', 'commodity', 'caravan', 'credit',
    'embargo', 'reroute', 'toll', 'smuggling', 'prosperity', 'boom', 'bust',
    'food', 'granary', 'supply', 'blockade',
  ]),
  politics: Object.freeze([
    'politics', 'faction', 'coup', 'succession', 'challenge', 'contest',
    'government', 'legitimacy', 'authority', 'vassal', 'rebellion', 'capture',
    'coalition', 'doctrine', 'law', 'prestige',
  ]),
  war: Object.freeze([
    'war', 'army', 'siege', 'battle', 'occupation', 'conquest', 'mobilization',
    'raid', 'spoils', 'reinforcement', 'defend', 'deploy', 'peace', 'naval',
    'fleet', 'intervention', 'hostile', 'mercenary',
  ]),
  faith: Object.freeze([
    'faith', 'temple', 'religion', 'religious', 'missionize', 'schism',
    'deity', 'piety', 'cult', 'pantheon', 'pilgrim', 'tradition', 'festival',
  ]),
  people: Object.freeze([
    'npc', 'person', 'promotion', 'goal', 'bargain', 'ladder', 'culmination',
    'rebranch', 'excursion', 'ransom', 'courier',
  ]),
  constructive: Object.freeze([
    'reconstruction', 'recovery', 'relief', 'aid', 'gift', 'gratitude',
    'flourishing', 'generosity', 'founding', 'repair', 'accord', 'truce',
  ]),
  knowledge: Object.freeze([
    'belief', 'rumor', 'intel', 'information', 'discourse', 'misjudgment',
    'reconcile', 'credibility', 'news', 'revelation',
  ]),
});

const CONSTRUCTIVE_ARC_TOKENS = Object.freeze([
  'reconstruction', 'recovery', 'relief', 'aid', 'gift', 'gratitude',
  'flourishing', 'founding', 'repair', 'peace', 'accord', 'truce', 'festival',
  'boom', 'prosperity_growth',
]);

const DESTRUCTIVE_ARC_TOKENS = Object.freeze([
  'conquest', 'occupation', 'siege', 'battle', 'war', 'calamity', 'disaster',
  'famine', 'disease', 'outbreak', 'bust', 'collapse', 'terminal_death',
  'coup_succeeded', 'rebellion', 'blockade', 'raid', 'population_decline',
]);

const SUCCESSION_ATTEMPT_TOKENS = Object.freeze([
  'succession', 'coup', 'challenge', 'contest', 'government_change',
  'faction_capture',
]);

const SUCCESSION_COMPLETION_TOKENS = Object.freeze([
  'succession', 'coup_succeeded', 'government_change', 'faction_capture',
  'occupation_vassalized',
]);

const DARK_CONDITIONAL_WORLD_KEYS = Object.freeze([
  'beliefStates',
  'calamities',
  'deployments',
  'dispositionStats',
  'epidemicFronts',
  'pantheon',
  'religionStates',
  'spatialLedgers',
  'traditions',
  'wars',
]);

const finite = (value, fallback = 0) => (
  Number.isFinite(Number(value)) ? Number(value) : fallback
);

const asObject = (value) => (
  value && typeof value === 'object' && !Array.isArray(value) ? value : {}
);

const typeOf = (record) => String(
  record?.candidateType
  || record?.ruleFamily
  || record?.ruleId
  || record?.impactKind
  || record?.type
  || record?.kind
  || record?.id
  || 'unknown',
);

function tokensOf(value) {
  return new Set(String(value || '').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean));
}

function containsToken(value, candidates) {
  const raw = String(value || '').toLowerCase();
  const tokens = tokensOf(raw);
  return candidates.some((candidate) => (
    candidate.includes('_') ? raw.includes(candidate) : tokens.has(candidate)
  ));
}

/**
 * Classify an outcome into exactly one broad mover family. Unknown records stay
 * unknown instead of being forced into a convenient bucket.
 */
export function moverFamilyOf(record) {
  const text = [
    record?.ruleFamily,
    record?.candidateType,
    record?.ruleId,
    record?.impactKind,
    record?.type,
    record?.kind,
    record?.id,
  ].filter(Boolean).join('.');
  for (const family of BEHAVIORAL_MOVER_FAMILIES) {
    if (containsToken(text, FAMILY_TOKENS[family] || [])) return family;
  }
  return null;
}

function arcPolaritiesOf(record) {
  const text = [
    record?.candidateType,
    record?.ruleId,
    record?.impactKind,
    record?.type,
    record?.kind,
    record?.id,
  ].filter(Boolean).join('.');
  const polarities = [];
  if (containsToken(text, CONSTRUCTIVE_ARC_TOKENS)) polarities.push('constructive');
  if (containsToken(text, DESTRUCTIVE_ARC_TOKENS)) polarities.push('destructive');
  return polarities;
}

function isMajor(record) {
  return record?.major === true
    || record?.decisionTier === 'major'
    || record?.significance === 'major'
    || record?.applyMode === 'proposal'
    || finite(record?.severity, -1) >= 0.72;
}

function chronicleSampleOf(records) {
  const ordered = [
    ...records.filter(isMajor),
    ...records.filter((record) => !isMajor(record)),
  ];
  const seen = new Set();
  const sample = [];
  for (const record of ordered) {
    const id = String(record?.id || `${typeOf(record)}:${sample.length}`);
    if (seen.has(id)) continue;
    seen.add(id);
    sample.push({
      id,
      type: typeOf(record),
      headline: String(record?.headline || record?.title || ''),
      summary: String(record?.summary || record?.description || ''),
      targetSettlementIds: targetIdsOf(record),
      severity: Number.isFinite(Number(record?.severity))
        ? Number(record.severity)
        : null,
      parentIds: parentIdsOf(record),
    });
    if (sample.length >= 8) break;
  }
  return sample;
}

function pushId(target, value) {
  if (value == null || value === '') return;
  if (Array.isArray(value)) {
    for (const entry of value) pushId(target, entry);
    return;
  }
  if (typeof value === 'object') {
    pushId(target, value.saveId);
    pushId(target, value.settlementId);
    pushId(target, value.targetSaveId);
    return;
  }
  target.add(String(value));
}

function targetIdsOf(record) {
  const ids = new Set();
  for (const key of [
    'targetSaveId',
    'sourceSaveId',
    'settlementId',
    'settlementIds',
    'affectedSaveIds',
    'affectedSettlementIds',
  ]) {
    pushId(ids, record?.[key]);
  }
  pushId(ids, record?.subject?.settlementId);
  pushId(ids, record?.populationDeltas);
  return [...ids];
}

function parentIdsOf(record) {
  const ids = new Set();
  for (const value of [
    record?.causedBy,
    record?.causes,
    record?.parentIds,
    record?.sourceEventId,
    record?.metadata?.causedBy,
    record?.metadata?.causeId,
    record?.metadata?.parentId,
    record?.provenance?.parents,
  ]) {
    if (Array.isArray(value)) {
      for (const id of value) {
        if (id != null && typeof id !== 'object') ids.add(String(id));
      }
    } else if (value != null && typeof value !== 'object') {
      ids.add(String(value));
    }
  }
  return [...ids];
}

function factionName(faction) {
  return String(faction?.id || faction?.faction || faction?.name || '').trim();
}

function normalizedFactionDistribution(settlement) {
  const factions = Array.isArray(settlement?.powerStructure?.factions)
    ? settlement.powerStructure.factions
    : [];
  const weights = factions
    .map((faction) => [factionName(faction), Math.max(0, finite(faction?.power))])
    .filter(([name, power]) => name && power > 0);
  const total = weights.reduce((value, [, power]) => value + power, 0);
  if (!total) return new Map();
  return new Map(weights.map(([name, power]) => [name, power / total]));
}

function powerEntropy(settlement) {
  const distribution = normalizedFactionDistribution(settlement);
  if (distribution.size <= 1) return 0;
  let entropy = 0;
  for (const probability of distribution.values()) {
    entropy -= probability * Math.log(probability);
  }
  return entropy / Math.log(distribution.size);
}

function topFaction(settlement) {
  const distribution = normalizedFactionDistribution(settlement);
  return [...distribution.entries()]
    .sort((left, right) => (
      right[1] - left[1]
      || (left[0] < right[0] ? -1 : left[0] > right[0] ? 1 : 0)
    ))[0]?.[0]
    || null;
}

function distributionDistance(before, after) {
  const left = normalizedFactionDistribution(before);
  const right = normalizedFactionDistribution(after);
  const keys = new Set([...left.keys(), ...right.keys()]);
  let distance = 0;
  for (const key of keys) {
    distance += Math.abs((left.get(key) || 0) - (right.get(key) || 0));
  }
  return distance / 2;
}

function prosperityOf(settlement) {
  const value = settlement?.economicState?.prosperity;
  const label = typeof value === 'string' ? value : value?.label || value?.tier;
  return prosperityRank(label);
}

export function settlementStateVector(save) {
  const settlement = save?.settlement || save || {};
  return {
    population: Math.max(0, finite(settlement?.population)),
    prosperity: prosperityOf(settlement),
    topFaction: topFaction(settlement),
    powerEntropy: powerEntropy(settlement),
  };
}

function settlementMap(saves) {
  return new Map((Array.isArray(saves) ? saves : []).map((save) => [
    String(save?.id ?? save?.saveId ?? ''),
    save?.settlement || save,
  ]));
}

function integrityFailuresOf(settlement) {
  const power = settlement?.powerStructure;
  if (!power || !Array.isArray(power.factions) || power.factions.length === 0) return [];
  const failures = [];
  const names = power.factions.map(factionName).filter(Boolean);
  if (new Set(names.map((name) => name.toLowerCase())).size !== names.length) {
    failures.push('duplicate_faction_identity');
  }
  if (power.factions.some((faction) => (
    !Number.isFinite(Number(faction?.power))
    || Number(faction.power) < 0
    || Number(faction.power) > 100
  ))) {
    failures.push('invalid_faction_power');
  }
  const governing = power.factions.filter((faction) => faction?.isGoverning === true);
  if (governing.length > 1) failures.push('multiple_governing_factions');
  const governingName = String(power?.governingName || power?.government || '').trim();
  if (governingName && !names.some((name) => (
    name.toLowerCase() === governingName.toLowerCase()
  ))) {
    failures.push('governing_identity_missing_from_factions');
  }
  return failures;
}

/**
 * Observe one simulated year.
 */
export function observeBehavioralYear({
  year,
  result,
  beforeSaves,
  afterSaves,
}) {
  const records = (Array.isArray(result?.selected) ? result.selected : [])
    .filter((record) => record && typeof record === 'object');
  /** @type {Record<string, number>} */
  const moverCounts = Object.fromEntries(
    BEHAVIORAL_MOVER_FAMILIES.map((family) => [family, 0]),
  );
  /** @type {Record<string, number>} */
  const eventTypeCounts = {};
  /** @type {Record<string, number>} */
  const attentionCounts = {};
  const arcCounts = { constructive: 0, destructive: 0 };
  const recordFamilyById = new Map();
  let unclassifiedEventCount = 0;
  let majorEventCount = 0;

  for (const record of records) {
    const type = typeOf(record);
    eventTypeCounts[type] = (eventTypeCounts[type] || 0) + 1;
    const family = moverFamilyOf(record);
    if (family) moverCounts[family] += 1;
    else unclassifiedEventCount += 1;
    if (record?.id != null && family) recordFamilyById.set(String(record.id), family);
    if (isMajor(record)) majorEventCount += 1;
    for (const polarity of arcPolaritiesOf(record)) arcCounts[polarity] += 1;
    for (const id of targetIdsOf(record)) {
      attentionCounts[id] = (attentionCounts[id] || 0) + 1;
    }
  }

  let crossFamilyEdges = 0;
  let multiParentEvents = 0;
  const familyPairs = new Set();
  for (const record of records) {
    const childFamily = moverFamilyOf(record);
    if (!childFamily) continue;
    const parentFamilies = new Set();
    for (const parentId of parentIdsOf(record)) {
      const parentFamily = recordFamilyById.get(parentId) || moverFamilyOf({
        id: parentId,
      });
      if (!parentFamily || parentFamily === childFamily) continue;
      parentFamilies.add(parentFamily);
      crossFamilyEdges += 1;
      familyPairs.add(`${parentFamily}->${childFamily}`);
    }
    if (parentFamilies.size >= 2) multiParentEvents += 1;
  }

  const before = settlementMap(beforeSaves);
  const after = settlementMap(afterSaves);
  const stateVectors = {};
  let populationTransitions = 0;
  let populationMoved = 0;
  let prosperityTransitions = 0;
  let prosperityMoved = 0;
  let powerTransitions = 0;
  let powerMoved = 0;
  let integrityFailures = 0;
  const integrityFailureKinds = {};
  for (const [id, settlement] of after.entries()) {
    stateVectors[id] = settlementStateVector(settlement);
    for (const failure of integrityFailuresOf(settlement)) {
      integrityFailures += 1;
      integrityFailureKinds[failure] = (integrityFailureKinds[failure] || 0) + 1;
    }
    const previous = before.get(id);
    if (!previous) continue;
    const beforePopulation = Math.max(0, finite(previous?.population));
    const afterPopulation = Math.max(0, finite(settlement?.population));
    populationTransitions += 1;
    if (Math.abs(afterPopulation - beforePopulation) / Math.max(1, beforePopulation) >= 0.0025) {
      populationMoved += 1;
    }
    const beforeProsperity = prosperityOf(previous);
    const afterProsperity = prosperityOf(settlement);
    if (beforeProsperity >= 0 && afterProsperity >= 0) {
      prosperityTransitions += 1;
      if (beforeProsperity !== afterProsperity) prosperityMoved += 1;
    }
    powerTransitions += 1;
    if (topFaction(previous) !== topFaction(settlement)
      || distributionDistance(previous, settlement) >= 0.02) {
      powerMoved += 1;
    }
  }

  let successionAttempts = 0;
  let successionCompletions = 0;
  for (const record of records) {
    const type = typeOf(record);
    if (containsToken(type, SUCCESSION_ATTEMPT_TOKENS)) successionAttempts += 1;
    if (containsToken(type, SUCCESSION_COMPLETION_TOKENS)) successionCompletions += 1;
  }

  return {
    year,
    eventCount: records.length,
    majorEventCount,
    unclassifiedEventCount,
    eventTypeCounts,
    moverCounts,
    arcCounts,
    motion: {
      populationTransitions,
      populationMoved,
      prosperityTransitions,
      prosperityMoved,
      powerTransitions,
      powerMoved,
    },
    attentionCounts,
    succession: {
      attempts: successionAttempts,
      completions: successionCompletions,
      integrityFailures,
      integrityFailureKinds,
    },
    causal: {
      crossFamilyEdges,
      multiParentEvents,
      familyPairs: [...familyPairs].sort(),
    },
    chronicleSample: chronicleSampleOf(records),
    stateVectors,
  };
}

function vectorDistance(left, right) {
  if (!left || !right) return 0;
  const population = Math.abs(finite(left.population) - finite(right.population))
    / Math.max(1, finite(left.population), finite(right.population));
  const prosperity = left.prosperity >= 0 && right.prosperity >= 0
    ? Math.abs(left.prosperity - right.prosperity) / 6
    : 0;
  const entropy = Math.abs(finite(left.powerEntropy) - finite(right.powerEntropy));
  const top = left.topFaction && right.topFaction && left.topFaction !== right.topFaction
    ? 1
    : 0;
  return (population + prosperity + entropy + top) / 4;
}

/**
 * Compare the primary run with a same-seed fixture whose first settlement was
 * boundedly perturbed. The source settlement is excluded: only propagation into
 * neighbours counts.
 */
export function buildNeighborControl({
  baselineYearly,
  perturbedYearly,
  sourceSettlementId,
}) {
  const count = Math.min(
    Array.isArray(baselineYearly) ? baselineYearly.length : 0,
    Array.isArray(perturbedYearly) ? perturbedYearly.length : 0,
  );
  const checkpoints = [];
  for (let index = 0; index < count; index += 1) {
    const baseline = asObject(baselineYearly[index]?.stateVectors);
    const perturbed = asObject(perturbedYearly[index]?.stateVectors);
    const targetIds = [...new Set([...Object.keys(baseline), ...Object.keys(perturbed)])]
      .filter((id) => id !== String(sourceSettlementId));
    const distances = targetIds.map((id) => vectorDistance(baseline[id], perturbed[id]));
    const targetDistance = distances.length
      ? distances.reduce((total, value) => total + value, 0) / distances.length
      : 0;
    const year = index + 1;
    if (year === 1 || year === 10 || year === CERTIFICATION_HORIZONS.useful.years
      || year === 100 || year === 200 || year === CERTIFICATION_HORIZONS.research.years
      || year === count) {
      checkpoints.push({ year, targetDistance });
    }
  }
  return {
    executed: count > 0,
    perturbation: 'source population +10 percent; all seed and graph inputs otherwise identical',
    sourceSettlementId: String(sourceSettlementId),
    yearsCompared: count,
    checkpoints,
  };
}

function isNonEmpty(value) {
  if (Array.isArray(value)) return value.length > 0;
  return value && typeof value === 'object' ? Object.keys(value).length > 0 : value != null;
}

export function buildDarkControl({
  litBaselineYear,
  darkYearly,
  finalWorldState,
}) {
  const darkActivityCount = (darkYearly || [])
    .reduce((total, year) => total + finite(year?.eventCount), 0);
  const conditionalStateLeaks = DARK_CONDITIONAL_WORLD_KEYS
    .filter((key) => isNonEmpty(finalWorldState?.[key]));
  return {
    executed: Array.isArray(darkYearly) && darkYearly.length > 0,
    oracle: 'all boolean mover gates false, propagation off, migration void, and patron-deity activation removed',
    litBaselineActivityCount: finite(litBaselineYear?.eventCount),
    darkActivityCount,
    conditionalStateLeaks,
  };
}

export function buildBehavioralObservation({
  settlementIds,
  yearly,
  controls = {},
}) {
  return {
    schemaVersion: BEHAVIORAL_OBSERVATION_VERSION,
    kind: 'whole_world_behavioral_observation',
    settlementIds: (settlementIds || []).map(String),
    yearly: Array.isArray(yearly) ? yearly : [],
    controls,
  };
}
