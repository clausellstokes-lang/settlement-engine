import { stablePart } from './worldState.js';
import { factionArchetype, FACTION_ARCHETYPES as FA } from '../factionArchetypes.js';

// Canonical archetype → factionCompetition's local vocabulary (the FACTION_POWER_BASES
// keys). Folds the archetypes this layer doesn't model: government/other → civic,
// craft → merchant (economic production), occupation → military (an occupying force).
const CANONICAL_TO_COMPETITION = Object.freeze({
  [FA.GOVERNMENT]: 'civic', [FA.NOBLE]: 'noble', [FA.MILITARY]: 'military',
  [FA.MERCHANT]: 'merchant', [FA.RELIGIOUS]: 'religious', [FA.CRIMINAL]: 'criminal',
  [FA.ARCANE]: 'arcane', [FA.CRAFT]: 'merchant', [FA.LABOR]: 'labor',
  [FA.OUTSIDER]: 'outsider', [FA.OCCUPATION]: 'military', [FA.CIVIC]: 'civic', [FA.OTHER]: 'civic',
});

export const GOVERNMENT_PREFERENCES = Object.freeze([
  'council_rule',
  'merchant_charter',
  'military_order',
  'temple_authority',
  'noble_patronage',
  'communal_assembly',
  'criminal_shadow_rule',
  'arcane_magocracy',
]);

export const FACTION_POWER_BASES = Object.freeze({
  noble: ['legal_authority', 'land_rights', 'elite_patronage'],
  merchant: ['wealth', 'trade_connectivity', 'debt'],
  military: ['manpower', 'defense_readiness', 'security'],
  religious: ['religious_authority', 'healing_capacity', 'moral_legitimacy'],
  criminal: ['criminal_opportunity', 'blackmail', 'contraband'],
  civic: ['bureaucracy', 'public_services', 'law_order'],
  arcane: ['knowledge', 'specialist_services', 'arcane_authority'],
  labor: ['labor_capacity', 'food_security', 'resource_access'],
  outsider: ['external_patronage', 'diplomacy', 'foreign_money'],
});

export const FACTION_RULE_MATRIX = Object.freeze([
  'government_challenge',
  'institution_capture',
  'institution_suppression',
  'service_bolster',
  'law_preference_push',
  'rival_power_contest',
  'faction_exhaustion',
]);

const GOVERNMENT_BY_ARCHETYPE = Object.freeze({
  noble: 'noble_patronage',
  merchant: 'merchant_charter',
  military: 'military_order',
  religious: 'temple_authority',
  criminal: 'criminal_shadow_rule',
  civic: 'council_rule',
  arcane: 'arcane_magocracy',
  labor: 'communal_assembly',
  outsider: 'noble_patronage',
});

const LAW_PREFS_BY_ARCHETYPE = Object.freeze({
  noble: ['inheritance_rights', 'land_tenure', 'deference_laws'],
  merchant: ['contract_priority', 'tariff_control', 'debt_enforcement'],
  military: ['curfew', 'militia_tax', 'border_authority'],
  religious: ['temple_privilege', 'moral_codes', 'tithe_rights'],
  criminal: ['selective_enforcement', 'black_market_tolerance', 'protection_rackets'],
  civic: ['transparent_courts', 'service_standards', 'public_records'],
  arcane: ['licensed_magic', 'research_privilege', 'warding_authority'],
  labor: ['guild_rights', 'grain_price_limits', 'work_contracts'],
  outsider: ['extraterritorial_rights', 'patron_treaties', 'trade_immunity'],
});

function clamp01(value) {
  const n = Number.isFinite(value) ? value : 0;
  return Math.max(0, Math.min(1, n));
}

function pick(rng, arr) {
  return arr[Math.floor(rng.random() * arr.length)] || arr[0];
}

function factionId(saveId, faction, index) {
  const name = faction?.id || faction?.faction || faction?.name || faction?.label || `faction_${index}`;
  return `${saveId}:${stablePart(name)}`;
}

function inferFactionArchetype(faction = {}) {
  // Delegates to the shared canonical detector so world-pulse classifies a faction
  // the same way factionProfile / factionResponses / factionRoles do. (The legacy
  // matcher here ignored faction.category; the canonical detector honors it.)
  return CANONICAL_TO_COMPETITION[factionArchetype(faction)] || 'civic';
}

