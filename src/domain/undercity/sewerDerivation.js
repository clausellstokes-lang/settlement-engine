/**
 * undercity/sewerDerivation.js — THE SANITATION LADDER + WELLS/CISTERNS (ODQ §311.7, §311.8.2(c)),
 * the third car of the undercity train (MF-UC1; charter draft-UNDERCITY-PLAN.md §4 UC-1, ruled
 * ODQ §441, ratified §445.2). The SURFACE-COUPLED car: both components it derives are coupled to
 * what the surface already is — the ground it falls across, the water it drains to, the quarters
 * the works were chartered to serve.
 *
 * ⭐ THE ONE-TRUTH ROSTER RULE (§441.1). The dossier already generates 'Sewage system'
 * (`institutionalCatalog.js:2225`, the city block, rolled at metropolis too via
 * `assembleInstitutions.js:243`). So the rung and the roster may never disagree about whether the
 * sewer institution exists:
 *   • FULL WEB exists EXACTLY where the roster carries it — read through UC-0's
 *     `sanitationRosterOf`, the SAME read the existence gate makes, never a second one.
 *   • Cities and metropolises carry a FLOOR of QUARTER NETWORK (the owner's "all
 *     cities/metropolises have sewers", kept as drains in the planned quarters).
 *   • Towns derive between cesspits / culvert / quarter network and are CAPPED BELOW full web
 *     without the institution (the owner's "only SOME towns").
 *   • Below town the derived ceiling is CESSPITS (the owner's "below that none"). The ROSTER rule
 *     still outranks it: a custom institution declaring the sanitation facet at any tier is a
 *     full web, because the one-truth rule is that the rung never contradicts the roster.
 *
 * ⭐ THE TIER READ IS THE HIGH-WATER TIER, NOT THE CURRENT ONE. Built extent derives from the
 * historical MAXIMUM population (`highWater.js`'s constitutional law): a city that peaked at
 * 20,000 and holds 10,000 today has the DRAINS of 20,000. So the floor and the ceiling are keyed
 * to `deriveHighWater(settlement).tier`, whose peak is a declared FLOOR and never a guess — a
 * demoted-then-recovered town's rung is therefore honestly conservative (§441.5(g)), and the
 * §434 gap rides through as `highWaterUnderstated` rather than being silently absorbed.
 *
 * ⭐ THE CAUSES (§441.2) — FIVE LIVE, ONE HONEST ZERO. Each row is typed `{ cause, weight,
 * direction, value, contribution }` over a closed 2-direction vocabulary:
 *   PROSPERITY_BAND       RAISES  `readCorruptionClimate(s).prosperity` — the estate's ONE band
 *   CIVIC_CAPACITY        RAISES  institutions resolving `institutionNature: 'civic'` through the
 *                                 facet chokepoint (custom-content parity; never a name string)
 *   GRADIENT_OUTFALL      LOWERS  the owner's own framing: a FLAT DRY site is not the absence of
 *                                 a benefit, it is an impediment — "a flat dry town honestly gets
 *                                 cesspits". This is what makes the direction vocabulary LIVE.
 *   CALAMITY_REBUILD      RAISES  a DATED calamity in the immutable record — the moment drains
 *                                 get laid under a quarter being rebuilt
 *   HIGH_WATER_POPULATION RAISES  the peak past the cesspit-failure line
 *   FOUNDING_CHARTER      RAISES  weight ZERO, marked NO_TYPED_HOME. §311.7.2 named a
 *                                 planned/charter/military founding kind that DOES NOT EXIST:
 *                                 `grep -rn 'founding\.kind|foundingKind' src` → 0 hits. ⛔
 *                                 Regex-matching the prose `founding.reason` is REFUSED BY NAME
 *                                 (the name-string idiom). The slot stays typed at zero so the
 *                                 shape is right when R-7 lands the field; until then it is a
 *                                 pinned NO-OP (measured inert on 420 real settlements).
 *
 * ⚠⚠ THE CALAMITY CAUSE READS THAT A CALAMITY HAPPENED, NEVER WHICH KIND. `spatial/calamity.js`
 * (:260) is explicit: the stamp title is "BUCKET-NEUTRAL by constitution … the engine never
 * asserts a disaster kind; the flavor hint is a separate persisted field a DM display may
 * surface." Branching on `flavorSuggestion` would assert a kind the engine refuses to assert, so
 * this leaf reads the ledger's COUNT of dated records and nothing else. §443 is satisfied the
 * same way: `calamityHistory` is a PULSE-written key and is reached ONLY through the banked
 * projection `buildCalamityLedger` — this file never names it.
 *
 * LAWS THIS LEAF KEEPS:
 *  - A PURE DERIVER at the domain root (the ageBands / T2R / T2Q / UC-0 / UC-3 precedent):
 *    generation never imports it, nothing is written, the generator golden is byte-identical.
 *  - DISPLAY-LAZY BY INHERITANCE (§443): importing `highWater.js` and, through it,
 *    `display/calamityLedger.js` transfers their law — this leaf is reached only from dormant or
 *    lazy consumers (CT-4 prose §7 F2, the D5 strata fabric, UC-5), never the first-paint closure.
 *  - FIRST-PAINT CLOSURE (§441.5(d)): `src/domain/undercity/**` never imports
 *    `src/domain/townMap/**`. The district 12-enum is therefore PINNED BY VALUE, not imported —
 *    `districtProfile.js` pulls factionProfile / causalState / activeConditions / threatProfile
 *    behind it, a coupling a leaf on this path refuses. The acceptance imports the real
 *    `DISTRICT_CATEGORIES` and pins the two lists equal, so the copy cannot drift silently.
 *  - ONE TRUTH WITH THE TRAIN: the rung names come from UC-0's `SANITATION_LADDER`, the roster
 *    from UC-0's `sanitationRosterOf`, the anchor key from UC-0's `institutionAnchorKey`, the
 *    joint kinds from UC-0's `jointVocabulary.js`. Nothing here restates any of them.
 *  - FINITE SEMANTICS: every vocabulary is closed and frozen. The ONE tuning surface is
 *    `SEWER_DERIVATION_TUNING`; the grammar tables beside it name which buckets are REACHABLE,
 *    never a weight (the UC-3 `EXTENTS_BY_GROUND` precedent).
 *  - PURITY: no Date, no Math.random, no Intl, no I/O; the only draw is a seed-keyed uniform off
 *    the settlement's existing identity (the §311.7.3 district-affinity idiom); iteration is
 *    ordered by `compareCodepoint`; the FNV root is IMPORTED from `kernel/proseHash.js` and the
 *    clamp from `kernel/math.js`, so this file defines no hash root and no local clamp.
 */
