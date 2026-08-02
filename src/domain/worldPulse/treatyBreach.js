/**
 * domain/worldPulse/treatyBreach.js — WR-0c: DELIBERATE TREATY BREACH.
 *
 * A public repudiation is a first-class realm act, not an accidental compliance
 * roll. It is deterministic and approval-routed by the realm verb lane. On
 * apply, the breaker defaults every still-live promise in the treaty at once;
 * the broken shell remains legible until the promises' original horizon so the
 * standing treaty_default scorer can read the casus without any parallel seam.
 */

import { getSpatialLedger, setSpatialLedger } from '../spatial/distanceRead.js';
import { advanceDispositionChannels } from './dispositionLedger.js';
import { peaceCausalActive } from './warReasons.js';

/** @typedef {Record<string, unknown>} Mut */
/** @typedef {Record<string, Mut>} TreatyLedger */

export const TREATY_REPUDIATION_TYPE = 'repudiation';

/** @param {unknown} v @returns {Mut} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Mut} */ (v) : {};
}

/** @param {string} a @param {string} b */
function codepoint(a, b) { return a < b ? -1 : a > b ? 1 : 0; }

/** @param {unknown} value @returns {number|null} */
function finiteTick(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

/** @param {Mut} treaty @param {string} a @param {string} b */
function hasParties(treaty, a, b) {
  const parties = Array.isArray(treaty.parties) ? treaty.parties.map(String) : [];
  return parties.includes(a) && parties.includes(b);
}

/** @param {Mut} term @param {number} tick */
function isLiveTerm(term, tick) {
  const expires = finiteTick(term.expiresTick);
  return expires != null && tick < expires;
}

/** @param {Mut} treaty @param {number} tick */
function isRepudiableTreaty(treaty, tick) {
  if (String(treaty.complianceState || '') === 'defaulted') return false;
  if (String(treaty.breachType || '') === TREATY_REPUDIATION_TYPE) return false;
  const terms = Array.isArray(treaty.terms) ? treaty.terms.map(asObject) : [];
  return terms.some(term => term.type === 'non_aggression' && isLiveTerm(term, tick));
}

/**
 * Every directed party choice that can repudiate a live non-aggression pact.
 * Both parties are returned as possible breakers; duplicates are collapsed and
 * ordering is codepoint-stable for the composer.
 * @param {Record<string, unknown> | null | undefined} worldState
 * @param {number} tick
 * @returns {Array<{ fromId: string, toId: string }>}
 */
export function repudiableTreatyPairs(worldState, tick) {
  if (!peaceCausalActive(/** @type {Mut} */ (worldState || {}))) return [];
  const ledger = asObject(getSpatialLedger(worldState, 'treaties'));
  const nowTick = Math.max(0, Math.floor(Number.isFinite(tick) ? tick : 0));
  const pairs = new Map();
  for (const key of Object.keys(ledger).sort()) {
    const treaty = asObject(ledger[key]);
    if (!isRepudiableTreaty(treaty, nowTick)) continue;
    const parties = [...new Set((Array.isArray(treaty.parties) ? treaty.parties : [])
      .map(String).filter(Boolean))].sort();
    for (const fromId of parties) {
      for (const toId of parties) {
        if (fromId === toId) continue;
        pairs.set(`${fromId}\u001f${toId}`, { fromId, toId });
      }
    }
  }
  return [...pairs.values()].sort((a, b) =>
    codepoint(a.fromId, b.fromId) || codepoint(a.toId, b.toId));
}

/**
 * Publicly repudiate every live non-aggression treaty between `fromId` and
 * `toId`. Invalid or lapsed requests are strict no-ops (same state reference).
 * @param {Record<string, unknown>} worldState
 * @param {{ fromId?: unknown, toId?: unknown, tick?: unknown }} args
 * @returns {{ ok: true, worldState: Record<string, unknown>, changed: true, treatyKeys: string[], dispositionTransitions?:Array<Record<string, unknown>> }
 *   | { ok: false, code: string, detail: string, worldState: Record<string, unknown> }}
 */
export function repudiateTreaty(worldState, { fromId, toId, tick } = {}) {
  if (!peaceCausalActive(worldState)) {
    return { ok: false, code: 'treaty_breach_gate_dark', detail: '', worldState };
  }
  const breaker = String(fromId ?? '').trim();
  const other = String(toId ?? '').trim();
  if (!breaker || !other || breaker === other) {
    return { ok: false, code: 'treaty_breach_invalid', detail: '', worldState };
  }
  const nowTick = Math.max(0, Math.floor(Number.isFinite(Number(tick)) ? Number(tick) : 0));
  const ledger = asObject(getSpatialLedger(worldState, 'treaties'));
  const matchingKeys = Object.keys(ledger).sort().filter((key) => {
    const treaty = asObject(ledger[key]);
    return hasParties(treaty, breaker, other) && isRepudiableTreaty(treaty, nowTick);
  });
  if (!matchingKeys.length) {
    return { ok: false, code: 'treaty_breach_no_live_nap', detail: '', worldState };
  }

  /** @type {TreatyLedger} */
  const next = {};
  for (const key of Object.keys(ledger).sort()) {
    const treaty = asObject(ledger[key]);
    if (!matchingKeys.includes(key)) {
      next[key] = treaty;
      continue;
    }
    const sourceTerms = Array.isArray(treaty.terms) ? treaty.terms.map(asObject) : [];
    const liveExpiries = sourceTerms
      .filter(term => isLiveTerm(term, nowTick))
      .map(term => /** @type {number} */ (finiteTick(term.expiresTick)));
    const breachExpiresTick = Math.max(...liveExpiries);
    const terms = sourceTerms.map((term) => {
      if (!isLiveTerm(term, nowTick)) return term;
      return {
        ...term,
        repudiatedComplianceState: String(term.complianceState || 'honored'),
        repudiatedTrueState: String(term.trueState || 'honored'),
        repudiatedExpiresTick: term.expiresTick,
        repudiatedTick: nowTick,
        complianceState: 'defaulted',
        trueState: 'defaulted',
        expiresTick: nowTick,
      };
    });
    const receipts = Array.isArray(treaty.receipts) ? treaty.receipts.map(String) : [];
    next[key] = {
      ...treaty,
      terms,
      receipts: [...receipts, 'The pact was repudiated openly; every promise under it ceased at once.'],
      complianceState: 'defaulted',
      defaultedBy: breaker,
      defaultSeverity01: 1,
      breachType: TREATY_REPUDIATION_TYPE,
      repudiatedTick: nowTick,
      breachExpiresTick,
    };
  }
  let nextWorldState = setSpatialLedger(worldState, 'treaties', next);
  /** @type {Array<Record<string, unknown>>} */
  let dispositionTransitions = [];
  const simulationRules = asObject(worldState.simulationRules);
  if (simulationRules.dispositionChannelsEnabled === true) {
    const advanced = advanceDispositionChannels(
      /** @type {Record<string, any>} */ (worldState.dispositionStats || {}),
      [{
        id: breaker,
        channel: 'diplomatic',
        outcome: 'loss',
        magnitude: 1,
        sourceKind: 'treaty_repudiated',
      }],
      { enabled: true, tick: nowTick },
    );
    nextWorldState = { ...nextWorldState, dispositionStats: advanced.ledger };
    dispositionTransitions = advanced.transitions;
  }
  return {
    ok: true,
    worldState: nextWorldState,
    changed: true,
    treatyKeys: matchingKeys,
    ...(dispositionTransitions.length ? { dispositionTransitions } : {}),
  };
}
