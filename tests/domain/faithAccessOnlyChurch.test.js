/**
 * R2-CODE-B item 6 — "WALK TO THE NEXT VILLAGE'S PARISH CHURCH" ONLY WHERE THE RECORD GIVES THAT ACCESS
 * (the cold list REVIEW-W2A-3, f385d487b: MEDIUM #180, a famine thorp whose roster's one "Access to" row
 * is "Access to external mill"; its Burial ground: "No clergy lives near enough to speak over anyone").
 */
import { describe, expect, test } from 'vitest';
import { faithLinesOf, faithReadingOf } from '../../src/domain/dossier/faithReading.js';

const thorp = (institutions) => ({ tier: 'thorp', population: 26, institutions, npcs: [], powerStructure: { factions: [] } });
const lines = (s) => faithLinesOf(faithReadingOf(s), { tierNoun: 'thorp' }).join(' ');

describe('access to a church is access to a church', () => {
  test('an access to an external mill gives no walk to a parish church', () => {
    const text = lines(thorp([{ name: 'Access to external mill' }, { name: 'Burial ground' }]));
    expect(text.length).toBeGreaterThan(0);
    expect(/parish church/.test(text), text).toBe(false);
    // what prints in its place names no shrine the roster lacks
    expect(/shrines/.test(text), text).toBe(false);
    expect(text).toMatch(/no god is named here/);
  });
  test('a thorp with a wayside shrine keeps its shrines line', () => {
    expect(lines(thorp([{ name: 'Wayside shrine' }]))).toMatch(/the shrines answer to no named god/);
  });
  test('an access to the parish church keeps the walk, by its key or the seam\'s label', () => {
    expect(lines(thorp([{ name: 'Access to parish church' }]))).toMatch(/walk to the next village’s parish church/);
    expect(lines(thorp([{ name: 'Access to a house of worship' }]))).toMatch(/walk to the next village’s parish church/);
  });
});
