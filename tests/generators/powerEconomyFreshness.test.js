/**
 * Final economy -> power freshness.
 *
 * The pipeline intentionally forms political intent from a provisional economy:
 * faction power is required before factionCorrelationPass can pull a signature
 * institution. A successful pull can then change prosperity, safety, or food.
 * The bounded powerEconomyReconcilePass must consume that final economy without
 * inventing a second political roster or reopening institution production.
 */

import { describe, expect, test } from 'vitest';
import {
  computePublicLegitimacy,
} from '../../src/generators/factionDynamics.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import {
  assertPowerEconomyFreshness,
  fingerprintPowerEconomyInput,
} from '../../src/generators/power/economyReconciliation.js';

const STALE_SEED_CONFIG = {
  settType: 'city',
  culture: 'latin',
  terrainOverride: 'plains',
  tradeRouteAccess: 'crossroads',
  priorityEconomy: 75,
  priorityMilitary: 55,
  priorityReligion: 50,
  priorityCriminal: 50,
  priorityMagic: 40,
};

function generate(config, seed, options = {}) {
  return generateSettlementPipeline(config, null, {
    seed,
    customContent: {},
    ...options,
  });
}

function powerByFaction(settlement) {
  return Object.fromEntries(
    settlement.powerStructure.factions.map(
      faction => [faction.faction, faction.power],
    ),
  );
}

