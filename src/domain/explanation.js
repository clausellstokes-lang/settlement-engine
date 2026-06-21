/**
 * domain/explanation.js — Unified "why does this exist?" causal lookup.
 *
 * Every other phase has produced structured
 * facts about parts of the settlement (faction profiles, supply chains,
 * NPCs, hooks, escalation clocks, history beats, active conditions,
 * the causal substrate, and the trace receipts of every pipeline
 * decision). This module composes all of them into one read-only API:
 *
 *   explainEntity(settlement, { type, id }) -> ExplanationEnvelope
 *
 * Consumers (the "How this was simulated" rail, AI overlay grounding,
 * future PDF detail callouts, the public compendium SEO pages) can
 * pass any entity reference and receive a structured envelope with the
 * causal claim, the inputs that produced it, the downstream effects it
 * supports, and the consequences of removing it — all sourced from
 * existing derivations, no new generator work.
 *
 * Pure functions only. No imports from src/lib.
 *
 * Architectural payoff:
 *   - The "How this was simulated" rail UI becomes "click
 *     any entity → render the envelope."
 *   - AI grounded-in-trace becomes "include the envelope
 *     in the prompt context for the entity the AI is narrating."
 *   - The counterfactual tool becomes "preview an event, run
 *     this explainer against the entity at risk, render the
 *     ifRemoved branch."
 *   - The public compendium gives every entity a stable URL
 *     and a structured detail surface.
 */

import { tracesFor, tracesAffecting, tracesCausedBy } from './trace.js';
import { deriveFactionProfile, deriveAllFactionProfiles } from './factionProfile.js';
import { deriveNpcProfile, deriveAllNpcProfiles } from './npcProfile.js';
import { deriveAllSupplyChainStates } from './supplyChainState.js';
import {
  deriveAllStructuredHooks,
  deriveEscalationClocks,
} from './hookEscalation.js';
import { deriveAllActiveConditions, findActiveCondition } from './activeConditions.js';
import { deriveHistoryBeats } from './historyBeats.js';
import { deriveSystemVariable, SYSTEM_VARIABLES } from './causalState.js';
import { deriveAllThreatProfiles } from './threatProfile.js';
import {
  deriveCapacityProfile,
  CAPACITY_NAMES,
} from './capacityModel.js';
import { deriveAllDistricts } from './districtProfile.js';

// ── Type catalog ─────────────────────────────────────────────────────────

/**
 * Canonical entity types this module knows how to explain. The id prefix
 * for each (`institution.`, `faction.`, etc.) is conventional; the
 * dispatcher accepts both `{ type, id }` form and a bare id with a known
 * prefix.
 */
export const EXPLAINABLE_TYPES = Object.freeze([
  'institution',
  'faction',
  'npc',
  'chain',
  'hook',
  'condition',
  'clock',
  'history_beat',
  'system_variable',
  'threat',
  'capacity',
  'district',
]);

const ID_PREFIX_TO_TYPE = Object.freeze({
  'institution.': 'institution',
  'faction.':     'faction',
  'npc.':         'npc',
  'chain.':       'chain',
  'hook.':        'hook',
  'condition.':   'condition',
  'clock.':       'clock',
  'history.':     'history_beat',
  'var.':         'system_variable',
  'threat.':      'threat',
  'capacity.':    'capacity',
  'district.':    'district',
});

function inferTypeFromId(id) {
  if (typeof id !== 'string') return null;
  for (const prefix of Object.keys(ID_PREFIX_TO_TYPE)) {
    if (id.startsWith(prefix)) return ID_PREFIX_TO_TYPE[prefix];
  }
  // Bare system-variable name (e.g. 'food_security') maps to system_variable.
  if (SYSTEM_VARIABLES.includes(id)) return 'system_variable';
  // Bare capacity name (e.g. 'labor') maps to capacity.
  if (CAPACITY_NAMES.includes(id)) return 'capacity';
  return null;
}

// ── Envelope helpers ─────────────────────────────────────────────────────

function emptyEnvelope(type, id) {
  return {
    entityType: type || null,
    entityId: id || null,
    entityLabel: null,
    causalReason: null,
    causes: [],
    downstreamEffects: [],
    ifRemoved: { consequences: [] },
    profile: null,
    references: [],
    sources: [],
  };
}

function envelope({
  type, id, label,
  causalReason = null,
  causes = [],
  downstreamEffects = [],
  ifRemoved = { consequences: [] },
  profile = null,
  references = [],
  sources = [],
}) {
  return {
    entityType: type,
    entityId: id,
    entityLabel: label,
    causalReason,
    causes,
    downstreamEffects,
    ifRemoved,
    profile,
    references,
    sources,
  };
}

