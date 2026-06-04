/**
 * domain/supplyChainState.js - Stateful supply-chain derivation.
 *
 * Tier 4.3 of the roadmap. Today's chain object lives on
 * `settlement.economicState.activeChains[]` with shape:
 *
 *   {
 *     needKey, needLabel, needIcon, needColor,
 *     chainId, label, upstreamChains,
 *     processingInstitutions, outputs, services, resource,
 *     exportable, entrepot, activatedByResource,
 *     substituteActive, resourceDepleted, dependency?,
 *     status: 'operational' | 'running' | 'entrepot' | 'vulnerable' | 'impaired',
 *   }
 *
 * The roadmap target carries a richer state envelope:
 *
 *   {
 *     id, name,
 *     status: 'stable' | 'strained' | 'scarce' | 'blocked' | 'captured' | 'substituted' | 'collapsing',
 *     controller,
 *     dependencies[],
 *     failureConsequences,
 *     substitutes[],
 *     beneficiaries[],
 *     victims[],
 *   }
 *
 * This file is the adapter. Pure read-only derivation; the generator
 * stays unchanged. Consumers (PDF, AI overlay, the visible-chain UI,
 * "Why did flour prices rise?" surfaces) call `deriveSupplyChainState`
 * and get the canonical shape.
 *
 * No imports from src/lib - the domain tsconfig include stays
 * self-contained, same constraint Phase 9 honored.
 */

import { deriveAllActiveConditions } from './activeConditions.js';

// ── Status remap ──────────────────────────────────────────────────────────
// Legacy vocabulary → canonical vocabulary per the roadmap. The status
// fields encode different intensities:
//
//   stable      - chain runs normally with all inputs available
//   strained    - chain runs but with stress (e.g. substituted inputs)
//   scarce      - chain is producing below normal output
//   blocked     - chain is offline due to a hard upstream failure
//   captured    - chain is controlled by a single faction taking rents
//   substituted - chain runs via an alternative path (e.g. magic substitute)
//   collapsing  - chain is failing under multiple compounding pressures
//
// The current generator only emits a subset of these states; the
// remaining states (`blocked`, `captured`, `collapsing`) become
// reachable when Tier 4.2 event-driven faction logic and Tier 2.3
// active conditions land.

const LEGACY_TO_CANONICAL = Object.freeze({
  operational: 'stable',
  running:     'stable',
  entrepot:    'stable',     // pass-through trade is its own stable state
  vulnerable:  'strained',
  impaired:    'scarce',
});

const CANONICAL_STATUSES = new Set([
  'stable', 'strained', 'scarce', 'blocked',
  'captured', 'substituted', 'collapsing',
]);

/**
 * Map a legacy status string to the canonical vocabulary. Already-
 * canonical values pass through. Unknown values default to 'stable'
 * (the most-conservative reading - keeps the engine running).
 */
export function canonicalSupplyChainStatus(legacyStatus) {
  if (typeof legacyStatus !== 'string') return 'stable';
  if (CANONICAL_STATUSES.has(legacyStatus)) return legacyStatus;
  return LEGACY_TO_CANONICAL[legacyStatus] || 'stable';
}

// ── Chain id helper ──────────────────────────────────────────────────────
// Stable id format: 'chain.<needKey>.<chainId>' - matches the legacy
// composite id construction in computeActiveChains.js. Consumers
// querying traces by id from either path see the same shape.

function snakeCase(s) {
  return String(s)
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
}

function chainIdFromShape(chain) {
  if (!chain) return null;
  if (typeof chain.id === 'string' && chain.id.startsWith('chain.')) return chain.id;
  const need = snakeCase(chain.needKey || 'unknown');
  const inner = snakeCase(chain.chainId || chain.label || 'unnamed');
  return `chain.${need}.${inner}`;
}

