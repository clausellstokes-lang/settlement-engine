import { TIER_ORDER } from '../../data/constants.js';
import { truncateAtWord } from '../../lib/text.js';
import {
  ensureRelationshipState,
  getRelationshipSettlements,
  normalizeRelationshipEdge,
  relationshipKeyFromEdge,
  relationshipRoles,
} from './relationshipEvolution.js';

export const RELATIONSHIP_MEMORY_HALF_LIFE_TICKS = 4;
export const RELATIONSHIP_MEMORY_MAX_LOOKBACK_TICKS = 24;
export const RELATIONSHIP_MEMORY_MAX_CONTEXT_RELATIONSHIPS = 6;
export const RELATIONSHIP_MEMORY_MAX_CONTEXT_MEMORIES = 3;

/**
 * Local structural typedefs. relationshipEvolution.js (the state factory) is
 * still untyped, so the shapes are declared here from the fields this module
 * actually reads; they belong in relationshipEvolution.js once it is typed.
 *
 * @typedef {Object} RelState  per-relationship evolution state (ensureRelationshipState output)
 * @property {string} relationshipType
 * @property {number} trust
 * @property {number} resentment
 * @property {number} dependency
 * @property {number} leverage
 * @property {number} pactStrength
 * @property {number} fear
 * @property {number} tradeBalance
 * @property {number} obligationFatigue
 * @property {number} militaryBurden
 * @property {number} overlordWeaknessStreak
 * @property {RawMemoryRecord[]=} recentIncidents
 * @property {RawMemoryRecord[]=} hierarchyResolutions
 * @property {RawMemoryRecord[]=} history
 * @property {PersistedMemoryBlob=} relationshipMemory
 *
 * @typedef {Object} RawMemoryRecord  loose incident/history/outcome row feeding memoryEntry
 * @property {(number|null)=} tick
 * @property {number=} severity
 * @property {{ severity?: number }=} outcome
 * @property {string=} type
 * @property {string=} candidateType
 * @property {string=} ruleId
 * @property {string=} summary
 * @property {string=} headline
 * @property {string=} reason
 * @property {string=} label
 * @property {string=} outcomeId
 *
 * @typedef {Object} MemoryEntry  scored, decayed memory row
 * @property {(number|null|undefined)} tick
 * @property {string} type
 * @property {string} label
 * @property {string} summary
 * @property {number} severity
 * @property {number} weight
 * @property {number} score
 *
 * @typedef {{ trade: number, security: number, authority: number, information: number, tribute: number }} FlowProfile
 *
 * @typedef {Object} PersistedMemoryBlob  the stamp refreshRelationshipMemory writes
 * @property {string} posture
 * @property {string=} postureLabel
 * @property {number} score
 * @property {number} dailyLifeWeight
 * @property {number=} asymmetry
 * @property {FlowProfile=} flowProfile
 * @property {MemoryEntry[]=} recentMemory
 * @property {string[]=} reasons
 *
 * @typedef {{ legacyRelationshipType?: (string|null) }} RelEdge  normalized edge (only the field read here)
 *
 * @typedef {Object} PostureRow  one relationship posture (build output)
 * @property {string} relationshipKey
 * @property {string} from
 * @property {string} to
 * @property {string} relationshipType
 * @property {(string|null)} legacyRelationshipType
 * @property {string} posture
 * @property {string} postureLabel
 * @property {number} memoryScore
 * @property {number} dailyLifeWeight
 * @property {number} asymmetry
 * @property {FlowProfile} flowProfile
 * @property {MemoryEntry[]} recentMemory
 * @property {string[]} reasons
 * @property {string[]} practicalEffects
 * @property {RelEdge} edge
 * @property {boolean=} persisted
 *
 * @typedef {Object} SnapshotItem  world-snapshot per-settlement row (fields read here)
 * @property {string=} name
 * @property {string=} tier
 * @property {{ tier?: string, population?: number | { total?: number } }=} settlement
 * @property {{ scores?: Record<string, number> }=} causal
 *
 * @typedef {{ byId?: Map<string, SnapshotItem>, regionalGraph?: { edges?: unknown[] }, relationships?: unknown[] }} SnapshotLike
 *
 * @typedef {{ id?: string, name?: string, settlement?: { id?: string, name?: string } }} SaveLike
 */

/** @type {(value: unknown) => number} */
const clamp01 = (value) => Math.max(0, Math.min(1, Number(value) || 0));

/** @type {(value: unknown) => number} */
const round2 = (value) => Math.round((Number(value) || 0) * 100) / 100;

