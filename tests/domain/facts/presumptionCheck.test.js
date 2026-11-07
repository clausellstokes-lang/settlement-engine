/**
 * tests/domain/facts/presumptionCheck.test.js — CENSUS-1b wave 1 item 4: THE RUNTIME SELF-CHECK
 * (`cert:false-presumption`; `docs/DESIGN_POOL_CENSUS.md` §3.4).
 *
 * @enforced-by npx vitest run tests/domain/facts/presumptionCheck.test.js
 */
import { describe, expect, it } from 'vitest';
import { presumptionFindings, declaredShare } from '../../../src/domain/facts/presumptionCheck.js';
import { drawDeclared } from '../../../src/domain/facts/drawDeclared.js';
import { factsOf } from '../../../src/domain/facts/factsOf.js';
import { withPresumptionLedger } from '../../../src/domain/facts/presumptionLedger.js';

describe('the self-check re-asserts every drawn atom against the FINAL record', () => {
  it('a late write (walls fall after the draw) is a false presumption, named', () => {
    const record = { tier: 'town', institutions: [{ name: 'Town walls', category: 'Defense' }] };
    const pool = [{ text: 'Behind its walls, merchants shelter.', needs: ['walls'] }];
    const { ledger } = withPresumptionLedger(() => drawDeclared(pool, { draw: (p) => p[0], facts: factsOf(record), poolId: 'P', surface: 'overview' }));
    expect(presumptionFindings(record, ledger)).toEqual([]);
    record.institutions[0].status = 'ruined'; // the late write
    expect(presumptionFindings(record, ledger)).toEqual([{ code: 'false-presumption', pool: 'P', lineId: 0, atom: 'walls', answer: 'false' }]);
  });

  it('undeclared lines assert nothing; declared-share counts both, by surface', () => {
    const { ledger } = withPresumptionLedger(() => {
      drawDeclared(['a', 'b'], { draw: (p) => p[0], poolId: 'U', surface: 'npcs' });
      drawDeclared([{ text: 'x', excludes: ['walls'] }], { draw: (p) => p[0], facts: factsOf({ institutions: [] }), poolId: 'D', surface: 'npcs' });
    });
    expect(presumptionFindings({ institutions: [] }, ledger)).toEqual([]);
    expect(declaredShare(ledger)).toEqual({ npcs: { drawn: 2, declared: 1 } });
  });
});
