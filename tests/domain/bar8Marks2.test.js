/**
 * bar8Marks2.test.js — BAR8 MARKS-2 (the sixth chair's BRIEF-BAR8, 2026-11-17; vetoable by the owner): THE MARK'S TABLES AND
 * ITS READERS TAKE THE SIEGE'S BOUGHT GOODS, THE WAR'S IRON UNDER AN OCCUPATION, AND THE MAGIC SUPPLIER. Over fixed seeds of
 * the census's 720 and the read's thirty (born in the census's own configuration shape, as `leftMarks.test.js` births them):
 *   (1, 2) J's 11e.siegeBought, K's 12a. Under a siege a house whose material the imports bring by name (the dyer's wool, the
 *          furrier's district's hides, the river boatyard's timber, the mint's bullion: `crisisDependence.js ::
 *          INPUT_IMPORTED_AS`), or that is the one house of the chain that is the trade in it (the furs from the north), is
 *          "Curtailed by the siege.", and its rows with it; the shipyard, whose timber is the stand beyond the walls or bought
 *          in (C0476), too. NEGATIVES: a besieged dyer whose imports bring no wool, a calm town's furrier, the tailors (they
 *          sew cloth: wool is not their input) print bare.
 *   (4)    RULING BR16: an occupation alone is peace for the war's iron (`warIronHook.js :: ironWarState`): the iron houses of
 *          the two occupied towns of the 720 and of the control C38200 print bare; a siege keeps its own reading.
 *   (3)    J's 11a.atWork: the alchemist's shop of r2s-religious_conversion-town-2 is "Short of medicinal herbs." beside the
 *          need list's "medicinal herbs" (`HOUSE_NEED_INPUT`); an alchemist's shop whose herbs are made and brought in is bare.
 *   (5)    BR3 (b): a gap row "runs on imported fish" stands beside an import that names fish (the three fishmongers); the
 *          tannery's "livestock" beside "Raw hides and animal products" is one canonical good, and nothing is written.
 *   (6)    K's 12f: the Magic tab names no supplier the page marks stopped (the three besieged thorps and hamlets of the 720
 *          and the control C19407); a supplier at work is still named.
 * Each mark reads alike on the owner's record, its public projection and the share veil (N4). POSITIVE CONTROL: at the base
 * (dfe557dc9) every house of (1, 2) prints bare, the iron houses of (4) "Short of iron.", the three fishmongers' imports name
 * no fish and the Magic tab names "Access to a house of worship": the file is red there.
 */
import { describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { rowMarkText } from '../../src/domain/display/crisisStoppedRow.js';
import { deriveMagicSupplyView } from '../../src/domain/display/dossierViewModel.js';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';
import { projectShareVeil } from '../../src/domain/display/galleryVeil.js';
import { liveInstitutions } from '../../src/domain/institutions/institutionRoster.js';
import { serviceRowsOf } from '../../src/domain/dossier/entityLinks.js';
import { ironWarState, warIronState } from '../../src/domain/facts/warIronHook.js';
import { houseInputAtHand, warIronHookOutsideWar } from '../../src/domain/facts/houseInputAtHand.js';
import { subsumeTradeGoods } from '../../src/domain/region/goodsCatalog.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

await loadGenerationLawPayloads();

const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** CENSUS-3 seedcfg.mjs's r2r-, r2s- and bar0- arms, verbatim in shape (as leftMarks.test.js). @param {string} seed */
const born = (seed) => {
  let m = /^r2r-(\w+)-\d+$/.exec(seed);
  if (m) return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: m[1] }), null, { seed, customContent: {} });
  m = /^r2s-(\w+)-(\w+)-\d+$/.exec(seed);
  if (m) return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] }), null, { seed, customContent: {} });
  m = /^bar0-(\w+)-([a-z_+]+)-([a-z_]+)-\d+$/.exec(seed);
  if (!m) throw new Error(`not a census seed: ${seed}`);
  const st = m[2] === 'calm' ? [] : m[2].split('+'); const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: st, _randomizePriorities: true }), null, { seed, customContent: {} });
};
/** @type {Map<string, any>} */
const towns = new Map();
const town = (/** @type {string} */ seed) => { if (!towns.has(seed)) towns.set(seed, born(seed)); return towns.get(seed); };
/** The three views of a record (N4): the owner's, its public projection, the share veil. @param {any} s */
const views = (s) => [s, toPublicSafe(structuredClone(s)), projectShareVeil(toPublicSafe(structuredClone(s)), null)];
/** One answer over the three views, or the three. @param {any} s @param {(r: any) => unknown} read */
const alike = (s, read) => { const xs = views(s).map((r) => JSON.stringify(read(r) ?? null)); return xs.every((x) => x === xs[0]) ? JSON.parse(xs[0]) : `the views differ: ${xs.join(' | ')}`; };
/** A house's mark, and the marks of its service rows, alike on the three views. @param {any} s @param {string} name */
const marksOf = (s, name) => alike(s, (r) => {
  const h = liveInstitutions(r).find((x) => x?.name === name);
  if (!h) return 'NO SUCH HOUSE';
  return { house: rowMarkText(r, 'house', h), rows: serviceRowsOf(r.availableServices).filter(({ svc }) => svc.institution === name).map(({ svc }) => rowMarkText(r, 'service', svc)) };
});

