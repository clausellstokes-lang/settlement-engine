import { stablePart } from './worldState.js';

export const NPC_ROLE_ARCHETYPES = Object.freeze({
  ruler: {
    labels: ['ruler', 'lord', 'lady', 'mayor', 'governor', 'reeve', 'chief', 'prince', 'duke', 'baron'],
    influenceBasis: ['legal_authority', 'public_legitimacy', 'tax_revenue'],
    preferredActions: ['suppress', 'reform', 'mobilize', 'bargain'],
  },
  heir: {
    labels: ['heir', 'claimant', 'scion', 'successor'],
    influenceBasis: ['blood_claim', 'elite_support', 'public_legitimacy'],
    preferredActions: ['seek_promotion', 'undermine_rival', 'bargain', 'expose'],
  },
  military: {
    labels: ['captain', 'marshal', 'general', 'guard', 'commander', 'knight', 'sheriff'],
    influenceBasis: ['manpower', 'defense_readiness', 'security'],
    preferredActions: ['mobilize', 'suppress', 'protect', 'sabotage'],
  },
  merchant: {
    labels: ['merchant', 'guild', 'factor', 'trader', 'banker', 'caravan', 'broker'],
    influenceBasis: ['wealth', 'trade_connectivity', 'debt'],
    preferredActions: ['bargain', 'hoard', 'exploit', 'seek_promotion'],
  },
  religious: {
    labels: ['priest', 'cleric', 'bishop', 'abbot', 'oracle', 'cult', 'temple'],
    influenceBasis: ['religious_authority', 'healing_capacity', 'moral_legitimacy'],
    preferredActions: ['protect', 'reform', 'expose', 'suppress'],
  },
  criminal: {
    labels: ['thief', 'gang', 'smuggler', 'crime', 'bandit', 'fence', 'assassin'],
    influenceBasis: ['criminal_opportunity', 'blackmail', 'contraband'],
    preferredActions: ['exploit', 'sabotage', 'defect', 'hoard'],
  },
  arcane: {
    labels: ['mage', 'wizard', 'sage', 'arcanist', 'witch', 'alchemist'],
    influenceBasis: ['arcane_authority', 'knowledge', 'specialist_services'],
    preferredActions: ['reform', 'bargain', 'expose', 'protect'],
  },
  civic: {
    labels: ['judge', 'clerk', 'elder', 'steward', 'council', 'scribe'],
    influenceBasis: ['bureaucracy', 'law_order', 'public_services'],
    preferredActions: ['reform', 'bargain', 'expose', 'protect'],
  },
  healer: {
    labels: ['healer', 'doctor', 'surgeon', 'midwife', 'apothecary'],
    influenceBasis: ['healing_capacity', 'public_trust', 'service_dependency'],
    preferredActions: ['protect', 'reform', 'bargain', 'hoard'],
  },
  labor_resource: {
    labels: ['miner', 'farmer', 'forester', 'labor', 'teamster', 'dock', 'mill'],
    influenceBasis: ['labor_capacity', 'resource_access', 'food_security'],
    preferredActions: ['mobilize', 'bargain', 'defect', 'protect'],
  },
  diplomat_outsider: {
    labels: ['envoy', 'ambassador', 'emissary', 'outsider', 'foreign', 'legate'],
    influenceBasis: ['external_patronage', 'diplomacy', 'trade_route'],
    preferredActions: ['bargain', 'defect', 'expose', 'seek_promotion'],
  },
  dissident: {
    labels: ['rebel', 'agitator', 'dissident', 'reformer', 'radical', 'prophet'],
    influenceBasis: ['public_grievance', 'ideology', 'crowd_support'],
    preferredActions: ['mobilize', 'expose', 'sabotage', 'undermine_rival'],
  },
});

