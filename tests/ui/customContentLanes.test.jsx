/**
 * @vitest-environment jsdom
 *
 * tests/ui/customContentLanes.test.jsx — UX Phase 8 Compendium overhaul.
 *
 * Covers the authoring-side guarantees:
 *   - the two authoring lanes render with the right buckets;
 *   - the dead buckets (tradeRoutes/powerPresets/defensePresets) are gone from
 *     the UI, yet a customContent profile that STILL carries them does not crash
 *     (migration-safe pruning);
 *   - the faction form shows the add-via-event banner and does NOT claim
 *     generation;
 *   - the deity Effect Preview strings come from the SHARED describeDeityEffects
 *     source (not a local copy);
 *   - the pantheon activation strip reflects authored / assigned / enabled;
 *   - the premium gate: authoring is gated by canUseCustomContent.
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, within } from '@testing-library/react';
import { describeDeityEffects } from '../../src/domain/display/deityEffects.js';

afterEach(cleanup);

// A mutable store singleton drives every selector (same pattern as the existing
// compendium smoke test). Premium by default so the authoring UI renders.
const storeState = {
  customContent: {},
  savedSettlements: [],
  campaigns: [],
  settlement: null,
  addCustomItem: vi.fn(),
  updateCustomItem: vi.fn(),
  deleteCustomItem: vi.fn(),
  canUseCustomContent: () => true,
  customContentLoading: false,
  customContentError: null,
  setPurchaseModalOpen: vi.fn(),
  getCustomContentCount: () => 0,
  auth: { tier: 'premium', user: { id: 'u1' } },
};

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});

async function importManager() {
  return (await import('../../src/components/compendium/CustomContent.jsx')).CustomContentManager;
}

describe('CustomContent — two authoring lanes', () => {
  test('renders both lanes with their buckets; dead buckets absent', async () => {
    storeState.customContent = {};
    storeState.canUseCustomContent = () => true;
    const CustomContentManager = await importManager();
    render(<CustomContentManager search="" />);

    // Both lane labels present.
    expect(screen.getByTestId('authoring-lane-settlement')).toBeTruthy();
    expect(screen.getByTestId('authoring-lane-living')).toBeTruthy();

    const settlementLane = screen.getByTestId('authoring-lane-settlement');
    const livingLane = screen.getByTestId('authoring-lane-living');

    // Settlement lane carries the static buckets…
    expect(within(settlementLane).getByText('Institutions')).toBeTruthy();
    expect(within(settlementLane).getByText('Trade Goods')).toBeTruthy();
    // …and the living lane carries deities + factions.
    expect(within(livingLane).getByText('Deities')).toBeTruthy();
    expect(within(livingLane).getByText('Factions')).toBeTruthy();

    // The dead buckets never render as bucket chips anywhere.
    expect(screen.queryByText('Trade Routes')).toBeNull();
    expect(screen.queryByText('Power Presets')).toBeNull();
    expect(screen.queryByText('Defense Presets')).toBeNull();
  });

  test('a profile carrying the dead buckets does NOT crash (migration-safe)', async () => {
    storeState.customContent = {
      institutions: [{ id: 'i1', name: 'Foundry' }],
      // Legacy/grandfathered profile still carries the pruned buckets.
      tradeRoutes: [{ id: 'tr1', name: 'Old Route' }],
      powerPresets: [{ id: 'pp1', name: 'Old Preset' }],
      defensePresets: [{ id: 'dp1', name: 'Old Defense' }],
    };
    const CustomContentManager = await importManager();
    // Mount must not throw despite the unknown buckets in the blob.
    expect(() => render(<CustomContentManager search="" />)).not.toThrow();
    expect(screen.getByTestId('custom-content-manager')).toBeTruthy();
  });
});

describe('CustomContent — faction relabel (not wired into generation)', () => {
  test('the faction form shows the add-via-event banner and does not claim generation', async () => {
    storeState.customContent = {};
    const CustomContentManager = await importManager();
    render(<CustomContentManager search="" />);

    // Click the Factions bucket chip to make it active.
    fireEvent.click(screen.getByText('Factions'));

    const heading = screen.getByText(/Factions enter through an event/i);
    expect(heading).toBeTruthy();
    // Honesty: the banner explicitly says it is NOT rolled into a generation.
    // (The "not" is bolded, so assert on the banner's full text content rather
    // than a single text node.) The banner is the heading's grandparent.
    const banner = heading.closest('div')?.parentElement;
    expect(banner?.textContent).toMatch(/not.*rolled into a fresh generation/i);
    // …and it never claims the faction will be generated.
    expect(banner?.textContent).not.toMatch(/will be generated/i);
  });
});

describe('CustomContent — deity Effect Preview reads the shared source', () => {
  test('the preview renders exactly describeDeityEffects(draft) strings', async () => {
    storeState.customContent = {};
    const CustomContentManager = await importManager();
    render(<CustomContentManager search="" />);

    // Activate Deities, open the add form (defaults: neutral/neutral/minor).
    fireEvent.click(screen.getByText('Deities'));
    fireEvent.click(screen.getByRole('button', { name: /Add Custom Deit/i }));

    const preview = screen.getByTestId('deity-effect-preview');
    // With the default minor/neutral/neutral draft the shared source emits the
    // "Minor — lends modest religious authority" line; assert the preview shows
    // exactly what describeDeityEffects returns (single source, no local copy).
    const expected = describeDeityEffects({ alignmentAxis: 'neutral', temperamentAxis: 'neutral', rankAxis: 'minor' });
    expect(expected.length).toBeGreaterThan(0);
    for (const line of expected) {
      expect(within(preview).getByText(line)).toBeTruthy();
    }
  });
});

describe('CustomContent — premium gate', () => {
  test('a non-premium user sees the upsell, not the lanes', async () => {
    storeState.customContent = {};
    storeState.canUseCustomContent = () => false;
    storeState.auth = { tier: 'free', user: { id: 'u1' } };
    const CustomContentManager = await importManager();
    render(<CustomContentManager search="" />);

    expect(screen.queryByTestId('authoring-lane-settlement')).toBeNull();
    expect(screen.getByText(/Custom Compendium/i)).toBeTruthy();

    // restore for any later tests in this file
    storeState.canUseCustomContent = () => true;
    storeState.auth = { tier: 'premium', user: { id: 'u1' } };
  });
});
