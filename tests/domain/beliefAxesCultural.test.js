/**
 * beliefAxesCultural.test.js — D-1c (deep-couplings): THE CULTURAL FEEDER, end-to-end.
 *
 * A rededication reshapes a settlement's dominant observance. Today that mutates the tradition
 * record's patron SILENTLY (below the rumor floor) — no rival can even in principle learn of it.
 * D-1c emits a `tradition_change` beat scored ABOVE the floor (gated on beliefAxesEnabled) so the
 * change enters the rumor net; a court that HEARS it adopts the new rite, and — until it hears —
 * keeps believing the OLD one (the staleness feature; DESIGN_DEEP_COUPLINGS §5 feeder B).
 *
 * Driven through the whole pulse kernel. Ashford (a deity-bearing city) flips its patron mid-run;
 * a connected court (b) hears the beat and adopts, LAGGING the truth by the courier's weeks.
 */
import { describe, expect, it } from 'vitest';
import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import { observanceFromTraditions } from '../../src/domain/worldPulse/beliefAxes.js';

const IDS = ['a', 'b', 'c'];
function spatialDigest() {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  const placements = placeSettlements(pack, IDS.length).map((p, i) => ({ id: IDS[i], cellId: p.cellId }));
  return buildSpatialDigest({ pack, placements });
}
const rel = (id, from, to) => ({ id, from, to, relationshipType: 'allied' });
const chan = (id, from, to) => ({ id, type: 'trade_route', from, to, status: 'confirmed' });
function faithCity(deityRef) {
  return {
    _seed: 's:a', name: 'Ashford', tier: 'city', population: 9000,
    config: { tradeRouteAccess: 'road', economicBase: 'trade', culture: 'lowland', terrainType: 'plains', primaryDeitySnapshot: { name: 'The Ember', _deityRef: deityRef, alignmentAxis: 'good', lawAxis: 'lawful' } },
    institutions: [{ name: 'Town hall', required: true, category: 'civic', status: 'active' }, { name: 'Grand temple', category: 'faith', status: 'active' }],
    economicState: { prosperity: 'Comfortable', primaryExports: [], incomeSources: ['Trade tariffs'] },
    powerStructure: { publicLegitimacy: { score: 55, label: 'Accepted' }, factions: [{ name: 'Temple', isGoverning: true, power: 60 }], conflicts: [] },
    calamityHistory: [], npcs: [], activeConditions: [],
  };
}
const plain = (name, seed) => ({ _seed: seed, name, tier: 'town', population: 1400, config: { economicBase: 'agrarian', terrainType: 'hills', culture: 'upland' }, institutions: [{ name: 'Market', category: 'trade' }], economicState: { prosperity: 'Comfortable' }, powerStructure: { publicLegitimacy: { score: 50 }, factions: [], conflicts: [] }, activeConditions: [], npcs: [] });
const save = (id, name, st) => ({ id, name, phase: 'canon', settlement: st, campaignState: { phase: 'canon', eventLog: [], locks: {} } });

