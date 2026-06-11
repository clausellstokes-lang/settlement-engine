/**
 * domain/worldPulse/stressorDynamics.js — counterforces: settlement strength
 * shortens crises.
 *
 * Generalizes the one strength-based recovery hook that existed before this
 * module (disease_outbreak resolving faster under high healing_capacity,
 * formerly hard-coded in stressors.js resolutionChance) into a catalog-driven
 * model covering every stressor type:
 *
 *   - Each type names weighted strength SOURCES (causal variables, conserved
 *     ledgers, institution classes, allied edges/channels). Their weighted
 *     blend is a 0..1 counterforce score per affected settlement, averaged
 *     across the stressor's footprint (exactly how the old disease check
 *     averaged healing_capacity).
 *   - The score is CENTERED at 0.5: a neutral settlement changes nothing, a
 *     strong one accelerates recovery, a weak one wallows. RNG is preserved —
 *     counterforces shift the per-tick hazard, never guarantee an outcome.
 *   - Two levers move together: a resolution-chance delta AND a decay-rate
 *     multiplier. The decay lever is what lets structural stressors actually
 *     break — a siege is categorically un-resolvable while severity >= 0.25,
 *     so a chance bonus alone would never end it.
 *   - `floors` + `requireAllFloors` encode conjunctive recoveries: a siege
 *     breaks fast only with defense AND stored food AND at least Tolerated
 *     legitimacy. Missing any floor caps the score at neutral (0.5) — partial
 *     strength never *hurts*, it just doesn't accelerate.
 *
 * Deterministic: everything reads the world snapshot; no RNG, no Date.
 */

import { foodLedger } from '../foodLedger.js';
import { healingLedger } from '../healingLedger.js';
import { governanceLedger } from '../governanceLedger.js';
import { coupContenders } from '../rulingPower.js';
import { canonicalRelationshipLabel } from '../region/graph.js';

function clamp01(value) {
  const n = Number.isFinite(value) ? value : 0;
  return Math.max(0, Math.min(1, n));
}

// ── Institution classes ──────────────────────────────────────────────────
// Same name-regex idiom the capacity model uses; counts are normalized at
// 2 matching institutions = full credit so redundancy (not just presence)
// is what earns the bonus.
const INSTITUTION_CLASSES = Object.freeze({
  food: /(granary|mill|farm|orchard|fishery|silo)/i,
  admin: /(court|hall|council|government|chancery|registry|moot|forum)/i,
  defense: /(wall|gate|garrison|watch|barracks|tower|fortress|militia|citadel)/i,
  security: /(watch|garrison|constab|guard|magistrate|court)/i,
  religious: /(temple|church|chapel|shrine|monastery|abbey|cathedral)/i,
  arcane: /(sanctum|college|conclave|circle|enclave|atheneum|spire)/i,
  finance: /(bank|counting|mint|exchange|guildhall)/i,
});

function institutionClassValue(settlement, className) {
  const re = INSTITUTION_CLASSES[className];
  if (!re) return 0;
  const count = (settlement?.institutions || [])
    .filter(inst => re.test(String(inst?.name || ''))).length;
  return Math.min(1, count / 2);
}

function edgesTouching(snapshot, settlementId) {
  const id = String(settlementId);
  const edges = snapshot?.regionalGraph?.edges || snapshot?.relationships || [];
  return edges.filter(e => String(e?.from) === id || String(e?.to) === id);
}

function relationshipTypeOf(edge) {
  // H12 shim: legacy saves carry the plural 'trade_partners' the old
  // trade-route event wrote; read it as the canonical singular.
  return canonicalRelationshipLabel(String(edge?.relationshipType || edge?.type || '').toLowerCase());
}

function incomingChannels(snapshot, settlementId, channelType) {
  const id = String(settlementId);
  const channels = snapshot?.regionalGraph?.channels || snapshot?.channels || [];
  return channels.filter(c =>
    String(c?.to) === id
    && String(c?.type) === channelType
    && String(c?.status || 'confirmed') === 'confirmed');
}

// ── Source evaluation ────────────────────────────────────────────────────
// A source is { kind, key?, weight, floor?, invert? } evaluated to 0..1 for
// one settlement (a snapshot.byId entry: { settlement, causal, ... }).

