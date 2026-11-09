/** @vitest-environment jsdom */
/**
 * tierViewerRender.test.jsx — THE OWNER'S TIER LAW, RENDERED (lane TIER-PARITY-FIX, 2026-11-09).
 *
 * The owner, 2026-11-09, verbatim: "the only thing that is premium abd up is up is the ability to
 * edit post generation, access to the simulator, custom content, unlimited export, import from
 * gallery, access to the world map, and access to the surveyor. Everything else is at parity to
 * the free account."
 *
 * The census's twelve-town four-viewer render (docs/chair/2026-11-09/TIER-PARITY-CENSUS-2026-11-09.md
 * §0.4-0.5, the soak corpus's own births `scripts/audit/soak-review/corpus.mjs :: birth(0..11)`, the
 * tabs with the props `scripts/audit/soak-review/renderHarness.mjs` passes) kept as a test:
 *
 *   1. AT BIRTH, free ≡ premium on every dossier tab. The one difference allowed is the Faith
 *      upsell (`faith-upsell`), which sells the simulator and custom content to the account that
 *      does not hold them — selling, not withholding.
 *   2. THE FAITH TAB'S PRESENCE is the same for free and premium (V2): the engine-made faith line
 *      is generated data every owner holds.
 *   3. THE PLANTED TRUTH (V1): with a `campaign.worldState` the owner holds, the DM-truth lines
 *      print for the FREE owner as for the premium owner, and never on the player view or a public
 *      dossier. The gate is the VIEW and the DATA, never the tier.
 *
 * Viewers: free owner (tier 'free'), premium owner (tier 'premium'), the player (premium,
 * playerView), the public reader (premium, publicDossier).
 */
import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';

const mocks = vi.hoisted(() => ({ state: {} }));
vi.mock('../../src/store/index.js', () => {
  const useStore = (selector) => selector(mocks.state);
  useStore.getState = () => mocks.state;
  useStore.setState = (next) => Object.assign(mocks.state, typeof next === 'function' ? next(mocks.state) : next);
  return { useStore };
});
vi.mock('../../src/lib/supabase.js', () => ({ supabase: {}, isConfigured: false }));
vi.mock('../../src/generators/aiLayer', () => ({ runTemplateNarrative: vi.fn() }));

import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { TAB_IDS, htmlToText } from '../../scripts/audit/soak-review/renderHarness.mjs';
import { normalizeSettlement } from '../../src/domain/normalizeSettlement.js';

const TAB_MODULES = {
  overview: () => import('../../src/components/new/tabs/OverviewTab.jsx'),
  economics: () => import('../../src/components/new/tabs/EconomicsTab.jsx'),
  services: () => import('../../src/components/new/tabs/ServicesTab.jsx'),
  institutions: () => import('../../src/components/new/tabs/InstitutionsTab.jsx'),
  power: () => import('../../src/components/new/tabs/PowerTab.jsx'),
  defense: () => import('../../src/components/new/tabs/DefenseTab.jsx'),
  npcs: () => import('../../src/components/new/tabs/NPCsTab.jsx'),
  relationships: () => import('../../src/components/new/tabs/RelationshipsTab.jsx'),
  history: () => import('../../src/components/new/tabs/HistoryTab.jsx'),
  resources: () => import('../../src/components/new/tabs/ResourcesTab.jsx'),
  viability: () => import('../../src/components/new/tabs/ViabilityTab.jsx'),
  daily_life: () => import('../../src/components/new/tabs/DailyLifeTab.jsx'),
  magic: () => import('../../src/components/new/tabs/MagicTab.jsx'),
  faith: () => import('../../src/components/new/tabs/FaithTab.jsx'),
  war: () => import('../../src/components/new/tabs/WarTab.jsx'),
  rumors: () => import('../../src/components/new/tabs/RumorsTab.jsx'),
  traditions: () => import('../../src/components/new/tabs/TraditionsTab.jsx'),
  plot_hooks: () => import('../../src/components/new/tabs/PlotHooksTab.jsx'),
  dm_compass: () => import('../../src/components/new/tabs/DMCompassTab.jsx'),
  substrate: () => import('../../src/components/new/tabs/SubstrateTab.jsx'),
};

/** The harness's props (renderHarness.mjs :: renderSurfaces), the viewer's axis applied. */
function propsFor(id, s, view) {
  const P = { publicDossier: !!view.publicDossier, playerView: !!view.playerView, narrativeNote: null };
  switch (id) {
    case 'overview': return { settlement: s, ...P, onNavigateTab: () => {}, worldState: null };
    case 'economics': return { settlement: s, economicState: s.economicState, ...P };
    case 'services': return { services: s.availableServices, settlement: s, ...P };
    case 'institutions': return { settlement: s, canAuthor: false };
    case 'power': return { powerStructure: s.powerStructure, settlement: s, ...P, worldState: null };
    case 'npcs': return { npcs: s.npcs, settlement: s, ...P };
    case 'history': return { settlement: s, ...P, recentEvents: [] };
    case 'traditions': case 'dm_compass': case 'substrate': return { settlement: s };
    default: return { settlement: s, ...P };
  }
}

