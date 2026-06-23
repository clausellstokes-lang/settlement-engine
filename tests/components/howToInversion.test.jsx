/** @vitest-environment jsdom */
/**
 * howToInversion.test.jsx — P126 / HT-1 contract.
 *
 * The How-To "Quick Start" tab historically opened on a five-paragraph
 * concept essay, burying the actionable "First settlement in 60 seconds"
 * steps below the fold. HT-1 ("How-To inversion") flips that: the steps
 * lead and the essay is demoted to a "Why it works this way" coda.
 *
 * These tests pin the order: the action steps appear before the concept
 * essay in the rendered DOM, and the "Why it works this way" header is
 * present.
 */

import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

import HowToUse from '../../src/components/HowToUse.jsx';

const STEPS_ANCHOR = 'First settlement in 60 seconds';
// The About-Pricing reconciliation hoisted the living-world thesis ("It generates
// a town in seconds, then it runs the region for years.") into the single
// PageHeader subtitle, so that sentence now renders ABOVE the steps. The concept
// essay is anchored instead on its own opening claim ("Most generators roll on a
// table"), which is unique to the coda body. The inversion contract (steps lead,
// essay demoted under "Why it works this way") is unchanged.
const ESSAY_ANCHOR = /Most generators roll on a table/;
const ESSAY_TEXT = 'Most generators roll on a table';
const CODA_HEADER = 'Why it works this way';

describe('HowToUse — HT-1 Quick Start inversion', () => {
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

  it('inversion also applies in the standalone (full-page) layout', () => {
    const { container } = render(<HowToUse standalone />);
    expect(screen.getByText(CODA_HEADER)).toBeTruthy();
    const text = container.textContent;
    expect(text.indexOf(STEPS_ANCHOR)).toBeLessThan(text.indexOf(ESSAY_TEXT));
  });
});
