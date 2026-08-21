/**
 * domain/townMap/fabric/substrate.js — LAYER ZERO: the land itself (§5.-1, §161a).
 *
 * ⭐⭐ THE TERRAIN-FIRST LAW (owner order): terrain and height come FIRST; everything
 * else remains a roll BOUNDED by what the terrain makes sensible. Before any nucleus,
 * road, ward or parcel exists, the fabric derives a seeded LOCAL TERRAIN SUBSTRATE — a
 * heightfield plus the wetness and flow it implies — and every later decision samples
 * against it. Randomness proposes; terrain disposes.
 *
 * §161a — THE SUBSTRATE READS THE WHOLE DOSSIER, not terrainType alone. A settlement's
 * land must be the land its OWN economy could have grown from:
 *   config.terrainType    → the landform family (via the landed `resolveTerrain`)
 *   economic resources    → ground that could carry them: ore ⇒ workable slopes and
 *                           spoil ground, fisheries ⇒ shore and shoal, timber ⇒ the
 *                           standing forest's soil, quarry ⇒ exposed stone
 *   water features        → the §5.0b mode CONSTRAINS the substrate (a bankside town
 *                           gets a bank worth sitting on)
 *   config.tradeRouteAccess → how many roads deserve to exist, and their grades
 *   the neighbour link    → the bearing the main road actually leaves by — and it
 *                           arrives ONLY through the dress channel (worldState never
 *                           enters this module or its hashes), absent for standalone
 *                           settlements, which fall back to the seeded slot layout.
 *
 * ⭐ THE ONE-DECIDER RULE (J-TC29-5). `siteGenesis.generateSite` remains the SOLE
 * authority on water SUBSTANCE — whether a river exists at all — with its landed
 * realm-coherence machinery (WATER_ECONOMY_RE / DRY_BIOME_RE / WET_BIOME_RE) and its
 * truth-projection law. This module decides only where water GOES given height. Two
 * modules must never both answer "does this town have a river"; that is the five-homes
 * defect, and Stage 0 already owns the question.
 *
 * DETERMINISM — and note what is NOT here: the substrate consumes NO PRNG STREAM at
 * all. Every lattice value is a pure hash of (seed, octave, cell), so the field is a
 * function of position and cannot be perturbed by anything drawn before or after it.
 * That is the strongest form of the §11.0 inertia law available: the land does not move
 * when the town changes, which is exactly right.
 *
 * PURITY: no Date, no Math.random, no runtime trig, no localeCompare.
 */

import { hashUnit, hash32, legacySubstrateForkKey } from './fabricRng.js';
import { cosI, sinI, TRIG_N } from './trigTable.js';
import { r2 } from './fabricGeometry.js';

/** The view space every town-map coordinate lives in. */
export const VIEW = 1000;

/**
 * Substrate grid resolution, cells per side. §42/§43 VALUE, DERIVED: the smallest
 * resolution at which a valley reads as a valley rather than as a staircase is roughly
 * one cell per building frontage at town scale. A town's plot frontage is ~10 view
 * units (measured from the burgage derivation), and 1000/96 ≈ 10.4 — so 96 is the
 * coarsest grid that can still bound an individual plot's ground. Doubling it
 * quadruples the flow walk for sub-plot detail no lens can draw.
 * ⚠ UNSOAKED — the derivation is stated, the number rides the tuning signature.
 */
export const GRID_N = 96;

/** View units per substrate cell. */
export const CELL = VIEW / GRID_N;

/**
 * LANDFORM FAMILIES — the §161a mapping from the landed `resolveTerrain` vocabulary to
 * the shape of the ground. Every row is an argument about what that terrain IS:
 *
 *  relief    — height amplitude, 0..1 of the full local range. Mountain country has an
 *              order of magnitude more local relief than a floodplain, and the map must
 *              show it: a mountain-valley settlement whose substrate rolls flat plains
 *              is a RED (§161a's consistency pin, and its whole reason to exist).
 *  grain     — feature size: the octave the family's character lives in. Dunes and
 *              ridges are long and coherent; hill country is lumpy at mid scale.
 *  ridged    — 0..1 blend toward RIDGED noise (folded absolute value), which produces
 *              sharp crests and rounded valleys — the signature of eroded uplands.
 *              Plains use none of it; mountains are nearly all of it.
 *  trough    — 0..1 pull toward a through-going VALLEY. Riverside country is a valley
 *              first and a surface second: without this the river wanders across a
 *              lumpy field instead of running in the ground that made it.
 *  ramp      — 0..1 monotone fall toward one frame edge — a coastline's shelf.
 *  wetBias   — added to the wetness field everywhere. Marsh and forest hold water;
 *              desert does not.
 *  rockBias  — how much exposed stone the ground shows (the dress layer reads it).
 * @type {Readonly<Record<string, { relief:number, grain:number, ridged:number, trough:number, ramp:number, wetBias:number, rockBias:number }>>}
 */
export const LANDFORM_FAMILIES = Object.freeze({
  plains:    { relief: 0.16, grain: 3.0, ridged: 0.05, trough: 0.10, ramp: 0.00, wetBias: 0.04, rockBias: 0.00 },
  hills:     { relief: 0.52, grain: 4.2, ridged: 0.35, trough: 0.15, ramp: 0.00, wetBias: 0.00, rockBias: 0.20 },
  forest:    { relief: 0.30, grain: 3.4, ridged: 0.18, trough: 0.18, ramp: 0.00, wetBias: 0.10, rockBias: 0.04 },
  riverside: { relief: 0.26, grain: 3.0, ridged: 0.08, trough: 0.72, ramp: 0.00, wetBias: 0.14, rockBias: 0.02 },
  coastal:   { relief: 0.30, grain: 3.2, ridged: 0.12, trough: 0.08, ramp: 0.62, wetBias: 0.08, rockBias: 0.10 },
  mountain:  { relief: 1.00, grain: 2.4, ridged: 0.86, trough: 0.34, ramp: 0.00, wetBias: 0.00, rockBias: 0.72 },
  desert:    { relief: 0.34, grain: 2.0, ridged: 0.46, trough: 0.04, ramp: 0.00, wetBias: -0.12, rockBias: 0.44 },
});

/** The family a settlement falls back to when `resolveTerrain` returns nothing known. */
const DEFAULT_FAMILY = 'plains';

/**
 * ⭐⭐ §5.-1c · THE FORCED-FACT RECONCILIATION LAW.
 *
 * THE SUBSTRATE IS A CONSTRAINT SOLVER, NOT A terrainType LOOKUP. A user may force fact
 * combinations the naive lookup cannot hold at once — mountainside AND ocean AND a port;
 * desert AND a river; marsh AND a stone city — and every one of those is TRUTH. The solver
 * chooses the landform family under which ALL the forced facts are most plausible, and
 * HISTORY IS THE SOLUTION CATALOG: mountain + sea + port is not a contradiction, it is a
 * FJORD — a terraced town on the shelf above and a deep cove harbour below, which is how
 * every such place was actually built. Desert + river is a floodplain oasis. Marsh + a
 * stone city is Venice, or Amsterdam, on piles and causeways.
 *
 * PRECEDENCE UNDER FORCE: user-truth > state > tier > terrain-plausibility > jitter. The
 * solver never discards a forced fact to keep a family tidy.
 *
 * ⭐ STRAIN RENDERS AS WORK. A hard reconciliation SHOWS ITS EFFORT — switchbacks,
 * terraces, retaining walls, breakwaters, stilts, rock-cut quay ramps — in the §161b
 * visible-work idiom. A settlement that reconciled three fighting facts looks like a place
 * that fought for its ground, and that is the honest rendering. The strain budget may
 * EXCEED the tier's ordinary terraform budget, because the facts demand it.
 *
 * HONEST RESIDUE: for true impossibilia the solver renders every fact at its most
 * defensible placement, records the strain, and NEVER BREAKS.
 *
 * Each family declares the CONSTRAINT SET it natively satisfies. The solver scores every
 * family by how many forced constraints it covers, and the winner's uncovered constraints
 * ARE the strain.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const FAMILY_SATISFIES = Object.freeze({
  plains:    ['tillage', 'open', 'road'],
  hills:     ['relief', 'pasture', 'defensible', 'stone'],
  forest:    ['timber', 'cover', 'tillage'],
  riverside: ['river', 'tillage', 'landing', 'mill'],
  coastal:   ['sea', 'shore', 'port', 'fish'],
  mountain:  ['relief', 'stone', 'ore', 'defensible'],
  desert:    ['arid', 'stone', 'open'],
  // ── THE RECONCILIATION FAMILIES. Each is a HISTORICAL SOLUTION to a fact combination
  //    the simple families cannot hold together, and each is named for the real landform.
  fjord:     ['relief', 'stone', 'ore', 'defensible', 'sea', 'shore', 'port', 'fish'],
  oasis:     ['arid', 'river', 'landing', 'tillage', 'open'],
  fen:       ['river', 'marsh', 'tillage', 'landing', 'fish'],
  strand:    ['sea', 'shore', 'port', 'fish', 'tillage', 'open'],
});

/**
 * Landform shapes for the reconciliation families. Each is the real landform, not a blend:
 * a fjord is high relief WITH a deep-water ramp; an oasis is arid ground with one green
 * valley through it; a fen is flat, wet and threaded with channels.
 */
