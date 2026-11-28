/**
 * bar6SeamEcon.test.js — SEAM-ECON's guard (the chair's BRIEF-BAR6-SEAM, section SEAM-ECON, 2026-11-17; vetoable by the owner).
 *
 * Each arm reads named towns of the wide read's 150 (born in REVIEW-BAR-0's bar0- shape) or of the census's 720 (seedcfg.mjs's
 * r2r-/r2s- shape), with an anchor that the record still holds the premise and a sibling that still prints:
 *   (1) 8c.export: a crop the page's own famine mark denies leaves the Exports (`tradeListDisplay.js :: harvestScarceHere`),
 *       and that reading equals the mark's own (`crisisStoppedRow.js :: rowStoppedBy` on the record's income shares);
 *   (2) the poor road under a siege: the Outlook asks the minor-route leaf with the wider reading of a siege;
 *   (4) the half-way iron: the Exports and the made list read the card's `halfWayGoodsDenied`;
 *   (8) L3.outputs: a chain card lists no output every maker of which the page marks short (`housesShortOf`).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { chainOutputsShown, exportsAsPrinted, harvestScarceHere, localProductionAsPrinted } from '../../src/domain/display/tradeListDisplay.js';
import { incomeDependenceOf, rowStoppedBy, stoppingCrisesOf } from '../../src/domain/display/crisisStoppedRow.js';
import { GRAIN } from '../../src/data/crisisDependence.js';
import { housesShortOf } from '../../src/domain/facts/houseInputAtHand.js';
import { generateEconomicViability } from '../../src/generators/economy/viability.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor, expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';

const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** seedcfg.mjs's r2r-, r2s- and bar0- arms, verbatim in shape. @param {string} seed */
const born = (seed) => {
  let m = new RegExp(`^r2r-${SIZE}-\\d+$`).exec(seed);
  if (m) return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: m[1] }), null, { seed, customContent: {} });
  m = new RegExp(`^r2s-(\\w+)-${SIZE}-\\d+$`).exec(seed);
  if (m) return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] }), null, { seed, customContent: {} });
  m = new RegExp(`^bar0-${SIZE}-([a-z_+]+)-([a-z_]+)-\\d+$`).exec(seed);
  if (!m) throw new Error(`no shape for ${seed}`);
  const st = m[2] === 'calm' ? [] : m[2].split('+');
  const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: st, _randomizePriorities: true }), null, { seed, customContent: {} });
};
/** @type {Map<string, any>} */
const towns = new Map();
const town = (/** @type {string} */ seed) => { if (!towns.has(seed)) towns.set(seed, born(seed)); return towns.get(seed); };
const chainOf = (/** @type {any} */ s, /** @type {string} */ id) => (s.economicState?.activeChains || []).find((/** @type {any} */ c) => c.chainId === id);

beforeAll(async () => { await loadGenerationLawPayloads(); }, 120000);

describe('SEAM-ECON item 1 (8c.export): a crop the scarce harvest denies is not sent out', () => {
  // [seed, a crop the record exports, a sibling that still prints]
  const GONE = [
    ['bar0-village-famine-rand-27', 'Desert grain', 'Sacred wood'], // the crops failed (no source named): "Harvest Scarce in the famine."
    ['bar0-village-famine-rand-38', 'Milled flour', 'Sacred wood'], // the herds failed; the mark reads the harvest's grain scarce with them
  ];
  test('each town: the record exports the crop, the page does not; its sibling prints (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(GONE, ([seed, crop, still]) => {
      const s = town(seed);
      expect(s.economicState.primaryExports, `${seed}: anchored, the record exports ${crop}`).toContain(crop);
      expect(harvestScarceHere(s), `${seed}: the page marks the harvest scarce`).toBe(true);
      const shown = exportsAsPrinted(s);
      expect(shown, `${seed}: the sibling still prints`).toContain(still);
      expectAbsentWithAnchor(shown, crop, still, `${seed}: the crop is not exported`);
    }), 'item 1: every scarce-harvest town');
  }, 300000);
  // the reading equals the mark's own over every famine town of the census's 720 and the two above
  const FAMINE = [...['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'].flatMap((z) => [0, 1, 2, 3].map((i) => `r2s-famine-${z}-${i}`)),
    'bar0-village-famine-rand-27', 'bar0-village-famine-rand-38', 'r2r-village-0', 'r2r-town-0'];
  test('harvestScarceHere equals the page mark (rowStoppedBy on a grain share) in every town of the sample (every row)', () => {
    let scarce = 0;
    expectNoSeedFailures(collectSeedFailures(FAMINE, (seed) => {
      const s = town(seed);
      const page = stoppingCrisesOf(s).includes('famine') && (s.economicState?.incomeSources || [])
        .some((/** @type {any} */ sh) => incomeDependenceOf(sh).includes(GRAIN) && rowStoppedBy(s, 'income', sh, ['famine']) === 'famine');
      if (page) scarce++;
      expect(harvestScarceHere(s), `${seed}: the two readings of the scarce harvest`).toBe(page);
    }), 'item 1: one reading of the scarce harvest');
    expect(scarce, 'liveness: the sample holds scarce harvests').toBeGreaterThan(2);
  }, 900000);
});