// ── Trace bridges ────────────────────────────────────────────────────────
// Reach into the trace layer to surface "why was this entity
// created/preserved/affected?" The trace shape already encodes the
// {source, effect, reason} causes — we just need to pull the right
// traces and surface them.

/**
 * @param {Array<Object>} traces
 * @returns {Array<{source: string, effect: string, reason: string, step?: string, delta?: number}>}
 */
function tracesAsCauses(traces) {
  /** @type {Array<{source: string, effect: string, reason: string, step?: string, delta?: number}>} */
  const causes = [];
  for (const t of traces || []) {
    for (const c of t.causes || []) {
      causes.push({
        source: c.source,
        effect: c.effect || t.result || 'contributed',
        reason: c.reason,
        step: t.step,
      });
    }
  }
  return causes;
}

/**
 * @param {Array<Object>} traces
 * @returns {Array<{target: string, effect: string, reason: string, step?: string}>}
 */
function tracesAsDownstream(traces) {
  /** @type {Array<{target: string, effect: string, reason: string, step?: string}>} */
  const effects = [];
  for (const t of traces || []) {
    for (const d of t.downstreamEffects || []) {
      effects.push({
        target: d.target,
        effect: d.effect,
        reason: d.reason || t.result,
        step: t.step,
      });
    }
  }
  return effects;
}

// ── Per-type explainers ──────────────────────────────────────────────────

/**
 * Explain an institution. Pulls traces, finds chains that use it
 * as a processor, finds factions that control it, and surfaces the
 * structural ifRemoved consequences.
 */
export function explainInstitution(settlement, institutionId) {
  if (!settlement || !institutionId) return null;
  const institutions = Array.isArray(settlement.institutions) ? settlement.institutions : [];
  const inst = institutions.find(i => i?.id === institutionId || `institution.${snakeCase(i?.name || '')}` === institutionId);
  if (!inst) return emptyEnvelope('institution', institutionId);

  const label = inst.name || institutionId;
  const traces = tracesFor(settlement, institutionId);
  const causes = tracesAsCauses(traces);
  const downstreamEffects = tracesAsDownstream(traces);

  // Find chains that use this institution as a processor.
  const chainsUsing = deriveAllSupplyChainStates(settlement)
    .filter(c => Array.isArray(c.processingInstitutions) && c.processingInstitutions.includes(inst.name));
  for (const c of chainsUsing) {
    downstreamEffects.push({
      target: c.id,
      effect: 'enables_chain',
      reason: `${inst.name} processes for ${c.name}.`,
    });
  }

  // Find factions that control this institution.
  const profiles = deriveAllFactionProfiles(settlement);
  const controllers = profiles.filter(p => Array.isArray(p.controlsInstitutionIds)
    && p.controlsInstitutionIds.includes(institutionId));
  for (const p of controllers) {
    causes.push({
      source: p.id,
      effect: 'controls',
      reason: `${p.name} controls ${inst.name}.`,
    });
  }

  // ifRemoved: chains lose a processor; controlling factions lose leverage.
  const ifRemoved = { consequences: [] };
  for (const c of chainsUsing) {
    ifRemoved.consequences.push(`${c.name} loses a processor and may become ${nextWorseStatus(c.status)}.`);
  }
  for (const p of controllers) {
    ifRemoved.consequences.push(`${p.name} loses an institutional lever; ${p.archetype} power weakens.`);
  }
  if (ifRemoved.consequences.length === 0) {
    ifRemoved.consequences.push(`No direct structural consequence detected — ${inst.name} may serve indirect roles in trade or daily life.`);
  }

  const profile = {
    name: inst.name,
    category: inst.category || null,
    status: inst.status || null,
    tags: Array.isArray(inst.tags) ? [...inst.tags] : [],
    impairments: Array.isArray(inst.impairments) ? [...inst.impairments] : [],
  };

  const references = [
    ...chainsUsing.map(c => ({ id: c.id, label: c.name, type: 'chain' })),
    ...controllers.map(p => ({ id: p.id, label: p.name, type: 'faction' })),
  ];

  return envelope({
    type: 'institution', id: institutionId, label,
    causalReason: causes.length
      ? `${label} exists because ${causes.map(c => c.reason).join(' ')}`
      : `${label} is part of the settlement's institutional fabric.`,
    causes,
    downstreamEffects,
    ifRemoved,
    profile,
    references,
    sources: ['simulationTrace', 'supplyChains', 'factionProfiles'],
  });
}

