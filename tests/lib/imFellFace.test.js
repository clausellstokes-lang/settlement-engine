/** @vitest-environment jsdom */
/**
 * tests/lib/imFellFace.test.js — the IM Fell display-face scaffold (V-27d).
 *
 * Pins the toggle-OFF mechanism: the @font-face rule is well-formed and points at
 * the conventional (owner-vendored) woff2, injection is idempotent, activation
 * sets the display-face var, and the display TOKENS actually read that var (so the
 * swap reaches hero + section titles and nothing else). The font asset itself is a
 * documented owner deferral; the mechanism is complete and inert.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  IM_FELL_FAMILY,
  IM_FELL_WOFF2,
  DISPLAY_FACE_VAR,
  imFellFaceRule,
  ensureImFellFace,
  applyImFellDisplayFace,
  clearImFellDisplayFace,
} from '../../src/lib/imFellFace.js';
import { type } from '../../src/design/tokens.js';

beforeEach(() => {
  // Fresh DOM: strip any previously injected face + var so idempotency is honest.
  document.querySelectorAll('style[data-im-fell-face]').forEach((n) => n.remove());
  document.documentElement.style.removeProperty(DISPLAY_FACE_VAR);
});

describe('the @font-face rule', () => {
  it('is well-formed and points at the conventional woff2 with swap', () => {
    const rule = imFellFaceRule();
    expect(rule).toContain(`font-family:'${IM_FELL_FAMILY}'`);
    expect(rule).toContain(`url('${IM_FELL_WOFF2}')`);
    expect(rule).toContain('format(\'woff2\')');
    expect(rule).toContain('font-display:swap');
    // The asset lives in public/fonts/ — never bundled into the JS closure.
    expect(IM_FELL_WOFF2.startsWith('/fonts/')).toBe(true);
  });
});

describe('ensureImFellFace (idempotent injection)', () => {
  it('injects exactly one <style data-im-fell-face>, and never a second', () => {
    ensureImFellFace();
    ensureImFellFace();
    ensureImFellFace();
    const faces = document.querySelectorAll('style[data-im-fell-face]');
    expect(faces.length).toBe(1);
    expect(faces[0].textContent).toBe(imFellFaceRule());
  });
});

describe('applyImFellDisplayFace / clearImFellDisplayFace', () => {
  it('sets the display-face var to IM Fell and injects the face', () => {
    applyImFellDisplayFace();
    expect(document.documentElement.style.getPropertyValue(DISPLAY_FACE_VAR))
      .toBe(`'${IM_FELL_FAMILY}'`);
    expect(document.querySelectorAll('style[data-im-fell-face]').length).toBe(1);
  });

  it('clear reverts the var (display falls back to the Crimson serif)', () => {
    applyImFellDisplayFace();
    clearImFellDisplayFace();
    expect(document.documentElement.style.getPropertyValue(DISPLAY_FACE_VAR)).toBe('');
  });
});

describe('the display-face seam is display-only', () => {
  it('display tokens read --oc-display-face; prose/ui tokens do not', () => {
    expect(type['display-xl'].family).toContain(`var(${DISPLAY_FACE_VAR}`);
    expect(type['display-l'].family).toContain(`var(${DISPLAY_FACE_VAR}`);
    expect(type['display-m'].family).toContain(`var(${DISPLAY_FACE_VAR}`);
    // Prose + UI stay on their fixed stacks — the swap must NOT reach body copy.
    expect(type['prose-m'].family).not.toContain(DISPLAY_FACE_VAR);
    expect(type['ui-m'].family).not.toContain(DISPLAY_FACE_VAR);
  });

  it('unset, the display face resolves to the historical Crimson serif fallback', () => {
    // var() carries its own fallback so the default rendering is unchanged:
    //   var(--oc-display-face, "Crimson Text"), Georgia, serif
    const family = type['display-xl'].family;
    expect(family).toContain('var(--oc-display-face, "Crimson Text")');
    expect(family).toMatch(/Georgia,\s*serif$/);
  });
});
