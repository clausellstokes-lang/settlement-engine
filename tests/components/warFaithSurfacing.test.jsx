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
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';

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
//
// ⛔ THE STUBS ARE NOW SWAPPABLE, AND THE MOUNT PINS BELOW ARE NOT WHAT NEEDED IT.
// VIS-906 (§906) owes a FIRST-PAINT proof — "a lit sentence a reader cannot see is
// dark" — and that proof is worthless against a stub: `'war-resolve-mounted'` is a
// bare string with no host chain, so asserting it is visible asserts nothing about
// the prose a reader actually meets. The mount pins still want the stub (they assert
// the GATE, and a real block would drag its siblings' store reads into a test about
// a flag). So each factory returns ONE component that dispatches on `swap.state.on`:
// OFF (the default, and the state every pre-existing test runs in) is the historic
// stub, byte-for-byte; ON is `createElement(actual.default, props)` — the REAL block,
// in the SAME React instance, because `importOriginal()` and `import('react')` here
// resolve through the live module cache. That is the whole reason this is a factory
// swap rather than `vi.resetModules()` + a dynamic re-import: resetting the registry
// would hand the fresh graph a SECOND React while `render` still held the first, and
// every hook in WarResolveSection's `useMemo` would throw on an invalid hook call.
const swap = vi.hoisted(() => {
  const state = { on: false };
  return {
    state,
    /**
     * @param {() => Promise<any>} importOriginal
     * @param {(props: any) => any} stub what the historic mount pins observe
     */
    make: async (importOriginal, stub) => {
      const actual = await importOriginal();
      const { createElement } = await import('react');
      return { default: (props) => (state.on ? createElement(actual.default, props) : stub(props)) };
    },
  };
});
vi.mock('../../src/components/map/LiveWarStatus.jsx', io => swap.make(io, () => null));
vi.mock('../../src/components/map/RealmIntrigue.jsx', io => swap.make(io, () => null));
vi.mock('../../src/components/map/BeliefDivergenceBand.jsx', io => swap.make(io, () => null));
vi.mock('../../src/components/map/WarResolveSection.jsx', io => swap.make(io, (props) => {
  warResolveCapture.props = props;
  return 'war-resolve-mounted';
}));

import RealmInspector from '../../src/components/map/RealmInspector.jsx';
import HeraldSection from '../../src/components/map/HeraldSection.jsx';
import HeraldBody from '../../src/components/map/HeraldBody.jsx';
import WarFaithMapOverlay from '../../src/components/map/WarFaithMapOverlay.jsx';
import SimulationRulesDialog from '../../src/components/map/SimulationRulesDialog.jsx';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

/** The source tree this suite reads its fold verdicts out of (see readSrc below). */
const SRC_COMPONENTS = join(dirname(fileURLToPath(import.meta.url)), '../../src/components');

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

// ── §906 VIS — THE FIRST-PAINT LAW over the War door ─────────────────────────
/**
 * ⛔ A MOUNT IS NOT A READER. The three pins at the head of this file prove the
 * GATE (flag off ⇒ absent, flag on ⇒ mounted, no campaign ⇒ empty state) against a
 * STUB whose whole body is the string `'war-resolve-mounted'`. A stub has no host
 * chain, so none of them can answer the question §904's L-UI-MAT receipt left open
 * at row R6: does a reader of the real War door actually SEE the War & Resolve
 * prose on first paint, with no click?
 *
 * The law applied here is DESK-VISIBILITY's, stated in
 * tests/lint/dossierMountRegistry.walker.test.js:1285-1430 — "a lit sentence a
 * reader cannot see is dark". Its two halves are asserted separately below,
 * because they fail differently:
 *
 *   THE DOM HALF — no ancestor between the surface and the container root carries
 *   `hidden`, `aria-hidden="true"`, an inline `display:none`, or `aria-expanded=
 *   "false"`. This is a live walk of `parentElement`, not a source claim.
 *
 *   THE FOLD HALF — a shut `<Section collapsible>` / `<Collapsible>` emits NO BYTES
 *   (Primitives.jsx:120's `{open && children}`), so a fold cannot be caught by
 *   looking at what rendered: there is nothing to look at. The walker therefore
 *   grades folds by a SOURCE READ of the opening tag, and so does this suite. The
 *   mechanism each primitive on this path offers, measured at 0eb028111:
 *     • HeraldSection  — offers NO fold on the children path at all. Its `{children}`
 *       (HeraldSection.jsx:52) sits OUTSIDE the `<Section>` opened on the next line,
 *       which wraps only the report feed. The War door's whole live-block grid,
 *       WarResolveSection included, is that `children`. Asserted structurally below.
 *     • WorldPulsePrimitives.Section — NOT a fold. It is a plain <section> + <h3> +
 *       unconditional `{children}` (:185-199): no open state, no `defaultOpen`, no
 *       `aria-expanded`, nothing to toggle. It offers no runtime mechanism to read,
 *       so the source read is the only honest instrument.
 *     • The `<Section heading="At war">` at WarResolveSection.jsx:163 carries no
 *       `collapsible` attribute, which is exactly what the walker's `hostOpenness`
 *       (:1420-1428) keys on to grade a host OPEN.
 *   No primitive on this path exposes `aria-expanded` or a toggle heading, so the
 *   source read is used for the fold half throughout — reported as such in the receipt.
 */
