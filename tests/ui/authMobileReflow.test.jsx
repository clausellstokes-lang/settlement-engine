/** @vitest-environment jsdom */
/**
 * authMobileReflow.test.jsx — the mobile pass for the Auth surface
 * (AuthModal + AuthPanel). Scope is keep-reflow: no feature cuts, only the
 * mobile reflow + raw-tap-target fixes.
 *
 * Contract under test:
 *  1. AuthModal scroll-bounds on mobile — the dialog gets a maxHeight and the
 *     form body scrolls (overflowY:auto), so the tall sign-up form can't clip
 *     off a short iPhone viewport. On desktop the dialog is byte-identical:
 *     no maxHeight, no scroll override, the natural-height card.
 *  2. The raw segmented Sign In / Create Account tab strip — which can't be the
 *     Button primitive and so misses its mobile 44px floor — gets minHeight:44
 *     on mobile and stays at its dense desktop height otherwise.
 *
 * jsdom has no matchMedia; we install the same controllable fake the tap-floor
 * suite uses so the shared useIsMobile store reports the viewport we choose.
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { setFlagOverride } from '../../src/lib/flags.js';

// ── Controllable matchMedia fake (mirrors mobileTapFloor.test.jsx) ────────────
function installMatchMedia(initialMatches) {
  const mqls = new Map();
  window.matchMedia = vi.fn((query) => {
    let mql = mqls.get(query);
    if (mql) return mql;
    const listeners = new Set();
    mql = {
      media: query,
      matches: initialMatches,
      addEventListener: (_evt, fn) => listeners.add(fn),
      removeEventListener: (_evt, fn) => listeners.delete(fn),
    };
    mqls.set(query, mql);
    return mql;
  });
}

// A minimal store stub: AuthPanel reads a handful of actions; none fire here.
// `auth` is read by the full-page routes (SignInPage / RegisterPage), which
// redirect once a session exists — 'anon' keeps them on the form.
const storeState = {
  auth: { tier: 'anon', loading: false },
  authSignUp: vi.fn(),
  authSignIn: vi.fn(),
  authResetPassword: vi.fn(),
  authMagicLink: vi.fn(),
  authOAuth: vi.fn(),
  authSetSecurityAnswers: vi.fn(),
  authRecoveryLookup: vi.fn(),
  authRecoveryVerify: vi.fn(),
};

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});

vi.mock('../../src/lib/supabase.js', () => ({ isConfigured: true }));

// The full-page auth routes navigate on mount once authed; keep them inert.
vi.mock('../../src/hooks/useRoute.js', () => ({ navigate: vi.fn(), navigatePath: vi.fn() }));

beforeEach(() => {
  // Hide OAuth so the panel renders its plainest single-column form.
  setFlagOverride('googleOauth', false);
  setFlagOverride('discordOauth', false);
});

afterEach(() => {
  setFlagOverride('googleOauth', null);
  setFlagOverride('discordOauth', null);
  cleanup();
  vi.resetModules();
});

async function loadModal() {
  vi.resetModules();
  return (await import('../../src/components/AuthModal.jsx')).default;
}

async function loadPanel() {
  vi.resetModules();
  return (await import('../../src/components/auth/AuthPanel.jsx')).default;
}

// ⛔ THE DOUBLED SUBTITLE (cured 2026-09-18). AuthPanel renders auth.signinSubtitle
// / auth.signupSubtitle itself, and the two full-page routes ALSO passed the same
// token to AuthPageShell's `subtitle`, so /signin and /register each printed the
// sentence twice, one line apart, under the card header. The panel keeps it (the
// modal reads the same key from the same writer); the pages dropped their copy.
describe('the full-page auth routes render the shared subtitle exactly once', () => {
  // One parameterless test looping over the rows in its body, never `test.each`:
  // the lighting census's each/for park debt is shrink-only and a new `each` call
  // raises it (tests/lint/sovereigntyLightingContract.walker.test.js).
  test('/signin and /register each print their subtitle once', async () => {
    const routes = [
      ['../../src/components/auth/SignInPage.jsx', 'auth.signinSubtitle', undefined],
      ['../../src/components/auth/RegisterPage.jsx', 'auth.signupSubtitle', { tier: 'Wanderer' }],
    ];
    for (const [modulePath, key, vars] of routes) {
      installMatchMedia(false);
      vi.resetModules();
      const { t: copy } = await import('../../src/copy/index.js');
      const RoutePage = (await import(modulePath)).default;
      const { unmount } = render(<RoutePage />);

      const sentence = copy(key, vars);
      // Control: the sentence is real copy and the page rendered it at all. Without
      // this, a page that crashed to nothing would green the count below.
      expect(sentence, `${key} did not resolve`).not.toBe(key);
      expect(screen.getAllByText(sentence).length, `${key} is rendered more than once`).toBe(1);
      unmount();
    }
  });
});

describe('AuthModal — mobile scroll-bound', () => {
  test('mobile: the dialog is height-bounded and the form body scrolls', async () => {
    installMatchMedia(true);
    const AuthModal = await loadModal();
    // AuthModal receives isMobile as a PROP from its parent — this lineage computes
    // mobile once in App (useIsMobile) and prop-drills it down (AppViews threads it to
    // GenerateWizard/HomeLanding/etc.; App renders <AuthModal isMobile={isMobile} />).
    // The child AuthPanel self-detects via the matchMedia fake installed above. Mirror
    // the production render by threading the prop here.
    render(<AuthModal onClose={() => {}} isMobile />);

    const dialog = screen.getByRole('dialog');
    expect(dialog.style.maxHeight).toBe('90dvh');
    expect(dialog.style.display).toBe('flex');
    expect(dialog.style.flexDirection).toBe('column');

    // The body is the immediate child after the header; it owns the scroll.
    const body = dialog.querySelector('[style*="overflow"]');
    // The dialog itself keeps overflow:hidden; the scrolling element is a child
    // with overflow-y:auto. Find the descendant that scrolls.
    const scroller = Array.from(dialog.querySelectorAll('div'))
      .find((el) => el.style.overflowY === 'auto');
    expect(scroller).toBeTruthy();
    expect(scroller.style.flexGrow).toBe('1');
    expect(scroller.style.minHeight).toBe('0px');
    expect(body).toBeTruthy();
  });

  test('desktop: the dialog has no maxHeight and no scroll override (byte-identical)', async () => {
    installMatchMedia(false);
    const AuthModal = await loadModal();
    render(<AuthModal onClose={() => {}} isMobile={false} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog.style.maxHeight).toBe('');
    expect(dialog.style.flexDirection).toBe('');

    const scroller = Array.from(dialog.querySelectorAll('div'))
      .find((el) => el.style.overflowY === 'auto');
    expect(scroller).toBeUndefined();
  });
});

describe('AuthPanel — raw segmented tab strip tap floor', () => {
  test('mobile: each segment floors to 44px', async () => {
    installMatchMedia(true);
    const AuthPanel = await loadPanel();
    render(<AuthPanel initialMode="signin" onAuthed={() => {}} />);

    const signIn = screen.getByRole('button', { name: 'Sign In', pressed: true });
    const createAcct = screen.getByRole('button', { name: 'Create Account', pressed: false });
    expect(signIn.style.minHeight).toBe('44px');
    expect(createAcct.style.minHeight).toBe('44px');
  });

  test('desktop: the segments keep their dense height (no inline minHeight)', async () => {
    installMatchMedia(false);
    const AuthPanel = await loadPanel();
    render(<AuthPanel initialMode="signin" onAuthed={() => {}} />);

    const signIn = screen.getByRole('button', { name: 'Sign In', pressed: true });
    expect(signIn.style.minHeight).toBe('');
  });
});
