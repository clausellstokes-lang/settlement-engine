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
import { deploymentReturnOutcomes } from '../../src/domain/worldPulse/deploymentReturn.js';
import { createPRNG } from '../../src/kernel/prng.js';

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

/**
 * ⛔ THE SECOND VERDICT CALLER, AND WHY IT NEEDED ITS OWN HALF OF THIS FENCE.
 *
 * `resolveCoupVerdict` has TWO production callers — the stressor-born coup in `coup.js`
 * and the RETURNING-ARMY coup in `deploymentReturn.js` — and SEAT-7a's own message says
 * wiring one without the other "is a silent PARTIAL lighting". The fence above drives only
 * the first. That is not a theoretical gap: MEASURED at this tip, `grep -rln` for
 * `deployment_return_coup` across the whole `tests/` tree returns ZERO files, so before
 * these arms the return-coup path had no test of any kind — dark, lit or otherwise — and a
 * lane that deleted the `forceRatioFactor` line from `deploymentReturn.js` would have
 * broken nothing anywhere in the estate.
 *
 * ⚠ THE FIXTURE IS TUNED BY MEASUREMENT, NOT BY TASTE, AND THE FIRST ONE DRAWN WAS
 * VACUOUS. A plain contested vassal at legitimacy 40 yields a lit factor of 0.9845 — the
 * mechanism is demonstrably ALIVE — and yet the emitted bytes are IDENTICAL in both arms,
 * because the seat falls at that seed either way and no emitted field carries pHold's
 * provenance. An aliveness arm written on that fixture would have passed while proving
 * nothing, which is this suite header's own recorded trap arriving through a second door.
 * A 3,600-point sweep over legitimacy score × incumbent power × challenger power × sixteen
 * seeds found 189 differing points; the one pinned below is the strongest available form —
 * the seat HOLDS in the dark world (no outcome at all) and FALLS in the lit one.
 *
 * ⛔ THE PATH'S OWN PRECONDITIONS, stated so a later tuning cannot silently strand these
 * arms: the return-coup branch is reached only when the home is NOT occupied, NOT besieged,
 * IS the junior side of a vassal edge, and the returning host's strength ratio clears
 * `SPLINTER_RATIO`. All four are load-bearing in the fixture.
 */
function vassalTown(score, incPower, chPower) {
  return {
    name: 'Aster', population: 4200, tier: 'town',
    powerStructure: {
      governingName: 'Crown',
      publicLegitimacy: { score, govMultiplier: 1 },
      factions: [
        { faction: 'Crown', category: 'government', power: incPower, isGoverning: true },
        { faction: 'Iron Company', category: 'military', power: chPower },
        { faction: 'House Vell', category: 'noble', power: chPower - 2 },
        { faction: 'The Guilds', category: 'merchant', power: chPower - 6 },
      ],
    },
  };
}

/** One seeded homecoming through the REAL return writer, serialized raw.
 *  @param {unknown} worldState @param {string} seed @param {number} score
 *  @param {number} incPower @param {number} chPower */
function runReturnRaw(worldState, seed, score, incPower, chPower) {
  const items = [
    { id: 'home', name: 'Aster', settlement: vassalTown(score, incPower, chPower), causal: { scores: { ruling_authority: 42 } } },
    { id: 'overlord', name: 'Suzerain', settlement: vassalTown(score, incPower, chPower) },
  ];
  const snapshot = {
    settlements: items,
    byId: new Map(items.map((e) => [e.id, e])),
    // The home is the JUNIOR side of a vassal edge — the one substrate that reaches the
    // return-coup branch; an occupied or besieged home returns earlier by construction.
    regionalGraph: { edges: [{ from: 'overlord', to: 'home', relationshipType: 'vassal' }], warFronts: [] },
    worldState,
  };
  return JSON.stringify(deploymentReturnOutcomes({
    // A LIGHT deployment record reads as a full-strength host (ratio 1.0), which clears
    // SPLINTER_RATIO — the legacy binary case, and the branch's own limiting case.
    resolvedDeployments: [{ attackerId: 'home', targetId: 'foe', outcome: 'conquest', deployment: { targetId: 'foe', sinceTick: 1, role: 'siege' } }],
    snapshot,
    graph: snapshot.regionalGraph,
    rng: createPRNG(seed),
    tick: 9,
    worldState,
  }));
}

describe('irregularForceEnabled — the RETURNING-ARMY verdict caller is wired, dark-identical and ALIVE', () => {
  const RETURN_SEED = 's8';
  const absentReturn = runReturnRaw({ simulationRules: {}, relationshipStates: {} }, RETURN_SEED, 0, 55, 20);

  it('a world with no rules object at all reproduces the absent-key bytes', () => {
    expect(runReturnRaw({ relationshipStates: {} }, RETURN_SEED, 0, 55, 20)).toBe(absentReturn);
    expect(runReturnRaw({ simulationRules: undefined, relationshipStates: {} }, RETURN_SEED, 0, 55, 20)).toBe(absentReturn);
  });

  it('an explicitly false key reproduces the absent-key bytes', () => {
    expect(runReturnRaw({ simulationRules: { irregularForceEnabled: false }, relationshipStates: {} }, RETURN_SEED, 0, 55, 20)).toBe(absentReturn);
  });

  it('every truthy-non-true value reproduces the absent-key bytes — the strict read', () => {
    for (const truthy of ['true', 1, {}, [], 'yes', 'TRUE']) {
      expect(
        runReturnRaw({ simulationRules: { irregularForceEnabled: truthy }, relationshipStates: {} }, RETURN_SEED, 0, 55, 20),
        `truthy ${JSON.stringify(truthy)}`,
      ).toBe(absentReturn);
    }
  });

  it('an unrelated lit key does not reach this mechanism', () => {
    expect(runReturnRaw({ simulationRules: { foreignSeatEnabled: true }, relationshipStates: {} }, RETURN_SEED, 0, 55, 20)).toBe(absentReturn);
  });

  it('THE ALIVENESS ARM — the seat HOLDS in the dark world and FALLS in the lit one', () => {
    // The strongest available form of the claim through this writer: dark emits NO outcome
    // at all (the order held, the branch `continue`s), lit emits a seized seat. A dormancy
    // assertion alone would be satisfied by two empty arrays, so the dark side is pinned as
    // EMPTY BY NAME and the lit side by its candidate type.
    const lit = runReturnRaw({ simulationRules: { irregularForceEnabled: true }, relationshipStates: {} }, RETURN_SEED, 0, 55, 20);
    expect(lit === absentReturn).toBe(false);
    expect(JSON.parse(absentReturn).map((/** @type {any} */ o) => o.candidateType)).toEqual([]);
    expect(JSON.parse(lit).map((/** @type {any} */ o) => o.candidateType)).toEqual(['coup_succeeded']);
    expect(JSON.parse(lit).map((/** @type {any} */ o) => o.ruleId)).toEqual(['deployment_return_coup']);
  });

  it('the path is REACHABLE without the flag at all, so a dark green is not a dead branch', () => {
    // The negative control for the arm above: the same fixture at a seed where the seat
    // falls anyway proves the branch emits under DARK rules too, so the empty dark array at
    // RETURN_SEED is a held seat rather than an unreachable path.
    const darkFall = runReturnRaw({ simulationRules: {}, relationshipStates: {} }, 's1', 0, 70, 26);
    expect(JSON.parse(darkFall).map((/** @type {any} */ o) => o.candidateType)).toEqual(['coup_succeeded']);
  });
});
