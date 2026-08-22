/**
 * domain/townMap/fabric/boundaryNoder.js — MF-T2D · THE BOUNDARY NODER.
 *
 * The arrangement stage `derivePlanarDcelEmbedding` requires and nothing app-side supplies. It
 * takes explicit boundary segments in ABI integer quanta and returns an atomically-noded
 * boundary set the landed kernel admits verbatim: proper crossings split at snapped
 * intersections, endpoint touches noded, collinear overlaps decomposed and deduplicated,
 * endpoints snapped to the first arrangement-quantum rung that nodes clean.
 *
 * Ported from the sealed W3 sandbox tip's `fabricDcel.js` (SHA-256
 * `01da024a8655ce9e468a75a53ffc49a4e28508d2d7a9400cbe2dbf1b6d81197b`, preserved in-repo at
 * `refs/preserve/map-sandbox-w3f-sealed`). The snap/split/dedupe passes, the uniform-grid pair
 * bucketing, the pass cap and the quantum ladder with its first-zero-residual walk arrive
 * unchanged. ⛔ The fabric-extraction half does NOT arrive: those record kinds have no app-side
 * producer, so this leaf takes EXPLICIT quanta and refuses everything else at the landed wall.
 *
 * ⭐⭐⭐ THE ONE DELIBERATE DIVERGENCE: THE CUT PREDICATE IS THE LANDED KERNEL'S OWN ADMISSION
 * PREDICATE, EXACT, INVERTED INTO CUTS — not the sandbox's float `properCross`. This is a
 * measured necessity rather than taste, and all four witness classes were EXECUTED against the
 * landed kernel before this file existed:
 *
 *   1. A T-JUNCTION — a stub ending ON another segment's interior. The sandbox letter reports
 *      `residual = 0` and leaves the run-through edge WHOLE; the landed kernel then THROWS
 *      `'DCEL boundaries must be atomically noded without crossings or overlaps'` on that
 *      output. A kerb ending at a wall IS this shape, so the letter cannot feed the kernel.
 *   2. A COLLINEAR OVERLAP — the landed float predicate answers `false` (parallel: its
 *      denominator is zero), no split, no count; the kernel THROWS the same message.
 *   3. AN EPS-BAND CROSSING — the landed predicate is float-PARAMETRIC with a `1e-9` band, and
 *      on the on-grid pair `a=[0,0] b=[9007199000,1000]` × `c=[1000,-1000] d=[-9007189000,
 *      9007198000]` the exact crossing parameter is `9000000 / 81129642832791000000`
 *      ≈ `1.109e-13` — strictly interior, but inside the band, so the predicate answers
 *      "not proper" and the letter leaves the pair un-split while the kernel refuses it.
 *   4. ⚠ A COLLINEAR OVERLAP THAT SHARES ONE ENDPOINT — the kernel's pairwise atomic check
 *      RETURNS EARLY on a single shared endpoint (that is what an abutment looks like), so this
 *      shape passes it and is refused further on by `'DCEL vertex has an angular tie'` instead.
 *      The endpoint-on-interior arm below is therefore tested with STRICT interiority rather
 *      than the kernel's inclusive `onSegment`, which is the only spelling that also cuts this
 *      fourth class. Measured: without it the kernel refuses, with it the kernel embeds.
 *
 * ⭐⭐ EXACT ARITHMETIC, AND THE REASON IS EXECUTED RATHER THAN INHERITED (preamble §P1 R-MF-2).
 * Orientation here is a product of coordinate DIFFERENCES at ABI scale, which leaves the safe
 * integer range: on witness 3's pair the denominator's true value is `81129642832791000000`
 * while the double carrying it holds `81129642832790994944` — an error of `5056`, four orders of
 * magnitude past `MAX_SAFE_INTEGER`. Every orientation sign below therefore accumulates in
 * BigInt and compares against `0n`, which is also what makes this predicate ALIGN with the
 * kernel's own exact check instead of merely resembling it. ⛔ The float estimate is used for
 * ONE thing only — the split POINT, which is snapped to the rung before publication and whose
 * error at wall scale is ~1 quantum against a half-rung tolerance of 500.
 *
 * ⚠ `residualProperCrossings` IS A TERMINAL-PASS FIGURE AND ITS NAME IS EXACT WHERE IT LANDS.
 * The loop ends when a pass plans no cuts, and every endpoint-on-interior violation ALWAYS
 * plans a cut (strict interiority guarantees the cut point is neither endpoint) — so the pairs
 * that survive to a no-cut pass are proper crossings whose snapped intersection had already
 * merged into both segments' existing endpoints. Only an input that exhausts the pass cap can
 * carry a touch in this figure; such an input is published with its residual honestly and the
 * kernel remains the fail-closed judge of it.
 *
 * ⛔ THE POST-SNAP WALL RE-VALIDATION IS DEFENSIVE VOCABULARY, and that finding is executed
 * rather than assumed. `MAX_WORLD_UNITS` is `9007199254`; snapped at the finest rung it lands
 * `9007199000`, INSIDE the wall, so no in-wall input can leave the wall at rung 1000. At rungs
 * 5000 and 25000 it lands `9007200000` — `746` past the wall, where the landed
 * `requireCanonicalInt` refuses and names its range. That coarse-rung path is real but is
 * reachable only behind an at-fine-rungs-un-nodable input, which no deterministic construction
 * here produces. ⛔ No test claims to reach it and no mutant targets it (ODQ §328.1); the
 * arithmetic above is its reason, and it stays as cheap defense because an emitted out-of-wall
 * coordinate would otherwise surface as a kernel refusal far from its cause.
 *
 * ⛔ NOTHING IS PERSISTED AND NOTHING IS SEALED. The published record is an in-memory derivation
 * result carrying NO `artifactKind` and NO `schemaVersion`: the sealed
 * `CADASTRAL_BOUNDARY_ARRANGEMENT` v1 artifact is a DIFFERENT shape under that same name, and a
 * second shape wearing it would be a second truth. The codex arrangement compiler is untouched.
 *
 * ⚠ THE LADDER IS OWNER TUNING SURFACE (ODQ §310.3(9)) AND NOTHING HERE CHOOSES A RUNG. The
 * triple and the pass cap are the sandbox's published values, carried verbatim; the rung used at
 * runtime is picked by the sandbox's own deterministic first-zero-residual rule and PUBLISHED as
 * data. No override parameter exists, deliberately.
 *
 * PURITY: pure. Integer and BigInt arithmetic plus the snapped float split estimate — no clock
 * read, no randomness, no locale ordering. ⚠ That vocabulary is named in the ABSTRACT on
 * purpose: the determinism companion scans this file's RAW TEXT, and a scan a docstring can
 * trigger is a scan someone widens to excuse the docstring.
 */

