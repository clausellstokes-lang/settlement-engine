/**
 * undercity/staticComponents.js — THE STATIC COMPONENTS of the underground layer (ODQ §311.6.3 /
 * §311.8.2(a)), the second car of the undercity train (MF-UC3; charter draft-UNDERCITY-PLAN.md
 * §4 UC-3, ruled ODQ §441, ratified §445.2, dispatched §446.2/§447).
 *
 * The owner's law, verbatim: caverns "never grow nor diminish — static terrain facts,
 * seed-permanent, licensed by the ground, epoch-invariant." §311.8.1's general form binds every
 * component: LICENSE (the facts that permit it) + ANCHOR (the surface feature it sits
 * under/beside) + EXTENT DRIVER (the quantity that grows it) + TEMPERAMENT + CAUSED PORTALS
 * (its surface joins). For a STATIC component the extent driver is THE GROUND ITSELF: nothing
 * grows it, so its extent is set by the ground at world-birth and never moves again.
 *
 * THE LICENSE IS READ, NEVER TABULATED. `TERRAIN_DATA` already declares which ground takes an
 * excavation: the [D6 THE UNDERWAYS] rows name 'Underground network' as a terrain-affinity
 * institution on exactly two terrain classes — mountain ("Stone easily excavated for tunnels")
 * and hills ("Firm ground easily excavated for tunnels"). This leaf reads the EXISTENCE of that
 * row, never its modifier: a coefficient would be a tuning input (charter §8 R-3), and this car
 * declares none. The ground's HARDNESS is likewise a typed string the data already carries —
 * `architectureModifiers.stoneAvailability` — not a number.
 *
 * THE ANCHOR IS THE GROUND'S OWN NAMED FEATURE. `TERRAIN_DATA[t].naturalFeatures` is the
 * estate's live per-terrain feature vocabulary ('cave system', 'mine entrance', 'quarry',
 * 'mountain pass', 'hidden valley' on mountain; 'hilltop fort site', 'terraced fields', 'stone
 * circle', 'valley crossroads' on hills). The cavern sits beside one of them, chosen by the
 * settlement's own seed. Nothing is invented: every anchor string in an output row is a string
 * the geography data itself publishes.
 *
 * THE CAUSED PORTAL (§311.2). A cave mouth is a `breach`-kind join to the surface feature it
 * opens from — but only where that feature is itself an opening into the ground. Where the
 * ground names no opening, the cavern is ISOLATED: `surfaceJoins` is EMPTY and that is lawful
 * (§311.6.4 — "isolated pieces are lawful"), and honest (§311.9.2(vii): the void nobody has
 * found a way into is itself the game). Hill country reaches that state on every world.
 *
 * THE GROUND CAN REFUSE. The catalog's three 'Underground network' rows carry
 * `forbiddenResources: ['marshlands', 'fertile_floodplain']` — "tunnels flood" — the estate's
 * one stored statement that waterlogged ground holds no void. This leaf derives that list from
 * the catalog at load (the union over every row DECLARING the `subterranean` facet) and never
 * restates it: one source, no second truth. A settlement whose NATIVE roster carries such a
 * resource has no cavern, whatever its terrain class.
 *
 * LAWS THIS LEAF KEEPS:
 *  - A PURE DERIVER at the domain root (the ageBands / T2N / T2R / T2Q precedent): generation
 *    never imports it, nothing is written, the generator golden is byte-identical — proven at S0.
 *  - EPOCH-INVARIANT BY CONSTRUCTION: the only settlement reads are `id`, `name` and the config
 *    terrain/resource chain. No tick, no year, no history, no calamity stamp, no population, no
 *    tier — so a settlement aged three centuries derives the same rows it derived at year zero.
 *    §443 is satisfied trivially: this car reads no key the pulse writes.
 *  - FIRST-PAINT CLOSURE (§441.5(d)): `src/domain/undercity/**` never imports
 *    `src/domain/townMap/**`. Consumers are dormant or lazy (CT-4 prose §7 F4, D5 fabric, UC-5).
 *  - FINITE SEMANTICS: every vocabulary is closed and frozen; no scalar here reads as tuning.
 *  - PURITY: no clock, no ambient randomness, no locale read, no I/O; the only draw is a
 *    seed-keyed uniform pick over a closed admissible set (the §311.7.3 district-affinity
 *    idiom), keyed off the settlement's existing seed-stable identity; iteration is ordered by
 *    `compareCodepoint`, the estate's one sanctioned string order.
 *  - ONE TRUTH WITH THE TRAIN: the joint kinds come from `jointVocabulary.js` (UC-0's data
 *    module, charter J-R2-2), never a local string list.
 */
