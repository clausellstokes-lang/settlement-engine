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
 *   · (the chair's ruling S8, 2026-11-15) a house TAIL-HOUSES-2 found undeclared for its crisis is unmarked in a census
 *     town under that crisis (the S8 table; each pair red at 2b3736a6d, where the house was NONE or its food only).
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
/** SV7 (BAR3-SERVICES-2, 2026-11-15): a house the siege stops but for a row of its own on offer beside it. */
const SIEGE_PARTLY = 'Curtailed by the siege.';
const OUTBREAK = 'Curtailed by the outbreak.';
const FAMINE = 'Scarce in the famine.';

/** (seed, tab, the description of ordinary times, the mark that must lead it). The worklist row each answers is named. */
const MARKED = [
  ['r2s-under_siege-city-1', 'services', 'Jewellery, fine clothing, and luxury goods from across the world.', SIEGE], // 12206; BAR2-SERVICES SV2 (2026-11-15): re-keyed by its text, it names no spice
  ['r2s-under_siege-city-1', 'services', 'Multiple gated access points. Customs checks and toll collection.', SIEGE], // 06254
  ['r2s-under_siege-city-1', 'services', 'Large-scale commercial facilitation across regional markets.', SIEGE], // 12523
  ['r2s-under_siege-city-1', 'institutions', 'Multiple inn districts catering to merchants, travelers, and long-term visitors.', SIEGE_PARTLY], // HOUSES 14115; BAR3-SERVICES-2 SV7 (2026-11-15): re-keyed, a row of its own goes on
  ['r2s-under_siege-city-1', 'institutions', 'Silks, spices, precious goods.', SIEGE_PARTLY], // BAR3-SERVICES-2 SV7 (2026-11-15): re-keyed, a row of its own goes on
  ['r2s-under_siege-thorp-1', 'services', 'A bed by the hearth and a place at a shared table, for a traveller who asks.', SIEGE], // 02383
  ['r2s-under_siege-thorp-1', 'services', 'Funeral rites, said by the parish priest, who comes or is sent for.', SIEGE], // 09525
  ['r2s-under_siege-thorp-1', 'institutions', 'Services mean a walk of a few miles to the village house of worship.', SIEGE], // HOUSES 17675
  ['r2s-plague_onset-city-0', 'services', 'The largest trading event of the year. Merchants from distant regions.', OUTBREAK], // B19912
  ['r2s-plague_onset-city-0', 'services', 'Major performances, competitions, and public spectacles.', OUTBREAK], // B12194
  ['r2s-plague_onset-city-0', 'services', 'Performers, games, and live music at multiple venues nightly.', OUTBREAK], // 15641
  ['r2s-plague_onset-city-0', 'institutions', 'Merchants from abroad. Letters of credit are honoured.', OUTBREAK],
  ['r2s-famine-hamlet-0', 'services', 'Preserved fish for travel or winter.', FAMINE], // B15064 (the famine failed the fish)
  // re-keyed by identity (TAIL-CRISIS-7): the same house in the same town, its description re-said in TAIL-HOUSES-4 H17's
  // hedge where the fisheries are spent (ba3af420, landed at d5ec9c7f3): a declared rewording of the row, not of its mark
  ['r2s-famine-hamlet-0', 'institutions', 'A crude landing hung with racks for drying and salting the catch. Near water, and whenever fish can be had, it is the chief source of protein.', FAMINE], // HOUSES B13370
  ['r2r-village-58', 'services', 'Grain sold by the sack to a household, straight from the field at harvest.', FAMINE], // 09820 (a famine naming no source failed the crops)
];
/** (seed, tab, a description that must print with NO mark before it): what prints instead of a mark. */
const KEEP = [
  ['r2r-town-2', 'services', 'Beds, meals, and stabling for travelers on the road. Priced by quality.'], // a calm town: the inn's line, unmarked
  ['r2r-town-2', 'institutions', 'Built for the road: relay stabling, coaches on a schedule, meals at set hours, and a room for waiting passengers. Horses are changed here, not merely rested.'],
  // BAR6-HOUSES (2026-11-16): re-keyed by identity, the assertion unchanged: the same row (the butcher's Fresh meat under the
  // siege) prints its hunger twin since the definition declares the hunger family (institutionServices.js); 1 town of this table.
  ['r2s-under_siege-city-1', 'services', 'Whatever meat can be had, slaughtered and dressed on premises or nearby.'], // lives on nothing a siege stops
];
const MARKS = [SIEGE, OUTBREAK, FAMINE];

const SUPPLIED = 'A row marked short is what its house makes when supplied.';
/** S5: (seed, tab, the description, the mark that must lead it). The worklist row each answers is named. */
const SHORT_MARKED = [
  // RE-KEYED BY IDENTITY (BIRTH-3, 2026-11-17; the owner's supply rule, BR5 and BR8): r2s-famine-hamlet-2's dairy farmer now keeps the beasts
  // of the pasture it proves or buys them in; the same row, marked short of livestock, stands in r2r-hamlet-56, whose dairy the
  // story leaves idle (its pasture used up, nothing bought)
  // RE-KEYED BY IDENTITY (the last close's whole check, 2026-11-19; C1 (b), a stale anchor): point 68 (FR21/FR23/FR24: the
  // common proves its pasture) puts r2r-hamlet-56's dairy to work (its Common grazing land; no gap row for the house), so its
  // milk prints unmarked and the tab prints no line of what a short row is. The same row, marked short of livestock, with the
  // line, stands in r2r-hamlet-1944 (the town LASTCLOSE-DOORS named for the same dairy in tailHouses1Gaps; measured at c02735d57).
  ['r2r-hamlet-1944', 'services', 'Daily milk from cattle, goats, or sheep depending on region.', 'Short of livestock.'], // 06271 (was r2r-hamlet-56; before it r2s-famine-hamlet-2)
  // RE-KEYED BY IDENTITY (BIRTH-1, 2026-11-17): the birth now brings clay in for a brickmaker and a potter on a connected road
  // no siege shuts (`resourceGenerator.js :: importsBroughtAtBirth`), so r2s-famine-town-1's brickmaker and
  // r2s-occupied-city-3's potter are fed; the same rows, marked short of clay, stand in r2r-town-54 (a town on no road: the
  // brickmaker's tiles and bricks) and r2r-city-49 (a city on no road: the potter's brick).
  ['r2r-town-54', 'services', 'Curved and flat clay tiles.', 'Short of clay.'], // B05939 (was r2s-famine-town-1)
  ['r2r-town-54', 'services', 'Standard-size fired clay bricks by the cartload.', 'Short of clay.'], // B17588 (was r2s-famine-town-1)
  ['r2r-city-49', 'services', 'Kiln-fired clay bricks for construction.', 'Short of clay.'], // 12416 (the potter's brick; was r2s-occupied-city-3)
];
/** S5 keep pairs: (seed, tab, a description that prints with no "Short of" before it): the input reaches the house. */
const SHORT_KEEP = [
  ['r2r-town-15', 'services', 'Plates, jugs, storage crocks. Functional and cheap.'], // a potter clay reaches
  ['r2r-town-15', 'services', 'Kiln-fired clay bricks for construction.'],
  ['r2s-under_siege-village-3', 'services', 'Evaporation, boiling, or mining to produce raw salt.'], // B06897: the page reads its salt as bought in (no gap line)
  // BAR5-CHAINS (2026-11-16, BRIEF-BAR5 (b), the chair's direction under HW1; re-keyed by identity, the assertion unchanged): the
  // record's fault S7 named is cured: a good the terrain's need list names ("Needed, and not brought in: grapes") is no longer
  // brought by the route alone, so r2r-city-44's vintner and r2s-famine-town-1's glassblower are short, truly (each beside its
  // need line). Measured on the 720 at the tip: 36 of 184 vintner towns hold a vintner its grapes reach (their own ground or an
  // import); 0 of 13 glassblower towns hold a glassblower its sand reaches, so the glassblower's keep row has no town and goes.
  ['r2r-city-1', 'services', 'House wine by the jug or bottle.'], // a vintner its grapes reach (was r2r-city-44)
];

/** S8: (seed, the house's catalogue id, the mark the house takes under the town's crisis). */
const S8_HOUSES = [
  ['r2s-under_siege-village-0', 'fish_market', SIEGE],
  ['r2s-under_siege-metropolis-0', 'cemetery_network', SIEGE_PARTLY], // BAR3-SERVICES-2 SV7 (2026-11-15): re-keyed, a row of its own goes on
  ['r2s-under_siege-city-0', 'chroniclers_exchange', SIEGE],
  ['r2s-under_siege-hamlet-3', 'hunter_s_lodge', SIEGE_PARTLY], // BAR3-SERVICES-3 SV8b (2026-11-15): re-keyed, the town's food record counts game under the siege
  ['r2s-under_siege-village-0', 'cartographer_s_workshop', SIEGE_PARTLY], // BAR3-SERVICES-2 SV7 (2026-11-15): re-keyed, a row of its own goes on
  ['r2s-under_siege-metropolis-0', 'stone_quarry', SIEGE],
  ['r2s-plague_onset-town-0', 'carriers_guild', OUTBREAK],
  ['r2s-plague_onset-hamlet-1', 'periodic_market', OUTBREAK],
  ['r2s-plague_onset-city-0', 'daily_markets', OUTBREAK],
  // keep: the work beyond the gates is a siege's to stop, not an outbreak's (null: unmarked)
  ['r2s-plague_onset-metropolis-0', 'cemetery_network', null],
  ['r2s-plague_onset-hamlet-0', 'hunter_s_lodge', null],
];

/** BATCH 2 (the chair's ruling S11): (seed, tab, the line that must print, the line that must NOT print in its place). The
 *  worklist row each answers is named. A mark's pair: the description prints with its mark (not bare); a reworded or twinned
 *  row's pair: the true line prints and the false one does not. */
const BATCH2 = [
  ['r2s-under_siege-thorp-0', 'services', `${SIEGE} The weekly service. Attendance expected of all residents.`, null], // 30715 (the access house's rite: a walk to another village)
  ['r2s-under_siege-thorp-1', 'services', `${SIEGE} The rite that admits a person to the faith. Required for most civil recognition.`, null], // 22730
  ['r2s-under_siege-hamlet-0', 'services', `${SIEGE} Marriage sanctioned by the faith, legally binding.`, null],
  ['r2s-plague_onset-hamlet-2', 'services', `${OUTBREAK} The rite that admits a person to the faith. Required for most civil recognition.`, null],
  ['r2s-under_siege-city-0', 'services', `${SIEGE} Interment outside the gates. The bearers and the cart are found by the ground.`, null], // 11805, 06145
  ['r2r-city-0', 'services', 'Every parish served. Religious observance accessible to all.', 'Every district has a temple.'], // B06916, 10717
  ['r2s-under_siege-city-1', 'services', 'Every parish served. Religious observance accessible to all.', 'Every district has a temple.'],
  ['r2r-village-0', 'services', 'Essential for carts, carriers, and working horses', 'Essential for transport and cavalry'], // 07253
  ['r2r-thorp-50', 'services', 'Bulk purchase by households and institutions.', 'Bulk purchase by taverns'], // 04603, 31188 (no tavern stands); BAR2-SERVICES SV2 (2026-11-15): the twin re-keyed by its text, it names no inland trader
  ['r2r-village-11', 'services', 'Collects the dues owed and the tithe', "the temple tithe"], // 05233, 29223; BAR5-MARKS (2026-11-16, C42840): re-keyed by its text, the line reworded to name no lord the record does not hold
  ['r2s-under_siege-town-41', 'services', 'Devotional figures, holy images, and reliquaries.', 'Crucifixes'], // X9 22599 (an East-Asian-inspired town); B1(i) (CLOSE-7 BATCH; R24e (2)): re-anchored by the census family's own order: town-1 is a desert town whose row left in the cascade's re-deal; town-41 (coastal) is the family's first non-desert birth holding the row (no east_asian census town in the first 140 siege towns nor 240 others holds it; 'Crucifixes' is in no src file, so its half is read by absence)
  ['r2r-village-29', 'services', 'Arbitrates quarrels before they come to judgment', "the lord's court"], // X9 08236 (no lord, no court)
];
/** BATCH 2 keep pairs: (seed, tab, a line that prints unmarked and unchanged). */
const BATCH2_KEEP = [
  ['r2s-plague_onset-city-0', 'services', 'Interment outside the gates. The bearers and the cart are found by the ground.'], // an outbreak does not stop burial beyond the gates
  ['r2r-thorp-0', 'services', 'The weekly service. Attendance expected of all residents.'], // a calm thorp
  ['r2r-town-0', 'services', 'Bulk purchase by taverns, institutions, and inland traders.'], // a fish market where a tavern stands
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
    // titles, the house-of-work label and the five criminal labels. A `source:` ends at its statement's end too (TAIL-CRISIS-7):
    // `source: entry.source,` in an options call ran on past TAIL-DEFECON-4's prosperity labels (b40f795b, landed at
    // 131dfdbb7) and read 'Subsistence', 'Struggling' and 'Poor' as titles; bounded at `;`, no title the economy writes is lost
    const titles = new Set([...GOOD_SOLD_TITLES, HOUSE_OF_WORK_LABEL, ...CRIMINAL_INCOME_LABELS]);
    for (const file of ['economicState.js', 'tradeGoods.js']) {
      const src = fs.readFileSync(path.resolve(__dirname, '../../src/generators/economy', file), 'utf8');
      for (const m of src.matchAll(/\bsource:([\s\S]*?)(?:,\s*(?:percentage|desc)\b|\n\s*\}|;)/g)) for (const q of m[1].matchAll(/'([A-Z][^']*)'/g)) titles.add(q[1]);
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
    // BAR4-CLOSE-SWEEP (2026-11-16, the chair's 14:38): re-keyed by identity from r2r-town-2 and r2r-city-44, which each hold a sawmill
    // short of timber since BAR4-RECORD's declared reading (505f244f3 R1 rungs, the ninth's HW1 6dd18224a): their tabs print the line,
    // truly. Measured on the 720 at the merged tree (rowShortOf over every service and house row): 354 towns hold no row short; two
    // of them, a town and a city, neither printing the line
    // BAR6-MARKS (2026-11-16): re-keyed by identity from r2r-city-13, which holds a house short of its trade's good since the
    // mark reads it (`houseInputAtHand.js :: housesWantingTradeInput`): its tabs print the line, truly. Measured on the 720 at
    // the seat's tip: 13 towns and cities hold no row short; r2r-city-54 is one
    for (const [seed, tab] of [['r2r-town-0', 'services'], ['r2r-town-0', 'institutions'], ['r2r-city-54', 'services'], ['r2r-city-54', 'institutions']]) if ((await tabText(seed, tab)).includes(SUPPLIED)) failures.push(`${seed} ${tab}: the line of a row marked short, with no row short`);
    expect(failures).toEqual([]);
  }, 600_000);

  test('S8, the houses added: each takes its crisis\'s mark in a census town under that crisis', () => {
    const failures = [];
    for (const [seed, id, mark] of S8_HOUSES) {
      const s = town(seed);
      const inst = (s.institutions || []).find((i) => (i.catalogId || catalogIdForName(i.name)) === id);
      if (!inst) { failures.push(`${seed}: no ${id}`); continue; }
      const got = stoppedRowMark(s, 'house', inst);
      if (got !== mark) failures.push(`${seed} ${id}: "${got}", not "${mark}"`);
    }
    expect(failures).toEqual([]);
  }, 600_000);

  test('BATCH 2 (S11), the births table: the access house\'s rites and burial beyond the gates take their crisis; the temple, cavalry, tithe and taverns read true', async () => {
    const failures = [];
    for (const [seed, tab, prints, not] of BATCH2) {
      const text = await tabText(seed, tab);
      if (!text.includes(prints)) failures.push(`${seed} ${tab}: does not print "${prints}"`);
      if (not && text.includes(not)) failures.push(`${seed} ${tab}: still prints "${not}"`);
    }
    expect(failures).toEqual([]);
  }, 600_000);

  test('BATCH 2 (S11), the keep pairs: an outbreak\'s burial, a calm thorp\'s rite and a tavern town\'s fish market print as before, unmarked', async () => {
    const failures = [];
    for (const [seed, tab, desc] of BATCH2_KEEP) {
      const text = await tabText(seed, tab);
      if (!text.includes(desc)) failures.push(`${seed} ${tab}: the row does not print (${desc})`);
      for (const mark of MARKS) if (text.includes(`${mark} ${desc}`)) failures.push(`${seed} ${tab}: "${desc}" is marked "${mark}"`);
    }
    expect(failures).toEqual([]);
  }, 600_000);
});
