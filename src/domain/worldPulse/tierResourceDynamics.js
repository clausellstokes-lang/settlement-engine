import { clamp01 } from '../../kernel/math.js';
import { POPULATION_RANGES, TIER_ORDER, TIER_STAMP_CUTS, popToTier } from '../../data/constants.js';
import { canonExports, canonImports } from '../canonicalAccessors.js';
import { SUPPLY_CHAIN_NEEDS } from '../../data/goods/chains.js';
import { RESOURCE_TO_CHAINS } from '../../data/goods/chains.js';
import { RESOURCE_DATA } from '../../data/goods/identity.js';
import { exactGoodId } from '../region/goodsCatalog.js';
import {
  nativeSemanticDepletedResourceKeys,
  nativeSemanticResourceKeys,
} from '../content/customContentSemanticAuthority.js';
import { stablePart } from './worldState.js';
// STYLE-2 C2 (SW-12): the depletion summary's vantages, chosen by the house idiom — the
// zero-import selection kernel keyed on the candidate's own stable id (no rng draw).
import { pickLine } from './proseSelection.js';
/** The slots a prose line fills (STYLE-2 SW-12). @typedef {Record<string, string|number|boolean>} TierLineSlots */
import { formatCount } from '../formatNumber.js';
import { intensityMultiplier, normalizeSimulationRules } from './simulationRules.js';
// CL-0: every candidate family consults the per-domain change-authority policy.
// authorityFor passes each site's legacy gate through VERBATIM under
// routine/full autonomy (byte-identical), and forces 'proposal' under the new
// dm_only/recommendations modes. Tier/resource candidates do NOT flow through
// the evaluateWorldPulseRules choke point, so they consult the policy here.
import { authorityFor } from './changeAuthorityPolicy.js';
import { canRecoverResource, classifyResource } from './resourceTaxonomy.js';
import { reconcileProductionAfterResourceChange } from './resourceDynamicsKernel.js';
// Phase 4 W-F4b (item 2b) — development fidelity: a chaotic-devout economy mis-RANKS
// its value chains, acting on a NOISY ESTIMATE of resource pressure (suboptimal
// expansions, late pivots, lingering on saturated chains). chaosPull 0 (lawful/neutral/
// no-piety) ⇒ factor 1, no rng forked ⇒ byte-identical; and with no injected rng the
// term is inert, so every existing evaluateTierResourceDynamics caller is unchanged.
import { fidelityFactor, chaosPullOf } from './fidelityNoise.js';
// W-F8: the martial-readiness tilt on the value ranking — war-supply chains score higher
// in a militarized town, civilian chains take an upkeep drag (guns-vs-butter, brake 1).
// readinessOf 0 (no martial record) ⇒ both factors 1 ⇒ byte-identical.
import { readinessOf, readinessValueTilt, readinessUpkeepDrag } from './martialReadiness.js';
import { isWarSupplyResource } from './moralMartialLean.js';
import { liveInstitutions } from '../institutions/institutionRoster.js';
// WAVE P1a (docs/DESIGN_DEMOGRAPHIC_ENGINE.md §7b) — THE VIABILITY LADDER'S ONE INPUT.
// Design §0b is explicit that a density-driven demotion would be a SECOND WRITER on a
// transition this module already owns, so the ladder arrives as an EXTRA INPUT to the
// eligibility below and NEVER as a second lane. `tierViabilityOf` is a pure read; the
// tier transition is still authored here and nowhere else. Dark (`demographicsEnabled`
// absent, the virtual default) the input is not even computed.
import { demographicsActive, tierViabilityOf } from './demographicsRates.js';
// §810 R5's version gate, read HERE (where the settlement and the rules both are) rather
// than at the applier, which sees neither the rules nor a reason to carry the density
// family in its first-paint import closure.
import { rollsRegisterVii } from '../density/densityLaw.js';

// Minimum pressure for the city+ depletion floor to fire. The tier branch used to
// emit depletion candidates regardless of pressure, so a quiescent zero-pressure
// city still spammed ~8/tick — making resource_depletion the #1 candidate family.
// Gating it here leaves a ~0.13 hysteresis dead-zone above recovery's 0.32 ceiling.
const RESOURCE_CITY_FLOOR_PRESSURE = 0.45;

/** @param {any} value */

/** @param {any} tier */
function tierRank(tier) {
  const idx = TIER_ORDER.indexOf(tier);
  return idx >= 0 ? idx : TIER_ORDER.indexOf('village');
}

/**
 * @param {any} pressureIdx
 * @param {any} settlementId
 * @param {any} kind
 */
function pressure(pressureIdx, settlementId, kind) {
  return pressureIdx?.get?.(settlementId, kind)?.score || 0;
}

/**
 * @param {any} pressureIdx
 * @param {any} settlementId
 */
function supportScore(pressureIdx, settlementId) {
  const food = pressure(pressureIdx, settlementId, 'food');
  const conflict = pressure(pressureIdx, settlementId, 'conflict');
  const trade = pressure(pressureIdx, settlementId, 'trade');
  const legitimacy = pressure(pressureIdx, settlementId, 'legitimacy');
  const disease = pressure(pressureIdx, settlementId, 'disease');
  return clamp01(1 - (food * 0.22 + conflict * 0.24 + trade * 0.2 + legitimacy * 0.2 + disease * 0.14));
}

