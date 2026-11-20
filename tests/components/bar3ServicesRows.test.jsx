/** @vitest-environment jsdom */
/**
 * bar3ServicesRows.test.jsx — BAR3-SERVICES batch 1 (REVIEW-BAR-3 and the wide read, the chair's directions S1-S3 of
 * 2026-11-15; each vetoable by the owner): the Services tab's rows and the marks a row carries, on births.
 *
 * THIS FILE REDS WHEN (each MARKED and REWORDED pair red at 59185b62a)
 *   · (S3) a fish market or a fishing community the record's chains do not name prints "Fish sold daily from the morning
 *     catch." without "Short of fish." where the page's Depleted list holds every fishery the town has
 *     (`crisisDependence.js :: GROUNDS_WORKED_OFF_CHAIN`);
 *   · (S3) a fishing community or a fisher's landing prints its catch unmarked under a siege (its boats are beyond the walls);
 *   · (S3) the chroniclers' exchange's rows print on offer while the house is stopped by the siege;
 *   · (S3, wide C25841) the vintner's wine prints unmarked where the page says "No grapes reach the vintner." (the S7 table
 *     re-measured: the record no longer holds that gap everywhere);
 *   · (S1) a periodic market's trading day prints unmarked under a siege;
 *   · (S2) a row presumes a body the town lacks: a guild or an organization where the only criminal house is a smuggling
 *     waypoint (the rows reworded to what every printing town bears); the town's own clergy where it has only access to a
 *     neighbour's church (its twin) (REWORDED: what prints instead is named);
 *   · a KEEP pair (a true sibling of each cured row) stops printing unmarked or in its old words.
 *
 * BATCH 2 (BAR3-SERVICES-2, the chair's ruling SV7 of 2026-11-15; vetoable by the owner): A HOUSE IS "STOPPED" ONLY IF
 * EVERY ROW OF IT IS STOPPED. It reds when (each CURTAILED pair red at 52f0a1684)
 *   · a house the siege stops but for a row of its own on offer beside it (a row `SERVICE_FREE_OF_HOUSE` declares free)
 *     reads "Stopped by the siege." on the Institutions tab, in the PDF's Institutions chapter or on the Journal's page,
 *     not "Curtailed by the siege.";
 *   · its free row stops printing on offer (no door word), or a house every row of which is stopped (its rows the siege's
 *     own twins) stops reading "Stopped by the siege." (KEEP_STOPPED).
 *
 * BATCH 3 (BAR3-SERVICES-3, the chair's rulings SV8 and SV7b of 2026-11-15; each vetoable by the owner). It reds when
 * (each FIELD and ON_OFFER pair red at 52f0a1684)
 *   · (SV8) a house that works the town's own land (fields, herds, hives, woods, pits, pans: `crisisDependence.js ::
 *     FIELD_WORK`) prints unmarked under a siege, on the Institutions tab, the PDF or the Journal, or its row prints
 *     unmarked on the Services tab: the record keeps a third of the yield and prints the chain "impaired", so the house
 *     reads "Curtailed by the siege.";
 *   · (SV7b) the coaching inn, whose "Lodging" is the siege's twin that goes on ("the rooms stand mostly empty"), reads
 *     "Stopped by the siege." and not "Curtailed by the siege.";
 *   · (SV8b) a fisher's landing whose fishing chain the record holds (its card "impaired") or a hunter's lodge whose
 *     town's food record counts game reads "Stopped by the siege.", not "Curtailed by the siege.";
 *   · a KEEP pair stops: the same field houses unmarked in a calm town and under an outbreak, the famine's own mark on
 *     farmland, the external mill (its one row the siege's twin that stops: "ground by hand at home") "Stopped", and a
 *     fishing community with no chain on its water and a hunter's lodge with no game on the food record "Stopped".
 */
import { beforeAll, describe, expect, test, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { buildJournalPages } from '../../src/foundry/journalPages.js';
import { markedOnPage } from '../../src/pdf/lib/crisisMarksOnPage.js';
import { institutionDescription } from '../../src/components/new/tabs/InstitutionsTab.jsx';
import { catalogIdForName } from '../../src/data/institutionalCatalog.js';
import { serviceRowsOf } from '../../src/domain/dossier/entityLinks.js';

window.matchMedia = window.matchMedia || vi.fn((query) => ({ media: query, matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }));

const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** A census town (r2r-, r2s-) or a read town (bar0-), as the census's births make it. @param {string} seed */
const born = (seed) => {
  let m = new RegExp(`^r2r-${SIZE}-\\d+$`).exec(seed);
  if (m) return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: m[1] }), null, { seed, customContent: {} });
  m = new RegExp(`^r2s-(\\w+)-${SIZE}-\\d+$`).exec(seed);
  if (m) return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] }), null, { seed, customContent: {} });
  m = new RegExp(`^bar0-${SIZE}-([a-z_+]+)-([a-z_]+)-\\d+$`).exec(seed);
  if (!m) throw new Error(`no configuration for ${seed}`);
  const st = m[2] === 'calm' ? [] : m[2].split('+'); const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: st, _randomizePriorities: true }), null, { seed, customContent: {} });
};

