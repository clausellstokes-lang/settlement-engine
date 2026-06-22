import { stablePart } from './worldState.js';
import { relationshipRoles } from './relationshipEvolution.js';
import {
  readCorruptionClimate, npcCorruptibleFlaw, corruptionVectorForFlaw, spawnCorruptionChance,
  onsetHazard, exposureChance, demoteDotRank, CORRUPTION_TUNING, guildEffectiveSecurity,
  patronageSecurityDrag, npcHomeInstitution, PATRONAGE_TUNING,
  hasCorruptingDeity, npcDeityDisfavor,
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
 * Mirror tick-evolved corruption from worldState.npcStates back onto a
 * settlement's NPCs, so the dossier reflects corruption acquired (or
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
    const timesExposed = st.timesExposed || 0;
    if (npc.corrupt === corrupt && npc.corruptionVector === vector && !!npc.ousted === ousted && (npc.timesExposed || 0) === timesExposed) return npc;
    changed = true;
    return { ...npc, corrupt, corruptionVector: vector, timesExposed, ...(ousted ? { ousted: true } : {}) };
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
    if (rel === 'vassal') {
      // A pulse-driven subjugation may have crowned the authored 'to'
      // side as overlord — resolve roles state-first, never raw orientation,
      // or the conqueror's NPCs plot to break their own vassalage.
      const { juniorId } = relationshipRoles(edge, states[key]);
      return juniorId === sid ? 'vassal' : 'overlord';
    }
    if (rel === 'hostile' || rel === 'cold_war') return rel;
    if (rel === 'allied') return 'allied';
  }
  return 'local';
}

// Crisis classification is by archetype id ONLY (the activeConditions.js
// catalog) — label prose must never branch goals: 'siege_lifted' is recovery,
// not siege, and a DM label like 'War festival' is not war. DM-authored
// custom_crisis conditions carry catalog affectedSystems instead of a mapped
// archetype, so they signal crisis through those systems.
const CRISIS_ARCHETYPES = new Set(['famine', 'plague', 'war_pressure', 'rebellion']);
const CRISIS_SYSTEMS = ['food_security', 'healing_capacity', 'defense_readiness'];

function isCrisisCondition(c) {
  if (!c) return false;
  if (CRISIS_ARCHETYPES.has(c.archetype)) return true;
  return c.archetype === 'custom_crisis'
    && (c.affectedSystems || []).some(s => CRISIS_SYSTEMS.includes(s));
}

