/**
 * The certification soak's reading of the receipt and of population (the chair's rulings I2 and
 * I3 on soak 1000 rung 1, 2026-11-04). I2: the advisory `record_coherence_battery` judgment is
 * never a certification failure (the soak counts it on its own line). I3: the metropolis band
 * is open above 15,000 (X-46 car 1b: the roll's body is not a ceiling).
 */
import { describe, expect, it } from 'vitest';
import { inspectSettlement } from '../../scripts/audit/generation-certification-soak.mjs';

const JUDGMENTS = [
  'hard_structural_validity', 'cross_system_semantic_agreement', 'user_intent_fulfillment',
  'narrative_realization', 'dramatic_tension', 'diversity_and_repetition',
  'confidence_and_provenance', 'record_coherence_battery',
];
const record = (over = {}) => ({
  tier: 'metropolis',
  population: 40000,
  institutions: [],
  npcs: [],
  generationCoherenceReceipt: {
    status: 'pass',
    checks: [],
    judgments: JUDGMENTS.map((id) => ({ id, status: 'pass', evidence: ['e'] })),
  },
  ...over,
});
const codes = (s) => inspectSettlement(s, { settType: s.tier }).map((f) => f.code);

describe('I2 — the advisory battery judgment is not a certification failure', () => {
  it('a record whose only failed judgment is the advisory one gives no receipt finding', () => {
    const s = record();
    s.generationCoherenceReceipt.judgments[7] = { id: 'record_coherence_battery', status: 'needs_review', evidence: ['battery.tier-noun'] };
    expect(codes(s).filter((c) => c.startsWith('receipt_'))).toEqual([]);
  });
  it('a failed formal judgment still fails', () => {
    const s = record();
    s.generationCoherenceReceipt.judgments[1] = { id: 'cross_system_semantic_agreement', status: 'needs_review', evidence: ['x'] };
    expect(codes(s)).toContain('receipt_judgment_failed');
  });
});

describe('I3 — the metropolis band is open above 15,000', () => {
  it('a 130,000-person metropolis is in range', () => {
    expect(codes(record({ population: 14000 }))).toContain('population_out_of_range');
    expect(codes(record({ population: 130000 }))).not.toContain('population_out_of_range'); // anchored: the line above fires the same code on a 14,000 record through the same codes(), so the inspector is live
  });
  it('a 14,000-person "metropolis" is still out of range', () => {
    expect(codes(record({ population: 14000 }))).toContain('population_out_of_range');
  });
});
