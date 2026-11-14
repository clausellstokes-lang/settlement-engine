/**
 * economy/foodBalance.js — food-balance analysis and food-supply / trade-disruption plot hooks for economic viability.
 */

import { SEVERITY, tierAtLeast } from '../../data/constants.js';
import { migrationDirectionOfConfig } from '../../domain/migrationDirection.js';
import { FOOD_SECURITY_BANDS, FOOD_SECURITY_CUTS, foodSecurityBandKeyOf } from '../../data/bandLadders.js';
import { FOOD_IMPORT_RATES, SIEGE_PRODUCTION_KEPT } from '../../data/foodImportRates.js';
import {
  getInstFlags,
  getTradeRouteFeatures,
  hasTeleportationInfra,
} from '../helpers.js';
import { formatCount } from '../../domain/formatNumber.js';
import {
  isMaterializedCustomContent,
  nativeSemanticName,
  nativeSemanticNames,
} from '../../domain/content/customContentSemanticAuthority.js';
import { availableNativeResourceKeys } from '../../domain/resourceSemantics.js';
import { resolveTerrain } from '../../domain/resolveTerrain.js';
import { resolveSibling } from '../../domain/facts/drawDeclared.js';
import {
  hasTradeRouteConnection,
  isTradeRouteDisconnected,
  SEASONAL_ROUTE_FOOD_IMPORT_RATE,
} from '../../domain/tradeRouteSemantics.js';
// Shared phrases hoisted once (train EM-T16's worker buy-back, judgment 214c): each is spelled here and referenced below; every emitted value is byte-identical.
const ESTABLISH_SEASONAL_ACCESS_PATRONAGE_OR_A_DEPENDABLE_TRADE_ROUTE = 'Establish seasonal access, patronage, or a dependable trade route';
const FERTILE_FLOODPLAIN = 'fertile_floodplain';
const PROVISIONING_AT_SCALE = 'Provisioning at Scale';
const UNCOVERED_LOCAL_FOOD_DEFICIT = 'Uncovered Local Food Deficit';



// ECONOMIC_CONSTANTS
const ECONOMIC_CONSTANTS = {
  PER_CAPITA_NEED: 2,
};


// ── THE BASE NUMBERS (FOOD-2) — shared by the canonical writer and the legacy view ──
/** The share of need a town and larger draw from their hinterland as NORMAL supply (FOOD-2):
 *  the tier import shares the food writer always carried, now counted as supply, not a gap. */
const HINTERLAND_SHARE_PCT = Object.freeze({ thorp: 0, hamlet: 0, village: 5, town: 20, city: 38, metropolis: 52 });
/** @param {string} tier @returns {number} 0..1 */
export function hinterlandShareOf(tier) {
  return (HINTERLAND_SHARE_PCT[/** @type {keyof typeof HINTERLAND_SHARE_PCT} */ (tier)] ?? 0) / 100;
}
/**
 * The share of its own need a household grows on land of this effective capacity
 * (geographyData's agricultureCapacity plus the resource bonus). A place is sized to what its
 * land feeds, so the land moves the share gently: ordinary land grows about 100–125%, poor
 * land runs short.
 * @param {number} effectiveAgri
 * @returns {number}
 */
export function grownShareOf(effectiveAgri) {
  return (11 / 10) * (1 + ((effectiveAgri - 1) * 5) / 20);
}

/** The words a famine note uses for the source it failed (FOOD-3). */
const FAILED_SOURCE_WORDS = Object.freeze({ grain: 'grain harvest', livestock: 'herds', fish: 'fishing', mill: 'mill', game: 'hunt' });

// ── THE FOOD RECORD (FOOD-1, chair ruling 1, 2026-11-03) ─────────────────────────────
/**
 * @typedef {Object} FoodRecord
 * @property {number} grownPct          share of daily need grown by the place itself, %
 * @property {number} normalImportPct   share of daily need that arrives by ordinary supply
 *                                      (hinterland carts and trade), %
 * @property {number} magicPct          share of daily need closed by magic, %
 * @property {number} gapPct            the gap that remains after all of that, % (the band's number)
 * @property {number} surplusPct        what the place grows beyond its need, %
 * @property {'famine'|'deficit'|'importDependent'|'pressured'|'secure'|'surplus'} band
 * @property {number} storageMonths     months of food in store (granary, households, the mill)
 * @property {boolean} hasGranary       a real granary stands (a stand-in does not count)
 * @property {boolean} growsMoreThanEats the only condition under which a writer may say "surplus"
 * @property {Array<'grain'|'livestock'|'fish'|'mill'|'game'>} foodSources the food sources the place
 *                                      really has, largest contribution first (FOOD-3)
 * @property {'grain'|'livestock'|'fish'|'mill'|'game'|null} failedSource the source a famine failed
 * @property {number} famineCutPct      how much of the harvest the famine took, %
 * @property {string} foodwaysLine      the foodways sentence composed from the place's own sources
 * @property {boolean=} storesHeld      an ACTIVE famine beside a granary still holding six months or
 *                                      more (as the stores line rounds them): the stores are kept back,
 *                                      not given out (the famine's own story: "The wealthy are hoarding.";
 *                                      lane RUNG2-F13; one rounding, rung 2D)
 */

/** The months a famine's granary may hold before the record says the stores are held back (RUNG2-F13). */
export const FAMINE_HELD_STORE_MONTHS = 6;
/**
 * ONE ANSWER TO "HOW FED IS THIS PLACE". Derived once, by the canonical food writer
 * (foodGenerator.js :: generateFoodSecurity), stored once at economicState.foodSecurity.foodRecord.
 * Every sentence that speaks of food reads it: the band, the flags, the prosperity modifier,
 * the situation sentence, the economy line's surplus words, the Foundations food row, and —
 * through the field names below — the Defense stores row (`storageMonths`).
 * Pure: a function of its numbers only.
 * @param {{ dailyNeed: number, dailyProduction: number, importCoverage?: number, normalImportPct?: number, magicOffset?: number,
 *   deficitPct: number, surplusPct: number, stressFamine: boolean, storageMonths: number, hasGranary: boolean,
 *   foodSources?: Array<'grain'|'livestock'|'fish'|'mill'|'game'>, failedSource?: 'grain'|'livestock'|'fish'|'mill'|'game'|null,
 *   famineCutPct?: number, foodwaysLine?: string }} input
 * @returns {FoodRecord}
 */
