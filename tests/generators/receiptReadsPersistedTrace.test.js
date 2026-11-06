/**
 * tests/generators/receiptReadsPersistedTrace.test.js — THE RECEIPT READS THE TRACE IT PERSISTED
 * (lane REVIEW-INTAKE-2 unit 6, chair ruling R3, 2026-11-06).
 *
 * The Treglen review: "the final object has a simulation trace, but its receipt does not
 * correctly report that trace as persisted". Measured on the 1,000 soak settlements: the
 * receipt's provenance evidence read "No step trace was persisted" on 1,000 of 1,000 while
 * `simulationTrace` was present. Cause: `steps/assembleSettlement.js` built the receipt BEFORE
 * it copied `ctx.simulationTrace` onto the settlement. The receipt's persisted-trace evidence
 * must equal the presence of the trace on the settlement it is a receipt for.
 */
import { describe, it, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const CASES = Array.from({ length: 20 }, (_, i) => ({ tier: TIERS[i % TIERS.length], seed: `receipt-trace-${i}` }));

/** Every evidence entry of the receipt whose path is `simulationTrace`. */
function traceEvidence(node, out = []) {
  if (Array.isArray(node)) { for (const item of node) traceEvidence(item, out); return out; }
  if (!node || typeof node !== 'object') return out;
  if (node.path === 'simulationTrace' && typeof node.detail === 'string') out.push(node);
  for (const value of Object.values(node)) traceEvidence(value, out);
  return out;
}

describe('the generation receipt reads the trace the settlement carries', () => {
  it('on 20 seeds, the receipt says a trace is persisted exactly when the settlement carries one', () => {
    let withTrace = 0;
    const failures = collectSeedFailures(CASES.map((c) => `${c.tier}|${c.seed}`), (key) => {
      const [tier, seed] = key.split('|');
      const s = generateSettlementPipeline({ settType: tier }, null, { seed, customContent: {} });
      const present = Array.isArray(s.simulationTrace) && s.simulationTrace.length > 0;
      if (present) withTrace += 1;
      const evidence = traceEvidence(s.generationCoherenceReceipt);
      expect(evidence, `${key}: the receipt states the trace once`).toHaveLength(1);
      const saysPersisted = !/No step trace was persisted/.test(evidence[0].detail);
      expect(saysPersisted, `${key}: receipt "${evidence[0].detail}" vs trace present=${present}`).toBe(present);
    });
    expectNoSeedFailures(failures, 'the receipt reads the trace it persisted');
    // Liveness: the corpus really carries traces, so the arm judged the persisted case.
    expect(withTrace).toBeGreaterThan(0);
  });
});
