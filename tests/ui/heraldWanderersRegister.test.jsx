/** @vitest-environment jsdom */
/**
 * tests/ui/heraldWanderersRegister.test.jsx — THE WANDERERS register and its local
 * twin, the dossier's Unaffiliates section (W-H4, design §6c/§8).
 *
 * Pins what these two surfaces promise:
 *   1. PRESENCE GATING — the Wanderers door is ABSENT when the consequence economy is
 *      dark and present when it is lit, and it is never a disabled stub (the ai_notes
 *      presence lesson). Anchored on a sibling door that is always there, so the
 *      absence cannot pass because the whole tab list drifted away.
 *   2. ONE TRUTH, TWO VIEWS — the world register and a settlement's unaffiliates come
 *      out of the SAME projection; the local view is the world view filtered, never a
 *      second read model with its own opinion.
 *   3. THE LEGIBILITY LAW — every row is sentences in world words. No band token, no
 *      verdict token, no durable id and no tick number reaches the page.
 *   4. AUDIENCE PROJECTION (law 7) — a player reading carries no covert line and no DM
 *      verbs; the owner reading carries both.
 *   5. EMPTY STATES ARE IN-WORLD PROSE — a realm that has exiled nobody says so.
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

afterEach(cleanup);

// ── Store mock (one mutable object behind every selector) ────────────────────
const storeState = {
  savedSettlements: [],
  campaigns: [],
  auth: { user: { id: 'owner-1' }, tier: 'premium' },
  isElevated: () => false,
  setActivePricingMoment: vi.fn(),
  setSelectedSettlementId: vi.fn(),
  clearSelectedSettlementId: vi.fn(),
  focusEntity: vi.fn(),
  canUseCustomContent: () => false,
  selectedSettlementId: null,
  assignNpc: vi.fn(),
  killNpc: vi.fn(),
  pardonNpc: vi.fn(),
  undoLastNpcVerb: vi.fn(),
  npcVerbUndoStack: [],
};

/** One session undo-ring entry, shaped as npcVerbsBody.commitVerbResult writes it. */
const RING_ENTRY = (campaignId, verb = 'kill') => ({
  campaignId,
  undo: { verb, wnpcId: 'wnpc_x', rulingId: 'r1' },
  settlementId: '',
  priorSettlement: null,
});

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.getState = () => storeState;
  useStore.subscribe = () => () => {};
  return { useStore };
});

import HeraldWanderers from '../../src/components/map/HeraldWanderers.jsx';
import UnaffiliatesSection from '../../src/components/new/tabs/UnaffiliatesSection.jsx';
import { realmInspectorSectionsFor, REALM_INSPECTOR_SECTIONS } from '../../src/components/map/RealmInspector.jsx';
import { wandererRows, unaffiliateRows, wanderersDoorOpen } from '../../src/components/map/heraldWanderers.js';
import { graduateNpc, addExclusionEdge } from '../../src/domain/worldPulse/npcLedger.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const SAVES = [
  { id: 'sav_kelder', name: 'Kelder', settlement: { id: 'sav_kelder', name: 'Kelder' } },
  { id: 'sav_thorn', name: 'Thornreach', settlement: { id: 'sav_thorn', name: 'Thornreach' } },
];

/** A campaign whose ledger holds one banished harbourmaster resting at Thornreach. */
function campaignWithWanderer({ lit = true, resting = 'sav_thorn' } = {}) {
  let worldState = { simulationRules: lit ? { npcConsequencesEnabled: true } : {}, tick: 20 };
  const g = graduateNpc({
    worldState,
    settlementSeed: 'seed-kelder',
    settlementId: 'sav_kelder',
    rosterIdentity: { rosterId: 'npc_3', name: 'Maera Voss', role: 'harbourmaster' },
    tick: 4,
    verdictCause: 'banished',
    reputation: {
      notorietyBand: 'notorious',
      edictMark: 'banishment_edict',
      scandalClass: 'venality',
      competenceRead: 'formidable',
    },
    dmTruth: { compromiseSource: 'rival_power' },
  });
  worldState = g.worldState;
  if (g.wnpcId) {
    worldState = addExclusionEdge(worldState, g.wnpcId, {
      settlementId: 'sav_kelder', kind: 'banishment_edict', untilTick: 60,
    }).worldState;
    if (resting) {
      const ledger = JSON.parse(JSON.stringify(worldState.spatialLedgers.npcLedger));
      ledger.roamers[g.wnpcId].residency = { settlementId: resting, sinceTick: 6, untilTick: 40 };
      worldState = { ...worldState, spatialLedgers: { ...worldState.spatialLedgers, npcLedger: ledger } };
    }
  }
  return {
    campaign: { id: 'camp-1', settlementIds: ['sav_kelder', 'sav_thorn'], worldState },
    wnpcId: g.wnpcId,
  };
}