function contextForNpc(snapshot, state) {
  const item = settlementForState(snapshot, state);
  const tier = item?.settlement?.tier || 'village';
  const active = item?.activeConditions || [];
  // The signature carries archetype ids only — a condition without an
  // archetype is dropped rather than falling back to label, so a cosmetic
  // label edit can never re-trigger a goal rebranch.
  const conditions = active
    .map(c => (typeof c?.archetype === 'string' ? c.archetype : ''))
    .filter(Boolean)
    .sort()
    .slice(0, 3);
  const relationship = dominantRelationshipContext(snapshot, state.settlementId);
  return {
    tier,
    conditions,
    crisis: active.some(isCrisisCondition),
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
  if (context.relationship === 'vassal') {
    if (['dissident', 'military', 'civic'].includes(state.roleArchetype)) {
      return { shortGoal: 'organize_autonomy', longGoal: 'break_vassalage' };
    }
    return { shortGoal: 'survive_tribute', longGoal: 'bind_external_patron' };
  }
  if (context.relationship === 'overlord') {
    return { shortGoal: 'secure_tribute', longGoal: 'expand_influence' };
  }
  if (context.crisis) {
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
        let st = npcStates[id];
        // Adopt DM/event-driven corruption changes from the settlement NPC
        // (authoritative between ticks): EXPOSE_CORRUPTION and
        // criminal-institution removal clear npc.corrupt + bump timesExposed, so
        // they must stick here instead of being re-mirrored from stale npcState.
        if (typeof npc.corrupt === 'boolean'
            && (npc.corrupt !== st.corruption || (npc.timesExposed || 0) !== (st.timesExposed || 0))) {
          st = {
            ...st,
            corruption: npc.corrupt,
            corruptionProfile: npc.corrupt ? st.corruptionProfile : { corrupted: false, vector: null },
            corruptionHeat: npc.corrupt ? st.corruptionHeat : 0,
            timesExposed: Math.max(npc.timesExposed || 0, st.timesExposed || 0),
            ousted: npc.ousted || st.ousted || false,
          };
        }
        // Editor roster wave — adopt a DM/event-driven importance change
        // (PROMOTE_NPC / DEMOTE_NPC swap npc.importance) into dotRank +
        // factionSeat, same "authoritative between ticks" posture as the
        // corruption adoption above. Guarded by the adoptedImportance marker:
        // adoption fires only when the SETTLEMENT side changed, so a sim-side
        // seek_promotion's raised dotRank is not clobbered back every tick by
        // an unchanged npc.importance.
        if (typeof npc.importance === 'string' && st.adoptedImportance === undefined) {
          // Legacy npcState predating the marker: seed it WITHOUT adopting —
          // re-deriving dotRank here would clobber a sim-evolved promotion
          // (seek_promotion) once on every pre-existing save at upgrade time.
          st = { ...st, adoptedImportance: npc.importance };
        } else if (typeof npc.importance === 'string' && npc.importance !== st.adoptedImportance) {
          const dotRank = dotRankFor(npc);
          st = { ...st, dotRank, factionSeat: roleSeatFor(dotRank), adoptedImportance: npc.importance };
        }
        if (!st.contextSignature) {
          const context = contextForNpc(snapshot, { settlementId: item.id });
          st = { ...st, contextSignature: context.signature, contextTier: context.tier };
        } else {
          // Keep contextSignature current even when the context shift produces NO
          // branched goals. evaluateNpcRules only advances the signature through a
          // goal_rebranch candidate, so a non-branching transition (e.g. a hostile
          // edge cooling to neutral for a role with no neutral branch) used to
          // leave the signature permanently stale — re-classifying every tick with
          // no effect and mis-labelling a LATER branching transition's "from"
          // context. When the live context still branches we leave the signature
          // alone so evaluateNpcRules can fire the rebranch; only the no-branch
          // case is reconciled silently here (no candidate, no news).
          const context = contextForNpc(snapshot, { settlementId: st.settlementId });
          if (context.signature !== st.contextSignature && !branchedGoals(st, context)) {
            st = { ...st, contextSignature: context.signature, contextTier: context.tier };
          }
        }
        npcStates[id] = st;
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
        // Marker for the editor promote/demote adoption above: dotRank was
        // seeded from THIS importance, so only a later change re-adopts.
        adoptedImportance: typeof npc.importance === 'string' ? npc.importance : null,
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
        timesExposed: npc.timesExposed || 0,
        contextSignature: contextForNpc(snapshot, { settlementId: item.id }).signature,
        contextTier: item.settlement?.tier || 'village',
      };
    });
  }
  return { ...worldState, npcStates };
}

// Grace window before a roster-absent NPC state is pruned. Mirrors
// FACTION_STATE_PRUNE_GRACE_TICKS: long enough to survive a transient roster
// hiccup (a save that briefly fails to surface its NPCs), short enough that a
// renamed/removed NPC ghost doesn't haunt the per-tick npcStates loops and the
// persisted save for a season.
export const NPC_STATE_PRUNE_GRACE_TICKS = 3;

/**
 * Prune NPC states whose NPC no longer exists on any live settlement roster.
 * npcId is name/id-keyed (npcId()), so editing the roster, renaming an NPC, or
 * removing a settlement strands a permanent ghost: ensureNpcStates never deletes
 * it, evaluateNpcRules / seatNpcsIntoFactions / rivalryTargetFor still iterate
 * it, and it serializes forever. Mirrors pruneFactionStates:
 *  • a grace window (missingSinceTick, NPC_STATE_PRUNE_GRACE_TICKS) so a
 *    transient absence doesn't amnesia NPC history;
 *  • pruned ids are stripped from surviving rivalryTargets[] lists.
 * Note: the ousted-and-replaced cleanup in
 * advanceCampaignWorld deletes ousted ids immediately (their replacement carries
 * a new id); this is the general roster-reconciliation pass for every other way
 * an NPC leaves. Identity no-op when nothing changes. Deterministic — derived
 * purely from the snapshot.
 *
 * @param {any} worldState
 * @param {any} snapshot
 * @param {{ tick?: number, graceTicks?: number }} [opts]
 * @returns {any}
 */