/** Explain a faction — wants/fears/leverage + dependencies + ifRemoved. */
export function explainFaction(settlement, factionId) {
  if (!settlement || !factionId) return null;
  const factions = settlement.powerStructure?.factions || [];
  const found = factions.find(f => {
    const slug = snakeCase(f?.faction || f?.name || '');
    return f?.id === factionId || `faction.${slug}` === factionId;
  });
  if (!found) return emptyEnvelope('faction', factionId);

  const profile = deriveFactionProfile(found, settlement);
  if (!profile) return emptyEnvelope('faction', factionId);

  const traces = tracesFor(settlement, profile.id);
  const causes = tracesAsCauses(traces);
  const downstreamEffects = tracesAsDownstream(traces);

  // Institutions this faction controls = downstream support
  const controlled = Array.isArray(found.controlsInstitutionIds) ? found.controlsInstitutionIds : [];
  for (const instId of controlled) {
    downstreamEffects.push({
      target: instId,
      effect: 'controls',
      reason: `${profile.name} controls ${instId}.`,
    });
  }

  // Wants/fears flatten into the envelope's profile section
  const profileSummary = {
    archetype: profile.archetype,
    power: profile.power,
    legitimacy: profile.legitimacy ?? null,
    wants: profile.wants || [],
    fears: profile.fears || [],
    leverage: profile.leverage || [],
    vulnerabilities: profile.vulnerabilities || [],
    resources: profile.resources || {},
  };

  // ifRemoved: power vacuum + rival lift
  const ifRemoved = { consequences: [] };
  ifRemoved.consequences.push(
    `${profile.name} (${profile.archetype}) leaves a ${profile.archetype}-shaped power vacuum.`
  );
  if (controlled.length) {
    ifRemoved.consequences.push(
      `${controlled.length} controlled institution(s) lose their patron and may drift to rivals or fall idle.`
    );
  }
  // Identify a plausible rival
  const others = deriveAllFactionProfiles(settlement).filter(p => p.id !== profile.id);
  const rival = others.sort((a, b) => (b.power || 0) - (a.power || 0))[0];
  if (rival) {
    ifRemoved.consequences.push(`Most likely beneficiary: ${rival.name} (${rival.archetype}).`);
  }

  const references = controlled.map(id => ({ id, label: id, type: 'institution' }));

  return envelope({
    type: 'faction', id: profile.id, label: profile.name,
    causalReason: causes.length
      ? `${profile.name} exists because ${causes.map(c => c.reason).join(' ')}`
      : `${profile.name} is a ${profile.archetype} faction in the settlement's power structure.`,
    causes,
    downstreamEffects,
    ifRemoved,
    profile: profileSummary,
    references,
    sources: ['simulationTrace', 'factionProfile'],
  });
}

/** Explain an NPC — profile + consequenceIfRemoved + faction link. */
export function explainNpc(settlement, npcId) {
  if (!settlement || !npcId) return null;
  const npcs = Array.isArray(settlement.npcs) ? settlement.npcs : [];
  const found = npcs.find(n => n?.id === npcId);
  if (!found) return emptyEnvelope('npc', npcId);

  const profile = deriveNpcProfile(found, settlement);
  if (!profile) return emptyEnvelope('npc', npcId);

  const traces = tracesFor(settlement, profile.id);
  const causes = tracesAsCauses(traces);
  const downstreamEffects = tracesAsDownstream(traces);

  if (profile.factionLink) {
    causes.push({
      source: profile.factionLink,
      effect: 'affiliates',
      reason: `${profile.name} is aligned with ${profile.factionLink}.`,
    });
  }
  if (profile.institutionLink) {
    causes.push({
      source: profile.institutionLink,
      effect: 'occupies',
      reason: `${profile.name} occupies ${profile.institutionLink}.`,
    });
  }

  const ifRemoved = {
    consequences: Array.isArray(profile.consequenceIfRemoved?.consequences)
      ? [...profile.consequenceIfRemoved.consequences]
      : [],
  };
  if (ifRemoved.consequences.length === 0) {
    ifRemoved.consequences.push(`Removing ${profile.name} weakens the ${profile.archetype} faction and may trigger succession.`);
  }

  const profileSummary = {
    archetype: profile.archetype,
    rank: profile.rank,
    leverage: profile.leverage || [],
    vulnerabilities: profile.vulnerabilities || [],
    factionLink: profile.factionLink,
    institutionLink: profile.institutionLink,
  };

  const references = [
    profile.factionLink && { id: profile.factionLink, label: profile.factionLink, type: 'faction' },
    profile.institutionLink && { id: profile.institutionLink, label: profile.institutionLink, type: 'institution' },
  ].filter(Boolean);

  return envelope({
    type: 'npc', id: profile.id, label: profile.name,
    causalReason: `${profile.name} is a ${profile.rank} ${profile.archetype} figure in the settlement.`,
    causes,
    downstreamEffects,
    ifRemoved,
    profile: profileSummary,
    references,
    sources: ['simulationTrace', 'npcProfile'],
  });
}

