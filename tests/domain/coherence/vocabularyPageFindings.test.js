/**
 * The page measured by vocabulary (W2-B-DECLARE item 2; the chair's record 288, ruling 3): the walker's own
 * matcher over every visible sentence of a rendered dossier, against the town's leaves. Every side of every
 * kind of registered word is EXECUTED here on a planted record and planted views: a thing the town lacks, a
 * state not in force, a size it is not, a count it does not hold, and a denial of a state in force; and the
 * same sentences printed where they are true are not findings.
 */
import { describe, expect, test } from 'vitest';

import { vocabularyPageFindings } from '../../../src/domain/coherence/vocabularyPageFindings.js';
import { NEW_WORDS, REGISTERED_WORDS, THINGS, VOCABULARY_SIZE, declarationImplies } from '../../../src/domain/facts/registeredWords.js';
import { RESOURCE_DATA } from '../../../src/data/resourceData.js';
import { parseAtom } from '../../../src/domain/facts/factVocabulary.js';

const thorp = { tier: 'thorp', population: 40, config: {}, stress: [], institutions: [{ name: 'Chapel' }], powerStructure: { factions: [{ faction: 'A' }, { faction: 'B' }] } };
const city = {
  tier: 'city', population: 20000, config: {}, stress: [{ type: 'under_siege' }, { type: 'famine' }],
  institutions: [{ name: 'Chapel' }, { name: 'Parish church' }, { name: 'Granary' }],
  powerStructure: { factions: [{ faction: 'A', isGoverning: true }, { faction: 'B' }, { faction: 'C' }] },
  npcs: [1, 2, 3].map((rank) => ({ id: `n${rank}`, name: `Face ${rank}`, memberships: [{ power: 'A', rank }] })),
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
      'Systems/Defense :: rulingFaces :: names', // F2: the heading reads the ruler's faces (none here), not the powers
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

/**
 * W2-B-DECLARE second seat, F1 (REVIEW-W2B: "the measure flags 23 of 361"; record 306: "a vocabulary generated from
 * the catalogues"). The registered words are GENERATED: every house of the institution catalogue, every resource of the
 * resource catalogue, the roles, staff and forces, open trade under a siege, a famine written as a risk to come, the
 * size nouns. Each family is planted here where it is false and where it is true. Red at 97daac24b, whose vocabulary
 * listed thirty-two words and none of these.
 */
describe('F1 — the generated vocabulary', () => {
  const hamlet = {
    tier: 'hamlet', population: 40, config: { nearbyResources: ['grain_fields'], nearbyResourcesDepleted: [] },
    stress: [{ type: 'under_siege' }], institutions: [{ name: 'Access to parish church' }, { name: 'Wayside shrine' }],
    powerStructure: { factions: [{ faction: 'Elder Council' }] },
  };
  const town = {
    tier: 'town', population: 3000, config: { nearbyResources: ['iron_deposits'], nearbyResourcesDepleted: [] }, stress: [],
    institutions: [{ name: 'Alchemist shop' }, { name: 'Parish church' }, { name: 'Town watch' }, { name: 'Blacksmiths (3-10)' }],
    powerStructure: { factions: [{ faction: 'Town council' }] },
  };
  const lines = [
    'The magical help here comes from its alchemists, who brew for the defenders.',
    'Funeral rites and burial. The priest manages the graveyard.',
    'The military command has taken charge of the streets, and more harshly as the food runs down.',
    'Carts bring the town what its workshops need, and carry the goods away again.',
    'Iron ore deposits feed the forges here.',
  ];
  const words = (record) => [...new Set(vocabularyPageFindings(record, { 'Systems/Economics': lines }).map((f) => f.word))].sort();

  test('the vocabulary is generated from the catalogues, and its families are counted', () => {
    expect(VOCABULARY_SIZE.houses).toBeGreaterThan(100);
    expect(VOCABULARY_SIZE.resources).toBe(Object.keys(RESOURCE_DATA).length);
    expect(Object.keys(NEW_WORDS).filter((id) => id.startsWith('house: ')).length).toBe(VOCABULARY_SIZE.houses);
    for (const id of ['house: alchemist', "house: mages' guild", 'resource: iron_deposits', 'clergy', 'armedForce', 'openTrade', 'famineToCome', 'streets']) expect(NEW_WORDS[id], id).toBeTruthy();
  });

  test('planted: each family is a finding where the town makes it false, and none where it is true', () => {
    expect(words(hamlet)).toEqual(['armedForce', 'clergy', 'house: alchemist', 'openTrade', 'resource: iron_deposits', 'smith', 'streets']);
    expect(words(town)).toEqual([]);
  });

  test('planted: a famine written as a risk to come is false while a famine is in force', () => {
    const risk = { 'Systems/Economics': ['One bad year for the grain harvest would be a hungry year for everyone here.'] };
    expect(vocabularyPageFindings({ ...town, stress: [{ type: 'famine' }] }, risk).map((f) => f.word)).toEqual(['famineToCome']);
    expect(vocabularyPageFindings(town, risk)).toEqual([]);
  });
});

/**
 * W2-B-DECLARE third seat, F2 (REVIEW-W2B: "pattern 16a uses the wrong leaf … 146 true lines called false"): "The ruling
 * three of {ruler}" heads the ruler's own FACES (`patronage.js :: dmPowerViewOf(...).rulingThree`, the panel's own list),
 * not the number of powers; "three powers" still counts the powers. Red at 83c84a8ed, which read both off the powers.
 */
describe('F2 — the ruling three counts the ruler\'s faces', () => {
  const faces = (n) => Array.from({ length: n }, (_, i) => ({ id: `f${i}`, name: `Face ${i}`, memberships: [{ power: 'Council', rank: i + 1 }] }));
  const one = { tier: 'town', population: 3000, config: {}, stress: [], institutions: [], npcs: faces(3), powerStructure: { factions: [{ faction: 'Council', isGoverning: true }] } };
  const three = { ...one, npcs: faces(2), powerStructure: { factions: [{ faction: 'Council', isGoverning: true }, { faction: 'B' }, { faction: 'C' }] } };
  const page = { 'Systems/Power': ['The ruling three of Council sit in the old hall.', 'Three powers contend for the town.'] };
  const found = (record) => vocabularyPageFindings(record, page).map((f) => `${f.word} :: ${f.quote.slice(0, 18)}`);

  test('one power whose ruler shows three faces: the heading is true; "three powers" is not', () => {
    expect(found(one)).toEqual(['powersCount :: Three powers conte']);
  });

  test('three powers whose ruler shows two faces: the heading is false; "three powers" is true', () => {
    expect(found(three)).toEqual(['rulingFaces :: The ruling three o']);
  });
});

/**
 * W2-B-DECLARE third seat, F4 (REVIEW-W2B: "two homes answer 'is there a church'"): church words read ONE home, the faith
 * reading (`faithReading.js :: faithReadingOf`, `hasChurch`: a wayside shrine is not a church); shrine words read the
 * sacred house; "religious houses" reads the faith reading; "access to the parish church" names a church ELSEWHERE.
 * Red at 2ca67e00e, whose `temple` read the sacred house (a shrine counted) for every one of those words.
 */
describe('F4 — one home for whether there is a church', () => {
  const shrineOnly = { tier: 'hamlet', population: 60, config: {}, stress: [], institutions: [{ name: 'Wayside shrine' }], powerStructure: { factions: [] } };
  const parish = { ...shrineOnly, institutions: [{ name: 'Parish church' }] };
  const access = { ...shrineOnly, institutions: [{ name: 'Access to parish church' }] };
  const page = { 'World/Faith': [
    'The church bell calls the hamlet to prayer each morning.',
    'The religious houses take in a tenth of the harvest.',
    'Travellers leave a coin at the shrine by the ford.',
    'The people walk to the parish church in the next valley.',
  ] };
  const found = (record, lines = page) => vocabularyPageFindings(record, lines).map((f) => `${f.word} :: ${f.quote.slice(0, 24)}`);

  test('a wayside shrine is not a church: church words and "religious houses" are findings; the shrine is not', () => {
    expect(found(shrineOnly)).toEqual([
      'temple :: The church bell calls th',
      'religiousHouses :: The religious houses tak',
      'temple :: The people walk to the p',
    ]);
  });

  test('a parish church answers the church words; a shrine word stands on any sacred house', () => {
    expect(found(parish)).toEqual([]);
  });

  test('access wording names a church elsewhere: "access to the parish church" is no finding', () => {
    expect(found(access, { 'World/Faith': ['Access to parish church is a long walk for the old.'] })).toEqual([]);
  });

  test('the walker: a line naming a church is answered by `church` (or `church access`), never by a sacred house alone', () => {
    const d = (needs) => ({ needs, excludes: [], crisis: [] });
    expect(declarationImplies('temple', d(['church']), 'names')).toBe(true);
    expect(declarationImplies('temple', d(['church access']), 'names')).toBe(true);
    expect(declarationImplies('temple', d(['sacredHouse']), 'names')).toBe(false);
    expect(declarationImplies('religiousHouses', d(['sacredHouse']), 'names')).toBe(false);
    expect(declarationImplies('shrine', d(['sacredHouse']), 'names')).toBe(true);
    expect(THINGS.temple.atoms).toEqual(expect.arrayContaining(['church']));
    expect(THINGS.temple.sufficient).toEqual(expect.arrayContaining(['church access']));
  });
});
