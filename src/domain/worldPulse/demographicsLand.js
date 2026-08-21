/**
 * demographicsLand.js — WAVE P3, THE SPATIAL LAW.
 * docs/DESIGN_DEMOGRAPHIC_ENGINE.md §5b ("the land is the last ledger", owner
 * amendment 2026-08-01) and judgment blocks J-P6, J-P6b, J-P7, J-P8 are this file's
 * contract. Pure, total, zero-PRNG, zero-write: it answers where a founding may
 * legally stand and never founds anything.
 *
 * ── THE FINDING THAT SHAPES EVERY LINE BELOW (verified, not assumed) ─────────
 * The obvious build is a radius: measure the metres between a candidate site and
 * every settlement, refuse anything inside the band. THE FROZEN DIGEST CARRIES NO
 * COORDINATES, so that build is impossible at tick time, and pretending otherwise
 * would produce a law that silently measured nothing. Three independent
 * confirmations, all in the tree:
 *   • spatialDigest.js assembles exactly these keys — spatialGeometryVersion,
 *     costLawVersion, overlayVersion, settlementIds, cellCount, landCellCount,
 *     skippedSettlements, costField, territory, tiers, distanceMatrix, gates,
 *     routeReceipts, reserved. The per-cell centroid array `p` and the per-cell
 *     adjacency `c` are CONSUMED at build time and never persisted.
 *   • placementRaster.js's header records the same finding for wave G, which is
 *     why the autoplacer reads the LIVE pack and is a pre-canonize act.
 *   • steadingTopography.js's header records it a third time: "The frozen digest
 *     does not persist each settlement's own seed cell, so a RADIUS-based annulus
 *     is not derivable read-only."
 * Wave G's `cellDistance` therefore cannot serve here: it reads raster.x / raster.y,
 * which exist only before the realm is frozen. THE LAW IS THEREFORE WRITTEN IN THE
 * DIGEST'S OWN PERSISTED NEARNESS VOCABULARY, which is genuinely a distance — the
 * frozen integer cost field's Dijkstra, in the same units `pathCost` and every
 * travel-time seam already price the realm in.
 *
 * ── THE TWO EVIDENCE CLASSES (the same honesty steadingTopography's `source`
 *    field carries: name which measurement spoke, never blend them) ────────────
 *   • FRONTIER — the digest RECORDED this cell as the parent's side of a gate to a
 *     named neighbour N. The pair's whole cost is `distanceMatrix[parent][N]`, and
 *     the two approach halves sum to it EXACTLY; the Voronoi boundary is the
 *     equidistant locus, so each half is close to FRONTIER_SHARE of the pair. This
 *     is a per-candidate reading: two gate cells of the same parent toward two
 *     different neighbours read DIFFERENTLY, which is what makes the band bite
 *     inside one country instead of grading a whole territory at once.
 *   • HINTERLAND — no gate named this cell, so its distance to the parent is
 *     unmeasured and only ENVELOPED: at most the country's own radius (the widest
 *     frontier half), and therefore at least the country's narrowest frontier half
 *     from anybody else. The envelope is conservative in the direction that
 *     REFUSES, never in the direction that permits.
 *
 * ── WHY THE MIN END SKIPS THE SITE'S OWN TERRITORY OWNER (judgment, vetoable) ─
 * MIN_SEPARATION is evaluated against every settlement in the realm EXCEPT the one
 * whose country the candidate stands in. Not an exemption of convenience: the
 * digest persists no seed cell, so a hinterland candidate's lower bound on its
 * distance to its own owner is ZERO, and any positive band would refuse every
 * hinterland cell on the map and silently disable the wave-E satellite lane
 * entirely. §5b's own words are that "a satellite still PREFERS its parent's orbit
 * (wave E's annulus stands as the placement preference)" — the parent relationship
 * is the orbit law, already built and already enforced by `orbitAnnulus`'s
 * territory test; this band disciplines the site against the REST of the realm.
 * VETO restores the owner to the min census the day the digest persists seed cells.
 *
 * ── SATURATION IS DISCOVERED, NEVER COUNTED (J-P7) ──────────────────────────
 * There is no census, no stored count and no realm-wide sweep. `legalFoundingSites`
 * asks wave E for its bounded, Weyl-sampled candidate set and filters it; an EMPTY
 * answer IS the saturation signal, re-asked at every attempt as the map, the
 * occupied cells and the ruins change. Nothing here caches.
 *
 * ── THE USER EXCEPTION IS TOTAL (J-P8) ──────────────────────────────────────
 * A user-placed settlement is never refused and never relocated: `siteLegality`
 * short-circuits on the `user` provenance before a single band is read. The
 * exception runs one way only — a user settlement still CONSTRAINS engine
 * foundings, because the engine disciplines itself and never the DM's hand.
 *
 * ── ENUMERATION IS WAVE E'S, NOT A SECOND ONE ───────────────────────────────
 * The candidate set comes from `orbitAnnulus` verbatim: the capped set, the gates
 * first, and the Weyl-sampled hinterland. NEVER an arithmetic stride — that stride
 * aliases against a grid pack's row width and made a whole mountain ridge
 * structurally unreachable when it was measured in wave E.
 *
 * @enforced-by tests/domain/demographicsPlans.test.js
 */

