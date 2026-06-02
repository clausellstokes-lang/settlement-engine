/** @vitest-environment jsdom */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import WorldPulsePanel from '../../src/components/map/WorldPulsePanel.jsx';

const actions = {
  applyWorldPulseProposal: vi.fn(),
  dismissWorldPulseProposal: vi.fn(),
};

vi.mock('../../src/store/index.js', () => ({
  useStore: selector => selector(actions),
}));

describe('WorldPulsePanel', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  test('renders pulse history, roll explanations, and proposal actions', () => {
    const campaign = {
      id: 'camp-1',
      name: 'Realm',
      worldState: {
        tick: 2,
        calendar: { season: 'spring' },
        proposals: [{
          id: 'proposal-1',
          status: 'pending',
          headline: 'Famine pressure may take hold',
          summary: 'Food pressure has crossed a threshold.',
          severity: 0.82,
          reasons: ['food pressure'],
        }],
        pulseHistory: [{
          tick: 2,
          interval: 'one_month',
          candidateCount: 4,
          selectedCount: 2,
          autoAppliedCount: 1,
          proposalCount: 1,
          calendar: { season: 'spring' },
          resolvedStressors: [{
            id: 'stressor-1',
            type: 'disease_outbreak',
            label: 'Disease outbreak',
            resolutionRoll: 0.12,
            resolutionChance: 0.42,
          }],
          rollExplanations: [{
            candidateId: 'candidate-1',
            candidateType: 'food_pressure',
            severity: 0.82,
            probability: 0.5,
            roll: 0.3,
            passed: true,
          }],
        }],
      },
    };

    render(<WorldPulsePanel campaign={campaign} />);

    expect(screen.getByText('World Pulse')).toBeTruthy();
    expect(screen.getByText('Famine pressure may take hold')).toBeTruthy();
    expect(screen.getByText('Disease outbreak resolved')).toBeTruthy();
    expect(screen.getAllByText('food pressure').length).toBeGreaterThan(0);

    fireEvent.click(screen.getByTitle('Apply proposal'));
    fireEvent.click(screen.getByTitle('Dismiss proposal'));

    expect(actions.applyWorldPulseProposal).toHaveBeenCalledWith('camp-1', 'proposal-1');
    expect(actions.dismissWorldPulseProposal).toHaveBeenCalledWith('camp-1', 'proposal-1');
  });
});
