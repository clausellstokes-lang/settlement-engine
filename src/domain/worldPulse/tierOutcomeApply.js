/**
 * domain/worldPulse/tierOutcomeApply.js — the tier-outcome APPLIER, as a
 * dependency-light leaf.
 *
 * Extracted VERBATIM from tierResourceDynamics.js (W2b byte-budget extraction —
 * the domain/deityConstants.js pattern). The SHIFT_TIER event handler
 * (domain/events/mutateEntities.js) reuses the sim's single-source applier, and
 * that handler is statically reachable from the eager store via the mutate.js
 * router — so whatever the applier imports lands in the FIRST-PAINT closure.
 * The fat module's EVALUATION machinery (pressure/candidates/eligibility) pulls
 * canonicalAccessors, supplyChainData, goodsCatalog, worldState, simulationRules
 * and resourceTaxonomy; the APPLIER needs none of it. This leaf imports only the
 * institution catalog, the tier constants, and the stablePart slug leaf.
 *
 * tierResourceDynamics.js imports + re-exports everything here verbatim, so
 * every sim consumer (applyWorldPulse, institutionLifecycle, tests) is
 * unchanged and each function keeps exactly one source.
 */

import { institutionalCatalog } from '../../data/institutionalCatalog.js';
import { POPULATION_RANGES, TIER_ORDER, popToTier, tierAtLeast } from '../../data/constants.js';
import {
  isMaterializedCustomContent,
} from '../content/customContentSemanticAuthority.js';
import { stablePart } from './stablePart.js';

/**
 * Boolean wrapper around the shared type guard. SimInstitution is already an
 * open record, so using the guard directly in a negative branch would narrow
 * the remaining native record to `never` under strict checking.
 *
 * @param {unknown} institution
 * @returns {boolean}
 */
function hasCustomContentProvenance(institution) {
  return isMaterializedCustomContent(institution);
}

/** @param {any} tier */
export function entriesForTier(tier) {
  const tierCatalog = /** @type {any} */ (institutionalCatalog)[tier] || {};
  const entries = [];
  for (const [category, group] of Object.entries(tierCatalog)) {
    for (const [name, spec] of Object.entries(group || {})) {
      entries.push({ name, category, spec: spec || {} });
    }
  }
  return entries;
}

/** @param {any} tier */
function requiredInstitutionsForTier(tier) {
  return entriesForTier(tier).filter(entry => entry.spec.required);
}

/** @param {any} name */
export function catalogEntryByName(name) {
  const needle = String(name || '').toLowerCase();
  for (const tier of TIER_ORDER) {
    const found = entriesForTier(tier).find(entry => entry.name.toLowerCase() === needle);
    if (found) return { ...found, nativeTier: tier };
  }
  return null;
}

/**
 * Standing institutions that may satisfy native catalog obligations.
 *
 * Unstamped legacy rows retain their historical name semantics. Current
 * custom definitions carry exact provenance and must satisfy only their
 * authored mechanics, never a built-in requirement with the same label.
 *
 * @param {import('../settlement.schema.js').SimSettlement} settlement
 */
export function existingInstitutionNames(settlement) {
  return new Set((settlement?.institutions || [])
    .filter((/** @type {any} */ inst) => (
      inst?.status !== 'removed'
      && !inst?._worldPulseInactive
      && !hasCustomContentProvenance(inst)
    ))
    .map((/** @type {any} */ inst) => String(inst.name || '').toLowerCase()));
}

/** @param {any} name */
function institutionId(name) {
  return `institution.${stablePart(name)}`;
}

/**
 * @param {any} entry
 * @param {any} tier
 * @param {any} outcome
 */
function newInstitution(entry, tier, outcome) {
  return {
    id: institutionId(entry.name),
    name: entry.name,
    category: entry.category,
    status: 'active',
    description: entry.spec.desc || '',
    tags: Array.isArray(entry.spec.tags) ? [...entry.spec.tags] : [],
    required: !!entry.spec.required,
    _worldPulseTierAdded: true,
    requiredForTier: tier,
    createdByWorldPulseOutcomeId: outcome?.id || null,
  };
}

