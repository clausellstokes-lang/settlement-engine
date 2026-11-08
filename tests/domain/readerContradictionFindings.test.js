/**
 * readerContradictionFindings — the page battery's three two-tab checks (lane RUNG1B-F9,
 * 2026-11-04). Each case is the rendered text shape the soak reads (tab text from
 * scripts/audit/soak-review/renderHarness.mjs), quoted from the base corpus at 64aeda874.
 */
import { describe, expect, it } from 'vitest';

import {
  crimeDeniedAndListedFindings, gradeVsFoodFindings, magicAbsentProseFindings,
} from '../../src/domain/coherence/readerContradictionFindings.js';
import { coherenceBattery } from '../../src/domain/coherence/coherenceBattery.js';
import { variantByVid } from '../helpers/drawnProse.js';

const FAMINE_OVERVIEW = 'Monster Defense Critical\nFood Security Deficit — active famine\nTensions';
const DEFENSE_ADEQUATE = 'Economic Survival\nWeak ▼\nDisasters & Famine\nAdequate ▼\nFood endurance: Under siege the outlying fields are lost.';

describe('grade-vs-food (soak1k-3, Al-karez)', () => {
  it('finds an Adequate disaster grade beside the active-famine band', () => {
    const out = gradeVsFoodFindings({ overview: FAMINE_OVERVIEW, defense: DEFENSE_ADEQUATE });
    expect(out).toHaveLength(1);
    expect(out[0].quote).toBe('Disasters & Famine Adequate ▼');
  });
  it('is silent on a Weak grade, and on a plain Deficit band', () => {
    expect(gradeVsFoodFindings({ overview: FAMINE_OVERVIEW, defense: DEFENSE_ADEQUATE.replace('Adequate ▼', 'Weak ▼') })).toEqual([]);
    expect(gradeVsFoodFindings({ overview: 'Food Security Deficit\n', defense: DEFENSE_ADEQUATE })).toEqual([]);
  });
});

const ABSENT_MAGIC = 'Magic\nAbsent\nEnvelope\nAvailability absent\nLegality absent\nRoles\nReliance on magic: None\nReliance on magic, as judged at the first survey\n';

describe('magic-absent-prose (soak1k-13, Amarthal)', () => {
  it('finds every DS-DEF-9 false-state variant that presumes magic, under availability absent', () => {
    for (const line of [
      'There is magic at Amarthal and the hamlet does not rest on it. Losing every practitioner here would be a loss and not a collapse.',
      'Nothing structural at Waldgasse depends on arcane work. What the village makes it makes with hands and ground, and would go on making without a practitioner in it.',
      'The city would go on if the arcane went away, more slowly and less comfortably and go on.',
    ]) expect(magicAbsentProseFindings({ magic: ABSENT_MAGIC + line })).toHaveLength(1);
  });
  it('is silent where availability is present, or the line says no one practises', () => {
    expect(magicAbsentProseFindings({ magic: ABSENT_MAGIC.replace('Availability absent', 'Availability rare') + variantByVid({ leaf: 'defense', blockId: 'DS-DEF-9', poolKey: 'magicDependency false', vid: 2, slots: { settlement: 'X' } }) })).toEqual([]);
    expect(magicAbsentProseFindings({ magic: `${ABSENT_MAGIC}No one works magic at Amarthal, and nothing here waits on it.` })).toEqual([]);
  });
});

const DENIAL = 'Innissike\'s books record no gang, guild or racket: what wrongdoing the city has, people do on their own account.';

describe('crime-denied-and-listed (soak1k-28, Innissike)', () => {
  it('finds the denial beside a listed operation, or beside a running criminal chain', () => {
    const listed = `Active criminal operations\nRed Light District\nA criminal operation with a hold on part of the place or its trade.\n${DENIAL}`;
    expect(crimeDeniedAndListedFindings({ defense: listed })).toHaveLength(1);
    const chained = crimeDeniedAndListedFindings({ defense: DENIAL, economics: 'Criminal supply chains\nSlave trade · Operational\n' });
    expect(chained).toHaveLength(1);
    expect(chained[0].detail).toContain('Slave trade · Operational');
  });
  it('is silent on the denial alone, and beside an impaired chain', () => {
    expect(crimeDeniedAndListedFindings({ defense: DENIAL })).toEqual([]);
    expect(crimeDeniedAndListedFindings({ defense: DENIAL, economics: 'Criminal supply chains\nSlave trade · Impaired\n' })).toEqual([]);
  });
});

describe('the page battery carries the three, once each, on their own surface', () => {
  it('reports each check once, and only when asked', () => {
    const surfaces = {
      overview: FAMINE_OVERVIEW,
      defense: `${DEFENSE_ADEQUATE}\nActive criminal operations\nRed Light District\n${DENIAL}`,
      magic: `${ABSENT_MAGIC}There is magic at Amarthal and the hamlet does not rest on it.`,
    };
    const settlement = { name: 'Fixture', tier: 'town' };
    const only = ['grade-vs-food', 'magic-absent-prose', 'crime-denied-and-listed'];
    const out = coherenceBattery(settlement, surfaces, { only });
    expect(out.map((f) => [f.check, f.surface])).toEqual([
      ['grade-vs-food', 'defense'], ['magic-absent-prose', 'magic'], ['crime-denied-and-listed', 'defense'],
    ]);
    expect(coherenceBattery(settlement, surfaces, { only: ['tier-noun'] }).some((f) => only.includes(f.check))).toBe(false);
  });
});