function factionPower(faction = {}, index = 0) {
  const raw = faction.power ?? faction.influence ?? faction.score ?? faction.weight;
  if (Number.isFinite(raw)) return raw > 1 ? clamp01(raw / 100) : clamp01(raw);
  return Math.max(0.18, 0.72 - index * 0.16);
}

function settlementFactions(item) {
  return item.settlement?.powerStructure?.factions
    || item.settlement?.factions
    || item.settlement?.politics?.factions
    || [];
}

function institutionsFor(item) {
  const fromServices = item.settlement?.services || item.settlement?.institutions || item.settlement?.infrastructure || [];
  return (Array.isArray(fromServices) ? fromServices : [])
    .map((entry, index) => ({
      id: stablePart(entry.id || entry.name || entry.label || `institution_${index}`),
      name: entry.name || entry.label || entry.id || `Institution ${index + 1}`,
    }))
    .slice(0, 12);
}

function topFactionEntries(item) {
  return settlementFactions(item)
    .map((faction, index) => ({
      faction,
      index,
      id: factionId(item.id, faction, index),
      power: factionPower(faction, index),
      archetype: inferFactionArchetype(faction),
    }))
    .sort((a, b) => b.power - a.power)
    .slice(0, 3);
}

export function ensureFactionStates(worldState, snapshot, rng) {
  const factionStates = { ...(worldState.factionStates || {}) };
  for (const item of snapshot.settlements) {
    const entries = settlementFactions(item);
    entries.forEach((faction, index) => {
      const id = factionId(item.id, faction, index);
      if (factionStates[id]) return;
      const local = rng.fork(`faction:${id}`);
      const archetype = inferFactionArchetype(faction);
      const powerBases = FACTION_POWER_BASES[archetype] || FACTION_POWER_BASES.civic;
      const lawPreferences = LAW_PREFS_BY_ARCHETYPE[archetype] || LAW_PREFS_BY_ARCHETYPE.civic;
      factionStates[id] = {
        factionId: id,
        settlementId: item.id,
        name: faction.faction || faction.name || faction.label || `Faction ${index + 1}`,
        archetype,
        governmentPreference: faction.governmentPreference || GOVERNMENT_BY_ARCHETYPE[archetype] || pick(local, GOVERNMENT_PREFERENCES),
        powerBases: [...powerBases],
        controlledInstitutions: [],
        suppressedInstitutions: [],
        lawPreferences: [...lawPreferences],
        internalSeats: {
          leader_champion: null,
          lieutenant_operator: null,
          agent_protege: null,
        },
        rivals: [],
        legitimacyClaim: 0.2 + local.random() * 0.35,
        riskTolerance: 0.22 + local.random() * 0.5,
        momentum: 0,
        exhaustion: 0,
        captureState: faction.captureState || 'none', // the criminalCaptureState ladder rung
        lastActedTick: null,
        recentAction: null,
      };
    });
  }

  // Group faction states by settlement ONCE (insertion order preserved) so the
  // rivals-seeding pass reads each settlement's peers directly instead of
  // rescanning every faction per faction — O(F) rather than O(F^2).
  /** @type {Map<string, any[]>} */
  const factionsBySettlement = new Map();
  for (const state of Object.values(factionStates)) {
    if (!state) continue;
    const sid = String(state.settlementId);
    let list = factionsBySettlement.get(sid);
    if (!list) { list = []; factionsBySettlement.set(sid, list); }
    list.push(state);
  }
  for (const state of Object.values(factionStates)) {
    if (!state || state.rivals?.length) continue;
    state.rivals = (factionsBySettlement.get(String(state.settlementId)) || [])
      .filter((/** @type {any} */ other) => other.factionId !== state.factionId)
      .slice(0, 2)
      .map((/** @type {any} */ other) => other.factionId);
  }

  return { ...worldState, factionStates };
}

// Grace window before a roster-absent faction state is pruned: long enough to
// survive a transient roster hiccup (a save that briefly fails to surface its
// factions), short enough that a coup-renamed ghost doesn't haunt the capture
// rollup and rivals[] lists for a season.
export const FACTION_STATE_PRUNE_GRACE_TICKS = 3;

