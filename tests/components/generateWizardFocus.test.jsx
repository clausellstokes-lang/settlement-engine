/** @vitest-environment jsdom */
/**
 * generateWizardFocus.test.jsx — Create-flow reorg contract (UX overhaul Phase 6).
 *
 * The linear Basic/Advanced step wizard collapsed into ONE layered
 * ConfigurationPanel. This test pins the reorg:
 *   • A selected mode (pre-generation) renders the layered panel, not a
 *     linear "Step N of M" region.
 *   • The Deep-constraints sections keep the wizard STEP IDS so funnel
 *     analytics still fire — opening one fires wizard_step_viewed with that
 *     step id (institutions / services / trade); the always-mounted config
 *     section reports on mount.
 *
 * The heavy store-coupled step panels are stubbed so the test isolates the
 * wizard's own composition + analytics wiring.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';

const flagMock = vi.fn(() => false);
vi.mock('../../src/lib/flags.js', () => ({ flag: (...a) => flagMock(...a) }));

const trackMock = vi.fn();
vi.mock('../../src/lib/analytics.js', () => ({
  track: (...a) => trackMock(...a),
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

// The layered panel's content panels are heavy; stub them to bare markers.
vi.mock('../../src/components/ConfigurationPanel', () => ({ default: () => <div>config-panel</div> }));
vi.mock('../../src/components/ConfigurationPanel.jsx', () => ({ default: () => <div>config-panel</div> }));
vi.mock('../../src/components/InstitutionalGrid.jsx', () => ({ default: () => <div>institutions-panel</div> }));
vi.mock('../../src/components/ServicesTogglePanel.jsx', () => ({ default: () => <div>services-panel</div> }));
vi.mock('../../src/components/TradeDynamicsPanel.jsx', () => ({ default: () => <div>trade-panel</div> }));
vi.mock('../../src/components/generate/CharacterPresetCard.jsx', () => ({ default: () => <div>character-card</div> }));
vi.mock('../../src/components/generate/PlaceInRegionCard.jsx', () => ({ default: () => <div>place-in-region</div> }));
vi.mock('../../src/components/HomeHero.jsx', () => ({ default: () => <div>home-hero</div> }));

vi.mock('../../src/store/index.js', () => {
  const data = {
    settlement: null,
    config: { settType: 'random' },
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

describe('GenerateWizard — Phase 6 layered Create flow', () => {
  beforeEach(() => {
    trackMock.mockClear();
    useStore.__set({ wizardMode: 'advanced', settlement: null });
  });
  afterEach(() => cleanup());

  it('renders the single layered ConfigurationPanel (no linear step region)', () => {
    render(<GenerateWizard isMobile={false} />);
    expect(screen.getByTestId('layered-configuration-panel')).toBeTruthy();
    // The old linear "Step N of M" region is gone.
    expect(screen.queryByRole('group', { name: /Step 1 of 4/ })).toBeNull();
  });

  it('reports the config step on mount and fires step ids when a deep section opens', () => {
    render(<GenerateWizard isMobile={false} />);

    // The always-mounted Foundations/Fine-tune block reports the config step.
    const stepViews = trackMock.mock.calls.filter(([ev]) => ev === 'WIZARD_STEP_VIEWED');
    expect(stepViews.some(([, props]) => props.step_id === 'config')).toBe(true);

    // Opening the Institutions deep section fires its step id (funnel continuity).
    fireEvent.click(screen.getByText('Institutions'));
    const afterOpen = trackMock.mock.calls.filter(([ev]) => ev === 'WIZARD_STEP_VIEWED');
    expect(afterOpen.some(([, props]) => props.step_id === 'institutions')).toBe(true);
  });
});
