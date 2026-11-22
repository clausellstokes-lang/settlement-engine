/**
 * roads/knownWorld.js — THE KNOWN PICTURE (ENGINE LIFT #5; DESIGN_THE_ROADS.md §5). Slice
 * R-2a.
 *
 * THE KNOWN-vs-TRUE LAW (§1 law 4): dispatch + routing read the faction's KNOWN picture
 * (rumorLedgers + beliefMaps + infoMode); every OUTCOME roll reads TRUTH. Omniscient infoMode
 * ⇒ known ≡ true (nobody walks into a known army). The known view is a PURE PROJECTION —
 * never persisted.
 *
 * knownEmbattlementView(worldState, observerId) returns a MINIMAL synthetic worldState
 * `{ spatialLedgers: { embattlement: believedLevels } }` that the EXISTING route scorer
 * (embattlement.js chooseRoute/scoreRoute) reads unchanged — so the roads fork ZERO route
 * logic. It reduces to the REAL worldState (known ≡ true, zero allocation) when beliefs are
 * dormant (omniscient infoMode OR no spatial canon — the beliefsActive seam).
 *
 * SILENCE DECAYS TOWARD CALM (§5): a danger rumour's believed weight decays linearly with
 * age, reaching calm (0) after SILENCE_CALM_WEEKS; a region the observer has heard NOTHING
 * about is ASSUMED safe (absent ⇒ level 0). This single rule is what walks a poorly-informed
 * faction's envoy into an army it didn't know about (the §19 stale-intel proof).
 *
 * JUDGMENT (vetoable): v1 derives believed danger from the observer's DANGER RUMOURS
 * (rumorLedgers, decayed by freshness × magnitude). The belief()-strength/relationship blend
 * named in §5 is a recorded refinement — the rumour-decay signal is the load-bearing "walks
 * into an unknown army" mechanism, and folding the strength band in is additive tuning that
 * does not change the routing contract. Say "veto" to fold the belief blend in now.
 *
 * A PURE leaf — imports only beliefsActive + the ledger accessor + the roads dials.
 *
 * @enforced-by tests/domain/roadsKnownWorld.test.js
 */
import { beliefsActive } from '../worldPulse/beliefMap.js';
import { getSpatialLedger } from '../spatial/distanceRead.js';
import { ROADS_TUNING, asObject, num, clamp01 } from './state.js';

// The DANGER-kind allowlist is a substring predicate over content.what (impactKind tokens):
// there is no closed rumour-kind enum, so we match the war/siege/occupation/calamity/army
// family robustly (WAR_STRESSOR_TYPES + the strategy/battle/blockade/coup tokens).
const DANGER_SUBSTRINGS = Object.freeze([
  'war', 'siege', 'occup', 'battle', 'conquest', 'calamit', 'plague',
  'blockade', 'mobiliz', 'deploy', 'betray', 'coup', 'raid', 'bandit',
]);
/** @param {unknown} what @returns {boolean} */
function isDangerWhat(what) {
  const w = String(what || '').toLowerCase();
  // 'occupation_lifted' / 'siege_lifted' / 'blockade_lifted' are RELIEF, not danger.
  if (w.includes('_lifted') || w.includes('lifted')) return false;
  return DANGER_SUBSTRINGS.some((s) => w.includes(s));
}

/**
 * The observer's BELIEVED embattlement overlay (a minimal synthetic worldState). Omniscient
 * / aspatial ⇒ the real worldState (known ≡ true). Otherwise a decay-weighted fold of the
 * observer's danger rumours, keyed by every settlement each rumour implicates; silence ⇒
 * absent ⇒ calm. Pure, total.
 * @param {Record<string, unknown>} worldState
 * @param {string} observerId
 * @returns {Record<string, unknown>}
 */
export function knownEmbattlementView(worldState, observerId) {
  // The beliefsActive seam: dormant (omniscient OR no spatial marker) ⇒ known ≡ true.
  if (!beliefsActive(worldState)) return worldState;
  const now = Math.max(0, Math.floor(num(asObject(worldState).tick, 0)));
  const ledgers = asObject(getSpatialLedger(worldState, 'rumorLedgers'));
  const ledger = asObject(ledgers[String(observerId)]);
  const silence = Math.max(1, ROADS_TUNING.SILENCE_CALM_WEEKS);
  /** @type {Record<string, { level: number, phase: string, sinceTick: number, lastTick: number }>} */
  const believed = {};
  for (const key of Object.keys(ledger)) {
    const rec = asObject(ledger[key]);
    const arrivalTick = num(rec.arrivalTick, 0);
    if (arrivalTick > now) continue; // still in transit — not yet known
    const content = asObject(rec.content);
    if (!isDangerWhat(content.what)) continue;
    const age = now - arrivalTick;
    const decay = Math.max(0, 1 - age / silence); // SILENCE DECAYS TOWARD CALM
    if (decay <= 0) continue;
    const magnitude01 = clamp01(num(content.magnitude, 0) / 3); // severity band 0..3
    const level = clamp01(magnitude01 * decay);
    if (level <= 0) continue;
    // Every settlement the rumour implicates carries the believed danger.
    const where = new Set([String(content.whereId || '')]);
    if (Array.isArray(content.partyIds)) for (const p of content.partyIds) where.add(String(p));
    for (const sid of where) {
      if (!sid) continue;
      const prev = believed[sid] ? believed[sid].level : 0;
      if (level > prev) {
        believed[sid] = {
          level,
          phase: level >= ROADS_TUNING.EMBATTLED_THRESHOLD ? 'embattled' : 'calm',
          sinceTick: arrivalTick,
          lastTick: now,
        };
      }
    }
  }
  return { spatialLedgers: { embattlement: believed } };
}