/**
 * Prune faction states whose faction no longer exists on its settlement's
 * roster (faction ids are name-keyed, so a coup-renamed governing faction
 * leaves a permanent ghost that settlementCaptureState still scans and
 * rivals[] still references). Mirrors the settlementTickStates pruning in
 * advanceCampaignWorld, with two deliberate differences:
 *  • a grace window (missingSinceTick, FACTION_STATE_PRUNE_GRACE_TICKS) so a
 *    transient absence doesn't amnesia faction history;
 *  • a captureState floor — a state above 'none' on a LIVE settlement is an
 *    active capture arc and survives pruning until the arc recedes (a ghost
 *    whose settlement left the campaign gets no floor: a reused save id must
 *    not inherit a dead settlement's arc).
 * Pruned ids are also stripped from surviving rivals[] lists (ensureFactionStates
 * refills an emptied list from the live roster on the next pulse). Identity
 * no-op when nothing changes. Deterministic — derived purely from the snapshot.
 */
export function pruneFactionStates(worldState, snapshot, { tick = 0, graceTicks = FACTION_STATE_PRUNE_GRACE_TICKS } = {}) {
  const states = worldState?.factionStates || {};
  const ids = Object.keys(states);
  if (!ids.length) return worldState;

  const liveFactionIds = new Set();
  const liveSettlementIds = new Set();
  for (const item of snapshot?.settlements || []) {
    liveSettlementIds.add(String(item.id));
    settlementFactions(item).forEach((faction, index) => {
      liveFactionIds.add(factionId(item.id, faction, index));
    });
  }

  let changed = false;
  const prunedIds = new Set();
  const next = {};
  for (const [fid, state] of Object.entries(states)) {
    if (liveFactionIds.has(fid)) {
      // Back on (or still on) the roster: clear any absence stamp.
      if (state.missingSinceTick != null) {
        const { missingSinceTick: _gone, ...rest } = state;
        next[fid] = rest;
        changed = true;
      } else {
        next[fid] = state;
      }
      continue;
    }
    const since = Number.isFinite(state.missingSinceTick) ? state.missingSinceTick : tick;
    if (tick - since >= graceTicks) {
      const settlementLive = liveSettlementIds.has(String(state.settlementId));
      const activeCaptureArc = settlementLive && (state.captureState || 'none') !== 'none';
      if (!activeCaptureArc) {
        prunedIds.add(fid);
        changed = true;
        continue;
      }
    }
    if (state.missingSinceTick === since) {
      next[fid] = state;
    } else {
      next[fid] = { ...state, missingSinceTick: since };
      changed = true;
    }
  }

  if (prunedIds.size) {
    for (const [fid, state] of Object.entries(next)) {
      const rivals = state.rivals || [];
      const kept = rivals.filter(rid => !prunedIds.has(rid));
      if (kept.length !== rivals.length) next[fid] = { ...state, rivals: kept };
    }
  }

  if (!changed) return worldState;
  return { ...worldState, factionStates: next };
}

// Per-tick mean-reversion for faction momentum (exhaustion already self-limits
// upward; this relaxes the build-up of momentum on quiet ticks).
export function relaxFactionStates(worldState) {
  const factionStates = { ...(worldState?.factionStates || {}) };
  for (const [id, s] of Object.entries(factionStates)) {
    factionStates[id] = { ...s, momentum: clamp01((s.momentum || 0) * 0.85) };
  }
  return { ...worldState, factionStates };
}