function sourceValue(source, entry, snapshot, settlementId) {
  const settlement = entry?.settlement;
  switch (source.kind) {
    case 'causal': {
      const score = entry?.causal?.scores?.[source.key];
      const v = clamp01((Number.isFinite(score) ? score : 50) / 100);
      return source.invert ? 1 - v : v;
    }
    case 'food': {
      const ledger = foodLedger(settlement);
      if (source.key === 'resilience') return clamp01(ledger.resilienceScore / 100);
      if (source.key === 'storage') return clamp01(ledger.storageMonths / 6);
      if (source.key === 'deficitInverse') return clamp01(1 - ledger.deficitPct / 40);
      return 0.5;
    }
    case 'healing': {
      if (source.key === 'redundancy') return clamp01(healingLedger(settlement).healerCount / 3);
      return 0.5;
    }
    case 'governance': {
      return clamp01(governanceLedger(settlement).legitimacyScore / 100);
    }
    case 'institution': {
      return institutionClassValue(settlement, source.key);
    }
    case 'ally': {
      if (source.key === 'military_protection') {
        const hasChannel = incomingChannels(snapshot, settlementId, 'military_protection').length > 0;
        const hasAlly = edgesTouching(snapshot, settlementId)
          .some(e => relationshipTypeOf(e) === 'allied');
        return hasChannel || hasAlly ? 1 : 0;
      }
      if (source.key === 'trade_partner') {
        const count = edgesTouching(snapshot, settlementId)
          .filter(e => ['trade_partner', 'allied'].includes(relationshipTypeOf(e))).length;
        return Math.min(1, count / 2);
      }
      return 0;
    }
    default:
      return 0.5;
  }
}

// ── Counterforce catalog ─────────────────────────────────────────────────
// weights are normalized at evaluation time; floors are in the source's own
// normalized 0..1 units. decayBoost scales the per-tick severity decay at
// full strength (structural types need >= 1.4 to break in campaign time);
// maxResolutionBonus / weaknessPenalty bound the resolution-chance delta.

const DEFAULT_EFFECTS = Object.freeze({
  maxResolutionBonus: 0.15,
  weaknessPenalty: 0.08, // magnitude; applied as a negative delta below 0.5
  decayBoost: 0.8,
  requireAllFloors: false,
});

