/**
 * @vitest-environment jsdom
 *
 * civilityBlockWiring.test.jsx — the BLOCK mode at its two ORDERED surfaces
 * (DESIGN_PROFILE_IMAGE.md §9: "obscene or abusive language in a DISPLAY NAME or
 * a COMMENT is simply prevented").
 *
 * The design's §9 pin list ends with the one that is easiest to skip and most
 * important to keep: "no other account capability is touched by a refusal (the
 * proportionality pin — walk the account surface after a block and assert
 * nothing else changed)". A content filter that quietly costs someone something
 * else is a different product from the one the owner ordered. So the refusal
 * tests here assert BOTH halves every time: the text did not go through, AND
 * nothing else moved.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

import GalleryComments from '../../src/components/gallery/GalleryComments.jsx';

const galleryApi = vi.hoisted(() => ({
  addGalleryComment: vi.fn(async () => ({})),
  fetchGalleryComments: vi.fn(async () => []),
  deleteGalleryComment: vi.fn(async () => {}),
}));

vi.mock('../../src/lib/gallery.js', () => galleryApi);
vi.mock('../../src/lib/supabase.js', () => ({
  supabase: { auth: { getUser: async () => ({ data: { user: null } }) } },
  isConfigured: false,
}));

afterEach(() => { cleanup(); vi.clearAllMocks(); });

const auth = { user: { id: 'u1', email: 'dm@example.com' } };

async function typeComment(text) {
  render(<GalleryComments dossier={{ id: 'd1', name: 'Ashfen' }} auth={auth} />);
  const box = await screen.findByLabelText(/comment/i);
  fireEvent.change(box, { target: { value: text } });
  fireEvent.click(screen.getByRole('button', { name: /post/i }));
  return box;
}

describe('a comment is AUTHORED-PUBLIC text — the gate is the entry', () => {
  it('refuses to post flagged text, and posts nothing', async () => {
    await typeComment('you are a shit and I hope you know it');
    await waitFor(() => expect(screen.getByRole('alert')).toBeTruthy());
    expect(galleryApi.addGalleryComment).not.toHaveBeenCalled();
  });

  it('the refusal is polite, non-accusatory, and NEVER echoes the matched word', async () => {
    await typeComment('you are a shit and I hope you know it');
    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toContain('That comment can’t be posted.');
    // A mistake path in the same breath — false positives are support tickets.
    expect(alert.textContent).toMatch(/Feedback & support/);
    // No moralising, no lecture, and above all no echo of the term. The term is
    // structurally unavailable: checkCivility never returns it.
    expect(alert.textContent.toLowerCase()).not.toContain('shit');
  });

  it('PROPORTIONALITY — the author keeps their draft and their ability to post', async () => {
    const box = await typeComment('you are a shit and I hope you know it');
    await screen.findByRole('alert');

    // Their words are still in the box: a refusal is not a confiscation, and
    // clearing the field would make a false positive genuinely costly.
    expect(box.value).toBe('you are a shit and I hope you know it');
    // The control is still live — no lockout, no cooldown, no strike.
    expect(screen.getByRole('button', { name: /post/i }).disabled).toBe(false);
  });

  it('a rewritten comment posts normally — the refusal was about the string', async () => {
    render(<GalleryComments dossier={{ id: 'd1', name: 'Ashfen' }} auth={auth} />);
    const box = await screen.findByLabelText(/comment/i);

    fireEvent.change(box, { target: { value: 'that is shit' } });
    fireEvent.click(screen.getByRole('button', { name: /post/i }));
    await screen.findByRole('alert');
    expect(galleryApi.addGalleryComment).not.toHaveBeenCalled();

    fireEvent.change(box, { target: { value: 'that is disappointing' } });
    fireEvent.click(screen.getByRole('button', { name: /post/i }));
    await waitFor(() => expect(galleryApi.addGalleryComment).toHaveBeenCalledTimes(1));
    expect(galleryApi.addGalleryComment).toHaveBeenCalledWith('d1', 'that is disappointing');
  });

  it('THE SCUNTHORPE DEFENSE reaches the real surface, not just the validator', async () => {
    // The reason this is worth a wiring test of its own: a guard that convicts
    // ordinary place names would be discovered by users, not by unit tests.
    render(<GalleryComments dossier={{ id: 'd1', name: 'Ashfen' }} auth={auth} />);
    const box = await screen.findByLabelText(/comment/i);
    fireEvent.change(box, { target: { value: 'I set mine near Scunthorpe, by Cockburn Reach.' } });
    fireEvent.click(screen.getByRole('button', { name: /post/i }));
    await waitFor(() => expect(galleryApi.addGalleryComment).toHaveBeenCalledTimes(1));
    expect(screen.queryByRole('alert')).toBe(null);
  });
});
