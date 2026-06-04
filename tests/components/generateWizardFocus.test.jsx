/** @vitest-environment jsdom */
/**
 * generateWizardFocus.test.jsx — P144 / A-4 contract.
 *
 * Pins the advanced wizard's step-focus management:
 *   • On a step *change* (Next/Back), focus moves to the new step's
 *     labelled region ("Step N of M: …") so keyboard + screen-reader
 *     users are oriented instead of stranded on the nav button.
 *   • Initial mount does NOT steal focus (no surprise focus theft).
 *
 * The four step-body panels are heavy store-coupled components; they're
 * stubbed so this test isolates the wizard's own focus logic.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

const flagMock = vi.fn(() => true);
vi.mock('../../src/lib/flags.js', () => ({ flag: (...a) => flagMock(...a) }));

vi.mock('../../src/components/ConfigurationPanel', () => ({ default: () => <div>config-panel</div> }));
vi.mock('../../src/components/InstitutionalGrid', () => ({ default: () => <div>institutions-panel</div> }));
vi.mock('../../src/components/ServicesTogglePanel', () => ({ default: () => <div>services-panel</div> }));
vi.mock('../../src/components/TradeDynamicsPanel', () => ({ default: () => <div>trade-panel</div> }));
vi.mock('../../src/components/HomeHero.jsx', () => ({ default: () => <div>home-hero</div> }));

vi.mock('../../src/store/index.js', () => {
  const data = {
    settlement: null,
    config: { settType: 'random' },
    wizardStep: 0,
    wizardMode: 'advanced',
    loadedFromSave: null,
    importedNeighbour: null,
    canSave: () => false,
    auth: { tier: 'wanderer', role: 'user' },
    aiSettlement: null,
    generateSettlement: vi.fn(),
    setWizardStep: vi.fn(),
    setWizardMode: vi.fn(),
    clearLoadedFromSave: vi.fn(),
    clearNeighbour: vi.fn(),
    clearSettlement: vi.fn(),
    pipelineRevealActive: false,
    dismissPipelineReveal: vi.fn(),
    onboardingActive: false,
    onboardingStep: 0,
    advanceOnboarding: vi.fn(),
    setOnboardingStep: vi.fn(),
  };
  function useStore(selector) { return selector(data); }
  useStore.getState = () => data;
  useStore.__set = (next) => Object.assign(data, next);
  return { useStore };
});

import GenerateWizard from '../../src/components/GenerateWizard.jsx';
import { useStore } from '../../src/store/index.js';

describe('GenerateWizard — A-4 step focus', () => {
  beforeEach(() => {
    // wizardChromeDiet is the only flag GenerateWizard reads now; keep it at
    // its default-off so these focus tests see the standard chrome.
    flagMock.mockReturnValue(false);
    useStore.__set({ wizardStep: 0, wizardMode: 'advanced', settlement: null });
  });
  afterEach(() => cleanup());

  it('does not steal focus on initial mount', () => {
    render(<GenerateWizard isMobile={false} />);
    // The labelled step region renders…
    expect(screen.getByRole('group', { name: /Step 1 of 4/ })).toBeTruthy();
    // …but focus is left on the body, not yanked into it.
    expect(document.activeElement).toBe(document.body);
  });

  it('moves focus to the new step region when the step changes', () => {
    const { rerender } = render(<GenerateWizard isMobile={false} />);
    expect(document.activeElement).toBe(document.body);

    useStore.__set({ wizardStep: 1 });
    rerender(<GenerateWizard isMobile={false} />);

    const region = screen.getByRole('group', { name: /Step 2 of 4: Institutions/ });
    expect(document.activeElement).toBe(region);
  });
});