/** Explain a supply chain — controller/dependencies/failureConsequences. */
export function explainSupplyChain(settlement, chainId) {
  if (!settlement || !chainId) return null;
  const all = deriveAllSupplyChainStates(settlement);
  const chain = all.find(c => c.id === chainId);
  if (!chain) return emptyEnvelope('chain', chainId);

  const traces = tracesFor(settlement, chain.id);
  const causes = tracesAsCauses(traces);
  const downstreamEffects = tracesAsDownstream(traces);

  // Dependencies become causes
  for (const dep of chain.dependencies || []) {
    causes.push({
      source: dep,
      effect: 'requires',
      reason: `${chain.name} requires ${dep}.`,
    });
  }
  // Outputs and exports become downstream effects
  for (const out of chain.outputs || []) {
    downstreamEffects.push({ target: out, effect: 'produces', reason: `${chain.name} produces ${out}.` });
  }
  if (chain.controller && chain.controller !== 'unattributed') {
    causes.push({
      source: chain.controller,
      effect: 'controls',
      reason: `${chain.controller} controls ${chain.name}.`,
    });
  }

  const ifRemoved = {
    consequences: chain.failureConsequences ? [chain.failureConsequences] : [],
  };
  for (const victim of chain.victims || []) {
    ifRemoved.consequences.push(`${victim} bears the brunt of the disruption.`);
  }

  const profile = {
    needKey: chain.needKey,
    status: chain.status,
    controller: chain.controller,
    beneficiaries: chain.beneficiaries || [],
    victims: chain.victims || [],
    dependencies: chain.dependencies || [],
    substitutes: chain.substitutes || [],
    outputs: chain.outputs || [],
  };

  const references = (chain.dependencies || []).map(d => ({ id: d, label: d, type: 'unknown' }));

  return envelope({
    type: 'chain', id: chain.id, label: chain.name,
    causalReason: `${chain.name} is the supply chain for ${chain.needKey}, currently ${chain.status}.`,
    causes,
    downstreamEffects,
    ifRemoved,
    profile,
    references,
    sources: ['simulationTrace', 'supplyChainState'],
  });
}

/** Explain a hook — origin/severity/ifIgnored/possibleResolutions. */
export function explainHook(settlement, hookId) {
  if (!settlement || !hookId) return null;
  const all = deriveAllStructuredHooks(settlement);
  const hook = all.find(h => h.id === hookId);
  if (!hook) return emptyEnvelope('hook', hookId);

  const causes = [];
  if (hook.source) {
    causes.push({ source: hook.source, effect: 'surfaces', reason: `Hook surfaced from ${hook.source}.` });
  }
  if (hook.eventName) {
    causes.push({ source: hook.eventName, effect: 'references', reason: `References historical event "${hook.eventName}".` });
  }

  const downstreamEffects = (hook.ifIgnored || []).map(text => ({
    target: 'narrative',
    effect: 'consequence_if_ignored',
    reason: text,
  }));

  const ifRemoved = {
    consequences: ['The hook is removed from active surfaces; players have one fewer thread to pull on.'],
  };

  const profile = {
    origin: hook.origin,
    severity: hook.severity,
    category: hook.category,
    source: hook.source,
    eventName: hook.eventName || null,
    possibleResolutions: hook.possibleResolutions || [],
  };

  return envelope({
    type: 'hook', id: hook.id, label: hook.text,
    causalReason: `${hook.severity} ${hook.origin} hook surfaced from ${hook.source}.`,
    causes,
    downstreamEffects,
    ifRemoved,
    profile,
    references: [],
    sources: ['hookEscalation'],
  });
}

/** Explain an active condition — archetype/severity/affectedSystems. */
export function explainCondition(settlement, conditionId) {
  if (!settlement || !conditionId) return null;
  const cond = findActiveCondition(settlement, conditionId);
  if (!cond) return emptyEnvelope('condition', conditionId);

  const causes = [];
  if (cond.triggeredAt?.sourceEventType) {
    causes.push({
      source: cond.triggeredAt.sourceEventType,
      effect: 'triggered',
      reason: `Condition triggered by ${cond.triggeredAt.sourceEventType}.`,
    });
  }
  if (cond.triggeredAt?.sourceEventTargetId) {
    causes.push({
      source: cond.triggeredAt.sourceEventTargetId,
      effect: 'targets',
      reason: `Targets ${cond.triggeredAt.sourceEventTargetId}.`,
    });
  }

  const downstreamEffects = (cond.affectedSystems || []).map(sys => ({
    target: sys,
    effect: 'pressures',
    reason: `${cond.label} pressures ${sys}.`,
  }));

  const ifRemoved = {
    consequences: [
      `${cond.label} lifts; affected systems (${(cond.affectedSystems || []).join(', ')}) begin recovering.`,
    ],
  };

  const profile = {
    archetype: cond.archetype,
    severity: cond.severity,
    severityBand: cond.severityBand,
    status: cond.status,
    affectedSystems: cond.affectedSystems || [],
    duration: cond.duration,
  };

  return envelope({
    type: 'condition', id: cond.id, label: cond.label,
    causalReason: cond.description || `${cond.label} is a ${cond.severityBand}-severity condition.`,
    causes,
    downstreamEffects,
    ifRemoved,
    profile,
    references: (cond.affectedSystems || []).map(s => ({ id: s, label: s, type: 'system_variable' })),
    sources: ['activeConditions'],
  });
}

