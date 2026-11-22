/** @vitest-environment jsdom */
/**
 * tests/components/useDialogFocusTrap.test.jsx — initial-focus precedence.
 *
 * The trap moves focus into the dialog on open. Previously it always grabbed the
 * FIRST focusable (typically the header close button), overriding an input that
 * declared autoFocus. A rename/search field that opted into autoFocus should
 * keep focus instead. These tests pin the precedence:
 *   1. an explicit [autofocus] element wins;
 *   2. focus already sitting inside the dialog is left alone;
 *   3. otherwise fall back to the first focusable.
 */

import { describe, it, expect, afterEach } from 'vitest';
import { renderHook, cleanup } from '@testing-library/react';
import { useDialogFocusTrap } from '../../src/components/primitives/useDialogFocusTrap.js';

afterEach(() => {
  cleanup();
  document.body.innerHTML = '';
});

// Build a dialog node (close button first, then a named input) and attach it to
// the ref BEFORE the open effect runs by passing the ref via initialProps.
function mountDialog({ autofocusInput = false, preFocusInput = false } = {}) {
  const node = document.createElement('div');
  node.setAttribute('role', 'dialog');
  node.innerHTML = `
    <button data-testid="close">Close</button>
    <input data-testid="field" ${autofocusInput ? 'autofocus' : ''} />
  `;
  document.body.appendChild(node);

  const { result, rerender } = renderHook(
    ({ open }) => {
      const ref = useDialogFocusTrap(open, () => {});
      ref.current = node;
      return ref;
    },
    { initialProps: { open: false } },
  );

  if (preFocusInput) node.querySelector('[data-testid="field"]').focus();
  // Flip to open so the effect runs with the ref already wired to `node`.
  rerender({ open: true });
  return { node, result };
}

describe('useDialogFocusTrap — initial focus precedence', () => {
  it('respects an [autofocus] field instead of the header close button', () => {
    const { node } = mountDialog({ autofocusInput: true });
    expect(document.activeElement).toBe(node.querySelector('[data-testid="field"]'));
    expect(document.activeElement).not.toBe(node.querySelector('[data-testid="close"]'));
  });

  it('falls back to the first focusable when nothing declares autofocus', () => {
    const { node } = mountDialog({ autofocusInput: false });
    expect(document.activeElement).toBe(node.querySelector('[data-testid="close"]'));
  });

  it('leaves focus alone when it already sits inside the dialog', () => {
    const { node } = mountDialog({ preFocusInput: true });
    expect(document.activeElement).toBe(node.querySelector('[data-testid="field"]'));
  });
});
