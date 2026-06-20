/**
 * domain/region/contestMath.js — pure deterministic math shared by every
 * "two-aggressors-over-a-third-party" contest (war-front primacy, trade-partner
 * primacy, religious conversion). One primitive, three callers.
 *
 * Three-layer law: region/ must NOT import src/generators (prng). Callers INJECT
 * an rng (the `{ random(), fork() }` shape). Everything here is pure, total, and
 * ORDER-STABLE — no Date.now, no Math.random, no mutation of inputs.
 *
 * Why log-odds + logistic (not a raw product): a contest blends several 0..1
 * factor signals (supply completeness × economic strength × diplomatic standing,
 * or deity-strength × orthodoxy × proximity). Multiplying probabilities saturates
 * to ~0 the instant ONE factor is weak, collapsing the field. Summing in LOG-ODDS
 * space and squashing ONCE keeps every factor's marginal influence alive.
 */

/** @param {number} v @returns {number} */
export const clamp01 = (v) => Math.max(0, Math.min(1, Number.isFinite(v) ? v : 0));

/**
 * Deterministic 0..1 hash keyed on identity text (FNV-1a + fmix32 avalanche).
 * COPIED from worldPulse/relationshipEvolution.hash01 so region/ carries no
 * worldPulse import. The avalanche finalizer is load-bearing: without it a
 * single-character (tick) change barely moves the high bits and a symmetric
 * contest resolves the same way for many ticks running.
 * @param {string} text
 * @returns {number} a value in [0, 1)
 */
export function hash01(text) {
  let h = 0x811c9dc5;
  const s = String(text);
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

/** Logistic squash of a log-odds value into (0, 1), overflow-safe.
 * @param {number} x @returns {number} */
export function logistic(x) {
  if (!Number.isFinite(x)) return x > 0 ? 1 : 0;
  if (x >= 0) return 1 / (1 + Math.exp(-x));
  const z = Math.exp(x);
  return z / (1 + z);
}

/** Logit (inverse logistic) of a 0..1 strength, clamped off the ±∞ rails.
 * @param {number} p @returns {number} */
export function logit(p) {
  const c = Math.min(1 - 1e-6, Math.max(1e-6, clamp01(p)));
  return Math.log(c / (1 - c));
}

/**
 * Softmax weights over scores at temperature k (sharper as k grows). Returns an
 * array summing to 1, order-aligned with the input. Numerically stable (shifts by
 * the max). Empty input → [].
 * @param {number[]} scores
 * @param {number} [k]
 * @returns {number[]}
 */
export function softmaxWeights(scores, k = 1) {
  if (!scores.length) return [];
  const scaled = scores.map((s) => k * (Number.isFinite(s) ? s : 0));
  const max = Math.max(...scaled);
  const exps = scaled.map((s) => Math.exp(s - max));
  const total = exps.reduce((a, b) => a + b, 0) || 1;
  return exps.map((e) => e / total);
}

/**
 * Deterministic weighted sample by a single rng draw over weights whose order is
 * ALREADY canonical (the caller must sort first — see sortByWeightThenTie). Walks
 * the cumulative weight; returns the chosen index, or -1 for an empty list. A
 * degenerate all-zero weight vector falls back to index 0 (the canonical top).
 * @param {number[]} weights
 * @param {{random: () => number}} rng
 * @returns {number}
 */
export function stableSampleByWeight(weights, rng) {
  if (!weights.length) return -1;
  const total = weights.reduce((a, b) => a + (b > 0 ? b : 0), 0);
  if (!(total > 0)) return 0;
  let roll = rng.random() * total;
  for (let i = 0; i < weights.length; i += 1) {
    roll -= Math.max(0, weights[i]);
    if (roll <= 0) return i;
  }
  return weights.length - 1;
}

/**
 * Canonical contender order: DESCENDING weight, ties broken by ASCENDING tieKey (a
 * deterministic hash, NOT alphabetical — so perfectly symmetric contenders don't
 * resolve the same way every contest). Returns a NEW array; never mutates input.
 * Each item must carry numeric `weight` and numeric `tieKey`.
 * @template {{weight:number, tieKey:number}} T
 * @param {T[]} items
 * @returns {T[]}
 */
export function sortByWeightThenTie(items) {
  return [...items].sort((a, b) => {
    if (b.weight !== a.weight) return b.weight - a.weight;
    if (a.tieKey !== b.tieKey) return a.tieKey - b.tieKey;
    return 0;
  });
}
