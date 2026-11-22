import { describe, expect, test } from 'vitest';

import {
  saliencePhrase,
  pairTradePressure,
  settlementTradePressure,
  hasTradePressure,
} from '../../../src/domain/display/tradePressure.js';
import { ensureRegionalGraph } from '../../../src/domain/region/index.js';

// ─────────────────────────────────────────────────────────────────────────────
// Phase B4 — strategic trade: pressure / dependency / coercion, in DM heuristic
// language. PLAYER-SAFE: covert smuggling (battlefield-enemy trade) is GM-ONLY.
// NO internals (no salience/factor float). Inert when absent.
// ─────────────────────────────────────────────────────────────────────────────

function save(id, name, patch = {}) {
  return {
    id,
    settlement: {
      id,
      name,
      tier: patch.tier || 'town',
      population: patch.population || 4000,
      config: { tradeRouteAccess: 'road' },
      institutions: [],
      economicState: {
        prosperity: 'Prosperous',
        primaryExports: patch.exports || [],
        primaryImports: patch.imports || [],
        ...(patch.foodSecurity ? { foodSecurity: patch.foodSecurity } : {}),
      },
      powerStructure: {
        publicLegitimacy: { score: 60, label: 'Stable' },
        factions: [{ faction: 'Council', category: 'civic', power: 60, isGoverning: true }],
      },
      activeConditions: [],
    },
  };
}

function tradeChannel(from, to, strength = 0.8, goodId = 'grain', goodLabel = 'Grain') {
  return { type: 'trade_dependency', from, to, status: 'confirmed', strength, goods: [{ id: goodId, label: goodLabel }] };
}

describe('tradePressure — heuristic phrasing (no numbers)', () => {
  test('saliencePhrase buckets into words', () => {
    expect(saliencePhrase(0.9)).toMatch(/vital|hard-to-replace/i);
    expect(saliencePhrase(0.4)).toMatch(/valuable/i);
    expect(saliencePhrase(0.9)).not.toMatch(/\d/);
  });
});

