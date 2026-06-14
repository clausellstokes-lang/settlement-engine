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
  },
};