// ── Tier-outcome APPLIER — extracted to ./tierOutcomeApply.js ───────────────
// The applier + its catalog helpers (entriesForTier, catalogEntryByName,
// existingInstitutionNames, promotion/demotion surgery) moved VERBATIM to the
// dependency-light leaf tierOutcomeApply.js (W2b byte-budget extraction): the
// SHIFT_TIER event handler reuses the single-source applier from the EAGER
// mutation router, and importing it from THIS module dragged the whole
// evaluation machinery (canonicalAccessors, supplyChainData, goodsCatalog,
// worldState, simulationRules, resourceTaxonomy) into the first-paint closure.
// Imported + re-exported verbatim here so every sim consumer is unchanged.
import {
  entriesForTier, catalogEntryByName, existingInstitutionNames,
  applyTierOutcomeToSettlement,
} from './tierOutcomeApply.js';
export { entriesForTier, catalogEntryByName, existingInstitutionNames, applyTierOutcomeToSettlement };

/**
 * @param {any} direction
 * @param {any} targetTier
 */
function requiredStreak(direction, targetTier) {
  const rank = tierRank(targetTier);
  return direction === 'promotion'
    ? Math.max(2, rank + 1)
    : Math.max(2, Math.ceil((rank + 1) / 2));
}

/**
 * THE ONE TIER-TRANSITION ELIGIBILITY (promotion and demotion both). Wave P1a extends
 * its INPUTS rather than forking a second lane, per design §0b.
 *
 * @param {any} item
 * @param {any} pressureIdx
 * @param {import('./demographicsRates.js').TierViability|null} [demography] the wave-P
 *   viability read, supplied ONLY when `demographicsEnabled` is lit. NULL means dark,
 *   and every line that consults it below falls back to the legacy expression exactly.
 */
function tierEligibility(item, pressureIdx, demography = null) {
  const settlement = item.settlement || {};
  const currentTier = settlement.tier || popToTier(settlement.population || 0);
  const rank = tierRank(currentTier);
  const pop = Math.max(0, Math.round(Number(settlement.population) || 0));
  const support = supportScore(pressureIdx, item.id);
  const nextTier = TIER_ORDER[rank + 1] || null;
  const previousTier = TIER_ORDER[rank - 1] || null;
  // ── EARNED ASCENSION (design §5, wave P1a) ────────────────────────────────────
  // Lit, the population must ALREADY BE THERE: promotion needs the next tier's whole
  // stamp cut (read below), not 92 percent of it. This is the paired half of removing the
  // promotion mint in tierOutcomeApply.js, and the two MUST travel together. The 0.92
  // window exists precisely because the mint covered the gap it opens: promote a
  // settlement at 92 percent of the floor without minting the difference and it lands
  // under its own tier's minimum, where `strainedBelowFloor` below can demote it on the
  // very next tick, which is the promote/demote churn loop the mint was built to stop.
  // Requiring the full floor closes the gap at the source instead of papering it with
  // people who were never born (law 4: damage transmutes, people account).
  const promotionWindow = demography ? 1 : 0.92;
  // ── THE WINDOW READS THE STAMP (LANDING-7, ruling R-B1; X-46 car 2's law) ──────────────
  // The population the window is measured against is the next tier's STAMP CUT
  // (`TIER_STAMP_CUTS`), the one disjoint population → tier law, not that tier's roll-band
  // minimum. Under the owner's overlapping roll bands (X-46 car 1) the band minimum sits
  // inside the lower tier's band (a town's 300 inside the village's 75–400), so 0.92 of it
  // made a calm place eligible across ~38% of the village band and ~30% of the town band.
  // The factor stays on the window: it is the promotion's lead-in, paired with the mint and
  // the demotion floor, which read the CURRENT tier's roll-band minimum — a settlement's own
  // band is where generation may legitimately put it, so those stay on the band. Every
  // cut's 0.92 lies at or above the next tier's band minimum except metropolis, whose cut is
  // its band minimum, so the pairing the mint guards is unchanged.
  const nextCut = nextTier ? /** @type {Record<string, number>} */ (TIER_STAMP_CUTS)[nextTier] : undefined;

  if (nextTier && pop >= (nextCut || Infinity) * promotionWindow && support >= 0.62) {
    return {
      direction: 'promotion',
      fromTier: currentTier,
      toTier: nextTier,
      support,
      severity: clamp01((pop / (/** @type {any} */ (POPULATION_RANGES)[nextTier]?.min || pop)) * 0.45 + support * 0.55),
      // STYLE-2 C2 (SW-12): the town leads, never the lower-cased tier token; the support
      // vector is trade, defence and legitimacy, said as trade, walls and rule.
      reason: `${item.name || item.id} has nearly the people of a ${nextTier}, and the trade, walls and rule to keep them.`,
    };
  }

  const currentMin = /** @type {any} */ (POPULATION_RANGES)[currentTier]?.min || 0;
  const hardPopulationFailure = previousTier && pop < currentMin * 0.82;
  const structuralFailure = previousTier && support <= 0.25;
  const strainedBelowFloor = previousTier && pop < currentMin && support < 0.45;
  // ── THE VIABILITY LADDER'S INPUT (design §7b, wave P1a) ───────────────────────
  // Nonzero population and functioning-settlement status are different facts. The three
  // legacy tests all ask about the HEAD COUNT and the support vector; this one asks
  // whether the place can still be a settlement of this grade at all, by comparing the
  // effective bound min(K_food, D_tier) against the tier's own population floor. A town
  // whose granaries and ground together hold fewer souls than a town needs is failing
  // whatever its current census says, and it descends the ladder toward the terminal
  // lane instead of standing frozen at three hundred people forever. Dark, `demography`
  // is null and this term is exactly false.
  const demographicFailure = !!previousTier && demography != null && demography.nonviable === true;
  if (hardPopulationFailure || structuralFailure || strainedBelowFloor || demographicFailure) {
    const demographicOnly = demographicFailure && !hardPopulationFailure && !structuralFailure && !strainedBelowFloor;
    return {
      direction: 'demotion',
      fromTier: currentTier,
      toTier: previousTier,
      support,
      severity: clamp01((1 - support) * 0.6 + (currentMin ? Math.max(0, 1 - pop / currentMin) : 0) * 0.4),
      reason: demographicOnly && demography
        ? `${item.name || item.id} can no longer be fed or housed as a ${currentTier}: the ${demography.binding === 'granary' ? 'granaries' : 'walls'} hold about ${formatCount(demography.bound)} souls, under the ${formatCount(currentMin)} a ${currentTier} needs.`
        : `${item.name || item.id} no longer has the people, trade, walls or rule a ${currentTier} needs.`,
    };
  }

  return null;
}

