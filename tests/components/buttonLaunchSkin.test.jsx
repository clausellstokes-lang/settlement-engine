/** @vitest-environment jsdom */
/**
 * buttonLaunchSkin.test.jsx — EVERY LAUNCH-LOCKED PURCHASE CONTROL WEARS THE LAUNCH SKIN
 * (THE OWNER, 2026-11-01, X-39: "a regal purple dark with a gloss and shimmering gold lettering
 * just to give the feel that it is in fact till launch. I want you to apply the same thing to
 * anything that is a purchase button and the ai overlay pass button").
 *
 * The launch gate (lib/launchGate.js) marks every locked purchase control with the
 * Available-at-launch pill INSIDE the button, so the Button primitive reads the pill as the
 * request: no site has to name the skin. The AI pass button names it (`variant="launch"`).
 * Three pins, anchored on a plain button rendered beside them:
 *   1. a button carrying the pill wears the ground, the shimmering label and no dimming;
 *   2. `variant="launch"` wears the same skin without the pill;
 *   3. a button with neither keeps its own variant.
 */
import React from 'react';
import { describe, it, expect, afterEach, beforeAll } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';
import Button from '../../src/components/primitives/Button.jsx';
import AvailableAtLaunchPill, { AVAILABLE_AT_LAUNCH } from '../../src/components/primitives/AvailableAtLaunchPill.jsx';
import { launchSkin } from '../../src/components/theme.js';

beforeAll(() => {
  if (typeof window !== 'undefined' && !window.matchMedia) {
    window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
  }
});
afterEach(() => cleanup());

/** jsdom re-serialises the colours inside a gradient; read a value back the same way. */
function cssBackground(value) {
  const el = document.createElement('div');
  el.style.background = value;
  return el.style.background || el.style.backgroundImage;
}
const ground = (el) => el.style.background || el.style.backgroundImage;
const GROUND = () => cssBackground(launchSkin.ground);
const SHIMMER = () => cssBackground(launchSkin.shimmer.backgroundImage);

describe('the Button primitive and the launch skin', () => {
  it('a locked purchase control (the pill inside it) wears the skin and is not dimmed', () => {
    render(<>
      <Button variant="primary" disabled>Buy this dossier<AvailableAtLaunchPill style={{ marginLeft: 6 }} /></Button>
      <Button variant="primary">Save it</Button>
    </>);
    const locked = screen.getByRole('button', { name: new RegExp(`Buy this dossier.*${AVAILABLE_AT_LAUNCH}`) });
    const plain = screen.getByRole('button', { name: 'Save it' });
    expect(locked.getAttribute('data-skin')).toBe('launch');
    expect(ground(locked.querySelector('[data-launch-ground]'))).toBe(GROUND());
    expect(locked.disabled).toBe(true);
    expect(locked.style.opacity).toBe('1'); // the register is the state; no 0.62 dim
    // the letters: the gold gradient on the button's OWN text, so the label stays a direct text node
    expect(cssBackground(locked.style.backgroundImage)).toBe(SHIMMER());
    expect(locked.style.animation).toContain('sf-goldShimmer');
    expect([...locked.childNodes].some((n) => n.nodeType === 3 && n.textContent.includes('Buy this dossier'))).toBe(true);
    // the pill keeps its own gold-on-soft-gold colours inside the button
    expect(locked.querySelector('[data-launch-pill]')).toBeTruthy();
    // anchored: the plain primary beside it keeps its variant
    expect(plain.getAttribute('data-skin')).toBeNull();
    expect(plain.querySelector('[data-launch-ground]')).toBeNull();
    expect(plain.style.animation).toBe('');
  });

  it('variant="launch" wears the skin without the pill (the AI pass button), and a disabled one dims nothing', () => {
    render(<>
      <Button variant="launch">Narrate this town</Button>
      <Button variant="launch" disabled>Regenerate</Button>
      <Button variant="ai">Stage it</Button>
    </>);
    const narrate = screen.getByRole('button', { name: 'Narrate this town' });
    const regen = screen.getByRole('button', { name: 'Regenerate' });
    const ai = screen.getByRole('button', { name: 'Stage it' });
    for (const b of [narrate, regen]) {
      expect(b.getAttribute('data-skin')).toBe('launch');
      expect(ground(b.querySelector('[data-launch-ground]'))).toBe(GROUND());
      expect(cssBackground(b.style.backgroundImage)).toBe(SHIMMER());
      expect(b.style.opacity).toBe('1');
    }
    expect(regen.disabled).toBe(true);
    expect(ai.getAttribute('data-skin')).toBeNull();
    expect(ai.querySelector('[data-launch-ground]')).toBeNull();
  });
});
