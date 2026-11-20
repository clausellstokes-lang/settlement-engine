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
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

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
// BAR7-CARDS (2026-11-17, BRIEF-BAR7 item 4): E17/house and E17/pill RE-KEYED BY IDENTITY. The PDF is not wrong: at the joined
// line's 7e4a64a19 its Institutions and Services chapters of r2s-under_siege-town-2 print the siege's head line, and the leaf
// (`crisisStoppedRow.js :: ordinaryTimesLine`, the one the tabs print) now ends it with its second cause's sentence on the
// same line, because the town's Tanners and Cobbler's guild are marked short of hides (TAIL-EXPORTS-PDF-3's declared reading,
// ruling E22). The `$` of HEAD_SIEGE made the anchor untrue. Measured at 7e4a64a19: no other siege town of the census's 720
// (the 24 forced and the 7 drawn) prints the bare line beside a curtailed inn row or a stopped Accommodation pill, so the
// claim stays on its own town, the line anchored whole as the leaf prints it there (the same literal form, ^…$).
const HEAD_SIEGE_SUPPLIED = /^The descriptions here are of ordinary times\. While the siege lasts, a row it touches is marked\. A row marked short is what its house makes when supplied\.$/m;
// [id, seed, surface, must NOT print, what prints instead (one or more; null: the slot is silent by design); the
// chapter's head line is the leaf's (ordinaryTimesLine)]
const NOT = [
  // E17: the chain rows of the worklist, marked by the leaf (crisisStoppedRow.js :: rowStoppedBy 'chain')
  // RE-KEYED BY IDENTITY (PDF-2 items 5 and 6, BRIEF-BAR8, 2026-11-17; rule R8): the Services card now reads the chain the
  // tab's card renders (`crisisMarksOnPage.js :: chainCardOnPage`), which the famine leaves impaired with its yield refused,
  // so its outputs print as the tab's card prints them, under "Normally yields". The claim is kept: the false bare line is
  // not printed, and what prints instead is the famine's mark before the card's line.
  ['11357', 'r2s-famine-town-1', 'services', /^Grain fields » Mills » Baked goods$/m, /^Scarce in the famine\. Grain fields » Mills » Normally yields: Baked goods$/m],
  ['11346', 'r2s-famine-town-1', 'services', /^Grain fields » Brewery » Ale/m, /^Scarce in the famine\. Grain fields » Brewery » Normally yields: Ale/m],
  ['25077', 'r2r-metropolis-14', 'services', /^Strategic Crossroads » Toll bridge/m, /^Stopped by the siege\. Strategic Crossroads » Toll bridge/m],
  ['25075', 'r2s-plague_onset-city-0', 'services', /^Strategic Crossroads » Coaching inn » Transit trade profit$/m, /^Curtailed by the outbreak\. Strategic Crossroads » Coaching inn/m],
  // E17: a house, a service row with its description, a pill with none, an income share; and each chapter's head line
  // BAR3-SERVICES-2 SV7 (2026-11-15): re-keyed, a row of its own goes on (its "Meals and drink"): the inn reads "Curtailed by the siege."
  // RE-KEYED BY IDENTITY (BIRTH-3, 2026-11-17; the chair's AMENDMENT 1 (2), the trade catalog's one good): this town's Tanners and
  // Cobbler's guild now read their hides bought in with its "Wool, dairy, and livestock" (the livestock good's import), so no row
  // is short here and the siege's head line ends where it did before BAR7-CARDS (HEAD_SIEGE, as E17/income reads it)
  ['E17/house', 'r2s-under_siege-town-2', 'institutions', /^Beds for merchants on the road\.$/m, [/^Curtailed by the siege\. Beds for merchants on the road\.$/m, HEAD_SIEGE]], // re-keyed BAR7-CARDS 2026-11-17 (above),
  ['E17/service', 'r2s-famine-city-3', 'institutions', /^: Daily bread\./m, /^: Scarce in the famine\. Daily bread\./m],
  ['E17/pill', 'r2s-under_siege-town-2', 'services', /^Accommodation$/m, [/^Accommodation \(stopped\)$/m, HEAD_SIEGE]], // re-keyed BIRTH-3 2026-11-17 (above, E17/house) // re-keyed BAR7-CARDS 2026-11-17 (above),
  ['E17/income', 'r2s-under_siege-town-2', 'economics', /^Magical trade conduits generate/m, [/^Stopped by the siege\. Magical trade conduits generate/m, HEAD_SIEGE]],
  // E1: an output is badged EXPORT where the tab's Exports print it, by its own name (a good id is a family)
  ['17065', 'r2s-mass_migration-hamlet-1', 'economics', /^Milled lumber\n {2}EXPORT$/m, /^Milled lumber$/m],
  ['10234', 'r2r-hamlet-16', 'economics', /^Fish oil\n {2}EXPORT$/m, /^Fish oil$/m],
  ['21452', 'r2s-religious_conversion-hamlet-2', 'economics', /^Peat fuel\n {2}EXPORT$/m, /^Coal\n {2}EXPORT$/m],
  // RE-KEYED BY IDENTITY (SEAM-ECON item 6, 2026-11-17; BRIEF-BAR6-SEAM rule S5): BAR6-RECORD's declared cures made both
  // anchors untrue. (a) fine arms are made only beside Blacksmiths (3-10) or Specialized metalworkers, so the infiltrated
  // village (a lone Blacksmith) no longer prints 'Master-crafted weapons': the claim (the fine arms printed, unbadged,
  // beside an Exports list of the same family, "Weapons and armour") moves to r2r-town-5. (b) the leatherworkers' goods
  // need a cobbler, so r2r-village-52 (a Tannery) exports no 'Leather goods' and no town of the 720 prints the boots on a
  // card beside exported leather goods: the row keeps its town and its false line, and what prints instead is the
  // boots unbadged (the form of 17065 and 10234 above).
  ['16334', 'r2r-town-5', 'economics', /^Master-crafted weapons\n {2}EXPORT$/m, /^Master-crafted weapons$/m],
  ['05888', 'r2r-village-52', 'economics', /^Boots and shoes\n {2}EXPORT$/m, /^Boots and shoes$/m],
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
  test('every NOT row: not printed (every row runs; each failure names its id, seed and surface)', () => {
    expectNoSeedFailures(collectSeedFailures(NOT, ([_id, seed, where, not, instead]) => {
      const out = text(seed, where);
      expect(out, `${_id} ${seed} (${where}): what prints instead`).toMatch(instead ? [instead].flat()[0] : SILENT_SLOT_ANCHOR);
      // anchored: the positive above (what prints instead, or the cover's crisis row) holds on the same text; ^$/m keep the regex
      expect(out, `${_id} ${seed} (${where}): not printed`).not.toMatch(not);
      for (const re of instead ? [instead].flat() : []) expect(out, `${_id} ${seed} (${where}): ${re} prints`).toMatch(re);
    }), 'every NOT row: the false line is not printed, and what prints instead does');
  }, 120000);
  test('every KEEP row: keep (every row runs; each failure names its seed and surface)', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP, ([seed, where, keep]) => {
      expect(text(seed, where), `keep ${seed} (${where})`).toMatch(keep);
    }), 'every KEEP row still prints');
  }, 120000);
  test('every CALM row: no mark, no head line (every row runs; each failure names its seed and surface)', () => {
    expectNoSeedFailures(collectSeedFailures(CALM, ([seed, where]) => {
      const out = text(seed, where);
      for (const mark of MARKS) expectAbsentWithAnchor(out, mark, CALM_ROW[where], `${seed} ${where}`);
    }), 'every CALM row: a calm town marks nothing and prints no head line');
  }, 120000);
});
