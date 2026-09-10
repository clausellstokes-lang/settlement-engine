/**
 * negotiationEvaluation.js — THE TWO-PICTURE PARLAY EVALUATION (WR-7b), split out
 * of negotiationPictures.js.
 *
 * THE DEFECT THIS SPLIT EXISTS TO PREVENT (measured 2026-08-07). negotiationPictures.js
 * conflated two jobs with very different dependency weights:
 *
 *   1. RECORD NORMALIZATION — create/normalize/mutate a frozen picture, and normalize a
 *      carried term sheet. This is on the SAVE/LOAD path: ensureWorldState normalizes
 *      persisted envoy errands, and every errand row carries pictures.
 *   2. EVALUATION — price a picture through the peace-term leaves. This needs the
 *      appraisal and drafting machinery, which reaches beliefMap.js (1,581 lines, whose
 *      own docblock promises "zero first-paint bytes") and through it the 53 kB
 *      distanceRead.js digest reader, embattlement, brokerageFidelity and reframeKernel.
 *
 * Because both lived in one module, importing a NORMALIZER dragged the whole EVALUATION
 * closure behind it, and the store's critical path did exactly that:
 *
 *   main.jsx -> store/index.js -> store/campaignSlice.js -> worldPulse/worldState.js
 *     -> worldPulse/envoyErrand.js -> worldPulse/negotiationPictures.js
 *     -> worldPulse/peaceTermsAppraisal.js -> worldPulse/beliefMap.js
 *     -> spatial/distanceRead.js
 *
 * Splitting on that seam takes ~38 modules of negotiation and geography off first paint.
 *
 * WHY THIS FILE DOES NOT GET RE-EXPORTED FROM negotiationPictures.js, breaking with the
 * usual house leaf-extraction pattern (deityConstants / stablePart / userRouteIdentity):
 * those extractions re-export from the head so no consumer import site moves. Here that
 * would REINSTATE the very edge being cut — negotiationPictures.js would import this
 * module, which imports peaceTermsAppraisal.js, and the first-paint closure would be
 * identical to before. The dependency must run ONE WAY: this module imports the picture
 * record layer; the record layer never imports this one. The four evaluation consumers
 * therefore moved their import sites, and that is deliberate, not an oversight.
 *
 * PURE: no Date, no Math.random, no store, no React, no I/O, no mutation. Every
 * declaration below was moved VERBATIM from negotiationPictures.js.
 *
 * @enforced-by tests/domain/negotiationPictures.test.js
 * @enforced-by tests/build/userRouteIdentityLeaf.test.js (the first-paint graph)
 */

import {
  ALIGNMENT_INPUT,
  PRESSURE_INPUT,
  STRENGTH_INPUT,
  normalizeNegotiationPicture,
  recordOf,
  strictText,
  tickOf,
} from './negotiationPictures.js';
import {
  alignmentPressFromInput,
  appraiseLoserPortfolioFromInputs,
  believedAdvantageFromInputs,
  termBudgetFor,
} from './peaceTermsAppraisal.js';
import { carriedClauseFromDraft, normalizeCarriedTermSheet } from './peaceTermsCarriedSheet.js';
import { draftTerms } from './peaceTermsDrafting.js';

/** @param {Record<string, unknown>} picture @param {string} settlementId */
function subjectOf(picture, settlementId) {
  return /** @type {Array<Record<string, unknown>>} */ (picture.subjects)
    .find((subject) => subject.settlementId === settlementId) || null;
}

/** @param {unknown} band @param {Readonly<Record<string, number>>} values */
function bandInput(band, values) {
  return typeof band === 'string' && Object.prototype.hasOwnProperty.call(values, band)
    ? values[band]
    : null;
}

/**
 * Run the existing offer leaves under exactly one party's frozen picture.
 * @param {unknown} value
 * @param {{ victorId:unknown, loserId:unknown }} orientation
 * @returns {Record<string, unknown> | null}
 */
