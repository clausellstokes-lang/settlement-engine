/**
 * ROUND THREE, ruling (a) — THE HOUSE'S LABEL (the chair, 2026-11-13; ROUND-3-CUT §7 (a), lane
 * round-3-cut-2026-11-13 at 892904c1d). ONE display leaf, `institutionHouseLabel`, strips from a
 * printed house name every bracket the catalogue sorts its rows by: count ranges ("(5-15)",
 * "(100-150+)"), household ranges and floors ("(75-650 households)", "(3500+ households)"), population
 * gates ("(10,000+ only)"), conditions ("(if walled)") and magic gates ("(high magic)"); a count word
 * is carried by a plain plural ("Inn (multiple)" reads "Inns"), never a parenthesis. The in-world
 * qualifiers STAY ("(part-time)", "(established)", "(open cast)", "(guild)", "(district)",
 * "(resident)"). The display-name table's own ranges ("Houses of worship (10-30)") are in scope.
 *
 * The arms read EVERY parenthetical form the catalogue holds (each `name:` row of
 * src/data/institutionalCatalog.js, classed as the cut's catalogue-forms.mjs classes them), so a new
 * machinery form added to the catalogue reds here before it reaches a reader.
 */
import { describe, expect, test } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  institutionDisplayName, institutionHouseLabel, houseLabelsInText,
} from '../../src/domain/display/institutionDisplayName.js';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const CATALOGUE = readFileSync(`${ROOT}src/data/institutionalCatalog.js`, 'utf8');
const NAMES = [...new Set([...CATALOGUE.matchAll(/name:\s*(['"`])((?:(?!\1).)+)\1/g)].map((m) => m[2]))];

/** The cut's classes (catalogue-forms.mjs), split into the machinery the leaf strips and the rest. */
const MACHINERY = (p) => /^\d/.test(p) || /^(multiple|several|many)$/i.test(p) || /^if /i.test(p) || /^high magic$/i.test(p);
const BRACKETS = NAMES.flatMap((n) => [...n.matchAll(/\(([^)]*)\)/g)].map((m) => ({ name: n, inner: m[1].trim() })));

describe('the house label: every parenthetical form the catalogue holds', () => {
  test('the catalogue still holds the forms the ruling names (the arms are not vacuous)', () => {
    const inner = new Set(BRACKETS.map((b) => b.inner));
    for (const f of ['5-15', '100-150+', '75-650 households', '3500+ households', '10,000+ only', 'multiple', 'if walled', 'high magic', 'part-time', 'established', 'open cast', 'guild', 'district', 'resident']) {
      expect(inner.has(f), `the catalogue holds "(${f})"`).toBe(true);
    }
  });

  test('a machinery bracket never survives the label; a count word reads as a plural', () => {
    const machinery = BRACKETS.filter((b) => MACHINERY(b.inner));
    expect(machinery.length).toBeGreaterThan(20);
    for (const { name, inner } of machinery) {
      const label = institutionHouseLabel(name);
      expect(label, name).not.toContain(`(${inner})`);
      expect(label, name).not.toMatch(/\(\s*\d|\(if |\(high magic\)|\(multiple\)/i);
      expect(label.length, name).toBeGreaterThan(2);
    }
    expect(institutionHouseLabel('Inn (multiple)')).toBe('Inns');
  });

  test('an in-world qualifier stays as part of the name', () => {
    const kept = BRACKETS.filter((b) => !MACHINERY(b.inner));
    expect(kept.length).toBeGreaterThan(10);
    for (const { name, inner } of kept) expect(institutionHouseLabel(name), name).toContain(`(${inner})`);
  });

  test("the display-name table's own ranges are read without them", () => {
    for (const raw of ['Parish churches (2-5)', 'Parish churches (10-30)', 'Parish churches (50-100+)']) {
      expect(institutionDisplayName(raw)).toMatch(/\(\d/); // the table keeps its key's range (generators read it)
      expect(institutionHouseLabel(raw)).toBe('Houses of worship');
    }
    expect(institutionHouseLabel('Gates (if walled)')).toBe('Town gates');
    expect(institutionHouseLabel('Housing (3500+ households)')).toBe('Housing');
    expect(institutionHouseLabel('Housing (75-650 households)')).toBe('Housing');
    expect(institutionHouseLabel('Cathedral (10,000+ only)')).toBe('Cathedral');
    expect(institutionHouseLabel('Stormwatch Keep')).toBe('Stormwatch Keep');
  });
});

describe('a stored sentence that names a house reads the label', () => {
  const HOUSES = [{ name: 'Taverns (5-20)' }, { name: 'Town granary' }, { name: 'Mills (2-5)' }, { name: 'Parish churches (2-5)' }, { name: 'Carpenter (part-time)' }];
  test("the Outlook's list (the cut's #472)", () => {
    expect(houseLabelsInText('5 institutions critically impaired by siege: Taverns (5-20), Town granary, Mills, Town watch, Town walls.', HOUSES))
      .toBe('5 institutions critically impaired by siege: Taverns, Town granary, Mills, Town watch, Town walls.');
  });
  test('raw and display spellings both read the label; a qualifier and an unknown name are untouched', () => {
    expect(houseLabelsInText('Mills (2-5) and Houses of worship (2-5) and Parish churches (2-5)', HOUSES)).toBe('Mills and Houses of worship and Houses of worship');
    expect(houseLabelsInText('2 institutions: Carpenter (part-time), Citizen militia.', HOUSES)).toBe('2 institutions: Carpenter (part-time), Citizen militia.');
    expect(houseLabelsInText('Dwellings (1-8) stand empty.', HOUSES)).toBe('Dwellings (1-8) stand empty.');
    expect(houseLabelsInText('', HOUSES)).toBe('');
    expect(houseLabelsInText(undefined, HOUSES)).toBe('');
  });
});
