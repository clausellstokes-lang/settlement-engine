/** @vitest-environment node */
import { describe, expect, test } from 'vitest';

// ─────────────────────────────────────────────────────────────────────────────
// F1 — PDF↔SCREEN PARITY for the NEW B-track state (mobilization / army /
// occupation / trade pressure). The screen's WarFaithSection and the PDF's
// FaithWar both read the SAME display selectors with the SAME player-safe args
// (includeCovert: false). This pins that the PDF view-model (buildPdfLiveWorld)
// carries EXACTLY the values the screen selectors produce — no drift.
// ─────────────────────────────────────────────────────────────────────────────

import { buildPdfLiveWorld } from '../../src/pdf/lib/liveWorld.js';
import { settlementMobilization } from '../../src/domain/display/mobilizationStatus.js';
import { deployedArmyStatus } from '../../src/domain/display/armyStrength.js';
import { settlementOccupation, occupierHoldings } from '../../src/domain/display/occupationStatus.js';
import { settlementTradePressure } from '../../src/domain/display/tradePressure.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

function save(id, name, patch = {}) {
  return {
    id,
    settlement: {
      id, name, tier: patch.tier || 'town', population: patch.population || 4000,
      config: { tradeRouteAccess: 'road' },
      institutions: [],
      economicState: { prosperity: 'Prosperous', primaryExports: patch.exports || [], primaryImports: patch.imports || [], ...(patch.foodSecurity ? { foodSecurity: patch.foodSecurity } : {}) },
      powerStructure: { publicLegitimacy: { score: 60, label: 'Stable' }, factions: [{ faction: 'Council', category: 'civic', power: 60, isGoverning: true }] },
      activeConditions: [],
    },
  };
}

describe('PDF↔screen parity — B-track surfaces', () => {
  const settlements = [
    save('agg', 'Aggressor', { exports: ['Iron'] }),
    save('def', 'Defender', { imports: ['Iron'], foodSecurity: { resilienceScore: 10, storageMonths: 0 } }),
    save('held', 'Heldtown'),
  ];
  const regionalGraph = ensureRegionalGraph({
    edges: [{ id: 'e1', from: 'agg', to: 'def', relationshipType: 'trade_partner' }],
    channels: [{ type: 'trade_dependency', from: 'agg', to: 'def', status: 'confirmed', strength: 0.8, goods: [{ id: 'iron', label: 'Iron' }] }],
  });
  const worldState = {
    tick: 5,
    warPosture: { agg: { state: 'mobilized', progress: 1, sinceTick: 0 } },
    deployments: { agg: { targetId: 'def', maxStartStrength: 100, currentEffectiveStrength: 55, supplyIntegrity: 0.5, morale: 0.5, foodReserve: 0.5 } },
    occupations: { held: { occupierId: 'agg', state: 'stabilized', resistance: 0.2, sinceTick: 0 } },
  };
  const nameFor = (id) => ({ agg: 'Aggressor', def: 'Defender', held: 'Heldtown' }[id] || id);
  const campaign = { worldState, regionalGraph, settlements, nameFor };

  test('the aggressor PDF slice mirrors the screen selectors', () => {
    const lw = buildPdfLiveWorld({ settlement: settlements[0].settlement, campaign });
    expect(lw).not.toBeNull();

    // Mobilization — same phrase the screen shows.
    const screenMob = settlementMobilization({ settlementId: 'agg', worldState });
    expect(lw.mobilization.phrase).toBe(screenMob.phrase);
    expect(lw.mobilization.ticksToDeploy).toBe(screenMob.ticksToDeploy);

    // Army strength + attrition — same phrases.
    const screenArmy = deployedArmyStatus({ settlementId: 'agg', worldState, nameFor });
    expect(lw.army.targetName).toBe(screenArmy.targetName);
    expect(lw.army.remainingPhrase).toBe(screenArmy.remainingPhrase);
    expect(lw.army.conditionPhrase).toBe(screenArmy.conditionPhrase);

    // Occupier holdings — same names + flags.
    const screenHold = occupierHoldings({ settlementId: 'agg', worldState, nameFor });
    expect(lw.holdings.holds).toEqual(screenHold.holds.map(h => h.name));
    expect(lw.holdings.stretchedThin).toBe(screenHold.stretchedThin);
    expect(lw.holdings.strengthened).toBe(screenHold.strengthened);

    // Trade pressure — same partner ties (player-safe, covert excluded both sides).
    const screenTrade = settlementTradePressure({ settlementId: 'agg', regionalGraph, settlements, worldState, includeCovert: false, nameFor });
    expect(lw.tradePressure.map(t => t.partnerName)).toEqual(screenTrade.map(t => t.partnerName));
    expect(lw.tradePressure.map(t => t.phrase)).toEqual(screenTrade.map(t => t.phrase));
  });

  test('the occupied settlement PDF slice mirrors the screen occupation selector', () => {
    const lw = buildPdfLiveWorld({ settlement: settlements[2].settlement, campaign });
    const screenOcc = settlementOccupation({ settlementId: 'held', worldState, nameFor });
    expect(lw.occupationLive.occupierName).toBe(screenOcc.occupierName);
    expect(lw.occupationLive.statePhrase).toBe(screenOcc.statePhrase);
    expect(lw.occupationLive.resistancePhrase).toBe(screenOcc.resistancePhrase);
  });

  test('a dormant settlement yields no B-track PDF state (byte-identical off-state)', () => {
    const lw = buildPdfLiveWorld({ settlement: { id: 'nope' }, campaign: { worldState: {}, regionalGraph: null, settlements: [], nameFor } });
    expect(lw).toBeNull();
  });
});
