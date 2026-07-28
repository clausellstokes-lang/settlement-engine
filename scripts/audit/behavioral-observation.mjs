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
import { deriveDecisionTier } from '../../src/domain/worldPulse/decisionTier.js';
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

// Exact production vocabulary only. Generic `challenge` / `contest` tokens also
// describe rival-power and religious contests, while faction capture and
// vassalization are not seat successions.
const SUCCESSION_ATTEMPT_APPLIED_TYPES = new Set([
  'stressor_birth_coup_detat',
  'faction_government_challenge',
]);

const SUCCESSION_COMPLETION_APPLIED_TYPES = new Set([
  'coup_succeeded',
  'faction_government_challenge',
]);

const SUCCESSION_PROPOSAL_TYPES = new Set([
  ...SUCCESSION_ATTEMPT_APPLIED_TYPES,
  ...SUCCESSION_COMPLETION_APPLIED_TYPES,
]);

const OBSERVED_YEAR_TICKS = 52;

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

function isMajor(record, majorIds = null) {
  if (majorIds instanceof Set) {
    return record?.id != null && majorIds.has(String(record.id));
  }
  return deriveDecisionTier(record) === 'major';
}

function chronicleSampleOf(records, majorIds) {
  const ordered = [
    ...records.filter((record) => isMajor(record, majorIds)),
    ...records.filter((record) => !isMajor(record, majorIds)),
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

function observationEndTick(result) {
  for (const value of [result?.tick, result?.worldState?.tick]) {
    const tick = finite(value, Number.NaN);
    if (Number.isFinite(tick)) return tick;
  }
  return null;
}

function recordFallsInObservedYear(record, endTick) {
  if (endTick == null) return true;
  const tick = finite(record?.tick, Number.NaN);
  return Number.isFinite(tick)
    && tick > endTick - OBSERVED_YEAR_TICKS
    && tick <= endTick;
}

/**
 * Post-apply movers (belief reconciliation, upswing, the NPC ladder, and other
 * aggregate lanes) do not join `result.selected`. Read their uncapped audit
 * receipts plus the terminal feed fallback for mover/arc reachability. Exclude
 * only the canonical applied/proposal twin of a selected outcome: derived
 * receipts may share its sourceEventId and still prove a separate mover.
 */
function isSelectedOutcomeNewsTwin(entry, selectedIds) {
  const sourceEventId = entry?.sourceEventId == null
    ? ''
    : String(entry.sourceEventId);
  if (!sourceEventId || !selectedIds.has(sourceEventId) || entry?.tick == null) return false;
  const prefix = `wizard_news.${String(entry.tick)}.world_pulse`;
  const id = String(entry?.id || '');
  return id === `${prefix}.applied.${sourceEventId}`
    || id === `${prefix}.proposal.${sourceEventId}`;
}

function postApplyRecordsOf(result, selectedIds, rawWizardNewsEntries) {
  const endTick = observationEndTick(result);
  const terminalEntries = Array.isArray(result?.wizardNews?.entries)
    ? result.wizardNews.entries
    : [];
  const observedEntries = Array.isArray(rawWizardNewsEntries)
    ? rawWizardNewsEntries
    : [];
  const byId = new Map();
  for (const entry of [...terminalEntries, ...observedEntries]) {
    if (!entry || typeof entry !== 'object' || !entry.id) continue;
    if (entry.source === 'table' || !recordFallsInObservedYear(entry, endTick)) continue;
    if (isSelectedOutcomeNewsTwin(entry, selectedIds)) continue;
    byId.set(String(entry.id), entry);
  }
  return [...byId.values()];
}

function majorIdsOf(result, records) {
  const majors = Array.isArray(result?.majors)
    ? result.majors.filter((record) => record && typeof record === 'object')
    : records.filter((record) => deriveDecisionTier(record) === 'major');
  return {
    count: majors.length,
    ids: new Set(majors
      .map((record) => record?.id)
      .filter((id) => id != null)
      .map(String)),
  };
}

function familyOfLedgerNode(id, entry, recordFamilyById) {
  const recordedFamily = recordFamilyById.get(String(id));
  if (recordedFamily) return recordedFamily;
  const typedFamily = moverFamilyOf({ candidateType: entry?.type });
  if (typedFamily) return typedFamily;
  const semanticId = String(id).replace(/^wizard_news\.[^.]+\./, '');
  return moverFamilyOf({ id: semanticId });
}

function causalObservationFromRecords(records, recordFamilyById) {
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
  return {
    crossFamilyEdges,
    multiParentEvents,
    familyPairs: [...familyPairs].sort(),
  };
}

/**
 * Production causal truth lives in the provenance ledger, not on the selected
 * array. Each ledger row is child receipt -> explicit parent receipt ids.
 */
function causalObservationOf(result, records, recordFamilyById) {
  const ledger = asObject(result?.worldState?.spatialLedgers?.provenance);
  const provenanceEnabled = result?.worldState?.simulationRules
    ?.provenanceLedgerEnabled === true;
  if (!provenanceEnabled && Object.keys(ledger).length === 0) {
    return causalObservationFromRecords(records, recordFamilyById);
  }

  const endTick = observationEndTick(result);
  let crossFamilyEdges = 0;
  let multiParentEvents = 0;
  const familyPairs = new Set();
  for (const [childId, rawEntry] of Object.entries(ledger)) {
    const entry = asObject(rawEntry);
    if (!recordFallsInObservedYear(entry, endTick)) continue;
    const childFamily = familyOfLedgerNode(childId, entry, recordFamilyById);
    if (!childFamily) continue;
    const parentFamilies = new Set();
    for (const rawParentId of Array.isArray(entry.parents) ? entry.parents : []) {
      if (rawParentId == null || typeof rawParentId === 'object') continue;
      const parentId = String(rawParentId);
      const parentFamily = familyOfLedgerNode(
        parentId,
        asObject(ledger[parentId]),
        recordFamilyById,
      );
      if (!parentFamily || parentFamily === childFamily) continue;
      parentFamilies.add(parentFamily);
      crossFamilyEdges += 1;
      familyPairs.add(`${parentFamily}->${childFamily}`);
    }
    if (parentFamilies.size >= 2) multiParentEvents += 1;
  }
  return {
    crossFamilyEdges,
    multiParentEvents,
    familyPairs: [...familyPairs].sort(),
  };
}

function isLadderChallengeReceipt(record) {
  if (record?.impactKind !== 'npc_ladder') return false;
  const tags = new Set((Array.isArray(record?.tags) ? record.tags : []).map(String));
  return tags.has('npc_ladder') && (tags.has('rise') || tags.has('failed'));
}

function proposalCandidateType(proposal) {
  return String(proposal?.outcome?.candidateType || proposal?.candidateType || '');
}

/**
 * Selected is not applied: every proposal-mode outcome appears in `selected`
 * before applyWorldPulseOutcomes parks it for the DM. Actual succession credit
 * therefore comes only from autoApplied receipts (plus the NPC ladder's explicit
 * rise/failed receipts). Proposal receipts remain visible as a separate count.
 */
function successionObservationOf(result, postApplyRecords) {
  const applied = Array.isArray(result?.autoApplied) ? result.autoApplied : [];
  let attempts = applied.filter((record) => (
    SUCCESSION_ATTEMPT_APPLIED_TYPES.has(String(record?.candidateType || ''))
  )).length;
  let completions = applied.filter((record) => (
    SUCCESSION_COMPLETION_APPLIED_TYPES.has(String(record?.candidateType || ''))
    || (record?.type === 'power_transfer' && record?.powerTransfer?.cause === 'coup')
  )).length;
  const pendingProposalIds = new Set((Array.isArray(result?.proposals) ? result.proposals : [])
    .filter((proposal) => (
      proposal?.status === 'pending'
      && SUCCESSION_PROPOSAL_TYPES.has(proposalCandidateType(proposal))
    ))
    .map((proposal, index) => String(proposal?.id || `pending-succession:${index}`)));

  for (const record of postApplyRecords) {
    if (!isLadderChallengeReceipt(record)) continue;
    attempts += 1;
    if ((record.tags || []).map(String).includes('rise')) completions += 1;
  }
  return { pendingProposals: pendingProposalIds.size, attempts, completions };
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
  rawWizardNewsEntries = null,
}) {
  const records = (Array.isArray(result?.selected) ? result.selected : [])
    .filter((record) => record && typeof record === 'object');
  const selectedIds = new Set(records
    .map((record) => record?.id)
    .filter((id) => id != null)
    .map(String));
  const postApplyRecords = postApplyRecordsOf(result, selectedIds, rawWizardNewsEntries);
  const major = majorIdsOf(result, records);
  /** @type {Record<string, number>} */
  const moverCounts = Object.fromEntries(
    BEHAVIORAL_MOVER_FAMILIES.map((family) => [family, 0]),
  );
  /** @type {Record<string, number>} */
  const selectedMoverCounts = Object.fromEntries(
    BEHAVIORAL_MOVER_FAMILIES.map((family) => [family, 0]),
  );
  /** @type {Record<string, number>} */
  const postApplyMoverCounts = Object.fromEntries(
    BEHAVIORAL_MOVER_FAMILIES.map((family) => [family, 0]),
  );
  /** @type {Record<string, number>} */
  const eventTypeCounts = {};
  /** @type {Record<string, number>} */
  const attentionCounts = {};
  const arcCounts = { constructive: 0, destructive: 0 };
  const postApplyArcCounts = { constructive: 0, destructive: 0 };
  const recordFamilyById = new Map();
  let unclassifiedEventCount = 0;

  for (const record of records) {
    const type = typeOf(record);
    eventTypeCounts[type] = (eventTypeCounts[type] || 0) + 1;
    const family = moverFamilyOf(record);
    if (family) {
      moverCounts[family] += 1;
      selectedMoverCounts[family] += 1;
    } else {
      unclassifiedEventCount += 1;
    }
    if (record?.id != null && family) recordFamilyById.set(String(record.id), family);
    for (const polarity of arcPolaritiesOf(record)) arcCounts[polarity] += 1;
    for (const id of targetIdsOf(record)) {
      attentionCounts[id] = (attentionCounts[id] || 0) + 1;
    }
  }

  // These receipts prove that aggregate post-apply lanes can actually move. They
  // enrich family/arc reachability only: eventCount, type mix, and attention stay
  // anchored to the contract's selected-outcome throughput unit.
  for (const record of postApplyRecords) {
    const family = moverFamilyOf(record);
    if (family) {
      moverCounts[family] += 1;
      postApplyMoverCounts[family] += 1;
    }
    for (const polarity of arcPolaritiesOf(record)) {
      arcCounts[polarity] += 1;
      postApplyArcCounts[polarity] += 1;
    }
  }
  const causal = causalObservationOf(result, records, recordFamilyById);

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

  const succession = successionObservationOf(result, postApplyRecords);

  return {
    year,
    eventCount: records.length,
    majorEventCount: major.count,
    unclassifiedEventCount,
    eventTypeCounts,
    moverCounts,
    selectedMoverCounts,
    postApplyMoverCounts,
    postApplyReceiptCount: postApplyRecords.length,
    arcCounts,
    postApplyArcCounts,
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
      ...succession,
      integrityFailures,
      integrityFailureKinds,
    },
    causal,
    chronicleSample: chronicleSampleOf(records, major.ids),
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
