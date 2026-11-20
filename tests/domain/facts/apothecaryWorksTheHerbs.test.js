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
 *
 * RE-KEYED BY IDENTITY (TAIL-DEFECON-C-4, the chair's ruling D34, 2026-11-15): THE HOT SPRINGS GIVE NO MEDICINAL HERBS
 * (`resourceData.js`: both hot-springs keys' `commodities` are empty). The leaf's law is unchanged: an apothecary works
 * the herbs of the town's own ground. The unit's ground is now a herb ground (foraging areas), and r2r-village-47's
 * herbs are asked of its own ancient grove (its foraging areas are spent); the springs yield none (asserted).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { configOf } from '../../components/pageCensusWalk.shared.mjs';
import { chainWorksResource } from '../../../src/domain/facts/chainWorking.js';
import { exploitationGroupsShown, resourceWorkReading } from '../../../src/domain/display/validationOnPage.js';
import { localProductionAsPrinted } from '../../../src/domain/display/tradeListDisplay.js';
import { expectAbsentWithAnchor } from '../../helpers/anchoredNegatives.js';

/** @param {string} seed */
const birthCensus = (seed) => {
  const parts = seed.split('-');
  const size = parts.at(-2); const crisis = seed.startsWith('r2s-') ? parts.slice(1, -2).join('-') : null;
  return generateSettlementPipeline(configOf({ size, crisis }, DEFAULT_CONFIG, birthConfig), null, { seed, customContent: {} });
};
/** @param {string[]} houses @param {{ imports?: string[], nearby?: string[], depleted?: string[] }} [o] */
const town = (houses, o = {}) => ({
  config: { nearbyResources: o.nearby || ['foraging_areas'], nearbyResourcesDepleted: o.depleted || [] },
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
    expect(chainWorksResource(town(['Apothecary']), ['foraging_areas'], 'medicinal herbs')).toBe(true);
    expect(chainWorksResource(town(['Apothecary (established)']), ['foraging_areas'], 'medicinal herbs')).toBe(true);
    expect(chainWorksResource(town(['Apothecary'], { imports: ['Medicinal herbs'] }), ['foraging_areas'], 'medicinal herbs'), 'herbs bought').toBe(false);
    expect(chainWorksResource(town(['Apothecary'], { imports: ['Herbs and forage (local gathering areas exhausted)'] }), ['foraging_areas'], 'medicinal herbs')).toBe(false);
    expect(chainWorksResource(town(['Access to apothecary']), ['foraging_areas'], 'medicinal herbs'), 'a road to elsewhere').toBe(false);
    expect(chainWorksResource(town(['Apothecary'], { depleted: ['foraging_areas'] }), ['foraging_areas'], 'medicinal herbs'), 'a spent ground').toBe(false);
    expect(chainWorksResource(town(['Apothecary']), ['foraging_areas']), 'no good asked: the chains alone').toBe(false);
    expect(chainWorksResource(town(['Apothecary']), ['foraging_areas'], 'honey'), 'another good').toBe(false);
    expect(chainWorksResource(town(['Priest (resident)']), ['foraging_areas'], 'medicinal herbs'), 'the clergy (R3)').toBe(false);
    expect(chainWorksResource(town(['Apothecary'], { nearby: ['hot_springs'] }), ['hot_springs'], 'medicinal herbs'), 'D34: the springs give no herbs').toBe(false);
  });

  test('the census: an apothecary on its grove\'s herbs is worked (r2r-village-47; D34: the springs give none); r2r-town-17 has no herb card (the springs gave it); the model silent on r2r-village-8\'s herbs (D34)', () => {
    const v47 = birthCensus('r2r-village-47');
    expect(chainWorksResource(v47, ['ancient_grove'], 'medicinal herbs'), 'its grove (its foraging areas are spent)').toBe(true);
    expect(chainWorksResource(v47, ['hot_springs'], 'medicinal herbs'), 'D34: the springs give none').toBe(false);
    expect(gradeOf(v47, 'medicinal herbs'), 'filed Partial, stands').toBe('partial');
    const t17 = birthCensus('r2r-town-17');
    expect(t17.economicState.primaryImports, 'anchored: herbs come in by trade').toEqual(expect.arrayContaining(['Medicinal herbs']));
    expect(chainWorksResource(t17, ['hot_springs'], 'medicinal herbs')).toBe(false);
    // D34: its herb card (filed Full) was the springs' alone; the record files none now, so no card prints. No census
    // town holds a herb card beside a herb import now: the unit above holds the bought-herbs law.
    expect(gradeOf(t17, 'medicinal herbs'), 'D34: no herb card (the springs gave it)').toBe(null);
    const local = localProductionAsPrinted(t17);
    expect(local.length, 'anchored: the row prints').toBeGreaterThan(0);
    expectAbsentWithAnchor(local, 'medicinal herbs', local[0], 'not "produced locally" beside a herb import');
    const v8 = birthCensus('r2r-village-8');
    expect((v8.resourceAnalysis.exploitation.partiallyExploited || []).map((/** @type {any} */ c) => c.rawResource), 'anchored: filed Partial').toContain('medicinal herbs');
    // RE-KEYED (D34): the herbs here were the springs' modelled chain; the springs give none now, and its grove's herbs
    // are not modelled, so the model is silent and the filed grade stands (the reader's law: "not known", never "not
    // worked"). NAMED FOR THE PAGE READER'S SEAT (`validationOnPage.js` / the record's `resourceGenerator.js`): the
    // filed Partial rests on a divine Healer alone (R3: divine healing works no herbs): one town, false, not this lane's.
    expect(resourceWorkReading(v8, 'medicinal herbs').modelled, 'D34: the model is silent on its herbs').toBe(false);
    expect(gradeOf(v8, 'medicinal herbs'), 'the filed grade stands (NAMED above)').toBe('partial');
  }, 60000);
});
