/**
 * domain/display/armyStrength.js — read-model SELECTOR for the DM UI:
 * "how strong is this settlement's army right now, and how worn-down is it?".
 *
 * A `warStatus.js`-style projection of:
 *   - the LATENT military strength (militaryStrength.deriveMilitaryCapacity) — what
 *     the realm could field if fully mustered, in HEURISTIC bands ("a formidable
 *     host" … "a thin levy"), never the 0..100 capacity number; and
 *   - the LIVE deployed-army state (worldState.deployments[homeId] — the stateful
 *     record) — how much of the marched-out army is LEFT after attrition
 *     ("battered — about two-fifths of its strength remains"), the supply/morale
 *     condition in plain words, NEVER the raw currentEffectiveStrength /
 *     accumulatedAttrition / supplyIntegrity primitives.
 *
 * HEURISTIC DM LANGUAGE — NO INTERNALS. No capacity number, no attrition fraction,
 * no facet score, no rng. The fractions are bucketed into words. This is the
 * "army strength + attrition in plain words" surface.
 *
 * PRESENTATION ONLY. Pure projection: nothing here mutates worldState, forks rng,
 * or reads a wall clock. INERT, NOT CRASH, WHEN ABSENT — a no-war campaign (absent
 * deployments ledger) yields a latent-only reading or null, never throws. Every
 * list is codepoint-sorted for stable order.
 *
 * SELF-GATING. `deployedArmyStatus` returns null unless a LIVE deployment record
 * exists for the settlement ⇒ a peaceful / non-campaign town surfaces nothing.
 *
 * Strict-clean (typecheck:domain:strict). No React/Zustand imports.
 */

import { deriveMilitaryCapacity } from '../worldPulse/militaryStrength.js';

/** @param {any} a @param {any} b @returns {number} */
const codepoint = (a, b) => (String(a) < String(b) ? -1 : String(a) > String(b) ? 1 : 0);
/** @param {any} v @param {number} [d] @returns {number} */
const num = (v, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d);
const clamp01 = (/** @type {any} */ v) => Math.max(0, Math.min(1, num(v)));

// Heuristic bands for the LATENT (theoretical) strength of a host, 0..100 → words.
// Bands only — never the number. A thorpe levy ≠ a city host.
const STRENGTH_BANDS = Object.freeze([
  { floor: 78, phrase: 'a formidable host, few in the region could match it in the field' },
  { floor: 60, phrase: 'a strong army, ready to take the field with confidence' },
  { floor: 42, phrase: 'a capable militia, enough to defend its own and raid a neighbour' },
  { floor: 26, phrase: 'a modest levy, able to hold its walls but not project far' },
  { floor: 0, phrase: 'a thin levy, barely enough to keep the peace at home' },
]);

/**
 * The heuristic latent-strength phrase for a settlement (or worldPulse item). Reads
 * the structured military capacity and buckets the 0..100 theoretical capacity into
 * a DM band. Total — always returns a phrase (a settlement always has *some* levy).
 * @param {any} settlementOrItem
 * @returns {{ phrase: string }}
 */
export function latentStrength(settlementOrItem) {
  const cap = deriveMilitaryCapacity(settlementOrItem);
  const score = clamp01(num(cap.theoreticalCapacity) / 100) * 100;
  const band = STRENGTH_BANDS.find(b => score >= b.floor) || STRENGTH_BANDS[STRENGTH_BANDS.length - 1];
  return { phrase: band.phrase };
}

// Heuristic bands for the FRACTION of a deployed army's strength that remains after
// attrition (currentEffectiveStrength / maxStartStrength), 1..0 → words.
const REMAINING_BANDS = Object.freeze([
  { floor: 0.85, phrase: 'still near full strength' },
  { floor: 0.6, phrase: 'bloodied but holding, most of its strength still standing' },
  { floor: 0.4, phrase: 'battered, roughly half its strength spent' },
  { floor: 0.2, phrase: 'gutted, only a fraction of the host left to fight' },
  { floor: 0, phrase: 'all but broken, a spent remnant in the field' },
]);

/**
 * The heuristic "how much of the army is left" phrase for a remaining-strength
 * fraction (0..1). Bands only — never the fraction or the raw strength.
 * @param {number} remainingFraction 0..1
 * @returns {string}
 */
export function attritionPhrase(remainingFraction) {
  const f = clamp01(remainingFraction);
  const band = REMAINING_BANDS.find(b => f >= b.floor) || REMAINING_BANDS[REMAINING_BANDS.length - 1];
  return band.phrase;
}

