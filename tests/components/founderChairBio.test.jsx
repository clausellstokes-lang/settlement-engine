/** @vitest-environment jsdom */
/**
 * founderChairBio.test.jsx — THE PRESENCE PIN on the Account block (§7).
 *
 * "Editing exists only for chair-holding accounts." Three arms on one component:
 * a non-founder gets NOTHING (absent, not disabled, not upsold); a founder whose
 * chair schema is undeployed gets nothing either (dormant-safe, the
 * FounderCreditToggle precedent); a founder on a deployed schema gets the editor,
 * band-guarded.
 *
 * The band pin matters because it is the only thing standing between a plate and
 * a blog — and because the civility guard is NOT yet wired, the band is currently
 * the ONLY guard the surface has. The test says so out loud rather than letting a
 * future reader assume coverage that does not exist.
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

const storeRef = { current: { isFounder: () => false } };
vi.mock('../../src/store/index.js', () => ({
  useStore: (selector) => selector(storeRef.current),
}));

const supabaseRef = { current: null };
vi.mock('../../src/lib/supabase.js', () => ({
  supabase: {
    auth: { getUser: async () => supabaseRef.current.getUser() },
    from: () => supabaseRef.current.from(),
    rpc: async (...args) => supabaseRef.current.rpc(...args),
  },
  isConfigured: true,
}));

import FounderChairBio from '../../src/components/account/FounderChairBio.jsx';
import { HALL_BIO_MIN, HALL_BIO_MAX } from '../../src/lib/foundersHall.js';

/** A backend where the chair column exists and returns `bio`. */
function deployed(bio = '', rpcCalls = []) {
  return {
    getUser: async () => ({ data: { user: { id: 'u1' } } }),
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: { founder_bio: bio }, error: null }) }) }) }),
    rpc: async (name, args) => { rpcCalls.push([name, args]); return { error: null }; },
  };
}

/** A backend where the column does not exist yet (the live pre-deploy state). */
function undeployed() {
  return {
    getUser: async () => ({ data: { user: { id: 'u1' } } }),
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null, error: { message: 'column does not exist' } }) }) }) }),
    rpc: async () => ({ error: { message: 'function does not exist' } }),
  };
}

const settle = async () => { await act(async () => { await Promise.resolve(); await Promise.resolve(); }); };

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('THE PRESENCE DISCIPLINE — three arms', () => {
  test('a NON-FOUNDER gets nothing at all: absent, not disabled, not upsold', async () => {
    storeRef.current = { isFounder: () => false };
    supabaseRef.current = deployed('anything');
    const { container } = render(<FounderChairBio />);
    await settle();
    expect(container.innerHTML).toBe('');
    // Non-vacuity: the same component DOES render for a founder (arm three).
  });

  test('a FOUNDER on an undeployed schema gets nothing — dormant, never an error', async () => {
    storeRef.current = { isFounder: () => true };
    supabaseRef.current = undeployed();
    const { container } = render(<FounderChairBio />);
    await settle();
    expect(container.innerHTML).toBe('');
  });

  test('a FOUNDER on a deployed schema gets the editor, seeded with their line', async () => {
    storeRef.current = { isFounder: () => true };
    supabaseRef.current = deployed('Keeps small towns and long winters, and the people in them.');
    render(<FounderChairBio />);
    const field = await screen.findByLabelText("Your line in the Founders' Hall");
    expect(field.value).toContain('Keeps small towns');
    // The arm that makes the two absences above meaningful.
    expect(screen.getByRole('button', { name: /Save your line/ })).toBeTruthy();
  });
});

describe('THE BAND (§2 — a plate is not a blog)', () => {
  test('a too-short line is refused politely and nothing is written', async () => {
    const calls = [];
    storeRef.current = { isFounder: () => true };
    supabaseRef.current = deployed('', calls);
    render(<FounderChairBio />);
    const field = await screen.findByLabelText("Your line in the Founders' Hall");
    fireEvent.change(field, { target: { value: 'too short' } });
    fireEvent.click(screen.getByRole('button', { name: /Save your line/ }));
    await waitFor(() => expect(screen.getByRole('alert')).toBeTruthy());
    expect(screen.getByRole('alert').textContent).toContain(String(HALL_BIO_MIN));
    expect(calls).toHaveLength(0);
  });

  test('a line inside the band is written through the founder-gated RPC', async () => {
    const calls = [];
    storeRef.current = { isFounder: () => true };
    supabaseRef.current = deployed('', calls);
    render(<FounderChairBio />);
    const field = await screen.findByLabelText("Your line in the Founders' Hall");
    const line = 'A patron of small towns and long winters, and of the people who keep them.';
    fireEvent.change(field, { target: { value: line } });
    fireEvent.click(screen.getByRole('button', { name: /Save your line/ }));
    await waitFor(() => expect(calls).toHaveLength(1));
    expect(calls[0][0]).toBe('set_founder_chair_bio');
    expect(calls[0][1]).toEqual({ p_bio: line });
  });

  test('the long end of the band is enforced by the control itself, not only on save', async () => {
    storeRef.current = { isFounder: () => true };
    supabaseRef.current = deployed('');
    render(<FounderChairBio />);
    const field = await screen.findByLabelText("Your line in the Founders' Hall");
    expect(Number(field.getAttribute('maxlength'))).toBe(HALL_BIO_MAX);
  });

  test('the surface never claims a civility check it did not get', async () => {
    // The guard is another lane's module (DESIGN_PROFILE_IMAGE §9). Until it is
    // injected, the copy must not promise moderation — only the band is real.
    storeRef.current = { isFounder: () => true };
    supabaseRef.current = deployed('');
    render(<FounderChairBio />);
    await screen.findByLabelText("Your line in the Founders' Hall");
    const text = document.body.textContent.toLowerCase();
    for (const claim of ['moderated', 'reviewed before', 'screened', 'filtered']) {
      expect(text.includes(claim), `the bio editor claims "${claim}"`).toBe(false);
    }
    expect(text).toContain('optional'); // non-vacuity: the copy this pin read is present
  });
});
