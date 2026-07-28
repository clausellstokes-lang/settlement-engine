/**
 * coherenceRepairPass.js — deterministic repair of generator-owned structure.
 *
 * Validation is useful only if default generation acts on its own mistakes.
 * This pass sits after the final institution-producing step and before the
 * economy, service, NPC, and narrative readers. It repairs contradictions the
 * generator owns while preserving author-owned institutions and explicit
 * exclusions:
 *
 *   - threatened settlements receive tier-plausible fortification and forces;
 *   - generated institutions with impossible access are removed;
 *   - hard dependencies are added when a compatible catalog option exists,
 *     otherwise the unprotected dependent institution is removed;
 *   - every action is recorded for the final coherence receipt.
 *
 * The pass consumes no RNG. The same final roster always produces the same
 * repair plan, and downstream systems see only the repaired roster.
 */

import {
  TIER_ORDER,
  TOWN_PLUS_TIERS,
} from '../../data/constants.js';
import { institutionalCatalog } from '../../data/institutionalCatalog.js';
import { recordTrace } from '../../domain/trace.js';
import { deriveIsolationSupport } from '../isolationSupport.js';
import { applyTeleportationInfrastructure } from '../isolationGenerator.js';
import { checkStructuralValidity } from '../structuralValidator.js';
import { registerStep } from '../pipeline.js';
import { collapseUpgradeChains } from './assembleInstitutions.js';
import {
  applySubsumption,
  isProtectedInstitution,
} from './subsumptionPass.js';
import { slugify } from '../../kernel/slugify.js';
import { threatDefensePlan } from '../threatDefensePolicy.js';
import {
  institutionWouldBeImmediatelyEvicted,
} from '../../data/institutionLadders.js';
import {
  nativeSemanticNames,
} from '../../domain/content/customContentSemanticAuthority.js';

function institutionId(name) {
  return `institution.${slugify(name, { sep: '_', raw: true })}`;
}

function normalizedName(value) {
  return String(value || '').trim().toLowerCase();
}

/**
 * Collect every catalog entry whose native tier is not above the settlement.
 * Higher tiers legitimately retain lower-scale infrastructure, and several
 * hard dependencies name a lower-tier institution as one valid option.
 */
function catalogEntriesAtTier(tier) {
  const maxTier = Math.max(0, TIER_ORDER.indexOf(tier));
  const byName = new Map();
  for (let index = 0; index <= maxTier; index += 1) {
    const nativeTier = TIER_ORDER[index];
    for (const [category, group] of Object.entries(
      institutionalCatalog[nativeTier] || {},
    )) {
      for (const [name, definition] of Object.entries(group || {})) {
        byName.set(normalizedName(name), {
          category,
          name,
          nativeTier,
          ...definition,
        });
      }
    }
  }
  return [...byName.values()];
}

function toggleFor(ctx, candidate) {
  const tier = ctx.tier;
  const category = candidate.category;
  const name = candidate.name;
  const toggles = ctx.institutionToggles || {};
  return (
    toggles[`${tier}::${category}::${name}`]
    || toggles[`${tier}_${category}_${name}`]
    || toggles[`all::${category}::${name}`]
    || toggles[`all_${category}_${name}`]
    || null
  );
}

function isExplicitlyExcluded(ctx, candidate) {
  const toggle = toggleFor(ctx, candidate);
  return Boolean(
    toggle
    && toggle.require !== true
    && (toggle.forceExclude === true || toggle.allow === false),
  );
}