describe('§906 — War & Resolve is READ inside the real War door, not merely mounted', () => {
  // s1 (Ravager) besieges s2 (Aurelia); Aurelia holds a teleportation circle. The
  // SHAPE is reused from tests/ui/warResolveSection.test.jsx, which pins the same
  // block in isolation — the difference this suite exists for is the HOST.
  const nameById = new Map([['s1', 'Ravager'], ['s2', 'Aurelia']]);
  const town = (name, patch = {}) => ({
    name,
    tier: patch.tier || 'town',
    population: patch.population || 4000,
    config: { magicExists: true, government: 'Council' },
    institutions: patch.institutions || [],
    economicState: { foodSecurity: patch.foodSecurity || { storageMonths: 6, deficitPct: 0 } },
    powerStructure: {
      publicLegitimacy: { score: patch.legitimacy ?? 60 },
      factions: [{ faction: 'Town Council', category: 'civic', power: 60, isGoverning: true }],
    },
    npcs: [{ id: `n_${name}`, name: `Reeve of ${name}`, importance: 'key' }],
  });
  const siegeCampaign = {
    id: 'c1',
    name: 'Realm',
    settlementIds: ['s1', 's2'],
    worldState: { deployments: { s1: { targetId: 's2', sinceTick: 2, role: 'siege' } }, warExhaustion: {} },
    regionalGraph: { channels: [{ type: 'war_front', from: 's1', to: 's2', status: 'confirmed' }] },
  };
  const siegeSaves = [
    { id: 's1', name: 'Ravager', settlement: town('Ravager', { tier: 'city', population: 30000 }) },
    { id: 's2', name: 'Aurelia', settlement: town('Aurelia', { institutions: [{ name: 'Teleportation Circle', status: 'active' }], foodSecurity: { storageMonths: 0.5, deficitPct: 40 } }) },
  ];

  const doorProps = {
    section: 'war',
    campaign: siegeCampaign,
    saves: siegeSaves,
    nameById,
    tier: 'premium',
    canManageCampaigns: true,
    emptyHandlers: {},
  };

  beforeEach(() => {
    // THE REAL BLOCKS, and the STORE mocked rather than any block: a sibling that
    // reads the store is still the sibling a reader meets.
    swap.state.on = true;
    storeState = {
      savedSettlements: siegeSaves,
      campaigns: [siegeCampaign],
      activeCampaignId: 'c1',
      mapState: { layers: { warFaith: false }, placements: {} },
      toggleLayer: vi.fn(),
      auth: { tier: 'premium' },
      isElevated: () => false,
      geometryVersion: 0,
    };
  });
  afterEach(() => { swap.state.on = false; });

  /**
   * Every ancestor from `el` up to (and including) `root`, nearest first.
   * @param {Element} el @param {Element} root @returns {Element[]}
   */
  function chainTo(el, root) {
    const chain = [];
    for (let node = el; node; node = node.parentElement) {
      chain.push(node);
      if (node === root) break;
    }
    return chain;
  }

  /**
   * THE DOM HALF of the first-paint law, asserted per ancestor so a failure names
   * the exact element that hid the prose rather than reporting a bare false.
   * @param {Element} el @param {Element} root @param {string} label
   */
  function expectNoHiddenAncestor(el, root, label) {
    for (const node of chainTo(el, root)) {
      const how = node.hasAttribute('hidden') ? 'the `hidden` attribute'
        : node.getAttribute('aria-hidden') === 'true' ? 'aria-hidden="true"'
          : node.style?.display === 'none' ? 'an inline display:none'
            : node.getAttribute('aria-expanded') === 'false' ? 'aria-expanded="false" (a shut fold)'
              : null;
      expect(
        how,
        `FIRST-PAINT LAW [${label}]: <${node.tagName.toLowerCase()}> on the host chain hides`
        + ` the surface with ${how}. A lit sentence a reader cannot see is dark.`,
      ).toBeNull();
    }
  }

  // `join(dirname(fileURLToPath(import.meta.url)), …)` — the same derivation the
  // tests/lint walkers use (negativeAssertionAnchor:79, dossierMountRegistry:72).
  // ⚠ NOT `new URL(rel, import.meta.url)`: measured under this suite's jsdom
  // environment, that resolved to `<testdir>/undefined` rather than the source path.
  const readSrc = (rel) => readFileSync(join(SRC_COMPONENTS, rel), 'utf8');

  test('the lit prose reaches the accessible DOM on first paint, with no interaction', () => {
    flagMock.mockImplementation(name => name === 'warEconomySurfacing');
    const { container } = render(<HeraldBody {...doorProps} />);

    // (b) THE PROSE ITSELF — the "At war" section heading is a real heading in the
    // accessible tree, and the Resolve chip beside it is the block's own reading.
    // No click, no `openSection()` helper, no fixture chosen to spring a fold: this
    // is the door as it paints.
    const atWar = screen.getByRole('heading', { name: 'At war' });
    expect(atWar).toBeTruthy();
    // Scoped to the surface's own <section>: the real siblings name these settlements
    // too (that is the point of rendering them real), so a page-wide getByText would
    // be satisfied by a neighbour's mention and prove nothing about THIS block.
    const surface = atWar.closest('section');
    expect(surface).toBeTruthy();
    const inSurface = within(surface);
    expect(inSurface.getAllByText('Resolve').length).toBeGreaterThan(0);
    // The besieged town and its siege badge are the sentence the surface exists for.
    expect(inSurface.getByText('Aurelia')).toBeTruthy();
    expect(inSurface.getByText('Under siege')).toBeTruthy();

    // (c) THE DOM HALF of the law, over the whole chain from the heading to the root.
    expectNoHiddenAncestor(atWar, container, 'War door → At war');
  });

  test('the fold half: no statically-shut host stands between the surface and the door root', () => {
    // Graded the way tests/lint/dossierMountRegistry.walker.test.js:1420-1428 grades
    // a host, because a shut fold renders no bytes for a DOM walk to find.
    const warResolve = readSrc('map/WarResolveSection.jsx');
    const openings = [...warResolve.matchAll(/<Section\b[^>]*>/g)].map(m => m[0]);
    expect(openings.length).toBeGreaterThan(0);
    for (const tag of openings) {
      // `Section` folds ONLY when passed `collapsible`; absent it, the walker's
      // hostOpenness (dossierMountRegistry.walker.test.js:1420-1428) grades it 'open'.
      // anchored: the `openings.length > 0` assertion above is the liveness anchor — a renamed or deleted primitive empties the list and reds THERE, so this exclusion can never pass vacuously against nothing.
      expect(tag, `a fold appeared on the War & Resolve host: ${tag}`).not.toMatch(/\bcollapsible\b/);
    }

    // The primitive itself offers no fold to open: plain <section>, unconditional children.
    const primitives = readSrc('map/WorldPulsePrimitives.jsx');
    const sectionDecl = primitives.slice(primitives.indexOf('export function Section('));
    const sectionBody = sectionDecl.slice(0, sectionDecl.indexOf('\n}\n') + 2);
    expect(sectionBody).toContain('{children}');
    expect(sectionBody).not.toMatch(/defaultOpen|aria-expanded|useState/); // anchored: the same slice just proved it renders {children}, so the component is live; the absent fold machinery is the claim.

    // HeraldSection hands the door's live-block grid through as `children`, and its
    // own <Section> (the report feed) opens AFTER that line — so the feed's host can
    // never enclose WarResolveSection. Positional, because that is the actual defence.
    const herald = readSrc('map/HeraldSection.jsx');
    const childrenAt = herald.indexOf('{children}');
    const sectionAt = herald.indexOf('<Section ');
    expect(childrenAt).toBeGreaterThan(-1);
    expect(sectionAt).toBeGreaterThan(-1);
    expect(
      childrenAt,
      'HeraldSection moved {children} INSIDE its report-feed <Section>: the War door\'s'
      + ' live blocks would then inherit that host, and this suite\'s DOM proof would be'
      + ' grading a different chain than the one the reader meets.',
    ).toBeLessThan(sectionAt);
  });

  test('NEGATIVE CONTROL: with the flag forced OFF the same door paints none of that prose', () => {
    flagMock.mockReturnValue(false);
    const { container } = render(<HeraldBody {...doorProps} />);
    // The door itself is unmistakably live — it is the same render, same fixture,
    // same real siblings; only the flag moved. `Since the last turning` is the
    // HeraldSection feed heading, which travels the identical code path.
    expectAbsentWithAnchor(
      container.textContent,
      'At war',
      'Since the last turning',
      'warEconomySurfacing OFF ⇒ the War & Resolve surface is dark in the real War door',
    );
    expectAbsentWithAnchor(
      container.textContent,
      'Under siege',
      'Since the last turning',
      'warEconomySurfacing OFF ⇒ the siege badge is dark in the real War door',
    );
  });

  // ── LT39 car 4 — the War door now carries BOTH halves of one desk ──────────
  //
  // PerspectiveStandings says what a settlement's standings ARE; the relationship
  // chronicle says what they SURVIVED. The pin is that the SAME door paints both
  // in the same render, because the whole point of mounting inside the existing
  // door rather than minting a tenth was that the two read as one desk.
  test('the War door surfaces BOTH the standings desk and the chronicle beneath it', () => {
    flagMock.mockImplementation(name => name === 'warEconomySurfacing');
    const withHistory = {
      ...siegeCampaign,
      worldState: {
        ...siegeCampaign.worldState,
        tick: 40,
        relationshipStates: {
          'rel.s1.s2': {
            relationshipType: 'hostile',
            relationshipMemory: { posture: 'open_hostility', postureLabel: 'open hostility posture' },
            turningPoints: [{ tick: 12, type: 'label_proposal_applied', fromType: 'neutral', toType: 'hostile' }],
          },
        },
      },
      regionalGraph: { ...siegeCampaign.regionalGraph, edges: [{ from: 's1', to: 's2' }] },
    };
    render(<HeraldBody {...doorProps} campaign={withHistory} />);
    const standings = screen.getByTestId('perspective-standings');
    const chronicle = screen.getByTestId('relationship-chronicle');
    expect(standings).toBeTruthy();
    expect(chronicle).toBeTruthy();
    // Same door, and the chronicle sits BENEATH the standings it completes.
    expect(standings.compareDocumentPosition(chronicle) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(chronicle.textContent).toContain('What Ravager has survived');
    expect(chronicle.textContent).toContain('The standing between them changed');
  });

  test('⛔ and the SAME door with no recorded history paints the standings ALONE', () => {
    // The empty-state discipline, proved inside the real door: the section is
    // absent, not an empty heading. siegeCampaign carries no relationshipStates.
    flagMock.mockImplementation(name => name === 'warEconomySurfacing');
    render(<HeraldBody {...doorProps} />);
    // anchored: the standings desk is asserted present in the same render, so the door is live and the chronicle's absence is the empty-state rule rather than a dead door.
    expect(screen.getByTestId('perspective-standings')).toBeTruthy();
    expect(screen.queryByTestId('relationship-chronicle')).toBeNull();
  });
});
