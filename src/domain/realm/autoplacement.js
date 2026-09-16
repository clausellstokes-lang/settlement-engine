/**
 * autoplacement.js — W-G / J-D1: THE PLACER.
 *
 * Directive 1: "one button places all settlements on the realm map balancing sim
 * dynamism and a connected visual web, matching terrain/resources; mismatches
 * trigger an OPTIONAL 'bare minimum adjustments' popup."
 *
 * J-D1 binds the shape: PLACEMENT-FIRST. This module finds the best-fit ground for
 * every settlement and returns a PLAN. It mutates nothing, reaches no store, and
 * knows no React. Whether any of it happens is the consent popup's question, and
 * the plan is written to be itemized there — every proposal already carries the
 * class it belongs to and the sentence that explains it.
 *
 * ── THE THREE CLASSES, SEPARATED AT THE SOURCE (J-D1) ────────────────────────
 *   (a) MOVE / PLACE — position only. Safe, default-selected. Positions are
 *       campaign map data; nothing here reads or writes generation input.
 *   (b) PAINT MAP TERRAIN — reshaping the realm under a settlement's feet.
 *       REPORTED UNAVAILABLE, with the reason, and never fabricated. The FMG
 *       iframe's whole RPC surface was enumerated (placeSettlement,
 *       removePlacement, clearAllPlacements, restorePlacements, getViewport,
 *       setViewport, fitMap, getSpatialPack, exportThumb, saveSnapshot,
 *       loadSnapshot, resetMap, activateTool, deactivateTool, terrainUndo,
 *       terrainRedo, setTemplate, getTemplates, requestBurgList, setEmbeddedMode,
 *       computeRoadNetwork, setFmgLayer): there is NO programmatic terrain write.
 *       `activateTool` ARMS the heightmap editor for the user's own pointer, and
 *       `resetMap` regenerates the entire world. Neither is "paint these cells".
 *       J-D1 says do not invent canvas mutations, so the class is listed as
 *       unavailable and the reason travels with it to the popup.
 *   (c) RE-TERRAIN AS REGEN — offered ONLY on a mismatch, NEVER pre-selected, and
 *       always labelled as what it is: changing generation input re-rolls the
 *       settlement under the same-seed law. This module only ever OFFERS it.
 *
 * ── DETERMINISM: NO RNG AT ALL (stronger than a seeded one) ──────────────────
 * The obvious build is a seeded PRNG. This module deliberately takes NO draws from
 * any stream. `seed` enters through a pure integer hash used to break ties between
 * otherwise-equal cells, so "same realm + seed ⇒ same layout" holds, AND the placer
 * is structurally incapable of perturbing a generation stream — the failure mode
 * where a worldState-only feature shifts a golden cannot occur here, because there
 * is no draw to mis-account. Purity is pinned by source scan, not by hope.
 *
 * ── THE DYNAMISM OBJECTIVE (the small-N stasis medicine, made geometric) ─────
 * A placer that only maximizes terrain fit produces the degenerate layout the soak
 * already found: settlements scattered to whichever corner holds their biome, each
 * alone, nothing interacting. The cure is a BAND, the house idiom:
 *   FLOOR  — a tier-scaled minimum separation. Nothing overlaps; a metropolis
 *            claims more room than a thorp.
 *   REACH  — a reward for landing near the k-th nearest settlement already placed,
 *            k = 3. The k-th, not the nearest: rewarding the nearest builds a STAR
 *            (everyone hugging one hub), while rewarding the third-nearest builds a
 *            WEB. k = 3 is J-D2's own ratified k-nearest constant, so the visual
 *            web and the default diplomatic edge set agree on what "neighbours"
 *            means.
 * The reward is a real weight, not a tiebreak, and zeroing it is the pins' built-in
 * negative control: with REACH off, the same fixture strands a settlement.
 *
 * @enforced-by tests/domain/autoplacement.test.js
 */

import { spreadIndices } from '../lowDiscrepancy.js';
import { TIER_ORDER } from '../../data/constants.js';
import {
  GENESIS_TERRAINS,
  isLandCell,
  terrainCensus,
  terrainFitsCell,
  terrainPlaceName,
} from './placementRaster.js';

/** The plan schema version — stamped into every plan and into the Herald record so
 *  a later reader can tell which placer drew a layout. */
export const AUTOPLACEMENT_VERSION = 1;

