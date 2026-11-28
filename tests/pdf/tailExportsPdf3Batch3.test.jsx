/** @vitest-environment jsdom */
/**
 * tailExportsPdf3Batch3.test.jsx — TAIL-EXPORTS-PDF-3 batch 3 (the chair's rulings E21, E22 and E23 of 2026-11-15):
 * THE LEAF'S SECOND CAUSE ON THE PDF'S ROWS: a house, its service rows and its pills marked short of the input the page
 * says never reaches it, as the Services and Institutions tabs print them (crisisStoppedRow.js :: rowShortOf,
 * rowMarkText, SHORT_WORD), with the leaf's head sentence; the ENTREPÔT tag where a chain on the page is an entrepôt,
 * as the Economics tab's flows say it (domain/display/entrepotShown.js); the origin line under the heading the
 * Overview tab prints over it, on the PDF and in the Foundry journal.
 *
 * One collected guard on births of the census's 720. Each NOT pair printed at the merged base 36eaba1af and must not
 * print; each names what prints instead (or null: silent by design). Each NOW line printed nowhere at the base. Each
 * KEEP pair is a true sibling that must still print.
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
import { Institutions } from '../../src/pdf/sections/Institutions.jsx';
import { Services } from '../../src/pdf/sections/Services.jsx';
import { Overview } from '../../src/pdf/sections/Overview.jsx';
import { buildJournalPages } from '../../src/foundry/journalPages.js';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
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
  if (where === 'institutions') return leaves(Institutions(props)).join('\n');
  if (where === 'services') return leaves(Services(props)).join('\n');
  if (where === 'overview') return leaves(Overview(props)).join('\n');
  if (where === 'journal') return buildJournalPages(vm, { settlement: t }).map((p) => p.markdown).join('\n');
  throw new Error(where);
};

const SUPPLIED = /A row marked short is what its house makes when supplied\./;
/** A line each surface prints on every town (its section heading; the journal's overview list), read off the renders. */
const SURFACE_HEAD = { economics: '\nEconomics & Trade\n', institutions: '\nInstitutions\n', services: '\nServices\n', overview: '\nOverview\n', journal: '- **Tier:** ' };
// [id, seed, surface, must NOT print, what prints instead (one or more; null: the slot is silent by design)]
const NOT = [
  // E22: the leaf's second cause: a house short of its input (the Resources tab's "No timber reaches the charcoal burner.")
  // RE-KEYED BY IDENTITY (BIRTH-3, 2026-11-17; the owner's supply rule, BR4 and BR5): r2r-metropolis-24's charcoal burner now
  // burns the timber the town buys, and r2s-occupied-city-2's salt works refines the salt it buys (a house that runs on
  // bought-in material): the same rows, short, stand in r2s-religious_conversion-hamlet-2 (its burner idle: its woodland used
  // up, nothing bought) and r2r-metropolis-58 (its salt works idle on its spent pans); each house card opens with that town's
  // own description of the house (a hamlet's burner: "Turf-covered kilns ..."; a metropolis's salt works: "Evaporation pans ...")
  ['E22/house 14345', 'r2s-religious_conversion-hamlet-2', 'institutions', /^Turf-covered kilns for burning wood/m, [/^Short of timber\. Turf-covered kilns for burning wood/m, SUPPLIED]],
  ['E22/service', 'r2s-religious_conversion-hamlet-2', 'institutions', /^: Produce and sell charcoal/m, /^: Short of timber\. Produce and sell charcoal/m],
  ['E22/pill', 'r2s-religious_conversion-hamlet-2', 'services', /^Charcoal supply$/m, [/^Charcoal supply \(short\)$/m, SUPPLIED]],
  ['E22/house 23255', 'r2r-metropolis-58', 'institutions', /^Evaporation pans and brine-works/m, /^Short of salt\. Evaporation pans and brine-works/m],
  // E21: ENTREPÔT where a chain on the page is an entrepôt; a thorp whose record flags isEntrepot with no such chain
  ['08499', 'r2s-under_siege-thorp-0', 'economics', /^ENTREPÔT$/m, null],
  ['08499/thorp', 'r2r-thorp-2', 'economics', /^ENTREPÔT$/m, null],
  // E23: the origin line says where, not why: the Overview tab's heading over it
  ['E23/pdf', 'r2r-city-0', 'overview', /Reason settled:/, /^Settlement Origin: $/m],
  ['E23/journal', 'r2r-city-0', 'journal', /Why this place exists/, /^## Settlement Origin$/m],
];
// [seed, surface, now prints (printed nowhere at the base)]
const NOW = [
  ['r2r-city-0', 'economics', /^ENTREPÔT$/m], // the tab's "Entrepôt (1)": the furs chain; the record's flag is absent
];
// [seed, surface, must still print]
const KEEP = [
  ['r2r-hamlet-17', 'economics', /^ENTREPÔT$/m], // the flag and an entrepôt chain both
  ['r2r-metropolis-24', 'institutions', /^Charcoal burner$/m],
  ['r2s-famine-city-3', 'institutions', /^: Scarce in the famine\. Daily bread\./m], // the first cause stands
];
// A town no house of which the page says is short prints no short mark and no supplied line.
// BAR4-CLOSE-SWEEP (2026-11-16, the chair's word of 15:50): re-keyed by identity from r2s-religious_conversion-hamlet-2, whose
// Charcoal burner is short of timber since the round's declared reading of a house's input (BAR4-RECORD b7d3da983, R1: no
// row short there at c4ac1ef84a, short at f19c3b28b), so its tabs print the mark, truly. Measured on the 720 at 7203ec6df (rowShortOf over every service and
// house row): 354 towns hold no row short, 40 of them a hamlet under a forced crisis; this is one, under the same crisis.
// BAR7-CARDS (2026-11-17, BRIEF-BAR7 item 4): re-keyed by identity from r2s-religious_conversion-hamlet-0, whose Carpenter
// (part-time) is short of timber at the joined line's 7e4a64a19 (the same born-short reading as the note above), so its
// tabs and its PDF print the leaf's mark, truly: the PDF is not wrong. Measured at 7e4a64a19 over the census's 24
// religious_conversion towns (`housesShortOfInput`, and the guard's own regex over both surfaces): hamlet-3 holds no
// house short and prints no short mark on either surface; it is the one hamlet of the four, under the same crisis.
const UNSHORT = [['r2s-religious_conversion-hamlet-3', 'institutions'], ['r2s-religious_conversion-hamlet-3', 'services']];

describe('TAIL-EXPORTS-PDF-3 batch 3: the leaf\'s second cause, ENTREPÔT by the page\'s chains, the origin heading', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 120000);
  test('each NOT row: not printed, and what prints instead does (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(NOT, ([id, seed, where, not, instead]) => {
      const row = `${id} ${seed} (${where})`;
      const out = text(seed, where);
      expect(out, `${row}: ${where}: the surface renders`).toContain(SURFACE_HEAD[where]);
      // anchored: the line above proves this surface rendered its own heading on the text this pattern scans
      expect(out, `${row}: not printed`).not.toMatch(not);
      for (const re of instead ? [instead].flat() : []) expect(out, `${row}: prints instead`).toMatch(re);
    }), 'every NOT row: the surface does not print the old line');
  }, 120000);
  test('each NOW row: the line now prints (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(NOW, ([seed, where, now]) => {
      expect(text(seed, where), `now ${seed} (${where})`).toMatch(now);
    }), 'every NOW row: the line printed nowhere at the base now prints');
  }, 120000);
  test('each KEEP row: the true sibling still prints (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP, ([seed, where, keep]) => {
      expect(text(seed, where), `keep ${seed} (${where})`).toMatch(keep);
    }), 'every KEEP row: the true sibling still prints');
  }, 120000);
  test('each UNSHORT row: no short mark (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(UNSHORT, ([seed, where]) => {
      const out = text(seed, where);
      expect(out, `unshort ${seed} (${where}): ${where}: the surface renders`).toContain(SURFACE_HEAD[where]);
      // anchored: the line above proves this surface rendered its own heading on the text this pattern scans
      expect(out, `unshort ${seed} (${where}): no short mark`).not.toMatch(/Short of |\((?:[a-z]+, )?short\)|A row marked short/);
    }), 'every UNSHORT row: a town no house of which is short prints no short mark');
  }, 120000);
});