function isCompatible(ctx, candidate) {
  const route = ctx.tradeRoute;
  const terrain = ctx.terrainType;
  if (candidate.minTier) {
    const minimum = TIER_ORDER.indexOf(candidate.minTier);
    if (minimum >= 0 && TIER_ORDER.indexOf(ctx.tier) < minimum) return false;
  }
  if (candidate.forbiddenTradeRoutes?.includes(route)) return false;
  if (
    candidate.tradeRouteRequired?.length
    && !candidate.tradeRouteRequired.includes(route)
  ) return false;
  if (
    candidate.terrainRequired?.length
    && !candidate.terrainRequired.includes(terrain)
  ) return false;
  if (
    candidate.terrainAccess?.length
    && !candidate.terrainAccess.includes(terrain)
  ) return false;
  if (isExplicitlyExcluded(ctx, candidate)) return false;
  if (!ctx.generationContext.worldLaw.allowsInstitution(candidate)) return false;
  if (
    candidate.exclusiveGroup
    && ctx.institutions.some(institution => (
      institution.exclusiveGroup === candidate.exclusiveGroup
      && normalizedName(institution.name) !== normalizedName(candidate.name)
    ))
  ) return false;
  return true;
}

function recordRepair(ctx, repair) {
  ctx.generationRepairs.push(Object.freeze(repair));
  recordTrace(ctx, {
    targetType: 'institution',
    targetId: institutionId(repair.subject),
    step: 'coherenceRepairPass',
    result: repair.action,
    causes: [{
      source: `coherence.${repair.type}`,
      effect: repair.action,
      reason: repair.reason,
    }],
  });
}

function addCandidate(ctx, entries, names, type, reason) {
  const present = new Set(ctx.institutions.map(
    institution => normalizedName(institution.name),
  ));
  const nativeRosterNames = nativeSemanticNames(ctx.institutions);
  const candidate = names
    .map(name => entries.find(entry => normalizedName(entry.name) === normalizedName(name)))
    .find(entry => (
      entry
      && !present.has(normalizedName(entry.name))
      && isCompatible(ctx, entry)
      && !institutionWouldBeImmediatelyEvicted(nativeRosterNames, entry.name)
    ));
  if (!candidate) return false;
  ctx.institutions.push({
    ...candidate,
    source: 'coherence_repair',
    coherenceRepair: type,
  });
  recordRepair(ctx, {
    id: `repair.${ctx.generationRepairs.length + 1}`,
    type,
    action: 'added',
    subject: candidate.name,
    reason,
  });
  return true;
}

/**
 * The public repair ledger describes the final roster, not transient work the
 * pass normalized away. The candidate guard above prevents the known false-add
 * path; this final reconciliation also covers a lesser added on pass one and
 * superseded by a greater added later in the same bounded repair.
 */
function reconcileAddedRepairReceipts(ctx) {
  const present = new Set(ctx.institutions.map(
    institution => normalizedName(institution.name),
  ));
  ctx.generationRepairs = ctx.generationRepairs.filter(repair => (
    repair?.action !== 'added'
    || present.has(normalizedName(repair.subject))
  ));
}

function removeUnprotected(ctx, name, type, reason) {
  const index = ctx.institutions.findIndex(institution => (
    normalizedName(institution.name) === normalizedName(name)
    && !isProtectedInstitution(institution)
  ));
  if (index < 0) return false;
  const [removed] = ctx.institutions.splice(index, 1);
  recordRepair(ctx, {
    id: `repair.${ctx.generationRepairs.length + 1}`,
    type,
    action: 'removed',
    subject: removed.name,
    reason,
  });
  return true;
}

function repairThreatDefense(ctx, entries) {
  for (const requirement of threatDefensePlan(ctx)) {
    addCandidate(
      ctx,
      entries,
      requirement.names,
      requirement.type,
      requirement.reason,
    );
  }
}