// Coherence: seat each settlement's NPCs into the faction they belong to, so a
// faction's internalSeats reflect who actually holds its leader / lieutenant /
// agent roles (wired from NPC dotRank + factionSeat). Highest dotRank wins each
// seat. Also records memberNpcIds so faction power can read its roster.
export function seatNpcsIntoFactions(worldState) {
  const npcStates = worldState?.npcStates || {};
  const factionStates = { ...(worldState?.factionStates || {}) };
  // Group NPC states by settlement ONCE (insertion order preserved) so each
  // faction only scans its OWN settlement's NPCs instead of the full roster —
  // O(F + N) rather than O(F·N).
  /** @type {Map<string, any[]>} */
  const npcsBySettlement = new Map();
  for (const npc of Object.values(npcStates)) {
    const sid = String(npc.settlementId);
    let list = npcsBySettlement.get(sid);
    if (!list) { list = []; npcsBySettlement.set(sid, list); }
    list.push(npc);
  }
  for (const [fid, faction] of Object.entries(factionStates)) {
    const factionName = stablePart(faction.name);
    const members = (npcsBySettlement.get(String(faction.settlementId)) || []).filter((/** @type {any} */ npc) =>
      stablePart(npc.factionId) === factionName
        || `${faction.settlementId}:${stablePart(npc.factionId)}` === fid
        || npc.factionId === fid,
    );
    const seats = { leader_champion: null, lieutenant_operator: null, agent_protege: null };
    for (const seat of Object.keys(seats)) {
      const best = members
        .filter(m => m.factionSeat === seat)
        .sort((a, b) => (b.dotRank || 0) - (a.dotRank || 0))[0];
      if (best) seats[seat] = { npcId: best.npcId, name: best.name, dotRank: best.dotRank };
    }
    factionStates[fid] = { ...faction, internalSeats: seats, memberNpcIds: members.map(m => m.npcId) };
  }
  return { ...worldState, factionStates };
}

// Momentum (0..1) → the qualitative band the dossier shows. Bands, not the raw
// scalar: momentum mean-reverts ×0.85 every tick, so projecting the number
// would dirty every settlement on every pulse; the band only moves when the
// faction's posture genuinely changes.
const MOMENTUM_BANDS = Object.freeze([
  { min: 0.55, band: 'surging' },
  { min: 0.3, band: 'mobilized' },
  { min: 0.12, band: 'stirring' },
  { min: -Infinity, band: 'quiet' },
]);

export function factionMomentumBand(momentum) {
  const m = Number.isFinite(momentum) ? momentum : 0;
  return MOMENTUM_BANDS.find(b => m >= b.min).band;
}

function sameStringList(a, b) {
  const left = Array.isArray(a) ? a : [];
  const right = Array.isArray(b) ? b : [];
  return left.length === right.length && left.every((v, i) => String(v) === String(right[i]));
}

/**
 * The dossier stops lying: project each faction's LIVE state
 * (worldState.factionStates) onto the settlement's powerStructure.factions
 * roster, which until now stayed generation-frozen while the pulse moved
 * capture rungs, momentum, rivalries, and institution control around it.
 *
 * Projected per roster entry (minimal additive fields, no reshaping):
 *   • captureState   — the capture rung (ensureFactionStates
 *                      already reads this field back, so the loop closes)
 *   • momentumBand   — qualitative band of live momentum (see above)
 *   • rivals         — live rival faction NAMES (ids resolved via states)
 *   • controlledInstitutions / suppressedInstitutions — institution ids
 *
 * Live faction POWER is deliberately NOT projected: factionStates carry no
 * power scalar — the roster IS the live power source (competition normalizes
 * from it each tick; power transfers and the guild floor already write it).
 *
 * Discipline matches the neighbourNetwork write-back: identity no-op when
 * nothing moved (same settlement reference back), per-entry identity, and an
 * updatedByPulse provenance stamp only on entries that actually changed.
 * Quiet/empty live state is not materialized onto entries that never carried
 * the field — a fresh campaign's first pulse must not dirty every roster
 * with 'none'/'quiet'/[] noise.
 */
export function projectFactionStatesOntoSettlement(settlement, factionStates, settlementId, { tick = 0 } = {}) {
  const factions = settlement?.powerStructure?.factions;
  if (!Array.isArray(factions) || !factions.length) return settlement;
  const states = factionStates || {};
  let touched = false;
  const next = factions.map((faction, index) => {
    const state = states[factionId(settlementId, faction, index)];
    if (!state) return faction;
    const patch = {};

    const captureState = state.captureState || 'none';
    if (faction.captureState != null || captureState !== 'none') {
      if (faction.captureState !== captureState) patch.captureState = captureState;
    }

    const band = factionMomentumBand(state.momentum);
    if (faction.momentumBand != null || band !== 'quiet') {
      if (faction.momentumBand !== band) patch.momentumBand = band;
    }

    const rivals = (state.rivals || []).map(rid => states[rid]?.name).filter(Boolean);
    if (faction.rivals != null || rivals.length) {
      if (!sameStringList(faction.rivals, rivals)) patch.rivals = rivals;
    }

    const controlled = state.controlledInstitutions || [];
    if (faction.controlledInstitutions != null || controlled.length) {
      if (!sameStringList(faction.controlledInstitutions, controlled)) patch.controlledInstitutions = [...controlled];
    }

    const suppressed = state.suppressedInstitutions || [];
    if (faction.suppressedInstitutions != null || suppressed.length) {
      if (!sameStringList(faction.suppressedInstitutions, suppressed)) patch.suppressedInstitutions = [...suppressed];
    }

    if (!Object.keys(patch).length) return faction; // identity no-op
    touched = true;
    return { ...faction, ...patch, updatedByPulse: tick };
  });
  if (!touched) return settlement;
  return {
    ...settlement,
    powerStructure: { ...settlement.powerStructure, factions: next },
  };
}

