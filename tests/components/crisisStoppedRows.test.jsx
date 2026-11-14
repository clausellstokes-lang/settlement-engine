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
 */
import { beforeAll, describe, expect, test, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { INSTITUTION_SERVICES } from '../../src/data/institutionServices.js';
import { institutionalCatalog, catalogIdForName } from '../../src/data/institutionalCatalog.js';
import { SERVICE_DEPENDENCE, SERVICE_DEPENDENCE_BY_DESC, HOUSE_DEPENDENCE, DEPENDENCES } from '../../src/data/crisisDependence.js';
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
});