import { TIER_ORDER } from '../../data/constants.js';
import { calibration } from '../spatial/distanceRead.js';
import { orbitAnnulus } from './steadingTopography.js';

/** @typedef {import('./steadingTopography.js').SteadingSite} SteadingSite */
/** @typedef {import('./steadingTopography.js').TopoDigest} TopoDigest */
/**
 * The digest read-shape this module needs BEYOND the topography one: the frozen
 * pairwise costs, the hop tiers and the recorded gates. Every field optional so a
 * ragged or legacy digest reads as "no evidence" rather than throwing.
 * @typedef {TopoDigest & {
 *   distanceMatrix?: Record<string, Record<string, number>>,
 *   tiers?: Record<string, Record<string, number>>,
 *   gates?: Array<{ between?: [string, string], cellA?: number, cellB?: number, cost?: number }>
 * }} LandDigest
 */

/** @param {unknown} v @param {number} fallback @returns {number} */
function num(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}
/** Codepoint comparator (device/locale-stable ordering). @param {string} a @param {string} b */
function codepoint(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}
/** @param {number} v @returns {number} 4dp, so a receipt compares by value across machines */
function round4(v) {
  return Math.round(v * 10000) / 10000;
}

/**
 * THE CLOSED REFUSAL VOCABULARY. Every candidate the law rejects names why, and
 * "no legal ground" is deliberately three different sentences: a realm with nothing
 * left to give, a realm whose every opening is too close to somebody, and a realm
 * whose openings are all out in the deep wild are three different worlds and the
 * Herald must be able to tell them apart in P4.
 * @type {ReadonlyArray<string>}
 */
export const PLACEMENT_REFUSALS = Object.freeze([
  'aspatial', 'beyond_reach', 'no_ground', 'none', 'occupied', 'too_close',
]);

/**
 * THE CLOSED EVIDENCE VOCABULARY — which reading measured this candidate.
 * @type {ReadonlyArray<string>}
 */
export const PLACEMENT_EVIDENCE = Object.freeze(['frontier', 'hinterland']);

/**
 * THE PER-TIER ELBOW — how much room, as a share of the realm's own median primary
 * hop, a settlement of each grade claims around itself. A thorp is a cluster of
 * roofs and wants almost nothing; a metropolis's outskirts, market gardens and
 * quarries ARE its elbow, and another settlement inside them is a suburb rather
 * than a neighbour. Design §10 tuning-pass property, owner-signed at the soak redo.
 * @type {Readonly<Record<string, number>>}
 */
export const TIER_ELBOW = Object.freeze({
  thorp: 0.10,
  hamlet: 0.14,
  village: 0.18,
  town: 0.24,
  city: 0.32,
  metropolis: 0.42,
});

/**
 * THE TIER-PAIR SEPARATION BAND (J-P6: a tier PAIR, never one global radius).
 * Both grades pay their elbow, so a steading beside a thorp is legal at 0.20 median
 * hops while the same steading beside a metropolis needs 0.52 — a frontier site,
 * which sits at roughly half a hop from each side, is comfortably legal against the
 * first and REFUSED against the second unless that pair is further apart than the
 * realm's typical neighbours. The 6x6 table is materialized and frozen here so a pin
 * reads the resolved law rather than re-deriving it, and so no bare float ever
 * reaches a surface (the finite-semantics law). VETO flattens this to one number.
 * @type {Readonly<Record<string, Readonly<Record<string, number>>>>}
 */
export const MIN_SEPARATION_BANDS = Object.freeze(Object.fromEntries(
  TIER_ORDER.map((a) => [a, Object.freeze(Object.fromEntries(
    TIER_ORDER.map((b) => [b, round4(num(TIER_ELBOW[a], 0.18) + num(TIER_ELBOW[b], 0.18))]),
  ))]),
));