// rules is the normalized output of normalizeSimulationRules (see
// evaluateTierResourceDynamics); tierCandidate reads rules.majorChangesRequireProposal,
// mirroring resourceCandidatesFor in this module. item/drift/tick are left untyped to
// match that sibling and the file's strict-error baseline; rules carries a narrow
// inline type for the one flag it consults so it stays strict-clean.
/**
 * @param {any} item
 * @param {any} drift
 * @param {any} tick
 * @param {{ majorChangesRequireProposal?: boolean, demographicsEnabled?: boolean }} rules
 *   `demographicsEnabled` is the wave-P virtual flag, declared on THIS typedef (the
 *   owning surface) rather than reached for through a cast.
 */
function tierCandidate(item, drift, tick, rules) {
  const minimum = requiredStreak(drift.direction, drift.toTier);
  if (drift.streak < minimum) return null;
  // ── LAW 4, STAMPED ON THE OUTCOME (design §1 law 4, wave P1a) ─────────────────
  // A tier change may be parked as a proposal and applied MANY ticks later, and the
  // applier (tierOutcomeApply.js) receives only (settlement, outcome) with no access to
  // the rules. So the conservation law in force when the candidate was minted travels
  // WITH it, as a conditional key that is simply absent when dark. Absent means the
  // legacy unconserved promotion mint, which a golden depends on; present means the
  // promotion raises the tier and touches nobody's head count.
  const populationConserved = rules.demographicsEnabled === true;
  // ── §810.1 R7, STAMPED ON THE OUTCOME BY THE SAME PRECEDENT, ONE LINE ABOVE ──────
  // R7: "when a settlement crosses a tier boundary, the political fabric THICKENS
  // toward the new tier's band at a slow rolled cadence — one emergence per interval,
  // NEVER AN INSTANT SPROUT". The cadence itself lives in the pulse's density lane; what
  // the CROSSING owes it is the moment to start counting from, so a settlement that took
  // a cadence step two ticks ago does not sprout a house the tick after it is promoted.
  //
  // It rides the outcome for the reason `populationConserved` does and for one more:
  // tierOutcomeApply.js is a deliberately dependency-light leaf whose whole import list
  // lands in the first-paint closure, and a version read there would put the density
  // family in that closure to answer a question this mint can already answer.
  //
  // A CONDITIONAL KEY, ABSENT WHEN DARK — not `false`. The dark path's tierChange is
  // serialized into pulseHistory and a frozen golden hashes it, so an always-present key
  // would move every dark campaign's bytes. Absent is what v1 looks like.
  const densityBandCrossed = rollsRegisterVii(item?.settlement?.config);
  const chance = clamp01(0.18 + (drift.streak - minimum + 1) * 0.13 + drift.severity * 0.24);
  return {
    id: `candidate.tier.${drift.direction}.${stablePart(item.id)}.${tick}`,
    type: 'tier',
    candidateType: `tier_${drift.direction}`,
    ruleId: `tier_${drift.direction}`,
    ruleFamily: 'tier',
    targetSaveId: item.id,
    severity: drift.severity,
    probability: chance,
    // Honor majorChangesRequireProposal, consistent with resource_depletion in
    // this module: a tier change stays a DM proposal under the conservative
    // default (flag on), and auto-applies only when a campaign opts out of
    // proposal gating (flag off, e.g. dramatic_campaign). CL-0: the flag gate
    // is the LEGACY mode fed through authorityFor (verbatim under routine/full;
    // forced to proposal under dm_only/recommendations).
    applyMode: authorityFor(rules, 'tier_change', rules.majorChangesRequireProposal ? 'proposal' : 'auto'),
    // ⛔ THE HERALD SPEAKS IN DEEDS (owner, 2026-10-02: "Updates like these need to reflect actions not to potential"): under way, then done.
    headline: drift.direction === 'promotion'
      ? `${item.name || item.id} is growing into a ${drift.toTier}`
      : `${item.name || item.id} is shrinking to a ${drift.toTier}`,
    appliedHeadline: drift.direction === 'promotion'
      ? `${item.name || item.id} becomes a ${drift.toTier}`
      : `${item.name || item.id} falls to a ${drift.toTier}`,
    // Eligibility is conjunctive in substance: population proximity/failure
    // and the support vector jointly decide a tier drift. Name both here so
    // the DM never reads the streak as a population-only threshold.
    // The streak and the eligibility test stay in `reasons`; the line names both halves of the
    // change in the world's terms (people AND what sustains them), never the threshold.
    summary: drift.direction === 'promotion'
      ? `${item.name || item.id} has been growing steadily, in people and in trade.`
      : `${item.name || item.id} has been losing people and trade steadily.`,
    reasons: [
      drift.reason,
      // STYLE-2 C2 (SW-12): the eligibility streak stays in the receipt (the Voice Program's
      // pin), in words; the odds line is struck (the roll is the engine's, not the reader's).
      pickLine(STREAK_REASON, `candidate.tier.${drift.direction}.${stablePart(item.id)}.${tick}`, { n: drift.streak, unit: drift.streak === 1 ? 'pulse' : 'pulses', min: minimum }),
    ],
    tierChange: {
      saveId: item.id,
      fromTier: drift.fromTier,
      toTier: drift.toTier,
      direction: drift.direction,
      ...(populationConserved ? { populationConserved: true } : {}),
      ...(densityBandCrossed ? { densityBandCrossed: true } : {}),
    },
    proposalPayload: {
      kind: 'tier_change',
      saveId: item.id,
      fromTier: drift.fromTier,
      toTier: drift.toTier,
      direction: drift.direction,
    },
    metadata: {
      support: drift.support,
      streak: drift.streak,
      minimumStreak: minimum,
    },
    conflictTags: [`tier:${item.id}`, `proposal:tier:${item.id}`],
  };
}

