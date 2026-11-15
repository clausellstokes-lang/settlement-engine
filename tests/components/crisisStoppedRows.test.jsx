/** @vitest-environment jsdom */
/**
 * crisisStoppedRows.test.jsx — TAIL-SERVICES, the chair's ruling S1 (2026-11-14): a row of ORDINARY TIMES under a siege,
 * an outbreak or a famine is MARKED before its description, on the Services tab and the Institutions tab both, and each
 * tab says once at its head that its descriptions are of ordinary times. One leaf decides
 * (src/domain/display/crisisStoppedRow.js) from one table (src/data/crisisDependence.js).
 *
 * THIS FILE REDS WHEN
 *   · a census town prints one of the rows below under its crisis WITHOUT the mark before it (the births table; each
 *     pair red at the joined line bcad1a358, where nothing marks a row);
 *   · a calm town, or a row that lives on nothing the crisis stops, takes a mark (the keep pairs);
 *   · the table misses a service name or a catalogue id, or names one that does not exist (the walker).
 *   · (the chair's ruling S6, 2026-11-15) the leaf does not answer for a supply chain's row or an income source's share
 *     from the same table, with the same marks: a census town's chain or share that lives on what its crisis stops is
 *     unmarked (the chain births table; each pair red at de0a3d237, where the leaf answered for services and houses
 *     only), a chain or share that lives on nothing the crisis stops, or any in a calm town, is marked (its keep
 *     pairs), or the table misses a chain id or an income title the economy writes, or names one it does not (the walker).
 *   · (the chair's ruling S5, 2026-11-15) a row its house makes from an input the page says never reaches that house
 *     ("No grapes reach the vintner.") prints without "Short of <input>." before it, on either tab, or the tab without
 *     the line of what such a row is (the S5 births table; each pair red at d7c032485, where the leaf had one cause);
 *     a house the input reaches, or a calm town with no such gap, takes the mark (its keep pairs).
 */