/**
 * Record that the pass SAW a hard violation it has no lawful move against.
 *
 * Deliberately a trace and NOT a `generationRepairs` entry: the repair array
 * feeds a user-visible count (ViabilityTab's "N deterministic repairs
 * recorded", generationContracts' `repairCount`), and an observation is not a
 * repair — filing it there would inflate that number and make the receipt less
 * honest rather than more. The trace lane already exists on every settlement,
 * so this adds no persistence shape.
 *
 * `targetType: 'condition'` because a settlement-scope violation names no
 * roster entry: survival_crisis carries the literal 'Settlement (Regional
 * Threat)' in its `institution` field, and minting an institution id from that
 * string would hand every institution-keyed trace reader a join against
 * nothing.
 *
 * Written generically rather than as a survival_crisis special case so a
 * violation type added to the validator later cannot become silently
 * unhandled here — the receipt is what makes the gap visible.
 *
 * @param {object} ctx
 * @param {{ type: string, institution?: string, reason?: string }} violation
 * @returns {void}
 */
function recordUnrepairable(ctx, violation) {
  recordTrace(ctx, {
    targetType: 'condition',
    targetId: `condition.${violation.type}`,
    step: 'coherenceRepairPass',
    result: 'observed_no_repair',
    causes: [{
      source: `structural.${violation.type}`,
      effect: 'no repair applicable',
      reason: 'The pass observed this violation and has no lawful repair for it: '
        + 'the subject is a settlement-scope condition rather than a roster entry, '
        + 'and the institutions that would answer it are either unavailable at this '
        + 'tier or explicitly excluded by the DM — an exclusion this pass may never '
        + 'override. The violation is left standing and reported.'
        + (violation.reason ? ` Observed: ${violation.reason}` : ''),
    }],
  });
}

/**
 * The violation types the branches below own. Declared as data so "which kinds
 * does this pass actually repair?" is one grep rather than a read of the loop,
 * and so a future branch that forgets its `continue` cannot make the pass
 * report its own repair as unrepairable.
 */
const REPAIRABLE_VIOLATION_TYPES = new Set([
  'access_violation',
  'dependency_violation',
  'exclusion_violation',
]);

/**
 * @param {object} ctx
 * @param {Array<any>} entries
 * @param {Set<string>} observed  step-scoped dedupe for unrepairable sightings.
 *   MUST be created once per step run and shared by both calls below: the
 *   validator is re-read on each bounded pass AND this function is called twice
 *   per step (before and after isolation repair), so a call-scoped set still
 *   emits the same receipt up to four times.
 * @returns {void}
 */
function repairHardViolations(ctx, entries, observed) {
  // Two bounded passes allow an added dependency to expose its own missing
  // dependency without turning this into an open-ended fixpoint.
  for (let pass = 0; pass < 2; pass += 1) {
    const structural = checkStructuralValidity(ctx.institutions, {
      ...ctx.effectiveConfig,
      tier: ctx.tier,
      tradeRouteAccess: ctx.tradeRoute,
      _isolationSupport: ctx.isolationSupport,
    });
    const hard = structural.violations.filter(violation => (
      violation.severity === 'error' || violation.severity === 'critical'
    ));
    let changed = false;
    for (const violation of hard) {
      if (violation.type === 'access_violation') {
        changed = removeUnprotected(
          ctx,
          violation.institution,
          'access_compatibility',
          `${violation.institution} cannot function with ${ctx.tradeRoute} access.`,
        ) || changed;
        continue;
      }
      if (violation.type === 'dependency_violation') {
        const missing = Array.isArray(violation.missing)
          ? violation.missing
          : [];
        const added = addCandidate(
          ctx,
          entries,
          missing,
          'hard_dependency',
          `${violation.institution} requires a compatible supporting institution.`,
        );
        changed = added || changed;
        if (!added) {
          changed = removeUnprotected(
            ctx,
            violation.institution,
            'unsupported_institution',
            `${violation.institution} had no compatible, non-excluded dependency at this tier.`,
          ) || changed;
        }
        continue;
      }
      if (violation.type === 'exclusion_violation') {
        changed = removeUnprotected(
          ctx,
          violation.institution,
          'mutual_exclusion',
          `${violation.institution} conflicts with ${violation.blockedBy}.`,
        ) || changed;
        continue;
      }
      // No branch above owns this type. Leave a receipt instead of falling
      // through in silence, so a reader can tell "nothing was wrong" apart
      // from "something was wrong that this pass cannot lawfully touch".
      if (!REPAIRABLE_VIOLATION_TYPES.has(violation.type)) {
        const key = `${violation.type}:${violation.institution || ''}`;
        if (!observed.has(key)) {
          observed.add(key);
          recordUnrepairable(ctx, violation);
        }
      }
    }
    if (!changed) break;
  }
}

