import { withActiveCondition } from '../activeConditions.js';
import {
  advanceRegionalImpacts,
  appendWizardNewsEntries,
  deriveWizardNewsEntriesFromGraphChange,
  ensureRegionalGraph,
  ensureWizardNewsFeed,
  legacyRegionalConditionId,
  propagateRegionalEvent,
  setRegionalImpactStatus,
  stablePart,
  syncRelationshipChannelBundle,
} from '../region/index.js';
import { storageCapacityMonths } from './foodStockpile.js';
import { applyRelationshipPatch, relationshipKeyFromEdge, relationshipRoles } from './relationshipEvolution.js';
import { refreshRelationshipMemory } from './relationshipMemory.js';
import { resolveRelationshipHierarchy } from './relationshipHierarchy.js';
import { applyNpcPatch, npcId } from './npcAgency.js';
import { windDownSponsoredStressors } from './stressorDynamics.js';
import { npcCorruptibleFlaw, corruptionVectorForFlaw } from '../corruption.js';
import { applyFactionPatch } from './factionCompetition.js';
import { proposalIdFor, updateProposalStatus, upsertProposal } from './worldState.js';
import { applyPopulationOutcomeToSettlement } from './populationDynamics.js';
import { applyResourceOutcomeToSettlement, applyTierOutcomeToSettlement } from './tierResourceDynamics.js';
import { applyInstitutionLifecycleOutcome } from './institutionLifecycle.js';
import { normalizeSimulationRules, propagationDepthForRules } from './simulationRules.js';
import { resolveProposalToOutcome } from './decisionTier.js';
import { wallClockNow } from '../clock.js';
import { transferRulingPower } from '../rulingPower.js';
import { rolesForCanonicalEdge } from '../relationships/canonicalRelationship.js';
import { deepClone } from '../clone.js';

function clone(/** @type {any} */ value) {
  return value == null ? value : deepClone(value);
}

function clamp01(/** @type {any} */ value) {
  const n = Number.isFinite(value) ? value : 0;
  return Math.max(0, Math.min(1, n));
}

// ── Feed curation ────────────────────────────────────────────────────────────
// The feed is what the DM reads and what the paid chronicle grounds on; the
// outcome LEDGER is the autoApplied return (→ pulseHistory.selectedOutcomes
// upstream). Curation below shapes only the FEED — the ledger keeps everything.

// Facts, not hypotheticals: candidate headlines hedge ('X may grow') because
// the candidate hasn't happened yet. Once an outcome APPLIES, its entry must
// state what happened. Generators may hand an explicit outcome.appliedHeadline;
// otherwise the KNOWN hedge patterns below are de-hedged conservatively.
// Unknown phrasings pass through untouched — better an honest hedge than an
// invented fact. (Known untransformed stragglers, left as-is on purpose: a
// whole CLASS comes from factionCompetition's generic headline builder
// — `${name} may ${candidateType.replace(/^faction_/,'')...}` — which yields
// 'X may exhaustion', 'X may rival power contest', 'X may government
// challenge', and whatever future faction_* candidateTypes are added; they
// are already ungrammatical at the source and keep their candidate phrasing.)
/** @type {Array<[RegExp, string]>} */
const APPLIED_HEADLINE_REWRITES = [
  // population / tier / resource / institution drift
  [/\bmay grow\b/, 'grows'],
  [/\bmay fall\b/, 'falls'],
  [/\bmay rise\b/, 'rises'],
  // Resource subjects are routinely plural ('grain fields', 'salt flats'),
  // so the replacements must be number-invariant: no 'is'/'recovers'.
  [/\bmay recover\b/, 'recovering'],
  [/\bmay be depleted\b/, 'depleted'],
  [/\bmay raise a\b/, 'raises a'],
  [/\bmay close its doors\b/, 'closes its doors'],
  // pressure conditions / stressors / relationships
  [/\bmay take hold\b/, 'takes hold'],
  [/\bmay emerge\b/, 'emerges'],
  [/\bmay intensify\b/, 'intensifies'],
  [/\bmay spread\b/, 'spreads'],
  // 'may become X' / 'relationship may shift': relationshipEvolution's
  // candidateBase builds these for every relationship candidate, including
  // auto-applied drift — live patterns, not leftovers.
  [/\bmay become\b/, 'becomes'],
  [/\bmay shift\b/, 'shifts'],
  // NPC action families (npcAgency.js NPC_ACTION_FAMILIES, exhaustively)
  [/\bmay protect\b/, 'protects'],
  [/\bmay exploit\b/, 'exploits'],
  [/\bmay reform\b/, 'reforms'],
  [/\bmay suppress\b/, 'suppresses'],
  [/\bmay bargain\b/, 'bargains'],
  [/\bmay defect\b/, 'defects'],
  [/\bmay expose\b/, 'exposes'],
  [/\bmay hoard\b/, 'hoards'],
  [/\bmay mobilize\b/, 'mobilizes'],
  [/\bmay sabotage\b/, 'sabotages'],
  [/\bmay seek promotion\b/, 'seeks promotion'],
  // Matches both the bare "may undermine rival" and the named "may undermine <Name>"
  // (#6 names the subject), so either way it reads past-tense once applied.
  [/\bmay undermine\b/, 'undermines'],
];

function appliedHeadlineFor(/** @type {any} */ outcome) {
  if (outcome.appliedHeadline) return outcome.appliedHeadline;
  const headline = outcome.headline || '';
  for (const [pattern, replacement] of APPLIED_HEADLINE_REWRITES) {
    if (pattern.test(headline)) return headline.replace(pattern, replacement);
  }
  return headline;
}

function newsEntryForOutcome(/** @type {any} */ outcome, /** @type {any} */ tick, status = 'applied') {
  const scope = (outcome.affectedSettlementIds || []).length >= 3 ? 'realm' : outcome.relationshipKey ? 'regional' : 'settlement';
  let major = outcome.applyMode === 'proposal' || outcome.severity >= 0.72 || (outcome.affectedSettlementIds || []).length >= 3;
  // Significance honesty: NPC micro-posturing (npc_* candidateTypes at
  // settlement scope, below the severity bar) never exceeds 'notable' — a
  // courtier's manoeuvre is not 'major' just because it routes as a proposal.
  // Capture/tier/power transitions are not npc_* and keep their 'major'.
  if (major && scope === 'settlement'
      && String(outcome.candidateType || '').startsWith('npc_')
      && clamp01(outcome.severity) < 0.72) {
    major = false;
  }
  return {
    id: `wizard_news.${tick}.world_pulse.${status}.${outcome.id}`,
    tick,
    scope,
    significance: major ? 'major' : 'notable',
    score: Math.round(clamp01(outcome.severity) * 80) + (major ? 18 : 0),
    headline: (status === 'proposal' ? outcome.headline : appliedHeadlineFor(outcome)) || 'World pulse update',
    summary: outcome.summary || '',
    kind: status === 'proposal' ? 'queued' : 'applied',
    impactKind: outcome.candidateType || outcome.type,
    channelType: null,
    severity: outcome.severity,
    settlementIds: outcome.affectedSettlementIds || [outcome.targetSaveId].filter(Boolean),
    impactIds: [],
    channelIds: [],
    sourceEventId: outcome.id,
    tags: ['world_pulse', outcome.type, outcome.candidateType, status].filter(Boolean),
    reasons: outcome.reasons || [],
  };
}