const CURTAILED = 'Curtailed by the siege.';

describe('(1, 2) · under a siege a house whose material is bought in, or is its trade chain\'s one house, is curtailed', () => {
  const ROWS = /** @type {Array<[string, string, string | null, string]>} */ ([
    ['r2s-under_siege-city-2', 'Dyer', CURTAILED, '"Wool" on the imports'],
    ['r2s-under_siege-city-2', 'Mint (official)', CURTAILED, '"Precious metals and bullion" on the imports'],
    ['bar0-city-under_siege+famine-rand-46', 'Mint (official)', CURTAILED, 'the control C2853: "Precious metals (local gold and silver veins exhausted)"'],
    ['r2s-under_siege-city-1', "Furrier's district", CURTAILED, '"Raw hides and animal products" on the imports; its furs chain "Stopped by the siege."'],
    ['r2r-metropolis-14', "Furrier's district", CURTAILED, 'no hides on the imports: the one house of the furs chain, the trade "Stopped by the siege."'],
    ['r2s-under_siege-town-0', 'River boatyard', CURTAILED, '"Timber" on the imports'],
    ['bar0-city-under_siege+famine-rand-45', 'Shipyard', CURTAILED, 'the control C0476: its ship timber stand beyond the walls, its own chain "Impaired · Normally yields"'],
    ['r2r-village-21', 'Dyer', null, 'NEGATIVE: besieged, and no import brings wool'],
    ['r2s-under_siege-town-3', "Tailor's guild", null, 'NEGATIVE: the tailors sew cloth; wool is not their input'],
    ['r2r-metropolis-12', "Furrier's district", null, 'NEGATIVE: a calm town; no short reading opens on the furrier'],
  ]);
  test('each house and every one of its rows reads its state, alike on the three views (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(ROWS, ([seed, house, want, why]) => {
      const got = marksOf(town(seed), house);
      expect(typeof got === 'object' && got !== null, `${seed} · ${house}: ${JSON.stringify(got)}`).toBe(true);
      expect(got.house, `${seed} · ${house} (${why})`).toBe(want);
      for (const row of got.rows) expect(row, `${seed} · ${house}'s row (${why})`).toBe(want);
    }), '(1, 2) rows');
  }, 600_000);
});

describe('(4) · RULING BR16: an occupation alone is peace for the war\'s iron', () => {
  test('the predicate: an occupation alone reads peace; beside a war, at war; a siege keeps its own reading; no types, as it is', () => {
    expect(ironWarState('at war', ['occupied'])).toBe('peace');
    expect(ironWarState('at war', ['occupation'])).toBe('peace');
    expect(ironWarState('at war', ['occupied', 'wartime'])).toBe('at war');
    expect(ironWarState('at war', ['wartime'])).toBe('at war');
    expect(ironWarState('front', ['under_siege', 'occupied'])).toBe('front');
    expect(warIronState('at war')).toBe(true);
    expect(warIronState('peace', ['occupied'])).toBe(false);
  });
  const IRON = /smith|smelter|metalworker/i;
  test('the iron houses of the occupied towns print no "Short of iron." (the three views); a besieged town keeps its reading', () => {
    expectNoSeedFailures(collectSeedFailures(['r2s-occupied-city-1', 'r2s-occupied-town-3', 'bar0-town-occupied-rand-46'], (seed) => {
      const s = town(seed);
      expect(warIronHookOutsideWar(s), `${seed}: the war's iron hook outside a war`).toBe(false);
      const houses = liveInstitutions(s).filter((h) => IRON.test(String(h?.name ?? '')));
      expect(houses.length, `${seed}: an iron house stands`).toBeGreaterThan(0);
      for (const h of houses) {
        const got = marksOf(s, h.name);
        expect(JSON.stringify(got).includes('Short of iron.'), `${seed} · ${h.name}: ${JSON.stringify(got)}`).toBe(false);
      }
    }), 'the occupied towns');
    expect(warIronHookOutsideWar(town('r2r-metropolis-14')), 'r2r-metropolis-14, besieged: the siege\'s own reading').toBe(true);
  }, 600_000);
});

