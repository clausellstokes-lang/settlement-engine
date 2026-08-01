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
 * W-H4 AMENDS THAT SENTENCE, AND THE AMENDMENT IS THE WHOLE POINT OF LAW 1. Since the
 * DM verbs landed there is exactly ONE function that can drop a soul out of the ledger
 * (removeNpcRecord) and exactly one that can put a dropped one back (restoreNpcRecord).
 * They serve the DM's KILL verb and its undo, and nothing else: law 1 says the ENGINE
 * kills no named character ever and that the DM's authority is total, so the removal
 * door is not a hole in law 6, it IS law 1. Every engine lane still moves people through
 * moveNpcRecord alone, and an anchored negative scans those lanes to prove none of them
 * has learned the removal symbol.
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
 *   tests/domain/npcDmVerbs.test.js,
 *   tests/property/npcLedgerDormancyGolden.test.js
 */

import { compareCodepoint } from '../deterministicSort.js';
import { getSpatialLedger, setSpatialLedger, dropSpatialLedger, hasSpatialLedger } from '../spatial/distanceRead.js';
import {
  NEUTRAL_REPUTATION_FACETS,
  VERDICT_CAUSES,
  COMPROMISE_SOURCES,
  EXCLUSION_KINDS,
  EDICT_EXCLUSION_KINDS,
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
  // W-H3, BOTH CONDITIONAL, BOTH DROP-WHEN-EMPTY. A roamer who is resting somewhere
  // carries a residency; a roamer who is on the road carries a transit leg. A record
  // that carries neither serializes EXACTLY as it did before H3 existed, which is what
  // keeps every H1/H2 round-trip pin measuring the same bytes it measured before.
  const residency = normalizeResidency(r.residency);
  if (residency) out.residency = residency;
  const transit = normalizeTransit(r.transit);
  if (transit) out.transit = transit;
  const dmTruth = normalizeDmTruth(r.dmTruth);
  if (dmTruth) out.dmTruth = dmTruth;
  return /** @type {RoamerRecord | PlacementRecord} */ (out);
}

/**
 * @typedef {Object} ResidencyRef
 * @property {string} settlementId  where this person is resting (design §6c)
 * @property {number} sinceTick
 * @property {number} untilTick     the tick the banded stay is due to end
 */

/**
 * Normalize a residency, or null when there is none to carry. A residency naming no
 * settlement is not a residency: the whole point of the record is WHERE somebody is,
 * so a nameless one would put a person nowhere while claiming they were somewhere.
 * @param {unknown} raw @returns {ResidencyRef | null}
 */
function normalizeResidency(raw) {
  const r = asObject(raw);
  const settlementId = text(r.settlementId);
  if (!settlementId) return null;
  const sinceTick = tickOf(r.sinceTick);
  // The stay never ends before it begins, whatever a garbled record claims.
  return { settlementId, sinceTick, untilTick: Math.max(sinceTick, tickOf(r.untilTick)) };
}

/**
 * @typedef {Object} TransitLeg
 * @property {string} fromId        the settlement left behind
 * @property {string} toId          the settlement being walked to
 * @property {number} departTick
 * @property {number} arrivalTick   the first tick the walker is THERE
 * @property {true} [hidden]        the leg runs on a hidden path (wanderers only)
 */

/**
 * Normalize a transit leg, or null when there is none. The armyTransit conditional
 * ledger pattern, applied to a person: a leg needs both ends, and a leg that arrives
 * before it departs is a leg that arrives on departure (never earlier), because the
 * alternative is a walker who is retroactively somewhere they never left for.
 * @param {unknown} raw @returns {TransitLeg | null}
 */
