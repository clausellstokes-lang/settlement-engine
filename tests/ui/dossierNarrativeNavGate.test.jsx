/**
 * @vitest-environment jsdom
 *
 * tests/ui/dossierNarrativeNavGate.test.jsx — failure-path navigation gate.
 *
 * executeAiAction (OutputContainer) used to call requestNarrative(saveId) and
 * then landOnNarrativeSurface() UNCONDITIONALLY, so a FAILED narration still
 * navigated the reader off their current tab onto the (empty) narrative payoff.
 * The fix reads the fresh post-await store state and only lands when the run
 * succeeded (no aiError). This test reproduces the failure: a requestNarrative
 * that sets aiError must NOT move the reader to the Summary/Guidance surface,
 * while a SUCCESSFUL run (no aiError) still must.
 *
 * Mirrors dossier.smoke.test.jsx's mock harness (a mutable store singleton +
 * stubbed supabase/analytics/flags) but renders the real component so the
 * Generate-Narrative click drives runNarrativeLayer → executeAiAction for real.
 * Supabase isConfigured is stubbed TRUE so the configured (requestNarrative)
 * branch is taken, not the local-dev runAiLayer fallback.
 */

import { afterEach, describe, test, expect, vi } from 'vitest';
import { cleanup, render, fireEvent, waitFor } from '@testing-library/react';

// Configured path: take the requestNarrative branch, not the local-dev fallback.
vi.mock('../../src/lib/supabase.js', () => ({
  isConfigured: true,
  supabase: {},
}));

vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

// Flags off → narrative buttons render in the action band (legacy chrome path).
vi.mock('../../src/lib/flags.js', () => ({
  flag: vi.fn(() => false),
}));

const SAVE_ID = 'save-1';

// A minimal-but-real settlement so the dossier mounts a populated Summary group
// (the default landing is the Overview sub-tab; the Summary sub-tab is the
// post-narrative landing target). saveId is present so narrativeEnabled is true
// and the Generate-Narrative button renders.
function makeSettlement() {
  return {
    id: 's-1',
    name: 'Testford',
    size: 'town',
    population: 1200,
    npcs: [],
    institutions: [],
  };
}

let storeState;
function freshStore() {
  return {
    settlement: makeSettlement(),
    aiSettlement: null,
    setAiSettlement: vi.fn(),
    clearAiSettlement: vi.fn(),
    regenSection: vi.fn(),
    // Default: a FAILED narration writes aiError and leaves no aiSettlement.
    requestNarrative: vi.fn(async () => { storeState.aiError = 'The narrative layer could not be generated. Try again.'; }),
    requestDailyLife: vi.fn(),
    getCost: vi.fn(() => 0),
    creditBalance: 100,
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
    setAiError: vi.fn((v) => { storeState.aiError = v; }),
    savedSettlements: [{ id: SAVE_ID, aiData: { dossierNotes: {} }, is_public: false }],
    pinNpc: vi.fn(),
    unpinNpc: vi.fn(),
    queueEdit: vi.fn(),
    setActivePricingMoment: vi.fn(),
    isSettlementClockBound: () => false,
    phase: 'draft',
    // Read by DossierActionBand's children (e.g. BuyThisDossier).
    auth: { tier: 'free', modelPreference: null },
    isElevated: () => false,
    creditLedger: [],
    trackTabExplored: vi.fn(),
    onboardingActive: false,
    onboardingStep: 0,
    userPrefs: { tableViewOpen: false },
    setUserPref: vi.fn(),
  };
}

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});

import OutputContainer from '../../src/components/OutputContainer.jsx';

afterEach(cleanup);

// The active reading surface = the selected SUB-tab in the desktop strip. We key
// on the strip's aria-selected (synchronous) rather than the tabpanel id, since
// the panel body is lazy/Suspended and not mounted during the first paint.
// Scoped to the sf-tab- prefix so the group strip's tabs (sf-group-) don't match.
function activeTabId(container) {
  const tab = container.querySelector('[id^="sf-tab-"][aria-selected="true"]');
  return (tab?.getAttribute('id') || '').replace(/^sf-tab-/, '');
}

function clickGenerateNarrative(container) {
  const btn = [...container.querySelectorAll('button')]
    .find(b => /Generate Narrative/.test((b.textContent || '').trim()));
  expect(btn, 'Generate Narrative button present').toBeTruthy();
  fireEvent.click(btn);
}

describe('Dossier narrative — navigation is gated on success', () => {
  test('a FAILED requestNarrative does NOT navigate to the narrative surface', async () => {
    storeState = freshStore();
    const { container } = render(<OutputContainer settlement={storeState.settlement} saveId={SAVE_ID} />);

    const before = activeTabId(container);
    expect(before).toBe('overview'); // default landing is Overview, not the Summary thesis

    clickGenerateNarrative(container);

    // Let the awaited requestNarrative resolve (it sets aiError) and give any
    // (buggy) navigation a full macrotask to land before we assert its absence.
    await waitFor(() => expect(storeState.requestNarrative).toHaveBeenCalledWith(SAVE_ID));
    await new Promise(r => setTimeout(r, 50));

    // The reader must stay where they were — a failed run has no payoff to land on.
    expect(activeTabId(container)).toBe(before);
    expect(activeTabId(container)).not.toBe('summary');
  });

  test('a SUCCESSFUL requestNarrative still lands on the narrative surface', async () => {
    storeState = freshStore();
    // Success: clears aiError (mirrors the slice's success path).
    storeState.requestNarrative = vi.fn(async () => { storeState.aiError = null; });
    const { container } = render(<OutputContainer settlement={storeState.settlement} saveId={SAVE_ID} />);

    expect(activeTabId(container)).not.toBe('summary');
    clickGenerateNarrative(container);

    await waitFor(() => expect(activeTabId(container)).toBe('summary'));
  });
});
