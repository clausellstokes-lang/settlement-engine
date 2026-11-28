/**
 * printRecord.test.js — SURVEY S-A-2: the record a whole-document surface prints from is the final record with each
 * stored description and hook re-answered once, on the caller's thread; a copy (no birth moves), memoised.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import TOWNS from '../../fixtures/surveyFinalTowns.json';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { printRecordOf } from '../../../src/domain/display/printRecord.js';
import { institutionDescShown } from '../../../src/domain/display/institutionDescShown.js';
import { collectPlotHooks } from '../../../src/domain/dossier/plotHooks.js';
import { collectPlotHooksShown } from '../../../src/domain/dossier/storedHookShown.js';
import { plotHookText } from '../../../src/lib/proseSeams.js';

const born = (plan, seed) => {
  const row = TOWNS.find((t) => t.plan === plan && t.seed === seed);
  return generateSettlementPipeline(birthConfig(row.config), null, { seed: row.seed, customContent: {} });
};

describe('printRecordOf', () => {
  /** @type {any} */ let metro; /** @type {any} */ let hamlet;
  beforeAll(async () => { await loadGenerationLawPayloads(); metro = born('V', 'dp-metropolis-4'); hamlet = born('C', 'dp-hamlet-26'); }, 120000);

  it('each house carries the description the page prints, and each hook the owner\'s collector prints', () => {
    const p = printRecordOf(metro);
    p.institutions.forEach((inst, k) => {
      const own = typeof metro.institutions[k].desc === 'string' ? metro.institutions[k].desc.trim() : '';
      if (own) expect(inst.desc.trim(), inst.name).toBe(institutionDescShown(metro.institutions[k], metro, { audience: 'owner' }));
    });
    expect(collectPlotHooks(printRecordOf(hamlet)).map((h) => h.text)).toEqual(collectPlotHooksShown(hamlet).map((h) => h.text));
    const GUILD = 'Someone is sabotaging both guilds to destabilize the market for a third party';
    expect(hamlet.history.historicalEvents.flatMap((e) => (e.plotHooks || []).map(plotHookText))).toContain(GUILD); // the stored record carries it
    expect(printRecordOf(hamlet).history.historicalEvents.flatMap((e) => (e.plotHooks || []).map(plotHookText))).not.toContain(GUILD); // anchored: the line above proves the same walk over the stored record holds it
  });

  it('a copy: the stored record is untouched; the same record gives the same copy', () => {
    const before = JSON.stringify([metro, hamlet]);
    expect(printRecordOf(metro)).toBe(printRecordOf(metro));
    printRecordOf(hamlet);
    expect(JSON.stringify([metro, hamlet])).toBe(before);
  });

  it('a record with nothing to re-answer passes through unchanged', () => {
    expect(printRecordOf(null)).toBe(null);
    expect(printRecordOf({ name: 'X' })).toEqual({ name: 'X' });
  });
});