const FLIP_TICK = 12;
/** Drive the run; return { changeBeatIds, changeBeatScores, timeline: [{t, truth, bBelief}] }. */
function drive({ axes, connected }) {
  const graph = ensureRegionalGraph({
    edges: [rel('e.ab', 'a', 'b'), rel('e.ac', 'a', 'c')],
    channels: connected ? [chan('ch.ab', 'a', 'b')] : [],
  });
  let campaign = {
    id: 'cult', name: 'cult', settlementIds: [...IDS],
    worldState: {
      rngSeed: 'cult', tick: 1,
      simulationRules: { warLayerEnabled: false, traditionsEnabled: true, propagationMode: 'first_order', infoMode: 'unreliable', ...(axes ? { beliefAxesEnabled: true } : {}) },
      calendar: { elapsedWeeks: 0, year: 1 }, spatialCanonVersion: 1, spatialDigest: spatialDigest(), stressors: [],
    },
    regionalGraph: graph, wizardNews: { currentTick: 1, entries: [] },
  };
  let saves = [save('a', 'Ashford', faithCity('deity.old')), save('b', 'Briarwatch', plain('Briarwatch', 's:b')), save('c', 'Crownhold', plain('Crownhold', 's:c'))];
  const changeBeatIds = new Set();
  const changeBeatScores = new Set();
  const timeline = [];
  for (let t = 0; t < 20; t += 1) {
    // From the flip on, HOLD Ashford's patron at deity.new every tick (the faith recompute would
    // otherwise revert the snapshot, un-doing the rededication). Re-forcing the same value is
    // idempotent: once the rite is re-dedicated in the ledger, no further mutation fires.
    if (t >= FLIP_TICK) {
      saves = saves.map((s) => (s.id === 'a'
        ? { ...s, settlement: { ...s.settlement, config: { ...s.settlement.config, primaryDeitySnapshot: { ...s.settlement.config.primaryDeitySnapshot, _deityRef: 'deity.new' } } } }
        : s));
    }
    const r = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_week', now: '2026-01-01T00:00:00.000Z' });
    for (const e of (r.wizardNews?.entries || [])) {
      if (e.impactKind === 'tradition_change') { changeBeatIds.add(String(e.id)); changeBeatScores.add(Number(e.score)); }
    }
    const u = new Map((r.settlementUpdates || []).map((x) => [String(x.saveId), x.settlement]));
    saves = saves.map((s) => (u.has(s.id) ? { ...s, settlement: u.get(s.id) } : s));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph, wizardNews: r.wizardNews };
    const truth = observanceFromTraditions(campaign.worldState?.spatialLedgers?.traditions?.a);
    const bBelief = campaign.worldState?.spatialLedgers?.beliefMaps?.b?.seat?.a?.observanceLabel;
    timeline.push({ t, truth, bBelief });
  }
  return { changeBeatIds, changeBeatScores, timeline };
}

describe('D-1c — the cultural feeder (a rededication becomes rumor-visible)', () => {
  it('a rededication emits an EVENT-DRIVEN tradition_change beat, ABOVE the rumor floor (no per-tick spam)', () => {
    const { changeBeatIds, changeBeatScores } = drive({ axes: true, connected: true });
    // The mutation becomes rumor-visible: at least one beat fires. It is EVENT-driven — a handful
    // of real rededications over the run, never a per-tick spam (the 8 post-flip ticks would each
    // beat if it were unguarded; the code-level "one beat per mutation" invariant is unit-covered).
    expect(changeBeatIds.size).toBeGreaterThanOrEqual(1);
    expect(changeBeatIds.size, 'event-driven, not per-tick (well under the post-flip tick count)').toBeLessThanOrEqual(4);
    for (const score of changeBeatScores) expect(score, 'clears the rumor notable floor (60)').toBeGreaterThanOrEqual(60);
  }, 30_000);

  it('GATED on beliefAxesEnabled: a lit-traditions world without the axes stays SILENT', () => {
    const { changeBeatIds } = drive({ axes: false, connected: true });
    expect(changeBeatIds.size, 'no tradition_change beat when the axes are dark (news volume unchanged)').toBe(0);
  }, 30_000);

  it('STALENESS: a connected court believes the OLD rite until the beat lands, then adopts the NEW', () => {
    const { timeline } = drive({ axes: true, connected: true });
    const flip = timeline.find((r) => r.t === FLIP_TICK);
    const truthOld = timeline.find((r) => r.t === FLIP_TICK - 1)?.truth;
    const truthNew = flip?.truth;
    expect(truthOld && truthNew && truthOld !== truthNew, 'the rededication changed the ground truth').toBe(true);
    // The belief LAGS the truth: at (or just after) the flip, b still believes the OLD rite.
    const stale = timeline.find((r) => r.t >= FLIP_TICK && r.bBelief === truthOld && r.truth === truthNew);
    expect(stale, 'b still believed the OLD rite after the rededication (fog-of-war lag)').toBeTruthy();
    // ...and once the beat reaches it, b ADOPTS the new rite.
    const adopted = timeline.find((r) => r.t > (stale?.t ?? FLIP_TICK) && r.bBelief === truthNew);
    expect(adopted, 'b eventually adopted the NEW rite (the beat arrived)').toBeTruthy();
  }, 30_000);
});