export function evaluateNegotiationPicture(value, orientation) {
  const picture = normalizeNegotiationPicture(value);
  const victorId = strictText(orientation?.victorId);
  const loserId = strictText(orientation?.loserId);
  if (!picture || !victorId || !loserId || victorId === loserId) return null;
  const pair = [String(picture.partyId), String(picture.counterpartId)].sort();
  if (JSON.stringify([victorId, loserId].sort()) !== JSON.stringify(pair)) return null;
  const victor = subjectOf(picture, victorId);
  const loser = subjectOf(picture, loserId);
  if (!victor || !loser) return null;
  const victorStrength = bandInput(victor.strengthBand, STRENGTH_INPUT);
  const loserStrength = bandInput(loser.strengthBand, STRENGTH_INPUT);
  if (victorStrength == null || loserStrength == null) return null;
  const believedMargin = believedAdvantageFromInputs(victorStrength, loserStrength);
  const budgetRead = termBudgetFor(believedMargin);
  if (budgetRead.whitePeace) return {
    pictureId: picture.id,
    partyId: picture.partyId,
    victorId,
    loserId,
    believedMargin,
    ...budgetRead,
    ranked: [],
    clauses: [],
    budgetSpent: 0,
  };

  const alignmentInput = bandInput(victor.alignmentPressBand, ALIGNMENT_INPUT);
  if (alignmentInput == null || victor.governingArchetype === 'unknown') return null;
  const ranked = appraiseLoserPortfolioFromInputs({
    believedLoserStrength: loserStrength,
    victorFoodPressure01: bandInput(victor.foodPressureBand, PRESSURE_INPUT),
    victorEconomyPressure01: bandInput(victor.economyPressureBand, PRESSURE_INPUT),
    victorTradePressure01: bandInput(victor.tradePressureBand, PRESSURE_INPUT),
    victorThreat01: bandInput(victor.threatBand, PRESSURE_INPUT),
    loserAllyStrength01: bandInput(loser.allyStrengthBand, PRESSURE_INPUT),
    loserExports: loser.exportKnowledge === 'known' ? [.../** @type {string[]} */ (loser.exports)] : null,
    victorArchetype: String(victor.governingArchetype),
    restitutionClaim01: bandInput(loser.restitutionClaimBand, PRESSURE_INPUT),
  });
  const drafted = draftTerms({
    ranked,
    budget: Number(budgetRead.budget),
    margin01: Number(budgetRead.margin01),
    press: alignmentPressFromInput(alignmentInput),
    tick: 0,
  });
  const clauses = drafted.terms.map(carriedClauseFromDraft);
  if (clauses.some((clause) => !clause)) return null;
  return {
    pictureId: picture.id,
    partyId: picture.partyId,
    victorId,
    loserId,
    believedMargin,
    ...budgetRead,
    ranked,
    clauses,
    budgetSpent: drafted.budgetSpent,
  };
}

/**
 * Compare one exact proposer draft to the responder's independent counterdraft.
 * @param {unknown} offeredClauses @param {unknown} offeredBudget
 * @param {unknown} responderEvaluation
 * @returns {{ accepted:boolean, reason:string }}
 */
