/**
 * RUNG-2 LANDING phase D, R-D2: the soak battery's A-06 reader reads the case its phrase list
 * missed — DS-DEF-4's denial ("No criminal infrastructure has been identified at …", its two
 * sister variants, or the tab's static no-organised-crime line) printed on the Defense tab under
 * the block's own "Active crime patterns" (soak1k-1801: religious fraud, informant networks). The
 * network-phrase arm reads as before. The survival-crime pattern's own text ("No criminal
 * infrastructure: …") is a pattern, not the denial, and is not read as one.
 */
import { describe, expect, it } from 'vitest';
import { crimeAbsentAndOrganised } from '../../scripts/audit/soak-review/checks.mjs';

const SOAK1K_1801 = [
  'Criminal Architecture & Public Order ▲',
  'Suspicious — religious upheaval',
  'Active crime patterns',
  'religious fraud',
  'False conversion declarations sold or arranged for a fee. Forged certification of compliance.',
  'informant networks',
  'Enforcement authorities paying for information about non-compliant households.',
  'No criminal infrastructure has been identified at Tarkhanbulag. Whatever wrongdoing the hamlet has does not run through anything that could be called an organization.',
  'Armed Forces & Fortifications ▲',
].join('\n');

describe('A-06 reads the denial beside the block\'s own crime patterns', () => {
  it('soak1k-1801\'s planted Defense text is a finding', () => {
    expect(crimeAbsentAndOrganised(SOAK1K_1801, SOAK1K_1801)).toMatch(/crime patterns/);
  });

  it('each sister variant and the static line beside listed patterns is a finding', () => {
    for (const denial of [
      'What goes wrong at Tarkhanbulag goes wrong one thing at a time and belongs to whoever did it.',
      'A stranger asking after the arrangements at Tarkhanbulag is met with genuine incomprehension, which is either the truth or an unusually good performance of it.',
      'No organized criminal infrastructure detected. Crime exists at a petty, individual level.',
    ]) {
      const defense = `Active crime patterns\nreligious fraud\nFalse declarations.\n${denial}`;
      expect(crimeAbsentAndOrganised(defense, defense)).not.toBeNull();
    }
  });

  it('the denial with no patterns listed, and a survival pattern without the denial, are not findings', () => {
    const denialOnly = 'Criminal Architecture & Public Order ▲\nNo criminal infrastructure has been identified at Ford. Whatever wrongdoing the town has does not run through anything that could be called an organization.';
    expect(crimeAbsentAndOrganised(denialOnly, denialOnly)).toBeNull();
    const survival = 'Active crime patterns\nSurvival crime\nTheft driven by economic desperation rather than organization. No criminal infrastructure: the desperate steal alone.';
    expect(crimeAbsentAndOrganised(survival, survival)).toBeNull();
  });

  it('the network-phrase arm reads as before', () => {
    const screen = 'No criminal infrastructure has been identified at Ford.\nRevenue funds the criminal network.';
    expect(crimeAbsentAndOrganised(screen, '')).toMatch(/organised network/);
    expect(crimeAbsentAndOrganised('Revenue funds the criminal network.', '')).toBeNull();
  });
});
