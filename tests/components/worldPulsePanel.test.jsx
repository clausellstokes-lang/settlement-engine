/** @vitest-environment jsdom */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

import WorldPulsePanel from '../../src/components/map/WorldPulsePanel.jsx';

const actions = {
  applyWorldPulseProposal: vi.fn(),
  dismissWorldPulseProposal: vi.fn(),
  recordPartyImpact: vi.fn(),
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

  test('renders live stressors with counterforce/synergy/attacker context, and echoes as living memory', () => {
    const campaign = {
      id: 'camp-2',
      name: 'Realm',
      worldState: {
        canonizedAt: '2026-01-01T00:00:00.000Z',
        tick: 9,
        calendar: { season: 'winter' },
        proposals: [],
        pulseHistory: [],
        stressors: [
          {
            id: 'world_stressor.siege.ashford',
            type: 'siege',
            label: 'Siege pressure',
            status: 'active',
            lifecycleStage: 'peaking',
            severity: 0.84,
            durationPolicy: 'structural',
            affectedSettlementIds: ['ashford'],
            counterforce: { score: 0.31, resolutionDelta: -0.03, decayMultiplier: 0.7, floorsMet: false },
            synergy: { companions: ['famine'], decayMult: 0.8, resolutionDelta: -0.05, blocksResolution: false },
            originContext: { variant: 'unattributed', attackerSettlementId: null, attackerLabel: 'The Red Fang warband' },
          },
          {
            id: 'world_stressor.market_shock.ashford',
            type: 'market_shock',
            label: 'Market shock',
            status: 'residual',
            lifecycleStage: 'residual',
            severity: 0.08,
            memoryStrength: 0.34,
            affectedSettlementIds: ['ashford'],
          },
        ],
      },
    };

    render(<WorldPulsePanel campaign={campaign} />);

    expect(screen.getByText('Active Stressors & Echoes')).toBeTruthy();
    // The active siege card: severity, counterforce explanation, entanglement,
    // origin variant, and the DM-named attacker force.
    expect(screen.getByText('Siege pressure')).toBeTruthy();
    expect(screen.getByText(/resilience 31%/)).toBeTruthy();
    expect(screen.getByText(/a pillar is missing/)).toBeTruthy();
    expect(screen.getByText(/entangled with famine/)).toBeTruthy();
    expect(screen.getByText('The Red Fang warband')).toBeTruthy();
    // The echo card: living-memory framing with fading strength.
    expect(screen.getByText('Market shock — in living memory')).toBeTruthy();
    expect(screen.getByText(/memory 34%/)).toBeTruthy();
  });

  test('a war stressor with no named force shows the attacker as unnamed', () => {
    const campaign = {
      id: 'camp-3',
      name: 'Realm',
      worldState: {
        canonizedAt: '2026-01-01T00:00:00.000Z',
        tick: 3,
        proposals: [],
        pulseHistory: [],
        stressors: [{
          id: 'world_stressor.siege.briar',
          type: 'siege',
          label: 'Siege pressure',
          status: 'active',
          lifecycleStage: 'active',
          severity: 0.7,
          durationPolicy: 'structural',
          affectedSettlementIds: ['briar'],
          originContext: { variant: 'unattributed', attackerSettlementId: null, attackerLabel: null },
        }],
      },
    };

    render(<WorldPulsePanel campaign={campaign} />);
    expect(screen.getByText('unnamed')).toBeTruthy();
  });

  test('variant hooks surface on the card and the DM can name the force inline', async () => {
    actions.recordPartyImpact.mockResolvedValue({ ok: true });
    const campaign = {
      id: 'camp-4',
      name: 'Realm',
      worldState: {
        canonizedAt: '2026-01-01T00:00:00.000Z',
        tick: 4,
        proposals: [],
        pulseHistory: [],
        stressors: [{
          id: 'world_stressor.siege.briar',
          type: 'siege',
          label: 'Siege pressure',
          status: 'active',
          lifecycleStage: 'active',
          severity: 0.7,
          durationPolicy: 'structural',
          affectedSettlementIds: ['briar'],
          originContext: {
            variant: 'unattributed',
            attackerSettlementId: null,
            attackerLabel: null,
            reason: 'No hostile neighbor claims this.',
            hooks: ['No banner has been raised. Scouts could put a name to the besiegers.'],
          },
        }],
      },
    };

    render(<WorldPulsePanel campaign={campaign} />);
    // Hooks render in the card summary.
    expect(screen.getByText(/Scouts could put a name to the besiegers/)).toBeTruthy();
    // Naming flow: type a force name, click Name, store action fires.
    const input = screen.getByLabelText('Name the force behind Siege pressure');
    fireEvent.change(input, { target: { value: 'The Red Fang warband' } });
    fireEvent.click(screen.getByTitle('Name attacker'));
    await waitFor(() => {
      expect(actions.recordPartyImpact).toHaveBeenCalledWith('camp-4', expect.objectContaining({
        kind: 'name_attacker',
        stressorId: 'world_stressor.siege.briar',
        attackerLabel: 'The Red Fang warband',
      }));
    });
  });

  test('an already-named war stressor shows no naming control', () => {
    const campaign = {
      id: 'camp-5',
      name: 'Realm',
      worldState: {
        canonizedAt: '2026-01-01T00:00:00.000Z',
        tick: 5,
        proposals: [],
        pulseHistory: [],
        stressors: [{
          id: 'world_stressor.siege.briar',
          type: 'siege',
          label: 'Siege pressure',
          status: 'active',
          lifecycleStage: 'active',
          severity: 0.7,
          durationPolicy: 'structural',
          affectedSettlementIds: ['briar'],
          originContext: { variant: 'unattributed', attackerSettlementId: null, attackerLabel: 'The Red Fang warband' },
        }],
      },
    };

    render(<WorldPulsePanel campaign={campaign} />);
    expect(screen.queryByTitle('Name attacker')).toBeNull();
    expect(screen.getByText('The Red Fang warband')).toBeTruthy();
  });
});