/**
 * @param {import('../settlement.schema.js').SimSettlement} settlement
 * @param {any} toTier
 */
function promotionAdditions(settlement, toTier) {
  const names = existingInstitutionNames(settlement);
  return requiredInstitutionsForTier(toTier).filter(entry => !names.has(entry.name.toLowerCase()));
}

/**
 * @param {any} inst
 * @param {any} toTier
 */
function shouldRemoveForDemotion(inst, toTier) {
  if (!inst || inst.status === 'removed' || inst._worldPulseInactive) return false;
  // Custom definitions obey their own reviewed tier contract. A presentation
  // label equal to a catalog institution must never inherit that native
  // institution's demotion fate.
  if (hasCustomContentProvenance(inst)) return false;
  if (inst._worldPulseTierAdded && inst.requiredForTier && !tierAtLeast(toTier, inst.requiredForTier)) return true;
  const entry = catalogEntryByName(inst.name);
  if (!entry) return false;
  if (entry.spec.minTier && !tierAtLeast(toTier, entry.spec.minTier)) return true;
  if (entry.spec.required && !tierAtLeast(toTier, entry.nativeTier)) return true;
  return false;
}

/** @param {any} inst */
function demotionFateForInstitution(inst) {
  const entry = catalogEntryByName(inst?.name);
  const category = String(inst?.category || entry?.category || '').toLowerCase();
  const text = `${inst?.name || ''} ${(inst?.tags || []).join(' ')} ${category}`.toLowerCase();
  if (/watch|guard|garrison|barrack|military|defense|fort|wall/.test(text)) return { fate: 'reduced_to_watch_post', status: 'remnant' };
  if (/academy|library|sage|wizard|mage|arcane|college|school/.test(text)) return { fate: 'abandoned', status: 'removed' };
  if (/market|guild|bank|merchant|warehouse|trade|craft|smith|mill/.test(text)) return { fate: 'privatized', status: 'remnant' };
  if (/temple|church|shrine|monastery|religious|divine/.test(text)) return { fate: 'survives_as_remnant', status: 'remnant' };
  if (/court|council|hall|bureau|civic|legal|government|administration/.test(text)) return { fate: 'downsized', status: 'remnant' };
  if (/thief|smuggl|criminal|gang/.test(text)) return { fate: 'captured_by_local_powers', status: 'remnant' };
  return { fate: 'hollowed_out', status: 'remnant' };
}

/**
 * @param {any} inst
 * @param {any} outcome
 * @param {any} toTier
 */
function deactivateForDemotion(inst, outcome, toTier) {
  const fate = demotionFateForInstitution(inst);
  return {
    ...inst,
    status: fate.status,
    _worldPulseInactive: true,
    worldPulseFate: fate.fate,
    demotedByWorldPulseOutcomeId: outcome?.id || null,
    removedByWorldPulseOutcomeId: fate.status === 'removed' ? (outcome?.id || null) : inst.removedByWorldPulseOutcomeId,
    removedReason: `Demoted below ${inst.requiredForTier || catalogEntryByName(inst.name)?.nativeTier || 'higher'} tier support; fate: ${fate.fate.replace(/_/g, ' ')}.`,
    remnantReason: fate.status === 'remnant'
      ? `No longer fully supported after demotion to ${toTier}; survives as ${fate.fate.replace(/_/g, ' ')}.`
      : inst.remnantReason,
  };
}

