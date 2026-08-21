/**
 * domain/region/contestOverThirdParty.js — THE shared "two aggressors over a third
 * party" contest. War-front primacy, trade-partner primacy,
 * and religious conversion are all thin callers that supply a
 * `scoreFor` per contender; the contest math, incumbency, determinism, and tie
 * handling live here ONCE.
 *
 * Determinism contract (load-bearing):
 *  - rng is INJECTED; we fork it on a FROZEN recipe so the draw is independent of
 *    call site and of contender array order.
 *  - contenders are sorted into a canonical order (descending weight, then a
 *    deterministic hash tie-break) BEFORE any cumulative-weight walk.
 *  - < 2 real contenders ⇒ default-neutral no-op (the incumbent / sole contender
 *    simply retains the prize), so a single-incumbent field is byte-identical.
 *
 * Balance contract (see SUBSYSTEM_INTEGRATION_PLAN §6): this runs PER TICK (and for
 * trade, per commodity), far more often than a coup resolves. So the incumbent must
 * hold far more reliably than resolveCoupVerdict's 0.9 hold-ceiling / 0.1 per-
 * resolution upset floor — otherwise the prize flips every ~10 ticks regardless of
 * dominance. We raise the hold ceiling and add an incumbency amplifier + hysteresis
 * bias. The constants are defaults; callers tune via `options` and soak tests pin
 * the convergence band.
 */

import {
  clamp01, hash01, logit, softmaxWeights, stableSampleByWeight, sortByWeightThenTie,
} from './contestMath.js';

/** The ONE fork-key recipe. Every consumer obeys it; do not invent variants.
 * @param {{channelType: string, prizeId: string, tick: number|string}} args
 * @returns {string} */
export function contestForkKey({ channelType, prizeId, tick }) {
  return `contest:${channelType}:${prizeId}:${tick}`;
}

// Defaults (overridable per call via `options`).
const DEFAULTS = Object.freeze({
  temperature: 1.0,       // softmax sharpness over the log-odds scores
  incumbentAmplify: 1.5,  // incumbency advantage (multiplies the incumbent's weight)
  holdCeiling: 0.985,     // max per-tick hold prob — RAISED from coup's 0.9 (anti-churn)
  holdFloor: 0.05,        // a clearly-losing incumbent still occasionally holds
  hysteresisBias: 0.05,   // extra stickiness added to the incumbent's hold share
});

/**
 * @typedef {Object} Contender
 * @property {string} id
 * @property {number} scoreFor - 0..1 strength of this contender's claim to the prize
 *
 * @typedef {Object} ContestResult
 * @property {string} prizeId
 * @property {string} channelType
 * @property {string|null} winnerId
 * @property {string|null} incumbentId
 * @property {boolean} changed   - winner differs from the incumbent
 * @property {boolean} contested - a real (≥2-contender) contest actually ran
 * @property {number} pHold      - incumbent hold probability used this tick (1 if open/no-op)
 * @property {number} roll       - the rng draw (0 for a no-op)
 * @property {Record<string, number>} weights - per-contender contest weight (post-amplify)
 */

/**
 * Resolve a single contest over `prizeId`'s primacy on `channelType`.
 * @param {Object} args
 * @param {string} args.prizeId
 * @param {string} args.channelType
 * @param {Contender[]} args.contenders
 * @param {string|null} [args.incumbentId] - current holder (DM-assigned or prior winner)
 * @param {{random: () => number, fork: (label: string) => any}} args.rng
 * @param {number} [args.tick]
 * @param {Partial<typeof DEFAULTS>} [args.options]
 * @returns {ContestResult}
 */
export function contestOverThirdParty({
  prizeId, channelType, contenders = [], incumbentId = null, rng, tick = 0, options = {},
}) {
  const inc = incumbentId == null ? null : String(incumbentId);
  const cleaned = (contenders || [])
    .filter((c) => c && c.id != null)
    .map((c) => ({ id: String(c.id), scoreFor: clamp01(c.scoreFor) }));

  // No-op: fewer than two real contenders — nothing to contest.
  if (cleaned.length < 2) {
    const soleId = inc ?? (cleaned[0]?.id ?? null);
    return {
      prizeId, channelType, winnerId: soleId, incumbentId: inc,
      changed: false, contested: false, pHold: 1, roll: 0, weights: {},
    };
  }

  const opt = { ...DEFAULTS, ...options };

  // Weight = softmax over the log-odds of each scoreFor, with the incumbent
  // amplified. Log-odds (not raw product) keeps every factor's influence alive.
  const logits = cleaned.map((c) => logit(c.scoreFor));
  const base = softmaxWeights(logits, opt.temperature);
  const weighted = cleaned.map((c, i) => ({
    id: c.id,
    weight: base[i] * (c.id === inc ? opt.incumbentAmplify : 1),
    // Deterministic tie-break keyed on the CONTEST identity (not alphabetical), so
    // perfectly symmetric contenders don't always resolve to the same id.
    tieKey: hash01(`${c.id}:${channelType}:${prizeId}:${tick}`),
  }));

  const sorted = sortByWeightThenTie(weighted);
  const total = sorted.reduce((s, c) => s + Math.max(0, c.weight), 0) || 1;
  const weightsOut = Object.fromEntries(sorted.map((c) => [c.id, c.weight]));

  const contestRng = rng.fork(contestForkKey({ channelType, prizeId, tick }));

  // ── Incumbent present: a hold gate (incumbent's amplified share), then on an
  //    upset, sample the winner among the CHALLENGERS ∝ weight.
  const incumbentRow = inc == null ? null : sorted.find((c) => c.id === inc);
  if (incumbentRow) {
    const share = Math.max(0, incumbentRow.weight) / total;
    const pHold = Math.min(opt.holdCeiling, Math.max(opt.holdFloor, share + opt.hysteresisBias));
    const roll = contestRng.random();
    if (roll <= pHold) {
      return {
        prizeId, channelType, winnerId: inc, incumbentId: inc,
        changed: false, contested: true, pHold, roll, weights: weightsOut,
      };
    }
    const challengers = sorted.filter((c) => c.id !== inc);
    const idx = stableSampleByWeight(challengers.map((c) => c.weight), contestRng);
    const winnerId = idx >= 0 ? challengers[idx].id : inc;
    return {
      prizeId, channelType, winnerId, incumbentId: inc,
      changed: winnerId !== inc, contested: true, pHold, roll, weights: weightsOut,
    };
  }

  // ── Open contest (no incumbent): sample the winner ∝ weight over all contenders.
  const idx = stableSampleByWeight(sorted.map((c) => c.weight), contestRng);
  const winnerId = idx >= 0 ? sorted[idx].id : null;
  return {
    prizeId, channelType, winnerId, incumbentId: inc,
    changed: winnerId !== inc, contested: true, pHold: 0, roll: 0, weights: weightsOut,
  };
}
