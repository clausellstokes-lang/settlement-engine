/**
 * F10 unit 4 (rung 1C, 2026-11-04): the generation-time writers print walls, a garrison or
 * soldiers only where the place's own defence record holds them.
 *
 * Red-first on three of the 1,000-soak's remaining 35 defence-words seeds, one per group:
 *   soak1k-452  the military loyalty hook "Someone is paying their soldiers more than their
 *               salary." in a place with no garrison or hired company (the hook-truth gate);
 *   soak1k-15   the town council's "Public works: Walls, wells, roads, and the watch" with no
 *               enclosure (`data/defenceTwinLines.js`);
 *   soak1k-213  the wartime Guard Captain's "Keep unit cohesion as conscription pulls away
 *               experienced soldiers…" with no garrison or hired company (the same table).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { defenseFactsOf } from '../../src/domain/defense/defenseFacts.js';
import { defenseWordsFindings } from '../../src/domain/coherence/defenseWordsFindings.js';
import { DEFENCE_TWIN_LINES, defenceTwinLine } from '../../src/data/defenceTwinLines.js';

/** Every string the record stores, depth-first. @param {unknown} v @param {string[]} [out] */
function strings(v, out = []) {
  if (typeof v === 'string') out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => strings(x, out));
  else if (v && typeof v === 'object') Object.values(v).forEach((x) => strings(x, out));
  return out;
}

/** @type {Record<number, { settlement: any, text: string[] }>} */
const BIRTHS = {};

beforeAll(async () => {
  await ensureLaws();
  for (const i of [452, 15, 213]) {
    const { settlement } = birth(i);
    BIRTHS[i] = { settlement, text: strings(settlement) };
  }
}, 120_000);

describe('F10 unit 4 · the three soak seeds', () => {
  it('soak1k-452 stores no soldiers hook where no garrison or hired company stands', () => {
    const { settlement, text } = BIRTHS[452];
    const f = defenseFactsOf(settlement);
    expect(f.hasGarrison || f.hasMercenary).toBe(false);
    expect(text.filter((s) => /paying their soldiers/.test(s))).toEqual([]);
  });

  it('soak1k-15 keeps its public works without the walls it lacks', () => {
    const { settlement, text } = BIRTHS[15];
    expect(defenseFactsOf(settlement).hasWalls).toBe(false);
    expect(text).not.toContain('Walls, wells, roads, and the watch'); // anchored: the next line pins the wall-free twin in this same text
    expect(text).toContain('Wells, roads and the common ground');
  });

  it('soak1k-213 gives its wartime Guard Captain a goal with no soldiers in it', () => {
    const { settlement, text } = BIRTHS[213];
    const f = defenseFactsOf(settlement);
    expect(f.hasGarrison || f.hasMercenary).toBe(false);
    expect(text.filter((s) => /conscription pulls away experienced soldiers/.test(s))).toEqual([]);
    expect(text.some((s) => /the call-up pulls away experienced hands/.test(s))).toBe(true);
  });
});

describe('F10 unit 4 · the twin table', () => {
  const BARE = { institutions: [] };
  const STRONG = {
    institutions: [{ name: 'Massive Walls', category: 'Defense' }, { name: 'Garrison', category: 'Defense' }],
  };

  it('every line the table keys is a defence-words finding on a bare place, and its twin is not', () => {
    const wrong = [];
    for (const [line, { twin }] of Object.entries(DEFENCE_TWIN_LINES)) {
      if (defenseWordsFindings(BARE, line).length === 0) wrong.push(`not a finding: ${line}`);
      if (defenseWordsFindings(BARE, twin).length !== 0) wrong.push(`twin is a finding: ${twin}`);
    }
    expect(wrong).toEqual([]);
    expect(Object.keys(DEFENCE_TWIN_LINES).length).toBeGreaterThanOrEqual(10);
  });

  it('a place that holds the thing keeps the line to the byte; one that lacks it takes the twin', () => {
    const strong = defenseFactsOf(STRONG);
    const bare = defenseFactsOf(BARE);
    for (const [line, { twin }] of Object.entries(DEFENCE_TWIN_LINES)) {
      expect(defenceTwinLine(line, strong)).toBe(line);
      expect(defenceTwinLine(line, bare)).toBe(twin);
    }
    expect(defenceTwinLine('A line the table does not key.', bare)).toBe('A line the table does not key.');
    expect(defenceTwinLine(null, bare)).toBe(null);
  });
});
