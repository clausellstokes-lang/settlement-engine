/**
 * tests/generators/tensionTemplateDeclaration.test.js — CENSUS-1g unit 4 (R-AL): a template that
 * presumes a fact declares it; an empty hook list is a mute slot. The `demographic_pressure`
 * tension template presumes a live migration and declares `crisis: migration` (R-I's spelling) at
 * `historyGenerator.js :: buildHistoricalEvent`'s selection; a refused template is set aside and
 * the selection draws the next one, so no tension prints with no hooks.
 *
 * soak1k-8 is one of the 16 births of the 1,000 that drew it with no live migration at the base.
 *
 * @enforced-by npx vitest run tests/generators/tensionTemplateDeclaration.test.js
 */
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { bootHarness, renderSurfaces } from '../../scripts/audit/soak-review/renderHarness.mjs';
import { readerBattery } from '../../src/domain/coherence/readerBattery.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { migrationOf } from '../../src/domain/facts/migration.js';
import { withPresumptionLedger } from '../../src/domain/facts/presumptionLedger.js';
import { TENSION_TEMPLATE_DECLARATIONS } from '../../src/generators/historyGenerator.js';

describe('the tension template declaration (R-AL)', () => {
  beforeAll(async () => { await ensureLaws(); });

  it('demographic_pressure declares a live migration', () => {
    expect(TENSION_TEMPLATE_DECLARATIONS.demographic_pressure).toEqual({ crisis: ['migration'] });
  });

  it('a birth with no live migration draws no demographic_pressure tension and no empty hook list', () => {
    const { settlement } = birth(8);
    expect(migrationOf(settlement).active).toBe(false);
    const tensions = settlement.history?.currentTensions || [];
    expect(tensions.length, 'the birth carries current tensions').toBeGreaterThan(0);
    expect(tensions.map((t) => t.type)).not.toContain('demographic_pressure'); // anchored: the line above proves the tensions are read
    expect(tensions.filter((t) => Array.isArray(t.plotHooks) && t.plotHooks.length === 0)).toEqual([]);
  }, 60_000);

  it('a birth that draws it under a live migration notes the declaration for the self-check', () => {
    let seen = 0;
    for (let i = 0; i < 200 && !seen; i++) {
      const { result, ledger } = withPresumptionLedger(() => birth(i));
      if (!(result.settlement.history?.currentTensions || []).some((t) => t.type === 'demographic_pressure')) continue;
      expect(migrationOf(result.settlement).active).toBe(true);
      expect(ledger.some((e) => e.pool === 'historyData:HISTORICAL_EVENTS_DATA.tension' && e.atoms.includes('crisis: mass_migration'))).toBe(true);
      seen += 1;
    }
    expect(seen).toBe(1);
  }, 120_000);
});

/**
 * URBAN-FIX D-1: A TENSION'S WORDS FOLLOW ITS OWN EVENT'S AGE ON THE TIMELINE (the chair's urban
 * ruling D, 2026-11-09; URBAN-AUDIT §4). The selection drew its template without reading the
 * timeline, so a city whose Occupation sits 299 years back printed "collaborators and resisters
 * continued to live side by side" beside "Former collaborators" (the referee's
 * `reader:tension-memory`, 61 findings on the 1,000 at fe55408b9). The timeline now passes in; where
 * the tension's own-template event is older than 80 years (the page's Ancient boundary) the
 * template's DATED words stand in (historyData.js `byMemory.dated`). Draw-free.
 */
describe('URBAN-FIX D-1 — a tension\'s words follow its own event\'s age', () => {
  /** Flagged at the parent: thorp, hamlet, village, town, city, metropolis (the Occupation), the Great Fire, the Tyranny. */
  const FLAGGED = [108, 217, 128, 207, 28, 47, 353, 539];
  /** The twelve (soak1k-0 … 11). */
  const TWELVE = Array.from({ length: 12 }, (_, i) => i);

  it('eight of the 61: the referee\'s reader:tension-memory finds nothing on the rendered page', async () => {
    await ensureLaws();
    const harness = await bootHarness();
    const failures = collectSeedFailures(FLAGGED, (i) => {
      const s = birth(i).settlement;
      const r = renderSurfaces(harness, s);
      const surfaces = { ...r.tabs, tonight: r.tonight, pdf: r.pdf, foundry: r.foundry };
      expect(readerBattery(s, surfaces, { only: ['tension-memory'] }), `soak1k-${i}`).toEqual([]);
      // live, not vacuous: a tension whose own event is older than 80 years is on the record
      const events = s.history.historicalEvents;
      expect(s.history.currentTensions.some((t) => events.some((e) => e.templateType === t.type && e.yearsAgo > 80)), `soak1k-${i}: a dated tension`).toBe(true);
    });
    expectNoSeedFailures(failures, 'no tension names living participants of an event past living memory');
  }, 300_000);

  it('no draw moved: born with the memory table stripped, the twelve and the eight are one record but for the tensions\' words', async () => {
    await ensureLaws();
    const strip = (s) => {
      const { history, ...rest } = s;
      const { currentTensions, ...h } = history;
      return JSON.stringify({ ...rest, history: { ...h, tensionTypes: currentTensions.map((t) => t.type) }, generationCoherenceReceipt: null });
    };
    const seeds = [...TWELVE, ...FLAGGED];
    const shipped = new Map(seeds.map((i) => [i, birth(i).settlement]));
    vi.resetModules();
    vi.doMock('../../src/data/historyData.js', async (importOriginal) => {
      const orig = await importOriginal();
      return { ...orig, HISTORICAL_EVENTS_DATA: orig.HISTORICAL_EVENTS_DATA.map(({ byMemory: _drop, ...t }) => t) };
    });
    const fresh = await import('../../scripts/audit/soak-review/corpus.mjs');
    await fresh.ensureLaws();
    let differing = 0;
    const failures = collectSeedFailures(seeds, (i) => {
      const bare = fresh.birth(i).settlement;
      expect(strip(bare), `soak1k-${i}: one record but for the tensions' words`).toBe(strip(shipped.get(i)));
      if (JSON.stringify(bare.history.currentTensions) !== JSON.stringify(shipped.get(i).history.currentTensions)) differing += 1;
    });
    vi.doUnmock('../../src/data/historyData.js');
    expectNoSeedFailures(failures, 'the memory table moves no draw');
    // live, not vacuous: exactly the eight flagged births change their words
    expect(differing).toBe(FLAGGED.length);
  }, 300_000);
});