const SIEGE = 'Stopped by the siege.';
const MARKS = [SIEGE, 'Curtailed by the outbreak.', 'Scarce in the famine.', 'Short of'];
const CATCH = 'Fish sold daily from the morning catch. Selection varies by season.';

/** (seed, the row's description of ordinary times, the mark that must lead it). The worklist row named. */
const MARKED = [
  ['r2s-recently_betrayed-metropolis-0', CATCH, 'Short of fish.'], // C22221: the fish market no chain names, its one fishery depleted // RE-KEYED 2026-11-17 (BAR8-FISH-ROWS, ruling BR24, R8): r2r-town-29 buys its fish in ("Salted fish (local river fishery exhausted)"), so its market sells "Preserved fish"; the same claim on a town whose one river fishery is spent and which brings in no fish (IDLE: the row and its mark kept)
  ['r2r-metropolis-45', CATCH, 'Short of fish.'], // C22221 in the town it was read in (River Fisheries depleted) // RE-KEYED 2026-11-17 (BAR8-FISH-ROWS, ruling BR24, R8): bar0-metropolis-calm-rand-8 buys its fish in ("Salted fish (local river fishery exhausted)"), so its market sells "Preserved fish"; the same claim on a metropolis whose fishing grounds are spent and which brings in no fish (IDLE: the row and its mark kept)
  ['r2s-under_siege-thorp-0', CATCH, SIEGE], // the fishing community's boats under a siege
  ['r2r-metropolis-14', "Search the archive that cross-checks one road's report against another's.", SIEGE], // C5102
  ['r2r-metropolis-14', 'Have a claim graded against every road the exchange keeps.', SIEGE], // C5102's sibling
  ['r2r-city-48', 'House wine by the jug or bottle.', 'Short of grapes.'], // C25841's class, a calm town ("No grapes reach the vintner.")
  // RE-KEYED BY IDENTITY 2026-11-18 (LEFT-KEYS K5, R8): the supply rule (BIRTH-3, BR4/BR5) has this town buy its grapes in, and
  // under the siege a house on a bought input is curtailed (crisisStoppedRow.js :: houseDependenceIn, S1 (i)): the row is not bare
  // where it was read, and its mark is the siege's now. The vintner short of grapes keeps its row above (r2r-city-48).
  ['bar0-city-under_siege+famine-rand-9', 'House wine by the jug or bottle.', 'Curtailed by the siege.'], // C25841 where it was read
  ['r2s-under_siege-hamlet-3', 'Fair pricing through competition', SIEGE], // C13905's class: the periodic market's trading day
];
/** (seed, a true sibling that must print unmarked). */
const KEEP = [
  ['r2r-town-15', CATCH], // a fish market on a live river fishery
  ['r2r-town-29', 'Bulk purchase by taverns, institutions, and inland traders.'], // its buyers are fed by the salted import (declared free)
  ['r2r-town-16', 'House wine by the jug or bottle.'], // a vintner the grapes reach
];
/** (seed, old words that must not print, the words that print instead). */
const REWORDED = [
  ['r2r-village-53', 'The guild adjudicates conflicts.', 'Quarrels are settled by those who run the crime here.'], // C14655's class (a smuggling waypoint only)
  ['r2r-village-53', 'The organization decides what flows through here.', 'Those who run the crime here decide what moves through.'], // C14652's class
  ['bar0-hamlet-under_siege-rand-7', 'The guild adjudicates conflicts.', 'Quarrels are settled by those who run the crime here.'], // C14655 where read
  ['r2s-wartime-town-3', 'The organization decides what flows through here.', 'Those who run the crime here decide what moves through.'], // the same row where a Thieves' Guild stands: true there too
  ['bar0-hamlet-under_siege-rand-7', 'delivered by clergy with flexible interpretations of canon', "Absolution on paper, sealed in a distant authority's name and sold to whoever will pay."], // C14664
];
/** (seed, words that must still print: a town with the body the line names). */
const KEEP_WORDS = [
  ['r2r-town-8', 'Formal church forgiveness, delivered by clergy with flexible interpretations of canon.'], // a church of the town's own stands
];

