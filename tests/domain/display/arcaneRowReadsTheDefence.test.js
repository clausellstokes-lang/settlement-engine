/**
 * arcaneRowReadsTheDefence.test.js — W2-C-LEAVES-3, the chair's ruling (record 369, G5; vetoable): the Defense tab's
 * "Arcane Support · Present … Detection, wards, counterspell." is a claim about the DEFENCE, so it prints only where the
 * Magic tab's practitioner census holds a practitioner AND the defence profile's own arcane tradition holds
 * (`defenseProfile.traditions.hasArcane`). Where a practitioner stands and the defence's tradition does not, the row is
 * not printed (never "None", which would deny the practitioner). 73 of the census's 720 Present rows at 5ab1d2c7c.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { configOf } from '../../components/pageCensusWalk.shared.mjs';
import { deriveSupportingCapabilities } from '../../../src/domain/display/defenseDisplay.js';

/** @param {string} seed */
const birthCensus = (seed) => {
  const parts = seed.split('-');
  const size = parts.at(-2); const crisis = seed.startsWith('r2s-') ? parts.slice(1, -2).join('-') : null;
  return generateSettlementPipeline(configOf({ size, crisis }, DEFAULT_CONFIG, birthConfig), null, { seed, customContent: {} });
};
/** @param {any} town */
const arcaneRow = (town) => deriveSupportingCapabilities(town).find((c) => c.label === 'Arcane Support') || null;

describe('the Arcane Support row reads the defence\'s own arcane tradition (record 369, G5)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('a hedge wizard on the rolls and no arcane tradition in the defence: no row (r2r-hamlet-27)', () => {
    const town = birthCensus('r2r-hamlet-27');
    expect(town.defenseProfile.traditions.hasArcane, 'anchored: the defence holds no arcane tradition').toBe(false);
    expect(deriveSupportingCapabilities(town).map((c) => c.label), 'anchored: the list prints').toContain('Legal Infrastructure');
    expect(arcaneRow(town)).toBeNull();
  }, 60000);

  test('the defence\'s own arcane tradition and a mages\' house: Present (r2s-under_siege-metropolis-1); no practitioner: None (r2s-under_siege-thorp-0)', () => {
    const big = birthCensus('r2s-under_siege-metropolis-1');
    expect(big.defenseProfile.traditions.hasArcane).toBe(true);
    expect(arcaneRow(big)?.status).toBe('Present');
    const small = birthCensus('r2s-under_siege-thorp-0');
    expect(arcaneRow(small)?.status).toBe('None');
  }, 60000);
});
