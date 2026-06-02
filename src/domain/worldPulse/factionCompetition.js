import { stablePart } from './worldState.js';

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
  const text = `${faction.name || ''} ${faction.faction || ''} ${faction.label || ''} ${faction.type || ''} ${faction.description || ''}`.toLowerCase();
  if (/noble|lord|baron|house|arist/.test(text)) return 'noble';
  if (/merchant|guild|trade|bank|market|caravan/.test(text)) return 'merchant';
  if (/guard|military|militia|soldier|captain|knight|army/.test(text)) return 'military';
  if (/temple|church|faith|priest|cult|holy|shrine/.test(text)) return 'religious';
  if (/crime|thief|smuggl|gang|bandit|syndicate|assassin/.test(text)) return 'criminal';
  if (/mage|arcane|wizard|sage|alchem|college/.test(text)) return 'arcane';
  if (/labor|worker|farmer|miner|dock|mill|teamster/.test(text)) return 'labor';
  if (/foreign|outsider|envoy|embassy|patron/.test(text)) return 'outsider';
  return 'civic';
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
        lastActedTick: null,
        recentAction: null,
      };
    });
  }

  for (const state of Object.values(factionStates)) {
    if (!state || state.rivals?.length) continue;
    state.rivals = Object.values(factionStates)
      .filter(other => other.settlementId === state.settlementId && other.factionId !== state.factionId)
      .slice(0, 2)
      .map(other => other.factionId);
  }

  return { ...worldState, factionStates };
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
  for (const [fid, faction] of Object.entries(factionStates)) {
    const factionName = stablePart(faction.name);
    const members = Object.values(npcStates).filter(npc =>
      String(npc.settlementId) === String(faction.settlementId)
      && (stablePart(npc.factionId) === factionName
        || `${faction.settlementId}:${stablePart(npc.factionId)}` === fid
        || npc.factionId === fid),
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
