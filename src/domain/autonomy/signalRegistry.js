/**
 * domain/autonomy/signalRegistry.js — THE SIGNAL REGISTRY v1 (SURVEYOR S7,
 * DESIGN_AI_CONTROL_SURFACE §2 stage 7, the MACHINERY-NOW / VOCABULARY-GROWS compromise).
 *
 * A pure, ADDITIVE-ONLY registry of condition signals — the ONLY vocabulary a typed
 * StopCondition may reference (the schema wall: unregistered id ⇒ structurally rejected,
 * the no-op-type-no-effect law applied to reads). v1 seeds EXCLUSIVELY from proven stable
 * reads, each named at its chokepointed source:
 *
 *   • the 16 causal SYSTEM_VARIABLES (deriveCausalState — scores 0–100 + the 5-band
 *     CAUSAL_BANDS vocabulary), read through the worldSnapshot's memoized item.causal;
 *   • the 9 pressures (deriveSettlementPressures → pressureIndex, scores 0–1);
 *   • war/peace state (settlementWarStatus.atWar per settlement; the 10-value
 *     relationshipType per settlement-pair via worldState.relationshipStates);
 *   • prosperity (the generator's 7-label ladder on settlement.economicState.prosperity)
 *     and legitimacy (governanceLedger().legitimacyScore — NEVER the stale-prone
 *     .publicLegitimacy.label, whose text drifts when tick kernels move .score);
 *   • tick / season (ensureWorldState-normalized plain fields).
 *
 * ADDITIVE-ONLY LAW (ratchet-pinned by tests/domain/autonomy/signalRegistry.walker.test.js):
 * entries may only be ADDED; a registered id's MEANING (type / scope / source / values /
 * read) never changes. The tuning window mints knob entries into THIS registry as DATA
 * (registerSignal), reusing the same schema wall with zero machinery rework.
 *
 * PURE + HEADLESS: no store, no React, no rng, no Date, no writes to any input.
 * Resolution never throws on missing world data — it returns { ok:false, reason } so an
 * unreadable signal can never fire (or crash) an autonomous run.
 */

import { SYSTEM_VARIABLES, CAUSAL_BANDS } from '../causalState.js';
import { governanceLedger } from '../governanceLedger.js';
import { settlementWarStatus } from '../display/warStatus.js';
import { buildWorldSnapshot } from '../worldPulse/worldSnapshot.js';
import { deriveSettlementPressures, pressureIndex } from '../worldPulse/pressureModel.js';
import { PRIMARY_RELATIONSHIP_TYPES } from '../worldPulse/relationshipCompatibility.js';

/** @typedef {'number'|'band'|'state'|'bool'} SignalType */
/** @typedef {'world'|'settlement'|'pair'} SignalScope */

/**
 * How a seed signal reads its value — a DATA discriminator (not a closure) so minted
 * entries stay serializable and the additive-only pin can compare meaning byte-wise.
 * @typedef {object} SignalRead
 * @property {'causalScore'|'causalBand'|'pressure'|'prosperityBand'|'legitimacyScore'|'atWar'|'pairRelationship'|'tick'|'season'} kind
 * @property {string} [key] - the causal variable / pressure kind, where applicable
 */

/**
 * @typedef {object} SignalEntry
 * @property {string} id — stable dotted id; NEVER changes meaning once registered
 * @property {string} source — the chokepointed read this derives from (human-auditable)
 * @property {SignalType} type
 * @property {SignalScope} scope
 * @property {SignalRead} read
 * @property {readonly string[]} [values] - the closed vocabulary for band/state signals
 * @property {number} [min] - inclusive numeric floor for number signals
 * @property {number} [max] - inclusive numeric ceiling for number signals
 * @property {string} description
 * @property {'seed'|'minted'} origin
 */

/**
 * The reading frame every resolution runs against — built ONCE per evaluation boundary
 * from the same snapshot machinery the pulse kernel reads.
 * @typedef {object} SignalFrame
 * @property {ReturnType<typeof buildWorldSnapshot>} snapshot
 * @property {{ get: (settlementId: string, kind: string) => ({ score?: number } | null) }} pressures
 * @property {number} tick
 */

/** The 9 pressure kinds deriveSettlementPressures emits per settlement (pressureModel.js). */
export const PRESSURE_KINDS = Object.freeze([
  'food', 'disease', 'conflict', 'hostility', 'trade', 'economy', 'legitimacy', 'defense', 'crime',
]);

/** The generator's 7-label prosperity ladder (src/generators/economy/prosperity.js LABELS). */
export const PROSPERITY_LADDER = Object.freeze([
  'Subsistence', 'Struggling', 'Poor', 'Moderate', 'Comfortable', 'Prosperous', 'Wealthy',
]);

