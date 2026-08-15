/**
 * design/organic/posture.js — THE THREE-POSTURE MODEL (Organic Craft law §10/§10b).
 *
 * The mobile/desktop binary is a category error: it conflates "how much space"
 * with "how is it operated", and a tablet answers those in the combination the
 * binary can't express (desktop-class width, coarse pointer, hover that comes and
 * goes when a trackpad attaches, a window that resizes from phone-narrow to
 * desktop-wide within one session under Split View / Stage Manager). Every serious
 * platform resolved this the same way — classify the WINDOW, not the device, from
 * mutable runtime capabilities, never from the user-agent.
 *
 * THREE POSTURES:
 *   • FIELD  — the phone / compact window: the prompter, realm gated, field-mode dim.
 *   • SPREAD — the tablet / medium window OR a coarse-pointer expanded window: the
 *              open book and the shared table surface, realm-capable.
 *   • DESK   — the fine-pointer + hover expanded window: the full instrument bench.
 *
 * Derivation (this file is PURE — no React, no DOM; the hook feeds it live
 * capabilities): width sets the macro structure; pointer + hover refine an
 * expanded window into DESK vs SPREAD (a large touch tablet in landscape is SPREAD,
 * not DESK). Orientation is a SECOND axis carried alongside, not folded into the
 * posture — SPREAD composes landscape as a recto/verso spread and portrait as a
 * single folio. Verified in tests/design/organicPosture.test.js.
 */

export const POSTURE = Object.freeze({ FIELD: 'field', SPREAD: 'spread', DESK: 'desk' });

// Window size-class breakpoints (Material's compact/medium/expanded, in px).
export const COMPACT_MAX = 600;   // < 600  → compact (phone-class window)
export const EXPANDED_MIN = 1024; // >= 1024 → expanded (desktop-class window)

/**
 * The matchMedia queries a live environment must supply. Kept here so the hook and
 * the tests read one source. `width` uses two thresholds; the rest are capability
 * queries (`any-*` so an attached trackpad's fine pointer / hover is detected).
 */
export const POSTURE_QUERIES = Object.freeze({
  mediumUp:     `(min-width: ${COMPACT_MAX}px)`,
  expandedUp:   `(min-width: ${EXPANDED_MIN}px)`,
  finePointer:  '(any-pointer: fine)',
  canHover:     '(any-hover: hover)',
  landscape:    '(orientation: landscape)',
});

/**
 * Derive the posture from a capabilities snapshot. Pure and total — every input
 * combination returns one of the three postures.
 *
 * @param {Object} caps
 * @param {number}  caps.width         viewport width in px
 * @param {boolean} caps.finePointer   any-pointer: fine (mouse / trackpad / stylus-hover)
 * @param {boolean} caps.canHover      any-hover: hover
 * @returns {'field'|'spread'|'desk'}
 */
export function derivePosture({ width, finePointer, canHover }) {
  if (width < COMPACT_MAX) return POSTURE.FIELD;              // compact window → the field notebook
  if (width < EXPANDED_MIN) return POSTURE.SPREAD;           // medium window → the tablet spread
  // Expanded width: a precise, hover-capable pointer is the desk; a coarse /
  // hover-less pointer (a big touch tablet) stays the spread.
  return finePointer && canHover ? POSTURE.DESK : POSTURE.SPREAD;
}

/**
 * The full posture reading a consumer wants: the posture plus the raw axes it
 * needs (orientation for SPREAD's recto/verso vs folio; hover/pointer for
 * affordance choices). Pure.
 * @param {{width:number, finePointer:boolean, canHover:boolean, landscape:boolean}} caps
 */
export function readPosture(caps) {
  const posture = derivePosture(caps);
  return Object.freeze({
    posture,
    isField: posture === POSTURE.FIELD,
    isSpread: posture === POSTURE.SPREAD,
    isDesk: posture === POSTURE.DESK,
    orientation: caps.landscape ? 'landscape' : 'portrait',
    canHover: !!caps.canHover,
    finePointer: !!caps.finePointer,
  });
}

/** The SSR / no-DOM default: assume the desk (widest, most capable) so a server
 *  render never ships the compressed field layout to a machine we can't measure. */
export const SSR_POSTURE = Object.freeze(readPosture({ width: EXPANDED_MIN, finePointer: true, canHover: true, landscape: true }));
