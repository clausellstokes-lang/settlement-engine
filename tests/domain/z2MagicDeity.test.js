/**
 * tests/domain/z2MagicDeity.test.js — Z2b: magic legality ⇄ dominant deity.
 *
 * A theocracy regulates magic. A dominant MAJOR deity shifts magic LEGALITY tighter
 * and RELIGIOUS ACCEPTANCE more hostile — a WARLIKE or EVIL major god harder still
 * (it treats arcane power as a rival authority). The gate is the embedded
 * config.primaryDeitySnapshot (the same signal the religion layer activates on), so:
 *
 *   - ABSENT deity ⇒ no term ⇒ the magic profile is BYTE-IDENTICAL to legacy.
 *   - a MINOR god / fringe cult ⇒ no regulation (lacks institutional reach).
 *   - a MAJOR benevolent god ⇒ one notch tighter (a wary orthodoxy).
 *   - a MAJOR warlike/evil god ⇒ open hostility + magic restricted harder.
 *
 * Bounded + deterministic (pure deriver; reads the self-contained snapshot, never
 * customContent).
 */

import { describe, expect, test } from 'vitest';
import { deriveMagicProfile, magicLegalityBands } from '../../src/domain/magicProfile.js';

const LEGALITY = magicLegalityBands(); // absent < forbidden < restricted < regulated < tolerated < celebrated
const tighter = (a, b) => LEGALITY.indexOf(a) < LEGALITY.indexOf(b); // a is MORE restrictive than b

function town({ deity = null, magicLevel = 'medium', factions = [] } = {}) {
  return {
    config: { magicLevel, ...(deity ? { primaryDeitySnapshot: deity } : {}) },
    powerStructure: { factions },
    institutions: [],
  };
}

function deity({ rank = 'major', temper = 'neutral', align = 'neutral', name = 'Test God' } = {}) {
  return { _deityRef: `custom:${name}`, name, alignmentAxis: align, temperamentAxis: temper, rankAxis: rank };
}

describe('Z2b — a dominant major deity regulates magic legality', () => {
  test('a MAJOR deity tightens legality vs no deity (same base)', () => {
    const none = deriveMagicProfile(town());
    const withGod = deriveMagicProfile(town({ deity: deity({ rank: 'major' }) }));
    expect(tighter(withGod.legality, none.legality)).toBe(true);
  });

  test('a WARLIKE major deity tightens HARDER than a neutral major deity', () => {
    const neutralGod = deriveMagicProfile(town({ deity: deity({ rank: 'major', temper: 'neutral' }) }));
    const warlikeGod = deriveMagicProfile(town({ deity: deity({ rank: 'major', temper: 'warlike' }) }));
    expect(tighter(warlikeGod.legality, neutralGod.legality)).toBe(true);
  });

  test('an EVIL major deity also regulates harder (the second step)', () => {
    const neutralGod = deriveMagicProfile(town({ deity: deity({ rank: 'major', align: 'neutral' }) }));
    const evilGod = deriveMagicProfile(town({ deity: deity({ rank: 'major', align: 'evil' }) }));
    expect(tighter(evilGod.legality, neutralGod.legality)).toBe(true);
  });

  test('a MINOR god / fringe CULT does NOT regulate (no institutional reach)', () => {
    const none = deriveMagicProfile(town());
    const minor = deriveMagicProfile(town({ deity: deity({ rank: 'minor', temper: 'warlike' }) }));
    const cult = deriveMagicProfile(town({ deity: deity({ rank: 'cult', align: 'evil' }) }));
    expect(minor.legality).toBe(none.legality);
    expect(cult.legality).toBe(none.legality);
  });
});

describe('Z2b — dominant major deity shifts religious acceptance', () => {
  test('a WARLIKE major deity forces OPEN hostility toward magic', () => {
    const m = deriveMagicProfile(town({ deity: deity({ rank: 'major', temper: 'warlike' }) }));
    expect(m.religiousAcceptance).toBe('hostile');
  });

  test('an EVIL major deity forces OPEN hostility even with strong arcane factions', () => {
    const m = deriveMagicProfile(town({
      deity: deity({ rank: 'major', align: 'evil' }),
      factions: [{ name: 'Mage Conclave', archetype: 'arcane', power: 80 }],
    }));
    // The orthodoxy override beats the faction balance (which alone would read syncretic).
    expect(m.religiousAcceptance).toBe('hostile');
  });

  test('a benevolent MAJOR deity makes the realm wary (not indifferent), short of hostile', () => {
    const m = deriveMagicProfile(town({ deity: deity({ rank: 'major', align: 'good', temper: 'peacelike' }) }));
    expect(m.religiousAcceptance).toBe('wary');
  });
});

describe('Z2b — absent deity ⇒ byte-identical', () => {
  test('a deity-free profile is unchanged (no deity term in legality OR acceptance OR contributors)', () => {
    const baseline = deriveMagicProfile(town({ magicLevel: 'high' }));
    const again = deriveMagicProfile(town({ magicLevel: 'high' }));
    expect(again).toEqual(baseline);
    // No deity contributor leaked into a deity-free profile.
    const deityContrib = baseline.contributors.some(c => /theocratic_regulation/.test(c.effect) || /patron deity|major/i.test(c.reason));
    expect(deityContrib).toBe(false);
  });

  test('a minor/cult deity leaves the acceptance band exactly as the faction balance dictates', () => {
    const factions = [{ name: 'Temple', archetype: 'religious', power: 70 }, { name: 'Mages', archetype: 'arcane', power: 20 }];
    const none = deriveMagicProfile(town({ factions }));
    const cult = deriveMagicProfile(town({ factions, deity: deity({ rank: 'cult', temper: 'warlike' }) }));
    expect(cult.religiousAcceptance).toBe(none.religiousAcceptance);
  });
});