/**
 * Native resources eligible for the built-in depletion/recovery taxonomy.
 *
 * The top-level roster is a legacy save shape. Once config owns either roster
 * sidecar, unioning that legacy field back in would let a custom namesake
 * masquerade as its built-in counterpart.
 *
 * @param {import('../settlement.schema.js').SimSettlement} settlement
 * @returns {string[]}
 */
function resourceList(settlement) {
  const config = settlement?.config || {};
  const source = (
    Array.isArray(config.nearbyResources)
    || Array.isArray(config.nearbyResourcesNative)
  )
    ? nativeSemanticResourceKeys(config)
    : /** @type {unknown[]} */ (settlement?.nearbyResources || []);
  return source
    .filter(Boolean)
    .map(value => String(value))
    .filter((value, index, values) => values.indexOf(value) === index);
}

/**
 * @param {import('../settlement.schema.js').SimSettlement} settlement
 * @param {any} resource
 */
function resourceState(settlement, resource) {
  const config = settlement?.config || {};
  const wanted = String(resource).toLowerCase();
  const nativeDepleted = nativeSemanticDepletedResourceKeys(config)
    .some(key => String(key).toLowerCase() === wanted);
  // Current settlements carry exact native-depletion authority. The mixed
  // state map can truthfully remain "depleted" for an exact custom namesake
  // while the native resource is abundant, so native simulation must not read
  // it once this sidecar exists.
  if (Array.isArray(config.nearbyResourcesNativeDepleted)) {
    return nativeDepleted ? 'depleted' : 'allow';
  }
  const explicit = config.nearbyResourcesState?.[resource];
  if (explicit) return explicit;
  if (
    !Array.isArray(config.nearbyResources)
    && !Array.isArray(config.nearbyResourcesNative)
  ) {
    return /** @type {unknown[]} */ (
      Array.isArray(settlement?.nearbyResourcesDepleted)
        ? settlement.nearbyResourcesDepleted
        : []
    )
      .some(key => String(key).toLowerCase() === wanted)
      ? 'depleted'
      : 'allow';
  }
  return nativeDepleted ? 'depleted' : 'allow';
}

/**
 * @param {any} item
 * @param {any} pressureIdx
 */
function resourcePressure(item, pressureIdx) {
  const systemValue = item?.system?.resourcePressure?.value;
  if (Number.isFinite(systemValue)) return clamp01(systemValue / 100);
  return clamp01(pressure(pressureIdx, item.id, 'food') * 0.4 + pressure(pressureIdx, item.id, 'trade') * 0.35 + pressure(pressureIdx, item.id, 'conflict') * 0.25);
}

/** @param {any} value */
function tokenSet(value) {
  return new Set(String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .split(/\s+/)
    .filter(token => token.length >= 4));
}

/**
 * @param {any} text
 * @param {any} resource
 */
function textMatchesResource(text, resource) {
  const resourceTokens = tokenSet(resource);
  if (!resourceTokens.size) return false;
  const haystack = String(text || '').toLowerCase();
  return [...resourceTokens].some(token => haystack.includes(token));
}

// Mirror of goodsCatalog's comparable(): annotation-stripped, alnum-only form
// so 'River fish (taxed by occupation)' compares equal to 'River fish'.
/** @param {any} value */
function comparableLabel(value) {
  return String(value || '')
    .replace(/\([^)]*\)/g, ' ')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Resource key → the trade labels its economy actually prints on the ledger:
