/**
 * domain/worldPulse/factionPairLedger.js — DEEP COUPLINGS D-7c THE FACTION-PAIR LEDGER
 * (owner-commissioned 2026-07-19, the positive-bond ruling; §14 Q10 signed off).
 *
 * THE ONE NEW PERSISTED SHAPE of this wave (owner-visible): a SYMMETRIC pairwise
 * sub-record carrying BOTH signs — resentment AND alliance/trust — plus a bounded set
 * of typed, decaying incidents. It is a SIBLING of the settlement plane, managed by the
 * faction layer and decayed on the same relax pass as factionStates (D5-band half-life,
 * the grudge/bond decay idiom — the decay physics are inherited for both signs, not
 * invented). ADDITIVE + ABSENT-WHEN-DARK (created only when memoryWeave is lit AND a
 * pair event fires) ⇒ NO WORLD_STATE_MIGRATIONS entry (law 12 — the additive-key rule).
 *
 * THE SHAPE (owner-visible):
 *   worldState.factionPairStates = {
 *     [pairKey]: {                    // pairKey = `${a}|${b}`, a/b codepoint-sorted (canonical)
 *       trust: 0..1,                  // the POSITIVE sign — standing-together, alliance affinity
 *       resentment: 0..1,             // the NEGATIVE sign — betrayal, rivalry
 *       incidents: [{ tick, type, sev }],  // ≤ 8, typed, decaying (the same wound/deed vocabulary)
 *       week: number,                 // last-update week (the decay anchor)
 *     }
 *   }
 *
 * PLACEMENT JUDGMENT (vetoable): the signed intent reads "pairwise sub-records under the
 * factionStates surface". A LITERAL nested key inside worldState.factionStates would be
 * iterated by ensure/prune/relax/seatNpcsIntoFactions (all keyed by faction id) and is
 * fragile. This lands it as a SIBLING top-level ledger `worldState.factionPairStates`,
 * managed by the same faction module and decayed by the same relax pass — the same
 * "surface" without the faction-id-iteration collision. Additive/no-migration either way.
 *
 * THE COALITION COUPLING is the follow-on (design §10.5, the census): FED BY coalition
 * betrayal (peaceTerms 'coalition_betrayal') / standing-together, and it FEEDS alliance
 * formation/durability. Both cross the settlement↔faction identity boundary and touch
 * war/coalition state; the census + the faction-identity resolution are flagged for the
 * fold. This leaf ships the shape + decay + the deposit/read API those wirings call.
 *
 * PURE / lazy worldPulse leaf: no store/React import, no clock, no rng.
 * @enforced-by tests/domain/factionPairLedger.test.js
 */
import { clamp01 } from '../../kernel/math.js';
import { compareCodepoint } from '../deterministicSort.js';

export const FACTION_PAIR_TUNING = Object.freeze({
  // D5-band half-life for both signs + incident severities (~3 years base, the grudge/bond clock).
  HALF_LIFE_WEEKS: 156,
  // The typed-incident ring is bounded (the recentIncidents ≤ 8 idiom).
  MAX_INCIDENTS: 8,
  // Prune a spent record: both signs below this AND no incidents ⇒ the pair key DROPS.
  PRUNE_EPSILON: 0.02,
});

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}
/** @param {unknown} v @param {number} d @returns {number} */
function num(v, d) {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
}
const round4 = (/** @type {number} */ v) => Math.round(v * 1e4) / 1e4;

/** The canonical (codepoint-sorted) pair key for two faction ids. @param {string} a @param {string} b @returns {string} */
export function factionPairKey(a, b) {
  const x = String(a); const y = String(b);
  return compareCodepoint(x, y) <= 0 ? `${x}|${y}` : `${y}|${x}`;
}

/** The pair record for (a, b), or null when absent. @param {any} worldState @param {string} a @param {string} b
 *  @returns {{ trust: number, resentment: number, incidents: Array<{tick:number,type:string,sev:number}>, week: number }|null} */
export function factionPairOf(worldState, a, b) {
  const ledger = asObject(asObject(worldState).factionPairStates);
  const rec = ledger[factionPairKey(a, b)];
  return rec ? /** @type {any} */ (rec) : null;
}

