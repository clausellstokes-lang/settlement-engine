/**
 * domain/worldPulse/militaryStrength.js — structured military-strength model (Phase B0).
 *
 * The EXISTING `settlementStrength()` in relationshipEvolution.js is a single 0..1
 * confidence number blended from tier / population / a few pressures / a war-cost
 * penalty. It is deliberately coarse — it is the SAME confidence input the
 * subjugation and rival contests read, and it must stay byte-identical.
 *
 * This model is RICHER and SEPARATE. It answers "what is this settlement's latent
 * military strength, and WHY?" as a STRUCTURED decomposition with named
 * contributors — so a later phase (B1/B2) can ask not just "how strong" but "how
 * strong in weapons vs manpower vs logistics", and can compute the LIVE facets
 * (mobilized / deployed / homeDefense / garrison) from deployment state on top of
 * the theoretical base this model establishes. The core proposal finding it
 * encodes: a thorpe army ≠ a city army — tier, population, institutions, supply
 * chains, and economy compound, so a well-found city outweighs a thorpe by a wide
 * margin.
 *
 * DETERMINISM CONTRACT (sacred): pure function of persisted/derived state. No
 * Date.now / Math.random / argless new Date, no rng. Reads only the settlement and
 * its already-derived ledgers. MOUNTED NOWHERE in B0 — no pulse path imports it, so
 * it cannot change any behavior (B1/B4 wire it in).
 *
 * Strict-clean (typecheck:domain:strict). No React/Zustand imports.
 */

import { TIER_ORDER } from '../../data/constants.js';
import { defenseLedger } from '../defenseLedger.js';
import { foodLedger } from '../foodLedger.js';
import { deriveSystemVariable } from '../causalState.js';
import { canonImports, canonExports } from '../canonicalAccessors.js';

const clamp01 = (/** @type {any} */ v) => Math.max(0, Math.min(1, Number(v) || 0));
const clamp0100 = (/** @type {any} */ v) => Math.max(0, Math.min(100, Number(v) || 0));

/**
 * @typedef {Object} MilitaryContributor
 * @property {string} facet    Which decomposition facet this contributor feeds
 *                             ('manpower' | 'institutions' | 'materiel' | 'logistics'
 *                             | 'economy' | 'will').
 * @property {string} source   Stable id of the input.
 * @property {string} effect   Short tag.
 * @property {number} delta    Signed points contributed to theoreticalCapacity (0..100 scale).
 * @property {string} reason   Human-readable explanation.
 */

/**
 * @typedef {Object} MilitaryCapacity
 * @property {number} theoreticalCapacity  0..100 — the full LATENT strength if fully
 *                                          mustered, before any deployment is subtracted.
 * @property {number} currentCapacity      0..100 — theoreticalCapacity AFTER the live
 *                                          erosions this model can see (war exhaustion /
 *                                          drain). B1/B2 subtract deployment on top.
 * @property {Object} facets               Named sub-scores (each 0..100) that compose the total.
 * @property {number} facets.manpower      Tier + population — the raw body of fighters.
 * @property {number} facets.institutions  Military + defensive institutions (garrison/watch/walls).
 * @property {number} facets.materiel      Weapons / armor / mounts / siege / magical-warfare goods + chains + imports.
 * @property {number} facets.logistics     Food reserves + supply resilience — can it sustain a campaign?
 * @property {number} facets.economy       economic_capacity — can it AFFORD a war?
 * @property {number} facets.will          Culture / government / deity / disposition toward war.
 * @property {Object} hooks                Hooks for the LIVE facets B1/B2 compute from deployment state.
 * @property {number} hooks.warExhaustion  0..1 the non-reverting scar this model could see.
 * @property {number} hooks.warDrain       0..1 the reverting per-tick bleed this model could see.
 * @property {number} hooks.armyDeployed   0..1 how much of the standing army is committed abroad.
 * @property {MilitaryContributor[]} contributors  The full trace.
 */

// ── Facet weights (sum to 1.0). Manpower + institutions dominate; will is a
// modest tilt (a thorpe of fanatics is still a thorpe). Calibrated so a
// well-found city sits far above a bare thorpe. ───────────────────────────────
const FACET_WEIGHTS = Object.freeze({
  manpower: 0.26,
  institutions: 0.24,
  materiel: 0.20,
  logistics: 0.12,
  economy: 0.10,
  will: 0.08,
});

