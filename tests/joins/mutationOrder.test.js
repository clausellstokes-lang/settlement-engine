/**
 * mutationOrder.test.js — A+ generators.8 (golden-lock the mutation sequence).
 *
 * P1.7 made each step's data-flow contract explicit (provides/mutates/scratch)
 * and runPipeline strict mode enforces it. This test FREEZES the resulting
 * behavior so a future refactor can't quietly reorder the institution mutators
 * or repurpose a scratch key while the property checks stay green:
 *   - the institution producer/mutator chain runs in exactly the canonical order;
 *   - structuralValidationPass runs AFTER factionCorrelationPass (the Wave-4b
 *     invariant, previously only a code comment);
 *   - each scratch key is written by its declaring step and is present in ctx
 *     from that step onward;
 *   - the same seed yields a byte-identical per-step roster fingerprint sequence.
 *
 * It is the regression net + executable spec for the whole P1.7 hardening.
 */
import { describe, it, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { getStepOrder, getStepMeta } from '../../src/generators/pipeline.js';
import { withCustomContent } from '../../src/lib/dependencyEngine.js';

// The canonical institution producer→mutator chain. assembleInstitutions builds
// the roster; the rest mutate it in place, each declaring mutates:['institutions'].
const CANONICAL_INSTITUTION_CHAIN = [
  'assembleInstitutions',
  'subsumptionPass',
  'cascadePass',
  'isolationPass',
  'factionCorrelationPass',
];

// Scratch keys → the step that declares (and writes) them.
const SCRATCH_OWNERS = {
  _subsumed: 'subsumptionPass',
  _rosterChangedAfterEconomy: 'factionCorrelationPass',
};

const CONFIG = { settType: 'city', culture: 'germanic', terrain: 'river', tradeRouteAccess: 'road', monsterThreat: 'frontier' };
const rosterFingerprint = (insts) => (insts || []).map((i) => `${i.name}#${i.source || '?'}`).join('|');

function runWithTrace(seed) {
  const order = [];
  const rosterAt = {};
  const scratchFirstSeen = {};
  const onStep = (name, ctx) => {
    order.push(name);
    rosterAt[name] = rosterFingerprint(ctx.institutions);
    for (const k of Object.keys(SCRATCH_OWNERS)) {
      if (k in ctx && !(k in scratchFirstSeen)) scratchFirstSeen[k] = name;
    }
  };
  withCustomContent({}, () => generateSettlementPipeline(CONFIG, null, { seed, customContent: {}, onStep }));
  return { order, rosterAt, scratchFirstSeen };
}

describe('institution mutation sequence is golden-locked (A+ generators.8)', () => {
  it('the declared institution producer/mutator chain matches the canonical order', () => {
    const meta = getStepMeta();
    const order = getStepOrder();
    const touchesInstitutions = (m) => m.provides.includes('institutions') || m.mutates.includes('institutions');
    const chain = order.filter((name) => {
      const m = meta.find((x) => x.name === name);
      return m && touchesInstitutions(m);
    });
    expect(chain).toEqual(CANONICAL_INSTITUTION_CHAIN);
  });

  it('structuralValidationPass runs after factionCorrelationPass (Wave-4b invariant)', () => {
    const order = getStepOrder();
    expect(order.indexOf('structuralValidationPass'))
      .toBeGreaterThan(order.indexOf('factionCorrelationPass'));
  });

  it('each scratch key is owned by its declaring step (meta) and first appears there (runtime)', () => {
    const meta = getStepMeta();
    for (const [key, owner] of Object.entries(SCRATCH_OWNERS)) {
      const declarer = meta.find((m) => m.scratch.includes(key));
      expect(declarer?.name, `${key} must be declared in scratch by ${owner}`).toBe(owner);
    }
    const { scratchFirstSeen } = runWithTrace('mutorder-scratch');
    expect(scratchFirstSeen).toEqual(SCRATCH_OWNERS);
  });

  it('the per-step roster fingerprint sequence is deterministic for a fixed seed', () => {
    const a = runWithTrace('mutorder-determinism');
    const b = runWithTrace('mutorder-determinism');
    expect(a.order).toEqual(b.order);
    expect(a.rosterAt).toEqual(b.rosterAt);
    // A roster-mutating step must actually run in the recorded order — sanity
    // that the chain steps all executed.
    for (const step of CANONICAL_INSTITUTION_CHAIN) {
      expect(a.order).toContain(step);
    }
  });

  it('roster mutations only ever occur at chain steps (no undeclared mutator)', () => {
    const { order, rosterAt } = runWithTrace('mutorder-fence');
    let prev = null;
    for (const name of order) {
      if (rosterAt[name] === undefined) continue;
      if (prev !== null && rosterAt[name] !== prev) {
        // The roster changed at this step — it must be a declared chain member.
        expect(CANONICAL_INSTITUTION_CHAIN, `step "${name}" mutated the roster but is not a declared institution mutator`)
          .toContain(name);
      }
      prev = rosterAt[name];
    }
  });
});
