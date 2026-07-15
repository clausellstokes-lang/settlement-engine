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
const storeState = {
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

describe('AuthModal — mobile scroll-bound', () => {
  test('mobile: the dialog is height-bounded and the form body scrolls', async () => {
    installMatchMedia(true);
    const AuthModal = await loadModal();
    render(<AuthModal onClose={() => {}} />);

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
    render(<AuthModal onClose={() => {}} />);

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
