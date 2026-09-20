/** @vitest-environment jsdom */
/**
 * signInNextReason.test.jsx — THE SIGN-IN PAGE SAYS WHY THE VISITOR IS THERE.
 *
 * ── THE DEFECT (REVIEW-P F10, the anonymous public-path walk, 2026-09-20) ─────
 * ⛔ NO GATE REFUSES SILENTLY (ODQ §934.24(c)). App's auth guard sends an anonymous
 * visitor at a guarded route to `/signin?next=<path>`. That redirect is a DOOR, not a
 * refusal — the reader lands back where they were aiming — and it stays. What was
 * missing is the account of why: the walk clicked /account and measured
 * `href: /signin?next=%2Faccount`, `notices: []`, and a lead of the generic "Welcome
 * back — Sign in to keep your work" (`I-account-guard-phone.png`). The destination was
 * preserved and the cause thrown away, so the reader met a form with no explanation.
 *
 * ── WHAT IS PROVED HERE ───────────────────────────────────────────────────────
 * The page is MOUNTED at the addresses the guard actually produces and the rendered
 * words are read off the DOM. The sentence is derived through `refusalCopy` and the
 * page name through `routeLabelForView`, so neither is typed here and a renamed route
 * moves this file's expectations with it.
 *
 * THE ARMS CARRY THEIR CONTROLS, and the controls are the point: a visitor who opened
 * /signin of their own accord is told nothing they did not ask about, an UNGATED
 * `next` raises nothing, and an unsafe `next` — the open-redirect shape `isSafeNextPath`
 * exists against — is not described any more than it would be travelled to.
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

import { REFUSAL_REASONS } from '../../src/lib/refusalReasons.js';
import { refusalCopy } from '../../src/components/primitives/RefusalNotice.jsx';
import { routeLabelForView } from '../../src/lib/routes.js';

vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false, getIsMobile: () => false }));
// AuthPanel is the shared form, not the subject: it carries its own store surface and
// its own provider wiring. What is on trial is the line ABOVE it.
vi.mock('../../src/components/auth/AuthPanel.jsx', () => ({
  default: () => null,
  AUTH_MODE_VIEW: { signin: 'signin', signup: 'register' },
}));

const storeState = { auth: { tier: 'anon', loading: false, user: null } };
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});

async function renderSignInAt(search) {
  window.history.replaceState(null, '', `/signin${search}`);
  const SignInPage = (await import('../../src/components/auth/SignInPage.jsx')).default;
  render(<SignInPage />);
}

const guardWords = (page) => refusalCopy(REFUSAL_REASONS.AUTH_REQUIRED, { page });

beforeEach(() => { storeState.auth = { tier: 'anon', loading: false, user: null }; });
afterEach(() => { cleanup(); vi.restoreAllMocks(); window.history.replaceState(null, '', '/'); });

describe('The sign-in surface — the reason travels with the destination', () => {
  test('a guarded destination is NAMED, in the router\'s own word for it', async () => {
    await renderSignInAt('?next=%2Faccount');

    const said = (await screen.findByRole('alert')).textContent;
    expect(said).toContain(guardWords(routeLabelForView('account')).rubric);
    expect(said).toContain(routeLabelForView('account'));
    // anchored: `said` is proven two lines up to carry the rubric AND the route's own label.
    expect(said, 'the sentence left a placeholder at a reader').not.toMatch(/\{[a-z]+\}/i);
    // anchored: the same `said` carries the route LABEL (asserted above), so the path's absence is real.
    expect(said).not.toContain('/account');
  });

  test('CONTROL: a visitor who simply opened /signin is told nothing extra', async () => {
    await renderSignInAt('');
    expect(
      screen.queryByRole('alert'),
      'the page volunteered a refusal to a reader who was not bounced anywhere',
    ).toBeNull();
  });

  test('CONTROL: an UNGATED destination raises nothing', async () => {
    // /pricing is public, so nobody was refused anything on the way here.
    await renderSignInAt('?next=%2Fpricing');
    expect(screen.queryByRole('alert')).toBeNull();
  });

  test('CONTROL: an off-site `next` is not described, any more than it is travelled to', async () => {
    await renderSignInAt('?next=%2F%2Fevil.example');
    expect(
      screen.queryByRole('alert'),
      'an unsafe redirect target reached the page as prose',
    ).toBeNull();
  });
});
