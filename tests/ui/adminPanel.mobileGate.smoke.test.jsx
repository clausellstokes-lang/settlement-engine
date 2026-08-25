/**
 * @vitest-environment jsdom
 *
 * tests/ui/adminPanel.mobileGate.smoke.test.jsx — W5.8 admin mobile gate.
 *
 * Admin is a dense operator console (inline-edit ledgers, wide tables, chart
 * toggles) whose every action is a consequential server-audited mutation, so
 * on mobile (useIsMobile, the 640 breakpoint) AdminPanel keeps only the
 * read-only KPI orientation strip and gates the seven management Sections
 * behind a DesktopOnlyGate. On desktop the full console renders and the gate
 * is absent.
 *
 * jsdom doesn't lay out pixels, but it does set window.innerWidth (which
 * useIsMobile reads at mount + on resize), so we can exercise both branches of
 * the `isMobile ? gate : sections` ternary. The heavy sub-panels are stubbed
 * so this stays a smoke of the GATE branch — each panel has its own suite
 * (adminUsersPanel.pii, admintrends.smoke, …). AdminPanel's own mount effect
 * calls the audited admin-actions get_stats action, so supabase is stubbed to
 * resolve aggregate-only counts (no PII).
 */

import React from 'react';
import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';

// jsdom's window is writable; mutating innerWidth changes what useIsMobile
// reads at mount. Set it BEFORE each render so the hook initialises correctly.
function setViewportWidth(width) {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    writable: true,
    value: width,
  });
}

// AdminPanel gates on isElevated(); return true so the console (not the
// access-denied panel) renders. Selector-over-plain-object stub pattern.
vi.mock('../../src/store/index.js', () => ({
  useStore: (selector) => selector({ isElevated: () => true }),
}));

// The mount effect calls the audited admin-actions `get_stats` action. Resolve
// aggregate-only counts (no PII crosses into the browser) so it settles
// network-free.
vi.mock('../../src/lib/supabase.js', () => ({
  supabase: {
    functions: {
      invoke: vi.fn(() =>
        Promise.resolve({
          data: { total: 0, premiumCount: 0, totalCredits: 0 },
          error: null,
        }),
      ),
    },
  },
}));

// The seven management Sections mount heavy sub-panels; some read store keys
// this smoke deliberately doesn't stub (aiPricing, campaigns, savedSettlements)
// and would otherwise crash under the minimal store stub. Stub them to markers
// so the test isolates the gate branch. Each has its own regression suite.
vi.mock('../../src/components/admin/AdminUsersPanel.jsx', () => ({ default: () => <div>users-panel</div> }));
vi.mock('../../src/components/gallery/GalleryModerationPanel.jsx', () => ({ default: () => <div>gallery-panel</div> }));
vi.mock('../../src/components/admin/SupportQueuePanel.jsx', () => ({ default: () => <div>support-panel</div> }));
vi.mock('../../src/components/admin/AiPricingResyncPanel.jsx', () => ({ default: () => <div>aipricing-panel</div> }));
vi.mock('../../src/components/admin/AdminTrendsPanel.jsx', () => ({ default: () => <div>trends-panel</div> }));
vi.mock('../../src/components/admin/AdminAnalyticsPanel.jsx', () => ({ default: () => <div>analytics-panel</div> }));
vi.mock('../../src/components/admin/AdminSimTuningPanel.jsx', () => ({ default: () => <div>simtuning-panel</div> }));

import AdminPanel from '../../src/components/AdminPanel.jsx';

afterEach(cleanup);

describe('AdminPanel — mobile desktop-only gate (W5.8)', () => {
  test('at 360px the gate renders and the management sections are hidden', async () => {
    setViewportWidth(360);
    render(<AdminPanel />);

    // The gate title (literal prop, house voice) is present…
    expect(await screen.findByText('Admin works best on desktop')).toBeTruthy();
    // …and the management toolset is gated away — no User Management section.
    expect(screen.queryByText('User Management')).toBeNull();
  });

  test('at 1024px the management sections render and the gate is absent', async () => {
    setViewportWidth(1024);
    render(<AdminPanel />);

    // The full console renders — the first management Section is present…
    expect(await screen.findByText('User Management')).toBeTruthy();
    // …and the desktop-only gate is not shown.
    expect(screen.queryByText('Admin works best on desktop')).toBeNull();
  });
});