export const SPATIAL_LAW_TUNING = Object.freeze({
  /** THE REACH LAW (§5b: "the realm grows contiguously, never as isolated pockets
   *  in the deep wild"). A founding may stand at most this many median primary hops
   *  from its NEAREST existing settlement, whichever settlement that is. Set above
   *  one hop because a frontier site legitimately sits between two neighbours, and
   *  below two because a place further from everything than a typical pair of
   *  neighbours are from each other is a pocket rather than a frontier. */
  MAX_REACH: 1.25,
  /** How the pair's cost splits between its two approach halves. The two halves sum
   *  to the pair cost EXACTLY (spatialDigest builds a crossing as approachA + step +
   *  approachB); the Voronoi boundary is the equidistant locus, so each half is
   *  close to one half of the pair. This is the estimator, named as one. */
  FRONTIER_SHARE: 0.5,
  /** An unrecognized tier reads as the MIDDLE of the ladder, never the top: an
   *  unknown token may not claim a metropolis's elbow. */
  DEFAULT_TIER: 'village',
});

const T = SPATIAL_LAW_TUNING;

/** The tier a token resolves to, always a TIER_ORDER member. @param {unknown} tier */
function tierWord(tier) {
  const raw = String(tier || '');
  return TIER_ORDER.includes(raw) ? raw : T.DEFAULT_TIER;
}

/**
 * THE REALM'S OWN SCALE — the median primary-hop cost, read through the digest's
 * ONE calibration (distanceRead.calibration, memoized per digest). Every band above
 * is a multiple of this, so the law means the same thing on a pocket duchy and on a
 * continent, and nothing here invents a second notion of "how big is this realm".
 * @param {LandDigest|null|undefined} digest @returns {number}
 */
export function realmScaleOf(digest) {
  if (!digest) return 0;
  return Math.max(1, num(calibration(/** @type {Parameters<typeof calibration>[0]} */ (
    /** @type {unknown} */ (digest))).medianPrimaryHopCost, 1));
}

/**
 * THE FRONTIER MAP of one parent: every cell the digest recorded as the parent's
 * own side of a gate, carrying the CHEAPEST neighbour reachable through it. A cell
 * can be the parent's side of more than one crossing; the cheapest wins, because
 * the nearest neighbour is the one the separation band must answer to.
 * @param {LandDigest|null|undefined} digest @param {string} parentId
 * @returns {Map<number, { neighbourId: string, pairCost: number }>}
 */
export function frontierMapOf(digest, parentId) {
  /** @type {Map<number, { neighbourId: string, pairCost: number }>} */
  const out = new Map();
  const gates = Array.isArray(digest?.gates) ? digest.gates : [];
  const parent = String(parentId);
  const matrix = asObject(digest?.distanceMatrix);
  for (const gate of gates) {
    const between = Array.isArray(gate?.between) ? gate.between.map(String) : [];
    if (between.length !== 2 || !between.includes(parent)) continue;
    // `cellA` lies in `between[0]`'s territory and `cellB` in `between[1]`'s — the
    // digest's crossing builder sorts the pair codepoint-wise and assigns the cells
    // to match, so the parent's own side is chosen by that same comparison.
    const mine = between[0] === parent ? num(gate?.cellA, -1) : num(gate?.cellB, -1);
    const neighbourId = between[0] === parent ? between[1] : between[0];
    if (!Number.isInteger(mine) || mine < 0) continue;
    // The PAIR cost is read from the distance matrix rather than from the gate's own
    // `cost`, because the matrix is the Floyd-Warshall answer and a gate may be more
    // expensive than the cheapest route between the same two settlements.
    const pairCost = num(asObject(matrix[parent])[neighbourId], num(gate?.cost, 0));
    if (!(pairCost > 0)) continue;
    const prior = out.get(mine);
    if (!prior || pairCost < prior.pairCost
      || (pairCost === prior.pairCost && codepoint(neighbourId, prior.neighbourId) < 0)) {
      out.set(mine, { neighbourId, pairCost });
    }
  }
  return out;
}

/**
 * @typedef {Object} CountryReach
 * @property {string|null} nearestId    the parent's closest primary neighbour
 * @property {number} nearestHalf       that pair's approach half (the tightest frontier)
 * @property {number} radius            the WIDEST frontier half — the country's envelope
 * @property {number} primaryCount      how many direct territory neighbours the parent has
 */

