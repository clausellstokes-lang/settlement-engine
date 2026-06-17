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
 */

function attrKey(name) {
  if (!name) return null;
  if (name.type === 'JSXNamespacedName') {
    return `${name.namespace.name}:${name.name.name}`;
  }
  return name.name; // JSXIdentifier
}

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

    // no-inline-store-selector (A+ P1.5) — disallow an inline object/array selector
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
  },
};