registerStep('coherenceRepairPass', {
  deps: ['factionCorrelationPass'],
  reads: [
    'effectiveConfig',
    'generationContext',
    'catalogForTier',
    'institutionToggles',
    'institutions',
    'isolationSupport',
    'terrainType',
    'threat',
    'tier',
    'tradeRoute',
  ],
  provides: ['generationRepairs', 'isolationSupport'],
  mutates: ['effectiveConfig', 'institutions'],
  scratch: ['_rosterChangedAfterEconomy'],
  phase: 'institutions',
}, ctx => {
  const before = ctx.institutions.map(institution => institution.name);
  const entries = catalogEntriesAtTier(ctx.tier);
  ctx.generationRepairs = Array.isArray(ctx.generationRepairs)
    ? ctx.generationRepairs
    : [];

  // One dedupe set for the whole step run — see repairHardViolations' contract.
  const observedUnrepairable = new Set();
  repairThreatDefense(ctx, entries);
  repairHardViolations(ctx, entries, observedUnrepairable);

  applySubsumption(ctx.institutions, ctx, {
    step: 'coherenceRepairPass',
    result: 'subsumed_after_repair',
  });
  collapseUpgradeChains(ctx.institutions);

  // Earlier institution passes can remove or replace a foodshed, reserve, or
  // patronage institution after isolationPass first measured support. Re-run
  // the same substitution policy against the final roster so a random
  // high-magic city cannot acquire a late support gap. This still considers
  // every mundane path first and adds magical transit only for a real deficit.
  const beforeIsolationRepair = new Set(
    ctx.institutions.map(institution => institution.name),
  );
  applyTeleportationInfrastructure(
    ctx.institutions,
    ctx.tier,
    ctx.tradeRoute,
    ctx.effectiveConfig,
    ctx.catalogForTier,
    TOWN_PLUS_TIERS,
    () => false,
  );
  for (const institution of ctx.institutions) {
    if (beforeIsolationRepair.has(institution.name)) continue;
    recordRepair(ctx, {
      id: `repair.${ctx.generationRepairs.length + 1}`,
      type: 'isolation_support',
      action: 'added',
      subject: institution.name,
      reason: `Final isolation support was below the ${ctx.tier} requirement after roster reconciliation.`,
    });
  }

  // Transit infrastructure has the same dependency laws as every other
  // institution. Repair those dependencies after injection, then normalize the
  // roster once more before taking the persisted support measurement.
  repairHardViolations(ctx, entries, observedUnrepairable);
  applySubsumption(ctx.institutions, ctx, {
    step: 'coherenceRepairPass',
    result: 'subsumed_after_isolation_repair',
  });
  collapseUpgradeChains(ctx.institutions);

  const isolationSupport = deriveIsolationSupport({
    tier: ctx.tier,
    tradeRoute: ctx.tradeRoute,
    institutions: ctx.institutions,
    config: ctx.effectiveConfig,
  });
  ctx.effectiveConfig._isolationSupport = isolationSupport;
  ctx.effectiveConfig._magicTradeOnly = isolationSupport.magicDependent === true;

  reconcileAddedRepairReceipts(ctx);

  const after = ctx.institutions.map(institution => institution.name);
  if (JSON.stringify(before) !== JSON.stringify(after)) {
    ctx._rosterChangedAfterEconomy = true;
  }
  return {
    generationRepairs: ctx.generationRepairs,
    isolationSupport,
  };
});
