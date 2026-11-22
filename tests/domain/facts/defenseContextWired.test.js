/**
 * CENSUS-1e unit 2 (Appendix B item 23, T): `dailyLifeLogic.js :: extractSettlementContext` reads
 * its DEFENSE_CONTEXT cell through `resolveDeclared`, noted in the ledger (surface daily_life). The
 * cells declare nothing yet (their declarations and twins are the table owner's, R-G), so the text
 * is byte-identical; an unknown readiness reads null as before. RE-KEYED BY CAUSE (CENSUS-2e unit 2):
 * the cells now declare the ledger's atoms, so the noted entry carries the Undefended cell's.
 */
import { describe, expect, it } from 'vitest';
import { extractSettlementContext } from '../../../src/components/new/dailyLifeLogic.js';
import { withPresumptionLedger } from '../../../src/domain/facts/presumptionLedger.js';

describe('dailyLifeLogic DEFENSE_CONTEXT through the one rule (CENSUS-1e unit 2)', () => {
  it('the cell prints unchanged and is noted', () => {
    const { result, ledger } = withPresumptionLedger(() => extractSettlementContext({ tier: 'town', defenseProfile: { readiness: { label: 'Undefended' } } }));
    expect(result.defenseCtx).toMatch(/^There are no walls, no garrison/);
    expect(ledger.filter((e) => e.pool === 'dailyLife:DEFENSE_CONTEXT.Undefended')).toEqual([expect.objectContaining({ drawKind: 'T', atoms: ['no walls', 'no garrison', 'no watch', 'no gate', 'crisis: any'], resolvedBy: 'drawn' })]);
  });

  it('an unknown readiness reads null and notes nothing', () => {
    const { ledger } = withPresumptionLedger(() => extractSettlementContext({ tier: 'town', defenseProfile: {} }));
    expect(ledger.filter((e) => String(e.pool).startsWith('dailyLife:DEFENSE_CONTEXT'))).toEqual([]);
  });
});
