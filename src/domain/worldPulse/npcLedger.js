/**
 * domain/worldPulse/npcLedger.js — W-H1: DURABLE IDENTITY + THE WORLD NPC LEDGER.
 *
 * (design DESIGN_NPC_CONSEQUENCES.md §3a identity graduated by consequence, §3b the
 * world NPC ledger, §10 lifecycle paths; laws 5 DORMANCY, 6 CONSERVATION.)
 *
 * WHAT THIS IS. Roster NPCs are POSITIONAL: generateNPCs stamps `npc_${idx + 1}` over
 * a finished roster, so a reroll re-issues npc_1..npc_N to entirely different people
 * (regenerationPreservation.js documents that trap and the substitution cure it forced).
 * A positional id therefore cannot name a person ACROSS settlements or ACROSS rerolls.
 * At the first cross-settlement consequence an NPC GRADUATES: a durable, world-scoped
 * `wnpc_<hash>` is minted ONCE and every cross-settlement surface keys only on that.
 * Local machinery keeps using slot ids and is not touched here at all.
 *
 * THE ONE-WAY DOOR (design §14, the risk this slice carries). Graduation is one-way and
 * idempotent, and the id contract must be right before any of this persists: changing
 * id semantics after ships is a migration. Two decisions carry that weight:
 *
 *   1. THE MINT IS ZERO-RNG. The id is an FNV-1a hash of a canonical composite key, not
 *      a PRNG draw. A draw would steal from the pulse stream and could move a golden;
 *      a hash consumes nothing and is structurally incapable of it (the wave-G
 *      autoplacement precedent: seed enters only through a tie hash).
 *   2. THE LOOKUP KEY EXCLUDES THE TICK, THE MINT INCLUDES IT. Uniqueness wants the
 *      tick; idempotency forbids it, because re-graduating the same person a year later
 *      must return the SAME id rather than mint a second one. Splitting the two is what
 *      makes "minted once, deterministic, idempotent" simultaneously true.
 *
 * AND THE LOOKUP KEY IS NOT POSITIONAL. It is (settlementId, rosterId, name): a reroll
 * that re-issues npc_3 to somebody else changes the NAME, so the reverse lookup misses
 * and the stranger cannot inherit a graduated identity. Keying on the slot id alone
 * would have walked straight back into the trap this module exists to escape.
 *
 * CONSERVATION (law 6), STRUCTURALLY. `roamers` and `placed` are DISJOINT and their
 * union is exactly the set of graduated identities, so a transition MOVES one record
 * between two maps and can neither duplicate nor drop a soul. graduateNpc never touches
 * npcs[] or factions[].members[] (the JSON-alias homes), so the settlement's own census
 * is arithmetically untouched by graduation - the ledger is a pure sidecar over people
 * who already exist.
 *
 * DORMANCY (law 5, constitutional). Everything here is behind the VIRTUAL
 * `npcConsequencesEnabled` flag, which has NO entry in DEFAULT_SIMULATION_RULES. Dark
 * (the default, and every existing campaign) every entry point is an immediate no-op
 * and no ledger key is ever written. The ledger nests under the `spatialLedgers`
 * conditional namespace, so a dormant world serializes byte-identically to a pre-H1
 * one and the whole surface costs zero eager first-paint bytes.
 *
 * AUDIENCE PROJECTION (law 7) IS NOT HERE. This module holds DM TRUTH. Every
 * player-facing read goes through npcLedgerProjection.js, which strips it structurally.
 * Nothing in this file should ever be handed to a player surface directly.
 *
 * PURE + LAZY: no Date, no Math.random, no store, no React, no I/O, no mutation. All
 * folds codepoint-sorted so a persisted ledger is permutation-independent.
 *
 * @enforced-by tests/domain/npcLedgerIdentity.test.js,
 *   tests/domain/npcLedgerState.test.js,
 *   tests/property/npcLedgerDormancyGolden.test.js
 */

