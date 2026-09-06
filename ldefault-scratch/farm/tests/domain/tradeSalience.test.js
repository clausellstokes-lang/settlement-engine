/**
 * tests/domain/tradeSalience.test.js — Phase B4 strategic-trade-value model.
 *
 * Pins the pure tradeSalience.js model + its B0-compatibility enforcement:
 *   - a food-insecure buyer's grain tie is HIGH salience; a redundant/secure tie is LOW;
 *   - a militarizing buyer's iron tie is HIGH;
 *   - a sole supplier (hard-to-replace) outscores one with alternatives;
 *   - the salience FACTOR is exactly 1.0 below the valuable gate (byte-neutral),
 *     < 1.0 above it, and a critical tie earns extra dampening;
 *   - deriveSecondaryStatuses ENFORCES B0: a hostile primary cannot carry normal
 *     commerce (downgraded to covert smuggling), a rival CAN trade;
 *   - the maps are order-independent.
 */

import { describe, expect, test } from 'vitest';

import {
  commodityTradeSalience,
  pairTradeSalience,
  tradeSalienceFactor,
  computeTradeSalienceMap,
  deriveSecondaryStatuses,
  computeSecondaryStatusOverlay,
  TRADE_SALIENCE_TUNING,
} from '../../src/domain/worldPulse/tradeSalience.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

const T = TRADE_SALIENCE_TUNING;

