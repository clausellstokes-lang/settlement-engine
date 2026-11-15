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
 */
import { beforeAll, describe, expect, test, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

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
  ['r2r-town-29', CATCH, 'Short of fish.'], // C22221: the fish market no chain names, its one fishery depleted
  ['bar0-metropolis-calm-rand-8', CATCH, 'Short of fish.'], // C22221 in the town it was read in (River Fisheries depleted)
  ['r2s-under_siege-thorp-0', CATCH, SIEGE], // the fishing community's boats under a siege
  ['r2r-metropolis-14', "Search the archive that cross-checks one road's report against another's.", SIEGE], // C5102
  ['r2r-metropolis-14', 'Have a claim graded against every road the exchange keeps.', SIEGE], // C5102's sibling
  ['r2r-city-48', 'House wine by the jug or bottle.', 'Short of grapes.'], // C25841's class, a calm town ("No grapes reach the vintner.")
  ['bar0-city-under_siege+famine-rand-9', 'House wine by the jug or bottle.', 'Short of grapes.'], // C25841 where it was read
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
