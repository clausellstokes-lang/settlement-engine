/** @vitest-environment jsdom */
/**
 * GalleryCard memoizes its sanitized description. DOMPurify is not cheap and a
 * gallery is a long list where each card re-renders on vote/scroll; the sanitize
 * call must run only when item.description changes, not on every render.
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';

const sanitizeSpy = vi.fn((html) => `<clean>${html}</clean>`);
vi.mock('../../../src/lib/sanitizeGalleryHtml.js', () => ({
  sanitizeGalleryHtml: (...a) => sanitizeSpy(...a),
}));

import GalleryCard from '../../../src/components/gallery/GalleryCard.jsx';

afterEach(() => { cleanup(); sanitizeSpy.mockClear(); });

const baseItem = (overrides = {}) => ({
  slug: 's1',
  name: 'Bramblefen',
  tier: 'town',
  population: 1200,
  description: '<p>A fine salt-marsh town.</p>',
  netVotes: 0,
  viewCount: 3,
  commentCount: 0,
  updatedAt: '2026-01-01T00:00:00Z',
  ...overrides,
});

const noop = () => {};

test('sanitizes the description once across re-renders with the same description', () => {
  const item = baseItem();
  const { rerender } = render(
    <GalleryCard item={item} onOpen={noop} onVote={noop} voting={false} isSignedIn />,
  );
  const afterFirst = sanitizeSpy.mock.calls.length;
  expect(afterFirst).toBeGreaterThan(0);

  // Re-render with a NEW item object but the SAME description string: memo holds,
  // sanitize does not run again for the description.
  rerender(
    <GalleryCard item={baseItem()} onOpen={noop} onVote={noop} voting isSignedIn />,
  );
  expect(sanitizeSpy.mock.calls.length).toBe(afterFirst);
});

test('re-sanitizes when the description actually changes', () => {
  const item = baseItem();
  const { rerender } = render(
    <GalleryCard item={item} onOpen={noop} onVote={noop} voting={false} isSignedIn />,
  );
  const afterFirst = sanitizeSpy.mock.calls.length;

  rerender(
    <GalleryCard item={baseItem({ description: '<p>Edited.</p>' })} onOpen={noop} onVote={noop} voting={false} isSignedIn />,
  );
  expect(sanitizeSpy.mock.calls.length).toBeGreaterThan(afterFirst);
});
