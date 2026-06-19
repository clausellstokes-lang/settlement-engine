/**
 * @vitest-environment jsdom
 *
 * tests/ui/pantheonActivationStrip.test.jsx — UX Phase 8.
 *
 * The pantheon activation strip teaches the dormant-until-assigned + premium
 * model. Its three milestones (authored / assigned / dynamics-on) are computed
 * by the exported pure `computePantheonActivation`, which we exercise directly,
 * plus a render assertion that the strip reflects the live vs dormant state.
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

afterEach(cleanup);

const storeState = {
  customContent: {},
  settlement: null,
  savedSettlements: [],
  campaigns: [],
};

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});

async function importStrip() {
  return await import('../../src/components/compendium/PantheonActivationStrip.jsx');
}

describe('computePantheonActivation', () => {
  test('reflects authored / assigned / dynamics-on independently', async () => {
    const { computePantheonActivation } = await importStrip();

    expect(computePantheonActivation({})).toEqual({
      authoredCount: 0, authored: false, assigned: false, dynamicsOn: false,
    });

    // Authored only.
    expect(computePantheonActivation({
      customContent: { deities: [{ name: 'Mara' }, { name: 'Korth' }] },
    })).toMatchObject({ authoredCount: 2, authored: true, assigned: false, dynamicsOn: false });

    // Assigned via the CURRENT settlement's embedded snapshot.
    expect(computePantheonActivation({
      customContent: { deities: [{ name: 'Mara' }] },
      settlement: { config: { primaryDeitySnapshot: { rankAxis: 'major' } } },
    })).toMatchObject({ authored: true, assigned: true });

    // Assigned via a SAVED settlement's snapshot.
    expect(computePantheonActivation({
      customContent: { deities: [{ name: 'Mara' }] },
      savedSettlements: [{ settlement: { config: { primaryDeitySnapshot: { rankAxis: 'minor' } } } }],
    })).toMatchObject({ assigned: true });

    // Dynamics on via a campaign rule.
    expect(computePantheonActivation({
      customContent: { deities: [{ name: 'Mara' }] },
      campaigns: [{ worldState: { simulationRules: { religionDynamicsEnabled: true } } }],
    })).toMatchObject({ dynamicsOn: true });
  });
});

describe('PantheonActivationStrip render', () => {
  test('renders nothing when no deities are authored', async () => {
    storeState.customContent = {};
    storeState.settlement = null;
    storeState.savedSettlements = [];
    storeState.campaigns = [];
    const { default: PantheonActivationStrip } = await importStrip();
    const { container } = render(<PantheonActivationStrip />);
    expect(container.firstChild).toBeNull();
  });

  test('shows Dormant until all three milestones hold, then Live', async () => {
    const { default: PantheonActivationStrip } = await importStrip();

    // Authored only → Dormant.
    storeState.customContent = { deities: [{ name: 'Mara' }] };
    storeState.settlement = null;
    storeState.savedSettlements = [];
    storeState.campaigns = [];
    const { rerender } = render(<PantheonActivationStrip />);
    expect(screen.getByTestId('pantheon-activation-strip')).toBeTruthy();
    expect(screen.getByText('Dormant')).toBeTruthy();

    // All three → Live.
    storeState.settlement = { config: { primaryDeitySnapshot: { rankAxis: 'major' } } };
    storeState.campaigns = [{ worldState: { simulationRules: { religionDynamicsEnabled: true } } }];
    rerender(<PantheonActivationStrip />);
    expect(screen.getByText('Live')).toBeTruthy();
  });
});
