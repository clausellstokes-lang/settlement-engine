/** @vitest-environment jsdom */
/**
 * homeHeroEngineRefusal.test.jsx — the hero says the engine service's own reason (remote-path
 * R3, D3 of the chair's flagged-path walk, 2026-11-10).
 *
 * The generation lane records a typed refusal for the service's limit (429), its absence and its
 * retired version, then rethrows. The hero's catch used to answer EVERY throw with
 * `errors.forgeStart` ("The forge stalled … Try once more."), and its own error wins over the
 * recorded reason, so a limit was told to retry. Now a throw the lane has already named is left
 * to the notice; any other throw keeps forgeStart (the control arm).
 */
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';

vi.mock('../../src/components/home/WelcomeBackCard.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/AnonTierTeaser.jsx', () => ({ default: () => null }));
vi.mock('../../src/lib/anonGenCounter.js', () => ({
  anonAtCap: () => false,
  anonFullRemaining: () => 1,
  anonRerollRemaining: () => 2,
}));
vi.mock('../../src/lib/analytics.js', () => ({
  Funnel: { homepageView: vi.fn(), anonGenerationCompleted: vi.fn() },
}));
vi.mock('../../src/lib/staleDeploy.js', () => ({ recoverFromChunkError: async () => 'none' }));

const storeState = {
  generateSettlement: vi.fn(),
  updateConfig: vi.fn(),
  setWizardMode: vi.fn(),
  setSelectedSettlementId: vi.fn(),
  clearRefusal: vi.fn(),
  lastRefusal: null,
  auth: { tier: 'anon', displayName: null },
};
vi.mock('../../src/store/index.js', () => ({
  useStore: (selector) => selector(storeState),
}));

import HomeHero from '../../src/components/HomeHero.jsx';
import { t } from '../../src/copy/index.js';
import { REFUSAL_SURFACES, refusalOf } from '../../src/lib/refusalReasons.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

describe('HomeHero: a generation the engine service refused', () => {
  let consoleError;
  beforeEach(() => {
    consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    storeState.generateSettlement.mockReset();
    storeState.lastRefusal = null;
  });
  afterEach(() => {
    cleanup();
    consoleError.mockRestore();
  });

  for (const [code, reason] of [['engine_rate_limited', 'engineRateLimited'], ['engine_unavailable', 'engineUnavailable']]) {
    it(`${code}: the recorded reason is said, not "try once more"`, async () => {
      storeState.generateSettlement.mockImplementation(async () => {
        // What the lane does: record the reason where the reader clicked, then rethrow.
        storeState.lastRefusal = refusalOf(reason, null, REFUSAL_SURFACES.HOME_HERO);
        throw Object.assign(new Error(code), { code });
      });
      const view = render(<HomeHero onSignIn={() => {}} onNavigate={() => {}} />);
      fireEvent.click(screen.getByRole('button', { name: /forge a /i }));
      await vi.waitFor(() => expect(storeState.generateSettlement).toHaveBeenCalled());
      await new Promise((r) => setTimeout(r, 0));
      view.rerender(<HomeHero onSignIn={() => {}} onNavigate={() => {}} />);
      const alert = (await screen.findByRole('alert')).textContent;
      expectAbsentWithAnchor(alert, t('errors.forgeStart'), t(`refusals.${reason}.body`),
        `${code}: the recorded reason replaces forgeStart`);
    });
  }

  it('control: an unnamed throw still says forgeStart', async () => {
    storeState.generateSettlement.mockRejectedValue(new Error('boom'));
    render(<HomeHero onSignIn={() => {}} onNavigate={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /forge a /i }));
    expect((await screen.findByRole('alert')).textContent).toContain(t('errors.forgeStart'));
  });
});
