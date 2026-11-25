/**
 * boughtHallReaders.test.js — C1B (point 117; the tenth chair's RULING-R24 R24r items 3 and 4; the second reader's
 * SECOND-READER-117.txt items 3 and 4): the bought hall's three birth names ("Council of Aldermen", "Council of Syndics",
 * "Senate") carry the meaning their old names ("Corrupt Council", "Corrupt City Council", "Shadow Senate") carried by their
 * words, in every reader that took it from the words, and read with the number of their head noun.
 *
 * RED FIRST (7ad51595aa): "Council of Syndics" read plural (its LAST word); an object row named "Senate" with no category read
 * `other`; the world pulse's guild floored and capped "Shadow Senate" but left "Senate" untouched.
 *
 *   (1) NUMBER: a name "X of Y" takes its number from X (`pluralPowerName`).
 *   (3) THE OBJECT ROW: `factionArchetype` reads the exact birth name off a row's name (in `rulingPower.nameOf`'s precedence)
 *       as its bare-string branch does; a recognised category still wins.
 *   (4) ADVANCE TIME UNCHANGED: `applyGuildToSettlement` treats a new metropolis's hall exactly as the old one.
 *   (5) NEVER A USER'S OWN ROW: a row the record marks as the user's (ADD_FACTION's `createdByEventId`; custom content's own
 *       marks) is never read by its exact name; the old words still read as they always did.
 */
import { describe, expect, test } from 'vitest';
import { pluralPowerName, powerVerb } from '../../src/data/people/powerSentenceName.js';
import { factionArchetype, FACTION_ARCHETYPES as A } from '../../src/domain/factionArchetypes.js';
import { ownKindOf } from '../../src/domain/seat/seatTable.js';
import { applyGuildToSettlement } from '../../src/domain/worldPulse/thievesGuild.js';

const HALLS = /** @type {const} */ ([['Council of Aldermen', 'Corrupt Council'], ['Council of Syndics', 'Corrupt City Council'], ['Senate', 'Shadow Senate']]);

describe('(1) NUMBER: a name "X of Y" takes its number from X', () => {
  test.each([
    ['Council of Aldermen', false], ['Council of Syndics', false], ['Senate', false],
    ['Religious Authorities', true], ['Noble Houses', true], ['Merchant Guilds', true], ['Elder Council', false],
    ['Third Bloc (Neutrals)', true], ['Knights of the Rose', true],
  ])('pluralPowerName(%j) is %j', (name, plural) => {
    expect(pluralPowerName(name)).toBe(plural);
  });
  test('the second reader\'s sentence: "The Council of Syndics is playing the outbreak down"', () => {
    expect(`The Council of Syndics ${powerVerb('Council of Syndics', 'is', 'are')} playing the outbreak down`).toBe('The Council of Syndics is playing the outbreak down');
  });
});

describe('(3) THE OBJECT ROW: the exact birth name is read off the row, as the string branch reads it', () => {
  for (const [born, old] of HALLS) {
    test(`${born}: a row with no category reads as "${old}" read, by .faction and by .name; ownKindOf follows`, () => {
      expect(factionArchetype({ faction: born })).toBe(factionArchetype({ faction: old }));
      expect(factionArchetype({ name: born })).toBe(factionArchetype({ name: old }));
      expect(factionArchetype({ faction: ` ${born} ` })).toBe(factionArchetype(born));
      expect(ownKindOf({ faction: born })).toBe(ownKindOf({ faction: old }));
    });
  }
  test('"Senate" as a row is criminal, as the bare string is; a recognised category still wins', () => {
    expect([factionArchetype('Senate'), factionArchetype({ faction: 'Senate' }), factionArchetype({ name: 'Senate', faction: '' })]).toEqual([A.CRIMINAL, A.CRIMINAL, A.CRIMINAL]);
    expect(factionArchetype({ faction: 'Senate', category: 'economy' })).toBe(A.MERCHANT);
    expect(factionArchetype({ faction: 'Senate', category: 'criminal' })).toBe(A.CRIMINAL);
    // exact name only: a near name reads by its own words, as before
    expect([factionArchetype({ faction: 'Senate Ascendant' }), factionArchetype({ faction: 'senate' }), factionArchetype({ faction: 'Grand Merchant Senate' })]).toEqual([A.OTHER, A.OTHER, A.MERCHANT]);
  });
});

