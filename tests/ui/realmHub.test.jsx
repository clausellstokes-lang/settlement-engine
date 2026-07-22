/** @vitest-environment jsdom */
/**
 * tests/ui/realmHub.test.jsx — UX Phase 4 (the Realm IA move).
 *
 * Pins the four Realm-hub deliverables this phase asserts:
 *   1. Realm Dashboard renders the LIVE summary for a simulated campaign.
 *   2. Realm Dashboard shows the LOCKED teaser for anon/free (Realm reachable,
 *      not hidden) and fires the `map_realm_teaser` pricing moment.
 *   3. The Realm Inspector OVERLAYS — it renders its rail without unmounting
 *      anything; the map body is a sibling, not a body-swap.
 *   4. The Inspector self-hides the Pantheon section while religion is dormant.
 */

import { describe, test, expect, afterEach, vi, beforeEach } from 'vitest';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';

afterEach(cleanup);

// ── Store mock (a single mutable object behind every selector) ───────────────
const triggerSpy = vi.fn();
const setActivePricingMoment = vi.fn();
const storeState = {
  savedSettlements: [
    { id: 's1', name: 'Ashford' },
    { id: 's2', name: 'Bram' },
  ],
  setActivePricingMoment,
};

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.getState = () => storeState;
  useStore.subscribe = () => () => {};
  return { useStore };
});

// Stub pricingMoments so the locked teaser's moment fire is observable.
vi.mock('../../src/lib/pricingMoments.js', () => ({
  triggerPricingMoment: (...args) => triggerSpy(...args),
}));

import RealmDashboard from '../../src/components/map/RealmDashboard.jsx';
import RealmInspector from '../../src/components/map/RealmInspector.jsx';

beforeEach(() => {
  triggerSpy.mockClear();
  setActivePricingMoment.mockClear();
});

// A simulated campaign: an active siege (s1 deployed against s2), a war-exhaustion
// scar, a pantheon, and a calendar — enough to light up every dashboard stat.
const simulatedCampaign = {
  id: 'camp-1',
  name: 'The Reach',
  settlementIds: ['s1', 's2'],
  worldState: {
    tick: 7,
    calendar: { month: 9, year: 3, season: 'autumn' },
    deployments: { s1: { targetId: 's2', sinceTick: 4, role: 'siege' } },
    warExhaustion: { s1: 0.72 },
    pantheon: { 'deity:Vol': { tier: 'major', seats: 5 } },
  },
};

describe('RealmDashboard — live summary (premium)', () => {
  test('renders the live state-of-the-realm summary', () => {
    render(<RealmDashboard campaign={simulatedCampaign} canManageCampaigns tier="premium" />);
    expect(screen.getByTestId('realm-dashboard')).toBeTruthy();
    expect(screen.getByText('State of the Realm')).toBeTruthy();
    // In-world date from the calendar.
    expect(screen.getByText(/Autumn, Yr 3/)).toBeTruthy();
    // The four war facts now roll up into ONE focal Conflict stat: the tension
    // band is the headline and the live siege surfaces in its component digest.
    expect(screen.getByText('Strained')).toBeTruthy();
    expect(screen.getByText(/1 siege/)).toBeTruthy();
    // The dominant faith reads off the pantheon ledger.
    expect(screen.getByText('Vol')).toBeTruthy();
    // The war-weariest power surfaces from warExhaustionStandings. This render
    // passes no nameById, so the name lookup misses — and the fallback must be
    // the in-fiction generic, never the raw id (C3 finding 12; this line used
    // to pin 's1', the defect's own output).
    expect(screen.getAllByText('a settlement').length).toBeGreaterThan(0);
    expect(screen.queryByText('s1')).toBeNull();
    // No locked teaser / no pricing moment for premium.
    expect(screen.queryByTestId('realm-dashboard-locked')).toBeNull();
    expect(triggerSpy).not.toHaveBeenCalled();
  });
});

