/**
 * design/organic/logo.js — THE HOUSE DEVICE (owner-approved final, 2026-07-18).
 *
 * The mark is the IRREDUCIBLE DEVICE: a ring broken by a settlement roofline, the
 * station triangle centred in the field, one red seal-point at the triangle's
 * centroid. NO text, NO legend, NO motto, NO monogram, NO pellets inside the mark —
 * the name always lives in TYPE beside it, never inside it.
 *
 * CANONICAL GEOMETRY (viewBox 0 0 64 64):
 *   ring     M 7 44 A 27 27 0 1 1 57 44            (stroke ~3)
 *   skyline  M 7 44 H 20 L 25 37 L 30 44 H 34 L 40 35 L 46 44 H 57  (stroke ~3, round joins)
 *   triangle M 32 15 L 41 31 H 23 Z                (stroke ~2.6)
 *   dot      cx 32 cy 25.7 r 2.6                   (the rubric oxblood — never destructive red)
 *
 * HAND-INKED, NOT GEOMETRIC (the craft law): the shipped paths below are the
 * canonical geometry with AUTHORED sub-half-pixel modulation — the ring is an
 * imperceptibly non-circular arc (rx≠ry), the roofline's runs bow by ≤0.25px and
 * its vertices sit off-true by ≤0.2px, the triangle's base eases, and stroke
 * weights modulate slightly between elements (ring > skyline > triangle). Fixed
 * authored coordinates — never runtime jitter (§8). The wobble survives the HEAVY
 * redraw (the favicon weight is a REDRAW with heavier strokes, never a scale-down).
 *
 * ONE-INK VARIANT: the dot renders in the ink — the device must still read.
 * Pure string builders; lazy.
 *
 * ⚠ THE DEVICE NO LONGER DRESSES THE PRODUCT (owner order 2026-09-19, ODQ §934.17).
 * Every shipped icon and share card is now a cut of the owner's arrow painting
 * (scripts/derive-brand-marks.mjs), so the three asset builders this file used to
 * export — faviconSvg, appleTouchIconSvg, ogImageSvg — are gone with the assets they
 * made. What remains is the DRAWN DEVICE itself, which is still live in the dossier:
 * src/pdf/primitives/HouseDeviceSeal.jsx and HouseCountersealSeal.jsx strike it as the
 * charter's vector mark, and scripts/gen-organic-logo.mjs keeps the documentation
 * goldens under docs/samples/organic-craft/logo honest.
 */

import { INK, FIELD_INK } from './ink.js';
import { RUBRIC, FIELD_RUBRIC } from './rubrication.js';

export const DEVICE_VIEWBOX = 64;

/** The hand-inked paths — ONE authored source (the standalone eager component pins to these). */
export const DEVICE_PATHS = Object.freeze({
  // The ring: one broken arc, imperceptibly non-circular (rx 27.15 / ry 26.85).
  ring: 'M 7 44 A 27.15 26.85 0 1 1 57 44',
  // The roofline: gentle bows on the runs, vertices off-true by ≤0.2px.
  skyline: 'M 7 44.1 Q 13.5 43.75 20 43.95 L 25.1 36.9 L 29.9 44.05 Q 32 43.9 34 44 L 40.1 34.85 L 45.9 44.1 Q 51.5 43.8 57 44',
  // The station triangle: eased base, apex a touch west of true.
  triangle: 'M 31.9 15.2 L 41.05 30.9 Q 32 31.35 23.05 31.1 Z',
});

export const DEVICE_DOT = Object.freeze({ cx: 32, cy: 25.7, r: 2.6, rHeavy: 4.2 });

/** Stroke weights per redraw — modulated between elements (hand-inked, not uniform). */
export const DEVICE_WEIGHTS = Object.freeze({
  standard: { ring: 3.05, skyline: 2.9, triangle: 2.55 },
  heavy:    { ring: 6.1,  skyline: 5.85, triangle: 4.95 },
});

/** The two palettes: light ground (warm-black ink, oxblood point) and dark/dim
 *  ground (parchment-pale ink, the dim-field rubric point). */
export function devicePalette(mode = 'light') {
  return mode === 'dark'
    ? { ink: FIELD_INK.ink, rubric: FIELD_RUBRIC.rubric }
    : { ink: INK.deepest, rubric: RUBRIC.rubric };
}

/**
 * The device's inner markup (no <svg> wrapper) — reused by every asset builder.
 * @param {{ink:string, rubric:string}} p
 * @param {'standard'|'heavy'} weight
 * @param {boolean} oneInk  render the seal-point in the ink (must still read)
 */
export function deviceMarkup(p, weight = 'standard', oneInk = false) {
  const w = DEVICE_WEIGHTS[weight] || DEVICE_WEIGHTS.standard;
  const dotR = weight === 'heavy' ? DEVICE_DOT.rHeavy : DEVICE_DOT.r;
  const dotFill = oneInk ? p.ink : p.rubric;
  const stroke = (d, sw) => `<path d="${d}" fill="none" stroke="${p.ink}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
  return stroke(DEVICE_PATHS.ring, w.ring)
    + stroke(DEVICE_PATHS.skyline, w.skyline)
    + stroke(DEVICE_PATHS.triangle, w.triangle)
    + `<circle cx="${DEVICE_DOT.cx}" cy="${DEVICE_DOT.cy}" r="${dotR}" fill="${dotFill}"/>`;
}

/**
 * A self-contained device SVG.
 * @param {Object} [opts]
 * @param {'light'|'dark'} [opts.mode]
 * @param {'standard'|'heavy'} [opts.weight]
 * @param {boolean} [opts.oneInk]
 * @param {number} [opts.size]
 * @param {'none'|'parchment'} [opts.ground]  parchment = an opaque warm ground square
 */
export function houseDevice({ mode = 'light', weight = 'standard', oneInk = false, size = 64, ground = 'none' } = {}) {
  const p = devicePalette(mode);
  const bg = ground === 'parchment' ? `<rect width="${DEVICE_VIEWBOX}" height="${DEVICE_VIEWBOX}" fill="#FBF5E6"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${DEVICE_VIEWBOX} ${DEVICE_VIEWBOX}" width="${size}" height="${size}" role="presentation" aria-hidden="true" focusable="false">${bg}${deviceMarkup(p, weight, oneInk)}</svg>`;
}

/** The motto — set ONLY as an adjacent typographic caption in ceremonial
 *  contexts (export colophon, the About seal); never inside the mark. */
export const HOUSE_MOTTO = 'State, never fate';
