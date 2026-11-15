/** @vitest-environment jsdom */
/**
 * tailExportsPdf2Batch2.test.jsx — TAIL-EXPORTS-PDF-2 batch 2 (the chair's rulings E17, E15 (1) and E18 of 2026-11-15):
 * UNDER A CRISIS THE PDF'S SERVICE, HOUSE, CHAIN AND INCOME ROWS ARE MARKED BY THE TABS' ONE LEAF
 * (domain/display/crisisStoppedRow.js), its head line printed once a chapter; the cover names the export the tab's
 * Exports print; a criminal house by its label.
 *
 * One collected guard on births of the census's 720. Each NOT pair printed at the merged base 538c6ea10 and must not
 * print; each names what prints instead. Each KEEP pair is a true sibling that must still print.
 */
import { beforeAll, describe, expect, test, vi } from 'vitest';

vi.mock('../../src/store/index.js', () => {
  const data = { campaigns: [] };
  function useStore(selector) { return selector(data); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => data;
  return { useStore, default: useStore };
});

import { EconomicsTrade } from '../../src/pdf/sections/EconomicsTrade.jsx';
import { DefenseSecurity } from '../../src/pdf/sections/DefenseSecurity.jsx';
import { Institutions } from '../../src/pdf/sections/Institutions.jsx';
import { Services } from '../../src/pdf/sections/Services.jsx';
import { Cover } from '../../src/pdf/sections/Cover.jsx';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
  selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** @param {string} seed */
const birth = (seed) => {
  const r = seed.match(/^r2r-(\w+)-\d+$/);
  const s = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  const cfg = r ? { ...DEFAULT_CONFIG, ...DIALS, settType: r[1] }
    : { ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [/** @type {RegExpMatchArray} */ (s)[1]], selectedStressesRandom: false, settType: /** @type {RegExpMatchArray} */ (s)[2] };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
};
/** @param {any} node @param {string[]} acc @returns {string[]} */
const leaves = (node, acc = []) => {
  if (node == null || typeof node === 'boolean') return acc;
  if (typeof node === 'string' || typeof node === 'number') { acc.push(String(node)); return acc; }
  if (Array.isArray(node)) { for (const n of node) leaves(n, acc); return acc; }
  if (typeof node.type === 'function') return leaves(node.type(node.props), acc);
  return leaves(node.props?.children, acc);
};
const cache = new Map();
/** @param {string} seed */
const town = (seed) => { if (!cache.has(seed)) { const t = birth(seed); cache.set(seed, { t, vm: buildViewModel({ settlement: t }) }); } return cache.get(seed); };
/** The text of one surface of a town. @param {string} seed @param {string} where */
const text = (seed, where) => {
  const { t, vm } = town(seed);
  const props = { settlement: t, narrativeMode: false, vm, stateProse: null };
  if (where === 'economics') return leaves(EconomicsTrade(props)).join('\n');
  if (where === 'defense') return leaves(DefenseSecurity(props)).join('\n');
  if (where === 'institutions') return leaves(Institutions(props)).join('\n');
  if (where === 'services') return leaves(Services(props)).join('\n');
  if (where === 'cover') return leaves(Cover(props)).join('\n');
  throw new Error(where);
};

const HEAD_SIEGE = /^The descriptions here are of ordinary times\. While the siege lasts, a row it touches is marked\.$/m;
// [id, seed, surface, must NOT print, what prints instead (one or more; null: the slot is silent by design); the
// chapter's head line is the leaf's (ordinaryTimesLine)]
const NOT = [
  // E17: the chain rows of the worklist, marked by the leaf (crisisStoppedRow.js :: rowStoppedBy 'chain')
  ['11357', 'r2s-famine-town-1', 'services', /^Grain fields » Mills » Baked goods$/m, /^Scarce in the famine\. Grain fields » Mills » Baked goods$/m],
  ['11346', 'r2s-famine-town-1', 'services', /^Grain fields » Brewery » Ale/m, /^Scarce in the famine\. Grain fields » Brewery » Ale/m],
  ['25077', 'r2r-metropolis-14', 'services', /^Strategic Crossroads » Toll bridge/m, /^Stopped by the siege\. Strategic Crossroads » Toll bridge/m],
  ['25075', 'r2s-plague_onset-city-0', 'services', /^Strategic Crossroads » Coaching inn » Transit trade profit$/m, /^Curtailed by the outbreak\. Strategic Crossroads » Coaching inn/m],
  // E17: a house, a service row with its description, a pill with none, an income share; and each chapter's head line
  ['E17/house', 'r2s-under_siege-town-2', 'institutions', /^Beds for merchants on the road\.$/m, [/^Stopped by the siege\. Beds for merchants on the road\.$/m, HEAD_SIEGE]],
  ['E17/service', 'r2s-famine-city-3', 'institutions', /^: Daily bread\./m, /^: Scarce in the famine\. Daily bread\./m],
  ['E17/pill', 'r2s-under_siege-town-2', 'services', /^Accommodation$/m, [/^Accommodation \(stopped\)$/m, HEAD_SIEGE]],
  ['E17/income', 'r2s-under_siege-town-2', 'economics', /^Magical trade conduits generate/m, [/^Stopped by the siege\. Magical trade conduits generate/m, HEAD_SIEGE]],
  // E1: an output is badged EXPORT where the tab's Exports print it, by its own name (a good id is a family)
  ['17065', 'r2s-mass_migration-hamlet-1', 'economics', /^Milled lumber\n {2}EXPORT$/m, /^Milled lumber$/m],
  ['10234', 'r2r-hamlet-16', 'economics', /^Fish oil\n {2}EXPORT$/m, /^Fish oil$/m],
  ['21452', 'r2s-religious_conversion-hamlet-2', 'economics', /^Peat fuel\n {2}EXPORT$/m, /^Coal\n {2}EXPORT$/m],
  ['16334', 'r2s-infiltrated-village-1', 'economics', /^Master-crafted weapons\n {2}EXPORT$/m, /^Master-crafted weapons$/m],
  ['05888', 'r2r-village-52', 'economics', /^Boots and shoes\n {2}EXPORT$/m, /^Leather goods\n {2}EXPORT$/m],
  ['10202', 'r2s-slave_revolt-village-3', 'economics', /^Fired brick\n {2}EXPORT$/m, /^Pottery and ceramics\n {2}EXPORT$/m],
  // E15 (1): the cover names the tab's first export; under a siege that stops trade the tab's Exports print none
  ['29296', 'r2r-village-21', 'cover', /Top export: Salted fish/, null],
  // E18: a criminal house by its label (institutionHouseLabel), no catalogue grade beside it
  ['28960', 'r2r-metropolis-23', 'defense', /Thieves' Guild \(Powerful\)/, /^Thieves' Guild$/m],
];
// [seed, surface, must still print]
const KEEP = [
  ['r2s-famine-city-3', 'services', /^Strategic Crossroads » Coaching inn \+ Customs house » Transit trade profit$/m], // a famine stops no road
  ['r2s-famine-town-1', 'economics', /^Transit duties, warehouse fees, and re-export premiums/m],
  ['r2r-city-0', 'cover', /^Top export: Furs and pelts$/m],
  ['r2r-metropolis-23', 'cover', /^Top export: Recovered artefacts$/m],
];
// A calm town marks nothing and prints no head line (the leaf's own rule: no stopping crisis, no mark).
const CALM = [['r2r-city-0', 'institutions'], ['r2r-city-0', 'services'], ['r2r-city-0', 'economics']];
/** The calm guard's literals (the alternation it held, each a plain literal: exactly equivalent). */
const MARKS = ['ordinary times', 'Stopped by the siege', 'Curtailed by the outbreak', 'Scarce in the famine', '(stopped)', '(curtailed)', '(scarce)'];
/** surface -> a row the calm town really prints there, of the kind the leaf would mark (the liveness anchor) */
const CALM_ROW = /** @type {Record<string, string>} */ ({
  institutions: ': Day-to-day governance of the settlement.', // a service row with its description
  services: 'Full accommodation', // a pill
  economics: 'District-level duties on specialized goods', // an income share's description
});
/** The silent slot's sibling on its own surface: the crisis the cover names in its place (r2r-village-21). */
const SILENT_SLOT_ANCHOR = /^Under Siege$/m;

describe('TAIL-EXPORTS-PDF-2 batch 2: the crisis leaf on the PDF\'s rows, the cover\'s export, a criminal house by its label', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 120000);
  test.each(NOT)('%s %s (%s): not printed', (_id, seed, where, not, instead) => {
    const out = text(seed, where);
    expect(out).toMatch(instead ? [instead].flat()[0] : SILENT_SLOT_ANCHOR);
    // anchored: the positive above (what prints instead, or the cover's crisis row) holds on the same text; ^$/m keep the regex
    expect(out).not.toMatch(not);
    for (const re of instead ? [instead].flat() : []) expect(out).toMatch(re);
  }, 120000);
  test.each(KEEP)('keep %s (%s)', (seed, where, keep) => {
    expect(text(seed, where)).toMatch(keep);
  }, 120000);
  test.each(CALM)('calm %s (%s): no mark, no head line', (seed, where) => {
    const out = text(seed, where);
    for (const mark of MARKS) expectAbsentWithAnchor(out, mark, CALM_ROW[where], `${seed} ${where}`);
  }, 120000);
});
