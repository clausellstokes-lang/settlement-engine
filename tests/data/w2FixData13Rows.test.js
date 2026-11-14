/**
 * W2-FIX-DATA-13 (2026-11-14): the data lane's rows of the ranked table, each reproduced false in census towns
 * (`r2r-<size>-<i>` every dial random; `r2s-<crisis>-<size>-<i>` the crisis forced, Random off) and cured at its table.
 *
 * THIS FILE REDS WHEN a town prints one of those lines again where its record makes it false, or when the town it is true
 * in loses it.
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

/** The roster's names. @param {any} town @returns {string[]} */
const roster = (town) => (town.institutions || []).map((/** @type {any} */ i) => String(i.name || ''));

describe('W2-FIX-DATA-13: the measured rows in the data lane\'s files', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

  // DATA-SMELTER (the chair's 11:31 ruling): the catalogue's own Smelter text named "mine and smithy" in 57 of the 96
  // towns it printed in where the roster lacks one (r2r-town-26 neither; r2r-town-34; r2s-under_siege-city-2 no mine).
  test('DATA-SMELTER: no Smelter description names a mine or a smithy the roster lacks', () => {
    expectNoSeedFailures(collectSeedFailures(['r2r-town-26', 'r2r-town-34', 'r2s-under_siege-city-2'], (seed) => {
      const town = bornCensus(seed);
      const names = roster(town);
      const hasMine = names.some((n) => /\bmines?\b|mining/i.test(n));
      const hasSmith = names.some((n) => /smith|forge|metalwork/i.test(n));
      const smelter = (town.institutions || []).find((/** @type {any} */ i) => i.name === 'Smelter');
      expect(smelter, seed).toBeTruthy();
      const desc = String(smelter.desc || '');
      if (!hasMine) expect(desc, seed).not.toMatch(/\bmine\b/i);
      if (!hasSmith) expect(desc, seed).not.toMatch(/smith/i);
    }), 'no Smelter description names a mine or a smithy the roster lacks');
  }, 120_000);

  // THE CHAIR'S 12:11 HIGH (REVIEW-W2-FIX-DATA-4): the history tables' lasting effects named districts and quarters in
  // thorps, hamlets and villages (39 thorps and hamlets, 21 villages of the 730); RULED: quarters and districts belong to
  // a town or larger. r2r-town-1 is the guard town: a town keeps both lines.
  test('the history names no district, quarter or ward below a town; a town keeps them', () => {
    const SMALL = /\bdistricts?\b|\bquarters?\b|\bwards?\b/i;
    expectNoSeedFailures(collectSeedFailures(['r2r-thorp-58', 'r2s-indebted-thorp-0', 'r2r-hamlet-15', 'r2r-village-2'], (seed) => {
      const town = bornCensus(seed);
      const effects = ['historicalEvents', 'currentTensions'].flatMap((k) => (town.history?.[k] || []).flatMap((/** @type {any} */ e) => e.lastingEffects || []));
      expect(effects.filter((line) => SMALL.test(String(line))), `${seed} (${town.tier})`).toEqual([]);
      expect(effects.some((line) => /^(Newcomers and the old families|The merchant families and the labouring families) still keep apart$/.test(String(line))), `${seed} keeps the event's effect in its own words`).toBe(true);
    }), 'no lasting effect below a town names a district, a quarter or a ward');
    const guard = JSON.stringify(bornCensus('r2r-town-1').history);
    expect(guard).toContain('Newcomer and old-family districts remain socially distinct');
    expect(guard).toContain("The merchant quarter and the labourers' quarter remain walled apart");
  }, 120_000);

  // R3C-REVOLTNOTE (the chair's 13:01): the slave revolt's viability note named "everyone who keeps order" in 11 of the
  // 24 revolt towns, every one of the 11 holding no force (r2s-slave_revolt-thorp-0, -thorp-1, -hamlet-0).
  test('R3C-REVOLTNOTE: the slave revolt\'s viability note names no keepers of order', () => {
    expectNoSeedFailures(collectSeedFailures(['r2s-slave_revolt-thorp-0', 'r2s-slave_revolt-thorp-1', 'r2s-slave_revolt-hamlet-0'], (seed) => {
      const town = bornCensus(seed);
      const notes = [town.stress, town.stressors].flat().filter(Boolean).map((/** @type {any} */ c) => String(c.viabilityNote || ''));
      expect(notes.some((n) => /^Owners keep their gangs/.test(n)), `${seed} prints the revolt's note`).toBe(true);
      expect(notes.filter((n) => /keeps? order/i.test(n)), seed).toEqual([]);
    }), 'no revolt note names keepers of order');
  }, 120_000);
});
