/** @vitest-environment jsdom */
/**
 * tests/ui/heraldRegisterDoors.test.jsx — the Herald's two REGISTER doors
 * (owner directive 5, judgment J-D5, wave W-C).
 *
 * Pins what the doors promise:
 *   1. PRESENCE — both doors are real Herald tabs, always present (never a
 *      disabled stub), and both reach their body through the chrome.
 *   2. THE PARTITION — one roster, two halves. Every settlement the campaign
 *      counts lands in exactly one register; a remnant or a recorded destruction
 *      leaves the living roster and appears among the fallen.
 *   3. LEGIBILITY — the living row's state is a sentence in world words, and the
 *      empty states are in-world prose (a young realm has buried no one).
 *   4. THE RECEIPTS — a fallen row carries the pointers the record already holds
 *      (the chronicle entry, the engine's ruling, the cause the GM typed).
 *   5. THE SECRETS SEAM — without a proven owner session the receipt half is
 *      NEVER BUILT, while the fallen themselves still read (a ruin is a
 *      landmark, not a secret).
 */

import { describe, test, expect, afterEach, beforeEach, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

afterEach(cleanup);

// ── Store mock (a single mutable object behind every selector) ───────────────
const storeState = {
  savedSettlements: [],
  auth: { user: { id: 'owner-1' } },
  setActivePricingMoment: vi.fn(),
  setSelectedSettlementId: vi.fn(),
  clearSelectedSettlementId: vi.fn(),
  focusEntity: vi.fn(),
  canUseCustomContent: () => false,
  selectedSettlementId: null,
};

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.getState = () => storeState;
  useStore.subscribe = () => () => {};
  return { useStore };
});

import HeraldGazetteer from '../../src/components/map/HeraldGazetteer.jsx';
import HeraldRemembrance from '../../src/components/map/HeraldRemembrance.jsx';
import RealmInspector, { REALM_INSPECTOR_SECTIONS } from '../../src/components/map/RealmInspector.jsx';
import { gazetteerRows, remembranceRows } from '../../src/components/map/heraldRegister.js';

// ── Fixtures: one living town, one engine remnant, one recorded destruction ──
const ASHFORD = {
  id: 'ashford',
  name: 'Ashford',
  settlement: {
    id: 'ashford',
    name: 'Ashford',
    tier: 'town',
    population: 1200,
    economicState: { prosperity: 'Prosperous' },
    config: { tier: 'town', monsterThreat: 'plagued' },
  },
};

const OLD_KEEP = {
  id: 'oldkeep',
  name: 'Old Keep',
  settlement: {
    id: 'oldkeep',
    name: 'Old Keep',
    tier: 'thorp',
    population: 0,
    lifecycleStatus: 'relic_ruin',
    config: { tier: 'thorp', peakTier: 'city', lifecycleStatus: 'relic_ruin', lifecycleDiedAtTick: 5 },
    lifecycleHistory: [
      { event: 'terminal_death', grade: 'relic_ruin', tick: 5, outcomeId: 'lifecycle.death.oldkeep.5' },
    ],
    history: {
      historicalEvents: [
        {
          campaignEventId: 'campaign.lifecycle_death.oldkeep.5',
          campaignEra: true,
          name: 'The Fall of Old Keep',
          description: 'Old Keep, once a great city, dwindled to a final thorp and died.',
        },
      ],
    },
  },
};

const BROOKHOLLOW = {
  id: 'brookhollow',
  name: 'Brookhollow',
  settlement: {
    id: 'brookhollow',
    name: 'Brookhollow',
    tier: 'village',
    population: 500,
    status: 'destroyed',
    destroyedCause: 'swallowed by the marsh',
    economicState: { prosperity: 'Moderate' },
  },
  campaignState: {
    eventLog: [
      { type: 'DESTROY_SETTLEMENT', narrativeSummary: 'Brookhollow was destroyed: swallowed by the marsh.' },
    ],
  },
};

const SAVES = [ASHFORD, OLD_KEEP, BROOKHOLLOW];
const CAMPAIGN = {
  id: 'camp-register',
  settlementIds: ['ashford', 'oldkeep', 'brookhollow'],
  worldState: { tick: 7 },
};

