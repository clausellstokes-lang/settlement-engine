/**
 * domain/interior/interiorTemplates.js — THE KEYED SCALE template grammar (DOOR 3).
 *
 * A BOUNDED, DATA-ONLY grammar (THE WALL discipline — the same law the map-style
 * layer obeys): every interior is assembled from typed room/wing kinds and typed
 * furnishing kinds selected from the fixed vocabularies below. Data NEVER carries
 * free geometry — the renderer (interiorDraw.js) knows how to draw each kind; a
 * template only SELECTS a kind, a size weight, a band, and a bounded furnishing set.
 * Worst case an interior is plain; it can never be unsafe.
 *
 * THE FACET LAW (the counterpart criterion): a building's interior KIND is its
 * institution NATURE resolved through the ONE facet chokepoint (cohesionWeave.facetOf
 * — declared ?? inferred ?? kind-default). A declared facet makes a genre-blind custom
 * institution a full citizen of the grammar (it gets an interior for free); an absent
 * declaration falls to byte-identical keyword inference; an institution that infers
 * nothing gets the deterministic `generic` template. The institution FUNCTION facet
 * (heals / feeds / arms / judges …) selects a variant of the kind's room set.
 *
 * PURITY: pure, deterministic, table-only. No Date / Math.random / localeCompare
 * (pinned by the PURITY source-scan in tests/interior/interiorModel.test.js — the
 * townMap source-scan idiom, walking every file in this directory).
 */

import { facetOf } from '../spatial/cohesionWeave.js';
import { TIER_ORDER, popToTier } from '../../data/constants.js';

/** The eight interior KINDs — the seven institution natures plus the kind-default
 *  `generic` for an institution that declares/infers no nature. @type {ReadonlyArray<string>} */
export const INTERIOR_KINDS = Object.freeze([
  'faith', 'security', 'trade', 'craft', 'learning', 'vice', 'civic', 'generic',
]);

/** The typed ROOM kinds a template may name (THE WALL — the renderer tints/labels
 *  each; a room kind outside this set is a wall violation, pinned). @type {ReadonlyArray<string>} */
export const ROOM_KINDS = Object.freeze([
  'nave', 'sanctuary', 'vestry',
  'muster', 'armory', 'cells', 'quarters',
  'hall', 'counting', 'strongroom', 'stall',
  'workfloor', 'store', 'kiln',
  'reading', 'stacks', 'study',
  'common', 'kitchen', 'cellar', 'lodging',
  'chamber', 'records', 'dais',
  'main', 'back',
  'evidence',   // a REVEALED-corruption scandal room (public knowledge)
  'concealed',  // a COVERT-corruption hidden chamber (DM-only, scrubbed public)
]);

/** The typed FURNISHING kinds the renderer can draw from primitive ops (THE WALL).
 *  @type {ReadonlyArray<string>} */
export const FURNISHING_KINDS = Object.freeze([
  'table', 'bench', 'pew', 'altar', 'brazier', 'shelf', 'lectern', 'desk',
  'counter', 'strongbox', 'ledger', 'workbench', 'hearth', 'rack', 'crate',
  'barrel', 'bar', 'bed', 'bunk', 'dais', 'cell', 'cauldron',
]);

/**
 * @typedef {Object} RoomSpec
 * @property {string} kind          a ROOM_KINDS member
 * @property {number} weight        relative floor-area weight within its band (integer)
 * @property {'front'|'back'} band  front = entrance side (public), back = private/service
 * @property {number} minTierIndex  the room appears only at/above this tier (small towns collapse)
 * @property {ReadonlyArray<string>} furnish  bounded FURNISHING_KINDS this room may hold
 */
/**
 * @typedef {Object} TemplateSpec
 * @property {string} kind                       an INTERIOR_KINDS member
 * @property {ReadonlyArray<RoomSpec>} rooms     the ordered base room set
 * @property {number} widthRatio                 footprint width bias ×100 (envelope aspect)
 * @property {number} depthRatio                 footprint depth bias ×100
 * @property {number} baseCells                  base footprint size (cells) before tier/prosperity
 */

