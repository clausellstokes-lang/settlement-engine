/** @vitest-environment jsdom */
/**
 * howToInversion.test.jsx — P126 / HT-1 contract.
 *
 * The How-To "Quick Start" tab historically opened on a five-paragraph
 * concept essay, burying the actionable "First settlement in 60 seconds"
 * steps below the fold. HT-1 ("How-To inversion") flips that: with the
 * `howToInversion` flag on, the steps lead and the essay is demoted to a
 * "Why it works this way" coda. Flag off → legacy order.
 *
 * These tests pin the order swap (not the prose, which is identical across
 * both paths): which of the two anchors appears first in the rendered DOM,
 * and whether the inverted-only "Why it works this way" header is present.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

const flagMock = vi.fn(() => true);
vi.mock('../../src/lib/flags.js', () => ({ flag: (...a) => flagMock(...a) }));

import HowToUse from '../../src/components/HowToUse.jsx';

const STEPS_ANCHOR = 'First settlement in 60 seconds';
const ESSAY_ANCHOR = /A settlement generator that thinks/;
const ESSAY_TEXT = 'A settlement generator that thinks';
const CODA_HEADER = 'Why it works this way';

describe('HowToUse — HT-1 Quick Start inversion', () => {
  beforeEach(() => flagMock.mockImplementation((name) => name === 'howToInversion'));
  afterEach(() => cleanup());

  it('inverted: steps lead, essay is demoted under a "Why it works this way" coda', () => {
    const { container } = render(<HowToUse />);
    // Both halves still render — nothing is lost in the reorder.
    expect(screen.getByText(STEPS_ANCHOR)).toBeTruthy();
    expect(screen.getByText(ESSAY_ANCHOR)).toBeTruthy();
    // The coda header is the inverted-only framing for the essay.
    expect(screen.getByText(CODA_HEADER)).toBeTruthy();
    // Order: action steps come before the concept essay.
    const text = container.textContent;
    expect(text.indexOf(STEPS_ANCHOR)).toBeLessThan(text.indexOf(ESSAY_TEXT));
  });

  it('legacy (flag off): essay leads, no coda header', () => {
    flagMock.mockImplementation(() => false);
    const { container } = render(<HowToUse />);
    expect(screen.getByText(STEPS_ANCHOR)).toBeTruthy();
    expect(screen.getByText(ESSAY_ANCHOR)).toBeTruthy();
    expect(screen.queryByText(CODA_HEADER)).toBeNull();
    const text = container.textContent;
    expect(text.indexOf(ESSAY_TEXT)).toBeLessThan(text.indexOf(STEPS_ANCHOR));
  });

  it('inversion also applies in the standalone (full-page) layout', () => {
    const { container } = render(<HowToUse standalone />);
    expect(screen.getByText(CODA_HEADER)).toBeTruthy();
    const text = container.textContent;
    expect(text.indexOf(STEPS_ANCHOR)).toBeLessThan(text.indexOf(ESSAY_TEXT));
  });
});
