/**
 * eslint-plugin-jsx-hygiene.js — Local ESLint rules for JSX correctness.
 *
 * no-duplicate-jsx-props — disallow the same prop appearing twice on one JSX
 *   element. The bundler (esbuild) silently keeps the LAST occurrence, so a
 *   duplicate is a silent bug: the earlier value (often the intended one) is
 *   dropped with no error. The standard rule (react/jsx-no-duplicate-props)
 *   lives in eslint-plugin-react, which this project does NOT load — that
 *   plugin throws on ESLint 10's flat-config resolver. This is the dependency-
 *   free local equivalent. Spread attributes (`{...x}`) are ignored; only named
 *   attributes are compared, namespace-aware (`xml:lang`).
 *
 * Used by eslint.config.js as a local plugin. Dependency-free.
 *
 * no-raw-button — disallow the raw `<button>` JSX element
 *   outside src/components/primitives/. A real Button/IconButton primitive exists
 *   (focus-ring, disabled state, min target size, token variants), but raw
 *   <button> elements re-implement those by hand and silently drift. Files that
 *   currently fork are grandfathered in scripts/.raw-button-baseline.json so the
 *   rule is ERROR for NEW files immediately while the existing debt burns down;
 *   the baseline is pinned to only ever shrink (tests/lint/rawButtonBaseline).
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

function attrKey(name) {
  if (!name) return null;
  if (name.type === 'JSXNamespacedName') {
    return `${name.namespace.name}:${name.name.name}`;
  }
  return name.name; // JSXIdentifier
}

// Repo root = parent of scripts/. The raw-button baseline grandfathers files that
// currently use raw <button>; new files must use the Button/IconButton primitive.
const _REPO_ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
let _rawButtonBaseline = new Set();
try {
  _rawButtonBaseline = new Set(
    JSON.parse(readFileSync(join(_REPO_ROOT, 'scripts/.raw-button-baseline.json'), 'utf8')),
  );
} catch { /* no baseline file → empty set; every raw button errors, surfacing the gap */ }
// The primitives ARE the canonical raw-<button> implementations.
const _isPrimitive = (rel) => /^src\/components\/primitives\//.test(rel);
const _relPath = (abs) => relative(_REPO_ROOT, abs || '').replace(/\\/g, '/');