import { TERRAIN_DATA } from '../../data/geographyData.js';
import { clamp } from '../../kernel/math.js';
import { fnv1a32 } from '../../kernel/proseHash.js';
import { readCorruptionClimate } from '../corruption.js';
import { compareCodepoint } from '../deterministicSort.js';
import { buildCalamityLedger } from '../display/calamityLedger.js';
import { deriveHighWater } from '../highWater.js';
import { resolveSettlementTerrain } from '../resolveTerrain.js';
import { facetOf } from '../spatial/cohesionWeave.js';
import { stablePart } from '../worldPulse/stablePart.js';
import { isJointKind } from './jointVocabulary.js';
import { SANITATION_LADDER, institutionAnchorKey, sanitationRosterOf } from './strataExistence.js';

/** @typedef {import('./jointVocabulary.js').JointKind} JointKind */
/** @typedef {import('./strataExistence.js').SanitationRung} SanitationRung */
/** @typedef {'ROSTER_FULL_WEB'|'TIER_FLOOR'|'DERIVED'} RungSource */
/** @typedef {'PROSPERITY_BAND'|'CIVIC_CAPACITY'|'GRADIENT_OUTFALL'|'CALAMITY_REBUILD'|'HIGH_WATER_POPULATION'|'FOUNDING_CHARTER'} SewerCause */
/** @typedef {'RAISES'|'LOWERS'} CauseDirection */
/** @typedef {'well'|'cistern'} WellKind */
/** @typedef {'single'|'cluster'|'quarter_wells'|'public_works'} WellExtent */

/**
 * @typedef {Object} SurfaceJoin
 * @property {JointKind} kind   the typed joint (§311.9.2(iii)), from the closed vocabulary
 * @property {string} anchor    the surface feature the join passes through
 */

/**
 * @typedef {Object} CauseRow
 * @property {SewerCause} cause         the closed cause name
 * @property {number} weight            its bounded weight from `SEWER_DERIVATION_TUNING`
 * @property {CauseDirection} direction RAISES or LOWERS — the sign it applies with
 * @property {number} value             0..1, the cause's reading on this settlement
 * @property {number} contribution      the signed term this cause put into the score
 * @property {string} home              the live accessor the value was read through — a receipt
 */

