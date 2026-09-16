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
const warResolveCapture = vi.hoisted(() => ({ props: null }));
vi.mock('../../src/lib/flags.js', () => ({ flag: (...args) => flagMock(...args) }));

let storeState = {};
vi.mock('../../src/store/index.js', () => ({ useStore: (selector) => selector(storeState) }));
vi.mock('../../src/store', () => ({ useStore: (selector) => selector(storeState) }));

// RealmDashboard is heavy + lazy; a stub keeps the fallback dashboard render trivial
// (we only assert on the tab row + the resolve empty state, never the dashboard body).
vi.mock('../../src/components/map/RealmDashboard.jsx', () => ({ default: () => 'dashboard-stub' }));
// hasPantheon → false so the Faith door's pantheon block stays quiet, keeping this
// test focused on the War door's flag-gated War & Resolve fold-in.
vi.mock('../../src/components/map/PantheonPanel.jsx', () => ({ default: () => null, hasPantheon: () => false }));
// THE HERALD (2026-07-22): War & Resolve is no longer a standalone door — it folds
// into the War door under the warEconomySurfacing flag. Stub the War door's other
// live blocks so the assertion targets only the WarResolveSection fold-in.
vi.mock('../../src/components/map/LiveWarStatus.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/map/RealmIntrigue.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/map/BeliefDivergenceBand.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/map/WarResolveSection.jsx', () => ({
  default: (props) => {
    warResolveCapture.props = props;
    return 'war-resolve-mounted';
  },
}));

import RealmInspector from '../../src/components/map/RealmInspector.jsx';
import WarFaithMapOverlay from '../../src/components/map/WarFaithMapOverlay.jsx';
import SimulationRulesDialog from '../../src/components/map/SimulationRulesDialog.jsx';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  flagMock.mockReturnValue(false);
  warResolveCapture.props = null;
});

// ── 1. War & Resolve fold-in — flag + campaign gating ────────────────────────
describe('RealmInspector War door — War & Resolve fold-in', () => {
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

  test('flag OFF ⇒ War & Resolve does not surface in the War door (unreachable even for premium)', async () => {
    flagMock.mockReturnValue(false);
    render(<RealmInspector {...baseProps} section="war" campaign={{ id: 'c1', name: 'Realm' }} />);
    // The War door renders; the flag is consulted; the fold-in stays dark.
    await waitFor(() => expect(screen.getByText('War')).toBeTruthy());
    expect(screen.queryByText('war-resolve-mounted')).toBeNull();
    expect(flagMock).toHaveBeenCalledWith('warEconomySurfacing');
  });

  test('flag ON ⇒ War & Resolve folds into the War door', async () => {
    flagMock.mockImplementation(name => name === 'warEconomySurfacing');
    const saves = [{ id: 's1', settlement: { name: 'Marchwall' } }];
    storeState = { savedSettlements: saves };
    render(<RealmInspector {...baseProps} section="war" campaign={{ id: 'c1', name: 'Realm' }} />);
    await waitFor(() => expect(screen.getByText('war-resolve-mounted')).toBeTruthy());
    expect(warResolveCapture.props.saves).toBe(saves);
  });

  test('flag ON + no campaign ⇒ the War door shows the empty state, never war data (premium gate)', async () => {
    flagMock.mockImplementation(name => name === 'warEconomySurfacing');
    render(<RealmInspector {...baseProps} section="war" campaign={null} />);
    await waitFor(() => expect(screen.getByText(/fills once a campaign is live/i)).toBeTruthy());
    expect(screen.queryByText('war-resolve-mounted')).toBeNull();
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

    // CL-0 dialog v2: the engine gates became the per-domain tri-state rows.
    // "On its own" (auto) on the War and Faith-spread rows is the same write.
    fireEvent.click(screen.getByTestId('domain-war-auto'));
    fireEvent.click(screen.getByTestId('domain-religion-auto'));
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(updateCampaignSimulationRules).toHaveBeenCalledWith('camp-1', expect.objectContaining({
        warLayerEnabled: true,
        // War auto-enables Settlement Strategy (cascade).
        settlementStrategyEnabled: true,
        // The faith row pair-writes the canonical faithSpreadEnabled AND its
        // legacy religionDynamicsEnabled mirror so the write survives the
        // normalizer's legacy-wins lockstep (the CL-0 LivingWorldGates fix).
        religionDynamicsEnabled: true,
        faithSpreadEnabled: true,
      }));
      expect(onClose).toHaveBeenCalled();
    });
  });
});
