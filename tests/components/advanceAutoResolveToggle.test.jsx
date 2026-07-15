/**
 * @vitest-environment jsdom
 *
 * tests/components/advanceAutoResolveToggle.test.jsx — Advance-scaling Stage 4 (a):
 * the autoresolve toggle. Pins:
 *   • the toggle renders its calm label + the one-line help.
 *   • it reflects the bound value (default OFF) and calls onChange(true) when flipped
 *     — i.e. it sets advanceAutoResolve.
 *   • ConfirmDialog renders the toggle when handed via the `extra` slot, and renders
 *     NOTHING extra when the slot is null (the flag-OFF path) — so the dialog is
 *     byte-unchanged off-flag.
 */

import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import { AdvanceAutoResolveToggle } from '../../src/components/map/AdvanceAutoResolveToggle.jsx';
import { ConfirmDialog } from '../../src/components/primitives/Dialog.jsx';

afterEach(cleanup);

describe('AdvanceAutoResolveToggle', () => {
  test('renders the calm label + one-line help and reflects the bound (default OFF) value', () => {
    render(<AdvanceAutoResolveToggle value={false} onChange={() => {}} />);
    expect(screen.getByText('Auto-resolve every change')).toBeTruthy();
    expect(screen.getByText('Auto-resolve every change, or pause at the big forks.')).toBeTruthy();
    const sw = screen.getByRole('switch');
    expect(sw.checked).toBe(false);
    expect(sw.getAttribute('aria-checked')).toBe('false');
  });

  test('flipping the switch calls onChange(true) — sets advanceAutoResolve', () => {
    const onChange = vi.fn();
    render(<AdvanceAutoResolveToggle value={false} onChange={onChange} />);
    fireEvent.click(screen.getByRole('switch'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  test('ConfirmDialog renders the toggle in the extra slot when the flag is ON', () => {
    render(
      <ConfirmDialog
        open
        title="Advance the realm?"
        body="…"
        confirmLabel="Advance Realm"
        extra={<AdvanceAutoResolveToggle value={false} onChange={() => {}} />}
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );
    // The toggle is present inside the confirm dialog.
    expect(screen.getByRole('switch')).toBeTruthy();
    expect(screen.getByText('Auto-resolve every change')).toBeTruthy();
    expect(screen.getByText('Advance Realm')).toBeTruthy();
  });

  test('ConfirmDialog renders NO toggle when extra is null (flag-OFF path)', () => {
    render(
      <ConfirmDialog
        open
        title="Advance the realm?"
        body="…"
        confirmLabel="Advance Realm"
        extra={null}
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );
    expect(screen.queryByRole('switch')).toBeNull();
    expect(screen.queryByText('Auto-resolve every change')).toBeNull();
  });
});