const RECONCILED_SHAPES = Object.freeze({
  fjord:  { relief: 0.92, grain: 2.6, ridged: 0.74, trough: 0.58, ramp: 0.70, wetBias: 0.04, rockBias: 0.68 },
  oasis:  { relief: 0.30, grain: 2.2, ridged: 0.38, trough: 0.80, ramp: 0.00, wetBias: -0.02, rockBias: 0.34 },
  fen:    { relief: 0.10, grain: 3.6, ridged: 0.02, trough: 0.42, ramp: 0.10, wetBias: 0.30, rockBias: 0.00 },
  strand: { relief: 0.18, grain: 3.0, ridged: 0.08, trough: 0.10, ramp: 0.72, wetBias: 0.08, rockBias: 0.06 },
});

/**
 * ⭐ THE VISIBLE WORK each unreconciled constraint costs — the §161b idiom. A strained
 * fact does not vanish; it becomes a piece of engineering the surveyor drew.
 * @type {Readonly<Record<string, string>>}
 */
export const STRAIN_WORKS = Object.freeze({
  relief: 'switchbacks and terrace walls up the slope',
  stone: 'a quarried scar and rock-cut faces',
  ore: 'adits and spoil ground on the workable slope',
  sea: 'a breakwater mole against the open water',
  shore: 'a revetted strand and hauling ramps',
  port: 'a rock-cut quay ramp down to deep water',
  fish: 'net-drying strands and a shoal jetty',
  river: 'a cut race and a revetted bank',
  landing: 'a stepped landing and a causeway to it',
  marsh: 'piles, stilts and a drainage ditch grid',
  tillage: 'terraced strips and retaining walls',
  arid: 'cisterns, a qanat line and shade walls',
  pasture: 'stock walls and a drove lane',
  defensible: 'a cut ditch and a banked scarp',
  timber: 'a cleared coup and a timber slide',
  mill: 'a leat and a mill pond',
  cover: 'assarted clearings inside the wood',
  open: 'a levelled and revetted terrace',
});

/**
 * Extract the FORCED FACTS a settlement asserts — the constraints the solver must honour.
 * These are user/dossier TRUTH, and none of them may be dropped.
 * @param {any} settlement @param {string} terrain @param {{ waterKind?: string|null }} facts
 * @returns {string[]}
 */
export function forcedConstraints(settlement, terrain, facts) {
  const set = new Set();
  for (const c of FAMILY_SATISFIES[terrain] || []) set.add(c);
  const words = readResourceWords(settlement);
  const has = (re) => words.some((w) => re.test(w));
  if (has(/fish/)) { set.add('fish'); set.add('shore'); }
  if (has(/ore|iron|gem/)) { set.add('ore'); set.add('relief'); }
  if (has(/stone|quarry/)) set.add('stone');
  if (has(/timber|wood/)) set.add('timber');
  if (has(/grain|wool|livestock/)) set.add('tillage');
  const access = String((settlement && settlement.config && settlement.config.tradeRouteAccess) || '').toLowerCase();
  if (/port/.test(access)) { set.add('port'); set.add('sea'); set.add('shore'); }
  if (/river/.test(access)) { set.add('river'); set.add('landing'); }
  if (facts && facts.waterKind === 'coast') { set.add('sea'); set.add('shore'); }
  if (facts && facts.waterKind === 'river') set.add('river');
  return [...set].sort();
}

/**
 * ⭐ THE SOLVER. Choose the landform family under which the MOST forced facts are
 * plausible; ties break toward the family the terrainType named (user-truth precedence),
 * then by name for a total order. The winner's UNCOVERED constraints are the STRAIN.
 * @param {string[]} constraints @param {string} declaredTerrain
 * @returns {{ family: string, satisfied: string[], strained: string[], strain: number, forced: boolean, reason: string }}
 */
export function reconcileLandform(constraints, declaredTerrain) {
  const names = Object.keys(FAMILY_SATISFIES).sort();
  let best = null;
  for (const name of names) {
    const covers = FAMILY_SATISFIES[name];
    const satisfied = constraints.filter((c) => covers.indexOf(c) >= 0);
    const strained = constraints.filter((c) => covers.indexOf(c) < 0);
    const score = satisfied.length * 10 - strained.length + (name === declaredTerrain ? 5 : 0);
    if (!best || score > best.score) best = { name, satisfied, strained, score };
  }
  const forced = best.name !== declaredTerrain;
  return {
    family: best.name,
    satisfied: best.satisfied,
    strained: best.strained,
    strain: best.strained.length,
    forced,
    reason: forced
      ? `FORCED RECONCILIATION: the dossier asserts ${constraints.join(' + ')}, which '${declaredTerrain}' cannot hold together; '${best.name}' is the landform history built for that combination. ${best.strained.length ? `Residual strain: ${best.strained.join(', ')} — rendered as work.` : 'Every forced fact is native to it.'}`
      : `'${best.name}' natively holds ${best.satisfied.join(', ')}${best.strained.length ? `; strain on ${best.strained.join(', ')} — rendered as work` : ''}`,
  };
}

/**
 * RESOURCE GROUND CONTRACTS (§161a). Each row states what the ground must be ABLE to
 * carry for this economy to be believable, as a predicate the coherence walker checks
 * and a bias the field applies. A settlement whose ledger is ore and whose land has no
 * workable slope is not a mining town; it is a rendering bug with a caption.
 * @type {Readonly<Record<string, { needs: string, reliefFloor: number, wet: number, rock: number }>>}
 */
export const RESOURCE_GROUND = Object.freeze({
  ore:      { needs: 'workable-slope', reliefFloor: 0.34, wet: 0, rock: 0.30 },
  iron:     { needs: 'workable-slope', reliefFloor: 0.34, wet: 0, rock: 0.30 },
  gems:     { needs: 'workable-slope', reliefFloor: 0.30, wet: 0, rock: 0.26 },
  stone:    { needs: 'exposed-stone', reliefFloor: 0.26, wet: 0, rock: 0.44 },
  quarry:   { needs: 'exposed-stone', reliefFloor: 0.26, wet: 0, rock: 0.44 },
  salt:     { needs: 'flat-pan', reliefFloor: 0, wet: 0.08, rock: 0.10 },
  fish:     { needs: 'shore', reliefFloor: 0, wet: 0.18, rock: 0 },
  timber:   { needs: 'standing-forest', reliefFloor: 0.10, wet: 0.08, rock: 0 },
  grain:    { needs: 'flat-tillage', reliefFloor: 0, wet: 0.06, rock: -0.10 },
  wool:     { needs: 'rough-pasture', reliefFloor: 0.18, wet: 0, rock: 0.06 },
  livestock:{ needs: 'rough-pasture', reliefFloor: 0.12, wet: 0.04, rock: 0 },
});

/** tradeRouteAccess → how many roads the ground deserves, and their grade quality.
 * The COUNT is truth (it derives from the dossier's own access band); the grade is what
 * the substrate then owes them — a critical route is graded and cut, a poor one climbs.
 * @type {Readonly<Record<string, { roads: number, grade: number }>>} */
export const ROUTE_GROUND = Object.freeze({
  none:      { roads: 1, grade: 0.20 },
  isolated:  { roads: 1, grade: 0.20 },
  poor:      { roads: 2, grade: 0.35 },
  limited:   { roads: 2, grade: 0.40 },
  moderate:  { roads: 3, grade: 0.55 },
  road:      { roads: 3, grade: 0.55 },
  good:      { roads: 4, grade: 0.72 },
  river:     { roads: 3, grade: 0.62 },
  port:      { roads: 4, grade: 0.70 },
  crossroads:{ roads: 5, grade: 0.82 },
  major:     { roads: 5, grade: 0.85 },
  excellent: { roads: 5, grade: 0.90 },
  critical:  { roads: 6, grade: 0.95 },
});

/** Smoothstep — the interpolation that makes value noise read as ground rather than as
 * a lattice. 3t² − 2t³, exact in IEEE ops. */
function smooth(t) { return t * t * (3 - 2 * t); }

/**
 * THE LATTICE HASH — a pure integer mix of (seed, octave, cell x, cell y) to a float in
 * [0,1). Integer ops only (Math.imul, ^, >>>), so it is bit-identical everywhere.
 *
 * ⚠ WHY THIS IS NOT `hashUnit` OVER A TEMPLATE STRING (the obvious spelling, and the
 * one this file shipped first): a 96² grid at five octaves needs ~184,000 lattice
 * lookups per settlement, and building a template string for each cost ~220ms per
 * substrate — enough to be felt at every render and to dominate an exemplar sweep. The
 * integer mix is the same law (a pure hash of the coordinates, no stream, no ordering
 * dependence) at ~1% of the cost. The determinism argument is unchanged; only the
 * spelling is.
 */
function latticeUnit(seedInt, octave, ix, iy) {
  let h = seedInt ^ Math.imul(octave + 1, 0x9e3779b1);
  h = Math.imul(h ^ (ix + 0x7fffffff), 0x85ebca6b);
  h = Math.imul(h ^ (iy + 0x7fffffff), 0xc2b2ae35);
  h ^= h >>> 15;
  h = Math.imul(h, 0x27d4eb2f);
  h ^= h >>> 13;
  return (h >>> 0) / 4294967296;
}

/**
 * One octave of VALUE NOISE at lattice spacing `period`, sampled at (x, y) in grid
 * units. Lattice values are PURE HASHES of their own coordinates — no stream, no
 * ordering dependence, no state. Sampling the same point twice, in any order, in any
 * process, returns the same number.
 */
function valueNoise(seedInt, octave, period, x, y) {
  const gx = x / period, gy = y / period;
  const ix = Math.floor(gx), iy = Math.floor(gy);
  const fx = smooth(gx - ix), fy = smooth(gy - iy);
  const v00 = latticeUnit(seedInt, octave, ix, iy);
  const v10 = latticeUnit(seedInt, octave, ix + 1, iy);
  const v01 = latticeUnit(seedInt, octave, ix, iy + 1);
  const v11 = latticeUnit(seedInt, octave, ix + 1, iy + 1);
  const a = v00 + (v10 - v00) * fx;
  const b = v01 + (v11 - v01) * fx;
  return a + (b - a) * fy;
}