describe('W-H4 — tab presence gating (absent when dark, never disabled)', () => {
  test('the Wanderers door appears only for a realm that runs the consequence economy', () => {
    const lit = realmInspectorSectionsFor(campaignWithWanderer().campaign).map(s => s.id);
    const dark = realmInspectorSectionsFor(campaignWithWanderer({ lit: false }).campaign).map(s => s.id);
    const noCampaign = realmInspectorSectionsFor(null).map(s => s.id);

    expect(lit).toContain('wanderers');
    // ANCHORED: gazetteer is an always-present sibling, so an empty/renamed tab list
    // cannot make the absence below pass vacuously.
    expectAbsentWithAnchor(dark, 'wanderers', 'gazetteer', 'a dark realm');
    expectAbsentWithAnchor(noCampaign, 'wanderers', 'gazetteer', 'no campaign at all');
    // The base list is untouched, so no existing door changed shape.
    expect(REALM_INSPECTOR_SECTIONS.map(s => s.id)).toEqual(dark);
  });

  test('the read model agrees with the tab gate (one gate, not two)', () => {
    expect(wanderersDoorOpen(campaignWithWanderer().campaign)).toBe(true);
    expect(wanderersDoorOpen(campaignWithWanderer({ lit: false }).campaign)).toBe(false);
    expect(wandererRows({ campaign: campaignWithWanderer({ lit: false }).campaign, saves: SAVES }).total).toBe(0);
  });
});

describe('W-H4 — the register reads as prose, never as engine tokens', () => {
  test('a row is sentences: no band, no verdict token, no durable id, no tick', () => {
    const { campaign, wnpcId } = campaignWithWanderer();
    const rows = wandererRows({ campaign, saves: SAVES, seesSecrets: true });
    expect(rows.roaming).toHaveLength(1);
    const row = rows.roaming[0];
    expect(row.name).toBe('Maera Voss');
    expect(row.title).toBe('former harbourmaster');
    expect(row.whyLine).toBe('They were put out by an edict.');
    expect(row.notorietyLine).toBe('Their name carries badly wherever it is spoken.');
    expect(row.whenLine).toBe('On the road longer than most care to count.');
    expect(row.doorsLine).toBe('Kelder will not have them back.');
    expect(row.originName).toBe('Kelder');
    expect(row.restingName).toBe('Thornreach');

    // Everything a reader could SEE, joined: no raw vocabulary token may appear.
    const prose = [
      row.name, row.title, row.whyLine, row.notorietyLine, row.whenLine,
      row.doorsLine, row.originName, row.restingName, row.dmLine, ...row.standingLines,
    ].join(' ');
    for (const token of ['notorious', 'banished', 'banishment_edict', 'venality', 'formidable', wnpcId, 'sav_']) {
      expect(prose.includes(token), `the register printed the raw token "${token}"`).toBe(false);
    }
    // LIVENESS ANCHOR for that negative sweep: the prose is not empty.
    expect(prose.length).toBeGreaterThan(80);
  });

  test('the covert read is built for a DM and NEVER built for a player', () => {
    const { campaign } = campaignWithWanderer();
    const dm = wandererRows({ campaign, saves: SAVES, seesSecrets: true }).roaming[0];
    const player = wandererRows({ campaign, saves: SAVES, seesSecrets: false }).roaming[0];
    // ANCHOR: the DM reading of the SAME fixture does carry the line.
    expect(dm.dmLine).toBe('Your notes: a rival power held their leash.');
    expect(player.dmLine).toBe('');
    expect(JSON.stringify(player).includes('rival_power')).toBe(false);
  });
});

