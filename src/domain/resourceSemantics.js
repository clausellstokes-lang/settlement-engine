/**
 * Canonical native-resource semantics.
 *
 * RESOURCE_DATA describes presentation and economic outputs. It does not answer
 * the state questions that generation and simulation need: whether a resource
 * is renewable, finite, positional, built infrastructure, or magical; whether a
 * settlement-size depletion roll may exhaust it; and what losing access means
 * for trade. Keeping those answers implicit in labels produced contradictions
 * such as a mountain pass "depleting" and a worked-out quarry still producing
 * stone locally.
 *
 * This table is deliberately exhaustive rather than inferred. Adding a native
 * resource therefore requires an explicit design decision, pinned by
 * resourceTaxonomyClassification.test.js, instead of inheriting accidental
 * semantics from a word in its description.
 */

import { RESOURCE_DATA } from '../data/resourceData.js';
import {
  nativeSemanticDepletedResourceKeys,
  nativeSemanticResourceKeys,
} from './content/customContentSemanticAuthority.js';

const RESOURCE_CATALOG = /** @type {Record<string, {label: string}>} */ (
  RESOURCE_DATA
);

/**
 * @typedef {'renewable'|'exhaustible'|'positional'|'infrastructure'|'magical'} ResourceType
 * @typedef {'available'|'depleted'|'absent'} ResourceCondition
 * @typedef {'natural'|'manual'|'requires_high_magic'|'not_applicable'} ResourceRecoveryMode
 *
 * @typedef {object} ResourceSemantics
 * @property {ResourceType} type
 * @property {boolean} randomDepletionEligible
 * @property {ResourceRecoveryMode} recoveryMode
 * @property {string} depletedDescription
 * @property {string|null} shortageImport
 */