// Metronome suppression: a drift-only outcome re-telling the SAME story for
// the same (settlement, candidateType) with materially identical reasons
// within the cooldown does not re-emit a feed entry — the probe measured
// 8-13 entries/tick dominated by NPC posturing and a population_growth
// metronome, flushing major arcs out of the 240-cap feed. Cooldown reuses the
// realm-arc idiom: tick-based, because the feed is newest-first (a tail slice
// would inspect the OLDEST entries once the feed exceeds the window).
const DRIFT_REEMIT_COOLDOWN_TICKS = 6;

// State CHANGES always emit. Any discrete transition marker — stressor
// birth/escalation/resolution, tier/power/resource/institution change,
// condition onset, relationship shift, proposal routing, multi-settlement
// migration (propagation) — exempts the outcome from suppression. Drift-only
// is what remains: pure npc/faction posturing patches and single-settlement
// population drift.
function isDriftOnlyOutcome(/** @type {any} */ outcome) {
  // Party-sourced outcomes are deliberate DM action, never drift: every
  // outcome partyImpact.js builds is stamped partySourced, and a repeated
  // bolster/undermine/empower is the table acting twice — both must land in
  // the feed, or the world changes silently under the DM's own hands.
  if (outcome.partySourced) return false;
  if (outcome.tierChange || outcome.powerTransfer || outcome.resourcePatch
      || outcome.institutionPatch || outcome.condition || outcome.stressor
      || outcome.relationshipKey || outcome.relationshipPatch
      || outcome.proposalPayload) {
    return false;
  }
  return (outcome.populationDeltas || []).length <= 1;
}

function curationReasonsKey(/** @type {any} */ reasons) {
  return JSON.stringify([...new Set((reasons || []).filter(Boolean).map(String))]);
}

function curationSettlementsKey(/** @type {any} */ settlementIds) {
  return JSON.stringify([...new Set((settlementIds || []).map(String))].sort());
}

function isMetronomeRepeat(/** @type {any} */ entry, /** @type {any} */ priorEntries, /** @type {any} */ tick) {
  const idsKey = curationSettlementsKey(entry.settlementIds);
  const reasonsKey = curationReasonsKey(entry.reasons);
  // The headline is part of the repeat key: without it the suppression is
  // actor-blind — 'Priest Bram protects' was swallowed as a repeat of
  // 'Reeve Alda protects' (same impactKind/settlement, and families like
  // faction_exhaustion carry a constant reasons string). Different actors
  // always differ in the headline; the population/resource/faction-SELF
  // metronomes keep constant headlines, so intended suppression survives.
  return priorEntries.some((/** @type {any} */ prior) =>
    prior.kind === 'applied'
    && tick - (prior.tick ?? -Infinity) < DRIFT_REEMIT_COOLDOWN_TICKS
    && prior.impactKind === entry.impactKind
    && prior.headline === entry.headline
    && curationSettlementsKey(prior.settlementIds) === idsKey
    && curationReasonsKey(prior.reasons) === reasonsKey);
}

function affectedSaveIdsForOutcome(/** @type {any} */ outcome) {
  const ids = new Set();
  for (const delta of outcome.populationDeltas || []) {
    if (delta?.saveId) ids.add(String(delta.saveId));
  }
  for (const delta of outcome.foodStockpileDeltas || []) {
    if (delta?.saveId) ids.add(String(delta.saveId));
  }
  if (outcome.targetSaveId && (outcome.condition || outcome.tierChange || outcome.resourcePatch || outcome.institutionPatch || outcome.powerTransfer || outcome.deityReembed)) {
    ids.add(String(outcome.targetSaveId));
  }
  return [...ids];
}

// Occupation-parity multipliers — mirror the GENERATOR's `occupied`-stress
// transform (powerGenerator.js ~1223): the conqueror disarms the locals so a
// PULSE-conquered town looks like a GENERATION-occupied one, not a town that
// merely swapped a flag. A local military/guard faction is gutted (×0.3 — the
// "disarm"); the deposed governing seat is humbled (×0.6) + marked 'occupied';
// every other local civic faction is suppressed (×0.82). Idempotent by the
// 'occupied'/'disarmed' modifier guard so a re-fired conquest never re-cuts.
const OCCUPATION_DISARM = 0.3;
const OCCUPATION_GOVERNING_CUT = 0.6;
const OCCUPATION_CIVIC_CUT = 0.82;

/** @param {import('../settlement.schema.js').SimFaction} f */
const factionNameOf = (f) => String(f?.faction || f?.name || '').trim();
/** @param {import('../settlement.schema.js').SimFaction} f */
const isMilitaryFaction = (f) => {
  const cat = String(f?.category || f?.archetype || '').toLowerCase();
  const nm = factionNameOf(f).toLowerCase();
  return cat === 'military' || /\b(milit|guard|garrison|warrior|legion|soldier)\b/.test(nm);
};

/**
 * Reproduce generation-time occupation RICHNESS on a faction roster that has just
 * been conquered via the pulse: disarm the local military, humble the deposed seat,
 * suppress the civic factions, then seed the foreign occupation authority that
 * transferRulingPower crowns (it only promotes an EXISTING faction). A no-op if the
 * named power already exists (idempotent re-fire) or there is no powerStructure.
 * Used ONLY on cause:'conquest', so every pre-existing (coup) transfer is untouched.
 */