export const NPC_ACTION_FAMILIES = Object.freeze({
  protect: {
    pressureKinds: ['food', 'disease', 'conflict'],
    severityBias: 0.12,
    proposalAt: 0.82,
    patch: { loyalty: 0.03, momentum: 0.08 },
  },
  exploit: {
    pressureKinds: ['trade', 'crime', 'food'],
    severityBias: 0.16,
    proposalAt: 0.7,
    patch: { momentum: 0.1, corruptionHeat: 0.08, loyalty: -0.02 },
  },
  reform: {
    pressureKinds: ['legitimacy', 'disease', 'trade'],
    severityBias: 0.1,
    proposalAt: 0.76,
    patch: { momentum: 0.08, loyalty: 0.02 },
  },
  suppress: {
    pressureKinds: ['legitimacy', 'crime', 'conflict'],
    severityBias: 0.18,
    proposalAt: 0.7,
    patch: { momentum: 0.09, loyalty: -0.03, resentmentGenerated: 0.08 },
  },
  bargain: {
    pressureKinds: ['trade', 'food', 'legitimacy'],
    severityBias: 0.08,
    proposalAt: 0.82,
    patch: { momentum: 0.07, leverage: 0.06 },
  },
  defect: {
    pressureKinds: ['legitimacy', 'conflict'],
    severityBias: 0.2,
    proposalAt: 0.62,
    patch: { momentum: -0.05, loyalty: -0.12 },
  },
  expose: {
    pressureKinds: ['legitimacy', 'crime'],
    severityBias: 0.15,
    proposalAt: 0.68,
    patch: { momentum: 0.08, leverage: 0.04 },
  },
  hoard: {
    pressureKinds: ['food', 'trade'],
    severityBias: 0.14,
    proposalAt: 0.74,
    patch: { momentum: 0.08, corruptionHeat: 0.06 },
  },
  mobilize: {
    pressureKinds: ['conflict', 'legitimacy', 'food'],
    severityBias: 0.16,
    proposalAt: 0.72,
    patch: { momentum: 0.1, loyalty: 0.01 },
  },
  sabotage: {
    pressureKinds: ['crime', 'conflict', 'trade'],
    severityBias: 0.22,
    proposalAt: 0.62,
    patch: { momentum: 0.1, corruptionHeat: 0.1, loyalty: -0.04 },
  },
  seek_promotion: {
    pressureKinds: ['legitimacy', 'trade', 'conflict'],
    severityBias: 0.18,
    proposalAt: 0.62,
    patch: { momentum: 0.12, ambitionHeat: 0.08 },
  },
  undermine_rival: {
    pressureKinds: ['legitimacy', 'crime', 'trade'],
    severityBias: 0.2,
    proposalAt: 0.64,
    patch: { momentum: 0.1, corruptionHeat: 0.08 },
  },
});

const ALIGNMENTS = [
  'lawful_good',
  'neutral_good',
  'lawful_neutral',
  'true_neutral',
  'chaotic_neutral',
  'lawful_evil',
  'neutral_evil',
  'chaotic_evil',
];
const IDEALS = ['order', 'mercy', 'prosperity', 'tradition', 'security', 'freedom', 'knowledge', 'glory', 'faith', 'justice'];
const BONDS = ['family_house', 'faction_patron', 'public_oath', 'old_debt', 'sacred_place', 'merchant_route', 'military_unit', 'forbidden_secret'];
const FLAWS = ['pride', 'greed', 'cowardice', 'vengeance', 'naivete', 'paranoia', 'zealotry', 'indulgence'];
const WEAKNESSES = ['debt', 'blackmail', 'sick_relative', 'old_crime', 'vanity', 'fear_of_exile', 'forbidden_love', 'succession_claim'];
const GOALS = [
  'secure_office',
  'protect_followers',
  'expand_influence',
  'settle_rivalry',
  'restore_order',
  'profit_from_change',
  'control_institution',
  'win_public_legitimacy',
  'bind_external_patron',
  'survive_crisis',
];

