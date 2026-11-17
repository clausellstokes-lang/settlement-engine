/**
 * gapReadsPrintedImports.test.js — pattern 6, re-ruled (W2-A-LEAVES-2, 2026-11-13; REVIEW-W2A F1).
 *
 * The page said "No clay reaches the potter." beside an Imports line that printed "Clay". The first seat read the
 * gap as the false half and silenced it (445 lines in 296 of 720 towns). The record says the opposite: every one of
 * those gaps carries the record's own gap kind `missing`, and the "Clay" on the Imports line is not trade at all —
 * it is the terrain viability report's NEED list (`resourceAnalysis.imports.critical`, "Required by Potter but not
 * available in Hills terrain"), printed as if it arrived. RULED: the gap lines print again; the leaf of imports as
 * printed (`tradeListDisplay.js :: importsAsPrinted`) keeps the two apart — `arriving`, what trade brings, and
 * `needed`, a good the town needs that no trade brings; the gap reader reads only what arrives.
 *
 * r2r-city-2 is the review's reproduction; the other three are the first seat's P6 towns.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { configOf } from '../../components/pageCensusWalk.shared.mjs';
import { resourceGapLines } from '../../../src/domain/display/validationOnPage.js';
import { importsAsPrinted } from '../../../src/domain/display/tradeListDisplay.js';

/** A gap whose missing good is named in a list. */
const gapNames = (/** @type {string} */ gap, /** @type {string[]} */ list) => {
  const m = gap.match(/^No (.+?) (?:reaches|reach) the (.+)\.$/);
  if (!m) return false;
  const text = list.join(', ').toLowerCase();
  return m[1].split(/, | or | and /).some((n) => text.includes(n.toLowerCase()));
};

/** @param {string} seed */
const birth = (seed) => {
  const parts = seed.split('-');
  const size = parts.at(-2); const crisis = seed.startsWith('r2s-') ? parts.slice(1, -2).join('-') : null;
  return generateSettlementPipeline(configOf({ size, crisis }, DEFAULT_CONFIG, birthConfig), null, { seed, customContent: {} });
};

describe('the gap reader reads what trade brings; a need is not an import (pattern 6, F1)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  // RE-KEYED BY IDENTITY (BIRTH-1, 2026-11-17): the birth now brings clay in for a potter on a connected road no siege
  // shuts (`resourceGenerator.js :: importsBroughtAtBirth`); r2r-city-2's potter is fed. The same claim stands on a census
  // city on no road: r2r-city-20 (its potter's gap `missing`, its line printed, clay a need no trade meets).
  test('r2r-city-20 (re-keyed from r2r-city-2): "No clay reaches the potter." prints, and clay is a need no trade meets', () => {
    const town = birth('r2r-city-20');
    const gaps = resourceGapLines(town).map((g) => g.impact);
    expect(gaps).toContain('No clay reaches the potter.');
    // the record's own reading of the same house
    expect(town.resourceAnalysis.gaps.some((g) => g.institution === 'Potter' && g.kind === 'missing')).toBe(true);
    const { arriving, needed } = importsAsPrinted(town);
    expect(needed.map((x) => x.toLowerCase())).toContain('clay');
    expect(arriving.some((x) => x.toLowerCase().includes('clay'))).toBe(false);
  }, 60000);

  // Re-keyed BY IDENTITY (TAIL-CLOSE-DISPLAY-2, red 3): TAIL-DEFECON-R's DECLARED move M-V (fcf4cae6, JOIN-7 · 27, 4b19b744:
  // grapes and glass sand reach their house by any route the town can bring goods in on) took the gaps these towns' live
  // arm read (r2r-city-30 and r2s-politically_fractured-city-2 grapes, r2s-plague_onset-town-0 glass sand); their gaps
  // still name nothing that arrives. Each is replaced by the nearest town of its own shape (size, crisis) whose page
  // still prints a gap the lists name: r2r-city-28, r2s-politically_fractured-city-4, r2s-plague_onset-town-5.
  // RE-KEYED BY IDENTITY AGAIN (BIRTH-1, 2026-11-17): the birth's import (`importsBroughtAtBirth`) answers every gap these
  // three towns printed (the check below read 0 there); each is replaced by the nearest town of its own shape (size, crisis)
  // whose page still prints a gap the lists name and none that arrives: r2r-city-48, r2s-plague_onset-town-19,
  // r2s-politically_fractured-city-27 (each on no road).
  for (const seed of ['r2r-city-48', 'r2s-plague_onset-town-19', 'r2s-politically_fractured-city-27']) {
    test(`${seed}: no gap names a good that arrives by trade; every gap good the lists name is a need`, () => {
      const town = birth(seed);
      const { arriving, needed } = importsAsPrinted(town);
      const gaps = resourceGapLines(town).map((g) => g.impact);
      expect(gaps.filter((gap) => gapNames(gap, arriving))).toEqual([]);
      expect(gaps.filter((gap) => gapNames(gap, [...arriving, ...needed])).length).toBeGreaterThan(0);
    }, 60000);
  }
});
