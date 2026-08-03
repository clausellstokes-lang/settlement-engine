/**
 * @vitest-environment jsdom
 *
 * imageCropperOutput.test.jsx — the cropper's OUTPUT CONTRACT after the
 * profile-identity lane parameterised it (DESIGN_PROFILE_IMAGE.md §3.2).
 *
 * WHY THIS TEST EXISTS. Extending a shared component that another, already
 * shipped surface depends on is the moment to prove the incumbent did not move.
 * The gallery cover crop was 1280-wide JPEG at quality 0.85 with square corners,
 * and every new prop was given that value as its DEFAULT precisely so the cover
 * path stays byte-identical. "Byte-identical" is a claim about the arguments
 * handed to canvas.toBlob and the canvas dimensions drawn into — which is
 * exactly what this test reads, rather than trusting the defaults by eye.
 *
 * jsdom has no canvas implementation, so the canvas is stubbed and the pin is on
 * the CALL, not on encoded pixels. That is the honest boundary: what this suite
 * can know is which output contract the component asked for.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import ImageCropper from '../../src/components/gallery/ImageCropper.jsx';

/** What the stubbed canvas recorded on the last commit. */
let recorded;
let createElementSpy;

beforeEach(() => {
  recorded = null;

  // A viewport with real width — the cropper refuses to commit a zero-width box,
  // and jsdom reports 0 for every element.
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, value: 640 });
  // Intrinsic size for the loaded image.
  Object.defineProperty(HTMLImageElement.prototype, 'naturalWidth', { configurable: true, value: 2000 });
  Object.defineProperty(HTMLImageElement.prototype, 'naturalHeight', { configurable: true, value: 1600 });

  const realCreateElement = document.createElement.bind(document);
  createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tag, ...rest) => {
    if (tag !== 'canvas') return realCreateElement(tag, ...rest);
    const canvas = {
      width: 0,
      height: 0,
      getContext: () => ({ drawImage: vi.fn(), imageSmoothingQuality: '', imageSmoothingEnabled: false }),
      toBlob: (cb, type, quality) => {
        recorded = { width: canvas.width, height: canvas.height, type, quality };
        cb(new Blob(['x']));
      },
    };
    return canvas;
  });
});

afterEach(() => {
  cleanup();
  createElementSpy?.mockRestore();
  vi.restoreAllMocks();
});

/** Render, load the image, and press Apply. */
function cropWith(props) {
  const onCommit = vi.fn();
  const { container } = render(
    <ImageCropper src="blob:fake" onCommit={onCommit} onCancel={() => {}} {...props} />,
  );
  fireEvent.load(container.querySelector('img'));
  fireEvent.click(screen.getByRole('button', { name: /use this image|apply crop/i }));
  return onCommit;
}

describe('the gallery cover path is UNCHANGED by the profile-image extension', () => {
  it('still exports a 1280-wide JPEG at quality 0.85 when no output props are given', () => {
    const onCommit = cropWith({ aspect: 16 / 9 });
    expect(recorded).toEqual({ width: 1280, height: 720, type: 'image/jpeg', quality: 0.85 });
    expect(onCommit).toHaveBeenCalledTimes(1);
  });

  it('still labels its confirm button "Apply crop"', () => {
    render(<ImageCropper src="blob:fake" aspect={16 / 9} onCommit={() => {}} onCancel={() => {}} />);
    expect(screen.getByRole('button', { name: 'Apply crop' })).toBeTruthy();
  });

  it('still renders square corners — the circular treatment is opt-in only', () => {
    const { container } = render(
      <ImageCropper src="blob:fake" aspect={16 / 9} onCommit={() => {}} onCancel={() => {}} />,
    );
    const viewport = container.querySelector('[role="application"]');
    expect(viewport.getAttribute('style')).not.toContain('border-radius');
  });
});

describe('the profile-image path asks for the square lossless master', () => {
  const AVATAR_PROPS = {
    aspect: 1,
    circular: true,
    outputMaxWidth: 512,
    outputType: 'image/png',
    applyLabel: 'Use this image',
  };

  it('exports a 512×512 PNG — square, and lossless so the WebP rungs encode once', () => {
    const onCommit = cropWith(AVATAR_PROPS);
    expect(recorded.width).toBe(512);
    expect(recorded.height).toBe(512);
    expect(recorded.type).toBe('image/png');
    expect(onCommit).toHaveBeenCalledTimes(1);
    // The blob handed back is what the ladder builder decodes.
    expect(onCommit.mock.calls[0][0]).toBeInstanceOf(Blob);
  });

  it('previews as a circle while still exporting the full square (§2)', () => {
    const { container } = render(
      <ImageCropper src="blob:fake" {...AVATAR_PROPS} onCommit={() => {}} onCancel={() => {}} />,
    );
    const viewport = container.querySelector('[role="application"]');
    expect(viewport.getAttribute('style')).toContain('border-radius: 50%');

    // The export is square regardless of the round preview — never store a
    // pre-masked circle, or every future surface inherits this ring decision.
    fireEvent.load(container.querySelector('img'));
    fireEvent.click(screen.getByRole('button', { name: 'Use this image' }));
    expect(recorded.width).toBe(recorded.height);
  });
});