import { TERRAIN_DATA } from '../../data/geographyData.js';
import { institutionalCatalog } from '../../data/institutionalCatalog.js';
import { fnv1a32 } from '../../kernel/proseHash.js';
import { nativeSemanticResourceKeys } from '../content/customContentSemanticAuthority.js';
import { compareCodepoint } from '../deterministicSort.js';
import { resolveSettlementTerrain } from '../resolveTerrain.js';
import { stablePart } from '../worldPulse/stablePart.js';
import { isJointKind } from './jointVocabulary.js';

/** @typedef {import('./jointVocabulary.js').JointKind} JointKind */
/** @typedef {'pocket'|'chamber'|'hall'|'system'} CavernExtent */
/** @typedef {'cavern'} StaticComponentKind */

/**
 * The slice of a `TERRAIN_DATA` row this leaf reads. Declared rather than cast so the strict
 * kernel checker sees real shapes (the WF-1B/WF-1C law: cure by typedef, never by widening).
 * @typedef {Object} TerrainRow
 * @property {Array<{ name?: string, reason?: string }>} [institutionModifiers]
 * @property {{ stoneAvailability?: string }} [architectureModifiers]
 * @property {string[]} [naturalFeatures]
 */

/**
 * @typedef {Object} SurfaceJoin
 * @property {JointKind} kind the typed joint (§311.9.2(iii)), from the closed vocabulary
 * @property {string} anchor the surface feature the join passes through
 */

/**
 * @typedef {Object} GroundLicense
 * @property {'TERRAIN_EXCAVATION_AFFINITY'} kind the licensing fact's class
 * @property {string} terrain the resolved terrain class
 * @property {string} ground the ground's hardness, `architectureModifiers.stoneAvailability`
 * @property {string} reason the geography data's own words for why this ground takes an excavation
 */

/**
 * @typedef {Object} StaticComponent
 * @property {StaticComponentKind} kind the closed component kind
 * @property {GroundLicense} license the typed terrain fact that permits it (§311.8.1)
 * @property {string} anchor the surface feature it sits beside — a published natural feature
 * @property {CavernExtent} extent the closed bucket the ground fixes once and forever
 * @property {'STATIC'} temperament the §311.8.2 temperament, closed vocabulary
 * @property {SurfaceJoin[]} surfaceJoins the caused portals; EMPTY is lawful (an isolated cavern)
 * @property {'DERIVED_V1'} sourceKind frozen provenance; changing any rule is a declared shift
 */

/** The one static component kind this car derives. @type {ReadonlyArray<StaticComponentKind>} */
export const STATIC_COMPONENT_KINDS = Object.freeze(/** @type {StaticComponentKind[]} */ (['cavern']));

/** The closed extent vocabulary, smallest to largest. @type {ReadonlyArray<CavernExtent>} */
export const CAVERN_EXTENTS = Object.freeze(/** @type {CavernExtent[]} */ (['pocket', 'chamber', 'hall', 'system']));

/** The temperament every row of this car declares (§311.8.2(a)). */
export const STATIC_TEMPERAMENT = 'STATIC';

/** Frozen provenance stamp on every row. */
export const STATIC_COMPONENT_SOURCE_KIND = 'DERIVED_V1';

/** The [D6 THE UNDERWAYS] institution whose terrain-affinity row IS the excavation license. */
export const EXCAVATION_AFFINITY_INSTITUTION = 'Underground network';

/** The catalog facet whose rows carry the estate's "tunnels flood" refusal. */
export const WATERLOGGED_FACET_KIND = 'subterranean';

/**
 * Ground hardness (`architectureModifiers.stoneAvailability`, a closed typed string) → the
 * extents that ground admits. A grammar table, not a tuning table: it names which buckets are
 * REACHABLE, never a weight or a threshold. Deep rock holds the large forms; firm hill stone
 * holds the small ones. A licensed terrain whose hardness this table does not admit yields NO
 * cavern — the leaf refuses rather than inventing an extent for unfamiliar ground.
 * @type {Readonly<Record<string, ReadonlyArray<CavernExtent>>>}
 */
