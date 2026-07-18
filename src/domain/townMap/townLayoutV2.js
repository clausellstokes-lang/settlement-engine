/**
 * domain/townMap/townLayoutV2.js — THE v2 SEMANTIC LAYOUT ENGINE (task #38).
 *
 * A SIBLING generation under the same view-time projection architecture as v1
 * (townMapModel.js): it emits the IDENTICAL TownMapModel output contract (frame /
 * skeleton / districts / buildings / fortifications / overlays / reserved), so the
 * draw layer, all four style lenses, the exports matrix, the hover model, and the
 * mapEdits pin/redraw path ALL inherit it with zero changes — v2 is a better
 * geometry under the same substrate, never a rewrite of the renderer.
 *
 * "MEDIEVAL FORM, MODERN COMPOSITION." Form is drawn from real historical
 * settlement morphology (Carcassonne-concentric, Lübeck harbor-fan, Durham
 * river-spine, bastide grid where the fiction justifies); composition is judged by
 * Kevin Lynch's five imageability elements — used as the engine's OWN self-scoring
 * rubric (lynchRubric.js) inside a bounded-retry loop — folded with Jacobs /
 * Alexander / Gehl / density-gradient principles. A candidate must RATE before
 * acceptance.
 *
 * SEMANTIC PLACEMENT is the advantage no generic generator has: the layout reads
 * the actual dossier — a district's category and its quarter `location` prose (the
 * tannery downwind, the docks on the water, the manor on the hill), the total
 * institution→district assignment, and the URBAN FABRIC memory (per-district
 * prominence, alignment drift, stressor scars, catastrophe rebirths) when it is lit.
 * When the fabric layer is dark, the engine falls back to full-quality current-state
 * derivation (fabric absence is NOT neutrality — drift null ≠ 0.5).
 *
 * DETERMINISM — the same hard contract as v1: the rng is derived INTERNALLY from the
 * settlement seed under a SEPARATE `${seed}::town-map:v2` fork (v1's fork is
 * untouched, so v1 settlements are byte-identical); geometry uses only the
 * correctly-rounded IEEE ops (+ - * / round/min/max/sqrt) and a hardcoded INTEGER
 * direction table — never Math.cos/sin/trig; every iteration that lands in output or
 * feeds an rng draw is codepoint-sorted first; output key order is fixed. Purity-
 * banned by the townMap domain source-scan: no Date, no Math.random, no localeCompare.
 */

import { createPRNG } from '../../kernel/prng.js';
import { clamp } from '../../kernel/math.js';
import { compareCodepoint } from '../deterministicSort.js';
import { deriveAllDistricts } from '../districtProfile.js';
import { deriveMapProfile } from '../mapProfile.js';
import { resolveTerrain } from '../resolveTerrain.js';
import { defenseProfileHasWalls } from '../causalState.js';
import { deriveAllActiveConditions } from '../activeConditions.js';
import { popToTier, TIER_ORDER } from '../../data/constants.js';
import { anchorForInstitution, anchorForDistrict } from './anchors.js';
import { assignInstitutionsToDistricts } from './institutionAssignment.js';
import {
  fabricStocksFor, fabricDriftOf, fabricScarsOf, fabricRebirthsOf, hasFabric,
} from './fabricRead.js';
import { scoreLynch, LYNCH_ACCEPT_FLOOR } from './lynchRubric.js';
import {
  extractAsymmetrySources, netDisplacement, regionalGrain, leanPolygon, desirePaths,
} from './asymmetrySources.js';
import {
  generateSite, responseModeFor, nucleateCore, latentAdvantageMap, reconciliationDisplacement,
} from './siteGenesis.js';

// ── Version axes (v2 declares new geometry + law; overlays unchanged from v1) ──
export const TOWN_MAP_GEOMETRY_VERSION_V2 = 2;
export const LAYOUT_LAW_VERSION_V2 = 2;
export const TOWN_MAP_OVERLAY_VERSION = 1;

/** How many candidate arrangements the bounded-retry loop may draw before it
 *  accepts the best-scoring one it has seen (FULL fallback: it always returns a
 *  map — the floor is a target, not a gate). Vetoable tuning constant. */
export const MAX_LAYOUT_RETRIES = 6;

const VIEW = 1000;
const CENTER = 500;
const EXTENT = 430;

/** Sixteen integer unit directions (×100), hand-computed — no runtime trig. */
const COMPASS = Object.freeze([
  [0, -100], [38, -92], [71, -71], [92, -38],
  [100, 0], [92, 38], [71, 71], [38, 92],
  [0, 100], [-38, 92], [-71, 71], [-92, 38],
  [-100, 0], [-92, -38], [-71, -71], [-38, -92],
]);

/** Category centrality: lower ⇒ pulled to the inner rings (the historic core), the
 *  civic/faith/noble heart; higher ⇒ pushed to the periphery (the noxious trades,
 *  the shadow dens, the foreign quarter beyond the gate).
 *  @type {Readonly<Record<string, number>>} */
const CATEGORY_CENTRALITY = Object.freeze({
  civic: 0, religious: 1, noble: 1, merchant: 2, arcane: 3, craft: 3,
  residential: 4, other: 4, military: 4, foreign: 5, industrial: 6, criminal: 6,
});

/** roadImportance band → integer stroke weight (same table as v1).
 *  @type {Readonly<Record<string, number>>} */
const ROAD_WEIGHT = Object.freeze({ low: 1, moderate: 2, major: 3, critical: 4 });

/** defensiveTerrain band → wall weight (readiness styles the wall). */
const DEFENSIVE_BANDS = Object.freeze(['exposed', 'open', 'mixed', 'sheltered', 'fortified']);

/** Aggregate (district-fill at city+) categories: lodging / mass residential. */
const AGGREGATE_RE = /lodging|residential|tenement|housing|hostel|dormitor|boarding|slum|almshouse|\binn\b|\btavern/i;

/**
 * @typedef {Object} TownDistrict
 * @property {string} id @property {string} name @property {string} category
 * @property {string} anchorKey @property {boolean} synthetic
 * @property {Array<[number,number]>} polygon @property {{x:number,y:number}} centroid
 * @property {string} wealth @property {string} safety
 */
