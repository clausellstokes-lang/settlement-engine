/**
 * demographicsRates.js — WAVE P1 (THE DEMOGRAPHIC ENGINE, docs/DESIGN_DEMOGRAPHIC_ENGINE.md).
 * THE AUTHORED TABLES AND THE PURE READS. No state, no RNG, no writes.
 *
 * THE DEFECT THIS SLICE EXISTS TO KILL (executed evidence): the 300-year research
 * soak failed `realm population bounded`. Two settlements compounded at a smooth
 * x1.07/year to 29.1 trillion and 16.4 trillion people while six siblings floored at
 * 200 to 500. Root cause (design header): the population model has births without a
 * death side, growth without a carrying capacity, and no redistribution. Decline has
 * a floor; growth had nothing.
 *
 * THIS FILE IS THE MISSING BOUND. Three derivations, all pure, all zero-PRNG:
 *
 *   • foodCapacityOf  -> K_food, how many mouths this place can FEED. Local food
 *     production (the generation-frozen physics on economicState.foodSecurity, which
 *     K4's magic substitution already counts at its cap) plus net imports (J4's live
 *     goods arteries when the route network is lit, the generated import channel
 *     otherwise) minus standing relief obligations, converted to mouths through ONE
 *     authored MOUTHS_PER_FOOD_UNIT table. Derived every tick, NEVER stored.
 *   • densityCeilingOf -> D_tier, how many can FIT. The authored per-tier table,
 *     terrain-adjusted, METROPOLIS INCLUDED because the top of the ladder having a
 *     ceiling is the design's whole point.
 *   • demographicRates -> {birth01, death01}. Births suppressed by crowding; deaths
 *     raised by crowding and by food deficit, ON TOP OF a natural-mortality floor
 *     that exists at zero pressure in the happiest town forever (J-P2).
 *
 * WHY THE PAIR CANNOT FIGHT (law 2 / J-P1): they answer different questions. K says
 * how many can eat, D says how many can fit. The effective bound is min(K, D), and
 * WHICH ONE BINDS is itself a diagnosis the receipt names ("the granaries are the
 * wall" vs "the walls are the wall").
 *
 * THE EQUILIBRIUM IS A FIXED POINT, NOT A CLAMP (law 1 / J-P5). Far from the bound
 * births dominate; approaching it the suppression and strain terms close the gap;
 * past it deaths dominate. A settlement CAN briefly exceed K (famine lag is real and
 * narratable) and then pays for it. Nothing anywhere clamps a population.
 *
 * WHERE THE PLATEAU LANDS, derived from the tables below rather than asserted:
 * with birth b0 and natural death d0, the fixed point of the suppression/strain pair
 * solves to p* = (3.7 + 0.4r) / (3.6 + 2r) for r = d0/b0, which runs 0.83 at thorp
 * scale down to 0.76 at metropolis scale. Every settlement therefore settles between
 * 76 and 83 percent of min(K_food, D_tier) instead of compounding forever, and the
 * rural/urban split is the differentiation the realm wanted all along.
 *
 * FINITE SEMANTICS (the standing law): every dial here is a CLOSED AUTHORED TABLE
 * keyed by a finite vocabulary (the six tiers, the seven terrains) or a named band.
 * No caller passes a float in; no surface shows one.
 *
 * Pure leaf: no store, no React, no clock, no randomness, no I/O. Imported by
 * demographicsKernel.js (the ONE writer) and by its pins.
 *
 * @enforced-by tests/domain/demographicsRates.test.js,
 *   tests/domain/demographicsKernel.test.js, tests/domain/demographicsCure.test.js
 */

import { clamp, clamp01 } from '../../kernel/math.js';
import { POPULATION_RANGES, TIER_ORDER } from '../../data/constants.js';
import { foodLedger } from '../foodLedger.js';
import { resolveTerrain } from '../resolveTerrain.js';
import { routeLifecycleActive } from './routeNetworkLedger.js';
import { interdictableArteries } from './routeNetworkConsumersInterdiction.js';
// WAVE P3 — what a completed plan left behind. A zero-import leaf on purpose: the
// works read must not close the rates -> plans -> pushPull -> rates loop, so the
// ledger's name and the effect arithmetic live in their own single writer.
import { importFactorOf, infrastructureFactorOf } from './demographicsWorks.js';

/** @typedef {{ tier?: string, terrainType?: string, terrainOverride?: string, terrain?: string }} DemoConfig */
/**
 * @typedef {Object} DemoSettlement
 * @property {number} [population]
 * @property {string} [tier]
 * @property {string} [name]
 * @property {DemoConfig} [config]
 * @property {string} [terrain]
 * @property {{ foodSecurity?: unknown }} [economicState]
 * @property {Array<Record<string, unknown>>} [populationHistory]
 * @property {Array<Record<string, unknown>>} [activeConditions] WAVE P4: the world's
 *   crises, read here as PRESENCE by class exactly as the legacy decline lane read them.
 */
/** @typedef {{ from?: string, to?: string, kind?: string, magnitude?: number }} DemoObligation */

