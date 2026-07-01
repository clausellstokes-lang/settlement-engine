/**
 * domain/counterfactual.js — "What if removed?" causal projection.
 *
 * This is the pure composition layer: everything the structured
 * derivations produced — substrate diffs, event pipeline, explanation
 * envelopes, capacity supply/demand, daily-life slots — can now answer:
 *
 *   counterfactual(settlement, { type, id, action }) ->
 *     CounterfactualResult {
 *       target, action,
 *       nextSettlement,
 *       beforeExplanation, afterExplanation,
 *       deltas: {
 *         systemState, causalState, capacities,
 *         factionRelationships, dailyLife,
 *       },
 *       summary,
 *       warnings,
 *     }
 *
 * Action vocabulary (V1):
 *   remove      — entirely remove the entity
 *   weaken      — significant degradation (severity 0.8)
 *   strengthen  — boost / restore the entity
 *   replace     — remove and substitute (future iteration)
 *
 * Supported entity types in V1:
 *   institution   — uses event pipeline
 *                   (REMOVE_INSTITUTION / DAMAGE_INSTITUTION / ADD_INSTITUTION)
 *   npc           — KILL_NPC via the event pipeline
 *   faction       — manual clone-and-modify (no event archetype yet)
 *   chain         — manual clone-and-modify of chain status
 *
 * Pure function. The input settlement is never mutated.
 *
 * Compounding payoff:
 *   - This is the "ifRemoved" envelope, but ACTUALLY RUN.
 *     The pure projection lets the UI show real numeric deltas with
 *     real prose, not authored guesses.
 *   - Causal delta summaries after regeneration are the
 *     same shape as a counterfactual diff — both consume the same
 *     helpers.
 *   - For AI grounded-in-trace, the counterfactual result is
 *     a complete grounding envelope the AI can describe with prose.
 */

import { runEventPipeline } from './events/eventPipeline.js';
import { explainEntity } from './explanation.js';
import { deriveSystemState } from './state/deriveSystemState.js';
import { compareSystemState } from './state/compareSystemState.js';
import { deriveCausalState, compareCausalState } from './causalState.js';
import { deriveAllCapacities, compareCapacityStates } from './capacityModel.js';
import { deriveDailyLife, compareDailyLife } from './dailyLife.js';
import { deriveAllFactionProfiles } from './factionProfile.js';
import { deriveAllSupplyChainStates } from './supplyChainState.js';

// ── Action vocabulary ────────────────────────────────────────────────────

export const COUNTERFACTUAL_ACTIONS = Object.freeze([
  'remove', 'weaken', 'strengthen', 'replace',
]);

// ── Action → event mapping for the event-pipeline path ───────────────────

/**
 * @param {string} type
 * @param {string} id
 * @param {string} action
 */
function buildEventFor(type, id, action) {
  // Bare-id institution targets (e.g. 'institution.granary'): the
  // event registry expects the targetId to match an institution.id on
  // the settlement, so we pass it through. Sub-strings like
  // 'granary' also work because the registry's classifier matches
  // by substring.
  switch (`${type}:${action}`) {
    case 'institution:remove':
      return { type: 'REMOVE_INSTITUTION', targetId: id, cause: 'counterfactual' };
    case 'institution:weaken':
      return { type: 'DAMAGE_INSTITUTION', targetId: id, payload: { severity: 0.8 }, cause: 'counterfactual' };
    case 'institution:strengthen':
      return { type: 'ADD_INSTITUTION', targetId: id, cause: 'counterfactual' };
    case 'npc:remove':
      return { type: 'KILL_NPC', targetId: id, cause: 'counterfactual' };
    default:
      return null;  // not event-pipeline-supported; manual path
  }
}

// ── Manual clone-and-modify (factions / chains / replace) ────────────────

/**
 * @param {import('./settlement.schema.js').SimSettlement} settlement
 * @param {string} type
 * @param {string} id
 * @param {string} action
 */