/** Fractal value noise: octaves at halving period and halving amplitude. */
function fbm(seedInt, x, y, octaves, basePeriod) {
  let sum = 0, amp = 1, norm = 0, period = basePeriod;
  for (let o = 0; o < octaves; o++) {
    sum += valueNoise(seedInt, o, period, x, y) * amp;
    norm += amp;
    amp *= 0.5;
    period *= 0.5;
    if (period < 1) period = 1;
  }
  return sum / norm;
}

/** Ridged variant: fold the field about its midline so crests are sharp and valleys
 * are broad — the eroded-upland signature. */
function ridged(v) { const d = v - 0.5; return 1 - (d < 0 ? -d : d) * 2; }

/** Clamp to 0..1. */
function unit(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

/**
 * Read the economy's resource words off the dossier, deterministically ordered.
 * Deliberately tolerant of shape: the estate spells resources several ways across the
 * generation surface, and a substrate that only understood one spelling would be
 * silently flat for the others.
 *
 * ⛔⛔ AND IT WAS SILENTLY FLAT FOR EVERY REAL SETTLEMENT, WHICH IS THE POINT OF THIS
 * NOTE. MF-INT1 ran the real generator against this reader and measured **six spellings,
 * ZERO hits**: the live writer is `src/generators/resourceGenerator.js`, which publishes
 * `resourceAnalysis.availableResources` — a plain string array — and that spelling was
 * not among the six. `readResourceWords()` returned `[]`, `resourceContracts()` returned
 * `[]`, and the whole §161a RESOURCE_GROUND contract machinery was inert on every
 * settlement the product has ever generated. The exemplar corpus never saw it because
 * the exemplars synthesize `economicState.resources`.
 *
 * ⭐⭐ THE CLASS, AND IT IS THE ESTATE'S OWN AND IT KEEPS COMING BACK: **TOLERANCE TO SIX
 * WRONG SPELLINGS IS NOT TOLERANCE.** A reader that lists candidate field names is only
 * as live as the list, and nothing about the list's LENGTH makes it right — the comment
 * above was written to prevent exactly the failure it then suffered. The durable cure is
 * not a seventh name: it is that the walker pin below asserts a live hit against the REAL
 * writer's shape, so a reader that goes dead again reds instead of returning `[]`.
 *
 * ⚠ `availableResources` IS AUTHORITATIVE AND IS READ AS STRINGS. `resourceGenerator.js`
 * writes `availableResources: nearbyResources` (line 372) and the product's own
 * ResourcesTab renders each entry with `r2.replace(/_/g,' ')` — i.e. they are tokens, not
 * objects. The object arm below is kept for the other spellings, which do carry objects.
 *
 * @param {any} settlement @returns {string[]}
 */
export function readResourceWords(settlement) {
  const s = settlement || {};
  const eco = s.economicState || {};
  const ra = s.resourceAnalysis || {};
  /** @type {string[]} */ const words = [];
  const push = (v) => { if (typeof v === 'string' && v) words.push(v.toLowerCase()); };
  push(eco.tradeCommodity);
  push(eco.primaryIndustry);
  push(eco.economicBase);
  // ⭐ THE LIVE SPELLING FIRST, so a reader of this list sees which one the product writes.
  for (const list of [ra.availableResources, ra.resources, eco.resources, eco.localResources]) {
    if (Array.isArray(list)) for (const r of list) push(typeof r === 'string' ? r : r?.name || r?.type);
  }
  return words.sort();
}

/**
 * ⭐ THE SPELLINGS THIS READER ACCEPTS, EXPORTED SO A WALKER CAN HOLD IT TO THEM. The
 * first row is the one the live generator writes; the rest are the estate's older
 * spellings, kept because a saved settlement may carry any of them (THE PROMISE — a
 * world minted under an old spelling still draws).
 * @type {ReadonlyArray<string>}
 */
export const RESOURCE_SPELLINGS = Object.freeze([
  'resourceAnalysis.availableResources',
  'resourceAnalysis.resources',
  'economicState.resources',
  'economicState.localResources',
  'economicState.tradeCommodity',
  'economicState.primaryIndustry',
  'economicState.economicBase',
]);

/** Which RESOURCE_GROUND contracts this settlement's economy invokes.
 * @param {any} settlement @returns {Array<{ key: string, contract: { needs:string, reliefFloor:number, wet:number, rock:number } }>} */
export function resourceContracts(settlement) {
  const words = readResourceWords(settlement);
  /** @type {Array<{ key: string, contract: any }>} */ const out = [];
  const seen = new Set();
  for (const key of Object.keys(RESOURCE_GROUND).sort()) {
    if (seen.has(key)) continue;
    for (const w of words) {
      if (w.indexOf(key) >= 0) { out.push({ key, contract: RESOURCE_GROUND[key] }); seen.add(key); break; }
    }
  }
  return out;
}

/** The route ground contract for a settlement's trade access. @returns {{roads:number, grade:number}} */
export function routeContract(settlement) {
  const access = String(settlement?.config?.tradeRouteAccess || '').toLowerCase();
  return ROUTE_GROUND[access] || ROUTE_GROUND.road;
}

/**
 * @typedef {Object} Substrate
 * @property {number} n            cells per side
 * @property {number} cell         view units per cell
 * @property {Float64Array} height 0..1, 0 = the local low, 1 = the local high
 * @property {Float64Array} slope  0..1, the local gradient magnitude
 * @property {Float64Array} flow   0..1, normalized upstream accumulation
 * @property {Float64Array} wet    0..1, wetness (flow + family bias + basin trapping)
 * @property {string} family       the landform family name
 * @property {{ relief:number, grain:number, ridged:number, trough:number, ramp:number, wetBias:number, rockBias:number }} shape
 * @property {{ ax:number, ay:number, bx:number, by:number }} valley  the trough's axis, view space
 * @property {number} rampEdge     which frame edge the coastal ramp falls to (0=N,1=E,2=S,3=W)
 * @property {Array<{ key:string, needs:string }>} resourceContracts
 * @property {{ roads:number, grade:number }} route
 * @property {number} reliefFloor  the floor the family + economy demanded of `relief`
 */

/**
 * Build the terrain substrate. PURE: a function of (settlement facts, seed, variant).
 *
 * @param {any} settlement                  the dossier
 * @param {string} terrain                  the LANDED resolveTerrain(config) result
 * @param {{ seed: string|number, variant?: number }} seeding
 * @returns {Substrate}
 */
export function buildSubstrate(settlement, terrain, seeding, facts = {}) {
  const declared = LANDFORM_FAMILIES[terrain] ? terrain : DEFAULT_FAMILY;
  // §5.-1c: SOLVE, do not look up. The declared terrain is one constraint among several.
  const constraints = forcedConstraints(settlement, declared, facts);
  const solved = reconcileLandform(constraints, declared);
  const family = solved.family;
  const base = LANDFORM_FAMILIES[family] || RECONCILED_SHAPES[family] || LANDFORM_FAMILIES[declared];
  const contracts = resourceContracts(settlement);
  const route = routeContract(settlement);

  // ── §161a: the ECONOMY raises the relief floor and the rock/wet biases. A mining
  //    settlement on a pancake is incoherent whatever its terrainType says, and the
  //    coherence walker reds exactly that. Truth adds; it never subtracts (the map may
  //    not flatten a mountain because the town happens to fish).
  let reliefFloor = 0, wetBias = base.wetBias, rockBias = base.rockBias;
  for (const { contract } of contracts) {
    if (contract.reliefFloor > reliefFloor) reliefFloor = contract.reliefFloor;
    wetBias += contract.wet;
    rockBias += contract.rock;
  }
  const relief = Math.max(base.relief, reliefFloor);

  // ⭐ §297.4c · THE SALT'S ONE HOME. This module used to compose its own root — a SECOND
  //   spelling of `fabricRng`'s rule. The string is byte-identical to the one it built itself;
  //   only the ownership moved. See `legacySubstrateForkKey`'s docstring for why the CONVERSION
  //   to `fabricForkKey` is a declared same-seed shift and is NOT taken here.
  const seedKey = legacySubstrateForkKey(seeding.seed, seeding.variant);
  const seedInt = hash32(seedKey);

  // ── The VALLEY AXIS: a through-going line the trough term pulls the ground down to.
  //    Its bearing is hashed (stable per settlement), and it crosses the WHOLE frame,
  //    because a valley that stops at the town edge is a hole, not a valley.
  const bearing = hashUnit(`${seedKey}|valley|bearing`);
  const across = hashUnit(`${seedKey}|valley|across`);
  const ax = bearing * VIEW, ay = 0;
  const bx = (1 - bearing) * VIEW * 0.55 + across * VIEW * 0.45, by = VIEW;
  const vdx = bx - ax, vdy = by - ay;
  const vlen = Math.sqrt(vdx * vdx + vdy * vdy) || 1;

  const rampEdge = Math.floor(hashUnit(`${seedKey}|ramp|edge`) * 4);

  const n = GRID_N;
  const height = new Float64Array(n * n);
  const octaves = 5;
  const basePeriod = n / base.grain;

  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      const raw = fbm(seedInt, i, j, octaves, basePeriod);
      // Blend smooth → ridged by the family's character.
      let h = raw * (1 - base.ridged) + ridged(raw) * base.ridged;

      // THE TROUGH: pull the ground down toward the valley axis. Distance to the axis,
      // normalized, squashed — so the valley floor is broad and its shoulders rise.
      if (base.trough > 0) {
        const px = (i + 0.5) * CELL, py = (j + 0.5) * CELL;
        const t = ((px - ax) * vdx + (py - ay) * vdy) / (vlen * vlen);
        const tc = t < 0 ? 0 : t > 1 ? 1 : t;
        const qx = ax + vdx * tc, qy = ay + vdy * tc;
        const d = Math.sqrt((px - qx) * (px - qx) + (py - qy) * (py - qy));
        const near = unit(d / (VIEW * 0.30));
        h = h * (1 - base.trough) + (near * near * 0.85 + 0.05) * base.trough;
      }

      // THE RAMP: a coastline's shelf, a monotone fall to one frame edge.
      if (base.ramp > 0) {
        const u = rampEdge === 0 ? j / (n - 1)
          : rampEdge === 1 ? 1 - i / (n - 1)
            : rampEdge === 2 ? 1 - j / (n - 1)
              : i / (n - 1);
        h = h * (1 - base.ramp) + u * base.ramp;
      }

      // RELIEF scales the whole field about its midline: the same landform, more or
      // less of it. A settlement's ground keeps its SHAPE across tiers; only its
      // vertical exaggeration answers to the family.
      height[j * n + i] = unit(0.5 + (h - 0.5) * relief * 1.6);
    }
  }

  // ── SLOPE: central-difference gradient magnitude, normalized to 0..1 by the steepest
  //    cell present. Normalizing by a CONSTANT instead would make a gentle landscape
  //    report as unbuildable everywhere at low relief; normalizing by the local maximum
  //    keeps "steep" meaning "steep FOR THIS PLACE", which is how a builder reads it.
  const slope = new Float64Array(n * n);
  let maxSlope = 0;
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      const l = height[j * n + Math.max(0, i - 1)], r = height[j * n + Math.min(n - 1, i + 1)];
      const u = height[Math.max(0, j - 1) * n + i], d = height[Math.min(n - 1, j + 1) * n + i];
      const gx = (r - l) / 2, gy = (d - u) / 2;
      const g = Math.sqrt(gx * gx + gy * gy);
      slope[j * n + i] = g;
      if (g > maxSlope) maxSlope = g;
    }
  }
  if (maxSlope > 0) for (let k = 0; k < slope.length; k++) slope[k] = slope[k] / maxSlope;
  // ⚠ THE DIVISOR IS CARRIED, because a normalized field without its divisor is a unit
  // nobody can convert. `reliefField` publishes it as `localMax` and states the consequence.
  const slopeLocalMax = maxSlope;

  // ── FLOW: D8 steepest-descent accumulation. Cells are visited from HIGH to LOW, so
  //    every cell's upstream contribution is already accumulated when it drains — one
  //    pass, exact, no iteration-to-convergence and therefore no convergence threshold
  //    to become a hidden tuning value.
  const order = new Array(n * n);
  for (let k = 0; k < n * n; k++) order[k] = k;
  order.sort((a, b) => (height[b] - height[a]) || (a - b));   // ties by index: total order
  const flow = new Float64Array(n * n);
  for (let k = 0; k < n * n; k++) flow[k] = 1;
  let maxFlow = 1;
  for (const k of order) {
    const i = k % n, j = (k - i) / n;
    let lowest = -1, lowestH = height[k];
    for (let dj = -1; dj <= 1; dj++) {
      for (let di = -1; di <= 1; di++) {
        if (di === 0 && dj === 0) continue;
        const ni = i + di, nj = j + dj;
        if (ni < 0 || nj < 0 || ni >= n || nj >= n) continue;
        const nk = nj * n + ni;
        if (height[nk] < lowestH) { lowestH = height[nk]; lowest = nk; }
      }
    }
    if (lowest >= 0) {
      flow[lowest] += flow[k];
      if (flow[lowest] > maxFlow) maxFlow = flow[lowest];
    }
  }
  // Normalize on a SQUARE-ROOT scale: accumulation is heavy-tailed (one trunk carries
  // the whole basin), and a linear normalize renders every tributary as zero.
  const rootMax = Math.sqrt(maxFlow);
  for (let k = 0; k < flow.length; k++) flow[k] = unit(Math.sqrt(flow[k]) / rootMax);

  // ── WETNESS: flow + the family/economy bias + BASIN TRAPPING (a cell lower than all
  //    its neighbours holds water — that is what a marsh is). Height damps it: high
  //    ground sheds.
  //
  // ⛔ THE DRY GATE — siteGenesis's DRY_BIOME_RE / WATER_ECONOMY_RE rule, RE-ASSERTED AT
  //    THE SUBSTRATE LAYER. A desert's ground can still have a drainage line (a wadi is
  //    a real landform), but it may not hold STANDING water unless the settlement's own
  //    economy justifies it — a salt pan, an oasis fishery, an irrigation works. Without
  //    this gate the flow term alone puts a permanent river down a desert valley, which
  //    is the exact realm-incoherence the landed rule exists to refuse. The gate is a
  //    hard multiplier rather than another bias term precisely so the coherence pin is
  //    BINARY and cannot be tuned into ambiguity.
  const dryFamily = family === 'desert' || family === 'oasis';
  const waterEconomy = contracts.some((c) => c.contract.wet > 0.10);
  const dryGate = dryFamily && !waterEconomy ? 0 : 1;
  const wet = new Float64Array(n * n);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      const k = j * n + i;
      let trapped = 1;
      for (let dj = -1; dj <= 1 && trapped; dj++) {
        for (let di = -1; di <= 1; di++) {
          if (di === 0 && dj === 0) continue;
          const ni = i + di, nj = j + dj;
          if (ni < 0 || nj < 0 || ni >= n || nj >= n) continue;
          if (height[nj * n + ni] < height[k]) { trapped = 0; break; }
        }
      }
      wet[k] = unit(flow[k] * 0.72 + trapped * 0.34 + wetBias + (1 - height[k]) * 0.22 - 0.24) * dryGate;
    }
  }

  return {
    n,
    cell: CELL,
    height,
    slope,
    slopeLocalMax,
    flow,
    wet,
    family,
    shape: { ...base, relief, rockBias, wetBias },
    valley: { ax, ay, bx, by },
    rampEdge,
    // ⭐⭐ ⟦§303.6 / MF-D1 RAISED-8⟧ **THE WORKABLE SHARE, PUBLISHED AT LAST.** `buildFabric` has
    // read `sub.workableShare` since the tenure pattern landed and this object has never carried
    // it, so the reader's `== null ? 0.6` fallback was the value on every leaf of the corpus.
    // The statistic is this module's own (`workableSlopeShare`) and it is computed from the
    // finished slope field — the same field the resource-coherence census already reads it off.
    // ⚠ THIS IS A DECLARED SAME-SEED SHIFT: the nucleated/dispersed siting decision now varies
    // with the ground, which is what it was written to do.
    workableShare: workableSlopeShare({ slope }),
    // ⭐⭐ ⟦§303.6 / MF-D1 RAISED-8⟧ **AND THE SUBSTRATE KEY, WHICH WAS A CONSTANT.**
    // `wallCircuit` DECLARES `substrateKey` as an input of its content hash and computed it as
    // `sub.key || `${sub.n}x${sub.cell}`` — and `sub.key` did not exist, so the expression
    // yielded ONE value, `"96x10.416666666666666"`, on all seventeen leaves. Both parts are
    // module constants. ⭐ `wallCircuit.js`'s own comment eleven lines below diagnoses exactly
    // this defect for a SIBLING field: *"a declared input whose value was a constant … a
    // declaration that never declared anything."* It was true of two fields, not one.
    // ⚠ THE KEY IS OVER THE SUBSTRATE'S OWN DERIVED SHAPE, not over its arrays: the family, the
    // relief/rock/wet biases, the valley axis and the coastal ramp are what MAKE this ground
    // this ground, and they are cheap, stable and per-leaf. Hashing 9,216 floats would move the
    // key on a rounding change that moves no geometry.
    key: `sub:${family}|r${r2(relief)}|k${r2(rockBias)}|w${r2(wetBias)}`
      + `|v${r2(ax)},${r2(ay)},${r2(bx)},${r2(by)}|e${rampEdge}|f${r2(reliefFloor)}`,
    resourceContracts: contracts.map((c) => ({ key: c.key, needs: c.contract.needs })),
    // §15.7's SUBSTRATE IMPERFECTION — see `siteResources`.
    resourceSites: siteResources(contracts, { n, cell: CELL, height, slope, wet, shape: { ...base, relief, rockBias, wetBias } }, seedKey),
    route,
    reliefFloor,
    // §5.-1c: the reconciliation, carried so the render can draw the WORK and the pin can
    // assert the right thing (forced settlements assert "every forced fact honoured",
    // unforced ones assert "the land matches the economy").
    declaredTerrain: declared,
    constraints,
    forced: solved.forced,
    strain: solved.strain,
    strained: solved.strained,
    works: solved.strained.map((c) => ({ constraint: c, work: STRAIN_WORKS[c] || 'recorded strain, no drawn work defined' })),
    reconciliation: solved.reason,
  };
}