/** @type {Readonly<Record<string, Readonly<ResourceSemantics>>>} */
export const RESOURCE_SEMANTICS = Object.freeze({
  fishing_grounds: Object.freeze({
    type: 'renewable',
    randomDepletionEligible: true,
    recoveryMode: 'natural',
    depletedDescription: 'The fishing grounds are over-fished and no longer sustain a commercial catch.',
    shortageImport: 'Salted fish (local fishing grounds exhausted)',
  }),
  salt_flats: Object.freeze({
    type: 'exhaustible',
    randomDepletionEligible: true,
    recoveryMode: 'manual',
    depletedDescription: 'The accessible salt beds are exhausted or no longer workable.',
    shortageImport: 'Salt (local salt beds exhausted)',
  }),
  deep_harbour: Object.freeze({
    type: 'positional',
    randomDepletionEligible: false,
    recoveryMode: 'not_applicable',
    depletedDescription: 'Access to the deep harbour is obstructed or unsafe.',
    shortageImport: 'Deepwater harbour access (local anchorage unavailable)',
  }),
  shipbuilding_timber: Object.freeze({
    type: 'renewable',
    randomDepletionEligible: true,
    recoveryMode: 'natural',
    depletedDescription: 'The coastal stands have been cleared faster than they can regrow.',
    shortageImport: 'Shipbuilding timber (coastal stands cleared)',
  }),
  river_mills: Object.freeze({
    type: 'infrastructure',
    randomDepletionEligible: false,
    recoveryMode: 'not_applicable',
    depletedDescription: 'The mill sites are damaged, obstructed, or otherwise unavailable.',
    shortageImport: 'Milling capacity (local mill sites unavailable)',
  }),
  river_clay: Object.freeze({
    type: 'exhaustible',
    randomDepletionEligible: true,
    recoveryMode: 'manual',
    depletedDescription: 'The workable river-clay beds have been exhausted.',
    shortageImport: 'Clay and ceramics materials (local deposits exhausted)',
  }),
  fertile_floodplain: Object.freeze({
    type: 'renewable',
    randomDepletionEligible: true,
    recoveryMode: 'natural',
    depletedDescription: 'The floodplain is exhausted, damaged, or temporarily unproductive.',
    shortageImport: 'Grain and produce (local floodplain unproductive)',
  }),
  river_fish: Object.freeze({
    type: 'renewable',
    randomDepletionEligible: true,
    recoveryMode: 'natural',
    depletedDescription: 'The river fishery has been over-fished and its commercial catch has collapsed.',
    shortageImport: 'Salted fish (local river fishery exhausted)',
  }),
  hunting_grounds: Object.freeze({
    type: 'renewable',
    randomDepletionEligible: true,
    recoveryMode: 'natural',
    depletedDescription: 'Game populations have fallen below sustainable hunting levels.',
    shortageImport: 'Game and hides (local hunting grounds exhausted)',
  }),
  managed_forest: Object.freeze({
    type: 'renewable',
    randomDepletionEligible: true,
    recoveryMode: 'natural',
    depletedDescription: 'The managed woodland has been cut faster than it can regrow.',
    shortageImport: 'Timber (local forests cleared)',
  }),
  foraging_areas: Object.freeze({
    type: 'renewable',
    randomDepletionEligible: true,
    recoveryMode: 'natural',
    depletedDescription: 'Foraging pressure has stripped the accessible wild harvest.',
    shortageImport: 'Herbs and forage (local gathering areas exhausted)',
  }),
  ancient_grove: Object.freeze({
    type: 'renewable',
    randomDepletionEligible: true,
    recoveryMode: 'natural',
    depletedDescription: 'The grove has been damaged or over-harvested beyond present use.',
    shortageImport: 'Ritual wood and herbs (ancient grove damaged)',
  }),
  grain_fields: Object.freeze({
    type: 'renewable',
    randomDepletionEligible: true,
    recoveryMode: 'natural',
    depletedDescription: 'The fields are exhausted or failing and no longer yield a dependable surplus.',
    shortageImport: 'Bulk grain (local fields depleted)',
  }),
  grazing_land: Object.freeze({
    type: 'renewable',
    randomDepletionEligible: true,
    recoveryMode: 'natural',
    depletedDescription: 'The pasture is overgrazed and cannot support its former herds.',
    shortageImport: 'Livestock and dairy (local pastures depleted)',
  }),
  crossroads_position: Object.freeze({
    type: 'positional',
    randomDepletionEligible: false,
    recoveryMode: 'not_applicable',
    depletedDescription: 'The crossroads is blocked, bypassed, or no longer commercially usable.',
    shortageImport: 'Overland trade access (local crossroads unavailable)',
  }),
  iron_deposits: Object.freeze({
    type: 'exhaustible',
    randomDepletionEligible: true,
    recoveryMode: 'manual',
    depletedDescription: 'The accessible iron seams are exhausted.',
    shortageImport: 'Iron ore (local mines exhausted)',
  }),
  stone_quarry: Object.freeze({
    type: 'exhaustible',
    randomDepletionEligible: true,
    recoveryMode: 'manual',
    depletedDescription: 'The workable quarry face is exhausted.',
    shortageImport: 'Dressed stone (local quarry depleted)',
  }),
  precious_metals: Object.freeze({
    type: 'exhaustible',
    randomDepletionEligible: true,
    recoveryMode: 'manual',
    depletedDescription: 'The accessible precious-metal veins are exhausted.',
    shortageImport: 'Precious metals (local veins exhausted)',
  }),
  gemstone_deposits: Object.freeze({
    type: 'exhaustible',
    randomDepletionEligible: true,
    recoveryMode: 'manual',
    depletedDescription: 'The accessible gemstone-bearing rock is exhausted.',
    shortageImport: 'Gemstones (local deposits exhausted)',
  }),
  coal_deposits: Object.freeze({
    type: 'exhaustible',
    randomDepletionEligible: true,
    recoveryMode: 'manual',
    depletedDescription: 'The accessible coal or peat seams are exhausted.',
    shortageImport: 'Coal and fuel (local seams exhausted)',
  }),
  ancient_ruins: Object.freeze({
    type: 'exhaustible',
    randomDepletionEligible: true,
    recoveryMode: 'manual',
    depletedDescription: 'The ruins have been picked clean of recoverable material.',
    shortageImport: 'Recovered artefacts (local ruins exhausted)',
  }),
  hot_springs: Object.freeze({
    type: 'positional',
    randomDepletionEligible: false,
    recoveryMode: 'not_applicable',
    depletedDescription: 'Access to the healing waters is obstructed or unsafe.',
    shortageImport: 'Healing waters (local springs unavailable)',
  }),
  magical_node: Object.freeze({
    type: 'magical',
    randomDepletionEligible: true,
    recoveryMode: 'requires_high_magic',
    depletedDescription: 'The ley node is magically exhausted or destabilized.',
    shortageImport: 'Arcane reagents and energy (local ley node exhausted)',
  }),
  defended_pass: Object.freeze({
    type: 'positional',
    randomDepletionEligible: false,
    recoveryMode: 'not_applicable',
    depletedDescription: 'The pass is blocked, bypassed, or no longer defensible.',
    shortageImport: 'Mountain-route access (local pass unavailable)',
  }),
  marshlands: Object.freeze({
    type: 'renewable',
    randomDepletionEligible: true,
    recoveryMode: 'natural',
    depletedDescription: 'The accessible wetland harvest has been stripped or damaged.',
    shortageImport: 'Reeds, peat, and marsh herbs (local wetlands exhausted)',
  }),
  oasis_water: Object.freeze({
    type: 'positional',
    randomDepletionEligible: false,
    recoveryMode: 'not_applicable',
    depletedDescription: 'Access to the oasis water source is interrupted or unsafe.',
    shortageImport: 'Fresh water (local oasis unavailable)',
  }),
  date_palms: Object.freeze({
    type: 'renewable',
    randomDepletionEligible: true,
    recoveryMode: 'natural',
    depletedDescription: 'The palm groves are damaged or no longer yielding a surplus.',
    shortageImport: 'Dates and desert produce (local orchards unproductive)',
  }),
  glass_sand: Object.freeze({
    type: 'exhaustible',
    randomDepletionEligible: true,
    recoveryMode: 'manual',
    depletedDescription: 'The accessible high-purity glass sand is exhausted.',
    shortageImport: 'Glass sand (local deposits exhausted)',
  }),
  desert_salt: Object.freeze({
    type: 'exhaustible',
    randomDepletionEligible: true,
    recoveryMode: 'manual',
    depletedDescription: 'The workable desert salt beds are exhausted.',
    shortageImport: 'Salt (local desert pans exhausted)',
  }),
  camel_herds: Object.freeze({
    type: 'renewable',
    randomDepletionEligible: true,
    recoveryMode: 'natural',
    depletedDescription: 'The camel herds have fallen below a sustainable breeding stock.',
    shortageImport: 'Camels and pack animals (local herds depleted)',
  }),
  alpine_pasture: Object.freeze({
    type: 'renewable',
    randomDepletionEligible: true,
    recoveryMode: 'natural',
    depletedDescription: 'The alpine pasture is overgrazed or temporarily unproductive.',
    shortageImport: 'Wool, dairy, and livestock (local alpine pasture depleted)',
  }),
  mountain_timber: Object.freeze({
    type: 'renewable',
    randomDepletionEligible: true,
    recoveryMode: 'natural',
    depletedDescription: 'The accessible mountain stands have been cleared faster than they can regrow.',
    shortageImport: 'Timber (mountain stands cleared)',
  }),
  hot_springs_mineral: Object.freeze({
    type: 'positional',
    randomDepletionEligible: false,
    recoveryMode: 'not_applicable',
    depletedDescription: 'Access to the mineral springs is obstructed or unsafe.',
    shortageImport: 'Mineral salts and medicinal waters (local springs unavailable)',
  }),
});

