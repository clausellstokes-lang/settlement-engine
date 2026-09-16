/**
 * undercity/monotoneComponents.js — THE MONOTONE COMPONENTS of the underground layer
 * (ODQ §311.8.2(b), §311.8.3), the fifth car of the undercity train and the first car of T-UC3
 * (MF-UC2; charter draft-UNDERCITY-PLAN.md §4 UC-2, ruled ODQ §441, dispatched ODQ §484).
 *
 * The owner's law, verbatim: "MONOTONE excavation (crypts/ossuaries by burial demand ×
 * institution age, with plague-year surge pits; cellars/undercrofts by quarter trade volume, the
 * smuggler subset by criminal share at gates/waterfronts; mines/quarries at the dossier's
 * resource sites while worked, ABANDONED not erased after)."
 *
 * ⭐ MONOTONE IS STRUCTURAL HERE, NOT HOPEFUL. §311.3's high-water law runs underground — "dug is
 * forever" — so no extent driver in this file may be a quantity that can FALL:
 *   • burial demand reads `deriveHighWater(settlement).population`, T2R's constitutional peak
 *     (the same reading UC-1's built extent keys to), never the standing population;
 *   • institution age grows with the calendar and with nothing else;
 *   • a worked seam keeps the extent the town that dug it earned, and its exhaustion is carried
 *     as `abandoned: true` rather than as a smaller hole.
 * Recession is therefore ALWAYS a posture or an abandonment, never a shrink (§311.8.3: "use
 * recedes, dug space never does"). That is what makes the monotonicity arm a property of the
 * derivation rather than a claim about the fixtures it was tested on.
 *
 * ⭐ BURIAL DEMAND HAS NO CUMULATIVE-DEAD HOME, AND ONE IS NOT INVENTED. The estate records deaths
 * only as PER-TICK pulse receipts (`worldPulse/demographicsKernel.js` folds `births`/`deaths` into
 * the population and keeps no running total) and as the DATED losses on a calamity stamp. The
 * charter's "demographics' dead" therefore compiles as the two facts that DO exist: the HIGH-WATER
 * POPULATION a burying institution has served over its life (the standing demand), and the DATED
 * MASS-DEATH RECORD (the surge). A cumulative-dead counter would be a second truth with no writer.
 *
 * ⚠ THE SURGE PIT READS THAT PEOPLE DIED IN A DATED YEAR, NEVER THAT IT WAS A PLAGUE.
 * `spatial/calamity.js` is explicit that the stamp is BUCKET-NEUTRAL by constitution — the engine
 * never asserts a disaster kind, and `flavorSuggestion` is a DM display suggestion. Branching on
 * it would assert a kind the engine refuses to assert (UC-1 took the same refusal). So the pit is
 * licensed by DATED DEATHS. §443 is satisfied the same way UC-1 satisfies it: `calamityHistory` is
 * a PULSE-WRITTEN key and is reached ONLY through the banked projection `buildCalamityLedger` —
 * this file never names the raw key.
 *
 * ⭐ ONE TRUTH PER FACT, ALL SIX CONSUMED RATHER THAN RE-DERIVED:
 *   T2N   `deriveResourceSites`        — WHERE the seam sits (license + anchor for a working)
 *   T2Q   `institutionFoundingOf`      — the founding kind, with the §441.5(g) PRE_SEED age rule
 *   T2R   `deriveHighWater`            — the monotone population the demand is keyed to
 *   UC-0  `institutionAnchorKey` / `SUBSTRUCTURE_FACET_KIND` — the canonical key and the facet
 *   UC-1  `DISTRICT_COVERAGE_KEYS` / `WATER_ROUTE_VALUES` — the pinned district 12-enum and the
 *         published water-route vocabulary, imported from the sibling that already pinned them
 *         against the live sources rather than copied a second time
 *   corruption.js `readCorruptionClimate(s).crime` — the estate's ONE criminal-share reading
 *         (:539-542, §441.3), CONSUMED and never re-weighted, exactly as UC-4 consumes it
 *
 * ⭐ THE RUIN DISPOSITION, STATED RATHER THAN LEFT TO THE WALKER'S FILE-GRANULAR COMPLIANCE.
 * This car reads the RAW roster and routes the ruin question into the output instead of filtering
 * it away, because a component deriver is a FOSSIL read, not a crediting aggregation: §311.3's
 * "dug is forever" means a burnt-out church's crypt is ABANDONED, not absent, and filtering it
 * would erase dug space — the one thing the monotone temperament forbids. `isLiveInstitution` (the
 * canonical predicate, `institutions/institutionRoster.js`) is imported and consulted per row, so
 * the ruin state is READ and TYPED rather than ignored.
 *
 * LAWS THIS LEAF KEEPS:
 *  - A PURE DERIVER at the domain root (the ageBands / T2N / T2Q / T2R / UC-0 / UC-1 / UC-3
 *    precedent): generation never imports it, nothing is written, the generator golden is
 *    byte-identical — proven at S0.
 *  - DISPLAY-LAZY BY INHERITANCE (§443): importing `highWater.js` and `display/calamityLedger.js`
 *    transfers their law — this leaf is reached only from dormant or lazy consumers (CT-4 prose
 *    §7 F3, the D5 strata fabric, UC-5), never the first-paint entry closure.
 *  - FIRST-PAINT CLOSURE (§441.5(d)): `src/domain/undercity/**` never imports
 *    `src/domain/townMap/**`. The district 12-enum is not imported from `districtProfile.js`
 *    either — UC-1 refused that coupling and this car consumes UC-1's pinned list. The walls
 *    accessor IS imported from `causalState.js`, and that is a different case, MEASURED not
 *    assumed: `causalState.js` already sits inside the entry's static closure (233 files) while
 *    `districtProfile.js` sits outside it, so consuming the landed wall predicate re-parents
 *    nothing, and restating it would mint the second truth UC-0's walk exists to prevent.
 *  - FINITE SEMANTICS: every vocabulary is closed and frozen. The ONE tuning surface is
 *    `MONOTONE_EXTENT_TUNING`; the tables beside it name which buckets and zones are REACHABLE,
 *    never a weight (the UC-3 `EXTENTS_BY_GROUND` / UC-1 `QUARTER_COVERAGE_BY_RUNG` precedent).
 *  - PURITY: no clock, no ambient randomness, no locale read, no I/O; the only draw is a
 *    seed-keyed uniform over a closed admissible set (the §311.7.3 district-affinity idiom) off
 *    the settlement's existing identity; iteration is ordered by `compareCodepoint`; the FNV root
 *    is IMPORTED from `kernel/proseHash.js` and the clamp from `kernel/math.js`, so this file
 *    defines no hash root and no local clamp.
 */
