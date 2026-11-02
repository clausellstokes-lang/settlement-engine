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
import { PackTile } from '../../src/components/pricing/PricingTierCards.jsx';
import { CARD, INK, launchSkin } from '../../src/components/theme.js';

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
const GROUND = () => cssBackground(launchSkin.ground);
const SHIMMER = () => cssBackground(launchSkin.shimmer.backgroundImage);
/** Both layers on the one element: the letters' gradient first, the ground beneath it. */
const LAYERS = () => cssBackground(`${launchSkin.shimmer.backgroundImage}, ${launchSkin.ground}`);
const layers = (el) => cssBackground(el.style.backgroundImage);
const skinned = (el) => el.getAttribute('data-skin') === 'launch' && layers(el) === LAYERS() && el.style.animation.includes('sf-goldShimmer');

describe('the Button primitive and the launch skin', () => {
  it('a locked purchase control (the pill inside it) wears the skin and is not dimmed', () => {
    render(<>
      <Button variant="primary" disabled>Buy this dossier<AvailableAtLaunchPill style={{ marginLeft: 6 }} /></Button>
      <Button variant="primary">Save it</Button>
    </>);
    const locked = screen.getByRole('button', { name: new RegExp(`Buy this dossier.*${AVAILABLE_AT_LAUNCH}`) });
    const plain = screen.getByRole('button', { name: 'Save it' });
    expect(skinned(locked), 'the locked control wears both layers and the shimmer').toBe(true);
    expect(locked.disabled).toBe(true);
    expect(locked.style.opacity).toBe('1'); // the register is the state; no 0.62 dim
    // the letters are the button's OWN text node (the gradient is clipped on the button)
    expect([...locked.childNodes].some((n) => n.nodeType === 3 && n.textContent.includes('Buy this dossier'))).toBe(true);
    expect(locked.querySelector('[data-launch-pill]')).toBeTruthy();
    // anchored: the plain primary beside it keeps its variant
    expect(plain.getAttribute('data-skin')).toBeNull();
    expect(layers(plain)).not.toBe(LAYERS());
    expect(plain.style.animation).toBe('');
  });

  it("a site's own background or colour does not strip the skin (the register wins on a purchase button)", () => {
    render(<Button variant="primary" disabled style={{ background: CARD, color: INK }}>Subscribe<AvailableAtLaunchPill /></Button>);
    const b = screen.getByRole('button', { name: /^Subscribe/ });
    expect(skinned(b)).toBe(true);
    expect(b.style.color).toBe('transparent');
  });

  it('a locked credit-pack tile gives its parchment inks to the skin (the price shimmers, the rest is gold)', () => {
    const pack = { key: 'starter', credits: 25, price: '$4.99', perCredit: '$0.20', discount: null, tier: 'starter' };
    render(<PackTile pack={pack} onBuy={() => {}} loading={false} emphasised={false} />);
    const tile = screen.getByRole('button', { name: new RegExp(AVAILABLE_AT_LAUNCH) });
    expect(skinned(tile)).toBe(true);
    const price = tile.querySelector('[data-testid="pack-price"]');
    const per = tile.querySelector('[data-testid="pack-per-credit"]');
    expect(cssBackground(price.style.backgroundImage)).toBe(SHIMMER());
    expect(price.style.color).toBe('transparent');
    expect(per.style.color.toLowerCase()).toBe(cssColor(launchSkin.ink).toLowerCase());
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
      expect(skinned(b)).toBe(true);
      expect(b.style.opacity).toBe('1');
    }
    expect(regen.disabled).toBe(true);
    expect(ai.getAttribute('data-skin')).toBeNull();
    expect(layers(ai)).not.toBe(LAYERS());
  });
});

/** jsdom serialises hex colours as rgb(); normalise a token to the same form. */
function cssColor(token) {
  const el = document.createElement('div');
  el.style.color = token;
  return el.style.color;
}