describe('W-H4 — one truth, two views', () => {
  test('the local view is the world view filtered to where they are resting', () => {
    const { campaign } = campaignWithWanderer({ resting: 'sav_thorn' });
    const world = wandererRows({ campaign, saves: SAVES });
    const here = unaffiliateRows({ campaign, settlementId: 'sav_thorn', saves: SAVES });
    const elsewhere = unaffiliateRows({ campaign, settlementId: 'sav_kelder', saves: SAVES });
    expect(world.total).toBe(1);
    expect(here.total).toBe(1);
    expect(elsewhere.total).toBe(0);
    // Same person, same sentences: the local view is a filter, not a second model.
    expect(here.roaming[0]).toEqual(world.roaming[0]);
  });

  test('a roamer with no lodging yet still reads locally at the place they came from', () => {
    const { campaign } = campaignWithWanderer({ resting: null });
    expect(unaffiliateRows({ campaign, settlementId: 'sav_kelder', saves: SAVES }).total).toBe(1);
  });
});

describe('W-H4 — the Herald door renders', () => {
  test('an owner session sees the register and the verbs', () => {
    const { campaign } = campaignWithWanderer();
    storeState.savedSettlements = SAVES;
    render(<HeraldWanderers campaign={campaign} saves={SAVES} />);
    expect(screen.getByTestId('herald-wanderers')).toBeTruthy();
    expect(screen.getAllByTestId('wanderer-row')).toHaveLength(1);
    expect(screen.getByText('Maera Voss')).toBeTruthy();
    expect(screen.getByTestId('wanderer-verbs')).toBeTruthy();
    expect(screen.getByTestId('wanderer-dm-line')).toBeTruthy();
  });

  test('an unproven session gets the register with NO verbs and NO covert line', () => {
    const { campaign } = campaignWithWanderer();
    const priorAuth = storeState.auth;
    storeState.auth = { user: null, tier: 'free' };
    render(<HeraldWanderers campaign={campaign} saves={SAVES} />);
    expect(screen.getAllByTestId('wanderer-row')).toHaveLength(1);
    expect(screen.queryByTestId('wanderer-verbs')).toBeNull();
    expect(screen.queryByTestId('wanderer-dm-line')).toBeNull();
    storeState.auth = priorAuth;
  });

  test('EMPTY STATE: a realm that has exiled nobody says so, in world words', () => {
    const empty = { id: 'camp-2', settlementIds: ['sav_kelder'], worldState: { simulationRules: { npcConsequencesEnabled: true }, tick: 3 } };
    render(<HeraldWanderers campaign={empty} saves={SAVES} />);
    expect(screen.getByText(/Nobody wanders this realm/)).toBeTruthy();
    expect(screen.queryByTestId('wanderer-row')).toBeNull();
  });
});

describe('W-H4 — the dossier unaffiliates section', () => {
  test('it renders the local half for a live realm', () => {
    const { campaign } = campaignWithWanderer();
    storeState.campaigns = [campaign];
    storeState.savedSettlements = SAVES;
    render(<UnaffiliatesSection saveId="sav_thorn" />);
    expect(screen.getByTestId('dossier-unaffiliates')).toBeTruthy();
    expect(screen.getAllByTestId('unaffiliate-row')).toHaveLength(1);
    expect(screen.getByText(/Without a place here/)).toBeTruthy();
  });

  test('it renders NOTHING AT ALL when the realm does not run the lane', () => {
    const { campaign } = campaignWithWanderer({ lit: false });
    storeState.campaigns = [campaign];
    const { container } = render(<UnaffiliatesSection saveId="sav_thorn" />);
    expect(container.innerHTML).toBe('');
  });

  test('a live realm with nobody sheltering here reads as prose, not a blank', () => {
    const { campaign } = campaignWithWanderer({ resting: 'sav_thorn' });
    storeState.campaigns = [campaign];
    render(<UnaffiliatesSection saveId="sav_kelder" />);
    expect(screen.getByText(/Nobody is sheltering here/)).toBeTruthy();
    expect(screen.queryByTestId('unaffiliate-row')).toBeNull();
  });

  test('a player dossier carries no covert line', () => {
    const { campaign } = campaignWithWanderer();
    storeState.campaigns = [campaign];
    render(<UnaffiliatesSection saveId="sav_thorn" playerView />);
    expect(screen.getAllByTestId('unaffiliate-row')).toHaveLength(1);
    expect(screen.queryByTestId('unaffiliate-dm-line')).toBeNull();
  });
});

