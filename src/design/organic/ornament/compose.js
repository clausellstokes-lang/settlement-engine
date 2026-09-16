/**
 * design/organic/ornament/compose.js — SEEDED ORNAMENT COMPOSITION (law §5).
 *
 * The public builders. Each returns a self-contained, decorative SVG string
 * (aria-hidden, role=presentation, focusable=false, alt="" by construction) that is
 * a DETERMINISTIC function of its seed + palette — same seed ⇒ byte-identical
 * ornament, which the golden family pins. Composition draws from the vetted pools
 * over the fixed palette; a settlement's frame, corners, and emblem are chosen from
 * independent sub-hashes so they decorrelate but reproduce.
 *
 * WHIMSY UNREPEATED (§5): a cartouche frames with ONE corner hand mirrored to four
 * corners (coherent symmetry), never four different quirks (which would read as a
 * system). Decorative and functional are separate contracts: a name inside a
 * cartouche is HTML the caller overlays, never SVG text baked into aria-hidden
 * ornament. Pure; node-runnable (the generator); lazy.
 */

import { seededPicker } from './fnv.js';
import { ornamentPalette } from './palette.js';
import { EMBLEMS, EMBLEM_BY_KIND, CORNER_PIECES, CARTOUCHE_FRAMES, compassRoseSvg } from './pools.js';

const NS = 'http://www.w3.org/2000/svg';

/** Wrap inner markup as a self-contained decorative SVG. */
function svgWrap(w, h, inner, { size, className = 'oc-ornament-svg' } = {}) {
  const width = size || w;
  const height = size ? Math.round((size * h) / w) : h;
  return `<svg xmlns="${NS}" viewBox="0 0 ${w} ${h}" width="${width}" height="${height}" class="${className}" role="presentation" aria-hidden="true" focusable="false">${inner}</svg>`;
}

/** A single house emblem chosen from the seed. */
export function emblem(seed, { mode = 'light', size } = {}) {
  const p = ornamentPalette(mode);
  const chosen = seededPicker(seed).pick('emblem', EMBLEMS);
  return svgWrap(48, 48, chosen.draw(p), { size });
}

/** The world-biased emblem: pick the mark that MEANS this kind (a mining town →
 *  the pick), so ornament encodes meaning, not just variety. Falls back to a
 *  seeded emblem for an unknown kind. */
export function emblemForKind(kind, { seed = kind, mode = 'light', size } = {}) {
  const p = ornamentPalette(mode);
  const chosen = EMBLEM_BY_KIND[kind] || seededPicker(seed).pick('emblem', EMBLEMS);
  return svgWrap(48, 48, chosen.draw(p), { size });
}

const CORNER_TX = Object.freeze({
  tl: 'translate(0,0)',
  tr: (w) => `translate(${w},0) scale(-1,1)`,
  br: (w, h) => `translate(${w},${h}) scale(-1,-1)`,
  bl: (w, h) => `translate(0,${h}) scale(1,-1)`,
});

/** One corner flourish, oriented to a corner ('tl'|'tr'|'br'|'bl'). */
export function cornerPiece(seed, { corner = 'tl', mode = 'light', size = 24 } = {}) {
  const p = ornamentPalette(mode);
  const piece = seededPicker(seed).pick('corner', CORNER_PIECES);
  const tx = corner === 'tl' ? CORNER_TX.tl
    : corner === 'tr' ? CORNER_TX.tr(24)
      : corner === 'br' ? CORNER_TX.br(24, 24)
        : CORNER_TX.bl(24, 24);
  return svgWrap(24, 24, `<g transform="${tx}">${piece.draw(p)}</g>`, { size });
}

/**
 * The device medallion's layout inside a cartouche of a given height — ONE source
 * for the composer (draws it) and the React label overlay (pads past it), so the
 * optical clearances are a documented system, not per-callsite magic (the review
 * revision: at desk widths the device straddled the inner frame line and the
 * title crowded the right inner edge).
 *
 *   inset  — the medallion ring's clearance from the frame's INNER line (the
 *            frames draw their inner detail at x≈7..12, so the ring starts at 14).
 *   r      — the emblem roundel radius (capped so ring + emblem sit fully clear
 *            of the frame at every height).
 *   endX   — the medallion's right-most extent (ring edge) — the label pads past
 *            endX + gutter; the right pad mirrors the gutter against the frame.
 * @param {number} height
 */
export function cartoucheDeviceLayout(height) {
  const inset = 14;
  const r = Math.min(20, Math.max(10, Math.floor(height / 2) - inset));
  const ringR = r + 3;
  const cx = inset + ringR;
  return Object.freeze({ inset, r, ringR, cx, cy: height / 2, endX: cx + ringR, gutter: 10 });
}

/**
 * The seeded CARTOUCHE — a rare, meaningful nameplate (seal / plate / charter).
 * Frame + one corner hand mirrored to four corners + a left DEVICE emblem, all
 * chosen from independent sub-hashes of the seed: 3 frames × 4 corners × 8 devices
 * = a broad per-settlement composition space (CK3's constrained-combinatorics
 * lesson). The caller overlays the NAME as HTML to the right of the device
 * (decorative/functional split). `device:false` gives a plain nameplate.
 */
export function cartouche(seed, { mode = 'light', width = 320, height = 96, device = true } = {}) {
  const p = ornamentPalette(mode);
  const pick = seededPicker(seed);
  const frame = pick.pick('frame', CARTOUCHE_FRAMES);
  const corner = pick.pick('corner', CORNER_PIECES);
  const corners = ['tl', 'tr', 'br', 'bl'].map((c) => {
    const tx = c === 'tl' ? `translate(6,6)`
      : c === 'tr' ? `translate(${width - 6},6) scale(-1,1)`
        : c === 'br' ? `translate(${width - 6},${height - 6}) scale(-1,-1)`
          : `translate(6,${height - 6}) scale(1,-1)`;
    return `<g transform="${tx}">${corner.draw(p)}</g>`;
  }).join('');
  let deviceMark = '';
  if (device) {
    const em = pick.pick('device', EMBLEMS);
    const { r, ringR, cx, cy } = cartoucheDeviceLayout(height);
    const s = (2 * r) / 48; // emblem 48-box → roundel diameter
    deviceMark = `<circle cx="${cx}" cy="${cy}" r="${ringR}" fill="none" stroke="${p.faint}" stroke-width="1"/>`
      + `<g transform="translate(${cx - r},${cy - r}) scale(${round(s)})">${em.draw(p)}</g>`;
  }
  return svgWrap(width, height, `${frame.draw(p, width, height)}${corners}${deviceMark}`, {});
}

function round(n) { return Math.round(n * 1e4) / 1e4; }

/** THE house compass rose — one canonical, NON-seeded design (the signature). */
export function compassRose({ mode = 'light', size = 64 } = {}) {
  const p = ornamentPalette(mode);
  return svgWrap(64, 64, compassRoseSvg(p), { size });
}
