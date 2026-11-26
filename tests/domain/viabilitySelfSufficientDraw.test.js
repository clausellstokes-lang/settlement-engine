/**
 * viabilitySelfSufficientDraw.test.js — WORDS-2 E13a (the tenth chair's RULING G32 (1); E13 step one,
 * `docs/chair/2026-11-24/tenth/gen/words-2/e13/STEP-ONE.md`): the Outlook's self-sufficient verdict printed one line in
 * nearly every hamlet ("# feeds itself and pays its own way.", .48 of the door's hamlets against a ceiling of .29), because
 * lines 2 and 3 refuse where the printed import list marks a necessity and the old pick fell FORWARD to line 1.
 * THE RULE: each state (marked imports; none) holds at least three true lines, and the line is drawn AMONG THE ADMITTED by
 * the slot's own keyed draw.
 * THE ORACLE (written apart from the cure): the import list AS THE PAGE PRINTS IT (`tradeListsAsPrinted`), marked where an entry
 * is a necessity (`economicState.necessityImports`) or a good the terrain cannot produce (`resourceAnalysis.imports.critical`);
 * the food import share; the prosperity word. (A raw critical list the page does not print, luxuries, is not a need it marks.)
 * Births: C's hamlets (`dp-hamlet-<i>`, `birthConfig({ settType })`), 150 of them.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { deriveViability } from '../../src/domain/display/dossierViewModel.js';
import { tradeListsAsPrinted } from '../../src/domain/display/tradeListDisplay.js';

beforeAll(async () => { await loadGenerationLawPayloads(); });

/** The self-sufficient lines, by a word each (the old three and the two E13a writes). */
const LINES = [
  ['feeds', /^VIABLE: \S.* feeds itself and pays its own way\.$/],
  ['owes', /^VIABLE: \S.* grows what it eats and makes what it needs, and owes no one for either\.$/],
  ['nothing', /^VIABLE: Nothing .* needs to get through the year has to come from outside\.$/],
  ['buysIn', /^VIABLE: \S.* feeds itself and pays its way, and buys in what it cannot make for itself\.$/],
  ['earns', /^VIABLE: What .* eats it grows, and what it spends it earns; some of what it needs is bought in\.$/],
];
const LOW = ['Subsistence', 'Struggling', 'Poor'];
/** @param {any} s the oracle's reading of the record */
function holds(s) {
  const eco = s?.economicState || {};
  const low = (/** @type {unknown} */ l) => (Array.isArray(l) ? l : []).map((x) => String(x).toLowerCase());
  const printed = low(tradeListsAsPrinted(s).imports); const necessity = low(eco.necessityImports);
  const ra = s?.resourceAnalysis?.imports; const critical = ra && !Array.isArray(ra) ? low(ra.critical) : [];
  return {
    marked: printed.some((i) => necessity.some((n) => i.includes(n)) || critical.some((t) => i.includes(t) || t.includes(i))),
    bought: printed.length > 0 || critical.length > 0, // the record's printed imports, or a good its terrain cannot produce (the Economics tab lists it)
    buysFood: Number(eco.foodSecurity?.foodRecord?.normalImportPct) > 0,
    low: LOW.includes(String(eco.prosperity ?? '')),
  };
}

describe('E13a: the self-sufficient verdict draws among its true lines', () => {
  const rows = [];
  beforeAll(() => {
    for (let i = 0; i < 150; i++) {
      const seed = `dp-hamlet-${i}`;
      const s = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: 'hamlet' }), null, { seed, customContent: {} });
      const t = deriveViability(s).summary; const hit = LINES.find(([, re]) => re.test(t));
      rows.push({ seed, line: hit?.[0] ?? null, h: holds(s) });
    }
  }, 600_000);

  test('no self-sufficient line says what the record denies', () => {
    const f = collectSeedFailures(rows.filter((r) => r.line), ({ seed, line, h }) => {
      expect(h.buysFood, `${seed} ${line}: food is bought in`).toBe(false);
      if (line === 'owes' || line === 'nothing') expect(h.marked, `${seed} ${line}: a necessity import is marked`).toBe(false);
      if (line === 'feeds' || line === 'buysIn' || line === 'earns') expect(h.low, `${seed} ${line}: the place is poor`).toBe(false);
      if (line === 'buysIn' || line === 'earns') expect(h.bought, `${seed} ${line}: nothing is bought in`).toBe(true);
    });
    expectNoSeedFailures(f, 'a self-sufficient line true of the record');
  });

  test('THE DRAW: among the hamlets printing a self-sufficient line, no one line holds more than half', () => {
    const tally = {}; let n = 0;
    for (const { line } of rows) if (line) { tally[line] = (tally[line] || 0) + 1; n++; }
    const top = Math.max(...Object.values(tally));
    expect(n, 'some hamlet prints a self-sufficient line').toBeGreaterThan(20);
    expect(top / n, JSON.stringify(tally)).toBeLessThanOrEqual(0.5);
  });

  test('where something is bought in and the place pays its way, the lines that say so print', () => {
    const seen = new Set(rows.filter((r) => r.line && r.h.bought && !r.h.low).map((r) => r.line));
    expect([...seen].sort(), 'the lines printed in that state').toEqual(expect.arrayContaining(['buysIn', 'earns', 'feeds']));
  });
});
