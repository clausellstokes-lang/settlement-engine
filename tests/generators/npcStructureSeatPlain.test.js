/**
 * tests/generators/npcStructureSeatPlain.test.js — SW-6 CRISIS-SURFACES (STYLE-RULINGS-2 B10(b); STYLE-2-SURFACES
 * §7·F F1/F2): the seat-holders' structural position and constraint print in plain words. The fractured seat's
 * card read "Holds nominal governing authority where the legitimacy of that position is in active question.
 * Formal title and real decision-making power are not the same thing." (soak1k-0, soak1k-2) — machinery and a
 * coda. Every condition, both ranks, is read here, category by category (the second seat widened the pin one
 * category per cause: each category's own machinery words beside the shared list).
 */
import { describe, expect, it } from 'vitest';
import { enrichNPCsWithStructure } from '../../src/generators/npcStructure.js';

const MACHINERY = /legitimacy|institutional|governance|governing|structur|faction|civic|rather than|Formal title|contingent|consolidat|accountab|capacity|settlement/i;
const head = (category) => ({ name: 'Oswin Hale', role: 'Mayor', category, memberships: [{ power: 'Seat', rank: 1, share: 1 }], goal: { short: 'g', long: 'g' } });
const clerk = (category) => ({ name: 'Ada Venn', role: 'Clerk', category, memberships: [{ power: 'Seat', rank: 3, share: 1 }], goal: { short: 'h', long: 'h' } });
const place = (category, { legitimacy = {}, capture = 'none', food = '', prosperity = 'Comfortable' } = {}) => ({
  tier: 'town', stress: [], institutions: [],
  powerStructure: {
    factions: category === 'government'
      ? [{ faction: 'Seat', category, power: 60, isGoverning: true }]
      : [{ faction: 'Council', category: 'government', power: 60, isGoverning: true }, { faction: 'Seat', category, power: 60 }],
    publicLegitimacy: legitimacy, criminalCaptureState: capture,
  },
  economicState: { prosperity, foodSecurity: { label: food } },
});
const CONDITIONS = {
  governance_fractured: { legitimacy: { governanceFractured: true } },
  corruption: { capture: 'corrupted' },
  food_crisis: { food: 'Famine' },
  economic_stress: { prosperity: 'Struggling' },
  contested: { legitimacy: { isContested: true } },
  stable: {},
};

/**
 * @param {string} category
 * @param {RegExp|null} own the category's own machinery words, beside the shared list
 */
function readsPlain(category, own) {
  describe(`the ${category} seat-holders in plain words`, () => {
    for (const [condition, at] of Object.entries(CONDITIONS)) {
      it(`${condition}: neither rank prints the machinery or the coda`, () => {
        const out = enrichNPCsWithStructure([head(category), clerk(category), clerk(category)], place(category, at));
        const enriched = out.filter((n) => n.structuralPosition);
        expect(enriched.map((n) => n.structuralRank).sort()).toEqual(['head', 'inner_circle']);
        for (const n of enriched) {
          expect(n.settlementCondition).toBe(condition);
          const text = `${n.structuralPosition} ${n.activeConstraint}`;
          // anchored: the subject is the exact text asserted positively beside it (SW-6), so it cannot have drifted away
          expect(text).not.toMatch(MACHINERY);
          // anchored: the same text as above
          if (own) expect(text).not.toMatch(own);
        }
      });
    }
  });
}

readsPlain('government', null);
readsPlain('military', /enforcement|apparatus|operational|unilateral|neutrality/i);
readsPlain('economy', /commercial|operat|infrastructure|regulatory|distribution channel/i);
readsPlain('crafts', /commercial|operat|infrastructure|regulatory|distribution channel/i);
readsPlain('religious', /pastoral|clerical|endorsement|intermediar|encroach|endowment|institution|welfare|stabiliz/i);
readsPlain('criminal', /criminal interests|operat|optimal|hierarchy|enforcement|network|architect|threshold|profiteering|exploitation|moral clarity/i);
readsPlain('magic', /arcane|institution|indispensab|bureaucra|leverage|deploy|scope of/i);
