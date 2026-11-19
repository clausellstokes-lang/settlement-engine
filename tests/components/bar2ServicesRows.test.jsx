/** @vitest-environment jsdom */
/**
 * bar2ServicesRows.test.jsx — BAR2-SERVICES batch 1 (REVIEW-BAR-2, the chair's rulings SV1-SV4 of 2026-11-15; each vetoable
 * by the owner): the Services tab's rows and the marks a row carries, on census births.
 *
 * THIS FILE REDS WHEN
 *   · (SV1) a service row of a house whose row is stopped, curtailed or short of its input prints without its house's mark,
 *     where the row lives on the same thing (the quarry "Stopped by the siege." beside an unmarked "Cut stone"; the fair's
 *     spectacles; the bakers' pastries under a grain famine; the caravanserai's caravans where no camels reach it): the
 *     MARKED table, each pair red at f8042b61a, where a service row read its own line only;
 *   · (SV1) a row the table declares free of its house's dependence (`crisisDependence.js :: SERVICE_FREE_OF_HOUSE`) takes
 *     its house's mark (the KEEP table: what prints instead is the row unmarked);
 *   · (SV2, SV3) a reworded row prints its old words (each red at f8042b61a) or its new words fail to print (the REWORDED
 *     table: what prints instead is named);
 *   · (SV6, batch 2) a house that works or makes from a ground the page prints as depleted (the Resources tab's Depleted
 *     list), with no import feeding a buyer, prints its rows without "Short of <its yield>." (MARKED's SV6 rows, each red at
 *     41ef3a9b4); a buyer the trade record feeds prints unmarked (KEEP);
 *   · (SV4) a house's Backs line names a power by its roster label with a slash ("Military/Guard") instead of the one
 *     leaf's sentence name ("The Guard"): red at f8042b61a.
 */
