/**
 * legalRowReadsTheRoster.test.js — W2-C-LEAVES-SIDE (2026-11-13; the chair's added row, the cut's #575): "Legal
 * Infrastructure · Court only" in a town with no courthouse and no prison on its roster, the status taken from the flag
 * `compound.inst.hasCourtSystem` (a name test that takes every Town hall for a court). RULED: the row names a court only
 * where a house on the live roster holds one; where flag and roster disagree the roster governs the page, and the
 * record's disagreement is named with its count (the hand-back: 37 of the census's 720).
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
const legal = (s) => deriveSupportingCapabilities(s).find((c) => c.label === 'Legal Infrastructure');
/** @param {string[]} houses @param {Array<{name:string,institution:string}>} services @param {boolean} [prison] */
const town = (houses, services = [], prison = false) => ({
  institutions: houses.map((name) => ({ name })), availableServices: { civic: services },
  economicState: { compound: { inst: { hasCourtSystem: true, hasPrison: prison } } },
});

describe('the Legal Infrastructure row names a court only where a house holds one (#575)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('the unit: a Town hall that draws permits and taxes holds no court; one that draws dispute arbitration does; a courthouse does', () => {
    expect(legal(town(['Town hall'], [{ name: 'Permit applications', institution: 'Town hall' }]))?.status).toBe('None');
    expect(legal(town(['Town hall'], [], true))?.status).toBe('Prison only');
    expect(legal(town(['Town hall'], [{ name: 'Dispute arbitration', institution: 'Town hall' }]))?.status).toBe('Court only');
    expect(legal(town(['Courthouse'], [], true))?.status).toBe('Court + Prison');
    expect(legal(town(['Town hall'], [{ name: 'Dispute arbitration', institution: 'Town council' }]))?.status, 'a service of a house not here').toBe('None');
  });

  test('the reader\'s towns: rww-town-calm-1\'s Town hall holds no court; the flag said one', () => {
    const s = birthRww('rww-town-calm-1');
    expect(s.economicState.compound.inst.hasCourtSystem, 'anchored: the flag').toBe(true);
    expect(s.institutions.some((/** @type {any} */ i) => /courthouse|court buildings/i.test(i.name)), 'anchored: no courthouse').toBe(false);
    expect(legal(s)?.status).toBe('None');
  }, 60000);
});
