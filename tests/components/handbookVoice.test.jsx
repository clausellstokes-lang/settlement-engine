/** @vitest-environment jsdom */
/**
 * handbookVoice.test.jsx — V-26b contract: the Keeper's Handbook house-voice rewrite is
 * STAGED DARK.
 *
 * The pins:
 *   • flag OFF (default) ⇒ the exact current handbook copy renders; the voiced draft is
 *     absent (both versions coexist; the original is untouched — the existing
 *     howToInversion pin proves the order/anchors still hold with the flag off);
 *   • flag ON ⇒ the voiced narrative renders and the plain essay copy is gone;
 *   • THE CLARITY CLAUSE: the clarity-mandated surfaces — the numbered how-to steps and
 *     the Compendium reference lifeline — stay plain in BOTH states.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { setFlagOverride } from '../../src/lib/flags.js';
import { VOICED_HEADER } from '../../src/components/howto/HandbookVoiced.jsx';
import HowToUse from '../../src/components/HowToUse.jsx';

// Register-exclusive anchors (each phrase appears in exactly one voice).
const PLAIN_ONLY = 'Coherence follows from constraint';
const VOICED_ONLY = 'Coherence is the reward for constraint';
// Clarity-mandated surfaces that must survive the flip untouched.
const STEPS = 'First settlement in 60 seconds';
const LIFELINE = 'Compendium';

describe('HowToUse — V-26b handbook voice (staged dark)', () => {
  afterEach(() => { setFlagOverride('handbookVoice', null); cleanup(); });

  it('flag OFF (default): the original handbook copy renders; the voiced draft is absent', () => {
    const { container } = render(<HowToUse standalone />);
    expect(container.textContent).toContain(PLAIN_ONLY);
    expect(container.textContent).toContain('The practical guide');
    expect(container.textContent).not.toContain(VOICED_ONLY);
  });

  it('flag ON: the voiced narrative renders and the plain essay copy is gone', () => {
    setFlagOverride('handbookVoice', true);
    const { container } = render(<HowToUse standalone />);
    expect(container.textContent).toContain(VOICED_ONLY);
    expect(container.textContent).toContain(VOICED_HEADER.eyebrow);
    expect(container.textContent).not.toContain(PLAIN_ONLY);
  });

  it('THE CLARITY CLAUSE: the steps + Compendium lifeline stay plain in BOTH states', () => {
    const off = render(<HowToUse standalone />);
    expect(off.container.textContent).toContain(STEPS);
    expect(off.container.textContent).toContain(LIFELINE);
    off.unmount();

    setFlagOverride('handbookVoice', true);
    const on = render(<HowToUse standalone />);
    expect(on.container.textContent).toContain(STEPS);   // action steps unchanged
    expect(on.container.textContent).toContain(LIFELINE); // findability preserved
  });
});