/**
 * ⭐⭐⭐ §15.7 · SUBSTRATE IMPERFECTION — "the terrain solver seeds mild inconvenience (the
 * ore not always at the handiest slope), so the land supports the settlement WITHOUT
 * LOOKING DESIGNED FOR IT."
 *
 * ⛔ WHAT WAS THERE, AND WHY IT READS AS DESIGNED. The resource contracts raised the
 * substrate's GLOBAL biases — a mining economy lifted the relief floor and the rock bias
 * everywhere — and then nothing ever asked WHERE the ore was. Every consumer that wanted
 * stone or ore took the best cell it could find, so the quarry was always on the handiest
 * slope, the adit always at the nearest crag, and the leaf read as a board laid out for the
 * settlement's convenience. §5.-1's own promise is the opposite: "randomness proposes;
 * terrain disposes."
 *
 * ⭐ THE MECHANISM IS A SEEDED RANK, NOT A SEEDED POSITION, and that distinction is the
 * whole of the clause. Displacing the resource to a RANDOM cell would break the ground
 * contract — ore in a bog is not inconvenient, it is false. So every cell is scored against
 * the contract it must satisfy, the candidates are RANKED, and the site is drawn from among
 * the best few with a bias toward the better: the ore is genuinely in ore-bearing ground,
 * and it is on the third-best slope rather than the first. `handiest` is carried alongside,
 * so the INCONVENIENCE is a measured quantity rather than a claim — a pin can hold the
 * distance between where the resource is and where it would have been most convenient.
 *
 * ⚠ THE CANDIDATE POOL IS FIXED AT `IMPERFECTION_POOL`, not proportional to the grid, so
 * the draw's spread does not change if the substrate resolution ever moves.
 */
