/**
 * Normalize one whole-world soak run into the pure behavioral-certification
 * observation shape. This file is an audit adapter: it reads the production
 * result but never changes simulation state or chooses outcomes.
 */

import {
  BEHAVIORAL_MOVER_FAMILIES,
  BEHAVIORAL_OBSERVATION_VERSION,
  CERTIFICATION_HORIZONS,
  SOAK_RECEIPT_SCHEMA_VERSION,
} from '../../src/domain/certification/behavioralContract.js';
import { deriveDecisionTier } from '../../src/domain/worldPulse/decisionTier.js';
import { observeRealmSelfSufficiency } from '../../src/domain/worldPulse/routeNetworkFlowsSelfSufficiency.js';
import { observeRealmDemography } from '../../src/domain/worldPulse/demographicsObservation.js';
import { isPublicOutcome, isStateOnlyOutcome } from '../../src/domain/worldPulse/pulseHelpers.js';
import { prosperityRank } from '../../src/data/constants.js';
import { measurePhraseRepetition } from './phrase-repetition.mjs';

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
    // IN-0a adds `plant`: a PLANTED story is an act of the knowledge lane on its own
    // vocabulary, so `plant_took` (and the `brokerage_plant` act's own applied receipt)
    // classify here by MEANING rather than by the bare `news` token in a wizard-news id —
    // the contamination path IN-6's ratchet exists to shrink. Executed census before adding
    // it: exactly one other token in src/ or scripts/ contains the substring, and it is the
    // internal envoy-picture patch `kind: 'plant'`, which is not a news kind.
    'belief', 'rumor', 'intel', 'information', 'discourse', 'misjudgment',
    'reconcile', 'credibility', 'news', 'revelation', 'plant',
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
    if (!isPublicOutcome(entry)) continue;
    if (entry.source === 'table' || !recordFallsInObservedYear(entry, endTick)) continue;
    if (isSelectedOutcomeNewsTwin(entry, selectedIds)) continue;
    byId.set(String(entry.id), entry);
  }
  return [...byId.values()];
}

