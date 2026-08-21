/**
 * design/townGlyphs/medieval.js — THE MEDIEVAL GLYPH LIBRARY (THE ILLUSTRATED TOWN, IT-1).
 *
 * The first ship of the glyph-set registry: a bird's-flight vocabulary of buildings
 * drawn as small OBLIQUE ELEVATIONS. Each glyph is a named list of primitive strokes in
 * a LOCAL 0..1 × 0..1 box (x right, y DOWN, ground line at y=1); the glyphCompiler places,
 * scales, and mirrors it and emits primitive draw ops. A church gets its spire, a mill its
 * wheel, a smithy its chimney — "actual detail", never a plain block (the owner's spine).
 *
 * Stroke roles (the compiler paints each): `face` = a building wall (buildingFill + the
 * district-category tint outline — the "what kind of place" colour signal preserved from
 * the legacy rect), `roof` = a roof (a faint tint wash + ink line), `ink` = an ink detail
 * (door / window / cross / crenellation; `c:true` closes it), `line` = a single ink line,
 * `circle` = an ink circle (the mill wheel, a clock).
 *
 * TASTE NOTE (JUDGMENT — vetoable): the mark vocabulary and per-building silhouettes are a
 * cartographer's-eye choice, kept compact (≤ ~8 strokes each) for legibility and the op
 * budget. A genre pack (sci-fi / desert / gothic) is a NEW data module of this exact shape
 * plus a palette — zero engine change (design §5.3).
 */

/** @typedef {import('./glyphCompiler.js').Glyph} Glyph */

/** A base oblique cottage: front face + receding right side + gable roof + a door.
 *  @param {{ hr?: number, apexX?: number, apexY?: number, eave?: number, door?: boolean, window?: boolean }} [o]
 *  @returns {Glyph} */
function cottage({ hr = 1, apexX = 0.39, apexY = 0.24, eave = 0.46, door = true, window: win = false } = {}) {
  /** @type {import('./glyphCompiler.js').GlyphStroke[]} */
  const s = [
    { r: 'face', p: [[0.14, eave], [0.64, eave], [0.64, 0.98], [0.14, 0.98]] },
    { r: 'face', p: [[0.64, eave], [0.84, eave - 0.1], [0.84, 0.88], [0.64, 0.98]] },
    { r: 'roof', p: [[0.1, eave], [apexX, apexY], [0.68, eave]] },
    { r: 'roof', p: [[0.68, eave], [apexX, apexY], [apexX + 0.2, apexY - 0.1], [0.84, eave - 0.1]] },
  ];
  if (door) s.push({ r: 'ink', c: true, p: [[0.34, 0.98], [0.34, 0.74], [0.44, 0.74], [0.44, 0.98]] });
  if (win) s.push({ r: 'ink', c: true, p: [[0.2, eave + 0.14], [0.28, eave + 0.14], [0.28, eave + 0.26], [0.2, eave + 0.26]] });
  return { hr, strokes: s };
}