/**
 * @typedef {Object} WellRow
 * @property {WellKind} kind
 * @property {'TIER_SCALED_WATER_NEED'|'ENGINEERED_WATER_SYSTEM'} license the fact that permits it
 * @property {string} anchor            the quarter it serves — a district key from the 12-enum
 * @property {WellExtent} extent        the closed bucket the tier fixes
 * @property {'SURFACE_COUPLED'} temperament
 * @property {SurfaceJoin[]} surfaceJoins
 * @property {'DERIVED_V1'} sourceKind
 */

/**
 * @typedef {Object} SewerLadder
 * @property {SanitationRung} rung
 * @property {RungSource} rungSource
 * @property {CauseRow[]} causes
 * @property {Record<string, boolean>} perQuarterCoverage keyed by the pinned district 12-enum
 * @property {WellRow[]} wells
 * @property {'SURFACE_COUPLED'} temperament
 * @property {SurfaceJoin[]} surfaceJoins one `grate` per drained quarter; EMPTY is lawful
 * @property {number} score            0..1, the weighted reading the derived rung stands on
 * @property {string} highWaterTier    the tier the built extent is keyed to (the peak's)
 * @property {boolean} highWaterUnderstated §434's typed shortfall, carried not absorbed
 * @property {'DERIVED_V1'} sourceKind
 */

/** The temperament every row of this car declares (§311.8.2(c)). */
export const SEWER_TEMPERAMENT = 'SURFACE_COUPLED';
/** Frozen provenance stamp; changing any rule below is a declared shift. */
export const SEWER_SOURCE_KIND = 'DERIVED_V1';
/** The three ways a rung can be decided. @type {ReadonlyArray<RungSource>} */
export const RUNG_SOURCES = Object.freeze(/** @type {RungSource[]} */ (['ROSTER_FULL_WEB', 'TIER_FLOOR', 'DERIVED']));
/** The closed direction vocabulary. @type {ReadonlyArray<CauseDirection>} */
export const CAUSE_DIRECTIONS = Object.freeze(/** @type {CauseDirection[]} */ (['RAISES', 'LOWERS']));
/** The six typed causes, in the doctrine's own order. @type {ReadonlyArray<SewerCause>} */
export const SEWER_CAUSES = Object.freeze(/** @type {SewerCause[]} */ ([
  'PROSPERITY_BAND', 'CIVIC_CAPACITY', 'GRADIENT_OUTFALL', 'CALAMITY_REBUILD',
  'HIGH_WATER_POPULATION', 'FOUNDING_CHARTER',
]));
/** The one cause §311.7.2 named that has no typed home in the estate (§441.2; R-7 wakes it). */
export const NO_TYPED_HOME_CAUSE = 'FOUNDING_CHARTER';

/**
 * The district 12-enum, PINNED BY VALUE from `src/domain/districtProfile.js:33-37` — see the
 * first-paint law in the header. The acceptance pins this list equal to the real
 * `DISTRICT_CATEGORIES`, so a drift reds there rather than shipping.
 * @type {ReadonlyArray<string>}
 */
export const DISTRICT_COVERAGE_KEYS = Object.freeze([
  'religious', 'merchant', 'military', 'craft', 'residential', 'noble',
  'civic', 'arcane', 'criminal', 'foreign', 'industrial', 'other',
]);

/**
 * THE ONE TUNING SURFACE (§441.6, the `UNDERWAYS_TUNING` precedent). Bounded, typed, frozen,
 * owner-retunable, and a registered TUNING-PASS INPUT (§8 R-3). PROVISIONAL until the §362.4
 * tuning signature and EXPOSABLE-PROVISIONAL in the interim (§7 term 5).
 *
 * PROVENANCE: chosen by THIS lane's seed sweep over a 420-settlement corpus generated at the
 * build base (6 tiers × 2 cultures × 7 terrains × 5 seeds, each terrain paired with its honest
 * route). Four candidate weight sets were driven; all satisfied the four ruled invariants except
 * one, which failed the owner's own flat-dry-town example on 6 of 30 such towns. Among the
 * survivors this set maximizes CAUSE LIVENESS — the number of settlements whose rung actually
 * moves between a cause's extremes — so no weight is decorative: prosperity 50, civic 34,
 * calamity 29, high water 65, gradient 68 of 420, and the zero-weight founding slot measured
 * INERT at 0. `HIGH_WATER_POPULATION` carries the heaviest raising weight because the high-water
 * law is the constitutional one. The three RAISES weights plus high water sum to exactly 1.
 */
