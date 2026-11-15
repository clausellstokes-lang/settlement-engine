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
 *
 * R1 (2026-11-13, the chair's ruling on REVIEW-R2-STAGES finding 1): "by kind" answers a house with no catalogue row
 * too. A house of the roster whose TRADE does a missing house's finishing (`validationOnPage.js :: FINISHING_TRADES`:
 * a Cobbler's guild or a Furrier's district for the leatherworkers, Carpenters for the carpenters' guild, an
 * Apothecary for the alchemist) finishes the work, and where ONE finisher stands no half-way line prints. Two pins of
 * item 1 held a false line as correct and are re-keyed by identity with that cause: the unit's Apothecary district
 * ("no alchemist shop finishes it" beside the apothecary that finishes the herbs) and the cold list's
 * rw3-city-infiltrated-1, whose Cobbler's guild and Furrier's district finish the leather its Tanners tan.
 *
 * H23 (2026-11-15, the chair's ruling on TAIL-CLOSE-POOLS-3's stop; vetoable by the owner): THE BIRTHS ARM RE-SHAPED TO
 * THE INVARIANT THE CURE NOW HOLDS. The gap rows are read by kind upstream (`resourceGenerator.js ::
 * evaluateInstitutionChain`, a missing house is one "no house of the same kind stands for", the family of fcf4cae69), so
 * no gap row of the census names as missing a house the roster holds by family: 0 of the 720 and 0 of 2,880 (the plan at
 * four times its scale). The arm's seven per-town pins needed that dead state (each asserted the town's gap row DID name
 * a house the roster holds) and are RETIRED BY NAME, for the owner's veto list: r2r-town-31, r2r-town-39, r2r-town-49,
 * r2r-city-27, r2r-city-32, r2r-city-55, r2s-insurgency-city-2 ("the gap row names a house its roster holds by
 * family"). In their place, over the same seven towns, every town run: NO gap row (`resourceAnalysis.gaps[].missing`)
 * and NO half-way line names as missing a house the live roster holds by family or by ladder; anchored on the gap rows
 * and half-way lines the towns hold between them (counted, not spelt). The unit arm on made records is the page
 * writer's guard and stands as it was.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { configOf } from '../../components/pageCensusWalk.shared.mjs';
import { resourceGapLines } from '../../../src/domain/display/validationOnPage.js';
import { familyOfInstitution } from '../../../src/data/institutionalCatalog.js';
import { institutionLadderEvicts } from '../../../src/data/institutionLadders.js';
import { liveInstitutions } from '../../../src/domain/institutions/institutionRoster.js';
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
    // RE-KEYED (R1): the apothecary finishes the herbs, so the work does not stop half-way (was: "no alchemist shop finishes it")
    expect(resourceGapLines(town(['Apothecary district'], 'medicinal herbs', ['Apothecary', 'Alchemist shop'])).map((g) => g.impact)).toEqual([]);
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
    // RE-KEYED (R1): its Cobbler's guild and Furrier's district finish the leather, so no hides line at all (was: no "tannery")
    expect(infiltrated.institutions.map((/** @type {{ name: string }} */ i) => i.name), 'anchored: the roster holds a Cobbler\'s guild').toContain("Cobbler's guild");
    expect(halfWay(infiltrated).filter((t) => /animal hides/i.test(t))).toEqual([]);
    const famine = birthApp('rw3-city-famine-1');
    expect(famine.institutions.map((/** @type {{ name: string }} */ i) => i.name), 'anchored: the roster holds an Apothecary district').toContain('Apothecary district');
    expect(halfWay(famine).filter((t) => /medicinal herbs/i.test(t)), 'R1: the apothecary finishes the herbs').toEqual([]);
  }, 120000);

  test('a true half-way line still prints: r2r-hamlet-16, a stone quarry and no masons', () => {
    expect(halfWay(birthCensus('r2r-hamlet-16'))).toEqual(["Work on the stone here stops half-way: no stonemasons' guild finishes it."]);
  }, 60000);

  test('H23: on the census\'s towns, no gap row and no half-way line names as missing a house the roster holds by family or by ladder', () => {
    const seeds = ['r2r-town-31', 'r2r-town-39', 'r2r-town-49', 'r2r-city-27', 'r2r-city-32', 'r2r-city-55', 'r2s-insurgency-city-2'];
    /** The live roster holds a house of the named one's kind: the catalogue's family, or the ladder either way. @param {any} town @param {string} name */
    const heldByKind = (town, name) => {
      const want = familyOfInstitution({ name })?.key;
      return liveInstitutions(town).some((/** @type {{ name: string }} */ i) => (want && familyOfInstitution(i)?.key === want)
        || institutionLadderEvicts(i.name, name) || institutionLadderEvicts(name, i.name));
    };
    const read = { gapNames: 0, halfWayLines: 0 };
    expectNoSeedFailures(collectSeedFailures(seeds, (seed) => {
      const town = birthCensus(seed);
      const named = (town.resourceAnalysis?.gaps || []).flatMap((/** @type {{ institution?: string, missing?: string[] }} */ g) => (g.institution ? [] : g.missing || []));
      const lines = halfWay(town);
      read.gapNames += named.length; read.halfWayLines += lines.length;
      expect(named.filter((n) => heldByKind(town, n)), `${seed}: a gap row names as missing a house the roster holds by kind`).toEqual([]);
      const text = lines.join(' ').toLowerCase();
      const everyMissing = (town.resourceAnalysis?.gaps || []).flatMap((/** @type {{ missing?: string[] }} */ g) => g.missing || []);
      expect(everyMissing.filter((n) => heldByKind(town, n) && text.includes(n.toLowerCase())), `${seed}: a half-way line names a house the roster holds by kind`).toEqual([]);
    }), 'a gap row or a half-way line names a house the roster holds by kind');
    // ANCHORED: the arm read live gap rows and a live half-way line (at this tip 13 missing houses across six of the towns, and
    // r2r-town-49's hides line), so its silences are the record's, not an empty read.
    expect(read.gapNames, 'anchored: the towns hold gap rows naming missing houses').toBeGreaterThan(0);
    expect(read.halfWayLines, 'anchored: the towns hold a half-way line').toBeGreaterThan(0);
  }, 240000);
});