import { compareCodepoint } from '../../deterministicSort.js';
import { sceneDigest } from '../../townScene/stableScene.js';
import { segIntersect } from './exactGeometry.js';
import {
  FABRIC_COORDINATE_ABI,
  requireCanonicalId,
  requireCanonicalInt,
  requireCanonicalRecord,
} from './foundation.js';

/** @typedef {[number, number]} PointQ */
/** @typedef {{a:PointQ,b:PointQ,role:string,sourceId:string}} Segment */

/**
 * ⭐⭐ THE ARRANGEMENT QUANTUM LADDER, PORTED VERBATIM. The sandbox measured that snap-rounding
 * at the finest grid is a FIXED POINT rather than a budget — a split point rounded to one ABI
 * unit can land a hair on the wrong side and re-create the crossing it was meant to remove — and
 * that the residual is NOT monotone in the quantum, so no single fitted constant is defensible.
 * The declaration is therefore a ladder walked to the first rung that nodes clean, with the rung
 * PUBLISHED so a consumer reads it rather than trusting it. ⛔ Owner tuning surface: the values
 * are pinned by equality and no rung is chosen here.
 */
export const ARRANGEMENT_QUANTUM_LADDER = Object.freeze([1000, 5000, 25000]);

/** The sandbox's own pass bound, carried verbatim. Raising it was measured to change nothing. */
const MAX_NODING_PASSES = 14;

/** The single-leaf era's support record, exactly as the landed kernel demands it. */
const SURFACE_SUPPORT = Object.freeze({ kind: 'PLANAR_SURFACE', leafIndex: 0 });