export function deriveFoodRecord(input) {
  const need = input.dailyNeed > 0 ? input.dailyNeed : 0;
  /** @param {number|undefined} lb */
  const pctOfNeed = (lb) => (need > 0 ? Math.round((Math.max(0, Number(lb) || 0) / need) * 100) : 0);
  return {
    grownPct: pctOfNeed(input.dailyProduction),
    // ONE IMPORT SHARE (WIRING-W0 cause 4a, R-W7 c): the writer's `foodSecurity.importPct`, read; a direct
    // caller without it gets the same share of the same pounds.
    normalImportPct: Number.isFinite(input.normalImportPct) ? Number(input.normalImportPct) : pctOfNeed(input.importCoverage),
    magicPct: pctOfNeed(input.magicOffset),
    gapPct: Math.round(input.deficitPct),
    surplusPct: Math.round(input.surplusPct),
    band: foodSecurityBandKeyOf(input.stressFamine, input.deficitPct, input.surplusPct),
    storageMonths: input.storageMonths,
    hasGranary: input.hasGranary,
    growsMoreThanEats: need > 0 && input.dailyProduction > need,
    foodSources: [...(input.foodSources || [])],
    failedSource: input.failedSource ?? null,
    famineCutPct: input.famineCutPct ?? 0,
    foodwaysLine: input.foodwaysLine || '',
    // Carried by a famine's record only (absent = no famine, nothing held), so no other record moves.
    // ONE ROUNDING (rung 2D, the chair's ruling): the flag reads the whole months the stores line
    // prints (`tonightSheet.js :: foodStoresWords`, Math.round), so 5.5 months prints "six" AND is held.
    ...(input.stressFamine ? { storesHeld: input.hasGranary === true && Math.round(input.storageMonths) >= FAMINE_HELD_STORE_MONTHS } : {}),
  };
}

// ── FOOD-EXPORTS: the food-surplus rule lives in domain/foodSurplus.js (one rule for the
// export writers here and the readers in components); re-exported for the generators.
export { offersFoodSurplus, isFoodSurplusGood, goodsHeldByFoodRecord } from '../../domain/foodSurplus.js';

