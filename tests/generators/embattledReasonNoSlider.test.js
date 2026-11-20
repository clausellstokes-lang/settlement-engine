/**
 * R3-CODE-C (ROUND-3-CUT #325 and #468, MED): the Defense tab's warning printed the configuration slider's value,
 * "Embattled region: Military priority is 38/100. …" (rr2s-village-monster_pressure-rand-1; 29/100 in
 * rr2s-town-under_siege-rand-1). The owner's rule: the page shows the ratings, never the machinery. Writer:
 * src/generators/structuralValidator.js :: checkStructuralValidity, the plagued-threat funding branch; both of its
 * reasons now say what the underfunding means and no figure.
 */
import { describe, expect, it } from 'vitest';
import { checkStructuralValidity } from '../../src/generators/structuralValidator.js';

const ROSTER = [{ name: 'Town walls' }, { name: 'Town militia' }];
const reasonAt = (priorityMilitary) => checkStructuralValidity(ROSTER, { tier: 'town', monsterThreat: 'plagued', priorityMilitary })
  .violations.find((v) => v.type === 'survival_crisis')?.reason;

describe('the embattled-region warning never prints the military slider (ROUND-3-CUT #325, #468)', () => {
  it('at priorities 12, 29 and 38: a reason in plain words, with no slider name or figure', () => {
    for (const p of [12, 29, 38]) {
      const reason = String(reasonAt(p));
      expect(reason, `priority ${p}`).toMatch(/^Embattled region\. /);
      expect(reason.match(/priority|\/100|\d/gi), `priority ${p}`).toBeNull(); // the reason is present (the line above), and holds no figure
    }
  });

  it('the two bands keep their own sense', () => {
    expect(reasonAt(12)).toContain('This settlement will fall.');
    expect(reasonAt(38)).toContain('Fortification and forces are present but chronically underfunded');
    expect(reasonAt(60)).toBeUndefined();
  });
});

// R3-CODE-C-2, the chair's ruling on REVIEW-R3-STAGES C11 (MED, 36 cities and metropolises of 1,536 births, e.g.
// r2s-politically_fractured-metropolis-2): "A beleaguered outpost surviving on the edge." is a size word; it is
// said in a thorp to a town (true there, by the reader) and left out of a city or a metropolis.
describe('"outpost" is said only of a place small enough to be one', () => {
  const reasonFor = (tier) => checkStructuralValidity(ROSTER, { tier, monsterThreat: 'plagued', priorityMilitary: 38 })
    .violations.find((v) => v.type === 'survival_crisis')?.reason;
  it('thorp to town keep the clause; city and metropolis read the warning without it', () => {
    const OUTPOST = 'A beleaguered outpost surviving on the edge.';
    for (const tier of ['thorp', 'hamlet', 'village', 'town']) expect(reasonFor(tier), tier).toContain(OUTPOST);
    const large = ['city', 'metropolis'].map((tier) => reasonFor(tier));
    expect(large).toEqual([
      'Embattled region. Fortification and forces are present but chronically underfunded: poor equipment, low morale, and thin reinforcement.',
      'Embattled region. Fortification and forces are present but chronically underfunded: poor equipment, low morale, and thin reinforcement.',
    ]);
  });
});
