/**
 * noInlineStoreSelector.test.js — A+ P1.5 contract over the local ESLint rule
 * `jsx-hygiene/no-inline-store-selector`.
 *
 * Pins the rule directly via RuleTester: a bare inline object/array selector
 * passed to useStore() is flagged (new reference every render → re-render
 * footgun); primitive selectors, useShallow-wrapped selectors, getState(), and
 * non-useStore callees are allowed.
 */
import { RuleTester } from 'eslint';
import { afterAll, describe, it } from 'vitest';
import jsxHygiene from '../../scripts/eslint-plugin-jsx-hygiene.js';

RuleTester.afterAll = afterAll;
RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

const rule = jsxHygiene.rules['no-inline-store-selector'];
const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('no-inline-store-selector', rule, {
  valid: [
    'const a = useStore(s => s.settlement);',           // primitive
    'const a = useStore(s => s.auth.user);',            // member access
    'const a = useStore(useShallow(s => ({ a: s.a }))); ', // useShallow-wrapped is safe
    'const a = useStore();',                             // no selector
    'const a = useStore.getState();',                    // not a selector call
    'const a = pick(s => ({ a: 1 }));',                  // not useStore
    'const a = useStore(s => s.fn());',                  // primitive-ish call result
  ],
  invalid: [
    { code: 'const a = useStore(s => ({ a: s.a, b: s.b }));', errors: [{ messageId: 'inline' }] },
    { code: 'const a = useStore(s => [s.a, s.b]);', errors: [{ messageId: 'inline' }] },
    { code: 'const a = useStore(function (s) { return s; }); const b = useStore(s => ({ x: 1 }));', errors: [{ messageId: 'inline' }] },
  ],
});