/** The 4 seasons (worldPulse/worldState.js SEASONS). */
export const SEASONS = Object.freeze(['spring', 'summer', 'autumn', 'winter']);

/** @returns {SignalEntry[]} the frozen v1 seed set (JUDGMENT: proven-stable reads only). */
function buildSeedEntries() {
  /** @type {SignalEntry[]} */
  const entries = [];
  for (const name of SYSTEM_VARIABLES) {
    entries.push({
      id: `causal.${name}.score`,
      source: 'deriveCausalState(settlement).scores (src/domain/causalState.js, via worldSnapshot item.causal)',
      type: 'number', scope: 'settlement', read: { kind: 'causalScore', key: name },
      min: 0, max: 100,
      description: `The ${name.replace(/_/g, ' ')} causal score (0–100).`,
      origin: 'seed',
    });
    entries.push({
      id: `causal.${name}.band`,
      source: 'deriveCausalState(settlement).bands (src/domain/causalState.js causalBand, via worldSnapshot item.causal)',
      type: 'band', scope: 'settlement', read: { kind: 'causalBand', key: name },
      values: CAUSAL_BANDS,
      description: `The ${name.replace(/_/g, ' ')} causal band (${CAUSAL_BANDS.join('/')}).`,
      origin: 'seed',
    });
  }
  for (const kind of PRESSURE_KINDS) {
    entries.push({
      id: `pressure.${kind}`,
      source: 'deriveSettlementPressures(snapshot) → pressureIndex().get(id, kind).score (src/domain/worldPulse/pressureModel.js)',
      type: 'number', scope: 'settlement', read: { kind: 'pressure', key: kind },
      min: 0, max: 1,
      description: `The derived ${kind} pressure (0–1).`,
      origin: 'seed',
    });
  }
  entries.push({
    id: 'settlement.prosperity.band',
    source: 'settlement.economicState.prosperity (src/generators/economy/prosperity.js ladder; live-stepped by upswingKernel)',
    type: 'band', scope: 'settlement', read: { kind: 'prosperityBand' },
    values: PROSPERITY_LADDER,
    description: `The prosperity ladder label (${PROSPERITY_LADDER.join('/')}).`,
    origin: 'seed',
  });
  entries.push({
    id: 'settlement.legitimacy.score',
    source: 'governanceLedger(settlement).legitimacyScore (src/domain/governanceLedger.js — the always-current score, never the stale-prone label)',
    type: 'number', scope: 'settlement', read: { kind: 'legitimacyScore' },
    min: 0, max: 100,
    description: 'Public legitimacy score (0–100).',
    origin: 'seed',
  });
  entries.push({
    id: 'settlement.atWar',
    source: 'settlementWarStatus({settlementId, worldState, regionalGraph}).atWar (src/domain/display/warStatus.js — deployments + confirmed war_front channels)',
    type: 'bool', scope: 'settlement', read: { kind: 'atWar' },
    description: 'Whether the settlement is besieging or besieged (active war).',
    origin: 'seed',
  });
  entries.push({
    id: 'pair.relationship',
    source: 'worldState.relationshipStates[edge.id || rel.<from>.<to>].relationshipType (src/domain/worldPulse/relationshipCompatibility.js PRIMARY_RELATIONSHIP_TYPES; no edge ⇒ neutral)',
    type: 'state', scope: 'pair', read: { kind: 'pairRelationship' },
    values: PRIMARY_RELATIONSHIP_TYPES,
    description: 'The diplomatic stance between two settlements.',
    origin: 'seed',
  });
  entries.push({
    id: 'world.tick',
    source: 'ensureWorldState(...).tick (src/domain/worldPulse/worldState.js — the canonical week counter)',
    type: 'number', scope: 'world', read: { kind: 'tick' },
    min: 0,
    description: 'The world tick (1 tick = 1 week).',
    origin: 'seed',
  });
  entries.push({
    id: 'world.season',
    source: 'ensureWorldState(...).calendar.season (src/domain/worldPulse/worldState.js SEASONS)',
    type: 'state', scope: 'world', read: { kind: 'season' },
    values: SEASONS,
    description: `The current season (${SEASONS.join('/')}).`,
    origin: 'seed',
  });
  return entries;
}

/** @param {SignalEntry} entry @returns {SignalEntry} */
function freezeEntry(entry) {
  if (entry.read) Object.freeze(entry.read);
  if (entry.values) Object.freeze(entry.values);
  return Object.freeze(entry);
}

/** The registry store: seed first, minted entries appended. Ids are permanent. */
const REGISTRY = new Map(buildSeedEntries().map((e) => [e.id, freezeEntry(e)]));
const SEED_COUNT = REGISTRY.size;