export const STRESSOR_COUNTERFORCES = Object.freeze({
  siege: {
    // The conjunctive trio: defense readiness, stored food, and a populace
    // that at least tolerates its rulers. Missing any leg -> the siege
    // grinds at neutral speed no matter how strong the others are.
    sources: [
      { kind: 'causal', key: 'defense_readiness', weight: 0.35, floor: 0.35 },
      { kind: 'food', key: 'storage', weight: 0.25, floor: 0.33 },     // ~2 months stored
      { kind: 'governance', key: 'legitimacy', weight: 0.25, floor: 0.45 }, // 'Tolerated'
      { kind: 'ally', key: 'military_protection', weight: 0.15 },      // relief force
    ],
    requireAllFloors: true,
    maxResolutionBonus: 0.18,
    decayBoost: 1.6,
  },
  famine: {
    // resilienceScore is LIVE now: foodStockpile re-grades its storage slice
    // from the current granary every tick, so resilience carries most of the
    // weight here — it falls as the famine eats the stores and recovers when
    // surplus refills them. The direct storage source keeps a SMALL weight
    // (the granary is the immediate famine answer, slightly more than its
    // ~35% share inside the composite) — kept low because the same grain
    // already counts inside resilience; weighting both highly would double-
    // count storage against every other strength.
    sources: [
      { kind: 'food', key: 'resilience', weight: 0.45 },
      { kind: 'food', key: 'storage', weight: 0.15 },
      { kind: 'causal', key: 'trade_connectivity', weight: 0.2 },
      { kind: 'institution', key: 'food', weight: 0.2 },
    ],
    maxResolutionBonus: 0.18,
    decayBoost: 1.6,
  },
  occupation: {
    sources: [
      { kind: 'governance', key: 'legitimacy', weight: 0.4 },
      { kind: 'causal', key: 'social_trust', weight: 0.35 },
      { kind: 'ally', key: 'military_protection', weight: 0.25 },
    ],
    maxResolutionBonus: 0.12, // occupations are sticky by design
    decayBoost: 1.2,
  },
  political_fracture: {
    sources: [
      { kind: 'causal', key: 'ruling_authority', weight: 0.4 },
      { kind: 'institution', key: 'admin', weight: 0.3 },
      { kind: 'governance', key: 'legitimacy', weight: 0.3 },
    ],
    decayBoost: 1.4,
  },
  indebtedness: {
    sources: [
      { kind: 'causal', key: 'trade_connectivity', weight: 0.45 },
      { kind: 'institution', key: 'finance', weight: 0.35 },
      { kind: 'governance', key: 'legitimacy', weight: 0.2 },
    ],
    decayBoost: 1.4,
  },
  betrayal: {
    // Cohesion + counter-intelligence purge the conspiracy fast. Already a
    // transient type, so the levers are modest.
    sources: [
      { kind: 'causal', key: 'social_trust', weight: 0.5 },
      { kind: 'causal', key: 'criminal_opportunity', weight: 0.5, invert: true },
    ],
    maxResolutionBonus: 0.12,
    decayBoost: 0.6,
  },
  infiltration: {
    sources: [
      { kind: 'causal', key: 'criminal_opportunity', weight: 0.5, invert: true },
      { kind: 'institution', key: 'security', weight: 0.3 },
      { kind: 'causal', key: 'social_trust', weight: 0.2 },
    ],
  },
  disease_outbreak: {
    // The original counterforce, now smooth instead of a step function:
    // strong + redundant healing (3 distinct healer institutions = full
    // redundancy credit) shortens the outbreak; collapsed healing prolongs it.
    sources: [
      { kind: 'causal', key: 'healing_capacity', weight: 0.7 },
      { kind: 'healing', key: 'redundancy', weight: 0.3 },
    ],
    maxResolutionBonus: 0.18,
  },
  succession_void: {
    sources: [
      { kind: 'causal', key: 'ruling_authority', weight: 0.35 },
      { kind: 'institution', key: 'admin', weight: 0.35 },
      { kind: 'causal', key: 'religious_authority', weight: 0.3 },
    ],
    decayBoost: 1.0,
  },
  monster_raider_pressure: {
    sources: [
      { kind: 'causal', key: 'defense_readiness', weight: 0.5 },
      { kind: 'institution', key: 'defense', weight: 0.3 },
      { kind: 'ally', key: 'military_protection', weight: 0.2 },
    ],
    decayBoost: 1.0,
  },
  insurgency: {
    // Redress resolves insurgencies; legitimacy weighs more than soldiers.
    sources: [
      { kind: 'governance', key: 'legitimacy', weight: 0.45 },
      { kind: 'causal', key: 'social_trust', weight: 0.3 },
      { kind: 'causal', key: 'defense_readiness', weight: 0.25 },
    ],
    decayBoost: 1.6,
  },
  religious_conversion_fracture: {
    // Either a strong orthodoxy suppresses the schism or a plural religious
    // landscape absorbs it — both read as 'religious strength + redundancy'.
    sources: [
      { kind: 'causal', key: 'religious_authority', weight: 0.5 },
      { kind: 'institution', key: 'religious', weight: 0.25 },
      { kind: 'causal', key: 'social_trust', weight: 0.25 },
    ],
    decayBoost: 1.0,
  },
  slave_revolt: {
    sources: [
      { kind: 'governance', key: 'legitimacy', weight: 0.4 },
      { kind: 'causal', key: 'defense_readiness', weight: 0.35 },
      { kind: 'causal', key: 'labor_capacity', weight: 0.25 },
    ],
    decayBoost: 1.0,
  },
  rebellion: {
    sources: [
      { kind: 'governance', key: 'legitimacy', weight: 0.45 },
      { kind: 'causal', key: 'defense_readiness', weight: 0.3 },
      { kind: 'causal', key: 'social_trust', weight: 0.25 },
    ],
    decayBoost: 1.0,
  },
  coup_detat: {
    // The seat's own strengths resist the plot: standing authority, public
    // legitimacy, social cohesion, and a loyal security apparatus. A strong
    // ruler reaches the VERDICT faster (resolution = the verdict arriving);
    // the verdict itself re-reads these strengths through the contest model
    // in rulingPower.js, so strength tells twice — once on timing, once on
    // the hold probability.
    sources: [
      { kind: 'causal', key: 'ruling_authority', weight: 0.35 },
      { kind: 'governance', key: 'legitimacy', weight: 0.3 },
      { kind: 'causal', key: 'social_trust', weight: 0.2 },
      { kind: 'institution', key: 'security', weight: 0.15 },
    ],
    maxResolutionBonus: 0.15,
    decayBoost: 1.0,
  },
  wartime: {
    sources: [
      { kind: 'causal', key: 'defense_readiness', weight: 0.35 },
      { kind: 'ally', key: 'military_protection', weight: 0.25 },
      { kind: 'governance', key: 'legitimacy', weight: 0.2 },
      { kind: 'food', key: 'storage', weight: 0.2 },
    ],
    decayBoost: 1.6,
  },
  mass_migration: {
    // Absorptive capacity: housing headroom, labor demand, functioning
    // administration, and a society that doesn't fracture on contact.
    sources: [
      { kind: 'causal', key: 'housing_pressure', weight: 0.35 },
      { kind: 'causal', key: 'labor_capacity', weight: 0.25 },
      { kind: 'institution', key: 'admin', weight: 0.2 },
      { kind: 'causal', key: 'social_trust', weight: 0.2 },
    ],
    decayBoost: 1.0,
  },
  market_shock: {
    sources: [
      { kind: 'causal', key: 'trade_connectivity', weight: 0.5 },
      { kind: 'institution', key: 'finance', weight: 0.25 },
      { kind: 'ally', key: 'trade_partner', weight: 0.25 }, // diverse partners rebound fast
    ],
    decayBoost: 0.6,
  },
  criminal_corridor: {
    sources: [
      { kind: 'causal', key: 'criminal_opportunity', weight: 0.4, invert: true },
      { kind: 'governance', key: 'legitimacy', weight: 0.3 },
      { kind: 'causal', key: 'labor_capacity', weight: 0.3 }, // employment starves the corridor
    ],
  },
  magical_instability: {
    sources: [
      { kind: 'causal', key: 'magical_stability', weight: 0.6 },
      { kind: 'institution', key: 'arcane', weight: 0.4 },
    ],
  },
});