function manualMutate(settlement, type, id, action) {
  // Pure clone strategy: spread the relevant paths so consumers
  // don't observe mutation of the input.
  const next = { ...settlement };

  if (type === 'faction') {
    const factionId = String(id || '');
    const slug = factionId.startsWith('faction.') ? factionId.slice('faction.'.length) : factionId;
    const factions = (settlement.powerStructure?.factions || []).map(/** @param {any} f */ f => {
      const fSlug = (f?.faction || f?.name || '').toLowerCase().replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '');
      const matched = f?.id === factionId || fSlug === slug;
      if (!matched) return f;
      const power = typeof f?.power === 'number' ? f.power : 0;
      let nextPower = power;
      if (action === 'remove')      nextPower = 0;
      if (action === 'weaken')      nextPower = Math.max(0, power - 30);
      if (action === 'strengthen')  nextPower = Math.min(100, power + 20);
      return { ...f, power: nextPower, _counterfactual: { previousPower: power, action } };
    });
    next.powerStructure = {
      ...(settlement.powerStructure || {}),
      factions,
    };
    return next;
  }

  if (type === 'chain') {
    const chainId = String(id || '');
    const activeChains = (settlement.economicState?.activeChains || []).map(/** @param {any} c */ c => {
      const candidateId = `chain.${(c?.needKey || '').toLowerCase()}.${(c?.chainId || '').toLowerCase()}`;
      if (chainId === candidateId || c?.id === chainId) {
        const nextStatus =
          action === 'remove'     ? 'collapsing' :
          action === 'weaken'     ? 'scarce'     :
          action === 'strengthen' ? 'operational':
                                    c?.status;
        return { ...c, status: nextStatus, _counterfactual: { previousStatus: c?.status, action } };
      }
      return c;
    });
    next.economicState = {
      ...(settlement.economicState || {}),
      activeChains,
    };
    return next;
  }

  return next;
}

// ── Composer ─────────────────────────────────────────────────────────────

/**
 * Project the consequences of removing / weakening / strengthening an
 * entity. Pure: never mutates the input settlement.
 *
 * @param {Object} settlement
 * @param {Object} ref
 * @param {string} ref.type    'institution' | 'faction' | 'npc' | 'chain'
 * @param {string} ref.id      Stable id of the entity.
 * @param {string} ref.action  'remove' | 'weaken' | 'strengthen' | 'replace'
 * @returns {Object} CounterfactualResult
 */
export function counterfactual(settlement, ref) {
  const warnings = [];
  if (!settlement) {
    return makeEmptyResult(ref, ['No settlement provided.']);
  }
  if (!ref || !ref.type || !ref.id) {
    return makeEmptyResult(ref, ['Missing target ref (need { type, id, action }).']);
  }
  const action = ref.action || 'remove';
  if (!COUNTERFACTUAL_ACTIONS.includes(action)) {
    return makeEmptyResult(ref, [`Unknown action: ${action}`]);
  }

  // 1. Capture BEFORE state (pure derivations).
  const beforeExplanation = explainEntity(settlement, { type: ref.type, id: ref.id });
  const beforeSystemState = deriveSystemState(settlement);
  const beforeCausalState = deriveCausalState(settlement);
  const beforeCapacities  = deriveAllCapacities(settlement);
  const beforeDailyLife   = deriveDailyLife(settlement);

  // 2. Run the projection — either through event pipeline
  // (institutions / npcs) or via manual clone-and-modify (factions /
  // chains).
  let nextSettlement;
  let pipelineResult = null;
  const event = buildEventFor(ref.type, ref.id, action);
  if (event) {
    // Cast: the registry's Event typedef is narrower than the literal
    // shape we build here, but every spec we target accepts a
    // structurally-compatible event.
    pipelineResult = runEventPipeline(settlement, /** @type {any} */ (event));
    nextSettlement = pipelineResult.nextSettlement;
    if (pipelineResult.warnings?.length) warnings.push(...pipelineResult.warnings);
  } else {
    nextSettlement = manualMutate(settlement, ref.type, ref.id, action);
    if (nextSettlement === settlement) {
      warnings.push({
        severity: 'mismatch',
        message: `No counterfactual path for ${ref.type}:${action} yet. Settlement unchanged.`,
      });
    }
  }

  // 3. Re-derive AFTER state.
  const afterSystemState = pipelineResult?.afterSystemState || deriveSystemState(nextSettlement);
  const afterCausalState = pipelineResult?.afterCausalState || deriveCausalState(nextSettlement);
  const afterCapacities  = deriveAllCapacities(nextSettlement);
  const afterDailyLife   = deriveDailyLife(nextSettlement);

  // 4. Re-explain the target on the AFTER settlement (the entity may
  // be gone, in which case explainEntity returns an empty envelope).
  const afterExplanation = explainEntity(nextSettlement, { type: ref.type, id: ref.id });

  // 5. Compute deltas at every layer.
  const deltas = {
    systemState:          pipelineResult?.systemStateDeltas
                          || compareSystemState(beforeSystemState, afterSystemState),
    causalState:          pipelineResult?.causalStateDeltas
                          || compareCausalState(beforeCausalState, afterCausalState),
    capacities:           compareCapacityStates(beforeCapacities, afterCapacities),
    factionRelationships: pipelineResult?.factionRelationshipDeltas || [],
    dailyLife:            compareDailyLife(beforeDailyLife, afterDailyLife),
  };

  // 6. Build narrative summary.
  const targetLabel = beforeExplanation?.entityLabel || ref.id;
  const summary = [];
  summary.push(`Counterfactual: ${action} ${ref.type} "${targetLabel}".`);

  if (pipelineResult?.narrativeSummary) {
    summary.push(pipelineResult.narrativeSummary);
  }

  for (const d of /** @type {any[]} */ (deltas.systemState || [])) {
    if (d.explanation) summary.push(d.explanation);
  }
  for (const d of deltas.capacities || []) {
    summary.push(d.explanation);
  }
  for (const d of deltas.dailyLife || []) {
    summary.push(`${d.label}: now reads "${truncateText(d.after, 100)}"`);
  }

  return {
    target: {
      id: ref.id,
      type: ref.type,
      label: targetLabel,
    },
    action,
    nextSettlement,
    beforeExplanation,
    afterExplanation,
    deltas,
    summary,
    warnings,
  };
}

