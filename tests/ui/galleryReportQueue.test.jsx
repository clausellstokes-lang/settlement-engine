/**
 * @vitest-environment jsdom
 *
 * galleryReportQueue.test.jsx — the unified cross-kind moderation queue (173) in
 * GalleryModerationPanel: lists reported targets across kinds, is dormant-safe
 * when the RPC is undeployed, and dismisses a target's reports together.
 */
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor, within } from '@testing-library/react';

const rpc = vi.fn();
vi.mock('../../src/lib/supabase.js', () => ({ supabase: { rpc: (...a) => rpc(...a) } }));
vi.mock('../../src/lib/gallery.js', () => ({
  fetchGalleryReports: vi.fn(async () => []),
  resolveGalleryReport: vi.fn(async () => {}),
}));
vi.mock('../../src/hooks/useRoute.js', () => ({ navigate: vi.fn() }));

afterEach(cleanup);
async function importPanel() {
  return (await import('../../src/components/gallery/GalleryModerationPanel.jsx')).default;
}

describe('GalleryModerationPanel — unified report queue (173)', () => {
  beforeEach(() => { rpc.mockReset(); });

  test('renders reported targets across kinds with counts', async () => {
    rpc.mockImplementation((fn) => {
      if (fn === 'list_open_report_targets') {
        return Promise.resolve({ data: [
          { kind: 'map', target_id: 'm1', label: 'The Broken Coast', is_public: true, report_count: 2, reasons: ['spam', 'unsafe_content'], latest_at: '2026-07-01' },
          { kind: 'comment', target_id: 'c1', label: 'rude thing', is_public: true, report_count: 1, reasons: ['other'], latest_at: '2026-07-02' },
        ], error: null });
      }
      return Promise.resolve({ data: null, error: null });
    });
    const Panel = await importPanel();
    render(<Panel />);
    await screen.findByText('The Broken Coast');
    expect(screen.getByText('rude thing')).toBeTruthy();
    expect(screen.getByText('2 reports')).toBeTruthy();
  });

  test('is dormant-safe when the queue RPC is undeployed (error → empty state)', async () => {
    rpc.mockResolvedValue({ data: null, error: { message: 'function does not exist' } });
    const Panel = await importPanel();
    render(<Panel />);
    await screen.findByText(/no open reports/i);
  });

  test('dismissing a target clears all its reports via resolve_report_target', async () => {
    rpc.mockImplementation((fn) => {
      if (fn === 'list_open_report_targets') {
        return Promise.resolve({ data: [
          { kind: 'map', target_id: 'm1', label: 'The Broken Coast', is_public: true, report_count: 2, reasons: ['spam'], latest_at: '2026-07-01' },
        ], error: null });
      }
      return Promise.resolve({ data: 2, error: null });
    });
    const Panel = await importPanel();
    render(<Panel />);
    const card = (await screen.findByText('The Broken Coast')).closest('article');
    fireEvent.click(within(card).getByRole('button', { name: /dismiss/i }));
    await waitFor(() => expect(rpc).toHaveBeenCalledWith('resolve_report_target', expect.objectContaining({ p_kind: 'map', p_target_id: 'm1', p_status: 'dismissed' })));
  });
});

// ── T7 survey (2026-10-30): a refusal is not an empty queue. Dormant-safety is
//    kept for the one error that means "not deployed" (the function is missing);
//    any other failure (a permission refusal, a network drop) is shown. ──
describe('GalleryModerationPanel — refusals are shown (T7 survey)', () => {
  beforeEach(() => { rpc.mockReset(); });

  test('a permission refusal on the queue read is shown, not rendered as "No open reports"', async () => {
    rpc.mockResolvedValue({ data: null, error: { code: '42501', message: 'permission denied for function list_open_report_targets' } });
    const Panel = await importPanel();
    render(<Panel />);
    expect((await screen.findByRole('alert')).textContent).toMatch(/permission denied/i);
    expect(screen.queryByText(/no open reports/i)).toBeNull();
  });

  test('a PostgREST "function not found" (PGRST202) stays dormant-safe', async () => {
    rpc.mockResolvedValue({ data: null, error: { code: 'PGRST202', message: 'Could not find the function public.list_open_report_targets without parameters in the schema cache' } });
    const Panel = await importPanel();
    render(<Panel />);
    await screen.findByText(/no open reports/i);
    expect(screen.queryByRole('alert')).toBeNull();
  });

  test('a refused resolve is shown on the queue', async () => {
    rpc.mockImplementation((fn) => {
      if (fn === 'list_open_report_targets') {
        return Promise.resolve({ data: [{ kind: 'comment', target_id: 'c1', label: 'rude thing', is_public: true, report_count: 1, reasons: ['other'], latest_at: '2026-07-02' }], error: null });
      }
      return Promise.resolve({ data: null, error: { message: 'Only admins can resolve reports' } });
    });
    const Panel = await importPanel();
    render(<Panel />);
    const card = (await screen.findByText('rude thing')).closest('article');
    fireEvent.click(within(card).getByRole('button', { name: /mark resolved/i }));
    expect((await screen.findByRole('alert')).textContent).toMatch(/only admins can resolve reports/i);
  });

  test('the detail list reads list_gallery_reports per status tab and shows a failed read', async () => {
    rpc.mockResolvedValue({ data: [], error: null });
    const gallery = await import('../../src/lib/gallery.js');
    gallery.fetchGalleryReports.mockReset();
    gallery.fetchGalleryReports.mockImplementation(async ({ status }) => {
      if (status === 'dismissed') throw new Error('Gallery reports could not be loaded');
      return [];
    });
    const Panel = await importPanel();
    render(<Panel />);
    await waitFor(() => expect(gallery.fetchGalleryReports).toHaveBeenCalledWith({ status: 'open', limit: 50 }));
    fireEvent.click(screen.getByRole('button', { name: /^dismissed$/i }));
    await waitFor(() => expect(gallery.fetchGalleryReports).toHaveBeenCalledWith({ status: 'dismissed', limit: 50 }));
    expect(await screen.findByText(/gallery reports could not be loaded/i)).toBeTruthy();
  });
});