const VIEWERS = {
  free: { tier: 'free' },
  premium: { tier: 'premium' },
  player: { tier: 'premium', playerView: true },
  public: { tier: 'premium', publicDossier: true },
};

function setViewer(view, extra = {}) {
  for (const k of Object.keys(mocks.state)) delete mocks.state[k];
  Object.assign(mocks.state, {
    auth: { tier: view.tier, user: view.tier === 'anon' ? null : { id: 'u1' } },
    isElevated: () => false,
    setPurchaseModalOpen: () => {},
    setActivePricingMoment: () => {},
    campaigns: [],
    savedSettlements: [],
    userPrefs: {},
    editMode: false,
    applyUserEditAction: () => {},
    revertUserEditAction: () => {},
    ...extra,
  });
}

/** The upsell is the one free-only block allowed: it sells (2) and (3). */
function withoutUpsell(html) {
  return html.replace(/<div data-testid="faith-upsell"[\s\S]*?Awaken the pantheon →[\s\S]*?<\/button><\/div>/, '');
}

/** V2 (the Faith tab) is its own cause commit; its arms join there. */
const V2_PENDING = new Set(['faith']);

const TOWNS = [];
const MODS = {};
beforeAll(async () => {
  await ensureLaws();
  for (let i = 0; i < 12; i += 1) TOWNS.push(normalizeSettlement(birth(i).settlement));
  for (const id of TAB_IDS) MODS[id] = (await TAB_MODULES[id]()).default;
}, 240000);
afterEach(() => cleanup());

function renderTab(id, s, view) {
  setViewer(view);
  try { return renderToStaticMarkup(React.createElement(MODS[id], propsFor(id, s, view))); } catch (e) { return `ERROR ${String(e?.message ?? e)}`; }
}

describe('at birth, free ≡ premium on every dossier tab (the twelve soak towns)', () => {
  it('every tab prints byte-identical text for the free and the premium owner (the Faith upsell aside)', () => {
    const diffs = [];
    TOWNS.forEach((s, i) => {
      for (const id of TAB_IDS) {
        const free = htmlToText(withoutUpsell(renderTab(id, s, VIEWERS.free)));
        const premium = htmlToText(withoutUpsell(renderTab(id, s, VIEWERS.premium)));
        if (free !== premium && !V2_PENDING.has(id)) diffs.push(`town ${i} ${id}`);
      }
    });
    expect(diffs).toEqual([]);
  });

  it('non-vacuity: the twelve towns render a faith line on the Faith tab for both owners', () => {
    TOWNS.forEach((s) => {
      for (const v of [VIEWERS.free, VIEWERS.premium]) {
        const text = htmlToText(renderTab('faith', s, v));
        expect(text.length).toBeGreaterThan(40);
      }
    });
  });
});

// ── THE PLANTED TRUTH (V1) — the War tab's DM truth on a campaign the owner holds ──────────────
const WAR_SAVES = [
  { id: 'home', settlement: { name: 'Homestead' } },
  { id: 'mid', settlement: { name: 'Midford' } },
  { id: 'foe', settlement: { name: 'Foehold' } },
];
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

describe('the planted truth: DM truth keys on the view and the data, never the tier (V1)', () => {
  const warFor = (view) => {
    setViewer(view, { campaigns: [warCampaign()], savedSettlements: WAR_SAVES });
    return render(React.createElement(MODS.war, { settlement: homeTown(), saveId: 'home', playerView: !!view.playerView, publicDossier: !!view.publicDossier }));
  };

  it('the free owner reads the true position, the gap and the belief band, as the premium owner does', () => {
    for (const view of [VIEWERS.free, VIEWERS.premium]) {
      const r = warFor(view);
      expect(screen.getByTestId('war-unit-truth').textContent).toMatch(/Where it truly stands:\s*Foehold/);
      expect(screen.getByTestId('war-beliefs').textContent).toMatch(/Foehold: believed slight, in the field/);
      r.unmount();
    }
  });

  it('the player and the public reader keep the believed picture and never the truth', () => {
    for (const view of [VIEWERS.player, VIEWERS.public]) {
      const r = warFor(view);
      expect(screen.getByTestId('war-units')).toBeTruthy(); // anchored: the believed half rendered
      expect(screen.queryByTestId('war-unit-truth')).toBeNull();
      expect(screen.queryByTestId('war-beliefs')).toBeNull();
      r.unmount();
    }
  });

  it('a free owner with no world state is shown no truth (the data gate holds)', () => {
    setViewer(VIEWERS.free);
    const r = render(React.createElement(MODS.war, { settlement: homeTown(), saveId: 'home' }));
    expect(screen.getByTestId('war-tab') ?? r.container).toBeTruthy();
    expect(screen.queryByTestId('war-unit-truth')).toBeNull();
    expect(screen.queryByTestId('war-beliefs')).toBeNull();
  });
});
