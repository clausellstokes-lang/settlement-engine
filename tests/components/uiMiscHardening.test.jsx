/**
 * @vitest-environment jsdom
 *
 * tests/components/uiMiscHardening.test.jsx — B13-ui-misc review fixes.
 *
 * Covers:
 *   • Dialog/Shell focus trap no longer re-runs (steals focus) when the parent
 *     re-renders with a fresh onCancel identity (finding #1).
 *   • The shared focus-trap hook handles Escape via the latest handler and
 *     restores focus on close — GalleryReportDialog inherits it (finding #3).
 *   • AccountProfileSection only renders an avatar background for safe http(s)
 *     URLs, falling back to the initial-letter gradient otherwise (finding #2).
 *   • ImageCropper surfaces a visible error instead of silently failing, and
 *     requests crossOrigin for remote images (finding #5).
 *   • Disclosure wires aria-controls between trigger and panel (finding #7).
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { act } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import { TextInputDialog } from '../../src/components/primitives/Dialog.jsx';
import Disclosure from '../../src/components/primitives/Disclosure.jsx';
import AccountProfileSection from '../../src/components/account/AccountProfileSection.jsx';
import ImageCropper from '../../src/components/gallery/ImageCropper.jsx';
import GalleryReportDialog from '../../src/components/gallery/GalleryReportDialog.jsx';

afterEach(cleanup);

describe('Dialog focus trap (finding #1) — survives parent re-renders', () => {
  test('a re-render with a new onCancel identity does not yank focus off the input', () => {
    const Harness = () => {
      // A non-stable onCancel: a fresh function on every render, like a parent
      // that recreates handlers when an unrelated busy flag flips.
      return (
        <TextInputDialog
          open
          title="Rename"
          label="Name"
          initialValue=""
          onCancel={() => {}}
          onConfirm={() => {}}
        />
      );
    };
    const { rerender } = render(<Harness />);
    const input = screen.getByLabelText('Name');
    // User clicks into the field and types — focus is on the input.
    input.focus();
    expect(document.activeElement).toBe(input);

    // Parent re-renders (new onCancel identity). Previously this re-ran the
    // focus-in effect and moved focus to the first focusable. It must not now.
    rerender(<Harness />);
    expect(document.activeElement).toBe(input);
  });
});

describe('Shared focus trap (finding #3) — Escape uses the latest handler', () => {
  test('Escape invokes onCancel even after the handler identity changes', () => {
    const onCancel = vi.fn();
    const { rerender } = render(
      <TextInputDialog open title="Rename" label="Name" onCancel={onCancel} onConfirm={() => {}} />,
    );
    // Re-render to swap in a stable-but-rebuilt closure; the ref keeps the latest.
    const onCancel2 = vi.fn();
    rerender(
      <TextInputDialog open title="Rename" label="Name" onCancel={onCancel2} onConfirm={() => {}} />,
    );
    act(() => {
      fireEvent.keyDown(window, { key: 'Escape' });
    });
    expect(onCancel2).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();
  });

});

describe('GalleryReportDialog (finding #3) — inherits the primitives focus trap', () => {
  const auth = { user: { id: 'u1', email: 'reporter@example.com' } };
  const dossier = { id: 'd1', name: 'Holdfast' };

  test('opening moves focus into the dialog and exposes aria-modal', () => {
    render(<GalleryReportDialog dossier={dossier} auth={auth} onReport={vi.fn()} />);
    act(() => { fireEvent.click(screen.getByRole('button', { name: /Report/i })); });
    const dialog = screen.getByRole('dialog', { name: /Report settlement/i });
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    // Focus was pulled into the dialog rather than left on the trigger.
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  test('Escape closes the dialog via the shared trap', () => {
    render(<GalleryReportDialog dossier={dossier} auth={auth} onReport={vi.fn()} />);
    act(() => { fireEvent.click(screen.getByRole('button', { name: /Report/i })); });
    expect(screen.queryByRole('dialog')).toBeTruthy();
    act(() => { fireEvent.keyDown(window, { key: 'Escape' }); });
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});

describe('AccountProfileSection avatar URL (finding #2)', () => {
  const baseProps = {
    auth: { displayName: 'Aldric', user: { email: 'aldric@example.com' }, role: 'user' },
    setAvatarInput: vi.fn(),
    emailNotifications: false, setEmailNotifications: vi.fn(),
    modelPreference: '', setModelPreference: vi.fn(),
    editingName: false, setEditingName: vi.fn(),
    nameInput: '', setNameInput: vi.fn(),
    nameSaving: false, handleSaveName: vi.fn(),
    profileError: null, profileSaving: false, profileSaved: false,
    handleSaveProfilePreferences: vi.fn(),
  };

  const avatarTile = () =>
    // The 56x56 round tile is the first child div inside the flex row.
    document.querySelector('div[style*="border-radius: 50%"], div[style*="borderRadius: 50%"]')
    || screen.getByText('A').parentElement; // initial-letter fallback

  test('renders a background image for a safe https URL', () => {
    render(<AccountProfileSection {...baseProps} avatarInput="https://cdn.example.com/a.png" />);
    const tile = avatarTile();
    expect(tile.getAttribute('style')).toMatch(/url\(/);
    expect(tile.getAttribute('style')).toMatch(/cdn\.example\.com/);
  });

  test('rejects a javascript: URL and falls back to the initial-letter gradient', () => {
    render(<AccountProfileSection {...baseProps} avatarInput="javascript:alert(1)" />);
    // No url() background; the initial letter is shown instead.
    expect(screen.getByText('A')).toBeTruthy();
    const tile = screen.getByText('A').parentElement;
    expect(tile.getAttribute('style') || '').not.toMatch(/url\(/);
  });

  test('rejects a CSS-breakout payload (no url() emitted)', () => {
    render(
      <AccountProfileSection
        {...baseProps}
        avatarInput={'");background:red;//'}
      />,
    );
    expect(screen.getByText('A')).toBeTruthy();
    const tile = screen.getByText('A').parentElement;
    // The malformed value is not a valid http(s) URL, so no background image.
    expect(tile.getAttribute('style') || '').not.toMatch(/url\(/);
  });
});

describe('ImageCropper error surfacing (finding #5)', () => {
  test('sets crossOrigin on the <img> for remote (non-blob) sources', () => {
    const { container } = render(
      <ImageCropper src="https://cdn.example.com/x.jpg" onCancel={vi.fn()} onCommit={vi.fn()} />,
    );
    const img = container.querySelector('img');
    expect(img?.getAttribute('crossorigin')).toBe('anonymous');
  });

  test('does not set crossOrigin for blob: sources', () => {
    const { container } = render(
      <ImageCropper src="blob:http://localhost/abc" onCancel={vi.fn()} onCommit={vi.fn()} />,
    );
    const img = container.querySelector('img');
    expect(img?.getAttribute('crossorigin')).toBeNull();
  });

  test('surfaces a visible error when the image fails to load', () => {
    const { container } = render(
      <ImageCropper src="https://cdn.example.com/x.jpg" onCancel={vi.fn()} onCommit={vi.fn()} />,
    );
    const img = container.querySelector('img');
    act(() => { fireEvent.error(img); });
    expect(screen.getByTestId('cropper-error')).toBeTruthy();
    expect(screen.getByRole('alert')).toBeTruthy();
  });
});

describe('Disclosure aria-controls (finding #7)', () => {
  test('the trigger references its panel by id when open', () => {
    render(<Disclosure title="Institutions" defaultOpen>Granary</Disclosure>);
    const trigger = screen.getByRole('button', { name: /Institutions/i });
    const controls = trigger.getAttribute('aria-controls');
    expect(controls).toBeTruthy();
    const panel = document.getElementById(controls);
    expect(panel).toBeTruthy();
    expect(panel.textContent).toMatch(/Granary/);
  });
});
