/** @vitest-environment jsdom */
/**
 * viabilityRenderedPage.test.jsx — VIABILITY-TRUE-2 (the tenth chair's G68 on the second reader of 119-C): THE OUTLOOK'S
 * VIABILITY LINE HOLDS TO ITS CLAIM AGAINST THE RENDERED PAGE. THE ORACLE IS THE PAGE'S OWN TEXT, rendered here (the
 * Economics tab's Food Security row; the Overview), never the field the line's gate reads: an oracle that reads the gate's
 * own input proves nothing.
 * (V2) A record with no food record (the shape written before 2026-11-03): the Economics tab falls back to the viability
 * view and still prints pounds brought in ("Production: 31 lbs/day + 1 imported"), and the line said "feeds itself" beside
 * them (soak1k-84 with its food record removed). RED FIRST at 7279e571c.
 * (V1) THE DEBT GATE READ ONE OF THE TWO HOMES THAT PRINT A DEBT SENTENCE: the Overview prints "The settlement owes a heavy
 * debt to an outside power, and the power is preparing to collect" from the TENSION `outside_debt`, with no `indebted`
 * stress, and the line said the place pays its way (soak1k-361; C dp-thorp-17, 99, 106, 113, 145). THE ORACLE IS THE
 * RENDERED Overview and History tabs' text, read for a sentence saying the place owes: never the stress or tension field
 * the gate reads. RED FIRST at 7279e571c: the six named places.
 */
import React from 'react';
import { beforeAll, describe, expect, test } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { EconomicsTab } from '../../src/components/new/tabs/EconomicsTab.jsx';
import { OverviewTab } from '../../src/components/new/tabs/OverviewTab.jsx';
import { HistoryTab } from '../../src/components/new/tabs/HistoryTab.jsx';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { deriveViability } from '../../src/domain/display/dossierViewModel.js';
import { birth as soakBirth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';

/** The lines that say the place grows its own food (L1 to L5: what the Economics tab's pounds brought in deny). */
const FEEDS_ITSELF = /feeds itself|grows what it eats|What .* eats it grows|Nothing .* needs to get through the year has to come from outside/;
/** The pounds the rendered Economics tab prints as brought in (its Food Security row), 0 where it prints none. @param {any} s */
function poundsPrinted(s) {
  const { container } = render(<EconomicsTab economicState={s.economicState} settlement={s} />);
  const m = /\+\s*([\d,]+)\s*imported/.exec(container.textContent || '');
  cleanup();
  return m ? Number(m[1].replace(/,/g, '')) : 0;
}

/** A sentence saying THE PLACE owes (the debt homes' printed words, as rendered). */
const OWES = /owes (a heavy debt to )?an outside power|owes an outside power more than it can ever repay|the creditors have a say in every decision|owes more than it owns/;
/** The lines that say the place pays its way or owes no one (L1, L2, L4, L5, the strained line). */
const PAYS = /pays its (own )?way|owes no one|what it spends it earns/;
/** Does the rendered Overview or History print that the place owes? @param {any} s */
function debtPrinted(s) {
  let text = '';
  for (const Tab of [OverviewTab, HistoryTab]) { const { container } = render(<Tab settlement={s} />); text += ` ${container.textContent || ''}`; cleanup(); }
  return OWES.test(text);
}
/** C's birth (`birthConfig({ settType })`, the close's make-plan.mjs) @param {string} seed */
const c = (seed) => generateSettlementPipeline(birthConfig({ settType: seed.split('-')[1] }), null, { seed, customContent: {} });

beforeAll(async () => { await loadGenerationLawPayloads(); await ensureLaws(); }, 120000);

describe('V1: no line says the place pays its way or owes no one beside a debt the page prints', () => {
  const NAMED = /** @type {Array<[string, () => any]>} */ ([
    ['soak1k-361', () => soakBirth(361).settlement],
    ...['dp-thorp-17', 'dp-thorp-99', 'dp-thorp-106', 'dp-thorp-113', 'dp-thorp-145'].map((seed) => /** @type {[string, () => any]} */ ([`C ${seed}`, () => c(seed)])),
  ]);
  for (const [name, born] of NAMED) {
    test(`${name}: the page prints the debt (the tension's line), and the viability line does not say it pays its way`, () => {
      const s = born();
      expect(debtPrinted(s)).toBe(true); // not vacuous: the rendered page says the place owes
      const summary = String(deriveViability(s).summary);
      expect(summary).toMatch(/VIABLE/);
      expect(summary).not.toMatch(PAYS); // anchored: the summary is proved a printed VIABLE line on the line above
    }, 120000);
  }
  test('every birth of C\'s thorps and hamlets (300): no pays-its-way line beside a rendered debt', () => {
    /** @type {string[]} */ const bad = [];
    let debts = 0;
    for (const size of ['thorp', 'hamlet']) for (let i = 0; i < 150; i++) {
      const s = c(`dp-${size}-${i}`);
      if (!debtPrinted(s)) continue;
      debts++;
      const summary = String(deriveViability(s).summary);
      if (PAYS.test(summary)) bad.push(`dp-${size}-${i}: ${summary.slice(0, 90)}`);
    }
    expect(debts).toBeGreaterThan(5); // not vacuous: the corpus holds places whose page prints a debt
    expect(bad).toEqual([]);
  }, 1800000);
});

describe('V2: a record with no food record — the line reads the pounds the tab prints, its fallback included', () => {
  test('soak1k-84, food record removed: the tab prints pounds brought in, and no line says the place feeds itself', () => {
    const s = structuredClone(soakBirth(84).settlement);
    delete s.economicState.foodSecurity.foodRecord;
    expect(poundsPrinted(s)).toBeGreaterThan(0); // not vacuous: the fallback row prints imported pounds
    const summary = String(deriveViability(s).summary);
    expect(summary).toMatch(/VIABLE/);
    expect(summary).not.toMatch(FEEDS_ITSELF); // anchored: the summary is proved a printed VIABLE line on the line above
  }, 120000);
});