/** @param {unknown} v @param {number} fallback @returns {number} */
function num(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

// ── THE DORMANCY GATE — a virtual, defensively-read flag (no serialized default) ──
/**
 * Is the demographic engine LIT? Reads simulationRules.demographicsEnabled === true,
 * defensively. ABSENT ⇒ false ⇒ DORMANT ⇒ every entry point is an immediate no-op
 * returning the SAME references (byte-identical by object identity). The key is
 * declared FALSE in the full_simulation preset so the subsystem-certification
 * totality walker can census it, exactly as npcConsequencesEnabled /
 * routeLifecycleEnabled / magicEconomyEnabled / informationBrokeragesEnabled are.
 * Mirrors settlementLifecycleActive.
 * @param {{ simulationRules?: unknown }|null|undefined} worldState
 * @returns {boolean}
 */
export function demographicsActive(worldState) {
  const rules = asObject(asObject(worldState).simulationRules);
  return rules.demographicsEnabled === true;
}

/** The tier a settlement is read at, always a member of TIER_ORDER. @param {DemoSettlement|null|undefined} s */
function tierOf(s) {
  const raw = String(asObject(s).tier || asObject(asObject(s).config).tier || '');
  return TIER_ORDER.includes(raw) ? raw : 'village';
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE AUTHORED TABLES (design §10 — every one of these is tuning-pass property,
// owner-signed at the soak redo per THE PROMISE. None is a bare float on a surface.)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * MOUTHS FED PER UNIT OF DAILY FOOD PRODUCTION, by tier.
 *
 * The generator's food physics denominate production in daily units against a
 * PER_CAPITA_NEED of 2 (generators/economy/foodBalance.js), so the neutral conversion
 * is 0.5 mouths per unit. The table shades that by tier for the overheads a bigger
 * place pays on the same grain: carting, spoilage, tolls, and the fraction of the
 * population that is not near a field. A thorp eats what it grows; a metropolis loses
 * an eighth of it on the way to the table.
 * @type {Readonly<Record<string, number>>}
 */
export const MOUTHS_PER_FOOD_UNIT = Object.freeze({
  thorp: 0.55,
  hamlet: 0.54,
  village: 0.52,
  town: 0.50,
  city: 0.47,
  metropolis: 0.44,
});

/**
 * THE DENSITY CEILING BY TIER, before terrain — how many people can FIT.
 *
 * Set at roughly 1.4x each tier's population band maximum (POPULATION_RANGES) so a
 * settlement can fill its band and earn a promotion instead of being held under it by
 * its own ceiling. METROPOLIS IS INCLUDED and is the design's point: the top of the
 * ladder has a wall, and P2's overflow lane plus P3's migration are the only valves
 * above it.
 * @type {Readonly<Record<string, number>>}
 */
export const DENSITY_CEILINGS = Object.freeze({
  thorp: 90,
  hamlet: 600,
  village: 1400,
  town: 7500,
  city: 38000,
  metropolis: 140000,
});

/**
 * TERRAIN ADJUSTMENT on the density ceiling — a mountain terrace holds fewer than a
 * plain. Keyed by the canonical terrain vocabulary resolveTerrain.js publishes
 * (plains | hills | forest | riverside | coastal | mountain | desert); an unresolved
 * terrain reads as 1 (no adjustment), never as a hole.
 *
 * P5a puts the waterless desert ON the public-works interlock without making it less
 * harsh than mountain ground. 0.55 is the minimal two-decimal factor for which all
 * five tier-promotion pairs clear at the maximum infrastructure factor (1.24); 0.54
 * still strands the thorp below the hamlet floor. Thus a desert settlement can build
 * its cisterns and caravanserais all the way up the ladder, but only at maximum works.
 * @type {Readonly<Record<string, number>>}
 */
export const TERRAIN_DENSITY_ADJUST = Object.freeze({
  plains: 1.15,
  riverside: 1.20,
  coastal: 1.10,
  hills: 0.90,
  forest: 0.85,
  mountain: 0.60,
  desert: 0.55,
});

/**
 * THE BIRTH BAND by tier, as a per-tick (weekly) fraction of the head count. Rural
 * fertility runs ahead of urban: the thorp band is a crude annual rate near 4.8
 * percent of the head count, the metropolis band near 4.2.
 * @type {Readonly<Record<string, number>>}
 */
export const BIRTH_BANDS = Object.freeze({
  thorp: 0.00092,
  hamlet: 0.00090,
  village: 0.00088,
  town: 0.00085,
  city: 0.00082,
  metropolis: 0.00080,
});

/**
 * NATURAL MORTALITY by tier — THE DEATH BAND'S GUARANTEED NONZERO FLOOR (J-P2: even
 * paradise ages). Old age and the likes, unlike named NPCs (law 3). It rises with
 * tier because the pre-modern city is a graveyard: density, water, and strangers.
 *
 * Every entry is strictly BELOW its BIRTH_BANDS sibling, so a settlement at zero
 * pressure still grows (between 0.5 and 2.1 percent a year by tier) and it is the
 * pressure terms, never a clamp, that stop it.
 * @type {Readonly<Record<string, number>>}
 */
export const NATURAL_DEATH_BANDS = Object.freeze({
  thorp: 0.00052,
  hamlet: 0.00054,
  village: 0.00057,
  town: 0.00060,
  city: 0.00065,
  metropolis: 0.00070,
});

/**
 * THE SHAPE CONSTANTS of the two pressure responses, and the import/obligation bands.
 * Documented, owner-retunable at the soak redo.
 */
export const DEMOGRAPHIC_TUNING = Object.freeze({
  // Crowding suppresses births only ABOVE the ease point: a half-empty valley has no
  // reason to have fewer children. Between the ease point and the bound the birth
  // band falls away by up to SUPPRESSION_MAX.
  BIRTH_EASE: 0.75,
  BIRTH_SUPPRESSION_MAX: 0.90,
  // Crowding raises deaths above its own, earlier ease point (packed quarters kill
  // before they stop births), by GAIN per unit of strain, with the strain itself
  // capped so an overshoot cannot mint an unbounded mortality.
  DEATH_EASE: 0.70,
  DEATH_PRESSURE_GAIN: 2.0,
  DEATH_STRAIN_CAP: 1.30,
  // A food deficit is the other half of the death side. The generator's effective
  // deficit is a percentage of unmet need (foodStockpile keeps it live per tick), so
  // a town at half its need runs mortality at 2.5x its natural floor.
  DEATH_DEFICIT_GAIN: 3.0,
  // ── WAVE P4, THE RECONCILIATION (§11 P4; the decline term and the death term) ──
  // THE WORLD'S CRISES ARRIVE HERE AND NOWHERE ELSE when the engine is lit. A crisis
  // kills through the same channel crowding does — contagion, competition for the same
  // grain, exposure, a watch too thin to keep order — so it presses in proportion to
  // HOW FULL THE PLACE IS, and that occupancy scaling is what gives the composite a
  // FIXED POINT: as a pressed settlement empties, its crises stop being lethal, and
  // somewhere above zero the birth band catches the death band. The floor is therefore
  // set by the settlement's own capacity and its own hunger, never by a constant.
  // THE GAIN IS NOT A NEW DIAL. At the bound, full crisis, the composite sheds at
  // -13.4%/yr against the legacy decline lane's measured -13.0%/yr expectation: the
  // severity the world was tuned around is preserved and only the floor is added.
  DEATH_CRISIS_GAIN: 3.0,
  // The pressure READ is clamped to [0, 2] (design §2). Nothing clamps a population.
  PRESSURE_MAX: 2,
  // THE LIVE-ARTERY BANDS. When the route network is lit, the generated import
  // channel is modulated by how many goods arteries actually reach the settlement:
  // index by min(arteryCount, 3). Zero live arteries does NOT zero imports — the
  // generator's own model grants an isolated place expensive irregular traffic
  // (FOOD_IMPORT_RATES.minorRoutes), and this band is that trickle. Cutting an
  // artery moves the count down a band, imports fall, K falls, and the mortality and
  // pressure terms below rise: siege by starvation is this line, not a feature.
  ARTERY_IMPORT_FACTORS: Object.freeze([0.25, 0.70, 1.00, 1.15]),
  // STANDING RELIEF DRAW. A settlement that is the live CREDITOR on grain-relief
  // obligations is a standing granary for somebody else, and that grain leaves.
  // Banded by obligation count (index min(count, 3)) as a fraction of LOCAL
  // production, so the term can never exceed a tenth of what the fields make.
  OBLIGATION_DRAW_FRACTIONS: Object.freeze([0, 0.04, 0.07, 0.10]),
  // No settlement's density ceiling may read below a thorp's floor: a terrain
  // adjustment is a modifier, never an eviction notice.
  MIN_DENSITY_CEILING: 24,
});

/**
 * THE CRISIS MORTALITY WEIGHTS — the legacy decline lane's OWN monthly penalties
 * (populationDynamics.js populationPressureRate: food -0.013, disease -0.020, war
 * -0.016, burden -0.006), re-expressed as a 0..1 severity against the largest of them.
 * A RE-EXPRESSION, not a re-invention: the relative severities the world was already
 * tuned around are preserved exactly and only the CHANNEL changes, from a lane with no
 * bound to the death term that has one.
 * @type {Readonly<Record<string, number>>}
 */
export const CRISIS_MORTALITY_WEIGHTS = Object.freeze({
  food: 0.65,
  disease: 1,
  war: 0.8,
  burden: 0.3,
});

/**
 * WHICH CRISIS CLASS EACH CONDITION ARCHETYPE BELONGS TO. Mirrors the four crisis sets
 * in populationDynamics.js, which stays the owner of the legacy vocabulary (its sets
 * still drive the emigration gate and the whole dark path). The two spellings cannot
 * drift: tests/domain/demographicsRates.test.js walks both and reds by name if either
 * grows a member the other does not carry.
 * @type {Readonly<Record<string, string>>}
 */
export const CRISIS_ARCHETYPE_CLASSES = Object.freeze({
  famine: 'food',
  food_anchor_lost: 'food',
  regional_import_shortage: 'food',
  plague: 'disease',
  war_pressure: 'war',
  vassal_extraction: 'war',
  war_drain: 'war',
  occupation_resistance: 'war',
  occupation_burden: 'war',
  alliance_burden: 'burden',
  regional_protection_gap: 'burden',
  relief_burden: 'burden',
});

/**
 * A DM-authored `custom_crisis` carries no mapped archetype, so it speaks through the
 * catalog systems it declares — the same fallback populationDynamics' hasConditionSignal
 * uses, keyed by the identical three system labels.
 * @type {Readonly<Record<string, string>>}
 */
const CRISIS_SYSTEM_CLASSES = Object.freeze({
  food_security: 'food',
  healing_capacity: 'disease',
  defense_readiness: 'war',
});

/** The closed BIRTH band vocabulary, ordered thinnest first. @type {ReadonlyArray<string>} */
export const BIRTH_BAND_WORDS = Object.freeze(['scarce', 'thin', 'steady', 'fruitful']);
/** The closed DEATH band vocabulary, ordered lightest first. There is no band below
 *  `ordinary`, because natural mortality is the floor and nothing goes under it. */
export const DEATH_BAND_WORDS = Object.freeze(['ordinary', 'heavy', 'grievous']);
/** The closed BINDING vocabulary — which of the two bounds is the wall. */
export const BINDING_KINDS = Object.freeze(['granary', 'walls']);
/** The closed IMPORT-SOURCE vocabulary for the receipt. */
export const IMPORT_SOURCES = Object.freeze(['routes', 'generated', 'none']);

// ═══════════════════════════════════════════════════════════════════════════════
// THE TUNING SIGNATURE SURFACE (CAPACITY C1)
// ═══════════════════════════════════════════════════════════════════════════════
/**
 * WHY A SIGNATURE SURFACE LIVES IN THIS FILE AND NOT IN A LEAF OF ITS OWN.
 *
 * THE PROMISE is constitutional: a tuning value is the owner's, signed last. The
 * demographic family spends its dials across thirteen files, so "who signed these
 * numbers" had no address at all. This roster is that address. It moves no value and
 * it signs nothing; it names what signing would sign, and it records the two acts
 * that are not the lane's to take.
 *
 * A THIN ROSTER HERE, over relocating ten tables into one surface file, and over a
 * new `demographicsTuningSurface.js` leaf. The tables stay in their ten homes because
 * this file alone has nineteen importers and a relocation moves every one of them for
 * ninety bytes of record; a new leaf would owe the new-leaf censuses for the same
 * ninety bytes. Vetoable: the veto is the relocation.
 *
 * ⭐⭐ THE ORDER IS LIGHT-DECLARED-THEN-SIGN, AND IT IS THE INVERSE OF THE ORDER THE
 * DESIGN WAS BUILT IN. The sibling faith and density surfaces carry `{ signed, live }`
 * and once read `signed && live`: nothing lit until the owner signed. The owner's word
 * of 2026-09-02 ("light everything up before the exhaustive review") lights this term
 * BEFORE its values are signed, so a `lit ⇒ signed` law would red the lighting itself.
 * The word here is therefore `lit`, and it holds a LIGHTING RECORD rather than a
 * boolean: a preset may light this term only in the same commit that writes down who
 * lit it, on what date, under which row, and which presets moved.
 *
 * WHAT IS UNCONSTRUCTIBLE, STILL: a lit surface calling itself signed. `lit` and
 * `signed` are separate words and no derivation reads one from the other.
 *
 * @enforced-by tests/domain/demographicsRates.test.js
 */

/**
 * @typedef {Object} DemographicLightingRecord
 * @property {string} odqRow      the owner-decision row that lit the term
 * @property {string} litOn       the date of the lighting commit
 * @property {ReadonlyArray<string>} presets  every shipped preset the flip moved, exact
 */

/**
 * THE SIGNATURE RECORD. Two words, both at their unlit, unsigned rest state.
 *
 * `signed` is the pen's and moves ONLY in the tuning sitting's own diff. `lit` is the
 * LIGHTING WAVE's and moves ONLY in the same commit that flips the presets, from
 * `null` to a `DemographicLightingRecord`. Neither word is derived from the other.
 * @type {Readonly<{ signed: boolean, lit: DemographicLightingRecord|null }>}
 */
export const DEMOGRAPHIC_TUNING_SIGNATURE = Object.freeze({ signed: false, lit: null });

/**
 * @typedef {Object} DemographicTuningProvenance
 * @property {string} status
 * @property {string|null} signedBy
 * @property {string|null} odqRow
 * @property {string|null} signedOn
 * @property {string} ritual
 * @property {string} coverage
 */

/**
 * WHO SIGNED THESE NUMBERS, AND HOW ONE WOULD. Today: nobody, and the record says so
 * in words rather than by an empty field a reader has to interpret.
 * @type {DemographicTuningProvenance}
 */
export const DEMOGRAPHIC_TUNING_PROVENANCE = Object.freeze({
  status: 'CANDIDATE, OWNER-UNSIGNED (wave P landed the values as the lane\'s claim, not the owner\'s word)',
  signedBy: null,
  odqRow: null,
  signedOn: null,
  ritual: 'To light: the lighting wave flips demographicsEnabled in every shipped preset and'
    + ' writes lit {odqRow, litOn, presets} here in the same commit, as a declared shift.'
    + ' To sign: set signed true and write signedBy, odqRow and signedOn here in one diff at'
    + ' the tuning sitting. The register walker refuses a lit preset with no lighting record.',
  coverage: 'DEMOGRAPHIC_TUNING_COVERAGE below is the roster: every frozen numeric export of'
    + ' the demographic family, plus the one congestion dial the family reads from the legacy'
    + ' migration lane, plus the eight closed vocabularies the receipt and the reading speak.',
});

/**
 * @typedef {Object} DemographicTuningCoverageRow
 * @property {'tunable'|'vocabulary'} kind
 * @property {string} id     `<repo-relative file>#<exportName>[.<key>]`
 * @property {string|null} unit  a word of the register's closed unit vocabulary; null for a vocabulary row
 * @property {string} note
 */

/**
 * WHAT SIGNING WOULD SIGN. Held to the tree BOTH WAYS by the roster arm: a numeric
 * export added to the family without a row here reds, and a row naming a dead export
 * reds too.
 *
 * ⚠ THE TWO DELIBERATE EXCLUSIONS, NAMED RATHER THAN SILENT. `demographicsObservation.js`
 * exports `REALM_DEMOGRAPHY_VERSION`, which is a SCHEMA version and not a dial: signing
 * it would be the finite-semantics error of treating a shape marker as a quantity. And
 * `migrationKernel.js` carries `MIGRATION_KERNEL_TUNING` and `MIGRATION_TUNING`, which
 * are the legacy migration lane's own estate; only the ONE congestion dial the demographic
 * bound feeds is rostered here, by its real home.
 * @type {ReadonlyArray<DemographicTuningCoverageRow>}
 */
export const DEMOGRAPHIC_TUNING_COVERAGE = Object.freeze(/** @type {ReadonlyArray<DemographicTuningCoverageRow>} */ ([
  // ── the rates file: the bound, the two rate bands, and the crisis weights ──
  Object.freeze({ kind: 'tunable', id: 'src/domain/worldPulse/demographicsRates.js#MOUTHS_PER_FOOD_UNIT', unit: 'mouths', note: 'How many mouths one daily food unit feeds, per tier. The K_food converter.' }),
  Object.freeze({ kind: 'tunable', id: 'src/domain/worldPulse/demographicsRates.js#DENSITY_CEILINGS', unit: 'people', note: 'D_tier: how many can FIT, before terrain and infrastructure adjust it.' }),
  Object.freeze({ kind: 'tunable', id: 'src/domain/worldPulse/demographicsRates.js#TERRAIN_DENSITY_ADJUST', unit: 'multiplier', note: 'What the ground does to the density ceiling, per terrain.' }),
  Object.freeze({ kind: 'tunable', id: 'src/domain/worldPulse/demographicsRates.js#BIRTH_BANDS', unit: 'fraction01', note: 'The unsuppressed birth rate per tick, per tier.' }),
  Object.freeze({ kind: 'tunable', id: 'src/domain/worldPulse/demographicsRates.js#NATURAL_DEATH_BANDS', unit: 'fraction01', note: 'The natural mortality floor per tick, per tier. It exists at zero pressure forever.' }),
  Object.freeze({ kind: 'tunable', id: 'src/domain/worldPulse/demographicsRates.js#DEMOGRAPHIC_TUNING', unit: 'mixed', note: 'The eases, gains and caps that place the fixed point between 76 and 83 percent of the bound. The single most consequential row in this roster.' }),
  Object.freeze({ kind: 'tunable', id: 'src/domain/worldPulse/demographicsRates.js#CRISIS_MORTALITY_WEIGHTS', unit: 'fraction01', note: 'How much each crisis class weighs into the death side.' }),
  // ── the Herald: the floors a reading crosses before anything is said ──
  Object.freeze({ kind: 'tunable', id: 'src/domain/worldPulse/demographicsHerald.js#HERALD_TUNING', unit: 'mixed', note: 'The hunger, departure and crowding floors, and the crowding severities and scores.' }),
  Object.freeze({ kind: 'tunable', id: 'src/domain/worldPulse/demographicsHerald.js#QUANTITY_BANDS', unit: 'people', note: 'The seven head-count ceilings the Herald speaks a number through. UNSUFFIXED, so the _TUNING glob cannot see it: this row is why the roster is read from the tree rather than from the glob.' }),
  // ── push and pull ──
  Object.freeze({ kind: 'tunable', id: 'src/domain/worldPulse/demographicsPushPull.js#PUSH_DRIVER_BANDS', unit: 'fraction01', note: 'Per driver: the ease and full anchors, the blend weight, and the crisis anchor.' }),
  Object.freeze({ kind: 'tunable', id: 'src/domain/worldPulse/demographicsPushPull.js#PUSH_PULL_TUNING', unit: 'mixed', note: 'The push/pull blend dials.' }),
  // ── the overflow ladder and its responses ──
  Object.freeze({ kind: 'tunable', id: 'src/domain/worldPulse/demographicsResponses.js#OVERFLOW_THRESHOLDS', unit: 'fraction01', note: 'Where filling, pressed and overflowing open on pressure01. The crowding line crosses these.' }),
  Object.freeze({ kind: 'tunable', id: 'src/domain/worldPulse/demographicsResponses.js#RESPONSE_WEIGHTS', unit: 'fraction01', note: 'What each response weighs its evidence at.' }),
  Object.freeze({ kind: 'tunable', id: 'src/domain/worldPulse/demographicsResponses.js#RESPONSE_TUNING', unit: 'mixed', note: 'The response selection dials.' }),
  // ── the plans, the works, the ladder, the land ──
  Object.freeze({ kind: 'tunable', id: 'src/domain/worldPulse/demographicsPlans.js#PLAN_TUNING', unit: 'mixed', note: 'Plan opening, holding and closing.' }),
  Object.freeze({ kind: 'tunable', id: 'src/domain/worldPulse/demographicsWorks.js#WORKS_TUNING', unit: 'mixed', note: 'What a completed work buys: imports, infrastructure, emigration.' }),
  Object.freeze({ kind: 'tunable', id: 'src/domain/worldPulse/demographicsLadder.js#LADDER_TUNING', unit: 'mixed', note: 'The viability ladder dials. ⚠ The export name collides with npcLadderState.js#LADDER_TUNING, which is why every id here is a file-and-export pair rather than a bare name.' }),
  Object.freeze({ kind: 'tunable', id: 'src/domain/worldPulse/demographicsLand.js#SPATIAL_LAW_TUNING', unit: 'mixed', note: 'The placement law dials.' }),
  Object.freeze({ kind: 'tunable', id: 'src/domain/worldPulse/demographicsLand.js#TIER_ELBOW', unit: 'fraction01', note: 'Where each tier elbows on the land curve. UNSUFFIXED.' }),
  Object.freeze({ kind: 'tunable', id: 'src/domain/worldPulse/demographicsLand.js#MIN_SEPARATION_BANDS', unit: 'fraction01', note: 'The tier-by-tier minimum separation matrix. UNSUFFIXED.' }),
  Object.freeze({ kind: 'tunable', id: 'src/domain/worldPulse/demographicsRisk.js#RISK_TUNING', unit: 'mixed', note: 'Crowding as a condition, with sanitation and traffic as accelerants on it.' }),
  Object.freeze({ kind: 'tunable', id: 'src/domain/worldPulse/demographicsWar.js#WAR_DEMOGRAPHIC_TUNING', unit: 'mixed', note: 'Motive and capability, and what a court believes about a neighbour\'s grain.' }),
  // ── the one dial outside the family, by its REAL home ──
  Object.freeze({
    kind: 'tunable',
    id: 'src/domain/spatial/migration.js#MIGRATION_TUNING.CONGEST_DECAY',
    unit: 'fraction01',
    note: 'How much of a hub\'s richness gravity saturation takes away. It is rostered here because'
      + ' the lit demographic bound becomes its pressure denominator, so signing the bound without'
      + ' re-reading this dial signs half a coupling.'
      + ' ⚠ HOME CORRECTED BY MEASUREMENT: the design volume homes this dial at'
      + ' migrationKernel.js#MIGRATION_KERNEL_TUNING.CONGEST_DECAY, and no such export exists at'
      + ' any tip. The value 0.85 lives here, and the citation is fixed rather than copied.',
  }),
  // ── the eight closed vocabularies the receipt and the reading speak ──
  Object.freeze({ kind: 'vocabulary', id: 'src/domain/worldPulse/demographicsRates.js#BIRTH_BAND_WORDS', unit: null, note: 'The four birth words, thinnest first.' }),
  Object.freeze({ kind: 'vocabulary', id: 'src/domain/worldPulse/demographicsRates.js#DEATH_BAND_WORDS', unit: null, note: 'The three death words. There is no band below ordinary.' }),
  Object.freeze({ kind: 'vocabulary', id: 'src/domain/worldPulse/demographicsRates.js#BINDING_KINDS', unit: null, note: 'Which of the two bounds is the wall.' }),
  Object.freeze({ kind: 'vocabulary', id: 'src/domain/worldPulse/demographicsRates.js#IMPORT_SOURCES', unit: null, note: 'Where the import side of K_food came from.' }),
  Object.freeze({ kind: 'vocabulary', id: 'src/domain/worldPulse/demographicsPushPull.js#FOOD_FLOW_BANDS', unit: null, note: 'The four food-flow words.' }),
  Object.freeze({ kind: 'vocabulary', id: 'src/domain/worldPulse/demographicsPushPull.js#RESERVE_BANDS', unit: null, note: 'The four reserve words.' }),
  Object.freeze({ kind: 'vocabulary', id: 'src/domain/worldPulse/demographicsPushPull.js#URBAN_LOAD_BANDS', unit: null, note: 'The four urban-load words.' }),
  Object.freeze({ kind: 'vocabulary', id: 'src/domain/worldPulse/demographicsResponses.js#OVERFLOW_BANDS', unit: null, note: 'The four overflow words the crowding line crosses and the reading reports.' }),
]));

const T = DEMOGRAPHIC_TUNING;

// ═══════════════════════════════════════════════════════════════════════════════
// THE DERIVATIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * How many live grain-relief obligations name this settlement as the CREDITOR.
 *
 * JUDGMENT (vetoable, recorded in the slice report): the design names this term
 * "obligations (exports under treaty)". No standing food-export treaty quantity
 * exists in the tree yet; the ONE live surface that says "this place feeds another
 * place on a standing arrangement" is the generosity obligation ledger, whose
 * `grain_relief` records carry the giver as `to`. P1 reads that, banded and capped at
 * a tenth of local production. VETO drops the term to zero until trade agreements
 * land a real export quantity (P2/P3 own that surface).
 *
 * @param {{ spatialLedgers?: unknown }|null|undefined} worldState
 * @param {string} settlementId
 * @returns {number}
 */
export function reliefCreditorCount(worldState, settlementId) {
  const ledger = asObject(asObject(asObject(worldState).spatialLedgers).obligations);
  const id = String(settlementId);
  let count = 0;
  for (const key of Object.keys(ledger).sort()) {
    const rec = /** @type {DemoObligation} */ (asObject(ledger[key]));
    if (String(rec.kind || '') !== 'grain_relief') continue;
    if (String(rec.to || '') !== id) continue;
    if (num(rec.magnitude, 0) <= 0) continue;
    count += 1;
  }
  return count;
}

/**
 * @typedef {Object} FoodCapacity
 * @property {boolean} present       the settlement carries real food physics to read
 * @property {number} mouths         K_food: local + imports - obligations, in mouths
 * @property {number} local          the fields' own contribution, in mouths
 * @property {number} imports        what the roads bring, in mouths
 * @property {number} obligations    what standing relief draws away, in mouths
 * @property {string} importSource   one of IMPORT_SOURCES
 * @property {number} arteries       live goods arteries counted (0 when unlit)
 * @property {number} mouthsPerUnit  the authored conversion this tier used
 */

/**
 * K_food — HOW MANY MOUTHS THIS PLACE CAN FEED (design §2). Derived every tick,
 * never stored (never-store-a-derivable).
 *
 * The production side is `economicState.foodSecurity.dailyProduction`, read through
 * the ONE food read-point (domain/foodLedger.js). That number is GENERATION-FROZEN:
 * the pulse's food mover (foodStockpile.js) rewrites storage, deficit, surplus and
 * resilience every tick but never touches dailyProduction or dailyNeed. That is
 * exactly what makes it a genuine ceiling rather than a function of the head count,
 * and it is why the runaway dies here: more people no longer mint more grain.
 *
 * K4's magic substitution rides in for free, at its own cap, because the substitution
 * channel already lands on the same food ledger this reads.
 *
 * A settlement with NO food physics (an un-generated or partial fixture) returns
 * present:false and zero mouths; the caller then lets D_tier bind alone rather than
 * pretending the place can feed nobody.
 *
 * @param {DemoSettlement|null|undefined} settlement
 * @param {{ spatialLedgers?: unknown, simulationRules?: unknown }|null|undefined} worldState
 * @param {string} settlementId
 * @returns {FoodCapacity}
 */
export function foodCapacityOf(settlement, worldState, settlementId) {
  const tier = tierOf(settlement);
  const mouthsPerUnit = num(/** @type {Record<string, number>} */ (MOUTHS_PER_FOOD_UNIT)[tier], 0.5);
  const ledger = foodLedger(/** @type {Parameters<typeof foodLedger>[0]} */ (settlement));
  if (!ledger.present) {
    return {
      present: false, mouths: 0, local: 0, imports: 0, obligations: 0,
      importSource: 'none', arteries: 0, mouthsPerUnit,
    };
  }
  const local = Math.max(0, Math.floor(ledger.dailyProduction * mouthsPerUnit));

  // ── THE IMPORT SIDE. The generated import channel (what share of need the roads
  // were built to cover) modulated by the LIVE artery count when the route network
  // is lit. Dark route network ⇒ factor 1 ⇒ the generated channel verbatim.
  const routesLit = routeLifecycleActive(/** @type {Record<string, unknown>} */ (asObject(worldState)));
  const arteries = routesLit
    ? interdictableArteries({
      worldState: /** @type {Record<string, unknown>} */ (asObject(worldState)),
      targetId: String(settlementId),
    }).length
    : 0;
  const factors = /** @type {ReadonlyArray<number>} */ (T.ARTERY_IMPORT_FACTORS);
  const arteryFactor = routesLit ? num(factors[Math.min(arteries, factors.length - 1)], 1) : 1;
  // WAVE P3: a completed IMPORTS plan is a standing arrangement, and it raises the
  // IMPORT side only. Law 2 says food is the cap; a treaty does not make a field, so
  // `local` above is untouched and a settlement can never buy its way past its own
  // ground. Absent works ⇒ factor 1 ⇒ P1's number verbatim.
  const importUnits = ledger.dailyNeed * clamp01(ledger.importDependency) * arteryFactor
    * importFactorOf(/** @type {Record<string, unknown>} */ (asObject(worldState)), String(settlementId));
  const imports = Math.max(0, Math.floor(importUnits * mouthsPerUnit));

  // ── THE OBLIGATION SIDE, banded and capped against LOCAL production.
  const draws = /** @type {ReadonlyArray<number>} */ (T.OBLIGATION_DRAW_FRACTIONS);
  const creditors = reliefCreditorCount(worldState, settlementId);
  const drawFraction = num(draws[Math.min(creditors, draws.length - 1)], 0);
  const obligations = Math.max(0, Math.floor(local * drawFraction));

  return {
    present: true,
    mouths: Math.max(0, local + imports - obligations),
    local,
    imports,
    obligations,
    importSource: routesLit ? 'routes' : 'generated',
    arteries,
    mouthsPerUnit,
  };
}

/**
 * D_tier — HOW MANY CAN FIT (design §2). The authored per-tier ceiling, adjusted by
 * the settlement's terrain through the ONE terrain read. METROPOLIS INCLUDED.
 *
 * WAVE P3 ADDS THE PUBLIC WORKS, and adds them OPTIONALLY. The two extra arguments
 * are absent-tolerated on purpose: every pre-P3 call site passes one argument and
 * gets the authored ceiling back verbatim, and a settlement that has completed no
 * infrastructure plan reads the same number with all three. A finished aqueduct
 * raises how many may be HOUSED and mints nobody, so law 4 is untouched — acceptance
 * claim 3's "capacity expansion produces RENEWED bounded growth" is this line, and
 * the rates then take the settlement there at their own speed.
 * @param {DemoSettlement|null|undefined} settlement
 * @param {Record<string, unknown>|null} [worldState] omit ⇒ no works are read
 * @param {string} [settlementId]
 * @returns {number}
 */
export function densityCeilingOf(settlement, worldState = null, settlementId = '') {
  const tier = tierOf(settlement);
  const base = num(/** @type {Record<string, number>} */ (DENSITY_CEILINGS)[tier], DENSITY_CEILINGS.village);
  const s = asObject(settlement);
  const terrain = resolveTerrain(/** @type {Parameters<typeof resolveTerrain>[0]} */ (s.config))
    || (typeof s.terrain === 'string' && s.terrain !== 'auto' ? s.terrain : null);
  const adjust = num(/** @type {Record<string, number>} */ (TERRAIN_DENSITY_ADJUST)[String(terrain || '')], 1);
  const works = worldState && settlementId ? infrastructureFactorOf(worldState, settlementId) : 1;
  return Math.max(T.MIN_DENSITY_CEILING, Math.round(base * adjust * works));
}

/**
 * @typedef {Object} EffectiveBound
 * @property {number} bound        min(K_food, D_tier), or D_tier alone when food is unknown
 * @property {string} binding      one of BINDING_KINDS
 * @property {number} foodCapacity K_food (0 when unknown)
 * @property {number} densityCeiling D_tier
 * @property {boolean} foodKnown
 */

/**
 * THE EFFECTIVE BOUND and WHICH WALL IT IS (law 2 / J-P1). A tie reads as the
 * granary, because food is the cap and density is the rate.
 * @param {FoodCapacity} food
 * @param {number} densityCeiling
 * @returns {EffectiveBound}
 */
export function effectiveBoundOf(food, densityCeiling) {
  const dTier = Math.max(1, Math.round(num(densityCeiling, 1)));
  if (!food || food.present !== true) {
    return { bound: dTier, binding: 'walls', foodCapacity: 0, densityCeiling: dTier, foodKnown: false };
  }
  const kFood = Math.max(0, Math.round(num(food.mouths, 0)));
  return {
    bound: Math.max(1, Math.min(kFood, dTier)),
    binding: kFood <= dTier ? 'granary' : 'walls',
    foodCapacity: kFood,
    densityCeiling: dTier,
    foodKnown: true,
  };
}

/**
 * pressure01 = population / min(K_food, D_tier), clamped to [0, PRESSURE_MAX] for the
 * READ. The population itself is never clamped (J-P5: brief overshoot is famine lag,
 * and it is narratable).
 * @param {number} population @param {number} bound @returns {number}
 */
export function pressureOf(population, bound) {
  const pop = Math.max(0, num(population, 0));
  return clamp(pop / Math.max(1, num(bound, 1)), 0, T.PRESSURE_MAX);
}

/** @param {number} birth01 @param {number} band01 @returns {string} */
function birthBandWord(birth01, band01) {
  const ratio = band01 > 0 ? birth01 / band01 : 0;
  if (ratio >= 0.95) return 'fruitful';
  if (ratio >= 0.60) return 'steady';
  if (ratio >= 0.25) return 'thin';
  return 'scarce';
}

/** @param {number} death01 @param {number} floor01 @returns {string} */
function deathBandWord(death01, floor01) {
  const ratio = floor01 > 0 ? death01 / floor01 : 1;
  if (ratio >= 2.5) return 'grievous';
  if (ratio >= 1.25) return 'heavy';
  return 'ordinary';
}

/**
 * @typedef {Object} DemographicRates
 * @property {number} birth01     per-tick birth fraction of the head count
 * @property {number} death01     per-tick death fraction of the drawable pool
 * @property {number} birthFloor01 the authored band before suppression
 * @property {number} deathFloor01 NATURAL MORTALITY: the guaranteed nonzero floor
 * @property {string} birthBand   one of BIRTH_BAND_WORDS
 * @property {string} deathBand   one of DEATH_BAND_WORDS
 * @property {number} deficit01   the food deficit the death side answered
 * @property {number} crisis01    WAVE P4: the world's crises, as the death side saw them
 */

/**
 * THE RATES (design §2). Birth from the birth band modulated DOWN by pressure
 * (crowding suppresses); death from the death band modulated UP by pressure and by
 * food deficit, on top of a floor that never reaches zero.
 *
 * NATURAL MORTALITY IS THE FLOOR, NOT A TERM (J-P2). death01 is the floor times a
 * multiplier that is at least 1, so no combination of inputs anywhere in the engine
 * can produce a deathless settlement. That is the single property whose absence let
 * a town reach 29 trillion people.
 *
 * @param {{ settlement?: DemoSettlement|null, pressure01?: number, deficit01?: number,
 *   crisis01?: number }} input
 * @returns {DemographicRates}
 */
export function demographicRates(input) {
  const settlement = input && input.settlement ? input.settlement : null;
  const tier = tierOf(settlement);
  const birthFloor01 = num(/** @type {Record<string, number>} */ (BIRTH_BANDS)[tier], BIRTH_BANDS.village);
  const deathFloor01 = num(/** @type {Record<string, number>} */ (NATURAL_DEATH_BANDS)[tier], NATURAL_DEATH_BANDS.village);
  const pressure = clamp(num(input && input.pressure01, 0), 0, T.PRESSURE_MAX);
  const deficit01 = clamp01(num(input && input.deficit01, 0));
  // WAVE P4. ABSENT ⇒ 0 ⇒ the multiplier below is the same float expression in the same
  // order it always was, so every pre-P4 caller and every pin reads byte-identically.
  const crisis01 = clamp01(num(input && input.crisis01, 0));

  // Crowding suppresses births above the ease point and not before it.
  const crowding = clamp01((pressure - T.BIRTH_EASE) / Math.max(1e-9, 1 - T.BIRTH_EASE));
  const birth01 = Math.max(0, birthFloor01 * (1 - T.BIRTH_SUPPRESSION_MAX * crowding));

  // Strain raises deaths above its own, earlier ease point; the deficit adds on top.
  // WAVE P4 adds the world's crises as the THIRD rise, scaled by OCCUPANCY (how full the
  // place is, capped at its own bound) — the term that makes the composite converge to a
  // capacity-derived floor instead of ratcheting toward zero. Below the ease points the
  // fixed point solves to (birth/death - 1 - DEFICIT_GAIN x deficit) / (CRISIS_GAIN x
  // crisis) of the bound, so it MOVES with capacity, hunger and how hard the world is
  // pressing, and it VANISHES once hunger alone outruns the tier's bands.
  const strain = clamp(pressure - T.DEATH_EASE, 0, T.DEATH_STRAIN_CAP);
  const occupancy = Math.min(1, pressure);
  const multiplier = 1 + T.DEATH_PRESSURE_GAIN * strain + T.DEATH_DEFICIT_GAIN * deficit01
    + T.DEATH_CRISIS_GAIN * crisis01 * occupancy;
  const death01 = deathFloor01 * Math.max(1, multiplier);

  return {
    birth01,
    death01,
    birthFloor01,
    deathFloor01,
    birthBand: birthBandWord(birth01, birthFloor01),
    deathBand: deathBandWord(death01, deathFloor01),
    deficit01,
    crisis01,
  };
}

/**
 * The live food deficit the death side answers, as a 0..1 fraction of need. Read
 * through the ONE food read-point so the demographic lane and the granary lane can
 * never disagree about the deficit's sign or size.
 * @param {DemoSettlement|null|undefined} settlement @returns {number}
 */
export function foodDeficit01Of(settlement) {
  const ledger = foodLedger(/** @type {Parameters<typeof foodLedger>[0]} */ (settlement));
  return ledger.present ? clamp01(ledger.deficitPct / 100) : 0;
}

/**
 * THE DEFICIT AT WHICH HUNGER ALONE OUTRUNS THE TIER'S OWN BANDS — DERIVED, never
 * authored. demographicRates raises the death floor by DEATH_DEFICIT_GAIN times the
 * unmet-need fraction, so the deficit at which death01 first meets birth01 (at zero
 * crowding, zero crisis) solves to (birth / death - 1) / DEATH_DEFICIT_GAIN: 25.6% at
 * thorp scale down to 4.8% at metropolis scale, because a big place lives closer to its
 * own mortality floor and has less hunger to spare.
 *
 * BELOW IT a settlement can still feed itself back up; AT OR ABOVE IT there is no
 * positive fixed point at all and the place empties — which is the arm that keeps a
 * genuine catastrophe catastrophic. It is the engine's own answer, in its own tables,
 * to "how short is short enough to be a famine".
 * @param {DemoSettlement|null|undefined} settlement @returns {number}
 */
export function starvationDeficit01Of(settlement) {
  const tier = tierOf(settlement);
  const birth = num(/** @type {Record<string, number>} */ (BIRTH_BANDS)[tier], BIRTH_BANDS.village);
  const death = num(/** @type {Record<string, number>} */ (NATURAL_DEATH_BANDS)[tier], NATURAL_DEATH_BANDS.village);
  return Math.max(0, (birth / death - 1) / T.DEATH_DEFICIT_GAIN);
}

/**
 * R-C — WHAT THE CONSERVED LEDGER SAYS ABOUT A FOOD-CRISIS MARKER, 0..1.
 *
 * A `famine` condition is a NARRATIVE marker minted from the pressure index;
 * foodLedger.js is "the ONE read-point" for the conserved quantities. The rolling soak
 * found the two contradicting each other — a famine refreshed for twenty-seven straight
 * years on a settlement whose granaries could feed nine thousand more mouths than it had
 * people — and only the marker moved the population.
 *
 * THE ARBITER IS THE CLAIM: how much of what the granaries can feed is actually at the
 * table (population / K_food), measured against DEATH_EASE — the occupancy at which the
 * authored tables already say a place is crowded enough to start killing. At or above
 * that share the marker is fully corroborated and nothing here softens it; a settlement
 * claiming a seventh of its own granary reads 0.16 and cannot press its people to death
 * on a story. An ABSENT ledger is never evidence (tierViabilityOf's own law): it fails
 * OPEN at 1 and the legacy severity stands untouched.
 *
 * ⚠ WHY `deficitPct` IS NOT THE SECOND ARM, recorded so nobody re-adds it as an
 * oversight. It is TWICE unusable as an arbiter here, and both reasons are in the tree:
 *   • IT IS DENOMINATED AGAINST A GENERATION-FROZEN NEED. foodStockpile.js carries
 *     `baseDeficitPct` forward from generation and never re-reads the head count, so a
 *     settlement that has lost seven eighths of its people still books the same 5%
 *     "unmet need" it booked at full size. That frozen ratio is precisely the second
 *     food truth the soak caught contradicting the mouths reading.
 *   • IT IS DOWNSTREAM OF THE MARKER IT WOULD ARBITRATE. An emergent famine condition
 *     cuts production into `effectiveDeficit` in that same file, so a famine RAISES the
 *     deficit — a corroboration read through it would be the marker corroborating
 *     itself.
 * The deficit still reaches mortality directly, through DEATH_DEFICIT_GAIN, exactly as
 * it always did; it simply does not get a vote on whether the story is true. Making the
 * deficit population-relative is a real repair and belongs to the food lane, not here.
 * @param {DemoSettlement|null|undefined} settlement
 * @param {{ spatialLedgers?: unknown, simulationRules?: unknown }|null|undefined} worldState
 * @param {string} settlementId
 * @returns {number}
 */
export function foodCorroboration01(settlement, worldState, settlementId) {
  const food = foodCapacityOf(settlement, worldState, String(settlementId ?? ''));
  if (!food.present) return 1;
  const population = Math.max(0, num(asObject(settlement).population, 0));
  const claim = population / Math.max(1, food.mouths);
  return clamp01(claim / T.DEATH_EASE);
}

/**
 * THE CRISIS SIGNAL THE DEATH SIDE ANSWERS (WAVE P4, THE RECONCILIATION), 0..1.
 *
 * ONE CAUSE, ONE CHANNEL. Before P4 a pressured settlement was answered by BOTH the
 * legacy pressure-decline lane and this engine's death term, and the code said so in
 * writing. The decline lane read no bound of any kind, so under a sustained condition it
 * was a one-way ratchet with no fixed point; the measured consequence was a realm at 4%
 * of its start with nine thousand spare mouths of food. The lane now writes population
 * only as a conserved transfer (mass emigration) and hands its crisis signal here, where
 * the death multiplier already knows what the place can hold.
 *
 * Presence, not severity, exactly as the legacy lane read it: a condition either presses
 * or it does not, and the weight is the class's. The food class is the one the ledger
 * arbitrates (R-C above) — everything else is taken at face value, because no conserved
 * quantity in the tree can refute a plague or a war.
 * @param {{ settlement?: DemoSettlement|null, worldState?: unknown, settlementId?: string }} input
 * @returns {number}
 */
export function crisisStress01(input) {
  const settlement = input && input.settlement ? input.settlement : null;
  const raw = asObject(settlement).activeConditions;
  const conditions = Array.isArray(raw) ? raw : [];
  /** @type {Set<string>} */
  const classes = new Set();
  for (const entry of conditions) {
    const condition = asObject(entry);
    const archetype = String(condition.archetype || '');
    const mapped = /** @type {Record<string, string>} */ (CRISIS_ARCHETYPE_CLASSES)[archetype];
    if (mapped) { classes.add(mapped); continue; }
    if (archetype !== 'custom_crisis') continue;
    const systems = Array.isArray(condition.affectedSystems) ? condition.affectedSystems : [];
    for (const system of systems) {
      const bySystem = /** @type {Record<string, string>} */ (CRISIS_SYSTEM_CLASSES)[String(system)];
      if (bySystem) classes.add(bySystem);
    }
  }
  if (classes.size === 0) return 0;
  const weights = /** @type {Record<string, number>} */ (CRISIS_MORTALITY_WEIGHTS);
  let total = 0;
  for (const kind of classes) {
    const weight = num(weights[kind], 0);
    total += kind === 'food'
      ? weight * foodCorroboration01(
        settlement,
        /** @type {{ spatialLedgers?: unknown, simulationRules?: unknown }} */ (asObject(input.worldState)),
        String(input.settlementId ?? ''),
      )
      : weight;
  }
  return clamp01(total);
}

/**
 * @typedef {Object} TierViability
 * @property {boolean} known      the settlement carries real food physics to read
 * @property {number} bound       min(K_food, D_tier)
 * @property {string} binding     one of BINDING_KINDS
 * @property {number} tierFloor   the current tier's authored population minimum
 * @property {boolean} nonviable  the bound sits BELOW the tier's own floor
 */

/**
 * THE VIABILITY READ (design §7b, THE VIABILITY LADDER) — wave P1a.
 *
 * "Nonzero population and functioning-settlement status are DIFFERENT facts." A place
 * whose effective bound has fallen below the population floor of the tier it wears
 * cannot sustain that tier: not because anyone counted its people this tick, but
 * because the granaries and the ground together cannot hold a settlement of that
 * grade. That is a DEMOGRAPHIC input to the descent, and it is the one this slice adds.
 *
 * IT IS A READ, NEVER A WRITER. The ONE tier-transition writer stays tier drift's
 * eligibility in tierResourceDynamics.js (design §0b: "a new density-driven demotion
 * would be a SECOND WRITER on the same transition; extend tier drift's eligibility
 * instead"). This function only answers a question that eligibility asks.
 *
 * UNKNOWN FOOD IS NEVER NONVIABLE. A fixture or a partially generated settlement with
 * no food physics reads present:false, and an absent reading must never be evidence of
 * failure; `nonviable` stays false and the legacy population/support tests decide alone.
 *
 * @param {DemoSettlement|null|undefined} settlement
 * @param {{ spatialLedgers?: unknown, simulationRules?: unknown }|null|undefined} worldState
 * @param {string} settlementId
 * @returns {TierViability}
 */
export function tierViabilityOf(settlement, worldState, settlementId) {
  const tier = tierOf(settlement);
  const bound = effectiveBoundOf(
    foodCapacityOf(settlement, worldState, settlementId),
    densityCeilingOf(settlement, /** @type {Record<string, unknown>} */ (asObject(worldState)), settlementId),
  );
  const floor = num(/** @type {Record<string, { min?: number }>} */ (POPULATION_RANGES)[tier]?.min, 0);
  return {
    known: bound.foodKnown,
    bound: bound.bound,
    binding: bound.binding,
    tierFloor: floor,
    nonviable: bound.foodKnown === true && floor > 0 && bound.bound < floor,
  };
}

/**
 * INTEGERIZE ONE EXPECTED COUNT with ONE seeded draw (design §3: each term integer,
 * seeded where stochastic). The whole part lands every tick; the fraction is the
 * probability of one more. Exported so the pins derive expectations from the same
 * arithmetic the kernel runs rather than restating it.
 * @param {number} expected @param {number} roll a 0..1 draw
 * @returns {number}
 */
export function integerize(expected, roll) {
  const x = Math.max(0, num(expected, 0));
  const whole = Math.floor(x);
  const fraction = x - whole;
  return whole + (num(roll, 1) < fraction ? 1 : 0);
}