describe('SEAM-ECON item 8 (L3.outputs): a running card lists no output every maker of which is marked short', () => {
  // RE-KEYED BY IDENTITY (BIRTH-1, 2026-11-17): the birth now brings wool in for the fullers of bar0-metropolis-calm-rand-27
  // and -39 (a connected road no siege shuts: `resourceGenerator.js :: importsBroughtAtBirth`), so their cloth stands. Over
  // the tip's 1,724 births searched (the 720, the 150, 854 more census-shaped seeds) one town bears the claim, a River Mill
  // card listing "Fulled cloth" beside a Fuller short of wool, its flour shown: r2r-metropolis-69 (under a siege, its road shut).
  test('r2r-metropolis-69 (re-keyed from bar0-metropolis-calm-rand-27 and -39): the River Mill card drops "Fulled cloth" beside a Fuller short; its flour stays (every row)', () => {
    // RE-KEYED BY IDENTITY (BIRTH-2, 2026-11-17; the owner, BR3 (c): a siege excludes nothing): the birth now brings the
    // Fuller's wool in under the siege too, so no town of 1,470 census-shaped births at BIRTH-2's tip (the 720, the 150, 600
    // more r2r- towns, cities and metropolises) bears the claim. It stands on the same town composed in THE OWNER'S FOURTH
    // STORY, as BIRTH-2's refusing towns are (the wool not bought in: its word struck, the Fuller's stored gap saying so)
    const fourthStory = (/** @type {any} */ t) => ({ ...t,
      economicState: { ...t.economicState, primaryImports: (t.economicState?.primaryImports || []).filter((/** @type {unknown} */ x) => String(x) !== 'Wool') },
      resourceAnalysis: { ...t.resourceAnalysis, gaps: (t.resourceAnalysis?.gaps || []).map((/** @type {any} */ g) => (g?.institution === 'Fuller' ? { ...g, kind: 'missing' } : g)) } });
    expectNoSeedFailures(collectSeedFailures(['r2r-metropolis-69'], (seed) => {
      const s = fourthStory(town(seed));
      const mill = chainOf(s, 'river_milling');
      expect(mill?.outputs, `${seed}: anchored, the record's outputs`).toContain('Fulled cloth');
      expect(housesShortOf(s).get('Fuller'), `${seed}: anchored, the Fuller is short`).toBe('wool');
      const shown = chainOutputsShown(mill, s);
      expect(shown, `${seed}: the sibling still prints`).toContain('Flour and meal');
      expectAbsentWithAnchor(shown, 'Fulled cloth', 'Flour and meal', `${seed}: the short output leaves the card`);
    }), 'item 8: every short-cloth town');
  }, 300000);
  test('constructed: a Fuller with its wool keeps the output; the same Fuller without it loses it', () => {
    const mill = { chainId: 'river_milling', processingInstitutions: ['Mills (2-5)', 'Mill', 'Sawmill'], resourceInputKey: 'river_mills', outputs: ['Flour and meal', 'Fulled cloth'], status: 'running' };
    const rec = (/** @type {string[]} */ near) => ({ name: 'Testford', institutions: [{ name: 'Mills (2-5)' }, { name: 'Fuller' }], config: { nearbyResources: near }, economicState: { activeChains: [mill] } });
    expect(chainOutputsShown(mill, rec(['river_mills', 'grazing_land'])), 'the wool at hand').toContain('Fulled cloth');
    expect(housesShortOf(rec(['river_mills'])).has('Fuller'), 'anchored: no wool, the Fuller is short').toBe(true);
    expectPresentThenAbsent(chainOutputsShown(mill, rec(['river_mills', 'grazing_land'])), chainOutputsShown(mill, rec(['river_mills'])), 'Fulled cloth', 'no wool');
  });
});

describe('SEAM-ECON item 4 (6c-arms): the Exports and the made list read the card\'s half-way iron', () => {
  test('r2r-town-57: ore worked half-way for want of a smelter: no tools or blades exported or made; its remedies stay; r2r-town-58 keeps its fine arms', () => {
    const s = town('r2r-town-57');
    expect(s.economicState.primaryExports, 'anchored: the record exports the fine arms').toContain('Advanced weapons and armor');
    expect((s.resourceAnalysis?.gaps || []).some((/** @type {any} */ g) => g.chain === 'iron ore' && (g.missing || []).includes('Smelter')), 'anchored: the half-way gap').toBe(true);
    const ex = exportsAsPrinted(s), made = localProductionAsPrinted(s);
    expect(ex, 'the sibling still prints').toContain('Herbal remedies');
    for (const g of ['Advanced weapons and armor', 'Quality tools and weapons']) {
      expectPresentThenAbsent(s.economicState.primaryExports, ex, g, `${g} not exported`);
      expectPresentThenAbsent(s.economicState.localProduction, made, g, `${g} not made`);
    }
    const keep = town('r2r-town-58');
    expect(exportsAsPrinted(keep).concat(localProductionAsPrinted(keep)).some((g) => /^(Master-crafted weapons|Advanced weapons and armor)/.test(g)), 'r2r-town-58: Blacksmiths (3-10), no half-way gap: its fine arms print').toBe(true);
  }, 300000);
});

describe('SEAM-ECON item 2: the Outlook asks the minor-route leaf with the wider reading of a siege', () => {
  test('r2r-town-9 (isolated, a town): the poor road prints; the same record with a siege intended prints none', () => {
    const s = town('r2r-town-9');
    const desc = (/** @type {any} */ rec) => generateEconomicViability(rec).issues.map((/** @type {any} */ i) => String(i.description || '')).join(' | ');
    expect(desc(s), 'anchored: the poor road prints').toMatch(/supplied only irregularly over a poor road/);
    const sieged = { ...s, config: { ...s.config, intendedStressTypes: ['under_siege'] } };
    expectAbsentWithAnchor(desc(sieged), 'poor road', 'operating on stockpiles only', 'a siege intended: no poor road, the stockpile line');
    expect(desc(sieged), 'a siege intended: the stockpile line').toMatch(/operating on stockpiles only/);
  }, 300000);
});
