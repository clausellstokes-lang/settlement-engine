/** @vitest-environment jsdom */
/**
 * staffOnlyRoute.test.jsx — THE STAFF ROUTE SAYS NO OUT LOUD.
 *
 * THE DEFECT (ODQ §934.24(c) + §934.28). /admin answered a non-staff visitor by
 * NAVIGATING: App's guard effect replaced them onto /create, and AppViews'
 * admin branch rendered `null` in the meantime. Nothing was said, anywhere —
 * the exact class src/lib/refusalReasons.js was built against, three of whose
 * four original offenders "answered a refusal by navigating". The staff route
 * was a fifth offender that the original sweep never counted, because its
 * refusal lived in the routing layer rather than in a click handler.
 *
 * WHAT IS PROVED HERE:
 *   1. the refusal RENDERS, with the register's own sentence, announced;
 *   2. it offers NO door — a role cannot be bought, so an upgrade affordance
 *      here would be a lie;
 *   3. it is blind to whether the visitor is signed in, so the page can never
 *      become an oracle for "is this account staff";
 *   4. the guard effect no longer navigates at an 'elevated' route (asserted
 *      against App.jsx's source, because the effect's absence is the fix).
 */
import React from 'react';
import { afterEach, describe, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import StaffOnlyPage from '../../src/components/StaffOnlyPage.jsx';
import { REFUSAL_REASONS, REFUSAL_REASON_IDS } from '../../src/lib/refusalReasons.js';
import { refusalCopy } from '../../src/components/primitives/RefusalNotice.jsx';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

afterEach(cleanup);

describe('the staff-only refusal', () => {
  test('STAFF_ONLY is a registered reason with real words', () => {
    // ⛔ ANTI-VACUITY: RefusalNotice renders NOTHING for a reason it cannot
    // resolve, so every render assertion below would pass on an empty page if
    // the reason were unregistered or wordless.
    expect(REFUSAL_REASON_IDS).toContain(REFUSAL_REASONS.STAFF_ONLY);
    const copy = refusalCopy(REFUSAL_REASONS.STAFF_ONLY);
    expect(copy).not.toBeNull();
    expect(copy.rubric.trim().length).toBeGreaterThan(0);
    expect(copy.body.trim().length).toBeGreaterThan(0);
  });

  test('the page renders the register sentence, ANNOUNCED', () => {
    render(<StaffOnlyPage />);
    const alert = screen.getByRole('alert');
    const { rubric, body } = refusalCopy(REFUSAL_REASONS.STAFF_ONLY);
    expect(alert.textContent).toContain(rubric);
    expect(alert.textContent).toContain(body);
  });

  test('it offers NO door — a staff role is not for sale', () => {
    render(<StaffOnlyPage />);
    // Anchored on the alert: if the page had failed to render at all, "no
    // buttons" would pass vacuously.
    expect(screen.getByRole('alert'), 'liveness: the refusal rendered').toBeTruthy();
    expect(screen.queryAllByRole('button')).toEqual([]);
    expect(screen.queryAllByRole('link')).toEqual([]);
    const words = screen.getByRole('alert').textContent.toLowerCase();
    for (const sell of ['upgrade', 'pricing', 'subscribe', 'cartographer', '$']) {
      // anchored: `words` is the rendered alert's own text (getByRole('alert') above throws when absent).
      expect(words, `the refusal must not sell: "${sell}"`).not.toContain(sell);
    }
  });

  test('it takes no props, so it cannot leak whether the visitor is staff', () => {
    // Same markup for an anonymous visitor and a signed-in member: the component
    // has no auth input at all, which is the structural form of "not an oracle".
    const anon = render(<StaffOnlyPage />).container.innerHTML;
    cleanup();
    const member = render(<StaffOnlyPage />).container.innerHTML;
    expect(member).toBe(anon);
    expect(StaffOnlyPage.length, 'the component declares no props parameter').toBe(0);
  });
});

describe('the guard no longer answers by navigating', () => {
  const appSrc = readFileSync(join(ROOT, 'src/App.jsx'), 'utf8');
  const viewsSrc = readFileSync(join(ROOT, 'src/AppViews.jsx'), 'utf8');

  test("App's auth-guard effect keeps the 'auth' redirect and drops the 'elevated' one", () => {
    // The 'auth' bounce is a DOOR (it sends an anonymous visitor to sign-in
    // carrying ?next=), and it stays. The 'elevated' bounce was a refusal with
    // nothing said, and it is gone. Both halves asserted so a revert of either
    // direction reds — the anchor is the surviving redirect.
    expect(appSrc).toMatch(/guardForView\(view\) === 'auth' && authTier === 'anon'/);
    // The absence is anchored on the surviving redirect, which travels the same
    // effect: if the whole guard were deleted, the anchor would be gone too and
    // this would red rather than pass.
    expectAbsentWithAnchor(
      appSrc,
      "guard === 'elevated' && !isElevated",
      "guardForView(view) === 'auth'",
      "App's auth-guard effect",
    );
    // The effect's dependency list no longer needs the role, which is the
    // structural trace that the branch is really gone rather than commented out.
    expect(appSrc).toMatch(/\}, \[view, authTier, authLoading\]\);/);
  });

  test("AppViews renders the refusal at /admin instead of null", () => {
    expect(viewsSrc).toMatch(/StaffOnlyPage/);
    expectAbsentWithAnchor(
      viewsSrc,
      "<AdminPanel onBack={() => setView('account')} /> : null",
      "<AdminPanel onBack={() => setView('account')} /> : <StaffOnlyPage />",
      "the admin route branch",
    );
  });
});