/** @type {Readonly<Record<string, number>>} */
const TYPE_DAILY_LIFE_BASE = Object.freeze({
  neutral: 0.08,
  trade_partner: 0.34,
  allied: 0.42,
  patron: 0.5,
  client: 0.48,
  vassal: 0.62,
  rival: 0.34,
  cold_war: 0.7,
  hostile: 0.78,
  criminal_network: 0.48,
});

/** @type {Readonly<Record<string, string>>} */
const POSTURE_LABELS = Object.freeze({
  stable_neutral: 'stable neutral posture',
  open_neutral: 'open but uncommitted neutral posture',
  open_trade: 'open trade posture',
  strained_trade: 'strained trade posture',
  protective_alliance: 'protective alliance posture',
  strained_alliance: 'strained alliance posture',
  protective_patronage: 'protective patronage posture',
  coercive_patronage: 'coercive patronage posture',
  stable_vassalage: 'stable vassalage posture',
  coercive_subject: 'coercive subject posture',
  rebellious_subject: 'rebellious subject posture',
  managed_rivalry: 'managed rivalry posture',
  escalating_rivalry: 'escalating rivalry posture',
  covert_pressure: 'covert cold-war posture',
  sanctions_posture: 'sanctions posture',
  open_hostility: 'open hostility posture',
  war_exhaustion: 'war-exhaustion posture',
  covert_corridor: 'covert criminal-corridor posture',
});

/**
 * @param {unknown} value
 * @param {number} [max]
 * @returns {string}
 */
function clipText(value, max = 220) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  // Word-boundary truncation — a hard slice left mid-word fragments in
  // persisted memory summaries and AI context payloads.
  return truncateAtWord(text, max, '...');
}

/**
 * @param {string | null | undefined} type
 * @returns {string}
 */
function titleForType(type) {
  return String(type || 'neutral').replace(/_/g, ' ');
}

/**
 * @param {SnapshotItem | null | undefined} item
 * @returns {number}
 */
function tierRank(item) {
  const tier = item?.settlement?.tier || item?.tier || 'village';
  const rank = TIER_ORDER.indexOf(tier);
  return rank >= 0 ? rank : TIER_ORDER.indexOf('village');
}

/**
 * @param {SnapshotItem | null | undefined} item
 * @returns {number}
 */
function population(item) {
  const pop = item?.settlement?.population;
  if (typeof pop === 'number') return pop;
  if (pop && typeof pop.total === 'number') return pop.total;
  return 0;
}

/**
 * @param {SnapshotItem | null | undefined} item
 * @returns {number}
 */
function settlementPower(item) {
  if (!item) return 0.35;
  const popScore = Math.min(1, Math.log10(Math.max(10, population(item))) / 5);
  const tierScore = tierRank(item) / Math.max(1, TIER_ORDER.length - 1);
  const scores = item.causal?.scores || {};
  const economy = (scores.trade_connectivity ?? 50) / 100;
  const defense = (scores.defense_readiness ?? 50) / 100;
  const legitimacy = (scores.public_legitimacy ?? 50) / 100;
  return clamp01(tierScore * 0.38 + popScore * 0.18 + economy * 0.18 + defense * 0.16 + legitimacy * 0.1);
}

/**
 * @param {SnapshotLike | null | undefined} snapshot
 * @param {string | number} saveId
 * @returns {SnapshotItem | null}
 */
function itemFor(snapshot, saveId) {
  return snapshot?.byId?.get?.(String(saveId)) || null;
}

/**
 * @param {{ snapshot?: SnapshotLike | null, savedSettlements?: SaveLike[], saveId: string | number }} args
 * @returns {string}
 */
function nameFor({ snapshot, savedSettlements, saveId }) {
  const id = String(saveId);
  const item = itemFor(snapshot, id);
  if (item?.name) return item.name;
  const save = (savedSettlements || []).find(s => String(s.id || s.settlement?.id) === id);
  return save?.name || save?.settlement?.name || id;
}

/**
 * @param {number | null | undefined} eventTick
 * @param {number | null | undefined} [currentTick]
 * @param {{ halfLifeTicks?: number, maxLookbackTicks?: number }} [options]
 * @returns {number} 0..1 decay weight; 0.35 flat prior when the event has no tick
 */
export function relationshipMemoryWeight(
  eventTick,
  currentTick = 0,
  {
    halfLifeTicks = RELATIONSHIP_MEMORY_HALF_LIFE_TICKS,
    maxLookbackTicks = RELATIONSHIP_MEMORY_MAX_LOOKBACK_TICKS,
  } = {},
) {
  if (!Number.isFinite(eventTick)) return 0.35;
  // Number.isFinite is not a type-guard in the TS lib; the early return above guarantees a number
  const age = Math.max(0, Number(currentTick || 0) - /** @type {number} */ (eventTick));
  if (age > maxLookbackTicks) return 0;
  return clamp01(Math.pow(0.5, age / Math.max(1, halfLifeTicks)));
}

