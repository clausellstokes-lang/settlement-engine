/**
 * domain/townMap/lynchRubric.js — the town-layout SELF-SCORING RUBRIC (task #38).
 *
 * The v2 layout engine (townLayoutV2.js) generates several candidate arrangements
 * from a seeded fork and RATES each before acceptance, inside a bounded-retry loop.
 * The rubric is Kevin Lynch's five imageability elements (The Image of the City) as
 * the engine's own critic — paths, edges, districts, nodes, landmarks — folded with
 * four higher-order modern composition principles: Jacobs (short blocks / fine
 * grain), Alexander (positive, enclosed outdoor space), Gehl (plaza enclosure), and
 * a figure-ground density gradient (dense core → loose edge). "Reads like a master
 * planner checked it" is exactly this function scoring high.
 *
 * Every score is a PURE, deterministic function of the candidate GEOMETRY (the same
 * 0..1000 vector space the model emits) — no rng, no Date, no locale, no trig. The
 * same candidate scores byte-identically on every machine, so a v2 golden can pin
 * the accepted score above a floor.
 *
 * A score is 0..1 per element; `total` is the fixed-weight blend. The five Lynch
 * elements carry 0.70 of the weight (imageability is the primary target); the four
 * modern principles carry 0.30 (the composition polish).
 */

import { clamp01 } from '../../kernel/math.js';

const VIEW = 1000;
const CENTER = 500;

/** The fixed rubric weights. Lynch's five (0.70) + the four modern principles (0.30).
 * @type {Readonly<Record<string, number>>} */
export const RUBRIC_WEIGHTS = Object.freeze({
  paths: 0.16,
  edges: 0.12,
  districts: 0.18,
  nodes: 0.12,
  landmarks: 0.12,
  jacobs: 0.08,
  alexander: 0.08,
  gehl: 0.07,
  gradient: 0.07,
});

/**
 * A layout candidate the rubric reads (the shape townLayoutV2 emits per attempt).
 * @typedef {Object} LayoutCandidate
 * @property {{ anchor?: { x:number, y:number }, streets?: Array<{ from:{x:number,y:number}, to:{x:number,y:number} }> }} [skeleton]
 * @property {{ water?: { kind:string, path:Array<[number,number]> }|null, roads?: Array<{ from:number[], to:number[], weight?:number }> }} [frame]
 * @property {Array<{ id:string, category:string, centroid:{x:number,y:number}, polygon:Array<[number,number]> }>} [districts]
 * @property {Array<{ anchorKey:string, kind:string, position:{x:number,y:number} }>} [buildings]
 * @property {{ walls?: Array<[number,number]> }|null} [fortifications]
 * @property {Array<{ x:number, y:number }>} [nodes]
 */

/** Squared distance between two {x,y} points (no sqrt — trig/irrational-free). */
function dist2(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

/** Axis-aligned bounding box of a polygon ([[x,y],…]). */
function bbox(polygon) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const [x, y] of polygon) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  return { minX, minY, maxX, maxY };
}

/** Fractional area of overlap between two AABBs, normalized by the smaller box. */
function boxOverlapFrac(a, b) {
  const ix = Math.max(0, Math.min(a.maxX, b.maxX) - Math.max(a.minX, b.minX));
  const iy = Math.max(0, Math.min(a.maxY, b.maxY) - Math.max(a.minY, b.minY));
  const inter = ix * iy;
  if (inter <= 0) return 0;
  const areaA = Math.max(1, (a.maxX - a.minX) * (a.maxY - a.minY));
  const areaB = Math.max(1, (b.maxX - b.minX) * (b.maxY - b.minY));
  return inter / Math.min(areaA, areaB);
}

/**
 * PATHS — is the street/road network legible and connective? Rewards: every
 * district touched by a street/road (reachability), and a clear primary axis (the
 * longest street spans a good fraction of the map). @param {LayoutCandidate} c candidate
 */
function scorePaths(c) {
  const districts = c.districts || [];
  const streets = (c.skeleton && c.skeleton.streets) || [];
  const roads = (c.frame && c.frame.roads) || [];
  if (districts.length === 0) return 0;

  // Reachability: a district is "served" if a street endpoint lands near its centroid.
  const near2 = 190 * 190; // within ~190 view-units of a street end
  let served = 0;
  for (const d of districts) {
    const cen = d.centroid;
    let hit = false;
    for (const st of streets) {
      if (dist2(st.to, cen) <= near2 || dist2(st.from, cen) <= near2) { hit = true; break; }
    }
    if (hit) served++;
  }
  const reach = served / districts.length;

  // Primary axis: the longest single street's span as a fraction of the view.
  let longest = 0;
  for (const st of streets) {
    const dx = st.to.x - st.from.x;
    const dy = st.to.y - st.from.y;
    const len = Math.round(Math.sqrt(dx * dx + dy * dy));
    if (len > longest) longest = len;
  }
  const axis = clamp01(longest / (VIEW * 0.55));
  // Approach roads reaching the interior are a legibility bonus.
  const approach = clamp01(roads.length / 3);

  return clamp01(reach * 0.6 + axis * 0.28 + approach * 0.12);
}