/** @typedef {{ element:string, sourceFamily:string, sourceRef:string, effect:string }} ProvEntry */
/**
 * One layout candidate the retry loop scores — the model sections plus the rubric's
 * `nodes` + the accumulated `provenance`.
 * @typedef {Object} Candidate
 * @property {string} morphology
 * @property {{ water: import('./townMapModel.js').TownMapWater|null, roads: import('./townMapModel.js').TownMapRoad[], landform?: import('./siteGenesis.js').TownLandform }} frame
 * @property {{ anchor: { x:number, y:number, kind:string }, pattern: string, streets: Array<{ from:{x:number,y:number}, to:{x:number,y:number} }> }} skeleton
 * @property {import('./townMapModel.js').TownMapDistrict[]} districts
 * @property {import('./townMapModel.js').TownMapBuilding[]} buildings
 * @property {import('./townMapModel.js').TownMapFortifications|null} fortifications
 * @property {{ hazards: import('./townMapModel.js').TownMapHazard[], conditions: import('./townMapModel.js').TownMapConditionBadge[] }} overlays
 * @property {Array<{ x:number, y:number }>} nodes
 * @property {ProvEntry[]} provenance
 */
/**
 * An institution as this engine reads it (anchor identity + placement/aggregate cues).
 * @typedef {Object} TownInstitution
 * @property {string} [name] @property {string} [catalogId] @property {string} [localUid]
 * @property {string} [priorityCategory] @property {string} [category] @property {string[]} [tags]
 */
/**
 * The dossier the layout reads. Fields are optional (settlements arrive partial); the
 * shapes are the null-safe "as-consumed" reads, structurally compatible with the
 * district/map profile settlement contracts this file forwards `settlement` into.
 * @typedef {Object} TownV2Settlement
 * @property {string|number|null} [_seed] @property {string} [id] @property {string} [tier]
 * @property {number} [population]
 * @property {{ tradeRouteAccess?: string, terrainType?: string, biome?: string, terrainOverride?: string, monsterThreat?: string }} [config]
 * @property {{ quarters?: Array<{ location?: string }> }} [spatialLayout]
 * @property {TownInstitution[]} [institutions]
 * @property {{ hasWalls?: unknown, walls?: unknown, institutions?: { walls?: unknown } }} [defenseProfile]
 * @property {{ exports?: string[], prosperity?: string|{ label?: string, tier?: string } }} [economicState]
 * @property {unknown} [urbanFabric]
 */
/**
 * A ranked district descriptor (a real quarter, or the synthetic hamlet floor).
 * @typedef {Object} TownDistrictSource
 * @property {string} id @property {string} name @property {string} category
 * @property {string} wealth @property {string} safety
 * @property {boolean} synthetic @property {string} location
 */
/**
 * The urban-fabric memory as read for a settlement (empty/null when the layer is dark).
 * @typedef {Object} FabricRead
 * @property {boolean} has
 * @property {Record<string, number>} stocks
 * @property {number|null} drift
 * @property {Array<{ kind:string, severity:number, week:number }>} scars
 * @property {Array<{ classes:string[], type:string, week:number }>} rebirths
 */
/**
 * The shared generation context threaded through the candidate pipeline (built once per
 * buildTownLayoutV2 call, read by every stage). Field types mirror their sources.
 * @typedef {Object} LayoutCtx
 * @property {string} seed
 * @property {string} baseKey
 * @property {string} tier
 * @property {number} tierIndex
 * @property {string|null} terrain
 * @property {string|null} tradeAccess
 * @property {boolean} hasWalls
 * @property {boolean} isCoast
 * @property {boolean} isRiver
 * @property {import('../mapProfile.js').MapProfile} mapProfile
 * @property {import('../activeConditions.js').ActiveCondition[]} activeConditions
 * @property {TownInstitution[]} institutions
 * @property {import('./institutionAssignment.js').AssignmentResult} assignment
 * @property {TownDistrictSource[]} sources
 * @property {FabricRead} fabric
 * @property {import('./townMapModel.js').TownMapWater|null} water
 * @property {{ x:number, y:number }|null} waterAnchor
 * @property {{ x:number, y:number }} core
 * @property {number} roadCount
 * @property {number} roadWeight
 * @property {import('./asymmetrySources.js').AsymmetrySource[]} asym
 * @property {import('./siteGenesis.js').TownSite} site
 * @property {'exploit'|'endure'|'fortify'} responseMode
 * @property {Array<{ attractorRef:string, declinedBy:string, latentValue01:number, point:{ x:number, y:number } }>} latent
 */

// ── deterministic vector helpers (integer direction table only) ───────────────
/** Point at compass `dir`, `pct` percent of EXTENT from a center.
 * @param {number} cx @param {number} cy @param {number[]} dir @param {number} pct
 * @returns {{x:number,y:number}} */
function polar(cx, cy, dir, pct) {
  return { x: cx + Math.round((dir[0] * pct * EXTENT) / 10000), y: cy + Math.round((dir[1] * pct * EXTENT) / 10000) };
}
/** Perpendicular of a compass unit vector (for angular width).
 * @param {number[]} dir @returns {number[]} */
function perp(dir) { return [-dir[1], dir[0]]; }

/** Parse a quarter's `location` prose into placement biases (semantic placement).
 * Absent/unknown ⇒ neutral. @param {string} text @returns {{ ringPush:number, water:number, elevated:number, dirIdx:number|null }} */
function locationBias(text) {
  const t = String(text || '').toLowerCase();
  let ringPush = 0;    // + pushes outward, − pulls inward
  let water = 0;       // + pulls toward the water anchor
  let elevated = 0;    // + raises pseudo-elevation (hills/heights) for the panorama
  let dirIdx = null;   // a cardinal hint
  if (/\b(central|centre|center|heart|core|market|forum)\b/.test(t)) ringPush -= 22;
  if (/\b(edge|outer|outskirt|fringe|beyond|periph|wall|faubourg|suburb)\b/.test(t)) ringPush += 26;
  if (/\b(downwind|downstream|tannery|noxious|refuse|midden)\b/.test(t)) { ringPush += 18; water += 30; }
  if (/\b(dock|docks|wharf|quay|harbou?r|waterfront|riverside|riverbank|shore|pier|bank)\b/.test(t)) water += 55;
  if (/\b(hill|hilltop|height|heights|upper|mount|crag|bluff|acropolis)\b/.test(t)) { elevated += 60; ringPush -= 10; }
  if (/\bnorth\b/.test(t)) dirIdx = 0;
  else if (/\b(north.?east|ne)\b/.test(t)) dirIdx = 2;
  else if (/\beast\b/.test(t)) dirIdx = 4;
  else if (/\b(south.?east|se)\b/.test(t)) dirIdx = 6;
  else if (/\bsouth\b/.test(t)) dirIdx = 8;
  else if (/\b(south.?west|sw)\b/.test(t)) dirIdx = 10;
  else if (/\bwest\b/.test(t)) dirIdx = 12;
  else if (/\b(north.?west|nw)\b/.test(t)) dirIdx = 14;
  return { ringPush, water, elevated, dirIdx };
}

