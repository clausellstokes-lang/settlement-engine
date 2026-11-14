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
import { censusPlan, configOf } from '../../components/pageCensusWalk.shared.mjs';

/** A birth of the page census's 720, by its own plan row and config. @param {string} seed */
const birthCensus = (seed) => {
  const row = /** @type {{ seed: string, size: string, crisis: string|null }} */ (censusPlan('r2').find((r) => r.seed === seed));
  return generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed, customContent: {} });
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

  // RE-KEYED BY IDENTITY (W2-C-LEAVES-10 item 2, 2026-11-14). The reader's rww-town-calm-1 no longer holds the case: the
  // integration line's merge (baa4b707d, the line at 976db5b19) re-deals it. At 8c5e90ff6 an Arcane Council governs and
  // "the council's archmage" is named (the row left out); at baa4b707d, 976db5b19 and da7a567f4 a Town Mayor governs, no
  // mage is named, and "None" is true of it. The case (a calm town, an Arcane Council governing, its archmage named, NO
  // practitioner on the rolls, so only this cure takes the row out) was counted on the census's 720 at da7a567f4 with the
  // cure taken out: 2 towns, r2r-town-49 (calm) and r2s-famine-town-3; none of 360 calm rww- births holds it (rww-town-
  // calm-5's council has a practitioner: the older record-369 rule takes its row out). Re-keyed to r2r-town-49.
  test('the reader\'s town: an Arcane Council governs and the council\'s archmage is named; the row is left out', () => {
    const s = birthCensus('r2r-town-49');
    expect(s.powerStructure.factions.some((/** @type {any} */ f) => f.category === 'magic' && f.isGoverning), 'anchored: the council governs').toBe(true);
    expect(s.npcs.some((/** @type {any} */ n) => /archmage/i.test(n.role || '') && n.status !== 'dead'), 'anchored: the archmage is named').toBe(true);
    expect(arcane(s)).toBeUndefined();
  }, 60000);
});
