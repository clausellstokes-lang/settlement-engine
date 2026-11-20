/**
 * heraldWarClause.test.js — COHERENCE-UPKEEP-7, the chair's ruling 2b (the third read's 1a-M1 residue; the fourth
 * read's C-M3): the realm register never says "at peace" of a town whose own pages say it is fighting.
 *   1. Where the map speaks (besieged, or besieging), the map's word stands.
 *   2. Where it is silent, the clause reads the town's own crisis through the two-label sentence's public home
 *      (`facts/crisisKind.js :: activeCrisisTypes`, `crisisKindOf`): a siege "under siege"; a war and no siege "at war";
 *      an occupation, insurgency, revolt or raids and neither of those: no clause ("A poor town.") and the table's
 *      own mark for no value; any other crisis, or none: "at peace".
 *   3. One deriver feeds the sentence and the table column.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { gazetteerRows } from '../../src/components/map/heraldRegister.js';
import { STRESS_TYPE_MAP } from '../../src/data/stressTypes.js';

const FIGHTING_UNNAMED = new Set(['occupied', 'insurgency', 'slave_revolt', 'monster_pressure']);
/** @param {string} kind */
const expectedClause = (kind) => (kind === 'under_siege' ? 'under siege' : kind === 'wartime' ? 'at war' : FIGHTING_UNNAMED.has(kind) ? '' : 'at peace');

/** @type {Array<{ kind: string, s: any }>} */
const births = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const kind of Object.keys(STRESS_TYPE_MAP)) {
    const seed = `reg7-${kind}-town-0`;
    births.push({ kind, s: generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: 'town', selectedStresses: [kind], selectedStressesRandom: false }), null, { seed, customContent: {} }) });
  }
}, 300000);

/** @param {any} s @param {any} worldState */
const rowOf = (s, worldState) => gazetteerRows({ campaign: { id: 'c1', settlementIds: ['x1'], worldState }, saves: [{ id: 'x1', settlement: s }] })[0];

describe('the register\'s war clause reads the town where the map is silent (2b)', () => {
  test('RED-FIRST: a map with no war: never "at peace" beside a fighting crisis; each crisis its clause', () => {
    expect(births.length, 'anchored: all fifteen crises').toBe(15);
    for (const { kind, s } of births) {
      const row = rowOf(s, {});
      const want = expectedClause(kind);
      expect(row.war, kind).toBe(want);
      // one deriver: the sentence carries the column's clause, or none where the column has none
      expect(row.line, kind).toEqual(want ? expect.stringMatching(new RegExp(`, ${want}\\.$`)) : expect.not.stringMatching(/, (at peace|at war|under siege|with its armies in the field)\.$/));
    }
  });

  test('where the map besieges the town, the map\'s word stands for every crisis', () => {
    for (const { kind, s } of births) {
      const row = rowOf(s, { deployments: { enemy1: { targetId: 'x1', sinceTick: 0 } } });
      expect(row.war, kind).toBe('under siege');
      expect(row.line, kind).toMatch(/, under siege\.$/);
    }
  });
});
