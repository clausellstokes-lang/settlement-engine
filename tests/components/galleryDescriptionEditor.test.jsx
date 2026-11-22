/** @vitest-environment jsdom */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';

import GalleryDescriptionEditor from '../../src/components/GalleryDescriptionEditor.jsx';

afterEach(cleanup);

// Visible-text length of an HTML string (what the cap counts).
function visible(html) {
  const box = document.createElement('div');
  box.innerHTML = html;
  return (box.textContent || '').length;
}

/**
 * §4c length cap. The cap counts VISIBLE text, not raw markup: a description
 * that's mostly tags (links, styled runs) must not be silently cut short just
 * because its HTML is long. emit() sanitizes, measures textContent, and — only
 * when the visible text is over — trims whole trailing text nodes (never
 * mid-tag), re-sanitizing so the stored value stays well-formed.
 */
describe('GalleryDescriptionEditor — length cap counts visible text, not markup', () => {
  test('markup-heavy content under the visible cap is NOT trimmed', () => {
    const onChange = vi.fn();
    const maxLength = 60;
    const { container } = render(
      <GalleryDescriptionEditor value="" onChange={onChange} maxLength={maxLength} />,
    );
    const editable = container.querySelector('[contenteditable]');

    // 8 links: the SANITIZED HTML is hundreds of chars (target/rel injected),
    // but the visible text ("link 0 … link 7") is ~55 chars — under the cap.
    // The buggy version capped on the HTML LENGTH and would have truncated this.
    const rawLinks = Array.from({ length: 8 }, (_, i) =>
      `<a href="https://example.com/page${i}">l${i}</a>`,
    ).join(' ');
    editable.innerHTML = rawLinks;

    fireEvent.input(editable);

    const emitted = onChange.mock.calls.at(-1)[0];
    // Visible text fits, so every link survives — visible-text cap, not markup cap.
    expect(visible(emitted)).toBeLessThanOrEqual(maxLength);
    expect(emitted).toMatch(/l0/);
    expect(emitted).toMatch(/l7/);
  });

  test('over-cap content is trimmed to maxLength VISIBLE characters', () => {
    const onChange = vi.fn();
    const maxLength = 40;
    const { container } = render(
      <GalleryDescriptionEditor value="" onChange={onChange} maxLength={maxLength} />,
    );
    const editable = container.querySelector('[contenteditable]');
    // 120 visible chars across formatting — over the 40 cap.
    editable.innerHTML = `<p><strong>${'A'.repeat(60)}</strong> <em>${'B'.repeat(60)}</em></p>`;

    fireEvent.input(editable);

    const emitted = onChange.mock.calls.at(-1)[0];
    expect(visible(emitted)).toBeLessThanOrEqual(maxLength);
    // Trim happens at a text-node boundary, never mid-tag: still balanced markup.
    expect(emitted).toMatch(/<strong>/);
    expect(emitted).toMatch(/<\/strong>/);
  });

  test('over-cap: the editable DOM is trimmed back to match the emitted value (WYSIWYG)', () => {
    // Regression: emit() capped the emitted value but left the contenteditable
    // showing the over-cap tail, so the user kept editing text already dropped
    // from the draft. The trimmed HTML must be written back into the editable.
    const onChange = vi.fn();
    const maxLength = 20;
    const { container } = render(
      <GalleryDescriptionEditor value="" onChange={onChange} maxLength={maxLength} />,
    );
    const editable = container.querySelector('[contenteditable]');
    editable.innerHTML = `<p>${'Z'.repeat(80)}</p>`; // 80 visible, over the 20 cap

    fireEvent.input(editable);

    const emitted = onChange.mock.calls.at(-1)[0];
    // The live editor DOM now shows exactly what was emitted — no stale tail.
    expect(visible(editable.innerHTML)).toBeLessThanOrEqual(maxLength);
    expect(visible(editable.innerHTML)).toBe(visible(emitted));
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
    expect(visible(emitted)).toBeLessThanOrEqual(4000);
  });

  test('renders a live N/maxLength visible-character counter that updates on input', () => {
    const onChange = vi.fn();
    const maxLength = 100;
    const { container, getByText } = render(
      <GalleryDescriptionEditor value="<p>Hello</p>" onChange={onChange} maxLength={maxLength} />,
    );
    // Seeded value is 5 visible chars.
    expect(getByText(`5/${maxLength}`)).toBeTruthy();

    const editable = container.querySelector('[contenteditable]');
    editable.innerHTML = '<p>Hello there</p>'; // 11 visible chars
    fireEvent.input(editable);

    expect(getByText(`11/${maxLength}`)).toBeTruthy();
  });

  test('surfaces a soft warning when the content hits the cap', () => {
    const onChange = vi.fn();
    const maxLength = 10;
    const { container, queryByText } = render(
      <GalleryDescriptionEditor value="" onChange={onChange} maxLength={maxLength} />,
    );
    expect(queryByText(/at the .*-character limit/i)).toBeNull();

    const editable = container.querySelector('[contenteditable]');
    editable.innerHTML = `<p>${'word '.repeat(20)}</p>`; // way over 10 visible
    fireEvent.input(editable);

    expect(queryByText(/at the 10-character limit/i)).toBeTruthy();
  });
});
