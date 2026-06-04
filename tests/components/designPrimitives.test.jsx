/** @vitest-environment jsdom */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import Badge from '../../src/components/primitives/Badge.jsx';
import Button from '../../src/components/primitives/Button.jsx';
import Disclosure from '../../src/components/primitives/Disclosure.jsx';
import { ConfirmDialog, TextInputDialog } from '../../src/components/primitives/Dialog.jsx';

describe('design primitives', () => {
  afterEach(() => cleanup());

  test('Button renders a disabled busy state', () => {
    render(<Button busy>Working</Button>);
    const button = screen.getByRole('button');
    expect(button.disabled).toBe(true);
    expect(screen.getByText('Working')).toBeTruthy();
  });

  test('Badge supports removable chips', () => {
    const onRemove = vi.fn();
    render(<Badge onRemove={onRemove}>Merchant League</Badge>);

    fireEvent.click(screen.getByLabelText('Remove'));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  test('Disclosure hides and reveals content', () => {
    render(<Disclosure title="Institutions">Granary</Disclosure>);

    expect(screen.queryByText('Granary')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /Institutions/i }));
    expect(screen.getByText('Granary')).toBeTruthy();
  });

  test('ConfirmDialog calls confirm and cancel handlers', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(
      <ConfirmDialog
        open
        title="Reset to draft?"
        body="This cannot be undone."
        confirmLabel="Reset"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    );

    fireEvent.click(screen.getByText('Reset'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByLabelText('Close'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test('TextInputDialog submits the entered value', () => {
    const onConfirm = vi.fn();
    render(
      <TextInputDialog
        open
        title="Edit label text"
        label="Label text"
        initialValue="Old"
        onConfirm={onConfirm}
      />,
    );

    const input = screen.getByLabelText('Label text');
    fireEvent.change(input, { target: { value: 'New Label' } });
    fireEvent.click(screen.getByText('Save'));

    expect(onConfirm).toHaveBeenCalledWith('New Label');
  });
});