/** @returns {SignalEntry[]} every registered signal, seed + minted, registration order. */
export function signalRegistryEntries() {
  return [...REGISTRY.values()];
}

/** @param {string} id @returns {SignalEntry | null} */
export function signalById(id) {
  return REGISTRY.get(String(id)) || null;
}

/** The meaning fields the additive-only law freezes per id. @param {SignalEntry} e */
function meaningOf(e) {
  return JSON.stringify({
    type: e.type, scope: e.scope, source: e.source,
    read: e.read, values: e.values || null, min: e.min ?? null, max: e.max ?? null,
  });
}

/**
 * ADDITIVE-ONLY registration (the tuning window's mint lane — knob entries land here as
 * DATA). A new id appends; re-registering an existing id is a no-op ONLY when the meaning
 * is byte-identical — any meaning drift throws (ids never change meaning).
 * @param {SignalEntry} entry
 * @returns {SignalEntry} the registered (frozen) entry
 */
export function registerSignal(entry) {
  if (!entry || typeof entry !== 'object' || typeof entry.id !== 'string' || !entry.id) {
    throw new Error('registerSignal: an entry with a non-empty string id is required');
  }
  if (!['number', 'band', 'state', 'bool'].includes(entry.type)) {
    throw new Error(`registerSignal(${entry.id}): unknown type "${String(entry.type)}"`);
  }
  if (!['world', 'settlement', 'pair'].includes(entry.scope)) {
    throw new Error(`registerSignal(${entry.id}): unknown scope "${String(entry.scope)}"`);
  }
  if ((entry.type === 'band' || entry.type === 'state') && !(Array.isArray(entry.values) && entry.values.length > 0)) {
    throw new Error(`registerSignal(${entry.id}): band/state signals require a non-empty values vocabulary`);
  }
  const existing = REGISTRY.get(entry.id);
  if (existing) {
    if (meaningOf(existing) !== meaningOf(entry)) {
      throw new Error(`registerSignal(${entry.id}): id already registered with a DIFFERENT meaning — ids never change meaning (additive-only law)`);
    }
    return existing;
  }
  const frozen = freezeEntry({ ...entry, origin: entry.origin === 'seed' ? 'seed' : 'minted' });
  REGISTRY.set(frozen.id, frozen);
  return frozen;
}

/**
 * TEST-ONLY: drop minted (non-seed) entries so registry tests stay isolated. The seed is
 * never removable — the additive-only law has no production removal path.
 */
export function resetMintedSignalsForTest() {
  for (const [id, entry] of REGISTRY) {
    if (entry.origin !== 'seed') REGISTRY.delete(id);
  }
  if (REGISTRY.size !== SEED_COUNT) {
    throw new Error('resetMintedSignalsForTest: seed entries went missing — the registry was corrupted');
  }
}

/**
 * Build the reading frame for one evaluation boundary. Uses the SAME snapshot + pressure
 * machinery the pulse kernel reads — a signal can never see a world the engine does not.
 * @param {{ campaign?: object | null, saves?: Array<object> }} args
 * @returns {SignalFrame}
 */
export function prepareSignalFrame({ campaign = null, saves = [] } = {}) {
  const snapshot = buildWorldSnapshot({ campaign, saves });
  const pressures = pressureIndex(deriveSettlementPressures(snapshot));
  const tickRaw = /** @type {{ tick?: unknown }} */ (snapshot.worldState || {}).tick;
  const tick = typeof tickRaw === 'number' && Number.isFinite(tickRaw) ? tickRaw : 0;
  return { snapshot, pressures, tick };
}

/** @typedef {{ ok: true, value: number | string | boolean } | { ok: false, reason: string }} SignalResolution */

/**
 * Find the relationship stance between two settlements: the evolved relationshipStates
 * entry when present, the edge's own baseline type otherwise, 'neutral' when no edge
 * links the pair (relationship absence IS neutrality in the model).
 * @param {ReturnType<typeof buildWorldSnapshot>} snapshot
 * @param {string} sid @param {string} oid
 * @returns {string}
 */
function pairRelationship(snapshot, sid, oid) {
  const graph = /** @type {{ edges?: Array<Record<string, unknown>> }} */ (snapshot.regionalGraph || {});
  const states = /** @type {Record<string, { relationshipType?: unknown } | undefined>} */ (
    (/** @type {{ relationshipStates?: object }} */ (snapshot.worldState || {})).relationshipStates || {});
  for (const edge of graph.edges || []) {
    const from = String(edge.from ?? edge.source ?? '');
    const to = String(edge.to ?? edge.target ?? '');
    const touches = (from === sid && to === oid) || (from === oid && to === sid);
    if (!touches) continue;
    const st = states[String(edge.id ?? '') || `rel.${from}.${to}`];
    const evolved = st && typeof st.relationshipType === 'string' ? st.relationshipType : '';
    const baseline = typeof edge.relationshipType === 'string' ? edge.relationshipType : '';
    return evolved || baseline || 'neutral';
  }
  return 'neutral';
}