export function pruneNpcStates(worldState, snapshot, { tick = 0, graceTicks = NPC_STATE_PRUNE_GRACE_TICKS } = {}) {
  /** @type {Record<string, any>} */
  const states = worldState?.npcStates || {};
  const ids = Object.keys(states);
  if (!ids.length) return worldState;

  /** @type {Set<string>} */
  const liveNpcIds = new Set();
  for (const item of snapshot?.settlements || []) {
    const npcs = item.settlement?.npcs || [];
    npcs.forEach((/** @type {any} */ npc, /** @type {number} */ index) => {
      liveNpcIds.add(npcId(item.id, npc, index));
    });
  }

  let changed = false;
  /** @type {Set<string>} */
  const prunedIds = new Set();
  /** @type {Record<string, any>} */
  const next = {};
  for (const [id, state] of Object.entries(states)) {
    if (liveNpcIds.has(id)) {
      // Back on (or still on) the roster: clear any absence stamp.
      if (state.missingSinceTick != null) {
        const { missingSinceTick: _gone, ...rest } = state;
        next[id] = rest;
        changed = true;
      } else {
        next[id] = state;
      }
      continue;
    }
    const since = Number.isFinite(state.missingSinceTick) ? state.missingSinceTick : tick;
    if (tick - since >= graceTicks) {
      prunedIds.add(id);
      changed = true;
      continue;
    }
    if (state.missingSinceTick === since) {
      next[id] = state;
    } else {
      next[id] = { ...state, missingSinceTick: since };
      changed = true;
    }
  }

  if (prunedIds.size) {
    for (const [id, state] of Object.entries(next)) {
      const targets = state.rivalryTargets || [];
      const kept = targets.filter((/** @type {any} */ rid) => !prunedIds.has(rid));
      if (kept.length !== targets.length) next[id] = { ...state, rivalryTargets: kept };
    }
  }

  if (!changed) return worldState;
  return { ...worldState, npcStates: next };
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
 * Per-tick onset + organic exposure over worldState.npcStates.
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
 * When `religionActive` (the caller's religionDynamicsEnabled +
 * isSubsystemActive gate) AND a settlement carries an embedded EVIL deity, the
 * onset gate is RELAXED (`hasCriminalInst || hasCorruptingDeity`) so the evil
 * deity can corrupt the faithful even in a crime-free town. A per-NPC,
 * bounded, centered-on-1.0 `deityDisfavor` then modulates the chosen knob (evil
 * → onset, good → exposure) by the NPC's AUTHORED alignment. `religionActive`
 * false (default) ⇒ deityDisfavor 1.0, gate unrelaxed ⇒ byte-identical.
 *
 * @param {object} worldState
 * @param {any} snapshot
 * @param {{ fork: (k:string)=>{ random: ()=>number } }} rng
 * @param {{ tick?: number, guildStrengthBy?: Map<string, number>|null, religionActive?: boolean }} [opts]
 * @returns {{ worldState: object, exposures: Array<{npcId:string,settlementId:any,name:string,kind:string,criminalInstitution?:any,homeInstitution?:any}> }}
 */
export function advanceNpcCorruption(worldState, snapshot, rng, { tick = 0, guildStrengthBy = null, religionActive = false } = {}) {
  const npcStates = { ...(worldState.npcStates || {}) };
  /** @type {Array<{npcId:string,settlementId:any,name:string,kind:string,criminalInstitution?:any,homeInstitution?:any}>} */
  const exposures = [];
  for (const item of (snapshot?.settlements || [])) {
    const climate = readCorruptionClimate(item.settlement);
    // The embedded deity snapshot (only consulted when the religion layer is
    // ACTIVE — religionDynamicsEnabled + isSubsystemActive).
    // null ⇒ deityDisfavor stays 1.0 and the gate is unrelaxed ⇒ byte-identical.
    const deity = religionActive ? (item.settlement?.config?.primaryDeitySnapshot || null) : null;
    const corruptingDeity = religionActive && hasCorruptingDeity(item.settlement);
    // ONSET requires criminal infrastructure (the rule) — but EXPOSURE must
    // run regardless: betrayal-seeded conspirators (whose patron is a foreign
    // sponsor, not a local guild) would otherwise be permanently immune to
    // discovery in any settlement without a criminal institution, and each
    // betrayal re-ignition would monotonically corrupt one more NPC.
    // An embedded EVIL deity RELAXES this gate, enabling onset in
    // a crime-free town ("the faithful are corrupted from within"). Additive
    // and 0 when no deity ⇒ a deity-free town is byte-identical.
    const onsetEnabled = climate.hasCriminalInst || corruptingDeity;
    // Real thieves-guild strength (if threaded) drags effective security down
    // (the feedback loop); falls back to the crime proxy.
    const gs = guildStrengthBy ? guildStrengthBy.get(String(item.id)) : undefined;
    const guildStr = gs != null ? gs : climate.crime;
    const effSecurity = gs != null ? guildEffectiveSecurity(climate.security, gs) : climate.security;
    // Patronage drag (onset side only): a compromised watch/court shields NEW
    // recruits. Exposure deliberately reads RAW
    // security instead: the guild's shielding is already priced into
    // exposureChance's -guildStrength term, and a strong watch keeps catching
    // people even while parts of it are bought.
    const patronage = patronageSecurityDrag(item.settlement);
    const onsetSecurity = clamp01(effSecurity * (1 - patronage.drag));
    const exposureSecurity = climate.security;
    const npcs = item.settlement?.npcs || [];
    npcs.forEach((npc, index) => {
      const id = npcId(item.id, npc, index);
      const s = npcStates[id];
      if (!s) return;
      const local = rng.fork(`corr:${id}:${tick}`);
      const flaw = npcCorruptibleFlaw(npc);

      const priorExposures = s.timesExposed || 0;

      // The per-NPC, bounded, centered-on-1.0 deity-disfavor
      // multipliers (at most ONE knob ≠ 1.0). Reads the AUTHORED personality
      // only — NO rng draw, NO extra fork, so the deterministic stream position
      // is unchanged (an additive-after-sum term moves the threshold, not the
      // draw). Both 1.0 when no deity ⇒ byte-identical.
      const disfavor = npcDeityDisfavor(deity, npc);

      if (!s.corruption) {
        // Onset — only eligible NPCs, only the corruptible ones turn, and only
        // where criminal infrastructure exists (RELAXED for an evil deity).
        // A prior exposure (organic or DM) makes re-corruption progressively
        // harder. An evil deity's onset disfavor rides here.
        if (onsetEnabled && flaw && local.random() < onsetHazard({ crime: climate.crime, security: onsetSecurity, prosperity: climate.prosperity, priorExposures, deityDisfavor: disfavor.onset })) {
          npcStates[id] = {
            ...s,
            corruption: true,
            corruptionProfile: { corrupted: true, vector: corruptionVectorForFlaw(flaw) },
            corruptionHeat: Math.max(0.2, s.corruptionHeat || 0),
          };
        }
        return;
      }

      // Organic exposure of an already-corrupt NPC. A repeat offender (prior
      // exposures) draws more scrutiny once they relapse → easier to re-expose.
      // Proximity: an NPC homed in a PUBLICLY corrupt institution (corruption
      // impairment on record) sits where the investigators are already circling.
      const home = npcHomeInstitution(npc);
      const proximity = home && patronage.revealed.some(name => {
        const a = String(name).toLowerCase();
        const b = String(home).toLowerCase();
        return a === b || a.includes(b) || b.includes(a);
      }) ? PATRONAGE_TUNING.proximityVisibilityBonus : 0;
      const visibility = Math.min(1, (s.dotRank || 1) / 3 + proximity);
      // A good deity's repression rides the EXPOSURE side (which runs regardless
      // of a criminal institution): a misaligned/corrupt NPC is outed faster.
      const exposeP = exposureChance({ security: exposureSecurity, prosperity: climate.prosperity, guildStrength: guildStr, visibility, priorExposures, deityDisfavor: disfavor.exposure });
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
          timesExposed: priorExposures + 1,
        };
        exposures.push({ npcId: id, settlementId: item.id, name: s.name, kind: 'ousted', criminalInstitution, homeInstitution });
      } else {
        const nextRank = demoteDotRank(s.dotRank);
        npcStates[id] = {
          ...s,
          dotRank: nextRank,
          factionSeat: roleSeatFor(nextRank),
          corruptionHeat: clamp01((s.corruptionHeat || 0) * 0.7),
          timesExposed: priorExposures + 1,
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

// Group npcStates by settlementId ONCE per pass (insertion order preserved, so
// the stable dotRank sort below is byte-identical to the previous full-list
// filter). Avoids the per-NPC O(N) rescan that made rivalry lookup O(N^2).
/** @param {any[]} states @returns {Map<string, any[]>} */
function npcStatesBySettlement(states) {
  /** @type {Map<string, any[]>} */
  const bySettlement = new Map();
  for (const state of states) {
    const sid = String(state.settlementId);
    let list = bySettlement.get(sid);
    if (!list) { list = []; bySettlement.set(sid, list); }
    list.push(state);
  }
  return bySettlement;
}

/** @param {any} state @param {Map<string, any[]>} bySettlement */
function rivalryTargetFor(state, bySettlement) {
  const peers = bySettlement.get(String(state.settlementId)) || [];
  const rivals = peers
    .filter((/** @type {any} */ other) => other.npcId !== state.npcId)
    .sort((/** @type {any} */ a, /** @type {any} */ b) => (b.dotRank || 1) - (a.dotRank || 1));
  return rivals.find((/** @type {any} */ other) => other.factionId !== state.factionId) || rivals[0] || null;
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
    summary: `${state.name} has worked toward "${goal}" for a long while, and now seizes it.`,
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
  // Group NPC states by settlement ONCE so rivalry lookup is O(degree) per NPC
  // instead of an O(N) rescan (the whole pass was O(N^2)).
  const bySettlement = npcStatesBySettlement(states);
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
      ? rivalryTargetFor(state, bySettlement)
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
