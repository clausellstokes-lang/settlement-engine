/**
 * roads/embassyLedger.js — THE EMBASSY SUIT DEPOSIT-AND-CONSUME SHAPE (ENGINE LIFT #5;
 * DESIGN_THE_ROADS.md §11b R-8). The SINGLE shared module for the roadsEmbassies ledger: the
 * roads mover (the single writer, law 6) DEPOSITS a heard peace suit here; the war system's
 * sue_for_peace weight CONSUMES it through this reader — deposit-and-consume, roads NEVER
 * writes war state (the returned-captive-channel precedent, §10).
 *
 * WHY A SEPARATE MULTIPLIER, NOT A TYPED PEACE-REASON: the peace/war reason registries are a
 * STRICT WAR↔PEACE bijection (REASON_MIRRORS; warReasons.test.js pins equal lengths), so a new
 * typed peace reason would force a SYNTHETIC war-side mirror — not the "minimal consumption
 * limb" the brief mandates. This reader is a bounded, gated multiplier on the EXISTING
 * sue_for_peace weight instead: ×1 EXACTLY when roads is dark / no suit stands for the pair ⇒
 * byte-identical (the war goldens never move). The embassy's causal RECEIPT rides the roads
 * news beat + this ledger record; the peace WEIGHT rides this multiplier.
 *
 * A PURE leaf: imports only the ledger accessor + the roads dials. Deterministic, total.
 *
 * @enforced-by tests/domain/roadsEmbassy.test.js
 */
import { getSpatialLedger, setSpatialLedger, dropSpatialLedger } from '../spatial/distanceRead.js';
import { ROADS_TUNING, asObject, num, clamp01, cmp } from './state.js';

/** The roads-owned spatial ledger the embassy suit rides (drop-when-empty; roads-written). */
export const EMBASSY_LEDGER_KEY = 'roadsEmbassies';

/** Sort an object's keys codepoint-stably (byte-stable ledger serialization). Pure.
 *  @param {Record<string, unknown>} obj @returns {Record<string, unknown>} */
function sortKeys(obj) {
  /** @type {Record<string, unknown>} */
  const out = {};
  for (const k of Object.keys(obj).sort(cmp)) out[k] = obj[k];
  return out;
}

/**
 * Persist the embassy suit ledger (§11b): carry the live (un-expired) prior suits + append this
 * tick's heard suits; drop-when-empty. Pure code motion from the roads mover — byte-identical.
 * @param {Record<string, unknown>} worldState
 * @param {Array<{ homeId: string, destId: string, venue: string, envoyWeight01: number, amplifier: number, intensity01: number }>} deposits
 * @param {{ weekClock: number, now2: number }} ctx
 * @returns {{ worldState: Record<string, unknown>, changed: boolean }}
 */
export function persistEmbassySuits(worldState, deposits, ctx) {
  const priorEmbassies = asObject(getSpatialLedger(worldState, EMBASSY_LEDGER_KEY));
  const list = Array.isArray(deposits) ? deposits : [];
  if (!Object.keys(priorEmbassies).length && !list.length) return { worldState, changed: false };
  /** @type {Record<string, unknown>} */
  const nextEmbassies = {};
  for (const key of Object.keys(priorEmbassies).sort(cmp)) {
    const e = asObject(priorEmbassies[key]);
    if (num(e.expiresTick, 0) > ctx.weekClock) nextEmbassies[key] = e; // still standing
  }
  for (const d of list) {
    nextEmbassies[embassyPairKey(d.homeId, d.destId)] = {
      homeId: d.homeId, destId: d.destId, venue: d.venue, envoyWeight01: d.envoyWeight01,
      amplifier: d.amplifier, intensity01: d.intensity01, tick: ctx.now2,
      expiresTick: ctx.weekClock + ROADS_TUNING.EMBASSY_SUIT_TTL_WEEKS,
    };
  }
  const prevEmb = JSON.stringify(Object.keys(priorEmbassies).length ? priorEmbassies : null);
  const nextEmb = JSON.stringify(Object.keys(nextEmbassies).length ? sortKeys(nextEmbassies) : null);
  if (prevEmb === nextEmb) return { worldState, changed: false };
  const ws = Object.keys(nextEmbassies).length
    ? setSpatialLedger(worldState, EMBASSY_LEDGER_KEY, sortKeys(nextEmbassies))
    : dropSpatialLedger(worldState, EMBASSY_LEDGER_KEY);
  return { worldState: ws, changed: true };
}

/** The directed suing-pair key `${party}>${foe}` (party sued foe for peace). Pure.
 *  @param {string} party @param {string} foe @returns {string} */
export function embassyPairKey(party, foe) {
  return `${String(party)}>${String(foe)}`;
}

/** The week clock a suit's expiry is stamped/read against (calendar weeks, tick fallback). Pure.
 *  @param {unknown} worldState @returns {number} */
function weekClockOf(worldState) {
  return num(asObject(asObject(worldState).calendar).elapsedWeeks, num(asObject(worldState).tick, 0));
}

/**
 * The bounded peace-weight MULTIPLIER the war system's sue_for_peace move consumes: the
 * strongest LIVE (un-expired) suit `party` walked to any of `foes`. Returns 1 EXACTLY when the
 * roadsEmbassies ledger is absent / holds no live suit for the pair ⇒ byte-identical dormant.
 * Bounded ≤ ×(1 + EMBASSY_PEACE_W). Pure, total.
 * @param {unknown} worldState @param {string} party @param {string[]} foes
 * @returns {number}
 */
export function embassySuitPeaceMult(worldState, party, foes) {
  const ledger = asObject(getSpatialLedger(/** @type {never} */ (worldState), EMBASSY_LEDGER_KEY));
  if (!Object.keys(ledger).length) return 1;
  const now = weekClockOf(worldState);
  const list = Array.isArray(foes) ? foes : [];
  let best = 0;
  for (const foe of list) {
    const rec = asObject(ledger[embassyPairKey(party, foe)]);
    if (!rec || rec.intensity01 == null) continue;
    const expires = rec.expiresTick == null ? Infinity : num(rec.expiresTick, 0);
    if (expires <= now) continue; // the suit has lapsed
    const intensity = clamp01(num(rec.intensity01, 0));
    if (intensity > best) best = intensity;
  }
  return best > 0 ? 1 + ROADS_TUNING.EMBASSY_PEACE_W * best : 1;
}
