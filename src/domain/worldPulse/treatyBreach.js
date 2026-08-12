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
// GR-4a — THE SUCCESSION ANSWER. The derivation is a pure leaf; the one act that
// reaches the treaty ledger stays in this module, which is the family's declared
// rewriter, so the ownership certification's writer set does not move.
import { oathHolderActive } from './oathHolder.js';
import { appendLineage } from './pactAmendment.js';
import { isSuccessionDisavowable, successionQuestionsForTick } from './treatySuccession.js';

/** @typedef {Record<string, unknown>} Mut */
/** @typedef {Record<string, Mut>} TreatyLedger */

/**
 * The band-crossing row, DERIVED from its only producer rather than restated.
 * `advanceDispositionChannels` is the sole writer of these rows and already
 * declares their exact shape; a hand-copied shape here would go stale the moment
 * the ledger gains a field, and the consumer (dispositionNews.js) reads named
 * members — `kind`, `id`, `channel`, `toBand`, `tick` — that a widened
 * `Record<string, unknown>` row does not promise.
 * @typedef {ReturnType<typeof advanceDispositionChannels>['transitions'][number]} DispositionTransition
 */

export const TREATY_REPUDIATION_TYPE = 'repudiation';

/**
 * GR-4a's second breach kind. It sits beside its sibling rather than inside the frozen
 * vocabulary leaf for the same reason `TREATY_REPUDIATION_TYPE` does: the PRODUCER keeps
 * the constant it writes, and `treatyBreachTypes.js` keeps the closed set every CONSUMER
 * asks against. The two spellings are pinned equal.
 */
export const SUCCESSION_REPUDIATION_TYPE = 'succession_repudiation';

/** The lineage act and ending this breach appends — a `pactAmendment.js` frozen-list member. */
const DISAVOWED_BY_SUCCESSION = 'disavowed_by_succession';