// Floors missed -> the score is capped at NEUTRAL: partial strength never
// punishes, it just doesn't accelerate. (A cap below 0.5 would turn "strong
// in two of three legs" into a penalty, which reads as nonsense at the table.)
const FLOOR_MISS_CAP = 0.5;

/**
 * Evaluate a stressor's counterforce against its affected settlements.
 *
 * @param {any} stressor          normalized stressor ({ type, affectedSettlementIds })
 * @param {any} snapshot          world snapshot ({ byId, regionalGraph })
 * @returns {{ score: number, floorsMet: boolean, resolutionDelta: number,
 *            decayMultiplier: number, profile: any } | null}
 *          null when the type has no counterforce profile (unknown types).
 */
export function counterforceAssessment(stressor, snapshot) {
  const profile = STRESSOR_COUNTERFORCES[stressor?.type];
  if (!profile) return null;
  const effects = { ...DEFAULT_EFFECTS, ...profile };
  const entries = (stressor.affectedSettlementIds || [])
    .map(id => ({ id: String(id), entry: snapshot?.byId?.get?.(String(id)) }))
    .filter(item => item.entry);
  if (!entries.length) return null;

  let scoreSum = 0;
  let floorsMet = true;
  for (const { id, entry } of entries) {
    let weighted = 0;
    let weightTotal = 0;
    for (const source of profile.sources) {
      const value = sourceValue(source, entry, snapshot, id);
      weighted += value * source.weight;
      weightTotal += source.weight;
      if (source.floor != null && value < source.floor) floorsMet = false;
    }
    scoreSum += weightTotal > 0 ? weighted / weightTotal : 0.5;
  }
  const rawScore = clamp01(scoreSum / entries.length);
  const score = effects.requireAllFloors && !floorsMet
    ? Math.min(rawScore, FLOOR_MISS_CAP)
    : rawScore;

  // Centered at 0.5: neutral settlements leave the baseline untouched.
  const centered = (score - 0.5) * 2; // -1..1
  const resolutionDelta = centered >= 0
    ? centered * effects.maxResolutionBonus
    : centered * effects.weaknessPenalty;
  // Strong settlements bleed severity out faster; weak ones slower. The
  // weakness floor is deliberately gentle (0.7): crises are born FROM
  // weakness, so a harsher floor would double structural crisis duration in
  // exactly the settlements most likely to host them — the wallow effect
  // belongs mostly to the resolution-chance penalty, not the decay lever.
  const decayMultiplier = Math.max(0.7, Math.min(2.5, 1 + centered * effects.decayBoost));

  return { score, floorsMet, resolutionDelta, decayMultiplier, profile: effects };
}

// ── Synergies: co-located stressors interact ─────────────────────────────
// Authored pairs only — two stressors gripping the SAME settlement modify
// each other's lifecycle. Everything not listed keeps today's behavior
// (no interaction). Modifiers compose multiplicatively (decay) / additively
// (resolution) and are clamped so stacks can never make a stressor
// unkillable-forever or an instant fizzle. `blocksResolution` is reserved
// for hard causal dependencies: a blockade famine cannot lift while the
// siege stands, no matter the roll.

