/**
 * funnelEventContract.test.js — P146 contract over the local ESLint rule
 * `analytics/funnel-event-contract`.
 *
 * Uses ESLint's RuleTester (wired to vitest's describe/it) to pin the
 * rule's behaviour directly, independent of the real source corpus:
 *   • EVENTS.* constants and variable passthroughs are allowed,
 *   • raw string + template-literal event names are flagged,
 *   • only the track/Funnel bindings imported from the analytics module
 *     are governed (unrelated track()/Funnel.track() are untouched).
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

const rule = analyticsPlugin.rules['funnel-event-contract'];

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 'latest', sourceType: 'module' },
});

ruleTester.run('funnel-event-contract', rule, {
  valid: [
    // Canonical: EVENTS.* constant via the bare `track` import.
    "import { track, EVENTS } from '../lib/analytics.js'; track(EVENTS.HOMEPAGE_VIEW);",
    // EVENTS.* via Funnel.track, with props.
    "import { Funnel, EVENTS } from '../lib/analytics.js'; Funnel.track(EVENTS.SAVE_BUTTON_CLICKED, { tier: 'town' });",
    // Generic passthrough wrapper — variable first arg is fine (the
    // EVENTS.* constant is supplied at the wrapper's own call site).
    "import { Funnel } from '../lib/analytics.js'; function w(eventName, payload) { Funnel.track(eventName, payload); }",
    "import { track } from '../lib/analytics.js'; function w(e) { track(e); }",
    // Conditional resolving to EVENTS constants — not a literal.
    "import { track, EVENTS } from '../lib/analytics.js'; const c = true; track(c ? EVENTS.A : EVENTS.B);",
    // Aliased imports still resolve to the analytics bindings (and pass
    // a constant), so they're allowed.
    "import { track as logEvent, EVENTS } from '../lib/analytics.js'; logEvent(EVENTS.X);",
    // Extension-less analytics specifier with a constant.
    "import { track, EVENTS } from '../lib/analytics'; track(EVENTS.X);",
    // Precision: a `track` NOT imported from analytics is untouched.
    "import { track } from './telemetry.js'; track('anything_here');",
    // Precision: an unrelated local `Funnel` object is untouched.
    "const Funnel = { track() {} }; Funnel.track('anything_here');",
    // Precision: a locally-declared track() is untouched.
    "function track(x) { return x; } track('anything_here');",
  ],
  invalid: [
    // Raw string via bare track.
    {
      code: "import { track } from '../lib/analytics.js'; track('homepage_view');",
      errors: [{ messageId: 'rawString' }],
    },
    // Raw string via Funnel.track.
    {
      code: "import { Funnel } from '../lib/analytics.js'; Funnel.track('save_button_clicked', {});",
      errors: [{ messageId: 'rawString' }],
    },
    // Empty string is still a raw string.
    {
      code: "import { track } from '../lib/analytics.js'; track('');",
      errors: [{ messageId: 'rawString' }],
    },
    // Template literal (dynamically-built name).
    {
      code: "import { Funnel } from '../lib/analytics.js'; const id = 1; Funnel.track(`evt_${id}`);",
      errors: [{ messageId: 'dynamic' }],
    },
    // Aliased binding is still governed.
    {
      code: "import { track as logEvent } from '../lib/analytics.js'; logEvent('typo_event');",
      errors: [{ messageId: 'rawString' }],
    },
    // Extension-less specifier is still governed.
    {
      code: "import { Funnel } from '../lib/analytics'; Funnel.track('typo_event');",
      errors: [{ messageId: 'rawString' }],
    },
  ],
});