/**
 * THE COUNTRY'S ENVELOPE — how far the parent's own ground can possibly reach.
 * A parent with NO primary neighbour is an island: its radius is Infinity, every
 * hinterland cell is beyond reach, and the realm may not sprawl into it. That is the
 * isolated-pocket law biting exactly where §5b aims it.
 * @param {LandDigest|null|undefined} digest @param {string} parentId
 * @returns {CountryReach}
 */
export function countryReachOf(digest, parentId) {
  const parent = String(parentId);
  const row = asObject(asObject(digest?.distanceMatrix)[parent]);
  const tierRow = asObject(asObject(digest?.tiers)[parent]);
  /** @type {string|null} */
  let nearestId = null;
  let nearestHalf = Infinity;
  let radius = 0;
  let primaryCount = 0;
  for (const other of Object.keys(tierRow).sort(codepoint)) {
    if (Number(tierRow[other]) !== 1) continue;         // primary = a direct territory neighbour
    const cost = num(row[other], 0);
    if (!(cost > 0)) continue;
    primaryCount += 1;
    const half = cost * T.FRONTIER_SHARE;
    if (half < nearestHalf) { nearestHalf = half; nearestId = other; }
    if (half > radius) radius = half;
  }
  return {
    nearestId,
    nearestHalf: primaryCount ? nearestHalf : Infinity,
    radius: primaryCount ? radius : Infinity,
    primaryCount,
  };
}

/**
 * EVERY CELL AN ENGINE FOUNDING ALREADY HOLDS, realm-wide.
 *
 * WAVE E ASKED A NARROWER QUESTION than P3 needs. `orbitAnnulus` is handed only the
 * PARENT's own steadings, which is right for the orbit preference and wrong for a
 * realm-wide law: two adjacent parents could otherwise plant two steadings on the
 * same cell, each blind to the other. §5b says the band is measured against the
 * WHOLE realm, so the occupancy census is too.
 * @param {Record<string, unknown>|null|undefined} worldState
 * @returns {Set<number>}
 */
export function occupiedCellsOf(worldState) {
  /** @type {Set<number>} */
  const out = new Set();
  const ledger = asObject(asObject(asObject(worldState).spatialLedgers).satellites);
  for (const parentId of Object.keys(ledger).sort(codepoint)) {
    const steadings = asObject(asObject(ledger[parentId]).steadings);
    for (const satId of Object.keys(steadings).sort(codepoint)) {
      const cell = num(asObject(asObject(steadings[satId]).site).cell, -1);
      if (Number.isInteger(cell) && cell >= 0) out.add(cell);
    }
  }
  return out;
}

/**
 * @typedef {Object} SiteLegality
 * @property {boolean} legal
 * @property {string} refusal      one of PLACEMENT_REFUSALS
 * @property {string} evidence     one of PLACEMENT_EVIDENCE
 * @property {number} reach        the candidate's distance to its nearest settlement
 * @property {string|null} nearestId
 * @property {number} tightest     the tightest separation bound the census found
 * @property {string|null} tightestId  which settlement set it
 * @property {boolean} exempt      true only for the sovereign hand (J-P8)
 */

/**
 * IS THIS ONE CANDIDATE LEGAL GROUND? The whole of §5b for a single site.
 *
 * THE USER EXCEPTION RUNS FIRST AND TOTAL (J-P8): a `user` provenance returns legal
 * before a band is read, so no arrangement of the realm can ever refuse or relocate
 * a settlement the DM placed. The exception is one-way; user settlements still
 * appear in the census below and still constrain the engine.
 *
 * @param {Object} input
 * @param {LandDigest|null|undefined} input.digest
 * @param {string} input.parentId          the territory the candidate stands in
 * @param {number} input.cell
 * @param {string} input.newTier           the grade being founded
 * @param {(id: string) => string} input.tierOf  every existing settlement's grade
 * @param {Map<number, { neighbourId: string, pairCost: number }>} input.frontier
 * @param {CountryReach} input.country
 * @param {ReadonlySet<number>} input.occupied
 * @param {number} input.scale
 * @param {string} [input.provenance]      'engine' (default) or 'user'
 * @param {Readonly<Record<string, Readonly<Record<string, number>>>>} [input.bands]
 *   The tier-pair table, INJECTABLE so a pin can execute the law with the band
 *   flattened and watch the J-P6 distinction disappear. Omitted — which is every
 *   production call — it is MIN_SEPARATION_BANDS, and the law is the authored one.
 * @returns {SiteLegality}
 */
