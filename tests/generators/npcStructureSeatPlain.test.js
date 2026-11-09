/**
 * tests/generators/npcStructureSeatPlain.test.js — SW-6 CRISIS-SURFACES (STYLE-RULINGS-2 B10(b); STYLE-2-SURFACES
 * §7·F F1/F2): the seat-holders' structural position and constraint print in plain words. The fractured seat's
 * card read "Holds nominal governing authority where the legitimacy of that position is in active question.
 * Formal title and real decision-making power are not the same thing." (soak1k-0, soak1k-2) — machinery and a
 * coda. Every government condition, both ranks, is read here.
 */
import { describe, expect, it } from 'vitest';
import { enrichNPCsWithStructure } from '../../src/generators/npcStructure.js';

const MACHINERY = /legitimacy|institutional|governance|governing|structur|faction|civic|rather than|Formal title|contingent|consolidat|accountab|capacity/i;
const head = () => ({ name: 'Oswin Hale', role: 'Mayor', category: 'government', memberships: [{ power: 'Council', rank: 1, share: 1 }], goal: { short: 'g', long: 'g' } });
const clerk = () => ({ name: 'Ada Venn', role: 'Clerk', category: 'government', memberships: [{ power: 'Council', rank: 3, share: 1 }], goal: { short: 'h', long: 'h' } });
const place = ({ legitimacy = {}, capture = 'none', food = '', prosperity = 'Comfortable' } = {}) => ({
  tier: 'town', stress: [], institutions: [],
  powerStructure: { factions: [{ faction: 'Council', category: 'government', power: 60, isGoverning: true }], publicLegitimacy: legitimacy, criminalCaptureState: capture },
  economicState: { prosperity, foodSecurity: { label: food } },
});
const CONDITIONS = {
  governance_fractured: place({ legitimacy: { governanceFractured: true } }),
  corruption: place({ capture: 'corrupted' }),
  food_crisis: place({ food: 'Famine' }),
  economic_stress: place({ prosperity: 'Struggling' }),
  contested: place({ legitimacy: { isContested: true } }),
  stable: place(),
};

describe('the seat-holders in plain words', () => {
  for (const [condition, s] of Object.entries(CONDITIONS)) {
    it(`${condition}: neither rank prints the machinery or the coda`, () => {
      const out = enrichNPCsWithStructure([head(), clerk(), clerk()], s);
      const enriched = out.filter((n) => n.structuralPosition);
      expect(enriched.length).toBeGreaterThan(0);
      for (const n of enriched) {
        expect(n.settlementCondition).toBe(condition);
        expect(`${n.structuralPosition} ${n.activeConstraint}`).not.toMatch(MACHINERY);
      }
    });
  }
});