describe('W-H4 — the advertised undo is REACHABLE (the dead-op wiring half)', () => {
  // The registry advertises `undoLastNpcVerb` as the recovery verb of all three rulings
  // (operationRegistry: undoToken:'undoLastNpcVerb', undoState:'action'). These pin that
  // the promise is true in the PRODUCT and not only in the store: a door exists, it is
  // campaign-scoped, it is DM-only, and pressing it dispatches the op.
  afterEach(() => { storeState.npcVerbUndoStack = []; });

  test('nothing to walk back ⇒ NO door (presence, never a greyed promise)', () => {
    const { campaign } = campaignWithWanderer();
    storeState.savedSettlements = SAVES;
    storeState.npcVerbUndoStack = [];
    render(<HeraldWanderers campaign={campaign} saves={SAVES} />);
    // ANCHORED on the verbs: the owner reading IS rendering its DM controls, so the
    // absence below is the ring being empty rather than the whole surface being dark.
    expect(screen.getByTestId('wanderer-verbs')).toBeTruthy();
    expect(screen.queryByTestId('wanderer-undo')).toBeNull();
  });

  test('a ruling on THIS campaign opens the door; one on another realm does not', () => {
    const { campaign } = campaignWithWanderer();
    storeState.savedSettlements = SAVES;
    storeState.npcVerbUndoStack = [RING_ENTRY('camp-1')];
    const mine = render(<HeraldWanderers campaign={campaign} saves={SAVES} />);
    expect(screen.getByTestId('wanderer-undo')).toBeTruthy();
    expect(screen.getByText('One ruling of yours can still be walked back.')).toBeTruthy();
    mine.unmount();

    // A DM running two realms in one session: the other realm's ring is not this door's.
    storeState.npcVerbUndoStack = [RING_ENTRY('camp-OTHER')];
    render(<HeraldWanderers campaign={campaign} saves={SAVES} />);
    expect(screen.getByTestId('wanderer-verbs')).toBeTruthy();
    expect(screen.queryByTestId('wanderer-undo')).toBeNull();
  });

  test('pressing it dispatches the op for THIS campaign and says what came back', async () => {
    const { campaign } = campaignWithWanderer();
    const priorUndo = storeState.undoLastNpcVerb;
    storeState.undoLastNpcVerb = vi.fn(async () => ({ ok: true, verb: 'kill', refusal: null }));
    storeState.savedSettlements = SAVES;
    storeState.npcVerbUndoStack = [RING_ENTRY('camp-1')];
    render(<HeraldWanderers campaign={campaign} saves={SAVES} />);
    fireEvent.click(screen.getByText('Undo the last ruling'));
    expect(await screen.findByTestId('wanderer-undo-note')).toBeTruthy();
    expect(screen.getByText(/struck from the roll of the dead/)).toBeTruthy();
    expect(storeState.undoLastNpcVerb).toHaveBeenCalledWith('camp-1');
    storeState.undoLastNpcVerb = priorUndo;
  });

  test('an unproven session never gets the door (DM authority, not an affordance)', () => {
    const { campaign } = campaignWithWanderer();
    const priorAuth = storeState.auth;
    storeState.auth = { user: null, tier: 'free' };
    storeState.npcVerbUndoStack = [RING_ENTRY('camp-1')];
    render(<HeraldWanderers campaign={campaign} saves={SAVES} />);
    // ANCHORED: the register itself still renders for this reader.
    expect(screen.getAllByTestId('wanderer-row')).toHaveLength(1);
    expect(screen.queryByTestId('wanderer-undo')).toBeNull();
    storeState.auth = priorAuth;
  });

  test('the dossier twin carries the same door (one recovery, two mounts)', () => {
    const { campaign } = campaignWithWanderer();
    storeState.campaigns = [campaign];
    storeState.savedSettlements = SAVES;
    storeState.npcVerbUndoStack = [RING_ENTRY('camp-1', 'pardon')];
    render(<UnaffiliatesSection saveId="sav_thorn" />);
    expect(screen.getByTestId('wanderer-undo')).toBeTruthy();
    // …and never on a player dossier, the same audience rule the verbs follow.
    cleanup();
    render(<UnaffiliatesSection saveId="sav_thorn" playerView />);
    expect(screen.getAllByTestId('unaffiliate-row')).toHaveLength(1);
    expect(screen.queryByTestId('wanderer-undo')).toBeNull();
  });
});
