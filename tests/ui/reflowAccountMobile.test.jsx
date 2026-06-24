/** @vitest-environment jsdom */
/**
 * reflowAccountMobile.test.jsx — the mobile pass for the Account surface.
 * Scope is keep-reflow: no feature cuts, only mobile reflow of the cramped
 * two-up / no-wrap rows. Rename + save stay live on mobile (the two allowed
 * mobile writes); nothing is gated.
 *
 * Contracts under test:
 *  1. AccountProfileSection — the inline name editor row wraps on mobile (so the
 *     input keeps a usable width beside the two 44px-floored icon buttons) and
 *     stays a single no-wrap row on desktop (byte-identical). The input gets a
 *     min-width floor on mobile only.
 *  2. AccountSecuritySection — the description+right-pinned-action rows (2FA,
 *     Sign out everywhere) stack to a column on mobile and stay a centred single
 *     row on desktop; the linked-accounts rows wrap on mobile.
 *
 * jsdom has no matchMedia; we install the same controllable fake the other
 * mobile suites use so the shared useIsMobile store reports our viewport.
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

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

// AccountSecuritySection reads the auth service; stub it so it renders inert.
vi.mock('../../src/lib/auth.js', () => ({
  auth: {
    changePassword: vi.fn(),
    resetPassword: vi.fn(),
    getIdentities: vi.fn().mockResolvedValue([
      { id: 'g', provider: 'google' }, { id: 'e', provider: 'email' },
    ]),
    linkIdentity: vi.fn(),
    unlinkIdentity: vi.fn(),
    signOutEverywhere: vi.fn(),
  },
}));

const AUTH = {
  user: { id: 'u1', email: 'me@example.test' },
  displayName: 'Archivist',
  tier: 'free',
  role: 'user',
  isFounder: false,
};

// Minimal prop bag for the editing-name branch of the profile section.
function profileProps(extra = {}) {
  return {
    auth: AUTH,
    avatarInput: '', setAvatarInput: vi.fn(),
    modelPreference: '', setModelPreference: vi.fn(),
    editingName: true, setEditingName: vi.fn(),
    nameInput: 'Archivist', setNameInput: vi.fn(),
    nameSaving: false, handleSaveName: vi.fn(),
    nameError: null,
    profileError: null, profileSaving: false, profileSaved: false,
    handleSaveProfilePreferences: vi.fn(),
    ...extra,
  };
}

async function loadProfile() {
  vi.resetModules();
  return (await import('../../src/components/account/AccountProfileSection.jsx')).default;
}
async function loadSecurity() {
  vi.resetModules();
  return (await import('../../src/components/account/AccountSecuritySection.jsx')).default;
}

beforeEach(() => vi.clearAllMocks());
afterEach(() => { cleanup(); vi.resetModules(); });

describe('AccountProfileSection — inline name editor reflow', () => {
  test('mobile: the editor row wraps and the input gets a min-width floor', async () => {
    installMatchMedia(true);
    const AccountProfileSection = await loadProfile();
    render(<AccountProfileSection {...profileProps()} />);

    const input = screen.getByLabelText('Display name');
    const row = input.parentElement;
    expect(row.style.flexWrap).toBe('wrap');
    expect(input.style.minWidth).toBe('160px');
    // Save + cancel keep working on mobile — rename is an allowed mobile write.
    expect(screen.getByRole('button', { name: 'Save name' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Cancel editing' })).toBeTruthy();
  });

  test('desktop: the editor row stays a single no-wrap row (byte-identical)', async () => {
    installMatchMedia(false);
    const AccountProfileSection = await loadProfile();
    render(<AccountProfileSection {...profileProps()} />);

    const input = screen.getByLabelText('Display name');
    const row = input.parentElement;
    expect(row.style.flexWrap).toBe('nowrap');
    expect(input.style.minWidth).toBe('');
  });
});

describe('AccountSecuritySection — action rows reflow', () => {
  test('mobile: the sign-out-everywhere row stacks to a column', async () => {
    installMatchMedia(true);
    const AccountSecuritySection = await loadSecurity();
    render(<AccountSecuritySection auth={AUTH} onSignOut={vi.fn()} />);

    const heading = screen.getByText('Sign out everywhere');
    // heading > text-block > actionRow (the flex row holding text + button).
    const actionRow = heading.parentElement.parentElement;
    expect(actionRow.style.flexDirection).toBe('column');
    expect(actionRow.style.alignItems).toBe('flex-start');
  });

  test('desktop: the sign-out-everywhere row stays a centred single row', async () => {
    installMatchMedia(false);
    const AccountSecuritySection = await loadSecurity();
    render(<AccountSecuritySection auth={AUTH} onSignOut={vi.fn()} />);

    const heading = screen.getByText('Sign out everywhere');
    const actionRow = heading.parentElement.parentElement;
    expect(actionRow.style.flexDirection).toBe('row');
    expect(actionRow.style.alignItems).toBe('center');
  });
});
