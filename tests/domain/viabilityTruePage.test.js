/**
 * viabilityTruePage.test.js — VIABILITY-TRUE (the tenth chair's G53, G56 (4), G61): EVERY LINE OF THE OUTLOOK'S VIABILITY SLOT
 * AND BOTH FALLBACKS HOLDS TO ITS CLAIM AGAINST WHAT THE SAME PAGE PRINTS.
 * THE ORACLE (the page's own leaves, read here, not the cure's gates): the Food Security row's pounds brought in
 * (`foodRowShown.js`, with the tab's carrier test), the Economics tab's printed arriving list (`tradeListsAsPrinted`) and its
 * "Needed, and not brought in" list (`needed`), a food source's own good on that list (`commoditiesShown.js ::
 * isFoodSourceGood`), and the debt line (the `indebted` stress's own sentence, "owes an outside power more than it can ever
 * repay"). RED FIRST at the line 9d22f040e: the named places each printed a line its own page denied.
 * Also G56 (1): the engine's OLDER safety sentence ("which faction controls a district", written until 2026-11-09) is trimmed
 * as the current one is (`guardLineUnderTheLaw.js :: safetyLineSaidOnce`).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { deriveViability } from '../../src/domain/display/dossierViewModel.js';
import { tradeListsAsPrinted } from '../../src/domain/display/tradeListDisplay.js';
import { foodRowShown } from '../../src/domain/display/foodRowShown.js';
import { carriersOf } from '../../src/domain/display/foodCarrier.js';
import { isFoodSourceGood } from '../../src/domain/display/commoditiesShown.js';
import { generalDeskLines } from '../../src/components/new/generalDeskRead.js';
import { safetyLineSaidOnce } from '../../src/domain/display/guardLineUnderTheLaw.js';
import { variantByVid } from '../helpers/drawnProse.js';
import { birth as soakBirth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';

/** C's birth (`birthConfig({ settType })`, the close's make-plan.mjs) @param {string} seed */
const c = (seed) => generateSettlementPipeline(birthConfig({ settType: seed.split('-')[1] }), null, { seed, customContent: {} });

/** What the page prints, by its own leaves. @param {any} s */
function page(s) {
  const lists = tradeListsAsPrinted(s);
  const pounds = Number(foodRowShown(s, !!carriersOf(s, s?.economicState))?.fb?.importCoverage) || 0;
  const arriving = lists.imports.map(String);
  return {
    food: pounds > 0 || arriving.some(isFoodSourceGood), any: pounds > 0 || arriving.length > 0, needed: lists.needed.length > 0,
    debt: JSON.stringify(s?.stress || []).includes('more than it can ever repay'),
  };
}
/** The lines and what makes each false on its page. */
const LINES = /** @type {Array<[string, RegExp, (p: ReturnType<typeof page>) => boolean]>} */ ([
  ['L1 feeds itself, pays its own way', /feeds itself and pays its own way\./, (p) => p.food || p.debt],
  ['L2 grows and makes what it needs, owes no one', /grows what it eats and makes what it needs, and owes no one/, (p) => p.food || p.needed || p.debt],
  ['L3 nothing needed comes from outside', /^VIABLE: Nothing .* needs to get through the year has to come from outside\./, (p) => p.food || p.needed],
  ['L4 feeds itself and buys in part', /feeds itself and pays its way, and buys in some of what it cannot make/, (p) => p.food || p.debt || !p.any],
  ['L5 some of what it uses is bought in', /it grows, and what it spends it earns; some of what it uses is bought in/, (p) => p.food || p.debt || !p.any],
  ['twin A buying in', /gets through the year, buying in (some of )?what its own land and trades do not provide/, (p) => !p.any],
  ['twin A universal', /gets through the year, buying in what its own land and trades do not provide/, (p) => p.needed],
  ['twin B goes without', /on its own land and trades, and goes without/, (p) => p.any],
  ['strained: keeps order and pays its way', /keeps order and pays its way, but it has to buy food/, (p) => p.debt],
]);
/** @param {any} s @returns {string[]} the lines false on the page, by name */
function falseLines(s) {
  const t = String(deriveViability(s).summary); const p = page(s);
  /** @type {string[]} */ const out = LINES.filter(([, re, bad]) => re.test(t) && bad(p)).map(([n]) => n);
  // DS-GEN-18 BOUGHT-IN v2, computed from its pool (never a literal anchor): "buys in some of what it cannot make" holds only
  // where something arrives (its unmet-need fault is cured by its words, G61 (2))
  const name = String(s?.name ?? '');
  const bought = variantByVid({ leaf: 'general', blockId: 'DS-GEN-18', poolKey: 'BOUGHT-IN', vid: 2, slots: { settlement: name } });
  if (name && JSON.stringify(generalDeskLines(s)).includes(bought) && !p.any) out.push('general: buys in, nothing arrives');
  return out;
}

beforeAll(async () => { await loadGenerationLawPayloads(); await ensureLaws(); }, 120000);

describe('VIABILITY-TRUE: the named places print no line their own page denies', () => {
  /** each named place, the line it printed at the line 9d22f040e, and why the page denied it */
  const NAMED = /** @type {Array<[string, () => any, string]>} */ ([
    ['C dp-thorp-0 (L4 beside the debt line)', () => c('dp-thorp-0'), 'L4'],
    ['C dp-village-89 (L1 beside food arriving)', () => c('dp-village-89'), 'L1'],
    ['C dp-thorp-81 (twin A beside "Needed, and not brought in")', () => c('dp-thorp-81'), 'twin A'],
    ['C dp-hamlet-105 (the general line beside an unmet need)', () => c('dp-hamlet-105'), 'general'],
    ['soak1k-276 (L2 "owes no one" beside the debt line)', () => soakBirth(276).settlement, 'L2'],
  ]);
  for (const [name, born, line] of NAMED) {
    test(name, () => {
      const s = born();
      expect(String(deriveViability(s).summary)).toMatch(/VIABLE/); // the place is read, its verdict printed
      expect(falseLines(s)).toEqual([]);
      expect(line.length).toBeGreaterThan(1);
    }, 120000);
  }
});

describe('VIABILITY-TRUE: every birth of C\'s thorps and hamlets (300): no line false on its page', () => {
  test('false lines 0', () => {
    /** @type {string[]} */ const bad = [];
    let printed = 0;
    for (const size of ['thorp', 'hamlet']) for (let i = 0; i < 150; i++) {
      const s = c(`dp-${size}-${i}`);
      if (deriveViability(s).summary) printed++;
      for (const l of falseLines(s)) bad.push(`dp-${size}-${i}: ${l}`);
    }
    expect(printed).toBe(300);
    expect(bad).toEqual([]);
  }, 900000);
});

describe('G56 (1): the engine\'s older safety sentence is trimmed as the current one is', () => {
  const record = { powerStructure: { stability: 'No stable governing authority' } };
  test('the older wording (written until 2026-11-09) drops its opening clause', () => {
    const old = 'No stable governing authority. Enforcement is inconsistent; which faction controls a district determines what rules apply.';
    expect(safetyLineSaidOnce(old, record)).toBe('Enforcement is inconsistent; which faction controls a district determines what rules apply.');
  });
  test('control: the current wording is trimmed as before, and an owner\'s own line is not', () => {
    expect(safetyLineSaidOnce('No stable governing authority. Enforcement is inconsistent; which power controls a district determines what rules apply.', record))
      .toBe('Enforcement is inconsistent; which power controls a district determines what rules apply.');
    const own = 'No stable governing authority; the three farms each keep their own peace.';
    expect(safetyLineSaidOnce(own, record)).toBe(own);
  });
});