/**
 * EDGES — legible boundaries a viewer reads the town against: a water line, a wall
 * ring, and the map frame itself. More distinct edges ⇒ a more imageable form.
 * @param {LayoutCandidate} c
 */
function scoreEdges(c) {
  let features = 0;
  if (c.frame && c.frame.water) features += 1;
  if (c.fortifications && Array.isArray(c.fortifications.walls) && c.fortifications.walls.length >= 3) features += 1;
  // A built extent that does NOT flood the whole frame leaves a legible margin edge.
  const districts = c.districts || [];
  if (districts.length > 0) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const d of districts) {
      const bb = bbox(d.polygon);
      if (bb.minX < minX) minX = bb.minX;
      if (bb.minY < minY) minY = bb.minY;
      if (bb.maxX > maxX) maxX = bb.maxX;
      if (bb.maxY > maxY) maxY = bb.maxY;
    }
    const margin = Math.min(minX, minY, VIEW - maxX, VIEW - maxY);
    if (margin >= 30) features += 1; // a clean framing margin all around
  }
  return clamp01(features / 3);
}

/**
 * DISTRICTS — are the quarters distinct and non-overlapping? Penalizes AABB overlap
 * between district polygons (a legible town has readably separate quarters).
 * @param {LayoutCandidate} c
 */
function scoreDistricts(c) {
  const districts = c.districts || [];
  const n = districts.length;
  if (n <= 1) return 1; // a single quarter cannot overlap itself
  const boxes = districts.map((d) => bbox(d.polygon));
  let pairs = 0;
  let overlapSum = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      pairs++;
      overlapSum += boxOverlapFrac(boxes[i], boxes[j]);
    }
  }
  const avgOverlap = pairs > 0 ? overlapSum / pairs : 0;
  return clamp01(1 - avgOverlap * 2.2);
}

/**
 * NODES — convergence points (the market square, gate plazas, street crossings) the
 * viewer navigates by. Rewards a healthy count relative to the town's size.
 * @param {LayoutCandidate} c
 */
function scoreNodes(c) {
  const nodes = c.nodes || [];
  const districts = c.districts || [];
  const expected = Math.max(1, Math.round(1 + districts.length / 3));
  return clamp01(nodes.length / expected);
}

/**
 * LANDMARKS — the singular institutions a viewer remembers. Rewards landmark
 * buildings that stand APART (not piled on one another) — distinct silhouettes.
 * @param {LayoutCandidate} c
 */
function scoreLandmarks(c) {
  const marks = (c.buildings || []).filter((b) => b.kind === 'landmark');
  if (marks.length === 0) return 0.5; // no landmarks ⇒ neutral, not a failure
  if (marks.length === 1) return 1;
  const min2 = 26 * 26; // landmarks closer than ~26 units read as one blob
  let separated = 0;
  for (let i = 0; i < marks.length; i++) {
    let ok = true;
    for (let j = 0; j < marks.length; j++) {
      if (i === j) continue;
      if (dist2(marks[i].position, marks[j].position) < min2) { ok = false; break; }
    }
    if (ok) separated++;
  }
  return clamp01(separated / marks.length);
}

/**
 * JACOBS — fine grain / short blocks: district footprints should sit in a healthy
 * size band (neither monolithic megablocks nor invisible slivers).
 * @param {LayoutCandidate} c
 */
function scoreJacobs(c) {
  const districts = c.districts || [];
  if (districts.length === 0) return 0.5;
  let good = 0;
  for (const d of districts) {
    const bb = bbox(d.polygon);
    const w = bb.maxX - bb.minX;
    const h = bb.maxY - bb.minY;
    const span = Math.max(w, h);
    if (span >= 70 && span <= 420) good++; // legible block, not a megablock
  }
  return clamp01(good / districts.length);
}

/**
 * ALEXANDER — positive outdoor space: the convergence nodes should be ENCLOSED by
 * quarters around them (a square framed by building fronts), not left as void.
 * @param {LayoutCandidate} c
 */
