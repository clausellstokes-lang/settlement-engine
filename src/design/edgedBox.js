/**
 * design/edgedBox.js — THE ACCENT-EDGE BOX, AS LONGHANDS ONLY.
 *
 * ⛔ THE CLASS THIS EXISTS AGAINST (ODQ §934.22 item 4a). React applies an inline
 * `style` object property by property, so an object that sets a SHORTHAND (`border`)
 * beside one of its LONGHANDS (`borderLeft`) has an outcome decided by the order the
 * two were written in — which is invisible at the call site. When the shorthand
 * CHANGES across renders, React warns:
 *
 *     Updating a style property during rerender (border) when a conflicting
 *     property is set (borderLeft) can lead to styling bugs.
 *
 * Twenty-four of those sat unattributed in the console during the 2026-09-19 walk,
 * and the warning names the PROPERTY, never the element, so nobody could say which
 * component emitted them.
 *
 * It is not cosmetic. On the render where the shorthand changes it RESETS every
 * longhand it covers — so the 3px accent edge a card was drawn with is silently
 * flattened to the shorthand's 1px, at exactly the moment the card changed state
 * (a threat expanded, an NPC pinned, a deficit appeared). The accent is there to
 * carry meaning; that is the render on which it disappears.
 *
 * ⭐ THE CURE IS ALWAYS THE SAME FOUR PROPERTIES, so it is written once. Each call
 * site spreads this rather than hand-expanding, which also keeps each colour
 * expression written ONCE — hand-expanding would triple a raw hex literal and move
 * the raw-colour occurrence budget (tests/lint/rawColorLiteral.test.js) for a
 * refactor that changes no colour at all.
 *
 * Zero imports, like design/proseScale.js beside it: dozens of components pull this
 * in and none of them should gain a token-module edge for four CSS properties.
 *
 * @enforced-by tests/lint/styleShorthandLonghand.walker.test.js
 */

/**
 * A box whose edges are all `all`, except the left, which is `left`.
 *
 * Spread into a style object IN PLACE of a `border` + `borderLeft` pair:
 *
 *     style={{ ...edged(`1px solid ${danger ? RED : AMBER}`, `3px solid ${RED}`), padding: 8 }}
 *
 * ⚠ `undefined` ON A SIDE IS A REAL ANSWER and is passed through deliberately: React
 * treats an undefined style value as "do not set", and a caller that means "no left
 * edge here" must be able to say so. What it may NOT do is fall back to a shorthand,
 * which is the pattern being removed.
 *
 * @param {string|number|undefined} all   the three unaccented edges (top, right, bottom)
 * @param {string|number|undefined} [left] the accented edge; defaults to `all`
 * @returns {{ borderTop: any, borderRight: any, borderBottom: any, borderLeft: any }}
 */
export function edged(all, left = all) {
  return { borderTop: all, borderRight: all, borderBottom: all, borderLeft: left };
}
