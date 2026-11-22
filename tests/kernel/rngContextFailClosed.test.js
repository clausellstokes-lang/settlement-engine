/**
 * rngContextFailClosed.test.js — the ambient-draw fail-CLOSED pin.
 *
 * rngContext's helpers used to fall back to Math.random() when no seeded PRNG
 * was active (warn-once). That converted a missing setActiveRng() into SILENT
 * non-reproducibility: a settlement whose stored seed no longer replays, with
 * no failing test and no crash. The helpers now THROW in every environment
 * when no context is active; the sole sanctioned ambient draw is the named,
 * greppable escape hatch unseededRandom(), which itself refuses to run while
 * a seeded generation is active.
 *
 * This test pins all three behaviors:
 *   1. every helper throws with no active RNG (fail closed);
 *   2. every helper draws from the seeded PRNG when one is active
 *      (deterministic given the seed);
 *   3. unseededRandom() works ONLY outside a seeded scope.
 * Plus a source pin: no Math.random() fallback path can quietly return inside
 * _roll() again.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, test } from 'vitest';
import { createPRNG } from '../../src/kernel/prng.js';
import {
  chance,
  clearActiveRng,
  getActiveRng,
  pick,
  randInt,
  random,
  setActiveRng,
  shuffle,
  unseededRandom,
  weightedPick,
} from '../../src/kernel/rngContext.js';

afterEach(() => clearActiveRng());

const NO_RNG = /no active seeded RNG/;

describe('rngContext fails CLOSED with no active seeded RNG', () => {
  test.each([
    ['random',       () => random()],
    ['chance',       () => chance(0.5)],
    ['pick',         () => pick([1, 2, 3])],
    ['randInt',      () => randInt(1, 6)],
    ['shuffle',      () => shuffle([1, 2, 3])],
    ['weightedPick', () => weightedPick(['a', 'b'], [1, 2])],
  ])('%s() throws instead of silently drawing Math.random()', (_name, fn) => {
    clearActiveRng();
    expect(fn).toThrow(NO_RNG);
  });

  test('pick([]) still returns undefined without drawing (guard precedes the roll)', () => {
    clearActiveRng();
    expect(pick([])).toBeUndefined();
    expect(pick(null)).toBeUndefined();
  });

  test('the throw is actionable — it names setActiveRng and the escape hatch', () => {
    clearActiveRng();
    expect(() => random()).toThrow(/setActiveRng/);
    expect(() => random()).toThrow(/unseededRandom/);
  });
});

describe('rngContext draws from the seeded PRNG when active', () => {
  test('same seed ⇒ same draw sequence through every helper', () => {
    const run = () => {
      setActiveRng(createPRNG('fail-closed-pin'));
      const out = [
        random(),
        chance(0.5),
        pick(['a', 'b', 'c', 'd']),
        randInt(1, 100),
        shuffle([1, 2, 3, 4, 5]).slice(),
        weightedPick(['x', 'y', 'z'], [1, 5, 2]),
      ];
      clearActiveRng();
      return out;
    };
    expect(run()).toEqual(run());
  });

  test('set/get/clear round-trips the active context', () => {
    const rng = createPRNG('roundtrip');
    setActiveRng(rng);
    expect(getActiveRng()).toBe(rng);
    clearActiveRng();
    expect(getActiveRng()).toBeNull();
  });
});

describe('unseededRandom() — the explicit ambient-randomness escape hatch', () => {
  test('returns a 0..1 float when NO seeded context is active', () => {
    clearActiveRng();
    const v = unseededRandom();
    expect(v).toBeGreaterThanOrEqual(0);
    expect(v).toBeLessThan(1);
  });

  test('throws while a seeded generation is active (an unseeded draw there is a bug)', () => {
    setActiveRng(createPRNG('scope'));
    expect(() => unseededRandom()).toThrow(/seeded RNG is active/);
  });

  test('src/generators/** never calls the escape hatch (source pin, code not comments)', () => {
    // The eslint determinism block cannot see this (unseededRandom is not a
    // banned global), so pin it here: the seeded trees must not import the
    // ambient hatch. Enumerating sanctioned ambient draws must stay a grep
    // over UI/lib code only.
    const root = fileURLToPath(new URL('../../src', import.meta.url));
    const offenders = [];
    const walk = (dir) => {
      for (const name of readdirSync(dir)) {
        const full = `${dir}/${name}`;
        if (statSync(full).isDirectory()) walk(full);
        else if (/\.(js|jsx)$/.test(name)) {
          const code = readFileSync(full, 'utf8')
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/\/\/.*$/gm, '');
          if (/\bunseededRandom\b/.test(code)) offenders.push(full);
        }
      }
    };
    walk(`${root}/generators`);
    walk(`${root}/domain`);
    expect(offenders).toEqual([]);
  });
});
