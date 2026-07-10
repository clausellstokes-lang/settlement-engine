/**
 * tests/domain/fidelityNoise.test.js — Phase 4 W-F4b, item 2 (the alignment-
 * conditioned fidelity term). Pins:
 *   - the NEUTRALITY THEOREM / acceptance test: chaosPull is EXACTLY 0 (⇒ factor
 *     EXACTLY 1, no rng forked) for no-piety, lawful, and neutral patrons — so every
 *     existing fixture is byte-identical;
 *   - superlinear growth toward chaos + the hard error cap;
 *   - WAR 2a: resolveSiegeVerdict classifies on the TRUE inputs at attackerFidelity 0
 *     (byte-identical) and on a NOISY estimate at high fidelity (a refused matchup can
 *     be mis-classified plausible — the owner's "fights refused wars"), deterministically;
 *   - DEVELOPMENT 2b: evaluateTierResourceDynamics is byte-identical without an rng and
 *     for a deity-free / lawful settlement WITH an rng, and its value ranking actually
 *     VARIES tick-to-tick for a chaotic-devout economy (the noise is live).
 */
import { describe, expect, test } from 'vitest';

import {
  chaosPullOf,
  fidelityFactor,
  fidelityErrorMagnitude,
  FIDELITY_TUNING,
} from '../../src/domain/worldPulse/fidelityNoise.js';
import { resolveSiegeVerdict } from '../../src/domain/worldPulse/warDeployment.js';
import { evaluateTierResourceDynamics } from '../../src/domain/worldPulse/tierResourceDynamics.js';
import { createPRNG } from '../../src/kernel/prng.js';

const pietyRec = (localMult = 1.6, megaphoneLaw = 1) => ({ localMult, dampener: { megaphoneLaw } });

describe('the neutrality theorem (acceptance test) — zero noise ⇒ byte-identical', () => {
  test('chaosPullOf is 0 for no-piety, lawful, and neutral patrons', () => {
    expect(chaosPullOf({ config: {} })).toBe(0);                                                   // deity-free
    expect(chaosPullOf({ config: { primaryDeitySnapshot: { lawAxis: 'chaotic' } } })).toBe(0);     // chaotic but NO piety record
    expect(chaosPullOf({ config: { primaryDeitySnapshot: { lawAxis: 'lawful' }, faithProfile: { piety: pietyRec() } } })).toBe(0);
    expect(chaosPullOf({ config: { primaryDeitySnapshot: { lawAxis: 'neutral' }, faithProfile: { piety: pietyRec() } } })).toBe(0);
  });

  test('chaosPullOf is positive only for a chaotic patron WITH a piety record', () => {
    const cp = chaosPullOf({ config: { primaryDeitySnapshot: { lawAxis: 'chaotic' }, faithProfile: { piety: pietyRec(1.6, 1) } } });
    expect(cp).toBeGreaterThan(0);
    expect(cp).toBeLessThanOrEqual(FIDELITY_TUNING.CHAOS_PULL_MAX);
  });

  test('the fidelity factor is EXACTLY 1 at chaosPull 0 (no rng consumed)', () => {
    const rng = createPRNG('x');
    expect(fidelityFactor({ rng, site: 'war_initiation', tick: 1, cid: 'a', decisionKey: 'own', chaosPull: 0 })).toBe(1);
    expect(fidelityFactor({ rng: null, site: 'development', tick: 1, cid: 'a', decisionKey: 'k', chaosPull: 1.5 })).toBe(1);
  });
});

describe('superlinear margin of error + cap', () => {
  test('error grows SUPERLINEARLY toward chaos and is capped at MAX_ERROR', () => {
    const e05 = fidelityErrorMagnitude(0.5);
    const e10 = fidelityErrorMagnitude(1.0);
    const e15 = fidelityErrorMagnitude(1.5);
    expect(e10).toBeGreaterThan(e05);
    expect(e15).toBeGreaterThan(e10);
    // superlinear: doubling the pull more than doubles the ratio's gradient
    expect(e10 / e05).toBeGreaterThan(2);
    expect(fidelityErrorMagnitude(FIDELITY_TUNING.CHAOS_PULL_MAX)).toBeLessThanOrEqual(FIDELITY_TUNING.MAX_ERROR);
  });

  test('determinism — the same decision key yields the same factor', () => {
    const a = fidelityFactor({ rng: createPRNG('s'), site: 'war_initiation', tick: 3, cid: 'a', decisionKey: 'foe:b', chaosPull: 1.4 });
    const b = fidelityFactor({ rng: createPRNG('s'), site: 'war_initiation', tick: 3, cid: 'a', decisionKey: 'foe:b', chaosPull: 1.4 });
    expect(a).toBe(b);
  });
});