/** @param {string} kind @param {number} weight @param {'front'|'back'} band
 *  @param {number} minTierIndex @param {ReadonlyArray<string>} furnish @returns {RoomSpec} */
function room(kind, weight, band, minTierIndex, furnish) {
  return Object.freeze({ kind, weight, band, minTierIndex, furnish: Object.freeze([...furnish]) });
}

/**
 * THE TEMPLATE TABLE (data-only). One entry per interior KIND. Room `minTierIndex`
 * uses TIER_ORDER indices, so a hamlet (index 0) tavern collapses to its common room
 * + cellar while a city (index ≥ 4) guildhall unfolds its full set — the same table,
 * tier-gated. Vetoable: shapes/weights/furnish sets are the owner's to tune.
 * @type {Readonly<Record<string, TemplateSpec>>}
 */
const TEMPLATES = Object.freeze({
  faith: Object.freeze({
    kind: 'faith', widthRatio: 90, depthRatio: 130, baseCells: 12,
    rooms: Object.freeze([
      room('nave', 6, 'front', 0, ['pew', 'brazier', 'lectern']),
      room('sanctuary', 3, 'back', 0, ['altar', 'brazier']),
      room('vestry', 2, 'back', 2, ['shelf', 'desk']),
    ]),
  }),
  security: Object.freeze({
    kind: 'security', widthRatio: 110, depthRatio: 110, baseCells: 12,
    rooms: Object.freeze([
      room('muster', 5, 'front', 0, ['table', 'rack', 'bench']),
      room('armory', 3, 'back', 1, ['rack', 'strongbox']),
      room('cells', 2, 'back', 2, ['cell']),
      room('quarters', 2, 'back', 3, ['bunk', 'table']),
    ]),
  }),
  trade: Object.freeze({
    kind: 'trade', widthRatio: 120, depthRatio: 100, baseCells: 12,
    rooms: Object.freeze([
      room('hall', 5, 'front', 0, ['counter', 'bench', 'table']),
      room('counting', 3, 'back', 1, ['desk', 'ledger', 'shelf']),
      room('strongroom', 2, 'back', 2, ['strongbox']),
    ]),
  }),
  craft: Object.freeze({
    kind: 'craft', widthRatio: 120, depthRatio: 110, baseCells: 11,
    rooms: Object.freeze([
      room('workfloor', 6, 'front', 0, ['workbench', 'hearth', 'rack']),
      room('store', 3, 'back', 1, ['crate', 'shelf']),
      room('kiln', 2, 'back', 2, ['hearth', 'brazier']),
    ]),
  }),
  learning: Object.freeze({
    kind: 'learning', widthRatio: 100, depthRatio: 120, baseCells: 12,
    rooms: Object.freeze([
      room('reading', 5, 'front', 0, ['desk', 'lectern', 'bench']),
      room('stacks', 4, 'back', 0, ['shelf']),
      room('study', 2, 'back', 2, ['desk', 'shelf']),
    ]),
  }),
  vice: Object.freeze({
    kind: 'vice', widthRatio: 130, depthRatio: 100, baseCells: 11,
    rooms: Object.freeze([
      room('common', 6, 'front', 0, ['table', 'bar', 'hearth', 'bench']),
      room('kitchen', 2, 'back', 1, ['hearth', 'cauldron', 'shelf']),
      room('cellar', 2, 'back', 0, ['barrel', 'crate']),
      room('lodging', 3, 'back', 3, ['bed', 'table']),
    ]),
  }),
  civic: Object.freeze({
    kind: 'civic', widthRatio: 110, depthRatio: 120, baseCells: 12,
    rooms: Object.freeze([
      room('hall', 6, 'front', 0, ['bench', 'dais', 'table']),
      room('chamber', 3, 'back', 2, ['table', 'shelf']),
      room('records', 2, 'back', 2, ['shelf', 'desk']),
    ]),
  }),
  generic: Object.freeze({
    kind: 'generic', widthRatio: 110, depthRatio: 110, baseCells: 10,
    rooms: Object.freeze([
      room('main', 5, 'front', 0, ['table', 'bench', 'shelf']),
      room('back', 3, 'back', 2, ['crate', 'shelf']),
    ]),
  }),
});

