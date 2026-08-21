/**
 * domain/townMap/fabric/terraform.js — §161b THE VISIBLE WORK.
 *
 * ⭐⭐ "STRAIN RENDERS AS WORK. A hard reconciliation SHOWS ITS EFFORT — switchbacks,
 * terraces, retaining walls, breakwaters, stilts, rock-cut quay ramps — in the §161b
 * visible-work idiom. A settlement that reconciled three fighting facts LOOKS LIKE A PLACE
 * THAT FOUGHT FOR ITS GROUND." (§5.-1c.)
 *
 * ⛔ AND UNTIL NOW NOTHING DREW IT. MF-B1's §9 and MF-B1b's §6.5 both record the same
 * outstanding item in the same words: `sub.works` is DERIVED and CARRIED and **nothing
 * draws them**. The strain strings existed, the reconciliation reason printed them in the
 * cartouche, and the drawing said nothing — which is the §8.2 failure mode exactly
 * backwards: not decoration with no source, but a SOURCE WITH NO EXPRESSION. A fact the
 * dossier asserts, the deriver records, and the map declines to show is a fact the reader
 * has no way to learn.
 *
 * ⭐ EVERY WORK IS SITED ON THE GROUND THAT DEMANDED IT. That is what separates this from
 * dressing: a ditch grid is drawn on the WET cells, a switchback on the STEEP approach, a
 * mill race between the watercourse and the mill that needs it, a quay ramp where the town
 * meets deep water. If the substrate offers no ground that justifies the work, the work is
 * NOT DRAWN and the omission is recorded — a breakwater on a dry hillside would be worse
 * than no breakwater at all.
 *
 * ⭐ THEY ARE LINES, NEVER FILLS (§9.5b's own rule for the relief pass, which this joins).
 * A drafted engineering work is drawn in the same hand as a hachure.
 *
 * PURITY: no Date, no Math.random, no runtime trig, no localeCompare.
 */

import { hashUnit } from './fabricRng.js';
import { TRIG_N, cosI, sinI } from './fabricGeometry.js';
import { VIEW, sampleAt } from './substrate.js';

/**
 * WHICH GROUND EACH STRAINED CONSTRAINT'S WORK NEEDS, and what it draws. Every row is the
 * §161b idiom made mechanical: `needs` is the predicate the ground must satisfy, `kind` is
 * the mark family the lens draws.
 * @type {Readonly<Record<string, { kind: string, needs: string, why: string }>>}
 */
export const WORK_GROUND = Object.freeze({
  relief:   { kind: 'switchback', needs: 'steep', why: 'a road that cannot climb straight climbs across' },
  tillage:  { kind: 'terrace', needs: 'steep', why: 'strips held on a slope by retaining walls' },
  marsh:    { kind: 'ditch', needs: 'wet', why: 'a drainage grid cut through standing water' },
  river:    { kind: 'race', needs: 'water', why: 'a cut race and a revetted bank' },
  mill:     { kind: 'race', needs: 'water', why: 'a leat drawn off the stream to the wheel' },
  landing:  { kind: 'ramp', needs: 'water', why: 'a stepped landing and its causeway' },
  port:     { kind: 'ramp', needs: 'water', why: 'a rock-cut quay ramp down to deep water' },
  sea:      { kind: 'mole', needs: 'water', why: 'a breakwater mole against the open water' },
  shore:    { kind: 'mole', needs: 'water', why: 'a revetted strand and hauling ramps' },
  stone:    { kind: 'quarry', needs: 'steep', why: 'a quarried scar and rock-cut faces' },
  ore:      { kind: 'quarry', needs: 'steep', why: 'adits and spoil ground on the workable slope' },
  defensible: { kind: 'scarp', needs: 'any', why: 'a cut ditch and a banked scarp' },
  arid:     { kind: 'qanat', needs: 'any', why: 'a cistern line and shade walls' },
  open:     { kind: 'scarp', needs: 'any', why: 'a levelled and revetted terrace' },
});

/**
 * @typedef {Object} Work
 * @property {string} constraint
 * @property {string} kind
 * @property {Array<Array<[number,number]>>} lines
 * @property {string} reason
 */