// deriveFoodBalanceAnalysis
// `foodSecurity` (economicState.foodSecurity from generateFoodSecurity) is the
// CANONICAL food-economics model; when provided, its production/need/deficit become
// the single source of truth here so the viability foodBalance can never contradict
// the economics model on the deficit sign (generators-domain-4). Optional: a direct
// caller without it gets the legacy local model, byte-identical.
export const deriveFoodBalanceAnalysis = (population, terrain, institutions, config, foodSecurity = null) => {
  const issues = [];
  const warnings = [];
  const plotHooks = [];
  const dailyNeed = population * ECONOMIC_CONSTANTS.PER_CAPITA_NEED;
  const agriCap = terrain ? terrain.agricultureCapacity : 1;
  const stresses = config?.stressTypes || [];
  const resources = availableNativeResourceKeys(config);
  const instNames = nativeSemanticNames(institutions)
    .map(name => name.toLowerCase());
  const hasResource = (keys) => resources.some((r) => keys.some((k) => r.includes(k)));
  const hasInstitution = (keys) => instNames.some((n) => keys.some((k) => n.includes(k)));

  // Agriculture modifier from resource+institution combinations
  let agriMod = 0;
  if (
    hasResource(['grain_fields', FERTILE_FLOODPLAIN]) &&
    hasInstitution(['farm', 'granary', 'mill', 'subsistence', 'grain'])
  )
    agriMod += 0.25;
  if (hasResource([FERTILE_FLOODPLAIN]) && hasInstitution(['farm', 'granary', 'subsistence'])) agriMod += 0.1;
  if (
    hasResource(['grazing_land', FERTILE_FLOODPLAIN]) &&
    hasInstitution(['graz', 'livestock', 'butcher', 'common graz', 'pasture'])
  )
    agriMod += 0.1;
  if (
    hasResource(['hunting_grounds']) &&
    (hasInstitution(['hunt']) || ['thorp', 'hamlet', 'village'].includes(config?.tier || config?.settType || ''))
  )
    agriMod += 0.06;
  if (hasResource(['river_fish', 'fishing_grounds']) && hasInstitution(['fish', 'dock', 'port', 'harbor']))
    agriMod += 0.09;
  if (hasResource(['river_mills']) && hasInstitution(['mill'])) agriMod += 0.08;
  agriMod = Math.min(agriMod, 0.5);

  // ── Magic food production enhancement ──────────────────────────────────────
  // High magic settlements can use arcane/druidic/divine means to supplement
  // food production. Only applies at town+ tier (smaller settlements lack the
  // institutional base to sustain magical agriculture at scale).
  // Requires: magic priority > 75, magic-capable institution present.
  const magPriority = config?.priorityMagic ?? 0;
  // domain-5: read the RESOLVED tier, not the raw settType sentinel. settType is
  // 'random' on the default path (DEFAULT_CONFIG), so keying off it left the magic-
  // agriculture boost dead for every random-rolled town+ settlement — it only fired
  // when the user explicitly picked 'town'/'city'/'metropolis'. config.tier is the
  // resolved tier the sibling read at :154 already prefers.
  const resolvedTier = config?.tier || config?.settType || '';
  const isMagicHighTier = magPriority > 75 && ['town', 'city', 'metropolis'].includes(resolvedTier);
  if (isMagicHighTier) {
    const hasMagicFarm = hasInstitution([
      'druid',
      'grove',
      'nature shrine',
      'wizard',
      'arcane',
      'hedge wizard',
      'alchemist',
    ]);
    if (hasMagicFarm) {
      // Boost agriMod for magical food production — represents: grow spells,
      // summoned water, magically accelerated crops, divinely-blessed fields.
      agriMod = Math.min(agriMod + 0.3, 0.8); // higher cap for magic
    }
  }
  const effectiveAgri = Math.min(agriCap + agriMod, 2);

  // Stress modifiers
  let productionMult = 1;
  let consumptionMult = 1;
  let routeOverride = null;
  const stressNotes = [];
  if (stresses.includes('famine')) {
    productionMult *= 0.35;
    // FOOD-3: the canonical record names the source the famine failed and how deep it cut.
    // W1 ECO second seat (the owner's style law, 2026-11-07): the cut is BANDED at 50, the way the
    // DS-ECO-9 famine-source lens bands it; the figure stays on the food record, never in the prose.
    const failed = foodSecurity?.foodRecord?.failedSource;
    const cutWord = (foodSecurity?.foodRecord?.famineCutPct ?? 0) >= 50 ? 'most' : 'part';
    stressNotes.push(failed
      ? `The ${FAILED_SOURCE_WORDS[failed]} failed this year and took ${cutWord} of the food produced here with it. The winter ahead will be hungry.`
      : 'The crops failed, and only about a third of the usual harvest will come in. The winter ahead will be hungry.');
  }
  if (stresses.includes('under_siege')) {
    productionMult *= SIEGE_PRODUCTION_KEPT;
    routeOverride = 'isolated';
    stressNotes.push('The siege has cut every road in, and the outlying farms are abandoned or burned. What is already in store is all there will be until it lifts.');
  }
  if (stresses.includes('plague_onset')) {
    productionMult *= 0.75;
    stressNotes.push('The plague has killed or sickened many who work the fields. Those still standing face a short harvest and a hard winter.');
  }
  if (stresses.includes('occupied')) {
    consumptionMult *= 1.2;
    stressNotes.push('The occupiers are fed from local stores, so the food has to stretch about a fifth further than before.');
  }
  // [generators-domain-1] second-wave stress types with a food-relevant viabilityNote.
  // (Defense stays coupled via the priorityHelpers effective-score multipliers — no inline
  // defense penalty, which would double-count.) Golden-shifting (G2). Kept byte-identical to
  // foodGenerator.js's production block.
  if (stresses.includes('wartime')) {
    productionMult *= 0.85;
    stressNotes.push('The levy has taken workers from the fields, and less will be harvested this year.');
  }
  if (stresses.includes('slave_revolt')) {
    productionMult *= 0.8;
    stressNotes.push('With the enslaved workers in revolt, the outlying fields lie idle and nobody is bringing in the harvest.');
  }
  // WIRING-W0 (R-W7 e): more mouths only where the record declares ARRIVALS (domain/migrationDirection.js).
  if (stresses.includes('mass_migration') && migrationDirectionOfConfig(config) !== 'departures') {
    consumptionMult *= 1.15;
    // The ARRIVALS set. A departures record adds no mouths here (the writer's multiplier above), so
    // its set is silent: a note would state a food effect the record does not hold (the census law).
    stressNotes.push('Newcomers keep arriving, and every one of them has to be fed from the same fields and stores.');
  }

  // The legacy view (no canonical record) grows by the same base numbers as the writer
  // (FOOD-2): the grown share of the need the place feeds itself, no /1.3.
  const dailyProduction = dailyNeed * (1 - hinterlandShareOf(config?.tier || config?.settType || ''))
    * grownShareOf(effectiveAgri) * productionMult;
  const adjustedNeed = dailyNeed * consumptionMult;
  const effectiveRoute = routeOverride || config?.tradeRouteAccess || 'isolated';
  const disconnectedRoute = isTradeRouteDisconnected(effectiveRoute);
  const surplus = dailyProduction - adjustedNeed;
  const rawDeficit = Math.abs(Math.min(surplus, 0));
  const _rawDeficitPct = adjustedNeed > 0 ? (rawDeficit / adjustedNeed) * 100 : 0;

  // Import coverage: trade routes, magical transport, and minor-route
  // channels each cover part of the deficit. Magical transport is capped and
  // expensive — a teleportation circle moves what is rationed and necessary,
  // never bulk plenty (sub-road rate), and it has its own supply chain:
  // without an arcane maintainer institution its throughput halves. Airships
  // can run a blockade where caravans cannot, but against sustained
  // countermeasures they land a fraction of what open routes carry.
  const _magicOn = config?.magicExists !== false;
  const _siegeIsolation = routeOverride === 'isolated';
  const _hasTeleportCircle = _magicOn && instNames.some(
    (n) => n.includes('teleportation') || n.includes('planar') || n.includes('extradimensional')
  );
  const _hasAirshipDock = _magicOn && instNames.some((n) => n.includes('airship'));
  const _hasArcaneMaintainer = instNames.some(
    (n) => ['wizard', 'mage', 'alchemist', 'academy', 'arcane'].some((k) => n.includes(k))
  );
  const _maintainerMult = _hasArcaneMaintainer ? 1 : 0.5;
  const _magicTradeRate = _hasTeleportCircle
    ? FOOD_IMPORT_RATES.teleport
    : _hasAirshipDock
      ? (_siegeIsolation ? FOOD_IMPORT_RATES.airshipBesieged : FOOD_IMPORT_RATES.airship)
      : 0;
  // Even isolated settlements receive expensive, irregular, politically
  // controlled imports — minor routes, sanctioned caravans, pilgrimage
  // traffic, protected convoys. Nothing major, and a siege severs them.
  const _tierForTrade = config?.tier || config?.settType || 'village';
  const _minorRouteRate = _siegeIsolation
    ? 0
    : ['town', 'city', 'metropolis'].includes(_tierForTrade)
      ? FOOD_IMPORT_RATES.minorRoutes
      : _tierForTrade === 'village'
        ? FOOD_IMPORT_RATES.minorRoutesVillage
        : 0;
  const importCoverageRate = !disconnectedRoute
    ? (effectiveRoute === 'port'
      ? 0.7
      : effectiveRoute === 'crossroads'
        ? 0.6
        : effectiveRoute === 'river'
          ? 0.5
          : effectiveRoute === 'road'
            ? 0.35
            // A pass is a seasonal channel: heavy caravan traffic while it is
            // open, nothing at all once winter shuts it. The annualized rung
            // sits below road and above the isolated trickle.
            : effectiveRoute === 'mountain_pass'
              ? SEASONAL_ROUTE_FOOD_IMPORT_RATE
          : 0)
    : Math.max(_magicTradeRate * _maintainerMult, _minorRouteRate);
  const canImportFood = importCoverageRate > 0 && rawDeficit > 0;
  const importCoverage = canImportFood ? Math.round(rawDeficit * importCoverageRate) : 0;
  // Channel LABEL is a pure function of route + magic infra (independent of the
  // deficit); the actual display is gated on real import coverage at return time
  // (importCoverageFinal > 0), which is byte-identical to the old `!canImportFood`
  // gate on the fallback path and correct on the canonical path.
  // The label is read by a player (dossierViewModel prints it verbatim), so the
  // config token is de-slugged: 'mountain_pass' must arrive as "mountain pass
  // trade". Byte-identical for every single-word route.
  // SW-B1 CONTRADICTIONS (STYLE-RULINGS-2 B1(b), the SURFACES audit's P71/#2): "port trade" — printed
  // "brought in by sea" and "comes in by port trade" — is said only over docks. A port route with no
  // docks (Albamunicipium, soak1k-0, a mountain thorp) names the channel plainly as "trade"; the rate is
  // the route's, unchanged. The docks are the institution flag the #10 gate reads (`getInstFlags.inst`).
  const portWithoutDocks = effectiveRoute === 'port' && !getInstFlags(config || {}, institutions || []).inst?.hasPort;
  const importChannelLabel = importCoverageRate <= 0
    ? null
    : !disconnectedRoute
      ? (portWithoutDocks ? 'trade' : `${String(effectiveRoute).replace(/_/g, ' ')} trade`)
      : _magicTradeRate * _maintainerMult >= _minorRouteRate
        ? (_hasTeleportCircle ? 'teleportation circle' : _siegeIsolation ? 'airship runs (impaired by siege)' : 'airship traffic')
        : 'minor routes and sanctioned caravans';

  // Magic food offset: druid/divine/arcane can supplement food production
  // Only applies when magic is active and relevant institutions exist. The caster
  // booleans are hoisted (they depend only on institutions + priorities, not on the
  // deficit) so the canonical reconcile below can reuse them.
  const magicOn = config?.magicExists !== false;
  const magPri = config?.priorityMagic ?? 0;
  const relPri = config?.priorityReligion ?? 0;
  const hasDruidFood =
    magPri >= 30 &&
    instNames.some((n) =>
      ['druid circle', 'grove shrine', 'elder grove', 'sacred grove'].some((k) => n.includes(k)) // J33: Warden's Lodge is defence, not druid (the owner, 2026-10-01)
    );
  const hasDivineFood =
    relPri >= 55 &&
    instNames.some((n) =>
      ['cathedral', 'monastery', 'great cathedral', 'parish church', 'friary'].some((k) => n.includes(k))
    );
  const hasArcaneFood =
    magPri >= 50 && instNames.some((n) => ['wizard', 'mages', 'arcane', 'spellcasting'].some((k) => n.includes(k)));
  const magicFoodRate = hasDruidFood ? 0.65 : hasDivineFood ? 0.4 : hasArcaneFood ? 0.3 : 0;
  const magicFoodNoteFor = () =>
    hasDruidFood ? 'Druidic cultivation provides partial food supplement'
      : hasDivineFood ? 'Divine provision supplements food shortfall'
        : hasArcaneFood ? 'Arcane quickening of growth provides minor food supplement'
          : '';
  let magicFoodOffset = 0;
  let magicFoodNote = '';
  if (magicOn && rawDeficit > importCoverage && magicFoodRate > 0) {
    const remaining = rawDeficit - importCoverage;
    magicFoodOffset = Math.round(remaining * magicFoodRate);
    magicFoodNote = magicFoodNoteFor();
  }

  let deficit = Math.max(0, rawDeficit - importCoverage - magicFoodOffset);
  let deficitPercent = adjustedNeed > 0 ? (deficit / adjustedNeed) * 100 : 0;

  // ── CANONICAL RECONCILE (generators-domain-4: single-writer food model) ────
  // generateFoodSecurity (economicState.foodSecurity) is the SINGLE WRITER of the
  // food economics — the one model that feeds prosperity AND the tick foodStockpile.
  // The viability foodBalance is a VIEW of it and must never contradict it on the
  // deficit SIGN or magnitude. The two independently recomputed production/need/
  // deficit using a different terrain-agri source, a different magic model, and —
  // in foodSecurity only — seeded crop-fortune variance, so they could disagree
  // (one reporting surplus while the other reported deficit). When the canonical
  // foodSecurity is threaded in, its dailyProduction/dailyNeed/deficit REPLACE the
  // locally-recomputed numbers. Reads an already-computed object → draws NO rng
  // (crop-fortune was already rolled once, at economicState time). The import/magic
  // attribution is rebuilt to sum EXACTLY to the canonical gap so the dossier's
  // channel breakdown stays internally consistent. Fallback (no foodSecurity — a
  // direct unit caller) keeps the legacy local model byte-identical.
  let dailyProductionFinal = Math.round(dailyProduction);
  let dailyNeedFinal       = Math.round(adjustedNeed);
  let surplusFinal         = surplus;
  let importCoverageFinal  = importCoverage;
  let rawDeficitFinal      = rawDeficit;
  const canonical = foodSecurity
    && Number.isFinite(foodSecurity.dailyProduction)
    && Number.isFinite(foodSecurity.dailyNeed);
  if (canonical) {
    dailyProductionFinal = foodSecurity.dailyProduction;
    dailyNeedFinal       = foodSecurity.dailyNeed;
    surplusFinal         = dailyProductionFinal - dailyNeedFinal;
    // The writer's own gap where it publishes one. Re-deriving it from the
    // ROUNDED production/need pair costs up to a pound, which is nothing on a
    // city and a percentage point and a half on a thorp whose whole daily need
    // is sixty pounds — and that pound then bit through the clamp below and
    // split the residual percentage between the Economics tab and the Daily
    // Life tab on 12 of the golden master's 525 configurations.
    rawDeficitFinal      = Number.isFinite(foodSecurity.rawDeficit)
      ? Math.max(0, foodSecurity.rawDeficit)
      : Math.max(0, -surplusFinal);
    // The lbs are reconstructed from deficitPct (rounded) + dailyNeed, the two fields every
    // persisted record carries. The writer's own per cent is the share of its own rounded
    // pounds (foodGenerator.js, LANDING-7 lane H), so on a small need this recovers them.
    // Clamp into [0, rawDeficit].
    const cDeficitPct = Number.isFinite(foodSecurity.deficitPct) ? foodSecurity.deficitPct : 0;
    deficit = Math.max(0, Math.min(rawDeficitFinal, Math.round((cDeficitPct / 100) * dailyNeedFinal)));
    // ⛔ ONE FIGURE, DERIVED FROM THE OTHER (LANDING-7 lane H, STOP-1, 2026-11-06). The view
    // publishes integer pounds, so its share is the share THOSE pounds are of the need it
    // publishes, rounded as the record invariant V-FOOD-PCT rounds it, and never the writer's
    // percentage carried beside them. Carried, the two split on a small need: a 1% gap on a
    // 32 lb thorp is a third of a pound, which publishes as 0 lb beside 1% (the sign broken), and
    // a 1 lb floor under it published 1 lb beside 1% where those pounds are 3% (the share broken,
    // on 17 golden rows). Derived, a gap that rounds to no pound reads 0%, and a positive share
    // always has the pounds that produce it. No floor.
    deficitPercent = Math.round(dailyNeedFinal) > 0
      ? Math.round((deficit / Math.round(dailyNeedFinal)) * 100) : 0;
    // WHO CARRIES THE COVERED PORTION. The writer publishes its own split
    // (foodSecurity.importCoverage / .magicOffset, lb/day), so read it: a view
    // that re-derives a number its writer already holds is a second source of
    // truth, and this one was wrong twice over. Its `canImportFood` gate tested
    // the LOCAL rawDeficit — the figure the canonical block three lines above has
    // just SUPERSEDED — so a settlement whose local model saw a surplus while the
    // canonical model saw a real gap was credited with zero imports and a magical
    // offset covering the whole gap: measured at 52 of the golden master's 525
    // configurations, each one dropping its "+ N imported" chip, its import-bar
    // segment, its "Trade covers X% of gap" caption and its importChannel from
    // both the Economics tab and the PDF chapter. Its rate ladder also lacked the
    // writer's low-agri terrain boost, so even where the gate opened the split
    // between channel and magic was off.
    //
    // The covered TOTAL stays anchored to deficitPct (the band's own number), so
    // the sign law above is untouched; only its attribution is read rather than
    // guessed. Proportions are applied to the covered total so the two channels
    // still sum EXACTLY to rawDeficit − deficit.
    const totalCoverage = Math.max(0, rawDeficitFinal - deficit);
    const cImport = Math.max(0, Number(foodSecurity.importCoverage) || 0);
    const cMagic  = Math.max(0, Number(foodSecurity.magicOffset) || 0);
    const canonicalSplit = Number.isFinite(foodSecurity.importCoverage)
      && Number.isFinite(foodSecurity.magicOffset)
      && (cImport + cMagic) > 0;
    // Settlements persisted before the writer published its split carry only
    // deficitPct, so the original reconstruction stays as the arm that reads
    // them — with the import gate now asking about the CANONICAL gap.
    const importPortion = canonicalSplit
      ? Math.min(totalCoverage, Math.round(totalCoverage * (cImport / (cImport + cMagic))))
      : (importCoverageRate > 0 && rawDeficitFinal > 0
        ? Math.min(totalCoverage, Math.round(rawDeficitFinal * importCoverageRate))
        : 0);
    const magicResidual = Math.max(0, totalCoverage - importPortion);
    if (magicResidual > 0 && magicOn && magicFoodRate > 0) {
      importCoverageFinal  = importPortion;
      magicFoodOffset      = magicResidual;
      magicFoodNote        = magicFoodNoteFor();
    } else {
      // No magic caster to credit: the whole covered gap is import-carried.
      importCoverageFinal  = totalCoverage;
      magicFoodOffset      = 0;
      magicFoodNote        = '';
    }
  }

  // The viability verdicts cut the gap at the band's own points (FOOD-1: one set of cut-offs;
  // these were a private 50 and 20).
  if (surplusFinal < 0) {
    if (deficitPercent > FOOD_SECURITY_CUTS.deficit) {
      if (disconnectedRoute) {
        // An uncovered deficit is a survival fact, not merely an economic
        // mood. Isolated settlements have no routine import channel that can
        // make this gap disappear off-screen, so the viability verdict must
        // fail rather than claim self-sufficiency while the food ledger says
        // otherwise.
        issues.push({
          severity: SEVERITY.CRITICAL,
          category: 'Food Production',
          title: UNCOVERED_LOCAL_FOOD_DEFICIT,
          description: `Settlement cannot cover ~${Math.round(deficit)} lbs of food per day (${Math.round(deficitPercent)}% of needs) and has no dependable trade route.`,
          impact: 'The current population cannot survive this provisioning gap without a new support path.',
          suggestedFixes: [
            'Strengthen the local foodshed or reduce the supported population',
            ESTABLISH_SEASONAL_ACCESS_PATRONAGE_OR_A_DEPENDABLE_TRADE_ROUTE,
            'Add reserves only as a temporary buffer, not a permanent food source',
          ],
        });
      } else if (effectiveRoute === 'road') {
        issues.push({
          severity: SEVERITY.DEPENDENCY,
          category: 'Food Production',
          title: 'Heavy Food Import Dependency',
          description: `Settlement requires ~${Math.round(deficit)} lbs of grain/day via road trade (${Math.round(deficitPercent)}% of needs). Vulnerable to supply disruption.`,
          impact: 'A trade disruption or bad harvest becomes a famine within weeks.',
          suggestedFixes: [
            'Add granary or grain storage for reserves',
            'Establish multiple supply routes',
            'Develop local food production',
          ],
        });
      } else {
        issues.push({
          severity: SEVERITY.DEPENDENCY,
          category: 'Food Production',
          title: 'Severe Food Import Dependency',
          description: `Settlement requires ~${Math.round(deficit)} lbs of grain per day via ${effectiveRoute} trade.`,
          impact: 'Vulnerable to trade disruption, famine risk.',
          suggestedFixes: [
            'Stockpile grain reserves for 3-6 months',
            'Diversify trade partners',
            'Develop alternative food sources (fish, livestock)',
          ],
        });
        plotHooks.push({
          category: 'Trade Disruption',
          hook: `The ${effectiveRoute} trade route is cut, and nothing has come along it in days. The town has ${Math.round((dailyProductionFinal / dailyNeedFinal) * 30)} days of food left, and no one knows when the next load will come.`,
          severity: 'high',
        });
      }
    } else if (deficitPercent > FOOD_SECURITY_CUTS.importDependent) {
      if (disconnectedRoute) {
        issues.push({
          severity: SEVERITY.CRITICAL,
          category: 'Food Production',
          title: UNCOVERED_LOCAL_FOOD_DEFICIT,
          description: `Settlement cannot cover ~${Math.round(deficit)} lbs of food per day (${Math.round(deficitPercent)}% of needs) and has no dependable trade route.`,
          impact: 'The current population is not viable without another provisioning path.',
          suggestedFixes: [
            'Strengthen the local foodshed',
            ESTABLISH_SEASONAL_ACCESS_PATRONAGE_OR_A_DEPENDABLE_TRADE_ROUTE,
          ],
        });
      } else {
        warnings.push({
          severity: SEVERITY.DEPENDENCY,
          category: 'Food Production',
          title: 'Food Import Requirement',
          description: `Settlement imports ~${Math.round(deficit)} lbs of grain/day (${Math.round(deficitPercent)}% of needs) via ${effectiveRoute}.`,
          impact: 'Creates trade dependency but manageable.',
          suggestedFixes: ['Increase local food production', 'Maintain strategic grain reserves'],
        });
      }
      plotHooks.push({
        category: 'Trade Politics',
        hook: 'A poor harvest somewhere else has spiked the price of grain. The settlement must decide what it can still afford to import, and the merchants are watching it decide.',
        severity: 'medium',
      });
    }
  } else if (surplusFinal > dailyNeedFinal * 0.5) {
    warnings.push({
      severity: SEVERITY.INEFFICIENCY,
      category: 'Food Production',
      title: 'Agricultural Surplus',
      description: `Settlement produces ${Math.round((surplusFinal / dailyNeedFinal) * 100)}% more food than needed.`,
      impact: 'Export opportunity: could generate significant trade income.',
      suggestedFixes: [
        'Add merchants to export surplus grain',
        'Add granary for long-term storage',
        'Develop food processing industries (brewing, baking)',
      ],
    });
  }

  // Granary check for large settlements
  const hasGranary = instNames.some(
    (n) => n.includes('granar') || n.includes('grain store') || n.includes('grain silo')
  );
  if (getTradeRouteFeatures(config?.tier || config?.settType || 'village') && !hasGranary) {
    warnings.push({
      severity: SEVERITY.CRITICAL,
      category: 'Food Storage',
      title: 'No Grain Storage Facility',
      description: `Settlement of ${formatCount(population)} lacks a granary. Cannot buffer harvests or maintain strategic food reserves.`,
      impact: 'Vulnerable to seasonal shortages and siege starvation without grain reserves.',
      suggestedFixes: ['Add Town granary, City granaries, or State granary complex'],
    });
  }

  // Mill check for towns
  const hasMill = instNames.some((n) => n.includes('mill') || n === 'miller');
  // A tier read, not a headcount (FOOD-2: the arithmetic holds under any population scale).
  if ((config?.tier || config?.settType) === 'town' && !hasMill) {
    warnings.push({
      severity: SEVERITY.CRITICAL,
      category: 'Food Processing',
      title: 'No Milling Facility',
      description: `Settlement of ${population} people processes grain without a mill.`,
      impact: 'Inefficient food processing, implausible for this population size.',
      suggestedFixes: ['Add Mill (water-powered or windmill) or Mills (2-5)'],
    });
  }

  // Stress food impact notes
  if (stressNotes.length > 0) {
    const isCritical = stresses.includes('famine') || stresses.includes('under_siege');
    stressNotes.forEach((note) => {
      issues.push({
        type: 'stress_consequence',
        category: 'Food Supply',
        severity: isCritical ? 'critical' : 'implausible',
        // SW-B1 (STYLE-RULINGS-2 B1(b), the SURFACES audit's P73): the label read no surplus, so a town that
        // still grows more than it eats (Lundey, soak1k-1, +17) printed "Cutting the Food Supply" beside
        // "it feeds itself". The label and its note now read the surplus beside the cut.
        title: surplus >= 0 ? 'Crisis Thinning the Harvest' : 'Crisis Cutting the Food Supply',
        message: note,
        description: note,
        priorityNote: surplus >= 0
          ? 'The crisis has cut the harvest, but what is grown still covers what is eaten.'
          : 'The crisis is cutting into the food supply now.',
      });
    });
  }

  return {
    issues,
    warnings,
    plotHooks,
    foodBalance: {
      dailyNeed: Math.round(dailyNeedFinal),
      dailyProduction: Math.round(dailyProductionFinal),
      deficit: Math.round(deficit),
      deficitPercent: Math.round(deficitPercent),
      surplus: Math.round(Math.max(surplusFinal, 0)),
      // THE MULTIPLIER THE PRODUCTION FIGURE BESIDE IT WAS COMPUTED WITH, which
      // is the only reading under which the Economics tab's "Agriculture
      // modifier: X%" and the PDF's "Ag mod X" explain anything. This field
      // carried geographyData's terrain agricultureCapacity, and once the
      // canonical writer took over production that table stopped being the one
      // in play: foodGenerator's TERRAIN_AGRI reads plains 1.0 where
      // geographyData reads 1.5, riverside 0.9 where it reads 1.3, hills 0.6
      // where it reads 0.9. 376 of the golden master's 525 configurations
      // printed a modifier their own production contradicts. The canonical
      // effective multiplier (terrain + resource/institution bonus + registered
      // custom producers) replaces it; the fallback path, which has no canonical
      // writer, keeps reporting the capacity its own local model used.
      agricultureModifier: Number.isFinite(foodSecurity?.effectiveAgriculture)
        ? foodSecurity.effectiveAgriculture
        : agriCap,
      stressModifier: productionMult < 1 ? productionMult : undefined,
      importCoverage: importCoverageFinal > 0 ? Math.round(importCoverageFinal) : undefined,
      rawDeficit: rawDeficitFinal > deficit ? Math.round(rawDeficitFinal) : undefined,
      // Attribution: which channel carries the imports, and how much of the
      // gap magic closes. Without these the dossier shows a deficit smaller
      // than needed-minus-produced with no visible explanation.
      importChannel: (importCoverageFinal > 0 && importChannelLabel) ? importChannelLabel : undefined,
      magicFoodOffset: magicFoodOffset > 0 ? Math.round(magicFoodOffset) : undefined,
      // Surface the magic-source note alongside its offset so callers
      // can attribute the food contribution (Druidic / Divine / Arcane).
      // Conditional inclusion keeps the field shape unchanged when no
      // magic offset applies.
      magicFoodNote: magicFoodNote || undefined,
    },
  };
};


