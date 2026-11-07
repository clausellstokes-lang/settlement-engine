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
    // The deficit acknowledgement above proves lines[0] is the live isolated-founding
    // sentence, so this exclusion measures wording rather than an empty line.
    // anchored: lines[0] is pinned live by the 'cannot fully feed itself' assertion
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

// #10 (STYLE-RULINGS §1, W5 HIS 2026-11-07): A RECORD DEFECT, not a wording. A port route with no
// docks or wharf institution on the roster printed "A port. The wharves are the reason the place
// exists" over a mountain thorp with no docks. The port reason now reads whether a docks/wharf
// institution exists (`hasDocks`, from the roster's port-infrastructure flag); with none, the arm
// its terrain gives prints (riverside -> the river arm, else the road arm).
describe('#10 — the port reason is gated on a docks or wharf institution', () => {
  const PORT_WORDS = /\bport\b|wharve?s?\b|harbou?r|seaport|quay|berths?\b|hulls?\b|tide/i;
  it('a port route WITHOUT docks prints no port reason', () => {
    for (const terrainType of [null, 'mountains', 'coastal', 'plains']) {
      const [reason] = generateSettlementReason('thorp', 'port', null, { hasDocks: false, terrainType });
      expect(reason, `terrain ${terrainType}`).not.toMatch(PORT_WORDS);
    }
  });
  it('a riverside port route without docks takes the river reason', () => {
    const [reason] = generateSettlementReason('village', 'port', null, { hasDocks: false, terrainType: 'riverside' });
    expect(reason).toMatch(/river/i);
    expect(reason).not.toMatch(PORT_WORDS);
  });
  it('a port route WITH docks keeps its port reason, and a caller that does not say keeps it too', () => {
    expect(generateSettlementReason('town', 'port', null, { hasDocks: true })[0]).toMatch(PORT_WORDS);
    expect(generateSettlementReason('town', 'port', null, {})[0]).toMatch(PORT_WORDS);
  });
});

