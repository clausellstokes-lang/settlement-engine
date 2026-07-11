/** @vitest-environment jsdom */
/**
 * warFaithSurfacing.test.jsx — Phase 5 W4b pins:
 *   1. The Realm Inspector "War & Resolve" tab is reachable ONLY when the
 *      warEconomySurfacing flag is on, and its DATA is premium/campaign-gated
 *      (a flag-on user with no campaign gets the empty state, never war data).
 *   2. The spatial WarFaithMapOverlay is dormant-quiet: with no live war records
 *      it renders nothing (null); with a live deployment it renders its glyph group.
 *   3. The SimulationRulesDialog engine gates write the sim rules — turning on the
 *      War layer + Religion dynamics and saving persists warLayerEnabled AND (via the
 *      legacy-alias reconciliation) faithSpreadEnabled.
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

// ── Shared mocks ─────────────────────────────────────────────────────────────
const flagMock = vi.fn(() => false);
vi.mock('../../src/lib/flags.js', () => ({ flag: (...args) => flagMock(...args) }));

let storeState = {};
vi.mock('../../src/store/index.js', () => ({ useStore: (selector) => selector(storeState) }));
vi.mock('../../src/store', () => ({ useStore: (selector) => selector(storeState) }));

// RealmDashboard is heavy + lazy; a stub keeps the fallback dashboard render trivial
// (we only assert on the tab row + the resolve empty state, never the dashboard body).
vi.mock('../../src/components/map/RealmDashboard.jsx', () => ({ default: () => 'dashboard-stub' }));
// hasPantheon → false so the Pantheon tab (and its AssignDeityFromMap) stay hidden,
// keeping this test focused on the resolve tab.
vi.mock('../../src/components/map/PantheonPanel.jsx', () => ({ default: () => null, hasPantheon: () => false }));

import RealmInspector from '../../src/components/map/RealmInspector.jsx';
import WarFaithMapOverlay from '../../src/components/map/WarFaithMapOverlay.jsx';
import SimulationRulesDialog from '../../src/components/map/SimulationRulesDialog.jsx';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  flagMock.mockReturnValue(false);
});

// ── 1. War & Resolve tab — flag + premium gating ─────────────────────────────
describe('RealmInspector War & Resolve tab', () => {
  beforeEach(() => { storeState = { savedSettlements: [] }; });

  const baseProps = {
    open: true,
    onSection: vi.fn(),
    onClose: vi.fn(),
    canManageCampaigns: false,
    tier: 'free',
    inspectorSize: 'default',
    onSetSize: vi.fn(),
  };

  test('flag OFF ⇒ the War & Resolve tab is not present (unreachable even for premium)', async () => {
    flagMock.mockReturnValue(false);
    render(<RealmInspector {...baseProps} section="resolve" campaign={null} />);
    await waitFor(() => expect(screen.getByText('Dashboard')).toBeTruthy());
    expect(screen.queryByText('War & Resolve')).toBeNull();
    expect(flagMock).toHaveBeenCalledWith('warEconomySurfacing');
  });

  test('flag ON ⇒ the War & Resolve tab appears', async () => {
    flagMock.mockReturnValue(true);
    render(<RealmInspector {...baseProps} section="dashboard" campaign={{ id: 'c1', name: 'Realm' }} />);
    await waitFor(() => expect(screen.getByText('War & Resolve')).toBeTruthy());
  });

  test('flag ON + no campaign ⇒ the tab shows the empty state, never war data (premium gate)', async () => {
    flagMock.mockReturnValue(true);
    render(<RealmInspector {...baseProps} section="resolve" campaign={null} />);
    await waitFor(() => expect(screen.getByText(/appears once a campaign is live/i)).toBeTruthy());
  });
});

// ── 2. Spatial overlay — dormant-quiet ───────────────────────────────────────
describe('WarFaithMapOverlay dormancy', () => {
  const layers = { regionalShowGm: true, warFaith: true };

  test('no live war records ⇒ renders nothing (byte-quiet)', () => {
    storeState = {
      savedSettlements: [{ id: 's1', settlement: { id: 's1', name: 'Town' } }],
      campaigns: [{ id: 'c1', settlementIds: ['s1'], worldState: {} }],
      activeCampaignId: 'c1',
      mapState: { placements: { b1: { settlementId: 's1', x: 10, y: 20 } }, layers },
      geometryVersion: 0,
    };
    const { container } = render(<svg><WarFaithMapOverlay /></svg>);
    expect(container.querySelector('[data-testid="war-faith-overlay"]')).toBeNull();
  });

  test('a live deployment ⇒ renders the war/faith glyph group', () => {
    storeState = {
      savedSettlements: [
        { id: 's1', settlement: { id: 's1', name: 'Aggressor' } },
        { id: 's2', settlement: { id: 's2', name: 'Target' } },
      ],
      campaigns: [{
        id: 'c1', settlementIds: ['s1', 's2'],
        worldState: { deployments: { s1: { targetId: 's2', sinceTick: 1, role: 'siege' } } },
      }],
      activeCampaignId: 'c1',
      mapState: {
        placements: { b1: { settlementId: 's1', x: 10, y: 20 }, b2: { settlementId: 's2', x: 30, y: 40 } },
        layers,
      },
      geometryVersion: 0,
    };
    const { container } = render(<svg><WarFaithMapOverlay /></svg>);
    expect(container.querySelector('[data-testid="war-faith-overlay"]')).not.toBeNull();
  });

  test('warFaith layer toggled off ⇒ renders nothing even with live records', () => {
    storeState = {
      savedSettlements: [
        { id: 's1', settlement: { id: 's1', name: 'Aggressor' } },
        { id: 's2', settlement: { id: 's2', name: 'Target' } },
      ],
      campaigns: [{
        id: 'c1', settlementIds: ['s1', 's2'],
        worldState: { deployments: { s1: { targetId: 's2', sinceTick: 1, role: 'siege' } } },
      }],
      activeCampaignId: 'c1',
      mapState: {
        placements: { b1: { settlementId: 's1', x: 10, y: 20 }, b2: { settlementId: 's2', x: 30, y: 40 } },
        layers: { regionalShowGm: true, warFaith: false },
      },
      geometryVersion: 0,
    };
    const { container } = render(<svg><WarFaithMapOverlay /></svg>);
    expect(container.querySelector('[data-testid="war-faith-overlay"]')).toBeNull();
  });
});

// ── 3. Engine gates write the sim rules ──────────────────────────────────────
describe('SimulationRulesDialog engine gates', () => {
  test('turning on War layer + Religion dynamics and saving persists the rules', async () => {
    const updateCampaignSimulationRules = vi.fn().mockResolvedValue({});
    storeState = {
      previewCampaignWorldPulse: vi.fn(),
      updateCampaignSimulationRules,
      advanceInFlight: [],
    };
    const onClose = vi.fn();
    render(<SimulationRulesDialog
      open
      campaign={{ id: 'camp-1', name: 'Realm', worldState: { simulationRules: {} } }}
      onClose={onClose}
    />);

    // The Engine disclosure defaults open while the gates are off — the gates render.
    fireEvent.click(screen.getByRole('checkbox', { name: 'War layer' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Religion dynamics' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(updateCampaignSimulationRules).toHaveBeenCalledWith('camp-1', expect.objectContaining({
        warLayerEnabled: true,
        // War auto-enables Settlement Strategy (cascade).
        settlementStrategyEnabled: true,
        // Religion gate keys on the legacy alias; normalize mirrors it to OUR
        // canonical faithSpreadEnabled — the OURS-ahead granular gate, kept in sync.
        religionDynamicsEnabled: true,
        faithSpreadEnabled: true,
      }));
      expect(onClose).toHaveBeenCalled();
    });
  });
});