/** Per-tier multipliers on the separation floor. Declared here, ANNOTATED as an
 *  open string record rather than asserted at the lookup: a runtime tier string
 *  can then index it with no type assertion at all (a domain leaf should not need
 *  one, and the any-cast ratchet is right to say so).
 *  @type {Readonly<Record<string, number>>} */
const TIER_SEPARATION_BANDS = Object.freeze({
  thorp: 0.8, hamlet: 0.9, village: 1.0, town: 1.2, city: 1.5, metropolis: 1.8,
});

/** Every knob the placer has, in one authored table. */
export const AUTOPLACEMENT_TUNING = Object.freeze({
  // Candidate cells offered per genesis terrain. The pools are subsampled with the
  // Weyl sampler (never an arithmetic stride — a stride aliases against a grid
  // pack's row width and can make a whole ridge unreachable, measured in W-E).
  CANDIDATE_CAP: 96,
  // The k in "k-th nearest already-placed settlement" — J-D2's ratified k.
  NEIGHBOUR_K: 3,
  // Score weights. FIT dominates by an order of magnitude: a placer that trades
  // terrain truth for prettiness is not the feature the directive asked for.
  FIT_WEIGHT: 100,
  REACH_WEIGHT: 30,
  TIE_WEIGHT: 4,
  // The minimum separation floor, as a fraction of the natural spacing
  // sqrt(landArea / settlementCount). Below 1 by construction: the floor is a
  // no-crowding guarantee, not a target.
  SEPARATION_FRACTION: 0.55,
  // Per-tier multipliers on the floor — bigger places need more elbow room.
  TIER_SEPARATION: TIER_SEPARATION_BANDS,
  // The reach scale: the distance at which the k-th-neighbour reward has decayed
  // to half. Expressed in units of the natural spacing.
  REACH_SPAN: 2.0,
  // Coordinate-descent passes over the seeded layout. Reach can only be scored
  // against a WHOLE layout, so the seed pass is fit-only and these passes are
  // where the web actually forms. Each pass is monotone (strict improvement only),
  // so this is a termination bound rather than a tuning dial.
  REFINE_PASSES: 4,
  // The anti-degeneracy guard. A settlement whose nearest neighbour sits further
  // than ISOLATION_FACTOR x the median nearest-neighbour distance is STRANDED, and
  // the repair pass re-seats it. Bounded so the plan is always O(passes).
  ISOLATION_FACTOR: 2.5,
  REPAIR_PASSES: 3,
});

/**
 * One proposed action, already filed under its J-D1 class.
 * @typedef {Object} PlacementProposal
 * @property {'move'|'place'} kind   move an existing placement, or place an unplaced settlement
 * @property {string} settlementId
 * @property {string|null} burgId    the map handle (null for an unplaced settlement)
 * @property {string} name
 * @property {string} terrain        the settlement's FROZEN genesis terrain (read-only)
 * @property {number|null} fromCell
 * @property {number} toCell
 * @property {number} x
 * @property {number} y
 * @property {boolean} fits          did it land on ground matching its genesis terrain
 * @property {string} reason         one plain sentence, the popup's row copy
 */

/**
 * A settlement the realm cannot house: its genesis terrain exists NOWHERE on this
 * map. J-D1's second class — surfaced separately, and offered only the explicit
 * choices, never a silent substitution.
 * @typedef {Object} PlacementMismatch
 * @property {string} settlementId
 * @property {string|null} burgId
 * @property {string} name
 * @property {string} terrain
 * @property {string} reason
 * @property {PlacementProposal|null} bestAvailable  the default: closest honest ground
 * @property {{ reterrain: { offered: boolean, preselected: boolean, label: string, warning: string } }} options
 */

/** Codepoint comparator (device/locale-stable). @param {string} a @param {string} b */
function codepoint(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * A deterministic 32-bit hash → [0,1). FNV-1a. This is the ONLY place `seed`
 * enters the placer, and it is a hash, never a draw: no stream advances, so no
 * generation output can shift.
 * @param {string} text @returns {number}
 */
export function tieHash(text) {
  let h = 0x811c9dc5;
  const s = String(text);
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    // FNV prime 16777619, via shifts so the product stays in 32-bit range.
    h = (h + (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24)) >>> 0;
  }
  return h / 4294967296;
}

