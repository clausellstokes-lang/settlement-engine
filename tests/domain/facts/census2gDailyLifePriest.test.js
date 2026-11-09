/**
 * CENSUS-2g unit 3 — the chair's answer 3 (block j, R-AS amended's message of 07:5x): "Priests" in
 * DAILY_LIFE_TAB paragraph [1] declares `priest` (the roster's priest atom: a senior cleric stands
 * among the named people), carried through `textOf` until the Daily Life site is wired (R-C); no
 * reword. The ledger's `priest / faith presence` stop is cleared in the same commit.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { declaredLiteralsOf } from './census2dTables.test.js';
import { declarationOf, declarationAdmits } from '../../../src/domain/facts/factVocabulary.js';

const ledger = JSON.parse(readFileSync(new URL('../../../docs/census/declarations/DAILY_LIFE_TAB.json', import.meta.url), 'utf8'));
const ledgerLine = (id) => ledger.pools.flatMap((p) => p.lines).find((l) => l.lineId === id);

describe('DAILY_LIFE_TAB paragraph [1] — the priests declare `priest` (carried)', () => {
  const found = declaredLiteralsOf('src/components/new/tabs/DailyLifeTab.jsx');
  const p1 = [...found.entries()].find(([k]) => k.startsWith('${food}. Everyone knows their work')); // re-keyed by cause: STYLE-2 SW-4 (A7)

  it('the cell declares guardPresence and priest, crisis any, and keeps its words', () => {
    expect(p1?.[1]).toEqual([{ needs: ['guardPresence', 'priest'], excludes: [], crisis: ['any'] }]);
    expect(p1?.[0]).toContain('Farmers, haulers, priests, guards, and tradespeople');
  });

  it('the ledger carries the same atoms and no longer parks the priests', () => {
    const line = ledgerLine('DAILY_LIFE_TAB.localNarrative.paragraph[1]');
    expect(line.needs).toEqual(['guardPresence', 'priest']);
    expect(line.stop.some((s) => /priest/.test(s))).toBe(false);
  });

  it('the declaration is refused where no senior cleric is named and admitted where one is', () => {
    const decl = declarationOf({ needs: ['guardPresence', 'priest'], crisis: ['any'] });
    const base = { guardPresence: true, crisis: { active: [] } };
    expect(declarationAdmits(decl, /** @type {any} */ ({ ...base, faith: { seniorCleric: null } })).admitted).toBe(false);
    expect(declarationAdmits(decl, /** @type {any} */ ({ ...base, faith: { seniorCleric: { name: 'Mother Ysolde' } } })).admitted).toBe(true);
  });
});