import { compareCodepoint } from '../deterministicSort.js';
import { getSpatialLedger, setSpatialLedger, dropSpatialLedger, hasSpatialLedger } from '../spatial/distanceRead.js';
import {
  NEUTRAL_REPUTATION_FACETS,
  VERDICT_CAUSES,
  COMPROMISE_SOURCES,
  closedValue,
  normalizeReputationFacets,
  normalizeExclusionEdges,
  exclusionActiveAt,
} from './npcLedgerFacets.js';

/** The conditional sub-ledger key under worldState.spatialLedgers. */
export const NPC_LEDGER_KEY = 'npcLedger';

/** The durable world-scoped id prefix (design §3a). */
export const DURABLE_NPC_ID_PREFIX = 'wnpc_';

/**
 * The composite-key delimiter. A NAMED constant rather than a literal inside a template
 * because an authored control byte in exactly this position has bitten this estate
 * before (the authored-NUL-byte class); a named, tested constant makes the separator
 * visible to review and to the round-trip pin.
 */
const KEY_DELIM = '|';

/** How many deterministic re-probes a colliding mint attempts before it widens. */
const MINT_PROBE_BUDGET = 64;

/** Cap on a stored identity string, so a pathological name cannot bloat the ledger. */
const IDENTITY_TEXT_CAP = 120;

/**
 * @typedef {import('./npcLedgerFacets.js').ReputationFacets} ReputationFacets
 * @typedef {import('./npcLedgerFacets.js').ExclusionEdge} ExclusionEdge
 */

/**
 * @typedef {Object} OriginRef
 * @property {string} settlementId  where this person was a member of the roster
 * @property {string} rosterId      the POSITIONAL slot id they held at graduation
 * @property {string} name          the name they held at graduation (the identity half)
 */

/**
 * @typedef {Object} IdentityFacets
 * @property {string} name
 * @property {string} role  the role/profession label carried for the register
 */

/**
 * @typedef {Object} DmTruth
 * @property {string} compromiseSource a COMPROMISE_SOURCES member. COVERT INTELLIGENCE.
 */

/**
 * @typedef {Object} RoamerRecord
 * @property {IdentityFacets} identityFacets
 * @property {ReputationFacets} reputation
 * @property {OriginRef} originRef
 * @property {string} verdictCause a VERDICT_CAUSES member
 * @property {number} sinceTick
 * @property {DmTruth} [dmTruth] present ONLY when there is covert truth to carry
 */

/**
 * @typedef {Object} PlacementRecord
 * @property {IdentityFacets} identityFacets
 * @property {ReputationFacets} reputation
 * @property {OriginRef} originRef
 * @property {string} verdictCause a VERDICT_CAUSES member
 * @property {string} hostSettlementId who hosts them now
 * @property {number} sinceTick
 * @property {DmTruth} [dmTruth]
 */

/**
 * @typedef {Object} NpcLedger
 * @property {Record<string, RoamerRecord>} roamers
 * @property {Record<string, PlacementRecord>} placed
 * @property {Record<string, ReadonlyArray<ExclusionEdge>>} exclusions
 */

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

/** @param {unknown} v @returns {string} capped, trimmed text (never undefined) */
function text(v) {
  return String(v == null ? '' : v).slice(0, IDENTITY_TEXT_CAP);
}

/** @param {unknown} v @returns {number} a non-negative integer tick */
function tickOf(v) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

/**
 * FNV-1a 32-bit over a string. A LOCAL copy of the estate's one hash idiom
 * (kernel/proseHash.js fnv1a32, spatial/spatialSubstrateRead.js hash32, newsVoice.js,
 * eventProse.js all carry the same constants) so this leaf keeps its zero-import
 * posture toward the spatial and kernel graphs. Draws no rng, reads no clock.
 * @param {string} s @returns {number} unsigned 32-bit
 */