/**
 * Derive the drawn works.
 *
 * @param {Object} args
 * @param {import('./substrate.js').Substrate} args.sub
 * @param {Array<{ constraint:string, work:string }>} args.works   the substrate's strain list
 * @param {{ kind:string|null, line:Array<[number,number]>|null }} args.water
 * @param {(x:number,y:number)=>boolean} args.inTown
 * @param {{x:number,y:number}} args.centre
 * @param {number} args.extent
 * @param {number} args.accentBand
 * @param {{ seed: string|number, variant?: number }} args.seeding
 * @returns {{ works: Work[], marks: number, skipped: string[], reason: string }}
 */
export function buildWorks(args) {
  const { sub, works, water, inTown, centre, extent, accentBand, seeding } = args;
  const key = `${String(seeding.seed)}|works`;
  /** @type {Work[]} */ const out = [];
  /** @type {string[]} */ const skipped = [];
  let marks = 0;

  // The accent ration applies here as everywhere (§9.3): a strained settlement shows its
  // effort, it does not become a diagram of civil engineering.
  const budget = Math.max(2, Math.round(9 * accentBand));

  for (const w of (works || [])) {
    const row = WORK_GROUND[w.constraint];
    if (!row) { skipped.push(`${w.constraint}: no drawn work defined for this constraint — RECORDED`); continue; }
    const site = findGround(sub, row.needs, water, inTown, centre, extent, `${key}|${w.constraint}`);
    if (!site) {
      // ⛔ NO GROUND, NO WORK. Drawing a breakwater where there is no water, or a switchback
      // on a floodplain, would put an engineering fiction on a surveyor's document.
      skipped.push(`${w.constraint}: the substrate offers no ${row.needs} ground to justify '${row.why}' — NOT DRAWN, recorded`);
      continue;
    }
    const lines = drawWork(row.kind, site, sub, water, budget, `${key}|${w.constraint}|draw`);
    if (!lines.length) { skipped.push(`${w.constraint}: site found but no legal mark fitted — RECORDED`); continue; }
    marks += lines.length;
    out.push({ constraint: w.constraint, kind: row.kind, lines, reason: `${row.why} — sited on ${row.needs} ground at ${Math.round(site.x)},${Math.round(site.y)}` });
  }

  return {
    works: out,
    marks,
    skipped,
    reason: out.length
      ? `${out.length} strain work(s) DRAWN (${marks} marks): ${out.map((w) => w.kind).join(', ')}`
      : 'no strain to draw — every forced fact is native to this landform',
  };
}

/** Find ground that justifies a work. Scans a bounded seeded sample rather than the whole
 * grid: a work needs A site, not the best one, and the sample keeps the pass cheap. */
function findGround(sub, needs, water, inTown, centre, extent, key) {
  if (needs === 'water') {
    if (!water || !water.line || !water.line.length) return null;
    // The reach of water NEAREST the settlement — a town's quay is the water it can use.
    let best = null, bestD = Infinity;
    for (const p of water.line) {
      const d = (p[0] - centre.x) * (p[0] - centre.x) + (p[1] - centre.y) * (p[1] - centre.y);
      if (d < bestD) { bestD = d; best = p; }
    }
    return best ? { x: best[0], y: best[1] } : null;
  }
  let best = null, bestScore = -Infinity;
  for (let i = 0; i < 96; i++) {
    const a = Math.floor(hashUnit(`${key}|a|${i}`) * TRIG_N);
    const r = extent * (0.7 + hashUnit(`${key}|r|${i}`) * 1.9);
    const x = centre.x + cosI(a) * r, y = centre.y + sinI(a) * r;
    if (x < 30 || y < 30 || x > VIEW - 30 || y > VIEW - 30) continue;
    if (inTown(x, y)) continue;
    const slope = sampleAt(sub, sub.slope, x, y);
    const wet = sampleAt(sub, sub.wet, x, y);
    let score;
    if (needs === 'steep') score = slope > 0.34 ? slope : -1;
    else if (needs === 'wet') score = wet > 0.52 ? wet : -1;
    else score = 1 - Math.abs(slope - 0.3);
    if (score > bestScore) { bestScore = score; best = { x, y }; }
  }
  return bestScore > 0 ? best : null;
}

