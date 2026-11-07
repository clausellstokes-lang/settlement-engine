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

  // "(no note)" -> "(each original noted 'kept')" at 28c6d2a80 (census-1g unit 2, R-AM: "the kept-refused
  // original is ledgered" — resolveSibling with no facts now notes the original it keeps, with its row's atoms,
  // so the birth self-check sees it). Measured: this arm green at 28c6d2a80^ (c000dd932), red at 28c6d2a80.
  // The record is still the one before the door: no facts means no resolution, only a 'kept' note per lookup.
  it('no facts handed: the same record as before (each original noted kept, R-AM)', () => {
    const { result, ledger } = withPresumptionLedger(() => transferRulingPower(settlement(), 'The Faithful Assembly', { cause: 'election' }));
    expect(result.error).toBeNull();
    const notes = ledger.filter((e) => String(e.pool).startsWith('rulingPower:'));
    expect(notes.map((e) => e.pool).sort()).toEqual(['rulingPower:GOVERNMENT_DESCS', 'rulingPower:STABILITY_BY_CAUSE']);
    expect(notes.every((e) => e.resolvedBy === 'kept')).toBe(true);
  });
});
