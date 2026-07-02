/**
 * dataFlowContract.test.js — A+ generators.3.
 *
 * P1.7 declared each step's WRITE set (provides/mutates/scratch) and strict mode
 * enforces it. generators.3 completes the data-flow contract by declaring each
 * step's READ set (the ctx keys it consumes that another step produces) and
 * cross-checking the hand-written run order against it:
 *
 *   - SOUNDNESS / COMPATIBILITY: every declared read is produced by an EARLIER
 *     step in getStepOrder(). So the deps-derived order can no longer drift out
 *     of sync with the real data dependencies — a step scheduled before a
 *     producer of a key it reads fails here (and at runtime under strict mode,
 *     pinned by pipelineContract.test.js).
 *   - NO PHANTOM READS: every declared read key is produced by SOME step.
 *   - The contract stays populated (guards against the reads decls silently emptying).
 *
 * SCOPE NOTE (why the run order is still derived from deps, not replaced by a
 * computed data-flow order): `economicState` is produced TWICE — generateEconomy
 * provides it, generatePower reads THAT value, then economyReconcilePass
 * re-derives it. A pure data-flow order ("reader after every producer of K")
 * would force generatePower after economyReconcilePass and cycle. Resolving
 * which production each reader consumes needs versioned keys; until then deps
 * remains the authoritative (golden-stable) order, now CROSS-CHECKED by this
 * contract. That is the sound, valuable core of generators.3.
 */
import { describe, it, expect } from 'vitest';
import '../../src/generators/generateSettlementPipeline.js'; // registers all steps
import { getStepOrder, getStepMeta } from '../../src/generators/pipeline.js';

const META = new Map(getStepMeta().map((m) => [m.name, m]));
const ORDER = getStepOrder();

describe('pipeline reads/produces data-flow contract (A+ generators.3)', () => {
  it('every declared read is produced by an EARLIER step (deps order respects the data graph)', () => {
    const producedBefore = (key, idx) => ORDER.slice(0, idx).some((n) => {
      const m = META.get(n);
      return m.provides.includes(key) || m.mutates.includes(key);
    });
    const violations = [];
    ORDER.forEach((name, idx) => {
      for (const k of META.get(name).reads) {
        if (!producedBefore(k, idx)) {
          violations.push(`${name} reads "${k}" but no earlier step provides/mutates it`);
        }
      }
    });
    expect(violations).toEqual([]);
  });

  it('every declared read key is produced by SOME step (no phantom reads)', () => {
    const produced = new Set();
    for (const m of META.values()) {
      m.provides.forEach((k) => produced.add(k));
      m.mutates.forEach((k) => produced.add(k));
    }
    const phantom = [];
    for (const m of META.values()) {
      for (const k of m.reads) if (!produced.has(k)) phantom.push(`${m.name}:${k}`);
    }
    expect(phantom).toEqual([]);
  });

  it('the reads contract is populated for every data-consuming step (not silently empty)', () => {
    // resolveConfig is the lone pure-source step (consumes only initial config);
    // every other step declares >=1 read. A drift that empties the decls fails here.
    const withReads = ORDER.filter((n) => META.get(n).reads.length > 0);
    expect(withReads.length).toBe(ORDER.length - 1);
    expect(META.get('resolveConfig').reads).toEqual([]);
  });

  it('a step that reads-and-reprovides a key (re-derivation) has an earlier first producer', () => {
    // isolationPass reads `stress` then re-provides it with the subsistence
    // famine merged into the container (so the famine is a real stressor, not
    // a stressTypes-only ghost); stressConfirmPass reads `stress` then
    // re-provides a confirmed `stress`; economyReconcilePass reads
    // `economicState` then re-provides a re-derived one. That read∩provides
    // overlap is a legitimate re-derivation — but it must still have an
    // EARLIER producer (covered by the soundness test). Pin the known
    // re-derivers so the pattern is documented, not accidental.
    const rederivers = ORDER.filter((n) => {
      const m = META.get(n);
      return m.reads.some((k) => m.provides.includes(k));
    });
    expect(rederivers.sort()).toEqual(['economyReconcilePass', 'isolationPass', 'stressConfirmPass']);
  });
});
