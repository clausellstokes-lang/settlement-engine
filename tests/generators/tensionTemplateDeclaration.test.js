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
import { beforeAll, describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
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