function pressure(pressureIdx, settlementId, kind) {
  return pressureIdx.get?.(settlementId, kind)?.score || 0;
}

function legitimacyBand(score) {
  if (score >= 0.66) return 'crisis';
  if (score >= 0.44) return 'contested';
  return 'stable';
}

function candidateBase({ item, entry, state, tick, candidateType, ruleId, severity, probability, applyMode, reasons, factionPatch, proposalPayload = null, condition = null, metadata = {}, conflictTags = [] }) {
  return {
    id: `candidate.faction.${stablePart(candidateType)}.${stablePart(state.factionId)}.${tick}`,
    type: 'faction',
    candidateType,
    ruleId,
    ruleFamily: 'faction',
    targetSaveId: item.id,
    factionId: state.factionId,
    severity: clamp01(severity),
    probability: clamp01(probability),
    applyMode,
    headline: `${state.name} may ${candidateType.replace(/^faction_/, '').replace(/_/g, ' ')}`,
    summary: `${state.name} sees an opening to press ${state.governmentPreference.replace(/_/g, ' ')} interests.`,
    reasons,
    factionPatch,
    proposalPayload,
    condition,
    metadata: {
      factionName: state.name,
      archetype: state.archetype,
      governmentPreference: state.governmentPreference,
      power: entry.power,
      ...metadata,
    },
    conflictTags: [`faction:${state.factionId}`, `settlement:${item.id}:faction`, ...conflictTags],
  };
}

function governmentChallenge(item, entry, state, tick, legitimacy, conflict) {
  const band = legitimacyBand(legitimacy);
  if (band === 'stable') return null;
  const severity = clamp01(legitimacy * 0.48 + entry.power * 0.28 + state.riskTolerance * 0.14 + conflict * 0.1);
  if (severity < (band === 'crisis' ? 0.5 : 0.58)) return null;
  return candidateBase({
    item,
    entry,
    state,
    tick,
    candidateType: 'faction_government_challenge',
    ruleId: `faction_${band}_government_challenge`,
    severity,
    probability: (band === 'crisis' ? 0.12 : 0.04) + severity * (band === 'crisis' ? 0.34 : 0.22),
    applyMode: 'proposal',
    reasons: [
      `Government legitimacy is ${band}.`,
      `${state.name} is one of the top three factions and prefers ${state.governmentPreference.replace(/_/g, ' ')}.`,
      'Government changes preserve existing institutions unless a separate institution event changes them.',
    ],
    factionPatch: {
      momentum: clamp01((state.momentum || 0) + severity * 0.18),
      exhaustion: clamp01((state.exhaustion || 0) + severity * 0.08),
      legitimacyClaim: clamp01((state.legitimacyClaim || 0) + severity * 0.12),
      lastActedTick: tick,
      recentAction: 'government_challenge',
    },
    proposalPayload: {
      kind: 'government_change',
      factionId: state.factionId,
      settlementId: item.id,
      governmentPreference: state.governmentPreference,
      legitimacyBand: band,
      preserveInstitutions: true,
    },
    condition: {
      archetype: 'faction_challenge',
      label: 'Faction challenge',
      description: `${state.name} is maneuvering to change local power dynamics.`,
      severity,
      status: severity >= 0.7 ? 'worsening' : 'stable',
      duration: { elapsedTicks: 0, expiresAtTicks: 6 },
      triggeredAt: { tick, sourceEventType: 'WORLD_PULSE_FACTION_CHALLENGE', sourceEventTargetId: state.factionId },
      affectedSystems: ['public_legitimacy', 'faction_power', 'social_trust'],
      causes: [{ source: state.factionId, effect: 'legitimacy_challenge', reason: 'Faction competition intensified under weak legitimacy.' }],
    },
    conflictTags: [`settlement:${item.id}:government_change`],
    metadata: { legitimacyBand: band },
  });
}