/** Draw one work as LINES in its own idiom. */
function drawWork(kind, site, sub, water, budget, key) {
  /** @type {Array<Array<[number,number]>>} */ const lines = [];
  const n = Math.max(2, Math.min(budget, 7));
  const ang = Math.floor(hashUnit(`${key}|ang`) * TRIG_N);
  const ca = cosI(ang), sa = sinI(ang);

  if (kind === 'switchback') {
    // A zig-zag climbing across the slope — the road that cannot go straight up.
    /** @type {Array<[number,number]>} */ const zz = [];
    for (let i = 0; i <= n * 2; i++) {
      const t = i / (n * 2);
      const side = i % 2 === 0 ? -1 : 1;
      zz.push([site.x + ca * t * 90 + (-sa) * side * 22, site.y + sa * t * 90 + ca * side * 22]);
    }
    lines.push(zz);
  } else if (kind === 'terrace' || kind === 'scarp') {
    // Stacked retaining lines across the contour.
    for (let i = 0; i < n; i++) {
      const off = (i - (n - 1) / 2) * 13;
      lines.push([
        [site.x + ca * -40 + (-sa) * off, site.y + sa * -40 + ca * off],
        [site.x + ca * 40 + (-sa) * off, site.y + sa * 40 + ca * off],
      ]);
    }
  } else if (kind === 'ditch') {
    // A DRAINAGE GRID — the one work that is legibly a grid, because that is what it was.
    for (let i = 0; i < n; i++) {
      const off = (i - (n - 1) / 2) * 17;
      lines.push([[site.x + ca * -46 + (-sa) * off, site.y + sa * -46 + ca * off],
        [site.x + ca * 46 + (-sa) * off, site.y + sa * 46 + ca * off]]);
      lines.push([[site.x + (-sa) * -46 + ca * off, site.y + ca * -46 + sa * off],
        [site.x + (-sa) * 46 + ca * off, site.y + ca * 46 + sa * off]]);
    }
  } else if (kind === 'race') {
    // A LEAT: a straight cut leaving the watercourse and running back to it — the one
    // shape that says "this water was made to work".
    if (!water || !water.line || water.line.length < 4) return lines;
    const i0 = Math.floor(hashUnit(`${key}|i0`) * (water.line.length - 4));
    const a = water.line[i0], b = water.line[Math.min(water.line.length - 1, i0 + 4)];
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const l = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = -dy / l, ny = dx / l;
    lines.push([[a[0], a[1]], [mx + nx * 26, my + ny * 26], [b[0], b[1]]]);
  } else if (kind === 'ramp' || kind === 'mole') {
    // A ramp runs INTO the water; a mole runs ALONG it. Both start on the shore.
    const len = kind === 'mole' ? 62 : 34;
    lines.push([[site.x, site.y], [site.x + ca * len, site.y + sa * len]]);
    lines.push([[site.x + (-sa) * 5, site.y + ca * 5],
      [site.x + ca * len + (-sa) * 5, site.y + sa * len + ca * 5]]);
  } else if (kind === 'quarry') {
    // A quarried face: a stepped arc bitten out of the hillside.
    /** @type {Array<[number,number]>} */ const arc = [];
    for (let i = 0; i <= 6; i++) {
      const a2 = ang + Math.round((i - 3) * (TRIG_N / 26));
      arc.push([site.x + cosI(a2) * 34, site.y + sinI(a2) * 34]);
    }
    lines.push(arc);
    for (let i = 0; i < 3; i++) {
      const a2 = ang + Math.round((i - 1) * (TRIG_N / 30));
      lines.push([[site.x + cosI(a2) * 34, site.y + sinI(a2) * 34],
        [site.x + cosI(a2) * 20, site.y + sinI(a2) * 20]]);
    }
  } else if (kind === 'qanat') {
    // A cistern line: a run of shaft rings, drawn as short cross ticks.
    for (let i = 0; i < n; i++) {
      const t = (i / Math.max(1, n - 1) - 0.5) * 96;
      lines.push([[site.x + ca * t + (-sa) * 4, site.y + sa * t + ca * 4],
        [site.x + ca * t + (-sa) * -4, site.y + sa * t + ca * -4]]);
    }
  }
  void sub;
  return lines;
}
