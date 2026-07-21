/**
 * @vitest-environment jsdom
 *
 * tests/ui/wizardEmptyStateReplay.test.jsx — CREATE-PAGE DEMOTION (Walk W1, owner
 * order 2026-07-21).
 *
 * RegionWakeReplay (the anon "watch a region wake up" teaser) was UNMOUNTED from the
 * /create empty state — that job moved to the landing/welcome page. This pins that the
 * Create empty state no longer mounts it, even for an anon visitor with no settlement
 * (the state that previously rendered it). The REAL RegionWakeReplay is imported so a
 * regression that re-mounted it would surface its testid.
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';

afterEach(cleanup);

let storeState = {};
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.getState = () => storeState;
  return { useStore };
});
vi.mock('../../src/components/HomeHero.jsx', () => ({ default: () => null }));

const { WizardEmptyState } = await import('../../src/components/generate/WizardEmptyState.jsx');

const baseProps = {
  showHomeHero: true, showModePicker: false, isMobile: false,
  wizardMode: null, setWizardMode: () => {}, authTier: 'anon',
  onSignIn: () => {}, onNavigate: vi.fn(),
};

describe('WizardEmptyState no longer mounts RegionWakeReplay (demoted to landing)', () => {
  test('the anon Create empty state does not render the region-wake replay', async () => {
    storeState = { auth: { tier: 'anon' }, settlement: null };
    const { queryByTestId } = render(<WizardEmptyState {...baseProps} />);
    // Let any lazy chunk resolve; the replay must never mount here anymore.
    await new Promise((r) => setTimeout(r, 30));
    expect(queryByTestId('region-wake-replay')).toBeNull();
  });
});