export const STRESSOR_SYNERGIES = Object.freeze({
  famine: {
    disease_outbreak: { decayMult: 0.6, resolutionDelta: -0.05, note: 'the sick cannot work the fields' },
    siege: { blocksResolution: true, note: 'the blockade stands — no relief can arrive' },
  },
  disease_outbreak: {
    famine: { decayMult: 0.6, resolutionDelta: -0.05, note: 'the hungry sicken faster' },
    mass_migration: { decayMult: 0.75, note: 'crowded camps spread contagion' },
  },
  mass_migration: {
    famine: { decayMult: 0.8, note: 'hunger keeps people on the roads' },
    disease_outbreak: { decayMult: 0.8, note: 'flight from the plague swells the columns' },
  },
  market_shock: {
    indebtedness: { decayMult: 0.7, resolutionDelta: -0.04, note: 'creditors call their debts into the panic' },
  },
  indebtedness: {
    market_shock: { decayMult: 0.7, resolutionDelta: -0.04, note: 'the crash makes every debt unpayable' },
  },
  insurgency: {
    occupation: { decayMult: 0.6, resolutionDelta: -0.06, note: 'occupation feeds the resistance' },
  },
  infiltration: {
    criminal_corridor: { decayMult: 0.75, note: 'the corridor shelters the network' },
  },
  criminal_corridor: {
    infiltration: { decayMult: 0.75, note: 'embedded agents keep the corridor open' },
  },
  coup_detat: {
    succession_void: { decayMult: 0.7, resolutionDelta: -0.05, note: 'an empty line of succession invites the knives' },
    political_fracture: { decayMult: 0.75, resolutionDelta: -0.04, note: 'a paralyzed council cannot rally a defense' },
    rebellion: { decayMult: 0.8, note: 'the streets are already burning — the palace is distracted' },
  },
  political_fracture: {
    coup_detat: { decayMult: 0.8, note: 'the coup deepens the constitutional void' },
  },
  rebellion: {
    coup_detat: { decayMult: 0.85, note: 'the palace fights itself instead of the streets' },
  },
});

const ACTIVE_SYNERGY_STAGES = new Set(['active', 'emerging', 'peaking', 'easing']);

function isActiveCompanion(other) {
  const stage = other?.lifecycleStage
    || (other?.status && other.status !== 'active' ? other.status : 'active');
  return ACTIVE_SYNERGY_STAGES.has(stage);
}

function shareSettlement(a, b) {
  const mine = new Set((a?.affectedSettlementIds || []).map(String));
  return (b?.affectedSettlementIds || []).some(id => mine.has(String(id)));
}

/**
 * Evaluate the authored synergies acting ON one stressor from its co-located
 * companions (echoes participate at memoryStrength-scaled weight when
 * present — a war still in living memory drags, a forgotten one doesn't).
 *
 * @param {any} stressor       the stressor being aged
 * @param {any[]} allStressors the full normalized stressor list this tick
 * @returns {{ decayMult: number, resolutionDelta: number,
 *            blocksResolution: boolean, companions: string[] } | null}
 */
export function synergyAssessment(stressor, allStressors = []) {
  const table = STRESSOR_SYNERGIES[stressor?.type];
  if (!table) return null;
  let decayMult = 1;
  let resolutionDelta = 0;
  let blocksResolution = false;
  const companions = [];

  for (const other of allStressors) {
    if (!other || other === stressor || other.id === stressor.id) continue;
    const entry = table[other.type];
    if (!entry) continue;
    if (!shareSettlement(stressor, other)) continue;
    const isEcho = other.status === 'residual' || other.lifecycleStage === 'residual';
    if (!isEcho && !isActiveCompanion(other)) continue;
    // Weighting: a resolved-but-remembered companion exerts a fraction of its
    // live effect (memoryStrength); a LIVE companion scales with its own
    // severity (full weight from 0.3 up) so a spent, near-zero crisis stops
    // dragging its neighbors.
    const weight = isEcho
      ? clamp01(other.memoryStrength ?? 0)
      : clamp01((other.severity ?? 0) / 0.3);
    if (weight <= 0) continue;
    if (entry.decayMult != null) decayMult *= 1 - (1 - entry.decayMult) * weight;
    if (entry.resolutionDelta) resolutionDelta += entry.resolutionDelta * weight;
    if (entry.blocksResolution && !isEcho) blocksResolution = true;
    companions.push(other.type);
  }

  if (!companions.length) return null;
  return {
    decayMult: Math.max(0.4, decayMult),
    resolutionDelta: Math.max(-0.12, resolutionDelta),
    blocksResolution,
    companions,
  };
}

// ── Origin interpretation: context-conditioned spawn variants ─────────────
// When a stressor is born, the SAME catalog type can be a different story
// depending on who the settlement's neighbors are and what is still in
// recent memory. The interpreter stamps an `originContext` on the newborn
// stressor; variants change hooks, residual flavor, and (for betrayal) seed
// a traitor.
//
// Attacker identity is deliberately NULLABLE: a siege's attacker may be a
// hostile neighbor (auto-stamped), or a force with no settlement at all — a
// goblin warband, a mercenary company — which the DM names via
// `attackerLabel` (setStressorAttacker in stressors.js) when and if they
// decide. Nothing downstream assumes an attacker exists.