/** @param {PointQ} point @returns {string} */
function pointKey(point) { return `${point[0]},${point[1]}`; }

/** @param {PointQ} left @param {PointQ} right @returns {number} */
function comparePoint(left, right) { return left[0] - right[0] || left[1] - right[1]; }

/** Exact orientation sign, in BigInt — see the header.
 *  @param {PointQ} a @param {PointQ} b @param {PointQ} c @returns {bigint} */
function orient(a, b, c) {
  return (BigInt(b[0]) - BigInt(a[0])) * (BigInt(c[1]) - BigInt(a[1]))
    - (BigInt(b[1]) - BigInt(a[1])) * (BigInt(c[0]) - BigInt(a[0]));
}

/** Is `p` inside `ab`'s bounding box? @param {PointQ} a @param {PointQ} b @param {PointQ} p */
function withinBox(a, b, p) {
  return p[0] >= Math.min(a[0], b[0]) && p[0] <= Math.max(a[0], b[0])
    && p[1] >= Math.min(a[1], b[1]) && p[1] <= Math.max(a[1], b[1]);
}

/** Is `p` a point of `ab`'s STRICT interior — collinear, in range, and neither endpoint?
 *  @param {PointQ} a @param {PointQ} b @param {PointQ} p */
function onInterior(a, b, p) {
  if (pointKey(p) === pointKey(a) || pointKey(p) === pointKey(b)) return false;
  return orient(a, b, p) === 0n && withinBox(a, b, p);
}

/** A STRICTLY interior crossing by four exact sign tests — no epsilon band.
 *  @param {Segment} s @param {Segment} t */
function properlyCrosses(s, t) {
  const abC = orient(s.a, s.b, t.a); const abD = orient(s.a, s.b, t.b);
  const cdA = orient(t.a, t.b, s.a); const cdB = orient(t.a, t.b, s.b);
  return ((abC < 0n && abD > 0n) || (abC > 0n && abD < 0n))
    && ((cdA < 0n && cdB > 0n) || (cdA > 0n && cdB < 0n));
}

/** @param {Map<number,PointQ[]>} cuts @param {number} index @param {PointQ} point */
function addCut(cuts, index, point) {
  const held = cuts.get(index);
  if (held) held.push(point); else cuts.set(index, [point]);
}

/**
 * Decide ONE pair with the kernel's admission rule inverted, registering the cuts that would
 * clear it. Returns whether the pair violates the rule, so the caller can count the residual.
 * @param {Segment} s @param {Segment} t @param {number} i @param {number} j
 * @param {Map<number,PointQ[]>} cuts @param {(value:number)=>number} snap
 */
function planCuts(s, t, i, j, cuts, snap) {
  let violates = false;
  for (const [index, seg, other] of /** @type {Array<[number,Segment,Segment]>} */ ([[i, s, t], [j, t, s]])) {
    for (const endpoint of [other.a, other.b]) {
      if (!onInterior(seg.a, seg.b, endpoint)) continue;
      violates = true;
      addCut(cuts, index, endpoint);
    }
  }
  if (!properlyCrosses(s, t)) return violates;
  const hit = segIntersect(s.a, s.b, t.a, t.b);
  if (hit === null) return true;
  const cut = /** @type {PointQ} */ ([snap(hit[0]), snap(hit[1])]);
  for (const [index, seg] of /** @type {Array<[number,Segment]>} */ ([[i, s], [j, t]])) {
    if (pointKey(cut) === pointKey(seg.a) || pointKey(cut) === pointKey(seg.b)) continue;
    addCut(cuts, index, cut);
  }
  return true;
}

/** The ported uniform-grid cell: the mean manhattan extent, so pair work stays local.
 *  @param {Segment[]} segs */
function gridCell(segs) {
  if (!segs.length) return 1;
  let sum = 0;
  for (const s of segs) sum += Math.abs(s.b[0] - s.a[0]) + Math.abs(s.b[1] - s.a[1]);
  return Math.max(1, Math.round(sum / segs.length));
}

