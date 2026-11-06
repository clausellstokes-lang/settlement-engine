/**
 * tests/domain/rulingPowerDoor.test.js — CENSUS-1f unit 3 (Appendix B row 116, T): the transfer
 * of power's two table lookups resolve through `resolveSibling(…, RULING_POWER_SIBLINGS, …)` when
 * the caller hands `opts.facts`; with no twin a refused text keeps its words, and the resolution
 * is noted in the presumption ledger (admitted) so the self-check can read it.
 *
 * @enforced-by npx vitest run tests/domain/rulingPowerDoor.test.js
 */
import { describe, expect, it } from 'vitest';
import { transferRulingPower } from '../../src/domain/rulingPower.js';
import { withPresumptionLedger } from '../../src/domain/facts/presumptionLedger.js';
import { CALM_FACTS_ADMIT_ALL } from '../helpers/calmFactsDouble.js';

const settlement = () => ({
  tier: 'town',
  powerStructure: {
    government: 'Town Council',
    factions: [
      { faction: 'The Governing Council', category: 'government', power: 30, isGoverning: true },
      { faction: 'The Faithful Assembly', category: 'religious', power: 25 },
    ],
  },
});

describe('the ruling-power door (CENSUS-1f, row 116)', () => {
  it('an election handed calm facts notes its stability line in the ledger', () => {
    const { result, ledger } = withPresumptionLedger(() => transferRulingPower(settlement(), 'The Faithful Assembly', { cause: 'election', facts: CALM_FACTS_ADMIT_ALL }));
    expect(result.error).toBeNull();
    expect(ledger.some((e) => e.pool === 'rulingPower:STABILITY_BY_CAUSE')).toBe(true);
  });

  it('no facts handed: the same record as before (no note)', () => {
    const { result, ledger } = withPresumptionLedger(() => transferRulingPower(settlement(), 'The Faithful Assembly', { cause: 'election' }));
    expect(result.error).toBeNull();
    expect(ledger.some((e) => String(e.pool).startsWith('rulingPower:'))).toBe(false);
  });
});