/** The medieval glyph library — glyphKind → glyph. Frozen data at module eval. */
export const MEDIEVAL_GLYPHS = Object.freeze({
  // ── seeded fill / house variants ──
  'house-a': cottage(),
  'house-b': cottage({ hr: 0.95, apexX: 0.42, apexY: 0.28, window: true }),
  'house-c': cottage({ hr: 1.1, apexX: 0.36, apexY: 0.2, door: true }),

  // ── LOD: fill-mass simplified massing rows (two small gable silhouettes) ──
  massing: {
    hr: 0.7,
    strokes: [
      { r: 'face', p: [[0.1, 0.68], [0.44, 0.68], [0.44, 0.98], [0.1, 0.98]] },
      { r: 'roof', p: [[0.08, 0.68], [0.27, 0.54], [0.46, 0.68]] },
      { r: 'face', p: [[0.52, 0.72], [0.9, 0.72], [0.9, 0.98], [0.52, 0.98]] },
      { r: 'roof', p: [[0.5, 0.72], [0.71, 0.58], [0.92, 0.72]] },
    ],
  },

  // ── church / temple: nave + a TALL steeple crowned by a cross ──
  spire: {
    hr: 1.7,
    strokes: [
      { r: 'face', p: [[0.14, 0.58], [0.56, 0.58], [0.56, 0.98], [0.14, 0.98]] },
      { r: 'face', p: [[0.56, 0.58], [0.72, 0.5], [0.72, 0.9], [0.56, 0.98]] },
      { r: 'roof', p: [[0.12, 0.58], [0.35, 0.42], [0.58, 0.58]] },
      { r: 'face', p: [[0.6, 0.3], [0.78, 0.3], [0.78, 0.72], [0.6, 0.72]] },
      { r: 'roof', p: [[0.58, 0.3], [0.69, 0.06], [0.8, 0.3]] },
      { r: 'line', p: [[0.69, 0.06], [0.69, 0.0]] },
      { r: 'line', p: [[0.65, 0.03], [0.73, 0.03]] },
      { r: 'ink', c: true, p: [[0.3, 0.98], [0.3, 0.7], [0.4, 0.7], [0.4, 0.98]] },
    ],
  },

  // ── shrine: a small chapel with a short spire + cross ──
  'small-spire': {
    hr: 1.3,
    strokes: [
      { r: 'face', p: [[0.22, 0.56], [0.62, 0.56], [0.62, 0.98], [0.22, 0.98]] },
      { r: 'roof', p: [[0.2, 0.56], [0.42, 0.32], [0.64, 0.56]] },
      { r: 'line', p: [[0.42, 0.32], [0.42, 0.14]] },
      { r: 'line', p: [[0.38, 0.18], [0.46, 0.18]] },
      { r: 'ink', c: true, p: [[0.38, 0.98], [0.38, 0.74], [0.46, 0.74], [0.46, 0.98]] },
    ],
  },

  // ── mill: house + a big water wheel with axle + spoke ──
  wheelhouse: {
    hr: 1.1,
    strokes: [
      { r: 'face', p: [[0.1, 0.44], [0.56, 0.44], [0.56, 0.98], [0.1, 0.98]] },
      { r: 'roof', p: [[0.08, 0.44], [0.33, 0.22], [0.58, 0.44]] },
      { r: 'circle', c: [0.74, 0.7], rad: 0.2 },
      { r: 'line', p: [[0.58, 0.7], [0.94, 0.7]] },
      { r: 'line', p: [[0.74, 0.5], [0.74, 0.9]] },
      { r: 'ink', c: true, p: [[0.26, 0.98], [0.26, 0.72], [0.36, 0.72], [0.36, 0.98]] },
    ],
  },

  // ── smithy: workshop + a chimney trailing a smoke wisp + a wide forge mouth ──
  forge: {
    hr: 1.15,
    strokes: [
      { r: 'face', p: [[0.12, 0.5], [0.62, 0.5], [0.62, 0.98], [0.12, 0.98]] },
      { r: 'face', p: [[0.62, 0.5], [0.8, 0.42], [0.8, 0.9], [0.62, 0.98]] },
      { r: 'roof', p: [[0.1, 0.5], [0.37, 0.3], [0.64, 0.5]] },
      { r: 'face', p: [[0.66, 0.2], [0.76, 0.2], [0.76, 0.5], [0.66, 0.5]] },
      { r: 'ink', p: [[0.71, 0.2], [0.68, 0.1], [0.74, 0.04]] },
      { r: 'ink', p: [[0.24, 0.98], [0.24, 0.66], [0.44, 0.66], [0.44, 0.98]] },
    ],
  },

  // ── inn / tavern: house + a hanging signpost (post + board) ──
  'signpost-house': {
    hr: 1.05,
    strokes: [
      { r: 'face', p: [[0.1, 0.5], [0.58, 0.5], [0.58, 0.98], [0.1, 0.98]] },
      { r: 'face', p: [[0.58, 0.5], [0.74, 0.42], [0.74, 0.9], [0.58, 0.98]] },
      { r: 'roof', p: [[0.08, 0.5], [0.34, 0.3], [0.6, 0.5]] },
      { r: 'line', p: [[0.82, 0.42], [0.82, 0.86]] },
      { r: 'line', p: [[0.82, 0.5], [0.94, 0.5]] },
      { r: 'ink', c: true, p: [[0.86, 0.5], [0.94, 0.5], [0.94, 0.64], [0.86, 0.64]] },
      { r: 'ink', c: true, p: [[0.26, 0.98], [0.26, 0.72], [0.36, 0.72], [0.36, 0.98]] },
    ],
  },

  // ── keep / garrison: a crenellated tower ──
  'towered-keep': {
    hr: 1.5,
    strokes: [
      { r: 'face', p: [[0.24, 0.28], [0.64, 0.28], [0.64, 0.98], [0.24, 0.98]] },
      { r: 'face', p: [[0.64, 0.28], [0.8, 0.2], [0.8, 0.9], [0.64, 0.98]] },
      { r: 'ink', p: [[0.24, 0.28], [0.24, 0.2], [0.32, 0.2], [0.32, 0.28], [0.4, 0.28], [0.4, 0.2], [0.48, 0.2], [0.48, 0.28], [0.56, 0.28], [0.56, 0.2], [0.64, 0.2], [0.64, 0.28]] },
      { r: 'ink', c: true, p: [[0.38, 0.98], [0.38, 0.66], [0.5, 0.66], [0.5, 0.98]] },
      { r: 'ink', c: true, p: [[0.3, 0.44], [0.36, 0.44], [0.36, 0.54], [0.3, 0.54]] },
    ],
  },

  // ── market: a row of three gabled stalls ──
  'stall-rows': {
    hr: 0.8,
    strokes: [
      { r: 'face', p: [[0.06, 0.66], [0.34, 0.66], [0.34, 0.98], [0.06, 0.98]] },
      { r: 'roof', p: [[0.02, 0.66], [0.2, 0.52], [0.38, 0.66]] },
      { r: 'face', p: [[0.38, 0.66], [0.66, 0.66], [0.66, 0.98], [0.38, 0.98]] },
      { r: 'roof', p: [[0.34, 0.66], [0.52, 0.52], [0.7, 0.66]] },
      { r: 'face', p: [[0.7, 0.66], [0.94, 0.66], [0.94, 0.98], [0.7, 0.98]] },
      { r: 'roof', p: [[0.66, 0.66], [0.82, 0.52], [0.98, 0.66]] },
    ],
  },

  // ── granary: a tall gambrel-roofed store with a big barn door ──
  'gambrel-store': {
    hr: 1.25,
    strokes: [
      { r: 'face', p: [[0.18, 0.48], [0.66, 0.48], [0.66, 0.98], [0.18, 0.98]] },
      { r: 'roof', p: [[0.16, 0.48], [0.24, 0.3], [0.42, 0.2], [0.6, 0.3], [0.68, 0.48]] },
      { r: 'ink', c: true, p: [[0.34, 0.98], [0.34, 0.6], [0.5, 0.6], [0.5, 0.98]] },
      { r: 'line', p: [[0.42, 0.6], [0.42, 0.98]] },
    ],
  },

  // ── docks: a low shed + a jetty with pilings reaching toward the water ──
  'quay-shed': {
    hr: 0.85,
    strokes: [
      { r: 'face', p: [[0.14, 0.6], [0.58, 0.6], [0.58, 0.92], [0.14, 0.92]] },
      { r: 'roof', p: [[0.1, 0.6], [0.36, 0.48], [0.62, 0.6]] },
      { r: 'line', p: [[0.58, 0.86], [0.98, 0.94]] },
      { r: 'line', p: [[0.62, 0.8], [0.62, 1.0]] },
      { r: 'line', p: [[0.78, 0.83], [0.78, 1.0]] },
    ],
  },

  // ── noble: a wide two-gabled manor hall with a chimney ──
  'manor-hall': {
    hr: 1,
    strokes: [
      { r: 'face', p: [[0.08, 0.5], [0.72, 0.5], [0.72, 0.98], [0.08, 0.98]] },
      { r: 'face', p: [[0.72, 0.5], [0.88, 0.42], [0.88, 0.9], [0.72, 0.98]] },
      { r: 'roof', p: [[0.06, 0.5], [0.24, 0.34], [0.42, 0.5]] },
      { r: 'roof', p: [[0.42, 0.5], [0.6, 0.34], [0.74, 0.5]] },
      { r: 'face', p: [[0.3, 0.24], [0.38, 0.24], [0.38, 0.42], [0.3, 0.42]] },
      { r: 'ink', c: true, p: [[0.14, 0.98], [0.14, 0.7], [0.24, 0.7], [0.24, 0.98]] },
      { r: 'ink', c: true, p: [[0.5, 0.66], [0.58, 0.66], [0.58, 0.78], [0.5, 0.78]] },
    ],
  },

  // ── civic: a hall with a small bell turret + clock face ──
  'moot-hall': {
    hr: 1.15,
    strokes: [
      { r: 'face', p: [[0.12, 0.52], [0.66, 0.52], [0.66, 0.98], [0.12, 0.98]] },
      { r: 'roof', p: [[0.1, 0.52], [0.39, 0.34], [0.68, 0.52]] },
      { r: 'face', p: [[0.4, 0.24], [0.56, 0.24], [0.56, 0.52], [0.4, 0.52]] },
      { r: 'roof', p: [[0.38, 0.24], [0.48, 0.12], [0.58, 0.24]] },
      { r: 'circle', c: [0.48, 0.36], rad: 0.06 },
      { r: 'ink', c: true, p: [[0.28, 0.98], [0.28, 0.7], [0.4, 0.7], [0.4, 0.98]] },
    ],
  },

  // ── arcane: a slender tower with a conical cap + finial + two windows ──
  'mage-tower': {
    hr: 1.6,
    strokes: [
      { r: 'face', p: [[0.34, 0.3], [0.62, 0.3], [0.62, 0.98], [0.34, 0.98]] },
      { r: 'roof', p: [[0.28, 0.3], [0.48, 0.06], [0.68, 0.3]] },
      { r: 'line', p: [[0.48, 0.06], [0.48, 0.0]] },
      { r: 'ink', c: true, p: [[0.42, 0.5], [0.54, 0.5], [0.54, 0.64], [0.42, 0.64]] },
      { r: 'ink', c: true, p: [[0.42, 0.72], [0.54, 0.72], [0.54, 0.86], [0.42, 0.86]] },
    ],
  },

  // ── foreign: a house with a shallow dome roof + banded course + arched door ──
  'caravan-house': {
    hr: 1.05,
    strokes: [
      { r: 'face', p: [[0.16, 0.5], [0.64, 0.5], [0.64, 0.98], [0.16, 0.98]] },
      { r: 'roof', p: [[0.14, 0.5], [0.28, 0.34], [0.52, 0.34], [0.66, 0.5]] },
      { r: 'line', p: [[0.4, 0.34], [0.4, 0.24]] },
      { r: 'line', p: [[0.2, 0.62], [0.6, 0.62]] },
      { r: 'ink', c: true, p: [[0.34, 0.98], [0.34, 0.66], [0.46, 0.66], [0.46, 0.98]] },
    ],
  },

  // ── kiln / tannery: long work shed + broad stack ──
  'kiln-yard': {
    hr: 1.05,
    strokes: [
      { r: 'face', p: [[0.08, 0.58], [0.62, 0.58], [0.62, 0.98], [0.08, 0.98]] },
      { r: 'roof', p: [[0.06, 0.58], [0.34, 0.4], [0.64, 0.58]] },
      { r: 'face', p: [[0.7, 0.2], [0.84, 0.2], [0.84, 0.76], [0.7, 0.76]] },
      { r: 'line', p: [[0.77, 0.2], [0.72, 0.1], [0.8, 0.02]] },
      { r: 'ink', c: true, p: [[0.22, 0.98], [0.22, 0.72], [0.46, 0.72], [0.46, 0.98]] },
    ],
  },

  // ── barracks: long gabled hall between two squat guard blocks ──
  barracks: {
    hr: 1.05,
    strokes: [
      { r: 'face', p: [[0.12, 0.52], [0.82, 0.52], [0.82, 0.98], [0.12, 0.98]] },
      { r: 'roof', p: [[0.1, 0.52], [0.46, 0.34], [0.84, 0.52]] },
      { r: 'face', p: [[0.08, 0.4], [0.24, 0.4], [0.24, 0.82], [0.08, 0.82]] },
      { r: 'face', p: [[0.72, 0.4], [0.88, 0.4], [0.88, 0.82], [0.72, 0.82]] },
      { r: 'ink', c: true, p: [[0.4, 0.98], [0.4, 0.7], [0.54, 0.7], [0.54, 0.98]] },
    ],
  },

  // ── watchtower: tall roofed shaft + low guard room ──
  watchtower: {
    hr: 1.55,
    strokes: [
      { r: 'face', p: [[0.2, 0.28], [0.5, 0.28], [0.5, 0.98], [0.2, 0.98]] },
      { r: 'roof', p: [[0.16, 0.28], [0.35, 0.08], [0.54, 0.28]] },
      { r: 'face', p: [[0.5, 0.62], [0.82, 0.54], [0.82, 0.9], [0.5, 0.98]] },
      { r: 'roof', p: [[0.48, 0.62], [0.66, 0.46], [0.84, 0.54]] },
      { r: 'ink', c: true, p: [[0.3, 0.5], [0.4, 0.5], [0.4, 0.62], [0.3, 0.62]] },
    ],
  },

  // ── guildhall: broad hall, flanking wings, and bell turret ──
  guildhall: {
    hr: 1.2,
    strokes: [
      { r: 'face', p: [[0.08, 0.5], [0.88, 0.5], [0.88, 0.98], [0.08, 0.98]] },
      { r: 'roof', p: [[0.06, 0.5], [0.46, 0.28], [0.9, 0.5]] },
      { r: 'face', p: [[0.4, 0.2], [0.56, 0.2], [0.56, 0.5], [0.4, 0.5]] },
      { r: 'roof', p: [[0.38, 0.2], [0.48, 0.08], [0.58, 0.2]] },
      { r: 'ink', c: true, p: [[0.4, 0.98], [0.4, 0.68], [0.56, 0.68], [0.56, 0.98]] },
      { r: 'ink', c: true, p: [[0.18, 0.66], [0.28, 0.66], [0.28, 0.78], [0.18, 0.78]] },
      { r: 'ink', c: true, p: [[0.68, 0.66], [0.78, 0.66], [0.78, 0.78], [0.68, 0.78]] },
    ],
  },

  // ── archive / courthouse: sober hall + raised records tower ──
  'archive-hall': {
    hr: 1.2,
    strokes: [
      { r: 'face', p: [[0.1, 0.5], [0.72, 0.5], [0.72, 0.98], [0.1, 0.98]] },
      { r: 'roof', p: [[0.08, 0.5], [0.4, 0.34], [0.74, 0.5]] },
      { r: 'face', p: [[0.68, 0.28], [0.86, 0.28], [0.86, 0.88], [0.68, 0.98]] },
      { r: 'roof', p: [[0.66, 0.28], [0.77, 0.18], [0.88, 0.28]] },
      { r: 'line', p: [[0.18, 0.66], [0.62, 0.66]] },
      { r: 'ink', c: true, p: [[0.34, 0.98], [0.34, 0.72], [0.48, 0.72], [0.48, 0.98]] },
    ],
  },

  // ── farmstead: high barn + attached lower dwelling ──
  farmstead: {
    hr: 1.05,
    strokes: [
      { r: 'face', p: [[0.08, 0.46], [0.56, 0.46], [0.56, 0.98], [0.08, 0.98]] },
      { r: 'roof', p: [[0.06, 0.46], [0.32, 0.22], [0.58, 0.46]] },
      { r: 'face', p: [[0.56, 0.62], [0.86, 0.54], [0.86, 0.9], [0.56, 0.98]] },
      { r: 'roof', p: [[0.54, 0.62], [0.7, 0.46], [0.88, 0.54]] },
      { r: 'ink', c: true, p: [[0.24, 0.98], [0.24, 0.64], [0.42, 0.64], [0.42, 0.98]] },
    ],
  },

  // ── graveyard / ossuary: chapel cross + low charnel house ──
  'graveyard-chapel': {
    hr: 1.15,
    strokes: [
      { r: 'face', p: [[0.12, 0.52], [0.54, 0.52], [0.54, 0.98], [0.12, 0.98]] },
      { r: 'roof', p: [[0.1, 0.52], [0.33, 0.3], [0.56, 0.52]] },
      { r: 'line', p: [[0.33, 0.3], [0.33, 0.14]] },
      { r: 'line', p: [[0.28, 0.19], [0.38, 0.19]] },
      { r: 'face', p: [[0.62, 0.68], [0.9, 0.62], [0.9, 0.9], [0.62, 0.96]] },
      { r: 'ink', c: true, p: [[0.28, 0.98], [0.28, 0.72], [0.4, 0.72], [0.4, 0.98]] },
    ],
  },

  // ── temporary camp: three tent peaks, intentionally low and open ──
  encampment: {
    hr: 0.72,
    strokes: [
      { r: 'roof', p: [[0.04, 0.86], [0.22, 0.56], [0.4, 0.86]] },
      { r: 'line', p: [[0.22, 0.56], [0.22, 0.98]] },
      { r: 'roof', p: [[0.34, 0.78], [0.56, 0.46], [0.78, 0.78]] },
      { r: 'line', p: [[0.56, 0.46], [0.56, 0.96]] },
      { r: 'roof', p: [[0.62, 0.9], [0.8, 0.64], [0.98, 0.9]] },
    ],
  },

  // ── named ruin: broken roofless shells and one surviving tower ──
  'ruin-shell': {
    hr: 1.15,
    strokes: [
      { r: 'face', p: [[0.08, 0.5], [0.48, 0.5], [0.48, 0.98], [0.08, 0.98]] },
      { r: 'ink', p: [[0.08, 0.5], [0.18, 0.42], [0.28, 0.54], [0.38, 0.44], [0.48, 0.5]] },
      { r: 'face', p: [[0.58, 0.28], [0.78, 0.28], [0.78, 0.9], [0.58, 0.98]] },
      { r: 'ink', p: [[0.58, 0.28], [0.64, 0.2], [0.7, 0.3], [0.78, 0.28]] },
      { r: 'line', p: [[0.16, 0.72], [0.42, 0.72]] },
    ],
  },

  // ── industrial: a mono-pitch shed + a tall chimney trailing smoke ──
  workshop: {
    hr: 1.2,
    strokes: [
      { r: 'face', p: [[0.1, 0.54], [0.58, 0.54], [0.58, 0.98], [0.1, 0.98]] },
      { r: 'roof', p: [[0.08, 0.54], [0.2, 0.42], [0.6, 0.42], [0.6, 0.54]] },
      { r: 'face', p: [[0.68, 0.16], [0.78, 0.16], [0.78, 0.54], [0.68, 0.54]] },
      { r: 'ink', p: [[0.73, 0.16], [0.69, 0.06], [0.76, 0.0]] },
      { r: 'ink', c: true, p: [[0.22, 0.98], [0.22, 0.68], [0.4, 0.68], [0.4, 0.98]] },
    ],
  },
});