export const EXTENTS_BY_GROUND = Object.freeze({
  'very high': Object.freeze(/** @type {CavernExtent[]} */ (['chamber', 'hall', 'system'])),
  high: Object.freeze(/** @type {CavernExtent[]} */ (['pocket', 'chamber'])),
});

/**
 * The published natural features that are themselves an opening into the ground — where a cave
 * mouth can exist. Every member is a verbatim `TERRAIN_DATA[t].naturalFeatures` string of a
 * licensed terrain (pinned by the acceptance against the live data, never self-supplied). A
 * cavern anchored anywhere else has no known way in and is isolated.
 * @type {ReadonlyArray<string>}
 */
export const GROUND_OPENINGS = Object.freeze(['cave system', 'mine entrance', 'quarry']);

/** The joint kind a cave mouth takes (§311.9.2(iii); the brief's `breach`). */
export const CAVERN_MOUTH_JOINT = 'breach';

/**
 * The resources whose presence in a settlement's NATIVE roster refuses every cavern, derived
 * from the catalog at load: the union of `forbiddenResources` over every row declaring the
 * `subterranean` facet ("tunnels flood"). Read from the data, never restated.
 * @returns {ReadonlySet<string>}
 */
function buildWaterloggedResources() {
  /** @type {Set<string>} */
  const out = new Set();
  for (const tier of Object.values(institutionalCatalog)) {
    if (!tier || typeof tier !== 'object') continue;
    for (const group of Object.values(tier)) {
      if (!group || typeof group !== 'object') continue;
      for (const row of Object.values(group)) {
        const facets = row && typeof row === 'object' ? row.facets : null;
        if (!facets || typeof facets !== 'object') continue;
        if (!Object.prototype.hasOwnProperty.call(facets, WATERLOGGED_FACET_KIND)) continue;
        const forbidden = Array.isArray(row.forbiddenResources) ? row.forbiddenResources : [];
        for (const r of forbidden) if (typeof r === 'string' && r.trim()) out.add(r.trim().toLowerCase());
      }
    }
  }
  return out;
}

const WATERLOGGED_RESOURCES = buildWaterloggedResources();

/** The waterlogging resources, ordered — a receipt the packet and CT-4 can quote.
 *  @returns {string[]} */
export function waterloggedResourceKeys() {
  return [...WATERLOGGED_RESOURCES].sort(compareCodepoint);
}

/**
 * The Murmur finaliser applied to the kernel's FNV-1a before the modulus — the CURED spelling
 * (`hash01`'s avalanche-before-multiply), because a raw `fnv % length` aliases onto a parity
 * class. The FNV root itself is IMPORTED from `kernel/proseHash.js`, not restated: this leaf
 * defines no hash root of its own and adds no row to the entropy census.
 * @param {number} h
 * @returns {number}
 */
function avalanche32(h) {
  let x = h >>> 0;
  x ^= x >>> 16; x = Math.imul(x, 0x85ebca6b) >>> 0;
  x ^= x >>> 13; x = Math.imul(x, 0xc2b2ae35) >>> 0;
  x ^= x >>> 16;
  return x >>> 0;
}

/**
 * A uniform pick over a closed admissible set, keyed off the settlement's own seed-stable
 * identity. No weight, no threshold — the modulus is the whole rule.
 * @template T
 * @param {ReadonlyArray<T>} admissible
 * @param {string} token
 * @returns {T|null}
 */
function seedPick(admissible, token) {
  if (!Array.isArray(admissible) || admissible.length === 0) return null;
  return admissible[avalanche32(fnv1a32(token)) % admissible.length];
}

/**
 * The settlement's seed-stable identity: `id` (minted from the world seed, so a rename never
 * moves the ground), else the name, else the slug helper's own fallback.
 * @param {{ id?: unknown, name?: unknown }} s
 * @returns {string}
 */
function identityOf(s) {
  if (typeof s.id === 'string' && s.id.trim()) return s.id;
  if (typeof s.name === 'string' && s.name.trim()) return s.name;
  return stablePart(null);
}