/** @param {string} t */
const esc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** @param {string} text @param {string} mark @param {string} desc */
const markedBefore = (text, mark, desc) => new RegExp(`${esc(mark)}${mark.endsWith('.') ? '' : '[^.]*\\.'} ${esc(desc)}`).test(text);

/** @type {Map<string, any>} */
const towns = new Map();
/** @param {string} seed */
const town = (seed) => { if (!towns.has(seed)) towns.set(seed, born(seed)); return towns.get(seed); };
/** @param {string} seed */
async function servicesText(seed) {
  const s = town(seed);
  cleanup();
  const { ServicesTab } = await import('../../src/components/new/tabs/ServicesTab.jsx');
  return render(<ServicesTab services={s.availableServices} settlement={s} narrativeNote={null} />).container.textContent || '';
}

describe('BAR3-SERVICES batch 1: a row carries the mark its state makes true; a row names the body the town has', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

  test('MARKED: each row prints with its mark before it', async () => {
    const failures = [];
    for (const [seed, desc, mark] of MARKED) {
      const text = await servicesText(seed);
      if (!text.includes(desc)) { failures.push(`${seed}: the row does not print (${desc})`); continue; }
      if (!markedBefore(text, mark, desc)) failures.push(`${seed}: "${desc}" prints without "${mark}"`);
    }
    expect(failures).toEqual([]);
  }, 600_000);

  test('KEEP: each true sibling prints unmarked', async () => {
    const failures = [];
    for (const [seed, desc] of KEEP) {
      const text = await servicesText(seed);
      if (!text.includes(desc)) failures.push(`${seed}: the row does not print (${desc})`);
      for (const mark of MARKS) if (markedBefore(text, mark, desc)) failures.push(`${seed}: "${desc}" is marked "${mark}"`);
    }
    expect(failures).toEqual([]);
  }, 600_000);

  test('REWORDED: the old words print nowhere in these towns, the new words print; KEEP_WORDS still print', async () => {
    const failures = [];
    for (const [seed, old, now] of REWORDED) {
      const text = await servicesText(seed);
      if (text.includes(old)) failures.push(`${seed}: prints "${old}"`);
      if (!text.includes(now)) failures.push(`${seed}: does not print "${now}"`);
    }
    for (const [seed, words] of KEEP_WORDS) if (!(await servicesText(seed)).includes(words)) failures.push(`${seed}: does not print "${words}"`);
    expect(failures).toEqual([]);
  }, 600_000);
});

const CURTAILED = 'Curtailed by the siege.';
/** (seed, the house's roster name, its own row that prints on offer beside it). Smallest to largest. */
const CURTAILED_HOUSES = [
  ['r2s-under_siege-village-0', "Travelers' inn", 'Meals'],
  ['r2s-under_siege-village-0', "Cartographer's workshop", 'Map making'],
  ['r2s-under_siege-town-1', 'Inn (multiple)', 'Meals and drink'],
  ['r2s-under_siege-city-0', 'Luxury goods quarter', 'Custom commissions'],
  ['r2r-metropolis-14', 'Inns and taverns (district)', 'Entertainment'],
  ['r2r-metropolis-14', 'Cemetery network', 'Central register'],
];
/** (seed, a house every row of which the siege stops: its rows say so in the siege's own words). */
const KEEP_STOPPED = [
  ['r2s-under_siege-town-0', 'Annual fair'],
  ['r2s-under_siege-town-0', "Carriers' guild"],
];