// Goods / institution name patterns that signal MATERIEL — the proposal's
// weapons / armor / mounts / siege / magical-warfare / military-services list.
const MATERIEL_PATTERN = /weapon|armor|armour|blade|sword|spear|bow|arrow|smith|forge|foundry|siege|engine|catapult|ballista|trebuchet|mount|cavalry|warhorse|steed|powder|cannon|war ?machine|war ?magic|battle ?mage|arcane ?artillery|munition/i;
// Institutions that house military + defensive force.
const MILITARY_INSTITUTION_PATTERN = /garrison|barrack|armory|armoury|watch|militia|guard|fort|citadel|keep|bastion|war ?college|drill|mercenary|company|legion|warden|marshal/i;

// War-condition archetypes this model can observe (the LIVE-facet hooks). These
// are the same archetypes warDeployment stamps; this model only reads them.
const WAR_EXHAUSTION_ARCHETYPE = 'war_exhaustion';
const WAR_DRAIN_ARCHETYPE = 'war_drain';
const ARMY_DEPLOYED_ARCHETYPE = 'army_deployed';

// Culture / government / disposition signals that lift or lower martial WILL.
const MARTIAL_GOVERNMENT_PATTERN = /militar|autocra|junta|warlord|imperial|martial/i;
const PACIFIST_GOVERNMENT_PATTERN = /commune|peasant|monastic|mercantile|merchant|free city/i;

/** Resolve the bare settlement from either an `item` ({ settlement }) or a settlement. */
function settlementOf(/** @type {any} */ itemOrSettlement) {
  if (!itemOrSettlement || typeof itemOrSettlement !== 'object') return null;
  if (itemOrSettlement.settlement && typeof itemOrSettlement.settlement === 'object') {
    return itemOrSettlement.settlement;
  }
  return itemOrSettlement;
}

function tierRankFraction(/** @type {any} */ s) {
  const tier = s?.tier || s?.config?.tier || 'village';
  const rank = TIER_ORDER.indexOf(tier);
  const r = rank >= 0 ? rank : TIER_ORDER.indexOf('village');
  return r / Math.max(1, TIER_ORDER.length - 1); // 0..1
}

function populationOf(/** @type {any} */ s) {
  const pop = s?.population;
  if (typeof pop === 'number') return pop;
  if (pop && typeof pop === 'object' && typeof pop.total === 'number') return pop.total;
  return 0;
}

function namesFrom(/** @type {any[]} */ list) {
  return (Array.isArray(list) ? list : [])
    .map(g => String(g?.name || g?.id || g || ''))
    .filter(Boolean);
}

/** Strongest matching war-condition severity (0..1) for an archetype. */
function conditionSeverity(/** @type {any} */ s, /** @type {string} */ archetype) {
  const conditions = s?.activeConditions;
  if (!Array.isArray(conditions)) return 0;
  let max = 0;
  for (const c of conditions) {
    if (c && c.archetype === archetype) max = Math.max(max, Number(c.severity) || 0);
  }
  return clamp01(max);
}

/**
 * Derive the structured military capacity for a settlement (or worldPulse item).
 *
 * Pure + deterministic. `ctx` is reserved for B1/B2 (deployment state, a shared
 * snapshot); B0 ignores everything except an optional pre-derived economic score
 * passed as `ctx.economicCapacityScore` to avoid a redundant re-derive on the
 * hot path. All facets fall back to settlement-only reads.
 *
 * @param {any} itemOrSettlement   A worldPulse item ({ settlement }) or a bare settlement.
 * @param {{ economicCapacityScore?: number }} [ctx]
 * @returns {MilitaryCapacity}
 */