const OPEN_REPUDIATION_RECEIPT = 'The pact was repudiated openly; every promise under it ceased at once.';
// The house voice for the OTHER road. Reusing the sentence above would put a false
// statement into the world's own history: nobody repudiated this pact openly — the hand
// that swore it is gone, and the seat that followed would not own the word.
const SUCCESSION_DISAVOWAL_RECEIPT = 'The oath was sworn by a hand now gone, and the seat that followed would not own it; every promise under it ceased at once.';

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
 * THE SHARED DEFAULT-APPLICATION SHELL (J-GR-16's gate separation, applied).
 *
 * Both roads to a broken instrument end here, and this body is the WR-0c write
 * verbatim in effect: every live promise is ended at the breach tick with its four
 * `repudiated*` provenance fields, and the treaty carries the verdict plus the max
 * ORIGINAL horizon so the broken shell stays legible to the standing treaty_default
 * scorer until the promises would have run out anyway. The KEY ORDER is part of the
 * contract — the record it returns for `('repudiation', 1)` is byte-identical to the
 * one this module wrote before the factoring, and that is asserted, not asserted-ish.
 *
 * ⛔ It writes no ledger, deliberately. The ownership certification discovers the
 * treaties writers from executable syntax by ENCLOSING NAMED FUNCTION and pins the
 * set by equality, so the persistence call stays in `repudiateTreaty` alone.
 *
 * @param {Mut} treaty
 * @param {{ breachType: string, severity01: number, defaultedBy: string, receipt: string }} verdict
 * @param {number} nowTick
 * @returns {Mut}
 */
function defaultAllLiveTerms(treaty, verdict, nowTick) {
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
  return {
    ...treaty,
    terms,
    receipts: [...receipts, verdict.receipt],
    complianceState: 'defaulted',
    defaultedBy: verdict.defaultedBy,
    defaultSeverity01: verdict.severity01,
    breachType: verdict.breachType,
    repudiatedTick: nowTick,
    breachExpiresTick,
  };
}

/**
 * Break a treaty — openly by the realm verb, or by an heir's disavowal at a seat
 * change. Invalid or lapsed requests are strict no-ops (same state reference).
 *
 * TWO ELIGIBILITY PREDICATES, ONE SHELL. The DM verb keeps `isRepudiableTreaty` and
 * its live-non_aggression requirement untouched; the succession road brings its own
 * predicate from the pure leaf, which is why a tribute-only instrument — unreachable
 * through the verb, forever — is answerable at a succession.
 *
 * @param {Record<string, unknown>} worldState
 * @param {{ fromId?: unknown, toId?: unknown, tick?: unknown,
 *   succession?: import('./treatySuccession.js').SuccessionQuestion | null }} args
 * @returns {{ ok: true, worldState: Record<string, unknown>, changed: true, treatyKeys: string[], dispositionTransitions?:DispositionTransition[] }
 *   | { ok: false, code: string, detail: string, worldState: Record<string, unknown> }}
 */
export function repudiateTreaty(worldState, { fromId, toId, tick, succession = null } = {}) {
  if (!peaceCausalActive(worldState)) {
    return { ok: false, code: 'treaty_breach_gate_dark', detail: '', worldState };
  }
  const breaker = String((succession ? succession.settlementId : fromId) ?? '').trim();
  const other = String((succession ? succession.otherId : toId) ?? '').trim();
  if (!breaker || !other || breaker === other) {
    return { ok: false, code: 'treaty_breach_invalid', detail: '', worldState };
  }
  const nowTick = Math.max(0, Math.floor(Number.isFinite(Number(tick)) ? Number(tick) : 0));
  const ledger = asObject(getSpatialLedger(worldState, 'treaties'));
  const matchingKeys = Object.keys(ledger).sort().filter((key) => {
    const treaty = asObject(ledger[key]);
    return succession
      ? key === succession.treatyKey
        && isSuccessionDisavowable(treaty, breaker, succession.npcId, nowTick)
      : hasParties(treaty, breaker, other) && isRepudiableTreaty(treaty, nowTick);
  });
  if (!matchingKeys.length) {
    return { ok: false, code: 'treaty_breach_no_live_nap', detail: '', worldState };
  }
  const verdict = succession
    ? { breachType: SUCCESSION_REPUDIATION_TYPE, severity01: Number(succession.severity01), defaultedBy: breaker, receipt: SUCCESSION_DISAVOWAL_RECEIPT }
    : { breachType: TREATY_REPUDIATION_TYPE, severity01: 1, defaultedBy: breaker, receipt: OPEN_REPUDIATION_RECEIPT };

  /** @type {TreatyLedger} */
  const next = {};
  for (const key of Object.keys(ledger).sort()) {
    const treaty = asObject(ledger[key]);
    if (!matchingKeys.includes(key)) {
      next[key] = treaty;
      continue;
    }
    const broken = defaultAllLiveTerms(treaty, verdict, nowTick);
    // GR-2's lineage carries the instrument's OWN history, so the ending that closed it
    // belongs there. The open repudiation still appends none — WR-0c shipped without one
    // and adding it now would move a landed record shape for no wave's benefit.
    next[key] = succession
      ? appendLineage(broken, { act: DISAVOWED_BY_SUCCESSION, tick: nowTick, ending: DISAVOWED_BY_SUCCESSION })
      : broken;
  }
  let nextWorldState = setSpatialLedger(worldState, 'treaties', next);
  /** @type {DispositionTransition[]} */
  let dispositionTransitions = [];
  const simulationRules = asObject(worldState.simulationRules);
  // DELIBERATELY NOT ON THE SUCCESSION ROAD, documented rather than dropped: a
  // disposition write here would be a second state behind a second flag CONJUNCTION
  // (`oathHolderEnabled` × `dispositionChannelsEnabled`), which is precisely the shape
  // GR-4 was refused for carrying. What a court's memory should learn from an heir's
  // disavowal is a later slice's question, not this one's.
  if (!succession && simulationRules.dispositionChannelsEnabled === true) {
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

/**
 * GR-4a — ANSWER EVERY OATH THE FALLEN HOLDERS SWORE, at the tick their seats changed.
 *
 * THE GATE IS HERE AND NOWHERE DEEPER, and it is load-bearing twice over. Dark, this
 * returns the SAME worldState reference before reading a stamp, a ladder row or a
 * treaty — so the call-path dormancy fence's counter on `swornPartiesOf` reads a true
 * zero, and the mover's own serialize-compare sees an unchanged world and returns its
 * caller's reference untouched. `oathHolderActive` is the single existing strict
 * `=== true` read of the flag, so no new gate spelling enters the source tree.
 *
 * HONOR WRITES NOTHING. Only a disavowal reaches the ledger; a tick of questions that
 * are all honored is byte-identical to a tick where none was asked.
 *
 * @param {Record<string, unknown>} worldState
 * @param {unknown} tick
 * @returns {Record<string, unknown>} the same reference when nothing is disavowed
 */
export function answerSuccessionQuestions(worldState, tick) {
  if (!oathHolderActive(worldState)) return worldState;
  let out = worldState;
  for (const question of successionQuestionsForTick(worldState, tick)) {
    if (question.answer !== 'disavow') continue;
    // Re-read per application: the questions were derived against one ledger, and each
    // answer rewrites it. The predicate runs again inside, so a treaty already broken by
    // an earlier answer this same tick is refused rather than broken twice.
    const applied = repudiateTreaty(out, { tick, succession: question });
    if (applied.ok) out = applied.worldState;
  }
  return out;
}
