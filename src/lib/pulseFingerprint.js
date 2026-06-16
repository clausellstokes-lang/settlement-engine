/**
 * pulseFingerprint.js — privacy-safe extraction of WORLD-PULSE mutations.
 *
 * The campaign world-pulse engine (src/domain/worldPulse/) computes an enormous
 * mutation record every tick — per-effect outcomes, roll explanations, corruption
 * and faction-capture events, magnitudes — and persists it to the campaign blob.
 * Almost all of it was thrown away at the analytics boundary (world_pulse_advanced
 * shipped 5 scalars, one of them buggy). This module is the INVERSE of a sanitizer,
 * exactly like structuralFingerprint.js: it COPIES ONLY KNOWN-GOOD signals —
 * enums, ids drawn from fixed catalogs, bands, counts, deltas — so headlines,
 * summaries, reasons, names, and labels cannot enter the output by construction.
 * The guarantee is a TEST (tests/lib/pulseFingerprint.test.js scans output for
 * banned prose/name fixtures), not a convention.
 *
 *   - extractPulseSummary(result)        — enriched world_pulse_advanced props
 *                                          (ESSENTIAL; per-effect-family counts).
 *   - extractPulseEffects(result)        — one redacted row per applied outcome
 *                                          (RESEARCH; the exhaustive mutation ledger).
 *   - extractStressorTransitions(result) — per-type birth/spread/escalate/resolve
 *                                          maps (RESEARCH; activates the dead event).
 *   - extractProposalDecision(p, kind)   — proposal accept/block telemetry.
 *   - extractPartyImpact(action, result) — DM-as-actor signal.
 *   - extractSimulationRules(rules, keys)— the config→pulse join (rule VALUES).
 *
 * NEVER copied: outcome.headline / summary / reasons / metadata; stressor.label;
 * npc/faction/save ids as raw values (only counts / hashes); any name or prose.
 */

import { band5, severityBand } from './structuralFingerprint.js';

/** The single genesis vocabulary used across every mutation plane. */
export const GENESIS = Object.freeze({
  GENERATION: 'generation',
  FORCED_PRE_GEN: 'user_forced_pre_gen',
  FORCED_POST_GEN: 'user_forced_post_gen',
  WORLD_PULSE: 'world_pulse',
  REGIONAL: 'regional_propagation',
  NEIGHBOUR: 'neighbour',
  PARTY: 'party',
  AI: 'ai',
});

const arr = (v) => (Array.isArray(v) ? v : []);
const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : undefined);
/** enum-length guard: catalog ids/enums are short; anything longer is suspect. */
const enumStr = (v) => (typeof v === 'string' && v.length > 0 && v.length <= 48 ? v : undefined);

/** Signed magnitude band for a population delta (or any signed count). */
export function signedBand(delta) {
  const n = Number(delta);
  if (!Number.isFinite(n) || n === 0) return 'none';
  const a = Math.abs(n);
  const mag = a < 25 ? 'tiny' : a < 100 ? 'small' : a < 500 ? 'medium' : a < 2000 ? 'large' : 'huge';
  return (n < 0 ? 'neg_' : 'pos_') + mag;
}

/** Probability (0..1) → band5 over a 0..100 scale. */
const probBand = (p) => (num(p) === undefined ? undefined : band5(Number(p) * 100));

// ── outcome classification (all from fixed catalog enums, never prose) ───────

/** Coarse effect verb from the candidateType catalog id. */
function effectKindOf(candidateType, type) {
  const ct = enumStr(candidateType) || '';
  let m;
  if ((m = ct.match(/^stressor_(birth|spread|escalate|residual|reignite)/))) return m[1];
  if (/^tier_(promotion|demotion)/.test(ct)) return 'tier_change';
  if (/^resource_/.test(ct)) return 'resource_change';
  if (/^population_/.test(ct)) return 'population_change';
  if (/^institution_/.test(ct)) return 'institution_change';
  if (/^faction_/.test(ct)) return 'faction_action';
  if (/^npc_/.test(ct)) return 'npc_action';
  if (/coup/.test(ct)) return 'coup';
  if (/corruption|reform/.test(ct)) return 'corruption';
  return enumStr(type) || 'other';
}

/** Genesis of a single applied outcome. */
function genesisOfOutcome(outcome) {
  if (outcome?.partySourced) return GENESIS.PARTY;
  const ct = enumStr(outcome?.candidateType) || '';
  if (/^stressor_spread_|^stressor_residual|propagat|spread/.test(ct)) return GENESIS.REGIONAL;
  return GENESIS.WORLD_PULSE;
}