import { TERRAIN_DATA } from '../../data/geographyData.js';
import { clamp } from '../../kernel/math.js';
import { fnv1a32 } from '../../kernel/proseHash.js';
import { defenseProfileHasWalls } from '../causalState.js';
import { readCorruptionClimate } from '../corruption.js';
import { compareCodepoint } from '../deterministicSort.js';
import { buildCalamityLedger } from '../display/calamityLedger.js';
import { deriveHighWater } from '../highWater.js';
import { institutionFoundingOf } from '../institutionFounding.js';
import { isLiveInstitution } from '../institutions/institutionRoster.js';
import { deriveResourceSites } from '../resourceSites.js';
import { nativeResourceConditionRecords, resourceKeyForLabel, resourceSemanticsFor } from '../resourceSemantics.js';
import { facetOf } from '../spatial/cohesionWeave.js';
import { stablePart } from '../worldPulse/stablePart.js';
import { getSpatialLedger } from '../spatial/spatialLedgerAccess.js';
import { isJointKind } from './jointVocabulary.js';
import { EXCAVATION_AFFINITY_INSTITUTION } from './staticComponents.js';
import { institutionAnchorKey, SUBSTRUCTURE_FACET_KIND } from './strataExistence.js';
import { DISTRICT_COVERAGE_KEYS, WATER_ROUTE_VALUES } from './sewerDerivation.js';

/** @typedef {import('./jointVocabulary.js').JointKind} JointKind */
/**
 * The estate's own settlement type, declared as this leaf's input for the reason UC-1 declares
 * it: each collaborator it hands the settlement to (the climate read, the calamity ledger, the
 * high-water reader) declares ITS input in these terms, and the WF-1B/WF-1C law is cure by
 * TYPEDEF, never by widening. JSDoc only — no runtime edge. TOTALITY is preserved: every field is
 * narrowed in-body and `null`, `undefined` and malformed inputs all yield `[]`.
 * @typedef {import('../settlement.schema.js').SimSettlement} SimSettlement
 */
/**
 * The pulse-written calamity key spelled the way `highWater.js`'s own input spells it — DECLARED
 * because `buildCalamityLedger` takes a WEAK type and TS refuses a weak-type argument declaring
 * none of its properties. Declaring it is not a second truth: the VALUE is still read only through
 * the banked ledger projection, never off this key (§443).
 * @typedef {SimSettlement & { calamityHistory?: import('../display/calamityLedger.js').CalStampLike[] }} MonotoneInput
 */
/** @typedef {'crypt'|'surge_pit'|'undercroft'|'smuggler_cellar'|'mine'|'vault'} MonotoneKind */
/** @typedef {'BURYING_INSTITUTION'|'DATED_MASS_DEATH'|'STORING_COMMERCE'|'CRIMINAL_SHARE_AT_GATE_OR_WATERFRONT'|'WORKED_RESOURCE_SITE'|'VAULT_BEARING_INSTITUTION'} MonotoneLicense */
/** @typedef {'BURIAL_DEMAND_X_AGE'|'DATED_MASS_DEATH'|'QUARTER_TRADE_VOLUME'|'CONTRABAND_SHARE'|'WORKED_SEAM'|'RARE_EVENT_DEPOSIT'} ExtentDriverKind */
/** @typedef {'niche'|'chamber'|'gallery'|'labyrinth'} MonotoneExtent */
/** @typedef {'OPEN'|'SEALED'} ComponentPosture */

/**
 * @typedef {Object} SurfaceJoin
 * @property {JointKind} kind   the typed joint (§311.9.2(iii)), from the closed vocabulary
 * @property {string} anchor    the surface feature the join passes through
 */

/**
 * @typedef {Object} ExtentDriver
 * @property {ExtentDriverKind} kind  the closed driver name (§311.8.1's EXTENT DRIVER)
 * @property {number} value           0..1, its reading on this settlement
 * @property {string} home            the live accessor it was read through — a receipt
 */

