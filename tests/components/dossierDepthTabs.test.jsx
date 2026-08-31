/** @vitest-environment jsdom */
/**
 * dossierDepthTabs.test.jsx — Phase 5 W4e dossier-depth tabs, extended by the
 * §805 split (WarFaithTab → WORLD-group WarTab + FaithTab).
 *
 * Pins, above all, THE CONSTITUTIONAL CHECK: the FAITH tab is built on OUR
 * gated FaithSection, so a FREE / ANON viewer NEVER sees a deity name in it
 * (no live pantheon, no leak). It also pins the §805 WAR tab's epistemic
 * surfaces — the believed unit position with its staleness band and source
 * grade, the DM-truth divergence ("you believe the host near X; in truth it
 * stands at Y"), the muster/condition reads, the named war with its sides, and
 * the DM-only belief band (fail-closed for every other viewer) — plus that
 * Substrate + Magic render their read-models and that a magic-free settlement's
 * Magic tab is dormant (honest, not fabricated).
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

// Mock the store: WarFaithTab reads campaigns/savedSettlements/auth, and its
// composed FaithSection reads auth.tier/isElevated/the upsell seam.
vi.mock('../../src/store/index.js', () => {
  const data = {};
  function useStore(selector) { return selector(data); }
  useStore.__set = (next) => Object.assign(data, next);
  useStore.__reset = () => {
    for (const k of Object.keys(data)) delete data[k];
    Object.assign(data, {
      auth: { tier: 'anon' },
      isElevated: () => false,
      setPurchaseModalOpen: () => {},
      setActivePricingMoment: () => {},
      campaigns: [],
      savedSettlements: [],
    });
  };
  return { useStore };
});

import { useStore } from '../../src/store/index.js';
import WarTab from '../../src/components/new/tabs/WarTab.jsx';
import FaithTab from '../../src/components/new/tabs/FaithTab.jsx';
import SubstrateTab from '../../src/components/new/tabs/SubstrateTab.jsx';
import MagicTab from '../../src/components/new/tabs/MagicTab.jsx';

// A distinctive latent-deity name — if it ever appears in a free War & Faith
// render, the constitutional privacy gate has failed.
const LATENT_NAME = 'Zzyraxil the Unnamed';
const latentPantheonTown = () => ({
  name: 'Quietford',
  config: { latentPantheon: { patron: { name: LATENT_NAME, _deityRef: 'deity:core:zzyraxil' }, cults: [{ name: 'The Whispering Ash' }] } },
});
const activePatronTown = () => ({
  name: 'Sunhold',
  config: { primaryDeitySnapshot: { name: 'Sunlord Aurelian', rankAxis: 'major', lawAxis: 'lawful', domain: 'sun', alignmentAxis: 'good' } },
});

beforeEach(() => useStore.__reset());
afterEach(() => cleanup());

describe('FaithTab — the constitutional gate (free/anon see NO deity names)', () => {
  it('ANON + a latent-pantheon town shows the generic teaser and NEVER a deity name', () => {
    useStore.__set({ auth: { tier: 'anon' } });
    const { container } = render(<FaithTab settlement={latentPantheonTown()} />);
    expect(screen.getByTestId('faith-tab')).toBeTruthy();
    // The gated faith surface degrades to the generic true-neutral teaser.
    expect(screen.getByTestId('faith-teaser')).toBeTruthy();
    expect(screen.queryByTestId('faith-section')).toBeNull();
    // THE non-negotiable guarantee: no latent deity / cult name reaches the DOM.
    expect(container.textContent).not.toContain(LATENT_NAME);
    expect(container.textContent).not.toContain('Whispering Ash');
    expect(container.textContent).toMatch(/no single creed holds sway/i);
  });

  it('FREE + a latent-pantheon town also shows only the teaser (never the latent name)', () => {
    useStore.__set({ auth: { tier: 'free' } });
    const { container } = render(<FaithTab settlement={latentPantheonTown()} />);
    expect(screen.getByTestId('faith-teaser')).toBeTruthy();
    expect(container.textContent).not.toContain(LATENT_NAME);
  });

  it('an owned/shared embed renders the read-only faith panel to everyone (a shared pantheon)', () => {
    // An anon viewer of a faith-active dossier legitimately sees the OWNED embed
    // (never the latent seed) — the same behaviour FaithSection guarantees.
    useStore.__set({ auth: { tier: 'anon' } });
    render(<FaithTab settlement={activePatronTown()} publicDossier />);
    expect(screen.getByTestId('faith-section')).toBeTruthy();
    expect(screen.getByTestId('faith-patron').textContent).toMatch(/Sunlord Aurelian/);
  });

  it('a premium, deity-free town renders the honest absence note (never a blank body)', () => {
    useStore.__set({ auth: { tier: 'premium' } });
    const { container } = render(<FaithTab settlement={{ name: 'Quietford', config: {} }} />);
    expect(screen.queryByTestId('faith-section')).toBeNull();
    expect(screen.queryByTestId('faith-teaser')).toBeNull();
    expect(container.textContent).toMatch(/keeps no named faith/i);
  });
});

// ── §805 FAITH layout — the patron seat, niche occupancy, the realm pantheon ──
const liveFaithTown = () => ({
  id: 'home', name: 'Sunhold',
  config: {
    primaryDeitySnapshot: { name: 'Sunlord Aurelian', rankAxis: 'major' },
    faithProfile: {
      deities: [
        { deityRef: 'a', name: 'Sunlord Aurelian', niche: 'peacelike:good', share: 60, standing: 'ascendant', legitimacy: 0.8, isPatron: true },
        { deityRef: 'b', name: 'The Gloam', niche: 'warlike:evil', share: 25, standing: 'cult', legitimacy: 0.2, isPatron: false },
      ],
      contested: true, patronSecurity: 0.55, unaffiliated: 15,
    },
  },
});
const pantheonCampaign = () => ({
  id: 'c-faith', settlementIds: ['home'],
  worldState: { pantheon: { 'deity:sun': { seats: 2, wins: 1, losses: 0, tier: 'major' } } },
});

describe('FaithTab — the §805 layout (patron seat + niche occupancy + realm pantheon)', () => {
  it('renders the patron seat with its legitimacy NOW, and the contested marker', () => {
    useStore.__set({ auth: { tier: 'anon' } });
    render(<FaithTab settlement={liveFaithTown()} />);
    const seat = screen.getByTestId('faith-patron-seat');
    expect(seat.textContent).toMatch(/Sunlord Aurelian holds the seat/);
    expect(seat.textContent).toMatch(/secure/);           // legitimacy 0.8 band
    expect(seat.textContent).toMatch(/rightful claim 80%/);
    expect(seat.textContent).toMatch(/contested/i);
  });

  it('renders niche occupancy — who occupies which niche, one row per creed', () => {
    useStore.__set({ auth: { tier: 'anon' } });
    render(<FaithTab settlement={liveFaithTown()} />);
    const rows = screen.getAllByTestId('faith-niche-row');
    expect(rows).toHaveLength(2);
    expect(rows[0].textContent).toMatch(/peacelike · good — Sunlord Aurelian \(patron\)/);
    expect(rows[1].textContent).toMatch(/warlike · evil — The Gloam/);
  });

  it('a static embed (no live profile) renders NO fabricated seat or occupancy', () => {
    useStore.__set({ auth: { tier: 'anon' } });
    render(<FaithTab settlement={activePatronTown()} />);
    expect(screen.getByTestId('faith-section')).toBeTruthy();
    expect(screen.queryByTestId('faith-patron-seat')).toBeNull();
    expect(screen.queryByTestId('faith-niches')).toBeNull();
  });

  it('the realm pantheon mounts for the premium DM alone (never playerView / public / anon)', () => {
    useStore.__set({ auth: { tier: 'premium' }, campaigns: [pantheonCampaign()], savedSettlements: [] });
    const first = render(<FaithTab settlement={liveFaithTown()} saveId="home" />);
    expect(screen.getByTestId('faith-realm-pantheon')).toBeTruthy();
    first.unmount();

    useStore.__set({ auth: { tier: 'premium' }, campaigns: [pantheonCampaign()], savedSettlements: [] });
    const second = render(<FaithTab settlement={liveFaithTown()} saveId="home" playerView />);
    expect(screen.queryByTestId('faith-realm-pantheon')).toBeNull();
    second.unmount();

    useStore.__set({ auth: { tier: 'anon' }, campaigns: [pantheonCampaign()], savedSettlements: [] });
    render(<FaithTab settlement={liveFaithTown()} saveId="home" />);
    expect(screen.queryByTestId('faith-realm-pantheon')).toBeNull();
  });
});

// ── §805 WAR tab — the epistemic constitution made legible ────────────────────
const WAR_SAVES = [
  { id: 'home', settlement: { name: 'Homestead' } },
  { id: 'mid', settlement: { name: 'Midford' } },
  { id: 'foe', settlement: { name: 'Foehold' } },
];
/** A canonized campaign with: our column in transit under a CUT courier line
 *  (believed position ≠ true position), a live deployment (the named war + the
 *  muster), and a belief map (the DM-only band). */
