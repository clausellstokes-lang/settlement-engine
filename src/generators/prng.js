/**
 * prng.js — Seeded pseudo-random number generator wrapper.
 *
 * Drop-in replacements for Math.random-based helpers in constants.js.
 * Every generator step receives a PRNG instance from the pipeline context,
 * making generation fully deterministic for a given seed.
 *
 * Usage:
 *   import { createPRNG } from './prng.js';
 *   const rng = createPRNG('my-seed');
 *   rng.random();        // 0..1  (deterministic)
 *   rng.pick(arr);       // random element
 *   rng.chance(0.3);     // true 30% of the time
 *   rng.randInt(1, 6);   // 1..6 inclusive
 *   rng.shuffle(arr);    // Fisher-Yates in-place shuffle, returns arr
 *   rng.weightedPick(items, weights);  // weighted random selection
 *   rng.fork('substep'); // child PRNG with derived seed (for isolation)
 */

import seedrandom from 'seedrandom';

export function createPRNG(seed) {
  const _rng = seedrandom(seed);

  const rng = {
    /** The seed this PRNG was created with. */
    seed,

    /** Raw 0..1 float, deterministic. */
    random: () => _rng(),

    /** Pick a random element from an array. */
    pick: (arr) => {
      if (!arr || arr.length === 0) return undefined;
      return arr[Math.floor(_rng() * arr.length)];
    },

    /** Return true with probability p (0..1). */
    chance: (p) => _rng() < p,

    /** Random integer in [min, max] inclusive. */
    randInt: (min, max) => Math.floor(_rng() * (max - min + 1)) + min,

    /** Fisher-Yates shuffle in place. Returns the array. */
    shuffle: (arr) => {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(_rng() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    },

    /** Weighted random pick. items[i] has weight weights[i]. */
    weightedPick: (items, weights) => {
      const total = weights.reduce((s, w) => s + w, 0);
      let roll = _rng() * total;
      for (let i = 0; i < items.length; i++) {
        roll -= weights[i];
        if (roll <= 0) return items[i];
      }
      return items[items.length - 1];
    },

    /** Create a child PRNG with a derived seed for sub-step isolation. */
    fork: (label) => createPRNG(`${seed}::${label}`),

    /** Round a random value to range [lo, hi]. */
    randFloat: (lo, hi) => lo + _rng() * (hi - lo),
  };

  return rng;
}

/**
 * Generate a random seed string (for when the user doesn't provide one).
 * Uses Math.random — this is the ONE place non-determinism enters.
 */
export function generateSeed() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
