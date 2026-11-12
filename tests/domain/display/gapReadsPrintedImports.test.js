/**
 * gapReadsPrintedImports.test.js — pattern 6 (W2-A-LEAVES, 2026-11-12; class A, 296 of the census's 720): the gap
 * reader said "No iron reaches the smith" while the Imports line printed iron arriving, because the page printed
 * two lists of imports as one (the record's and the terrain's critical imports) and the gap reader read only the
 * first. RULED: ONE LIST OF IMPORTS AS PRINTED, one function (`tradeListDisplay.js :: importsAsPrinted`), read by
 * the tab and by the gap reader. Birth r2r-city-30 of the census's corpus carried the fault at the lane's base.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { configOf } from '../../components/pageCensusWalk.shared.mjs';
import { resourceGapLines } from '../../../src/domain/display/validationOnPage.js';
import { importsAsPrinted } from '../../../src/domain/display/tradeListDisplay.js';

/** The census's own test: a gap whose missing good the printed Imports carry. */
const gapNamesAnImport = (gap, printed) => {
  const m = gap.match(/^No (.+?) (?:reaches|reach) the (.+)\.$/);
  if (!m) return false;
  const imports = printed.join(', ').toLowerCase();
  return m[1].split(/, | or | and /).some((n) => imports.includes(n.toLowerCase()));
};

describe('the gap reader reads the imports as printed (pattern 6)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  for (const seed of ['r2r-city-30', 'r2s-plague_onset-town-0', 'r2s-politically_fractured-city-2']) {
    test(`${seed}: no gap names a good the Imports line prints`, () => {
      const parts = seed.split('-');
      const size = parts.at(-2); const crisis = seed.startsWith('r2s-') ? parts.slice(1, -2).join('-') : null;
      const town = generateSettlementPipeline(configOf({ size, crisis }, DEFAULT_CONFIG, birthConfig), null, { seed, customContent: {} });
      const printed = importsAsPrinted(town);
      const named = resourceGapLines(town).map((g) => g.impact).filter((gap) => gapNamesAnImport(gap, printed));
      expect(named).toEqual([]);
    }, 60000);
  }
});