function scoreAlexander(c) {
  const nodes = c.nodes || [];
  const districts = c.districts || [];
  if (nodes.length === 0 || districts.length === 0) return 0.5;
  const near2 = 300 * 300;
  let enclosed = 0;
  for (const nd of nodes) {
    let around = 0;
    for (const d of districts) if (dist2(d.centroid, nd) <= near2) around++;
    if (around >= 3 || around >= districts.length) enclosed++;
  }
  return clamp01(enclosed / nodes.length);
}

/**
 * GEHL — plaza enclosure at the town's heart: the genesis core should have quarters
 * hugging it at a human enclosure radius (a room-like center, not an empty plain).
 * @param {LayoutCandidate} c
 */
function scoreGehl(c) {
  const anchor = c.skeleton && c.skeleton.anchor;
  const districts = c.districts || [];
  if (!anchor || districts.length === 0) return 0.5;
  const near2 = 340 * 340;
  let hugging = 0;
  for (const d of districts) if (dist2(d.centroid, { x: anchor.x, y: anchor.y }) <= near2) hugging++;
  // Ideal: a meaningful cluster hugs the core, but not literally everything (that
  // would be a blob with no gradient). Peak reward around a half-to-two-thirds share.
  const frac = hugging / districts.length;
  const ideal = 0.55;
  return clamp01(1 - Math.abs(frac - ideal) / 0.55);
}

/**
 * GRADIENT — figure-ground density falloff: buildings should crowd the core and
 * thin toward the edge (an organic density gradient, not a uniform sprinkle).
 * @param {LayoutCandidate} c
 */
function scoreGradient(c) {
  const buildings = c.buildings || [];
  if (buildings.length < 4) return 0.6;
  const core = { x: CENTER, y: CENTER };
  const anchor = c.skeleton && c.skeleton.anchor ? { x: c.skeleton.anchor.x, y: c.skeleton.anchor.y } : core;
  // Split buildings into inner/outer halves by distance to the anchor; the inner
  // half should be denser (smaller mean radius) than a uniform distribution implies.
  const radii = buildings.map((b) => Math.round(Math.sqrt(dist2(b.position, anchor)))).sort((a, b) => a - b);
  const mid = Math.floor(radii.length / 2);
  const innerMean = radii.slice(0, mid).reduce((s, r) => s + r, 0) / Math.max(1, mid);
  const outerMean = radii.slice(mid).reduce((s, r) => s + r, 0) / Math.max(1, radii.length - mid);
  if (outerMean <= 0) return 0.6;
  // A clear gradient ⇒ outerMean meaningfully larger than innerMean.
  return clamp01((outerMean - innerMean) / (outerMean * 0.8));
}

/**
 * Score a candidate layout on the full rubric. Returns per-element scores plus the
 * fixed-weight `total`, all 0..1. PURE + deterministic (geometry in → numbers out).
 * @param {LayoutCandidate} candidate  a v2 layout candidate ({ skeleton, frame, districts, buildings, fortifications, nodes })
 * @returns {Record<string, number>}  { total, paths, edges, districts, nodes, landmarks, jacobs, alexander, gehl, gradient }
 */
export function scoreLynch(candidate) {
  const c = candidate || {};
  /** @type {Record<string, number>} */
  const parts = {
    paths: scorePaths(c),
    edges: scoreEdges(c),
    districts: scoreDistricts(c),
    nodes: scoreNodes(c),
    landmarks: scoreLandmarks(c),
    jacobs: scoreJacobs(c),
    alexander: scoreAlexander(c),
    gehl: scoreGehl(c),
    gradient: scoreGradient(c),
  };
  let total = 0;
  for (const k of Object.keys(RUBRIC_WEIGHTS)) total += parts[k] * RUBRIC_WEIGHTS[k];
  // Round to 4 places so the score is a stable, machine-independent golden value.
  const round4 = (v) => Math.round(v * 10000) / 10000;
  /** @type {Record<string, number>} */
  const out = { total: round4(total) };
  for (const k of Object.keys(parts)) out[k] = round4(parts[k]);
  return out;
}

/**
 * The acceptance FLOOR the bounded-retry loop targets. A candidate at or above the
 * floor is accepted immediately; otherwise the loop keeps the best of its budget
 * (FULL fallback quality — the engine always returns its strongest candidate, it
 * never fails to produce a map). Pinned by the v2 golden (every golden seed's
 * accepted score is asserted ≥ this floor). Vetoable tuning constant.
 */
export const LYNCH_ACCEPT_FLOOR = 0.5;