// ── Convenience: list counterfactual candidates ──────────────────────────

/**
 * Enumerate every entity on the settlement that the counterfactual
 * tool can act on. Useful for the UI's "pick a target" surface.
 */
/** @param {import('./settlement.schema.js').SimSettlement} settlement */
export function counterfactualCandidates(settlement) {
  if (!settlement) return [];
  const out = [];

  // Institutions
  for (const inst of (settlement.institutions || [])) {
    if (!inst) continue;
    const id = inst.id || `institution.${snakeCase(inst.name || '')}`;
    out.push({ type: 'institution', id, label: inst.name || id });
  }

  // Factions (ids)
  for (const p of deriveAllFactionProfiles(settlement)) {
    out.push({ type: 'faction', id: p.id, label: p.name });
  }

  // Chains (ids)
  for (const c of deriveAllSupplyChainStates(settlement)) {
    out.push({ type: 'chain', id: c.id, label: c.name });
  }

  // NPCs
  for (const n of (settlement.npcs || [])) {
    if (!n?.id) continue;
    out.push({ type: 'npc', id: n.id, label: n.name || n.id });
  }

  return out;
}

// ── Diagnostic helpers ───────────────────────────────────────────────────

/** Catalog accessor. */
export function supportedCounterfactualActions() {
  return [...COUNTERFACTUAL_ACTIONS];
}

/**
 * Summarize a counterfactual result as a flat array of lines. Same
 * pattern as summarizeEventResult / summarizeForecast.
 */
/** @param {any} result */
export function summarizeCounterfactual(result) {
  if (!result || !Array.isArray(result.summary)) return [];
  return [...result.summary];
}

// ── Helpers ──────────────────────────────────────────────────────────────

/**
 * @param {any} ref
 * @param {any[]} messages
 */
function makeEmptyResult(ref, messages) {
  return {
    target: ref ? { id: ref.id || null, type: ref.type || null, label: null } : { id: null, type: null, label: null },
    action: ref?.action || null,
    nextSettlement: null,
    beforeExplanation: null,
    afterExplanation: null,
    deltas: {
      systemState: [],
      causalState: [],
      capacities: [],
      factionRelationships: [],
      dailyLife: [],
    },
    summary: [],
    warnings: messages.map(m => typeof m === 'string' ? { severity: 'mismatch', message: m } : m),
  };
}

/** @param {any} s */
function snakeCase(s) {
  return String(s).replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase();
}

/**
 * @param {any} s
 * @param {number} n
 */
function truncateText(s, n) {
  const str = String(s || '');
  if (str.length <= n) return str;
  return str.slice(0, n - 1).trimEnd() + '…';
}