/** Choose the settlement morphology from water, walls, tier, terrain (form vocab).
 * @param {{ isCoast:boolean, isRiver:boolean, hasWalls:boolean, tierIndex:number, terrain:string|null }} morphInputs */
function selectMorphology({ isCoast, isRiver, hasWalls, tierIndex, terrain }) {
  if (isCoast) return 'harbor-fan';       // Lübeck — quays fan inland from the water
  if (isRiver) return 'river-spine';      // Durham — the town straddles a river bend
  if (hasWalls) return 'concentric';      // Carcassonne — a walled core in growth rings
  if (tierIndex >= 4 && (terrain === 'plains' || terrain === 'desert')) return 'bastide-grid'; // a planned grid town
  return 'organic-radial';                // the common irregular market village
}

/**
 * Build the v2 render model (the same shape as buildTownMapModel v1). PURE.
 *
 * THE STAGED GENERATIVE PIPELINE (owner-fixed order): (0) THE SITE → (1) THE ECONOMIC
 * FIELD → (2) GENESIS CORE nucleated ON the field → (3) roads follow gradients → (4)
 * districts pull to attractors + (fabric-lit) reconcile with the site → (5) composition
 * pass (Lynch acceptance, plan-response wall). Substance from the dossier; expression
 * from the seed fork.
 * @param {TownV2Settlement|null|undefined} settlement
 * @param {{ layoutVariant?: number, pins?: Array<{ anchor?: string, dx?: number, dy?: number }>, layoutLawVersion?: number } | null | undefined} [mapEdits]
 * @returns {import('./townMapModel.js').TownMapModel}
 */