/**
 * Euclidean distance between two cells in map coordinate space.
 *
 * DELIBERATELY Math.sqrt AND NOT Math.hypot. Every layout decision below is a
 * COMPARISON of these distances, so the last bit of this number chooses where a
 * settlement stands. Math.hypot is implementation-approximated per the ECMAScript
 * spec and may differ in its final ulp between engines; Math.sqrt is required to
 * be correctly rounded and is therefore exact everywhere. Under "a seed is a
 * world, forever", the same realm must lay itself out identically on every device
 * a player opens it on, and hypot cannot promise that.
 *
 *  @param {import('./placementRaster.js').RealmRaster} raster
 *  @param {number} a @param {number} b @returns {number} */
function cellDistance(raster, a, b) {
  const dx = raster.x[a] - raster.x[b];
  const dy = raster.y[a] - raster.y[b];
  return Math.sqrt((dx * dx) + (dy * dy));
}

/**
 * The realm's land bounding box and the natural spacing a layout of `count`
 * settlements implies. Pure geometry over the raster.
 * @param {import('./placementRaster.js').RealmRaster} raster
 * @param {number} count
 */
export function realmSpacing(raster, count) {
  let minX = Infinity; let minY = Infinity; let maxX = -Infinity; let maxY = -Infinity;
  let land = 0;
  for (let cell = 0; cell < raster.cellCount; cell += 1) {
    if (!isLandCell(raster, cell)) continue;
    land += 1;
    if (raster.x[cell] < minX) minX = raster.x[cell];
    if (raster.x[cell] > maxX) maxX = raster.x[cell];
    if (raster.y[cell] < minY) minY = raster.y[cell];
    if (raster.y[cell] > maxY) maxY = raster.y[cell];
  }
  if (!land) return { land: 0, width: 0, height: 0, natural: 0 };
  const width = maxX - minX;
  const height = maxY - minY;
  // The land's share of the bounding box, so an archipelago does not read as a
  // continent and inflate the spacing every settlement is held to.
  const boxArea = Math.max(1, width * height);
  const landArea = boxArea * (land / Math.max(1, raster.cellCount));
  const natural = Math.sqrt(landArea / Math.max(1, count));
  return { land, width, height, natural };
}

/**
 * The bounded candidate pool for one genesis terrain: every fitting cell, then a
 * low-discrepancy subset of them capped at CANDIDATE_CAP. Deterministic — a
 * function of (raster, terrain, cap) alone.
 * @param {import('./placementRaster.js').RealmRaster} raster
 * @param {string} terrain
 * @param {number} cap
 * @returns {number[]}
 */
export function candidateCells(raster, terrain, cap) {
  /** @type {number[]} */
  const fitting = [];
  for (let cell = 0; cell < raster.cellCount; cell += 1) {
    if (terrainFitsCell(terrain, raster, cell)) fitting.push(cell);
  }
  return spreadIndices(fitting.length, Math.min(cap, fitting.length)).map((i) => fitting[i]);
}

/**
 * Every land cell, subsampled — the fallback pool a mismatched settlement is
 * offered, and the pool any settlement falls back to when its own terrain's cells
 * are all taken. A founding never refuses for want of perfect ground.
 * @param {import('./placementRaster.js').RealmRaster} raster @param {number} cap
 * @returns {number[]}
 */
export function landCandidates(raster, cap) {
  /** @type {number[]} */
  const land = [];
  for (let cell = 0; cell < raster.cellCount; cell += 1) {
    if (isLandCell(raster, cell)) land.push(cell);
  }
  return spreadIndices(land.length, Math.min(cap, land.length)).map((i) => land[i]);
}

/** Tier rank (0 = thorp). Unknown tiers read as village — the middle, never the
 *  top, so an unrecognized token can never claim the largest separation band.
 *  @param {string|null|undefined} tier @returns {number} */
function tierRank(tier) {
  const i = TIER_ORDER.indexOf(String(tier || '').toLowerCase());
  return i >= 0 ? i : TIER_ORDER.indexOf('village');
}

/** The separation floor one settlement is held to. An unrecognized tier takes the
 *  village band — the middle, never the widest.
 *  @param {string} tier @param {number} natural @param {typeof AUTOPLACEMENT_TUNING} T */
function separationFor(tier, natural, T) {
  const bands = T.TIER_SEPARATION;
  const mult = bands[String(tier || '').toLowerCase()] ?? bands.village;
  return natural * T.SEPARATION_FRACTION * mult;
}

/**
 * One roster row as the planner works with it internally — every field
 * normalized, and deliberately nothing resembling a settlement `config`.
 * @typedef {{ id: string, burgId: string|null, name: string, terrain: string,
 *   tier: string, cellId: number|null }} PlanningEntry
 */

