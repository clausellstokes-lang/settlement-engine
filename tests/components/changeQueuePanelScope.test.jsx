/** @vitest-environment jsdom */
/**
 * changeQueuePanelScope.test.jsx — the render contract of the "Save N pending
 * changes" surface. The panel renders ONLY when its caller marks it active; when
 * inactive it renders nothing, even if orders somehow exist.
 *
 * Phase 4b widened WHO is active: the change-queue is now enabled for standalone
 * settlements AND clock-bound canon campaign members alike (the gate that
 * computes `active` moved off the clock-bound exclusion). This test pins the
 * panel's own active/inactive rendering, independent of that gating decision.
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

// Drive the queue contents + flushing flag through a stubbed store selector.
const ORDERS = [{ id: 'ord_1', type: 'link', humanLabel: 'Link Mossbridge', payload: {} }];
vi.mock('../../src/store/index.js', () => ({
  useStore: (selector) => selector({
    changeQueues: { save_1: ORDERS },
    changeQueueFlushing: false,
    cancelQueuedChange: () => {},
    flushQueue: async () => ({ ok: true }),
  }),
}));

import ChangeQueuePanel from '../../src/components/settlement/ChangeQueuePanel.jsx';

afterEach(cleanup);

describe('ChangeQueuePanel — render contract', () => {
  it('renders the queue when active (standalone OR campaign member)', () => {
    render(<ChangeQueuePanel saveId="save_1" active />);
    expect(screen.getByTestId('change-queue-panel')).toBeTruthy();
    expect(screen.getByText(/Save 1 pending change/)).toBeTruthy();
  });

  it('renders NOTHING when inactive, even with orders queued', () => {
    const { container } = render(<ChangeQueuePanel saveId="save_1" active={false} />);
    expect(screen.queryByTestId('change-queue-panel')).toBeNull();
    expect(container.firstChild).toBeNull();
  });
});
