/**
 * design/organic/ornament/pools.js — THE VETTED COMPONENT LIBRARIES (law §5).
 *
 * Seeded ornament that reads as craft is a CONSTRAINED COMPOSITION of authored
 * components — small vetted pools × a fixed palette × a deterministic seed (CK3
 * heraldry, Pentiment alternates). These are the pools: house marks drawn for
 * PURPOSE in an engraving register (icon-library glyphs at display level are a
 * named AI-slop tell), corner flourishes, cartouche frames, and the ONE house
 * compass rose. Each builder takes a palette and returns SVG inner-markup; the
 * composer (compose.js) assembles them onto a viewBox.
 *
 * Slight irregularity is BAKED INTO the path ("clean dirt"), never a runtime
 * jitter/turbulence filter (§8). Every emblem carries a `kind` so world state can
 * bias selection later (a mining town → the pick) — meaning, not just variety.
 * Pure; lazy.
 */

const S = (p, w = 2) => `fill="none" stroke="${p.line}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;

// ── EMBLEMS — house marks (48×48), keyed by kind for world-biased selection ───
export const EMBLEMS = Object.freeze([
  { kind: 'watch', name: 'tower', draw: (p) =>
    `<g ${S(p)}><path d="M17 41 L17 19 L31 19 L31 41"/><path d="M15 19 L15 13 L18 13 L18 16 L21 16 L21 13 L27 13 L27 16 L30 16 L30 13 L33 13 L33 19"/><path d="M21 41 L21 31 Q24 27.5 27 31 L27 41"/></g><circle cx="24" cy="24.5" r="1.5" fill="${p.line}"/>` },
  { kind: 'craft', name: 'anvil', draw: (p) =>
    `<g ${S(p)}><path d="M13 22 L33 22 L33 25 Q28 27 24 26 L24 30 L30 30 L28 35 L18 35 L20 30 L21 30 L21 24 Q16 24 13 22 Z"/><path d="M11 22 L15 22"/></g>` },
  { kind: 'field', name: 'sheaf', draw: (p) =>
    `<g ${S(p)}><path d="M24 34 L24 15"/><path d="M24 34 L18 17"/><path d="M24 34 L30 17"/><path d="M24 34 L14 22"/><path d="M24 34 L34 22"/><path d="M17 34 Q24 31 31 34"/><path d="M17 37 Q24 34 31 37"/></g>` },
  { kind: 'water', name: 'wave', draw: (p) =>
    `<g ${S(p)}><path d="M13 20 Q18 15 24 20 T35 20"/><path d="M13 26 Q18 21 24 26 T35 26"/><path d="M13 32 Q18 27 24 32 T35 32"/></g>` },
  { kind: 'mine', name: 'pick', draw: (p) =>
    `<g ${S(p)}><path d="M15 18 Q24 12 33 18"/><path d="M24 15 L24 37"/><path d="M20 33 L28 33"/></g>` },
  { kind: 'faith', name: 'chalice', draw: (p) =>
    `<g ${S(p)}><path d="M16 16 L32 16 Q31 27 24 28 Q17 27 16 16 Z"/><path d="M24 28 L24 35"/><path d="M18 37 L30 37"/></g>` },
  { kind: 'trade', name: 'coin', draw: (p) =>
    `<g ${S(p)}><circle cx="24" cy="24" r="10"/><circle cx="24" cy="24" r="5.5"/></g><path d="M24 20 L24 28 M20 24 L28 24" stroke="${p.line}" stroke-width="2" stroke-linecap="round"/>` },
  { kind: 'wild', name: 'oak', draw: (p) =>
    `<g ${S(p)}><path d="M24 40 L24 27"/><path d="M18 40 Q24 36 30 40"/><path d="M24 27 Q13 25 15 17 Q15 10 24 12 Q33 10 33 17 Q35 25 24 27 Z"/></g>` },
]);

/** kind → the emblem preferring it (world-biased selection hook for later). */
export const EMBLEM_BY_KIND = Object.freeze(
  EMBLEMS.reduce((m, e) => { m[e.kind] = e; return m; }, /** @type {Record<string, typeof EMBLEMS[number]>} */({})),
);

// ── CORNER PIECES — flourishes drawn in the TOP-LEFT orientation (12×12 origin) ─
// The composer translates+rotates them to the four corners. Each is a distinct
// hand (a scroll, a bracket, a leaf, a spur), never repeated as a uniform system.
export const CORNER_PIECES = Object.freeze([
  { name: 'scroll', draw: (p) => `<g ${S(p, 1.6)}><path d="M4 20 Q4 4 20 4"/><path d="M4 12 Q4 8 8 8 Q11 8 11 11"/></g>` },
  { name: 'bracket', draw: (p) => `<g ${S(p, 1.6)}><path d="M4 22 L4 4 L22 4"/><path d="M8 12 L12 8"/></g>` },
  { name: 'leaf', draw: (p) => `<g ${S(p, 1.6)}><path d="M4 20 Q6 6 20 4"/><path d="M9 11 Q12 8 14 11 Q12 14 9 11 Z"/></g>` },
  { name: 'spur', draw: (p) => `<g ${S(p, 1.6)}><path d="M4 18 L4 4 L18 4"/><path d="M4 4 L12 12"/></g>` },
]);

// ── CARTOUCHE FRAMES — the outer nameplate border (width/height parametric) ────
// A cartouche is a RARE, meaningful box (seal / plate / charter). Three vetted
// frame hands; the composer adds seeded corners + an inner emblem + a label slot.
export const CARTOUCHE_FRAMES = Object.freeze([
  { name: 'plate', draw: (p, w, h) =>
    `<rect x="3" y="3" width="${w - 6}" height="${h - 6}" rx="4" ${S(p)}/><rect x="7" y="7" width="${w - 14}" height="${h - 14}" rx="2" fill="none" stroke="${p.faint}" stroke-width="1"/>` },
  { name: 'charter', draw: (p, w, h) =>
    `<path d="M3 8 Q3 3 8 3 L${w - 8} 3 Q${w - 3} 3 ${w - 3} 8 L${w - 3} ${h - 8} Q${w - 3} ${h - 3} ${w - 8} ${h - 3} L8 ${h - 3} Q3 ${h - 3} 3 ${h - 8} Z" ${S(p)}/><path d="M12 ${h - 3} L12 3 M${w - 12} 3 L${w - 12} ${h - 3}" stroke="${p.faint}" stroke-width="1" fill="none"/>` },
  { name: 'seal', draw: (p, w, h) =>
    `<rect x="4" y="4" width="${w - 8}" height="${h - 8}" ${S(p)}/><path d="M4 10 L10 4 M${w - 10} 4 L${w - 4} 10 M4 ${h - 10} L10 ${h - 4} M${w - 10} ${h - 4} L${w - 4} ${h - 10}" stroke="${p.line}" stroke-width="1.6" fill="none" stroke-linecap="round"/>` },
]);

// ── THE HOUSE COMPASS ROSE — one canonical design (NOT seeded) ─────────────────
// The single house signature (viewBox 0 0 64 64): a ruled double ring, faint minor
// diagonals, an eight-point star, the inner cardinal star in the strong ink, and
// NORTH called out as a rubric-ink point (the apparatus marking the entry bearing).
export function compassRoseSvg(p) {
  const c = 32;
  const ring = `<circle cx="${c}" cy="${c}" r="30" fill="none" stroke="${p.faint}" stroke-width="1"/><circle cx="${c}" cy="${c}" r="27" fill="none" stroke="${p.line}" stroke-width="1.4"/>`;
  const minor = `<path d="M32 32 L45 19 M32 32 L45 45 M32 32 L19 45 M32 32 L19 19" stroke="${p.faint}" stroke-width="1" fill="none"/>`;
  const star = `<path d="M32 6 L36 28 L58 32 L36 36 L32 58 L28 36 L6 32 L28 28 Z" fill="${p.line}"/>`;
  const inner = `<path d="M32 14 L47 47 L32 39 L17 47 Z" fill="${p.strong}"/>`;
  const north = `<path d="M32 6 L36 28 L28 28 Z" fill="${p.rubric}"/><circle cx="32" cy="32" r="2.4" fill="${p.strong}"/>`;
  return `${ring}${minor}${star}${inner}${north}`;
}