/** @param {Segment[]} segs @param {number} cell @returns {Map<string,number[]>} */
function bucketSegments(segs, cell) {
  /** @type {Map<string,number[]>} */ const grid = new Map();
  segs.forEach((s, index) => {
    const lox = Math.floor(Math.min(s.a[0], s.b[0]) / cell);
    const hix = Math.floor(Math.max(s.a[0], s.b[0]) / cell);
    const loy = Math.floor(Math.min(s.a[1], s.b[1]) / cell);
    const hiy = Math.floor(Math.max(s.a[1], s.b[1]) / cell);
    for (let gy = loy; gy <= hiy; gy += 1) {
      for (let gx = lox; gx <= hix; gx += 1) {
        const key = `${gx}|${gy}`;
        const held = grid.get(key);
        if (held) held.push(index); else grid.set(key, [index]);
      }
    }
  });
  return grid;
}

/** Cut one segment at its planned points, ordered along its dominant axis (ported).
 *  @param {Segment} s @param {PointQ[]} list @returns {Segment[]} */
function applyCuts(s, list) {
  const along = (/** @type {PointQ} */ p) => (
    Math.abs(s.b[0] - s.a[0]) >= Math.abs(s.b[1] - s.a[1])
      ? (p[0] - s.a[0]) / ((s.b[0] - s.a[0]) || 1)
      : (p[1] - s.a[1]) / ((s.b[1] - s.a[1]) || 1));
  const points = [s.a, ...list, s.b]
    .filter((p, index, all) => all.findIndex((z) => pointKey(z) === pointKey(p)) === index)
    .sort((p, q) => along(p) - along(q));
  /** @type {Segment[]} */ const out = [];
  for (let k = 0; k + 1 < points.length; k += 1) {
    if (pointKey(points[k]) === pointKey(points[k + 1])) continue;
    out.push({ ...s, a: points[k], b: points[k + 1] });
  }
  return out;
}

/**
 * ⭐ ONE NODING ATTEMPT AT ONE RUNG. Both endpoints and every cut live on the same grid, or the
 * arrangement is not on a grid at all — snapping only the split points puts a node OFF the
 * segment it was meant to lie on, which is a new crossing manufactured by the repair.
 * @param {Segment[]} raw @param {number} quantum
 */
function nodeAtQuantum(raw, quantum) {
  const snap = (/** @type {number} */ value) => Math.round(value / quantum) * quantum;
  let segs = raw.map((s) => ({
    ...s,
    a: /** @type {PointQ} */ ([snap(s.a[0]), snap(s.a[1])]),
    b: /** @type {PointQ} */ ([snap(s.b[0]), snap(s.b[1])]),
  })).filter((s) => s.a[0] !== s.b[0] || s.a[1] !== s.b[1]);
  for (const s of segs) {
    for (const [label, value] of [['a[0]', s.a[0]], ['a[1]', s.a[1]], ['b[0]', s.b[0]], ['b[1]', s.b[1]]]) {
      requireCanonicalInt(value, `snapped segment ${label}`);
    }
  }
  let splits = 0; let passes = 0; let residual = 0;
  for (; passes < MAX_NODING_PASSES; passes += 1) {
    /** @type {Map<number,PointQ[]>} */ const cuts = new Map();
    residual = 0;
    const grid = bucketSegments(segs, gridCell(segs));
    const seen = new Set();
    for (const bucket of grid.values()) {
      for (let x = 0; x < bucket.length; x += 1) {
        for (let y = x + 1; y < bucket.length; y += 1) {
          const i = bucket[x]; const j = bucket[y];
          const pair = i < j ? `${i}:${j}` : `${j}:${i}`;
          if (seen.has(pair)) continue;
          seen.add(pair);
          if (planCuts(segs[i], segs[j], i, j, cuts, snap)) residual += 1;
        }
      }
    }
    if (!cuts.size) break;
    /** @type {Segment[]} */ const next = [];
    segs.forEach((s, index) => {
      const list = cuts.get(index);
      if (!list || !list.length) { next.push(s); return; }
      const cut = applyCuts(s, list);
      splits += cut.length;
      next.push(...cut);
    });
    segs = next;
  }
  /** @type {Map<string,Segment>} */ const byKey = new Map();
  let duplicates = 0;
  for (const s of segs) {
    const ka = pointKey(s.a); const kb = pointKey(s.b);
    const key = ka < kb ? `${ka}~${kb}` : `${kb}~${ka}`;
    if (byKey.has(key)) { duplicates += 1; continue; }
    byKey.set(key, s);
  }
  return { segments: [...byKey.values()], passes: passes + 1, residual, splits, duplicates, quantum };
}

