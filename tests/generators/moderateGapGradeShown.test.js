/**
 * tests/generators/moderateGapGradeShown.test.js — PLACE-2's unit, the chair's question (4) of 17:38 UTC
 * (`docs/chair/2026-11-20/content/place/BRIEF-BUILD-viabilityHooks.md`; `viabilityHooks-MEASURE.md` §G question 1).
 *
 * The moderate food gap's hook (`outlookHookSiblings.js :: MODERATE_GAP_TWIN`, and the rows that re-word it) is admitted on
 * the food band THE PAGE PRINTS (`food: ≤ pressured`, read through `famine.js :: famineOf().shownBand`, the home
 * `facts/foodBandShown.js`), but its grade (`foodBalance.js :: moderateGapGrade`) read the ledger's RAW band. Where the
 * ledger says "secure" with a share of the need unmet, the page prints "Food Security · Pressured" while the Plot Hooks
 * tab printed the same hook under "Survival Crisis" with "critical severity" (`plotHooks.js :: collectPlotHooks`: source
 * = the hook's category, the sub-line its severity; the PDF's Plot Hooks chapter prints the same source and priority).
 * One fact said two ways. The cure: the grade reads the band the page shows.
 *
 * On the page census's own places that store the gap hook (`r2r-…`, born as the census births them): the hook's category
 * is the label of the band the page prints, its severity that band's grade, and the collector prints that label as the
 * card's source and no "critical severity"; the control, at least one of them, has a raw band that differs from the band
 * shown (so the test reads the disagreement it cures).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { FOOD_SECURITY_BANDS } from '../../src/data/bandLadders.js';
import { collectPlotHooks } from '../../src/domain/dossier/plotHooks.js';
import { MODERATE_GAP_TWIN } from '../../src/generators/economy/outlookHookSiblings.js';

/** The places of the page census's banked corpus that store the gap hook (`viabilityHooks-MEASURE.md`, out/find-seeds.txt):
 * six graded "Survival Crisis / critical" at the base, one "Pressured / low". */
const SEEDS = Object.freeze(['r2r-thorp-4', 'r2r-hamlet-2', 'r2r-town-5', 'r2r-town-7', 'r2r-city-3', 'r2r-metropolis-4', 'r2r-thorp-7']);
/** The band's grade for the gap hook (`foodBalance.js :: MODERATE_GAP_SEVERITY`). */
const GRADE = Object.freeze({ importDependent: 'medium', pressured: 'low' });

/** @type {Map<string, any>} */ const born = new Map();
/** @type {Set<string>} */ let GAP_TEXTS = new Set([MODERATE_GAP_TWIN]);

beforeAll(async () => {
  const { birthConfig, loadGenerationLawPayloads } = await import('../../src/domain/density/densityCreateBoundary.js');
  const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
  const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
  const { configOf, censusPlan } = await import('../components/pageCensusWalk.shared.mjs');
  await loadGenerationLawPayloads();
  // the gap pool's rows re-word the hook where it lands (absent before that unit: today's text alone)
  const pools = await import('../../src/generators/economy/viabilityHookPools.js').catch(() => null);
  if (pools?.MODERATE_GAP_POOL) GAP_TEXTS = new Set([MODERATE_GAP_TWIN, ...pools.MODERATE_GAP_POOL.map((r) => r.text)]);
  const plan = censusPlan('r2');
  for (const seed of SEEDS) {
    const row = plan.find((r) => r.seed === seed);
    born.set(seed, generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed, customContent: {} }));
  }
}, 300_000);

describe('the moderate gap hook\'s grade reads the food band the page prints (the chair\'s (4), 17:38 UTC)', () => {
  it('each place\'s gap hook is graded by the band shown, and the Plot Hooks card prints that label, never "critical"', () => {
    const wrong = []; let differs = 0;
    for (const seed of SEEDS) {
      const t = born.get(seed);
      const famine = factsOf(t).famine;
      const shown = famine.shownBand;
      if (famine.band !== shown) differs++;
      const gap = (t.economicViability?.plotHooks || []).filter((h) => GAP_TEXTS.has(String(h?.hook)));
      if (gap.length !== 1) { wrong.push(`${seed}: ${gap.length} gap hooks stored`); continue; }
      const [h] = gap;
      const label = FOOD_SECURITY_BANDS[shown]?.label;
      if (h.category !== label || h.severity !== GRADE[shown]) wrong.push(`${seed}: stored ${h.category} / ${h.severity}; the page prints ${label} (${shown}, raw ${famine.band})`);
      const card = collectPlotHooks(t).find((c) => c.category === 'economics' && c.text === h.hook);
      if (!card) { wrong.push(`${seed}: no Plot Hooks card for the gap hook`); continue; }
      if (card.source !== label || /critical/i.test(String(card.sub ?? ''))) wrong.push(`${seed}: the card prints "${card.source}" / ${card.sub}; the page prints ${label}`);
    }
    expect(wrong).toEqual([]);
    expect(differs, 'places whose ledger band differs from the band shown (the control)').toBeGreaterThan(0);
  });
});