// deriveSupplyRiskAnalysis
/**
 * Does the settlement have a local processor for a must-import staple, so importing
 * the raw resource is a genuine dependency (not just a passthrough)?
 *
 * Needles are matched against the lowercased institution name; the grain branch
 * excludes sawmills ('sawmill'.includes('mill') is true). At city+ the match broadens
 * to the renamed/consolidated institutions ('City granaries', 'Specialized
 * metalworkers') the town-tier needles miss — without it, 72.5% of metropolises
 * reported ZERO deps.
 *
 * @param {Array<{ name?: string, tags?: string[] }>} institutions
 * @param {string} resource
 * @param {{ tier?: string }} config
 * @returns {boolean}
 */
export function hasImportProcessor(institutions, resource, config) {
  const bigTier = tierAtLeast(config?.tier, 'city');
  const r = resource.toLowerCase();
  return institutions.some((i) => {
    const t = i.tags || [];
    if (isMaterializedCustomContent(i)) return false;
    const n = nativeSemanticName(i).toLowerCase();
    return (
      (r.includes('grain')  && (
        (
          n.includes('mill')
          && !n.includes('sawmill')
          && !n.includes('access to external mill')
        )
        || (bigTier && n.includes('granar'))
      )) ||
      (r.includes('timber') && (n.includes('sawmill') || (bigTier && n.includes('carpenter')))) ||
      (r.includes('metal')  && (n.includes('smith') || n.includes('smelter') || (bigTier && (n.includes('metalwork') || t.includes('metalwork')))))
    );
  });
}

