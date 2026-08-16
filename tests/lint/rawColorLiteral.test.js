/**
 * rawColorLiteral.test.js — A+ design-a11y.1.
 *
 * Two things:
 *   1. RuleTester proof that visual-budget/no-raw-color-literal detects a raw
 *      pure-hex string literal ANYWHERE (object value, JSX attr, …) — broadening
 *      color governance past no-raw-color (JSX style props only) and
 *      no-forked-color-const (`const X='#hex'` only) — while exempting the token
 *      DEFINITION files and the sanctioned exact-value escape hatch swatch['#HEX'].
 *   2. The live ratchet: an OCCURRENCE BUDGET. There is a large grandfathered
 *      population of legitimate local design data (per-tab accent maps, the PDF
 *      theme, palettes), so the rule is not wired into the gate (it would emit
 *      ~1500 warnings). Instead this budget asserts the total count of raw color
 *      literals can only SHRINK — net-new raw color fails the gate, and the debt
 *      monotonically burns down toward zero (at which point flip the rule on).
 *
 * Occurrence count is split/move-invariant, so decomposition never trips it — only
 * migrating a literal onto a token/swatch lowers it. Lower BUDGET as that happens.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { afterAll, describe, it, expect } from 'vitest';
import { RuleTester } from 'eslint';
import { parse } from 'espree';
import visualBudget from '../../scripts/eslint-plugin-visual-budget.js';

// ── 1. RuleTester proof ──────────────────────────────────────────────────────
RuleTester.afterAll = afterAll;
RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2024, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('no-raw-color-literal', visualBudget.rules['no-raw-color-literal'], {
  valid: [
    { code: "const x = swatch['#FFFFFF'];" },          // sanctioned escape hatch
    { code: "const x = swatch['#abc'];" },
    { code: "const x = 'rgba(0,0,0,0.4)';" },           // not a pure hex
    { code: "const x = 'var(--color-gold-500)';" },     // css var
    { code: "const x = 'linear-gradient(#fff, #000)';" }, // hex inside a larger string is not a pure-hex literal
    { code: "const c = '#ffffff';", filename: 'src/design/tokens.js' },     // definition file exempt
    { code: "const c = '#ffffff';", filename: 'src/components/theme.js' },  // definition file exempt
  ],
  invalid: [
    { code: "const o = { color: '#ffffff' };", errors: 1 },
    { code: "const o = { accent: '#abc' };", errors: 1 },
    { code: 'const el = <rect fill="#abc123" />;', errors: 1 }, // JSX attribute literal
    { code: "const pair = ['#111111', '#222222'];", errors: 2 }, // array of hexes
  ],
});

// ── 2. Occurrence-budget ratchet ─────────────────────────────────────────────
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const BUDGET = 1335; // committed raw-color-literal occurrences — EXACT. Lower on a shrink; never raise.
// Pure-hex TEMPLATE elements are their OWN population with their OWN number. They are NOT
// folded into BUDGET: one number per population, so a future movement stays attributable to
// the population that moved. Today's single occurrence is real debt, not a placeholder —
// src/components/ConfigurationPanel.jsx:200 carries `color:`#8a6020`` in a style object.
const TEMPLATE_BUDGET = 1; // committed pure-hex TemplateElement occurrences — EXACT.
// 2026-08-16 (GVF-1, micro-batch train `gvf`): 1405→1335, AND both budgets become EXACT
// equality rather than `≤`. Two separate defects are being retired here.
//   (1) THE UNBANKED SHRINK. Under `≤`, a shrink is invisible: the da/dom landings retired 53
//       raw literals and the ceiling never followed, so 70 literals of silent headroom had
//       accumulated — net-new raw color could ship green against a ceiling nobody had lowered.
//       EXACT equality makes a shrink red until it is banked, which is the only way the
//       monotone-down ratchet actually stays monotone.
//   (2) THE TEMPLATE BLIND SPOT. The counter below reads `Literal` nodes only, so a hex
//       written as `` `#abc123` `` was invisible at every ceiling this file ever recorded.
//   Both numbers were MEASURED at this commit's own base by re-executing the counter in this
//   file — never inherited from a plan, a burn-down report, or an earlier lane's figure:
//     npx vitest run tests/lint/rawColorLiteral.test.js
//   ⚠ Re-record BOTH by measurement. Do not hand-edit either number to make a red go away.
// 2026-07-21 (K-1 fold-triage, ledgered): 1403→1405 records the +2 that shipped with the
// K-0b fold (d4747d6c) but was never re-triaged there — src/domain/townMap/arch/spike.js
// holds two engraving-plate literals (INK '#2b2622', PAPER '#efe7d6') for the DORMANT K-0
// gothic plate. spike.js is a byte-GOLDEN-pinned leaf (k0Determinism pins its exact SVG/PNG
// output), so tokenizing those two hexes would alter the pinned plate bytes — the raise is the
// only PROMISE-safe move. Not a license: a genuine measured inheritance from the K-0b fold,
// isolated to one dormant leaf. Monotone-down resumes from 1405.
// 2026-07-19 (FOLD BATCH 2 closing re-triage): 1443→1403 lowers the ceiling to the
// count MEASURED on the folded tree (pages/chrome/compendium/c14c15/c16/pdf all
// landed; the six branches NET-REMOVED 40 raw literals — the page recompositions
// and the CustomContent consolidation retired more literals than the restorations
// added). The VIOLET*→SLATE* rename itself is count-neutral: identifier renames
// touch no hex literals, and the retired swatch-key renames ('#7B4FCF'→'#5A6E82',
// '#EBE2FA'→'#E4E9EE', '#EBE2FA80'→'#E4E9EE80') live at swatch['#HEX'] call
// sites, the sanctioned exempt form. Monotone-down, gate-green on this lineage.
// 2026-07-19 (deep-craft burn-down, C16-lock): 1450→1443 lowers the ceiling to the
// MEASURED count on claude/deep-craft, locking the current tree's position (the
// deep-craft materials/burn-down work has added no raw literals). ⚠ HEADROOM NOTE for
// the manager: this consumes the last of the +23 fold-triage slack below — the ceiling
// now equals the count, so fold batch 2 (deep-craft-c14c15/c16/pages + restoration-*)
// re-triages this budget at fold time exactly as the 1427→1450 exception did if any
// branch lands net-new literals. Monotone-down and gate-green on this lineage.
// 2026-07-18 fold-triage EXCEPTION (ledgered): 1427→1450 records +23 literals that shipped
// across the S7/doc-wave/interiors/ladder folds while this global test sat outside the
// lanes' focused gates. NOT a license: the full suite now runs at every fold, and the
// ROUND 3 fix program carries the named task to tokenize these 23 back down.
// W5 (2026-07-12): ratcheted 1546 -> 1427. The W5 cosmetic wave migrated its
// map/threat palette onto swatch tokens (settlementThreat + the two AA swatches
// in design/tokens.js) rather than raw literals. W5's own lineage measured 1424;
// this review-fixes lineage (post W5 re-apply) carries 3 additional raw-color
// literals from its own advanced work, so the floor lands at the MEASURED 1427
// — still a monotone-down ratchet from 1546 (−119), gate green.

const PURE_HEX = /^#[0-9a-fA-F]{3,8}$/;
const isTokenSource = (rel) => /(?:design\/tokens|components\/theme)\b|src\/design\//.test(rel);

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(jsx?|tsx?)$/.test(e)) out.push(p);
  }
  return out;
}

/**
 * Count BOTH raw-color populations in one source string, kept apart.
 *
 * `literals`  — `Literal` string nodes whose whole value is a pure hex, minus the sanctioned
 *               `swatch['#HEX']` escape hatch.
 * `templates` — `TemplateElement` cooked values whose whole chunk is a pure hex, i.e. the
 *               `` `#abc123` `` form. A hex embedded in a longer chunk (`` `1px solid #abc` ``)
 *               is NOT counted, mirroring the literal side's whole-value rule exactly.
 *
 * Taking a SOURCE STRING rather than walking the corpus is what lets the control arms below
 * execute the counter on a fixture. A budget guard whose counter can only be run over the whole
 * repository can never demonstrate that it counts the thing it claims to count.
 */
