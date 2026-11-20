/**
 * tests/domain/tension/sideArchetypes.walker.test.js — EVERY SIDE A TENSION CAN PRINT IS CLASSED (FRAME-1, the seventh
 * chair's CF5). Walks every side list `HISTORICAL_EVENTS_DATA` can write (each type's own three and the three of each
 * memory form) and reds on a label `SIDE_ARCHETYPE` does not class, on a classed label the data cannot write, and on a
 * ladder or a dial outside the closed sets. (A memory form may change what a side IS: the great fire's unanchored sides
 * are a building law's quarrel, not the blame for a fire; so each label is classed by its own words, never by its place.)
 * @enforcement-walker
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { HISTORICAL_EVENTS_DATA } from '../../../src/data/historyData.js';
import {
  ARCHETYPE_LADDER, FACE_KINDS, FRAME_TUNING, GENERATOR_REPLACED_SIDES, SIDE_ARCHETYPE, SIDE_ARCHETYPES, TROUBLE_MATTER,
} from '../../../src/domain/tension/sideArchetypes.js';

/** Every side list of every type: [type, form, labels]. */
const LISTS = HISTORICAL_EVENTS_DATA.flatMap((e) => [
  [e.type, 'own', e.factions],
  ...Object.entries(e.byMemory || {}).map(([form, m]) => [e.type, form, m.factions]),
].filter(([, , f]) => Array.isArray(f)));

describe('every side label is classed into one archetype (CF5)', () => {
  it('the walk is the whole table: 29 types, 49 side lists, 147 places, 130 labels (a new list or label moves these and reds below)', () => {
    expect(HISTORICAL_EVENTS_DATA.length).toBe(29);
    expect(LISTS.length).toBe(49);
    expect(LISTS.reduce((n, [, , f]) => n + f.length, 0)).toBe(147);
    expect(new Set(LISTS.flatMap(([, , f]) => f)).size).toBe(130);
  });

  it('no label is left unclassed, and the table classes no label the data cannot write', () => {
    const labels = new Set(LISTS.flatMap(([, , f]) => f));
    const unclassed = [...labels].filter((l) => !Object.hasOwn(SIDE_ARCHETYPE, l));
    expect(unclassed).toEqual([]);
    const stale = Object.keys(SIDE_ARCHETYPE).filter((l) => !labels.has(l));
    expect(stale).toEqual([]);
    for (const a of Object.values(SIDE_ARCHETYPE)) expect(SIDE_ARCHETYPES).toContain(a);
  });

  it('every archetype has a ladder of known kinds, each with a rate in [0, 1]; every dial is in the one tuning table', () => {
    for (const a of SIDE_ARCHETYPES) {
      const ladder = ARCHETYPE_LADDER[a];
      expect(ladder.length, a).toBeGreaterThan(0);
      for (const k of ladder) {
        expect(FACE_KINDS, `${a}: ${k}`).toContain(k);
        const rate = FRAME_TUNING.rates[a][k];
        expect(typeof rate, `${a}.${k}`).toBe('number');
        expect(rate).toBeGreaterThanOrEqual(0);
        expect(rate).toBeLessThanOrEqual(1);
      }
      expect(Object.keys(FRAME_TUNING.rates[a]).sort()).toEqual([...ladder].sort());
    }
    expect(Object.isFrozen(FRAME_TUNING) && Object.isFrozen(FRAME_TUNING.rates)).toBe(true);
    expect(FRAME_TUNING.officeSidesMax).toBe(1);
    expect(FRAME_TUNING.seatSidesMax).toBe(1);
  });

  it('the labels the generator writes over are exactly its own replacements, each at its place in every form of its type', () => {
    const src = readFileSync(new URL('../../../src/generators/historyGenerator.js', import.meta.url), 'utf8');
    const body = src.slice(src.indexOf('const substituteNames'), src.indexOf('return result;', src.indexOf('const substituteNames')));
    const replaced = [...body.matchAll(/\.replace\(\/([A-Z][^/]+)\/g,/g)].map((m) => m[1]).sort();
    expect(replaced.length).toBe(7);
    const table = Object.values(GENERATOR_REPLACED_SIDES).flatMap((byAt) => Object.values(byAt));
    expect([...new Set(table)].sort()).toEqual(replaced);
    const where = [];
    for (const [type, , f] of LISTS) f.forEach((l, i) => { if (replaced.includes(l)) where.push(`${type}[${i}]=${l}`); });
    const pinned = Object.entries(GENERATOR_REPLACED_SIDES).flatMap(([type, byAt]) => Object.entries(byAt).map(([i, l]) => `${type}[${i}]=${l}`));
    expect([...new Set(where)].sort()).toEqual(pinned.sort());
  });

  it('every type the data can write has its matter, or is one the default covers by name', () => {
    const missing = HISTORICAL_EVENTS_DATA.map((e) => e.type).filter((t) => !Object.hasOwn(TROUBLE_MATTER, t));
    expect(missing).toEqual([]);
  });
});
