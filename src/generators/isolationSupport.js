/**
 * isolationSupport.js — explainable support model for isolated settlements.
 *
 * "Isolated" means no dependable regional road, river, or port. It does not
 * mean that every settlement above village size must own a teleportation
 * circle. A viable isolated place can instead rest on several bounded supports:
 * a local foodshed, an agricultural hinterland, stored reserves, seasonal pack
 * access, or institutional patronage. Magical transit is the last substitution,
 * used only when mundane support leaves a real capacity gap and world law
 * permits it.
 *
 * The model is intentionally legible rather than pseudo-precise. Every point is
 * accompanied by evidence and the resulting receipt is persisted on the
 * settlement. It consumes no RNG.
 */

import {
  nativeSemanticDepletedResourceKeys,
  nativeSemanticName,
  nativeSemanticResourceKeys,
} from '../domain/content/customContentSemanticAuthority.js';
import { foodLandOf } from './foodGenerator.js';

const REQUIRED_CAPACITY = Object.freeze({
  thorp: 22,
  hamlet: 28,
  village: 38,
  town: 52,
  city: 70,
  metropolis: 88,
});

/** The food resources whose count is evidence of a hinterland (three or more); how much the land grows
 *  is the food writer's figure (foodGenerator.js :: foodLandOf), not a score per resource (FIX-FOOD-ISOLATION second seat). */
const FOOD_RESOURCES = Object.freeze([
  'grain_fields', 'fertile_floodplain', 'grazing_land', 'fishing_grounds', 'river_fish', 'hunting_grounds',
  'foraging_areas', 'camel_herds', 'alpine_pasture', 'date_palms', 'marshlands',
]);

const RESERVE_INSTITUTION = /\bgranary|warehouse|storehouse|root cellar|silo|cistern|cold storage|preserv/i;
const SEASONAL_ACCESS_INSTITUTION = /\bcaravan|pack train|stable|waystation|traveler|traveller|ferry|road warden|guide\b/i;
const PATRONAGE_INSTITUTION = /\bmanor|royal seat|lord'?s|palace|monastery|abbey|fortress|citadel|military order\b/i;
/** The receipt's paths that carry food in from outside the place's own fields (FIX-FOOD-ISOLATION). */
const FOOD_IMPORT_PATH_TYPES = Object.freeze(['hinterland', 'seasonal_access', 'patronage', 'magical_transit']);
const MAGICAL_TRANSIT_INSTITUTION = /\bteleportation circle|airship docking|planar (?:gate|market|trader|embassy)\b/i;

/**
 * @typedef {{
 *   type: 'local_foodshed'|'hinterland'|'reserves'|'seasonal_access'|'patronage'|'magical_transit',
 *   capacity: number,
 *   stability: 'durable'|'seasonal'|'conditional'|'fragile',
 *   evidence: string[],
 * }} IsolationSupportPath
 */

/**
 * @param {Array<{name?:string}>} institutions
 * @returns {string[]}
 */
function institutionNames(institutions) {
  return (institutions || [])
    .map(institution => nativeSemanticName(institution))
    .filter(Boolean);
}

/**
 * @param {string} tier
 * @param {number} capacity
 * @param {boolean} hasMagicalTransit
 */
function statusFor(tier, capacity, hasMagicalTransit) {
  const required = REQUIRED_CAPACITY[tier] ?? REQUIRED_CAPACITY.village;
  if (capacity >= required + 15) {
    return hasMagicalTransit ? 'magic_supported' : 'resilient';
  }
  if (capacity >= required) {
    return hasMagicalTransit ? 'magic_dependent' : 'viable';
  }
  if (capacity >= required - 15) return 'precarious';
  return 'untenable';
}

/**
 * Derive one immutable support receipt. The caller may invoke it again after
 * adding magical infrastructure; the same evidence then yields the updated
 * status without a parallel rule.
 *
 * @param {{
 *   tier:string,
 *   tradeRoute:string,
 *   institutions:Array<{name?:string}>,
 *   config:Record<string, any>,
 * }} input
 */