function fnv1a32(s) {
  let h = 0x811c9dc5;
  const str = String(s);
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

// ── THE GATE (law 5) ──────────────────────────────────────────────────────────
/**
 * Is the NPC-consequence economy LIT? Reads simulationRules.npcConsequencesEnabled
 * === true, defensively. ABSENT ⇒ false ⇒ DORMANT. The flag has NO entry in
 * DEFAULT_SIMULATION_RULES (the npcCredibility / npcLadder virtual-flag idiom), so no
 * existing campaign carries it and no golden moves.
 * @param {{ simulationRules?: unknown } | null | undefined} worldState
 * @returns {boolean}
 */
export function npcConsequencesActive(worldState) {
  const rules = asObject(asObject(worldState).simulationRules);
  return rules.npcConsequencesEnabled === true;
}

// ── THE MODEL ─────────────────────────────────────────────────────────────────
/**
 * The empty ledger. TOTAL SHAPE: whenever the ledger is materialized all three maps
 * are present, so no consumer ever branches on a missing sub-map. The whole KEY is
 * what drops when everything is empty, not the individual maps.
 * @returns {NpcLedger}
 */
export function emptyNpcLedger() {
  return { roamers: {}, placed: {}, exclusions: {} };
}

/** @param {NpcLedger} ledger @returns {boolean} */
function ledgerIsEmpty(ledger) {
  return Object.keys(ledger.roamers).length === 0
    && Object.keys(ledger.placed).length === 0
    && Object.keys(ledger.exclusions).length === 0;
}

/**
 * Normalize one origin reference. Total on garbage.
 * @param {unknown} raw @returns {OriginRef}
 */
function normalizeOriginRef(raw) {
  const r = asObject(raw);
  return { settlementId: text(r.settlementId), rosterId: text(r.rosterId), name: text(r.name) };
}

/**
 * Normalize identity facets. Total on garbage.
 * @param {unknown} raw @returns {IdentityFacets}
 */
function normalizeIdentityFacets(raw) {
  const r = asObject(raw);
  return { name: text(r.name), role: text(r.role) };
}

/**
 * Normalize DM truth, or null when there is nothing covert to carry. DROP-WHEN-EMPTY at
 * the field level: a compromiseSource of 'none' carries NO dmTruth key at all, so the
 * common case adds zero bytes and the projection pin's teeth are only exercised by
 * records that genuinely hold covert intelligence.
 * @param {unknown} raw @returns {DmTruth | null}
 */
function normalizeDmTruth(raw) {
  const r = asObject(raw);
  const compromiseSource = closedValue(r.compromiseSource, COMPROMISE_SOURCES);
  return compromiseSource === 'none' ? null : { compromiseSource };
}

/**
 * Normalize one ledger record. `hostSettlementId` materializes for a PlacementRecord
 * and is absent for a RoamerRecord, which is the ONE structural difference between the
 * two shapes: a transition moves the record and adds or removes that single field.
 *
 * Key order is fixed (the facet-set discipline) so two equal records serialize
 * identically and the round-trip pin measures content rather than construction order.
 *
 * @param {unknown} raw
 * @param {{ placed: boolean }} opts
 * @returns {RoamerRecord | PlacementRecord}
 */
function normalizeRecord(raw, opts) {
  const r = asObject(raw);
  /** @type {Record<string, unknown>} */
  const out = {
    identityFacets: normalizeIdentityFacets(r.identityFacets),
    reputation: normalizeReputationFacets(r.reputation),
    originRef: normalizeOriginRef(r.originRef),
    verdictCause: closedValue(r.verdictCause, VERDICT_CAUSES),
  };
  if (opts.placed) out.hostSettlementId = text(r.hostSettlementId);
  out.sinceTick = tickOf(r.sinceTick);
  const dmTruth = normalizeDmTruth(r.dmTruth);
  if (dmTruth) out.dmTruth = dmTruth;
  return /** @type {RoamerRecord | PlacementRecord} */ (out);
}

/**
 * The live ledger, normalized and TOTAL. An absent, garbage, or partially-shaped
 * ledger reads as the empty one, so every accessor below is total without a guard.
 *
 * CONSERVATION IS ENFORCED HERE, at the read door: an id present in BOTH roamers and
 * placed is a violation of law 6, and rather than pass it through, this normalizer
 * keeps the PLACED reading and drops the roaming one. Placed wins because it names a
 * host, so keeping it preserves the more specific fact; and because the alternative
 * (throwing, or passing the duplicate through) would either crash a load or let the
 * duplicate reach a projection where it would read as two people.
 *
 * @param {{ spatialLedgers?: unknown } | null | undefined} worldState
 * @returns {NpcLedger}
 */
export function npcLedgerOf(worldState) {
  const raw = asObject(getSpatialLedger(worldState, NPC_LEDGER_KEY));
  const placedRaw = asObject(raw.placed);
  const roamersRaw = asObject(raw.roamers);
  const exclusionsRaw = asObject(raw.exclusions);

  /** @type {Record<string, PlacementRecord>} */
  const placed = {};
  for (const id of Object.keys(placedRaw).sort(compareCodepoint)) {
    placed[id] = /** @type {PlacementRecord} */ (normalizeRecord(placedRaw[id], { placed: true }));
  }
  /** @type {Record<string, RoamerRecord>} */
  const roamers = {};
  for (const id of Object.keys(roamersRaw).sort(compareCodepoint)) {
    if (Object.prototype.hasOwnProperty.call(placed, id)) continue; // law 6: never both
    roamers[id] = /** @type {RoamerRecord} */ (normalizeRecord(roamersRaw[id], { placed: false }));
  }
  /** @type {Record<string, ReadonlyArray<ExclusionEdge>>} */
  const exclusions = {};
  for (const id of Object.keys(exclusionsRaw).sort(compareCodepoint)) {
    const edges = normalizeExclusionEdges(exclusionsRaw[id]);
    if (edges.length > 0) exclusions[id] = edges; // an empty edge list is not a record
  }
  return { roamers, placed, exclusions };
}

/**
 * Fold a ledger back onto worldState, DROPPING THE WHOLE KEY when it is empty so a
 * drained ledger is byte-identical to a world that never had one (the armyTransit /
 * satellites conditional-ledger pattern). Returns a NEW worldState; never mutates.
 *
 * Returns the SAME worldState reference when the serialized ledger is unchanged, so a
 * no-op pass cannot mint a fresh object and defeat a change detector upstream.
 *
 * @param {Record<string, unknown>} worldState
 * @param {NpcLedger} ledger
 * @returns {Record<string, unknown>}
 */
export function setNpcLedger(worldState, ledger) {
  const next = ledger && typeof ledger === 'object' ? ledger : emptyNpcLedger();
  const empty = ledgerIsEmpty(next);
  const priorRaw = getSpatialLedger(worldState, NPC_LEDGER_KEY);
  const priorSerialized = JSON.stringify(priorRaw === undefined ? null : priorRaw);
  const nextSerialized = JSON.stringify(empty ? null : next);
  if (priorSerialized === nextSerialized) return worldState;
  return empty
    ? dropSpatialLedger(worldState, NPC_LEDGER_KEY)
    : setSpatialLedger(worldState, NPC_LEDGER_KEY, next);
}

/** True when a materialized npcLedger exists (the cheap pre-check).
 *  @param {{ spatialLedgers?: unknown } | null | undefined} worldState @returns {boolean} */
export function hasNpcLedger(worldState) {
  return hasSpatialLedger(worldState, NPC_LEDGER_KEY);
}

// ── ACCESSORS ─────────────────────────────────────────────────────────────────
/**
 * The roamer record for a durable id, or null. @param {{ spatialLedgers?: unknown } | null | undefined} worldState
 * @param {string} wnpcId @returns {RoamerRecord | null}
 */
export function roamerRecordOf(worldState, wnpcId) {
  return npcLedgerOf(worldState).roamers[String(wnpcId)] || null;
}

/**
 * The placement record for a durable id, or null. @param {{ spatialLedgers?: unknown } | null | undefined} worldState
 * @param {string} wnpcId @returns {PlacementRecord | null}
 */
export function placementOf(worldState, wnpcId) {
  return npcLedgerOf(worldState).placed[String(wnpcId)] || null;
}

/**
 * The exclusion edges recorded against a durable id (empty array when none).
 * @param {{ spatialLedgers?: unknown } | null | undefined} worldState @param {string} wnpcId
 * @returns {ReadonlyArray<ExclusionEdge>}
 */
export function exclusionsOf(worldState, wnpcId) {
  return npcLedgerOf(worldState).exclusions[String(wnpcId)] || [];
}

/**
 * Is this door shut against this person at `tick`? The candidate-flow filter (design
 * §6 runs exclusions FIRST). Pure.
 * @param {{ spatialLedgers?: unknown } | null | undefined} worldState
 * @param {string} wnpcId @param {string} settlementId @param {number} tick
 * @returns {boolean}
 */
export function isExcludedFrom(worldState, wnpcId, settlementId, tick) {
  const target = String(settlementId);
  for (const edge of exclusionsOf(worldState, wnpcId)) {
    if (edge.settlementId === target && exclusionActiveAt(edge, tick)) return true;
  }
  return false;
}

/**
 * Every graduated durable id in the world, codepoint-sorted. The union of the two
 * ledgers, which law 6 makes a disjoint union. @param {{ spatialLedgers?: unknown } | null | undefined} worldState
 * @returns {string[]}
 */
export function graduatedNpcIds(worldState) {
  const ledger = npcLedgerOf(worldState);
  return [...Object.keys(ledger.roamers), ...Object.keys(ledger.placed)].sort(compareCodepoint);
}

// ── IDENTITY GRADUATION (design §3a) ──────────────────────────────────────────
/**
 * The IDENTITY half of the composite key: what makes this person THIS person,
 * independent of when anything happened to them. Positional-safe by construction: the
 * name travels with it, so a reroll that re-issues the slot to somebody else produces
 * a different key and cannot inherit the graduated id.
 * @param {string} settlementId @param {{ rosterId?: unknown, name?: unknown }} rosterIdentity
 * @returns {string}
 */
function identityKey(settlementId, rosterIdentity) {
  const r = asObject(rosterIdentity);
  return [text(settlementId), text(r.rosterId), text(r.name)].join(KEY_DELIM);
}

/**
 * Mint a durable world-scoped NPC id: `wnpc_<8 hex>`, deterministically seeded from the
 * settlement seed, the roster identity and the tick (design §3a), and COLLISION-CHECKED
 * against ids already in use.
 *
 * DETERMINISM: an FNV-1a hash, zero PRNG draws. Same inputs and same taken-set always
 * yield the same id, in any process, forever.
 *
 * COLLISION HANDLING: on a taken id the probe re-hashes the composite key with an
 * incrementing salt, deterministically, up to MINT_PROBE_BUDGET times. Past that budget
 * (astronomically unlikely at 2^32 with a realm's cast, but TOTAL beats lucky) it
 * widens to a suffixed form that is guaranteed to terminate because each candidate is
 * checked. The function NEVER throws and never returns a taken id.
 *
 * @param {string} settlementSeed  the settlement's generation seed
 * @param {{ rosterId?: unknown, name?: unknown }} rosterIdentity
 * @param {number} tick
 * @param {{ has: (id: string) => boolean }} [taken]  the in-use predicate; default none
 * @returns {string}
 */
export function mintDurableNpcId(settlementSeed, rosterIdentity, tick, taken = { has: () => false }) {
  const r = asObject(rosterIdentity);
  const base = [
    text(settlementSeed),
    text(r.rosterId),
    text(r.name),
    String(tickOf(tick)),
  ].join(KEY_DELIM);
  const idFor = (/** @type {string} */ key) => DURABLE_NPC_ID_PREFIX + fnv1a32(key).toString(16).padStart(8, '0');
  let candidate = idFor(base);
  if (!taken.has(candidate)) return candidate;
  for (let probe = 1; probe <= MINT_PROBE_BUDGET; probe += 1) {
    candidate = idFor(base + KEY_DELIM + String(probe));
    if (!taken.has(candidate)) return candidate;
  }
  // The widened form. Deterministic, terminating, and still collision-checked.
  const stem = idFor(base);
  for (let n = 0; ; n += 1) {
    const widened = stem + '_' + String(n);
    if (!taken.has(widened)) return widened;
  }
}

/**
 * The durable id already graduated for a roster identity, or null. THE IDEMPOTENCY
 * ORACLE: graduation consults this first, so re-graduating the same person always
 * returns the existing id and never mints a second one.
 *
 * Derived by scanning the two record maps rather than stored as a fourth map, so the
 * persisted ledger keeps exactly the three-map shape the design declares and there is
 * no reverse index that can drift out of agreement with the records it indexes. The
 * scan is over a realm's named cast, which is small by construction.
 *
 * @param {{ spatialLedgers?: unknown } | null | undefined} worldState
 * @param {string} settlementId
 * @param {{ rosterId?: unknown, name?: unknown }} rosterIdentity
 * @returns {string | null}
 */
export function durableIdForRoster(worldState, settlementId, rosterIdentity) {
  const wanted = identityKey(settlementId, rosterIdentity);
  const ledger = npcLedgerOf(worldState);
  /** @type {string[]} */
  const hits = [];
  for (const [id, rec] of Object.entries(ledger.placed)) {
    if (identityKey(rec.originRef.settlementId, rec.originRef) === wanted) hits.push(id);
  }
  for (const [id, rec] of Object.entries(ledger.roamers)) {
    if (identityKey(rec.originRef.settlementId, rec.originRef) === wanted) hits.push(id);
  }
  // Codepoint-lowest wins, so a ledger that somehow carries two records for one origin
  // still resolves DETERMINISTICALLY rather than by object-key order.
  return hits.length > 0 ? hits.sort(compareCodepoint)[0] : null;
}

/**
 * GRADUATE an NPC: mint the durable identity once and record the roster linkage in the
 * world ledger. One-way and idempotent.
 *
 * WHAT THIS DELIBERATELY DOES NOT TOUCH. It writes nothing to npcs[], nothing to
 * factions[].members[], nothing to the `_preservation` report, and no lock or pinnedNpc
 * map. The linkage lives in the ledger's originRef, which is why the positional-id
 * machinery and the reroll remap are byte-unchanged by construction rather than by
 * careful avoidance. Stamping the durable id onto the NPC record is the verdict lane's
 * work (H2), through the command spine, where a receipt and an undo snapshot exist.
 *
 * DORMANT ⇒ an immediate no-op returning the SAME worldState reference and a null id.
 *
 * @param {Object} args
 * @param {Record<string, unknown>} args.worldState
 * @param {string} args.settlementSeed
 * @param {string} args.settlementId
 * @param {{ rosterId?: unknown, name?: unknown, role?: unknown }} args.rosterIdentity
 * @param {number} args.tick
 * @param {string} [args.verdictCause] a VERDICT_CAUSES member; defaults to 'none'
 * @param {unknown} [args.reputation] initial ReputationFacets; defaults to neutral
 * @param {unknown} [args.dmTruth] initial DM truth; omitted when it reads 'none'
 * @param {string|null} [args.hostSettlementId] non-null ⇒ enters `placed` under that
 *   host; null (the default) ⇒ enters `roamers`
 * @returns {{ worldState: Record<string, unknown>, wnpcId: string|null, minted: boolean, changed: boolean }}
 */
export function graduateNpc({
  worldState,
  settlementSeed,
  settlementId,
  rosterIdentity,
  tick,
  verdictCause = 'none',
  reputation = NEUTRAL_REPUTATION_FACETS,
  dmTruth = null,
  hostSettlementId = null,
}) {
  if (!npcConsequencesActive(worldState)) {
    return { worldState, wnpcId: null, minted: false, changed: false };
  }
  const existing = durableIdForRoster(worldState, settlementId, rosterIdentity);
  if (existing) {
    // THE ONE-WAY DOOR. An already-graduated person keeps their id and their record
    // exactly as it stands; graduation is not an update verb.
    return { worldState, wnpcId: existing, minted: false, changed: false };
  }
  const ledger = npcLedgerOf(worldState);
  const inUse = new Set(graduatedNpcIds(worldState));
  const wnpcId = mintDurableNpcId(settlementSeed, rosterIdentity, tick, inUse);
  const r = asObject(rosterIdentity);
  const record = normalizeRecord({
    identityFacets: { name: r.name, role: r.role },
    reputation,
    originRef: { settlementId, rosterId: r.rosterId, name: r.name },
    verdictCause,
    hostSettlementId,
    sinceTick: tick,
    dmTruth,
  }, { placed: hostSettlementId != null });

  const nextLedger = hostSettlementId != null
    ? { ...ledger, placed: sortedRecords({ ...ledger.placed, [wnpcId]: /** @type {PlacementRecord} */ (record) }) }
    : { ...ledger, roamers: sortedRecords({ ...ledger.roamers, [wnpcId]: /** @type {RoamerRecord} */ (record) }) };
  return { worldState: setNpcLedger(worldState, nextLedger), wnpcId, minted: true, changed: true };
}

/**
 * Rebuild a record map in codepoint key order, so insertion order can never leak into
 * the serialized bytes. @template T @param {Record<string, T>} map @returns {Record<string, T>}
 */
function sortedRecords(map) {
  /** @type {Record<string, T>} */
  const out = {};
  for (const id of Object.keys(map).sort(compareCodepoint)) out[id] = map[id];
  return out;
}

// ── CONSERVATION (law 6) ──────────────────────────────────────────────────────
/**
 * Census the named cast of ONE settlement across BOTH alias homes.
 *
 * THE ALIAS TRAP (a standing estate hazard): factions[].members[] entries ARE the
 * npcs[] objects in memory, so an in-memory test cannot tell a shared reference from a
 * copy. Only serialization splits the alias. This census therefore reports the two
 * homes SEPARATELY and never dedupes across them, so a caller can compare both and a
 * JSON-round-tripped fixture measures what an in-memory one cannot.
 *
 * Returns codepoint-sorted id lists plus their counts, so two censuses compare by value.
 *
 * @param {unknown} settlement
 * @returns {{ npcIds: string[], memberIds: string[], npcCount: number, memberCount: number }}
 */
export function settlementNpcCensus(settlement) {
  const s = asObject(settlement);
  const npcs = Array.isArray(s.npcs) ? s.npcs : [];
  const npcIds = npcs.map((n) => text(asObject(n).id)).filter(Boolean).sort(compareCodepoint);
  /** @type {string[]} */
  const memberIds = [];
  const power = asObject(s.powerStructure);
  const factions = Array.isArray(power.factions) ? power.factions : [];
  for (const faction of factions) {
    const members = Array.isArray(asObject(faction).members) ? asObject(faction).members : [];
    for (const m of /** @type {unknown[]} */ (members)) {
      const id = text(asObject(m).id);
      if (id) memberIds.push(id);
    }
  }
  memberIds.sort(compareCodepoint);
  return { npcIds, memberIds, npcCount: npcIds.length, memberCount: memberIds.length };
}
