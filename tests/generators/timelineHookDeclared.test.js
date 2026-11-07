/**
 * tests/generators/timelineHookDeclared.test.js — CENSUS-1f unit 3 (Appendix B item 12, R): the
 * timeline hook roll (`historyGenerator.js :: generateEventNarrative`) keeps its rolls and splice,
 * keys the ECHO prefix roll on the drawn row, and resolves the drawn row through `drawDeclared`
 * against CENSUS-3d's declarations on `HISTORICAL_EVENTS_DATA[].plotHooks`. On the merge base
 * these births printed timeline hooks their own record refuses.
 *
 * @enforced-by npx vitest run tests/generators/timelineHookDeclared.test.js
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { HISTORICAL_EVENTS_DATA } from '../../src/data/historyData.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { declarationAdmits, declarationOf } from '../../src/domain/facts/factVocabulary.js';

const ROWS = new Map();
for (const t of HISTORICAL_EVENTS_DATA) for (const r of t.plotHooks || []) if (typeof r === 'object') ROWS.set(r.text, r);
/** The declared row a printed hook (perhaps ECHO-prefixed) came from. */
const rowOf = (hook) => [...ROWS.keys()].find((t) => hook === t || hook.endsWith(t.charAt(0).toLowerCase() + t.slice(1)));
const SEEDS = [16, 17, 19, 28, 31, 32, 33, 35, 39, 46];

describe('the timeline hook roll resolves through drawDeclared (CENSUS-1f unit 3)', () => {
  beforeAll(async () => { await ensureLaws(); });

  it('no timeline hook presumes a fact its record refuses', () => {
    const refused = [];
    for (const i of SEEDS) {
      const s = birth(i).settlement;
      const facts = factsOf(s);
      for (const e of s.history?.historicalEvents || []) {
        for (const h of e.plotHooks || []) {
          const t = rowOf(h);
          if (t && !declarationAdmits(declarationOf(ROWS.get(t)), facts).admitted) refused.push(`soak1k-${i}: ${h}`);
        }
      }
    }
    expect(refused).toEqual([]);
  }, 120_000);
});