export function deriveIsolationSupport(input) {
  const tier = input.tier || 'village';
  const tradeRoute = input.tradeRoute || input.config?.tradeRouteAccess || 'road';
  const requiredCapacity = REQUIRED_CAPACITY[tier] ?? REQUIRED_CAPACITY.village;
  if (tradeRoute !== 'isolated') {
    return Object.freeze({
      version: 1,
      applicable: false,
      tier,
      requiredCapacity,
      capacity: requiredCapacity,
      deficit: 0,
      status: 'connected',
      paths: Object.freeze([]),
      magicDependent: false,
    });
  }

  const names = institutionNames(input.institutions);
  const availableResources = nativeSemanticResourceKeys(input.config);
  const depleted = new Set(nativeSemanticDepletedResourceKeys(input.config));
  const productiveFoodResources = availableResources
    .filter(resource => FOOD_RESOURCES.includes(resource) && !depleted.has(resource));

  /** @type {IsolationSupportPath[]} */
  const paths = [];
  // ⛔ ONE SOURCE FOR HOW MUCH THE LAND GROWS (FIX-FOOD-ISOLATION second seat, the chair's ruling,
  // 2026-11-07). The local foodshed is the land's ordinary harvest as the food writer computes it
  // (foodGenerator.js :: foodLandOf — terrain, food sources, resources, custom producers; no stress, an
  // average year), as a share of the capacity a place this size needs. It scored named resources and
  // food institutions from a table of its own, and an isolated town on plains read 6/52 here while the
  // writer grew 99% of its need. A town that grows its need is not untenable on food; a town scored
  // low here does not grow nine-tenths of its need.
  const land = foodLandOf(tier, input.institutions, input.config || {}, tradeRoute);
  const localFoodshedCapacity = Math.round(land.grownShareOfNeed * requiredCapacity);
  if (localFoodshedCapacity > 0) {
    paths.push({
      type: 'local_foodshed',
      capacity: localFoodshedCapacity,
      stability: 'durable',
      evidence: [
        `land:${land.terrain}`,
        ...land.foodSources.map(source => `source:${source}`),
        ...(land.customFoodImpact.producers > 0 ? [`custom-producers:${land.customFoodImpact.producers}`] : []),
        `grown:${Math.round(land.grownShareOfNeed * 100)}% of need`,
      ],
    });
  }

  const hinterlandEvidence = names.filter(name => (
    /\bfarmland|grain|field|orchard|pasture|grazing|herd\b/i.test(name)
  ));
  // The hinterland's capacity is the share of need the countryside around a place this size grows and
  // carts in (foodBalance.js :: hinterlandShareOf, the writer's own table): none for a hamlet, half for a
  // metropolis. The evidence decides whether that countryside is there for an isolated place.
  const hinterlandCapacity = Math.round(land.hinterlandShare * requiredCapacity);
  if (hinterlandCapacity > 0 && (hinterlandEvidence.length >= 2 || productiveFoodResources.length >= 3)) {
    paths.push({
      type: 'hinterland',
      capacity: hinterlandCapacity,
      stability: 'durable',
      evidence: [
        ...hinterlandEvidence.slice(0, 4).map(name => `institution:${name}`),
        ...(hinterlandEvidence.length >= 2 ? [] : productiveFoodResources.map(resource => `resource:${resource}`)),
        `share:${Math.round(land.hinterlandShare * 100)}% of need`,
      ],
    });
  }

  const reserveEvidence = names.filter(name => RESERVE_INSTITUTION.test(name));
  if (reserveEvidence.length) {
    paths.push({
      type: 'reserves',
      capacity: Math.min(18, reserveEvidence.length * 6),
      stability: 'conditional',
      evidence: reserveEvidence.slice(0, 4).map(name => `institution:${name}`),
    });
  }

  const seasonalEvidence = names.filter(name => SEASONAL_ACCESS_INSTITUTION.test(name));
  // Even a place categorized as isolated has paths used by residents; what it
  // lacks is a dependable bulk-trade route. The small baseline acknowledges
  // irregular pack access without pretending it can feed a city.
  paths.push({
    type: 'seasonal_access',
    capacity: Math.min(14, 4 + seasonalEvidence.length * 4),
    stability: 'seasonal',
    evidence: seasonalEvidence.length
      ? seasonalEvidence.slice(0, 3).map(name => `institution:${name}`)
      : ['inferred:local tracks only'],
  });

  const patronageEvidence = names.filter(name => PATRONAGE_INSTITUTION.test(name));
  if (patronageEvidence.length) {
    paths.push({
      type: 'patronage',
      capacity: Math.min(14, patronageEvidence.length * 5),
      stability: 'conditional',
      evidence: patronageEvidence.slice(0, 3).map(name => `institution:${name}`),
    });
  }

  const magicalEvidence = names.filter(name => MAGICAL_TRANSIT_INSTITUTION.test(name));
  const magicFunctions = input.config?.magicExists !== false
    && Number(input.config?.priorityMagic ?? 50) >= 66;
  if (magicalEvidence.length && magicFunctions) {
    // This is settlement-scale infrastructure, not one fixed wagon-equivalent.
    // Credit it only after every mundane path has been counted, then scale its
    // supported throughput to the remaining demonstrated gap. A city with a
    // strong foodshed therefore leans on less magical capacity than an otherwise
    // identical city with none; either way, a substitution the generator adds
    // is an actual substitution rather than decorative infrastructure that
    // leaves random output failing its own support contract.
    const mundaneCapacity = paths.reduce(
      (sum, path) => sum + path.capacity,
      0,
    );
    const remainingGap = Math.max(0, requiredCapacity - mundaneCapacity);
    paths.push({
      type: 'magical_transit',
      capacity: Math.max(42, remainingGap),
      stability: 'fragile',
      evidence: magicalEvidence.slice(0, 3).map(name => `institution:${name}`),
    });
  }

  const capacity = Math.min(
    120,
    paths.reduce((sum, path) => sum + path.capacity, 0),
  );
  const magicDependent = paths.some(path => path.type === 'magical_transit')
    && capacity - (paths.find(path => path.type === 'magical_transit')?.capacity || 0) < requiredCapacity;

  return Object.freeze({
    version: 1,
    applicable: true,
    tier,
    requiredCapacity,
    capacity,
    deficit: Math.max(0, requiredCapacity - capacity),
    status: statusFor(tier, capacity, magicDependent),
    paths: Object.freeze(paths.map(path => Object.freeze({
      ...path,
      evidence: Object.freeze([...path.evidence]),
    }))),
    magicDependent,
  });
}