/**
 * Push tier-scaled baseline provisioning dependencies onto `warnings`.
 *
 * The per-capita food model lets a dense city/metropolis on fertile terrain appear
 * self-sufficient (it "grows" its own staples within its walls), reporting zero import
 * dependency — false: a real urban centre imports staple food + bulk materials from its
 * hinterland. Without this, 72.5% of metropolises reported ZERO economic dependencies
 * (tier-inverted). City+ only; mutates `warnings` in place.
 *
 * @param {Array<Object>} warnings  Warning list mutated in place.
 * @param {{ tier?: string, tradeRouteAccess?: string }} config
 * @param {{ deficitPercent?: number }} [foodBalance]
 * @param {boolean} [hasExternalSupply]
 */
export function appendProvisioningAtScaleDeps(
  warnings,
  config,
  foodBalance,
  hasExternalSupply = config?.tradeRouteAccess !== 'none',
) {
  if (!tierAtLeast(config?.tier, 'city') || !hasExternalSupply) return;

  // Skip the staple-food baseline when the food model already shows a deficit
  // (it emits a 'Food Production' DEPENDENCY that owns the grain import), or when
  // a per-resource grain import already fired. Prevents a cross-function
  // double-count under stress: a famine on fertile terrain otherwise produced
  // BOTH 'Food Import Requirement' and this baseline.
  // >= 20 (not > 20): the food model fires its warning on the UNROUNDED deficit
  // > 20, but foodBalance.deficitPercent is rounded (20.4 -> 20), so a strict
  // > 20 here let the boundary cases through and double-counted.
  const foodDeficit = (foodBalance?.deficitPercent || 0) >= 20;
  const hasGrainDep = warnings.some(w => w.severity === SEVERITY.DEPENDENCY && /grain|food/i.test(`${w.title} ${w.category || ''}`));
  if (!hasGrainDep && !foodDeficit) {
    warnings.push({
      severity: SEVERITY.DEPENDENCY,
      category: PROVISIONING_AT_SCALE,
      title: 'Imports staple food at urban scale',
      description: `A ${config.tier} cannot grow its staples within its walls; it depends on a steady grain supply from the surrounding region.`,
      impact: 'A disrupted supply line means hunger within days.',
      suggestedFixes: ['Secure and protect the regional grain-supply network'],
    });
  }
  // Bulk materials/fuel — every city/metro imports these at scale, so the headline
  // metric is never a false zero for a dense urban centre (city was still 11.7% zero on
  // grain/timber/metal-free mustImport terrains like hills before this floor).
  warnings.push({
    severity: SEVERITY.DEPENDENCY,
    category: PROVISIONING_AT_SCALE,
    title: 'Imports bulk materials and fuel',
    description: `A ${config.tier} consumes building materials and fuel faster than any local hinterland can supply.`,
    impact: 'Construction and industry stall when material convoys are interrupted.',
    suggestedFixes: ['Diversify material supply routes and hold strategic reserves'],
  });
  // Imperial-scale finished goods & luxuries — metropolis throughput only (keeps metro
  // dependency count above city).
  if (config?.tier === 'metropolis') {
    warnings.push({
      severity: SEVERITY.DEPENDENCY,
      category: PROVISIONING_AT_SCALE,
      title: 'Imports finished goods and luxuries',
      description: 'An imperial metropolis depends on a constant inflow of finished goods, textiles, and luxuries its populace and elite demand.',
      impact: 'Shortfalls drive price spikes, unrest, and loss of prestige.',
      suggestedFixes: ['Maintain long-haul trade relationships and bonded warehousing'],
    });
  }
}

