/**
 * gapLineHousesByKind.test.js — W2-C-LEAVES item 1 (2026-11-13; the cold list REVIEW-W2A-3, lines #628 and #911, HIGH).
 *
 * The Resources tab and the PDF printed "Work on the animal hides here stops half-way: no tannery or leatherworkers'
 * guild finishes it." beside Tanners, and "… no apothecary or alchemist shop finishes it." beside an Apothecary district.
 * The gap row names the chain's houses by ONE spelling (`resourceChains.js :: processingInstitutions`: "Tannery",
 * "Apothecary") and the generator matched them to the roster by exact name, so a town whose tannery is spelt "Tanners"
 * (the catalogue's own name for it from a town upward) was said to have none. The cure reads the roster through the
 * house's own home: the catalogue's FAMILY (`institutionalCatalog.js :: familyOfInstitution`, every spelling at every
 * tier) and its LADDER (`institutionLadders.js :: institutionLadderEvicts`, the same function at a larger or smaller
 * scale). A house of the kind on the roster is not named as missing; where every named house is there, no line.
 *
 * The towns: the cold list's two (the app's own configuration shape), and the census's.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { configOf } from '../../components/pageCensusWalk.shared.mjs';
import { resourceGapLines } from '../../../src/domain/display/validationOnPage.js';
import { familyOfInstitution } from '../../../src/data/institutionalCatalog.js';
import { collectSeedFailures, expectNoSeedFailures } from '../../helpers/seedFailures.js';

/** The app's own shape (the stress panel with Random off), as the reader REVIEW-W2A-3 born its towns. @param {string} seed */
const birthApp = (seed) => {
  const m = /** @type {RegExpMatchArray} */ (seed.match(/^rw3-(\w+)-([a-z_+]+)-\d+$/));
  const stresses = m[2] === 'calm' ? [] : m[2].split('+');
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: stresses,
    _randomizePriorities: true }), null, { seed, customContent: {} });
};
/** The census's shape. @param {string} seed */
const birthCensus = (seed) => {
  const parts = seed.split('-');
  const size = parts.at(-2); const crisis = seed.startsWith('r2s-') ? parts.slice(1, -2).join('-') : null;
  return generateSettlementPipeline(configOf({ size, crisis }, DEFAULT_CONFIG, birthConfig), null, { seed, customContent: {} });
};
/** @param {any} town */
const halfWay = (town) => resourceGapLines(town).map((g) => g.impact).filter((t) => t.includes('stops half-way'));

describe('the half-way line names only the houses the roster lacks by kind (item 1)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('the unit: a house of the named one\'s family or ladder answers it; another kind does not', () => {
    const town = (/** @type {string[]} */ names, /** @type {string} */ chain, /** @type {string[]} */ missing) => ({
      name: 'Testford', config: {}, economicState: { primaryExports: [] }, institutions: names.map((name) => ({ name })),
      resourceAnalysis: { gaps: [{ chain, missing, impact: 'Cannot produce final goods, limited to intermediate products', severity: 'medium' }] },
    });
    expect(familyOfInstitution({ name: 'Tannery' })?.key, 'anchored: the catalogue places the tannery').toBe(familyOfInstitution({ name: 'Tanners' })?.key);
    expect(resourceGapLines(town(['Tanners'], 'animal hides', ['Tannery', "Leatherworkers' guild"])).map((g) => g.impact))
      .toEqual(["Work on the animal hides here stops half-way: no leatherworkers' guild finishes it."]);
    expect(resourceGapLines(town(['Apothecary district'], 'medicinal herbs', ['Apothecary', 'Alchemist shop'])).map((g) => g.impact))
      .toEqual(['Work on the medicinal herbs here stops half-way: no alchemist shop finishes it.']);
    expect(resourceGapLines(town(['Apothecary district', 'Alchemist quarter'], 'medicinal herbs', ['Apothecary', 'Alchemist shop']))).toEqual([]);
    // a house of another kind answers nothing
    expect(resourceGapLines(town(['Cobbler'], 'animal hides', ['Tannery'])).map((g) => g.impact))
      .toEqual(['Work on the animal hides here stops half-way: no tannery finishes it.']);
    // a ruined house is not here
    const ruined = town(['Tanners'], 'animal hides', ['Tannery']);
    ruined.institutions[0] = { name: 'Tanners', status: 'ruined' };
    expect(resourceGapLines(ruined).map((g) => g.impact)).toEqual(['Work on the animal hides here stops half-way: no tannery finishes it.']);
  });

  test('the cold list\'s towns: rw3-city-infiltrated-1 (Tanners) and rw3-city-famine-1 (an Apothecary district)', () => {
    const infiltrated = birthApp('rw3-city-infiltrated-1');
    expect(infiltrated.institutions.map((/** @type {{ name: string }} */ i) => i.name), 'anchored: the roster holds Tanners').toContain('Tanners');
    expect(halfWay(infiltrated).filter((t) => /tannery/i.test(t))).toEqual([]);
    const famine = birthApp('rw3-city-famine-1');
    expect(famine.institutions.map((/** @type {{ name: string }} */ i) => i.name), 'anchored: the roster holds an Apothecary district').toContain('Apothecary district');
    expect(halfWay(famine).filter((t) => /apothecary/i.test(t))).toEqual([]);
  }, 120000);

  test('a true half-way line still prints: r2r-hamlet-16, a stone quarry and no masons', () => {
    expect(halfWay(birthCensus('r2r-hamlet-16'))).toEqual(["Work on the stone here stops half-way: no stonemasons' guild finishes it."]);
  }, 60000);

  test('on the census\'s towns that printed a named house beside it, no half-way line names a house of a kind the roster holds', () => {
    const seeds = ['r2r-town-31', 'r2r-town-39', 'r2r-town-49', 'r2r-city-27', 'r2r-city-32', 'r2r-city-55', 'r2s-insurgency-city-2'];
    expectNoSeedFailures(collectSeedFailures(seeds, (seed) => {
      const town = birthCensus(seed);
      const named = (town.resourceAnalysis?.gaps || []).flatMap((/** @type {{ institution?: string, missing?: string[] }} */ g) => (g.institution ? [] : g.missing || []));
      const families = new Set(town.institutions.map((/** @type {{ name: string }} */ i) => familyOfInstitution(i)?.key).filter(Boolean));
      const heldByKind = named.filter((n) => families.has(familyOfInstitution({ name: n })?.key));
      expect(heldByKind.length, `anchored: ${seed}'s gap row names a house its roster holds by family`).toBeGreaterThan(0);
      const lines = halfWay(town).join(' ').toLowerCase();
      expect(heldByKind.filter((n) => lines.includes(n.toLowerCase())), seed).toEqual([]);
    }), 'a half-way line names a house the roster holds by kind');
  }, 240000);
});
