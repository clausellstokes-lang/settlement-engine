/**
 * arcaneNoneLeftOutBesideAMage.test.js — W2-C-LEAVES-SIDE item 3 (2026-11-13; the round-three increment's rww-town-calm-1):
 * "Arcane Support · None · No arcane practitioners on the rolls" in a town an Arcane Council governs ("Mages govern, and
 * their magic is their claim to rule") with the council's archmage named. The chair's ruling: "None … no arcane
 * practitioners" is not printed where the record holds a governing arcane power or a named mage: the row is left out
 * (record 394 stands for "Present"). The practitioner census that missed them (`magicReliance.js :: magicPractitioners`)
 * is the record's own disagreement, named in the hand-back.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { deriveSupportingCapabilities } from '../../../src/domain/display/defenseDisplay.js';

/** The increment's own shape (CENSUS-2 seedcfg.mjs, rww-). @param {string} seed */
const birthRww = (seed) => {
  const m = /** @type {RegExpMatchArray} */ (seed.match(/^rww-(\w+)-([a-z_+]+)-\d+$/));
  const stresses = m[2] === 'calm' ? [] : m[2].split('+');
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false,
    selectedStresses: stresses, _randomizePriorities: true }), null, { seed, customContent: {} });
};
/** @param {any} s */
const arcane = (s) => deriveSupportingCapabilities(s).find((c) => c.label === 'Arcane Support');
/** @param {object[]} factions @param {object[]} [npcs] */
const town = (factions, npcs = []) => ({ institutions: [], npcs, powerStructure: { factions }, economicState: { compound: { inst: {} } } });

describe('no "No arcane practitioners" beside a governing arcane power or a named mage', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('the unit: a governing Arcane Council, or a named archmage, leaves the row out; a council that does not govern, or none, keeps "None"', () => {
    expect(arcane(town([{ faction: 'Arcane Council', category: 'magic', isGoverning: true }]))).toBeUndefined();
    expect(arcane(town([], [{ name: 'Georgios', role: "the council's archmage" }]))).toBeUndefined();
    expect(arcane(town([], [{ name: 'Old Hal', role: 'the wizard', status: 'dead' }]))?.status, 'a mage no longer at work names none').toBe('None');
    expect(arcane(town([{ faction: 'Arcane Orders', category: 'magic' }]))?.status).toBe('None');
    expect(arcane(town([]))?.status).toBe('None');
  });

  test('the reader\'s town: an Arcane Council governs and the council\'s archmage is named; the row is left out', () => {
    const s = birthRww('rww-town-calm-1');
    expect(s.powerStructure.factions.some((/** @type {any} */ f) => f.category === 'magic' && f.isGoverning), 'anchored: the council governs').toBe(true);
    expect(arcane(s)).toBeUndefined();
  }, 60000);
});