function clamp01(value) {
  const n = Number.isFinite(value) ? value : 0;
  return Math.max(0, Math.min(1, n));
}

function npcId(saveId, npc, index) {
  return `${saveId}:${npc?.id || stablePart(npc?.name || npc?.label || `npc_${index}`)}`;
}

function pick(rng, arr) {
  return arr[Math.floor(rng.random() * arr.length)] || arr[0];
}

function notability(npc = {}) {
  if (npc.importance === 'pillar') return 1;
  if (npc.importance === 'key') return 0.82;
  if (npc.importance === 'notable') return 0.62;
  if (npc.notability === 3 || npc.dots === 3) return 0.9;
  if (npc.notability === 2 || npc.dots === 2) return 0.68;
  if (npc.notability === 1 || npc.dots === 1) return 0.48;
  return 0.38;
}

function dotRankFor(npc = {}) {
  const score = notability(npc);
  if (score >= 0.82) return 3;
  if (score >= 0.6) return 2;
  return 1;
}

function inferRoleArchetype(npc = {}) {
  const text = `${npc.name || ''} ${npc.label || ''} ${npc.role || ''} ${npc.title || ''} ${npc.description || ''}`.toLowerCase();
  for (const [role, def] of Object.entries(NPC_ROLE_ARCHETYPES)) {
    if ((def.labels || []).some(label => text.includes(label))) return role;
  }
  return 'civic';
}

function factionIdFor(npc = {}, item, index) {
  const direct = npc.factionId || npc.faction || npc.affiliation || npc.organizationId || npc.organization;
  if (direct) return stablePart(direct);
  const factions = item.settlement?.factions || item.settlement?.powerFactions || item.settlement?.politics?.factions || [];
  const faction = factions[index % Math.max(1, factions.length)];
  return faction ? stablePart(faction.id || faction.name || faction.label) : 'unaffiliated';
}

function pressureScore(pressureIdx, settlementId, kinds = []) {
  return kinds
    .map(kind => pressureIdx.get?.(settlementId, kind)?.score || 0)
    .reduce((max, score) => Math.max(max, score), 0);
}

function roleSeatFor(dotRank) {
  if (dotRank >= 3) return 'leader_champion';
  if (dotRank === 2) return 'lieutenant_operator';
  return 'agent_protege';
}

export function ensureNpcStates(worldState, snapshot, rng) {
  const npcStates = { ...(worldState.npcStates || {}) };
  for (const item of snapshot.settlements) {
    const npcs = item.settlement?.npcs || [];
    npcs.forEach((npc, index) => {
      const id = npcId(item.id, npc, index);
      if (npcStates[id]) return;
      const local = rng.fork(`npc:${id}`);
      const corrupt = local.random() < 0.06;
      const roleArchetype = inferRoleArchetype(npc);
      const roleDef = NPC_ROLE_ARCHETYPES[roleArchetype] || NPC_ROLE_ARCHETYPES.civic;
      const dotRank = dotRankFor(npc);
      npcStates[id] = {
        npcId: id,
        settlementId: item.id,
        name: npc.name || npc.label || `NPC ${index + 1}`,
        roleArchetype,
        factionId: factionIdFor(npc, item, index),
        factionSeat: roleSeatFor(dotRank),
        dotRank,
        influenceBasis: [...roleDef.influenceBasis],
        alignment: corrupt ? `corrupted_${pick(local, ALIGNMENTS)}` : pick(local, ALIGNMENTS),
        ideal: corrupt ? `corrupted_${pick(local, IDEALS)}` : pick(local, IDEALS),
        bond: corrupt && local.random() < 0.45 ? `corrupted_${pick(local, BONDS)}` : pick(local, BONDS),
        flaw: corrupt ? `corrupted_${pick(local, FLAWS)}` : pick(local, FLAWS),
        weakness: corrupt && local.random() < 0.4 ? `corrupted_${pick(local, WEAKNESSES)}` : pick(local, WEAKNESSES),
        shortGoal: pick(local, GOALS),
        longGoal: pick(local, GOALS),
        ambition: Math.min(1, Math.max(0.15, notability(npc) + local.random() * 0.18)),
        loyalty: Math.max(0.1, 0.75 - (corrupt ? 0.25 : 0) - local.random() * 0.25),
        corruptionProfile: corrupt
          ? { corrupted: true, vector: pick(local, ['greed', 'fanaticism', 'fear', 'hunger_for_status', 'forbidden_patron']) }
          : { corrupted: false, vector: null },
        goalProgress: { short: 0, long: 0 },
        rivalryTargets: [],
        momentum: 0,
        leverage: 0,
        corruptionHeat: corrupt ? 0.2 : 0,
        ambitionHeat: 0,
        lastActedTick: null,
        lastAction: null,
        corruption: corrupt,
      };
    });
  }
  return { ...worldState, npcStates };
}

