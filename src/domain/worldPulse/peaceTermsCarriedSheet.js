/**
 * domain/worldPulse/peaceTermsCarriedSheet.js — WR-7b THE ARTIFACT THAT TRAVELS.
 *
 * A parlay agreed in the field is carried home as a versioned, authority-NEUTRAL
 * sheet: negotiated burdens and durations, never mint or expiry clocks. This leaf
 * owns the clause stripper and the STRICT canonical validator — unknown keys,
 * mutable authority clocks, unsorted identifiers, duplicate families, off-catalog
 * durations and malformed provenance all fail closed, because the exact historical
 * bargain must be consumed whole or refused whole. Materializing the validated
 * sheet into a live treaty is the HEAD's job: only the writer stamps clocks.
 *
 * Extracted verbatim from peaceTerms.js by THE DECOMPOSITION WAVE (war tranche,
 * file 2 of 4).
 */
import { CURRENT_TREATY_TICKS_PER_YEAR } from './treatyClock.js';
import { PEACE_TERMS_TUNING, TERM_CATALOG } from './peaceTermsCatalog.js';
import {
  canonicalBoundedNumber, canonicalNonNegativeNumber, canonicalPositiveNumber,
  hasExactKeys, isSortedUnique, nonNegativeInteger, positiveInteger, recordOf,
  round4, strictSortedPair, strictText,
} from './peaceTermsPrimitives.js';

/** @typedef {import('./peaceTermsCatalog.js').TermRecord} TermRecord */

/** WR-7b's carried-sheet schema. Agreement persists durations, never authority
 * clocks; `mintedTick` and `expiresTick` first exist when the sheet reaches home. */
export const CARRIED_TERM_SHEET_SCHEMA_VERSION = 1;

/**
 * Strip one freshly drafted term down to the authority-neutral clause carried
 * by an envoy. The clause keeps the exact negotiated burden while deliberately
 * dropping mint, expiry, compliance, execution counters, and rendered receipt.
 * @param {TermRecord} term
 * @returns {Record<string, unknown> | null}
 */
export function carriedClauseFromDraft(term) {
  const spec = TERM_CATALOG[String(term?.type || '')];
  const mintedTick = Number(term?.mintedTick);
  const expiresTick = Number(term?.expiresTick);
  if (!spec || !Number.isInteger(mintedTick) || !Number.isInteger(expiresTick) || expiresTick <= mintedTick) return null;
  /** @type {Record<string, unknown>} */
  const clause = {
    type: String(term.type),
    family: spec.family,
    magnitude: Number(term.magnitude),
    durationTicks: expiresTick - mintedTick,
    weightSpent: Number(term.weightSpent),
    burden01: Number(term.burden01),
  };
  if (term.good) clause.good = String(term.good);
  if (term.seam === true) clause.seam = true;
  // WR-10: the conveyed settlement travels WITH the clause. A cession whose object is
  // dropped in transit would come home as a promise to hand over nothing in
  // particular, and the validator below refuses exactly that.
  if (term.assetId) clause.assetId = String(term.assetId);
  return normalizeCarriedClause(clause);
}

/**
 * Strict canonical validator for a versioned parlay sheet. Unknown properties,
 * mutable authority clocks, unsorted identifiers, duplicate families, and
 * malformed provenance all fail closed. This validates the artifact that was
 * agreed; it intentionally performs no present-day geography or holdings read.
 * @param {unknown} value @returns {Record<string, unknown> | null}
 */