/**
 * ADOPTION — a settled tier shift restamps the roster's required contracts.
 *
 * At the tier that declares the name required, the institution IS the tier's
 * contract regardless of how it arrived (manager ruling 2026-07-27). `required`
 * is scoped to the tier whose catalog declares it, and a tier shift moves the
 * settlement to a NEW catalog — so a surviving record the new tier genuinely
 * requires owes that contract from this moment on, whatever its provenance.
 *
 * The bite this closes: a demoted city's cascade-seated 'Town watch'
 * (`required: false`, `cascadeAdded: true`) lands in a town whose catalog
 * requires that exact name. Closure was already covered by
 * isClosableInstitution's settlement-tier backstop, but the FLAG-based readers
 * (calamity strikes, scale-ladder collapse, upgrade chains) cannot see the
 * settlement's tier and would still have struck the town's own watch.
 *
 * `source: 'cascade'` is left untouched — it is the historical record of where
 * the institution came from, and hasCascadeProvenance deliberately ignores it.
 * The symmetric RELEASE (a promoted settlement's now-stale `required: true`, a
 * town's 'Town watch' riding into a city) is deliberately NOT done here: that is
 * pre-existing behavior and a separate, un-asked ruling. The read-time tier
 * backstop in isClosableInstitution remains the net for saves that never pass
 * through a tier shift.
 *
 * @param {import('../settlement.schema.js').SimInstitution[]} institutions
 *   the roster AFTER demotion/promotion surgery
 * @param {string} toTier
 * @returns {import('../settlement.schema.js').SimInstitution[]}
 */
function adoptRequiredContractsForTier(institutions, toTier) {
  const requiredNames = new Set(
    requiredInstitutionsForTier(toTier).map(entry => entry.name.toLowerCase()),
  );
  return institutions.map((inst) => {
    if (!inst || typeof inst !== 'object') return inst;
    // Custom definitions answer to their own reviewed contract, never a native
    // tier requirement that happens to share their presentation label.
    if (hasCustomContentProvenance(inst)) return inst;
    const status = String(inst.status || 'active');
    if (status === 'removed' || status === 'remnant' || status === 'ruined') return inst;
    if (inst._worldPulseInactive) return inst;
    if (!requiredNames.has(String(inst.name || '').toLowerCase())) return inst;
    // Already its own contract — return the SAME object (no gratuitous rewrite).
    if (inst.required === true && inst.cascadeAdded !== true) return inst;
    // Clear the borrowed-seat stamp by ABSENCE: `cascadeAdded: true` is the only
    // form the cascade producer ever writes, so absent is what "not borrowed"
    // looks like everywhere else in the tree.
    const { cascadeAdded: _borrowedSeatStamp, ...adopted } = inst;
    return { ...adopted, required: true };
  });
}

/**
 * @param {import('../settlement.schema.js').SimSettlement} settlement
 * @param {any} outcome
 */
