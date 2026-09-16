/**
 * @vitest-environment jsdom
 *
 * AuthModal keyboard guard (finding components-shell-commerce-1, W-R2-TRUST).
 *
 * THE BUG THIS CATCHES: the backdrop carried
 * `onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClose(); }}` and
 * the inner card stopped only clicks — so an Enter/Space keydown typed inside the
 * sign-in form bubbled to the backdrop and closed the modal. Pressing Enter to
 * submit a FAILED sign-in dismissed the modal before the error rendered (the user
 * believed they were signed in); a space anywhere in a passphrase dismissed it.
 *
 * THE FIX: AuthModal adopts useDialogFocusTrap (Escape-to-close, focus trap) and
 * the card stops key propagation — the PurchaseModal shape. Enter/Space inside
 * the form no longer reach a close handler; the field's own handler still runs.
 *
 * THE PINS: Enter and Space keydown inside the form do NOT call onClose; the
 * field's own key handler still fires (Enter still submits); Escape still closes;
 * a backdrop click still closes.
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';

afterEach(cleanup);

const { submitSpy } = vi.hoisted(() => ({ submitSpy: { fn: null } }));

// Stub the shared auth form with a single field whose Enter handler is a spy —
// stands in for AuthPanel's onEnter→submit without pulling in supabase.
vi.mock('../../src/components/auth/AuthPanel.jsx', () => ({
  default: () => (
    <input
      aria-label="passphrase"
      onKeyDown={e => { if (e.key === 'Enter') submitSpy.fn?.(); }}
    />
  ),
}));

import AuthModal from '../../src/components/AuthModal.jsx';

describe('AuthModal keyboard guard', () => {
  test('Enter inside the form does NOT close the modal and still reaches the field', () => {
    const onClose = vi.fn();
    submitSpy.fn = vi.fn();
    render(<AuthModal onClose={onClose} />);

    const field = screen.getByLabelText('passphrase');
    fireEvent.keyDown(field, { key: 'Enter' });

    expect(onClose).not.toHaveBeenCalled();   // the bug: this fired
    expect(submitSpy.fn).toHaveBeenCalledTimes(1); // the field's own handler still runs
  });

  test('Space inside the form does NOT dismiss the modal', () => {
    const onClose = vi.fn();
    submitSpy.fn = vi.fn();
    render(<AuthModal onClose={onClose} />);

    const field = screen.getByLabelText('passphrase');
    fireEvent.keyDown(field, { key: ' ' });

    expect(onClose).not.toHaveBeenCalled();
  });

  test('Escape still closes (focus trap)', () => {
    const onClose = vi.fn();
    render(<AuthModal onClose={onClose} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('a backdrop click still closes', () => {
    const onClose = vi.fn();
    render(<AuthModal onClose={onClose} />);
    // The dialog is labelled; its parent is the backdrop.
    const dialog = screen.getByRole('dialog');
    fireEvent.click(dialog.parentElement);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
