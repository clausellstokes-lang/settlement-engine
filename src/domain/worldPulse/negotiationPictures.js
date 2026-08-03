/**
 * WR-7b — frozen negotiation pictures and the two-picture parlay.
 *
 * This module owns no state. It accepts only versioned, qualitative records and
 * invokes the existing peace-term leaves once for each party. A missing
 * observation stays `unknown`; it is never translated into a neutral fact.
 */

import {
  alignmentPressFromInput,
  appraiseLoserPortfolioFromInputs,
  believedAdvantageFromInputs,
  carriedClauseFromDraft,
  draftTerms,
  normalizeCarriedTermSheet,
  termBudgetFor,
} from './peaceTerms.js';

export const NEGOTIATION_PICTURE_SCHEMA_VERSION = 1;

export const NEGOTIATION_PICTURE_CARRIERS = Object.freeze(['army', 'court', 'envoy']);
export const NEGOTIATION_EVIDENCE_KINDS = Object.freeze(['battle', 'hall', 'plant', 'rumor']);

const STRENGTH_BANDS = Object.freeze(['unknown', 'spent', 'strained', 'ready', 'strong', 'dominant']);
const STORES_BANDS = Object.freeze(['unknown', 'bare', 'thin', 'stocked', 'deep']);
const PRESSURE_BANDS = Object.freeze(['unknown', 'quiet', 'present', 'pressing', 'decisive']);
const ALIGNMENT_BANDS = Object.freeze(['unknown', 'merciful', 'measured', 'hard', 'punitive']);
const ARCHETYPES = Object.freeze(['unknown', 'merchant', 'military', 'religious', 'other']);
const CAUSE_STATUSES = Object.freeze(['unknown', 'dissolved', 'anchor_unavailable', 'live']);
const EXPORT_KNOWLEDGE = Object.freeze(['unknown', 'known']);

export const NEGOTIATION_SUBJECT_BANDS = Object.freeze({
  strengthBand: STRENGTH_BANDS,
  storesBand: STORES_BANDS,
  foodPressureBand: PRESSURE_BANDS,
  economyPressureBand: PRESSURE_BANDS,
  tradePressureBand: PRESSURE_BANDS,
  threatBand: PRESSURE_BANDS,
  allyStrengthBand: PRESSURE_BANDS,
  restitutionClaimBand: PRESSURE_BANDS,
  warExhaustionBand: PRESSURE_BANDS,
  alignmentPressBand: ALIGNMENT_BANDS,
});

const SUBJECT_KEYS = Object.freeze([
  'settlementId', 'strengthBand', 'storesBand', 'foodPressureBand',
  'economyPressureBand', 'tradePressureBand', 'threatBand',
  'allyStrengthBand', 'restitutionClaimBand', 'warExhaustionBand',
  'governingArchetype', 'alignmentPressBand', 'exportKnowledge', 'exports',
]);
const PICTURE_KEYS = Object.freeze([
  'schemaVersion', 'id', 'carrier', 'partyId', 'counterpartId',
  'relationshipKey', 'episodeKey', 'frontOwnerId', 'frontSinceTick',
  'capturedTick', 'lastChangedTick', 'causeStatus', 'subjects',
  'evidenceIds', 'mutations',
]);
const MUTATION_KEYS = Object.freeze([
  'id', 'pictureId', 'episodeKey', 'sourceId', 'kind', 'tick',
  'subjectId', 'field', 'fromBand', 'toBand', 'direction',
]);

const STRENGTH_INPUT = Object.freeze({ spent: 0.1, strained: 0.3, ready: 0.5, strong: 0.7, dominant: 0.9 });
const PRESSURE_INPUT = Object.freeze({ quiet: 0, present: 0.3333, pressing: 0.6667, decisive: 1 });
const ALIGNMENT_INPUT = Object.freeze({ merciful: 0, measured: 0.3333, hard: 0.6667, punitive: 1 });

