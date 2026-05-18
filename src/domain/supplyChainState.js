/**
 * domain/supplyChainState.js — Stateful supply-chain derivation.
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
 * No imports from src/lib — the domain tsconfig include stays
 * self-contained, same constraint Phase 9 honored.
 */

// ── Status remap ──────────────────────────────────────────────────────────
// Legacy vocabulary → canonical vocabulary per the roadmap. The status
// fields encode different intensities:
//
//   stable      — chain runs normally with all inputs available
//   strained    — chain runs but with stress (e.g. substituted inputs)
//   scarce      — chain is producing below normal output
//   blocked     — chain is offline due to a hard upstream failure
//   captured    — chain is controlled by a single faction taking rents
//   substituted — chain runs via an alternative path (e.g. magic substitute)
//   collapsing  — chain is failing under multiple compounding pressures
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
 * (the most-conservative reading — keeps the engine running).
 */
export function canonicalSupplyChainStatus(legacyStatus) {
  if (typeof legacyStatus !== 'string') return 'stable';
  if (CANONICAL_STATUSES.has(legacyStatus)) return legacyStatus;
  return LEGACY_TO_CANONICAL[legacyStatus] || 'stable';
}

// ── Chain id helper ──────────────────────────────────────────────────────
// Stable id format: 'chain.<needKey>.<chainId>' — matches the legacy
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

// ── Controller inference ──────────────────────────────────────────────────
// Tier 4.3 wants every chain to declare a controller — usually a
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
 * @param {Object} [settlement] Optional context — reserved for
 *                            controller-by-faction-archetype derivation
 *                            in future iterations.
 * @returns {Object|null}
 */
// eslint-disable-next-line no-unused-vars
export function deriveSupplyChainState(chain, settlement) {
  if (!chain || typeof chain !== 'object') return null;

  const status = canonicalSupplyChainStatus(chain.status);

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
    failureConsequences: inferFailureConsequence(chain),

    // Carry forward common legacy fields so consumers reading the
    // legacy shape via this derivation keep working.
    outputs:             chain.outputs,
    services:            chain.services,
    resource:            chain.resource,
    exportable:          chain.exportable,
    entrepot:            chain.entrepot,
    activatedByResource: chain.activatedByResource,
    substituteActive:    chain.substituteActive,
    resourceDepleted:    chain.resourceDepleted,
    dependency:          chain.dependency,
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
