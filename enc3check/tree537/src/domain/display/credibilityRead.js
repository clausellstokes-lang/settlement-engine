/**
 * domain/display/credibilityRead.js — the CREDIBILITY read-model sibling
 * (domain-display-readmodels-4, residue). W-DOCTRINE-2's Blainey credibility stock
 * (spatialLedgers.credibility) — the signed, people-held reputation that discounts
 * a settlement's claims — had no display consumer. This is its DM-readable
 * projection, on the settlementPestilence pattern.
 *
 *   • THE DM TRUTH SEAM (includeGroundTruth, default false): adds a `truth` block
 *     with the raw signed score + weight + discount for the DM.
 *
 * Reads through the SAME engine helpers the sim uses (credibilityScoreOf /
 * credibilityWeight / credibilityDiscount) so the band can never drift from the
 * mechanic — never a re-derivation.
 *
 * PRESENTATION ONLY. Pure; no store, no rng, no wall clock; INERT-NOT-CRASH on
 * absent/garbage ledgers; every list codepoint-sorted. Lazy-only leaf so it is
 * byte-inert to the engine and its goldens.
 */

import { compareCodepoint } from '../deterministicSort.js';
import { getSpatialLedger, hasSpatialLedger } from '../spatial/distanceRead.js';
import { credibilityScoreOf, credibilityWeight, credibilityDiscount, CREDIBILITY_TUNING } from '../worldPulse/informationStatecraft.js';

const BAND_WORDS = Object.freeze(['discredited', 'doubted', 'trusted', 'unimpeachable']);

/**
 * Signed score → a reputation band 0..3 (discredited → unimpeachable), scaled to
 * the mechanic's ±SCORE_MAX so the band tracks re-tunes.
 * @param {number} score @returns {number}
 */
export function credibilityBand(score) {
  const max = CREDIBILITY_TUNING?.SCORE_MAX || 12;
  const s = typeof score === 'number' && Number.isFinite(score) ? score : 0;
  const frac = s / max; // -1..1
  if (frac >= 0.66) return 3;
  if (frac >= 0.12) return 2;
  if (frac <= -0.4) return 0;
  return 1;
}

/** @param {number} band @param {number} score */
function presenceFor(band, score) {
  if (band >= 3) return "The settlement's word is taken as gospel — its claims are believed on their face.";
  if (band === 2) return 'The settlement has earned a name for straight dealing; its word carries weight.';
  if (band === 0) return `The settlement has been caught out too often — its claims are heavily discounted${score < 0 ? ', believed at a fraction of their face' : ''}.`;
  return 'The settlement is neither especially trusted nor doubted; its word is weighed on its merits.';
}

/**
 * The credibility fiction for ONE settlement, or null when it carries no
 * credibility record. Pure; inert on absent/garbage ledgers.
 * @param {Object} args
 * @param {unknown} args.worldState
 * @param {unknown} args.settlementId
 * @param {number} [args.tick]  the current tick (for generational decay of the stock).
 * @param {boolean} [args.includeGroundTruth]  DM surfaces ⇒ true (raw truth block).
 * @returns {Record<string, unknown> | null}
 */
export function settlementCredibility({ worldState, settlementId, tick = 0, includeGroundTruth = false } = /** @type {never} */ ({})) {
  if (settlementId == null) return null;
  const ws = /** @type {Record<string, unknown>} */ (worldState);
  if (!hasSpatialLedger(ws, 'credibility')) return null;
  const ledger = /** @type {Record<string, unknown> | null} */ (getSpatialLedger(ws, 'credibility'));
  if (!ledger || !(String(settlementId) in ledger)) return null;
  const score = credibilityScoreOf(ws, String(settlementId), Number(tick) || 0);
  const band = credibilityBand(score);
  /** @type {Record<string, unknown>} */
  const out = {
    settlementId: String(settlementId),
    band,
    reputation: BAND_WORDS[band],
    presence: presenceFor(band, score),
  };
  if (includeGroundTruth) {
    out.truth = {
      score,
      weight: credibilityWeight(score),
      discount: credibilityDiscount(score),
    };
  }
  return out;
}

/**
 * The realm-wide credibility view: every settlement carrying a credibility record,
 * ordered codepoint on id. Dormant ⇒ [].
 * @param {Object} args
 * @param {unknown} args.worldState
 * @param {number} [args.tick]
 * @param {boolean} [args.includeGroundTruth]
 * @param {(id: string) => string} [args.nameFor]
 * @returns {Array<Record<string, unknown>>}
 */
export function realmCredibility({ worldState, tick = 0, includeGroundTruth = false, nameFor = (id) => String(id) } = /** @type {never} */ ({})) {
  const ws = /** @type {Record<string, unknown>} */ (worldState);
  if (!hasSpatialLedger(ws, 'credibility')) return [];
  const ledger = /** @type {Record<string, unknown> | null} */ (getSpatialLedger(ws, 'credibility'));
  if (!ledger) return [];
  const ids = Object.keys(ledger).sort(compareCodepoint);
  /** @type {Array<Record<string, unknown>>} */
  const out = [];
  for (const id of ids) {
    const projection = settlementCredibility({ worldState, settlementId: id, tick, includeGroundTruth });
    if (projection) out.push({ ...projection, where: nameFor(id) });
  }
  return out;
}

/**
 * Panel presence gate: does this world carry ANY credibility record? Dormant
 * (dropped-when-empty) ⇒ false ⇒ no surface ⇒ byte-identical.
 * @param {unknown} worldState @returns {boolean}
 */
export function hasCredibility(worldState) {
  const ws = /** @type {Record<string, unknown>} */ (worldState);
  if (!hasSpatialLedger(ws, 'credibility')) return false;
  const ledger = /** @type {Record<string, unknown> | null} */ (getSpatialLedger(ws, 'credibility'));
  return !!ledger && Object.keys(ledger).length > 0;
}

/**
 * The campaign/save-scoped presence gate (mirrors campaignHasEpidemic).
 * @param {Array<{ settlementIds?: Array<string | number>, worldState?: unknown } | null> | null | undefined} campaigns
 * @param {unknown} saveId @returns {boolean}
 */
export function campaignHasCredibility(campaigns, saveId) {
  if (saveId == null || !Array.isArray(campaigns)) return false;
  const sid = String(saveId);
  return campaigns.some((campaign) => campaign
    && (campaign.settlementIds || []).map(String).includes(sid)
    && hasCredibility(campaign.worldState));
}