/**
 * @typedef {Object} MonotoneComponent
 * @property {MonotoneKind} kind          the closed component kind
 * @property {MonotoneLicense} license    the fact that permits it (§311.8.1)
 * @property {string} anchor              the canonical institution key (§441.5(k)) for an
 *   institution-anchored row; the site's published terrain family for a working
 * @property {string|null} zone           the district it sits in, from UC-1's pinned 12-enum;
 *   null for a working, which sits at its seam and not in a quarter
 * @property {MonotoneExtent} extent      the closed bucket the driver reaches
 * @property {boolean} abandoned          dug and no longer used — never erased (§311.8.2(b))
 * @property {ComponentPosture} posture   OPEN, or SEALED for an institutional vault (§311.8.3)
 * @property {'MONOTONE'} temperament     the §311.8.2(b) temperament, closed vocabulary
 * @property {SurfaceJoin[]} surfaceJoins the caused portals (§311.2)
 * @property {ExtentDriver} driver        the quantity that grew it — a receipt CT-4 cites
 * @property {boolean} ageUnderstated     T2Q read FOUNDED_UNDATED: the pulse founded it and no
 *   year was recorded, so the age is a typed floor of zero and no year is ever invented
 * @property {'DERIVED_V1'} sourceKind    frozen provenance; changing any rule is a declared shift
 */

/** The temperament every row of this car declares (§311.8.2(b)). */
export const MONOTONE_TEMPERAMENT = 'MONOTONE';
/** Frozen provenance stamp; changing any rule below is a declared shift. */
export const MONOTONE_SOURCE_KIND = 'DERIVED_V1';

/** The six monotone component kinds, in the doctrine's own order. Ossuaries are the crypt's own
 *  pair and quarries the mine's — one component each, because separating them needs a name-string
 *  idiom this charter refuses. @type {ReadonlyArray<MonotoneKind>} */
export const MONOTONE_COMPONENT_KINDS = Object.freeze(/** @type {MonotoneKind[]} */ ([
  'crypt', 'surge_pit', 'undercroft', 'smuggler_cellar', 'mine', 'vault',
]));

/** The six licences, one per kind. @type {ReadonlyArray<MonotoneLicense>} */
export const MONOTONE_LICENSES = Object.freeze(/** @type {MonotoneLicense[]} */ (['BURYING_INSTITUTION',
  'DATED_MASS_DEATH', 'STORING_COMMERCE', 'CRIMINAL_SHARE_AT_GATE_OR_WATERFRONT', 'WORKED_RESOURCE_SITE',
  'VAULT_BEARING_INSTITUTION']));

/** The six extent drivers. @type {ReadonlyArray<ExtentDriverKind>} */
export const EXTENT_DRIVER_KINDS = Object.freeze(/** @type {ExtentDriverKind[]} */ (['BURIAL_DEMAND_X_AGE',
  'DATED_MASS_DEATH', 'QUARTER_TRADE_VOLUME', 'CONTRABAND_SHARE', 'WORKED_SEAM', 'RARE_EVENT_DEPOSIT']));

/** The closed extents, smallest to largest (the UC-3 `CAVERN_EXTENTS` idiom).
 *  @type {ReadonlyArray<MonotoneExtent>} */
export const MONOTONE_EXTENTS = Object.freeze(/** @type {MonotoneExtent[]} */ (['niche', 'chamber', 'gallery', 'labyrinth']));

/** The closed postures this car assigns. UC-5 owns the security gradient; §311.8.3 fixes the
 *  vault's own posture here. @type {ReadonlyArray<ComponentPosture>} */
export const COMPONENT_POSTURES = Object.freeze(/** @type {ComponentPosture[]} */ (['OPEN', 'SEALED']));

/** The substructure facet values this car derives a component from — UC-0's inference-only kind,
 *  read through the SAME chokepoint and the SAME key (never a name string, so a custom
 *  institution declaring the facet counts exactly like a catalog row). */
export const BURYING_SUBSTRUCTURE = 'crypt';
export const STORING_SUBSTRUCTURE = 'cellar';

/**
 * The institution FUNCTIONS whose type licenses a vault or dungeon below it (§311.8.3, "under the
 * owning institution, licensed by its TYPE"). The estate's typed spelling of an institution's type
 * is the closed `institutionFunction` vocabulary — heals / feeds / arms / judges — and exactly two
 * of its four members are the doctrine's own pair: the CELLS under what judges, and the magazine
 * under what arms. An almshouse and a granary keep no vault.
 *
 * ⚠ MEASURED, NOT ASSUMED. The first draft licensed by `institutionNature` ∈ {trade, security} and
 * the seed sweep refuted it: 2,788 vaults over 420 settlements (6.6 per settlement, 68% of every
 * row this car produced) — a vault under every market stall, which is not a rare sealed thing. The
 * function read yields 472 rows, 1.12 per settlement, at most two of each kind, on 193 and 199
 * settlements respectively. Rarity is the doctrine's word for this component and the licence now
 * earns it. @type {ReadonlyArray<string>}
 */
export const VAULT_BEARING_FUNCTIONS = Object.freeze(['arms', 'judges']);

/**
 * THE DOCTRINE'S CRYPT ZONING (§311.6), mapped onto UC-1's pinned district 12-enum. The owner's
 * four words are "religious places, cemeteries, residential quarters, outskirts": a house of
 * faith buries in its own quarter, and every other burying institution — the graveyard, the
 * charnel yard — sits in the residential edge or beyond it, which the 12-enum spells
 * `residential` and `other`. A GRAMMAR: it names which zones are REACHABLE, never a weight.
 * @type {ReadonlyArray<string>}
 */
