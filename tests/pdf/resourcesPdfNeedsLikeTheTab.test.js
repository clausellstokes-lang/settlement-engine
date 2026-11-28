/**
 * resourcesPdfNeedsLikeTheTab.test.js — W2-C-LEAVES-SIDE item 5 (2026-11-13; the twin of #452, named by the third seat):
 * the PDF's Unexploited rows printed the chain's house list raw in the processing column ("Timber » Sawmill, Carpenters'
 * guild » …" beside Carpenters on the roster), the list #452 cured on the tab's "Needs:" line. The PDF's row now reads
 * the same reader (`validationOnPage.js :: housesStillNeeded`): only the houses the live roster does not hold.
 * EXPORTS-B3 (2026-11-14, re-keyed by identity): the same houses print under the tab's own word, "Needs: " (the chair's
 * ruling on EXPORTS-MEASURE-1 B3, candidate A with "Needs:"; guard tests/pdf/resourceChainsLikeTheTab.test.jsx).
 */
import { describe, expect, test } from 'vitest';
import { resourcesSlice } from '../../src/pdf/lib/viewModelBodySlices.js';
import { housesStillNeeded } from '../../src/domain/display/validationOnPage.js';

/** @param {string[]} houses */
const town = (houses) => ({
  institutions: houses.map((name) => ({ name })),
  config: { nearbyResources: ['managed_forest'] },
  resourceAnalysis: { exploitation: { unexploited: [{ rawResource: 'timber', processingInstitutions: ['Sawmill', "Carpenters' guild"], finalProducts: ['Lumber'] }] } },
});
/** @param {any} s */
const row = (s) => resourcesSlice(s).chainRows.find((r) => r.resource === 'timber');

describe('the PDF\'s Unexploited row names only the houses still needed, as the tab does', () => {
  test('Carpenters on the roster: the row names the Sawmill alone; the tab\'s reader says the same', () => {
    const s = town(['Carpenters']);
    expect(row(s)?.status).toBe('unexploited');
    expect(row(s)?.processing).toBe('Needs: Sawmill');
    expect(housesStillNeeded(s, ['Sawmill', "Carpenters' guild"])).toEqual(['Sawmill']);
  });
  test('the guard: with neither house standing both are named', () => {
    expect(row(town([]))?.processing).toBe("Needs: Sawmill, Carpenters' guild");
  });
});
