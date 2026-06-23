/** @vitest-environment jsdom */
/**
 * workshopMobileGate.test.jsx — the MOBILE pass for the Settlement Detail edit
 * surface (Phase 5c).
 *
 * Contract under test (mobile = read + light-act; heavy authoring defers to
 * desktop per the locked read-mostly matrix):
 *
 *   1. On mobile, Card 2's "Make Changes" defers the dense EventComposer behind a
 *      DesktopOnlyGate, but KEEPS the change-queue VIEW/commit live (a staged
 *      queue still renders and can be committed at the table).
 *   2. On mobile, "Assign a Deity" and the link/rename changeExtras defer to a
 *      desktop gate (no PrimaryDeityPicker, no live changeExtras).
 *   3. On mobile, the "Living-world Layers" toggles defer to a desktop gate
 *      (none of the three gate toggles mount).
 *   4. DESKTOP is unchanged: the EventComposer, deity picker, layer toggles, and
 *      changeExtras all mount as before, with no desktop gate.
 *   5. The SystemStateGrid health grid stacks to a single column on mobile and
 *      stays two-up on desktop.
 *
 * jsdom has no matchMedia, so we install a controllable fake (mobile vs desktop)
 * and reset module state per case so the per-breakpoint useIsMobile store does
 * not leak across renders.
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';

// ── Stub the read surfaces + premium write controls as bare markers, exactly as
//    workshop.test.jsx does, so this test isolates the mobile gate wiring. ──────
vi.mock('../../src/components/settlement/ReadSystemStateBar.jsx', () => ({ default: () => <div data-testid="read-system-state-bar" /> }));
vi.mock('../../src/components/settlement/WarFaithSection.jsx', () => ({ default: () => <div data-testid="war-faith-section" /> }));
vi.mock('../../src/components/dossier/EngineSections.jsx', () => ({
  EconomicsGranarySection: () => <div data-testid="economics-granary-section" />,
  DefenseWarFrontSection: () => <div data-testid="defense-warfront-section" />,
  PowerSuccessionSection: () => <div data-testid="power-succession-section" />,
  NpcAgencySection: () => <div data-testid="npc-agency-section" />,
}));
vi.mock('../../src/components/settlement/EventComposer.jsx', () => ({ default: () => <div data-testid="event-composer" /> }));
vi.mock('../../src/components/settlement/PrimaryDeityPicker.jsx', () => ({ default: () => <div data-testid="primary-deity-picker" /> }));
vi.mock('../../src/components/settlement/Timeline.jsx', () => ({ default: () => <div data-testid="timeline" /> }));
vi.mock('../../src/components/settlement/PendingIntentions.jsx', () => ({ default: () => <div data-testid="pending-intentions" /> }));
vi.mock('../../src/components/settlement/CoherencePanel.jsx', () => ({ default: () => <div data-testid="coherence-panel" /> }));
vi.mock('../../src/components/settlement/ProvenanceBlock.jsx', () => ({ default: () => <div data-testid="provenance-block" /> }));

// A staged change-queue so we can prove the queue VIEW/commit stays live on
// mobile even while the composer is gated.
const baseState = {
  campaigns: [{ id: 'camp-1', settlementIds: ['save-1'], worldState: { simulationRules: {} } }],
  savedSettlements: [{ id: 'save-1', name: 'Stoneford' }],
  changeQueues: { 'save-1': [{ id: 'o1', humanLabel: 'Install a new ruler' }] },
  changeQueueFlushing: false,
  cancelQueuedChange: vi.fn(),
  flushQueue: vi.fn(),
  updateCampaignSimulationRules: vi.fn(() => Promise.resolve()),
  setPurchaseModalOpen: vi.fn(),
};

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(baseState); }
  useStore.getState = () => baseState;
  return { useStore };
});

// ── Controllable matchMedia fake. The whole app shares ONE useIsMobile store per
//    breakpoint; reset modules per case so the matches value is read fresh. ─────
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

async function loadWorkshop() {
  vi.resetModules();
  return (await import('../../src/components/settlement/Workshop.jsx')).default;
}

async function loadGrid() {
  vi.resetModules();
  return (await import('../../src/components/settlement/SystemStateBar.jsx')).SystemStateGrid;
}

const settlement = { name: 'Stoneford', npcs: [], factions: [], config: {} };
const changeExtras = <div data-testid="change-extras-marker" />;

function openCard(id) {
  const card = screen.getByTestId(`workshop-card-${id}`);
  fireEvent.click(card.querySelector('button'));
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('Workshop — mobile heavy-authoring gate', () => {
  test('mobile: Make Changes gates the composer but keeps the change-queue live', async () => {
    installMatchMedia(true);
    const Workshop = await loadWorkshop();
    render(<Workshop settlement={settlement} saveId="save-1" editMode canEdit onQueueCommitted={() => {}} queueActive changeExtras={changeExtras} />);

    // make-changes default-opens in edit mode.
    const make = screen.getByTestId('workshop-card-make-changes');
    // The dense composer is deferred to desktop.
    expect(within(make).queryByTestId('event-composer')).toBeNull();
    expect(within(make).queryByTestId('coherence-panel')).toBeNull();
    // The change-queue VIEW/commit stays live (staged order is visible).
    expect(within(make).getByTestId('change-queue-panel')).toBeTruthy();
    expect(within(make).getByText('Install a new ruler')).toBeTruthy();
    // The desktop gate panel is present (role=note from DesktopOnlyGate).
    expect(within(make).getAllByText(/larger screen/i).length).toBeGreaterThan(0);
  });

  test('mobile: deity assign + living-world layers + changeExtras all defer to desktop', async () => {
    installMatchMedia(true);
    const Workshop = await loadWorkshop();
    render(<Workshop settlement={settlement} saveId="save-1" editMode canEdit changeExtras={changeExtras} />);

    openCard('assign-deity');
    const deity = screen.getByTestId('workshop-card-assign-deity');
    expect(within(deity).queryByTestId('primary-deity-picker')).toBeNull();
    expect(within(deity).getAllByText(/larger screen/i).length).toBeGreaterThan(0);

    openCard('living-world-layers');
    const layers = screen.getByTestId('workshop-card-living-world-layers');
    expect(within(layers).queryByTestId('workshop-gate-warLayerEnabled')).toBeNull();
    expect(within(layers).queryByTestId('workshop-gate-religionDynamicsEnabled')).toBeNull();

    // The link/rename changeExtras defer to a desktop gate, not the live JSX.
    const changeGroup = screen.getByTestId('workshop-group-change-the-settlement');
    expect(within(changeGroup).queryByTestId('change-extras-marker')).toBeNull();
  });

  test('desktop: every write control mounts and no desktop gate appears', async () => {
    installMatchMedia(false);
    const Workshop = await loadWorkshop();
    render(<Workshop settlement={settlement} saveId="save-1" editMode canEdit changeExtras={changeExtras} />);

    // make-changes default-opens; the composer mounts.
    expect(screen.getByTestId('event-composer')).toBeTruthy();

    openCard('assign-deity');
    expect(screen.getByTestId('primary-deity-picker')).toBeTruthy();

    openCard('living-world-layers');
    expect(screen.getByTestId('workshop-gate-warLayerEnabled')).toBeTruthy();

    // changeExtras render live, not gated.
    expect(screen.getByTestId('change-extras-marker')).toBeTruthy();
    // No "best on a larger screen" gate text anywhere on desktop.
    expect(screen.queryByText(/larger screen/i)).toBeNull();
  });
});

describe('SystemStateGrid — mobile single-column reflow', () => {
  const systemState = {
    resilience: { value: 60, band: 'Stable', drivers: [], risks: [] },
    volatility: { value: 30, band: 'Calm', drivers: [], risks: [] },
    externalThreat: { value: 20, band: 'Quiet', drivers: [], risks: [] },
    resourcePressure: { value: 40, band: 'Eased', drivers: [], risks: [] },
  };

  test('mobile: the four dimension tiles stack to one column', async () => {
    installMatchMedia(true);
    const SystemStateGrid = await loadGrid();
    const { getByTestId } = render(<SystemStateGrid systemState={systemState} />);
    const grid = getByTestId('system-state-grid').querySelector('div[style*="grid"]');
    expect(grid.style.gridTemplateColumns).toBe('1fr');
  });

  test('desktop: the grid stays two-up', async () => {
    installMatchMedia(false);
    const SystemStateGrid = await loadGrid();
    const { getByTestId } = render(<SystemStateGrid systemState={systemState} />);
    const grid = getByTestId('system-state-grid').querySelector('div[style*="grid"]');
    expect(grid.style.gridTemplateColumns).toBe('repeat(2, 1fr)');
  });
});
