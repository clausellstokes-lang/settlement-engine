/**
 * CENSUS-2g unit 3 — the chair's answer 3 (block j, R-AS amended's message of 07:5x): "Priests" in
 * DAILY_LIFE_TAB paragraph [1] declares `priest` (the roster's priest atom: a senior cleric stands
 * among the named people), carried through `textOf` until the Daily Life site is wired (R-C); no
 * reword. The ledger's `priest / faith presence` stop is cleared in the same commit.
 *
 * DAILY-3 U4b (the chair's word of 2026-11-22): the two arms that read paragraph [1] itself — "the cell declares
 * guardPresence and priest, crisis any, and keeps its words" and "the ledger carries the same atoms and no longer
 * parks the priests" — LEFT with what they pinned: `buildLocalDailyLifeNarrative` (src/components/new/tabs/
 * DailyLifeTab.jsx) and the ledger row `DAILY_LIFE_TAB.localNarrative.paragraph[1]`, text no page prints since point
 * 95. The arm below stays: it pins the LIVE `priest` atom (factVocabulary.js), not the removed paragraph.
 */
import { describe, it, expect } from 'vitest';
import { declarationOf, declarationAdmits } from '../../../src/domain/facts/factVocabulary.js';

describe('the `priest` atom (born for DAILY_LIFE_TAB paragraph [1], CENSUS-2g unit 3)', () => {
  it('the declaration is refused where no senior cleric is named and admitted where one is', () => {
    const decl = declarationOf({ needs: ['guardPresence', 'priest'], crisis: ['any'] });
    const base = { guardPresence: true, crisis: { active: [] } };
    expect(declarationAdmits(decl, /** @type {any} */ ({ ...base, faith: { seniorCleric: null } })).admitted).toBe(false);
    expect(declarationAdmits(decl, /** @type {any} */ ({ ...base, faith: { seniorCleric: { name: 'Mother Ysolde' } } })).admitted).toBe(true);
  });
});
