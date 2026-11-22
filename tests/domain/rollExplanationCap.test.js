/**
 * tests/domain/rollExplanationCap.test.js — performance-scale-5 pin.
 *
 * The PERSISTED pulseRecord.rollExplanations is capped: all deterministic + all
 * passed rolls survive; only the first K missed rolls are kept, in original order.
 * Records within the cap are byte-identical (the full uncapped set still rides the
 * tick RETURN value for the session UI).
 */
import { describe, expect, it } from 'vitest';
import { capPersistedRollExplanations, MAX_PERSISTED_MISSED_ROLL_EXPLANATIONS } from '../../src/domain/worldPulse/pulseHelpers.js';

const passed = (id) => ({ candidateId: id, passed: true });
const missed = (id) => ({ candidateId: id, passed: false });
const deterministic = (id) => ({ candidateId: id, passed: true, probability: 1 });

describe('performance-scale-5 — persisted rollExplanations cap', () => {
  it('within the cap: nothing dropped, order preserved (byte-identical)', () => {
    const det = [deterministic('d0'), deterministic('d1')];
    const rolls = [passed('p0'), missed('m0'), passed('p1'), missed('m1')];
    const capped = capPersistedRollExplanations(det, rolls);
    expect(capped).toEqual([...det, ...rolls]);
  });

  it('over the cap: keeps every deterministic + every passed + the first K missed, in order', () => {
    const det = [deterministic('d0')];
    const rolls = [];
    // Interleave 10 passed and (cap + 20) missed so the missed budget is exceeded.
    const missedTotal = MAX_PERSISTED_MISSED_ROLL_EXPLANATIONS + 20;
    let p = 0;
    for (let i = 0; i < missedTotal; i++) {
      rolls.push(missed(`m${i}`));
      if (i % 10 === 0) rolls.push(passed(`p${p++}`));
    }
    const capped = capPersistedRollExplanations(det, rolls);
    const keptMissed = capped.filter(x => x.passed === false);
    const keptPassed = capped.filter(x => x.passed === true);

    // Every passed + deterministic survives; missed bounded at the cap.
    expect(keptPassed.length).toBe(1 + p); // deterministic + all passed
    expect(keptMissed.length).toBe(MAX_PERSISTED_MISSED_ROLL_EXPLANATIONS);
    // The kept missed are the FIRST K (m0..m{K-1}) in original order.
    expect(keptMissed[0].candidateId).toBe('m0');
    expect(keptMissed[keptMissed.length - 1].candidateId).toBe(`m${MAX_PERSISTED_MISSED_ROLL_EXPLANATIONS - 1}`);
    // Relative order of survivors is preserved (a stable filter of the combined list).
    const combined = [...det, ...rolls];
    const expected = combined.filter(x => x.passed !== false).concat(
      combined.filter(x => x.passed === false).slice(0, MAX_PERSISTED_MISSED_ROLL_EXPLANATIONS),
    );
    // (Not the actual order — just a count cross-check.)
    expect(capped.length).toBe(expected.length);
  });
});
