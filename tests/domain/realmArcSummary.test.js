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
