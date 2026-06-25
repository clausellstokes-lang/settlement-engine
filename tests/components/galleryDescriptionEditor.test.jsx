/** @vitest-environment jsdom */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';

import GalleryDescriptionEditor from '../../src/components/GalleryDescriptionEditor.jsx';

afterEach(cleanup);

/**
 * §4c length cap. emit() measures clean.length but the buggy version sliced the
 * UNSANITIZED raw HTML at that boundary. Links are the sharpest case: cutting
 * raw mid-anchor and re-sanitizing makes DOMPurify re-expand the link with the
 * full target/rel attributes we inject — so the re-sanitized slice balloons
 * well PAST maxLength. Slicing the SAME sanitized string we measured keeps the
 * stored value within the cap.
 */
describe('GalleryDescriptionEditor — length cap is enforced on the sanitized string', () => {
  test('emit caps the sanitized output at maxLength even when raw HTML is much longer', () => {
    const onChange = vi.fn();
    const maxLength = 60;
    const { container } = render(
      <GalleryDescriptionEditor value="" onChange={onChange} maxLength={maxLength} />,
    );
    const editable = container.querySelector('[contenteditable]');

    // A run of links: sanitized output is hundreds of chars (> cap). Slicing the
    // RAW markup at 60 lands mid-<a href=...>; re-sanitizing re-emits that anchor
    // with target="_blank" rel="…" — ~95 chars, OVER the cap. Slicing the
    // sanitized string instead stays within it.
    const rawLinks = Array.from({ length: 8 }, (_, i) =>
      `<a href="https://example.com/page${i}">link ${i}</a>`,
    ).join(' ');
    editable.innerHTML = rawLinks;

    fireEvent.input(editable);

    expect(onChange).toHaveBeenCalled();
    const emitted = onChange.mock.calls.at(-1)[0];
    // The cap must hold on the sanitized output. The old code (slice on raw)
    // emitted a string longer than maxLength.
    expect(emitted.length).toBeLessThanOrEqual(maxLength);
  });

  test('short content passes through unchanged (no spurious truncation)', () => {
    const onChange = vi.fn();
    const { container } = render(
      <GalleryDescriptionEditor value="" onChange={onChange} maxLength={4000} />,
    );
    const editable = container.querySelector('[contenteditable]');
    editable.innerHTML = '<p>Salt-marsh trading post.</p>';

    fireEvent.input(editable);

    const emitted = onChange.mock.calls.at(-1)[0];
    expect(emitted).toContain('Salt-marsh trading post.');
    expect(emitted.length).toBeLessThanOrEqual(4000);
  });
});