// RESOURCE_DATA tradeGoods plus every good along the chains the resource feeds
// (raw inputs, intermediates, outputs — deriveExportsFromChains exports raw
// forms and processed outputs alike, and substitution can run a sibling chain
// like river_fishing off 'Fishing grounds'). The key's own words
// ('fishing_grounds') rarely appear in those labels ('River fish', 'Raw wool'),
// which is why a token match alone called canonically-exported resources
// local-only. Static data, so resolved once per resource key.
const resourceGoodsVocabularyCache = new Map();
/** @param {any} resource */
function resourceGoodsVocabulary(resource) {
  const key = String(resource || '');
  const cached = resourceGoodsVocabularyCache.get(key);
  if (cached) return cached;
  const goods = new Set(/** @type {any} */ (RESOURCE_DATA)[key]?.tradeGoods || []);
  for (const composite of /** @type {any} */ (RESOURCE_TO_CHAINS)[key] || []) {
    const [needKey, ...innerParts] = String(composite).split('.');
    const chain = (/** @type {any} */ (SUPPLY_CHAIN_NEEDS)[needKey]?.chains || []).find((/** @type {any} */ c) => c.id === innerParts.join('.'));
    if (!chain) continue;
    for (const good of chain.rawInputs || []) goods.add(good);
    for (const good of chain.intermediateGoods || []) goods.add(good);
    for (const good of chain.outputs || []) goods.add(good);
  }
  const vocabulary = {
    labels: new Set([...goods].map(comparableLabel).filter(Boolean)),
    ids: new Set([...goods].map(exactGoodId).filter(Boolean)),
  };
  resourceGoodsVocabularyCache.set(key, vocabulary);
  return vocabulary;
}

/**
 * @param {any} labels
 * @param {any} resource
 */
function tradeListMatchesResource(labels, resource) {
  const vocabulary = resourceGoodsVocabulary(resource);
  return (labels || []).some((/** @type {any} */ label) => {
    const id = exactGoodId(label);
    if (id != null && vocabulary.ids.has(id)) return true;
    return vocabulary.labels.has(comparableLabel(label));
  });
}

/** Exported for pin tests: classification feeds depletion trade-load and the
 *  primary-export recovery block, so mislabeling an exported resource as
 *  local-only underweights it in the drift logic.
 *  @param {import('../settlement.schema.js').SimSettlement} settlement
 *  @param {any} resource */
export function resourceEconomicRole(settlement, resource) {
  // Route through the canonical accessors, NOT settlement.economicState.primaryExports
  // directly: a legacy save stores the trade lists under the `exports`/`imports` alias,
  // which canonExports/canonImports resolve. Reading primaryExports directly here would
  // see empty lists and misclassify every resource as local_resource (the same
  // dead-field class as the capacityModel bug canonicalAccessors was created to fix).
  const exportsList = canonExports(settlement);
  const importsList = canonImports(settlement);
  // Canonical goods vocabulary first (verbatim chain labels + exact good ids,
  // which survive subsumption renames); token match stays as the fallback for
  // custom labels that mention the resource by name.
  const exportAnchor = tradeListMatchesResource(exportsList, resource)
    || textMatchesResource(exportsList.join(' '), resource);
  const importDependency = tradeListMatchesResource(importsList, resource)
    || textMatchesResource(importsList.join(' '), resource);
  if (exportAnchor && importDependency) return 'export_and_import';
  if (exportAnchor) return 'primary_export';
  if (importDependency) return 'primary_import';
  return 'local_resource';
}

/**
 * @param {any} item
 * @param {any} pressureIdx
 * @param {any} rules
 * @param {any} tick
 * @param {any} previousDrift
 * @param {{ fork?: (key: string) => { random: () => number } }|null} [rng]  W-F4b: the pulse PRNG (DI'd) — enables the development-fidelity term; absent ⇒ inert.
 */
// STYLE-2 C2 (SW-12) — the tier change's streak receipt (pinned to stay in the receipt), in
// words: how long the drift has held and how long the change needed.
const STREAK_REASON = Object.freeze([
  (/** @type {TierLineSlots} */ x) => `This has held for ${x.n} ${x.unit} in a row, and the change needed ${x.min}.`,
  (/** @type {TierLineSlots} */ x) => `It has gone this way ${x.n} ${x.unit} running; ${x.min} were needed before the change.`,
  (/** @type {TierLineSlots} */ x) => `For ${x.n} ${x.unit} it has kept on this way, and the change needed ${x.min}.`,
]);

// STYLE-2 C2 (SW-12) — the depletion summary, four vantages on the same fact: the town takes
// more from a resource than it gives back. The resource may be singular or plural ("stone
// quarry", "grain fields"), so no line makes a verb agree with it.
const DEPLETION_SUMMARY = Object.freeze([
  (/** @type {TierLineSlots} */ x) => `${x.name} is taking more from its ${x.res} than the land can give back.`,
  (/** @type {TierLineSlots} */ x) => `Those who work ${x.name}'s ${x.res} come back with less than they used to.`,
  (/** @type {TierLineSlots} */ x) => `${x.name}'s rulers will soon need another source than its ${x.res}.`,
  (/** @type {TierLineSlots} */ x) => `There is less to take from ${x.name}'s ${x.res} than there was, and still ${x.name} takes.`,
]);
const DEPLETION_DRAW_HEAVY = Object.freeze([
  (/** @type {TierLineSlots} */ x) => `${x.name} is drawing heavily on its ${x.res}.`,
  (/** @type {TierLineSlots} */ x) => `${x.name} takes hard from its ${x.res}.`,
  (/** @type {TierLineSlots} */ x) => `Much is being taken from ${x.name}'s ${x.res}.`,
]);
// The city floor's receipt (a city or larger depletes under a lighter draw).
const DEPLETION_TIER = Object.freeze([
  (/** @type {TierLineSlots} */ x) => `A ${x.tier} takes a great deal from the land around it.`,
  (/** @type {TierLineSlots} */ x) => `A ${x.tier} the size of ${x.name} needs more than the land can easily give.`,
  (/** @type {TierLineSlots} */ x) => `${x.name} is a ${x.tier}, and a ${x.tier} uses a great deal.`,
]);

