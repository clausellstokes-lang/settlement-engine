/**
 * domain/townMap/fabric/folioLenses.js — MF-4 · THE SIX FOLIO LENSES OVER THE TEN-ROLE
 * ARCHITECTURE (§2.5, §9.7).
 *
 * ⭐⭐ THE ARCHITECTURE IS THE TEN ROLES; THE LENSES ARE INSTANCES OF IT. §2.5: "every lens
 * is a ten-role scheme (Paper/Ink/Roofs/Water/Greens/Roads/Walls/Trees/Labels/Elements); our
 * six lenses re-express over this architecture." So this module holds ONE shape — a role
 * table — six times, plus the small number of NON-COLOUR facts a lens legitimately changes
 * (ink weight, accent ration, whether hue or pattern carries category). Nothing here decides
 * geometry; a lens is a treatment of one drawing.
 *
 * ⭐ THE LENS IDS ARE FROZEN (MF-R1's lens contract, §9.7). `mapEdits.styleLens` rides the
 * persisted blob and an unknown id silently coerces to parchment on old saves, so the six
 * ids — parchment / watercolor / darkFantasy / vtt / accessible / illustrated — are the
 * contract. LABELS are free; ids are not. `resolveLens` therefore never throws and never
 * invents: an unknown id degrades to parchment and SAYS SO in `resolved.fallback`, which is
 * the degradation law applied to presentation.
 *
 * ⭐⭐ THE BINDING SUB-LAW IS ENFORCED HERE, NOT HOPED FOR (§9.7). "ROADS ARE THE PALEST ROLE
 * ON THE PAGE and ROOFS sit at least three value steps darker — the street reads as street
 * by VALUE CONTRAST, not outline." That is a testable property of a role table, so
 * `lensContrast()` computes it and a pin asserts it on all six. A lens that fails it is a
 * lens whose streets do not read, and no amount of geometry fixes that.
 *
 * ⛔ AND THE NIGHT LENS IS A PIGMENT SCHEME, NOT AN INVERSION (§9.7, hf5). Inverting the
 * parchment table gives a photographic negative: pale roofs on dark paper, with the value
 * ORDER reversed so the roads become the darkest role and the street stops reading. hf5's
 * night plate keeps the SAME hierarchy in a night palette — the paper is a deep blue-grey
 * ground, the roads still the palest thing on it, the ink still darker than everything. The
 * table below is built that way and `lensContrast` proves it on the same terms as the day
 * lenses, which is exactly why the law was worth making computable.
 *
 * ⭐ ACCESSIBLE'S PATTERNS ARE OP-LEVEL GEOMETRY (§9.7's own note, and TC29's §0.0
 * resolution): "patterns replace hue" means REAL HATCH GEOMETRY — a category is carried by
 * the direction and pitch of ruled lines, the way a hand-coloured plate distinguished its
 * washes for a printer who had no colour. That is drawn ink, so it costs ops, so it is
 * rationed like every other accent and declared here rather than in the lens's colours.
 *
 * PURITY: pure data + pure functions. No Date, no Math.random, no runtime trig.
 */

/** The ten roles, in the order §2.5 measured them. The one home for the vocabulary. */
export const ROLES = Object.freeze([
  'paper', 'ink', 'roofs', 'water', 'greens', 'roads', 'walls', 'trees', 'labels', 'elements',
]);

/** The frozen persisted ids (MF-R1 lens contract). Order is the UI's; ids are the law. */
export const LENS_IDS = Object.freeze([
  'parchment', 'watercolor', 'darkFantasy', 'vtt', 'accessible', 'illustrated',
]);

/**
 * ⭐ THE SIX TABLES. Every one is a complete ten-role scheme — no lens inherits a role from
 * another, because a partially-specified lens is how a role silently keeps the previous
 * lens's colour and nobody notices until it is on a customer's screen.
 *
 * `ink` is a WEIGHT MULTIPLIER on the §9.1 hierarchy, not a colour: §9.1 owns lineweight and
 * §2.5 owns hue (the role/weight split MF-R1 recorded), so a lens that lightens its ink one
 * step does it here as 0.85 rather than by mixing the ink colour toward the paper.
 * `accent` multiplies the tier's own accent band (§9.3's ration).
 * `pattern` = category is carried by HATCH rather than by hue (§9.7 Accessible).
 * `washForward` = the wash carries more of the drawing and the ink steps back (Watercolor).
 */