export function normalizeCarriedTermSheet(value) {
  const row = recordOf(value);
  if (!hasExactKeys(row, [
    'schemaVersion', 'id', 'errandId', 'encounterId', 'episodeKey',
    'relationshipKey', 'parties', 'proposerId', 'responderId', 'victorId',
    'loserId', 'agreedTick', 'pictureIds', 'clauses', 'budgetSpent', 'valuations',
  ])) return null;
  if (row.schemaVersion !== CARRIED_TERM_SHEET_SCHEMA_VERSION) return null;

  const id = strictText(row.id);
  const errandId = strictText(row.errandId);
  const encounterId = strictText(row.encounterId);
  const episodeKey = strictText(row.episodeKey);
  const relationshipKey = strictText(row.relationshipKey);
  const proposerId = strictText(row.proposerId);
  const responderId = strictText(row.responderId);
  const victorId = strictText(row.victorId);
  const loserId = strictText(row.loserId);
  const agreedTick = nonNegativeInteger(row.agreedTick);
  if (!id || !errandId || !encounterId || !episodeKey || !relationshipKey
    || !proposerId || !responderId || !victorId || !loserId
    || agreedTick == null || proposerId === responderId || victorId === loserId) return null;

  const parties = strictSortedPair(row.parties);
  const expectedParties = [proposerId, responderId].sort();
  if (!parties || JSON.stringify(parties) !== JSON.stringify(expectedParties)
    || !parties.includes(victorId) || !parties.includes(loserId)) return null;

  const pictureIds = recordOf(row.pictureIds);
  if (!hasExactKeys(pictureIds, ['proposer', 'responder'])) return null;
  const proposerPictureId = strictText(pictureIds.proposer);
  const responderPictureId = strictText(pictureIds.responder);
  if (!proposerPictureId || !responderPictureId || proposerPictureId === responderPictureId) return null;

  if (!Array.isArray(row.clauses) || row.clauses.length > PEACE_TERMS_TUNING.TOP_ASSETS) return null;
  /** @type {Array<Record<string, unknown>>} */
  const clauses = [];
  const families = new Set();
  for (const rawClause of row.clauses) {
    const clause = normalizeCarriedClause(rawClause);
    if (!clause || families.has(String(clause.family))) return null;
    families.add(String(clause.family));
    clauses.push(clause);
  }
  if (!isSortedUnique(clauses.map((clause) => String(clause.type)))) return null;
  const budgetSpent = canonicalNonNegativeNumber(row.budgetSpent);
  if (budgetSpent == null || budgetSpent !== round4(clauses.reduce((sum, clause) => sum + Number(clause.weightSpent), 0))) return null;
  if ((clauses.length === 0) !== (budgetSpent === 0)) return null;

  if (!Array.isArray(row.valuations) || row.valuations.length !== 2) return null;
  const proposerValuation = normalizeCarriedValuation(row.valuations[0]);
  const responderValuation = normalizeCarriedValuation(row.valuations[1]);
  if (!proposerValuation || !responderValuation
    || proposerValuation.role !== 'proposer' || responderValuation.role !== 'responder'
    || proposerValuation.partyId !== proposerId || responderValuation.partyId !== responderId
    || proposerValuation.pictureId !== proposerPictureId || responderValuation.pictureId !== responderPictureId) return null;

  return {
    schemaVersion: CARRIED_TERM_SHEET_SCHEMA_VERSION,
    id, errandId, encounterId, episodeKey, relationshipKey, parties,
    proposerId, responderId, victorId, loserId, agreedTick,
    pictureIds: { proposer: proposerPictureId, responder: responderPictureId },
    clauses,
    budgetSpent,
    valuations: [proposerValuation, responderValuation],
  };
}

/** @param {unknown} value @returns {Record<string, unknown> | null} */
function normalizeCarriedClause(value) {
  const clause = recordOf(value);
  const keys = Object.keys(clause).sort();
  const baseKeys = ['burden01', 'durationTicks', 'family', 'magnitude', 'type', 'weightSpent'];
  const optionalKeys = ['good', 'seam', 'assetId'];
  if (keys.some((key) => !baseKeys.includes(key) && !optionalKeys.includes(key))
    || baseKeys.some((key) => !keys.includes(key))) return null;
  const type = strictText(clause.type);
  const spec = TERM_CATALOG[type];
  const family = strictText(clause.family);
  const magnitude = canonicalBoundedNumber(clause.magnitude);
  const durationTicks = positiveInteger(clause.durationTicks);
  const weightSpent = canonicalPositiveNumber(clause.weightSpent);
  const burden01 = canonicalBoundedNumber(clause.burden01);
  if (!spec || family !== spec.family || magnitude == null || durationTicks == null
    || durationTicks % CURRENT_TREATY_TICKS_PER_YEAR !== 0
    || durationTicks > spec.maxYears * CURRENT_TREATY_TICKS_PER_YEAR
    || weightSpent == null || burden01 !== 0) return null;
  const good = 'good' in clause ? strictText(clause.good) : '';
  if ((type === 'resource_share') !== !!good) return null;
  const seam = 'seam' in clause ? clause.seam : undefined;
  if ((spec.executor === 'seam') !== (seam === true)) return null;
  // WR-10 — THE OBJECT OF A CONVEYANCE IS NOT OPTIONAL. The biconditional is the
  // `good`/`resource_share` rule verbatim, and it fails CLOSED in both directions: a
  // `sovereignty_transfer` without a non-empty `assetId` is a deed with no property on
  // it, and an `assetId` on any other clause is a term claiming to convey a settlement
  // that no executor will ever read. Either is a malformed artifact, and the exact
  // historical bargain is consumed whole or refused whole.
  const assetId = 'assetId' in clause ? strictText(clause.assetId) : '';
  if ((type === 'sovereignty_transfer') !== !!assetId) return null;
  return {
    type, family, magnitude, durationTicks, weightSpent, burden01,
    ...(good ? { good } : {}),
    ...(seam === true ? { seam: true } : {}),
    ...(assetId ? { assetId } : {}),
  };
}

/** @param {unknown} value @returns {Record<string, string> | null} */
function normalizeCarriedValuation(value) {
  const row = recordOf(value);
  if (!hasExactKeys(row, ['partyId', 'pictureId', 'role', 'decision'])) return null;
  const partyId = strictText(row.partyId);
  const pictureId = strictText(row.pictureId);
  const role = row.role === 'proposer' || row.role === 'responder' ? row.role : '';
  if (!partyId || !pictureId || !role || row.decision !== 'accept') return null;
  return { partyId, pictureId, role, decision: 'accept' };
}
