/**
 * tests/generators/settlementReason.test.js — founding-reason deficit honesty.
 *
 * generateSettlementReason seeds the AI grounding pass: when the food ledger
 * records a meaningful deficit (>= 5% of daily need), the isolated/city
 * wording must acknowledge the gap instead of claiming self-sufficiency —
 * otherwise the dossier narrates a granary the math says is empty. Below the
 * 5% threshold (rounding noise) and for legacy callers passing no foodBalance,
 * the old self-sufficient wording stays.
 */
import { describe, it, expect } from 'vitest';
import { generateSettlementReason } from '../../src/generators/narrativeGenerator.js';

describe('generateSettlementReason deficit honesty', () => {
  it('an isolated settlement with a meaningful deficit acknowledges it', () => {
    const lines = generateSettlementReason('village', 'isolated', null, {}, { dailyNeed: 1000, rawDeficit: 200 });
    expect(lines[0]).toMatch(/cannot fully feed itself/);
    expect(lines[0]).not.toMatch(/Self-sufficiency/);
  });

  it('legacy callers (no foodBalance) keep the self-sufficient wording', () => {
    const lines = generateSettlementReason('village', 'isolated', null, {});
    expect(lines[0]).toMatch(/Self-sufficiency is not an aspiration here/);
  });

  it('a sub-5% gap is rounding noise and does not flip the founding narrative', () => {
    const lines = generateSettlementReason('village', 'isolated', null, {}, { dailyNeed: 1000, rawDeficit: 40 });
    expect(lines[0]).toMatch(/Self-sufficiency is not an aspiration here/);
  });

  it('the residual deficit (after imports) also counts as a meaningful gap', () => {
    const lines = generateSettlementReason('village', 'isolated', null, {}, { dailyNeed: 1000, rawDeficit: 0, deficit: 120 });
    expect(lines[0]).toMatch(/cannot fully feed itself/);
  });

  it("the city tier line stops claiming 'produces what it consumes' under deficit", () => {
    const deficit = generateSettlementReason('city', 'road', null, {}, { dailyNeed: 20000, rawDeficit: 4000 });
    expect(deficit[1]).toMatch(/appetites outrun its fields/);
    const fed = generateSettlementReason('city', 'road', null, {}, { dailyNeed: 20000, rawDeficit: 0 });
    expect(fed[1]).toMatch(/produce what it consumes/);
  });
});