export const LENSES = Object.freeze({
  parchment: {
    label: 'Parchment', night: false, ink: 1.00, accent: 1.00, pattern: false, washForward: false,
    roles: {
      paper: '#E9DEC3', ink: '#2B2118', roofs: '#8A5F3A', water: '#7E8E97', greens: '#9FA47A',
      roads: '#F3EBD6', walls: '#241B12', trees: '#61704A', labels: '#3E2C18', elements: '#EFE5CC',
    },
  },
  watercolor: {
    // §9.7: "wash-forward, ink lightened one step (never dissolved)". The ink WEIGHT drops;
    // the ink COLOUR does not, because a dissolved ink is the flat-mosaic failure the chair
    // convicted at MF-B1 wearing a different name.
    label: 'Watercolour', night: false, ink: 0.82, accent: 1.10, pattern: false, washForward: true,
    roles: {
      paper: '#F1E8D2', ink: '#3A2C20', roofs: '#A9714A', water: '#8FA3AE', greens: '#AEB489',
      roads: '#FAF3E2', walls: '#33261A', trees: '#6E7F52', labels: '#4A3520', elements: '#F6EDD9',
    },
  },
  darkFantasy: {
    // ⭐ hf5's NIGHT PIGMENT: the same hierarchy in a night palette. Roads stay the palest
    // role; roofs stay many steps darker; the paper is a deep ground rather than white
    // inverted. See the header for why an inversion would break the street.
    label: 'Night Pigment', night: true, ink: 1.05, accent: 0.90, pattern: false, washForward: false,
    roles: {
      paper: '#1E2430', ink: '#05070B', roofs: '#2E2A33', water: '#16202E', greens: '#26302B',
      roads: '#6E7486', walls: '#04060A', trees: '#1D2A22', labels: '#C9C2AE', elements: '#2A313E',
    },
  },
  vtt: {
    // §9.7: "ink structure at TABLE CONTRAST, washes muted for tokens." A VTT map is looked
    // at from a metre away with plastic figures standing on it, so the structure has to
    // survive at a glance and the fills must not compete with a token's own colour.
    label: 'Virtual Table', night: false, ink: 1.30, accent: 0.72, pattern: false, washForward: false,
    roles: {
      paper: '#EDE7DA', ink: '#15130F', roofs: '#9C9184', water: '#93A6B2', greens: '#B4BBA4',
      roads: '#FBF7EE', walls: '#0C0A08', trees: '#7C8B6C', labels: '#15130F', elements: '#F2EDE1',
    },
  },
  accessible: {
    // §9.7: "maximum-contrast ink hierarchy, patterns replace hue." The roles collapse toward
    // a near-monochrome value ladder ON PURPOSE — hue is carrying nothing here, so it is the
    // VALUE that must do all the work, and the hatch geometry carries category.
    label: 'High Contrast', night: false, ink: 1.45, accent: 0.80, pattern: true, washForward: false,
    roles: {
      paper: '#FFFFFF', ink: '#000000', roofs: '#8C8C8C', water: '#C8D2DA', greens: '#E2E2E2',
      roads: '#FFFFFF', walls: '#000000', trees: '#A8A8A8', labels: '#000000', elements: '#F2F2F2',
    },
  },
  illustrated: {
    // §9.7: "accent budget raised one band, NEVER PAST THE RATION LAW." The multiplier is
    // 1.35 and the ration still clamps it — a lens may spend more of the budget, never more
    // than the budget.
    label: 'Illustrated', night: false, ink: 1.00, accent: 1.35, pattern: false, washForward: false,
    roles: {
      paper: '#EBDFC0', ink: '#2A1E14', roofs: '#96603A', water: '#71879A', greens: '#93A06F',
      roads: '#F7F0DC', walls: '#20160E', trees: '#54683F', labels: '#5A2B1E', elements: '#F1E7CD',
    },
  },
});

/**
 * ⭐ THE ACCESSIBLE HATCH VOCABULARY — REAL GEOMETRY, per TC29's §0.0 resolution.
 *
 * Each character class gets an ANGLE (as an index into the frozen 64-step trig table, so no
 * runtime trig) and a PITCH in plot frontages. The classes are the parcel `character`
 * vocabulary the fabric already carries, so this table cannot drift away from the drawing:
 * a character with no row hatches at the default, and a character that stops existing takes
 * its row with it.
 * ⚠ THE PITCHES ARE COARSE ON PURPOSE. Hatch finer than about a third of a frontage merges
 * into a flat tone at plan scale, which is the failure this lens exists to avoid.
 */