export default {
  rules: {
    'no-duplicate-jsx-props': {
      meta: {
        type: 'problem',
        docs: {
          description:
            'Disallow duplicate props on a JSX element — esbuild silently keeps only the last, dropping the earlier value.',
        },
        schema: [],
        messages: {
          duplicate:
            "Duplicate JSX prop '{{name}}' — the earlier value is silently dropped by the bundler. Remove or merge one.",
        },
      },
      create(context) {
        return {
          JSXOpeningElement(node) {
            const seen = new Set();
            for (const attr of node.attributes) {
              if (attr.type !== 'JSXAttribute') continue; // skip {...spread}
              const key = attrKey(attr.name);
              if (key == null) continue;
              if (seen.has(key)) {
                context.report({ node: attr, messageId: 'duplicate', data: { name: key } });
              } else {
                seen.add(key);
              }
            }
          },
        };
      },
    },

    // no-inline-store-selector — disallow an inline object/array selector
    //   passed directly to useStore: `useStore(s => ({ ... }))` / `useStore(s => [ ... ])`.
    //   These build a NEW reference every render, so the default Object.is equality
    //   never matches and the component re-renders on every store change (the #1
    //   Zustand footgun, and at scale an infinite-render risk). The codebase currently
    //   has ZERO of these across ~250 useStore sites; this rule locks that invariant
    //   through the coming UI churn. A useShallow()-wrapped selector is fine — the arg
    //   is then a CallExpression, not a bare arrow, so it is not flagged.
    'no-inline-store-selector': {
      meta: {
        type: 'problem',
        docs: {
          description:
            'Disallow inline object/array selectors in useStore() — they return a new reference each render (re-render footgun). Select primitives, split into multiple useStore calls, or wrap with useShallow().',
        },
        schema: [],
        messages: {
          inline:
            'Inline {{kind}} selector in useStore() returns a new reference every render (re-render footgun). Return a primitive, use separate useStore() calls, or wrap with useShallow().',
        },
      },
      create(context) {
        return {
          CallExpression(node) {
            const callee = node.callee;
            if (!callee || callee.type !== 'Identifier' || callee.name !== 'useStore') return;
            const arg = node.arguments && node.arguments[0];
            if (!arg || (arg.type !== 'ArrowFunctionExpression' && arg.type !== 'FunctionExpression')) return;
            const body = arg.body;
            if (!body) return;
            if (body.type === 'ObjectExpression') {
              context.report({ node: body, messageId: 'inline', data: { kind: 'object' } });
            } else if (body.type === 'ArrayExpression') {
              context.report({ node: body, messageId: 'inline', data: { kind: 'array' } });
            }
          },
        };
      },
    },

    'no-raw-button': {
      meta: {
        type: 'suggestion',
        docs: {
          description:
            'Disallow the raw <button> JSX element outside primitives/. Use the Button or IconButton primitive so focus-ring, disabled state, target size, and token variants are guaranteed.',
        },
        schema: [],
        messages: {
          rawButton:
            'Raw <button> — use the Button or IconButton primitive (src/components/primitives/) so focus-ring, disabled state, min target size, and token variants are guaranteed. New raw buttons are not allowed; existing ones are tracked in .raw-button-baseline.json for burn-down.',
        },
      },
      create(context) {
        const rel = _relPath(context.filename);
        // The primitives themselves and grandfathered files are exempt.
        if (_isPrimitive(rel) || _rawButtonBaseline.has(rel)) return {};
        return {
          JSXOpeningElement(node) {
            if (node.name?.type === 'JSXIdentifier' && node.name.name === 'button') {
              context.report({ node, messageId: 'rawButton' });
            }
          },
        };
      },
    },

    'icon-button-needs-label': {
      meta: {
        type: 'problem',
        docs: {
          description:
            'An icon-only <button> (an element child, no text content) must carry an accessible name (aria-label / aria-labelledby / title), or a screen reader announces only "button".',
        },
        schema: [],
        messages: {
          needsLabel:
            'Icon-only <button> has no accessible name — a screen reader announces only "button". Add an aria-label (e.g. aria-label="Close"), or use the IconButton primitive which requires a label.',
        },
      },
      create(context) {
        const LABEL_ATTRS = new Set(['aria-label', 'aria-labelledby', 'title', 'alt']);
        const elHasLabelAttr = (el) =>
          el.openingElement && (el.openingElement.attributes || []).some(
            (a) => a.type === 'JSXAttribute' && a.name && LABEL_ATTRS.has(a.name.name),
          );
        // Conservative accessible-name probe over the WHOLE subtree: real text,
        // any text-bearing/ambiguous expression ({label}, {`x`}, {obj.name},
        // {fn()}, {cond && …}, {a ? b : c}), or any descendant element carrying a
        // label attr (e.g. <span>{name}</span>, <img alt>) all count as a name.
        // Ambiguous expressions are treated as "named" so the rule never flags a
        // button that might already be announced — only the clear icon-only case
        // (element child(ren), zero text anywhere) fires.
        const NAME_EXPR = new Set(['Literal', 'Identifier', 'TemplateLiteral', 'MemberExpression', 'CallExpression', 'LogicalExpression', 'ConditionalExpression', 'BinaryExpression']);
        const subtreeHasName = (node) =>
          (node.children || []).some((c) => {
            if (c.type === 'JSXText') return c.value.trim().length > 0;
            if (c.type === 'JSXExpressionContainer') return c.expression && NAME_EXPR.has(c.expression.type);
            if (c.type === 'JSXElement') return elHasLabelAttr(c) || subtreeHasName(c);
            return false;
          });
        const hasElementChild = (node) =>
          (node.children || []).some((c) => c.type === 'JSXElement');
        return {
          JSXElement(node) {
            const open = node.openingElement;
            if (open?.name?.type !== 'JSXIdentifier' || open.name.name !== 'button') return;
            if (elHasLabelAttr(node)) return;
            if (hasElementChild(node) && !subtreeHasName(node)) {
              context.report({ node: open, messageId: 'needsLabel' });
            }
          },
        };
      },
    },
  },
};