export const IMPERFECTION_POOL = 6;

export function siteResources(contracts, sub, seedKey) {
  /** @type {Array<any>} */ const out = [];
  const n = sub.n, cell = sub.cell;
  for (const { key, contract } of contracts) {
    /** @type {Array<{x:number,y:number,fit:number,k:number}>} */ const cands = [];
    for (let j = 1; j < n - 1; j++) {
      for (let i = 1; i < n - 1; i++) {
        const k = j * n + i;
        const h = sub.height[k], sl = sub.slope[k], w = sub.wet[k];
        // The contract's own ground test, expressed as a FIT rather than a filter: the
        // §161a row says what the ground must be ABLE to carry, and a fit lets the best
        // available ground win even where nothing is ideal (the ranking law again).
        let fit;
        switch (contract.needs) {
          case 'workable-slope': fit = sl * (1 - w) * (0.55 + h * 0.45); break;
          case 'exposed-stone': fit = sl * (0.4 + h * 0.6) * (1 - w); break;
          case 'flat-pan': fit = (1 - sl) * (1 - Math.abs(w - 0.25) * 2); break;
          case 'shore': fit = w * (1 - h); break;
          case 'standing-forest': fit = (1 - sl * 0.5) * (0.4 + w * 0.6); break;
          case 'flat-tillage': fit = (1 - sl) * (1 - Math.abs(w - 0.30) * 1.6); break;
          case 'rough-pasture': fit = sl * (1 - w) * 0.8 + 0.2 * h; break;
          default: fit = 1 - sl;
        }
        if (!(fit > 0)) continue;
        cands.push({ x: (i + 0.5) * cell, y: (j + 0.5) * cell, fit, k });
      }
    }
    if (!cands.length) continue;
    // A TOTAL ORDER — fit, then the cell index — so the pool is byte-stable.
    cands.sort((a, b) => (b.fit - a.fit) || (a.k - b.k));
    const pool = cands.slice(0, IMPERFECTION_POOL);
    // The draw: biased toward the better ground (weight falls with rank) but never pinned
    // to the best. `hashUnit` on the resource's own key, so adding a second resource never
    // moves the first — the inertia law reaches the ground as well as the drawing.
    let total = 0;
    const weights = pool.map((_, r) => { const w = 1 / (r + 1.4); total += w; return w; });
    let roll = hashUnit(`${seedKey}|resource|${key}|site`) * total;
    let pick = 0;
    for (let r = 0; r < pool.length; r++) { roll -= weights[r]; if (roll <= 0) { pick = r; break; } }
    const site = pool[pick], best = pool[0];
    out.push({
      key,
      needs: contract.needs,
      x: site.x,
      y: site.y,
      fit: site.fit,
      rank: pick,
      pool: pool.length,
      handiest: { x: best.x, y: best.y, fit: best.fit },
      // The measured inconvenience: how far the resource sits from the handiest ground that
      // could have carried it, and how much worse that ground is.
      displacement: Math.sqrt((site.x - best.x) * (site.x - best.x) + (site.y - best.y) * (site.y - best.y)),
      fitLoss: best.fit > 0 ? 1 - site.fit / best.fit : 0,
    });
  }
  return out;
}

/** Sample a substrate field at view-space (x, y) — nearest cell, clamped in bounds.
 * @param {Substrate} sub @param {Float64Array} field @param {number} x @param {number} y */
export function sampleAt(sub, field, x, y) {
  let i = Math.floor(x / sub.cell), j = Math.floor(y / sub.cell);
  if (i < 0) i = 0; else if (i >= sub.n) i = sub.n - 1;
  if (j < 0) j = 0; else if (j >= sub.n) j = sub.n - 1;
  return field[j * sub.n + i];
}

/** Height at a view-space point. */
export function heightAt(sub, x, y) { return sampleAt(sub, sub.height, x, y); }
/** Slope at a view-space point. */
export function slopeAt(sub, x, y) { return sampleAt(sub, sub.slope, x, y); }
/** Wetness at a view-space point. */
export function wetAt(sub, x, y) { return sampleAt(sub, sub.wet, x, y); }
/** Flow accumulation at a view-space point. */
export function flowAt(sub, x, y) { return sampleAt(sub, sub.flow, x, y); }

/**
 * MEASURED RELIEF — the peak-to-trough spread of the height field, 0..1. This is the
 * number §161a's consistency pin actually asserts on: a mountain settlement's measured
 * relief must clear a floor, and a planted flat substrate must fail it.
 * @param {Substrate} sub @returns {number}
 */
export function measuredRelief(sub) {
  let lo = Infinity, hi = -Infinity;
  for (let k = 0; k < sub.height.length; k++) {
    const h = sub.height[k];
    if (h < lo) lo = h;
    if (h > hi) hi = h;
  }
  return hi - lo;
}

/** The share of cells whose wetness clears `threshold` — "how much standing water".
 * @param {Substrate} sub @param {number} [threshold] @returns {number} */
export function wetShare(sub, threshold = 0.62) {
  let n = 0;
  for (let k = 0; k < sub.wet.length; k++) if (sub.wet[k] >= threshold) n++;
  return n / sub.wet.length;
}

/**
 * ⭐⭐⭐ §5 W1 EXIT 1 · THE RELIEF FIELD — a leaf publishes the SHAPE OF ITS GROUND, not one
 * number about it.
 *
 * ⛔ WHAT A SCALAR COSTS, AND IT IS NOT AN ABSTRACTION. `meta.relief` is `hi − lo` of the
 * height field, and the cartouche prints it: `MOUNTAIN · RELIEF 0.66`. Two leaves with the
 * same 0.66 can be a single cliff in a plain and a whole folded upland, and every consumer
 * downstream of the scalar — the hachure ration, the terrace grammar, §214's iconography arm,
 * the wall's terrain-surrender run — has to guess which. **Every one of them guessed the same
 * way, because a scalar has only one answer to give.**
 *
 * ⭐ THE FIELD IS DERIVED, NEVER STORED (§161 LAYER ZERO). Nothing here is persisted and
 * nothing is hashed into identity: it is a reading of the substrate the substrate can always
 * re-take, which is what makes it safe to publish. Perturb the substrate seed and every row
 * moves; hold it and every row is byte-identical.
 *
 * THE ROWS, and each one is a question a later stage actually asks:
 *   `spread`      the scalar that used to be the whole story — kept, so nothing regresses.
 *   `bands`       the height histogram in 8 equal bands: the leaf's vertical PROFILE. A
 *                 cliff-in-a-plain is bimodal; a folded upland is broad. This is the row that
 *                 makes two 0.66 leaves distinguishable.
 *   `steepShare`  the share of ground above the hachure threshold — how much of the leaf is
 *                 scarp, which is what a mark ration should be proportional to.
 *   `cragShare`   the share above the crag threshold: bare rock, not merely slope.
 *   `flatShare`   the share BELOW the hill threshold — the ground a plan can be laid on
 *                 without cutting, which is the refusal mask's own complement.
 *   `wetShare`    standing water's share (the inundation refusal's subject).
 *   `p50`/`p90`   slope quantiles: the honest answer to "is this place steep", which a
 *                 spread cannot give because a spread is two cells.
 *   `localMax`    the raw gradient the normalized `slope` field was divided by. ⚠ THIS ROW
 *                 IS THE ONE A COMPARISON NEEDS. `sub.slope` is normalized to its own leaf's
 *                 steepest cell (see buildSubstrate), so `slope = 0.5` means "half as steep
 *                 as the steepest thing HERE" and is not comparable across leaves at all.
 *                 Publishing the divisor is what lets a later stage recover an absolute
 *                 reading instead of quietly comparing two different units.
 *
 * @param {Substrate} sub @returns {{spread:number, bands:number[], steepShare:number,
 *   cragShare:number, flatShare:number, wetShare:number, slopeP50:number, slopeP90:number,
 *   localMax:number, n:number, reason:string}}
 */
