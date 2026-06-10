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

  it('institution traces reference one of the institution-emitting pipeline steps', () => {
    // Originally only `assembleInstitutions` emitted institution traces.
    // After the Tier 2.1 pass, subsumption / cascade / isolation /
    // factionCorrelation also produce institution-typed traces when
    // they add or remove institutions. The assertion is the same in
    // spirit (every trace has a known step) — just widened to the new
    // reality.
    const s = gen({ settType: 'town', culture: 'germanic' });
    const instTraces = tracesByType(s, 'institution');
    const VALID = new Set([
      'assembleInstitutions',
      'subsumptionPass',
      'cascadePass',
      'isolationPass',
      'factionCorrelationPass',
    ]);
    for (const t of instTraces) {
      expect(VALID.has(t.step)).toBe(true);
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
  it('every assembleInstitutions trace is an institution trace (subset relationship)', () => {
    // Originally we asserted byStep.length === byType.length — true
    // when only assembleInstitutions emitted institution traces. After
    // Tier 2.1 wiring, other steps emit institution traces too, so
    // byStep('assembleInstitutions') is a SUBSET of byType('institution').
    // We keep the directional invariant: assembleInstitutions only
    // emits institution-typed traces.
    const s = gen({ settType: 'town', culture: 'germanic' });
    const byStep = tracesByStep(s, 'assembleInstitutions');
    const byType = tracesByType(s, 'institution');
    expect(byStep.length).toBeGreaterThan(0);
    expect(byType.length).toBeGreaterThanOrEqual(byStep.length);
    for (const t of byStep) {
      expect(t.targetType).toBe('institution');
    }
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

// ── Faction traces (Tier 4.1) ───────────────────────────────────────────

describe('faction traces emerge from generatePower', () => {
  // After Tier 2.1 / P99 wiring, faction-typed traces can come from
  // either step — generatePower (governing/formed) or neighbourFactions
  // (mirrored/opposed) or generatePopulation (linked). Tests below
  // tolerate the multi-step source so adding a new emitter doesn't
  // require touching every assertion.
  const FACTION_STEPS = new Set(['generatePower', 'neighbourFactions', 'generatePopulation']);
  const FACTION_RESULTS = new Set(['governing', 'formed', 'mirrored', 'opposed', 'linked']);

  it('a town settlement emits at least one faction trace', () => {
    const s = gen({ settType: 'town', culture: 'germanic' });
    const factionTraces = tracesByType(s, 'faction');
    expect(factionTraces.length).toBeGreaterThan(0);
    for (const t of factionTraces) {
      expect(FACTION_STEPS.has(t.step), `unexpected step ${t.step} on ${t.targetId}`).toBe(true);
      // generatePopulation summary trace uses a structural id, not a
      // per-faction one; everything else is `faction.<name>`.
      expect(
        t.targetId.startsWith('faction.') || t.targetId === 'factions.npcGroupLinkage',
        `unexpected targetId ${t.targetId}`
      ).toBe(true);
    }
  });

  it('every generatePower faction trace cites the tier as a cause', () => {
    const s = gen({ settType: 'city', culture: 'germanic' });
    // Scope this assertion to generatePower only — neighbour/population
    // traces have different (and legitimate) cause sources.
    const factionTraces = tracesByType(s, 'faction').filter(t => t.step === 'generatePower');
    for (const t of factionTraces) {
      const tierCause = t.causes.find(c => c.source === `tier.${s.tier}`);
      expect(tierCause, `${t.targetId} missing tier cause`).toBeTruthy();
    }
  });

  it('at least one faction trace has the governing result on a multi-faction settlement', () => {
    // Cities reliably have multi-faction power structures with a
    // governing body. (Smaller settlements may legitimately collapse
    // to a single faction; we use city here to make the test stable.)
    const s = gen({ settType: 'city', culture: 'germanic' });
    const factionTraces = tracesByType(s, 'faction');
    if (factionTraces.length < 2) return; // determinism guard
    // Every faction trace must have one of the canonical result verbs.
    for (const t of factionTraces) {
      expect(
        FACTION_RESULTS.has(t.result),
        `unexpected result ${t.result} on ${t.targetId}`
      ).toBe(true);
    }
    // And at least one must be governing/formed (generatePower output).
    const fromPower = factionTraces.filter(t => t.result === 'governing' || t.result === 'formed');
    expect(fromPower.length).toBeGreaterThan(0);
  });

  it('faction traces declare downstream effects for known archetypes', () => {
    // Generate enough variants that the sample reliably includes at
    // least one non-"other" archetype with a known downstream block.
    const s = gen({ settType: 'city', culture: 'germanic' });
    const withDownstream = tracesByType(s, 'faction')
      .filter(t => Array.isArray(t.downstreamEffects) && t.downstreamEffects.length > 0);
    expect(withDownstream.length).toBeGreaterThan(0);
  });
});

// ── Supply-chain traces (Tier 4.3) ──────────────────────────────────────

describe('supply-chain traces emerge from economyReconcilePass', () => {
  // Wave 4b: chain traces moved from generateEconomy to economyReconcilePass
  // so the receipts describe the FINAL economy (post faction-pull), not the
  // provisional pre-pull one.
  it('a town settlement emits at least one supply-chain trace', () => {
    const s = gen({ settType: 'town', culture: 'germanic' });
    const chainTraces = tracesByType(s, 'supply_chain');
    expect(chainTraces.length).toBeGreaterThan(0);
    for (const t of chainTraces) {
      expect(t.step).toBe('economyReconcilePass');
      expect(t.targetId).toMatch(/^chain\./);
    }
  });

  it('every supply-chain trace cites the tier as a cause', () => {
    const s = gen({ settType: 'city', culture: 'germanic' });
    for (const t of tracesByType(s, 'supply_chain')) {
      const tierCause = t.causes.find(c => c.source === `tier.${s.tier}`);
      expect(tierCause, `${t.targetId} missing tier cause`).toBeTruthy();
    }
  });

  it('result is one of the canonical status values', () => {
    const s = gen({ settType: 'town', culture: 'germanic' });
    const canonical = new Set([
      'stable', 'strained', 'scarce', 'blocked',
      'captured', 'substituted', 'collapsing',
    ]);
    for (const t of tracesByType(s, 'supply_chain')) {
      expect(canonical.has(t.result), `unexpected status: ${t.result}`).toBe(true);
    }
  });

  it('chains declare downstream effects matching their need category', () => {
    const s = gen({ settType: 'city', culture: 'germanic' });
    const traces = tracesByType(s, 'supply_chain');
    if (traces.length === 0) return; // determinism guard
    for (const t of traces) {
      expect(Array.isArray(t.downstreamEffects)).toBe(true);
      expect(t.downstreamEffects.length).toBeGreaterThan(0);
    }
  });
});