export function buildTownLayoutV2(settlement, mapEdits = null) {
  const s = settlement || {};

  const variant = Number.isInteger(mapEdits?.layoutVariant) && Number(mapEdits?.layoutVariant) > 0
    ? Number(mapEdits?.layoutVariant) : 0;
  const seed = String(s._seed ?? s.id ?? 'town-map-seedless');
  const baseKey = variant ? `${seed}::town-map:v2::variant:${variant}` : `${seed}::town-map:v2`;

  // ── composed derivations (all pure reads — same sources as v1) ──────────────
  const derivedDistricts = deriveAllDistricts(s);
  const mapProfile = deriveMapProfile(s);
  const terrain = resolveTerrain(s.config);
  const cfg = s.config && typeof s.config === 'object' ? s.config : {};
  const tradeAccess = typeof cfg.tradeRouteAccess === 'string' ? cfg.tradeRouteAccess : null;
  const realmBiome = typeof cfg.biome === 'string' ? cfg.biome
    : (typeof cfg.terrainOverride === 'string' ? cfg.terrainOverride : null);
  const monsterThreat = typeof cfg.monsterThreat === 'string' ? cfg.monsterThreat : null;
  const hasWalls = defenseProfileHasWalls(s.defenseProfile);
  const activeConditions = deriveAllActiveConditions(s);
  const tier = typeof s.tier === 'string' && TIER_ORDER.indexOf(s.tier) >= 0
    ? s.tier : popToTier(typeof s.population === 'number' ? s.population : 0);
  const tierIndex = Math.max(0, TIER_ORDER.indexOf(tier));
  const institutions = Array.isArray(s.institutions) ? s.institutions : [];
  const isCoast = tradeAccess === 'port' || tradeAccess === 'coastal' || terrain === 'coastal';
  const isRiver = terrain === 'riverside' || tradeAccess === 'river';
  const exportsList = Array.isArray(s.economicState?.exports) ? s.economicState.exports : [];

  // ── URBAN FABRIC memory (empty/null when dark — absence is not neutrality) ──
  /** @type {FabricRead} */
  const fabric = {
    has: hasFabric(s),
    stocks: fabricStocksFor(s),
    drift: fabricDriftOf(s),
    scars: fabricScarsOf(s),
    rebirths: fabricRebirthsOf(s),
  };

  // ── total institution→district assignment (same assigner ⇒ stable anchors) ──
  const assignRng = createPRNG(`${baseKey}::assign`);
  const assignment = assignInstitutionsToDistricts(institutions, derivedDistricts, assignRng);

  // ── district descriptors (real districts, or the synthetic hamlet floor) ────
  /** @type {TownDistrictSource[]} */
  let sources;
  if (assignment.floored && assignment.syntheticDistrict) {
    sources = [{
      id: assignment.syntheticDistrict.id, name: assignment.syntheticDistrict.name,
      category: assignment.syntheticDistrict.category, wealth: 'modest', safety: 'watched',
      synthetic: true, location: '',
    }];
  } else {
    const quarters = Array.isArray(s.spatialLayout?.quarters) ? s.spatialLayout.quarters : [];
    sources = derivedDistricts.map((d, i) => ({
      id: d.id, name: d.name,
      category: typeof d.category === 'string' ? d.category : 'other',
      wealth: d.wealth, safety: d.safety, synthetic: false,
      location: typeof quarters[i]?.location === 'string' ? quarters[i].location : '',
    }));
  }
  sources.sort((a, b) => compareCodepoint(a.id, b.id));

  // ── STAGE 0 — THE SITE (physical setting; substance-from-dossier, expression-from-seed) ─
  const site = generateSite({ terrain, tradeAccess, isCoast, isRiver, exports: exportsList, realmBiome, seed });
  const responseInfo = responseModeFor({ hasWalls, siteKind: site.kind, monsterThreat, seed });
  const responseMode = responseInfo.mode;
  const water = site.water;
  const waterAnchor = site.waterAnchor;
  const defaultCore = (site.kind === 'coast' && waterAnchor)
    ? { x: 500, y: waterAnchor.y > 500 ? 640 : 360 }
    : (isRiver || site.kind === 'river' || site.kind === 'marsh') ? { x: 500, y: 470 } : { x: 500, y: 500 };
  const roadCount = tradeAccess === 'crossroads' ? 4
    : (tradeAccess === 'port' || tradeAccess === 'road') ? 3
      : tradeAccess === 'isolated' ? 1 : 2;
  const roadWeight = ROAD_WEIGHT[mapProfile.outputs.roadImportance] ?? 2;
  const canonGates = [];
  for (let i = 0; i < roadCount; i++) {
    const di = (Math.round((i * 16) / roadCount)) % 16;
    const p = polar(defaultCore.x, defaultCore.y, COMPASS[di], 118);
    canonGates.push({ x: clamp(p.x, 0, VIEW), y: clamp(p.y, 0, VIEW) });
  }

  // ── STAGE 1 — THE ECONOMIC FIELD (attractors laid onto the site, dossier-derived) ─
  const asym = extractAsymmetrySources({
    terrain, core: defaultCore, waterAnchor, gatePoints: canonGates, exports: exportsList,
    prosperity01: prosperityScore(s), presentCategories: new Set(sources.map((d) => d.category)), seed,
  });
  // THE LATENT ADVANTAGE MAP — the attractors the founding response mode declined.
  const latent = latentAdvantageMap(asym, responseMode);

  // ── STAGE 2 — GENESIS CORE nucleates ON the field (not the abstract center) ──
  const core = nucleateCore(asym.map((a) => ({ point: a.point, strength: a.strength })), canonGates, defaultCore);

  /** @type {LayoutCtx} */
  const ctx = {
    seed, baseKey, tier, tierIndex, terrain, tradeAccess, hasWalls, isCoast, isRiver,
    mapProfile, activeConditions, institutions, assignment, sources, fabric,
    water, waterAnchor, core, roadCount, roadWeight, asym, site, responseMode, latent,
  };

  // ── the bounded-retry loop: draw candidates, RATE each, keep the best ────────
  /** @type {Candidate|null} */
  let best = null;
  /** @type {Record<string, number>|null} */
  let bestScore = null;
  let retries = 0;
  for (let attempt = 0; attempt < MAX_LAYOUT_RETRIES; attempt++) {
    const candidate = generateCandidate(ctx, attempt);
    const score = scoreLynch(candidate);
    // `bestScore` is non-null whenever `best` is (they are only ever assigned together),
    // so the `!best ||` short-circuit guarantees it is set before `.total` is read here.
    if (!best || score.total > /** @type {Record<string, number>} */ (bestScore).total) { best = candidate; bestScore = score; }
    retries = attempt;
    if (score.total >= LYNCH_ACCEPT_FLOOR) break; // accepted — no need to keep drawing
  }

  // ── apply cosmetic pins (anchor-keyed nudges — version-independent anchors) ──
  // The retry loop runs MAX_LAYOUT_RETRIES (>= 1) times and its first iteration always
  // assigns (the `!best` branch), so `best`/`bestScore` are non-null from here on. tsc
  // cannot prove the loop body ran, so the reads below carry narrowing casts (not a
  // latent null — a documented loop invariant).
  applyPins(/** @type {Candidate} */ (best), mapEdits);

  const morphology = selectMorphology(ctx);
  // Fold the STAGE-0 site + response-mode causes into the provenance map (they are
  // the roots most deformations trace back to). The response mode is recorded only when
  // it is MEANINGFUL — a distinctive fortify/endure, or an exploit that actually
  // declined advantages — so a featureless source-less town stays truly empty (formal).
  const allProv = [.../** @type {Candidate} */ (best).provenance, ...site.prov];
  if (responseMode !== 'exploit' || latent.length > 0) allProv.push(responseInfo.prov);
  const provenance = keyProvenance(allProv);
  return {
    townMapGeometryVersion: TOWN_MAP_GEOMETRY_VERSION_V2,
    layoutLawVersion: LAYOUT_LAW_VERSION_V2,
    overlayVersion: TOWN_MAP_OVERLAY_VERSION,
    meta: {
      tier, terrain, tradeAccess, hasWalls,
      layoutVariant: variant,
      buildingCount: /** @type {Candidate} */ (best).buildings.length,
      districtCount: /** @type {Candidate} */ (best).districts.length,
      hamletCluster: assignment.floored,
      morphology,
      hasFabric: fabric.has,
      lynchScore: /** @type {Record<string, number>} */ (bestScore).total,
      lynchParts: /** @type {Record<string, number>} */ (bestScore),
      retries,
      deformedElementCount: Object.keys(provenance).length,
      // STAGE artifacts (the pipeline is site→field→core→…): the generated site kind,
      // the town's response mode to it, and whether the genesis core nucleated OFF the
      // abstract center onto the economic field (a strong field pulls it away).
      siteKind: site.kind,
      responseMode,
      coreNucleated: core.x !== 500 || core.y !== 500,
    },
    frame: /** @type {Candidate} */ (best).frame,
    skeleton: /** @type {Candidate} */ (best).skeleton,
    districts: /** @type {Candidate} */ (best).districts,
    buildings: /** @type {Candidate} */ (best).buildings,
    fortifications: /** @type {Candidate} */ (best).fortifications,
    overlays: /** @type {Candidate} */ (best).overlays,
    // SOURCED-ASYMMETRY PROVENANCE (owner directive): a lookup-by-element map — every
    // deformed element → the named dossier cause(s) of its deformation. Data-only (a
    // follow-up wave renders hover explanations from it); a deformed element without a
    // cause is impossible by construction (no uniform jitter exists to record).
    provenance,
    // THE LATENT ADVANTAGE MAP (owner directive): the site attractors the founding
    // response mode DECLINED — retained at generation, fabric-independent. The
    // reconciliation renderer + a later hover story read this ("the founders took the
    // high ground; the harbor waited for a lawful crown to build the quay").
    latentAdvantages: latent,
    reserved: { scarHistory: null, thumbnail: null, pdfPlate: null },
  };
}

/** A settlement's prosperity as 0..1 (drives resource-site pull strength).
 * @param {TownV2Settlement|null|undefined} s @returns {number} */
function prosperityScore(s) {
  const p = s?.economicState?.prosperity;
  const tier = typeof p === 'string' ? p : (p && typeof p === 'object' ? (p.label || p.tier) : '');
  const t = String(tier || '').toLowerCase();
  if (/opulent|wealthy|rich|prosperous/.test(t)) return 0.9;
  if (/comfortable|modest|stable/.test(t)) return 0.5;
  if (/poor|destitute|struggling|failing/.test(t)) return 0.2;
  return 0.5;
}

