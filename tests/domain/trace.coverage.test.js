/**
 * tests/domain/trace.coverage.test.js — Tier 2.1 trace coverage gate.
 *
 * Runs the live pipeline against a few representative configs and
 * asserts that the resulting `settlement.simulationTrace[]` actually
 * carries traces from multiple steps — not just from
 * assembleInstitutions like it used to.
 *
 * The previous trace landscape: 1 of 17 pipeline steps emitted traces.
 * After Tier 2.1 wiring, the following steps emit traces:
 *
 *   - resolveResources          (resource selections + depletion)
 *   - resolveStress             (active stressors + declined intents)
 *   - assembleInstitutions      (selected / required / forced)
 *   - subsumptionPass           (subsumed by greater institutions)
 *   - cascadePass               (cascade additions + airship triggers)
 *   - isolationPass             (teleport infra + subsistence stripping)
 *   - factionCorrelationPass    (faction-pulled adds + arcane strip)
 *   - generateEconomy           (supply chain state)
 *   - generatePower             (faction profiles — Tier 4.1)
 *
 * Each step we expect to fire is asserted by step name. Steps still
 * pending instrumentation (resolveConfig, resolveNeighbour,
 * neighbourFactions, generatePopulation, generateNarratives,
 * assembleSettlement-as-a-producer) are NOT asserted here — adding
 * them later is the natural next pass.
 */

import { describe, test, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { getStepMeta } from '../../src/generators/pipeline.js';
import { getTraces, tracesByStep } from '../../src/domain/trace.js';

const SEED = 'sf-trace-coverage';

function gen(extraConfig = {}) {
  // Options are the THIRD argument (the second is importedNeighbour). This
  // file once passed the options bag second, so the seed was silently
  // discarded and every run generated from Date.now()+Math.random() — the
  // trace assertions flaked on whatever settlement happened to come out.
  // generateSettlementPipeline now throws on that misuse.
  return generateSettlementPipeline({
    settType: 'town',
    culture: 'germanic',
    terrain: 'grassland',
    tradeRouteAccess: 'road',
    monsterThreat: 'frontier',
    magicExists: true,
    ...extraConfig,
  }, null, { seed: SEED, customContent: {} });
}

describe('Tier 2.1 — trace layer is live on the engine', () => {
  test('settlement.simulationTrace is populated on every generation', () => {
    const s = gen();
    const traces = getTraces(s);
    expect(Array.isArray(traces)).toBe(true);
    expect(traces.length).toBeGreaterThan(0);
  });

  test('each trace has the shape promised by domain/trace.js docs', () => {
    const s = gen();
    const sample = getTraces(s).slice(0, 20);
    for (const t of sample) {
      expect(typeof t.targetType).toBe('string');
      expect(typeof t.targetId).toBe('string');
      expect(typeof t.step).toBe('string');
      expect(typeof t.result).toBe('string');
      expect(Array.isArray(t.causes)).toBe(true);
      expect(Array.isArray(t.downstreamEffects)).toBe(true);
      expect(typeof t.ts).toBe('number');
    }
  });
});

describe('Tier 2.1 — every wired pipeline step actually emits traces', () => {
  // We hit a deliberately rich config so as many wired steps as
  // possible fire. A coastal port-tied town generally has resources +
  // a stressor + cascade-triggered chain institutions + a dominant
  // faction archetype.
  const settlement = gen({
    tradeRouteAccess: 'port',
    terrain: 'coastal',
    settType: 'city',
    stressType: 'famine',
  });

  // The set of steps we expect to see at least one trace from. Adding
  // a new step's instrumentation later? Add the step name here and
  // the test will go red until you wire it.
  const REQUIRED_STEPS = [
    'resolveResources',
    'resolveStress',
    'assembleInstitutions',
    // The "deactivation" passes (subsumption / cascade / isolation /
    // stressConfirm / factionCorrelation) only fire traces when something
    // actually happens in them; we don't hard-require those in every config.
    // economyReconcilePass (supply-chain receipts — Wave 4b moved them out
    // of generateEconomy so they describe the final roster) + generatePower
    // are present on every town+.
    'economyReconcilePass',
    'generatePower',
  ];

  for (const stepName of REQUIRED_STEPS) {
    test(`${stepName} emits at least one trace`, () => {
      const stepTraces = tracesByStep(settlement, stepName);
      expect(stepTraces.length).toBeGreaterThan(0);
    });
  }

  test('total trace count is meaningfully large (not just one stub per step)', () => {
    // A town/city should produce dozens of traces — at minimum one per
    // institution selected, one per resource, one per faction, one per
    // stressor. If the total is single-digit, the wiring regressed.
    const total = getTraces(settlement).length;
    expect(total).toBeGreaterThan(15);
  });

  test('traces cover multiple target types (institution, resource, stressor, faction)', () => {
    const types = new Set(getTraces(settlement).map(t => t.targetType));
    expect(types.has('institution')).toBe(true);
    expect(types.has('resource')).toBe(true);
    // Stressor only fires when a stress activates; for famine config
    // we should see one.
    expect(types.has('stressor')).toBe(true);
    // Faction traces from generatePower (Tier 4.1).
    expect(types.has('faction')).toBe(true);
  });
});

describe('Tier 2.1 — causes + downstream effects are populated', () => {
  test('most institution traces carry at least one cause', () => {
    const s = gen();
    const instTraces = getTraces(s).filter(t => t.targetType === 'institution');
    expect(instTraces.length).toBeGreaterThan(0);
    const withCauses = instTraces.filter(t => Array.isArray(t.causes) && t.causes.length > 0);
    // Allow a few stub traces with no cause (the "required" branch is
    // sometimes terse). 80% threshold catches a real regression
    // without flaking on edge cases.
    expect(withCauses.length / instTraces.length).toBeGreaterThan(0.8);
  });

  test('resource traces explain terrain/route compatibility', () => {
    const s = gen();
    const resTraces = getTraces(s).filter(t => t.targetType === 'resource');
    expect(resTraces.length).toBeGreaterThan(0);
    for (const t of resTraces) {
      const causeSources = (t.causes || []).map(c => c.source);
      // Either terrain.* or terrainCompatibility — the two ways a
      // resource enters resolveResources's trace.
      const hasCompatCause = causeSources.some(s =>
        typeof s === 'string' && (s.startsWith('terrain.') || s === 'terrainCompatibility' || s.startsWith('tier.'))
      );
      expect(hasCompatCause).toBe(true);
    }
  });
});

describe('Tier 2.1 — query helpers work on real traces', () => {
  const s = gen({ tradeRouteAccess: 'port', terrain: 'coastal' });
  const traces = getTraces(s);

  test('tracesByStep returns the right subset', () => {
    const resourceTraces = tracesByStep(s, 'resolveResources');
    expect(resourceTraces.length).toBeGreaterThan(0);
    for (const t of resourceTraces) {
      expect(t.step).toBe('resolveResources');
    }
  });

  test('every trace has step matching one of the registered steps', () => {
    // Derived from the live pipeline registry, not a hand-maintained list —
    // the old hardcoded copy silently drifted (it never learned about
    // corruptionPass), so a legitimate step's traces read as "unregistered".
    // A trace can only fail this test by carrying a step name that truly
    // isn't registered (e.g. a typo at a recordTrace call site).
    const VALID_STEPS = new Set(getStepMeta().map((s) => s.name));
    expect(VALID_STEPS.has('corruptionPass')).toBe(true); // registry sanity: the step that exposed the drift
    for (const t of traces) {
      expect(VALID_STEPS.has(t.step), `unregistered step: ${t.step}`).toBe(true);
    }
  });
});