/**
 * @param {RawMemoryRecord | null | undefined} raw
 * @param {number | null | undefined} currentTick
 * @param {string} [fallbackType]
 * @returns {MemoryEntry | null} null when the memory has fully decayed
 */
function memoryEntry(raw, currentTick, fallbackType) {
  // Number.isFinite(raw?.tick) === true guarantees raw is non-null here; the lib signature is not a type-guard
  const tick = Number.isFinite(raw?.tick) ? /** @type {any} */ (raw).tick : null;
  const severity = clamp01(raw?.severity ?? raw?.outcome?.severity ?? 0.45);
  const weight = relationshipMemoryWeight(tick, currentTick);
  if (weight <= 0) return null;
  const type = raw?.type || raw?.candidateType || raw?.ruleId || fallbackType || 'relationship_memory';
  const summary = raw?.summary || raw?.headline || raw?.reason || raw?.label || `${titleForType(type)} affected the relationship.`;
  return {
    tick,
    type,
    label: titleForType(type),
    summary: clipText(summary),
    severity: round2(severity),
    weight: round2(weight),
    score: round2(severity * weight),
  };
}

/**
 * @param {{
 *   worldState?: {
 *     proposals?: Array<{ status?: string, outcome?: { id?: string } }>,
 *     pulseHistory?: Array<{ tick?: number, selectedOutcomes?: Array<RawMemoryRecord & { relationshipKey?: string, applyMode?: string, id?: string, metadata?: { incidentType?: string }, proposalPayload?: { kind?: string } }> }>,
 *   } | null,
 *   relationshipKey: string,
 *   relState: RelState,
 *   currentTick: number | null | undefined,
 * }} args
 * @returns {MemoryEntry[]} top-8 scored memories, strongest first
 */
function collectRelationshipMemories({ worldState, relationshipKey, relState, currentTick }) {
  /** @type {MemoryEntry[]} */
  const out = [];
  // One world event lands in up to THREE stores: applyRelationshipPatch writes
  // a recentIncidents row AND (for label changes) a history row, while the
  // pulse record keeps the outcome itself in pulseHistory.selectedOutcomes —
  // and a hierarchy resolution writes incident + history + hierarchyResolutions
  // in one call. Each event must score ONCE (double/triple-counting saturated
  // memoryScore — one modest incident read as an escalating rivalry). The
  // pulse outcome claims its identities first because it alone carries BOTH
  // the incident identity (metadata.incidentType || candidateType — exactly
  // what applyRelationshipPatch persists on the incident row) and the label
  // payload (a label change also claims tick + 'label_proposal_applied', the
  // history row's type; the exclusive `label:` conflict tag guarantees at most
  // one label change per relationship per tick, so the pair is unambiguous).
  // The tick+type join breaks for the LAG case — a label proposal selected at
  // tick T but accepted at T' writes its incident/history rows at T' — so
  // applyRelationshipPatch stamps the outcome id onto those rows and the
  // outcome id joins FIRST, regardless of which tick the rows landed on.
  // The per-relationship stores then fill in only events the pulse window no
  // longer covers (party incidents, war resolutions, truncated history).
  /** @type {Set<string>} */
  const seen = new Set();
  /** @type {(tick: number | null | undefined, type: string | null | undefined) => (string | null)} */
  const keyFor = (tick, type) => (Number.isFinite(tick) && type ? `${tick}:${type}` : null);
  /** @type {(id: string | null | undefined) => (string | null)} */
  const outcomeKeyFor = (id) => (id ? `outcome:${id}` : null);
  /** @type {(entry: MemoryEntry | null, keys: Array<string | null>) => void} */
  const add = (entry, keys) => {
    if (!entry) return;
    /** @type {string[]} */
    // filter(Boolean) removes the nulls; TS does not narrow the built-in Boolean callback
    const valid = /** @type {string[]} */ (keys.filter(Boolean));
    if (valid.some(key => seen.has(key))) return;
    for (const key of valid) seen.add(key);
    out.push(entry);
  };

  // Honest memory (S3): a 'proposal'-mode outcome in pulseHistory is a
  // QUESTION the pulse asked, not an event that happened — pending and
  // dismissed proposals must score nothing. Application is recorded twice:
  // accepting stamps the proposal row 'applied' (worldState.proposals), and
  // the apply-time writes stamp the outcome id onto every incident/history/
  // hierarchy row (R3). Either marker admits the outcome; auto outcomes
  // applied at selection and need no marker.
  /** @type {Set<string | undefined>} */
  const appliedMarkers = new Set();
  for (const proposal of worldState?.proposals || []) {
    if (proposal?.status === 'applied' && proposal?.outcome?.id) appliedMarkers.add(proposal.outcome.id);
  }
  for (const store of [relState.recentIncidents, relState.hierarchyResolutions, relState.history]) {
    for (const row of store || []) {
      if (row?.outcomeId) appliedMarkers.add(row.outcomeId);
    }
  }

  for (const pulse of worldState?.pulseHistory || []) {
    const pulseTick = Number.isFinite(pulse?.tick) ? pulse.tick : null;
    for (const outcome of pulse?.selectedOutcomes || []) {
      if (outcome?.relationshipKey !== relationshipKey) continue;
      if (outcome?.applyMode === 'proposal' && !appliedMarkers.has(outcome?.id)) continue;
      const tick = Number.isFinite(outcome?.tick) ? outcome.tick : pulseTick;
      const incidentType = outcome?.metadata?.incidentType || outcome?.candidateType;
      const entry = memoryEntry({
        ...outcome,
        tick,
        // Carry the incident-level type so the kept entry reads like the
        // incident row it supersedes ('raid'), not the outcome family
        // ('relationship').
        type: incidentType || outcome?.type,
      }, currentTick, outcome?.candidateType || 'pulse_outcome');
      add(entry, [
        outcomeKeyFor(outcome?.id),
        keyFor(tick, incidentType),
        outcome?.proposalPayload?.kind === 'relationship_label_change' ? keyFor(tick, 'label_proposal_applied') : null,
      ]);
    }
  }
  for (const incident of relState.recentIncidents || []) {
    const entry = memoryEntry(incident, currentTick, 'recent_incident');
    add(entry, [outcomeKeyFor(incident?.outcomeId), keyFor(incident?.tick, incident?.type)]);
  }
  // hierarchyResolutions before history: both stores carry the SAME
  // 'hierarchy_resolution' row, and the dedicated store's entry (severity
  // default 0.74) is the richer record when the incident buffer evicted it.
  for (const item of relState.hierarchyResolutions || []) {
    const entry = memoryEntry({ severity: 0.74, ...item }, currentTick, 'hierarchy_resolution');
    add(entry, [outcomeKeyFor(item?.outcomeId), keyFor(item?.tick, item?.type || 'hierarchy_resolution')]);
  }
  for (const item of relState.history || []) {
    const entry = memoryEntry({ severity: 0.62, ...item }, currentTick, 'relationship_history');
    add(entry, [outcomeKeyFor(item?.outcomeId), keyFor(item?.tick, item?.type)]);
  }
  return out.sort((a, b) => b.score - a.score).slice(0, 8);
}