describe('RealmDashboard — locked teaser (anon/free)', () => {
  test('shows the locked teaser and fires map_realm_teaser', async () => {
    const onUpgrade = vi.fn();
    render(<RealmDashboard campaign={null} canManageCampaigns={false} tier="anon" onUpgrade={onUpgrade} />);

    expect(screen.getByTestId('realm-dashboard-locked')).toBeTruthy();
    expect(screen.queryByTestId('realm-dashboard')).toBeNull();

    // The teaser fires the simulation-intent pricing moment on mount (the
    // pricingMoments module is dynamically imported, so wait for the microtask).
    await waitFor(() => {
      expect(triggerSpy).toHaveBeenCalledWith('map_realm_teaser', setActivePricingMoment, { tier: 'anon' });
    });

    // P9 — clicking the CTA ("run the Realm") IS the advance attempt: it fires
    // the first_advance_attempt simulation-intent moment AND routes to the one
    // canonical premium-value surface via onUpgrade.
    triggerSpy.mockClear();
    fireEvent.click(screen.getByRole('button', { name: /Sign in to unlock the Realm/ }));
    expect(onUpgrade).toHaveBeenCalled();
    await waitFor(() => {
      expect(triggerSpy).toHaveBeenCalledWith('first_advance_attempt', setActivePricingMoment, { tier: 'anon' });
    });
  });
});

describe('RealmInspector — overlay structure', () => {
  test('renders the rail without a body-swap (overlay) and defaults to Dashboard', async () => {
    const { container } = render(
      <RealmInspector
        open
        section="dashboard"
        onSection={() => {}}
        onClose={() => {}}
        campaign={simulatedCampaign}
        canManageCampaigns
        tier="premium"
      />,
    );
    const rail = screen.getByTestId('realm-inspector');
    expect(rail).toBeTruthy();
    // Overlay, not a flow element: it is absolutely positioned over the map.
    expect(rail.style.position).toBe('absolute');
    // The default section is the dashboard (lazy-loaded inside the rail's Suspense).
    expect(await screen.findByTestId('realm-dashboard')).toBeTruthy();
    // It does not render the map — it is a sibling overlay of it (the map lives in
    // WorldMapStage). Here we assert the rail mounts independently.
    expect(container.querySelector('iframe')).toBeNull();
  });

  test('open=false renders nothing (the map underneath is untouched)', () => {
    const { container } = render(
      <RealmInspector
        open={false}
        section="dashboard"
        onSection={() => {}}
        onClose={() => {}}
        campaign={simulatedCampaign}
        canManageCampaigns
        tier="premium"
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  test('Faith folds the Pantheon in — always present, graceful when dormant', () => {
    // THE HERALD (2026-07-22): the old self-hiding Pantheon door folds into Faith,
    // which — unlike the old tab — is ALWAYS present. A deity-free realm's Faith door
    // shows its own empty state (the spread mechanics), never a broken pantheon block
    // or a vanished door. There is no standalone 'Pantheon' door any longer.
    const dormant = { ...simulatedCampaign, worldState: { ...simulatedCampaign.worldState, pantheon: {} } };
    render(
      <RealmInspector
        open
        section="dashboard"
        onSection={() => {}}
        onClose={() => {}}
        campaign={dormant}
        canManageCampaigns
        tier="premium"
      />,
    );
    // No standalone Pantheon door (folded into Faith).
    expect(screen.queryByRole('button', { name: 'Pantheon' })).toBeNull();
    // Faith is present even with an empty pantheon ledger (it no longer self-hides).
    expect(screen.getByRole('button', { name: 'Faith' })).toBeTruthy();
    // War remains a door too.
    expect(screen.getByRole('button', { name: 'War' })).toBeTruthy();
  });
});

// ── C3 finding 12 — no raw settlement id in a realm headline ─────────────────
// The Conflict sub-line and the hegemony nameFor once fell back to the raw id
// ("s_3 war-weary") when the name lookup missed. Both now degrade to in-fiction
// generics; this source pin keeps the raw-id fallback from returning.
describe('RealmDashboard — headline fallbacks stay in-fiction', () => {
  test('no raw-id fallback in the conflict sub-line or hegemony nameFor', async () => {
    const { readFileSync } = await import('node:fs');
    const { resolve } = await import('node:path');
    const src = readFileSync(resolve(process.cwd(), 'src/components/map/RealmDashboard.jsx'), 'utf-8');
    expect(src).not.toMatch(/\|\|\s*weariest\.id/);
    expect(src).not.toMatch(/\|\|\s*topAggressor\.id/);
    expect(src).not.toMatch(/nameFor:[^\n]*\|\|\s*String\(id\)/);
    expect(src).toMatch(/\|\|\s*'a settlement'/);
    expect(src).toMatch(/\|\|\s*'an unnamed seat'/);
  });
});