export const SEWER_DERIVATION_TUNING = Object.freeze({
  weights: Object.freeze({
    PROSPERITY_BAND: 0.25,
    CIVIC_CAPACITY: 0.25,
    GRADIENT_OUTFALL: 0.30,
    CALAMITY_REBUILD: 0.15,
    HIGH_WATER_POPULATION: 0.35,
    FOUNDING_CHARTER: 0,
  }),
  /** civic institutions at which the civic cause saturates. */
  civicSaturation: 4,
  /** dated calamity records at which the rebuild cause saturates. */
  calamitySaturation: 3,
  /** the high-water population above which cesspits stop coping. */
  cesspitFailurePopulation: 2000,
  /** the high-water population at which that cause saturates. */
  highWaterSaturation: 12000,
  /** at or below this score the rung is ABSENT — cesspits, with no draw taken. */
  absentFloor: 0.10,
  /** at or above this score the derived ceiling is CERTAIN, with no draw taken. */
  certainThreshold: 0.90,
});

/** Which direction each cause applies with. @type {Readonly<Record<SewerCause, CauseDirection>>} */
export const CAUSE_DIRECTION = Object.freeze(/** @type {Record<SewerCause, CauseDirection>} */ ({
  PROSPERITY_BAND: 'RAISES', CIVIC_CAPACITY: 'RAISES', GRADIENT_OUTFALL: 'LOWERS',
  CALAMITY_REBUILD: 'RAISES', HIGH_WATER_POPULATION: 'RAISES', FOUNDING_CHARTER: 'RAISES',
}));

/**
 * THE LADDER BOUNDS PER TIER — a GRAMMAR, not a tuning table: it names which rungs are REACHABLE
 * by DERIVATION at a tier, never a weight or a threshold. Indices into `SANITATION_LADDER`. The
 * owner's three sentences, one row each: all cities/metropolises (floor 2) · only SOME towns
 * (ceiling 2, floor 0) · below that none (ceiling 0). The ROSTER rule outranks every row here.
 * @type {Readonly<Record<string, { floor: number, ceiling: number }>>}
 */
export const TIER_LADDER_BOUNDS = Object.freeze({
  thorp: Object.freeze({ floor: 0, ceiling: 0 }),
  hamlet: Object.freeze({ floor: 0, ceiling: 0 }),
  village: Object.freeze({ floor: 0, ceiling: 0 }),
  town: Object.freeze({ floor: 0, ceiling: 2 }),
  city: Object.freeze({ floor: 2, ceiling: 2 }),
  metropolis: Object.freeze({ floor: 2, ceiling: 2 }),
});

/**
 * WHICH QUARTERS A RUNG DRAINS — a nested GRAMMAR over the pinned 12-enum, smallest cover first.
 * A market drain reaches the trading and civic core; a quarter network reaches the quarters a
 * works programme is chartered for; only a full web reaches the organic faubourg. This is the
 * owner's per-quarter law stated as data, and the acceptance pins the nesting.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const QUARTER_COVERAGE_BY_RUNG = Object.freeze({
  cesspits: Object.freeze([]),
  culvert: Object.freeze(['civic', 'merchant']),
  quarter_network: Object.freeze(['arcane', 'civic', 'merchant', 'military', 'noble', 'religious']),
  full_web: DISTRICT_COVERAGE_KEYS,
});

/**
 * The published terrain classes whose ground the geography data itself describes as sloped —
 * mountain ("mountainous terrain, possibly in a valley or on slopes") and hills, the two the
 * `[D6 THE UNDERWAYS]` rows call rock and "hill slopes". A GRAMMAR over the closed published
 * vocabulary: the estate stores no elevation, relief or drainage field, and inventing a number
 * for one would be a second truth. The acceptance pins this against the live `TERRAIN_DATA` keys.
 * @type {ReadonlyArray<string>}
 */
export const FALL_LINE_TERRAINS = Object.freeze(['hills', 'mountain']);