// ── Beneficiary / victim inference ────────────────────────────────────────
// Pure heuristic over the chain's need category. The roadmap calls for
// these as first-class fields; we provide reasonable defaults so the
// scaffolding is usable today. Custom user content + Tier 4.2 event
// consequences can override per chain in future iterations.

const NEED_HEURISTICS = Object.freeze({
  food_security: {
    beneficiaries: ['common population', 'grain merchants', 'temple relief'],
    victims:       ['the poor', 'casual labor', 'children'],
    failureConsequence: 'bread prices climb; relief queues lengthen; legitimacy strains.',
  },
  manufacturing: {
    beneficiaries: ['craft guilds', 'merchants'],
    victims:       ['unaffiliated craftsmen', 'consumers reliant on local goods'],
    failureConsequence: 'craft prices rise; export revenue drops; guild authority weakens.',
  },
  raw_extraction: {
    beneficiaries: ['mine owners', 'craft buyers'],
    victims:       ['miners and quarry workers', 'downstream manufacturers'],
    failureConsequence: 'raw inputs run short; downstream chains feel the squeeze first.',
  },
  trade: {
    beneficiaries: ['merchants', 'tax base', 'cosmopolitan residents'],
    victims:       ['the isolated', 'specialty-good consumers'],
    failureConsequence: 'imports vanish; smuggling rises; merchant influence shifts.',
  },
  energy: {
    beneficiaries: ['homes', 'crafts requiring fuel', 'smiths'],
    victims:       ['the poor in winter', 'fuel-dependent crafts'],
    failureConsequence: 'winter hardship; smithy output falls; charcoal prices rise.',
  },
  arcane: {
    beneficiaries: ['arcane orders', 'wealthy clients'],
    victims:       ['those dependent on magical services'],
    failureConsequence: 'magical services lapse; alchemical supplies dry up.',
  },
});

function inferBeneficiaries(chain) {
  const h = NEED_HEURISTICS[chain.needKey];
  return h ? [...h.beneficiaries] : ['settlement residents'];
}

function inferVictims(chain) {
  const h = NEED_HEURISTICS[chain.needKey];
  return h ? [...h.victims] : ['settlement residents'];
}

function inferFailureConsequence(chain) {
  const h = NEED_HEURISTICS[chain.needKey];
  if (!h) return 'The settlement adapts; specifics depend on context.';
  // If we already have a strained or scarce status, soften the language.
  return h.failureConsequence;
}

// ── Regional pressure inference ─────────────────────────────────────────
// The regional engine materializes impacts as active conditions. Supply
// chains read those conditions as additional pressure, preserving the
// generator's base chain output while letting campaign-canon causality
// explain why a normally stable chain has become fragile.

const REGIONAL_CHAIN_ARCHETYPES = new Set([
  'regional_import_shortage',
  'regional_export_market_loss',
  'regional_route_disruption',
  'regional_service_disruption',
  'regional_conflict_pressure',
  'regional_protection_gap',
  'regional_tax_revenue_disruption',
]);