// ── WAR 2a — resolveSiegeVerdict classify-input perturbation ────────────────────
describe('war fidelity (2a) — chaotic besiegers misjudge the matchup', () => {
  // A solo attacker below the plausible floor (ratio ≈ 0.565 ⇒ require_coalition, no roll).
  const capacityFor = (id) => (String(id) === 'def'
    ? { offensive: 60, homeDefense: 60, facets: { materiel: 20 } }
    : { offensive: 40, homeDefense: 40, facets: { materiel: 20 } });
  const effectiveStrengthFor = () => null;
  const defenderItem = { settlement: { powerStructure: { publicLegitimacy: { score: 85 } }, activeConditions: [] } };
  const verdictAt = (tick, attackerFidelity) => resolveSiegeVerdict({
    targetId: 'def', besiegers: ['atk'], capacityFor, effectiveStrengthFor, defenderItem,
    rng: createPRNG(`siege::${tick}`), tick, attackerFidelity,
  }).verdict;

  test('attackerFidelity 0 ⇒ TRUE-input classification (byte-identical: always require_coalition, no roll)', () => {
    for (let t = 0; t < 12; t++) {
      expect(verdictAt(t, 0)).toBe('require_coalition');
      // Omitting the param defaults to 0 ⇒ identical.
      const omitted = resolveSiegeVerdict({ targetId: 'def', besiegers: ['atk'], capacityFor, effectiveStrengthFor, defenderItem, rng: createPRNG(`siege::${t}`), tick: t });
      expect(omitted.verdict).toBe('require_coalition');
    }
  });

  test('a high-fidelity (chaotic-devout) besieger can mis-classify a refused matchup as plausible', () => {
    let plausibleTicks = 0;
    for (let t = 0; t < 40; t++) if (verdictAt(t, 1.6) === 'plausible') plausibleTicks += 1;
    expect(plausibleTicks).toBeGreaterThan(0);   // it sometimes "fights a refused war"
    // deterministic — same seed+tick+fidelity ⇒ same verdict
    expect(verdictAt(5, 1.6)).toBe(verdictAt(5, 1.6));
  });
});

// ── DEVELOPMENT 2b — tierResourceDynamics value-ranking perturbation ────────────
describe('development fidelity (2b) — chaotic economies mis-rank value chains', () => {
  const pressureIdx = { get: () => ({ score: 0 }) };
  const item = (patron, piety) => ({
    id: 's', name: 'S',
    system: { resourcePressure: { value: 44 } },   // pressureScore 0.44 — just below the city depletion floor (0.45)
    settlement: {
      tier: 'city', nearbyResources: ['iron_ore'],
      economicState: { primaryExports: [], primaryImports: [] },
      config: {
        ...(patron ? { primaryDeitySnapshot: patron } : {}),
        ...(piety ? { faithProfile: { piety } } : {}),
      },
    },
  });
  const rules = { resourceDriftEnabled: true, tierDriftEnabled: false };
  const depletionAt = (tick, it, rng) => evaluateTierResourceDynamics(
    { tick, simulationRules: rules }, { settlements: [it] }, pressureIdx, { tick, simulationRules: rules, rng },
  ).candidates.some((c) => c.candidateType === 'resource_depletion');

  test('deity-free settlement is byte-identical with rng vs without (chaosPull 0)', () => {
    const it = item(null, null);
    for (let t = 1; t <= 8; t++) {
      const withRng = evaluateTierResourceDynamics({ tick: t, simulationRules: rules }, { settlements: [it] }, pressureIdx, { tick: t, simulationRules: rules, rng: createPRNG(`d::${t}`) });
      const noRng = evaluateTierResourceDynamics({ tick: t, simulationRules: rules }, { settlements: [it] }, pressureIdx, { tick: t, simulationRules: rules });
      expect(JSON.stringify(withRng.candidates)).toBe(JSON.stringify(noRng.candidates));
    }
  });

  test('a LAWFUL-patron economy has a CONSTANT ranking; a CHAOTIC-devout one VARIES tick-to-tick', () => {
    const lawful = item({ lawAxis: 'lawful' }, pietyRec());
    const chaotic = item({ lawAxis: 'chaotic' }, pietyRec());
    const lawfulHits = [];
    const chaoticHits = [];
    for (let t = 1; t <= 24; t++) {
      lawfulHits.push(depletionAt(t, lawful, createPRNG(`d::${t}`)));
      chaoticHits.push(depletionAt(t, chaotic, createPRNG(`d::${t}`)));
    }
    // Lawful: no noise ⇒ every tick identical (all false at pressure 0.44 < floor).
    expect(new Set(lawfulHits).size).toBe(1);
    // Chaotic-devout: the noisy estimate crosses the floor on SOME ticks, not others.
    expect(new Set(chaoticHits).size).toBe(2);
  });
});