/** @param {string} seed @param {string} name */
const houseOf = (seed, name) => (town(seed).institutions || []).find((i) => i && i.name === name);
/** @param {string} seed */
async function institutionsText(seed) {
  const s = town(seed);
  cleanup();
  const { default: InstitutionsTab } = await import('../../src/components/new/tabs/InstitutionsTab.jsx');
  return render(<InstitutionsTab settlement={s} />).container.textContent || '';
}
/** The Journal's Institutions page, as a reader sees it. @param {string} seed */
const journalInstitutions = (seed) => {
  const s = town(seed);
  const page = buildJournalPages(buildViewModel({ settlement: s }), { settlement: s }).find((p) => p.name === 'Institutions');
  return String(page?.markdown ?? '').replace(/\\([\\`*_{}[\]()#+\-.!|>~<])/g, '$1').replace(/&#39;/g, "'");
};

describe('BAR3-SERVICES-2 batch 2 (SV7): a house is "Stopped" only if every row of it is stopped', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

  test('CURTAILED: the house reads "Curtailed by the siege." on the tab, the PDF and the Journal; its free row prints on offer', async () => {
    const failures = [];
    for (const [seed, name, row] of CURTAILED_HOUSES) {
      const inst = houseOf(seed, name);
      if (!inst) { failures.push(`${seed}: no ${name} on the roster`); continue; }
      const desc = String(institutionDescription(inst) || '').trim();
      if (!desc) { failures.push(`${seed}: ${name} has no description to mark`); continue; }
      const tab = await institutionsText(seed);
      if (!tab.includes(`${CURTAILED} ${desc}`)) failures.push(`${seed}: the Institutions tab does not print "${CURTAILED} ${desc}" (${name})`);
      if (!tab.includes(row) || tab.includes(`${row} (stopped)`)) failures.push(`${seed}: ${name}'s "${row}" does not print on offer`);
      const pdf = markedOnPage(town(seed), 'house', inst, desc);
      if (pdf !== `${CURTAILED} ${desc}`) failures.push(`${seed}: the PDF prints "${pdf}" (${name})`);
      const journal = journalInstitutions(seed);
      if (!journal.includes(`${CURTAILED} ${desc}`)) failures.push(`${seed}: the Journal does not print "${CURTAILED} ${desc}" (${name})`);
    }
    expect(failures).toEqual([]);
  }, 600_000);

  test('KEEP_STOPPED: a house every row of which is stopped still reads "Stopped by the siege."', async () => {
    const failures = [];
    for (const [seed, name] of KEEP_STOPPED) {
      const inst = houseOf(seed, name);
      if (!inst) { failures.push(`${seed}: no ${name} on the roster`); continue; }
      const desc = String(institutionDescription(inst) || '').trim();
      if (!desc) { failures.push(`${seed}: ${name} has no description to mark`); continue; }
      if (!(await institutionsText(seed)).includes(`${SIEGE} ${desc}`)) failures.push(`${seed}: ${name} does not read "${SIEGE}" on the tab`);
      if (markedOnPage(town(seed), 'house', inst, desc) !== `${SIEGE} ${desc}`) failures.push(`${seed}: ${name} does not read "${SIEGE}" in the PDF`);
    }
    expect(failures).toEqual([]);
  }, 600_000);
});

/** (seed, the field house's catalogue id, its row on the Services tab or null where it has none). Smallest to largest. */
const FIELD = [
  ['r2s-under_siege-thorp-0', 'subsistence_farming', null],
  ['r2s-under_siege-thorp-3', 'woodcutter_s_camp', null],
  ['r2s-under_siege-hamlet-1', 'dairy_farmer', 'Fresh milk'],
  ['r2s-under_siege-hamlet-2', 'shepherd', 'Livestock management'],
  ['r2s-under_siege-village-2', 'beekeeper', 'Honey'],
  ['r2s-under_siege-village-0', 'farmland', 'Grain at harvest'],
  ['r2s-under_siege-city-0', 'salt_works', 'Salt production'],
  ['r2s-under_siege-city-3', 'mine', 'Raw extraction'],
  ['r2s-under_siege-metropolis-0', 'charcoal_burner', 'Charcoal supply'],
  // SV8b: the work beyond the gates the record holds going on (a fishing chain the landing works; game on the food record)
  ['r2s-under_siege-hamlet-0', 'fisher_s_landing', 'Fresh fish'],
  ['r2s-under_siege-hamlet-3', 'hunter_s_lodge', 'Game meat'],
  ['r2r-village-21', 'fisher_s_landing', 'Salted fish'],
];
/** (seed, a coaching inn whose "Lodging" is the siege twin that goes on). */
const ON_OFFER = [
  ['r2s-under_siege-town-0', 'Coaching inn'],
  ['r2r-metropolis-14', 'Coaching inn'],
];
/** (seed, catalogue id, the mark the house keeps: null for none). */
const KEEP_FIELD = [
  ['r2r-village-3', 'mine', null],
  ['r2s-plague_onset-village-0', 'farmland', null],
  ['r2s-famine-village-0', 'farmland', 'Scarce in the famine.'],
  ['r2r-thorp-45', 'access_to_external_mill', SIEGE],
  // SV8b: the record cannot tell (no chain on the water; no game on the food record): "Stopped by the siege." stands
  ['r2s-under_siege-thorp-0', 'fishing_community', SIEGE],
  ['r2s-under_siege-town-1', 'hunter_s_lodge', SIEGE],
];

