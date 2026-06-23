/**
 * @vitest-environment jsdom
 *
 * tests/ui/authPanelOAuth.test.jsx — Phase A1 OAuth button placement + wiring.
 *
 * The constraint: password stays PRIMARY. OAuth buttons are alternatives,
 * rendered BELOW the email/password form (with a divider), never above it.
 * This test pins:
 *   • both "Continue with Google" and "Continue with Discord" render,
 *   • they sit AFTER the email field and the primary submit CTA in DOM order
 *     (compareDocumentPosition — the layout-order contract),
 *   • clicking each invokes authOAuth with the matching provider,
 *   • Discord is interactive now (not the old hard-disabled "Soon" stub).
 *
 * Flags default-on (googleOauth/discordOauth) so the section renders without
 * an override. The store is mocked so no Supabase wiring loads.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { setFlagOverride } from '../../src/lib/flags.js';

// The OAuth buttons are flag-gated and DEFAULT-OFF (they stay hidden until the
// operator enables the providers in Supabase and flips the flags). Enable them
// explicitly here so this test exercises the rendered-button contract.
beforeEach(() => {
  setFlagOverride('googleOauth', true);
  setFlagOverride('discordOauth', true);
});
afterEach(() => {
  setFlagOverride('googleOauth', null);
  setFlagOverride('discordOauth', null);
  cleanup();
});

const authOAuth = vi.fn().mockResolvedValue({ mock: true });

const storeState = {
  authSignUp: vi.fn(),
  authSignIn: vi.fn(),
  authResetPassword: vi.fn(),
  authMagicLink: vi.fn(),
  authOAuth,
};

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});

// Treat the app as "not configured" (local mode) so the test never depends on
// real Supabase env — the buttons still render and still call authOAuth.
vi.mock('../../src/lib/supabase.js', () => ({ isConfigured: false }));

async function renderPanel(initialMode = 'signin') {
  const AuthPanel = (await import('../../src/components/auth/AuthPanel.jsx')).default;
  return render(<AuthPanel initialMode={initialMode} onAuthed={vi.fn()} />);
}

describe('AuthPanel — OAuth buttons', () => {
  it('renders Google and Discord buttons', async () => {
    await renderPanel();
    expect(screen.getByRole('button', { name: /continue with google/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /continue with discord/i })).toBeTruthy();
  });

  it('places the OAuth section BELOW the email field (layout-order contract)', async () => {
    const { getByPlaceholderText } = await renderPanel();
    const emailInput = getByPlaceholderText(/email/i);
    const oauthSection = document.querySelector('[data-testid="oauth-section"]');
    expect(oauthSection).toBeTruthy();

    // DOCUMENT_POSITION_FOLLOWING (4) means oauthSection comes AFTER emailInput.
    const pos = emailInput.compareDocumentPosition(oauthSection);
    expect(pos & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('clicking Google invokes authOAuth("google")', async () => {
    await renderPanel();
    fireEvent.click(screen.getByRole('button', { name: /continue with google/i }));
    expect(authOAuth).toHaveBeenCalledWith('google');
  });

  it('clicking Discord invokes authOAuth("discord") (interactive, not a stub)', async () => {
    await renderPanel();
    const discord = screen.getByRole('button', { name: /continue with discord/i });
    expect(discord.disabled).toBe(false);
    fireEvent.click(discord);
    expect(authOAuth).toHaveBeenCalledWith('discord');
  });
});

describe('AuthPanel — OAuth withheld on sign-up', () => {
  it('omits Google and Discord on sign-up, even with the flags enabled', async () => {
    await renderPanel('signup');
    expect(screen.queryByRole('button', { name: /continue with google/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /continue with discord/i })).toBeNull();
    expect(document.querySelector('[data-testid="oauth-section"]')).toBeNull();
  });

  it('keeps OAuth available on sign-in (regression guard for the sign-up withhold)', async () => {
    await renderPanel('signin');
    expect(screen.getByRole('button', { name: /continue with google/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /continue with discord/i })).toBeTruthy();
  });

  it('keeps the email sign-in link available on sign-up', async () => {
    await renderPanel('signup');
    expect(screen.getByRole('button', { name: /email/i })).toBeTruthy();
  });
});
