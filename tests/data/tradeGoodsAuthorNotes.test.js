/**
 * tests/data/tradeGoodsAuthorNotes.test.js — CENSUS-3b, the chair's ruling of 2026-11-05 (R-A):
 * a parenthetical CONDITION inside a trade row's printed text is a leaked author note, not prose.
 * It becomes a declaration where the vocabulary has the atom; otherwise the row goes to the
 * undeclared register under "needs a field" and the parenthetical leaves the printed text.
 * "Printing services (if technology exists)" presumes a technology level: no record field, no
 * atom (`magic` is not what it means), so the note is removed (docs/CENSUS_3_LANE_2026-11-04.md).
 *
 * @enforced-by npx vitest run tests/data/tradeGoodsAuthorNotes.test.js
 */
import { describe, expect, it } from 'vitest';
import * as T from '../../src/data/tradeGoodsData.js';

/** every string a table holds, with its path */
function strings(v, path, out) {
  if (typeof v === 'string') out.push([path, v]);
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) strings(x, `${path}.${k}`, out);
  return out;
}

describe('no trade row prints an author condition', () => {
  it('no "(if …)" / "(where …)" / "(only …)" parenthetical in any tradeGoodsData text', () => {
    // INSTITUTION_SERVICES is a re-export of institutionServices.js (CENSUS-4's service table; its
    // "(if water mill)" / "(if saw mill)" rows are listed for the chair, not cured here).
    const own = Object.fromEntries(Object.entries(T).filter(([k]) => k !== 'INSTITUTION_SERVICES'));
    const hits = strings(own, 'tradeGoodsData', []).filter(([, s]) => /\((?:if|where|only|when|unless)\b[^)]*\)/i.test(s));
    expect(hits).toEqual([]);
  });
});