/**
 * The distance to the k-th nearest already-seated settlement — the dynamism read.
 * Returns null when nothing is seated yet (the first settlement is unconstrained).
 * @param {import('./placementRaster.js').RealmRaster} raster
 * @param {number} cell @param {number[]} seatedCells @param {number} k
 * @returns {number|null}
 */
function kthNeighbourDistance(raster, cell, seatedCells, k) {
  if (!seatedCells.length) return null;
  const distances = seatedCells.map((seat) => cellDistance(raster, cell, seat)).sort((a, b) => a - b);
  return distances[Math.min(k, distances.length) - 1];
}

/**
 * THE PLAN. Pure: (raster, settlements, seed) in, a plan out, nothing touched.
 *
 * @param {Object} args
 * @param {import('./placementRaster.js').RealmRaster} args.raster
 * @param {ReadonlyArray<{ id: string, burgId?: string|null, name?: string, terrain?: string|null,
 *   tier?: string|null, cellId?: number|null }>} args.settlements
 *   A READ-ONLY projection of genesis truth. Deliberately NOT a settlement object:
 *   this module never receives a `config`, so it cannot write one.
 * @param {string} [args.seed]
 * @param {Partial<typeof AUTOPLACEMENT_TUNING>} [args.tuning]
 * @returns {{ version: number, seed: string, proposals: PlacementProposal[],
 *   unchanged: Array<{ settlementId: string, name: string, reason: string }>,
 *   mismatches: PlacementMismatch[],
 *   paint: { available: boolean, reason: string },
 *   survey: { landCells: number, census: Record<string, number>, natural: number,
 *     minSeparation: number, maxNearest: number, medianNearest: number, stranded: string[] } }}
 */
