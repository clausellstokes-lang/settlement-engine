/**
 * tests/generators/pressureCommodityNoun.test.js — R2-CODE-A-3, round three's cut (lane ra), HIGH #601:
 * "The interest on Qal'atqala's debt now outpaces what the recovered can bring in" (rr2s-town-indebted-port-1,
 * first export "Recovered artefacts"). The pressure detail (`narrativeGenerator.js :: genPressureDetail`) took
 * the export's first word when the commodity scan named none; a first word is no commodity ("recovered",
 * "milled", "transit"). The detail now hands the scan's label or nothing, and each line says its own default;
 * the war levy's default is the town's food (`foodBalance.js :: foodStoreWord`), not a grain it may not keep.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { PRESSURE_SENTENCES } from '../../src/generators/narrativeText.js';

describe('the war levy names what the town has', () => {
  it('with no commodity, the levy is of the food the record keeps', () => {
    const line = PRESSURE_SENTENCES.wartime({ name: 'X', foodRecord: { hasGranary: false, foodSources: ['fish'] }, compound: { militaryEffective: 30, economyOutput: 30 } })[1];
    expect(line).toMatch(/levies of men, of food, of coin/);
  });
});

describe("the reader's indebted port, born as the app births it", () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  it('Qal\'atqala (#601): the debt line names no first word of an export', () => {
    const s = /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, tradeRouteAccess: 'port', settType: 'town', selectedStressesRandom: false, selectedStresses: ['indebted'], _randomizePriorities: true }), null, { seed: 'rr2s-town-indebted-port-1', customContent: {} }));
    expect(s.economicState.primaryExports[0]).toBe('Recovered artefacts');
    // anchored: the next line asserts the same sentence printed its debt clause
    expect(s.pressureSentence).not.toMatch(/\bthe recovered\b/);
    expect(s.pressureSentence).toMatch(/outpaces what the trade can bring in/);
  });
});
