/** @vitest-environment jsdom */
/**
 * termsRefundsSection.test.jsx — the refund policy is now a Terms subsection.
 *
 * The standalone /refunds page was retired: its five refund topics moved into
 * TermsPage as the "Refunds and cancellation" section (id terms-refunds), and
 * the old /refunds URL now renders TermsPage scrolled to that section. These
 * pins guard both halves:
 *   1. TermsPage carries all five refund topics + the refund-request mailto, and
 *      the billing section points at the subsection (not the retired page).
 *   2. The `scrollToId` path (how AppViews renders view 'refunds') scrolls the
 *      subsection into view on mount, honoring prefers-reduced-motion, and does
 *      nothing on the plain /terms view.
 */
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';

import TermsPage from '../../src/components/legal/TermsPage.jsx';

// The five refund sub-topics that must survive the move (former section
// headings, now bold lead-in labels).
const REFUND_TOPICS = [
  'Narrative credits',
  'The single dossier PDF',
  'Cartographer subscription',
  'Founder Lifetime',
  'How to request a refund',
];

describe('TermsPage — Refunds and cancellation subsection', () => {
  afterEach(() => cleanup());

  it('carries the section anchor, all five refund topics, and the refund mailto', () => {
    const { container } = render(<TermsPage />);

    // The anchor the retired /refunds URL scrolls to — LegalSection stamps the
    // id on the section's <h2>, which is what getElementById() targets.
    const heading = container.querySelector('#terms-refunds');
    expect(heading).toBeTruthy();
    expect(heading.tagName).toBe('H2');
    expect(heading.textContent).toBe('Refunds and cancellation');

    const section = heading.closest('section');
    expect(section).toBeTruthy();

    // Every refund topic survived the move.
    for (const topic of REFUND_TOPICS) {
      expect(container.textContent).toContain(topic);
    }

    // The verbatim refund semantics are preserved (spot-check the load-bearing
    // clauses the owner called out).
    expect(container.textContent).toContain('its credit is returned automatically');
    expect(container.textContent).toContain('the download right for it is forfeited');
    expect(container.textContent).toContain('except where consumer law in your jurisdiction requires it');

    // The refund-request support mailto lives inside the subsection.
    const mailto = section.querySelector('a[href*="Refund"]');
    expect(mailto).toBeTruthy();
  });

  it('billing section points at the subsection, not the retired Refunds page', () => {
    const { container } = render(<TermsPage />);
    const text = container.textContent;
    expect(text).toContain('Refunds and cancellation section');
    expect(text).not.toContain('on the Refunds page');
  });
});

describe('TermsPage — /refunds alias scrolls to the subsection', () => {
  let origScrollIntoView;

  beforeEach(() => {
    vi.useFakeTimers();
    origScrollIntoView = Element.prototype.scrollIntoView;
  });
  afterEach(() => {
    vi.useRealTimers();
    Element.prototype.scrollIntoView = origScrollIntoView;
    cleanup();
  });

  function stubMatchMedia(reduce) {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: reduce, media: query,
      addEventListener() {}, removeEventListener() {},
      addListener() {}, removeListener() {}, onchange: null,
      dispatchEvent() { return false; },
    }));
  }

  it('scrolls #terms-refunds into view (smooth) on mount when scrollToId is set', () => {
    stubMatchMedia(false);
    const spy = vi.fn();
    Element.prototype.scrollIntoView = spy;

    render(<TermsPage scrollToId="terms-refunds" />);
    vi.advanceTimersByTime(200);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
  });

  it('honors prefers-reduced-motion (auto, no smooth animation)', () => {
    stubMatchMedia(true);
    const spy = vi.fn();
    Element.prototype.scrollIntoView = spy;

    render(<TermsPage scrollToId="terms-refunds" />);
    vi.advanceTimersByTime(200);

    expect(spy).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' });
  });

  it('does not scroll on the plain /terms view (no scrollToId)', () => {
    stubMatchMedia(false);
    const spy = vi.fn();
    Element.prototype.scrollIntoView = spy;

    render(<TermsPage />);
    vi.advanceTimersByTime(200);

    expect(spy).not.toHaveBeenCalled();
  });
});
