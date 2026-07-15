/**
 * @vitest-environment jsdom
 *
 * tests/ui/wizard.smoke.test.jsx — Wizard decomposition lock-in.
 *
 * GenerateWizard.jsx had additional render chunks extracted into
 * src/components/generate/Wizard*.jsx (WizardEmptyState,
 * WizardLoadedBanners, WizardOutputToolbar). This is a behavior-preserving
 * move, so the regression net is simply: the default export is a function,
 * and the wizard still mounts and renders without throwing — wiring the
 * extracted imports together correctly. A broken relative import in any
 * new file makes the import or render below throw and this test fails.
 *
 * We mock the store (the wizard reads ~20 selectors) plus analytics, saves,
 * and flags so the mount path stays quiet and doesn't pull network/Supabase
 * wiring into the test. HomeHero is stubbed; with no wizardMode and no
 * settlement (signed-in), the empty-state branch renders the extracted
 * WizardEmptyState → ModeSelector, whose stable copy we assert on.
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

afterEach(cleanup);

// Analytics is fire-and-forget; stub it so the mount path stays quiet.
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

// Feature flags — default off keeps the legacy (non-diet) chrome path.
vi.mock('../../src/lib/flags.js', () => ({
  flag: vi.fn(() => false),
}));

// Anon daily-cap helper — never at cap in the test.
vi.mock('../../src/lib/anonGenCounter.js', () => ({
  anonAtCap: vi.fn(() => false),
}));

// Saves service — only referenced by the extracted SaveToLibraryButton's
// save path (not on the empty-state render), but stubbed for safety.
vi.mock('../../src/lib/saves.js', () => ({
  saves: {
    save: vi.fn(() => Promise.resolve()),
  },
}));

// Stub HomeHero — it drags in WelcomeBackCard / AnonTierTeaser and a pile
// of its own store selectors. WizardEmptyState imports it directly, so the
// mock still applies; keep the empty-state surface focused.
vi.mock('../../src/components/HomeHero.jsx', () => ({
  default: () => null,
}));

// Store mock. A mutable singleton drives every selector; subscribe and
// getState are stubbed for the analytics/onboarding effects.
const storeState = {
  // generator state (signed-in, empty: no mode picked, no settlement)
  settlement: null,
  activeSaveId: null,
  config: { settType: 'random' },
  wizardStep: 0,
  wizardMode: null,
  loadedFromSave: null,
  importedNeighbour: null,
  canSave: () => false,
  auth: { tier: 'free', role: 'user' },
  aiSettlement: null,
  pipelineRevealActive: false,
  // generator + nav actions
  generateSettlement: vi.fn(),
  setWizardStep: vi.fn(),
  setWizardMode: vi.fn(),
  clearLoadedFromSave: vi.fn(),
  clearNeighbour: vi.fn(),
  clearSettlement: vi.fn(),
  dismissPipelineReveal: vi.fn(),
  // onboarding slice
  onboardingActive: false,
  onboardingStep: 0,
  advanceOnboarding: vi.fn(),
  setOnboardingStep: vi.fn(),
  // analytics snapshot (read via getState in handleGenerate; unused on mount)
  institutionToggles: {},
  goodsToggles: {},
};

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) {
    return selector(storeState);
  }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});

describe('GenerateWizard — wizard decomposition smoke', () => {
  test('default export is a function', async () => {
    const GenerateWizard = (await import('../../src/components/GenerateWizard.jsx')).default;
    expect(typeof GenerateWizard).toBe('function');
  });

  test('mounts without throwing and renders the mode selector', async () => {
    const GenerateWizard = (await import('../../src/components/GenerateWizard.jsx')).default;
    const { container } = render(
      <GenerateWizard isMobile={false} onSignIn={() => {}} onNavigate={() => {}} />
    );

    // Mount succeeded — the DOM exists and the wizard produced output.
    expect(document.body).toBeTruthy();
    expect(container.firstChild).not.toBeNull();

    // The empty-state (signed-in) branch renders WizardEmptyState, which
    // renders the extracted ModeSelector. Pinning its stable card labels
    // means a broken extraction (e.g. a wrong relative import in one of the
    // new generate/Wizard*.jsx files) surfaces here.
    expect(await screen.findByText('Basic Generate')).toBeTruthy();
    expect(await screen.findByText('Advanced Generate')).toBeTruthy();
  });
});
