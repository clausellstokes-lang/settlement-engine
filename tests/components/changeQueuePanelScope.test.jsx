/** @vitest-environment jsdom */
/**
 * changeQueuePanelScope.test.jsx — the Phase 4a STANDALONE scope of the
 * "Save N pending changes" surface. The queue must render ONLY for a
 * non-clock-bound settlement: for a clock-bound canon campaign member it is
 * inactive (active=false) and renders nothing, even if orders somehow exist —
 * so a staged change can never silently redirect into the world pulse.
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

describe('ChangeQueuePanel — standalone-only scope', () => {
  it('renders the queue for a standalone settlement (active)', () => {
    render(<ChangeQueuePanel saveId="save_1" active />);
    expect(screen.getByTestId('change-queue-panel')).toBeTruthy();
    expect(screen.getByText(/Save 1 pending change/)).toBeTruthy();
  });

  it('renders NOTHING for a clock-bound campaign member (inactive), even with orders queued', () => {
    const { container } = render(<ChangeQueuePanel saveId="save_1" active={false} />);
    expect(screen.queryByTestId('change-queue-panel')).toBeNull();
    expect(container.firstChild).toBeNull();
  });
});
