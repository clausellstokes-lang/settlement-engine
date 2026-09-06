/** @vitest-environment jsdom */
/**
 * handbookVoice.test.jsx — V-26b contract: the Keeper's Handbook house-voice rewrite is
 * ⭐ LIT BY DEFAULT (lighting wave POSITION 4 / L-UI, owner row O-13, ODQ §882.1; lane
 * L-UI-MAT, 2026-09-06). It was STAGED DARK until that flip.
 *
 * ⛔ THE POLARITY OF THIS FILE'S DEFAULT ARM IS THE THING THAT CHANGED, AND IT IS THE ONLY
 * THING. `handbookVoice` now ships `true`, so the arm that previously rendered with NO
 * override to observe the DARK copy would silently have become a second ON test — a pin
 * that still passes while proving nothing. Both states are still pinned; which one is
 * reached by the default is now spelled EXPLICITLY on every arm, so a future flip in
 * either direction reds here instead of quietly re-labelling what these tests cover.
 *
 * The pins:
 *   • flag OFF (explicit override) ⇒ the exact original handbook copy still renders and the
 *     voiced draft is absent — the plain register is preserved, not deleted, so the flip
 *     stays a one-line revert (both versions coexist; the existing howToInversion pin
 *     proves the order/anchors still hold with the flag off);
 *   • flag ON (THE SHIPPED DEFAULT — asserted with no override, so this arm is what a real
 *     reader gets) ⇒ the voiced narrative renders and the plain essay copy is gone;
 *   • THE CLARITY CLAUSE: the clarity-mandated surfaces — the numbered how-to steps and
 *     the Compendium reference lifeline — stay plain in BOTH states.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { setFlagOverride } from '../../src/lib/flags.js';
import { VOICED_HEADER } from '../../src/components/howto/HandbookVoiced.jsx';
import HowToUse from '../../src/components/HowToUse.jsx';

/** Order W2-e — the About page splits into two collapsibles; the Keeper's Handbook
 *  (which carries the voiced/plain header + the essay copy) is COLLAPSED by default.
 *  Open it so its content renders for these copy assertions. */
function expandHandbook(container) {
  const btn = [...container.querySelectorAll('button[aria-expanded]')]
    .find(b => /Keeper/i.test(b.textContent));
  if (btn && btn.getAttribute('aria-expanded') === 'false') fireEvent.click(btn);
}

// Register-exclusive anchors (each phrase appears in exactly one voice).
const PLAIN_ONLY = 'Coherence follows from constraint';
const VOICED_ONLY = 'Coherence is the reward for constraint';
// Clarity-mandated surfaces that must survive the flip untouched.
const STEPS = 'First settlement in 60 seconds';
const LIFELINE = 'Compendium';

describe('HowToUse — V-26b handbook voice (staged dark)', () => {
  afterEach(() => { setFlagOverride('handbookVoice', null); cleanup(); });

  it('flag OFF (explicit override): the original handbook copy renders; the voiced draft is absent', () => {
    // EXPLICIT, because OFF is no longer the default (O-13). Rendering bare here would
    // observe the lit copy and this arm would assert the opposite of its own name.
    setFlagOverride('handbookVoice', false);
    const { container } = render(<HowToUse standalone />);
    expandHandbook(container);
    expect(container.textContent).toContain(PLAIN_ONLY);
    expect(container.textContent).toContain('The practical guide');
    expect(container.textContent).not.toContain(VOICED_ONLY);
  });

  it('flag ON (the shipped default): the voiced narrative renders and the plain essay copy is gone', () => {
    // NO override on purpose — this arm now pins the SHIPPED DEFAULT, so it reds if the
    // flag is ever darkened without this contract being revisited.
    const { container } = render(<HowToUse standalone />);
    expandHandbook(container);
    expect(container.textContent).toContain(VOICED_ONLY);
    expect(container.textContent).toContain(VOICED_HEADER.eyebrow);
    expect(container.textContent).not.toContain(PLAIN_ONLY);
  });

  it('THE CLARITY CLAUSE: the steps + Compendium lifeline stay plain in BOTH states', () => {
    setFlagOverride('handbookVoice', false);
    const off = render(<HowToUse standalone />);
    expandHandbook(off.container);
    expect(off.container.textContent).toContain(STEPS);
    expect(off.container.textContent).toContain(LIFELINE);
    // The plain register really is the one being observed here, not the lit one by another
    // name — without this the clause would pass vacuously on two identical ON renders.
    expect(off.container.textContent).toContain(PLAIN_ONLY);
    off.unmount();

    setFlagOverride('handbookVoice', null); // back to the shipped default, which is now ON
    const on = render(<HowToUse standalone />);
    expandHandbook(on.container);
    expect(on.container.textContent).toContain(STEPS);   // action steps unchanged
    expect(on.container.textContent).toContain(LIFELINE); // findability preserved
    expect(on.container.textContent).toContain(VOICED_ONLY); // and it IS the voiced register
  });
});
