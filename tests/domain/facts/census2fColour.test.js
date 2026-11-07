/**
 * tests/domain/facts/census2fColour.test.js — CENSUS-2f, after the chair's messages of 06:59 and 07:25:
 *  (1) R-AP amended — a key guarantees exactly what its picker reads, and a line that presumes more
 *      declares the rest: under the fish key a CATCH declares `fish`, water traffic `navigable`, both
 *      where both (the sense `dominant` pool, picked by the exports' fish trade, re-read the same way);
 *  (2) R-AO — the bare lines this seat READ in its MIXED pools are marked `{ text, colour: true }`
 *      ("read; presumes nothing"): the draw and the ledger read them as silence, so nothing moves.
 *      A calm row of a `{crisis-scoped}` pool is NOT marked: there silence presumes calm.
 *
 * @enforced-by npx vitest run tests/domain/facts/census2fColour.test.js
 */
import { describe, expect, it } from 'vitest';
import { ARRIVAL_SENSES } from '../../../src/data/arrivalProse.js';
import { POLITICAL_FLAVOR, POLITICAL_FLAVOR_CRISIS_SCOPED } from '../../../src/generators/narrativeText.js';
import { declarationOf, EMPTY_DECLARATION } from '../../../src/domain/facts/factVocabulary.js';

const sense = (key) => ARRIVAL_SENSES.find((s) => s.key === key);
const needsOf = (line) => (typeof line === 'function' ? [] : declarationOf(line).needs ?? []);
const isColour = (line) => Boolean(line && typeof line === 'object' && line.colour === true);

describe('R-AP amended: the fish key\'s lines declare the catch and the water they presume', () => {
  it('lines: the stalls\' catch (market, navigable, fish); the wet baskets, the nets, the flapping basket (fish)', () => {
    const [stalls, monger, nets, basket] = sense('fish').lines;
    expect(needsOf(stalls)).toEqual(['market', 'navigable', 'fish']);
    for (const l of [monger, nets, basket]) expect(needsOf(l)).toEqual(['fish']);
  });
  it('dominant: the racks of catch (navigable, fish); the gutting (fish); the salt barrels and their gulls (navigable)', () => {
    const [racks, gutting, barrels] = sense('fish').dominant;
    expect(needsOf(racks)).toEqual(['navigable', 'fish']);
    expect(needsOf(gutting)).toEqual(['fish']);
    expect(needsOf(barrels)).toEqual(['navigable']);
  });
});

/** the bare lines this seat read in its mixed pools, by pool and index (R-AO) */
const ARRIVAL_COLOUR = { 'bread.lines': [0, 1, 3], 'faith.lines': [2], 'herbs.dominant': [1, 2] };
const FLAVOR_COLOUR = { disaster_heavy: [0, 1, 2, 3, 5], religious_heavy: [1, 3, 4, 5, 6], magical_heavy: [0, 3, 5] };

describe('R-AO: the read bare lines of the mixed pools are marked colour, and declare nothing', () => {
  it('the arrival senses', () => {
    for (const [pool, idx] of Object.entries(ARRIVAL_COLOUR)) {
      const [key, field] = pool.split('.');
      for (const i of idx) {
        const line = sense(key)[field][i];
        expect(isColour(line), `${pool}[${i}]`).toBe(true);
        expect(declarationOf(line)).toBe(EMPTY_DECLARATION);
      }
    }
  });
  it('POLITICAL_FLAVOR (the crisis-scoped `stable` keeps its calm rows bare)', () => {
    for (const [pool, idx] of Object.entries(FLAVOR_COLOUR)) {
      for (const i of idx) {
        expect(isColour(POLITICAL_FLAVOR[pool][i]), `${pool}[${i}]`).toBe(true);
        expect(declarationOf(POLITICAL_FLAVOR[pool][i])).toBe(EMPTY_DECLARATION);
      }
    }
    expect(POLITICAL_FLAVOR_CRISIS_SCOPED).toContain('stable');
    for (const row of POLITICAL_FLAVOR.stable) expect(isColour(row)).toBe(false);
  });
  it('every other row of those pools declares (the pools are fully read)', () => {
    for (const [pool, idx] of Object.entries(FLAVOR_COLOUR)) {
      POLITICAL_FLAVOR[pool].forEach((row, i) => {
        if (!idx.includes(i)) expect(typeof row === 'object' && !isColour(row), `${pool}[${i}] declares`).toBe(true);
      });
    }
  });
});