function resourceCandidatesFor(item, pressureIdx, rules, tick, previousDrift, rng = null) {
  const settlement = item.settlement || {};
  const resources = resourceList(settlement);
  if (!resources.length) return [];
  const rank = tierRank(settlement.tier);
  const pressureScore = resourcePressure(item, pressureIdx);
  const multiplier = intensityMultiplier(rules);
  // W-F4b item 2b: the settlement's development-fidelity pull — 0 (⇒ every perceived
  // pressure equals the true pressure, byte-identical) unless it carries a chaotic-devout
  // patron with a projected piety record. Computed once per settlement.
  const chaosPull = rng ? chaosPullOf(settlement) : 0;
  // W-F8: the militarization state — 0 (both readiness factors 1, byte-identical) unless a
  // projected martial record is present. rng-gated like chaosPull so rng-less estimate
  // paths stay byte-identical. Precomputed per settlement (the value tilt / upkeep drag).
  const readiness01 = rng ? readinessOf(settlement) : 0;
  const warSupplyTilt = readiness01 > 0 ? readinessValueTilt(settlement) : 1;   // ≥1 on war-supply chains
  const upkeepDrag = readiness01 > 0 ? readinessUpkeepDrag(settlement) : 1;     // ≤1 on civilian chains
  const out = [];

  for (const resource of resources.slice(0, 8)) {
    const state = resourceState(settlement, resource);
    const economicRole = resourceEconomicRole(settlement, resource);
    const taxonomy = classifyResource(resource);
    const tradeLoad = economicRole === 'primary_export' || economicRole === 'export_and_import' ? 0.12 : economicRole === 'primary_import' ? 0.06 : 0;
    // W-F8 readiness tilt on the VALUE ranking: a militarized town leans into war-supply
    // chains (ore/smelting/weapons/leather/horses/timber — WAR_SUPPLY_CHAINS) and lets
    // civilian chains take the garrison-upkeep drag. Factor 1 when no martial record.
    const readinessTilt = readiness01 > 0 ? (isWarSupplyResource(resource) ? warSupplyTilt : upkeepDrag) : 1;
    // The chaotic-devout economy acts on a NOISY per-chain estimate of pressure (its
    // value ranking) — so it over/under-develops the wrong chains. Seeded per (site,
    // tick,settlement,resource); factor EXACTLY 1 (byte-identical) when chaosPull ≤ 0.
    const perceivedNoise = fidelityFactor({ rng, site: 'development', tick, cid: String(item.id), decisionKey: `chain:${resource}`, chaosPull });
    const effectivePressure = clamp01((pressureScore + tradeLoad) * perceivedNoise * readinessTilt);
    // The same noisy estimate governs the RECOVERY decision (a chaotic economy is late
    // to reopen a saturated chain). Equals pressureScore exactly when chaosPull ≤ 0.
    const perceivedPressureScore = clamp01(pressureScore * perceivedNoise * readinessTilt);
    if (
      taxonomy.randomDepletionEligible !== false
      && state !== 'depleted'
      && (
        effectivePressure >= 0.64
        || (
          rank >= tierRank('city')
          && effectivePressure >= RESOURCE_CITY_FLOOR_PRESSURE
        )
      )
    ) {
      const severity = clamp01(effectivePressure * 0.55 + rank / (TIER_ORDER.length - 1) * 0.35 + multiplier * 0.1);
      out.push({
        id: `candidate.resource.deplete.${stablePart(item.id)}.${stablePart(resource)}.${tick}`,
        type: 'resource',
        candidateType: 'resource_depletion',
        ruleId: 'resource_depletion',
        ruleFamily: 'resource',
        targetSaveId: item.id,
        severity,
        probability: clamp01(0.05 + severity * 0.34),
        applyMode: authorityFor(rules, 'resource_depletion', rules.majorChangesRequireProposal && severity >= 0.78 ? 'proposal' : 'auto'),
        // ⛔ THE HERALD SPEAKS IN DEEDS (owner, 2026-10-02: "Updates like these need to reflect actions not to potential"): under way, then done.
        headline: `${item.name || item.id} is exhausting its ${resource.replace(/_/g, ' ')}`,
        appliedHeadline: `${item.name || item.id} has exhausted its ${resource.replace(/_/g, ' ')}`,
        summary: pickLine(DEPLETION_SUMMARY, `candidate.resource.deplete.${stablePart(item.id)}.${stablePart(resource)}.${tick}`, { name: item.name || item.id, res: resource.replace(/_/g, ' ') }),
        reasons: [
          effectivePressure >= 0.5
            ? pickLine(DEPLETION_DRAW_HEAVY, `candidate.resource.deplete.${stablePart(item.id)}.${stablePart(resource)}.${tick}:draw`, { name: item.name || item.id, res: resource.replace(/_/g, ' ') })
            : `${item.name || item.id} is drawing steadily, if not yet heavily, on its ${resource.replace(/_/g, ' ')}.`,
          // The city floor: a city or larger depletes under a lighter draw (the gate above).
          rank >= tierRank('city')
            ? pickLine(DEPLETION_TIER, `candidate.resource.deplete.${stablePart(item.id)}.${stablePart(resource)}.${tick}:tier`, { name: item.name || item.id, tier: settlement.tier })
            : null,
          economicRole !== 'local_resource' ? `Economic role: ${economicRole.replace(/_/g, ' ')}.` : null,
        ].filter(Boolean),
        resourcePatch: { saveId: item.id, resource, state: 'depleted' },
        metadata: { resource, fromState: state, toState: 'depleted', economicRole, resourceTaxonomy: taxonomy },
        conflictTags: [`resource:${item.id}:${resource}`],
      });
    } else if (state === 'depleted' && (
      (perceivedPressureScore <= 0.32 && economicRole !== 'primary_export')
      // A depleted PRIMARY-EXPORT anchor was a permanent one-way ratchet — carved
      // out of the very quiet-recovery path built to END permanent ratchets, and
      // because canonExports is generation-frozen the carve-out never lifts. Export
      // demand justifies SLOWER recovery, not NEVER: allow it under a DEEPER
      // sustained calm (the quietRecovery threshold ≤0.2) so it rides the slow 0.02
      // manual path. [worldpulse-religion-trade-8]
      || (perceivedPressureScore <= 0.2 && economicRole === 'primary_export')
      || previousDrift?.direction === 'demotion'
    )) {
      // CADENCE DAMPING (E4-2b): exhaustibles (iron/stone/gem/salt/clay and
      // strategic resources) return canRecover:false from the taxonomy — once
      // depleted they could never come back, so a calm settlement's resources
      // only ever ratcheted down. A SUSTAINED CALM (very low pressure) now opens
      // a slow, event-gated recovery for them: prospecting reopens seams,
      // substitution and trade backfill demand. It is damped (low probability)
      // and bounded (quiet only) — calm becomes gradual recovery, not permanent
      // decay — while a resource under any real pressure still cannot regrow.
      const quietRecovery = perceivedPressureScore <= 0.2;
      const recovery = canRecoverResource(resource, settlement, {
        demotion: previousDrift?.direction === 'demotion',
        pressureScore: perceivedPressureScore,
        quietRecovery,
      });
      if (!recovery.canRecover) continue;
      // Exhaustible/magical recovery is deliberately slow — a fraction of the
      // renewable rate. It represents years of prospecting, not a season's regrowth.
      const slow = recovery.taxonomy.recoveryMode === 'manual' || recovery.taxonomy.recoveryMode === 'requires_high_magic';
      const severity = clamp01((1 - perceivedPressureScore) * 0.5 + (previousDrift?.direction === 'demotion' ? 0.22 : 0));
      out.push({
        id: `candidate.resource.recover.${stablePart(item.id)}.${stablePart(resource)}.${tick}`,
        type: 'resource',
        candidateType: 'resource_recovery',
        ruleId: 'resource_recovery',
        ruleFamily: 'resource',
        targetSaveId: item.id,
        severity,
        probability: clamp01((slow ? 0.02 : 0.08) + severity * (slow ? 0.1 : 0.34)),
        applyMode: authorityFor(rules, 'resource_recovery', 'auto'),
        headline: `${item.name || item.id}'s ${resource.replace(/_/g, ' ')} is recovering`,
        appliedHeadline: `${item.name || item.id}'s ${resource.replace(/_/g, ' ')} recovers`,
        summary: `${item.name || item.id} is taking less from its ${resource.replace(/_/g, ' ')}, and the land is giving back.`,
        reasons: [
          'The draw on it has eased enough for the ground to recover.',
          recovery.reason,
          previousDrift?.direction === 'demotion' ? `With ${item.name || item.id} shrinking, less is taken from it.` : null,
          economicRole !== 'local_resource' ? `Economic role: ${economicRole.replace(/_/g, ' ')}.` : null,
        ].filter(Boolean),
        resourcePatch: { saveId: item.id, resource, state: previousDrift?.direction === 'demotion' ? 'abundant' : 'allow' },
        metadata: { resource, fromState: state, toState: previousDrift?.direction === 'demotion' ? 'abundant' : 'allow', economicRole, resourceTaxonomy: recovery.taxonomy },
        conflictTags: [`resource:${item.id}:${resource}`],
      });
    }
  }
  return out;
}

