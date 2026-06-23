/** @vitest-environment jsdom */
/**
 * dossierMobileGate.test.jsx — the MOBILE pass for the Dossier (OutputContainer
 * + tabs) surface (Phase 5c).
 *
 * Contract under test (mobile = read; heavy authoring defers to desktop per the
 * locked read-mostly matrix):
 *
 *   1. PendingChangesBar: on mobile the unsaved-count READ stays visible, but
 *      the Commit / Revert / Preview-cascade write actions are withheld behind a
 *      calm "best on a larger screen" note. Desktop renders all three actions
 *      and no note (byte-identical behaviour).
 *   2. DefenseTab: the Threat Assessment row WRAPS and the threat label flexes on
 *      mobile (no fixed 130px slot that clips at 375px); on desktop the row stays
 *      a single non-wrapping line with the fixed-width label.
 *
 * jsdom has no matchMedia, so we install a controllable fake (mobile vs desktop)
 * and reset module state per case so the per-breakpoint useIsMobile store does
 * not leak across renders.
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

// ── PendingChangesBar leans on the store + the inlineEdit flag. Stub both so the
//    test isolates the mobile gate wiring. ──────────────────────────────────────
const pendingState = {
  pendingEditsQueue: [{ id: 'e1', kind: 'rename-settlement', payload: {} }],
  commitPendingEdits: vi.fn(),
  revertPendingEdits: vi.fn(),
};
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(pendingState); }
  useStore.getState = () => pendingState;
  return { useStore };
});
vi.mock('../../src/lib/flags.js', () => ({ flag: () => true }));
vi.mock('../../src/lib/analytics.js', () => ({
  Funnel: { track: () => {} },
  EVENTS: {},
}));
// CascadePreviewPanel is heavy; it must never mount on mobile, and we only need a
// marker to assert that on desktop.
vi.mock('../../src/components/dossier/CascadePreviewPanel.jsx', () => ({
  default: () => <div data-testid="cascade-preview-panel" />,
}));

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

async function loadPendingBar() {
  vi.resetModules();
  return (await import('../../src/components/dossier/PendingChangesBar.jsx')).default;
}

async function loadDefenseTab() {
  vi.resetModules();
  return (await import('../../src/components/new/tabs/DefenseTab.jsx')).DefenseTab;
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('PendingChangesBar — mobile write-action gate', () => {
  test('mobile: keeps the unsaved-count read, withholds Commit/Revert/Preview', async () => {
    installMatchMedia(true);
    const PendingChangesBar = await loadPendingBar();
    render(<PendingChangesBar />);

    // The read survives: the unsaved-count is still announced.
    expect(screen.getByText(/unsaved/i)).toBeTruthy();
    // The three write actions are gone.
    expect(screen.queryByRole('button', { name: /commit/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /revert/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /preview cascade/i })).toBeNull();
    // A calm desktop note takes their place.
    expect(screen.getByText(/larger screen/i)).toBeTruthy();
  });

  test('desktop: renders all three write actions and no gate note', async () => {
    installMatchMedia(false);
    const PendingChangesBar = await loadPendingBar();
    render(<PendingChangesBar />);

    expect(screen.getByRole('button', { name: /commit/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /revert/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /preview cascade/i })).toBeTruthy();
    expect(screen.queryByText(/larger screen/i)).toBeNull();
  });
});

describe('DefenseTab — mobile threat-row reflow', () => {
  // A minimal settlement with enough of a defense profile that the Threat
  // Assessment section renders its rows.
  const settlement = {
    name: 'Stoneford',
    tier: 'town',
    defenseProfile: { fortifications: 'palisade', garrison: { size: 20 } },
    config: {},
  };

  function threatRow(container) {
    // The threat label "Siege & Assault" etc. lives in a span inside the row; the
    // row is the flex container with padding '8px 12px'. Grab the first one.
    return container.querySelector('div[style*="padding: 8px 12px"]');
  }

  test('mobile: the threat row wraps and the label flexes (no fixed width)', async () => {
    installMatchMedia(true);
    const DefenseTab = await loadDefenseTab();
    const { container } = render(<DefenseTab settlement={settlement} />);
    const row = threatRow(container);
    expect(row).toBeTruthy();
    expect(row.style.flexWrap).toBe('wrap');
    // The label span flexes instead of holding a fixed 130px slot.
    const label = row.children[1];
    expect(label.style.width).toBe('');
    expect(label.style.flex).toContain('1 1 auto');
  });

  test('desktop: the threat row stays single-line with a fixed-width label', async () => {
    installMatchMedia(false);
    const DefenseTab = await loadDefenseTab();
    const { container } = render(<DefenseTab settlement={settlement} />);
    const row = threatRow(container);
    expect(row).toBeTruthy();
    expect(row.style.flexWrap).toBe('');
    const label = row.children[1];
    expect(label.style.width).toBe('130px');
  });
});