const LABEL_ALIASES = Object.freeze({
  'foraging areas': 'foraging_areas',
  'grain fields': 'grain_fields',
  'grazing land': 'grazing_land',
  'hot springs': 'hot_springs',
  'river fish': 'river_fish',
});

/** @param {unknown} value */
const normalizeResourceLabel = value => (
  String(value || '').trim().toLowerCase()
);

const RESOURCE_KEY_BY_LABEL = (() => {
  const entries = Object.entries(RESOURCE_DATA).flatMap(([key, spec]) => [
    [normalizeResourceLabel(key), key],
    [normalizeResourceLabel(spec.label), key],
  ]);
  return Object.freeze(Object.fromEntries([
    ...entries,
    ...Object.entries(LABEL_ALIASES),
  ]));
})();

/**
 * Resolve catalog keys and reviewed display aliases without fuzzy matching.
 *
 * A fuzzy "best word overlap" made the result depend on RESOURCE_DATA order:
 * "Coastal Timber" could resolve to managed_forest and "Mountain Pass" could
 * resolve to an unrelated resource sharing one common word. Returning null for
 * unknown prose is safer than silently granting native mechanics.
 *
 * @param {unknown} value
 * @returns {string|null}
 */
export function resourceKeyForLabel(value) {
  return RESOURCE_KEY_BY_LABEL[normalizeResourceLabel(value)] || null;
}