const HOSTILE_RANK = Object.freeze({ hostile: 3, cold_war: 2, rival: 1 });
const MEMORY_LOOKBACK_TICKS = 12;

function hostileNeighborsOf(snapshot, settlementId) {
  const id = String(settlementId);
  const out = [];
  for (const edge of snapshot?.regionalGraph?.edges || snapshot?.relationships || []) {
    const from = String(edge?.from ?? '');
    const to = String(edge?.to ?? '');
    if (from !== id && to !== id) continue;
    const type = relationshipTypeOf(edge);
    const rank = HOSTILE_RANK[type];
    if (!rank) continue;
    out.push({ otherId: from === id ? to : from, type, rank });
  }
  // Deterministic: most hostile first, then stable id order. Plain codepoint
  // comparison, NOT localeCompare — this sort picks the war's sponsor, and
  // default-locale collation can reorder non-ASCII ids across machines.
  return out.sort((a, b) => b.rank - a.rank || (a.otherId < b.otherId ? -1 : a.otherId > b.otherId ? 1 : 0));
}

/**
 * A hostility that fizzled but is still in living memory: scan relationship
 * histories for a recent hostile -> something-else label transition touching
 * this settlement. Returns the most recent within the lookback, or null.
 */
function recentHostileMemory(snapshot, settlementId, currentTick) {
  const id = String(settlementId);
  const states = snapshot?.worldState?.relationshipStates || {};
  let best = null;
  for (const edge of snapshot?.regionalGraph?.edges || snapshot?.relationships || []) {
    const from = String(edge?.from ?? '');
    const to = String(edge?.to ?? '');
    if (from !== id && to !== id) continue;
    const key = edge?.id || `rel.${from}.${to}`;
    for (const entry of states[key]?.history || []) {
      if (entry?.fromType !== 'hostile' || entry?.toType === 'hostile') continue;
      const age = currentTick - (entry.tick ?? -Infinity);
      if (!(age >= 0 && age <= MEMORY_LOOKBACK_TICKS)) continue;
      if (!best || entry.tick > best.tick) {
        best = { otherId: from === id ? to : from, tick: entry.tick, ticksAgo: age };
      }
    }
  }
  return best;
}

const WAR_STRESSOR_TYPES = Object.freeze(['siege', 'wartime', 'occupation', 'betrayal']);

// Table-facing hooks per spawn variant — the same catalog type is a
// different adventure depending on who is behind it. Surfaced on the
// stressor card and in the AI chronicle grounding.
export const VARIANT_HOOKS = Object.freeze({
  foreign_sponsored: [
    'A courier carries coin that traces back across the border.',
    'Exposing the sponsor would be a casus belli — if anyone dares name them aloud.',
    'Someone local is living slightly too well for their station.',
  ],
  abandoned_agent: [
    'The handler has gone silent; the last payment never came.',
    'A desperate asset with no patron would trade everything for protection.',
    'Blackmail material is being sold off piecemeal — by someone with nothing left to lose.',
  ],
  internal_conspiracy: [
    'Loyalty tests are spreading through the council like a rash.',
    'The conspirators meet somewhere everyone trusts too much to search.',
  ],
  declared_war: [
    'Their banners are open — but their supply lines are not invulnerable.',
    'A truce party waits for any honest broker.',
  ],
  unattributed: [
    'No banner has been raised. Scouts could put a name to the besiegers.',
    'Whoever it is knew exactly where the walls are weakest.',
  ],
  resistance: [
    'The resistance needs runners, smugglers, and someone who can reach the old garrison.',
    'Collaborators and patriots eat at the same tables.',
  ],
  palace_coup: [
    'Invitations to a private dinner are circulating — the guest list is the conspiracy.',
    'The seals on three official letters do not match the hands that signed them.',
  ],
  barracks_coup: [
    'The garrison drilled at midnight without orders — or with orders no one admits giving.',
    'Officers loyal to the seat are being reassigned to the walls, one by one.',
  ],
  merchant_cabal: [
    'Credit has quietly dried up for anyone aligned with the ruling seat.',
    'A warehouse that never opens has started taking night deliveries.',
  ],
  temple_putsch: [
    'The sermons have changed: obedience to unworthy rulers is suddenly a live question.',
    'Sanctuary has been promised to anyone who "acts according to conscience".',
  ],
  arcane_ascendancy: [
    'Wards around the council hall failed twice this tenday. The casters shrug.',
    'Someone is scrying the seat of power — and wants it known.',
  ],
  council_schism: [
    'A rump session voted itself emergency powers while the chamber stood half empty.',
    'Two officials now claim the same seal, the same office, and the same tax.',
  ],
});