export function applyTierOutcomeToSettlement(settlement, outcome) {
  if (!settlement || !outcome?.tierChange) return settlement;
  const { fromTier, toTier, direction } = outcome.tierChange;
  // Self-contained re-verify (same contract as applyInstitutionLifecycleOutcome):
  // proposals re-apply this from the stored outcome, possibly many ticks after
  // the candidate fired. A stale fromTier must not rewind the tier — that runs
  // roster surgery in the wrong direction and writes a bogus tierHistory entry.
  const currentTier = settlement.tier || popToTier(settlement.population || 0);
  if (currentTier !== fromTier) return settlement;
  let institutions = Array.isArray(settlement.institutions) ? [...settlement.institutions] : [];
  const institutionFates = /** @type {any[]} */ ([]);

  if (direction === 'promotion') {
    // A required institution may already exist as an inactive remnant (e.g.
    // closed by the institution lifecycle during a lean stretch, or left
    // behind by an earlier demotion) — promotionAdditions cannot see those
    // because existingInstitutionNames excludes them. Reactivate the remnant
    // instead of appending a same-name duplicate.
    const additions = promotionAdditions(settlement, toTier);
    const reactivated = new Set();
    institutions = institutions.map(inst => {
      if (hasCustomContentProvenance(inst)) return inst;
      const match = additions.find(entry => entry.name.toLowerCase() === String(inst?.name || '').toLowerCase());
      if (!match || !(inst.status === 'removed' || inst._worldPulseInactive)) return inst;
      reactivated.add(match.name.toLowerCase());
      institutionFates.push({
        name: inst.name,
        category: inst.category || match.category,
        fate: 'reactivated',
        tier: toTier,
      });
      return {
        ...inst,
        status: 'active',
        impairments: [],
        _worldPulseInactive: false,
        _worldPulseEconomyClosed: false,
        worldPulseFate: null,
        required: true,
        requiredForTier: toTier,
        _worldPulseTierAdded: true,
        createdByWorldPulseOutcomeId: inst.createdByWorldPulseOutcomeId || outcome?.id || null,
      };
    });
    const fresh = additions
      .filter(entry => !reactivated.has(entry.name.toLowerCase()))
      .map(entry => {
        institutionFates.push({
          name: entry.name,
          category: entry.category,
          fate: 'added',
          tier: toTier,
        });
        return newInstitution(entry, toTier, outcome);
      });
    institutions = [...institutions, ...fresh];
  } else {
    institutions = institutions.map(inst => {
      if (!shouldRemoveForDemotion(inst, toTier)) return inst;
      institutionFates.push({
        name: inst.name,
        category: inst.category || catalogEntryByName(inst.name)?.category || null,
        fate: demotionFateForInstitution(inst).fate,
        tier: toTier,
      });
      return deactivateForDemotion(inst, outcome, toTier);
    });
  }

  // The roster has settled (demotion removals/deactivations, promotion additions
  // and reactivations are all in) — now it answers to the NEW tier's catalog.
  // Applied on BOTH directions: the rule is tier-keyed, not direction-keyed.
  institutions = adoptRequiredContractsForTier(institutions, toTier);

  // Promotion nudges population to at least the new tier's floor. Eligibility
  // promotes at pop >= nextTier.min * 0.92, so without this a just-promoted
  // settlement sits below its own tier's currentMin and can trip
  // `strainedBelowFloor` (pop < currentMin && support < 0.45) on the very next
  // tick — a promote/demote churn loop at the boundary. Demotion leaves
  // population untouched (the population already fell; the tier is catching up).
  const promotedFloor = /** @type {any} */ (POPULATION_RANGES)[toTier]?.min || 0;
  const currentPopulation = Math.round(Number(settlement.population) || 0);
  const nextPopulation = direction === 'promotion'
    ? Math.max(currentPopulation, promotedFloor)
    : currentPopulation; // demotion leaves population untouched (already the rounded current value)
  // The anti-churn floor bump is a deliberate (unconserved) mint — leave a
  // populationHistory breadcrumb (same shape as applyPopulationOutcomeToSettlement's)
  // so the chronicle/audit surfaces can see it instead of an invisible population jump.
  const floorBump = direction === 'promotion' ? Math.max(0, nextPopulation - currentPopulation) : 0;

  return {
    ...settlement,
    tier: toTier,
    population: nextPopulation,
    ...(floorBump > 0 ? {
      populationHistory: [
        ...(Array.isArray(settlement.populationHistory) ? settlement.populationHistory.slice(-11) : []),
        {
          tick: outcome.generatedAtTick ?? outcome.tick ?? null,
          delta: floorBump,
          population: nextPopulation,
          reason: `Promotion to ${toTier} draws settlers up to the tier's population floor.`,
          outcomeId: outcome.id,
        },
      ],
    } : {}),
    config: {
      ...(settlement.config || {}),
      tier: toTier,
      settType: toTier,
    },
    institutions,
    tierHistory: [
      ...(Array.isArray(settlement.tierHistory) ? settlement.tierHistory.slice(-11) : []),
      {
        fromTier,
        toTier,
        direction,
        outcomeId: outcome.id,
        institutionFates,
      },
    ],
    institutionHistory: [
      ...(Array.isArray(settlement.institutionHistory) ? settlement.institutionHistory.slice(-23) : []),
      ...institutionFates.map(fate => ({
        ...fate,
        outcomeId: outcome.id,
        reason: `World Pulse ${direction} to ${toTier}.`,
      })),
    ].slice(-24),
  };
}