/**
 * Resolve one registered signal against a frame. PURE — never throws, never writes,
 * never rolls; unreadable ⇒ { ok:false, reason } (an unreadable signal never fires).
 * @param {SignalEntry | string} entryOrId
 * @param {SignalFrame} frame
 * @param {{ settlementId?: string | null, otherId?: string | null }} [target]
 * @returns {SignalResolution}
 */
export function resolveSignal(entryOrId, frame, { settlementId = null, otherId = null } = {}) {
  const entry = typeof entryOrId === 'string' ? signalById(entryOrId) : entryOrId;
  if (!entry) return { ok: false, reason: 'unregistered_signal' };
  if (!frame || !frame.snapshot) return { ok: false, reason: 'no_frame' };
  const sid = settlementId == null ? '' : String(settlementId);
  const oid = otherId == null ? '' : String(otherId);
  if ((entry.scope === 'settlement' || entry.scope === 'pair') && !sid) {
    return { ok: false, reason: 'settlement_required' };
  }
  if (entry.scope === 'pair' && !oid) return { ok: false, reason: 'pair_required' };

  const item = sid ? frame.snapshot.byId.get(sid) : null;
  const read = entry.read || { kind: 'tick' };
  switch (read.kind) {
    case 'causalScore': {
      if (!item) return { ok: false, reason: 'unknown_settlement' };
      const scores = /** @type {Record<string, unknown>} */ (item.causal?.scores || {});
      const v = scores[read.key || ''];
      return typeof v === 'number' && Number.isFinite(v)
        ? { ok: true, value: v } : { ok: false, reason: 'unreadable' };
    }
    case 'causalBand': {
      if (!item) return { ok: false, reason: 'unknown_settlement' };
      const bands = /** @type {Record<string, unknown>} */ (item.causal?.bands || {});
      const v = bands[read.key || ''];
      return typeof v === 'string' && v ? { ok: true, value: v } : { ok: false, reason: 'unreadable' };
    }
    case 'pressure': {
      if (!item) return { ok: false, reason: 'unknown_settlement' };
      const rec = frame.pressures.get(sid, read.key || '');
      const v = rec && typeof rec.score === 'number' && Number.isFinite(rec.score) ? rec.score : 0;
      return { ok: true, value: v };
    }
    case 'prosperityBand': {
      if (!item) return { ok: false, reason: 'unknown_settlement' };
      const econ = /** @type {{ economicState?: { prosperity?: unknown } }} */ (item.settlement || {});
      const v = econ.economicState?.prosperity;
      return typeof v === 'string' && PROSPERITY_LADDER.includes(v)
        ? { ok: true, value: v } : { ok: false, reason: 'unreadable' };
    }
    case 'legitimacyScore': {
      if (!item) return { ok: false, reason: 'unknown_settlement' };
      const ledger = governanceLedger(/** @type {never} */ (item.settlement));
      const v = /** @type {{ legitimacyScore?: unknown }} */ (ledger || {}).legitimacyScore;
      return typeof v === 'number' && Number.isFinite(v)
        ? { ok: true, value: v } : { ok: false, reason: 'unreadable' };
    }
    case 'atWar': {
      if (!item) return { ok: false, reason: 'unknown_settlement' };
      const status = settlementWarStatus({
        settlementId: sid,
        worldState: /** @type {never} */ (frame.snapshot.worldState),
        regionalGraph: /** @type {never} */ (frame.snapshot.regionalGraph),
      });
      return { ok: true, value: Boolean(status && status.atWar) };
    }
    case 'pairRelationship': {
      if (!item) return { ok: false, reason: 'unknown_settlement' };
      if (!frame.snapshot.byId.get(oid)) return { ok: false, reason: 'unknown_settlement' };
      return { ok: true, value: pairRelationship(frame.snapshot, sid, oid) };
    }
    case 'tick':
      return { ok: true, value: frame.tick };
    case 'season': {
      const cal = /** @type {{ calendar?: { season?: unknown } }} */ (frame.snapshot.worldState || {});
      const v = cal.calendar?.season;
      return typeof v === 'string' && SEASONS.includes(v)
        ? { ok: true, value: v } : { ok: true, value: 'spring' };
    }
    default:
      return { ok: false, reason: 'unresolvable_read' };
  }
}
