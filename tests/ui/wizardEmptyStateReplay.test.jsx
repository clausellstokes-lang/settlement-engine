/**
 * @vitest-environment jsdom
 *
 * tests/ui/wizardEmptyStateReplay.test.jsx — experience-product-fit-3.
 *
 * RegionWakeReplay (the anon "watch a region wake up" teaser) was built,
 * copy-registered, and domain-tested but never mounted. This pins the mount: the
 * anon /create empty state renders it below the sample dossier, and it self-gates to
 * nothing once the visitor is signed in (tier !== 'anon') or has a settlement.
 *
 * HomeHero + HomeSampleDossier are stubbed so the test isolates the replay wiring;
 * the REAL RegionWakeReplay is exercised (its own anon/settlement self-gate).
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
vi.mock('../../src/components/home/HomeSampleDossier.jsx', () => ({ default: () => null }));

const { WizardEmptyState } = await import('../../src/components/generate/WizardEmptyState.jsx');

const baseProps = {
  showHomeHero: true, showModePicker: false, isMobile: false,
  wizardMode: null, setWizardMode: () => {}, authTier: 'anon',
  onSignIn: () => {}, onNavigate: vi.fn(),
};

describe('WizardEmptyState mounts RegionWakeReplay', () => {
  test('renders the replay for an anon visitor with no settlement', async () => {
    storeState = { auth: { tier: 'anon' }, settlement: null };
    const { findByTestId } = render(<WizardEmptyState {...baseProps} />);
    expect(await findByTestId('region-wake-replay')).toBeTruthy();
  });

  test('self-gates to nothing once the visitor is signed in', async () => {
    storeState = { auth: { tier: 'premium' }, settlement: null };
    const { queryByTestId } = render(<WizardEmptyState {...baseProps} authTier="premium" />);
    // Give the lazy chunk a tick to resolve; the component returns null for non-anon.
    await new Promise(r => setTimeout(r, 20));
    expect(queryByTestId('region-wake-replay')).toBeNull();
  });
});
