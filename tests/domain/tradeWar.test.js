import { describe, expect, test } from 'vitest';

import { previewCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { evaluateTradeWar } from '../../src/domain/worldPulse/tradeWar.js';
import { supplyCompleteness } from '../../src/domain/worldPulse/supplyCompleteness.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { deriveSettlementPressures, pressureIndex } from '../../src/domain/worldPulse/pressureModel.js';
import { buildPressureSummary } from '../../src/domain/worldPulse/relationshipEvolution.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { createPRNG } from '../../src/generators/prng.js';

// The rebellion gate (relationshipEvolution.js vassalRules): vassal_rebellion is
// reachable once vassalStrain > 0.55. vassalStrain = mean(legitimacy, trade,
// conflict pressures, resentment).
const VASSAL_REBELLION_STRAIN_GATE = 0.55;
function vassalStrainAfterPulse(pulse, vassalId, relKey) {
  const upd = pulse.settlementUpdates.map(u => ({
    id: u.saveId, name: u.settlement.name, phase: 'canon', settlement: u.settlement, campaignState: { phase: 'canon' },
  }));
  const snap = buildWorldSnapshot({ campaign: { settlementIds: upd.map(s => s.id), worldState: pulse.worldState }, saves: upd, worldState: pulse.worldState });
  const vp = buildPressureSummary(pressureIndex(deriveSettlementPressures(snap)), vassalId);
  const rs = pulse.worldState.relationshipStates[relKey] || {};
  return (vp.legitimacy + vp.trade + vp.conflict + (rs.resentment || 0)) / 4;
}

// ─────────────────────────────────────────────────────────────────────────────
// Feature B (trade war) — A2 test gates.
//
// Determinism contract under test: the trade war shares
// simulationRules.warLayerEnabled (default false ⇒ pure no-op ⇒ byte-identical),
// the contest forks on the F3 frozen recipe (contest:<type>:<prize>:<tick>), the
// escalation decision forks on a stable per-prize key, every output iteration is
// codepoint-sorted (buyers, commodities, contenders), and the per-prize flip
// cooldown ledger (worldState.tradeWarState) is empty/byte-neutral when OFF.
// ─────────────────────────────────────────────────────────────────────────────

const NOW = '2026-01-01T00:00:00.000Z';

function settlement(name, patch = {}) {
  return {
    name,
    tier: patch.tier || 'town',
    population: patch.population || 4000,
    config: { tradeRouteAccess: 'road', priorityEconomy: 30, priorityMilitary: 25 },
    institutions: patch.institutions || [],
    economicState: {
      prosperity: patch.prosperity || 'Prosperous',
      primaryExports: patch.exports || [],
      primaryImports: patch.imports || [],
      ...(patch.activeChains ? { activeChains: patch.activeChains } : {}),
    },
    powerStructure: {
      publicLegitimacy: { score: patch.legitimacy ?? 60, label: 'Stable' },
      factions: patch.factions || [{ faction: 'Council', category: 'civic', power: 60, isGoverning: true }],
      conflicts: [],
    },
    npcs: [],
    activeConditions: patch.activeConditions || [],
  };
}

function save(id, name, patch = {}) {
  return {
    id,
    name,
    phase: 'canon',
    settlement: settlement(name, patch),
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
}

function tradeCampaign(rulesPatch = {}, { settlementIds, edges = [], channels = [], relationshipStates = {}, extraState = {} } = {}) {
  return {
    id: 'trade-fixture',
    name: 'Trade Fixture',
    settlementIds,
    worldState: {
      rngSeed: 'trade-seed',
      tick: 4,
      relationshipStates,
      simulationRules: { warLayerEnabled: true, ...rulesPatch },
      ...extraState,
    },
    regionalGraph: ensureRegionalGraph({ edges, channels }),
    wizardNews: { currentTick: 4, entries: [] },
  };
}

function snapshotFor(campaign, saves) {
  return buildWorldSnapshot({ campaign, saves, worldState: campaign.worldState });
}

function tradeChannel(from, to, strength, goodId = 'grain', goodLabel = 'Grain') {
  return { type: 'trade_dependency', from, to, status: 'confirmed', strength, goods: [{ id: goodId, label: goodLabel }] };
}

// A buyer C importing grain, a weak incumbent A and a strong challenger B both
// exporting grain into C — the asymmetric setup where B clearly displaces A.
function grainContestFixture({ incumbentStrong = false } = {}) {
  const saves = [
    save('buyer', 'Ctown', { imports: ['Grain'] }),
    save('inc', 'Aville', incumbentStrong
      ? { exports: ['Grain'], tier: 'city', population: 60000, legitimacy: 80 }
      : { exports: ['Grain'], tier: 'village', population: 300, legitimacy: 30 }),
    save('chal', 'Bburg', { exports: ['Grain'], tier: 'city', population: 60000, legitimacy: 80 }),
  ];
  const channels = [tradeChannel('inc', 'buyer', 0.6), tradeChannel('chal', 'buyer', 0.5)];
  const edges = [
    { id: 'edge.inc.buyer', from: 'inc', to: 'buyer', relationshipType: 'trade_partner' },
    { id: 'edge.chal.buyer', from: 'chal', to: 'buyer', relationshipType: 'trade_partner' },
  ];
  return { saves, channels, edges, settlementIds: ['buyer', 'inc', 'chal'] };
}

describe('supplyCompleteness — 0..1 producer readiness', () => {
  test('a non-producer scores 0; a healthy producer scores high', () => {
    const saves = [
      save('mill', 'Millbrook', { exports: ['Grain'] }),
      save('mine', 'Oremount', { exports: ['Iron Ore'] }),
    ];
    const campaign = tradeCampaign({}, { settlementIds: ['mill', 'mine'] });
    const snap = snapshotFor(campaign, saves);
    // Millbrook exports grain → non-zero; Oremount does not → 0.
    expect(supplyCompleteness(snap, 'mill', 'Grain')).toBeGreaterThan(0.5);
    expect(supplyCompleteness(snap, 'mine', 'Grain')).toBe(0);
    // An unknown supplier id is 0 (defensive).
    expect(supplyCompleteness(snap, 'ghost', 'Grain')).toBe(0);
  });
});

describe('trade war — OFF byte-identity', () => {
  test('warLayerEnabled:false leaves a representative pulse byte-identical + order-independent', () => {
    const { saves, channels, edges, settlementIds } = grainContestFixture();
    const offA = tradeCampaign({ warLayerEnabled: false }, { settlementIds, edges, channels });
    const offB = tradeCampaign({ warLayerEnabled: false }, { settlementIds, edges, channels });

    const a = previewCampaignWorldPulse({ campaign: offA, saves, interval: 'one_month', now: NOW });
    const b = previewCampaignWorldPulse({ campaign: offB, saves: [...saves].reverse(), interval: 'one_month', now: NOW });

    // No realignment outcomes, no trade-realignment channel mints, empty ledger.
    expect(a.selected.some(o => ['trade_realignment', 'vassal_trade_coercion'].includes(o.candidateType))).toBe(false);
    expect(a.worldState.tradeWarState).toEqual({});

    // The OFF pulse is order-independent (the legacy invariant is untouched).
    const ids = r => r.selected.map(o => o.id).sort();
    expect(ids(b)).toEqual(ids(a));
    const bySave = r => new Map(r.settlementUpdates.map(u => [String(u.saveId), u.settlement]));
    for (const id of settlementIds) {
      expect(bySave(b).get(id)).toEqual(bySave(a).get(id));
    }
  });

  test('the trade war is gated: ON vs OFF differ (anti-vacuity — the flag does something)', () => {
    const { saves, channels, edges, settlementIds } = grainContestFixture();
    const off = previewCampaignWorldPulse({ campaign: tradeCampaign({ warLayerEnabled: false }, { settlementIds, edges, channels }), saves, interval: 'one_month', now: NOW });
    const on = previewCampaignWorldPulse({ campaign: tradeCampaign({ warLayerEnabled: true }, { settlementIds, edges, channels }), saves, interval: 'one_month', now: NOW });

    expect(off.worldState.tradeWarState).toEqual({});
    // ON: the contest ran and recorded the prize crown in the ledger.
    expect(Object.keys(on.worldState.tradeWarState).length).toBeGreaterThan(0);
  });
});

describe('trade war — per-commodity order-independence', () => {
  test('reversing the saves/edges/channels arrays yields identical contest winners per (C,K)', () => {
    const { saves, channels, edges, settlementIds } = grainContestFixture();

    const run = (orderedSaves, orderedEdges, orderedChannels) => {
      const campaign = tradeCampaign({}, { settlementIds, edges: orderedEdges, channels: orderedChannels });
      const snap = snapshotFor(campaign, orderedSaves);
      const tw = evaluateTradeWar({ snapshot: snap, worldState: snap.worldState, rng: createPRNG('order'), tick: 7, now: NOW, rules: { warLayerEnabled: true } });
      return {
        ledger: tw.tradeWarState,
        outcomes: tw.outcomes.map(o => `${o.candidateType}@${o.targetSaveId}`).sort(),
        channels: tw.graphChannels.map(c => `${c.from}->${c.to}:${c.type}`).sort(),
      };
    };

    const forward = run(saves, edges, channels);
    const reversed = run([...saves].reverse(), [...edges].reverse(), [...channels].reverse());

    expect(reversed.ledger).toEqual(forward.ledger);
    expect(reversed.outcomes).toEqual(forward.outcomes);
    expect(reversed.channels).toEqual(forward.channels);
    // Anti-vacuity: the contest actually produced a winner per prize.
    expect(Object.keys(forward.ledger).length).toBeGreaterThan(0);
  });

  test('two commodities contest independently (per-commodity crown)', () => {
    const saves = [
      save('buyer', 'Ctown', { imports: ['Grain', 'Iron Ore'] }),
      save('grainA', 'GrainvilleA', { exports: ['Grain'], tier: 'town' }),
      save('grainB', 'GrainvilleB', { exports: ['Grain'], tier: 'city', population: 50000 }),
      save('oreA', 'OremountA', { exports: ['Iron Ore'], tier: 'town' }),
      save('oreB', 'OremountB', { exports: ['Iron Ore'], tier: 'city', population: 50000 }),
    ];
    const channels = [
      tradeChannel('grainA', 'buyer', 0.6, 'grain', 'Grain'),
      tradeChannel('grainB', 'buyer', 0.5, 'grain', 'Grain'),
      tradeChannel('oreA', 'buyer', 0.6, 'iron', 'Iron Ore'),
      tradeChannel('oreB', 'buyer', 0.5, 'iron', 'Iron Ore'),
    ];
    const edges = ['grainA', 'grainB', 'oreA', 'oreB'].map(id => ({ id: `edge.${id}.buyer`, from: id, to: 'buyer', relationshipType: 'trade_partner' }));
    const campaign = tradeCampaign({}, { settlementIds: ['buyer', 'grainA', 'grainB', 'oreA', 'oreB'], edges, channels });
    const snap = snapshotFor(campaign, saves);
    const tw = evaluateTradeWar({ snapshot: snap, worldState: snap.worldState, rng: createPRNG('two-commodity'), tick: 9, now: NOW, rules: { warLayerEnabled: true } });

    // Two distinct prizes keyed by (buyer, commodity) — independent crowns.
    expect(tw.tradeWarState['buyer:grain']).toBeDefined();
    expect(tw.tradeWarState['buyer:iron']).toBeDefined();
    expect(tw.tradeWarState['buyer:grain'].winnerId).toMatch(/grain/);
    expect(tw.tradeWarState['buyer:iron'].winnerId).toMatch(/ore/);
  });

  test('the prize ledger persists the REAL buyer + commodity ids (not just the slugged key)', () => {
    // The public realm-share resolves trade-war display names from these persisted
    // ids; without them a public reader can only un-slug the prizeId key, which
    // renders names as slugs. Assert the real ids are stored on every prize entry.
    const { saves, channels, edges, settlementIds } = grainContestFixture();
    const campaign = tradeCampaign({}, { settlementIds, edges, channels });
    const snap = snapshotFor(campaign, saves);
    const tw = evaluateTradeWar({ snapshot: snap, worldState: snap.worldState, rng: createPRNG('persist-ids'), tick: 7, now: NOW, rules: { warLayerEnabled: true } });

    const entries = Object.values(tw.tradeWarState);
    expect(entries.length).toBeGreaterThan(0);
    for (const entry of entries) {
      expect(entry.buyerId).toBe('buyer');
      expect(entry.commodityId).toBe('grain');
    }
  });
});

describe('trade war — anti-oscillation cooldown soak', () => {
  test('under stable near-tied inputs the prize does NOT flip every tick (bounded flip rate)', () => {
    // Two near-identical contenders: same tier/pop, both export grain. Without
    // the cooldown + the primitive's hysteresis this thrashes A↔B every tick.
    const saves = [
      save('buyer', 'Ctown', { imports: ['Grain'] }),
      save('aaa', 'Aville', { exports: ['Grain'], tier: 'town', population: 4000 }),
      save('bbb', 'Bburg', { exports: ['Grain'], tier: 'town', population: 4000 }),
    ];
    const channels = [tradeChannel('aaa', 'buyer', 0.55), tradeChannel('bbb', 'buyer', 0.5)];
    const edges = [
      { id: 'edge.aaa.buyer', from: 'aaa', to: 'buyer', relationshipType: 'trade_partner' },
      { id: 'edge.bbb.buyer', from: 'bbb', to: 'buyer', relationshipType: 'trade_partner' },
    ];
    const campaign = tradeCampaign({}, { settlementIds: ['buyer', 'aaa', 'bbb'], edges, channels });
    const snap = snapshotFor(campaign, saves);

    // Thread the cooldown ledger across ticks (as the real pulse does). The
    // snapshot stays fixed — the worst case for oscillation (the derived
    // incumbent can't follow the winner), so the cooldown alone must hold it.
    let tradeWarState = {};
    let flips = 0;
    const TICKS = 100;
    for (let tick = 4; tick < 4 + TICKS; tick += 1) {
      const ws = { ...snap.worldState, tradeWarState };
      const tw = evaluateTradeWar({ snapshot: snap, worldState: ws, rng: createPRNG('soak-fixed'), tick, now: NOW, rules: { warLayerEnabled: true } });
      tradeWarState = tw.tradeWarState;
      if (tw.outcomes.some(o => o.candidateType === 'trade_realignment')) flips += 1;
    }
    // Bounded: with a 6-tick cooldown + hysteresis, far fewer than one flip/tick.
    // (Empirically ~12; assert a generous ceiling so it can never thrash.)
    expect(flips).toBeLessThan(TICKS / 4);
    // Anti-vacuity: SOME contest activity happened (the prize was held/contested).
    expect(Object.keys(tradeWarState).length).toBeGreaterThan(0);
  });
});

describe('trade war — vassal hard-bias + escape valve', () => {
  test('an overlord forces its vassal C\'s primary partner regardless of the roll, AND raises vassal economic strain', () => {
    // C is a vassal of the WEAK overlord 'lord'. A strong unaligned challenger
    // 'rich' would win the contest on merit — but the overlord compels the
    // trade, so the overlord's designate (lord itself) wins regardless.
    const saves = [
      save('vassalC', 'Vassalton', { imports: ['Grain'] }),
      save('lord', 'Overlordia', { exports: ['Grain'], tier: 'village', population: 400, legitimacy: 35 }),
      save('rich', 'Richford', { exports: ['Grain'], tier: 'city', population: 80000, legitimacy: 85 }),
    ];
    const channels = [tradeChannel('lord', 'vassalC', 0.5), tradeChannel('rich', 'vassalC', 0.6)];
    const edges = [
      { id: 'edge.lord.vassalC', from: 'lord', to: 'vassalC', relationshipType: 'vassal' },
      { id: 'edge.rich.vassalC', from: 'rich', to: 'vassalC', relationshipType: 'trade_partner' },
    ];
    const relationshipStates = { 'edge.lord.vassalC': { relationshipType: 'vassal', overlordSaveId: 'lord' } };
    const campaign = tradeCampaign({}, { settlementIds: ['vassalC', 'lord', 'rich'], edges, channels, relationshipStates });
    const snap = snapshotFor(campaign, saves);
    const tw = evaluateTradeWar({ snapshot: snap, worldState: snap.worldState, rng: createPRNG('vassal'), tick: 12, now: NOW, rules: { warLayerEnabled: true } });

    // The forced winner is the overlord, NOT the stronger 'rich' challenger.
    // (The prize key is keyed on the buyer SAVE ID 'vassalC' → 'vassalc'.)
    expect(tw.tradeWarState['vassalc:grain'].winnerId).toBe('lord');
    // The coercion is routed through the vassal's economy — a strain condition.
    const coercion = tw.outcomes.find(o => o.candidateType === 'vassal_trade_coercion');
    expect(coercion).toBeDefined();
    expect(coercion.targetSaveId).toBe('vassalC');
    expect(coercion.condition.severity).toBeGreaterThan(0);
  });

  test('sustained forced coercion raises vassal strain past the rebellion gate (escape valve stays reachable; not a silent trap)', () => {
    // Full pulse: an overlord repeatedly compelling a fragile vassal's trade.
    // The vassal_trade_coercion strain (routed through trade pressure, the SAME
    // lever vassal_extraction uses) must lift vassalStrain ABOVE the rebellion
    // gate AND above a no-coercion baseline — so vassal_rebellion is reachable
    // and the coercion is demonstrably the cause (not a one-way ruin lock).
    const saves = [
      save('vassalC', 'Vassalton', { imports: ['Grain'], tier: 'village', population: 350, legitimacy: 28,
        factions: [{ faction: 'Village Elders', category: 'civic', power: 30, isGoverning: true }] }),
      save('lord', 'Overlordia', { exports: ['Grain'], tier: 'town', population: 5000, legitimacy: 45 }),
      save('rich', 'Richford', { exports: ['Grain'], tier: 'city', population: 80000, legitimacy: 85 }),
    ];
    const channels = [tradeChannel('lord', 'vassalC', 0.5), tradeChannel('rich', 'vassalC', 0.6)];
    const edges = [
      { id: 'edge.lord.vassalC', from: 'lord', to: 'vassalC', relationshipType: 'vassal' },
      { id: 'edge.rich.vassalC', from: 'rich', to: 'vassalC', relationshipType: 'trade_partner' },
    ];
    const relKey = 'edge.lord.vassalC';
    const baseRelStates = () => ({ [relKey]: { relationshipType: 'vassal', overlordSaveId: 'lord', resentment: 0.4 } });

    const runMaxStrain = (warLayerEnabled) => {
      let worldState = { rngSeed: 'vassal-escape', tick: 4, relationshipStates: baseRelStates(), simulationRules: { warLayerEnabled } };
      let maxStrain = 0;
      let coercionFired = false;
      for (let i = 0; i < 16; i += 1) {
        const campaign = {
          id: 'vassal-escape', name: 'Vassal Escape', settlementIds: ['vassalC', 'lord', 'rich'],
          worldState, regionalGraph: ensureRegionalGraph({ edges, channels }),
          wizardNews: { currentTick: worldState.tick, entries: [] },
        };
        const pulse = previewCampaignWorldPulse({ campaign, saves, interval: 'one_month', now: NOW });
        const allOut = [...(pulse.selected || []), ...(pulse.proposals || [])];
        if (allOut.some(o => o.candidateType === 'vassal_trade_coercion')) coercionFired = true;
        maxStrain = Math.max(maxStrain, vassalStrainAfterPulse(pulse, 'vassalC', relKey));
        worldState = pulse.worldState;
      }
      return { maxStrain, coercionFired };
    };

    const on = runMaxStrain(true);
    const off = runMaxStrain(false);

    // The forced trade actually fired, and it pushed strain past the rebellion gate.
    expect(on.coercionFired).toBe(true);
    expect(off.coercionFired).toBe(false);
    expect(on.maxStrain).toBeGreaterThan(VASSAL_REBELLION_STRAIN_GATE);
    // And the coercion is the CAUSE — ON strain exceeds the no-coercion baseline.
    expect(on.maxStrain).toBeGreaterThan(off.maxStrain);
  });
});

describe('trade war — escalation reachable (conquest path stays open)', () => {
  test('a defeated CONFIDENT incumbent can escalate to a war_front', () => {
    // A strong incumbent that LOSES the crown (to an even stronger challenger)
    // can answer the lost trade war with the sword — a war_front the A1 layer
    // picks up next tick. Soak over forks until the confidence-gated roll fires.
    const { saves } = grainContestFixture({ incumbentStrong: true });
    // Make the challenger strictly stronger so the incumbent (strong, confident)
    // can lose AND clear the escalation confidence gate.
    saves[2] = save('chal', 'Bburg', { exports: ['Grain'], tier: 'metropolis', population: 200000, legitimacy: 90 });
    const channels = [tradeChannel('inc', 'buyer', 0.55), tradeChannel('chal', 'buyer', 0.6)];
    const edges = [
      { id: 'edge.inc.buyer', from: 'inc', to: 'buyer', relationshipType: 'trade_partner' },
      { id: 'edge.chal.buyer', from: 'chal', to: 'buyer', relationshipType: 'trade_partner' },
    ];

    let escalated = false;
    for (let tick = 4; tick < 80 && !escalated; tick += 1) {
      const campaign = tradeCampaign({}, { settlementIds: ['buyer', 'inc', 'chal'], edges, channels });
      const snap = snapshotFor(campaign, saves);
      const tw = evaluateTradeWar({ snapshot: snap, worldState: snap.worldState, rng: createPRNG(`escal-${tick}`), tick, now: NOW, rules: { warLayerEnabled: true } });
      if (tw.graphChannels.some(c => c.type === 'war_front')) escalated = true;
    }
    expect(escalated).toBe(true);
  });

  test('a defeated WEAK incumbent winds down peacefully (no war_front), not a forced escalation', () => {
    const { saves, channels, edges, settlementIds } = grainContestFixture(); // weak incumbent
    let woundDown = false;
    for (let tick = 4; tick < 40 && !woundDown; tick += 1) {
      const campaign = tradeCampaign({}, { settlementIds, edges, channels });
      const snap = snapshotFor(campaign, saves);
      const tw = evaluateTradeWar({ snapshot: snap, worldState: snap.worldState, rng: createPRNG(`wind-${tick}`), tick, now: NOW, rules: { warLayerEnabled: true } });
      const flipped = tw.outcomes.some(o => o.candidateType === 'trade_realignment');
      const escalated = tw.graphChannels.some(c => c.type === 'war_front');
      if (flipped && !escalated && tw.outcomes.some(o => o.candidateType === 'market_shock')) woundDown = true;
    }
    expect(woundDown).toBe(true);
  });
});