// The army's supporting condition (supply + morale, both 0..1) in plain words.
// We MAX the two pains so the sharpest one sets the phrase.
const CONDITION_BANDS = Object.freeze([
  { floor: 0.66, phrase: 'well supplied and in good heart' },
  { floor: 0.4, phrase: 'supply lines strained, morale wavering' },
  { floor: 0, phrase: 'starving and demoralized, close to falling apart' },
]);

/**
 * The army's supporting-condition phrase from a deployment record (supply + morale).
 * Reads the LIVE supportive facets but surfaces them as words — never the numbers.
 * @param {any} record the worldState.deployments[homeId] stateful record.
 * @returns {string}
 */
function conditionPhrase(record) {
  // The army is as healthy as its WEAKEST supporting facet (a starving host with
  // high morale is still failing). Take the MIN over supply + morale (+food).
  const supply = clamp01(num(record?.supplyIntegrity, 0.5));
  const morale = clamp01(num(record?.morale, 0.5));
  const food = clamp01(num(record?.foodReserve, 0.5));
  const health = Math.min(supply, morale, food);
  const band = CONDITION_BANDS.find(b => health >= b.floor) || CONDITION_BANDS[CONDITION_BANDS.length - 1];
  return band.phrase;
}

/**
 * The LIVE status of ONE settlement's deployed army — its destination, how much of
 * its strength remains after attrition (in words), and its supply/morale condition
 * (in words). Returns null when the settlement is fielding no army abroad (no live
 * deployment record) ⇒ the self-gating guarantee: a peaceful / non-campaign
 * settlement surfaces nothing.
 *
 * @param {Object} args
 * @param {any} args.settlementId
 * @param {any} args.worldState
 * @param {(id:any)=>string} [args.nameFor]
 * @returns {{ targetId: string, targetName: string, remainingPhrase: string, conditionPhrase: string, weakened: boolean } | null}
 */
export function deployedArmyStatus({ settlementId, worldState, nameFor = (id) => String(id) } = /** @type {any} */ ({})) {
  if (settlementId == null) return null;
  const deployments = worldState?.deployments && typeof worldState.deployments === 'object'
    ? worldState.deployments
    : {};
  const rec = deployments[String(settlementId)];
  if (!rec || rec.targetId == null) return null;

  const start = num(rec.maxStartStrength, NaN);
  const current = num(rec.currentEffectiveStrength, NaN);
  // A LIGHT (legacy) record carries no strength fields — treat it as full strength
  // (the army just marched out; attrition hasn't been modelled). Never throws.
  const remaining = (Number.isFinite(start) && start > 0 && Number.isFinite(current))
    ? clamp01(current / start)
    : 1;

  return {
    targetId: String(rec.targetId),
    targetName: nameFor(rec.targetId),
    remainingPhrase: attritionPhrase(remaining),
    conditionPhrase: conditionPhrase(rec),
    weakened: remaining < 0.85,
  };
}

/**
 * The cross-settlement DEPLOYED-ARMY standings: one entry per settlement with a live
 * army abroad, codepoint-sorted by home id, each in heuristic language. Returns []
 * when the deployments ledger is absent / empty ⇒ byte-identical off-state.
 *
 * @param {Object} args
 * @param {any} args.worldState
 * @param {(id:any)=>string} [args.nameFor]
 * @returns {Array<{ homeId: string, targetName: string, remainingPhrase: string, conditionPhrase: string, weakened: boolean }>}
 */
export function deployedArmyStandings({ worldState, nameFor = (id) => String(id) } = /** @type {any} */ ({})) {
  const deployments = worldState?.deployments && typeof worldState.deployments === 'object'
    ? worldState.deployments
    : {};
  /** @type {Array<{ homeId: string, targetName: string, remainingPhrase: string, conditionPhrase: string, weakened: boolean }>} */
  const out = [];
  for (const homeId of Object.keys(deployments).sort(codepoint)) {
    const status = deployedArmyStatus({ settlementId: homeId, worldState, nameFor });
    if (!status) continue;
    out.push({
      homeId,
      targetName: status.targetName,
      remainingPhrase: status.remainingPhrase,
      conditionPhrase: status.conditionPhrase,
      weakened: status.weakened,
    });
  }
  return out;
}

/**
 * Whether ANY live deployed army is present (the gate a panel uses to decide whether
 * to render its deployed-army block). A dormant campaign yields false ⇒ nothing
 * renders ⇒ byte-identical.
 * @param {Object} args
 * @param {any} args.worldState
 * @returns {boolean}
 */
export function hasDeployedArmy({ worldState } = /** @type {any} */ ({})) {
  return deployedArmyStandings({ worldState }).length > 0;
}

export const ARMY_STRENGTH_PHRASES = Object.freeze({ STRENGTH_BANDS, REMAINING_BANDS, CONDITION_BANDS });
