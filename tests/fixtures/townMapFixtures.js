/**
 * townMapFixtures.js — deterministic synthetic SETTLEMENT corpus for the
 * town-map model golden + unit suites.
 *
 * Same philosophy as spatialPackFixtures: everything is index/seed-derived (NO
 * Math.random), so each fixture is a pure function of its parameters — the
 * determinism the town-map golden demands. The fixtures carry ONLY the fields
 * buildTownMapModel actually reads: _seed/id/name/tier/population, config
 * (terrainType + tradeRouteAccess), spatialLayout.quarters, institutions (a mix
 * of catalogId + localUid identity anchors), defenseProfile (walls present or
 * absent), and minimal economicState/powerStructure.
 */

// Tier → a representative population inside its POPULATION_RANGES band.
const TIER_POP = Object.freeze({
  thorp: 40, hamlet: 220, village: 650, town: 2400, city: 12000, metropolis: 48000,
});

// Tier → default quarter count (quarter-less cases pass `quarters: []` explicitly).
const TIER_QUARTERS = Object.freeze({
  thorp: 2, hamlet: 3, village: 4, town: 6, city: 9, metropolis: 11,
});

// Tier → default institution count.
const TIER_INSTITUTIONS = Object.freeze({
  thorp: 2, hamlet: 4, village: 6, town: 10, city: 16, metropolis: 22,
});

/**
 * Eleven quarter templates whose name/desc/landmarks classify (via
 * districtProfile.inferCategory) into eleven distinct district categories, so
 * the corpus exercises the full category-affinity placement table.
 */
const QUARTER_POOL = Object.freeze([
  { name: 'Temple Ward', location: 'central', desc: 'shrines and cloisters', landmarks: ['Great Cathedral'] },
  { name: 'Market Row', location: 'center', desc: 'bazaar and exchange', landmarks: ['Grand Bazaar'] },
  { name: 'Garrison Quarter', location: 'north gate', desc: 'barracks and watch', landmarks: ['Barracks'] },
  { name: 'Forge District', location: 'east', desc: 'smiths and workshops', landmarks: ['Guild Forge'] },
  { name: 'Highmanor Hill', location: 'hilltop', desc: 'noble estates', landmarks: ['Manor House'] },
  { name: 'Council Green', location: 'center', desc: 'court and chancery', landmarks: ['Town Hall'] },
  { name: 'Arcane Enclave', location: 'west', desc: 'the mage college', landmarks: ['Conclave Tower'] },
  { name: 'Shadow Dens', location: 'riverside', desc: 'thieves and seedy taverns', landmarks: ['The Den'] },
  { name: 'Foreign Quarter', location: 'docks', desc: 'expatriate immigrant traders', landmarks: ['Consulate'] },
  { name: 'Tannery Flats', location: 'downwind edge', desc: 'tanneries and warehouses', landmarks: ['Warehouse Row'] },
  { name: 'Commoner Rows', location: 'outer', desc: 'tenement homestead district', landmarks: ['Well Square'] },
]);

// Institution priority categories to span (the priorityCategory enum, sans the
// duplicate 'religious' alias — 'religion' covers it).
const PRIORITY_CYCLE = Object.freeze([
  'economy', 'crafts', 'trade', 'military', 'government', 'noble', 'religion', 'magic', 'criminal',
]);

const INSTITUTION_TYPES = Object.freeze([
  'Guild', 'Company', 'Order', 'Hall', 'Lodge', 'Bank', 'Court', 'Chapter', 'Circle',
]);

/**
 * A pure, order-independent digit derived from a seed string — the char-code
 * sum. Used to rotate deterministic pools per config (no Math.random).
 * @param {string} seed
 * @returns {number}
 */
function seedDigit(seed) {
  let sum = 0;
  for (let i = 0; i < seed.length; i++) sum += seed.charCodeAt(i);
  return sum;
}

/**
 * @param {string} tier
 * @param {string} seed
 * @returns {Array<{ name: string, location: string, desc: string, landmarks: string[] }>}
 */
function defaultQuarters(tier, seed) {
  const count = Math.min(QUARTER_POOL.length, TIER_QUARTERS[tier] ?? 4);
  const offset = seedDigit(seed) % QUARTER_POOL.length;
  const out = [];
  for (let i = 0; i < count; i++) {
    const src = QUARTER_POOL[(offset + i) % QUARTER_POOL.length];
    out.push({ name: src.name, location: src.location, desc: src.desc, landmarks: [...src.landmarks] });
  }
  return out;
}

