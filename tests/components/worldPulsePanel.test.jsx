/** @vitest-environment jsdom */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

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

  test('renders pulse history, roll explanations, and proposal actions', async () => {
    actions.applyWorldPulseProposal.mockResolvedValue({ status: 'applied' });
    actions.dismissWorldPulseProposal.mockResolvedValue({ status: 'dismissed' });
    const campaign = {
      id: 'camp-1',
      name: 'Realm',
      worldState: {
        canonizedAt: '2026-01-01T00:00:00.000Z',
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
          selectedOutcomes: [{
            id: 'selected-population',
            type: 'population',
            candidateType: 'population_decline',
            ruleFamily: 'population',
            headline: 'Ashford population may fall',
            summary: 'Ashford loses people from cumulative pressure.',
            severity: 0.44,
            reasons: ['population pressure'],
            populationDeltas: [{ saveId: 'ashford', delta: -12 }],
          }],
          impactDigest: [{
            id: 'wizard_news.2.queued.regional_impact.import',
            headline: 'Briarwatch faces import shortage',
            summary: 'Queued via trade dependency: Ashford can no longer reliably supply grain.',
            kind: 'queued',
            scope: 'regional',
            significance: 'major',
            score: 91,
            impactKind: 'import_shortage',
            channelType: 'trade_dependency',
            severity: 0.78,
            settlementIds: ['ashford', 'briarwatch'],
            reasons: ['high severity'],
          }],
          rollExplanations: [
            {
              candidateId: 'candidate-1',
              candidateType: 'food_pressure',
              severity: 0.82,
              probability: 0.5,
              roll: 0.3,
              passed: true,
            },
            {
              candidateId: 'candidate-2',
              candidateType: 'population_decline',
              severity: 0.44,
              probability: 1,
              roll: 0,
              passed: true,
              conflictResolution: { deterministic: true },
            },
          ],
        }],
      },
    };

    render(<WorldPulsePanel campaign={campaign} />);

    expect(screen.getByText('World Pulse')).toBeTruthy();
    expect(screen.getByText('Famine pressure may take hold')).toBeTruthy();
    expect(screen.getByText('Disease outbreak resolved')).toBeTruthy();
    expect(screen.getByText('Ashford population may fall')).toBeTruthy();
    expect(screen.getByText('Impact Digest')).toBeTruthy();
    expect(screen.getByText('Briarwatch faces import shortage')).toBeTruthy();
    expect(screen.getByText('deterministic')).toBeTruthy();
    expect(screen.getAllByText('food pressure').length).toBeGreaterThan(0);

    fireEvent.click(screen.getByTitle('Apply proposal'));
    await waitFor(() => {
      expect(actions.applyWorldPulseProposal).toHaveBeenCalledWith('camp-1', 'proposal-1');
      expect(screen.getByTitle('Dismiss proposal').disabled).toBe(false);
    });

    fireEvent.click(screen.getByTitle('Dismiss proposal'));
    await waitFor(() => {
      expect(actions.dismissWorldPulseProposal).toHaveBeenCalledWith('camp-1', 'proposal-1');
    });
  });
});
