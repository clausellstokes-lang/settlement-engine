/**
 * presumeTimeLens.test.js — COHERENCE-PRESUME, the chair's ruling B (2026-11-11): time is a thing a
 * line can presume. Two pins the corpus walker cannot hold, each red before its cure:
 *   1. THE HISTORY LENS (generalStateProse.js :: yearBand): the herald's ladder calls anything up to
 *      twenty-five years "a decade", so the page printed "a decade old" beside "23y ago". A span the
 *      lens calls a decade is at most fifteen years; past that it is a generation.
 *   2. THE SIEGE LINE (narrative/siegeCapability.js): "The X is still present in living memory" may
 *      name only an event inside living memory — sixty years, the ladder's own "older than its bearers"
 *      line — whatever the town's age (an old town's thirty per cent of its age reached ninety years).
 */
import { describe, expect, test } from 'vitest';

import { yearBand } from '../../src/domain/display/stateProse/generalStateProse.js';
import { generateSiegeCapability } from '../../src/generators/narrative/siegeCapability.js';

describe('COHERENCE-PRESUME: time on the page', () => {
  test('the history lens calls no span over fifteen years "a decade", and keeps the ladder elsewhere', () => {
    const wrong = [];
    for (let y = 0; y <= 400; y++) {
      const band = yearBand(y);
      if (band.id === 'a_decade' && y > 15) wrong.push(`${y}y: ${band.predicate}`);
      if (band.id === 'older_than_bearers' && y <= 60) wrong.push(`${y}y: ${band.predicate}`);
    }
    expect(wrong).toEqual([]);
    expect(yearBand(23).predicate).toBe('a generation old');
    expect(yearBand(12).predicate).toBe('a decade old');
    expect(yearBand(5).predicate).toBe('years old');
    expect(yearBand(182).predicate).toBe('older than anyone living'); // R3-CODE-C-2 #ww-470: the sixth band's word, re-keyed
  });

  test('the siege line names living memory only inside sixty years', () => {
    const tensions = [{ description: 'The town is still divided over the surrender' }];
    const old = generateSiegeCapability([{ name: 'The Siege', type: 'political', yearsAgo: 63 }], tensions, 300);
    expect(typeof old === 'string' && /living memory/.test(old)).toBe(false);
    const young = generateSiegeCapability([{ name: 'The Siege', type: 'political', yearsAgo: 20 }], tensions, 300);
    expect(young).toBe('The Siege is still present in living memory: The town is still divided over the surrender.');
  });
});