/**
 * ⛔ ONE SOURCE FOR AN ISOLATED PLACE'S SUPPLY (FIX-FOOD-ISOLATION, the chair's ruling, 2026-11-07).
 * The share of its daily need (0..1) that can reach an isolated settlement from outside its own
 * fields, read from its support receipt: the capacity of the paths that carry food in from outside
 * (the hinterland's carts, seasonal pack access, patronage, magical transit last) over the capacity
 * a place this size needs. The local foodshed is the harvest the food writer grows itself and the
 * reserves are its stores, so neither is counted. The food writer (foodGenerator.js ::
 * generateFoodSecurity) bounds its ordinary supply by it: an untenable town's imports are the
 * trickle this allows, and its food band follows the arithmetic. The receipt's paths, each with its
 * capacity and evidence, are the why; no figure is persisted beside them. Null where the receipt
 * does not apply (a connected route is bounded by its route, not by this receipt).
 *
 * @param {ReturnType<typeof deriveIsolationSupport>|null|undefined} support
 * @returns {number|null}
 */
export function isolationFoodImportShareOf(support) {
  if (support?.applicable !== true || !(support.requiredCapacity > 0)) return null;
  const carried = (support.paths || [])
    .filter(path => FOOD_IMPORT_PATH_TYPES.includes(path.type))
    .reduce((sum, path) => sum + path.capacity, 0);
  return Math.min(1, carried / support.requiredCapacity);
}

/**
 * True only when mundane support is insufficient and functional, substantial
 * magic can plausibly close the gap.
 *
 * @param {ReturnType<typeof deriveIsolationSupport>} support
 * @param {Record<string, any>} config
 */
export function shouldAddMagicalSubstitution(support, config) {
  return support.applicable === true
    && support.deficit > 0
    && config?.magicExists !== false
    && Number(config?.priorityMagic ?? 50) >= 66;
}