/**
 * @param {string} type
 * @param {RelState} relState
 * @returns {FlowProfile}
 */
function flowProfile(type, relState) {
  const trust = clamp01(relState.trust);
  const resentment = clamp01(relState.resentment);
  const dependency = clamp01(relState.dependency);
  const leverage = clamp01(relState.leverage);
  const pact = clamp01(relState.pactStrength);
  switch (type) {
    case 'trade_partner':
      return { trade: round2(0.45 + trust * 0.35), security: 0.1, authority: 0, information: 0.35, tribute: 0 };
    case 'allied':
      return { trade: round2(0.25 + trust * 0.25), security: round2(0.45 + pact * 0.4), authority: 0.08, information: 0.48, tribute: 0 };
    case 'patron':
      return { trade: round2(0.18 + dependency * 0.22), security: round2(0.22 + pact * 0.26), authority: round2(0.42 + leverage * 0.34), information: 0.28, tribute: round2(0.24 + dependency * 0.38) };
    case 'vassal':
      return { trade: round2(0.12 + dependency * 0.18), security: round2(0.3 + pact * 0.36), authority: round2(0.58 + leverage * 0.34), information: 0.42, tribute: round2(0.48 + dependency * 0.34) };
    case 'rival':
      return { trade: round2(-0.12 - resentment * 0.22), security: round2(-0.18 - resentment * 0.24), authority: -0.12, information: 0.2, tribute: 0 };
    case 'cold_war':
      return { trade: round2(-0.22 - resentment * 0.2), security: round2(-0.28 - relState.fear * 0.24), authority: -0.18, information: 0.52, tribute: 0 };
    case 'hostile':
      return { trade: round2(-0.42 - resentment * 0.18), security: round2(-0.5 - relState.fear * 0.28), authority: -0.34, information: 0.18, tribute: 0 };
    case 'criminal_network':
      return { trade: round2(0.08 - resentment * 0.12), security: round2(-0.2 - relState.fear * 0.18), authority: round2(-0.08 + leverage * 0.18), information: 0.46, tribute: round2(leverage * 0.22) };
    default:
      return { trade: round2(0.05 + trust * 0.08), security: 0.03, authority: 0, information: 0.08, tribute: 0 };
  }
}