export function compareOfferToResponderDraft(offeredClauses, offeredBudget, responderEvaluation) {
  const evaluation = recordOf(responderEvaluation);
  if (!Array.isArray(offeredClauses) || !Array.isArray(evaluation.clauses)
    || typeof offeredBudget !== 'number' || !Number.isFinite(offeredBudget)
    || typeof evaluation.budget !== 'number' || !Number.isFinite(evaluation.budget)) {
    return { accepted: false, reason: 'invalid_offer' };
  }
  if (offeredClauses.some((clause) => !boundedClauseShape(clause))
    || evaluation.clauses.some((clause) => !boundedClauseShape(clause))) {
    return { accepted: false, reason: 'invalid_offer' };
  }
  if (offeredClauses.length === 0) return offeredBudget === 0
    ? { accepted: true, reason: 'white_peace' }
    : { accepted: false, reason: 'budget_refused' };
  if (evaluation.whitePeace === true || Number(evaluation.believedMargin) <= 0) {
    return { accepted: false, reason: 'orientation_refused' };
  }
  if (offeredBudget > Number(evaluation.budget)) return { accepted: false, reason: 'budget_refused' };
  for (const rawClause of offeredClauses) {
    const clause = recordOf(rawClause);
    const bound = /** @type {Array<Record<string, unknown>>} */ (evaluation.clauses)
      .find((candidate) => candidate.type === clause.type && candidate.family === clause.family);
    if (!bound) return { accepted: false, reason: 'family_refused' };
    if (String(clause.good || '') !== String(bound.good || '') || (clause.seam === true) !== (bound.seam === true)) {
      return { accepted: false, reason: 'asset_refused' };
    }
    if (Number(clause.magnitude) > Number(bound.magnitude)) return { accepted: false, reason: 'magnitude_refused' };
    if (Number(clause.durationTicks) > Number(bound.durationTicks)) return { accepted: false, reason: 'duration_refused' };
    if (Number(clause.weightSpent) > Number(bound.weightSpent)) return { accepted: false, reason: 'weight_refused' };
  }
  return { accepted: true, reason: 'bounded' };
}

/** @param {unknown} value */
function boundedClauseShape(value) {
  const clause = recordOf(value);
  return strictText(clause.type) !== ''
    && strictText(clause.family) !== ''
    && typeof clause.magnitude === 'number' && Number.isFinite(clause.magnitude)
    && clause.magnitude >= 0 && clause.magnitude <= 1
    && Number.isInteger(clause.durationTicks) && Number(clause.durationTicks) > 0
    && typeof clause.weightSpent === 'number' && Number.isFinite(clause.weightSpent)
    && clause.weightSpent > 0
    && clause.burden01 === 0
    && (!('good' in clause) || strictText(clause.good) !== '')
    && (!('seam' in clause) || clause.seam === true);
}

/**
 * Generate one proposer draft and ask the responder to bound it. Refusal emits
 * no artifact; compromise and retries belong to WR-7c.
 * @param {Record<string, unknown>} args
 * @returns {{ agreed:boolean, reason:string, termSheet:Record<string, unknown>|null }}
 */
export function negotiateFromPictures(args) {
  const proposerPicture = normalizeNegotiationPicture(args.proposerPicture);
  const responderPicture = normalizeNegotiationPicture(args.responderPicture);
  if (!proposerPicture || !responderPicture) return refusal('invalid_picture');
  const termSheetId = strictText(args.termSheetId);
  const errandId = strictText(args.errandId);
  const encounterId = strictText(args.encounterId);
  const episodeKey = strictText(args.episodeKey);
  const relationshipKey = strictText(args.relationshipKey);
  const proposerId = strictText(args.proposerId);
  const responderId = strictText(args.responderId);
  const victorId = strictText(args.victorId);
  const loserId = strictText(args.loserId);
  const agreedTick = tickOf(args.agreedTick);
  if (!termSheetId || !errandId || !encounterId || !episodeKey || !relationshipKey
    || !proposerId || !responderId || !victorId || !loserId || agreedTick == null) return refusal('invalid_context');
  const pair = [proposerId, responderId].sort();
  if (proposerId === responderId || victorId === loserId
    || JSON.stringify([victorId, loserId].sort()) !== JSON.stringify(pair)) return refusal('pair_mismatch');
  if (proposerPicture.partyId !== proposerId || proposerPicture.counterpartId !== responderId
    || responderPicture.partyId !== responderId || responderPicture.counterpartId !== proposerId) return refusal('picture_role_mismatch');
  if (proposerPicture.relationshipKey !== relationshipKey || responderPicture.relationshipKey !== relationshipKey) return refusal('relationship_mismatch');
  if (proposerPicture.episodeKey !== episodeKey || responderPicture.episodeKey !== episodeKey) return refusal('episode_mismatch');
  if (agreedTick < Number(proposerPicture.lastChangedTick) || agreedTick < Number(responderPicture.lastChangedTick)) return refusal('clock_mismatch');

  const orientation = { victorId, loserId };
  const proposerEvaluation = evaluateNegotiationPicture(proposerPicture, orientation);
  const responderEvaluation = evaluateNegotiationPicture(responderPicture, orientation);
  if (!proposerEvaluation) return refusal('invalid_proposer_evaluation');
  if (!responderEvaluation) return refusal('invalid_responder_evaluation');
  if (proposerEvaluation.whitePeace !== true
    && /** @type {unknown[]} */ (proposerEvaluation.clauses).length === 0) return refusal('proposer_has_no_sheet');
  const bounded = compareOfferToResponderDraft(
    proposerEvaluation.clauses,
    proposerEvaluation.budgetSpent,
    responderEvaluation,
  );
  if (!bounded.accepted) return refusal(bounded.reason);
  const termSheet = normalizeCarriedTermSheet({
    schemaVersion: 1,
    id: termSheetId,
    errandId,
    encounterId,
    episodeKey,
    relationshipKey,
    parties: pair,
    proposerId,
    responderId,
    victorId,
    loserId,
    agreedTick,
    pictureIds: { proposer: String(proposerPicture.id), responder: String(responderPicture.id) },
    clauses: proposerEvaluation.clauses,
    budgetSpent: proposerEvaluation.budgetSpent,
    valuations: [
      { partyId: proposerId, pictureId: String(proposerPicture.id), role: 'proposer', decision: 'accept' },
      { partyId: responderId, pictureId: String(responderPicture.id), role: 'responder', decision: 'accept' },
    ],
  });
  return termSheet
    ? { agreed: true, reason: bounded.reason, termSheet }
    : refusal('invalid_term_sheet');
}