beforeEach(() => {
  storeState.savedSettlements = SAVES;
  storeState.auth = { user: { id: 'owner-1' } };
});

describe('the register doors are real Herald tabs', () => {
  test('both doors are registered, in reading order, after the report doors', () => {
    const ids = REALM_INSPECTOR_SECTIONS.map(s => s.id);
    expect(ids).toContain('gazetteer');
    expect(ids).toContain('remembrance');
    expect(ids.indexOf('gazetteer')).toBeGreaterThan(ids.indexOf('adjudication'));
    const labels = REALM_INSPECTOR_SECTIONS.map(s => s.label);
    expect(labels).toContain('Gazetteer');
    expect(labels).toContain('Ruins & Remembrance');
  });

  test('the chrome offers both doors as enabled tabs and opens the register body', async () => {
    render(
      <RealmInspector
        open
        section="remembrance"
        onSection={() => {}}
        onClose={() => {}}
        campaign={CAMPAIGN}
        canManageCampaigns
        tier="premium"
        inspectorSize="default"
        onSetSize={() => {}}
      />,
    );
    const gazetteerTab = screen.getByRole('button', { name: 'Gazetteer' });
    const ruinsTab = screen.getByRole('button', { name: 'Ruins & Remembrance' });
    // PRESENCE gating, never a disabled stub.
    expect(gazetteerTab.hasAttribute('disabled')).toBe(false);
    expect(ruinsTab.hasAttribute('disabled')).toBe(false);
    expect(ruinsTab.getAttribute('aria-pressed')).toBe('true');
    // The lazy door resolves behind the Herald's own Suspense boundary.
    expect(await screen.findByTestId('herald-remembrance')).toBeTruthy();
  });
});

describe('THE GAZETTEER — the living roster', () => {
  test('a young realm with no settlements reads as in-world prose, not a broken panel', () => {
    render(<HeraldGazetteer campaign={{ id: 'c0', settlementIds: [], worldState: {} }} saves={[]} />);
    expect(screen.getByText(/Place one on the map and it enters the register/)).toBeTruthy();
  });

  test('a living settlement reads as name, tier, and a sentence — no raw numbers', () => {
    render(<HeraldGazetteer campaign={CAMPAIGN} saves={SAVES} />);
    expect(screen.getByRole('button', { name: 'Go to Ashford' })).toBeTruthy();
    expect(screen.getByText('town')).toBeTruthy();
    expect(screen.getByText('A prosperous town, at peace.')).toBeTruthy();
    // LEGIBILITY: the population that produced the tier word never reaches the page.
    const body = screen.getByTestId('herald-gazetteer').textContent;
    // anchored: the SAME textContent is asserted to carry 'Ashford' below, so an emptied render cannot pass this.
    expect(body).not.toMatch(/1200|1,200/);
    expect(body).toContain('Ashford');
  });

  test('the fallen leave the living roster (the partition, upper half)', () => {
    render(<HeraldGazetteer campaign={CAMPAIGN} saves={SAVES} />);
    expect(screen.getAllByTestId('gazetteer-row')).toHaveLength(1);
    const names = screen.getAllByTestId('gazetteer-row').map(n => n.textContent);
    // anchored: the living sibling Ashford is asserted present in the SAME joined roster below.
    expect(names.join(' ')).not.toMatch(/Old Keep|Brookhollow/);
    expect(names.join(' ')).toContain('Ashford');
  });
});