function institutionCandidate(item, entry, state, tick, legitimacy, trade, crime) {
  const institutions = institutionsFor(item);
  if (!institutions.length) return null;
  const target = institutions[Math.floor((entry.index + tick) % institutions.length)];
  const pressureScore = Math.max(legitimacy, trade, crime);
  if (pressureScore < 0.38 && state.momentum < 0.2) return null;
  const criminalSuppression = state.archetype === 'criminal' || crime > 0.58;
  const candidateType = criminalSuppression ? 'faction_institution_suppression' : 'faction_institution_capture';
  const severity = clamp01(pressureScore * 0.44 + entry.power * 0.24 + state.momentum * 0.16 + state.riskTolerance * 0.08);
  return candidateBase({
    item,
    entry,
    state,
    tick,
    candidateType,
    ruleId: candidateType,
    severity,
    probability: 0.08 + severity * 0.3,
    applyMode: severity >= 0.68 || criminalSuppression ? 'proposal' : 'auto',
    reasons: [
      `${state.name} can convert pressure into institution ${criminalSuppression ? 'suppression' : 'control'}.`,
      `Target institution: ${target.name}.`,
    ],
    factionPatch: {
      controlledInstitutions: criminalSuppression ? state.controlledInstitutions || [] : [...new Set([...(state.controlledInstitutions || []), target.id])],
      suppressedInstitutions: criminalSuppression ? [...new Set([...(state.suppressedInstitutions || []), target.id])] : state.suppressedInstitutions || [],
      momentum: clamp01((state.momentum || 0) + severity * 0.12),
      exhaustion: clamp01((state.exhaustion || 0) + severity * 0.04),
      lastActedTick: tick,
      recentAction: criminalSuppression ? 'suppress_institution' : 'capture_institution',
    },
    proposalPayload: severity >= 0.68 || criminalSuppression
      ? {
          kind: criminalSuppression ? 'institution_suppression' : 'institution_capture',
          factionId: state.factionId,
          settlementId: item.id,
          institutionId: target.id,
          institutionName: target.name,
        }
      : null,
    metadata: { institutionId: target.id, institutionName: target.name },
    conflictTags: [`settlement:${item.id}:institution:${target.id}`],
  });
}

function serviceOrLawCandidate(item, entry, state, tick, food, disease, trade) {
  const pressureScore = Math.max(food, disease, trade);
  if (pressureScore < 0.32) return null;
  const supportMove = ['religious', 'civic', 'labor', 'merchant'].includes(state.archetype) && state.exhaustion < 0.55;
  const candidateType = supportMove ? 'faction_service_bolster' : 'faction_law_preference_push';
  const severity = clamp01(pressureScore * 0.42 + entry.power * 0.2 + state.legitimacyClaim * 0.12);
  const lawPreference = state.lawPreferences?.[tick % Math.max(1, state.lawPreferences.length)] || 'local_preference';
  return candidateBase({
    item,
    entry,
    state,
    tick,
    candidateType,
    ruleId: candidateType,
    severity,
    probability: 0.1 + severity * 0.28,
    applyMode: severity >= 0.74 ? 'proposal' : 'auto',
    reasons: [
      supportMove
        ? `${state.name} can bolster services to convert crisis response into influence.`
        : `${state.name} can use pressure to push ${lawPreference.replace(/_/g, ' ')}.`,
    ],
    factionPatch: {
      momentum: clamp01((state.momentum || 0) + severity * 0.1),
      legitimacyClaim: clamp01((state.legitimacyClaim || 0) + (supportMove ? severity * 0.08 : severity * 0.03)),
      exhaustion: clamp01((state.exhaustion || 0) + severity * 0.06),
      lastActedTick: tick,
      recentAction: supportMove ? 'service_bolster' : 'law_preference_push',
    },
    proposalPayload: severity >= 0.74
      ? {
          kind: supportMove ? 'service_bolster' : 'law_preference_push',
          factionId: state.factionId,
          settlementId: item.id,
          lawPreference,
        }
      : null,
    metadata: { lawPreference, supportMove },
  });
}