export function countColorsInSource(src) {
  let literals = 0; let templates = 0;
  let ast;
  try { ast = parse(src, { ecmaVersion: 2024, sourceType: 'module', ecmaFeatures: { jsx: true } }); }
  catch { return { literals, templates, parsed: false }; }
  const stack = [{ n: ast, parent: null }];
  while (stack.length) {
    const { n, parent } = stack.pop();
    if (!n || typeof n !== 'object') continue;
    if (n.type === 'Literal' && typeof n.value === 'string' && PURE_HEX.test(n.value.trim())) {
      const sw = parent && parent.type === 'MemberExpression' && parent.computed
        && parent.property === n && parent.object && parent.object.type === 'Identifier'
        && parent.object.name === 'swatch';
      if (!sw) literals++;
    }
    if (n.type === 'TemplateElement' && typeof n.value?.cooked === 'string'
      && PURE_HEX.test(n.value.cooked.trim())) templates++;
    for (const k in n) {
      if (k === 'loc' || k === 'range' || k === 'parent') continue;
      const v = n[k];
      if (Array.isArray(v)) { for (const x of v) if (x && typeof x.type === 'string') stack.push({ n: x, parent: n }); }
      else if (v && typeof v.type === 'string') stack.push({ n: v, parent: n });
    }
  }
  return { literals, templates, parsed: true };
}

