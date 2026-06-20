/**
 * eslint-plugin-visual-budget.js — Local ESLint rules for P120 / V-1/V-2/V-5.
 *
 * Three rules, all warnings (not errors — the codebase has legitimate
 * legacy violations to migrate). They surface drift without blocking
 * CI so the cleanup happens organically rather than as a blocking
 * sweep.
 *
 *   no-raw-fontsize — fontSize: 11 / fontSize: '13px' literal in inline
 *     styles. The design token `FS.{xxs,xs,sm,md,lg,xl,xxl}` should be
 *     the source. Raw values bypass the type scale.
 *
 *   no-raw-color — `color: '#XXXXXX'` or `background: '#XXXXXX'`
 *     literals in inline styles. The token system (GOLD, INK, BODY,
 *     MUTED, etc.) is the source. Raw hex bypasses the palette tiering.
 *     Allows `rgba(...)` and CSS custom properties (var(--…)) since
 *     those go through the token system or compose dynamically.
 *
 *   no-raw-button-copy — strings inside JSX <button> that look like
 *     verbs ("Generate", "Reroll", "Save"). Encourages routing through
 *     copy/index.js so the verb-unification (C-1) stays honest.
 *
 * no-forked-color-const (A+ P1.3) — a module-scope `const X = '#hex'` that
 *   re-declares a value the token system owns. no-raw-color only inspects JSX
 *   `style` props, so these forks (≈43 files) bypassed it entirely. ERROR for any
 *   file NOT in the checked-in baseline (scripts/.forked-color-baseline.json) and
 *   not a token-definition file — so a NEW fork in a clean file fails the gate,
 *   while the grandfathered files burn down (the baseline pin forbids growth).
 *
 * Used by eslint.config.js as a local plugin. Only node builtins imported (to read
 * the baseline); no third-party deps.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const RAW_HEX_PATTERN = /^#[0-9a-fA-F]{3,8}$/;

// Repo root = parent of scripts/. The forked-color baseline grandfathers files
// that currently re-declare token hexes; new files must import from theme.js.
const _REPO_ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
let _forkedColorBaseline = new Set();
try {
  _forkedColorBaseline = new Set(
    JSON.parse(readFileSync(join(_REPO_ROOT, 'scripts/.forked-color-baseline.json'), 'utf8')),
  );
} catch { /* no baseline file → empty set; every fork errors, surfacing the gap */ }
// Token DEFINITION sources legitimately hold raw hexes.
const _isTokenSource = (rel) => /(?:design\/tokens|components\/theme)\b|src\/design\//.test(rel);
const _relPath = (abs) => relative(_REPO_ROOT, abs || '').replace(/\\/g, '/');
const COLOR_PROPS = new Set(['color', 'background', 'backgroundColor', 'borderColor', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor', 'fill', 'stroke']);

// Verbs the critique unified. Strings that match these inside button
// text are likely drift away from the copy module.
const VERB_PATTERNS = [
  /^Generate( a |$)/,
  /^Regenerate( |$)/,
  /^Reroll( |$)/,
  /^Forge( |$)/,
  /^Reforge( |$)/,
  /^Begin( |$)/,
];

function getJSXAttrValue(node) {
  if (!node || node.type !== 'JSXAttribute') return null;
  if (!node.value) return null;
  if (node.value.type === 'Literal') return node.value;
  if (node.value.type === 'JSXExpressionContainer') return node.value.expression;
  return null;
}

function* iterStyleProperties(styleExpr) {
  if (!styleExpr) return;
  if (styleExpr.type !== 'ObjectExpression') return;
  for (const prop of styleExpr.properties) {
    if (prop.type !== 'Property') continue;
    if (!prop.key) continue;
    const keyName = prop.key.name || prop.key.value;
    if (!keyName) continue;
    yield { keyName, valueNode: prop.value };
  }
}

export default {
  rules: {
    'no-raw-fontsize': {
      meta: {
        type: 'suggestion',
        docs: { description: 'Disallow raw fontSize values in inline styles. Use the FS token scale.' },
        schema: [],
      },
      create(context) {
        return {
          JSXAttribute(node) {
            if (node.name?.name !== 'style') return;
            const value = getJSXAttrValue(node);
            if (!value) return;
            for (const { keyName, valueNode } of iterStyleProperties(value)) {
              if (keyName !== 'fontSize') continue;
              if (!valueNode) continue;
              if (valueNode.type === 'Literal') {
                // Literal number (fontSize: 11) or literal string with px
                if (typeof valueNode.value === 'number' ||
                    (typeof valueNode.value === 'string' && /\d+px$/i.test(valueNode.value))) {
                  context.report({
                    node: valueNode,
                    message: `Raw fontSize "${valueNode.value}" — use FS.{xxs,xs,sm,md,lg,xl,xxl} from theme.js.`,
                  });
                }
              }
            }
          },
        };
      },
    },

    'no-raw-color': {
      meta: {
        type: 'suggestion',
        docs: { description: 'Disallow raw hex colors in inline styles. Use the GOLD/INK/BODY/MUTED tokens.' },
        schema: [],
      },
      create(context) {
        return {
          JSXAttribute(node) {
            if (node.name?.name !== 'style') return;
            const value = getJSXAttrValue(node);
            if (!value) return;
            for (const { keyName, valueNode } of iterStyleProperties(value)) {
              if (!COLOR_PROPS.has(keyName)) continue;
              if (!valueNode) continue;
              if (valueNode.type === 'Literal' &&
                  typeof valueNode.value === 'string' &&
                  RAW_HEX_PATTERN.test(valueNode.value.trim())) {
                context.report({
                  node: valueNode,
                  message: `Raw hex color "${valueNode.value}" on ${keyName} — use a token (GOLD, INK, BODY, MUTED, BORDER, …) or a semantic var.`,
                });
              }
            }
          },
        };
      },
    },

    'no-forked-color-const': {
      meta: {
        type: 'suggestion',
        docs: { description: 'Disallow re-declaring a token hex as a local const. Import GOLD/INK/BODY/… from theme.js.' },
        schema: [],
      },
      create(context) {
        const rel = _relPath(context.filename);
        // Grandfathered (baseline) files and the token sources themselves are exempt.
        if (_forkedColorBaseline.has(rel) || _isTokenSource(rel)) return {};
        return {
          VariableDeclarator(node) {
            const init = node.init;
            if (init && init.type === 'Literal' && typeof init.value === 'string'
                && RAW_HEX_PATTERN.test(init.value.trim())) {
              context.report({
                node: init,
                message: `Forked design token "${init.value}" — import the token from theme.js/tokens.js instead of re-declaring the hex.`,
              });
            }
          },
        };
      },
    },

    'no-raw-button-copy': {
      meta: {
        type: 'suggestion',
        docs: { description: 'Disallow inline verbs inside <button> JSX. Route through copy/index.js.' },
        schema: [],
      },
      create(context) {
        return {
          JSXElement(node) {
            const name = node.openingElement?.name?.name;
            if (name !== 'button') return;
            for (const child of node.children || []) {
              if (child.type !== 'JSXText') continue;
              const text = (child.value || '').trim();
              if (!text || text.length < 4) continue;
              if (VERB_PATTERNS.some(p => p.test(text))) {
                context.report({
                  node: child,
                  message: `Inline button verb "${text.split('\n')[0].slice(0, 40)}" — route through COPY.* in src/copy/.`,
                });
              }
            }
          },
        };
      },
    },

    // no-raw-color-literal (A+ design-a11y.1) — broadens color governance beyond
    // JSX style props (no-raw-color) and beyond `const X='#hex'` consts
    // (no-forked-color-const) to ANY pure-hex string literal anywhere (object
    // values, JSX attrs, config maps, …). The token DEFINITION files are exempt,
    // and so is the sanctioned exact-value escape hatch `swatch['#HEX']`. There is
    // a large grandfathered population of legitimate local design data (per-tab
    // accent maps, the PDF theme, palettes), so this rule is INTENTIONALLY DORMANT
    // — it is NOT wired into eslint.config.js at error/warn (turning it on today
    // would emit ~1546 warnings). The live ratchet is instead the occurrence
    // BUDGET test in tests/lint/rawColorLiteral.test.js (count can only shrink;
    // it also RuleTester-proves this rule). Flip this rule on in eslint.config.js
    // once that budget burns to zero.
    'no-raw-color-literal': {
      meta: {
        type: 'suggestion',
        docs: { description: 'Disallow a pure raw-hex color string literal outside the token sources. Use a token or swatch[…].' },
        schema: [],
      },
      create(context) {
        const rel = _relPath(context.filename);
        if (_isTokenSource(rel)) return {}; // definition files legitimately hold raw hexes
        return {
          Literal(node) {
            if (typeof node.value !== 'string' || !RAW_HEX_PATTERN.test(node.value.trim())) return;
            // Exempt the sanctioned exact-value escape hatch: swatch['#HEX'].
            const p = node.parent;
            if (p && p.type === 'MemberExpression' && p.computed && p.property === node
                && p.object && p.object.type === 'Identifier' && p.object.name === 'swatch') return;
            context.report({
              node,
              message: `Raw color literal "${node.value}" — import a token from tokens.js/theme.js, or route through swatch['${node.value.toUpperCase()}'].`,
            });
          },
        };
      },
    },
  },
};