describe('(5) · BR3 (b): a gap row "runs on imported X" stands beside an import that names X', () => {
  // FAULTS-BIRTH (2026-11-18, R8: re-keyed by identity): r2r-village-36's and r2s-religious_conversion-village-0's landings now prove
  // the water their fishmonger buys from (FR8 (a)): the fish is local there and no row runs on imported fish; the same claim on
  // two towns whose fishmonger still runs on imported fish
  const FISH = ['r2r-village-49', 'r2s-indebted-village-2', 'r2r-village-57'];
  test('the three fishmongers that run on imported fish: the imports name fish', () => {
    expectNoSeedFailures(collectSeedFailures(FISH, (seed) => {
      const s = town(seed);
      expect((s.resourceAnalysis?.gaps || []).some((g) => g?.kind === 'imported' && g.chain === 'fish'), `${seed}: the fishmonger's imported row`).toBe(true);
      expect((s.economicState?.primaryImports || []).some((x) => /\bfish\b/i.test(String(x).replace(/\([^)]*\)/g, ' '))), `${seed}: ${(s.economicState?.primaryImports || []).join(' · ')}`).toBe(true);
    }), 'the fishmongers');
  }, 600_000);
  test('the tannery that runs on imported livestock beside "Raw hides and animal products": one canonical good, no second word', () => {
    // FAULTS-BIRTH (2026-11-18, R8: re-keyed by identity): r2r-village-9's hunter's lodge now proves its hunting grounds, whose hides
    // feed the tannery (FR8 (a)); the same claim on a tannery that still runs on imported livestock beside the hides word
    // FAULTS-BIRTH FR24 (2) (2026-11-18, R8: re-keyed by identity again): r2s-religious_conversion-village-3's common now proves its
    // pasture, whose hides feed the tannery; no town of the 900 keeps a tannery's imported-livestock row beside the hides word at the
    // merged line, so the claim (one canonical good, no second word) on a tanning house the hides word itself feeds: r2r-town-1
    const s = town('r2r-town-1');
    const tanners = liveInstitutions(s).find((i) => i?.name === 'Tanners');
    expect(tanners && houseInputAtHand(s, 'livestock', tanners, { rawResource: 'livestock' }), 'the Tanners run on the bought word, the beasts\' one good (the anchor)').toBe('imported');
    expect((s.economicState?.primaryImports || []).map(String), 'the hides word stands (the anchor)').toContain('Raw hides and animal products');
    const imports = (s.economicState?.primaryImports || []).map(String);
    expect(imports.filter((x) => /^Livestock$/.test(x)), 'no "Livestock" beside the hides word').toEqual([]);
    expect(subsumeTradeGoods([...imports, 'Livestock']).length).toBe(subsumeTradeGoods(imports).length);
  }, 600_000);
});

describe('(3) · J\'s 11a.atWork: the alchemist\'s shop is short of the herbs the need list names', () => {
  // `crisisDependence.js :: HOUSE_NEED_INPUT`'s alchemist_shop (added 2026-11-18 at the second reader's MED 2): short only where
  // the record's own need list names its good and the one reader finds it nowhere
  const ROWS = /** @type {Array<[string, string | null, string]>} */ ([
    ['r2s-religious_conversion-town-2', 'Short of medicinal herbs.', '"Needed, and not brought in: … medicinal herbs."; no import brings them'],
    ['bar0-town-calm-rand-46', null, 'NEGATIVE: the town makes medicinal herbs and its imports bring them ("Medicinal herbs")'],
  ]);
  test('the house and every one of its rows read their state, alike on the three views (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(ROWS, ([seed, want, why]) => {
      const got = marksOf(town(seed), 'Alchemist shop');
      expect(typeof got === 'object' && got !== null, `${seed} · Alchemist shop: ${JSON.stringify(got)}`).toBe(true);
      expect(got.rows.length, `${seed} · Alchemist shop: anchored, a row of its own`).toBeGreaterThan(0);
      expect(got.house, `${seed} · Alchemist shop (${why})`).toBe(want);
      for (const row of got.rows) expect(row, `${seed} · Alchemist shop's row (${why})`).toBe(want);
    }), '(3) rows');
  }, 600_000);
});

describe('(6) · K\'s 12f: the Magic tab names no supplier the page marks stopped', () => {
  test('the besieged towns whose one supplier is stopped name none, and still print the reliance (the three views); a supplier at work is named', () => {
    expectNoSeedFailures(collectSeedFailures(['r2s-under_siege-thorp-1', 'r2s-under_siege-thorp-2', 'r2s-under_siege-hamlet-2', 'bar0-hamlet-under_siege-rand-47'], (seed) => {
      expect(alike(town(seed), (r) => deriveMagicSupplyView(r)), seed).toEqual({ supply: null, statable: true });
    }), 'the stopped suppliers');
    const at = alike(town('bar0-city-under_siege+famine-rand-46'), (r) => deriveMagicSupplyView(r));
    expect(at?.supply, 'a supplier at work').toContain("Mages' guild");
  }, 600_000);
});
