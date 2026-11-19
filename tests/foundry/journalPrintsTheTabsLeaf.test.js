/**
 * journalPrintsTheTabsLeaf.test.js — TAIL-EXPORTS-JOURNAL batch 2, the chair's rulings E1 and E5 of 2026-11-14.
 *
 * E1, THE EXPORT PRINTS WHAT THE TAB PRINTS, THROUGH THE TAB'S OWN LEAF: the journal's Exploitation table named each
 * resource by a humanize of its own ("gold/silver ore", "Oasis Water", "Hot Springs Mineral") where the Resources
 * tab's card prints the leaf's name ("Gold and silver ore", "Oasis and water rights", "Mineral hot springs"):
 * 12 resources, 75 towns at most each, of the 720 census towns at 48fedbe98. The table now reads the tab's leaf.
 * E5, A LABEL WITH NO VALUE: the NPC Quick Reference printed an empty "Member of" cell for a person who holds no power
 * (2,040 rows of the 720); the cell now prints the journal's own mark for none, "—".
 *
 * Collected on births (the census's own dials): RED pairs (a row that must not print, with what prints instead), red at
 * the base; KEEP pairs (a true sibling that must still print), green before and after.
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

/** E1 RED: [seed, the journal's own name that must not print, the tab's name that prints instead]. */
const NAME_RED = [
  ['r2r-thorp-4', '| gold/silver ore |', '| Gold and silver ore |'],
  ['r2r-thorp-4', '| Oasis Water |', '| Oasis and water rights |'],
  ['r2r-thorp-7', '| Hot Springs Mineral |', '| Mineral hot springs |'],
  // Re-keyed BY IDENTITY (TAIL-CLOSE-DISPLAY-2, red 2): r2r-thorp-0's herbs were its hot springs', which file none since
  // TAIL-DEFECON-C's DECLARED D34 (a) (680d16b54: "the hot springs no herbs"); the nearest thorp whose Exploitation
  // table still names the herbs (a scan of r2r-thorp-0..19) is r2r-thorp-9.
  ['r2r-thorp-9', '| medicinal herbs |', '| Medicinal herbs |'],
];
/** E5 RED: [seed, the person who holds no power, the row that prints instead]. */
const CELL_RED = [['r2r-city-16', 'Muluc Zuyua', '| Muluc Zuyua | the dean | — | 7 |']];
/** KEEP: [seed, a row that prints before and after]. */
const KEEP = [
  ['r2r-city-16', '| Tao Hau | the garrison commander | Military/Guard | 9 |'],
];

/** @type {Map<string, string>} */
const pages = new Map();
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of new Set([...NAME_RED, ...CELL_RED, ...KEEP].map((r) => r[0]))) {
    const s = generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} });
    pages.set(seed, buildJournalPages(buildViewModel({ settlement: s }), { settlement: s }).map((p) => unescape(p.markdown ?? '')).join('\n'));
  }
}, 300000);

describe('E1: the Exploitation table names a resource as the Resources tab does', () => {
  for (const [seed, own, tab] of NAME_RED) {
    test(`${seed}: not "${own}"; prints "${tab}"`, () => {
      const page = pages.get(seed) || '';
      expectAbsentWithAnchor(page, own, tab, seed);
    });
  }
});

describe('E5: no quick-reference row prints an empty "Member of" cell', () => {
  for (const [seed, who, row] of CELL_RED) {
    test(`${seed}: ${who} prints "${row}"`, () => {
      const page = pages.get(seed) || '';
      expect(page).toContain(row);
      expect(page.split('\n').filter((l) => /^\| [^|]+ \| [^|]* \|\s*\| \d+ \|$/.test(l))).toEqual([]);
    });
  }
  for (const [seed, row] of KEEP) {
    test(`KEEP ${seed}: "${row}"`, () => { expect(pages.get(seed) || '').toContain(row); });
  }
});
