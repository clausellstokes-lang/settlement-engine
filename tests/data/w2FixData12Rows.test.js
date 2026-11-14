/**
 * W2-FIX-DATA-12 (2026-11-14): the data lane's rows after the bar's first measure, each reproduced false in census towns
 * (`r2r-<size>-<i>` every dial random; `r2s-<crisis>-<size>-<i>` the crisis forced, Random off) and cured at its table.
 *
 * THIS FILE REDS WHEN a town prints one of those lines again where its record makes it false, or when the town it is true
 * in loses it.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { buildJournalPages } from '../../src/foundry/journalPages.js';
import { IdentityDailyLife } from '../../src/pdf/sections/IdentityDailyLife.jsx';

const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };

/** A census town, as its births script makes it. */
const bornCensus = (/** @type {string} */ seed) => {
  const forced = /^r2s-(.+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(seed);
  const calm = /^r2r-(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(seed);
  const tier = forced ? forced[2] : /** @type {RegExpExecArray} */ (calm)[1];
  const cfg = forced ? { ...DEFAULT_CONFIG, ...dials, settType: tier, selectedStressesRandom: false, selectedStresses: [forced[1]] } : { ...DEFAULT_CONFIG, ...dials, settType: tier };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
};

/** The timber-chain keys a town's resource analysis files in a bucket. @param {any} town @param {string} bucket */
const timberIn = (town, bucket) => {
  const e = town.resourceAnalysis?.exploitation || {};
  return [bucket].flatMap((k) => (e[k] || [])
    .filter((/** @type {any} */ c) => (c.processingTags || []).includes('timber'))
    .map((/** @type {any} */ c) => `${k}:${c.chainKey}`));
};
/** The Foundry journal's exploitation row for timber, as it prints. @param {any} town */
const journalTimberRow = (town) => {
  const pages = buildJournalPages(buildViewModel({ settlement: town }));
  const md = pages.map((/** @type {any} */ p) => String(p.markdown || '')).join('\n');
  return (md.split('\n').find((l) => /^\| Timber \|/.test(l)) || '');
};

/** @react-pdf text leaves, calling each function component (tests/generators/foodwaysOneLine.test.jsx). @param {any} node @param {string[]} [out] @returns {string[]} */
const pdfText = (node, out = []) => {
  if (node == null || typeof node === 'boolean') return out;
  if (typeof node === 'string' || typeof node === 'number') { out.push(String(node)); return out; }
  if (Array.isArray(node)) { node.forEach((child) => pdfText(child, out)); return out; }
  if (typeof node === 'object') return typeof node.type === 'function' ? pdfText(node.type(node.props), out) : pdfText(node.props?.children, out);
  return out;
};
/** The PDF's Architecture row as it prints, or null. @param {any} town */
const pdfArchitecture = (town) => {
  const text = pdfText(IdentityDailyLife({ settlement: town, narrativeMode: false, vm: buildViewModel({ settlement: town }) }));
  const at = text.indexOf('Architecture');
  return at < 0 ? null : text[at + 1];
};

describe('W2-FIX-DATA-12: the measured rows in the data lane\'s files', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

  test('#116: a commercial sawmill works the timber chain (r2r-town-1, r2s-under_siege-city-3, r2r-metropolis-5); r2r-town-12, with no timber house, keeps its timber unexploited', () => {
    expectNoSeedFailures(collectSeedFailures(['r2r-town-1', 'r2s-under_siege-city-3', 'r2r-metropolis-5'], (seed) => {
      const town = bornCensus(seed);
      expect((town.institutions || []).some((/** @type {any} */ i) => i.name === 'Sawmill (commercial)'), `${seed} holds a commercial sawmill`).toBe(true);
      expect(timberIn(town, 'unexploited'), seed).toEqual([]);
      expect(timberIn(town, 'partiallyExploited'), seed).toContain('partiallyExploited:timber');
      expect(journalTimberRow(town), seed).not.toMatch(/\| unexploited \|/);
    }), 'a commercial sawmill stands: the timber is not told unworked');
    const keep = bornCensus('r2r-town-12');
    expect(timberIn(keep, 'unexploited')).toContain('unexploited:timber');
    expect(journalTimberRow(keep)).toMatch(/\| unexploited \|/);
  }, 180_000);

  test('the reader\'s C02/C08 (HIGH): the PDF\'s Architecture row holds the detail to its row\'s declaration (r2r-village-12 no market; r2r-city-0 no palisade, no river; r2s-occupied-thorp-3 no landing); r2r-village-25, with a market, keeps it', () => {
    expectNoSeedFailures(collectSeedFailures(['r2r-village-12', 'r2r-city-0', 'r2s-occupied-thorp-3'], (seed) => {
      const town = bornCensus(seed);
      expect(String(town.culturalIdentity?.architecturalDetail || ''), `${seed} carries a detail`).not.toBe('');
      expect(pdfArchitecture(town), seed).toBeNull();
    }), 'the detail names what the town lacks: the PDF prints no Architecture row');
    const keep = bornCensus('r2r-village-25');
    expect(pdfArchitecture(keep)).toBe('arcaded market fronts define the principal square');
  }, 180_000);

  test('REVIEW-R2-CODE-A (the chair\'s 10:57, HIGH): the wine shop\'s patron stands drinks only where a tavern stands, at a village\'s size or more (r2r-thorp-27, r2s-recently_betrayed-hamlet-1, r2r-village-55 hold none); r2r-town-2 keeps it', () => {
    const WINE = /A patron stands drinks at a wine shop/;
    expectNoSeedFailures(collectSeedFailures(['r2r-thorp-27', 'r2s-recently_betrayed-hamlet-1', 'r2r-village-55'], (seed) => {
      expect(String(bornCensus(seed).arrivalScene || ''), seed).not.toMatch(WINE);
    }), 'no tavern: no wine shop in the arrival');
    expect(String(bornCensus('r2r-town-2').arrivalScene || '')).toMatch(WINE);
  }, 180_000);
});