/** Pull the stressor TYPE (catalog enum) from an outcome — never its label. */
function stressorTypeOf(outcome) {
  const direct = enumStr(outcome?.stressor?.type);
  if (direct) return direct;
  const m = (enumStr(outcome?.candidateType) || '').match(/^stressor_(?:birth|spread|escalate|residual|reignite)_(.+)$/);
  return m ? enumStr(m[1]) : undefined;
}

/** Summed population delta magnitude (number) from an outcome's populationDeltas. */
function populationDeltaOf(outcome) {
  const pd = outcome?.populationDeltas;
  if (!pd) return undefined;
  if (typeof pd === 'number') return pd;
  if (Array.isArray(pd)) return pd.reduce((s, d) => s + (Number(d?.delta ?? d) || 0), 0);
  if (typeof pd === 'object') return Object.values(pd).reduce((s, d) => s + (Number(d) || 0), 0);
  return undefined;
}

/** tier direction enum from an outcome (promotion|demotion), else undefined. */
function tierDirectionOf(outcome) {
  const ct = enumStr(outcome?.candidateType) || '';
  if (/tier_promotion/.test(ct)) return 'promotion';
  if (/tier_demotion/.test(ct)) return 'demotion';
  const tc = outcome?.tierChange;
  if (tc && enumStr(tc.direction)) return tc.direction;
  return undefined;
}

// ── per-effect ledger (RESEARCH) ─────────────────────────────────────────────
const MAX_EFFECT_ROWS = 60; // bound a pathological constellation; logged if hit

/**
 * One redacted row per applied outcome. settlement_uuid (a random save id, the
 * same key settlement_snapshots already stores) is kept for joinability; all
 * names/prose/headlines are dropped.
 */
export function extractPulseEffects(result, ctx = {}) {
  const applied = arr(result?.autoApplied);
  const tick = num(result?.tick);
  const rows = [];
  for (const o of applied.slice(0, MAX_EFFECT_ROWS)) {
    if (!o || typeof o !== 'object') continue;
    rows.push({
      tick,
      effect_kind: effectKindOf(o.candidateType, o.type),
      subject_kind: enumStr(o.type) || 'other',
      candidate_type: enumStr(o.candidateType),
      rule_family: enumStr(o.ruleFamily),
      stressor_type: stressorTypeOf(o),
      genesis: genesisOfOutcome(o),
      apply_mode: enumStr(o.applyMode) || 'auto',
      was_proposal: o.applyMode === 'proposal',
      severity_band: o.severity != null ? severityBand(o.severity) : undefined,
      probability_band: probBand(o.probability),
      population_delta_band: signedBand(populationDeltaOf(o)),
      tier_direction: tierDirectionOf(o),
      affected_settlement_count: arr(o.stressor?.affectedSettlementIds).length || 1,
      // joinable, non-PII random save id (matches settlement_snapshots.settlement_uuid)
      settlement_uuid: enumStr(o.targetSaveId) || enumStr(ctx.settlementUuid),
    });
  }
  return { rows, truncated: applied.length > MAX_EFFECT_ROWS };
}

// ── enriched world_pulse_advanced summary (ESSENTIAL) ────────────────────────
const EFFECT_FAMILIES = ['stressor', 'condition', 'npc', 'faction', 'relationship', 'population', 'tier', 'resource', 'institution', 'power_transfer', 'narrative'];

export function extractPulseSummary(result, interval) {
  const applied = arr(result?.autoApplied);
  const record = result?.pulseRecord || {};
  const familyCounts = Object.fromEntries(EFFECT_FAMILIES.map(f => [f, 0]));
  let newStressors = 0;
  for (const o of applied) {
    const t = enumStr(o?.type);
    if (t && t in familyCounts) familyCounts[t] += 1;
    if (/^stressor_birth_/.test(enumStr(o?.candidateType) || '')) newStressors += 1;
  }
  return {
    interval: enumStr(result?.interval) || enumStr(interval) || 'one_month',
    tick_after: num(result?.tick) ?? null,
    candidate_count: arr(result?.candidates).length,
    selected_count: arr(result?.selected).length,
    auto_applied_count: applied.length,
    proposal_count: arr(result?.proposals).length,
    effect_family_counts: familyCounts,
    // FIX: the old new_stressor_count read fields stressors never carry and was
    // always 0. Birth outcomes carry candidateType 'stressor_birth_<type>'.
    new_stressor_count: newStressors,
    resolved_stressor_count: arr(result?.resolvedStressors).length,
    graduated_stressor_count: arr(record.graduatedStressors).length,
    corruption_event_count: arr(record.corruptionEvents).length,
    faction_capture_transition_count: arr(record.factionCaptureEvents).length,
    // NPC corruption/succession lifecycle by kind (demoted|ousted|reform…) and
    // faction capture-ladder moves by rung transition — names dropped.
    npc_corruption_by_kind: tallyByType(record.corruptionEvents, e => enumStr(e?.kind)),
    faction_capture_by_transition: tallyByType(
      record.factionCaptureEvents,
      e => (enumStr(e?.from) && enumStr(e?.to)) ? `${e.from}->${e.to}` : undefined,
    ),
    // auto-applied effects vs effects queued for DM permission this pulse.
    // (autoApplied never holds proposal-mode outcomes — the engine siphons those
    // into result.proposals before building autoApplied — so the proposal side
    // MUST come from result.proposals, not a filter over applied.)
    auto_vs_proposal: { auto: applied.length, proposal: arr(result?.proposals).length },
  };
}