export function reliefField(sub) {
  const N = sub.height.length;
  let lo = Infinity, hi = -Infinity;
  for (let k = 0; k < N; k++) { const h = sub.height[k]; if (h < lo) lo = h; if (h > hi) hi = h; }
  const spread = hi - lo;
  const bands = [0, 0, 0, 0, 0, 0, 0, 0];
  for (let k = 0; k < N; k++) {
    const t = spread > 0 ? (sub.height[k] - lo) / spread : 0;
    let b = Math.floor(t * 8); if (b > 7) b = 7; if (b < 0) b = 0;
    bands[b]++;
  }
  let steep = 0, crag = 0, flat = 0, wet = 0;
  for (let k = 0; k < N; k++) {
    const s = sub.slope[k];
    if (s >= 0.38) steep++;
    if (s >= 0.60) crag++;
    if (s < 0.16) flat++;
    if (sub.wet[k] >= 0.62) wet++;
  }
  const sorted = Array.prototype.slice.call(sub.slope).sort((a, b) => a - b);
  const q = (p) => sorted[Math.min(sorted.length - 1, Math.floor(p * (sorted.length - 1)))];
  return {
    spread,
    bands: bands.map((c) => c / N),
    steepShare: steep / N,
    cragShare: crag / N,
    flatShare: flat / N,
    wetShare: wet / N,
    slopeP50: q(0.5),
    slopeP90: q(0.9),
    localMax: sub.slopeLocalMax == null ? 0 : sub.slopeLocalMax,
    n: sub.n,
    reason: `relief field on '${sub.family}': spread ${spread.toFixed(3)}, `
      + `${(steep / N * 100).toFixed(1)}% scarp, ${(crag / N * 100).toFixed(1)}% crag, `
      + `${(flat / N * 100).toFixed(1)}% level, ${(wet / N * 100).toFixed(1)}% standing water; `
      + `slope p50 ${q(0.5).toFixed(3)} p90 ${q(0.9).toFixed(3)} (normalized to a local max of `
      + `${(sub.slopeLocalMax == null ? 0 : sub.slopeLocalMax).toFixed(5)} — ⚠ NOT comparable across leaves without it)`,
  };
}

/**
 * ⭐⭐⭐ §5 W1 EXIT 1 · THE §161a CONSISTENCY READING — **OVER EVERY RESOURCE INPUT, NOT OVER
 * `terrainType` ALONE.**
 *
 * §161a's own sentence is *"a settlement's land must be the land its OWN economy could have
 * grown from"*, and it names four contracts by hand: **ore ⇒ workable slopes AND spoil
 * ground · fisheries ⇒ shore AND shoal · timber ⇒ standing forest · quarry ⇒ exposed stone.**
 * Until this function the only thing any pin asserted was the RELIEF FLOOR — which is one
 * number out of the four contracts and says nothing at all about a fishery or a wood.
 *
 * ⚠⚠ AND THE ONE TRAP THIS FUNCTION IS WRITTEN AROUND, because it is the pin-vacuity class
 * this estate keeps paying for: **A COHERENCE CHECK THAT RE-USES THE SITER'S OWN FIT
 * EXPRESSION IS `list === list`.** `siteResources` scores every cell by a `fit` and takes a
 * seeded rank; if this asked the same expression it would be asserting that the argmax of a
 * function is where the function is large. So it asks a **different question in different
 * terms**: not *"which cell scored best"* but *"does this LEAF measurably carry the ground
 * this economy needs, and is the resource ON it"* — leaf-level SHARES plus absolute readings
 * at the site, with floors, none of which appear in `siteResources`.
 *
 * THE ROWS, one per `needs` value, each stating the two facts §161a names:
 *   workable-slope   ore/iron/gems: a share of the leaf in the workable band, AND the site
 *                    itself on real gradient with dry ground beside it for the spoil.
 *   exposed-stone    stone/quarry: the same slope evidence PLUS the family's rock bias — a
 *                    quarry needs stone, and stone is a property of the ground, not of angle.
 *   shore            fish: wet ground reachable from the site, AND a SHOAL — a band of
 *                    shallow ground beside it, which is what a fishery actually works.
 *   standing-forest  timber: soil that holds water and ground gentle enough to grow and
 *                    extract on. A wood on a cliff is not a timber economy.
 *   flat-tillage / rough-pasture / flat-pan  the remaining rows, held to their own terms.
 *
 * @param {Substrate} sub
 * @returns {{ coherent:boolean, rows:Array<{key:string,needs:string,ok:boolean,why:string,
 *   evidence:Record<string,number>}>, checked:number, status:string, reason:string }}
 */
export function resourceCoherence(sub) {
  const sites = sub.resourceSites || [];
  /** @type {Array<any>} */ const rows = [];
  const gradeAt = (x, y) => sampleAt(sub, sub.slope, x, y) * (sub.slopeLocalMax || 0);
  // Leaf-level shares — a different statistic from anything `siteResources` computes.
  const workable = workableSlopeShare(sub);
  const wet = wetShare(sub, 0.45);
  const rock = sub.shape.rockBias || 0;
  let gentle = 0, damp = 0, wetSum = 0;
  for (let k = 0; k < sub.slope.length; k++) {
    if (sub.slope[k] < 0.42) gentle++;
    if (sub.wet[k] >= 0.30 && sub.wet[k] < 0.62) damp++;
    wetSum += sub.wet[k];
  }
  gentle /= sub.slope.length; damp /= sub.wet.length;
  const meanWet = wetSum / sub.wet.length;
  const ramp = sub.shape.ramp || 0;
  // ⛔⛔ THE LOW-GROUND LINE, AND FINDING IT WAS A CORRECTION TO THIS FUNCTION'S FIRST DRAFT.
  // A coastal fishery's shoal cannot be read off `sub.wet` AT ALL: the sea is a HEIGHT
  // CONTOUR traced by `relief.shoreContour`, and the wetness field — flow, trapping and bias
  // — knows nothing about it. MEASURED, a real coastal leaf's landing ring came back 16.7%
  // "wet" and the arm red on a correct settlement. ⭐ THE CLASS: **an instrument borrowed
  // from the wrong field measures the wrong thing confidently**, and here the right field is
  // the one the sea is actually made of.
  const heights = Array.prototype.slice.call(sub.height).sort((a, b) => a - b);
  const lowLine = heights[Math.floor(0.20 * (heights.length - 1))];

  for (const r of sites) {
    const g = gradeAt(r.x, r.y), w = wetAt(sub, r.x, r.y), h = heightAt(sub, r.x, r.y);
    // ⭐ THE SHOAL: the share of a small DISC around the landing that is shallow — standing
    // water OR ground in the leaf's lowest fifth (the strand a boat is hauled up). A fishery
    // on a cliff-edged coast has no shoal and is not a fishery.
    // ⛔ A RING AT ONE RADIUS WAS THE FIRST SPELLING AND IT MEASURED THE WRONG THING. At 3
    // cells out it read 8% on a correct coastal landing whose own cell was fully wet, because
    // a ring samples ONE distance and a shallow margin is a BAND. ⭐ THE CLASS, and it is
    // `bodyRefusal`'s own lesson at a smaller scale: **a shape's property sampled on a circle
    // is a property of the circle.** A disc of 2 cells is the shallow margin a landing works.
    let shoal = 0, disc = 0;
    const R = 2;
    const ci = Math.floor(r.x / sub.cell), cj = Math.floor(r.y / sub.cell);
    for (let dj = -R; dj <= R; dj++) {
      for (let di = -R; di <= R; di++) {
        if (di * di + dj * dj > R * R) continue;
        const i = ci + di, j = cj + dj;
        if (i < 0 || j < 0 || i >= sub.n || j >= sub.n) continue;
        disc++;
        const k = j * sub.n + i;
        if (sub.wet[k] >= 0.35 || sub.height[k] <= lowLine) shoal++;
      }
    }
    shoal = disc ? shoal / disc : 0;
    let ok = false, why = '';
    /** @type {Record<string, number>} */ const evidence = {
      grade: g, wet: w, height: h, workableShare: workable, wetShare: wet,
      rockBias: rock, gentleShare: gentle, dampShare: damp, shoalShare: shoal,
      meanWet, ramp, lowLine,
    };
    switch (r.needs) {
      case 'workable-slope':
        ok = workable >= 0.04 && g > 0 && w < 0.55;
        why = `ore needs WORKABLE SLOPES and SPOIL GROUND: ${(workable * 100).toFixed(1)}% of the leaf `
          + `is in the workable band (floor 4%), the working stands on grade ${g.toFixed(4)} and its `
          + `ground is dry enough to tip spoil on (wet ${w.toFixed(2)} < 0.55)`;
        break;
      case 'exposed-stone':
        ok = workable >= 0.04 && rock > 0 && g > 0;
        why = `a quarry needs EXPOSED STONE: rock bias ${rock.toFixed(2)} (floor > 0) and `
          + `${(workable * 100).toFixed(1)}% workable slope, the face standing on grade ${g.toFixed(4)}`;
        break;
      case 'shore':
        // SHORE = water this settlement can reach — standing water (a river or lake fishery)
        // or a SHELF (`ramp`, which IS the statement "this land falls away to open water").
        // SHOAL = shallow ground around the landing. Floors from the measured corpus: a real
        // coastal leaf reads 0.58–1.00, a hills leaf 0.25, a forest leaf 0.08.
        ok = (wet > 0 || ramp > 0) && shoal >= 0.30;
        why = `a fishery needs SHORE and SHOAL: ${(wet * 100).toFixed(1)}% of the leaf is wet, `
          + `shelf ${ramp.toFixed(2)}, and ${(shoal * 100).toFixed(0)}% of the ring around the `
          + `landing DISC is shallow — standing water or ground in the leaf's lowest fifth (floor 30%)`;
        break;
      case 'standing-forest':
        // Soil that HOLDS water, on ground a team can grow and extract on. Floors from the
        // measured corpus: forest 0.137 mean wetness, plains 0.061, desert 0.000.
        ok = meanWet >= 0.04 && gentle >= 0.30;
        why = `timber needs STANDING FOREST — soil that holds water on ground it can be grown and `
          + `extracted on: mean wetness ${meanWet.toFixed(3)} (floor 0.04), `
          + `${(gentle * 100).toFixed(0)}% gentle ground (floor 30%)`;
        break;
      case 'flat-tillage':
        ok = gentle >= 0.30;
        why = `tillage needs FLAT GROUND: ${(gentle * 100).toFixed(0)}% gentle (floor 30%)`;
        break;
      case 'rough-pasture':
        ok = workable >= 0.02 || gentle >= 0.30;
        why = `pasture needs ROUGH GROUND OR OPEN GROUND: workable ${(workable * 100).toFixed(1)}%, `
          + `gentle ${(gentle * 100).toFixed(0)}%`;
        break;
      case 'flat-pan':
        ok = gentle >= 0.30 && w >= 0;
        why = `a salt pan needs a FLAT PAN: ${(gentle * 100).toFixed(0)}% gentle ground`;
        break;
      default:
        ok = true;
        why = `no ground contract is declared for '${r.needs}'`;
    }
    rows.push({ key: r.key, needs: r.needs, ok, why, evidence });
  }
  const bad = rows.filter((r) => !r.ok);
  // ⚠ THE LADDER (laneMFPERF1 §8). A settlement whose economy names NO contract-bearing
  // resource has nothing to check, and that is an ABSENCE OF A QUESTION, not a clean bill.
  const status = !sites.length ? 'NOT APPLICABLE' : 'MEASURED';
  return {
    coherent: bad.length === 0,
    rows,
    checked: rows.length,
    status,
    reason: status === 'NOT APPLICABLE'
      ? '§161a consistency: NOT APPLICABLE — this economy names no resource carrying a ground contract'
      : `§161a consistency over ${rows.length} resource contracts: `
        + (bad.length ? `⛔ ${bad.length} INCOHERENT — ${bad.map((r) => `${r.key} (${r.needs})`).join(', ')}`
          : 'every contract is carried by the ground'),
  };
}