/** @param {unknown} value @param {string} label @returns {PointQ} */
function requirePointQ(value, label) {
  if (!Array.isArray(value) || value.length !== 2) throw new TypeError(`${label} must be an [x,z] point`);
  return [requireCanonicalInt(value[0], `${label}[0]`), requireCanonicalInt(value[1], `${label}[1]`)];
}

/** Lineage labels are canonical non-empty strings. ⛔ The vocabulary is deliberately NOT closed:
 *  the codex's two roles and the sandbox's four disagree, the kernel reads neither, and closing
 *  it belongs to the tranche that ports the fabric extraction.
 *  @param {unknown} value @param {string} label @returns {string} */
function requireLabel(value, label) {
  if (typeof value !== 'string' || value.length === 0) {
    throw new TypeError(`${label} must be a non-empty string`);
  }
  return value;
}

/**
 * Node explicit ABI-quanta boundary segments into a set the landed planar embedder admits.
 * @param {{settlementId:string,segments:Array<{a:PointQ,b:PointQ,role:string,sourceId:string}>}} input
 */
export function nodeBoundarySegments(input) {
  const source = requireCanonicalRecord(input, 'boundary noder input');
  const settlementId = requireCanonicalId(source.settlementId, 'boundary noder input.settlementId');
  if (!Array.isArray(source.segments)) {
    throw new TypeError('boundary noder input.segments must be an array');
  }
  /** @type {Segment[]} */
  const segments = source.segments.map((raw, index) => {
    const segment = requireCanonicalRecord(raw, `segments[${index}]`);
    return {
      a: requirePointQ(segment.a, `segments[${index}].a`),
      b: requirePointQ(segment.b, `segments[${index}].b`),
      role: requireLabel(segment.role, `segments[${index}].role`),
      sourceId: requireLabel(segment.sourceId, `segments[${index}].sourceId`),
    };
  });
  // ⭐⭐ THE LADDER IS WALKED, NOT GUESSED. The first rung that nodes to ZERO wins; if none does,
  // the FINEST attempt is kept — a coarser arrangement that is still not planar buys nothing and
  // would hide the defect behind a grid nobody asked for. ⚠ Keeping the finest is the half that
  // is easy to lose: falling through to the LAST attempt would publish the coarsest grid on
  // exactly the inputs that failed, which is the opposite of the ported rule.
  let noded = nodeAtQuantum(segments, ARRANGEMENT_QUANTUM_LADDER[0]);
  if (noded.residual !== 0) {
    for (let rung = 1; rung < ARRANGEMENT_QUANTUM_LADDER.length; rung += 1) {
      const attempt = nodeAtQuantum(segments, ARRANGEMENT_QUANTUM_LADDER[rung]);
      if (attempt.residual === 0) { noded = attempt; break; }
    }
  }
  const boundaries = noded.segments.map((s) => {
    const geometry = comparePoint(s.a, s.b) < 0 ? [s.a, s.b] : [s.b, s.a];
    const frozen = Object.freeze([Object.freeze(geometry[0]), Object.freeze(geometry[1])]);
    return Object.freeze({
      boundaryId: requireCanonicalId(`cadastral-boundary:${sceneDigest({
        coordinateAbiVersion: FABRIC_COORDINATE_ABI, settlementId, geometry: frozen,
      })}`, 'boundaryId'),
      role: s.role,
      sourceId: s.sourceId,
      support: SURFACE_SUPPORT,
      geometry: frozen,
    });
  }).sort((left, right) => compareCodepoint(left.boundaryId, right.boundaryId));
  return Object.freeze({
    coordinateAbiVersion: FABRIC_COORDINATE_ABI,
    settlementId,
    boundaries: Object.freeze(boundaries),
    rawSegmentCount: segments.length,
    arrangementQuantum: noded.quantum,
    arrangementQuantumLadder: ARRANGEMENT_QUANTUM_LADDER,
    nodingPasses: noded.passes,
    residualProperCrossings: noded.residual,
    splitCount: noded.splits,
    duplicatesDropped: noded.duplicates,
  });
}