export function siteLegality(input) {
  const evidenceless = { evidence: 'hinterland', reach: 0, nearestId: null, tightest: 0, tightestId: null };
  if (String(input.provenance || 'engine') === 'user') {
    return { legal: true, refusal: 'none', exempt: true, ...evidenceless };
  }
  const cell = num(input.cell, -1);
  if (input.occupied.has(cell)) {
    return { legal: false, refusal: 'occupied', exempt: false, ...evidenceless };
  }

  // ── WHICH READING MEASURED THIS CELL ──
  const gate = input.frontier.get(cell) || null;
  const evidence = gate ? 'frontier' : 'hinterland';
  const half = gate ? gate.pairCost * T.FRONTIER_SHARE : input.country.radius;
  const nearestId = gate ? gate.neighbourId : input.country.nearestId;

  // ── THE MAX END: no farther than MAX_REACH from the NEAREST settlement ──
  const maxReach = T.MAX_REACH * input.scale;
  if (!(half <= maxReach)) {
    return {
      legal: false, refusal: 'beyond_reach', exempt: false,
      evidence, reach: Number.isFinite(half) ? round4(half) : -1, nearestId,
      tightest: 0, tightestId: null,
    };
  }

  // ── THE MIN END: no closer than the tier-pair band to ANY OTHER settlement ──
  // The candidate's distance to a settlement S is bounded below by the triangle
  // inequality against its own territory owner: d(cell, S) >= d(parent, S) - d(parent,
  // cell), and d(parent, cell) is `half` (measured for a frontier cell, enveloped for
  // a hinterland one). Every settlement in the realm is visited; the owner is skipped
  // for the reason the header records.
  const parent = String(input.parentId);
  const matrix = asObject(asObject(input.digest).distanceMatrix);
  const row = asObject(matrix[parent]);
  const ids = Array.isArray(input.digest?.settlementIds) ? input.digest.settlementIds.map(String) : [];
  let tightest = Infinity;
  /** @type {string|null} */
  let tightestId = null;
  /** @type {string|null} */
  let breach = null;
  for (const other of ids.slice().sort(codepoint)) {
    if (other === parent) continue;
    const pair = num(row[other], 0);
    // An unreachable settlement is infinitely far by the frozen metric; it can never
    // be the one a founding crowds, and treating an absent entry as zero would refuse
    // every founding on a disconnected map.
    if (!(pair > 0)) continue;
    const bound = gate && other === gate.neighbourId ? half : Math.max(0, pair - half);
    const table = input.bands || MIN_SEPARATION_BANDS;
    const band = num(asObject(table[tierWord(input.newTier)])[tierWord(input.tierOf(other))], 0);
    const required = band * input.scale;
    if (bound < tightest) { tightest = bound; tightestId = other; }
    if (bound < required && breach === null) breach = other;
  }
  if (breach !== null) {
    return {
      legal: false, refusal: 'too_close', exempt: false,
      evidence, reach: round4(half), nearestId,
      tightest: Number.isFinite(tightest) ? round4(tightest) : -1, tightestId: breach,
    };
  }
  return {
    legal: true, refusal: 'none', exempt: false,
    evidence, reach: round4(half), nearestId,
    tightest: Number.isFinite(tightest) ? round4(tightest) : -1, tightestId,
  };
}

/**
 * @typedef {Object} LegalGround
 * @property {ReadonlyArray<SteadingSite & { legality: SiteLegality }>} sites  the legal candidates
 * @property {number} considered   how many candidates wave E's bounded set offered
 * @property {Record<string, number>} refusals  the closed refusal tally
 * @property {boolean} saturated   no legal ground remains HERE, discovered this attempt
 * @property {boolean} applicable  false on an aspatial world, where there is no land ledger
 * @property {number} scale        the realm's median primary hop, for the receipt
 */

/**
 * THE LEGAL GROUND, DISCOVERED (§5b + J-P7).
 *
 * Wave E's bounded, Weyl-sampled candidate set, filtered by the band. The answer is
 * never cached and never a census: ask again next tick and the map, the occupied
 * cells and the ruins may have changed the answer, which is the design's own
 * "cheap and honest, re-asked every attempt".
 *
 * AN ASPATIAL WORLD HAS NO LAND LEDGER. There is no map to crowd, so the law is
 * INAPPLICABLE rather than violated: `applicable` reads false, `saturated` reads
 * false, and the caller keeps wave E's own behaviour verbatim. Reporting saturation
 * there would stop an aspatial realm founding anything, which is a bug wearing a
 * law's clothes.
 *
 * @param {Object} input
 * @param {LandDigest|null|undefined} input.digest
 * @param {Record<string, unknown>|null|undefined} input.worldState
 * @param {string} input.parentId
 * @param {string} input.newTier
 * @param {(id: string) => string} input.tierOf
 * @param {ReadonlySet<string>} [input.prefer]  the seam's own grounds (wave E's weighting)
 * @returns {LegalGround}
 */