/** The share of cells whose slope sits in the WORKABLE band — steep enough to expose
 * ore or hold a terrace, shallow enough to work. Mining country must have some.
 * @param {Substrate} sub @returns {number} */
export function workableSlopeShare(sub) {
  let n = 0;
  for (let k = 0; k < sub.slope.length; k++) if (sub.slope[k] >= 0.30 && sub.slope[k] <= 0.86) n++;
  return n / sub.slope.length;
}

/**
 * THE DRAINAGE TRACE — the wettest connected descent through the frame, walked from the
 * highest-flow edge cell downhill. This is where a river GOES once siteGenesis has said
 * one exists; it is never used to decide THAT one exists (the one-decider rule).
 * @param {Substrate} sub @returns {Array<[number, number]>} view-space polyline
 */
export function drainageTrace(sub) {
  const n = sub.n;

  // ⚠ THE TRUNK IS FOUND AT ITS MOUTH, THEN WALKED BACKWARD. The obvious spelling —
  // "start at the highest-flow cell and walk downhill" — returns a ONE-POINT trace,
  // because the highest-flow cell IS the basin outlet and there is nowhere below it to
  // go. The channel has to be recovered by walking UPSTREAM from the mouth (always
  // taking the tributary that carries the most water) and then reversing, which is also
  // how the drainage physically exists: the trunk is the thing all the water chose.
  let mouth = 0;
  for (let k = 1; k < n * n; k++) if (sub.flow[k] > sub.flow[mouth]) mouth = k;

  /** @type {number[]} */ const chain = [mouth];
  const seen = new Set([mouth]);
  let cur = mouth;
  for (let step = 0; step < n * 4; step++) {
    const i = cur % n, j = (cur - i) / n;
    let nextK = -1, bestFlow = 0;
    for (let dj = -1; dj <= 1; dj++) {
      for (let di = -1; di <= 1; di++) {
        if (di === 0 && dj === 0) continue;
        const ni = i + di, nj = j + dj;
        if (ni < 0 || nj < 0 || ni >= n || nj >= n) continue;
        const nk = nj * n + ni;
        if (seen.has(nk)) continue;
        // Upstream means HIGHER ground; among the higher neighbours take the wettest,
        // which is the tributary the basin actually drains through.
        if (sub.height[nk] <= sub.height[cur]) continue;
        if (sub.flow[nk] > bestFlow) { bestFlow = sub.flow[nk]; nextK = nk; }
      }
    }
    if (nextK < 0) break;
    seen.add(nextK);
    chain.push(nextK);
    cur = nextK;
  }

  chain.reverse();                              // headwater → mouth, the reading order
  /** @type {Array<[number, number]>} */ const pts = [];
  for (const k of chain) {
    const i = k % n, j = (k - i) / n;
    pts.push([(i + 0.5) * sub.cell, (j + 0.5) * sub.cell]);
  }

  // ⭐ §2.3 THE CONTINUITY LAW: "the river crosses the WHOLE frame". The accumulation trace
  // finds the trunk INSIDE the leaf and stops at the cells that carry water, so both ends
  // land wherever the basin happened to start and finish — a river that begins in the middle
  // of the page and ends in the middle of the page, which reads as a pond with ambitions.
  // Both ends are run out to the frame: the water came from somewhere and goes somewhere,
  // and the leaf is a window on it, not its whole course.
  //
  // ⛔⛔ AND THE BEARING IS TAKEN OVER A WINDOW, NOT OVER ONE LATTICE STEP (MF-B5). The old
  // spelling extended along `pts[0] - pts[1]` — a SINGLE D8 step, which by construction is
  // one of eight compass directions. MEASURED on the riverside town: the headwater tail ran
  // 685 view units DEAD VERTICAL and the mouth tail 571 units DEAD HORIZONTAL, which is 69%
  // of the frame in one ruled line and the single largest half of the chair's §193.3
  // conviction. A window of four samples cannot be axis-locked unless the river really is.
  if (pts.length >= 2) {
    pts.unshift(runToEdge(pts, 0, 1));
    pts.push(runToEdge(pts, pts.length - 1, -1));
  }
  return pts;
}

/**
 * Extend from the polyline's end at `at` outward (direction `step` = +1 for the head,
 * -1 for the tail) until it clears the frame, on the bearing of the last TAIL_WINDOW
 * samples rather than of one lattice step.
 */
function runToEdge(pts, at, step) {
  const p = pts[at];
  let qx = 0, qy = 0, n = 0;
  for (let k = 1; k <= TAIL_WINDOW; k++) {
    const j = at + step * k;
    if (j < 0 || j >= pts.length) break;
    qx += pts[j][0]; qy += pts[j][1]; n++;
  }
  if (!n) return [p[0], p[1]];
  const dx = p[0] - qx / n, dy = p[1] - qy / n;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len === 0) return [p[0], p[1]];
  const ux = dx / len, uy = dy / len;
  // How far to the frame along this bearing — the smaller of the two axis crossings, plus
  // a margin so the stroke leaves the leaf rather than stopping on its edge.
  const tx = ux > 0 ? (VIEW - p[0]) / ux : ux < 0 ? -p[0] / ux : Infinity;
  const ty = uy > 0 ? (VIEW - p[1]) / uy : uy < 0 ? -p[1] / uy : Infinity;
  const t = Math.min(tx, ty) + 24;
  return [p[0] + ux * t, p[1] + uy * t];
}

/** How many samples the tail bearing averages over. See runToEdge. */
const TAIL_WINDOW = 4;

/**
 * ⭐⭐⭐ THE MEANDER LAW (chair directive, ODQ §193.3: "the substrate's water paths must
 * MEANDER — no axis-aligned runs, no right-angle turns").
 *
 * ⛔ THE ROOT CAUSE IS THE LATTICE, NOT THE SMOOTHING. `drainageTrace` walks the flow
 * field on a D8 grid, so every step it can take is one of eight compass bearings and every
 * turn it can make is a multiple of 45°. Chaikin rounds the corners and cannot remove the
 * bearings: a run of seven cells straight down a column is a 73-unit ruled vertical line
 * after any amount of smoothing, because smoothing a straight line returns a straight line.
 * MEASURED before this cure, riverside town: 81% of the trace's length lay within 4° of an
 * axis, with a single 692-unit axis run.
 *
 * ⭐ THE CURE IS A PHYSICAL CLAIM, NOT A JITTER. A river does not run down the middle of
 * the cells a coarse flow model assigned it; it MEANDERS across its valley floor, and the
 * meander's geometry is the best-known regularity in fluvial morphology: wavelength scales
 * with channel width (about a dozen widths), and amplitude with wavelength. So the channel
 * is resampled at a uniform pitch, given a lateral displacement built from two incommensurate
 * harmonics (one sine is a diagram; a river is not periodic), and then —
 *
 * ⭐⭐ THE VALLEY DISPOSES. Every displaced point is REFUSED back toward the centreline until
 * it stands no higher than `valleyBand` above the channel it came from. This is §5.-1.4's own
 * sentence applied to water: randomness proposes, terrain disposes. A meander that would
 * climb the valley side is not a meander, and in a gorge the amplitude collapses to nothing
 * on its own — which is exactly what a gorge river looks like.
 *
 * ⭐⭐ §5 W1 EXIT 6 · AND THE MEANDER IS DAMPED AT THE WORKED WATERFRONT, for the same
 * physical reason the sea's detail is (`relief.shoreContour`): a town REVETS the reach it
 * uses. Piling, quaying, a mill leat and a bridge abutment all do one thing to a channel —
 * they stop it wandering — and a straightened reach is the single most reliable mark of a
 * settlement on a historical river plan.
 * ⚠⚠ THIS IS THE MECHANISM §5 W1 EXIT 6's BANK ASYMMETRY MUST ARRIVE FROM, and it is why
 * there is no 70/30 anywhere in this file. A straightened reach gives ONE continuous bank
 * frontage; the wild reaches keep their lobes, which break frontage into pockets. The split
 * is a consequence with a cause, not a rule with a number — ATLAS banned prior #10.
 * ⚠ The damping scales `mod` (the per-station amplitude), never the hash: damping one reach
 * cannot move the meander of another (the §11.0 inertia law).
 *
 * @param {Substrate} sub
 * @param {Array<[number,number]>} pts     the lattice chain, tails already run out
 * @param {string} key                     the seed fork this channel meanders under
 * @param {{ width?: number, worked?: {x:number,y:number,r:number}|null }} [opts]
 * @returns {Array<[number,number]>}
 */
