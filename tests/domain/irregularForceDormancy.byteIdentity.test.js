/**
 * irregularForceDormancy.byteIdentity.test.js — W-SEAT D10 (`irregularForceEnabled`),
 * car SEAT-7a: the dark bar, and it is BIT IDENTITY rather than closeness.
 *
 * ⛔ THE COMPARISON RUNS THROUGH THE PRODUCTION CALLER, NOT THE PURE FUNCTION, AND THAT IS
 * THE WHOLE POINT OF THE FILE. A dormancy suite that drives `resolveCoupVerdict` directly
 * proves the arithmetic and says NOTHING about whether `coup.js` ever passes the factor —
 * and "computed but never passed" is exactly the dead-arm shape this estate has shipped
 * before with every fence green. Every arm below goes through `coupVerdictOutcomes`, the
 * real per-tick writer, and compares the WHOLE emitted outcome array.
 *
 * ⛔ RAW `JSON.stringify` WITH NO NORMALIZER (A1.19): normalising would launder the very
 * bytes the bar exists to compare. And the LIT ANTI-VACUITY arm is not decoration — without
 * it a green here could mean the instrument compared two empty arrays, which is how a
 * dormancy fence passes over a mechanism that cannot fire at all.
 */
import { describe, expect, it } from 'vitest';

import { COUP_STRESSOR_TYPE, coupVerdictOutcomes } from '../../src/domain/worldPulse/coup.js';

/** A contested seat whose incumbent stays GATED, so the `share` path is reachable. */
function contestedTown() {
  return {
    name: 'Aster', population: 4200, tier: 'town',
    powerStructure: {
      governingName: 'Crown',
      publicLegitimacy: { score: 40, govMultiplier: 1 },
      factions: [
        { faction: 'Crown', category: 'government', power: 85, isGoverning: true },
        { faction: 'Iron Company', category: 'military', power: 32 },
        { faction: 'House Vell', category: 'noble', power: 30 },
        { faction: 'The Guilds', category: 'merchant', power: 26 },
      ],
    },
  };
}

function fixture() {
  const items = [{ id: 'a', name: 'Aster', settlement: contestedTown(), causal: { scores: { ruling_authority: 42 } } }];
  return {
    snapshot: { settlements: items, byId: new Map(items.map((e) => [e.id, e])) },
    resolved: [{ id: 'st1', type: COUP_STRESSOR_TYPE, originSettlementId: 'a', severity: 0.6, peakSeverity: 0.6 }],
  };
}

/** One seeded tick through the real writer, serialized raw. @param {unknown} worldState */
function runRaw(worldState) {
  const { snapshot, resolved } = fixture();
  return JSON.stringify(coupVerdictOutcomes({
    resolved, snapshot, rng: { random: () => 0.4 }, tick: 7, rules: {}, worldState,
  }));
}

describe('irregularForceEnabled — the dark world is BIT-identical through the real writer', () => {
  const absent = runRaw({ simulationRules: {} });

  it('a world with no rules object at all reproduces the absent-key bytes', () => {
    expect(runRaw({})).toBe(absent);
    expect(runRaw({ simulationRules: undefined })).toBe(absent);
  });

  it('an explicitly false key reproduces the absent-key bytes', () => {
    expect(runRaw({ simulationRules: { irregularForceEnabled: false } })).toBe(absent);
  });

  it('every truthy-non-true value reproduces the absent-key bytes — the strict read', () => {
    for (const truthy of ['true', 1, {}, [], 'yes', 'TRUE']) {
      expect(runRaw({ simulationRules: { irregularForceEnabled: truthy } }), `truthy ${JSON.stringify(truthy)}`).toBe(absent);
    }
  });

  it('an unrelated lit key does not reach this mechanism', () => {
    expect(runRaw({ simulationRules: { foreignSeatEnabled: true } })).toBe(absent);
  });

  it('THE ANTI-VACUITY ARM — the instrument compared something, and the lit world DIFFERS', () => {
    // Without this arm every green above is consistent with two empty arrays. It is also
    // the aliveness claim in its strongest form: at this seed the seat SURVIVES dark and
    // FALLS lit, so the flag changes the world's recorded outcome and not merely a figure.
    const lit = runRaw({ simulationRules: { irregularForceEnabled: true } });
    expect(absent.length).toBeGreaterThan(0);
    expect(lit === absent).toBe(false);
    expect(JSON.parse(absent).map((/** @type {any} */ o) => o.candidateType)).toEqual(['coup_suppressed']);
    expect(JSON.parse(lit).map((/** @type {any} */ o) => o.candidateType)).toEqual(['coup_succeeded']);
  });
});
