/**
 * SW-B6 · ECO-DEF-BLOCKS (2026-11-09; STYLE-RULINGS-2 B6; the SURFACES audit's B·#1, worst block 11):
 * THE PROSPERITY LEAD NAMES NO INCOME IT DOES NOT READ. DS-ECO-1 (`economics.prosperityHeader`, the
 * Economics tab's first prose) reads the rung, the approach and the complexity band — never the income
 * list beside it — and its C4 ledger line said "The market tolls bring in less than the town spends"
 * over Lundey's 80% agricultural rents and 20% black market. The fact vocabulary has no income atom to
 * declare the line on, so the lead names none.
 *
 * RED-FIRST at the parent (0c93f0ca0): planted places whose income list holds no toll, drawn through
 * the desk's one reader, print "tolls" in the lead; after the cure, none does.
 */
import { describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { economyDeskRead } from '../../src/components/new/economyDeskRead.js';
import { drawnAtMount } from '../../src/domain/display/stateProse/dossierMounts.js';

const TIERS = ['hamlet', 'village', 'town', 'city'];
const PLACES = [];
for (const tier of TIERS) {
  for (let i = 0; i < 40; i += 1) {
    const s = generateSettlementPipeline({ settType: tier }, null, { seed: `sw6-tolls-${tier}-${i}`, customContent: {} });
    const incomes = (s.economicState?.incomeSources || []).map((row) => String(row?.source || ''));
    const lead = drawnAtMount('economics.prosperityHeader', economyDeskRead(s, { tier: s.tier }).prosperityHeader)?.sentence || '';
    PLACES.push({ seed: `sw6-tolls-${tier}-${i}`, incomes, lead });
  }
}

describe('DS-ECO-1 names no income the income list does not hold', () => {
  test('the leads are drawn (the arm reads something)', () => {
    expect(PLACES.filter((p) => p.lead).length).toBeGreaterThan(100);
  });

  test('a place whose income list holds no toll prints no toll in its prosperity lead', () => {
    const offenders = PLACES
      .filter((p) => !p.incomes.some((src) => /toll/i.test(src)) && /\btolls?\b/i.test(p.lead))
      .map((p) => `${p.seed}: "${p.lead}" beside [${p.incomes.join(', ')}]`);
    expect(offenders, offenders.join('\n')).toEqual([]);
  });
});
