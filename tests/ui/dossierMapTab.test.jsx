/** @vitest-environment jsdom */
/**
 * dossierMapTab.test.jsx — MAP AS THE FIFTH TAB (order W2-c).
 *
 * The town map moved from a sibling [Dossier | Map] toggle (saved view only) into
 * a first-class tab inside OutputContainer, so it is now reachable from EVERY
 * OutputContainer surface — including the wizard draft flow, which previously had
 * no way to reach the map at all.
 *
 * These tests pin the WIRING, not the pane internals (those are covered by
 * settlementMapPane.mount.test.jsx): the Map group is present on an owner surface,
 * selecting it mounts SettlementMapPane (stubbed here), and — the privacy gate —
 * it is DROPPED from a public gallery dossier, which keeps its own owner-opt-in map.
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

const mocks = vi.hoisted(() => ({
  storeState: { settlement: null, savedSettlements: [], userPrefs: {} },
}));
vi.mock('../../src/store/index.js', () => {
  const useStore = (selector) => selector(mocks.storeState);
  useStore.getState = () => mocks.storeState;
  return { useStore };
});
vi.mock('../../src/lib/supabase.js', () => ({ supabase: {}, isConfigured: false }));
vi.mock('../../src/generators/aiLayer', () => ({ runTemplateNarrative: vi.fn() }));
vi.mock('../../src/components/new/tabs/OverviewTab', () => ({
  default: () => <div data-testid="overview-stub" />,
}));
// Stub the heavy map pane — its rendering is covered by settlementMapPane.mount.
// Here we only prove the Map TAB reaches it (the W2-c wiring), so a marker suffices.
vi.mock('../../src/components/townMap/SettlementMapPane.jsx', () => ({
  default: () => <div data-testid="map-pane-stub">MAP_PANE</div>,
}));

import OutputContainer from '../../src/components/OutputContainer.jsx';

afterEach(cleanup);

const settlement = { name: 'Ashford', tier: 'town', population: 1200 };

describe('OutputContainer — Map as the fifth tab (W2-c)', () => {
  test('owner surface: the Map group is present and selecting it mounts the map pane', async () => {
    // readOnly + saveId ⇒ publicDossier is FALSE (a saveId is present), so this is
    // an owner surface where the map tab shows. (The wizard draft — not readOnly,
    // no saveId — is likewise not a publicDossier, so it too surfaces the tab.)
    render(<OutputContainer settlement={settlement} readOnly saveId="save-1" />);

    // The Map group tab is reachable in the group strip.
    const mapGroup = await screen.findByText('Map');
    fireEvent.click(mapGroup);

    // Selecting it mounts the (lazy) SettlementMapPane inside the dossier.
    expect(await screen.findByTestId('map-pane-stub')).toBeTruthy();
  });

  test('public gallery dossier: the Map tab is dropped (its own opt-in map governs)', async () => {
    // readOnly + NO saveId ⇒ publicDossier true ⇒ the map tab is gated off, so a
    // public dossier never double-renders a map (PublicDossierView keeps the
    // owner-opt-in [Dossier | Map] toggle).
    render(<OutputContainer settlement={settlement} readOnly playerView publicChronicle={[]} />);
    // No Map group in the strip for the public viewer.
    expect(screen.queryByText('Map')).toBeNull();
    expect(screen.queryByTestId('map-pane-stub')).toBeNull();
  });
});