/**
 * @param {string} tier
 * @param {string} seed
 * @returns {Array<{ name: string, priorityCategory: string, catalogId?: string, localUid?: string, category?: string, tags?: string[] }>}
 */
function defaultInstitutions(tier, seed) {
  const count = TIER_INSTITUTIONS[tier] ?? 6;
  const offset = seedDigit(seed);
  const tierIndex = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'].indexOf(tier);
  const out = [];
  for (let k = 0; k < count; k++) {
    const cat = PRIORITY_CYCLE[(offset + k) % PRIORITY_CYCLE.length];
    const type = INSTITUTION_TYPES[(offset + k) % INSTITUTION_TYPES.length];
    const name = `${cat[0].toUpperCase()}${cat.slice(1)} ${type} ${k}`;
    // Every third institution is CUSTOM content (localUid anchor); the rest are
    // catalog entries (catalogId anchor) — exercises both anchor precedences.
    if (k % 3 === 0) {
      out.push({ name, priorityCategory: cat, localUid: `uid-${seed}-${k}` });
    } else {
      out.push({ name, priorityCategory: cat, catalogId: `cat.${cat}.${k}` });
    }
  }
  // City+ settlements gain an aggregate lodging institution — the owner's
  // lodging-district-fill case (kind:'fill' at city/metropolis).
  if (tierIndex >= 4) {
    out.push({ name: 'Lodging District Housing', priorityCategory: 'economy', catalogId: 'cat.lodging.mass', category: 'residential', tags: ['lodging'] });
  }
  return out;
}

/**
 * Build a minimal synthetic settlement carrying only what buildTownMapModel
 * reads. Deterministic in its parameters.
 * @param {{ tier?: string, terrain?: string|null, walls?: boolean, water?: boolean,
 *   seed?: string, quarters?: Array<object>, institutions?: Array<object> }} [opts]
 * @returns {object}
 */
export function makeTownFixture({
  tier = 'town', terrain = 'plains', walls = false, water = false,
  seed = 'town-fixture', quarters, institutions,
} = {}) {
  const tradeRouteAccess = water
    ? (terrain === 'riverside' ? 'river' : terrain === 'coastal' ? 'port' : 'coastal')
    : (terrain === 'mountain' ? 'isolated' : 'road');
  const q = quarters !== undefined ? quarters : defaultQuarters(tier, seed);
  const insts = institutions !== undefined ? institutions : defaultInstitutions(tier, seed);
  return {
    _seed: seed,
    id: `fixture-${seed}`,
    name: `Fixture ${seed}`,
    tier,
    population: TIER_POP[tier] ?? 2400,
    config: { terrainType: terrain, tradeRouteAccess },
    spatialLayout: { quarters: q },
    institutions: insts,
    defenseProfile: walls ? { hasWalls: true } : {},
    economicState: { prosperity: 'Modest' },
    powerStructure: { governance: 'council' },
  };
}

/**
 * ~18 configs spanning tier × terrain × walls × water. Every tier
 * (thorp..metropolis) appears ≥2×, every terrain (plains, hills, forest,
 * riverside, coastal, mountain, desert) ≥2×, both walls values ≥2×, both water
 * values ≥2×. Includes: two quarter-less small tiers (thorp/hamlet, zero
 * quarters ⇒ the hamlet-cluster floor), three metropolises with the full quarter
 * set + an aggregate lodging district, and localUid custom institutions
 * throughout (defaultInstitutions mixes them in).
 * @type {ReadonlyArray<{ tier: string, terrain: string, walls: boolean, water: boolean,
 *   seed: string, quarters?: Array<object> }>}
 */
