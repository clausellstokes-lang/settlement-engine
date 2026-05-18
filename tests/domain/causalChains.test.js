/**
 * tests/domain/causalChains.test.js — End-to-end causal chain assertions.
 *
 * The Tier 2 trace layer is only as valuable as the causal claims it
 * lets us verify. These tests generate real settlements through the
 * pipeline and assert that the traces emitted reflect the configured
 * pressures.
 *
 * Today only the `assembleInstitutions` step emits traces, so the
 * assertions here are scoped to institution selection. As more steps
 * adopt trace recording, this file is the natural home for tests like
 * "plague trace propagates to healing-capacity downstream" or "cut
 * trade route reduces merchant faction power".
 *
 * Pattern:
 *   1. Generate a settlement with a config that forces a specific
 *      pressure (e.g. nearbyResources: ['fishing_grounds']).
 *   2. Pull the traces via the public API (no private state).
 *   3. Assert a specific cause / target / downstream shows up.
 *
 * Property-style assertions (over N seeds) live in distribution.test.js;
 * this file is for single-settlement claim verification.
 */

import { describe, it, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import {
  getTraces, tracesByStep, tracesByType, tracesCausedBy, tracesAffecting,
} from '../../src/domain/trace.js';

const STABLE_SEED = 'sf-causal-test-2026-05-18';

function gen(config) {
  return generateSettlementPipeline(config, null, { seed: STABLE_SEED, customContent: {} });
}

describe('trace surface: every generated settlement carries traces', () => {
  it('produces at least one institution trace for a village-sized settlement', () => {
    const s = gen({ settType: 'village', culture: 'germanic' });
    const instTraces = tracesByType(s, 'institution');
    expect(instTraces.length).toBeGreaterThan(0);
  });

  it('institution traces all reference the assembleInstitutions step', () => {
    const s = gen({ settType: 'town', culture: 'germanic' });
    const instTraces = tracesByType(s, 'institution');
    for (const t of instTraces) {
      expect(t.step).toBe('assembleInstitutions');
    }
  });

  it('every institution trace has a non-empty targetId', () => {
    const s = gen({ settType: 'town', culture: 'germanic' });
    for (const t of tracesByType(s, 'institution')) {
      expect(typeof t.targetId).toBe('string');
      expect(t.targetId).toMatch(/^institution\./);
    }
  });

  it('every institution trace has at least one cause', () => {
    const s = gen({ settType: 'town', culture: 'germanic' });
    for (const t of tracesByType(s, 'institution')) {
      expect(Array.isArray(t.causes)).toBe(true);
      expect(t.causes.length).toBeGreaterThan(0);
      for (const c of t.causes) {
        expect(typeof c.source).toBe('string');
        expect(c.source.length).toBeGreaterThan(0);
      }
    }
  });
});

describe('trace surface: tracesByStep matches the pipeline step name', () => {
  it('returns the same traces as filtering tracesByType for institution', () => {
    const s = gen({ settType: 'town', culture: 'germanic' });
    const byStep = tracesByStep(s, 'assembleInstitutions');
    const byType = tracesByType(s, 'institution');
    // Today every assembleInstitutions trace is an institution trace.
    expect(byStep.length).toBe(byType.length);
  });
});

describe('causal chain: required institutions emit a required-result trace', () => {
  it('thorp settlements emit at least one trace with result=required', () => {
    // Thorp tier has several required institutions in the catalog.
    const s = gen({ settType: 'thorp', culture: 'germanic' });
    const required = tracesByType(s, 'institution').filter(t => t.result === 'required');
    expect(required.length).toBeGreaterThan(0);
    // Required traces should cite the tier as their cause.
    for (const t of required) {
      const tierCause = t.causes.find(c => c.source === 'tier.thorp');
      expect(tierCause).toBeTruthy();
    }
  });
});

describe('causal chain: probabilistic institutions cite their selection odds', () => {
  it('selected (not required) traces include a baseChance cause', () => {
    const s = gen({ settType: 'town', culture: 'germanic' });
    const selected = tracesByType(s, 'institution').filter(t => t.result === 'selected');
    if (selected.length === 0) {
      // Highly unlikely with town tier — but guard so the test doesn't
      // spuriously fail on a strange seed.
      return;
    }
    for (const t of selected) {
      const chanceCause = t.causes.find(c => c.source === 'baseChance');
      expect(chanceCause, `${t.targetId} missing baseChance cause`).toBeTruthy();
      expect(chanceCause.effect).toMatch(/likelihood/);
    }
  });
});

describe('causal chain: resource pressure shows up in cause receipts', () => {
  it('nearby fishing_grounds appear in cause receipts when resources lift selection odds', () => {
    const s = gen({
      settType: 'village',
      culture: 'norse',
      terrain: 'coastal',
      tradeRouteAccess: 'port',
      nearbyResources: ['fishing_grounds'],
    });

    const instTraces = tracesByType(s, 'institution');
    // Look for any selected trace that cites nearbyResources as a cause.
    const resourceCited = instTraces.some(t =>
      Array.isArray(t.causes) && t.causes.some(c => c.source === 'nearbyResources')
    );
    // Fishing grounds boost several institutions (fisher's landing, fish
    // market, fishmonger); we expect at least one to have been lifted
    // enough that the resource cause appears.
    expect(resourceCited).toBe(true);
  });
});

describe('downstream effects: tag-driven downstream system propagation', () => {
  it('selected institutions with security/law/order tags declare publicOrder downstream', () => {
    // Force a town so we have a high chance of getting an enforcement
    // institution. We don't care which one.
    const s = gen({ settType: 'town', culture: 'germanic' });
    const downstreamHits = tracesAffecting(s, 'publicOrder');
    expect(downstreamHits.length).toBeGreaterThan(0);
  });
});

describe('reverse causality: tracesCausedBy works on real settlements', () => {
  it('finds every trace where baseChance was the deciding factor', () => {
    const s = gen({ settType: 'town', culture: 'germanic' });
    const causedByChance = tracesCausedBy(s, 'baseChance');
    // Every selected (probabilistic) institution trace lists baseChance
    // as a cause.
    const selectedCount = tracesByType(s, 'institution')
      .filter(t => t.result === 'selected').length;
    expect(causedByChance.length).toBe(selectedCount);
  });
});

describe('trace integrity: traces survive the canonical-shape adapter', () => {
  it('a generated settlement carries traces on settlement.simulationTrace', () => {
    const s = gen({ settType: 'town', culture: 'germanic' });
    expect(Array.isArray(s.simulationTrace)).toBe(true);
    expect(s.simulationTrace.length).toBeGreaterThan(0);
    // And the public getTraces returns the same list.
    expect(getTraces(s).length).toBe(s.simulationTrace.length);
  });

  it('traces are well-formed (every entry has targetType + targetId + step + result)', () => {
    const s = gen({ settType: 'village', culture: 'germanic' });
    for (const t of getTraces(s)) {
      expect(typeof t.targetType).toBe('string');
      expect(typeof t.targetId).toBe('string');
      expect(typeof t.step).toBe('string');
      expect(typeof t.result).toBe('string');
      expect(typeof t.ts).toBe('number');
    }
  });
});
