/** @vitest-environment jsdom */
/**
 * tests/components/pantheonDepth.test.jsx — UX Phase 5 Pantheon depth.
 *
 * Pins: the deepened PantheonPanel renders seats-from-Major progress and a
 * conversion-contest preview from a pantheon fixture; and the pure pantheonDepth
 * selectors compute the same model self-gating to empty when dormant.
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';

import {
  seatsFromMajor,
  pantheonStandings,
  contestPreview,
  pantheonDepthModel,
  MAJOR_PROMOTE_SEATS,
} from '../../src/domain/display/pantheonDepth.js';

let STORE = { savedSettlements: [] };
vi.mock('../../src/store/index.js', () => ({
  useStore: Object.assign(selector => selector(STORE), { getState: () => STORE }),
}));

import PantheonPanel from '../../src/components/map/PantheonPanel.jsx';

afterEach(() => { cleanup(); });

describe('pantheonDepth — pure selectors', () => {
  test('seatsFromMajor counts down to the engine MAJOR_PROMOTE threshold', () => {
    expect(seatsFromMajor({ seats: 0, tier: 'cult' })).toBe(MAJOR_PROMOTE_SEATS);
    expect(seatsFromMajor({ seats: MAJOR_PROMOTE_SEATS - 1, tier: 'minor' })).toBe(1);
    expect(seatsFromMajor({ seats: MAJOR_PROMOTE_SEATS, tier: 'major' })).toBe(0);
    // Already major → 0 even if seats dip (hysteresis is the engine's job).
    expect(seatsFromMajor({ seats: 2, tier: 'major' })).toBe(0);
  });

  test('pantheonStandings is empty when dormant (no pantheon key)', () => {
    expect(pantheonStandings({})).toEqual([]);
    expect(pantheonStandings({ pantheon: {} })).toEqual([]);
  });

  test('contestPreview pairs faiths projecting into the same convert', () => {
    const worldState = { pantheon: { 'deity:A': { seats: 3 }, 'deity:B': { seats: 2 } } };
    const regionalGraph = {
      channels: [
        { type: 'religious_authority', status: 'confirmed', from: 's1', to: 'sZ', deityId: 'deity:A' },
        { type: 'religious_authority', status: 'confirmed', from: 's2', to: 'sZ', deityId: 'deity:B' },
      ],
    };
    const contests = contestPreview({ worldState, regionalGraph });
    expect(contests).toHaveLength(1);
    expect(contests[0].contestedId).toBe('sZ');
    expect(new Set([contests[0].aId, contests[0].bId])).toEqual(new Set(['deity:A', 'deity:B']));
    expect(contests[0].aSeats + contests[0].bSeats).toBe(5);
  });

  test('contestPreview is empty when only one faith reaches a convert', () => {
    const worldState = { pantheon: { 'deity:A': { seats: 3 } } };
    const regionalGraph = { channels: [{ type: 'religious_authority', status: 'confirmed', from: 's1', to: 'sZ', deityId: 'deity:A' }] };
    expect(contestPreview({ worldState, regionalGraph })).toEqual([]);
  });

  test('pantheonDepthModel is fully empty for a dormant world', () => {
    const model = pantheonDepthModel({ worldState: {} });
    expect(model.standings).toEqual([]);
    expect(model.contests).toEqual([]);
  });
});

describe('PantheonPanel — depth rendering', () => {
  test('renders seats-from-Major and a contest preview from a fixture', () => {
    STORE = {
      savedSettlements: [
        { id: 's1', name: 'Ashford', settlement: { config: { primaryDeitySnapshot: { name: 'Aurel', _deityRef: 'deity:A', alignmentAxis: 'good', temperamentAxis: 'warlike', rankAxis: 'minor' } } } },
        { id: 's2', name: 'Bram', settlement: { config: { primaryDeitySnapshot: { name: 'Brakka', _deityRef: 'deity:B', alignmentAxis: 'evil', temperamentAxis: 'peacelike', rankAxis: 'cult' } } } },
      ],
    };
    const campaign = {
      id: 'c', name: 'Realm', settlementIds: ['s1', 's2', 'sZ'],
      worldState: { pantheon: { 'deity:A': { tier: 'minor', seats: 3, wins: 2, losses: 1 }, 'deity:B': { tier: 'cult', seats: 1 } } },
      regionalGraph: {
        channels: [
          { type: 'religious_authority', status: 'confirmed', from: 's1', to: 'sZ', deityId: 'deity:A' },
          { type: 'religious_authority', status: 'confirmed', from: 's2', to: 'sZ', deityId: 'deity:B' },
        ],
      },
    };
    const { container } = render(<PantheonPanel campaign={campaign} />);
    // Seats-from-Major progress (deity:A at 3 seats, MAJOR_PROMOTE 4 → 1 from Major).
    expect(container.textContent).toMatch(/from Major/i);
    // Conversion-contest preview block.
    expect(container.querySelector('[data-testid="contest-preview"]')).toBeTruthy();
    expect(container.textContent).toMatch(/Conversion Contests/i);
  });

  test('renders no depth for a dormant pantheon (self-gating)', () => {
    STORE = { savedSettlements: [] };
    const { container } = render(<PantheonPanel campaign={{ id: 'c', name: 'Realm', worldState: {} }} />);
    expect(container.querySelector('[data-testid="contest-preview"]')).toBeNull();
    expect(container.textContent).toMatch(/No pantheon yet/i);
  });
});