function countRawColorLiterals() {
  let literals = 0; let templates = 0; let scanned = 0;
  for (const abs of walk(join(ROOT, 'src'))) {
    const rel = relative(ROOT, abs).replace(/\\/g, '/');
    if (isTokenSource(rel)) continue;
    const c = countColorsInSource(readFileSync(abs, 'utf8'));
    if (!c.parsed) continue;
    literals += c.literals; templates += c.templates; scanned++;
  }
  return { literals, templates, scanned };
}

describe('raw-color-literal occurrence budget (A+ design-a11y.1)', () => {
  const counted = countRawColorLiterals();

  it('scans a non-empty corpus (the budget itself is not vacuous)', () => {
    // Without this, a broken walk would report 0 literals and 0 templates, and BOTH budget
    // arms below would be satisfied by having scanned nothing at all.
    expect(counted.scanned, 'parsed src files').toBeGreaterThanOrEqual(200);
  });

  it('raw-color literals match the committed budget exactly', () => {
    expect(
      counted.literals,
      `raw color literals: ${counted.literals} (committed ${BUDGET}). If you ADDED raw color, route it`
      + ` through a token or swatch['#HEX']. If you REMOVED some, bank the shrink: set BUDGET to`
      + ` ${counted.literals} with a dated note. This ratchet is EXACT so a shrink cannot go unbanked.`,
    ).toBe(BUDGET);
  });

  it('pure-hex template elements match their own committed budget exactly', () => {
    expect(
      counted.templates,
      `pure-hex template elements: ${counted.templates} (committed ${TEMPLATE_BUDGET}). A hex written`
      + ' as `#abc123` is raw color too. Route it through a token, or bank the change here.',
    ).toBe(TEMPLATE_BUDGET);
  });
});

// ── Control arms: prove the counter counts what it claims, on fixtures it is handed ────────
describe('raw-color-literal counter — control arms (not vacuous)', () => {
  it('counts a raw hex literal and exempts the sanctioned swatch escape hatch', () => {
    expect(countColorsInSource("const o = { color: '#ffffff' };").literals).toBe(1);
    expect(countColorsInSource("const x = swatch['#FFFFFF'];").literals).toBe(0);
    expect(countColorsInSource("const x = 'rgba(0,0,0,0.4)';").literals).toBe(0);
  });

  it('sees a pure-hex TEMPLATE element that the literal population cannot', () => {
    // THE LOAD-BEARING ARM. This is the exact shape every budget before this commit was blind
    // to: the template side must count it AND the literal side must still report zero, or the
    // second budget is measuring nothing that the first was not already measuring.
    const found = countColorsInSource('const c = { color: `#123400` };');
    expect(found.templates).toBe(1);
    expect(found.literals).toBe(0);
  });

  it('does not count a hex embedded in a longer template chunk', () => {
    // The negative control for the arm above: whole-chunk only, exactly as the literal side
    // requires a whole-value match. Otherwise the new budget becomes a false-positive machine.
    expect(countColorsInSource('const c = { border: `1px solid #c8a84a` };').templates).toBe(0);
  });

  it('reports parsed:false rather than a clean count when the source will not parse', () => {
    // "nothing was scanned" and "nothing was found" must never be the same value.
    expect(countColorsInSource('const = = ;').parsed).toBe(false);
  });
});
