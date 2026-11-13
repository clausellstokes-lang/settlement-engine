/**
 * The page measured by vocabulary (W2-B-DECLARE item 2; the chair's record 288, ruling 3): the walker's own
 * matcher over every visible sentence of a rendered dossier, against the town's leaves. Every side of every
 * kind of registered word is EXECUTED here on a planted record and planted views: a thing the town lacks, a
 * state not in force, a size it is not, a count it does not hold, and a denial of a state in force; and the
 * same sentences printed where they are true are not findings.
 */
import { describe, expect, test } from 'vitest';

import { vocabularyPageFindings } from '../../../src/domain/coherence/vocabularyPageFindings.js';
import { NEW_WORDS, REGISTERED_WORDS, THINGS } from '../../../src/domain/facts/registeredWords.js';
import { parseAtom } from '../../../src/domain/facts/factVocabulary.js';

const thorp = { tier: 'thorp', population: 40, config: {}, stress: [], institutions: [{ name: 'Chapel' }], powerStructure: { factions: [{ faction: 'A' }, { faction: 'B' }] } };
const city = {
  tier: 'city', population: 20000, config: {}, stress: [{ type: 'under_siege' }, { type: 'famine' }],
  institutions: [{ name: 'Chapel' }, { name: 'Parish church' }, { name: 'Granary' }],
  powerStructure: { factions: [{ faction: 'A' }, { faction: 'B' }, { faction: 'C' }] },
};
const views = {
  'Systems/Defense': [
    'Food endurance: under siege the outlying fields are lost; the granary holds.',
    'The ruling three of Ashford meet each spring at the hall.',
    'Smoke rises from the poorest quarters of the place at dusk.',
    'The town has no militia and no watch of its own at all.',
    'Two chapels serve the faithful of the whole valley here.',
    'The harvest came in well, with no famine in sight this year.',
  ],
  'World/Faith': ['[STYLE] .a { the granary holds under siege }', 'Short line.'],
};
const shape = (fs) => fs.map((f) => `${f.view} :: ${f.word} :: ${f.side}`);

describe('vocabularyPageFindings', () => {
  test('planted: a small calm place — the siege it is not under, the granary it lacks, the three powers and the quarters it has not, the two chapels it does not hold', () => {
    expect(shape(vocabularyPageFindings(thorp, views))).toEqual([
      'Systems/Defense :: siege :: names',
      'Systems/Defense :: granary :: names',
      'Systems/Defense :: powersCount :: names',
      'Systems/Defense :: quarters :: names',
      'Systems/Defense :: housesCount :: names',
    ]);
  });

  test('planted: the same sentences in a besieged, starving city that holds them are not findings; its denied famine is', () => {
    expect(shape(vocabularyPageFindings(city, views))).toEqual(['Systems/Defense :: famine :: denies']);
  });

  test('a style element and a short line are never read; a negated thing is never a finding', () => {
    const only = { 'World/Faith': views['World/Faith'], 'Systems/Power': ['The town has no militia and no watch of its own at all.'] };
    expect(vocabularyPageFindings(thorp, only)).toEqual([]);
  });

  test('every registered word carries a layer, a leaf or atoms, and its atoms are the vocabulary\'s (a band word by its dimension)', () => {
    const bad = [];
    for (const [id, w] of Object.entries(NEW_WORDS)) {
      if (!w.kind || !w.layer || !w.leaf) bad.push(`${id}: kind, layer and leaf`);
      for (const a of w.atoms) if (!(a.endsWith(':') ? parseAtom(`${a} = ${a === 'population:' ? 'small' : a === 'tier:' ? 'thorp' : 'famine'}`) : parseAtom(a))) bad.push(`${id}: ${a}`);
    }
    expect(bad).toEqual([]);
    expect(Object.keys(REGISTERED_WORDS).length).toBe(Object.keys(THINGS).length + Object.keys(NEW_WORDS).length);
  });
});