const CONFIG_SPECS = Object.freeze([
  { tier: 'thorp', terrain: 'plains', walls: false, water: false, quarters: [] },
  { tier: 'thorp', terrain: 'hills', walls: false, water: false },
  { tier: 'hamlet', terrain: 'forest', walls: false, water: false, quarters: [] },
  { tier: 'hamlet', terrain: 'desert', walls: true, water: false },
  { tier: 'village', terrain: 'riverside', walls: false, water: true },
  { tier: 'village', terrain: 'coastal', walls: true, water: true },
  { tier: 'town', terrain: 'plains', walls: true, water: false },
  { tier: 'town', terrain: 'mountain', walls: false, water: false },
  { tier: 'town', terrain: 'hills', walls: true, water: true },
  { tier: 'city', terrain: 'forest', walls: true, water: false },
  { tier: 'city', terrain: 'coastal', walls: true, water: true },
  { tier: 'city', terrain: 'riverside', walls: false, water: true },
  { tier: 'metropolis', terrain: 'plains', walls: true, water: false },
  { tier: 'metropolis', terrain: 'desert', walls: true, water: false },
  { tier: 'metropolis', terrain: 'mountain', walls: true, water: false },
  { tier: 'village', terrain: 'desert', walls: false, water: false },
  { tier: 'city', terrain: 'hills', walls: true, water: false },
  { tier: 'town', terrain: 'forest', walls: false, water: true },
]);

/**
 * The frozen golden corpus — each spec realized into a settlement with a unique
 * seed (so per-config models hash distinctly).
 * @type {ReadonlyArray<{ spec: { tier: string, terrain: string, walls: boolean, water: boolean }, settlement: object }>}
 */
export const GOLDEN_CONFIGS = Object.freeze(CONFIG_SPECS.map((spec, i) => ({
  spec: { tier: spec.tier, terrain: spec.terrain, walls: spec.walls, water: spec.water },
  settlement: makeTownFixture({ ...spec, seed: `sm1-${i}` }),
})));

// ── TOWN LAYOUT v2 (#38) corpus ───────────────────────────────────────────────
// The v2 goldens EXTEND the v1 set (v1 stands untouched). The v2 corpus is the same
// tier×terrain×walls×water spread built under the v2 engine, PLUS two extensions the
// shared spread does not reach: a bastide-grid trigger (high-tier plains, NO walls, NO
// water — the one morphology the walled/watered v1 spread never hits) and a
// URBAN-FABRIC-LIT settlement (a populated `urbanFabric` mirror) so BOTH fabric
// branches — dark fallback (every shared config) and hasFabric (this one) — are pinned.

/** A compact urbanFabric MIRROR (fabricRead's read shape) for the lit golden case. */
export function makeFabricMirror() {
  return {
    drift: 0.72,
    stocks: { merchant: 0.9, criminal: 0.78, industrial: 0.6, religious: 0.45, civic: 0.3 },
    scars: [{ kind: 'fire', severity: 0.7, week: 12 }, { kind: 'siege', severity: 0.4, week: 30 }],
    rebirths: [{ classes: ['residential'], type: 'fire', week: 40 }],
  };
}

/** The v2-only extension configs (bastide-grid + fabric-lit). Each carries the v2
 *  mapEdits marker; the fabric one also carries the mirror on its settlement. */
export const V2_EXTRA_CONFIGS = Object.freeze([
  {
    spec: { tier: 'metropolis', terrain: 'plains', walls: false, water: false },
    mapEdits: { layoutLawVersion: 2 },
    settlement: makeTownFixture({ tier: 'metropolis', terrain: 'plains', walls: false, water: false, seed: 'v2-bastide' }),
  },
  {
    spec: { tier: 'city', terrain: 'hills', walls: true, water: false },
    mapEdits: { layoutLawVersion: 2 },
    settlement: { ...makeTownFixture({ tier: 'city', terrain: 'hills', walls: true, water: false, seed: 'v2-fabric' }), urbanFabric: makeFabricMirror() },
  },
]);

/**
 * The frozen v2 golden corpus: the shared spread under v2 + the two extensions. Each
 * entry carries the `mapEdits` the model is built with (the v2 marker), so the golden
 * test drives buildTownMapModel(settlement, mapEdits) exactly as a real v2 consumer does.
 * @type {ReadonlyArray<{ spec: { tier: string, terrain: string, walls: boolean, water: boolean }, mapEdits: object, settlement: object }>}
 */
export const V2_GOLDEN_CONFIGS = Object.freeze([
  ...GOLDEN_CONFIGS.map((c) => ({ spec: c.spec, mapEdits: { layoutLawVersion: 2 }, settlement: c.settlement })),
  ...V2_EXTRA_CONFIGS,
]);