describe('bounded final economy -> power reconciliation', () => {
  test('econ-power-freshness-43 consumes Moderate, not provisional Comfortable', () => {
    const snapshots = {};
    const settlement = generate(
      STALE_SEED_CONFIG,
      'econ-power-freshness-43',
      {
        onStep(name, ctx) {
          if (
            name === 'generatePower'
            || name === 'economyReconcilePass'
            || name === 'powerEconomyReconcilePass'
          ) {
            snapshots[name] = {
              prosperity: ctx.economicState.prosperity,
              legitimacy: structuredClone(
                ctx.powerStructure.publicLegitimacy,
              ),
              powers: Object.fromEntries(
                ctx.powerStructure.factions.map(
                  faction => [faction.faction, faction.power],
                ),
              ),
            };
          }
        },
      },
    );

    expect(snapshots.generatePower.prosperity).toBe('Comfortable');
    expect(snapshots.generatePower.legitimacy.breakdown.prosperity).toBe(8);
    expect(snapshots.economyReconcilePass.prosperity).toBe('Moderate');
    // This is the exact stale join: immediately after the economy changes,
    // power still carries Comfortable's +8 until the bounded closeout runs.
    expect(
      snapshots.economyReconcilePass.legitimacy.breakdown.prosperity,
    ).toBe(8);

    expect(
      snapshots.powerEconomyReconcilePass.legitimacy.breakdown.prosperity,
    ).toBe(0);
    expect(snapshots.powerEconomyReconcilePass.powers).toEqual({
      'Military/Guard': 22,
      'Merchant City Council': 18,
      'Merchant Guilds': 13,
      'Religious Authorities': 12,
      'Craft Guilds': 9,
      'War Council': 8,
      "Thieves' Guild": 8,
      'Noble Families': 5,
      'Arcane Orders': 5,
    });
    expect(powerByFaction(settlement)).toEqual(
      snapshots.powerEconomyReconcilePass.powers,
    );
    expect(
      settlement.powerStructure.factions.reduce(
        (sum, faction) => sum + faction.power,
        0,
      ),
    ).toBe(100);
  });

  test('the final fingerprint and legitimacy match final dossier inputs across a cohort', () => {
    const tiers = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
    for (const tier of tiers) {
      for (let index = 0; index < 4; index += 1) {
        const config = {
          settType: tier,
          culture: index % 2 ? 'latin' : 'germanic',
          terrainOverride: index % 2 ? 'forest' : 'plains',
          tradeRouteAccess: index % 3 ? 'road' : 'crossroads',
        };
        const seed = `power-freshness-${tier}-${index}`;
        let institutionsBeforePowerCloseout;
        let institutionsAfterPowerCloseout;
        let powerCloseoutCount = 0;
        const options = {
          onStep(name, ctx) {
            if (name === 'economyReconcilePass') {
              institutionsBeforePowerCloseout = ctx.institutions.map(
                institution => institution.name,
              );
            }
            if (name === 'powerEconomyReconcilePass') {
              powerCloseoutCount += 1;
              institutionsAfterPowerCloseout = ctx.institutions.map(
                institution => institution.name,
              );
            }
          },
        };
        const first = generate(config, seed, options);
        const replay = generate(config, seed);

        expect(first.powerStructure).toEqual(replay.powerStructure);
        expect(powerCloseoutCount).toBe(1);
        expect(institutionsAfterPowerCloseout).toEqual(
          institutionsBeforePowerCloseout,
        );
        expect(first.powerStructure.powerProjectionVersion).toBe(1);
        expect(first.powerStructure.economyInputFingerprint).toBe(
          fingerprintPowerEconomyInput(first.economicState, first.tier),
        );
        expect(() => assertPowerEconomyFreshness(
          first.powerStructure,
          first.economicState,
          first.tier,
        )).not.toThrow();

        const expectedLegitimacy = computePublicLegitimacy(
          first.economicState,
          first.defenseProfile.readiness.label,
          first.tier,
        );
        expect(first.powerStructure.publicLegitimacy).toEqual(
          expectedLegitimacy,
        );
        expect(first.powerIntent).toBeUndefined();
      }
    }
  });

  test('the freshness assertion fails closed on changed or missing economic input', () => {
    const settlement = generate(
      STALE_SEED_CONFIG,
      'power-freshness-assertion',
    );
    const changedEconomicState = {
      ...settlement.economicState,
      prosperity:
        settlement.economicState.prosperity === 'Wealthy'
          ? 'Poor'
          : 'Wealthy',
    };
    expect(() => assertPowerEconomyFreshness(
      settlement.powerStructure,
      changedEconomicState,
      settlement.tier,
    )).toThrow(/freshness invariant failed/i);

    expect(() => assertPowerEconomyFreshness(
      {
        ...settlement.powerStructure,
        economyInputFingerprint: undefined,
      },
      settlement.economicState,
      settlement.tier,
    )).toThrow(/no economy fingerprint/i);
  });

  test('neighbour identities and raw rolls survive both final projections', () => {
    const neighbour = generateSettlementPipeline(
      {
        settType: 'city',
        culture: 'imperial',
        tradeRouteAccess: 'port',
        priorityMilitary: 70,
      },
      null,
      { seed: 'renorm-neighbour-fixture', customContent: {} },
    );
    let rolledNeighbours = [];
    const settlement = generateSettlementPipeline(
      {
        settType: 'city',
        culture: 'imperial',
        tradeRouteAccess: 'port',
        _neighbourRelType: 'allied',
      },
      neighbour,
      {
        seed: 'renorm-allied-15',
        customContent: {},
        onStep(name, ctx) {
          if (name !== 'neighbourFactions') return;
          rolledNeighbours = ctx.powerStructure.factions
            .filter(faction => faction.source?.startsWith('neighbour_'))
            .map(faction => ({
              faction: faction.faction,
              desc: faction.desc,
              source: faction.source,
              neighbourName: faction.neighbourName,
              rawPower: faction.rawPower,
            }));
        },
      },
    );
    const finalNeighbours = settlement.powerStructure.factions
      .filter(faction => faction.source?.startsWith('neighbour_'))
      .map(faction => ({
        faction: faction.faction,
        desc: faction.desc,
        source: faction.source,
        neighbourName: faction.neighbourName,
        rawPower: faction.rawPower,
      }));

    expect(rolledNeighbours).toHaveLength(1);
    expect(finalNeighbours).toEqual(rolledNeighbours);
    expect(
      settlement.powerStructure.factions.reduce(
        (sum, faction) => sum + faction.power,
        0,
      ),
    ).toBe(100);
  });
});