import { beforeAll, describe, expect, test, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { INSTITUTION_SERVICES } from '../../src/data/institutionServices.js';
import { institutionalCatalog, catalogIdForName } from '../../src/data/institutionalCatalog.js';
import { SERVICE_DEPENDENCE, SERVICE_DEPENDENCE_BY_DESC, HOUSE_DEPENDENCE, CHAIN_DEPENDENCE, INCOME_DEPENDENCE, DEPENDENCES } from '../../src/data/crisisDependence.js';
import { SUPPLY_CHAIN_NEEDS } from '../../src/data/supplyChainData.js';
import { GOOD_SOLD_TITLES, HOUSE_OF_WORK_LABEL } from '../../src/generators/economy/incomeLineSiblings.js';
import { CRIMINAL_INCOME_LABELS } from '../../src/domain/worldPulse/treasury.js';
import { rowStoppedBy, stoppedRowMark } from '../../src/domain/display/crisisStoppedRow.js';
import fs from 'node:fs';
import path from 'node:path';

window.matchMedia = window.matchMedia || vi.fn((query) => ({ media: query, matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }));

const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** A census town, as its births script makes it. @param {string} seed */
const bornCensus = (seed) => {
  const forced = /^r2s-(.+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(seed);
  const calm = /^r2r-(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(seed);
  const tier = forced ? forced[2] : /** @type {RegExpExecArray} */ (calm)[1];
  const cfg = forced ? { ...DEFAULT_CONFIG, ...dials, settType: tier, selectedStressesRandom: false, selectedStresses: [forced[1]] } : { ...DEFAULT_CONFIG, ...dials, settType: tier };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
};

const SIEGE = 'Stopped by the siege.';
const OUTBREAK = 'Curtailed by the outbreak.';
const FAMINE = 'Scarce in the famine.';

/** (seed, tab, the description of ordinary times, the mark that must lead it). The worklist row each answers is named. */
const MARKED = [
  ['r2s-under_siege-city-1', 'services', 'Jewellery, fine clothing, rare spices, and luxury goods from across the world.', SIEGE], // 12206
  ['r2s-under_siege-city-1', 'services', 'Multiple gated access points. Customs checks and toll collection.', SIEGE], // 06254
  ['r2s-under_siege-city-1', 'services', 'Large-scale commercial facilitation across regional markets.', SIEGE], // 12523
  ['r2s-under_siege-city-1', 'institutions', 'Multiple inn districts catering to merchants, travelers, and long-term visitors.', SIEGE], // HOUSES 14115
  ['r2s-under_siege-city-1', 'institutions', 'Silks, spices, precious goods.', SIEGE],
  ['r2s-under_siege-thorp-1', 'services', 'A bed by the hearth and a place at a shared table, for a traveller who asks.', SIEGE], // 02383
  ['r2s-under_siege-thorp-1', 'services', 'Funeral rites, said by the parish priest, who comes or is sent for.', SIEGE], // 09525
  ['r2s-under_siege-thorp-1', 'institutions', 'Services mean a walk of a few miles to the village house of worship.', SIEGE], // HOUSES 17675
  ['r2s-plague_onset-city-0', 'services', 'The largest trading event of the year. Merchants from distant regions.', OUTBREAK], // B19912
  ['r2s-plague_onset-city-0', 'services', 'Major performances, competitions, and public spectacles.', OUTBREAK], // B12194
  ['r2s-plague_onset-city-0', 'services', 'Performers, games, and live music at multiple venues nightly.', OUTBREAK], // 15641
  ['r2s-plague_onset-city-0', 'institutions', 'Merchants from abroad. Letters of credit are honoured.', OUTBREAK],
  ['r2s-famine-hamlet-0', 'services', 'Preserved fish for travel or winter.', FAMINE], // B15064 (the famine failed the fish)
  ['r2s-famine-hamlet-0', 'institutions', 'A crude landing hung with racks for drying and salting the catch. Near water, it is the chief source of protein.', FAMINE], // HOUSES B13370
  ['r2r-village-58', 'services', 'Grain sold by the sack to a household, straight from the field at harvest.', FAMINE], // 09820 (a famine naming no source failed the crops)
];
/** (seed, tab, a description that must print with NO mark before it): what prints instead of a mark. */
const KEEP = [
  ['r2r-town-2', 'services', 'Beds, meals, and stabling for travelers on the road. Priced by quality.'], // a calm town: the inn's line, unmarked
  ['r2r-town-2', 'institutions', 'Built for the road: relay stabling, coaches on a schedule, meals at set hours, and a room for waiting passengers. Horses are changed here, not merely rested.'],
  ['r2s-under_siege-city-1', 'services', 'Beef, pork, mutton. Slaughtered and dressed on premises or nearby.'], // lives on nothing a siege stops
];
const MARKS = [SIEGE, OUTBREAK, FAMINE];

const SUPPLIED = 'A row marked short is what its house makes when supplied.';
/** S5: (seed, tab, the description, the mark that must lead it). The worklist row each answers is named. */
const SHORT_MARKED = [
  ['r2s-famine-hamlet-2', 'services', 'Daily milk from cattle, goats, or sheep depending on region.', 'Short of livestock.'], // 06271
  ['r2s-famine-town-1', 'services', 'Curved and flat clay tiles.', 'Short of clay.'], // B05939
  ['r2s-famine-town-1', 'services', 'Standard-size fired clay bricks by the cartload.', 'Short of clay.'], // B17588
  ['r2s-occupied-city-3', 'services', 'Kiln-fired clay bricks for construction.', 'Short of clay.'], // 12416 (the potter's brick)
];
/** S5 keep pairs: (seed, tab, a description that prints with no "Short of" before it): the input reaches the house. */
const SHORT_KEEP = [
  ['r2r-town-15', 'services', 'Plates, jugs, storage crocks. Functional and cheap.'], // a potter clay reaches
  ['r2r-town-15', 'services', 'Kiln-fired clay bricks for construction.'],
  ['r2s-under_siege-village-3', 'services', 'Evaporation, boiling, or mining to produce raw salt.'], // B06897: the page reads its salt as bought in (no gap line)
  // S7: the vintner's and the glassblower's gaps hold in every census town that holds the house: the record's fault, unmarked
  ['r2r-city-44', 'services', 'House wine by the jug or bottle.'], // 10827, left to the record's measuring seat
  ['r2s-famine-town-1', 'services', 'Bottles, flasks, and cups.'], // B04346, the same
];

/** S6: (seed, kind, the record's key: a chain's `chainId` or an income source's `source`, the mark it must take). */
const CHAIN_INCOME_MARKED = [
  ['r2s-under_siege-town-0', 'chain', 'crossroads_trade', SIEGE], // "Strategic Crossroads » Toll bridge + … » Transit trade profit"
  ['r2s-under_siege-town-0', 'income', 'Toll Revenue', SIEGE], // "Toll Revenue: n%"
  ['r2s-under_siege-town-0', 'chain', 'caravan_trade', SIEGE],
  ['r2s-under_siege-city-1', 'income', 'Gate Tolls', SIEGE],
  ['r2s-under_siege-city-0', 'income', 'Port Duties', SIEGE],
  ['r2s-under_siege-city-0', 'chain', 'harbour_trade', SIEGE],
  ['r2s-under_siege-hamlet-1', 'chain', 'pilgrimage', SIEGE],
  ['r2s-famine-town-1', 'income', 'Grain Sales', FAMINE], // "Grain Sales: n%" under a grain famine
  ['r2s-famine-village-0', 'chain', 'grain', FAMINE],
  ['r2s-famine-hamlet-0', 'chain', 'fishing', FAMINE], // the famine failed the fish
  ['r2s-famine-hamlet-0', 'income', 'Fish & Maritime Produce', FAMINE],
  ['r2s-famine-hamlet-3', 'chain', 'livestock', FAMINE], // the famine failed the livestock
  ['r2s-plague_onset-village-1', 'income', 'Market Taxes', OUTBREAK],
  ['r2s-plague_onset-village-1', 'income', 'Toll Revenue', OUTBREAK],
];
/** S6 keep pairs: (seed, kind, key) the record holds and the leaf leaves unmarked: the town's own work, or a calm town. */
const CHAIN_INCOME_KEEP = [
  ['r2s-under_siege-town-0', 'income', 'Market Taxes'], // a market inside the walls still trades
  ['r2s-under_siege-town-0', 'income', 'Iron & Metalwork'],
  ['r2s-under_siege-town-0', 'chain', 'iron'],
  ['r2s-famine-town-1', 'income', 'Toll Revenue'], // a famine does not close the road
  ['r2s-famine-town-1', 'chain', 'crossroads_trade'],
  ['r2r-town-2', 'income', 'Grain Sales'], // a calm town
  ['r2r-town-2', 'chain', 'caravan_trade'],
];
/** The record's row of that key. @param {any} s @param {string} kind @param {string} key */
const economyRow = (s, kind, key) => kind === 'chain'
  ? (s.economicState?.activeChains || []).find((c) => c.chainId === key)
  : (s.economicState?.incomeSources || []).find((i) => i.source === key);

/** @type {Map<string, any>} */
const towns = new Map();
/** @param {string} seed */
const town = (seed) => { if (!towns.has(seed)) towns.set(seed, bornCensus(seed)); return towns.get(seed); };

/** The tab's text, rendered as the dossier mounts it. @param {string} seed @param {string} tab */
async function tabText(seed, tab) {
  const s = town(seed);
  cleanup();
  if (tab === 'services') {
    const { ServicesTab } = await import('../../src/components/new/tabs/ServicesTab.jsx');
    return render(<ServicesTab services={s.availableServices} settlement={s} narrativeNote={null} />).container.textContent || '';
  }
  const { default: InstitutionsTab } = await import('../../src/components/new/tabs/InstitutionsTab.jsx');
  return render(<InstitutionsTab settlement={s} />).container.textContent || '';
}

describe('TAIL-SERVICES S1: a row of ordinary times under a crisis is marked, on the Services and Institutions tabs', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

  test('the births table: each description prints under its crisis with the mark before it, and the tab heads with the line of ordinary times', async () => {
    const failures = [];
    for (const [seed, tab, desc, mark] of MARKED) {
      const text = await tabText(seed, tab);
      if (!text.includes(desc)) { failures.push(`${seed} ${tab}: the row does not print (${desc})`); continue; }
      if (!text.includes(`${mark} ${desc}`)) failures.push(`${seed} ${tab}: "${desc}" prints without "${mark}"`);
      if (!text.includes('The descriptions here are of ordinary times.')) failures.push(`${seed} ${tab}: no line of ordinary times`);
    }
    expect(failures).toEqual([]);
  }, 600_000);

  test('the keep pairs: a calm town and a row that lives on nothing the crisis stops print their description unmarked', async () => {
    const failures = [];
    for (const [seed, tab, desc] of KEEP) {
      const text = await tabText(seed, tab);
      if (!text.includes(desc)) failures.push(`${seed} ${tab}: the row does not print (${desc})`);
      for (const mark of MARKS) if (text.includes(`${mark} ${desc}`)) failures.push(`${seed} ${tab}: "${desc}" is marked "${mark}"`);
      if (seed.startsWith('r2r-town-2') && text.includes('The descriptions here are of ordinary times.')) failures.push(`${seed} ${tab}: a calm town prints the line of ordinary times`);
    }
    expect(failures).toEqual([]);
  }, 600_000);

  test('the walker: every service name and every catalogue id is declared, and nothing else', () => {
    const names = new Set(Object.values(INSTITUTION_SERVICES).flatMap((menu) => Object.keys(menu)));
    // the informal rows servicesGenerator.js writes: its `name:` literals, its hoisted names, its addCrimeService names
    const src = fs.readFileSync(path.resolve(__dirname, '../../src/generators/servicesGenerator.js'), 'utf8');
    const consts = Object.fromEntries([...src.matchAll(/^const ([A-Z_]+) = '([^']+)';/gm)].map((m) => [m[1], m[2]]));
    for (const m of src.matchAll(/name: '([^']+)'/g)) names.add(m[1]);
    for (const m of src.matchAll(/name: ([A-Z_]+),/g)) names.add(consts[m[1]]);
    for (const m of src.matchAll(/addCrimeService\(\s*(?:'([^']+)'|([A-Z_]+))/g)) names.add(m[1] || consts[m[2]]);
    const declared = new Set(Object.keys(SERVICE_DEPENDENCE));
    expect([...names].filter((n) => !declared.has(n)), 'a service with no declaration').toEqual([]);
    expect([...declared].filter((n) => !names.has(n)), 'a declaration naming no service').toEqual([]);
    for (const [name, byDesc] of Object.entries(SERVICE_DEPENDENCE_BY_DESC)) {
      const descs = Object.values(INSTITUTION_SERVICES).map((menu) => menu[name]?.desc).filter(Boolean);
      expect(Object.keys(byDesc).filter((d) => !descs.includes(d)), `${name}: a description no menu writes`).toEqual([]);
    }
    const ids = new Set();
    for (const block of Object.values(institutionalCatalog)) for (const shelf of Object.values(block)) for (const name of Object.keys(shelf)) ids.add(catalogIdForName(name));
    const houses = new Set(Object.keys(HOUSE_DEPENDENCE));
    expect([...ids].filter((i) => !houses.has(i)), 'a house with no declaration').toEqual([]);
    expect([...houses].filter((i) => !ids.has(i)), 'a declaration naming no house').toEqual([]);
    const words = new Set(DEPENDENCES);
    const all = [...Object.values(SERVICE_DEPENDENCE), ...Object.values(HOUSE_DEPENDENCE), ...Object.values(SERVICE_DEPENDENCE_BY_DESC).flatMap((m) => Object.values(m))];
    expect(all.flat().filter((d) => !words.has(d)), 'a word outside the dependences').toEqual([]);
  });

  test('S6, the chain births table: a chain or an income share that lives on what its crisis stops takes the crisis\'s mark', () => {
    const failures = [];
    for (const [seed, kind, key, mark] of CHAIN_INCOME_MARKED) {
      const s = town(seed);
      const row = economyRow(s, kind, key);
      if (!row) { failures.push(`${seed}: the record holds no ${kind} ${key}`); continue; }
      const got = stoppedRowMark(s, /** @type {any} */ (kind), row);
      if (got !== mark) failures.push(`${seed} ${kind} ${key}: "${got}", not "${mark}"`);
    }
    expect(failures).toEqual([]);
  }, 600_000);

  test('S6, the keep pairs: the town\'s own work, and every chain and share of a calm town, take no mark', () => {
    const failures = [];
    for (const [seed, kind, key] of CHAIN_INCOME_KEEP) {
      const s = town(seed);
      const row = economyRow(s, kind, key);
      if (!row) { failures.push(`${seed}: the record holds no ${kind} ${key}`); continue; }
      const got = rowStoppedBy(s, /** @type {any} */ (kind), row);
      if (got !== null) failures.push(`${seed} ${kind} ${key}: marked by ${got}`);
    }
    const calm = town('r2r-town-2');
    for (const c of calm.economicState?.activeChains || []) if (rowStoppedBy(calm, 'chain', c)) failures.push(`r2r-town-2 chain ${c.chainId}: marked in a calm town`);
    for (const i of calm.economicState?.incomeSources || []) if (rowStoppedBy(calm, 'income', i)) failures.push(`r2r-town-2 income ${i.source}: marked in a calm town`);
    expect(failures).toEqual([]);
  }, 600_000);

  test('S6, the walker: every chain id and every income title the economy writes is declared, and nothing else', () => {
    const chainIds = new Set(Object.values(SUPPLY_CHAIN_NEEDS).flatMap((need) => (need.chains || []).map((c) => c.id)));
    const chains = new Set(Object.keys(CHAIN_DEPENDENCE));
    expect([...chainIds].filter((i) => !chains.has(i)), 'a chain with no declaration').toEqual([]);
    expect([...chains].filter((i) => !chainIds.has(i)), 'a declaration naming no chain').toEqual([]);
    // the titles: every quoted title in a `source:` of the economy's two writers (ternaries included), the kept rows'
    // titles, the house-of-work label and the five criminal labels
    const titles = new Set([...GOOD_SOLD_TITLES, HOUSE_OF_WORK_LABEL, ...CRIMINAL_INCOME_LABELS]);
    for (const file of ['economicState.js', 'tradeGoods.js']) {
      const src = fs.readFileSync(path.resolve(__dirname, '../../src/generators/economy', file), 'utf8');
      for (const m of src.matchAll(/\bsource:([\s\S]*?)(?:,\s*(?:percentage|desc)\b|\n\s*\})/g)) for (const q of m[1].matchAll(/'([A-Z][^']*)'/g)) titles.add(q[1]);
    }
    const declared = new Set(Object.keys(INCOME_DEPENDENCE));
    expect([...titles].filter((t) => !declared.has(t)), 'an income title with no declaration').toEqual([]);
    expect([...declared].filter((t) => !titles.has(t)), 'a declaration naming no income title').toEqual([]);
    const words = new Set(DEPENDENCES);
    expect([...Object.values(CHAIN_DEPENDENCE), ...Object.values(INCOME_DEPENDENCE)].flat().filter((d) => !words.has(d)), 'a word outside the dependences').toEqual([]);
  });

  test('S5, the births table: a row its house makes from an input that never reaches it is marked short, and the tab says what such a row is', async () => {
    const failures = [];
    for (const [seed, tab, desc, mark] of SHORT_MARKED) {
      const text = await tabText(seed, tab);
      if (!text.includes(desc)) { failures.push(`${seed} ${tab}: the row does not print (${desc})`); continue; }
      if (!new RegExp(`${mark.replace(/[.]/g, '\\.')} ${desc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(text)) failures.push(`${seed} ${tab}: "${desc}" prints without "${mark}"`);
      if (!text.includes(SUPPLIED)) failures.push(`${seed} ${tab}: no line of what a row marked short is`);
    }
    expect(failures).toEqual([]);
  }, 600_000);

  test('S5, the keep pairs: a row whose house the input reaches prints unmarked, and a town with no such gap prints no line of it', async () => {
    const failures = [];
    for (const [seed, tab, desc] of SHORT_KEEP) {
      const text = await tabText(seed, tab);
      if (!text.includes(desc)) { failures.push(`${seed} ${tab}: the row does not print (${desc})`); continue; }
      if (new RegExp(`Short of [^.]+\\. ${desc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(text)) failures.push(`${seed} ${tab}: "${desc}" is marked short`);
    }
    // r2r-town-2 holds no short house; r2r-city-44's only short house is its vintner (S7): neither prints the line
    for (const [seed, tab] of [['r2r-town-2', 'services'], ['r2r-town-2', 'institutions'], ['r2r-city-44', 'services'], ['r2r-city-44', 'institutions']]) if ((await tabText(seed, tab)).includes(SUPPLIED)) failures.push(`${seed} ${tab}: the line of a row marked short, with no row short`);
    expect(failures).toEqual([]);
  }, 600_000);
});