/**
 * The route values that state a body of water AT the settlement — read, not tabulated: they are
 * members of the published route vocabulary (`tradeRouteSemantics.js`'s `ROUTE_TIER`), and the
 * same words `TERRAIN_DATA[t].impliedTradeAccess` publishes for the two water terrains
 * ('port' on coastal, 'river' on riverside). A sewer needs somewhere to fall TO.
 * @type {ReadonlyArray<string>}
 */
export const WATER_ROUTE_VALUES = Object.freeze(['coastal', 'port', 'river']);

/** The closed well extents, smallest to largest. @type {ReadonlyArray<WellExtent>} */
export const WELL_EXTENTS = Object.freeze(/** @type {WellExtent[]} */ (['single', 'cluster', 'quarter_wells', 'public_works']));

/**
 * Tier → the well extent that tier's water need reaches, and whether the roster's engineered
 * water system is present. 'Aqueduct or water system' is `required: true` in the CITY block
 * (`institutionalCatalog.js:2239`), so city and metropolis carry it BY CONSTRUCTION — the tier
 * read IS the roster read here, and the acceptance pins that against the live catalog rather
 * than asserting it. Below city the need is met by drawn water alone.
 * @type {Readonly<Record<string, { extent: WellExtent, engineered: boolean }>>}
 */
export const WELL_NEED_BY_TIER = Object.freeze({
  thorp: Object.freeze({ extent: 'single', engineered: false }),
  hamlet: Object.freeze({ extent: 'single', engineered: false }),
  village: Object.freeze({ extent: 'cluster', engineered: false }),
  town: Object.freeze({ extent: 'quarter_wells', engineered: false }),
  city: Object.freeze({ extent: 'public_works', engineered: true }),
  metropolis: Object.freeze({ extent: 'public_works', engineered: true }),
});

/** The joint a drained quarter opens through, and the one a well-house does (§311.9.2(iii)). */
export const SEWER_GRATE_JOINT = 'grate';
export const WELL_HOUSE_JOINT = 'stair';
/** The surface feature a well's stair passes through — the doctrine's own well-house (§311.2). */
export const WELL_HOUSE_FEATURE = 'well-house';

/**
 * The Murmur finaliser applied to the kernel's FNV-1a before the modulus — the CURED spelling
 * (avalanche before multiply), because a raw `fnv % n` aliases onto a parity class. The FNV root
 * is IMPORTED, never restated: this leaf defines no hash root and adds no entropy-census row.
 * @param {number} h @returns {number}
 */
function avalanche32(h) {
  let x = h >>> 0;
  x ^= x >>> 16; x = Math.imul(x, 0x85ebca6b) >>> 0;
  x ^= x >>> 13; x = Math.imul(x, 0xc2b2ae35) >>> 0;
  x ^= x >>> 16;
  return x >>> 0;
}

/** A seed-keyed uniform in [0,1). No weight, no threshold — the hash is the whole rule.
 *  @param {string} token @returns {number} */
function unitDraw(token) {
  return avalanche32(fnv1a32(token)) / 4294967296;
}

/**
 * The settlement's seed-stable identity: `id` (minted from the world seed, so a rename never
 * moves the draw), else the name, else the slug helper's own fallback. UC-3's idiom, unchanged.
 * @param {{ id?: unknown, name?: unknown }} s @returns {string}
 */
function identityOf(s) {
  if (typeof s.id === 'string' && s.id.trim()) return s.id;
  if (typeof s.name === 'string' && s.name.trim()) return s.name;
  return stablePart(null);
}

/** Build a caused portal, refusing any kind outside the closed vocabulary (UC-3's law: a
 *  component may lack a portal, but none may carry an invented one).
 *  @param {unknown} kind @param {unknown} anchor @returns {SurfaceJoin|null} */
export function sewerSurfaceJoin(kind, anchor) {
  if (!isJointKind(kind)) return null;
  if (typeof anchor !== 'string' || !anchor.trim()) return null;
  return { kind, anchor };
}

/** OUTFALL: does the settlement have water to drain to? Its own declared route first, else the
 *  water the terrain class publishes. @param {Record<string, unknown>|null} config
 *  @param {string|null} terrain @returns {boolean} */
