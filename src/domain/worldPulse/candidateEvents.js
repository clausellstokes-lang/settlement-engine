import { evaluateFactionRules } from './factionCompetition.js';
import { evaluateNpcRules } from './npcAgency.js';
import { evaluateRelationshipRules } from './relationshipEvolution.js';
import { evaluateSettlementStrategyRules } from './settlementStrategy.js';
import { evaluateMobilizationReactions } from './mobilizationReactions.js';
import { evaluateStressorRules, stressorCandidateForPressure } from './stressors.js';
import { deriveFlowCandidates } from './flows.js';
import { normalizeSimulationRules, politicalAutonomyOf } from './simulationRules.js';
import { governBirth, computeLowestPendingClass, dramaClassOf } from './narrativeTempo.js';
import { authorityFor } from './changeAuthorityPolicy.js';
import { classifyRecurringConditionCandidate } from './conditionRefreshRecordMode.js';
import {
  admitGuaranteedProposalOutcomes,
  buildProposalDocket,
  PROPOSAL_DOCKET_POLICY,
  proposalDocketAllows,
  recordProposalAdmission,
} from './proposalAdmission.js';
import { isMajorOutcome } from './decisionTier.js';
import { activeChannelsFrom } from '../region/index.js';
import { RUMOR_TRADE_CHANNEL_TYPES } from '../spatial/rumorNetwork.js';
import {
  isStateOnlyOutcome,
  isSuppressionOnlyOutcome,
  proposalRequiresRecordModeSupersession,
} from './pulseHelpers.js';

export { admitGuaranteedProposalOutcomes, buildProposalDocket };