/**
 * Interpret a stressor birth against its settlement's relational context.
 * Returns an originContext to stamp on the newborn stressor, or null when
 * the type has no context-sensitive variants.
 */
export function interpretStressorOrigin(type, settlementId, snapshot, tick = 0) {
  const ctx = interpretOriginContext(type, settlementId, snapshot, tick);
  if (!ctx) return null;
  return { ...ctx, hooks: VARIANT_HOOKS[ctx.variant] || [] };
}

function interpretOriginContext(type, settlementId, snapshot, tick = 0) {
  if (type === 'betrayal') {
    const hostiles = hostileNeighborsOf(snapshot, settlementId);
    if (hostiles.length) {
      return {
        variant: 'foreign_sponsored',
        sponsorSettlementId: hostiles[0].otherId,
        attackerSettlementId: null,
        attackerLabel: null,
        interpretedAtTick: tick,
        reason: `A ${hostiles[0].type.replace(/_/g, ' ')} neighbor has every motive to sponsor treachery.`,
      };
    }
    const memory = recentHostileMemory(snapshot, settlementId, tick);
    if (memory) {
      return {
        variant: 'abandoned_agent',
        sponsorSettlementId: null,
        formerSponsorSettlementId: memory.otherId,
        attackerSettlementId: null,
        attackerLabel: null,
        interpretedAtTick: tick,
        reason: `The hostility that planted this agent ended ${memory.ticksAgo} tick(s) ago — the handler is gone, the asset remains.`,
      };
    }
    return {
      variant: 'internal_conspiracy',
      sponsorSettlementId: null,
      attackerSettlementId: null,
      attackerLabel: null,
      interpretedAtTick: tick,
      reason: 'No hostile neighbor, no recent feud — the knife came from inside.',
    };
  }

  if (['siege', 'wartime', 'occupation'].includes(type)) {
    const hostiles = hostileNeighborsOf(snapshot, settlementId);
    if (hostiles.length && hostiles[0].type === 'hostile') {
      return {
        variant: 'declared_war',
        attackerSettlementId: hostiles[0].otherId,
        attackerLabel: null,
        sponsorSettlementId: hostiles[0].otherId,
        interpretedAtTick: tick,
        reason: 'An openly hostile neighbor explains the pressure.',
      };
    }
    // No settlement-shaped attacker: identity stays null until the DM names
    // the warband / raider host / mystery force via setStressorAttacker.
    return {
      variant: 'unattributed',
      attackerSettlementId: null,
      attackerLabel: null,
      sponsorSettlementId: null,
      interpretedAtTick: tick,
      reason: 'No hostile neighbor claims this — the attacker is unnamed until the DM says otherwise.',
    };
  }

  if (type === 'insurgency') {
    const occupied = (snapshot?.worldState?.stressors || []).some(s =>
      s?.type === 'occupation'
      && !['resolved', 'dormant', 'residual'].includes(s.status)
      && (s.affectedSettlementIds || []).map(String).includes(String(settlementId)));
    if (occupied) {
      return {
        variant: 'resistance',
        attackerSettlementId: null,
        attackerLabel: null,
        sponsorSettlementId: null,
        interpretedAtTick: tick,
        reason: 'Born under occupation: this is a resistance, not a mere revolt.',
      };
    }
  }

  if (type === 'coup_detat') {
    const entry = snapshot?.byId?.get?.(String(settlementId));
    const contest = coupContenders(entry?.settlement);
    const leading = contest.challengers[0] || null;
    const variant = (leading && COUP_VARIANT_BY_ARCHETYPE[leading.archetype]) || 'palace_coup';
    // A hostile neighbor bankrolling the plot is sponsorship, not a separate
    // variant — the conspiracy's CHARACTER comes from who leads it.
    const hostiles = hostileNeighborsOf(snapshot, settlementId);
    const sponsor = hostiles.length ? hostiles[0].otherId : null;
    return {
      variant,
      sponsorSettlementId: sponsor,
      attackerSettlementId: null,
      attackerLabel: null,
      interpretedAtTick: tick,
      // Birth-time field snapshot — NARRATIVE only. The verdict recomputes
      // contenders from live state (the whole point of the brewing window is
      // that party/user action can change the field before the knives move).
      contenders: contest.challengers.map(c => ({
        name: c.name, archetype: c.archetype, power: c.power, weight: c.weight,
      })),
      incumbent: { ...contest.incumbent },
      reason: [
        leading
          ? `${leading.name} leads the conspiracy; the field: ${contest.challengers.map(c => c.name).join(', ')}.`
          : 'The conspiracy is still choosing its champion.',
        contest.incumbent.gated
          ? `${contest.incumbent.name || 'The seat'} can still present a case (weight ${contest.incumbent.amplifiedWeight} at ×${contest.incumbent.govMultiplier} legitimacy).`
          : `${contest.incumbent.name || 'The seat'}'s amplified standing no longer ranks among the top three powers — its case will not even be heard.`,
        ...(sponsor ? ['Foreign coin moves beneath it — a hostile neighbor is bankrolling the plot.'] : []),
      ].join(' '),
    };
  }

  return null;
}

