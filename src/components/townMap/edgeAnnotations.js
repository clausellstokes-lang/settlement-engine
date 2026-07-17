/**
 * components/townMap/edgeAnnotations.js — SM-5 (3) EDGE ANNOTATIONS.
 *
 * Labels the map's exit roads with the settlement's NAMED NEIGHBOURS. Pure, view-
 * time, store-free.
 *
 * THE HONESTY BOUNDARY (verified against the repo): a settlement's neighbour list
 * (`settlement.neighbors[]` = { name, relationshipType }) carries NO distance,
 * bearing, or travel-time data, and the town map's exit roads are an even compass
 * fan derived from tradeRouteAccess — NOT positioned toward where a neighbour
 * actually lies. So this helper:
 *   • labels each exit as a wayfinding sign ("the road to X") — the standard
 *     schematic-map convention — assigning neighbours to roads in a STABLE order,
 *     and NEVER claims the compass bearing is a real survey direction;
 *   • shows the honest RELATIVE descriptor it does have — the relationship — and
 *     NO travel number, because none exists in the town-scale data;
 *   • accepts an OPTIONAL `weeksFor(neighbor)` resolver (the realm-scale spatial-
 *     digest seam, distanceRead.hopWeeks) — when a caller supplies real integer
 *     weeks, the label carries "≈N weeks away"; absent it, no number is invented.
 */

/** relationshipType → an honest relative descriptor (empty ⇒ no descriptor shown). */
const REL_LABEL = Object.freeze({
  allied: 'allied',
  trade_partner: 'trade partner',
  rival: 'a rival',
  hostile: 'hostile',
  cold_war: 'an uneasy peace',
  tense: 'tense',
  neutral: '',
});

/** @param {unknown} v */
function relationshipLabel(v) {
  const key = typeof v === 'string' ? v.toLowerCase() : '';
  return Object.prototype.hasOwnProperty.call(REL_LABEL, key) ? REL_LABEL[key] : '';
}

/** Real integer weeks → an honest travel label, or null (never invents a number).
 *  @param {unknown} weeks */
function travelLabelFor(weeks) {
  if (typeof weeks !== 'number' || !Number.isFinite(weeks) || weeks <= 0) return null;
  const n = Math.round(weeks);
  return `≈${n} week${n === 1 ? '' : 's'} away`;
}

/**
 * @typedef {Object} EdgeAnnotation
 * @property {string} roadId
 * @property {number} x            label anchor (map units, nudged inward from the edge)
 * @property {number} y
 * @property {'start'|'middle'|'end'} align   text-anchor by which edge the road exits
 * @property {string} neighborName
 * @property {string} relationshipLabel
 * @property {string|null} travelLabel
 */

/**
 * Build the edge annotations for a model + settlement. Pure. Assigns each named
 * neighbour to one exit road in stable (name-sorted) order; caps at the number of
 * roads (extra neighbours are not map exits). Returns [] when either side is empty.
 * @param {{ frame?: { roads?: Array<{ id:string, from:[number,number], to:[number,number] }> } }|null|undefined} model
 * @param {{ neighbors?: Array<{ name?: string, relationshipType?: string }> }|null|undefined} settlement
 * @param {{ weeksFor?: (n: { name?: string, relationshipType?: string }) => number|null }} [opts]
 * @returns {EdgeAnnotation[]}
 */
export function buildEdgeAnnotations(model, settlement, opts = {}) {
  const roads = model && model.frame && Array.isArray(model.frame.roads) ? model.frame.roads : [];
  const rawNeighbors = settlement && Array.isArray(settlement.neighbors) ? settlement.neighbors : [];
  const neighbors = rawNeighbors
    .filter((n) => n && typeof n.name === 'string' && n.name.trim())
    .slice()
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  if (roads.length === 0 || neighbors.length === 0) return [];

  const weeksFor = typeof opts.weeksFor === 'function' ? opts.weeksFor : null;
  const pairs = Math.min(roads.length, neighbors.length);
  /** @type {EdgeAnnotation[]} */
  const out = [];
  for (let i = 0; i < pairs; i++) {
    const road = roads[i];
    const nb = neighbors[i];
    if (!road || !Array.isArray(road.from) || !Array.isArray(road.to)) continue;
    const fromX = Number(road.from[0]);
    const fromY = Number(road.from[1]);
    const toX = Number(road.to[0]);
    const toY = Number(road.to[1]);
    // Nudge the label ~10% inward from the edge point so it is not clipped.
    const x = fromX + (toX - fromX) * 0.1;
    const y = fromY + (toY - fromY) * 0.1;
    const align = fromX < 120 ? 'start' : fromX > 880 ? 'end' : 'middle';
    out.push({
      roadId: String(road.id || `road.${i}`),
      x, y, align,
      neighborName: nb.name.trim(),
      relationshipLabel: relationshipLabel(nb.relationshipType),
      travelLabel: weeksFor ? travelLabelFor(weeksFor(nb)) : null,
    });
  }
  return out;
}
