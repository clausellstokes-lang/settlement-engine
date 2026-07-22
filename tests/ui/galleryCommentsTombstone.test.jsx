/**
 * @vitest-environment jsdom
 *
 * galleryCommentsTombstone.test.jsx — a moderation-removed comment (172) renders
 * as an in-place TOMBSTONE in the thread, distinct from an author delete (which
 * stays hidden), and the original body/author never reach the client.
 */
import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, waitFor, fireEvent, within } from '@testing-library/react';

const fetchGalleryComments = vi.fn();
const rpc = vi.fn();
vi.mock('../../src/lib/supabase.js', () => ({ supabase: { rpc: (...a) => rpc(...a) } }));
vi.mock('../../src/lib/gallery.js', () => ({
  fetchGalleryComments: (...a) => fetchGalleryComments(...a),
  addGalleryComment: vi.fn(),
  deleteGalleryComment: vi.fn(),
}));

afterEach(cleanup);

async function importComments() {
  return (await import('../../src/components/gallery/GalleryComments.jsx')).default;
}

describe('GalleryComments — moderation tombstone', () => {
  test('a moderated comment shows the tombstone in place; a live one shows normally', async () => {
    fetchGalleryComments.mockResolvedValue([
      { id: 'c1', moderated: true, body: '', canDelete: false, authorLabel: '', createdAt: '2026-07-01T00:00:00Z' },
      { id: 'c2', moderated: false, body: 'A fine dossier.', canDelete: false, authorLabel: 'A DM', createdAt: '2026-07-02T00:00:00Z' },
    ]);
    const GalleryComments = await importComments();
    render(<GalleryComments dossier={{ id: 'd1' }} auth={null} />);

    await screen.findByText(/removed by moderation/i);
    // The live comment renders its body; the tombstone shows neither body nor author.
    expect(screen.getByText('A fine dossier.')).toBeTruthy();
    // Both rows are still present (tombstone stays IN the thread) — the count is 2.
    await waitFor(() => expect(fetchGalleryComments).toHaveBeenCalled());
  });

  test('an empty thread shows the no-comments state, not a tombstone', async () => {
    fetchGalleryComments.mockResolvedValue([]);
    const GalleryComments = await importComments();
    render(<GalleryComments dossier={{ id: 'd1' }} auth={null} />);
    await screen.findByText(/no comments yet/i);
    expect(screen.queryByText(/removed by moderation/i)).toBeNull();
  });

  test('a signed-in reader can report a comment via the kebab menu', async () => {
    fetchGalleryComments.mockResolvedValue([
      { id: 'c2', moderated: false, body: 'A fine dossier.', canDelete: false, authorLabel: 'A DM', createdAt: '2026-07-02T00:00:00Z' },
    ]);
    rpc.mockResolvedValue({ error: null });
    const GalleryComments = await importComments();
    render(<GalleryComments dossier={{ id: 'd1' }} auth={{ user: { id: 'u1' } }} />);
    await screen.findByText('A fine dossier.');

    // Open the kebab, choose Report, submit the form.
    fireEvent.click(screen.getByRole('button', { name: /comment options/i }));
    fireEvent.click(screen.getByRole('menuitem', { name: /report/i }));
    fireEvent.click(screen.getByRole('button', { name: /send report/i }));
    await waitFor(() => expect(rpc).toHaveBeenCalledWith('report_gallery_comment', expect.objectContaining({ target_comment_id: 'c2' })));
  });

  test('a signed-out reader gets no kebab (nothing to report or delete)', async () => {
    fetchGalleryComments.mockResolvedValue([
      { id: 'c2', moderated: false, body: 'A fine dossier.', canDelete: false, authorLabel: 'A DM', createdAt: '2026-07-02T00:00:00Z' },
    ]);
    const GalleryComments = await importComments();
    render(<GalleryComments dossier={{ id: 'd1' }} auth={null} />);
    await screen.findByText('A fine dossier.');
    expect(screen.queryByRole('button', { name: /comment options/i })).toBeNull();
  });
});
