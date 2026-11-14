/**
 * tests/generators/plagueFishInland.test.js — R2-CODE-A-4, the independent reader's A15 (REVIEW-R3-STAGES, stage A2,
 * finding 2; `foodBalance.js :: plagueFoodNote`): r2r-thorp-41 (forest, a river route), "The sickness is spreading among
 * those who crew the boats, and the ones still at sea face a thin catch and a hard winter." — no sea; in 10 of the 27
 * towns the boats note printed in. RULED: a line of ships, the sea or a harbour is said only of a place the record puts
 * on the water (the water home, `tradeRouteSemantics.js :: waterAccessKind`, maritime); elsewhere a twin true of an
 * inland town prints.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { waterOf } from '../../src/domain/facts/water.js';

describe("the plague's fishing note, born as the app births them", () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  /** @param {string} seed */
  const born = (seed) => {
    const m = /** @type {RegExpMatchArray} */ (seed.match(/^rww-(\w+)-([a-z_+]+)-\d+$/));
    return /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2].split('+'), _randomizePriorities: true }), null, { seed, customContent: {} }));
  };
  /** @param {any} s */
  const note = (s) => (s.economicViability?.issues || []).map((/** @type {any} */ i) => i?.message).find((/** @type {string} */ m) => /^The sickness is spreading among those who (?:fish|crew)/.test(m || ''));
  it('a river town fishes; no sea is named (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(['rww-thorp-plague_onset-1', 'rww-thorp-plague_onset+famine-207'], (seed) => {
      const s = born(seed);
      expect(waterOf(s).kind, `${seed}: a river town`).toBe('river');
      expect(note(s), `${seed}: fishes; no sea is named`).toBe('The sickness is spreading among those who fish, and the ones still working face a thin catch and a hard winter.');
    }), 'a river town fishes; no sea is named');
  });
  it('rww-hamlet-plague_onset+famine-202: a coastal town keeps its boats at sea', () => {
    const s = born('rww-hamlet-plague_onset+famine-202');
    expect(waterOf(s).kind).toBe('maritime');
    expect(note(s)).toBe('The sickness is spreading among those who crew the boats, and the ones still at sea face a thin catch and a hard winter.');
  });
});
