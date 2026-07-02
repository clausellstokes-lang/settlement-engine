/**
 * @vitest-environment jsdom
 *
 * tests/ui/batchCartAdvanceGuard.test.jsx — Advance-busy affordance lock-in.
 *
 * The batch "Apply all" onApply is already a safe no-op during a world advance
 * (EventComposer guards it with `if (advanceBusy) return`). This test pins the
 * matching VISUAL affordance: when the composer threads advanceBusy into
 * BatchCart, the Apply-all button must render disabled (matching the main
 * Apply button) and the "realm is advancing" note must appear — so the user
 * isn't left clicking a button that silently does nothing.
 */

import { describe, test, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { BatchCart } from '../../src/components/settlement/eventComposer/BatchCart.jsx';

afterEach(cleanup);

// `mira` is a real settlement NPC so KILL_NPC produces NO blocking
// cross-reference warning — advanceBusy is then the sole gate on Apply-all,
// which is exactly the affordance under test.
const settlement = {
  name: 'Greenhollow',
  institutions: [],
  npcs: [{ id: 'mira', name: 'Mira' }],
  factions: [],
  powerStructure: { factions: [] },
  config: {},
};

const staged = [{ id: 'ev_1', type: 'KILL_NPC', targetId: 'mira' }];

const noop = () => {};

function renderCart(advanceBusy) {
  return render(
    <BatchCart
      staged={staged}
      settlement={settlement}
      phase="live"
      advanceBusy={advanceBusy}
      pendingBatchPreview={null}
      onRemove={noop}
      onClear={noop}
      onPreview={noop}
      onApply={noop}
    />,
  );
}

describe('BatchCart — advance-busy affordance', () => {
  test('Apply-all is enabled and no advancing note when not advancing', () => {
    renderCart(false);
    const applyBtn = screen.getByRole('button', { name: /Apply all/ });
    expect(applyBtn.disabled).toBe(false);
    expect(screen.queryByText(/realm is advancing/i)).toBeNull();
  });

  test('Apply-all is disabled and shows the advancing note during an advance', () => {
    renderCart(true);
    const applyBtn = screen.getByRole('button', { name: /Apply all/ });
    expect(applyBtn.disabled).toBe(true);
    expect(screen.getByText(/realm is advancing/i)).toBeTruthy();
  });

  test('Preview batch stays enabled during an advance (only Apply is gated)', () => {
    renderCart(true);
    const previewBtn = screen.getByRole('button', { name: /Preview batch/ });
    expect(previewBtn.disabled).toBe(false);
  });
});