export const HATCH = Object.freeze({
  residential: { ang: 0, pitch: 0 },            // pitch 0 = UNHATCHED: the matrix is the ground
  merchant: { ang: 8, pitch: 0.55 },            // 45°
  craft: { ang: 24, pitch: 0.55 },              // 135°
  industrial: { ang: 0, pitch: 0.40 },          // horizontal, tight
  noble: { ang: 16, pitch: 0.75 },              // vertical, open
  civic: { ang: 8, pitch: 0.40 },
  religious: { ang: 16, pitch: 0.40 },
  criminal: { ang: 24, pitch: 0.40 },
  military: { ang: 0, pitch: 0.55 },
  foreign: { ang: 12, pitch: 0.62 },
  arcane: { ang: 20, pitch: 0.62 },
  other: { ang: 8, pitch: 0.75 },
});

/** sRGB → relative luminance, the WCAG definition. Pure arithmetic; no colour library. */
export function luminance(hex) {
  const v = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
}

/**
 * ⭐⭐ THE §9.7 BINDING SUB-LAW, MADE COMPUTABLE. "Roads are the palest role on the page and
 * roofs sit at least three value steps darker."
 *
 * On a NIGHT lens "palest" is read as "the highest-luminance role among the ground roles" —
 * the law is about VALUE CONTRAST between the street and what stands on it, and that survives
 * a night palette exactly. The step is defined as a contrast ratio, so the same number means
 * the same thing on cream paper and on a blue-black ground.
 *
 * @param {string} id
 * @returns {{ roadsPalest:boolean, steps:number, roadL:number, roofL:number, paperL:number }}
 */
export function lensContrast(id) {
  const lens = LENSES[id] || LENSES.parchment;
  const r = lens.roles;
  const roadL = luminance(r.roads), roofL = luminance(r.roofs), paperL = luminance(r.paper);
  // The ground roles the street competes with. Ink and walls are LINES, not ground, so they
  // are excluded — a wall darker than the road is the whole point of the ink hierarchy.
  const ground = ['paper', 'roofs', 'water', 'greens', 'trees', 'elements'];
  let maxOther = 0;
  for (const k of ground) { const l = luminance(r[k]); if (l > maxOther) maxOther = l; }
  const ratio = (roadL + 0.05) / (roofL + 0.05);
  // "Three value steps" read as a contrast ratio: each step ≈ 1.28×, so three ≈ 2.1×.
  return {
    roadsPalest: roadL >= maxOther - 1e-9,
    steps: ratio,
    roadL,
    roofL,
    paperL,
  };
}

/**
 * Resolve a persisted lens id to its treatment.
 * ⚠ NEVER THROWS AND NEVER INVENTS: an unknown id (an old save, a bespoke skin, a future
 * lens rolled back) degrades to parchment and reports the fallback, per the lens contract.
 * @param {string|null|undefined} id
 * @returns {{ id:string, fallback:boolean, label:string, night:boolean, ink:number, accent:number, pattern:boolean, washForward:boolean, roles:Record<string,string> }}
 */
export function resolveLens(id) {
  const key = typeof id === 'string' && LENSES[id] ? id : 'parchment';
  const lens = LENSES[key];
  return {
    id: key,
    fallback: key !== id && id != null,
    label: lens.label,
    night: lens.night,
    ink: lens.ink,
    accent: lens.accent,
    pattern: lens.pattern,
    washForward: lens.washForward,
    roles: lens.roles,
  };
}

/**
 * §12.3: walk-scale rings are "off by default on lenses where they fight legibility (VTT)".
 * One home for every such per-lens suppression, so a new immersion mark declares its lens
 * behaviour in the same place rather than growing a second dial.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const LENS_SUPPRESSES = Object.freeze({
  vtt: ['walkRings', 'marginalia', 'pentimento'],
  // ⚠ ACCESSIBLE KEEPS ITS TEXT. A high-contrast lens is the one a reader most needs the
  // legend and the marginalia on; what it suppresses is the near-invisible ghost, which is
  // an accent defined by being hard to see.
  accessible: ['pentimento'],
});

/** Is this immersion mark drawn on this lens? */
export function lensAllows(lensId, mark) {
  const list = LENS_SUPPRESSES[lensId];
  return !list || !list.includes(mark);
}
