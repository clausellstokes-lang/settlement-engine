/**
 * lineOnFinal.test.js — SURVEY S-A's one helper (the chair's ruling S-A-1): a stored line re-answered on the final
 * record by the door's own rule; not found: as stored and counted.
 */
import { describe, it, expect } from 'vitest';
import { lineOnFinal, lineOnFinalOf } from '../../../src/domain/facts/lineOnFinal.js';

/** A facts object answering the presence atoms it is given. @param {Record<string, boolean>} held */
const factsWith = (held) => ({ ...held });

const SET = Object.freeze({
  'Duties by road or harbour.': Object.freeze([
    Object.freeze({ text: 'Duties by road or harbour.', needs: ['market'] }),
    Object.freeze({ text: 'Duties by road.', twinOf: 'Duties by road or harbour.', excludes: ['market'] }),
  ]),
});

describe('lineOnFinal: a sibling set', () => {
  it('an admitted original prints as stored', () => {
    expect(lineOnFinalOf('Duties by road or harbour.', { siblings: SET }, factsWith({ market: true }))).toEqual({ text: 'Duties by road or harbour.', found: true, moved: false });
  });
  it('a refused original prints its twin', () => {
    expect(lineOnFinal('Duties by road or harbour.', { siblings: SET }, factsWith({ market: false }))).toBe('Duties by road.');
  });
  it('a stored twin whose original the final record admits prints the original', () => {
    expect(lineOnFinalOf('Duties by road.', { siblings: SET }, factsWith({ market: true }))).toEqual({ text: 'Duties by road or harbour.', found: true, moved: true });
  });
  it('a stored twin its OWN declaration admits stays as stored, even where the original is admitted too', () => {
    const BOTH = Object.freeze({ 'Ale by the barrel.': Object.freeze([
      Object.freeze({ text: 'Ale by the barrel.', needs: ['market'] }),
      Object.freeze({ text: 'Ale for the hall.', twinOf: 'Ale by the barrel.' }),
    ]) });
    expect(lineOnFinalOf('Ale for the hall.', { siblings: BOTH }, factsWith({ market: true }))).toEqual({ text: 'Ale for the hall.', found: true, moved: false });
  });
  it('nothing admitted: nothing, or the stored text where the home keeps its slot', () => {
    expect(lineOnFinal('Duties by road.', { siblings: SET }, factsWith({}))).toBe(null);
    expect(lineOnFinal('Duties by road.', { siblings: SET, keep: true }, factsWith({}))).toBe('Duties by road.');
  });
  it('the voice the line was stored in is matched and kept', () => {
    const speak = (/** @type {string} */ t) => t.replace('road', 'lane');
    expect(lineOnFinal('Duties by lane.', { siblings: SET, speak }, factsWith({ market: true }))).toBe('Duties by lane or harbour.');
  });
});

describe('lineOnFinal: a pool', () => {
  const POOL = Object.freeze([
    Object.freeze({ text: 'A guild master is missing.', needs: ['market'] }),
    'A cart lost a wheel.',
    'A well ran dry.',
    Object.freeze({ text: 'A mason is missing.', twinOf: 'A guild master is missing.', excludes: ['market'] }),
  ]);
  it('admitted: as stored', () => {
    expect(lineOnFinal('A guild master is missing.', { pool: POOL }, factsWith({ market: true }))).toBe('A guild master is missing.');
  });
  it('refused: its twin', () => {
    expect(lineOnFinal('A guild master is missing.', { pool: POOL }, factsWith({ market: false }))).toBe('A mason is missing.');
  });
  it('refused with no admitted twin: the next admitted line by the door\'s hash, never one the caller holds', () => {
    const noTwin = POOL.slice(0, 3);
    const next = lineOnFinal('A guild master is missing.', { pool: noTwin, key: 'k' }, factsWith({ market: false }));
    expect(['A cart lost a wheel.', 'A well ran dry.']).toContain(next);
    const other = next === 'A cart lost a wheel.' ? 'A well ran dry.' : 'A cart lost a wheel.';
    expect(lineOnFinal('A guild master is missing.', { pool: noTwin, key: 'k', held: new Set([next]) }, factsWith({ market: false }))).toBe(other);
    expect(lineOnFinal('A guild master is missing.', { pool: noTwin, key: 'k', held: new Set(['A cart lost a wheel.', 'A well ran dry.']) }, factsWith({ market: false }))).toBe(null);
  });
});

describe('lineOnFinal: what no home knows', () => {
  it('prints as stored, counted as not found', () => {
    expect(lineOnFinalOf('Our own words.', { siblings: SET }, factsWith({ market: false }))).toEqual({ text: 'Our own words.', found: false, moved: false });
    expect(lineOnFinalOf('Our own words.', { pool: [] }, null)).toEqual({ text: 'Our own words.', found: false, moved: false });
  });
  it('no facts: as stored (an unanswered record never empties a line)', () => {
    expect(lineOnFinal('Duties by road.', { siblings: SET }, null)).toBe('Duties by road.');
  });
});