/** @param {unknown} value @returns {Record<string, unknown>} */
function recordOf(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {string} */
function strictText(value) {
  return typeof value === 'string' && value.length > 0 && value.trim() === value ? value : '';
}

/** @param {unknown} value @returns {number | null} */
function tickOf(value) {
  return Number.isInteger(value) && Number(value) >= 0 ? Number(value) : null;
}

/** @param {Record<string, unknown>} row @param {readonly string[]} expected */
function hasExactKeys(row, expected) {
  const actual = Object.keys(row).sort();
  const wanted = [...expected].sort();
  return actual.length === wanted.length && actual.every((key, index) => key === wanted[index]);
}

/** @param {unknown} value @param {readonly string[]} vocabulary @returns {string | null} */
function closedValue(value, vocabulary) {
  return typeof value === 'string' && vocabulary.includes(value) ? value : null;
}

/** @param {unknown} value @returns {string[] | null} */
function sortedTexts(value) {
  if (!Array.isArray(value)) return null;
  const texts = value.map(strictText);
  if (texts.some((text) => !text)) return null;
  if (!texts.every((text, index) => index === 0 || texts[index - 1] < text)) return null;
  return texts;
}

/** @param {unknown} value @returns {string[] | null} */
function authoredTexts(value) {
  if (!Array.isArray(value)) return null;
  const texts = value.map(strictText);
  if (texts.some((text) => !text)) return null;
  return [...new Set(texts)].sort();
}

/** @param {Record<string, unknown>} row @param {string} key @param {readonly string[]} vocabulary */
function authoredClosedValue(row, key, vocabulary) {
  if (!(key in row)) return 'unknown';
  return closedValue(row[key], vocabulary);
}

/**
 * Build one canonical qualitative subject. Missing observations become the
 * explicit `unknown` member; malformed authored values reject the whole picture.
 * @param {unknown} value @returns {Record<string, unknown> | null}
 */
function createSubject(value) {
  const row = recordOf(value);
  const settlementId = strictText(row.settlementId);
  if (!settlementId) return null;
  const values = {
    strengthBand: authoredClosedValue(row, 'strengthBand', STRENGTH_BANDS),
    storesBand: authoredClosedValue(row, 'storesBand', STORES_BANDS),
    foodPressureBand: authoredClosedValue(row, 'foodPressureBand', PRESSURE_BANDS),
    economyPressureBand: authoredClosedValue(row, 'economyPressureBand', PRESSURE_BANDS),
    tradePressureBand: authoredClosedValue(row, 'tradePressureBand', PRESSURE_BANDS),
    threatBand: authoredClosedValue(row, 'threatBand', PRESSURE_BANDS),
    allyStrengthBand: authoredClosedValue(row, 'allyStrengthBand', PRESSURE_BANDS),
    restitutionClaimBand: authoredClosedValue(row, 'restitutionClaimBand', PRESSURE_BANDS),
    warExhaustionBand: authoredClosedValue(row, 'warExhaustionBand', PRESSURE_BANDS),
    governingArchetype: authoredClosedValue(row, 'governingArchetype', ARCHETYPES),
    alignmentPressBand: authoredClosedValue(row, 'alignmentPressBand', ALIGNMENT_BANDS),
  };
  if (Object.values(values).some((entry) => entry == null)) return null;

  let exportKnowledge = authoredClosedValue(row, 'exportKnowledge', EXPORT_KNOWLEDGE);
  if (!('exportKnowledge' in row) && 'exports' in row) exportKnowledge = 'known';
  if (exportKnowledge == null) return null;
  const exports = 'exports' in row ? authoredTexts(row.exports) : [];
  if (!exports || (exportKnowledge === 'unknown' && exports.length > 0)) return null;
  return { settlementId, ...values, exportKnowledge, exports };
}

/** @param {unknown} value @returns {Record<string, unknown> | null} */
function normalizeSubject(value) {
  const row = recordOf(value);
  if (!hasExactKeys(row, SUBJECT_KEYS)) return null;
  const subject = createSubject(row);
  if (!subject || !SUBJECT_KEYS.every((key) => JSON.stringify(subject[key]) === JSON.stringify(row[key]))) return null;
  return subject;
}

/**
 * Authoring boundary for a new frozen picture. Mutations cannot be smuggled in
 * here; later observations must pass the one-rung mutation function.
 * @param {unknown} value @returns {Record<string, unknown> | null}
 */
export function createNegotiationPicture(value) {
  const row = recordOf(value);
  const id = strictText(row.id);
  const carrier = recordOf(row.carrier);
  const carrierKind = closedValue(carrier.kind, NEGOTIATION_PICTURE_CARRIERS);
  const carrierId = strictText(carrier.id);
  const partyId = strictText(row.partyId);
  const counterpartId = strictText(row.counterpartId);
  const relationshipKey = strictText(row.relationshipKey);
  const episodeKey = strictText(row.episodeKey);
  const frontOwnerId = strictText(row.frontOwnerId) || partyId;
  const capturedTick = tickOf(row.capturedTick);
  const frontSinceTick = 'frontSinceTick' in row ? tickOf(row.frontSinceTick) : capturedTick;
  const causeStatus = 'causeStatus' in row
    ? closedValue(row.causeStatus, CAUSE_STATUSES)
    : 'unknown';
  if (!id || !carrierKind || !carrierId || !partyId || !counterpartId
    || partyId === counterpartId || !relationshipKey || !episodeKey || !frontOwnerId
    || capturedTick == null || frontSinceTick == null || frontSinceTick > capturedTick
    || !causeStatus || !Array.isArray(row.subjects) || row.subjects.length !== 2) return null;
  const subjects = row.subjects.map(createSubject);
  if (subjects.some((subject) => !subject)) return null;
  subjects.sort((left, right) => (
    String(left.settlementId) < String(right.settlementId) ? -1
      : String(left.settlementId) > String(right.settlementId) ? 1 : 0
  ));
  const subjectIds = subjects.map((subject) => String(subject.settlementId));
  if (subjectIds[0] === subjectIds[1]
    || JSON.stringify(subjectIds) !== JSON.stringify([partyId, counterpartId].sort())) return null;
  const evidenceIds = 'evidenceIds' in row ? authoredTexts(row.evidenceIds) : [];
  if (!evidenceIds) return null;
  return {
    schemaVersion: NEGOTIATION_PICTURE_SCHEMA_VERSION,
    id,
    carrier: { kind: carrierKind, id: carrierId },
    partyId,
    counterpartId,
    relationshipKey,
    episodeKey,
    frontOwnerId,
    frontSinceTick,
    capturedTick,
    lastChangedTick: capturedTick,
    causeStatus,
    subjects,
    evidenceIds,
    mutations: [],
  };
}

/**
 * Strict persistence validator. It also walks mutation chains backwards from
 * the current bands, proving that every recorded observation changed exactly
 * one field by exactly one rung and that no source acted twice.
 * @param {unknown} value @returns {Record<string, unknown> | null}
 */
export function normalizeNegotiationPicture(value) {
  const row = recordOf(value);
  if (!hasExactKeys(row, PICTURE_KEYS) || row.schemaVersion !== NEGOTIATION_PICTURE_SCHEMA_VERSION) return null;
  const id = strictText(row.id);
  const carrier = recordOf(row.carrier);
  if (!hasExactKeys(carrier, ['kind', 'id'])) return null;
  const carrierKind = closedValue(carrier.kind, NEGOTIATION_PICTURE_CARRIERS);
  const carrierId = strictText(carrier.id);
  const partyId = strictText(row.partyId);
  const counterpartId = strictText(row.counterpartId);
  const relationshipKey = strictText(row.relationshipKey);
  const episodeKey = strictText(row.episodeKey);
  const frontOwnerId = strictText(row.frontOwnerId);
  const frontSinceTick = tickOf(row.frontSinceTick);
  const capturedTick = tickOf(row.capturedTick);
  const lastChangedTick = tickOf(row.lastChangedTick);
  const causeStatus = closedValue(row.causeStatus, CAUSE_STATUSES);
  if (!id || !carrierKind || !carrierId || !partyId || !counterpartId || partyId === counterpartId
    || !relationshipKey || !episodeKey || !frontOwnerId || frontSinceTick == null
    || capturedTick == null || lastChangedTick == null || frontSinceTick > capturedTick
    || capturedTick > lastChangedTick || !causeStatus) return null;
  if (!Array.isArray(row.subjects) || row.subjects.length !== 2) return null;
  const subjects = row.subjects.map(normalizeSubject);
  if (subjects.some((subject) => !subject)) return null;
  const subjectIds = subjects.map((subject) => String(subject.settlementId));
  if (!subjectIds.every((subjectId, index) => index === 0 || subjectIds[index - 1] < subjectId)
    || JSON.stringify(subjectIds) !== JSON.stringify([partyId, counterpartId].sort())) return null;
  const evidenceIds = sortedTexts(row.evidenceIds);
  if (!evidenceIds || !Array.isArray(row.mutations)) return null;
  const mutations = row.mutations.map(normalizeMutation);
  if (mutations.some((mutation) => !mutation)) return null;
  if (!mutations.every((mutation, index) => index === 0 || mutationOrder(mutations[index - 1], mutation) < 0)) return null;
  const mutationIds = mutations.map((mutation) => String(mutation.id));
  const sourceIds = mutations.map((mutation) => String(mutation.sourceId));
  if (new Set(mutationIds).size !== mutationIds.length || new Set(sourceIds).size !== sourceIds.length
    || sourceIds.some((sourceId) => !evidenceIds.includes(sourceId))) return null;
  const expectedLastChanged = mutations.length
    ? Math.max(...mutations.map((mutation) => Number(mutation.tick)))
    : capturedTick;
  if (lastChangedTick !== expectedLastChanged) return null;

  /** @type {Map<string, Record<string, unknown>>} */
  const rewound = new Map(subjects.map((subject) => [String(subject.settlementId), { ...subject }]));
  for (let index = mutations.length - 1; index >= 0; index -= 1) {
    const mutation = mutations[index];
    if (mutation.pictureId !== id || mutation.episodeKey !== episodeKey
      || Number(mutation.tick) < capturedTick || Number(mutation.tick) > lastChangedTick) return null;
    const subject = rewound.get(String(mutation.subjectId));
    if (!subject || subject[String(mutation.field)] !== mutation.toBand) return null;
    subject[String(mutation.field)] = mutation.fromBand;
  }

  return {
    schemaVersion: NEGOTIATION_PICTURE_SCHEMA_VERSION,
    id,
    carrier: { kind: carrierKind, id: carrierId },
    partyId,
    counterpartId,
    relationshipKey,
    episodeKey,
    frontOwnerId,
    frontSinceTick,
    capturedTick,
    lastChangedTick,
    causeStatus,
    subjects,
    evidenceIds,
    mutations,
  };
}

/** @param {unknown} value @returns {Record<string, unknown> | null} */
function normalizeMutation(value) {
  const row = recordOf(value);
  if (!hasExactKeys(row, MUTATION_KEYS)) return null;
  const id = strictText(row.id);
  const pictureId = strictText(row.pictureId);
  const episodeKey = strictText(row.episodeKey);
  const sourceId = strictText(row.sourceId);
  const kind = closedValue(row.kind, NEGOTIATION_EVIDENCE_KINDS);
  const tick = tickOf(row.tick);
  const subjectId = strictText(row.subjectId);
  const field = strictText(row.field);
  const ladder = NEGOTIATION_SUBJECT_BANDS[field];
  const fromBand = ladder ? closedValue(row.fromBand, ladder) : null;
  const toBand = ladder ? closedValue(row.toBand, ladder) : null;
  const direction = row.direction === 'rise' || row.direction === 'fall' ? row.direction : '';
  if (!id || !pictureId || !episodeKey || !sourceId || !kind || tick == null
    || !subjectId || !field || !fromBand || !toBand || fromBand === 'unknown'
    || toBand === 'unknown' || !direction) return null;
  const gap = ladder.indexOf(toBand) - ladder.indexOf(fromBand);
  if ((direction === 'rise' && gap !== 1) || (direction === 'fall' && gap !== -1)) return null;
  return { id, pictureId, episodeKey, sourceId, kind, tick, subjectId, field, fromBand, toBand, direction };
}

/** @param {Record<string, unknown>} left @param {Record<string, unknown>} right */
function mutationOrder(left, right) {
  return Number(left.tick) - Number(right.tick)
    || (String(left.id) < String(right.id) ? -1 : String(left.id) > String(right.id) ? 1 : 0);
}

/**
 * Apply one typed observation. Rejection returns the exact input reference.
 * @param {unknown} value @param {unknown} patch
 * @returns {{ picture:unknown, changed:boolean, reason:string }}
 */
export function mutateNegotiationPicture(value, patch) {
  const picture = normalizeNegotiationPicture(value);
  if (!picture) return { picture: value, changed: false, reason: 'invalid_picture' };
  const mutation = normalizeMutation(patch);
  if (!mutation) return { picture: value, changed: false, reason: 'invalid_mutation' };
  if (mutation.pictureId !== picture.id || mutation.episodeKey !== picture.episodeKey) {
    return { picture: value, changed: false, reason: 'cross_picture' };
  }
  if (Number(mutation.tick) < Number(picture.lastChangedTick)) {
    return { picture: value, changed: false, reason: 'stale_mutation' };
  }
  if (/** @type {Array<Record<string, unknown>>} */ (picture.mutations)
    .some((row) => row.id === mutation.id || row.sourceId === mutation.sourceId)) {
    return { picture: value, changed: false, reason: 'duplicate_source' };
  }
  const subjectIndex = /** @type {Array<Record<string, unknown>>} */ (picture.subjects)
    .findIndex((subject) => subject.settlementId === mutation.subjectId);
  if (subjectIndex < 0) return { picture: value, changed: false, reason: 'wrong_subject' };
  const subject = /** @type {Array<Record<string, unknown>>} */ (picture.subjects)[subjectIndex];
  if (subject[String(mutation.field)] !== mutation.fromBand) {
    return { picture: value, changed: false, reason: 'stale_band' };
  }
  const subjects = /** @type {Array<Record<string, unknown>>} */ (picture.subjects)
    .map((entry, index) => index === subjectIndex
      ? { ...entry, [String(mutation.field)]: mutation.toBand }
      : { ...entry });
  const evidenceIds = [...new Set([
    .../** @type {string[]} */ (picture.evidenceIds),
    String(mutation.sourceId),
  ])].sort();
  const mutations = [
    .../** @type {Array<Record<string, unknown>>} */ (picture.mutations).map((entry) => ({ ...entry })),
    mutation,
  ].sort(mutationOrder);
  const next = normalizeNegotiationPicture({
    ...picture,
    subjects,
    evidenceIds,
    mutations,
    lastChangedTick: Number(mutation.tick),
  });
  return next
    ? { picture: next, changed: true, reason: 'applied' }
    : { picture: value, changed: false, reason: 'invalid_result' };
}

/** @param {unknown} value @param {unknown} patch @returns {unknown} */
export function applyNegotiationPictureMutation(value, patch) {
  return mutateNegotiationPicture(value, patch).picture;
}

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

/** @param {unknown} value */
export function normalizeParlayTermSheet(value) {
  return normalizeCarriedTermSheet(value);
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
