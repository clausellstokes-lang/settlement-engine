/**
 * apothecaryWorksTheHerbs.test.js — W2-C-LEAVES-3, the chair's ruling P1-a (2026-11-13): THE LEAF LEARNS THE HOUSE. The
 * nine herb cards P1 stopped on (a modelled chain idle at the hot springs, the card filed Partial or Full) sat beside
 * an Apothecary in eight; the chain model takes the herbs only from foraging areas. `facts/chainWorking.js ::
 * WORKED_BY_HOUSE` (the counterpart of R3's `NOT_WORKED_THROUGH`) names the apothecary as working the medicinal herbs of
 * the town's OWN ground: a live resource that yields them, the house on the live roster, and no herb brought in by
 * trade (where the record imports herbs, "Medicinal herbs" or "Herbs and forage (local gathering areas exhausted)",
 * the apothecary's herbs are bought: the cold list's #1146 judged "Produced locally: medicinal herbs" false there).
 * The grade (the chair's word on the correction): the three whose apothecary works the town's own herbs stand as filed;
 * the five whose herbs come in by trade and the ninth (r2r-village-8, no such house) read Unexploited.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { configOf } from '../../components/pageCensusWalk.shared.mjs';
import { chainWorksResource } from '../../../src/domain/facts/chainWorking.js';
import { exploitationGroupsShown } from '../../../src/domain/display/validationOnPage.js';
import { localProductionAsPrinted } from '../../../src/domain/display/tradeListDisplay.js';

/** @param {string} seed */
const birthCensus = (seed) => {
  const parts = seed.split('-');
  const size = parts.at(-2); const crisis = seed.startsWith('r2s-') ? parts.slice(1, -2).join('-') : null;
  return generateSettlementPipeline(configOf({ size, crisis }, DEFAULT_CONFIG, birthConfig), null, { seed, customContent: {} });
};
/** @param {string[]} houses @param {{ imports?: string[], nearby?: string[], depleted?: string[] }} [o] */
const town = (houses, o = {}) => ({
  config: { nearbyResources: o.nearby || ['hot_springs'], nearbyResourcesDepleted: o.depleted || [] },
  institutions: houses.map((name) => ({ name })), economicState: { activeChains: [], primaryImports: o.imports || [] },
});
/** @param {any} t @param {string} res @returns {string | null} the grade the herb card prints */
const gradeOf = (t, res) => {
  const g = exploitationGroupsShown(t);
  return /** @type {Array<'unexploited'|'partial'|'full'>} */ (['unexploited', 'partial', 'full']).find((k) => g[k].some((x) => x.card.rawResource === res)) || null;
};

describe('an apothecary works the medicinal herbs of the town\'s own ground (P1-a)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('the unit: the house, the live ground, no herb bought; a road, a bought herb, a spent ground, another good do not', () => {
    expect(chainWorksResource(town(['Apothecary']), ['hot_springs'], 'medicinal herbs')).toBe(true);
    expect(chainWorksResource(town(['Apothecary (established)']), ['hot_springs'], 'medicinal herbs')).toBe(true);
    expect(chainWorksResource(town(['Apothecary'], { imports: ['Medicinal herbs'] }), ['hot_springs'], 'medicinal herbs'), 'herbs bought').toBe(false);
    expect(chainWorksResource(town(['Apothecary'], { imports: ['Herbs and forage (local gathering areas exhausted)'] }), ['hot_springs'], 'medicinal herbs')).toBe(false);
    expect(chainWorksResource(town(['Access to apothecary']), ['hot_springs'], 'medicinal herbs'), 'a road to elsewhere').toBe(false);
    expect(chainWorksResource(town(['Apothecary'], { depleted: ['hot_springs'] }), ['hot_springs'], 'medicinal herbs'), 'a spent ground').toBe(false);
    expect(chainWorksResource(town(['Apothecary']), ['hot_springs']), 'no good asked: the chains alone').toBe(false);
    expect(chainWorksResource(town(['Apothecary']), ['hot_springs'], 'honey'), 'another good').toBe(false);
    expect(chainWorksResource(town(['Priest (resident)']), ['hot_springs'], 'medicinal herbs'), 'the clergy (R3)').toBe(false);
  });

  test('the census: an apothecary on the springs\' herbs is worked (r2r-village-47); herbs bought read Unexploited (r2r-town-17); no house reads Unexploited (r2r-village-8)', () => {
    const v47 = birthCensus('r2r-village-47');
    expect(chainWorksResource(v47, ['hot_springs'], 'medicinal herbs')).toBe(true);
    expect(gradeOf(v47, 'medicinal herbs'), 'filed Partial, stands').toBe('partial');
    const t17 = birthCensus('r2r-town-17');
    expect(t17.economicState.primaryImports, 'anchored: herbs come in by trade').toEqual(expect.arrayContaining(['Medicinal herbs']));
    expect(chainWorksResource(t17, ['hot_springs'], 'medicinal herbs')).toBe(false);
    expect((t17.resourceAnalysis.exploitation.fullyExploited || []).map((/** @type {any} */ c) => c.rawResource), 'anchored: filed Full').toContain('medicinal herbs');
    expect(gradeOf(t17, 'medicinal herbs'), 'its herbs come in by trade: Unexploited (the chair, 19:49 UTC)').toBe('unexploited');
    expect(localProductionAsPrinted(t17), 'not "produced locally" beside a herb import').not.toContain('medicinal herbs');
    const v8 = birthCensus('r2r-village-8');
    expect((v8.resourceAnalysis.exploitation.partiallyExploited || []).map((/** @type {any} */ c) => c.rawResource), 'anchored: filed Partial').toContain('medicinal herbs');
    expect(gradeOf(v8, 'medicinal herbs')).toBe('unexploited');
  }, 60000);
});