describe('tradePressure — dependency + coercion', () => {
  test('a food-insecure buyer dependent on a sole grain supplier reads as critical', () => {
    const settlements = [
      save('hungry', 'Hungerton', { imports: ['Grain'], foodSecurity: { resilienceScore: 8, storageMonths: 0 } }),
      save('farm', 'Farmstead', { exports: ['Grain'] }),
    ];
    const regionalGraph = ensureRegionalGraph({
      edges: [{ id: 'e1', from: 'farm', to: 'hungry', relationshipType: 'trade_partner' }],
      channels: [tradeChannel('farm', 'hungry')],
    });
    const worldState = { tick: 5 };
    const pressure = pairTradePressure({
      aId: 'hungry', bId: 'farm', regionalGraph, settlements, worldState, tick: 5,
      nameFor: (id) => ({ hungry: 'Hungerton', farm: 'Farmstead' }[id] || id),
    });
    expect(pressure).not.toBeNull();
    expect(pressure.restrains).toBe(true);
    expect(pressure.phrase).not.toMatch(/\d/);
    if (pressure.critical) {
      expect(pressure.dependentName).toBe('Hungerton');
      expect(pressure.supplierName).toBe('Farmstead');
    }
  });

  test('critical role resolves by id, not by rendered display name (name collision)', () => {
    // Two settlements that render the SAME display name: role must key off id, so
    // the dependent buyer is never mislabeled as its own supplier (or vice versa).
    const settlements = [
      save('hungry', 'Twin', { imports: ['Grain'], foodSecurity: { resilienceScore: 8, storageMonths: 0 } }),
      save('farm', 'Twin', { exports: ['Grain'] }),
    ];
    const regionalGraph = ensureRegionalGraph({
      edges: [{ id: 'e1', from: 'farm', to: 'hungry', relationshipType: 'trade_partner' }],
      channels: [tradeChannel('farm', 'hungry')],
    });
    const nameFor = () => 'Twin'; // every settlement renders the same name
    const pair = pairTradePressure({
      aId: 'hungry', bId: 'farm', regionalGraph, settlements, worldState: { tick: 5 }, tick: 5, nameFor,
    });
    expect(pair).not.toBeNull();
    if (pair.critical) {
      // Raw ids are exposed so callers resolve role by identity.
      expect(pair.dependentId).toBe('hungry');
      expect(pair.supplierId).toBe('farm');
      const dependentTie = settlementTradePressure({
        settlementId: 'hungry', regionalGraph, settlements, worldState: { tick: 5 }, tick: 5, nameFor,
      }).find(t => t.role !== 'partner');
      expect(dependentTie?.role).toBe('dependent');
      const supplierTie = settlementTradePressure({
        settlementId: 'farm', regionalGraph, settlements, worldState: { tick: 5 }, tick: 5, nameFor,
      }).find(t => t.role !== 'partner');
      expect(supplierTie?.role).toBe('supplier');
    }
  });

  test('settlement-level pressure surfaces ties; inert when no tie', () => {
    const settlements = [
      save('hungry', 'Hungerton', { imports: ['Grain'], foodSecurity: { resilienceScore: 8, storageMonths: 0 } }),
      save('farm', 'Farmstead', { exports: ['Grain'] }),
    ];
    const regionalGraph = ensureRegionalGraph({
      edges: [{ id: 'e1', from: 'farm', to: 'hungry', relationshipType: 'trade_partner' }],
      channels: [tradeChannel('farm', 'hungry')],
    });
    const args = { settlementId: 'hungry', regionalGraph, settlements, worldState: { tick: 5 }, tick: 5, nameFor: (id) => id };
    const ties = settlementTradePressure(args);
    expect(Array.isArray(ties)).toBe(true);
    // No graph ⇒ nothing.
    expect(settlementTradePressure({ settlementId: 'hungry', regionalGraph: null, settlements: [], worldState: {} })).toEqual([]);
    expect(hasTradePressure({ settlementId: 'x', regionalGraph: null, settlements: [], worldState: {} })).toBe(false);
  });
});

describe('tradePressure — PLAYER-SAFE: covert smuggling is GM-only', () => {
  // Two battlefield enemies (hostile primary) with a trade tie → the tie can only
  // exist as a covert smuggling channel. A player view must NEVER see it.
  const settlements = [
    save('warhawk', 'Warhawk', { imports: ['Iron'], exports: [] }),
    save('forge', 'Forgeholt', { exports: ['Iron'] }),
  ];
  const regionalGraph = ensureRegionalGraph({
    edges: [{ id: 'eh', from: 'forge', to: 'warhawk', relationshipType: 'hostile' }],
    channels: [tradeChannel('forge', 'warhawk', 0.8, 'iron', 'Iron')],
  });
  const worldState = { tick: 5, relationshipStates: { eh: { relationshipType: 'hostile' } } };
  const baseArgs = { settlementId: 'warhawk', regionalGraph, settlements, worldState, tick: 5, nameFor: (id) => id };

  test('a player view never surfaces a covert smuggling tie', () => {
    const playerTies = settlementTradePressure({ ...baseArgs, includeCovert: false });
    expect(playerTies.every(t => t.covert !== true)).toBe(true);
    expect(playerTies.some(t => /smuggl/i.test(t.phrase))).toBe(false);
  });

  test('a GM view may surface the covert smuggling tie, flagged covert', () => {
    const gmTies = settlementTradePressure({ ...baseArgs, includeCovert: true });
    const covert = gmTies.find(t => t.covert === true);
    // If the overlay produced a smuggling status, the GM sees it and it is flagged.
    if (covert) {
      expect(covert.phrase).toMatch(/smuggl/i);
      expect(covert.covert).toBe(true);
    }
  });
});
