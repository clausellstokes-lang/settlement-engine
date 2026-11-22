/**
 * settlementWorldChronicle.test.js — the settlement-Chronicle world-pulse seam
 * (owner bug 2026-07-22: "advanced a month and nothing showed there") + THE NEWS
 * ADDRESS LAW (owner doctrine 2026-07-22).
 *
 * The settlement Chronicle read the per-save campaignState.worldPulse.events /
 * worldState.eventLog paths — paths the advance NEVER writes (the campaign's events
 * live on campaign.worldState.pulseHistory). settlementWorldPulseEntries projects
 * that already-persisted history into per-settlement feed entries so advancing time
 * SHOWS what happened, and each world entry carries the four-part news address.
 *
 * Part A pins the fix over a REAL advance (advanceCampaignWorld → pulseHistory).
 * Part B pins the four address parts over a hand-authored record whose fields are
 * guaranteed (subject ids, cross-settlement relationshipKey, reasons).
 */

import { describe, expect, test } from 'vitest';

import { advanceCampaignWorld } from '../../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../../src/domain/region/index.js';
import { buildChronicleFeed } from '../../../src/domain/dossier/chronicleFeed.js';
import { settlementWorldPulseEntries } from '../../../src/domain/dossier/settlementWorldChronicle.js';

// Mirror of OutputContainer.collectChronicle's re-attach step: buildChronicleFeed
// keeps the byte-minimal common shape (first-paint-eager module), so the NEWS
// ADDRESS block rides back on by row id in the lazy dossier path.
function feedWithAddress(worldEntries, otherSources = {}, opts = { limit: 60 }) {
  const feed = buildChronicleFeed({ ...otherSources, worldPulse: worldEntries }, opts);
  const addressById = new Map(worldEntries.map(e => [e.id, e.address]));
  return feed.map(e => (e.source === 'world' && addressById.has(e.id)) ? { ...e, address: addressById.get(e.id) } : e);
}

const IDS = ['a', 'b', 'c'];

