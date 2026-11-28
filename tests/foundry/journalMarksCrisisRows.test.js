/**
 * journalMarksCrisisRows.test.js — TAIL-EXPORTS-JOURNAL-2 batch 3, the chair's rulings E3 and E12 of 2026-11-14/15.
 *
 * UNDER A CRISIS, A ROW THAT LIVES ON WHAT THE CRISIS STOPS IS MARKED, BY THE TABS' ONE LEAF
 * (`domain/display/crisisStoppedRow.js`, its table `data/crisisDependence.js`): the journal printed "Gate Tolls: 8%"
 * under a siege, "Grain Sales: 4%" under a grain famine, "Market Taxes: 36%" under an outbreak, and its houses and
 * supply chains as in ordinary times. Its Economics page now marks an income share by the leaf's word after the name
 * (the Institutions tab's form for a row with no description: "(stopped)", "(scarce)", "(curtailed)") and a chain by
 * the leaf's mark before its description; its Institutions page marks a house as the Institutions tab does (the mark
 * before the description); each page prints the leaf's one head line where a row is marked. The journal keeps no
 * wording of its own for them.
 *
 * Collected on births (the census's own dials): RED pairs (a row that must not print, with what prints instead), red at
 * the base; KEEP pairs (a true sibling that must still print, unmarked), green before and after.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { buildJournalPages } from '../../src/foundry/journalPages.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The census's own cfgFor (r2r-<size>-<i>, r2s-<crisis>-<size>-<i>). @param {string} seed */
