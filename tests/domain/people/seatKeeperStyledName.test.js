/**
 * seatKeeperStyledName.test.js — COHERENCE-POWERS-8: the keeper of an empty seat, styled, in one call
 * (domain/people/seatKeeper.js :: seatKeeperStyledNameOf): the seat row's caretaker form, then the name; '' where the seat
 * is held. Read on births in the app's own shape (a succession void, and a calm town).
 */
import { describe, expect, it } from 'vitest';
import { seatKeeperOf, keeperFormOf, seatKeeperStyledNameOf } from '../../../src/domain/people/seatKeeper.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';

/** @param {string} seed @param {string} size @param {string[]} stresses */
const born = (seed, size, stresses) => /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size, selectedStressesRandom: false, selectedStresses: stresses, _randomizePriorities: true }), null, { seed, customContent: {} }));

describe('COHERENCE-POWERS-8 · the keeper, styled, in one call', () => {
  it('a vacant seat: the form, then the name, as the seat row prints them; a held seat: nothing', async () => {
    await loadGenerationLawPayloads();
    let vacant = 0;
    for (const [seed, size] of [['p8-city-succession_void-1', 'city'], ['p8-town-succession_void-1', 'town'], ['p8-metropolis-succession_void-1', 'metropolis'], ['p8-village-succession_void-1', 'village']]) {
      const s = born(seed, size, ['succession_void']);
      const k = seatKeeperOf(s);
      if (!k) { expect(seatKeeperStyledNameOf(s)).toBe(''); continue; }
      vacant++;
      const form = keeperFormOf(s);
      expect(seatKeeperStyledNameOf(s)).toBe(form ? `${form} ${k.name}` : k.name);
    }
    expect(vacant).toBeGreaterThan(0);
    expect(seatKeeperStyledNameOf(born('p8-town-calm-1', 'town', []))).toBe('');
  }, 120000);
});
