/**
 * envoyErrand/ledger — the ONE function that writes `worldState.envoyErrands`, and the
 * episode reads that decide whether a write is even allowed.
 *
 * A LEAF OF THE ENVOY-ERRAND WRITER FAMILY (ruling R-BLD-4). Collecting `writeErrands`
 * here makes the single-writer law STRONGER than it was as one large file, not weaker:
 * the top-level ledger key is now assigned in exactly one function, in one file, and every
 * family member — the head, the encounter writer — reaches the world through it.
 *
 *   THE WRITE — `writeErrands` normalizes BOTH sides, returns the caller's own world by
 *     reference when nothing moved (law 5's change-detector rule: a no-op may not mint a
 *     fresh object), and DELETES the top-level key rather than persisting an empty array.
 *   THE EPISODE READS — `envoyErrandForOffer` and its two predicates. They share
 *     `isActiveErrand` on purpose: a consumer that copied the active-state vocabulary
 *     would eventually disagree with this file about whether a parlay still owns the
 *     traveller, and the disagreement would show up as a duplicate envoy.
 *
 * K3 (NOBODY IS EVER CURRENT): the reach is the vocabulary, the offer leaf and the record
 * shapes. This leaf reads the ledger key and nothing else about the world.
 *
 * PURE: no Date, no Math.random, no store, no React, no I/O, no in-place mutation.
 *
 * @enforced-by tests/domain/envoyErrand.test.js
 */
import {
  ACTIVE_STATES,
  ENVOY_ERRAND_LEDGER_KEY,
  asObject,
  text,
} from './envoyErrandVocabulary.js';
import {
  envoyOfferEpisodeKey,
  normalizeEnvoyPeaceOffer,
  sameEnvoyOffer,
} from './envoyErrandOffer.js';
import { envoyErrandsOf, normalizeEnvoyErrands } from './envoyErrandRecords.js';

/** Write a normalized array, dropping the top-level key when empty. */
export function writeErrands(worldState, nextValue) {
  const state = asObject(worldState);
  const prior = normalizeEnvoyErrands(state[ENVOY_ERRAND_LEDGER_KEY]);
  const next = normalizeEnvoyErrands(nextValue);
  if (JSON.stringify(prior) === JSON.stringify(next)) return worldState;
  if (!next.length) {
    const out = { ...state };
    delete out[ENVOY_ERRAND_LEDGER_KEY];
    return out;
  }
  return { ...state, [ENVOY_ERRAND_LEDGER_KEY]: next };
}

/** @param {Array<Record<string, unknown>>} errands @param {string} id */
export function errandIndex(errands, id) {
  return errands.findIndex((errand) => errand.id === id);
}

/** @param {Record<string, unknown>} errand */
export function isActiveErrand(errand) {
  return ACTIVE_STATES.has(String(errand.state));
}

/**
 * Is there already a live or archived answer to this exact offer episode?
 * Consumers use this after a proposal becomes terminal so a still-travelling
 * envoy replaces the proposal queue's former duplicate-suppression service.
 */
export function envoyErrandForOffer(worldState, rawOffer) {
  const offer = normalizeEnvoyPeaceOffer(rawOffer);
  const episode = envoyOfferEpisodeKey(rawOffer);
  if (!offer || !episode) return null;
  const errands = envoyErrandsOf(worldState);
  const exact = errands.find((errand) => sameEnvoyOffer(errand.offer, offer));
  if (exact) return exact;
  return errands.find((errand) => isActiveErrand(errand)
    && envoyOfferEpisodeKey(errand.offer) === episode) || null;
}

/** Exact active-episode hold used by candidate/proposal duplicate suppression. */
export function hasActiveEnvoyForOffer(worldState, rawOffer) {
  const episode = envoyOfferEpisodeKey(rawOffer);
  return !!(episode && envoyErrandsOf(worldState).some((errand) => (
    isActiveErrand(errand) && envoyOfferEpisodeKey(errand.offer) === episode
  )));
}

/**
 * Does this durable person already belong to a live envoy lifecycle?
 *
 * This read deliberately lives beside `isActiveErrand`: consumers must not copy the
 * active-state vocabulary and eventually disagree about whether a parlay still owns
 * the traveller. Terminal archive rows do not reserve the person; once home or lost,
 * another ruling may give them a new life.
 */
export function hasActiveEnvoyForNpc(worldState, npcId) {
  const personId = text(npcId);
  return !!(personId && envoyErrandsOf(worldState).some((errand) => (
    errand.npcId === personId && isActiveErrand(errand)
  )));
}

export function replaceErrand(worldState, errands, index, nextErrand) {
  const next = [...errands];
  next[index] = nextErrand;
  return writeErrands(worldState, next);
}
