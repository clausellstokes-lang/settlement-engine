/**
 * boughtHallNames.test.js — C1B (point 117; the tenth chair's RULING-R24 R24r item 4, "ONE HOME"): the bought hall's three
 * birth names live in ONE exported frozen table in the data layer (`src/data/boughtHallNames.js`), each with the old name it
 * replaces; the three readers that knew the names by exact name (`factionArchetypes.js`, `factionCategories.js`,
 * `seat/seatTable.js`) and the world pulse's guild read it, and their private sets are gone; each reader reads a birth name as
 * it reads the old name the table pairs it with. (The birth's own rename, `rulingStructure.js :: generatePowerStructure`'s
 * return, keeps its literal map: that module stands at its 800-line ceiling, `tests/generators/powerStructure.test.js`.)
 *
 * RED FIRST (7ad51595aa): the module did not exist; the three readers each held a private set.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import { BOUGHT_HALL_NAMES, boughtHallOldName, boughtHallOldNameOfCriminalRow, boughtHallOldNameOfRow, isUserAuthoredPower } from '../../src/data/boughtHallNames.js';
import { factionArchetype } from '../../src/domain/factionArchetypes.js';
import { inferFactionCategory } from '../../src/generators/power/factionCategories.js';
import { formKindOf, pairLicense } from '../../src/domain/seat/seatTable.js';

describe('the one home', () => {
  test('three rows, frozen, each a birth name and the old name it replaces', () => {
    expect(BOUGHT_HALL_NAMES.map((h) => [h.oldName, h.birthName])).toEqual([
      ['Corrupt Council', 'Council of Aldermen'], ['Corrupt City Council', 'Council of Syndics'], ['Shadow Senate', 'Senate'],
    ]);
    expect(Object.isFrozen(BOUGHT_HALL_NAMES) && BOUGHT_HALL_NAMES.every((h) => Object.isFrozen(h))).toBe(true);
  });
  test('the exact name only: trimmed, case and suffix kept', () => {
    expect([boughtHallOldName('Senate'), boughtHallOldName(' Senate '), boughtHallOldName('senate'), boughtHallOldName('Senate Ascendant'), boughtHallOldName(null)])
      .toEqual(['Shadow Senate', 'Shadow Senate', null, null, null]);
    expect([boughtHallOldNameOfRow({ faction: 'Senate', name: 'X' }), boughtHallOldNameOfRow({ name: 'Council of Syndics' }), boughtHallOldNameOfRow({ faction: 'X', name: 'Senate' })])
      .toEqual(['Shadow Senate', 'Corrupt City Council', null]);
    expect(boughtHallOldNameOfRow({ faction: 'Senate', createdByEventId: 'e' })).toBe(null);
    // RULING C1B-2 (1): a row's own category is the truth; the pulse's reading is strict
    expect([boughtHallOldNameOfRow({ faction: 'Senate', category: 'government' }), boughtHallOldNameOfRow({ faction: 'Senate', category: ' Criminal ' }), boughtHallOldNameOfRow({ faction: 'Senate', category: '' })])
      .toEqual([null, 'Shadow Senate', 'Shadow Senate']);
    expect([boughtHallOldNameOfCriminalRow({ faction: 'Senate' }), boughtHallOldNameOfCriminalRow({ faction: 'Senate', category: 'criminal' }), boughtHallOldNameOfCriminalRow(null)])
      .toEqual([null, 'Shadow Senate', null]);
    expect([isUserAuthoredPower({ createdByEventId: 'e' }), isUserAuthoredPower({ _authored: true }), isUserAuthoredPower({}), isUserAuthoredPower(null)]).toEqual([true, false, false, false]);
  });
  test('the three readers and the guild import it; their private sets are gone', () => {
    for (const file of ['src/domain/factionArchetypes.js', 'src/generators/power/factionCategories.js', 'src/domain/seat/seatTable.js', 'src/domain/worldPulse/thievesGuild.js']) {
      const src = readFileSync(file, 'utf8');
      expect(src, file).toMatch(/from '(?:\.\.\/)+data\/boughtHallNames\.js'/);
      expect(src.match(/'Council of Aldermen'|'Council of Syndics'|CRIMINAL_BIRTH_NAMES|CRIMINAL_BY_NAME|BIRTH_NAMED_FORMS/g), file).toBe(null); // ('Senate' alone is a keyword of factionCategories' own lists)
    }
  });
});

describe('each reader reads a birth name as it read the old name', () => {
  for (const { birthName, oldName } of BOUGHT_HALL_NAMES) {
    test(`${birthName} <- ${oldName}`, () => {
      expect(factionArchetype(birthName)).toBe(factionArchetype(oldName));
      expect(inferFactionCategory(birthName)).toBe(inferFactionCategory(oldName));
      expect(formKindOf(birthName)).toBe(formKindOf(oldName));
      expect(formKindOf(`${birthName} Ascendant`)).toBe(formKindOf(`${oldName} Ascendant`));
      expect(pairLicense(String(formKindOf(oldName)), birthName)).toEqual(pairLicense(String(formKindOf(oldName)), oldName));
    });
  }
});
