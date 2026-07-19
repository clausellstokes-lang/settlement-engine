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
const BUDGET = 1403; // committed max raw-color-literal occurrences — only lower it, never raise.
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

function countRawColorLiterals() {
  let total = 0;
  for (const abs of walk(join(ROOT, 'src'))) {
    const rel = relative(ROOT, abs).replace(/\\/g, '/');
    if (isTokenSource(rel)) continue;
    let ast;
    try { ast = parse(readFileSync(abs, 'utf8'), { ecmaVersion: 2024, sourceType: 'module', ecmaFeatures: { jsx: true } }); }
    catch { continue; }
    const stack = [{ n: ast, parent: null }];
    while (stack.length) {
      const { n, parent } = stack.pop();
      if (!n || typeof n !== 'object') continue;
      if (n.type === 'Literal' && typeof n.value === 'string' && PURE_HEX.test(n.value.trim())) {
        const sw = parent && parent.type === 'MemberExpression' && parent.computed
          && parent.property === n && parent.object && parent.object.type === 'Identifier'
          && parent.object.name === 'swatch';
        if (!sw) total++;
      }
      for (const k in n) {
        if (k === 'loc' || k === 'range' || k === 'parent') continue;
        const v = n[k];
        if (Array.isArray(v)) { for (const x of v) if (x && typeof x.type === 'string') stack.push({ n: x, parent: n }); }
        else if (v && typeof v.type === 'string') stack.push({ n: v, parent: n });
      }
    }
  }
  return total;
}

describe('raw-color-literal occurrence budget (A+ design-a11y.1)', () => {
  it('total raw-color literals never grow past the committed budget', () => {
    const count = countRawColorLiterals();
    expect(count, `raw color literals: ${count} (budget ${BUDGET}). If you ADDED raw color, route it through a token or swatch['#HEX']. If you REMOVED some, lower BUDGET to ${count}.`).toBeLessThanOrEqual(BUDGET);
  });
});
