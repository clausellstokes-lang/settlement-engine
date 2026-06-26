/**
 * @vitest-environment jsdom
 *
 * tests/ui/dossier.smoke.test.jsx — Decomposition lock-in.
 *
 * OutputContainer.jsx (the dossier) was decomposed: cohesive chunks of its
 * render — the AI narrative button cluster, the dark header bar, the
 * narrative thesis/lens banner, and the two tab strips — moved into
 * presentational siblings under src/components/dossier/* (DossierNarrative-
 * Buttons, DossierHeaderRow, DossierNarrativeBanner, DossierTabStrip,
 * DossierGroupTabStrip). This is a behavior-preserving move, so the
 * regression net is simply: the module still evaluates and its default
 * export is the dossier component, wiring the extracted imports together.
 * If a relative-path/import got broken in the split, the import below
 * throws and this test fails.
 *
 * We mock the store (the dossier reads ~30 selectors via useStore),
 * supabase (the module reads isConfigured at eval), and analytics
 * (fire-and-forget) so the import path stays quiet and doesn't pull
 * network/Supabase wiring into the test. We assert on the module surface
 * (default export is a function) rather than rendering, since a full render
 * needs a populated settlement and resolves a pile of lazy tab chunks.
 */

import { describe, test, expect, vi } from 'vitest';

// Supabase singleton — isConfigured is read at module-eval; stub it false so
// the dossier takes the local-dev (ungated) narrative path and no client is
// created during the import.
vi.mock('../../src/lib/supabase.js', () => ({
  isConfigured: false,
  supabase: {},
}));

// Analytics is fire-and-forget; stub it so nothing tries to phone home.
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

// Feature flags — default off keeps the legacy chrome path.
vi.mock('../../src/lib/flags.js', () => ({
  flag: vi.fn(() => false),
}));

// Store mock. A mutable singleton drives every selector; subscribe and
// getState are stubbed for the analytics/onboarding/effect paths.
const storeState = {
  settlement: null,
  aiSettlement: null,
  setAiSettlement: vi.fn(),
  clearAiSettlement: vi.fn(),
  regenSection: vi.fn(),
  requestNarrative: vi.fn(),
  getCost: vi.fn(() => 0),
  creditBalance: 0,
  aiLoading: false,
  aiRegenerating: false,
  aiError: null,
  aiProgress: '',
  aiPartialFailure: null,
  aiViolations: null,
  clearAiViolations: vi.fn(),
  lastRegenerationDelta: null,
  clearLastRegenerationDelta: vi.fn(),
  showNarrative: false,
  setShowNarrative: vi.fn(),
  savedSettlements: [],
  pinNpc: vi.fn(),
  unpinNpc: vi.fn(),
  queueEdit: vi.fn(),
  trackTabExplored: vi.fn(),
  onboardingActive: false,
  onboardingStep: 0,
  userPrefs: { tableViewOpen: false },
  setUserPref: vi.fn(),
};

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) {
    return selector(storeState);
  }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});

describe('OutputContainer (dossier) — decomposition smoke', () => {
  test('module imports and the default export is a component function', async () => {
    const mod = await import('../../src/components/OutputContainer.jsx');
    expect(typeof mod.default).toBe('function');
  });
});