function hasOutfall(config, terrain) {
  const own = typeof config?.tradeRouteAccess === 'string' ? config.tradeRouteAccess.toLowerCase() : '';
  if (WATER_ROUTE_VALUES.includes(own)) return true;
  const row = terrain != null && Object.prototype.hasOwnProperty.call(TERRAIN_DATA, terrain)
    ? /** @type {Record<string, { impliedTradeAccess?: unknown }>} */ (TERRAIN_DATA)[terrain]
    : null;
  const implied = typeof row?.impliedTradeAccess === 'string' ? row.impliedTradeAccess.toLowerCase() : '';
  return WATER_ROUTE_VALUES.includes(implied);
}

/**
 * THE FIVE LIVE CAUSES AND THE HONEST ZERO, each read through its ONE live accessor and each
 * carrying that accessor as a receipt. Total on garbage: every value narrows in-body.
 * @param {{ institutions?: unknown, config?: unknown }} s
 * @param {{ population: number }} highWater
 * @returns {CauseRow[]}
 */
export function sewerCauses(s, highWater) {
  const T = SEWER_DERIVATION_TUNING;
  const terrain = resolveSettlementTerrain(s);
  const config = s.config && typeof s.config === 'object' ? /** @type {Record<string, unknown>} */ (s.config) : null;
  const rows = Array.isArray(s.institutions) ? s.institutions : [];
  const civic = rows.filter((i) => facetOf(/** @type {{ name?: unknown }} */ (i), 'institutionNature') === 'civic').length;
  const fall = FALL_LINE_TERRAINS.includes(String(terrain)) ? 1 : 0;
  const outfall = hasOutfall(config, terrain) ? 1 : 0;
  const span = T.highWaterSaturation - T.cesspitFailurePopulation;
  /** @type {Array<{ cause: SewerCause, value: number, home: string }>} */
  const read = [
    { cause: 'PROSPERITY_BAND', value: clamp(readCorruptionClimate(s).prosperity, 0, 1), home: 'corruption.readCorruptionClimate' },
    { cause: 'CIVIC_CAPACITY', value: clamp(civic / T.civicSaturation, 0, 1), home: 'cohesionWeave.facetOf(institutionNature)' },
    // The owner's framing: flat AND dry is a full impediment; falling ground WITH an outfall is none.
    { cause: 'GRADIENT_OUTFALL', value: 1 - (fall * 0.5 + outfall * 0.5), home: 'resolveTerrain + geographyData.impliedTradeAccess' },
    { cause: 'CALAMITY_REBUILD', value: clamp(buildCalamityLedger(s).count / T.calamitySaturation, 0, 1), home: 'display.buildCalamityLedger' },
    { cause: 'HIGH_WATER_POPULATION', value: clamp((highWater.population - T.cesspitFailurePopulation) / span, 0, 1), home: 'highWater.deriveHighWater' },
    { cause: 'FOUNDING_CHARTER', value: 0, home: 'NO_TYPED_HOME' },
  ];
  return read.map(({ cause, value, home }) => {
    const weight = T.weights[cause];
    const direction = CAUSE_DIRECTION[cause];
    return { cause, weight, direction, value, contribution: (direction === 'LOWERS' ? -1 : 1) * weight * value, home };
  });
}

/**
 * The banded rung index. ABSENT at or below the floor and CERTAIN at or above the threshold —
 * neither takes a draw. Between them the position is weighted-still-diced, seed-keyed off the
 * settlement's own identity, and the step is NON-DECREASING in the score for a fixed draw, which
 * is what makes each cause's declared direction a real monotonicity rather than a claim.
 * @param {number} score @param {number} ceiling @param {string} token @returns {number}
 */
function bandedIndex(score, ceiling, token) {
  const T = SEWER_DERIVATION_TUNING;
  if (ceiling <= 0 || score <= T.absentFloor) return 0;
  if (score >= T.certainThreshold) return ceiling;
  const pos = ((score - T.absentFloor) / (T.certainThreshold - T.absentFloor)) * ceiling;
  const base = Math.floor(pos);
  return Math.min(ceiling, base + (unitDraw(token) < pos - base ? 1 : 0));
}

/** The wells and cisterns a tier's water need licenses, anchored to the quarters they serve.
 *  @param {string} tier @param {string} identity @param {string[]} covered @returns {WellRow[]} */