export function planAutoplacement({ raster, settlements, seed = '', tuning = {} }) {
  const T = { ...AUTOPLACEMENT_TUNING, ...tuning };
  const paint = Object.freeze({
    // Always false today, and typed `boolean` on purpose: the guarantee that no
    // plan carries a paint action is enforced by a PIN over the serialized plan,
    // not by a literal type nobody reads at runtime.
    available: false,
    reason: 'The map canvas offers no way to paint terrain from outside it. Its editor opens for your own pointer; nothing can repaint cells on your behalf, so this option is not offered.',
  });

  const roster = (Array.isArray(settlements) ? settlements : [])
    .filter((s) => s && s.id != null)
    .map((s) => ({
      id: String(s.id),
      burgId: s.burgId != null ? String(s.burgId) : null,
      name: String(s.name || 'A settlement'),
      terrain: String(s.terrain || ''),
      tier: String(s.tier || ''),
      cellId: Number.isInteger(s.cellId) ? Number(s.cellId) : null,
    }));

  const census = terrainCensus(raster);
  const { land, natural } = realmSpacing(raster, roster.length);
  /** @type {PlacementProposal[]} */
  const proposals = [];
  /** @type {Array<{ settlementId: string, name: string, reason: string }>} */
  const unchanged = [];
  /** @type {PlacementMismatch[]} */
  const mismatches = [];
  const survey = {
    landCells: land,
    census,
    natural,
    minSeparation: 0,
    maxNearest: 0,
    medianNearest: 0,
    /** @type {string[]} */ stranded: [],
  };
  if (!roster.length || !land) {
    return { version: AUTOPLACEMENT_VERSION, seed: String(seed), proposals, unchanged, mismatches, paint, survey };
  }

  // Candidate pools, built once per terrain and shared by every settlement that
  // wants that ground — bounded work, and the same pool for the same realm.
  /** @type {Map<string, number[]>} */
  const pools = new Map();
  for (const terrain of GENESIS_TERRAINS) {
    if (census[terrain] > 0) pools.set(terrain, candidateCells(raster, terrain, T.CANDIDATE_CAP));
  }
  const fallbackPool = landCandidates(raster, T.CANDIDATE_CAP);

  // THE ORDER: largest tier first, then codepoint id. The hubs anchor the web
  // before the small places fill in around them, and the order never depends on
  // the caller's array order — two callers with the same set get the same layout.
  const ordered = roster.slice().sort((a, b) => (tierRank(b.tier) - tierRank(a.tier)) || codepoint(a.id, b.id));

  /** @type {Map<string, number>} seated settlement id → cell */
  const seats = new Map();
  const taken = new Set();
  /** @param {PlanningEntry} entry @returns {number[]} */
  const poolFor = (entry) => (
    (census[entry.terrain] || 0) > 0 ? (pools.get(entry.terrain) || fallbackPool) : fallbackPool
  );

  /**
   * Score one candidate cell against a set of OTHER settlements' cells.
   *
   * WHY `others` IS A PARAMETER AND NOT "whoever is seated so far" (a measured
   * correction): scoring against the already-seated set makes the reach reward
   * worthless exactly when it matters most. The first settlement has no
   * neighbours, so it is seated by fit and tie alone — often in a corner — and
   * every later settlement then optimizes around that arbitrary anchor. Measured
   * on the corner-grove fixture, a one-pass greedy WITH the reward produced a
   * WORSE worst-isolation (174.9) than the same greedy with the reward switched
   * off (139.3): the objective was being computed against a layout that did not
   * exist yet. Reach is a property of a WHOLE layout, so it is evaluated against
   * one — see the refine phase below.
   * @param {PlanningEntry} entry @param {number} cell @param {number[]} others
   * @returns {number}
   */
  const scoreCell = (entry, cell, others) => {
    let score = terrainFitsCell(entry.terrain, raster, cell) ? T.FIT_WEIGHT : 0;
    const kth = kthNeighbourDistance(raster, cell, others, T.NEIGHBOUR_K);
    if (kth !== null && natural > 0) {
      // THE REACH REWARD — decays with distance to the k-th neighbour, so the best
      // ground is ground near SEVERAL settlements, not merely near one.
      score += T.REACH_WEIGHT / (1 + (kth / (natural * T.REACH_SPAN)));
    }
    score += T.TIE_WEIGHT * tieHash(`${seed}|${entry.id}|${cell}`);
    return score;
  };

  /**
   * The best legal cell for one settlement given everyone else's positions.
   * Two passes: the separation floor is a GUARANTEE while any cell can honour it
   * and a PREFERENCE once none can, so a realm too small for its roster still
   * gets a complete layout instead of a refusal.
   * @param {PlanningEntry} entry @param {number[]} others @param {number|null} excludeCell
   * @returns {{ cell: number, score: number }|null}
   */
  const bestCell = (entry, others, excludeCell) => {
    const floor = separationFor(entry.tier, natural, T);
    /** @type {{ cell: number, score: number }|null} */
    let best = null;
    for (const enforceFloor of [true, false]) {
      for (const cell of poolFor(entry)) {
        if (taken.has(cell) && cell !== excludeCell) continue;
        if (enforceFloor && others.some((/** @type {number} */ s) => cellDistance(raster, cell, s) < floor)) continue;
        const score = scoreCell(entry, cell, others);
        if (!best || score > best.score) best = { cell, score };
      }
      if (best) break;
    }
    return best;
  };

  // ── PHASE 1: SEED. Fit and tie only, largest tier first. This produces a legal
  //    layout to optimize FROM; it is deliberately not the answer.
  for (const entry of ordered) {
    const chosen = bestCell(entry, [...seats.values()], null);
    if (!chosen) continue;
    seats.set(entry.id, chosen.cell);
    taken.add(chosen.cell);
  }

  // ── PHASE 2: REFINE. Coordinate descent over the whole layout: each settlement
  //    in turn re-seats at the best cell given where everyone ELSE now sits. Reach
  //    is finally being measured against a real layout, so the web actually forms.
  //    A move is taken only on a strict score improvement, which makes the pass
  //    monotone and the loop terminating; the bound is belt and braces.
  for (let pass = 0; pass < T.REFINE_PASSES; pass += 1) {
    let moved = false;
    for (const entry of ordered) {
      const current = seats.get(entry.id);
      if (current === undefined) continue;
      const others = [...seats].filter(([id]) => id !== entry.id).map(([, cell]) => cell);
      const currentScore = scoreCell(entry, current, others);
      const candidate = bestCell(entry, others, current);
      if (!candidate || candidate.cell === current || candidate.score <= currentScore) continue;
      taken.delete(current);
      seats.set(entry.id, candidate.cell);
      taken.add(candidate.cell);
      moved = true;
    }
    if (!moved) break;
  }

  // ── THE ANTI-DEGENERACY REPAIR ─────────────────────────────────────────────
  // Greedy seating can still strand the last settlement placed: by the time it
  // chooses, the cells near the web are taken and its own terrain may only remain
  // in a far corner. Measure isolation, re-seat the worst offender, repeat —
  // bounded, and each pass is accepted only if it strictly improves the worst case.
  /** @param {string} id @param {number} cell @param {string|null} exclude @returns {number} */
  const nearestOf = (id, cell, exclude) => {
    let best = Infinity;
    for (const [otherId, otherCell] of seats) {
      if (otherId === id || otherId === exclude) continue;
      best = Math.min(best, cellDistance(raster, cell, otherCell));
    }
    return best;
  };
  const isolationReport = () => {
    const rows = [...seats].map(([id, cell]) => ({ id, cell, nearest: nearestOf(id, cell, null) }))
      .filter((row) => Number.isFinite(row.nearest))
      .sort((a, b) => a.nearest - b.nearest);
    if (!rows.length) return { rows, median: 0, worst: null };
    const median = rows[Math.floor(rows.length / 2)].nearest;
    return { rows, median, worst: rows[rows.length - 1] };
  };

  for (let pass = 0; pass < T.REPAIR_PASSES; pass += 1) {
    const { median, worst } = isolationReport();
    if (!worst || !(median > 0) || worst.nearest <= median * T.ISOLATION_FACTOR) break;
    const entry = roster.find((r) => r.id === worst.id);
    if (!entry) break;
    const pool = (census[entry.terrain] || 0) > 0 ? (pools.get(entry.terrain) || fallbackPool) : fallbackPool;
    const floor = separationFor(entry.tier, natural, T);
    /** @type {{ cell: number, nearest: number }|null} */
    let better = null;
    for (const cell of pool) {
      if (taken.has(cell) && cell !== worst.cell) continue;
      const nearest = nearestOf(worst.id, cell, worst.id);
      if (!Number.isFinite(nearest) || nearest < floor) continue;
      if (nearest >= worst.nearest) continue;                 // strictly closer to the web
      if (!better || nearest < better.nearest) better = { cell, nearest };
    }
    if (!better) break;
    taken.delete(worst.cell);
    seats.set(worst.id, better.cell);
    taken.add(better.cell);
  }

  // ── THE PLAN, filed by class ───────────────────────────────────────────────
  const finalReport = isolationReport();
  survey.medianNearest = finalReport.median;
  survey.maxNearest = finalReport.worst ? finalReport.worst.nearest : 0;
  survey.minSeparation = finalReport.rows.length ? finalReport.rows[0].nearest : 0;
  survey.stranded = finalReport.rows
    .filter((row) => finalReport.median > 0 && row.nearest > finalReport.median * T.ISOLATION_FACTOR)
    .map((row) => row.id)
    .sort(codepoint);

  // Report in roster order (codepoint by id) so the popup's list is stable and
  // does not re-order itself between two identical plans.
  for (const entry of roster.slice().sort((a, b) => codepoint(a.id, b.id))) {
    const cell = seats.get(entry.id);
    if (cell === undefined) continue;
    const fits = terrainFitsCell(entry.terrain, raster, cell);
    const hasGround = (census[entry.terrain] || 0) > 0;
    const ground = terrainPlaceName(entry.terrain);
    if (entry.cellId === cell) {
      unchanged.push({
        settlementId: entry.id,
        name: entry.name,
        reason: `${entry.name} already stands on the best ground the realm offers it.`,
      });
      continue;
    }
    /** @type {PlacementProposal} */
    const proposal = {
      kind: entry.burgId ? 'move' : 'place',
      settlementId: entry.id,
      burgId: entry.burgId,
      name: entry.name,
      terrain: entry.terrain,
      fromCell: entry.cellId,
      toCell: cell,
      x: raster.x[cell],
      y: raster.y[cell],
      fits,
      reason: fits
        ? `${entry.name} takes ${ground}, within reach of its neighbours.`
        : `${entry.name} takes the closest ground the realm has to ${ground}.`,
    };
    if (!hasGround) {
      mismatches.push({
        settlementId: entry.id,
        burgId: entry.burgId,
        name: entry.name,
        terrain: entry.terrain,
        reason: `${entry.name} was built for ${ground}, and this realm has none.`,
        bestAvailable: proposal,
        options: {
          reterrain: {
            offered: true,
            // NEVER pre-selected (J-D1). Enforced by the consent popup's pins, not
            // by a literal type.
            preselected: false,
            label: `Rebuild ${entry.name} for the ground it stands on`,
            warning: `This regenerates ${entry.name}. Its terrain is a generation input, so rebuilding it re-rolls the settlement under the same-seed law: its people, trades and history are drawn again. Moving it changes nothing but where it sits.`,
          },
        },
      });
      continue;
    }
    proposals.push(proposal);
  }

  return { version: AUTOPLACEMENT_VERSION, seed: String(seed), proposals, unchanged, mismatches, paint, survey };
}