/** @param {string} reason */
function refusal(reason) {
  return { agreed: false, reason, termSheet: null };
}

/**
 * Recheck an agreement at the parlay boundary. This is deliberately separate
 * from home materialization, where the already-carried artifact is authoritative.
 * @param {{ termSheet:unknown, proposerPicture:unknown, responderPicture:unknown }} args
 */
export function validateTermSheetAgainstPictures(args) {
  const sheet = normalizeCarriedTermSheet(args.termSheet);
  const proposerPicture = normalizeNegotiationPicture(args.proposerPicture);
  const responderPicture = normalizeNegotiationPicture(args.responderPicture);
  if (!sheet || !proposerPicture || !responderPicture) return { accepted: false, reason: 'invalid_artifact' };
  if (sheet.pictureIds.proposer !== proposerPicture.id || sheet.pictureIds.responder !== responderPicture.id
    || sheet.proposerId !== proposerPicture.partyId || sheet.responderId !== responderPicture.partyId
    || proposerPicture.counterpartId !== sheet.responderId || responderPicture.counterpartId !== sheet.proposerId
    || sheet.relationshipKey !== proposerPicture.relationshipKey || sheet.relationshipKey !== responderPicture.relationshipKey
    || sheet.episodeKey !== proposerPicture.episodeKey || sheet.episodeKey !== responderPicture.episodeKey
    || Number(sheet.agreedTick) < Number(proposerPicture.lastChangedTick)
    || Number(sheet.agreedTick) < Number(responderPicture.lastChangedTick)) {
    return { accepted: false, reason: 'provenance_mismatch' };
  }
  const orientation = { victorId: sheet.victorId, loserId: sheet.loserId };
  const proposerEvaluation = evaluateNegotiationPicture(proposerPicture, orientation);
  const responderEvaluation = evaluateNegotiationPicture(responderPicture, orientation);
  if (!proposerEvaluation || !responderEvaluation) return { accepted: false, reason: 'invalid_evaluation' };
  if (JSON.stringify(sheet.clauses) !== JSON.stringify(proposerEvaluation.clauses)
    || sheet.budgetSpent !== proposerEvaluation.budgetSpent) return { accepted: false, reason: 'proposer_sheet_mismatch' };
  return compareOfferToResponderDraft(sheet.clauses, sheet.budgetSpent, responderEvaluation);
}