/** The siege's partial mark before a description, a short mark (S5) between them where the house is short too. @param {string} text @param {string} desc */
const curtailedBefore = (text, desc) => new RegExp(`${esc(CURTAILED)}( Short of [^.]*\\.)? ${esc(desc)}`).test(text);
/** @param {string} seed @param {string} id */
const houseById = (seed, id) => (town(seed).institutions || []).find((i) => i && (i.catalogId || catalogIdForName(i.name)) === id);
/** @param {string} seed @param {string} house @param {string} name */
const rowOf = (seed, house, name) => serviceRowsOf(town(seed).availableServices).map((x) => x.svc).find((v) => v.institution === house && v.name === name);

describe('BAR3-SERVICES-3 batch 3 (SV8, SV7b): the land worked under a siege is curtailed; a twin that goes on is on offer', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

  test('FIELD: the house reads "Curtailed by the siege." on the tab, the PDF and the Journal, and its row on the Services tab', async () => {
    const failures = [];
    for (const [seed, id, row] of FIELD) {
      const inst = houseById(seed, id);
      if (!inst) { failures.push(`${seed}: no ${id} on the roster`); continue; }
      const desc = String(institutionDescription(inst) || '').trim();
      if (!desc) { failures.push(`${seed}: ${id} has no description to mark`); continue; }
      if (!curtailedBefore(await institutionsText(seed), desc)) failures.push(`${seed}: the Institutions tab does not print "${CURTAILED} ${desc}" (${id})`);
      const pdf = String(markedOnPage(town(seed), 'house', inst, desc));
      if (!curtailedBefore(pdf, desc) || !pdf.startsWith(CURTAILED)) failures.push(`${seed}: the PDF prints "${pdf}" (${id})`);
      if (!curtailedBefore(journalInstitutions(seed), desc)) failures.push(`${seed}: the Journal does not print "${CURTAILED} ${desc}" (${id})`);
      if (row) {
        const svc = rowOf(seed, inst.name, row);
        if (!svc) { failures.push(`${seed}: no "${row}" row of ${inst.name}`); continue; }
        if (!curtailedBefore(await servicesText(seed), String(svc.desc))) failures.push(`${seed}: the Services tab does not print "${CURTAILED} ${svc.desc}" (${row})`);
      }
    }
    expect(failures).toEqual([]);
  }, 600_000);

  test('ON_OFFER: the coaching inn reads "Curtailed by the siege."; its Lodging twin prints on offer, no door word', async () => {
    const failures = [];
    for (const [seed, name] of ON_OFFER) {
      const inst = houseOf(seed, name);
      if (!inst) { failures.push(`${seed}: no ${name} on the roster`); continue; }
      const desc = String(institutionDescription(inst) || '').trim();
      const tab = await institutionsText(seed);
      if (!tab.includes(`${CURTAILED} ${desc}`)) failures.push(`${seed}: the Institutions tab does not print "${CURTAILED} ${desc}"`);
      if (!tab.includes('Lodging') || tab.includes('Lodging (stopped)')) failures.push(`${seed}: "Lodging" does not print on offer`);
      if (markedOnPage(town(seed), 'house', inst, desc) !== `${CURTAILED} ${desc}`) failures.push(`${seed}: the PDF does not print "${CURTAILED}"`);
      if (!journalInstitutions(seed).includes(`${CURTAILED} ${desc}`)) failures.push(`${seed}: the Journal does not print "${CURTAILED}"`);
    }
    expect(failures).toEqual([]);
  }, 600_000);

  test('KEEP_FIELD: the same houses unmarked in a calm town and under an outbreak; the famine and the mill keep their marks', async () => {
    const failures = [];
    for (const [seed, id, mark] of KEEP_FIELD) {
      const inst = houseById(seed, id);
      if (!inst) { failures.push(`${seed}: no ${id} on the roster`); continue; }
      const desc = String(institutionDescription(inst) || '').trim();
      const want = mark ? `${mark} ${desc}` : desc;
      if (markedOnPage(town(seed), 'house', inst, desc) !== want) failures.push(`${seed}: the PDF does not print "${want}" (${id})`);
      const tab = await institutionsText(seed);
      if (!tab.includes(want)) failures.push(`${seed}: the Institutions tab does not print "${want}" (${id})`);
      if (!mark && tab.includes(`${CURTAILED} ${desc}`)) failures.push(`${seed}: ${id} reads "${CURTAILED}" with no siege`);
    }
    expect(failures).toEqual([]);
  }, 600_000);
});