function majorIdsOf(result, records) {
  const majors = Array.isArray(result?.majors)
    ? result.majors.filter((record) => record && typeof record === 'object' && isPublicOutcome(record))
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

function causalObservationFromRecords(records, recordFamilyById, mechanicalIds) {
  let crossFamilyEdges = 0;
  let multiParentEvents = 0;
  const familyPairs = new Set();
  for (const record of records) {
    const childFamily = moverFamilyOf(record);
    if (!childFamily) continue;
    const parentFamilies = new Set();
    for (const parentId of parentIdsOf(record)) {
      if (mechanicalIds.has(String(parentId))) continue;
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
function causalObservationOf(result, records, recordFamilyById, mechanicalIds) {
  const ledger = asObject(result?.worldState?.spatialLedgers?.provenance);
  const provenanceEnabled = result?.worldState?.simulationRules
    ?.provenanceLedgerEnabled === true;
  if (!provenanceEnabled && Object.keys(ledger).length === 0) {
    return causalObservationFromRecords(records, recordFamilyById, mechanicalIds);
  }

  const endTick = observationEndTick(result);
  let crossFamilyEdges = 0;
  let multiParentEvents = 0;
  const familyPairs = new Set();
  for (const [childId, rawEntry] of Object.entries(ledger)) {
    const entry = asObject(rawEntry);
    if (entry.receiptClass === 'mechanical' || mechanicalIds.has(String(childId))) continue;
    if (!recordFallsInObservedYear(entry, endTick)) continue;
    const childFamily = familyOfLedgerNode(childId, entry, recordFamilyById);
    if (!childFamily) continue;
    const parentFamilies = new Set();
    for (const rawParentId of Array.isArray(entry.parents) ? entry.parents : []) {
      if (rawParentId == null || typeof rawParentId === 'object') continue;
      const parentId = String(rawParentId);
      const parentEntry = asObject(ledger[parentId]);
      if (parentEntry.receiptClass === 'mechanical' || mechanicalIds.has(parentId)) continue;
      const parentFamily = familyOfLedgerNode(
        parentId,
        parentEntry,
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
  const applied = Array.isArray(result?.autoApplied)
    ? result.autoApplied.filter(isPublicOutcome)
    : [];
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

// ── BELIEF DIVERGENCE (2026-07-31) ───────────────────────────────────────────
// THE BLIND SPOT THIS CLOSES. infoMode is the one unlocked simulation-profile axis
// (omniscient / perfect_delayed / full / unreliable) and NOTHING in the receipt
// envelope observed its consequence. A run could carry infoMode 'full' and a fully
// materialized belief map while every belief in it was either perfectly true or
// permanently wrong, and no field could tell those apart. Worse, the obvious proxy
// is a trap: the `knowledge` mover family is a RESIDUAL bucket (fifteen unrelated
// impactKinds reach it through the `news` token in their own wizard-news id), so
// "knowledge: 28" over thirty years proves nothing about the belief lane at all.
//
// WHAT IS MEASURED. Two CATEGORICAL belief axes, each compared against a ground
// truth this adapter can read exactly, with no re-implementation of engine math:
//   relationship  the believed allianceLabel against the declared relationship on
//                 the regional-graph edge, overlaid by worldState.relationshipStates
//                 (read the same way beliefMap's relationshipNeighbourhood reads it).
//   faith         the believed faithLabel against the settlement's public
//                 primaryDeitySnapshot name (the same field groundTruthBelief seeds
//                 from).
// The numeric axes (strengthBand, readiness) are DELIBERATELY NOT compared: their
// ground truth is settlementStrength over a live pressure index, and reconstructing
// it here would fork the engine's math into an audit adapter, which is exactly the
// drift this estate has been bitten by. Their absence is reported as an axis gap
// rather than folded silently into the mean.
//
// Pure and deterministic: sorted key iteration, integer tick arithmetic, no clock,
// no rng, no locale compare. Observational only; it tunes and mutates nothing.

/** The reserved one-key seed sentinel that sits BESIDE the observer ids in the
 *  belief map (beliefMap.js BELIEF_SEED_KEY). It is not an observer. */
const BELIEF_SEED_SENTINEL = '__seededAt';

/** 4-dp round, so the metric adds bounded, byte-stable digits to the receipt. */
const round4 = (value) => Math.round(finite(value) * 10000) / 10000;

/**
 * observer|subject (both directions) to the DECLARED relationship label, read off
 * the regional-graph edges and overlaid by worldState.relationshipStates on the
 * edge id. Tolerant of the from/source/a and to/target/b aliases, matching the
 * belief engine's own edge reader.
 */
function declaredRelationshipIndex(result) {
  const states = asObject(result?.worldState?.relationshipStates);
  const edges = Array.isArray(result?.regionalGraph?.edges)
    ? result.regionalGraph.edges
    : [];
  const index = new Map();
  for (const raw of edges) {
    const from = String(raw?.from ?? raw?.source ?? raw?.a ?? '');
    const to = String(raw?.to ?? raw?.target ?? raw?.b ?? '');
    if (!from || !to || from === to) continue;
    const overlay = asObject(states[String(raw?.id ?? `edge.${from}.${to}`)]);
    const label = String(overlay.relationshipType || raw?.relationshipType || 'neutral');
    if (!index.has(`${from}|${to}`)) index.set(`${from}|${to}`, label);
    if (!index.has(`${to}|${from}`)) index.set(`${to}|${from}`, label);
  }
  return index;
}

/** settlementId to its PUBLIC dominant-faith name, or null when it has none. */
function declaredFaithIndex(saves) {
  const index = new Map();
  for (const save of Array.isArray(saves) ? saves : []) {
    const id = String(save?.id ?? save?.saveId ?? '');
    if (!id) continue;
    const name = (save?.settlement || save)?.config?.primaryDeitySnapshot?.name;
    index.set(id, typeof name === 'string' && name ? name : null);
  }
  return index;
}

/**
 * The compact belief-versus-ground-truth distance for ONE observed year.
 *
 * divergence01 is the mean of the COMPARABLE axis mismatch rates, so an axis with
 * no comparable pairs lowers no average and is named in `axes` instead. It is null
 * when nothing was comparable at all: a dormant or omniscient realm reports an
 * honest instrument gap here, never a flattering zero.
 */
export function observeBeliefDivergence({ result, afterSaves }) {
  const worldState = asObject(result?.worldState);
  const maps = asObject(asObject(worldState.spatialLedgers).beliefMaps);
  const rules = asObject(worldState.simulationRules);
  const tick = finite(worldState.tick ?? result?.tick);
  const relationships = declaredRelationshipIndex(result);
  const faiths = declaredFaithIndex(afterSaves);

  let observers = 0;
  let slots = 0;
  let records = 0;
  let confidenceTotal = 0;
  let stalenessTotal = 0;
  let stalenessMax = 0;
  let relationshipComparable = 0;
  let relationshipMismatched = 0;
  let faithComparable = 0;
  let faithMismatched = 0;

  for (const observerId of Object.keys(maps).sort()) {
    if (observerId === BELIEF_SEED_SENTINEL) continue;
    const byFaction = asObject(maps[observerId]);
    let observerCounted = false;
    for (const factionKey of Object.keys(byFaction).sort()) {
      const bySubject = asObject(byFaction[factionKey]);
      let slotCounted = false;
      for (const subjectId of Object.keys(bySubject).sort()) {
        const record = asObject(bySubject[subjectId]);
        if (Object.keys(record).length === 0) continue;
        records += 1;
        if (!observerCounted) { observers += 1; observerCounted = true; }
        if (!slotCounted) { slots += 1; slotCounted = true; }
        confidenceTotal += Math.min(1, Math.max(0, finite(record.confidence01)));
        const staleness = Math.max(0, tick - finite(record.lastUpdateTick));
        stalenessTotal += staleness;
        stalenessMax = Math.max(stalenessMax, staleness);

        const trueLabel = relationships.get(`${observerId}|${subjectId}`);
        const believedLabel = record.allianceLabel;
        if (trueLabel != null && typeof believedLabel === 'string' && believedLabel) {
          relationshipComparable += 1;
          if (believedLabel !== trueLabel) relationshipMismatched += 1;
        }

        if (faiths.has(subjectId) && 'faithLabel' in record) {
          faithComparable += 1;
          const trueFaith = faiths.get(subjectId);
          const believedFaith = typeof record.faithLabel === 'string' ? record.faithLabel : null;
          if (String(believedFaith ?? '') !== String(trueFaith ?? '')) faithMismatched += 1;
        }
      }
    }
  }

  const axes = [];
  const rates = [];
  if (relationshipComparable > 0) {
    axes.push('relationship');
    rates.push(relationshipMismatched / relationshipComparable);
  }
  if (faithComparable > 0) {
    axes.push('faith');
    rates.push(faithMismatched / faithComparable);
  }

  return {
    // The two halves of the belief engine's activation gate, recorded so a reader
    // can separate a QUIET knowledge lane from a DORMANT one without re-running.
    infoMode: typeof rules.infoMode === 'string' ? rules.infoMode : null,
    spatialCanonized: Number.isInteger(worldState.spatialCanonVersion)
      && Number(worldState.spatialCanonVersion) > 0,
    observers,
    slots,
    records,
    meanConfidence01: records > 0 ? round4(confidenceTotal / records) : null,
    meanStalenessTicks: records > 0 ? round4(stalenessTotal / records) : null,
    maxStalenessTicks: records > 0 ? stalenessMax : null,
    relationshipComparable,
    relationshipMismatched,
    faithComparable,
    faithMismatched,
    axes,
    divergence01: rates.length
      ? round4(rates.reduce((total, rate) => total + rate, 0) / rates.length)
      : null,
  };
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
    .filter((record) => record && typeof record === 'object' && isPublicOutcome(record));
  const mechanicalRecords = (Array.isArray(result?.autoApplied) ? result.autoApplied : [])
    .filter((record) => record && typeof record === 'object' && isStateOnlyOutcome(record));
  const mechanicalIds = new Set(mechanicalRecords
    .map((record) => record?.id)
    .filter((id) => id != null)
    .map(String));
  for (const pulse of Array.isArray(result?.worldState?.pulseHistory)
    ? result.worldState.pulseHistory
    : []) {
    for (const field of ['consequenceOutcomes', 'mechanicalOutcomes']) {
      for (const record of Array.isArray(pulse?.[field]) ? pulse[field] : []) {
        if (isStateOnlyOutcome(record) && record?.id != null) {
          mechanicalIds.add(String(record.id));
        }
      }
    }
  }
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
  const causal = causalObservationOf(result, records, recordFamilyById, mechanicalIds);

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

  // REALM SELF-SUFFICIENCY (W-J slice J2; DESIGN_ROUTE_LIFECYCLE.md §5, §13). ADDITIVE
  // and CONDITIONAL, on the exact terms the beliefDivergence field established below.
  // It is null on a world whose routeLifecycleEnabled is absent, and a null drops the
  // key entirely rather than recording a zero: every completed soak on disk is a dark
  // run, and a 0 in a self-sufficiency column would read as a realm that cannot feed
  // itself rather than as an instrument that was never switched on. Absence is the
  // honest reading of a dormant subsystem, and it is the reading the certification
  // row's gated-emission invariant checks for.
  const realmSelfSufficiency = observeRealmSelfSufficiency({
    worldState: result?.worldState,
    saves: afterSaves,
  });

  // REALM DEMOGRAPHY (wave P4; DESIGN_DEMOGRAPHIC_ENGINE.md §6). ADDITIVE and
  // CONDITIONAL on exactly the terms realmSelfSufficiency established above, and it is
  // THE INSTRUMENT the demographicsEnabled certification row was waiting for. The
  // per-settlement demographic_step receipts are dropped at applyPulseMover (that seam
  // forwards newsEntries and nothing else), so the realm reading is re-derived here from
  // the SAME pure reads the kernel used: Sigma pop against Sigma K_food, which of the two
  // bounds is the wall for how many settlements, and the §7b viability census. Null on a
  // dark world, and a null drops the key rather than recording a zero, because a
  // realmPressure of 0 would read as a realm with infinite slack instead of as an
  // instrument that was never switched on.
  const realmDemography = observeRealmDemography({
    worldState: result?.worldState,
    saves: afterSaves,
  });

  return {
    year,
    eventCount: records.length,
    majorEventCount: major.count,
    mechanicalOutcomeCount: mechanicalRecords.length,
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
    // SP-6 narration evidence. The callback supplies the uncapped, freshly-authored
    // Wizard News rows for this year, including routine and covert records; the pure
    // instrument groups them by settlement and season. Empty means the lane emitted
    // no measurable prose, never an invented zero from the capped terminal feed.
    phraseRepetition: measurePhraseRepetition(
      Array.isArray(rawWizardNewsEntries) ? rawWizardNewsEntries : [],
    ),
    // ADDITIVE, and deliberately NOT a BEHAVIORAL_OBSERVATION_VERSION bump: it
    // changes the meaning of no existing field, and bumping would blind the
    // behavioral oracle to every soak receipt already on disk (the same reasoning
    // recorded for the v5 envelope in behavioralContract.js). A v4 receipt simply
    // lacks this key, which consumers must read as an instrument gap.
    beliefDivergence: observeBeliefDivergence({ result, afterSaves }),
    ...(realmSelfSufficiency ? { realmSelfSufficiency } : {}),
    ...(realmDemography ? { realmDemography } : {}),
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

/**
 * Census ONE year's worldState containers, so a subsystem whose only observable
 * output is a sidecar ledger can still be graded. Deliberately TOTAL over the
 * top-level keys plus one level into spatialLedgers (where the wave and one-regen
 * sidecars live): totality is what lets a certification read a key's ABSENCE as
 * evidence rather than as a gap. A scalar marker counts as one entry so a
 * presence flag is observable; a null or undefined value is not recorded at all.
 */
export function censusWorldStateKeys(worldState) {
  const state = asObject(worldState);
  const entriesOfValue = (value) => {
    if (Array.isArray(value)) return value.length;
    if (value && typeof value === 'object') return Object.keys(value).length;
    return value == null ? null : 1;
  };
  const census = {};
  for (const key of Object.keys(state).sort()) {
    const count = entriesOfValue(state[key]);
    if (count == null) continue;
    census[key] = count;
    if (key !== 'spatialLedgers') continue;
    const ledgers = asObject(state[key]);
    for (const sub of Object.keys(ledgers).sort()) {
      const subCount = entriesOfValue(ledgers[sub]);
      if (subCount != null) census[`${key}.${sub}`] = subCount;
    }
  }
  return census;
}

/**
 * Fold per-year censuses into the receipt shape: how many observed years carried
 * the key at all, the largest population it ever reached, and where it ended.
 * maxEntries is the aliveness signal, because a ledger that filled and drained
 * still proves its subsystem ran.
 */
export function foldStateKeyCensus(yearlyCensuses) {
  const folded = {};
  for (const census of Array.isArray(yearlyCensuses) ? yearlyCensuses : []) {
    for (const [key, count] of Object.entries(asObject(census))) {
      const row = folded[key] || { years: 0, maxEntries: 0, finalEntries: 0 };
      row.years += 1;
      row.maxEntries = Math.max(row.maxEntries, finite(count));
      row.finalEntries = finite(count);
      folded[key] = row;
    }
  }
  return Object.fromEntries(Object.keys(folded).sort().map((key) => [key, folded[key]]));
}

/**
 * The receipt's `subsystems` section (envelope schema v5). It records WHICH
 * subsystem switches the run actually carried and WHICH worldState containers it
 * ever populated, so evaluateSubsystemCertification can separate "off by config"
 * from "on and silent" without inferring either.
 */
export function buildSubsystemConfiguration({
  presetId,
  rules,
  yearlyCensuses,
}) {
  const booleanRules = {};
  for (const key of Object.keys(asObject(rules)).sort()) {
    if (typeof asObject(rules)[key] === 'boolean') booleanRules[key] = asObject(rules)[key];
  }
  const stateKeys = foldStateKeyCensus(yearlyCensuses);
  return {
    schemaVersion: SOAK_RECEIPT_SCHEMA_VERSION,
    kind: 'soak_subsystem_configuration',
    presetId: presetId == null ? null : String(presetId),
    observedYears: Array.isArray(yearlyCensuses) ? yearlyCensuses.length : 0,
    ruleKeysRecorded: Object.keys(booleanRules).length,
    rules: booleanRules,
    // The census enumerated every worldState container at every observed year, so
    // a key absent from stateKeys was never present. Certification may therefore
    // read absence as zero evidence instead of as an instrument gap.
    stateKeysComplete: true,
    stateKeys,
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
