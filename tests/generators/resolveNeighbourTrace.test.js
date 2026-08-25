/**
 * tests/generators/resolveNeighbourTrace.test.js — Regional triage wave:
 * the resolveNeighbour bound receipt claims only effects that are
 * non-identity for the bound relationship.
 *
 * The verifier nit this pins shut: the receipt claimed 'relationship
 * dynamics shift defense/market odds' and 'relationship modifies
 * military/economy scores' for EVERY bound neighbour, including neutral —
 * where REL_DYNAMICS.neutral is militaryBias 0 / economyMode 'independent'
 * (market mult 1.0) and priorityHelpers' neighbour score multipliers are
 * exactly 1.0. Both claims were lies for identity-dynamics relationships.
 *
 * Pins:
 *   • neutral — the bound receipt still exists but makes NO shift/modify
 *     claims (no 'institutions' or 'effectiveScores' targets, and no econ
 *     bias claim either: 'independent' mode produces an empty bias that
 *     generateEconomy never threads);
 *   • hostile — the receipt names the defense-odds shift (militaryBias 0.5
 *     plus market suppress ×0.4 → 'defense/market') AND the military/economy
 *     score modification;
 *   • trade_partner — market-only: the institutions claim names market but
 *     not defense (militaryBias 0), and the score claim stays (×0.96/×1.08).
 */

import { describe, expect, test } from 'vitest';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const SELF_CFG = { settType: 'town', culture: 'germanic', tradeRouteAccess: 'road' };
const NEIGHBOUR_CFG = { settType: 'town', culture: 'germanic', tradeRouteAccess: 'road', priorityMilitary: 70, priorityEconomy: 60 };
const SEED = 'triage-trace-2026-06-11';

const neighbour = generateSettlementPipeline(NEIGHBOUR_CFG, null, { seed: 'triage-trace-neighbour', customContent: {} });

function boundTrace(rel) {
  const s = generateSettlementPipeline(
    { ...SELF_CFG, _neighbourRelType: rel }, neighbour, { seed: SEED, customContent: {} },
  );
  return (s.simulationTrace || []).find(t => t.step === 'resolveNeighbour' && t.result === 'bound');
}

describe('resolveNeighbour receipt honesty (relType-conditional effects)', () => {
  test('neutral binds with NO shift claims — identity dynamics promise nothing', () => {
    const trace = boundTrace('neutral');
    expect(trace, 'neutral neighbour must still emit its bound receipt').toBeTruthy();

    const targets = (trace.downstreamEffects || []).map(e => e.target);
    expect(targets).not.toContain('institutions');
    expect(targets).not.toContain('effectiveScores');
    // 'independent' economy mode yields an empty bias that generateEconomy
    // never threads — no econ claim either.
    expect(targets).not.toContain('economicState');
    for (const e of trace.downstreamEffects || []) {
      expect(e.effect, `neutral receipt must not claim '${e.effect}'`).not.toMatch(/shift|modif/i);
    }
    // The receipt is not empty noise: something honest remains (the faction
    // mirror/oppose rolls are real even for neutral — 0.05/0.05).
    expect((trace.downstreamEffects || []).length).toBeGreaterThan(0);
  });

  test('hostile names the defense-odds and military-score effects', () => {
    const trace = boundTrace('hostile');
    expect(trace).toBeTruthy();

    const effects = (trace.downstreamEffects || []).map(e => `${e.target}: ${e.effect}`);
    // militaryBias 0.5 militarizes defense AND suppress mode (×0.4) hits markets.
    expect(effects).toContain('institutions: relationship dynamics shift defense/market odds');
    expect(effects).toContain('effectiveScores: relationship modifies military/economy scores');
  });

  test('trade_partner claims a market shift only — its militaryBias is 0', () => {
    const trace = boundTrace('trade_partner');
    expect(trace).toBeTruthy();

    const inst = (trace.downstreamEffects || []).find(e => e.target === 'institutions');
    expect(inst, 'complement mode (×1.4) is a real market shift').toBeTruthy();
    expect(inst.effect).toBe('relationship dynamics shift market odds');
    expect(inst.effect).not.toMatch(/defense/);
    // Score multipliers ×0.96/×1.08 are non-identity — the claim stays.
    const scores = (trace.downstreamEffects || []).find(e => e.target === 'effectiveScores');
    expect(scores).toBeTruthy();
  });
});