/**
 * @param {string} type
 * @param {RelState} relState
 * @param {number} memoryScore
 * @returns {string} a POSTURE_LABELS key
 */
function classifyPosture(type, relState, memoryScore) {
  if (type === 'neutral') return relState.trust > 0.55 ? 'open_neutral' : 'stable_neutral';
  if (type === 'trade_partner') return relState.resentment > 0.34 || relState.tradeBalance < 0.38 ? 'strained_trade' : 'open_trade';
  if (type === 'allied') return relState.obligationFatigue > 0.45 || relState.resentment > 0.28 ? 'strained_alliance' : 'protective_alliance';
  if (type === 'patron' || type === 'client') return relState.resentment > 0.5 || relState.fear > 0.45 ? 'coercive_patronage' : 'protective_patronage';
  if (type === 'vassal') {
    if (relState.resentment > 0.64 || relState.overlordWeaknessStreak >= 2) return 'rebellious_subject';
    if (relState.fear > 0.5 || relState.leverage > 0.75) return 'coercive_subject';
    return 'stable_vassalage';
  }
  if (type === 'rival') return relState.resentment > 0.62 || memoryScore > 0.5 ? 'escalating_rivalry' : 'managed_rivalry';
  if (type === 'cold_war') return relState.tradeBalance < 0.24 || relState.leverage > 0.5 ? 'sanctions_posture' : 'covert_pressure';
  if (type === 'hostile') return relState.militaryBurden > 0.45 || relState.trust > 0.16 ? 'war_exhaustion' : 'open_hostility';
  if (type === 'criminal_network') return 'covert_corridor';
  return 'stable_neutral';
}

/**
 * @param {string} type
 * @param {RelState} relState
 * @param {MemoryEntry[]} memories
 * @param {number} asymmetry
 * @returns {string[]}
 */
function postureReasons(type, relState, memories, asymmetry) {
  /** @type {string[]} */
  const out = [];
  if (memories[0]) out.push(`Recent memory: ${memories[0].summary}`);
  if (relState.resentment > 0.5) out.push(`High resentment (${relState.resentment.toFixed(2)}) shapes the posture.`);
  if (relState.trust > 0.65) out.push(`High trust (${relState.trust.toFixed(2)}) keeps the relationship functional.`);
  if (relState.dependency > 0.6) out.push(`Dependency (${relState.dependency.toFixed(2)}) makes the relationship materially unequal.`);
  if (Math.abs(asymmetry) > 0.22) {
    out.push(asymmetry > 0
      ? 'The source settlement has the stronger structural position.'
      : 'The target settlement has the stronger structural position.');
  }
  if (!out.length) out.push(`${titleForType(type)} relationship is currently quiet.`);
  return out.slice(0, 4);
}

/**
 * @param {string} type
 * @param {string} posture
 * @returns {string[]}
 */
function practicalEffects(type, posture) {
  if (type === 'trade_partner') return posture === 'strained_trade'
    ? ['Merchants price risk into contracts.', 'Caravans delay departures or seek alternate routes.', 'Market gossip tracks shortages and favors.']
    : ['Caravans and market factors move with confidence.', 'Imported goods feel routine rather than exceptional.'];
  if (type === 'allied') return posture === 'strained_alliance'
    ? ['Envoys ask what the alliance still costs.', 'Patrols share news but count supplies carefully.', 'Common folk hear rumors of obligation fatigue.']
    : ['Messengers and scouts move openly.', 'Militia talk assumes help can arrive.', 'Shared threats shape watch routines.'];
  if (type === 'patron' || type === 'client') return posture === 'coercive_patronage'
    ? ['Tax collectors, creditors, or inspectors are more visible.', 'Local elites measure speech around patron interests.', 'Protection feels mixed with pressure.']
    : ['Patron protection keeps roads and contracts steadier.', 'Client leaders frame concessions as practical necessity.'];
  if (type === 'vassal') return posture === 'rebellious_subject'
    ? ['Tribute and levy talk makes daily life tense.', 'Local leaders quietly test autonomy.', 'Overlord weakness becomes tavern arithmetic.']
    : ['Tribute schedules, legal obligations, and patrol expectations shape ordinary routines.', 'People distinguish local custom from overlord command.'];
  if (type === 'rival') return posture === 'escalating_rivalry'
    ? ['Craftsmen and merchants compare prices like weapons.', 'Prestige contests spill into rumor and recruitment.', 'Border incidents feel possible.']
    : ['Competition is sharp but not yet ruinous.', 'People watch the rival as a measuring stick.'];
  if (type === 'cold_war') return posture === 'sanctions_posture'
    ? ['Sanctions, inspections, and quiet embargoes touch the market day.', 'Agents and informants matter more than soldiers.', 'Travelers get questioned twice.']
    : ['Rumors, coded messages, and cautious patrols shape the mood.', 'The conflict is present even when no banners move.'];
  if (type === 'hostile') return posture === 'war_exhaustion'
    ? ['People still fear raids, but exhaustion makes truce talk plausible.', 'Supply clerks and guards count losses before glory.']
    : ['Watch patrols, road checks, and defensive routines dominate public life.', 'Households keep one ear turned toward the border.'];
  if (type === 'criminal_network') return ['Smuggling, favors, and protection money distort ordinary commerce.', 'People know which doors are safer left unopened.'];
  return ['Regional politics stays mostly background noise today.'];
}