// Per-tick mean-reversion: momentum/heat/leverage decay toward zero on quiet
// ticks so a long campaign doesn't ratchet every NPC to permanent high-heat.
// Corruption heat lingers (corrupt NPCs stay hot) but cools for the rest.
const NPC_RELAX = Object.freeze({ momentum: 0.82, ambitionHeat: 0.85, leverage: 0.9, corruptionHeat: 0.92 });

export function relaxNpcStates(worldState) {
  const npcStates = { ...(worldState.npcStates || {}) };
  for (const [id, s] of Object.entries(npcStates)) {
    npcStates[id] = {
      ...s,
      momentum: clamp01((s.momentum || 0) * NPC_RELAX.momentum),
      ambitionHeat: clamp01((s.ambitionHeat || 0) * NPC_RELAX.ambitionHeat),
      leverage: clamp01((s.leverage || 0) * NPC_RELAX.leverage),
      corruptionHeat: s.corruption ? clamp01(s.corruptionHeat || 0) : clamp01((s.corruptionHeat || 0) * NPC_RELAX.corruptionHeat),
    };
  }
  return { ...worldState, npcStates };
}

function candidateForAction(state, actionFamily, pressure, tick, rivalTarget = null) {
  const action = NPC_ACTION_FAMILIES[actionFamily];
  const severity = clamp01(
    pressure * 0.5
    + state.ambition * 0.24
    + (state.momentum || 0) * 0.12
    + (state.corruption ? 0.08 : 0)
    + action.severityBias,
  );
  const proposal = severity >= action.proposalAt || ['defect', 'sabotage', 'seek_promotion', 'undermine_rival'].includes(actionFamily);
  const nextRank = actionFamily === 'seek_promotion' ? Math.min(3, (state.dotRank || 1) + 1) : state.dotRank;

  return {
    id: `candidate.npc.${stablePart(actionFamily)}.${stablePart(state.npcId)}.${tick}`,
    type: 'npc',
    candidateType: `npc_${actionFamily}`,
    ruleId: `npc_${state.roleArchetype}_${actionFamily}`,
    ruleFamily: 'npc',
    targetSaveId: state.settlementId,
    npcId: state.npcId,
    factionId: state.factionId,
    severity,
    probability: Math.min(0.48, 0.06 + severity * 0.36 + state.ambition * 0.08),
    applyMode: proposal ? 'proposal' : 'auto',
    headline: `${state.name} may ${actionFamily.replace(/_/g, ' ')}`,
    summary: `${state.name}'s ${state.shortGoal.replace(/_/g, ' ')} goal can advance through ${actionFamily.replace(/_/g, ' ')}.`,
    reasons: [
      `${state.roleArchetype.replace(/_/g, ' ')} role favors ${actionFamily.replace(/_/g, ' ')}.`,
      `Pressure gate ${pressure.toFixed(2)}, ambition ${state.ambition.toFixed(2)}.`,
      state.corruption ? `Rare corrupted ${state.ideal.replace(/_/g, ' ')} ideal modifies behavior.` : `Ideal: ${state.ideal.replace(/_/g, ' ')}.`,
    ],
    npcPatch: {
      momentum: clamp01((state.momentum || 0) + (action.patch.momentum || 0)),
      loyalty: clamp01((state.loyalty ?? 0.5) + (action.patch.loyalty || 0)),
      leverage: clamp01((state.leverage || 0) + (action.patch.leverage || 0)),
      corruptionHeat: clamp01((state.corruptionHeat || 0) + (action.patch.corruptionHeat || 0)),
      ambitionHeat: clamp01((state.ambitionHeat || 0) + (action.patch.ambitionHeat || 0)),
      dotRank: nextRank,
      factionSeat: roleSeatFor(nextRank),
      goalProgress: {
        short: clamp01((state.goalProgress?.short || 0) + severity * 0.12),
        long: clamp01((state.goalProgress?.long || 0) + severity * 0.06),
      },
      rivalryTargets: rivalTarget ? [...new Set([...(state.rivalryTargets || []), rivalTarget.npcId])] : state.rivalryTargets || [],
      lastActedTick: tick,
      lastAction: actionFamily,
    },
    proposalPayload: proposal
      ? {
          kind: 'npc_action',
          npcId: state.npcId,
          actionFamily,
          roleArchetype: state.roleArchetype,
          rivalNpcId: rivalTarget?.npcId || null,
          dotRankBefore: state.dotRank,
          dotRankAfter: nextRank,
        }
      : null,
    metadata: {
      roleArchetype: state.roleArchetype,
      actionFamily,
      dotRank: state.dotRank,
      factionSeat: state.factionSeat,
      influenceBasis: state.influenceBasis,
      rivalNpcId: rivalTarget?.npcId || null,
    },
    conflictTags: [
      `npc:${state.npcId}`,
      proposal ? `proposal:npc:${state.settlementId}` : `drift:npc:${state.settlementId}`,
      rivalTarget ? `npc:${rivalTarget.npcId}` : null,
    ].filter(Boolean),
  };
}