/** Explain an escalation clock — trigger + stages. */
export function explainEscalationClock(settlement, clockId) {
  if (!settlement || !clockId) return null;
  const all = deriveEscalationClocks(settlement);
  const clock = all.find(c => c.id === clockId);
  if (!clock) return emptyEnvelope('clock', clockId);

  const causes = [{
    source: clock.triggerTargetId,
    effect: 'triggers',
    reason: clock.triggerDescription,
  }];

  const downstreamEffects = clock.stages.map((stage, i) => ({
    target: `stage_${i + 1}`,
    effect: 'progresses',
    reason: stage,
  }));

  const ifRemoved = {
    consequences: [`Clock resolves; the ${clock.label.toLowerCase()} threat dissipates.`],
  };

  const profile = {
    label: clock.label,
    triggerDescription: clock.triggerDescription,
    triggerSource: clock.triggerSource,
    triggerStatus: clock.triggerStatus,
    stages: clock.stages,
  };

  return envelope({
    type: 'clock', id: clock.id, label: clock.label,
    causalReason: clock.triggerDescription,
    causes,
    downstreamEffects,
    ifRemoved,
    profile,
    references: [{ id: clock.triggerTargetId, label: clock.triggerTargetId, type: 'unknown' }],
    sources: ['hookEscalation'],
  });
}

/** Explain a history beat. */
export function explainHistoryBeat(settlement, beatKey) {
  if (!settlement || !beatKey) return null;
  const beats = deriveHistoryBeats(settlement);
  const key = beatKey.startsWith('history.') ? beatKey.slice('history.'.length) : beatKey;
  const beat = beats[key];
  if (!beat) return emptyEnvelope('history_beat', beatKey);

  const causes = [{
    source: beat.source,
    effect: 'recorded',
    reason: `Recorded in ${beat.source}.`,
  }];

  const profile = {
    key: beat.key,
    label: beat.label,
    text: beat.text,
    source: beat.source,
    references: beat.references || {},
  };

  return envelope({
    type: 'history_beat', id: `history.${beat.key}`, label: beat.label,
    causalReason: beat.text,
    causes,
    downstreamEffects: [],
    ifRemoved: { consequences: ['Settlement history loses a referenced beat; downstream narratives may need to be recomputed.'] },
    profile,
    references: [],
    sources: ['historyBeats'],
  });
}

/** Explain a substrate variable — contributors are the causes. */
export function explainSystemVariable(settlement, variable) {
  if (!settlement || !variable) return null;
  const name = variable.startsWith('var.') ? variable.slice('var.'.length) : variable;
  if (!SYSTEM_VARIABLES.includes(name)) return emptyEnvelope('system_variable', name);

  const v = deriveSystemVariable(name, settlement);
  if (!v) return emptyEnvelope('system_variable', name);

  // Contributors ARE the causes
  const causes = (v.contributors || []).map(c => ({
    source: c.source,
    effect: c.effect,
    reason: c.reason,
    delta: c.delta,
  }));

  // Downstream effects: which subsystems read this variable? We can
  // declare a few canonical reads — the substrate doesn't yet track
  // these explicitly, but documented the inputs each
  // variable consumes.
  const downstreamEffects = [];

  const profile = {
    variable: v.variable,
    score: v.score,
    band: v.band,
  };

  return envelope({
    type: 'system_variable', id: `var.${name}`, label: name.replace(/_/g, ' '),
    causalReason: `${name.replace(/_/g, ' ')} is at ${v.band} (${v.score}/100). ${
      (v.contributors || []).length
        ? `Driven by ${v.contributors.length} contributor(s).`
        : 'No specific contributors identified.'
    }`,
    causes,
    downstreamEffects,
    ifRemoved: { consequences: ['System variables are derived, not removable; they reflect the underlying substrate.'] },
    profile,
    references: (v.contributors || []).map(c => ({ id: c.source, label: c.source, type: 'unknown' })),
    sources: ['causalState'],
  });
}

