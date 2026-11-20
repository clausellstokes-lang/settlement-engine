/**
 * upkeepGuardLines.test.js — COHERENCE-UPKEEP-5, the review's low lines on the guard assessment
 * (`safetyProfile.js :: keptGuardLine`).
 *
 * F5: after the merchant-army lead ("Public law enforcement is largely a formality. The merchant
 * guilds maintain their own mercenary companies: real protection exists, but only for those with
 * the right associations."), the appended "Hired swords back the garrison …" puts the guilds'
 * companies behind the public garrison, which the lead has just said they do not serve. The
 * review counted 5 such births on the 660 and 1 in its 40.
 */
import { describe, expect, test } from 'vitest';
import { keptGuardLine } from '../../src/generators/safetyProfile.js';

const BESIDE = [{ name: 'Mercenary company', category: 'Defense' }, { name: 'Garrison', category: 'Defense' }, { name: 'Merchant guild', category: 'Economy' }];

describe('the guard assessment after the merchant-army lead', () => {
  test('RED-FIRST F5: a merchant army leads, so hired swords do not "back the garrison"', () => {
    // the lead as the safety writer's merchant-army branch prints it (safetyProfile.js, `stress.merchantArmy`)
    const lead = 'Public law enforcement is largely a formality. The merchant guilds maintain their own mercenary companies: real protection exists, but only for those with the right associations.';
    expect(lead, 'anchored: the merchant-army lead').toMatch(/^Public law enforcement is largely a formality\./);
    for (const label of ['Struggling', 'Poor', 'Moderate', 'Comfortable', 'Prosperous', 'Wealthy']) {
      expect(keptGuardLine(lead, BESIDE, label, []), label).toBe(lead);
    }
    // anchored: the same roster under an ordinary lead still gains its sentence
    const ordinary = 'The town guard is reasonably effective.';
    expect(keptGuardLine(ordinary, BESIDE, 'Poor', [])).not.toBe(ordinary);
  });
});
