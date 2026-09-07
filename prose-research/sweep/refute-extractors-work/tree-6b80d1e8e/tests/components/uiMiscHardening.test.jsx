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
 *   • AccountProfileSection renders an avatar only for safe http(s) URLs,
 *     falling back to the initial letter otherwise (finding #2 — re-pinned
 *     after the profile-identity lane replaced the CSS-url tile with an
 *     <img> and removed the pasted-URL input entirely).
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

describe('AccountProfileSection avatar safety (finding #2, re-pinned)', () => {
  // ── ARCHITECTURE CHANGE, and why these assertions moved with it ────────────
  // Finding #2 originally hardened a CSS `background-image: url(...)` avatar
  // tile fed by a free-text "Avatar URL" prop: the risk was a payload breaking
  // out of the url() literal into arbitrary CSS.
  //
  // The profile-identity lane (DESIGN_PROFILE_IMAGE.md §3/§6) removed BOTH
  // halves of that risk rather than escaping around it. The pasted-URL box is
  // gone — profiles.avatar_url is now written only by the upload pipeline — and
  // the tile is a real <img src> rendered by PublicAvatar, so there is no CSS
  // literal left to break out of.
  //
  // Two of the three original assertions ("no url() is emitted") would now pass
  // TRIVIALLY, since nothing emits url() under any input at all. A vacuously
  // green safety test is worse than a red one: it keeps reporting success after
  // the property it guards has stopped being tested. So the block is re-pinned
  // on the property that is still real and still refusable — a hostile scheme
  // must never reach the DOM as an image source, and the letter-circle must
  // take its place.
  const baseProps = {
    emailNotifications: false, setEmailNotifications: vi.fn(),
    modelPreference: '', setModelPreference: vi.fn(),
    editingName: false, setEditingName: vi.fn(),
    nameInput: '', setNameInput: vi.fn(),
    nameSaving: false, handleSaveName: vi.fn(),
    profileError: null, profileSaving: false, profileSaved: false,
    handleSaveProfilePreferences: vi.fn(),
  };
  const authWith = (avatarUrl) => ({
    displayName: 'Aldric', user: { email: 'aldric@example.com' }, role: 'user', avatarUrl,
  });

  test('renders a safe https avatar as a real <img>, never as a CSS url()', () => {
    const { container } = render(
      <AccountProfileSection {...baseProps} auth={authWith('https://cdn.example.com/a.png')} />,
    );
    const img = screen.getByTestId('public-avatar-image');
    expect(img.getAttribute('src')).toContain('cdn.example.com');
    // The whole CSS-injection vector is gone, not merely escaped.
    expect(container.innerHTML).not.toMatch(/url\(/);
  });

  test('rejects a javascript: URL and falls back to the initial letter', () => {
    render(<AccountProfileSection {...baseProps} auth={authWith('javascript:alert(1)')} />);
    expect(screen.queryByTestId('public-avatar-image')).toBeNull();
    // The section also renders the identity block's own 128/32 previews, which
    // are letter-circles here (the store has no avatar in this harness). The
    // header tile is the first one rendered, and it is the one under test.
    expect(screen.getAllByTestId('public-avatar-letter')[0].textContent).toBe('A');
  });

  test('rejects a data: URL — an inline payload is not an avatar', () => {
    render(<AccountProfileSection {...baseProps} auth={authWith('data:image/svg+xml,<svg onload=alert(1)>')} />);
    expect(screen.queryByTestId('public-avatar-image')).toBeNull();
    // The section also renders the identity block's own 128/32 previews, which
    // are letter-circles here (the store has no avatar in this harness). The
    // header tile is the first one rendered, and it is the one under test.
    expect(screen.getAllByTestId('public-avatar-letter')[0].textContent).toBe('A');
  });

  test('rejects the original CSS-breakout payload, which is simply not a URL', () => {
    render(<AccountProfileSection {...baseProps} auth={authWith('");background:red;//')} />);
    expect(screen.queryByTestId('public-avatar-image')).toBeNull();
    // The section also renders the identity block's own 128/32 previews, which
    // are letter-circles here (the store has no avatar in this harness). The
    // header tile is the first one rendered, and it is the one under test.
    expect(screen.getAllByTestId('public-avatar-letter')[0].textContent).toBe('A');
  });

  test('NON-VACUITY GUARD — the safe case really does produce an image', () => {
    // Without this, every assertion above would still pass if PublicAvatar
    // stopped rendering images altogether.
    render(<AccountProfileSection {...baseProps} auth={authWith('https://cdn.example.com/b.webp')} />);
    expect(screen.getByTestId('public-avatar-image')).toBeTruthy();
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