export const CRYPT_ZONES_OFF_FAITH = Object.freeze(['other', 'residential']);
/** The zone a house of faith buries in. */
export const FAITH_CRYPT_ZONE = 'religious';
/** The quarter storing commerce keeps its undercroft in. */
export const UNDERCROFT_ZONE = 'merchant';
/** The quarter the smuggler subset works out of. */
export const SMUGGLER_ZONE = 'criminal';
/** The quarter each vault-bearing function keeps its vault in. @type {Readonly<Record<string, string>>} */
export const VAULT_ZONE_BY_FUNCTION = Object.freeze({ arms: 'military', judges: 'civic' });

/**
 * The caused portals (§311.2), one per kind, in the doctrine's and the charter's own words:
 * "church stair for crypts, cellar door for undercrofts, the pit-head for mines". A vault's way in
 * is the one joint the closed vocabulary has for a barrier — `sealed_door` — and a surge pit is a
 * breach in open ground. Every `kind` is a member of `jointVocabulary.js`'s closed list, checked
 * at build time by `monotoneSurfaceJoin`.
 * @type {Readonly<Record<string, { kind: string, anchor: string }>>}
 */
export const JOIN_BY_KIND = Object.freeze({
  crypt: Object.freeze({ kind: 'stair', anchor: 'church stair' }),
  surge_pit: Object.freeze({ kind: 'breach', anchor: 'burial ground' }),
  undercroft: Object.freeze({ kind: 'stair', anchor: 'cellar door' }),
  smuggler_cellar: Object.freeze({ kind: 'stair', anchor: 'cellar door' }),
  mine: Object.freeze({ kind: 'breach', anchor: 'pit-head' }),
  vault: Object.freeze({ kind: 'sealed_door', anchor: 'vault door' }),
});

/** The second join a waterside smuggler cellar opens through — the doctrine's own sluice. */
export const WATERFRONT_JOIN = Object.freeze({ kind: 'sluice', anchor: 'waterfront sluice' });

/**
 * THE ONE TUNING SURFACE (§441.6 / §7 term 5, the `UNDERWAYS_TUNING` and
 * `SEWER_DERIVATION_TUNING` precedent). Bounded, typed, frozen, owner-retunable, and a registered
 * TUNING-PASS INPUT (§8 R-3). PROVISIONAL until the §362.4 tuning signature and
 * EXPOSABLE-PROVISIONAL in the interim.
 *
 * PROVENANCE: chosen by THIS lane's seed sweep over a 420-settlement corpus generated at the build
 * base (6 tiers × 2 cultures × 7 terrains × 5 seeds, each terrain paired with its honest route) —
 * the same harness UC-1 used, re-run for this car's drivers. Every figure below is a LIVENESS
 * measurement rather than a preference: a coefficient is only kept where the driver it governs
 * actually separates the corpus.
 *  • `burialSaturationPopulation` 60,000 — the peak-population corpus is bimodal by tier
 *    (p50 975, p75 13,312, p90 58,568), so a low saturation pins the median crypt at the top
 *    bucket. Five candidates were driven at asOfYear 150: 9,000 → 150/60/31/348 across the four
 *    extents; 20,000 → 189/74/30/296; 40,000 → 239/63/40/247; 60,000 → 263/68/57/201;
 *    80,000 → 281/79/85/144. All four buckets are live at every candidate, and 60,000 gives the
 *    fullest middle — the two interior buckets carry 125 of 589 rows rather than 91.
 *  • `smugglerShareFloor` 0.45 — the criminal-share corpus is LUMPY, not smooth (p25 0.275,
 *    p50 0.371, p75 0.500, p90 0.575), and the test is whether BOTH licensing facts refuse
 *    somewhere. At 0.45: 191 storing settlements licensed, 34 refused by the SHARE alone, 11 by
 *    the PLACE alone — both live. 0.55 collapses the place condition to THREE refusals and would
 *    make the gate/waterfront fact very nearly decorative. 0.35, 0.40, 0.45 and 0.50 all license
 *    the identical 191, and 0.45 is chosen over the rounder 0.50 for a measured reason: a large
 *    mass of the corpus reads EXACTLY 0.500, so a floor at that value would decide hundreds of
 *    settlements on the comparison operator alone. 0.45 makes the same cut strictly inside a gap.
 *  • `workingSaturationPopulation` 6,000 — the seam driver spans 0.002 / p50 0.507 / 1.000 over
 *    163 workings and fills all four extents (67/12/15/69).
 *  • `ageSaturationYears` 150 and `vaultRareRate` 0.35 — both live in the calendar: the crypt
 *    driver reads 0.067 at asOfYear 10, 0.80 at 120 and 1.00 at 400, and the vault's 0.023 /
 *    0.28 / 0.35. ⚠ At a FIXED year the vault driver is CONSTANT across this corpus, and that is
 *    a property of the corpus, not of the rule: a generated world has never been pulsed, so every
 *    institution reads PRE_SEED and every age coincides. The acceptance drives the separation with
 *    dated `foundedAt` stamps rather than claiming it from the sweep.
 *  • `tradeSaturation` 3.0 is NOT a free choice — it is the estate's own
 *    `FABRIC_TUNING.TRADE_FLOW_SAT` (`urbanFabricKernel.js:268`), consumed so the cellar driver and
 *    the fabric's merchant deposit read one throughput scale. Measured dark ⇒ 0.00 on all 388
 *    undercrofts; at 0.9 of saturation ⇒ 0.30; at or past it ⇒ 1.00.
 *  • `surgeDeathSaturation` 400 — a generated corpus carries NO calamity stamps (the key is
 *    pulse-written), so this one cannot be set from the sweep and is set from the stamp's own
 *    scale instead: the acceptance drives it with dated records and pins the bucket it reaches.
 */