/** Fold the flat provenance entries into a deterministic, lookup-by-element map:
 * `{ [elementId]: Array<{ sourceFamily, sourceRef, effect }> }`. Keys codepoint-sorted,
 * entries de-duplicated + sorted, so the map stringifies byte-identically per seed.
 * @param {Array<{element:string, sourceFamily:string, sourceRef:string, effect:string}>} entries
 * @returns {Record<string, Array<{ sourceFamily:string, sourceRef:string, effect:string }>>} */
function keyProvenance(entries) {
  const list = Array.isArray(entries) ? entries : [];
  /** @type {Map<string, Map<string, { sourceFamily:string, sourceRef:string, effect:string }>>} */
  const byEl = new Map();
  for (const e of list) {
    if (!byEl.has(e.element)) byEl.set(e.element, new Map());
    const dedupe = `${e.sourceFamily}|${e.sourceRef}|${e.effect}`;
    // set() on the line above guarantees the key exists; tsc does not correlate has/get.
    /** @type {Map<string, { sourceFamily:string, sourceRef:string, effect:string }>} */
    (byEl.get(e.element)).set(dedupe, { sourceFamily: e.sourceFamily, sourceRef: e.sourceRef, effect: e.effect });
  }
  /** @type {Record<string, Array<{ sourceFamily:string, sourceRef:string, effect:string }>>} */
  const out = {};
  for (const el of [...byEl.keys()].sort(compareCodepoint)) {
    // `el` came from byEl.keys(), so get(el) is defined; tsc cannot correlate the two.
    out[el] = [.../** @type {Map<string, { sourceFamily:string, sourceRef:string, effect:string }>} */ (byEl.get(el)).values()].sort((a, b) => compareCodepoint(
      `${a.sourceFamily}|${a.effect}|${a.sourceRef}`,
      `${b.sourceFamily}|${b.effect}|${b.sourceRef}`,
    ));
  }
  return out;
}

/**
 * Draw ONE candidate arrangement for a given attempt salt. Deterministic in
 * (ctx, attempt). Returns the model sections plus a `nodes` list (convergence
 * squares) the rubric reads.
 * @param {LayoutCtx} ctx @param {number} attempt @returns {Candidate}
 */
function generateCandidate(ctx, attempt) {
  const { baseKey, tierIndex, tradeAccess, hasWalls, isCoast, mapProfile, activeConditions,
    core, water, roadCount, roadWeight, site } = ctx;
  const rng = createPRNG(`${baseKey}::attempt:${attempt}`);
  const morphology = selectMorphology(ctx);

  // ── (1) Approach roads — enter from the frame edge through compass gates and
  //    converge on the core (roads BEFORE buildings). The retry loop rotates the
  //    gate ORIENTATION (`attempt`) so the planner can try which way faces the road. ─
  const anchorKind = tradeAccess === 'crossroads' ? 'crossroads' : isCoast ? 'water-gate' : 'market-square';
  /** @type {number[]} */
  const gateDirIdx = [];
  for (let i = 0; i < roadCount; i++) gateDirIdx.push((Math.round((i * 16) / roadCount) + attempt) % 16);
  /** @type {Array<{id:string,from:[number,number],to:[number,number],weight:number}>} */
  const roads = gateDirIdx.map((di, i) => {
    const edge = polar(core.x, core.y, COMPASS[di], 150);
    return { id: `road.${i}`, from: [clamp(edge.x, 0, VIEW), clamp(edge.y, 0, VIEW)], to: [core.x, core.y], weight: roadWeight };
  });

  // ── (2) Districts — sourced-asymmetry placement (no uniform jitter) ──────────
  const { districts, prov: districtProv } = placeDistricts(ctx, morphology, attempt);
  const districtByIdGeom = new Map(districts.map((d) => [d.id, d]));
  /** @type {Array<{element:string, sourceFamily:string, sourceRef:string, effect:string}>} */
  const provenance = [...districtProv];

  // ── (3) Streets — the core links to each district; PLUS desire paths (habit):
  //    worn diagonal shortcuts between high-traffic quarter pairs the grid never
  //    planned. Their crossings become convergence squares (plan-response). ──────
  /** @type {Array<{from:{x:number,y:number},to:{x:number,y:number}}>} */
  const streets = [];
  /** @type {Array<{x:number,y:number}>} */
  const nodes = [{ x: core.x, y: core.y }];
  for (const g of gateDirIdx) {
    const p = polar(core.x, core.y, COMPASS[g], 118);
    nodes.push({ x: clamp(p.x, 0, VIEW), y: clamp(p.y, 0, VIEW) });
  }
  for (const d of districts) {
    streets.push({ from: { x: core.x, y: core.y }, to: { x: d.centroid.x, y: d.centroid.y } });
    if (tierIndex >= 3) nodes.push({ x: d.centroid.x, y: d.centroid.y });
  }
  for (const dp of desirePaths(districts)) {
    const a = districtByIdGeom.get(dp.fromId);
    const b = districtByIdGeom.get(dp.toId);
    if (!a || !b) continue;
    streets.push({ from: { x: a.centroid.x, y: a.centroid.y }, to: { x: b.centroid.x, y: b.centroid.y } });
    // the worn path's midpoint is a convergence square (a plaza where routes cross)
    const el = `desire-path:${dp.fromId < dp.toId ? `${dp.fromId}|${dp.toId}` : `${dp.toId}|${dp.fromId}`}`;
    nodes.push({ x: Math.round((a.centroid.x + b.centroid.x) / 2), y: Math.round((a.centroid.y + b.centroid.y) / 2) });
    provenance.push({ element: el, sourceFamily: 'habit', sourceRef: dp.cause, effect: 'desire-path' });
    provenance.push({ element: el, sourceFamily: 'habit', sourceRef: dp.cause, effect: 'square-at-convergence' });
  }
  const skeleton = {
    anchor: { x: core.x, y: core.y, kind: anchorKind },
    pattern: morphology === 'bastide-grid' ? 'grid' : morphology === 'concentric' ? 'radial' : morphology,
    streets,
  };

  // ── (4) Buildings — every institution in its assigned district, short-block grain ─
  const buildings = placeBuildings(ctx, districts, districtByIdGeom, tierIndex);

  // ── (5) Fortifications — a PLAN-RESPONSE wall that kinks to embrace valued
  //    quarters (per-sector radius, not a uniform ring). ──────────────────────
  const wall = hasWalls ? buildWall(districts, gateDirIdx, core, mapProfile) : null;
  const fortifications = wall ? wall.fort : null;
  if (wall) for (const p of wall.prov) provenance.push(p);

  // ── (6) Overlays — hazard markers + district-level condition badges (as v1) ──
  const overlays = buildOverlays(mapProfile, activeConditions, districts, rng);

  // THE NON-WATER LANDFORM (task #38 fenced follow-up): the generated site's
  // renderable texture rides in the frame beside the water, so every renderer (draw
  // list, pane, panorama, exports) inherits it with zero coupling. Present ONLY for
  // marsh/dunes/mountain-flank; absent for water/plain ⇒ the frame is `{ water, roads }`
  // byte-identical to the pre-landform model (the dormancy law + the v1 frame shape).
  const frame = site.landform ? { water, roads, landform: site.landform } : { water, roads };
  return { morphology, frame, skeleton, districts, buildings, fortifications, overlays, nodes, provenance };
}