// Read side of the persisted posture family. refreshRelationshipMemory stamps
// a `relationshipMemory` blob onto every relationshipState each pulse; when a
// reader opts in (preferPersisted), the blob is rehydrated into a posture row
// instead of recomputing — that read is what earns the field family its
// persistence. Returns null (recompute fallback) for legacy saves that predate
// the stamp or carry an unrecognizable posture.
/**
 * @param {RelState} relState
 * @param {RelEdge} edge
 * @param {string} relationshipKey
 * @param {string | number} from
 * @param {string | number} to
 * @returns {PostureRow | null}
 */
function persistedPostureRow(relState, edge, relationshipKey, from, to) {
  const blob = relState?.relationshipMemory;
  if (!blob || typeof blob !== 'object') return null;
  if (!POSTURE_LABELS[blob.posture]) return null;
  if (!Number.isFinite(blob.score) || !Number.isFinite(blob.dailyLifeWeight)) return null;
  const type = relState.relationshipType;
  return {
    relationshipKey,
    from: String(from),
    to: String(to),
    relationshipType: type,
    legacyRelationshipType: edge.legacyRelationshipType || null,
    posture: blob.posture,
    postureLabel: blob.postureLabel || POSTURE_LABELS[blob.posture],
    memoryScore: round2(clamp01(blob.score)),
    dailyLifeWeight: round2(clamp01(blob.dailyLifeWeight)),
    asymmetry: round2(blob.asymmetry ?? 0),
    flowProfile: blob.flowProfile || flowProfile(type, relState),
    recentMemory: Array.isArray(blob.recentMemory) ? blob.recentMemory : [],
    reasons: Array.isArray(blob.reasons) && blob.reasons.length
      ? blob.reasons
      : [`${titleForType(type)} relationship posture restored from the campaign record.`],
    practicalEffects: practicalEffects(type, blob.posture),
    edge,
    persisted: true,
  };
}

/**
 * @param {{ worldState?: any, regionalGraph?: any, snapshot?: any, currentTick?: number|null, preferPersisted?: boolean }} [args]
 * @returns {PostureRow[]} sorted by dailyLifeWeight, strongest first
 */
export function buildRelationshipPostures({ worldState = {}, regionalGraph = {}, snapshot = null, currentTick = null, preferPersisted = false } = {}) {
  const tick = Number.isFinite(currentTick) ? currentTick : Number(worldState?.tick) || 0;
  const states = worldState?.relationshipStates || {};
  const edges = regionalGraph?.edges || snapshot?.regionalGraph?.edges || snapshot?.relationships || [];
  /** @type {PostureRow[]} */
  const postures = [];

  for (const rawEdge of edges) {
    const relationshipKey = relationshipKeyFromEdge(rawEdge);
    const edge = normalizeRelationshipEdge(rawEdge);
    // ensureRelationshipState returns the fuller RelationshipState; this module
    // reads its incident/history/hierarchy stores through the richer RelState
    // memory-view (RawMemoryRecord rows), so surface it as RelState here and
    // hand the raw state back to relationshipRoles (which reads overlord/patron ids).
    const relState = /** @type {RelState} */ (/** @type {unknown} */ (ensureRelationshipState(edge, states[relationshipKey])));
    const rawSettlements = getRelationshipSettlements(edge);
    if (!rawSettlements.from || !rawSettlements.to) continue;
    // H16: when a subjugation/patronage crowned the edge's authored 'to' side
    // the senior party is stamped on the STATE — present senior-first like
    // every other hierarchy edge so direction summaries stay truthful.
    const roles = relationshipRoles(edge, /** @type {import('./relationshipEvolution.js').RelationshipState} */ (/** @type {unknown} */ (relState)));
    const from = roles.reversed ? roles.seniorId : String(rawSettlements.from);
    const to = roles.reversed ? roles.juniorId : String(rawSettlements.to);
    if (preferPersisted) {
      const persisted = persistedPostureRow(relState, edge, relationshipKey, from, to);
      if (persisted) {
        postures.push(persisted);
        continue;
      }
    }
    const memories = collectRelationshipMemories({ worldState, relationshipKey, relState, currentTick: tick });
    const memoryScore = clamp01(memories.reduce((sum, item) => sum + item.score, 0));
    const type = relState.relationshipType;
    const posture = classifyPosture(type, relState, memoryScore);
    const asymmetry = round2(settlementPower(itemFor(snapshot, from)) - settlementPower(itemFor(snapshot, to)));
    const flow = flowProfile(type, relState);
    const reasons = postureReasons(type, relState, memories, asymmetry);
    const dailyLifeWeight = clamp01((TYPE_DAILY_LIFE_BASE[type] ?? 0.12) + memoryScore * 0.35 + Math.max(0, relState.resentment - 0.35) * 0.18);

    postures.push({
      relationshipKey,
      from: String(from),
      to: String(to),
      relationshipType: type,
      legacyRelationshipType: edge.legacyRelationshipType || null,
      posture,
      postureLabel: POSTURE_LABELS[posture] || titleForType(posture),
      memoryScore: round2(memoryScore),
      dailyLifeWeight: round2(dailyLifeWeight),
      asymmetry,
      flowProfile: flow,
      recentMemory: memories,
      reasons,
      practicalEffects: practicalEffects(type, posture),
      edge,
    });
  }

  return postures.sort((a, b) => b.dailyLifeWeight - a.dailyLifeWeight);
}

