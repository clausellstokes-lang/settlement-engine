/**
 * domain/worldPulse/decisionTier.js — Advance-scaling Stage 2.
 *
 * Two pure helpers the multi-tick orchestrator (advanceCampaignWorld.js) leans on
 * once pausing arrives (Stage 3), surfaced ADDITIVELY here without changing any
 * existing apply behavior:
 *
 *  1. deriveDecisionTier(outcome) -> 'major' | 'minor' — classifies a selected
 *     outcome on STRUCTURAL markers, never severity or applyMode. A conquest sits
 *     around severity 0.6-0.8 while a high-pressure famine can hit 0.78, so a
 *     severity cut would miscall both. And conquest/coup/vassalization are
 *     applyMode:'auto' TODAY (see changeAuthorityPolicy.js), so an applyMode cut
 *     would miss every campaign-altering move. The signal is the shape of the
 *     outcome: a war footing, a power transfer, a vassalage, a government change.
 *
 *  2. resolveProposalToOutcome(outcome) — the deterministic resolver. It mirrors
 *     EXACTLY what applyWorldPulseProposal does to a stored proposal outcome
 *     before routing it through applyWorldPulseOutcomes: spread the outcome and
 *     stamp applyMode:'auto'. No fresh RNG draw, so auto-resolving a major is
 *     byte-identical to a DM clicking Apply.
 *
 * Stage 2 is ADDITIVE + BEHAVIOR-PRESERVING: autoresolve-ON still resolves
 * everything, majors[] is only SURFACED, and the flag-OFF path is untouched.
 */

/**
 * The candidateTypes whose outcomes are campaign-altering by their very shape.
 * Mirrors the `campaignAltering: true` entries in changeAuthorityPolicy.js (the
 * contract-tested canonical map). Kept as a Set for an O(1) structural check.
 *
 * @type {ReadonlySet<string>}
 */
const CAMPAIGN_ALTERING_CANDIDATE_TYPES = new Set([
  // War start: a settlement shifts its whole economy onto a war footing.
  'war_mobilization',
  // A settlement strategy that commits to opening a siege (deploy).
  'strategy_deploy',
  // Occupation/conquest: a fallen siege hands a settlement to an occupier.
  'conquest',
  // The terminal vassalage of an occupation that has run its course.
  'occupation_vassalized',
  // Succession/coup: the seat changes hands.
  'coup_succeeded',
  // A faction moving to change a settlement's government.
  'faction_government_challenge',
]);

/**
 * A power transfer is campaign-altering when its cause is a conquest or a coup —
 * the seat or the sovereignty of a settlement actually moves. (A power_transfer
 * carrying neither cause is not a structural authority flip.)
 *
 * @param {any} outcome
 * @returns {boolean}
 */
function isAuthorityTransfer(outcome) {
  if (outcome?.type !== 'power_transfer') return false;
  const cause = String(outcome?.powerTransfer?.cause || '');
  return cause === 'conquest' || cause === 'coup';
}

/**
 * A government_change proposal payload is campaign-altering: it relabels how the
 * settlement is governed. (factionCompetition emits this kind on the
 * faction_government_challenge candidate; checking the payload kind catches it
 * regardless of how the candidateType is spelled downstream.)
 *
 * @param {any} outcome
 * @returns {boolean}
 */
function isGovernmentChange(outcome) {
  return String(outcome?.proposalPayload?.kind || '') === 'government_change';
}

/**
 * Classify a selected outcome on STRUCTURAL markers alone.
 *
 * MAJOR (the DM should get a say once pausing lands): war start, occupation /
 * conquest, succession / coup, faction collapse / government change, terminal
 * vassalage. MINOR: everything else, however severe — a famine, an economic
 * shock, a relationship drift. Severity and applyMode are deliberately ignored.
 *
 * @param {any} outcome  a world-pulse outcome (the selectedForApply shape).
 * @returns {'major'|'minor'}
 */
export function deriveDecisionTier(outcome) {
  if (!outcome) return 'minor';
  if (CAMPAIGN_ALTERING_CANDIDATE_TYPES.has(String(outcome.candidateType || ''))) return 'major';
  if (isAuthorityTransfer(outcome)) return 'major';
  if (isGovernmentChange(outcome)) return 'major';
  return 'minor';
}

/**
 * Is this outcome a MAJOR? Convenience predicate over deriveDecisionTier.
 *
 * @param {any} outcome
 * @returns {boolean}
 */
export function isMajorOutcome(outcome) {
  return deriveDecisionTier(outcome) === 'major';
}

/**
 * The deterministic recommended-outcome resolver. Produces the EXACT outcome
 * applyWorldPulseProposal feeds to applyWorldPulseOutcomes: the stored outcome
 * with applyMode forced to 'auto'. No fresh RNG draw — auto-resolving a major is
 * byte-identical to a DM clicking Apply on the queued proposal.
 *
 * Stages 3+ use this to auto-resolve the majors a paused Advance chose to skip;
 * Stage 2 surfaces it without changing any call site.
 *
 * @param {any} outcome  a selected outcome (or a proposal's stored outcome).
 * @returns {any} the same outcome, applyMode:'auto'.
 */
export function resolveProposalToOutcome(outcome) {
  return { ...(outcome || {}), applyMode: 'auto' };
}
