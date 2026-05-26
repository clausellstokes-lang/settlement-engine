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
 * Used by eslint.config.js as a local plugin. Keep this file
 * dependency-free — it imports nothing.
 */

const RAW_HEX_PATTERN = /^#[0-9a-fA-F]{3,8}$/;
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
  },
};