/**
 * Deposit a typed incident onto the (a, b) faction pair through THIS module's own writer —
 * bumping trust and/or resentment (bounded), appending the typed incident (ring ≤ MAX),
 * and stamping the update week. Returns a NEW worldState (never mutates). The caller has
 * gated on memoryWeaveActive ∧ its host flag; a missing pair id ⇒ a byte-safe no-op.
 * ONE event, one deposit — the pair plane's own consume of a settlement-plane event (law 5).
 * @param {any} worldState
 * @param {{ a: string, b: string, type: string, trustDelta?: number, resentmentDelta?: number, sev?: number, tick: number, weeks: number }} spec
 * @returns {any}
 */
export function mintFactionPairIncident(worldState, { a, b, type, trustDelta = 0, resentmentDelta = 0, sev = 0.3, tick, weeks }) {
  if (!a || !b || String(a) === String(b)) return worldState;
  const key = factionPairKey(a, b);
  const ledger = asObject(asObject(worldState).factionPairStates);
  const prior = asObject(ledger[key]);
  const incidents = Array.isArray(prior.incidents) ? /** @type {Array<any>} */ (prior.incidents) : [];
  const next = {
    trust: round4(clamp01(num(prior.trust, 0) + num(trustDelta, 0))),
    resentment: round4(clamp01(num(prior.resentment, 0) + num(resentmentDelta, 0))),
    incidents: [
      ...incidents.slice(-(FACTION_PAIR_TUNING.MAX_INCIDENTS - 1)),
      { tick: Math.floor(num(tick, 0)), type: String(type), sev: round4(clamp01(num(sev, 0.3))) },
    ],
    week: Math.floor(num(weeks, 0)),
  };
  return { ...worldState, factionPairStates: { ...ledger, [key]: next } };
}

/** Half-life decay of a scalar over elapsed weeks (the decayMark idiom; bandMult 1 = base). */
function decayScalar(/** @type {number} */ v, /** @type {number} */ deltaWeeks, /** @type {number} */ bandMult) {
  if (!(v > 0) || !(deltaWeeks > 0)) return v;
  if (!Number.isFinite(bandMult)) return v; // undying ⇒ never fades
  return v * Math.pow(0.5, deltaWeeks / Math.max(1, FACTION_PAIR_TUNING.HALF_LIFE_WEEKS * bandMult));
}

/**
 * Decay every faction pair's BOTH signs + incident severities on the D5-band half-life,
 * pruning spent incidents and DROPPING a fully-spent pair (drop-when-empty). Runs on the
 * relax pass (factionCompetition.relaxFactionStates). ABSENT factionPairStates ⇒ a byte-safe
 * no-op (the dormancy path — no key when memoryWeave never lit a pair). Pure.
 * @param {any} worldState @param {number} weeks the current week (decay anchor)
 * @param {number} [bandMult] the memory-horizon band multiplier (default 1 = base)
 * @returns {any}
 */
export function decayFactionPairStates(worldState, weeks, bandMult = 1) {
  const ledger = asObject(asObject(worldState).factionPairStates);
  const keys = Object.keys(ledger);
  if (!keys.length) return worldState;
  const T = FACTION_PAIR_TUNING;
  const now = Math.floor(num(weeks, 0));
  /** @type {Record<string, unknown>} */
  const next = {};
  let changed = false;
  for (const key of keys.sort(compareCodepoint)) {
    const rec = asObject(ledger[key]);
    const dw = Math.max(0, now - Math.floor(num(rec.week, now)));
    const trust = round4(decayScalar(clamp01(num(rec.trust, 0)), dw, bandMult));
    const resentment = round4(decayScalar(clamp01(num(rec.resentment, 0)), dw, bandMult));
    const rawInc = Array.isArray(rec.incidents) ? /** @type {Array<any>} */ (rec.incidents) : [];
    const incidents = rawInc
      .map((i) => ({ tick: Math.floor(num(i?.tick, 0)), type: String(i?.type || ''), sev: round4(decayScalar(clamp01(num(i?.sev, 0)), Math.max(0, now - Math.floor(num(i?.tick, now))), bandMult)) }))
      .filter((i) => i.sev >= T.PRUNE_EPSILON);
    if (trust < T.PRUNE_EPSILON && resentment < T.PRUNE_EPSILON && incidents.length === 0) { changed = true; continue; } // drop
    next[key] = { trust, resentment, incidents, week: now };
    if (trust !== num(rec.trust, 0) || resentment !== num(rec.resentment, 0) || incidents.length !== rawInc.length) changed = true;
  }
  if (!changed && Object.keys(next).length === keys.length) return worldState;
  if (!Object.keys(next).length) {
    const rest = { ...worldState };
    delete (/** @type {any} */ (rest)).factionPairStates;
    return rest;
  }
  return { ...worldState, factionPairStates: next };
}
