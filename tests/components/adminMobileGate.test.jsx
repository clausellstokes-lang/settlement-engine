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
import { act, cleanup, fireEvent, render } from '@testing-library/react';

// ── supabase mock — list_users resolves a small roster so `stats` (the KPI
//    strip) populates on mount. ────────────────────────────────────────────────
const invoke = vi.fn();
vi.mock('../../src/lib/supabase.js', () => ({
  isConfigured: false,
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

// ── T7 survey (2026-10-30): the page shell and the panels this file mounts for
//    real (AiPricingResyncPanel, AdminClientErrorsPanel, AdminBroadcastPanel,
//    AdminOperationalHealthPanel are NOT stubbed above). Each tool calls the
//    right admin-actions action and shows a refusal instead of swallowing it. ──
function routeAdmin(overrides = {}) {
  return vi.fn(async (_fn, { body }) => {
    if (Object.prototype.hasOwnProperty.call(overrides, body.action)) {
      const o = overrides[body.action];
      return typeof o === 'function' ? o(body) : o;
    }
    switch (body.action) {
      case 'get_stats':
        return { data: { total: 7, premiumCount: 2, totalCredits: 140 }, error: null };
      case 'ai_pricing_cron_status':
        return { data: { success: true, enabled: false, configured: true, timezone: 'America/New_York', applyCreditCosts: true, lastDispatchedOn: null, lastRun: null }, error: null };
      case 'get_client_error_dashboard':
        return { data: { success: true, rows: [], alert: null, refreshedAt: '2026-10-30T12:00:00Z' }, error: null };
      default:
        return { data: { success: true, rows: [], broadcasts: [], attention: [], health: null }, error: null };
    }
  });
}
const actionsCalled = () => invoke.mock.calls.map(([, { body }]) => body.action);

describe('AdminPanel shell — KPI strip and mobile gate (T7 survey)', () => {
  test('mobile: no panel below the gate fires an admin action; only get_stats runs', async () => {
    installMatchMedia(true);
    invoke.mockImplementation(routeAdmin());
    const AdminPanel = await loadAdminPanel();
    let utils;
    await act(async () => { utils = render(<AdminPanel />); });
    expect([...new Set(actionsCalled())]).toEqual(['get_stats']);
    expect(utils.getByText('7')).toBeTruthy();
    expect(utils.getByText('140')).toBeTruthy();
  });

  test('a refused get_stats is shown, not swallowed into an empty strip', async () => {
    installMatchMedia(true);
    invoke.mockImplementation(routeAdmin({ get_stats: { data: { error: 'Insufficient privileges' }, error: null } }));
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const AdminPanel = await loadAdminPanel();
    let utils;
    await act(async () => { utils = render(<AdminPanel />); });
    const alert = utils.getByRole('alert');
    expect(alert.textContent).toMatch(/Insufficient privileges/);
    errorSpy.mockRestore();
  });

  test('Refresh re-reads get_stats', async () => {
    installMatchMedia(true);
    invoke.mockImplementation(routeAdmin());
    const AdminPanel = await loadAdminPanel();
    let utils;
    await act(async () => { utils = render(<AdminPanel />); });
    const before = actionsCalled().filter((a) => a === 'get_stats').length;
    await act(async () => { fireEvent.click(utils.getByRole('button', { name: /refresh/i })); });
    expect(actionsCalled().filter((a) => a === 'get_stats').length).toBe(before + 1);
  });

  test('desktop: every real panel mounts and asks the server for its own read', async () => {
    installMatchMedia(false);
    invoke.mockImplementation(routeAdmin());
    const AdminPanel = await loadAdminPanel();
    await act(async () => { render(<AdminPanel />); });
    const called = new Set(actionsCalled());
    for (const a of ['get_stats', 'list_operator_broadcasts', 'get_operational_health', 'ai_pricing_cron_status', 'get_client_error_dashboard']) {
      expect(called.has(a), a).toBe(true);
    }
  });
});

describe('AiPricingResyncPanel — cron status, toggle, dry run, refusal (T7 survey)', () => {
  async function loadPricing() {
    vi.resetModules();
    return (await import('../../src/components/admin/AiPricingResyncPanel.jsx')).default;
  }

  test('renders the nightly status and the toggle sends the opposite enabled flag', async () => {
    invoke.mockImplementation(routeAdmin({ ai_pricing_cron_set: (b) => ({ data: { success: true, enabled: b.enabled }, error: null }) }));
    const Panel = await loadPricing();
    let utils;
    await act(async () => { utils = render(<Panel />); });
    expect(utils.getByText('Disabled')).toBeTruthy();
    await act(async () => { fireEvent.click(utils.getByRole('button', { name: /^enable$/i })); });
    expect(invoke).toHaveBeenCalledWith('admin-actions', { body: { action: 'ai_pricing_cron_set', enabled: true } });
  });

  test('Resync defaults to a dry run; unchecking sends dryRun:false; the report renders', async () => {
    invoke.mockImplementation(routeAdmin({
      ai_pricing_resync: (b) => ({ data: { success: true, dryRun: b.dryRun, updatedAt: '2026-10-30T00:00:00Z', creditChanges: [], priceChanges: [], warnings: [] }, error: null }),
    }));
    const Panel = await loadPricing();
    let utils;
    await act(async () => { utils = render(<Panel />); });
    await act(async () => { fireEvent.click(utils.getByRole('button', { name: /resync ai pricing/i })); });
    expect(invoke).toHaveBeenCalledWith('admin-actions', { body: { action: 'ai_pricing_resync', dryRun: true } });
    expect(utils.getByText(/dry run \(nothing written\)/i)).toBeTruthy();
    fireEvent.click(utils.getByLabelText(/dry run \(preview without writing\)/i));
    await act(async () => { fireEvent.click(utils.getByRole('button', { name: /resync ai pricing/i })); });
    expect(invoke).toHaveBeenCalledWith('admin-actions', { body: { action: 'ai_pricing_resync', dryRun: false } });
    expect(utils.getByText(/^applied$/i)).toBeTruthy();
  });

  test('a refused resync and a refused cron status are both shown', async () => {
    invoke.mockImplementation(routeAdmin({
      ai_pricing_cron_status: { data: { error: 'Insufficient privileges' }, error: null },
      ai_pricing_resync: { data: { error: 'Admin action failed' }, error: null },
    }));
    const Panel = await loadPricing();
    let utils;
    await act(async () => { utils = render(<Panel />); });
    await act(async () => { fireEvent.click(utils.getByRole('button', { name: /resync ai pricing/i })); });
    const alerts = utils.getAllByRole('alert').map((n) => n.textContent);
    expect(alerts.some((t) => /Insufficient privileges/.test(t))).toBe(true);
    expect(alerts.some((t) => /Admin action failed/.test(t))).toBe(true);
  });
});