/**
 * @param {any} worldState
 * @param {any} snapshot
 * @param {any} pressureIdx
 * @param {any} context
 */
export function evaluateTierResourceDynamics(worldState, snapshot, pressureIdx, context = {}) {
  const rules = normalizeSimulationRules(context.simulationRules || worldState?.simulationRules);
  const tick = Number.isFinite(context.tick) ? context.tick : worldState?.tick || 0;
  // W-F4b item 2b: the pulse PRNG, DI'd via context (kernel passes it). Absent ⇒ the
  // development-fidelity term is inert ⇒ every non-kernel caller stays byte-identical.
  const rng = context.rng && typeof context.rng.fork === 'function' ? context.rng : null;
  const settlementTickStates = { ...(worldState?.settlementTickStates || {}) };
  const candidates = [];
  const driftBySettlement = /** @type {any} */ ({});
  // Tier candidate ids are tick-suffixed, so an unresolved tier proposal would
  // gain a duplicate every eligible tick: one pending tier proposal per
  // settlement. Streak tracking continues so a resolved proposal re-emits.
  const pendingTierProposals = new Set((worldState?.proposals || [])
    .filter((/** @type {any} */ proposal) => proposal?.status === 'pending' && proposal?.outcome?.tierChange?.saveId != null)
    .map((/** @type {any} */ proposal) => String(proposal.outcome.tierChange.saveId)));

  // WAVE P1a: the viability read is computed ONLY when the demographic engine is lit,
  // so a dark campaign never derives K_food, never touches the food ledger, and cannot
  // pay a byte for a lane it does not run.
  const demographicsLit = demographicsActive({ simulationRules: rules });

  for (const item of snapshot?.settlements || []) {
    const previous = settlementTickStates[item.id] || {};
    const eligibility = rules.tierDriftEnabled
      ? tierEligibility(
        item,
        pressureIdx,
        demographicsLit ? tierViabilityOf(item.settlement, worldState, String(item.id)) : null,
      )
      : null;
    let tierDrift = null;
    if (eligibility) {
      const prior = previous.tierDrift || {};
      const sameTrack = prior.direction === eligibility.direction && prior.toTier === eligibility.toTier;
      tierDrift = {
        ...eligibility,
        streak: sameTrack ? (prior.streak || 0) + 1 : 1,
        lastEvaluatedTick: tick,
      };
      const candidate = tierCandidate(item, tierDrift, tick, rules);
      if (candidate && !pendingTierProposals.has(String(item.id))) candidates.push(candidate);
    }
    settlementTickStates[item.id] = {
      ...previous,
      tierDrift,
    };
    driftBySettlement[item.id] = tierDrift;

    if (rules.resourceDriftEnabled) {
      candidates.push(...resourceCandidatesFor(item, pressureIdx, rules, tick, tierDrift, rng));
    }
  }

  return {
    worldState: { ...worldState, settlementTickStates },
    candidates,
    driftBySettlement,
  };
}

