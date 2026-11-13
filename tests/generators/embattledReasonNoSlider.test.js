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
  it.each([[12], [29], [38]])('priority %i: a reason in plain words, with no slider name or figure', (p) => {
    const reason = String(reasonAt(p));
    expect(reason).toMatch(/^Embattled region\. /);
    expect(reason).not.toMatch(/priority|\/100|\d/i);
  });

  it('the two bands keep their own sense', () => {
    expect(reasonAt(12)).toContain('This settlement will fall.');
    expect(reasonAt(38)).toContain('Fortification and forces are present but chronically underfunded');
    expect(reasonAt(60)).toBeUndefined();
  });
});