import { beforeAll, describe, expect, test, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { INSTITUTION_SERVICES } from '../../src/data/institutionServices.js';
import { catalogIdForName } from '../../src/data/institutionalCatalog.js';
import { HOUSE_DEPENDENCE, SERVICE_FREE_OF_HOUSE } from '../../src/data/crisisDependence.js';

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
const MARKS = [SIEGE, OUTBREAK, FAMINE, 'Short of'];

/** SV1: (seed, the row's description of ordinary times, the mark its house carries, which must lead it). Worklist row named. */
const MARKED = [
  ['r2s-under_siege-metropolis-0', 'Dressed stone blocks for construction. Consistency and size matter for fortifications.', SIEGE], // C13957 (the quarry beyond the walls)
  ['r2s-under_siege-metropolis-3', 'Rough stone for road beds and fill. Bulk sale, low value per unit.', SIEGE], // C13957's rubble
  ['r2s-under_siege-city-0', 'Major performances, competitions, and public spectacles.', SIEGE], // C3997 (the fairs stopped)
  ['r2s-famine-city-2', 'Pies, tarts, and pastries. More expensive, available to those who can afford it.', FAMINE], // C4138 (the grain failed)
  ['r2s-under_siege-town-0', 'Fish sold daily from the morning catch. Selection varies by season.', SIEGE], // the fish market under a siege
  ['r2s-plague_onset-town-2', "Read the day's register of arrivals and what each of them reported.", OUTBREAK], // the listening post's arrivals
  ['r2s-famine-metropolis-2', 'Tripe, tallow, bone, hide. Nothing wasted. By-products sold to chandlers and tanners.', FAMINE], // the butchers' livestock
  ['r2r-town-54', 'Assemble merchants with compatible routes into shared caravans for safety and economy.', 'Short of camels.'], // C31592 ("No camels reach the caravanserai.")
  // SV6 (batch 2, the chair's ruling of 2026-11-15): a house on a ground the page prints as depleted is short of it
  // RE-KEYED BY IDENTITY 2026-11-18 (LEFT-KEYS K5, R8): r2r-town-45's Mine works a live gemstone seam beside its spent iron, and a
  // mine is worked out only when every ground of its own is spent (supplyStory.js, BIRTH-3's AMENDMENT 2 (A), LEFT-MARKS M5), so it
  // is at work and its row prints bare, true. The same claim on r2r-town-12: its one seam, iron, spent; "Iron ore (local iron
  // mines exhausted)" bought in for its Blacksmiths and Smelter, not the crews.
  ['r2r-town-12', 'Ore cut underground by the crews and brought out by cart for sorting.', 'Short of iron ore.'], // C10682 (iron ore deposits depleted; the import feeds the smiths, not the crews)
  ['r2r-village-45', 'Fish sold daily from the morning catch. Selection varies by season.', 'Short of fish.'], // C23813, C8434 (fishing grounds depleted) // RE-KEYED 2026-11-17 (BAR8-FISH-ROWS, ruling BR24, R8): r2r-village-11's fish is bought in ("Salted fish (local sea fisheries exhausted)"), so its market sells "Preserved fish" and the catch row prints no more; the same claim on r2r-village-45, a village whose fishing grounds are spent and which brings in no fish (IDLE: the row and its mark kept)
  ['r2r-city-18', 'Dressed stone blocks for construction. Consistency and size matter for fortifications.', 'Short of stone.'], // the quarry's face exhausted
  ['r2r-hamlet-10', 'Catch of the day. Buy and cook same-day.', 'Short of fish.'], // the landing's grounds depleted
];
/** SV1 keep pairs: (seed, a row its house's mark does not reach: it prints unmarked). */
const KEEP = [
  // (BAR3-SERVICES, 2026-11-15: the chroniclers' archive under a siege moved to bar3ServicesRows.test.jsx's MARKED, by the
  // chair's direction S3: its house is stopped and its rows print the same mark)
  ['r2s-under_siege-city-0', 'Performers, games, and live music at multiple venues nightly.'], // the inns' own music
  ['r2r-town-54', 'Experienced route planners select roads based on threat, season, and cargo type.'], // the planners, not the camels
  ['r2s-under_siege-town-1', 'Custom maps to order. Accurate, legible, and durably produced.'], // the cartographer's bench
  ['r2r-town-12', 'Reforge broken tools, re-edge blades, mend ironwork. Often more valuable than new.'], // SV6: the smiths on a spent seam, fed by the iron ore the trade record brings in
];
/** SV2, SV3: (seed, the old words that must not print, the words that print instead). */
const REWORDED = [
  ['r2r-city-0', 'Jewellery, fine clothing, rare spices, and luxury goods from across the world.', 'Jewellery, fine clothing, and luxury goods from across the world.'], // C10654
  ['r2r-thorp-11', 'Slow but broadly legitimate.', 'Matters affecting multiple families go to a council of heads, who settle them slowly, by talk.'], // C23436, C24226
  ['r2r-thorp-50', 'Bulk purchase by households, institutions, and inland traders.', 'Bulk purchase by households and institutions.'], // C23820
];
/** SV4: (seed, the roster label that must not print on a Backs line, the sentence name that prints instead). */
const BACKS = [
  ['r2r-city-0', 'Military/Guard', 'The Guard'], // C0253, C0365 and kin
  ['r2r-city-1', 'Military/Guard', 'The Guard'],
];

/** @param {string} t */
const esc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** Is `desc` printed with `mark` (a crisis's, or "Short of <input>.") before it? @param {string} text @param {string} mark @param {string} desc */
const markedBefore = (text, mark, desc) => new RegExp(`${esc(mark)}${mark.endsWith('.') ? '' : '[^.]*\\.'} ${esc(desc)}`).test(text);

/** @type {Map<string, any>} */
const towns = new Map();
/** @param {string} seed */
const town = (seed) => { if (!towns.has(seed)) towns.set(seed, bornCensus(seed)); return towns.get(seed); };

/** @param {string} seed @param {'services' | 'institutions'} tab */
async function tabText(seed, tab) {
  const s = town(seed);
  cleanup();
  if (tab === 'services') {
    const { ServicesTab } = await import('../../src/components/new/tabs/ServicesTab.jsx');
    return render(<ServicesTab services={s.availableServices} settlement={s} narrativeNote={null} />).container.textContent || '';
  }
  const { default: InstitutionsTab } = await import('../../src/components/new/tabs/InstitutionsTab.jsx');
  return render(<InstitutionsTab settlement={s} />);
}

describe('BAR2-SERVICES batch 1: a service row carries its house\'s mark; four rows reworded or renamed true', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

  test('SV1 MARKED: each row prints with its house\'s mark before it', async () => {
    const failures = [];
    for (const [seed, desc, mark] of MARKED) {
      const text = /** @type {string} */ (await tabText(seed, 'services'));
      if (!text.includes(desc)) { failures.push(`${seed}: the row does not print (${desc})`); continue; }
      if (!markedBefore(text, mark, desc)) failures.push(`${seed}: "${desc}" prints without "${mark}"`);
    }
    expect(failures).toEqual([]);
  }, 600_000);

  test('SV1 KEEP: a row declared free of its house\'s dependence prints unmarked', async () => {
    const failures = [];
    for (const [seed, desc] of KEEP) {
      const text = /** @type {string} */ (await tabText(seed, 'services'));
      if (!text.includes(desc)) failures.push(`${seed}: the row does not print (${desc})`);
      for (const mark of MARKS) if (markedBefore(text, mark, desc)) failures.push(`${seed}: "${desc}" is marked "${mark}"`);
    }
    expect(failures).toEqual([]);
  }, 600_000);

  test('SV2, SV3 REWORDED: the old words print nowhere, the new words print', async () => {
    const failures = [];
    for (const [seed, old, now] of REWORDED) {
      const text = /** @type {string} */ (await tabText(seed, 'services'));
      if (text.includes(old)) failures.push(`${seed}: prints "${old}"`);
      if (!text.includes(now)) failures.push(`${seed}: does not print "${now}"`);
    }
    expect(failures).toEqual([]);
  }, 600_000);

  test('SV4 BACKS: the Backs line names the power by its sentence name', async () => {
    const failures = [];
    for (const [seed, label, said] of BACKS) {
      const { container } = /** @type {any} */ (await tabText(seed, 'institutions'));
      const lines = [...container.querySelectorAll('[data-testid="institution-backs"]')].map((el) => el.textContent || '');
      if (lines.some((l) => l.includes(label))) failures.push(`${seed}: a Backs line prints "${label}"`);
      if (!lines.some((l) => l.includes(said))) failures.push(`${seed}: no Backs line prints "${said}"`);
    }
    expect(failures).toEqual([]);
  }, 600_000);

  test('SV1 the free table names only a house that declares the dependence and a service its menu holds', () => {
    const menus = new Map(Object.entries(INSTITUTION_SERVICES).map(([house, menu]) => [catalogIdForName(house), new Set(Object.keys(menu))]));
    const failures = [];
    for (const [id, rows] of Object.entries(SERVICE_FREE_OF_HOUSE)) {
      const deps = HOUSE_DEPENDENCE[id];
      if (!deps) { failures.push(`${id}: no such house`); continue; }
      for (const [name, freeOf] of Object.entries(rows)) {
        if (id !== 'caravanserai' && !menus.get(id)?.has(name)) failures.push(`${id}: no service "${name}" in its menu`);
        for (const d of freeOf) if (!deps.includes(d)) failures.push(`${id} / ${name}: free of "${d}", which the house does not live on`);
      }
    }
    expect(failures).toEqual([]);
  });
});