/**
 * @param {unknown} resource
 * @returns {Readonly<ResourceSemantics>|null}
 */
export function resourceSemanticsFor(resource) {
  const key = resourceKeyForLabel(resource);
  return key ? RESOURCE_SEMANTICS[key] || null : null;
}

/** @param {unknown} resource */
export function isRandomlyDepletableResource(resource) {
  return resourceSemanticsFor(resource)?.randomDepletionEligible === true;
}

/** @param {unknown} resource */
export function resourceShortageImport(resource) {
  return resourceSemanticsFor(resource)?.shortageImport || null;
}

/**
 * Return the available native subset of a settlement's canonical resource
 * roster. The native-depletion sidecar is authoritative when present; legacy
 * manual configurations fall back to their state map.
 *
 * @param {Record<string, unknown> | null | undefined} config
 * @returns {string[]}
 */
export function availableNativeResourceKeys(config) {
  const keys = nativeSemanticResourceKeys(config);
  const depleted = new Set(nativeSemanticDepletedResourceKeys(config));
  if (!Array.isArray(config?.nearbyResourcesNativeDepleted)) {
    const state = config?.nearbyResourcesState;
    if (state && typeof state === 'object' && !Array.isArray(state)) {
      for (const key of keys) {
        if (/** @type {Record<string, unknown>} */ (state)[key] === 'depleted') {
          depleted.add(key);
        }
      }
    }
  }
  return keys.filter(key => !depleted.has(key));
}

/**
 * Derive condition records from the roster plus its depletion sidecar. This is
 * a read model, not another persisted state store: every downstream consumer
 * receives the same condition without creating a second source of truth.
 *
 * @param {Record<string, unknown> | null | undefined} config
 * @returns {Array<{
 *   key: string,
 *   label: string,
 *   type: ResourceType,
 *   condition: ResourceCondition,
 *   randomDepletionEligible: boolean,
 *   recoveryMode: ResourceRecoveryMode,
 *   conditionDescription: string|null
 * }>}
 */
export function nativeResourceConditionRecords(config) {
  const keys = nativeSemanticResourceKeys(config);
  const available = new Set(availableNativeResourceKeys(config));
  return keys
    .filter(key => RESOURCE_CATALOG[key] && RESOURCE_SEMANTICS[key])
    .map((key) => {
      const semantics = RESOURCE_SEMANTICS[key];
      const condition = available.has(key) ? 'available' : 'depleted';
      return {
        key,
        label: RESOURCE_CATALOG[key].label,
        type: semantics.type,
        condition,
        randomDepletionEligible: semantics.randomDepletionEligible,
        recoveryMode: semantics.recoveryMode,
        conditionDescription: condition === 'depleted'
          ? semantics.depletedDescription
          : null,
      };
    });
}