export const MONOTONE_EXTENT_TUNING = Object.freeze({
  /** the high-water population one burying institution's demand saturates at. */
  burialSaturationPopulation: 60000,
  /** the high-water population a working's labour saturates at. */
  workingSaturationPopulation: 6000,
  /** institution age, in years, at which the age factor saturates. */
  ageSaturationYears: 150,
  /** quarter throughput at which the cellar driver saturates — the fabric kernel's own scale. */
  tradeSaturation: 3.0,
  /** dated losses at which the surge driver saturates. */
  surgeDeathSaturation: 400,
  /** the criminal share at or above which the smuggler subset is licensed. */
  smugglerShareFloor: 0.45,
  /** a vault grows by rare deposit events the engine does not record; its age factor is scaled
   *  by this rate so the rows stay small and honest rather than tracking the calendar. */
  vaultRareRate: 0.35,
  /** the ascending 0..1 cuts between the four extents. */
  extentCuts: Object.freeze([0.15, 0.45, 0.75]),
});

/**
 * The terrain classes whose ground the geography data licenses for excavation, derived at load
 * from `TERRAIN_DATA` through UC-3's own constant — the [D6 THE UNDERWAYS] affinity rows for
 * 'Underground network'. One truth with the static car: it names WHICH institution's affinity is
 * the licence, and this reads the same rows for the terrains that carry it. Never a list of
 * terrain names typed out here; the acceptance pins the derived set against the live data.
 * @returns {ReadonlyArray<string>}
 */
function buildExcavationTerrains() {
  const table = /** @type {Record<string, { institutionModifiers?: Array<{ name?: string }> }>} */ (TERRAIN_DATA);
  return Object.freeze(Object.entries(table)
    .filter(([, row]) => (Array.isArray(row?.institutionModifiers) ? row.institutionModifiers : [])
      .some((r) => r && r.name === EXCAVATION_AFFINITY_INSTITUTION))
    .map(([terrain]) => terrain).sort(compareCodepoint));
}

/** The ground a working may sit in (§311.1's "mine/quarry workings where terrain licenses them").
 *  @type {ReadonlyArray<string>} */
export const EXCAVATION_TERRAINS = buildExcavationTerrains();

/** The semantic resource type the estate uses for a deposit that can be worked out. */
export const WORKABLE_RESOURCE_TYPE = 'exhaustible';

/**
 * The Murmur finaliser applied to the kernel's FNV-1a before the modulus — the CURED spelling
 * (avalanche before multiply), because a raw `fnv % n` aliases onto a parity class. The FNV root is
 * IMPORTED, never restated: this leaf defines no hash root and adds no entropy-census row.
 * @param {number} h @returns {number}
 */
function avalanche32(h) {
  let x = h >>> 0;
  x ^= x >>> 16; x = Math.imul(x, 0x85ebca6b) >>> 0;
  x ^= x >>> 13; x = Math.imul(x, 0xc2b2ae35) >>> 0;
  x ^= x >>> 16;
  return x >>> 0;
}

/** A uniform pick over a closed admissible set, keyed off the settlement's own identity. No
 *  weight, no threshold — the modulus is the whole rule (UC-3's idiom).
 *  @template T @param {ReadonlyArray<T>} admissible @param {string} token @returns {T|null} */
function seedPick(admissible, token) {
  if (!Array.isArray(admissible) || admissible.length === 0) return null;
  return admissible[avalanche32(fnv1a32(token)) % admissible.length];
}

/** The settlement's seed-stable identity: `id` (minted from the world seed, so a rename never
 *  moves a row), else the name, else the slug helper's own fallback. UC-1/UC-3's idiom.
 *  @param {{ id?: unknown, name?: unknown }} s @returns {string} */
function identityOf(s) {
  if (typeof s.id === 'string' && s.id.trim()) return s.id;
  if (typeof s.name === 'string' && s.name.trim()) return s.name;
  return stablePart(null);
}

/** Narrow an unknown to a plain object, the urbanFabricKernel idiom this file's trade read
 *  mirrors. @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

/** A finite non-negative number, or 0. @param {unknown} v @returns {number} */
function num(v) {
  return Number.isFinite(Number(v)) ? Math.max(0, Number(v)) : 0;
}

/**
 * Build a caused portal, refusing any kind outside the closed vocabulary (UC-3's law: a component
 * may lack a portal, but none may carry an invented one).
 * @param {unknown} kind @param {unknown} anchor @returns {SurfaceJoin|null}
 */
export function monotoneSurfaceJoin(kind, anchor) {
  if (!isJointKind(kind)) return null;
  if (typeof anchor !== 'string' || !anchor.trim()) return null;
  return { kind, anchor };
}