describe('RUINS & REMEMBRANCE — the graveyard', () => {
  test('a realm that has lost nothing says so in world words', () => {
    render(<HeraldRemembrance campaign={{ id: 'c0', settlementIds: ['ashford'], worldState: {} }} saves={[ASHFORD]} />);
    expect(screen.getByText(/No ruins yet\. This realm is young/)).toBeTruthy();
  });

  test('an engine remnant carries its grade, its chronicle epitaph, and when it fell', () => {
    render(<HeraldRemembrance campaign={CAMPAIGN} saves={SAVES} />);
    expect(screen.getByRole('button', { name: 'Go to Old Keep' })).toBeTruthy();
    expect(screen.getByText('Relic ruin')).toBeTruthy();
    // The epitaph is the chronicle the terminal-death writer left, not invented prose.
    expect(screen.getByText('Old Keep, once a great city, dwindled to a final thorp and died.')).toBeTruthy();
    // The age of the fall is BANDED into turnings; the tick never reaches the page.
    expect(screen.getByText('Fell a few turnings back.')).toBeTruthy();
    // The receipts the provenance already carries.
    expect(screen.getByText('The Fall of Old Keep')).toBeTruthy();
    expect(screen.getByText('lifecycle.death.oldkeep.5')).toBeTruthy();
  });

  test('a library row with the Destroyed rubric joins the same roll, with its cause', () => {
    render(<HeraldRemembrance campaign={CAMPAIGN} saves={SAVES} />);
    expect(screen.getAllByTestId('remembrance-row')).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Go to Brookhollow' })).toBeTruthy();
    expect(screen.getByText('Destroyed')).toBeTruthy();
    expect(screen.getByText('swallowed by the marsh')).toBeTruthy();
    expect(screen.getByText('Brookhollow was destroyed: swallowed by the marsh.')).toBeTruthy();
  });

  test('THE SECRETS SEAM — an unproven session gets the fallen but never the receipts', () => {
    storeState.auth = null; // anonymous / shared / unproven: fail closed
    render(<HeraldRemembrance campaign={CAMPAIGN} saves={SAVES} />);
    // The fallen themselves still read — a ruin is a landmark, not a secret.
    expect(screen.getAllByTestId('remembrance-row')).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Go to Old Keep' })).toBeTruthy();
    expect(screen.getAllByText(/record of the cause is sealed/).length).toBe(2);
    const body = screen.getByTestId('herald-remembrance').textContent;
    // anchored: the SAME textContent is asserted to still carry 'Old Keep' below, proving the roll rendered.
    expect(body).not.toMatch(/swallowed by the marsh|lifecycle\.death\.oldkeep/);
    expect(body).toContain('Old Keep');
  });

  test('the DM threat read is likewise never built for an unproven session', () => {
    render(<HeraldGazetteer campaign={CAMPAIGN} saves={SAVES} />);
    expect(screen.getByText('Plagued')).toBeTruthy(); // owner session: built
    cleanup();
    storeState.auth = null;
    render(<HeraldGazetteer campaign={CAMPAIGN} saves={SAVES} />);
    const body = screen.getByTestId('herald-gazetteer').textContent;
    // anchored: the row itself is asserted present on the line below.
    expect(body).not.toMatch(/Plagued/);
    expect(body).toContain('A prosperous town, at peace.');
  });
});

describe('the register partition — one roster, two halves', () => {
  test('every counted settlement lands in exactly one register', () => {
    const living = gazetteerRows({ campaign: CAMPAIGN, saves: SAVES, seesSecrets: true }).map(r => r.id);
    const fallen = remembranceRows({ campaign: CAMPAIGN, saves: SAVES, seesSecrets: true }).map(r => r.id);
    expect([...living, ...fallen].sort()).toEqual([...CAMPAIGN.settlementIds].sort());
    expect(living.filter(id => fallen.includes(id))).toEqual([]);
  });

  test('a save that is BOTH a remnant and a recorded destruction is counted once, remnant-first', () => {
    const both = {
      ...OLD_KEEP,
      settlement: { ...OLD_KEEP.settlement, status: 'destroyed', destroyedCause: 'fire' },
    };
    const rows = remembranceRows({
      campaign: { ...CAMPAIGN, settlementIds: ['oldkeep'] },
      saves: [both],
      seesSecrets: true,
    });
    expect(rows).toHaveLength(1);
    expect(rows[0].kind).toBe('remnant');
    expect(rows[0].gradeLabel).toBe('Relic ruin');
  });

  test('a settlement outside the campaign roster is in neither register', () => {
    const stranger = { id: 'elsewhere', name: 'Elsewhere', settlement: { id: 'elsewhere', name: 'Elsewhere', tier: 'hamlet' } };
    const living = gazetteerRows({ campaign: CAMPAIGN, saves: [...SAVES, stranger], seesSecrets: true }).map(r => r.name);
    // anchored: the in-roster sibling Ashford is asserted present in the SAME collection below.
    expect(living).not.toContain('Elsewhere');
    expect(living).toContain('Ashford');
  });
});
