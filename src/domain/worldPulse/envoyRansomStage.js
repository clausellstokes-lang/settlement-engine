/**
 * envoyRansomStage.js — WR-7d's ransom stage, over WR-7b's hold ledger.
 *
 * `ransomClaim.js` holds the arithmetic; this leaf is the only place it meets a
 * live pulse. The shape is the WR-7b/WR-7c one: `envoyPulse.js` composes, the
 * stage sequences, and no ledger is written here.
 *
 * THE ARC, in the order amendment O gives it:
 *
 *   THE HOLD IS THE CLOCK.  Every open foreign-guest hold is read through
 *     `ransomDwellRead`, whose only authority is `heldSinceTick`. There is no
 *     second clock and no stored dwell. An unreadable hold shuts the gate
 *     rather than guessing it open, because a price on a person nobody can
 *     prove is held is not a ransom, it is an invention.
 *
 *   THE CLAIM RIDES THE I2 SHAPE.  `mintRansomClaim` adds a `subject` naming
 *     WHO is being paid for and mints no new claim vocabulary, because a ransom
 *     IS a reparations claim — what is novel is that the thing owed for is a
 *     man rather than a season of war. The debtor is the man's OWN home, never
 *     the enemy: the realm that sent him is the only party who can buy him back.
 *
 *   BOTH HALVES TRAVEL, AND AS A PAIR.  `ransomMessageLegs` prices the demand
 *     and the answer together through the ONE named-person transit kernel under
 *     law M. Minting the demand leg without the answer leg would be a court
 *     that hears instantly, so the producer refuses to mint one alone and this
 *     stage never asks it to.
 *
 * WHAT THE CAPTOR BELIEVES A MAN IS WORTH is read off the errand he was taken
 * from, and off nothing else. A terms-bearing envoy is the richer target — the
 * war volume says so at K.5 — so a captive carrying a sheet prices as a
 * PRINCIPAL, a full embassy as NOTABLE, and anyone else as COMMON. This is the
 * captor's belief about a person, not a truth-read of that person's worth, and
 * there is no world-state argument in the derivation through which one could
 * become the other.
 *
 * NOTHING IS PERSISTED HERE, AND THAT IS AN OWNER GATE, NOT AN OVERSIGHT. A
 * ransom claim is new persistent state, and persistence shape is owner-gated in
 * this estate. The stage therefore RETURNS its claims and their priced legs for
 * the pulse to hand back; the slice that persists them lands under an explicit
 * ruling on the ledger key and its lifecycle (regen, undo, import, and the
 * death path that must close an open claim). Until then the arc is computed,
 * receipted, and provably reachable — and writes nothing.
 */

import { foreignGuestHoldsOf } from './foreignGuestHold.js';
import {
  RANSOM_WORTH_BANDS,
  mintRansomClaim,
  ransomAgainstSilence,
  ransomDwellRead,
  ransomMessageLegs,
} from './ransomClaim.js';
import { envoyErrandsOf } from './envoyErrand.js';

/** @param {unknown} value @returns {Record<string, unknown>} */
function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/** @param {unknown} value @returns {number | null} */
function wholeTick(value) {
  return Number.isInteger(value) && Number(value) >= 0 ? Number(value) : null;
}

/**
 * THE CAPTOR'S BELIEF ABOUT A MAN, from the errand he was taken from.
 *
 * Like CR-WIRE-A's power band, the enforcement is the signature: one argument,
 * an errand row, and no world through which a real importance could enter.
 *
 * @param {unknown} errand @returns {string} a closed worth band
 */
export function ransomWorthBandFromErrand(errand) {
  const row = asObject(errand);
  if (asObject(row.termSheet).id) return RANSOM_WORTH_BANDS[2];
  return text(row.purpose) === 'sue' ? RANSOM_WORTH_BANDS[1] : RANSOM_WORTH_BANDS[0];
}