describe('R1: a house of the missing house\'s trade finishes the work, and one finisher silences the line', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  const town = (/** @type {string[]} */ names, /** @type {string} */ chain, /** @type {string[]} */ missing) => ({
    name: 'Testford', config: {}, economicState: { primaryExports: [] }, institutions: names.map((name) => ({ name })),
    resourceAnalysis: { gaps: [{ chain, missing, impact: 'Cannot produce final goods, limited to intermediate products', severity: 'medium' }] },
  });

  test('the unit: a cobbler or a furrier finishes the leather; carpenters the timber; a tanner alone does not', () => {
    expect(resourceGapLines(town(['Tanners', "Cobbler's guild"], 'animal hides', ['Tannery', "Leatherworkers' guild"]))).toEqual([]);
    expect(resourceGapLines(town(['Tanners', "Furrier's district"], 'animal hides', ['Tannery', "Leatherworkers' guild"]))).toEqual([]);
    expect(resourceGapLines(town(['Sawmill (commercial)', 'Carpenters (5-15)'], 'timber', ['Sawmill', "Carpenters' guild"]))).toEqual([]);
    expect(resourceGapLines(town(['Potter'], 'clay', ['Potter', 'Brickmaker']))).toEqual([]);
    // a tannery tans; it does not finish the leather: the true line stays
    expect(resourceGapLines(town(['Tanners'], 'animal hides', ['Tannery', "Leatherworkers' guild"])).map((g) => g.impact))
      .toEqual(["Work on the animal hides here stops half-way: no leatherworkers' guild finishes it."]);
    // a road to a neighbour's house finishes nothing here
    expect(resourceGapLines(town(['Access to cobbler'], 'animal hides', ["Leatherworkers' guild"])).map((g) => g.impact))
      .toEqual(["Work on the animal hides here stops half-way: no leatherworkers' guild finishes it."]);
  });

  test('the reader\'s towns: no half-way line beside the house that finishes the work (REVIEW-R2-STAGES finding 1)', () => {
    const seeds = ['r2r-town-39', 'r2r-city-20', 'r2r-metropolis-43', 'r2r-city-27', 'r2s-under_siege-city-1', 'r2s-insurgency-city-2'];
    expectNoSeedFailures(collectSeedFailures(seeds, (seed) => {
      expect(halfWay(birthCensus(seed)), seed).toEqual([]);
    }), 'a half-way line prints beside its finisher');
  }, 240000);

  test('the four true lines still print (Tanners alone): r2r-town-49, r2s-mass_migration-town-0', () => {
    for (const seed of ['r2r-town-49', 'r2s-mass_migration-town-0']) {
      expect(halfWay(birthCensus(seed)), seed).toEqual(["Work on the animal hides here stops half-way: no leatherworkers' guild finishes it."]);
    }
  }, 120000);
});