/**
 * CENSUS-1f unit 3 (Appendix B item 23, T): every printed hook resolves through
 * `resolveSibling(…, OUTLOOK_HOOK_SIBLINGS, …)` (economy/outlookHookSiblings.js) — the timber line's `navigable` (its twin
 * drops "shipbuilding"), the iron line's `institution: smith` (its twin drops the blacksmiths), the
 * starving line's famine band (its twin, CENSUS-3g, the moderate gap; a fed place keeps the refused original). `facts`
 * is the birth's partial record at the economy step (the roster, the config, the tier, the
 * economic state: `viability.js`); absent, the hooks print unchanged (resolveSibling's rule).
 * @param {any} population @param {any} terrain @param {any} institutions @param {any} config @param {any} foodBalance
 * @param {object | (() => object) | null} [facts]
 */
export const deriveSupplyRiskAnalysis = (population, terrain, institutions, config, foodBalance, facts = null) => {
  const issues = [];
  const warnings = [];
  const hooks = [];
  const route = config?.tradeRouteAccess || 'isolated';
  const hasDeficit = foodBalance.deficit > 0;

  if (hasDeficit) {
    if (route === 'isolated' || route === 'none' || route === 'road') {
      hooks.push({
        category: 'Survival Crisis',
        hook: 'The settlement is starving. Its hungriest are turning to banditry, and a merchant has offered to supply food at a price the settlement cannot pay in coin.',
        severity: 'critical',
      });
    } else if (route !== 'isolated') {
      hooks.push({
        category: 'Trade Monopoly',
        // CENSUS-3e (answer 2, R-V measured): `guild` at this step differs from the final record on
        // 25 of 1,000 births, so the hook presumes only the imports its branch guarantees.
        hook: 'One importer now brings in all the grain and has quadrupled the price; the locals are arguing over whether to pay, find another supplier, or take the grain.',
        severity: 'high',
      });
      if (route === 'river')
        hooks.push({
          category: 'River Control',
          hook: 'A town upstream has dammed the river or turned it: the water is low here, the grain shipments are stuck, and the town must choose between talking and fighting.',
          severity: 'high',
        });
      if (route === 'port' && resolveTerrain(config) === 'coastal')
        hooks.push({
          category: 'Naval Blockade',
          hook: `Ships sit across the harbour mouth, an enemy's or pirates', and nothing enters or leaves. The town has ${Math.round((foodBalance.dailyProduction / foodBalance.dailyNeed) * 30)} days of reserves.`,
          severity: 'high',
        });
      if (route === 'road' && hasDeficit)
        hooks.push({
          category: 'Bandit Raids',
          hook: 'Bandits are taking the food caravans, and the town has posted a bounty for clearing the trade road; the carters who got away say the "bandits" looked like families who had fled somewhere worse.',
          severity: 'medium',
        });
    }
  }

  // Viability trade issues flagged by economic state. The terrain's mustImport list
  // (TERRAIN_DATA, e.g. coastal grain/timber) is the live source here — config never
  // carries mustImport. Needles must be lowercase to match the lowercased name, and
  // the grain branch excludes sawmills ('sawmill'.includes('mill') is true).
  const mustImport = terrain?.mustImport || config?.mustImport;
  const hasExternalSupply =
    hasTradeRouteConnection(route)
    || (
      route === 'isolated'
      && FOOD_IMPORT_RATES.minorRoutes > 0
    )
    || hasTeleportationInfra(institutions, config);
  if (mustImport) {
    const pick = Math.round(Number(population) || 0) + (institutions?.length || 0); // COHERENCE-AGREE: the event a place draws, by its size, no roll
    mustImport.forEach((resource) => {
      if (liveMaterialFor(resource, availableNativeResourceKeys(config || {}))) return; // COHERENCE-AGREE: a live material is no import and no hook
      if (hasImportProcessor(institutions, resource, config)) {
        if (!hasExternalSupply) return;
        warnings.push({
          severity: SEVERITY.DEPENDENCY,
          category: 'Resource Import',
          title: `Imports ${resource}`,
          description: `Settlement must import ${resource} to support local industries.`,
          impact: 'Creates trade dependency and vulnerability.',
          suggestedFixes: [`Establish stable trade relationship with ${resource} supplier`],
        });
        if (resource.toLowerCase().includes('timber'))
          hooks.push({ category: 'Resource Conflict', severity: 'medium',
            hook: ["Something is killing the forest the timber comes from, and the settlement's building and shipbuilding trades stall without it. Find another supplier, or find out what is in those woods?",
              'The timber rafts stopped coming a month ago, and the shipwrights and builders are bidding against each other for what is left in the yards.'][pick % 2],
          });
        if (resource.toLowerCase().includes('metal') || resource.toLowerCase().includes('iron'))
          hooks.push({ category: 'Strategic Resource', severity: 'medium', hook: (typeof facts === 'function' ? facts() : facts)?.warState !== 'peace' // the war line only where the record holds a war
            ? 'War has taken the iron: the metal suppliers sell to the armies first, and the smiths have nothing to mend tools with. Work slows, and people are starting to complain.'
            : ['The iron merchants have doubled their price this season, and the smiths are mending tools with scrap. Work slows, and people are starting to complain.',
              'The iron carts are three weeks late and the carters will not say why. The smiths are rationing what they have, and work waits on mended tools.',
              'A new toll on the iron road has made metal dear. The smiths blame whoever set it, and the tools still need mending.'][pick % 3] });
      }
    });
  }

  // Tier-scale baseline provisioning dependency for urban centres (city+).
  // Mutates warnings in place.
  appendProvisioningAtScaleDeps(
    warnings,
    config,
    foodBalance,
    hasExternalSupply,
  );

  // R-AU (CENSUS-1h): a refused hook with no admitted twin DROPS here (kind A) — it never kept-and-
  // noted a line that `hookTruthRecord.js :: withoutFalseHooks` removed later (the starving hook on
  // a fed place: 250 kept notes in 161 of the 1,000, none printed); that pass stays as defence.
  const resolved = hooks
    .map((h) => ({ ...h, hook: resolveSibling(h.hook, OUTLOOK_HOOK_SIBLINGS, { facts, poolId: 'foodBalance:OUTLOOK_HOOK_SIBLINGS', surface: 'economics', drawKind: 'T', dropRefused: true }) })) // CENSUS-1f
    .filter((h) => h.hook !== null);
  return { issues, warnings, plotHooks: resolved.map((h) => (h.hook === MODERATE_GAP_TWIN ? { ...h, ...moderateGapGrade(facts) } : h)) };
};