/**
 * FACET VARIANTS (the function facet selects a variant of the kind's room set). Each
 * entry appends a typed room when the institution's `institutionFunction` facet
 * resolves (declared ?? inferred) to the key — the custom-content on-ramp: a declared
 * `facet:institutionFunction:heals` on any kind adds the infirmary, whatever its name.
 * Absent function facet ⇒ no variant room ⇒ the kind-default set (byte-identical).
 * @type {Readonly<Record<string, RoomSpec>>}
 */
const FUNCTION_VARIANT_ROOM = Object.freeze({
  heals: room('quarters', 3, 'back', 0, ['bed', 'shelf', 'cauldron']),
  feeds: room('store', 3, 'back', 0, ['crate', 'barrel', 'shelf']),
  arms: room('armory', 3, 'back', 0, ['rack', 'strongbox']),
  judges: room('chamber', 3, 'back', 0, ['dais', 'bench']),
});

/** Resolve an institution's interior KIND: its NATURE facet through the ONE
 *  chokepoint, or the `generic` kind-default. Pure, total.
 *  @param {Parameters<typeof facetOf>[0]} inst @returns {string} */
export function interiorKindOf(inst) {
  const nature = facetOf(inst, 'institutionNature');
  return nature != null && Object.prototype.hasOwnProperty.call(TEMPLATES, nature) ? nature : 'generic';
}

/** Resolve an institution's FUNCTION facet variant key, or null (kind-default).
 *  @param {Parameters<typeof facetOf>[0]} inst @returns {string|null} */
export function interiorFunctionOf(inst) {
  const fn = facetOf(inst, 'institutionFunction');
  return fn != null && Object.prototype.hasOwnProperty.call(FUNCTION_VARIANT_ROOM, fn) ? fn : null;
}

/** The tier index (0-based over TIER_ORDER) for a settlement view — an explicit
 *  string tier, else derived from population. @param {{ tier?: unknown, population?: unknown }} s */
export function tierIndexOf(s) {
  const tier = typeof s?.tier === 'string' && TIER_ORDER.indexOf(s.tier) >= 0
    ? s.tier : popToTier(typeof s?.population === 'number' ? s.population : 0);
  return Math.max(0, TIER_ORDER.indexOf(tier));
}

/**
 * The resolved ROOM SET for an institution at a tier: the kind's base rooms present
 * at this tier index, plus the function-variant room (deduped by kind — a variant that
 * duplicates a base room kind already present is dropped so the set stays clean). The
 * order is base-first then variant, so the partition is deterministic.
 * @param {string} kind          an INTERIOR_KINDS member (from interiorKindOf)
 * @param {string|null} fnKey    a FUNCTION_VARIANT_ROOM key (from interiorFunctionOf)
 * @param {number} tierIndex
 * @returns {ReadonlyArray<RoomSpec>}
 */
export function resolveRoomSet(kind, fnKey, tierIndex) {
  const tpl = TEMPLATES[kind] || TEMPLATES.generic;
  /** @type {RoomSpec[]} */
  const rooms = tpl.rooms.filter((r) => tierIndex >= r.minTierIndex).map((r) => r);
  if (fnKey) {
    const variant = FUNCTION_VARIANT_ROOM[fnKey];
    if (variant && !rooms.some((r) => r.kind === variant.kind)) rooms.push(variant);
  }
  return Object.freeze(rooms);
}

/** The template metadata (footprint aspect + base size) for a kind. @param {string} kind */
export function templateOf(kind) {
  return TEMPLATES[kind] || TEMPLATES.generic;
}

/** Read-only test/tooling surface (the WALL pins read these). */
export const _tables = Object.freeze({ TEMPLATES, FUNCTION_VARIANT_ROOM });