/**
 * Build a caused portal, refusing any kind outside the closed vocabulary. The deriver's own
 * validation: an unlawful kind yields NO join (the cavern is isolated) rather than an unlawful
 * row — a component may lack a portal, but no component may carry an invented one.
 * @param {unknown} kind
 * @param {unknown} anchor
 * @returns {SurfaceJoin|null}
 */
export function staticSurfaceJoin(kind, anchor) {
  if (!isJointKind(kind)) return null;
  if (typeof anchor !== 'string' || !anchor.trim()) return null;
  return { kind, anchor };
}

/**
 * The published geography row for a terrain class, or null for one the data does not carry.
 * @param {string} terrain
 * @returns {TerrainRow|null}
 */
function terrainRow(terrain) {
  const table = /** @type {Record<string, TerrainRow>} */ (TERRAIN_DATA);
  return Object.prototype.hasOwnProperty.call(table, terrain) ? table[terrain] : null;
}

/**
 * THE GROUND LICENSE (§311.8.1). Present exactly where the geography data declares an
 * excavation affinity for the settlement's terrain class AND the ground's hardness is one this
 * leaf's grammar admits AND the native roster carries no waterlogging resource. Total on
 * garbage: an unresolvable terrain is simply unlicensed.
 * @param {{ id?: unknown, name?: unknown, config?: unknown }|null|undefined} settlement
 * @returns {GroundLicense|null}
 */
export function groundLicenseOf(settlement) {
  const s = settlement && typeof settlement === 'object' ? settlement : {};
  const terrain = resolveSettlementTerrain(s);
  if (typeof terrain !== 'string') return null;
  const data = terrainRow(terrain);
  if (!data) return null;
  const rows = Array.isArray(data.institutionModifiers) ? data.institutionModifiers : [];
  const affinity = rows.find((r) => r && r.name === EXCAVATION_AFFINITY_INSTITUTION);
  if (!affinity) return null;
  const ground = typeof data.architectureModifiers?.stoneAvailability === 'string'
    ? data.architectureModifiers.stoneAvailability
    : '';
  if (!Object.prototype.hasOwnProperty.call(EXTENTS_BY_GROUND, ground)) return null;
  const config = s.config && typeof s.config === 'object'
    ? /** @type {Record<string, unknown>} */ (s.config)
    : null;
  const native = nativeSemanticResourceKeys(config);
  for (const r of native) if (WATERLOGGED_RESOURCES.has(String(r).trim().toLowerCase())) return null;
  const reason = typeof affinity.reason === 'string' ? affinity.reason : '';
  return { kind: 'TERRAIN_EXCAVATION_AFFINITY', terrain, ground, reason };
}

/**
 * THE STATIC COMPONENTS. Pure, total, deterministic and epoch-invariant: the same settlement
 * yields the same rows at year zero and three centuries on, because no epoch fact is read. The
 * ground is ONE fact, so it gives ONE cavern — its size and its place vary by the world's own
 * seed, and its extent never moves again (§311.8.2(a): "never grow nor diminish").
 * @param {{ id?: unknown, name?: unknown, config?: unknown }|null|undefined} settlement
 * @returns {StaticComponent[]}
 */
export function deriveStaticComponents(settlement) {
  const s = settlement && typeof settlement === 'object' ? settlement : {};
  const license = groundLicenseOf(s);
  if (!license) return [];
  const data = terrainRow(license.terrain);
  const features = (Array.isArray(data?.naturalFeatures) ? data.naturalFeatures : [])
    .filter((f) => typeof f === 'string' && f.trim() !== '');
  const identity = `${identityOf(s)}|${stablePart(license.terrain)}`;
  const anchor = seedPick(features, `${identity}|anchor`);
  if (anchor == null) return [];
  const extent = seedPick(EXTENTS_BY_GROUND[license.ground], `${identity}|extent`);
  if (extent == null) return [];
  const mouth = GROUND_OPENINGS.includes(anchor) ? staticSurfaceJoin(CAVERN_MOUTH_JOINT, anchor) : null;
  /** @type {StaticComponent[]} */
  const rows = [{
    kind: 'cavern',
    license,
    anchor,
    extent,
    temperament: STATIC_TEMPERAMENT,
    surfaceJoins: mouth ? [mouth] : [],
    sourceKind: STATIC_COMPONENT_SOURCE_KIND,
  }];
  return rows.sort((a, b) => compareCodepoint(a.anchor, b.anchor));
}
