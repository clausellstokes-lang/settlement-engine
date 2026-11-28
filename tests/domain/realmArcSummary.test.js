import { describe, expect, test } from 'vitest';

import { buildRealmArcSummary, realmArcLines } from '../../src/domain/display/realmArcSummary.js';

const SETTLEMENTS = [
  { id: 'a', name: 'Ashford' },
  { id: 'b', name: 'Brackwater' },
  { id: 'c', name: 'Caldmere' },
];

describe('realm-arc summary (§S4)', () => {
  test('a dormant realm yields an EMPTY summary (no extra gallery field)', () => {
    expect(buildRealmArcSummary({ worldState: {}, settlements: SETTLEMENTS })).toBe('');
    expect(realmArcLines({ worldState: {} })).toEqual([]);
    expect(() => buildRealmArcSummary({})).not.toThrow();
  });

  test('an ascendant major deity becomes "The Ascendancy of X"', () => {
    const worldState = {
      pantheon: {
        'deity:Vael': { tier: 'major', seats: 4, wins: 3, losses: 0 },
        'deity:Morr': { tier: 'cult', seats: 0, wins: 0, losses: 2 },
      },
    };
    const settlements = [
      { id: 'a', name: 'Ashford', settlement: { config: { primaryDeitySnapshot: { name: 'Vael', _deityRef: 'deity:Vael' } } } },
    ];
    const lines = realmArcLines({ worldState, settlements });
    expect(lines.some(l => /Ascendancy of Vael/.test(l))).toBe(true);
    expect(lines.some(l => /Twilight of Morr/.test(l))).toBe(true);
  });

  test('a coalition siege becomes "The War of X" naming the besiegers', () => {
    const worldState = { deployments: { a: { targetId: 'c' }, b: { targetId: 'c' } } };
    const regionalGraph = {
      channels: [
        { type: 'war_front', status: 'confirmed', from: 'a', to: 'c' },
        { type: 'war_front', status: 'confirmed', from: 'b', to: 'c' },
      ],
    };
    const summary = buildRealmArcSummary({ worldState, regionalGraph, settlements: SETTLEMENTS });
    expect(summary).toMatch(/War of Caldmere/);
    expect(summary).toMatch(/Ashford/);
    expect(summary).toMatch(/Brackwater/);
    // Bounded scalar string — public-safe.
    expect(summary.length).toBeLessThanOrEqual(600);
  });

  test('a GM-concealed (gm/hidden) war_front never surfaces in the public arc', () => {
    // Defense-in-depth: the gallery-facing arc must match worldSnapshotPublic —
    // a war_front whose visibility is gm/hidden is GM-only and must not name the siege.
    const worldState = { deployments: { a: { targetId: 'c' } } };
    const gmGraph = {
      channels: [
        { type: 'war_front', status: 'confirmed', from: 'a', to: 'c', visibility: 'gm' },
      ],
    };
    expect(realmArcLines({ worldState, regionalGraph: gmGraph, settlements: SETTLEMENTS })).toEqual([]);
    expect(buildRealmArcSummary({ worldState, regionalGraph: gmGraph, settlements: SETTLEMENTS })).toBe('');

    const hiddenGraph = {
      channels: [
        { type: 'war_front', status: 'confirmed', from: 'a', to: 'c', visibility: 'hidden' },
      ],
    };
    expect(realmArcLines({ worldState, regionalGraph: hiddenGraph, settlements: SETTLEMENTS })).toEqual([]);
  });
});

describe('ONE WRITER for the realm-arc sentences (SW-9, STYLE-RULINGS-2 A11)', () => {
  test('the five sentence frames are spelled in realmArcSentences.js alone; both projections read it', async () => {
    const { readFileSync } = await import('node:fs');
    const read = (f) => readFileSync(new URL(`../../src/domain/display/${f}`, import.meta.url), 'utf8');
    const FRAMES = ['The Ascendancy of ${', 'The Twilight of ${', 'besiege the walls.', 'lays siege.', 'Trade War, where ${'];
    const writer = read('realmArcSentences.js');
    for (const f of FRAMES) expect(writer, f).toContain(f);
    for (const file of ['realmArcSummary.js', 'worldSnapshotPublic.js']) {
      const src = read(file);
      expect(src, `${file} reads the one writer`).toContain("from './realmArcSentences.js'");
      for (const f of FRAMES) expect(src.includes(f), `${file} spells "${f}" itself`).toBe(false);
    }
  });
  test('a siege with no named besieger reads "an army", never an empty slot', async () => {
    const { siegeArc } = await import('../../src/domain/display/realmArcSentences.js');
    expect(siegeArc('Hobb', [])).toBe('The War of Hobb, where an army lays siege.');
    expect(siegeArc('Hobb', ['Ash', 'Bree', 'Cole'])).toBe('The War of Hobb, where a coalition of Ash, Bree +1 besiege the walls.');
  });
});