/**
 * @param {any} [worldState]
 * @param {any} [regionalGraph]
 * @param {any} [snapshot]
 * @param {{ currentTick?: number|null }} [options]
 * @returns {any}
 */
export function refreshRelationshipMemory(worldState = {}, regionalGraph = {}, snapshot = null, options = {}) {
  const postures = buildRelationshipPostures({
    worldState,
    regionalGraph,
    snapshot,
    currentTick: options.currentTick,
  });
  const relationshipStates = { ...(worldState?.relationshipStates || {}) };
  for (const posture of postures) {
    const current = ensureRelationshipState(posture.edge, relationshipStates[posture.relationshipKey]);
    const relationshipMemory = {
      posture: posture.posture,
      postureLabel: posture.postureLabel,
      score: posture.memoryScore,
      dailyLifeWeight: posture.dailyLifeWeight,
      flowProfile: posture.flowProfile,
      asymmetry: posture.asymmetry,
      recentMemory: posture.recentMemory.slice(0, 4).map(({ tick, type, label, summary, severity, weight }) => ({
        tick,
        type,
        label,
        summary,
        severity,
        weight,
      })),
      reasons: posture.reasons,
      updatedAtTick: Number.isFinite(options.currentTick) ? options.currentTick : worldState?.tick ?? null,
    };
    relationshipStates[posture.relationshipKey] = {
      ...current,
      posture: posture.posture,
      memoryScore: posture.memoryScore,
      dailyLifeWeight: posture.dailyLifeWeight,
      postureUpdatedAtTick: relationshipMemory.updatedAtTick,
      postureReasons: posture.reasons,
      relationshipMemory,
    };
  }
  return { ...worldState, relationshipStates };
}

/**
 * @param {PostureRow} posture
 * @param {string | number} settlementId
 * @returns {string}
 */
function directionFor(posture, settlementId) {
  const id = String(settlementId);
  if (posture.from === id && posture.to === id) return 'self';
  if (posture.from === id) {
    if (posture.relationshipType === 'vassal') return 'overlord_to_vassal';
    if (posture.relationshipType === 'patron') return 'patron_to_client';
    return 'outgoing';
  }
  if (posture.to === id) {
    if (posture.relationshipType === 'vassal') return 'vassal_to_overlord';
    if (posture.relationshipType === 'patron') return 'client_to_patron';
    return 'incoming';
  }
  return 'indirect';
}

/**
 * @param {PostureRow} posture
 * @param {string | number} settlementId
 * @param {string} otherName
 * @returns {string}
 */
function entrySummary(posture, settlementId, otherName) {
  const direction = directionFor(posture, settlementId);
  if (direction === 'overlord_to_vassal') return `${otherName} is a vassal under a ${posture.postureLabel}.`;
  if (direction === 'vassal_to_overlord') return `${otherName} is the overlord; the settlement lives under a ${posture.postureLabel}.`;
  if (direction === 'patron_to_client') return `${otherName} is a client in a ${posture.postureLabel}.`;
  if (direction === 'client_to_patron') return `${otherName} is the patron in a ${posture.postureLabel}.`;
  return `${otherName} has a ${posture.postureLabel} with this settlement.`;
}

