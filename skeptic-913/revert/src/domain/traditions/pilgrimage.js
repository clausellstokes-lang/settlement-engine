/**
 * domain/traditions/pilgrimage.js — THE TRADITIONS wave (Engine Lift #4), Wave C seam 5:
 * CROSS-SETTLEMENT PILGRIMAGE ATTENDANCE (DESIGN_TRADITIONS §16).
 *
 * A GRAND observance does not draw only its own townsfolk — a metropolis spectacle, a great
 * procession, a famed market fair pulls PILGRIMS from the settlements around it, and a
 * well-attended festival fares better for the crowd it drew. This pure leaf computes that
 * attendance as a BOUNDED lift to the HOST observance's §4 success score — nothing more. It is
 * a READ (nearby reachable settlements + their size) that modulates the host's OWN outcome; it
 * NEVER writes to the visitor settlements (that cross-settlement write would be a new §16 surface
 * beyond the §14 write-list — deliberately NOT taken here).
 *
 * SPATIAL DORMANCY (the constitution): attendance needs distances, so it reads the frozen spatial
 * digest (activeSpatialDigest). An ASPATIAL campaign (no spatialCanonVersion / teleport path) has
 * NO digest ⇒ zero draw ⇒ the host's outcome is byte-identical to the pre-seam engine — the SAME
 * aspatial dormancy the §9 adoption block upholds. The mover supplies the digest (resolved once per
 * tick) and the settlement snapshot; this leaf reaches into no live state directly.
 *
 * PURITY: a true domain leaf — no store/React import, no Date/Math.random/localeCompare. The nearest-
 * reachable walk mirrors the migrationKernel idiom (pathCost → drop self/unreachable/unmapped → sort
 * by cost then codepoint → slice a bounded pool), so the draw is deterministic on any device.
 */

import { pathCost, distanceWeight, isMapped } from '../spatial/distanceRead.js';

/** @typedef {import('./genesis.js').TraditionRec} TraditionRec */

// ── §16 pilgrimage dials (soak-certified; every entry vetoable) ─────────────────
/** The observance ACTS grand enough to draw pilgrims (a procession, a devotional offering, a
 *  famed market fair — the crowd-gathering rites). A very-high-scale spectacle of ANY act also
 *  draws them (the metropolis exception below). */
const PILGRIM_ACTS = new Set(['procession', 'offering', 'fair']);
const GRAND_SCALE_MIN = 3;   // town-band and up — a rite large enough to be worth travelling to
const SPECTACLE_SCALE = 5;   // a metropolis-grade spectacle draws pilgrims whatever its act
const CANDIDATE_POOL = 8;    // the nearest reachable neighbours considered (the migration idiom)
const POP_ANCHOR = 6000;     // the neighbour population that contributes ~one unit of raw draw
const DRAW_HALF = 2;         // raw draw at which attendance reaches half the cap (soft saturation)
const PILGRIM_MAX = 0.1;     // the score lift a fully-attended grand festival earns (bounded)

/** @param {unknown} x @returns {Record<string, unknown>} */
function asObject(x) {
  return x && typeof x === 'object' && !Array.isArray(x) ? /** @type {Record<string, unknown>} */ (x) : {};
}
/** @param {unknown} x @param {number} d @returns {number} */
function num(x, d) {
  const n = Number(x);
  return Number.isFinite(n) ? n : d;
}
/** Codepoint-stable compare (byte-stable ordering). @param {string} a @param {string} b @returns {number} */
function cmp(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * Is a tradition grand enough to draw cross-settlement pilgrims? A crowd-gathering act
 * (procession/offering/fair) at town-band or above, OR any metropolis-grade spectacle. Pure, total.
 * @param {TraditionRec} rec @returns {boolean}
 */
export function drawsPilgrims(rec) {
  const scaleBand = num(/** @type {Record<string, unknown>} */ (rec).scaleBand, 0);
  const act = String(asObject(/** @type {Record<string, unknown>} */ (rec).coreMotif).act || '');
  return scaleBand >= GRAND_SCALE_MIN && (PILGRIM_ACTS.has(act) || scaleBand >= SPECTACLE_SCALE);
}

/** @typedef {{ id?: (string|number), settlement?: { population?: unknown } }} PilgrimSnapItem */

/**
 * The PILGRIMAGE ATTENDANCE lift to a host observance's §4 success score (§16). A grand festival
 * draws pilgrims from the nearest reachable settlements; the crowd is Σ (neighbour size × distance
 * weight) over a bounded pool, softly saturated to PILGRIM_MAX. Returns a bounded delta in
 * [0, PILGRIM_MAX]; 0 when the observance is not grand, when the campaign is aspatial (no digest),
 * or when the host is unmapped / has no reachable neighbours (⇒ byte-identical to the pre-seam
 * outcome). Deterministic, pure, total.
 * @param {Object} a
 * @param {string} a.hostId  the host settlement id
 * @param {TraditionRec} a.hostRec  the observance drawing the crowd
 * @param {PilgrimSnapItem[]} a.settlements  the tick's settlement snapshot items
 * @param {import('../spatial/distanceRead.js').SpatialDigest|null|undefined} a.digest  the active spatial digest (null ⇒ aspatial ⇒ 0)
 * @returns {number}
 */
export function pilgrimageDraw({ hostId, hostRec, settlements, digest }) {
  if (!digest || !drawsPilgrims(hostRec)) return 0;
  const host = String(hostId);
  if (!isMapped(digest, host)) return 0;

  // The nearest reachable neighbours (the migrationKernel nearest-reachable idiom).
  const reachable = (Array.isArray(settlements) ? settlements : [])
    .map((it) => ({ id: String(it?.id), it, cost: pathCost(digest, host, String(it?.id)) }))
    .filter((r) => r.id && r.id !== host && r.cost != null && isMapped(digest, r.id))
    .sort((x, y) => (num(x.cost, 0) - num(y.cost, 0)) || cmp(x.id, y.id))
    .slice(0, CANDIDATE_POOL);
  if (!reachable.length) return 0;

  // Attendance = Σ (neighbour population / POP_ANCHOR) × distanceWeight — a nearby populous
  // neighbour sends the most pilgrims; a distant one attenuates to the DISTANCE_WEIGHT_FLOOR.
  let raw = 0;
  for (const r of reachable) {
    const pop = Math.max(0, num(asObject(r.it?.settlement).population, 0));
    raw += (pop / POP_ANCHOR) * distanceWeight(digest, host, r.id);
  }
  if (raw <= 0) return 0;
  // Soft saturation: a few close populous neighbours approach the cap; it never exceeds PILGRIM_MAX.
  return PILGRIM_MAX * (raw / (raw + DRAW_HALF));
}