function rivalryTargetFor(state, states) {
  const rivals = states
    .filter(other => other.npcId !== state.npcId && other.settlementId === state.settlementId)
    .sort((a, b) => (b.dotRank || 1) - (a.dotRank || 1));
  return rivals.find(other => other.factionId !== state.factionId) || rivals[0] || null;
}

// Goal culmination — a long-burning ambition finally pays off. Fires when an
// NPC's long-goal progress crosses the threshold, somewhat independent of this
// tick's pressure: it turns reactive drift into setup → payoff stories. The
// patch resets goalProgress (so it doesn't re-fire) and advances the NPC's
// rank; the condition shifts the local power balance and propagates regionally.
const GOAL_CULMINATION_THRESHOLD = 0.8;

function npcGoalCulmination(state, tick) {
  const nextRank = Math.min(3, (state.dotRank || 1) + 1);
  const goal = String(state.longGoal || 'expand_influence').replace(/_/g, ' ');
  return {
    id: `candidate.npc.goal_culmination.${stablePart(state.npcId)}.${tick}`,
    type: 'npc',
    candidateType: 'npc_goal_culmination',
    ruleId: `npc_${state.roleArchetype}_goal_culmination`,
    ruleFamily: 'npc',
    targetSaveId: state.settlementId,
    npcId: state.npcId,
    factionId: state.factionId,
    severity: 0.85,
    probability: 0.9,
    applyMode: 'auto',
    headline: `${state.name} achieves a long ambition`,
    summary: `${state.name} has worked toward "${goal}" for a long while — and now seizes it.`,
    reasons: [
      `${state.name}'s long-term goal progress reached its culmination.`,
      `Role: ${state.roleArchetype.replace(/_/g, ' ')}; goal: ${goal}.`,
    ],
    npcPatch: {
      goalProgress: { short: 0, long: 0 },
      dotRank: nextRank,
      factionSeat: roleSeatFor(nextRank),
      momentum: clamp01((state.momentum || 0) + 0.2),
      lastActedTick: tick,
      lastAction: 'goal_culmination',
    },
    condition: {
      archetype: 'faction_challenge',
      label: `${state.name}'s ascendance`,
      description: `${state.name} has consolidated power, shifting the local balance.`,
      severity: 0.55,
      status: 'stable',
      triggeredAt: { tick, sourceEventType: 'WORLD_PULSE_GOAL_CULMINATION', sourceEventTargetId: state.npcId },
      affectedSystems: ['public_legitimacy', 'faction_power', 'social_trust'],
      causes: [{ source: state.npcId, effect: 'goal_culmination', reason: 'A long ambition reached fruition.' }],
    },
    metadata: { roleArchetype: state.roleArchetype, longGoal: state.longGoal, dotRankBefore: state.dotRank, dotRankAfter: nextRank },
    conflictTags: [`npc:${state.npcId}`, `settlement:${state.settlementId}:goal_culmination`],
  };
}

