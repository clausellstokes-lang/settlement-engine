/**
 * analyticsPropsHygiene.test.js — contract over the local ESLint rule
 * `analytics/analytics-props-hygiene`.
 *
 * Uses ESLint's RuleTester (wired to vitest's describe/it) to pin the
 * rule's behaviour directly, independent of the real source corpus:
 *   • coarse explicit props (enums/bands/counts/booleans/hashes) pass,
 *   • banned free-text/PII keys are flagged,
 *   • spreading a whole domain object into analytics props is flagged —
 *     whether the spread argument is a bare identifier (`{...settlement}`)
 *     OR a member expression resolving to a banned object
 *     (`{...state.settlement}`, `{...props.npc}`), since the member form
 *     leaks the same names/prose/secrets,
 *   • a benign coarse object spread is left untouched,
 *   • only the track/Funnel bindings imported from the analytics module
 *     are governed.
 */

import { RuleTester } from 'eslint';
import { afterAll, describe, it } from 'vitest';
import analyticsPlugin from '../../scripts/eslint-plugin-analytics.js';

// Wire RuleTester to vitest's test primitives so the cases register as
// real vitest tests (RuleTester calls these at module-collection time).
RuleTester.afterAll = afterAll;
RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

const rule = analyticsPlugin.rules['analytics-props-hygiene'];

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 'latest', sourceType: 'module' },
});

ruleTester.run('analytics-props-hygiene', rule, {
  valid: [
    // Coarse explicit props are the canonical form.
    "import { track } from '../lib/analytics.js'; track('e', { tier: 'town', count: 3, ok: true });",
    // A benign object spread is fine — its terminal name is not banned.
    "import { track } from '../lib/analytics.js'; const coarseObj = { tier: 'town' }; track('e', { ...coarseObj });",
    // A member-expression spread whose terminal name is benign is fine.
    "import { Funnel } from '../lib/analytics.js'; Funnel.track('e', { ...state.metrics });",
    // Precision: a track NOT imported from analytics is untouched.
    "import { track } from './telemetry.js'; track('e', { ...state.settlement });",
  ],
  invalid: [
    // Banned free-text/PII key.
    {
      code: "import { track } from '../lib/analytics.js'; track('e', { name: 'Bob' });",
      errors: [{ messageId: 'bannedKey' }],
    },
    // Bare-identifier spread of a banned domain object (existing behaviour).
    {
      code: "import { track } from '../lib/analytics.js'; const settlement = {}; track('e', { ...settlement });",
      errors: [{ messageId: 'bannedSpread' }],
    },
    // Member-expression spread of a banned domain object — the bug fix.
    {
      code: "import { track } from '../lib/analytics.js'; track('e', { ...state.settlement });",
      errors: [{ messageId: 'bannedSpread' }],
    },
    // Member-expression spread via Funnel.track.
    {
      code: "import { Funnel } from '../lib/analytics.js'; Funnel.track('e', { ...props.npc });",
      errors: [{ messageId: 'bannedSpread' }],
    },
  ],
});