export function legalFoundingSites(input) {
  /** @type {Record<string, number>} */
  const refusals = {};
  const bump = (/** @type {string} */ word) => { refusals[word] = (refusals[word] || 0) + 1; };
  if (!input.digest) {
    bump('aspatial');
    return { sites: Object.freeze([]), considered: 0, refusals, saturated: false, applicable: false, scale: 0 };
  }

  const occupied = occupiedCellsOf(input.worldState);
  const candidates = orbitAnnulus(input.digest, input.parentId, {
    occupied: [...occupied],
    prefer: input.prefer instanceof Set ? input.prefer : new Set(),
  });
  if (!candidates.length) {
    bump('no_ground');
    return {
      sites: Object.freeze([]), considered: 0, refusals,
      saturated: true, applicable: true, scale: realmScaleOf(input.digest),
    };
  }

  const scale = realmScaleOf(input.digest);
  const frontier = frontierMapOf(input.digest, input.parentId);
  const country = countryReachOf(input.digest, input.parentId);
  /** @type {Array<SteadingSite & { legality: SiteLegality }>} */
  const sites = [];
  for (const site of candidates) {
    const legality = siteLegality({
      digest: input.digest,
      parentId: input.parentId,
      cell: site.cell,
      newTier: input.newTier,
      tierOf: input.tierOf,
      frontier, country, occupied, scale,
    });
    bump(legality.refusal);
    if (legality.legal) sites.push({ ...site, legality });
  }
  return {
    sites: Object.freeze(sites),
    considered: candidates.length,
    refusals,
    saturated: sites.length === 0,
    applicable: true,
    scale,
  };
}

/**
 * CHOOSE ONE LEGAL SITE — a suitability-weighted pick over the ground the law
 * allowed, taken against a KEYED HASH rather than a stream.
 *
 * ZERO DRAWS, DELIBERATELY. P1 pins that each settlement consumes exactly two draws
 * from its own `demographics:<id>` fork, and P1a and P2 both chose the hash idiom so
 * that pin survives every new lane. A lane that opened a stream here could steal
 * draws from one that does not (the wave-E stream-theft law), so the key carries the
 * whole of the identity instead: realm, settlement, episode, and the word `site`.
 *
 * @param {Object} input
 * @param {ReadonlyArray<SteadingSite & { legality: SiteLegality }>} input.sites
 * @param {Readonly<Record<string, number>>} input.suitability  landform -> weight
 * @param {number} input.roll  a 0..1 keyed hash
 * @returns {(SteadingSite & { legality: SiteLegality })|null}
 */
export function chooseLegalSite(input) {
  const field = Array.isArray(input.sites) ? input.sites : [];
  if (!field.length) return null;
  const ordered = field.slice().sort((a, b) => a.cell - b.cell);
  let total = 0;
  for (const site of ordered) total += Math.max(0, num(input.suitability[site.landform], 1));
  if (!(total > 0)) return ordered[0];
  let r = Math.max(0, Math.min(1, num(input.roll, 0))) * total;
  for (const site of ordered) {
    r -= Math.max(0, num(input.suitability[site.landform], 1));
    if (r < 0) return site;
  }
  return ordered[ordered.length - 1];
}

/**
 * THE LAW'S OWN SENTENCE for a receipt (the legibility law: a person reads why the
 * ground was refused, never a code). Total over the closed refusal vocabulary.
 * @param {LegalGround} ground @param {string} parentName @returns {string}
 */
export function landLine(ground, parentName) {
  if (!ground.applicable) return `${parentName} keeps no map of its own country.`;
  if (!ground.saturated) {
    return `${parentName} still has ${ground.sites.length} open sites inside its own country.`;
  }
  const beyond = num(ground.refusals.beyond_reach, 0);
  const close = num(ground.refusals.too_close, 0);
  if (!ground.considered) return `There is no open ground left in ${parentName}'s country.`;
  if (beyond >= close) return `Every opening left to ${parentName} lies out beyond the reach of any road.`;
  return `Every opening left to ${parentName} stands too near a neighbour to take.`;
}