/**
 * CENSUS-3h (R-AV, the chair's answer 2 of 2026-11-05 08:3x): a twin carries only the severity and
 * category the record holds. The moderate-gap twin prints only where the food record reads
 * Import-Dependent or Pressured (its declaration); its category is that band's own label (the one
 * ladder, never re-spelled) and its severity the band's grade — Import-Dependent `medium`, the
 * record's own grade for that band's viability hook ("A poor harvest somewhere else…"), Pressured
 * `low`, the grade under it (the ladder writes no Pressured hook). "critical" stays with the
 * famine-band original. The band is read through the declaration's own reader (`famine.band`).
 * @type {Readonly<Record<string, string>>}
 */
const MODERATE_GAP_SEVERITY = Object.freeze({ importDependent: 'medium', pressured: 'low' });
/** @param {object | (() => object) | null} facts @returns {{ category?: string, severity?: string }} */
function moderateGapGrade(facts) {
  const f = /** @type {any} */ (typeof facts === 'function' ? facts() : facts);
  const band = f?.famine?.band;
  const severity = typeof band === 'string' ? MODERATE_GAP_SEVERITY[band] : undefined;
  if (severity === undefined) return {};
  return { category: FOOD_SECURITY_BANDS[/** @type {keyof typeof FOOD_SECURITY_BANDS} */ (band)].label, severity };
}
import { MODERATE_GAP_TWIN, OUTLOOK_HOOK_SIBLINGS } from './outlookHookSiblings.js'; import { liveMaterialFor } from './localMaterials.js'; export { OUTLOOK_HOOK_SIBLINGS }; // LANDING-R2 (ODQ §934.105): the outlook hooks' declared siblings moved verbatim to economy/outlookHookSiblings.js, re-exported; below every cited line, so none moves