/**
 * THE PRE_SEED AGE RULE (§441.5(g)), one rule, applied everywhere age is read. An institution
 * whose founding reads `PRE_SEED` has stood since the founding, so its age is the settlement's
 * whole history — the founding-era cathedral is as old as the town, never ageless and never
 * invented. A FOUNDED institution's age is measured from its own recorded year. A
 * FOUNDED_UNDATED institution has no year to measure from and none is invented: its age is a
 * typed floor of zero, carried on the row as `ageUnderstated`.
 * @param {unknown} inst
 * @param {number} asOfYear the calendar year the reading is taken at
 * @returns {{ years: number, understated: boolean }}
 */
export function institutionAgeYears(inst, asOfYear) {
  const now = Number.isFinite(Number(asOfYear)) ? Number(asOfYear) : 0;
  const founding = institutionFoundingOf(inst);
  if (founding.kind === 'FOUNDED') return { years: Math.max(0, now - founding.year), understated: false };
  if (founding.kind === 'FOUNDED_UNDATED') return { years: 0, understated: true };
  return { years: Math.max(0, now), understated: false };
}

/**
 * The bucket a 0..1 driver reaches. Non-decreasing in the value by construction, which is what
 * carries the monotone law from the drivers to the extents.
 * @param {number} value01 @returns {MonotoneExtent}
 */
export function extentFor(value01) {
  const v = clamp(Number.isFinite(Number(value01)) ? Number(value01) : 0, 0, 1);
  let i = 0;
  for (const cut of MONOTONE_EXTENT_TUNING.extentCuts) if (v >= cut) i += 1;
  return MONOTONE_EXTENTS[Math.min(i, MONOTONE_EXTENTS.length - 1)];
}

/**
 * THE QUARTER TRADE VOLUME — the M6d windowed throughput, read through the SAME accessor and the
 * SAME two keys `urbanFabricKernel.js:405-407` reads (`getSpatialLedger(worldState, 'tradeFlow')`,
 * then `in` + `out` for this settlement). DARK ⇒ 0 by construction: an unlit ledger, an absent
 * namespace or an absent row all yield zero throughput, which is the honest reading and not a
 * default standing in for one.
 * @param {unknown} worldState @param {string} sid @returns {number}
 */
export function quarterTradeVolume(worldState, sid) {
  const flow = asObject(asObject(getSpatialLedger(asObject(worldState), 'tradeFlow'))[sid]);
  return num(flow.in) + num(flow.out);
}

/**
 * THE SMUGGLER LICENCE (§311.8.2(b), "the smuggler subset by criminal share at gates/waterfronts").
 * Two facts, both landed: a GATE — the wall predicate UC-0's §441.5(d) walk NAMED,
 * `defenseProfileHasWalls` (`causalState.js:306`), because a gate is a way through a wall — or a
 * WATERFRONT, the published route vocabulary UC-1 pinned; and the criminal share at or above the
 * tuned floor, read through corruption.js's ONE reading (§441.3), consumed and never re-weighted.
 * @param {MonotoneInput} s @param {number} criminalShare @returns {{ licensed: boolean, waterfront: boolean }}
 */
export function smugglerLicence(s, criminalShare) {
  const config = asObject(s.config);
  const own = typeof config.tradeRouteAccess === 'string' ? config.tradeRouteAccess.toLowerCase() : '';
  const waterfront = WATER_ROUTE_VALUES.includes(own);
  const gate = defenseProfileHasWalls(/** @type {never} */ (s.defenseProfile));
  return { licensed: (gate || waterfront) && criminalShare >= MONOTONE_EXTENT_TUNING.smugglerShareFloor, waterfront };
}

/**
 * Assemble one row. Every row of this car carries the general form whole (§311.8.1): its licence,
 * its anchor, its extent driver, its temperament and its caused portals.
 * @param {{ kind: MonotoneKind, license: MonotoneLicense, anchor: string, zone: string|null,
 *   driver: ExtentDriver, abandoned: boolean, posture?: ComponentPosture,
 *   extraJoins?: SurfaceJoin[], ageUnderstated?: boolean }} spec
 * @returns {MonotoneComponent}
 */
function componentRow(spec) {
  const declared = JOIN_BY_KIND[spec.kind];
  const primary = declared ? monotoneSurfaceJoin(declared.kind, declared.anchor) : null;
  /** @type {SurfaceJoin[]} */
  const surfaceJoins = primary ? [primary] : [];
  for (const extra of spec.extraJoins ?? []) surfaceJoins.push(extra);
  return {
    kind: spec.kind, license: spec.license, anchor: spec.anchor, zone: spec.zone,
    extent: extentFor(spec.driver.value), abandoned: spec.abandoned, posture: spec.posture ?? 'OPEN',
    temperament: MONOTONE_TEMPERAMENT, surfaceJoins, driver: spec.driver,
    ageUnderstated: spec.ageUnderstated === true, sourceKind: MONOTONE_SOURCE_KIND,
  };
}

/**
 * The workings — mines and quarries — at the dossier's own resource sites. T2N answers WHERE the
 * seam sits and this car asks only two further questions of it, both from landed data: is the
 * deposit one the estate types as workable-out (`exhaustible`), and does the geography licence an
 * excavation in the ground the site sits in. Exhaustion is read from the condition record and
 * carried as ABANDONMENT, never as a smaller working: dug is forever.
 * @param {MonotoneInput} s @param {number} peakPopulation @returns {MonotoneComponent[]}
 */
