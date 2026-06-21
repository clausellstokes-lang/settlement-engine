/**
 * domain/devAnomalies.js — DEV-only anomaly detector.
 *
 * Surfaces internal warnings about
 * generation edge cases that production users don't see but
 * developers care about:
 *
 *   - Faction references an institution that doesn't exist
 *   - Active chain with no processing institution on the settlement
 *   - Stressor not consumed by any derived state
 *   - NPC references a faction that doesn't exist
 *   - Trace entry missing core fields
 *
 *   detectDevAnomalies(settlement) -> {
 *     anomalies: [{ severity, type, message, references[] }],
 *     count
 *   }
 *
 * Pure read-only. Separate from contradictions (those are
 * narrative tensions); these are STRUCTURAL inconsistencies the dev
 * UI flags for diagnosis.
 */

import { deriveAllSupplyChainStates } from './supplyChainState.js';

export const ANOMALY_SEVERITIES = Object.freeze(['info', 'warning', 'error']);
export const ANOMALY_TYPES = Object.freeze([
  'faction_references_missing_institution',
  'chain_missing_processor',
  'stressor_unconsumed',
  'npc_references_missing_faction',
  'trace_missing_core_fields',
]);

// ── Detectors ────────────────────────────────────────────────────────────

function detectFactionInstitutionRefs(settlement) {
  const out = [];
  const inst = Array.isArray(settlement.institutions) ? settlement.institutions : [];
  const institutionIds = new Set(inst.map(i => i?.id).filter(Boolean));
  const factions = settlement.powerStructure?.factions || [];
  for (const f of factions) {
    const refs = Array.isArray(f?.controlsInstitutionIds) ? f.controlsInstitutionIds : [];
    for (const ref of refs) {
      if (!institutionIds.has(ref)) {
        out.push({
          severity: 'warning',
          type: 'faction_references_missing_institution',
          message: `Faction "${f.faction || f.name}" controls "${ref}" but no such institution exists on the settlement.`,
          references: [
            { id: f.id || `faction.${(f.faction || '').toLowerCase()}`, label: f.faction || f.name, type: 'faction' },
            { id: ref, label: ref, type: 'institution' },
          ],
        });
      }
    }
  }
  return out;
}

function detectChainMissingProcessors(settlement) {
  const out = [];
  const inst = Array.isArray(settlement.institutions) ? settlement.institutions : [];
  const institutionNames = new Set(inst.map(i => String(i?.name || '')));
  const chains = deriveAllSupplyChainStates(settlement);
  for (const c of chains) {
    const processors = Array.isArray(c.processingInstitutions) ? c.processingInstitutions : [];
    if (processors.length === 0) continue;
    const missing = processors.filter(name => !institutionNames.has(name));
    if (missing.length > 0) {
      out.push({
        severity: 'warning',
        type: 'chain_missing_processor',
        message: `Supply chain "${c.name}" lists processor(s) [${missing.join(', ')}] that don't exist as institutions.`,
        references: [
          { id: c.id, label: c.name, type: 'chain' },
        ],
      });
    }
  }
  return out;
}

function detectStressorUnconsumed(settlement) {
  // A stressor is "consumed" if there's a matching active condition,
  // threat, or causal-state contributor referencing it. We do a coarse
  // check: any stressor with a 'name' or 'type' that doesn't appear
  // anywhere as a tag is flagged.
  const out = [];
  const stressors = Array.isArray(settlement.stressors) ? settlement.stressors : [];
  if (stressors.length === 0) return out;
  const conditions = Array.isArray(settlement.activeConditions) ? settlement.activeConditions : [];
  const condArchetypes = new Set(conditions.map(c => c?.archetype).filter(Boolean));
  for (const s of stressors) {
    if (!s) continue;
    const key = String(s.type || s.name || '').toLowerCase();
    if (!key) continue;
    // Match if any condition archetype is a substring of the stressor key
    // or vice versa.
    const consumed = Array.from(condArchetypes).some(a =>
      a === key || key.includes(a) || a.includes(key)
    );
    if (!consumed) {
      out.push({
        severity: 'info',
        type: 'stressor_unconsumed',
        message: `Stressor "${key}" has no matching active condition — it may be applied only as cosmetic state.`,
        references: [],
      });
    }
  }
  return out;
}

function detectNpcFactionRefs(settlement) {
  const out = [];
  const factions = settlement.powerStructure?.factions || [];
  const factionNames = new Set(factions.map(f => String(f?.faction || f?.name || '').toLowerCase()));
  const npcs = Array.isArray(settlement.npcs) ? settlement.npcs : [];
  for (const n of npcs) {
    if (!n?.factionAffiliation) continue;
    const ref = String(n.factionAffiliation).toLowerCase();
    // Tolerant match: any faction name that is a substring of the affiliation
    // or vice versa.
    const matched = Array.from(factionNames).some(fn => fn === ref || fn.includes(ref) || ref.includes(fn));
    if (!matched) {
      out.push({
        severity: 'warning',
        type: 'npc_references_missing_faction',
        message: `NPC "${n.name || n.id}" affiliates with "${n.factionAffiliation}" but no such faction exists on the settlement.`,
        references: [
          { id: n.id || 'npc.unknown', label: n.name, type: 'npc' },
        ],
      });
    }
  }
  return out;
}

function detectTraceMissingFields(settlement) {
  const out = [];
  const traces = Array.isArray(settlement.simulationTrace) ? settlement.simulationTrace : [];
  for (const t of traces) {
    if (!t) continue;
    const missing = [];
    if (typeof t.targetType !== 'string' || !t.targetType) missing.push('targetType');
    if (typeof t.targetId   !== 'string' || !t.targetId)   missing.push('targetId');
    if (typeof t.step       !== 'string' || !t.step)       missing.push('step');
    if (typeof t.result     !== 'string' || !t.result)     missing.push('result');
    if (missing.length > 0) {
      out.push({
        severity: 'error',
        type: 'trace_missing_core_fields',
        message: `Trace entry missing field(s): ${missing.join(', ')}.`,
        references: [],
      });
    }
  }
  return out;
}

// ── Composer ─────────────────────────────────────────────────────────────

export function detectDevAnomalies(settlement) {
  if (!settlement) return { anomalies: [], count: 0 };
  const anomalies = [
    ...detectFactionInstitutionRefs(settlement),
    ...detectChainMissingProcessors(settlement),
    ...detectStressorUnconsumed(settlement),
    ...detectNpcFactionRefs(settlement),
    ...detectTraceMissingFields(settlement),
  ];
  return { anomalies, count: anomalies.length };
}

/** Group anomalies by severity for dashboard tiles. */
export function anomalyBreakdown(settlement) {
  const out = { info: 0, warning: 0, error: 0, total: 0 };
  const { anomalies } = detectDevAnomalies(settlement);
  for (const a of anomalies) {
    if (out[a.severity] !== undefined) out[a.severity] += 1;
    out.total += 1;
  }
  return out;
}

/** Catalogs. */
export function supportedAnomalyTypes() {
  return [...ANOMALY_TYPES];
}
export function supportedAnomalySeverities() {
  return [...ANOMALY_SEVERITIES];
}