/** Place the districts. Ranked inner→outer by category centrality (+ fabric prominence
 * + prose). The FORMAL position (ring+sector or grid) is then deformed ONLY by named
 * asymmetry sources (region/resource/habit) + terrain grain — NO uniform jitter — and
 * every deformation is recorded as provenance. A source-less flat settlement therefore
 * lays out formally AND seed-independently.
 * @param {LayoutCtx} ctx @param {string} morphology @param {number} attempt
 * @returns {{ districts: TownDistrict[], prov: ProvEntry[] }} */
function placeDistricts(ctx, morphology, attempt) {
  const { sources, fabric, asym, core, terrain, seed, latent, responseMode } = ctx;
  const N = sources.length;
  if (N === 0) return { districts: [], prov: [] };

  // Rank: centrality (category) − prominence pull + prose ringPush. Prominent
  // quarters sit closer to the core AND draw larger (the fabric's slow memory).
  const ranked = sources.map((src) => {
    const centrality = CATEGORY_CENTRALITY[src.category] ?? 4;
    const prom = fabric.has ? (fabric.stocks[src.category] ?? 0) : 0; // 0..1
    const bias = locationBias(src.location);
    const rankKey = centrality * 100 - prom * 140 + bias.ringPush;
    return { src, centrality, prom, bias, rankKey };
  });
  ranked.sort((a, b) => (a.rankKey - b.rankKey) || compareCodepoint(a.src.id, b.src.id));

  const rings = Math.max(1, Math.min(4, 1 + Math.floor(N / 3)));
  const baseSize = clamp(Math.round(250 - N * 11), 74, 210);

  /** @type {TownDistrict[]} */
  const out = [];
  /** @type {Array<{element:string, sourceFamily:string, sourceRef:string, effect:string}>} */
  const prov = [];
  for (let i = 0; i < ranked.length; i++) {
    const { src, prom, bias } = ranked[i];
    const ring = Math.min(rings - 1, Math.floor((i / Math.max(1, N)) * rings));
    let ringPct = 16 + ring * Math.round((92 - 16) / Math.max(1, rings - 1 || 1));
    ringPct = clamp(ringPct + bias.ringPush, 8, 104);
    const dirIndex = bias.dirIdx != null ? bias.dirIdx : (Math.round((i * 16) / N) + attempt * 2) % 16;
    const dir = COMPASS[dirIndex];

    // ── FORMAL position (ring+sector, or the planned grid) — clean, no noise ────
    let baseX;
    let baseY;
    if (morphology === 'bastide-grid') {
      const cols = Math.ceil(Math.sqrt(N));
      const col = i % cols;
      const row = Math.floor(i / cols);
      const cell = Math.round((EXTENT * 1.6) / (cols + 1));
      baseX = clamp(core.x + (col - (cols - 1) / 2) * cell, 70, VIEW - 70);
      baseY = clamp(core.y + (row - (Math.ceil(N / cols) - 1) / 2) * cell, 70, VIEW - 70);
    } else {
      const p = polar(core.x, core.y, dir, ringPct);
      baseX = p.x;
      baseY = p.y;
    }

    // ── SOURCED deformation (named causes only) + terrain grain ─────────────────
    const disp = netDisplacement({ x: baseX, y: baseY }, src.category, asym);
    const grain = regionalGrain(src.id, terrain, seed);
    // ── RECONCILIATION (fabric-lit only): the town reconciles with its site over
    //    time — direction from the latent-advantage map, STYLE from alignment
    //    (lawful=planned/discrete, chaotic=greedy grab), MAGNITUDE from fabric stocks.
    //    Dark fabric ⇒ zero (the founding form persists). ─────────────────────────
    const recon = reconciliationDisplacement({ x: baseX + disp.dx, y: baseY + disp.dy }, src.category, fabric, latent, responseMode);
    const cx = clamp(baseX + disp.dx + grain.dx + recon.dx, 62, VIEW - 62);
    const cy = clamp(baseY + disp.dy + grain.dy + recon.dy, 62, VIEW - 62);

    // ── record provenance for EACH named cause that moved this quarter ──────────
    if (disp.dx !== 0 || disp.dy !== 0) {
      for (const srcA of asym) {
        if (srcA.targets && !srcA.targets.includes(src.category)) continue;
        prov.push({ element: src.id, sourceFamily: srcA.family, sourceRef: srcA.cause, effect: 'district-drift' });
      }
    }
    if (grain.dx !== 0 || grain.dy !== 0) {
      prov.push({ element: src.id, sourceFamily: 'region', sourceRef: `terrain: ${terrain || 'plains'}`, effect: 'regional-grain' });
    }
    if (recon.prov) prov.push({ element: src.id, sourceFamily: recon.prov.sourceFamily, sourceRef: recon.prov.sourceRef, effect: recon.prov.effect });

    const scarPenalty = scarSeverityFor(fabric, src.category);
    const rebirth = rebirthedClass(fabric, src.category);
    let size = Math.round(baseSize * (0.82 + prom * 0.5) * (1 - scarPenalty * 0.3) * (rebirth ? 0.9 : 1));
    size = clamp(size, 52, 240);
    if (scarPenalty > 0) prov.push({ element: src.id, sourceFamily: 'region', sourceRef: 'stressor scars (urban fabric)', effect: 'scar-shrink' });

    // Polygon: clean morphological shape, then LEANED toward the net pull + any
    // reconciliation drift (a lopsided quarter growing toward its cause / its site —
    // never random corner wiggle).
    let polygon = districtPolygon(morphology, core, { x: cx, y: cy }, dir, size);
    polygon = leanPolygon(polygon, { x: cx, y: cy }, { dx: disp.dx + recon.dx, dy: disp.dy + recon.dy });

    out.push({
      id: src.id, name: src.name, category: src.category,
      anchorKey: anchorForDistrict(src), synthetic: src.synthetic,
      polygon, centroid: { x: cx, y: cy }, wealth: src.wealth, safety: src.safety,
    });
  }
  return { districts: out, prov };
}

