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
import HeraldSection from '../../src/components/map/HeraldSection.jsx';
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

// ── DESK-5 — the War door's map-lens chip + the filtered-denominator footer ───
describe('DESK-5 door textures (the War door)', () => {
  const baseProps = {
    open: true, onSection: vi.fn(), onClose: vi.fn(),
    canManageCampaigns: true, tier: 'premium', inspectorSize: 'default', onSetSize: vi.fn(),
  };

  test('the door→overlay affinity chip is one-tap and reversible (toggleLayer, never auto-lit)', async () => {
    const toggleLayer = vi.fn();
    storeState = {
      savedSettlements: [],
      campaigns: [],
      mapState: { layers: { warFaith: false } },
      toggleLayer,
    };
    render(<RealmInspector {...baseProps} section="war" campaign={{ id: 'c1', name: 'Realm', worldState: {} }} />);
    const chip = await screen.findByTestId('door-lens-war');
    // Never auto-lit: mounting the door called no toggle.
    expect(toggleLayer).not.toHaveBeenCalled();
    expect(chip.getAttribute('aria-pressed')).toBe('false');
    expect(chip.textContent).toMatch(/Light the war & faith lens/);
    fireEvent.click(chip);
    expect(toggleLayer).toHaveBeenCalledWith('warFaith');

    // Reversible: with the lens lit the same chip reads as the dimmer.
    cleanup();
    storeState = { ...storeState, mapState: { layers: { warFaith: true } }, toggleLayer: vi.fn() };
    render(<RealmInspector {...baseProps} section="war" campaign={{ id: 'c1', name: 'Realm', worldState: {} }} />);
    const litChip = await screen.findByTestId('door-lens-war');
    expect(litChip.getAttribute('aria-pressed')).toBe('true');
    expect(litChip.textContent).toMatch(/Dim the war & faith lens/);
  });

  test('a narrowing filter names its denominator as a sentence; unfiltered pages carry no footer', async () => {
    storeState = { savedSettlements: [], campaigns: [], mapState: { layers: {} } };
    // Unfiltered: no footer (the heading count already says the total).
    render(<RealmInspector {...baseProps} section="war" campaign={{ id: 'c1', name: 'Realm', worldState: {} }} />);
    await screen.findByTestId('door-lens-war');
    expect(screen.queryByTestId('herald-filter-footer')).toBeNull();
    cleanup();

    // Positive: the footer is a sentence naming the denominator, driven straight
    // through HeraldSection (the four report doors share this one surface).
    const items = [{ id: 'w1', section: 'war', headline: 'A siege', severity: 0.5, tick: 3, subject: {}, affectedIds: [] }];
    render(<HeraldSection items={items} emptyLead="quiet" nameById={new Map()} totalCount={5} narrowing />);
    expect(screen.getByTestId('herald-filter-footer').textContent)
      .toMatch(/1 of 5 reports shown; the rest stand outside the current filter\./);
    cleanup();

    // Emptied-by-filter: the sentence still names the whole register.
    render(<HeraldSection items={[]} emptyLead="quiet" nameById={new Map()} totalCount={4} narrowing />);
    expect(screen.getByTestId('herald-filter-footer').textContent)
      .toMatch(/All 4 reports stand outside the current filter\./);
  });
});

