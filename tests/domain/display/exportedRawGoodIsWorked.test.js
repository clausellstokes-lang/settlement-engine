/**
 * exportedRawGoodIsWorked.test.js — W2-C-LEAVES-3, the chair's ruling P1-b (2026-11-13): A RESOURCE WHOSE OWN RAW GOOD
 * THE TOWN EXPORTS IS NOT "UNEXPLOITED": someone gathers what is sold. The grade's reader (`validationOnPage.js ::
 * resourceWorkReading`, read by `exploitationCardShown`) takes that record fact as worked (the Partial group), a second
 * fact beside the chain leaf, which is not widened; the "No one here works the …" sentence reads the same fact, so it
 * never prints beside such an export, and card and sentence never disagree.
 * An export that answers the chain's words but is another ground's good (`OTHER_GROUNDS_GOODS`: "Sacred wood", the
 * ancient grove's) says nothing of the card's resource: measured on the census's 720, 22 timber cards would have moved
 * on it alone, and the sentence it silenced is true where no house works the timber.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { configOf } from '../../components/pageCensusWalk.shared.mjs';
import { exploitationGroupsShown, resourceGapLines, resourceWorkReading } from '../../../src/domain/display/validationOnPage.js';

/** @param {string} seed */
const birthCensus = (seed) => {
  const parts = seed.split('-');
  const size = parts.at(-2); const crisis = seed.startsWith('r2s-') ? parts.slice(1, -2).join('-') : null;
  return generateSettlementPipeline(configOf({ size, crisis }, DEFAULT_CONFIG, birthConfig), null, { seed, customContent: {} });
};
/** @param {any} t @param {string} res */
const gradeOf = (t, res) => {
  const g = exploitationGroupsShown(t);
  return /** @type {Array<'unexploited'|'partial'|'full'>} */ (['unexploited', 'partial', 'full']).find((k) => g[k].some((x) => x.card.rawResource === res)) || null;
};

describe('an export of the resource\'s own raw good is worked (P1-b)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('the unit: "Raw wool" works the wool; "Sacred wood" does not work the timber', () => {
    /** @param {string} res @param {string[]} exports @param {string[]} nearby */
    const town = (res, exports, nearby) => ({ name: 'Testford', config: { nearbyResources: nearby }, institutions: [],
      economicState: { activeChains: [], primaryExports: exports },
      resourceAnalysis: { exploitation: { unexploited: [{ rawResource: res, exportValue: 'medium' }] },
        gaps: [{ chain: res, impact: 'Raw resource available but not being processed', severity: 'low' }] } });
    const wool = town('wool', ['Raw wool', 'Livestock'], ['grazing_land']);
    expect(resourceWorkReading(wool, 'wool')).toMatchObject({ sold: true, leaf: false, worked: true });
    expect(gradeOf(wool, 'wool')).toBe('partial');
    expect(resourceGapLines(wool)).toEqual([]);
    const timber = town('timber', ['Sacred wood'], ['managed_forest', 'ancient_grove']);
    expect(resourceWorkReading(timber, 'timber')).toMatchObject({ sold: false, worked: false });
    expect(gradeOf(timber, 'timber')).toBe('unexploited');
    expect(resourceGapLines(timber).map((g) => g.impact)).toEqual(['No one here works the timber near Testford.']);
  });

  test('the census: the wool a thorp sells is worked (r2r-thorp-52); the timber beside sacred wood is not (r2r-thorp-22)', () => {
    const t52 = birthCensus('r2r-thorp-52');
    expect(t52.economicState.primaryExports, 'anchored').toEqual(expect.arrayContaining(['Raw wool']));
    expect((t52.resourceAnalysis.exploitation.unexploited || []).map((/** @type {any} */ c) => c.rawResource), 'anchored: filed Unexploited').toContain('wool');
    expect(gradeOf(t52, 'wool')).toBe('partial');
    const t22 = birthCensus('r2r-thorp-22');
    expect(t22.economicState.primaryExports, 'anchored').toEqual(expect.arrayContaining(['Sacred wood']));
    expect(gradeOf(t22, 'timber')).toBe('unexploited');
    expect(resourceGapLines(t22).map((g) => g.impact)).toContain(`No one here works the timber near ${t22.name}.`);
  }, 60000);
});