function stablePart(/** @type {any} */ value) {
  return String(value || 'unknown').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

/**
 * World volatility scales every candidate's roll probability. `normal` is 1.0
 * (a no-op, so default behavior — and the determinism fixtures — are
 * unchanged); `calm` dampens the world, `turbulent` makes events more likely.
 * A DM-facing dial set on campaign.worldState.volatility.
 */
export const VOLATILITY_MULTIPLIERS = Object.freeze({
  calm: 0.6,
  normal: 1.0,
  turbulent: 1.6,
});

export function volatilityMultiplier(/** @type {any} */ volatility) {
  return VOLATILITY_MULTIPLIERS[/** @type {keyof typeof VOLATILITY_MULTIPLIERS} */ (volatility)] ?? 1.0;
}

// A proposal id contains its emission tick, so it cannot answer whether the same
// unresolved question is already on the DM's desk. These are the stable semantic
// fields shared by generated candidates and the cloned outcomes stored in
// worldState.proposals. Volatile quantities (tick, severity, probability, prose,
// pressure bands) are intentionally absent.
const PROPOSAL_IDENTITY_FIELDS = new Set([
  'targetSaveId', 'sourceSaveId', 'actorSaveId', 'subjectSaveId',
  'settlementId', 'saveId', 'targetId', 'sourceId', 'actorId', 'subjectId',
  'relationshipKey', 'courseKey',
  'npcId', 'rivalNpcId', 'factionId', 'rivalFactionId',
  'institutionId', 'institutionName',
  'fromSaveId', 'toSaveId', 'from', 'to',
  'besieger', 'besieged', 'navyId', 'patronId', 'rivalRef',
]);
const PROPOSAL_INTENT_FIELDS = new Set([
  'kind', 'verb', 'action', 'actionFamily', 'resource',
  'fromType', 'toType', 'proposedRelationshipType',
  'fromTier', 'toTier', 'direction', 'governmentPreference',
  'populationKind', 'flowKind', 'strategyMove', 'toPowerName', 'winner',
]);
const PROPOSAL_NAMED_IDENTITY_PARENTS = new Set([
  'institutionPatch', 'lifecyclePatch', 'proposalPayload',
]);

/** @param {unknown} value @returns {Record<string, unknown>|null} */
function proposalRecord(value) {
  return value != null && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : null;
}

/** @param {unknown} value @returns {string|null} */
function proposalScalar(value) {
  if (typeof value === 'string') return value.length ? value : null;
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  return null;
}

/**
 * Collect only identity/intent scalars, recursively, in codepoint path order.
 * `id` itself is never collected: generated ids are tick-bearing by design.
 * @param {unknown} value
 * @param {string[]} path
 * @param {Array<[string, string]>} parts
 * @returns {number} number of identity anchors found
 */
function collectProposalSemantics(value, path, parts) {
  if (Array.isArray(value)) {
    return value.reduce(
      (count, entry, index) => count + collectProposalSemantics(entry, [...path, String(index)], parts),
      0,
    );
  }
  const record = proposalRecord(value);
  if (!record) return 0;
  let anchors = 0;
  for (const key of Object.keys(record).sort()) {
    if (key === 'id' || key === 'candidateType' || key === 'conflictTags') continue;
    const child = record[key];
    const scalar = proposalScalar(child);
    const parent = path[path.length - 1] || '';
    const namedIdentity = key === 'name' && PROPOSAL_NAMED_IDENTITY_PARENTS.has(parent);
    if (scalar != null && (PROPOSAL_IDENTITY_FIELDS.has(key) || PROPOSAL_INTENT_FIELDS.has(key) || namedIdentity)) {
      parts.push([[...path, key].join('.'), scalar]);
      if (PROPOSAL_IDENTITY_FIELDS.has(key) || namedIdentity) anchors += 1;
      continue;
    }
    if (scalar == null) anchors += collectProposalSemantics(child, [...path, key], parts);
  }
  return anchors;
}

/**
 * Stable identity for the QUESTION a proposal asks, not for one tick's emission.
 * Unknown/unanchored shapes return null, so the guard can never collapse a whole
 * candidate family merely because its candidateType happens to match.
 * @param {unknown} outcome
 * @returns {string|null}
 */
export function proposalSemanticKey(outcome) {
  const record = proposalRecord(outcome);
  const candidateType = proposalScalar(record?.candidateType);
  if (!record || !candidateType) return null;
  /** @type {Array<[string, string]>} */
  const parts = [];
  let anchors = collectProposalSemantics(record, [], parts);
  const tags = Array.isArray(record.conflictTags)
    ? [...new Set(record.conflictTags.map(proposalScalar).filter((tag) => tag != null))].sort()
    : [];
  if (tags.length) {
    parts.push(['conflictTags', tags.join('\u001f')]);
    anchors += tags.length;
  }
  if (!anchors) return null;
  return JSON.stringify([candidateType, parts]);
}

/**
 * The generic pending-proposal HOLD guard. Mirrors pendingTierProposals,
 * pendingLifecycle, and pendingActorMajorFor at the shared candidate seam:
 * an equivalent unresolved proposal suppresses only that semantic candidate.
 * Filtering preserves input order and returns the original array reference when
 * no candidate is suppressed. Resolved/dismissed/expired proposals do not hold.
 * @param {unknown[]} candidates
 * @param {unknown} worldState
 * @returns {unknown[]}
 */
export function suppressEquivalentPendingProposalCandidates(candidates, worldState) {
  if (!Array.isArray(candidates) || candidates.length === 0) return candidates;
  const proposals = proposalRecord(worldState)?.proposals;
  if (!Array.isArray(proposals) || proposals.length === 0) return candidates;
  const pendingKeys = new Set();
  for (const raw of proposals) {
    const proposal = proposalRecord(raw);
    if (proposal?.status !== 'pending') continue;
    if (proposalRequiresRecordModeSupersession(proposal)) continue;
    const key = proposalSemanticKey(proposal.outcome);
    if (key) pendingKeys.add(key);
  }
  if (!pendingKeys.size) return candidates;
  let suppressed = false;
  const next = candidates.filter(candidate => {
    // Upgrade safety: pre-v4 saves may hold proposal copies of outcomes that are
    // mechanical/suppressive under v4. Those old questions must not starve a
    // required state refresh or remove a conflict suppressor before arbitration.
    if (isStateOnlyOutcome(candidate) || isSuppressionOnlyOutcome(candidate)) return true;
    const key = proposalSemanticKey(candidate);
    const held = key != null && pendingKeys.has(key);
    if (held) suppressed = true;
    return !held;
  });
  return suppressed ? next : candidates;
}

/**
 * Upgrade reconciliation for proposal rows created before recordMode v4.
 * The only ambiguous authority-routed family was npc_goal_rebranch; hold and
 * defend are unconditionally suppressive. Close those known legacy rows even
 * when no equivalent candidate emits this tick. Retain each as an audit
 * tombstone; only status metadata changes.
 * @template T
 * @param {T} worldState
 * @param {{ tick?: number, now?: string|null }} [context]
 * @returns {T}
 */
export function supersedeLegacyRecordModeProposals(worldState, context = {}) {
  const state = proposalRecord(worldState);
  const proposals = state?.proposals;
  if (!Array.isArray(proposals) || proposals.length === 0) return worldState;
  let changed = false;
  const nextProposals = proposals.map((raw) => {
    const proposal = proposalRecord(raw);
    if (proposal?.status !== 'pending'
        || !proposalRequiresRecordModeSupersession(proposal)) return raw;
    changed = true;
    return {
      ...proposal,
      status: 'superseded',
      updatedAt: context.now ?? proposal.updatedAt ?? proposal.createdAt ?? null,
      supersededAt: context.now ?? null,
      supersededAtTick: Number.isFinite(context.tick) ? context.tick : null,
      supersessionReason: 'record_mode_upgrade',
    };
  });
  return changed
    ? /** @type {T} */ (/** @type {unknown} */ ({ ...state, proposals: nextProposals }))
    : worldState;
}

function pressureConditionCandidate(/** @type {any} */ pressure, /** @type {any} */ tick, /** @type {Record<string, unknown> | null} */ rules = null) {
  if (!pressure || pressure.score < 0.5) return null;
  const archetypeByKind = {
    food: 'famine',
    disease: 'plague',
    conflict: 'war_pressure',
    trade: 'regional_route_disruption',
    legitimacy: 'faction_challenge',
    crime: 'regional_criminal_pressure',
  };
  const labelByKind = {
    food: 'Famine pressure',
    disease: 'Disease outbreak',
    conflict: 'Wartime pressure',
    trade: 'Trade route strain',
    legitimacy: 'Legitimacy challenge',
    crime: 'Criminal pressure',
  };
  const archetype = archetypeByKind[/** @type {keyof typeof archetypeByKind} */ (pressure.kind)];
  if (!archetype) return null;
  return {
    id: `candidate.condition.${stablePart(pressure.kind)}.${stablePart(pressure.settlementId)}.${tick}`,
    type: 'condition',
    candidateType: `${pressure.kind}_pressure`,
    ruleId: `organic_settlement_${pressure.kind}_pressure`,
    ruleFamily: 'organic_drift',
    targetSaveId: pressure.settlementId,
    severity: pressure.score,
    probability: Math.min(0.42, 0.06 + pressure.score * 0.3),
    // pressure_event is one of the four severity-gated ROGUE families: its
    // severity-only escalation (never the majorChangesRequireProposal flag) IS
    // its legacy default, encoded verbatim as the legacyMode argument —
    // authorityFor passes it through untouched under routine/full and forces
    // 'proposal' only under the new dm_only/recommendations autonomy modes.
    applyMode: authorityFor(rules, 'pressure_event', pressure.score >= 0.72 ? 'proposal' : 'auto'),
    headline: `${labelByKind[/** @type {keyof typeof labelByKind} */ (pressure.kind)]} may take hold`,
    // SEASONS-A: pressureModel stamps a seasonNote on flag-on winter food
    // pressures ("stores run low…"); its presence IS the gate — absent
    // flag-off, so the legacy summary bytes are untouched.
    summary: `${pressure.settlementName} shows enough ${pressure.label.toLowerCase()} for a new condition to emerge.${pressure.seasonNote ? ` ${pressure.seasonNote}` : ''}`,
    reasons: [
      ...pressure.reasons,
      'Organic settlement drift is conservative: pressure must pass a gate before it can roll.',
    ],
    condition: {
      archetype,
      label: labelByKind[/** @type {keyof typeof labelByKind} */ (pressure.kind)],
      description: `${labelByKind[/** @type {keyof typeof labelByKind} */ (pressure.kind)]} emerged from accumulated campaign pressure.`,
      severity: pressure.score,
      status: pressure.score >= 0.7 ? 'worsening' : 'stable',
      duration: { elapsedTicks: 0, expiresAtTicks: pressure.score >= 0.75 ? 10 : 6 },
      triggeredAt: { tick, sourceEventType: 'WORLD_PULSE_PRESSURE', sourceEventTargetId: pressure.settlementId },
      // affectedSystems intentionally OMITTED: deriveActiveCondition falls back to the
      // per-archetype catalog template (famine -> food_security + labor_capacity, plague ->
      // healing_capacity, crime -> criminal_opportunity, ...). A hard-coded
      // ['public_legitimacy','trade_connectivity'] here used to override that for EVERY
      // pressure kind, so an emergent famine never lowered food_security and the loop's
      // organic feedback misrouted — the single most damaging wiring bug in the audit.
      causes: pressure.reasons.map((/** @type {any} */ reason) => ({ source: 'world_pulse', effect: pressure.kind, reason })),
    },
    metadata: {
      pressureKind: pressure.kind,
      pressureScore: pressure.score,
    },
    conflictTags: [`settlement:${pressure.settlementId}:organic:${pressure.kind}`],
  };
}

function candidateIdentity(/** @type {any} */ candidate) {
  return [
    candidate.type,
    candidate.candidateType,
    candidate.targetSaveId || candidate.relationshipKey || candidate.factionId || candidate.npcId || candidate.id,
  ].join(':');
}

// Stable identity for ordering and rng forks. Candidate ids embed settlement /
// relationship / faction ids and the tick — never the candidate's POSITION in
// the saves array — so sorting and rolling by this key is order-independent.
function stableCandidateKey(/** @type {any} */ candidate) {
  return String(candidate.id || candidateIdentity(candidate));
}

function compareStableKeys(/** @type {any} */ a, /** @type {any} */ b) {
  const keyA = stableCandidateKey(a);
  const keyB = stableCandidateKey(b);
  return keyA < keyB ? -1 : keyA > keyB ? 1 : 0;
}

function exclusiveTags(/** @type {any} */ candidate) {
  const tags = (candidate.conflictTags || []).filter((/** @type {any} */ tag) =>
    /^label:/.test(tag)
    || /:government_change$/.test(tag)
    || /:institution:/.test(tag)
    || /:stressor_birth$/.test(tag)
    || /^stressor:[^:]+:[^:]+$/.test(tag)
    || /^population_transfer:[^:]+$/.test(tag)
    || /^npc:.+$/.test(tag)
    || /^faction:.+$/.test(tag)
    || /^strategy:[^:]+$/.test(tag)
  );
  // Strategy de-conflict: the strategy chooser emits one move per settlement under a
  // `strategy:<S>` exclusive tag. A REACTIVE war candidate (hostileRules raid /
  // occupation pressure) where S is the state-decided aggressor resolves to the
  // SAME exclusive tag here — derived from its `metadata.aggressorSaveId` — so
  // resolveCandidateConflicts admits exactly ONE for S and the strategy move (the
  // higher-severity, structurally-prioritized candidate) wins. This makes the
  // hard-override return-home suppress the reactive escalation WITHOUT touching the
  // reactive rules. Only escalation-shaped war candidates carry an aggressor; a
  // de-escalation / wind-down candidate has none, so it is never crowded out.
  const aggressorId = candidate.metadata?.aggressorSaveId;
  if (aggressorId != null && candidate.ruleFamily !== 'strategy') {
    const tag = `strategy:${String(aggressorId)}`;
    if (!tags.includes(tag)) tags.push(tag);
  }
  return tags;
}

export function resolveCandidateConflicts(/** @type {any[]} */ candidates = [], /** @type {any} */ budgets = {}) {
  const maxCandidates = budgets.maxCandidates ?? 90;
  const maxPerSettlement = budgets.maxPerSettlement ?? 14;
  const maxRelationshipLabelProposals = budgets.maxRelationshipLabelProposals ?? 4;
  const maxGovernmentChallenges = budgets.maxGovernmentChallenges ?? 2;
  const maxNpcProposals = budgets.maxNpcProposals ?? 6;

  const deduped = new Map();
  for (const candidate of candidates.filter(Boolean)) {
    const key = candidate.id || candidateIdentity(candidate);
    const previous = deduped.get(key);
    if (!previous || (candidate.severity || 0) > (previous.severity || 0)) deduped.set(key, candidate);
  }

  // Severity ties break by the candidate's stable key, never by insertion
  // order (= saves-array order): the same campaign with its saves reversed
  // must select the same winners under the per-settlement/per-kind budgets.
  const sorted = [...deduped.values()].sort((a, b) => {
    const modeA = a.applyMode === 'proposal' ? 0.02 : 0;
    const modeB = b.applyMode === 'proposal' ? 0.02 : 0;
    return ((b.severity + modeB) - (a.severity + modeA)) || compareStableKeys(a, b);
  });

  const selected = [];
  const usedTags = new Map();
  const perSettlement = new Map();
  let labelProposalCount = 0;
  let governmentChallengeCount = 0;
  let npcProposalCount = 0;

  for (const candidate of sorted) {
    if (selected.length >= maxCandidates) break;
    const settlementKey = candidate.targetSaveId || candidate.metadata?.settlementId || 'realm';
    const settlementCount = perSettlement.get(settlementKey) || 0;
    if (settlementCount >= maxPerSettlement) continue;

    if (candidate.proposalPayload?.kind === 'relationship_label_change' && labelProposalCount >= maxRelationshipLabelProposals) continue;
    if (candidate.proposalPayload?.kind === 'government_change' && governmentChallengeCount >= maxGovernmentChallenges) continue;
    if (candidate.proposalPayload?.kind === 'npc_action' && npcProposalCount >= maxNpcProposals) continue;

    const tags = exclusiveTags(candidate);
    const blocker = tags.map((/** @type {any} */ tag) => usedTags.get(tag)).find(Boolean);
    if (blocker) continue;

    selected.push({
      ...candidate,
      conflictResolution: {
        selected: true,
        exclusiveTags: tags,
      },
    });
    for (const tag of tags) usedTags.set(tag, candidate.id || candidateIdentity(candidate));
    perSettlement.set(settlementKey, settlementCount + 1);
    if (candidate.proposalPayload?.kind === 'relationship_label_change') labelProposalCount += 1;
    if (candidate.proposalPayload?.kind === 'government_change') governmentChallengeCount += 1;
    if (candidate.proposalPayload?.kind === 'npc_action') npcProposalCount += 1;
  }

  return selected.sort((a, b) => (b.severity - a.severity) || compareStableKeys(a, b));
}

/**
 * FIX #2 (M11a reconcile, no over-suppression): does the epidemic FRONT actually carry
 * disease_outbreak to this aspatial spread candidate's target? The spatial front travels
 * ONLY trade-type channels (RUMOR_TRADE_CHANNEL_TYPES) + M2 shipments — so under the marker
 * it REPLACES the aspatial TRADE-channel spread, but NOT the migration_pressure /
 * service_dependency spread it never travels. Return true (⇒ drop) only when a plague-
 * affected source reaches the target over a trade-type channel; otherwise the aspatial
 * spread is PRESERVED (on-marker reach stays ≥ aspatial reach — the refugee/service vectors
 * never silently vanish; FIX #1's dedupe keeps a both-reached node to ONE stressor). The
 * forward-directed check mirrors spreadTargetsFor's own traversal and is conservative toward
 * PRESERVE (a target reachable only via a reverse trade edge is kept, then deduped).
 * @param {import('../region/graph.js').RegionGraph} graph
 * @param {{ targetSaveId?: unknown, affectedSettlementIds?: unknown }} candidate
 * @returns {boolean}
 */
function frontCarriesDiseaseTo(graph, candidate) {
  const target = String(candidate?.targetSaveId ?? '');
  if (!target) return false;
  const affected = Array.isArray(candidate?.affectedSettlementIds) ? candidate.affectedSettlementIds : [];
  for (const src of affected) {
    const from = String(src);
    if (!from || from === target) continue;
    for (const channel of activeChannelsFrom(graph, from, { types: [...RUMOR_TRADE_CHANNEL_TYPES] })) {
      if (String(channel?.to) === target) return true;
    }
  }
  return false;
}

export function evaluateWorldPulseRules(/** @type {any} */ snapshot, /** @type {any} */ context = {}) {
  const tick = Number.isFinite(context.tick) ? context.tick : snapshot?.worldState?.tick || 0;
  const pressures = context.pressures || [];
  const pressureIndex = context.pressureIndex;
  const rules = normalizeSimulationRules(context.simulationRules || snapshot?.worldState?.simulationRules);
  const candidates = [];

  if (rules.emergentEventsEnabled) {
    candidates.push(
      ...pressures
        .map((/** @type {any} */ pressure) => pressureConditionCandidate(pressure, tick, rules))
        .filter(Boolean),
    );
  }
  if (rules.stressorsEnabled) {
    const stressorCandidates = evaluateStressorRules(snapshot, pressureIndex, { ...context, tick, pressures, simulationRules: rules });
    // M11a RECONCILE (ONE PLAGUE TRUTH, no double-count). Under the spatial-canon marker the
    // plague's TRADE-channel TRAVEL is owned by the epidemic FRONT (spatial mover M11a /
    // pestilenceKernel), which materializes this same disease_outbreak stressor hop-by-hop at
    // hopWeeks latency along trade-type channels + M2 shipments. So ONLY the aspatial spread the
    // front REPLACES is dropped here — a disease_outbreak spread candidate whose target a plague-
    // affected source reaches over a TRADE-type channel (M4's origin-loss rule: the spatial front
    // replaces the aspatial spread, never both). The migration_pressure / service_dependency spread
    // the front does NOT travel is PRESERVED (the refugee/service epidemic vectors must not vanish
    // when the marker is on — on-marker reach ≥ aspatial reach). Absent the marker (aspatial /
    // peaceful-spatial goldens carry no active disease_outbreak) the filter removes nothing ⇒
    // BYTE-IDENTICAL for goldens. NOTE (worldpulse-core-6): the equivalence is byte-identical for the
    // golden battery but NOT for DM-gating — the dropped aspatial spread would have routed to
    // 'proposal' under dm_only via the authorityFor choke point below, whereas the front materializes
    // this stressor POST-APPLY, autonomously. That upgrade of plague TRAVEL from DM-gated to autonomous
    // is BY DESIGN: nature is exempt from the political-autonomy axis. See
    // docs/design-notes/political-autonomy-boundary.md — do not "fix" it in either direction.
    // Reconciled at THIS lazy call site (candidateEvents rides the engine chunk),
    // NOT inside evaluateStressorRules, so it costs ZERO first-paint bytes (evaluateStressorRules is
    // bundled into the first-paint closure via its catalog exports — a suppression there would ship).
    // POLITICAL-AUTONOMY RULING (owner-delegated, [worldpulse-core-6]): NATURE acts
    // autonomously and is EXEMPT from the §11 political-autonomy axis. Under
    // dm_only/recommendations the dropped aspatial spread candidate WOULD have routed
    // to a proposal, while the pestilence front materializes the disease_outbreak
    // stressor directly post-apply — so canonizing a map upgrades plague travel from
    // DM-gated to autonomous. This is INTENDED: a plague is not a political actor
    // awaiting the DM's word. (It is byte-identical for goldens; it changes only the
    // DM-gating of the spread under the forcing modes.) The alternative — gating the
    // front's stressor MATERIALIZATION through the proposal queue under dm_only,
    // mirroring the M9d withhold-then-re-mint pattern — is an OWNER-NOTE item queued
    // in the shift ledger, a product-policy call left to the owner, not decided here.
    const marker = snapshot?.worldState?.spatialCanonVersion;
    const epidemicTravelActive = Number.isInteger(marker) && Number(marker) > 0;
    candidates.push(...(epidemicTravelActive
      ? stressorCandidates.filter(c => c?.candidateType !== 'stressor_spread_disease_outbreak'
          || !frontCarriesDiseaseTo(snapshot?.regionalGraph, c))
      : stressorCandidates));
  }
  if (rules.relationshipDynamicsEnabled) {
    candidates.push(...evaluateRelationshipRules(snapshot, pressureIndex, { ...context, tick, simulationRules: rules }));
  }
  // The settlement strategy chooser. GATED behind
  // settlementStrategyEnabled (default false ⇒ no candidate emitted, no rng draw ⇒
  // byte-identical). Runs ONCE per settlement (not per edge), softmax-samples one
  // move via the threaded rng (forked on `strategy:<S>:<tick>`), and emits a
  // probability-1 candidate that flows through the SAME conflict resolution + apply.
  // Its `strategy:<S>` exclusive tag de-conflicts with the reactive escalation for S.
  candidates.push(...evaluateSettlementStrategyRules(snapshot, pressureIndex, {
    ...context,
    tick,
    simulationRules: rules,
    rng: /** @type {any} */ (context).rng,
  }));
  // NEIGHBOUR REACTIONS to a visibly-mobilizing rival/target/trade-
  // dependent. GATED behind warLayerEnabled (default false ⇒ [] ⇒ byte-identical).
  // rng-FREE here (the candidate's own downstream roll is the only stochastic step);
  // reads the persisted worldState.warPosture written by the war block this tick.
  // Each reactor shares a `strategy:<reactor>` exclusive tag so a reaction and a
  // strategy move never double-fire for the same settlement.
  candidates.push(...evaluateMobilizationReactions(snapshot, pressureIndex, {
    ...context,
    tick,
    simulationRules: rules,
  }));
  if (rules.npcAgencyEnabled) {
    candidates.push(...evaluateNpcRules(snapshot, pressureIndex, { ...context, tick, simulationRules: rules }));
  }
  if (rules.factionCompetitionEnabled) {
    candidates.push(...evaluateFactionRules(snapshot, pressureIndex, { ...context, tick, simulationRules: rules }));
  }
  if (!['off', 'local'].includes(rules.propagationMode) && (rules.migrationFlowsEnabled || rules.tradeFlowsEnabled)) {
    candidates.push(...deriveFlowCandidates(snapshot, { tick, simulationRules: rules }).filter(candidate => {
      if (candidate.metadata?.flowKind === 'population') return rules.migrationFlowsEnabled;
      if (candidate.metadata?.flowKind === 'trade') return rules.tradeFlowsEnabled;
      return true;
    }));
  }

  // Chronicle curation at the last shared pre-authority seam. The classifier's
  // closed producer opt-in is deliberately narrow: organic pressure conditions
  // and condition-only trade scarcity refreshes. It fails closed on proposals,
  // migration transfers, relationship patches, and every other compound shape.
  // Run BEFORE the shared political-autonomy routing so a source-auto proven
  // refresh stays mechanical instead of becoming a new DM question. A producer
  // that already authored a proposal (pressure events do this under dm_only)
  // fails the classifier closed; genuine onsets/transitions route below.
  const recordClassified = candidates.map(candidate => (
    classifyRecurringConditionCandidate(snapshot, candidate)
  ));

  // ── Political-autonomy AUTHORITY routing (Phase 5.5 CL-0) ──────────────────
  // The choke point that routes EVERY stochastic candidate family — including
  // the modules this file composes (stressors, relationships, factions, NPCs,
  // flows, strategy, mobilization reactions) — through the per-domain authority
  // policy. Under routine/full autonomy authorityFor returns each candidate's
  // OWN applyMode verbatim, so the map below yields the IDENTICAL object
  // references and the output is byte-exact legacy. Under the new dm_only/
  // recommendations modes every candidate is forced to 'proposal' (the DM's
  // word, or a recommendation carrying the candidate's existing reasons[] as
  // its rationale). Guaranteed residual aftermaths never pass through here —
  // they are consequences, not initiations, and stay auto by design.
  const autonomy = politicalAutonomyOf(rules);
  const routed = autonomy === 'dm_only' || autonomy === 'recommendations'
    ? recordClassified.map(candidate => {
      if (!candidate) return candidate;
      // A state-only record is background reducer work, not a political choice.
      // Keep it on its source auto lane so dm_only/recommendations cannot turn a
      // required mechanical refresh into a proposal-budget casualty.
      if (isStateOnlyOutcome(candidate)) {
        return candidate.applyMode === 'auto' ? candidate : { ...candidate, applyMode: 'auto' };
      }
      const applyMode = authorityFor(rules, candidate.ruleFamily || candidate.candidateType, candidate.applyMode);
      return applyMode === candidate.applyMode ? candidate : { ...candidate, applyMode };
    })
    : recordClassified;

  return resolveCandidateConflicts(suppressEquivalentPendingProposalCandidates(routed, snapshot?.worldState), context.budgets || {});
}

export function generateWorldPulseCandidates(/** @type {any} */ { pressures = [], relationshipCandidates = [], npcCandidates = [], factionCandidates = [], tick = 0 } = {}) {
  const candidates = [];
  for (const pressure of pressures) {
    const condition = pressureConditionCandidate(pressure, tick);
    if (condition) candidates.push(condition);
    const stressor = stressorCandidateForPressure(pressure, tick);
    if (stressor) candidates.push(stressor);
  }
  candidates.push(...relationshipCandidates, ...npcCandidates, ...factionCandidates);
  return resolveCandidateConflicts(candidates);
}

// Order independence: each candidate's roll is drawn from an rng forked on the
// candidate's IDENTITY (mirroring npcAgency's `npc:${id}` and the orchestrator's
// `reform:${sid}:${tick}` forks), never from a shared stream consumed in
// iteration order — reordering the saves array can no longer reshuffle which
// candidates pass. Test stubs without fork() fall back to the shared stream
// (the constant-roll stubs in the suites are position-independent anyway).
function candidateRoll(/** @type {any} */ rng, /** @type {any} */ candidate) {
  if (typeof rng.fork !== 'function') return rng.random();
  return rng.fork(`roll:${stableCandidateKey(candidate)}`).random();
}

export function rollCandidates(/** @type {any[]} */ candidates = [], /** @type {any} */ rng, /** @type {any} */ options = {}) {
  const maxAuto = options.maxAuto ?? 6;
  const maxProposals = options.maxProposals ?? 5;
  // A suppression-only candidate is a conflict-resolution instrument, not an
  // event. Producers deliberately let it win exclusive tags in
  // resolveCandidateConflicts; this is the first seam AFTER that arbitration.
  // Remove it before tempo governance, RNG, budgets, explanations, and apply.
  const rollableCandidates = candidates.filter(candidate => !isSuppressionOnlyOutcome(candidate));
  // World volatility scales pass probability (default 1.0 = unchanged).
  const volatility = Number.isFinite(options.volatility) ? options.volatility : 1;
  const proposalDocketAtStart = options.proposalDocket || null;
  const publicProposals = rollableCandidates
    .filter(candidate => candidate.applyMode === 'proposal' && !isStateOnlyOutcome(candidate));
  // Identity forks let us detect ACTUAL passing contention without consuming a
  // shared stream: createPRNG.fork derives a child from seed + label and never
  // advances its parent. The cached child draw is the exact roll emitted below,
  // so even a candidate later deferred by tempo consumes zero parent RNG.
  // Preserve historical producer order when all passing questions fit; sort only
  // a contended proposal lane. Automatic/state-only positions and relative order
  // are never touched.
  const prefetchedProposalRolls = new Map();
  const capacityContenders = publicProposals.filter(candidate => {
    if (typeof rng.fork !== 'function') return true;
    const roll = candidateRoll(rng, candidate);
    prefetchedProposalRolls.set(candidate, roll);
    const probability = (candidate.probability ?? 0) >= 1
      ? 1
      : Math.max(0, Math.min(1, (candidate.probability ?? 0) * volatility));
    return roll <= probability;
  });
  let proposalContention = capacityContenders.length > maxProposals;
  if (!proposalContention && proposalDocketAtStart) {
    let probe = proposalDocketAtStart;
    for (const candidate of capacityContenders) {
      if (!proposalDocketAllows(probe, candidate)) { proposalContention = true; break; }
      probe = recordProposalAdmission(probe, candidate);
    }
  }
  const orderedProposals = proposalContention
    ? [...publicProposals].sort(compareStableKeys)
    : publicProposals;
  let orderedProposalIndex = 0;
  const admissionOrderedCandidates = rollableCandidates.map(candidate => (
    candidate.applyMode === 'proposal' && !isStateOnlyOutcome(candidate)
      ? orderedProposals[orderedProposalIndex++]
      : candidate
  ));
  const selected = [];
  const rollExplanations = [];
  // E0 NARRATIVE TEMPO GOVERNOR seam (design §2 — the ONE seam). `options.tempo` is
  // the pre-tick tempo context (buildTempoContext). ABSENT / `active:false` ⇒ DORMANT
  // ⇒ every governor branch below is skipped ⇒ this roll is BYTE-IDENTICAL to today.
  const tempo = options.tempo;
  /** @type {import('./narrativeTempo.js').TempoDeferral[]} */
  const deferred = [];
  // The lowest-priority pending spontaneous class (for the simultaneity tiebreak) —
  // a pure, codepoint-deterministic function of THIS roll's candidate list, computed
  // once. Only needed when the governor is active.
  const lowestPendingClass = tempo?.active
    ? computeLowestPendingClass(rollableCandidates.filter(candidate => !isStateOnlyOutcome(candidate)))
    : null;
  // The persisted ledger is pre-tick. Overlay only births that actually pass
  // their roll in this call so classMax remains a hard in-window ceiling even
  // when several same-class candidates compete in one tick.
  const landedClassCounts = new Map();
  let proposalDocket = proposalDocketAtStart;
  // If at least one admissible major question is waiting in this roll, routine
  // questions may not consume its explicit per-tick reserve. No major pending
  // means no artificial vacancy; all of maxProposals remains available.
  const majorProposalPending = proposalDocket && maxProposals > 0
    ? capacityContenders.some(candidate => (
        isMajorOutcome(candidate)
        && proposalDocketAllows(proposalDocket, candidate)
      ))
    : false;
  const majorProposalReserve = majorProposalPending
    ? Math.min(PROPOSAL_DOCKET_POLICY.majorProposalSlotsPerTick, maxProposals)
    : 0;
  let autoCount = 0;
  let proposalCount = 0;
  let minorProposalCount = 0;

  for (const rawCandidate of admissionOrderedCandidates) {
    // Defensive twin of the authority-routing exemption above: every caller of
    // rollCandidates gets the same invariant, and an exhausted proposal budget
    // can never starve a state-only reducer refresh.
    const candidate = isStateOnlyOutcome(rawCandidate) && rawCandidate.applyMode !== 'auto'
      ? { ...rawCandidate, applyMode: 'auto' }
      : rawCandidate;
    const stateOnly = isStateOnlyOutcome(candidate);
    const majorProposal = candidate.applyMode === 'proposal' && isMajorOutcome(candidate);
    // Probability-1 candidates are GUARANTEED consequences (e.g. the residual
    // aftermath a resolved stressor leaves behind), not stochastic events.
    // They neither consume nor respect the auto budget (a mass-resolution
    // tick must not silently drop aftermaths), and volatility never scales
    // them — volatility scales uncertainty, not certainties.
    const guaranteed = (candidate.probability ?? 0) >= 1;
    if (!stateOnly && candidate.applyMode === 'auto' && autoCount >= maxAuto && !guaranteed) continue;
    if (candidate.applyMode === 'proposal' && proposalCount >= maxProposals) continue;
    if (candidate.applyMode === 'proposal'
        && !majorProposal
        && minorProposalCount >= maxProposals - majorProposalReserve) continue;
    if (candidate.applyMode === 'proposal'
        && proposalDocket
        && !proposalDocketAllows(proposalDocket, candidate)) continue;
    // TEMPO GOVERNOR (spontaneity throttle). A pure ledger + codepoint decision (ZERO
    // rng), taken BEFORE the roll — a deferral `continue`s here, consuming NO rng and
    // NO auto budget, and emits NO rollExplanation row. Only SPONTANEOUS class births
    // are eligible; receipted consequences (isChainedConsequence) always pass. Dormant
    // ⇒ tempo?.active is false ⇒ this whole block is skipped ⇒ byte-identical.
    let governedClass = null;
    if (tempo?.active && !stateOnly) {
      const candidateClass = dramaClassOf(candidate);
      const landed = candidateClass ? landedClassCounts.get(candidateClass) || 0 : 0;
      const governorSnapshot = candidateClass && landed > 0
        ? {
            ...tempo.snapshot,
            classCounts: {
              ...tempo.snapshot.classCounts,
              [candidateClass]: (tempo.snapshot.classCounts[candidateClass] || 0) + landed,
            },
          }
        : tempo.snapshot;
      const gov = governBirth({
        candidate,
        snapshot: governorSnapshot,
        config: { active: true, budgets: tempo.budgets, lowestPendingClass },
      });
      if (gov.defer) {
        deferred.push({
          class: gov.class,
          settlementId: candidate.targetSaveId != null ? String(candidate.targetSaveId) : null,
          reason: gov.reason,
        });
        continue;
      }
      governedClass = gov.class;
    }
    const roll = prefetchedProposalRolls.has(candidate)
      ? prefetchedProposalRolls.get(candidate)
      : candidateRoll(rng, candidate);
    const probability = guaranteed
      ? 1
      : Math.max(0, Math.min(1, (candidate.probability ?? 0) * volatility));
    const passed = roll <= probability;
    const explanation = {
      candidateId: candidate.id,
      candidateType: candidate.candidateType,
      ruleId: candidate.ruleId || null,
      ruleFamily: candidate.ruleFamily || null,
      targetSaveId: candidate.targetSaveId || null,
      relationshipKey: candidate.relationshipKey || null,
      npcId: candidate.npcId || null,
      factionId: candidate.factionId || null,
      severity: candidate.severity,
      probability,
      roll,
      passed,
      gates: candidate.reasons || [],
      applyMode: candidate.applyMode,
      ...(candidate.recordMode ? { recordMode: candidate.recordMode } : {}),
      proposalPayload: candidate.proposalPayload || null,
      conflictResolution: candidate.conflictResolution || null,
    };
    rollExplanations.push(explanation);
    if (!passed) continue;
    selected.push({ ...candidate, roll });
    if (governedClass) {
      landedClassCounts.set(governedClass, (landedClassCounts.get(governedClass) || 0) + 1);
    }
    if (candidate.applyMode === 'proposal') {
      proposalCount += 1;
      if (!majorProposal) minorProposalCount += 1;
      if (proposalDocket) {
        proposalDocket = recordProposalAdmission(proposalDocket, candidate);
      }
    } else if (!guaranteed && !stateOnly) autoCount += 1;
  }

  // `deferred` defaults to [] — byte-neutral when the governor is dormant.
  return {
    selected,
    rollExplanations,
    deferred,
    ...(options.proposalDocket ? { proposalDocket } : {}),
  };
}