export function evaluateNpcRules(snapshot, pressureIdx, options = {}) {
  const tick = options.tick ?? snapshot.worldState.tick + 1;
  const states = Object.values(snapshot.worldState.npcStates || {});
  const out = [];

  for (const state of states) {
    // A long ambition that has built up finally pays off — independent of this
    // tick's pressure.
    if ((state.goalProgress?.long || 0) >= GOAL_CULMINATION_THRESHOLD) {
      out.push(npcGoalCulmination(state, tick));
      continue;
    }
    const cooldown = state.lastActedTick != null && tick - state.lastActedTick < 2;
    if (cooldown) continue;

    const roleDef = NPC_ROLE_ARCHETYPES[state.roleArchetype] || NPC_ROLE_ARCHETYPES.civic;
    const actionScores = roleDef.preferredActions.map((actionFamily) => {
      const action = NPC_ACTION_FAMILIES[actionFamily];
      const pressure = pressureScore(pressureIdx, state.settlementId, action.pressureKinds);
      const ambitionBoost = actionFamily === 'seek_promotion' ? state.ambition * 0.16 + (state.ambitionHeat || 0) * 0.2 : 0;
      const corruptionBoost = state.corruption && ['exploit', 'sabotage', 'hoard', 'undermine_rival'].includes(actionFamily) ? 0.12 : 0;
      return { actionFamily, pressure: clamp01(pressure + ambitionBoost + corruptionBoost) };
    });

    const best = actionScores.sort((a, b) => b.pressure - a.pressure)[0];
    const minimum = state.dotRank >= 3 ? 0.34 : 0.42;
    if (!best || best.pressure < minimum || state.ambition < 0.42) continue;

    const rivalTarget = ['seek_promotion', 'undermine_rival', 'sabotage', 'expose'].includes(best.actionFamily)
      ? rivalryTargetFor(state, states)
      : null;
    out.push(candidateForAction(state, best.actionFamily, best.pressure, tick, rivalTarget));
  }

  return out;
}

export function deriveNpcCandidates(snapshot, pressureIdx, options = {}) {
  return evaluateNpcRules(snapshot, pressureIdx, options);
}

export function applyNpcPatch(worldState, outcome) {
  if (!outcome?.npcId) return worldState;
  const npcStates = { ...(worldState.npcStates || {}) };
  const current = npcStates[outcome.npcId] || {};
  npcStates[outcome.npcId] = {
    ...current,
    ...(outcome.npcPatch || {}),
    goalProgress: {
      ...(current.goalProgress || {}),
      ...(outcome.npcPatch?.goalProgress || {}),
    },
    rivalryTargets: outcome.npcPatch?.rivalryTargets || current.rivalryTargets || [],
  };
  return { ...worldState, npcStates };
}
