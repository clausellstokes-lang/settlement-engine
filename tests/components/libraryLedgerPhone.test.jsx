/** @vitest-environment jsdom */
/**
 * libraryLedgerPhone.test.jsx — THE LIBRARY'S LEDGER FITS A PHONE.
 *
 * ── THE DEFECT (browser pass 3, 2026-09-19) ───────────────────────────────────────────
 * /settlements at 375 wide measured a 547 px table inside a 375 px viewport: the page
 * scrolled horizontally (scrollWidth 572) and the HEALTH and ACTIONS columns — the Open
 * button among them — sat off the right edge. §934.26 says every control is reachable on the
 * phone and no page scrolls sideways, so a ledger that answers a narrow screen by growing is
 * not answering it.
 *
 * ⛔ THE CURE IS A COLLAPSE, NOT AN OVERFLOW. Hiding the spill behind `overflow-x` would keep
 * the Open control off-screen and call it fixed. The two least-scannable columns (Size and
 * Status) fold INTO the settlement cell at phone width instead, so the row carries the same
 * facts in two columns rather than four, and the action cluster is allowed to wrap.
 *
 * ⚠ WHAT THIS FILE CANNOT PROVE, SAID PLAINLY: jsdom computes no layout, so nothing here
 * measures 375 px of anything. What it proves is the WIRING that the measurement depends on —
 * the phone renders two data columns and not four, the head and the row agree on how many,
 * the folded facts are still on the page, the Open control is still rendered, and no site in
 * this ledger pins a width the viewport cannot hold. The pixel claim is the chair's re-walk.
 */
import React from 'react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

// ── The controllable matchMedia fake (the shape tests/ui/authMobileReflow.test.jsx uses,
//    which `useIsMobile`'s shared store reads through). `useIsMobile` memoizes ONE store per
//    breakpoint for the lifetime of the module, so the flag is installed before the first
//    render in each test and the module is re-imported per test to pick it up.
function installMatchMedia(matches) {
  const mqls = new Map();
  window.matchMedia = vi.fn((query) => {
    let mql = mqls.get(query);
    if (mql) return mql;
    mql = {
      media: query, matches,
      addEventListener: () => {}, removeEventListener: () => {},
      addListener: () => {}, removeListener: () => {},
    };
    mqls.set(query, mql);
    return mql;
  });
}

const storeState = {
  isAdvanceInFlight: () => false,
  isCampaignMutationLocked: () => false,
  isSettlementClockBound: () => false,
  getSettlementDeletionBlock: () => null,
  getCampaignMutationBlock: () => null,
  getCampaignMembershipBlock: () => null,
  advanceInFlight: [],
  campaignMutationLocks: [],
};
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector ? selector(storeState) : storeState; }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});

const SAVE = {
  id: 's1',
  name: 'Hearthfell',
  tier: 'town',
  savedAt: 1758240000000,
  settlement: { name: 'Hearthfell', tier: 'town', config: {}, npcs: [], factions: [], neighbourNetwork: [] },
};

const LEDGER_PROPS = {
  saves: [SAVE], campaignsExist: false, allModifiers: new Map(),
  onView: () => {}, deleteId: null, setDeleteId: () => {}, deleteConfirmed: () => {},
  campaigns: [], addToCampaign: () => {}, removeFromCampaign: () => {},
  onReactivate: () => {}, canReactivate: false, reactivatingId: null,
  onCanonize: () => {}, onAdvanceTime: () => {}, onCreateCampaign: () => {}, onNavigate: () => {},
  canManageCampaigns: false, selectMode: false, selectedIds: new Set(), onToggleSelect: () => {},
};

afterEach(() => { cleanup(); vi.resetModules(); });

/** The widest phone this estate designs for is 480; the pass measured 375. */
const PHONE_WIDTH = 375;

async function renderLedger(matches) {
  installMatchMedia(matches);
  vi.resetModules();
  const { default: UnassignedLedger } = await import('../../src/components/settlements/UnassignedLedger.jsx');
  return render(<UnassignedLedger {...LEDGER_PROPS} />);
}

describe('the library ledger at phone width', () => {
  test('the row keeps its Open control, and the ledger drops to two data columns', async () => {
    const { container } = await renderLedger(true);

    // ⭐ THE CONTROL THE PASS FOUND OFF-SCREEN. It is the row's one primary.
    expect(screen.getByRole('button', { name: /open/i })).toBeTruthy();

    const heads = [...container.querySelectorAll('thead th')].map((th) => (th.textContent || '').trim());
    expect(heads).toEqual(['Settlement', 'Health', 'Actions']);
    // anchored: the exact head list above proves the table rendered its head at all.
    expect(heads).not.toContain('Size');

    // The row agrees with the head — a colSpan drawn against the desktop count would
    // silently widen the table again.
    const cells = [...container.querySelectorAll('[data-testid="settlement-card"] > td')];
    expect(cells.length).toBe(heads.length);

    // ⭐ AND THE FOLDED FACTS ARE STILL ON THE PAGE. Collapsing a ledger is not dropping a
    // column: the tier and the phase moved into the settlement cell.
    const text = container.textContent || '';
    expect(text).toContain('town');
    expect(text).toContain('Draft');
  });

  test('nothing in the ledger pins a width the phone cannot hold', async () => {
    const { container } = await renderLedger(true);
    const tooWide = [];
    for (const el of container.querySelectorAll('*')) {
      for (const prop of ['minWidth', 'width']) {
        const raw = el.style?.[prop];
        const px = /^(\d+(?:\.\d+)?)px$/.exec(String(raw || ''));
        if (px && Number(px[1]) > PHONE_WIDTH) tooWide.push(`${el.tagName}.${prop}=${raw}`);
      }
    }
    expect(tooWide, 'a ledger element is wider than the phone it must fit').toEqual([]);
    // anchored: the sweep below proves the walk saw a populated ledger, so the empty
    // offender list above is a result rather than an empty container.
    expect(container.querySelectorAll('*').length).toBeGreaterThan(20);
  });

  test('above the breakpoint the ledger is the four-column table it always was', async () => {
    const { container } = await renderLedger(false);
    const heads = [...container.querySelectorAll('thead th')].map((th) => (th.textContent || '').trim());
    expect(heads).toEqual(['Settlement', 'Size', 'Status', 'Health', 'Actions']);
    const cells = [...container.querySelectorAll('[data-testid="settlement-card"] > td')];
    expect(cells.length).toBe(heads.length);
    expect(screen.getByRole('button', { name: /open/i })).toBeTruthy();
  });
});
