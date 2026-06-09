import { stablePart } from './worldState.js';
import {
  readCorruptionClimate, npcCorruptibleFlaw, corruptionVectorForFlaw, spawnCorruptionChance,
  onsetHazard, exposureChance, demoteDotRank, CORRUPTION_TUNING,
} from '../corruption.js';

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

export function npcId(saveId, npc, index) {
  return `${saveId}:${npc?.id || stablePart(npc?.name || npc?.label || `npc_${index}`)}`;
}

/**
 * §corruption Phase 1b-ii — mirror tick-evolved corruption from worldState.npcStates
 * back onto a settlement's NPCs, so the dossier reflects corruption acquired (or
 * shed) during world-pulse ticks — not just at generation. Pure + deterministic
 * (no rng/Date); returns the same settlement reference when nothing changed.
 */
export function mirrorCorruptionOntoSettlement(settlement, npcStates, settlementId) {
  const npcs = settlement?.npcs;
  if (!Array.isArray(npcs) || !npcStates) return settlement;
  let changed = false;
  const nextNpcs = npcs.map((npc, index) => {
    const st = npcStates[npcId(settlementId, npc, index)];
    if (!st) return npc;
    const corrupt = !!st.corruption;
    const vector = st.corruptionProfile?.vector || null;
    const ousted = !!st.ousted;
    if (npc.corrupt === corrupt && npc.corruptionVector === vector && !!npc.ousted === ousted) return npc;
    changed = true;
    return { ...npc, corrupt, corruptionVector: vector, ...(ousted ? { ousted: true } : {}) };
  });
  return changed ? { ...settlement, npcs: nextNpcs } : settlement;
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

function settlementForState(snapshot, state) {
  return (snapshot?.settlements || []).find(item => String(item.id) === String(state.settlementId)) || null;
}

function dominantRelationshipContext(snapshot, settlementId) {
  const states = snapshot?.worldState?.relationshipStates || {};
  const sid = String(settlementId);
  for (const edge of snapshot?.regionalGraph?.edges || snapshot?.relationships || []) {
    const from = String(edge.from || edge.source || '');
    const to = String(edge.to || edge.target || '');
    if (from !== sid && to !== sid) continue;
    const key = edge.id || `rel.${from}.${to}`;
    const rel = states[key]?.relationshipType || edge.relationshipType || edge.type || 'neutral';
    if (rel === 'vassal') return to === sid ? 'vassal' : 'overlord';
    if (rel === 'hostile' || rel === 'cold_war') return rel;
    if (rel === 'allied') return 'allied';
  }
  return 'local';
}

function contextForNpc(snapshot, state) {
  const item = settlementForState(snapshot, state);
  const tier = item?.settlement?.tier || 'village';
  const conditions = (item?.activeConditions || [])
    .map(c => c.archetype || c.label || '')
    .filter(Boolean)
    .sort()
    .slice(0, 3);
  const relationship = dominantRelationshipContext(snapshot, state.settlementId);
  return {
    tier,
    conditions,
    relationship,
    signature: `${tier}|${relationship}|${conditions.join(',')}`,
  };
}

function tierDirection(previousTier, nextTier) {
  const order = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
  const prev = order.indexOf(previousTier);
  const next = order.indexOf(nextTier);
  if (prev < 0 || next < 0 || prev === next) return null;
  return next > prev ? 'promotion' : 'demotion';
}

function branchedGoals(state, context) {
  const dir = tierDirection(state.contextTier, context.tier);
  const conditionText = context.conditions.join(' ');
  if (context.relationship === 'vassal') {
    if (['dissident', 'military', 'civic'].includes(state.roleArchetype)) {
      return { shortGoal: 'organize_autonomy', longGoal: 'break_vassalage' };
    }
    return { shortGoal: 'survive_tribute', longGoal: 'bind_external_patron' };
  }
  if (context.relationship === 'overlord') {
    return { shortGoal: 'secure_tribute', longGoal: 'expand_influence' };
  }
  if (/famine|plague|disease|war|siege|rebellion/.test(conditionText)) {
    if (['healer', 'religious', 'labor_resource'].includes(state.roleArchetype)) {
      return { shortGoal: 'protect_followers', longGoal: 'restore_order' };
    }
    if (state.corruption) return { shortGoal: 'exploit_desperation', longGoal: 'expand_influence' };
    return { shortGoal: 'survive_crisis', longGoal: 'restore_order' };
  }
  if (dir === 'promotion') {
    if (state.roleArchetype === 'merchant') return { shortGoal: 'join_guild', longGoal: 'expand_trade_house' };
    if (state.roleArchetype === 'military') return { shortGoal: 'secure_new_garrison', longGoal: 'professionalize_guard' };
    if (['ruler', 'civic', 'heir'].includes(state.roleArchetype)) return { shortGoal: 'formalize_new_charter', longGoal: 'secure_office' };
    return { shortGoal: 'profit_from_change', longGoal: 'expand_influence' };
  }
  if (dir === 'demotion') {
    if (state.corruption) return { shortGoal: 'punish_rivals', longGoal: 'exploit_desperation' };
    return { shortGoal: 'survive_crisis', longGoal: 'protect_followers' };
  }
  if (context.relationship === 'hostile' || context.relationship === 'cold_war') {
    return { shortGoal: 'mobilize_defenses', longGoal: 'settle_rivalry' };
  }
  return null;
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
    // Per-settlement corruption climate (criminal presence / crime / security /
    // prosperity), used as the fallback rule for legacy saves whose NPCs predate
    // generation-time corruption (no npc.corrupt set).
    const climate = readCorruptionClimate(item.settlement);
    npcs.forEach((npc, index) => {
      const id = npcId(item.id, npc, index);
      if (npcStates[id]) {
        if (!npcStates[id].contextSignature) {
          const context = contextForNpc(snapshot, { settlementId: item.id });
          npcStates[id] = { ...npcStates[id], contextSignature: context.signature, contextTier: context.tier };
        }
        return;
      }
      const local = rng.fork(`npc:${id}`);
      // Corruption is decided at generation (corruptionPass sets npc.corrupt +
      // vector); the world-pulse mirrors it. One rng draw is kept here so a legacy
      // save's downstream NPC-trait draws keep their positions. No criminal
      // institution → no corruption (the rule), regardless of personality.
      const corruptRoll = local.random();
      const genFlaw = npcCorruptibleFlaw(npc);
      let corrupt;
      let corruptVector;
      if (typeof npc.corrupt === 'boolean') {
        corrupt = npc.corrupt;
        corruptVector = corrupt ? (npc.corruptionVector || corruptionVectorForFlaw(genFlaw)) : null;
      } else if (climate.hasCriminalInst && genFlaw) {
        corrupt = corruptRoll < spawnCorruptionChance(climate);
        corruptVector = corrupt ? corruptionVectorForFlaw(genFlaw) : null;
      } else {
        corrupt = false;
        corruptVector = null;
      }
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
        corruptionProfile: { corrupted: corrupt, vector: corruptVector },
        goalProgress: { short: 0, long: 0 },
        rivalryTargets: [],
        momentum: 0,
        leverage: 0,
        corruptionHeat: corrupt ? 0.2 : 0,
        ambitionHeat: 0,
        lastActedTick: null,
        lastAction: null,
        corruption: corrupt,
        contextSignature: contextForNpc(snapshot, { settlementId: item.id }).signature,
        contextTier: item.settlement?.tier || 'village',
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

/**
 * §corruption Phase 1b — per-tick onset + organic exposure over worldState.npcStates.
 *
 *  • Onset: a clean, eligible NPC (corruptible flaw) in a settlement with a
 *    criminal institution turns corrupt at the climate-scaled `onsetHazard`.
 *  • Organic exposure (no DM): a corrupt NPC is exposed at `exposureChance`
 *    (rises with security + prosperity + their visibility, falls with guild
 *    strength) — demoting their standing (dotRank → seat) and cooling their heat.
 *    Once eroded to the lowest seat, a low `outReplaceAtNotable` roll OUSTS them
 *    (corruption cleared, flagged `ousted`). Each exposure records an event
 *    naming the tied criminal + home institutions for the impairment pass (1b-ii).
 *
 * Pure transform: reads the snapshot for per-settlement climate + NPC eligibility,
 * returns a new worldState (updated npcStates) + the exposure events. rng is
 * forked per (npc, tick) so replays are deterministic. No criminal institution →
 * no onset/exposure pressure (the rule).
 *
 * @returns {{ worldState: object, exposures: Array<object> }}
 */
export function advanceNpcCorruption(worldState, snapshot, rng, { tick = 0 } = {}) {
  const npcStates = { ...(worldState.npcStates || {}) };
  const exposures = [];
  for (const item of (snapshot?.settlements || [])) {
    const climate = readCorruptionClimate(item.settlement);
    if (!climate.hasCriminalInst) continue; // no criminal infrastructure → no pressure
    const guildStrength = climate.crime; // proxy until Phase 3 wires real guild power
    const npcs = item.settlement?.npcs || [];
    npcs.forEach((npc, index) => {
      const id = npcId(item.id, npc, index);
      const s = npcStates[id];
      if (!s) return;
      const local = rng.fork(`corr:${id}:${tick}`);
      const flaw = npcCorruptibleFlaw(npc);

      if (!s.corruption) {
        // Onset — only eligible NPCs, and only the corruptible ones turn.
        if (flaw && local.random() < onsetHazard(climate)) {
          npcStates[id] = {
            ...s,
            corruption: true,
            corruptionProfile: { corrupted: true, vector: corruptionVectorForFlaw(flaw) },
            corruptionHeat: Math.max(0.2, s.corruptionHeat || 0),
          };
        }
        return;
      }

      // Organic exposure of an already-corrupt NPC.
      const visibility = (s.dotRank || 1) / 3;
      const exposeP = exposureChance({ security: climate.security, prosperity: climate.prosperity, guildStrength, visibility });
      if (local.random() >= exposeP) return;

      const homeInstitution = npc.factionAffiliation || npc.factionLink || npc.institutionId || null;
      const criminalInstitution = npc.corruptTies?.criminalInstitution || climate.criminalInstitutions[0] || null;
      const atBottom = (s.dotRank || 1) <= 1;

      if (atBottom && local.random() < CORRUPTION_TUNING.outReplaceAtNotable) {
        npcStates[id] = {
          ...s,
          corruption: false,
          corruptionProfile: { corrupted: false, vector: null },
          corruptionHeat: 0,
          ousted: true,
        };
        exposures.push({ npcId: id, settlementId: item.id, name: s.name, kind: 'ousted', criminalInstitution, homeInstitution });
      } else {
        const nextRank = demoteDotRank(s.dotRank);
        npcStates[id] = {
          ...s,
          dotRank: nextRank,
          factionSeat: roleSeatFor(nextRank),
          corruptionHeat: clamp01((s.corruptionHeat || 0) * 0.7),
        };
        exposures.push({ npcId: id, settlementId: item.id, name: s.name, kind: 'demoted', criminalInstitution, homeInstitution });
      }
    });
  }
  return { worldState: { ...worldState, npcStates }, exposures };
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

function npcGoalRebranch(state, context, tick) {
  const goals = branchedGoals(state, context);
  if (!goals) return null;
  return {
    id: `candidate.npc.goal_rebranch.${stablePart(state.npcId)}.${tick}`,
    type: 'npc',
    candidateType: 'npc_goal_rebranch',
    ruleId: `npc_${state.roleArchetype}_goal_rebranch`,
    ruleFamily: 'npc',
    targetSaveId: state.settlementId,
    npcId: state.npcId,
    factionId: state.factionId,
    severity: 0.44,
    probability: 1,
    applyMode: 'auto',
    headline: `${state.name} changes ambitions`,
    summary: `${state.name}'s goals shift because the settlement context changed.`,
    reasons: [
      `Context changed from ${state.contextSignature || 'unknown'} to ${context.signature}.`,
      `Personality remains anchored by ideal ${String(state.ideal || 'unknown').replace(/_/g, ' ')} and flaw ${String(state.flaw || 'unknown').replace(/_/g, ' ')}.`,
    ],
    npcPatch: {
      ...goals,
      goalProgress: { short: 0, long: 0 },
      contextSignature: context.signature,
      contextTier: context.tier,
      momentum: clamp01((state.momentum || 0) + 0.08),
      lastActedTick: tick,
      lastAction: 'goal_rebranch',
    },
    metadata: {
      roleArchetype: state.roleArchetype,
      previousContext: state.contextSignature || null,
      nextContext: context.signature,
    },
    conflictTags: [`npc:${state.npcId}`, `settlement:${state.settlementId}:npc_goal_rebranch`],
  };
}

export function evaluateNpcRules(snapshot, pressureIdx, options = {}) {
  const tick = options.tick ?? snapshot.worldState.tick + 1;
  const states = Object.values(snapshot.worldState.npcStates || {});
  const out = [];

  for (const state of states) {
    const context = contextForNpc(snapshot, state);
    if (state.contextSignature && state.contextSignature !== context.signature) {
      const rebranch = npcGoalRebranch(state, context, tick);
      if (rebranch) {
        out.push(rebranch);
        continue;
      }
    }
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
  const patch = outcome.npcPatch || {};
  const goalChanged = (patch.shortGoal && patch.shortGoal !== current.shortGoal)
    || (patch.longGoal && patch.longGoal !== current.longGoal);
  const goalHistory = goalChanged
    ? [
        ...(Array.isArray(current.goalHistory) ? current.goalHistory.slice(-11) : []),
        {
          tick: worldState.tick ?? null,
          outcomeId: outcome.id || null,
          candidateType: outcome.candidateType || null,
          fromShortGoal: current.shortGoal || null,
          toShortGoal: patch.shortGoal || current.shortGoal || null,
          fromLongGoal: current.longGoal || null,
          toLongGoal: patch.longGoal || current.longGoal || null,
          previousContext: current.contextSignature || outcome.metadata?.previousContext || null,
          nextContext: patch.contextSignature || outcome.metadata?.nextContext || null,
        },
      ]
    : current.goalHistory || [];
  npcStates[outcome.npcId] = {
    ...current,
    ...patch,
    goalProgress: {
      ...(current.goalProgress || {}),
      ...(patch.goalProgress || {}),
    },
    rivalryTargets: patch.rivalryTargets || current.rivalryTargets || [],
    goalHistory,
  };
  return { ...worldState, npcStates };
}