export function deriveMilitaryCapacity(itemOrSettlement, ctx = {}) {
  /** @type {MilitaryContributor[]} */
  const contributors = [];
  const s = settlementOf(itemOrSettlement);

  if (!s) {
    // Neutral envelope for a missing settlement — every facet at its floor.
    return {
      theoreticalCapacity: 0,
      currentCapacity: 0,
      facets: { manpower: 0, institutions: 0, materiel: 0, logistics: 0, economy: 0, will: 0 },
      hooks: { warExhaustion: 0, warDrain: 0, armyDeployed: 0 },
      contributors,
    };
  }

  const push = (/** @type {string} */ facet, /** @type {string} */ source, /** @type {string} */ effect, /** @type {number} */ delta, /** @type {string} */ reason) => {
    contributors.push({ facet, source, effect, delta, reason });
  };

  // ── manpower: tier + population ────────────────────────────────────────────
  const tierFrac = tierRankFraction(s);
  const pop = populationOf(s);
  // log10-scaled population, like settlementStrength, so a metropolis doesn't
  // dwarf everything linearly; tier carries most of the manpower signal.
  const popScore = pop > 0 ? Math.min(1, Math.log10(Math.max(10, pop)) / 5) : 0;
  let manpower = clamp0100(tierFrac * 70 + popScore * 30);
  push('manpower', 'config.tier', 'tier', Math.round(tierFrac * 70),
    `Tier provides the structural body of fighters (${Math.round(tierFrac * 100)}% of max tier).`);
  push('manpower', 'population', 'pool', Math.round(popScore * 30),
    `Population ${pop} sets the depth of the levy.`);

  // ── institutions: military + defensive ─────────────────────────────────────
  const institutions = Array.isArray(s.institutions) ? s.institutions : [];
  const milInstCount = institutions.filter((/** @type {any} */ i) => MILITARY_INSTITUTION_PATTERN.test(String(i?.name || ''))).length;
  const led = defenseLedger(s);
  // The defense ledger's military score (walls + garrison) is the conserved
  // defensive-force quantity; blend it with the raw military-institution count.
  let institutionsScore = clamp0100(led.military * 0.7 + Math.min(milInstCount, 5) / 5 * 30);
  push('institutions', 'defenseProfile.scores.military', 'force', Math.round(led.military * 0.7),
    `Conventional-force score ${led.military} (walls + garrison) anchors institutional strength.`);
  if (milInstCount > 0) {
    push('institutions', 'institutions', 'martial', Math.round(Math.min(milInstCount, 5) / 5 * 30),
      `${milInstCount} military/defensive institution(s) field organized force.`);
  }

  // ── materiel: weapons / armor / mounts / siege / war-magic goods + imports ──
  // Materiel is identified by GOOD/INSTITUTION CHARACTER (a weapons line, a forge),
  // not by joining to a catalog id — there is no catalog of "war goods" to key on.
  // We classify by regex .test() (the same idiom healingLedger / the military &
  // law-order institution patterns use), never a fuzzy name-collection join.
  const exportNames = namesFrom(canonExports(s));
  const importNames = namesFrom(canonImports(s));
  const materielInstHits = institutions.filter((/** @type {any} */ i) => MATERIEL_PATTERN.test(String(i?.name || ''))).length;
  const materielHits =
    exportNames.filter((/** @type {string} */ n) => MATERIEL_PATTERN.test(n)).length
    + materielInstHits;
  const materielImports = importNames.filter((/** @type {string} */ n) => MATERIEL_PATTERN.test(n)).length;
  // A settlement that PRODUCES war materiel is strong; one that can IMPORT it has
  // access but at a discount (it does not control supply). 50 baseline so a
  // settlement with no materiel signal is middling, not zero.
  let materiel = clamp0100(50 + Math.min(materielHits, 6) * 7 + Math.min(materielImports, 4) * 3);
  if (materielHits > 0) {
    push('materiel', 'economicState.primaryExports', 'produces', Math.min(materielHits, 6) * 7,
      `${materielHits} domestic weapons/armor/siege/war-magic source(s).`);
  }
  if (materielImports > 0) {
    push('materiel', 'economicState.primaryImports', 'imports', Math.min(materielImports, 4) * 3,
      `${materielImports} imported military-materiel line(s): access without control.`);
  }
  if (materielHits === 0 && materielImports === 0) {
    push('materiel', 'economicState', 'none', 0, 'No specialized war materiel. It fights with what tools the town has.');
  }

  // ── logistics: food reserves + supply resilience ───────────────────────────
  const food = foodLedger(s);
  // storageMonths (buffer) + resilienceScore (composite). A campaign eats reserves.
  const storageContribution = Math.min(food.storageMonths, 12) / 12 * 40; // up to +40 for 12mo buffer
  let logistics = clamp0100(food.resilienceScore * 0.6 + storageContribution);
  push('logistics', 'economicState.foodSecurity.resilienceScore', 'supply', Math.round(food.resilienceScore * 0.6),
    `Food resilience ${food.resilienceScore} governs whether the army can be fed in the field.`);
  if (food.storageMonths > 0) {
    push('logistics', 'economicState.foodSecurity.storageMonths', 'reserves', Math.round(storageContribution),
      `${food.storageMonths} months of stored food sustain a campaign.`);
  }

  // ── economy: economic_capacity (can it AFFORD war?) ────────────────────────
  const economyScore = typeof ctx.economicCapacityScore === 'number'
    ? clamp0100(ctx.economicCapacityScore)
    : clamp0100(/** @type {any} */ (deriveSystemVariable('economic_capacity', s))?.score ?? 50);
  const economy = economyScore;
  push('economy', 'causalState.economic_capacity', 'affordability', Math.round(economy - 50),
    `Economic capacity ${Math.round(economy)} sets how long the treasury can pay for a war.`);

  // ── will: culture / government / deity / disposition toward war ────────────
  let will = 50;
  const governmentLabel = String(s?.powerStructure?.government || s?.config?.government || '');
  if (MARTIAL_GOVERNMENT_PATTERN.test(governmentLabel)) {
    will += 14; push('will', 'powerStructure.government', 'martial', +14, `${governmentLabel} is built for war.`);
  } else if (PACIFIST_GOVERNMENT_PATTERN.test(governmentLabel)) {
    will -= 10; push('will', 'powerStructure.government', 'pacific', -10, `${governmentLabel} has little appetite for war.`);
  }
  // Embedded primary-deity temper (DORMANT until a deity is assigned — a deity-
  // free settlement reads none of this, preserving the dormancy guarantee).
  const deity = s?.config?.primaryDeitySnapshot;
  const temper = deity && typeof deity === 'object' ? String(deity.temperAxis || deity.temper || '') : '';
  if (/warlike|war/i.test(temper)) {
    will += 8; push('will', deity?._deityRef || 'primaryDeity', 'warlike_deity', +8, `${deity?.name || 'The patron deity'} blesses war.`);
  } else if (/peace/i.test(temper)) {
    will -= 6; push('will', deity?._deityRef || 'primaryDeity', 'peaceful_deity', -6, `${deity?.name || 'The patron deity'} counsels peace.`);
  }
  will = clamp0100(will);

  // ── compose the theoretical total ──────────────────────────────────────────
  const facets = { manpower, institutions: institutionsScore, materiel, logistics, economy, will };
  const theoreticalCapacity = clamp0100(
    facets.manpower * FACET_WEIGHTS.manpower
    + facets.institutions * FACET_WEIGHTS.institutions
    + facets.materiel * FACET_WEIGHTS.materiel
    + facets.logistics * FACET_WEIGHTS.logistics
    + facets.economy * FACET_WEIGHTS.economy
    + facets.will * FACET_WEIGHTS.will,
  );

  // ── live erosions this model can see (war exhaustion / drain) ──────────────
  // war_exhaustion is the non-reverting scar; war_drain the reverting bleed. Both
  // are stamped ONLY by the gated war layer, so a no-war settlement carries
  // neither ⇒ currentCapacity === theoreticalCapacity. army_deployed is exposed as
  // a hook (the war layer turns it into the deployed/homeDefense split), not subtracted here.
  const warExhaustion = conditionSeverity(s, WAR_EXHAUSTION_ARCHETYPE);
  const warDrain = conditionSeverity(s, WAR_DRAIN_ARCHETYPE);
  const armyDeployed = conditionSeverity(s, ARMY_DEPLOYED_ARCHETYPE);
  // Up to -22 for full exhaustion, -18 for full drain — current strength bends
  // under a sustained war while the latent (theoretical) base stays put.
  const erosion = warExhaustion * 22 + warDrain * 18;
  if (warExhaustion > 0) {
    push('will', 'condition.war_exhaustion', 'scar', -Math.round(warExhaustion * 22),
      `War exhaustion (${warExhaustion.toFixed(2)}) saps current fighting strength.`);
  }
  if (warDrain > 0) {
    push('economy', 'condition.war_drain', 'bleed', -Math.round(warDrain * 18),
      `War drain (${warDrain.toFixed(2)}) erodes the strength available right now.`);
  }
  const currentCapacity = clamp0100(theoreticalCapacity - erosion);

  return {
    theoreticalCapacity,
    currentCapacity,
    facets,
    hooks: { warExhaustion, warDrain, armyDeployed },
    contributors,
  };
}

/**
 * The single 0..1 latent-strength scalar, for callers that want one number from
 * the richer model (B1 may use this where settlementStrength is too coarse). This
 * is the THEORETICAL capacity normalized — distinct from settlementStrength, which
 * stays the contest's confidence input.
 *
 * @param {any} itemOrSettlement
 * @param {{ economicCapacityScore?: number }} [ctx]
 * @returns {number} 0..1
 */
export function militaryCapacityScalar(itemOrSettlement, ctx = {}) {
  return clamp01(deriveMilitaryCapacity(itemOrSettlement, ctx).theoreticalCapacity / 100);
}
