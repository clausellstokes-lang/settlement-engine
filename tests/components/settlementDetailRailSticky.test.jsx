/**
 * @vitest-environment jsdom
 *
 * settlementDetailRailSticky.test.jsx — the NextActionRail sticky-top clearance
 * (Phase 5 mobile pass).
 *
 * Contract under test: the owner-only NextActionRail aside pins with
 * position:sticky. On DESKTOP it keeps the bare breathing gap (CHROME.stickyTop,
 * 12px). On MOBILE the rail reflows below the dossier and would otherwise tuck
 * underneath the fixed chrome header; so the sticky `top` must add the mobile
 * header height (CHROME.headerMobile) so the pinned rail clears it. Desktop must
 * stay byte-identical (top:12).
 *
 * jsdom has no matchMedia, so we install a controllable fake (mobile vs desktop)
 * and reset module state per case so the per-breakpoint useIsMobile store does
 * not leak across renders.
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { CHROME } from '../../src/components/theme';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

// Analytics is fire-and-forget; stub it so the mount path stays quiet.
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

// Store mock. A mutable singleton drives every selector; useStore.getState()
// returns it for the mount effect's imperative reads. Defaults mirror a
// signed-out / read-only (editMode false) view so the read-only dossier path
// renders and the owner rail (gated on saveId) mounts.
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
  saveData: { id: 'save-1' }, // saveId truthy → the owner NextActionRail aside renders.
  config: {},
  institutionToggles: {},
  categoryToggles: {},
};

const noop = () => {};

function installMatchMedia(matches) {
  window.matchMedia = vi.fn((query) => ({
    media: query,
    matches,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
  }));
}

async function renderDetail() {
  // Re-import SettlementDetail after resetting modules so useIsMobile's shared
  // per-breakpoint store re-reads the freshly installed matchMedia.
  vi.resetModules();
  const SettlementDetail = (await import('../../src/components/SettlementDetail.jsx')).default;
  return render(
    <SettlementDetail
      detail={detail}
      setDetail={noop}
      saves={[]}
      linking={false}
      setLinking={noop}
      editNamesOpen={false}
      setEditNamesOpen={noop}
      handleLink={noop}
      removeNeighbour={noop}
      applyRename={noop}
    />,
  );
}

// The sticky rail is the position:sticky <aside>; grab it by that style marker.
function stickyRail(container) {
  return [...container.querySelectorAll('aside')].find(
    (el) => el.style.position === 'sticky',
  );
}

describe('SettlementDetail — NextActionRail sticky-top clearance', () => {
  test('desktop: sticky top stays the bare breathing gap (CHROME.stickyTop)', async () => {
    installMatchMedia(false);
    const { container } = await renderDetail();
    const rail = stickyRail(container);
    expect(rail).toBeTruthy();
    expect(rail.style.top).toBe(`${CHROME.stickyTop}px`);
  });

  test('mobile: sticky top includes the chrome-header clearance (CHROME.headerMobile)', async () => {
    installMatchMedia(true);
    const { container } = await renderDetail();
    const rail = stickyRail(container);
    expect(rail).toBeTruthy();
    // Clears the fixed mobile header AND keeps the same breathing gap below it.
    expect(rail.style.top).toBe(`${CHROME.headerMobile + CHROME.stickyTop}px`);
    // And is strictly greater than the bare desktop offset — the header clearance
    // is actually applied, not just the gap.
    expect(parseInt(rail.style.top, 10)).toBeGreaterThan(CHROME.stickyTop);
    expect(parseInt(rail.style.top, 10)).toBeGreaterThanOrEqual(CHROME.headerMobile);
  });
});