// ── per-type stressor transitions (RESEARCH; activates world_stressor_transitions)
function tallyByType(items, typeFn) {
  const out = {};
  for (const it of arr(items)) {
    const t = typeFn(it);
    if (t) out[t] = (out[t] || 0) + 1;
  }
  return out;
}

export function extractStressorTransitions(result) {
  const applied = arr(result?.autoApplied);
  const byVerb = (verb) => applied.filter(o => new RegExp(`^stressor_${verb}_`).test(enumStr(o?.candidateType) || ''));
  // Major births are queued as PROPOSALS (not auto-applied), so the proposal
  // birth count lives in result.proposals, never in autoApplied.
  const proposalBirths = arr(result?.proposals).filter(
    p => /^stressor_birth_/.test(enumStr(p?.outcome?.candidateType ?? p?.candidateType) || ''),
  ).length;
  return {
    tick: num(result?.tick) ?? null,
    interval: enumStr(result?.interval),
    births_by_type: tallyByType(byVerb('birth'), stressorTypeOf),
    spreads_by_type: tallyByType(byVerb('spread'), stressorTypeOf),
    escalations_by_type: tallyByType(byVerb('escalate'), stressorTypeOf),
    resolutions_by_type: tallyByType(result?.resolvedStressors, s => enumStr(s?.type)),
    auto_births: byVerb('birth').length,   // births that auto-applied this pulse
    proposal_births: proposalBirths,       // births queued for DM permission
  };
}

// ── proposal accept/block (the permission decision) ──────────────────────────
/** kind: 'applied' | 'dismissed'. */
export function extractProposalDecision(proposal, kind) {
  const o = proposal?.outcome || {};
  return {
    resolution: kind === 'dismissed' ? 'dismissed' : 'applied',
    proposal_type: enumStr(o.candidateType) || enumStr(o.type) || enumStr(proposal?.type) || 'unknown',
    rule_family: enumStr(o.ruleFamily),
    subject_kind: enumStr(o.type),
    stressor_type: stressorTypeOf(o),
    severity_band: o.severity != null ? severityBand(o.severity) : undefined,
    tier_direction: tierDirectionOf(o),
  };
}

// ── party impact (DM as actor; user_forced_post_gen) ─────────────────────────
export function extractPartyImpact(action, result) {
  const mag = num(action?.magnitude ?? action?.severity ?? action?.intensity);
  return {
    action_kind: enumStr(action?.kind) || 'unknown',
    target_kind: enumStr(action?.targetKind ?? action?.target?.kind ?? action?.subjectKind) || 'unknown',
    magnitude_band: mag === undefined ? undefined : severityBand(mag),
    resulting_outcome_count: arr(result?.autoApplied).length,
  };
}

// ── simulation rules (the config→pulse join: VALUES not just changed keys) ────
const RULE_TOGGLES = [
  'stressorsEnabled', 'emergentEventsEnabled', 'relationshipDynamicsEnabled', 'npcAgencyEnabled',
  'factionCompetitionEnabled', 'populationDynamicsEnabled', 'migrationFlowsEnabled', 'tradeFlowsEnabled',
  'resourceDriftEnabled', 'tierDriftEnabled', 'institutionLifecycleEnabled', 'majorChangesRequireProposal',
];
// The complete set of legal rule keys — changed_keys is filtered to this so a
// stray non-rule string (or smuggled prose) can never pass through, even though
// the real call site only ever supplies Object.keys() of a rules patch.
const RULE_KEYS = new Set([...RULE_TOGGLES, 'propagationMode', 'intensity', 'migrationMode']);

export function extractSimulationRules(rules, changedKeys) {
  const r = rules || {};
  const toggles = {};
  for (const k of RULE_TOGGLES) toggles[k] = r[k] === true;
  return {
    propagation_mode: enumStr(r.propagationMode),
    intensity: enumStr(r.intensity),
    migration_mode: enumStr(r.migrationMode),
    toggles,
    changed_keys: arr(changedKeys).filter(k => RULE_KEYS.has(k)).sort(),
  };
}