// Which conspiracy a coup reads as, by the leading challenger's archetype.
const COUP_VARIANT_BY_ARCHETYPE = Object.freeze({
  military: 'barracks_coup',
  merchant: 'merchant_cabal',
  religious: 'temple_putsch',
  noble: 'palace_coup',
  arcane: 'arcane_ascendancy',
  government: 'council_schism',
  civic: 'council_schism',
});

/**
 * A hostile relationship de-escalated: wind down the war-shaped stressors it
 * sponsored. Severity drops sharply (below the structural gate where
 * applicable) so the next aging tick can actually end them — wars end when
 * the WAR ends, not when severity bleeds out at 0.02/tick.
 *
 * @returns {{ worldState: any, woundDown: any[] }}
 */
export function windDownSponsoredStressors(worldState, edge, { tick = 0, now = null, toType = null } = {}) {
  const a = String(edge?.from ?? '');
  const b = String(edge?.to ?? '');
  if (!a || !b) return { worldState, woundDown: [] };
  const woundDown = [];
  const stressors = (worldState?.stressors || []).map(stressor => {
    if (!WAR_STRESSOR_TYPES.includes(stressor?.type)) return stressor;
    if (['resolved', 'dormant', 'residual'].includes(stressor?.status)) return stressor;
    const ctx = stressor?.originContext || {};
    const sponsor = String(ctx.sponsorSettlementId ?? ctx.attackerSettlementId ?? '');
    if (!sponsor || (sponsor !== a && sponsor !== b)) return stressor;
    const otherSide = sponsor === a ? b : a;
    const touchesOther = String(stressor.originSettlementId ?? '') === otherSide
      || (stressor.affectedSettlementIds || []).map(String).includes(otherSide);
    if (!touchesOther) return stressor;
    // The drop must land BELOW the structural resolution gate (0.25) — a
    // 0.9 siege "wound down" to 0.5 would keep grinding for dozens of ticks,
    // which is exactly the wars-never-end failure this exists to fix.
    const next = {
      ...stressor,
      severity: Math.max(0.05, Math.min(0.2, (stressor.severity ?? 0) - 0.4)),
      updatedAt: now || stressor.updatedAt,
      originContext: { ...ctx, windDown: { tick, toType, reason: 'The sponsoring hostility de-escalated.' } },
    };
    woundDown.push(next);
    return next;
  });
  if (!woundDown.length) return { worldState, woundDown };
  return { worldState: { ...worldState, stressors }, woundDown };
}

/**
 * The mirror handshake: a sponsored war-stressor RESOLVING writes an incident
 * back onto the relationship edge, feeding relationshipMemory (which finally
 * gets a second mechanical producer).
 */
export function recordWarResolutionIncidents(worldState, regionalGraph, resolvedStressors = [], tick = 0) {
  let states = worldState?.relationshipStates || {};
  let changed = false;
  for (const stressor of resolvedStressors) {
    const ctx = stressor?.originContext || {};
    const sponsor = String(ctx.sponsorSettlementId ?? ctx.attackerSettlementId ?? '');
    if (!sponsor) continue;
    const origin = String(stressor.originSettlementId ?? (stressor.affectedSettlementIds || [])[0] ?? '');
    if (!origin) continue;
    for (const edge of regionalGraph?.edges || []) {
      const from = String(edge?.from ?? '');
      const to = String(edge?.to ?? '');
      const touches = (from === sponsor && to === origin) || (from === origin && to === sponsor);
      if (!touches) continue;
      const key = edge?.id || `rel.${from}.${to}`;
      const prev = states[key];
      if (!prev) continue;
      const incident = {
        tick,
        type: `stressor_resolved:${stressor.type}`,
        severity: Math.max(0.3, Math.min(0.8, stressor.peakSeverity ?? stressor.severity ?? 0.4)),
      };
      states = {
        ...states,
        [key]: {
          ...prev,
          recentIncidents: [...(prev.recentIncidents || []), incident].slice(-8),
        },
      };
      changed = true;
    }
  }
  return changed ? { ...worldState, relationshipStates: states } : worldState;
}
