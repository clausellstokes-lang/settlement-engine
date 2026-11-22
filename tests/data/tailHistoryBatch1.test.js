/**
 * TAIL-HISTORY batch 1 (2026-11-14; the chair's rulings Y1, Y2, Y4 over READ-ALL's HISTORY worklist): each row was
 * verified false by the census record in the towns named here (`r2r-<size>-<i>` every dial random; `r2s-<crisis>-<size>-<i>`
 * the crisis forced), and cured at its table.
 *
 * THIS FILE REDS WHEN a town prints one of those lines again where its record makes it false, or when a town it is true
 * in loses it (each KEEP names the sibling that still prints).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };

/** A census town, as its births script makes it. */
const bornCensus = (/** @type {string} */ seed) => {
  const forced = /^r2s-(.+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(seed);
  const calm = /^r2r-(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(seed);
  const tier = forced ? forced[2] : /** @type {RegExpExecArray} */ (calm)[1];
  const cfg = forced ? { ...DEFAULT_CONFIG, ...dials, settType: tier, selectedStressesRandom: false, selectedStresses: [forced[1]] } : { ...DEFAULT_CONFIG, ...dials, settType: tier };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
};

/** @param {any} town */
const crises = (town) => [town.stress].flat().filter(Boolean).map((/** @type {any} */ c) => String(c.type));
/** @param {any} town */
const historyText = (town) => JSON.stringify(town.history || {});
/** @param {any} town */
const arrivalText = (town) => JSON.stringify(town.arrivalScene || {});
/** @param {any} town */
const crisisText = (town) => JSON.stringify([town.stress, town.stressors].flat().filter(Boolean).map((/** @type {any} */ c) => [c.crisisHook, c.viabilityNote]));

const WAR_HOOKS = /wartime contracts|the war party is suppressing/;

describe('TAIL-HISTORY batch 1: the rows cured at the history group\'s tables', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

  // Y1 (READ-ALL 22261, 02538, B02462): the external threat's war hooks printed where no war is in force (a beast and
  // raider threat, or no crisis at all): 74, 79 and 17 towns. They now need a war (`war: peace` excluded).
  test('Y1: no war hook of the external threat where no war is in force', () => {
    expectNoSeedFailures(collectSeedFailures(['r2r-city-17', 'r2r-city-22', 'r2r-hamlet-14', 'r2r-hamlet-25'], (seed) => {
      const town = bornCensus(seed);
      expect(crises(town).filter((c) => ['wartime', 'occupied', 'under_siege'].includes(c)), seed).toEqual([]);
      expect(historyText(town).match(WAR_HOOKS), seed).toBe(null);
    }), 'no war hook in peace');
  }, 240_000);
  test('Y1 KEEP: the war hooks still print where a war is in force', () => {
    // RULE8-RESEAT (PAGE-12, 2026-11-22): reseated from r2r-hamlet-5 and r2r-metropolis-4, whose history no longer prints a war
    // hook. The current tension's pool (troubleHooks.js) draws by key since HOOKS-BUILD, by the mixed key since cure C, and holds
    // the reworded lines; the war words are the timeline template's (historyData.js, external_threat plotHooks 0-1, excluding
    // `war: peace`). r2r-hamlet-413 and r2r-metropolis-136 are the first of r2r-<hamlet|metropolis>-0..599 that print one
    // (hamlet 3 of 600: 413, 525, 527; metropolis 4 of 600: 136, 232, 366, 591).
    expectNoSeedFailures(collectSeedFailures(['r2r-hamlet-413', 'r2r-metropolis-136'], (seed) => {
      const town = bornCensus(seed);
      expect(WAR_HOOKS.test(historyText(town)), `${seed} keeps a war hook`).toBe(true);
    }), 'the war hooks at war');
  }, 240_000);

  // Y2 (READ-ALL 00169 HIGH, 04385, 18890): "three different powers", "each office" and "some offices" printed in
  // thorps and hamlets of one power and no office (12, 15 and 19 towns). Reworded: no plurality of powers, no office.
  test('Y2: the succession void and the insurgency name no powers or offices a small place lacks', () => {
    expectNoSeedFailures(collectSeedFailures(['r2s-succession_void-hamlet-1', 'r2s-succession_void-hamlet-2', 'r2r-thorp-22'], (seed) => {
      const town = bornCensus(seed);
      const text = crisisText(town);
      expect(/would-be successors have each|gets by on old habit|some households no longer pay/.test(text), `${seed} prints its crisis's reworded line`).toBe(true);
      // anchored: the same text is shown directly above to print its crisis's reworded line
      expect(text, seed).not.toMatch(/Three different powers|each office does|some offices no longer/);
    }), 'the reworded crisis texts');
  }, 240_000);

  // Y4 (READ-ALL 02866 HIGH, 09279 HIGH, 15806, 04287, 02414, 02470, 02382, 18339): arrival lines of traffic by road or
  // water under a siege, and of food offered where the food failed (a siege or a famine).
  test('Y4: no arrival line of traffic under a siege, nor of food offered under a siege or a famine', () => {
    expectNoSeedFailures(collectSeedFailures([
      'r2s-under_siege-hamlet-3', 'r2s-under_siege-metropolis-0', 'r2s-under_siege-village-0', 'r2s-under_siege-thorp-0',
      'r2s-under_siege-metropolis-2', 'r2s-under_siege-thorp-3', 'r2s-famine-hamlet-1', 'r2r-metropolis-14',
      'r2s-famine-thorp-0', 'r2s-under_siege-hamlet-2', 'r2r-village-58',
    ], (seed) => {
      const town = bornCensus(seed);
      const text = arrivalText(town);
      expect(crises(town).some((c) => c === 'under_siege' || c === 'famine'), `${seed} is under a siege or a famine`).toBe(true);
      expect(text, `${seed}: the arrival scene names its town`).toContain(town.name);
      // anchored: the same arrival text is shown directly above to name its town (the scene's own hook)
      expect(text, seed).not.toMatch(/notice of the next fair|Porters bent under loaded frames|goods from routes you have never travelled|records every cartload|still flapping|handed out to anyone who asks|baking since before dawn/);
    }), 'no traffic or offered food under the siege or the famine');
  }, 600_000);
  test('Y4 KEEP: the same lines still print where no siege or famine stands', () => {
    // RE-KEYED BY IDENTITY 2026-11-20 (L2, the chair's word of 15:35; the arrival pools APPENDED, so the draw moved): r2r-metropolis-16, r2r-city-13 and r2r-hamlet-17 draw
    // other lines now; r2r-metropolis-34, r2r-city-9 and r2r-hamlet-2 (the census's own, same tiers, no siege and no famine) print one
    expectNoSeedFailures(collectSeedFailures(['r2r-metropolis-34', 'r2r-city-16', 'r2r-city-9', 'r2r-hamlet-2'], (seed) => {
      const town = bornCensus(seed);
      expect(/notice of the next fair|Porters bent under loaded frames|handed out to anyone who asks|stacked by the water/.test(arrivalText(town)), `${seed} keeps its arrival line`).toBe(true);
    }), 'the arrival lines in peace');
  }, 240_000);
  test('Y4: the salt fish name no carts, in a siege or out of one', () => {
    expectNoSeedFailures(collectSeedFailures(['r2r-thorp-58', 'r2s-under_siege-hamlet-0', 'r2r-hamlet-17'], (seed) => {
      const town = bornCensus(seed);
      const text = arrivalText(town);
      expect(text, `${seed}: the arrival scene names its town`).toContain(town.name);
      // anchored: the same arrival text is shown directly above to name its town (the scene's own hook)
      expect(text, seed).not.toMatch(/salt fish stand stacked for the carts/);
    }), 'the salt fish wait for no carts');
  }, 240_000);
});