export function meanderChannel(sub, pts, key, opts = {}) {
  if (!pts || pts.length < 3) return pts || [];
  const width = Number.isFinite(opts.width) ? Math.max(2, opts.width) : 8;
  const wavelength = width * MEANDER.widthsPerWave;
  const amplitude = wavelength * MEANDER.amplitudeOfWave;

  // ── 1 · RESAMPLE at a uniform pitch, so the meander's wavelength is a fact about the
  //    WORLD and not about how many cells the flow model happened to step through.
  const line = resamplePolyline(pts, MEANDER.step);
  if (line.length < 4) return pts;
  const landing = landingOf(opts.worked, line);

  // ── 2 · ARCLENGTH, the meander's own parameter.
  const s = [0];
  for (let i = 1; i < line.length; i++) {
    const dx = line[i][0] - line[i - 1][0], dy = line[i][1] - line[i - 1][1];
    s.push(s[i - 1] + Math.sqrt(dx * dx + dy * dy));
  }

  // Two incommensurate harmonics with seeded phases. The ratio is deliberately irrational-
  // ish (0.61) so the pair never repeats inside a leaf — a repeating meander reads as
  // wallpaper, which is the §2.7 organic-irregularity law failing in a new costume.
  const ph1 = Math.floor(hashUnit(`${key}|ph1`) * TRIG_N);
  const ph2 = Math.floor(hashUnit(`${key}|ph2`) * TRIG_N);
  const lam2 = wavelength * MEANDER.secondRatio;

  /** @type {Array<[number,number]>} */ const out = [];
  let refused = 0;
  for (let i = 0; i < line.length; i++) {
    // ── 3 · THE TANGENT IS WINDOWED. A one-segment tangent on a lattice-derived line is
    //    itself a lattice bearing, so its normal is one too, and the meander would be laid
    //    out along the very axes it exists to break.
    const a = line[Math.max(0, i - MEANDER.window)];
    const b = line[Math.min(line.length - 1, i + MEANDER.window)];
    let tx = b[0] - a[0], ty = b[1] - a[1];
    const tl = Math.sqrt(tx * tx + ty * ty);
    if (tl < 1e-9) { out.push([line[i][0], line[i][1]]); continue; }
    tx /= tl; ty /= tl;
    const nx = -ty, ny = tx;

    const u1 = Math.floor((s[i] / wavelength) * TRIG_N) + ph1;
    const u2 = Math.floor((s[i] / lam2) * TRIG_N) + ph2;
    // A seeded per-station amplitude modulation: real meander trains grow and decay.
    const mod = MEANDER.modFloor + (1 - MEANDER.modFloor) * hashUnit(`${key}|m${Math.floor(s[i] / wavelength)}`);
    // ⭐ THE WORKED REACH. `workDamp` is 1 on a wild reach and falls to `MEANDER.workedFloor`
    // at the settlement's own seat — the revetment, in one term.
    const wd = workDamp(landing, line[i][0], line[i][1]);
    let lateral = amplitude * mod * wd * (sinI(u1) + MEANDER.secondAmp * sinI(u2));

    // ── 4 · THE VALLEY REFUSAL. Walk the offset back toward the centreline until the water
    //    is not being asked to climb. `probes` steps is a bounded search, never a loop to
    //    convergence (§161b's own alternation rule, applied to a much smaller problem).
    const h0 = heightAt(sub, line[i][0], line[i][1]);
    let placed = 0;
    for (let p = MEANDER.probes; p >= 1; p--) {
      const t = (p / MEANDER.probes) * lateral;
      const hx = line[i][0] + nx * t, hy = line[i][1] + ny * t;
      // Outside the frame there is no drawn ground to climb, so the tails keep their swing.
      const outside = hx < 0 || hy < 0 || hx > VIEW || hy > VIEW;
      if (outside || heightAt(sub, hx, hy) <= h0 + MEANDER.valleyBand) { placed = t; break; }
    }
    if (placed !== lateral) refused++;
    out.push([line[i][0] + nx * placed, line[i][1] + ny * placed]);
  }
  out.refusedStations = refused;
  out.workedReach = landing ? { ...landing, floor: MEANDER.workedFloor, seat: opts.worked } : null;
  // ── 5 · One smoothing pass, HERE and only here. The caller must not smooth again: two
  //    passes over a 9-unit pitch quadruple the point count for a curve the eye already
  //    reads as smooth.
  return chaikinOpen(out, 1);
}

/**
 * §42/§43 VALUES for the meander, PROPOSED WITH RATIONALE (⚠ UNSOAKED; ride the signature):
 *  - `step` 9 view units — just under one substrate cell (10.4), so the resample can express
 *    a curve the flow lattice cannot, without inventing detail below the ground's own grid.
 *  - `widthsPerWave` 11 — meander wavelength runs about 10–14 channel widths in the field
 *    literature; 11 sits mid-band.
 *  - `amplitudeOfWave` 0.19 — amplitude about a fifth of wavelength, the low end of the
 *    observed range, chosen because this river must still read as the town's river rather
 *    than as an ox-bow display.
 *  - `valleyBand` 0.020 of normalized height — the flat a channel genuinely commands.
 *  - `secondRatio`/`secondAmp` — the second harmonic that keeps the train from repeating.
 *  - `window` 3 — the tangent smoothing half-window, three samples ≈ 27 units.
 */
export const MEANDER = Object.freeze({
  step: 9,
  window: 3,
  widthsPerWave: 11,
  amplitudeOfWave: 0.19,
  secondRatio: 0.61,
  secondAmp: 0.38,
  modFloor: 0.45,
  valleyBand: 0.020,
  probes: 4,
  // §5 W1 exit 6 · the worked reach. `workedFloor` 0.14 rather than 0 because a revetted
  // channel still bends — a leat and a mill pond are not a canal. `workedReach` 1.15 of the
  // built radius: the reach a town works runs past its last house (the mill is upstream).
  // ⚠ UNSOAKED.
  workedFloor: 0.14,
  workedReach: 1.15,
});

/**
 * The worked-reach attenuation, smoothstepped: 1 on a wild reach, `MEANDER.workedFloor` at
 * the LANDING — the channel point nearest the settlement's seat.
 * ⚠ KEYED ON THE LANDING AND NOT ON THE SEAT, for the reason `relief.waterfrontDamping`
 * records with its measurement: a town's centre is inland of its own water, so a radius drawn
 * from the centre arrives at the channel already spent.
 */
function workDamp(landing, x, y) {
  if (!landing) return 1;
  const dx = x - landing.x, dy = y - landing.y;
  const t = Math.sqrt(dx * dx + dy * dy) / landing.reach;
  if (t >= 1) return 1;
  const sm = t * t * (3 - 2 * t);
  return MEANDER.workedFloor + (1 - MEANDER.workedFloor) * sm;
}

/** The LANDING: the point of the channel nearest the settlement's seat, with its reach. */
function landingOf(worked, line) {
  if (!worked || !(worked.r > 0) || !line || !line.length) return null;
  let lx = line[0][0], ly = line[0][1], best = Infinity;
  for (const p of line) {
    const dx = p[0] - worked.x, dy = p[1] - worked.y;
    const d = dx * dx + dy * dy;
    if (d < best) { best = d; lx = p[0]; ly = p[1]; }
  }
  return { x: lx, y: ly, reach: worked.r * MEANDER.workedReach, offSeat: Math.sqrt(best) };
}

/** Resample an open polyline to a uniform pitch. */
export function resamplePolyline(pts, pitch) {
  /** @type {Array<[number,number]>} */ const out = [[pts[0][0], pts[0][1]]];
  let carry = 0;
  for (let i = 1; i < pts.length; i++) {
    const ax = pts[i - 1][0], ay = pts[i - 1][1];
    const dx = pts[i][0] - ax, dy = pts[i][1] - ay;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 1e-9) continue;
    let d = pitch - carry;
    while (d <= len) {
      out.push([ax + (dx * d) / len, ay + (dy * d) / len]);
      d += pitch;
    }
    carry = len - (d - pitch);
  }
  const last = pts[pts.length - 1];
  const tail = out[out.length - 1];
  if (Math.abs(tail[0] - last[0]) > 1e-6 || Math.abs(tail[1] - last[1]) > 1e-6) out.push([last[0], last[1]]);
  return out;
}

/** Chaikin corner-cutting on an OPEN polyline, endpoints preserved. */
function chaikinOpen(pts, passes) {
  let cur = pts;
  for (let p = 0; p < passes; p++) {
    /** @type {Array<[number,number]>} */ const next = [[cur[0][0], cur[0][1]]];
    for (let i = 0; i < cur.length - 1; i++) {
      const a = cur[i], b = cur[i + 1];
      next.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25]);
      next.push([a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
    }
    next.push([cur[cur.length - 1][0], cur[cur.length - 1][1]]);
    cur = next;
  }
  return cur;
}