function deriveWorkings(s, peakPopulation) {
  const T = MONOTONE_EXTENT_TUNING;
  const condition = new Map(nativeResourceConditionRecords(asObject(s.config)).map((r) => [r.key, r.condition]));
  const value = clamp(peakPopulation / T.workingSaturationPopulation, 0, 1);
  /** @type {MonotoneComponent[]} */
  const rows = [];
  for (const site of deriveResourceSites(s)) {
    if (resourceSemanticsFor(site.resource)?.type !== WORKABLE_RESOURCE_TYPE) continue;
    if (!EXCAVATION_TERRAINS.includes(site.terrainAnchor)) continue;
    const key = resourceKeyForLabel(site.resource);
    rows.push(componentRow({
      kind: 'mine', license: 'WORKED_RESOURCE_SITE', anchor: site.terrainAnchor, zone: null,
      abandoned: key != null && condition.get(key) === 'depleted',
      driver: { kind: 'WORKED_SEAM', value, home: 'resourceSites.deriveResourceSites + resourceSemantics.nativeResourceConditionRecords' },
    }));
  }
  return rows;
}

/**
 * The institution-anchored components: crypts under what buries, undercrofts under what stores,
 * the smuggler subset of those undercrofts, and the vaults under the types that hold value. All
 * four resolve their institution through the facet chokepoint and anchor by the canonical key.
 * @param {MonotoneInput} s
 * @param {{ identity: string, asOfYear: number, peakPopulation: number, trade01: number,
 *   criminalShare: number, smuggler: { licensed: boolean, waterfront: boolean } }} ctx
 * @returns {MonotoneComponent[]}
 */
function deriveInstitutionComponents(s, ctx) {
  const T = MONOTONE_EXTENT_TUNING;
  const roster = Array.isArray(s.institutions) ? s.institutions : [];
  const demand = clamp(ctx.peakPopulation / T.burialSaturationPopulation, 0, 1);
  /** @type {MonotoneComponent[]} */
  const rows = [];
  /** @type {Array<{ inst: unknown, anchor: string, abandoned: boolean }>} */
  const storing = [];
  for (const raw of roster) {
    if (!raw || typeof raw !== 'object') continue;
    const inst = /** @type {{ name?: unknown }} */ (raw);
    const anchor = institutionAnchorKey(/** @type {never} */ (inst));
    if (anchor == null) continue;
    const abandoned = !isLiveInstitution(inst);
    const substructure = facetOf(inst, SUBSTRUCTURE_FACET_KIND);
    const nature = facetOf(inst, 'institutionNature');
    const age = institutionAgeYears(inst, ctx.asOfYear);
    const age01 = clamp(age.years / T.ageSaturationYears, 0, 1);
    if (substructure === BURYING_SUBSTRUCTURE) {
      rows.push(componentRow({
        kind: 'crypt', license: 'BURYING_INSTITUTION', anchor, abandoned, ageUnderstated: age.understated,
        zone: nature === 'faith' ? FAITH_CRYPT_ZONE : seedPick(CRYPT_ZONES_OFF_FAITH, `${ctx.identity}|crypt-zone|${anchor}`),
        driver: { kind: 'BURIAL_DEMAND_X_AGE', value: demand * age01, home: 'highWater.deriveHighWater × institutionFounding.institutionFoundingOf' },
      }));
    }
    if (substructure === STORING_SUBSTRUCTURE) storing.push({ inst, anchor, abandoned });
    const fn = facetOf(inst, 'institutionFunction');
    if (fn != null && VAULT_BEARING_FUNCTIONS.includes(fn)) {
      rows.push(componentRow({
        kind: 'vault', license: 'VAULT_BEARING_INSTITUTION', anchor, abandoned, posture: 'SEALED',
        zone: VAULT_ZONE_BY_FUNCTION[fn] ?? null, ageUnderstated: age.understated,
        driver: { kind: 'RARE_EVENT_DEPOSIT', value: age01 * T.vaultRareRate, home: 'institutionFounding.institutionFoundingOf (age only — the engine records no deposit event)' },
      }));
    }
  }
  storing.sort((a, b) => compareCodepoint(a.anchor, b.anchor));
  const sluice = monotoneSurfaceJoin(WATERFRONT_JOIN.kind, WATERFRONT_JOIN.anchor);
  storing.forEach((row, i) => {
    const smuggler = ctx.smuggler.licensed && i === 0;
    rows.push(componentRow({
      kind: smuggler ? 'smuggler_cellar' : 'undercroft',
      license: smuggler ? 'CRIMINAL_SHARE_AT_GATE_OR_WATERFRONT' : 'STORING_COMMERCE',
      anchor: row.anchor,
      zone: smuggler ? SMUGGLER_ZONE : UNDERCROFT_ZONE,
      abandoned: row.abandoned,
      extraJoins: smuggler && ctx.smuggler.waterfront && sluice ? [sluice] : [],
      driver: smuggler
        ? { kind: 'CONTRABAND_SHARE', value: ctx.trade01 * ctx.criminalShare, home: 'spatialLedgerAccess.getSpatialLedger(tradeFlow) × corruption.readCorruptionClimate' }
        : { kind: 'QUARTER_TRADE_VOLUME', value: ctx.trade01, home: 'spatialLedgerAccess.getSpatialLedger(tradeFlow)' },
    }));
  });
  return rows;
}

