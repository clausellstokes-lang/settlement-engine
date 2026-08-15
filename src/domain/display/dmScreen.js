/**
 * domain/display/dmScreen.js — V-18 THE DM SCREEN: the audience gate.
 *
 * The DM screen has two faces. The DM face shows everything; the PLAYER face is
 * the settlement as the table may see it — secrets stripped. It reuses the
 * EXISTING player-safe projection (toPublicSafe: a top-level ALLOWLIST plus a
 * value-level covert:true drop), so the player face FAILS CLOSED by construction:
 * a new DM-private field on a settlement leaks nothing, because it is not on the
 * allowlist and never reaches the player projection. This is the same machinery
 * the gallery/player-export uses (the V-11 pin), not a parallel redaction.
 */
import { toPublicSafe } from './publicSafe.js';

/** The two faces of the screen. */
export const SCREEN_AUDIENCES = Object.freeze(['dm', 'player']);

/**
 * Project a settlement for a screen audience. 'dm' shows the full settlement;
 * 'player' returns the player-safe projection (fails closed). Any unknown
 * audience is treated as 'player' — the safe default (never leak on a typo).
 * @param {Record<string, unknown>} settlement
 * @param {string} audience  'dm' | 'player'
 * @returns {Record<string, unknown>}
 */
export function toScreenView(settlement, audience) {
  if (audience === 'dm') return settlement || {};
  return toPublicSafe(settlement, { full: false });
}

/** True iff the audience is the DM (the only face that may see secrets).
 * @param {string} audience @returns {boolean} */
export function isDmAudience(audience) {
  return audience === 'dm';
}