/**
 * @param {import('../settlement.schema.js').SimSettlement} settlement
 * @param {any} outcome
 */
export function applyResourceOutcomeToSettlement(settlement, outcome) {
  if (!settlement || !outcome?.resourcePatch) return settlement;
  const { resource, state } = outcome.resourcePatch;
  const config = settlement.config || {};
  const normalizedResource = String(resource).toLowerCase();
  const resourceStateMap = { ...(config.nearbyResourcesState || {}) };
  const customDepletedNames = (
    config.nearbyResourceDefinitionsDepleted || []
  )
    .map((
      /** @type {Record<string, unknown>} */ definition,
    ) => String(definition?.name || ''))
    .filter(Boolean);
  const customNamesakeRemainsDepleted = customDepletedNames.some(
    (/** @type {string} */ name) => (
      name.toLowerCase() === normalizedResource
    ),
  );
  resourceStateMap[resource] = (
    state === 'depleted'
    || customNamesakeRemainsDepleted
  )
    ? 'depleted'
    : state;

  const nativeDepleted = new Map(
    nativeSemanticDepletedResourceKeys(config)
      .map(key => [String(key).toLowerCase(), String(key)]),
  );
  if (state === 'depleted') nativeDepleted.set(normalizedResource, resource);
  else nativeDepleted.delete(normalizedResource);

  // nearbyResourcesDepleted is the compatibility/display union. Rebuild it
  // from the two exact owners instead of mutating the ambiguous flat label.
  const flatDepleted = new Map(nativeDepleted);
  for (const name of customDepletedNames) {
    const key = name.toLowerCase();
    if (!flatDepleted.has(key)) flatDepleted.set(key, name);
  }
  const nextConfig = {
    ...config,
    nearbyResourcesState: resourceStateMap,
    nearbyResourcesNativeDepleted: [...nativeDepleted.values()],
    nearbyResourcesDepleted: [...flatDepleted.values()],
  };
  const nativeResources = nativeSemanticResourceKeys(config);
  const nextEconomicState = reconcileProductionAfterResourceChange(
    settlement.economicState,
    {
      // The reconcile reads only the live economic roster and route context.
      // Pass that narrow projection instead of widening its local kernel type
      // to every historical SimSettlement field.
      settlement: {
        config: nextConfig,
        institutions: liveInstitutions(settlement),
        activeConditions: settlement.activeConditions,
        tier: settlement.tier,
        tradeRoute: settlement.tradeRoute,
        name: settlement.name,
        economicState: settlement.economicState,
      },
      oldResources: nativeResources,
      newResources: nativeResources,
      oldDepleted: nativeSemanticDepletedResourceKeys(config),
      newDepleted: [...nativeDepleted.values()],
    },
  );
  return {
    ...settlement,
    config: nextConfig,
    ...(settlement.economicState
      ? { economicState: nextEconomicState }
      : {}),
    resourceHistory: [
      ...(Array.isArray(settlement.resourceHistory) ? settlement.resourceHistory.slice(-11) : []),
      {
        resource,
        state,
        outcomeId: outcome.id,
        reason: outcome.headline || outcome.candidateType,
      },
    ],
  };
}