function searchableChainText(chain) {
  return [
    chain?.name,
    chain?.label,
    chain?.chainId,
    chain?.needKey,
    chain?.needLabel,
    chain?.resource,
    ...(Array.isArray(chain?.outputs) ? chain.outputs : []),
    ...(Array.isArray(chain?.services) ? chain.services : []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function conditionMatchesChain(condition, chain, haystack) {
  if (!condition || !chain) return false;
  const systems = Array.isArray(condition.affectedSystems) ? condition.affectedSystems : [];
  if (systems.includes(chain.needKey)) return true;
  if (chain.exportable && systems.some(s => ['trade_connectivity', 'merchant_wealth'].includes(s))) return true;
  if (chain.entrepot && systems.includes('trade_connectivity')) return true;
  const conditionText = [
    condition.label,
    condition.description,
    ...(Array.isArray(condition.causes) ? condition.causes.map(c => c.reason || c.effect || c.source) : []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return haystack
    .split(/[^a-z0-9]+/)
    .filter(token => token.length >= 4)
    .some(token => conditionText.includes(token));
}

function inferRegionalPressures(chain, settlement) {
  if (!settlement) return [];
  const haystack = searchableChainText(chain);
  return deriveAllActiveConditions(settlement)
    .filter(condition => REGIONAL_CHAIN_ARCHETYPES.has(condition.archetype))
    .filter(condition => conditionMatchesChain(condition, chain, haystack))
    .map(condition => ({
      id: condition.id,
      archetype: condition.archetype,
      label: condition.label,
      severity: condition.severity,
      status: condition.status,
      affectedSystems: Array.isArray(condition.affectedSystems) ? [...condition.affectedSystems] : [],
    }))
    .sort((a, b) => (b.severity || 0) - (a.severity || 0));
}

function applyRegionalPressureToStatus(baseStatus, regionalPressures) {
  if (!regionalPressures.length) return baseStatus;
  const maxSeverity = Math.max(...regionalPressures.map(p => p.severity || 0));
  const severeCount = regionalPressures.filter(p => (p.severity || 0) >= 0.55).length;

  if (baseStatus === 'blocked' || baseStatus === 'captured' || baseStatus === 'collapsing') {
    return severeCount >= 2 ? 'collapsing' : baseStatus;
  }
  if (baseStatus === 'scarce') {
    return severeCount >= 2 || maxSeverity >= 0.8 ? 'collapsing' : 'scarce';
  }
  if (baseStatus === 'strained') {
    return maxSeverity >= 0.65 ? 'scarce' : 'strained';
  }
  if (baseStatus === 'substituted') {
    return maxSeverity >= 0.75 ? 'scarce' : 'substituted';
  }
  if (maxSeverity >= 0.65) return 'scarce';
  if (maxSeverity >= 0.25) return 'strained';
  return baseStatus;
}

function appendRegionalFailureContext(base, regionalPressures) {
  if (!regionalPressures.length) return base;
  const labels = regionalPressures.slice(0, 2).map(p => p.label).join('; ');
  return `${base} Regional pressure: ${labels}.`;
}

// ── Controller inference ──────────────────────────────────────────────────
// Tier 4.3 wants every chain to declare a controller - usually a
// faction or institution that takes a rent on the chain's output. We
// derive from the dependency.institution when present (the most
// reliable signal), falling back to the first processing institution.
// If neither is present, the controller is 'unattributed'.

function inferController(chain) {
  if (chain?.dependency?.institution) return chain.dependency.institution;
  const first = Array.isArray(chain?.processingInstitutions) ? chain.processingInstitutions[0] : null;
  if (first) return first;
  return 'unattributed';
}

// ── Dependencies ─────────────────────────────────────────────────────────
// A chain's dependencies are: its required resource (if any), its
// upstream chains, and any processing institution it needs. The
// resulting list is a flat strings array suitable for "what does this
// chain need?" displays.

function inferDependencies(chain) {
  const out = [];
  if (chain?.resource) out.push(`resource: ${chain.resource}`);
  if (Array.isArray(chain?.upstreamChains)) {
    for (const u of chain.upstreamChains) out.push(`upstream: ${u}`);
  }
  if (Array.isArray(chain?.processingInstitutions) && chain.processingInstitutions.length) {
    out.push(`processor: ${chain.processingInstitutions[0]}`);
  }
  return out;
}

// ── Substitutes ──────────────────────────────────────────────────────────
// chain.substituteActive flags whether the chain is *currently* running
// via a substitute. The list of *possible* substitutes lives in the
// catalog rather than on the chain instance, so we report only what
// the current shape supports: a one-entry list when a substitute is
// active, empty otherwise. Tier 4.16 (custom content as causal objects)
// will expand this; for now it's a faithful read of available data.

function inferSubstitutes(chain) {
  if (chain?.substituteActive) return ['active magical / alternative substitute in use'];
  return [];
}

// ── Composer ─────────────────────────────────────────────────────────────

/**
 * Build a structured supply-chain state for a single chain.
 *
 * Pure; idempotent; lossless on legacy fields. Returns null for
 * nullish input.
 *
 * @param {Object} chain      Active chain entry from
 *                            settlement.economicState.activeChains[].
 * @param {Object} [settlement] Optional context - reserved for
 *                            controller-by-faction-archetype derivation
 *                            in future iterations.
 * @returns {Object|null}
 */
export function deriveSupplyChainState(chain, settlement) {
  if (!chain || typeof chain !== 'object') return null;

  const baseStatus = canonicalSupplyChainStatus(chain.status);
  const regionalPressures = inferRegionalPressures(chain, settlement);
  const status = applyRegionalPressureToStatus(baseStatus, regionalPressures);

  return {
    id: chainIdFromShape(chain),
    // Honor canonical `name` first so re-deriving a previously-derived
    // chain produces the same shape (idempotent contract). Falls back
    // to the legacy label / chainId on first-pass derivation.
    name: chain.name || chain.label || chain.chainId || 'Unnamed chain',
    needKey: chain.needKey,
    needLabel: chain.needLabel,

    status,
    // Preserve any prior legacyStatus on re-derivation; on first pass
    // capture the raw status string from the legacy shape.
    legacyStatus: chain.legacyStatus || chain.status,

    controller:          inferController(chain),
    dependencies:        inferDependencies(chain),
    substitutes:         inferSubstitutes(chain),
    beneficiaries:       inferBeneficiaries(chain),
    victims:             inferVictims(chain),
    failureConsequences: appendRegionalFailureContext(inferFailureConsequence(chain), regionalPressures),
    regionalPressures,

    // Carry forward common legacy fields so consumers reading the
    // legacy shape via this derivation keep working.
    outputs:                chain.outputs,
    services:               chain.services,
    resource:               chain.resource,
    exportable:             chain.exportable,
    entrepot:               chain.entrepot,
    activatedByResource:    chain.activatedByResource,
    substituteActive:       chain.substituteActive,
    resourceDepleted:       chain.resourceDepleted,
    dependency:             chain.dependency,
    // Phase 19: preserve processingInstitutions so the explanation
    // module can match institutions to the chains that use them as
    // processors. The legacy generator emits this field; we just
    // didn't carry it forward in the initial Phase 10 derivation.
    processingInstitutions: Array.isArray(chain.processingInstitutions)
      ? [...chain.processingInstitutions]
      : [],
  };
}

/** Enrich every active chain on a settlement. Returns []. for missing data. */
export function deriveAllSupplyChainStates(settlement) {
  if (!settlement) return [];
  const chains = settlement.economicState?.activeChains
              || settlement.economy?.activeChains
              || settlement.supplyChains
              || [];
  return chains.map(c => deriveSupplyChainState(c, settlement)).filter(Boolean);
}

// ── Diagnostic helpers ────────────────────────────────────────────────────
// Cheap counters used by the simulation spine, distribution tests, and
// future Tier 4.10 "if nothing changes" forecasts.

/**
 * Count chains by canonical status. Returns { stable, strained,
 * scarce, blocked, captured, substituted, collapsing } with zeros.
 */
export function supplyChainStatusBreakdown(settlement) {
  const out = {
    stable: 0, strained: 0, scarce: 0, blocked: 0,
    captured: 0, substituted: 0, collapsing: 0,
  };
  for (const c of deriveAllSupplyChainStates(settlement)) {
    if (out[c.status] !== undefined) out[c.status] += 1;
  }
  return out;
}

/** True when any chain is in a non-stable state. */
export function hasDisruptedChains(settlement) {
  for (const c of deriveAllSupplyChainStates(settlement)) {
    if (c.status !== 'stable') return true;
  }
  return false;
}
