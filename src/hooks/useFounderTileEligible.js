/**
 * useFounderTileEligible.js — the NON-async slice of FounderTile's gating,
 * lifted into its own light module so a parent region can read it WITHOUT
 * eagerly pulling FounderTile's heavy deps (stripe, analytics) — the tile
 * itself stays lazy-loaded.
 *
 * Returns true when the recognition flag is on, the reader is a worldbuilder,
 * and the user is not already premium. FounderTile narrows further on the live
 * seats-remaining RPC, but that async check only ever REMOVES eligibility — so
 * a parent that uses this to pick its single primary CTA (P8 one-primary) is
 * correct in the common case. In the rare sold-out window the tile renders null
 * and the parent's (now-secondary) CTA still provides the upgrade path.
 *
 * ⭐ ROW O-16 — THE GATE CARRIES ITS EVIDENCE, IT DOES NOT ASSERT ENTITLEMENT.
 * This surface tells a reader that the Founders' Hall should know their name.
 * Until this car it decided that from a bare `audience === 'worldbuilder'`
 * string: the verdict travelled, the grounds did not, and nothing downstream —
 * the tile, its funnel events, a later audit of who was offered a chair — could
 * answer "on what evidence?". `founderRecognitionEvidence` below returns the
 * grounds with the verdict, in the typed vocabulary of
 * READER_AUDIENCE_REASONS plus its own withheld-by codes, so an offer and a
 * refusal are equally accountable.
 *
 * ⛔ TYPED BUCKETS, NEVER SENTENCES (FINITE-SEMANTICS): these codes are for
 * receipts, gates and analytics. Their reader-facing wording, if any is ever
 * wanted, is the owner's at the voice sitting.
 *
 * ⛔ AND THE EVIDENCE IS NOT A SECOND LADDER. Every threshold still lives in
 * `readerAudienceEvidence`; this module composes that verdict with the flag and
 * the tier and adds no rung of its own. FounderTile's own `eligible` and this
 * hook therefore cannot disagree about one reader, which is what the old
 * "kept in sync with FounderTile's own computation" note was asking two copies
 * of a boolean to promise by hand.
 */

import { useStore } from '../store/index.js';
import { useReaderAudienceEvidence } from './useReaderAudience.js';
import { flag } from '../lib/flags.js';

/**
 * Why a reader who is not offered a chair was not offered one. The gate is a
 * conjunction, so a refusal can carry more than one code.
 * @type {Readonly<Record<string, string>>}
 */
export const FOUNDER_RECOGNITION_WITHHELD = Object.freeze({
  RECOGNITION_FLAG_DARK: 'recognition_flag_dark',
  AUDIENCE_NOT_WORLDBUILDER: 'audience_not_worldbuilder',
  ALREADY_PREMIUM: 'already_premium',
});

/**
 * @typedef {Object} FounderRecognitionEvidence
 * @property {boolean} eligible
 * @property {string} audience the reader archetype the verdict rests on
 * @property {readonly string[]} earnedBy READER_AUDIENCE_REASONS codes, empty unless eligible
 * @property {readonly string[]} withheldBy FOUNDER_RECOGNITION_WITHHELD codes, empty when eligible
 */

/**
 * Pure composition of the recognition gate. Kept pure and exported so the
 * non-React callers (analytics tagging, a later audit of offers made) read the
 * same grounds the tile rendered from.
 *
 * @param {Object} input
 * @param {boolean} input.recognitionEnabled `flag('founderRecognition')`
 * @param {string} input.audience the archetype from `readerAudienceEvidence`
 * @param {readonly string[]} input.reasons its evidence codes
 * @param {string} input.tier the auth tier
 * @returns {FounderRecognitionEvidence}
 */
export function founderRecognitionEvidence({
  recognitionEnabled, audience, reasons = [], tier,
}) {
  const W = FOUNDER_RECOGNITION_WITHHELD;
  const withheldBy = [];
  if (!recognitionEnabled) withheldBy.push(W.RECOGNITION_FLAG_DARK);
  if (audience !== 'worldbuilder') withheldBy.push(W.AUDIENCE_NOT_WORLDBUILDER);
  if (tier === 'premium') withheldBy.push(W.ALREADY_PREMIUM);
  const eligible = withheldBy.length === 0;
  return Object.freeze({
    eligible,
    audience,
    earnedBy: Object.freeze(eligible ? [...reasons] : []),
    withheldBy: Object.freeze(withheldBy),
  });
}

/**
 * React hook — the recognition verdict WITH its grounds.
 * @returns {FounderRecognitionEvidence}
 */
export function useFounderRecognition() {
  const { audience, reasons } = useReaderAudienceEvidence();
  const tier = useStore(s => s.auth.tier);
  return founderRecognitionEvidence({
    recognitionEnabled: flag('founderRecognition'),
    audience,
    reasons,
    tier,
  });
}

/**
 * React hook — the verdict alone, for the P8 one-primary caller that only
 * branches on it.
 * @returns {boolean}
 */
export function useFounderTileEligible() {
  return useFounderRecognition().eligible;
}
