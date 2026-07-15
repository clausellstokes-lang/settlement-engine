/** @vitest-environment jsdom */
/**
 * coverImageFieldStorageLifecycle.test.jsx — CoverImageField never deletes
 * storage objects.
 *
 * onChange only updates the parent's DRAFT state (ShareToGallery /
 * MapShareEditor persist on save), so the published gallery row keeps
 * pointing at the previous URL until the owner saves. If the editor deleted
 * the replaced/removed object eagerly and the owner then cancelled,
 * navigated away, or the save failed, the live public cover would point at
 * a dead storage object forever.
 *
 * Pins:
 *   • Replace (crop-commit) uploads the new blob + onChange(newUrl), but
 *     does NOT call removeGalleryCover on the previous URL.
 *   • Remove calls onChange('') but does NOT call removeGalleryCover.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';

const PUBLISHED_URL = 'https://example.supabase.co/storage/v1/object/public/gallery-images/owner-1/old-cover.jpg';
const NEW_URL = 'https://example.supabase.co/storage/v1/object/public/gallery-images/owner-1/new-cover.jpg';

vi.mock('../../../src/lib/imageUpload.js', () => ({
  validateImageFile: vi.fn(() => ({ ok: true })),
  uploadGalleryCover: vi.fn(async () => ({ url: NEW_URL, path: 'owner-1/new-cover.jpg' })),
  removeGalleryCover: vi.fn(async () => {}),
}));

// The cropper's canvas work doesn't run under jsdom; stand in a commit button.
vi.mock('../../../src/components/gallery/ImageCropper.jsx', () => ({
  default: ({ onCommit, onCancel }) => (
    <div>
      <button type="button" onClick={() => onCommit(new Blob(['jpeg-bytes'], { type: 'image/jpeg' }))}>mock-commit-crop</button>
      <button type="button" onClick={onCancel}>mock-cancel-crop</button>
    </div>
  ),
}));

import CoverImageField from '../../../src/components/gallery/CoverImageField.jsx';
import { uploadGalleryCover, removeGalleryCover } from '../../../src/lib/imageUpload.js';

describe('CoverImageField storage lifecycle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // jsdom lacks object-URL support.
    URL.createObjectURL = vi.fn(() => 'blob:mock-object-url');
    URL.revokeObjectURL = vi.fn();
  });
  afterEach(() => cleanup());

  it('replacing the cover uploads + onChange(newUrl) but never deletes the previous object', async () => {
    const onChange = vi.fn();
    render(
      <CoverImageField value={PUBLISHED_URL} onChange={onChange} ownerId="owner-1" settlementId="stl-1" />,
    );

    // Pick a replacement file via the hidden input → cropper opens.
    const file = new File(['png-bytes'], 'next.png', { type: 'image/png' });
    fireEvent.change(screen.getByLabelText('Choose a cover image file'), { target: { files: [file] } });

    // Commit the crop → upload + draft onChange.
    fireEvent.click(screen.getByText('mock-commit-crop'));
    await waitFor(() => expect(onChange).toHaveBeenCalledWith(NEW_URL));

    expect(uploadGalleryCover).toHaveBeenCalledTimes(1);
    // The published row may still point at PUBLISHED_URL until the parent
    // persists this draft — the editor must not delete it.
    expect(removeGalleryCover).not.toHaveBeenCalled();
  });

  it('removing the cover clears the draft but never deletes the storage object', () => {
    const onChange = vi.fn();
    render(
      <CoverImageField value={PUBLISHED_URL} onChange={onChange} ownerId="owner-1" settlementId="stl-1" />,
    );

    fireEvent.click(screen.getByText('Remove'));

    expect(onChange).toHaveBeenCalledWith('');
    expect(removeGalleryCover).not.toHaveBeenCalled();
  });
});