function normalizeTransit(raw) {
  const r = asObject(raw);
  const fromId = text(r.fromId);
  const toId = text(r.toId);
  if (!fromId || !toId || fromId === toId) return null;
  const departTick = tickOf(r.departTick);
  /** @type {Record<string, unknown>} */
  const leg = { fromId, toId, departTick, arrivalTick: Math.max(departTick, tickOf(r.arrivalTick)) };
  if (r.hidden === true) leg.hidden = true;
  return /** @type {TransitLeg} */ (leg);
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
export function isExcludedFrom(worldState, wnpcId, settlementId, tick, kinds = EXCLUSION_KINDS) {
  const target = String(settlementId);
  const allowed = Array.isArray(kinds) && kinds.length > 0 ? kinds : EXCLUSION_KINDS;
  for (const edge of exclusionsOf(worldState, wnpcId)) {
    if (edge.settlementId !== target) continue;
    if (!allowed.includes(edge.kind)) continue;
    if (exclusionActiveAt(edge, tick)) return true;
  }
  return false;
}

/**
 * The ACTIVE exclusion edges of given kinds against a durable identity, at `tick`.
 * The kind-aware read W-H3's second EXCLUSION_KIND made necessary: the candidate flow
 * wants every shut door, and a reader surface wants only the edicts, so neither may
 * hard-code a kind list of its own.
 * @param {{ spatialLedgers?: unknown } | null | undefined} worldState
 * @param {string} wnpcId @param {number} tick @param {ReadonlyArray<string>} kinds
 * @returns {ReadonlyArray<ExclusionEdge>}
 */
export function exclusionsOfKind(worldState, wnpcId, tick, kinds) {
  const allowed = Array.isArray(kinds) && kinds.length > 0 ? kinds : EXCLUSION_KINDS;
  return exclusionsOf(worldState, wnpcId).filter(
    (edge) => allowed.includes(edge.kind) && exclusionActiveAt(edge, tick),
  );
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
 * MINT ONE EXCLUSION EDGE against a durable identity (W-H2: the banishment door).
 *
 * The merge rule is normalizeExclusionEdges', not this function's: the new edge is
 * appended to whatever the ledger already holds and the normalizer decides which
 * survives, so a second banishment from the same town EXTENDS the sentence rather
 * than replacing it with a shorter one. Delegating rather than re-deciding is what
 * keeps the "stricter wins" rule single-writer.
 *
 * DORMANT ⇒ an immediate no-op returning the SAME worldState reference, so the
 * constitutional gate is a whole-entry-point early return here exactly as it is for
 * graduation. An edge naming no settlement, or an unknown durable id, is likewise a
 * no-op: an exclusion against nobody is not an exclusion.
 *
 * @param {Record<string, unknown>} worldState
 * @param {string} wnpcId
 * @param {{ settlementId?: unknown, kind?: unknown, untilTick?: unknown, indefinite?: unknown }} edge
 * @returns {{ worldState: Record<string, unknown>, changed: boolean }}
 */
export function addExclusionEdge(worldState, wnpcId, edge) {
  if (!npcConsequencesActive(worldState)) return { worldState, changed: false };
  const id = String(wnpcId == null ? '' : wnpcId);
  const target = String(asObject(edge).settlementId == null ? '' : asObject(edge).settlementId);
  if (!id || !target) return { worldState, changed: false };
  const ledger = npcLedgerOf(worldState);
  const priorEdges = ledger.exclusions[id] || [];
  const merged = normalizeExclusionEdges([...priorEdges, edge]);
  const nextExclusions = sortedRecords({ ...ledger.exclusions, [id]: merged });
  const next = setNpcLedger(worldState, { ...ledger, exclusions: nextExclusions });
  return { worldState: next, changed: next !== worldState };
}

/**
 * LIFT EXCLUSION EDGES against a durable identity (W-H4: the DM's mercy verb).
 *
 * The inverse of addExclusionEdge, and it lives HERE for the same reason the adder
 * does: the exclusions map has exactly one writer, so a pardon cannot invent a second
 * merge rule that disagrees with the "stricter wins" one above.
 *
 * SCOPE IS EXPLICIT AND NARROWING. `settlementId` absent means every door; present
 * means that door only. `kinds` defaults to the EDICT kinds rather than all of them,
 * because a pardon is an act against a LEGAL FACT: sweeping a rehost cooldown away as
 * a mercy would silently hand the pardoned person a free retry at every house that
 * refused them this tick, which is circulation bookkeeping the DM never asked to touch.
 * A caller that genuinely wants the cooldown cleared has to say so.
 *
 * DORMANT, an unknown id, or nothing to lift ⇒ the SAME worldState reference, so the
 * gate is a whole-entry-point early return exactly as it is for every sibling.
 *
 * @param {Record<string, unknown>} worldState
 * @param {string} wnpcId
 * @param {{ settlementId?: unknown, kinds?: ReadonlyArray<string> }} [scope]
 * @returns {{ worldState: Record<string, unknown>, changed: boolean, lifted: ReadonlyArray<ExclusionEdge> }}
 */
export function liftExclusionEdges(worldState, wnpcId, scope = {}) {
  if (!npcConsequencesActive(worldState)) return { worldState, changed: false, lifted: [] };
  const id = String(wnpcId == null ? '' : wnpcId);
  if (!id) return { worldState, changed: false, lifted: [] };
  const ledger = npcLedgerOf(worldState);
  const priorEdges = ledger.exclusions[id] || [];
  if (priorEdges.length === 0) return { worldState, changed: false, lifted: [] };
  const door = String(asObject(scope).settlementId == null ? '' : asObject(scope).settlementId);
  const kinds = Array.isArray(scope.kinds) && scope.kinds.length > 0
    ? scope.kinds.map(String)
    : EDICT_EXCLUSION_KINDS;
  const lifted = priorEdges.filter((edge) => (
    kinds.includes(edge.kind) && (door === '' || edge.settlementId === door)
  ));
  if (lifted.length === 0) return { worldState, changed: false, lifted: [] };
  const kept = priorEdges.filter((edge) => !lifted.includes(edge));
  const nextExclusions = { ...ledger.exclusions };
  // AN EMPTY EDGE LIST IS NOT A RECORD (the npcLedgerOf reading). Deleting rather than
  // writing `[]` is what lets a fully pardoned world drain back to a byte-identical
  // dormant one instead of keeping an empty husk that would defeat drop-when-empty.
  if (kept.length === 0) delete nextExclusions[id];
  else nextExclusions[id] = kept;
  const next = setNpcLedger(worldState, { ...ledger, exclusions: sortedRecords(nextExclusions) });
  return { worldState: next, changed: next !== worldState, lifted: Object.freeze(lifted) };
}

/**
 * REMOVE A DURABLE IDENTITY FROM THE LEDGER (W-H4: the DM's KILL verb, and NOTHING
 * ELSE).
 *
 * ── READ THIS BEFORE CALLING IT ─────────────────────────────────────────────────
 * This is the ONLY function in the estate that can drop a soul out of the world
 * ledger, and it exists to serve exactly one caller: the DM's explicit KILL verb
 * (design §7, law 1 NEVER-KILL / DM-SOVEREIGN). Law 6 CONSERVATION says an NPC is
 * never duplicated and never vanishes; law 1 says the ENGINE kills no named character,
 * ever, and that the DM's authority is total. The two compose exactly here: every
 * ENGINE path moves a record between two maps through moveNpcRecord and can never
 * reach this function, and the one path that removes a person is a DM pressing a
 * button and getting a receipt they can undo. No pulse kernel, no verdict, no
 * circulation flow, no residency pass may call this. That rule is not a convention:
 * it is pinned by an anchored negative that scans the engine lanes for this symbol.
 *
 * THE EXCLUSION EDGES GO WITH THEM. A banishment is an edict against a living person;
 * leaving edges behind would keep a dead name shutting doors, and would leave the
 * ledger holding an exclusions row for an id neither map knows — the one shape the
 * conservation reading at npcLedgerOf cannot repair.
 *
 * THE RECORD IS RETURNED, and that is the undo. This function keeps no tombstone (§3b
 * freezes the ledger at three maps), so the removed record IS the receipt: a caller
 * that wants to reverse a kill re-writes exactly what it was handed.
 *
 * DORMANT or an unknown id ⇒ the SAME worldState reference and a null record.
 *
 * @param {Record<string, unknown>} worldState
 * @param {string} wnpcId
 * @returns {{ worldState: Record<string, unknown>, changed: boolean,
 *   removed: (RoamerRecord|PlacementRecord|null), wasPlaced: boolean,
 *   exclusions: ReadonlyArray<ExclusionEdge> }}
 */
export function removeNpcRecord(worldState, wnpcId) {
  const none = { worldState, changed: false, removed: null, wasPlaced: false, exclusions: [] };
  if (!npcConsequencesActive(worldState)) return none;
  const id = String(wnpcId == null ? '' : wnpcId);
  if (!id) return none;
  const ledger = npcLedgerOf(worldState);
  const wasPlaced = Object.prototype.hasOwnProperty.call(ledger.placed, id);
  const wasRoaming = Object.prototype.hasOwnProperty.call(ledger.roamers, id);
  if (!wasPlaced && !wasRoaming) return none;
  const removed = wasPlaced ? ledger.placed[id] : ledger.roamers[id];
  const exclusions = ledger.exclusions[id] || [];
  const placed = { ...ledger.placed };
  const roamers = { ...ledger.roamers };
  const nextExclusions = { ...ledger.exclusions };
  delete placed[id];
  delete roamers[id];
  delete nextExclusions[id];
  const next = setNpcLedger(worldState, {
    placed: sortedRecords(placed),
    roamers: sortedRecords(roamers),
    exclusions: sortedRecords(nextExclusions),
  });
  return {
    worldState: next,
    changed: next !== worldState,
    removed,
    wasPlaced,
    exclusions: Object.freeze(exclusions),
  };
}

/**
 * RESTORE A REMOVED IDENTITY (W-H4: the undo half of KILL, and nothing else).
 *
 * Takes back exactly what removeNpcRecord handed out and puts it where it was. This is
 * NOT a second graduation door: it writes a record whose durable id was minted once,
 * long ago, by graduateNpc, so the one-way-door contract is untouched — an id that was
 * never minted cannot be conjured here, because the caller has to be holding the record
 * to pass it.
 *
 * ID COLLISION FAILS CLOSED. If something has taken the id back in the meantime, the
 * restore is refused rather than clobbering the living record: an undo that overwrote
 * somebody would be a worse outcome than an undo that declines.
 *
 * @param {Object} args
 * @param {Record<string, unknown>} args.worldState
 * @param {string} args.wnpcId
 * @param {unknown} args.record        the record removeNpcRecord returned
 * @param {boolean} args.wasPlaced
 * @param {ReadonlyArray<unknown>} [args.exclusions]  the edges it carried
 * @returns {{ worldState: Record<string, unknown>, changed: boolean, restored: boolean }}
 */
export function restoreNpcRecord({ worldState, wnpcId, record, wasPlaced, exclusions = [] }) {
  if (!npcConsequencesActive(worldState)) return { worldState, changed: false, restored: false };
  const id = String(wnpcId == null ? '' : wnpcId);
  if (!id || !record || typeof record !== 'object') return { worldState, changed: false, restored: false };
  const ledger = npcLedgerOf(worldState);
  if (
    Object.prototype.hasOwnProperty.call(ledger.placed, id)
    || Object.prototype.hasOwnProperty.call(ledger.roamers, id)
  ) {
    return { worldState, changed: false, restored: false };
  }
  const placed = { ...ledger.placed };
  const roamers = { ...ledger.roamers };
  const normalized = normalizeRecord(record, { placed: wasPlaced === true });
  if (wasPlaced === true) placed[id] = /** @type {PlacementRecord} */ (normalized);
  else roamers[id] = /** @type {RoamerRecord} */ (normalized);
  const edges = normalizeExclusionEdges(exclusions);
  const nextExclusions = { ...ledger.exclusions };
  if (edges.length > 0) nextExclusions[id] = edges;
  const next = setNpcLedger(worldState, {
    placed: sortedRecords(placed),
    roamers: sortedRecords(roamers),
    exclusions: sortedRecords(nextExclusions),
  });
  return { worldState: next, changed: next !== worldState, restored: true };
}

/**
 * THE ONE TRANSITION (law 6 CONSERVATION), single-writer.
 *
 * Every W-H3 movement of a soul is this call: a rehost that places a roamer, a
 * departure that returns a placed person to the pool, a residency stamp, a transit leg
 * opening or closing. All of them are "take the record out of whichever map holds it,
 * patch it, put it back into the map its new host implies" — so all of them are ONE
 * function rather than four hand-rolled map surgeries that could each drop a person in
 * a different way. The record is read through npcLedgerOf (already conservation-checked
 * at the read door) and written back through setNpcLedger (already drop-when-empty), so
 * a move can neither duplicate nor lose an identity by construction.
 *
 * `hostSettlementId`: a non-empty string ⇒ the record lands in `placed` under that
 * host; null or '' ⇒ it lands in `roamers`. `undefined` KEEPS the current map, which is
 * what a pure residency or transit patch wants.
 *
 * DORMANT, an unknown id, or a no-op patch ⇒ the SAME worldState reference.
 *
 * @param {Object} args
 * @param {Record<string, unknown>} args.worldState
 * @param {string} args.wnpcId
 * @param {string|null} [args.hostSettlementId]
 * @param {Record<string, unknown>} [args.patch] shallow fields merged onto the record
 * @param {number} [args.sinceTick] when set, restamps the record's state clock
 * @returns {{ worldState: Record<string, unknown>, changed: boolean, moved: boolean }}
 */
export function moveNpcRecord({ worldState, wnpcId, hostSettlementId, patch = {}, sinceTick }) {
  if (!npcConsequencesActive(worldState)) return { worldState, changed: false, moved: false };
  const id = String(wnpcId == null ? '' : wnpcId);
  const ledger = npcLedgerOf(worldState);
  const wasPlaced = Object.prototype.hasOwnProperty.call(ledger.placed, id);
  const wasRoaming = Object.prototype.hasOwnProperty.call(ledger.roamers, id);
  if (!wasPlaced && !wasRoaming) return { worldState, changed: false, moved: false };

  const current = /** @type {Record<string, unknown>} */ (
    /** @type {unknown} */ (wasPlaced ? ledger.placed[id] : ledger.roamers[id])
  );
  const host = hostSettlementId === undefined
    ? (wasPlaced ? text(current.hostSettlementId) : '')
    : text(hostSettlementId);
  const nextPlaced = host !== '';
  /** @type {Record<string, unknown>} */
  const merged = { ...current, ...asObject(patch), hostSettlementId: host };
  if (sinceTick !== undefined) merged.sinceTick = tickOf(sinceTick);
  const record = normalizeRecord(merged, { placed: nextPlaced });

  const placed = { ...ledger.placed };
  const roamers = { ...ledger.roamers };
  delete placed[id];
  delete roamers[id];
  if (nextPlaced) placed[id] = /** @type {PlacementRecord} */ (record);
  else roamers[id] = /** @type {RoamerRecord} */ (record);
  const next = setNpcLedger(worldState, {
    ...ledger,
    placed: sortedRecords(placed),
    roamers: sortedRecords(roamers),
  });
  return { worldState: next, changed: next !== worldState, moved: nextPlaced !== wasPlaced };
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
 * BOTH FACTION HOMES ARE WALKED, and the second one is a W-H2 repair rather than a
 * widening. H1 walked `powerStructure.factions[]` only, which is the POWER roster:
 * rulingStructure mints those records as `{ faction, power, category }` and NO writer
 * in src ever puts members on them. The pipeline's member lists live on
 * `settlement.factions[]`, which factionGrouping builds by pushing the very npc
 * references into `members` (generateSettlementPipeline.js, relinked by
 * relinkFactionMembers). Against real pipeline output the H1 census therefore reported
 * memberCount 0 and its alias-home arm was VACUOUS; only its hand-built fixture,
 * which put members under powerStructure, made it look alive. Walking both homes is
 * what the alias trap actually requires, and it is the same both-homes rule
 * factionRename.js enforces for its own cascade.
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
  const factionLists = [asObject(s.powerStructure).factions, s.factions];
  for (const list of factionLists) {
    for (const faction of Array.isArray(list) ? list : []) {
      const members = Array.isArray(asObject(faction).members) ? asObject(faction).members : [];
      for (const m of /** @type {unknown[]} */ (members)) {
        const id = text(asObject(m).id);
        if (id) memberIds.push(id);
      }
    }
  }
  memberIds.sort(compareCodepoint);
  return { npcIds, memberIds, npcCount: npcIds.length, memberCount: memberIds.length };
}