/** Build a district polygon shaped by morphology: a radial wedge (organic/concentric/
 * harbor/river) or an orthogonal block (grid). Trig-free (perpendicular vectors). Clean
 * geometry — the asymmetry is applied by leanPolygon from named sources, not here.
 * @param {string} morphology @param {{x:number,y:number}} core @param {{x:number,y:number}} cen
 * @param {number[]} dir @param {number} size @returns {Array<[number,number]>} */
function districtPolygon(morphology, core, cen, dir, size) {
  if (morphology === 'bastide-grid') {
    const hw = Math.round(size * 0.72);
    const hh = Math.round(size * 0.56);
    /** @type {Array<[number,number]>} */
    const corners = [[-hw, -hh], [hw, -hh], [hw, hh], [-hw, hh]];
    return corners.map(([ox, oy]) => /** @type {[number,number]} */ ([clamp(cen.x + ox, 0, VIEW), clamp(cen.y + oy, 0, VIEW)]));
  }
  const pv = perp(dir);
  const inner = Math.round(size * 0.46);
  const outer = Math.round(size * 0.62);
  const wIn = Math.round(size * 0.42);
  const wOut = Math.round(size * 0.62);
  /** @param {number} along @param {number} wide */
  const pt = (along, wide) => /** @type {[number,number]} */ ([
    clamp(cen.x + Math.round((dir[0] * along) / 100) + Math.round((pv[0] * wide) / 100), 0, VIEW),
    clamp(cen.y + Math.round((dir[1] * along) / 100) + Math.round((pv[1] * wide) / 100), 0, VIEW),
  ]);
  return [pt(-inner, -wIn), pt(-inner, wIn), pt(outer, wOut), pt(outer, -wOut)];
}

/** Place every institution as a building inside its assigned district (short-block
 * grain — Jacobs). Deterministic fan (no jitter): the 16-dir golden-angle rotation
 * spreads them evenly. Landmarks stand apart; aggregates fill.
 * @param {LayoutCtx} ctx @param {TownDistrict[]} districts
 * @param {Map<string, TownDistrict>} districtByIdGeom @param {number} tierIndex
 * @returns {import('./townMapModel.js').TownMapBuilding[]} */
function placeBuildings(ctx, districts, districtByIdGeom, tierIndex) {
  const { institutions, assignment } = ctx;
  const anchored = institutions.map((inst) => ({ anchorKey: anchorForInstitution(inst), inst }));
  anchored.sort((a, b) => compareCodepoint(a.anchorKey, b.anchorKey));
  /** @type {Record<string, number>} */
  const seen = {};
  const cityPlus = tierIndex >= 4;
  return anchored.map(({ anchorKey, inst }, i) => {
    const districtId = assignment.placements[i]?.districtId ?? (districts[0]?.id ?? '');
    const geom = districtByIdGeom.get(districtId);
    const centroid = geom ? geom.centroid : { x: CENTER, y: CENTER };
    const j = seen[districtId] ?? 0;
    seen[districtId] = j + 1;
    // Fan the district's buildings around its centroid along short blocks (a golden-
    // angle-ish rotation via the 16-dir table gives an even, non-clumped spread).
    const dir = COMPASS[(j * 6 + 1) % 16];
    const rad = 22 + (j % 3) * 16;
    const bx = clamp(centroid.x + Math.round((dir[0] * rad) / 100), 0, VIEW);
    const by = clamp(centroid.y + Math.round((dir[1] * rad) / 100), 0, VIEW);
    const haystack = `${inst?.name || ''} ${inst?.priorityCategory || ''} ${inst?.category || ''} ${(inst?.tags || []).join(' ')}`;
    const kind = AGGREGATE_RE.test(haystack) && cityPlus ? 'fill' : 'landmark';
    return {
      anchorKey,
      name: typeof inst?.name === 'string' ? inst.name : '',
      catalogId: typeof inst?.catalogId === 'string' ? inst.catalogId : null,
      localUid: typeof inst?.localUid === 'string' ? inst.localUid : null,
      districtId, kind, position: { x: bx, y: by },
    };
  });
}

/** Wall that OBEYS the town — and RESPONDS to it (the plan-response law). A base ring
 * hugs the core cluster, then each sector KINKS OUTWARD to embrace a valued quarter
 * (civic / noble / religious / merchant) that would otherwise sit just beyond it — the
 * wall is drawn to include what matters. Every kink records provenance ('wall-embrace').
 * Far-flung quarters stay outside as honest extramural faubourgs.
 * @param {TownDistrict[]} districts @param {number[]} gateDirIdx @param {{x:number,y:number}} core
 * @param {import('../mapProfile.js').MapProfile} mapProfile
 * @returns {{ fort: { walls: Array<[number,number]>, gates: Array<{x:number,y:number}>, readiness: string, wallWeight: number }, prov: Array<{element:string, sourceFamily:string, sourceRef:string, effect:string}> }} */
