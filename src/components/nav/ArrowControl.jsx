/**
 * components/nav/ArrowControl.jsx: one control laid over the owner's arrow painting.
 *
 * The header is the painting (owner, 2026-09-16: "I do not want you to emulate it"), so a
 * control draws no chrome of its own: it is a transparent Button primitive placed over a
 * painted region (the logo plate, a painted word, the blank brass plate) at the rectangle
 * components/nav/arrowGeometry.js computes. What it does add is measured against the
 * painting's own pixels (tests/build/arrowHeaderAssets.test.js):
 *
 *   - THE FOCUS RING IS TWO-TONE. The global :focus-visible rule (styles/a11y.css) draws a
 *     3 px ring in --sf-focus, inside the box because the header is stuck at the viewport
 *     top. No single colour clears 3:1 around a painted region: INK clears it only on the
 *     band's lit upper rows and PARCH_100 only on its shaded lower rows, and the house
 *     bronze is 1.26:1 on the median wood. So the ring is INK (--sf-focus, set here) with a
 *     PARCH_100 band just inside it while the control has keyboard focus; the two tones
 *     are about 15:1 against each other, so one of them always contrasts with the wood.
 *   - HOVER IS A SOFT GLOW ON THE WORD OR PLATE, not a wash over the whole region: a radial
 *     PARCH_100 light (the house color-mix idiom, no translucent literal) inside the glow box
 *     the header passes, fading out before the box's edge, so the bindings and the plain wood
 *     beside the word stay as painted. The primitive's own hover fill is switched off
 *     (--sf-btn-hover-bg transparent), and the glow is drawn only where the device really
 *     hovers (matchMedia '(hover: hover)', read when the pointer enters), so a tap on a phone
 *     never leaves a lit patch behind. No stylesheet bytes: it is state and an inline style.
 *   - NOTHING ROUNDS OR CASTS A SHADOW (the deep-craft kill list), and the box is exactly
 *     the rectangle it is given: no padding, no border, no minimum height of its own.
 *
 * @enforced-by tests/components/arrowHeader.test.jsx
 */
import { useState } from 'react';
import Button from '../primitives/Button.jsx';
import { INK, PARCH_100 } from '../theme.js';

/** The hover glow: PARCH_100 light at the centre of the glow box, none at its edge. */
export const ARROW_GLOW = `radial-gradient(closest-side, color-mix(in srgb, ${PARCH_100} 34%, transparent), transparent)`;

/** True where the primary pointer really hovers (so never after a tap on a touch screen). */
export const hovers = () => typeof window !== 'undefined' && typeof window.matchMedia === 'function'
  && window.matchMedia('(hover: hover)').matches;

/** @param {number} n */
const px = (n) => `${n}px`;

/**
 * True when focus arrived by keyboard. Engines without :focus-visible support throw on the
 * selector, and those get the ring (a visible ring is the safe side of the error).
 * @param {Element} el
 */
function keyboardFocused(el) {
  try {
    return el.matches(':focus-visible');
  } catch {
    return true;
  }
}

/**
 * @param {{
 *   rect: { x: number, y: number, w: number, h: number },
 *   glow?: { x: number, y: number, w: number, h: number },
 *   children?: import('react').ReactNode,
 *   style?: import('react').CSSProperties,
 *   onFocus?: (e: import('react').FocusEvent<HTMLButtonElement>) => void,
 *   onBlur?: (e: import('react').FocusEvent<HTMLButtonElement>) => void,
 *   [key: string]: unknown,
 * }} props
 */
export default function ArrowControl({ rect, glow, children, style, onFocus, onBlur, ...rest }) {
  const [ring, setRing] = useState(false);
  const [lit, setLit] = useState(false);
  return (
    <Button
      variant="ghost"
      {...rest}
      onFocus={(e) => { setRing(keyboardFocused(e.currentTarget)); onFocus?.(e); }}
      onBlur={(e) => { setRing(false); onBlur?.(e); }}
      onMouseEnter={() => setLit(hovers())}
      onMouseLeave={() => setLit(false)}
      style={{
        position: 'absolute',
        left: px(rect.x),
        top: px(rect.y),
        width: px(rect.w),
        height: px(rect.h),
        minHeight: px(rect.h),
        padding: 0,
        border: 0,
        borderRadius: 0,
        '--sf-focus': INK,
        '--sf-btn-hover-bg': 'transparent',
        ...style,
      }}
    >
      {lit && glow && (
        <span
          aria-hidden="true"
          data-sf-arrow-glow=""
          style={{
            position: 'absolute', pointerEvents: 'none', background: ARROW_GLOW,
            left: px(glow.x), top: px(glow.y), width: px(glow.w), height: px(glow.h),
          }}
        />
      )}
      {children}
      {ring && (
        <span
          aria-hidden="true"
          data-sf-arrow-ring=""
          style={{
            position: 'absolute', inset: 3, pointerEvents: 'none',
            outline: `2px solid ${PARCH_100}`, outlineOffset: -2,
          }}
        />
      )}
    </Button>
  );
}