/**
 * Explain a structured threat. Threats are
 * derived from existing settlement surfaces (config.monsterThreat,
 * defenseProfile.scores, stressors, neighbours, active conditions),
 * so the explainer surfaces the original surface as a cause.
 */
export function explainThreat(settlement, threatId) {
  if (!settlement || !threatId) return null;
  const all = deriveAllThreatProfiles(settlement);
  const threat = all.find(t => t.id === threatId);
  if (!threat) return emptyEnvelope('threat', threatId);

  // Origin surface becomes the primary cause
  /** @type {Array<{source: string, effect: string, reason: string, step?: string, delta?: number}>} */
  const causes = [{
    source: threat.originSurface,
    effect: 'inferred_from',
    reason: `Threat inferred from settlement.${threat.originSurface}.`,
  }];

  // If the threat came from an active condition, cite it
  if (threat.originSurface === 'activeConditions' && threat.raw?.condition?.id) {
    causes.push({
      source: threat.raw.condition.id,
      effect: 'derives_from',
      reason: `Underlying condition: ${threat.raw.condition.label}.`,
    });
  }
  if (threat.originSurface === 'neighbours' && threat.raw?.neighbour?.name) {
    causes.push({
      source: threat.raw.neighbour.name,
      effect: 'originates_from',
      reason: `Hostile relationship with ${threat.raw.neighbour.name}.`,
    });
  }

  // Downstream pressures map to system variables
  /** @type {Array<{target: string, effect: string, reason: string, step?: string}>} */
  const downstreamEffects = (threat.affectedSystems || []).map(sys => ({
    target: sys,
    effect: 'pressures',
    reason: `${threat.label} pressures ${sys}.`,
  }));

  // ifRemoved: lifts the pressure on affected systems + beneficiaries lose their hook
  const ifRemoved = {
    consequences: [
      `${threat.label} lifts; pressure on ${(threat.affectedSystems || []).join(', ')} eases.`,
    ],
  };
  for (const v of threat.victims || []) {
    ifRemoved.consequences.push(`${v} recover from the threat's burden.`);
  }
  if ((threat.beneficiaries || []).length) {
    ifRemoved.consequences.push(`Beneficiaries (${threat.beneficiaries.join(', ')}) lose their leverage.`);
  }

  const profile = {
    type: threat.type,
    severity: threat.severity,
    severityBand: threat.severityBand,
    currentStage: threat.currentStage,
    trajectory: threat.trajectory,
    visibility: threat.visibility,
    vector: threat.vector,
    source: threat.source,
    target: threat.target,
    beneficiaries: threat.beneficiaries || [],
    victims: threat.victims || [],
    affectedSystems: threat.affectedSystems || [],
  };

  const references = (threat.affectedSystems || [])
    .map(s => ({ id: s, label: s, type: 'system_variable' }));

  return envelope({
    type: 'threat', id: threat.id, label: threat.label,
    causalReason: threat.description || `${threat.label} (${threat.currentStage}, ${threat.severityBand}).`,
    causes,
    downstreamEffects,
    ifRemoved,
    profile,
    references,
    sources: ['threatProfile', threat.originSurface],
  });
}

/**
 * Explain a capacity. Supply + demand are the
 * two competing pressures; bands derive from supply/demand ratio.
 */
