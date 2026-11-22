/**
 * @vitest-environment jsdom
 *
 * tests/components/primitives/useDialogFocusTrap.test.jsx — Escape-handling
 * contract for stacked dialogs.
 *
 * Each open trap adds a window keydown listener. The bug: stacking two dialogs
 * meant a single Escape fired BOTH onCancel handlers (both close). The fix is a
 * shared open-dialog stack so only the topmost trap reacts to a key.
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { renderHook, cleanup } from '@testing-library/react';

import { useDialogFocusTrap } from '../../../src/components/primitives/useDialogFocusTrap.js';

afterEach(cleanup);

function pressEscape() {
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
}

describe('useDialogFocusTrap — stacked Escape handling', () => {
  test('a single open dialog closes on Escape', () => {
    const onCancel = vi.fn();
    renderHook(() => useDialogFocusTrap(true, onCancel));
    pressEscape();
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test('only the topmost of two stacked dialogs handles Escape', () => {
    const outerCancel = vi.fn();
    const innerCancel = vi.fn();

    // Open the outer dialog first, then the inner one on top of it.
    renderHook(() => useDialogFocusTrap(true, outerCancel));
    renderHook(() => useDialogFocusTrap(true, innerCancel));

    pressEscape();

    // Only the topmost (inner) dialog should close on a single Escape.
    expect(innerCancel).toHaveBeenCalledTimes(1);
    expect(outerCancel).not.toHaveBeenCalled();
  });

  test('after the top dialog closes, Escape falls through to the next one', () => {
    const outerCancel = vi.fn();
    const innerCancel = vi.fn();

    renderHook(() => useDialogFocusTrap(true, outerCancel));
    const inner = renderHook(({ open }) => useDialogFocusTrap(open, innerCancel), {
      initialProps: { open: true },
    });

    pressEscape();
    expect(innerCancel).toHaveBeenCalledTimes(1);
    expect(outerCancel).not.toHaveBeenCalled();

    // Close the inner dialog; it pops off the stack.
    inner.rerender({ open: false });

    pressEscape();
    expect(outerCancel).toHaveBeenCalledTimes(1);
    expect(innerCancel).toHaveBeenCalledTimes(1); // unchanged
  });
});
