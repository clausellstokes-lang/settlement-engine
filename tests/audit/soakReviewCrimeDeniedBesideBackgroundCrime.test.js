/**
 * RUNG-2 LANDING phase E, R-E1: the soak's A-06 arm mirrors the display's exemption. The denial
 * under a crime-pattern list whose every row denies organisation in its own text ("Background
 * crime", the no-network "Survival crime") is no finding; beside any other row it still is.
 */
import { describe, expect, it } from 'vitest';
import { crimeAbsentAndOrganised } from '../../scripts/audit/soak-review/checks.mjs';

const HEAD = [
  'Criminal Architecture & Public Order ▲',
  'Volatile — succession crisis',
  'Active crime patterns',
];
const BACKGROUND = ['Background crime', 'Petty theft, minor fraud, and opportunistic violence are persistent. No single dominant organisation: just the steady pressure of too many people with too little, and too few consequences for taking.…'];
const SURVIVAL = ['Survival crime', 'Theft driven by economic desperation rather than organization. No criminal infrastructure: just too many people with too little, doing what they must to survive.'];
const FRAUD = ['religious fraud', 'False conversion declarations sold or arranged for a fee.'];
const DENIAL = 'No criminal infrastructure has been identified at Drumburn. Whatever wrongdoing the village has does not run through anything that could be called an organization.';
const TAIL = 'Armed Forces & Fortifications 1 wall 1 force ▲';
const tab = (...rows) => [...HEAD, ...rows.flat(), DENIAL, TAIL].join('\n');

describe('A-06 mirrors R-E1: patterns that deny organisation are no crime the denial contradicts', () => {
  it('soak1k-362\'s planted Defense text (Background crime alone) is no finding', () => {
    const t = tab(BACKGROUND);
    expect(crimeAbsentAndOrganised(t, t)).toBeNull();
  });

  it('the no-network survival pattern, alone or with Background crime, is no finding', () => {
    for (const t of [tab(SURVIVAL), tab(BACKGROUND, SURVIVAL)]) expect(crimeAbsentAndOrganised(t, t)).toBeNull();
  });

  it('Background crime beside any other pattern is still a finding', () => {
    const t = tab(BACKGROUND, FRAUD);
    expect(crimeAbsentAndOrganised(t, t)).toMatch(/crime patterns/);
  });
});