export function explainCapacity(settlement, capacityRef) {
  if (!settlement || !capacityRef) return null;
  const name = typeof capacityRef === 'string' && capacityRef.startsWith('capacity.')
    ? capacityRef.slice('capacity.'.length)
    : capacityRef;
  if (!CAPACITY_NAMES.includes(name)) return emptyEnvelope('capacity', name);

  const profile = deriveCapacityProfile(name, settlement);
  if (!profile) return emptyEnvelope('capacity', name);

  // Supply contributors AND demand contributors both feed into the
  // "causes" envelope, signed so consumers can render the directional
  // arrow. Supply contributors push the capacity up; demand
  // contributors push it down. We tag each so consumers can render
  // them in separate columns if they want.
  /** @type {Array<{source: string, effect: string, reason: string, step?: string, delta?: number}>} */
  const causes = [];
  for (const c of profile.supplyContributors || []) {
    causes.push({ source: c.source, effect: `supply:${c.effect}`, delta: +c.delta, reason: c.reason });
  }
  for (const c of profile.demandContributors || []) {
    causes.push({ source: c.source, effect: `demand:${c.effect}`, delta: -c.delta, reason: c.reason });
  }

  /** @type {Array<{target: string, effect: string, reason: string, step?: string}>} */
  const downstreamEffects = [];
  // Honest provenance: capacities do NOT feed the substrate.
  // causalState derives its variables from the conserved ledgers
  // directly and never imports capacityModel — capacity and substrate
  // are parallel readers of the same ledgers. Surface the substrate
  // variable that shares this lens's inputs as a SIBLING, so a DM
  // doesn't edit the capacity profile expecting the variable to follow.
  const sibling = (target, label) => downstreamEffects.push({
    target,
    effect: 'sibling_reader',
    reason: `${label} reads the same conserved ledgers as this capacity lens; neither feeds the other.`,
  });
  switch (name) {
    case 'labor':             sibling('labor_capacity', 'Labor capacity'); break;
    case 'healing':           sibling('healing_capacity', 'Healing capacity'); break;
    case 'defense':           sibling('defense_readiness', 'Defense readiness'); break;
    case 'food_production':   sibling('food_security', 'Food security'); break;
    case 'transport':         sibling('trade_connectivity', 'Trade connectivity'); break;
    case 'magical':           sibling('magical_stability', 'Magical stability'); break;
    case 'religious_welfare': sibling('religious_authority', 'Religious authority'); break;
    case 'administrative':    sibling('ruling_authority', 'Ruling authority'); break;
    default:
      // craft has no sibling substrate variable yet
      break;
  }

  const ifRemoved = {
    consequences: [
      `${profile.label} capacity (currently ${profile.band}, supply ${profile.supply} vs demand ${profile.demand}) collapses;`
      + ` sibling system variables keep reading the shared ledgers and do not follow this profile.`,
    ],
  };

  const profileSummary = {
    capacity: profile.capacity,
    supply: profile.supply,
    demand: profile.demand,
    ratio: profile.ratio,
    band: profile.band,
    trajectory: profile.trajectory,
  };

  const references = (downstreamEffects || []).map(e => ({
    id: `var.${e.target}`,
    label: e.target.replace(/_/g, ' '),
    type: 'system_variable',
  }));

  return envelope({
    type: 'capacity', id: `capacity.${name}`, label: profile.label,
    causalReason: `${profile.label} is ${profile.band} (supply ${profile.supply}, demand ${profile.demand}, ratio ${profile.ratio}).`,
    causes,
    downstreamEffects,
    ifRemoved,
    profile: profileSummary,
    references,
    sources: ['capacityModel'],
  });
}

/**
 * Explain a district.
 */
export function explainDistrict(settlement, districtId) {
  if (!settlement || !districtId) return null;
  const all = deriveAllDistricts(settlement);
  const district = all.find(d => d.id === districtId);
  if (!district) return emptyEnvelope('district', districtId);

  /** @type {Array<{source: string, effect: string, reason: string, step?: string, delta?: number}>} */
  const causes = [];
  if (district.dominantFaction) {
    causes.push({
      source: district.dominantFaction.id,
      effect: 'dominates',
      reason: `${district.dominantFaction.name} (${district.dominantFaction.archetype}) dominates this district.`,
    });
  }
  for (const c of district.contributors || []) {
    causes.push({ source: c.source, effect: c.effect, reason: c.reason });
  }

  /** @type {Array<{target: string, effect: string, reason: string, step?: string}>} */
  const downstreamEffects = [];
  for (const inst of district.institutions || []) {
    downstreamEffects.push({ target: inst.id, effect: 'hosts', reason: `Hosts ${inst.label}.` });
  }
  for (const conn of district.connectedDistricts || []) {
    downstreamEffects.push({ target: `district.${snakeCase(conn)}`, effect: 'connects_to', reason: `Connects to ${conn}.` });
  }

  return envelope({
    type: 'district', id: district.id, label: district.name,
    causalReason: `${district.name} is a ${district.category} district — ${district.wealth}, ${district.safety}.`,
    causes,
    downstreamEffects,
    ifRemoved: {
      consequences: [
        `${district.name}'s population disperses to neighboring districts`,
        `${(district.services || []).join(', ') || 'local services'} lose their primary venue`,
      ],
    },
    profile: {
      category: district.category,
      wealth: district.wealth,
      safety: district.safety,
      dominantFaction: district.dominantFaction,
      sensoryIdentity: district.sensoryIdentity,
      currentTension: district.currentTension,
      hook: district.hook,
      services: district.services,
    },
    references: [
      ...(district.institutions || []).map(i => ({ id: i.id, label: i.label, type: 'institution' })),
      ...(district.dominantFaction ? [{ id: district.dominantFaction.id, label: district.dominantFaction.name, type: 'faction' }] : []),
    ],
    sources: ['districtProfile'],
  });
}

// ── Universal dispatcher ─────────────────────────────────────────────────

/**
 * The unified entry point. Accepts either:
 *   explainEntity(settlement, { type, id })
 *   explainEntity(settlement, id)   — type inferred from prefix
 *
 * Returns null for missing settlement; an empty envelope for unknown
 * entity types or missing entities.
 */