const warCampaign = () => ({
  id: 'c-war', settlementIds: ['home', 'mid', 'foe'],
  worldState: {
    tick: 8, canonizedAt: '2026-01-01T00:00:00.000Z',
    deployments: {
      home: {
        targetId: 'foe', sinceTick: 2, role: 'siege',
        maxStartStrength: 60, currentEffectiveStrength: 45,
        morale: 0.7, supplyIntegrity: 0.8, foodReserve: 0.8, equipmentCondition: 0.9,
        casusReasons: [{ type: 'grievance', score: 2 }],
      },
    },
    spatialLedgers: {
      armyTransit: {
        home: {
          armyId: 'home', role: 'march', originId: 'home', destId: 'foe',
          path: ['home', 'mid', 'foe'], departTick: 0, arrivalTick: 10,
          position01: 0.8, strength: 45, readiness: 0.6, supplyQuality: 1,
          funding: 0.5, beliefStaleness: 6, lastTick: 8,
        },
      },
      beliefMaps: {
        home: { seat: { foe: { strengthBand: 1, readiness: 0.8, allianceLabel: 'rival', faithLabel: null, confidence01: 0.6, lastUpdateTick: 4 } } },
      },
    },
  },
});
const homeTown = () => ({
  id: 'home', name: 'Homestead',
  config: { faithProfile: { martial: { readiness01: 0.8, experience01: 0.3, footing: 0.6 } } },
});

