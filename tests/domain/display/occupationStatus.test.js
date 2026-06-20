import { describe, expect, test } from 'vitest';

import {
  occupationStatePhrase,
  resistancePhrase,
  settlementOccupation,
  occupierHoldings,
  occupationStandings,
  hasLiveOccupation,
} from '../../../src/domain/display/occupationStatus.js';

// ─────────────────────────────────────────────────────────────────────────────
// Phase B3 — occupation burden/benefit/resistance + who-resists, in DM heuristic
// language. NO internals (no state enum surfaced raw, no resistance/benefit float).
// Self-gating: a war-off campaign (no occupations key) surfaces nothing.
// ─────────────────────────────────────────────────────────────────────────────

describe('occupationStatus — heuristic phrasing (no jargon)', () => {
  test('state phrase is DM-facing, not the enum', () => {
    expect(occupationStatePhrase('contested')).toMatch(/not yet taken hold|contested occupation/i);
    expect(occupationStatePhrase('vassalized')).toMatch(/client state/i);
    expect(occupationStatePhrase('stabilized')).toMatch(/holds it firmly/i);
  });

  test('resistance phrase buckets into words, no float', () => {
    expect(resistancePhrase(0.8)).toMatch(/revolt/i);
    expect(resistancePhrase(0.1)).toMatch(/quiescent/i);
    expect(resistancePhrase(0.8)).not.toMatch(/\d/);
  });
});

describe('occupationStatus — settlement reads + standings', () => {
  const worldState = {
    occupations: {
      conquered: { occupierId: 'empire', state: 'contested', resistance: 0.7, sinceTick: 0 },
      pacified: { occupierId: 'empire', state: 'stabilized', resistance: 0.1, sinceTick: 0 },
    },
  };
  const nameFor = (id) => `Name-${id}`;

  test('the occupied side reads its occupier + burden in words', () => {
    const occ = settlementOccupation({ settlementId: 'conquered', worldState, nameFor });
    expect(occ).not.toBeNull();
    expect(occ.occupierName).toBe('Name-empire');
    expect(occ.pays).toBe(false);
    expect(occ.burdened).toBe(true);
    expect(occ.resistancePhrase).toMatch(/revolt/i);
    // A non-occupied settlement surfaces nothing.
    expect(settlementOccupation({ settlementId: 'free', worldState, nameFor })).toBeNull();
  });

  test('the occupier side reads who it holds + overextension', () => {
    const holds = occupierHoldings({ settlementId: 'empire', worldState, nameFor });
    expect(holds).not.toBeNull();
    expect(holds.holds.map(h => h.name).sort()).toEqual(['Name-conquered', 'Name-pacified']);
    // A non-occupier surfaces nothing.
    expect(occupierHoldings({ settlementId: 'conquered', worldState, nameFor })).toBeNull();
  });

  test('standings name both parties; codepoint-sorted; inert when absent', () => {
    const st = occupationStandings({ worldState, nameFor });
    expect(st.map(s => s.occupiedId)).toEqual(['conquered', 'pacified']);
    expect(st[0].occupierName).toBe('Name-empire');
    expect(hasLiveOccupation({ worldState })).toBe(true);
    // War-off campaign has no occupations key.
    expect(occupationStandings({ worldState: {} })).toEqual([]);
    expect(hasLiveOccupation({ worldState: {} })).toBe(false);
  });
});