/**
 * The surge pit a dated year of mass death digs beside the burying ground. ONE row per settlement,
 * because the doctrine's fact is that the town HAD to bury more than its crypts held — a second
 * pit for a second bad year is a claim the record does not make. Anchored to the codepoint-first
 * burying institution, which is the one the ledger's own ordering makes reproducible.
 * @param {MonotoneInput} s @param {MonotoneComponent[]} crypts @returns {MonotoneComponent[]}
 */
function deriveSurgePit(s, crypts) {
  if (crypts.length === 0) return [];
  const ledger = buildCalamityLedger(s);
  const dated = ledger.entries.filter((e) => e != null && e.year != null && e.deaths > 0);
  if (dated.length === 0) return [];
  const deaths = dated.reduce((n, e) => n + (e ? e.deaths : 0), 0);
  // Codepoint-first, not roster-first: the roster's order is an accident of generation, and the
  // pit must sit at the same crypt on every reading of the same settlement.
  const at = [...crypts].sort((a, b) => compareCodepoint(a.anchor, b.anchor))[0];
  return [componentRow({
    kind: 'surge_pit', license: 'DATED_MASS_DEATH', anchor: at.anchor, zone: at.zone, abandoned: false,
    driver: { kind: 'DATED_MASS_DEATH', value: clamp(deaths / MONOTONE_EXTENT_TUNING.surgeDeathSaturation, 0, 1), home: 'display.buildCalamityLedger' },
  })];
}

/**
 * The calendar year the reading is taken at, and where it came from. A caller that holds the world
 * clock supplies it; absent that, the settlement's OWN latest dated record is an honest floor (it
 * is at least that old); absent every record the origin stands. Never a clock read — this leaf is
 * pure.
 * @param {MonotoneInput} s @param {unknown} supplied @returns {{ year: number, source: string }}
 */
function asOfYearOf(s, supplied) {
  if (Number.isFinite(Number(supplied))) return { year: Math.max(0, Number(supplied)), source: 'SUPPLIED' };
  let latest = 0;
  const ledgerYear = buildCalamityLedger(s).lastYear;
  if (Number.isFinite(Number(ledgerYear))) latest = Math.max(latest, Number(ledgerYear));
  for (const raw of Array.isArray(s.institutions) ? s.institutions : []) {
    const founding = institutionFoundingOf(raw);
    if (founding.kind === 'FOUNDED') latest = Math.max(latest, founding.year);
  }
  return latest > 0 ? { year: latest, source: 'LATEST_RECORD' } : { year: 0, source: 'ORIGIN' };
}

/**
 * THE MONOTONE COMPONENTS. Pure, total and deterministic: the same settlement, at the same
 * calendar year and the same world state, yields the same rows; no draw decides whether a row
 * exists, only which admissible zone a non-faith crypt sits in. Rows are ordered by anchor then
 * kind, the UC-0 ordering, so two readings never disagree about their sequence.
 * @param {MonotoneInput|null|undefined} settlement
 * @param {{ asOfYear?: unknown, worldState?: unknown,
 *   highWater?: { population?: unknown } }} [opts]
 *   `highWater` accepts a `deriveHighWater` result a caller has ALREADY computed — one truth,
 *   never a second read; `worldState` carries the M6d trade ledger (absent ⇒ dark ⇒ 0).
 * @returns {MonotoneComponent[]}
 */
export function deriveMonotoneComponents(settlement, opts = {}) {
  const s = /** @type {MonotoneInput} */ (settlement && typeof settlement === 'object' ? settlement : {});
  const options = asObject(opts);
  const supplied = asObject(options.highWater);
  const peakPopulation = Number.isFinite(Number(supplied.population))
    ? Math.max(0, Number(supplied.population))
    : num(deriveHighWater(s).population);
  const identity = identityOf(s);
  const criminalShare = clamp(readCorruptionClimate(s).crime, 0, 1);
  const trade01 = clamp(quarterTradeVolume(options.worldState, identity) / MONOTONE_EXTENT_TUNING.tradeSaturation, 0, 1);
  const rows = deriveInstitutionComponents(s, {
    identity,
    asOfYear: asOfYearOf(s, options.asOfYear).year,
    peakPopulation,
    trade01,
    criminalShare,
    smuggler: smugglerLicence(s, criminalShare),
  });
  rows.push(...deriveSurgePit(s, rows.filter((r) => r.kind === 'crypt')));
  rows.push(...deriveWorkings(s, peakPopulation));
  return rows.sort((a, b) => compareCodepoint(a.anchor, b.anchor) || compareCodepoint(a.kind, b.kind));
}

/**
 * The zones this car can place a row in, ordered — a receipt the packet and CT-4 can quote, and
 * the list the acceptance pins against UC-1's pinned district 12-enum so a zone this car invents
 * cannot ship. @returns {string[]}
 */
export function monotoneZoneKeys() {
  const zones = new Set([FAITH_CRYPT_ZONE, UNDERCROFT_ZONE, SMUGGLER_ZONE, ...CRYPT_ZONES_OFF_FAITH, ...Object.values(VAULT_ZONE_BY_FUNCTION)]);
  return [...zones].filter((z) => DISTRICT_COVERAGE_KEYS.includes(z)).sort(compareCodepoint);
}