function settlement(name, patch = {}) {
  return {
    name,
    tier: patch.tier || 'town',
    population: patch.population || 4000,
    config: { tradeRouteAccess: 'road', priorityEconomy: 30, priorityMilitary: 25, ...(patch.config || {}) },
    institutions: patch.institutions || [],
    economicState: {
      prosperity: 'Prosperous',
      primaryExports: patch.exports || [],
      primaryImports: patch.imports || [],
      ...(patch.foodSecurity ? { foodSecurity: patch.foodSecurity } : {}),
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
  return { id, name, phase: 'canon', settlement: settlement(name, patch), campaignState: { phase: 'canon', eventLog: [], locks: {} } };
}

function tradeChannel(from, to, strength, goodId = 'grain', goodLabel = 'Grain') {
  return { type: 'trade_dependency', from, to, status: 'confirmed', strength, goods: [{ id: goodId, label: goodLabel }] };
}

function snapshotFor({ settlementIds, edges = [], channels = [], relationshipStates = {} }, saves) {
  const campaign = {
    id: 'salience-fixture',
    settlementIds,
    worldState: { rngSeed: 's', tick: 5, relationshipStates },
    regionalGraph: ensureRegionalGraph({ edges, channels }),
  };
  return buildWorldSnapshot({ campaign, saves, worldState: campaign.worldState });
}

describe('commodityTradeSalience — the supply-chain gap drives value', () => {
  test('a food-insecure buyer\'s grain tie is HIGHER salience than a food-secure buyer\'s', () => {
    const insecure = snapshotFor({
      settlementIds: ['hungry', 'farm'],
      channels: [tradeChannel('farm', 'hungry', 0.7)],
    }, [
      save('hungry', 'Hungerton', { imports: ['Grain'], foodSecurity: { resilienceScore: 12, storageMonths: 0 } }),
      save('farm', 'Farmstead', { exports: ['Grain'] }),
    ]);
    const secure = snapshotFor({
      settlementIds: ['fed', 'farm'],
      channels: [tradeChannel('farm', 'fed', 0.7)],
    }, [
      save('fed', 'Fedhaven', { imports: ['Grain'], foodSecurity: { resilienceScore: 95, storageMonths: 6 }, exports: ['Grain'] }),
      save('farm', 'Farmstead', { exports: ['Grain'] }),
    ]);

    const hungryTie = commodityTradeSalience(insecure, insecure.worldState, 'hungry', 'farm', 'Grain', { tick: 5 });
    const fedTie = commodityTradeSalience(secure, secure.worldState, 'fed', 'farm', 'Grain', { tick: 5 });

    expect(hungryTie).not.toBeNull();
    expect(fedTie).not.toBeNull();
    expect(hungryTie.salience).toBeGreaterThan(fedTie.salience);
    expect(hungryTie.need).toBeGreaterThan(fedTie.need);
  });

  test('a militarizing buyer\'s iron tie registers HIGH need', () => {
    const snap = snapshotFor({
      settlementIds: ['fort', 'mine'],
      channels: [tradeChannel('mine', 'fort', 0.7, 'iron', 'Iron Ore')],
    }, [
      save('fort', 'Fortward', { imports: ['Iron Ore'], config: { government: 'Martial junta' } }),
      save('mine', 'Oremount', { exports: ['Iron Ore'] }),
    ]);
    const tie = commodityTradeSalience(snap, snap.worldState, 'fort', 'mine', 'Iron Ore', { tick: 5 });
    expect(tie).not.toBeNull();
    expect(tie.need).toBeGreaterThan(0.4);
  });

  test('a sole supplier is harder to replace than one with alternatives', () => {
    const sole = snapshotFor({
      settlementIds: ['buyer', 'only'],
      channels: [tradeChannel('only', 'buyer', 0.6)],
    }, [
      save('buyer', 'Buytown', { imports: ['Grain'] }),
      save('only', 'OnlyFarm', { exports: ['Grain'] }),
    ]);
    const many = snapshotFor({
      settlementIds: ['buyer', 'f1', 'f2', 'f3'],
      channels: [tradeChannel('f1', 'buyer', 0.6), tradeChannel('f2', 'buyer', 0.6), tradeChannel('f3', 'buyer', 0.6)],
    }, [
      save('buyer', 'Buytown', { imports: ['Grain'] }),
      save('f1', 'Farm1', { exports: ['Grain'] }),
      save('f2', 'Farm2', { exports: ['Grain'] }),
      save('f3', 'Farm3', { exports: ['Grain'] }),
    ]);
    const soleTie = commodityTradeSalience(sole, sole.worldState, 'buyer', 'only', 'Grain', { tick: 5 });
    const manyTie = commodityTradeSalience(many, many.worldState, 'buyer', 'f1', 'Grain', { tick: 5 });
    expect(soleTie.replace).toBeGreaterThan(manyTie.replace);
    expect(soleTie.salience).toBeGreaterThan(manyTie.salience);
  });

  test('no confirmed carrier ⇒ null (no tie)', () => {
    const snap = snapshotFor({ settlementIds: ['buyer', 'farm'], channels: [] }, [
      save('buyer', 'Buytown', { imports: ['Grain'] }),
      save('farm', 'Farmstead', { exports: ['Grain'] }),
    ]);
    expect(commodityTradeSalience(snap, snap.worldState, 'buyer', 'farm', 'Grain', { tick: 5 })).toBeNull();
  });
});

describe('tradeSalienceFactor — the centered-on-1.0 dampener', () => {
  test('below the valuable gate ⇒ EXACTLY 1.0 (byte-neutral)', () => {
    expect(tradeSalienceFactor(0)).toBe(1.0);
    expect(tradeSalienceFactor(T.VALUABLE_GATE - 0.01)).toBe(1.0);
  });

  test('above the gate ⇒ < 1.0 and monotonic in salience', () => {
    const low = tradeSalienceFactor(T.VALUABLE_GATE + 0.1);
    const high = tradeSalienceFactor(0.95);
    expect(low).toBeLessThan(1.0);
    expect(high).toBeLessThan(low);
  });

  test('a critical tie earns EXTRA dampening', () => {
    const normal = tradeSalienceFactor(0.95, false);
    const critical = tradeSalienceFactor(0.95, true);
    expect(critical).toBeLessThan(normal);
  });
});

describe('deriveSecondaryStatuses — B0 compatibility enforced', () => {
  const valuableTie = { salience: 0.7, need: 0.8, replace: 0.9, recency: 0, political: 0.6, critical: true, supplierId: 'b', buyerId: 'a', commodityId: 'grain' };
  const materielTie = { salience: 0.5, need: 0.6, replace: 0.6, recency: 0, political: 0.6, critical: false, supplierId: 'b', buyerId: 'a', commodityId: 'iron' };

  test('a rival CAN trade — keeps a normal supplier status', () => {
    const statuses = deriveSecondaryStatuses({ ties: [valuableTie] }, 'rival');
    expect(statuses.map(s => s.status)).toContain('critical_supplier');
    expect(statuses.every(s => !s.covert)).toBe(true);
  });

  test('a hostile (battlefield) primary CANNOT carry normal commerce — downgraded to covert smuggling', () => {
    const statuses = deriveSecondaryStatuses({ ties: [valuableTie] }, 'hostile');
    expect(statuses.map(s => s.status)).toEqual(['smuggling']);
    expect(statuses[0].covert).toBe(true);
    // The normal critical_supplier status is NOT present (battlefield enemies as
    // normal trade is blocked).
    expect(statuses.map(s => s.status)).not.toContain('critical_supplier');
  });

  test('a materiel tie maps to military_supplier where the primary allows it', () => {
    const statuses = deriveSecondaryStatuses({ ties: [materielTie] }, 'allied');
    expect(statuses.map(s => s.status)).toContain('military_supplier');
  });

  test('an empty tie list ⇒ no statuses', () => {
    expect(deriveSecondaryStatuses({ ties: [] }, 'trade_partner')).toEqual([]);
  });
});

describe('computeTradeSalienceMap / overlay — order-independence', () => {
  function fixture(saves, edges, channels, settlementIds, relationshipStates = {}) {
    return snapshotFor({ settlementIds, edges, channels, relationshipStates }, saves);
  }

  const saves = [
    save('buyer', 'Buytown', { imports: ['Grain'], foodSecurity: { resilienceScore: 15, storageMonths: 0 } }),
    save('farm', 'Farmstead', { exports: ['Grain'] }),
  ];
  const edges = [{ id: 'edge.farm.buyer', from: 'farm', to: 'buyer', relationshipType: 'rival' }];
  const channels = [tradeChannel('farm', 'buyer', 0.7)];
  const relationshipStates = { 'edge.farm.buyer': { relationshipType: 'rival' } };

  test('reversing the saves/edges/channels yields an identical factor + overlay map', () => {
    const fwd = fixture(saves, edges, channels, ['buyer', 'farm'], relationshipStates);
    const rev = fixture([...saves].reverse(), [...edges].reverse(), [...channels].reverse(), ['buyer', 'farm'], relationshipStates);

    const fM = computeTradeSalienceMap(fwd, fwd.worldState, { tick: 5 });
    const rM = computeTradeSalienceMap(rev, rev.worldState, { tick: 5 });
    expect(rM.factors).toEqual(fM.factors);
    expect(rM.salience).toEqual(fM.salience);

    const fO = computeSecondaryStatusOverlay(fwd, fwd.worldState, { tick: 5 });
    const rO = computeSecondaryStatusOverlay(rev, rev.worldState, { tick: 5 });
    expect(rO).toEqual(fO);

    // Anti-vacuity: a hungry buyer's sole grain tie is valuable ⇒ a factor < 1.0.
    const key = 'edge.farm.buyer';
    expect(fM.factors[key]).toBeLessThan(1.0);
    // The overlay carries a coherent status (rival CAN trade).
    expect(fO[key]?.length).toBeGreaterThan(0);
  });

  test('pairTradeSalience takes the MAX over both directions', () => {
    const snap = fixture(saves, edges, channels, ['buyer', 'farm'], relationshipStates);
    const pair = pairTradeSalience(snap, snap.worldState, 'farm', 'buyer', { tick: 5, relationshipType: 'rival' });
    expect(pair.salience).toBeGreaterThan(0);
    // The dependent is the hungry buyer.
    expect(pair.dependentId).toBe('buyer');
    expect(pair.supplierId).toBe('farm');
  });
});

describe('recencyLift — scoped to the SPECIFIC flipped buyer←supplier commodity tie', () => {
  // One supplier `farm` sells grain into TWO buyers, b1 and b2. The trade-war
  // ledger records a FRESH flip that `farm` won on the b1←grain tie only. The
  // b2←grain tie is the SAME supplier + commodity but an UNRELATED buyer — it
  // must NOT inherit b1's recency lift.
  const twoBuyers = snapshotFor({
    settlementIds: ['b1', 'b2', 'farm'],
    channels: [tradeChannel('farm', 'b1', 0.7), tradeChannel('farm', 'b2', 0.7)],
  }, [
    save('b1', 'Buyone', { imports: ['Grain'] }),
    save('b2', 'Buytwo', { imports: ['Grain'] }),
    save('farm', 'Farmstead', { exports: ['Grain'] }),
  ]);
  // Ledger entry as tradeWar.js stamps it: real buyerId/commodityId/winnerId + a
  // just-happened flip (age 0 ⇒ full recency lift for the MATCHING tie).
  const worldState = {
    ...twoBuyers.worldState,
    tradeWarState: {
      'b1:grain': { winnerId: 'farm', incumbentId: 'other', buyerId: 'b1', commodityId: 'grain', lastFlipTick: 5, updatedTick: 5 },
    },
  };

  test('the flipped tie (b1) gets the recency lift; the supplier\'s unrelated tie (b2) does not', () => {
    const flipped = commodityTradeSalience(twoBuyers, worldState, 'b1', 'farm', 'Grain', { tick: 5 });
    const unrelated = commodityTradeSalience(twoBuyers, worldState, 'b2', 'farm', 'Grain', { tick: 5 });
    expect(flipped).not.toBeNull();
    expect(unrelated).not.toBeNull();
    // The buyer whose tie actually flipped gets the lift…
    expect(flipped.recency).toBeGreaterThan(0);
    // …but the supplier's unrelated tie stays at zero recency (the bug lifted it too).
    expect(unrelated.recency).toBe(0);
  });
});