function rivalryOrExhaustionCandidate(item, entry, state, tick, legitimacy, conflict) {
  if ((state.exhaustion || 0) > 0.62) {
    const severity = clamp01(0.28 + state.exhaustion * 0.44);
    return candidateBase({
      item,
      entry,
      state,
      tick,
      candidateType: 'faction_exhaustion',
      ruleId: 'faction_exhaustion',
      severity,
      probability: 0.14 + severity * 0.24,
      applyMode: 'auto',
      reasons: ['Faction campaigning, aid, and crisis response create exhaustion that slows future moves.'],
      factionPatch: {
        momentum: clamp01((state.momentum || 0) - 0.08),
        exhaustion: clamp01((state.exhaustion || 0) - 0.1),
        lastActedTick: tick,
        recentAction: 'recover_from_exhaustion',
      },
      metadata: { exhaustion: state.exhaustion },
    });
  }

  if (legitimacy < 0.36 && conflict < 0.36) return null;
  const rivalId = state.rivals?.[0] || null;
  const severity = clamp01(legitimacy * 0.26 + conflict * 0.26 + entry.power * 0.18 + state.momentum * 0.12);
  if (!rivalId || severity < 0.36) return null;
  return candidateBase({
    item,
    entry,
    state,
    tick,
    candidateType: 'faction_rival_power_contest',
    ruleId: 'faction_rival_power_contest',
    severity,
    probability: 0.08 + severity * 0.3,
    applyMode: severity >= 0.7 ? 'proposal' : 'auto',
    reasons: [`${state.name} can contest a rival faction's influence basis.`],
    factionPatch: {
      momentum: clamp01((state.momentum || 0) + severity * 0.1),
      exhaustion: clamp01((state.exhaustion || 0) + severity * 0.06),
      lastActedTick: tick,
      recentAction: 'rival_power_contest',
    },
    proposalPayload: severity >= 0.7
      ? {
          kind: 'faction_power_shift',
          factionId: state.factionId,
          rivalFactionId: rivalId,
          settlementId: item.id,
          cause: 'rival_power_contest',
        }
      : null,
    metadata: { rivalFactionId: rivalId },
    conflictTags: [`faction:${rivalId}`],
  });
}

export function evaluateFactionRules(snapshot, pressureIdx, options = {}) {
  const tick = options.tick ?? snapshot.worldState.tick + 1;
  const out = [];

  for (const item of snapshot.settlements) {
    const legitimacy = pressure(pressureIdx, item.id, 'legitimacy');
    const conflict = pressure(pressureIdx, item.id, 'conflict');
    const trade = pressure(pressureIdx, item.id, 'trade');
    const crime = pressure(pressureIdx, item.id, 'crime');
    const food = pressure(pressureIdx, item.id, 'food');
    const disease = pressure(pressureIdx, item.id, 'disease');
    const entries = topFactionEntries(item);

    for (const entry of entries) {
      const state = snapshot.worldState.factionStates?.[entry.id];
      if (!state) continue;
      const cooldown = state.lastActedTick != null && tick - state.lastActedTick < 2;
      if (cooldown && (state.exhaustion || 0) < 0.62) continue;
      const candidates = [
        governmentChallenge(item, entry, state, tick, legitimacy, conflict),
        institutionCandidate(item, entry, state, tick, legitimacy, trade, crime),
        serviceOrLawCandidate(item, entry, state, tick, food, disease, trade),
        rivalryOrExhaustionCandidate(item, entry, state, tick, legitimacy, conflict),
      ].filter(Boolean);
      out.push(...candidates);
    }
  }

  return out;
}

export function deriveFactionCandidates(snapshot, pressureIdx, options = {}) {
  return evaluateFactionRules(snapshot, pressureIdx, options);
}

export function applyFactionPatch(worldState, outcome) {
  if (!outcome?.factionId) return worldState;
  const factionStates = { ...(worldState.factionStates || {}) };
  const current = factionStates[outcome.factionId] || {};
  factionStates[outcome.factionId] = {
    ...current,
    ...(outcome.factionPatch || {}),
    controlledInstitutions: outcome.factionPatch?.controlledInstitutions || current.controlledInstitutions || [],
    suppressedInstitutions: outcome.factionPatch?.suppressedInstitutions || current.suppressedInstitutions || [],
  };
  return { ...worldState, factionStates };
}