/**
 * @typedef {Object} RelationshipContextEntryInput  loose pre-sanitize context row
 * @property {unknown=} otherSettlementId
 * @property {unknown=} otherSettlementName
 * @property {unknown=} relationshipType
 * @property {unknown=} posture
 * @property {unknown=} direction
 * @property {unknown=} summary
 * @property {unknown[]=} practicalEffects
 * @property {Array<{ tick?: (number|null), label?: string, type?: string, summary?: string }>=} recentMemory
 *
 * @param {{ settlementId?: unknown, generatedAtTick?: (number|null), relationships?: RelationshipContextEntryInput[] } | null | undefined} context
 * @param {{ maxRelationships?: number, maxMemories?: number }} [options]
 * @returns {{ settlementId: (string|null), generatedAtTick: (number|null|undefined), emphasis: string, relationships: Array<Object> } | null}
 */
export function sanitizeRelationshipMemoryContext(context, {
  maxRelationships = RELATIONSHIP_MEMORY_MAX_CONTEXT_RELATIONSHIPS,
  maxMemories = RELATIONSHIP_MEMORY_MAX_CONTEXT_MEMORIES,
} = {}) {
  if (!context || typeof context !== 'object') return null;
  const relationships = Array.isArray(context.relationships) ? context.relationships : [];
  const sanitized = relationships.slice(0, maxRelationships).map(item => ({
    otherSettlementId: item.otherSettlementId ? String(item.otherSettlementId) : null,
    otherSettlementName: clipText(item.otherSettlementName, 80),
    relationshipType: clipText(item.relationshipType, 40),
    posture: clipText(item.posture, 80),
    direction: clipText(item.direction, 40),
    summary: clipText(item.summary, 240),
    practicalEffects: (Array.isArray(item.practicalEffects) ? item.practicalEffects : [])
      .slice(0, 4)
      .map(text => clipText(text, 180)),
    recentMemory: (Array.isArray(item.recentMemory) ? item.recentMemory : [])
      .slice(0, maxMemories)
      .map(memory => ({
        tick: Number.isFinite(memory?.tick) ? memory.tick : null,
        label: clipText(memory?.label || memory?.type, 80),
        summary: clipText(memory?.summary, 200),
      })),
  })).filter(item => item.otherSettlementName || item.summary);
  if (!sanitized.length) return null;
  return {
    settlementId: context.settlementId ? String(context.settlementId) : null,
    generatedAtTick: Number.isFinite(context.generatedAtTick) ? context.generatedAtTick : null,
    emphasis: 'Earlier relationships in this list have stronger Daily Life influence because they are more recent, severe, or structurally close.',
    relationships: sanitized,
  };
}

/**
 * @param {{
 *   settlementId?: string,
 *   worldState?: any,
 *   regionalGraph?: any,
 *   snapshot?: any,
 *   savedSettlements?: any[],
 *   maxRelationships?: number,
 *   maxMemories?: number,
 *   preferPersisted?: boolean,
 * }} [args]
 */
export function buildSettlementRelationshipMemoryContext({
  settlementId,
  worldState = {},
  regionalGraph = {},
  snapshot = null,
  savedSettlements = [],
  maxRelationships = RELATIONSHIP_MEMORY_MAX_CONTEXT_RELATIONSHIPS,
  maxMemories = RELATIONSHIP_MEMORY_MAX_CONTEXT_MEMORIES,
  preferPersisted = false,
} = {}) {
  if (!settlementId) return null;
  const id = String(settlementId);
  const postures = buildRelationshipPostures({
    worldState,
    regionalGraph,
    snapshot,
    currentTick: worldState?.tick,
    preferPersisted,
  }).filter(posture => posture.from === id || posture.to === id);

  if (!postures.length) return null;
  const relationships = postures.slice(0, maxRelationships).map(posture => {
    const otherId = posture.from === id ? posture.to : posture.from;
    const otherSettlementName = nameFor({ snapshot, savedSettlements, saveId: otherId });
    return {
      otherSettlementId: otherId,
      otherSettlementName,
      relationshipType: posture.relationshipType,
      posture: posture.postureLabel,
      direction: directionFor(posture, id),
      summary: entrySummary(posture, id, otherSettlementName),
      practicalEffects: posture.practicalEffects,
      recentMemory: posture.recentMemory.slice(0, maxMemories).map(memory => ({
        tick: memory.tick,
        label: memory.label,
        summary: memory.summary,
      })),
    };
  });

  return sanitizeRelationshipMemoryContext({
    settlementId: id,
    generatedAtTick: Number.isFinite(worldState?.tick) ? worldState.tick : null,
    relationships,
  }, { maxRelationships, maxMemories });
}