function installOccupationAuthority(/** @type {any} */ settlement, /** @type {any} */ powerName) {
  const name = String(powerName || '').trim();
  if (!name) return settlement;
  const ps = settlement?.powerStructure;
  if (!ps) return settlement;
  const factions = Array.isArray(ps.factions) ? ps.factions : [];
  const exists = factions.some((/** @type {any} */ f) => factionNameOf(f).toLowerCase() === name.toLowerCase());
  if (exists) return settlement;
  // Disarm/suppress the locals first (idempotent: a faction already carrying the
  // 'occupied'/'disarmed' modifier is left alone, so a re-fired conquest is a no-op).
  const round = (/** @type {number} */ v) => Math.max(0, Math.round(v));
  const num = (/** @type {any} */ v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
  const disarmedFactions = factions.map((/** @type {any} */ f) => {
    const mods = Array.isArray(f?.modifiers) ? f.modifiers : [];
    if (mods.includes('occupied') || mods.includes('disarmed')) return f;
    if (f?.isGoverning) {
      return { ...f, power: round(num(f.power) * OCCUPATION_GOVERNING_CUT), modifiers: [...mods, 'occupied'] };
    }
    if (isMilitaryFaction(f)) {
      return { ...f, power: round(num(f.power) * OCCUPATION_DISARM), modifiers: [...mods, 'disarmed'] };
    }
    return { ...f, power: round(num(f.power) * OCCUPATION_CIVIC_CUT), modifiers: [...mods, 'occupied'] };
  });
  const occupier = {
    faction: name,
    name,
    category: 'military',
    power: 90,
    isGoverning: false,
    desc: 'A foreign occupation authority installed by conquest.',
    modifiers: ['occupier'],
  };
  return {
    ...settlement,
    powerStructure: { ...ps, factions: [...disarmedFactions, occupier] },
  };
}

// Conserved granary transfer (war sack food seizure). `foodStockpileDeltas` carries a
// per-settlement storageMonths change (target loses, victor gains) the same way
// populationDeltas carries a per-settlement population change, so it applies through the
// standard per-outcome pass and is atomic with the conquest's defer/dismiss. Clamped to
// [0, granary capacity]; a settlement with no food ledger is a safe no-op.
function applyFoodStockpileOutcomeToSettlement(/** @type {any} */ settlement, /** @type {any} */ outcome, /** @type {any} */ saveId) {
  const fs = settlement?.economicState?.foodSecurity;
  if (!fs || !Number.isFinite(Number(fs.storageMonths))) return settlement;
  const deltaMonths = (outcome.foodStockpileDeltas || [])
    .filter((/** @type {any} */ d) => String(d?.saveId) === String(saveId))
    .reduce((/** @type {number} */ sum, /** @type {any} */ d) => sum + (Number(d?.deltaMonths) || 0), 0);
  if (!deltaMonths) return settlement;
  const cap = storageCapacityMonths(settlement);
  const nextMonths = Math.round(Math.max(0, Math.min(cap, Number(fs.storageMonths) + deltaMonths)) * 10) / 10;
  if (nextMonths === Number(fs.storageMonths)) return settlement;
  return {
    ...settlement,
    economicState: {
      ...settlement.economicState,
      foodSecurity: { ...fs, storageMonths: nextMonths },
    },
  };
}

function applyOutcomeToSettlement(/** @type {any} */ settlement, /** @type {any} */ outcome, /** @type {any} */ saveId) {
  if (!settlement || !outcome) return settlement;
  let next = settlement;
  if (outcome.populationDeltas?.length) {
    next = applyPopulationOutcomeToSettlement(next, outcome, saveId);
  }
  if (outcome.foodStockpileDeltas?.length) {
    next = applyFoodStockpileOutcomeToSettlement(next, outcome, saveId);
  }
  if (outcome.tierChange && String(outcome.targetSaveId) === String(saveId)) {
    next = applyTierOutcomeToSettlement(next, outcome);
  }
  if (outcome.resourcePatch && String(outcome.targetSaveId) === String(saveId)) {
    next = applyResourceOutcomeToSettlement(next, outcome);
  }
  if (outcome.institutionPatch && String(outcome.targetSaveId) === String(saveId)) {
    next = applyInstitutionLifecycleOutcome(next, outcome);
  }
  // A coup verdict (or any future power_transfer outcome) reshapes the
  // governing seat through the same domain path the CHANGE_RULING_POWER
  // canon event uses. A transfer that no longer applies (the named faction
  // is gone, or already governs) safely no-ops; the condition below still
  // records the turmoil.
  if (outcome.powerTransfer && String(outcome.targetSaveId) === String(saveId)) {
    // A CONQUEST (the war layer) installs a foreign occupation authority —
    // a power that does NOT exist among the target's own factions. transferRulingPower
    // can only promote an EXISTING faction, so seed the occupation authority as a
    // new non-governing power first; the transfer then crowns it. Gated on
    // cause === 'conquest' so every pre-existing (coup) transfer is byte-identical.
    if (outcome.powerTransfer.cause === 'conquest') {
      next = installOccupationAuthority(next, outcome.powerTransfer.toPowerName);
      // Occupation parity: a GENERATION-occupied town carries the
      // vassal_extraction condition (conditionPromotion maps the 'occupied' stress
      // into it), so a PULSE-conquered town must too — that condition is what the
      // substrate (deriveCausalState), the pressure model, AND population flight all
      // read as "occupation." Stamp it alongside the conquest's war_pressure so the
      // two faces of an occupation (military strain + economic extraction) both land.
      // Idempotent by id (withActiveCondition replaces same-id), so a re-fired
      // conquest never double-stamps. Conquest-only ⇒ a coup is byte-identical.
      next = withActiveCondition(next, {
        archetype: 'vassal_extraction',
        severity: clamp01(0.55 + (outcome.severity || 0) * 0.15),
        triggeredAt: {
          tick: outcome.powerTransfer.tick ?? null,
          sourceEventType: 'WAR_LAYER_CONQUEST',
          sourceEventTargetId: String(saveId),
        },
        causes: [{
          source: outcome.powerTransfer.toPowerName,
          effect: 'occupation_extraction',
          reason: `${outcome.powerTransfer.toPowerName} extracts wealth, troops, and authority from the conquered settlement.`,
        }],
      });
    }
    const result = transferRulingPower(next, outcome.powerTransfer.toPowerName, {
      cause: outcome.powerTransfer.cause || 'coup',
      tick: outcome.powerTransfer.tick ?? null,
      losers: outcome.powerTransfer.losers || [],
    });
    if (!result.error) next = result.settlement;
  }
  // A religious conversion RE-EMBEDS the winning neighbour's EXISTING deity
  // snapshot onto the convert's config.primaryDeitySnapshot so the
  // conversion STICKS (the pulse/derivers read only the snapshot, never the
  // store/customContent). We re-pick the exact snapshot fields (never spread the
  // raw record) — the SAME field set SET_PRIMARY_DEITY embeds — so a re-embed is
  // structurally identical to an assign and carries no wall-clock stamp.
  if (outcome.deityReembed?.snapshot && String(outcome.targetSaveId) === String(saveId)) {
    next = reEmbedPrimaryDeity(next, outcome.deityReembed.snapshot);
  }
  if (outcome.condition && String(outcome.targetSaveId) === String(saveId)) {
    next = withActiveCondition(next, outcome.condition);
  }
  return next;
}

/**
 * Re-embed a deity snapshot onto a settlement's config (the conversion commit).
 * Re-picks the exact embed field set (mirrors mutate.setPrimaryDeity) so a
 * conversion is structurally identical to a DM assign — never leaking a foreign
 * field or wall-clock stamp into the embedded record.
 */
function reEmbedPrimaryDeity(/** @type {any} */ settlement, /** @type {any} */ snapshot) {
  if (!settlement || !snapshot) return settlement;
  const config = { ...(settlement.config || {}) };
  const ref = snapshot._deityRef || config.primaryDeityRef || `converted:${stablePart(snapshot.name || 'deity')}`;
  config.primaryDeityRef = ref;
  config.primaryDeitySnapshot = Object.freeze({
    _deityRef: ref,
    name: String(snapshot.name || ''),
    alignmentAxis: snapshot.alignmentAxis || 'neutral',
    temperamentAxis: snapshot.temperamentAxis || 'neutral',
    rankAxis: snapshot.rankAxis || 'minor',
    ...(snapshot.domain ? { domain: String(snapshot.domain) } : {}),
  });
  return { ...settlement, config };
}

/**
 * The stressor upsert merge. Birth time is sacred (FIRST createdAt wins). For the
 * legacy single-write path (a fresh birth, or an escalation/spread re-upsert of a
 * PRE-TICK record), this is byte-identical to the prior behavior: take the
 * incoming stressor wholesale, preserve createdAt, stamp updatedAt.
 *
 * The COMMUTATIVE branch fires when the prior record was minted THIS SAME tick
 * (prior.createdAt === now) OR the caller flags `forceCommutative` — i.e. two
 * outcomes collided on the same stressor id within one apply pass. That covers
 * Feature D's same-tick multi-seat religious conversions seeding one fresh
 * `religious_conversion_fracture` record (createdAt === now), AND — via the
 * caller's this-pass write tracking — multiple spread/escalate outcomes of a
 * PRE-TICK record colliding in one tick: without forceCommutative the second
 * write would clobber the first as order-dependent last-write-wins,
 * silently dropping spread targets and reverting escalate↔spread effects. The
 * merge is a FIELD-MERGE that cannot depend on apply order: UNION of
 * affectedSettlementIds, MAX of severity, MAX of per-settlement
 * severityBySettlement, MAX peakSeverity. So reversing the outcome order yields a
 * byte-identical record.
 */
function mergeStressorUpsert(/** @type {any} */ prior, /** @type {any} */ incoming, /** @type {any} */ now, /** @type {boolean} */ forceCommutative = false, /** @type {number} */ tick = NaN) {
  // Wind-down ceiling: a war stressor that wound down THIS tick (its sponsoring
  // hostility ended) must not be re-raised by a same-tick escalate/spread of the
  // same record —
  // that would defeat the wind-down's purpose of letting the next aging tick end
  // the war. When the prior carries a this-tick windDown stamp, the wound-down
  // severity is a hard ceiling for the merged result.
  const windDownCeiling = prior?.originContext?.windDown?.tick === tick
    ? clamp01(prior.severity ?? 0)
    : null;
  const capSeverity = (/** @type {number} */ s) => (windDownCeiling == null ? s : Math.min(s, windDownCeiling));
  const base = { ...incoming, createdAt: prior?.createdAt || now, updatedAt: now };
  // The commutative path fires for a SAME-TICK collision (prior born this tick)
  // or when the caller has already written this id earlier in the same pass.
  if (!prior || (prior.createdAt !== now && !forceCommutative)) {
    if (windDownCeiling == null) return base;
    // A this-tick wind-down: cap severity AND preserve the prior's windDown
    // stamp (the incoming escalate/spread snapshot carries no originContext, so
    // a wholesale take would erase the wind-down record the aging tick relies on).
    return {
      ...base,
      severity: capSeverity(clamp01(incoming.severity ?? 0)),
      originContext: prior.originContext ?? base.originContext,
    };
  }
  const affected = [...new Set([
    ...(prior.affectedSettlementIds || []),
    ...(incoming.affectedSettlementIds || []),
  ].map(String))].sort();
  // Codepoint-sort the severityBySettlement keys so the merged object is
  // order-INDEPENDENT under JSON.stringify (object key order is otherwise
  // insertion-dependent and would make the merge non-commutative byte-wise).
  /** @type {Record<string, any>} */
  const mergedSev = {};
  for (const [id, sev] of Object.entries(prior.severityBySettlement || {})) mergedSev[id] = sev;
  for (const [id, sev] of Object.entries(incoming.severityBySettlement || {})) {
    mergedSev[id] = Math.max(mergedSev[id] ?? 0, sev);
  }
  /** @type {Record<string, any>} */
  const severityBySettlement = {};
  for (const id of Object.keys(mergedSev).sort()) severityBySettlement[id] = mergedSev[id];
  const severity = capSeverity(Math.max(prior.severity ?? 0, incoming.severity ?? 0));
  return {
    ...base,
    severity,
    peakSeverity: Math.max(prior.peakSeverity ?? 0, incoming.peakSeverity ?? 0, severity),
    affectedSettlementIds: affected,
    severityBySettlement,
    // Preserve the prior's windDown stamp when capping (incoming carries none).
    // Only on the wind-down path so the existing same-tick commutative merge
    // stays byte-identical.
    ...(windDownCeiling == null ? {} : { originContext: prior.originContext ?? base.originContext }),
  };
}

function settlementChanged(/** @type {any} */ beforeSettlement, /** @type {any} */ afterSettlement) {
  if (beforeSettlement === afterSettlement) return false;
  try {
    return JSON.stringify(beforeSettlement) !== JSON.stringify(afterSettlement);
  } catch {
    return true;
  }
}

function saveLike(/** @type {any} */ entry, /** @type {any} */ settlement) {
  return {
    id: String(entry.saveId),
    name: entry.save?.name || settlement?.name || String(entry.saveId),
    settlement,
  };
}

function applyRelationshipLabelToGraph(/** @type {any} */ graph, /** @type {any} */ outcome, /** @type {any} */ now) {
  if (outcome.proposalPayload?.kind !== 'relationship_label_change') return graph;
  const { relationshipKey, toType } = outcome.proposalPayload;
  return {
    ...graph,
    edges: (graph.edges || []).map((/** @type {any} */ edge) => {
      if (relationshipKeyFromEdge(edge) !== relationshipKey) return edge;
      return {
        ...edge,
        relationshipType: toType,
        type: edge.type === edge.relationshipType || !edge.type ? toType : edge.type,
        updatedAt: now,
      };
    }),
  };
}

function relationshipEdgeForOutcome(/** @type {any} */ graph, /** @type {any} */ outcome) {
  const key = outcome.proposalPayload?.relationshipKey || outcome.relationshipKey;
  if (!key) return null;
  return (graph.edges || []).find((/** @type {any} */ edge) => relationshipKeyFromEdge(edge) === key) || null;
}

/**
 * relationshipChannelBundle and the neighbourNetwork writeback both read raw
 * edge orientation ('edge.from is the patron/overlord'), but a pulse-driven
 * subjugation may have crowned the authored 'to' side via the seniority stamps
 * on relationship state. When relationshipRoles reports the senior side at 'to',
 * hand consumers a transient role-oriented copy of the edge — from/to (and the
 * directional aliases) swapped, stored edge id kept — so channels and dossiers
 * assert the real hierarchy. Symmetric labels and unstamped (DM-authored)
 * hierarchy edges resolve as not-reversed and pass through untouched.
 *
 * Every alias pair is oriented from the SINGLE canonical senior/junior
 * (relationshipRoles already derives these from the from/to pair), never by
 * swapping each pair against its own raw values. An edge with a partial alias
 * set (e.g. from/to plus a lone `source`) would otherwise come out
 * inconsistently oriented — asserting the wrong hierarchy direction downstream.
 */
function roleOrientedEdge(/** @type {any} */ edge, /** @type {any} */ relState) {
  if (!edge) return edge;
  const { seniorId, juniorId, reversed } = relationshipRoles(edge, relState);
  if (!reversed) return edge;
  const oriented = { ...edge };
  // Only rewrite alias slots the edge actually carries; the senior id goes in
  // each pair's senior slot and the junior id in its junior slot, so all
  // populated aliases agree on the same orientation.
  for (const [senior, junior] of [['from', 'to'], ['source', 'target'], ['a', 'b'], ['settlementAId', 'settlementBId']]) {
    if (edge[senior] === undefined && edge[junior] === undefined) continue;
    if (edge[senior] !== undefined) oriented[senior] = seniorId;
    if (edge[junior] !== undefined) oriented[junior] = juniorId;
  }
  return oriented;
}

/**
 * A pulse relationship label outcome is canonical relationship state
 * (DM-approved, or auto per the campaign's rules) — write it through to BOTH
 * settlements' neighbourNetwork links so the dossier, threat profile, PDF,
 * and AI grounding stop asserting the label the pulse already changed.
 * Conditions-over-mutation does not apply: the label IS the relationship
 * state, not a derived effect. Both ends must be saved settlements in this
 * pulse; a pair with an un-saved end leaves neighbourNetwork untouched (we
 * cannot reconcile the reciprocal link of a settlement we are not carrying).
 */
function writeRelationshipLabelToNeighbourNetworks(/** @type {any} */ { settlementUpdates, edge, toType, tick }) {
  if (!edge?.from || !edge?.to || !toType) return;
  const fromId = String(edge.from);
  const toId = String(edge.to);
  const fromEntry = settlementUpdates.get(fromId);
  const toEntry = settlementUpdates.get(toId);
  if (!fromEntry?.settlement || !toEntry?.settlement) return;
  const labelled = { ...edge, relationshipType: toType };
  const ends = [
    { selfId: fromId, otherId: toId, otherEntry: toEntry },
    { selfId: toId, otherId: fromId, otherEntry: fromEntry },
  ];
  for (const { selfId, otherId, otherEntry } of ends) {
    const entry = settlementUpdates.get(selfId);
    const network = Array.isArray(entry.settlement?.neighbourNetwork) ? entry.settlement.neighbourNetwork : [];
    if (!network.length) continue;
    const otherName = otherEntry.save?.name || otherEntry.settlement?.name || null;
    const role = rolesForCanonicalEdge(labelled, selfId).sourceRole;
    let touched = false;
    const next = network.map((/** @type {any} */ link) => {
      const matches = String(link?.id || '') === otherId
        || String(link?.targetId || '') === otherId
        || String(link?.settlementId || '') === otherId
        || (otherName != null && (String(link?.neighbourName || '') === String(otherName) || String(link?.name || '') === String(otherName)));
      if (!matches) return link;
      const unchanged = link.relationshipType === toType
        && String(link.relationshipFrom || '') === fromId
        && String(link.relationshipTo || '') === toId
        && link.localRelationshipRole === role
        && link.displayRelationshipType === role;
      if (unchanged) return link; // identity no-op
      touched = true;
      return {
        ...link,
        relationshipType: toType,
        relationshipFrom: fromId,
        relationshipTo: toId,
        localRelationshipRole: role,
        displayRelationshipType: role,
        // Provenance: the dossier shows WHO last asserted this label.
        updatedByPulse: Number.isFinite(tick) ? tick : null,
      };
    });
    if (touched) {
      settlementUpdates.set(selfId, { ...entry, settlement: { ...entry.settlement, neighbourNetwork: next } });
    }
  }
}

/**
 * Every third-party edge the vassalage hierarchy cascade flips emits Wizard
 * News — the realignment is major campaign politics, not a
 * silent field rewrite. One entry per flipped edge, naming both settlements
 * and the flip.
 */
function cascadeNewsEntry(/** @type {any} */ { cascade, edge, nameFor, outcome, tick }) {
  const edgeKey = cascade.edgeKey || cascade.relationshipKey;
  const fromName = nameFor(edge?.from);
  const toName = nameFor(edge?.to);
  const fromLabel = String(cascade.fromType || 'linked').replace(/_/g, ' ');
  const toLabel = String(cascade.toType || 'linked').replace(/_/g, ' ');
  const hostile = cascade.toType === 'hostile';
  return {
    id: `wizard_news.${tick}.hierarchy_cascade.${edgeKey}`,
    tick,
    scope: 'regional',
    significance: hostile ? 'major' : 'notable',
    score: hostile ? 72 : 56,
    headline: `${fromName} and ${toName}: ${fromLabel} becomes ${toLabel}`,
    summary: cascade.reason || 'The new vassalage realigns the relationship.',
    kind: 'applied',
    impactKind: 'hierarchy_cascade',
    channelType: null,
    severity: hostile ? 0.74 : 0.58,
    settlementIds: [edge?.from, edge?.to].filter(Boolean).map(String),
    impactIds: [],
    channelIds: [],
    sourceEventId: outcome.id,
    tags: ['world_pulse', 'relationship', 'hierarchy_cascade'],
    reasons: [cascade.reason].filter(Boolean),
  };
}

const IMPORTANCE_RANK = Object.freeze({ pillar: 3, key: 2, notable: 1 });

/**
 * A betrayal stressor's birth seeds the traitor its variant implies — ONE
 * corrupted NPC, dependent on already-existing factors: there must be an
 * NPC with a corruptible flaw to turn (no flaw, no traitor). Unlike the
 * organic corruption loop this does NOT require a criminal institution —
 * the patron is the foreign sponsor (or the conspiracy itself), recorded on
 * corruptTies.foreignPatron. Deterministic pick: most notable eligible NPC,
 * name as tiebreak. Covert by design: no news entry — the DM finds the
 * corrupt flag in the dossier, the table finds it the hard way.
 */
function seedBetrayalTraitor(/** @type {any} */ { state, settlementUpdates, saveId, originContext }) {
  const sid = String(saveId || '');
  const entry = settlementUpdates.get(sid);
  const npcs = entry?.settlement?.npcs;
  if (!Array.isArray(npcs) || !npcs.length) return state;
  const eligible = npcs
    .map((npc, index) => ({ npc, index, flaw: npcCorruptibleFlaw(npc) }))
    .filter(c => c.flaw && c.npc.corrupt !== true && !c.npc.ousted);
  if (!eligible.length) return state;
  // Codepoint tiebreak, NOT localeCompare: this sort decides WHICH NPC turns
  // traitor, and default-locale collation can reorder accented names across
  // machines, breaking replay determinism.
  eligible.sort((a, b) => {
    const rank = ((/** @type {any} */ (IMPORTANCE_RANK))[b.npc.importance] || 0) - ((/** @type {any} */ (IMPORTANCE_RANK))[a.npc.importance] || 0);
    if (rank) return rank;
    const an = String(a.npc.name || '');
    const bn = String(b.npc.name || '');
    return an < bn ? -1 : an > bn ? 1 : 0;
  });
  const chosen = eligible[0];
  const foreign = ['foreign_sponsored', 'abandoned_agent'].includes(originContext.variant);
  const vector = foreign ? 'forbidden_patron' : corruptionVectorForFlaw(chosen.flaw);
  const corruptTies = {
    criminalInstitution: null,
    thievesGuild: null,
    foreignPatron: originContext.sponsorSettlementId || originContext.formerSponsorSettlementId || null,
    conspiracy: originContext.variant,
  };
  const nextNpcs = npcs.map((npc, index) => (index === chosen.index
    ? { ...npc, corrupt: true, corruptionVector: vector, corruptTies }
    : npc));
  settlementUpdates.set(sid, { ...entry, settlement: { ...entry.settlement, npcs: nextNpcs } });
  // Mirror into npcStates immediately so the same-tick world view agrees
  // (ensureNpcStates treats the settlement boolean as authoritative anyway).
  const id = npcId(sid, chosen.npc, chosen.index);
  const st = state.npcStates?.[id];
  if (!st) return state;
  return {
    ...state,
    npcStates: {
      ...state.npcStates,
      [id]: {
        ...st,
        corruption: true,
        corruptionProfile: { corrupted: true, vector },
        corruptionHeat: Math.max(st.corruptionHeat || 0, 0.3),
      },
    },
  };
}

/**
 * @param {Object} [args]
 * @param {any} [args.snapshot]
 * @param {any} [args.worldState]
 * @param {any} [args.regionalGraph]
 * @param {any} [args.wizardNews]
 * @param {Map<string, any>} [args.settlementMap]
 * @param {any[]} [args.outcomes]
 * @param {number} [args.tick]
 * @param {string} [args.now]
 * @param {boolean} [args.advanceNewsTick]
 * @param {boolean} [args.advanceRegionalImpacts]
 * @param {any} [args.simulationRules]
 */
export function applyWorldPulseOutcomes({
  snapshot,
  worldState,
  regionalGraph,
  wizardNews,
  settlementMap,
  outcomes = [],
  tick,
  now,
  advanceNewsTick = true,
  advanceRegionalImpacts: shouldAdvanceRegionalImpacts = true,
  simulationRules = null,
} = {}) {
  let graph = ensureRegionalGraph(regionalGraph || snapshot.regionalGraph, { now });
  let state = worldState;
  const rules = normalizeSimulationRules(simulationRules || worldState?.simulationRules || snapshot?.worldState?.simulationRules);
  const propagationDepth = propagationDepthForRules(rules);
  // worldState.tick is the authoritative clock: SYNC currentTick to it (not
  // +1) so a manual impact-advance press cannot permanently skew which tick
  // this pulse's entries (all stamped with `tick`) group and ground under.
  let feed = ensureWizardNewsFeed(wizardNews || snapshot.campaign?.wizardNews, { now });
  if (advanceNewsTick) {
    feed = {
      ...feed,
      currentTick: Number.isFinite(tick) ? Math.max(0, Math.floor(/** @type {number} */ (tick))) : feed.currentTick + 1,
    };
  }
  const settlementUpdates = new Map(settlementMap ? [...settlementMap.entries()] : []);
  const autoApplied = [];
  const proposals = [];
  const newsEntries = [];
  // Stressor ids already written by an EARLIER outcome in this same apply
  // pass. A second outcome touching the same id (escalate after spread,
  // multi-target spread of one record) must field-MERGE with the first write,
  // not clobber it — otherwise spread targets vanish and escalate/spread revert
  // each other order-dependently. The merge is commutative, so the persisted
  // record reflects every reported event regardless of iteration order.
  const stressorWrittenThisPass = new Set();

  // Time advances BEFORE this tick's propagation queues: the previous pulse's
  // delayed impacts mature now, while impacts the loop below queues stay
  // un-aged until the NEXT pulse — delayTicks:1 means "next tick", never
  // "later this same tick" (the party/proposal paths already pass
  // advanceRegionalImpacts:false for the same reason).
  if (shouldAdvanceRegionalImpacts && propagationDepth > 0) {
    const beforeRegionalAdvance = graph;
    graph = advanceRegionalImpacts(graph, 1, { currentTick: tick, now });
    newsEntries.push(...deriveWizardNewsEntriesFromGraphChange(beforeRegionalAdvance, graph, { tick, createdAt: now }));
  }

  for (const outcome of outcomes) {
    if (outcome.applyMode === 'proposal') {
      const proposal = {
        id: proposalIdFor(outcome, tick),
        status: 'pending',
        createdAt: now,
        updatedAt: now,
        tick,
        outcome: clone(outcome),
        headline: outcome.headline,
        summary: outcome.summary,
        severity: outcome.severity,
        reasons: outcome.reasons || [],
      };
      state = upsertProposal(state, proposal);
      proposals.push(proposal);
      newsEntries.push(newsEntryForOutcome(outcome, tick, 'proposal'));
      continue;
    }

    for (const saveId of affectedSaveIdsForOutcome(outcome)) {
      const entry = settlementUpdates.get(String(saveId));
      if (!entry) continue;
      const beforeSettlement = entry.settlement;
      const afterSettlement = applyOutcomeToSettlement(beforeSettlement, outcome, saveId);
      if (!settlementChanged(beforeSettlement, afterSettlement)) continue;
      settlementUpdates.set(String(saveId), { ...entry, settlement: afterSettlement });
      if (propagationDepth > 0) {
        const beforeGraph = graph;
        const propagation = propagateRegionalEvent({
          graph,
          beforeSettlement: saveLike(entry, beforeSettlement),
          afterSettlement: saveLike(entry, afterSettlement),
          event: {
            id: outcome.id,
            type: 'WORLD_PULSE',
            targetId: saveId,
            payload: {
              severity: outcome.severity,
              candidateType: outcome.candidateType,
              outcomeType: outcome.type,
            },
          },
          activeSettlementId: outcome.targetSaveId || saveId,
          visibleSettlementIds: snapshot.settlements.map((/** @type {any} */ item) => item.id),
          maxDepth: propagationDepth,
          now,
        });
        graph = propagation.graph;
        newsEntries.push(...deriveWizardNewsEntriesFromGraphChange(beforeGraph, graph, { tick, createdAt: now }));
      }
    }

    if (outcome.relationshipKey && outcome.relationshipPatch) {
      // Capture the pre-change label: the wind-down handshake below needs to
      // know the edge WAS hostile before this outcome rewrote it.
      const beforeEdge = relationshipEdgeForOutcome(graph, outcome);
      const beforeType = beforeEdge ? String(beforeEdge.relationshipType || beforeEdge.type || '') : null;
      state = applyRelationshipPatch(state, outcome, now);
      graph = applyRelationshipLabelToGraph(graph, outcome, now);
      if (outcome.proposalPayload?.kind === 'relationship_label_change') {
        const edge = relationshipEdgeForOutcome(graph, outcome);
        if (edge) {
          // Both consumers below treat edge.from as the senior side — resolve
          // the JUST-PATCHED state's seniority stamps first.
          const orientedEdge = roleOrientedEdge(edge, state.relationshipStates?.[outcome.relationshipKey]);
          graph = syncRelationshipChannelBundle(graph, orientedEdge, outcome.proposalPayload.toType, {
            now,
            status: 'confirmed',
            outcomeId: outcome.id,
            relationshipKey: outcome.proposalPayload.relationshipKey,
            reason: outcome.proposalPayload.reason,
          });
          writeRelationshipLabelToNeighbourNetworks({
            settlementUpdates,
            edge: orientedEdge,
            toType: outcome.proposalPayload.toType,
            tick,
          });
          if (outcome.proposalPayload.toType === 'vassal') {
            const hierarchy = resolveRelationshipHierarchy({
              worldState: state,
              regionalGraph: graph,
              vassalEdge: edge,
              now,
              tick,
            });
            state = hierarchy.worldState;
            graph = hierarchy.regionalGraph;
            for (const change of hierarchy.changes) {
              const orientedChangeEdge = roleOrientedEdge(change.edge, state.relationshipStates?.[change.relationshipKey]);
              graph = syncRelationshipChannelBundle(graph, orientedChangeEdge, change.toType, {
                now,
                status: 'confirmed',
                outcomeId: outcome.id,
                relationshipKey: change.relationshipKey,
                reason: change.reason,
              });
              writeRelationshipLabelToNeighbourNetworks({
                settlementUpdates,
                edge: orientedChangeEdge,
                toType: change.toType,
                tick,
              });
            }
            // Every flipped third-party edge emits Wizard News (one entry per
            // cascade change, naming both settlements + the flip).
            const settlementNameById = new Map((snapshot.settlements || [])
              .map((/** @type {any} */ item) => [String(item.id), item.name || item.settlement?.name || String(item.id)]));
            const nameFor = (/** @type {any} */ id) => settlementNameById.get(String(id)) || String(id ?? 'unknown');
            // The cascadeChanges shape and the legacy hierarchy.changes shape
            // share fromType/toType/reason but key the edge differently — the
            // union defeats the checker, so normalize through `any` here.
            const cascades = /** @type {any[]} */ (
              Array.isArray(hierarchy.cascadeChanges) && hierarchy.cascadeChanges.length
                ? hierarchy.cascadeChanges
                : hierarchy.changes
            );
            for (const cascade of cascades) {
              const edgeKey = cascade.edgeKey || cascade.relationshipKey;
              const cascadeEdge = cascade.edge
                || (graph.edges || []).find(item => relationshipKeyFromEdge(item) === edgeKey)
                || null;
              newsEntries.push(cascadeNewsEntry({ cascade, edge: cascadeEdge, nameFor, outcome, tick }));
            }
          }
        }
        // Wars end when the WAR ends: a hostile edge de-escalating winds down
        // the siege/wartime/betrayal stressors that hostility sponsored,
        // instead of leaving them to bleed out at 0.02/tick while the former
        // belligerents trade politely.
        if (beforeType === 'hostile' && outcome.proposalPayload.toType !== 'hostile') {
          const wind = windDownSponsoredStressors(state, beforeEdge || edge, {
            tick,
            now,
            toType: outcome.proposalPayload.toType,
          });
          state = wind.worldState;
          for (const stressor of wind.woundDown) {
            newsEntries.push({
              id: `wizard_news.${tick}.wind_down.${stressor.id}`,
              tick,
              scope: 'regional',
              significance: 'notable',
              score: 52,
              headline: `${stressor.label} winds down`,
              summary: 'The hostility that drove it has ended; the pressure is collapsing.',
              kind: 'applied',
              impactKind: 'stressor_wind_down',
              channelType: null,
              severity: stressor.severity,
              settlementIds: stressor.affectedSettlementIds || [],
              impactIds: [],
              channelIds: [],
              sourceEventId: outcome.id,
              tags: ['world_pulse', 'stressor', 'wind_down'],
              reasons: ['The sponsoring relationship de-escalated.'],
            });
          }
        }
      }
    }
    if (outcome.type === 'npc') state = applyNpcPatch(state, outcome);
    if (outcome.type === 'faction') state = applyFactionPatch(state, outcome);
    if (outcome.type === 'stressor' && outcome.stressor) {
      const byId = new Map((state.stressors || []).map((/** @type {any} */ stressor) => [stressor.id, stressor]));
      // Birth time is sacred: escalation/spread re-upserts the same record,
      // so the FIRST createdAt wins (the crisis was born once) while
      // updatedAt moves with every touch.
      const prior = byId.get(outcome.stressor.id);
      // Force the commutative field-merge when an earlier outcome in THIS pass
      // already wrote this id: a pre-tick record's createdAt !== now, so without
      // this flag the second collision would last-write-win, dropping the first
      // write's spread targets / reverting its severity.
      const merged = mergeStressorUpsert(prior, outcome.stressor, now, stressorWrittenThisPass.has(outcome.stressor.id), tick);
      stressorWrittenThisPass.add(outcome.stressor.id);
      byId.set(outcome.stressor.id, merged);
      state = { ...state, stressors: [...byId.values()] };
      // A betrayal's birth seeds the traitor its variant implies (one corrupt
      // NPC, gated on an existing corruptible flaw — no flaw, no traitor).
      if (outcome.stressor.type === 'betrayal'
          && String(outcome.candidateType || '').startsWith('stressor_birth')
          && outcome.stressor.originContext) {
        state = seedBetrayalTraitor({
          state,
          settlementUpdates,
          saveId: outcome.targetSaveId,
          originContext: outcome.stressor.originContext,
        });
      }
    }
    autoApplied.push(outcome);
    // FEED curation only: autoApplied above (and pulseHistory.selectedOutcomes
    // built from the selected set upstream) records every outcome regardless.
    const appliedEntry = newsEntryForOutcome(outcome, tick, 'applied');
    if (!isDriftOnlyOutcome(outcome)
        || !isMetronomeRepeat(appliedEntry, [...feed.entries, ...newsEntries], tick)) {
      newsEntries.push(appliedEntry);
    }
  }

  // Ghost applied impacts: a materialized regional condition expires locally
  // (time progression drops it), but the impact row stayed 'applied' forever —
  // map markers, inbox Resolve buttons, and the feed kept asserting pressure
  // that no longer exists. Now that this tick's settlement updates are final,
  // an 'applied' impact whose TARGET is in this pulse and whose condition is
  // gone flips to 'resolved' (the derivation below emits the resolved entry,
  // so the DM reads the pressure easing instead of resolving a ghost).
  // Targets absent from this pulse's saves are left alone — absence from the
  // pulse is not evidence of expiry. Pulse-only: party/proposal injections
  // pass advanceRegionalImpacts:false and never reconcile.
  if (shouldAdvanceRegionalImpacts) {
    const beforeReconcile = graph;
    for (const impact of beforeReconcile.queuedImpacts) {
      if (impact.status !== 'applied') continue;
      const entry = settlementUpdates.get(String(impact.targetSettlementId));
      if (!entry?.settlement) continue;
      const conditionId = impact.conditionId || legacyRegionalConditionId(impact);
      const conditions = Array.isArray(entry.settlement.activeConditions) ? entry.settlement.activeConditions : [];
      if (conditions.some((/** @type {any} */ condition) => condition?.id === conditionId)) continue;
      // `now` threads through to updatedAt too, not just resolvedAt — replay
      // stamps no wall-clock time anywhere on the reconciled row.
      graph = setRegionalImpactStatus(graph, impact.id, 'resolved', { resolvedAt: now }, { now });
    }
    if (graph !== beforeReconcile) {
      newsEntries.push(...deriveWizardNewsEntriesFromGraphChange(beforeReconcile, graph, { tick, createdAt: now }));
    }
  }

  feed = appendWizardNewsEntries(feed, newsEntries, { now });
  state = refreshRelationshipMemory(state, graph, snapshot, { currentTick: tick });

  return {
    worldState: state,
    regionalGraph: graph,
    wizardNews: feed,
    settlementUpdates: [...settlementUpdates.values()],
    autoApplied,
    proposals,
    newsEntries,
  };
}

/**
 * @param {Object} [args]
 * @param {any} [args.campaign]
 * @param {any[]} [args.saves]
 * @param {string} [args.proposalId]
 * @param {string} [args.now]
 */
export function applyWorldPulseProposal({ campaign, saves = [], proposalId, now = wallClockNow() } = {}) {
  const proposal = (campaign?.worldState?.proposals || []).find((/** @type {any} */ item) => item.id === proposalId);
  if (!proposal || proposal.status !== 'pending') return null;
  // The deterministic resolver (Stage 2): the stored outcome, applyMode forced to
  // 'auto', no fresh RNG draw. Auto-resolving is byte-identical to this manual
  // Apply path because both route the SAME resolved outcome through
  // applyWorldPulseOutcomes.
  const outcome = resolveProposalToOutcome(proposal.outcome);
  const settlementMap = new Map((saves || []).map(save => [String(save.id || save.settlement?.id), { saveId: String(save.id || save.settlement?.id), save, settlement: save.settlement || save }]));
  const snapshot = {
    campaign,
    regionalGraph: ensureRegionalGraph(campaign?.regionalGraph, { now }),
    settlements: [...settlementMap.values()].map(item => ({ id: item.saveId, settlement: item.settlement, name: item.settlement?.name || item.save?.name || item.saveId })),
  };
  const result = applyWorldPulseOutcomes({
    snapshot,
    // updatedAt threaded explicitly: updateProposalStatus falls back to the
    // wall clock for it, which would break replay-identical worldState.
    worldState: updateProposalStatus(campaign.worldState, proposalId, 'applied', { appliedAt: now, updatedAt: now }),
    regionalGraph: campaign.regionalGraph,
    wizardNews: campaign.wizardNews,
    settlementMap,
    outcomes: [outcome],
    tick: campaign.worldState?.tick || proposal.tick || 0,
    now,
    advanceNewsTick: false,
    advanceRegionalImpacts: false,
    simulationRules: campaign.worldState?.simulationRules,
  });
  result.worldState = updateProposalStatus(result.worldState, proposalId, 'applied', { appliedAt: now, updatedAt: now });
  return result;
}