function deriveWells(tier, identity, covered) {
  const need = Object.prototype.hasOwnProperty.call(WELL_NEED_BY_TIER, tier) ? WELL_NEED_BY_TIER[tier] : null;
  if (!need) return [];
  const served = covered.length > 0 ? covered : [...DISTRICT_COVERAGE_KEYS].sort(compareCodepoint);
  const stair = sewerSurfaceJoin(WELL_HOUSE_JOINT, WELL_HOUSE_FEATURE);
  /** @type {WellRow[]} */
  const out = [{
    kind: 'well',
    license: 'TIER_SCALED_WATER_NEED',
    anchor: served[Math.floor(unitDraw(`${identity}|well-anchor`) * served.length) % served.length],
    extent: need.extent,
    temperament: SEWER_TEMPERAMENT,
    surfaceJoins: stair ? [stair] : [],
    sourceKind: SEWER_SOURCE_KIND,
  }];
  if (need.engineered) {
    out.push({
      kind: 'cistern',
      license: 'ENGINEERED_WATER_SYSTEM',
      anchor: served[Math.floor(unitDraw(`${identity}|cistern-anchor`) * served.length) % served.length],
      extent: need.extent,
      temperament: SEWER_TEMPERAMENT,
      surfaceJoins: stair ? [stair] : [],
      sourceKind: SEWER_SOURCE_KIND,
    });
  }
  return out.sort((a, b) => compareCodepoint(a.kind, b.kind));
}

/**
 * THE SANITATION LADDER. Pure, total, deterministic: the same settlement yields the same rung,
 * the same coverage and the same wells. Feeds UC-0's existence gate through its optional second
 * argument — `deriveStrataExistence(s, { sanitationRung: deriveSewerLadder(s).rung })` — which is
 * the whole of seam D-UC0-3; UC-0's leaf needs no edit.
 * @param {{ institutions?: unknown, config?: unknown, id?: unknown, name?: unknown }|null|undefined} settlement
 * @param {{ highWater?: { population?: unknown, tier?: unknown, understated?: unknown } }} [opts]
 *   a `deriveHighWater` result a caller has ALREADY computed — one truth, never a second read
 * @returns {SewerLadder}
 */
export function deriveSewerLadder(settlement, opts = {}) {
  const s = settlement && typeof settlement === 'object' ? settlement : {};
  const supplied = opts && typeof opts === 'object' ? opts.highWater : undefined;
  const hw = supplied && typeof supplied === 'object' ? supplied : deriveHighWater(/** @type {never} */ (s));
  const highWater = {
    population: Number.isFinite(Number(hw.population)) ? Number(hw.population) : 0,
    tier: typeof hw.tier === 'string' ? hw.tier : '',
    understated: hw.understated === true,
  };
  const causes = sewerCauses(s, highWater);
  const score = clamp(causes.reduce((n, c) => n + c.contribution, 0), 0, 1);
  const bounds = Object.prototype.hasOwnProperty.call(TIER_LADDER_BOUNDS, highWater.tier)
    ? TIER_LADDER_BOUNDS[highWater.tier]
    : { floor: 0, ceiling: 0 };
  const identity = identityOf(s);
  let index = bandedIndex(score, bounds.ceiling, `${identity}|sewer-band`);
  /** @type {RungSource} */
  let rungSource = 'DERIVED';
  if (index < bounds.floor) { index = bounds.floor; rungSource = 'TIER_FLOOR'; }
  if (sanitationRosterOf(s.institutions).length > 0) {
    index = SANITATION_LADDER.length - 1;
    rungSource = 'ROSTER_FULL_WEB';
  }
  const rung = SANITATION_LADDER[index];
  const covered = [...QUARTER_COVERAGE_BY_RUNG[rung]].sort(compareCodepoint);
  const coveredSet = new Set(covered);
  /** @type {Record<string, boolean>} */
  const perQuarterCoverage = {};
  for (const key of [...DISTRICT_COVERAGE_KEYS].sort(compareCodepoint)) perQuarterCoverage[key] = coveredSet.has(key);
  /** @type {SurfaceJoin[]} */
  const surfaceJoins = [];
  for (const key of covered) {
    const join = sewerSurfaceJoin(SEWER_GRATE_JOINT, key);
    if (join) surfaceJoins.push(join);
  }
  return {
    rung,
    rungSource,
    causes,
    perQuarterCoverage,
    wells: deriveWells(highWater.tier, identity, covered),
    temperament: SEWER_TEMPERAMENT,
    surfaceJoins,
    score,
    highWaterTier: highWater.tier,
    highWaterUnderstated: highWater.understated,
    sourceKind: SEWER_SOURCE_KIND,
  };
}