describe('WarTab — believed units, staleness bands, and the DM-truth divergence (§805)', () => {
  const asWarOwner = (tier = 'premium') => useStore.__set({
    auth: { tier }, campaigns: [warCampaign()], savedSettlements: WAR_SAVES,
  });

  it('renders the believed unit position with its staleness band and source grade', () => {
    asWarOwner();
    render(<WarTab settlement={homeTown()} saveId="home" />);
    const units = screen.getByTestId('war-units');
    // The believed picture: the last credible word is 6 weeks old (courier cut),
    // so the town still believes the host near HOME while it truly nears Foehold.
    expect(units.textContent).toMatch(/Believed near Homestead/);
    expect(screen.getByTestId('war-unit-staleness').textContent).toMatch(/aging/);
    expect(units.textContent).toMatch(/Last credible word, 6 weeks old/);
    expect(units.textContent).toMatch(/courier line home is cut/);
  });

  it('DM truth shows the TRUE picture and renders the divergence explicitly', () => {
    asWarOwner();
    render(<WarTab settlement={homeTown()} saveId="home" />);
    const truth = screen.getByTestId('war-unit-truth');
    expect(truth.textContent).toMatch(/Where it truly stands:\s*Foehold/);
    // The gap IS the drama — rendered, never smoothed.
    expect(truth.textContent).toMatch(/believes the host near Homestead; in truth it stands at Foehold/);
  });

  it('renders muster & condition (the clerk roll, the army status, the town under arms)', () => {
    asWarOwner();
    render(<WarTab settlement={homeTown()} saveId="home" />);
    const muster = screen.getByTestId('war-muster');
    expect(muster.textContent).toMatch(/The town under arms/);
    // experience01 0.3 with a rust term ⇒ the drill has dulled.
    expect(muster.textContent).toMatch(/rusted|blooded/);
  });

  it('renders the named war with sides read from the war edges', () => {
    asWarOwner();
    render(<WarTab settlement={homeTown()} saveId="home" />);
    const wars = screen.getByTestId('war-wars');
    expect(wars.textContent).toMatch(/Against:.*Foehold/);
    expect(wars.textContent).toMatch(/attacking/i);
  });

  it('the DM belief band renders for the premium owner and NEVER for anon / playerView', () => {
    asWarOwner();
    const first = render(<WarTab settlement={homeTown()} saveId="home" />);
    expect(screen.getByTestId('war-beliefs').textContent).toMatch(/Foehold — believed slight, in the field/);
    first.unmount();

    // Fail-closed: an anon viewer keeps the believed unit picture (the player
    // half of §805) but no truth disclosure and no belief band.
    useStore.__set({ auth: { tier: 'anon' }, campaigns: [warCampaign()], savedSettlements: WAR_SAVES });
    const second = render(<WarTab settlement={homeTown()} saveId="home" />);
    expect(screen.getByTestId('war-units')).toBeTruthy();
    expect(screen.queryByTestId('war-beliefs')).toBeNull();
    expect(screen.queryByTestId('war-unit-truth')).toBeNull();
    second.unmount();

    // The player view suppresses the truth even for a premium viewer.
    asWarOwner();
    render(<WarTab settlement={homeTown()} saveId="home" playerView />);
    expect(screen.getByTestId('war-units')).toBeTruthy();
    expect(screen.queryByTestId('war-beliefs')).toBeNull();
    expect(screen.queryByTestId('war-unit-truth')).toBeNull();
  });

  it('a non-campaign settlement renders the honest absence note', () => {
    useStore.__set({ auth: { tier: 'premium' } });
    const { container } = render(<WarTab settlement={{ id: 'lone', name: 'Lonetop' }} saveId={null} />);
    expect(screen.getByTestId('war-tab')).toBeTruthy();
    expect(screen.queryByTestId('war-units')).toBeNull();
    expect(container.textContent).toMatch(/outside any live campaign/i);
  });
});