function save(id, i) {
  const name = `Town-${id.toUpperCase()}`;
  return {
    id, name, phase: 'canon',
    settlement: {
      name, tier: 'town', population: 1200 + i * 300,
      config: { tradeRouteAccess: 'road', priorityEconomy: 20, priorityMilitary: 30 },
      institutions: [], economicState: { primaryExports: [], primaryImports: [] },
      powerStructure: {
        publicLegitimacy: { score: 70, label: 'Approved' },
        factions: [{ faction: 'Merchant League', category: 'economy', power: 70 }],
        conflicts: [],
      },
      npcs: [{ id: `reeve_${id}`, name: `Reeve ${id}`, importance: 'key', faction: 'Merchant League' }],
      activeConditions: [],
    },
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
}

function baseCampaign() {
  return {
    id: 'chron', name: 'Chronicle Region', settlementIds: IDS,
    worldState: { rngSeed: 'chronicle-seed', tick: 0, stressors: [] },
    regionalGraph: ensureRegionalGraph({
      channels: [
        { type: 'trade_route', from: 'a', to: 'b', status: 'confirmed' },
        { type: 'trade_route', from: 'b', to: 'c', status: 'confirmed' },
      ],
    }),
    wizardNews: { currentTick: 0, entries: [] },
  };
}

/** Run N real one-month advances, threading worldState forward. */
function runRealAdvance(ticks) {
  let campaign = baseCampaign();
  let saves = IDS.map((id, i) => save(id, i));
  for (let i = 0; i < ticks; i++) {
    const result = advanceCampaignWorld({
      campaign, saves, interval: 'one_month',
      now: `2026-03-01T00:00:${String(i).padStart(2, '0')}.000Z`,
    });
    campaign = { ...campaign, worldState: result.worldState, regionalGraph: result.regionalGraph, wizardNews: result.wizardNews };
    saves = saves.map(s => {
      const u = result.settlementUpdates.find(x => String(x.saveId) === String(s.id));
      return u ? { ...s, settlement: u.settlement } : s;
    });
  }
  return { worldState: campaign.worldState, saves };
}

describe('settlementWorldPulseEntries — the world-pulse → settlement seam (real advance)', () => {
  const { worldState, saves } = runRealAdvance(12);

  test('a canonized world that advanced HAS pulseHistory (the durable substrate exists)', () => {
    expect(Array.isArray(worldState.pulseHistory)).toBe(true);
    expect(worldState.pulseHistory.length).toBeGreaterThan(0);
  });

  test('THE FIX: world-pulse events now reach the settlement Chronicle (was empty)', () => {
    // The bug: the reader used campaignState.worldPulse.events (never written), so
    // this stayed empty. Sourcing from campaign.worldState.pulseHistory populates it.
    const all = IDS.flatMap(id => settlementWorldPulseEntries(worldState, id, { savedSettlements: saves }));
    expect(all.length).toBeGreaterThan(0);

    // The OLD reader path is provably empty for a save the advance touched — a feed
    // built the old way (no projected entries) shows nothing for the world.
    const oldWay = buildChronicleFeed({
      manual: [], worldPulse: undefined, worldLog: undefined, recent: [],
    });
    expect(oldWay.filter(e => e.source === 'world')).toHaveLength(0);

    // The NEW feed (projected entries as the worldPulse source) surfaces world rows.
    const entriesForA = settlementWorldPulseEntries(worldState, 'a', { savedSettlements: saves });
    const newWay = buildChronicleFeed({ manual: [], worldPulse: entriesForA, recent: [] }, { limit: 60 });
    expect(newWay.some(e => e.source === 'world')).toBe(true);
  });

  test('per-settlement filter: entries are scoped to the settlement they touch', () => {
    for (const id of IDS) {
      const entries = settlementWorldPulseEntries(worldState, id, { savedSettlements: saves });
      // Every projected row must genuinely reference this settlement (containing
      // settlement, or an affected settlement resolved by name).
      for (const e of entries) {
        const touchesId = e.address.subject.settlementId === id;
        const touchesName = e.address.affectedSettlements.includes(`Town-${id.toUpperCase()}`);
        expect(touchesId || touchesName, `entry ${e.id} does not reference ${id}`).toBe(true);
      }
    }
  });

  test('DETERMINISTIC: the projection is a pure read (same worldState ⇒ same rows)', () => {
    const once = settlementWorldPulseEntries(worldState, 'a', { savedSettlements: saves });
    const twice = settlementWorldPulseEntries(worldState, 'a', { savedSettlements: saves });
    expect(once).toEqual(twice);
  });

  test('a fresh (never-advanced) world yields nothing (byte-identical off-state)', () => {
    expect(settlementWorldPulseEntries({ pulseHistory: [] }, 'a', { savedSettlements: saves })).toEqual([]);
    expect(settlementWorldPulseEntries(null, 'a')).toEqual([]);
    expect(settlementWorldPulseEntries(worldState, null)).toEqual([]);
  });
});

describe('THE NEWS ADDRESS LAW — the four parts on a world entry', () => {
  // A hand-authored pulseHistory record with guaranteed address fields: an npc-lane
  // outcome, a cross-settlement war (relationshipKey names BOTH), and an impact row.
  const worldState = {
    pulseHistory: [{
      id: 'world_pulse.chron.4', tick: 4, interval: 'one_month',
      createdAt: '2026-03-01T00:00:00.000Z',
      calendar: { elapsedWeeks: 16, month: 4, year: 1, season: 'summer' },
      selectedOutcomes: [
        {
          id: 'oc-goal', headline: "Twin Towers' Miraak turns to a new ambition",
          summary: 'The high priest sets his sights abroad.',
          targetSaveId: 'a', npcId: 'reeve_a', factionId: 'merchant_league',
          candidateType: 'npc_goal_change', severity: 0.4,
          reasons: ['legitimacy strain in the temple quarter'],
        },
        {
          id: 'oc-war', headline: 'Town-A declares war on Town-B',
          summary: '', targetSaveId: 'a', relationshipKey: 'a::b',
          candidateType: 'war_mobilization', severity: 0.8,
          reasons: ['a contested trade lane'],
        },
      ],
      impactDigest: [
        {
          id: 'im-1', headline: 'Grain prices climb across the region',
          summary: 'The blockade bites.', settlementIds: ['a', 'c'],
          impactKind: 'economic_pressure', severity: 0.5, score: 3,
          reasons: ['the war on the trade lane'],
        },
      ],
    }],
  };
  const saves = IDS.map((id, i) => save(id, i));

  test('(1) SUBJECT chain ids, (2) ACTION kind, (3) AFFECTED settlements by name, (4) REASON — all present', () => {
    const entries = settlementWorldPulseEntries(worldState, 'a', { savedSettlements: saves });
    const goal = entries.find(e => e.id.endsWith('oc-goal'));
    expect(goal).toBeTruthy();
    // (1) subject: settlement + npc + faction ids, settlement resolved to a name
    expect(goal.address.subject).toMatchObject({ settlementId: 'a', settlementName: 'Town-A', npcId: 'reeve_a', factionId: 'merchant_league' });
    // (2) action: the typed event kind
    expect(goal.address.eventKind).toBe('npc_goal_change');
    // (3) affected settlement(s) by name
    expect(goal.address.affectedSettlements).toEqual(['Town-A']);
    // (4) reason: the recorded cause
    expect(goal.address.reason).toBe('legitimacy strain in the temple quarter');
    // subject + action ride the verbatim headline (byte-verbatim, not re-authored)
    expect(goal.title).toBe("Twin Towers' Miraak turns to a new ambition");
  });

  test('cross-settlement: a war names BOTH settlements (relationshipKey endpoints)', () => {
    const forA = settlementWorldPulseEntries(worldState, 'a', { savedSettlements: saves });
    const forB = settlementWorldPulseEntries(worldState, 'b', { savedSettlements: saves });
    const warA = forA.find(e => e.id.endsWith('oc-war'));
    const warB = forB.find(e => e.id.endsWith('oc-war'));
    // The war surfaces in BOTH belligerents' chronicles, naming both by name.
    expect(warA).toBeTruthy();
    expect(warB).toBeTruthy();
    expect(warA.address.affectedSettlements).toEqual(['Town-A', 'Town-B']);
    expect(warA.address.reason).toBe('a contested trade lane');
  });

  test('impact rows filter by their explicit settlementIds and carry the address', () => {
    const forC = settlementWorldPulseEntries(worldState, 'c', { savedSettlements: saves });
    const imp = forC.find(e => e.id.endsWith('im-1'));
    expect(imp).toBeTruthy();
    expect(imp.address.affectedSettlements).toEqual(['Town-A', 'Town-C']);
    expect(imp.address.eventKind).toBe('economic_pressure');
    // Town-B is NOT in the impact's settlementIds ⇒ it does not appear in B's feed.
    const forB = settlementWorldPulseEntries(worldState, 'b', { savedSettlements: saves });
    expect(forB.some(e => e.id.endsWith('im-1'))).toBe(false);
  });

  test('the feed merges world entries as source "world" and the address rides back on', () => {
    const entries = settlementWorldPulseEntries(worldState, 'a', { savedSettlements: saves });
    // buildChronicleFeed alone keeps the byte-minimal shape (no address) — it is
    // first-paint-eager, so it is never widened.
    const bare = buildChronicleFeed({ manual: [], worldPulse: entries, recent: [] }, { limit: 60 });
    expect(bare.some(e => e.source === 'world')).toBe(true);
    expect(bare.every(e => e.address === undefined)).toBe(true);
    // The lazy dossier re-attach restores the address on world rows.
    const feed = feedWithAddress(entries, { manual: [], recent: [] });
    const world = feed.filter(e => e.source === 'world');
    expect(world.length).toBeGreaterThan(0);
    expect(world.every(e => e.address && typeof e.address === 'object')).toBe(true);
    // A manual entry never carries an address (the law targets world news).
    const manualFeed = feedWithAddress([], { manual: [{ id: 'm1', title: 'You renamed the reeve', appliedAt: '2026-03-02' }] });
    expect(manualFeed[0].address).toBeUndefined();
  });
});