function buildWall(districts, gateDirIdx, core, mapProfile) {
  const readinessIdx = Math.max(0, DEFENSIVE_BANDS.indexOf(mapProfile.outputs.defensiveTerrain));
  const VALUED = new Set(['civic', 'noble', 'religious', 'merchant', 'foreign']);
  /** A quarter worth walling in: a valued category OR a wealthy one (the harbor
   *  warehouses, the moneyed suburb) that a wall extends to protect.
   *  @param {TownDistrict} d @returns {boolean} */
  const worthWalling = (d) => VALUED.has(d.category) || d.wealth === 'wealthy' || d.wealth === 'opulent';
  // Base radius: enclose the INNER cluster (~60th percentile of district radii), so a
  // handful of outer quarters fall beyond it — the wall then either embraces them (if
  // worth walling) or leaves them as honest extramural faubourgs.
  const radial = districts.map((d) => {
    const dx = d.centroid.x - core.x;
    const dy = d.centroid.y - core.y;
    const r = Math.round(Math.sqrt(dx * dx + dy * dy));
    return { d, r, dx, dy };
  });
  const sortedR = radial.map((x) => x.r).sort((a, b) => a - b);
  const pct45 = sortedR.length ? sortedR[Math.min(sortedR.length - 1, Math.floor(sortedR.length * 0.45))] : 120;
  const baseR = clamp(Math.round(pct45 + 20), 140, 340);
  /** @type {Array<{element:string, sourceFamily:string, sourceRef:string, effect:string}>} */
  const prov = [];
  /** @type {Array<[number,number]>} */
  const walls = [0, 2, 4, 6, 8, 10, 12, 14].map((di) => {
    let sectorR = baseR;
    // Plan-response: embrace a quarter-worth-walling aligned with this sector that sits
    // beyond the base ring — the wall bulges to bring it inside (the harbor kink).
    for (const { d, r, dx, dy } of radial) {
      if (!worthWalling(d)) continue;
      const denom = (Math.sqrt(dx * dx + dy * dy) * 100) || 1;
      const align = (dx * COMPASS[di][0] + dy * COMPASS[di][1]) / denom; // ~cosθ, −1..1
      if (align > 0.72 && r > baseR && r < baseR + 170) {
        const need = r + 40;
        if (need > sectorR) { sectorR = Math.min(need, 470); prov.push({ element: `wall-sector:${di}`, sourceFamily: 'habit', sourceRef: d.name, effect: 'wall-embrace' }); }
      }
    }
    const p = polar(core.x, core.y, COMPASS[di], Math.round((sectorR * 100) / EXTENT));
    return /** @type {[number,number]} */ ([clamp(p.x, 0, VIEW), clamp(p.y, 0, VIEW)]);
  });
  const gatePct = Math.round((baseR * 100) / EXTENT);
  const gates = gateDirIdx.map((di) => {
    const p = polar(core.x, core.y, COMPASS[di], gatePct);
    return { x: clamp(p.x, 0, VIEW), y: clamp(p.y, 0, VIEW) };
  });
  return { fort: { walls, gates, readiness: DEFENSIVE_BANDS[readinessIdx] || 'open', wallWeight: readinessIdx + 1 }, prov };
}

/** Overlays — identical semantics to v1 (hazard markers + district condition badges).
 * @param {import('../mapProfile.js').MapProfile} mapProfile
 * @param {import('../activeConditions.js').ActiveCondition[]} activeConditions
 * @param {TownDistrict[]} districts
 * @param {ReturnType<typeof import('../../kernel/prng.js').createPRNG>} rng
 * @returns {{ hazards: import('./townMapModel.js').TownMapHazard[], conditions: import('./townMapModel.js').TownMapConditionBadge[] }} */
function buildOverlays(mapProfile, activeConditions, districts, rng) {
  const hazardMarkers = mapProfile.outputs.hazardMarkers.slice().sort((a, b) => compareCodepoint(a.id, b.id));
  const hazards = hazardMarkers.map((h, i) => {
    const p = polar(CENTER, CENTER, COMPASS[(i * 3 + 1) % 16], 106);
    return {
      id: h.id, label: h.label, kind: h.kind, severity: h.severity,
      severityBand: h.severityBand, visibility: h.visibility,
      position: { x: clamp(p.x, 0, VIEW), y: clamp(p.y, 0, VIEW) },
    };
  });
  const sortedConditions = activeConditions.slice().sort((a, b) => compareCodepoint(a.id, b.id));
  const districtIds = districts.map((d) => d.id);
  const conditions = sortedConditions.map((c) => {
    /** @type {string|null} */
    let districtId = null;
    if (districtIds.length === 1) districtId = districtIds[0];
    else if (districtIds.length > 1) districtId = rng.fork(`condition:${c.id}`).pick(districtIds) ?? districtIds[0];
    return {
      id: c.id, archetype: c.archetype, label: c.label, severity: c.severity,
      severityBand: c.severityBand, districtId,
    };
  });
  return { hazards, conditions };
}

/** The scar severity (0..1) affecting a district category, or 0. Scar `kind`s are
 * typed (fire/plague/siege…); we map any scar to the whole town's stone and take the
 * strongest — a scarred town shows visibly tighter, patched grain.
 * @param {FabricRead} fabric @param {string} category @returns {number} */
function scarSeverityFor(fabric, category) {
  if (!fabric.has || fabric.scars.length === 0) return 0;
  let worst = 0;
  for (const sc of fabric.scars) if (sc.severity > worst) worst = sc.severity;
  // Industrial/criminal/foreign quarters wear scars most visibly (least rebuilt).
  const exposed = category === 'industrial' || category === 'criminal' || category === 'foreign' || category === 'residential';
  return worst * (exposed ? 1 : 0.6);
}

/** Whether a category was rebirthed by a recent catastrophe (draws fresh grain).
 * @param {FabricRead} fabric @param {string} category @returns {boolean} */
function rebirthedClass(fabric, category) {
  if (!fabric.has || fabric.rebirths.length === 0) return false;
  for (const r of fabric.rebirths) if (Array.isArray(r.classes) && r.classes.includes(category)) return true;
  return false;
}

/** Apply anchor-keyed cosmetic pins (the same rule as v1: matching building/district
 * nudged, dangling anchors dropped, absent ⇒ no-op). Version-independent anchors mean
 * a v1 pin survives a v1→v2 redraw and still nudges the right element.
 * @param {Candidate} model
 * @param {{ layoutVariant?: number, pins?: Array<{ anchor?: string, dx?: number, dy?: number }>, layoutLawVersion?: number } | null | undefined} mapEdits */
function applyPins(model, mapEdits) {
  const pins = Array.isArray(mapEdits?.pins) ? mapEdits.pins : [];
  if (pins.length === 0) return;
  for (const pin of pins) {
    const anchor = typeof pin?.anchor === 'string' ? pin.anchor : '';
    if (anchor === '') continue;
    const dx = Number.isFinite(pin?.dx) ? Number(pin?.dx) : 0;
    const dy = Number.isFinite(pin?.dy) ? Number(pin?.dy) : 0;
    if (dx === 0 && dy === 0) continue;
    const b = model.buildings.find((x) => x.anchorKey === anchor);
    if (b) { b.position = { x: clamp(b.position.x + dx, 0, VIEW), y: clamp(b.position.y + dy, 0, VIEW) }; continue; }
    const d = model.districts.find((x) => x.anchorKey === anchor);
    if (d) {
      d.centroid = { x: clamp(d.centroid.x + dx, 0, VIEW), y: clamp(d.centroid.y + dy, 0, VIEW) };
      d.polygon = d.polygon.map(([px, py]) => [clamp(px + dx, 0, VIEW), clamp(py + dy, 0, VIEW)]);
    }
  }
}
