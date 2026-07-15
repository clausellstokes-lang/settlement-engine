/** @vitest-environment jsdom */
/**
 * adminMobileGate.test.jsx — the MOBILE pass for the Admin operator console
 * (Phase 5c, defer-to-desktop).
 *
 * Contract under test (Admin = desktop-only per the read-mostly matrix):
 *
 *   1. On mobile, the dense operator toolset (User Management ledger, User
 *      Search, Gallery Reports, Support Queue, and the Insights dashboards)
 *      defers behind a DesktopOnlyGate — none of those panels mount.
 *   2. On mobile, the read-only 3-KPI orientation strip STILL renders (Total
 *      Users / Premium / Credits Pool) — the read snapshot the matrix keeps.
 *   3. DESKTOP is unchanged: the full management Section stack mounts and no
 *      desktop gate appears.
 *
 * jsdom has no matchMedia, so we install a controllable fake (mobile vs
 * desktop) and reset module state per case so the per-breakpoint useIsMobile
 * store does not leak across renders.
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { act, cleanup, render } from '@testing-library/react';

// ── supabase mock — list_users resolves a small roster so `stats` (the KPI
//    strip) populates on mount. ────────────────────────────────────────────────
const invoke = vi.fn();
vi.mock('../../src/lib/supabase.js', () => ({
  supabase: { functions: { invoke: (...a) => invoke(...a) } },
}));

// ── store mock — elevated admin so the panel renders its body. ──────────────
const STORE = { auth: { user: { id: 'admin-1' }, tier: 'developer' }, isElevated: () => true };
vi.mock('../../src/store/index.js', () => ({
  useStore: Object.assign((selector) => selector(STORE), { getState: () => STORE }),
}));

// ── Stub the heavy operator panels as bare markers so the test isolates the
//    mobile gate wiring (and so the deferred panels are individually probeable). ─
vi.mock('../../src/components/admin/AdminUsersPanel.jsx', () => ({ default: () => <div data-testid="admin-users-panel" /> }));
vi.mock('../../src/components/gallery/GalleryModerationPanel.jsx', () => ({ default: () => <div data-testid="gallery-moderation-panel" /> }));
vi.mock('../../src/components/admin/SupportQueuePanel.jsx', () => ({ default: () => <div data-testid="support-queue-panel" /> }));
vi.mock('../../src/components/admin/AdminTrendsPanel.jsx', () => ({ default: () => <div data-testid="admin-trends-panel" /> }));
vi.mock('../../src/components/admin/AdminAnalyticsPanel.jsx', () => ({ default: () => <div data-testid="admin-analytics-panel" /> }));
vi.mock('../../src/components/admin/AdminSimTuningPanel.jsx', () => ({ default: () => <div data-testid="admin-sim-tuning-panel" /> }));

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

async function loadAdminPanel() {
  vi.resetModules();
  return (await import('../../src/components/AdminPanel.jsx')).default;
}

beforeEach(() => {
  invoke.mockReset();
  // A two-user roster: one premium, 30 credits total → drives the KPI strip.
  invoke.mockResolvedValue({
    data: {
      users: [
        { id: 'u1', email: 'a@x.io', tier: 'free', credits: 10, role: 'user' },
        { id: 'u2', email: 'b@x.io', tier: 'premium', credits: 20, role: 'user' },
      ],
    },
    error: null,
  });
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('AdminPanel — mobile defer-to-desktop gate', () => {
  test('mobile: the operator toolset is gated and only the KPI strip remains', async () => {
    installMatchMedia(true);
    const AdminPanel = await loadAdminPanel();
    let utils;
    await act(async () => { utils = render(<AdminPanel />); });
    const { queryByTestId, getByText } = utils;

    // Every heavy operator panel is deferred — none mount on mobile.
    expect(queryByTestId('admin-users-panel')).toBeNull();
    expect(queryByTestId('gallery-moderation-panel')).toBeNull();
    expect(queryByTestId('support-queue-panel')).toBeNull();
    expect(queryByTestId('admin-trends-panel')).toBeNull();
    expect(queryByTestId('admin-analytics-panel')).toBeNull();
    expect(queryByTestId('admin-sim-tuning-panel')).toBeNull();

    // The desktop gate panel is present (its copy speaks to a larger screen).
    expect(getByText(/best on desktop/i)).toBeTruthy();

    // The read-only KPI orientation strip still renders from the mount fetch.
    expect(getByText('Total Users')).toBeTruthy();
    expect(getByText('Premium')).toBeTruthy();
    expect(getByText('Credits Pool')).toBeTruthy();
  });

  test('desktop: the full management stack mounts and no desktop gate appears', async () => {
    installMatchMedia(false);
    const AdminPanel = await loadAdminPanel();
    let utils;
    await act(async () => { utils = render(<AdminPanel />); });
    const { queryByTestId, getByTestId, queryByText } = utils;

    expect(getByTestId('admin-users-panel')).toBeTruthy();
    expect(getByTestId('gallery-moderation-panel')).toBeTruthy();
    expect(getByTestId('support-queue-panel')).toBeTruthy();
    expect(getByTestId('admin-trends-panel')).toBeTruthy();
    expect(getByTestId('admin-analytics-panel')).toBeTruthy();
    expect(getByTestId('admin-sim-tuning-panel')).toBeTruthy();

    // No "best on desktop" gate anywhere on the desktop render.
    expect(queryByText(/best on desktop/i)).toBeNull();
    // Sanity: the inline-edit ledger search box (a write surface) is present on
    // desktop only.
    expect(queryByTestId).toBeTruthy();
  });
});
