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

const REQUIRED_CAPACITY = Object.freeze({
  thorp: 22,
  hamlet: 28,
  village: 38,
  town: 52,
  city: 70,
  metropolis: 88,
});

const FOOD_RESOURCE_CAPACITY = Object.freeze({
  grain_fields: 14,
  fertile_floodplain: 14,
  grazing_land: 10,
  fishing_grounds: 10,
  river_fish: 10,
  hunting_grounds: 8,
  foraging_areas: 6,
  camel_herds: 10,
  alpine_pasture: 8,
  date_palms: 8,
  marshlands: 5,
});

const FOOD_INSTITUTION = /\bfarm|farmland|grain|field|orchard|fish|hunting|pasture|grazing|herd|mill|bakery|garden|food\b/i;
const RESERVE_INSTITUTION = /\bgranary|warehouse|storehouse|root cellar|silo|cistern|cold storage|preserv/i;
const SEASONAL_ACCESS_INSTITUTION = /\bcaravan|pack train|stable|waystation|traveler|traveller|ferry|road warden|guide\b/i;
const PATRONAGE_INSTITUTION = /\bmanor|royal seat|lord'?s|palace|monastery|abbey|fortress|citadel|military order\b/i;
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
    .filter(resource => FOOD_RESOURCE_CAPACITY[resource] && !depleted.has(resource));

  /** @type {IsolationSupportPath[]} */
  const paths = [];
  const resourceCapacity = Math.min(
    38,
    productiveFoodResources.reduce(
      (sum, resource) => sum + FOOD_RESOURCE_CAPACITY[resource],
      0,
    ),
  );
  const foodInstitutions = names.filter(name => FOOD_INSTITUTION.test(name));
  const foodInstitutionCapacity = Math.min(24, foodInstitutions.length * 6);
  const localFoodshedCapacity = Math.min(48, resourceCapacity + foodInstitutionCapacity);
  if (localFoodshedCapacity > 0) {
    paths.push({
      type: 'local_foodshed',
      capacity: localFoodshedCapacity,
      stability: 'durable',
      evidence: [
        ...productiveFoodResources.map(resource => `resource:${resource}`),
        ...foodInstitutions.slice(0, 4).map(name => `institution:${name}`),
      ],
    });
  }

  const hinterlandEvidence = names.filter(name => (
    /\bfarmland|grain|field|orchard|pasture|grazing|herd\b/i.test(name)
  ));
  if (hinterlandEvidence.length >= 2 || productiveFoodResources.length >= 3) {
    paths.push({
      type: 'hinterland',
      capacity: Math.min(18, 8 + hinterlandEvidence.length * 3),
      stability: 'durable',
      evidence: hinterlandEvidence.slice(0, 4).map(name => `institution:${name}`),
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