/**
 * THE STAGE. Every open hold is read; every hold whose dwell has matured mints
 * a claim against the captive's own home and prices both message legs as a pair.
 *
 * A hold whose errand the ledger cannot produce is SKIPPED rather than priced
 * from defaults: the errand names the man's home and what he was carrying, and
 * a ransom demand addressed to a home nobody can name is not a demand.
 *
 * @param {{worldState?:unknown, tick?:unknown}} args
 * @returns {{claims:Array<Record<string, unknown>>, skipped:Array<Record<string, unknown>>}}
 */
export function openRansomClaims({ worldState, tick } = {}) {
  /** @type {Array<Record<string, unknown>>} */
  const claims = [];
  /** @type {Array<Record<string, unknown>>} */
  const skipped = [];
  const now = wholeTick(tick);
  if (now == null) return { claims, skipped };
  // `foreignGuestHoldsOf` returns a normalized ARRAY of rows, not a map keyed
  // by person. Reading it as a map yields an empty census that greens every
  // absence pin while pricing nothing — the vacuity this estate has been bitten
  // by before, and the reason the reachability pin below asserts a claim first.
  const rows = foreignGuestHoldsOf(worldState);
  const holds = (Array.isArray(rows) ? rows : []).map(asObject);
  if (holds.length === 0) return { claims, skipped };
  const errands = envoyErrandsOf(worldState).map(asObject);
  /** @type {Map<string, Record<string, unknown>>} */
  const byId = new Map(errands.map((row) => [text(row.id), row]));

  for (const hold of [...holds].sort((left, right) => (
    text(left.npcId) < text(right.npcId) ? -1 : text(left.npcId) > text(right.npcId) ? 1 : 0
  ))) {
    const dwell = ransomDwellRead({ hold, tick: now });
    const errand = byId.get(text(hold.errandId)) || null;
    if (!dwell.open || !errand) {
      // Both refusals are first-class and both are receipted: a hold too fresh
      // to price is the ordinary case, and it must not look like a failure.
      skipped.push({
        npcId: text(hold.npcId),
        errandId: text(hold.errandId),
        reason: errand ? dwell.reason : 'unreadable_errand',
        dwellTicks: Number(dwell.dwellTicks),
        band: String(dwell.band),
      });
      continue;
    }
    const homeId = text(errand.from);
    const worthBand = ransomWorthBandFromErrand(errand);
    const minted = mintRansomClaim({ hold, tick: now, homeId, worthBand });
    if (!minted.claim) {
      skipped.push({
        npcId: text(hold.npcId),
        errandId: text(hold.errandId),
        reason: String(minted.reason),
        dwellTicks: Number(dwell.dwellTicks),
        band: String(dwell.band),
      });
      continue;
    }
    // BOTH LEGS OR NEITHER. The venue is where the man is actually held, so the
    // demand rides from his prison and the answer rides back to it.
    const legs = ransomMessageLegs({
      claim: minted.claim,
      departTick: now,
      venueId: text(hold.venueId) || text(hold.captorId),
    });
    if (legs.minted !== true) {
      skipped.push({
        npcId: text(hold.npcId),
        errandId: text(hold.errandId),
        reason: String(legs.reason),
        dwellTicks: Number(dwell.dwellTicks),
        band: String(dwell.band),
      });
      continue;
    }
    claims.push({
      npcId: text(hold.npcId),
      errandId: text(hold.errandId),
      captorId: text(hold.captorId),
      homeId,
      worthBand,
      dwellBand: String(dwell.band),
      dwellTicks: Number(dwell.dwellTicks),
      claim: minted.claim,
      demandLeg: legs.demandLeg,
      answerLeg: legs.answerLeg,
      answerDueTick: legs.answerDueTick,
    });
  }
  return { claims, skipped };
}

/**
 * K.7 read against a home court's own silence window. Exposed here so the pulse
 * composes ONE ransom surface rather than two, and re-exported rather than
 * re-implemented so there is no second spelling of the three shapes.
 */
export { ransomAgainstSilence };