// ── DESK-4 — perspective-anchored standings ("the world as X believes it") ───
describe('PerspectiveStandings — one observer, plain words, DM-gated beliefs', () => {
  const NAMES = new Map([['obs', 'Obsford'], ['foe', 'Foehold'], ['pal', 'Palmere']]);
  const campaignFixture = () => ({
    id: 'c9', settlementIds: ['obs', 'foe', 'pal'],
    worldState: {
      tick: 8,
      deployments: {
        obs: { targetId: 'foe', sinceTick: 2, casusReasons: [{ type: 'grievance', score: 1 }] },
        pal: { targetId: 'foe', sinceTick: 3, joinLedger: [{ originAttackerId: 'obs', enemyId: 'foe', sourceCauseTypes: ['grievance'] }] },
      },
      spatialLedgers: {
        beliefMaps: { obs: { seat: { foe: { strengthBand: 3, readiness: 0.8, allianceLabel: 'rival', faithLabel: null, confidence01: 0.6, lastUpdateTick: 4 } } } },
      },
    },
  });

  test('a premium DM sees the public war facts AND the believed half; terms carry explainers', async () => {
    storeState = { auth: { tier: 'premium' }, isElevated: () => false };
    const { default: PerspectiveStandings } = await import('../../src/components/map/PerspectiveStandings.jsx');
    render(<PerspectiveStandings campaign={campaignFixture()} nameById={NAMES} />);
    const block = screen.getByTestId('perspective-standings');
    expect(block.textContent).toContain('The world as Obsford knows it');
    // The coalition fact (public, from the war edges).
    expect(block.textContent).toMatch(/Obsford campaigns beside Palmere/);
    // The believed half (DM): strength/readiness words + confidence + staleness.
    expect(block.textContent).toMatch(/believes Foehold formidable, in the field \(confident, word aging\)/);
    // Term explainer rides the line (the churn-badge aria idiom).
    expect(screen.getAllByLabelText(/DM knowledge/).length).toBeGreaterThan(0);
  });

  test('a free session keeps the public facts and NEVER the believed half (fail closed)', async () => {
    storeState = { auth: { tier: 'free' }, isElevated: () => false };
    const { default: PerspectiveStandings } = await import('../../src/components/map/PerspectiveStandings.jsx');
    render(<PerspectiveStandings campaign={campaignFixture()} nameById={NAMES} />);
    const block = screen.getByTestId('perspective-standings');
    expect(block.textContent).toMatch(/campaigns beside Palmere/);
    expect(block.textContent).not.toMatch(/believes/); // anchored: the same block just matched the public coalition fact, so the surface lives; the absent believes-line is the fail-closed claim.
  });

  test('switching the observer re-anchors the page; a standing-less observer reads an honest nothing', async () => {
    storeState = { auth: { tier: 'premium' }, isElevated: () => false };
    const { default: PerspectiveStandings } = await import('../../src/components/map/PerspectiveStandings.jsx');
    render(<PerspectiveStandings campaign={campaignFixture()} nameById={NAMES} />);
    fireEvent.change(screen.getByLabelText('Pick the observing settlement'), { target: { value: 'foe' } });
    const block = screen.getByTestId('perspective-standings');
    expect(block.textContent).toContain('The world as Foehold knows it');
    // Foehold's own standpoint: it is the besieged party — the same ledgers,
    // re-anchored (and none of Obsford's belief lines leak across).
    expect(block.textContent).toMatch(/Foehold is besieged by/);
    expect(block.textContent).not.toMatch(/believes/); // anchored: the re-anchored header and siege line were proven above, so the surface lives; no belief may leak across observers.
    cleanup();

    // A realm at rest: settlements but no ledgers ⇒ the honest empty note,
    // never a fabricated neutral matrix.
    storeState = { auth: { tier: 'premium' }, isElevated: () => false };
    render(<PerspectiveStandings campaign={{ id: 'c0', settlementIds: ['obs', 'pal'], worldState: { tick: 1 } }} nameById={NAMES} />);
    expect(screen.getByTestId('perspective-standings').textContent)
      .toMatch(/records no standing toward another settlement/);
  });

  test('no settlements ⇒ no standpoint ⇒ nothing renders (the door tests above stay quiet)', async () => {
    storeState = { auth: { tier: 'premium' }, isElevated: () => false };
    const { default: PerspectiveStandings } = await import('../../src/components/map/PerspectiveStandings.jsx');
    const { container } = render(<PerspectiveStandings campaign={{ id: 'c1', name: 'Realm' }} nameById={NAMES} />);
    expect(container.firstChild).toBeNull();
  });
});
