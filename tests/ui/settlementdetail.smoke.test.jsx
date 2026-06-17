/**
 * @vitest-environment jsdom
 *
 * tests/ui/settlementdetail.smoke.test.jsx — Decomposition lock-in.
 *
 * SettlementDetail.jsx was decomposed: its in-file NetworkEffectsPanel and
 * LinkNeighbourCard sub-components, plus the large "Edit Names" render block,
 * moved into src/components/settlementDetail/SettlementDetail{NetworkEffectsPanel,
 * LinkNeighbourCard,EditNames}.jsx. This is a behavior-preserving move, so the
 * regression net is: the module still resolves (every extracted relative import
 * wired correctly) and the panel still mounts and renders without throwing. A
 * broken relative-path/import in the split would throw on the dynamic import or
 * the render below and fail this test.
 *
 * We mock the store (the component reads ~20 selectors + useStore.getState in a
 * mount effect) and analytics (fire-and-forget) so the mount path stays quiet
 * and doesn't pull Supabase/network wiring into the test. editMode defaults to
 * false, so the component renders its read-only path: header chrome + the lazy
 * OutputContainer behind a Suspense fallback. The edit-only chrome (which mounts
 * the heavier campaign-engine panels) stays gated off.
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';

afterEach(cleanup);

// Analytics is fire-and-forget; stub it so the mount path stays quiet.
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

// Store mock. A mutable singleton drives every selector; useStore.getState()
// returns it for the mount effect's imperative reads. Defaults mirror a
// signed-out / read-only (editMode false) view so the edit-only chrome stays
// gated off and the read-only dossier path renders.
const storeState = {
  hydrateAiFromSave: vi.fn(),
  hydrateFromSave: vi.fn(),
  revertCurrentToRaw: vi.fn(() => Promise.resolve()),
  clearAiSettlement: vi.fn(),
  aiSettlement: null,
  aiDailyLife: null,
  phase: 'draft',
  editMode: false,
  toggleEditMode: vi.fn(),
  isSettlementEdited: () => false,
  countSettlementEdits: () => 0,
  auth: { tier: 'anon', user: null },
  isElevated: () => false,
  setPurchaseModalOpen: vi.fn(),
  setEditMode: vi.fn(),
  savedSettlements: [],
  systemState: {},
  eventLog: [],
  isFounder: () => false,
  requestNarrative: vi.fn(() => Promise.resolve()),
  markExported: vi.fn(),
};

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) {
    return selector(storeState);
  }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});

const detail = {
  name: 'Stoneford',
  settlement: { name: 'Stoneford', npcs: [], factions: [], neighbourNetwork: [] },
  saveData: { id: 'save-1' },
  config: {},
  institutionToggles: {},
  categoryToggles: {},
};

const noop = () => {};

describe('SettlementDetail — decomposition smoke', () => {
  test('default export is a function', async () => {
    const SettlementDetail = (await import('../../src/components/SettlementDetail.jsx')).default;
    expect(typeof SettlementDetail).toBe('function');
  });

  test('mounts (read-only view) without throwing', async () => {
    const SettlementDetail = (await import('../../src/components/SettlementDetail.jsx')).default;
    const { container } = render(
      <SettlementDetail
        detail={detail}
        setDetail={noop}
        saves={[]}
        _setSaves={noop}
        linking={false}
        setLinking={noop}
        editNamesOpen={false}
        setEditNamesOpen={noop}
        handleLink={noop}
        removeNeighbour={noop}
        applyRename={noop}
        onLoad={noop}
      />,
    );

    // Mount succeeded — the DOM exists and the component produced output.
    expect(document.body).toBeTruthy();
    expect(container.firstChild).not.toBeNull();
  });
});