describe('SubstrateTab — surfaces OUR 16-variable causal read-model', () => {
  it('renders the substrate grid for a settlement', () => {
    const { container } = render(<SubstrateTab settlement={{ name: 'Testburg', config: { size: 'town' } }} />);
    expect(screen.getByTestId('substrate-tab')).toBeTruthy();
    // The read-model yields the 16 system variables as rows.
    const rows = [...container.querySelectorAll('[data-substrate-row]')];
    expect(rows.length).toBeGreaterThan(0);
    expect(screen.getByTestId('substrate-pressures')).toBeTruthy();
    expect(screen.getByText('What is holding, what is strained')).toBeTruthy();
    expect(screen.getByText('Settlement foundations')).toBeTruthy();
    expect(container.textContent).not.toMatch(/causal substrate|engine simulates|system|variable/i);
    for (const row of rows) {
      expect(row.textContent).not.toMatch(/\b(?:100|[1-9]?\d)\b/);
    }
  });
});

describe('MagicTab — 10-facet posture + magic-free dormancy', () => {
  it('renders the envelope facets + roles for a magical settlement', () => {
    const { container } = render(<MagicTab settlement={{ config: { magicLevel: 'moderate' } }} />);
    expect(screen.getByTestId('magic-tab')).toBeTruthy();
    expect(container.querySelectorAll('[data-facet]').length).toBe(6);
    expect(screen.getByTestId('magic-roles')).toBeTruthy();
  });

  it('is DORMANT for a magic-free world — honest, not fabricated (no facets)', () => {
    const { container } = render(<MagicTab settlement={{ config: { magicExists: false } }} />);
    expect(screen.getByTestId('magic-tab')).toBeTruthy();
    // Dormancy law: no fabricated envelope for a dead-magic world.
    expect(container.querySelectorAll('[data-facet]').length).toBe(0);
    expect(container.textContent).toMatch(/does not function/i);
  });

  it('surfaces the deity⇄magic-legality coupling when a MAJOR deity regulates', () => {
    const settlement = { config: { magicLevel: 'moderate', primaryDeitySnapshot: { name: 'Sunlord Aurelian', rankAxis: 'major' } } };
    render(<MagicTab settlement={settlement} />);
    expect(screen.getByTestId('magic-deity-coupling').textContent).toMatch(/magic legality/i);
  });
});
