/** @vitest-environment jsdom */
/**
 * homeHeroStaleDeploy.test.jsx - the Generate button in a tab that outlived a deploy.
 *
 * Reported 2026-09-16: "Generation failed / The forge stalled before your settlement
 * took shape." A tab opened before a deploy cannot load the new build's engine chunk,
 * and a retry fails the same way. The hero now hands the error to the stale-deploy
 * recovery and, when a new build is confirmed live, says so instead of inviting a
 * retry. Any other failure keeps the forgeStart message (the control arm).
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

const recoverFromChunkError = vi.fn();
vi.mock('../../src/lib/staleDeploy.js', () => ({
  recoverFromChunkError: (...args) => recoverFromChunkError(...args),
}));

const storeState = {
  generateSettlement: vi.fn(),
  updateConfig: vi.fn(),
  setWizardMode: vi.fn(),
  setSelectedSettlementId: vi.fn(),
  auth: { tier: 'anon', displayName: null },
};
vi.mock('../../src/store/index.js', () => ({
  useStore: (selector) => selector(storeState),
}));

import HomeHero from '../../src/components/HomeHero.jsx';
import { t } from '../../src/copy/index.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const staleChunk = () => new TypeError(
  'Failed to fetch dynamically imported module: https://settlementforge.com/assets/settlementGenerateAction-CmIMnwK9.js',
);

describe('HomeHero: a generation that failed on a stale deploy', () => {
  let consoleError;
  beforeEach(() => {
    consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    storeState.generateSettlement.mockReset();
    recoverFromChunkError.mockReset();
  });
  afterEach(() => {
    cleanup();
    consoleError.mockRestore();
  });

  it('hands the error to the recovery and says a new version is live', async () => {
    const error = staleChunk();
    storeState.generateSettlement.mockRejectedValue(error);
    recoverFromChunkError.mockResolvedValue('notice');

    render(<HomeHero onSignIn={() => {}} onNavigate={() => {}} />);
    const button = screen.getByRole('button', { name: /forge a /i });
    fireEvent.click(button);

    // The alert is the rubric ("Generation failed") followed by the message.
    const alert = (await screen.findByRole('alert')).textContent;
    expectAbsentWithAnchor(alert, t('errors.forgeStart'), t('errors.forgeUpdated'), 'a stale deploy replaces forgeStart');
    expect(recoverFromChunkError).toHaveBeenCalledWith(error);
    expect(button.disabled).toBe(false);
  });

  it('says the same while the recovery reloads the page', async () => {
    storeState.generateSettlement.mockRejectedValue(staleChunk());
    recoverFromChunkError.mockResolvedValue('reload');
    render(<HomeHero onSignIn={() => {}} onNavigate={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /forge a /i }));
    expect((await screen.findByRole('alert')).textContent).toContain(t('errors.forgeUpdated'));
  });

  it('CONTROL: any failure the recovery does not claim keeps the forgeStart message', async () => {
    storeState.generateSettlement.mockRejectedValue(new Error('engine unavailable'));
    recoverFromChunkError.mockResolvedValue('none');
    render(<HomeHero onSignIn={() => {}} onNavigate={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /forge a /i }));
    const alert = (await screen.findByRole('alert')).textContent;
    expectAbsentWithAnchor(alert, t('errors.forgeUpdated'), t('errors.forgeStart'), 'an unclaimed failure keeps forgeStart');
  });
});