function cfgFor(seed) {
  let m = seed.match(/^r2r-(\w+)-(\d+)$/);
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] });
  m = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
  throw new Error(seed);
}
const ENTITY = { '&#39;': "'", '&quot;': '"', '&lt;': '<', '&gt;': '>', '&amp;': '&' };
/** The journal's markdown as a reader sees it: its backslash escapes and its HTML entities undone. */
const unescape = (t) => String(t).replace(/\\([\\`*_{}[\]()#+\-.!|>~<])/g, '$1').replace(/&#39;|&quot;|&lt;|&gt;|&amp;/g, (e) => ENTITY[e]);

const HEAD = (noun) => `*The descriptions here are of ordinary times. While ${noun} lasts, a row it touches is marked.*`;

/** RED: [seed, page, a line that must not print (whole), the line that prints instead (whole)]. */
const RED = [
  // the shares below re-keyed by identity (TAIL-CRISIS-8): TAIL-DEFECON-5's R2, "one shadow figure" (9cc8c6821, landed at
  // 26c3dc45 (JOIN-9 · 14), a declared move of economicState.incomeSources in 229 towns: the criminal row held at the
  // capture, the lawful rows share the rest) moved r2s-under_siege-town-3's Gate Tolls 8% -> 7% and Property Rents 8% -> 7%
  // (its Shadow Economy row 39%) and r2s-famine-town-1's Grain Sales 5% -> 4%; the rows and the marks are the same
  ['r2s-under_siege-town-3', 'Economics & Trade', '- Gate Tolls: 7%', '- Gate Tolls (stopped): 7%'],
  // r2s-famine-town-1's shares re-keyed by identity (TAIL-CRISIS-7): TAIL-DEFECON-2's D14 (5f67f382d, landed at ec1a14f27,
  // a declared move of the income row: Pilgrim Trade only where a house of pilgrimage stands) took the town's pilgrim share
  // and the rest renormalised: Grain Sales 4% -> 5%, Toll Revenue 14% -> 15%; the rows and the mark are the same
  // (then 5% -> 4% at 9cc8c6821, above; Toll Revenue stays 15%)
  ['r2s-famine-town-1', 'Economics & Trade', '- Grain Sales: 4%', '- Grain Sales (scarce): 4%'],
  ['r2s-plague_onset-town-0', 'Economics & Trade', '- Market Taxes: 36%', '- Market Taxes (curtailed): 36%'],
  ['r2s-famine-town-1', 'Economics & Trade', '- **Grain & Bread** *(impaired)*', '- **Grain & Bread** *(impaired)*: Scarce in the famine.'],
  ['r2s-plague_onset-town-0', 'Economics & Trade', '- **Caravan & Overland Trade** *(vulnerable)*', '- **Caravan & Overland Trade** *(vulnerable)*: Curtailed by the outbreak.'],
  // BAR3-SERVICES-2 SV7 (2026-11-15): re-keyed, a row of its own goes on (its "Meals and drink"): the inn reads "Curtailed by the siege."
  ['r2s-under_siege-town-3', 'Institutions', '- **Inns**: Lodging for traveling merchants.', '- **Inns**: Curtailed by the siege. Lodging for traveling merchants.'],
  ['r2s-famine-town-1', 'Institutions', "- **Mills**: The town's grain is ground at a handful of sites.", "- **Mills**: Scarce in the famine. The town's grain is ground at a handful of sites."],
];
/** HEAD: [seed, page, the crisis's noun]: the page's one head line prints where a row is marked. */
const HEADS = [
  ['r2s-under_siege-town-3', 'Economics & Trade', 'the siege'],
  ['r2s-under_siege-town-3', 'Institutions', 'the siege'],
  ['r2s-famine-town-1', 'Economics & Trade', 'the famine'],
  ['r2s-plague_onset-town-0', 'Institutions', 'the outbreak'],
];
/** KEEP: [seed, page, a line that prints, unmarked, before and after]; and a calm town's pages with no head line. */
const KEEP = [
  ['r2s-famine-town-1', 'Economics & Trade', '- Toll Revenue: 15%'], // re-keyed with the shares above (5f67f382d)
  ['r2s-under_siege-town-3', 'Economics & Trade', '- Property Rents: 7%'], // re-keyed 8% -> 7% (9cc8c6821, above)
  ['r2s-under_siege-town-3', 'Institutions', '- **Taverns**: Drinking establishments. Social hubs.'],
  ['r2s-famine-town-1', 'Institutions', '- **Inns**: Lodging for traveling merchants.'],
];
const CALM = ['r2r-town-0'];

/** @type {Map<string, Map<string, string[]>>} */
const pages = new Map();
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of new Set([...RED, ...HEADS, ...KEEP].map((r) => r[0]).concat(CALM))) {
    const s = generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} });
    const byName = new Map(buildJournalPages(buildViewModel({ settlement: s }), { settlement: s }).map((p) => [p.name, unescape(p.markdown ?? '').split('\n')]));
    pages.set(seed, byName);
  }
}, 300000);
const linesOf = (seed, page) => pages.get(seed)?.get(page) || [];

describe('E12: a row the crisis stops is marked by the leaf, on the journal as on the tabs', () => {
  for (const [seed, page, own, marked] of RED) {
    test(`${seed} ${page}: not "${own}"; prints "${marked}"`, () => {
      const lines = linesOf(seed, page);
      expectAbsentWithAnchor(lines, own, marked, `${seed} ${page}`);
    });
  }
  for (const [seed, page, noun] of HEADS) {
    test(`${seed} ${page}: the leaf's head line for ${noun}`, () => { expect(linesOf(seed, page)).toContain(HEAD(noun)); });
  }
});

describe('KEEP: a row the crisis does not touch, and a calm town, print as in ordinary times', () => {
  for (const [seed, page, line] of KEEP) {
    test(`KEEP ${seed} ${page}: "${line}"`, () => { expect(linesOf(seed, page)).toContain(line); });
  }
  for (const seed of CALM) {
    test(`KEEP ${seed}: no mark and no head line on its Economics and Institutions pages`, () => {
      const lines = [...linesOf(seed, 'Economics & Trade'), ...linesOf(seed, 'Institutions')];
      expect(lines.length).toBeGreaterThan(0);
      expect(lines.filter((l) => /ordinary times|\((stopped|curtailed|scarce)\)|(Stopped by the siege|Curtailed by the outbreak|Scarce in the famine)\./.test(l))).toEqual([]);
    });
  }
});