export function explainEntity(settlement, ref) {
  if (!settlement || !ref) return null;

  let type = null, id = null;
  if (typeof ref === 'string') {
    id = ref;
    type = inferTypeFromId(id);
  } else if (typeof ref === 'object') {
    id = ref.id;
    type = ref.type || inferTypeFromId(id);
  }

  if (!type) return emptyEnvelope(null, id);

  switch (type) {
    case 'institution':     return explainInstitution(settlement, id);
    case 'faction':         return explainFaction(settlement, id);
    case 'npc':             return explainNpc(settlement, id);
    case 'chain':           return explainSupplyChain(settlement, id);
    case 'hook':            return explainHook(settlement, id);
    case 'condition':       return explainCondition(settlement, id);
    case 'clock':           return explainEscalationClock(settlement, id);
    case 'history_beat':    return explainHistoryBeat(settlement, id);
    case 'system_variable': return explainSystemVariable(settlement, id);
    case 'threat':          return explainThreat(settlement, id);
    case 'capacity':        return explainCapacity(settlement, id);
    case 'district':        return explainDistrict(settlement, id);
    default:                return emptyEnvelope(type, id);
  }
}

// ── Catalog ──────────────────────────────────────────────────────────────

/**
 * Enumerate every explainable entity on a settlement. Returns a flat
 * array of `{ type, id, label }` entries suitable for indexing,
 * navigation menus, or the public compendium's listing pages.
 */
export function entityCatalog(settlement) {
  if (!settlement) return [];
  const out = [];

  // Institutions
  for (const inst of (settlement.institutions || [])) {
    if (!inst) continue;
    const id = inst.id || `institution.${snakeCase(inst.name || '')}`;
    out.push({ type: 'institution', id, label: inst.name || id });
  }

  // Factions
  for (const p of deriveAllFactionProfiles(settlement)) {
    out.push({ type: 'faction', id: p.id, label: p.name });
  }

  // NPCs
  for (const p of deriveAllNpcProfiles(settlement)) {
    out.push({ type: 'npc', id: p.id, label: p.name });
  }

  // Supply chains
  for (const c of deriveAllSupplyChainStates(settlement)) {
    out.push({ type: 'chain', id: c.id, label: c.name });
  }

  // Hooks
  for (const h of deriveAllStructuredHooks(settlement)) {
    out.push({ type: 'hook', id: h.id, label: h.text });
  }

  // Active conditions
  for (const c of deriveAllActiveConditions(settlement)) {
    out.push({ type: 'condition', id: c.id, label: c.label });
  }

  // Escalation clocks
  for (const c of deriveEscalationClocks(settlement)) {
    out.push({ type: 'clock', id: c.id, label: c.label });
  }

  // History beats
  const beats = deriveHistoryBeats(settlement);
  for (const [key, beat] of Object.entries(beats)) {
    if (!beat) continue;
    out.push({ type: 'history_beat', id: `history.${key}`, label: beat.label });
  }

  // System variables
  for (const name of SYSTEM_VARIABLES) {
    out.push({ type: 'system_variable', id: `var.${name}`, label: name.replace(/_/g, ' ') });
  }

  // Threats
  for (const t of deriveAllThreatProfiles(settlement)) {
    out.push({ type: 'threat', id: t.id, label: t.label });
  }

  // Capacities — derived, always 9
  for (const name of CAPACITY_NAMES) {
    out.push({ type: 'capacity', id: `capacity.${name}`, label: name.replace(/_/g, ' ') });
  }

  // Districts
  for (const d of deriveAllDistricts(settlement)) {
    out.push({ type: 'district', id: d.id, label: d.name });
  }

  return out;
}

// ── Trace-driven helpers ─────────────────────────────────────────────────

/**
 * For a given entity id, return everything that referenced or affected
 * it across the trace log. Composes tracesAffecting + tracesCausedBy
 * + tracesFor. Useful for the AI overlay's "what's connected to this?"
 * surface.
 */
export function relatedTraces(settlement, entityId) {
  if (!settlement || !entityId) return { caused: [], affecting: [], targeting: [] };
  return {
    caused:    tracesCausedBy(settlement, entityId),
    affecting: tracesAffecting(settlement, entityId),
    targeting: tracesFor(settlement, entityId),
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────

function snakeCase(s) {
  return String(s).replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase();
}

function nextWorseStatus(status) {
  switch (status) {
    case 'stable':       return 'strained';
    case 'strained':     return 'scarce';
    case 'substituted':  return 'scarce';
    case 'scarce':       return 'blocked';
    case 'blocked':      return 'collapsing';
    case 'captured':     return 'collapsing';
    default:             return 'destabilized';
  }
}
