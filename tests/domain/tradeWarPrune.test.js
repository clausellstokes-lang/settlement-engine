import { describe, expect, test } from 'vitest';

import { evaluateTradeWar } from '../../src/domain/worldPulse/tradeWar.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { createPRNG } from '../../src/generators/prng.js';

// ─────────────────────────────────────────────────────────────────────────────
// Trade war — cooldown-ledger hygiene (resource-leak regression).
//
// evaluateTradeWar persists one tradeWarState[`${buyer}:${commodity}`] entry per
// contested prize. Unlike warPosture/occupations (which have prune passes), it
// historically never removed entries when the buyer left the snapshot or the
// commodity stopped being imported — unbounded stale growth. This pins the
// reconcile/prune pass: a stale entry whose buyer is absent from snapshot.byId
// (or whose commodity is no longer imported) is dropped each tick, while live
// entries survive.
// ─────────────────────────────────────────────────────────────────────────────

const NOW = '2026-01-01T00:00:00.000Z';

function settlement(name, patch = {}) {
  return {
    name,
    tier: patch.tier || 'town',
    population: patch.population || 4000,
    config: { tradeRouteAccess: 'road', priorityEconomy: 30, priorityMilitary: 25 },
    institutions: [],
    economicState: {
      prosperity: 'Prosperous',
      primaryExports: patch.exports || [],
      primaryImports: patch.imports || [],
    },
    powerStructure: {
      publicLegitimacy: { score: patch.legitimacy ?? 60, label: 'Stable' },
      factions: [{ faction: 'Council', category: 'civic', power: 60, isGoverning: true }],
      conflicts: [],
    },
    npcs: [],
    activeConditions: [],
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

function tradeChannel(from, to, strength) {
  return { type: 'trade_dependency', from, to, status: 'confirmed', strength, goods: [{ id: 'grain', label: 'Grain' }] };
}

// A live grain contest into 'buyer' (incumbent + challenger both export grain).
function grainContestFixture() {
  const saves = [
    save('buyer', 'Ctown', { imports: ['Grain'] }),
    save('inc', 'Aville', { exports: ['Grain'], tier: 'village', population: 300, legitimacy: 30 }),
    save('chal', 'Bburg', { exports: ['Grain'], tier: 'city', population: 60000, legitimacy: 80 }),
  ];
  const channels = [tradeChannel('inc', 'buyer', 0.6), tradeChannel('chal', 'buyer', 0.5)];
  const edges = [
    { id: 'edge.inc.buyer', from: 'inc', to: 'buyer', relationshipType: 'trade_partner' },
    { id: 'edge.chal.buyer', from: 'chal', to: 'buyer', relationshipType: 'trade_partner' },
  ];
  return { saves, channels, edges, settlementIds: ['buyer', 'inc', 'chal'] };
}

function campaignFor({ settlementIds, edges, channels, tradeWarState }) {
  return {
    id: 'prune-fixture',
    name: 'Prune Fixture',
    settlementIds,
    worldState: {
      rngSeed: 'prune-seed',
      tick: 10,
      relationshipStates: {},
      simulationRules: { warLayerEnabled: true },
      tradeWarState,
    },
    regionalGraph: ensureRegionalGraph({ edges, channels }),
    wizardNews: { currentTick: 10, entries: [] },
  };
}

describe('trade war — cooldown-ledger prune (no unbounded stale growth)', () => {
  test('a stale entry for an absent buyer is pruned; live entries survive', () => {
    const { saves, channels, edges, settlementIds } = grainContestFixture();
    // A pre-seeded ledger carrying TWO stale entries no live (buyer,commodity)
    // pair can ever re-crown — a buyer that left the snapshot ('ghost') and a
    // commodity the live buyer no longer imports ('buyer:iron'). Plus one live
    // entry ('buyer:grain') that a real contest still holds.
    const tradeWarState = {
      'ghost:grain': { winnerId: 'phantom', incumbentId: 'phantom', lastFlipTick: 2, updatedTick: 2 },
      'buyer:iron': { winnerId: 'rust', incumbentId: 'rust', lastFlipTick: 3, updatedTick: 3 },
      'buyer:grain': { winnerId: 'inc', incumbentId: 'inc', lastFlipTick: 1, updatedTick: 1 },
    };
    const campaign = campaignFor({ settlementIds, edges, channels, tradeWarState });
    const snap = buildWorldSnapshot({ campaign, saves, worldState: campaign.worldState });

    const tw = evaluateTradeWar({
      snapshot: snap, worldState: campaign.worldState, rng: createPRNG('prune'), tick: 10, now: NOW, rules: { warLayerEnabled: true },
    });

    // The absent-buyer entry is gone.
    expect(tw.tradeWarState['ghost:grain']).toBeUndefined();
    // The no-longer-imported-commodity entry is gone.
    expect(tw.tradeWarState['buyer:iron']).toBeUndefined();
    // The live grain prize survives (re-crowned by the contest this tick).
    expect(tw.tradeWarState['buyer:grain']).toBeDefined();
    // The input ledger object is never mutated in place (fresh-copy contract).
    expect(tradeWarState['ghost:grain']).toBeDefined();
  });

  test('over many ticks with a churning roster the ledger stays bounded (does not accrete ghosts)', () => {
    const { saves, channels, edges, settlementIds } = grainContestFixture();
    let tradeWarState = {};
    for (let tick = 10; tick < 40; tick += 1) {
      // Each tick, inject a fresh ghost entry as if a since-departed buyer had
      // once been crowned. Without the prune, these accrete forever.
      tradeWarState = { ...tradeWarState, [`ghost_${tick}:grain`]: { winnerId: 'x', incumbentId: 'x', lastFlipTick: tick, updatedTick: tick } };
      const campaign = campaignFor({ settlementIds, edges, channels, tradeWarState });
      const snap = buildWorldSnapshot({ campaign, saves, worldState: campaign.worldState });
      const tw = evaluateTradeWar({
        snapshot: snap, worldState: campaign.worldState, rng: createPRNG(`soak-${tick}`), tick, now: NOW, rules: { warLayerEnabled: true },
      });
      tradeWarState = tw.tradeWarState;
    }
    // Bounded: only the live (buyer, imported-commodity) prizes remain — no ghost
    // accretion across 30 ticks.
    expect(Object.keys(tradeWarState).every(k => !k.startsWith('ghost_'))).toBe(true);
    expect(tradeWarState['buyer:grain']).toBeDefined();
  });
});
