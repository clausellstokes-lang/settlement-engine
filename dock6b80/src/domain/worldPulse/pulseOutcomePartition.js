import { deriveDecisionTier } from './decisionTier.js';
import { passesSignificanceGate } from '../spatial/rumorNetwork.js';
import {
  compactOutcomeForHistory,
  isPublicOutcome,
  isStateOnlyOutcome,
  isSuppressionOnlyOutcome,
  MAX_MECHANICAL_OUTCOMES_PER_PULSE,
  MAX_MECHANICAL_RUMOR_SEEDS_PER_PULSE,
} from './pulseHelpers.js';

/** @typedef {import('./pulseShapes.js').PulseOutcome} PulseOutcome */
/** @typedef {{ autoApplied?: PulseOutcome[], rumorSeedEntries?: PulseOutcome[] }} AppliedPulseResults */
/** @typedef {PulseOutcome & { passed?: boolean }} RollExplanation */

/**
 * Pure final partition for deterministic/stochastic, public/mechanical, and
 * pause/dismissal lanes. Keeping these sets together makes it harder for a new
 * record mode to drift between apply, consequence, and Chronicle surfaces.
 * @param {{ coupOutcomes?: PulseOutcome[], warOutcomes?: PulseOutcome[],
 *   structuralCandidates?: PulseOutcome[], selected?: PulseOutcome[], deferMajors?: boolean,
 *   activeDismissals?: ReadonlySet<string>|null }} [args]
 */
export function partitionPulseOutcomeLanes({
  coupOutcomes = [],
  warOutcomes = [],
  structuralCandidates = [],
  selected = [],
  deferMajors = false,
  activeDismissals = null,
} = {}) {
  const deterministicOutcomes = [
    ...coupOutcomes,
    ...warOutcomes,
    ...structuralCandidates,
  ].filter(outcome => !isSuppressionOnlyOutcome(outcome));
  const deterministicExplanations = deterministicOutcomes.map(candidate => ({
    candidateId: candidate.id,
    candidateType: candidate.candidateType,
    ruleId: candidate.ruleId || null,
    ruleFamily: candidate.ruleFamily || null,
    targetSaveId: candidate.targetSaveId || null,
    relationshipKey: candidate.relationshipKey || null,
    npcId: candidate.npcId || null,
    factionId: candidate.factionId || null,
    severity: candidate.severity,
    probability: 1,
    roll: 0,
    passed: true,
    gates: candidate.reasons || [],
    applyMode: candidate.applyMode,
    ...(candidate.recordMode ? { recordMode: candidate.recordMode } : {}),
    proposalPayload: candidate.proposalPayload || null,
    conflictResolution: { selected: true, deterministic: true },
  }));
  const selectedForApply = [...deterministicOutcomes, ...selected];
  const publicSelectedOutcomes = selectedForApply.filter(isPublicOutcome);
  const dismissedMajor = (/** @type {PulseOutcome} */ outcome) => (
    isPublicOutcome(outcome)
    && deriveDecisionTier(outcome) === 'major'
    && activeDismissals?.has(String(outcome.id))
  );
  const deferredMajors = deferMajors
    ? publicSelectedOutcomes.filter(outcome => deriveDecisionTier(outcome) === 'major')
    : [];
  const outcomesToApply = deferMajors
    ? selectedForApply.filter(outcome => (
        !isPublicOutcome(outcome) || deriveDecisionTier(outcome) !== 'major'
      ))
    : (activeDismissals ? selectedForApply.filter(outcome => !dismissedMajor(outcome)) : selectedForApply);
  const selectedForConsequences = activeDismissals
    ? selectedForApply.filter(outcome => !dismissedMajor(outcome))
    : selectedForApply;
  return {
    deterministicOutcomes,
    deterministicExplanations,
    selectedForApply,
    publicSelectedOutcomes,
    deferredMajors,
    outcomesToApply,
    selectedForConsequences,
    publicSelectedForConsequences: selectedForConsequences.filter(isPublicOutcome),
  };
}

/** @param {PulseOutcome[]} [entries] */
export function boundedMechanicalRumorSeeds(entries = []) {
  return entries
    .map((entry, index) => ({ entry, index }))
    .sort((a, b) => Number(passesSignificanceGate(b.entry)) - Number(passesSignificanceGate(a.entry))
      || Number(b.entry?.score || 0) - Number(a.entry?.score || 0)
      || a.index - b.index)
    .slice(0, MAX_MECHANICAL_RUMOR_SEEDS_PER_PULSE)
    .sort((a, b) => a.index - b.index)
    .map(item => item.entry);
}

/** @param {PulseOutcome[]} [candidates] @param {RollExplanation[]} [rollExplanations] */
export function publicPulseSurfaces(candidates = [], rollExplanations = []) {
  const diagnosticCandidates = candidates.filter(outcome => !isSuppressionOnlyOutcome(outcome));
  return {
    candidates: diagnosticCandidates,
    candidateCount: diagnosticCandidates.filter(isPublicOutcome).length,
    rollExplanations: rollExplanations.filter(isPublicOutcome),
  };
}

/** @param {{ applied: AppliedPulseResults, selectedForApply: PulseOutcome[] }} args */
export function mechanicalPulseRecordFields({ applied, selectedForApply }) {
  const mechanical = (applied?.autoApplied || []).filter(isStateOnlyOutcome);
  return {
    ...(mechanical.length ? {
      mechanicalOutcomeCount: mechanical.length,
      mechanicalOutcomes: mechanical.slice(0, MAX_MECHANICAL_OUTCOMES_PER_PULSE)
        .map(compactOutcomeForHistory),
      // Presence is authoritative, including []: replay must not reconstruct
      // seeds that curation rejected or this bounded field deliberately evicted
      // from the wider mechanical/consequence receipt sets.
      mechanicalRumorSeeds: boundedMechanicalRumorSeeds(applied?.rumorSeedEntries || []),
    } : {}),
    ...(selectedForApply.some(isStateOnlyOutcome) ? {
      consequenceOutcomes: selectedForApply.slice(0, 24).map(compactOutcomeForHistory),
    } : {}),
  };
}
