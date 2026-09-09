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