/** @param {Record<string, unknown>} row */
const metropolis = (row) => ({ powerStructure: { factions: [{ power: 20, legitimacy: 60, ...row }, { faction: 'Merchant Guilds', power: 30, legitimacy: 50 }] } });

describe('(4) ADVANCE TIME UNCHANGED: the guild treats a new metropolis\'s hall as it treated the old one', () => {
  test('a "Senate" row is floored and capped exactly as a "Shadow Senate" row', () => {
    const was = applyGuildToSettlement(metropolis({ faction: 'Shadow Senate', isGoverning: true }), 0.8);
    const now = applyGuildToSettlement(metropolis({ faction: 'Senate', isGoverning: true }), 0.8);
    expect(was.powerStructure.factions[0].power).toBeGreaterThan(20);
    expect(now.powerStructure.factions.map((/** @type {any} */ f) => [f.power, f.legitimacy])).toEqual(was.powerStructure.factions.map((/** @type {any} */ f) => [f.power, f.legitimacy]));
    expect(now.thievesGuildStrength).toBe(was.thievesGuildStrength);
  });
  test('the two council halls were never matched by the guild\'s words, and are not now', () => {
    for (const [born, old] of HALLS.slice(0, 2)) {
      const was = applyGuildToSettlement(metropolis({ faction: old }), 0.8);
      const now = applyGuildToSettlement(metropolis({ faction: born }), 0.8);
      expect([now.powerStructure.factions[0].power, was.powerStructure.factions[0].power]).toEqual([20, 20]);
    }
  });
});

describe('(5) NEVER A USER\'S OWN ROW', () => {
  /** ADD_FACTION's row (`events/mutateEntities.js :: addFaction`), and custom content's marks (`settlementContentProvenance.js`) */
  const OWN = [
    { id: 'faction.senate', name: 'Senate', faction: 'Senate', createdByEventId: 'evt-1', status: 'active' },
    { faction: 'Senate', custom: true }, { faction: 'Senate', isCustom: true }, { faction: 'Senate', source: 'custom' },
    { faction: 'Senate', customDefinitionId: 'def-1' }, { faction: 'Senate', definitionId: 'def-1' },
  ];
  test('a generated row named "Senate" reads criminal; the user\'s own never does', () => {
    expect(factionArchetype({ faction: 'Senate', power: 50 })).toBe(A.CRIMINAL);
    for (const row of OWN) expect(factionArchetype(row)).toBe(A.OTHER);
  });
  test('the guild never floors the user\'s own "Senate"; their own "Shadow Senate" still reads by its word, as before', () => {
    for (const row of OWN) {
      expect(applyGuildToSettlement(metropolis(row), 0.8).powerStructure.factions[0].power).toBe(20);
      expect(applyGuildToSettlement(metropolis({ ...row, faction: 'Shadow Senate', name: 'Shadow Senate' }), 0.8).powerStructure.factions[0].power).toBeGreaterThan(20);
    }
    expect(applyGuildToSettlement(metropolis({ faction: 'Senate' }), 0.8).powerStructure.factions[0].power).toBeGreaterThan(20);
  });
  test('a DM\'s edit of a generated hall (`_authored`, `_userEdits`) is not authorship: the hall keeps its meaning', () => {
    const edited = { faction: 'Senate', _authored: true, _userEdits: { desc: { value: 'x' } } };
    expect(factionArchetype(edited)).toBe(A.CRIMINAL);
    expect(applyGuildToSettlement(metropolis(edited), 0.8).powerStructure.factions[0].power).toBeGreaterThan(20);
  });
});
