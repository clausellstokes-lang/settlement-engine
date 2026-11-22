/**
 * @vitest-environment jsdom
 *
 * tests/ui/worldpulse.smoke.test.jsx — decomposition lock-in.
 *
 * WorldPulsePanel.jsx had its module-scope helpers and presentational
 * primitives extracted into two sibling modules under src/components/map/:
 *   - WorldPulseData.js        (pure data helpers + constant Sets)
 *   - WorldPulsePrimitives.jsx (Pill, EntityPill, OutcomeCard, SmallButton,
 *                               Section, NameAttackerControl)
 * This is a behaviour-preserving move, so the regression net is: the panel
 * still imports as a function and still mounts without throwing, wiring the
 * extracted imports back together correctly. If a relative-path or named
 * import broke in the split, the render below throws and this test fails.
 *
 * The panel reads four store actions + savedSettlements on mount; we mock the
 * store with sane defaults. We render the canonized branch (worldState with a
 * canonizedAt) so the main grid — which uses Section/OutcomeCard/Pill — is
 * exercised, then a draft branch (no canonizedAt) which exercises the
 * Canonize SmallButton path.
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';

afterEach(cleanup);

const storeState = {
  applyWorldPulseProposal: vi.fn(() => Promise.resolve(true)),
  dismissWorldPulseProposal: vi.fn(() => Promise.resolve(true)),
  canonizeCampaignWorld: vi.fn(() => Promise.resolve()),
  recordPartyImpact: vi.fn(() => Promise.resolve()),
  savedSettlements: [],
};

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) {
    return selector(storeState);
  }
  useStore.getState = () => storeState;
  useStore.subscribe = () => () => {};
  return { useStore };
});

describe('WorldPulsePanel — decomposition smoke', () => {
  test('default export is a function component', async () => {
    const mod = await import('../../src/components/map/WorldPulsePanel.jsx');
    expect(typeof mod.default).toBe('function');
  });

  test('mounts the canonized world without throwing', async () => {
    const { default: WorldPulsePanel } = await import('../../src/components/map/WorldPulsePanel.jsx');
    const campaign = {
      id: 'c1',
      name: 'Test Campaign',
      worldState: {
        canonizedAt: '2026-01-01T00:00:00.000Z',
        tick: 3,
        calendar: { season: 'spring' },
        simulationRules: { propagationMode: 'full', intensity: 'normal' },
        proposals: [],
        pulseHistory: [],
        stressors: [],
      },
    };
    const { container } = render(<WorldPulsePanel campaign={campaign} />);
    expect(container.firstChild).not.toBeNull();
  });

  test('mounts the draft (un-canonized) world and renders the canonize button', async () => {
    const { default: WorldPulsePanel } = await import('../../src/components/map/WorldPulsePanel.jsx');
    const campaign = { id: 'c2', name: 'Draft Campaign', worldState: {} };
    const { container } = render(<WorldPulsePanel campaign={campaign} />);
    expect(container.querySelectorAll('button').length).toBeGreaterThan(0);
  });
});
